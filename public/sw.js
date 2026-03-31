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
