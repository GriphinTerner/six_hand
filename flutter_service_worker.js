// One-release migration worker. Existing Flutter PWA installs will fetch this
// script, discard their obsolete cache, and then unregister themselves.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister()),
  );
});
