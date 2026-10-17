// HaulLog offline cache. Bump VERSION when you replace index.html so phones pick up the new copy.
const VERSION="haullog-v34",FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
// Open instantly from the cache, refresh the cache quietly when there is a connection.
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 // access.json (the list of approved Google accounts) must always come fresh from the network, never from the cache.
 if(new URL(e.request.url).pathname.endsWith("/access.json"))return;
 e.respondWith(caches.open(VERSION).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin)c.put(e.request,r.clone());return r}).catch(()=>hit||c.match("index.html"));
  return hit||net})))});
