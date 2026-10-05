// Builds src/timeline.json from the real voiceover timing (voice/out/timing.json).
// Everything in the video (visuals, music, SFX) is placed on this one clock.
import fs from 'node:fs';
const voice = JSON.parse(fs.readFileSync('../voice/out/timing.json', 'utf8'));
const script = JSON.parse(fs.readFileSync('../animation/src/cues.json', 'utf8'));
const OFFSET = 0.8;   // music/visual lead-in before the first word
const TAIL = 3.2;     // end card hold after the last word
// extra breathing room inserted after a paragraph (seconds), e.g. for the title sting
const PAUSES = { 3: 2.6 };
const MOODS = ['open', 'invest', 'inside', 'audio', 'network', 'hack', 'calm', 'history', 'money', 'fix'];

let shift = OFFSET;
const cues = voice.cues.map((c) => {
  const s = script.cues[c.id];
  const out = { id: c.id, section: c.section, start: +(c.start + shift).toFixed(3), end: +(c.end + shift).toFixed(3), vStart: c.start, vEnd: c.end, hooks: s.hooks, text: c.text };
  shift += PAUSES[c.id] || 0;
  return out;
});
const duration = +(voice.duration + shift + TAIL).toFixed(3);
const sections = script.sections.map((s, i) => {
  const first = cues.find((c) => c.section === i);
  const next = cues.find((c) => c.section === i + 1);
  return { index: i, title: s.title, mood: MOODS[i], start: i === 0 ? 0 : +(first.start - 0.25).toFixed(3), end: next ? +(next.start - 0.25).toFixed(3) : duration };
});
const hooks = cues.filter((c) => c.hooks.length).map((c) => c.start);
// word-level timing from Whisper (voice/out/words.json), moved onto the timeline clock
const words = fs.existsSync('../voice/out/words.json') ? JSON.parse(fs.readFileSync('../voice/out/words.json', 'utf8')).map((w) => {
  const c = cues[w.cue];
  return { c: w.cue, i: w.i, w: w.word, s: +(c.start + (w.start - c.vStart)).toFixed(3), e: +(c.start + (w.end - c.vStart)).toFixed(3) };
}) : [];
const titleAt = +(cues[3].end + 0.35).toFixed(3);
const tl = { fps: 30, offset: OFFSET, duration, titleAt, sections, cues, hooks, words, events: [{ t: titleAt, type: 'title' }] };
fs.writeFileSync('src/timeline.json', JSON.stringify(tl, null, 1));
console.log(`duration ${duration}s (${Math.floor(duration / 60)}:${(duration % 60).toFixed(1)}), ${cues.length} cues, ${hooks.length} hook paragraphs`);
for (const s of sections) console.log(s.index, s.mood.padEnd(8), s.start.toFixed(1), '->', s.end.toFixed(1), s.title);
