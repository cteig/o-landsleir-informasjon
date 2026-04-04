"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

let currentTheme: Theme =
  typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Theme) || "light" : "light";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "light";
}

function setStoredTheme(next: Theme) {
  currentTheme = next;
  localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((cb) => cb());
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setStoredTheme(next);
    applyTheme(next);
  }

  return { theme, toggle };
}
