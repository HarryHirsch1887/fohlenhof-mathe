// Pferdehof Mathe: Aufgaben (Generatoren mit Lösungswegen) und Hilfsfunktionen
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),P=a=>a[R(0,a.length-1)];
const gcd=(a,b)=>b?gcd(b,a%b):a,cnt=(a,b,f)=>{let c=0;for(let i=a;i<=b;i++)f(i)&&c++;return c};
const isP=n=>n>1&&cnt(2,Math.sqrt(n)|0,i=>n%i==0)==0,fa=n=>n?n*fa(n-1):1;
const qs=n=>(n+'').split('').reduce((x,y)=>x+ +y,0);
// Aufgaben: jede Funktion bekommt die Stufe d (1-5) und liefert [Text, Antwort, Tipp, Lösungsweg]
const ggtSteps=(x,y)=>{let o=[],t;if(x<y){t=x;x=y;y=t}while(y){o.push(`${x} : ${y} = ${Math.floor(x/y)} Rest ${x%y}`);t=x%y;x=y;y=t}return o.join('\n')};
// Hilfsfunktionen für Texte: f1 = Zahl ohne Rundungsrauschen, sg = Rechenzeichen mit Zahl, pn = Zahl mit Klammer wenn negativ,
// pd = zweistellig, eu = Cent als Euro-Text, de = deutsche Schreibweise (Komma, Minuszeichen)
const f1=x=>+(+x).toFixed(6),sg=v=>v<0?`− ${-v}`:`+ ${v}`,pn=v=>v<0?`(−${-v})`:`${v}`,pd=n=>String(n).padStart(2,'0'),eu=c=>(c/100).toFixed(2),
de=s=>String(s).replace(/(\d)\.(\d)/g,'$1,$2').replace(/(^|[\s(=|])-(\d)/g,'$1−$2').replace(/\^(\d+)/g,(m,z)=>[...z].map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('')).replace(/(^|[^\d,.])1([xy])\b/g,'$1$2');// Minus auch nach "|" (Punkte), Hochzahlen als ¹²³, "1x" als "x"
const TRI=[[3,4,5],[5,12,13],[8,15,17],[7,24,25]],
// TRIK: alle ganzzahligen rechtwinkligen Dreiecke aus diesen Grundformen mit Hypotenuse bis 50 (Vielfache eingeschlossen)
TRIK=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[12,35,37]].flatMap(t=>[...Array(Math.floor(50/t[2]))].map((_,i)=>t.map(z=>z*(i+1)))),COP=[[2,3],[3,4],[3,5],[2,5],[5,6],[4,7],[3,7],[5,8],[7,9],[5,9]];
const T={5:[
['folgen','Zahlenfolgen',d=>{let a=[R(1,9)],k=R(2,9),m=R(2,3),j=R(2,4),i;if(d==5)a.push(R(2,8));
 while(a.length<7){i=a.length-1;let x=a[i];a.push(d==1?x+k:d==2?x+4*k+1:d==3?x+j+i*(k%3+1):d==4?x*m:x+a[i-1])}
 let s=a.pop(),L=a[a.length-1],df=a.slice(1).map((x,q)=>x-a[q]),nd=s-L,
 w=d<3?`Die Zahlen wachsen immer um ${nd}.\n${L} + ${nd} = ${s}`:d==3?`Schau auf die Abstände: ${df.join(', ')}.\nSie werden jedes Mal um ${df[1]-df[0]} größer. Der nächste Abstand ist ${nd}.\n${L} + ${nd} = ${s}`:d==4?`Jede Zahl ist das ${m}-Fache der Zahl davor.\n${L} · ${m} = ${s}`:`Jede Zahl ist die Summe der beiden Zahlen davor.\n${a[a.length-2]} + ${L} = ${s}`;
 return['Welche Zahl kommt als Nächstes?\n'+a.join(', ')+', …',s,d>2?'Schau dir die Abstände oder Verhältnisse der Zahlen an.':'',w]}],
['teil','Teilbarkeit',d=>{let a,b,g,N,l,x,y,z,sm,r;
 if(d==1){a=R(3,9);N=R(5,12)*a+R(0,a-1);x=Math.floor(N/a);return[`Vielfache von ${a} sind ${a}, ${2*a}, ${3*a}, ${4*a} und so weiter. Wie viele davon liegen zwischen 1 und ${N}?`,x,'',`Teile ${N} durch ${a}: ${N} : ${a} = ${x} Rest ${N%a}.\nDer Rest zählt nicht. Es gibt ${x} Vielfache (${a}, ${2*a}, ${3*a}, …, ${x*a}).`]}
 if(d==2){a=P([4,6,8,9,10,12,15]);b=P([5,6,9,14,16,21]);l=a*b/gcd(a,b);return[`Was ist die kleinste Zahl, die durch ${a} und durch ${b} teilbar ist?`,l,'Schreibe die Vielfachen beider Zahlen auf.',`Gesucht ist die kleinste Zahl, die in beiden Einmaleins-Reihen vorkommt (das „kgV“).\nRechne: Produkt : größter gemeinsamer Teiler = ${a} · ${b} : ${gcd(a,b)} = ${a*b} : ${gcd(a,b)} = ${l}.\nProbe: ${l} : ${a} = ${l/a} und ${l} : ${b} = ${l/b}.`]}
 if(d==3){g=R(3,12);a=g*P([4,6,9]);b=g*P([5,7,10,14]);return[`Was ist der größte gemeinsame Teiler von ${a} und ${b}? Gesucht ist die größte Zahl, durch die man ${a} und ${b} ohne Rest teilen kann.`,gcd(a,b),'',`Benutze das Verfahren von Euklid (immer den Rest bilden, bis der Rest 0 ist):\n${ggtSteps(a,b)}\nDer letzte Teiler vor dem Rest 0 ist der größte gemeinsame Teiler: ${gcd(a,b)}.`]}
 if(d==4){a=R(1,9);b=R(0,9);g=R(0,9);sm=a+b+g;r=(9-sm%9)%9;return[`In der Zahl ${a}★${b}${g} fehlt eine Ziffer. Welche Ziffer muss für ★ stehen, damit man die Zahl ohne Rest durch 9 teilen kann? Nimm die kleinste, die passt.`,r,'Eine Zahl ist durch 9 teilbar, wenn ihre Quersumme es ist.',`Eine Zahl ist durch 9 teilbar, wenn ihre Quersumme durch 9 teilbar ist.\nBekannte Ziffern: ${a} + ${b} + ${g} = ${sm}.\n`+(r==0?`${sm} ist schon durch 9 teilbar. Die kleinste passende Ziffer ist ★ = 0.`:`Bis zum nächsten Vielfachen von 9 (${sm+r}) fehlen ${r}. Also ★ = ${r}.`)]}
 a=P([4,6,9]);b=P([5,7,10]);N=R(100,300);l=a*b/gcd(a,b);x=Math.floor(N/a);y=Math.floor(N/b);z=Math.floor(N/l);return[`Wie viele Zahlen von 1 bis ${N} sind durch ${a} oder durch ${b} teilbar? Zahlen, die durch beide teilbar sind, zählen nur einmal.`,cnt(1,N,i=>i%a==0||i%b==0),'Zahlen, die durch beide teilbar sind, nicht doppelt zählen.',`Zähle einzeln und ziehe die doppelt gezählten ab:\nDurch ${a} teilbar: ${N} : ${a} → ${x} Zahlen.\nDurch ${b} teilbar: ${N} : ${b} → ${y} Zahlen.\nDurch beide teilbar (also durch ${l}): ${N} : ${l} → ${z} Zahlen. Die wurden doppelt gezählt.\n${x} + ${y} − ${z} = ${x+y-z}.`]}],
['trick','Rechentricks',d=>{let a,b,n,r;
 if(d==1){r=R(1,3);a=100*R(1,5)-r;b=R(20,90);return[`${a} + ${b} = ?`,a+b,'Runde erst auf und gleiche dann aus.',`Runde ${a} auf ${a+r} auf (es sind ${r} mehr).\n${a+r} + ${b} = ${a+r+b}.\nDie ${r} wieder abziehen: ${a+r+b} − ${r} = ${a+b}.`]}
 if(d==2){b=4*R(3,24);return[`25 · ${b} = ?`,25*b,'25 · 4 = 100',`25 · 4 = 100, also ist 25 ein Viertel von 100.\n${b} : 4 = ${b/4}.\n${b/4} · 100 = ${25*b}.`]}
 // Stufe 3 (seit 2026-10-21): Paare bilden mit kleinen Zahlen. Vorher 1 + … + n mit n von 20 bis 100, zu groß zum Kopfrechnen in Klasse 5 (Testrunde),
 // und bei ungeradem n stimmte der Lösungsweg nicht ("35 : 2 Paare"). Jetzt immer eine gerade Anzahl Zahlen, drei Arten für genug Abwechslung.
 if(d==3){const art=R(0,2);
  if(art==0){n=2*R(5,10);return[`1 + 2 + 3 + … + ${n} = ?`,n*(n+1)/2,'Bilde Paare: erste + letzte Zahl, zweite + vorletzte …',`Bilde Paare: 1 + ${n} = ${n+1}, 2 + ${n-1} = ${n+1}, 3 + ${n-2} = ${n+1} …\nJedes Paar ergibt ${n+1}. Bei ${n} Zahlen gibt es ${n} : 2 = ${n/2} Paare.\n${n/2} · ${n+1} = ${n*(n+1)/2}.`]}
  if(art==1){n=2*R(3,5);return[`2 + 4 + 6 + … + ${2*n} = ?`,n*(n+1),'Bilde Paare: erste + letzte Zahl, zweite + vorletzte …',`Es sind ${n} Zahlen: 2, 4, 6 … ${2*n}.\nBilde Paare: 2 + ${2*n} = ${2*n+2}, 4 + ${2*n-2} = ${2*n+2} …\nJedes Paar ergibt ${2*n+2}. Bei ${n} Zahlen gibt es ${n/2} Paare.\n${n/2} · ${2*n+2} = ${n*(n+1)}.`]}
  r=2*R(3,5);a=R(5,30);b=a+r-1;return[`${a} + ${a+1} + … + ${b} = ?`,(a+b)*r/2,'Bilde Paare: erste + letzte Zahl, zweite + vorletzte …',`Von ${a} bis ${b} sind es ${r} Zahlen.\nBilde Paare: ${a} + ${b} = ${a+b}, ${a+1} + ${b-1} = ${a+b} …\nJedes Paar ergibt ${a+b}. Bei ${r} Zahlen gibt es ${r/2} Paare.\n${r/2} · ${a+b} = ${(a+b)*r/2}.`]}
 if(d==4){a=10*R(2,19);return[`${a-1} · ${a+1} = ?`,a*a-1,'Die Zahl in der Mitte zum Quadrat, minus 1.',`Die Zahl in der Mitte ist ${a}. Es gilt (${a} − 1) · (${a} + 1) = ${a}² − 1.\n${a}² = ${a*a}.\n${a*a} − 1 = ${a*a-1}.`]}
 n=R(10,40);return P([[`1 + 3 + 5 + … + ${2*n-1} = ?`,n*n,'Probiere kleine Fälle: 1, 1+3, 1+3+5 …',`Probiere kleine Fälle: 1 = 1·1, 1 + 3 = 4 = 2·2, 1 + 3 + 5 = 9 = 3·3 …\nDie Summe der ersten ${n} ungeraden Zahlen ist ${n} · ${n} = ${n*n}.`],[`1 − 2 + 3 − 4 + … + ${2*n-1} − ${2*n} = ?`,-n,'Fasse je zwei Zahlen zusammen.',`Fasse je zwei Zahlen zusammen: 1 − 2 = −1, 3 − 4 = −1, 5 − 6 = −1 …\nEs gibt ${n} solche Paare.\n${n} · (−1) = −${n}.`]])}],
['knob','Knobeln & Zählen',d=>{let n,p,L,h,k,t,sq,rows,tot;
 if(d==1){p=R(2,5);L=p*R(5,15);return[`Ein gerader Zaun ist ${L} m lang. Alle ${p} m steht ein Pfosten, auch am Anfang und am Ende. Wie viele Pfosten sind es?`,L/p+1,'Zeichne einen kurzen Zaun.',`${L} m : ${p} m = ${L/p} Abschnitte zwischen den Pfosten.\nAm Ende steht noch ein Pfosten mehr als Abschnitte: ${L/p} + 1 = ${L/p+1}.`]}
 if(d==2){h=R(3,15);k=R(3,12);t=h+k;return[`Auf dem Hof sind Hühner und Kühe: zusammen ${t} Köpfe und ${2*h+4*k} Beine. Wie viele Kühe sind es?`,k,'Was wäre, wenn alle Tiere Hühner wären?',`Angenommen, alle ${t} Tiere wären Hühner: ${t} · 2 = ${2*t} Beine.\nEs sind aber ${2*h+4*k} Beine, also ${2*h+4*k-2*t} zu viel.\nJede Kuh hat 2 Beine mehr als ein Huhn. ${2*h+4*k-2*t} : 2 = ${k} Kühe.`]}
 if(d==3){n=R(6,20);return[`${n} Personen begrüßen sich. Jeder gibt jedem genau einmal die Hand. Wie viele Handschläge gibt es?`,n*(n-1)/2,'Jeder gibt n−1 Hände. Aber jeder Handschlag wird doppelt gezählt.',`Jede Person gibt ${n-1} Handschläge. Bei ${n} Personen sind das ${n} · ${n-1} = ${n*(n-1)}.\nJeder Handschlag wurde dabei zweimal gezählt (von beiden Personen).\n${n*(n-1)} : 2 = ${n*(n-1)/2}.`]}
 // Stufe 4 und 5 seit 2026-10-19 mit mehreren Aufgabentypen (vorher je 7 Varianten, dadurch Wiederholungen in einer Runde)
 const nm=P(['Mia','Lena','Emma','Lea']);
 // Seitenzahlen eines Buchs: Stufe 4 bis Seite 99, Stufe 5 bis Seite 400
 const seiten=N=>{const z2=Math.min(N,99)-9,z3=Math.max(0,N-99),s=9+2*z2+3*z3;return[`Ein Buch hat ${N} Seiten. Wie viele Ziffern muss man drucken, um alle Seitenzahlen von 1 bis ${N} zu schreiben?`,s,'Zähle einstellige, zweistellige und dreistellige Seitenzahlen getrennt.',
  `Seiten 1 bis 9: 9 Seiten mit je 1 Ziffer = 9 Ziffern.\nSeiten 10 bis ${Math.min(N,99)}: ${z2} Seiten mit je 2 Ziffern = ${2*z2} Ziffern.`+(z3?`\nSeiten 100 bis ${N}: ${z3} Seiten mit je 3 Ziffern = ${3*z3} Ziffern.\nZusammen: 9 + ${2*z2} + ${3*z3} = ${s}.`:`\nZusammen: 9 + ${2*z2} = ${s}.`)]};
 if(d==4)return P([
  ()=>{n=R(3,9);rows=[];tot=0;for(let i=1;i<=n;i++){rows.push(`${i}×${i}: ${(n-i+1)**2} Stück`);tot+=(n-i+1)**2}return[`Ein Gitter hat ${n} mal ${n} Kästchen. Wie viele Quadrate findest du darin? Zähle alle Größen mit, auch das ganze Gitter.`,[...Array(n)].reduce((s,_,i)=>s+(i+1)**2,0),'Zähle erst die 1×1-Quadrate, dann die 2×2 …',`Zähle nach Größe getrennt:\n${rows.join('\n')}\nZusammen: ${[...Array(n)].map((_,i)=>(n-i)**2).join(' + ')} = ${tot}.`]},
  ()=>seiten(R(20,99)),
  ()=>{const a=R(8,12),x=R(Math.max(1,25-2*a),15),m=2*a+x;return[`${nm} ist ${a} Jahre alt, ihre Mutter ist ${m}. In wie vielen Jahren ist die Mutter genau doppelt so alt wie ${nm}?`,x,'Der Altersunterschied ändert sich nie.',`Der Altersunterschied bleibt immer gleich: ${m} − ${a} = ${m-a} Jahre.\nDoppelt so alt ist die Mutter, wenn ${nm} genauso alt ist wie dieser Unterschied, also ${m-a} Jahre.\nBis dahin dauert es ${m-a} − ${a} = ${x} Jahre.`]}])();
 return P([
  ()=>{n=R(3,9);rows=[];for(let i=1;i<=n;i++)rows.push(`Hunderterziffer ${i}: Zehner und Einer ergeben zusammen ${n-i}, dafür gibt es ${n-i+1} Möglichkeiten`);return[`Die Quersumme ist die Summe aller Ziffern. Bei 432 ist sie 4 + 3 + 2 = 9. Wie viele dreistellige Zahlen haben die Quersumme ${n}?`,cnt(100,999,i=>qs(i)==n),'Ordne nach der Hunderterziffer.',`Ordne nach der Hunderterziffer:\n${rows.join('\n')}\nZusammen: ${[...Array(n)].map((_,i)=>n-i).join(' + ')} = ${n*(n+1)/2}.`]},
  ()=>seiten(R(100,400)),
  ()=>{const a=R(3,6),b=R(1,a-1),H=R(a+3,20),t=Math.ceil((H-a)/(a-b));return[`Eine Schnecke sitzt unten in einem ${H} m tiefen Brunnen. Tagsüber klettert sie ${a} m hoch, nachts rutscht sie ${b} m zurück. An welchem Tag kommt sie oben an?`,t+1,'Am letzten Tag rutscht sie nicht mehr zurück.',
   `Pro Tag und Nacht schafft sie ${a} − ${b} = ${a-b} m.\nAm letzten Tag klettert sie ${a} m und ist oben. Vorher muss sie also mindestens ${H} − ${a} = ${H-a} m hoch sein.\nNach ${t} Tagen und Nächten ist sie bei ${t} · ${a-b} = ${t*(a-b)} m`+(t>1?`, nach ${t-1} erst bei ${(t-1)*(a-b)} m`:'')+`.\nAlso kommt sie am Tag ${t} + 1 = ${t+1} oben an.`]}])()}],
// Einmaleins (seit 2026-10-22, Brain Dump): kleines 1×1 (Stufe 1 bis 3) und großes 1×1 (Stufe 4 und 5) im Schulstoff Klasse 5.
// Höhere Klassen üben es über "Wiederholen" (dort gibt es die Hälfte der Äpfel, siehe frueherThema in app.js).
// Stufe 1: mal 2, 5 und 10 · Stufe 2: kleines 1×1 gemischt · Stufe 3: Geteilt und Lücken im kleinen 1×1
// Stufe 4: großes 1×1 (11 bis 19 mal 2 bis 9) · Stufe 5: großes 1×1 (11 bis 20) mit Geteilt und Lücken
['ee','Einmaleins',d=>{let a,b,f,y;
 // Rechenweg für f · y im kleinen 1×1 über Aufgaben, die man schon kennt (mal 10, Hälfte, Doppelt, 5 plus Rest)
 const klein=(f,y)=>f==1?`1 · ${y} = ${y}`:f==10?`Mal 10: Hänge eine Null an. 10 · ${y} = ${10*y}`:f==5?`5 · ${y} ist die Hälfte von 10 · ${y} = ${10*y}.\nAlso 5 · ${y} = ${5*y}`:
  f==9?`9 · ${y} = 10 · ${y} − ${y} = ${10*y} − ${y} = ${9*y}`:f>5?`${f} · ${y} = 5 · ${y} + ${f-5} · ${y} = ${5*y} + ${(f-5)*y} = ${f*y}`:
  f==4?`4 · ${y} ist das Doppelte von 2 · ${y} = ${2*y}.\nAlso 4 · ${y} = ${4*y}`:f==3?`3 · ${y} = 2 · ${y} + ${y} = ${2*y} + ${y} = ${3*y}`:`2 · ${y} ist das Doppelte: ${y} + ${y} = ${2*y}`;
 // Welcher Faktor ist der leichte Weg? Reihenfolge: 1, 10, 5, 9, 2, dann die anderen
 const weg=(a,b)=>{const o=[1,10,5,9,2,8,7,6,4,3],[f,y]=o.indexOf(a)<=o.indexOf(b)?[a,b]:[b,a];return(f!==a?`Tauschen ist erlaubt: ${a} · ${b} = ${b} · ${a}\n`:'')+klein(f,y)};
 const gross=(a,b)=>a==20?`20 · ${b} = 2 · ${b} · 10 = ${2*b} · 10 = ${20*b}`:`Zerlege ${a} in 10 + ${a-10}:\n${a} · ${b} = 10 · ${b} + ${a-10} · ${b} = ${10*b} + ${(a-10)*b} = ${a*b}`;
 if(d==1){f=P([2,5,10]);y=R(1,10);[a,b]=R(0,1)?[f,y]:[y,f];return[`${a} · ${b} = ?`,a*b,'Zähle in Schritten, zum Beispiel 5, 10, 15 …',weg(a,b)]}
 if(d==2){a=R(2,9);b=R(2,9);return[`${a} · ${b} = ?`,a*b,'Nimm eine Aufgabe, die du kennst: 5 mal oder 10 mal, und rechne von dort weiter.',weg(a,b)]}
 if(d==3){a=R(2,9);b=R(2,9);return R(0,1)?[`${a*b} : ${a} = ?`,b,`Welche Zahl mal ${a} ergibt ${a*b}?`,`Gesucht ist die Zahl, die mal ${a} genau ${a*b} ergibt.\n${weg(a,b)}\nAlso ${a*b} : ${a} = ${b}`]:
  [`${a} · ? = ${a*b}`,b,`Rechne ${a*b} : ${a}.`,`Die Lücke ist ${a*b} : ${a}.\n${weg(a,b)}\nDie fehlende Zahl ist ${b}.`]}
 a=R(11,d==4?19:20);b=R(2,9);
 if(d==4)return[`${a} · ${b} = ?`,a*b,'Zerlege die große Zahl in 10 und den Rest.',gross(a,b)];
 return P([0,1,2])==0?[`${a} · ${b} = ?`,a*b,'Zerlege die große Zahl in 10 und den Rest.',gross(a,b)]:R(0,1)?[`${a*b} : ${b} = ?`,a,`Welche Zahl mal ${b} ergibt ${a*b}? Probier es mit 10 · ${b} = ${10*b}.`,`Gesucht ist die Zahl, die mal ${b} genau ${a*b} ergibt.\n${gross(a,b)}\nAlso ${a*b} : ${b} = ${a}`]:
  [`${b} · ? = ${a*b}`,a,`Rechne ${a*b} : ${b}. Probier es mit 10 · ${b} = ${10*b}.`,`Die Lücke ist ${a*b} : ${b}. Tauschen ist erlaubt: ${b} · ${a} = ${a} · ${b}\n${gross(a,b)}\nDie fehlende Zahl ist ${a}.`]}],
['rechnen','Rechnen & Rechengesetze',d=>{let a,b,c,e,g,q,t,u,N;
 if(d==1){a=R(10,50);b=R(2,9);c=R(3,12);return[`${a} + ${b} · ${c} = ?`,a+b*c,'Punkt vor Strich.',`Punkt vor Strich: Rechne zuerst die Malaufgabe.\n${b} · ${c} = ${b*c}\n${a} + ${b*c} = ${a+b*c}`]}
 if(d==2){a=R(3,15);b=R(3,15);c=R(2,9);e=R(1,10);return[`(${a} + ${b}) · ${c} − ${e} = ?`,(a+b)*c-e,'Klammern zuerst, dann Punkt vor Strich.',`Klammer zuerst: ${a} + ${b} = ${a+b}\nDann Punkt vor Strich: ${a+b} · ${c} = ${(a+b)*c}\nZuletzt: ${(a+b)*c} − ${e} = ${(a+b)*c-e}`]}
 if(d==3){a=R(3,9);b=R(21,79);c=100-b;return[`${a} · ${b} + ${a} · ${c} = ?`,a*100,'Klammere die gemeinsame Zahl aus.',`Beide Produkte haben den Faktor ${a}. Klammere ihn aus:\n${a} · (${b} + ${c}) = ${a} · 100 = ${a*100}`]}
 if(d==4){a=P([7,8,9,12,13,14,15,16]);q=R(31,98);t=Math.floor(q/10);u=q%10;N=a*q;return[`${N} : ${a} = ?`,q,'Zerlege die Zahl in Zehner und Einer.',`Zerlege in leichte Schritte:\n${a*t*10} : ${a} = ${t*10}\n${a*u} : ${a} = ${u}\n${t*10} + ${u} = ${q}`]}
 a=R(2,9);b=R(3,12);c=R(3,12);g=R(2,9);e=R(2,9);return[`${a} · (${b} + ${c}) − ${e*g} : ${e} = ?`,a*(b+c)-g,'Klammer zuerst, dann Punkt vor Strich.',`Klammer: ${b} + ${c} = ${b+c}\nPunkt vor Strich: ${a} · ${b+c} = ${a*(b+c)} und ${e*g} : ${e} = ${g}\nZuletzt: ${a*(b+c)} − ${g} = ${a*(b+c)-g}`]}],
['groessen','Größen & Einheiten',d=>{let n,c,g,h,m,t1,t2,dep,arr,D,kg;
 if(d==1){n=R(1,9);c=R(5,95);return[`${n} m ${c} cm = ? cm`,n*100+c,'',`1 m = 100 cm, also ${n} m = ${n*100} cm.\n${n*100} cm + ${c} cm = ${n*100+c} cm`]}
 if(d==2){n=R(1,9);g=10*R(5,95);return[`${n} kg ${g} g = ? g`,n*1000+g,'',`1 kg = 1000 g, also ${n} kg = ${n*1000} g.\n${n*1000} g + ${g} g = ${n*1000+g} g`]}
 if(d==3){h=R(1,5);m=R(5,55);return[`${h} h ${m} min = ? min`,60*h+m,'',`1 h = 60 min, also ${h} h = ${60*h} min.\n${60*h} min + ${m} min = ${60*h+m} min`]}
 if(d==4){dep=R(6,15)*60+R(0,59);D=R(40,240);arr=dep+D;t1=`${pd(Math.floor(dep/60))}:${pd(dep%60)}`;t2=`${pd(Math.floor(arr/60))}:${pd(arr%60)}`;return[`Ein Zug fährt um ${t1} Uhr ab und kommt um ${t2} Uhr an. Wie viele Minuten dauert die Fahrt?`,D,'Rechne beide Uhrzeiten in Minuten um.',`Rechne beide Zeiten in Minuten seit Mitternacht um:\n${t1} Uhr = ${dep} min\n${t2} Uhr = ${arr} min\n${arr} − ${dep} = ${D} min`]}
 n=R(3,9);kg=R(1,3);g=10*R(5,90);return[`${n} Pakete wiegen je ${kg} kg ${g} g. Wie viele Gramm wiegen sie zusammen?`,n*(kg*1000+g),'Rechne erst ein Paket in Gramm um.',`1 Paket: ${kg} kg ${g} g = ${kg*1000+g} g\n${n} Pakete: ${n} · ${kg*1000+g} = ${n*(kg*1000+g)} g`]}],
['umfl','Umfang & Fläche',d=>{let a,b,A,B,c,dd;
 if(d==1){a=R(3,15);b=R(3,15);return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang in cm?`,2*(a+b),'',`Umfang = 2 · (Länge + Breite)\n2 · (${a} + ${b}) = 2 · ${a+b} = ${2*(a+b)} cm`,{t:'rechteck',a,b}]}
 if(d==2){a=R(3,15);b=R(3,15);return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist die Fläche in cm²?`,a*b,'',`Fläche = Länge · Breite\n${a} · ${b} = ${a*b} cm²`,{t:'rechteck',a,b}]}
 if(d==3){a=R(3,12);b=R(3,12);return[`Ein Rechteck hat die Fläche ${a*b} cm² und ist ${a} cm lang. Wie groß ist sein Umfang in cm?`,2*(a+b),'Berechne zuerst die Breite.',`Breite = Fläche : Länge = ${a*b} : ${a} = ${b} cm\nUmfang = 2 · (${a} + ${b}) = ${2*(a+b)} cm`,{t:'rechteck',a,b,lb:'?',innen:`${a*b} cm²`}]}
 if(d==4){A=R(8,15);B=R(8,15);c=R(2,A-4);dd=R(2,B-4);return[`Ein Rechteck ist ${A} cm lang und ${B} cm breit. Aus einer Ecke wird ein kleines Rechteck herausgeschnitten, ${c} cm lang und ${dd} cm breit. Wie groß ist die Fläche, die übrig bleibt (in cm²)?`,A*B-c*dd,'Große Fläche minus herausgeschnittene Fläche.',`Große Fläche: ${A} · ${B} = ${A*B} cm²\nHerausgeschnitten: ${c} · ${dd} = ${c*dd} cm²\n${A*B} − ${c*dd} = ${A*B-c*dd} cm²`,{t:'ausschnitt',A,B,c,d:dd}]}
 // Stufe 5 seit 2026-10-19 mit zwei Aufgabentypen (vorher 10 Varianten): 2-, 3- oder 4-mal so lang wie breit, Quadrat mit gleichem Umfang
 if(R(0,1)){const f=R(2,4),w={2:'doppelt',3:'dreimal',4:'viermal'}[f];b=R(3,12);a=f*b;return[`Ein Rechteck ist ${w} so lang wie breit und hat einen Umfang von ${2*(f+1)*b} cm. Wie groß ist seine Fläche in cm²?`,a*b,'Länge + Breite ist der halbe Umfang.',`Länge + Breite = Umfang : 2 = ${(f+1)*b} cm.\nDie Länge ist ${w} so groß wie die Breite, zusammen sind es ${f+1} gleiche Teile: Breite = ${(f+1)*b} : ${f+1} = ${b} cm, Länge = ${a} cm.\nFläche = ${a} · ${b} = ${a*b} cm²`,{t:'rechteck',a,b,la:'?',lb:'?',innen:`Umfang ${2*(f+1)*b} cm`}]}
 do{a=R(4,16);b=R(3,12)}while(a==b||(a+b)%2);c=(a+b)/2;return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Ein Quadrat hat den gleichen Umfang. Wie groß ist die Fläche des Quadrats in cm²?`,c*c,'Berechne erst den Umfang, dann die Seite des Quadrats.',`Umfang des Rechtecks: 2 · (${a} + ${b}) = ${2*(a+b)} cm.\nDas Quadrat hat 4 gleich lange Seiten: ${2*(a+b)} : 4 = ${c} cm.\nFläche des Quadrats: ${c} · ${c} = ${c*c} cm²`,{t:'rechteck',a,b}]}]
],7:[
['gl','Gleichungen & Terme',d=>{let x,y,a,b,c,e,n,s,p;
 if(d==1){x=R(2,12);a=R(2,9);b=R(1,30);return[`Löse: ${a}x + ${b} = ${a*x+b}.   x = ?`,x,'',`Ziehe auf beiden Seiten ${b} ab: ${a}x = ${a*x}.\nTeile durch ${a}: x = ${a*x} : ${a} = ${x}.`]}
 if(d==2){x=R(2,15);a=R(1,5);c=a+R(2,6);e=R(1,20);return[`Löse: ${a}x + ${e+(c-a)*x} = ${c}x + ${e}.   x = ?`,x,'Bringe alle x auf eine Seite.',`Ziehe auf beiden Seiten ${a}x ab: ${e+(c-a)*x} = ${c-a}x + ${e}.\nZiehe auf beiden Seiten ${e} ab: ${(c-a)*x} = ${c-a}x.\nTeile durch ${c-a}: x = ${x}.`]}
 if(d==3){x=R(5,20);y=R(1,x-1);return[`Es gilt x + y = ${x+y} und x − y = ${x-y}. Wie groß ist x · y?`,x*y,'Addiere die beiden Gleichungen.',`Addiere beide Gleichungen: (x + y) + (x − y) = ${x+y} + ${x-y}, also 2x = ${2*x}.\nDann ist x = ${x}. Aus x + y = ${x+y} folgt y = ${x+y} − ${x} = ${y}.\nx · y = ${x} · ${y} = ${x*y}.`]}
 if(d==4){n=R(5,50);return[`Fünf Zahlen folgen direkt aufeinander, zum Beispiel 7, 8, 9, 10, 11. Ihre Summe ist ${5*(n+2)}. Wie heißt die größte?`,n+4,'Die mittlere Zahl ist der Durchschnitt.',`Die mittlere der fünf Zahlen ist der Durchschnitt: ${5*(n+2)} : 5 = ${n+2}.\nDie Zahlen sind ${n}, ${n+1}, ${n+2}, ${n+3}, ${n+4}.\nDie größte ist ${n+4}.`]}
 s=R(5,15);p=R(3,30);return[`Es gilt a + b = ${s} und a · b = ${p}. Wie groß ist a² + b²?`,s*s-2*p,'Quadriere a + b.',`Quadriere a + b: (a + b)² = a² + 2ab + b².\nAlso a² + b² = (a + b)² − 2ab = ${s}² − 2 · ${p}.\n${s*s} − ${2*p} = ${s*s-2*p}.`]}],
['pz','Prozent & Verhältnis',d=>{let p,q,G,n,m,s,s1,e1;
 if(d==1){p=P([5,10,20,25,50]);G=R(2,30)*20;return[`Wie viel sind ${p} % von ${G}?`,G*p/100,'',`${p} % bedeutet ${p} von 100.\n${G} · ${p} : 100 = ${G*p} : 100 = ${G*p/100}.`]}
 if(d==2){G=R(2,20)*20;p=P([10,20,25,30,40]);return[`Ein Pullover kostet ${G} €. Er wird ${p} % billiger. Wie hoch ist der neue Preis in €?`,G*(100-p)/100,'',`${p} % von ${G} € sind ${G} · ${p} : 100 = ${G*p/100} €.\nNeuer Preis: ${G} − ${G*p/100} = ${G*(100-p)/100} €.`]}
 if(d==3){G=200*R(1,10);p=P([20,25,50]);q=P([10,20,40,50]);s1=G*(100+p)/100;e1=G*(100+p)*(100-q)/1e4;return[`Ein Preis von ${G} € steigt um ${p} % und sinkt danach um ${q} %. Wie hoch ist der Endpreis in €?`,e1,'Rechne zwei Schritte nacheinander. Die Prozente heben sich nicht auf.',`Schritt 1: Preis steigt um ${p} %: ${G} · ${100+p} : 100 = ${s1} €.\nSchritt 2: Der neue Preis sinkt um ${q} %. Die ${q} % beziehen sich auf ${s1} €, nicht auf ${G} €: ${s1} · ${100-q} : 100 = ${e1} €.`]}
 if(d==4){G=R(2,20)*20;p=P([10,20,25,50]);return[`Nach einer Erhöhung um ${p} % kostet ein Buch ${G*(100+p)/100} €. Was kostete es vorher (in €)?`,G,'Der alte Preis entspricht 100 %.',`Der alte Preis ist 100 %. Nach der Erhöhung sind es ${100+p} %, also das ${(100+p)/100}-Fache.\nRückwärts rechnen: ${G*(100+p)/100} : ${(100+p)/100} = ${G} €.`]}
 n=20*R(2,8);q=P([20,25,40,50]);p=P([5,10]);s=n*q/100;m=s*100/p;return[`${m} kg Salzlösung enthalten ${p} % Salz. Wie viele kg Wasser müssen verdunsten, damit die Lösung ${q} % Salz enthält?`,m-n,'Die Salzmenge bleibt gleich.',`Salz in der Lösung: ${p} % von ${m} kg = ${s} kg. Diese Menge bleibt beim Verdunsten gleich.\nDanach sind die ${s} kg Salz ${q} % der neuen Lösung. Also wiegt sie ${s} · 100 : ${q} = ${n} kg.\nVerdunstetes Wasser: ${m} − ${n} = ${m-n} kg.`]}],
// Zahlentheorie (seit 2026-10-18 deutlich sanfter, sie war zu schwer):
// Stufe 1 Teiler kleiner Zahlen, 2 Primzahl finden, 3 ggT oder kgV, 4 Teiler größerer Zahlen oder Primzahlen zählen,
// 5 letzte Ziffer einer Potenz oder Nullen am Ende (die früheren schweren Aufgaben, mit kleineren Zahlen)
['zt','Zahlentheorie',d=>{let N,a,b,n,r=1,i,dv,pl,sq,y,L,rm,x,g,z;
 const teiler=N=>{const t=[];for(let i=1;i<=N;i++)N%i==0&&t.push(i);return t},kt=n=>{for(let i=2;i*i<=n;i++)if(n%i==0)return i;return n};
 if(d==1){N=P([6,8,9,10,12,14,15,16,18,20,21,22,25,27,28,30]);dv=teiler(N);return[`Wie viele Teiler hat ${N}? Ein Teiler ist eine Zahl, durch die man ${N} ohne Rest teilen kann. 1 und ${N} zählen mit.`,dv.length,'Probiere 1, 2, 3, … der Reihe nach.',`Prüfe der Reihe nach, durch welche Zahlen man ${N} ohne Rest teilen kann.\nTeiler: ${dv.join(', ')}.\nDas sind ${dv.length} Teiler.`]}
 if(d==2){const pr=[11,13,17,19,23,29,31,37,41,43,47],zu=[9,15,21,25,27,33,35,39,45,49,51,55,57,63];a=P(pr);z=[a];while(z.length<4){x=P(zu);z.includes(x)||z.push(x)}z.sort(()=>Math.random()-.5);
  return[`Nur eine dieser Zahlen ist eine Primzahl: ${z.slice(0,3).join(', ')} und ${z[3]}. Welche ist es? Eine Primzahl kann man nur durch 1 und durch sich selbst ohne Rest teilen.`,a,'Suche bei jeder Zahl einen kleinen Teiler wie 3, 5 oder 7.',`${z.filter(v=>v!=a).map(v=>`${v} = ${kt(v)} · ${v/kt(v)}, also keine Primzahl.`).join('\n')}\n${a} lässt sich nur durch 1 und ${a} teilen. ${a} ist die Primzahl.`]}
 if(d==3){if(R(0,1)){[x,y]=P(COP);g=R(2,8);a=g*x;b=g*y;const ta=teiler(a),tb=teiler(b);
   return[`Was ist der größte gemeinsame Teiler von ${a} und ${b}? Gesucht ist die größte Zahl, durch die man ${a} und ${b} ohne Rest teilen kann.`,g,'Schreibe die Teiler beider Zahlen auf.',`Teiler von ${a}: ${ta.join(', ')}.\nTeiler von ${b}: ${tb.join(', ')}.\nGemeinsam sind ${ta.filter(v=>tb.includes(v)).join(', ')}. Der größte ist ${g}.`]}
  a=R(2,9);b=R(2,12);while(b==a)b=R(2,12);L=a*b/gcd(a,b);const va=[],vb=[];for(i=a;i<=L;i+=a)va.push(i);for(i=b;i<=L;i+=b)vb.push(i);
  return[`Was ist das kleinste gemeinsame Vielfache von ${a} und ${b}? Gesucht ist die kleinste Zahl, die in der ${a}er-Reihe und in der ${b}er-Reihe vorkommt.`,L,'Schreibe beide Einmaleins-Reihen auf.',`${a}er-Reihe: ${va.join(', ')}.\n${b}er-Reihe: ${vb.join(', ')}.\nDie kleinste Zahl in beiden Reihen ist ${L}.`]}
 if(d==4){if(R(0,1)){N=R(30,80);dv=teiler(N);return[`Wie viele Teiler hat ${N}? 1 und ${N} zählen mit.`,dv.length,'Teiler kommen in Paaren: Ist 2 ein Teiler, dann auch die Hälfte der Zahl.',`Teiler kommen in Paaren, deren Produkt ${N} ist.\nTeiler: ${dv.join(', ')}.\nDas sind ${dv.length} Teiler.`]}
  a=R(10,50);b=a+R(10,16);pl=[];for(i=a;i<=b;i++)isP(i)&&pl.push(i);return[`Wie viele Primzahlen gibt es von ${a} bis ${b}? ${a} und ${b} zählen mit.`,pl.length,'Gerade Zahlen und Zahlen mit 5 am Ende fallen weg. Prüfe den Rest auf 3 und 7.',`Gerade Zahlen und Zahlen mit 0 oder 5 am Ende sind keine Primzahlen. Die übrigen prüft man auf 3 und 7.\nPrimzahlen von ${a} bis ${b}: ${pl.length?pl.join(', '):'keine'}.\nDas sind ${pl.length}.`]}
 if(R(0,1)){a=R(2,9);n=R(10,40);for(i=0;i<n;i++)r=r*a%10;sq=[];y=a%10;while(!sq.includes(y)){sq.push(y);y=y*a%10}L=sq.length;rm=n%L||L;return[`Man rechnet ${a} · ${a} · ${a} · … und nimmt die ${a} insgesamt ${n}-mal. Welche Ziffer steht am Ende ganz hinten?`,r,'Die letzten Ziffern wiederholen sich.',`Schreibe die letzten Ziffern der ersten Potenzen auf: ${sq.map((z,j)=>`${a}^${j+1} → ${z}`).join(', ')}.\nDanach beginnt es von vorn (die Folge ist ${L} lang).\n${n} : ${L} = ${Math.floor(n/L)} Rest ${n%L}. Also zählt die ${rm}. Stelle der Folge: ${r}.`]}
 n=R(10,60);return[`Man multipliziert alle Zahlen von 1 bis ${n}: 1 · 2 · 3 · … · ${n}. Mit wie vielen Nullen endet das Ergebnis?`,Math.floor(n/5)+Math.floor(n/25),'Jede Null braucht einen Faktor 2 und einen Faktor 5.',`Jede Null am Ende entsteht aus einem Faktor 2 und einem Faktor 5. Zweier gibt es reichlich, also zählt man die Fünfer.\nVielfache von 5 bis ${n}: ${n} : 5 → ${Math.floor(n/5)}.\nVielfache von 25 enthalten eine zweite 5: ${n} : 25 → ${Math.floor(n/25)}.\n${Math.floor(n/5)} + ${Math.floor(n/25)} = ${Math.floor(n/5)+Math.floor(n/25)}.`]}],
// Seit 2026-10-18 ist "Geometrie & Zählen" aufgeteilt: "Winkel & Vielecke" (Schulstoff Klasse 7) und "Zählen & Wege" (Mathe-Olympiade).
// Alte Spielstände mit dem Thema "geo" werden in app.js (clean) übernommen.
['winkel','Winkel & Vielecke',d=>{let a,b,n,w,sp;
 // Stufe 1: Nebenwinkel an einer geraden Linie
 // beide Winkel mindestens 30°, damit die Zeichnung lesbar bleibt
 if(d==1){w=5*R(6,30);return[`An einer geraden Linie liegen zwei Winkel nebeneinander. Einer ist ${w}° groß. Wie groß ist der andere (in °)?`,180-w,'Eine gerade Linie hat 180°.',`Die beiden Winkel liegen an einer geraden Linie. Zusammen ergeben sie 180°.\n180° − ${w}° = ${180-w}°.`,{t:'nebenwinkel',w}]}
 // Stufe 3: gleichschenkliges Dreieck, der Winkel an der Spitze ist gegeben
 // Spitze 30° bis 100°, sonst wird das Dreieck zu schmal oder zu flach
 if(d==3){sp=2*R(15,50);a=(180-sp)/2;return[`Ein Dreieck hat zwei gleich lange Seiten. Der Winkel an der Spitze ist ${sp}° groß. Die beiden Winkel unten sind gleich groß. Wie groß ist einer davon (in °)?`,a,'Alle drei Winkel zusammen ergeben 180°.',`Alle drei Winkel ergeben zusammen 180°.\nFür die beiden unteren Winkel bleiben 180° − ${sp}° = ${180-sp}°.\nSie sind gleich groß: ${180-sp}° : 2 = ${a}°.`,{t:'dreieck',al:a,be:a,lal:'?',lbe:'',lga:`${sp}°`,nn:1,gleich:1}]}
 // Stufe 2: Dreieck, gamma mindestens 30°, damit die Zeichnung nicht zu schmal wird
 if(d==2){a=R(30,90);b=R(30,Math.min(80,150-a));return[`Ein Dreieck hat die Winkel α = ${a}° und β = ${b}°. Wie groß ist γ (in °)?`,180-a-b,'',`Die Winkel im Dreieck ergeben zusammen 180°.\nγ = 180° − ${a}° − ${b}° = ${180-a-b}°.`,{t:'dreieck',al:a,be:b}]}
 // Stufe 4: Winkelsumme im Vieleck, Stufe 5: ein Winkel im regelmäßigen Vieleck
 // Stufe 4 und 5 seit 2026-10-19 mit drei Aufgabentypen (vorher 5 bis 6 Varianten, dadurch Wiederholungen in einer Runde)
 if(d==4)return P([
  ()=>{n=R(5,10);return[`Eine Figur hat ${n} Ecken. An jeder Ecke ist innen ein Winkel. Wie groß sind alle ${n} Winkel zusammen (in °)?`,(n-2)*180,'Zerlege das Vieleck in Dreiecke.',`Zerlege das ${n}-Eck von einer Ecke aus in Dreiecke. Es sind ${n} − 2 = ${n-2} Dreiecke.\nJedes Dreieck hat 180°: ${n-2} · 180° = ${(n-2)*180}°.`,{t:'vieleck',n,zerlegt:1}]},
  // α doppelt so groß wie β, γ gegeben (β 30° bis 50°, damit γ mindestens 30° hat)
  ()=>{b=R(30,50);const g=180-3*b;return[`In einem Dreieck ist α doppelt so groß wie β. Der Winkel γ ist ${g}° groß. Wie groß ist α (in °)?`,2*b,'α und β bestehen zusammen aus 3 gleichen Teilen.',`α und β zusammen: 180° − ${g}° = ${180-g}°.\nα ist doppelt so groß wie β, zusammen sind das 3 gleiche Teile: β = ${180-g}° : 3 = ${b}°.\nα = 2 · ${b}° = ${2*b}°.`,{t:'dreieck',al:2*b,be:b,lal:'?',lbe:'',lga:`${g}°`}]},
  // gleichschenkliges Dreieck umgekehrt: Winkel unten gegeben, Spitze gesucht (Spitze 30° bis 110°)
  ()=>{a=R(35,75);return[`Ein Dreieck hat zwei gleich lange Seiten. Die beiden Winkel unten sind je ${a}° groß. Wie groß ist der Winkel an der Spitze (in °)?`,180-2*a,'Alle drei Winkel zusammen ergeben 180°.',`Alle drei Winkel ergeben zusammen 180°.\nDie beiden unteren Winkel: 2 · ${a}° = ${2*a}°.\nFür die Spitze bleiben 180° − ${2*a}° = ${180-2*a}°.`,{t:'dreieck',al:a,be:a,lal:`${a}°`,lbe:`${a}°`,lga:'?',nn:1,gleich:1}]}])();
 return P([
  ()=>{n=P([5,6,8,9,10]);return[`Eine Figur hat ${n} Ecken. Alle Seiten sind gleich lang und alle Winkel gleich groß. Wie groß ist ein Winkel (in °)?`,(n-2)*180/n,'',`Summe aller Innenwinkel: (${n} − 2) · 180° = ${(n-2)*180}°.\nBeim regelmäßigen ${n}-Eck sind alle ${n} Winkel gleich groß.\n${(n-2)*180}° : ${n} = ${(n-2)*180/n}°.`,{t:'vieleck',n,einzeln:1}]},
  // Winkel im Verhältnis (alle Winkel ganzzahlig, die beiden kleineren mindestens 30°)
  ()=>{const [p,q,r]=P([[1,2,3],[2,3,4],[3,4,5],[2,3,5],[4,5,6],[2,2,5],[3,5,7],[1,1,4],[3,4,8],[5,6,7],[4,5,9],[3,3,4],[5,5,8]]),s=p+q+r,x=180/s;return[`Die drei Winkel eines Dreiecks stehen im Verhältnis ${p} : ${q} : ${r}. Wie groß ist der größte Winkel (in °)?`,r*x,'Zähle die Teile zusammen. Alle Winkel ergeben 180°.',`Zusammen sind es ${p} + ${q} + ${r} = ${s} gleiche Teile.\nAlle Winkel ergeben 180°. Ein Teil ist 180° : ${s} = ${x}°.\nDer größte Winkel hat ${r} Teile: ${r} · ${x}° = ${r*x}°.`,{t:'dreieck',al:p*x,be:q*x,lal:'',lbe:'',lga:'?'}]},
  // α um x° größer als β, γ gegeben
  ()=>{let x,g;do{b=R(30,60);x=5*R(1,8);g=180-2*b-x}while(g<30);return[`In einem Dreieck ist α um ${x}° größer als β. Der Winkel γ ist ${g}° groß. Wie groß ist α (in °)?`,b+x,'Rechne erst α und β zusammen aus.',`α und β zusammen: 180° − ${g}° = ${180-g}°.\nOhne die ${x}° Unterschied wären beide gleich groß: ${180-g}° − ${x}° = ${180-g-x}°, also β = ${180-g-x}° : 2 = ${b}°.\nα = ${b}° + ${x}° = ${b+x}°.`,{t:'dreieck',al:b+x,be:b,lal:'?',lbe:'',lga:`${g}°`}]}])()}],
// Seit 2026-10-19: je Stufe vier Aufgabentypen (vorher nur einer mit 3 bis 9 Varianten, dadurch Wiederholungen in einer Runde).
// Zeichnungen gibt es nur bei Figuren (Diagonalen, Gitterwege).
['wege','Zählen & Wege',d=>{
 const kette=n=>[...Array(n)].map((_,i)=>n-i).join(' · '),zl=a=>a.slice(0,-1).join(', ')+' und '+a[a.length-1],nm=P(['Mia','Lena','Emma','Lea']);
 // Diagonalen (Stufe 1 kleine, Stufe 2 größere Figuren)
 const diag=n=>[`Eine Figur hat ${n} Ecken. Eine Diagonale verbindet zwei Ecken, die nicht nebeneinander liegen. Wie viele Diagonalen hat die Figur?`,n*(n-3)/2,'Von jeder Ecke gehen n−3 Diagonalen aus. Jede wird doppelt gezählt.',`Von jeder Ecke ${n==4?"geht 1 Diagonale":`gehen ${n-3} Diagonalen`} aus (nicht zu sich selbst und nicht zu den 2 Nachbarn).\nBei ${n} Ecken sind das ${n} · ${n-3} = ${n*(n-3)}.\nJede Diagonale wurde von beiden Enden gezählt: ${n*(n-3)} : 2 = ${n*(n-3)/2}.`,{t:'vieleck',n,diag:1}];
 // Wege im Gitter (Stufe 3 klein, Stufe 4 größer)
 const gitter=(a,b)=>[`Ein Weg führt von A nach B und besteht aus ${a} Schritten nach rechts und ${b} Schritten nach oben, in beliebiger Reihenfolge. Wie viele verschiedene Wege gibt es?`,fa(a+b)/fa(a)/fa(b),'Wähle, welche der Schritte „rechts“ sind.',`Der Weg hat ${a+b} Schritte. Gesucht ist, bei welchen davon man nach rechts geht (${a} von ${a+b}).\nRechne: ${a+b}! : (${a}! · ${b}!) = ${fa(a+b)} : (${fa(a)} · ${fa(b)}) = ${fa(a+b)/fa(a)/fa(b)}.\n(Mit n! ist 1 · 2 · … · n gemeint.)`,{t:'gitter',a,b}];
 // jeder mit jedem: Handschläge (Stufe 1) und Turnierspiele (Stufe 2)
 const paare=(n,wer,was)=>[`${n} ${wer}. Wie viele ${was} gibt es?`,n*(n-1)/2,'Jeder hat n−1 Partner. Dabei wird jedes Paar doppelt gezählt.',`Jeder hat ${n-1} Partner. Das sind ${n} · ${n-1} = ${n*(n-1)}.\nDabei ist jedes Paar doppelt gezählt (von beiden Seiten aus): ${n*(n-1)} : 2 = ${n*(n-1)/2}.`];
 // Zaun: gerade (Pfähle = Abstände + 1) oder rund um die Koppel (Pfähle = Abstände)
 const zaun=rund=>{const k=R(2,5),m=rund?R(6,20):R(3,10),L=k*m;return rund
  ?[`Um eine runde Koppel geht ein Zaun von ${L} m Länge. Alle ${k} m steht ein Pfahl. Wie viele Pfähle sind es?`,m,'Ein runder Zaun hat keinen Anfang und kein Ende.',`${L} m : ${k} m = ${m} Abstände.\nDer Zaun ist geschlossen. Der letzte Pfahl ist zugleich der erste.\nDeshalb gibt es genauso viele Pfähle wie Abstände: ${m}.`]
  :[`Ein gerader Zaun ist ${L} m lang. Alle ${k} m steht ein Pfahl, auch ganz am Anfang und ganz am Ende. Wie viele Pfähle sind es?`,m+1,'Zeichne einen kurzen Zaun und zähle nach.',`${L} m : ${k} m = ${m} Abstände.\nBeim geraden Zaun gibt es immer einen Pfahl mehr als Abstände: ${m} + 1 = ${m+1}.`]};
 // Zahlen aus Ziffern ohne doppelte Ziffer
 const ziff=(k,st)=>{const z=[...Array(k)].map((_,i)=>i+1),n=st==2?k*(k-1):k*(k-1)*(k-2);
  return[`Aus den Ziffern ${zl(z)} sollen ${st==2?'zweistellige':'dreistellige'} Zahlen gebildet werden. Keine Ziffer darf doppelt vorkommen. Wie viele Zahlen sind möglich?`,n,'Wie viele Ziffern passen an die erste Stelle? Wie viele dann an die zweite?',
  `Für die erste Stelle gibt es ${k} Möglichkeiten.\nFür die zweite bleiben ${k-1}, weil die erste Ziffer schon vergeben ist.`+(st==2?`\n${k} · ${k-1} = ${n}.`:`\nFür die dritte bleiben ${k-2}.\n${k} · ${k-1} · ${k-2} = ${n}.`)]};
 const W=[
  // Stufe 1
  ()=>diag(R(4,7)),
  ()=>paare(R(3,8),'Kinder treffen sich im Stall. Jedes Kind gibt jedem anderen Kind genau einmal die Hand','Handschläge'),
  ()=>{const a=R(2,5),b=R(2,5);return[`${nm} hat ${a} Reithelme und ${b} Reitjacken. Sie zieht immer einen Helm und eine Jacke an. Wie viele verschiedene Kombinationen gibt es?`,a*b,'Zu jedem Helm passt jede Jacke.',`Zu jedem der ${a} Helme passen alle ${b} Jacken.\n${a} · ${b} = ${a*b}.`]},
  ()=>zaun(0),
  // Stufe 2
  ()=>diag(R(7,12)),
  ()=>paare(R(5,12),'Mannschaften spielen ein Turnier. Jede Mannschaft spielt genau einmal gegen jede andere','Spiele'),
  ()=>{const a=R(2,4),b=R(2,4),c=R(2,4);return[`Im Stall gibt es ${a} Sättel, ${b} Satteldecken und ${c} Halfter. Für einen Ausritt nimmt man von jedem genau eins. Wie viele verschiedene Zusammenstellungen gibt es?`,a*b*c,'Rechne erst Sättel mit Decken, dann mit den Halftern.',`Zu jedem Sattel passt jede Decke: ${a} · ${b} = ${a*b}.\nZu jeder dieser Möglichkeiten passt jedes Halfter: ${a*b} · ${c} = ${a*b*c}.`]},
  ()=>ziff(R(3,6),2),
  // Stufe 3
  ()=>gitter(R(1,2),R(2,4)),
  ()=>{const n=R(4,9);return[`${n} Pferde laufen ein Rennen. Wie viele Möglichkeiten gibt es für die Plätze 1, 2 und 3?`,n*(n-1)*(n-2),'Wie viele Pferde können Erster werden? Wie viele dann Zweiter?',`Platz 1 kann jedes der ${n} Pferde bekommen.\nFür Platz 2 bleiben ${n-1} Pferde, für Platz 3 noch ${n-2}.\n${n} · ${n-1} · ${n-2} = ${n*(n-1)*(n-2)}.`]},
  ()=>ziff(R(4,7),3),
  ()=>zaun(1),
  // Stufe 4
  ()=>gitter(R(2,4),R(3,5)),
  ()=>{const n=R(5,9),k=R(2,3),p=k==2?n*(n-1):n*(n-1)*(n-2),c=p/fa(k);return[`Aus ${n} Kindern sollen ${k} für einen Ausritt ausgewählt werden. Die Reihenfolge ist egal. Wie viele Möglichkeiten gibt es?`,c,'Zähle erst mit Reihenfolge und teile dann.',`Mit Reihenfolge wären es ${kette(n).split(' · ').slice(0,k).join(' · ')} = ${p}.\nDieselben ${k} Kinder kommen dabei in ${kette(k)} = ${fa(k)} Reihenfolgen vor.\n${p} : ${fa(k)} = ${c}.`]},
  ()=>{const k=R(4,7),z=[...Array(k)].map((_,i)=>i),n=(k-1)*(k-1)*(k-2);return[`Aus den Ziffern ${zl(z)} werden dreistellige Zahlen gebildet. Keine Ziffer darf doppelt vorkommen. Vorne darf keine 0 stehen. Wie viele Zahlen sind möglich?`,n,'Fang vorne an. Dort ist die 0 verboten.',`Vorne geht jede Ziffer außer der 0: ${k-1} Möglichkeiten.\nIn der Mitte geht wieder die 0, aber nicht die Ziffer von vorne: ${k-1} Möglichkeiten.\nHinten bleiben ${k-2}.\n${k-1} · ${k-1} · ${k-2} = ${n}.`]},
  ()=>{const n=R(5,12),h=n*(n-1)/2;return[`Bei einem Reitturnier gibt jeder Teilnehmer jedem anderen genau einmal die Hand. Das sind ${h} Handschläge. Wie viele Teilnehmer sind es?`,n,'Bei n Personen gibt es n · (n−1) : 2 Handschläge. Probiere aus.',`Bei n Personen gibt es n · (n − 1) : 2 Handschläge.\nAlso muss n · (n − 1) = ${2*h} sein.\nProbieren: ${n} · ${n-1} = ${2*h}. Es sind ${n} Teilnehmer.`]},
  // Stufe 5
  ()=>{const n=R(3,6);return[`${n} Kinder stellen sich nebeneinander in eine Reihe. Auf wie viele verschiedene Arten geht das?`,fa(n),'Wie viele Kinder können auf den ersten Platz? Wie viele dann auf den zweiten?',`Auf den ersten Platz können ${n} Kinder, auf den zweiten noch ${n-1}, dann ${n-2} und so weiter.\n${kette(n)} = ${fa(n)}.`]},
  ()=>{const n=R(4,6);return[`${n} Kinder stellen sich in eine Reihe. Mia und Ben wollen unbedingt nebeneinander stehen. Wie viele Möglichkeiten gibt es?`,2*fa(n-1),'Pack die beiden zu einem Paket zusammen.',`Stell dir Mia und Ben als ein Paket vor. Dann gibt es ${n-1} Teile, die sich anordnen: ${kette(n-1)} = ${fa(n-1)}.\nIm Paket können Mia und Ben die Plätze tauschen, also mal 2.\n${fa(n-1)} · 2 = ${2*fa(n-1)}.`]},
  ()=>{const [w,x]=P([['PONY'],['PFERD'],['APFEL'],['HAFER'],['FOHLEN'],['STALL','L'],['KOPPEL','P'],['SATTEL','T'],['REITEN','E']]),L=w.length,n=fa(L)/(x?2:1);
   return[`Wie viele verschiedene „Wörter“ kann man aus den Buchstaben von ${w} legen? Jeder Buchstabe wird genau einmal benutzt. Die Wörter müssen keinen Sinn ergeben.`,n,'Wie viele Buchstaben sind es? Kommt einer doppelt vor?',
   x?`${L} Buchstaben lassen sich auf ${kette(L)} = ${fa(L)} Arten anordnen.\nDas ${x} kommt zweimal vor. Tauscht man die beiden ${x}, entsteht dasselbe Wort. Jedes Wort ist also doppelt gezählt.\n${fa(L)} : 2 = ${n}.`:`Alle ${L} Buchstaben sind verschieden.\nFür den ersten Platz gibt es ${L} Buchstaben, dann ${L-1} und so weiter.\n${kette(L)} = ${n}.`]},
  ()=>{const n=R(4,7);return[`${n} Kinder setzen sich an einen runden Tisch. Sitzordnungen, die durch Drehen gleich aussehen, zählen nur einmal. Wie viele verschiedene Sitzordnungen gibt es?`,fa(n-1),'Setze ein Kind fest auf einen Platz.',`Setze ein Kind fest auf einen Platz. Drehen ändert dann nichts mehr.\nDie anderen ${n-1} Kinder verteilen sich auf die übrigen Plätze: ${kette(n-1)} = ${fa(n-1)}.`]}];
 return W[(d-1)*4+R(0,3)]()}],
// Seit 2026-10-24 "Rationale Zahlen" wie im Mathebuch (vorher "Negative Zahlen"), Stufe 2 auch mit Zehnteln
['rat','Rationale Zahlen',d=>{let a,b,c,e;
 if(d==2&&R(0,1)){a=R(11,99);do{b=R(11,99)}while(b==a);return[`(−${f1(a/10)}) + ${f1(b/10)} = ?`,f1((b-a)/10),'Rechne mit Zehnteln wie mit ganzen Zahlen.',`Rechne in Zehnteln, also ohne Komma: −${a} + ${b} = ${b-a}\n${pn(b-a)} Zehntel = ${f1((b-a)/10)}`]}
 if(d==1){a=R(2,20);b=a+R(1,20);return[`${a} − ${b} = ?`,a-b,'Der Zahlenstrahl hilft.',`Die zweite Zahl ist größer. Der Abstand ist ${b} − ${a} = ${b-a}.\nDas Ergebnis ist negativ: −${b-a}`]}
 if(d==2){a=R(2,25);b=R(2,25);return[`(−${a}) + (−${b}) = ?`,-(a+b),'',`Zwei negative Zahlen addieren: Beträge addieren, das Minus bleibt.\n${a} + ${b} = ${a+b}, also −${a+b}`]}
 if(d==3){a=R(2,12);b=R(2,12);c=R(1,20);return[`(−${a}) · (−${b}) − ${c} = ?`,a*b-c,'Minus mal Minus ergibt Plus.',`Minus mal Minus ergibt Plus: (−${a}) · (−${b}) = ${a*b}\n${a*b} − ${c} = ${a*b-c}`]}
 if(d==4){a=R(2,12);b=R(5,20);c=R(5,20);return[`Um 6 Uhr hat es −${a} °C. Bis mittags steigt die Temperatur um ${b} °C, am Nachmittag fällt sie um ${c} °C. Wie warm ist es dann (in °C)?`,-a+b-c,'Rechne in zwei Schritten.',`Bis mittags: −${a} + ${b} = ${b-a} °C\nAm Nachmittag: ${b-a} − ${c} = ${b-a-c} °C`]}
 a=R(2,9);b=R(1,9);c=P([1,2,3,4,5,6,7,8,9].filter(z=>z!=b));e=R(1,20);return[`−${a} · (${b} − ${c}) + ${e} = ?`,-a*(b-c)+e,'Klammer zuerst.',`Klammer: ${b} − ${c} = ${b-c}\nMal −${a}: −${a} · ${pn(b-c)} = ${-a*(b-c)}\nPlus ${e}: ${-a*(b-c)} + ${e} = ${-a*(b-c)+e}`]}],
['term','Terme',d=>{let a,b,c,e,x;
 if(d==1){a=R(2,9);b=R(1,20);x=R(2,10);return[`Berechne ${a}x + ${b} für x = ${x}.`,a*x+b,'',`Setze x = ${x} ein: ${a} · ${x} + ${b}\n${a*x} + ${b} = ${a*x+b}`]}
 if(d==2){a=R(3,9);c=R(1,a-1);b=R(1,9);e=R(1,9);x=R(2,10);return[`Vereinfache ${a}x + ${b} − ${c}x + ${e} und berechne den Wert für x = ${x}.`,(a-c)*x+b+e,'Fasse die x-Glieder und die Zahlen getrennt zusammen.',`Zusammenfassen: (${a} − ${c})x + (${b} + ${e}) = ${a-c}x + ${b+e}\nFür x = ${x}: ${a-c} · ${x} + ${b+e} = ${(a-c)*x+b+e}`]}
 if(d==3){a=R(2,6);b=R(1,9);c=R(1,9);x=R(2,10);return[`Löse die Klammer auf, fasse zusammen und berechne ${a}(x + ${b}) − ${c}x für x = ${x}.`,a*(x+b)-c*x,'Multipliziere jedes Glied in der Klammer mit der Zahl davor.',`Klammer auflösen: ${a}x + ${a*b} − ${c}x = ${a-c}x + ${a*b}\nFür x = ${x}: ${pn(a-c)} · ${x} + ${a*b} = ${(a-c)*x+a*b}`]}
 if(d==4){a=R(2,6);b=R(1,9);c=R(1,9);e=R(1,9);x=R(2,10);return[`Berechne (${a}x + ${b}) · 2 − (${c}x − ${e}) für x = ${x}.`,(2*a-c)*x+2*b+e,'Ein Minus vor der Klammer dreht alle Vorzeichen in der Klammer um.',`Klammern auflösen: ${2*a}x + ${2*b} − ${c}x + ${e}\nZusammenfassen: ${2*a-c}x + ${2*b+e}\nFür x = ${x}: ${pn(2*a-c)} · ${x} + ${2*b+e} = ${(2*a-c)*x+2*b+e}`]}
 a=R(1,6);b=R(1,6);x=R(2,8);return[`Ein Rechteck hat die Seiten (x + ${a}) cm und (x + ${b}) cm. Wie groß ist die Fläche in cm² für x = ${x}?`,(x+a)*(x+b),'Fläche = Länge · Breite.',`Seiten einsetzen: (${x} + ${a}) · (${x} + ${b}) = ${x+a} · ${x+b}\n= ${(x+a)*(x+b)} cm²\n(Als Term: x² + ${a+b}x + ${a*b})`]}]
]};
// Klasse 6 und 8: eigene Themen, dazu geteilte Themen aus anderen Klassen
const TB=['bruch','Brüche',d=>{let p,q,G,a,b,g,N,c,e,pr;
 if(d==1){q=P([2,3,4,5,6,8,10]);p=R(1,q-1);G=q*R(2,15);return[`Wie viel sind ${p}/${q} von ${G}?`,G/q*p,'Teile durch den Nenner, multipliziere mit dem Zähler.',`Teile durch den Nenner: ${G} : ${q} = ${G/q}\nMal den Zähler: ${G/q} · ${p} = ${G/q*p}`]}
 if(d==2){[a,b]=P(COP);g=R(2,9);return[`Kürze ${a*g}/${b*g} so weit wie möglich. Wie lautet der Zähler des gekürzten Bruchs?`,a,'Teile Zähler und Nenner durch dieselbe Zahl.',`Der größte gemeinsame Teiler von ${a*g} und ${b*g} ist ${g}.\nTeile Zähler und Nenner durch ${g}: ${a*g}/${b*g} = ${a}/${b}`]}
 if(d==3){N=P([12,24]);a=P([2,3,4,6]);b=P([2,3,4,6]);p=R(1,a-1);q=R(1,b-1);return[`Berechne ${p}/${a} + ${q}/${b}. Schreibe das Ergebnis mit dem Nenner ${N}. Wie lautet der Zähler?`,p*N/a+q*N/b,'Erweitere beide Brüche auf den gemeinsamen Nenner.',`Erweitere beide Brüche auf den Nenner ${N}:\n${p}/${a} = ${p*N/a}/${N}\n${q}/${b} = ${q*N/b}/${N}\nAddiere die Zähler: ${p*N/a} + ${q*N/b} = ${p*N/a+q*N/b}`]}
 if(d==4){b=P([2,4,5,10]);e=P([2,4,5,10]);a=R(1,b-1);c=R(1,e-1);pr=f1(a*c/(b*e));return[`Berechne ${a}/${b} · ${c}/${e} und gib das Ergebnis als Dezimalzahl an.`,pr,'Zähler mal Zähler, Nenner mal Nenner. Für die Dezimalzahl helfen Merkwerte: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125.',`Zähler mal Zähler, Nenner mal Nenner: ${a}/${b} · ${c}/${e} = ${a*c}/${b*e}\nAls Dezimalzahl: ${a*c} : ${b*e} = ${pr}\n(Merkwerte helfen: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125)`]}
 do{a=P([2,3,4,6]);b=P([2,3,4,6])}while(12/a+12/b>=12);return[`Von einer Pizza isst Anna 1/${a} und Ben 1/${b}. Wie viele Zwölftel der Pizza bleiben übrig?`,12-12/a-12/b,'Erweitere auf Zwölftel.',`1/${a} = ${12/a}/12 und 1/${b} = ${12/b}/12\nZusammen gegessen: ${12/a} + ${12/b} = ${12/a+12/b} Zwölftel\nÜbrig: 12 − ${12/a+12/b} = ${12-12/a-12/b} Zwölftel`]}],
TD=['dez','Dezimalzahlen',d=>{let p,q,ia,ib,iq,ip,iw,a,b;
 if(d==1){q=P([2,4,5,8,10,20,25]);p=R(1,q-1);
  // Im Kopf ist 3 : 8 kaum zu rechnen. Besser: Merkwerte lernen, den Stammbruch (Zähler 1) umwandeln und mit dem Zähler malnehmen.
  if(q==2||q==4||q==8)return[`Schreibe ${p}/${q} als Dezimalzahl.`,f1(p/q),p==1?`Merkwerte: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125. Denk an den passenden Merkwert.`:`Merkwerte: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125. Wandle 1/${q} um und nimm es mal ${p}.`,p==1?`Merkwerte: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125
1/${q} = ${f1(1/q)}`:`Merkwerte: 1/2 = 0,5 · 1/4 = 0,25 · 1/8 = 0,125
1/${q} = ${f1(1/q)}
${p}/${q} = ${p} · 1/${q} = ${p} · ${f1(1/q)} = ${f1(p/q)}`];
  return[`Schreibe ${p}/${q} als Dezimalzahl.`,f1(p/q),`Erweitere den Bruch auf den Nenner 100. Die Hundertstel sind dann die Nachkommastellen.`,`Erweitere auf den Nenner 100: ${q} · ${100/q} = 100\n${p}/${q} = ${p*100/q}/100 = ${f1(p/q)}`]}
 if(d==2){ia=R(100,999);ib=R(10,99);a=ia/100;b=ib/10;return[`${f1(a)} + ${f1(b)} = ?`,f1((ia+10*ib)/100),'Komma unter Komma schreiben.',`Schreibe die Zahlen mit gleich vielen Nachkommastellen untereinander (Komma unter Komma):\n${a.toFixed(2)} + ${b.toFixed(2)} = ${((ia+10*ib)/100).toFixed(2)}`]}
 if(d==3){ia=R(12,99);ib=R(2,9);return[`${f1(ia/10)} · ${f1(ib/10)} = ?`,f1(ia*ib/100),'Rechne erst ohne Komma.',`Rechne ohne Komma: ${ia} · ${ib} = ${ia*ib}\nBeide Faktoren haben 1 Nachkommastelle, das Ergebnis hat 2: ${f1(ia*ib/100)}`]}
 if(d==4){iq=R(3,40);ib=R(2,9);return[`${f1(iq*ib/100)} : ${f1(ib/10)} = ?`,f1(iq/10),'Verschiebe bei beiden Zahlen das Komma gleich weit.',`Verschiebe das Komma bei beiden Zahlen um 2 Stellen nach rechts: ${iq*ib} : ${ib*10}\n${iq*ib} : ${ib*10} = ${f1(iq/10)}`]}
 ip=R(12,45);iw=5*R(2,9);return[`1 kg Äpfel kostet ${(ip/10).toFixed(2)} €. Wie viel kosten ${f1(iw/10)} kg (in €)?`,f1(ip*iw/100),'Rechne erst ohne Komma.',`Rechne ohne Komma: ${ip} · ${iw} = ${ip*iw}\nZwei Nachkommastellen: ${(ip*iw/100).toFixed(2)} €`]}],
TS=['dreisatz','Dreisatz',d=>{let a,b,p,t,tot,m,r,h;
 if(d==1){a=R(2,8);p=R(2,9);b=R(a+1,12);return[`${a} Hefte kosten ${a*p} €. Wie viel kosten ${b} Hefte (in €)?`,b*p,'Rechne zuerst auf 1 Heft.',`Für 1 Heft: ${a*p} € : ${a} = ${p} €\nFür ${b} Hefte: ${b} · ${p} € = ${b*p} €`]}
 if(d==2){a=R(2,9);p=R(5,40);b=R(10,30);return[`Eine Maschine füllt ${a*p} Flaschen in ${a} Minuten. Wie viele Flaschen füllt sie in ${b} Minuten?`,b*p,'Rechne zuerst auf 1 Minute.',`In 1 Minute: ${a*p} : ${a} = ${p} Flaschen\nIn ${b} Minuten: ${b} · ${p} = ${b*p} Flaschen`]}
 if(d==3){tot=24*R(1,5);a=P([2,3,4,6,8,12]);do{b=P([2,3,4,6,8,12])}while(b==a);return[`${a} Arbeiter brauchen für ein Dach ${tot/a} Tage. Alle arbeiten gleich schnell. Wie viele Tage brauchen ${b} Arbeiter?`,tot/b,'Mehr Arbeiter brauchen weniger Tage.',`Mehr oder weniger Arbeiter: Das Produkt bleibt gleich.\nGesamtarbeit: ${a} · ${tot/a} = ${tot} Arbeitertage\n${tot} : ${b} = ${tot/b} Tage`]}
 if(d==4){a=P([20,25,40,50]);p=P([4,5,6,8]);b=P([100,200,250,500]);return[`${a} Kopien kosten ${a*p} Cent. Wie viel kosten ${b} Kopien (in €)?`,f1(b*p/100),'Rechne zuerst auf 1 Kopie, dann in Euro um.',`1 Kopie: ${a*p} Cent : ${a} = ${p} Cent\n${b} Kopien: ${b} · ${p} = ${b*p} Cent = ${f1(b*p/100)} €`]}
 m=R(2,8);r=R(3,12);h=R(2,5);return[`Ein Wasserhahn füllt ${m*r} Liter in ${m} Minuten. Wie viele Liter fließen in ${h} Stunden?`,r*60*h,'Rechne die Stunden in Minuten um.',`Pro Minute: ${m*r} : ${m} = ${r} Liter\n${h} Stunden = ${60*h} Minuten\n${r} · ${60*h} = ${r*60*h} Liter`]}],
TL=['lf','Lineare Funktionen',d=>{let ms=[-5,-4,-3,-2,2,3,4,5],m,m1,m2,b,b1,b2,x,x0,x1,x2,y1,y2,dx;
 const bb=()=>P([-1,1])*R(1,9);
 if(d==1){m=P(ms);b=bb();x=R(-5,5);return[`f(x) = ${m}x ${sg(b)}. Berechne f(${x}).`,m*x+b,'',`Setze x = ${x} ein:\nf(${x}) = ${m} · ${pn(x)} ${sg(b)} = ${m*x} ${sg(b)} = ${m*x+b}`]}
 if(d==2){m=P(ms);x1=R(-4,4);dx=R(1,4);y1=R(-6,6);x2=x1+dx;y2=y1+m*dx;return[`Eine Gerade geht durch P₁(${x1}|${y1}) und P₂(${x2}|${y2}). Wie groß ist die Steigung m?`,m,'Steigung = Höhenunterschied : Breitenunterschied.',`m = (y₂ − y₁) : (x₂ − x₁)\nm = (${y2} − ${pn(y1)}) : (${x2} − ${pn(x1)}) = ${y2-y1} : ${dx} = ${m}`]}
 if(d==3){m=P(ms);x0=P([-1,1])*R(1,6);b=-m*x0;return[`f(x) = ${m}x ${sg(b)}. Für welches x gilt f(x) = 0?`,x0,'Setze f(x) = 0 und löse nach x auf.',`Setze f(x) = 0: ${m}x ${sg(b)} = 0\n${m}x = ${-b}\nx = ${-b} : ${pn(m)} = ${x0}`]}
 if(d==4){m=P(ms);b=bb();x1=R(-4,4);dx=R(1,4);x2=x1+dx;y1=m*x1+b;y2=m*x2+b;return[`Eine Gerade geht durch P₁(${x1}|${y1}) und P₂(${x2}|${y2}). Wie groß ist der y-Achsenabschnitt b?`,b,'Berechne erst die Steigung, setze dann einen Punkt ein.',`Steigung: m = (${y2} − ${pn(y1)}) : (${x2} − ${pn(x1)}) = ${m}\nPunkt P₁ in y = mx + b einsetzen: ${y1} = ${m} · ${pn(x1)} + b\nb = ${y1} − ${pn(m*x1)} = ${b}`]}
 m1=P(ms);do{m2=P(ms)}while(m2==m1);x0=R(-5,5);do{b1=bb();b2=(m1-m2)*x0+b1}while(b2==0);return[`f(x) = ${m1}x ${sg(b1)} und g(x) = ${m2}x ${sg(b2)}. Bei welchem x schneiden sich die Geraden?`,x0,'Setze f(x) = g(x).',`Gleichsetzen: ${m1}x ${sg(b1)} = ${m2}x ${sg(b2)}\nSortieren: (${m1} − ${pn(m2)})x = ${b2} − ${pn(b1)}\n${m1-m2}x = ${b2-b1}\nx = ${b2-b1} : ${pn(m1-m2)} = ${x0}`]}],
TG=['gls','Gleichungssysteme',d=>{let x,y,p,q,m,k,S,a1,b1,a2,b2,pb,pz,t1,t2;
 if(d==1){x=R(1,12);y=x+R(1,10);return[`x + y = ${x+y} und y = x + ${y-x}. Wie groß ist x?`,x,'Setze y in die erste Gleichung ein.',`Setze y = x + ${y-x} in die erste Gleichung ein:\nx + (x + ${y-x}) = ${x+y}\n2x + ${y-x} = ${x+y}\n2x = ${2*x}\nx = ${x}`]}
 if(d==2){p=R(1,5);q=R(1,5);x=R(1,9);y=R(1,9);return[`${p==1?'':p}x + y = ${p*x+y} und ${q==1?'':q}x − y = ${q*x-y}. Wie groß ist x?`,x,'Addiere beide Gleichungen.',`Addiere beide Gleichungen, dann fällt y weg:\n(${p} + ${q})x = ${p*x+y} + ${pn(q*x-y)}\n${p+q}x = ${(p+q)*x}\nx = ${x}`]}
 if(d==3){x=R(5,30);y=R(1,x-1);return[`Die Summe zweier Zahlen ist ${x+y}, ihre Differenz ist ${x-y}. Wie groß ist die kleinere Zahl?`,y,'Subtrahiere die beiden Gleichungen.',`Sei a die größere und b die kleinere Zahl: a + b = ${x+y} und a − b = ${x-y}.\nSubtrahiere die zweite von der ersten Gleichung: 2b = ${x+y} − ${x-y} = ${2*y}\nb = ${y}`]}
 if(d==4){do{a1=R(1,4);b1=R(1,4);a2=R(1,4);b2=R(1,4)}while(a1*b2-a2*b1==0);pb=10*R(3,10);pz=10*R(5,15);t1=a1*pb+b1*pz;t2=a2*pb+b2*pz;return[`${a1} Brötchen und ${b1} ${b1==1?'Brezel':'Brezeln'} kosten zusammen ${eu(t1)} €, ${a2} Brötchen und ${b2} ${b2==1?'Brezel':'Brezeln'} kosten zusammen ${eu(t2)} €. Wie viel kostet eine Brezel in Cent?`,pz,'Stelle zwei Gleichungen auf und eliminiere eine Unbekannte.',`Sei B der Preis eines Brötchens und Z der einer Brezel (in Cent):\nI: ${a1}B + ${b1}Z = ${t1}\nII: ${a2}B + ${b2}Z = ${t2}\nRechne II · ${a1} − I · ${a2}, dann fällt B weg:\n(${a1*b2} − ${a2*b1})Z = ${a1*t2} − ${a2*t1}\n${a1*b2-a2*b1}Z = ${a1*t2-a2*t1}\nZ = ${pz}`]}
 x=R(5,15);m=R(3,5);k=R(2,8);S=(x+k)+(m*x+k);return[`Ein Vater ist heute ${m}-mal so alt wie sein Sohn. In ${k} Jahren sind beide zusammen ${S} Jahre alt. Wie alt ist der Sohn heute?`,x,'Nenne das Alter des Sohnes x.',`Sohn heute: x, Vater heute: ${m}x\nIn ${k} Jahren: (x + ${k}) + (${m}x + ${k}) = ${S}\n${m+1}x + ${2*k} = ${S}\n${m+1}x = ${S-2*k}\nx = ${x}`]}],
TP=['pot','Potenzen & Wurzeln',d=>{let a,b,c,dd,k,N,bs,mx,tot,m,n;
 if(d==1){a=R(3,12);b=R(2,9);return[`√${a*a} + ${b}² = ?`,a+b*b,'',`√${a*a} = ${a}, denn ${a}² = ${a*a}.\n${b}² = ${b*b}\n${a} + ${b*b} = ${a+b*b}`]}
 if(d==2){[bs,mx]=P([[2,10],[3,6],[5,4],[10,5]]);tot=R(4,mx);m=R(1,tot-1);n=tot-m;return[`${bs}^${m} · ${bs}^${n} = ?`,bs**tot,'Bei gleicher Basis werden die Exponenten addiert.',`Gleiche Basis: Die Exponenten werden addiert.\n${m} + ${n} = ${tot}\n${bs}^${tot} = ${bs**tot}`]}
 if(d==3){k=R(3,12);N=k*k+R(1,2*k);return[`√${N} liegt zwischen zwei aufeinanderfolgenden ganzen Zahlen. Wie heißt die kleinere?`,k,'Suche die Quadratzahlen links und rechts von der Zahl.',`${k}² = ${k*k} und ${k+1}² = ${(k+1)**2}.\n${N} liegt zwischen ${k*k} und ${(k+1)**2}, also liegt √${N} zwischen ${k} und ${k+1}.`]}
 if(d==4){c=10*R(2,9);dd=R(1,9);return[`${c+dd}² − ${c-dd}² = ? (Tipp: nutze die 3. binomische Formel)`,4*c*dd,'a² − b² = (a − b) · (a + b)',`3. binomische Formel: a² − b² = (a − b)(a + b)\n(${c+dd} − ${c-dd}) · (${c+dd} + ${c-dd}) = ${2*dd} · ${2*c} = ${4*c*dd}`]}
 a=R(2,9);b=R(2,9);return[`(${a} + ${b})² − ${a}² − ${b}² = ?`,2*a*b,'Benutze die 1. binomische Formel.',`1. binomische Formel: (a + b)² = a² + 2ab + b²\nDie Quadrate a² und b² fallen weg, es bleibt 2ab.\n2 · ${a} · ${b} = ${2*a*b}`]}],
TY=['pyth','Pythagoras',d=>{let k,a,b,c,t;
 if(d==1){k=R(1,12);return[`Ein rechtwinkliges Dreieck hat die Katheten ${3*k} cm und ${4*k} cm. Wie lang ist die Hypotenuse in cm?`,5*k,'c² = a² + b²',`Satz des Pythagoras: c² = a² + b²\nc² = ${3*k}² + ${4*k}² = ${9*k*k} + ${16*k*k} = ${25*k*k}\nc = √${25*k*k} = ${5*k}`,{t:'rechtwinklig',a:4*k,b:3*k,la:`${4*k} cm`,lb:`${3*k} cm`,lc:'?'}]}
 if(d==2){k=P([1,2]);[a,b,c]=P(TRI).map(z=>z*k);if(R(0,1))[a,b]=[b,a];return[`Die Hypotenuse eines rechtwinkligen Dreiecks ist ${c} cm lang, eine Kathete ${a} cm. Wie lang ist die andere Kathete in cm?`,b,'b² = c² − a²',`Satz des Pythagoras: a² + b² = c², also b² = c² − a²\nb² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}\nb = √${b*b} = ${b}`,{t:'rechtwinklig',a,b,la:`${a} cm`,lb:'?',lc:`${c} cm`}]}
 // Stufe 3 bis 5 seit 2026-10-19 mit je zwei Aufgabentypen und allen ganzzahligen Dreiecken bis 50 (TRIK), vorher 8 Varianten je Stufe.
 // dr: Dreieck aus TRIK, Katheten zufällig vertauscht; v: höchstes Seitenverhältnis der Katheten (für flache Figuren)
 const dr=(L,v)=>{let t;do{t=[...P(L)];if(R(0,1))[t[0],t[1]]=[t[1],t[0]]}while(Math.max(t[0]/t[1],t[1]/t[0])>(v||9));return t};
 if(d==3&&R(0,1)){[a,b,c]=dr(TRIK);return[`Eine rechteckige Koppel ist ${a} m lang und ${b} m breit. Ein Pferd läuft quer über die Koppel von einer Ecke zur gegenüberliegenden. Wie lang ist dieser Weg (in m)?`,c,'Der Weg teilt die Koppel in zwei rechtwinklige Dreiecke.',`Der Weg ist die Diagonale. Sie teilt die Koppel in zwei rechtwinklige Dreiecke.\nd² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a+b*b}\nd = √${a*a+b*b} = ${c} m`,{t:'rechteck',a,b,la:`${a} m`,lb:`${b} m`,diag:'?'}]}
 // Leiter: Fußpunkt immer näher an der Wand als die Höhe (sonst läge die Leiter fast flach), lange Leitern sind Feuerwehrleitern
 if(d==3){[a,b,c]=P(TRIK.filter(t=>t[2]<=25));return[`Eine ${c} m lange ${c>15?'Feuerwehrleiter':'Leiter'} lehnt an einer Wand. Ihr Fußpunkt steht ${a} m von der Wand entfernt. In welcher Höhe berührt sie die Wand (in m)?`,b,'Die Leiter ist die Hypotenuse.',`Wand, Boden und Leiter bilden ein rechtwinkliges Dreieck, die Leiter ist die Hypotenuse.\nh² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}\nh = √${b*b} = ${b} m`,{t:'leiter',a,b,c}]}
 if(d==4&&R(0,1)){[a,b,c]=dr(TRIK);return[`Ein Rechteck ist ${a} cm lang. Seine Diagonale ist ${c} cm lang. Wie breit ist das Rechteck in cm?`,b,'Die Diagonale ist die Hypotenuse.',`Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke. Sie ist die Hypotenuse.\nb² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}\nb = √${b*b} = ${b} cm`,{t:'rechteck',a,b,lb:'?',diag:`${c} cm`}]}
 if(d==4){[a,b,c]=dr(TRIK);return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie lang ist die Diagonale in cm?`,c,'Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.',`Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.\nd² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a+b*b}\nd = √${a*a+b*b} = ${c} cm`,{t:'rechteck',a,b,diag:'?'}]}
 [a,b,c]=dr(TRIK.filter(t=>t[2]<=30),3);
 // Schenkel gesucht: nur breite Dreiecke (Höhe höchstens 1,4-mal die halbe Basis), sonst überdecken sich die Beschriftungen
 if(R(0,1)){do{[a,b,c]=dr(TRIK.filter(t=>t[2]<=30),3)}while(b>1.4*a);return[`Ein gleichschenkliges Dreieck hat die Basis ${2*a} cm und die Höhe ${b} cm. Wie lang ist einer der beiden gleichen Schenkel in cm?`,c,'Die Höhe halbiert die Basis.',`Die Höhe halbiert die Basis: ${2*a} : 2 = ${a} cm.\nEs entsteht ein rechtwinkliges Dreieck mit den Katheten ${a} cm und ${b} cm. Der Schenkel ist die Hypotenuse.\ns² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}\ns = √${c*c} = ${c} cm`,{t:'gleichschenklig',a,b,c,lc:'?',lh:`${b} cm`}]}
 return[`Ein gleichschenkliges Dreieck hat die Basis ${2*a} cm und Schenkel von je ${c} cm. Wie hoch ist das Dreieck (Höhe auf die Basis) in cm?`,b,'Die Höhe halbiert die Basis.',`Die Höhe halbiert die Basis: ${2*a} : 2 = ${a} cm.\nEs entsteht ein rechtwinkliges Dreieck mit Hypotenuse ${c} cm und Kathete ${a} cm.\nh² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}\nh = √${b*b} = ${b} cm`,{t:'gleichschenklig',a,b,c}]}];
// ---------- Klasse 7 nach dem Mathebuch (seit 2026-10-24): Flächen von Figuren (Kap. 1), Zuordnungen (Kap. 2), Wahrscheinlichkeit (Kap. 7) ----------
// Flächen: 1 Dreieck, 2 Parallelogramm (oder Umfang eines Parallelogramms), 3 Trapez, 4 rückwärts (Höhe gesucht) oder Raute,
// 5 zusammengesetzte Figuren (Giebelwand), Trapez rückwärts, Dreieck im Rechteck
const TF7=['fl7','Flächen von Figuren',d=>{let g,h,a,c,s,A,e,f,b;
 if(d==1){g=R(3,14);h=R(2,12);if(g*h%2)g++;s=R(1,g-1);
  return[`Ein Dreieck hat die Grundseite g = ${g} cm und die Höhe h = ${h} cm. Wie groß ist sein Flächeninhalt (in cm²)?`,g*h/2,'Ein Dreieck ist halb so groß wie ein Rechteck mit derselben Grundseite und Höhe.',`Flächeninhalt Dreieck = g · h : 2\n${g} · ${h} : 2 = ${g*h} : 2 = ${g*h/2} cm²`,{t:'dreieckh',a:g,b:h,c:s,lh:`${h} cm`}]}
 if(d==2){if(R(0,2)==0){a=R(3,15);b=R(2,12);return[`Ein Parallelogramm hat die Seiten a = ${a} cm und b = ${b} cm. Wie groß ist sein Umfang (in cm)?`,2*(a+b),'Gegenüberliegende Seiten sind gleich lang.',`Gegenüberliegende Seiten sind gleich lang.\nUmfang = 2 · a + 2 · b = 2 · (${a} + ${b}) = ${2*(a+b)} cm`]}
  g=R(3,14);h=R(2,10);s=R(1,Math.min(5,g-1));
  return[`Ein Parallelogramm hat die Grundseite g = ${g} cm und die Höhe h = ${h} cm. Wie groß ist sein Flächeninhalt (in cm²)?`,g*h,'Schneide links ein Dreieck ab und setze es rechts an. Dann entsteht ein Rechteck.',`Ein Parallelogramm lässt sich in ein Rechteck mit derselben Grundseite und Höhe umlegen.\nFlächeninhalt = g · h = ${g} · ${h} = ${g*h} cm²`,{t:'parallelogramm',a:g,b:h,c:s,lh:`${h} cm`}]}
 if(d==3){a=R(5,16);c=R(2,a-2);h=R(2,10);if((a+c)*h%2)h++;e=R(1,a-c-1);A=(a+c)*h/2;
  return[`Ein Trapez hat die parallelen Seiten a = ${a} cm und c = ${c} cm und die Höhe h = ${h} cm. Wie groß ist sein Flächeninhalt (in cm²)?`,A,'Nimm den Mittelwert der beiden parallelen Seiten und multipliziere ihn mit der Höhe.',`Flächeninhalt Trapez = (a + c) : 2 · h\n(${a} + ${c}) : 2 · ${h} = ${f1((a+c)/2)} · ${h} = ${A} cm²`,{t:'trapez',a,b:h,c,d:e,lh:`${h} cm`}]}
 if(d==4){const art=R(0,2);
  if(art==0){g=R(3,12);h=R(2,12);if(g*h%2)g++;A=g*h/2;s=R(1,g-1);return[`Ein Dreieck hat den Flächeninhalt ${A} cm² und die Grundseite g = ${g} cm. Wie lang ist die Höhe h (in cm)?`,h,'Rechne rückwärts: Die Fläche mal 2 ergibt g · h.',`A = g · h : 2, also g · h = 2 · A = ${2*A}\nh = ${2*A} : ${g} = ${h} cm`,{t:'dreieckh',a:g,b:h,c:s}]}
  if(art==1){g=R(3,14);h=R(2,10);s=R(1,Math.min(5,g-1));return[`Ein Parallelogramm hat den Flächeninhalt ${g*h} cm² und die Grundseite g = ${g} cm. Wie lang ist die Höhe h (in cm)?`,h,'A = g · h, also h = A : g.',`A = g · h, also h = A : g\nh = ${g*h} : ${g} = ${h} cm`,{t:'parallelogramm',a:g,b:h,c:s}]}
  e=R(3,16);f=R(2,14);if(e*f%2)e++;return[`Eine Raute hat die Diagonalen e = ${e} cm und f = ${f} cm. Wie groß ist ihr Flächeninhalt (in cm²)?`,e*f/2,'Die Raute ist halb so groß wie das Rechteck, das man um sie herum zeichnen kann.',`Zeichne um die Raute ein Rechteck mit den Seiten e und f. Die Raute füllt genau die Hälfte davon.\nA = e · f : 2 = ${e} · ${f} : 2 = ${e*f/2} cm²`]}
 const art=R(0,2);
 if(art==0){a=R(4,10);b=R(2,6);h=R(1,5);if(a*h%2)a++;A=a*b+a*h/2;return[`Die Giebelwand eines Stalls besteht aus einem Rechteck (${a} m breit, ${b} m hoch) und einem Dreieck darüber (Grundseite ${a} m, Höhe ${h} m). Wie groß ist die ganze Wand (in m²)?`,A,'Berechne beide Teilflächen und addiere sie.',`Rechteck: ${a} · ${b} = ${a*b} m²\nDreieck: ${a} · ${h} : 2 = ${a*h/2} m²\nZusammen: ${a*b} + ${a*h/2} = ${A} m²`]}
 if(art==1){a=R(6,16);c=R(2,a-2);h=R(2,10);if((a+c)*h%2)h++;e=R(1,a-c-1);A=(a+c)*h/2;return[`Ein Trapez hat den Flächeninhalt ${A} cm² und die parallelen Seiten a = ${a} cm und c = ${c} cm. Wie lang ist die Höhe h (in cm)?`,h,'Rechne zuerst (a + c) : 2 aus.',`A = (a + c) : 2 · h\n(${a} + ${c}) : 2 = ${f1((a+c)/2)}\nh = ${A} : ${f1((a+c)/2)} = ${h} cm`,{t:'trapez',a,b:h,c,d:e}]}
 a=2*R(2,8);b=R(3,12);return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Aus ihm wird ein Dreieck ausgeschnitten: Grundseite ist die untere Seite, die Spitze liegt auf der oberen Seite. Wie viel cm² bleiben vom Rechteck übrig?`,a*b/2,'Das Dreieck hat dieselbe Grundseite und Höhe wie das Rechteck.',`Das Dreieck hat die Grundseite ${a} cm und die Höhe ${b} cm, also die halbe Fläche des Rechtecks.\nRechteck: ${a} · ${b} = ${a*b} cm²\nDreieck: ${a*b} : 2 = ${a*b/2} cm²\nÜbrig: ${a*b} − ${a*b/2} = ${a*b/2} cm²`]}];
// Zuordnungen: 1 proportional, 2 antiproportional, 3 Art ist angegeben (Tabelle ergänzen), 4 Art selbst erkennen oder Faktor k, 5 zwei Schritte
const TZ=['zuord','Zuordnungen',d=>{let a,b,p,T,x1,x2,x3,y1,y2,k,q,s,n,D,r,t,t2,p2;
 const teil=T=>[...Array(T).keys()].map(i=>i+1).filter(i=>T%i==0&&i>1&&i<T),zwei=L=>{const x=P(L);let y;do{y=P(L)}while(y==x);return[x,y]};
 if(d==1){a=R(2,8);do{b=R(2,15)}while(b==a);const art=R(0,2);
  if(art==0){p=R(2,9);return[`${a} kg Hafer kosten ${a*p} €. Wie viel kosten ${b} kg (in €)?`,b*p,'Rechne zuerst aus, was 1 kg kostet.',`Doppelt so viel Hafer kostet doppelt so viel: Die Zuordnung ist proportional.\n1 kg: ${a*p} € : ${a} = ${p} €\n${b} kg: ${b} · ${p} € = ${b*p} €`]}
  if(art==1){p=P([150,200,250,300]);return[`Ein Pferd trabt in ${a} Minuten ${a*p} m weit. Wie weit kommt es im gleichen Tempo in ${b} Minuten (in m)?`,b*p,'Rechne zuerst aus, wie weit es in 1 Minute kommt.',`Im gleichen Tempo gilt: doppelte Zeit, doppelter Weg. Die Zuordnung ist proportional.\n1 Minute: ${a*p} m : ${a} = ${p} m\n${b} Minuten: ${b} · ${p} m = ${b*p} m`]}
  p=R(3,12);return[`Für ${a} Ausritte braucht man ${a*p} Äpfel als Belohnung. Wie viele Äpfel braucht man für ${b} Ausritte?`,b*p,'Rechne zuerst auf 1 Ausritt.',`Die Zuordnung ist proportional.\n1 Ausritt: ${a*p} : ${a} = ${p} Äpfel\n${b} Ausritte: ${b} · ${p} = ${b*p} Äpfel`]}
 if(d==2){T=P([24,36,48,60,72,90,120]);[a,b]=zwei(teil(T));const art=R(0,2);
  if(art==0)return[`Ein Heuvorrat reicht für ${a} Pferde genau ${T/a} Tage. Wie viele Tage reicht er für ${b} Pferde?`,T/b,'Mehr Pferde fressen den Vorrat schneller auf.',`Doppelt so viele Pferde, halb so viele Tage: Die Zuordnung ist antiproportional, das Produkt bleibt gleich.\n${a} · ${T/a} = ${T} Pferdetage\n${T} : ${b} = ${T/b} Tage`];
  if(art==1)return[`${a} Kinder misten den Stall in ${T/a} Minuten aus. Wie lange brauchen ${b} Kinder, wenn alle gleich schnell arbeiten (in min)?`,T/b,'Mehr Kinder brauchen weniger Zeit.',`Die Zuordnung ist antiproportional, das Produkt bleibt gleich.\n${a} · ${T/a} = ${T} Minuten für ein Kind allein\n${T} : ${b} = ${T/b} Minuten`];
  return[`Ein Reitweg wird in ${a} gleich lange Abschnitte zu je ${T/a} m geteilt. Wie lang ist ein Abschnitt, wenn man den Weg stattdessen in ${b} gleich lange Abschnitte teilt (in m)?`,T/b,'Berechne zuerst die Länge des ganzen Wegs.',`Der ganze Weg bleibt gleich lang: ${a} · ${T/a} = ${T} m.\nDie Zuordnung ist antiproportional.\n${T} : ${b} = ${T/b} m`]}
 if(d==3){if(R(0,1)){k=R(2,12);[x1,x2]=zwei([2,3,4,5,6,7,8,9,10,12,15]);return[`Die Zuordnung ist proportional. Zu x = ${x1} gehört y = ${k*x1}. Welches y gehört zu x = ${x2}?`,k*x2,'Bei proportionalen Zuordnungen bleibt der Quotient y : x gleich.',`Proportional: Der Quotient y : x bleibt gleich.\n${k*x1} : ${x1} = ${k}\ny = ${k} · ${x2} = ${k*x2}`]}
  T=P([24,36,48,60,72,120]);[x1,x2]=zwei(teil(T));return[`Die Zuordnung ist antiproportional. Zu x = ${x1} gehört y = ${T/x1}. Welches y gehört zu x = ${x2}?`,T/x2,'Bei antiproportionalen Zuordnungen bleibt das Produkt x · y gleich.',`Antiproportional: Das Produkt x · y bleibt gleich.\n${x1} · ${T/x1} = ${T}\ny = ${T} : ${x2} = ${T/x2}`]}
 if(d==4){const art=R(0,2);
  if(art==2){k=P([.5,1.5,2.5,3.5,1.2,0.8,0.4]);x1=P([2,4,5,10,20]);if(f1(k*x1)%1)x1=10;return[`Eine Zuordnung ist proportional: y = k · x. Für x = ${x1} ist y = ${f1(k*x1)}. Wie groß ist der Proportionalitätsfaktor k?`,k,'k = y : x',`Bei y = k · x ist k = y : x.\nk = ${f1(k*x1)} : ${x1} = ${k}`]}
  if(art==0){k=R(2,9);[x1,x2]=zwei([2,3,4,5,6,8,10]);do{x3=P([2,3,4,5,6,7,8,9,10,12])}while(x3==x1||x3==x2);
   return[`In einer Tabelle gehört zu x = ${x1} der Wert y = ${k*x1} und zu x = ${x2} der Wert y = ${k*x2}. Die Zuordnung ist proportional oder antiproportional. Welches y gehört zu x = ${x3}?`,k*x3,'Prüfe, ob der Quotient y : x oder das Produkt x · y gleich bleibt.',`Quotienten: ${k*x1} : ${x1} = ${k} und ${k*x2} : ${x2} = ${k}. Sie sind gleich, die Zuordnung ist proportional.\n(Die Produkte ${x1*k*x1} und ${x2*k*x2} sind verschieden.)\ny = ${k} · ${x3} = ${k*x3}`]}
  T=P([24,36,48,60,72,120]);const L=teil(T);[x1,x2]=zwei(L);do{x3=P(L)}while(x3==x1||x3==x2);
  return[`In einer Tabelle gehört zu x = ${x1} der Wert y = ${T/x1} und zu x = ${x2} der Wert y = ${T/x2}. Die Zuordnung ist proportional oder antiproportional. Welches y gehört zu x = ${x3}?`,T/x3,'Prüfe, ob der Quotient y : x oder das Produkt x · y gleich bleibt.',`Produkte: ${x1} · ${T/x1} = ${T} und ${x2} · ${T/x2} = ${T}. Sie sind gleich, die Zuordnung ist antiproportional.\ny = ${T} : ${x3} = ${T/x3}`]}
 if(R(0,1)){p=R(2,6);do{p2=R(2,8)}while(p2==p);t=R(2,7);do{t2=R(2,10)}while(t2==t);r=R(3,8);
  return[`${p} Pferde fressen in ${t} Tagen zusammen ${p*t*r} kg Heu. Wie viel Heu fressen ${p2} Pferde in ${t2} Tagen (in kg)?`,p2*t2*r,'Rechne zuerst aus, wie viel 1 Pferd an 1 Tag frisst.',`1 Pferd in ${t} Tagen: ${p*t*r} : ${p} = ${t*r} kg\n1 Pferd an 1 Tag: ${t*r} : ${t} = ${r} kg\n${p2} Pferde in ${t2} Tagen: ${p2} · ${t2} · ${r} = ${p2*t2*r} kg`]}
 a=R(2,6);n=R(1,3);q=R(1,3);s=R(2,6);D=s+(a+n)*q;
 return[`Ein Heuvorrat reicht für ${a} Pferde genau ${D} Tage. Nach ${s} Tagen ${n==1?'kommt 1 Pferd':`kommen ${n} Pferde`} dazu. Wie viele Tage reicht das restliche Heu noch?`,a*q,'Rechne in Pferdetagen: Pferde mal Tage.',`Der Vorrat reicht für ${a} · ${D} = ${a*D} Pferdetage.\nNach ${s} Tagen sind ${a} · ${s} = ${a*s} verbraucht, es bleiben ${a*D-a*s} Pferdetage.\nJetzt fressen ${a+n} Pferde: ${a*D-a*s} : ${a+n} = ${a*q} Tage.`]}];
// Wahrscheinlichkeit (Antworten in Prozent, nur glatte Werte): 1 Glücksrad, 2 Kugeln in drei Farben, 3 Gegenereignis oder relative Häufigkeit,
// 4 Voraussagen, 5 Glücksrad mit Winkel, zwei Münzen, Würfel mit 20 Flächen
const TW=['wk','Wahrscheinlichkeit',d=>{let N,k,r,g,b,w,n,p,m,c;
 if(d==1){N=P([4,5,10,20]);k=R(1,N-1);return[`Ein Glücksrad hat ${N} gleich große Felder, ${k} davon ${k==1?'ist':'sind'} rot. Wie groß ist die Wahrscheinlichkeit, dass der Zeiger auf Rot stehen bleibt (in %)?`,k*100/N,'Wahrscheinlichkeit = günstige Ergebnisse : mögliche Ergebnisse.',`Günstige Ergebnisse (rot): ${k}, mögliche Ergebnisse: ${N}.\nP(rot) = ${k}/${N} = ${k*100/N} %`]}
 if(d==2){N=P([10,20,25,50]);do{r=R(1,N-2);g=R(1,N-r-1);b=N-r-g}while(b<1);const [fa,z]=P([['rote',r],['grüne',g],['gelbe',b]]);
  return[`In einem Beutel liegen ${r} rote, ${g} grüne und ${b} gelbe Kugeln. Lia zieht ohne hinzuschauen eine Kugel. Wie groß ist die Wahrscheinlichkeit für eine ${fa} Kugel (in %)?`,z*100/N,'Zähle zuerst alle Kugeln zusammen.',`Alle Kugeln: ${r} + ${g} + ${b} = ${N}\nGünstig sind die ${z} ${fa}n Kugeln.\nP = ${z}/${N} = ${z*100/N} %`]}
 if(d==3){if(R(0,1)){N=P([20,25,50,100]);w=R(1,N/2);return[`In einer Lostrommel sind ${N} Lose, ${w} davon sind Gewinne. Wie groß ist die Wahrscheinlichkeit, eine Niete zu ziehen (in %)?`,(N-w)*100/N,'Nieten sind alle Lose, die kein Gewinn sind.',`Nieten: ${N} − ${w} = ${N-w}\nP(Niete) = ${N-w}/${N} = ${(N-w)*100/N} %\n(Oder: 100 % − P(Gewinn) = 100 % − ${w*100/N} % = ${(N-w)*100/N} %)`]}
  n=P([20,25,50,100,200]);p=5*R(2,18);k=n*p/100;if(k%1){n=100;k=p}return[`Lena wirft eine Reißzwecke ${n}-mal. Sie landet ${k}-mal auf dem Rücken. Wie groß ist die relative Häufigkeit für „Rücken“ (in %)?`,p,'Relative Häufigkeit = Anzahl : Anzahl aller Würfe.',`Relative Häufigkeit = ${k} : ${n} = ${k}/${n} = ${p} %`]}
 if(d==4){p=P([10,20,25,30,40,60,75]);m=P([40,80,100,200,400,500]);if(m*p%100)m=200;
  if(R(0,1)){n=P([20,40,100,200]);k=n*p/100;if(k%1){n=100;k=p}return[`Eine Reißzwecke landete bei ${n} Würfen ${k}-mal auf der Spitze. Wie oft wird sie ungefähr bei ${m} Würfen auf der Spitze landen?`,m*p/100,'Berechne zuerst die relative Häufigkeit.',`Relative Häufigkeit: ${k} : ${n} = ${p} %\nVoraussage: ${p} % von ${m} = ${m} · ${p} : 100 = ${m*p/100}`]}
  return[`Bei einem Spiel gewinnt man mit einer Wahrscheinlichkeit von ${p} %. Wie viele Gewinne erwartet man ungefähr bei ${m} Spielen?`,m*p/100,'Rechne p % von der Anzahl der Spiele.',`${p} % von ${m} = ${m} · ${p} : 100 = ${m*p/100}`]}
 const art=R(0,2);
 if(art==0){k=R(1,19);w=18*k;return[`Auf einem Glücksrad ist das blaue Feld ${w}° groß. Wie groß ist die Wahrscheinlichkeit, dass der Zeiger auf Blau stehen bleibt (in %)?`,5*k,'Ein ganzer Kreis hat 360°.',`Ein ganzer Kreis hat 360°.\nP(blau) = ${w}/360 = ${5*k} %\n(36° sind 10 %, 18° sind 5 %.)`]}
 if(art==1){const [txt,z,wie]=P([['zweimal Kopf',1,'KK'],['genau einmal Kopf',2,'KZ und ZK'],['mindestens einmal Kopf',3,'KK, KZ und ZK'],['zweimal Zahl',1,'ZZ']]);
  return[`Zwei Münzen werden gleichzeitig geworfen. Wie groß ist die Wahrscheinlichkeit für ${txt} (in %)?`,z*25,'Schreibe alle Ergebnisse auf: KK, KZ, ZK, ZZ (K = Kopf, Z = Zahl).',`Mögliche Ergebnisse: KK, KZ, ZK, ZZ, das sind 4.\nGünstig: ${wie}, das ${z==1?'ist 1':`sind ${z}`}.\nP = ${z}/4 = ${z*25} %`]}
 const E=[['eine gerade Zahl',n=>n%2==0],['eine Zahl, die durch 4 teilbar ist',n=>n%4==0],['eine Zahl, die durch 5 teilbar ist',n=>n%5==0],['eine Zahl größer als 15',n=>n>15],['eine Primzahl',isP],['eine Zahl kleiner als 7',n=>n<7]],[txt,fn]=P(E),L=[...Array(20).keys()].map(i=>i+1).filter(fn);
 return[`Ein Würfel hat 20 gleich große Flächen mit den Zahlen 1 bis 20. Wie groß ist die Wahrscheinlichkeit für ${txt} (in %)?`,L.length*5,'Zähle die günstigen Zahlen. Jede Zahl hat 5 %.',`Günstige Zahlen: ${L.join(', ')}. Das sind ${L.length}.\nP = ${L.length}/20 = ${L.length*5} %`]}];
// ---------- Logik-Rätsel (seit 2026-10-24, Brain Dump: Mathe-Olympiade für alle Klassen erweitern) ----------
// Je Stufe eine von drei Arten: Zahlenreihe fortsetzen, Würfelnetz (welches Netz ergibt einen Würfel bzw. welche Zahl liegt gegenüber),
// welche Zahl passt nicht zu den anderen.
// Würfelnetz: Zellen [x, y] auf Karopapier. netzFalten klappt das Netz von Zelle 0 aus zusammen (jede Fläche merkt sich ihre Richtung im Raum:
// n = Außenseite, ex/ey = Richtung von "rechts" und "unten" im Netz). Ein Würfel entsteht, wenn alle 6 Flächen in verschiedene Richtungen zeigen.
// Rückgabe: Richtungen je Zelle oder null.
function netzFalten(C){const k=c=>c[0]+','+c[1],ix=new Map(C.map((c,i)=>[k(c),i])),neg=v=>v.map(x=>-x),st=[{n:[0,0,-1],ex:[1,0,0],ey:[0,1,0]}],Q=[0];
 while(Q.length){const i=Q.shift(),[x,y]=C[i],s=st[i];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=ix.get(k([x+dx,y+dy]));if(j==null||st[j])continue;let n,ex=s.ex,ey=s.ey;
   if(dx==1){n=s.ex;ex=neg(s.n)}else if(dx==-1){n=neg(s.ex);ex=s.n}else if(dy==1){n=s.ey;ey=neg(s.n)}else{n=neg(s.ey);ey=s.n}
   st[j]={n,ex,ey};Q.push(j)}}
 if(st.filter(Boolean).length!==C.length)return null;const ns=st.map(s=>s.n.join());return new Set(ns).size===6?ns:null}
// Zufälliges zusammenhängendes Netz aus 6 Quadraten, liegend (höchstens 5 breit, 4 hoch), gut: true = ergibt einen Würfel, false = nicht
function netzZufall(gut){for(let v=0;v<2000;v++){const C=[[0,0]];while(C.length<6){const [x,y]=P(C),[dx,dy]=P([[1,0],[-1,0],[0,1],[0,-1]]),n=[x+dx,y+dy];if(!C.some(c=>c[0]==n[0]&&c[1]==n[1]))C.push(n)}
  const mx=Math.min(...C.map(c=>c[0])),my=Math.min(...C.map(c=>c[1]));let D=C.map(([x,y])=>[x-mx,y-my]);
  if(Math.max(...D.map(c=>c[1]))>Math.max(...D.map(c=>c[0])))D=D.map(([x,y])=>[y,x]);
  if(Math.max(...D.map(c=>c[0]))>4||Math.max(...D.map(c=>c[1]))>3)continue;D.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  if(!!netzFalten(D)===gut)return D}return gut?[[0,1],[1,1],[2,1],[3,1],[1,0],[1,2]]:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]}
const netzCode=C=>C.map(c=>c.join('')).join('');
// Form eines Netzes ohne Drehen und Spiegeln (kleinster Code aller 8 Lagen), damit die beiden falschen Netze verschieden aussehen
const netzForm=C=>{const L=[];for(let r=0;r<4;r++)for(const m of [0,1]){let D=C.map(([x,y])=>{let a=x,b=y;for(let i=0;i<r;i++)[a,b]=[-b,a];return[m?-a:a,b]});
 const mx=Math.min(...D.map(c=>c[0])),my=Math.min(...D.map(c=>c[1]));D=D.map(([x,y])=>[x-mx,y-my]).sort((p,q)=>p[1]-q[1]||p[0]-q[0]);L.push(D.map(c=>c.join(',')).join(' '))}return L.sort()[0]};
// Rätselnummer aus dem Code der Zeichnung (wie beim Sudoku), damit gleich lautende Fragen als verschiedene Aufgaben zählen (Runde, Fehlerheft)
const netzNr=s=>1000+[...s].reduce((h,ch)=>(h*31+ch.charCodeAt(0))%8999,7);
// Zahlenreihen je Stufe (Liste der Typen, zufällig gewählt): [gezeigte Zahlen, Lösung, Lösungsweg]
function logikFolge(d){let a,b,p,q,k,c,L=[],w,s;
 const T={1:['wechsel','plus2'],2:['quadrat','mal2','mal2plus1'],3:['zwei','wechsel3'],4:['diffdoppelt','dreieck','prim'],5:['malminus','fibo','kubik']}[d],t=P(T);
 if(t=='wechsel'){a=R(1,20);do{p=R(1,9);q=R(1,9)}while(p==q);L=[a];for(let i=0;i<6;i++)L.push(L[i]+(i%2?q:p));s=L.pop();w=`Die Abstände wechseln sich ab: +${p}, +${q}, +${p}, …\nAls Nächstes kommt +${q}: ${L[5]} + ${q} = ${s}`}
 else if(t=='plus2'){a=R(2,30);p=R(2,9);q=R(1,p-1);L=[a];for(let i=0;i<6;i++)L.push(L[i]+(i%2?-q:p));s=L.pop();w=`Abwechselnd +${p} und −${q}.\nAls Nächstes kommt −${q}: ${L[5]} − ${q} = ${s}`}
 else if(t=='quadrat'){a=R(1,6);L=[...Array(7)].map((_,i)=>(a+i)**2);s=L.pop();w=`Das sind Quadratzahlen: ${a}·${a}, ${a+1}·${a+1}, …\nAls Nächstes: ${a+6} · ${a+6} = ${s}`}
 else if(t=='mal2'){a=R(1,5);k=P([2,3]);L=[...Array(6)].map((_,i)=>a*k**i);if(L[5]>999){k=2;L=[...Array(6)].map((_,i)=>a*k**i)}s=L.pop();w=`Jede Zahl ist das ${k}-Fache der Zahl davor.\n${L[4]} · ${k} = ${s}`}
 else if(t=='mal2plus1'){a=R(1,4);c=P([1,2]);L=[a];for(let i=0;i<5;i++)L.push(2*L[i]+c);s=L.pop();w=`Jede Zahl ist das Doppelte der Zahl davor plus ${c}.\n2 · ${L[4]} + ${c} = ${s}`}
 else if(t=='zwei'){a=R(1,10);b=R(30,60);p=R(2,5);q=R(2,6);L=[...Array(8)].map((_,i)=>i%2?b-q*(i-1)/2:a+p*i/2);s=L.pop();w=`Zwei Reihen sind ineinander geschoben:\nan den Plätzen 1, 3, 5, 7: ${L.filter((_,i)=>i%2==0).join(', ')} (immer +${p})\nan den Plätzen 2, 4, 6: ${L.filter((_,i)=>i%2).join(', ')} (immer −${q})\nAls Nächstes kommt die zweite Reihe: ${L[5]} − ${q} = ${s}`}
 else if(t=='wechsel3'){a=R(1,10);[p,q,c]=[R(1,5),R(2,7),R(3,9)];L=[a];for(let i=0;i<6;i++)L.push(L[i]+[p,q,c][i%3]);s=L.pop();w=`Die Abstände wiederholen sich in Dreiergruppen: +${p}, +${q}, +${c}, +${p}, …\nAls Nächstes kommt +${c}: ${L[5]} + ${c} = ${s}`}
 else if(t=='diffdoppelt'){a=R(1,20);c=P([1,2,3]);L=[a];for(let i=0;i<6;i++)L.push(L[i]+c*2**i);s=L.pop();w=`Schau auf die Abstände: ${L.slice(1).map((x,i)=>x-L[i]).join(', ')}.\nSie verdoppeln sich jedes Mal. Der nächste Abstand ist ${c*32}.\n${L[5]} + ${c*32} = ${s}`}
 else if(t=='dreieck'){a=R(1,4);L=[...Array(7)].map((_,i)=>(a+i)*(a+i+1)/2);s=L.pop();w=`Schau auf die Abstände: ${L.slice(1).map((x,i)=>x-L[i]).join(', ')}.\nSie werden jedes Mal um 1 größer. Der nächste Abstand ist ${a+6}.\n${L[5]} + ${a+6} = ${s}`}
 else if(t=='prim'){const PR=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71];a=R(0,PR.length-7);L=PR.slice(a,a+7);s=L.pop();w=`Das sind Primzahlen: Zahlen, die nur durch 1 und sich selbst teilbar sind.\nDie nächste Primzahl nach ${L[5]} ist ${s}.`}
 else if(t=='malminus'){k=P([2,3]);c=R(1,3);a=R(c+1,c+4);L=[a];for(let i=0;i<5;i++)L.push(k*L[i]-c);s=L.pop();w=`Jede Zahl ist das ${k}-Fache der Zahl davor minus ${c}.\n${k} · ${L[4]} − ${c} = ${s}`}
 else if(t=='fibo'){a=R(1,6);b=R(1,9);L=[a,b];for(let i=0;i<5;i++)L.push(L[i]+L[i+1]);s=L.pop();w=`Jede Zahl ist die Summe der beiden Zahlen davor.\n${L[4]} + ${L[5]} = ${s}`}
 else{a=R(1,3);L=[...Array(6)].map((_,i)=>(a+i)**3);s=L.pop();w=`Das sind Kubikzahlen: ${a}·${a}·${a}, ${a+1}·${a+1}·${a+1}, …\nAls Nächstes: ${a+5} · ${a+5} · ${a+5} = ${s}`}
 return['Welche Zahl kommt als Nächstes?\n'+L.join(', ')+', …',s,'Schau dir die Abstände zwischen den Zahlen an, manchmal auch jede zweite Zahl.',w]}
// Welche Zahl passt nicht? Fünf Zahlen mit einer Eigenschaft und eine ohne. Stufe 1 gerade/ungerade, 2 Vielfache, 3 Quadratzahlen, 4 Primzahlen, 5 Quersumme
// Eindeutig (Code-Prüfung 2026-10-24): Es wird neu gewürfelt, solange eine andere Zahl bei einer einfachen Eigenschaft allein dasteht
// (gerade/ungerade, Anzahl der Stellen, teilbar durch 3, 4, 5 oder 10, Quadratzahl). Sonst gäbe es zwei richtige Antworten.
const PASSEIG=[n=>n%2,n=>String(n).length,n=>n%3==0,n=>n%5==0,n=>n%10==0,n=>Number.isInteger(Math.sqrt(n)),n=>n%4==0];
const passtEindeutig=(A,x)=>PASSEIG.every(p=>{const w=A.map(p),allein=A.filter((_,i)=>w.filter(v=>v===w[i]).length===1);return!(A.length-allein.length===5&&allein.length===1&&allein[0]!==x)});
function logikPasst(d){for(let v=0;v<300;v++){const q=logikPasst1(d);if(passtEindeutig(q[0].split('\n')[1].split(', ').map(Number),q[1])||v==299)return q}}
function logikPasst1(d){const mische=a=>{for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a},fuenf=f=>{const s=new Set();while(s.size<5)s.add(f());return[...s]};let L,x,eig,nicht,tipp;
 if(d==1){const ger=R(0,1);L=fuenf(()=>2*R(5,49)+(ger?0:1));x=2*R(5,49)+(ger?1:0);eig=ger?'gerade':'ungerade';nicht=ger?'ungerade':'gerade';tipp='Schau auf die letzte Ziffer.'}
 else if(d==2){const k=R(3,9);L=fuenf(()=>k*R(2,12));do{x=k*R(2,12)+R(1,k-1)}while(L.includes(x));eig=`durch ${k} teilbar (in der ${k}er-Reihe)`;nicht=`nicht durch ${k} teilbar`;tipp='Suche eine Einmaleins-Reihe, in der fast alle Zahlen stehen.'}
 else if(d==3){L=mische([...Array(13)].map((_,i)=>(i+3)**2)).slice(0,5);do{x=R(10,200)}while(Number.isInteger(Math.sqrt(x)));eig='Quadratzahlen (eine Zahl mal sich selbst)';nicht='keine Quadratzahl';tipp='Welche Zahlen bekommt man, wenn man eine Zahl mit sich selbst malnimmt?'}
 else if(d==4){const PR=[11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];L=mische([...PR]).slice(0,5);x=P([21,27,33,39,49,51,57,63,69,77,81,87,91,93]);eig='Primzahlen (nur durch 1 und sich selbst teilbar)';nicht=`keine Primzahl, denn ${x} = ${(()=>{for(let i=3;i<x;i++)if(x%i==0)return`${i} · ${x/i}`})()}`;tipp='Prüfe, ob sich eine Zahl in ein Malproblem zerlegen lässt.'}
 // Stufe 5: nur dreistellige Zahlen, sonst fiele die Anzahl der Stellen auf
 else{const qs=n=>String(n).split('').reduce((s,c)=>s+ +c,0),z=R(8,12);L=fuenf(()=>{let n;do{n=R(100,399)}while(qs(n)!=z);return n});do{x=R(100,399)}while(qs(x)!=z+1);eig=`Zahlen mit der Quersumme ${z}`;nicht=`Quersumme ${z+1}`;tipp='Addiere die Ziffern jeder Zahl.'}
 const A=mische([...L,x]);
 return[`Welche Zahl passt nicht zu den anderen?\n${A.join(', ')}`,x,tipp,`Alle Zahlen außer ${x} sind ${eig}.\n${x} ist ${nicht}.`]}
// Würfelnetz: Stufe 1 und 2 "Welches Netz ergibt einen Würfel?" (drei Netze, eins passt), ab Stufe 3 "Welche Zahl liegt gegenüber?"
function logikNetz(d){
 if(d<=2){const g=netzZufall(true),f1n=netzZufall(false);let f2n;do{f2n=netzZufall(false)}while(netzForm(f2n)===netzForm(f1n));const N=[g,f1n,f2n];for(let i=2;i>0;i--){const j=R(0,i);[N[i],N[j]]=[N[j],N[i]]}const r=N.indexOf(g)+1,code=N.map(netzCode).join('|');
  return[`Würfelrätsel ${netzNr(code)}: Welches Netz ergibt beim Zusammenklappen einen Würfel? Gib die Nummer des Netzes ein.`,r,'Klappe in Gedanken eine Fläche als Boden fest und falte die anderen hoch. Keine zwei Flächen dürfen aufeinander landen.',
   `Netz ${r} lässt sich zu einem Würfel falten: Jede der 6 Flächen landet auf einer anderen Seite.\nDie anderen Netze lassen sich nicht ohne Überlappung oder Lücke zu einem Würfel falten.`,{t:'netz',g:code}]}
 const C=netzZufall(true),ns=netzFalten(C),Z=[1,2,3,4,5,6];for(let i=5;i>0;i--){const j=R(0,i);[Z[i],Z[j]]=[Z[j],Z[i]]}
 const i=R(0,5),gn=ns[i].split(',').map(v=>-v+0).join(),j=ns.findIndex(n=>n===gn.replace(/-0/g,'0')),a=Z[i],b=Z[j],[x1,y1]=C[i],[x2,y2]=C[j];
 const gerade=(x1==x2&&Math.abs(y1-y2)==2)||(y1==y2&&Math.abs(x1-x2)==2);
 return[`Würfelrätsel ${netzNr(netzCode(C)+Z.join(''))}: Das Netz wird zu einem Würfel gefaltet. Welche Zahl liegt dann der ${a} gegenüber?`,b,'Zwei Flächen, die in einer geraden Reihe genau eine Fläche zwischen sich haben, liegen sich gegenüber.',
  (gerade?`Die ${a} und die ${b} liegen in einer geraden Reihe mit genau einer Fläche dazwischen. Solche Flächen liegen sich gegenüber.`:`Lege die ${a} in Gedanken als Boden hin und klappe die Nachbarflächen als Wände hoch. Die Fläche, die dann oben als Deckel landet, ist die ${b}.`)+`\nDer ${a} gegenüber liegt die ${b}.`,{t:'netz',g:netzCode(C),z:C.map((_,k)=>Z[k]).join('')}]}
const TLOG=['logik','Logik-Rätsel',d=>{const art=R(0,2);return art==0?logikFolge(d):art==1?logikNetz(d):logikPasst(d)}];
// ---------- Sudoku (seit 2026-10-19) ----------
// Je Aufgabe ein Sudoku mit einem markierten Feld ("Welche Zahl gehört hierhin?"). Beim Erzeugen wird geprüft, dass sich das Feld
// mit der Denkweise der Stufe sicher lösen lässt (das ganze Sudoku muss dafür nicht eindeutig sein). Denkweisen:
//  a = eine Zeile, Spalte oder der Kasten ist bis auf das Feld voll
//  b = Zeile, Spalte und Kasten zusammen lassen nur eine Zahl übrig
//  c = versteckte Zahl: Im Kasten kann eine Zahl nur noch in das Feld, das Feld selbst hätte mehrere Möglichkeiten (c2: weniger Zahlen vorgegeben)
// Stufen je Klasse [Größe, Denkweise]: Klasse 5 bis 6×6, Klasse 6 bis 9×9 leicht, Klasse 7 und 8 bis 9×9 mit versteckten Zahlen
const SUDST={5:[[4,'a'],[4,'b'],[6,'a'],[6,'b'],[6,'c']],6:[[4,'b'],[6,'a'],[6,'b'],[9,'a'],[9,'b']],78:[[6,'b'],[9,'a'],[9,'b'],[9,'c'],[9,'c2']]};
const sudBox=n=>n==6?[2,3]:n==4?[2,2]:[3,3];// [Kastenhöhe, Kastenbreite]
// Vollständige Lösung: Grundmuster, dann Zeilen im Band, Bänder, Spalten im Stapel, Stapel und Ziffern zufällig vertauschen
function sudLoesung(n){const [br,bc]=sudBox(n),mix=a=>{for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]]}return a},nr=k=>[...Array(k).keys()];
 const rows=mix(nr(n/br)).flatMap(b=>mix(nr(br)).map(i=>b*br+i)),cols=mix(nr(n/bc)).flatMap(s=>mix(nr(bc)).map(i=>s*bc+i)),dig=mix(nr(n));
 return rows.map(r=>cols.map(c=>dig[(bc*(r%br)+Math.floor(r/br)+c)%n]+1))}
function sudAufgabe(n,art){const [br,bc]=sudBox(n),nr=[...Array(n).keys()],zl=a=>a.length>1?a.slice(0,-1).join(', ')+' und '+a[a.length-1]:String(a[0]);
 for(let ver=0;ver<300;ver++){
  const L=sudLoesung(n),tr=R(0,n-1),tc=R(0,n-1),v=L[tr][tc],G=L.map(r=>r.map(()=>Math.random()<{a:.35,b:.3,c:.32,c2:.2}[art]?1:0));G[tr][tc]=0;
  const zeile=r=>nr.map(c=>[r,c]),spalte=c=>nr.map(r=>[r,c]),kasten=(r,c)=>{const r0=r-r%br,c0=c-c%bc,o=[];for(let i=0;i<br;i++)for(let j=0;j<bc;j++)o.push([r0+i,c0+j]);return o};
  const sicht=cs=>cs.filter(([r,c])=>G[r][c]).map(([r,c])=>L[r][c]).sort((x,y)=>x-y),
   kand=(r,c)=>{const s=new Set([...sicht(zeile(r)),...sicht(spalte(c)),...sicht(kasten(r,c))]);return nr.map(i=>i+1).filter(d=>!s.has(d))},
   voll=cs=>cs.every(([r,c])=>(r==tr&&c==tc)||G[r][c]),U=[[`In Zeile ${tr+1}`,zeile(tr)],[`In Spalte ${tc+1}`,spalte(tc)],['Im Kasten mit dem Fragezeichen',kasten(tr,tc)]];
  let weg,tipp;
  if(art=='a'){const [nm,cs]=P(U);cs.forEach(([r,c])=>{if(r!=tr||c!=tc)G[r][c]=1});
   weg=`${nm} fehlt nur noch eine Zahl.\nDort stehen schon: ${zl(sicht(cs))}.\nEs fehlt die ${v}.`;tipp='Suche eine Zeile, Spalte oder einen Kasten, in dem nur noch ein Feld frei ist.'}
  else if(art=='b'){
   // Für jede andere Zahl ein passendes Feld in Zeile, Spalte oder Kasten aufdecken, bis nur noch v übrig bleibt
   for(const w of kand(tr,tc).filter(d=>d!=v)){const f=P([...zeile(tr),...spalte(tc),...kasten(tr,tc)].filter(([r,c])=>L[r][c]==w));G[f[0]][f[1]]=1}
   if(U.some(([,cs])=>voll(cs)))continue;// das wäre Denkweise a
   // Nur Einheiten nennen, in denen schon Zahlen stehen
   weg=U.filter(([,cs])=>sicht(cs).length).map(([nm,cs])=>`${nm} stehen schon: ${zl(sicht(cs))}.`).join('\n')+`\nZusammen sind das alle Zahlen außer der ${v}. Also gehört die ${v} in das Feld.`;
   tipp='Welche Zahlen stehen schon in der Zeile, in der Spalte und im Kasten des Felds?'}
  else{
   // Versteckte Zahl: Jedes andere freie Feld im Kasten wird für v gesperrt (v steht schon in seiner Zeile oder Spalte) oder aufgedeckt
   const andere=kasten(tr,tc).filter(([r,c])=>r!=tr||c!=tc);
   for(const [r,c] of andere){if(G[r][c]||sicht(zeile(r)).includes(v)||sicht(spalte(c)).includes(v))continue;
    const wege=[...(r!=tr?zeile(r):[]),...(c!=tc?spalte(c):[])].filter(([a,b])=>L[a][b]==v);
    if(Math.random()<.3||!wege.length)G[r][c]=1;else{const f=P(wege);G[f[0]][f[1]]=1}}
   const frei=andere.filter(([r,c])=>!G[r][c]),k=kand(tr,tc);
   if(frei.length<2||k.length<2)continue;// sonst wäre es Denkweise a oder b
   weg=`Das Feld selbst könnte noch ${k.slice(0,-1).join(', ')} oder ${k[k.length-1]} sein. Schau deshalb, wo im Kasten die ${v} hin kann:\n`+
    frei.map(([r,c])=>`Zeile ${r+1}, Spalte ${c+1}: geht nicht, ${sicht(zeile(r)).includes(v)?`in Zeile ${r+1}`:`in Spalte ${c+1}`} steht schon eine ${v}.`).join('\n')+`\nIm Kasten bleibt für die ${v} nur das Feld mit dem Fragezeichen.`;
   tipp='Nimm eine Zahl, die im Kasten noch fehlt, und prüfe, in welche freien Felder sie überhaupt passt.'}
  const g=L.map((row,r)=>row.map((d,c)=>G[r][c]?d:0).join('')).join(''),nrS=1000+[...g].reduce((h,ch)=>(h*31+ +ch)%8999,tr*n+tc);
  return[`Sudoku ${nrS}: In jeder Zeile, jeder Spalte und jedem dicken Kasten steht jede Zahl von 1 bis ${n} genau einmal. Welche Zahl gehört in das Feld mit dem Fragezeichen?`,v,tipp,weg,{t:'sudoku',n,g,z:tr*n+tc}]}
 return sudAufgabe(n,'a')}
// ===== Klasse 4 (seit 2026-10-24): typischer Grundschulstoff =====
// KL = alle Klassen der App. Große Zahlen (ab 10 000) mit schmalem Leerzeichen wie im Schulbuch: 250 000 (gzf).
const KL=[4,5,6,7,8],gzf=n=>Math.abs(n)>=10000?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,String.fromCharCode(0x202F)):String(n),eu2=c=>de((c/100).toFixed(2)),
 uhr=m=>`${Math.floor(m/60)}:${pd(m%60)}`,NAM4=['Mia','Lena','Emma','Lea','Ben','Paul','Finn','Ida'];
const ST4=['Einer','Zehner','Hunderter','Tausender','Zehntausender','Hunderttausender'],SK4=['E','Z','H','T','ZT','HT'],
 stellenZeile=n=>{const s=String(n);return[...s].map((c,i)=>`${SK4[s.length-1-i]} ${c}`).join(' · ')},
 STTIPP='HT = Hunderttausender, ZT = Zehntausender, T = Tausender, H = Hunderter, Z = Zehner, E = Einer.';
// Zahlwörter bis 999 999 ("eins" nur am Ende: einhunderteins, aber eintausend)
const ZE=['','ein','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf','dreizehn','vierzehn','fünfzehn','sechzehn','siebzehn','achtzehn','neunzehn'],
 ZZ=['','','zwanzig','dreißig','vierzig','fünfzig','sechzig','siebzig','achtzig','neunzig'],
 zw2=(n,ende)=>n==1&&ende?'eins':n<20?ZE[n]:(n%10?ZE[n%10]+'und':'')+ZZ[Math.floor(n/10)],
 zw3=(n,ende)=>(n>=100?ZE[Math.floor(n/100)]+'hundert':'')+zw2(n%100,ende),
 zahlwort=n=>{const t=Math.floor(n/1000),r=n%1000;return(t?zw3(t)+'tausend':'')+(r?zw3(r,1):'')};
// Schriftliche Verfahren als Lösungsweg, Stelle für Stelle von rechts
function schrAdd(zs){const L=Math.max(...zs.map(z=>String(z).length)),o=[];let m=0;
 for(let i=0;i<L;i++){const ds=zs.filter(z=>z>=10**i).map(z=>Math.floor(z/10**i)%10),s=ds.reduce((x,y)=>x+y,0)+m,t=ds.join(' + ')+(m?` + ${m} (gemerkt)`:'');
  o.push(`${ST4[i]}: ${ds.length>1||m?`${t} = ${s}`:s}, schreibe ${i<L-1?s%10:s}${i<L-1&&s>=10?`, merke ${Math.floor(s/10)}`:''}.`);m=Math.floor(s/10)}
 return o.join('\n')+`\nErgebnis: ${gzf(zs.reduce((x,y)=>x+y,0))}`}
function schrSub(a,b){const L=String(a).length,lb=String(b).length,o=[];let m=0;
 for(let i=0;i<L;i++){const x=Math.floor(a/10**i)%10,y0=i<lb?Math.floor(b/10**i)%10:0,y=y0+m,vorn=Math.floor((a-b)/10**i)===0;// vorn: führende Null des Ergebnisses
  if(i>=lb&&!m){o.push(`${ST4[i]}: ${x}, schreibe ${x}.`);continue}
  const yt=m?`${y0} + 1 (gemerkt) = ${y}. `:'';
  if(x>=y){o.push(`${ST4[i]}: ${yt}${x} − ${y} = ${x-y}, ${vorn?'vorne schreibt man keine 0':`schreibe ${x-y}`}.`);m=0}
  else{o.push(`${ST4[i]}: ${yt}${x} − ${y} geht nicht, also ${x+10} − ${y} = ${x+10-y}, ${vorn?'vorne schreibt man keine 0':`schreibe ${x+10-y}`}, merke 1.`);m=1}}
 return o.join('\n')+`\nErgebnis: ${gzf(a-b)}\nProbe: ${gzf(b)} + ${gzf(a-b)} = ${gzf(a)}`}
function schrMul(a,f){const s=String(a),o=[];let m=0;
 for(let i=0;i<s.length;i++){const x=Math.floor(a/10**i)%10,p=x*f+m,last=i==s.length-1;
  o.push(`${f} · ${x}${m?` + ${m} (gemerkt)`:''} = ${p}, schreibe ${last?p:p%10}${!last&&p>=10?`, merke ${Math.floor(p/10)}`:''}.`);m=Math.floor(p/10)}
 return o.join('\n')+`\nErgebnis: ${gzf(a*f)}`}
function schrDiv(n,d){const s=String(n),o=[];let r=0,los=0;
 for(let i=0;i<s.length;i++){const c=r*10+ +s[i];if(!los&&c<d&&i<s.length-1){r=c;continue}
  const q=Math.floor(c/d);o.push(`${los?`Hole die ${s[i]} herunter: `:''}${c} : ${d} = ${q}, denn ${q} · ${d} = ${q*d}, Rest ${c-q*d}.`);r=c-q*d;los=1}
 return o.join('\n')+`\nErgebnis: ${gzf(n/d)}\nProbe: ${gzf(n/d)} · ${d} = ${gzf(n)}`}
const T4=[
['zr4','Zahlen bis zur Million',d=>{let n,a,b,k;
 const stelle=()=>P([[100,'Hunderter'],[1000,'Tausender'],[10000,'Zehntausender']]);
 if(d==1)return P([
  ()=>{n=R(10000,999999);k=R(0,String(n).length-1);const z=Math.floor(n/10**k)%10;return[`Welche Ziffer steht in der Zahl ${gzf(n)} an der ${ST4[k]}stelle?`,z,'Schreibe die Zahl in eine Stellenwerttafel.',`In der Stellenwerttafel: ${stellenZeile(n)}\nAn der ${ST4[k]}stelle steht die ${z}.`]},
  ()=>{if(R(0,1)){n=R(2,99)*P([1000,10000]);return[`Welche Zahl kommt direkt vor ${gzf(n)}?`,n-1,'Der Vorgänger ist um 1 kleiner.',`Der Vorgänger ist um 1 kleiner:\n${gzf(n)} − 1 = ${gzf(n-1)}`]}
   n=R(2,99)*P([1000,10000])-1;return[`Welche Zahl kommt direkt nach ${gzf(n)}?`,n+1,'Der Nachfolger ist um 1 größer.',`Der Nachfolger ist um 1 größer:\n${gzf(n)} + 1 = ${gzf(n+1)}`]},
  ()=>{const L=R(5,6);do n=R(10**(L-1),10**L-1);while(String(n).includes('0'));const s=String(n);
   return[`Schreibe als Zahl: ${[...s].map((c,i)=>`${c} ${SK4[L-1-i]}`).join(' ')}`,n,STTIPP,`${[...s].map((c,i)=>`${c} ${SK4[L-1-i]}`).join(' + ')}\nDie Ziffern der Reihe nach: ${gzf(n)}`]}])();
 if(d==2)return P([
  ()=>{let ds;do ds=[R(1,9),...[0,0,0,0,0].map(()=>R(0,1)?0:R(1,9))];while(!ds.includes(0)||ds.filter(x=>x).length<3);n=+ds.join('');
   return[`Schreibe als Zahl: ${ds.map((c,i)=>c?`${c} ${SK4[5-i]}`:'').filter(x=>x).join(' ')}`,n,STTIPP+' Fehlt eine Stelle, steht dort eine 0.',`In der Stellenwerttafel: ${stellenZeile(n)}\nFehlende Stellen bekommen eine 0: ${gzf(n)}`]},
  ()=>{const t=R(1,999),r=R(0,4)?R(1,999):0;n=t*1000+r;
   return[`Schreibe als Zahl: ${zahlwort(n).replace(/(tausend|hundert)(?=.)/g,'$1'+String.fromCharCode(0xAD))}`,n,'Suche das Wort „tausend“. Was davor steht, sind die Tausender.',`Vor „tausend“ steht „${zw3(t)}“, das sind ${t} Tausender.\n`+(r?`Danach kommt ${zw3(r,1)}, das ist ${r}. Hinter den Tausendern stehen immer drei Stellen: ${String(r).padStart(3,'0')}.\n`:'Danach kommt nichts mehr, also hinten 000.\n')+`Zusammen: ${gzf(n)}`]},
  ()=>{const [e,nm]=stelle();k=R(e==10000?2:11,e==100?9999:e==1000?999:99);n=k*e;return[`Wie viele ${nm} sind ${gzf(n)}?`,k,`Wie oft passt ${gzf(e)} in die Zahl?`,`${gzf(n)} : ${gzf(e)} = ${k}\nAlso sind ${gzf(n)} genau ${k} ${nm}.`]}])();
 if(d==3){n=R(10000,999999);k=P(n>=100000?[1,2,3,4,5]:[1,2,3,4]);const e=10**k,r=Math.round(n/e)*e,z=Math.floor(n/10**(k-1))%10;
  return[`Runde ${gzf(n)} auf ${ST4[k]}.`,r,'Schau auf die Ziffer rechts neben der Stelle, auf die du rundest.',`Auf ${ST4[k]} runden: Entscheidend ist die Ziffer rechts daneben, an der ${ST4[k-1]}stelle: ${z}.\n`+(z<5?'Bei 0, 1, 2, 3 oder 4 wird abgerundet.':'Bei 5, 6, 7, 8 oder 9 wird aufgerundet.')+`\n${gzf(n)} ≈ ${gzf(r)}`]}
 if(d==4)return P([
  ()=>{const [e,nm]=stelle();do n=R(10001,999999);while(n%e==0);const u=Math.floor(n/e)*e,o=u+e,vor=R(0,1),nb='Nachbar'+nm.toLowerCase();
   return[`Welcher ${nm} liegt direkt ${vor?'vor':'nach'} ${gzf(n)}?`,vor?u:o,`Suche die beiden ${nb}.`,`Die ${nb} von ${gzf(n)} sind ${gzf(u)} und ${gzf(o)}.\nDirekt ${vor?'davor':'danach'} liegt ${gzf(vor?u:o)}.`]},
  ()=>{n=R(101,9999)*100;const h=Math.ceil(n/100000)*100000,s1=h-n,s2=1e6-h;
   return[`Wie viel fehlt von ${gzf(n)} bis ${gzf(1e6)}?`,1e6-n,'Ergänze erst bis zum nächsten Hunderttausender.',s1&&s2?`${gzf(n)} + ${gzf(s1)} = ${gzf(h)}\n${gzf(h)} + ${gzf(s2)} = ${gzf(1e6)}\nZusammen fehlen ${gzf(s1)} + ${gzf(s2)} = ${gzf(1e6-n)}`:`${gzf(n)} + ${gzf(1e6-n)} = ${gzf(1e6)}\nEs fehlen ${gzf(1e6-n)}.`]},
  ()=>{a=R(1,97)*10000;const h=R(1,9)*1000;b=a+2*h;return[`Welche Zahl liegt genau in der Mitte zwischen ${gzf(a)} und ${gzf(b)}?`,a+h,'Berechne den Abstand und nimm die Hälfte davon.',`Abstand: ${gzf(b)} − ${gzf(a)} = ${gzf(2*h)}\nDie Hälfte davon: ${gzf(h)}\n${gzf(a)} + ${gzf(h)} = ${gzf(a+h)}`]}])();
 return P([
  ()=>{const ds=[0,1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5).slice(0,6),gr=R(0,1),auf=[...ds].sort((x,y)=>x-y),ab=[...ds].sort((x,y)=>y-x),i=auf.findIndex(x=>x>0),z=gr?ab:[auf[i],...auf.filter((_,j)=>j!=i)];n=+z.join('');
   return[`Lege mit den Ziffernkarten ${ds.join(', ')} die ${gr?'größte':'kleinste'} sechsstellige Zahl. Jede Karte kommt genau einmal dran.`,n,gr?'Die größte Ziffer gehört ganz nach vorn.':'Die kleinste Ziffer gehört nach vorn, aber eine Zahl beginnt nie mit 0.',
    gr?`Ordne die Ziffern von groß nach klein: ${ab.join(', ')}.\nDie größte Zahl ist ${gzf(n)}.`:`Ordne die Ziffern von klein nach groß: ${auf.join(', ')}.\n`+(auf[0]==0?`Vorne darf keine 0 stehen. Also kommt die ${z[0]} nach vorn und die 0 an die zweite Stelle.\n`:'')+`Die kleinste Zahl ist ${gzf(n)}.`]},
  ()=>{a=R(0,7)*100000+R(0,9)*10000;const st=P([1000,5000,10000,25000]);k=R(4,9);
   return[`Auf einem Zahlenstrahl steht am ersten Strich ${gzf(a)}. Von Strich zu Strich geht es ${gzf(st)} weiter. Welche Zahl steht ${k} Striche weiter?`,a+k*st,'Wie viel sind alle Schritte zusammen?',`${k} Schritte zu je ${gzf(st)}: ${k} · ${gzf(st)} = ${gzf(k*st)}\n${gzf(a)} + ${gzf(k*st)} = ${gzf(a+k*st)}`]},
  ()=>{const [e,nm]=stelle(),plus=R(0,1);k=R(2,9);n=plus?R(100000,999999-k*e):R(100000+k*e,999999);const r=plus?n+k*e:n-k*e;
   return[`Welche Zahl ist um ${k} ${nm} ${plus?'größer':'kleiner'} als ${gzf(n)}?`,r,`${k} ${nm} sind ${gzf(k*e)}.`,`${k} ${nm} sind ${gzf(k*e)}.\n${gzf(n)} ${plus?'+':'−'} ${gzf(k*e)} = ${gzf(r)}`]}])()}],
['kopf4','Kopfrechnen',d=>{let a,b,n;
 if(d==1){const e=P([100,1000]),E=e==100?'H':'T',W=e==100?'Hundertern':'Tausendern';if(e==100){a=R(11,89)*100;b=R(11,89)*100}else{a=R(2,60)*1000;b=R(2,39)*1000}
  if(R(0,1))return[`${gzf(a)} + ${gzf(b)} = ?`,a+b,`Rechne mit ${W}.`,`Rechne mit ${W}: ${a/e} ${E} + ${b/e} ${E} = ${(a+b)/e} ${E}\nAlso ${gzf(a)} + ${gzf(b)} = ${gzf(a+b)}`];
  if(a<b)[a,b]=[b,a];if(a==b)a+=e;return[`${gzf(a)} − ${gzf(b)} = ?`,a-b,`Rechne mit ${W}.`,`Rechne mit ${W}: ${a/e} ${E} − ${b/e} ${E} = ${(a-b)/e} ${E}\nAlso ${gzf(a)} − ${gzf(b)} = ${gzf(a-b)}`]}
 if(d==2){if(R(0,1)){do n=R(1001,4999);while(n%1000==0);const t=Math.floor(n/1000)*1000,r=n-t;
   return[`Wie viel ist das Doppelte von ${n}?`,2*n,'Verdopple Tausender und Rest getrennt.',`Zerlege ${n} in ${t} + ${r}.\n${t} · 2 = ${2*t} und ${r} · 2 = ${2*r}\nZusammen: ${2*t} + ${2*r} = ${gzf(2*n)}`]}
  n=2*R(1001,4999);const t=Math.floor(n/2000)*2000,r=n-t;
  return[`Wie viel ist die Hälfte von ${n}?`,n/2,'Zerlege die Zahl in Teile, die du leicht halbieren kannst.',r?`Zerlege ${n} in ${t} + ${r}.\nDie Hälfte von ${t} ist ${t/2}, die Hälfte von ${r} ist ${r/2}.\nZusammen: ${t/2} + ${r/2} = ${n/2}`:`Die Hälfte von ${n} ist ${n/2}.`]}
 if(d==3){const x=R(2,9),y=R(2,9),p=R(0,2),q=R(p?0:1,3-p);a=x*10**p;b=y*10**q;const pr=a*b;
  if(R(0,1))return[`${gzf(a)} · ${gzf(b)} = ?`,pr,'Rechne erst ohne die Nullen und hänge sie dann an.',`Rechne erst ohne Nullen: ${x} · ${y} = ${x*y}\nHänge dann ${p+q==1?'die Null':`die ${p+q} Nullen`} an.\n${gzf(a)} · ${gzf(b)} = ${gzf(pr)}`];
  return[`${gzf(pr)} : ${gzf(b)} = ?`,a,'Denke an die Umkehraufgabe mit Mal.',`Denke an die Malaufgabe: ? · ${gzf(b)} = ${gzf(pr)}\n${gzf(a)} · ${gzf(b)} = ${gzf(pr)}\nAlso ${gzf(pr)} : ${gzf(b)} = ${gzf(a)}`]}
 if(d==4){a=R(110,899)*10;b=R(110,899)*10;const plus=R(0,1);if(!plus&&a<b)[a,b]=[b,a];if(!plus&&a==b)a+=10;
  const teile=[Math.floor(b/1000)*1000,Math.floor(b%1000/100)*100,b%100].filter(x=>x),o=[];let s=a;
  for(const t of teile){const s2=plus?s+t:s-t;o.push(`${gzf(s)} ${plus?'+':'−'} ${t} = ${gzf(s2)}`);s=s2}
  return[`${a} ${plus?'+':'−'} ${b} = ?`,plus?a+b:a-b,'Rechne in Schritten: erst die Tausender, dann die Hunderter, dann die Zehner.',`Rechne in Schritten:\n${o.join('\n')}`]}
 return P([
  ()=>{do n=R(101,999)*10;while(n%1000==0);const h=Math.ceil(n/100)*100,t=Math.ceil(n/1000)*1000,teile=[h-n,t-h,10000-t],o=[];let s=n;
   for(const x of teile)if(x){o.push(`${gzf(s)} + ${x} = ${gzf(s+x)}`);s+=x}
   return[`${n} + ? = ${gzf(10000)}`,10000-n,'Ergänze erst bis zum nächsten Hunderter, dann bis zum nächsten Tausender.',`${o.join('\n')}\nZusammen: ${teile.filter(x=>x).join(' + ')} = ${10000-n}`]},
  ()=>{const [p,q]=P([[4,25],[2,50],[5,20],[8,125]]),x=R(3,q==125?19:49),[u,v]=R(0,1)?[p,q]:[q,p];
   return[`${u} · ${x} · ${v} = ?`,p*q*x,'Vertausche die Zahlen so, dass du leicht rechnen kannst.',`Vertausche: ${p} · ${q} = ${p*q}\n${p*q} · ${x} = ${gzf(p*q*x)}`]},
  ()=>{n=R(12,99)*P([1,10]);const f=P([9,11]);
   return[`${f} · ${n} = ?`,f*n,`Rechne mit 10 · ${n} und gleiche dann aus.`,`${f} · ${n} = 10 · ${n} ${f==9?'−':'+'} ${n}\n10 · ${n} = ${10*n}\n${10*n} ${f==9?'−':'+'} ${n} = ${gzf(f*n)}`]}])()}],
['schr4','Schriftlich rechnen',d=>{let a,b,c,f;const T0='Schreibe die Zahlen genau untereinander: Einer unter Einer, Zehner unter Zehner. Fange bei den Einern an.';
 if(d==1){a=R(1000,8999);b=R(1000,8999);return[`Rechne schriftlich: ${a} + ${b} = ?`,a+b,T0,schrAdd([a,b])]}
 if(d==2){a=R(5000,99999);b=R(1000,Math.min(a-100,99999));return[`Rechne schriftlich: ${gzf(a)} − ${gzf(b)} = ?`,a-b,T0,schrSub(a,b)]}
 if(d==3){if(R(0,1)){a=R(1000,49999);b=R(1000,29999);c=R(100,9999);return[`Rechne schriftlich: ${gzf(a)} + ${gzf(b)} + ${c} = ?`,a+b+c,T0,schrAdd([a,b,c])]}
  a=R(2,9)*10000+R(0,1)*R(1,9)*100;b=R(1000,a-1000);return[`Rechne schriftlich: ${gzf(a)} − ${gzf(b)} = ?`,a-b,T0+' Pass bei den Nullen auf.',schrSub(a,b)]}
 if(d==4){if(R(0,1)){a=R(1000,9999);f=R(3,9);return[`Rechne schriftlich: ${a} · ${f} = ?`,a*f,'Rechne von rechts nach links und vergiss die gemerkten Zahlen nicht.',schrMul(a,f)]}
  a=R(120,999);do b=R(12,49);while(b%10==0);const b1=Math.floor(b/10),b2=b%10;
  return[`Rechne schriftlich: ${a} · ${b} = ?`,a*b,`Rechne ${a} · ${b1*10} und ${a} · ${b2} und zähle beides zusammen.`,`${a} · ${b1} = ${a*b1}, eine Stelle nach links gerückt (mal 10): ${gzf(a*b1*10)}\n${a} · ${b2} = ${a*b2}\n${gzf(a*b1*10)} + ${a*b2} = ${gzf(a*b)}`]}
 f=R(3,9);const q=R(400,9999);return[`Rechne schriftlich: ${gzf(q*f)} : ${f} = ?`,q,`Fange vorne an: Wie oft passt die ${f} in die ersten Ziffern?`,schrDiv(q*f,f)]}],
['gr4','Größen',d=>{let n,x,a,b,p,q;const nm=P(NAM4);
 if(d==1){const [g1,g2,f]=P([['€','ct',100],['m','cm',100],['cm','mm',10],['km','m',1000],['kg','g',1000],['t','kg',1000],['l','ml',1000],['min','s',60],['h','min',60]]);n=R(2,f==10?19:12);
  return[`${n} ${g1} = ? ${g2}`,n*f,'',`1 ${g1} = ${gzf(f)} ${g2}\n${n} · ${gzf(f)} = ${gzf(n*f)}\nAlso ${n} ${g1} = ${gzf(n*f)} ${g2}`]}
 if(d==2)return P([
  ()=>{const [g1,g2,f]=P([['€','ct',100],['m','cm',100],['cm','mm',10],['km','m',1000],['kg','g',1000],['t','kg',1000],['l','ml',1000],['min','s',60],['h','min',60]]);n=R(1,9);x=f==1000?R(1,99)*10:R(1,f-1);
   return[`${n} ${g1} ${x} ${g2} = ? ${g2}`,n*f+x,`Rechne erst die ${g1} in ${g2} um.`,`${n} ${g1} = ${gzf(n*f)} ${g2}\n${gzf(n*f)} ${g2} + ${x} ${g2} = ${gzf(n*f+x)} ${g2}`]},
  ()=>{do n=R(101,2999);while(n%100==0);return[`${n} ct = ? €`,n/100,'100 ct = 1 €. Die Cent stehen hinter dem Komma.',`100 ct = 1 €\n${n} ct = ${Math.floor(n/100)} € ${n%100} ct = ${eu2(n)} €`]},
  ()=>{do n=R(101,999);while(n%100==0);return[`${n} cm = ? m`,n/100,'100 cm = 1 m. Die Zentimeter stehen hinter dem Komma.',`100 cm = 1 m\n${n} cm = ${Math.floor(n/100)} m ${n%100} cm = ${de(String(n/100))} m`]}])();
 if(d==3)return P([
  ()=>{const W=[['eine Bürste',70,198],['ein Halfter',240,498],['eine Tüte Möhren',26,60],['Leckerlis',40,100],['einen Striegel',50,138],['ein Pferdebuch',160,300]].sort(()=>Math.random()-.5);
   p=R(W[0][1],W[0][2])*5;q=R(W[1][1],W[1][2])*5;const s=p+q,g=[1000,2000,5000].find(x=>x>s);
   return[`${nm} kauft ${W[0][0]} für ${eu2(p)} € und ${W[1][0]} für ${eu2(q)} €. ${nm} bezahlt mit einem ${g/100}-€-Schein. Wie viel Rückgeld gibt es (in €)?`,(g-s)/100,'Rechne zuerst aus, was alles zusammen kostet.',`Zusammen: ${eu2(p)} € + ${eu2(q)} € = ${eu2(s)} €\nRückgeld: ${eu2(g)} € − ${eu2(s)} € = ${eu2(g-s)} €`]},
  ()=>{a=R(1,5);x=R(1,19)*50;b=R(1,5);const y=R(1,19)*50,h=a*1000+x,r=b*1000+y;
   return[`Ein Ausritt geht ${a} km ${x} m hin und ${b} km ${y} m zurück. Wie lang ist der Weg zusammen (in m)?`,h+r,'Rechne beide Strecken in Meter um.',`Hinweg: ${a} km ${x} m = ${gzf(h)} m\nRückweg: ${b} km ${y} m = ${gzf(r)} m\nZusammen: ${gzf(h)} m + ${gzf(r)} m = ${gzf(h+r)} m`]},
  ()=>{const t=R(1,2),r=R(1,9)*100,L=1000*t+r;do{p=R(45,70)*10;q=R(45,70)*10}while(p+q>L-50);
   return[`Ein Pferdeanhänger darf ${t} t ${r} kg laden. Darin stehen zwei Pferde mit ${p} kg und ${q} kg. Wie viel darf noch dazu (in kg)?`,L-p-q,'Rechne die Tonnen erst in Kilogramm um.',`${t} t ${r} kg = ${L} kg\nPferde zusammen: ${p} kg + ${q} kg = ${p+q} kg\n${L} kg − ${p+q} kg = ${L-p-q} kg`]}])();
 if(d==4)return P([
  ()=>{let s,D,e,h;do{s=R(96,216)*5;D=R(3,24)*5;e=s+D;h=Math.ceil(s/60)*60}while(s==h||e<=h);// immer über eine volle Stunde hinweg
   return[`Die Reitstunde beginnt um ${uhr(s)} Uhr und endet um ${uhr(e)} Uhr. Wie lange dauert sie (in min)?`,D,'Rechne erst bis zur nächsten vollen Stunde.',h>s&&e>h?`Von ${uhr(s)} bis ${uhr(h)} Uhr: ${h-s} min\nVon ${uhr(h)} bis ${uhr(e)} Uhr: ${e-h} min\nZusammen: ${h-s} + ${e-h} = ${D} min`:`Von ${uhr(s)} bis ${uhr(e)} Uhr sind es ${D} min.`]},
  ()=>{const w=R(2,6),t=R(1,6);return[`${w} Wochen und ${t} Tage = ? Tage`,7*w+t,'1 Woche hat 7 Tage.',`${w} Wochen = ${w} · 7 = ${7*w} Tage\n${7*w} + ${t} = ${7*w+t} Tage`]},
  ()=>{x=R(2,6)*5;const w=R(1,4);return[`${nm} übt jeden Tag ${x} Minuten Mathe. Wie viele Minuten sind das in ${w==1?'einer Woche':w+' Wochen'} (in min)?`,7*w*x,'Wie viele Tage sind das?',`${w==1?'Eine Woche':w+' Wochen'} = ${7*w} Tage\n${7*w} · ${x} min = ${7*w*x} min`]}])();
 return P([
  ()=>{p=R(2,6);const kg=R(8,14),w=R(1,3),wt=w==1?'einer Woche':w+' Wochen';
   return[`Ein Pferd frisst am Tag ${kg} kg Heu. Wie viel Heu fressen ${p} Pferde in ${wt} (in kg)?`,kg*p*7*w,'Rechne erst aus, wie viel alle Pferde an einem Tag fressen.',`${p} Pferde an einem Tag: ${p} · ${kg} kg = ${p*kg} kg\n${w==1?'Eine Woche':w+' Wochen'} = ${7*w} Tage\n${7*w} · ${p*kg} kg = ${gzf(7*w*p*kg)} kg`]},
  ()=>{const L=R(2,12),bm=P([100,200,250,500]);return[`In einen Eimer passen ${L} l Wasser. Wie viele Becher mit je ${bm} ml kann man damit füllen?`,1000*L/bm,'Rechne die Liter in Milliliter um.',`${L} l = ${gzf(1000*L)} ml\n${gzf(1000*L)} ml : ${bm} ml = ${1000*L/bm}`]},
  ()=>{n=R(3,9);p=R(30,300)*5;return[`${n} Säcke Möhren kosten zusammen ${eu2(n*p)} €. Wie viel kostet ein Sack (in €)?`,p/100,'Rechne in Cent.',`${eu2(n*p)} € = ${n*p} ct\n${n*p} ct : ${n} = ${p} ct = ${eu2(p)} €`]},
  ()=>{const L=R(5,20),s=P([30,40,60,70,75,80]),q=Math.floor(100*L/s),r=100*L-q*s;
   return[`Ein Seil ist ${L} m lang. ${nm} schneidet davon Stücke mit je ${s} cm ab. Wie viele ganze Stücke werden es?`,q,'Rechne die Meter in Zentimeter um.',`${L} m = ${100*L} cm\n${100*L} : ${s} = ${q} Rest ${r}\nAlso ${q} ganze Stücke.`]}])()}],
['geo4','Geometrie',d=>{let a,b,n,c,A,B,dd;
 if(d==1){if(R(0,1)){a=R(3,15);b=R(2,12);if(a==b)a++;return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang in cm?`,2*(a+b),'Der Umfang ist der Weg einmal ganz außen herum.',`Umfang = ${a} + ${b} + ${a} + ${b} = ${2*(a+b)} cm`,{t:'rechteck',a,b}]}
  a=R(2,15);return[`Ein Quadrat hat die Seitenlänge ${a} cm. Wie groß ist der Umfang in cm?`,4*a,'Ein Quadrat hat 4 gleich lange Seiten.',`Umfang = 4 · ${a} = ${4*a} cm`,{t:'rechteck',a,b:a}]}
 if(d==2)return P([
  ()=>{a=R(2,10);b=R(2,10);return[`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie viele Kästchen mit 1 cm Seitenlänge passen hinein?`,a*b,'Wie viele Kästchen passen in eine Reihe, und wie viele Reihen gibt es?',`In eine Reihe passen ${a} Kästchen, es gibt ${b} Reihen.\n${b} · ${a} = ${a*b} Kästchen`,{t:'rechteck',a,b}]},
  ()=>{a=R(2,15);return[`Ein Quadrat hat den Umfang ${4*a} cm. Wie lang ist eine Seite in cm?`,a,'Ein Quadrat hat 4 gleich lange Seiten.',`${4*a} cm : 4 = ${a} cm`,{t:'rechteck',a,b:a,la:'?',lb:'?'}]},
  ()=>{a=R(5,15);b=R(2,a-1);return[`Ein Rechteck hat den Umfang ${2*(a+b)} cm und ist ${a} cm lang. Wie breit ist es in cm?`,b,'Länge und Breite zusammen sind der halbe Umfang.',`Länge + Breite = halber Umfang: ${2*(a+b)} cm : 2 = ${a+b} cm\nBreite = ${a+b} cm − ${a} cm = ${b} cm`,{t:'rechteck',a,b,lb:'?'}]}])();
 if(d==3)return P([
  ()=>{a=R(2,15);return[`Ein Würfel hat die Kantenlänge ${a} cm. Wie lang sind alle Kanten zusammen (in cm)?`,12*a,'Wie viele Kanten hat ein Würfel?',`Ein Würfel hat 12 gleich lange Kanten.\n12 · ${a} cm = ${12*a} cm`]},
  ()=>{a=R(2,6);b=R(2,5);const h=R(2,4);return[`Ein Quader ist aus kleinen Würfeln gebaut: ${a} Würfel lang, ${b} Würfel breit und ${h} Würfel hoch. Wie viele kleine Würfel sind es?`,a*b*h,'Wie viele Würfel liegen in einer Schicht?',`Eine Schicht: ${a} · ${b} = ${a*b} Würfel\n${h} Schichten: ${h} · ${a*b} = ${a*b*h} Würfel`]},
  ()=>{const [w,v]=P([['Ecken',8],['Kanten',12],['Flächen',6]]),k=P(['Würfel','Quader']);n=R(2,9);return[`Wie viele ${w} haben ${n} ${k} zusammen?`,n*v,`Wie viele ${w} hat ein ${k}?`,`Ein ${k} hat ${v} ${w}.\n${n} · ${v} = ${n*v}`]}])();
 if(d==4){const M=P([100,200,1000]);c=R(2,15);const cm=c*M,m=cm/100;
  return R(0,1)?[`Auf einem Plan mit dem Maßstab 1 : ${M} ist der Reitplatz ${c} cm lang. Wie lang ist er in Wirklichkeit (in m)?`,m,`1 cm auf dem Plan sind ${M} cm in Wirklichkeit.`,`1 cm auf dem Plan sind ${M} cm in Wirklichkeit.\n${c} · ${M} cm = ${gzf(cm)} cm = ${m} m`]:
   [`In Wirklichkeit ist eine Koppel ${m} m lang. Wie lang ist sie auf einem Plan mit dem Maßstab 1 : ${M} (in cm)?`,c,'Rechne die Meter erst in Zentimeter um.',`${m} m = ${gzf(cm)} cm\n${gzf(cm)} cm : ${M} = ${c} cm`]}
 return P([
  ()=>{A=R(8,15);B=R(8,15);c=R(2,A-4);dd=R(2,B-4);return[`Aus einer Ecke eines Rechtecks (${A} cm lang, ${B} cm breit) wird ein kleines Rechteck herausgeschnitten, ${c} cm lang und ${dd} cm breit. Wie groß ist die Fläche, die übrig bleibt (in cm²)?`,A*B-c*dd,'Große Fläche minus herausgeschnittene Fläche.',`Große Fläche: ${A} · ${B} = ${A*B} cm²\nHerausgeschnitten: ${c} · ${dd} = ${c*dd} cm²\n${A*B} − ${c*dd} = ${A*B-c*dd} cm²`,{t:'ausschnitt',A,B,c,d:dd}]},
  ()=>{A=R(8,15);B=R(8,15);c=R(2,A-4);dd=R(2,B-4);return[`Aus einer Ecke eines Rechtecks (${A} cm lang, ${B} cm breit) wird ein kleines Rechteck herausgeschnitten, ${c} cm lang und ${dd} cm breit. Wie groß ist der Umfang der Figur, die übrig bleibt (in cm)?`,2*(A+B),'Schiebe die beiden Kanten in der Ecke in Gedanken nach außen.',`Die zwei Kanten in der Ecke sind genauso lang wie die Stücke, die außen fehlen (${c} cm und ${dd} cm).\nDer Umfang bleibt also wie beim ganzen Rechteck: 2 · (${A} + ${B}) = ${2*(A+B)} cm`,{t:'ausschnitt',A,B,c,d:dd}]},
  ()=>{a=R(10,40);b=R(8,30);n=R(2,4);return[`Eine rechteckige Koppel ist ${a} m lang und ${b} m breit. Der Zaun hat ${n} Latten übereinander. Wie viele Meter Latten braucht man (in m)?`,2*(a+b)*n,'Berechne zuerst den Umfang der Koppel.',`Umfang: 2 · (${a} + ${b}) = ${2*(a+b)} m\n${n} Latten übereinander: ${n} · ${2*(a+b)} m = ${2*(a+b)*n} m`]}])()}],
['sach4','Sachaufgaben',d=>{const nm=P(NAM4);let a,b,c,n,p,q,r,g;
 if(d==1)return P([
  ()=>{a=R(3,9);b=R(3,9);return[`Im Reitstall gibt es ${a} Reihen mit je ${b} Boxen. Wie viele Boxen sind es zusammen?`,a*b,'',`${a} · ${b} = ${a*b} Boxen`]},
  ()=>{n=R(3,9);q=R(3,12);return[`${n*q} Möhren werden gerecht an ${n} Pferde verteilt. Wie viele Möhren bekommt jedes Pferd?`,q,'',`${n*q} : ${n} = ${q} Möhren`]},
  ()=>{a=R(12,48);b=R(5,25);return[`Am Montag kommen ${a} Kinder zum Reiten, am Dienstag ${b} mehr. Wie viele Kinder kommen am Dienstag?`,a+b,'',`${a} + ${b} = ${a+b} Kinder`]},
  ()=>{a=R(30,90);b=R(5,a-10);return[`Im Heulager liegen ${a} Ballen. ${b} Ballen werden verfüttert. Wie viele Ballen bleiben übrig?`,a-b,'',`${a} − ${b} = ${a-b} Ballen`]}])();
 if(d==2)return P([
  ()=>{a=R(2,6);p=R(2,5);b=R(4,15);return[`${nm} kauft ${a} Beutel Möhren zu je ${p} € und eine Bürste für ${b} €. Wie viel muss ${nm} bezahlen (in €)?`,a*p+b,'Rechne erst die Möhren aus.',`Möhren: ${a} · ${p} € = ${a*p} €\nMit Bürste: ${a*p} € + ${b} € = ${a*p+b} €`]},
  ()=>{n=R(3,6);p=R(3,8);g=P([50,100]);return[`${nm} hat ${g} €. ${nm} kauft ${n} Packungen Leckerlis zu je ${p} €. Wie viel Geld bleibt übrig (in €)?`,g-n*p,'Rechne erst aus, was die Leckerlis kosten.',`Leckerlis: ${n} · ${p} € = ${n*p} €\nÜbrig: ${g} € − ${n*p} € = ${g-n*p} €`]},
  ()=>{a=R(3,8);b=R(6,10);c=R(2,9);return[`In der Reitschule gibt es ${a} Gruppen mit je ${b} Kindern. Heute fehlen ${c} Kinder. Wie viele Kinder sind da?`,a*b-c,'Wie viele Kinder sind es, wenn alle da sind?',`Alle zusammen: ${a} · ${b} = ${a*b} Kinder\nEs fehlen ${c}: ${a*b} − ${c} = ${a*b-c} Kinder`]},
  ()=>{a=R(4,9);b=R(2,5);c=R(2,5);return[`Jedes der ${a} Pferde bekommt morgens ${b} und abends ${c} Möhren. Wie viele Möhren sind das an einem Tag?`,a*(b+c),'Wie viele Möhren bekommt ein Pferd am Tag?',`Ein Pferd: ${b} + ${c} = ${b+c} Möhren\n${a} Pferde: ${a} · ${b+c} = ${a*(b+c)} Möhren`]}])();
 if(d==3)return P([
  ()=>{a=R(12,25);n=R(6,15);const z=a-a%10,e=a%10;return[`Eine Reitstunde kostet ${a} €. Wie viel kosten ${n} Reitstunden (in €)?`,n*a,'Zerlege den Preis in Zehner und Einer.',e?`${n} · ${a} = ${n} · ${z} + ${n} · ${e}\n= ${n*z} + ${n*e} = ${n*a} €`:`${n} · ${a} = ${n*a} €`]},
  ()=>{a=R(30,150)*10;b=R(5,40)*10;return[`Ein Reitturnier dauert 3 Tage. Am ersten Tag kommen ${a} Zuschauer, am zweiten Tag ${b} mehr und am dritten Tag doppelt so viele wie am ersten. Wie viele Zuschauer sind es zusammen?`,4*a+b,'Rechne jeden Tag einzeln aus.',`1. Tag: ${a}\n2. Tag: ${a} + ${b} = ${a+b}\n3. Tag: 2 · ${a} = ${2*a}\nZusammen: ${a} + ${a+b} + ${2*a} = ${gzf(4*a+b)}`]},
  ()=>{p=R(150,350);q=R(150,400);return[`Ein Pony wiegt ${p} kg. Ein Pferd ist ${q} kg schwerer. Wie viel wiegen beide zusammen (in kg)?`,2*p+q,'Rechne erst aus, was das Pferd wiegt.',`Pferd: ${p} kg + ${q} kg = ${p+q} kg\nZusammen: ${p} kg + ${p+q} kg = ${2*p+q} kg`]},
  ()=>{const s=R(2,6),w=R(5,15);return[`${nm} spart jede Woche ${s} €. Ein Reithelm kostet ${s*w} €. Wie viele Wochen muss ${nm} sparen?`,w,'Wie oft passt der Wochenbetrag in den Preis?',`${s*w} € : ${s} € = ${w} Wochen`]}])();
 if(d==4)return P([
  ()=>{g=P([4,5,6,8]);do n=R(20,60);while(n%g==0);q=Math.floor(n/g);r=n%g;return[`${n} Kinder wollen ausreiten. In eine Gruppe passen höchstens ${g} Kinder. Wie viele Gruppen braucht man mindestens?`,q+1,'Was passiert mit den Kindern, die übrig bleiben?',`${n} : ${g} = ${q} Rest ${r}\nFür die übrigen ${r} Kinder braucht man noch eine Gruppe: ${q} + 1 = ${q+1}`]},
  ()=>{const j=R(4,9);let m;do m=R(30,80);while(m%j==0);q=Math.floor(m/j);r=m%j;
   return R(0,1)?[`In einem Sack sind ${m} Möhren. Jedes Pferd bekommt ${j} Möhren. Wie viele Pferde bekommen ihre ${j} Möhren?`,q,'Teile mit Rest.',`${m} : ${j} = ${q} Rest ${r}\nDie ${r} übrigen Möhren reichen nicht für ein weiteres Pferd. Also ${q} Pferde.`]:
    [`In einem Sack sind ${m} Möhren. Jedes Pferd bekommt ${j} Möhren, bis es für keins mehr reicht. Wie viele Möhren bleiben übrig?`,r,'Teile mit Rest.',`${m} : ${j} = ${q} Rest ${r}\nEs bleiben ${r} Möhren übrig.`]},
  ()=>{p=P([40,50,52,60]);let k;do k=R(80,250);while(k%p==0);q=Math.floor(k/p);r=k%p;
   return[`${k} Kinder fahren zu einem Reitturnier. In einen Bus passen ${p} Kinder. Wie viele Busse braucht man?`,q+1,'Was passiert mit den Kindern, die übrig bleiben?',`${q} Busse haben ${q} · ${p} = ${q*p} Plätze.\n${k} − ${q*p} = ${r} Kinder haben noch keinen Platz.\nAlso braucht man ${q} + 1 = ${q+1} Busse.`]}])();
 return P([
  ()=>{n=R(3,6);p=R(4,15);const m=R(n+1,12);return[`${n} Säcke Futter kosten ${n*p} €. Wie viel kosten ${m} Säcke (in €)?`,m*p,'Rechne erst aus, was ein Sack kostet.',`1 Sack: ${n*p} € : ${n} = ${p} €\n${m} Säcke: ${m} · ${p} € = ${m*p} €`]},
  ()=>{const t=R(5,12)*5,ps=R(2,6)*5;n=R(3,6);return[`Ein Hufschmied braucht für ein Pferd ${t} Minuten. Er beschlägt ${n} Pferde und macht zwischendurch einmal ${ps} Minuten Pause. Wie lange braucht er insgesamt (in min)?`,n*t+ps,'Rechne erst die Zeit für alle Pferde aus.',`${n} Pferde: ${n} · ${t} min = ${n*t} min\nMit Pause: ${n*t} min + ${ps} min = ${n*t+ps} min`]},
  ()=>{const E=R(6,12),K=R(3,E-2),e=R(1,2),k=R(2,4),s=e*E+k*K,G=s<50?50:100,fam=P(['Müller','Schmidt','Becker','Wagner','Koch']);
   return[`Beim Reitturnier kostet der Eintritt für Erwachsene ${E} € und für Kinder ${K} €. Familie ${fam} kommt mit ${e==1?'einem Erwachsenen':e+' Erwachsenen'} und ${k} Kindern und bezahlt mit ${G} €. Wie viel Geld gibt es zurück (in €)?`,G-s,'Rechne Erwachsene und Kinder getrennt aus.',`Erwachsene: ${e} · ${E} € = ${e*E} €\nKinder: ${k} · ${K} € = ${k*K} €\nZusammen: ${e*E} € + ${k*K} € = ${s} €\nZurück: ${G} € − ${s} € = ${G-s} €`]},
  ()=>{const m=R(1,11)*5;n=R(2,4);return[`Ein Ausritt dauert 1 h ${m} min. ${nm} reitet in einer Woche ${n}-mal aus. Wie lange ist ${nm} zusammen unterwegs (in min)?`,n*(60+m),'Rechne die Zeit erst in Minuten um.',`1 h ${m} min = ${60+m} min\n${n} · ${60+m} min = ${n*(60+m)} min`]}])()}]];
// Drei Themen "Sudoku" (Klasse 5, Klasse 6, Klasse 7 und 8), je Stufe Größe und Denkweise aus SUDST
const SUDOKU=[['sud5',5],['sud6',6],['sud78',78]].map(([k,g])=>[k,'Sudoku',d=>sudAufgabe(...SUDST[g][d-1])]);
T[6]=[TB,TD,TS,...T[5].filter(t=>t[0]=='trick'||t[0]=='knob')];
T[8]=[TL,TG,TP,TY,...T[7].filter(t=>t[0]=='zt')];
// Alle Themen nach Schlüssel und Kategorien je Klasse (seit 2026-10-18; Schulstoff vorläufig, wird an die Mathebücher angepasst).
// T[g] bleibt die Liste der Themen einer Klasse (Schulstoff und Olympiade), frühere Klassen kommen in app.js als "Wiederholen" dazu.
T[7].push(TF7,TZ,TW);// Klasse 7 nach dem Mathebuch (seit 2026-10-24)
// THEMA enthält auch Themen, die in keiner Klasse mehr gewählt werden können (z. B. "term"), damit alte Fehlerheft-Einträge und Trainingsaufgaben gültig bleiben
T[4]=T4;// Klasse 4 (seit 2026-10-24)
const THEMA={};for(const g of KL)for(const t of T[g])THEMA[t[0]]=t;for(const t of SUDOKU)THEMA[t[0]]=t;THEMA.logik=TLOG;
// sud: Sudoku als eigene Kategorie unter "Mathe-Olympiade & Knobeln" (seit 2026-10-20)
// Klasse 4: Grundschulstoff, Einmaleins steht auch hier. Olympiade und Sudoku wie Klasse 5.
const KAT={4:{schul:['zr4','ee','kopf4','schr4','gr4','geo4','sach4'],oly:['folgen','knob'],sud:['sud5']},
 5:{schul:['ee','rechnen','groessen','umfl','teil'],oly:['folgen','trick','knob'],sud:['sud5']},
 6:{schul:['bruch','dez','dreisatz'],oly:['trick','knob'],sud:['sud6']},
 // Klasse 7 seit 2026-10-24 in der Reihenfolge des Mathebuchs: Flächen (1), Zuordnungen (2), Prozent (3), Winkel (4), Rationale Zahlen (5),
 // Wahrscheinlichkeit (7), Gleichungen (8). Kap. 6 (Dreiecke konstruieren) geht nicht als Rechenaufgabe. "Terme" steckt in "Gleichungen & Terme".
 7:{schul:['fl7','zuord','pz','winkel','rat','wk','gl'],oly:['zt','wege'],sud:['sud78']},
 8:{schul:['lf','gls','pot','pyth'],oly:['zt'],sud:['sud78']}};
for(const g of KL)KAT[g].oly.push('logik');// Logik-Rätsel für alle Klassen (seit 2026-10-24)
for(const g of KL)T[g]=[...KAT[g].schul,...KAT[g].oly,...KAT[g].sud].map(k=>THEMA[k]);
// Knobel-Themen (Olympiade und Sudoku aller Klassen): höchstens 2 Runden am Stück, dann erst eine Runde Schulstoff mit mindestens 7 von 10
const KNOBEL=new Set(KL.flatMap(g=>[...KAT[g].oly,...KAT[g].sud]));
