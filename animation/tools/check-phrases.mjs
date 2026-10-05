import fs from 'node:fs';
const { cues } = JSON.parse(fs.readFileSync('src/cues.json'));
const src = fs.readFileSync('src/scenes.js', 'utf8');
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
let bad = 0;
for (const m of src.matchAll(/P\((\d+),\s*(['"])(.*?)\2/g)) {
  const w = norm(cues[+m[1]].text), q = norm(m[3]);
  let ok = false;
  for (let k = 0; k <= w.length - q.length; k++) if (q.every((x, j) => w[k + j] === x)) { ok = true; break; }
  if (!ok) { bad++; console.log('MISSING', m[1], JSON.stringify(m[3]), '|', cues[+m[1]].text.slice(0, 120)); }
}
console.log(bad ? `${bad} missing` : 'all phrases found');
