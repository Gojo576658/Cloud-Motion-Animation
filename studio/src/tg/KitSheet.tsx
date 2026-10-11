// Model sheet for the "Two Guesses Left" kit (check the look before animating).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Ike, Vault, HUD, Person, Robot, Coin, QuoteCard, CaseCard, P } from './kit';

export const TgKit: React.FC = () => (
  <AbsoluteFill>
    <Vault />
    <Ike x={960} y={820} size={460} count={8} eye="smug" seed={1} />
    <Ike x={300} y={520} size={300} count={8} eye="narrow" xray={1} seed={2} />
    <Ike x={1640} y={520} size={300} count={10} eye="wide" wipe={0.6} seed={3} />
    <Ike x={1640} y={1000} size={220} count={8} eye="open" unlocked seed={4} />
    <HUD left={2} heat={0.6} />
    <Person kind="stefan" x={260} y={1080} size={300} mood="worried" />
    <Person kind="joe" x={560} y={1080} size={280} mood="focused" seed={2} />
    <Person kind="dan" x={1320} y={1080} size={260} mood="shock" seed={3} />
    <Robot x={1120} y={1060} size={180} beard={0.6} dizzy />
    {[0, 1, 2].map((i) => <Coin key={i} x={1180 + i * 70} y={300} size={70} spin={i} />)}
    <CaseCard x={330} y={240} at={0} text="WHY “NO”?" stamp="?!" stampAt={0} />
  </AbsoluteFill>
);
