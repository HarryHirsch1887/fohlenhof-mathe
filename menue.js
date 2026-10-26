// Pferdehof Mathe: Ansichten für Startseite, Kind-Ansicht und Themenwahl (seit 2026-10-26, Menü-Vorschläge B und C vom 2026-10-25)
// Wird vor app.js geladen. Alles aus app.js, hof.js, pferd.js, figur.js, training.js und pflege.js wird erst zur Laufzeit benutzt.
//
// Wahl über den Knopf "Ansicht" auf der Startseite, gespeichert als S.an: 'b' = Bunte Kacheln, 'c' = Turniermodus mit Leiste unten,
// ohne Eintrag = A "Pferdehof" (Standard: der bisherige Aufbau mit Holz-Optik, body.holz in style.css, Boxentüren auf der Startseite in app.js).
// Die Wahl gilt für das ganze Gerät, Spielstand und Einstellungen ändern sich nicht.
//
// KT = Teil der Kind-Ansicht in B und C: '' Übersicht, 'themen', 'training', 'pflege', 'abz'. Die Ansicht bleibt dabei v = 'kid',
// damit Spielzeit, Hofzeit, Hof-Sperre, Pflege-Animationen und Training genauso laufen wie in der klassischen Ansicht.
// TSEG = gewählte Gruppe in der Themenwahl von B ('s' Schulstoff, 'k' Knobeln, 'u' Sudoku). NKAUF = Formular "Neues Kind" aufgeklappt (B und C).
let KT='',TSEG='s',NKAUF=0;
const ANSICHT={a:['Pferdehof','Holzschilder wie im Reitstall: Jedes Kind wartet an einer Boxentür, die Themen hängen als Schilder an der Wand, die Stufe zeigen Hufeisen. Alles auf einer Seite.'],
 b:['Bunte Kacheln','Große bunte Kacheln mit Bildern. Rechnen, Training, Pflege und Abzeichen haben eigene Seiten, die Themen zeigen ihre Stufe als Ring.'],
 c:['Turniermodus','Eine Leiste unten mit Hof, Rechnen, Wunschbaum und Pflege, großer Knopf „Los, rechnen!“, Startnummern und Sterne für die Stufen.']};
const mAn=()=>S.an==='b'||S.an==='c'?S.an:'';
// Bilder für Kacheln und Leiste (viewBox 0 0 40 40)
const MI={
 rechnen:'<rect x="7" y="6" width="26" height="28" rx="4" fill="#fff" stroke="#26331f" stroke-width="2.4"/><path d="M13 15h6M16 12v6M22 15h5M13 26h6M22 24l5 4M27 24l-5 4" stroke="#26331f" stroke-width="2.4" stroke-linecap="round"/>',
 baum:'<rect x="18" y="22" width="4" height="13" fill="#6b4a2b"/><circle cx="20" cy="16" r="10" fill="#4f9a47"/><circle cx="12" cy="20" r="7" fill="#4f9a47"/><circle cx="28" cy="20" r="7" fill="#4f9a47"/><circle cx="15" cy="15" r="2" fill="#d0473b"/><circle cx="25" cy="21" r="2" fill="#d0473b"/><circle cx="21" cy="11" r="2" fill="#d0473b"/>',
 rosette:'<path d="M14 24l-4 14l6 -3l3 5l3 -14ZM26 24l4 14l-6 -3l-3 5l-3 -14Z" fill="#4a90c2"/><circle cx="20" cy="16" r="12" fill="#4a90c2"/><circle cx="20" cy="16" r="8" fill="#fff"/><circle cx="20" cy="16" r="5" fill="#e2b24a"/>',
 hindernis:'<rect x="6" y="11" width="4" height="25" rx="1" fill="#f4f1ea" stroke="#26331f" stroke-width="1.5"/><rect x="30" y="11" width="4" height="25" rx="1" fill="#f4f1ea" stroke="#26331f" stroke-width="1.5"/><rect x="3" y="17" width="34" height="5" rx="2.5" fill="#fff" stroke="#b0412f" stroke-width="1.4"/><path d="M11 17.5v4M18 17.5v4M25 17.5v4M32 17.5v4" stroke="#b0412f" stroke-width="3.2"/><rect x="3" y="26" width="34" height="4" rx="2" fill="#e2b24a" stroke="#8a6a1a" stroke-width="1.1"/>',
 buerste:'<rect x="8" y="12" width="24" height="10" rx="4" fill="#8b5a2b"/><path d="M10 22v8M14 22v8M18 22v8M22 22v8M26 22v8M30 22v8" stroke="#3b2414" stroke-width="2"/>',
 flug:'<path d="M6 22Q14 12 20 18Q26 12 34 22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="10" r="4" fill="#fff3c4" stroke="#e2b24a"/>',
 freund:'<circle cx="14" cy="14" r="5" fill="#f0c8a8"/><circle cx="26" cy="14" r="5" fill="#f0c8a8"/><path d="M6 32q2 -10 8 -10t8 10Z" fill="#4a90c2"/><path d="M18 32q2 -10 8 -10t8 10Z" fill="#e48fb1"/>',
 hof:'<path d="M6 20L20 8L34 20V34H6Z" fill="#b0412f"/><rect x="15" y="22" width="10" height="12" fill="#f4e9d0"/>',
 figur:'<circle cx="20" cy="15" r="7" fill="#f0c8a8"/><path d="M12 13q0 -9 8 -9t8 9q-8 -3 -16 0Z" fill="#26262c"/><path d="M10 38q2 -14 10 -14t10 14Z" fill="#4a90c2"/>',
 huf:'<path d="M10 30V16a10 10 0 0 1 20 0V30" fill="none" stroke="#8a8f96" stroke-width="6" stroke-linecap="round"/><g fill="#4b4f55"><circle cx="10" cy="20" r="1.4"/><circle cx="30" cy="20" r="1.4"/><circle cx="11" cy="26" r="1.4"/><circle cx="29" cy="26" r="1.4"/></g>',
 arzt:'<circle cx="20" cy="20" r="15" fill="#fff" stroke="#b0412f" stroke-width="2.4"/><path d="M20 12v16M12 20h16" stroke="#b0412f" stroke-width="5"/>',
 herz:'<path d="M20 33C8 25 5 18 9 12.5C12.5 8 18 9.5 20 14C22 9.5 27.5 8 31 12.5C35 18 32 25 20 33Z" fill="#e8508f"/><circle cx="14" cy="15" r="2.2" fill="#fff" opacity=".5"/>',
 neu:'<circle cx="20" cy="15" r="7" fill="#f0c8a8"/><path d="M12 13q0 -9 8 -9t8 9q-8 -3 -16 0Z" fill="#26262c"/><path d="M8 38q2 -14 10 -14t10 14Z" fill="#4a90c2"/><circle cx="31" cy="27" r="7" fill="#4f8a4a"/><path d="M31 23.5v7M27.5 27h7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>'};
const mi=(n,g=38)=>`<svg viewBox="0 0 40 40" width="${g}" height="${g}" aria-hidden="true" focusable="false">${MI[n]||''}</svg>`;
// Kleine Vorschau je Ansicht auf der Auswahlseite (Handy mit Weide oben)
const VORSCHAU=(()=>{const rahmen=x=>`<svg viewBox="0 0 48 72" width="48" height="72" aria-hidden="true"><rect x="1" y="1" width="46" height="70" rx="7" fill="#e3eedb" stroke="#23262b" stroke-width="2"/><path d="M2 8a6 6 0 0 1 6 -6h32a6 6 0 0 1 6 6v10H2Z" fill="#9fcf7f"/>${x}</svg>`,
 z=(y,h=8,f='#fbfdf7')=>`<rect x="6" y="${y}" width="36" height="${h}" rx="2" fill="${f}" stroke="#c5d6ba" stroke-width=".8"/>`;
 const brett=y=>`<rect x="6" y="${y}" width="36" height="8" rx="1.5" fill="#8a5a32" stroke="#5e3d22" stroke-width=".8"/><circle cx="8.5" cy="${y+4}" r=".9" fill="#d9c7a3"/><circle cx="39.5" cy="${y+4}" r=".9" fill="#d9c7a3"/>`;
 return{a:rahmen('<path d="M2 18h44v46a6 6 0 0 1 -6 6H8a6 6 0 0 1 -6 -6Z" fill="#eadcc0"/><rect x="6" y="22" width="9" height="9" rx="1" fill="#e9d6a4" stroke="#5e3d22" stroke-width="1.4"/><rect x="17" y="23" width="25" height="7" rx="1" fill="#f5e7c8" stroke="#b5835a" stroke-width=".8"/>'+brett(36)+brett(47).replace('#8a5a32','#e2b24a')+brett(58)),
  b:rahmen('<rect x="6" y="22" width="36" height="10" rx="3" fill="#e2b24a"/><rect x="6" y="35" width="17" height="13" rx="3" fill="#d7efc6"/><rect x="25" y="35" width="17" height="13" rx="3" fill="#f6d6d0"/><rect x="6" y="51" width="17" height="13" rx="3" fill="#ffe9a8"/><rect x="25" y="51" width="17" height="13" rx="3" fill="#cfe6f6"/>'),
  c:rahmen('<rect x="6" y="22" width="36" height="8" rx="4" fill="#b0412f"/>'+z(34,5)+z(42,5)+z(50,5)+'<path d="M2 60h44v4a6 6 0 0 1 -6 6H8a6 6 0 0 1 -6 -6Z" fill="#fff" stroke="#c5d6ba" stroke-width=".8"/><g fill="#b0412f"><circle cx="10" cy="65" r="2"/></g><g fill="#a3a394"><circle cx="20" cy="65" r="2"/><circle cx="29" cy="65" r="2"/><circle cx="38" cy="65" r="2"/></g>')}})();

// ---------- Auswahlseite "Ansicht" ----------
function ansichtAuf(){v='ansicht';ui();scrollTo(0,0)}
function ansichtSeite(){const a=mAn()||'a';
 return`<button class="alt" onclick="v='home';ui();scrollTo(0,0)">Zurück</button><h1>Ansicht</h1><p>Wie sollen Startseite, Hof und Themenwahl aussehen? Die Wahl gilt für alle Kinder auf diesem Gerät. Spielstand und Einstellungen bleiben, wie sie sind.</p>`+
  Object.entries(ANSICHT).map(([id,[n,b]])=>`<button class="big mwahl${a==id?' on':''}" data-an="${id}" onclick="ansichtWahl('${id}')" aria-pressed="${a==id}"><span class="mvor">${VORSCHAU[id]}</span><span class="mwt"><b>${n}</b>${a==id?' <span class="small">· gewählt</span>':''}<br><span class="small">${b}</span></span></button>`).join('')}
function ansichtWahl(id){if(!ANSICHT[id])return;if(id=='a')delete S.an;else S.an=id;KT='';TSEG='s';NKAUF=0;save();v='home';ui();scrollTo(0,0)}

// ---------- Startseite ----------
const MKF=['#cfe6f6','#f6d6d0','#d7efc6','#ffe9a8','#e7dcf6'];
// Bild eines Kindes: sein Pferd, sonst Kopf und Schultern der Figur, sonst ein Platzhalter
const kindBild=k=>k.h?`<svg viewBox="${PFVB}" width="70" height="67" aria-hidden="true">${pfBild(pfSpec(k.h,stg(k)))}</svg>`:k.f?figurKopf(k.f,62):mi('figur',46);
const figurKopf=(f,h)=>`<svg viewBox="-20 -114 40 46" width="${Math.round(h*40/46)}" height="${h}" aria-hidden="true">${figurBild(f)}</svg>`;
const nkOffen=()=>NKAUF||!!NKN||!!NKW||!S.kids.length;
function nkAuf(){NKAUF=1;ui();const n=$('#nm');if(n){n.focus({preventScroll:true});n.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})}}
const mLinks=()=>`<p class="row mlinks"><button class="alt" onclick="v='parent';ui()">${S.pin?'Eltern-Ansicht':'Einstellungen'}</button><button class="alt" onclick="infoAuf()">Für Eltern</button><button class="alt" onclick="ansichtAuf()">Ansicht</button></p>`;
function homeB(zu){
 return`<h1>${S.kids.length?'Wer reitet heute?':'Pferdehof Mathe'}</h1>${zu?pinZuKarte():''}`+
  S.kids.map((k,i)=>`<button class="mk mkind" onclick="sel(${k.id})"${zu?' disabled':''}><span class="mbild" style="background:${MKF[i%MKF.length]}">${kindBild(k)}</span><span class="mwt"><b>${esc(k.name)}</b>${k.h?` <span class="small">mit ${esc(k.h.name)}</span>`:''}<br><span class="small">Klasse ${k.g} · ${k.h?GS[stg(k)].n:'noch ohne Pferd'}</span><br><span class="ap">${k.ap||0} ${AP}</span></span></button>`).join('')+
  `<div class="mgrid">${kachel('mf6','neu','Neues Kind','','nkAuf()')}${kachel('mf3','flug','Flug über die Koppel','','flyOn()')}</div>`+(nkOffen()?nkKarte(zu):'')+mLinks()}
// C Startseite (seit 2026-10-26, Florians Wunsch): Pferdekopf mit etwas Hals statt der Startnummer. Das Pferd wird ganz gezeichnet,
// nach dem Seitenaufbau misst kopfAusschnitt() Kopf und oberen Hals und setzt den Bildausschnitt (wie itBilder bei den Hof-Gegenständen).
// Lage und Größe des Kopfs hängen von Wachstumsstufe und Rasse ab, deshalb gemessen statt fest eingetragen.
// Ohne Pferd: Kopf der Figur, ohne Figur die Startnummer.
// Startwert: fester Ausschnitt für ein ausgewachsenes Pferd (falls die Messung nicht klappt), quadratisch wie das Bild
function kopfBild(k,i){if(!k.h)return k.f?figurKopf(k.f,46):String(i+1);
 const p='b'+PZ+'_';return`<svg class="mkopfbild" data-p="${p}" viewBox="60 -243 98 98" width="52" height="52" aria-hidden="true">${pfBild(pfSpec(k.h,stg(k)))}</svg>`}
// Bildschirm → Bildkoordinaten über die aktuelle viewBox (Bild und viewBox sind beide quadratisch, also kein Rand durch preserveAspectRatio).
// Unsichtbar (z. B. im Rundflug): nichts tun, flyOff() und der nächste ui() holen es nach.
function kopfAusschnitt(){document.querySelectorAll('#app svg.mkopfbild[data-p]').forEach(s=>{const p=s.dataset.p,
  kopf=s.querySelector(`[id="${p}kopf"]`),hals=s.querySelector(`[id="${p}hals2Form"]`),r=s.getBoundingClientRect(),b=s.viewBox.baseVal;if(!kopf||!hals||!r.width||!b||!b.width)return;
 const f=b.width/r.width,R=[kopf,hals].map(e=>e.getBoundingClientRect()),vx=x=>b.x+(x-r.left)*f,vy=y=>b.y+(y-r.top)*f,
  x0=vx(Math.min(...R.map(a=>a.left))),x1=vx(Math.max(...R.map(a=>a.right))),y0=vy(Math.min(...R.map(a=>a.top))),y1=vy(Math.max(...R.map(a=>a.bottom))),
  g=Math.max(x1-x0,y1-y0)*1.15;
 // quadratisch, waagerecht fast mittig (vor dem Maul bleibt etwas Luft), oben Luft für die Ohrspitzen
 s.setAttribute('viewBox',`${r1((x0+x1)/2-g*.46)} ${r1((y0+y1)/2-g*.53)} ${r1(g)} ${r1(g)}`);s.removeAttribute('data-p')})}
function homeC(zu){
 return`<h1>${S.kids.length?'Wer startet heute?':'Pferdehof Mathe'}</h1>${zu?pinZuKarte():''}`+
  S.kids.map((k,i)=>`<button class="mk mnr" onclick="sel(${k.id})"${zu?' disabled':''}><span class="nr" aria-hidden="true">${kopfBild(k,i)}</span><span class="mwt"><b>${esc(k.name)}</b> <span class="small">${k.h?'auf '+esc(k.h.name):'noch ohne Pferd'}</span><br><span class="small">Klasse ${k.g} · ${k.ap||0} Äpfel</span></span></button>`).join('')+
  `<button class="mk mros" onclick="nkAuf()">${mi('neu',34)}<b>Neues Kind anmelden</b></button>`+(nkOffen()?nkKarte(zu):'')+
  `<button class="mk mros" onclick="flyOn()">${mi('flug',34)}<b>Flug über die Koppel</b></button>`+mLinks()}

// ---------- Kind-Ansicht ----------
// Kachel (B): cls = Farbe, ic = Bild, t = Titel, s = Zeile darunter, js = Klick, o = {breit, zu (gesperrt), warn (Zeile rot)}
const kachel=(cls,ic,t,s,js,o={})=>`<button class="mk mkach ${cls}${o.breit?' breit':''}" onclick="${js}"${o.zu?' disabled':''}${o.id?` data-k="${o.id}"`:''}>${mi(ic,o.breit?44:36)}<span>${t}${s?`<span class="ms${o.warn?' mwarn':''}">${s}</span>`:''}</span></button>`;
function mGeh(t){KT=t;v='kid';note='';ui();scrollTo(0,0)}
function mWunsch(){const k=kid();if(!k||!k.h||k.hl)return;v='wish';note='';ui();scrollTo(0,0)}
function mStreicheln(){hofPet();scrollTo({top:0,behavior:RM?'auto':'smooth'})}
const mTon=()=>`<button class="alt" onclick="snd()" aria-pressed="${S.snd!==0}">Ton: ${S.snd===0?'aus':'an'}</button>`;
// Kurztexte für Kacheln: Pflege und Training
function pflegeKurz(k){const H=hh(k);
 if(stg(k)>=1){const t=gpStand(H,'t').faellig,s=gpStand(H,'s').faellig;if(t&&s)return['Tierarzt und Schmied fällig',1];if(t)return['Tierarzt fällig',1];if(s)return['Schmied fällig',1]}
 if(!pflegbar(H))return['Putzzeug im Wunschbaum'];
 return dreckig(H)&&gpHeute(H)<PFLMAX?['ein paar Schmutzflecken']:['alles gut']}
function trainKurz(k){const H=hh(k);if(stg(k)<1)return'ab '+GS[1].n;const g=gpSperre(k);if(g)return'erst '+g;
 const n=Object.values(H.tr||{}).reduce((a,b)=>a+(+b||0),0);return n?`${n} Stern${n>1?'e':''}`:'noch keine Sterne'}
// Teile, die B und C mit der klassischen Ansicht gemeinsam haben
const mFigurNeu=k=>k.f?'':`<div class="card row sp" style="margin-top:8px"><span><b>Neu!</b> Erstelle deine eigene Figur. Sie steht dann auf deinem Hof.</span><button class="go" onclick="figurEdit()">Figur erstellen</button></div>`;
const mZweit=k=>k.h2?`<div class="card row sp" style="align-items:center;padding:8px 12px"><span class="small">Dein zweites Pferd: <b>${esc(k.h2.name)}</b> (${GS[k.h2.st||0].n})</span><button class="alt" onclick="wechsel()">Mit ${esc(k.h2.name)} rechnen</button></div>`:'';
const mApfel=k=>`<span class="ap">${k.ap||0} ${AP}${k.hu?` · ${k.hu}${k.hu>=huMax(k)?' (voll)':''} ${HU}`:''}</span>`;
// Infozeilen unter den Kacheln (wie klassisch). ohneZeit: Die Restzeit steht schon auf der Kachel "Rechnen" (B).
function mInfo(k,ohneZeit){const nx=GS[stg(k)+1],rest=Math.max(1,Math.ceil((limS(k)-zeit(k))/60));
 return`<p class="small">${nx?(heute(k)?'Heute hast du schon gerechnet, der Tag zählt fürs Wachstum.':'Rechne heute eine Runde, damit der Tag fürs Wachstum zählt.'):'Dein Pferd ist ausgewachsen!'}</p>`+
  `<p class="small">${limS(k)&&!ohneZeit?`Noch ${rest} Minute${rest>1?'n':''} für heute · `:''}${k.xp} Erfahrung · Serie ${k.s} · Rekord ${k.best}${mcount(k)?` · Fehlerheft: ${mcount(k)} zum Wiederholen`:''}</p>`}
const mBalken=k=>{const st=stg(k),nx=GS[st+1];return`<div class="bar" style="margin:6px 0"><b style="width:${nx?serie(k)/TAGE[st]*100:100}%"></b></div>`};
const m3D=k=>stg(k)<D3AB?'':`${d3Fenster('')}<p class="small" style="margin-top:0">Wische über das Bild, um ${esc(k.h.name)} von allen Seiten zu sehen.</p>`;
// Hof gesperrt: dieselbe Karte wie klassisch (id sperrinfo), nur der Weg zu den Themen ist anders beschrieben
const mSperre=(k,wo)=>k.hl?SPERRINFO.replace('Such dir unten ein beliebiges Thema aus.',wo):'';
function kindMenue(k){if(KT)return kindTeil(k);return mAn()=='c'?kindC(k):kindB(k)}
function kindB(k){const H=hh(k),st=stg(k),zu=k.hl,nx=GS[st+1],rest=Math.max(1,Math.ceil((limS(k)-zeit(k))/60)),[pk,pw]=pflegeKurz(k),frei=zu?'erst rechnen':'';
 return`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button>${mTon()}</div>`+
  `<div class="mkopf"><span class="mava">${k.f?figurKopf(k.f,50):mi('figur',40)}</span><span class="mkt"><b>Hallo ${esc(k.name)}!</b><br><span class="small">${esc(H.name)} · ${GS[st].n}${nx?` · Tag ${serie(k)} von ${TAGE[st]}`:''}</span></span>${mApfel(k)}</div>`+mBalken(k)+
  mFigurNeu(k)+wartetHinweis(k)+besuchKarte(k)+mSperre(k,'Tippe auf „Rechnen“ und such dir ein beliebiges Thema aus.')+fuehrKnopf(k)+mZweit(k)+
  `<div class="mgrid">`+kachel('mfg','rechnen','Rechnen',limS(k)?`Noch ${rest} Minute${rest>1?'n':''} für heute`:'Thema wählen',"mGeh('themen')",{breit:1,id:'themen'})+
  kachel('mf2','baum','Wunschbaum',frei||'Rasse, Mähne, Hof','mWunsch()',{zu,id:'wish'})+kachel('mf4','hindernis','Training',frei||trainKurz(k),"mGeh('training')",{zu,id:'training'})+
  kachel('mf1','buerste','Pflege',pk,"mGeh('pflege')",{warn:pw,id:'pflege'})+kachel('mf6','rosette','Abzeichen',`${k.b.length} von ${BD.length}`,"mGeh('abz')",{id:'abz'})+
  kachel('mf3','flug','Flug über den Hof',frei,'flyOn()',{zu,id:'flug'})+kachel('mf5','freund','Freundin einladen',frei,"v='einladen';note='';ui();scrollTo(0,0)",{zu,id:'einladen'})+
  kachel('mf4','herz','Pferd streicheln','','mStreicheln()',{id:'streicheln'})+kachel('mf2','figur','Figur',k.f?'ändern':'erstellen','figurEdit()',{id:'figur'})+`</div>`+
  mInfo(k,1)+m3D(k)}
// C: fällige Besuche als Hinweis-Karte (führt zur Pflege)
function cHinweise(k){const H=hh(k);if(stg(k)<1)return'';
 return['t','s'].filter(a=>gpStand(H,a).faellig).map(a=>{const ta=a=='t',G=gpStand(H,a);return`<button class="mk mros mwarnk" data-gp="${a}" onclick="mGeh('pflege')">${mi(ta?'arzt':'huf',34)}<span class="mwt"><b>${ta?'Tierarzt':'Hufschmied'} ist fällig</b><br><span class="small">${ta?TAPREIS:SCHPREIS} Hufeisen${G.ueber?' · bis dahin kein Training':''}</span></span></button>`}).join('')}
function kindC(k){const H=hh(k),st=stg(k),zu=k.hl,nx=GS[st+1],mini=(ic,t,js,o={})=>`<button class="mk"${o.id?` data-k="${o.id}"`:''} onclick="${js}"${o.zu?' disabled':''}>${mi(ic,30)}${t}</button>`;
 return`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button>${mTon()}</div>`+
  `<div class="row sp" style="align-items:baseline"><h1 style="margin-bottom:0">${esc(H.name)}</h1>${mApfel(k)}</div><p class="small" style="margin:0">${GS[st].n} von ${esc(k.name)}${nx?` · noch ${tageBis(k,st+1)} Tag${tageBis(k,st+1)==1?'':'e'} mit Mathe bis „${nx.n}“`:''}</p>`+mBalken(k)+
  mFigurNeu(k)+wartetHinweis(k)+besuchKarte(k)+mSperre(k,'Tippe auf „Los, rechnen!“ und such dir ein beliebiges Thema aus.')+
  `<button class="mk mcta" data-k="themen" onclick="mGeh('themen')">${mi('rechnen',26)}Los, rechnen!</button>`+cHinweise(k)+fuehrKnopf(k)+mZweit(k)+
  `<div class="mmini">${mini('hindernis','Training',"mGeh('training')",{zu,id:'training'})}${mini('flug','Rundflug','flyOn()',{zu,id:'flug'})}${mini('freund','Freundin',"v='einladen';note='';ui();scrollTo(0,0)",{zu,id:'einladen'})}`+
  `${mini('herz','Streicheln','mStreicheln()',{id:'streicheln'})}${mini('rosette','Abzeichen',"mGeh('abz')",{id:'abz'})}${mini('figur','Figur','figurEdit()',{id:'figur'})}</div>`+
  (zu?`<p class="small">Wunschbaum, Training, Rundflug und Freundin einladen gehen wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:'')+mInfo(k)+m3D(k)}
// Eigene Seiten hinter Kacheln bzw. Leiste: Themen, Training, Pflege, Abzeichen
function kindTeil(k){const c=mAn()=='c',kopf=`<div class="row sp">${c?'<span></span>':`<button class="alt" onclick="mGeh('')">Zurück</button>`}${mApfel(k)}</div>`;
 if(KT=='themen')return kopf+`<h1>${c?'Thema wählen':'Was rechnest du?'}</h1>`+(k.hl?SPERRINFO.replace('Such dir unten ein beliebiges Thema aus.','Such dir hier ein beliebiges Thema aus.'):'')+themen(k);
 if(KT=='training')return kopf+`<h1>Training</h1>`+(k.hl?`<p class="small">Das Training geht wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:trTeil(k));
 if(KT=='pflege')return kopf+`<h1>Gesundheit und Pflege</h1>`+gpTeil(k);
 if(KT=='abz')return kopf+`<h1>Abzeichen</h1><p class="small">${k.b.length} von ${BD.length} Abzeichen gesammelt.</p>`+BD.map(b=>`<span class="badge ${k.b.includes(b[0])?'':'off'}">${b[1]}</span>`).join('');
 KT='';return kindMenue(k)}

// ---------- Themenwahl ----------
// B: Ring mit der Stufe (1 bis 5), Umschalter Schulstoff / Knobeln / Sudoku, darunter aufklappbar Wiederholen
const mRing=d=>`<svg class="mring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14" fill="none" class="rg0" stroke-width="5"/><circle cx="18" cy="18" r="14" fill="none" stroke="${d>=4?'#e2b24a':'#4f8a4a'}" stroke-width="5" stroke-dasharray="${(87.96*d/5).toFixed(2)} 88" transform="rotate(-90 18 18)"/><text x="18" y="22.5" text-anchor="middle" font-size="12" font-weight="700">${d}</text></svg>`;
function ringKnopf(k,key){const zu=knobelZu(k,key),d=ts(k,key).d;return`<button class="mk mtile${zu?' gesperrt':''}" onclick="start('${key}')"${zu?' disabled':''} aria-label="${THEMA[key][1]}, Stufe ${d} von 5">${mRing(d)}<span>${THEMA[key][1]}</span></button>`}
function themenB(k){const K=KAT[k.g],kz=(k.kn||0)>=KNMAX,fr=frueher(k),seg=['s','k','u'].includes(TSEG)?TSEG:'s',L=seg=='s'?K.schul:seg=='k'?K.oly:K.sud;
 return`<div class="mseg" role="group" aria-label="Art der Themen">${[['s','Schulstoff'],['k','Knobeln'],['u','Sudoku']].map(([id,n])=>`<button class="${seg==id?'on':''}" data-seg="${id}" onclick="TSEG='${id}';ui()" aria-pressed="${seg==id}">${n}</button>`).join('')}</div>`+
  (seg!='s'&&kz?`<p class="small knsperre">${KNHINWEIS}</p>`:'')+L.map(x=>ringKnopf(k,x)).join('')+
  (seg=='s'&&fr.length?`<details class="wdh"><summary>Wiederholen: Klasse ${undListe(fr)}</summary><p class="small">Bei Themen früherer Klassen gibt es weniger Äpfel: auf Stufe 4 und 5 nur 1 statt 2.${wdhOben(k)}</p>${wdhListe(k).map(([g,L2])=>`<h3 class="kat">Schulstoff Klasse ${g}</h3>${L2.map(x=>ringKnopf(k,x)).join('')}`).join('')}</details>`:'')}
// C: farbige Bänder je Gruppe, Stufen als Sterne
const mSterne=d=>`<span class="msterne" aria-hidden="true">${'★'.repeat(d)}<i>${'★'.repeat(5-d)}</i></span>`;
const mBand=(t,f)=>`<h3 class="mband" style="background:${f}">${t}</h3>`;
function sternZeile(k,key){const zu=knobelZu(k,key),d=ts(k,key).d;return`<button class="mk mzeile${zu?' gesperrt':''}" onclick="start('${key}')"${zu?' disabled':''} aria-label="${THEMA[key][1]}, Stufe ${d} von 5"><span>${THEMA[key][1]}</span>${mSterne(d)}</button>`}
function themenC(k){const K=KAT[k.g],kz=(k.kn||0)>=KNMAX,fr=frueher(k);
 return mBand('Schulstoff Klasse '+k.g,'#4f8a4a')+K.schul.map(x=>sternZeile(k,x)).join('')+mBand('Mathe-Olympiade & Knobeln','#3d7fb3')+(kz?`<p class="small knsperre">${KNHINWEIS}</p>`:'')+K.oly.map(x=>sternZeile(k,x)).join('')+
  mBand('Sudoku','#b0412f')+K.sud.map(x=>sternZeile(k,x)).join('')+
  (fr.length?`<details class="wdh"><summary>Wiederholen: Klasse ${undListe(fr)}</summary><p class="small">Bei Themen früherer Klassen gibt es weniger Äpfel: auf Stufe 4 und 5 nur 1 statt 2.${wdhOben(k)}</p>${wdhListe(k).map(([g,L2])=>mBand('Schulstoff Klasse '+g,'#8a6a3a')+L2.map(x=>sternZeile(k,x)).join('')).join('')}</details>`:'')}

// ---------- Leiste unten (C) ----------
// In Kind-Ansicht, Wunschbaum und Pferderassen, nur für Kinder mit Pferd. Der Wunschbaum ist bei gesperrtem Hof aus.
const leisteZeigen=()=>mAn()=='c'&&(v=='kid'||v=='wish'||v=='rassen')&&!!cur&&!!kid()&&!!kid().h;
function leisteHtml(){const k=kid(),akt=v=='wish'||v=='rassen'?'wish':KT=='themen'?'themen':KT=='pflege'?'pflege':KT==''?'hof':'';
 const b=(id,ic,n,js,zu)=>`<button class="${akt==id?'on':''}" data-l="${id}" onclick="${js}"${zu?' disabled':''}${akt==id?' aria-current="page"':''}>${mi(ic,26)}${n}</button>`;
 return`<nav class="mleiste" aria-label="Bereiche">${b('hof','hof','Hof',"mGeh('')")}${b('themen','rechnen','Rechnen',"mGeh('themen')")}${b('wish','baum','Wunschbaum','mWunsch()',k.hl)}${b('pflege','buerste','Pflege',"mGeh('pflege')")}</nav>`}
