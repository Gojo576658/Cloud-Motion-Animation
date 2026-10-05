// Parses the script and assigns every narration paragraph a start/end time,
// spreading each section's duration across its paragraphs by word count.
import fs from 'node:fs';

const md = fs.readFileSync(new URL('../../scripts/smart-tv-listening/script.md', import.meta.url), 'utf8');
const toSec = (s) => { const [m, x] = s.split(':').map(Number); return m * 60 + x; };

const sections = [];
let cur = null;
for (const line of md.split('\n')) {
  const h = line.match(/^## (\d+:\d+) – (\d+:\d+) · (.+)$/);
  if (h) { cur = { start: toSec(h[1]), end: toSec(h[2]), title: h[3], paras: [] }; sections.push(cur); continue; }
  if (line.startsWith('## ')) { cur = null; continue; }
  if (!cur || !line.trim() || line.startsWith('🎬') || line.startsWith('---')) continue;
  cur.paras.push(line.trim());
}

const cues = [];
sections.forEach((s, si) => {
  const words = s.paras.map((p) => p.replace(/\[HOOK \d+\]/g, '').trim().split(/\s+/).length);
  const total = words.reduce((a, b) => a + b, 0);
  let t = s.start;
  s.paras.forEach((p, i) => {
    const d = ((s.end - s.start) * words[i]) / total;
    const hooks = [...p.matchAll(/\[HOOK (\d+)\]/g)].map((m) => +m[1]);
    cues.push({ id: cues.length, section: si, start: +t.toFixed(2), end: +(t + d).toFixed(2), hooks, text: p.replace(/\[HOOK \d+\]\s*/g, '') });
    t += d;
  });
});

fs.writeFileSync(new URL('../src/cues.json', import.meta.url), JSON.stringify({ sections: sections.map(({ paras, ...s }) => s), cues }, null, 1));
for (const c of cues) console.log(String(c.id).padStart(2), c.start.toFixed(1).padStart(6), c.end.toFixed(1).padStart(6), c.hooks.join(','), '|', c.text.slice(0, 70));
