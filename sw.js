// La Machine a Biophonie - keeps its own copy on the device. Change VERSION whenever index.html changes.
const VERSION = 'biophonie-v27-17';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
// v27.12: always fetch fresh files from the site when saving a new version (never a stale browser-cached copy)
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => Promise.all(FILES.map((f) => fetch(new Request(f, { cache: 'reload' })).then((r) => { if (!r.ok) throw new Error(f + ' ' + r.status); return c.put(f, r); })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // the mailer goes straight to the network
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => hit || (r.mode === 'navigate' ? caches.match('./index.html') : null)).then((hit) => hit || fetch(r)));
});
