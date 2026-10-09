// Soundtrack for "The Cursed CPU": voice (offset into video time) + comedy score ducked under it,
// loudness-normalised (-14 LUFS).  node audio/mix-cpu.mjs
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const tl = JSON.parse(fs.readFileSync('src/cpu/timeline.json', 'utf8'));
const D = tl.duration;
const f = [
  `[0:a]adelay=${Math.round(tl.offset * 1000)}:all=1,apad,atrim=0:${D},loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[voice][key]`,
  `[1:a]atrim=0:${D},volume=2.8[mus]`,
  `[mus][key]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=420:makeup=1[duck]`,
  `[voice][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]`,
];
fs.mkdirSync('public/cpu', { recursive: true });
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', '../voice/out-cpu/voiceover.wav', '-i', 'audio/out-cpu/score.wav', '-filter_complex', f.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', 'public/cpu/soundtrack.wav'], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`soundtrack: public/cpu/soundtrack.wav (${D.toFixed(2)}s)`);
