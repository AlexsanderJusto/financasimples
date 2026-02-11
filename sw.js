
// Service worker disabled to resolve caching issues
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  // Always fetch from network
  event.respondWith(fetch(event.request));
});
