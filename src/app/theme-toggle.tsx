"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

let currentTheme: Theme =
  typeof window !== "undefined"
    ? (localStorage.getItem(STORAGE_KEY) as Theme) || "system"
    : "system";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "system";
}

function setStoredTheme(next: Theme) {
  currentTheme = next;
  localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((cb) => cb());
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (currentTheme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function cycle() {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setStoredTheme(next);
    applyTheme(next);
  }

  const label = { light: "☀️", dark: "🌙", system: "💻" }[theme];

  return (
    <button
      onClick={cycle}
      aria-label={`Tema: ${theme}. Trykk for å bytte.`}
      className="bg-card border-border hover:border-border-hover inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border text-lg shadow-sm transition-all hover:shadow-md active:scale-95"
    >
      {label}
    </button>
  );
}
