// Pferdehof Mathe: animierte Weide als Hintergrund, persönlicher Hof und Rundflug.
// Greift auf Funktionen und Daten aus app.js erst zur Laufzeit zu (horse, kid, hh, neigh, S, v ...),
// deshalb darf diese Datei vor app.js geladen werden.

// PFS: Größe des gezeichneten Pferds (pferd.js) auf der Weide; Pferd steht mit den Hufen auf y = 0 seines Bildes
const PFS=.5;
const WH=200,GY=124,sr=n=>{let x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
// Gegenstände für den Hof: [id, Name, Preis in Äpfeln, Lage auf der Weide (Anteil der Weltbreite)]
const ITEMS=[['baum1','Apfelbaum',12,.33],['baum2','Eiche',15,.80],['blumen','Blumenwiese',10,.46],['heu','Heuballen',10,.555],['troge','Wassertrog',12,.40],['stall','Stall',30,.64],['teich','Teich',25,.24],['windrad','Windrad',20,.725],['regenbogen','Regenbogen',35,.50]];
// ---------- Zeichnungen im Bilderbuch-Stil (Weltkoordinaten: Höhe 200, Bodenlinie GY) ----------
const r1=n=>Math.round(n*10)/10;
const busch=(x,y,r,c)=>`<g fill="${c}"><circle cx="${r1(x)}" cy="${r1(y-r*.7)}" r="${r1(r)}"/><circle cx="${r1(x-r*.8)}" cy="${r1(y-r*.35)}" r="${r1(r*.72)}"/><circle cx="${r1(x+r*.85)}" cy="${r1(y-r*.4)}" r="${r1(r*.68)}"/></g>`;
// Grasbüschel aus fünf Halmen
function buschel(x,y,h,seed,c){let d='';for(let k=0;k<5;k++){const bx=x+(k-2)*1.1,ln=(k-2)*1.4+(sr(seed+k)-.5)*2,hh=h*(.65+sr(seed+k*2)*.5);d+=`M${r1(bx-.7)} ${r1(y)}Q${r1(bx+ln*.3)} ${r1(y-hh*.6)} ${r1(bx+ln)} ${r1(y-hh)}Q${r1(bx+ln*.3+.4)} ${r1(y-hh*.5)} ${r1(bx+.7)} ${r1(y)}Z`}return`<path d="${d}" fill="${c}"/>`}
function grasStreifen(ww,n,y0,y1,h0,h1,seed,farben,frei){let s='';const p=[...Array(n)].map((_,i)=>[sr(seed+i)*ww,y0+sr(seed+i*7)*(y1-y0),i]).sort((a,b)=>a[1]-b[1]);for(const[x,y,i]of p){if(frei&&!frei(x,y))continue;s+=buschel(x,y,h0+sr(seed+i*3)*(h1-h0),seed+i,farben[i%farben.length])}return s}
// Baum: Stamm mit Ästen, Krone aus Kreisen mit Licht oben links; Äpfel auf Wunsch
function baum(x,y,s,dunkel,hell,apfel){
 let g=`<ellipse cx="${x}" cy="${y+1}" rx="${r1(22*s)}" ry="${r1(3*s)}" fill="#000" opacity=".13"/><path d="M${r1(x-3.4*s)} ${y}L${r1(x-2*s)} ${r1(y-26*s)}L${r1(x+2*s)} ${r1(y-26*s)}L${r1(x+3.4*s)} ${y}Z" fill="#6b4a2b"/><path d="M${r1(x-1)} ${r1(y-20*s)}L${r1(x-9*s)} ${r1(y-31*s)}M${r1(x+1)} ${r1(y-22*s)}L${r1(x+8*s)} ${r1(y-33*s)}" stroke="#6b4a2b" stroke-width="${r1(2.2*s)}" stroke-linecap="round"/>`;
 [[0,-40,17],[-13,-31,12],[13,-32,12],[-6,-50,11],[7,-48,10]].forEach(([a,b,r])=>g+=`<circle cx="${r1(x+a*s)}" cy="${r1(y+b*s)}" r="${r1(r*s)}" fill="${dunkel}"/>`);
 [[-4,-45,9],[-14,-34,6],[6,-51,6]].forEach(([a,b,r])=>g+=`<circle cx="${r1(x+a*s)}" cy="${r1(y+b*s)}" r="${r1(r*s)}" fill="${hell}" opacity=".75"/>`);
 if(apfel)[[-8,-44],[6,-36],[-14,-30],[12,-45],[0,-30],[-2,-52],[14,-33]].forEach(([a,b])=>g+=`<circle cx="${r1(x+a*s)}" cy="${r1(y+b*s)}" r="${r1(1.9*s)}" fill="#c0392b"/><circle cx="${r1(x+a*s-.5)}" cy="${r1(y+b*s-.6)}" r=".5" fill="#fff" opacity=".6"/>`);
 return g}
const DR={
 baum1:x=>baum(x,GY+6,1,'#4f9a47','#7cc06a',1),
 baum2:x=>baum(x,GY+4,1.35,'#3b7d3a','#5c9e4f',0),
 blumen:x=>[...Array(22)].map((_,i)=>{const fx=r1(x+sr(i+1)*140-70),fy=r1(GY+10+sr(i+40)*30),c=['#f4d03f','#ffffff','#e78ac3','#f19a3e','#b18cf0'][i%5];return`<path d="M${fx} ${fy}V${r1(fy-4)}" stroke="#5f9245" stroke-width=".7"/><circle cx="${fx}" cy="${r1(fy-4.5)}" r="1.9" fill="${c}"/><circle cx="${fx}" cy="${r1(fy-4.5)}" r=".7" fill="#e2a72e"/>`}).join(''),
 // Heuballen: Quader mit Ober- und Seitenfläche, Strohstruktur und Bindeschnüren
 heu:x=>{const ballen=(bx,by)=>`<rect x="${bx}" y="${by}" width="16" height="10" rx="1.2" fill="#e2b24a"/><path d="M${bx} ${by}l3 -3h16l-3 3Z" fill="#f2cf74"/><path d="M${bx+16} ${by}l3 -3v10l-3 3Z" fill="#c9972f"/>`+
  `<path d="${[...Array(8)].map((_,i)=>`M${r1(bx+1.5+sr(bx+i*1.7)*12)} ${r1(by+1.5+sr(by+i*3.1)*7)}l${r1(1.4+sr(i+bx)*1.6)} ${r1((sr(i*5+by)-.5)*1.2)}`).join('')}" stroke="#c4902f" stroke-width=".5" fill="none"/>`+
  `<path d="M${bx+5} ${by}v10M${bx+11} ${by}v10M${bx+5} ${by}l3 -3M${bx+11} ${by}l3 -3" stroke="#8a5a2b" stroke-width=".7" fill="none"/>`;
  return`<ellipse cx="${x+2}" cy="${GY+16.6}" rx="24" ry="2.6" fill="#000" opacity=".13" stroke="none"/>${ballen(x-17,GY+6)}${ballen(x-1,GY+6)}${ballen(x-9,GY-4)}`},
 troge:x=>`<ellipse cx="${x}" cy="${GY+18.5}" rx="20" ry="2.5" fill="#000" opacity=".12" stroke="none"/><path d="M${x-14} ${GY+18}V${GY+14}M${x+14} ${GY+18}V${GY+14}" stroke="#5a4129" stroke-width="2"/><rect x="${x-16}" y="${GY+7}" width="32" height="9" rx="2" fill="#7a5a36"/><path d="M${x-15} ${GY+12}h30" stroke="#5f4529" stroke-width=".5"/><rect x="${x-16}" y="${GY+7}" width="32" height="2" rx="1" fill="#9a7a50"/><rect x="${x-14}" y="${GY+8.5}" width="28" height="3.5" rx="1.5" fill="#6fb6e8"/><path d="M${x-10} ${GY+9.6}h9" stroke="#fff" stroke-width=".8" opacity=".7"/>`,
 // Stall: Bretterwand mit Eckleisten und Steinsockel, Schindeldach mit heller Kante und Wetterfahne, Heuluke, zweiflügeliges Tor mit Beschlägen, Lampe
 stall:x=>{const L=x-34,R=x+34,T=GY-34,B=GY+10;
  let s=`<ellipse cx="${x}" cy="${B+1}" rx="46" ry="4" fill="#000" opacity=".14" stroke="none"/><rect x="${L}" y="${T}" width="68" height="44" fill="#b0412f"/>`+
   [...Array(8)].map((_,i)=>(i%2?`<rect x="${L+i*8.5}" y="${T}" width="8.5" height="44" fill="#a63a28" stroke="none"/>`:'')+(i?`<path d="M${L+i*8.5} ${T}V${B}" stroke="#86301f" stroke-width=".5"/>`:'')).join('')+
   `<rect x="${L}" y="${T}" width="68" height="44" fill="url(#wandG)" stroke="none"/><rect x="${L-1}" y="${B-4}" width="70" height="4.5" rx=".8" fill="#9a8a78"/>${[...Array(7)].map((_,i)=>`<path d="M${L+4+i*10} ${B-4}v4.5" stroke="#7d6e5f" stroke-width=".5"/>`).join('')}`+
   `<rect x="${L}" y="${T}" width="3" height="40" fill="#f1e4c8"/><rect x="${R-3}" y="${T}" width="3" height="40" fill="#f1e4c8"/><rect x="${L}" y="${T}" width="68" height="3.5" fill="#000" opacity=".2" stroke="none"/>`+
   `<path d="M${x-42} ${T+1}L${x} ${GY-64}L${x+42} ${T+1}Z" fill="#6e2b20"/>`+[1,2,3,4,5].map(k=>{const y=T+1-k*5.2,hw=42*(1-k*5.2/31);return`<path d="M${r1(x-hw+1.5)} ${r1(y)}H${r1(x+hw-1.5)}" stroke="#55201a" stroke-width=".7" stroke-dasharray="4 1.2"/>`}).join('')+
   `<path d="M${x-43} ${T+2}L${x} ${GY-65}L${x+43} ${T+2}" stroke="#f1e4c8" stroke-width="2" fill="none" stroke-linejoin="round"/>`+
   `<path d="M${x} ${GY-65}V${GY-75}M${x-4} ${GY-71}h8" stroke="#3d3a36" stroke-width=".7"/><path d="M${x-5} ${GY-74.6}h7l2.4 -1.3l-2.4 -1.3h-7Z" fill="#3d3a36" stroke="none"/>`+
   `<rect x="${x-7}" y="${GY-53}" width="14" height="11" fill="#f4e9d0"/><rect x="${x-5.5}" y="${GY-51.5}" width="11" height="8" fill="#4a2318"/><path d="M${x-5.5} ${GY-43.5}q1.5 -4 3.5 -1q2 -4.5 3.5 -.5q1.6 -3.5 3.5 1.5Z" fill="#e2b24a" stroke="#b98a2c" stroke-width=".4"/>`+
   `<rect x="${x-12}" y="${GY-16}" width="24" height="26" fill="#f4e9d0"/>`+[x-10.5,x+1].map(a=>`<path d="M${a} ${GY-14.5}L${a+9.5} ${GY+8.5}M${a+9.5} ${GY-14.5}L${a} ${GY+8.5}" stroke="#b0412f" stroke-width="1.6"/><rect x="${a}" y="${GY-14.5}" width="9.5" height="23" fill="none" stroke="#d6c7a6" stroke-width=".9"/>`).join('')+
   `<path d="M${x} ${GY-16}V${B}" stroke="#c9b893" stroke-width="1"/>`+[[x-12,GY-10],[x-12,GY+4],[x+12,GY-10],[x+12,GY+4]].map(([a,b])=>`<rect x="${a-1.6}" y="${b-.7}" width="3.2" height="1.4" rx=".5" fill="#3d3a36" stroke="none"/>`).join('')+
   `<path d="M${x} ${GY-19.5}v-2" stroke="#3d3a36" stroke-width=".6"/><circle cx="${x}" cy="${GY-18}" r="1.5" fill="#ffd56a"/>`;
  return s},
 teich:x=>`<ellipse cx="${x}" cy="${GY+24}" rx="37" ry="10.5" fill="#3f86bd"/><ellipse cx="${x}" cy="${GY+23}" rx="35" ry="9" fill="url(#teichG)"/><ellipse cx="${x-9}" cy="${GY+21}" rx="14" ry="2.6" fill="#cfe9f7" opacity=".55"/><ellipse cx="${x+14}" cy="${GY+26}" rx="4" ry="1.6" fill="#5aa45a"/><circle cx="${x+15}" cy="${GY+25.4}" r=".9" fill="#f6a8c8"/>`+[[-34,0],[-30,3],[-27,-1],[31,1],[34,-2]].map(([a,b])=>`<path d="M${x+a} ${GY+22+b}q-1 -8 .5 -14" stroke="#4f7d3a" stroke-width=".9" fill="none"/><ellipse cx="${x+a+.4}" cy="${GY+10+b}" rx=".9" ry="2.4" fill="#7a5233"/>`).join(''),
 // Farm-Windrad: Gittermast mit Querstreben, Rad mit 16 schmalen Flügeln (dreht sich), rote Windfahne
 windrad:x=>{const H=GY-46,B=GY+6,lx=y=>x-7+5.4*(B-y)/(B-H-3),rx=y=>x+7-5.4*(B-y)/(B-H-3);
  let s=`<ellipse cx="${x}" cy="${B+.5}" rx="10" ry="1.8" fill="#000" opacity=".13" stroke="none"/><path d="M${x-7} ${B}L${x-1.6} ${H+3}M${x+7} ${B}L${x+1.6} ${H+3}" stroke="#7d878d" stroke-width="1.4" stroke-linecap="round"/>`;
  for(let i=0;i<5;i++){const y1=B-i*10,y2=B-(i+1)*10;if(y2<H+3)break;s+=`<path d="M${r1(lx(y1))} ${y1}L${r1(rx(y2))} ${y2}M${r1(rx(y1))} ${y1}L${r1(lx(y2))} ${y2}M${r1(lx(y2))} ${y2}H${r1(rx(y2))}" stroke="#98a2a8" stroke-width=".6"/>`}
  s+=`<rect x="${x-3}" y="${H+2}" width="6" height="2" fill="#7d878d"/><path d="M${x} ${H}H${x+15}" stroke="#7d878d" stroke-width="1"/><path d="M${x+12} ${H-5}L${x+22} ${H-3.5}L${x+22} ${H+3.5}L${x+12} ${H+5}Z" fill="#b0412f" stroke="#7a2a1e" stroke-width=".5"/>`+
   `<g transform="translate(${x} ${H})"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="7s" repeatCount="indefinite"/>${[...Array(16)].map((_,i)=>`<path d="M-1 -4.5L-2.4 -15L2.4 -15L1 -4.5Z" fill="${i%2?'#f2f4f5':'#dde3e6'}" stroke="#9aa4ab" stroke-width=".35" transform="rotate(${i*22.5}) skewX(-12)"/>`).join('')}<circle r="15.3" fill="none" stroke="#8a949a" stroke-width=".7"/><circle r="6" fill="none" stroke="#8a949a" stroke-width=".6"/></g><circle r="2.4" fill="#6f797f"/></g>`;
  return s}
};
// Fläche je Gegenstand für das Gras: [halbe Breite, Fußlinie]; UMR: Gegenstände mit feinem Umriss
const FUSS={stall:[37,GY+10],windrad:[9,GY+6],heu:[19,GY+16],troge:[17,GY+18],baum1:[6,GY+6],baum2:[7,GY+4]},UMR={stall:1,heu:1,troge:1};
const hill=(ww,y0,amp,wl,ph,col)=>{let d=`M0 ${WH}`;for(let x=0;x<=ww+16;x+=16)d+=`L${x} ${(y0+amp*Math.sin(x/wl+ph)+amp*.5*Math.sin(x/(wl*.43)+ph*2)).toFixed(1)}`;return `<path d="${d}L${ww+16} ${WH}Z" fill="${col}"/>`};
const hillY=(x,y0,amp,wl,ph)=>y0+amp*Math.sin(x/wl+ph)+amp*.5*Math.sin(x/(wl*.43)+ph*2);
// Farben nach Tageszeit (echte Uhrzeit): t/m/b Himmel oben/Mitte/unten, far/mid Hügel, g1/g2 Wiese, w1/w2 Wolken, bu Büsche, glow Sonnenschein
function pal(h){
 if(h>=21||h<5)return{n:'nacht',t:'#0b1a3a',m:'#1c2f5a',b:'#2a3f6b',far:'#22395a',mid:'#26493f',g1:'#3d6b46',g2:'#2f5638',w1:'#4a5a7e',w2:'#36446a',bu:'#21402f',tint:'#0a1230',ta:.3};
 if(h<8)return{n:'morgen',t:'#7f8fc6',m:'#c9a9b8',b:'#f7c690',far:'#a6b5c8',mid:'#86b28c',g1:'#9cc683',g2:'#7fae68',w1:'#fff3e6',w2:'#f2c9b0',bu:'#6c9c62',tint:'#ffb070',ta:.06,sy:70,glow:'#ffd9a0'};
 if(h<18)return{n:'tag',t:'#4a9ee0',m:'#8cc6ec',b:'#e3f2f6',far:'#b5d2cb',mid:'#9fcb9e',g1:'#9fd07f',g2:'#7cb35c',w1:'#ffffff',w2:'#dce8f0',bu:'#74a86a',tint:'#000',ta:0,sy:30,glow:'#fff3c4'};
 return{n:'abend',t:'#51609a',m:'#b07d92',b:'#f4a76e',far:'#8d93ad',mid:'#789e85',g1:'#88b46f',g2:'#6b9a58',w1:'#ffe3d1',w2:'#e7a58f',bu:'#5e8a5a',tint:'#ff8f50',ta:.08,sy:70,glow:'#ffc48a'}}
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
 // Gras nicht auf Gegenständen: belegte Flächen [links, rechts, Fußlinie]
 const belegt=ITEMS.filter(i=>items.includes(i[0])&&FUSS[i[0]]).map(i=>{const x=Math.round(i[3]*WW),[w,b]=FUSS[i[0]];return[x-w,x+w,b]}),frei=(x,y)=>!belegt.some(([a,b,f])=>x>a&&x<b&&y<f+1);
 const nacht=P.n=='nacht',gras=nacht?['#2f5a38','#376640','#28503a']:['#6d9f4c','#7fb258','#5f9245','#86b960'];
 // Farbverläufe: Himmel, Sonnen- bzw. Mondschein, Wolken, Wiese, Teich, Schatten an der Stallwand
 let s=`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.t}"/><stop offset=".55" stop-color="${P.m}"/><stop offset="1" stop-color="${P.b}"/></linearGradient>`+
  `<radialGradient id="sglow"><stop offset="0" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="${nacht?.45:.9}"/><stop offset=".35" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="${nacht?.15:.45}"/><stop offset="1" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="0"/></radialGradient>`+
  `<linearGradient id="wolkeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.w1}"/><stop offset="1" stop-color="${P.w2}"/></linearGradient>`+
  `<linearGradient id="bodenG" gradientUnits="userSpaceOnUse" x1="0" y1="${GY-8}" x2="0" y2="${WH}"><stop offset="0" stop-color="${P.g1}"/><stop offset="1" stop-color="${P.g2}"/></linearGradient>`+
  `<linearGradient id="teichG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc0ea"/><stop offset="1" stop-color="#4a90c2"/></linearGradient>`+
  `<linearGradient id="wandG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>`+
  `<rect width="${W}" height="${WH}" fill="url(#sk)"/>`;
 if(nacht)s+=[...Array(22)].map((_,i)=>`<circle cx="${(sr(i+3)*W).toFixed(1)}" cy="${(sr(i+90)*80).toFixed(1)}" r="${(.4+sr(i)*.8).toFixed(1)}" fill="#fff" opacity="${(.5+sr(i+7)*.4).toFixed(2)}"/>`).join('')+
  `<circle cx="${W*.22}" cy="34" r="30" fill="url(#sglow)"/><circle cx="${W*.22}" cy="34" r="9" fill="#f4f1de"/><circle cx="${W*.22-2.5}" cy="32" r="1.6" fill="#d9d4bd"/><circle cx="${W*.22+2.5}" cy="37" r="1.1" fill="#d9d4bd"/>`;
 else s+=`<circle cx="${W*.8}" cy="${P.sy}" r="34" fill="url(#sglow)"/><circle cx="${W*.8}" cy="${P.sy}" r="11" fill="${P.n=='tag'?'#fff3c4':P.glow}"/>`;
 // Wolken: gebauschte Formen mit Verlauf, ziehen langsam (data-v)
 s+=`<g id="hc">${[0,1,2,3].map(i=>`<g class="cl" data-x="${(sr(i+11)*(W+160)).toFixed(0)}" data-y="${(14+sr(i+21)*40).toFixed(0)}" data-v="${(2+sr(i+31)*4).toFixed(1)}" fill="url(#wolkeG)" opacity="${nacht?.6:.95}"><ellipse cx="0" cy="0" rx="18" ry="5.5"/><circle cx="-8" cy="-3" r="6.5"/><circle cx="2" cy="-5.5" r="8"/><circle cx="10" cy="-2" r="5.5"/></g>`).join('')}</g>`;
 // Ferne Hügel (dunstig) und nahe Hügel mit Büschen
 s+=`<g id="hl0">${hill(WW,96,9,60,1,P.far)}</g>`;
 const cam0=(WW-W)/2;
 s+=`<g id="hl1">${hill(WW,108,7,45,2,P.mid)}${[...Array(18)].map((_,i)=>{const x=sr(i+7)*WW;return busch(x,hillY(x,108,7,45,2)+3,3.5+sr(i)*3,P.bu)}).join('')}`+
  (items.includes('regenbogen')?['#e74c3c','#f39c12','#f4d03f','#58b368','#4a90c2','#7d5ba6'].map((c,i)=>`<path d="M${W/2+.5*cam0-80+i*4} 112A${80-i*4} ${80-i*4} 0 0 1 ${W/2+.5*cam0+80-i*4} 112" fill="none" stroke="${c}" stroke-width="4.2" opacity="${nacht?.25:.45}"/>`).join(''):'')+`</g>`;
 // Wiese mit Verlauf, Büsche am Rand, Holzzaun mit Lichtkante, Gegenstände, Gras hinter den Pferden
 s+=`<g id="hw"><rect x="0" y="${GY-8}" width="${WW}" height="${WH-GY+8}" fill="url(#bodenG)"/>`+
  [[.12,.06],[.52,.13],[.9,.05]].map(([a,b],i)=>busch(a*WW,GY+1,6+b*40,i%2?P.bu:'#4f8a4a')).join('')+
  `<g fill="#a9805a">${[GY-6,GY].map(y=>`<rect x="0" y="${y-1}" width="${WW}" height="2.2" rx=".8"/><rect x="0" y="${y+1.2}" width="${WW}" height=".8" fill="#7d5c3c" opacity=".5"/>`).join('')}</g>`+
  [...Array(Math.ceil(WW/28)+1)].map((_,i)=>`<rect x="${i*28}" y="${GY-12}" width="3.2" height="18" rx=".8" fill="#9b7449"/><rect x="${i*28}" y="${GY-12}" width="1.1" height="18" rx=".5" fill="#b78c5e"/>`).join('')+
  ITEMS.filter(i=>items.includes(i[0])&&DR[i[0]]).map(i=>UMR[i[0]]?`<g stroke="#3a261466" stroke-width=".55" stroke-linejoin="round">${DR[i[0]](Math.round(i[3]*WW))}</g>`:DR[i[0]](Math.round(i[3]*WW))).join('')+
  grasStreifen(WW,Math.round(WW/6),GY-2,GY+12,3,5.5,200,gras,frei)+
  HF.horses.map((h,i)=>`<g class="hs" id="hs${i}" data-i="${i}">${PF.bild('h'+i+'_',{...h.m,coat:h.c,st:h.st})}</g>`).join('')+
  // Gras ganz vorn (vor allen Pferden), danach die Herzen beim Antippen
  `<g id="hv">${grasStreifen(WW,Math.round(WW/12),193,201,4,8,900,gras)}</g><g id="hfx"></g></g>`;
 s+=`<rect width="${W}" height="${WH}" fill="${P.tint}" opacity="${P.ta}" pointer-events="none"/><g id="htg" opacity="0" pointer-events="none"><rect id="htr" height="12" rx="6" fill="#fff" opacity=".92"/><text id="htt" y="8.6" font-size="7.5" text-anchor="middle" fill="#26331f"></text></g>`;
 svg.innerHTML=s;
 HF.hw=svg.querySelector('#hw');HF.hl0=svg.querySelector('#hl0');HF.hl1=svg.querySelector('#hl1');HF.hfx=svg.querySelector('#hfx');HF.vorne=svg.querySelector('#hv');HF.htg=svg.querySelector('#htg');
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
 if(ord.some((h,i)=>HF.ord[i]!==h)){ord.forEach(h=>HF.hw.insertBefore(h.g_,HF.vorne));HF.ord=ord}
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
