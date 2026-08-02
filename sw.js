const CACHE = 'sonhae-202608031600';
const ASSETS = ['./', './index.html', './cover_card.html', './camera.html', './location.html', './area.html', './settings.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return; // 외부(카카오 SDK, vworld, 구글 폰트 등)는 그대로 네트워크로

  const isHTML = e.request.mode === 'navigate' || (e.request.headers.get('accept')||'').includes('text/html');
  if(isHTML){
    // HTML 페이지는 네트워크 우선: 항상 최신 파일을 받아오고, 오프라인일 때만 캐시로 대체.
    // 이렇게 해두면 앞으로 파일을 새로 올릴 때마다 CACHE 버전을 손으로 안 올려도 바로 반영된다.
    e.respondWith(
      fetch(e.request).then(res=>{
        const resClone = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, resClone));
        return res;
      }).catch(()=> caches.match(e.request))
    );
    return;
  }

  // 나머지 정적 파일(아이콘 등)은 기존처럼 캐시 우선 (빠르고, 자주 안 바뀜)
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
