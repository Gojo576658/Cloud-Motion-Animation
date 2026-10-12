// Acts 4–5: pulled after ~80 minutes, but crashed machines can't download the fix; the hand-fix (safe mode,
// find the file, delete it) times fifty thousand; BitLocker keys on crashed servers; 99% by July 29.
// Then the bill: Delta's 7,000 flights and lawsuit, the $5.4B estimate, and the $10 gift card flagged as fraud.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Icon } from '../components/Icon';
import { fonts } from '../tg/type';
import { EASE, ramp, springAt, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, C1, P } from './ttime';
import { useTF, Pop, Count, Kinetic, Mono } from '../tg/kit';
import { Stamp, Bubble } from '../cpu/fx';
import { B, Gus, Monitor, BSOD, BootDots, Tag, Card, Night } from './kit';

// ================================================================ ACT 4 · the fix nobody could download
const tFast = C0(32), tHour = P(32, 'an hour and twenty'), tPulled = P(32, 'they pulled it'), tSolved = C0(33), tNot = C0(34), tLoop = P(34, 'stuck in a crash loop'), tCant = P(34, "can't download");
const tHand = C0(35), tWalk = P(35, 'walk up'), tSafe = P(35, 'safe mode'), tFind = P(35, 'find one file'), tDel = P(35, 'delete it');
const tOneAt = C0(36), tFifty = P(36, 'fifty thousand'), tBit = C0(37), tKey = P(37, 'long recovery key'), tEvery = P(37, 'every single machine');
const tServers = C0(38), tAlso = P(38, 'had also crashed'), tDays = C0(39), t29 = P(39, 'July 29th'), t99 = P(39, 'ninety-nine percent');
export const a4NoCaptions: [number, number][] = [];
export const a4Sfx: SfxEvent[] = [
  { t: tFast, name: 'tick', vol: 0.35 }, { t: tHour, name: 'clockSpin', vol: 0.35 }, { t: tPulled, name: 'confirm', vol: 0.4 },
  { t: tSolved, name: 'levelUp', vol: 0.3 }, { t: tNot - 0.05, name: 'glassBreak', vol: 0.45 }, { t: tNot, name: 'negGuitar', vol: 0.3 }, { t: tCant, name: 'boing', vol: 0.4 },
  { t: tWalk, name: 'tap', vol: 0.3 }, { t: tSafe, name: 'bleepHi', vol: 0.3 }, { t: tFind, name: 'typing', vol: 0.3, dur: 1.2 }, { t: tDel + 0.2, name: 'splat', vol: 0.3, note: 'file into trash' },
  { t: tOneAt, name: 'clockSpin', vol: 0.3 }, { t: tFifty, name: 'impactDeep', vol: 0.4 },
  { t: tKey, name: 'typeHard', vol: 0.3 }, { t: tKey + 0.6, name: 'typing', vol: 0.3, dur: 2.5 }, { t: tEvery, name: 'stomp', vol: 0.35 },
  { t: tServers + 0.3, name: 'machine', vol: 0.3 }, { t: tAlso, name: 'error', vol: 0.4 }, { t: tAlso + 0.4, name: 'sadTrombone', vol: 0.25 },
  { t: tDays, name: 'pagesFast', vol: 0.35 }, { t: t99, name: 'success', vol: 0.35 },
];
export const A4: React.FC = () => {
  const { f, fps, t } = useTF();
  // ---- 80 minutes, then "problem solved?"
  if (t < tNot - 0.15) {
    const fill = ramp(t, tFast + 0.3, tPulled - tFast, EASE.inOut);
    const solved = t > tSolved - 0.1;
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 400, top: 420, width: 1120 }}>
          <div style={{ height: 14, borderRadius: 7, background: '#1d2944' }}><div style={{ width: `${fill * 100}%`, height: '100%', borderRadius: 7, background: `linear-gradient(90deg, ${B.red}, ${B.amber})` }} /></div>
          {[[0, '04:09', 'UPDATE GOES OUT', B.red], [1, '05:27', 'UPDATE PULLED', B.green]].map(([u, tm, lb, col]) => (
            <div key={lb as string} style={{ position: 'absolute', left: `${(u as number) * 100}%`, top: -110, transform: 'translateX(-50%)', textAlign: 'center', opacity: u ? ramp(t, tPulled - 0.1, 0.3) : 1 }}>
              <div style={{ ...fonts.H, fontWeight: 900, fontSize: 64, color: B.white }}>{tm}</div><Mono size={20} color={col as string}>{lb as string}</Mono>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: col as string, margin: '22px auto 0' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', left: '50%', top: 60, transform: 'translateX(-50%)', opacity: ramp(t, tHour, 0.4) }}><Tag color={B.amber} size={36}>≈ 1 HOUR 20 MINUTES</Tag></div>
        </div>
        {solved && <Pop x={960} y={840} at={tSolved - 0.05}><Tag color={B.green} size={44}><Icon name="ph:check-circle-fill" size={50} color={B.green} /> PROBLEM SOLVED?</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- crash loop can't download
  if (t < tHand - 0.2) {
    const blue = Math.floor((t - tNot) / 0.9) % 2 === 0;
    const bounce = ((t - tLoop) % 1.4) / 1.4;
    return (
      <AbsoluteFill>
        <Night glow="rgba(255,59,78,.12)" />
        <Stamp x={960} y={160} at={tNot} text="NOT EVEN CLOSE" size={70} rot={-4} />
        <Monitor x={1200} y={860} w={720}>{blue ? <AbsoluteFill style={{ fontSize: 13 }}><BSOD pct={30} /></AbsoluteFill> : <BootDots size={70} />}</Monitor>
        <div style={{ position: 'absolute', left: 260, top: 380, textAlign: 'center' }}><Icon name="ph:cloud-arrow-down-fill" size={180} color={B.blue2} /><Mono size={22} color={B.white}>THE FIX</Mono></div>
        {t > tLoop && <div style={{ position: 'absolute', left: lerp(440, 820, Math.min(1, bounce * 2)) - (bounce > 0.5 ? (bounce - 0.5) * 500 : 0), top: 470 - Math.sin(Math.min(1, bounce * 2) * Math.PI) * 120 + (bounce > 0.5 ? (bounce - 0.5) * 300 : 0), opacity: 1 - clamp((bounce - 0.75) * 4), transform: `rotate(${bounce > 0.5 ? (bounce - 0.5) * 400 : 0}deg)` }}><Icon name="ph:file-arrow-down-fill" size={90} color={B.white} /></div>}
        {t > tCant && <Pop x={1200} y={300} at={tCant}><Tag color={B.red} size={40}><Icon name="ph:prohibit-bold" size={44} color={B.red} /> CAN'T DOWNLOAD A FIX</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- the hand-fix, step by step
  if (t < tOneAt - 0.2) {
    const steps: [number, string][] = [[tWalk, 'WALK UP TO THE PC'], [tSafe, 'START IN SAFE MODE'], [tFind, 'FIND ONE FILE'], [tDel, 'DELETE IT']];
    const k = steps.filter(([at]) => t > at - 0.1).length;
    const gone = ramp(t, tDel + 0.2, 0.6, EASE.in);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 240, top: 260 }}>
          {steps.map(([at, lb], i) => <div key={lb} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 34, opacity: t > at - 0.1 ? 1 : 0.25, transform: `translateX(${(1 - ramp(t, at - 0.1, 0.4)) * -30}px)` }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: i < k - 1 || (i === 3 && gone > 0.5) ? B.green : t > at - 0.1 ? B.amber : '#1d2944', display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 32, color: '#06101f' }}>{i + 1}</div>
            <div style={{ ...fonts.H, fontWeight: 800, fontSize: 44, color: B.white }}>{lb}</div>
          </div>)}
        </div>
        <Monitor x={1360} y={800} w={760}>
          {t < tSafe ? <AbsoluteFill style={{ fontSize: 13 }}><BSOD pct={30} /></AbsoluteFill>
            : <AbsoluteFill style={{ background: '#000', padding: 26, fontFamily: fonts.mono, color: '#d8dde8', fontSize: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}><span>Safe Mode</span><span>Safe Mode</span></div>
              {t > tFind - 0.1 && <div style={{ marginTop: 50, lineHeight: 1.8 }}>C:\Windows\System32\drivers\CrowdStrike\<div style={{ display: 'inline-block', marginTop: 14, padding: '6px 14px', borderRadius: 6, background: `${B.red}33`, border: `2px solid ${B.red}`, color: '#fff', transform: `translate(${gone * 300}px, ${gone * 160}px) scale(${1 - gone * 0.7})`, opacity: 1 - gone }}>C-00000291*.sys</div></div>}
              <div style={{ position: 'absolute', right: 30, bottom: 26, opacity: t > tDel - 0.2 ? 1 : 0 }}><Icon name={gone > 0.6 ? 'ph:trash-fill' : 'ph:trash-bold'} size={70} color={gone > 0.6 ? B.green : '#d8dde8'} /></div>
            </AbsoluteFill>}
        </Monitor>
        {t > tWalk - 0.1 && t < tSafe + 0.3 && <div style={{ position: 'absolute', left: lerp(1900, 1700, ramp(t, tWalk - 0.1, 0.8)), top: 640 }}><Icon name="ph:person-simple-walk-fill" size={220} color={B.dim} /></div>}
      </AbsoluteFill>
    );
  }
  // ---- times fifty thousand
  if (t < tBit - 0.2) {
    const done = Math.floor(ramp(t, tOneAt, C1(36) - tOneAt + 1, (x) => x) * 7);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 100, top: 120, display: 'grid', gridTemplateColumns: 'repeat(50, 30px)', gap: 5 }}>
          {Array.from({ length: 50 * 22 }, (_, i) => <div key={i} style={{ width: 30, height: 20, borderRadius: 3, background: i < done ? B.green : B.blue, opacity: i < done ? 1 : 0.85 }} />)}
        </div>
        <div style={{ position: 'absolute', left: 960, top: 560, transform: 'translate(-50%,-50%)', padding: '26px 50px', borderRadius: 24, background: 'rgba(5,10,24,.9)', textAlign: 'center' }}>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 120, color: B.white, letterSpacing: '-0.04em' }}>{done} <span style={{ color: B.dim }}>/</span> {t > tFifty ? <Count to={50000} at={tFifty} d={0.9} /> : '?'}</div>
          <Mono size={26} color={B.amber}>FIXED BY HAND · ONE AT A TIME</Mono>
        </div>
      </AbsoluteFill>
    );
  }
  // ---- BitLocker recovery key
  if (t < tServers - 0.2) {
    const digits = '483216-907561-220148-631094-775302-118463-590227-344815';
    const n = Math.floor(ramp(t, tKey + 0.4, 3.2, (x) => x) * digits.length);
    return (
      <AbsoluteFill>
        <Night />
        <Monitor x={960} y={860} w={1180}>
          <AbsoluteFill style={{ background: '#0b3a7a', padding: 50, color: '#fff', fontFamily: fonts.body }}>
            <div style={{ fontSize: 40, fontWeight: 600 }}>BitLocker recovery</div>
            <div style={{ marginTop: 18, fontSize: 24, opacity: 0.85 }}>Enter the recovery key for this drive</div>
            <div style={{ marginTop: 34, padding: '18px 22px', background: '#fff', color: '#0b1630', fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, borderRadius: 4, letterSpacing: '0.04em' }}>{digits.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
            <div style={{ marginTop: 18, fontSize: 20, opacity: 0.7 }}>48 digits · one key per computer</div>
          </AbsoluteFill>
        </Monitor>
        {t > tEvery && <Pop x={960} y={140} at={tEvery}><Tag color={B.amber} size={40}>× EVERY SINGLE MACHINE</Tag></Pop>}
      </AbsoluteFill>
    );
  }
  // ---- the keys were on servers that also crashed
  if (t < tDays - 0.2) {
    const crash = t > tAlso;
    return (
      <AbsoluteFill>
        <Night glow={crash ? 'rgba(10,108,214,.3)' : 'rgba(61,143,240,.15)'} />
        <div style={{ position: 'absolute', left: 560, top: 200, width: 420, height: 680, borderRadius: 18, background: 'linear-gradient(180deg,#1b2a4c,#0d1628)', border: '3px solid #2c4170', padding: 26 }}>
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 82, marginBottom: 18, borderRadius: 8, background: crash ? B.blue : '#0a1222', border: '2px solid #2c4170', display: 'flex', alignItems: 'center', paddingLeft: 18, gap: 10 }}>{crash ? <span style={{ ...fonts.H, fontWeight: 300, fontSize: 40, color: '#fff' }}>:(</span> : [0, 1, 2].map((k) => <div key={k} style={{ width: 10, height: 10, borderRadius: 5, background: (Math.floor(t * 4) + i + k) % 3 ? B.green : '#1a3a2a' }} />)}</div>)}
        </div>
        <div style={{ position: 'absolute', left: 1080, top: 340 }}><Icon name="ph:key-fill" size={160} color={B.amber} /><div style={{ marginTop: 10 }}><Mono size={24} color={B.amber}>ALL THE RECOVERY KEYS</Mono></div></div>
        {crash && <Pop x={1250} y={680} at={tAlso}><Tag color={B.red} size={40}>…ALSO CRASHED</Tag></Pop>}
        <div style={{ position: 'absolute', left: 1080, top: 820, opacity: 0.8 }}><Mono size={18} color={B.dim}>REPORTEDLY · SOME COMPANIES</Mono></div>
        <Gus x={300} y={1000} size={360} mood={crash ? 'sad' : 'neutral'} arm={crash ? 'shrug' : 'idle'} look={1} seed={11} />
      </AbsoluteFill>
    );
  }
  // ---- days → 99%
  const day = 19 + Math.floor(ramp(t, tDays + 0.3, t29 - tDays, EASE.inOut) * 10);
  const pct = ramp(t, t29, t99 - t29 + 0.8, EASE.out) * 99;
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: 'absolute', left: 300, top: 250, width: 380, height: 420, borderRadius: 20, background: B.paper, textAlign: 'center', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.5)' }}>
        <div style={{ height: 90, background: B.blue, ...fonts.H, fontWeight: 900, fontSize: 44, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JULY</div>
        <div style={{ ...fonts.H, fontWeight: 900, fontSize: 210, color: '#1a1a22' }}>{day}</div>
      </div>
      <div style={{ position: 'absolute', left: 800, top: 360, width: 860 }}>
        <Mono size={24} color={B.dim}>WINDOWS SENSORS BACK ONLINE</Mono>
        <div style={{ marginTop: 16, height: 70, borderRadius: 35, background: '#1d2944', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${B.blue}, ${B.green})` }} /></div>
        <div style={{ marginTop: 18, ...fonts.H, fontWeight: 900, fontSize: 110, color: B.white, letterSpacing: '-0.04em' }}>~{Math.round(pct)}%</div>
        <Mono size={18} color={B.dim}>SOURCE: CROWDSTRIKE, JULY 29, 2024</Mono>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ ACT 5 · the bill
const tCost = C0(40), tDelta = C0(41), t7000 = P(41, 'seven thousand'), tMillion = P(41, 'more than a million'), tSued = P(41, 'It sued'), tCSays = P(41, 'CrowdStrike says');
const tParam = C0(42), t54 = P(42, 'five point four'), tSorry = C0(43), tCard = P(43, 'ten dollar'), tFraud = C0(44), tFlag = P(44, 'flagged it as fraud'), tGus = C0(45);
export const a5NoCaptions: [number, number][] = [];
export const a5Sfx: SfxEvent[] = [
  { t: tCost, name: 'machine', vol: 0.35, note: 'receipt printer' }, { t: tDelta + 0.2, name: 'whooshBig', vol: 0.3 },
  { t: t7000, name: 'stomp', vol: 0.35 }, { t: t7000 + 0.4, name: 'stomp', vol: 0.3 }, { t: tMillion, name: 'popUi', vol: 0.3 }, { t: tSued, name: 'woodHit', vol: 0.6, note: 'gavel' }, { t: tCSays, name: 'popup', vol: 0.3 },
  { t: t54, name: 'moneyBag', vol: 0.4 }, { t: t54 + 0.3, name: 'coins', vol: 0.35 },
  { t: tCard - 0.1, name: 'swoosh', vol: 0.35 }, { t: tCard + 0.3, name: 'sparkle', vol: 0.3 }, { t: tFlag, name: 'alarm', vol: 0.3, dur: 1 }, { t: tFlag + 0.05, name: 'stomp', vol: 0.45 },
  { t: tGus, name: 'rimshot', vol: 0.4 },
];
export const A5: React.FC = () => {
  const { f, fps, t } = useTF();
  if (t < tDelta - 0.2) {
    const roll = ramp(t, tCost + 0.2, 1.6, EASE.out);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 960, top: 120, transform: 'translateX(-50%)', width: 520, height: 700 * roll, overflow: 'hidden', background: B.paper, boxShadow: '0 30px 70px rgba(0,0,0,.5)', padding: '30px 34px', fontFamily: fonts.mono, color: '#2a2a35' }}>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', textAlign: 'center' }}>RECEIPT · JULY 19</div>
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 700 }}><span>1 × EXTRA NUMBER</span><span style={{ color: B.red }}>$ ???</span></div>
          <div style={{ marginTop: 20, borderTop: '2px dashed #9a917c' }} />
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tParam - 0.2) {
    const cancelled = Math.floor(ramp(t, t7000 - 0.2, 1.2) * 24);
    return (
      <AbsoluteFill>
        <Night />
        <div style={{ position: 'absolute', left: 120, top: 120 }}><Mono size={26} color={B.white}>DELTA AIR LINES · ITS OWN CLAIMS</Mono></div>
        <div style={{ position: 'absolute', left: 120, top: 190, display: 'grid', gridTemplateColumns: 'repeat(8, 110px)', gap: 16 }}>
          {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: 'relative', height: 90, borderRadius: 12, background: '#13213e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ph:airplane-tilt-fill" size={56} color={i < cancelled ? '#4a5878' : B.white} />{i < cancelled && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '90%', height: 8, background: B.red, transform: 'rotate(-20deg)', borderRadius: 4 }} /></div>}</div>)}
        </div>
        <div style={{ position: 'absolute', left: 120, top: 560, display: 'flex', gap: 30 }}>
          {t > t7000 - 0.1 && <Pop x={230} y={70} at={t7000 - 0.1}><Card pad={24}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 76, color: B.white }}>~<Count to={7000} at={t7000} d={1} /></div><Mono size={18} color={B.red}>FLIGHTS CANCELLED</Mono></Card></Pop>}
          {t > tMillion - 0.1 && <Pop x={680} y={70} at={tMillion - 0.1}><Card pad={24}><div style={{ ...fonts.H, fontWeight: 900, fontSize: 76, color: B.white }}>1M+</div><Mono size={18} color={B.amber}>PASSENGERS AFFECTED</Mono></Card></Pop>}
        </div>
        {t > tSued - 0.1 && <Pop x={1500} y={380} at={tSued - 0.1}><div style={{ textAlign: 'center' }}><Icon name="ph:gavel-fill" size={170} color={B.amber} style={{ margin: '0 auto' }} /><div style={{ ...fonts.H, fontWeight: 900, fontSize: 80, color: B.white }}>$500M+</div><Mono size={20} color={B.amber}>LAWSUIT</Mono></div></Pop>}
        <Bubble x={1440} y={930} at={tCSays} text="Delta's slow recovery was the real problem." w={560} size={30} />
        {t > tCSays && <div style={{ position: 'absolute', left: 1240, top: 950 }}><Mono size={18} color={B.dim}>— CROWDSTRIKE'S RESPONSE</Mono></div>}
      </AbsoluteFill>
    );
  }
  if (t < tSorry - 0.2) {
    return (
      <AbsoluteFill>
        <Night glow="rgba(247,178,59,.12)" />
        <div style={{ position: 'absolute', left: 960, top: 480, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 230, color: B.white, letterSpacing: '-0.05em', lineHeight: 1 }}>$<Count from={0.1} to={5.4} at={tParam + 0.2} d={t54 - tParam + 0.6} fmt={(n) => n.toFixed(1)} /><span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 400, color: B.amber }}> billion</span></div>
          <div style={{ marginTop: 20 }}><Mono size={26} color={B.white}>LOST BY THE BIGGEST US COMPANIES</Mono></div>
          <div style={{ marginTop: 10 }}><Mono size={18} color={B.dim}>ESTIMATE · PARAMETRIX, AN INSURANCE FIRM</Mono></div>
        </div>
      </AbsoluteFill>
    );
  }
  if (t < tGus - 0.2) {
    const s = springAt(f, fps, tSorry + 0.3, { damping: 13, stiffness: 150 });
    const flagged = t > tFlag;
    return (
      <AbsoluteFill>
        <Night glow="rgba(60,240,160,.1)" />
        <div style={{ position: 'absolute', left: 960, top: 500, transform: `translate(-50%,-50%) translateY(${(1 - s) * 300}px) rotate(${-6 + (flagged ? Math.sin(t * 40) * 3 * (1 - ramp(t, tFlag + 0.3, 0.6)) : 0)}deg)`, width: 700, height: 420, borderRadius: 30, background: 'linear-gradient(135deg,#0f3d2e,#06c167 120%)', boxShadow: '0 40px 90px rgba(0,0,0,.55)', padding: 44, opacity: clamp(s * 1.5) }}>
          <Mono size={22} color="#d8f5e6">GIFT CARD · UBER EATS</Mono>
          <div style={{ ...fonts.H, fontWeight: 900, fontSize: 170, color: '#fff', letterSpacing: '-0.04em', marginTop: 20, opacity: ramp(t, tCard - 0.1, 0.2), transform: `scale(${0.7 + 0.3 * springAt(f, fps, tCard - 0.1, { damping: 9, stiffness: 220 })})`, transformOrigin: '0 50%' }}>$10</div>
          <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 46, color: '#d8f5e6' }}>sorry about that.</div>
        </div>
        <Stamp x={1080} y={560} at={tFlag + 0.05} text="FLAGGED AS FRAUD" size={72} rot={-12} />
      </AbsoluteFill>
    );
  }
  // ---- $10 vs $5.4B
  const tip = ramp(t, tGus + 0.5, 0.7, EASE.back);
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: 'absolute', left: 960, top: 520, width: 10, height: 420, background: '#6a7896', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', left: 960, top: 520, width: 1000, height: 10, borderRadius: 5, background: '#8b98b4', transform: `translateX(-50%) rotate(${tip * 14}deg)` }}>
        <div style={{ position: 'absolute', left: -60, top: -170, width: 240, height: 150, borderRadius: 16, background: 'linear-gradient(135deg,#0f3d2e,#06c167)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 64, color: '#fff', transform: `rotate(${-tip * 14}deg)` }}>$10</div>
        <div style={{ position: 'absolute', right: -80, top: -260, width: 300, height: 240, borderRadius: 16, background: `linear-gradient(135deg, ${B.amber}, #b07a10)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...fonts.H, fontWeight: 900, fontSize: 60, color: '#1a1206', transform: `rotate(${-tip * 14}deg)` }}>$5.4B<span style={{ fontSize: 22, fontWeight: 700 }}>THE OUTAGE</span></div>
      </div>
      <Gus x={1580} y={1010} size={300} mood="confused" arm="shrug" talk={t < C1(45) ? Math.abs(Math.sin(t * 14)) : 0} seed={12} />
    </AbsoluteFill>
  );
};
