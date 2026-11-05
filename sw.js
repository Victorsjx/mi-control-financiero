const CACHE="mi-finanzas-v7";
const ASSETS=["./","./index.html","./styles.css?v=7","./app.js?v=7","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==location.origin)return;
  const request=event.request;
  event.respondWith((async()=>{
    try{
      const fresh=await fetch(request,{cache:"no-store"});
      if(fresh&&fresh.ok){const cache=await caches.open(CACHE);cache.put(request,fresh.clone());}
      return fresh;
    }catch(error){
      const cached=await caches.match(request);
      if(cached)return cached;
      if(request.mode==="navigate")return caches.match("./index.html");
      return new Response("Sin conexión",{status:503,statusText:"Offline"});
    }
  })());
});
