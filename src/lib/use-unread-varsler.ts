"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "varsler-last-seen";

function getLastSeen(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STORAGE_KEY) ?? "0");
}

export function markVarslerSeen() {
  localStorage.setItem(STORAGE_KEY, String(Math.floor(Date.now() / 1000)));
}

async function fetchHasUnread(): Promise<boolean> {
  const res = await fetch("/api/push/messages");
  if (!res.ok) return false;
  const messages: { time: number }[] = await res.json();
  if (messages.length === 0) return false;
  return messages[0].time > getLastSeen();
}

export function useUnreadVarsler(): boolean {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchHasUnread().then((unread) => {
      if (!cancelled) setHasUnread(unread);
    });

    function onVisible() {
      if (document.visibilityState === "visible") {
        fetchHasUnread().then((unread) => {
          if (!cancelled) setHasUnread(unread);
        });
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return hasUnread;
}
