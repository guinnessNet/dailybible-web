// Self-destructing service worker.
// dailybible.kr was previously a PWA (vite-plugin-pwa) that registered /sw.js and
// cached the whole Bible reader app with a CacheFirst strategy. The site is now a
// static onboarding landing page. Returning visitors' browsers still have the old
// service worker active and keep serving the cached old app. This replacement SW
// clears all caches, unregisters itself, and reloads open pages so everyone gets
// the fresh landing page. The browser fetches this script directly from the network
// during its periodic SW update check (bypassing the old SW's fetch handler), so it
// reliably supersedes the old worker.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      try { client.navigate(client.url); } catch (e) {}
    }
  })());
});
