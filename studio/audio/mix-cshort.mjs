// Soundtrack for the Cursed CPU Short: voice (offset into video time) + comedy score ducked under it,
// loudness-normalised (-14 LUFS). Everything is padded 4 s past the end before loudnorm (its
// look-ahead would otherwise swallow the last ~3 s) and trimmed back to the video length after. The score runs a bit hotter than the long video for Shorts energy.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const tl = JSON.parse(fs.readFileSync('src/cshort/timeline.json', 'utf8'));
const D = tl.duration;
const f = [
  `[0:a]adelay=${Math.round(tl.offset * 1000)}:all=1,apad=whole_dur=${D + 4},loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[voice][key]`,
  `[1:a]apad=whole_dur=${D + 4},atrim=0:${D + 4},volume=3.4[mus]`,
  `[mus][key]sidechaincompress=threshold=0.05:ratio=5:attack=12:release=380:makeup=1[duck]`,
  `[voice][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:${D},aresample=48000[out]`,
];
fs.mkdirSync('public/cshort', { recursive: true });
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', '../voice/out-cshort/voiceover.wav', '-i', 'audio/out-cshort/score.wav', '-filter_complex', f.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', 'public/cshort/soundtrack.wav'], { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`soundtrack: public/cshort/soundtrack.wav (${D.toFixed(2)}s)`);
