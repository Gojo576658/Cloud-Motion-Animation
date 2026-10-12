// Builds src/bfs/timeline.json for the Blue Friday Short (9:16) from voice/out-bfs (timing + Whisper words).
import fs from 'node:fs';
const OFFSET = 0.1, TAIL = 0.6, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-bfs/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-bfs/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const scenes = [0, 1, 2, 3].map((s) => { const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1); return { index: s, title: `beat ${s}`, start: s ? +(first.start - 0.15).toFixed(3) : 0, end: next ? +(next.start - 0.15).toFixed(3) : duration }; });
const plan = [['network', 0, 84], ['mystery', C0(2) - 0.15, 100], ['drop', C0(4) - 0.05, 84], ['hack', C0(4) + 0.6, 84], ['bright', C0(6) - 0.15, 100]];
const sections = plan.map(([mood, start, bpm], k) => ({ index: k, title: mood, mood, bpm, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const out = { fps: FPS, offset: OFFSET, duration, bpm: 84, scenes, sections, cues, hooks: [], words: W, events: [{ t: C0(4), type: 'impact' }] };
fs.writeFileSync('src/bfs/timeline.json', JSON.stringify(out, null, 1));
console.log('duration', duration, 'frames', Math.ceil(duration * FPS)); scenes.forEach((s) => console.log(s.title, s.start, s.end));
