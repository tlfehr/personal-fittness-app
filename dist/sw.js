/**
 * Service Worker für PWA
 * Cacht alle Assets + ermöglicht Offline-Betrieb
 */

const CACHE_NAME = "fitness-app-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Install: Cache assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const cache_copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cache_copy);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache on network error
        return caches
          .match(event.request)
          .then((response) => {
            return response || new Response("Offline - please check your connection");
          });
      })
  );
});
