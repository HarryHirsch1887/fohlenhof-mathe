// Stil-Studie Variante B: 3D-Pferd ("Horse" von Quaternius, CC0) auf einer Low-Poly-Koppel mit three.js.
// Keine Netzwerkzugriffe außer dem Laden der eigenen Dateien, keine Speicherung.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TEST = /[?&]test\b/.test(location.search);

// Fellfarben: Farben für die Flächen des Modells, "beine" = dunkle Unterbeine (Falbe)
// hair2 = einzelne hellere Strähnen in der langen Mähne
const FELL = {
  falbe: { main: '#cfae7c', light: '#dcc092', dark: '#b8935f', hair: '#3f322a', hair2: '#9b8b75', muzzle: '#3b2f28', hooves: '#3a332c', beine: '#3b2f28' },
  rappe: { main: '#2c2c31', light: '#38383e', dark: '#222226', hair: '#111114', hair2: '#2b2b31', muzzle: '#1b1b1e', hooves: '#2a2622' },
  schimmel: { main: '#e4e6e8', light: '#f1f2f3', dark: '#cbd0d4', hair: '#c4c8cc', hair2: '#e9ebed', muzzle: '#8e9096', hooves: '#6f695e' },
  wind: { main: '#2c2729', light: '#373133', dark: '#221e20', hair: '#ebe0c4', hair2: '#f8f2e2', muzzle: '#1d1a1b', hooves: '#2a2622' },
  fuchs: { main: '#b5612b', light: '#c3703a', dark: '#9b5225', hair: '#6e3414', hair2: '#9a5226', muzzle: '#4f3020', hooves: '#4a4038' }
};

const box = document.getElementById('szene'), fpsEl = document.getElementById('fps'), laden = document.getElementById('laden');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
let pr = Math.min(window.devicePixelRatio || 1, 2), sparsam = false;
renderer.setPixelRatio(pr);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
box.prepend(renderer.domElement);

const scene = new THREE.Scene();
const HORIZONT = new THREE.Color('#d9eaf1');
scene.fog = new THREE.Fog(HORIZONT, 55, 210);
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1500);
camera.position.set(5.8, 2.7, 7.4);

// ---------- Licht ----------
scene.add(new THREE.HemisphereLight('#d8ecff', '#5d7d43', 1.3));
const SONNE_RICHTUNG = new THREE.Vector3(18, 26, 10).normalize();
const sonne = new THREE.DirectionalLight('#fff0d4', 2.7);
sonne.position.copy(SONNE_RICHTUNG).multiplyScalar(40);
sonne.castShadow = true;
sonne.shadow.mapSize.set(1024, 1024);
Object.assign(sonne.shadow.camera, { left: -21, right: 21, top: 17, bottom: -17, near: 1, far: 90 });
sonne.shadow.bias = -0.0005;
sonne.shadow.normalBias = 0.035;
scene.add(sonne, sonne.target);

// ---------- Himmel, Sonne, Wolken ----------
const himmel = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { oben: { value: new THREE.Color('#3f93d8') }, unten: { value: HORIZONT.clone() } },
  vertexShader: 'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 oben;uniform vec3 unten;varying vec3 vP;void main(){float t=clamp(vP.y*1.7+.03,0.,1.);gl_FragColor=vec4(mix(unten,oben,pow(t,.75)),1.);\n#include <colorspace_fragment>\n}'
}));
himmel.renderOrder = -1;
scene.add(himmel);

function leuchtTextur() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,252,235,1)'); r.addColorStop(.18, 'rgba(255,246,210,1)'); r.addColorStop(.3, 'rgba(255,236,180,.45)'); r.addColorStop(1, 'rgba(255,236,180,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const sonnenBild = new THREE.Sprite(new THREE.SpriteMaterial({ map: leuchtTextur(), fog: false, depthWrite: false, transparent: true }));
sonnenBild.scale.setScalar(150);
scene.add(sonnenBild);

const rnd = a => { const x = Math.sin(a * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wolkenMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, fog: false, emissive: '#c9d9e6', emissiveIntensity: .35 });
const wolken = [];
for (let i = 0; i < 9; i++) {
  const w = new THREE.Group(), n = 4 + Math.floor(rnd(i) * 3);
  for (let k = 0; k < n; k++) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), wolkenMat);
    const s = 7 + rnd(i * 9 + k) * 6;
    b.scale.set(s * 1.5, s * .8, s);
    b.position.set((k - n / 2) * 9 + rnd(k + i) * 4, rnd(i + k * 3) * 3, rnd(k * 7 + i) * 6);
    w.add(b);
  }
  const a = rnd(i * 3.3) * Math.PI * 2, r = 200 + rnd(i * 5.1) * 180;
  w.position.set(Math.cos(a) * r, 70 + rnd(i * 2.7) * 40, Math.sin(a) * r);
  wolken.push(w); scene.add(w);
}

// ---------- Boden mit Hügeln ----------
const ss = THREE.MathUtils.smoothstep;
function hoehe(x, z) {
  const r = Math.hypot(x * .85, z);
  const welle = 3 + 2.4 * Math.sin(x * .045 + 1.3) + 1.9 * Math.cos(z * .055) + 1.3 * Math.sin((x + z) * .1);
  const klein = .14 * Math.sin(x * .9 + z * .4) * Math.cos(z * .7 - x * .3);
  return ss(r, 28, 85) * welle * 2.4 + klein * ss(r, 18, 26);
}
{
  let g = new THREE.PlaneGeometry(460, 460, 150, 150).rotateX(-Math.PI / 2).toNonIndexed();
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, hoehe(p.getX(i), p.getZ(i)));
  const gruen = ['#89ba63', '#7fb15b', '#93c26c', '#84b65f', '#78aa55'].map(c => new THREE.Color(c));
  const erde = new THREE.Color('#b9a271'), f = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    c.copy(gruen[Math.floor(rnd(x * 3.1 + z * 7.7) * gruen.length)]);
    // ausgetretene Stelle am Tor und beim Wassertrog
    const pfad = Math.max(1 - Math.hypot(x + 12, z - 9) / 4, 1 - Math.hypot(x - 16, z - 0) / 3.2, 0);
    if (pfad > 0) c.lerp(erde, Math.min(1, pfad * 1.3) * (.6 + .4 * rnd(x + z)));
    for (let k = 0; k < 3; k++) f.set([c.r, c.g, c.b], (i + k) * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(f, 3));
  g.computeVertexNormals();
  const boden = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, flatShading: true }));
  boden.receiveShadow = true;
  scene.add(boden);
}

// ---------- Koppel: Zaun, Heu, Wassertrog ----------
const KX = 16, KZ = 11;
const holz = new THREE.MeshStandardMaterial({ color: '#a27b50', roughness: .92, flatShading: true });
{
  const pos = [];
  for (let x = -KX; x <= KX + .01; x += 2) pos.push([x, -KZ], [x, KZ]);
  for (let z = -KZ + 2; z <= KZ - 2 + .01; z += 2) pos.push([-KX, z], [KX, z]);
  const pf = new THREE.InstancedMesh(new THREE.BoxGeometry(.17, 1.35, .17), holz, pos.length), m = new THREE.Matrix4(), q = new THREE.Quaternion();
  pos.forEach(([x, z], i) => { q.setFromEuler(new THREE.Euler(0, rnd(i) * .5, (rnd(i * 3) - .5) * .06)); m.compose(new THREE.Vector3(x, .62, z), q, new THREE.Vector3(1, 1, 1)); pf.setMatrixAt(i, m); });
  pf.castShadow = pf.receiveShadow = true; scene.add(pf);
  for (const y of [.62, 1.08]) {
    for (const z of [-KZ, KZ]) { const l = new THREE.Mesh(new THREE.BoxGeometry(2 * KX, .12, .07), holz); l.position.set(0, y, z); l.castShadow = l.receiveShadow = true; scene.add(l); }
    for (const x of [-KX, KX]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.07, .12, 2 * KZ), holz); l.position.set(x, y, 0); l.castShadow = l.receiveShadow = true; scene.add(l); }
  }
  const heuMat = new THREE.MeshStandardMaterial({ color: '#e2b24a', roughness: 1, flatShading: true });
  [[11.5, -8.6, 0], [12.9, -8.9, .4], [12.2, -8.7, .2]].forEach(([x, z, r], i) => {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 1.15, 10), heuMat);
    h.rotation.set(0, r, Math.PI / 2); h.position.set(x, i == 2 ? 1.6 : .62, z); h.castShadow = h.receiveShadow = true; scene.add(h);
  });
  const trog = new THREE.Mesh(new THREE.BoxGeometry(2.2, .6, .9), new THREE.MeshStandardMaterial({ color: '#6f5235', roughness: .9 }));
  trog.position.set(14.7, .3, 0); trog.rotation.y = Math.PI / 2; trog.castShadow = trog.receiveShadow = true; scene.add(trog);
  const wasser = new THREE.Mesh(new THREE.PlaneGeometry(1.9, .65).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5aa6d6', roughness: .15, metalness: .1 }));
  wasser.position.set(14.7, .57, 0); wasser.rotation.y = Math.PI / 2; scene.add(wasser);
}

// ---------- Stall ----------
{
  const s = new THREE.Group(), rot = new THREE.MeshStandardMaterial({ color: '#b0412f', roughness: .85, flatShading: true });
  const dachMat = new THREE.MeshStandardMaterial({ color: '#6e2b20', roughness: .9, flatShading: true }), weiss = new THREE.MeshStandardMaterial({ color: '#f4e9d0', roughness: .9 });
  const haus = new THREE.Mesh(new THREE.BoxGeometry(9, 4.6, 7), rot); haus.position.y = 2.3; s.add(haus);
  const form = new THREE.Shape(); form.moveTo(-5.1, 0); form.lineTo(5.1, 0); form.lineTo(0, 3.1); form.closePath();
  const dach = new THREE.Mesh(new THREE.ExtrudeGeometry(form, { depth: 7.6, bevelEnabled: false }), dachMat); dach.position.set(0, 4.6, -3.8); s.add(dach);
  const tor = new THREE.Mesh(new THREE.BoxGeometry(3, 3.3, .1), weiss); tor.position.set(0, 1.65, 3.53); s.add(tor);
  for (const r of [.83, -.83]) { const b = new THREE.Mesh(new THREE.BoxGeometry(.25, 4.3, .12), rot); b.position.set(0, 1.65, 3.6); b.rotation.z = r; s.add(b); }
  const luke = new THREE.Mesh(new THREE.CircleGeometry(.6, 16), weiss); luke.position.set(0, 5.6, 3.81); s.add(luke);
  s.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  s.position.set(-31, hoehe(-31, -28) - .1, -28); s.rotation.y = .55; scene.add(s);
}

// ---------- Bäume ----------
const stammMat = new THREE.MeshStandardMaterial({ color: '#6b4a2b', roughness: .95, flatShading: true });
const laubMats = ['#4f9a47', '#3f8a3c', '#5aa24c', '#468f40'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .9, flatShading: true }));
const tanneMat = new THREE.MeshStandardMaterial({ color: '#2f6e3d', roughness: .9, flatShading: true });
const apfelMat = new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: .6 });
function baum(x, z, s, art, i) {
  const g = new THREE.Group();
  const st = new THREE.Mesh(new THREE.CylinderGeometry(.18 * s, .3 * s, 2.4 * s, 6), stammMat); st.position.y = 1.2 * s; g.add(st);
  if (art === 'tanne') {
    [0, 1, 2].forEach(k => { const c = new THREE.Mesh(new THREE.ConeGeometry((1.8 - k * .45) * s, (2.3 - k * .35) * s, 7), tanneMat); c.position.y = (2.3 + k * 1.15) * s; g.add(c); });
  } else {
    [[0, 3.4, 0, 1.75], [1, 2.9, .3, 1.25], [-.9, 3, -.2, 1.3], [.1, 2.8, -.9, 1.15]].forEach(([a, b, c, r], k) => {
      const kr = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 0), laubMats[(i + k) % laubMats.length]);
      kr.position.set(a * s, b * s, c * s); kr.rotation.set(rnd(i + k), rnd(i * 2 + k), 0); g.add(kr);
    });
    if (art === 'apfel') for (let k = 0; k < 9; k++) {
      const ap = new THREE.Mesh(new THREE.SphereGeometry(.12 * s, 6, 5), apfelMat), w = rnd(k * 4.1) * Math.PI * 2, h = rnd(k * 2.3);
      ap.position.set(Math.cos(w) * 1.55 * s, (2.6 + h * 1.4) * s, Math.sin(w) * 1.55 * s); g.add(ap);
    }
  }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.position.set(x, hoehe(x, z) - .1, z); g.rotation.y = rnd(i) * 6; scene.add(g);
}
baum(20, -5, 1, 'apfel', 0);
baum(-20, 6, 1.15, 'laub', 1);
for (let i = 0; i < 26; i++) {
  const w = rnd(i * 7.3) * Math.PI * 2, r = 26 + rnd(i * 3.9) * 70, x = Math.cos(w) * r, z = Math.sin(w) * r;
  if (Math.hypot(x + 31, z + 28) < 10) continue;
  baum(x, z, .85 + rnd(i * 1.7) * .7, rnd(i * 5.5) < .35 ? 'tanne' : 'laub', i + 2);
}

// ---------- Gras und Blumen ----------
{
  // Grasbüschel: fünf schmale Halme, leicht nach außen geneigt, zu einer Form zusammengefasst
  const halme = [0, 1, 2, 3, 4].map(k => {
    const h = new THREE.ConeGeometry(.035, .26 + (k % 2) * .08, 3).translate(0, .13, 0), w = k / 5 * Math.PI * 2;
    return h.rotateZ(.32 * Math.cos(w)).rotateX(.32 * Math.sin(w)).translate(Math.cos(w) * .04, 0, Math.sin(w) * .04);
  });
  const n = 1100, gras = new THREE.InstancedMesh(mergeGeometries(halme), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color(), toene = ['#7aad57', '#86b860', '#6fa24f', '#8fc067'];
  for (let i = 0; i < n; i++) {
    const w = rnd(i * 1.1) * Math.PI * 2, r = Math.sqrt(rnd(i * 2.2)) * 45, x = Math.cos(w) * r, z = Math.sin(w) * r, s = .7 + rnd(i * 3.3) * .8;
    q.setFromEuler(new THREE.Euler(0, rnd(i) * 6, 0));
    m.compose(new THREE.Vector3(x, hoehe(x, z), z), q, new THREE.Vector3(s, s, s)); gras.setMatrixAt(i, m);
    gras.setColorAt(i, c.set(toene[i % 4]));
  }
  gras.receiveShadow = true; scene.add(gras);
  // Blumen: flache bunte Blüten dicht über dem Boden
  const k = 300, blumen = new THREE.InstancedMesh(new THREE.CylinderGeometry(.07, .03, .03, 5), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .8 }), k), bunt = ['#f4d03f', '#e78ac3', '#f19a3e', '#b18cf0', '#f4d03f'];
  for (let i = 0; i < k; i++) {
    const w = rnd(i * 8.1) * Math.PI * 2, r = 3 + Math.sqrt(rnd(i * 9.2)) * 38, x = Math.cos(w) * r, z = Math.sin(w) * r;
    m.compose(new THREE.Vector3(x, hoehe(x, z) + .1, z), q.identity(), new THREE.Vector3(1, 1, 1)); blumen.setMatrixAt(i, m);
    blumen.setColorAt(i, c.set(bunt[i % bunt.length]));
  }
  scene.add(blumen);
}

// ---------- Kamera-Steuerung ----------
const steuerung = new OrbitControls(camera, renderer.domElement);
Object.assign(steuerung, { enableDamping: true, dampingFactor: .08, enablePan: false, minDistance: 3.5, maxDistance: 32, maxPolarAngle: 1.42, rotateSpeed: .7 });
steuerung.target.set(0, 1.1, 0);

function groesse() {
  const w = Math.max(1, box.clientWidth), h = Math.max(1, box.clientHeight);
  renderer.setSize(w, h, false); camera.aspect = w / h;
  // Im Hochformat etwas weiter weg, damit das ganze Pferd ins Bild passt
  camera.fov = w < h ? 52 : 40; camera.updateProjectionMatrix();
}
new ResizeObserver(groesse).observe(box); groesse();

// ---------- Pferd ----------
const pferd = new THREE.Group(); scene.add(pferd);
const M = {}, U = { uBein: { value: new THREE.Color() }, uBeinAn: { value: 0 } };
let mixer = null, aktionen = {}, aktuell = null, geladen = false;

// Dunkle Unterbeine: Anteil der Unterschenkel-Knochen je Punkt des Modells, im Shader als Farbe eingemischt
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
function beinShader(mat) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uBein = U.uBein; sh.uniforms.uBeinAn = U.uBeinAn;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aBein;\nvarying float vBein;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvBein = aBein;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vBein;\nuniform vec3 uBein;\nuniform float uBeinAn;').replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uBein, uBeinAn * smoothstep(.3, .75, vBein));');
  };
  mat.customProgramCacheKey = () => 'pferd-beine';
}
function fell(name) {
  const f = FELL[name] || FELL.falbe;
  for (const [mat, key] of [['Main', 'main'], ['Main_Light', 'light'], ['Main_Dark', 'dark'], ['Hair', 'hair'], ['Muzzle', 'muzzle'], ['Hooves', 'hooves']]) if (M[mat]) M[mat].color.set(f[key]);
  U.uBeinAn.value = f.beine ? 1 : 0; if (f.beine) U.uBein.value.set(f.beine);
  haarMat.color.set(f.hair); haar2Mat.color.set(f.hair2);
}

// ---------- Mähne: Kurz (wie im Modell), Mittel, Lang, Lang mit Zöpfen ----------
// Die Strähnen werden einmal beim Laden gebaut und an die Hals- und Kopfknochen gehängt, damit sie jede Bewegung mitmachen.
const haarMat = new THREE.MeshStandardMaterial({ roughness: .85, flatShading: true, side: THREE.DoubleSide });
const haar2Mat = new THREE.MeshStandardMaterial({ roughness: .85, flatShading: true, side: THREE.DoubleSide });
const gummiMat = new THREE.MeshStandardMaterial({ color: '#e8508f', roughness: .45 });
const MAEHNE = { mittel: .24, lang: .46 }, SEITE = 1; // Seite +X: linke Pferdeseite, zur Startkamera hin
const maehneTeile = { mittel: [], lang: [], zoepfe: [], schopfMittel: [], schopfLang: [] };
let maehneArt = 'mittel', zoepfe = false, diag = {};

function maehneBauen(modell) {
  modell.updateMatrixWorld(true);
  const netze = []; modell.traverse(o => { if (o.isSkinnedMesh) netze.push(o); });
  const haar = netze.find(o => o.material.name === 'Hair'); if (!haar) return;
  const v = new THREE.Vector3();
  const welt = m => { const n = m.geometry.attributes.position.count, a = []; for (let i = 0; i < n; i++) { m.getVertexPosition(i, v); a.push(v.clone().applyMatrix4(m.matrixWorld)); } return a; };
  const knochen = n => modell.getObjectByName(n), wpos = o => o.getWorldPosition(new THREE.Vector3());
  const kopfK = knochen('Head'), halsK = knochen('Neck1');
  const kopfZ = wpos(kopfK).z, halsZ = wpos(halsK).z;
  // Mähne im Modell: nur die Punkte zwischen Halsansatz und Kopf (nicht Schweif, nicht Schopf)
  const hp = welt(haar).map((p, i) => ({ p, i })).filter(o => o.p.z > halsZ - .25 && o.p.z < kopfZ + .02);
  const koerper = netze.filter(o => /^Main/.test(o.material.name)).flatMap(welt);
  const si = haar.geometry.getAttribute('skinIndex'), sw = haar.geometry.getAttribute('skinWeight');
  const hauptKnochen = i => { let b = 0, w = -1; [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)].forEach((ix, k) => { const ww = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)][k]; if (ww > w) { w = ww; b = ix; } }); return haar.skeleton.bones[b]; };
  const zMin = Math.min(...hp.map(o => o.p.z)), zMax = Math.max(...hp.map(o => o.p.z));
  const xMitte = hp.reduce((s, o) => s + o.p.x, 0) / hp.length;
  diag = { zMin, zMax, kopfZ, halsZ, xMitte, punkte: hp.length, koerper: koerper.length };

  // Außenkante des Halses auf der Mähnenseite in Höhe y an der Stelle z
  const halsX = (z, y) => { let m = -Infinity; for (const p of koerper) if (Math.abs(p.z - z) < .06 && Math.abs(p.y - y) < .045) m = Math.max(m, (p.x - xMitte) * SEITE); return m; };
  // Kamm an Stelle z: höchster Mähnenpunkt in der Nähe, dazu der Knochen, an dem er hängt
  const kamm = z => { let best = null; for (const o of hp) if (Math.abs(o.p.z - z) < .035 && (!best || o.p.y > best.p.y)) best = o; return best && { y: best.p.y, knochen: hauptKnochen(best.i) }; };
  // Weg einer Strähne: am Hals entlang nach unten, leicht nach hinten und mit kleiner Welle
  // abstand = Abstand zur Halsoberfläche, weg = wie weit die Spitze vom Hals absteht
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
  // Strähne mit Grat: zwei schräge Flächen, damit sie von allen Seiten Volumen hat.
  // achse = Richtung der Breite, aus = Richtung des Grats (vom Hals weg), spitz = wie schmal die Spitze wird
  const AUS = new THREE.Vector3(SEITE, 0, 0);
  const band = (pts, w0, achse, ziel, aus = AUS, spitz = .6) => {
    const quer = (p, w) => [p.clone().addScaledVector(achse, -w), p.clone().addScaledVector(aus, w * .45), p.clone().addScaledVector(achse, w)];
    for (let j = 0; j < pts.length - 1; j++) {
      const A = quer(pts[j], w0 * (1 - spitz * j / (pts.length - 1)) / 2), B = quer(pts[j + 1], w0 * (1 - spitz * (j + 1) / (pts.length - 1)) / 2);
      for (const k of [0, 1]) ziel.push(...A[k].toArray(), ...B[k].toArray(), ...A[k + 1].toArray(), ...A[k + 1].toArray(), ...B[k].toArray(), ...B[k + 1].toArray());
    }
  };
  // Sammeln je Knochen und Material, am Ende zu einem Netz pro Knochen zusammenfassen
  const sammel = () => new Map();
  const zuKnochen = (map, knochen, mat, daten) => { const k = knochen.uuid + mat.uuid; if (!map.has(k)) map.set(k, { knochen, mat, pos: [], geos: [] }); const e = map.get(k); if (daten.pos) e.pos.push(...daten.pos); if (daten.geo) e.geos.push(daten.geo); };
  const anhaengen = (map, liste) => {
    for (const { knochen, mat, pos, geos } of map.values()) {
      const inv = knochen.matrixWorld.clone().invert(), teile = [];
      if (pos.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); teile.push(g); }
      for (const g of geos) teile.push(g.index ? g.toNonIndexed() : g);
      teile.forEach(g => { for (const n of ['normal', 'uv']) g.deleteAttribute(n); });
      const geo = mergeGeometries(teile); geo.applyMatrix4(inv); geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.frustumCulled = false; knochen.add(m); liste.push(m);
    }
  };
  const Z = new THREE.Vector3(0, 0, 1), X = new THREE.Vector3(1, 0, 0);
  // Einzelne lose Strähne: eigenes Drehgelenk am Ansatz, damit sie der Schwerkraft folgen kann (siehe haengen())
  const strang = (pts, knochen, mat, liste) => {
    const pos = []; band(pts, .085, Z, pos);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const inv = knochen.matrixWorld.clone().invert(); g.applyMatrix4(inv);
    const top = pts[0].clone().applyMatrix4(inv); g.translate(-top.x, -top.y, -top.z); g.computeVertexNormals();
    const piv = new THREE.Object3D(); piv.position.copy(top);
    const m = new THREE.Mesh(g, mat); m.castShadow = true; m.frustumCulled = false; piv.add(m); knochen.add(piv);
    piv.userData.unten = new THREE.Vector3(0, -1, 0).applyQuaternion(knochen.getWorldQuaternion(new THREE.Quaternion()).invert());
    liste.push(piv);
  };
  const K = 16, z0 = zMin + .03, z1 = Math.min(zMax, kopfZ) - .03;

  // Lose Strähnen in drei versetzten Reihen: hinten lang und dicht am Hals, vorn etwas kürzer und weiter außen
  for (const art of ['mittel', 'lang']) {
    const map = sammel(), L0 = MAEHNE[art], weg = art === 'lang' ? .05 : .025;
    for (let r = 0; r < 3; r++) for (let k = 0; k < K; k++) {
      const t = (k + r / 3) / (K - 1); if (t > 1) continue;
      const z = z0 + (z1 - z0) * t, km = kamm(z); if (!km) continue;
      const L = L0 * (.82 + .18 * Math.sin(Math.PI * Math.min(1, t * 1.3))) * (1 - r * .09) * (.9 + rnd(k * 7 + r) * .2);
      strang(pfad(z, km.y - .008, L, 8, .022 + r * .012, k + r * 3, weg), km.knochen, (k * 3 + r) % 5 === 2 ? haar2Mat : haarMat, maehneTeile[art]);
    }
  }

  // Zöpfe: Glieder im Fischgrät-Muster, unten Zopfgummi und Quaste
  {
    const map = sammel(), glied = new THREE.IcosahedronGeometry(1, 0), n = 9;
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

  // Stirnschopf: fällt vom Genick über die Stirn Richtung Maul
  {
    const muzzle = netze.find(o => o.material.name === 'Muzzle'), mp = muzzle ? welt(muzzle) : [];
    const schopf = welt(haar).filter(p => p.z > kopfZ - .03);
    if (mp.length && schopf.length) {
      const F = schopf.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(schopf.length);
      const Mz = mp.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(mp.length);
      const d = Mz.clone().sub(F).normalize(), nrm = new THREE.Vector3(0, d.z, -d.y).normalize();
      // Abstand der Stirnfläche von der Linie Genick–Maul, gemessen an den Punkten des Kopfes
      const stirn = P => { let m = 0; for (const p of koerper) { const q = p.clone().sub(P); if (Math.abs(q.dot(d)) < .035 && Math.abs(q.x) < .045) m = Math.max(m, q.dot(nrm)); } return m; };
      diag.schopf = F.toArray().map(x => +x.toFixed(3)); diag.maul = Mz.toArray().map(x => +x.toFixed(3));
      for (const [art, L] of [['schopfMittel', .16], ['schopfLang', .24]]) {
        const map = sammel();
        for (let i = -1; i <= 1; i++) {
          const pts = [];
          for (let j = 0; j <= 6; j++) { const f = j / 6, P = F.clone().addScaledVector(d, .02 + L * f * (1 - .12 * Math.abs(i))).add(new THREE.Vector3(i * .026 * (1 + f * .5), 0, 0)); pts.push(P.addScaledVector(nrm, stirn(P) + .014)); }
          const pos = []; band(pts, .06, X, pos, nrm, .55);
          zuKnochen(map, kopfK, i === 0 && art === 'schopfLang' ? haar2Mat : haarMat, { pos });
        }
        anhaengen(map, maehneTeile[art]);
      }
    }
  }
  maehneZeigen();
}
// Schwerkraft für lose Strähnen: nach unten und etwas seitlich vom Hals weg, im Galopp nach hinten wehend
const _q = new THREE.Quaternion(), _qi = new THREE.Quaternion(), _r = new THREE.Quaternion(), _r2 = new THREE.Quaternion(), _d = new THREE.Vector3(), _ziel = new THREE.Vector3();
function haengen() {
  const liste = maehneArt === 'mittel' ? maehneTeile.mittel : (maehneArt === 'lang' && !zoepfe ? maehneTeile.lang : null); if (!liste) return;
  const wehen = Math.min(1, tempo / TEMPO.gallop) * 1.2;
  _ziel.set(0, -1, 0).add(_d.set(Math.cos(kurs), 0, -Math.sin(kurs)).multiplyScalar(.5 * SEITE)).add(_d.set(-Math.sin(kurs), 0, -Math.cos(kurs)).multiplyScalar(wehen)).normalize();
  let knochen = null;
  for (const p of liste) {
    if (p.parent !== knochen) { knochen = p.parent; knochen.getWorldQuaternion(_q); _qi.copy(_q).invert(); }
    _d.copy(p.userData.unten).applyQuaternion(_q);
    _r.setFromUnitVectors(_d, _ziel); _r2.identity().slerp(_r, .8);
    p.quaternion.copy(_qi).multiply(_r2).multiply(_q);
  }
}
function maehneZeigen() {
  const lang = maehneArt === 'lang';
  maehneTeile.mittel.forEach(m => m.visible = maehneArt === 'mittel');
  maehneTeile.schopfMittel.forEach(m => m.visible = maehneArt === 'mittel');
  maehneTeile.lang.forEach(m => m.visible = lang && !zoepfe);
  maehneTeile.zoepfe.forEach(m => m.visible = lang && zoepfe);
  maehneTeile.schopfLang.forEach(m => m.visible = lang);
  const zb = document.getElementById('zopf');
  if (zb) { zb.disabled = !lang; zb.classList.toggle('an', lang && zoepfe); zb.textContent = lang && zoepfe ? 'Zöpfe lösen' : 'Zöpfe flechten'; }
  document.querySelectorAll('#maehne [data-l]').forEach(b => b.classList.toggle('an', b.dataset.l === maehneArt));
}

// ---------- Verhalten ----------
const RAND_X = 12.5, RAND_Z = 7.5, TEMPO = { walk: 1.45, gallop: 6 };
let modus = 'auto', zustand = 'idle', rest = 2, tempo = 0, kurs = .6, galoppZeit = 0;
const ziel = new THREE.Vector3();
function spiele(name, fade = .4, einmal = false) {
  const a = aktionen[name]; if (!a) return null; if (a === aktuell && !einmal) return a;
  a.reset(); a.setLoop(einmal ? THREE.LoopOnce : THREE.LoopRepeat, einmal ? 1 : Infinity); a.clampWhenFinished = einmal;
  a.setEffectiveTimeScale(1); a.setEffectiveWeight(1); a.play();
  if (aktuell && aktuell !== a) aktuell.crossFadeTo(a, fade, false); else a.fadeIn(fade);
  aktuell = a; return a;
}
function neuesZiel(min) {
  for (let i = 0; i < 40; i++) {
    const x = (Math.random() * 2 - 1) * RAND_X, z = (Math.random() * 2 - 1) * RAND_Z;
    if (Math.hypot(x - pferd.position.x, z - pferd.position.z) > min) return ziel.set(x, 0, z);
  }
  return ziel.set(0, 0, 0);
}
function setze(z) {
  zustand = z;
  if (z === 'walk') { neuesZiel(4); spiele('Walk'); }
  else if (z === 'gallop') { neuesZiel(10); spiele('Gallop', .3); galoppZeit = 7 + Math.random() * 5; }
  else if (z === 'graze') { spiele('Eating', .6); rest = 8 + Math.random() * 8; }
  else if (z === 'idle') { spiele(['Idle', 'Idle_2', 'Idle_Headlow'][Math.floor(Math.random() * 3)], .5); rest = 3 + Math.random() * 4; }
  else if (z === 'jump') { const a = spiele('Jump_toIdle', .2, true); rest = a ? a.getClip().duration - .1 : .5; }
}
function weiter() {
  if (modus !== 'auto') return setze(modus);
  const r = Math.random();
  setze(r < .45 ? 'walk' : r < .78 ? 'graze' : r < .9 ? 'idle' : 'gallop');
}
function bewege(dt) {
  if (zustand === 'walk' || zustand === 'gallop') {
    const soll = TEMPO[zustand], dx = ziel.x - pferd.position.x, dz = ziel.z - pferd.position.z, dist = Math.hypot(dx, dz);
    let d = Math.atan2(dx, dz) - kurs; d = Math.atan2(Math.sin(d), Math.cos(d));
    const dreh = zustand === 'gallop' ? 2 : 1.3;
    kurs += THREE.MathUtils.clamp(d, -dreh * dt, dreh * dt);
    tempo += (soll * THREE.MathUtils.clamp(Math.cos(d), .3, 1) - tempo) * Math.min(1, dt * 2.5);
    if (aktuell) aktuell.setEffectiveTimeScale(THREE.MathUtils.clamp(tempo / soll, .6, 1.15));
    if (zustand === 'gallop') {
      galoppZeit -= dt; if (dist < 3) neuesZiel(10);
      if (galoppZeit <= 0) { if (modus === 'gallop') galoppZeit = 7; else setze('walk'); }
    } else if (dist < .8) { if (modus === 'walk') neuesZiel(4); else weiter(); }
  } else {
    tempo = Math.max(0, tempo - dt * 4);
    rest -= dt; if (rest <= 0) weiter();
  }
  pferd.position.x = THREE.MathUtils.clamp(pferd.position.x + Math.sin(kurs) * tempo * dt, -KX + 1.4, KX - 1.4);
  pferd.position.z = THREE.MathUtils.clamp(pferd.position.z + Math.cos(kurs) * tempo * dt, -KZ + 1.4, KZ - 1.4);
  pferd.rotation.y = kurs;
}

// ---------- Knöpfe ----------
const markiere = (sel, b) => document.querySelectorAll(sel).forEach(x => x.classList.toggle('an', x === b));
document.getElementById('bew').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !geladen) return;
  if (b.dataset.m === 'jump') return setze('jump');
  modus = b.dataset.m; markiere('#bew button', b); weiter();
});
document.getElementById('fell').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  markiere('#fell button', b); fell(b.dataset.f);
});
document.getElementById('maehne').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  if (b.id === 'zopf') zoepfe = !zoepfe; else maehneArt = b.dataset.l;
  maehneZeigen();
});

new GLTFLoader().load('modelle/pferd.glb', gltf => {
  const modell = gltf.scene;
  modell.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = true; o.frustumCulled = false;
    const m = o.material; m.metalness = 0; m.roughness = .78; M[m.name] = m;
    if (/^Main/.test(m.name) && o.isSkinnedMesh) { beinAttribut(o); beinShader(m); }
  });
  pferd.add(modell); pferd.updateMatrixWorld(true);
  // Blickrichtung des Modells bestimmen (vom Schweif zum Kopf) und nach +Z drehen
  const kopf = modell.getObjectByName('Head'), schweif = modell.getObjectByName('Tail1');
  if (kopf && schweif) { const a = new THREE.Vector3(), b = new THREE.Vector3(); kopf.getWorldPosition(a); schweif.getWorldPosition(b); modell.rotation.y = -Math.atan2(a.x - b.x, a.z - b.z); }
  pferd.updateMatrixWorld(true);
  let bb = new THREE.Box3().setFromObject(modell, true);
  modell.scale.multiplyScalar(2.1 / (bb.max.y - bb.min.y)); pferd.updateMatrixWorld(true);
  bb = new THREE.Box3().setFromObject(modell, true);
  modell.position.x -= (bb.min.x + bb.max.x) / 2; modell.position.z -= (bb.min.z + bb.max.z) / 2; modell.position.y -= bb.min.y;
  pferd.updateMatrixWorld(true);
  try { maehneBauen(modell); } catch (e) { console.error('Mähne konnte nicht gebaut werden', e); }
  mixer = new THREE.AnimationMixer(modell);
  for (const clip of gltf.animations) if (!clip.name.includes('|')) aktionen[clip.name] = mixer.clipAction(clip);
  fell('falbe'); geladen = true; laden.remove(); weiter();
}, undefined, err => { laden.textContent = 'Das Pferd konnte nicht geladen werden.'; console.error(err); });

// ---------- Schleife ----------
const uhr = new THREE.Timer(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
uhr.connect(document);
let fN = 0, fT = 0, schlecht = 0;
function spare() {
  schlecht = 0; sparsam = true;
  if (pr > 1) { pr = 1; renderer.setPixelRatio(1); groesse(); } else if (sonne.castShadow) sonne.castShadow = false;
}
renderer.setAnimationLoop(t => {
  uhr.update(t);
  const roh = uhr.getDelta(), dt = Math.min(roh, .1);
  if (geladen) { bewege(dt); mixer.update(dt); haengen(); }
  for (const w of wolken) { w.position.x += dt * 1.2; if (w.position.x > 420) w.position.x -= 840; }
  // Kamera folgt dem Pferd, der Blickwinkel bleibt wie eingestellt
  v1.set(pferd.position.x, 1.1, pferd.position.z);
  v2.copy(v1).sub(steuerung.target).multiplyScalar(Math.min(1, dt * 2.5));
  steuerung.target.add(v2); camera.position.add(v2); steuerung.update();
  himmel.position.copy(camera.position);
  sonnenBild.position.copy(camera.position).addScaledVector(SONNE_RICHTUNG, 480);
  renderer.render(scene, camera);
  fN++; fT += roh;
  if (fT >= 1) {
    const fps = fN / fT; fpsEl.textContent = Math.round(fps) + ' Bilder/s' + (sparsam ? ' · Sparmodus' : '');
    if (!TEST) { if (fps < 28) schlecht++; else schlecht = 0; if (schlecht >= 3) spare(); }
    fN = 0; fT = 0;
  }
});

// Für automatische Tests
window.studie = { setze, fell, pferd, camera, steuerung, maehne(a, z) { maehneArt = a; zoepfe = !!z; maehneZeigen(); }, get diag() { return diag; }, get maehneTeile() { return Object.fromEntries(Object.entries(maehneTeile).map(([k, l]) => [k, l.length])); }, get zustand() { return zustand; }, get geladen() { return geladen; }, aktionen: () => Object.keys(aktionen), set modus(m) { modus = m; } };
