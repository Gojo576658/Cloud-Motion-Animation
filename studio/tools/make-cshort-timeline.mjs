// Builds src/cshort/timeline.json for the Cursed CPU Short from voice/out-cshort (timing + Whisper words).
// Video time = voice time + OFFSET. A tiny tail so the last line ("So remember:") loops into the first.
import fs from 'node:fs';
const OFFSET = 0.15, TAIL = 0.35, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-cshort/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-cshort/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, voice: c.voice, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), vStart: c.start, vEnd: c.end, text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const P = (ci, word) => W.find((w) => w.c === ci && w.w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(word)).s;
// 10 beats, each starts a touch before its first line
const beats = Array.from({ length: 10 }, (_, s) => { const first = cues.find((c) => c.section === s); return s === 0 ? 0 : +(first.start - 0.15).toFixed(3); });
const plan = [
  ['mystery', 0], ['sneaky', beats[1]], ['twist', beats[2]], ['sneaky', beats[3]], ['drop', C1(5) + 0.05], ['playful', beats[4]],
  ['drop', P(7, 'kicked') - 0.1], ['sad', beats[5]], ['warm', beats[6]], ['tech', beats[7]], ['bright', beats[8]], ['twist', C0(13) - 0.1], ['playful', beats[9]],
];
const sections = plan.map(([mood, start], k) => ({ index: k, title: mood, mood, start: +start.toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [{ t: P(7, 'kicked'), type: 'dundun' }];
const out = { fps: FPS, offset: OFFSET, duration, bpm: 100, loop: true, beats, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/cshort/timeline.json', JSON.stringify(out, null, 1));
beats.forEach((b, i) => console.log('beat', i, b.toFixed(2)));
for (const s of sections) console.log('music', s.mood.padEnd(8), s.start.toFixed(2), '->', s.end.toFixed(2));
console.log('duration', duration, 'frames', Math.ceil(duration * FPS));
