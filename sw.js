const CACHE = 'islamic-insights-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/islamic-app.html',
  '/about.html',
  '/history.html',
  '/muharram.html',
  '/news.html',
  '/poetry.html',
  '/raising-faith.html',
  '/religion.html',
  '/series.html',
  '/books.html',
  '/manifest.json',
  '/style.css',
  '/css/app.css',
  '/js/app.js',
  '/js/quran.js',
  '/js/nahj.js',
  '/js/prayer.js',
  '/js/qibla.js',
  '/js/hadith.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(err => console.log('Cache err:', err)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
