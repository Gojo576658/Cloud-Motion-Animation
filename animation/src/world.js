// The single 3D world. Every location (living room, whole house, neighbourhood,
// the chip inside the TV, the history timeline) lives in one scene so the
// camera can fly between them without cuts.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ease, lerp, clamp, onFrame, rng } from './kit.js';

export const W = 1920, H = 1080;
export const COL = { red: 0xff2d46, cyan: 0x2fe0ff, amber: 0xffb547, green: 0x3df59a, bg: 0x04060c };

const canvas = document.getElementById('gl');
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
// 3D is rendered at 75% and scaled up by the page; all text/UI stays at full 1080p
export const GL_SCALE = 0.75;
renderer.setPixelRatio(1);
renderer.setSize(W * GL_SCALE, H * GL_SCALE, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

export const scene = new THREE.Scene();
scene.background = new THREE.Color(COL.bg);
scene.fog = new THREE.FogExp2(COL.bg, 0.016);

export const camera = new THREE.PerspectiveCamera(38, W / H, 0.03, 600);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
export const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.9, 0.55, 0.62);
composer.addPass(bloom);
composer.setSize(W * GL_SCALE, H * GL_SCALE);
bloom.setSize((W * GL_SCALE) / 2, (H * GL_SCALE) / 2); // bloom mips start at quarter resolution (much cheaper in software GL)
export function composerSetSize(w, h) { composer.setSize(w, h); bloom.setSize(w / 2, h / 2); }
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- camera rig
// Shots are keyframes; the camera is a pure function of t.
const shots = [];
const shakes = [];
let lastShotT = -1;
export function shot(t, pos, target, o = {}) {
  if (t < lastShotT - 1e-6) console.warn(`shot out of order: ${t.toFixed(2)} < ${lastShotT.toFixed(2)}`);
  lastShotT = Math.max(lastShotT, t + (o.hold || 0));
  if (o.hold) shots.push({ t: t + o.hold, pos: new THREE.Vector3(...pos), target: new THREE.Vector3(...target), fov: o.fov ?? 38, roll: o.roll ?? 0, ease: ease('none'), cut: false, via: null });
  shots.push({ t, pos: new THREE.Vector3(...pos), target: new THREE.Vector3(...target), fov: o.fov ?? 38, roll: o.roll ?? 0, ease: ease(o.ease ?? 'power2.inOut'), cut: !!o.cut, via: o.via ? new THREE.Vector3(...o.via) : null });
  shots.sort((a, b) => a.t - b.t);
}
export function shake(t, dur, amp) { shakes.push({ t, dur, amp }); }

const _p = new THREE.Vector3(), _t = new THREE.Vector3();
function evalCamera(t) {
  let a = shots[0], b = shots[0];
  for (let i = 0; i < shots.length; i++) { if (shots[i].t <= t) { a = shots[i]; b = shots[i + 1] || shots[i]; } }
  let u = b === a ? 0 : clamp((t - a.t) / (b.t - a.t));
  if (b.cut) u = 0;
  const e = b.ease(u);
  if (b.via) {
    // quadratic bezier through the via point
    const q = new THREE.QuadraticBezierCurve3(a.pos, b.via, b.pos);
    q.getPoint(e, _p);
  } else _p.lerpVectors(a.pos, b.pos, e);
  _t.lerpVectors(a.target, b.target, e);
  let sx = 0, sy = 0;
  for (const s of shakes) {
    const k = clamp((t - s.t) / s.dur);
    if (k > 0 && k < 1) { const amp = s.amp * (1 - k); sx += Math.sin(t * 83) * amp; sy += Math.cos(t * 71) * amp; }
  }
  camera.position.copy(_p);
  camera.position.x += sx; camera.position.y += sy;
  camera.fov = lerp(a.fov, b.fov, e);
  camera.updateProjectionMatrix();
  camera.up.set(Math.sin(lerp(a.roll, b.roll, e)), Math.cos(lerp(a.roll, b.roll, e)), 0);
  camera.lookAt(_t);
}

export function project(v) {
  const p = v.clone().project(camera);
  return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, behind: p.z > 1 };
}

// lights are only switched on for the location the camera is at
// (every visible light costs per pixel in software rendering)
export const lightsByStation = { room: [], chip: [], hist: [] };
export function stationLight(light, st) { light.userData.station = st; lightsByStation[st].push(light); return light; }
let curStation = '';
export function render(t) {
  evalCamera(t);
  const x = camera.position.x;
  const st = x < -100 ? 'chip' : x > 100 ? 'hist' : 'room';
  if (st !== curStation) {
    for (const [k, list] of Object.entries(lightsByStation)) for (const l of list) l.visible = k === st;
    curStation = st;
  }
  composer.render();
}

// ---------------------------------------------------------------- materials
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.1, ...o });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
export const M = { std, glow };

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, c, g };
}

// ---------------------------------------------------------------- lights
scene.add(new THREE.HemisphereLight(0x44567f, 0x0a0c14, 0.95));
const moon = new THREE.DirectionalLight(0x7f9cff, 1.4);
moon.position.set(-8, 10, 4);
scene.add(moon);

// ---------------------------------------------------------------- builders
export function makeTV(o = {}) {
  const g = new THREE.Group();
  const w = o.w ?? 3.3, h = o.h ?? 1.9;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.07), std(0x0b0e15, { roughness: 0.3, metalness: 0.7 }));
  g.add(body);
  const screenTex = canvasTex(640, 360, (c, W2, H2) => { c.fillStyle = '#000'; c.fillRect(0, 0, W2, H2); });
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex.tex, toneMapped: false, color: 0xffffff });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, h - 0.08), screenMat);
  screen.position.z = 0.036;
  g.add(screen);
  // glossy reflection strip so a black screen still reads as glass
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, h - 0.08), new THREE.MeshBasicMaterial({ map: canvasTex(256, 256, (c) => {
    const gr = c.createLinearGradient(0, 0, 256, 256);
    gr.addColorStop(0, 'rgba(120,150,255,0.05)'); gr.addColorStop(0.45, 'rgba(120,150,255,0.01)'); gr.addColorStop(0.5, 'rgba(160,190,255,0.035)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
  }).tex, transparent: true, depthWrite: false }));
  sheen.position.z = 0.038;
  g.add(sheen);
  // thin bright edge so the set reads against a dark wall
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, 0.07)), new THREE.LineBasicMaterial({ color: 0x4a5f8a, toneMapped: false }));
  g.add(edge);
  // microphone dot + its light
  const mic = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), glow(COL.red));
  mic.position.set(0, -h / 2 + 0.012, 0.045);
  g.add(mic);
  const micLight = new THREE.PointLight(COL.red, 0.6, 2.2, 2);
  micLight.position.set(0, -h / 2 + 0.02, 0.2);
  if (o.micLight !== false) g.add(micLight);
  const micGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: COL.red, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  micGlow.position.copy(mic.position); micGlow.scale.setScalar(0.28);
  g.add(micGlow);
  // stand
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.06), std(0x0e1118, { metalness: 0.8, roughness: 0.3 }));
  neck.position.set(0, -h / 2 - 0.12, -0.05);
  g.add(neck);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.32), std(0x0e1118, { metalness: 0.8, roughness: 0.3 }));
  foot.position.set(0, -h / 2 - 0.26, 0);
  g.add(foot);
  // screen glow light (for when the screen is on)
  const screenLight = new THREE.PointLight(0x8fb6ff, 0, 9, 1.6);
  screenLight.position.set(0, 0, 1.2);
  if (o.screenLight) g.add(screenLight);
  return { g, screen, screenMat, screenTex, mic, micLight, micGlow, screenLight, w, h };
}

let _glowTex;
export function glowTex() {
  if (_glowTex) return _glowTex;
  _glowTex = canvasTex(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  }).tex;
  return _glowTex;
}

function roundedBox(w, h, d, color, o) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 2), std(color, o));
  return m;
}

export function makePerson() {
  const g = new THREE.Group();
  const mat = std(0x06080e, { roughness: 0.95 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.5, 8, 16), mat);
  torso.position.y = 0.55; torso.scale.set(1.15, 1, 0.75);
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 18), mat);
  head.position.y = 1.08;
  g.add(head);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), mat);
  neck.position.y = 0.94;
  g.add(neck);
  return { g, head, torso };
}

export function makeSofa() {
  const g = new THREE.Group();
  const c = 0x151b2a;
  const base = roundedBox(3, 0.42, 1.0, c); base.position.y = 0.21; g.add(base);
  const seat = roundedBox(2.6, 0.14, 0.85, 0x1b2336); seat.position.set(0, 0.48, -0.05); g.add(seat);
  const back = roundedBox(3, 0.75, 0.24, c); back.position.set(0, 0.72, 0.38); g.add(back);
  const a1 = roundedBox(0.22, 0.62, 1.0, c); a1.position.set(-1.39, 0.42, 0); g.add(a1);
  const a2 = a1.clone(); a2.position.x = 1.39; g.add(a2);
  return g;
}

export function makePhone(screenColor = 0x0c1a33) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.009, 0.155), std(0x2a2f3a, { metalness: 0.8, roughness: 0.3 }));
  g.add(body);
  const lock = canvasTex(136, 292, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(0,0,0,0.55)'; c.font = '800 44px Montserrat'; c.textAlign = 'center'; c.fillText('22:41', w / 2, 80);
    c.font = '600 14px Inter'; c.fillText('Tuesday, 6 October', w / 2, 104);
    c.beginPath(); c.arc(w / 2, 200, 26, 0, 7); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fill();
    c.fillStyle = '#fff'; c.fillRect(w / 2 - 6, 186, 12, 20); c.fillRect(w / 2 - 1.5, 208, 3, 8);
    c.fillStyle = 'rgba(0,0,0,0.4)'; c.fillRect(w / 2 - 22, 270, 44, 5);
  });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.146), new THREE.MeshBasicMaterial({ map: lock.tex, color: screenColor, toneMapped: false }));
  scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0045;
  g.add(scr);
  return { g, scr };
}

export function makeGlasses() {
  const g = new THREE.Group();
  const mat = std(0x6b7690, { metalness: 0.8, roughness: 0.3 });
  const rimL = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 10, 32), mat);
  rimL.position.x = -0.07; g.add(rimL);
  const rimR = rimL.clone(); rimR.position.x = 0.07; g.add(rimR);
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.03, 8), mat);
  bridge.rotation.z = Math.PI / 2; g.add(bridge);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.16), mat);
  armL.position.set(-0.125, 0, -0.08); g.add(armL);
  const armR = armL.clone(); armR.position.x = 0.125; g.add(armR);
  const cam = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 8), glow(0x222733));
  cam.position.set(-0.125, 0.012, 0.004); g.add(cam);
  return { g, cam };
}

export function textSprite(text, o = {}) {
  const { size = 64, color = '#eef2f8', font = '800 64px Montserrat', pad = 24, bg = null, border = null, scale = 0.01 } = o;
  const m = document.createElement('canvas').getContext('2d');
  m.font = font;
  const tw = Math.ceil(m.measureText(text).width) + pad * 2;
  const th = size + pad * 2;
  const { tex } = canvasTex(tw, th, (c) => {
    if (bg) { c.fillStyle = bg; roundRect(c, 2, 2, tw - 4, th - 4, 18); c.fill(); }
    if (border) { c.strokeStyle = border; c.lineWidth = 4; roundRect(c, 2, 2, tw - 4, th - 4, 18); c.stroke(); }
    c.font = font; c.fillStyle = color; c.textBaseline = 'middle'; c.textAlign = 'center';
    c.fillText(text, tw / 2, th / 2 + 2);
  });
  const sp = new THREE.Mesh(new THREE.PlaneGeometry(tw * scale, th * scale), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
  return sp;
}
export function roundRect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

// ================================================================ LIVING ROOM + HOUSE
export const room = {};
{
  const floorTex = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#0a0d15'; c.fillRect(0, 0, w, h);
    const r = rng(7);
    for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 256) {
      const off = (y / 64) % 2 ? 128 : 0;
      c.fillStyle = `rgba(${30 + r() * 14},${34 + r() * 14},${48 + r() * 16},1)`;
      c.fillRect(x + off, y, 254, 62);
    }
  });
  floorTex.tex.wrapS = floorTex.tex.wrapT = THREE.RepeatWrapping;
  floorTex.tex.repeat.set(4, 3.35);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 13.4), std(0x5a6274, { map: floorTex.tex, roughness: 0.55, metalness: 0.15 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(4, 0, 3.3);
  scene.add(floor);
  room.floor = floor;

  // ground outside the house (darker, large)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std(0x070a12, { roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.03;
  scene.add(ground);

  // walls of the house: [x1,z1,x2,z2]
  const wallMat = std(0x161c2b, { roughness: 0.9 });
  const capMat = glow(0x2a3a5c);
  const walls = [
    [-4, -3.4, 12, -3.4], [-4, -3.4, -4, 10], [12, -3.4, 12, 10], [-4, 10, 12, 10], // outer
    [4, -3.4, 4, 1.2], [4, 2.6, 4, 10], // living | kitchen/bedroom (door gap)
    [4, 3.4, 8, 3.4], [9.4, 3.4, 12, 3.4], // kitchen | bedroom
  ];
  room.walls = new THREE.Group();
  for (const [x1, z1, x2, z2] of walls) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 2.7, 0.12), wallMat);
    m.position.set((x1 + x2) / 2, 1.35, (z1 + z2) / 2);
    m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    room.walls.add(m);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, 0.13), capMat);
    cap.position.set((x1 + x2) / 2, 2.71, (z1 + z2) / 2);
    cap.rotation.y = m.rotation.y;
    room.walls.add(cap);
  }
  scene.add(room.walls);

  // window on the left wall with moonlight
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.3), glow(0x2b4a8c, 0.9));
  win.position.set(-3.93, 1.6, 0.4); win.rotation.y = Math.PI / 2;
  scene.add(win);
  const winBars = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.3, 0.04), std(0x0b0f18));
  winBars.position.set(-3.92, 1.6, 0.4); scene.add(winBars);
  const winBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 1.8), std(0x0b0f18));
  winBar2.position.set(-3.92, 1.6, 0.4); scene.add(winBar2);
  const moonSpot = new THREE.SpotLight(0x6f8fff, 6, 14, 0.6, 0.8, 1.2);
  moonSpot.position.set(-3.5, 2.2, 0.4); moonSpot.target.position.set(0, 0, 1.5);
  scene.add(moonSpot, moonSpot.target);
  stationLight(moonSpot, 'room');

  // TV console + TV
  const console1 = roundedBox(3.8, 0.45, 0.5, 0x10141f, { roughness: 0.6 });
  console1.position.set(0, 0.225, -3.0);
  scene.add(console1);
  const tv = makeTV();
  stationLight(tv.micLight, 'room');
  tv.g.position.set(0, 1.42, -3.05);
  scene.add(tv.g);
  room.tv = tv;
  room.micWorld = new THREE.Vector3(0, 1.42 - tv.h / 2 + 0.012, -3.0);

  // wall jack + ethernet cable
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.02), std(0xc9cfdc, { roughness: 0.5 }));
  plate.position.set(2.6, 0.32, -3.33); scene.add(plate);
  const portLed = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 8), glow(COL.green));
  portLed.position.set(2.64, 0.38, -3.315); scene.add(portLed);
  room.portLed = portLed;
  const plug = new THREE.Group();
  const plugBody = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.1), std(0x2f6bff, { roughness: 0.4, transparent: true, opacity: 0.85 }));
  plugBody.position.z = 0.05; plug.add(plugBody);
  plug.position.set(2.6, 0.3, -3.32);
  scene.add(plug);
  room.plug = plug;
  const cableCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.6, 1.0, -3.12), new THREE.Vector3(1.0, 0.6, -3.22), new THREE.Vector3(1.6, 0.06, -3.2), new THREE.Vector3(2.45, 0.05, -3.15), new THREE.Vector3(2.6, 0.3, -3.2)]);
  room.cableCurve = cableCurve;
  const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 60, 0.012, 8), std(0x2f6bff, { roughness: 0.5 }));
  scene.add(cable);
  room.cable = cable;

  // sofa, person, coffee table, phone, glasses, plant, lamp
  const sofa = makeSofa();
  sofa.position.set(0, 0, 2.6); sofa.rotation.y = 0;
  scene.add(sofa);
  const person = makePerson();
  person.g.position.set(-0.6, 0.42, 2.55);
  scene.add(person.g);
  room.person = person;
  const table = roundedBox(1.4, 0.06, 0.7, 0x1a2133, { roughness: 0.35, metalness: 0.4 });
  table.position.set(0, 0.42, 0.9); scene.add(table);
  const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8);
  for (const [lx, lz] of [[-0.6, 0.6], [0.6, 0.6], [-0.6, 1.2], [0.6, 1.2]]) { const l = new THREE.Mesh(legGeo, std(0x0d111a)); l.position.set(lx, 0.2, lz); scene.add(l); }
  const phone = makePhone();
  phone.g.position.set(0.35, 0.455, 0.95); phone.g.rotation.y = 0.4;
  scene.add(phone.g);
  room.phone = phone;
  const glasses = makeGlasses();
  glasses.g.position.set(-0.32, 0.5, 0.9); glasses.g.rotation.y = -0.5; glasses.g.scale.setScalar(1.6);
  scene.add(glasses.g);
  room.glasses = glasses;
  // bias glow on the wall behind the TV + cool rim light from the TV side + warm lamp
  const bias = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.6), new THREE.MeshBasicMaterial({ map: canvasTex(256, 128, (c) => {
    const g = c.createRadialGradient(128, 64, 0, 128, 64, 128);
    g.addColorStop(0, 'rgba(70,110,220,0.55)'); g.addColorStop(0.5, 'rgba(40,70,160,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, 256, 128);
  }).tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  bias.position.set(0, 1.5, -3.32);
  scene.add(bias);
  room.bias = bias;
  const rim = new THREE.PointLight(0x6d8cff, 6, 9, 1.3);
  rim.position.set(0.4, 1.9, -1.6);
  scene.add(rim);
  stationLight(rim, 'room');
  const warm = new THREE.PointLight(0xffa860, 6, 6, 1.4);
  warm.position.set(2.6, 1.45, 2.9);
  scene.add(warm);
  stationLight(warm, 'room');
  room.warm = warm;
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.35, 20, 1, true), std(0x2a3044, { side: THREE.DoubleSide }));
  lamp.position.set(2.6, 1.55, 2.9); scene.add(lamp);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), glow(0xffc27a));
  bulb.position.set(2.6, 1.45, 2.9); scene.add(bulb);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), std(0x0d111a, { metalness: 0.8 }));
  pole.position.set(2.6, 0.7, 2.9); scene.add(pole);
  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.45, 16), std(0x1d2436));
  plantPot.position.set(-3.2, 0.22, -2.6); scene.add(plantPot);
  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), std(0x10261f, { flatShading: true }));
  leaves.position.set(-3.2, 0.85, -2.6); leaves.scale.y = 1.3; scene.add(leaves);

  // other rooms: simple furniture blocks so the top-down view reads as a home
  const furn = [
    [8, 0.45, -2.9, 7, 0.9, 0.6, 0x141a28], [11.6, 1.0, -0.5, 0.7, 2.0, 0.7, 0x1a2030], [7.5, 0.4, 0.4, 1.6, 0.8, 0.9, 0x161d2d], // kitchen counter, fridge, table
    [8, 0.3, 7.8, 2.2, 0.6, 2.4, 0x1b2236], [8, 0.65, 9.2, 2.2, 0.7, 0.2, 0x151b2a], [11.4, 0.5, 5.2, 0.8, 1.0, 0.5, 0x151b2a], // bed, headboard, drawer
    [-1.5, 0.38, 9.3, 2.2, 0.06, 0.8, 0x1a2133], [2.6, 0.5, 8.6, 1.0, 1.0, 1.0, 0x161d2d], // office desk, shelf
  ];
  for (const [x, y, z, w, h, d, c] of furn) { const b = roundedBox(w, h, d, c); b.position.set(x, y, z); scene.add(b); }
  const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.01, 0.24), std(0x2b3142, { metalness: 0.7 }));
  laptop.position.set(-1.5, 0.42, 9.25); scene.add(laptop);
  const lapScr = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.21), glow(0x16305e));
  lapScr.position.set(-1.5, 0.53, 9.38); lapScr.rotation.x = -0.25; lapScr.rotation.y = Math.PI; scene.add(lapScr);
}

// ---- devices the TV "finds" on the network (38 of them) ----
export const devices = [];
{
  const named = [
    ['Smartphone', 0.35, 0.5, 0.95], ['Smartwatch', 0.45, 0.9, 2.45], ['Laptop', -1.5, 0.5, 9.25], ['3D Printer', 2.6, 1.1, 8.6],
    ['Air Purifier', 11.2, 0.6, 9.4], ['Thermostat', 3.94, 1.5, -1.0], ['Smart Speaker', -3.2, 0.5, 4.3], ['Tablet', 8.0, 0.65, 7.6],
    ['Game Console', -1.4, 0.5, -2.9], ['Security Cam', 11.8, 2.4, -3.2], ['Smart Bulb', 7.5, 2.4, 0.4], ['Router', -3.7, 0.9, -3.2],
    ['Smart Fridge', 11.6, 1.8, -0.5], ['Phone #2', 8.2, 0.65, 8.2], ['Printer', 3.3, 0.9, 9.4],
  ];
  const r = rng(38);
  for (let i = 0; i < 38; i++) {
    const n = named[i];
    const pos = n ? new THREE.Vector3(n[1], n[2], n[3]) : new THREE.Vector3(-3.5 + r() * 15, 0.4 + r() * 1.8, -3 + r() * 12.6);
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 0), glow(COL.cyan));
    m.position.copy(pos);
    m.scale.setScalar(0.0001);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.36, 32), glow(COL.cyan, 0.8));
    ring.position.copy(pos); ring.rotation.x = -Math.PI / 2; ring.scale.setScalar(0.0001);
    scene.add(m, ring);
    devices.push({ name: n ? n[0] : null, pos, m, ring, i });
  }
}

// ---- radar sweep + sound rings centred on the TV ----
export const fxTV = {};
{
  const sweepTex = canvasTex(512, 512, (c) => {
    const g = c.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, 'rgba(47,224,255,0.0)'); g.addColorStop(0.2, 'rgba(47,224,255,0.25)'); g.addColorStop(1, 'rgba(47,224,255,0.0)');
    c.fillStyle = g; c.fillRect(0, 0, 512, 512);
  });
  const sweep = new THREE.Mesh(new THREE.CircleGeometry(16, 64, 0, 0.7), new THREE.MeshBasicMaterial({ map: sweepTex.tex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide }));
  sweep.rotation.x = -Math.PI / 2; sweep.position.set(0, 0.03, -2.9);
  scene.add(sweep);
  fxTV.sweep = sweep;
  fxTV.rings = [];
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.0, 96), new THREE.MeshBasicMaterial({ color: COL.red, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.04, -2.9);
    scene.add(ring);
    fxTV.rings.push(ring);
  }
  // 12 m ruler on the floor
  const ruler = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 12), glow(COL.amber));
  bar.position.z = 6; ruler.add(bar);
  for (let k = 0; k <= 12; k++) { const tick = new THREE.Mesh(new THREE.BoxGeometry(k % 4 ? 0.2 : 0.45, 0.01, 0.03), glow(COL.amber)); tick.position.z = k; ruler.add(tick); }
  ruler.position.set(-3.2, 0.05, -2.9);
  ruler.scale.z = 0.0001;
  scene.add(ruler);
  fxTV.ruler = ruler;
}

// ================================================================ NEIGHBOURHOOD + AD SERVER
export const hood = { houses: [] };
{
  const spots = [[-22, -14, 'NETGEAR_7F2A'], [24, -16, 'Khan_Family_5G'], [-26, 14, 'TP-Link_8F2A'], [26, 18, 'HOME-4C1E'], [4, 30, 'Sarah iPhone'], [-6, -30, 'FiberHome_22']];
  for (const [x, z, ssid] of spots) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(9, 4, 8), std(0x1a2236));
    body.position.y = 2; g.add(body);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x3a5488, toneMapped: false });
    const be = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), edgeMat); be.position.copy(body.position); g.add(be);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(7, 3, 4), std(0x141b2c));
    roof.position.y = 5.5; roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.85); g.add(roof);
    const re = new THREE.LineSegments(new THREE.EdgesGeometry(roof.geometry), edgeMat); re.position.copy(roof.position); re.rotation.copy(roof.rotation); re.scale.copy(roof.scale); g.add(re);
    for (let k = 0; k < 4; k++) { const wdw = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1), glow(k % 2 ? 0xffc879 : 0x4a6aa8)); wdw.position.set(-3 + k * 2, 2.4, 4.01); g.add(wdw); }
    g.position.set(x, 0, z); g.lookAt(4, 0, 3);
    scene.add(g);
    hood.houses.push({ g, ssid, top: new THREE.Vector3(x, 8, z) });
  }
  const streets = new THREE.GridHelper(160, 16, 0x1d2b48, 0x121c30);
  streets.position.set(4, -0.02, 3);
  scene.add(streets);
  hood.streets = streets;
  // ad-solutions data centre
  const dc = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 9, 2.2), std(0x151c2e, { metalness: 0.5, roughness: 0.4 }));
    rack.position.set(i * 3 - 6, 4.5, 0); dc.add(rack);
    const rEdge = new THREE.LineSegments(new THREE.EdgesGeometry(rack.geometry), new THREE.LineBasicMaterial({ color: 0x3a5488, toneMapped: false }));
    rEdge.position.copy(rack.position); dc.add(rEdge);
    for (let k = 0; k < 12; k++) { const led = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.08), glow(k % 3 ? COL.cyan : COL.red, 0.9)); led.position.set(i * 3 - 6, 1 + k * 0.65, 1.11); dc.add(led); }
  }
  dc.position.set(40, 0, -36); dc.lookAt(4, 0, 3);
  scene.add(dc);
  hood.dc = dc;
  hood.dcTop = new THREE.Vector3(40, 10, -36);
}

// ================================================================ CHIP STATION (inside the TV)
export const chip = { x: -150 };
{
  const g = new THREE.Group();
  g.position.set(chip.x, 0, 0);
  const pcb = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#04140f'; c.fillRect(0, 0, w, h);
    const r = rng(3);
    c.strokeStyle = 'rgba(61,245,154,0.22)'; c.lineWidth = 3;
    for (let i = 0; i < 70; i++) {
      let x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y);
      for (let k = 0; k < 4; k++) { if (r() > 0.5) x += (r() - 0.5) * 300; else y += (r() - 0.5) * 300; c.lineTo(x, y); }
      c.stroke(); c.fillStyle = 'rgba(61,245,154,0.35)'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill();
    }
  });
  const board = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), std(0x2a6b52, { map: pcb.tex, roughness: 0.5, metalness: 0.3 }));
  board.rotation.x = -Math.PI / 2;
  g.add(board);
  const dsp = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1.6), std(0x07090d, { roughness: 0.3, metalness: 0.6 }));
  dsp.position.set(-3.2, 0.125, 0); g.add(dsp);
  const dspLabel = textSprite('LOW-POWER DSP', { font: '700 40px Mono', size: 40, color: '#9aa8c2' });
  dspLabel.rotation.x = -Math.PI / 2; dspLabel.position.set(-3.2, 0.26, 0.2); dspLabel.scale.setScalar(0.5); g.add(dspLabel);
  for (let i = 0; i < 12; i++) { const pin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.2), std(0xb9c2d4, { metalness: 1, roughness: 0.3 })); pin.position.set(-3.9 + i * 0.13, 0.03, 0.9); g.add(pin); const p2 = pin.clone(); p2.position.z = -0.9; g.add(p2); }
  const micCap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32), std(0x9aa3b5, { metalness: 0.9, roughness: 0.25 }));
  micCap.position.set(-7, 0.15, 0); g.add(micCap);
  const micHole = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), glow(COL.red));
  micHole.rotation.x = -Math.PI / 2; micHole.position.set(-7, 0.31, 0); g.add(micHole);
  chip.micHole = micHole;
  // the tape loop (ring buffer): 64 segments
  chip.segs = [];
  const R = 1.8;
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.32), new THREE.MeshBasicMaterial({ color: COL.cyan, toneMapped: false, transparent: true, opacity: 0.15 }));
    s.position.set(1.6 + Math.cos(a) * R, 0.1, Math.sin(a) * R);
    s.rotation.y = -a;
    g.add(s);
    chip.segs.push(s);
  }
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 16), glow(COL.red));
  head.rotation.z = Math.PI; g.add(head);
  chip.head = head;
  chip.ringCenter = new THREE.Vector3(chip.x + 1.6, 0, 0);
  // wave line from mic to DSP to ring
  const N = 160;
  const pos = new Float32Array(N * 3);
  const wave = new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)), new THREE.LineBasicMaterial({ color: COL.red, transparent: true, opacity: 0, toneMapped: false }));
  g.add(wave);
  chip.wave = wave; chip.N = N;
  // the "Hi LG" pattern bar + bin
  const lgLabel = textSprite('"HI LG"', { font: '900 70px Montserrat', size: 70, color: '#2fe0ff' });
  lgLabel.position.set(6.6, 1.4, 0); lgLabel.scale.setScalar(0.6); g.add(lgLabel);
  chip.lgLabel = lgLabel;
  const bin = new THREE.Group();
  const binBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.9, 24, 1, true), std(0x3a4560, { side: THREE.DoubleSide, metalness: 0.6, roughness: 0.4 }));
  binBody.position.y = 0.45; bin.add(binBody);
  bin.position.set(6.6, 0, 2.6); g.add(bin);
  chip.bin = bin;
  const lightA = new THREE.PointLight(COL.cyan, 60, 22, 1.2); lightA.position.set(1.6, 4, 2); g.add(stationLight(lightA, 'chip'));
  const lightB = new THREE.PointLight(COL.red, 40, 16, 1.2); lightB.position.set(-6, 3, 1); g.add(stationLight(lightB, 'chip'));
  scene.add(g);
  chip.g = g;
}

// ================================================================ HISTORY TIMELINE STATION
export const hist = { x: 150, nodes: [] };
{
  const g = new THREE.Group();
  g.position.set(hist.x, 0, 0);
  const line = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 70, 8), glow(0x3c5a8f));
  line.rotation.z = Math.PI / 2; line.position.set(32, 1.2, 0);
  g.add(line);
  const prog = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), glow(COL.red));
  prog.rotation.z = Math.PI / 2; prog.position.set(0, 1.2, 0); prog.scale.y = 0.0001;
  g.add(prog);
  hist.prog = prog;
  const grid = new THREE.GridHelper(120, 120, 0x1b2a48, 0x0e1626);
  grid.position.set(32, 0, 0);
  g.add(grid);
  const years = [['2015', 0], ['2017', 12], ['2017', 24], ['2019', 36], ['2024', 48], ['2025', 54]];
  for (const [y, x] of years) {
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), glow(COL.red));
    n.position.set(x, 1.2, 0); g.add(n);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.32, 40), glow(COL.red, 0.7));
    halo.position.set(x, 1.2, 0); g.add(halo);
    const label = textSprite(y, { font: '900 140px Montserrat', size: 140, color: '#8fa0c4' });
    label.position.set(x, 2.6, -0.6); label.scale.setScalar(0.9); g.add(label);
    hist.nodes.push({ x: hist.x + x, n, halo, label });
  }
  // Weeping Angel TV at node 3 (2017 CIA)
  const tv2 = makeTV({ w: 2.4, h: 1.38, micLight: false });
  tv2.g.position.set(27.2, 1.5, -2.2); g.add(tv2.g);
  hist.tvWA = tv2;
  // ACR TV at node 5
  const tv3 = makeTV({ w: 2.8, h: 1.6, micLight: false, screenLight: true });
  stationLight(tv3.screenLight, 'hist');
  tv3.screenMat.color.setScalar(0.62);
  tv3.g.position.set(50, 1.6, -3.4); g.add(tv3.g);
  hist.tvACR = tv3;
  hist.thumbs = [];
  for (let i = 0; i < 14; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.27), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false }));
    g.add(p); hist.thumbs.push(p);
  }
  const srv = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, 1.4), std(0x101625, { metalness: 0.5 }));
  srv.position.set(58, 1.6, -6); g.add(srv);
  hist.srv = new THREE.Vector3(hist.x + 58, 2.4, -6);
  const l1 = new THREE.PointLight(0x6f8fff, 80, 50, 1.1); l1.position.set(30, 8, 6); g.add(stationLight(l1, 'hist'));
  const l2 = new THREE.PointLight(0xff5a70, 30, 30, 1.2); l2.position.set(50, 5, 3); g.add(stationLight(l2, 'hist'));
  scene.add(g);
  hist.g = g;
}

// ================================================================ FLOW PARTICLES (data streams)
// stream(curve, color, count): particles travel along a curve with visibility window
export function makeStream(curve, color = COL.cyan, count = 60, size = 0.12) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, sizeAttenuation: true });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);
  const tmp = new THREE.Vector3();
  return {
    pts,
    update(t, alpha, speed = 0.25) {
      mat.opacity = alpha;
      pts.visible = alpha > 0.001;
      if (!pts.visible) return;
      for (let i = 0; i < count; i++) {
        const u = ((i / count) + t * speed) % 1;
        curve.getPoint(u, tmp);
        pos[i * 3] = tmp.x; pos[i * 3 + 1] = tmp.y; pos[i * 3 + 2] = tmp.z;
      }
      geo.attributes.position.needsUpdate = true;
    },
  };
}

// upload "cloud" above the house
export const cloud = new THREE.Group();
{
  const mat = new THREE.MeshBasicMaterial({ color: 0x9fe9ff, transparent: true, opacity: 0.0, toneMapped: false, wireframe: true });
  for (const [x, y, s] of [[0, 0, 1.6], [1.7, -0.3, 1.2], [-1.7, -0.3, 1.2], [0.9, 0.7, 1.1], [-0.9, 0.6, 1.1]]) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), mat);
    b.position.set(x, y, 0); cloud.add(b);
  }
  cloud.position.set(0, 9, -9);
  cloud.userData.mat = mat;
  scene.add(cloud);
}

export { THREE };
