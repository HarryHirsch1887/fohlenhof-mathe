// Pferdehof Mathe: 3D-Vorschau des eigenen Pferds (nur ausgewachsene Pferde).
// Wird erst geladen, wenn das 3D-Fenster zum ersten Mal erscheint. Modell "Horse" von Quaternius (CC0), three.js (MIT, siehe LICENSE-three.txt).
// Keine Netzwerkzugriffe außer dem Laden der eigenen Dateien, keine Speicherung.
import * as THREE from './three.module.js';
import { GLTFLoader } from './addons/loaders/GLTFLoader.js';
import { OrbitControls } from './addons/controls/OrbitControls.js';
import { mergeGeometries } from './addons/utils/BufferGeometryUtils.js';

// Farben je Fellfarbe der App. beine = dunkle Unterbeine, schecke = weiße Flecken
const FELL = {
  fuchs: { main: '#b5612b', light: '#c3703a', dark: '#9b5225', hair: '#6e3414', hair2: '#9a5226', muzzle: '#4f3020', hooves: '#4a4038' },
  braun: { main: '#7b4a2a', light: '#8a5634', dark: '#663b20', hair: '#1c1410', hair2: '#3a2a20', muzzle: '#2a1c14', hooves: '#2a2622', beine: '#1c1410' },
  rappe: { main: '#2c2c31', light: '#38383e', dark: '#222226', hair: '#111114', hair2: '#2b2b31', muzzle: '#1b1b1e', hooves: '#2a2622' },
  schimmel: { main: '#e4e6e8', light: '#f1f2f3', dark: '#cbd0d4', hair: '#c4c8cc', hair2: '#e9ebed', muzzle: '#8e9096', hooves: '#6f695e' },
  palomino: { main: '#dfb25f', light: '#e8c072', dark: '#c99b48', hair: '#f3ead6', hair2: '#fbf6ea', muzzle: '#6e5a40', hooves: '#5a5044' },
  schecke: { main: '#b5612b', light: '#c3703a', dark: '#9b5225', hair: '#e6d3a6', hair2: '#f4ead2', muzzle: '#4f3020', hooves: '#5a5044', schecke: 1 },
  falbe: { main: '#cfae7c', light: '#dcc092', dark: '#b8935f', hair: '#3f322a', hair2: '#9b8b75', muzzle: '#3b2f28', hooves: '#3a332c', beine: '#3b2f28' },
  wind: { main: '#2c2729', light: '#373133', dark: '#221e20', hair: '#ebe0c4', hair2: '#f8f2e2', muzzle: '#1d1a1b', hooves: '#2a2622' }
};
const rnd = a => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Bühne ----------
const canvas = document.createElement('canvas');
canvas.className = 'd3bild';
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1.6, .1, 100);
camera.position.set(4.5, 1.6, 1.2);
scene.add(new THREE.HemisphereLight('#d8ecff', '#5d7d43', 1.35));
const sonne = new THREE.DirectionalLight('#fff0d4', 2.6);
sonne.position.set(3.5, 6, 2.5); sonne.castShadow = true; sonne.shadow.mapSize.set(1024, 1024);
Object.assign(sonne.shadow.camera, { left: -2.6, right: 2.6, top: 2.6, bottom: -2.6, near: .5, far: 15 });
sonne.shadow.bias = -.0005; sonne.shadow.normalBias = .03;
scene.add(sonne, sonne.target);
const wiese = new THREE.Mesh(new THREE.CircleGeometry(1.9, 40).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#8cc46f', roughness: 1 }));
wiese.receiveShadow = true; scene.add(wiese);
const rand = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.05, 40).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#79b05c', roughness: 1 }));
rand.position.y = -.002; scene.add(rand);

const steuerung = new OrbitControls(camera, canvas);
Object.assign(steuerung, { enableZoom: false, enablePan: false, enableDamping: true, dampingFactor: .08, rotateSpeed: .8, autoRotate: true, autoRotateSpeed: 1.4, minPolarAngle: 1.25, maxPolarAngle: 1.25 });
steuerung.target.set(0, 1.0, .1);
steuerung.addEventListener('start', () => { steuerung.autoRotate = false; });
// Nur waagerecht drehen, senkrechtes Wischen scrollt weiter die Seite
canvas.style.touchAction = 'pan-y';
steuerung.update();

// ---------- Pferd ----------
const pferd = new THREE.Group(); scene.add(pferd);
const M = {}, U = { uBein: { value: new THREE.Color() }, uBeinAn: { value: 0 }, uBlesse: { value: 0 }, uSchecke: { value: 0 } };
const haarMat = new THREE.MeshStandardMaterial({ roughness: .85, flatShading: true, side: THREE.DoubleSide });
const haar2Mat = new THREE.MeshStandardMaterial({ roughness: .85, flatShading: true, side: THREE.DoubleSide });
const gummiMat = new THREE.MeshStandardMaterial({ color: '#e8508f', roughness: .45 });
const MAEHNE = { mittel: .24, lang: .46 }, SEITE = 1;
const maehneTeile = { mittel: [], lang: [], zoepfe: [], schopfMittel: [], schopfLang: [] };
let mixer = null, aktionen = {}, aktuell = null, geladen = false, spec = { coat: 'falbe', ma: 'mittel', zo: 0, gu: '#e8508f' };

const vPos = new THREE.Vector3();
const welt = m => { const n = m.geometry.attributes.position.count, a = []; for (let i = 0; i < n; i++) { m.getVertexPosition(i, vPos); a.push(vPos.clone().applyMatrix4(m.matrixWorld)); } return a; };
const hauptKnochen = (mesh, i) => {
  const si = mesh.geometry.getAttribute('skinIndex'), sw = mesh.geometry.getAttribute('skinWeight'); let b = 0, w = -1;
  [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)].forEach((ix, k) => { const ww = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)][k]; if (ww > w) { w = ww; b = ix; } });
  return mesh.skeleton.bones[b];
};

// Unterbeine (für dunkle Beine und weiße Socken): Anteil der Unterschenkel-Knochen je Punkt
function beinAttribut(mesh) {
  const g = mesh.geometry; if (g.getAttribute('aBein')) return;
  const ids = mesh.skeleton.bones.map((b, i) => /LowerLeg/.test(b.name) ? i : -1).filter(i => i >= 0);
  const si = g.getAttribute('skinIndex'), sw = g.getAttribute('skinWeight'), a = new Float32Array(si.count);
  for (let i = 0; i < si.count; i++) {
    const ix = [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)], wt = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)];
    a[i] = ix.reduce((s, b, k) => s + (ids.includes(b) ? wt[k] : 0), 0);
  }
  g.setAttribute('aBein', new THREE.BufferAttribute(a, 1));
}
// Fell-Shader: Unterbeine, Blesse und Schecken-Flecken werden in die Grundfarbe gemischt
function fellShader(mat) {
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aBein;\nattribute float aBlesse;\nvarying float vBein;\nvarying float vBlesse;\nvarying vec3 vBP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBein = aBein; vBlesse = aBlesse; vBP = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vBein;\nvarying float vBlesse;\nvarying vec3 vBP;\nuniform vec3 uBein;\nuniform float uBeinAn;\nuniform float uBlesse;\nuniform float uSchecke;')
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 weiss = vec3(.86, .85, .82);
float n = sin(vBP.y * 165.0 + sin(vBP.z * 140.0) * 1.7) * sin(vBP.z * 120.0 + .7) + .45 * sin(vBP.x * 150.0 + vBP.y * 80.0);
diffuseColor.rgb = mix(diffuseColor.rgb, weiss, uSchecke * smoothstep(.3, .42, n));
diffuseColor.rgb = mix(diffuseColor.rgb, uBein, uBeinAn * smoothstep(.3, .75, vBein));
diffuseColor.rgb = mix(diffuseColor.rgb, weiss, uBlesse * smoothstep(.4, .7, vBlesse));`);
  };
  mat.customProgramCacheKey = () => 'pferd-fell';
}

function maehneUndAbzeichen(modell) {
  modell.updateMatrixWorld(true);
  const netze = []; modell.traverse(o => { if (o.isSkinnedMesh) netze.push(o); });
  const haar = netze.find(o => o.material.name === 'Hair'); if (!haar) return;
  const knochen = n => modell.getObjectByName(n), wpos = o => o.getWorldPosition(new THREE.Vector3());
  const kopfK = knochen('Head'), halsK = knochen('Neck1');
  const kopfZ = wpos(kopfK).z, halsZ = wpos(halsK).z;
  const hp = welt(haar).map((p, i) => ({ p, i })).filter(o => o.p.z > halsZ - .25 && o.p.z < kopfZ + .02);
  const fellNetze = netze.filter(o => /^Main/.test(o.material.name)), fellPunkte = fellNetze.map(welt), koerper = fellPunkte.flat();
  const zMin = Math.min(...hp.map(o => o.p.z)), zMax = Math.max(...hp.map(o => o.p.z));
  const xMitte = hp.reduce((s, o) => s + o.p.x, 0) / hp.length;
  const halsX = (z, y) => { let m = -Infinity; for (const p of koerper) if (Math.abs(p.z - z) < .06 && Math.abs(p.y - y) < .045) m = Math.max(m, (p.x - xMitte) * SEITE); return m; };
  const kamm = z => { let best = null; for (const o of hp) if (Math.abs(o.p.z - z) < .035 && (!best || o.p.y > best.p.y)) best = o; return best && { y: best.p.y, knochen: hauptKnochen(haar, best.i) }; };
  const pfad = (z, yTop, L, n, abstand, seed, weg = 0) => {
    const pts = []; let xv = null;
    for (let j = 0; j <= n; j++) {
      const f = j / n, y = yTop - L * f, xs = halsX(z, y);
      let x = Number.isFinite(xs) ? xs + abstand : (xv ?? .05);
      if (xv !== null) { x = Math.max(x, xv - .012); if (x > xv + .045) x = xv + .012; }
      xv = x;
      pts.push(new THREE.Vector3(xMitte + SEITE * (x + weg * f * f + .007 * Math.sin(f * 5 + seed)), y, z - .07 * L * f));
    }
    return pts;
  };
  const AUS = new THREE.Vector3(SEITE, 0, 0);
  const band = (pts, w0, achse, ziel, aus = AUS, spitz = .6) => {
    const quer = (p, w) => [p.clone().addScaledVector(achse, -w), p.clone().addScaledVector(aus, w * .45), p.clone().addScaledVector(achse, w)];
    for (let j = 0; j < pts.length - 1; j++) {
      const A = quer(pts[j], w0 * (1 - spitz * j / (pts.length - 1)) / 2), B = quer(pts[j + 1], w0 * (1 - spitz * (j + 1) / (pts.length - 1)) / 2);
      for (const k of [0, 1]) ziel.push(...A[k].toArray(), ...B[k].toArray(), ...A[k + 1].toArray(), ...A[k + 1].toArray(), ...B[k].toArray(), ...B[k + 1].toArray());
    }
  };
  const zuKnochen = (map, kn, mat, daten) => { const k = kn.uuid + mat.uuid; if (!map.has(k)) map.set(k, { kn, mat, pos: [], geos: [] }); const e = map.get(k); if (daten.pos) e.pos.push(...daten.pos); if (daten.geo) e.geos.push(daten.geo); };
  const anhaengen = (map, liste) => {
    for (const { kn, mat, pos, geos } of map.values()) {
      const inv = kn.matrixWorld.clone().invert(), teile = [];
      if (pos.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); teile.push(g); }
      for (const g of geos) teile.push(g.index ? g.toNonIndexed() : g);
      teile.forEach(g => { for (const n of ['normal', 'uv']) g.deleteAttribute(n); });
      const geo = mergeGeometries(teile); geo.applyMatrix4(inv); geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.frustumCulled = false; kn.add(m); liste.push(m);
    }
  };
  const Z = new THREE.Vector3(0, 0, 1), X = new THREE.Vector3(1, 0, 0);
  const strang = (pts, kn, mat, liste) => {
    const pos = []; band(pts, .085, Z, pos);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const inv = kn.matrixWorld.clone().invert(); g.applyMatrix4(inv);
    const top = pts[0].clone().applyMatrix4(inv); g.translate(-top.x, -top.y, -top.z); g.computeVertexNormals();
    const piv = new THREE.Object3D(); piv.position.copy(top);
    const m = new THREE.Mesh(g, mat); m.castShadow = true; m.frustumCulled = false; piv.add(m); kn.add(piv);
    piv.userData.unten = new THREE.Vector3(0, -1, 0).applyQuaternion(kn.getWorldQuaternion(new THREE.Quaternion()).invert());
    liste.push(piv);
  };
  const K = 16, z0 = zMin + .03, z1 = Math.min(zMax, kopfZ) - .03;
  // Lose Strähnen in drei versetzten Reihen
  for (const art of ['mittel', 'lang']) {
    const L0 = MAEHNE[art], weg = art === 'lang' ? .05 : .025;
    for (let r = 0; r < 3; r++) for (let k = 0; k < K; k++) {
      const t = (k + r / 3) / (K - 1); if (t > 1) continue;
      const z = z0 + (z1 - z0) * t, km = kamm(z); if (!km) continue;
      const L = L0 * (.82 + .18 * Math.sin(Math.PI * Math.min(1, t * 1.3))) * (1 - r * .09) * (.9 + rnd(k * 7 + r) * .2);
      strang(pfad(z, km.y - .008, L, 8, .022 + r * .012, k + r * 3, weg), km.knochen, (k * 3 + r) % 5 === 2 ? haar2Mat : haarMat, maehneTeile[art]);
    }
  }
  // Zöpfe: Glieder im Fischgrät-Muster, unten Zopfgummi und Quaste
  {
    const map = new Map(), glied = new THREE.IcosahedronGeometry(1, 0), n = 9;
    for (let k = 0; k < 7; k++) {
      const t = .1 + k / 6 * .86, z = z0 + (z1 - z0) * t, km = kamm(z); if (!km) continue;
      const L = MAEHNE.lang * (.86 + .14 * Math.sin(Math.PI * t)), pts = pfad(z, km.y - .02, L, n, .03, k);
      for (let j = 0; j < n; j++) {
        const s = 1 - .25 * j / n, g = glied.clone(), q = new THREE.Quaternion().setFromAxisAngle(X, (j % 2 ? .55 : -.55));
        g.applyMatrix4(new THREE.Matrix4().compose(pts[j].clone().add(new THREE.Vector3(0, 0, (j % 2 ? .007 : -.007))), q, new THREE.Vector3(.02 * s, .032 * s, .026 * s)));
        zuKnochen(map, km.knochen, haarMat, { geo: g });
      }
      const ende = pts[n], gummi = new THREE.CylinderGeometry(.017, .017, .02, 8); gummi.translate(ende.x, ende.y + .005, ende.z);
      zuKnochen(map, km.knochen, gummiMat, { geo: gummi });
      const quaste = new THREE.ConeGeometry(.022, .075, 5); quaste.rotateX(Math.PI); quaste.translate(ende.x, ende.y - .04, ende.z - .004);
      zuKnochen(map, km.knochen, haarMat, { geo: quaste });
    }
    anhaengen(map, maehneTeile.zoepfe);
  }
  // Stirnschopf und Blesse: Linie vom Genick zum Maul
  const muzzle = netze.find(o => o.material.name === 'Muzzle'), mp = muzzle ? welt(muzzle) : [];
  const schopf = welt(haar).filter(p => p.z > kopfZ - .03);
  if (mp.length && schopf.length) {
    const F = schopf.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(schopf.length);
    const Mz = mp.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(mp.length);
    const d = Mz.clone().sub(F).normalize(), nrm = new THREE.Vector3(0, d.z, -d.y).normalize(), L = Mz.distanceTo(F);
    const stirn = P => { let m = 0; for (const p of koerper) { const q = p.clone().sub(P); if (Math.abs(q.dot(d)) < .035 && Math.abs(q.x) < .045) m = Math.max(m, q.dot(nrm)); } return m; };
    for (const [art, Ls] of [['schopfMittel', .16], ['schopfLang', .24]]) {
      const map = new Map();
      for (let i = -1; i <= 1; i++) {
        const pts = [];
        for (let j = 0; j <= 6; j++) { const f = j / 6, P = F.clone().addScaledVector(d, .02 + Ls * f * (1 - .12 * Math.abs(i))).add(new THREE.Vector3(i * .026 * (1 + f * .5), 0, 0)); pts.push(P.addScaledVector(nrm, stirn(P) + .014)); }
        const pos = []; band(pts, .06, X, pos, nrm, .55);
        zuKnochen(map, kopfK, i === 0 && art === 'schopfLang' ? haar2Mat : haarMat, { pos });
      }
      anhaengen(map, maehneTeile[art]);
    }
    // Blesse: Punkte des Kopfes in der Mitte der Stirn und des Nasenrückens, auf der Oberseite
    fellNetze.forEach((mesh, mi) => {
      const pts = fellPunkte[mi], a = new Float32Array(pts.length);
      pts.forEach((p, i) => {
        const q = p.clone().sub(F), entlang = q.dot(d);
        if (hauptKnochen(mesh, i) === kopfK && Math.abs(p.x - xMitte) < .03 && entlang > .05 && entlang < L * 1.02 && q.dot(nrm) > .035) a[i] = 1;
      });
      mesh.geometry.setAttribute('aBlesse', new THREE.BufferAttribute(a, 1));
    });
  }
  fellNetze.forEach(m => { if (!m.geometry.getAttribute('aBlesse')) m.geometry.setAttribute('aBlesse', new THREE.BufferAttribute(new Float32Array(m.geometry.attributes.position.count), 1)); });
}

// Schwerkraft für lose Strähnen (das Pferd steht, die Kamera dreht sich)
const _q = new THREE.Quaternion(), _qi = new THREE.Quaternion(), _r = new THREE.Quaternion(), _r2 = new THREE.Quaternion(), _d = new THREE.Vector3(), ZIEL = new THREE.Vector3(.5 * SEITE, -1, 0).normalize();
function haengen() {
  const liste = spec.ma === 'mittel' ? maehneTeile.mittel : (spec.ma === 'lang' && !spec.zo ? maehneTeile.lang : null); if (!liste) return;
  let kn = null;
  for (const p of liste) {
    if (p.parent !== kn) { kn = p.parent; kn.getWorldQuaternion(_q); _qi.copy(_q).invert(); }
    _d.copy(p.userData.unten).applyQuaternion(_q);
    _r.setFromUnitVectors(_d, ZIEL); _r2.identity().slerp(_r, .8);
    p.quaternion.copy(_qi).multiply(_r2).multiply(_q);
  }
}

// Aussehen nach dem Spielstand: coat, ma (kurz/mittel/lang), zo (Zöpfe), gu (Gummifarbe), bl (Blesse), so (Socken), br (Rasse)
function anwenden() {
  if (!geladen) return;
  const f = FELL[spec.coat] || FELL.fuchs;
  const hellMaehne = spec.br === 'hafl' && (spec.coat === 'fuchs' || spec.coat === 'braun');
  for (const [mat, key] of [['Main', 'main'], ['Main_Light', 'light'], ['Main_Dark', 'dark'], ['Muzzle', 'muzzle'], ['Hooves', 'hooves']]) if (M[mat]) M[mat].color.set(f[key]);
  const haarFarbe = hellMaehne ? '#f0deb0' : f.hair;
  if (M.Hair) M.Hair.color.set(haarFarbe);
  haarMat.color.set(haarFarbe); haar2Mat.color.set(hellMaehne ? '#f8efd6' : f.hair2); gummiMat.color.set(spec.gu || '#e8508f');
  if (spec.so) { U.uBein.value.set('#e9e6df'); U.uBeinAn.value = 1; } else if (f.beine) { U.uBein.value.set(f.beine); U.uBeinAn.value = 1; } else U.uBeinAn.value = 0;
  U.uBlesse.value = spec.bl ? 1 : 0; U.uSchecke.value = f.schecke ? 1 : 0;
  const lang = spec.ma === 'lang';
  maehneTeile.mittel.forEach(m => m.visible = spec.ma === 'mittel');
  maehneTeile.schopfMittel.forEach(m => m.visible = spec.ma === 'mittel');
  maehneTeile.lang.forEach(m => m.visible = lang && !spec.zo);
  maehneTeile.zoepfe.forEach(m => m.visible = lang && !!spec.zo);
  maehneTeile.schopfLang.forEach(m => m.visible = lang);
}

function spiele(name, fade = .5) {
  const a = aktionen[name]; if (!a || a === aktuell) return;
  a.reset(); a.setEffectiveTimeScale(1); a.setEffectiveWeight(1); a.play();
  if (aktuell) aktuell.crossFadeTo(a, fade, false); else a.fadeIn(fade);
  aktuell = a;
}
let wechsel = 0;
function naechsteBewegung() { const r = Math.random(); spiele(r < .4 ? 'Idle' : r < .6 ? 'Idle_2' : r < .8 ? 'Idle_Headlow' : 'Eating'); wechsel = 6 + Math.random() * 6; }

const laden = new Promise((ok, fehler) => new GLTFLoader().load(new URL('./pferd.glb', import.meta.url).href, gltf => {
  try {
    const modell = gltf.scene;
    modell.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = true; o.frustumCulled = false;
      const m = o.material; m.metalness = 0; m.roughness = .78; M[m.name] = m;
      if (/^Main/.test(m.name) && o.isSkinnedMesh) { beinAttribut(o); fellShader(m); }
    });
    pferd.add(modell); pferd.updateMatrixWorld(true);
    const kopf = modell.getObjectByName('Head'), schweif = modell.getObjectByName('Tail1');
    if (kopf && schweif) { const a = new THREE.Vector3(), b = new THREE.Vector3(); kopf.getWorldPosition(a); schweif.getWorldPosition(b); modell.rotation.y = -Math.atan2(a.x - b.x, a.z - b.z); }
    pferd.updateMatrixWorld(true);
    let bb = new THREE.Box3().setFromObject(modell, true);
    modell.scale.multiplyScalar(2.1 / (bb.max.y - bb.min.y)); pferd.updateMatrixWorld(true);
    bb = new THREE.Box3().setFromObject(modell, true);
    modell.position.x -= (bb.min.x + bb.max.x) / 2; modell.position.z -= (bb.min.z + bb.max.z) / 2; modell.position.y -= bb.min.y;
    pferd.updateMatrixWorld(true);
    maehneUndAbzeichen(modell);
    mixer = new THREE.AnimationMixer(modell);
    for (const clip of gltf.animations) if (!clip.name.includes('|')) aktionen[clip.name] = mixer.clipAction(clip);
    geladen = true; anwenden(); naechsteBewegung(); ok();
  } catch (e) { fehler(e); }
}, undefined, fehler));

// ---------- Anzeige ----------
let platz = null, sichtbar = true;
const uhr = new THREE.Timer(); uhr.connect(document);
function schleife(t) {
  uhr.update(t); const dt = Math.min(uhr.getDelta(), .1);
  if (geladen) { wechsel -= dt; if (wechsel <= 0) naechsteBewegung(); mixer.update(dt); haengen(); }
  steuerung.update(dt);
  renderer.render(scene, camera);
}
function planen() { renderer.setAnimationLoop(platz && sichtbar && document.visibilityState === 'visible' ? schleife : null); }
new IntersectionObserver(e => { sichtbar = e[0].isIntersecting; planen(); }).observe(canvas);
document.addEventListener('visibilitychange', planen);
new ResizeObserver(() => {
  const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < h * 1.2 ? 40 : 32; camera.updateProjectionMatrix();
}).observe(canvas);

// Das 3D-Fenster in den Platzhalter el hängen (die App baut ihre Seiten neu auf, das Bild wird dabei umgehängt)
export function zeige(el, neu) {
  spec = { ...spec, ...neu };
  if (canvas.parentNode !== el) el.appendChild(canvas);
  platz = el; anwenden(); planen();
  laden.then(() => el.classList.add('bereit')).catch(() => el.classList.add('fehler'));
}
export function verstecke() { platz = null; canvas.remove(); planen(); }
export const bereit = laden;

// Für automatische Tests
window.vorschau3d = { get geladen() { return geladen; }, get spec() { return spec; }, teile: () => Object.fromEntries(Object.entries(maehneTeile).map(([k, l]) => [k, l.filter(m => m.visible).length])), uniforms: U };
