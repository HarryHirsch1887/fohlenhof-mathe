// Tempo-Test: mehrere gezeichnete 2D-Pferde (Bilderbuch-Look aus Variante A) gleichzeitig auf der Koppel.
// Jedes Pferd bekommt eigene Kennungen und eigene Farbverläufe, damit mehrere Pferde mit verschiedenen Fellfarben möglich sind.
// Keine Netzwerkzugriffe, keine Speicherung.
(() => {
'use strict';
const svg = document.getElementById('bild'), fpsEl = document.getElementById('fps'), szene = document.getElementById('szene');
const rnd = a => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const R = n => Math.round(n * 10) / 10;

const FELL = {
  falbe: { k1: '#e8cc9c', k2: '#cfae7c', k3: '#a7824f', u: '#3b2f28', maul: '#4a3a30', h1: '#3e3029', h2: '#a09078', huf: '#3a332c', aal: 1, beh: 1 },
  rappe: { k1: '#55555e', k2: '#2e2e34', k3: '#1b1b1f', u: '#202024', maul: '#18181b', h1: '#141417', h2: '#34343c', huf: '#2a2622' },
  schimmel: { k1: '#ffffff', k2: '#e9ebed', k3: '#c3c8cd', u: '#d2d6da', maul: '#9a9ca2', h1: '#d3d7db', h2: '#f7f7f3', huf: '#7a7468' },
  wind: { k1: '#4d4649', k2: '#2e292b', k3: '#1c191a', u: '#201c1e', maul: '#1a1718', h1: '#efe5cb', h2: '#fbf7ea', huf: '#2a2622' },
  fuchs: { k1: '#d68a48', k2: '#b5612b', k3: '#86431c', u: '#8a461e', maul: '#6a3c25', h1: '#7a3a16', h2: '#a8592c', huf: '#4a4038' }
};
const mische = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

// ---------- Zeichnung des Pferds (wie Variante A) ----------
function straehne(bx, by, dx, dy, len, w, bend, cls) {
  const nx = -dy, ny = dx, tx = bx + dx * len + nx * bend, ty = by + dy * len + ny * bend;
  const c1x = bx + dx * len * .55 + nx * (w * .55 + bend * .6), c1y = by + dy * len * .55 + ny * (w * .55 + bend * .6);
  const c2x = bx + dx * len * .5 - nx * (w * .4 - bend * .6), c2y = by + dy * len * .5 - ny * (w * .4 - bend * .6);
  return `<path class="${cls}" d="M${R(bx + nx * w / 2)} ${R(by + ny * w / 2)}Q${R(c1x)} ${R(c1y)} ${R(tx)} ${R(ty)}Q${R(c2x)} ${R(c2y)} ${R(bx - nx * w / 2)} ${R(by - ny * w / 2)}Z"/>`;
}
const qb = (a, c, b, t) => [0, 1].map(i => (1 - t) * (1 - t) * a[i] + 2 * (1 - t) * t * c[i] + t * t * b[i]);
const qbT = (a, c, b, t) => { const v = [0, 1].map(i => 2 * (1 - t) * (c[i] - a[i]) + 2 * t * (b[i] - c[i])), l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
function maehne(a, c, b, n, laenge, seed, teil) {
  const Nn = t => { const T = qbT(a, c, b, t); return [-T[1], T[0]]; }, [na, nc, nb] = [0, .5, 1].map(Nn), w = 5;
  const P = (p, n, f) => `${R(p[0] + n[0] * f)} ${R(p[1] + n[1] * f)}`;
  let s = `<path class="h1" stroke-linejoin="round" d="M${P(a, na, -w)}Q${P(c, nc, -w)} ${P(b, nb, -w)}L${P(b, nb, 2)}Q${P(c, nc, 2)} ${P(a, na, 2)}Z"/>`, hell = '';
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n, p = qb(a, c, b, t), T = qbT(a, c, b, t), N = [-T[1], T[0]];
    let dx = N[0] * .4 - T[0] * .12, dy = N[1] * .4 - T[1] * .12 + .8; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
    const bx = R(p[0] - N[0] * 1.5), by = R(p[1] - N[1] * 1.5), len = laenge(t) * (.82 + rnd(seed + i) * .36), bend = 3 + (rnd(seed + i * 3) - .3) * 8;
    s += `<g class="mh" data-t="${teil}" data-x="${bx}" data-y="${by}">${straehne(bx, by, dx, dy, len, 11, bend, 'h1')}</g>`;
    if (i % 3 === 1) hell += `<g class="mh" data-t="${teil}" data-x="${bx}" data-y="${by}">${straehne(bx + T[0] * 3, by + T[1] * 3, dx, dy, len * .85, 5, bend + 2, 'h2')}</g>`;
  }
  return s + hell;
}
function schweif() {
  let s = '', hell = '';
  for (let i = 0; i < 12; i++) {
    let dx = -.3 - i * .016 + (rnd(i * 2.2) - .5) * .12, dy = .95; const l = Math.hypot(dx, dy);
    s += straehne(-85 + i * .5, -151 + i * 1.1, dx / l, dy / l, 84 + rnd(i * 4.1) * 18, 13, 7 + (rnd(i * 5.3) - .4) * 14, 'h1');
    if (i % 4 === 1) hell += straehne(-84 + i * .5, -150 + i * 1.1, dx / l, dy / l, 76 + rnd(i * 4.1) * 14, 4.5, 9 + (rnd(i * 5.3) - .4) * 10, 'h2');
  }
  return s + hell + '<ellipse class="kK" cx="-85" cy="-149" rx="7.5" ry="6" transform="rotate(-38 -85 -149)"/>';
}
const stirnschopf = () => [0, 1, 2].map(i => straehne(96 + i * 2.2, -214 + i * .8, .52 + i * .06, .85, 13 + i * 2.5, 7, 2 - i * 2, i === 1 ? 'h2' : 'h1')).join('');
function vorderbein(id, x, y, fern) {
  const o = fern ? 'bOf' : 'bO', u = fern ? 'bUf' : 'bU', h = fern ? 'hf' : 'hu';
  return `<g id="${id}1"><path class="${o}" d="M${x - 11} ${y - 16}C${x - 12} ${y + 8} ${x - 8} ${y + 28} ${x - 5.6} ${y + 40}L${x + 5.6} ${y + 40}C${x + 8} ${y + 26} ${x + 13} ${y + 6} ${x + 13} ${y - 16}Z"/><circle class="${o}" cx="${x}" cy="${y + 42}" r="6"/>` +
    `<g id="${id}2"><path class="${u}" d="M${x - 5.4} ${y + 42}L${x - 4.6} ${y + 76}L${x + 4.4} ${y + 76}L${x + 5.4} ${y + 42}Z"/><circle class="${u}" cx="${x - .2}" cy="${y + 76}" r="5.5"/>` +
    `<g id="${id}3"><path class="beh" d="M${x - 4} ${y + 75}C${x - 7.5} ${y + 82} ${x - 7} ${y + 90} ${x - 2.5} ${y + 96}L${x + .5} ${y + 90}C${x - 1} ${y + 86} ${x - 1.5} ${y + 81} ${x} ${y + 76}Z"/>` +
    `<path class="${u}" d="M${x - 4.4} ${y + 76}L${x - .5} ${y + 88.5}L${x + 8} ${y + 88.5}L${x + 4.6} ${y + 75}Z"/><path class="${h}" d="M${x - 1} ${y + 88}L${x + 9.5} ${y + 88}L${x + 12.5} ${y + 100}L${x - 3} ${y + 100}Z"/></g></g></g>`;
}
function hinterbein(id, x, y, fern) {
  const o = fern ? 'bOf' : 'bO', u = fern ? 'bUf' : 'bU', h = fern ? 'hf' : 'hu';
  return `<g id="${id}1"><path class="${o}" d="M${x - 18} ${y - 18}C${x - 25} ${y + 8} ${x - 19} ${y + 32} ${x - 16} ${y + 46}L${x - 4} ${y + 49}C${x - 2} ${y + 30} ${x + 6} ${y + 10} ${x + 17} ${y - 14}Z"/><circle class="${o}" cx="${x - 10}" cy="${y + 48}" r="6.4"/><circle class="${o}" cx="${x - 15.5}" cy="${y + 45.5}" r="4"/>` +
    `<g id="${id}2"><path class="${u}" d="M${x - 15.2} ${y + 48}L${x - 12.8} ${y + 80}L${x - 3.6} ${y + 80}L${x - 4.8} ${y + 48}Z"/><circle class="${u}" cx="${x - 8.2}" cy="${y + 80}" r="5.5"/>` +
    `<g id="${id}3"><path class="beh" d="M${x - 12} ${y + 79}C${x - 15.5} ${y + 86} ${x - 15} ${y + 94} ${x - 10.5} ${y + 100}L${x - 7.5} ${y + 94}C${x - 9} ${y + 90} ${x - 9.5} ${y + 85} ${x - 8} ${y + 80}Z"/>` +
    `<path class="${u}" d="M${x - 12.4} ${y + 80}L${x - 8.5} ${y + 92.5}L${x} ${y + 92.5}L${x - 3.4} ${y + 79}Z"/><path class="${h}" d="M${x - 9} ${y + 92}L${x + 1.5} ${y + 92}L${x + 4.5} ${y + 104}L${x - 11} ${y + 104}Z"/></g></g></g>`;
}
const KOERPER = 'M40 -160C28 -156 16 -153 4 -153C-12 -153 -22 -157 -36 -158C-50 -160 -62 -161 -74 -157C-84 -154 -92 -146 -95 -132C-97 -120 -95 -108 -88 -98C-82 -90 -72 -86 -60 -88C-50 -90 -42 -92 -34 -90C-16 -86 12 -84 30 -88C40 -90 46 -94 52 -98C62 -100 74 -106 80 -116C85 -124 86 -134 80 -144C72 -154 56 -161 40 -160Z';
const HALS1 = 'M36 -152Q43 -177 64 -185L96 -164C94 -150 90 -136 86 -124C70 -120 46 -134 36 -152Z';
const HALS2 = 'M64 -185Q67 -211 92 -219L106 -205C102 -190 99 -176 96 -164Z';
const KOPF = 'M90 -212C98 -219 110 -213 117 -203C124 -191 132 -178 138 -167C142 -160 141 -152 135 -150C130 -149 126 -152 121 -154C115 -158 110 -163 104 -168C96 -173 89 -182 89 -193C89 -201 87 -207 90 -212Z';
const linie = (d, o = .12, w = 1.6) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const sv = v => `style="stop-color:var(--${v})"`;
// Ein Pferd mit eigenen Farbverläufen. Alle Kennungen bekommen das Präfix P, damit mehrere Pferde nebeneinander funktionieren.
function pferdMarkup(P) {
  const roh = `<g id="pferd"><defs>
<linearGradient id="gK" gradientUnits="userSpaceOnUse" x1="0" y1="-232" x2="0" y2="-84"><stop offset="0" ${sv('k1')}/><stop offset=".46" ${sv('k1')}/><stop offset=".76" ${sv('k2')}/><stop offset="1" ${sv('k3')}/></linearGradient>
<linearGradient id="gN" gradientUnits="userSpaceOnUse" x1="44" y1="-178" x2="94" y2="-140"><stop offset=".15" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gN2" gradientUnits="userSpaceOnUse" x1="70" y1="-200" x2="104" y2="-178"><stop offset=".1" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gH" gradientUnits="userSpaceOnUse" x1="96" y1="-214" x2="122" y2="-158"><stop offset=".2" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gB" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="-50"><stop offset="0" ${sv('k3')}/><stop offset=".45" ${sv('k2')}/><stop offset="1" ${sv('k3')}/></linearGradient>
<linearGradient id="gBf" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="-50"><stop offset="0" ${sv('fk3')}/><stop offset=".45" ${sv('fk2')}/><stop offset="1" ${sv('fk3')}/></linearGradient>
<clipPath id="kopfClip"><use href="#kopfForm"/></clipPath>
</defs>
<ellipse id="schatten" cx="-4" cy="1" rx="104" ry="10" fill="url(#gSchatten)"/>
<g id="koerper">
 <use href="#fernTeile" class="umriss"/>
 <g class="fuell"><g id="fernTeile">${vorderbein('vf', 42, -102, 1)}${hinterbein('hf', -66, -106, 1)}</g></g>
 <use href="#nahTeile" class="umriss"/>
 <g class="fuell"><g id="nahTeile">
  <g id="schweif">${schweif()}</g>
  ${hinterbein('hn', -58, -104, 0)}${vorderbein('vn', 50, -100, 0)}
  <path class="kK" d="${KOERPER}"/>
  <ellipse class="glanz" cx="-64" cy="-138" rx="25" ry="15" transform="rotate(-18 -64 -138)"/><ellipse class="glanz" cx="56" cy="-142" rx="15" ry="10"/>
  <path class="aal" d="M38 -158C18 -152 -8 -153 -36 -157C-52 -159 -66 -159 -80 -153"/>
  ${linie('M42 -152C52 -140 64 -127 74 -117')}${linie('M-36 -148C-46 -132 -48 -114 -42 -97', .1)}${linie('M-30 -89C-6 -85 16 -85 32 -89', .06, 3)}
  <g id="hals1"><path class="kN" d="${HALS1}"/><circle class="kN" cx="80" cy="-172" r="17"/>
   ${maehne([38, -156], [43, -177], [64, -185], 6, t => 26 + t * 8, 10, 1)}
   <g id="hals2"><path class="kN2" d="${HALS2}"/><circle class="kN2" cx="80" cy="-172" r="16.5"/>${linie('M86 -158C91 -170 96 -184 100 -196', .08, 1.4)}
    ${maehne([64, -185], [67, -211], [92, -219], 7, t => 38 - t * 12, 30, 2)}
    <g id="kopf"><path class="kKf" d="M91 -211C88 -218 87 -225 88.5 -231C93 -225 96 -219 96.5 -211Z"/><path id="kopfForm" class="kH" d="${KOPF}"/>
     <g clip-path="url(#kopfClip)"><ellipse class="maul" cx="134" cy="-158" rx="11.5" ry="10.5"/><ellipse class="glanz" cx="103" cy="-186" rx="10" ry="8"/></g>
     ${linie('M96 -177C104 -169 113 -161 121 -156', .2, 1.4)}${linie('M133 -164C136 -166 138.5 -163 136.5 -159.5', .5)}${linie('M137.5 -153.5C134 -152.4 130 -152.8 126.5 -154.2', .35, 1.2)}
     <g id="auge"><path d="M105.5 -196.5Q111 -201.5 116.5 -195.5Q111 -192.2 105.5 -196.5Z" fill="#1c1410"/><circle cx="113" cy="-197.3" r="1.25" fill="#fff"/></g>
     ${linie('M104.5 -199.2Q111 -204.6 117.5 -197.6', .3, 1.2)}
     <g id="ohr"><path class="kH" d="M98 -213C96.5 -221 97 -228 99.5 -234C103 -227 106 -220 105.5 -212Z"/><path d="M99.6 -215C99 -221 99.5 -226 100.3 -229C102.3 -224 103.5 -219 103.2 -214Z" fill="#000" opacity=".22"/></g>
     ${stirnschopf()}
    </g></g></g>
 </g></g>
</g></g>`;
  // Präfix für Kennungen und Verweise; der Schatten-Verlauf ist für alle Pferde gemeinsam
  return roh.replace(/\bid="([^"]+)"/g, `id="${P}$1"`).replace(/(href="#|url\(#)(?!gSchatten)([\w-]+)/g, `$1${P}$2`);
}

// ---------- Landschaft (wie Variante A) ----------
const WW = 2200, W0 = -900, W1 = WW + 900;
const kamm = (x, y0, amp, wl, ph) => y0 + amp * Math.sin(x / wl + ph) + amp * .45 * Math.sin(x / (wl * .37) + ph * 2.3);
function huegel(y0, amp, wl, ph, farbe) { let d = `M${W0} 900`; for (let x = W0; x <= W1; x += 40) d += `L${x} ${R(kamm(x, y0, amp, wl, ph))}`; return `<path d="${d}L${W1} 900Z" fill="${farbe}"/>`; }
function buesche(y0, amp, wl, ph, n, seed, farben, gr) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = W0 + rnd(seed + i) * (W1 - W0), y = kamm(x, y0, amp, wl, ph) + 4, r = gr * (.7 + rnd(seed + i * 2) * .6);
    s += `<g fill="${farben[i % farben.length]}"><circle cx="${R(x)}" cy="${R(y - r * .8)}" r="${R(r)}"/><circle cx="${R(x - r * .8)}" cy="${R(y - r * .4)}" r="${R(r * .75)}"/><circle cx="${R(x + r * .8)}" cy="${R(y - r * .45)}" r="${R(r * .7)}"/></g>`;
  }
  return s;
}
function buschel(x, y, h, seed, farbe) {
  let d = '';
  for (let k = 0; k < 5; k++) {
    const bx = x + (k - 2) * 2.6, lean = (k - 2) * 3.2 + (rnd(seed + k) - .5) * 5, hh = h * (.65 + rnd(seed + k * 2) * .5);
    d += `M${R(bx - 1.8)} ${R(y)}Q${R(bx + lean * .3)} ${R(y - hh * .6)} ${R(bx + lean)} ${R(y - hh)}Q${R(bx + lean * .3 + 1)} ${R(y - hh * .5)} ${R(bx + 1.8)} ${R(y)}Z`;
  }
  return `<path d="${d}" fill="${farbe}"/>`;
}
function grasFlaeche(n, y0, y1, hMin, hMax, seed, blumen) {
  const gruen = ['#6d9f4c', '#7fb258', '#5f9245', '#86b960'], bunt = ['#f4d03f', '#ffffff', '#e78ac3', '#f19a3e', '#b18cf0'];
  let s = '';
  const punkte = [...Array(n)].map((_, i) => [W0 + rnd(seed + i) * (W1 - W0), y0 + rnd(seed + i * 7) * (y1 - y0), i]).sort((a, b) => a[1] - b[1]);
  for (const [x, y, i] of punkte) {
    if (blumen && rnd(seed + i * 5) < blumen) s += `<circle cx="${R(x)}" cy="${R(y - 6)}" r="2.6" fill="${bunt[i % bunt.length]}"/>`;
    else s += buschel(x, y, hMin + rnd(seed + i * 3) * (hMax - hMin), seed + i, gruen[i % 4]);
  }
  return s;
}
function zaun() {
  let s = '<g fill="#a9805a">';
  for (const y of [-126, -104]) s += `<rect x="${W0}" y="${y}" width="${W1 - W0}" height="6" rx="2"/><rect x="${W0}" y="${y + 6}" width="${W1 - W0}" height="2" fill="#7d5c3c" opacity=".6"/>`;
  s += '</g>';
  for (let x = W0 + 20; x < W1; x += 92) s += `<rect x="${x - 4.5}" y="-138" width="9" height="62" rx="2" fill="#9b7449"/><rect x="${x - 4.5}" y="-138" width="3" height="62" rx="1.5" fill="#b78c5e"/>`;
  return s;
}
function apfelbaum(x, s) {
  let g = `<g transform="translate(${x} -76) scale(${s})"><path d="M-7 0L-5 -62L5 -62L7 0Z" fill="#6b4a2b"/>`;
  [[0, -100, 36, '#4f9a47'], [-28, -84, 26, '#468f40'], [28, -86, 27, '#468f40'], [-12, -116, 24, '#5aa24c'], [16, -112, 22, '#5aa24c']].forEach(([a, b, r, c]) => g += `<circle cx="${a}" cy="${b}" r="${r}" fill="${c}"/>`);
  for (let i = 0; i < 10; i++) g += `<circle cx="${R((rnd(i + x) - .5) * 70)}" cy="${R(-80 - rnd(i * 3 + x) * 45)}" r="3.6" fill="#c0392b"/>`;
  return g + '</g>';
}
const wolke = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="url(#gWolke)"><ellipse cx="0" cy="0" rx="62" ry="17"/><circle cx="-26" cy="-10" r="20"/><circle cx="4" cy="-20" r="27"/><circle cx="32" cy="-8" r="18"/></g>`;

// ---------- Herde ----------
// d = Tiefe: 0 hinten (klein, weiter oben), 1 vorn (groß)
const HERDE = [['falbe', .95], ['schimmel', .25], ['rappe', .7], ['wind', .45], ['fuchs', .05]];
const EBENEN = [['lWolken', .06], ['lFern', .12], ['lHuegel', .22], ['lWiese', .45], ['lZaun', .8], ['lBoden', 1], ['lHerde', 1], ['lVorne', 1], ['lGanzVorne', 1.2]];
svg.innerHTML = `<defs><style>
.kK{fill:var(--gK)}.kN{fill:var(--gN)}.kN2{fill:var(--gN2)}.kH{fill:var(--gH)}.kKf{fill:var(--fk3)}.bO{fill:var(--gB)}.bOf{fill:var(--gBf)}.bU{fill:var(--u)}.bUf{fill:var(--fu)}
.hu{fill:var(--huf)}.hf{fill:var(--fhuf)}.h1{fill:var(--h1);stroke:#000;stroke-opacity:.22;stroke-width:.8}.h2{fill:var(--h2);stroke:#000;stroke-opacity:.18;stroke-width:.8}
.glanz{fill:var(--k1);opacity:.55}.maul{fill:var(--maul);opacity:.8}.beh{fill:var(--h1);opacity:calc(var(--beh) * .85)}.aal{fill:none;stroke:var(--u);stroke-width:3.4;stroke-linecap:round;opacity:var(--aal)}
.umriss{stroke:#2a1d14;stroke-opacity:.6;stroke-width:3.8;stroke-linejoin:round}.fuell{stroke:none}.ohneUmriss .umriss{display:none}
</style>
<linearGradient id="gHimmel" gradientUnits="userSpaceOnUse" x1="0" y1="-1300" x2="0" y2="-80"><stop offset="0" stop-color="#3f95dc"/><stop offset=".62" stop-color="#8ac5ec"/><stop offset="1" stop-color="#e4f2f6"/></linearGradient>
<radialGradient id="gSonne"><stop offset="0" stop-color="#fffbe6"/><stop offset=".22" stop-color="#fff3c4" stop-opacity=".85"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
<linearGradient id="gWolke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dce8f0"/></linearGradient>
<linearGradient id="gBoden" gradientUnits="userSpaceOnUse" x1="0" y1="-86" x2="0" y2="260"><stop offset="0" stop-color="#97c977"/><stop offset="1" stop-color="#6a9f4e"/></linearGradient>
<radialGradient id="gSchatten"><stop offset="0" stop-color="#2d4a1f" stop-opacity=".4"/><stop offset="1" stop-color="#2d4a1f" stop-opacity="0"/></radialGradient>
</defs>
<rect x="${W0 - 3000}" y="-3000" width="${W1 - W0 + 6000}" height="3200" fill="url(#gHimmel)"/>
<g id="sonne"><circle r="130" fill="url(#gSonne)"/><circle r="30" fill="#fff8dc"/></g>
<g id="lWolken">${[...Array(5)].map((_, i) => wolke(W0 + i * 760 + rnd(i) * 300, 40 + rnd(i * 3) * 80, .8 + rnd(i * 5) * .7)).join('')}</g>
<g id="lFern">${huegel(-190, 30, 210, 1.2, '#b9d5cb')}</g>
<g id="lHuegel">${huegel(-158, 24, 160, 2.1, '#a5cba8')}${buesche(-158, 24, 160, 2.1, 20, 50, ['#7cad70', '#6f9f63'], 13)}</g>
<g id="lWiese">${huegel(-120, 12, 140, .4, '#99c97c')}${buesche(-120, 12, 140, .4, 10, 90, ['#6fa75f', '#5f9a54'], 16)}</g>
<g id="lZaun">${zaun()}${apfelbaum(600, 1)}${apfelbaum(1900, .9)}</g>
<g id="lBoden"><rect x="${W0}" y="-86" width="${W1 - W0}" height="1000" fill="url(#gBoden)"/>${grasFlaeche(140, -80, -40, 6, 12, 200, .14)}</g>
<g id="lHerde">${HERDE.map((_, i) => pferdMarkup('p' + i)).join('')}</g>
<g id="lVorne">${grasFlaeche(110, 10, 120, 9, 18, 900, .12)}</g>
<g id="lGanzVorne">${grasFlaeche(40, 90, 220, 22, 38, 1700, .08)}</g>`;

const $ = id => document.getElementById(id);
const rot = (el, a, p) => el.setAttribute('transform', `rotate(${R(a)} ${p[0]} ${p[1]})`);
const GANG = {
  walk: { T: 1.1, duty: .62, A: { v: 21, h: 19 }, flex: { v: 64, h: 36 }, off: { hn: 0, vn: .25, hf: .5, vf: .75 }, tempo: 125 },
  gallop: { T: .52, duty: .4, A: { v: 36, h: 31 }, flex: { v: 100, h: 58 }, off: { hf: 0, hn: .12, vf: .45, vn: .57 }, tempo: 520 }
};
function beinWinkel(g, typ, q) {
  const A = g.A[typ], d = g.duty; let a, s = 0;
  if (q < d) a = -A + 2 * A * (q / d); else { s = (q - d) / (1 - d); a = A - 2 * A * (.5 - .5 * Math.cos(Math.PI * s)); }
  const fl = Math.sin(Math.PI * s) * g.flex[typ];
  return typ === 'v' ? [a, fl, fl * .45] : [a * .9, -fl, fl * .6];
}
const RUHE = { vn: [0, 0, 0], vf: [2, 0, 0], hn: [0, 0, 0], hf: [-3, 0, 0] };
const GRASEN = { vn: [-13, 6, 2], vf: [6, 0, 0], hn: [4, 0, 0], hf: [-6, 0, 0] };
const HALTUNG = { idle: [0, 0, 0], walk: [6, 0, 0], gallop: [20, -4, 10], graze: [55, 50, -66] };
const ziehe = (w, z, k, dt) => w + (z - w) * Math.min(1, dt * k);

class Pferd {
  constructor(i, fell, d) {
    const P = 'p' + i; this.P = P; this.d = d; this.s = .5 + .5 * d; this.gy = -70 + 70 * d;
    this.el = $(P + 'pferd');
    for (const [k, v] of Object.entries({ gK: 'gK', gN: 'gN', gN2: 'gN2', gH: 'gH', gB: 'gB', gBf: 'gBf' })) this.el.style.setProperty('--' + k, `url(#${P}${v})`);
    this.fell(fell);
    this.G = Object.fromEntries(['koerper', 'schweif', 'hals1', 'hals2', 'kopf', 'auge', 'ohr', 'schatten'].map(k => [k, $(P + k)]));
    this.MH = [...this.el.querySelectorAll(`#${P}nahTeile .mh`)].map(el => ({ el, teil: +el.dataset.t, p: [+el.dataset.x, +el.dataset.y] }));
    this.BEINE = {};
    for (const [k, typ, x, y] of [['vn', 'v', 50, -100], ['vf', 'v', 42, -102], ['hn', 'h', -58, -104], ['hf', 'h', -66, -106]])
      this.BEINE[k] = { typ, g: [1, 2, 3].map(n => $(P + k + n)), piv: typ === 'v' ? [[x, y], [x, y + 42], [x, y + 76]] : [[x, y], [x - 10, y + 48], [x - 8, y + 80]] };
    Object.assign(this, { zustand: 'idle', rest: rnd(i) * 3, x: 250 + rnd(i * 3.3) * (WW - 500), dir: rnd(i * 1.7) < .5 ? 1 : -1, tempo: 0, ziel: 0, phase: rnd(i * 5), zeit: rnd(i) * 9,
      galoppZeit: 0, wende: 0, wW: 0, wG: 0, wGr: 0, blinzeln: 1 + rnd(i) * 3, ohrZeit: 2, schlagen: 0, schlagZeit: 2 + rnd(i * 2) * 4, hals: [0, 0, 0], an: true });
  }
  fell(name) {
    const f = FELL[name], s = this.el.style;
    for (const k of ['k1', 'k2', 'k3', 'u', 'maul', 'h1', 'h2', 'huf']) { s.setProperty('--' + k, f[k]); s.setProperty('--f' + k, mische(f[k], '#1a2418', .2)); }
    s.setProperty('--aal', f.aal ? .5 : 0); s.setProperty('--beh', f.beh ? 1 : 0);
  }
  // Ziele nur im sichtbaren Bereich (LO bis HI), damit alle Pferde gleichzeitig zu sehen sind
  neuesZiel(min, max) { min = Math.min(min, (HI - LO) * .3); max = Math.min(max, HI - LO); for (let i = 0; i < 30; i++) { const z = this.x + (Math.random() < .5 ? -1 : 1) * (min + Math.random() * (max - min)); if (z > LO && z < HI) return this.ziel = z; } return this.ziel = (LO + HI) / 2; }
  setze(z) {
    this.zustand = z;
    if (z === 'walk') this.neuesZiel(150, 600);
    else if (z === 'gallop') { this.neuesZiel(600, 1400); this.galoppZeit = 4 + Math.random() * 3; }
    else if (z === 'graze') this.rest = 6 + Math.random() * 8;
    else this.rest = 2 + Math.random() * 3;
  }
  weiter() { const r = Math.random(); this.setze(r < .48 ? 'walk' : r < .82 ? 'graze' : r < .93 ? 'idle' : 'gallop'); }
  schritt(dt) {
    this.zeit += dt;
    const g0 = GANG[this.zustand];
    if (g0) {
      const d = this.ziel - this.x, tm = g0.tempo * this.s;
      if (Math.sign(d) !== this.dir && Math.abs(d) > 30 && !this.wende) this.wende = .001;
      const soll = this.wende ? tm * .35 : tm * Math.min(1, Math.abs(d) / (this.zustand === 'gallop' ? 260 : 90) + .3);
      this.tempo += (soll - this.tempo) * Math.min(1, dt * 2.5);
      if (this.zustand === 'gallop') { this.galoppZeit -= dt; if (Math.abs(d) < 120) this.neuesZiel(600, 1400); if (this.galoppZeit <= 0) this.setze('walk'); }
      else if (Math.abs(d) < 12) this.weiter();
    } else { this.tempo = Math.max(0, this.tempo - dt * 320); this.rest -= dt; if (this.rest <= 0) this.weiter(); }
    this.x = Math.min(HI + 40, Math.max(LO - 40, this.x + this.dir * this.tempo * dt));
    if (this.wende) { this.wende += dt / .45; if (this.wende >= 1) { this.wende = 0; this.dir = -this.dir; } }
    const skX = this.wende ? this.dir * Math.cos(Math.PI * this.wende) : this.dir, s = this.s;
    const v = this.tempo / s;
    this.wW = ziehe(this.wW, this.zustand === 'walk' ? Math.min(1, v / 70) : 0, 5, dt);
    this.wG = ziehe(this.wG, this.zustand === 'gallop' ? Math.min(1, v / 250) : 0, 5, dt);
    this.wGr = ziehe(this.wGr, this.zustand === 'graze' ? 1 : 0, 2.5, dt);
    const wW = this.wW, wG = this.wG, wL = wW + wG, wS = Math.max(0, 1 - wL);
    const T = wL > .01 ? (wW * GANG.walk.T + wG * GANG.gallop.T) / wL : 1.1;
    this.phase = (this.phase + dt / T * Math.min(1, wL * 1.5)) % 1;
    const ph = this.phase;
    for (const k in this.BEINE) {
      const b = this.BEINE[k], aw = beinWinkel(GANG.walk, b.typ, (ph + GANG.walk.off[k]) % 1), ag = beinWinkel(GANG.gallop, b.typ, (ph + GANG.gallop.off[k]) % 1);
      const st = RUHE[k].map((q, i) => q + (GRASEN[k][i] - q) * this.wGr);
      b.g.forEach((el, i) => rot(el, aw[i] * wW + ag[i] * wG + st[i] * wS, b.piv[i]));
    }
    const bob = wW * 1.6 * Math.sin(ph * Math.PI * 4) - wG * 9 * Math.max(0, Math.sin(Math.PI * 2 * (ph - .25))), kipp = wG * 4.5 * Math.sin(Math.PI * 2 * ph + 1);
    this.G.koerper.setAttribute('transform', `translate(0 ${R(bob)}) rotate(${R(kipp)} 0 -120)`);
    const ziel3 = HALTUNG[this.zustand] || HALTUNG.idle;
    for (let i = 0; i < 3; i++) this.hals[i] = ziehe(this.hals[i], ziel3[i], this.zustand === 'graze' ? 1.6 : 2.6, dt);
    const nick = wW * 3.5 * Math.sin(ph * Math.PI * 4 + 1) + wG * 7 * Math.sin(ph * Math.PI * 2 + 2.2), kauen = this.wGr * 2.2 * Math.sin(this.zeit * 9);
    const h1 = this.hals[0] + nick * .4, h2 = h1 + this.hals[1] + nick * .6;
    rot(this.G.hals1, h1, [62, -132]); rot(this.G.hals2, this.hals[1] + nick * .6, [80, -172]); rot(this.G.kopf, this.hals[2] - nick * .5 + kauen, [98, -210]);
    const wind = wG * 14 + Math.sin(this.zeit * 2.1) * 1.5;
    for (const m of this.MH) rot(m.el, -(m.teil === 1 ? h1 : h2) * .8 + wind, m.p);
    this.schlagZeit -= dt; if (this.schlagZeit <= 0) { this.schlagen = 1; this.schlagZeit = 3 + Math.random() * 5; }
    this.schlagen = Math.max(0, this.schlagen - dt * 1.6);
    rot(this.G.schweif, 3 * Math.sin(this.zeit * 1.4) + wW * 6 * Math.sin(ph * Math.PI * 2) + wG * 26 + 16 * Math.sin(this.schlagen * Math.PI * 3) * this.schlagen, [-85, -150]);
    this.blinzeln -= dt; if (this.blinzeln <= 0) this.blinzeln = 2.5 + Math.random() * 4;
    this.G.auge.setAttribute('transform', this.blinzeln < .13 ? 'translate(0 -196.5) scale(1 .12) translate(0 196.5)' : '');
    this.ohrZeit -= dt; if (this.ohrZeit <= 0) this.ohrZeit = 2 + Math.random() * 4;
    rot(this.G.ohr, this.ohrZeit < .35 ? -14 * Math.sin(this.ohrZeit / .35 * Math.PI) : 0, [101, -213]);
    this.el.setAttribute('transform', `translate(${R(this.x)} ${R(this.gy)}) scale(${R(skX * s * 1000) / 1000} ${R(s * 1000) / 1000})`);
  }
}
// ---------- Kamera ----------
// Die Kamera schwenkt nur leicht um die Mitte; die Pferde bleiben im sichtbaren Bereich LO bis HI
const EB = EBENEN.map(([id, f]) => [$(id), f]), sonne = $('sonne');
let Wv = 900, Hv = 450, oben = -400, zeit = 0, anzahl = 5, LO = 300, HI = 1900, mitte = WW / 2;
function groesse() {
  const r = svg.getBoundingClientRect(), a = Math.max(.3, r.width / Math.max(1, r.height));
  Wv = Math.min(WW - 200, Math.max(700, 520 * a)); Hv = Wv / a; oben = -Math.min(.8 * Hv, Math.max(.62 * Hv, 380));
  mitte = (WW - Wv) / 2; LO = mitte + 160; HI = mitte + Wv - 160;
}
new ResizeObserver(groesse).observe(svg); groesse();

// Hinten zuerst zeichnen
const pferde = HERDE.map(([f, d], i) => new Pferd(i, f, d));
pferde.forEach((p, i) => { p.x = LO + (i + .5) / pferde.length * (HI - LO); });
[...pferde].sort((a, b) => a.d - b.d).forEach(p => $('lHerde').appendChild(p.el));
pferde.forEach(p => p.weiter());

function bildSchritt(dt) {
  zeit += dt;
  for (const p of pferde) if (p.an) p.schritt(dt);
  const camX = mitte + Math.sin(zeit / 20) * 40;
  svg.setAttribute('viewBox', `${R(camX)} ${R(oben)} ${R(Wv)} ${R(Hv)}`);
  for (const [el, f] of EB) el.setAttribute('transform', `translate(${R(camX * (1 - f) + (el.id === 'lWolken' ? zeit * 6 : 0))} ${el.id === 'lWolken' ? R(oben) : 0})`);
  sonne.setAttribute('transform', `translate(${R(camX + Wv * .8)} ${R(oben + Hv * .16)})`);
}

// ---------- Messung ----------
let letzte = performance.now(), fN = 0, fT = 0, mess = null;
const erg = $('ergebnis');
function bild(t) {
  const roh = (t - letzte) / 1000; letzte = t;
  bildSchritt(Math.min(.1, Math.max(0, roh)));
  fN++; fT += roh;
  if (mess) { mess.n++; mess.t += roh; mess.lang = Math.max(mess.lang, roh); }
  if (fT >= 1) {
    const fps = fN / fT; fpsEl.textContent = Math.round(fps) + ' Bilder/s';
    if (mess) { mess.sek.push(fps); erg.innerHTML = `Messe … noch ${Math.max(0, 10 - mess.sek.length)} Sekunden`; if (mess.sek.length >= 10) fertig(); }
    fN = 0; fT = 0;
  }
  requestAnimationFrame(bild);
}
function fertig() {
  const m = mess; mess = null;
  const schnitt = m.n / m.t, min = Math.min(...m.sek);
  const urteil = schnitt >= 45 && min >= 30 ? 'flüssig' : schnitt >= 28 ? 'geht so (leichtes Ruckeln möglich)' : 'ruckelt';
  const gr = szene.classList.contains('kopf') ? 'wie Startseite' : 'Vollbild';
  erg.innerHTML = `<b>${Math.round(schnitt)} Bilder/s im Schnitt</b>, langsamste Sekunde ${Math.round(min)}, längste Pause ${Math.round(m.lang * 1000)} ms.<br>Bewertung: <b>${urteil}</b><br><span class="klein">${anzahl} Pferd${anzahl > 1 ? 'e' : ''}, ${gr}, Umriss ${svg.classList.contains('ohneUmriss') ? 'aus' : 'an'}, Bildschirm ${screen.width}×${screen.height}, Pixeldichte ${devicePixelRatio}</span>`;
  $('messen').disabled = false;
}
$('messen').addEventListener('click', () => { mess = { n: 0, t: 0, lang: 0, sek: [] }; fN = 0; fT = 0; $('messen').disabled = true; erg.textContent = 'Messe … noch 10 Sekunden'; });
const markiere = (sel, b) => document.querySelectorAll(sel).forEach(e => e.classList.toggle('an', e === b));
$('anzahl').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; markiere('#anzahl button', b); anzahl = +b.dataset.n;
  // Pferd 0 ist vorn; bei weniger Pferden die hinteren ausblenden
  pferde.forEach((p, i) => { p.an = i < anzahl; p.el.style.display = p.an ? '' : 'none'; });
});
$('groesse').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; markiere('#groesse button', b); szene.classList.toggle('kopf', b.dataset.g === 'kopf'); });
$('umriss').addEventListener('click', e => { const aus = svg.classList.toggle('ohneUmriss'); e.target.classList.toggle('an', !aus); e.target.textContent = aus ? 'Umriss aus' : 'Umriss an'; });
requestAnimationFrame(bild);
window.studie = { geladen: true, pferde, get mess() { return mess; } };
})();
