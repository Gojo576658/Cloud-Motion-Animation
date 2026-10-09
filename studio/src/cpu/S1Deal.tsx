// Scene 1 · The deal — Leo finds the listing, SPOILER freeze-frame, Chip arrives and installs,
// Valorant kicks Leo out (literal boot), the fix-it montage, old CPU works, support's terrifying reply.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, lerp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Leo, type LeoMood } from './chars';
import { GamerRoom, FreezeFrame, Boot, Burst, Bubble, Spotlight, Stamp } from './fx';

const A = S0(1), Z = S1(1);
const tMeet = P(6, 'Meet Leo'), tName = P(6, "That's not"), tGermany = P(6, 'Germany'), tDeal = P(6, 'found a deal');
const tUsed = C0(7), tKlein = P(7, 'on Kleinanzeigen'), tFlea = P(7, 'Basically'), tGood = P(7, 'Good price'), tGreat = P(7, 'Great chip'), tWrong = P(7, 'What could');
const tSpoil = C0(8), tSep = C0(9), tArrive = P(9, 'Chip arrives'), tInstall = P(9, 'installs'), tBoots = P(9, 'Windows boots'), tWorks = P(9, 'Everything works'), tOpens = P(9, 'opens Valorant');
const tKick = P(10, 'kicks'), tTries = C0(11), tRestart = P(11, 'restarts'), tDrivers = P(11, 'updates'), tReinst = P(11, 'reinstalls'), tOffOn = P(11, 'turns it off');
const tKicked = C0(12), tOld = C0(13), tPerfect = P(13, 'works perfectly');
const tIn = P(14, 'Put Chip in'), tK2 = P(14, 'Kicked'), tOut = P(14, 'Take Chip out'), tFine = P(14, 'Fine'), tWrites = P(14, 'So Leo writes'), tAnswer = P(14, 'And the answer'), tTerr = P(14, 'terrifying');
const tAcc = C0(15), tHwBan = P(15, 'hardware banned'), tAug = P(15, 'August twelfth');
const tMonth = C0(16), tBought = P(16, 'bought it'), tPast = C0(17), tPastEnd = PE(17, 'past');
export const s1NoCaptions: [number, number][] = [[tSpoil - 0.05, tSep - 0.2]];

const ATTEMPTS: [string, string, number][] = [['ph:arrow-clockwise-bold', 'RESTARTING…', tRestart], ['ph:download-simple-bold', 'UPDATING DRIVERS…', tDrivers], ['ph:arrows-counter-clockwise-bold', 'REINSTALLING…', tReinst], ['ph:power-bold', 'OFF… AND ON AGAIN', tOffOn]];
export const s1Sfx: SfxEvent[] = [
  { t: tMeet - 0.05, name: 'whooshQuick', vol: 0.35, note: 'Leo name tag' }, { t: tName, name: 'paperSlide', vol: 0.3, note: 'not his real name' },
  { t: tGermany - 0.04, name: 'popUi', vol: 0.35, note: 'Germany pin' },
  { t: tUsed - 0.2, name: 'zoomIn', vol: 0.4, note: 'push into the monitor' }, { t: tKlein, name: 'popup', vol: 0.3, note: 'listing' },
  { t: tFlea, name: 'pageTurn', vol: 0.3, note: 'flea market grid scroll' },
  { t: tGood - 0.05, name: 'coins', vol: 0.5, note: 'ka-ching' }, { t: tGreat - 0.03, name: 'sparkle', vol: 0.35, note: 'Chip winks' },
  { t: tWrong + 0.2, name: 'cartoonLaugh', vol: 0.3, note: 'heart eyes' },
  { t: tSpoil - 0.06, name: 'scratch', vol: 0.75, note: 'record scratch freeze' }, { t: tSpoil + 0.35, name: 'badJoke', vol: 0.35 },
  { t: tSep - 0.05, name: 'pageTurn', vol: 0.45, note: 'calendar flip' },
  { t: tArrive - 0.25, name: 'fallWhistle', vol: 0.3, note: 'box drops' }, { t: tArrive + 0.05, name: 'woodHit', vol: 0.5, note: 'box lands' }, { t: tArrive + 0.45, name: 'sillyPop', vol: 0.35, note: 'Chip pops out' },
  { t: tInstall - 0.1, name: 'boing', vol: 0.35, note: 'Chip jumps into socket' }, { t: tInstall + 0.35, name: 'lockQuick', vol: 0.55, note: 'socket lever' },
  { t: tBoots - 0.05, name: 'powerUp', vol: 0.35, note: 'boot' }, { t: tWorks - 0.05, name: 'success', vol: 0.4 },
  { t: tOpens - 0.05, name: 'drumRoll', vol: 0.3, dur: 1.4, note: 'launch suspense' },
  { t: tKick - 0.22, name: 'whooshQuick', vol: 0.4, note: 'boot wind-up' }, { t: tKick, name: 'punch', vol: 0.75, note: 'KICK' }, { t: tKick + 0.05, name: 'fallWhistle', vol: 0.45, note: 'Leo flies away' },
  { t: tKick + 0.15, name: 'error', vol: 0.3, note: 'DISCONNECTED' },
  { t: tTries - 0.1, name: 'whooshQuick', vol: 0.3, note: 'Leo back' },
  ...ATTEMPTS.flatMap(([, , at]) => [{ t: at - 0.05, name: 'clickModern' as const, vol: 0.35 }, { t: at + 0.7, name: 'negGuitar' as const, vol: 0.32, note: 'KICKED toast' }]),
  { t: tKicked - 0.18, name: 'whooshBig', vol: 0.4 }, { t: tKicked - 0.02, name: 'punch', vol: 0.75 }, { t: tKicked + 0.08, name: 'splat', vol: 0.65, note: 'Leo pancake on the lens' }, { t: tKicked + 0.35, name: 'fallWhistle', vol: 0.35, note: 'slides down' },
  { t: tOld - 0.05, name: 'boing', vol: 0.3, note: 'Chip hops out' }, { t: tOld + 0.4, name: 'lockQuick', vol: 0.5, note: 'old CPU clicks in' },
  { t: tPerfect - 0.05, name: 'levelUp', vol: 0.45, note: 'CONNECTED' },
  { t: tIn - 0.03, name: 'negGuitar', vol: 0.4 }, { t: tK2 - 0.03, name: 'punch', vol: 0.5 }, { t: tOut - 0.03, name: 'swoosh', vol: 0.3 }, { t: tFine - 0.03, name: 'confirm', vol: 0.45 },
  { t: tWrites - 0.05, name: 'typing', vol: 0.35, dur: 1.8, note: 'support ticket' },
  { t: tAnswer - 0.05, name: 'notification', vol: 0.4, note: 'new reply' }, { t: tTerr - 0.1, name: 'suspenseCartoon', vol: 0.4 },
  { t: tAcc - 0.1, name: 'paperSlide', vol: 0.4, note: 'email card' }, { t: tHwBan - 0.02, name: 'marker', vol: 0.5, note: 'highlight' },
  { t: tAug - 0.03, name: 'stomp', vol: 0.45, note: 'AUG 12' },
  { t: tMonth - 0.05, name: 'whooshQuick', vol: 0.3, note: 'timeline' }, { t: tBought - 0.1, name: 'gasp', vol: 0.55, note: 'Leo jaw drop' },
  { t: tPast - 0.1, name: 'suspenseStrings', vol: 0.5, note: 'Chip had a past' }, { t: tPast + 0.5, name: 'toyWhistle', vol: 0.25, note: 'nervous whistle' },
];

// ---- monitor screen contents over time
const Screen: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const r = rng(11);
  if (t < tUsed - 0.1) return <AbsoluteFill style={{ background: 'linear-gradient(135deg,#1b2a6b,#5a2a8a)' }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', left: 30, top: 30 + i * 80, width: 54, height: 54, borderRadius: 12, background: 'rgba(255,255,255,.18)' }} />)}</AbsoluteFill>;
  if (t < tSep - 0.2) {
    // marketplace listing
    const scroll = ramp(t, tFlea - 0.1, 1.2, EASE.inOut);
    return (
      <AbsoluteFill style={{ background: '#f4f1ea', fontFamily: fonts.body }}>
        <div style={{ height: 46, background: '#2f6f3e', display: 'flex', alignItems: 'center', padding: '0 18px', color: '#fff', fontWeight: 800, fontSize: 20 }}><Icon name="ph:storefront-bold" size={26} color="#fff" />&nbsp;Online Marketplace · Germany</div>
        {/* grid of random flea-market items that scrolls past */}
        <div style={{ position: 'absolute', left: 12, top: 58, width: 220, height: 300, overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${-scroll * 300}px)` }}>{['ph:bicycle-bold', 'ph:couch-bold', 'ph:lamp-bold', 'ph:guitar-bold', 'ph:television-simple-bold', 'ph:armchair-bold', 'ph:bathtub-bold', 'ph:baby-carriage-bold'].map((ic, i) => <div key={i} style={{ display: 'inline-flex', width: 100, height: 76, margin: 4, borderRadius: 8, background: '#e2ddd2', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={40} color="#7a7468" /></div>)}</div>
        </div>
        <div style={{ position: 'absolute', left: 246, top: 58, right: 12, bottom: 12, borderRadius: 10, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,.12)', padding: 14 }}>
          <div style={{ height: 150, borderRadius: 8, background: 'linear-gradient(160deg,#dde4ee,#c4ccd8)', position: 'relative', overflow: 'hidden' }}><Chip x={200} y={150} size={120} mood={t > tGreat ? 'wink' : 'sleepy'} seed={7} /></div>
          <div style={{ fontWeight: 800, fontSize: 21, color: '#1d1d1d', marginTop: 10 }}>Ryzen 7 5800X3D — used, like new!!</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#6b6b6b', marginTop: 4 }}>Works perfectly. No problems. Quick sale.</div>
          {t > tGood - 0.05 && <div style={{ position: 'absolute', right: 16, top: 128, transform: `rotate(-8deg) scale(${springAt(f, fps, tGood - 0.05, { damping: 9, stiffness: 220 })})`, padding: '6px 14px', borderRadius: 8, background: '#3cbf6e', color: '#fff', fontWeight: 900, fontSize: 22 }}>GOOD PRICE ✓</div>}
        </div>
        {void r}
      </AbsoluteFill>
    );
  }
  if (t < tBoots) return <AbsoluteFill style={{ background: 'linear-gradient(135deg,#1b2a6b,#5a2a8a)' }} />;
  if (t < tWorks) return <AbsoluteFill style={{ background: '#05070c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 + t * 6; return <div key={i} style={{ position: 'absolute', left: 326 + Math.cos(a) * 30, top: 186 + Math.sin(a) * 30, width: 8, height: 8, borderRadius: 4, background: '#fff', opacity: 0.3 + 0.7 * ((i / 6 + t) % 1) }} />; })}</AbsoluteFill>;
  if (t < tOpens - 0.1) return <AbsoluteFill style={{ background: '#0b1630', padding: 40, fontFamily: fonts.head, fontWeight: 800, fontSize: 34, color: C.green }}>{['CPU', 'RAM', 'GPU', 'SSD'].map((k, i) => <div key={k} style={{ opacity: ramp(t, tWorks + i * 0.15, 0.15) }}>✓ {k}</div>)}</AbsoluteFill>;
  if (t < tKick + 0.05) return <AbsoluteFill style={{ background: 'linear-gradient(160deg,#1a0b14,#3a0f1f)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: '#ff4655', letterSpacing: '0.06em' }}>VALORANT</div><div style={{ padding: '10px 40px', borderRadius: 8, background: '#ff4655', fontFamily: fonts.head, fontWeight: 900, fontSize: 30, color: '#fff', transform: `scale(${1 + 0.04 * Math.sin(t * 8)})` }}>PLAY</div></AbsoluteFill>;
  if (t < tTries) return <AbsoluteFill style={{ background: '#1a0508', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 52, color: C.red, textShadow: `0 0 30px ${C.red}` }}>DISCONNECTED</AbsoluteFill>;
  if (t < tOld) {
    const k = ATTEMPTS.reduce((acc, a, i) => (t >= a[2] - 0.1 ? i : acc), -1);
    if (k < 0) return <AbsoluteFill style={{ background: '#1a0508' }} />;
    const [ic, label, at] = ATTEMPTS[k];
    const prog = ramp(t, at, 0.65, EASE.inOut);
    const fail = t > at + 0.68;
    return (
      <AbsoluteFill style={{ background: fail ? '#1a0508' : '#0b1630', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Icon name={ic} size={86} color={fail ? C.red : C.cyan} style={{ transform: k < 3 && !fail ? `rotate(${t * 360}deg)` : undefined }} />
        <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: fail ? C.red : C.ink }}>{fail ? '✗ KICKED' : label}</div>
        {!fail && <div style={{ width: 360, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.12)' }}><div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 6, background: C.cyan }} /></div>}
      </AbsoluteFill>
    );
  }
  if (t < tWrites - 0.1) return <AbsoluteFill style={{ background: t > tPerfect - 0.1 ? '#06231a' : '#0b1630', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 50, color: t > tPerfect - 0.1 ? C.green : C.dim }}>{t > tPerfect - 0.1 ? '✓ CONNECTED' : 'LOADING…'}</AbsoluteFill>;
  // support ticket + reply notification
  const msg = 'Subject: BANNED?? I did NOTHING wrong!!';
  const n = Math.floor(clamp((t - tWrites) / 1.6) * msg.length);
  return (
    <AbsoluteFill style={{ background: '#eef1f6', fontFamily: fonts.body, padding: 24 }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: '#1d2433' }}>Riot Support · New ticket</div>
      <div style={{ marginTop: 14, padding: 14, borderRadius: 8, background: '#fff', border: '1px solid #cfd6e4', fontWeight: 700, fontSize: 20, color: '#1d2433', minHeight: 90 }}>{msg.slice(0, n)}<span style={{ color: C.red }}>|</span></div>
      {t > tAnswer - 0.05 && <div style={{ position: 'absolute', right: 20, bottom: 20, padding: '12px 18px', borderRadius: 10, background: '#1d2433', color: '#fff', fontWeight: 800, fontSize: 20, display: 'flex', gap: 10, alignItems: 'center', boxShadow: `0 0 ${20 + 10 * Math.sin(t * 6)}px ${C.red}`, transform: `translateY(${(1 - ramp(t, tAnswer - 0.05, 0.3, EASE.back)) * 60}px)` }}><Icon name="ph:envelope-simple-bold" size={26} color={C.red} />1 new reply</div>}
    </AbsoluteFill>
  );
};

export const S1Deal: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  // Leo's state
  const kickU = ramp(t, tKick, 0.5, EASE.out);
  const back = ramp(t, tTries - 0.1, 0.45, EASE.out);
  const leoGone = t > tKick && t < tTries - 0.1;
  const leoMood: LeoMood = t > tBought - 0.1 ? 'shock' : t > tWrites && t < tAnswer ? 'determined' : t > tPerfect ? 'sideeye' : t > tTries ? 'determined' : t > tKick ? 'shock' : t > tWrong ? 'heart' : t > tDeal ? 'excited' : 'neutral';
  const cam = [
    { t: A, x: 960, y: 560, z: 1.0 },
    { t: tUsed - 0.2, x: 960, y: 560, z: 1.0 },
    { t: tUsed + 0.5, x: 960, y: 500, z: 2.35, e: EASE.inOut },
    { t: tSpoil, x: 960, y: 500, z: 2.45, e: EASE.smooth },
    { t: tSep - 0.2, x: 960, y: 500, z: 2.45 },
    { t: tSep + 0.3, x: 1000, y: 580, z: 1.0, e: EASE.inOut },
    { t: tBoots - 0.25, x: 1000, y: 580, z: 1.0 },
    { t: tBoots + 0.25, x: 960, y: 500, z: 1.5, e: EASE.inOut },
    { t: tKick - 0.4, x: 960, y: 500, z: 1.55, e: EASE.smooth },
    { t: tKick - 0.1, x: 900, y: 580, z: 1.0, e: EASE.inOut },
    { t: tTries + 0.2, x: 960, y: 560, z: 1.0, e: EASE.inOut },
    { t: tRestart - 0.35, x: 960, y: 560, z: 1.0 },
    { t: tRestart + 0.1, x: 960, y: 500, z: 1.45, e: EASE.inOut },
    { t: tKicked - 0.35, x: 960, y: 500, z: 1.5, e: EASE.smooth },
    { t: tKicked, x: 960, y: 560, z: 1.0, e: EASE.inOut },
  ];
  // box + calendar
  const boxDrop = ramp(t, tArrive - 0.3, 0.32, EASE.in);
  const boxOpen = ramp(t, tArrive + 0.35, 0.3, EASE.out);
  const cal = t >= tSep ? 21 : 20;
  const flip = ramp(t, tSep - 0.05, 0.35, EASE.inOut);
  // socket close-ups
  const sock1 = t > tInstall - 0.3 && t < tBoots - 0.05;
  const sock2 = t > tOld - 0.2 && t < tPerfect - 0.15;
  const split = t > tIn - 0.2 && t < tWrites - 0.1;
  const email = t > tAcc - 0.15 && t < tMonth - 0.05;
  const tline = t > tMonth - 0.1 && t < tPast - 0.1;
  const pastU = t > tPast - 0.15;
  const pancake = t > tKicked - 0.05 && t < tOld - 0.15;
  const room = (
    <Camera keys={cam}>
      <Layer depth={0.92}>
        <GamerRoom screen={<Screen />} />
        {/* wall calendar */}
        <div style={{ position: 'absolute', left: 1640, top: 470, width: 150, height: 170, borderRadius: 10, background: '#f2efe6', boxShadow: '0 10px 30px rgba(0,0,0,.5)', overflow: 'hidden', fontFamily: fonts.head }}>
          <div style={{ height: 44, background: C.red, color: '#fff', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SEP</div>
          <div style={{ fontWeight: 900, fontSize: 84, color: '#1d1d1d', textAlign: 'center', lineHeight: '120px' }}>{cal}</div>
          {flip > 0 && flip < 1 && <div style={{ position: 'absolute', left: 0, top: 44, width: '100%', height: 126, background: '#e6e1d4', transformOrigin: '50% 0', transform: `perspective(400px) rotateX(${flip * 160}deg)` }} />}
        </div>
      </Layer>
      <Layer depth={1}>
        {/* delivery box on the desk */}
        {t > tArrive - 0.3 && t < tInstall + 0.2 && (
          <div style={{ position: 'absolute', left: 1080, top: lerp(-300, 640, boxDrop), width: 240, height: 180, opacity: 1 - ramp(t, tInstall - 0.05, 0.2) }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#c8955a,#a87440)', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,.5)' }} />
            <div style={{ position: 'absolute', left: 100, top: 0, width: 40, height: '100%', background: 'rgba(255,255,255,.18)' }} />
            <div style={{ position: 'absolute', left: 0, top: -6, width: 120, height: 22, background: '#b8844c', transformOrigin: '0 50%', transform: `rotate(${-boxOpen * 120}deg)` }} />
            <div style={{ position: 'absolute', right: 0, top: -6, width: 120, height: 22, background: '#b8844c', transformOrigin: '100% 50%', transform: `rotate(${boxOpen * 120}deg)` }} />
            {boxOpen > 0 && <Chip x={120} y={10 - boxOpen * 60} size={130} mood="happy" arms="wave" seed={3} />}
          </div>
        )}
      </Layer>
      {/* Leo in the foreground */}
      <Layer depth={1.15}>
        {pancake ? null : !leoGone ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: t > tTries - 0.2 ? `translateX(${(1 - back) * -700}px)` : undefined }}>
            <Leo x={330} y={1100} size={600} mood={leoMood} look={0.8} typing={(t > tWrites && t < tAnswer) || (t > tTries && t < tKicked)} />
          </div>
        ) : (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${-kickU * 1300}px, ${-kickU * 380 + kickU * kickU * 120}px) rotate(${-kickU * 160}deg)`, transformOrigin: '330px 800px' }}>
            <Leo x={330} y={1100} size={600} mood="shock" />
          </div>
        )}
        <Boot x={430} y={760} at={tKick} size={360} />
        <Burst x={420} y={760} at={tKick} />
      </Layer>
    </Camera>
  );
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      <FreezeFrame at={tSpoil - 0.04} out={tSep - 0.2} label="SPOILER: EVERYTHING.">{room}</FreezeFrame>
      {/* name tag + Germany pin */}
      {t > tMeet - 0.1 && t < tUsed && (
        <div style={{ position: 'absolute', left: 520, top: 380, transformOrigin: '50% 0', transform: `rotate(${Math.sin((t - tMeet) * 6) * 12 * Math.max(0, 1 - (t - tMeet) * 0.8)}deg) scale(${springAt(f, fps, tMeet - 0.05, { damping: 10, stiffness: 200 })})`, opacity: 1 - ramp(t, tUsed - 0.3, 0.25) }}>
          <div style={{ width: 2, height: 40, margin: '0 auto', background: '#cfd6e4' }} />
          <div style={{ padding: '12px 30px', borderRadius: 14, background: '#fff', border: '4px solid #1d2433', fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: '#1d2433' }}>LEO</div>
          <div style={{ marginTop: 6, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, color: C.amber, opacity: ramp(t, tName, 0.3) }}>* not his real name</div>
        </div>
      )}
      {t > tGermany - 0.05 && t < tUsed && (
        <div style={{ position: 'absolute', left: 1390, top: 140, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px', borderRadius: 999, background: 'rgba(8,12,24,.88)', border: '2px solid rgba(255,255,255,.2)', transform: `scale(${springAt(f, fps, tGermany - 0.05, { damping: 11, stiffness: 200 })})`, opacity: 1 - ramp(t, tUsed - 0.3, 0.25), fontFamily: fonts.head, fontWeight: 800, fontSize: 32, color: C.ink }}>
          <div style={{ width: 42, height: 28, borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}><div style={{ flex: 1, background: '#000' }} /><div style={{ flex: 1, background: '#dd0000' }} /><div style={{ flex: 1, background: '#ffce00' }} /></div>GERMANY
        </div>
      )}
      {/* coins burst on "good price" */}
      {t > tGood && t < tGood + 1 && Array.from({ length: 10 }, (_, i) => { const u = ramp(t, tGood, 0.9, EASE.out); const a = -Math.PI / 2 + (i - 4.5) * 0.25; return <div key={i} style={{ position: 'absolute', left: 1300 + Math.cos(a) * u * 260, top: 360 + Math.sin(a) * u * 260 + u * u * 200, width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #fff2b0, #e0a800)', border: '3px solid #b8860b', opacity: 1 - u }} />; })}
      {/* socket close-up 1: Chip installs */}
      {sock1 && <Socket chip="new" at={tInstall - 0.3} />}
      {/* fix-it montage KICKED toasts are on the monitor; "Kicked." pancake on the lens */}
      {pancake && (() => {
        const hit = ramp(t, tKicked - 0.05, 0.12, EASE.in), slide = ramp(t, tKicked + 0.35, 0.6, EASE.in);
        return (
          <AbsoluteFill>
            <AbsoluteFill style={{ background: `rgba(0,0,0,${0.35 * hit})` }} />
            <div style={{ position: 'absolute', left: 960, top: 560 + slide * 700, transform: `translate(-50%,-50%) scale(${lerp(0.4, 1.9, hit)}, ${lerp(0.4, 1.9, hit) * (1 - 0.35 * hit)})` }}>
              <svg width="0" height="0" />
              <div style={{ position: 'relative', width: 600, height: 660 }}><Leo x={300} y={660} size={600} mood="shock" /></div>
            </div>
            {hit >= 1 && <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 30%, rgba(255,255,255,.08) 31%, transparent 34%)' }} />}
          </AbsoluteFill>
        );
      })()}
      {/* socket close-up 2: old CPU swaps in */}
      {sock2 && <Socket chip="old" at={tOld - 0.2} />}
      {/* Chip in / Chip out split */}
      {split && (
        <AbsoluteFill style={{ background: '#070b16', opacity: ramp(t, tIn - 0.2, 0.2) * (1 - ramp(t, tWrites - 0.3, 0.2)) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: t > tK2 ? `rgba(255,46,77,${0.18 + 0.08 * Math.sin(t * 10)})` : 'transparent' }} />
          <div style={{ position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: t > tFine ? 'rgba(60,240,160,.16)' : 'transparent' }} />
          <div style={{ position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: 'rgba(255,255,255,.4)' }} />
          <Chip x={480} y={700} size={300} mood={t > tK2 ? 'shock' : 'happy'} seed={2} />
          <div style={{ position: 'absolute', left: 1440, top: 480, transform: 'translateX(-50%)', opacity: ramp(t, tOut - 0.05, 0.2) }}><Icon name="ph:cpu-bold" size={180} color="rgba(255,255,255,.18)" /></div>
          <div style={{ position: 'absolute', left: 480, top: 170, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 72, color: C.ink, whiteSpace: 'nowrap' }}>CHIP IN</div>
          <div style={{ position: 'absolute', left: 1440, top: 170, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 72, color: C.ink, opacity: ramp(t, tOut - 0.05, 0.2), whiteSpace: 'nowrap' }}>CHIP OUT</div>
          <Stamp x={480} y={850} at={tK2 - 0.02} text="✗ KICKED" size={90} rot={-6} />
          <Stamp x={1440} y={850} at={tFine - 0.02} text="✓ FINE" size={90} rot={5} color={C.green} />
        </AbsoluteFill>
      )}
      {/* support's reply */}
      {email && (
        <AbsoluteFill style={{ background: 'rgba(5,7,12,.86)', opacity: ramp(t, tAcc - 0.15, 0.25) * (1 - ramp(t, tMonth - 0.3, 0.2)) }}>
          <Pill x={960} y={150} at={tAcc - 0.1} color={C.amber} center size={30}><Icon name="ph:user-bold" size={30} color={C.ink} /> ACCORDING TO LEO</Pill>
          <div style={{ position: 'absolute', left: 360, top: 260, width: 1200, padding: '44px 56px', borderRadius: 26, background: '#f6f7fb', boxShadow: '0 40px 100px rgba(0,0,0,.6)', transform: `translateY(${(1 - ramp(t, tAcc - 0.1, 0.4, EASE.out)) * 80}px)`, fontFamily: fonts.body }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 28, color: '#1d2433' }}><Icon name="ph:envelope-open-bold" size={36} color={C.red} />Re: BANNED?? I did NOTHING wrong!!</div>
            <div style={{ height: 2, background: '#dde2ec', margin: '22px 0' }} />
            <div style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.5, color: '#2a3245' }}>
              Hi Leo, this processor received a{' '}
              <span style={{ position: 'relative', whiteSpace: 'nowrap' }}><span style={{ position: 'absolute', left: -6, right: -6, top: '12%', bottom: '6%', background: '#ffd23a', transformOrigin: '0 50%', transform: `scaleX(${ramp(t, tHwBan - 0.02, 0.45, EASE.inOut)})`, borderRadius: 6 }} /><span style={{ position: 'relative', fontWeight: 900 }}>hardware ban</span></span>
              {' '}on <span style={{ fontWeight: 900, color: t > tAug ? C.red : '#2a3245' }}>August 12</span>.
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* 40-day timeline */}
      {tline && (
        <AbsoluteFill style={{ background: '#070b16', opacity: ramp(t, tMonth - 0.1, 0.2) }}>
          {(() => {
            const u = ramp(t, tMonth + 0.1, 1.2, EASE.inOut);
            return (
              <>
                <div style={{ position: 'absolute', left: 300, top: 520, width: 1320 * u, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${C.red}, ${C.amber})` }} />
                <div style={{ position: 'absolute', left: 300, top: 524, transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: C.red, boxShadow: `0 0 30px ${C.red}` }} />
                <div style={{ position: 'absolute', left: 300, top: 380, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: C.red }}>AUG 12<div style={{ fontSize: 26, color: C.dim, fontFamily: fonts.body }}>BANNED</div></div>
                {u > 0.95 && <><div style={{ position: 'absolute', left: 1620, top: 524, transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: C.amber, boxShadow: `0 0 30px ${C.amber}` }} />
                  <div style={{ position: 'absolute', left: 1620, top: 380, transform: 'translateX(-50%)', textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 56, color: C.amber }}>SEP 21<div style={{ fontSize: 26, color: C.dim, fontFamily: fonts.body }}>LEO BUYS CHIP</div></div></>}
                <div style={{ position: 'absolute', left: 960, top: 600, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 90, color: C.ink, opacity: ramp(t, tMonth + 1.1, 0.3) }}>40 DAYS <span style={{ color: C.dim, fontSize: 50 }}>earlier</span></div>
                <div style={{ position: 'absolute', left: 1480, top: 700, transform: `scale(${springAt(f, fps, tBought - 0.1, { damping: 10, stiffness: 200 })})` }}><Leo x={160} y={360} size={320} mood="shock" /></div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}
      {/* Chip… had a past */}
      {pastU && (
        <AbsoluteFill style={{ opacity: ramp(t, tPast - 0.15, 0.3) }}>
          <Spotlight on={tPast - 0.2} color="140,170,255" floor={880} />
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${1 + 0.12 * ramp(t, tPast, 1.8, EASE.smooth)})`, transformOrigin: '960px 700px' }}>
            <Chip x={960} y={880} size={340} mood="sus" sweat={1} look={Math.sin(t * 3)} seed={6} />
          </div>
          {t > tPastEnd && <Bubble x={1290} y={600} at={tPastEnd} text="♪ ♫ ♪" w={260} tail="left" size={64} />}
        </AbsoluteFill>
      )}
      <Flash at={tSpoil - 0.04} color="#fff" max={0.25} d={0.2} />
    </AbsoluteFill>
  );
};

// motherboard socket close-up: the new Chip jumps in, or swaps out for the old grumpy CPU
const Socket: React.FC<{ chip: 'new' | 'old'; at: number }> = ({ chip, at }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const inU = ramp(t, at, 0.25);
  const jump = ramp(t, at + 0.15, 0.45, EASE.in);
  const land = springAt(f, fps, at + 0.6, { damping: 7, stiffness: 260 });
  const lever = ramp(t, at + 0.6, 0.18, EASE.out);
  const chipY = chip === 'new' ? lerp(80, 640, jump) : 640;
  const oldIn = chip === 'old' ? ramp(t, at + 0.35, 0.45, EASE.in) : 0;
  return (
    <AbsoluteFill style={{ opacity: inU }}>
      <AbsoluteFill style={{ background: 'linear-gradient(160deg,#0b3a26,#062216)' }} />
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(90deg, rgba(217,180,74,.18) 2px, transparent 2px), linear-gradient(rgba(217,180,74,.12) 2px, transparent 2px)', backgroundSize: '60px 60px, 90px 90px' }} />
      <div style={{ position: 'absolute', left: 660, top: 300, width: 600, height: 520, borderRadius: 18, background: '#e9e4d6', boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 520, height: 440, borderRadius: 10, backgroundImage: 'radial-gradient(circle, #2a2a2a 2.5px, transparent 3px)', backgroundSize: '16px 16px', backgroundColor: '#d8d2c2' }} />
        <div style={{ position: 'absolute', right: -26, top: 60, width: 18, height: 380, borderRadius: 9, background: '#c9c2b0', transformOrigin: '50% 100%', transform: `rotate(${(1 - lever) * 50}deg)` }} />
      </div>
      <div style={{ position: 'absolute', left: 860, top: 120, fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.ink, opacity: 0.8 }}>AM4 SOCKET</div>
      {chip === 'new' && <Chip x={960} y={chipY} size={360} mood={land > 0.5 ? 'happy' : 'proud'} squash={t > at + 0.6 ? (1 - land) * 0.8 : 0} arms={t > at + 0.8 ? 'up' : 'none'} seed={8} />}
      {chip === 'old' && <>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${ramp(t, at, 0.4, EASE.in) * 1200}px, ${-ramp(t, at, 0.4, EASE.in) * 500}px) rotate(${ramp(t, at, 0.4) * 40}deg)`, transformOrigin: '960px 640px' }}><Chip x={960} y={640} size={360} mood="sad" seed={8} /></div>
        <Chip x={960} y={lerp(-200, 640, oldIn)} size={360} mood={t > at + 1.0 ? 'sus' : 'grumpy'} grey label="OLD CPU" seed={9} squash={oldIn >= 1 ? Math.max(0, 1 - (t - at - 0.8) * 4) * 0.5 : 0} />
      </>}
    </AbsoluteFill>
  );
};
