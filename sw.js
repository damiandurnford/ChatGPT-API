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
  event.waitUntil(self.clients.claim());
});