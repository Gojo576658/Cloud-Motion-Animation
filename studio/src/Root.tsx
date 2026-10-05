import React from 'react';
import { AbsoluteFill, Audio, Composition, staticFile } from 'remotion';
import { ColdOpen } from './scenes/ColdOpen';
import { FilmLook } from './components/Backdrop';
import { TL } from './lib/time';

const FPS = 30;

export const Main: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: '#03050b' }}>
    <ColdOpen />
    <FilmLook />
    {audio && <Audio src={staticFile('soundtrack.wav')} />}
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="SmartTV" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.duration * FPS)} />
    <Composition id="ColdOpen" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TL.sections[1].start * FPS) + 15} />
  </>
);
