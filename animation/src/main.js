import { tl, updaters } from './kit.js';

// canvas-drawn 3D labels need the web fonts loaded before the world is built
await Promise.all(['400 20px Montserrat', '600 20px Montserrat', '800 20px Montserrat', '900 20px Montserrat', '400 20px Inter', '600 20px Inter', '400 20px Mono', '700 20px Mono'].map((f) => document.fonts.load(f)));
const { render } = await import('./world.js');
const { DURATION } = await import('./scenes.js');

// film grain: a few pre-baked noise tiles, picked by frame index (deterministic)
const grain = document.getElementById('grain').getContext('2d');
const tiles = [];
for (let k = 0; k < 8; k++) {
  const img = grain.createImageData(480, 270);
  let s = 1234 + k * 977;
  for (let i = 0; i < img.data.length; i += 4) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const v = s >>> 24;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  tiles.push(img);
}

function frame(t) {
  tl.seek(t, false);
  for (const fn of updaters) fn(t);
  render(t);
  grain.putImageData(tiles[Math.floor(t * 24) % tiles.length], 0, 0);
}

window.DURATION = DURATION;
window.seek = async (t) => { frame(t); return true; };
window.ready = document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => r(true))));

// ---------------------------------------------------------------- preview mode
const params = new URLSearchParams(location.search);
if (params.has('render')) {
  document.body.classList.add('render');
} else {
  const stage = document.getElementById('stage');
  const fit = () => { const s = Math.min(innerWidth / 1920, (innerHeight - 52) / 1080); stage.style.transform = `scale(${s})`; };
  addEventListener('resize', fit); fit();
  const scrub = document.getElementById('scrub'), time = document.getElementById('time'), play = document.getElementById('play');
  scrub.max = DURATION;
  let playing = false, t = +(params.get('t') || 0), last = 0;
  const fmt = (x) => `${Math.floor(x / 60)}:${(x % 60).toFixed(1).padStart(4, '0')}`;
  const draw = () => { frame(t); scrub.value = t; time.textContent = fmt(t); };
  scrub.oninput = () => { t = +scrub.value; draw(); };
  play.onclick = () => { playing = !playing; play.textContent = playing ? '❚❚' : '▶'; last = performance.now(); };
  const loop = (now) => { if (playing) { t = Math.min(DURATION, t + (now - last) / 1000); last = now; draw(); } requestAnimationFrame(loop); };
  window.ready.then(() => { draw(); requestAnimationFrame(loop); });
}
