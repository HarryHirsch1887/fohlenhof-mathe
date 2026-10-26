// Rechenhof: QR-Code-Erzeuger (seit 2026-10-20), selbst geschrieben, ohne fremde Bibliothek und ohne Internet.
// Verfahren nach der QR-Norm (ISO/IEC 18004): Byte-Modus, Fehlerkorrektur Stufe M (etwa 15 % dürfen fehlen), Versionen 1 bis 15.
// qrMatrix(text) liefert ein Quadrat aus true (dunkel) und false (hell), qrSvg(text, px) ein fertiges SVG mit Ruhezone.
// Aufbau: Daten kodieren -> Reed-Solomon-Fehlerkorrektur je Block -> Blöcke verschränken -> Muster zeichnen ->
// Daten im Zickzack einsetzen -> die Maske mit den wenigsten Strafpunkten wählen -> Format- und Versionsbits.
const QR={
 // Stufe M je Version 1 bis 15: [Fehlerkorrektur-Bytes je Block, Blöcke Gruppe 1, Datenbytes je Block Gruppe 1, Blöcke Gruppe 2, Datenbytes je Block Gruppe 2]
 M:[null,[10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],[16,4,27,0,0],[18,4,31,0,0],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44],
  [30,1,50,4,51],[22,6,36,2,37],[22,8,37,1,38],[24,4,40,5,41],[24,5,41,5,42]],
 // Multiplikation im Galois-Feld GF(256) mit dem Polynom x^8 + x^4 + x^3 + x^2 + 1 (0x11D)
 mul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z},
 // Generatorpolynom (ohne führende 1) für deg Fehlerkorrektur-Bytes
 rsDiv(deg){const r=new Array(deg).fill(0);r[deg-1]=1;let root=1;
  for(let i=0;i<deg;i++){for(let j=0;j<r.length;j++){r[j]=QR.mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=QR.mul(root,2)}return r},
 // Rest der Polynomdivision = Fehlerkorrektur-Bytes
 rsRem(data,div){const r=div.map(()=>0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>{r[i]^=QR.mul(c,f)})}return r},
 // Format-Bits (Stufe M = 0, Maske 0-7) mit BCH-Code und fester Maske 0x5412
 formatBits(mask,ecl=0){const d=(ecl<<3)|mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);return((d<<10)|r)^0x5412},
 // Versions-Bits ab Version 7 (BCH-Code)
 versionBits(v){let r=v;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);return(v<<12)|r},
 // Lage der Ausrichtungsmuster
 align(v,size){if(v==1)return[];const n=Math.floor(v/7)+2,step=Math.floor((v*8+n*3+5)/(n*4-4))*2,r=[6];for(let p=size-7;r.length<n;p-=step)r.splice(1,0,p);return r},
 // Text als UTF-8-Bytes, kleinste passende Version, Datenbytes mit Füllbytes
 daten(text){const by=[...new TextEncoder().encode(text)];
  for(let v=1;v<=15;v++){const t=QR.M[v],cap=t[1]*t[2]+t[3]*t[4],cc=v<10?8:16;if(4+cc+8*by.length>cap*8)continue;
   const bits=[];const put=(val,n)=>{for(let i=n-1;i>=0;i--)bits.push((val>>>i)&1)};
   put(4,4);put(by.length,cc);by.forEach(b=>put(b,8));put(0,Math.min(4,cap*8-bits.length));while(bits.length%8)bits.push(0);
   const d=[];for(let i=0;i<bits.length;i+=8)d.push(bits.slice(i,i+8).reduce((a,b)=>a*2+b,0));for(let p=0xEC;d.length<cap;p^=0xEC^0x11)d.push(p);
   return{v,d}}
  return null},
 // Blöcke bilden, Fehlerkorrektur anhängen, verschränken
 codewoerter(v,d){const [ec,b1,n1,b2,n2]=QR.M[v],div=QR.rsDiv(ec),bl=[];let o=0;
  for(let i=0;i<b1+b2;i++){const n=i<b1?n1:n2,x=d.slice(o,o+n);o+=n;bl.push({x,e:QR.rsRem(x,div)})}
  const r=[],mx=Math.max(n1,n2);for(let i=0;i<mx;i++)bl.forEach(b=>{if(i<b.x.length)r.push(b.x[i])});for(let i=0;i<ec;i++)bl.forEach(b=>r.push(b.e[i]));return r},
 maske:[(x,y)=>(x+y)%2==0,(x,y)=>y%2==0,(x,y)=>x%3==0,(x,y)=>(x+y)%3==0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2==0,
  (x,y)=>x*y%2+x*y%3==0,(x,y)=>(x*y%2+x*y%3)%2==0,(x,y)=>((x+y)%2+x*y%3)%2==0],
 // Strafpunkte einer fertigen Matrix (Regeln der Norm: lange Reihen, 2×2-Flächen, Muster wie Suchmuster, Hell-Dunkel-Verhältnis)
 strafe(m){const n=m.length;let p=0,dunkel=0;
  const reihe=get=>{for(let a=0;a<n;a++){let lauf=1;for(let b=1;b<=n;b++){if(b<n&&get(a,b)==get(a,b-1))lauf++;else{if(lauf>=5)p+=3+lauf-5;lauf=1}}
   for(let b=0;b+10<n+4;b++){const s=k=>(b+k>=0&&b+k<n)?get(a,b+k):false,mu=[1,0,1,1,1,0,1];
    const ok=mu.every((x,k)=>s(k)==!!x);if(ok&&([7,8,9,10].every(k=>!s(k))||[-1,-2,-3,-4].every(k=>!s(k))))p+=40}}};
  reihe((a,b)=>m[a][b]);reihe((a,b)=>m[b][a]);
  for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){const c=m[y][x];if(c==m[y][x+1]&&c==m[y+1][x]&&c==m[y+1][x+1])p+=3}
  m.forEach(r=>r.forEach(c=>{if(c)dunkel++}));p+=10*Math.max(0,Math.ceil(Math.abs(dunkel*20-n*n*10)/(n*n))-1);return p},
 // Komplette Matrix
 matrix(text){const dt=QR.daten(text);if(!dt)return null;const v=dt.v,n=v*4+17,cw=QR.codewoerter(v,dt.d);
  const m=[...Array(n)].map(()=>Array(n).fill(false)),fn=[...Array(n)].map(()=>Array(n).fill(false)),set=(x,y,d)=>{m[y][x]=d;fn[y][x]=true};
  for(let i=0;i<n;i++){set(6,i,i%2==0);set(i,6,i%2==0)}// Taktlinien
  for(const [cx,cy] of [[3,3],[n-4,3],[3,n-4]])for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy,d=Math.max(Math.abs(dx),Math.abs(dy));if(x>=0&&x<n&&y>=0&&y<n)set(x,y,d!=2&&d!=4)}// Suchmuster
  const al=QR.align(v,n),L=al.length;for(let i=0;i<L;i++)for(let j=0;j<L;j++){if((i==0&&j==0)||(i==0&&j==L-1)||(i==L-1&&j==0))continue;
   for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(al[i]+dx,al[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!=1)}// Ausrichtungsmuster
  const format=mask=>{const b=QR.formatBits(mask),g=i=>((b>>>i)&1)==1;
   for(let i=0;i<=5;i++)set(8,i,g(i));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(let i=9;i<15;i++)set(14-i,8,g(i));
   for(let i=0;i<8;i++)set(n-1-i,8,g(i));for(let i=8;i<15;i++)set(8,n-15+i,g(i));set(8,n-8,true)};
  format(0);
  if(v>=7){const b=QR.versionBits(v);for(let i=0;i<18;i++){const d=((b>>>i)&1)==1,a=n-11+i%3,c=Math.floor(i/3);set(a,c,d);set(c,a,d)}}
  // Daten im Zickzack von rechts unten, je zwei Spalten, die Spalte 6 (Taktlinie) wird übersprungen
  let i=0;for(let r=n-1;r>=1;r-=2){if(r==6)r=5;for(let vt=0;vt<n;vt++)for(let j=0;j<2;j++){const x=r-j,hoch=((r+1)&2)==0,y=hoch?n-1-vt:vt;
   if(!fn[y][x]&&i<cw.length*8){m[y][x]=((cw[i>>>3]>>>(7-(i&7)))&1)==1;i++}}}
  // Beste Maske wählen
  let best=null,bp=1e9;for(let k=0;k<8;k++){const t=m.map((r,y)=>r.map((c,x)=>fn[y][x]?c:c!=QR.maske[k](x,y)));
   const mm=t.map(r=>r.slice());// Format-Bits der Maske k eintragen
   const b=QR.formatBits(k),g=q=>((b>>>q)&1)==1,s=(x,y,d)=>{mm[y][x]=d};
   for(let q=0;q<=5;q++)s(8,q,g(q));s(8,7,g(6));s(8,8,g(7));s(7,8,g(8));for(let q=9;q<15;q++)s(14-q,8,g(q));for(let q=0;q<8;q++)s(n-1-q,8,g(q));for(let q=8;q<15;q++)s(8,n-15+q,g(q));s(8,n-8,true);
   const p=QR.strafe(mm);if(p<bp){bp=p;best=mm}}
  return best}};
const qrMatrix=t=>QR.matrix(t);
// SVG mit 4 Modulen Ruhezone, dunkle Module als ein Pfad (scharf auch beim Vergrößern)
function qrSvg(t,px){const m=QR.matrix(t);if(!m)return'';const n=m.length,g=n+8;let d='';
 m.forEach((r,y)=>r.forEach((c,x)=>{if(c)d+=`M${x+4} ${y+4}h1v1h-1z`}));
 return`<svg class="qr" viewBox="0 0 ${g} ${g}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR-Code"><rect width="${g}" height="${g}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`}
