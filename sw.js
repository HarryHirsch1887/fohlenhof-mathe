// Service Worker für Rechenhof (früher Pferdehof Mathe): macht die App offline nutzbar.
// Strategie: erst Netzwerk (damit Änderungen sofort ankommen), bei fehlender Verbindung aus dem Zwischenspeicher.
// Wenn sich die Dateiliste ändert, bitte VERSION erhöhen.
const VERSION='fohlenhof-v46';
const FILES=['./','index.html','style.css','aufgaben.js','pferd.js','hof.js','figur.js','zeichnung.js','qr.js','training.js','pflege.js','menue.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 // Die Stil-Studie (Ordner studie/) gehört nicht zur App und wird nicht offline gespeichert
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin||new URL(e.request.url).pathname.includes('/studie/'))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
