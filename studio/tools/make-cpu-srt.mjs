// Word-timed SRT captions for "The Cursed CPU" -> deliverables/Cursed-CPU.en.srt
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('src/cpu/timeline.json', 'utf8'));
const fmt = (s) => { const ms = Math.round(s * 1000); return [Math.floor(ms / 3600000), Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60].map((x) => String(x).padStart(2, '0')).join(':') + ',' + String(ms % 1000).padStart(3, '0'); };
// clean word timings: Whisper sometimes misplaces a word (later than the next one) or gives it zero length
const words = t.words.map((w) => ({ ...w }));
words.forEach((w, k) => {
  const p = words[k - 1], n = words[k + 1];
  if (n && w.s > n.s) { w.s = Math.max(p ? p.e : 0, n.s - 0.75); w.e = n.s - 0.02; }
  if (p && w.s < p.e) w.s = p.e;
  if (w.e < w.s) w.e = w.s;
});
const cues = []; let cur = null;
words.forEach((w, k) => {
  const p = words[k - 1], len = cur ? (cur.text + ' ' + w.w).length : 0;
  const tooLong = len > 42 && !(/[.?!…]$/.test(w.w) && len <= 54);
  const brk = !cur || tooLong || (p && /[.?!…]$/.test(p.w)) || (p && w.s - p.e > 0.6) || (p && /,$/.test(p.w) && cur.text.length > 24);
  if (brk) { cur = { s: w.s, e: w.e, text: w.w }; cues.push(cur); } else { cur.text += ' ' + w.w; cur.e = w.e; }
});
cues.forEach((c, i) => { const n = cues[i + 1]; c.e = Math.max(c.s + 0.3, Math.min(c.e + 0.5, n ? n.s - 0.02 : c.e + 0.5)); if (n && n.s < c.e) n.s = c.e; });
// every caption must start before it ends and not overlap the next one
cues.forEach((c, i) => { if (!(c.e > c.s) || (cues[i + 1] && cues[i + 1].s < c.e)) throw new Error(`bad timing at caption ${i + 1}`); });
fs.writeFileSync('../deliverables/Cursed-CPU.en.srt', cues.map((c, i) => `${i + 1}\n${fmt(c.s)} --> ${fmt(c.e)}\n${c.text}\n`).join('\n'));
console.log(`${cues.length} captions -> deliverables/Cursed-CPU.en.srt`);
