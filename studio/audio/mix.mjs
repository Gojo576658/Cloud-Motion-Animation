// Final soundtrack: voice paragraphs placed on the timeline, music ducked under the voice,
// loudness-normalised for YouTube (-14 LUFS).  node audio/mix.mjs [--to seconds]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const tl = JSON.parse(fs.readFileSync('src/timeline.json', 'utf8'));
const toArg = process.argv.indexOf('--to');
const to = toArg > 0 ? +process.argv[toArg + 1] : tl.duration;
const cues = tl.cues.filter((c) => c.start < to);
const f = [];
cues.forEach((c, i) => {
  f.push(`[0:a]atrim=start=${c.vStart}:end=${c.vEnd},asetpts=PTS-STARTPTS,adelay=${Math.round(c.start * 1000)}:all=1[v${i}]`);
});
f.push(`${cues.map((_, i) => `[v${i}]`).join('')}amix=inputs=${cues.length}:normalize=0,apad,atrim=0:${to},loudnorm=I=-16:TP=-1.5:LRA=11,asplit=2[voice][key]`);
f.push(`[1:a]atrim=0:${to},volume=0.55[mus]`);
f.push(`[mus][key]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=450:makeup=1[duck]`);
f.push(`[voice][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000[out]`);
const args = ['-y', '-loglevel', 'error', '-i', '../voice/out/voiceover.wav', '-i', 'audio/out/score.wav', '-filter_complex', f.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', 'public/soundtrack.wav'];
const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
if (r.status) process.exit(r.status);
console.log(`soundtrack: public/soundtrack.wav (${to.toFixed(1)}s)`);
