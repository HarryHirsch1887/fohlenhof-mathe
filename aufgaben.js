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
 if(d==3){n=R(20,100);return[`1 + 2 + 3 + … + ${n} = ?`,n*(n+1)/2,'Bilde Paare: erste + letzte Zahl, zweite + vorletzte …',`Bilde Paare: 1 + ${n} = ${n+1}, 2 + ${n-1} = ${n+1}, 3 + ${n-2} = ${n+1} …\nJedes Paar ergibt ${n+1}. Bei ${n} Zahlen gibt es ${n} : 2 Paare.\n${n} · ${n+1} : 2 = ${n*(n+1)} : 2 = ${n*(n+1)/2}.`]}
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
['rat','Negative Zahlen',d=>{let a,b,c,e;
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
 if(d==4){b=P([2,4,5,10]);e=P([2,4,5,10]);a=R(1,b-1);c=R(1,e-1);pr=f1(a*c/(b*e));return[`Berechne ${a}/${b} · ${c}/${e} und gib das Ergebnis als Dezimalzahl an.`,pr,'Zähler mal Zähler, Nenner mal Nenner.',`Zähler mal Zähler, Nenner mal Nenner: ${a}/${b} · ${c}/${e} = ${a*c}/${b*e}\nAls Dezimalzahl: ${a*c} : ${b*e} = ${pr}`]}
 do{a=P([2,3,4,6]);b=P([2,3,4,6])}while(12/a+12/b>=12);return[`Von einer Pizza isst Anna 1/${a} und Ben 1/${b}. Wie viele Zwölftel der Pizza bleiben übrig?`,12-12/a-12/b,'Erweitere auf Zwölftel.',`1/${a} = ${12/a}/12 und 1/${b} = ${12/b}/12\nZusammen gegessen: ${12/a} + ${12/b} = ${12/a+12/b} Zwölftel\nÜbrig: 12 − ${12/a+12/b} = ${12-12/a-12/b} Zwölftel`]}],
TD=['dez','Dezimalzahlen',d=>{let p,q,ia,ib,iq,ip,iw,a,b;
 if(d==1){q=P([2,4,5,8,10,20,25]);p=R(1,q-1);return[`Schreibe ${p}/${q} als Dezimalzahl.`,f1(p/q),'Teile den Zähler durch den Nenner.',`Ein Bruch ist eine Divisionsaufgabe: ${p} : ${q} = ${f1(p/q)}`]}
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
// Drei Themen "Sudoku" (Klasse 5, Klasse 6, Klasse 7 und 8), je Stufe Größe und Denkweise aus SUDST
const SUDOKU=[['sud5',5],['sud6',6],['sud78',78]].map(([k,g])=>[k,'Sudoku',d=>sudAufgabe(...SUDST[g][d-1])]);
T[6]=[TB,TD,TS,...T[5].filter(t=>t[0]=='trick'||t[0]=='knob')];
T[8]=[TL,TG,TP,TY,...T[7].filter(t=>t[0]=='zt')];
// Alle Themen nach Schlüssel und Kategorien je Klasse (seit 2026-10-18; Schulstoff vorläufig, wird an die Mathebücher angepasst).
// T[g] bleibt die Liste der Themen einer Klasse (Schulstoff und Olympiade), frühere Klassen kommen in app.js als "Wiederholen" dazu.
const THEMA={};for(const g of [5,6,7,8])for(const t of T[g])THEMA[t[0]]=t;for(const t of SUDOKU)THEMA[t[0]]=t;
// sud: Sudoku als eigene Kategorie unter "Mathe-Olympiade & Knobeln" (seit 2026-10-20)
const KAT={5:{schul:['rechnen','groessen','umfl','teil'],oly:['folgen','trick','knob'],sud:['sud5']},
 6:{schul:['bruch','dez','dreisatz'],oly:['trick','knob'],sud:['sud6']},
 7:{schul:['gl','term','pz','rat','winkel'],oly:['zt','wege'],sud:['sud78']},
 8:{schul:['lf','gls','pot','pyth'],oly:['zt'],sud:['sud78']}};
for(const g of [5,6,7,8])T[g]=[...KAT[g].schul,...KAT[g].oly,...KAT[g].sud].map(k=>THEMA[k]);
// Knobel-Themen (Olympiade und Sudoku aller Klassen): höchstens 2 Runden am Stück, dann erst eine Runde Schulstoff mit mindestens 7 von 10
const KNOBEL=new Set([5,6,7,8].flatMap(g=>[...KAT[g].oly,...KAT[g].sud]));
