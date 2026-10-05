import React from 'react';
import { AbsoluteFill, Audio, Composition, staticFile } from 'remotion';
import { ColdOpen } from './scenes/ColdOpen';
import { FilmLook } from './components/Backdrop';
import { Captions } from './components/Captions';
import { Sfx } from './lib/sfx';
import { TL } from './lib/time';

const FPS = 30;

export const Main: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: '#03050b' }}>
    <ColdOpen />
    <Captions hide={[[TL.titleAt - 0.4, TL.sections[1].start]]} />
    <FilmLook />
    <Sfx at={0.2} name="drone" vol={0.25} />
    {audio && <Audio src={staticFile('soundtrack.wav')} />}
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="SmartTV" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.duration * FPS)} />
    <Composition id="ColdOpen" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.sections[1].start * FPS) + 15} />
  </>
);
