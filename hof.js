// Pferdehof Mathe: animierte Weide als Hintergrund, persönlicher Hof und Rundflug.
// Greift auf Funktionen und Daten aus app.js erst zur Laufzeit zu (horse, kid, hh, neigh, S, v ...),
// deshalb darf diese Datei vor app.js geladen werden.

// PFS: Größe des gezeichneten Pferds (pferd.js) auf der Weide; Pferd steht mit den Hufen auf y = 0 seines Bildes
const PFS=.5;
// Eigene Figur auf dem Hof: weiter vorn auf der Wiese (Füße bei GY+y) und etwas größer, damit sie nicht an Trog und Gebäude klebt
// (seit 2026-10-20). geb = Lage (Anteil der Koppel) mit Unterstand oder Stall, frei = ohne Gebäude
const FIGX={geb:.405,frei:.47,y:36,s:.44,besuch:[.535,.59,.355]};// besuch: Plätze der Besuchsfiguren
const WH=200,GY=124,sr=n=>{let x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
// Gegenstände für den Hof: [id, Name, Preis in Äpfeln, Lage auf der Weide (Anteil der Weltbreite)]
// Drei Blumenwiesen (seit 2026-10-19): bunt (Mitte), Mohn (links neben dem Teich), Lavendel (rechts hinter der Eiche)
const ITEMS=[['baum1','Apfelbaum',12,.33],['baum2','Eiche',15,.80],['blumen','Blumenwiese bunt',10,.46],['mohn','Blumenwiese Mohn',10,.10],['lavendel','Blumenwiese Lavendel',10,.89],['heu','Heuballen',10,.555],['troge','Wassertrog',12,.40],['stall','Stall',30,.64],['teich','Teich',25,.24],['windrad','Windrad',20,.725],['regenbogen','Regenbogen',35,.50]];
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
 // Blumenwiesen liegen auf der vorderen Wiese (Fußlinie ab GY+27), damit sie nicht unter Unterstand, Stall, Figur, Trog oder Heuballen liegen (seit 2026-10-20)
 blumen:x=>`<g class="wiese">`+[...Array(22)].map((_,i)=>{const fx=r1(x+sr(i+1)*140-70),fy=r1(GY+27+sr(i+40)*34),c=['#f4d03f','#ffffff','#e78ac3','#f19a3e','#b18cf0'][i%5];return`<path d="M${fx} ${fy}V${r1(fy-4)}" stroke="#5f9245" stroke-width=".7"/><circle cx="${fx}" cy="${r1(fy-4.5)}" r="1.9" fill="${c}"/><circle cx="${fx}" cy="${r1(fy-4.5)}" r=".7" fill="#e2a72e"/>`}).join('')+'</g>',
 // Mohnwiese: rote Mohnblüten (vier Blütenblätter, schwarze Mitte) auf langen Stielen, dazwischen Knospen
 mohn:x=>`<g class="wiese">`+[...Array(18)].map((_,i)=>{const fx=r1(x+sr(i+201)*110-55),fy=r1(GY+30+sr(i+240)*30),h=r1(5+sr(i+260)*3),t=r1(fy-h),kn=i%6==5;
  return`<path d="M${fx} ${fy}q${r1(sr(i+280)*2-1)} ${-h/2} 0 ${-h}" stroke="#5f9245" stroke-width=".7" fill="none"/>`+(kn?`<ellipse cx="${fx}" cy="${t}" rx=".9" ry="1.4" fill="#6f9a4c"/>`:
   `<g transform="translate(${fx} ${t})"><ellipse cx="-1.3" cy="-.2" rx="1.6" ry="1.3" fill="#d6302a"/><ellipse cx="1.3" cy="-.2" rx="1.6" ry="1.3" fill="#d6302a"/><ellipse cy="-1.1" rx="1.5" ry="1.2" fill="#e8463b"/><ellipse cy=".7" rx="1.4" ry="1" fill="#c42a24"/><circle r=".65" fill="#2b2321"/></g>`)}).join('')+'</g>',
 // Lavendelwiese: Büschel aus schmalen, lila Ähren (kleine Blüten an der Spitze), in lockeren Reihen
 lavendel:x=>`<g class="wiese">`+[...Array(10)].map((_,i)=>{const bx=r1(x+(i%5)*22-44+sr(i+301)*6),by=r1(GY+33+Math.floor(i/5)*15+sr(i+320)*4);
  return[...Array(6)].map((_,j)=>{const dx=r1((j-2.5)*1.4+sr(i*7+j)*1),hh=r1(7+sr(i*5+j+340)*3),tx=r1(bx+dx*1.8),ty=r1(by-hh);
   return`<path d="M${bx} ${by}L${tx} ${ty}" stroke="#6a8f52" stroke-width=".6"/>`+[0,1,2,3].map(k=>`<ellipse cx="${r1(tx+(bx-tx)*k*.09)}" cy="${r1(ty+(by-ty)*k*.09)}" rx=".75" ry="1.1" fill="${k%2?'#8a6cc0':'#a58ad6'}"/>`).join('')}).join('')}).join('')+'</g>',
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
   `<path d="M${x} ${GY-65}V${GY-75}M${x-4} ${GY-71}h8" stroke="#3d3a36" stroke-width=".7"/><g class="wfahne" data-x="${x}"><path d="M${x-5} ${GY-74.6}h7l2.4 -1.3l-2.4 -1.3h-7Z" fill="#3d3a36" stroke="none"/></g>`+
   `<rect x="${x-7}" y="${GY-53}" width="14" height="11" fill="#f4e9d0"/><rect x="${x-5.5}" y="${GY-51.5}" width="11" height="8" fill="#4a2318"/><path d="M${x-5.5} ${GY-43.5}q1.5 -4 3.5 -1q2 -4.5 3.5 -.5q1.6 -3.5 3.5 1.5Z" fill="#e2b24a" stroke="#b98a2c" stroke-width=".4"/>`+
   // Tor (seit 2026-10-21 in zwei Flügeln, die sich beim Antippen öffnen): dahinter dunkles Inneres mit etwas Stroh
   `<rect x="${x-12}" y="${GY-16}" width="24" height="26" fill="#3a1d14"/><path d="M${x-11} ${B-1.5}q3 -2.5 6 -.5q3 -2.5 6 0q3 -2.5 5 .5" fill="#e2b24a" stroke="none" opacity=".8"/>`+
   [[x-12,x-10.5,x-12],[x,x+1,x+12]].map(([l,a,hx],j)=>`<g class="stor" data-x="${hx}"><rect x="${l}" y="${GY-16}" width="12" height="26" fill="#f4e9d0"/><path d="M${a} ${GY-14.5}L${a+9.5} ${GY+8.5}M${a+9.5} ${GY-14.5}L${a} ${GY+8.5}" stroke="#b0412f" stroke-width="1.6"/><rect x="${a}" y="${GY-14.5}" width="9.5" height="23" fill="none" stroke="#d6c7a6" stroke-width=".9"/>`+
    (j?'':`<path d="M${x} ${GY-16}V${B}" stroke="#c9b893" stroke-width="1"/>`)+[GY-10,GY+4].map(b=>`<rect x="${hx-1.6}" y="${b-.7}" width="3.2" height="1.4" rx=".5" fill="#3d3a36" stroke="none"/>`).join('')+`</g>`).join('')+
   `<path d="M${x} ${GY-19.5}v-2" stroke="#3d3a36" stroke-width=".6"/><circle cx="${x}" cy="${GY-18}" r="1.5" fill="#ffd56a"/>`;
  return s},
 teich:x=>`<ellipse cx="${x}" cy="${GY+24}" rx="37" ry="10.5" fill="#3f86bd"/><ellipse cx="${x}" cy="${GY+23}" rx="35" ry="9" fill="url(#teichG)"/><ellipse cx="${x-9}" cy="${GY+21}" rx="14" ry="2.6" fill="#cfe9f7" opacity=".55"/><ellipse cx="${x+14}" cy="${GY+26}" rx="4" ry="1.6" fill="#5aa45a"/><circle cx="${x+15}" cy="${GY+25.4}" r=".9" fill="#f6a8c8"/>`+[[-34,0],[-30,3],[-27,-1],[31,1],[34,-2]].map(([a,b])=>`<path d="M${x+a} ${GY+22+b}q-1 -8 .5 -14" stroke="#4f7d3a" stroke-width=".9" fill="none"/><ellipse cx="${x+a+.4}" cy="${GY+10+b}" rx=".9" ry="2.4" fill="#7a5233"/>`).join(''),
 // Farm-Windrad: Gittermast mit Querstreben, Rad mit 16 schmalen Flügeln (dreht sich, gesteuert in hofDraw), rote Windfahne
 windrad:x=>{const H=GY-46,B=GY+6,lx=y=>x-7+5.4*(B-y)/(B-H-3),rx=y=>x+7-5.4*(B-y)/(B-H-3);
  let s=`<ellipse cx="${x}" cy="${B+.5}" rx="10" ry="1.8" fill="#000" opacity=".13" stroke="none"/><path d="M${x-7} ${B}L${x-1.6} ${H+3}M${x+7} ${B}L${x+1.6} ${H+3}" stroke="#7d878d" stroke-width="1.4" stroke-linecap="round"/>`;
  for(let i=0;i<5;i++){const y1=B-i*10,y2=B-(i+1)*10;if(y2<H+3)break;s+=`<path d="M${r1(lx(y1))} ${y1}L${r1(rx(y2))} ${y2}M${r1(rx(y1))} ${y1}L${r1(lx(y2))} ${y2}M${r1(lx(y2))} ${y2}H${r1(rx(y2))}" stroke="#98a2a8" stroke-width=".6"/>`}
  s+=`<rect x="${x-3}" y="${H+2}" width="6" height="2" fill="#7d878d"/><path d="M${x} ${H}H${x+15}" stroke="#7d878d" stroke-width="1"/><path d="M${x+12} ${H-5}L${x+22} ${H-3.5}L${x+22} ${H+3.5}L${x+12} ${H+5}Z" fill="#b0412f" stroke="#7a2a1e" stroke-width=".5"/>`+
   `<g transform="translate(${x} ${H})"><g class="wrad">${[...Array(16)].map((_,i)=>`<path d="M-1 -4.5L-2.4 -15L2.4 -15L1 -4.5Z" fill="${i%2?'#f2f4f5':'#dde3e6'}" stroke="#9aa4ab" stroke-width=".35" transform="rotate(${i*22.5}) skewX(-12)"/>`).join('')}<circle r="15.3" fill="none" stroke="#8a949a" stroke-width=".7"/><circle r="6" fill="none" stroke="#8a949a" stroke-width=".6"/></g><circle r="2.4" fill="#6f797f"/></g>`;
  return s}
};
// ---------- Hof ausbauen (Entwurf 2026-10-18): Unterstand (2 Plätze), Stall (4 Plätze, Ausbau des Unterstands), Trennzaun zwischen Koppeln ----------
// Unterstand: offener Holzunterstand mit Pultdach (hinten höher), Rückwand aus Brettern, Heuraufe, Stroh am Boden
DR.unterstand=x=>{const B=GY+12,L=x-24,R=x+24,yl=B-36,yr=B-28,y=t=>yl+(yr-yl)*(t-L)/(R-L);
 let s=`<ellipse cx="${x}" cy="${B+1}" rx="32" ry="3.5" fill="#000" opacity=".14" stroke="none"/>`+
  `<path d="M${L} ${y(L)}L${R} ${y(R)}L${R} ${B}L${L} ${B}Z" fill="#7a5233"/>`+
  [...Array(7)].map((_,i)=>{const px=L+(i+1)*6.9;return`<path d="M${r1(px)} ${r1(y(px))}V${B}" stroke="#5e3d24" stroke-width=".6"/>`}).join('')+
  `<path d="M${L} ${B-3}H${R}V${B}H${L}Z" fill="#e2b24a"/><path d="M${L+3} ${B-3}l2 -2M${L+11} ${B-3}l2 -2.4M${x+4} ${B-3}l2.2 -2M${R-9} ${B-3}l2 -2.2" stroke="#c4902f" stroke-width=".6"/>`+
  `<rect x="${x-9}" y="${B-21}" width="18" height="7" rx="1" fill="#5e3d24"/><path d="M${x-8} ${B-20}h16v5h-16Z" fill="#e2b24a"/>${[0,1,2,3,4].map(i=>`<path d="M${x-7+i*3.5} ${B-21}v7" stroke="#5e3d24" stroke-width=".7"/>`).join('')}`+
  [L+1.5,x,R-1.5].map(px=>`<rect x="${r1(px-1.8)}" y="${r1(y(px))}" width="3.6" height="${r1(B-y(px))}" fill="#9b6b40"/><rect x="${r1(px-1.8)}" y="${r1(y(px))}" width="1.2" height="${r1(B-y(px))}" fill="#b78656"/>`).join('')+
  `<path d="M${L-4} ${yl-3}L${R+5} ${yr-2}L${R+5} ${yr+2.5}L${L-4} ${yl+1.5}Z" fill="#5b4a3a"/><path d="M${L-4} ${yl-3}L${R+5} ${yr-2}" stroke="#7d6a56" stroke-width="1.2"/>`+
  [1,2,3,4].map(i=>{const px=L-4+i*(R-L+9)/5;return`<path d="M${r1(px)} ${r1(yl-3+(yr-yl+1)*i/5)}v4" stroke="#463829" stroke-width=".5"/>`}).join('');
 return s};
// Stall (Ausbau des Unterstands auf der Hauptkoppel): heller Holzstall mit Satteldach, zwei Boxentüren (obere Hälfte offen, Heu), Lampe
DR.pferdestall=x=>{const B=GY+12,L=x-38,R=x+38,T=B-32,F=B-62;
 let s=`<ellipse cx="${x}" cy="${B+1}" rx="48" ry="4" fill="#000" opacity=".14" stroke="none"/><rect x="${L}" y="${T}" width="76" height="32" fill="#c99a5e"/>`+
  [...Array(9)].map((_,i)=>`<path d="M${L+(i+1)*7.6} ${T}V${B}" stroke="#a87a45" stroke-width=".55"/>`).join('')+
  `<rect x="${L}" y="${T}" width="76" height="3" fill="#000" opacity=".18"/><rect x="${L}" y="${T}" width="2.6" height="32" fill="#f1e4c8"/><rect x="${R-2.6}" y="${T}" width="2.6" height="32" fill="#f1e4c8"/>`+
  [x-27,x+5].map(a=>`<rect x="${a}" y="${B-27}" width="22" height="27" fill="#f1e4c8"/><rect x="${a+1.6}" y="${B-25.5}" width="18.8" height="11" fill="#3a2a1c"/>`+
   `<path d="M${a+3} ${B-15}q3 -5 6 -1q2 -4 5 0q2 -3 4.5 1Z" fill="#e2b24a"/><rect x="${a+1.6}" y="${B-13}" width="18.8" height="13" fill="#9b6b40"/>`+
   `<path d="M${a+1.6} ${B-13}L${a+20.4} ${B}M${a+20.4} ${B-13}L${a+1.6} ${B}" stroke="#f1e4c8" stroke-width="1.4"/><rect x="${a+1.6}" y="${B-14.2}" width="18.8" height="1.6" fill="#f1e4c8"/>`).join('')+
  `<path d="M${L-6} ${T+1}L${x} ${F}L${R+6} ${T+1}Z" fill="#5a3b28"/>`+[1,2,3,4].map(k=>{const yy=T+1-k*6,hw=44*(1-k*6/31);return`<path d="M${r1(x-hw+2)} ${yy}H${r1(x+hw-2)}" stroke="#432b1c" stroke-width=".7" stroke-dasharray="5 1.4"/>`}).join('')+
  `<path d="M${L-7} ${T+2}L${x} ${F-1}L${R+7} ${T+2}" stroke="#f1e4c8" stroke-width="2" fill="none" stroke-linejoin="round"/>`+
  `<path d="M${x} ${B-29}v-3" stroke="#3d3a36" stroke-width=".6"/><circle cx="${x}" cy="${B-27.5}" r="1.5" fill="#ffd56a"/>`;
 return s};
// Trennzaun zwischen zwei Koppeln: läuft vom hinteren Zaun (GY) nach vorn über die Wiese, Pfosten werden nach vorn größer
function trennzaun(x){const P=[[x,GY],[x-6,GY+22],[x-13,GY+44],[x-21,GY+68]],h=y=>12+(y-GY)*.18;
 let s=P.map(([px,py])=>`<rect x="${r1(px-1.6-h(py)*.06)}" y="${r1(py-h(py))}" width="${r1(3.2+h(py)*.12)}" height="${r1(h(py)+4)}" rx=".8" fill="#9b7449"/>`).join('');
 for(const f of [.92,.5])s+=`<path d="${P.map(([px,py],i)=>(i?'L':'M')+r1(px)+' '+r1(py-h(py)*f)).join('')}" stroke="#a9805a" stroke-width="${f>.6?2.2:2}" fill="none" stroke-linecap="round"/>`;
 return`<g class="trennzaun">${s}</g>`}
// Gebäude und Trennzäune eines Hofs: Hauptkoppel-Gebäude auf der freien Stelle zwischen Trog und Heuballen (.477),
// auf Koppel 2 und 3 in der Mitte. Liefert SVG und die Flächen, auf denen kein Gras wachsen soll.
function gebaeude(H,OX,WK,WW){let s='';const belegt=[],g=(u,x)=>{if(!u)return'';belegt.push([x-(u==2?40:27),x+(u==2?40:27),GY+12]);return`<g class="gebaeude" data-art="${u==2?'stall':'unterstand'}">${u==2?DR.pferdestall(x):DR.unterstand(x)}</g>`};
 s+=g(H.ko.u[0],Math.round(OX+.477*WK));
 if(H.ko.n>=2)s+=trennzaun(OX)+g(H.ko.u[1],Math.round(OX/2));
 if(H.ko.n>=3)s+=trennzaun(OX+WK)+g(H.ko.u[2],Math.round(OX+WK+(WW-OX-WK)/2));
 return{s,belegt}}
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
// ---------- Wetter und Tiere (seit 2026-10-19) ----------
// Wetter nach echtem Datum: je 3-Stunden-Block fest ausgewürfelt (auf allen Geräten gleich, springt nicht beim Neuladen).
// Dezember bis Februar: 30 % Schnee, sonst 15 % Regen. Tagsüber (7 bis 19 Uhr) nach einem Regen-Block: Regenbogen.
// Zum Ausprobieren: Adresse mit ?wetter=regen, schnee, regenbogen oder klar. Für Tests: HF.wTest (Wetter), HF.hTest (Stunde), HF.mTest (Monat 0-11)
const WETTER=['klar','regen','schnee','regenbogen'];
function wetter(d){d=d||new Date();const q=typeof location!='undefined'?new URLSearchParams(location.search).get('wetter'):null;if(WETTER.includes(HF.wTest))return HF.wTest;if(WETTER.includes(q))return q;
 const blk=ms=>{const t=new Date(ms),tag=Math.floor((t-new Date(t.getFullYear(),0,1))/864e5),z=sr(t.getFullYear()*.37+tag*8+Math.floor(t.getHours()/3)+.5),m=t.getMonth();return m==11||m<2?(z<.3?'schnee':'klar'):(z<.15?'regen':'klar')};
 const jetzt=blk(d.getTime());if(jetzt!='klar')return jetzt;const h=d.getHours();return h>=7&&h<19&&blk(d.getTime()-3*36e5)=='regen'?'regenbogen':'klar'}
// ---------- Themen auf der Startseite (seit 2026-10-21) ----------
// Nur die Startseite (kind 'home') bekommt eine Themen-Optik, nicht die Höfe der Kinder. Halloween: 20.10. bis 02.11.
// Zum Ausprobieren: Adresse mit ?thema=halloween bzw. ?thema=aus. Für Tests: HF.thTest ('halloween' oder '')
const THEMEN=['halloween'];
function thema(d){d=d||new Date();const q=typeof location!='undefined'?new URLSearchParams(location.search).get('thema'):null;
 if(HF.thTest!=null)return HF.thTest;if(q!=null)return THEMEN.includes(q)?q:'';
 const m=d.getMonth(),t=d.getDate();return(m==9&&t>=20)||(m==10&&t<=2)?'halloween':''}
// Farben im Halloween-Look je Tageszeit (violetter Himmel, orange Horizont, gedämpfte Wiese)
const HAL={
 tag:{t:'#5b3f8f',m:'#a2679d',b:'#f2a465',far:'#8a6d9e',mid:'#7d8f55',g1:'#8da35a',g2:'#6f8c47',w1:'#e6d2ee',w2:'#b595c9',bu:'#566b3d',tint:'#4a2070',ta:.1},
 abend:{t:'#3b2766',m:'#8a3f7a',b:'#f08a4b',far:'#6d5a8a',mid:'#5d7550',g1:'#76924c',g2:'#5b7a3c',w1:'#d9b5d6',w2:'#a46a9c',bu:'#4a5f35',tint:'#4a1a6a',ta:.16},
 nacht:{t:'#100824',m:'#2a1450',b:'#4b2470',far:'#2e2450',mid:'#2a4235',g1:'#365a3a',g2:'#2a4a30',w1:'#4a3a7a',w2:'#36295c',bu:'#1f3828',tint:'#1a0836',ta:.3}};
const thPal=(P,TH)=>TH=='halloween'?{...P,...HAL[P.n=='morgen'?'tag':P.n]}:P;
// Kürbis mit Gesicht: abends und nachts leuchtet er von innen
function kuerbis(x,y,s,licht){const f=licht?'#ffe066':'#3a1a05';
 return`<g class="kuerbis" transform="translate(${r1(x)} ${r1(y)}) scale(${s})">`+(licht?`<ellipse cy="-6" rx="15" ry="11" fill="#ffb347" opacity=".35"/>`:'')+
  `<ellipse cy="0" rx="9" ry="1.6" fill="#000" opacity=".18"/><ellipse cx="-4.6" cy="-5.2" rx="5.4" ry="5.8" fill="#d9660a"/><ellipse cx="4.6" cy="-5.2" rx="5.4" ry="5.8" fill="#d9660a"/><ellipse cy="-5.6" rx="5.2" ry="6.4" fill="#f58a1f"/>`+
  `<path d="M-2.6 -11Q-4.2 -5.6 -2.6 -.4M2.6 -11Q4.2 -5.6 2.6 -.4" stroke="#c45f08" stroke-width=".5" fill="none"/><path d="M-.9 -11.4Q-.6 -14 1.8 -14.6L2.2 -13.2Q1 -12.6 1 -11.2Z" fill="#4a6b2a"/>`+
  `<path d="M-5 -6.2l1.9 -2.5l1.9 2.5zM1.2 -6.2l1.9 -2.5l1.9 2.5z" fill="${f}"/><path d="M-4.6 -3.4l1.3 1.3l1.3 -1l1.3 1.1l1.3 -1.1l1.3 1l1.3 -1.3l-.2 1.8q-1.9 2 -4.8 .1z" fill="${f}"/></g>`}
// Jeder vierte Platz bleibt frei (die Kürbisse ohne Gesicht sind seit 2026-10-22 weg), keiner liegt auf dem Teich
function kuerbisse(WW,frei,P){const n=Math.max(6,Math.round(WW/105)),licht=P.n!='tag'&&P.n!='morgen',tx=itemX('teich');
 return[...Array(n)].map((_,i)=>[(i+.5)/n*WW+(sr(i+500)-.5)*70,GY+6+sr(i+510)*28,1.1+sr(i+520)*.8,i%4!=3]).filter(([x,y,,g])=>g&&frei(x,y)&&Math.abs(x-tx)>58).sort((a,b)=>a[1]-b[1]).map(([x,y,sc])=>kuerbis(x,y,sc,licht)).join('')}
// Fledermaus: Flügel schlagen über den Pfad (k = Ausschlag), der Körper bleibt in der Mitte
const fledPfad=k=>{k=+k;const a=r1(-k*2-1),b=r1(-k*1.5),c=r1(-k*1.5+2.2),d=r1(-k*1.5+1.2);return`M-1 -1.8L-.4 -.5Q-3 ${a} -6.5 ${b}Q-5.5 ${c} -4.2 ${d}Q-3 1.4 -1.8 .8Q-.9 1.8 0 1.6Q.9 1.8 1.8 .8Q3 1.4 4.2 ${d}Q5.5 ${c} 6.5 ${b}Q3 ${a} .4 -.5L1 -1.8L0 -1.2Z`};
const FLED=`<path class="vogel fled" d="${fledPfad(1)}" fill="#1b1030"/>`;
// Schmetterling (von oben, Flügel schlagen über die Breite) und Vogel (Flügelschlag über den Pfad)
const falterSvg=(c,i)=>`<g class="falter" id="sf${i}"><g class="fl"><ellipse cx="-2.3" cy="-1.2" rx="2.4" ry="2.9" fill="${c}"/><ellipse cx="2.3" cy="-1.2" rx="2.4" ry="2.9" fill="${c}"/><ellipse cx="-1.6" cy="1.7" rx="1.5" ry="1.8" fill="${c}" opacity=".8"/><ellipse cx="1.6" cy="1.7" rx="1.5" ry="1.8" fill="${c}" opacity=".8"/></g><rect x="-.35" y="-2.6" width=".7" height="5.4" rx=".35" fill="#3a2a1a"/></g>`;
const VOGEL='<path class="vogel" d="M-4 0Q-2 -2 0 0Q2 -2 4 0" fill="none" stroke="#3a3f4a" stroke-width=".9" stroke-linecap="round"/>';
// Regen bzw. Schnee: eine Ebene enthält ihre Tropfen zweimal übereinander und wird nur verschoben (schont langsame Geräte).
// Seit 2026-10-21 als eigenes SVG je Ebene in #hwetter (außerhalb des Hof-Bilds), bewegt per CSS-Animation (siehe wetterEbene).
// Je Ebene: [Anzahl, Startwert für den Zufall, Strichstärke bzw. Radius, Deckkraft bzw. Radius-Streuung, Fallgeschwindigkeit, Seitwärts-Pendeln]
function niederschlag(W,art){const pkt=(n,s)=>[...Array(Math.round(n*Math.min(2,Math.max(.4,W/360))))].map((_,i)=>[sr(i+s)*(W+20)-10,sr(i+s+500)*WH,sr(i+s+900)]),zweimal=f=>[0,WH].map(f).join(''),
  ebene=(x,vv,sw)=>{const g=`<svg class="wl" viewBox="0 0 ${W} ${2*WH}" preserveAspectRatio="none" style="animation-duration:${(WH/vv).toFixed(2)}s" aria-hidden="true">${x}</svg>`;return sw?`<div class="pendel" style="--sw:${(sw/W*100).toFixed(2)}%">${g}</div>`:g};
 if(art=='regen')return[[45,300,1.1,.75,210],[55,700,.7,.5,150]].map(([n,s,b,o,vv])=>{const P=pkt(n,s);
  return ebene(`<path d="${zweimal(o2=>P.map(([x,y])=>`M${r1(x)} ${r1(y+o2)}l-1.6 6.5`).join(''))}" fill="none" stroke="#d6e6f4" stroke-width="${b}" opacity="${o}" stroke-linecap="round"/>`,vv)}).join('');
 return[[30,900,1.2,.8,24,6],[42,1300,.6,.5,13,4]].map(([n,s,r,rr,vv,sw])=>{const P=pkt(n,s);
  return ebene(`<g fill="#fff" opacity=".9">${zweimal(o2=>P.map(([x,y,z])=>`<circle cx="${r1(x)}" cy="${r1(y+o2)}" r="${r1(r+z*rr)}"/>`).join(''))}</g>`,vv,sw)}).join('')}
// Ebene für Regen und Schnee über dem Hof (wird einmal angelegt und bei jedem Neuaufbau des Hofs gefüllt oder geleert)
function wetterEbene(W,art,nacht){let el=document.getElementById('hwetter');
 if(!el){el=document.createElement('div');el.id='hwetter';el.setAttribute('aria-hidden','true');const h=document.getElementById('hof');h.parentNode.insertBefore(el,h.nextSibling)}
 el.style.display=art?'block':'none';el.style.opacity=nacht?'.55':'1';
 // Breite in Bild-Einheiten nach der echten Größe der Ebene, damit die Tropfen nicht gestreckt werden (seit 2026-10-21)
 const r=el.getBoundingClientRect(),W2=art&&r.width>0&&r.height>0?Math.max(60,Math.round(WH*r.width/r.height)):W;
 el.innerHTML=art?niederschlag(W2,art):''}
// Gangarten: [Ausschlag der Beine in Grad, Schritte pro Sekunde]; Phasen der Beine: hinten fern, vorne fern, hinten nah, vorne nah
const G={walk:[16,1.1],trot:[24,2.1],gallop:[36,3.2]},OFF={walk:[.5,.75,0,.25],trot:[.5,0,0,.5],gallop:[.1,.6,0,.5]},SPEED={walk:16,trot:42,gallop:105};
const HF={mode:'bg',horses:[],ord:[],key:'',t:0,last:0,raf:0,run:false,cam:0,cv:24,idle:0,fill:null,tag:null,W:288,WW:720,drag:null,clouds:[],pal:null,
 // Hof-Interaktionen (nur auf dem Hof eines Kindes): Apfel, Windrad (wb = Schub, wa/fa = Winkel Rad/Wetterfahne), Frosch, Wellen, Pferdeäpfel
 kind:'',apfel:null,frosch:null,wellen:[],wa:0,wb:0,fa:0,mist:[],mid:0,mistT:20,mistK:null,bis:0};
// Klickbare Gegenstände auf dem Hof eines Kindes
const AKT={baum1:1,windrad:1,teich:1,heu:1,stall:1};// heu und stall seit 2026-10-21 (Mäuse, Katze)
// Pferdeapfel: kleiner Haufen mit großer, unsichtbarer Tippfläche
const mistSvg=m=>`<g class="mist" data-act="mist" data-id="${m.id}" transform="translate(${r1(m.x)} ${r1(m.y)}) scale(1.4)" style="cursor:pointer"><circle cy="-3" r="8" fill="#000" opacity="0"/><ellipse cy="-1.1" rx="4.2" ry="1.8" fill="#5e3f22"/><ellipse cx="-.5" cy="-2.7" rx="3.1" ry="1.5" fill="#6f4b2a"/><ellipse cx=".3" cy="-4.1" rx="2" ry="1.2" fill="#80582f"/><ellipse cx="-.6" cy="-4.5" rx=".7" ry=".35" fill="#fff" opacity=".25"/></g>`;
const APFEL='<g class="apfel"><circle r="2.6" fill="#c0392b"/><circle cx="-.8" cy="-.9" r=".7" fill="#fff" opacity=".6"/><path d="M0 -2.5l.8 -1.6" stroke="#5a3b1d" stroke-width=".6"/></g>';
// Stallkatze (seit 2026-10-21): grau getigert, steht mit den Pfoten auf y = 0, schaut nach rechts. .kb = Beine, .kk = Kopf, .ks = Schwanz, .kr = Körper (kippt beim Sitzen)
const KATZE='<g class="katze"><g class="kr"><path class="ks" d="M-4 -3.4q-3.2 -1 -3.4 -4.8" stroke="#858a91" stroke-width="1.1" fill="none" stroke-linecap="round"/><ellipse cy="-3.1" rx="4.2" ry="2.1" fill="#8f949b"/><path d="M-2.6 -4.9l.8 1.2M-.8 -5.1l.6 1.3M1 -5l.5 1.2" stroke="#6c7178" stroke-width=".6"/></g>'+
 '<path class="kb" d="M-2.8 -1.4v1.4M-1.4 -1.4v1.4M1.6 -1.4v1.4M3 -1.4v1.4" stroke="#6c7178" stroke-width="1" stroke-linecap="round"/>'+
 '<g class="kk"><circle cx="4.4" cy="-5.1" r="2" fill="#8f949b"/><path d="M3.1 -6.3l.3 -1.9l1.2 1.3ZM4.9 -6.7l1 -1.6l.6 1.7Z" fill="#8f949b"/><circle cx="5.3" cy="-5.3" r=".35" fill="#2b2321"/><circle cx="6.3" cy="-4.8" r=".3" fill="#d98a8a"/><path d="M6.4 -4.7l1.5 -.4M6.4 -4.4l1.5 .2" stroke="#eee" stroke-width=".2"/></g></g>';
// Maus (seit 2026-10-21): klein, grau, schaut nach rechts, Pfoten auf y = 0
const MAUS='<g class="maus"><path d="M-1.8 -.8q-2 .2 -3 -1.2" stroke="#9b8f86" stroke-width=".35" fill="none"/><ellipse cy="-.9" rx="1.9" ry="1" fill="#8b8078"/><circle cx="1.7" cy="-1.2" r=".75" fill="#8b8078"/><circle cx="1.3" cy="-1.9" r=".5" fill="#c9a9a0"/><circle cx="2.2" cy="-1.3" r=".18" fill="#222"/></g>';
// Frosch, steht mit den Füßen auf y = 0, schaut nach rechts; .kehle ist die Schallblase beim Quaken
const FROSCH=`<g class="frosch"><ellipse cx="-2.2" cy="-1" rx="2.4" ry="1.1" fill="#3f7a2e"/><ellipse cy="-2.4" rx="3.4" ry="2.3" fill="#5aa13f"/><ellipse cx="2.3" cy="-3.2" rx="1.9" ry="1.5" fill="#5aa13f"/><circle class="kehle" cx="3" cy="-1.8" r="1.4" fill="#d9eaa0" opacity="0"/><circle cx="1.6" cy="-4.7" r="1" fill="#fff"/><circle cx="3.1" cy="-4.6" r="1" fill="#fff"/><circle cx="1.8" cy="-4.7" r=".45" fill="#111"/><circle cx="3.3" cy="-4.6" r=".45" fill="#111"/><path d="M1.6 -2.6q1.4 .7 2.6 -.2" stroke="#2d5a20" stroke-width=".35" fill="none"/><ellipse cx="1.4" cy="-.3" rx="1.2" ry=".4" fill="#3f7a2e"/></g>`;

function fillers(){if(!HF.fill){const ks=Object.keys(COATS);HF.fill=[...Array(5)].map((_,i)=>{const c=ks[(i*2+R(0,5))%ks.length];return{id:'f'+i,c,st:i==3?1:3,m:{bl:R(0,1),so:R(0,1)},name:COATS[c][0],own:0}})}return HF.fill}
// ---------- Unterstand und Stall: Pferd morgens herausholen, abends hineinbringen (seit 2026-10-22, Wunsch der Kinder) ----------
// Nur mit Unterstand (1) oder Stall (2) auf der Hauptkoppel. Am Pferd: hs = {d: Datum, s: 'raus'}. Ohne Eintrag von heute steht das Pferd drinnen.
// Drinnen steht es im Unterstand unter dem Dach bzw. schaut im Stall aus dem oberen Teil der linken Boxentür.
const unterkunft=H=>H&&H.ko&&H.ko.u?H.ko.u[0]|0:0;
const drinnen=H=>unterkunft(H)>0&&!(H.hs&&H.hs.d==tag()&&H.hs.s=='raus');
// Pferdedecke: auf dem eigenen Hof bei Regen, Schnee und nachts, wenn sie gekauft ist
const deckeWetter=()=>{const w=wetter();return w=='regen'||w=='schnee'||pal(HF.hTest!=null?HF.hTest:new Date().getHours()).n=='nacht'};
const DECKE='#b0412f';
function fuehrKnopf(k){const H=hh(k),u=unterkunft(H);if(!u)return'';const ort=u==2?'Stall':'Unterstand',d=drinnen(H);
 return`<div class="row fuehr" style="margin:6px 0;align-items:center"><button class="go" onclick="fuehren()">${d?`${esc(H.name)} aus dem ${ort} holen`:`${esc(H.name)} in den ${ort} bringen`}</button>${d?`<span class="small">${esc(H.name)} steht im ${ort}.</span>`:''}</div>`}
// Knopf: Zustand sofort speichern, dann die kleine Animation (bei "Bewegung reduzieren" ohne Animation)
function fuehren(){const k=kid();if(!k||!k.h||HF.fuehr)return;const H=hh(k);if(!unterkunft(H))return;const raus=drinnen(H);
 if(raus)H.hs={d:tag(),s:'raus'};else delete H.hs;save();
 if(RM||HF.kind!='kid'||!HF.horses.some(h=>h.own)){hofSync(true);ui();return}
 hofFuehr(raus);ui()}
// Ablauf. raus: Figur geht zur Tür (1,2 s), Pferd erscheint (0,4 s), beide gehen auf die Wiese (3 s), Figur geht zurück (1,2 s).
// rein: Pferd kommt zur Figur (2 s), beide gehen zur Tür (3 s), Pferd verschwindet (0,4 s), dann wird der Hof neu aufgebaut.
function hofFuehr(raus){const h=HF.horses.find(x=>x.own);if(!h)return;const xs=Math.round(HF.OX+.477*HF.WK),[fx,fy]=HF.figP||[xs-40,GY+36];
 HF.fuehr={raus,t:0,xs,fx,fy,hx0:h.x,hd0:h.d};
 if(raus){h.drin=0;HF.hw.insertBefore(h.g_,HF.vorne);const w=HF.hw.querySelector('#hdrin');if(w)w.remove();h.x=xs;h.d=0;h.op=0;h.g_.style.opacity='0'}
 hofKick(raus?6:6)}
function fuehrSchritt(h,dt){const F=HF.fuehr;if(dt>0)F.t+=dt;const t=F.t,L=(p,a,b)=>a+(b-a)*Math.max(0,Math.min(1,p)),dy=Y=>(Y-138)/54,xs=F.xs;
 const F1=[xs-24,GY+20],ziel=(x,d)=>{h.dir=x>=h.x?1:-1;h.x=x;h.d=d};let fig=[F.fx,F.fy],geht=0,op=1,lauf=0;
 if(F.raus){const H2=[xs+70,.45];
  if(t<1.2){fig=[L(t/1.2,F.fx,F1[0]),L(t/1.2,F.fy,F1[1])];geht=1;op=0}
  else if(t<1.6){fig=F1;op=(t-1.2)/.4}
  else if(t<4.6){const p=(t-1.6)/3;ziel(L(p,xs,H2[0]),L(p,0,H2[1]));fig=[L(p,F1[0],H2[0]-28),L(p,F1[1],GY+36)];geht=1;lauf=1}
  else if(t<5.8){const p=(t-4.6)/1.2;fig=[L(p,H2[0]-28,F.fx),L(p,GY+36,F.fy)];geht=1}
  else{HF.fuehr=null;h.state='graze';h.t=3+Math.random()*3;h.op=1;h.g_.style.opacity='';fuehrFigur(F.fx,F.fy,0);HF.keyNeu=F.key;ui();return}}
 else{const M=[F.fx+30,dy(F.fy)];
  if(t<2){const p=t/2;ziel(L(p,F.hx0,M[0]),L(p,F.hd0,M[1]));lauf=1}
  else if(t<5){const p=(t-2)/3;ziel(L(p,M[0],xs),L(p,M[1],0));fig=[L(p,F.fx,F1[0]),L(p,F.fy,F1[1])];geht=1;lauf=1}
  else if(t<5.4){op=1-(t-5)/.4;fig=F1}
  else{HF.fuehr=null;hofSync(true);ui();return}}
 h.state=lauf?'walk':'stand';h.g='walk';h.am+=((lauf?1:0)-h.am)*Math.min(1,dt*6);if(lauf)h.ph=(h.ph+dt*G.walk[1])%1;h.ha+=(0-h.ha)*Math.min(1,dt*3);h.joy=0;
 h.g_.style.opacity=op<1?op.toFixed(2):'';fuehrFigur(fig[0],fig[1],geht?t:0)}
// Eigene Figur verschieben (leichtes Wippen beim Gehen)
function fuehrFigur(x,y,t){const e=HF.figE;if(!e)return;e.setAttribute('transform',`translate(${r1(x)} ${r1(y-(t?Math.abs(Math.sin(t*9))*1.2:0))}) scale(${FIGX.s})`)}
function hofSpecs(kind){
 const A=[],km=k=>{const H=hh(k);return{id:'k'+k.id,c:H.coat,st:stg(k),m:pfSpec(H,stg(k)),name:H.name,own:k.id}};
 if(kind=='kid'){const k=kid(),H=hh(k),b=belegung(H),o={...km(k),ko:0,drin:drinnen(H)?unterkunft(H):0};if(H.au&&H.au.pdecke&&deckeWetter())o.m={...o.m,dk:DECKE};A.push(o);
  // Freunde stehen auf der Koppel, auf der sie einen Platz haben (belegung in app.js). Ohne Platz sind sie nicht auf dem Hof.
  b.p.forEach((L,i)=>L.forEach(f=>{if(f!='eigen')A.push({...freundInfo(k,f),ko:i})}));
  // Besuch (seit 2026-10-20): Pferde der Freundinnen laufen auf der Hauptkoppel mit, ohne Platz zu brauchen
  besuche(k).forEach((b,i)=>A.push({id:'b'+k.id+'_'+i,c:b.h.coat,st:b.h.st,m:pfSpec(b.h,b.h.st),name:`${b.h.name} (Besuch von ${b.n})`,own:0,ko:0,besuch:1}))}
 // Startseite: Pferde der Kinder (auch zweite Pferde), höchstens 5, aufgefüllt mit fremden Pferden
 else{S.kids.filter(k=>k.h).forEach(k=>{A.push(km(k));if(k.h2)A.push({id:'e'+k.id,c:k.h2.coat,st:k.h2.st||0,m:pfSpec(k.h2,k.h2.st||0),name:k.h2.name,own:0})});A.splice(5);const f=fillers();for(let i=0;A.length<5;i++)A.push(f[i])}
 return A}

function hofBuild(kind){
 const svg=$('#hof'),px=svg.clientWidth||360,ph=svg.clientHeight||240,W=Math.max(200,Math.round(WH*px/ph));
 // Hof ausbauen: Hauptkoppel WK breit (wie früher die ganze Weide), Koppel 2 links und Koppel 3 rechts kommen je EXT breit dazu
 const H0=kind=='kid'?hh(kid()):null,kn=H0?H0.ko.n:1,EXT=380,WK=Math.max(720,W+240),OX=kn>=2?EXT:0,WW=WK+(kn>=2?EXT:0)+(kn>=3?EXT:0);
 // Wird links eine Koppel angebaut (oder fällt weg), rückt die Hauptkoppel: Kamera, Pferde, Pferdeäpfel, Apfel und Frosch rücken mit
 const dOX=OX-(HF.OX||0);
 HF.W=W;HF.WW=WW;HF.WK=WK;HF.OX=OX;HF.kr=[[OX,OX+WK],[0,OX],[OX+WK,WW]];
 HF.cam=Math.min(Math.max(HF.cam?HF.cam+dOX:OX+(WK-W)/2,0),WW-W);
 if(dOX){HF.horses.forEach(h=>{h.x+=dOX;if(h.ziel!=null)h.ziel+=dOX});HF.mist.forEach(m=>m.x+=dOX);if(HF.apfel)HF.apfel.x+=dOX;if(HF.frosch)HF.frosch.x+=dOX}
 svg.setAttribute('viewBox',`0 0 ${W} ${WH}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 const now=new Date(),TH=kind=='home'?thema(now):'',P=thPal(pal(HF.hTest!=null?HF.hTest:now.getHours()+now.getMinutes()/60),TH),items=kind=='kid'?Object.keys(hh(kid()).it):ITEMS.map(i=>i[0]);
 HF.pal=P;HF.kind=kind;
 // Interaktionen: laufende Animationen gehen beim Neuaufbau verloren, Pferdeäpfel bleiben (nur beim selben Kind)
 const kidId=kind=='kid'?kid().id:null;
 if(HF.mistK!==kidId){HF.mist=[];HF.mistT=20;HF.mistK=kidId;HF.apfel=null;HF.frosch=null}
 if(kind!='kid'){HF.apfel=null;HF.frosch=null}
 HF.wellen=[];HF.katze=null;HF.maeuse=null;HF.fuehr=null;// Katze und Mäuse gehen beim Neuaufbau verloren (seit 2026-10-21)
 const old=Object.fromEntries(HF.horses.map(h=>[h.id,h]));
 const startX=i=>{const [a,b]=HF.kr[i];return i?a+40+Math.random()*(b-a-80):Math.min(b-30,Math.max(a+30,HF.cam+30+Math.random()*(W-60)))};
 HF.horses=hofSpecs(kind).map(s=>{s.ko=s.ko|0;const o=old[s.id]&&(old[s.id].ko|0)===s.ko?old[s.id]:null;return Object.assign({ph:0,am:0,g:'walk',ha:0,joy:0,state:'stand',t:R(1,3),dir:R(0,1)?1:-1,d:Math.random(),dd:.5,sw:Math.random()*6,x:startX(s.ko)},s,o?{x:o.x,d:o.d,dir:o.dir,state:o.state,t:o.t,ph:o.ph,am:o.am,g:o.g,ha:o.ha,dd:o.dd,ziel:kind=='kid'?o.ziel:null}:{})});
 // Gras nicht auf Gegenständen: belegte Flächen [links, rechts, Fußlinie]
 const geb=H0?gebaeude(H0,OX,WK,WW):{s:'',belegt:[]};
 const belegt=[...ITEMS.filter(i=>items.includes(i[0])&&FUSS[i[0]]).map(i=>{const x=Math.round(OX+i[3]*WK),[w,b]=FUSS[i[0]];return[x-w,x+w,b]}),...geb.belegt],frei=(x,y)=>!belegt.some(([a,b,f])=>x>a&&x<b&&y<f+1);
 // Figuren: auf dem Hof eines Kindes die eigene vorn, alle anderen (höchstens 5) hinter dem Zaun
 const mitF=S.kids.filter(x=>x.f),eig=kind=='kid'?mitF.find(x=>x.id==kidId):null,figs={eigen:eig,zaun:mitF.filter(x=>x!==eig).slice(0,5)};
 const hsSvg=(h,i)=>`<g class="hs" id="hs${i}" data-i="${i}">${PF.bild('h'+i+'_',{...h.m,coat:h.c,st:h.st})}</g>`,dh=HF.horses.findIndex(h=>h.drin),
  drinSvg=dh<0?'':`<g id="hdrin"${HF.horses[dh].drin==2?' clip-path="url(#drinClip)"':''}>${hsSvg(HF.horses[dh],dh)}</g>`;
 const nacht=P.n=='nacht',gras=nacht?['#2f5a38','#376640','#28503a']:TH?['#6f8f45','#7c9b4c','#5d7e3c','#86a455']:['#6d9f4c','#7fb258','#5f9245','#86b960'];
 // Wetter: bei Regen und Schnee trüber Himmel ohne Sonne, Mond und Sterne. Schmetterlinge nur tagsüber von April bis Oktober bei gutem Wetter, Vögel nicht nachts und nicht bei Regen oder Schnee.
 const WT=wetter(now),trueb=WT=='regen'||WT=='schnee',mo=HF.mTest!=null?HF.mTest:now.getMonth(),falterOk=P.n=='tag'&&!trueb&&mo>=3&&mo<=9,voegelOk=TH?!trueb:!nacht&&!trueb;HF.wetter=WT;HF.thema=TH;
 // Farbverläufe: Himmel, Sonnen- bzw. Mondschein, Wolken, Wiese, Teich, Schatten an der Stallwand
 // Himmel: bei Regen und Schnee grau (nachts dunkelgrau)
 const sky=trueb?(nacht?['#141b2b','#222b3d','#323c52']:['#7f8c99','#a7b2bc','#ccd3d9']):[P.t,P.m,P.b];
 let s=`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".55" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>`+
  `<radialGradient id="sglow"><stop offset="0" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="${nacht?.45:.9}"/><stop offset=".35" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="${nacht?.15:.45}"/><stop offset="1" stop-color="${nacht?'#f4f1de':P.glow}" stop-opacity="0"/></radialGradient>`+
  `<linearGradient id="wolkeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${trueb?(nacht?'#59657e':'#e4e8ec'):P.w1}"/><stop offset="1" stop-color="${trueb?(nacht?'#3c465e':'#a3adb8'):P.w2}"/></linearGradient>`+
  `<linearGradient id="bodenG" gradientUnits="userSpaceOnUse" x1="0" y1="${GY-8}" x2="0" y2="${WH}"><stop offset="0" stop-color="${P.g1}"/><stop offset="1" stop-color="${P.g2}"/></linearGradient>`+
  `<linearGradient id="teichG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc0ea"/><stop offset="1" stop-color="#4a90c2"/></linearGradient>`+
  `<linearGradient id="wandG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`+(H0&&unterkunft(H0)==2?`<clipPath id="drinClip"><rect x="${Math.round(OX+.477*WK)-27+1.6}" y="${GY+12-25.5}" width="18.8" height="11"/></clipPath>`:'')+`</defs>`+
  `<rect width="${W}" height="${WH}" fill="url(#sk)"/>`;
 if(trueb){}// kein Sonnen- oder Mondschein, keine Sterne
 else if(TH=='halloween')s+=(nacht||P.n=='abend'?[...Array(nacht?26:12)].map((_,i)=>`<circle cx="${(sr(i+3)*W).toFixed(1)}" cy="${(sr(i+90)*70).toFixed(1)}" r="${(.4+sr(i)*.8).toFixed(1)}" fill="#fff" opacity="${(.5+sr(i+7)*.4).toFixed(2)}"/>`).join(''):'')+
  `<circle cx="${W*.78}" cy="42" r="40" fill="#ffb347" opacity=".14"/><circle cx="${W*.78}" cy="42" r="27" fill="#ffb347" opacity=".2"/><circle cx="${W*.78}" cy="42" r="15" fill="#ffd27a"/><circle cx="${W*.78-4}" cy="38" r="2.4" fill="#f0b45a"/><circle cx="${W*.78+4.5}" cy="46" r="1.8" fill="#f0b45a"/><circle cx="${W*.78+3}" cy="35" r="1.2" fill="#f0b45a"/>`;
 else if(nacht)s+=[...Array(22)].map((_,i)=>`<circle cx="${(sr(i+3)*W).toFixed(1)}" cy="${(sr(i+90)*80).toFixed(1)}" r="${(.4+sr(i)*.8).toFixed(1)}" fill="#fff" opacity="${(.5+sr(i+7)*.4).toFixed(2)}"/>`).join('')+
  `<circle cx="${W*.22}" cy="34" r="30" fill="url(#sglow)"/><circle cx="${W*.22}" cy="34" r="9" fill="#f4f1de"/><circle cx="${W*.22-2.5}" cy="32" r="1.6" fill="#d9d4bd"/><circle cx="${W*.22+2.5}" cy="37" r="1.1" fill="#d9d4bd"/>`;
 else s+=`<circle cx="${W*.8}" cy="${P.sy}" r="34" fill="url(#sglow)"/><circle cx="${W*.8}" cy="${P.sy}" r="11" fill="${P.n=='tag'?'#fff3c4':P.glow}"/>`;
 // Wolken: gebauschte Formen mit Verlauf, ziehen langsam (data-v)
 // Bei Regen und Schnee doppelt so viele, größere Wolken
 s+=`<g id="hc">${[...Array(trueb?8:4).keys()].map(i=>`<g class="cl" data-x="${(sr(i+11)*(W+160)).toFixed(0)}" data-y="${(14+sr(i+21)*40).toFixed(0)}" data-v="${(2+sr(i+31)*4).toFixed(1)}" fill="url(#wolkeG)" opacity="${nacht?.6:.95}"><g transform="scale(${trueb?1.5:1})"><ellipse cx="0" cy="0" rx="18" ry="5.5"/><circle cx="-8" cy="-3" r="6.5"/><circle cx="2" cy="-5.5" r="8"/><circle cx="10" cy="-2" r="5.5"/></g></g>`).join('')}</g>`;
 // Vögel ziehen über den Himmel
 if(voegelOk)s+=TH=='halloween'?`<g id="hvo">${FLED}${FLED}${FLED}${FLED}</g>`:`<g id="hvo">${VOGEL}${VOGEL}${VOGEL}</g>`;
 // Ferne Hügel (dunstig) und nahe Hügel mit Büschen
 s+=`<g id="hl0">${hill(WW,96,9,60,1,P.far)}</g>`;
 const cam0=OX+(WK-W)/2;
 s+=`<g id="hl1">${hill(WW,108,7,45,2,P.mid)}${[...Array(18)].map((_,i)=>{const x=sr(i+7)*WW;return busch(x,hillY(x,108,7,45,2)+3,3.5+sr(i)*3,P.bu)}).join('')}`+
  // Regenbogen (gekauft oder nach dem Regen), bei Regen und Schnee ausgeblendet
  ((items.includes('regenbogen')||WT=='regenbogen')&&!trueb?['#e74c3c','#f39c12','#f4d03f','#58b368','#4a90c2','#7d5ba6'].map((c,i)=>`<path d="M${W/2+.5*cam0-80+i*4} 112A${80-i*4} ${80-i*4} 0 0 1 ${W/2+.5*cam0+80-i*4} 112" fill="none" stroke="${c}" stroke-width="4.2" opacity="${nacht?.25:.45}"/>`).join(''):'')+`</g>`;
 // Wiese mit Verlauf, Büsche am Rand, Holzzaun mit Lichtkante, Gegenstände, Gras hinter den Pferden
 s+=`<g id="hw"><rect x="0" y="${GY-8}" width="${WW}" height="${WH-GY+8}" fill="url(#bodenG)"/>`+
  // Schnee: helle Decke auf der Wiese, die Halme schauen heraus
  (WT=='schnee'?`<rect x="0" y="${GY-8}" width="${WW}" height="${WH-GY+8}" fill="#f4f8fb" opacity="${nacht?.3:.6}"/>`:'')+
  [[.12,.06],[.52,.13],[.9,.05]].map(([a,b],i)=>busch(a*WW,GY+1,6+b*40,i%2?P.bu:'#4f8a4a')).join('')+
  // Figuren der anderen Kinder (auf dem Startbild: aller Kinder) stehen hinter dem Zaun und schauen den Pferden zu
  figs.zaun.map((x,i)=>`<g class="fig" data-k="${x.id}" transform="translate(${r1(OX+(H0&&H0.ko.u[0]?[.545,.565,.355,.375,.585][i]:.43+i*.022)*WK)} ${GY-3}) scale(.3)">${figurBild(x.f)}</g>`).join('')+
  // Gras hinter dem Zaun (seit 2026-10-21): wird vor dem Zaun gezeichnet, damit die Latten davor liegen
  grasStreifen(WW,Math.round(WW/9),GY-5,GY+3,2.4,4,350,gras,frei)+
  `<g fill="#a9805a">${[GY-6,GY].map(y=>`<rect x="0" y="${y-1}" width="${WW}" height="2.2" rx=".8"/><rect x="0" y="${y+1.2}" width="${WW}" height=".8" fill="#7d5c3c" opacity=".5"/>`).join('')}</g>`+
  [...Array(Math.ceil(WW/28)+1)].map((_,i)=>`<rect x="${i*28}" y="${GY-12}" width="3.2" height="18" rx=".8" fill="#9b7449"/><rect x="${i*28}" y="${GY-12}" width="1.1" height="18" rx=".5" fill="#b78c5e"/>`).join('')+
  ITEMS.filter(i=>items.includes(i[0])&&DR[i[0]]).map(i=>{const z=DR[i[0]](Math.round(OX+i[3]*WK)),u=UMR[i[0]]?`<g stroke="#3a261466" stroke-width=".55" stroke-linejoin="round">${z}</g>`:z;
   return kind=='kid'&&AKT[i[0]]?`<g data-act="${i[0]}" style="cursor:pointer">${u}</g>`:u}).join('')+geb.s+drinSvg+
  grasStreifen(WW,Math.round(WW/6),GY+6,GY+14,3,5.5,200,gras,frei)+
  // Halloween (nur Startseite): Kürbisse auf der Wiese
  (TH=='halloween'?kuerbisse(WW,frei,P):'')+
  // Eigene Figur steht auf dem Hof vor dem Zaun
  (figs.eigen?`<g class="fig eigen" data-k="${figs.eigen.id}" transform="translate(${r1(OX+(H0&&H0.ko.u[0]?FIGX.geb:FIGX.frei)*WK)} ${GY+FIGX.y}) scale(${FIGX.s})">${figurBild(figs.eigen.f)}</g>`:'')+
  // Figuren der Freundinnen (Besuch) stehen auch vorn auf der Wiese, etwas kleiner
  (kind=='kid'?besuche(kid()).map((b,i)=>`<g class="fig besuch" data-b="${i}" transform="translate(${r1(OX+FIGX.besuch[i]*WK)} ${GY+FIGX.y-2}) scale(${FIGX.s*.92})">${figurBild(b.f)}</g>`).join(''):'')+
  // Ebene für Apfel, Frosch, Wellen und Pferdeäpfel (hinter den Pferden)
  `<g id="hap">${kind=='kid'?HF.mist.map(mistSvg).join(''):''}</g>`+
  HF.horses.map((h,i)=>h.drin?'':hsSvg(h,i)).join('')+
  // Gras ganz vorn (vor allen Pferden), danach die Herzen beim Antippen
  `<g id="hv">${grasStreifen(WW,Math.round(WW/12),193,201,4,8,900,gras)}</g><g id="hfx"></g></g>`;
 // Schmetterlinge (vor den Pferden) und Regen bzw. Schnee (ganz vorn), beide fest im Bild, nicht mit der Kamera
 if(falterOk)s+=`<g id="hfa" pointer-events="none">${['#f4c430','#e8508f','#4aa3df'].map(falterSvg).join('')}</g>`;
 // Regen und Schnee liegen seit 2026-10-21 in einer eigenen Ebene über dem Bild (wetterEbene, nach svg.innerHTML)
 s+=`<rect width="${W}" height="${WH}" fill="${P.tint}" opacity="${P.ta}" pointer-events="none"/><g id="htg" opacity="0" pointer-events="none"><rect id="htr" height="12" rx="6" fill="#fff" opacity=".92"/><text id="htt" y="8.6" font-size="7.5" text-anchor="middle" fill="#26331f"></text></g>`;
 svg.innerHTML=s;
 wetterEbene(W,trueb?WT:'',nacht);
 HF.hw=svg.querySelector('#hw');HF.hl0=svg.querySelector('#hl0');HF.hl1=svg.querySelector('#hl1');HF.hfx=svg.querySelector('#hfx');HF.vorne=svg.querySelector('#hv');HF.htg=svg.querySelector('#htg');
 HF.hap=svg.querySelector('#hap');HF.wrad=svg.querySelector('.wrad');HF.stor=[...svg.querySelectorAll('.stor')];HF.wfahne=svg.querySelector('.wfahne');
 // Laufender Apfel bzw. Frosch überlebt den Neuaufbau (z. B. beim Drehen des Geräts)
 if(HF.apfel){HF.hap.insertAdjacentHTML('beforeend',APFEL);HF.apfel.el=HF.hap.lastElementChild}
 if(HF.frosch){HF.hap.insertAdjacentHTML('beforeend',FROSCH);HF.frosch.el=HF.hap.lastElementChild}
 HF.clouds=[...svg.querySelectorAll('.cl')].map(e=>({el:e,x:+e.dataset.x,y:+e.dataset.y,v:+e.dataset.v}));
 // Wetter-Ebenen, Schmetterlinge und Vögel (Startwerte fest ausgewürfelt)
 HF.wl=[...svg.querySelectorAll('.wl')].map(e=>({el:e,v:+e.dataset.v,s:+e.dataset.s||0}));
 HF.falter=[...svg.querySelectorAll('.falter')].map((e,i)=>({el:e,fl:e.querySelector('.fl'),x:sr(i+40)*W,y:GY+20+sr(i+41)*40,v:(sr(i+42)<.5?-1:1)*(7+sr(i+43)*8),ph:sr(i+44)*6}));
 HF.voegel=[...svg.querySelectorAll('.vogel')].map((e,i)=>({el:e,x:sr(i+60)*W,y:18+sr(i+61)*30,v:14+sr(i+62)*8,ph:i*1.7}));
 HF.horses.forEach((h,i)=>{h.g_=svg.querySelector('#hs'+i);h.rig=new PF.Rig('h'+i+'_');h.hint=null});
 HF.ord=[];HF.figE=svg.querySelector('.fig.eigen');HF.figP=H0?[OX+(H0.ko.u[0]?FIGX.geb:FIGX.frei)*WK,GY+FIGX.y]:null;
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
 // Regen und Schnee fallen (Schnee pendelt seitwärts), Schmetterlinge flattern über die Wiese, Vögel ziehen von links nach rechts
 const t=HF.t,um=(x,n)=>((x%n)+n)%n;
 (HF.wl||[]).forEach(l=>l.el.setAttribute('transform',`translate(${l.s?(Math.sin(t*.7)*l.s).toFixed(1):0} ${(t*l.v%WH).toFixed(1)})`));
 (HF.falter||[]).forEach(f=>{const x=um(f.x+t*f.v,W+40)-20,y=f.y+Math.sin(t*1.3+f.ph)*8+Math.sin(t*3.1+f.ph)*2;
  f.el.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);f.fl.setAttribute('transform',`scale(${(.25+.75*Math.abs(Math.sin(t*11+f.ph))).toFixed(2)} 1)`)});
 (HF.voegel||[]).forEach((b,i)=>{const x=um(b.x+t*b.v+i*25,W+160)-40,k=(Math.sin(t*7+b.ph)*2.2).toFixed(1);
  const fl=b.el.classList.contains('fled');
  b.el.setAttribute('d',fl?fledPfad((Math.sin(t*9+b.ph)*1.6).toFixed(1)):`M-4 0Q-2 ${-k} 0 0Q2 ${-k} 4 0`);b.el.setAttribute('transform',`translate(${x.toFixed(1)} ${(b.y+Math.sin(t*.6+b.ph)*(fl?5:3)+(fl?8:0)).toFixed(1)})${fl?' scale(1.7)':''}`)});
 const fly=HF.mode=='fly',kr0=HF.kr||[[0,WW]];
 HF.horses.forEach(h=>{
  // Jedes Pferd bleibt auf seiner Koppel; im Hintergrund zusätzlich in der Nähe des Bildausschnitts
  const kr=kr0[h.ko|0]||kr0[0],rg=fly?[kr[0]+20,kr[1]-20]:[Math.max(kr[0]+20,cam-20),Math.min(kr[1]-20,cam+W+20)];
  // Tempo (Fire-Tablet): Pferde weit außerhalb des Bildes ruhen, nachdem sie einmal gezeichnet wurden
  if(h.drin&&!(HF.fuehr&&h.own)){const xs=Math.round(HF.OX+.477*HF.WK),B=GY+12,s0=GS[h.st].s;let tx,ty,sc;
   // Stall: Kopf in der oberen Öffnung der linken Boxentür (Kopf im Bild ungefähr bei 118/-185). Unterstand: unter dem Dach.
   if(h.drin==2){sc=.2;tx=xs-27+11.2-118*sc;ty=B-19+185*sc}else{sc=.13*s0;tx=xs+2;ty=B}
   h.ziel=null;if(h.joy>0)h.joy-=dt;h.rig.pose(dt,{g:'walk',am:0,ph:0,gr:0,hop:0});h.g_.setAttribute('transform',`translate(${r1(tx)} ${r1(ty)}) scale(${sc.toFixed(3)})`);h.x=h.drin==2?xs-16:tx;h.gy=ty;h.sc=sc/PFS;h.d=0;h.gez=1;return}
  if(h.gez&&!(HF.fuehr&&h.own)&&(h.x<cam-120||h.x>cam+W+120))return;
  if(HF.fuehr&&h.own)fuehrSchritt(h,dt);
  else if(dt>0&&rg[0]<rg[1]){
   h.t-=dt;if(h.joy>0)h.joy-=dt;
   // Ziel (z. B. ein gefallener Apfel): hinlaufen, dort grasen bzw. naschen
   if(h.ziel!=null){const dx=h.ziel-h.x;
    if(Math.abs(dx)<5){h.ziel=null;h.state='graze';h.t=3+Math.random()*3;apfelDa(h)}
    else{h.dir=dx>0?1:-1;h.state=Math.abs(dx)>40?'gallop':'trot';h.t=1}}
   else{
    if(h.t<=0&&h.joy<=0)pickState(h,rg);
    const mv=SPEED[h.state]||0;
    if(h.x<rg[0]||h.x>rg[1]){h.dir=h.x<rg[0]?1:-1;if(!mv){h.state='walk';h.t=4}}
    else if(mv&&((h.dir>0&&h.x>rg[1]-12)||(h.dir<0&&h.x<rg[0]+12)))h.dir*=-1}
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
  h.g_.setAttribute('transform',`translate(${h.x.toFixed(1)} ${gy.toFixed(1)}) scale(${(h.dir*sc*PFS).toFixed(3)} ${(sc*PFS).toFixed(3)})`);h.gez=1});
 hofSpass(dt);
 const ord=[...HF.horses].filter(h=>!h.drin).sort((a,b)=>a.d-b.d);
 if(ord.some((h,i)=>HF.ord[i]!==h)){ord.forEach(h=>HF.hw.insertBefore(h.g_,HF.vorne));HF.ord=ord}
 if(HF.tag){const h=HF.tag.h,t=HF.tag.t-=dt;
  if(t<=0&&dt>0){HF.tag=null;HF.htg.setAttribute('opacity','0')}
  else{const txt=h.name||'Pferd',w=txt.length*4.3+14,x=Math.min(W-w/2-2,Math.max(w/2+2,h.x-cam)),y=Math.max(2,h.gy-250*PFS*h.sc-6);
   HF.htg.querySelector('#htt').textContent=txt;const r=HF.htg.querySelector('#htr');r.setAttribute('width',w);r.setAttribute('x',-w/2);HF.htg.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);HF.htg.setAttribute('opacity','1')}}
}
// ---------- Hof-Interaktionen: Apfel, Windrad, Frosch, Pferdeäpfel ----------
const itemX=id=>Math.round((HF.OX||0)+ITEMS.find(i=>i[0]==id)[3]*(HF.WK||HF.WW));
// Herzen über einem oder mehreren Pferden
function herzen(L){if(!HF.hfx)return;
 HF.hfx.innerHTML=L.filter(h=>h.sc).map(h=>{const x=h.x+h.dir*60*PFS*h.sc,y=h.gy-215*PFS*h.sc;
  return[0,1,2].map(i=>`<g class="hrt" style="animation-delay:${i*.15}s"><path d="M0-3C-4-9-10-1 0 6C10-1 4-9 0-3Z" transform="translate(${(x+(i-1)*9).toFixed(1)} ${(y-i*5).toFixed(1)})" fill="#d1503f" stroke="none"/></g>`).join('')}).join('');
 clearTimeout(HF.fxT);HF.fxT=setTimeout(()=>{if(HF.hfx)HF.hfx.innerHTML=''},1800)}
// Wellenring auf dem Teich
function welle(x,y){if(!HF.hap)return;const el=document.createElementNS('http://www.w3.org/2000/svg','ellipse');el.setAttribute('fill','none');el.setAttribute('stroke','#e8f6ff');el.setAttribute('stroke-width','.8');HF.hap.appendChild(el);HF.wellen.push({x,y,t:0,el})}
// Ein Pferd erreicht den Apfel: das erste nascht ihn (3 Sekunden) und freut sich
function apfelDa(h){const A=HF.apfel;if(A&&A.lande&&A.weg==null&&Math.abs(h.x-A.x)<20){A.weg=3;herzen([h]);if(S.snd!==0)neigh(h.st)}}
// Quaken: ein lautes "Quaaak" per Web Audio (keine Audiodatei, kein Netzwerk), aufgebaut wie eine Stimme:
// knarzender Grundton (Sägezahn mit schnellen Lautstärke-Pulsen) durch drei Resonanzfilter (Formanten), die von "u" nach "a" wandern,
// davor ein kurzes Rauschen für das "Q". QV = Gesamtlautstärke (per Messung so eingestellt, dass nichts übersteuert).
const QV=.75;
function quak(){if(S.snd===0)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();
 const t=AC.currentTime+.02,T=.5,o=AC.createOscillator(),puls=AC.createOscillator(),pg=AC.createGain(),src=AC.createGain(),aus=AC.createGain(),lp=AC.createBiquadFilter();
 // Grundton: setzt tief ein, steigt zum "a" und sinkt am Ende ab
 o.type='sawtooth';o.frequency.setValueAtTime(70,t);o.frequency.linearRampToValueAtTime(115,t+.12);o.frequency.linearRampToValueAtTime(100,t+.32);o.frequency.exponentialRampToValueAtTime(60,t+T);
 // Knarzen: 32 Pulse pro Sekunde in der Lautstärke
 puls.type='square';puls.frequency.value=32;pg.gain.value=.45;src.gain.value=.55;puls.connect(pg);pg.connect(src.gain);o.connect(src);
 // Formanten [Start, Mitte, Ende, Schärfe, Anteil]: "u" -> "a" -> leicht "o"
 [[300,750,620,6,1],[900,1500,1150,8,.7],[2300,2600,2400,9,.25]].forEach(([a,b,c,q,gn])=>{const f=AC.createBiquadFilter(),g=AC.createGain();f.type='bandpass';f.Q.value=q;
  f.frequency.setValueAtTime(a,t);f.frequency.linearRampToValueAtTime(b,t+.1);f.frequency.linearRampToValueAtTime(c,t+T);g.gain.value=gn;src.connect(f);f.connect(g);g.connect(aus)});
 // Lautstärke: kurzer Einsatz, langes "aaa", weiches Ende
 aus.gain.setValueAtTime(0,t);aus.gain.linearRampToValueAtTime(2.2*QV,t+.04);aus.gain.linearRampToValueAtTime(3*QV,t+.12);aus.gain.setValueAtTime(3*QV,t+.34);aus.gain.linearRampToValueAtTime(0,t+T);
 lp.type='lowpass';lp.frequency.value=3500;aus.connect(lp);lp.connect(AC.destination);
 // "Q": kurzes, abklingendes Rauschen
 const n=AC.createBufferSource(),b=AC.createBuffer(1,Math.round(AC.sampleRate*.03),AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
 const nf=AC.createBiquadFilter(),ng=AC.createGain();n.buffer=b;nf.type='bandpass';nf.frequency.value=1800;nf.Q.value=1.5;ng.gain.value=.5*QV;n.connect(nf);nf.connect(ng);ng.connect(AC.destination);n.start(t-.015);
 [o,puls].forEach(x=>{x.start(t);x.stop(t+T+.05)})}catch(e){}}
// Animation kurz laufen lassen, auch wenn der Hintergrund ruhig gestellt ist (nicht bei "Bewegung reduzieren")
function hofKick(s){if(RM)return;HF.bis=Math.max(HF.bis,performance.now()+s*1000);if(!HF.raf){HF.last=performance.now();HF.raf=requestAnimationFrame(hofFrame)}}
// Antippen eines Gegenstands auf dem Hof des Kindes (gesperrt, solange erst wieder gerechnet werden muss)
function hofAkt(a,el){if(HF.kind!='kid')return;const k=kid();if(!k||k.hl)return;
 if(a=='baum1'){if(HF.apfel)return;const x=itemX('baum1'),ox=[-8,6,-14,12,0][R(0,4)];
  HF.hap.insertAdjacentHTML('beforeend',APFEL);
  HF.apfel={x:x+ox,y:GY-34,vy:0,y1:140,lande:0,weg:null,el:HF.hap.lastElementChild}}
 else if(a=='windrad')HF.wb=1;
 else if(a=='teich'){const x=itemX('teich');welle(x+R(-12,12),GY+23);
  if(!HF.frosch&&Math.random()<.25){HF.hap.insertAdjacentHTML('beforeend',FROSCH);HF.frosch={x,t:0,q:0,el:HF.hap.lastElementChild}}}
 // Heuballen (seit 2026-10-21): zu 20 % flitzen drei Mäuse heraus, wuseln kurz und verschwinden hinter dem Heu. Sonst raschelt der Ballen.
 else if(a=='heu'){if(HF.maeuse){hofKick(1);return}if(RM)return;const x=itemX('heu');
  if((HF.zTest!=null?HF.zTest:Math.random())<.2)HF.maeuse=[0,1,2].map(i=>{HF.hap.insertAdjacentHTML('beforeend',MAUS);const d=[-1,1,i%2?1:-1][i];
   return{x0:x+d*(6+i*3),y0:GY+15,x1:x+d*(18+R(0,16)),y1:GY+19+R(0,8),t:-i*.15,el:HF.hap.lastElementChild}});
  else if(el){el.classList.remove('raschel');void el.getBBox();el.classList.add('raschel');setTimeout(()=>el.classList.remove('raschel'),700)}}
 // Stall (seit 2026-10-21): das Tor geht auf, die Stallkatze läuft ein Stück auf die Wiese, putzt sich und geht zurück, das Tor schließt sich
 else if(a=='stall'){if(HF.katze){hofKick(1);return}if(RM)return;const x=itemX('stall');HF.hap.insertAdjacentHTML('beforeend',KATZE);
  HF.katze={x0:x,y0:GY+9,x1:x+R(-22,22),y1:GY+27,t:0,el:HF.hap.lastElementChild}}
 else if(a=='mist'&&el){const id=+el.dataset.id;HF.mist=HF.mist.filter(m=>m.id!=id);el.remove();herzen(HF.horses)}
 hofKick(a=='baum1'||a=='stall'?9:5);if(!HF.run)hofDraw(0)}
// Wird bei jedem Bild aus hofDraw aufgerufen
function hofSpass(dt){
 // Windrad: dreht sich normal einmal in 7 Sekunden, nach dem Antippen etwa 4 Sekunden lang viel schneller
 HF.wb=Math.max(0,HF.wb-dt*.25);HF.wa=(HF.wa+dt*(360/7)*(1+HF.wb*12))%360;
 if(HF.wrad)HF.wrad.setAttribute('transform',`rotate(${HF.wa.toFixed(1)})`);
 // Wetterfahne auf dem Stall: wirbelt mit, solange das Windrad schnell ist, und pendelt sich danach wieder ein
 if(HF.wb>0)HF.fa+=dt*HF.wb*1500;else HF.fa+=(Math.round(HF.fa/180)*180-HF.fa)*Math.min(1,dt*3);
 if(HF.wfahne){const x=+HF.wfahne.dataset.x,c=Math.cos(HF.fa*Math.PI/180);HF.wfahne.setAttribute('transform',`matrix(${c.toFixed(3)} 0 0 1 ${(x-c*x).toFixed(2)} 0)`)}
 // Apfel fällt, landet, die Pferde rennen hin, das erste nascht ihn
 const A=HF.apfel;
 if(A){if(dt>0){if(!A.lande){A.vy+=320*dt;A.y+=A.vy*dt;if(A.y>=A.y1){A.y=A.y1;A.lande=1;HF.horses.forEach(h=>{if(h.ko|0)return;h.ziel=A.x+(Math.random()-.5)*16;h.dd=Math.random()*.25;h.joy=0})}}
   else if(A.weg!=null){A.weg-=dt;if(A.weg<=0){A.el.remove();HF.apfel=null}}
   // Sicherung: Kommt kein Pferd an (z. B. weil es vorher angetippt wurde), verschwindet der Apfel nach 12 Sekunden
   else if((A.alt=(A.alt||0)+dt)>12)A.weg=1}
  if(HF.apfel)A.el.setAttribute('transform',`translate(${r1(A.x)} ${r1(A.y)}) scale(${A.weg!=null?Math.max(.2,A.weg/3).toFixed(2):1})`)}
 // Frosch: springt aus dem Teich aufs Seerosenblatt, quakt, springt zurück
 const F=HF.frosch;
 if(F){if(dt>0)F.t+=dt;const x0=F.x-8,y0=GY+24,x1=F.x+14,y1=GY+25.6;let fx=x1,fy=y1,re=1;
  if(F.t<.5){const p=F.t/.5;fx=x0+(x1-x0)*p;fy=y0+(y1-y0)*p-16*Math.sin(Math.PI*p)}
  else if(F.t<1.8){if(!F.q){F.q=1;quak()}}
  else if(F.t<2.3){const p=(F.t-1.8)/.5;re=-1;fx=x1+(x0-x1)*p;fy=y1+(y0-y1)*p-12*Math.sin(Math.PI*p)}
  else{F.el.remove();HF.frosch=null;welle(x0,y0)}
  if(HF.frosch){F.el.setAttribute('transform',`translate(${r1(fx)} ${r1(fy)}) scale(${re*2.2} 2.2)`);const kh=F.el.querySelector('.kehle');kh.setAttribute('opacity',F.t>.55&&F.t<1?'1':'0');kh.setAttribute('r',F.t>.55&&F.t<1?(1.4+Math.sin((F.t-.55)*20)*.4).toFixed(2):'1.4')}}
 // Stallkatze: Tor auf (0 bis 0,5 s), hinauslaufen (bis 2,5 s), sitzen und putzen (bis 5,5 s), zurücklaufen (bis 7,5 s), Tor zu (bis 8 s)
 const K=HF.katze;
 if(K){if(dt>0)K.t+=dt;const t=K.t,lauf=(p,a,b)=>a+(b-a)*p;let kx=K.x0,ky=K.y0,dir=K.x1>=K.x0?1:-1,sitz=0,sicht=1,tor=0;
  if(t<.5)tor=t/.5,sicht=0;
  else if(t<2.5){const p=(t-.5)/2;kx=lauf(p,K.x0,K.x1);ky=lauf(p,K.y0,K.y1);tor=1}
  else if(t<5.5){kx=K.x1;ky=K.y1;sitz=1;tor=1}
  else if(t<7.5){const p=(t-5.5)/2;kx=lauf(p,K.x1,K.x0);ky=lauf(p,K.y1,K.y0);dir=-dir;tor=1}
  else if(t<8){tor=1-(t-7.5)/.5;sicht=0}
  else{K.el.remove();HF.katze=null;tor=0}
  (HF.stor||[]).forEach(g=>{const hx=+g.dataset.x,c=1-.82*tor;g.setAttribute('transform',tor?`matrix(${c.toFixed(3)} 0 0 1 ${(hx-c*hx).toFixed(2)} 0)`:'')});
  if(HF.katze){const sc=1.2+.4*(ky-GY-9)/18,lf=!sitz&&sicht&&(t>.5&&t<2.5||t>5.5&&t<7.5);
   K.el.setAttribute('transform',`translate(${r1(kx)} ${r1(ky+(lf?-Math.abs(Math.sin(t*14))*.4:0))}) scale(${(dir*sc).toFixed(2)} ${sc.toFixed(2)})`);K.el.setAttribute('opacity',sicht?'1':'0');
   K.el.querySelector('.kb').setAttribute('d',lf&&Math.sin(t*14)>0?'M-3.3 -1.4l-.5 1.4M-1 -1.4l.5 1.4M1.1 -1.4l-.5 1.4M3.4 -1.4l.5 1.4':sitz?'M-3.4 -1v1M-2.2 -1v1M1.5 0L1.9 -4.4M2.6 0L2.9 -4.6':'M-2.8 -1.4v1.4M-1.4 -1.4v1.4M1.6 -1.4v1.4M3 -1.4v1.4');
   K.el.querySelector('.kr').setAttribute('transform',sitz?'rotate(-28 -3 -1.2)':'');
   K.el.querySelector('.kk').setAttribute('transform',sitz?`translate(-1.6 ${(-2.6+Math.max(0,Math.sin(t*5))*1.3).toFixed(2)})`:'');
   K.el.querySelector('.ks').setAttribute('transform',`rotate(${(Math.sin(t*(sitz?2.5:6))*14).toFixed(1)} -4 -3.4)`)}}
 // Mäuse: flitzen aus dem Heu (0,7 s), wuseln kurz (0,5 s), flitzen zurück (0,6 s) und verschwinden hinter dem Heu (0,2 s)
 if(HF.maeuse){HF.maeuse=HF.maeuse.filter(m=>{if(dt>0)m.t+=dt;const t=m.t,lauf=(p,a,b)=>a+(b-a)*Math.min(1,Math.max(0,p));let mx=m.x0,my=m.y0,d=m.x1>=m.x0?1:-1,sc=1.7,op=1;
   if(t<0)op=0;else if(t<.7){mx=lauf(t/.7,m.x0,m.x1);my=lauf(t/.7,m.y0,m.y1)}
   else if(t<1.2){mx=m.x1+Math.sin((t-.7)*30)*1.2;my=m.y1;d=Math.sin((t-.7)*12)>0?d:-d}
   else if(t<1.8){mx=lauf((t-1.2)/.6,m.x1,m.x0);my=lauf((t-1.2)/.6,m.y1,m.y0);d=-d}
   else if(t<2){mx=m.x0;my=m.y0;d=-d;op=1-(t-1.8)/.2;sc*=op}
   else{m.el.remove();return false}
   m.el.setAttribute('transform',`translate(${r1(mx)} ${r1(my)}) scale(${(d*sc).toFixed(2)} ${sc.toFixed(2)})`);m.el.setAttribute('opacity',op.toFixed(2));return true});
  if(!HF.maeuse.length)HF.maeuse=null}
 // Wellenringe
 HF.wellen=HF.wellen.filter(w=>{if(dt>0)w.t+=dt;if(w.t>.9){w.el.remove();return false}const r=2+w.t*16;w.el.setAttribute('cx',r1(w.x));w.el.setAttribute('cy',r1(w.y));w.el.setAttribute('rx',r1(r));w.el.setAttribute('ry',r1(r*.3));w.el.setAttribute('opacity',(1-w.t/.9).toFixed(2));return true});
 // Pferdeäpfel: auf dem Hof des Kindes fällt ab und zu einer (höchstens 3 gleichzeitig)
 if(HF.kind=='kid'&&dt>0&&HF.hap){HF.mistT-=dt;if(HF.mistT<=0){HF.mistT=45+Math.random()*45;const k=kid();
  if(k&&!k.hl&&HF.mist.length<3){const h=HF.horses[R(0,HF.horses.length-1)];if(h&&h.sc){const m={id:++HF.mid,x:h.x-h.dir*48*PFS*h.sc,y:h.gy};HF.mist.push(m);HF.hap.insertAdjacentHTML('beforeend',mistSvg(m))}}}}
}
function hofFrame(ts){
 HF.raf=requestAnimationFrame(hofFrame);
 // Ruhiger Hintergrund: nur kurz nach einer Interaktion animieren
 // Katze und Mäuse laufen immer zu Ende (seit 2026-10-21), auch wenn die Bilder auf langsamen Geräten länger brauchen
 if(!HF.run&&ts>HF.bis&&!HF.katze&&!HF.maeuse&&!HF.fuehr){hofStop();return}
 const dt=(ts-HF.last)/1000;if(dt<(HF.iv||.033))return;HF.last=ts;const d=Math.min(dt,.1);HF.t+=d;
 // Sparmodus für langsame Geräte: kommen die Bilder dauerhaft zu spät (unter etwa 24 pro Sekunde),
 // zuerst den Umriss der Pferde weglassen, danach nur noch die halbe Bildrate zeichnen
 HF.sl=dt>(HF.iv||.033)*1.25?(HF.sl||0)+1:Math.max(0,(HF.sl||0)-1);
 if(HF.sl>40){HF.sl=0;if(!HF.spar){HF.spar=1;document.getElementById('hof').classList.add('ohneUmriss')}else if(!HF.iv)HF.iv=.066}
 const span=HF.WW-HF.W;
 if(HF.mode=='fly'){if(HF.drag){}else if(HF.idle>0)HF.idle-=d;else{HF.cam+=HF.cv*d;if(HF.cam<=0){HF.cam=0;HF.cv=Math.abs(HF.cv)}if(HF.cam>=span){HF.cam=span;HF.cv=-Math.abs(HF.cv)}}}
 else{const sh=(HF.WK||HF.WW)-HF.W;HF.cam=(HF.OX||0)+sh/2+Math.sin(HF.t/45)*Math.min(110,sh/2)}
 hofDraw(d)}
function hofStop(){if(HF.raf)cancelAnimationFrame(HF.raf);HF.raf=0}
function hofRun(){
 const still=S.calm||RM;HF.run=!still||(HF.mode=='fly'&&!RM);
 // Gras im Wind (CSS-Animation) nur, solange der Hintergrund läuft
 $('#hof').classList.toggle('ruhig',!HF.run);const we=document.getElementById('hwetter');if(we)we.classList.toggle('ruhig',!HF.run);
 if(HF.run){if(!HF.raf){HF.last=performance.now();HF.raf=requestAnimationFrame(hofFrame)}}else if((HF.katze||HF.maeuse||HF.fuehr)&&!RM)hofKick(1);else{hofStop();hofDraw(0)}}
// Wird nach jeder Änderung der Ansicht aufgerufen (aus ui()).
function hofSync(force){
 const svg=$('#hof'),root=document.documentElement.style,fly=HF.mode=='fly',show=fly||['home','choose','figur','kid','wish','rassen','done','einladen','besuch'].includes(v);
 document.body.classList.toggle('nohof',!show);
 if(!show){hofStop();const we=document.getElementById('hwetter');if(we)we.classList.add('ruhig');svg.style.display='none';root.setProperty('--wh','0px');return}
 svg.style.display='block';root.setProperty('--wh',(fly?0:Math.max(210,Math.min(360,Math.round(innerHeight*.34))))+'px');
 const k=(v=='kid'||v=='wish'||v=='rassen'||v=='done'||v=='einladen')?kid():null,kind=k&&k.h?'kid':'home';
 const sig=kind=='kid'?(()=>{const H=hh(k);return[k.id,H.coat,stg(k),H.bl,H.so,H.bf,H.sm,H.fs,H.ma,H.coats.join(),Object.keys(H.it).join(),H.lp.join('+'),JSON.stringify(H.ko),drinnen(H),!!(H.au&&H.au.pdecke),k.h2?[k.h2.name,k.h2.coat,k.h2.st,k.h2.bl,k.h2.so,k.h2.ma].join('/'):'',JSON.stringify(k.bs||[])].join()})():S.kids.map(x=>x.h?[x.id,x.h.coat,stg(x),x.h.bf,x.h.sm,x.h.fs,x.h.bl,x.h.so,x.h.ma,x.h2?x.h2.coat+x.h2.st:''].join():'').join(';');
 const fsig=S.kids.map(x=>x.f?[x.id,x.f.g,x.f.hf,x.f.ha,x.f.lg,x.f.sh].join(''):'').join();
 const key=[kind,sig,fsig,pal(new Date().getHours()).n,wetter(),kind=='home'?thema():'',fly,S.calm|0,RM,svg.clientWidth,svg.clientHeight].join('|');
 // Führen (Unterstand/Stall): Der erste Abgleich nach dem Start merkt sich den Schlüssel. Ändert sich währenddessen etwas anderes
 // (Ansicht, Kauf, Pferd gewechselt, Wachstum), wird abgebrochen und neu aufgebaut, der Zustand ist ja schon gespeichert.
 if(HF.fuehr&&!force){if(HF.fuehr.key==null)HF.fuehr.key=key;if(key==HF.fuehr.key)return hofRun()}
 if(HF.keyNeu){const passt=HF.keyNeu===key;HF.keyNeu=0;if(passt)HF.key=key}// nach dem Herausholen: nur übernehmen, wenn der Hof noch derselbe ist
 if(force||key!=HF.key){HF.key=key;hofBuild(kind)}
 hofRun()}
function hofTap(h){
 h.joy=1.2;h.state='stand';h.t=1.5;if(S.snd!==0)neigh(h.st);
 HF.tag={h,t:2.6};
 herzen([h]);
 if(!HF.run)hofDraw(0)}
function hofPet(){const h=HF.horses.find(x=>x.own);if(h)hofTap(h)}
function flyOn(){HF.mode='fly';HF.cv=24;HF.idle=0;document.body.classList.add('fly');$('#fly').hidden=false;hofSync(true)}
function flyOff(){HF.mode='bg';document.body.classList.remove('fly');$('#fly').hidden=true;hofSync(true);if(typeof itBilder=='function')itBilder()}
// Eingaben: Tippen auf ein Pferd, im Rundflug zusätzlich Wischen zum Umschauen
(()=>{
 const svg=document.getElementById('hof');if(!svg)return;
 svg.addEventListener('pointerdown',e=>{
  const g=e.target.closest&&e.target.closest('.hs'),h=g?HF.horses[+g.dataset.i]:null,a=!h&&e.target.closest?e.target.closest('[data-act]'):null;
  // Figuren winken beim Antippen (eigene und die der anderen Kinder am Zaun)
  const fg=!h&&!a&&e.target.closest?e.target.closest('.fig'):null;
  if(HF.mode=='fly'){HF.drag={x:e.clientX,cam:HF.cam,moved:0,h,a,fg};try{svg.setPointerCapture(e.pointerId)}catch(_){}}
  else if(h)hofTap(h);else if(a)hofAkt(a.dataset.act,a);else if(fg)winken(fg)});
 svg.addEventListener('pointermove',e=>{const d=HF.drag;if(!d)return;const r=svg.getBoundingClientRect(),k=Math.min(r.width/HF.W,r.height/WH),dx=e.clientX-d.x;d.moved=Math.max(d.moved,Math.abs(dx));
  HF.cam=Math.min(HF.WW-HF.W,Math.max(0,d.cam-dx/k));if(!HF.raf)hofDraw(0)});
 svg.addEventListener('pointerup',()=>{const d=HF.drag;if(!d)return;HF.drag=null;HF.idle=3;if(d.moved<6){if(d.h)hofTap(d.h);else if(d.a)hofAkt(d.a.dataset.act,d.a);else if(d.fg)winken(d.fg)}});
 svg.addEventListener('pointercancel',()=>{HF.drag=null});
 let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>hofSync(true),200)});
 addEventListener('keydown',e=>{if(e.key=='Escape'&&HF.mode=='fly')flyOff()});
})();
