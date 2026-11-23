// Döner Kasa v2 — çevrimdışı açılış için önbellek
const C='donerkasa-v5';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./'])).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  const own = u.origin===location.origin, sdk = u.hostname==='www.gstatic.com' && u.pathname.indexOf('/firebasejs/')===0;
  if(!own && !sdk) return; // Firebase veri trafiğine dokunma
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return r; })
    .catch(()=>caches.match(e.request).then(r=>r||(own?caches.match('./'):undefined))));
});
