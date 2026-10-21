// Pferdehof Mathe: gezeichnete Figur (Reiterin oder Reiter) im Bilderbuch-Stil, Ansicht von vorn.
// Füße auf y = 0, Kopf mit Helm oben bei etwa y = -110, Mitte x = 0. Nur Code (SVG), keine Bilddateien.
// Gespeichert am Kind als k.f = {g: 'm' (Mädchen) oder 'j' (Junge), hf: Hautfarbe, ha: Haarfarbe, lg: Farbe der Reitleggings,
// sh: Farbe des Reitshirts, lgs/shs: gekaufte Farben}. Immer dabei: schwarzer Reithelm und Reitstiefel.
// Schwarze Leggings und blaues Shirt hat jeder, weitere Farben gibt es gegen Äpfel (Preise in app.js, PREIS).
const HAUT={hell:['Hell','#f5d5bf','#dcae94'],mittel:['Hellbraun','#d6a07a','#b9825d'],dunkel:['Dunkel','#8a5737','#6c4229']};
const HAAR={blond:['Blond','#ecc96c','#c9a145'],braun:['Braun','#7b4b2b','#5a341c'],schwarz:['Schwarz','#2b2321','#151010'],rot:['Rot','#c4562c','#9a3e1c']};
const LEG={schwarz:['Schwarz','#27272c'],blau:['Dunkelblau','#2c3f68'],grau:['Grau','#80868f'],beige:['Beige','#cdb68f'],rosa:['Rosa','#e48fb1'],lila:['Lila','#7b5aa6']};
const SHIRT={blau:['Blau','#5b8fc7'],weiss:['Weiß','#f3f3ef'],rosa:['Rosa','#ec95b6'],lila:['Lila','#9b7cc8'],gruen:['Grün','#5fa86a'],tuerkis:['Türkis','#3db3ae'],gelb:['Gelb','#f0c64a'],rot:['Rot','#d25a4c']};
const FIGUR0={g:'m',hf:'hell',ha:'braun',lg:'schwarz',sh:'blau'};

function figurBild(f){
 f={...FIGUR0,...(f||{})};
 const hc=(HAUT[f.hf]||HAUT.hell)[1],hs=(HAUT[f.hf]||HAUT.hell)[2],ac=(HAAR[f.ha]||HAAR.braun)[1],as=(HAAR[f.ha]||HAAR.braun)[2],
  lc=(LEG[f.lg]||LEG.schwarz)[1],m=f.g!=='j',sh=(SHIRT[f.sh]||SHIRT.blau)[1],ul='#2b1d12',
  kr=f.sh==='weiss'?'#bcd3e8':'#f4f6f8',// Kragen und Knöpfe: hellblau beim weißen Shirt, sonst weiß
  st=`stroke="${ul}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"`;
 // Arm von der Schulter zur Hand: dunkler Umriss, Haut, darüber der kurze Ärmel
 const arm=d=>`<path d="${d}" fill="none" stroke="${ul}" stroke-width="6.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${hc}" stroke-width="4.6" stroke-linecap="round"/>`;
 const armL='M-11.6 -75Q-15.6 -66 -15.2 -53',armR='M11.6 -75Q15.6 -66 15.2 -53';
 let s=`<ellipse rx="16" ry="2.8" fill="#000" opacity=".15"/>`;
 // Lange Haare hinter Kopf und Schultern (Mädchen)
 if(m)s+=`<path d="M-13 -97Q-17.5 -80 -14.5 -64Q-8 -59.5 0 -60.5Q8 -59.5 14.5 -64Q17.5 -80 13 -97Z" fill="${ac}" ${st}/><path d="M-10 -70Q-11 -78 -10.5 -86M10 -70Q11 -78 10.5 -86" stroke="${as}" stroke-width="1" fill="none"/>`;
 // Reitleggings und Reitstiefel
 s+=`<g ${st}><path d="M-8.6 -50L-8.2 -21H-2.6L-2.1 -50Z" fill="${lc}"/><path d="M8.6 -50L8.2 -21H2.6L2.1 -50Z" fill="${lc}"/>`+
  `<path d="M-8.7 -25H-2.2V-2.8Q-2.2 0 -5 0H-11.2Q-12.8 0 -12.5 -1.7Q-11.8 -4.2 -8.7 -4.8Z" fill="#2a2420"/><path d="M8.7 -25H2.2V-2.8Q2.2 0 5 0H11.2Q12.8 0 12.5 -1.7Q11.8 -4.2 8.7 -4.8Z" fill="#2a2420"/></g>`+
  `<path d="M-8.2 -22.6H-2.6M8.2 -22.6H2.6" stroke="#4a3f38" stroke-width="1.3"/><path d="M-6.6 -16V-6M6.6 -16V-6" stroke="#fff" stroke-width=".9" opacity=".18"/>`;
 // Hals, Oberkörper (Reitshirt mit Kragen), Gürtel
 s+=`<rect x="-3.3" y="-84" width="6.6" height="7" fill="${hc}" ${st}/>`+
  `<path d="M-12.6 -78.5Q0 -81.5 12.6 -78.5L13 -74Q11 -62 10.2 -49H-10.2Q-11 -62 -13 -74Z" fill="${sh}" ${st}/>`+
  `<path d="M-12.4 -78Q-13.2 -72 -12.2 -67" stroke="#fff" stroke-width="1" opacity=".25" fill="none"/>`+
  `<rect x="-10.4" y="-52.4" width="20.8" height="3.4" fill="#6b4a2b" ${st}/><rect x="-1.8" y="-52.8" width="3.6" height="4.2" rx=".6" fill="#d9b25a" stroke="${ul}" stroke-width=".6"/>`+
  `<path d="M-5.4 -80L0 -73.6L5.4 -80Q0 -78.6 -5.4 -80Z" fill="${kr}" ${st}/><circle cy="-70.5" r=".7" fill="${kr}"/><circle cy="-66.5" r=".7" fill="${kr}"/>`;
 // Arme mit Händen. Der rechte Arm (Ärmel und Hand) ist eine eigene Gruppe: Beim Antippen dreht er sich um die Schulter (11.6, -75)
 // nach oben und winkt (seit 2026-10-19, siehe winken() unten). Ohne Winken sieht die Figur aus wie vorher.
 // Ärmel (seit 2026-10-20 mit Rand): genau das obere Stück der Armkurve (Teilung der Kurve bei 45 %), etwas breiter als der Arm
 const aermel=d=>`<path d="${d}" fill="none" stroke="${ul}" stroke-width="7.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sh}" stroke-width="5.2" stroke-linecap="round"/>`,hand=x=>`<circle cx="${x}" cy="-51.6" r="2.9" fill="${hc}" ${st}/>`;
 s+=arm(armL)+aermel('M-11.6 -75Q-13.4 -70.95 -14.31 -66.09')+hand(-15.2)+
  `<g class="winkarm">${arm(armR)+aermel('M11.6 -75Q13.4 -70.95 14.31 -66.09')+hand(15.2)}<animateTransform attributeName="transform" type="rotate" values="0 11.6 -75;-145 11.6 -75;-118 11.6 -75;-150 11.6 -75;-120 11.6 -75;-148 11.6 -75;-125 11.6 -75;0 11.6 -75" keyTimes="0;.16;.3;.44;.58;.72;.84;1" dur="2s" begin="indefinite" fill="remove"/></g>`;
 // Kurze Haare im Nacken, hinter Kopf und Ohren (Junge)
 if(!m)s+=`<path d="M-13.6 -97Q-15.2 -88 -11 -84.6L11 -84.6Q15.2 -88 13.6 -97Z" fill="${ac}" ${st}/>`;
 // Kopf mit Ohren
 s+=`<circle cx="-11.8" cy="-92" r="2.5" fill="${hc}" ${st}/><circle cx="11.8" cy="-92" r="2.5" fill="${hc}" ${st}/>${m?`<circle cy="-93" r="12" fill="${hc}" ${st}/>`:`<ellipse cy="-92.8" rx="12.5" ry="11.9" fill="${hc}" ${st}/>`}`;
 // Haare vorn: Strähnen neben dem Gesicht (Mädchen) bzw. kurze Koteletten (Junge)
 s+=m?`<path d="M-12.6 -99Q-14.2 -90 -11.8 -82.5L-9.6 -85Q-10.6 -92 -9 -99.5Z" fill="${ac}" ${st}/><path d="M12.6 -99Q14.2 -90 11.8 -82.5L9.6 -85Q10.6 -92 9 -99.5Z" fill="${ac}" ${st}/>`
  :`<path d="M-12.8 -99Q-13.6 -93 -12 -88.6L-9.4 -91Q-10 -96 -8.4 -99.6Z" fill="${ac}" ${st}/><path d="M12.8 -99Q13.6 -93 12 -88.6L9.4 -91Q10 -96 8.4 -99.6Z" fill="${ac}" ${st}/>`+
   `<path d="M-10.4 -94.4Q-9.4 -91.6 -7.6 -93.6Q-6.6 -91.8 -5.4 -94.2ZM10.4 -94.4Q9.4 -91.6 7.6 -93.6Q6.6 -91.8 5.4 -94.2Z" fill="${ac}" stroke="${ul}" stroke-width=".7" stroke-linejoin="round"/>`;
 // Gesicht (Augenbrauen gehen nicht, sie lägen unter dem Helmschirm)
 // Mädchen: große Augen mit Wimpern, rosige Wangen, feines Lächeln
 // Junge: kleinere runde Augen, breites Grinsen mit Zähnen, Sommersprossen, kaum Wangenröte
 const nase=`<path d="M.2 -89.6q.9 1.2 -.2 1.9" stroke="${hs}" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
 // Blinzeln (seit 2026-10-21): Die Augen schließen sich alle 4 bis 6 Sekunden kurz (SMIL, ca. 0,3 Sekunden). Jede Figur hat ihren eigenen Takt,
 // damit nicht alle gleichzeitig blinzeln. Bei "Bewegung reduzieren" (RM) und "Ruhiger Hintergrund" (S.calm, beides aus app.js) bleiben die Augen offen.
 const bd=(4+Math.random()*2).toFixed(1),bb=(-Math.random()*5).toFixed(1),
  zu=(a,v)=>typeof RM!='undefined'&&RM||typeof S!='undefined'&&S.calm?'':`<animate class="blinzel" attributeName="${a}" values="${v}" keyTimes="0;.94;.97;1" dur="${bd}s" begin="${bb}s" repeatCount="indefinite"/>`;
 s+=m?`<ellipse cx="-4.4" cy="-91.3" rx="1.65" ry="2.1" fill="${ul}">${zu('ry','2.1;2.1;.2;2.1')}</ellipse><ellipse cx="4.4" cy="-91.3" rx="1.65" ry="2.1" fill="${ul}">${zu('ry','2.1;2.1;.2;2.1')}</ellipse><circle cx="-3.9" cy="-92.2" r=".65" fill="#fff">${zu('opacity','1;1;0;1')}</circle><circle cx="4.9" cy="-92.2" r=".65" fill="#fff">${zu('opacity','1;1;0;1')}</circle>`+
   `<path d="M-6 -92.4l-1.3 -.9M-5.8 -91.4l-1.4 -.2M6 -92.4l1.3 -.9M5.8 -91.4l1.4 -.2" stroke="${ul}" stroke-width=".55" stroke-linecap="round"/>`+
   `<circle cx="-7.2" cy="-87.6" r="2.3" fill="#e8787a" opacity=".38"/><circle cx="7.2" cy="-87.6" r="2.3" fill="#e8787a" opacity=".38"/>`+nase+
   `<path d="M-3 -85.1Q0 -82.6 3 -85.1" stroke="#a8454f" stroke-width=".95" fill="none" stroke-linecap="round"/>`
  :`<ellipse cx="-4.6" cy="-91.2" rx="1.3" ry="1.3" fill="${ul}">${zu('ry','1.3;1.3;.15;1.3')}</ellipse><ellipse cx="4.6" cy="-91.2" rx="1.3" ry="1.3" fill="${ul}">${zu('ry','1.3;1.3;.15;1.3')}</ellipse><circle cx="-4.2" cy="-91.7" r=".45" fill="#fff">${zu('opacity','1;1;0;1')}</circle><circle cx="5" cy="-91.7" r=".45" fill="#fff">${zu('opacity','1;1;0;1')}</circle>`+
   `<circle cx="-7.4" cy="-87.4" r="1.9" fill="#e8787a" opacity=".18"/><circle cx="7.4" cy="-87.4" r="1.9" fill="#e8787a" opacity=".18"/>`+
   `<g fill="${hs}" opacity=".9"><circle cx="-7.6" cy="-88.6" r=".42"/><circle cx="-6.2" cy="-87.6" r=".42"/><circle cx="-8.4" cy="-87.2" r=".42"/><circle cx="7.6" cy="-88.6" r=".42"/><circle cx="6.2" cy="-87.6" r=".42"/><circle cx="8.4" cy="-87.2" r=".42"/></g>`+nase+
   `<path d="M-4.2 -85.6Q0 -80.4 4.2 -85.6Z" fill="#7a3b2e" stroke="${ul}" stroke-width=".6" stroke-linejoin="round"/><path d="M-3.6 -85.4Q0 -84.5 3.6 -85.4L3.2 -84.4Q0 -83.7 -3.2 -84.4Z" fill="#fff"/>`;
 // Schwarzer Reithelm mit Schirm, Glanz, Lüftungsschlitzen und Kinnriemen
 s+=`<path d="M-13.7 -93.4Q-14.4 -109.6 0 -110Q14.4 -109.6 13.7 -93.4Q0 -97.6 -13.7 -93.4Z" fill="#1d1d22" ${st}/>`+
  `<path d="M-11.4 -96.6Q0 -99.6 11.4 -96.6Q12.4 -94.3 10.8 -93.8Q0 -95.8 -10.8 -93.8Q-12.4 -94.3 -11.4 -96.6Z" fill="#2e2e34" ${st}/>`+
  `<path d="M-7.4 -105.6Q-1 -108.6 5.6 -106.2" stroke="#fff" stroke-width="1.5" opacity=".3" fill="none" stroke-linecap="round"/><path d="M-3 -101.5v-4M0 -101v-5M3 -101.5v-4" stroke="#3a3a42" stroke-width=".8"/>`+
  `<path d="M-13.2 -93.2Q-11.4 -82.2 0 -80.6Q11.4 -82.2 13.2 -93.2" stroke="#1d1d22" stroke-width=".9" fill="none"/><rect x="-1.2" y="-81.6" width="2.4" height="1.8" rx=".4" fill="#4a4a52"/>`;
 return s}
// Winken (seit 2026-10-19): Figur auf dem Hof oder kleine Figur antippen, dann hebt sie den rechten Arm und winkt.
// Nicht bei "Bewegung reduzieren" (RM aus app.js).
function winken(el){if(typeof RM!='undefined'&&RM)return;const a=el&&el.querySelector('.winkarm animateTransform');if(a&&a.beginElement)try{a.beginElement()}catch(e){}}
