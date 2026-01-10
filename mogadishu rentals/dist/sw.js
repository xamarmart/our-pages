const CACHE_NAME = 'offline-styles-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isStyle = req.destination === 'style' || req.url.endsWith('.css');
  if (!isStyle) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const resp = await fetch(req).catch(() => undefined);
      if (resp && resp.status === 200) cache.put(req, resp.clone());
      return resp || new Response('', { status: 504 });
    })
  );
});