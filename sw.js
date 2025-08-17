const CACHE_NAME = 'tchAI-cache-v1';
const urlsToCache = [
  './index.html',
  './styles.css',
  './app.js'
  // add other assets you want cached
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Get all cache keys
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match the CACHE_NAME
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Once all old cache have been updated and deleted, claim clients immediately
      return self.clients.claim();
    })
  );
});

// Optional: Notify clients about update
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});