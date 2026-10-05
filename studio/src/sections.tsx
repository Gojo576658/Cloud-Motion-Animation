// Section registry: which component plays when, how it enters, its sound design and
// where captions are hidden (big on-screen type already says the words).
import React from 'react';
import { TL } from './lib/time';
import { C } from './lib/theme';
import type { SfxEvent } from './lib/sfx';
import { ColdOpen, coldOpenSfx, coldOpenNoCaptions } from './scenes/ColdOpen';
import { S1Investigation, s1Sfx, s1NoCaptions } from './scenes/S1Investigation';
import { S2Hears, s2Sfx, s2NoCaptions } from './scenes/S2Hears';
import { S3Audio, s3Sfx, s3NoCaptions } from './scenes/S3Audio';
import { S4Network, s4Sfx, s4NoCaptions } from './scenes/S4Network';
import { S5Hack, s5Sfx, s5NoCaptions } from './scenes/S5Hack';
import { S6Response, s6Sfx, s6NoCaptions } from './scenes/S6Response';
import { S7History, s7Sfx, s7NoCaptions } from './scenes/S7History';
import { S8Money, s8Sfx, s8NoCaptions } from './scenes/S8Money';
import { S9Fix, s9Sfx, s9NoCaptions } from './scenes/S9Fix';

type Def = { comp: React.FC; enter: 'cut' | 'whip' | 'scale' | 'wipe'; accent: string; sfx: SfxEvent[]; noCaptions: [number, number][] };

const defs: Def[] = [
  { comp: ColdOpen, enter: 'cut', accent: C.red, sfx: coldOpenSfx, noCaptions: coldOpenNoCaptions },
  { comp: S1Investigation, enter: 'wipe', accent: C.cyan, sfx: s1Sfx, noCaptions: s1NoCaptions },
  { comp: S2Hears, enter: 'scale', accent: C.cyan, sfx: s2Sfx, noCaptions: s2NoCaptions },
  { comp: S3Audio, enter: 'wipe', accent: C.red, sfx: s3Sfx, noCaptions: s3NoCaptions },
  { comp: S4Network, enter: 'cut', accent: C.cyan, sfx: s4Sfx, noCaptions: s4NoCaptions },
  { comp: S5Hack, enter: 'wipe', accent: C.red, sfx: s5Sfx, noCaptions: s5NoCaptions },
  { comp: S6Response, enter: 'scale', accent: C.cyan, sfx: s6Sfx, noCaptions: s6NoCaptions },
  { comp: S7History, enter: 'wipe', accent: C.amber, sfx: s7Sfx, noCaptions: s7NoCaptions },
  { comp: S8Money, enter: 'whip', accent: C.amber, sfx: s8Sfx, noCaptions: s8NoCaptions },
  { comp: S9Fix, enter: 'wipe', accent: C.green, sfx: s9Sfx, noCaptions: s9NoCaptions },
];

export const SECTIONS = defs.map((d, i) => ({ ...d, start: TL.sections[i].start, end: TL.sections[i].end, title: TL.sections[i].title }));
