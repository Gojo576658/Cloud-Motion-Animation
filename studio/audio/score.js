// Original background score + sound design, composed in code with Tone.js and rendered offline.
// Input: timeline { duration, sections:[{start,end,mood}], hooks:[t], events:[{t,type}] }
// Output: stereo AudioBuffer. Everything is scheduled in absolute seconds.
/* global Tone */

const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// D minor world. Each chord lasts 2 bars.
const PROG = {
  dark: [['D2', 'A2', 'C3', 'E3', 'F3'], ['Bb1', 'F2', 'A2', 'D3'], ['F2', 'C3', 'E3', 'A3'], ['C2', 'G2', 'D3', 'E3']],
  tense: [['D2', 'A2', 'D3', 'F3'], ['Eb2', 'Bb2', 'D3', 'G3'], ['D2', 'A2', 'C3', 'F3'], ['C2', 'G2', 'Bb2', 'Eb3']],
  bright: [['F2', 'C3', 'E3', 'A3'], ['C2', 'G2', 'D3', 'E3'], ['D2', 'A2', 'C3', 'F3'], ['Bb1', 'F2', 'A2', 'D3']],
};
// mood per section: [progression, pad, pulse, arp, hats, kick, heartbeat]
const MOODS = {
  open:    ['dark', 1, 0, 0, 0, 0, 1],
  invest:  ['dark', 1, 1, 0, 0, 0, 0],
  inside:  ['dark', 1, 0, 1, 0, 0, 0],
  audio:   ['tense', 1, 1, 0, 1, 0, 0],
  network: ['tense', 1, 1, 1, 1, 1, 0],
  hack:    ['tense', 0.8, 1, 1, 1, 1, 0],
  calm:    ['dark', 1, 0, 0, 0, 0, 0],
  history: ['dark', 1, 1, 0, 0, 1, 0],
  money:   ['tense', 1, 1, 1, 1, 0, 0],
  fix:     ['bright', 1, 1, 1, 0, 1, 0],
};

const up = (n, semis) => Tone.Frequency(n).transpose(semis).toNote();

export async function compose(tl) {
  const D = tl.duration;
  return Tone.Offline(() => {
    // ---------------- buses
    const master = new Tone.Compressor({ threshold: -16, ratio: 3, attack: 0.02, release: 0.3 }).toDestination();
    const limiter = new Tone.Limiter(-1).connect(master);
    const verb = new Tone.Reverb({ decay: 7, wet: 1, preDelay: 0.03 }).connect(limiter);
    const verbSend = new Tone.Gain(1).connect(verb);
    const dry = new Tone.Gain(1).connect(limiter);
    const send = (node, wet) => { const d = new Tone.Gain(1 - wet).connect(dry); const w = new Tone.Gain(wet).connect(verbSend); node.connect(d); node.connect(w); return node; };

    // ---------------- instruments
    const padFilter = new Tone.Filter({ type: 'lowpass', frequency: 900, Q: 0.6 });
    send(padFilter, 0.55);
    const pad = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fatsawtooth', count: 3, spread: 28 }, envelope: { attack: 2.2, decay: 1, sustain: 0.8, release: 4 }, volume: -26 }).connect(padFilter);
    const padLfo = new Tone.LFO({ frequency: 0.05, min: 500, max: 1500 }).connect(padFilter.frequency).start(0);
    void padLfo;
    const drone = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 4, decay: 0, sustain: 1, release: 6 }, volume: -20 });
    send(drone, 0.2);
    const bassFilter = new Tone.Filter({ type: 'lowpass', frequency: 420, Q: 2 });
    send(bassFilter, 0.1);
    const bassDist = new Tone.Distortion(0.25).connect(bassFilter);
    const bass = new Tone.MonoSynth({ oscillator: { type: 'sawtooth' }, filter: { Q: 1, type: 'lowpass' }, filterEnvelope: { attack: 0.005, decay: 0.15, sustain: 0.2, release: 0.2, baseFrequency: 80, octaves: 2.6 }, envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.15 }, volume: -17 }).connect(bassDist);
    const arpDelay = new Tone.FeedbackDelay({ delayTime: BEAT * 0.75, feedback: 0.35, wet: 0.3 });
    send(arpDelay, 0.45);
    const arp = new Tone.FMSynth({ harmonicity: 2, modulationIndex: 6, envelope: { attack: 0.003, decay: 0.18, sustain: 0, release: 0.2 }, modulationEnvelope: { attack: 0.002, decay: 0.12, sustain: 0, release: 0.1 }, volume: -25 }).connect(arpDelay);
    const kick = new Tone.MembraneSynth({ pitchDecay: 0.04, octaves: 6, envelope: { attack: 0.001, decay: 0.45, sustain: 0, release: 0.2 }, volume: -12 });
    send(kick, 0.08);
    const hatFilter = new Tone.Filter({ type: 'highpass', frequency: 7000 });
    send(hatFilter, 0.2);
    const hat = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0 }, volume: -30 }).connect(hatFilter);
    const heart = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 3, envelope: { attack: 0.002, decay: 0.3, sustain: 0, release: 0.1 }, volume: -14 });
    send(heart, 0.25);

    const keysVerb = new Tone.Filter({ type: 'lowpass', frequency: 3200 });
    send(keysVerb, 0.5);
    const keys = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.004, decay: 1.4, sustain: 0.05, release: 1.6 }, volume: -24 }).connect(keysVerb);

    // ---------------- SFX
    const boom = new Tone.MembraneSynth({ pitchDecay: 0.25, octaves: 5, envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1 }, volume: -8 });
    send(boom, 0.45);
    const riseFilter = new Tone.Filter({ type: 'bandpass', frequency: 300, Q: 1.2 });
    send(riseFilter, 0.6);
    const riser = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 1.2, decay: 0.05, sustain: 1, release: 0.15 }, volume: -22 }).connect(riseFilter);
    const whooshFilter = new Tone.Filter({ type: 'bandpass', frequency: 800, Q: 0.9 });
    send(whooshFilter, 0.35);
    const whoosh = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.12, decay: 0.35, sustain: 0, release: 0.1 }, volume: -18 }).connect(whooshFilter);
    const ping = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 10, envelope: { attack: 0.001, decay: 1.2, sustain: 0, release: 1 }, volume: -26 });
    send(ping, 0.6);
    const click = new Tone.MembraneSynth({ pitchDecay: 0.005, octaves: 2, envelope: { attack: 0.001, decay: 0.03, sustain: 0 }, volume: -24 });
    send(click, 0.15);
    const glitchFilter = new Tone.Filter({ type: 'bandpass', frequency: 2500, Q: 4 });
    send(glitchFilter, 0.1);
    const glitch = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.03, sustain: 0 }, volume: -20 }).connect(glitchFilter);
    const beep = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.05 }, volume: -30 });
    send(beep, 0.3);

    // Tone needs each instrument's notes in time order, so queue everything and play it sorted
    const Q = [];
    const T = (inst, ...a) => { const ti = inst instanceof Tone.NoiseSynth ? 1 : 2; Q.push([a[ti], () => inst.triggerAttackRelease(...a)]); };
    const A = (time, fn) => Q.push([time, fn]);

    // ---------------- music, section by section
    const rnd = (() => { let s = 7; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
    tl.sections.forEach((sec) => {
      const [prog, padOn, pulseOn, arpOn, hatsOn, kickOn, heartOn] = MOODS[sec.mood];
      const chords = PROG[prog];
      const s0 = sec.start, s1 = sec.end;
      // chords every 2 bars, aligned to the section start
      for (let t = s0, k = 0; t < s1 - 0.5; t += BAR * 2, k++) {
        const ch = chords[k % chords.length];
        const len = Math.min(BAR * 2, s1 - t) + 0.3;
        if (padOn) T(pad, ch.slice(1).map((n) => up(n, 12)), len, t, 0.55 * padOn);
        if (sec.index === 0 || prog === 'dark') T(drone, ch[0], len, t, 0.6);
        // 8th-note bass pulse
        if (pulseOn) for (let b = 0; b < 16; b++) {
          const tt = t + b * BEAT / 2;
          if (tt >= s1 - 0.1) break;
          T(bass, up(ch[0], b % 8 === 7 ? 12 : 0), BEAT * 0.4, tt, b % 4 === 0 ? 1 : 0.6);
        }
        // 16th arpeggio over chord tones
        if (arpOn) {
          const notes = ch.slice(1).map((n) => up(n, 24));
          for (let b = 0; b < 32; b++) {
            const tt = t + b * BEAT / 4;
            if (tt >= s1 - 0.1) break;
            if (sec.mood === 'inside' && b % 2) continue; // sparser, more mysterious
            T(arp, notes[(b * 3 + Math.floor(b / 8)) % notes.length], BEAT / 4, tt, 0.4 + 0.3 * rnd());
          }
        }
        // sparse piano motif (reflective sections)
        if (['calm', 'history', 'fix', 'open'].includes(sec.mood)) {
          const tones = ch.slice(1).map((n) => up(n, 24));
          [[0, 0], [1.5, 2], [3, 1], [5, 3], [6.5, 2]].forEach(([beat, ni]) => {
            const tt = t + beat * BEAT;
            if (tt < s1 - 0.4 && tt > s0 + (sec.index === 0 ? 4 : 0)) T(keys, tones[ni % tones.length], BEAT * 1.5, tt, 0.35 + 0.15 * rnd());
          });
        }
        for (let b = 0; b < 8; b++) {
          const tt = t + b * BEAT;
          if (tt >= s1 - 0.1) break;
          if (kickOn && (b % 2 === 0)) T(kick, 'D1', '8n', tt, 0.8);
          if (hatsOn) { T(hat, 0.04, tt + BEAT / 2, 0.6); if (sec.mood === 'hack') T(hat, 0.03, tt + BEAT / 4 * 3, 0.35); }
          if (heartOn && b % 2 === 0) { T(heart, 'A0', '16n', tt, 0.9); T(heart, 'A0', '16n', tt + 0.22, 0.55); }
        }
      }
      // section hits (risers, booms, whooshes) live in the picture's SFX layer, not here
    });


    // extra events from the picture (text pops, glitches, beeps, impacts)
    for (const e of tl.events || []) {
      if (e.type === 'click') T(click, 'C5', '32n', e.t, 0.6);
      if (e.type === 'whoosh') { T(whoosh, 0.4, e.t, 0.6); }
      if (e.type === 'glitch') for (let i = 0; i < 6; i++) T(glitch, 0.02, e.t + i * 0.055, 0.5 + 0.5 * rnd());
      if (e.type === 'beep') T(beep, e.note || 'A5', 0.06, e.t, 0.6);
      if (e.type === 'impact') T(boom, 'D1', 1.2, e.t, 1);
      if (e.type === 'title') T(ping, 'A5', 2, e.t, 0.6);
    }

    // ending: final chord and long tail
    if (tl.final) T(pad, ['D3', 'A3', 'E4', 'F4'], 5, D - 5, 0.5);
    Q.sort((a, b) => a[0] - b[0]).forEach(([, fn]) => fn());
  }, D + 4, 2, 44100);
}

export function toWav(buffer) {
  const ch = [buffer.getChannelData(0), buffer.getChannelData(1)];
  const n = ch[0].length, sr = buffer.sampleRate;
  const out = new DataView(new ArrayBuffer(44 + n * 4));
  const ws = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, sr, true);
  out.setUint32(28, sr * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); ws(36, 'data'); out.setUint32(40, n * 4, true);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) { const v = Math.max(-1, Math.min(1, ch[c][i])); out.setInt16(o, v * 32767, true); o += 2; }
  return new Uint8Array(out.buffer);
}
