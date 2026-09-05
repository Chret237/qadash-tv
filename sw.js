const CACHE_NAME = "qadash-tv-" + new Date().toISOString().slice(0, 10);

const urlsToCache = [
  "./",
  "./index.html",
  "./pages/livres.html",
  "./pages/documentaires.html",
  "./pages/animations.html",
  "./pages/enseignements.html",
  "./styles.css",
  "./main.js",
  "./scripts/app.js",
  "./scripts/translate.js",
  "./images/logo_qadash.jpg",
  "./images/Qadash new logo-02.png",
];

// Installation – mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("Service Worker installé !");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // active immédiatement la nouvelle version
});

// Activation – nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  console.log("Activation du nouveau Service Worker !");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Suppression de l’ancien cache :", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // active immédiatement sur les pages ouvertes
});

// Fetch – stratégie : Network First, fallback cache
self.addEventListener("fetch", (event) => {
  // On ignore les requêtes externes (ex: Google Fonts, OneSignal…)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Bypass service worker for range requests and video resources to avoid
  // interfering with streaming/partial responses (206)
  try {
    const rangeHeader = event.request.headers.get('range');
    if (rangeHeader) {
      event.respondWith(fetch(event.request));
      return;
    }
    if (event.request.destination === 'video') {
      event.respondWith(fetch(event.request));
      return;
    }
  } catch (e) {
    // if headers are not accessible for any reason, fall through to normal handling
    console.warn('SW: error checking request headers/destination', e);
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful full responses (status 200)
        try {
          if (response && response.ok && response.status === 200) {
            const cloned = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, cloned))
              .catch((err) => {
                // don't break the response if cache.put fails
                console.warn('Cache put failed:', err);
              });
          } else {
            // skip caching partial (206) or other responses
            // useful to avoid "Partial response (status code 206) is unsupported"
          }
        } catch (e) {
          console.warn('Error handling cache for', event.request.url, e);
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // si offline → version cache
  );
});
