/* Lady Colts Live: keeps the app on the iPad so it opens with no internet.
   Change VERSION when the app is updated. */
const VERSION='lc-live-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const nav=r.mode==='navigate';
  e.respondWith(caches.open(VERSION).then(async c=>{
    const hit=await c.match(nav?'./index.html':r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&res.ok&&new URL(r.url).origin===location.origin)c.put(nav?'./index.html':r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||new Response('Offline',{status:503});
  }));
});
