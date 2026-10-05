#!/usr/bin/env -S node
// (run with NODE_USE_ENV_PROXY=1 behind a proxy; the npm script sets it)
// Stock footage from Pexels (free license, no attribution required; we still log credits).
//   node tools/pexels.mjs search videos "smart tv living room night"   -> list candidates
//   node tools/pexels.mjs get video <id> [name]                        -> public/stock/<name>.mp4 (+ .jpg poster)
//   node tools/pexels.mjs get photo <id> [name]                        -> public/stock/<name>.jpg
import fs from 'node:fs';
const key = (fs.readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/PEXELS_API_KEY=(\S+)/) || [])[1];
if (!key) throw new Error('PEXELS_API_KEY missing in studio/.env');
const api = async (u) => { const r = await fetch(`https://api.pexels.com${u}`, { headers: { Authorization: key } }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.json(); };
const save = async (url, file) => { const r = await fetch(url); fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); return file; };
const out = new URL('../public/stock/', import.meta.url).pathname;
fs.mkdirSync(out, { recursive: true });
const creditsFile = out + 'CREDITS.json';
const credits = fs.existsSync(creditsFile) ? JSON.parse(fs.readFileSync(creditsFile, 'utf8')) : {};
const [cmd, kind, ...rest] = process.argv.slice(2);

if (cmd === 'search') {
  const q = encodeURIComponent(rest.join(' '));
  if (kind.startsWith('video')) {
    const d = await api(`/videos/search?query=${q}&orientation=landscape&size=medium&per_page=12`);
    for (const v of d.videos) console.log(`${v.id}\t${v.duration}s\t${v.width}x${v.height}\tby ${v.user.name}\t${v.url}`);
  } else {
    const d = await api(`/v1/search?query=${q}&orientation=landscape&per_page=12`);
    for (const p of d.photos) console.log(`${p.id}\t${p.width}x${p.height}\tby ${p.photographer}\t${p.alt}`);
  }
} else if (cmd === 'get') {
  const [id, name = `${kind}-${id}`] = rest;
  if (kind === 'video') {
    const v = await api(`/videos/videos/${id}`);
    const files = v.video_files.filter((f) => f.width && f.width <= 1920 && f.width >= f.height).sort((a, b) => b.width - a.width);
    await save(files[0].link, `${out}${name}.mp4`);
    await save(v.image, `${out}${name}.jpg`);
    credits[name] = { type: 'video', id: v.id, by: v.user.name, url: v.url, size: `${files[0].width}x${files[0].height}`, duration: v.duration };
  } else {
    const p = await api(`/v1/photos/${id}`);
    await save(p.src.large2x, `${out}${name}.jpg`);
    credits[name] = { type: 'photo', id: p.id, by: p.photographer, url: p.url, alt: p.alt };
  }
  fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 1));
  console.log('saved', name, credits[name]);
}
