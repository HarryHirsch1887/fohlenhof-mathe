// Pferdehof Mathe: das gezeichnete 2D-Pferd im Bilderbuch-Look (SVG).
// PF.bild(P, spec, opt) liefert ein Pferd als SVG-Text. P ist ein Präfix für alle Kennungen, damit mehrere Pferde nebeneinander gehen.
// spec: coat (Fellfarbe), st (Wachstumsstufe 0-3), br (Rasse), bl (Blesse), so (Socken), ma (Mähne kurz/mittel/lang), zo (Zöpfe), gu (Gummifarbe),
//       bf (Form des Kopfabzeichens 0-4), sm (Socken je Bein, z. B. "3120"), fs (Zahl für die Anordnung der Schecken-Flecken), mh (eigene Mähnenfarbe),
//       dr (Schmutzflecken, seit 2026-10-25: ungepflegtes Pferd, Gruppen mit class="dreck")
// Halfter: Gruppe id="halfter" am Kopf, zunächst versteckt; pflege.js (halfterZeigen) blendet sie beim Führen und Putzen ein (seit 2026-10-25)
// new PF.Rig(P) bewegt ein Pferd, das schon im Dokument steht (Gangarten, Grasen, Hüpfer, Schweif, Mähne, Blinzeln, ein Huf angehoben).
// Umriss: Die Teile werden zweimal gezeichnet, zuerst mit Rand, darüber ohne. "Umriss leicht": Haare und Details bekommen keinen Rand.
// Greift zur Laufzeit auf BR (Rassen) aus app.js zu.
const PF = (() => {
'use strict';
const r1 = n => Math.round(n * 10) / 10;
const rnd = a => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Fellfarben: k1 hell, k2 Grundfarbe, k3 dunkel, u Unterbeine, maul, h1/h2 Mähne und Schweif, huf; aal = Aalstrich, beh = Behang, sch = Schecke
const FELL = {
  fuchs: { k1: '#d68a48', k2: '#b5612b', k3: '#86431c', u: '#8a461e', maul: '#6a3c25', h1: '#7a3a16', h2: '#a8592c', huf: '#4a4038' },
  braun: { k1: '#9c643c', k2: '#7b4a2a', k3: '#55321c', u: '#1e1612', maul: '#2a1c14', h1: '#1c1410', h2: '#3c2c22', huf: '#2a2622' },
  rappe: { k1: '#55555e', k2: '#2e2e34', k3: '#1b1b1f', u: '#202024', maul: '#18181b', h1: '#141417', h2: '#34343c', huf: '#2a2622' },
  schimmel: { k1: '#ffffff', k2: '#e9ebed', k3: '#c3c8cd', u: '#d2d6da', maul: '#9a9ca2', h1: '#d3d7db', h2: '#f7f7f3', huf: '#7a7468' },
  palomino: { k1: '#f2d08a', k2: '#dfb25f', k3: '#b68a3e', u: '#c49650', maul: '#7a6448', h1: '#f3ead6', h2: '#fffaf0', huf: '#5a5044' },
  schecke: { k1: '#d68a48', k2: '#b5612b', k3: '#86431c', u: '#8a461e', maul: '#6a3c25', h1: '#e6d3a6', h2: '#f4ead2', huf: '#5a5044', sch: 1 },
  falbe: { k1: '#e8cc9c', k2: '#cfae7c', k3: '#a7824f', u: '#3b2f28', maul: '#4a3a30', h1: '#3e3029', h2: '#a09078', huf: '#3a332c', aal: 1, beh: 1 },
  wind: { k1: '#4d4649', k2: '#2e292b', k3: '#1c191a', u: '#201c1e', maul: '#1a1718', h1: '#efe5cb', h2: '#fbf7ea', huf: '#2a2622' }
};
const mische = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

// Wachstum: ls Beinlänge, bx Körperlänge, by Körpertiefe, ns Hals, hs Kopf, tl Schweif, ml Mähne
const STUFE = [
  { ls: 1.2, lw: .85, bx: .76, by: .8, ns: .8, hs: 1.14, tl: .5, ml: .45 },
  { ls: 1.09, lw: .92, bx: .87, by: .88, ns: .9, hs: 1.05, tl: .78, ml: .8 },
  { ls: 1.03, lw: .97, bx: .95, by: .95, ns: .96, hs: 1.01, tl: .92, ml: .95 },
  { ls: 1, lw: 1, bx: 1, by: 1, ns: 1, hs: 1, tl: 1, ml: 1 }
];
const MAEHNE = { kurz: .5, mittel: 1, lang: 1.75 };
const teil = (v, f) => 1 + ((v || 1) - 1) * f;
function masse(sp) {
  const s = STUFE[sp.st | 0] || STUFE[3], b = (typeof BR !== 'undefined' && BR[sp.br]) || {};
  return { ls: s.ls * teil(b.l, .7), lw: s.lw, bx: s.bx * teil(b.rx, .8), by: s.by * teil(b.ry, .8), ns: s.ns * teil(b.nk, .6), hs: s.hs * (b.h || 1),
    tl: s.tl * teil(b.tl, .8), ml: s.ml * teil(b.mw, .5), fe: b.fe ? 1 : 0, mc: b.mc, fohlen: (sp.st | 0) === 0 };
}

// ---------- Haare ----------
// offen: Grundkante ohne Strich (unteres Stück des Schweifs, seit 2026-10-26), die Fläche schließt sich trotzdem
function straehne(bx, by, dx, dy, len, w, bend, cls, offen) {
  const nx = -dy, ny = dx, tx = bx + dx * len + nx * bend, ty = by + dy * len + ny * bend;
  const c1x = bx + dx * len * .55 + nx * (w * .55 + bend * .6), c1y = by + dy * len * .55 + ny * (w * .55 + bend * .6);
  const c2x = bx + dx * len * .5 - nx * (w * .4 - bend * .6), c2y = by + dy * len * .5 - ny * (w * .4 - bend * .6);
  return `<path class="${cls}" d="M${r1(bx + nx * w / 2)} ${r1(by + ny * w / 2)}Q${r1(c1x)} ${r1(c1y)} ${r1(tx)} ${r1(ty)}Q${r1(c2x)} ${r1(c2y)} ${r1(bx - nx * w / 2)} ${r1(by - ny * w / 2)}${offen ? '' : 'Z'}"/>`;
}
const qb = (a, c, b, t) => [0, 1].map(i => (1 - t) * (1 - t) * a[i] + 2 * (1 - t) * t * c[i] + t * t * b[i]);
const qbT = (a, c, b, t) => { const v = [0, 1].map(i => 2 * (1 - t) * (c[i] - a[i]) + 2 * t * (b[i] - c[i])), l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
// Mähne entlang des Mähnenkamms a-c-b. art: 'fohlen' (kurze Stehmähne), 'offen' (Strähnen) oder 'zoepfe'
function maehne(a, c, b, n, laenge, seed, teilNr, art) {
  const Nn = t => { const T = qbT(a, c, b, t); return [-T[1], T[0]]; }, [na, nc, nb] = [0, .5, 1].map(Nn), w = art === 'fohlen' ? 4 : 5;
  const P = (p, n, f) => `${r1(p[0] + n[0] * f)} ${r1(p[1] + n[1] * f)}`;
  let s = `<path class="ha1" stroke-linejoin="round" d="M${P(a, na, -w)}Q${P(c, nc, -w)} ${P(b, nb, -w)}L${P(b, nb, 2)}Q${P(c, nc, 2)} ${P(a, na, 2)}Z"/>`, hell = '';
  const zahl = art === 'zoepfe' ? Math.max(2, Math.round(n * .45)) : art === 'fohlen' ? n + 3 : n;
  for (let i = 0; i < zahl; i++) {
    const t = (i + .5) / zahl, p = qb(a, c, b, t), T = qbT(a, c, b, t), N = [-T[1], T[0]];
    if (art === 'fohlen') { s += straehne(p[0] - N[0] * 2, p[1] - N[1] * 2, -N[0] * .85 - T[0] * .3, -N[1] * .85 - T[1] * .3, 8 + rnd(seed + i) * 4, 7, (rnd(seed + i * 3) - .5) * 3, i % 3 === 1 ? 'ha2' : 'ha1'); continue; }
    let dx = N[0] * .4 - T[0] * .12, dy = N[1] * .4 - T[1] * .12 + .8; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
    const bx = r1(p[0] - N[0] * 1.5), by = r1(p[1] - N[1] * 1.5), len = laenge(t) * (.82 + rnd(seed + i) * .36), bend = 3 + (rnd(seed + i * 3) - .3) * 8;
    if (art === 'zoepfe') {
      // Zopf: Glieder im Fischgrät-Muster, unten Haargummi und kleine Quaste
      const ang = Math.atan2(dy, dx) * 180 / Math.PI - 90, glieder = Math.max(3, Math.round(len / 7));
      let z = '';
      for (let j = 0; j < glieder; j++) { const cx = r1(bx + dx * (j * 6.8 + 4)), cy = r1(by + dy * (j * 6.8 + 4)), sk = 1 - j / glieder * .25; z += `<ellipse class="ha1" cx="${cx}" cy="${cy}" rx="${r1(3.8 * sk)}" ry="${r1(5.4 * sk)}" transform="rotate(${r1(ang + (j % 2 ? 30 : -30))} ${cx} ${cy})"/>`; }
      const ex = bx + dx * (glieder * 6.8 + 2), ey = by + dy * (glieder * 6.8 + 2);
      z += `<rect class="gummi2d" x="${r1(ex - 3.6)}" y="${r1(ey - 2)}" width="7.2" height="4" rx="1.8" transform="rotate(${r1(ang)} ${r1(ex)} ${r1(ey)})"/>` + straehne(ex + dx * 1.5, ey + dy * 1.5, dx, dy, 9, 6, 1.5, 'ha1');
      s += `<g class="mh" data-t="${teilNr}" data-x="${bx}" data-y="${by}">${z}</g>`;
      continue;
    }
    s += `<g class="mh" data-t="${teilNr}" data-x="${bx}" data-y="${by}">${straehne(bx, by, dx, dy, len, len > 40 ? 13 : 11, bend, 'ha1')}</g>`;
    if (i % 3 === 1) hell += `<g class="mh" data-t="${teilNr}" data-x="${bx}" data-y="${by}">${straehne(bx + T[0] * 3, by + T[1] * 3, dx, dy, len * .85, 5, bend + 2, 'ha2')}</g>`;
  }
  return s + hell;
}
// Mähne am Halsgelenk: kurzer Bogen um den Drehpunkt (80,-172) durch den Anfang des oberen Mähnenkamms, mit hängenden Strähnen.
// Liegt im oberen Halsteil über dessen Fell und dreht sich beim Senken nur halb mit (Rig: id "gelenk"),
// so sitzt es immer in der Mitte des Knicks und schließt die Lücke zwischen den beiden Mähnenstücken.
function gelenkMaehne(art, laenge) {
  const cx = 80, cy = -172, r = Math.hypot(64 - cx, -185 - cy), f0 = Math.atan2(-185 - cy, 64 - cx), d = 32 * Math.PI / 180, fa = f0 - d, fb = f0 + d;
  const p = (f, rr) => `${r1(cx + Math.cos(f) * rr)} ${r1(cy + Math.sin(f) * rr)}`, ro = r + (art === 'fohlen' ? 4 : 5), ri = r - 3;
  let s = `<path class="ha1" d="M${p(fa, ro)}A${r1(ro)} ${r1(ro)} 0 0 1 ${p(fb, ro)}L${p(fb, ri)}A${r1(ri)} ${r1(ri)} 0 0 0 ${p(fa, ri)}Z"/>`;
  if (art !== 'zoepfe') for (let i = 0; i < 4; i++) {
    const f = fa + (i + .5) / 4 * (fb - fa), rx = Math.cos(f), ry = Math.sin(f), bx = r1(cx + rx * (r + 2)), by = r1(cy + ry * (r + 2));
    if (art === 'fohlen') { s += straehne(bx, by, rx * .9, ry * .9 - .2, 9 + rnd(i) * 3, 7, 0, 'ha1'); continue; }
    let dx = -rx * .4, dy = -ry * .4 + .8; const l = Math.hypot(dx, dy); dx /= l; dy /= l;
    s += `<g class="mh" data-t="3" data-x="${bx}" data-y="${by}">${straehne(bx, by, dx, dy, laenge * (.85 + rnd(i * 7) * .25), laenge > 40 ? 13 : 11, 3, i === 2 ? 'ha2' : 'ha1')}</g>`;
  }
  return `<g id="gelenk">${s}</g>`;
}
// Schweif (seit 2026-10-26 biegsam, Brain Dump "nicht so steif"): Jede Strähne besteht aus einem oberen Stück (Gruppe schweif,
// dreht an der Wurzel) und einem unteren Stück (Gruppe schweif2 darin, dreht um ihren Drehpunkt data-px/data-py und schwingt in
// Rig.pose verzögert nach). Die Stücke überlappen (unten beginnt bei SW_AB, oben endet bei SW_BIS), die Naht deckt das untere Stück zu.
// Ruhelage als leichter Bogen: oben SW_OBEN Grad weiter nach hinten, unten SW_UNTEN Grad mehr hängend.
const SW_OBEN = 16, SW_UNTEN = -9, SW_AB = .42, SW_BIS = .5;
const drehe = (dx, dy, g) => { const r = g * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [dx * c - dy * s, dx * s + dy * c]; };
// Oberes Stück: Band von der Wurzel (Breite w) bis zur Länge len (Breite w2), endet gerade. Liefert [Pfad, Startpunkt des unteren Stücks].
// Die gerade Endkante ist die offene Schlusskante (ohne Strich), so entsteht an der Naht keine Querlinie.
function schweifOben(bx, by, dx, dy, len, w, w2, bend, cls) {
  const nx = -dy, ny = dx, e = [bx + dx * len + nx * bend, by + dy * len + ny * bend], c = [bx + dx * len * .5 + nx * bend * .6, by + dy * len * .5 + ny * bend * .6];
  const d = `M${r1(e[0] - nx * w2 / 2)} ${r1(e[1] - ny * w2 / 2)}Q${r1(c[0] - nx * w * .45)} ${r1(c[1] - ny * w * .45)} ${r1(bx - nx * w / 2)} ${r1(by - ny * w / 2)}` +
    `L${r1(bx + nx * w / 2)} ${r1(by + ny * w / 2)}Q${r1(c[0] + nx * w * .45)} ${r1(c[1] + ny * w * .45)} ${r1(e[0] + nx * w2 / 2)} ${r1(e[1] + ny * w2 / 2)}`;
  return [`<path class="${cls}" d="${d}"/>`, qb([bx, by], c, e, SW_AB / SW_BIS)];
}
function schweif(tl, fohlen, idle) {
  let o = '', oh = '', u = '', uh = '', px = 0, py = 0;
  const n = fohlen ? 8 : 12, strang = (i, x, y, dx, dy, len, w, bend, cls) => {
    // Oberes Ende (.6 w) schmaler als der Anfang des unteren Stücks (.8 w): die Ecken bleiben auch im Knick verdeckt
    const [ox, oy] = drehe(dx, dy, SW_OBEN), [ux, uy] = drehe(dx, dy, SW_UNTEN), w2 = w * .8;
    const [p, st] = schweifOben(x, y, ox, oy, len * SW_BIS, w, w * .6, bend * .25, cls);
    return [p, straehne(st[0], st[1], ux, uy, len * (1 - SW_AB), w2, bend * .75, cls, 1), st];
  };
  for (let i = 0; i < n; i++) {
    let dx = -.3 - i * .016 + (rnd(i * 2.2) - .5) * .12, dy = .95; const l = Math.hypot(dx, dy);
    const [a, b, st] = strang(i, -85 + i * .5, -151 + i * 1.1, dx / l, dy / l, (84 + rnd(i * 4.1) * 18) * tl, fohlen ? 15 : 13, (7 + (rnd(i * 5.3) - .4) * 14) * Math.min(1, tl + .2), 'ha1');
    o += a; u += b; px += st[0] / n; py += st[1] / n;
    if (i % 4 === 1) { const [a2, b2] = strang(i, -84 + i * .5, -150 + i * 1.1, dx / l, dy / l, (76 + rnd(i * 4.1) * 14) * tl, 4.5, 9 + (rnd(i * 5.3) - .4) * 10, 'ha2'); oh += a2; uh += b2; }
  }
  // Ruhebild (idle): das untere Stück pendelt etwas verzögert zum oberen
  const p2 = `${r1(px)} ${r1(py)}`, anim = idle ? `<animateTransform attributeName="transform" type="rotate" values="0 ${p2};-4 ${p2};0 ${p2};5 ${p2};0 ${p2}" dur="3.4s" begin="-.9s" repeatCount="indefinite"/>` : '';
  return o + oh + `<g id="schweif2" data-px="${r1(px)}" data-py="${r1(py)}">${anim}${u}${uh}</g>` + '<ellipse class="kK" cx="-85" cy="-149" rx="7.5" ry="6" transform="rotate(-38 -85 -149)"/>';
}
const stirnschopf = f => [0, 1, 2].map(i => straehne(96 + i * 2.2, -214 + i * .8, .52 + i * .06, .85, (13 + i * 2.5) * f, 7, 2 - i * 2, i === 1 ? 'ha2' : 'ha1')).join('');

// ---------- Beine (Drehpunkt oben bei 0,0; Boden bei 100 bzw. 104) ----------
// so: weiße Socke an diesem Bein, 0 keine, 1 Fessel, 2 Halbsocke, 3 Strumpf (bis zum Knie). Wird als weiße Fläche über das Bein gelegt.
// dr: Schmutz an Unterbein und Fessel (seit 2026-10-25, ungepflegtes Pferd), als Gruppe .dreck, damit er beim Putzen ausblenden kann
const DRECKF = '#6b4b2e';
function vorderbein(id, fern, so = 0, dr = 0) {
  const o = fern ? 'bOf' : 'bO', u = fern ? 'bUf' : 'bU', h = fern ? 'hf' : 'hu', w = fern ? 'sockF' : 'sock';
  // Oberarm seit 2026-10-25 hinten breiter (Muskel), damit das Bein weich aus dem Körper wächst statt hart unter der Bauchlinie anzusetzen.
  // Vorn bleibt er schmal wie früher, sonst ragt beim weit nach hinten gestreckten Bein (Galopp) eine Ecke unter der Brust heraus.
  return `<g id="${id}1"><path class="${o}" d="M-20 -20C-14 -4 -11 16 -5.6 40L5.6 40C9 18 13 6 13 -16Z"/><circle class="${o}" cx="0" cy="42" r="6"/>` +
    `<g id="${id}2"><path class="${u}" d="M-5.4 42L-4.6 76L4.4 76L5.4 42Z"/><circle class="${u}" cx="-.2" cy="76" r="5.5"/>` +
    (so >= 3 ? `<path class="${w}" d="M-5.4 42L-4.6 76L4.4 76L5.4 42Z"/>` : so == 2 ? `<path class="${w}" d="M-5 59L-4.6 76L4.4 76L4.9 59Z"/>` : '') +
    (so >= 2 ? `<circle class="${w}" cx="-.2" cy="76" r="5.5"/>` : '') +
    (dr ? `<g class="dreck"><path d="M-5 64Q-1 68 5 62L4.6 76L-4.6 76Z" fill="${DRECKF}" opacity=".45"/><circle cx="2" cy="56" r="1.6" fill="${DRECKF}" opacity=".4"/></g>` : '') +
    `<g id="${id}3"><path class="beh" d="M-4 75C-7.5 82 -7 90 -2.5 96L.5 90C-1 86 -1.5 81 0 76Z"/>` +
    `<path class="${u}" d="M-4.4 76L-.5 88.5L8 88.5L4.6 75Z"/>${so >= 1 ? `<path class="${w}" d="M-4.4 76L-.5 88.5L8 88.5L4.6 75Z"/>` : ''}` +
    (dr ? `<g class="dreck"><path d="M-4.4 76L-.5 88.5L8 88.5L4.6 75Z" fill="${DRECKF}" opacity=".5"/></g>` : '') + `<path class="${h}" d="M-1 88L9.5 88L12.5 100L-3 100Z"/></g></g></g>`;
}
function hinterbein(id, fern, so = 0, dr = 0) {
  const o = fern ? 'bOf' : 'bO', u = fern ? 'bUf' : 'bU', h = fern ? 'hf' : 'hu', w = fern ? 'sockF' : 'sock';
  // Oberschenkel seit 2026-10-25 hinten runder (Hinterbacke), damit kein Knick zwischen Körper und Bein entsteht
  return `<g id="${id}1"><path class="${o}" d="M-21 -20C-29 10 -20 32 -16 46L-4 49C-2 30 6 10 18 -16Z"/><circle class="${o}" cx="-10" cy="48" r="6.4"/><circle class="${o}" cx="-15.5" cy="45.5" r="4"/>` +
    (dr ? `<g class="dreck"><ellipse cx="-8" cy="20" rx="5" ry="3.6" fill="${DRECKF}" opacity=".32"/></g>` : '') +
    `<g id="${id}2"><path class="${u}" d="M-15.2 48L-12.8 80L-3.6 80L-4.8 48Z"/><circle class="${u}" cx="-8.2" cy="80" r="5.5"/>` +
    (so >= 3 ? `<path class="${w}" d="M-15.2 48L-12.8 80L-3.6 80L-4.8 48Z"/>` : so == 2 ? `<path class="${w}" d="M-14 64L-12.8 80L-3.6 80L-4.2 64Z"/>` : '') +
    (so >= 2 ? `<circle class="${w}" cx="-8.2" cy="80" r="5.5"/>` : '') +
    (dr ? `<g class="dreck"><path d="M-14 67Q-9 71 -4 65L-3.6 80L-12.8 80Z" fill="${DRECKF}" opacity=".45"/></g>` : '') +
    `<g id="${id}3"><path class="beh" d="M-12 79C-15.5 86 -15 94 -10.5 100L-7.5 94C-9 90 -9.5 85 -8 80Z"/>` +
    `<path class="${u}" d="M-12.4 80L-8.5 92.5L0 92.5L-3.4 79Z"/>${so >= 1 ? `<path class="${w}" d="M-12.4 80L-8.5 92.5L0 92.5L-3.4 79Z"/>` : ''}` +
    (dr ? `<g class="dreck"><path d="M-12.4 80L-8.5 92.5L0 92.5L-3.4 79Z" fill="${DRECKF}" opacity=".5"/></g>` : '') + `<path class="${h}" d="M-9 92L1.5 92L4.5 104L-11 104Z"/></g></g></g>`;
}
// Schmutzflecken im Fell (Körper-Koordinaten): je Fleck einige überlappende Kleckse und Spritzer
const DRECK_K = [[-62, -122, 10], [-24, -100, 9], [30, -112, 8], [-34, -146, 7], [-84, -138, 6], [52, -134, 6]];
const dreckFlecken = L => L.map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r1(r * 1.3)}" ry="${r1(r * .8)}" opacity=".3"/><ellipse cx="${r1(x + r * .7)}" cy="${r1(y + r * .3)}" rx="${r1(r * .6)}" ry="${r1(r * .45)}" opacity=".35"/>` +
  `<circle cx="${r1(x - r * 1.2)}" cy="${r1(y - r * .5)}" r="${r1(1.2 + (i % 3) * .5)}" opacity=".4"/><circle cx="${r1(x + r * 1.5)}" cy="${r1(y - r * .2)}" r="1.1" opacity=".4"/>`).join('');
// Socken je Bein als Text aus 4 Ziffern (Reihenfolge vorn nah, vorn fern, hinten nah, hinten fern). Ohne Angabe: alle hoch (wie früher).
const SOCKBEIN = { vn: 0, vf: 1, hn: 2, hf: 3 };
const sockenMuster = sp => !sp.so ? '0000' : /^[0-3]{4}$/.test(sp.sm || '') ? sp.sm : '3333';
// Kopfabzeichen: 0 Stern, 1 Flocke, 2 Strich, 3 Blesse (Standard), 4 breite Blesse (Kopfkoordinaten, wird auf die Kopfform zugeschnitten)
const BLESSE = ['M102 -206.5L108.5 -214L115 -205.5L108.5 -197.5Z',
  'M124.5 -169.5a3.8 2.7 35 1 0 7.6 0a3.8 2.7 35 1 0 -7.6 0Z',
  'M110 -201C116 -194 123 -184 129.5 -174.5L127.2 -173C121 -182 114 -192 107.8 -199Z',
  'M107 -204C113 -200 123 -187 131 -173C134 -168 136 -163 135.5 -159L131.5 -161C127 -171 118 -185 105 -199Z',
  'M103 -207C112 -204 124 -190 133 -175C136 -169 138.5 -163 138 -157L128.5 -160C124.5 -170 115 -184 100 -199Z'];
// Schecken-Flecken als Liste [cx, cy, rx, ry, Drehung] in Körper-Koordinaten. Ohne Zahl die bekannten Flecken,
// mit Zahl (fs) zufällig, aber bei gleicher Zahl immer gleich. Seit 2026-10-18 gibt es auch Flecken an Schulter und Hals:
// bild() zeichnet jeden Fleck auf dem Körper und rechnet ihn zusätzlich in die Hals-Koordinaten um, so laufen Flecken über die Kante weiter.
function fleckListe(fs) {
  if (!fs) return [[6, -108, 30, 24, 0], [-62, -140, 21, 15, 0], [44, -150, 15, 10, 0], [-26, -160, 12, 8, 0], [72, -150, 15, 10, -40]];
  let s = fs % 2147483646 + 1; const z = () => (s = s * 16807 % 2147483647) / 2147483647, L = [];
  const fleck = (x0, x1, y0, y1, r0, r1_) => { const rx = r0 + z() * (r1_ - r0); L.push([x0 + z() * (x1 - x0), y0 + z() * (y1 - y0), rx, rx * (.55 + z() * .3), -35 + z() * 70]); };
  const nk = 3 + Math.floor(z() * 2), nh = 1 + Math.floor(z() * 2);
  for (let i = 0; i < nk; i++) fleck(-82, 50, -152, -96, 11, 30);   // Körper
  for (let i = 0; i < nh; i++) fleck(62, 96, -185, -138, 9, 16);    // Schulter und unterer Hals (oben liegt die Mähne darüber)
  return L;
}
const fleckSvg = L => L.map(([x, y, rx, ry, w]) => `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}"${w ? ` transform="rotate(${r1(w)} ${r1(x)} ${r1(y)})"` : ''}/>`).join('');
// Lage der Beine (Drehpunkt) je nach Maßen
const beinLage = m => ({ vn: [50 * m.bx, -100 * m.ls], vf: [42 * m.bx, -100 * m.ls - 2], hn: [-58 * m.bx, -104 * m.ls], hf: [-66 * m.bx, -104 * m.ls - 2] });

const KOERPER = 'M40 -160C28 -156 16 -153 4 -153C-12 -153 -22 -157 -36 -158C-50 -160 -62 -161 -74 -157C-84 -154 -92 -146 -95 -132C-97 -120 -95 -108 -88 -98C-82 -90 -72 -86 -60 -88C-50 -90 -42 -92 -34 -90C-16 -86 12 -84 30 -88C40 -90 46 -94 52 -98C62 -100 74 -106 80 -116C85 -124 86 -134 80 -144C72 -154 56 -161 40 -160Z';
// Seit 2026-10-25 läuft die vordere Halskante tangential in die Brustlinie (Körper-Kontur bei 84 / -130) statt in einer Ecke bei 86 / -124 darüber hinauszuragen
const HALS1 = 'M36 -152Q43 -177 64 -185L96 -164C94.5 -153 86 -142 84.3 -130C68 -122 46 -134 36 -152Z';
const HALS2 = 'M64 -185Q67 -211 92 -219L106 -205C102 -190 99 -176 96 -164Z';
const KOPF = 'M90 -212C98 -219 110 -213 117 -203C124 -191 132 -178 138 -167C142 -160 141 -152 135 -150C130 -149 126 -152 121 -154C115 -158 110 -163 104 -168C96 -173 89 -182 89 -193C89 -201 87 -207 90 -212Z';
const linie = (d, o = .12, w = 1.6) => `<path class="det" d="${d}" fill="none" stroke="#000" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const sv = v => `style="stop-color:var(--${v})"`;
const SMIL = (p, w, dur) => `<animateTransform attributeName="transform" type="rotate" values="0 ${p};${w} ${p};0 ${p};${-w * .7} ${p};0 ${p}" dur="${dur}s" repeatCount="indefinite"/>`;

// Farben als CSS-Variablen am Pferd
function stil(P, sp, m) {
  const f = FELL[sp.coat] || FELL.fuchs, c = { ...f };
  if (m.mc && (sp.coat === 'fuchs' || sp.coat === 'braun')) { c.h1 = m.mc; c.h2 = '#f8efd6'; }
  // Eigene Mähnenfarbe [dunkel, hell], z. B. für Lieblingspferde wie Jacko (Falbe mit heller Mähne)
  if (Array.isArray(sp.mh)) { c.h1 = sp.mh[0]; c.h2 = sp.mh[1]; }
  // Weiße Socken liegen seit 2026-10-18 als eigene Flächen über den Beinen (je Bein eigene Höhe), siehe vorderbein/hinterbein
  let s = '';
  for (const k of ['k1', 'k2', 'k3', 'u', 'maul', 'h1', 'h2', 'huf']) s += `--${k}:${c[k]};--f${k}:${mische(c[k], '#1a2418', .2)};`;
  s += `--aal:${f.aal ? .5 : 0};--beh:${f.beh || m.fe ? 1 : 0};--bl:${sp.bl ? 1 : 0};--sch:${f.sch ? 1 : 0};--gu:${sp.gu || '#e8508f'};`;
  for (const g of ['gK', 'gN', 'gN2', 'gH', 'gB', 'gBf']) s += `--${g}:url(#${P}${g});`;
  return s;
}

function bild(P, sp, opt = {}) {
  const m = masse(sp), L = beinLage(m), idle = !!opt.idle;
  const art = m.fohlen ? 'fohlen' : (sp.zo && sp.ma === 'lang' ? 'zoepfe' : 'offen'), mf = m.ml * (m.fohlen ? 1 : (MAEHNE[sp.ma] || 1));
  const sm = sockenMuster(sp);
  const bein = (id, fn, fern) => `<g transform="translate(${r1(L[id][0])} ${r1(L[id][1])}) scale(${m.lw} ${m.ls})">${fn(id, fern, +sm[SOCKBEIN[id]], sp.dr ? 1 : 0)}</g>`;
  const T = (x, y) => [r1(x * m.bx), r1(m.by * (y + 100) - 100 * m.ls)];
  const [nx, ny] = T(62, -132), [tx, ty] = T(-85, -150), ks = (m.bx + m.by) / 2;
  // Flecken: Körper-Koordinaten, für den Hals umgerechnet (gleiche Rechnung wie die Verschiebung des Halses weiter unten)
  const fl = fleckListe(sp.fs | 0), ns = r1(m.ns * 100) / 100;
  const flHals = fl.map(([x, y, rx, ry, w]) => { const X = x * m.bx, Y = m.by * (y + 100) - 100 * m.ls; return [(X - nx) / ns + 62, (Y - ny) / ns - 132, rx * m.bx / ns, ry * m.by / ns, w]; });
  const roh = `<g id="pferd"><defs>
<linearGradient id="gK" gradientUnits="userSpaceOnUse" x1="0" y1="-232" x2="0" y2="-84"><stop offset="0" ${sv('k1')}/><stop offset=".46" ${sv('k1')}/><stop offset=".76" ${sv('k2')}/><stop offset="1" ${sv('k3')}/></linearGradient>
<linearGradient id="gN" gradientUnits="userSpaceOnUse" x1="44" y1="-190" x2="84" y2="-128"><stop offset=".1" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gN2" gradientUnits="userSpaceOnUse" x1="70" y1="-200" x2="104" y2="-178"><stop offset=".1" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gH" gradientUnits="userSpaceOnUse" x1="96" y1="-214" x2="122" y2="-158"><stop offset=".2" ${sv('k1')}/><stop offset="1" ${sv('k2')}/></linearGradient>
<linearGradient id="gB" gradientUnits="userSpaceOnUse" x1="0" y1="-2" x2="0" y2="48"><stop offset="0" ${sv('k3')}/><stop offset=".45" ${sv('k2')}/><stop offset="1" ${sv('k3')}/></linearGradient>
<linearGradient id="gBf" gradientUnits="userSpaceOnUse" x1="0" y1="-2" x2="0" y2="48"><stop offset="0" ${sv('fk3')}/><stop offset=".45" ${sv('fk2')}/><stop offset="1" ${sv('fk3')}/></linearGradient>
<clipPath id="kopfClip"><use href="#kopfForm"/></clipPath><clipPath id="koerperClip"><use href="#koerperForm"/></clipPath>
<clipPath id="hals1Clip"><use href="#hals1Form"/><circle cx="80" cy="-172" r="17"/></clipPath><clipPath id="hals2Clip"><use href="#hals2Form"/><circle cx="80" cy="-172" r="16.5"/></clipPath>
</defs>
<ellipse id="schatten" cx="-4" cy="1" rx="${r1(104 * m.bx)}" ry="10" class="schatten2d"/>
<g id="koerper">
 <use href="#fernTeile" class="umriss"/>
 <g class="fuell"><g id="fernTeile">${bein('vf', vorderbein, 1)}${bein('hf', hinterbein, 1)}</g></g>
 <use href="#nahTeile" class="umriss"/>
 <g class="fuell"><g id="nahTeile">
  <g transform="translate(${tx} ${ty}) scale(${r1(ks * 100) / 100}) translate(85 150)"><g id="schweif">${idle ? SMIL('-85 -150', 7, 3.4) : ''}${schweif(m.tl, m.fohlen, idle)}</g></g>
  ${bein('hn', hinterbein, 0)}${bein('vn', vorderbein, 0)}
  <g transform="translate(0 ${r1(-100 * m.ls)}) scale(${m.bx} ${m.by}) translate(0 100)">
   <path id="koerperForm" class="kK" d="${KOERPER}"/>
   <g clip-path="url(#koerperClip)" class="fleck">${fleckSvg(fl)}</g>
   <ellipse class="glanz" cx="-64" cy="-138" rx="25" ry="15" transform="rotate(-18 -64 -138)"/><ellipse class="glanz" cx="56" cy="-142" rx="15" ry="10"/>
   <path class="aal" d="M38 -158C18 -152 -8 -153 -36 -157C-52 -159 -66 -159 -80 -153"/>
   ${linie('M42 -152C52 -140 64 -127 74 -117')}${linie('M-36 -148C-46 -132 -48 -114 -42 -97', .1)}${linie('M-30 -89C-6 -85 16 -85 32 -89', .06, 3)}
   ${sp.dr ? `<g clip-path="url(#koerperClip)" class="dreck" fill="${DRECKF}">${dreckFlecken(DRECK_K)}</g>` : ''}
   ${sp.dk ? `<g clip-path="url(#koerperClip)" class="pdecke"><path d="M-112 -182H92V-114Q-10 -100 -112 -116Z" fill="${sp.dk}"/><path d="M-112 -116Q-10 -100 92 -114" fill="none" stroke="#e2b24a" stroke-width="3"/><path d="M-40 -175V-110M20 -175V-108" stroke="#000" stroke-opacity=".12" stroke-width="2"/></g>` : ''}
  </g>
  <g transform="translate(${nx} ${ny}) scale(${r1(m.ns * 100) / 100}) translate(-62 132)">
   <g id="hals1"><path id="hals1Form" class="kN" d="${HALS1}"/><circle class="kN" cx="80" cy="-172" r="17"/><g clip-path="url(#hals1Clip)" class="fleck">${fleckSvg(flHals)}</g>${sp.dr ? `<g clip-path="url(#hals1Clip)" class="dreck" fill="${DRECKF}">${dreckFlecken([[74, -142, 6]])}</g>` : ''}
    ${maehne([38, -156], [43, -177], [64, -185], 6, t => (26 + t * 8) * mf, 10, 1, art)}
    <g id="hals2"><path id="hals2Form" class="kN2" d="${HALS2}"/><circle class="kN2" cx="80" cy="-172" r="16.5"/><g clip-path="url(#hals2Clip)" class="fleck">${fleckSvg(flHals)}</g>${linie('M86 -158C91 -170 96 -184 100 -196', .08, 1.4)}
     ${gelenkMaehne(art, 34 * mf)}
     ${maehne([64, -185], [67, -211], [92, -219], 7, t => (38 - t * 12) * mf, 30, 2, art)}
     <g transform="translate(98 -210) scale(${r1(m.hs / m.ns * 100) / 100}) translate(-98 210)"><g id="kopf">${idle ? SMIL('98 -210', 3, 4.6) : ''}
      <path class="kKf" d="M91 -211C88 -218 87 -225 88.5 -231C93 -225 96 -219 96.5 -211Z"/><path id="kopfForm" class="kH" d="${KOPF}"/>
      <g clip-path="url(#kopfClip)"><ellipse class="maul" cx="134" cy="-158" rx="11.5" ry="10.5"/><ellipse class="glanz" cx="103" cy="-186" rx="10" ry="8"/>
       <path class="blesse" d="${BLESSE[sp.bf == null ? 3 : Math.max(0, Math.min(4, sp.bf | 0))]}"/></g>
      <g id="halfter" class="det" style="display:none" clip-path="url(#kopfClip)"><path d="M131 -182L117 -166L112 -158M117 -166L100 -211" fill="none" stroke="#1f6fb2" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M131 -182L117 -166M117 -166L100 -211" fill="none" stroke="#7cb8ea" stroke-width=".7" stroke-linecap="round" opacity=".8"/><circle cx="117" cy="-166" r="1.9" fill="none" stroke="#c9ced3" stroke-width="1.1"/></g>
      ${linie('M96 -177C104 -169 113 -161 121 -156', .2, 1.4)}${linie('M133 -164C136 -166 138.5 -163 136.5 -159.5', .5)}${linie('M137.5 -153.5C134 -152.4 130 -152.8 126.5 -154.2', .35, 1.2)}
      <g id="auge" class="det"><path d="M105.5 -196.5Q111 -201.5 116.5 -195.5Q111 -192.2 105.5 -196.5Z" fill="#1c1410"/><circle cx="113" cy="-197.3" r="1.25" fill="#fff"/></g>
      ${linie('M104.5 -199.2Q111 -204.6 117.5 -197.6', .3, 1.2)}
      <g id="ohr"><path class="kH" d="M98 -213C96.5 -221 97 -228 99.5 -234C103 -227 106 -220 105.5 -212Z"/><path class="det" d="M99.6 -215C99 -221 99.5 -226 100.3 -229C102.3 -224 103.5 -219 103.2 -214Z" fill="#000" opacity=".22"/></g>
      ${stirnschopf(m.fohlen ? .7 : ({ kurz: .7, mittel: 1, lang: 1.35 }[sp.ma] || 1))}
     </g></g>
    </g>
   </g>
  </g>
 </g></g>
</g></g>`;
  const mitP = roh.replace(/\bid="([^"]+)"/g, `id="${P}$1"`).replace(/(href="#|url\(#)([\w-]+)/g, `$1${P}$2`);
  return mitP.replace(`<g id="${P}pferd">`, `<g id="${P}pferd" class="pferd2d" style="${stil(P, sp, m)}">`);
}

// ---------- Bewegung ----------
const rot = (el, a, p) => el.setAttribute('transform', `rotate(${r1(a)} ${p[0]} ${p[1]})`);
const GANG = {
  walk: { duty: .62, A: { v: 21, h: 19 }, flex: { v: 64, h: 36 }, lift: 20, off: { hn: 0, vn: .25, hf: .5, vf: .75 }, halt: [6, 0, 0] },
  trot: { duty: .5, A: { v: 26, h: 23 }, flex: { v: 86, h: 46 }, lift: 42, off: { hn: 0, vf: 0, hf: .5, vn: .5 }, halt: [10, -3, 4] },
  gallop: { duty: .4, A: { v: 36, h: 31 }, flex: { v: 100, h: 58 }, lift: 40, off: { hf: 0, hn: .12, vf: .45, vn: .57 }, halt: [20, -4, 10] }
};
// Seit 2026-10-25: Beim Vorschwingen hebt das Vorderbein das Knie nach vorn (lift), statt nur das Unterbein waagerecht nach hinten zu klappen
function beinWinkel(g, typ, q) {
  const A = g.A[typ], d = g.duty; let a, s = 0;
  if (q < d) a = -A + 2 * A * (q / d); else { s = (q - d) / (1 - d); a = A - 2 * A * (.5 - .5 * Math.cos(Math.PI * s)); }
  const sw = Math.sin(Math.PI * s), fl = sw * g.flex[typ];
  return typ === 'v' ? [a - (g.lift || 0) * Math.pow(sw, .8), fl, fl * .35] : [a * .9, -fl, fl * .6];
}
const RUHE = { vn: [0, 0, 0], vf: [2, 0, 0], hn: [0, 0, 0], hf: [-3, 0, 0] };
const GRASEN = { vn: [-13, 6, 2], vf: [6, 0, 0], hn: [4, 0, 0], hf: [-6, 0, 0] }, GRAS_HALS = [55, 50, -66];
const PIV = { v: [[0, 0], [0, 42], [0, 76]], h: [[0, 0], [-10, 48], [-8, 80]] };
// Angehobener Huf (Pflege, Hufschmied, seit 2026-10-25): Winkel der drei Gelenke, wenn das Bein ganz angewinkelt ist
const HUFHOCH = { v: [-6, 100, 42], h: [12, -78, 70] };

class Rig {
  constructor(P) {
    const $ = id => document.getElementById(P + id);
    this.G = Object.fromEntries(['koerper', 'schweif', 'hals1', 'hals2', 'gelenk', 'kopf', 'auge', 'ohr', 'schatten'].map(k => [k, $(k)]));
    this.B = Object.fromEntries(['vn', 'vf', 'hn', 'hf'].map(k => [k, { typ: k[0], g: [1, 2, 3].map(n => $(k + n)) }]));
    const root = $('pferd');
    this.MH = root ? [...root.querySelectorAll(`#${P}nahTeile .mh`)].map(el => ({ el, teil: +el.dataset.t, p: [+el.dataset.x, +el.dataset.y] })) : [];
    // Unteres Stück des Schweifs (seit 2026-10-26): Drehpunkt und Zustand der gedämpften Feder (sw Winkel, sv Geschwindigkeit)
    this.S2 = $('schweif2'); this.S2p = this.S2 ? [+this.S2.dataset.px, +this.S2.dataset.py] : null; this.sw = null; this.sv = 0;
    Object.assign(this, { zeit: Math.random() * 9, blinzeln: 1 + Math.random() * 3, ohrZeit: 2 + Math.random() * 2, schlagen: 0, schlagZeit: 2 + Math.random() * 4 });
  }
  // a: g Gangart (walk/trot/gallop), am 0..1 Bewegung, ph Phase 0..1, gr 0..1 Grasen, hop Hüpfer nach oben,
  //    huf {b: Bein (vn/vf/hn/hf), f: 0..1} hebt ein Bein an
  pose(dt, a) {
    this.zeit += dt;
    const g = GANG[a.g] || GANG.walk, am = a.am || 0, gr = a.gr || 0, ph = a.ph || 0, hop = a.hop || 0, hb = a.huf && a.huf.b, hf = a.huf ? Math.max(0, Math.min(1, a.huf.f || 0)) : 0;
    for (const k in this.B) {
      const b = this.B[k], w = beinWinkel(g, b.typ, (ph + g.off[k]) % 1), piv = PIV[b.typ];
      b.g.forEach((el, i) => { const st = RUHE[k][i] + (GRASEN[k][i] - RUHE[k][i]) * gr; let an = w[i] * am + st * (1 - am); if (k === hb) an += (HUFHOCH[b.typ][i] - an) * hf; rot(el, an, piv[i]); });
    }
    const gal = a.g === 'gallop', tr = a.g === 'trot';
    const bob = am * (gal ? -9 * Math.max(0, Math.sin(Math.PI * 2 * (ph - .25))) : tr ? -3 * Math.abs(Math.sin(Math.PI * 2 * ph)) : 1.6 * Math.sin(ph * Math.PI * 4));
    const kipp = gal ? am * 4.5 * Math.sin(Math.PI * 2 * ph + 1) : 0;
    this.G.koerper.setAttribute('transform', `translate(0 ${r1(bob - hop)}) rotate(${r1(kipp)} 0 -110)`);
    const sch = Math.max(.4, 1 - hop / 160);
    this.G.schatten.setAttribute('transform', `scale(${r1(sch * 100) / 100} 1)`);
    const nick = am * (gal ? 7 * Math.sin(ph * Math.PI * 2 + 2.2) : tr ? 2.5 * Math.sin(ph * Math.PI * 4) : 3.5 * Math.sin(ph * Math.PI * 4 + 1));
    const hw = [0, 1, 2].map(i => GRAS_HALS[i] * gr * (1 - am) + g.halt[i] * am);
    const kauen = gr > .6 ? 2.2 * Math.sin(this.zeit * 9) : 0;
    const h1 = hw[0] + nick * .4, h2 = h1 + hw[1] + nick * .6;
    const k2 = hw[1] + nick * .6;
    rot(this.G.hals1, h1, [62, -132]); rot(this.G.hals2, k2, [80, -172]); rot(this.G.kopf, hw[2] - nick * .5 + kauen, [98, -210]);
    // Gelenk-Mähne dreht nur halb mit und sitzt so in der Mitte des Knicks
    if (this.G.gelenk) rot(this.G.gelenk, -k2 * .5, [80, -172]);
    const wind = (gal ? am * 14 : 0) + Math.sin(this.zeit * 2.1) * 1.5, hm = h1 + k2 * .5;
    for (const mh of this.MH) rot(mh.el, -(mh.teil === 1 ? h1 : mh.teil === 3 ? hm : h2) * .8 + wind, mh.p);
    if (dt > 0) { this.schlagZeit -= dt; if (this.schlagZeit <= 0) { this.schlagen = 1; this.schlagZeit = 3 + Math.random() * 5; } this.schlagen = Math.max(0, this.schlagen - dt * 1.6); }
    const aS = 3 * Math.sin(this.zeit * 1.4) + am * (gal ? 26 : tr ? 12 : 6 * Math.sin(ph * Math.PI * 2)) + 16 * Math.sin(this.schlagen * Math.PI * 3) * this.schlagen + (hop > 5 ? 18 : 0);
    rot(this.G.schweif, aS, [-85, -150]);
    // Unteres Stück: folgt dem oberen verzögert (gedämpfte Feder, schwingt leicht über), dazu ein Hauch Wind; im Galopp weht es weiter nach hinten
    if (this.S2) {
      if (this.sw === null) this.sw = aS;
      // zwei Teilschritte, bis 0,1 s pro Bild (Sparmodus und Fire-Tablet laufen so in echter Zeit); Knick höchstens ±12°,
      // weil alle unteren Stücke um einen gemeinsamen Drehpunkt drehen (sonst verrutschen die äußeren Strähnen sichtbar)
      if (dt > 0) { const d = Math.min(dt, .1) / 2; for (let i = 0; i < 2; i++) { this.sv += ((aS - this.sw) * 30 - this.sv * 7) * d; this.sw += this.sv * d; } }
      rot(this.S2, Math.max(-12, Math.min(12, (this.sw - aS) * 1.3 + 4 * Math.sin(this.zeit * 1.9 + .8) + am * (gal ? 12 : tr ? 5 : 0))), this.S2p);
    }
    if (dt > 0) { this.blinzeln -= dt; if (this.blinzeln <= 0) this.blinzeln = 2.5 + Math.random() * 4; this.ohrZeit -= dt; if (this.ohrZeit <= 0) this.ohrZeit = 2 + Math.random() * 4; }
    this.G.auge.setAttribute('transform', this.blinzeln < .13 ? 'translate(0 -196.5) scale(1 .12) translate(0 196.5)' : '');
    rot(this.G.ohr, this.ohrZeit < .35 ? -14 * Math.sin(this.ohrZeit / .35 * Math.PI) : 0, [101, -213]);
  }
}
return { bild, Rig, FELL };
})();
