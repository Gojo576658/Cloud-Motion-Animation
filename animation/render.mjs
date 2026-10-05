// Renders the sequence frame-by-frame in headless Chromium and encodes it with ffmpeg.
//   node render.mjs                         full video -> out/smart-tv-listening.mp4
//   node render.mjs --stills 0,12.5,40      PNG stills -> out/stills/
//   node render.mjs --from 100 --to 130     render only part of the timeline
//   options: --fps 24  --workers 4  --scale 1 (0.5 = 960x540 draft)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './server.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] == null ? true : arr[i + 1]]] : a), []));
const fps = +(args.fps || 24);
const workers = +(args.workers || 4);
const scale = +(args.scale || 1);
const outDir = path.resolve('out');
fs.mkdirSync(outDir, { recursive: true });

const { port, close } = await startServer(0);
const url = `http://127.0.0.1:${port}/index.html?render`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'] });

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[page ${m.type()}]`, m.text()); });
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.ready, null, { timeout: 60000 });
  await page.evaluate(() => window.ready);
  return page;
}

if (args.stills) {
  const dir = path.join(outDir, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  const page = await openPage();
  const times = String(args.stills).split(',').map(Number);
  for (const t of times) {
    await page.evaluate((x) => window.seek(x), t);
    const f = path.join(dir, `t${t.toFixed(1).padStart(6, '0')}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 85 });
    console.log('still', f);
  }
} else {
  const duration = await (await openPage()).evaluate(() => window.DURATION);
  const from = +(args.from || 0), to = Math.min(+(args.to || duration), duration);
  const f0 = Math.round(from * fps), f1 = Math.round(to * fps);
  const total = f1 - f0;
  const per = Math.ceil(total / workers);
  const t0 = Date.now();
  let done = 0;
  const parts = [];
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const a = f0 + w * per, b = Math.min(f1, a + per);
    if (a >= b) return;
    const part = path.join(outDir, `part${w}.mp4`);
    parts[w] = part;
    const page = await openPage();
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-vf', 'vignette=angle=PI/5,noise=alls=6:allf=t', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), part], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      await page.evaluate((x) => window.seek(x), f / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      done++;
      if (done % 150 === 0) {
        const el = (Date.now() - t0) / 1000;
        console.log(`${done}/${total} frames · ${(done / el).toFixed(1)} fps · eta ${Math.round((total - done) / (done / el))}s`);
      }
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
  }));
  const list = path.join(outDir, 'parts.txt');
  fs.writeFileSync(list, parts.filter(Boolean).map((p) => `file '${p}'`).join('\n'));
  const name = args.out || (from === 0 && to === duration ? 'smart-tv-listening.mp4' : `clip_${from}-${to}.mp4`);
  await new Promise((r) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', path.join(outDir, name)], { stdio: 'inherit' }).on('close', r));
  for (const p of parts.filter(Boolean)) fs.rmSync(p);
  fs.rmSync(list);
  console.log(`done: out/${name} in ${Math.round((Date.now() - t0) / 1000)}s`);
}
await browser.close();
close();
