// Pferdehof Mathe: Training des Pferds (seit 2026-10-22, Konzept in der Notiz "Ideen Reiten und Pferdepflege")
// Wird vor app.js geladen. Alles, was app.js, hof.js, pferd.js, figur.js oder aufgaben.js bereitstellt, wird erst zur Laufzeit benutzt.
//
// Regeln:
// - Ein Training kostet TRPREIS Äpfel und besteht aus TRN Aufgaben mit je TRZEIT Sekunden. Ab TROK richtigen gibt es einen Stern.
// - Der Versuch zählt mit dem Start (Äpfel weg, für heute verbraucht), auch wenn er nicht klappt oder abgebrochen wird.
// - Je Pferd gespeichert: tr = Sterne je Art, tl = letzter Trainingstag je Art, tz = {d: Datum, n: Trainings an diesem Tag}.
//   Sterne bleiben, wie sie sind: Wer nicht trainiert, hat es seinem Pferd eben nicht beigebracht.
// - Hufeisen (k.hu, je Kind): 1 für jede Runde mit mindestens FREI von 10 und 1 für jedes Training mit Stern. Sie sind für die Pflege gedacht.
// Arten: n = Name je Stufe, max = höchste Sternzahl je Stufe (Fohlen, Jährling, Jungpferd, Pferd),
// alle = Abstand in Tagen je Stufe (Anreiten beim Jährling nur alle 2 Tage), tage = nur an diesen Wochentagen (0 = Sonntag),
// spiel = Minispiel ist schon gebaut (1 oder je Stufe, die anderen zeigen "Kommt bald"); Anreiten (Jährling) seit 2026-10-22, Reiten ab Jungpferd folgt
const TRPREIS=10,TRN=5,TROK=4,TRZEIT=15,TRXP=10;
const TRA=[
 ['lo',{n:()=>'Longieren',max:[0,5,5,5],spiel:1}],
 ['re',{n:st=>st==1?'Anreiten':'Reiten',max:[0,3,7,10],alle:[1,2,1,1],spiel:[0,1,0,0]}],
 ['sp',{n:()=>'Springen',max:[0,0,7,10]}],
 ['dr',{n:()=>'Dressur',max:[0,0,3,3]}],
 ['ge',{n:()=>'Geländereiten',max:[0,0,4,5],tage:[3,6]}]];
const TRART=Object.fromEntries(TRA);
// Höchstens so viele Trainings am Tag je Stufe (0 = keine Grenze; beim Jährling begrenzen schon die Regeln je Art)
const TRPROTAG=[0,0,3,2];
// Für Tests: TRWT = Wochentag (0-6) statt des echten
let TRWT=null;
const trWT=()=>TRWT!=null?TRWT:new Date().getDay();
const trTagNr=d=>Math.round(new Date(d+'T12:00:00')/864e5);
const trHeute=H=>H.tz&&H.tz.d==tag()?H.tz.n:0;
const HU='<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3v7a6 6 0 0 0 12 0V3" fill="none" stroke="#c9a227" stroke-width="3.6" stroke-linecap="round"/><circle cx="4" cy="7" r=".9" fill="#7a5c00"/><circle cx="16" cy="7" r=".9" fill="#7a5c00"/></svg>';
const trSterne=(s,mx)=>`<span class="trs" role="img" aria-label="${s} von ${mx} Sternen">${'★'.repeat(s)}<i>${'☆'.repeat(Math.max(0,mx-s))}</i></span>`;
// Darf dieses Training jetzt starten? {ok:1} oder {txt: Grund}
function trStatus(k,id){if(!k||!k.h)return{txt:`Ab ${GS[1].n}`};const H=hh(k),st=stg(k),A=TRART[id],mx=A.max[st],s=(H.tr||{})[id]||0,t=tag();
 if(!mx)return{txt:st==0?`Ab ${GS[1].n}`:`Ab ${GS[2].n}`};
 if(s>=mx)return{voll:1,txt:st<3&&A.max[st+1]>mx?`Alle Sterne geschafft. Mehr gibt es, wenn ${H.name} ein ${GS[st+1].n} ist.`:'Alle Sterne geschafft!'};
 if(!(Array.isArray(A.spiel)?A.spiel[st]:A.spiel))return{bald:1,txt:'Kommt bald'};
 const tl=(H.tl||{})[id],ab=(A.alle||[])[st]||1;
 if(tl==t)return{txt:ab>1?'Heute schon trainiert. Übermorgen wieder, damit das Pferd sich erholen kann.':'Heute schon trainiert, morgen wieder.'};
 if(tl&&ab>1&&trTagNr(t)-trTagNr(tl)<ab)return{txt:'Morgen wieder. Das Pferd braucht einen Tag Pause.'};
 if(A.tage&&!A.tage.includes(trWT()))return{txt:'Nur mittwochs und samstags.'};
 const cap=TRPROTAG[st];if(cap&&trHeute(H)>=cap)return{txt:`Für heute genug trainiert (${cap} von ${cap}). Morgen wieder.`};
 return{ok:1}}
// Bereich "Training" in der Kind-Ansicht (seit 2026-10-22, vorher im Wunschbaum). TRNOTE: Hinweis beim Start (z. B. zu wenige Äpfel)
let TRNOTE='';
function trHinweis(m){TRNOTE=m;ui();const n=$('#trnote');if(n)n.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})}
function trTeil(k){const H=hh(k),st=stg(k);
 if(st==0)return`<p class="small">Training gibt es, wenn ${esc(H.name)} ein ${GS[1].n} ist: zuerst Longieren und Anreiten, später Reiten, Springen, Dressur und Gelände. Noch ${tageBis(k,1)} Tage mit Mathe.</p>`;
 const cap=TRPROTAG[st];
 return`<p class="small">Ein Training kostet ${TRPREIS} Äpfel. Du löst ${TRN} Aufgaben mit je ${TRZEIT} Sekunden Zeit. Mit ${TROK} richtigen bekommt ${esc(H.name)} einen Stern und du ein Hufeisen.${cap?` Heute ${Math.min(trHeute(H),cap)} von ${cap} Trainings.`:''}</p><p class="no" id="trnote"${TRNOTE?'':' hidden'}>${TRNOTE}</p>`+
  TRA.filter(([,A])=>A.max[st]>0).map(([id,A])=>{const s=(H.tr||{})[id]||0,mx=A.max[st],S=trStatus(k,id);
   return`<div class="card trk" data-tr="${id}"><div class="row sp"><b>${A.n(st)}</b>${trSterne(Math.min(s,mx),mx)}</div>${S.ok?`<button class="go" onclick="trStart('${id}')">Trainieren · ${TRPREIS} ${AP}</button>`:`<p class="small" style="margin:4px 0 0">${esc(S.txt)}</p>`}</div>`}).join('')+
  (st==1?`<p class="small">Springen, Dressur und Geländereiten kommen, wenn ${esc(H.name)} ein ${GS[2].n} ist.</p>`:'')}
// Bewegung beim Richtig-Bild in der Aufgabenrunde: je nach gelernten Sternen
function trAnim(H){const c=[['sp','jump'],['lo','gal'],['re','wig'],['dr','wig'],['ge','gal']].filter(([i])=>((H&&H.tr)||{})[i]>0);
 if(!c.length)return{t:'hop',a:8};const [i,t]=P(c),ls=Math.min(5,H.tr[i]);return{t,a:t=='gal'?20+14*ls:8+9*ls}}
// ---------- Aufgaben fürs Training ----------
// Kopfrechnen in 15 Sekunden: Schulstoff ohne Zeichnung und ohne lange Texte, eine Stufe leichter als der Stand des Kindes.
// Bis zum 3. Stern kommen 2 von 5 Aufgaben aus der Klasse darunter, ab dem 4. Stern nur noch 1. Klasse 5 nimmt dafür ihre Stufen 1 und 2.
function trAufgabe(k,unten,seen){const g=k.g,gk=unten&&g>5?g-1:g,keys=KAT[gk].schul;let best=null;
 for(let n=0;n<60;n++){const key=P(keys),d0=(k.t[key]||{}).d,d=unten?(g>5?Math.max(1,(d0||3)-1):R(1,2)):Math.max(1,(d0||1)-1),q=THEMA[key][2](d);
  if(q[4]||!Number.isFinite(+q[1]))continue;if(!best)best={key,q};
  if(String(q[0]).length<=130&&!seen.includes(q[0])){seen.push(q[0]);return{key,q}}}
 return best||{key:keys[0],q:THEMA[keys[0]][2](1)}}
function trAufgaben(k,ziel){const unten=ziel<=3?2:1,seen=[];return[...Array(TRN)].map((_,i)=>trAufgabe(k,i<unten,seen)).sort(()=>Math.random()-.5)}
// ---------- Ablauf ----------
// TQ: laufendes Training. phase: 'lauf' (Pferd trabt eine Runde) oder 'frage' (Aufgabe mit Zeit). th = Winkel auf dem Zirkel,
// ph = Schrittphase, lauf = schon gelaufener Winkel dieser Runde, t0 = Start der Aufgabe, fb = Rückmeldung, ende = fertig
let TQ=null;
function trStart(id){const k=kid();if(!k||!k.h)return;const H=hh(k),S=trStatus(k,id);TRNOTE='';
 if(!S.ok)return trHinweis(esc(S.txt));if(ausZeit(k))return bye();if(k.hl)return;if((k.ap||0)<TRPREIS)return trHinweis('Dafür fehlen noch Äpfel.');
 const t=tag(),s=(H.tr||{})[id]||0;k.ap-=TRPREIS;H.tl=H.tl||{};H.tl[id]=t;H.tz={d:t,n:trHeute(H)+1};if(k.neu)delete k.neu;
 TQ={id,i:0,right:0,fb:null,ziel:s+1,auf:trAufgaben(k,s+1),phase:RM?'frage':'lauf',t0:Date.now(),th:Math.PI/2,ph:0,lauf:0,an:1,ende:0};
 save();v='train';ui();scrollTo(0,0)}
function trFrage(){if(!TQ||TQ.ende)return;TQ.phase='frage';TQ.lauf=0;TQ.t0=Date.now();ui()}
function trChk(zeitUm){if(!TQ||TQ.ende||TQ.fb||TQ.phase!='frage')return;const k=kid(),el=$('#ans'),raw=el?el.value.trim().replace(',','.').replace('−','-'):'';
 if(!zeitUm&&Date.now()-TQ.t0>TRZEIT*1000)zeitUm=true;
 if(!zeitUm&&(raw===''||isNaN(raw)))return el&&el.focus();
 const q=TQ.auf[TQ.i].q,ok=!zeitUm&&Math.abs(+raw-q[1])<1e-9;k.total++;
 if(ok){k.r++;TQ.right++;k.xp+=TRXP;BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k))k.b.push(b[0])})}
 TQ.fb={ok,zeit:!!zeitUm};TQ.fts=Date.now();save();ui()}
function trNx(){if(!TQ||!TQ.fb)return;if(TQ.i>=TRN-1)return trEnde();TQ.i++;TQ.fb=null;TQ.an=1;if(RM)return trFrage();TQ.phase='lauf';TQ.lauf=0;ui()}
function trEnde(){const k=kid(),H=hh(k),mx=TRART[TQ.id].max[stg(k)];TQ.ende=1;TQ.fb=null;
 if(TQ.right>=TROK){H.tr=H.tr||{};H.tr[TQ.id]=Math.min(mx,(H.tr[TQ.id]||0)+1);k.hu=(k.hu||0)+1;TQ.stern=1}
 save();ui()}
function trAbbruch(){if(TQ&&!TQ.ende&&!confirm('Training beenden? Der Versuch zählt trotzdem, die Äpfel sind schon bezahlt.'))return;trZurueck()}
function trZurueck(){TQ=null;if(ausZeit(kid()))return bye();v='kid';ui();trSektion()}
// In der Kind-Ansicht zum Bereich Training springen
function trSektion(){const e=$('#training');if(e)e.scrollIntoView();else scrollTo(0,0)}
// ---------- Seite ----------
function trSeite(){const k=kid(),H=hh(k),st=stg(k),A=TRART[TQ.id],it=TQ.auf[TQ.i],q=it&&it.q;
 let h=`<div class="row sp qkopf"><button class="alt" onclick="${TQ.ende?'trZurueck()':'trAbbruch()'}">${TQ.ende?'Zurück':'Beenden'}</button><span class="qthema">${A.n(st)}</span><span class="ap">${k.ap||0} ${AP}</span></div>`+trSzene(k);
 if(TQ.ende){const S=trStatus(k,TQ.id),s=(H.tr||{})[TQ.id]||0,mx=A.max[st];
  return h+`<div class="card trende" style="text-align:center"><h1 style="margin:4px 0">${TQ.stern?'Super gemacht!':'Fast geschafft!'}</h1><p><b>${TQ.right} von ${TRN}</b> richtig.</p>`+
   (TQ.stern?`<p class="ok pop"><b>${esc(H.name)} hat einen Stern beim ${A.n(st)} bekommen!</b></p><p>${trSterne(s,mx)}</p><p>+1 Hufeisen ${HU} · +${TQ.right*TRXP} Erfahrung</p>`:
    `<p class="no">Für einen Stern brauchst du ${TROK} von ${TRN}. Üb weiter, dann klappt es beim nächsten Mal!</p><p class="small">+${TQ.right*TRXP} Erfahrung</p>`)+
   (ausZeit(k)?`</div><div class="card" id="limit"><b>Für heute ist Schluss.</b><p>Deine ${limM(k)} Minuten auf dem Hof sind um. Morgen geht es weiter, ${esc(H.name)} wartet auf dich!</p></div><button class="go" onclick="trZurueck()">Tschüss, bis morgen</button>`:
   `<p class="small">${esc(S.ok?'Du kannst gleich noch einmal trainieren.':S.txt)}</p></div><button class="go" onclick="trZurueck()">Zurück zum Training</button>`)}
 if(TQ.phase=='lauf')return h+`<p class="trinfo"><b>Runde ${TQ.i+1} von ${TRN}</b> · ${TQ.id=='re'?`Du sitzt auf ${esc(H.name)}, ${trLehrerin()?'die Reitlehrerin führt im Schritt':'ihr geht im Schritt'} …`:`${esc(H.name)} trabt an der Longe …`}</p><p class="small">Nach jeder Runde kommt eine Aufgabe. Du hast dafür ${TRZEIT} Sekunden.</p>`;
 const[ft,fe]=frageTeile(q[0]),rest=Math.max(0,1-(Date.now()-TQ.t0)/1000/TRZEIT);
 h+=`<p class="small">Aufgabe ${TQ.i+1} von ${TRN} · ${TQ.right} richtig</p><div class="bar trzeit"><b id="trzeit" style="width:${TQ.fb?0:Math.round(rest*100)}%"></b></div><div class="q">${esc(ft)}</div>`;
 if(TQ.fb)return h+`<p class="${TQ.fb.ok?'ok':'no'}"><b>${TQ.fb.ok?`Richtig! +${TRXP} Erfahrung`:(TQ.fb.zeit?'Die Zeit ist um. ':'Leider falsch. ')+'Richtig ist '+mitEinheit(q[1],fe)+'.'}</b></p><button class="go" onclick="trNx()">${TQ.i==TRN-1?'Fertig':'Weiter'} (Enter)</button>`;
 return h+`<div class="antwort"><span class="antw"><input id="ans" autocomplete="off" inputmode="decimal" aria-label="Antwort${fe?' in '+esc(fe):''}" onkeydown="if(event.key=='Enter')trChk()">${fe?`<span class="einheit">${esc(fe)}</span>`:''}</span><button class="go pruefen" onclick="trChk()">Prüfen</button></div>`}
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&!e.repeat&&v=='train'&&TQ&&TQ.fb&&Date.now()-TQ.fts>250&&document.activeElement.tagName!='BUTTON'){e.preventDefault();trNx()}});
// ---------- Longierzirkel (2D, Bilderbuch-Look wie der Hof) ----------
// Ovaler Sandplatz von schräg oben. Das Pferd läuft auf einer Ellipse um die Figur: vorne groß nach rechts, hinten kleiner nach links,
// an den Seiten kurz schmal (es dreht sich). Longe = Linie von der Hand zum Kopf. Eine Peitsche gibt es nicht (seit 2026-10-22 entfernt).
const TRZ={cx:160,cy:142,rx:104,ry:38,fx:160,fy:150,fs:.44,ls:.47};
// Reitlehrerin (Erwachsene, etwas größer): führt das Pferd beim Anreiten in den Skill-Stufen 1 bis 3 (seit 2026-10-22)
const LEHRERIN={g:'m',hf:'mittel',ha:'schwarz',lg:'beige',sh:'gruen'};
const trLehrerin=()=>!!TQ&&TQ.id=='re'&&TQ.ziel<=3;
const trMitte=()=>!!TQ&&(TQ.id=='lo'||trLehrerin());
function trSzene(k){const H=hh(k),now=new Date(),P=pal(now.getHours()+now.getMinutes()/60),cx=TRZ.cx,cy=TRZ.cy;
 const pf=(a,b)=>[...Array(22)].map((_,i)=>i*Math.PI*2/22).filter(t=>a?Math.sin(t)>=0:Math.sin(t)<0).map(t=>{const x=cx+(TRZ.rx+24)*Math.cos(t),y=cy+(TRZ.ry+13)*Math.sin(t),s=.75+.25*(Math.sin(t)+1)/2;
  return`<rect x="${r1(x-1.4*s)}" y="${r1(y-12*s)}" width="${r1(2.8*s)}" height="${r1(12*s)}" rx=".6" fill="#9b7449"/>`}).join('');
 const ring=(f)=>`<path d="${[...Array(41)].map((_,i)=>{const t=f?i/40*Math.PI:Math.PI+i/40*Math.PI,x=cx+(TRZ.rx+24)*Math.cos(t),y=cy+(TRZ.ry+13)*Math.sin(t)-8;return(i?'L':'M')+r1(x)+' '+r1(y)}).join('')}" fill="none" stroke="#a9805a" stroke-width="1.8"/>`;
 return`<svg id="trsz" class="trsz" viewBox="0 0 320 196" role="img" aria-label="${esc(H.name)} ${TQ&&TQ.id=='re'?'mit dir im Sattel':'an der Longe'}"><defs><linearGradient id="trhim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.t}"/><stop offset=".55" stop-color="${P.m}"/><stop offset="1" stop-color="${P.b}"/></linearGradient>`+
  `<radialGradient id="trsand" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ecd9a8"/><stop offset="1" stop-color="#cfb27b"/></radialGradient></defs>`+
  `<rect width="320" height="196" fill="url(#trhim)"/>`+(P.n=='nacht'?`<circle cx="60" cy="30" r="8" fill="#f4f1de"/>`:`<circle cx="262" cy="${P.sy||30}" r="10" fill="${P.n=='tag'?'#fff3c4':P.glow}"/>`)+
  `<path d="M0 84Q50 66 110 80T230 74T320 80V196H0Z" fill="${P.far}"/><path d="M0 98Q80 84 160 96T320 92V196H0Z" fill="${P.mid}"/><rect y="100" width="320" height="96" fill="${P.g1}"/>`+
  [[30,104,9],[290,102,8],[110,100,6]].map(([x,y,r])=>busch(x,y,r,P.bu)).join('')+
  ring(0)+pf(0)+`<ellipse cx="${cx}" cy="${cy}" rx="${TRZ.rx+18}" ry="${TRZ.ry+10}" fill="url(#trsand)"/><ellipse cx="${cx}" cy="${cy}" rx="${TRZ.rx}" ry="${TRZ.ry}" fill="none" stroke="#b9975d" stroke-width="7" opacity=".35"/>`+
  `<g id="trhinten"></g>`+(TQ&&TQ.id=='re'?(trLehrerin()?`<g id="trfig" class="lehrerin" transform="translate(${TRZ.fx} ${TRZ.fy}) scale(${TRZ.ls})">${figurBild(LEHRERIN)}</g>`:''):`<g id="trfig" transform="translate(${TRZ.fx} ${TRZ.fy}) scale(${TRZ.fs})">${figurBild(k.f)}</g>`)+
  (trMitte()?`<path id="trlonge" fill="none" stroke="#f4f1de" stroke-width=".9"/>`:'')+
  `<g id="trvorn"><g id="trpf"><g id="trpfs">${PF.bild('tr_',pfSpec(H,stg(k)))}</g></g></g>`+ring(1)+pf(1)+
  `<rect width="320" height="196" fill="${P.tint}" opacity="${P.ta}" pointer-events="none"/></svg>`}
// Reiterin (Seitenansicht, nach rechts schauend) in den Farben der eigenen Figur. Sie wird in den Körper des gezeichneten Pferds
// (#tr_koerper) gesetzt und schaukelt deshalb mit. Sattelpunkt: Mulde der Körperform bei (-8, -154), Zügel zum Maul (#tr_kopfForm, 132/-157).
function reiterBild(f){f={...FIGUR0,...(f||{})};const hf=HAUT[f.hf]||HAUT.hell,ha=HAAR[f.ha]||HAAR.braun,lg=(LEG[f.lg]||LEG.schwarz)[1],sh=(SHIRT[f.sh]||SHIRT.blau)[1],um='stroke="#2b1d12" stroke-width="1" stroke-linejoin="round"';
 return`<path d="M-6 -1Q10 4 15 20L12 44L5 44L6 25Q2 12 -8 7Z" fill="${lg}" ${um}/><path d="M4 40L12 40L13 53Q20 54 22 58L4 58Z" fill="#1d1b1c" ${um}/>`+
  (f.g=='m'?`<path d="M-6 -57Q-17 -50 -15 -36Q-12 -42 -5 -49Z" fill="${ha[1]}" ${um}/>`:'')+
  `<path d="M-9 0Q-12 -22 -6 -41L7 -42Q11 -22 9 0Z" fill="${sh}" ${um}/><rect x="-2.5" y="-47" width="5" height="7" fill="${hf[1]}"/>`+
  `<path d="M2 -37Q6 -26 7 -20Q12 -17 18 -16" fill="none" stroke="#2b1d12" stroke-width="7.4" stroke-linecap="round"/><path d="M2 -37Q6 -26 7 -20Q12 -17 18 -16" fill="none" stroke="${sh}" stroke-width="5.6" stroke-linecap="round"/><circle cx="19" cy="-16" r="3" fill="${hf[1]}" ${um}/>`+
  `<circle cx="1" cy="-54" r="9" fill="${hf[1]}" ${um}/><path d="M-9.5 -55A10.5 10.5 0 0 1 11 -56L15.5 -54.5Q12.5 -51 9 -52.5L-9.5 -52.5Z" fill="#1f1f22" ${um}/>`+
  `<circle cx="6" cy="-53" r="1.2" fill="#222"/><path d="M5 -48.5Q7.5 -47 9.5 -49" fill="none" stroke="#a0524a" stroke-width=".9" stroke-linecap="round"/>`}
// Zügel: von der Hand (TRZH, im Körper-Raum) zum Maul, das Ende wird in jedem Bild neu berechnet (der Kopf nickt im Schritt)
let TRZH=null;
function trZuegel(){const ko=document.getElementById('tr_koerper'),kp=document.getElementById('tr_kopfForm'),z=document.getElementById('trzuegel'),svg=$('#trsz');if(!ko||!kp||!z||!svg||!TRZH)return;
 const c=ko.getCTM(),d=kp.getCTM();if(!c||!d)return;const p=svg.createSVGPoint();p.x=132;p.y=-157;const m=p.matrixTransform(c.inverse().multiply(d));
 z.setAttribute('d',`M${r1(TRZH.x)} ${r1(TRZH.y)}L${r1(m.x)} ${r1(m.y)}`)}
function trReiter(k){const ko=document.getElementById('tr_koerper'),kf=document.getElementById('tr_koerperForm'),kp=document.getElementById('tr_kopfForm'),svg=$('#trsz');TRZH=null;if(!ko||!kf||!svg)return;
 const c0=ko.getCTM();if(!c0)return;const inv=c0.inverse(),M=el=>inv.multiply(el.getCTM()),pt=(m,x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(m)};
 const mk=M(kf),s0=pt(mk,-8,-154),a=pt(mk,-80,-154),b=pt(mk,40,-154),sc=Math.abs(b.x-a.x)/120*TRRS,maul=kp?pt(M(kp),132,-157):{x:s0.x+110*sc,y:s0.y-6};
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.id='trreiter';
 TRZH={x:s0.x+18*sc,y:s0.y-16*sc};
 g.innerHTML=`<path id="trzuegel" d="M${r1(TRZH.x)} ${r1(TRZH.y)}L${r1(maul.x)} ${r1(maul.y)}" fill="none" stroke="#3b2414" stroke-width="${r1(1.6*sc)}"/><g transform="translate(${r1(s0.x)} ${r1(s0.y)}) scale(${sc.toFixed(3)})">${reiterBild(k.f)}</g>`;
 ko.appendChild(g)}
// TRRS: Größe der Reiterin im Verhältnis zum Pferd (1,6: ein Kind im Sattel, Kopf etwa auf Höhe der Ohren)
const TRRS=1.6;
let TRRAF=0,TRL=0,TRRIG=null;
function trSync(){if(v!='train'||!TQ||!$('#trsz')){if(TRRAF)cancelAnimationFrame(TRRAF);TRRAF=0;TRRIG=null;return}
 TRRIG=new PF.Rig('tr_');if(TQ.id=='re')trReiter(kid());trZeichne(0);if(RM)return;if(!TRRAF){TRL=performance.now();TRRAF=requestAnimationFrame(trFrame)}}
// trZeichne kann über trFrage/trChk die Seite neu aufbauen; trSync startet dann selbst einen neuen Takt (TRRAF), deshalb nur einen anfordern
function trFrame(ts){TRRAF=0;if(v!='train'||!TQ||!$('#trsz'))return;
 const dt=Math.min(.1,(ts-TRL)/1000);if(dt>=1/31){TRL=ts;trZeichne(dt)}
 if(!TRRAF&&v=='train'&&TQ&&$('#trsz'))TRRAF=requestAnimationFrame(trFrame)}
// Ein Bild: Pferd weiterbewegen, Longe nachführen, Zeitbalken der Aufgabe
function trZeichne(dt){if(!TQ)return;const pf=$('#trpf');if(!pf||!TRRIG)return;
 const lauf=TQ.phase=='lauf'&&!TQ.ende&&!RM,steht=RM||TQ.ende&&!TQ.stern;
 // Tempo: Trab in der Laufrunde (zu Beginn angetrieben, kurz schneller), sonst ruhiger Schritt; am Ende mit Stern noch ein Galopp
 // Anreiten: immer Schritt (Laufrunde etwas zügiger), mit Stern am Ende ein Trab
 const re=TQ.id=='re',an=lauf&&!re&&TQ.an>0?TQ.an:0,g=TQ.ende?(TQ.stern?(re?'trot':'gallop'):'walk'):lauf&&!re?'trot':'walk',
  om=steht?0:(g=='gallop'?2*Math.PI/3.2:g=='trot'&&re?2*Math.PI/5:lauf?(re?2*Math.PI/6.5:2*Math.PI/(4.6-an*1.2)):2*Math.PI/13);
 if(an>0)TQ.an=Math.max(0,TQ.an-dt/1.2);
 TQ.th-=om*dt;if(lauf){TQ.lauf+=om*dt;if(TQ.lauf>=Math.PI*2){trFrage();return}}
 TQ.ph=(TQ.ph+dt*(G[g]?G[g][1]:1.1)*(om?1:0))%1;
 const th=TQ.th,sn=Math.sin(th),d=(sn+1)/2,x=TRZ.cx+TRZ.rx*Math.cos(th),y=TRZ.cy+TRZ.ry*sn,sc=(.17+.11*d)*GS[stg(kid())].s,dir=sn>=0?1:-1,sx=dir*sc*(.32+.68*Math.abs(sn));
 TRRIG.pose(dt,{g,am:om?1:0,ph:TQ.ph,gr:0,hop:0});if(TQ.id=='re')trZuegel();
 $('#trpfs').setAttribute('transform',`translate(${r1(x)} ${r1(y)}) scale(${(sx).toFixed(3)} ${sc.toFixed(3)})`);
 // vorne (näher) vor der Figur, hinten dahinter
 // Die Longe wandert mit: hinten hinter die Figur (nach dem Pferd), vorne vor die Figur (unter das Pferd, der Kopf deckt das Ende)
 const ziel=$(sn>=0?'#trvorn':'#trhinten');if(pf.parentNode!==ziel){const lo=$('#trlonge');if(sn>=0){if(lo)ziel.insertBefore(lo,ziel.firstChild);ziel.appendChild(pf)}else{ziel.appendChild(pf);if(lo)ziel.appendChild(lo)}}
 // Hand der Figur bzw. der Reitlehrerin (ungefähr) und Kopf des Pferds
 const fsk=TQ.id=='re'?TRZ.ls/TRZ.fs:1,hx=TRZ.fx+(dir>0?1:-1)*6*fsk,hy=TRZ.fy-25*fsk,kx=x+sx*112,ky=y-sc*175;
 const lo=$('#trlonge');
 if(lo)lo.setAttribute('d',`M${r1(hx)} ${r1(hy)}Q${r1((hx+kx)/2)} ${r1((hy+ky)/2+6)} ${r1(kx)} ${r1(ky)}`);
 // Zeitbalken
 if(TQ.phase=='frage'&&!TQ.fb&&!TQ.ende){const rest=1-(Date.now()-TQ.t0)/1000/TRZEIT,b=$('#trzeit');if(b)b.style.width=Math.max(0,rest*100).toFixed(1)+'%';if(rest<=0)trChk(true)}}
// Bei "Bewegung reduzieren" gibt es keine Animation: Der Zeitbalken läuft trotzdem (eigener Takt)
setInterval(()=>{if(RM&&v=='train'&&TQ&&TQ.phase=='frage'&&!TQ.fb&&!TQ.ende){const rest=1-(Date.now()-TQ.t0)/1000/TRZEIT,b=$('#trzeit');if(b)b.style.width=Math.max(0,rest*100).toFixed(1)+'%';if(rest<=0)trChk(true)}},250);
