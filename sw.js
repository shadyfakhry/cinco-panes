const CACHE = 'cinco-panes-v2';
const ASSETS = [
  '/cinco-panes/',
  '/cinco-panes/index.html',
  '/cinco-panes/manifest.json',
  '/cinco-panes/icons/icon-192.png',
  '/cinco-panes/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
