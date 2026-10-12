// Acts 6–7: the checker that had a bug of its own, everyone-at-once vs rollout rings, the lesson; then the
// question (the company or the system?), the next-video teaser, and Gus counting to twenty, forever.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P } from './ttime';
import { useTF, Pop, Kinetic, Mono } from '../tg/kit';
import { B, Gus, Form, Tag, Card, Night } from './kit';

// ================================================================ ACT 6 · how it got through
const tHow = C0(46), tReport = C0(47), tTool = P(47, 'the tool'), tBug = P(47, 'a bug of its own'), tThrough = P(47, 'let the bad file');
const tAll = C0(48), tNoTest = P(48, 'No small test'), tNoSlow = P(48, 'No slow'), tSince = C0(49), tChecks = P(49, 'checks the number'), tRings = P(49, 'in rings'), tChoose = P(49, 'lets customers');
const tLesson = C0(50), tSame = P(50, 'same software'), tSmaller = P(50, 'the smaller');
export const a6NoCaptions: [number, number][] = [];
export const a6Sfx: SfxEvent[] = [
  { t: tHow, name: 'mysteryHit', vol: 0.4 }, { t: tTool, name: 'scan', vol: 0.4 }, { t: tBug, name: 'glitch', vol: 0.35 }, { t: tThrough, name: 'success', vol: 0.3, note: 'wrong green light' }, { t: tThrough + 0.5, name: 'negGuitar', vol: 0.3 },
  { t: tAll, name: 'sweepSciFi', vol: 0.35 }, { t: tAll + 0.8, name: 'impactDeep', vol: 0.4 }, { t: tNoTest - 0.05, name: 'popUi', vol: 0.3 }, { t: tNoSlow - 0.05, name: 'popUi', vol: 0.3 },
  { t: tChecks - 0.05, name: 'confirm', vol: 0.35 }, { t: tRings - 0.05, name: 'confirm', vol: 0.35 }, { t: tChoose - 0.05, name: 'confirm', vol: 0.35 },
  { t: tLesson, name: 'shimmer', vol: 0.25 }, { t: tSmaller, name: 'impactDeep', vol: 0.4 },
];
export const A6: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tReport - 0.2) {
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 960, top: 420, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <Kinetic at={tHow + 0.1} size={110} stagger={0.07} words={[{ w: 'How' }, { w: 'did' }, { w: 'it' }, { w: 'get', br: true }, { w: 'through?', serif: true, color: B.amber }]} />
        </div>
        <Gus x={1560} y={1000} size={360} mood="confused" arm="shrug" look={-1} seed={13} />
      </AbsoluteFill>
    );
  }
  // ---- the checker with a bug of its own
  if (t < tAll - 0.2) {
    const move = ramp(t, tThrough - 0.6, 1.6, EASE.inOut);
    const green = t > tThrough;
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 220, top: 110 }}><Mono size={20} color={B.dim}>SOURCE: CROWDSTRIKE'S ROOT CAUSE ANALYSIS, AUG 2024</Mono></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 760, height: 40, background: '#1d2944' }} />
        <div style={{ position: 'absolute', left: 760, top: 300, width: 400, height: 470, borderRadius: '30px 30px 0 0', border: '26px solid #2c4170', borderBottom: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: -100, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}><Tag color={B.white}>CONTENT VALIDATOR</Tag></div>
          <div style={{ position: 'absolute', left: '50%', top: 30, transform: 'translateX(-50%)', width: 80, height: 80, borderRadius: 40, background: green ? B.green : t > tTool ? B.amber : '#1d2944', boxShadow: green ? `0 0 50px ${B.green}` : 'none' }} />
          {t > tBug && <div style={{ position: 'absolute', right: -70, top: 120, transform: `scale(${springAt(f, fps, tBug, { damping: 9, stiffness: 220 })})` }}><Icon name="ph:bug-beetle-fill" size={90} color={B.red} /></div>}
        </div>
        <div style={{ position: 'absolute', left: lerp(80, 1260, move), top: 480, transform: 'scale(0.55)', transformOrigin: '0 0' }}>
          <div style={{ position: 'relative', width: 620, height: 400 }}><Form x={310} y={200} at={tReport} n={21} hi={0} bad={1} w={560} title="FORM 291 · 21 FIELDS" /></div>
        </div>
        {green && <Pop x={1500} y={240} at={tThrough + 0.2}><Tag color={B.red} size={36}>LET THROUGH</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- everyone at once
  if (t < tSince - 0.2) {
    const r = rng(31);
    const pcs = Array.from({ length: 60 }, (_, i) => ({ x: 700 + (i % 10) * 110, y: 200 + Math.floor(i / 10) * 115, d: r() }));
    const shot = ramp(t, tAll + 0.4, 0.4, EASE.in);
    return (
      <AbsoluteFill>
        <Night />
        <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>{pcs.map((p, i) => <line key={i} x1={300} y1={540} x2={lerp(300, p.x, shot)} y2={lerp(540, p.y, shot)} stroke={B.red} strokeOpacity={0.5} strokeWidth={2} />)}</svg>
        <div style={{ position: 'absolute', left: 220, top: 460, width: 160, height: 160, borderRadius: 80, background: B.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${B.red}88` }}><Icon name="ph:file-fill" size={80} color="#fff" /></div>
        {pcs.map((p, i) => <div key={i} style={{ position: 'absolute', left: p.x - 40, top: p.y - 28, width: 80, height: 54, borderRadius: 6, background: shot > 0.98 ? B.blue : '#1a2a4a', border: '2px solid #2c4170' }} />)}
        {[[tNoTest, 'NO SMALL TEST GROUP', 560], [tNoSlow, 'NO SLOW ROLLOUT', 1260]].map(([at, lb, x]) => <Pop key={lb as string} x={x as number} y={860} at={(at as number) - 0.05}><Tag color={B.red} size={36}><Icon name="ph:x-bold" size={36} color={B.red} /> {lb as string}</Tag></Pop>)}
      </AbsoluteFill>
    );
  }
  // ---- the fixes
  if (t < tLesson - 0.2) {
    const rings = (k: number) => ramp(t, tRings + 0.3 + k * 0.5, 0.5, EASE.out);
    return (
      <AbsoluteFill>
        <Night glow="rgba(60,240,160,.1)" />
        <div style={{ position: 'absolute', left: 220, top: 160 }}><Mono size={22} color={B.dim}>WHAT CROWDSTRIKE SAYS IT CHANGED</Mono></div>
        {t > tChecks - 0.1 && <Pop x={450} y={540} at={tChecks - 0.1}><Card w={460} pad={30}><div style={{ textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', width: 300, margin: '0 auto' }}>{Array.from({ length: 21 }, (_, i) => <div key={i} style={{ width: 34, height: 26, borderRadius: 4, border: `2px solid ${i === 20 ? B.red : B.green}`, background: i === 20 ? `${B.red}33` : 'transparent' }} />)}</div><div style={{ marginTop: 22, ...fonts.H, fontWeight: 800, fontSize: 38, color: B.white }}>Counts the fields</div><Mono size={18} color={B.red}>21 ≠ 20 → REJECTED</Mono></div></Card></Pop>}
        {t > tRings - 0.1 && <Pop x={960} y={540} at={tRings - 0.1}><Card w={460} pad={30}><div style={{ textAlign: 'center' }}><div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>{[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 110 - (40 + k * 35), top: 110 - (40 + k * 35), width: (40 + k * 35) * 2, height: (40 + k * 35) * 2, borderRadius: '50%', border: `4px solid ${B.green}`, opacity: rings(k), transform: `scale(${0.6 + 0.4 * rings(k)})` }} />)}<div style={{ position: 'absolute', left: 95, top: 95, width: 30, height: 30, borderRadius: 15, background: B.green }} /></div><div style={{ marginTop: 22, ...fonts.H, fontWeight: 800, fontSize: 38, color: B.white }}>Rollout in rings</div><Mono size={18} color={B.green}>SMALL GROUP FIRST</Mono></div></Card></Pop>}
        {t > tChoose - 0.1 && <Pop x={1470} y={540} at={tChoose - 0.1}><Card w={460} pad={30}><div style={{ textAlign: 'center' }}><div style={{ width: 160, height: 84, borderRadius: 42, background: ramp(t, tChoose + 0.4, 0.3) > 0.5 ? B.green : '#2c4170', margin: '40px auto 50px', position: 'relative' }}><div style={{ position: 'absolute', top: 8, left: lerp(8, 84, ramp(t, tChoose + 0.4, 0.3, EASE.back)), width: 68, height: 68, borderRadius: 34, background: '#fff' }} /></div><div style={{ ...fonts.H, fontWeight: 800, fontSize: 38, color: B.white }}>Customers choose</div><Mono size={18} color={B.green}>WHEN UPDATES ARRIVE</Mono></div></Card></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- the lesson
  const r = rng(41);
  const nodes = Array.from({ length: 46 }, (_, i) => { const a = (i / 46) * Math.PI * 2 + r() * 0.1, d = 240 + r() * 300; return { x: 960 + Math.cos(a) * d * 1.35, y: 600 + Math.sin(a) * d * 0.62 }; });
  const broke = t > tSmaller + 0.4;
  return (
    <AbsoluteFill>
      <Night />
      <svg style={{ position: 'absolute', inset: 0 }} width={1920} height={1080}>{nodes.map((n, i) => <line key={i} x1={960} y1={600} x2={n.x} y2={n.y} stroke={broke ? B.blue2 : '#3a4a70'} strokeWidth={2} strokeOpacity={ramp(t, tLesson + i * 0.02, 0.3)} />)}</svg>
      {nodes.map((n, i) => <div key={i} style={{ position: 'absolute', left: n.x - 14, top: n.y - 14, width: 28, height: 28, borderRadius: 14, background: broke && ramp(t, tSmaller + 0.4 + i * 0.015, 0.1) > 0.5 ? B.blue : '#2c4170', transform: `scale(${ramp(t, tLesson + i * 0.02, 0.3, EASE.back)})` }} />)}
      <div style={{ position: 'absolute', left: 900, top: 540, width: 120, height: 120, borderRadius: 60, background: B.navy2, border: `4px solid ${B.blue2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:file-fill" size={56} color={B.white} /></div>
      {t > tSame && <div style={{ position: 'absolute', left: 960, top: 90, transform: 'translateX(-50%)' }}><Kinetic at={tSame} size={70} words={[{ w: 'Same' }, { w: 'software,' }, { w: 'smaller', serif: true, color: B.blue2 }, { w: 'mistake.', serif: true, color: B.blue2 }]} /></div>}
    </AbsoluteFill>
  );
};

// ================================================================ ACT 7 · outro
const tQ = C0(51), tCompany = P(51, 'The company'), tWorld = P(51, 'or a world'), tComments = P(51, 'Tell me'), tSubNext = C0(52), tInsta = P(52, 'steal Instagram'), tAsk = P(52, 'politely asking'), tGus = C0(53), tEnd = C1(53);
export const a7NoCaptions: [number, number][] = [[tEnd + 0.3, tEnd + 10]];
export const a7Sfx: SfxEvent[] = [
  { t: tQ, name: 'chime', vol: 0.3 }, { t: tCompany - 0.05, name: 'popUi', vol: 0.35 }, { t: tWorld - 0.05, name: 'popUi', vol: 0.35 }, { t: tComments, name: 'notify', vol: 0.3 },
  { t: tSubNext, name: 'clickModern', vol: 0.45 }, { t: tSubNext + 0.4, name: 'bell', vol: 0.35 }, { t: tInsta, name: 'notification', vol: 0.3 }, { t: tAsk, name: 'lockQuick', vol: 0.4, note: 'lock pops open' },
  { t: tGus, name: 'tick', vol: 0.4 }, { t: tGus + 0.5, name: 'tick', vol: 0.4 }, { t: tGus + 1.0, name: 'tick', vol: 0.4 }, { t: tEnd + 0.2, name: 'sillyPop', vol: 0.35 },
];
export const A7: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tSubNext - 0.2) {
    return (
      <AbsoluteFill>
        <Night glow="rgba(61,143,240,.2)" />
        <div style={{ position: 'absolute', left: 960, top: 200, transform: 'translateX(-50%)' }}><Kinetic at={tQ + 0.1} size={86} words={[{ w: 'Who' }, { w: 'is' }, { w: 'really' }, { w: 'to' }, { w: 'blame?', serif: true, color: B.amber }]} /></div>
        {[[tCompany, 'THE COMPANY', 'that shipped the file', 'ph:buildings-fill', 560], [tWorld, 'THE SYSTEM', 'that let one update reach millions', 'ph:globe-hemisphere-west-fill', 1360]].map(([at, a, b, ic, x]) => <Pop key={a as string} x={x as number} y={560} at={(at as number) - 0.05}><Card w={620} pad={40}><div style={{ textAlign: 'center' }}><Icon name={ic as string} size={110} color={B.blue2} style={{ margin: '0 auto' }} /><div style={{ marginTop: 18, ...fonts.H, fontWeight: 900, fontSize: 56, color: B.white }}>{a as string}</div><div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 36, color: B.dim }}>{b as string}</div></div></Card></Pop>)}
        {t > tComments && <Pop x={960} y={900} at={tComments}><Tag color={B.amber} size={36}><Icon name="ph:chat-circle-dots-fill" size={40} color={B.amber} /> TELL ME IN THE COMMENTS</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  if (t < tGus - 0.2) {
    const open = ramp(t, tAsk + 0.3, 0.4, EASE.back);
    return (
      <AbsoluteFill>
        <Night glow="rgba(255,46,140,.14)" />
        <div style={{ position: 'absolute', left: 120, top: 110 }}><Tag color={B.amber} size={34}>NEXT TIME</Tag></div>
        <div style={{ position: 'absolute', left: 960 - 210, top: 150, width: 420, height: 800, borderRadius: 60, background: '#10141c', padding: 18, boxShadow: '0 40px 90px rgba(0,0,0,.6)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 44, background: 'linear-gradient(180deg,#1a1f2e,#0d1018)', padding: 30, position: 'relative' }}>
            <Mono size={16} color={B.dim}>AI ASSISTANT</Mono>
            {t > tInsta && <div style={{ marginTop: 40, marginLeft: 70, padding: '18px 22px', borderRadius: '22px 22px 4px 22px', background: '#3d8ff0', ...fonts.H, fontWeight: 700, fontSize: 26, color: '#fff', transform: `scale(${springAt(f, fps, tInsta, { damping: 13, stiffness: 200 })})`, transformOrigin: '100% 100%' }}>Hi! Could you please reset this account's password?</div>}
            {t > tAsk && <div style={{ marginTop: 26, marginRight: 70, padding: '18px 22px', borderRadius: '22px 22px 22px 4px', background: '#2a3040', ...fonts.H, fontWeight: 700, fontSize: 26, color: '#fff', transform: `scale(${springAt(f, fps, tAsk, { damping: 13, stiffness: 200 })})`, transformOrigin: '0 100%' }}>Of course! Done.</div>}
            <div style={{ position: 'absolute', left: '50%', bottom: 70, transform: 'translateX(-50%)' }}><Icon name={open > 0.5 ? 'ph:lock-open-fill' : 'ph:lock-fill'} size={130} color={open > 0.5 ? B.red : B.dim} /></div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  const end = t > tEnd + 0.3;
  return (
    <AbsoluteFill>
      <Night glow="rgba(255,236,200,.12)" y={70} />
      <Gus x={end ? 620 : 960} y={980} size={560} mood={end ? 'happy' : 'focus'} arm="clip" clipCount={Math.min(12, Math.floor((t - tGus) * 6))} talk={t < tEnd ? Math.abs(Math.sin(t * 14)) : 0} seed={14} />
      {end && <div style={{ position: 'absolute', left: 1300, top: 520, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: ramp(t, tEnd + 0.3, 0.5) }}>
        <div style={{ ...fonts.H, fontWeight: 900, fontSize: 96, color: B.white, letterSpacing: '-0.04em' }}>Mechivio<span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 400, color: B.blue2 }}>Tech</span></div>
        <Mono size={22} color={B.dim}>TECH STORIES, EXPLAINED</Mono>
      </div>}
    </AbsoluteFill>
  );
};
