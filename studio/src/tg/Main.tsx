// "Two Guesses Left" (1920×1080): 9 acts joined by hard cuts and (max 4) lens push-throughs, captions,
// film look, soundtrack and the SFX layer.
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { Captions } from '../components/Captions';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp } from '../lib/time';
import { TTL } from './ttime';
import { A0, A1, a0Sfx, a1Sfx, a0NoCaptions, a1NoCaptions } from './A01';
import { A2, A3, a2Sfx, a3Sfx, a2NoCaptions, a3NoCaptions } from './A23';
import { A4, A5, a4Sfx, a5Sfx, a4NoCaptions, a5NoCaptions } from './A45';
import { A6, A7, A8, a6Sfx, a7Sfx, a8Sfx, a6NoCaptions, a7NoCaptions, a8NoCaptions } from './A678';
import { HUD } from './kit';
import { C0 } from './ttime';

type Enter = 'cut' | 'push';
type Def = { comp: React.FC; enter: Enter; sfx: SfxEvent[]; hide: [number, number][] };
const DEFS: Def[] = [
  { comp: A0, enter: 'cut', sfx: a0Sfx, hide: a0NoCaptions },
  { comp: A1, enter: 'cut', sfx: a1Sfx, hide: a1NoCaptions },
  { comp: A2, enter: 'push', sfx: a2Sfx, hide: a2NoCaptions },
  { comp: A3, enter: 'cut', sfx: a3Sfx, hide: a3NoCaptions },
  { comp: A4, enter: 'cut', sfx: a4Sfx, hide: a4NoCaptions },
  { comp: A5, enter: 'push', sfx: a5Sfx, hide: a5NoCaptions },
  { comp: A6, enter: 'push', sfx: a6Sfx, hide: a6NoCaptions },
  { comp: A7, enter: 'cut', sfx: a7Sfx, hide: a7NoCaptions },
  { comp: A8, enter: 'push', sfx: a8Sfx, hide: a8NoCaptions },
];
const ACTS = DEFS.map((d, i) => ({ ...d, start: TTL.scenes[i].start, end: TTL.scenes[i].end }));
const transitionSfx: SfxEvent[] = ACTS.slice(1).flatMap((a): SfxEvent[] => (a.enter === 'push' ? [{ t: a.start - 0.35, name: 'whooshDeep', vol: 0.4 }, { t: a.start, name: 'bassHit', vol: 0.3 }] : []));
const SFX = [...transitionSfx, ...ACTS.flatMap((a) => a.sfx)];
const HIDE: [number, number][] = [...ACTS.flatMap((a) => a.hide), ...ACTS.slice(1).map((a) => [a.start - 0.25, a.start + 0.3] as [number, number])];
const KEY_RED = /^(guesses|guess|wrong|destroys|forever|locked|wipes|gone|lost|no|impossible|wipe|misses|dismissed|lost)$/i;
const KEY_CYAN = /^(ironkey|stefan|joe|unciphered|hacker|hackers|glitch|opened|trezor|wired|chainalysis)$/i;

// lens push-through: the outgoing act rushes into the center, the incoming act settles from a slight zoom
const Frame: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = ACTS[i], next = ACTS[i + 1];
  let tf = '', op = 1, blur = 0;
  if (i > 0 && a.enter === 'push' && t < a.start + 0.5) { const u = ramp(t, a.start - 0.05, 0.5, EASE.out); tf += `scale(${1.25 - 0.25 * u})`; blur += (1 - u) * 18; op *= Math.min(1, u * 2); }
  if (next && next.enter === 'push' && t > next.start - 0.45) { const u = ramp(t, next.start - 0.4, 0.4, EASE.in); tf += ` scale(${1 + 1.4 * u})`; blur += u * 24; op *= 1 - u * 0.85; }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const TwoGuesses: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#03050b' }}>
      {ACTS.map((a, i) => {
        const next = ACTS[i + 1];
        const from = i && a.enter === 'push' ? a.start - 0.05 : a.start, to = next ? next.start + (next.enter === 'push' ? 0 : 0) : TTL.duration + 1;
        if (t < from || t >= to) return null;
        const Comp = a.comp;
        return <Frame key={i} i={i}><Comp /></Frame>;
      })}
      {t > C0(23) - 0.1 && t < TTL.scenes[5].end && <HUD left={2} heat={0.5 + 0.5 * Math.max(0, Math.sin(t * 2))} at={C0(23) + 0.6} out={TTL.scenes[5].end - 0.4} />}
      <Captions words={TTL.words} hide={HIDE} keyRed={KEY_RED} keyCyan={KEY_CYAN} />
      <FilmLook vignette={0.55} grain={0.07} />
      <Audio src={staticFile('tg/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
