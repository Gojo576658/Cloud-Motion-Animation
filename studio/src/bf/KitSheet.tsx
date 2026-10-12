// Contact sheet for the Blue Friday kit (visual QA only).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Gus, Monitor, Form, DotMap, Night, BootDots } from './kit';

export const BfKit: React.FC = () => (
  <AbsoluteFill>
    <Night />
    <Gus x={150} y={400} size={300} mood="happy" arm="wave" />
    <Gus x={400} y={400} size={300} mood="confused" arm="reach" />
    <Gus x={650} y={400} size={300} mood="shock" arm="clip" clipCount={5} />
    <Gus x={900} y={400} size={300} mood="dizzy" arm="shrug" />
    <Gus x={1150} y={400} size={300} mood="sad" arm="salute" />
    <Monitor x={1450} y={330} w={360} blue={1} />
    <Monitor x={1750} y={330} w={300}><BootDots /></Monitor>
    <Form x={420} y={760} at={0} n={21} hi={18} bad={1} w={520} />
    <DotMap x={1350} y={780} w={900} lit={0.5} />
  </AbsoluteFill>
);
