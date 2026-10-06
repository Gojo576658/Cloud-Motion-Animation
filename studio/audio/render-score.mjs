// Renders the score offline in headless Chromium (Tone.js) and writes audio/out/score.wav.
// One offline render per section (a single 9-minute render is too slow), run a few at a time,
// each with a 4 s tail; ffmpeg then lays them on the timeline so tails ring into the next section.
//   node audio/render-score.mjs [--to seconds] [--jobs n]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const sarg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const tl = JSON.parse(fs.readFileSync(path.join(root, sarg('--tl', 'src/timeline.json')), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? +process.argv[i + 1] : d; };
const to = arg('--to', tl.duration), jobs = arg('--jobs', 3);
const outDir = path.join(here, sarg('--out', 'out'));
fs.mkdirSync(outDir, { recursive: true });

// per-section sub-timelines, shifted to start at 0
const parts = tl.sections.filter((s) => s.start < to).map((s, k, arr) => {
  const end = Math.min(s.end, to), len = end - s.start;
  const last = k === arr.length - 1;
  return {
    file: path.join(outDir, `part-${s.index}.wav`), start: s.start,
    tl: { duration: len, bpm: tl.bpm, final: !tl.loop && last && to >= tl.duration, sections: [{ ...s, start: 0, end: len }], hooks: [],
      events: (tl.events || []).filter((e) => e.t >= s.start && e.t < end).map((e) => ({ ...e, t: e.t - s.start })) },
  };
});

const srv = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (req.method === 'POST') {
    const ws = fs.createWriteStream(path.join(outDir, path.basename(u.searchParams.get('f'))));
    req.pipe(ws);
    ws.on('finish', () => res.end('ok'));
    return;
  }
  const p = path.join(root, decodeURIComponent(u.pathname));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
fs.writeFileSync(path.join(here, 'score.html'), `<!doctype html><script src="/node_modules/tone/build/Tone.js"></script>
<script type="module">import { compose, toWav } from '/audio/score.js';
window.run = async (tl, f) => { const b = await compose(tl); const wav = toWav(b.get()); await fetch('/upload?f=' + f, { method: 'POST', body: wav }); return b.duration; };
window.ok = true;</script>`);

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const t0 = Date.now();
const queue = [...parts];
await Promise.all(Array.from({ length: jobs }, async () => {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  await page.goto(`http://127.0.0.1:${port}/audio/score.html`);
  await page.waitForFunction(() => window.ok);
  for (let p; (p = queue.shift());) {
    const t1 = Date.now();
    const d = await page.evaluate(([x, f]) => window.run(x, f), [p.tl, path.basename(p.file)]);
    console.log(`  ${path.basename(p.file)} ${d.toFixed(1)}s in ${((Date.now() - t1) / 1000).toFixed(0)}s`);
  }
  await page.close();
}));
await browser.close();
srv.close();

// lay the parts on the timeline
const inputs = parts.flatMap((p) => ['-i', p.file]);
const f = parts.map((p, i) => `[${i}:a]adelay=${Math.round(p.start * 1000)}:all=1[a${i}]`);
f.push(`${parts.map((_, i) => `[a${i}]`).join('')}amix=inputs=${parts.length}:normalize=0,atrim=0:${to + 4}[out]`);
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', f.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', path.join(outDir, 'score.wav')], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`score: ${parts.length} parts in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${path.relative(root, path.join(outDir, 'score.wav'))}`);
