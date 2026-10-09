// "The Cursed CPU" (1920×1080): story scenes with transitions, captions, film look,
// soundtrack and the comedy SFX layer.
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FilmLook } from '../components/Backdrop';
import { Captions } from '../components/Captions';
import { SfxTrack, type SfxEvent } from '../lib/sfx';
import { EASE, ramp } from '../lib/time';
import { CTL } from './ctime';
import { S0Open, s0Sfx, s0NoCaptions } from './S0Open';
import { S1Deal, s1Sfx, s1NoCaptions } from './S1Deal';
import { S2Flashback, s2Sfx, s2NoCaptions } from './S2Flashback';
import { S3Explain, s3Sfx, s3NoCaptions } from './S3Explain';

type Enter = 'cut' | 'whip' | 'wipe' | 'scale';
const Placeholder: React.FC = () => <AbsoluteFill style={{ background: '#0a1024' }} />;
type SceneDef = { comp: React.FC; enter: Enter; sfx: SfxEvent[]; hide: [number, number][] };
const DEFS: SceneDef[] = [
  { comp: S0Open, enter: 'cut', sfx: s0Sfx, hide: s0NoCaptions },
  { comp: S1Deal, enter: 'cut', sfx: s1Sfx, hide: s1NoCaptions },
  { comp: S2Flashback, enter: 'wipe', sfx: s2Sfx, hide: s2NoCaptions },
  { comp: S3Explain, enter: 'whip', sfx: s3Sfx, hide: s3NoCaptions },
  { comp: Placeholder, enter: 'scale', sfx: [], hide: [] },
  { comp: Placeholder, enter: 'wipe', sfx: [], hide: [] },
  { comp: Placeholder, enter: 'whip', sfx: [], hide: [] },
];
const SCENES = DEFS.map((s, i) => ({ ...s, start: CTL.scenes[i].start, end: CTL.scenes[i].end }));

const transitionSfx: SfxEvent[] = SCENES.slice(1).flatMap((s): SfxEvent[] => {
  if (s.enter === 'whip') return [{ t: s.start - 0.26, name: 'whooshBig', vol: 0.45 }];
  if (s.enter === 'scale') return [{ t: s.start - 0.3, name: 'zoomAir', vol: 0.45 }, { t: s.start, name: 'impactDeep', vol: 0.35 }];
  if (s.enter === 'wipe') return [{ t: s.start - 0.4, name: 'swoosh', vol: 0.45 }];
  return [];
});
const SFX = [...transitionSfx, ...SCENES.flatMap((s) => s.sfx)];
const HIDE: [number, number][] = [...SCENES.flatMap((s) => s.hide), ...SCENES.slice(1).map((s) => [s.start - 0.3, s.start + 0.35] as [number, number])];
const KEY_RED = /^(banned|ban|bans|cheated|cheats|cheating|kicked|criminal|hammer|terrifying|kernel|unlikely|mistake|hurts|record|past)$/i;
const KEY_CYAN = /^(chip|leo|vanguard|riot|valorant|tpm|ryzen|vault|key|keys|cpu|identity|bouncer|support)$/i;

const WIPE_SKEW = 115;
const wipeEdge = (t: number, at: number) => 2200 - 2560 * ramp(t, at - 0.38, 0.76, EASE.inOut);
const Frame: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const s = SCENES[i], next = SCENES[i + 1];
  let tf = '', op = 1, blur = 0, clip: string | undefined;
  if (i > 0 && t < s.start + 0.4) {
    if (s.enter === 'whip') { const u = ramp(t, s.start - 0.2, 0.4, EASE.inOut); tf += `translateX(${(1 - u) * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 26; }
    if (s.enter === 'scale') { const u = ramp(t, s.start - 0.15, 0.45, EASE.out); tf += `scale(${0.82 + 0.18 * u})`; op *= u; }
    if (s.enter === 'wipe') { const e = wipeEdge(t, s.start); clip = `polygon(${e + WIPE_SKEW}px 0, 1920px 0, 1920px 1080px, ${e - WIPE_SKEW}px 1080px)`; }
  }
  if (next && t > next.start - 0.45) {
    if (next.enter === 'whip') { const u = ramp(t, next.start - 0.2, 0.4, EASE.inOut); tf += ` translateX(${-u * 1920}px)`; blur += (1 - Math.abs(u * 2 - 1)) * 26; }
    if (next.enter === 'scale') { const u = ramp(t, next.start - 0.35, 0.45, EASE.in); tf += ` scale(${1 + 0.35 * u})`; op *= 1 - u; }
    if (next.enter === 'wipe' && t > next.start - 0.4) { const e = wipeEdge(t, next.start); clip = `polygon(0 0, ${e + WIPE_SKEW}px 0, ${e - WIPE_SKEW}px 1080px, 0 1080px)`; }
  }
  return <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined, clipPath: clip }}>{children}</AbsoluteFill>;
};
const WipeBand: React.FC<{ at: number }> = ({ at }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const e = wipeEdge(t, at);
  if (e > 2150 || e < -330) return null;
  const band = (off: number, w: number, bg: string, extra: React.CSSProperties = {}) => <div style={{ position: 'absolute', left: e + off - w / 2, top: -60, width: w, height: 1200, background: bg, transform: 'skewX(-12deg)', ...extra }} />;
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{band(0, 54, '#ffd23a', { boxShadow: '0 0 60px #ffd23a' })}{band(46, 8, 'rgba(255,255,255,.85)')}</AbsoluteFill>;
};

export const CpuMain: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#04060c' }}>
      {SCENES.map((s, i) => {
        const next = SCENES[i + 1];
        const from = i ? s.start - (s.enter === 'cut' ? 0 : 0.5) : 0, to = next ? next.start + (next.enter === 'cut' ? 0 : 0.5) : CTL.duration + 1;
        if (t < from || t >= to) return null;
        const Comp = s.comp;
        return <Frame key={i} i={i}><Comp /></Frame>;
      })}
      {SCENES.map((s, i) => (i && s.enter === 'wipe' && Math.abs(t - s.start) < 0.6 ? <WipeBand key={`w${i}`} at={s.start} /> : null))}
      <Captions words={CTL.words} hide={HIDE} keyRed={KEY_RED} keyCyan={KEY_CYAN} />
      <FilmLook vignette={0.55} grain={0.07} />
      <Audio src={staticFile('cpu/soundtrack.wav')} />
      <SfxTrack events={SFX} />
    </AbsoluteFill>
  );
};
