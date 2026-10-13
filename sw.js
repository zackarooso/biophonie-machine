// La Machine a Biophonie - keeps its own copy on the device. Change VERSION whenever index.html changes.
const VERSION = 'biophonie-v27-6';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // the mailer goes straight to the network
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => hit || (r.mode === 'navigate' ? caches.match('./index.html') : null)).then((hit) => hit || fetch(r)));
});
