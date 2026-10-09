// Builds src/cpu/timeline.json for "The Cursed CPU" from voice/out-cpu (timing + Whisper words).
// scenes = the 7 story sections (for Remotion); sections = music sections with moods (for the score).
import fs from 'node:fs';
const OFFSET = 0.6, TAIL = 3.4, FPS = 30;
const v = JSON.parse(fs.readFileSync('../voice/out-cpu/timing.json', 'utf8'));
const words = JSON.parse(fs.readFileSync('../voice/out-cpu/words.json', 'utf8'));
const cues = v.cues.map((c) => ({ id: c.id, section: c.section, start: +(c.start + OFFSET).toFixed(3), end: +(c.end + OFFSET).toFixed(3), vStart: c.start, vEnd: c.end, text: c.text }));
const duration = +(v.duration + OFFSET + TAIL).toFixed(3);
const C0 = (i) => cues[i].start, C1 = (i) => cues[i].end;
const W = words.map((w) => ({ c: w.cue, i: w.i, w: w.word, s: +(w.start + OFFSET).toFixed(3), e: +(w.end + OFFSET).toFixed(3) }));
const P = (ci, word) => W.find((w) => w.c === ci && w.w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(word)).s;
const TITLES = ['Cold Open', 'The Deal', 'Flashback', 'How Do You Ban a CPU?', 'Plot Twist', 'The Hurt', 'Outro'];
const scenes = TITLES.map((title, s) => {
  const first = cues.find((c) => c.section === s), next = cues.find((c) => c.section === s + 1);
  return { index: s, title, start: s === 0 ? 0 : +(first.start - 0.35).toFixed(3), end: next ? +(next.start - 0.35).toFixed(3) : duration };
});
// music map: [mood, start]
const plan = [
  ['mystery', 0], ['drop', C0(3) - 0.2], ['mystery', C0(4) - 0.1], ['title', C0(5) + 2.5], ['playful', C0(6) - 0.3],
  ['drop', C0(8) - 0.12], ['playful', C0(9) - 0.1], ['sneaky', C0(17) - 0.2], ['drop', C1(20) - 0.15], ['tech', C0(21) - 0.2],
  ['twist', C0(31) - 0.2], ['sad', C0(37) - 0.3], ['bright', C0(40) - 0.15], ['warm', C0(43) - 0.3],
];
const sections = plan.map(([mood, start], k) => ({ index: k, title: mood, mood, start: +Math.max(0, start).toFixed(3), end: 0 }));
sections.forEach((s, k) => { s.end = k < sections.length - 1 ? sections[k + 1].start : duration; });
const events = [{ t: P(3, 'banned'), type: 'dundun' }, { t: +(C1(5) + 0.75).toFixed(3), type: 'title' }];
const out = { fps: FPS, offset: OFFSET, duration, titleAt: C1(5) + 0.75, bpm: 100, scenes, sections, cues, hooks: [], words: W, events };
fs.writeFileSync('src/cpu/timeline.json', JSON.stringify(out, null, 1));
for (const s of scenes) console.log('scene', s.index, s.start.toFixed(2), '->', s.end.toFixed(2), s.title);
for (const s of sections) console.log('music', s.mood.padEnd(8), s.start.toFixed(2), '->', s.end.toFixed(2));
console.log('duration', duration, '=', Math.floor(duration / 60) + ':' + (duration % 60).toFixed(1), 'frames', Math.ceil(duration * FPS), 'events', JSON.stringify(events));
