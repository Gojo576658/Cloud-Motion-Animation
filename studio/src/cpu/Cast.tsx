// Model sheet for the CPU-ban characters (all moods side by side) — a design check, not part of the video.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Chip, Leo, Bouncer, Shady, type ChipMood, type LeoMood } from './chars';
import { BgMesh } from '../components/Look';
import { C } from '../lib/theme';

const CM: ChipMood[] = ['neutral', 'happy', 'proud', 'shock', 'sad', 'scared', 'sus', 'wink', 'grumpy'];
const LM: LeoMood[] = ['neutral', 'excited', 'heart', 'shock', 'sad', 'cry', 'sideeye', 'determined'];
export const Cast: React.FC = () => (
  <AbsoluteFill style={{ background: '#0a1024' }}>
    <BgMesh a={C.blue} b={C.violet} />
    {CM.map((m, i) => <Chip key={m} x={110 + i * 190} y={250} size={170} mood={m} seed={i} tears={m === 'sad' ? 1 : 0} sweat={m === 'scared' || m === 'sus' ? 1 : 0} grey={m === 'grumpy'} arms={i === 1 ? 'wave' : i === 2 ? 'up' : i === 4 ? 'shrug' : i === 6 ? 'point' : 'none'} />)}
    {LM.map((m, i) => <Leo key={m} x={120 + i * 170} y={560} size={170} mood={m} seed={i} typing={m === 'determined'} />)}
    <Bouncer x={400} y={1060} size={380} glasses={1} />
    <Bouncer x={760} y={1060} size={380} glasses={0} clipboard />
    <Shady x={1120} y={1060} size={330} whistle cash={1} />
    <Chip x={1480} y={1000} size={300} mood="shock" xray={1} />
    <Chip x={1760} y={1000} size={200} mood="happy" walk={0.25} arms="point" />
  </AbsoluteFill>
);
