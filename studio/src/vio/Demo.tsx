// Vio demo (1920×1080, ~9.8 s): the host introduces himself. Shows the rig working: entry pop, lip-sync and
// blinks on the idle pose, the red "decoding" eye, and pose swaps (shocked → smirk → facepalm → pointing).
import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { GridBg, A } from '../ai/kit';
import { useTF, Kinetic, Mono } from '../tg/kit';
import { ramp } from '../lib/time';
import { FilmLook } from '../components/Backdrop';
import { Vio, talkFrom, type VioPose } from './Vio';
import WORDS from './demo-words.json';

const at = (w: string) => WORDS.find((x) => x.w.toLowerCase().startsWith(w.toLowerCase()))!.s;
const SWAPS: [number, VioPose][] = [[0, 'idle'], [at('Hackers'), 'shocked'], [at('billionaires'), 'smirk'], [at('one-click'), 'facepalm'], [at("Let's") - 0.15, 'pointing']];
export const VIO_DEMO_DURATION = 9.8;

export const VioDemo: React.FC = () => {
  const { t } = useTF();
  const k = SWAPS.filter(([s]) => t >= s).length - 1;
  const [since, pose] = SWAPS[k];
  const decode = ramp(t, at('craziest') - 0.1, 0.25) * (1 - ramp(t, at('stories') + 0.3, 0.3));
  const intro = t < at('Every') - 0.1, mid = !intro && t < at('Hackers') - 0.1;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(255,43,61,.1)" x={68} />
      <Vio x={1330} y={1110} size={1050} pose={pose} at={k ? since : 0.1} talk={pose === 'idle' ? talkFrom(WORDS, t) : 0} decode={decode} seed={3} />
      <div style={{ position: 'absolute', left: 230, top: 330 }}>
        {intro && <Kinetic at={at('Yo')} size={150} align="left" words={[{ w: 'Yo!' }, { w: "I'm", br: true }, { w: 'Vio.', serif: true, color: A.red }]} />}
        {mid && <Kinetic at={at('Every')} size={92} align="left" words={[{ w: 'True' }, { w: 'tech' }, { w: 'stories,', serif: true, color: A.red, br: true }, { w: 'every', br: true }, { w: 'week.' }]} />}
        {!intro && !mid && <Kinetic at={at('Hackers')} size={84} align="left" stagger={0.18} words={[{ w: 'Hackers.' }, { w: 'Billionaires.', br: true }, { w: 'Disasters.', serif: true, color: A.red, br: true }]} />}
        <div style={{ marginTop: 34, opacity: ramp(t, 0.6, 0.4) }}><Mono size={26} color={A.dim}>YOUR HOST · MECHIVIOTECH</Mono></div>
      </div>
      <FilmLook vignette={0.5} grain={0.06} />
      <Audio src={staticFile('vio/demo.wav')} />
    </AbsoluteFill>
  );
};
