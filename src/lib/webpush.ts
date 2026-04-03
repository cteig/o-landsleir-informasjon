import { NTFY_SERVER, NTFY_TOPIC } from "./ntfy";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_NTFY_WEB_PUSH_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64url = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64url);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    VAPID_PUBLIC_KEY.length > 0
  );
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribeWebPush(): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
  });

  const p256dh = subscription.getKey("p256dh");
  const auth = subscription.getKey("auth");

  if (!p256dh || !auth) {
    throw new Error("Push subscription missing encryption keys");
  }

  const res = await fetch(`${NTFY_SERVER}/v1/webpush`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      p256dh: arrayBufferToBase64(p256dh),
      auth: arrayBufferToBase64(auth),
      topics: [NTFY_TOPIC],
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to register web push with ntfy: ${res.status}`);
  }

  return subscription;
}

export async function unsubscribeWebPush(): Promise<void> {
  const subscription = await getExistingSubscription();
  if (!subscription) return;

  const p256dh = subscription.getKey("p256dh");
  const auth = subscription.getKey("auth");

  if (p256dh && auth) {
    await fetch(`${NTFY_SERVER}/v1/webpush`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(p256dh),
        auth: arrayBufferToBase64(auth),
        topics: [NTFY_TOPIC],
      }),
    }).catch(() => {});
  }

  await subscription.unsubscribe();
}
