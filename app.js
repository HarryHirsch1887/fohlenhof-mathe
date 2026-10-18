// Pferdehof Mathe (früher Fohlenhof Mathe): Spiellogik, Oberfläche und Speicher (benötigt aufgaben.js)
// Nur der angezeigte Name hat sich geändert. Adresse, Repository und Speicherschlüssel heißen weiter "fohlenhof".
const BD=[['a','Erster Schritt',k=>k.total>=1],['b','Serie von 5',k=>k.best>=5],['c','Serie von 10',k=>k.best>=10],['d','Fehlerfreie Runde',k=>k.perfect>0],['e','100 richtig',k=>k.r>=100],['f','Auf Stufe 5',k=>Object.values(k.t).some(x=>x.d==5)]];
// Fellfarben: [Name, Fell, Mähne, Schecke (1 = weiße Flecken), dunkle Beine und Aalstrich (Farbe)]
const COATS={fuchs:['Fuchs','#b5612b','#6e3414'],braun:['Brauner','#7b4a2a','#1c1410'],rappe:['Rappe','#2b2b30','#111114'],schimmel:['Schimmel','#e8eaec','#b9bec4'],palomino:['Palomino','#dfb25f','#f7f0df'],schecke:['Schecke','#b5612b','#e6d3a6',1],
 falbe:['Falbe','#cfae7c','#4a3b31',0,'#3b2f28'],wind:['Windfarben','#2b2628','#ece2c8']};
// Wachstumsstufen: x = Erfahrung ab, s = Größe in der Szene, rx/ry = Körper, h = Kopfgröße, l = sichtbare Beinlänge
const GS=[{n:'Fohlen',x:0,s:.72,rx:33,ry:17,h:1.05,l:66,w:5.5,nk:.45},{n:'Jährling',x:250,s:.8,rx:42,ry:21,h:1.0,l:58,w:7.5,nk:.7},{n:'Jungpferd',x:700,s:.9,rx:50,ry:24,h:.97,l:51,w:9,nk:.88},{n:'Pferd',x:1500,s:1,rx:58,ry:28,h:.95,l:46,w:10,nk:1}];
// Wachstum über Tage mit Mathe (seit 2026-10-16): Ein Tag zählt, wenn an ihm mindestens eine Runde fertig gerechnet wurde (höchstens einmal pro Tag).
// Jährling nach 3 Tagen, Jungpferd nach weiteren 5, Pferd nach weiteren 10. Fallen Tage aus, bleiben die gesammelten Tage erhalten.
// x (Erfahrung) wird nur noch für alte Spielstände gebraucht: Sie behalten ihre bisher erreichte Stufe. Erfahrung schaltet künftig Extras frei.
const TAGE=[3,5,10],D3AB=2;// D3AB: 3D-Fenster ab Jungpferd
// Tageslimit: 20 Minuten pro Kind und Kalendertag, fest eingestellt. Eine laufende Runde wird nicht unterbrochen.
const LIMIT=30*60;// seit 2026-10-18 30 Minuten (vorher 20)
const LIMIN=LIMIT/60;
// Hof-Sperre: Nach 3 Minuten auf dem Hof (Kind-Ansicht, Wunschbaum, Rundflug) läuft ein Countdown von 10 Sekunden,
// danach muss erst wieder eine Runde mit mindestens 75 % (8 von 10) geschafft werden. Gespeichert: hz = Hofzeit in Sekunden, hl = gesperrt
const HOFZEIT=180,FREI=7;// FREI: seit 2026-10-18 reichen 7 von 10 (vorher 8)
// Neue Kinder erstellen zuerst ihre Figur (figur.js) und dürfen nach 5 richtigen Aufgaben ihr Fohlen aussuchen
const FOHLEN=5;
const BR={std:{n:'Warmblut',rx:1,ry:1,l:1,nk:1,mw:1,tl:1,h:1,fe:0},hafl:{n:'Haflinger',mc:'#f0deb0',rx:1.04,ry:1.08,l:.9,nk:1.12,mw:1.5,tl:1.15,h:1,fe:0},isl:{n:'Isländer',rx:1,ry:1.08,l:.8,nk:1.15,mw:1.9,tl:1.35,h:1,fe:0},voll:{n:'Vollblut',rx:1.06,ry:.9,l:1.1,nk:.85,mw:.6,tl:.9,h:.93,fe:0},fries:{n:'Friese',rx:1.05,ry:1.05,l:1,nk:1.2,mw:1.9,tl:1.4,h:1,fe:1}};
const SK=[['jump','Springen'],['gal','Galopp'],['aus','Ausdauer'],['ges','Geschick']];
// Mähne und Zöpfe: Mähnenlänge ab Jährling kostenlos. Zöpfe (mit rosa Gummi) und weitere Gummifarben kosten Äpfel.
// Gespeichert am Pferd: ma = Mähnenlänge, zk = Zöpfe gekauft, zo = Zöpfe an, gu = Gummifarbe, gus = gekaufte Gummifarben
const MA={kurz:'Kurz',mittel:'Mittel',lang:'Lang'};
const GUMMI={rosa:['Rosa','#e8508f'],lila:['Lila','#9b59b6'],blau:['Hellblau','#4aa3df'],gelb:['Gelb','#f4c430'],weiss:['Weiß','#f2f2f2']};
// lieb: Preis eines Lieblingspferds. VORLÄUFIG, der Preis wird noch festgelegt.
// leg/shirt: je weitere Farbe für Reitleggings bzw. Reitshirt der Figur (vorläufig)
const PREIS={zopf:10,gummi:3,lieb:50,leg:10,shirt:10};
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
// Prüft und bereinigt einen Spielstand (aus dem Browser oder einer importierten Datei). Gibt null zurück, wenn er unbrauchbar ist.
const nn=(x,lo=0,hi=1e9)=>{x=+x;return Number.isFinite(x)?Math.min(hi,Math.max(lo,Math.floor(x))):lo};
const ct=(x,n)=>String(x==null?'':x).slice(0,n);
function clean(d){
 if(!d||typeof d!=='object'||!Array.isArray(d.kids))return null;
 const o={pin:ct(d.pin,8),kids:[]};if(d.np&&!o.pin)o.np=1;if(d.snd===0)o.snd=0;if(d.calm)o.calm=1;
 for(const k of d.kids.slice(0,20)){if(!k||typeof k!=='object')continue;
  const c={id:nn(k.id,1,Number.MAX_SAFE_INTEGER),name:ct(k.name,20)||'Kind',g:[5,6,7,8].includes(+k.g)?+k.g:5,xp:nn(k.xp),ap:nn(k.ap),s:nn(k.s),best:nn(k.best),total:nn(k.total),r:nn(k.r),perfect:nn(k.perfect),b:[],t:{},mist:[]};
  // st = Wachstumsstufe, sd = gesammelte Tage für die nächste Stufe, ld = letzter gezählter Tag, zd/zt = Spielzeit (Sekunden) an diesem Tag
  c.st=k.st==null?GS.reduce((a,g,i)=>c.xp>=g.x?i:a,0):nn(k.st,0,3);c.sd=nn(k.sd,0,999);c.zt=nn(k.zt,0,86400);
  c.hz=nn(k.hz,0,HOFZEIT);if(k.hl)c.hl=1;
  if(k.f&&typeof k.f==='object'){const f=k.f,lgs=['schwarz',...new Set((Array.isArray(f.lgs)?f.lgs:[]).filter(x=>LEG[x]&&x!=='schwarz'))],shs=['blau',...new Set((Array.isArray(f.shs)?f.shs:[]).filter(x=>SHIRT[x]&&x!=='blau'))];
   c.f={g:f.g==='j'?'j':'m',hf:HAUT[f.hf]?f.hf:'hell',ha:HAAR[f.ha]?f.ha:'braun',lg:lgs.includes(f.lg)?f.lg:'schwarz',sh:shs.includes(f.sh)?f.sh:'blau',lgs,shs}}
  if(/^\d{4}-\d\d-\d\d$/.test(k.ld))c.ld=k.ld;if(/^\d{4}-\d\d-\d\d$/.test(k.zd))c.zd=k.zd;
  if(o.kids.some(z=>z.id==c.id))c.id=Date.now()+o.kids.length;
  if(Array.isArray(k.b))c.b=k.b.filter(x=>BD.some(b=>b[0]==x));
  if(k.t&&typeof k.t==='object')for(const key of Object.keys(k.t)){const s=k.t[key];if(s&&typeof s==='object'&&/^[a-z0-9]{1,12}$/.test(key))c.t[key]={d:nn(s.d,1,5),n:nn(s.n),r:nn(s.r),run:Math.max(-9,Math.min(9,Math.trunc(+s.run)||0))}}
  // Altes Thema "Geometrie & Zählen" (bis 2026-10-18): Fortschritt geht an "Winkel & Vielecke"
  if(c.t.geo){if(!c.t.winkel)c.t.winkel=c.t.geo;delete c.t.geo}
  if(Array.isArray(k.mist))for(const m of k.mist.slice(0,30)){if(m&&typeof m.key==='string'&&Array.isArray(m.q)&&typeof m.q[0]==='string'&&Number.isFinite(+m.q[1]))c.mist.push({key:m.key==='geo'?(m.q[4]&&(m.q[4].t=='gitter'||m.q[4].diag||/Diagonale|Weg führt/.test(m.q[0]))?'wege':'winkel'):ct(m.key,12),q:[ct(m.q[0],400),+m.q[1],ct(m.q[2],200),ct(m.q[3],800),...(zCheck(m.q[4])?[zCheck(m.q[4])]:[])]})}
  if(k.h&&typeof k.h==='object'){const h=k.h,co=COATS[h.coat]?h.coat:'fuchs',own=h.own&&typeof h.own==='object'?h.own:{};
   c.h={coat:co,coats:Array.isArray(h.coats)?[...new Set([co,...h.coats.filter(x=>COATS[x])])]:[co],name:ct(h.name,16)||'Fohlen',own:{},bl:h.bl?1:0,so:h.so?1:0,br:BR[h.br]?h.br:'std',brs:['std'],sk:{},it:{}};
   const it=h.it&&typeof h.it==='object'?h.it:{};for(const [id] of ITEMS)if(it[id])c.h.it[id]=1;
   if(own.bl||c.h.bl)c.h.own.bl=1;if(own.so||c.h.so)c.h.own.so=1;
   // Anordnung der Abzeichen (seit 2026-10-18): bf Kopfform 0-4, sm Socken je Bein ("3120"), fs Zahl für die Schecken-Flecken
   if(h.bf!=null)c.h.bf=nn(h.bf,0,4);if(/^[0-3]{4}$/.test(h.sm||'')&&/[1-3]/.test(h.sm))c.h.sm=h.sm;if(+h.fs>0)c.h.fs=nn(h.fs,1,99999);
   if(Array.isArray(h.brs))for(const x of h.brs)if(BR[x]&&!c.h.brs.includes(x))c.h.brs.push(x);
   if(!c.h.brs.includes(c.h.br))c.h.brs.push(c.h.br);
   const sk=h.sk&&typeof h.sk==='object'?h.sk:{};for(const [id] of SK)c.h.sk[id]=nn(sk[id],0,5);
   c.h.ma=MA[h.ma]?h.ma:'mittel';if(h.zk){c.h.zk=1;c.h.zo=h.zo?1:0}
   c.h.gus=['rosa',...new Set((Array.isArray(h.gus)?h.gus:[]).filter(x=>GUMMI[x]&&x!=='rosa'))];c.h.gu=c.h.gus.includes(h.gu)?h.gu:'rosa';
   c.h.lp=[...new Set((Array.isArray(h.lp)?h.lp:[]).filter(x=>LIEB.some(l=>l[0]===x)))]}
  o.kids.push(c)}
 return o}
// S.pin: PIN der Eltern-Ansicht. S.np = 1: beim Start bewusst ohne PIN gewählt (Bereich heißt dann "Einstellungen" und ist offen)
let S={pin:'',kids:[]},v='home',cur=null,Q=null,open=false,warn='',note='',pw='',CH='fuchs';
try{S=clean(JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLDKEY)||'null'))||S}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));warn=''}catch(e){warn='Speichern im Browser nicht möglich. Bitte Sicherung exportieren.'}};
const $=s=>document.querySelector(s),kid=()=>S.kids.find(k=>k.id==cur);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ts=(k,key)=>k.t[key]||(k.t[key]={d:1,n:0,r:0,run:0});
const hh=k=>{let H=k.h;H.brs=H.brs||['std'];H.br=H.br||'std';H.sk=H.sk||{};H.it=H.it||{};H.ma=H.ma||'mittel';H.gus=H.gus||['rosa'];H.gu=H.gu||'rosa';H.lp=H.lp||[];return H};
const stg=k=>k.st||0;
// Datum als Text (lokale Zeit), o = Tage Abstand zu heute
const tag=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const heute=k=>k.ld==tag();
const serie=k=>k.sd||0;// gesammelte Tage für die nächste Stufe, ausgefallene Tage löschen nichts
const tageBis=(k,z)=>{let n=-serie(k);for(let i=stg(k);i<z;i++)n+=TAGE[i];return Math.max(0,n)};
// Nach einer fertigen Runde: Tag zählen (einmal pro Tag) und eventuell wachsen
function tagZaehlt(k){const t=tag();if(k.ld==t)return{};k.sd=(k.sd||0)+1;k.ld=t;
 if(k.h&&stg(k)<3&&k.sd>=TAGE[stg(k)]){k.st=stg(k)+1;k.sd=0;return{neu:1,grow:GS[k.st].n}}return{neu:1}}
const zeit=k=>k.zd==tag()?(k.zt||0):0,ausZeit=k=>zeit(k)>=LIMIT;
const dots=d=>`<span class="dots" title="Stufe ${d} von 5">${[1,2,3,4,5].map(i=>`<i class="${i<=d?'on':''}"></i>`).join('')}</span>`;
// Gezeichnetes Pferd (pferd.js): Spielstand -> Aussehen. Mähnenlänge und Zöpfe erst ab Jährling.
const pfSpec=(H,st)=>({coat:H.coat,st,br:H.br,bl:H.bl,so:H.so,bf:H.bf,sm:H.sm,fs:H.fs,ma:st>=1?(H.ma||'mittel'):'mittel',zo:st>=1&&H.zk&&H.zo&&H.ma=='lang'?1:0,gu:GUMMI[H.gu||'rosa'][1]});
// Jedes Bild bekommt ein eigenes Präfix für seine Kennungen (wird bei jedem Seitenaufbau neu gezählt)
let PZ=0;const pfBild=(spec,opt)=>PF.bild('b'+(PZ++)+'_',spec,opt),PFVB='-118 -252 272 262';
const RM=typeof matchMedia!='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=(k,an,idle)=>{let h=k.h,st=stg(k),s=GS[st].s;return`<svg class="scene" viewBox="0 0 320 180" role="img" aria-label="${esc(h.name)} auf der Weide"><rect width="320" height="180" style="fill:var(--sky)"/><circle cx="268" cy="36" r="16" fill="#e2b24a"/><path d="M0 118Q80 88 170 116T320 106V180H0Z" style="fill:var(--h2)"/>${[0,1,2,3,4].map(i=>`<rect x="${24+i*68}" y="120" width="5" height="40" fill="#b9a27a"/>`).join('')}<rect y="130" width="320" height="4" fill="#b9a27a"/><rect y="144" width="320" height="4" fill="#b9a27a"/><rect y="158" width="320" height="22" style="fill:var(--h1)"/><g id="hg"${an?` class="an-${an.t}" style="--a:${an.a}px"`:''}><g transform="translate(${160-10*s} 163) scale(${s*.5})">${pfBild(pfSpec(hh(k),st),{idle:idle&&!RM})}</g></g><g id="ht"></g></svg>`};
const pick=(c)=>`<button class="pick ${CH==c?'on':''}" onclick="CH='${c}';ui()" aria-pressed="${CH==c}"><svg viewBox="${PFVB}">${pfBild({coat:c,st:0})}</svg>${COATS[c][0]}</button>`;
function ui(){let h='';PZ=0;
 if(v=='home'&&!S.pin&&!S.np){h=`<h1>Pferdehof Mathe</h1><div class="card"><b>Willkommen!</b><p>Soll es eine <b>Eltern-Ansicht mit PIN</b> geben? Dort stehen Statistik, Klassenwahl, Zurücksetzen und die Sicherung.</p><p><b>Mit Eltern-Ansicht:</b> PIN festlegen (mindestens 4 Zeichen).</p><input id="pin0" type="password" inputmode="numeric" maxlength="8" aria-label="PIN festlegen" onkeydown="if(event.key=='Enter')sp()"> <button onclick="sp()">PIN festlegen</button><p class="no">${warn}</p><p><b>Ohne Eltern-Ansicht:</b> passt zum Beispiel auf dem eigenen Handy eines Kindes. Die Einstellungen sind dann für alle offen.</p><button class="alt" onclick="nopin()">Ohne Eltern-Ansicht starten</button><p class="small">Das lässt sich später jederzeit ändern.</p></div>`}
 else if(v=='home'){h=`<h1>Pferdehof Mathe</h1><p>Wer geht heute auf den Hof?</p>`+S.kids.map(k=>`<button class="big" onclick="sel(${k.id})"><span>${esc(k.name)} <span class="small">Klasse ${k.g}${k.h?' · '+esc(k.h.name):''}</span></span><span class="ap">${k.h?GS[stg(k)].n+' · ':''}${k.ap||0} ${AP}</span></button>`).join('')+
 `<div class="card"><b>Neues Kind</b><div class="row"><input id="nm" placeholder="Name" maxlength="20" aria-label="Name"><select id="gr" aria-label="Klasse"><option value="5">Klasse 5</option><option value="6">Klasse 6</option><option value="7">Klasse 7</option><option value="8">Klasse 8</option></select><button onclick="add()">Hinzufügen</button></div></div><p class="row"><button class="alt" onclick="v='parent';ui()">${S.pin?'Eltern-Ansicht':'Einstellungen'}</button><button class="alt" onclick="flyOn()">Flug über die Koppel</button></p>`}
 // Figur erstellen oder ändern (FE: Entwurf, wird erst mit "Fertig" bzw. "Speichern" übernommen)
 // Leggings- und Shirtfarben: anprobieren kostenlos, beim Speichern werden neue Farben gekauft
 if(v=='figur'){let k=kid(),neu=!k.f,ko=figurKosten(k),opt=(t,id,lab,sw,preis)=>`<button class="${FE[t]==id?'go':'alt'}" onclick="FE.${t}='${id}';note='';ui()" aria-pressed="${FE[t]==id}">${sw?`<span class="gummi" style="background:${sw}"></span> `:''}${lab}${preis&&!hatFarbe(k,t,id)?` · ${preis} ${AP}`:''}</button>`;
 h=`<div class="row sp"><button class="alt" onclick="v='${k.f||k.h?'kid':'home'}';ui()">Zurück</button><span class="ap">${k.ap||0} ${AP}</span></div><h1>${neu?'Deine Figur':'Figur ändern'}</h1>`+
 (neu?`<p>${k.h?`<b>Neu!</b> Wie siehst du auf dem Hof aus? Deine Figur steht dann bei ${esc(k.h.name)}.`:`Wie siehst du auf dem Hof aus? Danach rechnest du deine ersten Aufgaben. Nach 5 richtigen darfst du dir dein Fohlen aussuchen.`}</p>`:'')+
 `<div class="card" style="text-align:center;padding:8px">${figurMini(FE,190)}</div>
 <h2>Mädchen oder Junge</h2><div class="row">${opt('g','m','Mädchen')}${opt('g','j','Junge')}</div>
 <h2>Hautfarbe</h2><div class="row">${Object.entries(HAUT).map(([id,[n,c]])=>opt('hf',id,n,c)).join('')}</div>
 <h2>Haare</h2><div class="row">${Object.entries(HAAR).map(([id,[n,c]])=>opt('ha',id,n,c)).join('')}</div>
 <h2>Reitshirt</h2><div class="row">${Object.entries(SHIRT).map(([id,[n,c]])=>opt('sh',id,n,c,PREIS.shirt)).join('')}</div>
 <h2>Reitleggings</h2><div class="row">${Object.entries(LEG).map(([id,[n,c]])=>opt('lg',id,n,c,PREIS.leg)).join('')}</div>
 <p class="small">Neue Farben kannst du kostenlos anprobieren. Erst beim Speichern werden die Äpfel abgezogen, danach gehört dir die Farbe. Schwarzer Reithelm und Reitstiefel sind immer dabei.</p>
 <p class="no">${note}</p><button class="go" onclick="figurOk()">${neu?'Fertig':'Speichern'}${ko?` · ${ko} ${AP}`:''}</button>`}
 if(v=='choose'){h=`<button class="alt" onclick="v='kid';ui()">Zurück</button><h1>Dein Fohlen</h1><p>Welche Fellfarbe soll es haben? Später kannst du mit Äpfeln weitere Farben und Abzeichen freischalten.</p><div class="grid">${Object.keys(COATS).map(pick).join('')}</div><p><label>Name des Fohlens<br><input id="hn" maxlength="16" placeholder="z. B. Luna" onkeydown="if(event.key=='Enter')mk()"></label></p><button class="go" onclick="mk()">Los geht’s</button>`}
 // Kind ohne Pferd: erst 5 Aufgaben richtig, dann Fohlenwahl
 if(v=='kid'&&!kid().h){let k=kid(),n=Math.max(0,FOHLEN-k.r);
 h=`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button><button class="alt" onclick="figurEdit()">Figur</button></div>
 <div class="card row" style="align-items:center;flex-wrap:nowrap">${figurMini(k.f,90)}<div><h1 style="margin:0">Hallo ${esc(k.name)}!</h1><p class="small" style="margin:4px 0 0">${n?`Löse ${n} Aufgabe${n>1?'n':''} richtig, dann darfst du dir dein Fohlen aussuchen.`:'Du darfst dir jetzt dein Fohlen aussuchen!'}</p></div></div>
 ${n?`<div class="bar" style="margin:6px 0"><b style="width:${(FOHLEN-n)/FOHLEN*100}%"></b></div>`:`<button class="go" onclick="v='choose';ui();scrollTo(0,0)">Fohlen aussuchen</button>`}
 <h2 id="themen">Thema wählen</h2>${themen(k)}`}
 if(v=='kid'&&kid().h){let k=kid(),st=stg(k),nx=GS[st+1],se=serie(k),pr=nx?se/TAGE[st]*100:100,rest=Math.max(1,Math.ceil((LIMIT-zeit(k))/60));
 h=`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button><button class="alt" onclick="figurEdit()">Figur</button><button class="alt" onclick="snd()" aria-pressed="${S.snd!==0}">Ton: ${S.snd===0?'aus':'an'}</button></div>
 ${k.f?'':`<div class="card row sp" style="margin-top:8px"><span><b>Neu!</b> Erstelle deine eigene Figur. Sie steht dann auf deinem Hof.</span><button class="go" onclick="figurEdit()">Figur erstellen</button></div>`}<p class="small" style="margin:8px 0 0">${k.hl?'Tippe oben auf dein Pferd, um es zu streicheln.</p>'+SPERRINFO:`Tippe oben auf dein Pferd, um es zu streicheln. Probier auch Apfelbaum, Windrad und Teich aus, wenn du sie gebaut hast.</p><div class="row" style="margin:6px 0"><button class="alt" onclick="hofPet()">Pferd streicheln</button><button class="alt" onclick="flyOn()">Flug über den Hof</button></div>`}<div class="row sp"><h1>${esc(k.h.name)} <span class="small">${GS[st].n} von ${esc(k.name)}</span></h1><span class="ap">${k.ap||0} ${AP}</span></div>
 <div class="bar" style="margin:6px 0"><b style="width:${pr}%"></b></div><p class="small">${nx?`Tag ${se} von ${TAGE[st]} bis „${nx.n}“ · ${heute(k)?'heute schon gerechnet':'rechne heute eine Runde, damit der Tag zählt'}`:'Dein Pferd ist ausgewachsen!'}</p>
 <p class="small">Noch ${rest} Minute${rest>1?'n':''} für heute · ${k.xp} Erfahrung · Serie ${k.s} · Rekord ${k.best}${mcount(k)?` · Fehlerheft: ${mcount(k)} zum Wiederholen`:''}</p>
 ${st<D3AB?'':`${d3Fenster('')}<p class="small" style="margin-top:0">Wische über das Bild, um ${esc(k.h.name)} von allen Seiten zu sehen.</p>`}
 <h2 id="themen">Thema wählen</h2>`+themen(k)+
 `<h2>Wunschbaum</h2>${k.hl?`<p class="small">Der Wunschbaum öffnet sich wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:`<button class="big" onclick="v='wish';note='';ui()"><span>Farbe, Mähne und Abzeichen für ${esc(k.h.name)}</span><span class="ap">${AP}</span></button>`}<h2>Abzeichen</h2>`+BD.map(b=>`<span class="badge ${k.b.includes(b[0])?'':'off'}">${b[1]}</span>`).join('')}
 if(v=='wish'){let k=kid(),H=hh(k),st=stg(k);
 h=`<button class="alt" onclick="v='kid';ui()">Zurück</button><div class="row sp"><h1>Wunschbaum</h1><span class="ap">${k.ap||0} ${AP}</span></div><p class="no">${note}</p>
 ${st>=D3AB?d3Fenster('kleb'):`<div class="card small">Wenn ${esc(H.name)} ein ${GS[D3AB].n} ist, kannst du ${esc(H.name)} hier in 3D von allen Seiten ansehen. Noch ${tageBis(k,D3AB)} Tage mit Mathe.</div>`}
 <h2>Mähne</h2>${st<1?`<p class="small">Ab „${GS[1].n}“ kannst du die Mähne kürzer oder länger machen und Zöpfe flechten.</p>`:
 `<div class="row">${Object.entries(MA).map(([id,n])=>`<button class="${H.ma==id?'go':'alt'}" onclick="wish('ma','${id}')" aria-pressed="${H.ma==id}">${n}</button>`).join('')}<button class="${H.zk&&H.zo?'go':'alt'}" onclick="wish('zk')" aria-pressed="${!!(H.zk&&H.zo)}">Zöpfe ${H.zk?(H.zo?'an':'aus'):'· '+PREIS.zopf+' '+AP}</button></div>
 ${H.zk?`<p class="small" style="margin-bottom:4px">Farbe der Haargummis:</p><div class="row">${Object.entries(GUMMI).map(([id,[n,c]])=>`<button class="${H.gu==id?'go':'alt'}" onclick="wish('gu','${id}')" aria-pressed="${H.gu==id}"><span class="gummi" style="background:${c}"></span> ${n}${H.gus.includes(id)?'':' · '+PREIS.gummi+' '+AP}</button>`).join('')}</div>`:''}
 <p class="small">Die Mähnenlänge kostet nichts. Zöpfe gibt es nur bei langer Mähne: Wenn du Zöpfe einschaltest, wird die Mähne lang.</p>`}
 <h2>Fellfarbe</h2><div class="grid">${Object.keys(COATS).map(c=>`<button class="pick ${H.coat==c?'on':''}" onclick="wish('coat','${c}')"><svg viewBox="${PFVB}">${pfBild({...pfSpec(H,st),coat:c,bl:0,so:0})}</svg>${COATS[c][0]}<br>${H.coat==c?'gewählt':H.coats.includes(c)?'freigeschaltet':'25 '+AP}</button>`).join('')}</div>
 <h2>Abzeichen im Fell</h2><div class="card abz"><svg viewBox="${PFVB}" role="img" aria-label="${esc(H.name)} mit Abzeichen">${pfBild(pfSpec(H,stg(k)))}</svg></div>
 <div class="row"><button class="${H.bl?'go':'alt'}" onclick="wish('bl')">Blesse ${H.own.bl?(H.bl?'an':'aus'):'· 15 '+AP}</button><button class="${H.so?'go':'alt'}" onclick="wish('so')">Weiße Socken ${H.own.so?(H.so?'an':'aus'):'· 15 '+AP}</button>${kannAnordnen(H)?`<button class="alt" onclick="anordnen()">Neu anordnen</button>`:''}</div>
 ${kannAnordnen(H)?`<p class="small">„Neu anordnen“ ist kostenlos und würfelt ${[H.bl&&'die Form auf dem Kopf',H.so&&'die Socken an jedem Bein',H.coat=='schecke'&&'die Flecken'].filter(Boolean).join(', ').replace(/, ([^,]*)$/,' und $1')} neu aus.</p>`:''}<h2>Rasse</h2><div class="grid">${Object.keys(BR).map(b=>`<button class="pick ${H.br==b?'on':''}" onclick="wish('br','${b}')"><svg viewBox="${PFVB}">${pfBild({...pfSpec(H,3),br:b})}</svg>${BR[b].n}<br>${H.br==b?'gewählt':H.brs.includes(b)?'freigeschaltet':'40 '+AP}</button>`).join('')}</div><h2>Lieblingspferde aus dem Stall</h2><div class="grid">${LIEB.map(([id,n,b,sp])=>{const hat=H.lp.includes(id);return`<button class="pick ${hat?'on':''}" onclick="wish('lp','${id}')" aria-pressed="${hat}"><svg viewBox="${PFVB}">${pfBild({...sp,bl:0,so:0})}</svg><b>${n}</b><br><span class="small">${b}</span><br>${hat?'auf dem Hof':PREIS.lieb+' '+AP}</button>`}).join('')}</div><p class="small">Lieblingspferde leben als Freunde auf deinem Hof. Tippe oben auf ein Pferd, dann siehst du seinen Namen.</p><h2>Hof ausbauen</h2><div class="grid">${ITEMS.map(([id,n,p])=>`<button class="pick ${H.it[id]?'on':''}" onclick="wish('it','${id}')">${n}<br>${H.it[id]?'gebaut':p+' '+AP}</button>`).join('')}</div><p class="small">Gebaute Gegenstände siehst du oben auf deinem Hof und im Rundflug. Für jede gekaufte Rasse kommt außerdem ein Pferdefreund dazu.</p><h2>Fähigkeiten</h2>${SK.map(([id,n])=>{let l=H.sk[id]||0;return`<div class="card row sp"><span>${n} ${dots(l)}</span>${l<5?`<button class="alt" onclick="wish('sk','${id}')">Training · ${10*(l+1)} ${AP}</button>`:'<span class="small">Meister</span>'}</div>`}).join('')}<p class="small">Fähigkeiten zeigen sich als Bewegung, wenn dein Pferd sich über eine richtige Antwort freut.</p><p class="small">Äpfel gibt es für richtige Antworten, bei schwereren Aufgaben mehr. Ausgeben kostet keine Erfahrung.</p>`}
 if(v=='quiz'){let k=kid(),s=ts(k,Q.key),t=THEMA[Q.key],q=Q.q,[ft,fe]=frageTeile(q[0]);
 h=`<div class="row sp"><button class="alt" onclick="v='kid';ui()">Beenden</button><span>${t[1]} ${dots(s.d)}</span></div><div class="bar" style="margin:12px 0"><b style="width:${Q.i*10}%"></b></div><p class="small">Aufgabe ${Q.i+1} von 10${Q.rp?' · <b>Nochmal versuchen:</b> Die kennst du schon aus dem Fehlerheft':''}</p>${zeichnung(q[4])}<div class="q">${esc(ft)}</div>`+
 (Q.hint&&q[2]?`<p class="small">Tipp: ${esc(de(q[2]))}</p>`:'')+
 (Q.fb?`${Q.fb.ok&&k.h?`<div style="max-width:300px">${scene(k,Q.fb.an)}</div>`:''}<p class="${Q.fb.ok?'ok':'no'}"><b>${Q.fb.ok?'Richtig! +'+Q.fb.g+' Erfahrung, +'+Q.fb.a+' Äpfel':'Leider falsch. Richtig ist '+mitEinheit(q[1],fe)+'.'}</b>${Q.fb.m?' '+Q.fb.m:''}</p>${!Q.fb.ok&&q[3]?`<div class="card" style="white-space:pre-line;font-size:16px"><b>So geht’s:</b>\n${esc(de(q[3]))}</div>`:''}<button class="go" onclick="nx()">${Q.i==9?'Fertig':'Weiter'} (Enter)</button>`:
 `<span class="antw"><input id="ans" autocomplete="off" aria-label="Antwort${fe?' in '+esc(fe):''}" onkeydown="if(event.key=='Enter')chk()">${fe?`<span class="einheit">${esc(fe)}</span>`:''}</span><div class="row"><button class="go" onclick="chk()">Prüfen</button>${q[2]&&!Q.hint?'<button class="alt" onclick="tip()">Tipp (halbe Punkte)</button>':''}</div>`)}
 if(v=='done'){let k=kid(),fw=!k.h&&k.r>=FOHLEN;h=`<h1>Geschafft!</h1><div class="card">${k.h?scene(k):`<div style="text-align:center">${figurMini(k.f,120)}</div>`}`+
 (k.h?'':fw?`<p class="ok"><b>Super, ${FOHLEN} Aufgaben richtig! Jetzt darfst du dir dein Fohlen aussuchen.</b></p>`:`<p class="small">Noch ${FOHLEN-k.r} richtige Aufgabe${FOHLEN-k.r>1?'n':''} bis zu deinem Fohlen.</p>`)+`<p><b>${Q.right} von 10</b> richtig, <b>+${Q.gain} Erfahrung</b> und <b class="ap">+${Q.ap} ${AP}</b>.</p>${Q.grow?`<p class="ok"><b>${esc(k.h.name)} ist jetzt ein ${Q.grow}!</b></p>`:''}${Q.tg?`<p class="small">${Q.tg}</p>`:''}${Q.frei?`<p class="ok"><b>Super! Der Hof ist wieder offen.</b></p>`:''}${Q.zu?`<p class="no">Für den Hof brauchst du mindestens ${FREI} von 10 richtig. Versuch es gleich noch einmal! Du kannst jedes Thema nehmen.</p>`:''}${Q.mast?`<p class="ok"><b>${Q.mast} Aufgabe${Q.mast>1?'n':''} aus dem Fehlerheft gemeistert!</b></p>`:''}${Q.newb.map(b=>`<span class="badge">Neues Abzeichen: ${b}</span>`).join('')}</div>`+
 (ausZeit(k)?`<div class="card" id="limit"><b>Für heute ist Schluss.</b><p>Deine ${LIMIN} Minuten auf dem Hof sind um. Morgen geht es weiter${k.h?`, ${esc(k.h.name)} wartet auf dich`:''}!</p></div><button class="go" onclick="v='home';ui()">Tschüss, bis morgen</button>`:
 `<div class="row">${fw?`<button class="go" onclick="v='choose';ui();scrollTo(0,0)">Fohlen aussuchen</button>`:''}<button class="${fw?'alt':'go'}" onclick="start('${Q.key}')">Nochmal</button>${Q.zu?'':`<button class="alt" onclick="andersThema()">Anderes Thema</button>`}<button class="alt" onclick="v='kid';ui()">Zurück zum Hof</button></div>`+
 // Hof noch gesperrt: alle Themen direkt zur Auswahl
 (Q.zu?`<h2>Anderes Thema wählen</h2>${themen(k)}`:''))}
 if(v=='bye'){let k=kid();h=`<h1>Bis morgen, ${esc(k.name)}!</h1><div class="card">${k.h?scene(k):''}<p>Für heute sind deine ${LIMIN} Minuten auf dem Hof um.${k.h?` ${esc(k.h.name)} freut sich, wenn du morgen wiederkommst.`:''}</p>${k.h&&stg(k)<3&&heute(k)?'<p class="small">Heute hast du gerechnet, der Tag zählt fürs Wachstum.</p>':''}</div><button class="go" onclick="v='home';ui()">Tschüss</button>`}
 if(v=='parent'){h=`<button class="alt" onclick="v='home';lock()">Zurück</button><h1>${S.pin?'Eltern-Ansicht':'Einstellungen'}</h1>`;
 if(S.pin&&!open)h+=`<div class="card"><p>PIN eingeben:</p><input id="pin" type="password" inputmode="numeric" maxlength="8" aria-label="PIN" onkeydown="if(event.key=='Enter')unl()"> <button onclick="unl()">Öffnen</button><p class="no">${warn}</p></div>`;
 else{h+=S.kids.map(k=>`<div class="card"><div class="row sp"><b>${esc(k.name)}</b><span>Klasse <select onchange="gr(${k.id},this.value)" aria-label="Klasse">${[5,6,7,8].map(c=>`<option ${k.g==c?'selected':''}>${c}</option>`).join('')}</select></span></div>
 <p class="small">${k.h?esc(k.h.name)+' · '+GS[stg(k)].n+' · ':''}${k.h&&stg(k)<3?`Tag ${serie(k)} von ${TAGE[stg(k)]} bis „${GS[stg(k)+1].n}“ · `:''}heute ${Math.min(LIMIN,Math.floor(zeit(k)/60))} von ${LIMIN} Minuten · ${k.xp} Erfahrung · ${k.ap||0} Äpfel · ${k.r} von ${k.total} Aufgaben richtig (${k.total?Math.round(k.r/k.total*100):0} %) · Rekordserie ${k.best} · Fehlerheft ${mcount(k)} offen</p>
 <table><tr><th>Thema</th><th>Stufe</th><th>Aufgaben</th><th>Richtig</th></tr>${elternThemen(k).map(t=>{let s=ts(k,t[0]);return`<tr><td>${t[1]}</td><td>${s.d}</td><td>${s.n}</td><td>${s.n?Math.round(s.r/s.n*100)+' %':'–'}</td></tr>`}).join('')}</table>
 <p class="small">Ein Thema wechselt hoch nach 3 richtigen Antworten in Folge und runter nach 2 falschen.</p><div class="row"><button class="alt" onclick="rst(${k.id})">Fortschritt zurücksetzen</button><button class="alt" onclick="del(${k.id})">Kind löschen</button></div></div>`).join('')||'<p>Noch keine Kinder angelegt.</p>';
 h+=`<div class="card"><b>Spielzeit und Wachstum</b><p class="small">Jedes Kind kann höchstens ${LIMIN} Minuten pro Tag auf den Hof (fest eingestellt). Eine laufende Runde wird nicht unterbrochen. Das Pferd wächst mit Tagen, an denen mindestens eine Runde gerechnet wurde (einmal pro Tag): Jährling nach 3 Tagen, Jungpferd nach weiteren 5, Pferd nach weiteren 10. Fallen Tage aus, bleiben die gesammelten Tage erhalten.</p></div><div class="card"><b>Anzeige</b><p class="small">Der animierte Hintergrund kann ruhig gestellt werden, zum Beispiel bei älteren Geräten oder um den Akku zu schonen. Dann stehen die Pferde still.</p><button class="alt" onclick="S.calm=S.calm?0:1;save();ui()">Ruhiger Hintergrund: ${S.calm?'an':'aus'}</button></div><div class="card"><b>Sicherung</b><p class="small">Der Stand liegt nur in diesem Browser. Exportiere ihn regelmäßig als Datei, besonders vor dem Löschen von Browserdaten oder bei einem Gerätewechsel.</p><div class="row"><button onclick="exp()">Exportieren</button><input type="file" accept=".json" onchange="imp(this)" aria-label="Sicherung importieren"></div><p class="no">${warn}</p></div>
 <div class="card"><b>PIN-Schutz</b>${S.pin?`<p class="small">Diese Ansicht ist mit einer PIN geschützt. Ohne PIN heißt sie „Einstellungen“ und ist für alle offen, zum Beispiel auf dem eigenen Handy eines Kindes.</p><button class="alt" onclick="npin()">PIN entfernen</button>`:`<p class="small">Ohne PIN kann jeder hier die Klasse ändern, Fortschritt zurücksetzen und Kinder löschen. Mit einer PIN (mindestens 4 Zeichen) wird daraus die geschützte Eltern-Ansicht.</p><input id="pin1" type="password" inputmode="numeric" maxlength="8" aria-label="PIN festlegen" onkeydown="if(event.key=='Enter')sp('pin1')"> <button onclick="sp('pin1')">PIN festlegen</button>`}<p class="no">${pw}</p></div>`+(S.pin?`<button class="alt" onclick="lock()">Sperren</button>`:'')}}
 $('#app').innerHTML='<div class="in">'+h+'</div>';if(v!='kid'&&v!='wish')countdown(0);hofSync();d3Sync();setTimeout(()=>{let a=$('#ans')||$('#pin')||$('#hn')||$('#pin0');a&&(v!='home'||a.id=='pin0')&&a.focus({preventScroll:a.id=='hn'})})}
// 3D-Fenster für ausgewachsene Pferde: Platzhalter im Seitenaufbau, das Modul (3d/vorschau.js) wird erst beim ersten Anzeigen geladen
const d3Fenster=cls=>`<div class="d3 ${cls}" id="d3" role="img" aria-label="Dein Pferd in 3D"><span class="d3text">3D-Pferd wird geladen …</span><span class="d3fehler">3D geht nur, wenn die App über die Internet-Adresse geöffnet wurde.</span></div>`;
let D3=null;
function d3Sync(){const el=$('#d3');
 if(!el){if(D3)D3.then(m=>m.verstecke()).catch(()=>{});return}
 if(!/^https?:$/.test(location.protocol)){el.classList.add('fehler');return}
 const H=hh(kid()),spec={coat:H.coat,ma:H.ma,zo:H.zk&&H.zo?1:0,gu:GUMMI[H.gu][1],bl:H.bl,so:H.so,br:H.br};
 D3=D3||import('./3d/vorschau.js');
 D3.then(m=>{if($('#d3')===el)m.zeige(el,spec)}).catch(e=>{D3=null;el.classList.add('fehler');console.warn('3D nicht verfügbar',e)})}
function add(){let n=$('#nm').value.trim();if(!n)return $('#nm').focus();S.kids.push({id:Math.max(Date.now(),...S.kids.map(k=>k.id+1)),name:n,g:+$('#gr').value,xp:0,st:0,sd:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{}});save();ui()}
// PIN festlegen: ohne id beim ersten Start (Feld pin0), mit id='pin1' nachträglich in den Einstellungen
function sp(id){let el=$('#'+(id||'pin0')),p=el?el.value.trim():'',m='Die PIN braucht mindestens 4 Zeichen.';if(p.length<4){if(id){pw=m;ui();pw=''}else{warn=m;ui();warn=''}return}S.pin=p;delete S.np;if(id)open=true;save();ui()}
function nopin(){S.np=1;save();ui()}
function npin(){if(!confirm('PIN entfernen? Danach kann jeder diese Einstellungen öffnen.'))return;S.pin='';S.np=1;open=false;save();ui()}
function sel(id){cur=id;const k=kid();if(!k)return;if(!k.h&&!k.f)FE={...FIGUR0};v=ausZeit(k)?'bye':!k.h&&!k.f?'figur':'kid';ui();scrollTo(0,0)}
// Figur: Entwurf FE bearbeiten und übernehmen
let FE={...FIGUR0};
function figurEdit(){FE={...FIGUR0,...(kid().f||{})};note='';v='figur';ui();scrollTo(0,0)}
// Besitzt das Kind diese Leggings- (t = 'lg') bzw. Shirtfarbe (t = 'sh')? Schwarz und Blau hat jeder.
const hatFarbe=(k,t,id)=>((k.f&&k.f[t+'s'])||[t=='lg'?'schwarz':'blau']).includes(id);
const figurKosten=k=>(hatFarbe(k,'lg',FE.lg)?0:PREIS.leg)+(hatFarbe(k,'sh',FE.sh)?0:PREIS.shirt);
function figurOk(){const k=kid(),ko=figurKosten(k);
 if((k.ap||0)<ko){note='Dafür fehlen noch Äpfel. Probier eine andere Farbe oder rechne noch eine Runde.';ui();return}
 const alt=k.f||{};k.ap=(k.ap||0)-ko;
 k.f={g:FE.g,hf:FE.hf,ha:FE.ha,lg:FE.lg,sh:FE.sh,lgs:[...new Set([...(alt.lgs||['schwarz']),FE.lg])],shs:[...new Set([...(alt.shs||['blau']),FE.sh])]};
 note='';save();v='kid';ui();scrollTo(0,0)}
// Kleine Figur als eigenes Bild (Höhe h in Pixeln)
const figurMini=(f,h)=>`<svg class="figmini" viewBox="-21 -114 42 118" width="${Math.round(h*42/118)}" height="${h}" role="img" aria-label="Figur">${figurBild(f)}</svg>`;
// Aufgabentext für die Anzeige: Einheit am Ende ("(in °)?", " in cm?") wandert neben das Eingabefeld,
// jeder neue Satz beginnt in einer eigenen Zeile. Liefert [Text, Einheit]. Gilt auch für Aufgaben im Fehlerheft.
// Größen & Einheiten: "5 m 8 cm = ? cm" wird zu "5 m 8 cm = ?" mit Einheit cm.
// Neue Zeile nach . ? ! vor Großbuchstabe, Ziffer, Klammer oder einer Variablen wie "x = ?" (nicht bei "die 3. binomische Formel").
const EINH=/\s*\(in ([^()]{1,14})\)\?$|\s+in (€|Cent|cm²|cm|m²|m|km|kg|g|°)\?$/,EINH2=/=\s*\?\s+([a-zA-ZäöüÄÖÜ²³€]{1,4})$/;
function frageTeile(t){t=String(t);let e='',m=t.match(EINH);if(m){e=m[1]||m[2];t=t.slice(0,m.index)+'?'}
 else if(m=t.match(EINH2)){e=m[1];t=t.slice(0,m.index)+'= ?'}
 return[de(t).replace(/([.?!])[ \t]+(?=[A-ZÄÖÜ„(0-9]|[a-z]\s*=)/g,'$1\n'),e]}
// Antwort mit Einheit: 60° (ohne Leerzeichen), sonst 12 cm, 40 €
const mitEinheit=(v,e)=>(e=='€'&&!Number.isInteger(+v)?de((+v).toFixed(2)):de(v))+(e?(e=='°'?'°':' '+e):'');// Geld immer mit zwei Nachkommastellen
// Themen als Knöpfe, geordnet nach Kategorien (KAT in aufgaben.js): Schulstoff der eigenen Klasse, Mathe-Olympiade & Knobeln,
// aufklappbar der Schulstoff früherer Klassen zum Wiederholen
const themaKnopf=(k,key)=>`<button class="big" onclick="start('${key}')"><span>${THEMA[key][1]}</span>${dots(ts(k,key).d)}</button>`;
const undListe=a=>a.length>1?a.slice(0,-1).join(', ')+' und '+a[a.length-1]:String(a[0]);
const frueher=k=>[5,6,7,8].filter(g=>g<k.g);
function themen(k){const K=KAT[k.g],fr=frueher(k);
 return`<h3 class="kat">Schulstoff Klasse ${k.g}</h3>${K.schul.map(x=>themaKnopf(k,x)).join('')}<h3 class="kat">Mathe-Olympiade & Knobeln</h3>${K.oly.map(x=>themaKnopf(k,x)).join('')}`+
  (fr.length?`<details class="wdh"><summary>Wiederholen: Klasse ${undListe(fr)}</summary>${fr.map(g=>`<h3 class="kat">Schulstoff Klasse ${g}</h3>${KAT[g].schul.map(x=>themaKnopf(k,x)).join('')}`).join('')}</details>`:'')}
// Themen für die Eltern-Ansicht: eigene Klasse und wiederholte Themen früherer Klassen, die schon geübt wurden
const elternThemen=k=>[...new Set([...T[k.g].map(t=>t[0]),...frueher(k).flatMap(g=>KAT[g].schul).filter(x=>k.t[x]&&k.t[x].n)])].map(x=>THEMA[x]);
// Tageslimit erreicht: Rundflug beenden und verabschieden
function bye(){if(HF.mode=='fly')flyOff();v='bye';ui();scrollTo(0,0)}
// Spielzeit messen: nur, solange ein Kind auf seinem Hof ist und die App sichtbar ist (auch im Rundflug, der läuft über der Kind-Ansicht)
let ZL=Date.now(),ZS=0;const ZV=['choose','kid','wish','quiz','done'];
setInterval(()=>{const now=Date.now(),dt=Math.min(5,(now-ZL)/1000);ZL=now;
 const k=cur&&kid();if(!k||document.visibilityState!='visible'||!ZV.includes(v))return;
 const t=tag();if(k.zd!=t){k.zd=t;k.zt=0}const vor=ausZeit(k);k.zt+=dt;
 if(now-ZS>15000){ZS=now;save()}
 // Hofzeit: zählt nur in Kind-Ansicht und Wunschbaum (der Rundflug läuft über der Kind-Ansicht), nicht während einer Runde
 if((v=='kid'||v=='wish')&&k.h&&!k.hl){k.hz=(k.hz||0)+dt;const r=HOFZEIT-k.hz;if(r<=0){sperren(k);return}countdown(r<=10?Math.ceil(r):0)}else countdown(0);
 if(!vor&&ausZeit(k)){save();if(v=='done')ui();else if(v!='quiz')bye()}},1000);
// Countdown-Anzeige oben (auch über dem Rundflug). n = 0 blendet sie aus.
function countdown(n){let el=document.getElementById('sperre');if(!n){if(el)el.hidden=true;return}
 if(!el){el=document.createElement('div');el.id='sperre';el.setAttribute('role','status');document.body.appendChild(el)}
 el.hidden=false;el.innerHTML=`Gleich wird wieder gerechnet … <b>${n}</b>`}
const SPERRINFO=`<div class="card" id="sperrinfo"><b>Zeit zum Rechnen!</b><p>Du warst 3 Minuten auf dem Hof. Löse jetzt eine Runde mit mindestens ${FREI} von 10 richtig, dann ist der Hof wieder offen.</p><p class="small" style="margin-bottom:0">Such dir unten ein beliebiges Thema aus.</p></div>`;
// Zu den Themen in der Kind-Ansicht springen
function andersThema(){v='kid';ui();const e=$('#themen');if(e)e.scrollIntoView();else scrollTo(0,0)}
// 3 Minuten Hof sind um: Rundflug beenden, zurück zur Kind-Ansicht, Hof sperren
function sperren(k){k.hl=1;k.hz=0;countdown(0);if(HF.mode=='fly')flyOff();if(v=='wish')v='kid';save();ui();scrollTo(0,0)}
// Beim Verlassen nur speichern, wenn gerade Zeit gezählt wurde (sonst könnte ein frisch gelöschter oder importierter Stand überschrieben werden)
document.addEventListener('visibilitychange',()=>{ZL=Date.now();if(document.visibilityState=='hidden'&&cur&&kid()&&ZV.includes(v))save()});
function mk(){let k=kid();k.h={coat:CH,coats:[CH],name:($('#hn').value.trim()||'Fohlen'),own:{},bl:0,so:0};save();v='kid';ui()}
function wish(t,c){let k=kid(),H=hh(k),no=()=>{note='Dafür fehlen noch Äpfel.';ui()};note='';
 if(t=='br'){if(!H.brs.includes(c)){if((k.ap||0)<40)return no();k.ap-=40;H.brs.push(c)}H.br=c}
 else if(t=='sk'){let l=H.sk[c]||0,p=10*(l+1);if(l>=5)return;if((k.ap||0)<p)return no();k.ap-=p;H.sk[c]=l+1}
 else if(t=='coat'){if(!H.coats.includes(c)){if((k.ap||0)<25)return no();k.ap-=25;H.coats.push(c)}H.coat=c}
 else if(t=='ma'||t=='zk'||t=='gu'){if(stg(k)<1)return;
  if(t=='ma'){H.ma=c;if(c!='lang')H.zo=0}
  else if(t=='zk'){if(!H.zk){if((k.ap||0)<PREIS.zopf)return no();k.ap-=PREIS.zopf;H.zk=1;H.zo=1}else H.zo=H.zo?0:1;if(H.zo)H.ma='lang'}
  else{if(!H.gus.includes(c)){if((k.ap||0)<PREIS.gummi)return no();k.ap-=PREIS.gummi;H.gus.push(c)}H.gu=c}}
 else if(t=='lp'){if(H.lp.includes(c)||!LIEB.some(l=>l[0]==c))return;if((k.ap||0)<PREIS.lieb)return no();k.ap-=PREIS.lieb;H.lp.push(c)}
 else if(t=='it'){if(H.it[c])return;const p=ITEMS.find(x=>x[0]==c)[2];if((k.ap||0)<p)return no();k.ap-=p;H.it[c]=1}
 else if(!H.own[t]){if((k.ap||0)<15)return no();k.ap-=15;H.own[t]=1;H[t]=1}else H[t]=H[t]?0:1;
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
function start(key){if(ausZeit(kid()))return bye();let k=kid(),rep=ms(k).filter(x=>x.key==key).map(x=>x.q).sort(()=>Math.random()-.5).slice(0,3),pool=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
 Q={key,i:0,right:0,hint:0,gain:0,ap:0,grow:'',newb:[],fb:null,seen:[],rep,slots:pool.slice(0,rep.length),rp:0,mast:0};Q.q=gen();v='quiz';ui()}
const gen=()=>{let k=kid(),t=THEMA[Q.key],q,n=0;Q.rp=0;
 if(Q.rep.length&&Q.slots.includes(Q.i)){Q.rp=1;q=Q.rep.shift();Q.seen.push(q[0]);return q}
 do{q=t[2](ts(k,Q.key).d)}while((Q.seen.includes(q[0])||Q.rep.some(r=>r[0]==q[0]))&&++n<20);
 Q.seen.push(q[0]);return q};
// Tipp anzeigen, ohne die bereits getippte Antwort zu verlieren (ui() baut die Seite neu auf)
function tip(){let el=$('#ans'),val=el?el.value:'';Q.hint=1;ui();let n=$('#ans');if(n)n.value=val}
function chk(){let k=kid(),s=ts(k,Q.key),raw=$('#ans').value.trim().replace(',','.').replace('−','-');if(raw===''||isNaN(raw))return $('#ans').focus();
 let ok=Math.abs(+raw-Q.q[1])<1e-9,g=0,a=0,m='';k.total++;s.n++;
 if(ok){s.r++;k.r++;k.s++;k.best=Math.max(k.best,k.s);Q.right++;g=Math.round((8+3*s.d)*(Q.hint?.5:1))+(k.s>=5?5:0);a=1+(s.d>=4?1:0);k.xp+=g;k.ap=(k.ap||0)+a;Q.gain+=g;Q.ap+=a;s.run=s.run>0?s.run+1:1;
  if(s.run>=3&&s.d<5){s.d++;s.run=0;m='Stufe '+s.d+' erreicht!'}}
 else{k.s=0;s.run=s.run<0?s.run-1:-1;if(s.run<=-2&&s.d>1){s.d--;s.run=0;m='Wir üben eine Stufe leichter.'}}
 BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}});
 let L=ms(k),ix=L.findIndex(x=>x.key==Q.key&&x.q[0]==Q.q[0]);
 if(ok){if(ix>=0){L.splice(ix,1);Q.mast++}}else if(ix<0){L.push({key:Q.key,q:Q.q});if(L.length>30)L.shift()}
 let H=k.h?hh(k):{sk:{}},ow=SK.filter(x=>H.sk[x[0]]>0),pk=ow.length?P(ow)[0]:'hop',ls=H.sk[pk]||0;Q.fb={ok,g,a,m,an:ok?{t:{jump:'jump',gal:'gal',aus:'aus',ges:'wig',hop:'hop'}[pk],a:pk=='gal'?20+14*ls:8+9*ls}:null};Q.ts=Date.now();save();ui()}
function nx(){Q.i++;if(Q.i>=10){let k=kid();if(Q.right==10){k.perfect++;BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}})}
  // Runde fertig: Der Tag zählt fürs Wachstum (einmal pro Tag)
  // Hof-Sperre: Eine Runde mit mindestens 8 von 10 richtig öffnet den Hof und startet die 3 Minuten neu
  if(Q.right>=FREI){k.hz=0;if(k.hl){delete k.hl;Q.frei=1}}else if(k.hl)Q.zu=1;
  const w=tagZaehlt(k),st=stg(k);Q.grow=w.grow||'';
  Q.tg=w.neu&&k.h&&st<3?(w.grow?`Bis „${GS[st+1].n}“ braucht es jetzt ${TAGE[st]} Tage mit Mathe.`:`Heute zählt fürs Wachstum: Tag ${k.sd} von ${TAGE[st]} bis „${GS[st+1].n}“.`):'';
  save();v='done'}else{Q.q=gen();Q.fb=null;Q.hint=0}ui()}
// Sperren: muss eine Funktion sein. In onclick-Attributen würde "open=false" sonst document.open überschreiben statt diese Variable.
function lock(){open=false;ui()}
function unl(){let p=$('#pin').value;if(!p)return;if(p==S.pin)open=true;else{warn='Falsche PIN.';ui();warn='';return}ui()}
function gr(id,g){let k=S.kids.find(x=>x.id==id);k.g=+g;save();ui()}
function rst(id){if(!confirm('Fortschritt wirklich zurücksetzen? Das Pferd beginnt wieder als Fohlen.'))return;let k=S.kids.find(x=>x.id==id);delete k.ld;delete k.hl;Object.assign(k,{xp:0,st:0,sd:0,hz:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{},mist:[]});if(k.h){k.h.coats=[k.h.coat];k.h.own={};k.h.bl=0;k.h.so=0;k.h.br='std';k.h.brs=['std'];k.h.sk={};k.h.it={};k.h.lp=[]}save();ui()}
function del(id){if(!confirm('Kind samt Fortschritt löschen?'))return;S.kids=S.kids.filter(x=>x.id!=id);save();ui()}
function exp(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='pferdehof-sicherung.json';a.click()}
function imp(el){let f=el.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let d=clean(JSON.parse(r.result));if(!d)throw 0;if(!confirm('Aktuellen Stand durch die Sicherung ersetzen? Der PIN-Schutz wird aus der Sicherung übernommen.'))return;if(!d.pin)d.np=1;S=d;save();ui()}catch(e){warn='Datei konnte nicht gelesen werden.';ui()}};r.readAsText(f)}
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
ui();
