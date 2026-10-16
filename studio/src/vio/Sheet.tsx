// Vio character sheet (1920×1080): every mood and arm pose side by side, for checking the rig and for
// the owner to approve the look. Not part of any video.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GridBg, A } from '../ai/kit';
import { Mono } from '../tg/kit';
import { Vio, type VioMood, type VioArm } from './Vio';

const CELLS: [VioMood, VioArm, number, string][] = [
  ['smirk', 'none', 0, 'SMIRK'], ['happy', 'wave', 0, 'HAPPY · WAVE'], ['talk', 'point', 0, 'TALK · POINT'], ['shock', 'none', 0, 'SHOCK'],
  ['think', 'chin', 0, 'THINK'], ['laugh', 'none', 0, 'LAUGH'], ['angry', 'none', 0, 'ANGRY'], ['smirk', 'none', 1, 'DECODING'],
];
export const VioSheet: React.FC = () => (
  <AbsoluteFill>
    <GridBg />
    {CELLS.map(([mood, arm, decode, label], i) => {
      const cx = 240 + (i % 4) * 480, cy = 500 + Math.floor(i / 4) * 520;
      return (
        <React.Fragment key={i}>
          <Vio x={cx} y={cy} size={440} mood={mood} arm={arm} decode={decode} talk={mood === 'talk' ? 0.8 : 0} look={mood === 'think' ? 0.6 : 0} seed={i + 2} />
          <div style={{ position: 'absolute', left: cx, top: cy + 10, transform: 'translateX(-50%)' }}><Mono size={22} color={A.dim}>{label}</Mono></div>
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);
