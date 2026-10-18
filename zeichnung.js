// Pferdehof Mathe: kleine Zeichnungen zu Geometrie-Aufgaben (nur Code, SVG), maßstabsgetreu zu den Zahlen der Aufgabe.
// Eine Aufgabe bringt die Zeichnung als 5. Eintrag mit: [Text, Antwort, Tipp, Lösungsweg, Zeichnung].
// Zeichnung = {t: Art, ...Werte}. Arten: rechteck, ausschnitt, dreieck, rechtwinklig, leiter, gleichschenklig, vieleck, gitter.
// Gesuchte Größen werden mit "?" in Rot beschriftet. Farben kommen aus den CSS-Variablen (hell und dunkel).
// Bildgröße; px/py: Rand links/rechts bzw. oben/unten für Beschriftungen (seitliche Beschriftungen brauchen mehr Platz)
const ZB={w:300,h:200,px:52,py:32};
// Prüft eine gespeicherte Zeichnungsangabe (Fehlerheft, Import): nur bekannte Arten, Zahlen und kurze Texte. Liefert eine saubere Kopie oder null.
const ZARTEN=['rechteck','ausschnitt','dreieck','rechtwinklig','leiter','gleichschenklig','vieleck','gitter'];
function zCheck(z){if(!z||typeof z!=='object'||!ZARTEN.includes(z.t))return null;const o={t:z.t};
 for(const k of ['a','b','c','d','A','B','al','be','n','zerlegt','einzeln','diag','la','lb','lc','innen']){const v=z[k];
  if(typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1000)o[k]=v;else if(typeof v==='string'&&v.length<=24)o[k]=v}
 if(o.t=='vieleck'&&!(o.n>=3&&o.n<=30))return null;return o}
const zf=v=>Math.round(v*10)/10,zE=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Bildet Punkte (y nach oben) auf die Bildfläche ab, mit Rand für die Beschriftungen
function zAbb(pts){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),
 s=Math.min((ZB.w-2*ZB.px)/((x1-x0)||1),(ZB.h-2*ZB.py)/((y1-y0)||1)),ox=(ZB.w-(x1-x0)*s)/2,oy=(ZB.h-(y1-y0)*s)/2;
 return p=>[ox+(p[0]-x0)*s,ZB.h-oy-(p[1]-y0)*s]}
const zMitte=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];
const zPfad=P=>'M'+P.map(p=>zf(p[0])+' '+zf(p[1])).join('L');
const zText=(x,y,t)=>`<text x="${zf(x)}" y="${zf(y)}" class="${String(t).includes('?')?'zr':'zt'}">${zE(t)}</text>`;
// Beschriftung einer Seite: mittig, nach außen versetzt (weg vom Mittelpunkt C der Figur)
function zSeite(a,b,C,t){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;let nx=-(b[1]-a[1]),ny=b[0]-a[0];const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;
 if(nx*(mx-C[0])+ny*(my-C[1])<0){nx=-nx;ny=-ny}const ab=11+Math.abs(nx)*String(t).length*3.6;return zText(mx+nx*ab,my+ny*ab,t)}
// Winkelbogen an der Ecke V zwischen den Nachbarn P und Q. t: Wert innen (z. B. "36°" oder "?"), auf der Winkelhalbierenden,
// bei spitzen Winkeln weiter innen, damit die Zahl nicht über die Linien ragt. name: Bezeichnung (α, β, γ) außen an der Ecke.
function zWinkel(V,P,Q,t,r,name){let u=[P[0]-V[0],P[1]-V[1]],w=[Q[0]-V[0],Q[1]-V[1]];const lu=Math.hypot(...u),lw=Math.hypot(...w),kurz=Math.min(lu,lw);u=[u[0]/lu,u[1]/lu];w=[w[0]/lw,w[1]/lw];
 r=Math.min(r||22,kurz*.28);// bei kurzen Seiten kleinerer Bogen und die Zahl näher an der Ecke, damit sich Beschriftungen nicht treffen
 const a=[V[0]+u[0]*r,V[1]+u[1]*r],b=[V[0]+w[0]*r,V[1]+w[1]*r],cr=u[0]*w[1]-u[1]*w[0],bi=[u[0]+w[0],u[1]+w[1]],lb=Math.hypot(...bi)||1,unk=String(t).includes('?'),
  grad=Math.acos(Math.max(-1,Math.min(1,u[0]*w[0]+u[1]*w[1])))*180/Math.PI,ab=Math.min(r+11+Math.max(0,70-grad)*.45+String(t).length*1.5,kurz*.38);
 return`<path d="M${zf(a[0])} ${zf(a[1])}A${r} ${r} 0 0 ${cr>0?1:0} ${zf(b[0])} ${zf(b[1])}" class="${unk?'zbr':'zb'}"/>`+(t?zText(V[0]+bi[0]/lb*ab,V[1]+bi[1]/lb*ab,t):'')+
  (name?`<text x="${zf(V[0]-bi[0]/lb*15)}" y="${zf(V[1]-bi[1]/lb*15)}" class="zn">${zE(name)}</text>`:'')}
// Zeichen für den rechten Winkel
function zRecht(V,P,Q,s){s=s||11;let u=[P[0]-V[0],P[1]-V[1]],w=[Q[0]-V[0],Q[1]-V[1]];const lu=Math.hypot(...u),lw=Math.hypot(...w);u=[u[0]/lu*s,u[1]/lu*s];w=[w[0]/lw*s,w[1]/lw*s];
 return`<path d="M${zf(V[0]+u[0])} ${zf(V[1]+u[1])}L${zf(V[0]+u[0]+w[0])} ${zf(V[1]+u[1]+w[1])}L${zf(V[0]+w[0])} ${zf(V[1]+w[1])}" class="zl"/><circle cx="${zf(V[0]+(u[0]+w[0])/2)}" cy="${zf(V[1]+(u[1]+w[1])/2)}" r="1.4" class="zp"/>`}
const zSvg=(inhalt,titel)=>`<svg class="zeich" viewBox="0 0 ${ZB.w} ${ZB.h}" role="img" aria-label="${zE(titel)}">${inhalt}</svg>`;

function zeichnung(z){if(!z||typeof z!=='object')return'';try{
 // Rechteck: a lang, b breit. la/lb: Beschriftung (Standard "a cm"), innen: Text in der Mitte, diag: Diagonale mit Beschriftung
 if(z.t=='rechteck'){const m=zAbb([[0,0],[z.a,0],[z.a,z.b],[0,z.b]]),P=[[0,0],[z.a,0],[z.a,z.b],[0,z.b]].map(m),C=zMitte(P);
  return zSvg(`<path d="${zPfad(P)}Z" class="zf"/>`+(z.diag?`<path d="${zPfad([P[0],P[2]])}" class="zl zd"/>`+(()=>{// Beschriftung der Diagonale: 13 Pixel neben der Linie
   const dx=P[2][0]-P[0][0],dy=P[2][1]-P[0][1],l=Math.hypot(dx,dy)||1;return zText((P[0][0]+P[2][0])/2-dy/l*13,(P[0][1]+P[2][1])/2+dx/l*13,z.diag)})():'')+
   zSeite(P[0],P[1],C,z.la||`${z.a} cm`)+zSeite(P[3],P[0],C,z.lb||`${z.b} cm`)+(z.innen?zText(C[0],C[1]+(z.diag?16:0),z.innen):''),'Rechteck')}
 // Rechteck A × B, aus der Ecke oben rechts ist ein Rechteck c × d herausgeschnitten (gestrichelt)
 if(z.t=='ausschnitt'){const{A,B,c,d}=z,m=zAbb([[0,0],[A,0],[A,B],[0,B]]),P=[[0,0],[A,0],[A,B-d],[A-c,B-d],[A-c,B],[0,B]].map(m),Q=[[A-c,B-d],[A,B-d],[A,B],[A-c,B]].map(m),C=zMitte([m([0,0]),m([A,B])]);
  return zSvg(`<path d="${zPfad(P)}Z" class="zf"/><path d="${zPfad(Q)}Z" class="zl zd"/>`+zSeite(P[0],P[1],C,`${A} cm`)+zSeite(P[5],P[0],C,`${B} cm`)+
   zSeite(Q[3],Q[2],C,`${c} cm`)+zSeite(Q[1],Q[2],C,`${d} cm`)+(Math.abs(Q[1][0]-Q[0][0])>34&&Math.abs(Q[0][1]-Q[2][1])>20?zText((Q[0][0]+Q[2][0])/2,(Q[0][1]+Q[2][1])/2,'weg'):''),'Rechteck mit Ausschnitt')}
 // Dreieck mit den Winkeln al (links unten) und be (rechts unten), gesucht ist gamma oben
 if(z.t=='dreieck'){const al=z.al*Math.PI/180,be=z.be*Math.PI/180,ac=Math.sin(be)/Math.sin(al+be),pts=[[0,0],[1,0],[ac*Math.cos(al),ac*Math.sin(al)]],m=zAbb(pts),[A,B,C]=pts.map(m);
  return zSvg(`<path d="${zPfad([A,B,C])}Z" class="zf"/>`+zWinkel(A,B,C,`${z.al}°`,0,'α')+zWinkel(B,C,A,`${z.be}°`,0,'β')+zWinkel(C,A,B,'?',0,'γ'),'Dreieck')}
 // Rechtwinkliges Dreieck: Kathete a waagerecht, Kathete b senkrecht, Hypotenuse dazwischen
 if(z.t=='rechtwinklig'){const m=zAbb([[0,0],[z.a,0],[0,z.b]]),[R0,A,B]=[[0,0],[z.a,0],[0,z.b]].map(m),C=zMitte([R0,A,B]);
  return zSvg(`<path d="${zPfad([R0,A,B])}Z" class="zf"/>`+zRecht(R0,A,B)+zSeite(R0,A,C,z.la)+zSeite(B,R0,C,z.lb)+zSeite(A,B,C,z.lc),'Rechtwinkliges Dreieck')}
 // Leiter an der Wand: Abstand a am Boden, Höhe b an der Wand (gesucht), Leiter c
 if(z.t=='leiter'){const m=zAbb([[-z.a*.15,0],[z.a*1.25,0],[0,z.b*1.12]]),F=m([z.a,0]),W=m([0,z.b]),O=m([0,0]),top=m([0,z.b*1.12]),g0=m([-z.a*.15,0]),g1=m([z.a*1.25,0]),C=zMitte([O,F,W]);
  let spr='';for(let i=1;i<8;i++){const s=i/8,x=F[0]+(W[0]-F[0])*s,y=F[1]+(W[1]-F[1])*s;spr+=`<path d="M${zf(x-4)} ${zf(y-2)}L${zf(x+4)} ${zf(y+2)}" class="zl"/>`}
  return zSvg(`<path d="${zPfad([g0,g1])}" class="zl zdick"/><path d="${zPfad([O,top])}" class="zl zdick"/><path d="${zPfad([F,W])}" class="zleiter"/>${spr}`+zRecht(O,F,W)+
   zSeite(O,F,C,`${z.a} m`)+zSeite(F,W,C,`${z.c} m`)+zSeite(W,O,C,'?'),'Leiter an einer Wand')}
 // Gleichschenkliges Dreieck: Basis 2a, Schenkel c, Höhe b (gesucht, gestrichelt)
 if(z.t=='gleichschenklig'){const m=zAbb([[-z.a,0],[z.a,0],[0,z.b]]),[L,Rr,S,F]=[[-z.a,0],[z.a,0],[0,z.b],[0,0]].map(m),C=zMitte([L,Rr,S]);
  return zSvg(`<path d="${zPfad([L,Rr,S])}Z" class="zf"/><path d="${zPfad([S,F])}" class="zl zd"/>`+zRecht(F,Rr,S,9)+zSeite(L,Rr,C,`${2*z.a} cm`)+zSeite(Rr,S,C,`${z.c} cm`)+zSeite(S,L,C,`${z.c} cm`)+
   zText(F[0]+12,(F[1]+S[1])/2,'?'),'Gleichschenkliges Dreieck')}
 // Regelmäßiges Vieleck mit n Ecken. zerlegt: von einer Ecke in Dreiecke zerlegt, einzeln: ein Winkel gesucht, diag: Diagonalen von einer Ecke
 if(z.t=='vieleck'){const n=z.n,o=-Math.PI/2-Math.PI/n,pts=[...Array(n)].map((_,i)=>[Math.cos(o+2*Math.PI*i/n),Math.sin(o+2*Math.PI*i/n)]),m=zAbb(pts),P=pts.map(m),C=zMitte(P);
  let s=`<path d="${zPfad(P)}Z" class="zf"/>`;
  if(z.zerlegt||z.diag)for(let i=2;i<n-1;i++)s+=`<path d="${zPfad([P[0],P[i]])}" class="zl${z.diag?' zd':''}"/>`;
  const r=n>8?13:17;
  for(let i=0;i<n;i++){const t=z.einzeln&&i==0?'?':'';if(z.zerlegt||z.einzeln)s+=zWinkel(P[i],P[(i+n-1)%n],P[(i+1)%n],t,r)}
  s+=P.map(p=>`<circle cx="${zf(p[0])}" cy="${zf(p[1])}" r="2.6" class="zp"/>`).join('');
  return zSvg(s+zText(C[0],ZB.h-8,`${n} Ecken`),`Vieleck mit ${n} Ecken`)}
 // Gitter mit a Schritten nach rechts und b nach oben, von A (unten links) nach B (oben rechts)
 if(z.t=='gitter'){const m=zAbb([[0,0],[z.a,z.b]]);let s='';
  for(let i=0;i<=z.a;i++)s+=`<path d="${zPfad([m([i,0]),m([i,z.b])])}" class="zl zduenn"/>`;for(let j=0;j<=z.b;j++)s+=`<path d="${zPfad([m([0,j]),m([z.a,j])])}" class="zl zduenn"/>`;
  const A=m([0,0]),B=m([z.a,z.b]);
  return zSvg(s+`<circle cx="${zf(A[0])}" cy="${zf(A[1])}" r="4.5" class="zpa"/><circle cx="${zf(B[0])}" cy="${zf(B[1])}" r="4.5" class="zpa"/>`+zText(A[0]-12,A[1]+10,'A')+zText(B[0]+12,B[1]-10,'B')+
   zText(ZB.w/2,ZB.h-8,'nur nach rechts → oder oben ↑'),'Gitter von A nach B')}
 }catch(e){}return''}
