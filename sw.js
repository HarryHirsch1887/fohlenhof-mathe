// Service Worker für Pferdehof Mathe: macht die App offline nutzbar.
// Strategie: erst Netzwerk (damit Änderungen sofort ankommen), bei fehlender Verbindung aus dem Zwischenspeicher.
// Wenn sich die Dateiliste ändert, bitte VERSION erhöhen.
const VERSION='fohlenhof-v4';
const FILES=['./','index.html','style.css','aufgaben.js','hof.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
