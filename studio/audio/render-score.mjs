// Renders the score offline in headless Chromium (Tone.js) and writes audio/out/score.wav.
// Timeline comes from the voiceover timing so music hits land on the narration.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const tl = JSON.parse(fs.readFileSync(path.join(root, 'src/timeline.json'), 'utf8'));
// optional: --to <seconds> renders only the start (for quick previews)
const toArg = process.argv.indexOf('--to');
if (toArg > 0) {
  const to = +process.argv[toArg + 1];
  tl.duration = to;
  tl.sections = tl.sections.filter((s) => s.start < to).map((s) => ({ ...s, end: Math.min(s.end, to) }));
  tl.hooks = tl.hooks.filter((h) => h < to);
  tl.events = (tl.events || []).filter((e) => e.t < to);
}
fs.mkdirSync(path.join(here, 'out'), { recursive: true });
const outFile = path.join(here, 'out/score.wav');

const srv = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const ws = fs.createWriteStream(outFile);
    req.pipe(ws);
    req.on('end', () => { res.end('ok'); });
    return;
  }
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': p.endsWith('.js') ? 'text/javascript' : 'text/html' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
fs.writeFileSync(path.join(here, 'score.html'), `<!doctype html><script src="/node_modules/tone/build/Tone.js"></script>
<script type="module">import { compose, toWav } from '/audio/score.js';
window.run = async (tl) => { const b = await compose(tl); const wav = toWav(b.get()); await fetch('/upload', { method: 'POST', body: wav }); return b.duration; };
window.ok = true;</script>`);

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[page error]', e.message));
await page.goto(`http://127.0.0.1:${port}/audio/score.html`);
await page.waitForFunction(() => window.ok);
const t0 = Date.now();
const dur = await page.evaluate((tl) => window.run(tl), tl);
console.log(`score: ${dur.toFixed(1)}s rendered in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outFile}`);
await browser.close();
srv.close();
