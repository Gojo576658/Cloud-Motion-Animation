// node tools/stills.mjs <composition> <seconds,...>  -> out/stills/*.jpg + out/sheet.jpg
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const [comp = 'SmartTV', list = '1'] = process.argv.slice(2);
const times = list.split(',').map(Number);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: new URL('../src/index.ts', import.meta.url).pathname });
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable, inputProps: { audio: false } });
fs.rmSync('out/stills', { recursive: true, force: true });
fs.mkdirSync('out/stills', { recursive: true });
const files = [];
for (const s of times) {
  const output = `out/stills/t${s.toFixed(2).padStart(7, '0')}.jpg`;
  await renderStill({ serveUrl, composition, output, frame: Math.min(composition.durationInFrames - 1, Math.round(s * 30)), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, inputProps: { audio: false }, chromiumOptions: { gl: 'swangle' } });
  files.push(output);
}
// contact sheet: 3 per row for 16:9, 6 per row for vertical
const n = files.length;
const vertical = composition.height > composition.width;
const W = vertical ? 320 : 640, H = Math.round(W * composition.height / composition.width), cols = vertical ? 6 : 3;
const inputs = files.flatMap((f) => ['-i', f]);
const scale = files.map((_, i) => `[${i}]scale=${W}:${H}[s${i}]`).join(';');
const layout = files.map((_, i) => `${(i % cols) * W}_${Math.floor(i / cols) * H}`).join('|');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', n > 1 ? `${scale};${files.map((_, i) => `[s${i}]`).join('')}xstack=inputs=${n}:layout=${layout}:fill=black` : `[0]scale=${W}:${H}`, 'out/sheet.jpg']);
console.log('sheet: out/sheet.jpg');
