const CACHE_NAME = "o-landsleir-v2";
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
    data = { message: event.data.text() };
  }

  const message = data.message || data;
  const title = message.title || data.title || "O-landsleir 2026";
  const body = message.message || message.body || data.body || "";
  const id = message.id || data.id || "ntfy";
  const clickUrl = message.click || data.click || "/varsler";

  const options = {
    body: body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: id,
    data: { url: clickUrl },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/varsler";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
