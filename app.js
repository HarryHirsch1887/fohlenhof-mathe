// Fohlenhof Mathe: Spiellogik, Oberfläche und Speicher (benötigt aufgaben.js)
const BD=[['a','Erster Schritt',k=>k.total>=1],['b','Serie von 5',k=>k.best>=5],['c','Serie von 10',k=>k.best>=10],['d','Fehlerfreie Runde',k=>k.perfect>0],['e','100 richtig',k=>k.r>=100],['f','Auf Stufe 5',k=>Object.values(k.t).some(x=>x.d==5)]];
// Fellfarben: [Name, Fell, Mähne]
const COATS={fuchs:['Fuchs','#b5612b','#6e3414'],braun:['Brauner','#7b4a2a','#1c1410'],rappe:['Rappe','#2b2b30','#111114'],schimmel:['Schimmel','#e8eaec','#b9bec4'],palomino:['Palomino','#dfb25f','#f7f0df'],schecke:['Schecke','#b5612b','#e6d3a6',1]};
// Wachstumsstufen: x = Erfahrung ab, s = Größe in der Szene, rx/ry = Körper, h = Kopfgröße, l = sichtbare Beinlänge
const GS=[{n:'Fohlen',x:0,s:.72,rx:33,ry:17,h:1.05,l:66,w:5.5,nk:.45},{n:'Jährling',x:250,s:.8,rx:42,ry:21,h:1.0,l:58,w:7.5,nk:.7},{n:'Jungpferd',x:700,s:.9,rx:50,ry:24,h:.97,l:51,w:9,nk:.88},{n:'Pferd',x:1500,s:1,rx:58,ry:28,h:.95,l:46,w:10,nk:1}];
const BR={std:{n:'Warmblut',rx:1,ry:1,l:1,nk:1,mw:1,tl:1,h:1,fe:0},hafl:{n:'Haflinger',mc:'#f0deb0',rx:1.04,ry:1.08,l:.9,nk:1.12,mw:1.5,tl:1.15,h:1,fe:0},isl:{n:'Isländer',rx:1,ry:1.08,l:.8,nk:1.15,mw:1.9,tl:1.35,h:1,fe:0},voll:{n:'Vollblut',rx:1.06,ry:.9,l:1.1,nk:.85,mw:.6,tl:.9,h:.93,fe:0},fries:{n:'Friese',rx:1.05,ry:1.05,l:1,nk:1.2,mw:1.9,tl:1.4,h:1,fe:1}};
const SK=[['jump','Springen'],['gal','Galopp'],['aus','Ausdauer'],['ges','Geschick']];
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
  if(o.kids.some(z=>z.id==c.id))c.id=Date.now()+o.kids.length;
  if(Array.isArray(k.b))c.b=k.b.filter(x=>BD.some(b=>b[0]==x));
  if(k.t&&typeof k.t==='object')for(const key of Object.keys(k.t)){const s=k.t[key];if(s&&typeof s==='object'&&/^[a-z0-9]{1,12}$/.test(key))c.t[key]={d:nn(s.d,1,5),n:nn(s.n),r:nn(s.r),run:Math.max(-9,Math.min(9,Math.trunc(+s.run)||0))}}
  if(Array.isArray(k.mist))for(const m of k.mist.slice(0,30)){if(m&&typeof m.key==='string'&&Array.isArray(m.q)&&typeof m.q[0]==='string'&&Number.isFinite(+m.q[1]))c.mist.push({key:ct(m.key,12),q:[ct(m.q[0],400),+m.q[1],ct(m.q[2],200),ct(m.q[3],800)]})}
  if(k.h&&typeof k.h==='object'){const h=k.h,co=COATS[h.coat]?h.coat:'fuchs',own=h.own&&typeof h.own==='object'?h.own:{};
   c.h={coat:co,coats:Array.isArray(h.coats)?[...new Set([co,...h.coats.filter(x=>COATS[x])])]:[co],name:ct(h.name,16)||'Fohlen',own:{},bl:h.bl?1:0,so:h.so?1:0,br:BR[h.br]?h.br:'std',brs:['std'],sk:{},it:{}};
   const it=h.it&&typeof h.it==='object'?h.it:{};for(const [id] of ITEMS)if(it[id])c.h.it[id]=1;
   if(own.bl||c.h.bl)c.h.own.bl=1;if(own.so||c.h.so)c.h.own.so=1;
   if(Array.isArray(h.brs))for(const x of h.brs)if(BR[x]&&!c.h.brs.includes(x))c.h.brs.push(x);
   if(!c.h.brs.includes(c.h.br))c.h.brs.push(c.h.br);
   const sk=h.sk&&typeof h.sk==='object'?h.sk:{};for(const [id] of SK)c.h.sk[id]=nn(sk[id],0,5)}
  o.kids.push(c)}
 return o}
// S.pin: PIN der Eltern-Ansicht. S.np = 1: beim Start bewusst ohne PIN gewählt (Bereich heißt dann "Einstellungen" und ist offen)
let S={pin:'',kids:[]},v='home',cur=null,Q=null,open=false,warn='',note='',pw='',CH='fuchs';
try{S=clean(JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLDKEY)||'null'))||S}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));warn=''}catch(e){warn='Speichern im Browser nicht möglich. Bitte Sicherung exportieren.'}};
const $=s=>document.querySelector(s),kid=()=>S.kids.find(k=>k.id==cur);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ts=(k,key)=>k.t[key]||(k.t[key]={d:1,n:0,r:0,run:0});
const hh=k=>{let H=k.h;H.brs=H.brs||['std'];H.br=H.br||'std';H.sk=H.sk||{};H.it=H.it||{};return H};
const gst=x=>GS.reduce((a,g,i)=>x>=g.x?i:a,0);
const dots=d=>`<span class="dots" title="Stufe ${d} von 5">${[1,2,3,4,5].map(i=>`<i class="${i<=d?'on':''}"></i>`).join('')}</span>`;
// Pferd als SVG, nach rechts blickend. c = Fellfarbe, st = Wachstumsstufe, m = {bl: Blesse, so: Socken}
function horse(c,st,m,idle){let g=GS[st],br=BR[m.br]||BR.std,cf=COATS[c][1],mf=br.mc&&(c=='fuchs'||c=='braun')?br.mc:COATS[c][2],cx=100,rx=g.rx*br.rx,ry=g.ry*br.ry,cy=138-g.l*br.l-ry,hx=cx+rx+12,hy=cy-ry-13,w=g.w,k=ry/24,d=7+4*k,
 hn=cx-rx*.58,fn=cx+rx*.6,T2=[hx+1,hy+12],B2=[cx+rx*.9,cy+ry*.45],nk=g.nk*br.nk,u=1-nk,B1f=[cx+rx*.4,cy-ry*.92],T1f=[hx-19,hy-11],B1=[B1f[0]+(B2[0]-B1f[0])*u*.5,B1f[1]+(B2[1]-B1f[1])*u*.5],T1=[T1f[0]+(T2[0]-T1f[0])*u*.55,T1f[1]+(T2[1]-T1f[1])*u*.55],tx=cx-rx*.95,ty=cy-ry*.6,tl=(.55+.45*g.nk)*br.tl,
 vx=T1[0]-B1[0],vy=T1[1]-B1[1],ln=Math.hypot(vx,vy),nx=vy/ln,ny=-vx/ln,C1=[(B1[0]+T1[0])/2+nx*7*nk,(B1[1]+T1[1])/2+ny*7*nk],
 wx=B2[0]-T2[0],wy=B2[1]-T2[1],wl=Math.hypot(wx,wy),C2=[(T2[0]+B2[0])/2+wy/wl*6*nk,(T2[1]+B2[1])/2-wx/wl*6*nk],
 bz=t=>[0,1].map(i=>(1-t)**2*B1[i]+2*(1-t)*t*C1[i]+t*t*T1[i]),mw=(5+5*k)*br.mw,
 sp=g.nk<.9,mane=(sp?[0,.12,.25,.37,.5,.62,.75,.87,1]:[0,.2,.4,.6,.8,1]).map((t,i)=>{let p=bz(t),o=mw*(1.15-.5*t)*(sp?(i%2?1.7:.8):1);return[p[0]+nx*o+(t*6),p[1]+ny*o]}),
 lp=(x,y,a,b)=>{let f=t=>(t-y)/(130-y);return`${x+w*.3*f(a)},${a} ${x+w*(1.3-.3*f(a))},${a} ${x+w*(1.3-.3*f(b))},${b} ${x+w*.3*f(b)},${b}`},
 lg=(x,y,far,i)=>`<g data-l="${i}" data-px="${x+w*.65}" data-py="${y}"><polygon points="${lp(x,y,y,130)}" fill="${cf}"/><ellipse cx="${x+w*.65}" cy="${y+(130-y)*.45}" rx="${w*.56}" ry="${w*.5}" fill="${cf}" stroke="none"/>`+(m.so?`<polygon points="${lp(x,y,112,130)}" fill="#fff"/>`:'')+(br.fe?`<polygon points="${x+w*.2},117 ${x+w*1.1},117 ${x+w*1.9},137 ${x-w*.6},137" fill="${mf}" stroke="none"/>`:'')+`<rect x="${x+w*.1}" y="130" width="${w*1.0}" height="8" rx="1.5" fill="#2a2420"/>`+(far?`<polygon points="${lp(x,y,y,130)}" fill="#000" opacity=".2"/>`:'')+'</g>',
 body=`M${cx+rx*.95} ${cy-ry*.1}C${cx+rx*.98} ${cy+ry*.75} ${cx+rx*.6} ${cy+ry*1.08} ${cx+rx*.1} ${cy+ry*1.0}C${cx-rx*.4} ${cy+ry*.88} ${cx-rx*.9} ${cy+ry*.8} ${cx-rx} ${cy+ry*.15}C${cx-rx*1.02} ${cy-ry*.55} ${cx-rx*.9} ${cy-ry*.95} ${cx-rx*.55} ${cy-ry*.9}C${cx-rx*.25} ${cy-ry*.8} ${cx+rx*.05} ${cy-ry*.82} ${cx+rx*.3} ${cy-ry*.98}C${cx+rx*.7} ${cy-ry*1.1} ${cx+rx*.95} ${cy-ry*.6} ${cx+rx*.95} ${cy-ry*.1}Z`;
 return`<g stroke="#0003" stroke-width=".8" stroke-linejoin="round">
<g data-t="1" data-px="${tx}" data-py="${ty}">${idle?`<animateTransform attributeName="transform" type="rotate" values="0 ${tx} ${ty};7 ${tx} ${ty};0 ${tx} ${ty};-5 ${tx} ${ty};0 ${tx} ${ty}" dur="3.4s" repeatCount="indefinite"/>`:''}<path d="M${tx} ${ty}C${tx-24*k} ${ty+6*k} ${tx-32*k} ${ty+34*k*tl} ${tx-16*k} ${ty+62*k*tl}C${tx-8*k} ${ty+42*k*tl} ${tx+2} ${ty+26*k*tl} ${tx+8} ${ty+14*k}Z" fill="${mf}"/></g>
${lg(hn+d,cy,1,0)}${lg(fn-d,cy,1,1)}${lg(hn,cy,0,2)}${lg(fn,cy,0,3)}
<path d="M${B1}Q${C1} ${T1}L${T2}Q${C2} ${B2}Z" fill="${cf}"/><path d="${body}" fill="${cf}"/>${COATS[c][3]?`<ellipse cx="${cx+rx*.05}" cy="${cy+ry*.28}" rx="${rx*.3}" ry="${ry*.62}" fill="#fff" stroke="none"/><ellipse cx="${cx-rx*.52}" cy="${cy-ry*.05}" rx="${rx*.2}" ry="${ry*.38}" fill="#fff" stroke="none"/>`:''}
<path d="M${mane.map(p=>p.join(' ')).join('L')}L${bz(1)}Q${C1} ${B1}Z" fill="${mf}"/>
<g data-h="1" data-px="${hx-12}" data-py="${hy+6}">${idle?`<animateTransform attributeName="transform" type="rotate" values="0 ${hx-12} ${hy+6};3 ${hx-12} ${hy+6};0 ${hx-12} ${hy+6};-1.5 ${hx-12} ${hy+6};0 ${hx-12} ${hy+6}" dur="4.6s" repeatCount="indefinite"/>`:''}<g transform="translate(${hx} ${hy}) scale(${g.h*br.h}) rotate(48)"><polygon points="-18,-6 -10,-9 -22,-20" fill="${cf}"/><polygon points="-18,-6 -10,-9 -22,-20" fill="#000" opacity=".2" stroke="none"/><path d="M-16-8C-8-11 6-8 14-6C19-5 23-3 23 1C23 6 19 8 14 8C8 8 4 9 0 12C-6 15-15 13-17 5C-18 0-18-4-16-8Z" fill="${cf}"/>${m.bl?'<ellipse cx="6" cy="-4" rx="12" ry="1.8" fill="#fff" stroke="none"/>':''}<ellipse cx="17.5" cy="2" rx="5.5" ry="6" fill="#000" opacity=".15" stroke="none"/><ellipse cx="19.5" cy="-1" rx="1.1" ry="1.7" fill="#1a1512" stroke="none"/><path d="M23 3Q19 4.5 15 4.5" fill="none" stroke="#1a1512" stroke-width=".9" opacity=".6"/><circle cx="-4" cy="-2" r="2.6" fill="#1a1512" stroke="none"/><circle cx="-3.2" cy="-3" r=".9" fill="#fff" stroke="none"/><polygon points="-15,-7 -8,-10 -17,-21" fill="${cf}"/><path d="M-16-8L-10-15L-6-9Z" fill="${mf}"/></g></g></g>`}
const RM=typeof matchMedia!='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=(k,an,idle)=>{let h=k.h,st=gst(k.xp),s=GS[st].s;return`<svg class="scene" viewBox="0 0 320 180" role="img" aria-label="${esc(h.name)} auf der Weide"><rect width="320" height="180" style="fill:var(--sky)"/><circle cx="268" cy="36" r="16" fill="#e2b24a"/><path d="M0 118Q80 88 170 116T320 106V180H0Z" style="fill:var(--h2)"/>${[0,1,2,3,4].map(i=>`<rect x="${24+i*68}" y="120" width="5" height="40" fill="#b9a27a"/>`).join('')}<rect y="130" width="320" height="4" fill="#b9a27a"/><rect y="144" width="320" height="4" fill="#b9a27a"/><rect y="158" width="320" height="22" style="fill:var(--h1)"/><g id="hg"${an?` class="an-${an.t}" style="--a:${an.a}px"`:''}><g transform="translate(${160-100*s} ${160-138*s}) scale(${s})">${horse(h.coat,st,h,idle&&!RM)}</g></g><g id="ht"></g></svg>`};
const pick=(c)=>`<button class="pick ${CH==c?'on':''}" onclick="CH='${c}';ui()" aria-pressed="${CH==c}"><svg viewBox="20 14 170 130">${horse(c,0,{})}</svg>${COATS[c][0]}</button>`;
function ui(){let h='';
 if(v=='home'&&!S.pin&&!S.np){h=`<h1>Fohlenhof Mathe</h1><div class="card"><b>Willkommen!</b><p>Soll es eine <b>Eltern-Ansicht mit PIN</b> geben? Dort stehen Statistik, Klassenwahl, Zurücksetzen und die Sicherung.</p><p><b>Mit Eltern-Ansicht:</b> PIN festlegen (mindestens 4 Zeichen).</p><input id="pin0" type="password" inputmode="numeric" maxlength="8" aria-label="PIN festlegen" onkeydown="if(event.key=='Enter')sp()"> <button onclick="sp()">PIN festlegen</button><p class="no">${warn}</p><p><b>Ohne Eltern-Ansicht:</b> passt zum Beispiel auf dem eigenen Handy eines Kindes. Die Einstellungen sind dann für alle offen.</p><button class="alt" onclick="nopin()">Ohne Eltern-Ansicht starten</button><p class="small">Das lässt sich später jederzeit ändern.</p></div>`}
 else if(v=='home'){h=`<h1>Fohlenhof Mathe</h1><p>Wer geht heute auf den Hof?</p>`+S.kids.map(k=>`<button class="big" onclick="sel(${k.id})"><span>${esc(k.name)} <span class="small">Klasse ${k.g}${k.h?' · '+esc(k.h.name):''}</span></span><span class="ap">${k.h?GS[gst(k.xp)].n+' · ':''}${k.ap||0} ${AP}</span></button>`).join('')+
 `<div class="card"><b>Neues Kind</b><div class="row"><input id="nm" placeholder="Name" maxlength="20" aria-label="Name"><select id="gr" aria-label="Klasse"><option value="5">Klasse 5</option><option value="6">Klasse 6</option><option value="7">Klasse 7</option><option value="8">Klasse 8</option></select><button onclick="add()">Hinzufügen</button></div></div><p class="row"><button class="alt" onclick="v='parent';ui()">${S.pin?'Eltern-Ansicht':'Einstellungen'}</button><button class="alt" onclick="flyOn()">Flug über die Koppel</button></p>`}
 if(v=='choose'){h=`<button class="alt" onclick="v='home';ui()">Zurück</button><h1>Dein Fohlen</h1><p>Welche Fellfarbe soll es haben? Später kannst du mit Äpfeln weitere Farben und Abzeichen freischalten.</p><div class="grid">${Object.keys(COATS).map(pick).join('')}</div><p><label>Name des Fohlens<br><input id="hn" maxlength="16" placeholder="z. B. Luna" onkeydown="if(event.key=='Enter')mk()"></label></p><button class="go" onclick="mk()">Los geht’s</button>`}
 if(v=='kid'){let k=kid(),st=gst(k.xp),g=GS[st],nx=GS[st+1],pr=nx?(k.xp-g.x)/(nx.x-g.x)*100:100;
 h=`<div class="row sp"><button class="alt" onclick="v='home';ui()">Zurück</button><button class="alt" onclick="snd()" aria-pressed="${S.snd!==0}">Ton: ${S.snd===0?'aus':'an'}</button></div><p class="small" style="margin:8px 0 0">Tippe oben auf dein Pferd, um es zu streicheln.</p><div class="row" style="margin:6px 0"><button class="alt" onclick="hofPet()">Pferd streicheln</button><button class="alt" onclick="flyOn()">Flug über den Hof</button></div><div class="row sp"><h1>${esc(k.h.name)} <span class="small">${g.n} von ${esc(k.name)}</span></h1><span class="ap">${k.ap||0} ${AP}</span></div>
 <div class="bar" style="margin:6px 0"><b style="width:${pr}%"></b></div><p class="small">${nx?`Noch ${nx.x-k.xp} Erfahrung bis „${nx.n}“`:'Dein Pferd ist ausgewachsen!'} · Serie ${k.s} · Rekord ${k.best}${mcount(k)?` · Fehlerheft: ${mcount(k)} zum Wiederholen`:''}</p>
 <h2>Thema wählen</h2>`+T[k.g].map(t=>{let s=ts(k,t[0]);return`<button class="big" onclick="start('${t[0]}')"><span>${t[1]}</span>${dots(s.d)}</button>`}).join('')+
 `<h2>Wunschbaum</h2><button class="big" onclick="v='wish';note='';ui()"><span>Farbe und Abzeichen für ${esc(k.h.name)}</span><span class="ap">${AP}</span></button><h2>Abzeichen</h2>`+BD.map(b=>`<span class="badge ${k.b.includes(b[0])?'':'off'}">${b[1]}</span>`).join('')}
 if(v=='wish'){let k=kid(),H=hh(k);
 h=`<button class="alt" onclick="v='kid';ui()">Zurück</button><div class="row sp"><h1>Wunschbaum</h1><span class="ap">${k.ap||0} ${AP}</span></div><p class="no">${note}</p>
 <h2>Fellfarbe</h2><div class="grid">${Object.keys(COATS).map(c=>`<button class="pick ${H.coat==c?'on':''}" onclick="wish('coat','${c}')"><svg viewBox="20 14 170 130">${horse(c,0,{})}</svg>${COATS[c][0]}<br>${H.coat==c?'gewählt':H.coats.includes(c)?'freigeschaltet':'25 '+AP}</button>`).join('')}</div>
 <h2>Abzeichen im Fell</h2><div class="row"><button class="${H.bl?'go':'alt'}" onclick="wish('bl')">Blesse ${H.own.bl?(H.bl?'an':'aus'):'· 15 '+AP}</button><button class="${H.so?'go':'alt'}" onclick="wish('so')">Weiße Socken ${H.own.so?(H.so?'an':'aus'):'· 15 '+AP}</button></div><h2>Rasse</h2><div class="grid">${Object.keys(BR).map(b=>`<button class="pick ${H.br==b?'on':''}" onclick="wish('br','${b}')"><svg viewBox="15 8 180 135">${horse(H.coat,2,{br:b,bl:H.bl,so:H.so})}</svg>${BR[b].n}<br>${H.br==b?'gewählt':H.brs.includes(b)?'freigeschaltet':'40 '+AP}</button>`).join('')}</div><h2>Hof ausbauen</h2><div class="grid">${ITEMS.map(([id,n,p])=>`<button class="pick ${H.it[id]?'on':''}" onclick="wish('it','${id}')">${n}<br>${H.it[id]?'gebaut':p+' '+AP}</button>`).join('')}</div><p class="small">Gebaute Gegenstände siehst du oben auf deinem Hof und im Rundflug. Für jede gekaufte Rasse kommt außerdem ein Pferdefreund dazu.</p><h2>Fähigkeiten</h2>${SK.map(([id,n])=>{let l=H.sk[id]||0;return`<div class="card row sp"><span>${n} ${dots(l)}</span>${l<5?`<button class="alt" onclick="wish('sk','${id}')">Training · ${10*(l+1)} ${AP}</button>`:'<span class="small">Meister</span>'}</div>`}).join('')}<p class="small">Fähigkeiten zeigen sich als Bewegung, wenn dein Pferd sich über eine richtige Antwort freut.</p><p class="small">Äpfel gibt es für richtige Antworten, bei schwereren Aufgaben mehr. Ausgeben kostet keine Erfahrung.</p>`}
 if(v=='quiz'){let k=kid(),s=ts(k,Q.key),t=T[k.g].find(x=>x[0]==Q.key),q=Q.q;
 h=`<div class="row sp"><button class="alt" onclick="v='kid';ui()">Beenden</button><span>${t[1]} ${dots(s.d)}</span></div><div class="bar" style="margin:12px 0"><b style="width:${Q.i*10}%"></b></div><p class="small">Aufgabe ${Q.i+1} von 10${Q.rp?' · <b>Nochmal versuchen:</b> Die kennst du schon aus dem Fehlerheft':''}</p><div class="q">${esc(de(q[0]))}</div>`+
 (Q.hint&&q[2]?`<p class="small">Tipp: ${esc(de(q[2]))}</p>`:'')+
 (Q.fb?`${Q.fb.ok?`<div style="max-width:300px">${scene(k,Q.fb.an)}</div>`:''}<p class="${Q.fb.ok?'ok':'no'}"><b>${Q.fb.ok?'Richtig! +'+Q.fb.g+' Erfahrung, +'+Q.fb.a+' Äpfel':'Leider falsch. Richtig ist '+de(q[1])+'.'}</b>${Q.fb.m?' '+Q.fb.m:''}</p>${!Q.fb.ok&&q[3]?`<div class="card" style="white-space:pre-line;font-size:16px"><b>So geht’s:</b>\n${esc(de(q[3]))}</div>`:''}<button class="go" onclick="nx()">${Q.i==9?'Fertig':'Weiter'} (Enter)</button>`:
 `<input id="ans" autocomplete="off" aria-label="Antwort" onkeydown="if(event.key=='Enter')chk()"><div class="row"><button class="go" onclick="chk()">Prüfen</button>${q[2]&&!Q.hint?'<button class="alt" onclick="tip()">Tipp (halbe Punkte)</button>':''}</div>`)}
 if(v=='done'){let k=kid();h=`<h1>Geschafft!</h1><div class="card">${scene(k)}<p><b>${Q.right} von 10</b> richtig, <b>+${Q.gain} Erfahrung</b> und <b class="ap">+${Q.ap} ${AP}</b>.</p>${Q.grow?`<p class="ok"><b>${esc(k.h.name)} ist jetzt ein ${Q.grow}!</b></p>`:''}${Q.mast?`<p class="ok"><b>${Q.mast} Aufgabe${Q.mast>1?'n':''} aus dem Fehlerheft gemeistert!</b></p>`:''}${Q.newb.map(b=>`<span class="badge">Neues Abzeichen: ${b}</span>`).join('')}</div><div class="row"><button class="go" onclick="start('${Q.key}')">Nochmal</button><button class="alt" onclick="v='kid';ui()">Zurück zum Hof</button></div>`}
 if(v=='parent'){h=`<button class="alt" onclick="v='home';lock()">Zurück</button><h1>${S.pin?'Eltern-Ansicht':'Einstellungen'}</h1>`;
 if(S.pin&&!open)h+=`<div class="card"><p>PIN eingeben:</p><input id="pin" type="password" inputmode="numeric" maxlength="8" aria-label="PIN" onkeydown="if(event.key=='Enter')unl()"> <button onclick="unl()">Öffnen</button><p class="no">${warn}</p></div>`;
 else{h+=S.kids.map(k=>`<div class="card"><div class="row sp"><b>${esc(k.name)}</b><span>Klasse <select onchange="gr(${k.id},this.value)" aria-label="Klasse">${[5,6,7,8].map(c=>`<option ${k.g==c?'selected':''}>${c}</option>`).join('')}</select></span></div>
 <p class="small">${k.h?esc(k.h.name)+' · '+GS[gst(k.xp)].n+' · ':''}${k.xp} Erfahrung · ${k.ap||0} Äpfel · ${k.r} von ${k.total} Aufgaben richtig (${k.total?Math.round(k.r/k.total*100):0} %) · Rekordserie ${k.best} · Fehlerheft ${mcount(k)} offen</p>
 <table><tr><th>Thema</th><th>Stufe</th><th>Aufgaben</th><th>Richtig</th></tr>${T[k.g].map(t=>{let s=ts(k,t[0]);return`<tr><td>${t[1]}</td><td>${s.d}</td><td>${s.n}</td><td>${s.n?Math.round(s.r/s.n*100)+' %':'–'}</td></tr>`}).join('')}</table>
 <p class="small">Ein Thema wechselt hoch nach 3 richtigen Antworten in Folge und runter nach 2 falschen.</p><div class="row"><button class="alt" onclick="rst(${k.id})">Fortschritt zurücksetzen</button><button class="alt" onclick="del(${k.id})">Kind löschen</button></div></div>`).join('')||'<p>Noch keine Kinder angelegt.</p>';
 h+=`<div class="card"><b>Anzeige</b><p class="small">Der animierte Hintergrund kann ruhig gestellt werden, zum Beispiel bei älteren Geräten oder um den Akku zu schonen. Dann stehen die Pferde still.</p><button class="alt" onclick="S.calm=S.calm?0:1;save();ui()">Ruhiger Hintergrund: ${S.calm?'an':'aus'}</button></div><div class="card"><b>Sicherung</b><p class="small">Der Stand liegt nur in diesem Browser. Exportiere ihn regelmäßig als Datei, besonders vor dem Löschen von Browserdaten oder bei einem Gerätewechsel.</p><div class="row"><button onclick="exp()">Exportieren</button><input type="file" accept=".json" onchange="imp(this)" aria-label="Sicherung importieren"></div><p class="no">${warn}</p></div>
 <div class="card"><b>PIN-Schutz</b>${S.pin?`<p class="small">Diese Ansicht ist mit einer PIN geschützt. Ohne PIN heißt sie „Einstellungen“ und ist für alle offen, zum Beispiel auf dem eigenen Handy eines Kindes.</p><button class="alt" onclick="npin()">PIN entfernen</button>`:`<p class="small">Ohne PIN kann jeder hier die Klasse ändern, Fortschritt zurücksetzen und Kinder löschen. Mit einer PIN (mindestens 4 Zeichen) wird daraus die geschützte Eltern-Ansicht.</p><input id="pin1" type="password" inputmode="numeric" maxlength="8" aria-label="PIN festlegen" onkeydown="if(event.key=='Enter')sp('pin1')"> <button onclick="sp('pin1')">PIN festlegen</button>`}<p class="no">${pw}</p></div>`+(S.pin?`<button class="alt" onclick="lock()">Sperren</button>`:'')}}
 $('#app').innerHTML='<div class="in">'+h+'</div>';hofSync();setTimeout(()=>{let a=$('#ans')||$('#pin')||$('#hn')||$('#pin0');a&&(v!='home'||a.id=='pin0')&&a.focus()})}
function add(){let n=$('#nm').value.trim();if(!n)return $('#nm').focus();S.kids.push({id:Math.max(Date.now(),...S.kids.map(k=>k.id+1)),name:n,g:+$('#gr').value,xp:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{}});save();ui()}
// PIN festlegen: ohne id beim ersten Start (Feld pin0), mit id='pin1' nachträglich in den Einstellungen
function sp(id){let el=$('#'+(id||'pin0')),p=el?el.value.trim():'',m='Die PIN braucht mindestens 4 Zeichen.';if(p.length<4){if(id){pw=m;ui();pw=''}else{warn=m;ui();warn=''}return}S.pin=p;delete S.np;if(id)open=true;save();ui()}
function nopin(){S.np=1;save();ui()}
function npin(){if(!confirm('PIN entfernen? Danach kann jeder diese Einstellungen öffnen.'))return;S.pin='';S.np=1;open=false;save();ui()}
function sel(id){cur=id;v=kid().h?'kid':'choose';ui()}
function mk(){let k=kid();k.h={coat:CH,coats:[CH],name:($('#hn').value.trim()||'Fohlen'),own:{},bl:0,so:0};save();v='kid';ui()}
function wish(t,c){let k=kid(),H=hh(k),no=()=>{note='Dafür fehlen noch Äpfel.';ui()};note='';
 if(t=='br'){if(!H.brs.includes(c)){if((k.ap||0)<40)return no();k.ap-=40;H.brs.push(c)}H.br=c}
 else if(t=='sk'){let l=H.sk[c]||0,p=10*(l+1);if(l>=5)return;if((k.ap||0)<p)return no();k.ap-=p;H.sk[c]=l+1}
 else if(t=='coat'){if(!H.coats.includes(c)){if((k.ap||0)<25)return no();k.ap-=25;H.coats.push(c)}H.coat=c}
 else if(t=='it'){if(H.it[c])return;const p=ITEMS.find(x=>x[0]==c)[2];if((k.ap||0)<p)return no();k.ap-=p;H.it[c]=1}
 else if(!H.own[t]){if((k.ap||0)<15)return no();k.ap-=15;H.own[t]=1;H[t]=1}else H[t]=H[t]?0:1;
 save();ui()}
// Fehlerheft: falsch beantwortete Aufgaben (max. 30 pro Kind). Pro Runde kommen bis zu 3 davon aus dem gewählten Thema erneut dran.
const ms=k=>k.mist||(k.mist=[]);
const mcount=k=>(k.mist||[]).filter(x=>T[k.g].some(t=>t[0]==x.key)).length;
function start(key){let k=kid(),rep=ms(k).filter(x=>x.key==key).map(x=>x.q).sort(()=>Math.random()-.5).slice(0,3),pool=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
 Q={key,i:0,right:0,hint:0,gain:0,ap:0,grow:'',newb:[],fb:null,seen:[],rep,slots:pool.slice(0,rep.length),rp:0,mast:0};Q.q=gen();v='quiz';ui()}
const gen=()=>{let k=kid(),t=T[k.g].find(x=>x[0]==Q.key),q,n=0;Q.rp=0;
 if(Q.rep.length&&Q.slots.includes(Q.i)){Q.rp=1;q=Q.rep.shift();Q.seen.push(q[0]);return q}
 do{q=t[2](ts(k,Q.key).d)}while((Q.seen.includes(q[0])||Q.rep.some(r=>r[0]==q[0]))&&++n<20);
 Q.seen.push(q[0]);return q};
// Tipp anzeigen, ohne die bereits getippte Antwort zu verlieren (ui() baut die Seite neu auf)
function tip(){let el=$('#ans'),val=el?el.value:'';Q.hint=1;ui();let n=$('#ans');if(n)n.value=val}
function chk(){let k=kid(),s=ts(k,Q.key),raw=$('#ans').value.trim().replace(',','.').replace('−','-');if(raw===''||isNaN(raw))return $('#ans').focus();
 let ok=Math.abs(+raw-Q.q[1])<1e-9,g=0,a=0,m='',s0=gst(k.xp);k.total++;s.n++;
 if(ok){s.r++;k.r++;k.s++;k.best=Math.max(k.best,k.s);Q.right++;g=Math.round((8+3*s.d)*(Q.hint?.5:1))+(k.s>=5?5:0);a=1+(s.d>=4?1:0);k.xp+=g;k.ap=(k.ap||0)+a;Q.gain+=g;Q.ap+=a;s.run=s.run>0?s.run+1:1;
  if(s.run>=3&&s.d<5){s.d++;s.run=0;m='Stufe '+s.d+' erreicht!'}
  if(gst(k.xp)>s0){Q.grow=GS[gst(k.xp)].n;m+=' '+k.h.name+' wird zum '+Q.grow+'!'}}
 else{k.s=0;s.run=s.run<0?s.run-1:-1;if(s.run<=-2&&s.d>1){s.d--;s.run=0;m='Wir üben eine Stufe leichter.'}}
 BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}});
 let L=ms(k),ix=L.findIndex(x=>x.key==Q.key&&x.q[0]==Q.q[0]);
 if(ok){if(ix>=0){L.splice(ix,1);Q.mast++}}else if(ix<0){L.push({key:Q.key,q:Q.q});if(L.length>30)L.shift()}
 let H=hh(k),ow=SK.filter(x=>H.sk[x[0]]>0),pk=ow.length?P(ow)[0]:'hop',ls=H.sk[pk]||0;Q.fb={ok,g,a,m,an:ok?{t:{jump:'jump',gal:'gal',aus:'aus',ges:'wig',hop:'hop'}[pk],a:pk=='gal'?20+14*ls:8+9*ls}:null};Q.ts=Date.now();save();ui()}
function nx(){Q.i++;if(Q.i>=10){let k=kid();if(Q.right==10){k.perfect++;BD.forEach(b=>{if(!k.b.includes(b[0])&&b[2](k)){k.b.push(b[0]);Q.newb.push(b[1])}});save()}v='done'}else{Q.q=gen();Q.fb=null;Q.hint=0}ui()}
// Sperren: muss eine Funktion sein. In onclick-Attributen würde "open=false" sonst document.open überschreiben statt diese Variable.
function lock(){open=false;ui()}
function unl(){let p=$('#pin').value;if(!p)return;if(p==S.pin)open=true;else{warn='Falsche PIN.';ui();warn='';return}ui()}
function gr(id,g){let k=S.kids.find(x=>x.id==id);k.g=+g;save();ui()}
function rst(id){if(!confirm('Fortschritt wirklich zurücksetzen? Das Pferd beginnt wieder als Fohlen.'))return;let k=S.kids.find(x=>x.id==id);Object.assign(k,{xp:0,ap:0,s:0,best:0,total:0,r:0,perfect:0,b:[],t:{},mist:[]});if(k.h){k.h.coats=[k.h.coat];k.h.own={};k.h.bl=0;k.h.so=0;k.h.br='std';k.h.brs=['std'];k.h.sk={};k.h.it={}}save();ui()}
function del(id){if(!confirm('Kind samt Fortschritt löschen?'))return;S.kids=S.kids.filter(x=>x.id!=id);save();ui()}
function exp(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='fohlenhof-sicherung.json';a.click()}
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
