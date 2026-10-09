// Comedy score for "The Cursed CPU", composed in code with Tone.js and rendered offline.
// Cartoon palette: pizzicato strings, tuba oom-pah, celesta, a sneaky clarinet, piano and soft
// strings for the sad part, woodblock + shaker for bounce. Same interface as score.js.
// Input: timeline { duration, bpm, sections:[{start,end,mood}], events:[{t,type}], final }
/* global Tone */
export { toWav } from './score.js';

let BEAT = 60 / 100;
let BAR = BEAT * 4;
const up = (n, s) => Tone.Frequency(n).transpose(s).toNote();

// chords: [bass root, ...upper tones]; each lasts 2 bars
const PROG = {
  major: [['C2', 'C3', 'E3', 'G3'], ['A1', 'A2', 'C3', 'E3'], ['F1', 'F2', 'A2', 'C3'], ['G1', 'G2', 'B2', 'D3']],
  minor: [['A1', 'A2', 'C3', 'E3'], ['F1', 'F2', 'A2', 'C3'], ['D2', 'D3', 'F3', 'A3'], ['E2', 'E3', 'G#3', 'B3']],
  sneak: [['A1', 'A2', 'C3', 'E3'], ['A1', 'A2', 'C3', 'F3'], ['D2', 'D3', 'F3', 'A3'], ['E2', 'E3', 'G#3', 'D3']],
  sad: [['A1', 'A2', 'C3', 'E3'], ['F1', 'F2', 'A2', 'C3'], ['C2', 'C3', 'E3', 'G3'], ['G1', 'G2', 'B2', 'D3']],
};
// mood: [prog, tuba, pizz, celesta, clarinet, piano, strings, perc]
const MOODS = {
  mystery: ['minor', 0, 1, 1, 0, 0, 0.6, 0],
  title:   ['minor', 1, 1, 0, 0, 0, 1, 1],
  playful: ['major', 1, 1, 1, 0, 0, 0, 1],
  sneaky:  ['sneak', 0, 1, 0, 1, 0, 0, 0],
  tech:    ['major', 1, 1, 0.6, 0, 0, 0.4, 1],
  twist:   ['minor', 1, 1, 0, 1, 0, 0.5, 1],
  sad:     ['sad', 0, 0, 0, 0, 1, 1, 0],
  bright:  ['major', 1, 1, 1, 0, 1, 0.4, 1],
  warm:    ['major', 0, 0.6, 1, 0, 1, 0.8, 0],
  drop:    ['major', 0, 0, 0, 0, 0, 0, 0],
};

export async function compose(tl) {
  const D = tl.duration;
  BEAT = 60 / (tl.bpm || 100); BAR = BEAT * 4;
  return Tone.Offline(() => {
    // ---------------- buses
    const master = new Tone.Compressor({ threshold: -16, ratio: 3, attack: 0.02, release: 0.3 }).toDestination();
    const limiter = new Tone.Limiter(-1).connect(master);
    const verb = new Tone.Reverb({ decay: 3.2, wet: 1, preDelay: 0.02 }).connect(limiter);
    const dry = new Tone.Gain(1).connect(limiter);
    const send = (node, wet) => { node.connect(new Tone.Gain(1 - wet).connect(dry)); node.connect(new Tone.Gain(wet).connect(verb)); return node; };

    // ---------------- instruments
    const pizzF = new Tone.Filter({ type: 'lowpass', frequency: 2400, Q: 0.7 }); send(pizzF, 0.3);
    const pizz = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.002, decay: 0.16, sustain: 0, release: 0.12 }, volume: -15 }).connect(pizzF);
    const tubaF = new Tone.Filter({ type: 'lowpass', frequency: 520, Q: 1 }); send(tubaF, 0.12);
    const tuba = new Tone.MonoSynth({ oscillator: { type: 'sawtooth' }, filter: { type: 'lowpass', Q: 1 }, filterEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.2, baseFrequency: 120, octaves: 2 }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 0.15 }, volume: -15 }).connect(tubaF);
    const cel = new Tone.FMSynth({ harmonicity: 3.5, modulationIndex: 3, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.9, sustain: 0, release: 0.8 }, modulationEnvelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.2 }, volume: -19 });
    send(cel, 0.45);
    const clarF = new Tone.Filter({ type: 'lowpass', frequency: 1700, Q: 0.8 }); send(clarF, 0.3);
    const clar = new Tone.MonoSynth({ oscillator: { type: 'square' }, filter: { type: 'lowpass', Q: 0.5 }, filterEnvelope: { attack: 0.04, decay: 0.2, sustain: 0.6, release: 0.2, baseFrequency: 600, octaves: 1.5 }, envelope: { attack: 0.03, decay: 0.1, sustain: 0.7, release: 0.12 }, volume: -22 }).connect(clarF);
    const vib = new Tone.LFO({ frequency: 5, min: -12, max: 12 }).start(0); vib.connect(clar.detune);
    const pianoF = new Tone.Filter({ type: 'lowpass', frequency: 3000 }); send(pianoF, 0.45);
    const piano = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.004, decay: 1.6, sustain: 0.06, release: 1.8 }, volume: -17 }).connect(pianoF);
    const strF = new Tone.Filter({ type: 'lowpass', frequency: 1300, Q: 0.5 }); send(strF, 0.6);
    const strings = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', count: 3, spread: 22 }, envelope: { attack: 1.4, decay: 0.5, sustain: 0.8, release: 2.5 }, volume: -27 }).connect(strF);
    const block = new Tone.MembraneSynth({ pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.001, decay: 0.06, sustain: 0 }, volume: -24 }); send(block, 0.15);
    const shakeF = new Tone.Filter({ type: 'highpass', frequency: 6000 }); send(shakeF, 0.15);
    const shaker = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.004, decay: 0.05, sustain: 0 }, volume: -33 }).connect(shakeF);
    const kick = new Tone.MembraneSynth({ pitchDecay: 0.04, octaves: 5, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }, volume: -17 }); send(kick, 0.05);
    const timp = new Tone.MembraneSynth({ pitchDecay: 0.12, octaves: 3, envelope: { attack: 0.002, decay: 1.4, sustain: 0, release: 0.6 }, volume: -8 }); send(timp, 0.4);
    const ping = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 8, envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1 }, volume: -20 }); send(ping, 0.6);

    const Q = [];
    const T = (inst, ...a) => { const ti = inst instanceof Tone.NoiseSynth ? 1 : 2; Q.push([a[ti], () => inst.triggerAttackRelease(...a)]); };
    const rnd = (() => { let s = 11; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

    tl.sections.forEach((sec) => {
      const [prog, tubaOn, pizzOn, celOn, clarOn, pianoOn, strOn, percOn] = MOODS[sec.mood] || MOODS.drop;
      const chords = PROG[prog];
      const s0 = sec.start, s1 = sec.end;
      const inSec = (tt, pad = 0.12) => tt >= s0 && tt < s1 - pad;
      for (let t = s0, k = 0; t < s1 - 0.3; t += BAR * 2, k++) {
        const ch = chords[k % chords.length];
        const [root, ...tones] = ch;
        if (strOn) T(strings, tones.map((n) => up(n, 12)), Math.min(BAR * 2, s1 - t) + 0.2, t, 0.5 * strOn);
        for (let b = 0; b < 8; b++) {
          const tt = t + b * BEAT;
          if (!inSec(tt)) break;
          // tuba oom on 1 & 3, alternating root / fifth
          if (tubaOn && b % 2 === 0) T(tuba, b % 4 === 0 ? root : up(root, 7), BEAT * 0.55, tt, b % 4 === 0 ? 0.9 : 0.7);
          // pizzicato: "pah" chords on 2 & 4 (oom-pah), or a creeping staccato line in minor moods
          if (pizzOn) {
            if (prog === 'major') { if (b % 2 === 1) T(pizz, tones.map((n) => up(n, 12)), BEAT * 0.25, tt, 0.6 * pizzOn); }
            else { const line = [0, 3, 7, 3, 12, 7, 3, 0]; T(pizz, up(root, 12 + line[b]), BEAT * 0.2, tt, 0.6 * pizzOn); if (sec.mood === 'sneaky' || sec.mood === 'mystery') T(pizz, up(root, 12 + line[(b + 4) % 8]), BEAT * 0.15, tt + BEAT / 2, 0.35 * pizzOn); }
          }
          if (percOn) {
            if (b % 4 === 0) T(kick, 'C1', '16n', tt, 0.7);
            T(shaker, 0.04, tt + BEAT / 2, 0.5); T(shaker, 0.03, tt, 0.25);
            if (sec.mood === 'playful' && b % 4 === 3) T(block, 'G5', '32n', tt + BEAT / 2, 0.6);
          }
        }
        // celesta: a little 2-bar motif from chord tones + neighbours
        if (celOn) {
          const pool = tones.map((n) => up(n, 24));
          const rhythm = sec.mood === 'mystery' ? [0, 3, 4.5, 6] : [0, 1, 1.5, 2, 4, 5, 5.5, 6.5];
          rhythm.forEach((bt, i) => { const tt = t + bt * BEAT; if (inSec(tt, 0.4)) T(cel, pool[(i + k + (rnd() < 0.3 ? 1 : 0)) % pool.length], BEAT * 0.5, tt, (0.35 + 0.25 * rnd()) * celOn); });
        }
        // clarinet: sneaky tiptoe (staccato chromatic steps), one phrase per 2 bars, rests in between
        if (clarOn) {
          const base = up(root, 24);
          const phrase = [[0, 0], [0.5, 1], [1, 2], [1.5, 3], [2.5, 7], [3, 6], [3.5, 5], [4, 4]];
          if (k % 2 === 0) phrase.forEach(([bt, s]) => { const tt = t + bt * BEAT; if (inSec(tt, 0.3)) T(clar, up(base, s), BEAT * 0.3, tt, 0.7); });
          else T(clar, up(base, 7), BEAT * 1.6, t + BEAT * 2, 0.5);
        }
        // piano: gentle broken chords (sad / warm / bright)
        if (pianoOn) {
          const pt = [root, ...tones].map((n, i) => up(n, i ? 12 : 24));
          const pat = sec.mood === 'sad' ? [[0, 0], [1, 1], [2, 2], [3, 3], [4, 1], [5, 2], [6, 3], [7, 2]] : [[0, 0], [1.5, 2], [2, 3], [4, 1], [5.5, 2], [6, 3]];
          pat.forEach(([bt, ni]) => { const tt = t + bt * BEAT; if (inSec(tt, 0.3)) T(piano, pt[ni], BEAT * 1.4, tt, 0.4 + 0.15 * rnd()); });
          if (sec.mood === 'sad' && k % 2 === 1) T(piano, up(tones[2], 24), BEAT * 3, t + BEAT * 4.5, 0.32); // a falling high note
        }
      }
    });

    for (const e of tl.events || []) {
      if (e.type === 'dundun') { T(timp, 'D1', 1.2, e.t, 1); T(timp, 'C#1', 1.6, e.t + 0.5, 1); T(strings, ['D3', 'F3', 'G#3'], 1.6, e.t + 0.5, 0.7); }
      if (e.type === 'title') { T(timp, 'A0', 1.6, e.t, 1); T(ping, 'E6', 2, e.t, 0.6); T(cel, 'A5', 1, e.t + 0.08, 0.6); }
    }
    if (tl.final) { T(piano, ['C3', 'G3', 'E4', 'C5'], 4.5, D - 4.6, 0.45); T(cel, 'G5', 2, D - 4.4, 0.4); T(strings, ['C3', 'E3', 'G3'], 4.4, D - 4.8, 0.5); }
    Q.sort((a, b) => a[0] - b[0]).forEach(([, fn]) => fn());
  }, D + 4, 2, 44100);
}
