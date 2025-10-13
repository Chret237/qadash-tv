const CACHE_NAME = "qadash-tv-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/images/logo_qadash.jpg",
  "/images/shofar_blanc.png",
];

// Installation – mise en cache initiale
self.addEventListener("install", event => {
  console.log("🔧 Service Worker installé !");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // active immédiatement la nouvelle version
});

// Activation – nettoyage des anciens caches
self.addEventListener("activate", event => {
  console.log("🚀 Activation du nouveau Service Worker !");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log("🧹 Suppression de l’ancien cache :", key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // ⚡ active immédiatement sur les pages ouvertes
});

// Fetch – stratégie : Network First, fallback cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // met à jour le cache
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        return response;
      })
      .catch(() => caches.match(event.request)) // si offline → version cache
  );
});
