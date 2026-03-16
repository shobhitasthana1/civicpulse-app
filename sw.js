const CACHE_NAME = "civicpulse-v1";

self.addEventListener("install", event => {
  console.log("Service Worker Installed");

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});