// Vio character sheet (1920×1080): every pose plus the idle overlays (blink, talk, decode), for checking
// the rig. VioFace (1080×1080) zooms on the idle face to check the overlays line up. Not part of a video.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GridBg, A } from '../ai/kit';
import { Mono } from '../tg/kit';
import { Vio, type VioPose } from './Vio';

const CELLS: [VioPose, string, { talk?: number; decode?: number; blink?: boolean }][] = [
  ['idle', 'IDLE', { blink: false }], ['idle', 'BLINK', { blink: true }], ['idle', 'TALK', { talk: 0.9, blink: false }], ['idle', 'DECODING', { decode: 1, blink: false }],
  ['shocked', 'SHOCKED', {}], ['smirk', 'SMIRK', {}], ['thinking', 'THINKING', {}], ['laughing', 'LAUGHING', {}], ['pointing', 'POINTING', {}], ['facepalm', 'FACEPALM', {}], ['full', 'FULL BODY', {}],
  ['lookright', 'LOOK RIGHT', {}], ['present', 'PRESENT', {}], ['pointright', 'POINT RIGHT', {}],
];
export const VioSheet: React.FC = () => (
  <AbsoluteFill>
    <GridBg />
    {CELLS.map(([pose, label, o], i) => {
      const cx = 120 + (i % 7) * 262, cy = 360 + Math.floor(i / 7) * 360;
      return (
        <React.Fragment key={i}>
          <Vio x={cx} y={cy} size={330} pose={pose} seed={i + 2} {...o} />
          <div style={{ position: 'absolute', left: cx, top: cy + 8, transform: 'translateX(-50%)' }}><Mono size={20} color={A.dim}>{label}</Mono></div>
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);
export const VioFace: React.FC = () => (
  <AbsoluteFill>
    <GridBg />
    <div style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 1080, overflow: 'hidden' }}><Vio x={327} y={3660} size={4000} blink={false} talk={0} /></div>
    <div style={{ position: 'absolute', left: 540, top: 0, width: 540, height: 540, overflow: 'hidden' }}><Vio x={327} y={3390} size={4000} blink /></div>
    <div style={{ position: 'absolute', left: 540, top: 540, width: 540, height: 540, overflow: 'hidden' }}><Vio x={327} y={3390} size={4000} talk={0.9} blink={false} decode={1} /></div>
  </AbsoluteFill>
);
