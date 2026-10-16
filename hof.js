// Pferdehof Mathe: animierte Weide als Hintergrund, persönlicher Hof und Rundflug.
// Greift auf Funktionen und Daten aus app.js erst zur Laufzeit zu (horse, kid, hh, neigh, S, v ...),
// deshalb darf diese Datei vor app.js geladen werden.

// PFS: Größe des gezeichneten Pferds (pferd.js) auf der Weide; Pferd steht mit den Hufen auf y = 0 seines Bildes
const PFS=.5;
const WH=200,GY=124,sr=n=>{let x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
// Gegenstände für den Hof: [id, Name, Preis in Äpfeln, Lage auf der Weide (Anteil der Weltbreite)]
const ITEMS=[['baum1','Apfelbaum',12,.33],['baum2','Eiche',15,.80],['blumen','Blumenwiese',10,.46],['heu','Heuballen',10,.58],['troge','Wassertrog',12,.40],['stall','Stall',30,.64],['teich','Teich',25,.24],['windrad','Windrad',20,.68],['regenbogen','Regenbogen',35,.50]];
const tree=(x,y,s,c,f)=>`<rect x="${x-3*s}" y="${y-26*s}" width="${6*s}" height="${26*s}" fill="#6b4a2b"/><circle cx="${x}" cy="${y-40*s}" r="${19*s}" fill="${c}"/><circle cx="${x-13*s}" cy="${y-31*s}" r="${13*s}" fill="${c}"/><circle cx="${x+13*s}" cy="${y-31*s}" r="${13*s}" fill="${c}"/>`+(f?[[-8,-44],[6,-36],[-14,-30],[12,-45],[0,-30]].map(([a,b])=>`<circle cx="${x+a*s}" cy="${y+b*s}" r="${2.4*s}" fill="${f}"/>`).join(''):'');
const DR={
 baum1:x=>tree(x,GY+6,1,'#4f9a47','#c0392b'),
 baum2:x=>tree(x,GY+4,1.35,'#3b7d3a'),
 blumen:x=>[...Array(18)].map((_,i)=>`<circle cx="${(x+sr(i+1)*140-70).toFixed(1)}" cy="${(GY+10+sr(i+40)*30).toFixed(1)}" r="1.9" fill="${['#f4d03f','#f2f6ff','#e78ac3','#f19a3e'][i%4]}"/>`).join(''),
 heu:x=>[0,1,2].map(i=>`<rect x="${x+i*18-9}" y="${GY+4}" width="16" height="12" rx="5" fill="#e2b24a"/><path d="M${x+i*18-6} ${GY+8}h10M${x+i*18-6} ${GY+12}h10" stroke="#b98a2c" stroke-width="1"/>`).join(''),
 troge:x=>`<rect x="${x-16}" y="${GY+8}" width="32" height="10" rx="2" fill="#7a5a36"/><rect x="${x-14}" y="${GY+9.5}" width="28" height="3.5" rx="1.5" fill="#6fb6e8"/>`,
 stall:x=>`<rect x="${x-34}" y="${GY-34}" width="68" height="44" fill="#b0412f"/><path d="M${x-40} ${GY-34}L${x} ${GY-62}L${x+40} ${GY-34}Z" fill="#6e2b20"/><rect x="${x-9}" y="${GY-14}" width="18" height="24" fill="#f4e9d0"/><path d="M${x-9} ${GY-14}l18 24M${x+9} ${GY-14}l-18 24" stroke="#b0412f" stroke-width="2"/><circle cx="${x}" cy="${GY-44}" r="4" fill="#f4e9d0"/>`,
 teich:x=>`<ellipse cx="${x}" cy="${GY+24}" rx="36" ry="10" fill="#4a90c2"/><ellipse cx="${x-8}" cy="${GY+22}" rx="14" ry="3" fill="#8cc4e8" opacity=".7"/>`,
 windrad:x=>`<rect x="${x-2}" y="${GY-46}" width="4" height="52" fill="#9aa4ab"/><g transform="translate(${x} ${GY-46})"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite"/>${[0,1,2,3].map(i=>`<path d="M0 0L-4 -18L4 -18Z" fill="#e8ecef" transform="rotate(${i*90})"/>`).join('')}</g></g>`
};
const hill=(ww,y0,amp,wl,ph,col)=>{let d=`M0 ${WH}`;for(let x=0;x<=ww+16;x+=16)d+=`L${x} ${(y0+amp*Math.sin(x/wl+ph)+amp*.5*Math.sin(x/(wl*.43)+ph*2)).toFixed(1)}`;return `<path d="${d}L${ww+16} ${WH}Z" fill="${col}"/>`};
// Farben nach Tageszeit (echte Uhrzeit)
function pal(h){
 if(h>=21||h<5)return{n:'nacht',t:'#0b1a3a',b:'#2a3f6b',far:'#1d3350',mid:'#244a45',g1:'#3d6b46',g2:'#335c3e',tint:'#0a1230',ta:.3};
 if(h<8)return{n:'morgen',t:'#7f8fc6',b:'#f5c08a',far:'#97a9bf',mid:'#7fae86',g1:'#93bf7e',g2:'#82b06f',tint:'#ffb070',ta:.08,sy:76};
 if(h<18)return{n:'tag',t:'#7ec0ea',b:'#e3f2f8',far:'#a9cbd8',mid:'#8cc48f',g1:'#9ccc86',g2:'#86bb72',tint:'#000',ta:0,sy:30};
 return{n:'abend',t:'#51609a',b:'#f2a36b',far:'#7d88aa',mid:'#6f9a7f',g1:'#80ad6c',g2:'#6f9c5e',tint:'#ff8f50',ta:.1,sy:74}}
// Gangarten: [Ausschlag der Beine in Grad, Schritte pro Sekunde]; Phasen der Beine: hinten fern, vorne fern, hinten nah, vorne nah
const G={walk:[16,1.1],trot:[24,2.1],gallop:[36,3.2]},OFF={walk:[.5,.75,0,.25],trot:[.5,0,0,.5],gallop:[.1,.6,0,.5]},SPEED={walk:16,trot:42,gallop:105};
const HF={mode:'bg',horses:[],ord:[],key:'',t:0,last:0,raf:0,run:false,cam:0,cv:24,idle:0,fill:null,tag:null,W:288,WW:720,drag:null,clouds:[],pal:null};

function fillers(){if(!HF.fill){const ks=Object.keys(COATS),bs=Object.keys(BR);HF.fill=[...Array(5)].map((_,i)=>{const c=ks[(i*2+R(0,5))%ks.length],b=bs[R(0,bs.length-1)];return{id:'f'+i,c,st:i==3?1:3,m:{br:b,bl:R(0,1),so:R(0,1)},name:BR[b].n+' · '+COATS[c][0],own:0}})}return HF.fill}
function hofSpecs(kind){
 const A=[],km=k=>{const H=hh(k);return{id:'k'+k.id,c:H.coat,st:gst(k.xp),m:pfSpec(H,gst(k.xp)),name:H.name,own:k.id}};
 if(kind=='kid'){const k=kid(),H=hh(k);A.push(km(k));H.brs.filter(b=>b!='std').slice(0,4).forEach((b,i)=>{const c=H.coats[(i+1)%H.coats.length];A.push({id:'c'+k.id+b,c,st:3,m:{br:b,bl:0,so:i%2},name:BR[b].n+' · '+COATS[c][0],own:0})})}
 else{S.kids.filter(k=>k.h).slice(0,5).forEach(k=>A.push(km(k)));const f=fillers();for(let i=0;A.length<5;i++)A.push(f[i])}
 return A}

function hofBuild(kind){
 const svg=$('#hof'),px=svg.clientWidth||360,ph=svg.clientHeight||240,W=Math.max(200,Math.round(WH*px/ph)),WW=Math.max(720,W+240);
 HF.W=W;HF.WW=WW;HF.cam=Math.min(Math.max(HF.cam||(WW-W)/2,0),WW-W);
 svg.setAttribute('viewBox',`0 0 ${W} ${WH}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 const now=new Date(),P=pal(now.getHours()+now.getMinutes()/60),items=kind=='kid'?Object.keys(hh(kid()).it):ITEMS.map(i=>i[0]);
 HF.pal=P;
 const old=Object.fromEntries(HF.horses.map(h=>[h.id,h]));
 HF.horses=hofSpecs(kind).map(s=>{const o=old[s.id];return Object.assign({ph:0,am:0,g:'walk',ha:0,joy:0,state:'stand',t:R(1,3),dir:R(0,1)?1:-1,d:Math.random(),dd:.5,sw:Math.random()*6,x:HF.cam+30+Math.random()*(W-60)},s,o?{x:o.x,d:o.d,dir:o.dir,state:o.state,t:o.t,ph:o.ph,am:o.am,g:o.g,ha:o.ha,dd:o.dd}:{})});
 let s=`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.t}"/><stop offset="1" stop-color="${P.b}"/></linearGradient></defs><rect width="${W}" height="${WH}" fill="url(#sk)"/>`;
 if(P.n=='nacht'){s+=[...Array(18)].map((_,i)=>`<circle cx="${(sr(i+3)*W).toFixed(1)}" cy="${(sr(i+90)*80).toFixed(1)}" r="${(.5+sr(i)*.8).toFixed(1)}" fill="#fff" opacity=".8"/>`).join('')+`<circle cx="${W*.22}" cy="34" r="9" fill="#f4f1de"/><circle cx="${W*.22+3}" cy="32" r="8" fill="${P.t}" opacity=".18"/>`}
 else s+=`<circle cx="${W*.8}" cy="${P.sy}" r="19" fill="#ffe08a" opacity=".28"/><circle cx="${W*.8}" cy="${P.sy}" r="11" fill="#ffe08a"/>`;
 s+=`<g id="hc">${[0,1,2,3].map(i=>`<g class="cl" data-x="${(sr(i+11)*(W+160)).toFixed(0)}" data-y="${(14+sr(i+21)*40).toFixed(0)}" data-v="${(2+sr(i+31)*4).toFixed(1)}"><ellipse cx="0" cy="0" rx="17" ry="6" fill="#fff" opacity=".85"/><ellipse cx="-9" cy="2" rx="10" ry="5" fill="#fff" opacity=".85"/><ellipse cx="10" cy="2" rx="11" ry="5" fill="#fff" opacity=".85"/></g>`).join('')}</g>`;
 s+=`<g id="hl0">${hill(WW,98,9,60,1,P.far)}</g>`;
 const cam0=(WW-W)/2;
 s+=`<g id="hl1">${hill(WW,108,7,45,2,P.mid)}${[...Array(16)].map((_,i)=>`<circle cx="${(sr(i+7)*WW).toFixed(1)}" cy="${(106+sr(i+50)*4).toFixed(1)}" r="${(4+sr(i)*3).toFixed(1)}" fill="#3f7a4a" opacity=".5"/>`).join('')}`+
  (items.includes('regenbogen')?['#e74c3c','#f39c12','#f4d03f','#58b368','#4a90c2','#7d5ba6'].map((c,i)=>`<path d="M${W/2+.5*cam0-80+i*4} 112A${80-i*4} ${80-i*4} 0 0 1 ${W/2+.5*cam0+80-i*4} 112" fill="none" stroke="${c}" stroke-width="4" opacity=".5"/>`).join(''):'')+`</g>`;
 s+=`<g id="hw"><rect x="0" y="${GY-8}" width="${WW}" height="${WH-GY+8}" fill="${P.g2}"/><rect x="0" y="${GY-8}" width="${WW}" height="34" fill="${P.g1}"/>`+
  `<path d="M0 ${GY-6}H${WW}M0 ${GY}H${WW}" stroke="#c9ad7c" stroke-width="2"/>`+[...Array(Math.ceil(WW/28)+1)].map((_,i)=>`<rect x="${i*28}" y="${GY-12}" width="3" height="18" fill="#b8996a"/>`).join('')+
  [[.12,.06],[.52,.13],[.9,.05]].map(([a,b])=>`<ellipse cx="${a*WW}" cy="${GY+2}" rx="${10+b*60}" ry="${5+b*30}" fill="#4f8a4a" opacity=".85"/>`).join('')+
  ITEMS.filter(i=>items.includes(i[0])&&DR[i[0]]).map(i=>DR[i[0]](Math.round(i[3]*WW))).join('')+
  HF.horses.map((h,i)=>`<g class="hs" id="hs${i}" data-i="${i}">${PF.bild('h'+i+'_',{...h.m,coat:h.c,st:h.st})}</g>`).join('')+`<g id="hfx"></g></g>`;
 s+=`<rect width="${W}" height="${WH}" fill="${P.tint}" opacity="${P.ta}" pointer-events="none"/><g id="htg" opacity="0" pointer-events="none"><rect id="htr" height="12" rx="6" fill="#fff" opacity=".92"/><text id="htt" y="8.6" font-size="7.5" text-anchor="middle" fill="#26331f"></text></g>`;
 svg.innerHTML=s;
 HF.hw=svg.querySelector('#hw');HF.hl0=svg.querySelector('#hl0');HF.hl1=svg.querySelector('#hl1');HF.hfx=svg.querySelector('#hfx');HF.htg=svg.querySelector('#htg');
 HF.clouds=[...svg.querySelectorAll('.cl')].map(e=>({el:e,x:+e.dataset.x,y:+e.dataset.y,v:+e.dataset.v}));
 HF.horses.forEach((h,i)=>{h.g_=svg.querySelector('#hs'+i);h.rig=new PF.Rig('h'+i+'_');h.hint=null});
 HF.ord=[];
 svg.style.background=HF.mode=='fly'?`linear-gradient(${P.t} 50%,${P.g2} 50%)`:'';
}
function pickState(h,rg){const r=Math.random();h.state=r<.22?'stand':r<.5?'graze':r<.75?'walk':r<.88?'trot':'gallop';
 h.t=h.state=='gallop'?2+Math.random()*2.5:h.state=='trot'?3+Math.random()*3:3+Math.random()*5;
 if(h.x<rg[0]+50)h.dir=1;else if(h.x>rg[1]-50)h.dir=-1;else if(Math.random()<.5)h.dir*=-1;
 h.dd=Math.random()}
// Zeichnet ein Bild. dt > 0: Bewegung um dt Sekunden fortschreiben, dt = 0: nur Stand zeichnen.
function hofDraw(dt){
 if(!HF.hw)return;
 const W=HF.W,WW=HF.WW,cam=HF.cam;
 HF.hw.setAttribute('transform',`translate(${(-cam).toFixed(1)} 0)`);HF.hl0.setAttribute('transform',`translate(${(-cam*.25).toFixed(1)} 0)`);HF.hl1.setAttribute('transform',`translate(${(-cam*.5).toFixed(1)} 0)`);
 HF.clouds.forEach(c=>c.el.setAttribute('transform',`translate(${(((c.x+HF.t*c.v)%(W+160))-80).toFixed(1)} ${c.y})`));
 const rg=HF.mode=='fly'?[20,WW-20]:[cam-20,cam+W+20];
 HF.horses.forEach(h=>{
  if(dt>0){
   h.t-=dt;if(h.joy>0)h.joy-=dt;
   if(h.t<=0&&h.joy<=0)pickState(h,rg);
   const mv=SPEED[h.state]||0;
   if(h.x<rg[0]||h.x>rg[1]){h.dir=h.x<rg[0]?1:-1;if(!mv){h.state='walk';h.t=4}}
   else if(mv&&((h.dir>0&&h.x>rg[1]-12)||(h.dir<0&&h.x<rg[0]+12)))h.dir*=-1;
   const sp=h.joy>0?0:SPEED[h.state]||0;
   h.x+=h.dir*sp*dt;if(sp)h.d+=(h.dd-h.d)*Math.min(1,dt*.5);
   if(sp){h.g=h.state;h.am+=(1-h.am)*Math.min(1,dt*6);h.ph=(h.ph+dt*G[h.g][1])%1}else h.am+=(0-h.am)*Math.min(1,dt*6);
   h.ha+=((h.state=='graze'&&h.joy<=0?48:0)-h.ha)*Math.min(1,dt*3);
  }
  const sc=(.30+.20*h.d)*GS[h.st].s,gy=138+h.d*54,hop=h.joy>0?40*Math.sin(Math.PI*Math.min(1,1-h.joy/1.2)):0;
  // Beine, Hals, Kopf, Schweif und Mähne bewegt das gezeichnete Pferd selbst (pferd.js)
  h.rig.pose(dt,{g:h.g,am:h.am,ph:h.ph,gr:h.ha/48,hop});
  // Hintere (kleinere) Pferde ohne Umriss
  if((h.d<.5)!==h.hint){h.hint=h.d<.5;h.g_.classList.toggle('hinten',h.hint)}
  h.sc=sc;h.gy=gy;
  h.g_.setAttribute('transform',`translate(${h.x.toFixed(1)} ${gy.toFixed(1)}) scale(${(h.dir*sc*PFS).toFixed(3)} ${(sc*PFS).toFixed(3)})`)});
 const ord=[...HF.horses].sort((a,b)=>a.d-b.d);
 if(ord.some((h,i)=>HF.ord[i]!==h)){ord.forEach(h=>HF.hw.insertBefore(h.g_,HF.hfx));HF.ord=ord}
 if(HF.tag){const h=HF.tag.h,t=HF.tag.t-=dt;
  if(t<=0&&dt>0){HF.tag=null;HF.htg.setAttribute('opacity','0')}
  else{const txt=h.name||'Pferd',w=txt.length*4.3+14,x=Math.min(W-w/2-2,Math.max(w/2+2,h.x-cam)),y=Math.max(2,h.gy-250*PFS*h.sc-6);
   HF.htg.querySelector('#htt').textContent=txt;const r=HF.htg.querySelector('#htr');r.setAttribute('width',w);r.setAttribute('x',-w/2);HF.htg.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);HF.htg.setAttribute('opacity','1')}}
}
function hofFrame(ts){
 HF.raf=requestAnimationFrame(hofFrame);
 const dt=(ts-HF.last)/1000;if(dt<(HF.iv||.033))return;HF.last=ts;const d=Math.min(dt,.1);HF.t+=d;
 // Sparmodus für langsame Geräte: kommen die Bilder dauerhaft zu spät (unter etwa 24 pro Sekunde),
 // zuerst den Umriss der Pferde weglassen, danach nur noch die halbe Bildrate zeichnen
 HF.sl=dt>(HF.iv||.033)*1.25?(HF.sl||0)+1:Math.max(0,(HF.sl||0)-1);
 if(HF.sl>40){HF.sl=0;if(!HF.spar){HF.spar=1;document.getElementById('hof').classList.add('ohneUmriss')}else if(!HF.iv)HF.iv=.066}
 const span=HF.WW-HF.W;
 if(HF.mode=='fly'){if(HF.drag){}else if(HF.idle>0)HF.idle-=d;else{HF.cam+=HF.cv*d;if(HF.cam<=0){HF.cam=0;HF.cv=Math.abs(HF.cv)}if(HF.cam>=span){HF.cam=span;HF.cv=-Math.abs(HF.cv)}}}
 else HF.cam=span/2+Math.sin(HF.t/45)*Math.min(110,span/2);
 hofDraw(d)}
function hofStop(){if(HF.raf)cancelAnimationFrame(HF.raf);HF.raf=0}
function hofRun(){
 const still=S.calm||RM;HF.run=!still||(HF.mode=='fly'&&!RM);
 if(HF.run){if(!HF.raf){HF.last=performance.now();HF.raf=requestAnimationFrame(hofFrame)}}else{hofStop();hofDraw(0)}}
// Wird nach jeder Änderung der Ansicht aufgerufen (aus ui()).
function hofSync(force){
 const svg=$('#hof'),root=document.documentElement.style,fly=HF.mode=='fly',show=fly||['home','choose','kid','wish','done'].includes(v);
 document.body.classList.toggle('nohof',!show);
 if(!show){hofStop();svg.style.display='none';root.setProperty('--wh','0px');return}
 svg.style.display='block';root.setProperty('--wh',(fly?0:Math.max(210,Math.min(360,Math.round(innerHeight*.34))))+'px');
 const k=(v=='kid'||v=='wish'||v=='done')?kid():null,kind=k&&k.h?'kid':'home';
 const sig=kind=='kid'?(()=>{const H=hh(k);return[k.id,H.coat,gst(k.xp),H.bl,H.so,H.br,H.ma,H.brs.join(),H.coats.join(),Object.keys(H.it).join()].join()})():S.kids.map(x=>x.h?[x.id,x.h.coat,gst(x.xp),x.h.br,x.h.bl,x.h.so,x.h.ma].join():'').join(';');
 const key=[kind,sig,pal(new Date().getHours()).n,fly,S.calm|0,RM,svg.clientWidth,svg.clientHeight].join('|');
 if(force||key!=HF.key){HF.key=key;hofBuild(kind)}
 hofRun()}
function hofTap(h){
 h.joy=1.2;h.state='stand';h.t=1.5;if(S.snd!==0)neigh(h.st);
 HF.tag={h,t:2.6};
 const x=h.x+h.dir*60*PFS*h.sc,y=h.gy-215*PFS*h.sc;
 HF.hfx.innerHTML=[0,1,2].map(i=>`<g class="hrt" style="animation-delay:${i*.15}s"><path d="M0-3C-4-9-10-1 0 6C10-1 4-9 0-3Z" transform="translate(${(x+(i-1)*9).toFixed(1)} ${(y-i*5).toFixed(1)})" fill="#d1503f" stroke="none"/></g>`).join('');
 clearTimeout(HF.fxT);HF.fxT=setTimeout(()=>{if(HF.hfx)HF.hfx.innerHTML=''},1800);
 if(!HF.run)hofDraw(0)}
function hofPet(){const h=HF.horses.find(x=>x.own);if(h)hofTap(h)}
function flyOn(){HF.mode='fly';HF.cv=24;HF.idle=0;document.body.classList.add('fly');$('#fly').hidden=false;hofSync(true)}
function flyOff(){HF.mode='bg';document.body.classList.remove('fly');$('#fly').hidden=true;hofSync(true)}
// Eingaben: Tippen auf ein Pferd, im Rundflug zusätzlich Wischen zum Umschauen
(()=>{
 const svg=document.getElementById('hof');if(!svg)return;
 svg.addEventListener('pointerdown',e=>{
  const g=e.target.closest&&e.target.closest('.hs'),h=g?HF.horses[+g.dataset.i]:null;
  if(HF.mode=='fly'){HF.drag={x:e.clientX,cam:HF.cam,moved:0,h};try{svg.setPointerCapture(e.pointerId)}catch(_){}}
  else if(h)hofTap(h)});
 svg.addEventListener('pointermove',e=>{const d=HF.drag;if(!d)return;const r=svg.getBoundingClientRect(),k=Math.min(r.width/HF.W,r.height/WH),dx=e.clientX-d.x;d.moved=Math.max(d.moved,Math.abs(dx));
  HF.cam=Math.min(HF.WW-HF.W,Math.max(0,d.cam-dx/k));if(!HF.raf)hofDraw(0)});
 svg.addEventListener('pointerup',()=>{const d=HF.drag;if(!d)return;HF.drag=null;HF.idle=3;if(d.moved<6&&d.h)hofTap(d.h)});
 svg.addEventListener('pointercancel',()=>{HF.drag=null});
 let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>hofSync(true),200)});
 addEventListener('keydown',e=>{if(e.key=='Escape'&&HF.mode=='fly')flyOff()});
})();
