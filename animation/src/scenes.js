// Choreography for "Is Your Smart TV Listening to You?"
// Times come from cues.json (narration paragraphs timed by word count at ~169 wpm).
// P(cue, 'phrase') returns the moment that phrase is spoken in the voiceover.
import gsap from 'gsap';
import data from './cues.json' with { type: 'json' };
import { tl, el, show, hide, words, checkOverlaps, counter, wipe, iris, letterbox, chapter, glitchify, onFrame, updaters, win, ramp, clamp, lerp, rng } from './kit.js';
import { THREE, scene, shot, shake, project, room, devices, fxTV, hood, chip, hist, cloud, makeStream, textSprite, canvasTex, COL, M, bloom } from './world.js';

const { cues } = data;
export const DURATION = 527;
const C = (i) => cues[i].start;
const E = (i) => cues[i].end;
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
function P(i, phrase, off = 0) {
  const w = norm(cues[i].text), q = norm(phrase);
  for (let k = 0; k <= w.length - q.length; k++) if (q.every((x, j) => w[k + j] === x)) return cues[i].start + ((cues[i].end - cues[i].start) * k) / w.length + off;
  throw new Error(`phrase "${phrase}" not in cue ${i}`);
}

const fx = document.getElementById('fx').getContext('2d');
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const TV = V(0, 1.42, -3.05);
const MIC = room.micWorld;
const JACK = V(2.6, 0.3, -3.33);

// ---------------------------------------------------------------- 3D-anchored labels
function label3d(html, pos, at, out, cls = '') {
  const d = el(html, `label3d ${cls}`);
  const p = pos.clone ? pos : V(...pos);
  onFrame(() => {
    if (d.style.visibility === 'hidden') return;
    const s = project(p);
    d.style.left = `${s.x}px`; d.style.top = `${s.y - 14}px`;
    d.style.display = s.behind ? 'none' : 'block';
  });
  tl.fromTo(d, { autoAlpha: 0, y: 20, scale: 0.8 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at);
  if (out != null) hide(d, out, 0.3);
  return d;
}

// generic panel helper
function panel(html, x, y, w, h, at, out, from = { y: 40 }) {
  const d = el(html, 'panel', { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: h ? `${h}px` : 'auto', padding: '30px 36px' });
  show(d, at, 0.6, from);
  if (out != null) hide(d, out, 0.4);
  return d;
}
function pill(text, x, y, color, at, out, o = {}) {
  const d = el(text, 'pill', { left: `${x}px`, top: `${y}px`, color: o.fg ?? '#04060c', background: color, ...(o.css || {}) });
  if (o.center) gsap.set(d, { xPercent: -50 });
  show(d, at, 0.45, { scale: 0.6, ...(o.center ? { xPercent: -50 } : {}) });
  if (out != null) hide(d, out, 0.3);
  return d;
}

// ---------------------------------------------------------------- persistent 3D states
// mic dot: pulses red all video, goes dark when the TV is unplugged for good (fix #5)
let MIC_OFF_AT = Infinity;
onFrame((t) => {
  const tv = room.tv;
  const off = t > MIC_OFF_AT;
  const flare = win(t, P(0, 'microphone') - 0.2, E(0) + 0.4, 0.3) + win(t, P(26, 'switch on'), E(27), 0.4) * 0.8;
  const pulse = 0.55 + 0.45 * Math.sin(t * 3.2);
  const k = off ? 0.05 : pulse + flare * 1.5;
  tv.mic.material.color.setRGB(Math.min(1, 0.25 + k), 0.18 * k, 0.27 * k);
  tv.mic.scale.setScalar(off ? 0.8 : 1 + flare * 0.9 + pulse * 0.15);
  tv.micLight.intensity = off ? 0 : 0.35 + k * 0.6;
  tv.micGlow.material.opacity = off ? 0 : clamp(0.35 + k * 0.4);
  tv.micGlow.scale.setScalar(0.22 + k * 0.12 + flare * 0.25);
  hist.tvWA.micGlow.material.opacity = 0.4 + pulse * 0.5;
  hist.tvACR.micGlow.visible = false;
  hist.tvWA.mic.material.color.setRGB(0.4 + pulse * 0.6, 0.1 * pulse, 0.15 * pulse);
  hist.tvACR.mic.visible = false;
});

// bloom strength breathing a little for life
onFrame((t) => { bloom.strength = 0.85 + 0.1 * Math.sin(t * 0.7); });

// TV screen canvas: black by default, red code during the hack
const scr = room.tv.screenTex;
let scrState = '';
onFrame((t) => {
  const hack = win(t, C(25) - 0.2, E(28), 0.6);
  const st = hack > 0 ? 'hack' : 'black';
  if (st === 'black' && scrState === 'black') return;
  const g = scr.g;
  g.fillStyle = '#000'; g.fillRect(0, 0, 640, 360);
  if (st === 'hack') {
    g.font = '700 16px Mono';
    const r = rng(9);
    for (let c = 0; c < 40; c++) {
      const sp = 60 + r() * 120, off = r() * 400;
      for (let k = 0; k < 24; k++) {
        const y = ((t * sp + off + k * 18) % 420) - 30;
        g.fillStyle = `rgba(255,45,70,${hack * (0.15 + 0.85 * (k / 24))})`;
        g.fillText(String.fromCharCode(48 + ((c * 7 + k * 13 + Math.floor(t * 8)) % 42)), c * 16, y);
      }
    }
    g.fillStyle = `rgba(255,45,70,${hack})`; g.font = '900 34px Montserrat'; g.textAlign = 'center';
    if (t > C(26) && Math.floor(t * 3) % 2) g.fillText('ACCESS GRANTED', 320, 300);
    g.textAlign = 'left';
  }
  scr.tex.needsUpdate = true;
  scrState = st;
});

// plug in/out: list of [t, inserted]
const plugEvents = [[0, 1]];
function plugOut(t) { plugEvents.push([t, 0]); }
function plugIn(t) { plugEvents.push([t, 1]); }
onFrame((t) => {
  let a = plugEvents[0], b = plugEvents[0];
  for (const e of plugEvents) if (e[0] <= t) a = e;
  // smooth 0.5 s motion after each event
  const u = clamp((t - a[0]) / 0.5);
  const prev = plugEvents[Math.max(0, plugEvents.indexOf(a) - 1)][1];
  const s = lerp(prev, a[1], gsap.parseEase('power3.inOut')(u));
  room.plug.position.z = lerp(-2.95, -3.32, s);
  room.plug.position.y = lerp(0.24, 0.3, s);
  room.portLed.material.color.set(s > 0.95 ? COL.green : 0x221111);
  void b;
});

// sound rings + 12 m ruler
const ringWindows = [[P(1, 'talked around it') - 0.2, P(1, 'Days later'), 6], [C(13), E(13) + 0.6, 12]];
onFrame((t) => {
  let alpha = 0, maxR = 12;
  for (const [a, b, r] of ringWindows) { const w = win(t, a, b, 0.6); if (w > alpha) { alpha = w; maxR = r; } }
  fxTV.rings.forEach((ring, i) => {
    const ph = ((t * 0.32 + i / fxTV.rings.length) % 1);
    ring.scale.setScalar(0.3 + ph * maxR);
    ring.material.opacity = alpha * (1 - ph) * 0.9;
    ring.visible = alpha > 0;
  });
  const rul = ramp(t, P(13, 'twelve metres') - 0.3, P(13, 'twelve metres') + 1.6);
  fxTV.ruler.scale.z = Math.max(0.0001, gsap.parseEase('power3.out')(rul)) * (1 - ramp(t, E(13) + 0.5, E(13) + 1));
  fxTV.ruler.visible = fxTV.ruler.scale.z > 0.001;
});

// =====================================================================================
// S0 · COLD OPEN (0 – 40)
// =====================================================================================
letterbox(0, '118px', 0.01);
shot(0, [3.0, 2.1, 9.8], [-0.1, 1.15, -3], { fov: 32 });
shot(C(1), [1.5, 1.72, 5.7], [-0.1, 1.1, -3], { fov: 32, ease: 'sine.inOut' });

words('Your TV is *off.*', { at: 0.4, out: 1.65, cls: 'h2', y: 880 });
words('The screen is black.', { at: 2.05, out: 3.0, cls: 'h2', y: 880 });
words('The room is silent.', { at: 3.4, out: 4.15, cls: 'h2', y: 880 });
words('So why is the *microphone* still *awake?*', { at: P(0, 'So why'), out: E(0) - 0.2, cls: 'h2', y: 880, anim: 'pop', stagger: 0.09 });

// September 2026 calendar
{
  const cal = el(`<div class="small" style="color:#ff2d46">Investigation</div><div class="h2" style="font-size:96px;margin-top:10px">SEPT <span id="calday">01</span></div><div class="h3 dimc" style="margin-top:6px">2026</div>`, 'panel', { left: '110px', top: '240px', padding: '34px 46px' });
  show(cal, C(1) + 0.1, 0.6, { x: -60 });
  const day = cal.querySelector('#calday');
  counter(day, 1, 7, C(1) + 0.3, 1.6, (v) => String(Math.round(v)).padStart(2, '0'));
  hide(cal, P(1, 'cut off its internet'), 0.4);
}
// cable close-up, unplug
shot(P(1, 'standby'), [1.9, 0.62, -2.05], [2.55, 0.28, -3.3], { fov: 34, ease: 'power3.inOut', hold: 1.6 });
plugOut(P(1, 'cut off its internet', 0.3));
pill('● Offline', 1300, 300, '#ff2d46', P(1, 'cut off its internet', 0.6), P(1, 'talked around it'), { fg: '#fff' });
// wide: researchers talk around it (rings)
shot(P(1, 'talked around it', 0.9), [3.6, 2.6, 4.8], [0, 0.9, -1.2], { fov: 36 });
shot(P(1, 'Days later', 0.5), [3.3, 2.4, 4.4], [0, 0.9, -1.2], { fov: 36, ease: 'none' });
words('Days later…', { at: P(1, 'Days later'), out: P(1, 'plugged the') - 0.1, cls: 'h2', y: 880, anim: 'type', cps: 18 });
shot(P(1, 'plugged the') + 0.3, [1.9, 0.62, -2.05], [2.55, 0.28, -3.3], { fov: 34, ease: 'power3.inOut', hold: 0.8 });
plugIn(P(1, 'back in', 0.2));
pill('● Online', 1300, 300, '#3df59a', P(1, 'back in', 0.5), P(1, 'watched what'), {});
shot(P(1, 'watched what', 0.9), [0.4, 1.35, 3.4], [0, 1.2, -3], { fov: 30, ease: 'power2.inOut' });
words('…and watched what the TV did *next.*', { at: P(1, 'watched what'), out: E(1) - 0.1, cls: 'h2', y: 880 });
// private room
shot(C(2) + 1.8, [-3.0, 1.7, 5.2], [0.2, 0.9, -1.2], { fov: 36, ease: 'power2.inOut' });
shot(E(2) - 0.6, [-2.4, 1.6, 4.4], [0.2, 0.9, -1.2], { fov: 36, ease: 'none' });
words('Not one *brand.*', { at: C(2) + 0.2, out: P(2, "It's about") - 0.1, cls: 'h1', y: 540, anim: 'zoom' });
words('The most *private* room | of our homes', { at: P(2, 'most private'), out: E(2) - 0.2, cls: 'h2', y: 540, anim: 'rise' });

// five settings teaser
{
  shot(C(3) + 1.2, [0.6, 1.5, 4.4], [0, 1.2, -3], { fov: 30 });
  const head = words('5 settings to switch off *tonight*', { at: C(3) + 0.3, out: 36.3, cls: 'h3', y: 330 });
  void head;
  for (let i = 0; i < 5; i++) {
    const last = i === 4;
    const t = el(`<div style="width:120px;height:64px;border-radius:40px;background:${last ? 'rgba(255,45,70,.18)' : 'rgba(47,224,255,.15)'};border:3px solid ${last ? '#ff2d46' : '#2fe0ff'};position:relative">
      <div style="position:absolute;top:7px;left:${last ? '7px' : '61px'};width:44px;height:44px;border-radius:50%;background:${last ? '#ff2d46' : '#2fe0ff'}"></div></div>
      <div class="mono" style="text-align:center;margin-top:16px;font-size:28px;color:${last ? '#ff2d46' : '#8a96ad'}">${last ? '#5 ?' : `#${i + 1}`}</div>`, '', { position: 'absolute', left: `${560 + i * 170}px`, top: '440px' });
    show(t, P(3, 'five settings') + i * 0.12, 0.5, { y: 50, scale: 0.7 });
    if (last) {
      tl.fromTo(t, { scale: 1 }, { scale: 1.25, duration: 0.4, ease: 'back.out(3)' }, P(3, 'The last one'));
      glitchify(t, P(3, 'almost nobody'), 0.6);
    }
    hide(t, 36.3, 0.3);
  }
}
// title card
{
  const T0 = 36.6;
  letterbox(T0 - 0.4, '0px', 0.8);
  shot(T0 - 0.6, [0.5, 1.45, 3.9], [0, 1.2, -3], { fov: 30, ease: 'none' });
  shot(39.85, [0.05, 0.62, -1.4], [0, 0.5, -3.0], { fov: 26, ease: 'power2.in' });
  const a = words('Is your smart TV', { at: T0, out: 39.75, cls: 'h2', y: 420, anim: 'rise', drift: 0.05 });
  const b = words('*listening?*', { at: T0 + 0.35, out: 39.75, cls: 'h1', y: 560, anim: 'zoom', drift: 0.06 });
  b.style.fontSize = '170px';
  glitchify(b, T0 + 1.2, 0.5);
  void a;
}

// =====================================================================================
// S1 · THE INVESTIGATION (40 – 86)
// =====================================================================================
chapter(1, 'The Investigation', C(4) + 0.3, E(6));
wipe(C(4) - 0.6, ['#2fe0ff', '#0b1222']);
const labGrid = new THREE.GridHelper(16, 32, 0x2fe0ff, 0x1a3350);
labGrid.position.set(0, 0.012, -0.5);
labGrid.material.transparent = true; labGrid.material.opacity = 0;
scene.add(labGrid);
const scanPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 2.2), M.glow(COL.cyan, 0.9));
scene.add(scanPlane);
onFrame((t) => {
  const a = win(t, C(4) - 0.2, E(6), 1);
  labGrid.material.opacity = a * 0.5;
  labGrid.visible = a > 0;
  const s = win(t, C(4), C(6), 0.5);
  scanPlane.visible = s > 0;
  scanPlane.position.set(-1.7 + ((t * 0.55) % 1) * 3.4, 1.42, -2.98);
  scanPlane.material.opacity = s * 0.85;
});
shot(C(4) - 0.1, [-3.6, 1.9, 1.4], [0, 1.25, -3], { fov: 36, cut: true });
shot(E(5), [3.4, 1.7, 0.8], [0, 1.25, -3], { fov: 36, ease: 'sine.inOut' });
{
  const date = pill('Sept 7, 2026', 120, 170, '#ff2d46', C(4) + 0.4, E(5), { fg: '#fff' });
  void date;
  const gn = words('Gamers Nexus *×* Level1Techs', { at: P(4, 'Gamers Nexus'), out: E(4) - 0.2, cls: 'h2', x: 120, y: 300, align: 'left', accent: 'red' });
  void gn;
  words('+ independent security researchers', { at: P(4, 'independent security'), out: E(4) - 0.2, cls: 'body', x: 120, y: 380, align: 'left', color: '#8a96ad' });
  const stats = [
    ['500+', 'Hours of testing', P(4, 'five hundred hours')],
    ['$70,000', 'Spent on the probe', P(4, 'seventy thousand')],
    ['LG G5', '2025 OLED · retail units', P(4, 'including the 2025')],
  ];
  stats.forEach(([big, small, at], i) => {
    const d = el(`<div class="h2" style="font-size:84px"><span class="num">${big}</span></div><div class="small" style="margin-top:12px">${small}</div>`, 'panel', { left: `${120 + i * 440}px`, top: '640px', width: '400px', padding: '30px 34px' });
    show(d, at, 0.6, { y: 60 });
    if (i < 2) {
      const n = d.querySelector('.num');
      const to = i === 0 ? 500 : 70000;
      counter(n, 0, to, at + 0.1, 1.4, (v) => (i === 0 ? `${Math.round(v)}+` : `$${Math.round(v).toLocaleString('en-US')}`));
    }
    hide(d, E(4) - 0.1, 0.35);
  });
  // three terminal windows
  const terms = [
    ['PACKET CAPTURE', (k) => Array.from({ length: 14 }, (_, j) => `${(0x1f00 + (j + k) * 16).toString(16)}  ${Array.from({ length: 8 }, (_, q) => ((j * 31 + q * 17 + k * 7) % 256).toString(16).padStart(2, '0')).join(' ')}`).join('<br>')],
    ['FIRMWARE · DECOMPILED', () => ['void voice_svc_loop() {', '  buf = ring_alloc(SEC(4));', '  while (standby) {', '    mic_read(buf);', '    if (!wake(buf))', '      store_local(buf);', '  }', '}', '', 'int net_scan(lan *l) {', '  for (ip in l->hosts)', '    probe(ip, MDNS|SSDP);', '}'].join('<br>').replace(/ /g, '&nbsp;')],
    ['SYSTEM LOG', (k) => Array.from({ length: 13 }, (_, j) => `[${String(22 + ((j + k) % 2)).padStart(2, '0')}:${String((j * 7 + k) % 60).padStart(2, '0')}] ${['audiod: buffer flush', 'netd: host found', 'acr: frame sent', 'audiod: queue 14 files', 'upload: pending'][(j + k) % 5]}`).join('<br>')],
  ];
  terms.forEach(([title, body], i) => {
    const at = [P(5, 'captured every packet'), P(5, 'decompiled the firmware'), P(5, 'read the system logs')][i];
    const d = el(`<div class="small" style="color:#2fe0ff;margin-bottom:14px">${title}</div><div class="mono tb" style="font-size:17px;line-height:1.55;color:#9fb3d1;height:300px;overflow:hidden">${body(0)}</div>`, 'panel', { left: `${110 + i * 580}px`, top: '330px', width: '540px', padding: '24px 28px' });
    show(d, at, 0.5, { y: 60, rotation: -3 });
    if (i !== 1) {
      const tb = d.querySelector('.tb');
      const o = { k: 0 };
      tl.fromTo(o, { k: 0 }, { k: 30, duration: E(5) - at, ease: 'none', onUpdate: () => { tb.innerHTML = body(Math.floor(o.k)); } }, at);
    }
    hide(d, E(5), 0.35);
  });
}
// three boxes
const boxes = [];
{
  const labels = ['WHAT IT HEARS', 'WHAT IT SEES IN YOUR HOME', 'WHO ELSE COULD GET IN'];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0x0c1322, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.92 }));
    g.add(cube);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry), new THREE.LineBasicMaterial({ color: i === 2 ? COL.red : COL.cyan, toneMapped: false }));
    g.add(edges);
    const num = textSprite(`0${i + 1}`, { font: '900 120px Montserrat', size: 120, color: i === 2 ? '#ff2d46' : '#2fe0ff' });
    num.position.z = 0.41; num.scale.setScalar(0.42); g.add(num);
    g.position.set(-1.3 + i * 1.3, 1.3, -0.4);
    g.scale.setScalar(0.0001);
    scene.add(g);
    boxes.push({ g, edges, cube });
  }
  const at0 = C(6);
  shot(at0 + 1.4, [0, 2.15, 4.2], [0, 1.35, -0.6], { fov: 36, ease: 'power3.inOut' });
  shot(E(6) - 0.4, [0, 2.05, 3.7], [0, 1.35, -0.6], { fov: 36, ease: 'none' });
  const phr = ['what your TV hears', 'what it sees inside', 'the third is the scariest'];
  boxes.forEach((b, i) => {
    tl.fromTo(b.g.scale, { x: 0.0001, y: 0.0001, z: 0.0001 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'back.out(1.8)' }, at0 + 0.2 + i * 0.15);
    tl.fromTo(b.g.rotation, { y: -1.2 }, { y: 0, duration: 1.0, ease: 'power3.out' }, at0 + 0.2 + i * 0.15);
    const hl = P(6, phr[i]);
    tl.to(b.g.position, { y: 1.55, duration: 0.5, ease: 'back.out(2)' }, hl);
    tl.to(b.g.position, { y: 1.3, duration: 0.5, ease: 'power2.inOut' }, hl + 2.2);
    label3d(`<span class="${i === 2 ? 'red' : 'cyan'} mono" style="margin-right:10px">0${i + 1}</span>${labels[i]}`, V(-1.3 + i * 1.3, 2.05, -0.4), hl + 0.1, E(6), i === 2 ? 'red' : '');
    tl.to(b.g.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.5, ease: 'back.in(2)' }, C(7) + 0.6 + i * 0.08);
  });
  onFrame((t) => { boxes.forEach((b, i) => { b.g.rotation.x = Math.sin(t * 0.8 + i) * 0.08; b.g.rotation.z = Math.cos(t * 0.6 + i) * 0.05; }); });
  words('Not on the screen. *Inside* your house.', { at: P(6, 'Not on the screen'), out: P(6, 'And the third') - 0.1, cls: 'h3', y: 900 });
  const third = words('Who else could *get in?*', { at: P(6, "It's about who"), out: E(6) - 0.1, cls: 'h2', y: 900, anim: 'glitch' });
  void third;
  words("Let's open the first box.", { at: C(7), out: E(7) + 0.2, cls: 'h3', y: 900 });
}

// =====================================================================================
// S2 · HOW A TV HEARS YOU (86 – 155)
// =====================================================================================
chapter(2, 'How a TV Hears You', C(8) + 0.4, C(11) - 0.4);
// remote on the coffee table
const remote = new THREE.Group();
{
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.022, 0.2), M.std(0x1a1f2b, { metalness: 0.5, roughness: 0.35 }));
  remote.add(body);
  const rmic = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 8), M.glow(COL.red));
  rmic.position.set(0, 0.012, -0.08); remote.add(rmic);
  remote.position.set(-0.05, 0.465, 0.78); remote.rotation.y = 0.2;
  scene.add(remote);
}
shot(C(8) + 1.0, [1.5, 1.1, 1.6], [0, 0.75, -1.2], { fov: 38, ease: 'power3.inOut' });
shot(P(8, 'far-field') - 0.2, [0.9, 0.95, -0.4], [0, 0.62, -3], { fov: 36, ease: 'power2.inOut' });
label3d('<span class="red mono" style="margin-right:8px">MIC 1</span>Remote', V(-0.05, 0.56, 0.78), P(8, 'in the remote'), E(8));
label3d('<span class="red mono" style="margin-right:8px">MIC 2</span>Built into the TV', V(0, 0.62, -3.0), P(8, 'built right into'), E(8), 'red');
words('Far-field voice recognition', { at: P(8, 'far-field'), out: P(8, 'It listens') - 0.1, cls: 'h3', y: 160, color: '#2fe0ff' });
words('≈ a smart speaker', { at: P(8, 'same idea'), out: P(8, 'It listens') - 0.1, cls: 'body', y: 225, color: '#8a96ad' });
{
  const bubble = el(`<div class="h1 cyan glow-cyan" style="font-size:150px">"HI LG"</div><div class="small" style="text-align:center;margin-top:16px">the wake word</div>`, '', { position: 'absolute', left: '960px', top: '360px' });
  gsap.set(bubble, { xPercent: -50, yPercent: -50 });
  tl.set(bubble, { autoAlpha: 1 }, P(8, 'Hi LG') - 0.3);
  tl.fromTo(bubble, { scale: 0.3 }, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, P(8, 'Hi LG') - 0.3);
  hide(bubble, E(8) - 0.5, 0.3);
}
// dive into the mic
shot(E(8) - 1.4, [0.9, 0.95, -0.4], [0, 0.62, -3], { fov: 36 });
shot(E(8) - 0.05, [0.02, 0.5, -2.86], [0, 0.487, -3.0], { fov: 24, ease: 'expo.in' });
{
  const s = { x: 960, y: 560 };
  iris(E(8) - 0.5, s.x, s.y, '#ff2d46', 0.5, 0.15);
}
// chip station
const CX = chip.x;
shot(E(8), [CX - 3.5, 6.5, 8.5], [CX + 0.2, 0, 0], { fov: 36, cut: true });
shot(C(9) + 6, [CX - 1.5, 5.6, 7.2], [CX + 0.6, 0, 0], { fov: 36, ease: 'sine.inOut' });
shot(P(9, 'It compares') - 0.3, [CX + 3.5, 4.4, 6.4], [CX + 3.6, 0.3, 0.6], { fov: 36, ease: 'power2.inOut' });
shot(E(9) - 0.4, [CX + 4.6, 4.2, 6.6], [CX + 4.2, 0.4, 0.8], { fov: 36, ease: 'sine.inOut' });
// cue 10: dramatic close on the ring
shot(C(10) + 1.2, [CX + 1.6, 2.6, 3.6], [CX + 1.6, 0, 0], { fov: 34, ease: 'power3.inOut' });
shot(E(10) - 0.6, [CX + 1.2, 1.9, 3.0], [CX + 1.6, 0, 0], { fov: 34, ease: 'none', roll: 0.08 });
{
  const T0 = C(8) - 1, T1 = E(10) + 0.5;
  const kept = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.32), M.glow(COL.red));
    chip.g.add(m); m.visible = false; kept.push(m);
  }
  const dropT = P(9, 'No match');
  const matchT = P(9, 'The TV wakes') - 0.4;
  onFrame((t) => {
    const on = t > T0 && t < T1;
    chip.g.visible = on;
    if (!on) return;
    const R = 1.8, speed = 1.4;
    const headA = (t * speed) % (Math.PI * 2);
    chip.head.position.set(1.6 + Math.cos(headA) * (R + 0.42), 0.35, Math.sin(headA) * (R + 0.42));
    chip.head.rotation.set(0, 0, 0);
    chip.head.lookAt(new THREE.Vector3(CX + 1.6, 0.35, 0));
    chip.head.rotateX(Math.PI / 2);
    chip.segs.forEach((s, i) => {
      const a = (i / 64) * Math.PI * 2;
      let age = (headA - a) / (Math.PI * 2); if (age < 0) age += 1;
      s.material.opacity = 0.12 + 0.88 * Math.pow(1 - age, 3);
      s.material.color.set(age < 0.03 ? COL.red : COL.cyan);
      s.scale.y = 1 + (1 - age) * 2.5;
    });
    // incoming wave
    const pos = chip.wave.geometry.attributes.position.array;
    for (let k = 0; k < chip.N; k++) {
      const u = k / (chip.N - 1);
      const x = lerp(-7, 1.6 - R, u);
      const amp = 0.18 * (0.6 + 0.4 * Math.sin(t * 2.3 + u * 3)) * (u < 0.5 ? 1 : 0.6);
      pos[k * 3] = x; pos[k * 3 + 1] = 0.35 + Math.sin(u * 60 - t * 14) * amp * Math.sin(u * Math.PI); pos[k * 3 + 2] = 0;
    }
    chip.wave.geometry.attributes.position.needsUpdate = true;
    chip.wave.material.opacity = win(t, C(9) - 0.3, T1, 0.6);
    // discarded chunk flies to the bin
    kept.forEach((m, i) => {
      const u = clamp((t - dropT - i * 0.08) / 1.1);
      m.visible = u > 0 && u < 1;
      const a = Math.PI * 0.1 + i * 0.1;
      const p0 = new THREE.Vector3(1.6 + Math.cos(a) * R, 0.2, Math.sin(a) * R), p1 = new THREE.Vector3(6.6, 0.3, 2.6);
      m.position.lerpVectors(p0, p1, u); m.position.y += Math.sin(u * Math.PI) * 1.8;
      m.rotation.x = u * 6;
    });
    chip.lgLabel.material.opacity = win(t, P(9, 'It compares') - 0.2, T1, 0.4);
    chip.lgLabel.scale.setScalar(0.6 + 0.12 * win(t, matchT, matchT + 1.5, 0.2));
  });
  label3d('Microphone', V(CX - 7, 0.9, 0), C(9) + 0.2, P(9, 'like a loop'));
  label3d('Low-power chip', V(CX - 3.2, 0.9, 0), P(9, 'low-power chip'), E(9));
  label3d('<span class="cyan mono" style="margin-right:8px">BUFFER</span>last few seconds', V(CX + 1.6, 1.2, -1.8), P(9, 'short memory buffer'), E(10));
  words('A loop of tape that | *records over itself*', { at: P(9, 'like a loop'), out: P(9, 'It compares') - 0.2, cls: 'h3', y: 900, accent: 'cyan' });
  const noMatch = el(`<div class="h3 red glow-red">NO MATCH</div><div class="small" style="margin-top:8px">→ thrown away</div>`, '', { position: 'absolute', left: '1380px', top: '760px' });
  show(noMatch, P(9, 'No match'), 0.4, { scale: 0.5 });
  hide(noMatch, matchT - 0.1, 0.25);
  const match = el(`<div class="h3 green" style="text-shadow:0 0 24px rgba(61,245,154,.6)">MATCH</div><div class="small" style="margin-top:8px">→ TV wakes · command sent</div>`, '', { position: 'absolute', left: '1380px', top: '760px' });
  show(match, matchT, 0.4, { scale: 0.5 });
  hide(match, E(9) - 0.1, 0.3);
  label3d('Bin', V(CX + 6.6, 1.3, 2.6), P(9, 'No match'), matchT);
  // cue 10 kinetic
  words('Remember that *loop of tape*', { at: C(10) + 0.1, out: P(10, 'The question') - 0.2, cls: 'h2', y: 880, accent: 'cyan' });
  words("It's not *whether* it has a microphone…", { at: P(10, 'The question'), out: P(10, "It's what") - 0.15, cls: 'h3', y: 880 });
  words("It's what happens when it's | *supposed* to be thrown away.", { at: P(10, "It's what"), out: E(10) - 0.1, cls: 'h3', y: 880 });
}
// cue 11 · Always Ready
wipe(C(11) - 0.55, ['#2fe0ff', '#0b1222']);
shot(C(11) - 0.1, [0.0, 1.45, 2.4], [0, 1.3, -3], { fov: 34, cut: true });
shot(E(12) - 0.6, [0.0, 1.4, 1.0], [0, 1.35, -3], { fov: 34, ease: 'sine.inOut' });
{
  pill('Always Ready', 120, 160, '#2fe0ff', P(11, 'Always Ready'), E(12));
  const meter = el(`<div class="small">Power state</div><div class="h3" style="margin-top:10px"><span class="red">●</span> STANDBY</div><div class="mono dimc" style="margin-top:8px;font-size:22px">LOW-POWER · <span class="cyan">AWAKE</span></div>`, 'panel', { left: '1400px', top: '150px', width: '420px', padding: '26px 30px' });
  show(meter, P(11, 'When the TV looks off'), 0.5, { x: 60 });
  hide(meter, E(12), 0.3);
  // live power graph on fx canvas
  onFrame((t) => {
    const a = win(t, P(11, 'When the TV looks off') + 0.3, E(12), 0.4);
    if (a <= 0) return;
    fx.save(); fx.globalAlpha = a; fx.strokeStyle = '#2fe0ff'; fx.lineWidth = 3; fx.beginPath();
    for (let i = 0; i <= 120; i++) { const x = 1430 + i * 3.1; const y = 370 - 18 * Math.abs(Math.sin(i * 0.4 + t * 6) * Math.sin(i * 0.13 + t)) - (i % 17 === 0 ? 20 : 0); i ? fx.lineTo(x, y) : fx.moveTo(x, y); }
    fx.stroke(); fx.restore();
  });
  words('Looks off ≠ *is off*', { at: P(11, 'it often'), out: E(11) - 0.1, cls: 'h2', y: 900 });
  const honest = words('The least *honest* thing | in your living room', { at: C(12) + 0.1, out: E(12) - 0.1, cls: 'h2', y: 860 });
  glitchify(honest, P(12, 'honest'), 0.6);
}

// =====================================================================================
// S3 · WHAT THEY FOUND: THE AUDIO (155 – 229)
// =====================================================================================
wipe(C(13) - 0.55, ['#ff2d46', '#0b1222']);
chapter(3, 'What They Found: The Audio', C(13) + 0.4, E(18));
shot(C(13) - 0.1, [7.5, 10.5, 9], [0, 0, 1.5], { fov: 40, cut: true });
shot(E(13) - 1.4, [6.2, 9, 7.2], [0, 0, 2.2], { fov: 40, ease: 'sine.inOut' });
words('Screen off · Standby · *Still capturing*', { at: C(13) + 0.3, out: P(13, 'twelve metres') - 0.2, cls: 'h3', y: 160 });
{
  const big = el(`<div class="h1 amber" style="font-size:180px;text-shadow:0 0 30px rgba(255,181,71,.5)"><span class="n">0</span> m</div><div class="h3 dimc" style="text-align:center;margin-top:6px">≈ 40 feet · the length of a house</div>`, '', { position: 'absolute', left: '1380px', top: '470px' });
  gsap.set(big, { xPercent: -50, yPercent: -50 });
  tl.set(big, { autoAlpha: 1 }, P(13, 'twelve metres') - 0.2);
  tl.fromTo(big, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }, P(13, 'twelve metres') - 0.2);
  counter(big.querySelector('.n'), 0, 12, P(13, 'twelve metres'), 1.4);
  hide(big, E(13) - 0.1, 0.3);
}
// unplug test
shot(C(14) + 0.6, [1.9, 0.62, -2.05], [2.55, 0.28, -3.3], { fov: 34, ease: 'power3.inOut', hold: 3.2 });
plugOut(P(14, 'cut the TV off', 0.4));
pill('● Offline', 80, 140, '#ff2d46', P(14, 'cut the TV off', 0.6), E(16) - 4, { fg: '#fff' });
words('The test', { at: C(14) + 0.1, out: E(14) - 0.2, cls: 'h2', y: 160 });
// thought experiment
shot(C(15) + 1.2, [0.4, 1.5, 3.2], [0, 1.25, -3], { fov: 32, ease: 'power2.inOut' });
shot(E(15), [0.3, 1.45, 2.2], [0, 1.25, -3], { fov: 32, ease: 'none' });
words('Only listening for a *wake word?*', { at: C(15) + 0.2, out: P(15, "There's nothing") - 0.15, cls: 'h3', y: 860 });
{
  const zero = el(`<div class="small" style="text-align:center">Data waiting to upload</div><div class="h1 cyan glow-cyan" style="font-size:160px;text-align:center">0 KB</div>`, '', { position: 'absolute', left: '960px', top: '420px' });
  gsap.set(zero, { xPercent: -50, yPercent: -50 });
  show(zero, P(15, "There's nothing"), 0.5, { scale: 0.6, xPercent: -50, yPercent: -50 });
  const strike = el('', '', { position: 'absolute', left: '700px', top: '440px', width: '520px', height: '12px', background: '#ff2d46', borderRadius: '6px', boxShadow: '0 0 24px #ff2d46' });
  tl.set(strike, { autoAlpha: 1 }, P(15, "But that's not"));
  tl.fromTo(strike, { scaleX: 0, transformOrigin: '0 50%', rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.35, ease: 'power4.out' }, P(15, "But that's not"));
  hide(zero, E(15) - 0.05, 0.3); hide(strike, E(15) - 0.05, 0.3);
  words("…that's *not* what happened.", { at: P(15, "But that's not") + 0.2, out: E(15) - 0.1, cls: 'h3', y: 860 });
}
// files pile up
{
  const store = el(`<div class="small" style="color:#ff2d46">● TV local storage · offline</div><div class="files" style="margin-top:18px;display:flex;flex-direction:column;gap:10px"></div><div style="margin-top:18px;height:14px;border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden"><div class="bar" style="height:100%;width:0;background:linear-gradient(90deg,#ff2d46,#ffb547)"></div></div>`, 'panel', { left: '1220px', top: '160px', width: '560px', padding: '28px 32px' });
  show(store, C(16), 0.5, { x: 80 });
  const list = store.querySelector('.files');
  const names = ['rec_0412_2201.pcm', 'transcript_2201.txt', 'rec_0412_2214.pcm', 'transcript_2214.txt', 'rec_0412_2236.pcm', 'transcript_2236.txt', 'rec_0413_0108.pcm'];
  names.forEach((n, i) => {
    const f = document.createElement('div');
    f.className = 'mono';
    f.style.cssText = 'font-size:22px;padding:10px 16px;border-radius:10px;background:rgba(255,45,70,.12);border:1px solid rgba(255,45,70,.35);color:#ffd5da';
    f.textContent = (n.endsWith('.txt') ? '▤  ' : '♪  ') + n;
    list.appendChild(f);
    gsap.set(f, { autoAlpha: 0 });
    tl.fromTo(f, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power3.out' }, C(16) + 0.4 + i * 0.55);
    tl.to(f, { autoAlpha: 0, x: -60, duration: 0.25, ease: 'power2.in' }, P(16, 'they uploaded') + i * 0.12);
  });
  tl.fromTo(store.querySelector('.bar'), { width: '0%' }, { width: '92%', duration: 4, ease: 'none' }, C(16) + 0.4);
  tl.to(store.querySelector('.bar'), { width: '0%', duration: 1, ease: 'power2.in' }, P(16, 'they uploaded'));
  hide(store, E(16) + 0.4, 0.3);
  shot(C(16) + 1.0, [0.9, 1.5, 2.5], [-0.4, 1.3, -3], { fov: 34, ease: 'power2.inOut' });
  plugIn(P(16, 'connection came back', 0.1));
  pill('● Online', 80, 140, '#3df59a', P(16, 'connection came back', 0.3), E(16), {});
  shot(P(16, 'And the moment') + 0.4, [2.9, 2.3, 4.2], [0, 5.2, -7], { fov: 44, ease: 'power3.inOut', hold: 3.6 });
  // files fly to the cloud
  const up = new THREE.QuadraticBezierCurve3(V(0, 2.4, -3.1), V(0.5, 6.5, -4.5), V(0, 9, -9));
  const fileTex = canvasTex(128, 160, (g) => { g.fillStyle = '#ffd5da'; g.beginPath(); g.moveTo(10, 6); g.lineTo(88, 6); g.lineTo(118, 36); g.lineTo(118, 154); g.lineTo(10, 154); g.closePath(); g.fill(); g.fillStyle = '#ff2d46'; for (let k = 0; k < 5; k++) g.fillRect(26, 56 + k * 18, 76 - (k % 2) * 20, 8); });
  const flying = [];
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.4), new THREE.MeshBasicMaterial({ map: fileTex.tex, transparent: true, toneMapped: false, side: THREE.DoubleSide }));
    scene.add(m); m.visible = false; flying.push(m);
  }
  const U0 = P(16, 'they uploaded') - 0.4;
  onFrame((t) => {
    flying.forEach((m, i) => {
      const u = clamp((t - U0 - i * 0.11) / 1.3);
      m.visible = u > 0 && u < 1;
      if (!m.visible) return;
      up.getPoint(gsap.parseEase('power2.in')(u), m.position);
      m.position.x += Math.sin(i * 2.1) * 0.6 * Math.sin(u * Math.PI);
      m.rotation.set(Math.sin(t * 2 + i) * 0.4, t * 1.5 + i, 0);
    });
    cloud.userData.mat.opacity = win(t, U0 - 0.6, E(16) + 0.8, 0.5) * 0.7;
    cloud.rotation.y = t * 0.2;
  });
}
// transcript clip
{
  shot(C(17) + 1.8, [0.3, 1.4, 2.6], [0, 1.25, -3], { fov: 32, ease: 'power2.inOut' });
  shot(E(17), [0.2, 1.4, 1.6], [0, 1.3, -3], { fov: 32, ease: 'none' });
  const log = el(`<div style="display:flex;justify-content:space-between;align-items:center"><div class="small" style="color:#ffb547">voice_transcript.log</div><div class="mono rec" style="color:#ff2d46;font-weight:700;font-size:24px">● REC</div></div><div class="lines mono" style="margin-top:22px;font-size:26px;line-height:1.75"></div><div class="small" style="margin-top:18px;font-size:16px;color:#55607a">Illustration of the behaviour described in the report</div>`, 'panel', { left: '360px', top: '200px', width: '1200px', padding: '34px 40px' });
  show(log, C(17) + 0.2, 0.6, { y: 60, scale: 0.95 });
  const L = log.querySelector('.lines');
  const rows = [
    ['22:14:03', 'wake_word  "Hi LG"', '#2fe0ff', C(17) + 0.8],
    ['22:14:04', 'command    "open YouTube"', '#2fe0ff', C(17) + 1.6],
    ['22:14:05', '— session ended —', '#55607a', P(17, "They'd moved on")],
    ['22:16:41', '"…yeah, I\'ll call the bank tomorrow…"', '#ff2d46', P(17, 'kept writing down')],
    ['22:16:47', '"…did you send the rent already?…"', '#ff2d46', P(17, 'kept writing down') + 1.4],
    ['22:17:02', '"…don\'t tell anyone about…"', '#ff2d46', P(17, 'word for word')],
  ];
  rows.forEach(([ts, txt, col, at]) => {
    const r = document.createElement('div');
    r.innerHTML = `<span style="color:#55607a">[${ts}]</span>  <span style="color:${col}">${txt.replace(/ /g, '&nbsp;')}</span>`;
    L.appendChild(r);
    gsap.set(r, { autoAlpha: 0 });
    tl.fromTo(r, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power3.out' }, at);
  });
  onFrame((t) => { log.querySelector('.rec').style.opacity = Math.floor(t * 2) % 2 ? 1 : 0.25; });
  hide(log, E(17) - 0.1, 0.4);
  words('…it kept *writing.*', { at: P(17, 'kept writing down') + 0.1, out: E(17) - 0.2, cls: 'h3', y: 930 });
}
// LG says not true + the missed word
{
  shot(C(18) + 0.4, [0.25, 1.4, 1.5], [0, 1.3, -3], { fov: 32 });
  const st = el('LG says: not true', 'stamp', { left: '960px', top: '430px' });
  gsap.set(st, { xPercent: -50, yPercent: -50, rotation: -8 });
  tl.set(st, { autoAlpha: 1 }, P(18, 'LG says'));
  tl.fromTo(st, { scale: 3 }, { scale: 1, duration: 0.3, ease: 'power4.in' }, P(18, 'LG says'));
  shake(P(18, 'LG says') + 0.3, 0.6, 0.03);
  hide(st, P(18, "And there's") - 0.05, 0.3);
  const red = el(`<div class="small" style="text-align:center;margin-bottom:18px">one word most people missed</div><div style="display:flex;gap:16px;justify-content:center"><div style="width:420px;height:110px;border-radius:12px;background:#eef2f8"></div></div>`, '', { position: 'absolute', left: '960px', top: '480px' });
  gsap.set(red, { xPercent: -50, yPercent: -50 });
  show(red, P(18, "And there's"), 0.5, { scale: 0.7, xPercent: -50, yPercent: -50 });
  hide(red, E(18), 0.3);
}
// crane up through the house
{
  words('It was also *looking around.*', { at: P(19, 'It was also'), out: E(19) + 0.3, cls: 'h2', y: 880, accent: 'cyan' });
  shot(C(19) + 0.6, [0.2, 1.5, 3.2], [0, 1.2, -3], { fov: 34 });
  shot(E(19) + 0.2, [16, 19, 21], [4, 0, 3.2], { fov: 40, ease: 'power2.inOut', via: [0.5, 9, 6] });
}

// =====================================================================================
// S4 · THE NETWORK SCAN (229 – 275)
// =====================================================================================
chapter(4, 'What They Found: The Network Scan', C(20) + 0.4, E(24));
shot(C(21), [12, 15.5, 16.5], [4, 0, 3.3], { fov: 40, ease: 'sine.inOut', hold: E(21) - C(21) - 0.4 });
{
  onFrame((t) => {
    const a = win(t, C(20) + 0.5, E(21) + 1, 0.8);
    fxTV.sweep.material.opacity = a;
    fxTV.sweep.visible = a > 0;
    fxTV.sweep.rotation.z = -t * 2.2;
  });
  words('Same Wi-Fi as *everything* you own', { at: C(20) + 0.3, out: C(21) - 0.2, cls: 'h3', y: 950, accent: 'cyan' });
  const cnt = el(`<div class="small">Devices found</div><div class="h1 cyan glow-cyan n" style="font-size:200px">0</div>`, '', { position: 'absolute', left: '1560px', top: '300px', textAlign: 'center' });
  gsap.set(cnt, { xPercent: -50 });
  show(cnt, C(21), 0.5, { scale: 0.6, xPercent: -50 });
  const n = cnt.querySelector('.n');
  tl.set(n, { textContent: '10?' }, P(21, 'Ten'));
  tl.set(n, { textContent: '20?' }, P(21, 'Twenty'));
  const T38 = P(21, 'thirty-eight');
  counter(n, 0, 38, T38, 1.2, (v) => String(Math.round(v)), 'power1.out');
  tl.set(n, { color: '#ff2d46', textShadow: '0 0 30px rgba(255,45,70,.7)' }, T38 + 1.2);
  hide(cnt, E(21) + 0.4, 0.3);
  devices.forEach((d, i) => {
    const at = T38 + i * 0.032;
    tl.fromTo(d.m.scale, { x: 0.0001, y: 0.0001, z: 0.0001 }, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(3)' }, at);
    tl.to(d.m.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.3 }, E(23));
  });
  onFrame((t) => {
    devices.forEach((d, i) => {
      const u = ((t * 0.7 + i * 0.13) % 1);
      const vis = d.m.scale.x > 0.01;
      d.ring.visible = vis;
      if (vis) { d.ring.scale.setScalar(0.5 + u * 2); d.ring.material.opacity = (1 - u) * 0.8; }
      d.m.rotation.y = t * 2 + i;
    });
  });
  const shown = [['Smartphone', 'Smartphones'], ['Smartwatch', 'Smartwatches'], ['3D Printer', '3D printer'], ['Air Purifier', 'air purifier'], ['Thermostat', 'thermostats']];
  shown.forEach(([name, phr]) => {
    const d = devices.find((x) => x.name === name);
    label3d(name, d.pos.clone().add(V(0, 0.45, 0)), P(21, phr), E(21) + 0.8);
  });
}
// neighbourhood
shot(C(22) - 0.2, [10, 30, 42], [3, 0, -2], { fov: 46, ease: 'power2.inOut' });
shot(E(23) - 0.8, [4, 33, 38], [3, 0, -3], { fov: 46, ease: 'none' });
hood.houses.forEach((h, i) => {
  label3d(`<span class="mono cyan">${h.ssid}</span> <span style="color:#3df59a;letter-spacing:-2px">▂▄▆</span>`, h.top, P(22, 'names of nearby') + i * 0.25, E(23));
});
words('Wi-Fi names · Signal strength · *Location*', { at: P(22, 'names of nearby'), out: E(22), cls: 'h3', y: 960, accent: 'cyan' });
{
  const dim = el('', '', { position: 'absolute', inset: '0', background: 'rgba(4,6,12,.62)' });
  show(dim, C(23), 0.5); hide(dim, E(23) - 0.2, 0.4);
  words("Why would a TV need | your *neighbour's* Wi-Fi?", { at: C(23) + 0.1, out: P(23, 'Hold that') - 0.1, cls: 'h2', y: 520, anim: 'pop', stagger: 0.06 });
  words('Hold that thought…', { at: P(23, 'Hold that'), out: E(23) - 0.2, cls: 'h2', y: 540, anim: 'type', cps: 22 });
}
// stream to LG Ad Solutions
const sTVtoDC = makeStream(new THREE.QuadraticBezierCurve3(V(0, 2.6, -3.1), V(18, 26, -18), hood.dcTop), COL.cyan, 90, 0.45);
const sDCtoPhone = makeStream(new THREE.QuadraticBezierCurve3(hood.dcTop, V(22, 22, -6), V(0.35, 0.5, 0.95)), COL.amber, 90, 0.45);
shot(C(24) - 0.2, [36, 26, 24], [20, 4, -16], { fov: 42, ease: 'power2.inOut' });
shot(E(24) - 0.6, [33, 23, 22], [22, 4, -18], { fov: 42, ease: 'none' });
label3d('<span class="red mono" style="margin-right:8px">AD</span>LG Ad Solutions', V(40, 11.5, -36), P(24, 'LG Ad Solutions'), E(24));
onFrame((t) => {
  sTVtoDC.update(t, Math.max(win(t, C(24), E(24) + 0.3, 0.5), win(t, C(38), E(38), 0.5)) * 0.95, 0.22);
  sDCtoPhone.update(t, win(t, P(38, 'which phone'), E(38), 0.5) * 0.95, 0.22);
});

// =====================================================================================
// S5 · THE HACKING PART (275 – 317)
// =====================================================================================
wipe(C(25) - 0.55, ['#ff2d46', '#000000']);
chapter(5, 'The Hacking Part', C(25) + 0.4, E(29));
shot(C(25) - 0.1, [-1.9, 0.85, 0.6], [0, 1.3, -3], { fov: 34, cut: true });
shot(E(26), [-1.0, 0.75, -0.6], [0, 1.0, -3], { fov: 32, ease: 'sine.inOut' });
{
  const codeR = rng(42);
  const cols = Array.from({ length: 64 }, () => ({ sp: 120 + codeR() * 260, off: codeR() * 1200 }));
  onFrame((t) => {
    const a = win(t, C(25) - 0.3, P(28, 'privately') + 0.5, 0.8) * 0.55;
    if (a <= 0) return;
    fx.save(); fx.font = '700 22px Mono';
    cols.forEach((c, i) => {
      for (let k = 0; k < 22; k++) {
        const y = ((t * c.sp + c.off + k * 26) % 1300) - 100;
        fx.fillStyle = `rgba(255,45,70,${a * (k / 22)})`;
        fx.fillText(String.fromCharCode(33 + ((i * 13 + k * 7 + Math.floor(t * 10)) % 90)), i * 30 + 8, y);
      }
    });
    fx.restore();
  });
  const rce = words('Remote code execution', { at: C(25) + 0.6, out: P(25, 'In simple words') - 0.1, cls: 'h1', y: 520, anim: 'glitch', drift: 0.02 });
  rce.style.fontSize = '110px';
  words('Bugs that let an attacker run | *their* code on your TV', { at: P(25, 'In simple words'), out: P(25, 'without ever') + 1.4, cls: 'h2', y: 520 });
  words('…without ever *touching* it.', { at: P(25, 'without ever'), out: E(25) - 0.1, cls: 'h3', y: 880 });
  pill('Proof of concept', 120, 160, '#ffb547', C(26), E(26));
  const micHud = el(`<div class="small">Built-in microphone</div><div class="h2 st" style="margin-top:8px">OFF</div><div class="mono dimc" style="font-size:22px;margin-top:6px">TV state: STANDBY</div>`, 'panel', { left: '1380px', top: '600px', width: '420px', padding: '26px 30px' });
  show(micHud, C(26) + 0.4, 0.5, { x: 60 });
  tl.set(micHud.querySelector('.st'), { textContent: 'ON ●', color: '#ff2d46', textShadow: '0 0 24px rgba(255,45,70,.7)' }, P(26, 'switch on'));
  glitchify(micHud, P(26, 'switch on'), 0.4);
  hide(micHud, E(26), 0.3);
  shot(C(27) + 1.2, [0.0, 1.35, 2.8], [0, 1.25, -3], { fov: 34, ease: 'power2.inOut' });
  shot(E(29) - 0.6, [0.0, 1.32, 2.2], [0, 1.25, -3], { fov: 34, ease: 'none' });
  words('Trust LG? *Fine.*', { at: C(27) + 0.2, out: P(27, 'do you trust') - 0.1, cls: 'h3', y: 300, accent: 'cyan' });
  words('Do you trust *every hacker* | who finds the same bug?', { at: P(27, 'do you trust'), out: E(27) - 0.1, cls: 'h2', y: 520, anim: 'pop' });
  const r = rng(5);
  for (let i = 0; i < 26; i++) {
    const x = 80 + r() * 1700, y = 120 + r() * 820;
    if (Math.abs(y - 520) < 150) continue;
    const p = el('>_ attacker', 'mono', { position: 'absolute', left: `${x}px`, top: `${y}px`, color: '#ff2d46', fontSize: '24px', padding: '6px 12px', border: '1px solid rgba(255,45,70,.5)', borderRadius: '8px', background: 'rgba(40,0,8,.6)' });
    show(p, P(27, 'every hacker') + i * 0.07, 0.25, { scale: 0.3 });
    hide(p, E(27) - 0.1, 0.25);
  }
  pill('Reported privately to LG', 960, 900, '#2fe0ff', C(28) + 0.1, E(28) - 0.1, { center: true });
  words('A government? | *Never…*', { at: C(29) + 0.1, out: P(29, 'that already') - 0.1, cls: 'h2', y: 520 });
  const hap = words('It already *happened.*', { at: P(29, 'that already'), out: E(29) - 0.2, cls: 'h1', y: 500, anim: 'slam', stagger: 0.12 });
  hap.style.fontSize = '120px';
  shake(P(29, 'that already') + 0.5, 0.5, 0.025);
  words('Years ago.', { at: P(29, 'Years ago'), out: E(29) - 0.2, cls: 'h3', y: 640, color: '#8a96ad' });
}

// =====================================================================================
// S6 · LG'S RESPONSE (317 – 363)
// =====================================================================================
wipe(C(30) - 0.55, ['#2fe0ff', '#0b1222']);
chapter(6, "LG's Response", C(30) + 0.4, E(32) - 1);
shot(C(30) - 0.1, [2.8, 1.6, 2.4], [0, 1.25, -3], { fov: 34, cut: true });
shot(E(32) - 0.6, [-2.8, 1.6, 2.4], [0, 1.25, -3], { fov: 34, ease: 'sine.inOut' });
{
  const dim = el('', '', { position: 'absolute', inset: '0', background: 'rgba(4,6,12,.7)' });
  show(dim, C(30), 0.5); hide(dim, E(32) - 0.6, 0.5);
  const left = panel(`<div class="small" style="color:#ff2d46">Researchers say</div><div class="lb body" style="margin-top:26px;display:flex;flex-direction:column;gap:26px;font-size:36px"></div>`, 120, 230, 820, null, C(30) + 0.2, P(31, 'Optional') - 0.2, { x: -80 });
  const right = panel(`<div class="small" style="color:#2fe0ff">LG says</div><div class="rb body" style="margin-top:26px;display:flex;flex-direction:column;gap:26px;font-size:36px"></div>`, 980, 230, 820, null, C(30) + 0.35, P(31, 'Optional') - 0.2, { x: 80 });
  const add = (box, text, at, color) => {
    const r = document.createElement('div');
    r.innerHTML = `<span style="color:${color};margin-right:14px">■</span>${text}`;
    box.appendChild(r); gsap.set(r, { autoAlpha: 0 });
    tl.fromTo(r, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, at);
    return r;
  };
  const lb = left.querySelector('.lb'), rb = right.querySelector('.rb');
  ['Audio captured in standby', 'Stored offline, uploaded later', '38 devices scanned on the network', 'Data sent to LG Ad Solutions'].forEach((s, i) => add(lb, s, C(30) + 0.8 + i * 0.35, '#ff2d46'));
  add(rb, 'No continuous recording', P(30, 'do not continuously'), '#2fe0ff');
  add(rb, 'Voice only on button press or "Hi LG"', P(30, 'only processed'), '#2fe0ff');
  add(rb, 'No wake word → not stored or sent', P(30, 'If no wake word'), '#2fe0ff');
  const opt = add(rb, 'ACR, voice & ads are <b class="opt" style="color:#fff">optional</b>', P(30, 'LG also says'), '#2fe0ff');
  tl.to(opt.querySelector('.opt'), { color: '#ffb547', textShadow: '0 0 18px rgba(255,181,71,.8)', duration: 0.3 }, E(30) - 0.6);
  // OPTIONAL fills the screen
  const big = el('Optional', 'kt h1', { left: '960px', top: '520px', fontSize: '260px', color: '#ffb547', textShadow: '0 0 50px rgba(255,181,71,.45)' });
  gsap.set(big, { xPercent: -50, yPercent: -50 });
  tl.set(big, { autoAlpha: 1 }, P(31, 'Optional'));
  tl.fromTo(big, { scale: 0.15, y: 160 }, { scale: 1, y: 0, duration: 0.7, ease: 'expo.out' }, P(31, 'Optional'));
  tl.to(big, { y: -180, scale: 0.55, duration: 0.6, ease: 'power3.inOut' }, P(31, 'Not off'));
  const notOff = words('≠ *Off*', { at: P(31, 'Not off') + 0.2, out: P(31, 'Critics') - 0.1, cls: 'h1', y: 600, anim: 'slam' });
  notOff.style.fontSize = '170px';
  hide(big, P(31, 'Critics') - 0.1, 0.3);
  ['Network scanning?', 'How much data?', 'Shared with whom?'].forEach((q, i) => {
    const d = el(`<span class="red" style="font-weight:900;margin-right:16px">?</span>${q}`, 'panel h3', { left: `${110 + i * 590}px`, top: '470px', padding: '26px 30px', fontSize: '40px' });
    show(d, P(31, 'Critics') + 0.6 + i * 0.6, 0.5, { y: 50 });
    hide(d, E(31) - 0.1, 0.3);
  });
  words('Unanswered by LG’s statement', { at: P(31, 'Critics') + 0.3, out: E(31) - 0.1, cls: 'small', y: 380 });
  words("Who's *right?*", { at: C(32) + 0.1, out: P(32, 'Honestly') + 0.4, cls: 'h1', y: 500, anim: 'zoom' });
  words('Until regulators test these TVs, nobody can say for sure.', { at: P(32, 'Honestly') + 0.2, out: P(32, 'But some') - 0.1, cls: 'body', y: 540, color: '#c9d3e6' });
  const prov = words('Some of it is already *proven.*', { at: P(32, 'But some'), out: E(32) - 0.15, cls: 'h2', y: 520, anim: 'slam', stagger: 0.1 });
  void prov;
}

// =====================================================================================
// S7 · IT'S HAPPENED BEFORE (363 – 426)
// =====================================================================================
wipe(C(33) - 0.55, ['#ff2d46', '#2fe0ff', '#0b1222']);
chapter(7, "It's Happened Before", C(33) + 0.4, E(37) - 1);
{
  const HX = hist.x;
  const nodeX = [0, 12, 24, 36, 48, 54].map((x) => HX + x);
  const at = [C(33), C(34), C(35), C(36), C(37), P(37, 'Texas sued')];
  shot(C(33) - 0.1, [nodeX[0] - 6, 4, 10], [nodeX[0] + 2, 1.6, 0], { fov: 38, cut: true });
  shot(C(33) + 1.4, [nodeX[0] + 1.2, 2.3, 6.4], [nodeX[0] + 0.8, 1.7, -0.5], { fov: 38, ease: 'power2.out' });
  for (let i = 1; i < 5; i++) {
    const tgt = i === 2 ? [nodeX[2] + 3.2, 1.45, -2.2] : i === 4 ? [nodeX[4] + 2, 1.7, -2.8] : [nodeX[i] + 0.8, 1.7, -0.5];
    const pos = i === 2 ? [nodeX[2] + 0.6, 1.9, 3.6] : i === 4 ? [nodeX[4] + 3.2, 2.4, 4.4] : [nodeX[i] + 1.2, 2.3, 6.4];
    shot(at[i] - 0.1, [nodeX[i - 1] + 1.6, 2.3, 6.6], [nodeX[i - 1] + 1.0, 1.7, -0.5], { fov: 38, ease: 'none' });
    shot(at[i] + 1.1, pos, tgt, { fov: 38, ease: 'power3.inOut', via: [(nodeX[i - 1] + nodeX[i]) / 2, 3.6, 7.5] });
  }
  shot(P(37, 'Even when'), [nodeX[4] + 2.6, 2.2, 3.4], [nodeX[4] + 2, 1.7, -3.4], { fov: 38, ease: 'sine.inOut' });
  shot(at[5], [nodeX[5] + 1.4, 3.4, 8.5], [nodeX[5] - 2, 1.7, -1], { fov: 40, ease: 'power2.inOut' });
  shot(E(37) - 0.6, [nodeX[5] + 1.0, 3.2, 7.6], [nodeX[5] - 2, 1.7, -1], { fov: 40, ease: 'none' });
  onFrame((t) => {
    let k = 0;
    for (let i = 0; i < 6; i++) if (t >= at[i]) k = i;
    const u = clamp((t - at[k]) / 1.2);
    const x = k === 0 ? u * 0.0 : lerp(nodeX[k - 1] - HX, nodeX[k] - HX, gsap.parseEase('power2.inOut')(u));
    hist.prog.scale.y = Math.max(0.0001, x);
    hist.prog.position.x = x / 2;
    hist.nodes.forEach((n, i) => { const on = t >= at[i]; n.halo.scale.setScalar(on ? 1 + 0.4 * Math.sin(t * 4) : 0.6); n.n.material.color.set(on ? COL.red : 0x3c5a8f); });
  });
  const card = (html, x, y, w, a, b) => panel(html, x, y, w, null, a, b, { y: 50 });
  card(`<div class="small" style="color:#ff2d46">2015 · Samsung privacy policy</div><div class="body q" style="margin-top:18px;font-size:32px;line-height:1.45"></div>`, 1060, 600, 720, C(33) + 0.4, E(33) - 0.1);
  {
    const q = document.querySelectorAll('.q');
    const qd = q[q.length - 1];
    const txt = '“If your spoken words include sensitive information… it could be captured and sent to a third party.”';
    const o = { n: 0 };
    tl.fromTo(o, { n: 0 }, { n: txt.length, duration: 4.5, ease: 'none', onUpdate: () => { qd.textContent = txt.slice(0, Math.round(o.n)); } }, C(33) + 0.9);
    // the "warned" paraphrase note
    words('paraphrased', { at: C(33) + 1, out: E(33) - 0.1, cls: 'small', x: 1780, y: 580, align: 'right' });
  }
  {
    const d = card(`<div class="small" style="color:#ff2d46">2017 · FTC vs Vizio</div><div style="display:flex;gap:40px;margin-top:18px"><div><div class="h2 n1">0</div><div class="small" style="margin-top:6px">TVs tracked</div></div><div><div class="h2 n2 red">$0</div><div class="small" style="margin-top:6px">Paid</div></div></div><div class="body dimc" style="margin-top:16px;font-size:26px">second-by-second viewing data · no proper consent</div>`, 1060, 600, 760, C(34) + 0.3, E(34) - 0.1);
    counter(d.querySelector('.n1'), 0, 11000000, P(34, 'eleven million') - 0.3, 1.2, (v) => `${(v / 1e6).toFixed(v < 1e7 ? 1 : 0)}M`);
    const n2 = d.querySelector('.n2');
    n2.textContent = '—';
    counter(n2, 0, 2.2, P(34, 'two point two'), 1.0, (v) => `$${v.toFixed(1)}M`);
    tl.set(n2, { textContent: '—' }, C(34));
  }
  {
    const d = card(`<div class="small" style="color:#ff2d46">2017 · WikiLeaks · CIA documents</div><div class="h2" style="margin-top:12px">“WEEPING ANGEL”</div><div class="body dimc" style="margin-top:12px;font-size:26px">Fake-Off mode on certain Samsung TVs</div>`, 1060, 160, 760, C(35) + 0.4, E(35) - 0.1);
    void d;
    const cls = el('CLASSIFIED', 'stamp', { left: '1460px', top: '610px', fontSize: '60px', borderWidth: '6px' });
    gsap.set(cls, { rotation: -10, xPercent: -50 });
    tl.set(cls, { autoAlpha: 1 }, P(35, 'Weeping Angel') + 0.3);
    tl.fromTo(cls, { scale: 2.5 }, { scale: 1, duration: 0.25, ease: 'power4.in' }, P(35, 'Weeping Angel') + 0.3);
    hide(cls, P(35, 'It could put') + 0.6, 0.3);
    const st = [['Screen', 'OFF', '#8a96ad', P(35, 'The screen went')], ['Lights', 'OFF', '#8a96ad', P(35, 'the lights went')], ['Microphone', 'RECORDING', '#ff2d46', P(35, 'the microphone kept')]];
    st.forEach(([k, v, c, a], i) => {
      const r = el(`<span class="small">${k}</span><span class="h3" style="margin-left:22px;color:${c}">${v}</span>`, 'panel', { left: '120px', top: `${560 + i * 120}px`, padding: '20px 30px' });
      show(r, a, 0.4, { x: -40 });
      hide(r, E(35) - 0.1, 0.3);
    });
    label3d('<span class="red">● REC</span>', V(nodeX[2] + 3.2, 0.95, -2.0), P(35, 'the microphone kept'), E(35));
  }
  {
    const d = card(`<div style="display:flex;gap:26px;align-items:center"><div style="width:0;height:0;border-left:44px solid transparent;border-right:44px solid transparent;border-bottom:76px solid #ffb547;position:relative"><span style="position:absolute;left:-8px;top:18px;font:900 46px Montserrat;color:#04060c">!</span></div><div><div class="small" style="color:#ffb547">2019 · FBI warning</div><div class="h3" style="margin-top:10px;font-size:40px">Smart TV cameras & mics<br>can be hijacked</div></div></div>`, 1060, 600, 760, C(36) + 0.2, E(36) - 0.1);
    void d;
  }
  {
    words('Automatic Content Recognition', { at: P(37, 'Automatic Content'), out: P(37, 'Your TV can take') - 0.1, cls: 'h2', y: 180 });
    words('ACR', { at: P(37, 'Your TV can take'), out: P(37, 'A 2024') - 0.1, cls: 'h1', x: 1600, y: 200, anim: 'zoom', accent: 'red', color: '#ff2d46' });
    const twice = el(`<div class="small">2024 university study</div><div style="display:flex;gap:40px;margin-top:14px"><div><div class="h2">2× / sec</div><div class="small" style="margin-top:6px">Samsung</div></div><div><div class="h2 red">even more</div><div class="small" style="margin-top:6px">LG</div></div></div>`, 'panel', { left: '120px', top: '620px', padding: '28px 34px' });
    show(twice, P(37, 'A 2024'), 0.5, { y: 50 });
    hide(twice, P(37, 'In 2025') - 0.1, 0.3);
    words('Even as a *monitor* for a console', { at: P(37, 'Even when'), out: P(37, 'In 2025') - 0.1, cls: 'h3', x: 120, y: 560, align: 'left' });
    const brands = ['Samsung', 'LG', 'Sony', 'Hisense', 'TCL'];
    words('2025 · *Texas* sues', { at: P(37, 'In 2025'), out: E(37) - 0.1, cls: 'h2', y: 760 });
    brands.forEach((b, i) => pill(b, 520 + i * 180, 840, '#eef2f8', P(37, 'Texas sued') + 0.6 + i * 0.25, E(37) - 0.1));
    // ACR TV content + shutter + thumbnails flying to the server
    const tv3 = hist.tvACR;
    const g = tv3.screenTex.g;
    const thumbFrom = new THREE.Vector3();
    onFrame((t) => {
      const a = win(t, C(37) - 1, E(37) + 0.5, 0.3);
      if (a <= 0) return;
      const sky = g.createLinearGradient(0, 0, 0, 360);
      sky.addColorStop(0, '#1d3c8f'); sky.addColorStop(1, '#f08a5d');
      g.fillStyle = sky; g.fillRect(0, 0, 640, 360);
      g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(470 + Math.sin(t) * 20, 120, 46, 0, 7); g.fill();
      for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(20,30,60,${0.5 + k * 0.12})`; g.beginPath(); g.moveTo(0, 360); for (let x = 0; x <= 640; x += 40) g.lineTo(x, 250 + k * 25 + Math.sin(x * 0.02 + k + t * 0.6) * 30); g.lineTo(640, 360); g.fill(); }
      const ph = (t * 2) % 1;
      if (ph < 0.15) { g.strokeStyle = `rgba(255,255,255,${1 - ph / 0.15})`; g.lineWidth = 18; g.strokeRect(0, 0, 640, 360); }
      g.fillStyle = '#ff2d46'; g.font = '700 22px Mono'; g.fillText(`ACR · frame ${Math.floor(t * 2)}`, 18, 34);
      tv3.screenTex.tex.needsUpdate = true;
      tv3.screenLight.intensity = 1.2 * a;
      tv3.g.getWorldPosition(thumbFrom);
      hist.thumbs.forEach((p, i) => {
        const u = ((t * 2 - i) / 3.5);
        const uu = u - Math.floor(u);
        const live = t > P(37, 'Not once') && t < E(37);
        p.visible = live;
        if (!live) return;
        const from = thumbFrom.clone().add(new THREE.Vector3(0, 0, 0.3));
        const to = hist.srv;
        p.position.lerpVectors(from, to, uu);
        p.position.y += Math.sin(uu * Math.PI) * 1.4;
        p.material.opacity = Math.sin(uu * Math.PI) * 0.9;
        p.material.color.setHSL(0.6 - (i % 5) * 0.04, 0.7, 0.7);
        p.rotation.y = -0.5;
      });
    });
  }
}

// =====================================================================================
// S8 · FOLLOW THE MONEY (426 – 465)
// =====================================================================================
wipe(C(38) - 0.55, ['#ffb547', '#0b1222']);
chapter(8, 'Follow the Money', C(38) + 0.4, E(40) - 0.5);
shot(C(38) - 0.1, [24, 22, 24], [12, 2, -10], { fov: 44, cut: true });
shot(E(39) - 0.4, [21, 20, 22], [11, 2, -10], { fov: 44, ease: 'sine.inOut' });
{
  label3d('<span class="cyan mono" style="margin-right:8px">01</span>Who you are', V(0, 4, -3), P(38, 'who you are'), E(38));
  label3d('<span class="cyan mono" style="margin-right:8px">02</span>Where you live', V(8, 4, 8), P(38, 'where you live'), E(38));
  label3d('<span class="amber mono" style="margin-right:8px">03</span>Which phone is yours', V(0.35, 2.4, 0.95), P(38, 'which phone'), E(38));
  label3d('LG Ad Solutions', V(40, 11.5, -36), C(38) + 0.5, E(38));
  const adTV = el(`<div class="small">On your TV</div><div class="h3" style="margin-top:8px">AD</div>`, 'panel', { left: '120px', top: '760px', width: '260px', padding: '20px 26px' });
  const adPh = el(`<div class="small">On your phone</div><div class="h3 amber" style="margin-top:8px">Same AD</div>`, 'panel', { left: '460px', top: '760px', width: '300px', padding: '20px 26px' });
  show(adTV, P(38, 'That lets'), 0.4, { y: 40 });
  show(adPh, P(38, 'follow you'), 0.4, { x: -80 });
  hide(adTV, E(38) - 0.1, 0.3); hide(adPh, E(38) - 0.1, 0.3);
}
{
  const dim = el('', '', { position: 'absolute', inset: '0', background: 'rgba(4,6,12,.78)' });
  show(dim, C(39), 0.4); hide(dim, E(39), 0.4);
  words('That cheap 65" TV deal…', { at: C(39) + 0.2, out: P(39, 'In 2021') - 0.1, cls: 'h2', y: 520 });
  const chart = el(`<div class="small">2021 · Vizio · profit</div>
    <div style="display:flex;gap:70px;align-items:flex-end;height:380px;margin-top:26px">
      <div style="text-align:center"><div class="b1" style="width:170px;height:80px;border-radius:12px 12px 0 0;background:#3c5a8f;transform-origin:bottom"></div><div class="small" style="margin-top:14px">Selling TVs</div></div>
      <div style="text-align:center"><div class="b2" style="width:170px;height:340px;border-radius:12px 12px 0 0;background:linear-gradient(#ffb547,#ff2d46);transform-origin:bottom;box-shadow:0 0 40px rgba(255,181,71,.35)"></div><div class="small" style="margin-top:14px;color:#ffb547">Ads + viewing data</div></div>
    </div><div class="small" style="margin-top:14px;font-size:15px;color:#55607a">bars show direction, not exact figures</div>`, 'panel', { left: '160px', top: '230px', padding: '30px 40px' });
  show(chart, P(39, 'In 2021'), 0.5, { y: 50 });
  tl.fromTo(chart.querySelector('.b1'), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'power3.out' }, P(39, 'In 2021') + 0.4);
  tl.fromTo(chart.querySelector('.b2'), { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power3.out' }, P(39, 'more profit'));
  hide(chart, E(39) - 0.1, 0.3);
  const big = el(`<div class="small">LG ad business · connected devices · US</div><div class="h1 amber n" style="font-size:120px;margin-top:10px">0</div>`, '', { position: 'absolute', left: '960px', top: '330px' });
  show(big, P(39, "LG's ad business"), 0.5, { y: 40 });
  counter(big.querySelector('.n'), 0, 360000000, P(39, "LG's ad business") + 0.2, 2.2, (v) => `${Math.round(v).toLocaleString('en-US')}+`);
  hide(big, E(39) - 0.1, 0.3);
}
{
  shot(C(40) - 0.1, [1.3, 1.7, 4.4], [0.15, 1.2, 2.4], { fov: 34, cut: true });
  shot(E(40) - 0.6, [1.0, 1.6, 3.9], [0.15, 1.25, 2.4], { fov: 32, ease: 'none' });
  words("Maybe the TV isn't the product.", { at: C(40) + 0.05, out: P(40, 'Maybe you') - 0.05, cls: 'h3', y: 860 });
  const you = words('Maybe *you* are.', { at: P(40, 'Maybe you'), out: E(40) + 0.2, cls: 'h1', y: 860, anim: 'slam', stagger: 0.12 });
  void you;
  label3d('<span class="mono amber">▌▌▍▌▍▍▌▌▍▌</span>&nbsp; PRODUCT', V(0.15, 1.95, 2.55), P(40, 'Maybe you') + 0.3, E(40) + 0.2);
}

// =====================================================================================
// S9 · PROTECT YOURSELF + NEXT (465 – 527)
// =====================================================================================
wipe(C(41) - 0.55, ['#3df59a', '#0b1222']);
chapter(9, 'How to Protect Yourself', C(41) + 0.4, E(46) - 0.5);
shot(C(41) - 0.1, [3.2, 1.6, 0.6], [-0.9, 1.25, -3], { fov: 36, cut: true });
shot(C(46) - 0.3, [2.6, 1.5, 0.0], [-0.8, 1.25, -3], { fov: 36, ease: 'sine.inOut' });
{
  pill('Settings → General', 120, 150, '#3df59a', P(41, 'open Settings'), E(45));
  words('menu names vary by model', { at: P(41, 'Menu names'), out: E(45), cls: 'small', x: 120, y: 240, align: 'left' });
  const items = [
    ['Always Ready + Quick Start', 'OFF', C(42)],
    ['Voice recognition & "Hi LG"', 'OFF', C(43)],
    ['Viewing info · Voice info · Personalised ads', 'UNTICK', C(44)],
    ['Put the TV on a guest Wi-Fi', 'DO IT', C(45)],
  ];
  items.forEach(([txt, act, at], i) => {
    const row = el(`<span class="check">✓</span><span class="body" style="font-size:32px">${txt}</span><span class="pill" style="position:relative;margin-left:22px;background:rgba(61,245,154,.15);color:#3df59a;font-size:20px;padding:8px 16px">${act}</span>`, '', { position: 'absolute', left: '120px', top: `${330 + i * 120}px`, display: 'flex', alignItems: 'center' });
    show(row, at + 0.1, 0.5, { x: -60 });
    const ck = row.querySelector('.check');
    tl.to(ck, { background: '#3df59a', borderColor: '#3df59a', color: '#04060c', duration: 0.25, ease: 'power2.out' }, at + 1.2);
    tl.fromTo(ck, { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 }, at + 1.2);
    hide(row, E(45), 0.3);
  });
  words('Other brands: look for “viewing information” or “content recognition”', { at: P(44, 'On other brands'), out: E(44), cls: 'body', x: 120, y: 860, align: 'left', color: '#8a96ad' });
  // #5: unplug for good
  shot(P(46, "don't connect", 0.4), [1.9, 0.62, -2.05], [2.55, 0.28, -3.3], { fov: 34, ease: 'power3.inOut', hold: 0.9 });
  const five = words('#5 · Don’t connect it | to the *internet at all*', { at: C(46) + 0.2, out: P(46, 'Plug in') - 0.1, cls: 'h2', x: 120, y: 300, align: 'left' });
  void five;
  plugOut(P(46, "don't connect", 0.8));
  MIC_OFF_AT = P(46, "don't connect", 1.0);
  shot(P(46, 'Plug in', 0.8), [0.5, 1.4, 2.6], [0, 1.25, -3], { fov: 32, ease: 'power2.inOut' });
  words('Use a streaming stick you trust.', { at: P(46, 'Plug in'), out: P(46, 'let the TV') - 0.1, cls: 'h3', y: 880 });
  words('Let the TV just be a *screen.*', { at: P(46, 'let the TV'), out: E(46) - 0.1, cls: 'h2', y: 880, accent: 'cyan' });
}
{
  // phone + glasses glow red
  shot(C(47) + 0.8, [0.9, 1.15, 2.1], [0.05, 0.46, 0.9], { fov: 30, ease: 'power2.inOut' });
  shot(P(47, 'on your face') + 1.2, [0.6, 0.95, 1.7], [-0.05, 0.46, 0.9], { fov: 28, ease: 'sine.inOut' });
  const tPhone = P(47, 'in your pocket'), tGl = P(47, 'on your face');
  onFrame((t) => {
    const a = ramp(t, tPhone - 0.2, tPhone + 0.4);
    const p = 0.6 + 0.4 * Math.sin(t * 5);
    room.phone.scr.material.color.setRGB(lerp(0.05, p, a), lerp(0.1, 0.05, a), lerp(0.2, 0.1, a));
    const b = ramp(t, tGl - 0.2, tGl + 0.4);
    room.glasses.cam.material.color.setRGB(lerp(0.13, 1.4 * p, b), lerp(0.15, 0.1, b), lerp(0.2, 0.15, b));
    room.glasses.cam.scale.setScalar(1 + b * 0.5);
  });
  words('One in your *pocket…*', { at: tPhone - 0.4, out: tGl - 0.1, cls: 'h2', y: 880 });
  words('…one on your *face.*', { at: tGl, out: P(47, "That's what") - 0.1, cls: 'h2', y: 880 });
  // end card
  const black = el('', '', { position: 'absolute', inset: '0', background: '#04060c' });
  show(black, P(47, "That's what") - 0.3, 0.5);
  words('Next video', { at: P(47, "That's what"), out: 526.4, cls: 'small', y: 330 });
  words('The microphone | in your *pocket*', { at: P(47, "That's what") + 0.2, out: 526.4, cls: 'h1', y: 460, anim: 'zoom', stagger: 0.08 });
  const sub = el(`<div style="display:inline-flex;align-items:center;gap:18px;padding:22px 44px;border-radius:14px;background:#ff2d46;font:900 40px Montserrat;letter-spacing:.04em">SUBSCRIBE</div>`, '', { position: 'absolute', left: '960px', top: '700px' });
  gsap.set(sub, { xPercent: -50 });
  show(sub, P(47, 'Subscribe'), 0.5, { scale: 0.5, xPercent: -50 });
  tl.to(sub.firstChild, { background: '#2a2f3d', duration: 0.3 }, P(47, 'Subscribe') + 1.2);
  tl.set(sub.firstChild, { textContent: 'SUBSCRIBED ✓' }, P(47, 'Subscribe') + 1.2);
  hide(sub, 526.4, 0.4);
  words('Are you unplugging your TV *tonight?*', { at: P(47, 'tell me'), out: 526.4, cls: 'h3', y: 860 });
  const fin = el('', '', { position: 'absolute', inset: '0', background: '#000' });
  tl.fromTo(fin, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 526.4);
}

// clear the 2D fx canvas every frame (runs first)
updaters.unshift(() => { fx.canvas.width = 1920; });
tl.set({}, {}, DURATION);
checkOverlaps();
