"use client";

import { useEffect, useState, useCallback } from "react";

export type PushState =
  | "loading"
  | "unsupported"
  | "not-installed"
  | "default"
  | "subscribed"
  | "denied";

function base64ToUint8Array(base64: string): Uint8Array {
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad)/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function usePushSubscription() {
  const [pushState, setPushState] = useState<PushState>("loading");

  useEffect(() => {
    async function detect() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setPushState("unsupported");
        return;
      }

      if (isIosSafari() && !isStandalone()) {
        setPushState("not-installed");
        return;
      }

      if ("Notification" in window && Notification.permission === "denied") {
        setPushState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      setPushState(existing ? "subscribed" : "default");
    }

    detect();
  }, []);

  const subscribe = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const res = await fetch("/api/vapid-public-key");
      const vapidPublicKey = await res.text();

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setPushState("subscribed");
    } catch (err) {
      console.error("Subscribe failed:", err);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      setPushState("default");
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    }
  }, []);

  return { pushState, subscribe, unsubscribe };
}
