// "Fridge Hack" (1920×1080): 8 acts joined by hard cuts and lens push-throughs, the cinematic camera,
// chapter cards, captions, film look, soundtrack and the SFX layer.
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { Captions } from '../components/Captions';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp } from '../lib/time';
import { TTL } from './ttime';
import { A0, A1, A2, A3, a0Sfx, a1Sfx, a2Sfx, a3Sfx, a0NoCaptions, a1NoCaptions, a2NoCaptions, a3NoCaptions } from './A0123';
import { A4, A5, A6, A7, a4Sfx, a5Sfx, a6Sfx, a7Sfx, a4NoCaptions, a5NoCaptions, a6NoCaptions, a7NoCaptions } from './A4567';
import { Kinetic, Mono } from '../tg/kit';
import { A as B } from './kit';
import { fonts } from '../tg/type';
import { rng, clamp } from '../lib/time';

type Enter = 'cut' | 'push';
type Def = { comp: React.FC; enter: Enter; sfx: SfxEvent[]; hide: [number, number][] };
const DEFS: Def[] = [
  { comp: A0, enter: 'cut', sfx: a0Sfx, hide: a0NoCaptions },
  { comp: A1, enter: 'cut', sfx: a1Sfx, hide: a1NoCaptions },
  { comp: A2, enter: 'push', sfx: a2Sfx, hide: a2NoCaptions },
  { comp: A3, enter: 'push', sfx: a3Sfx, hide: a3NoCaptions },
  { comp: A4, enter: 'cut', sfx: a4Sfx, hide: a4NoCaptions },
  { comp: A5, enter: 'push', sfx: a5Sfx, hide: a5NoCaptions },
  { comp: A6, enter: 'cut', sfx: a6Sfx, hide: a6NoCaptions },
  { comp: A7, enter: 'push', sfx: a7Sfx, hide: a7NoCaptions },
];
const ACTS = DEFS.map((d, i) => ({ ...d, start: TTL.scenes[i].start, end: TTL.scenes[i].end }));
const transitionSfx: SfxEvent[] = ACTS.slice(1).flatMap((a): SfxEvent[] => (a.enter === 'push' ? [{ t: a.start - 0.35, name: 'whooshDeep', vol: 0.4 }, { t: a.start, name: 'bassHit', vol: 0.3 }] : []));
const SFX = [...transitionSfx, ...ACTS.flatMap((a) => a.sfx)];
const HIDE: [number, number][] = [...ACTS.flatMap((a) => a.hide), ...ACTS.slice(1).map((a) => [a.start - 0.25, a.start + 0.3] as [number, number])];
const KEY_RED = /^(fifty|ovens?|hackers?|attack|attacked|defrost|ruined|fires|heat|hot|nobody|old)$/i;
const KEY_CYAN = /^(vio|fridges?|freezers?|controller|danfoss|france|internet|box)$/i;


// ---- cinematic camera: one continuous move per spoken line (alternating push-in / pull-out, lateral
// truck, a few degrees of yaw and tilt on a 2400px lens), punch-ins on the dramatic beats, a settle on
// every hard cut, and handheld drift in the tense sections. Overscan >= 1.08 keeps the frame edges hidden.
const CUES = TTL.cues;
const KEYS = CUES.map((c, i) => {
  const r = rng(101 + i * 7);
  const a = r(), b = r(), d = r(), e = r(), g = r();
  return { t: c.start, s: (i % 2 ? 1.11 : 1.06) + a * 0.02, x: (b - 0.5) * 66, y: (d - 0.5) * 34, ry: (e - 0.5) * 4.6, rx: (g - 0.5) * 2.4, rz: (r() - 0.5) * 1.1 };
});
KEYS.push({ ...KEYS[KEYS.length - 1], t: TTL.duration + 1 });
const PUNCH = [2, 4, 12, 22, 31, 34, 37, 42];
const SHAKY = ['drop', 'sad', 'invest', 'mystery', 'twist', 'hack'];
const ease = EASE.inOut;
const camera = (t: number) => {
  let k = 0;
  while (k < KEYS.length - 2 && t >= KEYS[k + 1].t) k++;
  const A = KEYS[k], B = KEYS[k + 1];
  const u = t < A.t ? 0 : ease(clamp((t - A.t) / Math.max(0.5, B.t - A.t)));
  const L = (p: 's' | 'x' | 'y' | 'ry' | 'rx' | 'rz') => A[p] + (B[p] - A[p]) * u;
  let s = L('s'), x = L('x'), y = L('y');
  for (const i of PUNCH) { const c = CUES[i]; s += 0.07 * ramp(t, c.start - 0.06, 0.32, EASE.out) * (1 - ramp(t, c.end + 0.15, 0.7, EASE.inOut)); }
  for (const a of ACTS.slice(1)) if (a.enter === 'cut') { const v = 1 - ramp(t, a.start, 1.1, EASE.out); if (t >= a.start && v > 0) { s += 0.09 * v; x -= 46 * v; } }
  const sec = TTL.sections.find((q) => t >= q.start && t < q.end);
  const shake = sec && SHAKY.includes(sec.mood) ? Math.min(1, (t - sec.start) * 2, (sec.end - t) * 2) : 0;
  x += shake * (Math.sin(t * 1.31) * 6 + Math.sin(t * 2.87 + 1.3) * 3.5);
  y += shake * (Math.sin(t * 1.07 + 0.6) * 4.5 + Math.sin(t * 3.3) * 2.5);
  const rz = L('rz') + shake * Math.sin(t * 1.63) * 0.3;
  return `perspective(2400px) translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotateX(${L('rx').toFixed(3)}deg) rotateY(${L('ry').toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${s.toFixed(4)})`;
};

// ---- chapter cards (Zyvavo type): mono index + a tight headline with one italic serif word
const CHAPTERS: [string, string, string][] = [['', '', ''], ['01', 'The', 'brain'], ['02', 'The open', 'door'], ['03', 'How they', 'got in'], ['04', 'The', 'night'], ['05', 'How', 'big'], ['06', 'It happened', 'before'], ['07', 'Your', 'turn']];
const Chapter: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const at = ACTS[i].start + 0.35, out = at + 2.4;
  if (t < at - 0.1 || t > out + 0.6) return null;
  const [n, a, b] = CHAPTERS[i];
  const line = ramp(t, at, 0.6, EASE.out) * (1 - ramp(t, out, 0.35, EASE.in));
  return (
    <div style={{ position: 'absolute', left: 96, top: 74 }}>
      <div style={{ position: 'absolute', left: -96, top: -74, width: 900, height: 300, background: 'radial-gradient(ellipse at 22% 32%, rgba(3,5,11,.94) 30%, transparent 72%)', opacity: line }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, opacity: line }}>
        <Mono size={22} color={B.red}>CHAPTER {n}</Mono>
        <div style={{ width: 160 * line, height: 2, background: 'rgba(242,245,249,.5)' }} />
      </div>
      <div style={{ position: 'relative', marginTop: 10 }}><Kinetic at={at + 0.08} out={out} size={66} stagger={0.06} align="left" words={[...a.split(' ').map((w) => ({ w })), ...b.split(' ').map((w) => ({ w, serif: true }))]} /></div>
    </div>
  );
};

// lens push-through: the outgoing act rushes into the center, the incoming act settles from a slight zoom
const Frame: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = ACTS[i], next = ACTS[i + 1];
  let tf = '', op = 1, blur = 0;
  if (i > 0 && a.enter === 'push' && t < a.start + 0.5) { const u = ramp(t, a.start - 0.05, 0.5, EASE.out); tf += `scale(${1.25 - 0.25 * u})`; blur += (1 - u) * 18; op *= Math.min(1, u * 2); }
  if (next && next.enter === 'push' && t > next.start - 0.45) { const u = ramp(t, next.start - 0.4, 0.4, EASE.in); tf += ` scale(${1 + 1.4 * u})`; blur += u * 24; op *= 1 - u * 0.85; }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const FridgeHack: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      <AbsoluteFill style={{ transform: camera(t), transformOrigin: '50% 50%' }}>
      {ACTS.map((a, i) => {
        const next = ACTS[i + 1];
        const from = i && a.enter === 'push' ? a.start - 0.05 : a.start, to = next ? next.start + (next.enter === 'push' ? 0 : 0) : TTL.duration + 1;
        if (t < from || t >= to) return null;
        const Comp = a.comp;
        return <Frame key={i} i={i}><Comp /></Frame>;
      })}
      </AbsoluteFill>
      {ACTS.map((_, i) => (i ? <Chapter key={i} i={i} t={t} /> : null))}
      <Captions words={TTL.words} hide={HIDE} keyRed={KEY_RED} keyCyan={KEY_CYAN} font={fonts.head} serifKeys />
      <AbsoluteFill style={{ background: '#000', opacity: ramp(t, TTL.duration - 1.3, 1.2, EASE.in) }} />
      <FilmLook vignette={0.55} grain={0.07} />
      <Audio src={staticFile('fh/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
