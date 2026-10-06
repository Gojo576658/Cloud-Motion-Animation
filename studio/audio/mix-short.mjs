// Soundtrack for the Short: voice (offset into video time) + score ducked under it,
// loudness-normalised (-14 LUFS). Music sits a little hotter than the long video for Shorts energy.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const tl = JSON.parse(fs.readFileSync('src/short/timeline.json', 'utf8'));
const D = tl.duration;
const f = [
  `[0:a]adelay=${Math.round(tl.offset * 1000)}:all=1,apad,atrim=0:${D},loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[voice][key]`,
  `[1:a]atrim=0:${D},volume=0.72[mus]`,
  `[mus][key]sidechaincompress=threshold=0.05:ratio=5:attack=12:release=380:makeup=1[duck]`,
  `[voice][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]`,
];
fs.mkdirSync('public/short', { recursive: true });
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', '../voice/out-short/voiceover.wav', '-i', 'audio/out-short/score.wav', '-filter_complex', f.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', 'public/short/soundtrack.wav'], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`soundtrack: public/short/soundtrack.wav (${D.toFixed(2)}s)`);
