"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "varsler-last-seen";

function getLastSeen(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STORAGE_KEY) ?? "0");
}

export function markVarslerSeen(latestMessageTime: number) {
  if (latestMessageTime <= 0) return;
  localStorage.setItem(STORAGE_KEY, String(latestMessageTime));
  window.dispatchEvent(new Event("varsler-seen"));
}

export function useUnreadVarsler(): boolean {
  const [hasUnread, setHasUnread] = useState(false);

  const check = useCallback(() => {
    fetch("/api/push/messages")
      .then((res) => (res.ok ? res.json() : []))
      .then((messages: { time: number }[]) => {
        if (messages.length === 0) {
          setHasUnread(false);
          return;
        }
        setHasUnread(messages[0].time > getLastSeen());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    check();

    function onVisible() {
      if (document.visibilityState === "visible") check();
    }
    function onSeen() {
      setHasUnread(false);
    }

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("varsler-seen", onSeen);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("varsler-seen", onSeen);
    };
  }, [check]);

  return hasUnread;
}
