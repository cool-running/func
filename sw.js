const CACHE = 'sonhae-202608030115';
const ASSETS = ['./', './index.html', './cover_card.html', './camera.html', './location.html', './area.html', './settings.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return; // 외부(카카오 SDK, vworld, 구글 폰트 등)는 그대로 네트워크로
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
