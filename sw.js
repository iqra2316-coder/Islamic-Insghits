const CACHE = 'islamic-insights-v3';
const STATIC = ['/', '/index.html', '/quran.html', '/namaz.html', '/duas.html',
  '/ziyarat.html', '/nahj.html', '/hadith.html', '/history.html', '/qibla.html',
  '/donate.html', '/about.html', '/css/main.css', '/js/shared.js', '/js/ga.js',
  '/js/prayer.js', '/js/hadith.js', '/js/nahj.js', '/js/qibla.js'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.alquran') || e.request.url.includes('cdn.islamic') || e.request.url.includes('googletagmanager')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const rc = res.clone(); caches.open(CACHE).then(c=>c.put(e.request,rc)); return res; })));
});
