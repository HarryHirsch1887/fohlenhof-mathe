// Rechenhof – Mathe mit Pferd (seit 2026-10-26, vorher Pferdehof Mathe, davor Fohlenhof Mathe): Spiellogik, Oberfläche und Speicher (benötigt aufgaben.js)
// APPNAME: angezeigter Name, SPRUCH: Werbespruch unter dem Namen
// Nur der angezeigte Name hat sich geändert. Adresse, Repository und Speicherschlüssel heißen weiter "fohlenhof".
const BD=[['a','Erster Schritt',k=>k.total>=1],['b','Serie von 5',k=>k.best>=5],['c','Serie von 10',k=>k.best>=10],['d','Fehlerfreie Runde',k=>k.perfect>0],['e','100 richtig',k=>k.r>=100],['f','Auf Stufe 5',k=>Object.values(k.t).some(x=>x.d==5)]];
// Fellfarben: [Name, Fell, Mähne, Schecke (1 = weiße Flecken), dunkle Beine und Aalstrich (Farbe)]
const COATS={fuchs:['Fuchs','#b5612b','#6e3414'],braun:['Brauner','#7b4a2a','#1c1410'],rappe:['Rappe','#2b2b30','#111114'],schimmel:['Schimmel','#e8eaec','#b9bec4'],palomino:['Palomino','#dfb25f','#f7f0df'],schecke:['Schecke','#b5612b','#e6d3a6',1],
 falbe:['Falbe','#cfae7c','#4a3b31',0,'#3b2f28'],wind:['Windfarben','#2b2628','#ece2c8']};
// Wachstumsstufen: x = Erfahrung ab, s = Größe in der Szene, rx/ry = Körper, h = Kopfgröße, l = sichtbare Beinlänge
const GS=[{n:'Fohlen',x:0,s:.72,rx:33,ry:17,h:1.05,l:66,w:5.5,nk:.45},{n:'Jährling',x:250,s:.8,rx:42,ry:21,h:1.0,l:58,w:7.5,nk:.7},{n:'Jungpferd',x:700,s:.9,rx:50,ry:24,h:.97,l:51,w:9,nk:.88},{n:'Pferd',x:1500,s:1,rx:58,ry:28,h:.95,l:46,w:10,nk:1}];
// Stufe als Beschriftung mit Zahl, z. B. "Jährling 2/4" (seit 2026-10-26, Brain Dump). In Sätzen ("wenn Roy ein Jährling ist") bleibt GS[st].n.
const stufeN=st=>`${GS[st].n} ${st+1}/${GS.length}`;
// Wachstum über Tage mit Mathe (seit 2026-10-16): Ein Tag zählt, wenn an ihm mindestens eine Runde fertig gerechnet wurde (höchstens einmal pro Tag).
// Jährling nach 3 Tagen, Jungpferd nach weiteren 5, Pferd nach weiteren 10. Fallen Tage aus, bleiben die gesammelten Tage erhalten.
// x (Erfahrung) wird nur noch für alte Spielstände gebraucht: Sie behalten ihre bisher erreichte Stufe. Erfahrung schaltet künftig Extras frei.
const TAGE=[3,5,10],D3AB=2;// D3AB: 3D-Fenster ab Jungpferd
// Tageslimit: standardmäßig 30 Minuten pro Kind und Kalendertag, in der Eltern-Ansicht je Kind änderbar (siehe limS). Eine laufende Runde wird nicht unterbrochen.
const LIMIT=30*60;// seit 2026-10-18 30 Minuten (vorher 20)
const LIMIN=LIMIT/60;
// Seit 2026-10-21 stellen Eltern das Tageslimit je Kind im 5-Minuten-Raster ein (k.lm in Minuten, 0 = kein Limit). Ohne Eintrag gilt der Standard LIMIT.
const LIMMAX=180,limS=k=>k.lm==null?LIMIT:k.lm*60,limM=k=>limS(k)/60;
// Hof-Sperre: Nach der Hofzeit (Standard 3 Minuten) auf dem Hof (Kind-Ansicht, Wunschbaum, Rundflug) läuft ein Countdown von 10 Sekunden,
// danach muss erst wieder eine Runde mit mindestens FREI von 10 geschafft werden. Gespeichert: hz = Hofzeit in Sekunden, hl = gesperrt
const HOFZEIT=180,FREI=7;// FREI: seit 2026-10-18 reichen 7 von 10 (vorher 8)
// Hofzeit je Kind (seit 2026-10-27, Brain Dump): Eltern stellen sie wie das Tageslimit ein, k.hm in Minuten aus HOFM. Ohne Eintrag gilt HOFZEIT.
const HOFM=[3,4,5,6,7,8,9,10,15,20,25,30],HOFMAX=HOFM[HOFM.length-1]*60,hofS=k=>HOFM.includes(k.hm)?k.hm*60:HOFZEIT,hofM=k=>hofS(k)/60;
// PIN-Sperre (seit 2026-10-24): nach PINMAX falschen PIN-Eingaben PINSPERRE Millisekunden gesperrt (hier oben, weil clean() sie beim Laden braucht)
const PINMAX=3,PINSPERRE=36e5;
// Neue Kinder erstellen zuerst ihre Figur (figur.js) und dürfen nach 5 richtigen Aufgaben ihr Fohlen aussuchen
const FOHLEN=5;
// Körperformen (BR): seit 2026-10-19 nicht mehr wählbar oder kaufbar. Sie dienen nur noch den Lieblingspferden (Pony, Behang) und dem Zeichnen.
// Die Pferderasse eines Pferds steht allein in der Fellfarbe (COATS).
const BR={std:{n:'Warmblut',rx:1,ry:1,l:1,nk:1,mw:1,tl:1,h:1,fe:0},hafl:{n:'Haflinger',mc:'#f0deb0',rx:1.04,ry:1.08,l:.9,nk:1.12,mw:1.5,tl:1.15,h:1,fe:0},isl:{n:'Isländer',rx:1,ry:1.08,l:.8,nk:1.15,mw:1.9,tl:1.35,h:1,fe:0},voll:{n:'Vollblut',rx:1.06,ry:.9,l:1.1,nk:.85,mw:.6,tl:.9,h:.93,fe:0},fries:{n:'Friese',rx:1.05,ry:1.05,l:1,nk:1.2,mw:1.9,tl:1.4,h:1,fe:1}};
// Mähne und Zöpfe: Mähnenlänge ab Jährling kostenlos. Zöpfe (mit rosa Gummi) und weitere Gummifarben kosten Äpfel.
// Gespeichert am Pferd: ma = Mähnenlänge, zk = Zöpfe gekauft, zo = Zöpfe an, gu = Gummifarbe, gus = gekaufte Gummifarben
const MA={kurz:'Kurz',mittel:'Mittel',lang:'Lang'};
const GUMMI={rosa:['Rosa','#e8508f'],lila:['Lila','#9b59b6'],blau:['Hellblau','#4aa3df'],gelb:['Gelb','#f4c430'],weiss:['Weiß','#f2f2f2']};
// lieb: Preis eines Lieblingspferds (50, bestätigt 2026-10-21; die Preise insgesamt werden später noch neu gedacht).
// leg/shirt: je weitere Farbe für Reitleggings bzw. Reitshirt der Figur (10, bestätigt 2026-10-21)
const PREIS={zopf:10,gummi:3,lieb:50,leg:10,shirt:10};
// GLMAX: höchstens so viele gelöste Aufgaben merken (k.gl, fürs Training). Muss vor clean() stehen, das beim Start den Spielstand prüft.
const GLMAX=80;
// Schulstoff-Themen aller Klassen: nur diese kommen ins Training (Olympiade, Knobeln und Sudoku haben oft lange Texte)
const SCHUL=new Set(KL.flatMap(g=>KAT[g].schul));
// Reitausrüstung und Pflege (seit 2026-10-22): je Pferd gekauft (H.au). Sattel mit Sattelgurt, Satteldecke und Trense braucht das Anreiten (training.js).
// Die Pferdedecke trägt das Pferd auf dem eigenen Hof bei Regen, Schnee und nachts. Pflegekiste, Halfter (seit 2026-10-25, Brain Dump) und Führstrick braucht man zum Putzen (pflege.js), Halfter und Führstrick sind auch beim Führen zu sehen.
// [id, Name, Preis (vorläufig), Beschreibung]
const AUSR=[['sattel','Sattel mit Sattelgurt',30,'Zum Anreiten und Reiten'],['decke','Satteldecke',10,'Liegt unter dem Sattel'],['trense','Trense',20,'Zaumzeug mit Gebiss und Zügeln'],
 ['pdecke','Pferdedecke',15,'Hält warm bei Regen, Schnee und in der Nacht'],['pflege','Pflegekiste',20,'Huf-Auskratzer, Bürste, Striegel, Schwamm und Schweißabzieher'],
 ['halfter','Halfter',10,'Daran wird der Führstrick eingehakt'],['strick','Führstrick',10,'Zum Führen, Putzen und für den Tierarzt']];
const reitfertig=H=>!!(H&&H.au&&H.au.sattel&&H.au.decke&&H.au.trense);
// Kleine Bilder der Ausrüstung im Wunschbaum
const AUBILD={sattel:'<path d="M5 14Q8 6 13 12Q20 15 27 12Q31 5 35 13L32 20Q20 23 8 20Z" fill="#6b3e1f" stroke="#3b2414"/><path d="M16 20h8l1 8h-10z" fill="#7d4a26" stroke="#3b2414"/>',
 decke:'<path d="M4 9Q20 14 36 9L35 25Q20 29 5 25Z" fill="#2c3f68" stroke="#1b2740"/><path d="M5 23Q20 27 35 23" fill="none" stroke="#f1e4c8" stroke-width="1.5"/>',
 trense:'<path d="M9 5L17 25M14 12Q24 9 33 17M7 9Q9 5 13 5" fill="none" stroke="#3b2414" stroke-width="2.4" stroke-linecap="round"/><circle cx="27" cy="22" r="3" fill="none" stroke="#9aa0a6" stroke-width="1.5"/>',
 pdecke:'<path d="M3 8Q20 3 37 8L36 24Q20 28 4 24Z" fill="#b0412f" stroke="#7a2a1e"/><path d="M4 12H36M4 18H36" stroke="#e2b24a" stroke-width="1.4"/>',
 pflege:'<rect x="5" y="12" width="30" height="14" rx="2" fill="#4a90c2" stroke="#2c5f86"/><path d="M12 12V8h16v4" fill="none" stroke="#2c5f86" stroke-width="2"/><rect x="9" y="5" width="9" height="5" rx="1" fill="#8b5a2b"/><path d="M10 5v-3M13 5v-3M16 5v-3" stroke="#3b2414"/>',
 halfter:'<path d="M9 7Q6 17 13 23Q22 27 31 21Q35 14 29 8Q20 3 9 7Z" fill="none" stroke="#1f6fb2" stroke-width="2.6" stroke-linejoin="round"/><path d="M13 23L24 13M9 7L4 3" stroke="#1f6fb2" stroke-width="2.6" stroke-linecap="round"/><circle cx="13" cy="23" r="2.6" fill="#fff" stroke="#9aa0a6" stroke-width="1.4"/>',
 strick:'<path d="M8 22Q4 14 12 10Q22 6 26 14Q29 21 21 23Q14 24 15 17Q16 12 22 13" fill="none" stroke="#c0392b" stroke-width="2.4" stroke-linecap="round"/><path d="M26 14L33 8" stroke="#c0392b" stroke-width="2.4" stroke-linecap="round"/><path d="M32 9l2.2 -3l2.6 1.8l-2 3Z" fill="#9aa0a6" stroke="#5a5f66" stroke-width=".6"/>'};
const ausrBild=id=>`<svg viewBox="0 0 40 30" width="56" height="42" aria-hidden="true">${AUBILD[id]||''}</svg>`;
// Freischaltung über Erfahrung (seit 2026-10-19): Gesperrtes bleibt sichtbar mit "ab X Erfahrung".
// Was ein Kind schon besitzt, bleibt immer nutzbar. Äpfel bezahlen, Erfahrung schaltet frei.
// ma = Mähnenlänge, coat = Pferderassen (Fellfarben) und abz = Blesse und Socken, shirt/leg = Farben der Figur, it = Hof-Gegenstände,
// zopf = Zöpfe und Haargummis, lieb = Lieblingspferde. Die Koppeln stehen in KOPPEL.
// Das Training hängt seit 2026-10-22 am Alter des Pferds (training.js), nicht mehr an der Erfahrung (früher sk ab 5000).
const XPF={ma:250,coat:500,abz:500,shirt:750,leg:750,it:500,zopf:3500,lieb:6500};
// Hof-Gegenstände je nach Erfahrung (seit 2026-10-24, vorher alle ab 1000). XPF.it = 500 ist die erste Stufe.
// ausbau = Ausbau des Unterstands zum Stall, stall = die rote Scheune
const ITXP={blumen:500,mohn:500,lavendel:500,heu:500,baum1:750,baum2:750,troge:750,teich:750,unterstand:750,stall:1000,windrad:1000,regenbogen:1000,ausbau:1250};
const itZu=(k,id,hat)=>!hat&&k.xp<(ITXP[id]||XPF.it);
// Text auf einer gesperrten Karte: wie viel Erfahrung noch fehlt
const itNoch=(k,id)=>`noch ${(ITXP[id]||XPF.it)-k.xp} Erfahrung`;
const ab=t=>`ab ${XPF[t]} Erfahrung`;
// Fortschritt bis zur Freischaltung (seit 2026-10-21): Balken mit "1250 von 3500 Erfahrung" statt "ab 3500 Erfahrung"
const xpBalken=(k,n,kl)=>{const x=Math.min(k.xp,n);return`<span class="xpb${kl?' '+kl:''}" role="progressbar" aria-label="Erfahrung" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${x}"><i style="width:${Math.floor(x/n*100)}%"></i><span>${x} von ${n} Erfahrung</span></span>`};
const xpb=(k,t,kl)=>xpBalken(k,XPF[t],kl);
// Kleines Bild eines Hof-Gegenstands im Wunschbaum: dieselbe Zeichnung wie auf dem Hof (DR aus hof.js), der Ausschnitt wird nach dem Zeichnen
// per getBBox passend gesetzt (itBilder). Der Regenbogen hat keine DR-Zeichnung und bekommt eigene Bögen.
const RBOGEN='<g fill="none" stroke-width="4.2">'+['#e74c3c','#f39c12','#f4d03f','#58b368','#4a90c2','#7d5ba6'].map((c,i)=>`<path d="M${-80+i*4} 0A${80-i*4} ${80-i*4} 0 0 1 ${80-i*4} 0" stroke="${c}"/>`).join('')+'</g>';
const itemBild=id=>`<svg class="itb" data-it="${id}" aria-hidden="true" focusable="false">${id=='regenbogen'?RBOGEN:DR[id]?DR[id](0):''}</svg>`,ITBOX={};
function itBilder(){document.querySelectorAll('#app svg.itb:not([viewBox])').forEach(s=>{const id=s.dataset.it;
 if(!ITBOX[id])try{const b=s.getBBox();if(b.width>0){const p=Math.max(b.width,b.height)*.06;ITBOX[id]=`${r1(b.x-p)} ${r1(b.y-p)} ${r1(b.width+2*p)} ${r1(b.height+2*p)}`}}catch(e){}
 if(ITBOX[id])s.setAttribute('viewBox',ITBOX[id])})}
// Knopf-Beschriftung, Sperre und Hinweis: gesperrt = nicht besessen und zu wenig Erfahrung
const gesperrt=(k,t,hat)=>!hat&&k.xp<XPF[t];
// Lieblingspferde aus dem Stall (nach Fotos gezeichnet, die Fotos selbst bleiben lokal): im Wunschbaum kaufbar,
// danach leben sie als Freunde auf dem Hof. [id, Name, Beschreibung, Aussehen für pferd.js (mh = eigene Mähnenfarbe)]
const LIEB=[['roxeanne','Roxeanne','Rappe mit langer Mähne',{coat:'rappe',br:'fries',st:3,ma:'lang'}],
 ['roy','Roy','Falbe mit Behang',{coat:'falbe',br:'fries',st:3,ma:'mittel'}],
 ['bonnie','Bonnie','Schimmel-Pony',{coat:'schimmel',br:'isl',st:3,ma:'mittel'}],
 ['frodo','Frodo','Windfarbenes Pony-Fohlen',{coat:'wind',br:'isl',st:1,ma:'lang'}],
 ['jacko','Jacko','Falbfarbenes Pony-Fohlen',{coat:'falbe',br:'isl',st:1,ma:'lang',mh:['#c9b48e','#efe4c8']}]];
const AP='<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="9.5" r="6" fill="#c0392b"/><path d="M8 4Q9 1 12.5 1Q11.5 4.5 8 4Z" fill="#4f8a4a"/></svg>';
// Speicher: nur localStorage dieses Browsers, keine Cookies, keine Netzwerkzugriffe
// Speicherschlüssel: neuer Name, alte Stände unter 'mathegipfel1' werden beim ersten Start übernommen (und dort nicht gelöscht)
const KEY='fohlenhof1',OLDKEY='mathegipfel1';
// Copyright-Vermerk mit Vorname und Initial (ausdrücklicher Wunsch): seit 2026-10-25 zuerst auf der Erklärseite für Eltern, jetzt als Fußzeile auf jeder Seite
const APPNAME='Rechenhof',SPRUCH='Pferdestark in Mathe!';
const COPYJAHR=2026,COPY=`© ${COPYJAHR} Florian N. – ${APPNAME}. Alle Rechte vorbehalten.`;// Fußzeile: ui()
// Prüft und bereinigt einen Spielstand (aus dem Browser oder einer importierten Datei). Gibt null zurück, wenn er unbrauchbar ist.
const nn=(x,lo=0,hi=1e9)=>{x=+x;return Number.isFinite(x)?Math.min(hi,Math.max(lo,Math.floor(x))):lo};
const ct=(x,n)=>String(x==null?'':x).slice(0,n);
// PIN nur als Prüfsumme speichern (seit 2026-10-25, Brain Dump): "h1:" + Salz + ":" + SHA-256(Salz + ":" + PIN).
// So lässt sich die PIN weder im Browser-Speicher noch in einer Sicherung im Klartext lesen (Eltern nehmen oft dieselbe PIN wie anderswo).
// Es bleibt eine Kindersicherung: Wer an die Entwicklerwerkzeuge des Browsers kommt, kann den Speicher trotzdem ändern.
// Alte Stände mit PIN im Klartext werden beim Laden umgestellt (pinLaden). SHA-256 ist hier selbst geschrieben, damit es auch per Doppelklick (file:) und ohne await läuft.
function shaKonst(){const P=[];for(let n=2;P.length<64;n++)if(P.every(p=>n%p))P.push(n);const f=x=>(x-Math.floor(x))*4294967296|0;return{K:P.map(p=>f(Math.cbrt(p))),H:P.slice(0,8).map(p=>f(Math.sqrt(p)))}}
function sha256(str){const {K,H}=sha256.k||(sha256.k=shaKonst()),b=new TextEncoder().encode(str),l=b.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(b);m[l]=128;
 const dv=new DataView(m.buffer);dv.setUint32(n-4,l*8);const w=new Int32Array(64);let h=H.slice();
 for(let i=0;i<n;i+=64){for(let t=0;t<16;t++)w[t]=dv.getInt32(i+t*4);
  for(let t=16;t<64;t++){const a=w[t-15],c=w[t-2];w[t]=(w[t-16]+((a>>>7|a<<25)^(a>>>18|a<<14)^(a>>>3))+w[t-7]+((c>>>17|c<<15)^(c>>>19|c<<13)^(c>>>10)))|0}
  let [A,B,C,Dd,E,F,G,Hh]=h;
  for(let t=0;t<64;t++){const t1=(Hh+((E>>>6|E<<26)^(E>>>11|E<<21)^(E>>>25|E<<7))+((E&F)^(~E&G))+K[t]+w[t])|0,t2=(((A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10))+((A&B)^(A&C)^(B&C)))|0;
   Hh=G;G=F;F=E;E=(Dd+t1)|0;Dd=C;C=B;B=A;A=(t1+t2)|0}
  h=[A,B,C,Dd,E,F,G,Hh].map((x,j)=>(x+h[j])|0)}
 return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('')}
const PINH=/^h1:[0-9a-f]{16}:[0-9a-f]{64}$/;
function pinHash(p){const salz=[...crypto.getRandomValues(new Uint8Array(8))].map(x=>x.toString(16).padStart(2,'0')).join('');return'h1:'+salz+':'+sha256(salz+':'+p)}
function pinGleich(p){const s=S.pin||'';if(!s||!p)return false;if(!PINH.test(s))return p===s;const [,salz,h]=s.split(':');return sha256(salz+':'+p)===h}
function pinLaden(x){if(typeof x==='string'&&PINH.test(x))return x;const p=ct(x,8);return p?pinHash(p):''}
function clean(d){
 if(!d||typeof d!=='object'||!Array.isArray(d.kids))return null;
 const o={pin:pinLaden(d.pin),kids:[]};if(d.np&&!o.pin)o.np=1;
 // pf = falsche PIN-Eingaben seit der letzten richtigen, ps = gesperrt bis (Zeitstempel, höchstens eine Stunde ab jetzt, abgelaufen fällt weg).
 // Obergrenze für nn ausdrücklich angeben, sonst begrenzt nn auf 1e9 und ein Zeitstempel wäre immer abgelaufen.
 if(o.pin){const jetzt=Date.now(),pf=nn(d.pf,0,PINMAX-1),ps=nn(d.ps,0,jetzt+PINSPERRE);if(pf)o.pf=pf;if(ps>jetzt)o.ps=ps}
 if(d.snd===0)o.snd=0;if(d.calm)o.calm=1;if(d.mo==='e'||d.mo==='k')o.mo=d.mo;// mo: Startabfrage beantwortet (Elternteil/Kind)
 if(d.an==='b'||d.an==='c')o.an=d.an;// an: Ansicht (seit 2026-10-26, menue.js): b = Bunte Kacheln, c = Turniermodus, ohne = A "Pferdehof"
 for(const k of d.kids.slice(0,20)){if(!k||typeof k!=='object')continue;
  const c={id:nn(k.id,1,Number.MAX_SAFE_INTEGER),name:ct(k.name,20)||'Kind',g:KL.includes(+k.g)?+k.g:5,xp:nn(k.xp),ap:nn(k.ap),s:nn(k.s),best:nn(k.best),total:nn(k.total),r:nn(k.r),perfect:nn(k.perfect),b:[],t:{},mist:[]};
  // st = Wachstumsstufe, sd = gesammelte Tage für die nächste Stufe, ld = letzter gezählter Tag, zd/zt = Spielzeit (Sekunden) an diesem Tag
  c.st=k.st==null?GS.reduce((a,g,i)=>c.xp>=g.x?i:a,0):nn(k.st,0,3);c.sd=nn(k.sd,0,999);c.zt=nn(k.zt,0,86400);
  c.hz=nn(k.hz,0,HOFMAX);if(k.hl)c.hl=1;if(HOFM.includes(k.hm))c.hm=k.hm;// hm: Hofzeit in Minuten (seit 2026-10-27)
  if(typeof k.lm==='number'&&Number.isInteger(k.lm)&&k.lm>=0&&k.lm<=LIMMAX&&k.lm%5==0)c.lm=k.lm;// Tageslimit je Kind in Minuten, 0 = kein Limit
  // neu = 1: frisch angelegtes Kind, das noch keine Aufgabe begonnen hat (Tageslimit und Hofzeit zählen noch nicht, seit 2026-10-20)
  if(k.neu)c.neu=1;
  // hu = Hufeisen (seit 2026-10-22): 1 je Runde mit mindestens FREI von 10 und je Training mit Stern, für die Pferdepflege
  if(k.hu)c.hu=nn(k.hu,0,huMax(k));// höchstens 20, mit zweitem Pferd 30 (seit 2026-10-25, pflege.js)
  // mt = gekaufte Mottos für den eigenen Hof (seit 2026-10-23, 5 Hufeisen): {halloween: 1 an / 0 aus}, nur bekannte Mottos
  if(k.mt&&typeof k.mt==='object'){const mt={};for(const t of THEMEN)if(Object.prototype.hasOwnProperty.call(k.mt,t))mt[t]=k.mt[t]?1:0;if(Object.keys(mt).length)c.mt=mt}
  // kn = Knobelrunden hintereinander (Knobel-Regel, seit 2026-10-20)
  if(k.kn)c.kn=nn(k.kn,0,9);
  // bs = Besuch von Freundinnen (seit 2026-10-20), höchstens 3, jeder Eintrag wird wie ein Link streng geprüft
  if(Array.isArray(k.bs)){const bs=k.bs.filter(a=>besuchLesen(a)).slice(0,3);if(bs.length)c.bs=bs}
  if(k.f&&typeof k.f==='object'){const f=k.f,lgs=['schwarz',...new Set((Array.isArray(f.lgs)?f.lgs:[]).filter(x=>LEG[x]&&x!=='schwarz'))],shs=['blau',...new Set((Array.isArray(f.shs)?f.shs:[]).filter(x=>SHIRT[x]&&x!=='blau'))];
   c.f={g:f.g==='j'?'j':'m',hf:HAUT[f.hf]?f.hf:'hell',ha:HAAR[f.ha]?f.ha:'braun',lg:lgs.includes(f.lg)?f.lg:'schwarz',sh:shs.includes(f.sh)?f.sh:'blau',lgs,shs}}
  if(/^\d{4}-\d\d-\d\d$/.test(k.ld))c.ld=k.ld;if(/^\d{4}-\d\d-\d\d$/.test(k.zd))c.zd=k.zd;
  if(o.kids.some(z=>z.id==c.id))c.id=Date.now()+o.kids.length;
  if(Array.isArray(k.b))c.b=k.b.filter(x=>BD.some(b=>b[0]==x));
  if(k.t&&typeof k.t==='object')for(const key of Object.keys(k.t)){const s=k.t[key];if(s&&typeof s==='object'&&/^[a-z0-9]{1,12}$/.test(key))c.t[key]={d:nn(s.d,1,5),n:nn(s.n),r:nn(s.r),run:Math.max(-9,Math.min(9,Math.trunc(+s.run)||0))}}
  // Altes Thema "Geometrie & Zählen" (bis 2026-10-18): Fortschritt geht an "Winkel & Vielecke"
  if(c.t.geo){if(!c.t.winkel)c.t.winkel=c.t.geo;delete c.t.geo}
  // "Terme" ist seit 2026-10-24 nicht mehr wählbar (Klasse 7 nach dem Mathebuch): Fortschritt, Fehlerheft und Trainingsaufgaben gehen an "Gleichungen & Terme"
  if(c.t.term){if(!c.t.gl)c.t.gl=c.t.term;delete c.t.term}
  // nd = Schulstoff-Themen, die im Unterricht noch nicht dran waren (seit 2026-10-24, Eltern-Ansicht): kommen im Training nicht dran
  if(Array.isArray(k.nd)){const nd=[...new Set(k.nd.filter(x=>typeof x==='string'&&SCHUL.has(x)))].slice(0,40);if(nd.length)c.nd=nd}
  // gl: gelöste Aufgaben fürs Training (seit 2026-10-22), Prüfung wie beim Fehlerheft, ohne Zeichnung
  if(Array.isArray(k.gl)){c.gl=[];for(const m of k.gl.slice(-GLMAX))if(m&&typeof m.key==='string'&&/^[a-z0-9]{1,12}$/.test(m.key)&&Array.isArray(m.q)&&typeof m.q[0]==='string'&&Number.isFinite(+m.q[1]))c.gl.push({key:m.key==='term'?'gl':m.key,d:nn(m.d,1,5),q:[ct(m.q[0],400),+m.q[1],ct(m.q[2],200),ct(m.q[3],800)]});if(!c.gl.length)delete c.gl}
  if(Array.isArray(k.mist))for(const m of k.mist.slice(0,30)){if(m&&typeof m.key==='string'&&Array.isArray(m.q)&&typeof m.q[0]==='string'&&Number.isFinite(+m.q[1]))c.mist.push({key:m.key==='geo'?(m.q[4]&&(m.q[4].t=='gitter'||m.q[4].diag||/Diagonale|Weg führt/.test(m.q[0]))?'wege':'winkel'):m.key==='term'?'gl':ct(m.key,12),q:[ct(m.q[0],400),+m.q[1],ct(m.q[2],200),ct(m.q[3],800),...(zCheck(m.q[4])?[zCheck(m.q[4])]:[])]})}
  // Gestrichene Themen (seit 2026-10-25 "Schriftlich rechnen" in Klasse 4): Einträge im Fehlerheft und bei den gelösten Aufgaben fallen weg
  c.mist=c.mist.filter(m=>THEMA[m.key]);if(c.gl){c.gl=c.gl.filter(m=>THEMA[m.key]);if(!c.gl.length)delete c.gl}
  if(k.h&&typeof k.h==='object'){c.h=pclean(k.h);
   // Gekaufte Rassen (bis 2026-10-18, 40 Äpfel) gibt es nicht mehr: Die Äpfel werden zurückgegeben, die Rassen-Freunde verschwinden vom Hof
   if(Array.isArray(k.h.brs))c.ap+=40*new Set(k.h.brs.filter(x=>BR[x]&&x!='std')).size;
   // Zweites eigenes Pferd (seit 2026-10-19): eigenes Aussehen und eigenes Wachstum (st Stufe, sd gesammelte Tage).
   // Hof-Daten (it, lp, ko) gehören immer zum gerade gewählten Pferd k.h und wandern beim Umschalten mit.
   if(k.h2&&typeof k.h2==='object'){c.h2=pclean(k.h2);for(const f of ['it','lp','ko'])delete c.h2[f];c.h2.st=nn(k.h2.st,0,3);c.h2.sd=nn(k.h2.sd,0,999)}}
  // Einmalig (Brain Dump 2026-10-25): Tierarzt und Hufschmied werden für jedes Pferd ab Jährling sofort fällig, danach gelten die festen Tage.
  // Dazu so viele Hufeisen, dass beide Besuche bezahlt werden können (höchstens bis zum Vorrat). Merker gpa, damit es nur einmal passiert. Achtung: tag() gibt es beim Laden noch nicht, deshalb datumHeute() aus pflege.js.
  if(!k.gpa){let n=0;for(const [H,st] of [[c.h,c.st],[c.h2,c.h2&&c.h2.st]]){if(!H||(st|0)<1)continue;const g=H.ge||(H.ge={t:0,s:0});
    g.t=Math.max(g.t||0,TAZ);g.s=Math.max(g.s||0,SCHZ);if(!g.tf)g.tf=datumHeute();if(!g.sf)g.sf=datumHeute();n++}
   if(n)c.hu=Math.min(huMax(c),Math.max(c.hu||0,n*(TAPREIS+SCHPREIS)))}
  c.gpa=1;
  o.kids.push(c)}
 return o}
// Prüft und bereinigt ein Pferd aus dem Spielstand (eigenes Aussehen, Fähigkeiten, Mähne, dazu die Hof-Daten)
function pclean(h){const co=COATS[h.coat]?h.coat:'fuchs',own=h.own&&typeof h.own==='object'?h.own:{};
 const p={coat:co,coats:Array.isArray(h.coats)?[...new Set([co,...h.coats.filter(x=>COATS[x])])]:[co],name:ct(h.name,16)||'Fohlen',own:{},bl:h.bl?1:0,so:h.so?1:0,it:{}};
 const it=h.it&&typeof h.it==='object'?h.it:{};for(const [id] of ITEMS)if(it[id])p.it[id]=1;
 if(own.bl||p.bl)p.own.bl=1;if(own.so||p.so)p.own.so=1;
 // Anordnung der Abzeichen (seit 2026-10-18): bf Kopfform 0-4, sm Socken je Bein ("3120"), fs Zahl für die Schecken-Flecken
 if(h.bf!=null)p.bf=nn(h.bf,0,4);if(/^[0-3]{4}$/.test(h.sm||'')&&/[1-3]/.test(h.sm))p.sm=h.sm;if(+h.fs>0)p.fs=nn(h.fs,1,99999);
 // Training (seit 2026-10-22, training.js): tr = Sterne je Art, tl = letzter Trainingstag je Art, tz = Trainings an einem Tag. Alte Fähigkeiten (sk) fallen weg.
 const au=h.au&&typeof h.au==='object'?h.au:{};p.au={};for(const [id] of AUSR)if(au[id])p.au[id]=1;
 // Unterstand/Stall (seit 2026-10-22): hs = {d: Datum, s: 'raus'} heißt, das Pferd wurde an diesem Tag herausgeholt
 if(h.hs&&/^\d{4}-\d\d-\d\d$/.test(h.hs.d)&&h.hs.s==='raus')p.hs={d:h.hs.d,s:'raus'};
 // Gesundheit und Pflege (seit 2026-10-25, pflege.js): Tierarzt, Hufschmied, Pflege, Glücks-Hufeisen
 if(h.ge){const g=gpClean(h.ge);if(g)p.ge=g}
 const tr=h.tr&&typeof h.tr==='object'?h.tr:{},tl=h.tl&&typeof h.tl==='object'?h.tl:{};p.tr={};p.tl={};
 for(const [id] of TRA){const x=nn(tr[id],0,10);if(x)p.tr[id]=x;if(/^\d{4}-\d\d-\d\d$/.test(tl[id]))p.tl[id]=tl[id]}
 if(h.tz&&/^\d{4}-\d\d-\d\d$/.test(h.tz.d))p.tz={d:h.tz.d,n:nn(h.tz.n,0,9)};
 p.ma=MA[h.ma]?h.ma:'mittel';if(h.zk){p.zk=1;p.zo=h.zo?1:0}
 p.gus=['rosa',...new Set((Array.isArray(h.gus)?h.gus:[]).filter(x=>GUMMI[x]&&x!=='rosa'))];p.gu=p.gus.includes(h.gu)?h.gu:'rosa';
 p.lp=[...new Set((Array.isArray(h.lp)?h.lp:[]).filter(x=>LIEB.some(l=>l[0]===x)))];
 // Hof ausbauen (seit 2026-10-18): ko.n Anzahl Koppeln (1-3), ko.u Gebäude je Koppel (0 nichts, 1 Unterstand, 2 Stall nur Hauptkoppel), ko.z gewünschte Koppel je Freund
 // ("l:roy" Lieblingspferd, seit 2026-10-19 auch "e:2" für das zweite eigene Pferd)
 const ko=h.ko&&typeof h.ko==='object'?h.ko:{},u=Array.isArray(ko.u)?ko.u:[];p.ko={n:nn(ko.n,1,3),u:[nn(u[0],0,2),nn(u[1],0,1),nn(u[2],0,1)],z:{}};
 for(let i=p.ko.n;i<3;i++)p.ko.u[i]=0;
 if(ko.z&&typeof ko.z==='object')for(const [f,v] of Object.entries(ko.z))if(/^l:[a-z]{2,12}$|^e:2$/.test(f))p.ko.z[f]=nn(v,0,2);
 return p}
// S.pin: PIN der Eltern-Ansicht. S.np = 1: beim Start bewusst ohne PIN gewählt (Bereich heißt dann "Einstellungen" und ist offen)
let S={pin:'',kids:[]},v='home',cur=null,Q=null,open=false,warn='',note='',pw='',CH='fuchs';
// Seit 2026-10-24 hier oben (ui() braucht sie): NKN/NKG/NKW neues Kind (Name, Klasse, Hinweis), REIN Pferd nach Ablauf der Zeit hineingebracht
let NKN='',NKG=5,NKW='',REIN=0;
try{S=clean(JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLDKEY)||'null'))||S}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));warn=''}catch(e){warn='Speichern im Browser nicht möglich. Bitte Sicherung exportieren.'}};
// Stand mit PIN im Klartext (vor 2026-10-25): gleich als Prüfsumme speichern, auch unter dem alten Schlüssel keinen Klartext stehen lassen
// (nur, wenn das Laden geklappt hat, damit ein kaputter Stand nicht sofort überschrieben wird)
try{const roh=JSON.parse(localStorage.getItem(KEY)||'null');if(roh&&roh.pin&&!PINH.test(roh.pin)&&PINH.test(S.pin))save()}catch(e){}
try{const alt=JSON.parse(localStorage.getItem(OLDKEY)||'null');if(alt&&alt.pin&&!PINH.test(alt.pin)){alt.pin=pinLaden(alt.pin);localStorage.setItem(OLDKEY,JSON.stringify(alt))}}catch(e){}
const $=s=>document.querySelector(s),kid=()=>S.kids.find(k=>k.id==cur);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ts=(k,key)=>k.t[key]||(k.t[key]={d:1,n:0,r:0,run:0});
const hh=k=>{let H=k.h;H.tr=H.tr||{};H.it=H.it||{};H.ma=H.ma||'mittel';H.gus=H.gus||['rosa'];H.gu=H.gu||'rosa';H.lp=H.lp||[];H.ko=H.ko||{n:1,u:[0,0,0],z:{}};return H};
const stg=k=>k.st||0;
// Zweites Pferd (seit 2026-10-19): ab ausgewachsenem Pferd für ZWEIT Äpfel. Ausgewachsen zählt, wenn eines der beiden Pferde ein "Pferd" ist (z. B. für den Stall).
const ZWEIT=50,ausgewachsen=k=>stg(k)>=3||!!(k.h2&&k.h2.st>=3);
// Datum als Text (lokale Zeit), o = Tage Abstand zu heute
const tag=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const heute=k=>k.ld==tag();
const serie=k=>k.sd||0;// gesammelte Tage für die nächste Stufe, ausgefallene Tage löschen nichts
const tageBis=(k,z)=>{let n=-serie(k);for(let i=stg(k);i<z;i++)n+=TAGE[i];return Math.max(0,n)};
// Nach einer fertigen Runde: Tag zählen (einmal pro Tag) und eventuell wachsen
function tagZaehlt(k){const t=tag();if(k.ld==t)return{};k.sd=(k.sd||0)+1;k.ld=t;gesundTag(k);
 if(k.h&&stg(k)<3&&k.sd>=TAGE[stg(k)]){k.st=stg(k)+1;k.sd=0;return{neu:1,grow:GS[k.st].n}}return{neu:1}}
const zeit=k=>k.zd==tag()?(k.zt||0):0,ausZeit=k=>limS(k)>0&&zeit(k)>=limS(k);
const dots=d=>`<span class="dots" title="Stufe ${d} von 5">${[1,2,3,4,5].map(i=>`<i class="${i<=d?'on':''}"></i>`).join('')}</span>`;
// Gezeichnetes Pferd (pferd.js): Spielstand -> Aussehen. Mähnenlänge und Zöpfe erst ab Jährling.
const pfSpec=(H,st)=>({coat:H.coat,st,bl:H.bl,so:H.so,bf:H.bf,sm:H.sm,fs:H.fs,ma:st>=1?(H.ma||'mittel'):'mittel',zo:st>=1&&H.zk&&H.zo&&H.ma=='lang'?1:0,gu:GUMMI[H.gu||'rosa'][1]});
// Jedes Bild bekommt ein eigenes Präfix für seine Kennungen (wird bei jedem Seitenaufbau neu gezählt)
let PZ=0;const pfBild=(spec,opt)=>PF.bild('b'+(PZ++)+'_',spec,opt),PFVB='-118 -252 272 262';
const RM=typeof matchMedia!='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=(k,an,idle)=>{let h=k.h,st=stg(k),s=GS[st].s;return`<svg class="scene" viewBox="0 0 320 180" role="img" aria-label="${esc(h.name)} auf der Weide"><rect width="320" height="180" style="fill:var(--sky)"/><circle cx="268" cy="36" r="16" fill="#e2b24a"/><path d="M0 118Q80 88 170 116T320 106V180H0Z" style="fill:var(--h2)"/>${[0,1,2,3,4].map(i=>`<rect x="${24+i*68}" y="120" width="5" height="40" fill="#b9a27a"/>`).join('')}<rect y="130" width="320" height="4" fill="#b9a27a"/><rect y="144" width="320" height="4" fill="#b9a27a"/><rect y="158" width="320" height="22" style="fill:var(--h1)"/><g id="hg"${an?` class="an-${an.t}" style="--a:${an.a}px"`:''}><g transform="translate(${160-10*s} 163) scale(${s*.5})">${pfBild(pfSpec(hh(k),st),{idle:idle&&!RM})}</g></g><g id="ht"></g></svg>`};
const pick=(c)=>`<button class="pick ${CH==c?'on':''}" onclick="CH='${c}';ui()" aria-pressed="${CH==c}"><svg viewBox="${PFVB}">${pfBild({coat:c,st:0})}</svg>${COATS[c][0]}</button>`;
function ui(){let h='';PZ=0;
 if(v=='koppeln')v='wish';// seit 2026-10-21 stehen Koppeln, Unterstände und Stall direkt im Wunschbaum
 if(v!='home'){EIN='';EINPIN=false;NKN='';NKG=5;NKAUF=0}// Einrichtungsschritt gilt nur auf der Startseite (sonst käme z. B. "Kinder anlegen" ohne PIN zurück)
 if(v=='home')KT='';// Ansichten B und C (menue.js): auf der Startseite beginnt die Kind-Ansicht wieder mit der Übersicht
 if(!pinSeite()){PINI=0;PINR=0}// verstecktes "i" der PIN-Seiten: beim Verlassen wieder unsichtbar
 if(v!='kid')TRNOTE='';// Hinweis im Training nur, solange die Kind-Ansicht offen ist
 if(v!='bye'&&v!='done')REIN=0;// "steht jetzt im Unterstand" nur auf der Abschiedsseite bzw. am Rundenende
 if(!S.mo&&v=='besuch')v='home';// Besuchs-Link auf einem neuen Gerät: erst die Startabfrage, der Besuch (BES) wartet
 if(v=='home'&&(!S.mo||EIN=='kinder')){h=startAbfrage()}
 else if(v=='home'){const zu=pinZu();// PIN-Sperre (seit 2026-10-24): Hinweis oben, Kinder-Knöpfe aus
 // Ansichten B und C (seit 2026-10-26, menue.js), sonst A "Pferdehof": Holzschilder (body.holz), jedes Kind an einer Boxentür mit Namensschild
 if(S.an=='b')h=homeB(zu);else if(S.an=='c')h=homeC(zu);else
 h=`<h1>${APPNAME}</h1><p class="spruch">${SPRUCH}</p>${zu?pinZuKarte():''}<p>Wer geht heute auf den Hof?</p>`+S.kids.map(k=>`<button class="big hbox" onclick="sel(${k.id})"${zu?' disabled':''}><span class="htuer" aria-hidden="true">${kindBild(k)}</span><span class="hschild"><b>${esc(k.name)}</b><span class="small">Klasse ${k.g}${k.h?' · '+esc(k.h.name)+' · '+stufeN(stg(k)):''}</span></span><span class="ap">${k.ap||0} ${AP}</span></button>`).join('')+
 nkKarte(zu)+`<p class="row"><button class="alt" onclick="v='parent';ui()">${S.pin?'Eltern-Ansicht':'Einstellungen'}</button><button class="alt" onclick="flyOn()">Flug über die Koppel</button><button class="alt" onclick="infoAuf()">Für Eltern</button><button class="alt" onclick="ansichtAuf()">Ansicht</button></p>`}
 // Auswahl der Ansicht (seit 2026-10-26, menue.js)
 if(v=='ansicht')h=ansichtSeite();
 // Figur erstellen oder ändern (FE: Entwurf, wird erst mit "Fertig" bzw. "Speichern" übernommen)
 // Koppeln, Unterstände und Stall: bauen, ausbauen, Pferde verteilen
 // Leggings- und Shirtfarben: anprobieren kostenlos, beim Speichern werden neue Farben gekauft
 // Freundin einladen: QR-Code und Link mit dem Aussehen von Pferd und Figur (seit 2026-10-20)
 if(v=='einladen'){const k=kid(),url=besuchLink(k),web=/^https?:$/.test(location.protocol);
  h=`<button class="alt" onclick="v='kid';ui()">Zurück</button><h1>Freundin einladen</h1>
  <div class="card" style="text-align:center"><div class="qrbox">${qrSvg(url,270)}</div><p>Zeig diesen QR-Code deiner Freundin. Sie scannt ihn mit der Kamera ihres Handys oder Tablets. Dann besuchst du mit ${esc(k.h.name)} ihren Hof.</p>${web?'':'<p class="no small">Der Code funktioniert erst, wenn die App über die Internet-Adresse geöffnet wurde.</p>'}</div>
  <p class="small">Oder schick den Link, zum Beispiel mit dem Handy deiner Eltern:</p><div class="row" style="flex-wrap:nowrap"><input id="blink" readonly value="${esc(url)}" style="flex:1;min-width:0" aria-label="Einladungs-Link"><button onclick="linkKopieren()">Kopieren</button>${navigator.share?'<button onclick="linkTeilen()">Teilen</button>':''}</div><p class="ok small">${note}</p>
  <div class="card small"><b>So siehst du bei deiner Freundin aus:</b>${besuchBild(besuchLesen(besuchListe(k)))}<p style="margin-bottom:0">Im Code stehen nur dein Vorname, der Name von ${esc(k.h.name)} und wie ihr ausseht. Kein Fortschritt, keine Äpfel, keine PIN. Der Code geht nicht über einen Server.</p></div>`}
 // Besuch annehmen: Link oder QR-Code einer Freundin wurde geöffnet
 if(v=='besuch'){const b=BES&&besuchLesen(BES),ks=S.kids.filter(x=>x.h);
  h=b?`<h1>Besuch!</h1><div class="card" style="text-align:center">${besuchBild(b)}<p><b>${esc(b.n)} besucht dich mit ${esc(b.h.name)}!</b></p></div>`+
   (ks.length?`<p>Auf wessen Hof sollen sie kommen?</p>${ks.map(x=>`<button class="big" onclick="besuchAnnehmen(${x.id})"><span>${esc(x.name)} <span class="small">mit ${esc(x.h.name)}</span></span><span class="small">${besuche(x).length} von ${BMAX} Besuchen</span></button>`).join('')}`:
   `<p class="small">Hier gibt es noch kein Kind mit Pferd. Leg zuerst ein Kind an und rechne, bis du dir ein Fohlen aussuchen darfst. Dann öffne den Link noch einmal.</p>`)+
   `<p class="no">${note}</p><button class="alt" onclick="BES=null;note='';v='home';ui()">Nein danke</button>`:
   `<h1>Besuch</h1><p class="small">Dieser Besuchs-Code ist leider unvollständig.</p><button class="alt" onclick="v='home';ui()">Zur Startseite</button>`}
 if(v=='figur'){let k=kid(),neu=!k.f,ko=figurKosten(k),opt=(t,id,lab,sw,preis,g)=>{const zu=preis&&gesperrt(k,g,hatFarbe(k,t,id));return`<button class="${FE[t]==id?'go':'alt'}" onclick="FE.${t}='${id}';note='';ui()" aria-pressed="${FE[t]==id}"${zu?' disabled':''}>${sw?`<span class="gummi" style="background:${sw}"></span> `:''}${lab}${zu?` · ${ab(g)}`:preis&&!hatFarbe(k,t,id)?` · ${preis} ${AP}`:''}</button>`};
 h=`<div class="row sp"><button class="alt" onclick="v='${k.f||k.h?'kid':'home'}';ui()">Zurück</button><span class="ap">${k.ap||0} ${AP}</span></div><h1>${neu?'Deine Figur':'Figur ändern'}</h1>`+
 (neu?`<p>${k.h?`<b>Neu!</b> Wie siehst du auf dem Hof aus? Deine Figur steht dann bei ${esc(k.h.name)}.`:`Wie siehst du auf dem Hof aus? Danach rechnest du deine ersten Aufgaben. Nach 5 richtigen darfst du dir dein Fohlen aussuchen.`}</p>`:'')+
 `<div class="card" style="text-align:center;padding:8px">${figurMini(FE,190)}</div>
 <h2>Mädchen oder Junge</h2><div class="row">${opt('g','m','Mädchen')}${opt('g','j','Junge')}</div>
 <h2>Hautfarbe</h2><div class="row">${Object.entries(HAUT).map(([id,[n,c]])=>opt('hf',id,n,c)).join('')}</div>
 <h2>Haare</h2><div class="row">${Object.entries(HAAR).map(([id,[n,c]])=>opt('ha',id,n,c)).join('')}</div>
 <h2>Reitshirt</h2><div class="row">${Object.entries(SHIRT).map(([id,[n,c]])=>opt('sh',id,n,c,PREIS.shirt,'shirt')).join('')}</div>
 <h2>Reitleggings</h2><div class="row">${Object.entries(LEG).map(([id,[n,c]])=>opt('lg',id,n,c,PREIS.leg,'leg')).join('')}</div>
 <p class="small">${k.xp<Math.min(XPF.shirt,XPF.leg)?`Weitere Farben für Shirt und Leggings gibt es, sobald du genug Erfahrung hast:</p>${xpb(k,'shirt')}<p class="small">`:''}Neue Farben kannst du kostenlos anprobieren. Erst beim Speichern werden die Äpfel abgezogen, danach gehört dir die Farbe. Schwarzer Reithelm und Reitstiefel sind immer dabei.</p>
 <p class="no">${note}</p><button class="go" onclick="figurOk()">${neu?'Fertig':'Speichern'}${ko?` · ${ko} ${AP}`:''}</button>`}
 // Fohlenwahl: erstes Pferd oder (ZW) zweites Pferd
 if(v=='choose'){h=(ZW?`<button class="alt" onclick="ZW=0;v='wish';ui()">Zurück</button><h1>Dein zweites Fohlen</h1><p>Welche Pferderasse soll es sein? Das Fohlen kostet ${ZWEIT} Äpfel und rechnet ab jetzt mit dir. ${esc(kid().h.name)} lebt weiter auf deinem Hof, du kannst jederzeit zurückwechseln.</p>`:
  `<button class="alt" onclick="v='kid';ui()">Zurück</button><h1>Dein Fohlen</h1><p>Welche Pferderasse soll es sein? Später kannst du mit Äpfeln weitere Rassen und Abzeichen freischalten, sobald du genug Erfahrung hast.</p>`)+`<div class="grid">${Object.keys(COATS).map(pick).join('')}</div><p><label>Name des Fohlens<br><input id="hn" maxlength="16" placeholder="z. B. Luna" onkeydown="if(event.key=='Enter')mk()"></label></p><button class="go" onclick="mk()">Los geht’s</button>`}
 // Kind ohne Pferd: erst 5 Aufgaben richtig, dann Fohlenwahl
 if(v=='kid'&&!kid().h){let k=kid(),n=Math.max(0,FOHLEN-k.r);
 h=`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button><button class="alt" onclick="figurEdit()">Figur</button></div>
 <div class="card row" style="align-items:center;flex-wrap:nowrap">${figurMini(k.f,90)}<div><h1 style="margin:0">Hallo ${esc(k.name)}!</h1><p class="small" style="margin:4px 0 0">${n?`Löse ${n} Aufgabe${n>1?'n':''} richtig, dann darfst du dir dein Fohlen aussuchen.`:'Du darfst dir jetzt dein Fohlen aussuchen!'}</p></div></div>
 ${n?`<div class="bar" style="margin:6px 0"><b style="width:${(FOHLEN-n)/FOHLEN*100}%"></b></div>`:`<button class="go" onclick="v='choose';ui();scrollTo(0,0)">Fohlen aussuchen</button>`}
 <h2 id="themen">Thema wählen</h2>${themen(k)}`}
 // Kind mit Pferd: Ansichten B und C (seit 2026-10-26, menue.js), sonst A "Pferdehof" (alles auf einer Seite, Holz-Optik per CSS)
 if(v=='kid'&&kid().h&&(S.an=='b'||S.an=='c'))h=kindMenue(kid());
 else if(v=='kid'&&kid().h){let k=kid(),st=stg(k),nx=GS[st+1],se=serie(k),pr=nx?se/TAGE[st]*100:100,rest=Math.max(1,Math.ceil((limS(k)-zeit(k))/60));
 h=`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button><button class="alt" onclick="figurEdit()">Figur</button><button class="alt" onclick="snd()" aria-pressed="${S.snd!==0}">Ton: ${S.snd===0?'aus':'an'}</button></div>
 ${k.f?'':`<div class="card row sp" style="margin-top:8px"><span><b>Neu!</b> Erstelle deine eigene Figur. Sie steht dann auf deinem Hof.</span><button class="go" onclick="figurEdit()">Figur erstellen</button></div>`}${wartetHinweis(k)}${besuchKarte(k)}<p class="small" style="margin:8px 0 0">${k.hl?'Tippe oben auf dein Pferd, um es zu streicheln.</p>'+sperrInfo(k):`Tippe oben auf dein Pferd, um es zu streicheln. Probier auch Apfelbaum, Windrad und Teich aus, wenn du sie gebaut hast.</p><div class="row" style="margin:6px 0"><button class="alt" onclick="hofPet()">Pferd streicheln</button><button class="alt" onclick="flyOn()">Flug über den Hof</button><button class="alt" onclick="v='einladen';note='';ui();scrollTo(0,0)">Freundin einladen</button></div>`}${fuehrKnopf(k)}<div class="row sp"><h1>${esc(k.h.name)} <span class="small">${stufeN(st)} von ${esc(k.name)}</span></h1><span class="ap">${k.ap||0} ${AP}${k.hu?` · ${k.hu}${k.hu>=huMax(k)?' (voll)':''} ${HU}`:''}</span></div>
 <div class="bar" style="margin:6px 0"><b style="width:${pr}%"></b></div><p class="small">${nx?`Tag ${se} von ${TAGE[st]} bis „${nx.n}“ · ${heute(k)?'heute schon gerechnet':'rechne heute eine Runde, damit der Tag zählt'}`:'Dein Pferd ist ausgewachsen!'}</p>
 ${k.h2?`<div class="card row sp" style="align-items:center;padding:8px 12px"><span class="small">Dein zweites Pferd: <b>${esc(k.h2.name)}</b> (${stufeN(k.h2.st||0)})</span><button class="alt" onclick="wechsel()">Mit ${esc(k.h2.name)} rechnen</button></div>`:''}
 <p class="small">${limS(k)?`Noch ${rest} Minute${rest>1?'n':''} für heute · `:''}${k.xp} Erfahrung · Serie ${k.s} · Rekord ${k.best}${mcount(k)?` · Fehlerheft: ${mcount(k)} zum Wiederholen`:''}</p>
 ${st<D3AB?'':`${d3Fenster('')}<p class="small" style="margin-top:0">Wische über das Bild, um ${esc(k.h.name)} von allen Seiten zu sehen.</p>`}
 <h2 id="themen">Thema wählen</h2>`+themen(k)+
 `<h2>Wunschbaum</h2>${k.hl?`<p class="small">Der Wunschbaum öffnet sich wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:`<button class="big" onclick="v='wish';note='';ui()"><span>Pferderasse, Mähne und Abzeichen für ${esc(k.h.name)}</span><span class="ap">${AP}</span></button>`}`+
 // Training (seit 2026-10-22 hier statt im Wunschbaum, training.js), bei gesperrtem Hof wie der Wunschbaum zu
 `<h2 id="training">Training</h2>${k.hl?`<p class="small">Das Training geht wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:trTeil(k)}<h2 id="pflege">Gesundheit und Pflege</h2>${gpTeil(k)}<h2>Abzeichen</h2>`+BD.map(b=>`<span class="badge ${k.b.includes(b[0])?'':'off'}">${b[1]}</span>`).join('')}
 // Wunschbaum (umgebaut 2026-10-21 nach der ersten Testrunde): Bereiche nach Erfahrung, getrennt durch Linien (section.wb).
 // Gesperrtes zeigt einen Balken "1250 von 3500 Erfahrung" statt "ab 3500 Erfahrung". Pferderassen auf eigener Seite (v='rassen'),
 // Hof-Gegenstände mit kleinem Bild und "Koppeln" direkt hier (früher eigene Ansicht v='koppeln').
 // Seit 2026-10-23: Unterstand und Ausbau zum Stall (Hauptkoppel) stehen unter "Hof ausbauen", Unterstände auf Koppel 2 und 3 unter "Koppeln".
 // Der Bereich "Unterstand & Stall" ist weg. Ganz oben "Motto" (nur solange eines läuft, Kauf mit Hufeisen).
 if(v=='wish'){let k=kid(),H=hh(k),st=stg(k),b=belegung(H),nm=f=>freundInfo(k,f).name;
 const preis=p=>p+' '+AP,teil=(t,x)=>`<section class="wb"><h2>${t}</h2>${x}</section>`,
  zuKn=(f,i)=>[0,1,2].filter(j=>j!==i&&j<H.ko.n&&b.p[j].length<kap(H,j)).map(j=>`<button class="alt klein" onclick="hofBau('zu',${j},'${f}')">→ ${KNAME[j]}</button>`).join('');
 h=`<button class="alt" onclick="v='kid';ui()">Zurück</button><div class="row sp"><h1>Wunschbaum</h1><span class="ap">${k.ap||0} ${AP}${k.hu?` · ${k.hu} ${HU}`:''}</span></div><p class="no">${note}</p>
 ${st>=D3AB?d3Fenster('kleb'):`<div class="card small">Wenn ${esc(H.name)} ein ${GS[D3AB].n} ist, kannst du ${esc(H.name)} hier in 3D von allen Seiten ansehen. Noch ${tageBis(k,D3AB)} Tage mit Mathe.</div>`}
 <p class="small">Du hast ${k.xp} Erfahrung. Was noch gesperrt ist, schaltet sich mit mehr Erfahrung frei. Bezahlt wird mit Äpfeln, das Motto mit Hufeisen.</p>`+
 (THINFO[thema()]?teil('Motto',mottoTeil(k,thema())):'')+
 teil('Mähne',(gesperrt(k,'ma')?`<p class="small">Die Mähnenlänge kannst du ändern, sobald du genug Erfahrung hast:</p>${xpb(k,'ma')}`:
  `<div class="row">${Object.entries(MA).map(([id,n])=>`<button class="${H.ma==id?'go':'alt'}" onclick="wish('ma','${id}')" aria-pressed="${H.ma==id}">${n}</button>`).join('')}</div>`)+
  `<div class="row"><button class="${H.zk&&H.zo?'go':'alt'}" onclick="wish('zk')" aria-pressed="${!!(H.zk&&H.zo)}"${gesperrt(k,'zopf',H.zk)?' disabled':''}>Zöpfe${H.zk?(H.zo?' an':' aus'):gesperrt(k,'zopf')?'':' · '+preis(PREIS.zopf)}</button></div>`+(gesperrt(k,'zopf',H.zk)?xpb(k,'zopf'):'')+
  (H.zk?`<p class="small" style="margin-bottom:4px">Farbe der Haargummis:</p><div class="row">${Object.entries(GUMMI).map(([id,[n,c]])=>`<button class="${H.gu==id?'go':'alt'}" onclick="wish('gu','${id}')" aria-pressed="${H.gu==id}"><span class="gummi" style="background:${c}"></span> ${n}${H.gus.includes(id)?'':' · '+preis(PREIS.gummi)}</button>`).join('')}</div>`:'')+
  `<p class="small">Zöpfe gibt es nur bei langer Mähne: Wenn du Zöpfe einschaltest, wird die Mähne lang.${st<1?` Die Länge siehst du, sobald ${esc(H.name)} ein ${GS[1].n} ist.`:''}</p>`)+
 teil('Pferderasse',`<button class="big" onclick="v='rassen';note='';ui();scrollTo(0,0)"><span>${COATS[H.coat][0]}<br><span class="small">${H.coats.length} von ${Object.keys(COATS).length} Rassen freigeschaltet</span></span><span class="small">Alle Rassen ansehen ›</span></button>`+
  (gesperrt(k,'coat')?`<p class="small">Weitere Pferderassen kannst du kaufen, sobald du genug Erfahrung hast:</p>${xpb(k,'coat')}`:''))+
 teil('Abzeichen im Fell',`<div class="card abz"><svg viewBox="${PFVB}" role="img" aria-label="${esc(H.name)} mit Abzeichen">${pfBild(pfSpec(H,stg(k)))}</svg></div>
  <div class="row">${[['bl','Blesse'],['so','Weiße Socken']].map(([t,n])=>`<button class="${H[t]?'go':'alt'}" onclick="wish('${t}')"${gesperrt(k,'abz',H.own[t])?' disabled':''}>${n}${H.own[t]?(H[t]?' an':' aus'):gesperrt(k,'abz')?'':' · '+preis(15)}</button>`).join('')}${kannAnordnen(H)?`<button class="alt" onclick="anordnen()">Neu anordnen</button>`:''}</div>`+
  (gesperrt(k,'abz')&&!H.own.bl&&!H.own.so?xpb(k,'abz'):'')+
  (kannAnordnen(H)?`<p class="small">„Neu anordnen“ ist kostenlos und würfelt ${[H.bl&&'die Form auf dem Kopf',H.so&&'die Socken an jedem Bein',H.coat=='schecke'&&'die Flecken'].filter(Boolean).join(', ').replace(/, ([^,]*)$/,' und $1')} neu aus.</p>`:''))+
 teil('Reitausrüstung & Pflege',`<p class="small">Für das Anreiten braucht ${esc(H.name)} Sattel, Satteldecke und Trense, zum Putzen Pflegekiste, Halfter und Führstrick. Die Ausrüstung gehört ${esc(H.name)}.</p><div class="grid">${AUSR.map(([id,n,p,b])=>{const hat=(H.au||{})[id];return`<button class="pick au ${hat?'on':''}" data-au="${id}" onclick="wish('au','${id}')" aria-pressed="${!!hat}">${ausrBild(id)}<b>${n}</b><br><span class="small">${b}</span><br>${hat?'gekauft':preis(p)}</button>`}).join('')}</div>`)+
 teil('Hof ausbauen',(gesperrt(k,'it')?`<p class="small">Gegenstände für den Hof kannst du kaufen, sobald du genug Erfahrung hast:</p>${xpb(k,'it')}`:k.xp<ITXP.ausbau?`<p class="small">Weitere Gegenstände schalten sich mit mehr Erfahrung frei.</p>`:'')+
  // Von billig nach teuer; Unterstand und Stall (Ausbau) direkt nacheinander bei 25 Äpfeln
  `<div class="grid">${[...ITEMS.map(([id,n,p])=>{const zu=itZu(k,id,H.it[id]);return[p,0,`<button class="pick it ${H.it[id]?'on':''}${zu?' gesperrt':''}" data-id="${id}" onclick="wish('it','${id}')"${zu?' disabled':''}>${itemBild(id)}${n}<br>${H.it[id]?'gebaut':zu?`<span class="small">${itNoch(k,id)}</span>`:preis(p)}</button>`]}),
   [KOPPEL.unterstand,1,gebKarte(k,H,1)],[KOPPEL.unterstand,2,gebKarte(k,H,2)]].sort((x,y)=>x[0]-y[0]||x[1]-y[1]).map(x=>x[2]).join('')}</div>`+
  `<p class="small">Gebaute Gegenstände siehst du oben auf deinem Hof und im Rundflug. Unterstand (2 Plätze) und Stall (4 Plätze) schaffen auf der Hauptkoppel Platz für Freunde, ${esc(H.name)} wohnt dann darin.</p>`)+
 teil('Lieblingspferde aus dem Stall',(gesperrt(k,'lieb')?`<p class="small">Die Lieblingspferde kommen auf deinen Hof, sobald du genug Erfahrung hast:</p>${xpb(k,'lieb')}`:'')+
  `<div class="grid">${LIEB.map(([id,n,bs,sp])=>{const hat=H.lp.includes(id),zu=gesperrt(k,'lieb',hat);return`<button class="pick ${hat?'on':''}${zu?' gesperrt':''}" onclick="wish('lp','${id}')" aria-pressed="${hat}"${zu?' disabled':''}><svg viewBox="${PFVB}">${pfBild({...sp,bl:0,so:0})}</svg><b>${n}</b><br><span class="small">${bs}</span><br>${hat?'auf dem Hof':zu?'gesperrt':preis(PREIS.lieb)}</button>`}).join('')}</div><p class="small">Lieblingspferde leben als Freunde auf deinem Hof, wenn dort Platz ist. Tippe oben auf ein Pferd, dann siehst du seinen Namen.</p>`)+
 teil('Zweites Pferd',k.h2?`<p class="small">${esc(k.h2.name)} lebt auch auf deinem Hof. In der Kind-Ansicht kannst du wechseln, wer mit dir rechnet.</p>`:ausgewachsen(k)?`<button class="go" onclick="zweitWahl()">Zweites Fohlen aussuchen · ${preis(ZWEIT)}</button><p class="small">Das neue Fohlen rechnet dann mit dir und wächst. ${esc(H.name)} bleibt auf deinem Hof und braucht dort einen Platz.</p>`:`<p class="small">Wenn ${esc(H.name)} ausgewachsen ist, kannst du ein zweites Fohlen bekommen (${ZWEIT} Äpfel).</p>`)+
 teil('Koppeln',`<p class="small">Jedes Pferd braucht einen Platz. ${esc(H.name)} hat immer einen Platz auf der Hauptkoppel. Unterstand und Stall unter „Hof ausbauen“ schaffen dort Platz für Freunde, auf Koppel 2 und 3 je ein Unterstand.</p><p class="small">${platzText(H)}</p>`+
  [0,1,2].map(i=>{
   if(i>H.ko.n)return`<div class="card koppel zu"><b>${KNAME[i]}</b><p class="small">Erst ${KNAME[i-1]} bauen.</p>${k.xp<KOPPEL.xp[i]?xpBalken(k,KOPPEL.xp[i]):''}</div>`;
   if(i==H.ko.n)return`<div class="card koppel zu"><b>${KNAME[i]}</b>`+(k.xp<KOPPEL.xp[i]?`<p class="small">Eine neue Koppel kannst du bauen, sobald du genug Erfahrung hast:</p>${xpBalken(k,KOPPEL.xp[i])}`:
    `<p class="small">Ein neuer Zaun teilt die Weide, ${i==1?'links':'rechts'} kommt eine Koppel dazu.</p><button class="go" onclick="hofBau('koppel',${i})">Koppel bauen · ${preis(KOPPEL.preis)}</button>`)+`</div>`;
   return`<div class="card koppel"><div class="row sp"><b>${KNAME[i]}</b><span class="small">${['','Unterstand · ','Stall · '][H.ko.u[i]]}${b.p[i].length} von ${kap(H,i)} Plätzen belegt</span></div>`+
    (i&&!H.ko.u[i]?`<button class="go" onclick="hofBau('unterstand',${i})">Unterstand bauen (2 Plätze) · ${preis(KOPPEL.unterstand)}</button>`:'')+
    b.p[i].map(f=>f=='eigen'?`<div class="pferdzeile"><span>${esc(H.name)} <span class="small">(dein Pferd)</span></span></div>`:`<div class="pferdzeile"><span>${esc(nm(f))}${f=='e:2'?' <span class="small">(dein zweites Pferd)</span>':''}</span><span>${zuKn(f,i)}</span></div>`).join('')+`</div>`}).join('')+
  (b.w.length?`<div class="card"><b>Wartet auf einen Platz</b>${b.w.map(f=>`<div class="pferdzeile"><span>${esc(nm(f))}</span><span class="small">Kein Platz frei</span></div>`).join('')}<p class="small">Bau einen Unterstand oder eine neue Koppel, dann ist Platz.</p></div>`:`<p class="small">Alle Pferde haben einen Platz.</p>`))+
 `<p class="small">Äpfel gibt es für richtige Antworten, bei schwereren Aufgaben mehr. Ausgeben kostet keine Erfahrung.</p>`}
 // Pferderassen auf eigener Seite (seit 2026-10-21), Auswahl und Kauf wie bisher über wish('coat', …)
 if(v=='rassen'){let k=kid(),H=hh(k),st=stg(k);
 h=`<div class="row sp"><button class="alt" onclick="v='wish';note='';ui()">Zurück</button><span class="ap">${k.ap||0} ${AP}</span></div><h1>Pferderassen</h1><p class="no">${note}</p>${st>=D3AB?d3Fenster('kleb'):''}`+
  (gesperrt(k,'coat')?`<p class="small">Weitere Pferderassen kannst du kaufen, sobald du genug Erfahrung hast:</p>${xpb(k,'coat')}`:`<p class="small">Jede neue Rasse kostet 25 Äpfel. Gekaufte Rassen kannst du jederzeit kostenlos wechseln.</p>`)+
  `<div class="grid">${Object.keys(COATS).map(c=>{const hat=H.coats.includes(c),zu=gesperrt(k,'coat',hat);return`<button class="pick ${H.coat==c?'on':''}${zu?' gesperrt':''}" onclick="wish('coat','${c}')"${zu?' disabled':''}><svg viewBox="${PFVB}">${pfBild({...pfSpec(H,st),coat:c,bl:0,so:0})}</svg>${COATS[c][0]}<br>${H.coat==c?'gewählt':hat?'freigeschaltet':zu?'gesperrt':'25 '+AP}</button>`}).join('')}</div>`}
 // Animationen (seit 2026-10-19): neue Aufgabe gleitet herein, Balken füllt sich nach jeder Antwort, bei richtig funkelt es und ein Apfel fliegt
 // in den Apfelzähler, bei falsch wackelt die Meldung. Jede Animation läuft nur einmal (Q.az/Q.af merken, was schon gezeigt wurde, z. B. nicht erneut beim Tipp).
 // Seit 2026-10-26 je Ansicht eigene Aufgabenseite (Schiefertafel, Klare Karte, Parcours mit Zahlenblock): aufgabeSeite() in menue.js.
 // Fortschritt als Hufeisen, Striche bzw. Hindernisse statt des Balkens; Animationen (Hereingleiten, Funkeln, Apfelflug, Wackeln) wie bisher.
 if(v=='quiz')h=aufgabeSeite();
 // Rundenende: Konfetti und Hufeisen bei 10 von 10, neue Abzeichen und Wachstum ploppen auf (nur beim ersten Anzeigen)
 if(v=='done'){let k=kid(),fw=!k.h&&k.r>=FOHLEN,neuE=!Q.ende;Q.ende=1;ANI={konfetti:neuE&&Q.right==10};h=`<h1>Geschafft!</h1><div class="card">${k.h?scene(k):`<div style="text-align:center">${figurMini(k.f,120)}</div>`}`+
 (k.h?'':fw?`<p class="ok"><b>Super, ${FOHLEN} Aufgaben richtig! Jetzt darfst du dir dein Fohlen aussuchen.</b></p>`:`<p class="small">Noch ${FOHLEN-k.r} richtige Aufgabe${FOHLEN-k.r>1?'n':''} bis zu deinem Fohlen.</p>`)+`<p><b>${Q.right} von 10</b> richtig, <b>+${Q.gain} Erfahrung</b> und <b class="ap">+${Q.ap} ${AP}</b>${Q.hu?` und <b class="ap">+1 Hufeisen ${HU}</b>`:''}${Q.huvoll?` <span class="small">(Dein Hufeisen-Vorrat ist voll: ${huMax(k)})</span>`:''}.</p>${Q.grow?`<p class="ok${neuE?' pop':''}"><b>${esc(k.h.name)} ist jetzt ein ${Q.grow}!</b></p>`:''}${Q.tg?`<p class="small">${Q.tg}</p>`:''}${Q.frei?`<p class="ok"><b>Super! Der Hof ist wieder offen.</b></p>`:''}${Q.zu?`<p class="no">Für den Hof brauchst du mindestens ${FREI} von 10 richtig. Versuch es gleich noch einmal! Du kannst jedes Thema nehmen.</p>`:''}${knobelZu(k,Q.key)?`<p class="no">${KNHINWEIS}</p>`:''}${Q.knzu?`<p class="no">Für das Knobeln brauchst du eine Runde Schulstoff mit mindestens ${FREI} von 10. Versuch es gleich noch einmal!</p>`:''}${Q.knfrei?`<p class="ok"><b>Super! Knobeln ist wieder frei.</b></p>`:''}${Q.mast?`<p class="ok"><b>${Q.mast} Aufgabe${Q.mast>1?'n':''} aus dem Fehlerheft gemeistert!</b></p>`:''}${Q.newb.map((b,i)=>`<span class="badge${neuE?' pop':''}" style="animation-delay:${.3+i*.2}s">Neues Abzeichen: ${b}</span>`).join('')}</div>`+
 (ausZeit(k)?(rf=>`<div class="card" id="limit"><b>Für heute ist Schluss.</b><p>Deine ${limM(k)} Minuten auf dem Hof sind um. Morgen geht es weiter${k.h?`, ${esc(k.h.name)} wartet auf dich`:''}!</p></div>${rf}<button class="${rf.includes('reinfrage')?'alt':'go'}" onclick="v='home';ui()">${rf.includes('reinfrage')?'Nein, tschüss':'Tschüss, bis morgen'}</button>`)(reinFrage(k)):
 `<div class="row">${fw?`<button class="go" onclick="v='choose';ui();scrollTo(0,0)">Fohlen aussuchen</button>`:''}${knobelZu(k,Q.key)?`<button class="go" onclick="andersThema()">Schulstoff wählen</button>`:`<button class="${fw?'alt':'go'}" onclick="start('${Q.key}')">Nochmal</button>${Q.zu?'':`<button class="alt" onclick="andersThema()">Anderes Thema</button>`}`}<button class="alt" onclick="KT='';v='kid';ui();scrollTo(0,0)">Zurück zum Hof</button></div>`+
 // Hof noch gesperrt: alle Themen direkt zur Auswahl
 (Q.zu?`<h2>Anderes Thema wählen</h2>${themen(k)}`:''))}
 if(v=='train')h=trSeite();
 // Abschied: Mit Unterstand oder Stall steht oben der Hof (statt des kleinen Bilds), damit das Pferd noch hineingebracht werden kann (seit 2026-10-24)
 if(v=='bye'){let k=kid(),rf=reinFrage(k);h=`<h1>Bis morgen, ${esc(k.name)}!</h1><div class="card">${k.h&&!byeHof()?scene(k):''}<p>Für heute sind deine ${limM(k)} Minuten auf dem Hof um.${k.h?` ${esc(k.h.name)} freut sich, wenn du morgen wiederkommst.`:''}</p>${k.h&&stg(k)<3&&heute(k)?'<p class="small">Heute hast du gerechnet, der Tag zählt fürs Wachstum.</p>':''}</div>${rf}<button class="${rf.includes('reinfrage')?'alt':'go'}" onclick="v='home';ui()">${rf.includes('reinfrage')?'Nein, tschüss':'Tschüss'}</button>`}
 // Erklärseite für Eltern (seit 2026-10-24, Brain Dump): offen für alle, ohne Hof im Hintergrund, Zahlen kommen aus den Konstanten
 if(v=='info'){const li=a=>`<ul class="info">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`,zur=`<button class="alt" onclick="infoZu()">Zurück</button>`;
  h=zur+`<h1>${APPNAME} für Eltern</h1><p>Kurz erklärt: was die App macht, was du als Elternteil einstellen kannst und was mit den Daten passiert.</p>`+
  `<div class="card"><b>Worum es geht</b>`+li([`Mathe üben für die Klassen 4 bis 8 (Klasse 4 Grundschule, ab Klasse 5 Gymnasium). Jedes Kind hat ein eigenes Pferd, das vom Fohlen zum Pferd heranwächst, und einen eigenen Hof.`,
   `Für richtige Antworten gibt es Äpfel. Damit kauft das Kind Dinge für Pferd und Hof. Äpfel gibt es nur fürs Rechnen, nie für Geld.`,
   `Das Pferd wächst mit den Tagen, an denen gerechnet wurde (ein Tag zählt einmal), nicht mit der Spielzeit.`])+`</div>`+
  `<div class="card"><b>So wird geübt</b>`+li([`Eine Runde hat 10 Aufgaben. Jedes Thema hat 5 Stufen: Nach 3 richtigen Antworten in Folge geht es eine Stufe hoch, nach 2 falschen eine Stufe runter.`,
   `Viele Aufgaben haben einen Tipp. Nach einer falschen Antwort zeigt die App den Lösungsweg.`,
   `Falsch gelöste Aufgaben kommen ins Fehlerheft und tauchen in späteren Runden wieder auf, bis sie sitzen.`,
   `Themen: der Schulstoff der eigenen Klasse (Klasse 7 nach dem Mathebuch), Mathe-Olympiade & Knobeln und Sudoku. Frühere Klassen lassen sich unter „Wiederholen“ üben.`,
   `Im Training übt das Kind mit Aufgaben, die es schon einmal richtig gelöst hat.`,
   `Unter „Gesundheit und Pflege“ putzt das Kind sein Pferd (mit Pflegekiste, Halfter und Führstrick, höchstens ${PFLMAX}-mal am Tag, ein zweites Pferd wird gleich mitgeputzt) und ruft Tierarzt (alle ${TAZ} Tage mit Mathe, ${TAPREIS} Hufeisen) und Hufschmied (alle ${SCHZ} Tage, ${SCHPREIS} Hufeisen). Ist ein Besuch überfällig, gibt es kein Training. Hufeisen gibt es für gute Runden und Trainings-Sterne, nicht für Geld.`])+`</div>`+
  `<div class="card"><b>Was du als Elternteil im Griff hast</b><p class="small">In der Eltern-Ansicht, geschützt mit deiner PIN:</p>`+li([`Zeitlimit pro Kind und Tag: standardmäßig ${LIMIN} Minuten, einstellbar von 5 bis ${LIMMAX} Minuten oder ohne Limit. Eine laufende Runde wird nicht unterbrochen.`,
   `Erst rechnen, dann spielen: Nach ${HOFZEIT/60} Minuten auf dem Hof (Standard, einstellbar von ${HOFM[0]} bis ${HOFMAX/60} Minuten) braucht das Kind eine Runde mit mindestens ${FREI} von 10 richtig, bevor es weiterspielen kann.`,
   `Knobeln geht höchstens ${KNMAX} Runden am Stück. Danach ist erst wieder eine Runde Schulstoff mit mindestens ${FREI} von 10 dran.`,
   `Statistik für jedes Kind: je Thema Stufe, Anzahl der Aufgaben und Anteil richtig, dazu die offenen Aufgaben im Fehlerheft.`,
   `Schulstoff, der im Unterricht noch nicht dran war, nimmst du aus dem Training heraus. Üben kann das Kind ihn trotzdem.`,
   `Klasse ändern, Fortschritt zurücksetzen, Kind löschen. Ab dem zweiten Kind braucht jedes neue Kind deine PIN.`,
   `Nach ${PINMAX} falschen PIN-Eingaben kann ${PINSPERRE/36e5==1?'eine Stunde':PINSPERRE/36e5+' Stunden'} lang kein Kind auf den Hof und keine PIN eingegeben werden.`,
   `Sicherung als Datei exportieren und auf einem anderen Gerät wieder importieren. Der bewegte Hintergrund lässt sich hier abschalten, den Ton schaltet das Kind auf seinem Hof aus.`])+`</div>`+
  `<div class="card"><b>Daten und Sicherheit</b>`+li([`Keine Werbung, keine Käufe in der App, keine Abos.`,`Kein Konto, keine Anmeldung, keine E-Mail-Adresse.`,`Keine Cookies, kein Tracking, keine Analyse-Dienste.`,
   `Alle Spielstände liegen nur im Browser auf diesem Gerät. Die App schickt nichts an einen Server. Beim Aufrufen der Seite sieht nur der Webserver (GitHub Pages) die üblichen technischen Daten, wie bei jeder Webseite.`,
   `Die App lädt keine fremden Inhalte nach und sperrt das auch selbst ab.`,
   `„Freundin einladen“: Der QR-Code bzw. Link enthält nur den Vornamen, den Namen des Pferds und das Aussehen von Pferd und Figur. Diese Angaben stehen hinter dem „#“ im Link und gehen beim Öffnen nicht an den Webserver. Den QR-Code scannt die Freundin direkt, einen Link schickt ihr zum Beispiel per Messenger.`,
   `Die PIN ist eine Kindersicherung. Sie wird nicht im Klartext gespeichert, sondern als Prüfsumme. Man sieht sie also nicht einfach im Browser-Speicher oder in der Sicherung. Vor jemandem, der das Gerät technisch untersucht, schützt sie trotzdem nicht: Eine kurze PIN lässt sich mit Technik herausfinden, und der Speicher lässt sich ändern.`])+`</div>`+
  `<div class="card"><b>Installieren und offline nutzen</b>`+li([`Im Browser „Zum Startbildschirm hinzufügen“ bzw. „App installieren“ wählen. Danach läuft die App auch ohne Internet.`,
   `Der Spielstand gehört zu Gerät und Browser. Für einen Gerätewechsel die Sicherung exportieren und auf dem neuen Gerät importieren.`])+`</div>`+zur}
 if(v=='parent'){h=`<button class="alt" onclick="v='home';lock()">Zurück</button><h1>${S.pin?'Eltern-Ansicht':'Einstellungen'}</h1>`;
 if(S.pin&&!open&&pinZu())h+=pinZuKarte();// PIN-Sperre (seit 2026-10-24)
 else if(S.pin&&!open)h+=`<div class="card pinkarte"><p>PIN eingeben:</p><input id="pin" type="password" inputmode="numeric" maxlength="8" aria-label="PIN" onkeydown="if(event.key=='Enter')unl()"> <button onclick="unl()">Öffnen</button><p class="no">${warn}</p>${pinI()}</div>`+pinResetKarte();
 else{h+=S.kids.map(k=>`<div class="card"><div class="row sp"><b>${esc(k.name)}</b><span>Klasse <select onchange="gr(${k.id},this.value)" aria-label="Klasse">${KL.map(c=>`<option ${k.g==c?'selected':''}>${c}</option>`).join('')}</select></span></div>
 <p class="small">${k.h?esc(k.h.name)+' · '+stufeN(stg(k))+' · ':''}${k.h2?'zweites Pferd '+esc(k.h2.name)+' · '+stufeN(k.h2.st||0)+' · ':''}${k.h&&stg(k)<3?`Tag ${serie(k)} von ${TAGE[stg(k)]} bis „${GS[stg(k)+1].n}“ · `:''}heute ${limS(k)?`${Math.min(limM(k),Math.floor(zeit(k)/60))} von ${limM(k)} Minuten`:`${Math.floor(zeit(k)/60)} Minuten (kein Limit)`} · ${k.xp} Erfahrung · ${k.ap||0} Äpfel · ${k.hu||0} Hufeisen · ${k.r} von ${k.total} Aufgaben richtig (${k.total?Math.round(k.r/k.total*100):0} %) · Rekordserie ${k.best} · Fehlerheft ${mcount(k)} offen</p>
 <p class="small" style="margin:6px 0"><label>Zeit pro Tag: <select onchange="lim(${k.id},this.value)" aria-label="Zeit pro Tag für ${esc(k.name)}">${limOptionen(k)}</select></label></p>
 <p class="small" style="margin:6px 0"><label>Hofzeit bis zur nächsten Runde: <select onchange="hofzeit(${k.id},this.value)" aria-label="Hofzeit bis zur nächsten Runde für ${esc(k.name)}">${hofOptionen(k)}</select></label></p>${ndListe(k)}
 <table><tr><th>Thema</th><th>Stufe</th><th>Aufgaben</th><th>Richtig</th></tr>${elternThemen(k).map(t=>{let s=ts(k,t[0]);return`<tr><td>${t[1]}</td><td>${s.d}</td><td>${s.n}</td><td>${s.n?Math.round(s.r/s.n*100)+' %':'–'}</td></tr>`}).join('')}</table>
 <p class="small">Ein Thema wechselt hoch nach 3 richtigen Antworten in Folge und runter nach 2 falschen.</p><div class="row"><button class="alt" onclick="rst(${k.id})">Fortschritt zurücksetzen</button><button class="alt" onclick="del(${k.id})">Kind löschen</button></div></div>`).join('')||'<p>Noch keine Kinder angelegt.</p>';
 h+=`<div class="card"><b>Spielzeit und Wachstum</b><p class="small">Jedes Kind kann standardmäßig ${LIMIN} Minuten pro Tag auf den Hof. Bei jedem Kind lässt sich die Zeit im 5-Minuten-Raster ändern (5 bis ${LIMMAX} Minuten oder kein Limit). Eine laufende Runde wird nicht unterbrochen. Nach der Hofzeit (standardmäßig ${HOFZEIT/60} Minuten, je Kind einstellbar von ${HOFM[0]} bis ${HOFMAX/60} Minuten) muss das Kind erst eine Runde mit mindestens ${FREI} von 10 richtig rechnen. Wird die Hofzeit geändert, während der Hof gesperrt ist, bleibt er bis zu dieser Runde gesperrt. Das Pferd wächst mit Tagen, an denen mindestens eine Runde gerechnet wurde (einmal pro Tag): Jährling nach 3 Tagen, Jungpferd nach weiteren 5, Pferd nach weiteren 10. Fallen Tage aus, bleiben die gesammelten Tage erhalten.</p><p class="small">Knobeln (Mathe-Olympiade und Sudoku) geht höchstens ${KNMAX} Runden am Stück. Danach muss erst eine Runde Schulstoff mit mindestens ${FREI} von 10 geschafft werden.</p></div><div class="card"><b>Anzeige</b><p class="small">Der animierte Hintergrund kann ruhig gestellt werden, zum Beispiel bei älteren Geräten oder um den Akku zu schonen. Dann stehen die Pferde still.</p><button class="alt" onclick="S.calm=S.calm?0:1;save();ui()">Ruhiger Hintergrund: ${S.calm?'an':'aus'}</button></div><div class="card"><b>Sicherung</b><p class="small">Der Stand liegt nur in diesem Browser. Exportiere ihn regelmäßig als Datei, besonders vor dem Löschen von Browserdaten oder bei einem Gerätewechsel.</p><div class="row"><button onclick="exp()">Exportieren</button><input type="file" accept=".json" onchange="imp(this)" aria-label="Sicherung importieren"></div><p class="no">${warn}</p></div>
 <div class="card"><b>PIN-Schutz</b>${S.pin?`<p class="small">Diese Ansicht ist mit einer PIN geschützt. Ohne PIN heißt sie „Einstellungen“ und ist für alle offen, zum Beispiel auf dem eigenen Handy eines Kindes.</p><button class="alt" onclick="npin()">PIN entfernen</button>`:`<p class="small">Ohne PIN kann jeder hier die Klasse ändern, Fortschritt zurücksetzen und Kinder löschen. Mit einer PIN (mindestens 4 Zeichen) wird daraus die geschützte Eltern-Ansicht.</p><input id="pin1" type="password" inputmode="numeric" maxlength="8" aria-label="PIN festlegen" onkeydown="if(event.key=='Enter')sp('pin1')"> <button onclick="sp('pin1')">PIN festlegen</button>`}<p class="no">${pw}</p></div>`+(S.pin?`<button class="alt" onclick="lock()">Sperren</button> `:'')+`<button class="alt" onclick="infoAuf()">So funktioniert die App</button>`}}
 // Ansicht C: Leiste unten (steht im Inhaltsblock, fest am Bildschirmrand)
 const ml=leisteZeigen();if(ml)h+=leisteHtml();document.body.classList.toggle('mitleiste',ml);
 // Ansicht A "Pferdehof": Holz-Optik auf Startseite, Kind-Ansicht (mit Themen), Aufgabenseite (Schiefertafel, seit 2026-10-26) und Rundenende
 document.body.classList.toggle('holz',!mAn()&&(v=='home'||v=='kid'||v=='quiz'||v=='done'));
 // Copyright-Zeile seit 2026-10-27 hinter dem Inhaltsblock im normalen Textfluss (main ist eine Flex-Spalte und schiebt sie an den unteren Rand)
 $('#app').innerHTML='<div class="in">'+h+'</div>'+`<p class="small copyright">${COPY}</p>`;if(v!='kid'&&v!='wish'&&v!='rassen')countdown(0);hofSync();d3Sync();trSync();nachZeichnen();itBilder();kopfAusschnitt();setTimeout(()=>{let a=$('#ans')||$('#pin')||$('#hn')||$('#pin0');a&&(v!='home'||a.id=='pin0')&&a.focus({preventScroll:a.id=='hn'})})}
// ---------- Besuch per Code (seit 2026-10-20, siehe Notiz "Ideen Besuch per Code") ----------
// Ein Kind lädt eine Freundin ein: Link mit QR-Code (qr.js). Hinter "#b=" stehen nur Vorname, Pferdename und das Aussehen von Pferd
// und Figur (kein Fortschritt, keine Äpfel, keine PIN). Der Teil hinter "#" wird nie an einen Server geschickt, auch nicht an GitHub.
// Besuch wird am Kind gespeichert (k.bs, höchstens BMAX) und bleibt, bis man ihn verabschiedet.
const BMAX=3;
// Code als Liste (Version 1): [1, Vorname, Pferdename, Rasse, Stufe, Blesse, Socken, Kopfform, Socken je Bein, Flecken, Mähne, Zöpfe, Gummi,
// Junge, Haut, Haare, Leggings, Shirt]. Farben als Nummern der Listen in app.js und figur.js, damit der Code kurz bleibt.
function besuchListe(k){const H=hh(k),f={...FIGUR0,...(k.f||{})},ix=(o,x)=>Math.max(0,Object.keys(o).indexOf(x));
 return[1,ct(k.name,20),ct(H.name,16),ix(COATS,H.coat),stg(k),H.bl?1:0,H.so?1:0,H.bf==null?-1:H.bf,H.sm||'',H.fs||0,ix(MA,H.ma||'mittel'),H.zk&&H.zo?1:0,ix(GUMMI,H.gu||'rosa'),f.g=='j'?1:0,ix(HAUT,f.hf),ix(HAAR,f.ha),ix(LEG,f.lg),ix(SHIRT,f.sh)]}
function b64u(s){return btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function ub64(s){return new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)))}
function besuchLink(k){return location.origin+location.pathname+'#b='+b64u(JSON.stringify(besuchListe(k)))}
// Prüft eine Besuchsliste (aus dem Link oder dem Speicher) streng. Liefert {n: Vorname, h: Pferd, f: Figur} oder null.
function besuchLesen(a){if(!Array.isArray(a)||a[0]!==1||a.length!==18)return null;
 const L=(o,i)=>{const ks=Object.keys(o);return Number.isInteger(i)&&i>=0&&i<ks.length?ks[i]:null};
 const n=typeof a[1]=='string'?a[1].slice(0,20).trim():'',p=typeof a[2]=='string'?a[2].slice(0,16).trim():'',coat=L(COATS,a[3]),ma=L(MA,a[10]),gu=L(GUMMI,a[12]),hf=L(HAUT,a[14]),ha=L(HAAR,a[15]),lg=L(LEG,a[16]),sh=L(SHIRT,a[17]);
 if(!n||!p||!coat||!ma||!gu||!hf||!ha||!lg||!sh||!Number.isInteger(a[4])||a[4]<0||a[4]>3)return null;
 const h={coat,coats:[coat],name:p,st:a[4],bl:a[5]===1?1:0,so:a[6]===1?1:0,own:{},ma,zk:a[11]===1?1:0,zo:a[11]===1?1:0,gu,gus:[gu]};
 if(Number.isInteger(a[7])&&a[7]>=0&&a[7]<=4)h.bf=a[7];if(typeof a[8]=='string'&&/^[0-3]{4}$/.test(a[8])&&/[1-3]/.test(a[8]))h.sm=a[8];if(Number.isInteger(a[9])&&a[9]>0&&a[9]<=99999)h.fs=a[9];
 return{n,h,f:{g:a[13]===1?'j':'m',hf,ha,lg,sh}}}
function besuche(k){return(k&&k.bs||[]).map(besuchLesen).filter(Boolean)}
const besuchGleich=(a,b)=>a[1]===b[1]&&a[2]===b[2];
// Besuch aus der Adresse lesen (beim Start und wenn ein Link in der offenen App geöffnet wird), danach die Adresse aufräumen
let BES=null;
function besuchAusLink(){const m=location.hash.match(/^#b=([A-Za-z0-9_-]{10,600})$/);if(!m)return false;
 try{const a=JSON.parse(ub64(m[1]));if(besuchLesen(a))BES=a}catch(e){}
 try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
 return!!BES}
function besuchAnnehmen(id){const k=S.kids.find(x=>x.id==id),b=besuchLesen(BES);if(!k||!b)return;k.bs=(k.bs||[]).filter(x=>besuchLesen(x));
 const i=k.bs.findIndex(x=>besuchGleich(x,BES));
 if(i>=0)k.bs[i]=BES;// gleicher Besuch: aktualisieren (z. B. Pferd ist gewachsen)
 else{if(k.bs.length>=BMAX){note=`Auf dem Hof von ${esc(k.name)} sind schon ${BMAX} Besuche. Verabschiede erst einen.`;ui();return}k.bs.push(BES)}
 BES=null;note='';save();sel(id)}
function besuchWeg(i){const k=kid();if(!k||!k.bs)return;k.bs.splice(i,1);if(!k.bs.length)delete k.bs;save();ui()}
// Bild eines Besuchs: Pferd und Figur nebeneinander
const besuchBild=b=>`<div class="row" style="justify-content:center;align-items:flex-end;flex-wrap:nowrap"><svg viewBox="${PFVB}" width="190" role="img" aria-label="${esc(b.h.name)}">${pfBild(pfSpec(b.h,b.h.st))}</svg>${figurMini(b.f,110)}</div>`;
// Karte in der Kind-Ansicht: wer gerade zu Besuch ist
const besuchKarte=k=>{const bs=besuche(k);return bs.length?`<div class="card small besuchkarte" style="margin-top:8px"><b>Besuch auf deinem Hof:</b>${bs.map((b,i)=>`<div class="row sp" style="align-items:center;margin-top:4px"><span>${esc(b.n)} mit ${esc(b.h.name)}</span><button class="alt klein" onclick="besuchWeg(${i})">Verabschieden</button></div>`).join('')}</div>`:''};
// Link kopieren bzw. teilen (ohne Netzwerk, nur Zwischenablage bzw. Teilen-Menü des Geräts)
function linkKopieren(){const el=$('#blink');if(!el)return;const ok=()=>{note='Link kopiert. Du kannst ihn jetzt in einer Nachricht einfügen.';ui()};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(el.value).then(ok).catch(()=>{el.select();try{document.execCommand('copy');ok()}catch(e){}});else{el.select();try{document.execCommand('copy');ok()}catch(e){}}}
function linkTeilen(){const k=kid();if(navigator.share)navigator.share({title:APPNAME,text:`${k.name} besucht dich mit ${k.h.name}!`,url:besuchLink(k)}).catch(()=>{})}
addEventListener('hashchange',()=>{if(besuchAusLink()){v='besuch';note='';ui();scrollTo(0,0)}});
// ---------- Animationen nach dem Seitenaufbau (seit 2026-10-19) ----------
// ANI wird in ui() je Ansicht gesetzt: apfel = Apfel fliegt in den Zähler, konfetti = Konfetti und Hufeisen (10 von 10)
let ANI={};
// Sterne um "Richtig!": [links, oben, Verzögerung]
const STERNE='<span class="sterne" aria-hidden="true">'+[[-8,-6,0],[40,-12,.08],[96,-8,.16],[150,-10,.04],[20,20,.2],[120,22,.12]].map(([x,y,d])=>`<i style="--x:${x}px;--y:${y}px;--d:${d}s"></i>`).join('')+'</span>';
function nachZeichnen(){
 // Fortschrittsbalken: vom alten auf den neuen Stand gleiten (die Seite wird neu aufgebaut, deshalb erst im nächsten Bild umstellen)
 const b=$('.bar b[data-w]');if(b&&b.style.width!=b.dataset.w+'%')requestAnimationFrame(()=>requestAnimationFrame(()=>{b.style.width=b.dataset.w+'%'}));
 const a=ANI;ANI={};
 if(a.apfel)setTimeout(apfelFlug,350);
 if(a.konfetti&&!RM)konfetti()}
// Ein Apfel fliegt von "Richtig!" zum Apfelzähler oben, danach zählt der Zähler hoch
function apfelFlug(){const von=$('.funkeln b'),nach=$('#apz'),k=kid();if(!von||!nach||!k)return;
 const r0=von.getBoundingClientRect(),r1=nach.getBoundingClientRect(),el=document.createElement('div');el.className='flugapfel';el.innerHTML=AP;el.setAttribute('aria-hidden','true');document.body.appendChild(el);
 const x0=r0.left+40,y0=r0.top,x1=r1.right-14,y1=r1.top+r1.height/2-8,fertig=()=>{el.remove();nach.innerHTML=`${k.ap||0} ${AP}`;nach.classList.add('puls')};
 if(!el.animate){fertig();return}
 el.animate([{transform:`translate(${x0}px,${y0}px) scale(1.4)`},{transform:`translate(${(x0+x1)/2}px,${Math.min(y0,y1)-60}px) scale(1.6)`,offset:.45},{transform:`translate(${x1}px,${y1}px) scale(.9)`}],{duration:750,easing:'ease-in-out'}).onfinish=fertig}
// Konfetti und goldene Hufeisen fallen über den Bildschirm (nur Darstellung, nach 5 Sekunden wieder weg)
function konfetti(){const c=document.createElement('div'),F=['#b0412f','#e2b24a','#4f8a4a','#4aa3df','#e8508f','#9b59b6'];c.className='konfetti';c.setAttribute('aria-hidden','true');let s='';
 for(let i=0;i<46;i++){const x=(Math.random()*100).toFixed(1),d=(Math.random()*.9).toFixed(2),t=(2.2+Math.random()*1.6).toFixed(2),r=Math.round(Math.random()*720-360),st=`left:${x}%;--d:${d}s;--t:${t}s;--r:${r}deg`;
  s+=i%4==0?`<i class="hu" style="${st}"><svg viewBox="0 0 20 20" width="24" height="24"><path d="M4 3v7a6 6 0 0 0 12 0V3" fill="none" stroke="#c9a227" stroke-width="3.6" stroke-linecap="round"/><circle cx="4" cy="7" r=".9" fill="#7a5c00"/><circle cx="16" cy="7" r=".9" fill="#7a5c00"/></svg></i>`:`<i style="${st};background:${F[i%F.length]}"></i>`}
 c.innerHTML=s;document.body.appendChild(c);setTimeout(()=>c.remove(),5000)}
// 3D-Fenster für ausgewachsene Pferde: Platzhalter im Seitenaufbau, das Modul (3d/vorschau.js) wird erst beim ersten Anzeigen geladen
const d3Fenster=cls=>`<div class="d3 ${cls}" id="d3" role="img" aria-label="Dein Pferd in 3D"><span class="d3text">3D-Pferd wird geladen …</span><span class="d3fehler">3D geht nur, wenn die App über die Internet-Adresse geöffnet wurde.</span></div>`;
let D3=null;
function d3Sync(){const el=$('#d3');
 if(!el){if(D3)D3.then(m=>m.verstecke()).catch(()=>{});return}
 if(!/^https?:$/.test(location.protocol)){el.classList.add('fehler');return}
 const H=hh(kid()),spec={coat:H.coat,ma:H.ma,zo:H.zk&&H.zo?1:0,gu:GUMMI[H.gu][1],bl:H.bl,so:H.so};
 D3=D3||import('./3d/vorschau.js');
 D3.then(m=>{if($('#d3')===el)m.zeige(el,spec)}).catch(e=>{D3=null;el.classList.add('fehler');console.warn('3D nicht verfügbar',e)})}
// Neues Kind: neu = 1, damit es sich beim ersten Mal alles in Ruhe ansehen kann. Die 30 Minuten (und die Hofzeit) laufen erst,
// wenn es die erste Aufgabe beginnt (start löscht die Markierung).
// Auf der Startseite (nicht beim Einrichten, dort ist die PIN schon eingegeben): ab dem zweiten Kind mit Eltern-PIN (seit 2026-10-24).
// NKN/NKG/NKW: eingegebener Name, Klasse und Hinweis bleiben bei falscher PIN stehen.
const nkPin=()=>!!S.pin&&S.kids.length>0&&v=='home'&&!EIN;
// Karte "Neues Kind" auf der Startseite (seit 2026-10-26 eigene Funktion, auch für die Ansichten in menue.js). zu = PIN-Sperre läuft.
// Gibt es schon ein Kind und ist eine PIN gesetzt, muss ein Elternteil mit der PIN bestätigen (seit 2026-10-24)
const nkKarte=zu=>`<div class="card"><b>Neues Kind</b><div class="row"><input id="nm" placeholder="Name" maxlength="20" aria-label="Name" value="${esc(NKN)}"><select id="gr" aria-label="Klasse">${KL.map(c=>`<option value="${c}"${NKG==c?' selected':''}>Klasse ${c}</option>`).join('')}</select>${nkPin()?'':'<button onclick="add()">Hinzufügen</button>'}</div>`+
 (nkPin()&&zu?`<p class="small">Neue Kinder lassen sich ab ${pinUhr()} Uhr wieder anlegen.</p>`:nkPin()?`<p class="small">Ein weiteres Kind muss ein Elternteil mit der PIN bestätigen.</p><div class="row"><input id="nkpin" type="password" inputmode="numeric" maxlength="8" placeholder="Eltern-PIN" aria-label="Eltern-PIN" onkeydown="if(event.key=='Enter')add()"><button onclick="add()">Hinzufügen</button></div>`:'')+`<p class="no">${NKW}</p></div>`;
function add(){let n=$('#nm').value.trim();if(!n)return $('#nm').focus();
 if(nkPin()){const p=($('#nkpin')||{}).value||'',r=p||pinZu()?pinPruef(p):'Bitte gib die Eltern-PIN ein.';if(r!==true){NKN=n;NKG=+$('#gr').value;NKW=r;ui();NKW='';const f=$('#nkpin');if(f)f.focus();return}}
 NKN='';NKG=5;NKAUF=0;S.kids.push({id:Math.max(Date.now(),...S.kids.map(k=>k.id+1)),name:n,g:+$('#gr').value,gpa:1,xp:0,st:0,sd:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{},neu:1});save();ui()}
// PIN festlegen: ohne id beim ersten Start (Feld pin0), mit id='pin1' nachträglich in den Einstellungen
function sp(id){let el=$('#'+(id||'pin0')),p=el?el.value.trim():'',m='Die PIN braucht mindestens 4 Zeichen.';if(p.length<4){if(id){pw=m;ui();pw=''}else{warn=m;ui();warn=''}return}S.pin=pinHash(p);delete S.np;delete S.pf;delete S.ps;S.mo='e';if(id)open=true;save();ui()}
function nopin(){S.np=1;S.mo='k';save();ui()}
function npin(){if(!confirm('PIN entfernen? Danach kann jeder diese Einstellungen öffnen.'))return;S.pin='';delete S.pf;delete S.ps;S.np=1;S.mo='k';open=false;save();ui()}
// ---------- Startabfrage (seit 2026-10-21, siehe Notiz "Ideen Elternbereich und Startabfrage") ----------
// Kommt einmal pro Gerät, auch bei bestehenden Spielständen: Elternteil (PIN festlegen bzw. bestätigen, dann Kinder anlegen)
// oder Kind (ohne PIN, Einstellungen offen, wie bisher "ohne Eltern-Ansicht"). Gespeichert als S.mo = 'e' oder 'k'.
// Ist schon eine PIN gesetzt, braucht auch der Kind-Modus die PIN (sie wird dabei entfernt), damit ein Kind die Sperre nicht umgeht.
// EIN = aktueller Schritt: '' Auswahl, 'e' PIN, 'k' Kind, 'kinder' Kinder anlegen (nach dem Eltern-Schritt).
let EIN='',EINPIN=false;// EINPIN: Kind-Modus auf Gerät mit PIN, PIN wurde richtig eingegeben (entfernt wird sie erst am Ende)
const VORTEILE=`<div class="card small vorteile"><b>${APPNAME} für Eltern</b><ul style="margin:6px 0 0;padding-left:20px"><li>Keine Werbung, keine Käufe durch Kinder</li><li>Kein Konto, keine Anmeldung: Alle Daten bleiben auf diesem Gerät</li><li>Zeitlimit für jedes Kind, Standard ${LIMIN} Minuten am Tag</li><li>Eltern-Ansicht mit PIN: Statistik, Klasse, Zeitlimit, Sicherung</li><li>Aufgaben für Klasse 4 bis 8 mit Tipps und Lösungswegen</li></ul><button class="alt" style="margin-top:8px" onclick="infoAuf()">Alles für Eltern ansehen</button></div>`;
// Erklärseite für Eltern öffnen und wieder zurück (seit 2026-10-24). Gemerkt werden Ansicht und Schritt der Startabfrage
// (nur Auswahl, Elternteil oder Kind, nie "Kinder anlegen": Der Schritt gilt nur direkt nach der PIN).
let INFOZ=null;
function infoAuf(){INFOZ={v,EIN:['','e','k'].includes(EIN)?EIN:''};v='info';ui();scrollTo(0,0)}
function infoZu(){const z=INFOZ||{v:'home',EIN:''};INFOZ=null;v=z.v=='info'?'home':z.v;ui();if(v=='home'&&z.EIN){EIN=z.EIN;ui()}scrollTo(0,0)}
const klassenWahl=()=>`<select id="gr" aria-label="Klasse">${KL.map(c=>`<option value="${c}"${c==5?' selected':''}>Klasse ${c}</option>`).join('')}</select>`;
function startAbfrage(){
 const kopf=`<h1>${APPNAME}</h1><p class="spruch">${SPRUCH}</p>`,zur=`<button class="alt" onclick="EIN='';EINPIN=false;warn='';ui()">Zurück</button>`,
  pinFeld=(fn,txt)=>`<input id="pin0" type="password" inputmode="numeric" maxlength="8" aria-label="PIN" onkeydown="if(event.key=='Enter')${fn}()"> <button onclick="${fn}()">${txt}</button>${PINMSG?`<p class="ok">${PINMSG}</p>`:''}<p class="no">${warn}</p>`;
 if(EIN=='kinder')return kopf+`<div class="card"><b>Kinder anlegen</b><p class="small">Jedes Kind bekommt einen eigenen Hof. Name, Klasse und Zeit pro Tag lassen sich später in der Eltern-Ansicht ändern.</p>`+
  S.kids.map(k=>`<div class="row sp" style="align-items:center"><span>${esc(k.name)} <span class="small">Klasse ${k.g}</span></span><select onchange="lim(${k.id},this.value)" aria-label="Zeit pro Tag für ${esc(k.name)}">${limOptionen(k)}</select></div>`).join('')+
  `<div class="row" style="margin-top:8px"><input id="nm" placeholder="Name" maxlength="20" aria-label="Name" onkeydown="if(event.key=='Enter')add()">${klassenWahl()}<button onclick="add()">Hinzufügen</button></div></div><button class="go" onclick="einFertig()">${S.kids.length?'Fertig, auf zum Hof':'Später anlegen'}</button>`;
 if((EIN=='e'||(EIN=='k'&&!EINPIN))&&pinZu())return kopf+pinZuKarte()+zur;// PIN-Sperre: keine PIN-Eingabe (seit 2026-10-24)
 if(EIN=='e')return kopf+VORTEILE+`<div class="card${S.pin?' pinkarte':''}">${S.pin?'<b>PIN eingeben</b><p class="small">Auf diesem Gerät gibt es schon eine PIN. Gib sie einmal ein, um den Eltern-Modus zu bestätigen.</p>'
  :'<b>PIN festlegen</b><p class="small">Mit der PIN öffnest du später die Eltern-Ansicht. Mindestens 4 Zeichen. Die Kinder sollten sie nicht kennen.</p>'}${pinFeld('einEltern','Weiter')}${pinI()}</div>`+pinResetKarte()+zur;
 if(EIN=='k')return kopf+(S.pin&&!EINPIN?`<div class="card pinkarte"><b>Kind-Modus</b><p>Auf diesem Gerät schützt eine PIN die Eltern-Ansicht. Für den Kind-Modus muss ein Elternteil sie einmal eingeben. Danach wird die PIN entfernt und die Einstellungen sind für alle offen.</p>${pinFeld('einKind','Weiter')}${pinI()}</div>${pinResetKarte()}`
  :S.kids.length?`<div class="card"><b>Kind-Modus</b><p>Du entscheidest selbst, die Einstellungen sind ohne PIN offen. Alle Spielstände bleiben, wie sie sind.</p><button class="go" onclick="einKind()">Weiter zum Hof</button></div>`
  :`<div class="card"><b>Wie heißt du?</b><p class="small">Du entscheidest selbst, die Einstellungen sind ohne PIN offen. Ein Elternteil kann später jederzeit eine PIN festlegen.</p><div class="row"><input id="nm" placeholder="Dein Name" maxlength="20" aria-label="Dein Name" onkeydown="if(event.key=='Enter')einKind()">${klassenWahl()}</div><button class="go" onclick="einKind()">Los geht’s</button><p class="no">${warn}</p></div>`)+zur;
 return kopf+`<div class="card"><b>Willkommen!</b>${S.kids.length?'<p class="small"><b>Neu:</b> Bitte einmal kurz auswählen, wer die App nutzt. Alle Spielstände bleiben erhalten.</p>':''}<p>Wer richtet die App ein?</p>`+
  `<button class="big" onclick="EIN='e';warn='';ui()"><span><b>Ich bin ein Elternteil</b><br><span class="small">und richte die App für meine Kinder ein (mit PIN)</span></span></button>`+
  `<button class="big" onclick="EIN='k';warn='';ui()"><span><b>Ich bin das Kind</b><br><span class="small">und darf selbst entscheiden (ohne PIN)</span></span></button></div>`+(S.kids.length?'':VORTEILE)}
function einEltern(){const el=$('#pin0'),p=el?el.value.trim():'';
 if(S.pin){if(!p)return;const r=pinPruef(p);if(r!==true){warn=r;ui();warn='';return}}// leeres Feld zählt nicht als Fehlversuch
 else{if(p.length<4){warn='Die PIN braucht mindestens 4 Zeichen.';ui();warn='';return}S.pin=pinHash(p)}
 delete S.np;S.mo='e';EIN='kinder';save();ui();scrollTo(0,0)}
function einKind(){
 if(S.pin&&!EINPIN){const el=$('#pin0'),p=el?el.value.trim():'';if(!p)return;const r=pinPruef(p);if(r!==true){warn=r;ui();warn='';return}EINPIN=true;ui();return}
 const frisch=!S.kids.length;
 if(frisch){const n=$('#nm');if(!n||!n.value.trim()){warn='Bitte gib deinen Namen ein.';ui();warn='';return}add()}
 if(EINPIN){S.pin='';open=false}S.np=1;S.mo='k';EIN='';EINPIN=false;save();
 if(frisch&&!BES)sel(S.kids[0].id);else einWeiter()}
function einFertig(){EIN='';einWeiter()}
function einWeiter(){v=BES?'besuch':'home';ui();scrollTo(0,0)}
function sel(id){GPNOTE='';if(pinZu()){v='home';ui();return}// PIN-Sperre: kein Kind auf den Hof (seit 2026-10-24)
 cur=id;ZW=0;TRNOTE='';KT='';const k=kid();if(!k)return;if(!k.h&&!k.f)FE={...FIGUR0};v=ausZeit(k)?'bye':!k.h&&!k.f?'figur':'kid';ui();scrollTo(0,0)}
// Figur: Entwurf FE bearbeiten und übernehmen
let FE={...FIGUR0};
function figurEdit(){FE={...FIGUR0,...(kid().f||{})};note='';v='figur';ui();scrollTo(0,0)}
// Besitzt das Kind diese Leggings- (t = 'lg') bzw. Shirtfarbe (t = 'sh')? Schwarz und Blau hat jeder.
const hatFarbe=(k,t,id)=>((k.f&&k.f[t+'s'])||[t=='lg'?'schwarz':'blau']).includes(id);
const figurKosten=k=>(hatFarbe(k,'lg',FE.lg)?0:PREIS.leg)+(hatFarbe(k,'sh',FE.sh)?0:PREIS.shirt);
function figurOk(){const k=kid(),ko=figurKosten(k);
 if(gesperrt(k,'shirt',hatFarbe(k,'sh',FE.sh))||gesperrt(k,'leg',hatFarbe(k,'lg',FE.lg))){note=`Diese Farbe gibt es ab ${XPF.shirt} Erfahrung. Du hast ${k.xp}.`;ui();return}
 if((k.ap||0)<ko){note='Dafür fehlen noch Äpfel. Probier eine andere Farbe oder rechne noch eine Runde.';ui();return}
 const alt=k.f||{};k.ap=(k.ap||0)-ko;
 k.f={g:FE.g,hf:FE.hf,ha:FE.ha,lg:FE.lg,sh:FE.sh,lgs:[...new Set([...(alt.lgs||['schwarz']),FE.lg])],shs:[...new Set([...(alt.shs||['blau']),FE.sh])]};
 note='';save();v='kid';ui();scrollTo(0,0)}
// Kleine Figur antippen: sie winkt (seit 2026-10-19, winken() in figur.js)
document.addEventListener('click',e=>{const f=e.target.closest&&e.target.closest('.figmini');if(f)winken(f)});
// Kleine Figur als eigenes Bild (Höhe h in Pixeln)
const figurMini=(f,h)=>`<svg class="figmini" viewBox="-21 -114 42 118" width="${Math.round(h*42/118)}" height="${h}" role="img" aria-label="Figur">${figurBild(f)}</svg>`;
// Aufgabentext für die Anzeige: Einheit am Ende ("(in °)?", " in cm?") wandert neben das Eingabefeld,
// jeder neue Satz beginnt in einer eigenen Zeile. Liefert [Text, Einheit]. Gilt auch für Aufgaben im Fehlerheft.
// Größen & Einheiten: "5 m 8 cm = ? cm" wird zu "5 m 8 cm = ?" mit Einheit cm.
// Neue Zeile nach . ? ! vor Großbuchstabe, Ziffer, Klammer oder einer Variablen wie "x = ?" (nicht bei "die 3. binomische Formel").
const EINH=/\s*\(in ([^()]{1,14})\)\?$|\s+in (€|Cent|cm²|cm|m²|m|km|kg|g|°)\?$/,EINH2=/=\s*\?\s+([a-zA-ZäöüÄÖÜ²³€]{1,4})$/;
// Seit 2026-10-26 (Brain Dump): Steht die Einheit mitten in der Frage ("Wie viele Minuten dauert die Fahrt?", "In wie vielen Jahren …",
// "Wie viel cm² bleiben …"), erscheint sie zusätzlich neben dem Eingabefeld, der Text bleibt. Nur im letzten Satz, nur echte Einheiten
// (nicht "Wie viele Flaschen"). EINW: Wort → Zeichen neben dem Feld.
const EINH3=/(?:^|\s)(?:[Ww]ie viele?|[Ii]n wie vielen|Fläche in)\s+(Minuten|Sekunden|Stunden|Tagen?|Wochen|Monaten?|Jahren?|Gramm|Kilogramm|Liter|Milliliter|Meter|Zentimeter|Kilometer|Euro|Cent|cm²|m²|cm|mm|km|kg|ml|g|m|l|€)(?=[\s?.,!]|$)/;
const EINW={Minuten:'min',Sekunden:'s',Stunden:'h',Tag:'Tage',Tagen:'Tage',Monaten:'Monate',Jahren:'Jahre',Gramm:'g',Kilogramm:'kg',Liter:'l',Milliliter:'ml',Meter:'m',Zentimeter:'cm',Kilometer:'km',Euro:'€'};
function frageTeile(t){t=String(t);let e='',m=t.match(EINH);if(m){e=m[1]||m[2];t=t.slice(0,m.index)+'?'}
 else if(m=t.match(EINH2)){e=m[1];t=t.slice(0,m.index)+'= ?'}
 else if(m=t.split(/[.!?]\s+/).pop().match(EINH3))e=EINW[m[1]]||m[1];// letzter Satz (ohne Lookbehind, das ältere iPads nicht kennen)
 return[de(t).replace(/([.?!])[ \t]+(?=[A-ZÄÖÜ„(0-9]|[a-z]\s*=)/g,'$1\n'),e]}
// Antwort mit Einheit: 60° (ohne Leerzeichen), sonst 12 cm, 40 €. Ganze Zahlen ab 10 000 mit schmalem Leerzeichen (seit 2026-10-24, gzf in aufgaben.js)
// Zeit-Wörter bei genau 1 in der Einzahl ("1 Tag", seit 2026-10-26)
const EINZ={Tage:'Tag',Wochen:'Woche',Monate:'Monat',Jahre:'Jahr'};
const mitEinheit=(v,e)=>(e=='€'&&!Number.isInteger(+v)?de((+v).toFixed(2)):de(Number.isInteger(+v)?gzf(+v):v))+(e?(e=='°'?'°':' '+(+v===1&&EINZ[e]||e)):'');// Geld immer mit zwei Nachkommastellen
// Themen als Knöpfe, geordnet nach Kategorien (KAT in aufgaben.js): Schulstoff der eigenen Klasse, Mathe-Olympiade & Knobeln,
// aufklappbar der Schulstoff früherer Klassen zum Wiederholen
// Knobel-Regel (seit 2026-10-20): Nach KNMAX fertigen Knobelrunden (Olympiade und Sudoku, KNOBEL in aufgaben.js) hintereinander
// sind die Knobel-Themen gesperrt, bis eine Runde Schulstoff (auch "Wiederholen") mit mindestens FREI von 10 geschafft ist. Zähler: k.kn
const KNMAX=2,knobelZu=(k,key)=>KNOBEL.has(key)&&(k.kn||0)>=KNMAX;
const KNHINWEIS=`Du hast ${KNMAX} Knobelrunden hintereinander gerechnet. Schaffe jetzt eine Runde Schulstoff mit mindestens ${FREI} von 10, dann kannst du wieder knobeln.`;
const themaKnopf=(k,key)=>{const zu=knobelZu(k,key);return`<button class="big${zu?' gesperrt':''}" onclick="start('${key}')"${zu?' disabled':''}><span>${THEMA[key][1]}</span>${dots(ts(k,key).d)}</button>`};
const undListe=a=>a.length>1?a.slice(0,-1).join(', ')+' und '+a[a.length-1]:String(a[0]);
const frueher=k=>KL.filter(g=>g<k.g);
// Thema aus einer früheren Klasse ("Wiederholen"): seit 2026-10-22 nur die Hälfte der Äpfel, aufgerundet, also mindestens 1 (Brain Dump)
const frueherThema=(k,key)=>!T[k.g].some(t=>t[0]===key);
// Kategorien: Schulstoff, Mathe-Olympiade & Knobeln, Sudoku (eigene Überschrift seit 2026-10-20), aufklappbar Wiederholen
// Wiederholen: Themen früherer Klassen ohne die, die schon in der eigenen Klasse oder einer früheren Klasse stehen (z. B. Einmaleins in Klasse 4 und 5)
const wdhListe=k=>{const da=new Set(T[k.g].map(t=>t[0]));return frueher(k).map(g=>[g,KAT[g].schul.filter(x=>!da.has(x)&&da.add(x))]).filter(([,L])=>L.length)};
// Hinweis (seit 2026-10-25): Themen früherer Klassen, die es auch in der eigenen Klasse gibt (z. B. das Einmaleins in Klasse 4 und 5), stehen nur oben
const wdhOben=k=>{const L=[...new Set(frueher(k).flatMap(g=>KAT[g].schul).filter(x=>KAT[k.g].schul.includes(x)))].map(x=>`„${THEMA[x][1]}“`);
 return L.length?(L.length>1?` Die Themen ${undListe(L)} stehen`:` Das Thema ${L[0]} steht`)+' oben bei deinem Schulstoff.':''};
function themen(k){if(S.an=='b')return themenB(k);if(S.an=='c')return themenC(k);// Ansichten B und C (seit 2026-10-26, menue.js)
 const K=KAT[k.g],fr=frueher(k),kz=(k.kn||0)>=KNMAX;
 return`<h3 class="kat">Schulstoff Klasse ${k.g}</h3>${K.schul.map(x=>themaKnopf(k,x)).join('')}<h3 class="kat">Mathe-Olympiade & Knobeln</h3>${kz?`<p class="small knsperre">${KNHINWEIS}</p>`:''}${K.oly.map(x=>themaKnopf(k,x)).join('')}<h3 class="kat">Sudoku</h3>${K.sud.map(x=>themaKnopf(k,x)).join('')}`+
  (fr.length?`<details class="wdh"><summary>Wiederholen: Klasse ${undListe(fr)}</summary><p class="small">Bei Themen früherer Klassen gibt es weniger Äpfel: auf Stufe 4 und 5 nur 1 statt 2.${wdhOben(k)}</p>${wdhListe(k).map(([g,L])=>`<h3 class="kat">Schulstoff Klasse ${g}</h3>${L.map(x=>themaKnopf(k,x)).join('')}`).join('')}</details>`:'')}
// Themen für die Eltern-Ansicht: eigene Klasse und wiederholte Themen früherer Klassen, die schon geübt wurden
const elternThemen=k=>[...new Set([...T[k.g].map(t=>t[0]),...frueher(k).flatMap(g=>KAT[g].schul).filter(x=>k.t[x]&&k.t[x].n)])].map(x=>THEMA[x]);
// Tageslimit erreicht: Rundflug beenden und verabschieden
function bye(){if(HF.mode=='fly')flyOff();v='bye';ui();scrollTo(0,0)}
// Nach Ablauf der Zeit (Abschied bzw. Rundenende): Steht das Pferd draußen und gibt es Unterstand oder Stall, wird gefragt,
// ob das Kind es noch hineinbringen möchte (seit 2026-10-24). REIN = 1, nachdem es das getan hat (Bestätigung statt Frage).
const byeHof=()=>{const k=cur&&kid();return!!(k&&k.h&&unterkunft(hh(k)))};
function reinFrage(k){const H=k&&k.h?hh(k):null,u=H?unterkunft(H):0;if(!u)return'';const ort=u==2?'Stall':'Unterstand';
 if(drinnen(H))return REIN?`<p class="ok"><b>${esc(H.name)} steht jetzt im ${ort}.</b></p>`:'';
 return`<div class="card reinfrage"><b>Möchtest du ${esc(H.name)} noch in den ${ort} bringen?</b><div class="row" style="margin-top:6px"><button class="go" onclick="byeRein()"${HF.fuehr?' disabled':''}>Ja, ${esc(H.name)} in den ${ort} bringen</button></div></div>`}
// Läuft noch das Herausholen (kurz vor Ablauf der Zeit gestartet), ist der Knopf gesperrt; am Ende der Animation wird neu gezeichnet
function byeRein(){if(HF.fuehr)return;REIN=1;fuehren()}
// Spielzeit messen: nur, solange ein Kind auf seinem Hof ist und die App sichtbar ist (auch im Rundflug, der läuft über der Kind-Ansicht)
let ZL=Date.now(),ZS=0;const ZV=['choose','kid','wish','rassen','quiz','done','einladen','train'];
setInterval(()=>{const now=Date.now(),dt=Math.min(5,(now-ZL)/1000);ZL=now;
 // Neues Kind vor der ersten Aufgabe: keine Zeit zählen
 const k=cur&&kid();if(!k||k.neu||document.visibilityState!='visible'||!ZV.includes(v))return;
 const t=tag();if(k.zd!=t){k.zd=t;k.zt=0}const vor=ausZeit(k);k.zt+=dt;
 if(now-ZS>15000){ZS=now;save()}
 // Hofzeit: zählt nur in Kind-Ansicht und Wunschbaum (der Rundflug läuft über der Kind-Ansicht), nicht während einer Runde
 // Während Pflege, Tierarzt und Hufschmied (pflege.js) zählt die Hofzeit nicht
 if((v=='kid'||v=='wish'||v=='rassen'||v=='einladen')&&k.h&&!k.hl&&!(HF.fuehr&&HF.fuehr.art&&v=='kid')){k.hz=(k.hz||0)+dt;const r=hofS(k)-k.hz;if(r<=0){sperren(k);return}countdown(r<=10?Math.ceil(r):0)}else countdown(0);
 if(!vor&&ausZeit(k)){save();if(v=='done')ui();else if(v!='quiz'&&v!='train')bye()}},1000);
// Countdown-Anzeige oben (auch über dem Rundflug). n = 0 blendet sie aus.
// Klasse cdlauf am body: solange der Countdown läuft, ist die Copyright-Zeile ausgeblendet (sie läge darunter)
function countdown(n){let el=document.getElementById('sperre');document.body.classList.toggle('cdlauf',!!n);if(!n){if(el)el.hidden=true;return}
 if(!el){el=document.createElement('div');el.id='sperre';el.setAttribute('role','status');document.body.appendChild(el)}
 el.hidden=false;el.innerHTML=`Gleich wird wieder gerechnet … <b>${n}</b>`}
// Hinweis bei gesperrtem Hof, mit der eingestellten Hofzeit des Kindes (seit 2026-10-27 eine Funktion, vorher fester Text mit 3 Minuten)
const sperrInfo=k=>`<div class="card" id="sperrinfo"><b>Zeit zum Rechnen!</b><p>Du warst ${hofM(k)} Minuten auf dem Hof. Löse jetzt eine Runde mit mindestens ${FREI} von 10 richtig, dann ist der Hof wieder offen.</p><p class="small" style="margin-bottom:0">Such dir unten ein beliebiges Thema aus.</p></div>`;
// Zu den Themen in der Kind-Ansicht springen
// Ansichten B und C (menue.js): Die Themen haben dort eine eigene Seite
function andersThema(){v='kid';if((S.an=='b'||S.an=='c')&&kid()&&kid().h){KT='themen';ui();scrollTo(0,0);return}ui();const e=$('#themen');if(e)e.scrollIntoView();else scrollTo(0,0)}
// Hofzeit ist um: Rundflug beenden, zurück zur Kind-Ansicht, Hof sperren
// Ansichten B und C: von Training, Pflege und Abzeichen zurück zur Übersicht (dort steht der Hinweis), die Themenseite bleibt offen
function sperren(k){k.hl=1;k.hz=0;countdown(0);if(HF.mode=='fly')flyOff();if(v=='wish'||v=='rassen'||v=='einladen')v='kid';if(KT&&KT!='themen')KT='';save();ui();scrollTo(0,0)}
// Beim Verlassen nur speichern, wenn gerade Zeit gezählt wurde (sonst könnte ein frisch gelöschter oder importierter Stand überschrieben werden)
document.addEventListener('visibilitychange',()=>{ZL=Date.now();if(document.visibilityState=='hidden'&&cur&&kid()&&ZV.includes(v))save()});
function mk(){let k=kid();if(ZW)return mk2();k.h={coat:CH,coats:[CH],name:($('#hn').value.trim()||'Fohlen'),own:{},bl:0,so:0};save();KT='';v='kid';ui()}// KT: Ansichten B und C beginnen mit der Übersicht
// ---------- Zweites Pferd (seit 2026-10-19) ----------
// ZW: Fohlenwahl für das zweite Pferd läuft gerade
let ZW=0;
function zweitWahl(){const k=kid();note='';if(k.h2)return;if(!ausgewachsen(k)){note=`Ein zweites Pferd gibt es, wenn ${esc(k.h.name)} ausgewachsen ist.`;ui();return}
 if((k.ap||0)<ZWEIT){note='Dafür fehlen noch Äpfel.';ui();return}ZW=1;CH='fuchs';v='choose';ui();scrollTo(0,0)}
// Neues Fohlen: wird das gewählte Pferd (es rechnet ab jetzt mit und wächst), das bisherige Pferd lebt als zweites Pferd auf dem Hof.
// Der Hof (Gegenstände, Lieblingspferde, Koppeln) wandert zum neuen Fohlen.
function mk2(){const k=kid(),a=hh(k);if(k.h2||!ausgewachsen(k)||(k.ap||0)<ZWEIT){ZW=0;v='wish';ui();return}
 k.ap-=ZWEIT;const n={coat:CH,coats:[CH],name:($('#hn').value.trim()||'Fohlen'),own:{},bl:0,so:0,it:a.it,lp:a.lp,ko:a.ko};
 delete a.it;delete a.lp;delete a.ko;a.st=stg(k);a.sd=k.sd||0;k.h2=a;k.h=n;k.st=0;k.sd=0;ZW=0;save();KT='';v='kid';ui();scrollTo(0,0)}
// Umschalten: das andere Pferd rechnet ab jetzt mit. Stufe und gesammelte Tage gehören zum Pferd, der heute gezählte Tag (ld) zum Kind,
// damit nicht durch Umschalten zwei Pferde am selben Tag wachsen.
function wechsel(){const k=kid();if(!k||!k.h2)return;GPNOTE='';const a=hh(k),b=k.h2;
 b.it=a.it;b.lp=a.lp;b.ko=a.ko;delete a.it;delete a.lp;delete a.ko;
 // Der Koppel-Wunsch "e:2" gilt für das jeweils andere Pferd und bleibt deshalb einfach stehen
 const st=b.st,sd=b.sd;a.st=stg(k);a.sd=k.sd||0;delete b.st;delete b.sd;k.st=st||0;k.sd=sd||0;k.h=b;k.h2=a;note='';save();ui()}
// Hinweis zeigen und in den sichtbaren Bereich holen (seit 2026-10-21, der Wunschbaum ist lang, der Hinweis steht oben)
function hinweis(m){note=m;ui();const n=$('#app p.no');if(n&&n.textContent)n.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})}
function wish(t,c){let k=kid(),H=hh(k),no=()=>hinweis('Dafür fehlen noch Äpfel.');note='';
 // zu wenig Erfahrung: nichts kaufen (Besitz bleibt nutzbar, siehe gesperrt())
 const xp=(g,hat)=>{if(!gesperrt(k,g,hat))return 0;hinweis(`Dafür brauchst du ${XPF[g]} Erfahrung. Du hast ${k.xp}.`);return 1};
 if(t=='coat'){if(xp('coat',H.coats.includes(c)))return;if(!H.coats.includes(c)){if((k.ap||0)<25)return no();k.ap-=25;H.coats.push(c)}H.coat=c}
 else if(t=='ma'||t=='zk'||t=='gu'){
  if(t=='ma'){if(xp('ma'))return;H.ma=c;if(c!='lang')H.zo=0}
  else if(t=='zk'){if(xp('zopf',H.zk))return;if(!H.zk){if((k.ap||0)<PREIS.zopf)return no();k.ap-=PREIS.zopf;H.zk=1;H.zo=1}else H.zo=H.zo?0:1;if(H.zo)H.ma='lang'}
  else{if(xp('zopf',H.zk))return;if(!H.gus.includes(c)){if((k.ap||0)<PREIS.gummi)return no();k.ap-=PREIS.gummi;H.gus.push(c)}H.gu=c}}
 else if(t=='lp'){if(H.lp.includes(c)||!LIEB.some(l=>l[0]==c))return;if(xp('lieb'))return;if((k.ap||0)<PREIS.lieb)return no();k.ap-=PREIS.lieb;H.lp.push(c)}
 else if(t=='it'){if(H.it[c]||!ITEMS.some(x=>x[0]==c))return;if(itZu(k,c)){hinweis(`Dafür brauchst du ${ITXP[c]||XPF.it} Erfahrung. Du hast ${k.xp}.`);return}const p=ITEMS.find(x=>x[0]==c)[2];if((k.ap||0)<p)return no();k.ap-=p;H.it[c]=1}
 else if(t=='au'){const a=AUSR.find(x=>x[0]==c);H.au=H.au||{};if(!a||H.au[c])return;if((k.ap||0)<a[2])return no();k.ap-=a[2];H.au[c]=1}
 // Motto (seit 2026-10-23): kaufen nur, solange es läuft, mit Hufeisen; danach kostenlos an und aus
 else if(t=='mt'){if(!THEMEN.includes(c))return;const mt=k.mt||{};
  if(Object.prototype.hasOwnProperty.call(mt,c))mt[c]=mt[c]?0:1;
  else{if(c!==thema())return;if((k.hu||0)<MOTTOPREIS)return hinweis('Dafür fehlen noch Hufeisen.');k.hu-=MOTTOPREIS;mt[c]=1}
  k.mt=mt}
 else if(t!='bl'&&t!='so')return;// nur Blesse und Socken; Unbekanntes (z. B. die alten Fähigkeiten "sk") kauft nichts
 else if(!H.own[t]){if(xp('abz'))return;if((k.ap||0)<15)return no();k.ap-=15;H.own[t]=1;H[t]=1}else H[t]=H[t]?0:1;
 save();ui()}
// ---------- Hof ausbauen (seit 2026-10-18, siehe Notiz "Hof ausbauen") ----------
// Preise und Bedingungen: Koppel 2 ab 7500 Erfahrung (bis 2026-10-18: 2000), Koppel 3 ab 10000 (vorher 5000), je 30 Äpfel; Unterstand je Koppel 25 Äpfel; Stall (Ausbau auf der Hauptkoppel) 15 Äpfel, wenn das eigene Pferd ausgewachsen ist.
// Erfahrung (ITXP, seit 2026-10-24): Unterstand ab 750, Ausbau zum Stall ab 1250
const KOPPEL={preis:30,xp:[0,7500,10000],unterstand:25,stall:15},KNAME=['Hauptkoppel','Koppel 2','Koppel 3'];
// Plätze einer Koppel (das eigene Pferd belegt auf der Hauptkoppel einen Platz)
const kap=(H,i)=>i>=H.ko.n?0:i==0?[1,2,4][H.ko.u[0]]:[0,2][H.ko.u[i]];
// Freunde eines Pferds: die gekauften Lieblingspferde ("l:roy"). Rassen-Freunde ("r:hafl") gibt es seit 2026-10-19 nicht mehr.
// Das zweite eigene Pferd ("e:2") steht vorn und bekommt damit zuerst einen Platz
const freunde=H=>{const k=kid();return[...(k&&k.h===H&&k.h2?['e:2']:[]),...LIEB.filter(l=>H.lp.includes(l[0])).map(l=>'l:'+l[0])]};
function freundInfo(k,f){if(f=='e:2'){const p=k.h2;return{id:'e'+k.id,c:p.coat,st:p.st,m:{...pfSpec(p,p.st),...(dreckig(p)?{dr:1}:{})},name:p.name,own:0,zweit:1,f}}
 const id=f.split(':')[1],l=LIEB.find(x=>x[0]==id);return{id:'l'+k.id+id,c:l[3].coat,st:l[3].st,m:{...l[3],bl:0,so:0},name:l[1],own:0,f}}
// Verteilung: gewünschte Koppel, wenn dort Platz ist; sonst der erste freie Platz (Hauptkoppel, Koppel 2, Koppel 3); sonst Warteliste
function belegung(H){const p=[['eigen'],[],[]],offen=[],w=[];
 for(const f of freunde(H)){const z=H.ko.z[f];if(z!=null&&p[z].length<kap(H,z))p[z].push(f);else offen.push(f)}
 for(const f of offen){const i=[0,1,2].find(i=>p[i].length<kap(H,i));if(i!=null)p[i].push(f);else w.push(f)}
 return{p,w}}
function platzText(H){const b=belegung(H),frei=[0,1,2].reduce((s,i)=>s+kap(H,i)-b.p[i].length,0);
 return`${H.ko.n} Koppel${H.ko.n>1?'n':''} · ${frei} ${frei==1?'Platz':'Plätze'} frei`+(b.w.length?` · ${b.w.length} warte${b.w.length==1?'t':'n'} auf einen Platz`:'')}
// Hinweis in der Kind-Ansicht, wenn Pferde auf einen Platz warten
const wartetHinweis=k=>{if(!k.h||k.hl)return'';const w=belegung(hh(k)).w.length;return w?`<div class="card small" style="margin-top:8px">${w} Pferd${w>1?'e warten':' wartet'} auf einen Platz. Im Wunschbaum unter „Hof ausbauen“ und „Koppeln“ kannst du Unterstände bauen.</div>`:''};
// Karten im Bereich "Hof ausbauen" (seit 2026-10-23): t = 1 Unterstand, 2 Ausbau zum Stall (beide auf der Hauptkoppel, gleiche Erfahrungs-Grenze wie die Gegenstände)
function gebKarte(k,H,t){const u=H.ko.u[0],id=t==1?'unterstand':'ausbau',zu=itZu(k,id,u>=t),preis=p=>p+' '+AP;
 if(t==1)return`<button class="pick it geb ${u?'on':''}${zu?' gesperrt':''}" data-geb="unterstand" onclick="hofBau('unterstand',0)"${zu?' disabled':''}>${itemBild('unterstand')}Unterstand<br><span class="small">2 Plätze</span><br>${u==2?'zum Stall ausgebaut':u?'gebaut':zu?`<span class="small">${itNoch(k,id)}</span>`:preis(KOPPEL.unterstand)}</button>`;
 const geht=u==1&&ausgewachsen(k)&&!zu;
 return`<button class="pick it geb ${u==2?'on':''}${u!=2&&!geht?' gesperrt':''}" data-geb="stall" onclick="hofBau('stall',0)"${u!=2&&!geht?' disabled':''}>${itemBild('pferdestall')}Stall<br><span class="small">Ausbau des Unterstands, 4 Plätze</span><br>${u==2?'gebaut':zu?`<span class="small">${itNoch(k,id)}</span>`:u!=1?'erst Unterstand bauen':!ausgewachsen(k)?`wenn ${esc(H.name)} ausgewachsen ist`:preis(KOPPEL.stall)}</button>`}
// Bereich "Motto" im Wunschbaum (seit 2026-10-23), nur solange ein Motto läuft
function mottoTeil(k,th){const [n,b,bis]=THINFO[th],hat=!!(k.mt&&Object.prototype.hasOwnProperty.call(k.mt,th)),an=mottoAn(k,th);
 return`<p class="small">${b} auf deinem Hof, nur bis ${bis}. Einmal gekauft kommt das Motto jedes Jahr wieder.</p><div class="row"><button class="${an?'go':'alt'}" data-mt="${th}" onclick="wish('mt','${th}')" aria-pressed="${an}">${n}${hat?(an?' an':' aus'):` · ${MOTTOPREIS} ${HU}`}</button></div>`+
  (!hat&&(k.hu||0)<MOTTOPREIS?`<p class="small">Du hast ${k.hu||0} von ${MOTTOPREIS} Hufeisen. Hufeisen gibt es für Runden mit mindestens ${FREI} von 10 richtig und für Sterne im Training.</p>`:'')}
// Bauen, Ausbauen und Pferde verteilen
function hofBau(t,i,f){const k=kid(),H=hh(k),no=m=>hinweis(m||'Dafür fehlen noch Äpfel.');note='';
 if(t=='koppel'){if(i!==H.ko.n||i>2)return;if(k.xp<KOPPEL.xp[i])return no(`Dafür brauchst du ${KOPPEL.xp[i]} Erfahrung.`);if((k.ap||0)<KOPPEL.preis)return no();k.ap-=KOPPEL.preis;H.ko.n=i+1}
 else if(t=='unterstand'){if(i>=H.ko.n||H.ko.u[i])return;if(itZu(k,'unterstand'))return no(`Dafür brauchst du ${ITXP.unterstand} Erfahrung.`);if((k.ap||0)<KOPPEL.unterstand)return no();k.ap-=KOPPEL.unterstand;H.ko.u[i]=1}
 else if(t=='stall'){if(H.ko.u[0]!==1)return;if(itZu(k,'ausbau'))return no(`Dafür brauchst du ${ITXP.ausbau} Erfahrung.`);if(!ausgewachsen(k))return no(`Den Stall kannst du bauen, wenn ${esc(H.name)} ausgewachsen ist.`);if((k.ap||0)<KOPPEL.stall)return no();k.ap-=KOPPEL.stall;H.ko.u[0]=2}
 else if(t=='zu'){const b=belegung(H);if(!freunde(H).includes(f)||!(b.p[i].includes(f)||b.p[i].length<kap(H,i)))return;H.ko.z[f]=i}
 save();ui()}
// Abzeichen neu anordnen (kostenlos): Kopfform, Socken je Bein (mindestens ein Bein weiß) und Schecken-Flecken neu auswürfeln
const kannAnordnen=H=>!!(H.bl||H.so||H.coat=='schecke');
function anordnen(){const H=hh(kid());let x;
 if(H.bl){do{x=R(0,4)}while(x===(H.bf==null?3:H.bf));H.bf=x}
 if(H.so){do{x=[0,1,2,3].map(()=>R(0,3)).join('')}while(!/[1-3]/.test(x)||x===H.sm);H.sm=x}
 if(H.coat=='schecke')H.fs=R(1,99999);
 save();ui()}
// Fehlerheft: falsch beantwortete Aufgaben (max. 30 pro Kind). Pro Runde kommen bis zu 3 davon aus dem gewählten Thema erneut dran.
const ms=k=>k.mist||(k.mist=[]);
const mcount=k=>(k.mist||[]).filter(x=>THEMA[x.key]).length;
function start(key){GPNOTE='';if(ausZeit(kid()))return bye();let k=kid();if(knobelZu(k,key)){andersThema();return}if(k.neu){delete k.neu;save()}// erste Aufgabe: ab jetzt läuft die Zeit
 let rep=ms(k).filter(x=>x.key==key).map(x=>x.q).sort(()=>Math.random()-.5).slice(0,3),pool=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
 Q={key,i:0,right:0,hint:0,gain:0,ap:0,grow:'',newb:[],fb:null,seen:[],rep,slots:pool.slice(0,rep.length),rp:0,mast:0};Q.q=gen();v='quiz';ui()}
const gen=()=>{let k=kid(),t=THEMA[Q.key],q,n=0;Q.rp=0;
 if(Q.rep.length&&Q.slots.includes(Q.i)){Q.rp=1;q=Q.rep.shift();Q.seen.push(q[0]);return q}
 do{q=t[2](ts(k,Q.key).d)}while((Q.seen.includes(q[0])||Q.rep.some(r=>r[0]==q[0]))&&++n<20);
 Q.seen.push(q[0]);return q};
// Tipp anzeigen, ohne die bereits getippte Antwort zu verlieren (ui() baut die Seite neu auf)
function tip(){let el=$('#ans'),val=el?el.value:'';Q.hint=1;ui();let n=$('#ans');if(n)n.value=val}
// k.gl: zuletzt richtig gelöste Aufgaben [{key, d (Stufe), q}]. Das Training fragt nur solche ab (Brain Dump 2026-10-22). GLMAX steht oben bei PREIS.
function glMerken(k,key,d,q){if(q[4]||!Number.isFinite(+q[1])||!SCHUL.has(key)||String(q[0]).length>130)return;const L=k.gl||(k.gl=[]),i=L.findIndex(x=>x.q[0]===q[0]);if(i>=0)L.splice(i,1);L.push({key,d,q:[q[0],q[1],q[2]||'',q[3]||'']});if(L.length>GLMAX)L.shift()}
// Eingabe lesen (seit 2026-10-24, wegen der großen Zahlen in Klasse 4): Leerzeichen vor Dreiergruppen zählen nicht ("250 000"), Komma ist das Dezimalzeichen.
// Sieht die Eingabe wie eine Zahl mit Tausenderpunkten aus ("250.000"), gilt sie zusätzlich auch so. Ergebnis: Liste der möglichen Werte, leer = keine Zahl.
function eingabe(v){const t=String(v).trim().replace(/(\d)\s+(?=\d{3}(?!\d))/g,'$1').replace(/−/g,'-'),d=t.replace(',','.'),w=[];// \s erfasst auch geschützte und schmale Leerzeichen
 if(d!==''&&!isNaN(d))w.push(+d);if(/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(t))w.push(+t.replace(/\./g,''));return w}
// Erklärung auch bei richtiger Antwort (Brain Dump 2026-10-25, falls geraten): auf Knopfdruck, bei Logik-Rätseln gleich offen
const warumOffen=()=>!!(Q&&(Q.warum||Q.key==='logik'));
function chk(){let k=kid(),s=ts(k,Q.key),w=eingabe($('#ans').value);if(!w.length)return $('#ans').focus();
 let ok=w.some(x=>Math.abs(x-Q.q[1])<1e-9),g=0,a=0,m='';k.total++;s.n++;
 // Für die Aufgabenseiten (menue.js): richtig/falsch je Aufgabe (Hufeisen, Striche, Hindernisse) und die Eingabe zum Anzeigen
 (Q.erg||(Q.erg=[]))[Q.i]=ok;Q.ein=String($('#ans').value).trim().slice(0,20);
 if(ok){s.r++;k.r++;k.s++;k.best=Math.max(k.best,k.s);Q.right++;g=Math.round((8+3*s.d)*(Q.hint?.5:1))+(k.s>=5?5:0);a=1+(s.d>=4?1:0);if(frueherThema(k,Q.key))a=Math.ceil(a/2);k.xp+=g;k.ap=(k.ap||0)+a;Q.gain+=g;Q.ap+=a;s.run=s.run>0?s.run+1:1;
  glMerken(k,Q.key,s.d,Q.q);
  if(s.run>=3&&s.d<5){s.d++;s.run=0;m='Stufe '+s.d+' erreicht!'}}
 else{k.s=0;s.run=s.run<0?s.run-1:-1;if(s.run<=-2&&s.d>1){s.d--;s.run=0;m='Wir üben eine Stufe leichter.'}}
 BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}});
 let L=ms(k),ix=L.findIndex(x=>x.key==Q.key&&x.q[0]==Q.q[0]);
 if(ok){if(ix>=0){L.splice(ix,1);Q.mast++}}else if(ix<0){L.push({key:Q.key,q:Q.q});if(L.length>30)L.shift()}
 Q.fb={ok,g,a,m,an:ok?trAnim(k.h):null};Q.ts=Date.now();save();ui()}
function nx(){Q.i++;if(Q.i>=10){let k=kid();if(Q.right==10){k.perfect++;BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}})}
  // Runde fertig: Der Tag zählt fürs Wachstum (einmal pro Tag)
  // Hof-Sperre: Eine Runde mit mindestens FREI von 10 richtig öffnet den Hof und startet die Hofzeit neu
  if(Q.right>=FREI){k.hz=0;if(k.hl){delete k.hl;Q.frei=1}}else if(k.hl)Q.zu=1;
  // Hufeisen (seit 2026-10-22): eins für jede Runde mit mindestens FREI von 10, egal welches Thema
  if(Q.right>=FREI){Q.hu=huPlus(k);Q.huvoll=!Q.hu}
  // Knobel-Regel: Knobelrunde zählt mit, Schulstoff mit mindestens FREI von 10 setzt zurück
  if(KNOBEL.has(Q.key))k.kn=(k.kn||0)+1;else if(Q.right>=FREI){if((k.kn||0)>=KNMAX)Q.knfrei=1;k.kn=0}else if((k.kn||0)>=KNMAX)Q.knzu=1;
  const w=tagZaehlt(k),st=stg(k);Q.grow=w.grow||'';
  Q.tg=w.neu&&k.h&&st<3?(w.grow?`Bis „${GS[st+1].n}“ braucht es jetzt ${TAGE[st]} Tage mit Mathe.`:`Heute zählt fürs Wachstum: Tag ${k.sd} von ${TAGE[st]} bis „${GS[st+1].n}“.`):'';
  save();v='done'}else{Q.q=gen();Q.fb=null;Q.hint=0;Q.warum=0}ui()}
// Sperren: muss eine Funktion sein. In onclick-Attributen würde "open=false" sonst document.open überschreiben statt diese Variable.
function lock(){open=false;ui()}
// PIN vergessen (seit 2026-10-22, Brain Dump): Auf jeder Seite, die nach der PIN fragt (Eltern-Ansicht, Startabfrage "Elternteil" und
// "Kind" auf einem Gerät mit PIN), erscheint nach 5 schnellen Tipps (innerhalb von 3 Sekunden, irgendwo auf den Bildschirm) oben rechts
// ein kleines "i". Damit lässt sich eine neue PIN festlegen. Danach (oder beim Verlassen der Seite) ist das "i" wieder unsichtbar.
let PINI=0,PINR=0,PINT=[],PINL=0,PINMSG='';
// PIN-Sperre (seit 2026-10-24, Brain Dump): Nach PINMAX falschen Eingaben (alle PIN-Felder zusammen: Eltern-Ansicht, Startabfrage, neues Kind)
// ist die App eine Stunde gesperrt. Kein Kind kommt auf den Hof, es lässt sich keine PIN eingeben, das "i" erscheint nicht.
// Danach gibt es wieder PINMAX Versuche. Eine richtige PIN setzt den Zähler zurück. Gespeichert in S.pf (Fehlversuche) und S.ps (gesperrt bis).
const pinZu=()=>!!S.pin&&!!S.ps&&Date.now()<S.ps;
const pinUhr=()=>{const d=new Date(S.ps);return pd(d.getHours())+':'+pd(d.getMinutes())};
const pinZuKarte=()=>`<div class="card pinzu"><b>Gesperrt bis ${pinUhr()} Uhr</b><p class="small">Die Eltern-PIN wurde ${PINMAX}-mal falsch eingegeben. Deshalb kann bis dahin kein Kind auf den Hof und es lässt sich keine PIN eingeben. Danach gibt es wieder ${PINMAX} Versuche.</p></div>`;
// Prüft eine eingegebene PIN: true, wenn sie stimmt, sonst der Hinweistext (mit den verbleibenden Versuchen bzw. der Sperre)
function pinPruef(p){if(pinZu())return`Gesperrt bis ${pinUhr()} Uhr.`;if(pinGleich(p)){if(S.pf){delete S.pf;save()}return true}
 S.pf=(S.pf||0)+1;if(S.pf>=PINMAX){delete S.pf;S.ps=Date.now()+PINSPERRE;PINI=0;PINR=0;save();return`Die PIN wurde ${PINMAX}-mal falsch eingegeben. Gesperrt bis ${pinUhr()} Uhr.`}
 save();const r=PINMAX-S.pf;return`Falsche PIN. Noch ${r} ${r==1?'Versuch':'Versuche'}.`}
// Sperre abgelaufen: aufräumen und die Startseite bzw. Eltern-Ansicht neu zeichnen
setInterval(()=>{if(S.ps&&Date.now()>=S.ps){delete S.ps;save();if(v=='home'||v=='parent')ui()}},5000);
const pinSeite=()=>!!S.pin&&!pinZu()&&((v=='parent'&&!open)||(v=='home'&&(EIN=='e'||(EIN=='k'&&!EINPIN))));
const pinI=()=>PINI&&!PINR?`<button class="pini" onclick="PINR=1;ui()" aria-label="PIN zurücksetzen">i</button>`:'';
const pinResetKarte=()=>PINR?`<div class="card"><b>PIN vergessen?</b><p class="small">Lege eine neue PIN fest (mindestens 4 Zeichen).${v=='parent'?' Danach ist die Eltern-Ansicht offen.':' Danach gibst du sie oben ein.'}</p><input id="pinr" type="password" inputmode="numeric" maxlength="8" aria-label="Neue PIN" onkeydown="if(event.key=='Enter')pinReset()"> <button onclick="pinReset()">Neue PIN speichern</button> <button class="alt" onclick="PINI=0;PINR=0;ui()">Abbrechen</button><p class="no">${pw}</p></div>`:'';
// Tipps zählen: Touch, Stift und Maus (ein Tipp kann mehrere Ereignisse auslösen, deshalb höchstens eins je 60 ms)
let PINTOUCH=0;
function pinTipp(e){if(e&&e.type=='touchstart')PINTOUCH=Date.now();if(e&&e.type=='mousedown'&&Date.now()-PINTOUCH<800)return;if(!pinSeite()||PINI)return;const t=Date.now();if(t-PINL<60)return;PINL=t;PINT=[...PINT.filter(x=>t-x<3000),t];
 if(PINT.length>=5){PINT=[];PINI=1;const el=$('#pin')||$('#pin0'),w=el?el.value:'',id=el&&el.id;ui();const nn2=id&&$('#'+id);if(nn2)nn2.value=w}}
(window.PointerEvent?['pointerdown']:['touchstart','mousedown']).forEach(e=>document.addEventListener(e,pinTipp,{passive:true}));
function pinReset(){if(pinZu())return ui();const el=$('#pinr'),p=el?el.value.trim():'';if(p.length<4){pw='Die PIN braucht mindestens 4 Zeichen.';ui();pw='';return}
 S.pin=pinHash(p);delete S.np;delete S.pf;delete S.ps;PINI=0;PINR=0;// neue PIN: alte Fehlversuche zählen nicht mehr
 if(v=='parent'){S.mo='e';open=true;warn='';save();ui()}else{save();PINMSG='Neue PIN gespeichert. Gib sie jetzt oben ein.';ui();PINMSG=''}}
function unl(){const el=$('#pin');let p=el?el.value:'';if(!p)return;const r=pinPruef(p);if(r===true)open=true;else{warn=r;ui();warn='';return}ui()}
function gr(id,g){let k=S.kids.find(x=>x.id==id);k.g=+g;
 // Haken "noch nicht dran" gelten nur für die eigene Klasse: beim Klassenwechsel fallen die alten weg (seit 2026-10-24)
 if(k.nd){k.nd=k.nd.filter(x=>KAT[k.g].schul.includes(x));if(!k.nd.length)delete k.nd}save();ui()}
// Schulstoff "im Unterricht schon dran" (seit 2026-10-24, Brain Dump): In der Eltern-Ansicht je Kind ein Haken pro Thema der eigenen Klasse.
// Nicht angehakte Themen (k.nd) kommen im Training nicht dran, üben kann das Kind sie trotzdem. NDAUF: die Liste dieses Kinds bleibt aufgeklappt.
let NDAUF=null;
function ndListe(k){const L=KAT[k.g].schul,nd=k.nd||[],dran=L.filter(x=>!nd.includes(x)).length;
 return`<details class="ndl"${NDAUF==k.id?' open':''}><summary>Schulstoff im Unterricht: ${dran} von ${L.length} Themen schon dran</summary><p class="small">Nimm den Haken weg bei Themen, die in der Schule noch nicht dran waren. Sie kommen dann im Training nicht vor. Üben kann ${esc(k.name)} sie trotzdem.</p>`+
  L.map(x=>`<label class="ndz"><input type="checkbox" data-nd="${x}"${nd.includes(x)?'':' checked'} onchange="ndSetz(${k.id},'${x}',this.checked)"> ${THEMA[x][1]}</label>`).join('')+`</details>`}
function ndSetz(id,key,dran){const k=S.kids.find(x=>x.id==id);if(!k||!KAT[k.g].schul.includes(key))return;const nd=new Set(k.nd||[]);if(dran)nd.delete(key);else nd.add(key);
 if(nd.size)k.nd=[...nd];else delete k.nd;NDAUF=id;save();ui()}
// Tageslimit je Kind (Eltern-Ansicht): 0 = kein Limit, sonst 5 bis LIMMAX Minuten in 5er-Schritten. Wirkt sofort, auch am selben Tag.
const limOptionen=k=>[0,...Array.from({length:LIMMAX/5},(_,i)=>(i+1)*5)].map(m=>`<option value="${m}"${limM(k)==m?' selected':''}>${m?m+' Minuten':'kein Limit'}</option>`).join('');
function lim(id,m){let k=S.kids.find(x=>x.id==id);m=+m;if(!k||!Number.isInteger(m)||m<0||m>LIMMAX||m%5)return;k.lm=m;save();ui()}
// Hofzeit je Kind (Eltern-Ansicht, seit 2026-10-27): 3 bis 10 Minuten im Minutenschritt, dann 15, 20, 25, 30. Wirkt sofort.
// Wird sie kürzer als die schon verbrauchte Hofzeit, bleiben noch 10 Sekunden für den Countdown (keine Sperre ohne Vorwarnung).
const hofOptionen=k=>HOFM.map(m=>`<option value="${m}"${hofM(k)==m?' selected':''}>${m} Minuten</option>`).join('');
function hofzeit(id,m){let k=S.kids.find(x=>x.id==id);m=+m;if(!k||!HOFM.includes(m))return;k.hm=m;
 if(!k.hl&&(k.hz||0)>hofS(k)-10)k.hz=Math.max(0,hofS(k)-10);save();ui()}
function rst(id){if(!confirm('Fortschritt wirklich zurücksetzen? Das Pferd beginnt wieder als Fohlen.'))return;let k=S.kids.find(x=>x.id==id);delete k.ld;delete k.hl;delete k.hu;delete k.mt;Object.assign(k,{kn:0,xp:0,st:0,sd:0,hz:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{},mist:[]});delete k.gl;if(k.h){k.h.coats=[k.h.coat];k.h.own={};k.h.bl=0;k.h.so=0;k.h.tr={};k.h.tl={};delete k.h.tz;k.h.au={};delete k.h.hs;delete k.h.ge;k.h.it={};k.h.lp=[];k.h.ko={n:1,u:[0,0,0],z:{}}}delete k.h2;save();ui()}
function del(id){if(!confirm('Kind samt Fortschritt löschen?'))return;S.kids=S.kids.filter(x=>x.id!=id);save();ui()}
function exp(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='rechenhof-sicherung.json';a.click()}
function imp(el){let f=el.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let d=clean(JSON.parse(r.result));if(!d)throw 0;if(!confirm('Aktuellen Stand durch die Sicherung ersetzen? Der PIN-Schutz wird aus der Sicherung übernommen.'))return;if(!d.pin)d.np=1;if(!d.mo)d.mo=d.pin?'e':'k';S=d;save();ui()}catch(e){warn='Datei konnte nicht gelesen werden.';ui()}};r.readAsText(f)}
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&!e.repeat&&v=='quiz'&&Q&&Q.fb&&Date.now()-Q.ts>250&&document.activeElement.tagName!='BUTTON'){e.preventDefault();nx()}});
// Wiehern: wird beim Klick live per Web Audio erzeugt (keine Audiodatei, kein Netzwerk)
let AC=null,lastN=0;
function neigh(st){try{if(Date.now()-lastN<700)return;lastN=Date.now();
 AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();
 let t=AC.currentTime,sc=[1.35,1.2,1.05,.95][st],T=1.25,out=AC.createGain(),mg=AC.createGain(),o=AC.createOscillator(),vb=AC.createOscillator(),vg=AC.createGain(),am=AC.createOscillator(),ag=AC.createGain(),a2=AC.createGain(),b1=AC.createBiquadFilter(),b2=AC.createBiquadFilter(),m2=AC.createGain(),lp;
 o.type='sawtooth';o.frequency.setValueAtTime(450*sc,t);o.frequency.exponentialRampToValueAtTime(1050*sc,t+.2);o.frequency.exponentialRampToValueAtTime(800*sc,t+.5);o.frequency.exponentialRampToValueAtTime(400*sc,t+T);
 vb.frequency.value=13;vg.gain.value=30*sc;vb.connect(vg);vg.connect(o.frequency);
 b1.type='bandpass';b1.frequency.value=1000;b1.Q.value=1.4;b2.type='bandpass';b2.frequency.value=2600;b2.Q.value=2;m2.gain.value=.5;
 o.connect(b1);o.connect(b2);b2.connect(m2);b1.connect(a2);m2.connect(a2);a2.connect(out);
 a2.gain.value=.75;am.frequency.value=17;ag.gain.value=.25;am.connect(ag);ag.connect(a2.gain);
 out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.7,t+.1);out.gain.setValueAtTime(.7,t+.6);out.gain.linearRampToValueAtTime(0,t+T);
 mg.gain.value=.5;lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4500;out.connect(mg);mg.connect(lp);lp.connect(AC.destination);
 [o,vb,am].forEach(x=>x.start(t));[o,vb,am].forEach(x=>x.stop(t+T+.05))}catch(e){}}
function snd(){S.snd=S.snd===0?1:0;save();ui()}
// Start: Wurde die App über einen Besuchs-Link geöffnet, zuerst den Besuch zeigen
if(besuchAusLink())v='besuch';
ui();
