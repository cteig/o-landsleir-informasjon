const CACHE_NAME = "o-landsleir-v3";
const SHEETS_CACHE = "o-landsleir-sheets-v1";
const URLS_TO_CACHE = ["/"];
const SHEETS_ORIGIN = "docs.google.com";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const keepCaches = new Set([CACHE_NAME, SHEETS_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !keepCaches.has(key)).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and Next.js dev/internal requests
  if (event.request.method !== "GET") return;
  if (url.pathname.startsWith("/_next/")) return;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;

  const isSheets = url.hostname === SHEETS_ORIGIN;
  const cacheName = isSheets ? SHEETS_CACHE : CACHE_NAME;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "O-landsleir 2026", body: event.data.text() };
  }

  const title = data.title || "O-landsleir 2026";
  const body = data.body || "";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow("/varsler");
    }),
  );
});
