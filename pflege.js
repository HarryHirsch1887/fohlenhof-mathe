// Pferdehof Mathe: Gesundheit und Pflege (seit 2026-10-25, Plan in der Notiz "Ideen Reiten und Pferdepflege", Etappe 5)
// Wird vor app.js geladen. Alles aus app.js, hof.js, pferd.js und figur.js wird erst zur Laufzeit benutzt.
//
// Regeln:
// - Pflege: mit Pflegekiste und Führstrick (Wunschbaum, AUSR in app.js), höchstens PFLMAX-mal am Pflegetag. Der Pflegetag beginnt um 6 Uhr.
//   Mit Pflegekiste hat ein ungepflegtes Pferd leichte Schmutzflecken, nach der Pflege ist es bis zum nächsten Morgen um 6 Uhr sauber.
//   Belohnung: Herzen und Wiehern, keine Äpfel, keine Hufeisen.
// - Tierarzt alle TAZ Spieltage (TAPREIS Hufeisen), Hufschmied alle SCHZ Spieltage (SCHPREIS Hufeisen), beides ab Jährling.
//   Spieltag = Tag mit mindestens einer fertigen Runde (wie beim Wachstum, gezählt in tagZaehlt in app.js).
//   ERINN Spieltage vorher erscheint eine Erinnerung mit Zähler, rufen geht erst, wenn er fällig ist.
//   Ist ein Besuch seit einem früheren Tag fällig (überschritten), gibt es kein Training (trStatus in training.js).
//   Beim Jährling schneidet der Schmied die Hufe nur aus, ab Jungpferd gibt es neue Eisen.
// - Pflege, Tierarzt und Schmied nur bei offenem Hof. Während der Animation zählt die Hofzeit nicht (app.js).
// - Je Pferd gespeichert: ge = {t, s: Spieltage seit Tierarzt bzw. Schmied, tf, sf: Datum, an dem er fällig wurde,
//   p: {d: Pflegetag, n: so oft an diesem Tag gepflegt}, gh: 1 = Glücks-Hufeisen über der Tür (nach dem ersten Schmied)}.
//   Fehlt ge (Pferde von vor dem Update), beginnt die Zählung bei 0, also erster Schmied nach 7, erster Tierarzt nach 15 Spieltagen.
// - Hufeisen-Vorrat (k.hu): höchstens 20, mit zweitem Pferd 30 (huMax).
const TAZ=15,SCHZ=7,TAPREIS=7,SCHPREIS=5,PFLMAX=2,ERINN=2;
const huMax=k=>k&&k.h2?30:20;
// Für Tests: GPJETZT = Zeitpunkt in ms statt jetzt (nur für den Pflegetag)
let GPJETZT=null;
const pflTag=()=>{const d=new Date((GPJETZT||Date.now())-6*36e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const gpG=H=>{if(!H.ge||typeof H.ge!=='object')H.ge={t:0,s:0};return H.ge};
const gpHeute=H=>H&&H.ge&&H.ge.p&&H.ge.p.d==pflTag()?H.ge.p.n:0;
const pflegbar=H=>!!(H&&H.au&&H.au.pflege&&H.au.strick);
const dreckig=H=>!!(H&&H.au&&H.au.pflege)&&!gpHeute(H);
// Stand eines Besuchs, art 't' (Tierarzt) oder 's' (Schmied): rest = Spieltage bis fällig, faellig, ueber = seit einem früheren Tag fällig
function gpStand(H,art){const g=(H&&H.ge)||{},n=g[art]||0,z=art=='t'?TAZ:SCHZ,f=g[art+'f'];return{rest:Math.max(0,z-n),faellig:!!f,ueber:!!f&&f<tag()}}
// Training gesperrt? Liefert, wer erst kommen muss ('' = alles in Ordnung)
function gpSperre(k){if(!k||!k.h||stg(k)<1)return'';const t=gpStand(k.h,'t').ueber,s=gpStand(k.h,'s').ueber;return t&&s?'Tierarzt und Hufschmied':t?'Tierarzt':s?'Hufschmied':''}
// Ein neuer Spieltag (aus tagZaehlt): Zähler beider Pferde ab Jährling weiterzählen, Fälligkeit merken
function gesundTag(k){const t=tag();
 for(const [H,st] of [[k.h,stg(k)],[k.h2,k.h2?k.h2.st||0:0]]){if(!H||st<1)continue;const g=gpG(H);
  g.t=Math.min(999,(g.t||0)+1);g.s=Math.min(999,(g.s||0)+1);if(g.t>=TAZ&&!g.tf)g.tf=t;if(g.s>=SCHZ&&!g.sf)g.sf=t}}
// Laden und Import (pclean in app.js)
function gpClean(g){if(!g||typeof g!=='object')return null;const D=/^\d{4}-\d\d-\d\d$/,o={t:nn(g.t,0,999),s:nn(g.s,0,999)};
 if(D.test(g.tf))o.tf=g.tf;if(D.test(g.sf))o.sf=g.sf;if(g.p&&typeof g.p==='object'&&D.test(g.p.d))o.p={d:g.p.d,n:nn(g.p.n,0,PFLMAX)};if(g.gh)o.gh=1;
 if(o.t>=TAZ&&!o.tf)o.tf=tag();if(o.s>=SCHZ&&!o.sf)o.sf=tag();return o}

// ---------- Bereich "Gesundheit und Pflege" in der Kind-Ansicht ----------
let GPNOTE='',GPOK=1,GPKLICK=0;// GPOK: Erfolgsmeldung (grün) oder Hinweis (rot); GPKLICK: Zeit des letzten Starts (gegen Doppelklick)
function gpHinweis(m){GPNOTE=m;GPOK=0;ui();const n=$('#gpnote');if(n)n.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})}
const gpLaeuft=()=>!!(typeof HF!='undefined'&&HF.fuehr);
const tageTxt=n=>n==1?'1 Tag':n+' Tagen';
// Namen als Text: "Roy" bzw. "Roy und Bonnie"
const gpNamen=L=>L.map(x=>esc(x.name)).join(' und ');
function gpTeil(k){const H=hh(k),st=stg(k),n=esc(H.name),zu=k.hl,lauf=gpLaeuft(),pf=pflegbar(H),hn=gpHeute(H),P2=k.h2;
 // Bei zwei Pferden wird das zweite gleich mitgeputzt (Wunsch vom 2026-10-25), deshalb heißt der Knopf dann "Pferde putzen".
 // Text: geputzte und schmutzige Pferde getrennt nennen
 const alle=P2?[H,P2]:[H],dreck=alle.filter(dreckig),sauber=alle.filter(x=>gpHeute(x)>0&&!dreckig(x)),viele=L=>L.length>1;
 let h=`<p class="small">Du hast ${k.hu||0} von ${huMax(k)} Hufeisen ${HU}. Hufeisen gibt es für jede Runde mit mindestens ${FREI} von 10 und für jeden Trainings-Stern.</p><p class="${GPOK?'ok':'no'}" id="gpnote"${GPNOTE?'':' hidden'}>${GPNOTE}</p>`;
 h+=`<div class="card gpk" data-gp="pflege"><div class="row sp"><b>Pflege</b><span class="small">${pf?`heute ${hn} von ${PFLMAX}`:''}</span></div>`+
  (!pf?`<p class="small" style="margin:4px 0 0">Zum Putzen braucht ${n} eine Pflegekiste und einen Führstrick. Du bekommst beides im Wunschbaum unter „Reitausrüstung & Pflege“.</p>`:
   `<p class="small" style="margin:4px 0 0">${[sauber.length?`${gpNamen(sauber)} ${viele(sauber)?'sind':'ist'} frisch geputzt.`:'',dreck.length?`${gpNamen(dreck)} ${viele(dreck)?'haben':'hat'} ein paar Schmutzflecken im Fell.`:''].filter(x=>x).join(' ')}${hn>=PFLMAX?' Für heute genug geputzt, morgen wieder.':''}</p>`+
   (hn<PFLMAX&&!zu?`<button class="go" onclick="gpPflege()"${lauf?' disabled':''}>${P2?'Pferde':n} putzen</button>`:''))+`</div>`;
 if(st<1)h+=`<p class="small">Tierarzt und Hufschmied kommen, wenn ${n} ein ${GS[1].n} ist.</p>`;
 else h+=gpKarte(k,H,'t')+gpKarte(k,H,'s');
 // Zweites Pferd: Hinweis, wenn dort etwas fällig ist (gepflegt und versorgt wird das Pferd, das gerade mit dir rechnet)
 if(P2&&(P2.st||0)>=1){const f=['t','s'].filter(a=>gpStand(P2,a).faellig).map(a=>a=='t'?'der Tierarzt':'der Hufschmied');
  if(f.length)h+=`<p class="small">Bei ${esc(P2.name)} ${f.length>1?'sind':'ist'} ${f.join(' und ')} fällig. Wechsle oben zu ${esc(P2.name)}, um ${f.length>1?'sie':'ihn'} zu rufen.</p>`}
 return h+(zu?`<p class="small">Pflege, Tierarzt und Hufschmied gehen wieder, wenn du eine Runde mit mindestens ${FREI} von 10 richtig geschafft hast.</p>`:'')}
function gpKarte(k,H,art){const S=gpStand(H,art),ta=art=='t',preis=ta?TAPREIS:SCHPREIS,titel=ta?'Tierarzt':'Hufschmied',
 was=ta?'Kontrolle beim Tierarzt':stg(k)<2?'Hufe ausschneiden':'Hufe neu beschlagen',zu=k.hl,lauf=gpLaeuft();
 const t=S.ueber?`<p class="no" style="margin:4px 0 0">${was} ist überfällig. Bis der ${titel} da war, gibt es kein Training.</p>`:
  S.faellig?`<p class="small" style="margin:4px 0 0">${was}: jetzt fällig.</p>`:`<p class="small" style="margin:4px 0 0">${was}: in ${tageTxt(S.rest)} mit Mathe.</p>`;
 const knopf=S.faellig?(zu?'':`<button class="go" onclick="${ta?'gpArzt':'gpSchmied'}()"${lauf?' disabled':''}>${titel} rufen · ${preis} ${HU}</button>`):
  S.rest<=ERINN?`<button class="alt" disabled>${titel} kommt in ${tageTxt(S.rest)}</button>`:'';
 return`<div class="card gpk" data-gp="${art}"><div class="row sp"><b>${titel}</b><span class="small">alle ${ta?TAZ:SCHZ} Tage · ${preis} ${HU}</span></div>${t}${knopf}</div>`}
// Knöpfe
function gpOk(k){return!!(k&&k.h&&!k.hl&&!gpLaeuft()&&Date.now()-GPKLICK>800)}
function gpPflege(){const k=kid();if(!gpOk(k))return;const H=hh(k);if(!pflegbar(H))return;const n=gpHeute(H);
 if(n>=PFLMAX)return gpHinweis('Für heute genug geputzt, morgen wieder.');
 gpG(H).p={d:pflTag(),n:n+1};if(k.h2)gpG(k.h2).p={d:pflTag(),n:Math.max(n+1,gpHeute(k.h2))};// das zweite Pferd wird mitgeputzt
 gpStart(k,'pflege')}
function gpArzt(){gpRufen('t')}
function gpSchmied(){gpRufen('s')}
function gpRufen(art){const k=kid();if(!gpOk(k)||stg(k)<1)return;const H=hh(k),S=gpStand(H,art),ta=art=='t',preis=ta?TAPREIS:SCHPREIS;if(!S.faellig)return;
 if((k.hu||0)<preis)return gpHinweis(`Für den ${ta?'Tierarzt':'Hufschmied'} brauchst du ${preis} Hufeisen, du hast ${k.hu||0}. Hufeisen gibt es für jede Runde mit mindestens ${FREI} von 10 und für jeden Trainings-Stern.`);
 const g=gpG(H);k.hu-=preis;g[art]=0;delete g[art+'f'];if(!ta)g.gh=1;gpStart(k,ta?'arzt':'schmied')}
function gpFertigText(art,H,st,k){const n=esc(H.name),zw=art=='pflege'&&k&&k.h2;
 return art=='pflege'?(zw?`${gpNamen([H,k.h2])} sind frisch geputzt und freuen sich!`:`${n} ist frisch geputzt und freut sich!`):art=='arzt'?`Der Tierarzt sagt: ${n} ist gesund! Die nächste Kontrolle ist in ${TAZ} Tagen mit Mathe.`:
  `${n} hat ${st>=2?'neue Hufeisen':'frisch ausgeschnittene Hufe'}. Der Hufschmied kommt in ${SCHZ} Tagen mit Mathe wieder.`}

// ---------- Zeichnungen ----------
const SVGNS='http://www.w3.org/2000/svg';
// Anbinder: zwei Pfosten mit Querholz und Ring, kommt mit der Pflegekiste. Lage: rechts neben Unterstand oder Stall, ohne Gebäude rechts der Mitte
const gpAX=H=>Math.round(unterkunft(H)?HF.OX+.477*HF.WK+78:HF.OX+.56*HF.WK),GPAY=GY+34;
const anbinderSvg=(x,y)=>`<g class="anbinder"><ellipse cx="${x}" cy="${y+.8}" rx="18" ry="1.6" fill="#000" opacity=".12"/><rect x="${x-14.6}" y="${y-14}" width="2.8" height="15" rx=".8" fill="#8a6440"/><rect x="${x+11.8}" y="${y-14}" width="2.8" height="15" rx=".8" fill="#8a6440"/>`+
 `<rect x="${x-17}" y="${y-13.4}" width="34" height="2.6" rx="1" fill="#a9805a"/><rect x="${x-17}" y="${y-11.6}" width="34" height=".8" fill="#7d5c3c" opacity=".5"/><circle cx="${x}" cy="${y-9}" r="1.5" fill="none" stroke="#9aa0a6" stroke-width=".7"/></g>`;
// Glücks-Hufeisen (offen nach oben): über der linken Tür von Unterstand oder Stall, ohne Gebäude am linken Pfosten des Anbinders
function gluecksSvg(H){if(!H||!H.ge||!H.ge.gh)return'';const u=unterkunft(H);let x,y;
 if(u){const o=DRIN[u].o;x=Math.round(HF.OX+.477*HF.WK)+o[0]+o[2]/2;y=GY+12+o[1]-3.2}else if(H.au&&H.au.pflege){x=gpAX(H)-13.2;y=GPAY-16.4}else return'';
 return`<g class="glueck" transform="translate(${r1(x)} ${r1(y)})"><path d="M-2.4 -2.6V.2a2.4 2.4 0 0 0 4.8 0V-2.6" fill="none" stroke="#b8bec4" stroke-width="1.3" stroke-linecap="round"/><circle cx="-2.3" cy="-.8" r=".3" fill="#5a5f66"/><circle cx="2.3" cy="-.8" r=".3" fill="#5a5f66"/></g>`}
const KISTE='<rect x="-7" y="-6" width="14" height="6" rx="1" fill="#4a90c2" stroke="#2c5f86" stroke-width=".5"/><path d="M-4 -6v-2.4h8v2.4" fill="none" stroke="#2c5f86" stroke-width=".8"/><rect x="-5.6" y="-8.6" width="4.2" height="2.6" rx=".5" fill="#8b5a2b"/><path d="M1.5 -6.2l1.6 -2.6l1 .6l-1.6 2.6Z" fill="#d25a4c"/>';
// Amboss auf einem kleinen Wagen (Weltkoordinaten), Griff zeigt nach links
const AMBOSS='<g class="amboss"><path class="griff" d="M-11 -6L-21 -12" stroke="#7a5230" stroke-width="1.4" stroke-linecap="round"/><rect x="-11" y="-7" width="22" height="3.4" rx="1" fill="#8a6440"/><circle cx="-7" cy="-2.4" r="2.6" fill="#3a3530"/><circle cx="7" cy="-2.4" r="2.6" fill="#3a3530"/><circle cx="-7" cy="-2.4" r=".8" fill="#9aa0a6"/><circle cx="7" cy="-2.4" r=".8" fill="#9aa0a6"/>'+
 '<path d="M-5 -7V-10H-8.5Q-10.5 -13.6 -6 -13.6H9Q13 -13.6 13.4 -11.4L6 -10.4V-7Z" fill="#4b4f55" stroke="#2b2d30" stroke-width=".5"/><path d="M-6 -13H8" stroke="#fff" stroke-width=".6" opacity=".35"/></g>';
// Werkzeuge in der rechten Hand (Koordinaten der Figur, Hand im Ursprung)
const WZ={
 buerste:'<g transform="rotate(-20)"><rect x="-6" y="-3" width="12" height="5" rx="2" fill="#8b5a2b" stroke="#2b1d12" stroke-width=".8"/><path d="M-5 2v2.8M-2.5 2v2.8M0 2v2.8M2.5 2v2.8M5 2v2.8" stroke="#3b2414" stroke-width="1"/></g>',
 kamm:'<g transform="rotate(-25)"><rect x="-1.4" y="-9" width="2.8" height="10" rx="1" fill="#e48fb1" stroke="#2b1d12" stroke-width=".7"/><ellipse cy="-11" rx="5" ry="3" fill="#e48fb1" stroke="#2b1d12" stroke-width=".7"/><path d="M-4 -13.2v-2M-2 -13.7v-2.2M0 -13.9v-2.2M2 -13.7v-2.2M4 -13.2v-2" stroke="#2b1d12" stroke-width=".7"/></g>',
 kratzer:'<g><path d="M0 -1v-8q0 -3 3.4 -3" fill="none" stroke="#9aa0a6" stroke-width="1.7" stroke-linecap="round"/><rect x="-1.7" y="-1" width="3.4" height="7.5" rx="1.2" fill="#d25a4c" stroke="#2b1d12" stroke-width=".6"/></g>',
 stetho:'<g><path d="M0 0q-3 -6 -8 -8" fill="none" stroke="#5a6470" stroke-width="1.2"/><circle cx="0" cy="2.2" r="2.8" fill="#c9ced3" stroke="#2b1d12" stroke-width=".7"/></g>',
 lampe:'<g transform="rotate(-60)"><rect x="-1.3" y="-8" width="2.6" height="8" rx=".8" fill="#5a6470" stroke="#2b1d12" stroke-width=".5"/><circle cy="-8.6" r="1.6" fill="#fff6b0" stroke="#2b1d12" stroke-width=".5"/></g>',
 hammer:'<g transform="rotate(-30)"><rect x="-1" y="-12" width="2" height="13" fill="#8b5a2b" stroke="#2b1d12" stroke-width=".5"/><rect x="-4.6" y="-15" width="9.2" height="4" rx=".8" fill="#5a5f66" stroke="#2b1d12" stroke-width=".5"/></g>',
 raspel:'<g transform="rotate(-10)"><rect x="-1.4" y="0" width="2.8" height="5" fill="#8b5a2b"/><rect x="-1.9" y="-12" width="3.8" height="12" rx=".6" fill="#7b8087" stroke="#2b1d12" stroke-width=".5"/><path d="M-1.6 -10h3.2M-1.6 -8h3.2M-1.6 -6h3.2M-1.6 -4h3.2M-1.6 -2h3.2" stroke="#4b4f55" stroke-width=".4"/></g>'};
// Erwachsene Person, Ansicht von vorn (wie figur.js): Tierarzt (weißer Kittel, Stethoskop, Brille, Arzttasche) oder Hufschmied
// (Hemd, Lederschürze, Schirmmütze, Bart). Füße auf y = 0, Kopf oben bei etwa y = -126. Der rechte Arm (.parm) dreht sich um die Schulter (12.8, -90).
function personBild(art){const arzt=art=='arzt',ul='#2b1d12',st=`stroke="${ul}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"`,
 haut=arzt?'#f0c8a8':'#d9a47e',haar=arzt?'#5b4636':'#3b2a20',ob=arzt?'#f7f8fa':'#55606b',hose=arzt?'#3e4f73':'#3a3530';
 const arm=(d,c)=>`<path d="${d}" fill="none" stroke="${ul}" stroke-width="7.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
  hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="${haut}" ${st}/>`;
 let s=`<ellipse rx="18" ry="3" fill="#000" opacity=".15"/>`+
  `<g ${st}><path d="M-9.5 -58L-9 -6H-3L-2.4 -58Z" fill="${hose}"/><path d="M9.5 -58L9 -6H3L2.4 -58Z" fill="${hose}"/>`+
  `<path d="M-9.4 -7H-2.6V-1Q-2.6 0 -4 0H-12.4Q-13.6 0 -13 -1.6Q-12 -4 -9.4 -4.6Z" fill="#2a2420"/><path d="M9.4 -7H2.6V-1Q2.6 0 4 0H12.4Q13.6 0 13 -1.6Q12 -4 9.4 -4.6Z" fill="#2a2420"/></g>`+
  `<rect x="-3.6" y="-102" width="7.2" height="8" fill="${haut}" ${st}/>`;
 s+=arzt?`<path d="M-14 -94Q0 -97 14 -94L15.5 -40H-15.5Z" fill="${ob}" ${st}/><path d="M0 -86V-40" stroke="#cfd4da" stroke-width="1"/><path d="M-6 -94L0 -85L6 -94Z" fill="#bcd3e8" ${st}/><rect x="5" y="-80" width="6" height="5" fill="none" stroke="#cfd4da" stroke-width=".8"/>`+
   `<path d="M-6.5 -95Q-9 -82 -4 -76M6.5 -95Q9 -82 4 -76M-4 -76Q0 -72 4 -76" fill="none" stroke="#5a6470" stroke-width="1.3"/><circle cx="0" cy="-72.5" r="2.2" fill="#c9ced3" stroke="${ul}" stroke-width=".6"/>`
  :`<path d="M-13.5 -94Q0 -97 13.5 -94L13 -56H-13Z" fill="${ob}" ${st}/><path d="M-11 -86Q0 -84 11 -86L12 -34Q0 -32 -12 -34Z" fill="#8a5a32" ${st}/><path d="M-11 -86L-13 -94M11 -86L13 -94" stroke="#5e3d22" stroke-width="1.4"/><path d="M-8 -60H8" stroke="#5e3d22" stroke-width="1"/>`;
 s+=arm('M-12.8 -90Q-17 -78 -16.6 -64',ob)+hand(-16.6,-62);
 if(arzt)s+=`<g transform="translate(-16.6 -62)"><path d="M-5 0Q0 -5 5 0" fill="none" stroke="#3b2414" stroke-width="1.4"/><rect x="-7" y="0" width="14" height="10" rx="2" fill="#5a3a22" ${st}/><rect x="-1.5" y="3" width="3" height="3" fill="#d9b25a"/></g>`;
 s+=`<g class="parm">${arm('M12.8 -90Q17 -78 16.6 -64',ob)}${hand(16.6,-62)}<g class="wz" transform="translate(16.6 -62)"></g></g>`;
 s+=`<circle cx="-12.4" cy="-109" r="2.6" fill="${haut}" ${st}/><circle cx="12.4" cy="-109" r="2.6" fill="${haut}" ${st}/><ellipse cy="-110" rx="12.8" ry="12.4" fill="${haut}" ${st}/>`+
  `<circle cx="-4.4" cy="-110" r="1.4" fill="${ul}"/><circle cx="4.4" cy="-110" r="1.4" fill="${ul}"/><path d="M.2 -108q.9 1.2 -.2 1.9" stroke="#b9825d" stroke-width=".8" fill="none"/>`;
 s+=arzt?`<path d="M-3.4 -103.6Q0 -101 3.4 -103.6" stroke="#8a3b3b" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M-12.6 -113Q-13 -125 0 -125Q13 -125 12.6 -113Q10 -119 0 -119Q-10 -119 -12.6 -113Z" fill="${haar}" ${st}/>`+
   `<g fill="none" stroke="#3a3a42" stroke-width=".8"><circle cx="-4.4" cy="-110" r="3"/><circle cx="4.4" cy="-110" r="3"/><path d="M-1.4 -110H1.4"/></g>`
  :`<path d="M-9 -104.5Q-10 -96 0 -94.5Q10 -96 9 -104.5Q5 -100.5 0 -100.5Q-5 -100.5 -9 -104.5Z" fill="${haar}" ${st}/><path d="M-3 -102.6Q0 -101 3 -102.6" stroke="#f0c8a8" stroke-width=".9" fill="none" stroke-linecap="round"/>`+
   `<path d="M-13.6 -113Q-13 -126 0 -126Q14 -126 14 -114Q0 -117 -13.6 -113Z" fill="#3e4652" ${st}/><path d="M6 -115.6Q15 -117 19 -114Q14 -112.6 6 -113Z" fill="#2f3640" ${st}/>`;
 return s}
// Sprechblase "Alles gesund!" mit Herz
const BLASE='<g class="blase"><rect x="-29" y="-13" width="58" height="12" rx="6" fill="#fff" stroke="#3a2614" stroke-opacity=".45" stroke-width=".5"/><path d="M-3 -1.3L0 3L3 -1.3Z" fill="#fff"/>'+
 '<text x="-4" y="-4.6" font-size="6.2" font-weight="bold" text-anchor="middle" fill="#26331f">Alles gesund!</text><path d="M20.5 -8.3c-1.3 -2 -4 -.4 0 2.8c4 -3.2 1.3 -4.8 0 -2.8Z" fill="#d1503f"/></g>';
// Kurzer Metallklang (Hammer auf dem Eisen, herunterfallendes Eisen), per Web Audio, still bei "Ton: aus"
function kling(f=2400,dauer=.3,laut=.2){if(S.snd===0)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();
 const t=AC.currentTime+.01,g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(laut,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+dauer);g.connect(AC.destination);
 [[f,1],[f*2.76,.45],[f*5.4,.2]].forEach(([fr,a])=>{const o=AC.createOscillator(),gg=AC.createGain();o.frequency.value=fr;gg.gain.value=a;o.connect(gg);gg.connect(g);o.start(t);o.stop(t+dauer+.05)})}catch(e){}}

// ---------- Szenen auf dem Hof ----------
// Ablauf als Liste von Schritten {d: Dauer, a: Anfang, f: (p 0..1, F), bis: Bedingung zum vorzeitigen Ende}.
// Die Szene steht in HF.fuehr (wie das Herausholen in hof.js), fuehrSchritt ruft dafür jedes Bild gpSchritt auf.
// Der Spielstand ist beim Start schon gespeichert. Wird der Hof neu aufgebaut (z. B. Ansicht gewechselt), endet die Szene einfach.
const gpL=(p,a,b)=>a+(b-a)*Math.max(0,Math.min(1,p)),gpSm=p=>p*p*(3-2*p);
const gpS=(h,d)=>(.30+.20*d)*GS[h.st].s*PFS,gpY=d=>138+d*54;
const BEIN={vn:50,vf:42,hn:-58,hf:-66};
// GPFS: Größe von Figur, Tierarzt und Schmied während der Szene (die Figur schrumpft weich von FIGX.s darauf und wächst am Ende zurück)
const GPFS=.34;
// Hand der Figur (rechte Hand, Arm um a Grad gedreht) in Weltkoordinaten
function gpHand(x,y,a,s=FIGX.s){const r=a*Math.PI/180,dx=3.6,dy=23.4;return[x+(11.6+dx*Math.cos(r)-dy*Math.sin(r))*s,y+(-75+dx*Math.sin(r)+dy*Math.cos(r))*s]}
const gpBeinX=(F,b)=>F.HX+BEIN[b]*F.bx*F.hs;
// Huf in Weltkoordinaten (beim Anheben wandert er nach oben und etwas nach hinten)
function gpHufPos(F,b){const s=gpS(F.horse,F.hdd),gy=gpY(F.hdd),f=F.huf&&F.huf.b==b?F.huf.f:0;return[F.hx+F.hdir*(BEIN[b]*F.bx-(b[0]=='v'?22:-10)*f)*s,gy-4*s-46*s*f]}
function gpEbene(id,vor){const e=document.createElementNS(SVGNS,'g');e.id=id;HF.hw.insertBefore(e,vor);return e}
function gpStart(k,art){const H=hh(k),u=unterkunft(H),st=stg(k);GPNOTE='';GPOK=1;GPKLICK=Date.now();
 if(u)H.hs={d:tag(),s:'raus'};// am Ende steht das Pferd auf der Koppel
 save();
 const h=typeof HF!='undefined'&&HF.horses?HF.horses.find(x=>x.own):null;
 if(RM||v!='kid'||HF.kind!='kid'||!h||!h.g_||!HF.hw||!HF.figP){GPNOTE=gpFertigText(art,H,st,k);if(typeof hofSync=='function')hofSync(true);ui();return}
 const xs=Math.round(HF.OX+.477*HF.WK),AX=gpAX(H),hd=.55,hs=gpS(h,hd),gyT=gpY(hd),[fx,fy]=HF.figP;
 const F={art,L:[],i:0,t:0,T:0,xs,AX,AY:GPAY,hd,hs,gyT,HX:AX-112*hs,fx,fy,u,st,name:H.name,anb:!!(H.au&&H.au.pflege),hatStrick:!!(H.au&&H.au.strick),bx:[.76,.87,.95,1][h.st]||1,
  fig:[fx,fy],fs:FIGX.s,fsZ:GPFS,arm:0,wz:'',vorn:0,geht:0,hx:h.x,hdd:h.d,hdir:h.dir,pl:0,pg:'walk',pgr:0,pop:1,huf:null,strick:'',kiste:0,dreck:1,P:{},tl:[],camX:art=='arzt'&&u?xs+20:AX-20,horse:h};
 // Steht das Pferd drinnen: beim Tierarzt (mit Gebäude) bleibt es drin, sonst kommt es heraus
 if(h.drin){if(art=='arzt'&&u){F.drin=1;F.eigen=1;F.indoor=HF.hw.querySelector('#hdrin')}
  else{F.ausStall=1;h.drin=0;HF.hw.insertBefore(h.g_,HF.vorne);const w=HF.hw.querySelector('#hdrin');if(w)w.remove();F.hx=xs;F.hdd=0;F.hdir=1;F.pop=0;HF.ord=[]}}
 // Figur: eigene oder (ohne Figur) eine vorübergehende mit Standard-Aussehen
 let fe=HF.figE;if(!fe){HF.hw.insertAdjacentHTML('beforeend',`<g class="fig gptemp">${figurBild(null)}</g>`);fe=HF.hw.lastElementChild;HF.hw.insertBefore(fe,HF.hap);F.temp=1}
 F.fe=fe;F.feNext=fe.nextSibling;F.wa=fe.querySelector('.winkarm');
 if(F.wa){const w=document.createElementNS(SVGNS,'g');w.setAttribute('class','wz');w.setAttribute('transform','translate(15.2 -51.6)');F.wa.appendChild(w);F.wzEl=w}
 // Ebenen: hinter den Pferden (Figur auf der anderen Seite) und ganz vorn (Figur, Kiste, Strick, Personen, Funken)
 F.eh=gpEbene('gph',HF.hap.nextSibling);F.ev=gpEbene('gpv',HF.vorne.nextSibling);
 F.ev.insertAdjacentHTML('beforeend',`<g class="kiste" opacity="0">${KISTE}</g><path class="seil" fill="none" stroke="#c0392b" stroke-width=".9" stroke-linecap="round"/>`);
 F.kEl=F.ev.querySelector('.kiste');F.seil=F.ev.querySelector('.seil');F.KX=AX+20;F.KY=gyT+12;F.kEl.setAttribute('transform',`translate(${r1(F.KX)} ${r1(F.KY)})`);
 F.dr=[...h.g_.querySelectorAll('.dreck')];
 // Zweites Pferd auf dem Hof (Freund "e:2"): wird am Ende der Pflege mitgeputzt
 if(art=='pflege'&&k.h2){F.zw=HF.horses.find(x=>x.zweit&&x.g_)||null;F.dr2=F.zw?[...F.zw.g_.querySelectorAll('.dreck')]:[]}
 ({pflege:gpPflegeSzene,arzt:gpArztSzene,schmied:gpSchmiedSzene})[art](F);
 HF.fuehr=F;if(F.L[0]&&F.L[0].a)F.L[0].a(F);
 hofKick(1);scrollTo({top:0,behavior:'smooth'});ui()}
// Figur (und auf Wunsch das Pferd) gehen von ihrer Lage zu Beginn des Schritts zum Ziel. Ziele: [x, y] bzw. [x, Tiefe, Richtung] oder Funktion(F)
function gpGeh(F,d,fz,hz,ex){F.L.push({d,a:F=>{F.f0=[...F.fig];F.h0=[F.hx,F.hdd];F.fz=typeof fz=='function'?fz(F):fz;F.hz=typeof hz=='function'?hz(F):hz;if(ex&&ex.a)ex.a(F)},
 f:(p,F)=>{if(F.fz){F.fig=[gpL(p,F.f0[0],F.fz[0]),gpL(p,F.f0[1],F.fz[1])];F.geht=p<1}
  if(F.hz){F.hx=gpL(p,F.h0[0],F.hz[0]);F.hdd=gpL(p,F.h0[1],F.hz[1]);F.pl=p<1&&Math.abs(F.hz[0]-F.h0[0])>2;if(p>=1&&F.hz[2])F.hdir=F.hz[2];else if(F.pl)F.hdir=F.hz[0]>=F.h0[0]?1:-1}
  if(ex&&ex.f)ex.f(p,F)}})}
const gpPause=(F,d,f,a)=>F.L.push({d,a,f});
// Pferd holen: aus dem Unterstand bzw. Stall oder auf der Koppel (das Pferd kommt der Figur entgegen), dann Strick anlegen
function gpHolen(F){
 if(F.ausStall){gpGeh(F,1.2,[F.xs-24,GY+20]);gpPause(F,.5,(p,F)=>{F.pop=p;if(p>.4&&F.hatStrick)F.strick='hand'});return}
 F.L.push({d:2.2,a:F=>{F.mx=Math.min(F.fx+100,Math.max(F.fx-60,F.hx));F.f0=[...F.fig];F.h0=[F.hx,F.hdd];const dd=Math.abs(F.hx-F.mx);F.L[F.i].d=Math.min(4,Math.max(1.6,dd/70));F.pg=dd>200?'gallop':dd>80?'trot':'walk';F.vorn=1},
  f:(p,F)=>{F.fig=[gpL(p,F.f0[0],F.mx+26),gpL(p,F.f0[1],F.gyT+8)];F.geht=p<1;F.hx=gpL(p,F.h0[0],F.mx);F.hdd=gpL(p,F.h0[1],.45);F.pl=p<1&&Math.abs(F.mx-F.h0[0])>2;
   if(F.pl)F.hdir=F.mx>=F.h0[0]?1:-1;if(p>=1){F.hdir=1;F.pg='walk';if(F.hatStrick)F.strick='hand'}}})}
// Zum Anbinder führen und festbinden (ohne Anbinder hält die Figur das Pferd am Kopf)
function gpZumAnbinder(F){gpGeh(F,2.6,[F.AX+4,F.gyT+6],[F.HX,F.hd,1],{a:F=>{F.vorn=1;F.pg='walk'}});
 if(F.anb)gpPause(F,.6,(p,F)=>{F.arm=-35*Math.sin(Math.PI*p);if(p>.5&&F.hatStrick)F.strick='pfosten'})}
// Losbinden, ein paar Schritte auf die Koppel führen, Strick ab, das Pferd läuft los, die Figur winkt und geht zurück
function gpLoslassen(F,gang){
 if(F.anb)gpPause(F,.6,(p,F)=>{F.arm=-35*Math.sin(Math.PI*p);if(p>.5&&F.hatStrick)F.strick='hand'});
 gpGeh(F,2,[F.AX+48,F.gyT+7],[F.HX+44,F.hd,1]);
 gpPause(F,.4,(p,F)=>{F.arm=-60*Math.sin(Math.PI*p);if(p>.3)F.strick=''});
 gpPause(F,1.6,(p,F)=>{F.arm=p<.85?-140+18*Math.sin(F.T*12):0},F=>{F.hfrei=gang;F.hdir=-1;herzen([F.horse]);if(S.snd!==0)neigh(F.horse.st)});
 gpGeh(F,1.6,[F.fx,F.fy],null,{a:F=>{F.vorn=0;F.arm=0;F.fsZ=FIGX.s}})}
// Pflege: Bürste links und rechts, Mähne und Schweif, vier Hufe auskratzen
function gpPflegeSzene(F){const X=s=>F.HX+s*F.hs,KX=F.KX-8,KY=F.KY-2;
 gpHolen(F);gpZumAnbinder(F);
 gpGeh(F,.7,[KX,KY],null,{f:(p,F)=>{F.kiste=gpSm(Math.max(0,p*2-1))}});
 gpPause(F,.4,(p,F)=>{F.arm=-40*Math.sin(Math.PI*p)},F=>{F.wz='buerste'});
 gpGeh(F,.6,[X(35),F.gyT+5]);
 gpPause(F,2.6,(p,F)=>{F.fig=[gpL(gpSm(p),X(35),X(-62)),F.gyT+5];F.arm=-50+22*Math.sin(F.T*14);F.dreck=1-.5*p;if(Math.random()<.12)gpStaub(F)});
 gpGeh(F,.7,[X(-128),F.gyT+1],null,{a:F=>{F.arm=0}});
 gpGeh(F,.6,[X(-50),F.gyT-8],null,{a:F=>{F.vorn=0}});
 gpPause(F,2.6,(p,F)=>{F.fig=[gpL(gpSm(p),X(-50),X(45)),F.gyT-8];F.arm=-128+20*Math.sin(F.T*14);F.dreck=.5-.5*p;if(Math.random()<.12)gpStaub(F)});
 gpGeh(F,.6,[X(-128),F.gyT+1],null,{a:F=>{F.arm=0}});
 gpGeh(F,.8,[KX,KY],null,{a:F=>{F.vorn=1}});
 gpPause(F,.4,(p,F)=>{F.arm=-40*Math.sin(Math.PI*p)},F=>{F.wz='kamm'});
 gpGeh(F,.6,[X(56),F.gyT+5]);
 gpPause(F,2.4,(p,F)=>{F.fig=[X(56)+Math.sin(F.T*3)*2,F.gyT+5];F.arm=-122+14*Math.sin(F.T*10);if(Math.random()<.06)gpPartikel(F,'funkel',X(78)+F.hdir*0,gpY(F.hdd)-190*F.hs)});
 gpGeh(F,.8,[X(-122),F.gyT+5],null,{a:F=>{F.arm=0}});
 gpPause(F,2,(p,F)=>{F.arm=-66+16*Math.sin(F.T*10);if(Math.random()<.06)gpPartikel(F,'funkel',X(-96),gpY(F.hdd)-120*F.hs)});
 gpGeh(F,.8,[KX,KY],null,{a:F=>{F.arm=0}});
 gpPause(F,.4,(p,F)=>{F.arm=-40*Math.sin(Math.PI*p)},F=>{F.wz='kratzer'});
 for(const b of ['vn','vf','hn','hf']){
  gpGeh(F,.5,F=>[gpBeinX(F,b)-(b[0]=='v'?16:12)*F.hs/.2,F.gyT+6],null,{a:F=>{F.arm=0;F.huf=null}});
  gpPause(F,2,(p,F)=>{F.huf.f=p<.15?p/.15:p>.85?(1-p)/.15:1;F.arm=-30+14*Math.sin(F.T*18);if(p>.2&&p<.8&&Math.random()<.22){const [x,y]=gpHufPos(F,b);gpPartikel(F,'krume',x,y)}},F=>{F.huf={b,f:0}})}
 gpGeh(F,.6,[KX,KY],null,{a:F=>{F.huf=null;F.arm=0}});
 gpPause(F,.5,(p,F)=>{F.kiste=1-p},F=>{F.wz=''});
 gpLoslassen(F,'gallop');
 // Bei zwei Pferden wird das zweite anschließend mitgeputzt: Kamera hin, Schmutz verschwindet mit Glitzer, Herzen und Wiehern
 // (nur wenn es Schmutzflecken hat; erst schwenken, dann putzen)
 if(F.zw&&F.dr2.length){F.L.push({d:2.5,a:F=>{F.camX=F.zw.x},f:(p,F)=>{F.camX=F.zw.x},bis:F=>F.t>=.8&&F.zw.x>HF.cam+60&&F.zw.x<HF.cam+HF.W-60});// warten, bis es im Bild ist
  gpPause(F,1.6,(p,F)=>{F.camX=F.zw.x;F.dr2.forEach(e=>e.style.opacity=Math.max(0,1-p).toFixed(2));const z=F.zw;if(z.sc&&Math.random()<.25){const s=z.sc*PFS;gpPartikel(F,'funkel',z.x+(Math.random()-.5)*120*s,z.gy-(90+Math.random()*80)*s)}
   if(p>.55&&!F.zwH&&z.sc){F.zwH=1;herzen([z]);if(S.snd!==0)neigh(z.st)}})}}
// Hufschmied: kommt mit Amboss, je Huf altes Eisen ab, raspeln, neues Eisen glühend anpassen (dampft), dreimal hämmern, Glitzer.
// Beim Jährling nur ausschneiden und raspeln. Danach scharrt das Pferd, der Schmied tippt an die Mütze und geht.
function gpSchmiedSzene(F){const eisen=F.st>=2;
 gpHolen(F);gpZumAnbinder(F);
 gpPause(F,.1,null,F=>{gpPerson(F,'schmied',Math.min(gpRand(F),F.AX+166),F.gyT+12);gpZiel(F,'schmied',[F.AX+6,F.gyT+12],44)});
 gpGeh(F,1,[F.AX+46,F.gyT+4],null,{a:F=>{F.vorn=1}});
 F.L.push({d:9,bis:F=>gpDa(F,'schmied')});
 // Amboss neben dem Anbinder abstellen, solange an den Hufen gearbeitet wird
 gpPause(F,.1,null,F=>{const p=F.P.schmied;p.abFix=[p.x+p.abx,p.y]});
 for(const b of ['vn','vf','hn','hf']){
  F.L.push({d:6,a:F=>{gpZiel(F,'schmied',[gpBeinX(F,b)-(b[0]=='v'?16:12)*F.hs/.2,F.gyT+10],30)},bis:F=>gpDa(F,'schmied')});
  F.L.push({d:2.6,a:F=>{F.huf={b,f:0};F.he={}},f:(p,F)=>{const P=F.P.schmied,e=F.he,[hx,hy]=gpHufPos(F,b);F.huf.f=p<.1?p/.1:p>.92?(1-p)/.08:1;
   if(eisen&&!e.alt&&p>.12){e.alt=1;gpPartikel(F,'eisen',hx,hy);kling(1300,.25,.12)}
   if(p>.16&&p<(eisen?.48:.88)){P.wz='raspel';P.arm=-38+16*Math.sin(F.T*22);if(Math.random()<.35)gpPartikel(F,'span',hx,hy)}
   else if(eisen&&p>=.48&&p<.64){P.wz='';P.arm=-24;if(!e.gl){e.gl=1;F.ev.insertAdjacentHTML('beforeend','<path class="neueisen" d="M-2.4 -.4V1.6a2.4 2.4 0 0 0 4.8 0V-.4" fill="none" stroke="#ff8a2a" stroke-width="1.3" stroke-linecap="round"/>');e.el=F.ev.lastElementChild}if(Math.random()<.35)gpPartikel(F,'dampf',hx,hy-2)}
   else if(eisen&&p>=.64&&p<.9){P.wz='hammer';const q=(p-.64)/.26*3,n=Math.floor(q);P.arm=-75+45*Math.abs(Math.sin(q*Math.PI));if(n<3&&!e['k'+n]&&q-n>.5){e['k'+n]=1;kling(2600,.3,.2);gpPartikel(F,'funkel',hx,hy)}}
   else if(p>=.9){P.wz='';P.arm=0;if(!e.fu){e.fu=1;for(let i=0;i<3;i++)gpPartikel(F,'funkel',hx+(Math.random()-.5)*6,hy+(Math.random()-.5)*4)}}
   if(e.el){const c=p<.64?'#ff8a2a':p<.8?'#c98a5a':'#9aa0a6';e.el.setAttribute('stroke',c);e.el.setAttribute('transform',`translate(${r1(hx)} ${r1(hy)})`);if(p>=.97){e.el.remove();e.el=null}}}});
 }
 // Scharren und Wiehern, Schmied tippt an die Mütze und geht mit dem Amboss
 gpPause(F,1.3,(p,F)=>{F.huf={b:'vn',f:Math.abs(Math.sin(p*Math.PI*2))*.7}},F=>{gpZiel(F,'schmied',[F.AX-6,F.gyT+12],30);if(S.snd!==0)neigh(F.horse.st);herzen([F.horse])});
 gpPause(F,1,(p,F)=>{F.huf=null;F.P.schmied.arm=-168*Math.sin(Math.PI*p)});
 gpPause(F,.1,null,F=>{const p=F.P.schmied;gpWeg(F,'schmied',F.gyT+12);if(p.abFix){p.abx=p.abFix[0]-p.x;p.abFix=null}p.abSoll=-18});
 gpLoslassen(F,'trot');gpWarteWeg(F)}
// Tierarzt. Mit Unterstand oder Stall: Pferd hinein, der Arzt geht hinterher, Untersuchung in der offenen Tür, "Alles gesund!", Pferd wieder heraus.
// Ohne Gebäude: Untersuchung am Anbinder (Stethoskop an der Brust, Blick ins Maul).
function gpArztSzene(F){
 if(F.u){
  // Mit Gebäude kommt der Arzt schon, während das Pferd hineingebracht wird
  gpPause(F,.1,null,F=>{gpPerson(F,'arzt',Math.min(gpRand(F),F.xs+190),GY+40)});
  gpPause(F,.1,null,F=>gpZiel(F,'arzt',[F.xs+30,GY+30],34));
  if(!F.drin){gpHolen(F);
   gpGeh(F,3,[F.xs-24,GY+20],[F.xs,0,1],{a:F=>{F.vorn=1}});
   gpPause(F,.4,(p,F)=>{F.pop=1-p;if(p>.3)F.strick=''});
   gpPause(F,.1,null,F=>gpHinein(F));
   gpGeh(F,1,[F.xs-46,GY+26])}
  F.L.push({d:9,bis:F=>gpDa(F,'arzt')});
  // Arzt geht zur Tür und verschwindet im Gebäude, dann ist er in der offenen Tür zu sehen
  F.L.push({d:4,a:F=>gpZiel(F,'arzt',[F.xs-10,GY+16],26),bis:F=>gpDa(F,'arzt')});
  gpPause(F,.4,(p,F)=>{F.P.arzt.op=1-p});
  gpPause(F,3.2,(p,F)=>{const T=F.tuer;if(T){T.arm=-52+12*Math.sin(F.T*5);T.wz=p<.55?'stetho':'lampe';T.x=T.x0+Math.sin(F.T*1.6)*1.2}},F=>gpTuerArzt(F,1));
  gpPause(F,.5,(p,F)=>{F.P.arzt.op=p},F=>{gpTuerArzt(F,0);gpZiel(F,'arzt',[F.xs+22,GY+30],26)});
  F.L.push({d:4,bis:F=>gpDa(F,'arzt')});
  gpPause(F,2,null,F=>gpBlase(F,1));
  gpPause(F,.1,null,F=>{gpBlase(F,0);gpWeg(F,'arzt',GY+40)});
  // Pferd wieder herausholen und auf die Koppel bringen
  gpGeh(F,1.2,[F.xs-24,GY+20],null,{a:F=>{F.vorn=1}});
  gpPause(F,.5,(p,F)=>{F.pop=p;if(p>.4&&F.hatStrick)F.strick='hand'},F=>gpHeraus(F));
  gpGeh(F,3,[F.xs+98,GY+40],[F.xs+70,.45,1]);
  gpPause(F,.4,(p,F)=>{if(p>.3)F.strick=''},F=>{herzen([F.horse])});
  gpGeh(F,1.6,[F.fx,F.fy],null,{a:F=>{F.vorn=0;F.fsZ=FIGX.s}});
  gpWarteWeg(F);return}
 gpHolen(F);gpZumAnbinder(F);
 // Ohne Gebäude erscheint der Arzt erst, wenn das Pferd angebunden ist
 gpPause(F,.1,null,F=>{gpPerson(F,'arzt',Math.min(gpRand(F),F.HX+38*F.hs+160),GY+40);gpZiel(F,'arzt',[F.HX+38*F.hs,F.gyT+9],44)});
 gpGeh(F,1,[F.AX+26,F.gyT+4]);
 F.L.push({d:9,bis:F=>gpDa(F,'arzt')});
 gpPause(F,1.6,(p,F)=>{F.P.arzt.wz='stetho';F.P.arzt.arm=-58+6*Math.sin(F.T*4)});
 F.L.push({d:3,a:F=>{F.P.arzt.wz='';F.P.arzt.arm=0;gpZiel(F,'arzt',[F.HX+104*F.hs,F.gyT+9],26)},bis:F=>gpDa(F,'arzt')});
 gpPause(F,1.6,(p,F)=>{F.pgr=.3*Math.sin(Math.PI*p);F.P.arzt.wz='lampe';F.P.arzt.arm=-95+8*Math.sin(F.T*5)});
 gpPause(F,2,(p,F)=>{F.P.arzt.wz='';F.P.arzt.arm=0;F.pgr=0},F=>gpBlase(F,1));
 gpPause(F,.1,null,F=>{gpBlase(F,0);gpWeg(F,'arzt',GY+40)});
 gpLoslassen(F,'trot');gpWarteWeg(F)}
// Rechter Bildrand (dort kommen Arzt und Schmied herein)
const gpRand=F=>Math.min(HF.WW+20,Math.max(F.camX,HF.W/2)+HF.W/2+18);
function gpPerson(F,art,x,y){F.ev.insertAdjacentHTML('beforeend',`<g class="person ${art}">${personBild(art)}</g>`);const el=F.ev.lastElementChild;
 const p={el,x,y,z:[x,y],v:30,arm:0,wz:'',op:0,ein:1,pa:el.querySelector('.parm'),wzEl:el.querySelector('.parm .wz')};F.P[art]=p;
 if(art=='schmied'){F.ev.insertAdjacentHTML('beforeend',AMBOSS);p.ab=F.ev.lastElementChild;F.ev.insertBefore(p.ab,el);p.abx=18;p.abSoll=18}
 return p}
// Ziel setzen; ist der Weg weit (breiter Bildschirm), gehen sie schneller, damit sie in etwa 5 Sekunden ankommen
const gpZiel=(F,art,z,v)=>{const p=F.P[art];if(!p)return;p.z=z;p.v=Math.max(v||p.v,Math.hypot(z[0]-p.x,z[1]-p.y)/5)};
// Gehen: höchstens 170 nach rechts, dabei ausblenden; gpWarteWeg wartet am Ende der Szene, bis alle weg sind
function gpWeg(F,art,y){const p=F.P[art];if(!p)return;gpZiel(F,art,[Math.min(gpRand(F)+30,p.x+170),y],34);p.weg=1}
const gpWarteWeg=F=>F.L.push({d:6,bis:F=>Object.values(F.P).every(p=>!p.weg||p.op<=.02)});
const gpDa=(F,art)=>{const p=F.P[art];return!p||Math.hypot(p.x-p.z[0],p.y-p.z[1])<.8};
// Der Tierarzt in der offenen Tür (klein, hinter dem Kopf des Pferds, mit dem Bild der Tür abgeschnitten)
function gpTuerArzt(F,an){if(F.tuer){F.tuer.el.remove();F.tuer=null}if(!an||!F.indoor)return;const D=DRIN[F.u],o=D.o,B=GY+12,sc=.2;
 const el=document.createElementNS(SVGNS,'g');el.innerHTML=personBild('arzt');F.indoor.insertBefore(el,F.indoor.firstChild);
 const x0=F.xs+o[0]+o[2]*.74,y=B+o[1]+o[3]*.58+110*sc;F.tuer={el,x:x0,x0,y,sc,arm:0,wz:'',pa:el.querySelector('.parm'),wzEl:el.querySelector('.parm .wz')}}
function gpBlase(F,an){if(F.blase){F.blase.remove();F.blase=null}if(!an)return;F.ev.insertAdjacentHTML('beforeend',BLASE);F.blase=F.ev.lastElementChild}
// Pferd in den Unterstand bzw. Stall: nur noch der Kopf in der linken Tür (wie in hof.js), die Szene setzt es selbst (F.eigen)
function gpHinein(F){const h=F.horse;let w=HF.hw.querySelector('#hdrin');
 if(!w){w=document.createElementNS(SVGNS,'g');w.id='hdrin';w.setAttribute('clip-path','url(#drinClip)');HF.hw.insertBefore(w,HF.hap)}
 w.appendChild(h.g_);h.drin=F.u;F.eigen=1;F.pop=1;F.indoor=w;F.strick=''}
function gpHeraus(F){const h=F.horse;h.drin=0;F.eigen=0;if(F.tuer)gpTuerArzt(F,0);HF.hw.insertBefore(h.g_,HF.vorne);if(F.indoor&&!F.indoor.children.length)F.indoor.remove();F.indoor=null;
 F.hx=F.xs;F.hdd=0;F.hdir=1;F.pop=0;HF.ord=[]}
// Staub beim Bürsten (irgendwo auf dem Fell)
function gpStaub(F){if(F.dreck<=0)return;const s=gpS(F.horse,F.hdd),gy=gpY(F.hdd);gpPartikel(F,'staub',F.hx+F.hdir*(Math.random()*110-60)*s,gy-(100+Math.random()*50)*s)}
// Teilchen: Staub, Erdkrümel, Hornspäne, Dampf, Glitzer, altes Eisen
const PART={staub:{c:'#b9966a',r:1.5,vy:-7,g:0,life:.8,grow:1.6,op:.6},krume:{c:'#6b4b2e',r:.8,vy:-14,g:90,life:.6,op:.9},span:{c:'#eadbb5',r:.75,vy:-12,g:80,life:.6,op:.9},
 dampf:{c:'#ffffff',r:1.6,vy:-14,g:0,life:1,grow:2.4,op:.75},funkel:{life:.7,op:1},eisen:{life:.9,g:140,vy:-10,op:1}};
function gpPartikel(F,typ,x,y){const T=PART[typ];if(!T||F.tl.length>60)return;
 F.ev.insertAdjacentHTML('beforeend',typ=='funkel'?'<path d="M0 -3L.8 -.8L3 0L.8 .8L0 3L-.8 .8L-3 0L-.8 -.8Z" fill="#fff6b0" stroke="#e8b400" stroke-width=".3"/>':
  typ=='eisen'?'<path d="M-2 -2.2V0a2 2 0 0 0 4 0V-2.2" fill="none" stroke="#7b8087" stroke-width="1.1" stroke-linecap="round"/>':`<circle r="${T.r}" fill="${T.c}"/>`);
 F.tl.push({el:F.ev.lastElementChild,typ,x,y,vx:(Math.random()-.5)*(typ=='eisen'?10:14),vy:(T.vy||0)*(.7+Math.random()*.6),t:0,life:T.life,g:T.g||0,grow:T.grow||1,op:T.op})}
// Ein Bild der Szene: Pferd, Figur, Strick, Kiste, Personen, Teilchen
function gpZeichnen(F,h,dt){
 if(F.hfrei&&dt>0){const kr=(HF.kr||[[0,HF.WW]])[0];F.hx+=F.hdir*(SPEED[F.hfrei]||40)*dt;if(F.hx>kr[1]-40)F.hdir=-1;if(F.hx<kr[0]+40)F.hdir=1;F.pl=1;F.pg=F.hfrei}
 if(F.eigen){// Pferd steht drinnen: nur der Kopf in der Tür
  const D=DRIN[F.u],sc=D.sc,B=GY+12,tx=F.xs+D.dx-118*sc,ty=B+D.dy+185*sc;h.rig.pose(dt,{g:'walk',am:0,ph:0,gr:0,hop:0});
  h.g_.setAttribute('transform',`translate(${r1(tx)} ${r1(ty)}) scale(${sc.toFixed(3)})`);h.x=F.xs+D.dx;h.gy=ty;h.sc=sc/PFS;h.d=0;h.g_.style.opacity=''}
 else{h.x=F.hx;h.d=F.hdd;h.dir=F.hdir;const lauf=F.pl;h.state=lauf?'walk':'stand';h.g=F.pg;h.am+=((lauf?1:0)-h.am)*Math.min(1,dt*6);if(lauf)h.ph=(h.ph+dt*G[h.g][1])%1;
  h.ha+=((F.pgr||0)*48-h.ha)*Math.min(1,dt*4);h.joy=0;h.huf=F.huf;h.g_.style.opacity=F.pop<1?Math.max(0,F.pop).toFixed(2):''}
 // Figur
 const fe=F.fe,[x,y]=F.fig,bob=F.geht?Math.abs(Math.sin(F.T*9))*1.2:0,ebene=F.vorn?F.ev:F.eh;
 if(fe.parentNode!==ebene)ebene.appendChild(fe);
 F.fs+=(F.fsZ-F.fs)*Math.min(1,dt*2.5);fe.setAttribute('transform',`translate(${r1(x)} ${r1(y-bob)}) scale(${F.fs.toFixed(3)})`);
 if(F.wa){if(F.arm)F.wa.setAttribute('transform',`rotate(${r1(F.arm)} 11.6 -75)`);else F.wa.removeAttribute('transform')}
 if(F.wzEl&&F._wz!==F.wz){F._wz=F.wz;F.wzEl.innerHTML=WZ[F.wz]||''}
 // Führstrick: von der Hand bzw. vom Ring am Anbinder zum Halfter
 let d='';if(F.strick&&!F.eigen){const s=gpS(h,F.hdd),gy=gpY(F.hdd),hx=F.hx+F.hdir*116*s,hy=gy-166*s+(F.pgr||0)*30*s,[ax,ay]=F.strick=='hand'?gpHand(x,y-bob,F.arm,F.fs):[F.AX,F.AY-9],
  mx=(ax+hx)/2,my=Math.max(ay,hy)+3+Math.hypot(hx-ax,hy-ay)*.12;d=`M${r1(ax)} ${r1(ay)}Q${r1(mx)} ${r1(my)} ${r1(hx)} ${r1(hy)}`}
 F.seil.setAttribute('d',d);
 F.kEl.setAttribute('opacity',F.kiste.toFixed(2));
 if(F.dreck!==F._dr){F._dr=F.dreck;F.dr.forEach(e=>e.style.opacity=F.dreck<1?Math.max(0,F.dreck).toFixed(2):'')}
 // Personen gehen zu ihrem Ziel; wer gehen soll (weg), verschwindet am Bildrand
 for(const k in F.P){const p=F.P[k],dx=p.z[0]-p.x,dy=p.z[1]-p.y,dd=Math.hypot(dx,dy),geht=dd>.8&&dt>0;if(geht){const st=Math.min(dd,p.v*dt);p.x+=dx/dd*st;p.y+=dy/dd*st}
  // Einblenden nur beim Auftauchen (danach steuern die Schritte die Sichtbarkeit, z. B. im Stall), Ausblenden beim Gehen
  if(p.weg)p.op=Math.min(p.op,Math.max(0,(dd-1)/40));else if(p.ein&&dt>0){p.op=Math.min(1,p.op+dt*2.5);if(p.op>=1)p.ein=0}
  const pb=geht?Math.abs(Math.sin(F.T*8))*1.3:0;p.el.setAttribute('transform',`translate(${r1(p.x)} ${r1(p.y-pb)}) scale(${GPFS})`);p.el.style.opacity=p.op<1?p.op.toFixed(2):'';
  if(p.pa){if(p.arm)p.pa.setAttribute('transform',`rotate(${r1(p.arm)} 12.8 -90)`);else p.pa.removeAttribute('transform')}
  if(p._wz!==p.wz){p._wz=p.wz;p.wzEl.innerHTML=WZ[p.wz]||''}
  if(p.ab){p.abx+=(p.abSoll-p.abx)*Math.min(1,dt*2.5);const ax=p.abFix?p.abFix[0]:p.x+p.abx,ay=p.abFix?p.abFix[1]:p.y;p.ab.setAttribute('transform',`translate(${r1(ax)} ${r1(ay)})${!p.abFix&&p.abx<0?' scale(-1 1)':''}`);p.ab.style.opacity=p.el.style.opacity}}
 const T=F.tuer;if(T){T.el.setAttribute('transform',`translate(${r1(T.x)} ${r1(T.y)}) scale(${T.sc})`);if(T.pa){if(T.arm)T.pa.setAttribute('transform',`rotate(${r1(T.arm)} 12.8 -90)`);else T.pa.removeAttribute('transform')}if(T._wz!==T.wz){T._wz=T.wz;T.wzEl.innerHTML=WZ[T.wz]||''}}
 if(F.blase&&F.P.arzt){const p=F.P.arzt;F.blase.setAttribute('transform',`translate(${r1(p.x)} ${r1(p.y-128*GPFS-2)})`)}
 // Teilchen
 F.tl=F.tl.filter(q=>{if(dt>0){q.t+=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}if(q.t>=q.life){q.el.remove();return false}const p=q.t/q.life;
  q.el.setAttribute('transform',q.typ=='funkel'?`translate(${r1(q.x)} ${r1(q.y)}) scale(${(.6+Math.sin(p*Math.PI)*1.1).toFixed(2)}) rotate(${r1(p*90)})`:
   `translate(${r1(q.x)} ${r1(q.y)}) scale(${(1+(q.grow-1)*p).toFixed(2)})${q.typ=='eisen'?` rotate(${r1(p*400)})`:''}`);
  q.el.setAttribute('opacity',(q.op*(q.typ=='eisen'?1-p**4:1-p*p)).toFixed(2));return true})}
// Wird aus fuehrSchritt (hof.js) jedes Bild aufgerufen
function gpSchritt(h,dt){const F=HF.fuehr;F.horse=h;if(dt>0){F.t+=dt;F.T+=dt}
 for(let n=0;n<30;n++){const s=F.L[F.i];if(!s)break;const fertig=s.bis?(s.bis(F)||F.t>=s.d):F.t>=s.d;if(!fertig)break;
  if(s.f)s.f(1,F);F.t=s.bis?0:F.t-s.d;F.i++;const nx=F.L[F.i];if(nx&&nx.a)nx.a(F)}
 const s=F.L[F.i];if(!s){gpEnde(F,h);return}
 if(s.f)s.f(Math.min(1,F.t/s.d),F);
 gpZeichnen(F,h,dt)}
function gpEnde(F,h){HF.fuehr=null;
 F.tl.forEach(q=>q.el.remove());if(F.tuer)gpTuerArzt(F,0);if(F.eigen)gpHeraus(F);
 if(F.temp)F.fe.remove();else{const vor=F.feNext&&F.feNext.parentNode===HF.hw?F.feNext:HF.hap;HF.hw.insertBefore(F.fe,vor);if(F.wa)F.wa.removeAttribute('transform');if(F.wzEl)F.wzEl.remove();fuehrFigur(F.fx,F.fy,0)}
 [F.eh,F.ev].forEach(e=>e&&e.remove());
 h.huf=null;h.g_.style.opacity='';h.x=F.hx;h.d=F.hdd;h.dir=F.hdir;h.ziel=null;
 if(F.hfrei){h.state=F.hfrei;h.g=F.hfrei;h.t=1.5+Math.random()*1.5}else{h.state='graze';h.t=3+Math.random()*3}
 // Nach dem ersten Schmied hängt das Glücks-Hufeisen über der Tür
 if(F.art=='schmied'&&!HF.hw.querySelector('.glueck')){const k=kid(),s=k&&k.h?gluecksSvg(hh(k)):'';if(s){HF.hap.insertAdjacentHTML('beforebegin',s);const gl=HF.hw.querySelector('.glueck');if(gl&&!RM)gl.classList.add('neu')}}
 const k=kid();GPNOTE=k&&k.h?gpFertigText(F.art,hh(k),F.st,k):'';GPOK=1;
 HF.keyNeu=F.key;hofKick(3);ui()}
