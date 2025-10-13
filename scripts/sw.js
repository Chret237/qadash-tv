const CACHE_NAME = "qadash-tv-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/images/logo_qadash.jpg",
  "/images/shofar_blanc.png",
];

// Installation (mise en cache initiale)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activation (nettoyage des anciens caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
});

// Stratégie : Cache falling back to Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
