// S3 · What They Found: The Audio — standby capture across the whole house (12 m),
// the offline test (router callback), files piling up, the upload, the transcript, "LG says not true".
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic, Label } from '../components/Kinetic';
import { Pill, Rings, Flash, glitchOffset } from '../components/UI';
import { LivingRoom, ROUTER, PORT } from '../components/LivingRoom';
import { House, HOUSE, HOUSE_TV } from '../components/House';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, PE, S0, S1, EASE, ramp, clamp, lerp } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(3), Z = S1(3);
const tStandby = P(13, 'in standby'), tCapture = P(13, 'kept capturing'), tBg = P(13, 'picked up background'), t12 = P(13, 'twelve metres'), t40 = P(13, 'forty feet'), tHouse = P(13, 'entire house');
const tTest = C0(14), tCut = P(14, 'They cut'), tUnplug = P(14, 'off from the internet');
const tThink = C0(15), tIf = P(15, 'If a TV'), tNothing = P(15, "There's nothing"), tBut = P(15, "But that's not");
const tPiled = P(16, 'piled up'), tOffline = P(16, 'was offline'), tMoment = P(16, 'And the moment'), tBack = P(16, 'came back'), tUploaded = P(16, 'they uploaded');
const tClip = C0(17), tFinished = P(17, 'had finished'), tMoved = P(17, "They'd moved on"), tKept = P(17, 'kept writing'), tWord = P(17, 'word for word');
const tLG = P(18, 'LG says'), tOneWord = P(18, "And there's one");
const tFirst = C0(19), tLooking = P(19, 'It was also');

export const s3NoCaptions: [number, number][] = [[tLG - 0.1, PE(18, 'not true') + 0.3], [tBut - 0.1, C1(15) + 0.2], [tUploaded - 0.1, C1(16) + 0.3]];

const files = ['rec_0907_2201.pcm', 'transcript_2201.txt', 'rec_0907_2214.pcm', 'transcript_2214.txt', 'rec_0908_0136.pcm', 'transcript_0136.txt', 'rec_0908_0742.pcm'];

export const s3Sfx: SfxEvent[] = [
  { t: A + 0.3, name: 'techMove', vol: 0.3, note: 'house plan settles' },
  { t: tStandby - 0.05, name: 'bleepHi', vol: 0.25 },
  { t: tCapture - 0.05, name: 'sweepSciFi', vol: 0.4, note: 'sound rings across the house' },
  { t: tBg - 0.1, name: 'swoosh', vol: 0.35, note: 'family footage card' },
  { t: t12 - 0.1, name: 'marker', vol: 0.45, note: 'ruler draws' }, { t: t12 + 0.1, name: 'compute', vol: 0.25, dur: 1.2 },
  { t: t40 - 0.05, name: 'impactZoom', vol: 0.4 },
  { t: tTest - 0.25, name: 'whooshDeep', vol: 0.45, note: 'back to the router' },
  { t: tUnplug - 0.03, name: 'lockQuick', vol: 0.7 }, { t: tUnplug + 0.12, name: 'glitchElectric', vol: 0.4 }, { t: tUnplug + 0.3, name: 'popUi', vol: 0.35 },
  { t: tThink - 0.2, name: 'whoosh', vol: 0.4 }, { t: tIf - 0.05, name: 'tap', vol: 0.3 },
  { t: tNothing - 0.05, name: 'confirm', vol: 0.3, note: '0 KB' },
  { t: tBut - 0.05, name: 'glitchBreak', vol: 0.5, note: 'strike-through' },
  { t: C0(16) - 0.15, name: 'techSlide', vol: 0.4, note: 'storage panel' },
  ...files.map((_, i) => ({ t: tPiled - 0.2 + i * 0.45, name: 'popUi' as const, vol: 0.3 })),
  { t: tBack - 0.05, name: 'lock', vol: 0.55, note: 'plug back in' },
  { t: tUploaded - 0.25, name: 'whooshElectric', vol: 0.5, note: 'files fly up' }, { t: tUploaded + 0.9, name: 'success', vol: 0.3 },
  { t: tClip - 0.15, name: 'popup', vol: 0.4, note: 'transcript window' },
  { t: tClip + 0.6, name: 'typing', vol: 0.3, dur: 1.4 }, { t: tMoved - 0.05, name: 'bleep', vol: 0.3 },
  { t: tKept - 0.05, name: 'typing', vol: 0.35, dur: 3.2 }, { t: tWord, name: 'heartbeat', vol: 0.4 },
  { t: tLG - 0.05, name: 'stomp', vol: 0.55, note: 'stamp slam' },
  { t: tOneWord - 0.05, name: 'paperSlide', vol: 0.4, note: 'redacted bar' },
  { t: tFirst - 0.2, name: 'whooshBig', vol: 0.45, note: 'house plan returns' },
  { t: tLooking - 0.05, name: 'scan', vol: 0.4 },
];

export const S3Audio: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const houseOn = t < tTest + 0.05 || t > tFirst - 0.35;
  const routerOn = t > tTest - 0.35 && t < tThink + 0.05;
  const pulse = 0.6 + 0.4 * Math.sin(t * 3.4);
  // ruler from the TV to the far wall (12 m)
  const rul = ramp(t, t12 - 0.1, 1.4, EASE.out) * (1 - ramp(t, C1(13) - 0.3, 0.3));
  const RX0 = HOUSE_TV.x, RY = HOUSE.y + HOUSE.h - 50, RX1 = HOUSE.x + HOUSE.w - 40;
  const camHouse = [
    { t: A - 0.2, x: 960, y: 540, z: 1.12 }, { t: A + 0.9, x: 960, y: 540, z: 1.0, e: EASE.out },
    { t: tCapture, x: 900, y: 520, z: 1.04, e: EASE.smooth }, { t: t12, x: 960, y: 560, z: 0.98, e: EASE.inOut }, { t: C1(13), x: 960, y: 540, z: 1.0, e: EASE.smooth },
    { t: tFirst - 0.3, x: 760, y: 360, z: 1.5 }, { t: tLooking, x: 960, y: 560, z: 0.95, e: EASE.inOut }, { t: Z, x: 960, y: 540, z: 0.9, e: EASE.smooth },
  ];
  const R = { x: ROUTER.x + 60, y: ROUTER.y + 20 };
  const camRoom = [{ t: tTest - 0.35, x: 960, y: 560, z: 1.0 }, { t: tCut - 0.1, x: 1000, y: 560, z: 1.05, e: EASE.smooth }, { t: tUnplug - 0.1, x: R.x, y: R.y, z: 2.7, e: EASE.inOut }, { t: tThink, x: R.x + 8, y: R.y, z: 2.8, e: EASE.smooth }];
  const plug = t < tUnplug ? 1 : 1 - ramp(t, tUnplug, 0.3, EASE.back);
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.red} />
      {houseOn && (
        <Camera keys={camHouse}>
          <Layer depth={0.6}><Grid opacity={0.2} /></Layer>
          <Layer depth={1}>
            <div style={{ position: 'absolute', inset: 0, transform: 'perspective(1800px) rotateX(18deg)', transformOrigin: '50% 60%' }}>
              <House led={1} />
              <Rings x={HOUSE_TV.x} y={HOUSE_TV.y} at={tCapture - 0.1} out={C1(13) - 0.2} color={C.red} max={1300} count={6} speed={0.35} />
              {t > tLooking - 0.2 && <Rings x={HOUSE_TV.x} y={HOUSE_TV.y} at={tLooking - 0.1} out={Z + 0.5} color={C.cyan} max={1300} count={4} speed={0.5} />}
              {rul > 0 && (
                <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible' }}>
                  <line x1={RX0} y1={RY} x2={lerp(RX0, RX1, rul)} y2={RY} stroke={C.amber} strokeWidth="6" strokeLinecap="round" />
                  {Array.from({ length: 13 }, (_, k) => { const xx = lerp(RX0, RX1, k / 12); return xx <= lerp(RX0, RX1, rul) + 1 ? <line key={k} x1={xx} y1={RY - (k % 4 ? 12 : 24)} x2={xx} y2={RY + (k % 4 ? 12 : 24)} stroke={C.amber} strokeWidth="4" /> : null; })}
                  <line x1={RX0} y1={HOUSE_TV.y + 20} x2={RX0} y2={RY} stroke={C.amber} strokeWidth="2" strokeDasharray="8 8" opacity={rul} />
                </svg>
              )}
            </div>
          </Layer>
        </Camera>
      )}
      {t > t12 - 0.1 && t < C1(13) && <Distance at={t12} t40={t40} out={C1(13) - 0.2} />}
      <Pill x={120} y={150} at={tStandby - 0.1} out={tBg - 0.2} color={C.red}><Icon name="ph:moon-bold" size={30} color={C.ink} />Screen off · standby · mic on</Pill>
      <Footage src="stock/family-couch.mp4" at={tBg - 0.1} out={t12 - 0.2} x={1180} y={560} w={620} h={350} radius={26} enter="scale" label="BACKGROUND CONVERSATION" tint="#401020" />

      {/* the offline test: same living room, same router */}
      {routerOn && (
        <AbsoluteFill style={{ opacity: ramp(t, tTest - 0.35, 0.3) }}>
          <Camera keys={camRoom}><LivingRoom led={pulse} plug={plug} net={t > tUnplug + 0.1 ? 0 : 1} /></Camera>
          <Pill x={1240} y={300} at={tUnplug + 0.25} out={tThink} color={C.red}><Icon name="ph:wifi-slash-bold" size={30} color={C.ink} />Offline</Pill>
          {t > tUnplug && t < tUnplug + 0.5 && <Flash at={tUnplug + 0.05} color={C.red} max={0.22} d={0.4} />}
        </AbsoluteFill>
      )}

      {/* logic + storage + upload + transcript (dark stage) */}
      {t > tThink - 0.2 && t < tFirst - 0.1 && (
        <AbsoluteFill style={{ opacity: ramp(t, tThink - 0.2, 0.3) * (1 - ramp(t, tFirst - 0.35, 0.3)) }}>
          <BgMesh a="#3a1030" b={C.blue} />
          <Grid opacity={0.2} perspective={false} />
          <Logic />
          <Storage />
          <Transcript />
          <Stamp />
        </AbsoluteFill>
      )}
      <Kinetic text="It was also *looking around.*" at={tLooking} out={Z + 0.3} y={110} size={60} anim="rise" accent={C.cyan} />
      <Dust count={36} opacity={0.3} />
      <Chapter n={3} title="What They Found · The Audio" at={A + 0.4} out={Z - 0.6} color={C.red} />
      <Grade />
    </AbsoluteFill>
  );
};

const Distance: React.FC<{ at: number; t40: number; out: number }> = ({ at, t40, out }) => {
  const e = useEnter(at, out, { rise: 50, scale: 0.2 });
  if (!e.visible) return null;
  const m = 12 * EASE.out(clamp((e.t - at) / 1.3));
  return (
    <div style={{ position: 'absolute', right: 110, top: 150, textAlign: 'right', ...e.style }}>
      <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 170, lineHeight: 1, color: C.amber, textShadow: `0 0 40px ${C.amber}66`, fontVariantNumeric: 'tabular-nums' }}>{m.toFixed(0)} m</div>
      <div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 46, color: C.ink, opacity: ramp(e.t, t40 - 0.1, 0.4) }}>≈ 40 feet</div>
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 24, letterSpacing: '0.16em', color: C.dim, opacity: ramp(e.t, t40 + 0.6, 0.4) }}>THE LENGTH OF A WHOLE HOUSE</div>
    </div>
  );
};

const Logic: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const card = useEnter(tIf - 0.15, C1(15) + 0.1, { rise: 60 });
  if (!card.visible) return null;
  const strike = ramp(t, tBut, 0.35, EASE.out);
  const g = glitchOffset(t, tBut, 0.5, 18);
  return (
    <div style={{ position: 'absolute', left: 960, top: 520, transform: `translate(-50%,-50%) translateX(${g.x}px) skewX(${g.skew}deg)` }}>
      <div style={{ ...card.style, width: 1100, padding: '46px 60px', borderRadius: 30, background: 'linear-gradient(160deg, rgba(22,32,60,.9), rgba(8,12,24,.94))', border: '1px solid rgba(140,170,230,.2)', boxShadow: '0 50px 120px rgba(0,0,0,.6)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontFamily: fonts.head, fontWeight: 800, fontSize: 46, color: C.ink }}><Icon name="ph:ear-bold" size={56} color={C.cyan} />Only listens for the wake word</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 26, fontFamily: fonts.head, fontWeight: 800, fontSize: 46, color: C.ink, opacity: ramp(t, P(15, 'and deletes') - 0.1, 0.4) }}><Icon name="ph:trash-bold" size={56} color={C.cyan} />Deletes everything else</div>
        <div style={{ height: 2, background: 'rgba(255,255,255,.1)', margin: '34px 0' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, opacity: ramp(t, tNothing - 0.1, 0.4) }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: C.dim }}>WAITING TO UPLOAD</span>
          <span style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 110, color: C.green, textShadow: `0 0 30px ${C.green}66` }}>0 KB</span>
        </div>
        <div style={{ position: 'absolute', left: 40, right: 40, top: '52%', height: 12, borderRadius: 6, background: C.red, boxShadow: `0 0 30px ${C.red}`, transform: `rotate(-6deg) scaleX(${strike})`, transformOrigin: '0 50%' }} />
        {strike > 0.5 && <div style={{ position: 'absolute', right: 40, top: -30, padding: '10px 20px', borderRadius: 12, background: C.red, fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: '#fff', transform: `rotate(4deg) scale(${0.8 + 0.2 * strike})` }}>NOT WHAT HAPPENED</div>}
      </div>
    </div>
  );
};

const Storage: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const e = useEnter(C0(16) - 0.1, C1(16) + 0.3, { rise: 60 });
  if (!e.visible) return null;
  const up = ramp(t, tUploaded - 0.2, 1.2, EASE.in);
  const online = t > tBack;
  const fill = Math.min(1, files.filter((_, i) => t > tPiled - 0.2 + i * 0.45).length / files.length) * (1 - up);
  return (
    <>
      <div style={{ position: 'absolute', left: 200, top: 170, width: 760, padding: '30px 36px', borderRadius: 28, background: 'rgba(8,12,24,.94)', border: `1px solid ${online ? C.green : C.red}66`, boxShadow: '0 50px 120px rgba(0,0,0,.6)', ...e.style }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', color: online ? C.green : C.red }}><Icon name={online ? 'ph:wifi-high-bold' : 'ph:wifi-slash-bold'} size={28} color={online ? C.green : C.red} />TV LOCAL STORAGE · {online ? 'ONLINE' : 'OFFLINE'}</div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 470 }}>
          {files.map((n, i) => {
            const at = tPiled - 0.2 + i * 0.45;
            if (t < at) return null;
            const s = ramp(t, at, 0.35, EASE.back);
            const fly = ramp(t, tUploaded - 0.2 + i * 0.08, 0.7, EASE.in);
            const txt = n.endsWith('.txt');
            return <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 18px', borderRadius: 12, background: txt ? 'rgba(255,182,72,.1)' : 'rgba(255,46,77,.1)', border: `1px solid ${txt ? C.amber : C.red}55`, fontFamily: fonts.mono, fontSize: 24, color: '#ffd9df', transform: `translate(${(1 - s) * 60 + fly * 900}px, ${-fly * 420}px) scale(${1 - fly * 0.5})`, opacity: s * (1 - fly) }}><Icon name={txt ? 'ph:file-text-bold' : 'ph:file-audio-bold'} size={30} color={txt ? C.amber : C.red} />{n}</div>;
          })}
        </div>
        <div style={{ marginTop: 18, height: 14, borderRadius: 7, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}><div style={{ width: `${fill * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.red}, ${C.amber})` }} /></div>
      </div>
      {/* cloud destination */}
      <div style={{ position: 'absolute', left: 1240, top: 170, width: 480, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: ramp(t, tMoment, 0.4) * (e.style.opacity as number) }}>
        <Icon name="ph:cloud-arrow-up-bold" size={170} color={up > 0 ? C.red : C.dim} glow={up > 0} />
        <div style={{ width: 360, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}><div style={{ width: `${up * 100}%`, height: '100%', background: C.red }} /></div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: up >= 1 ? C.red : C.dim }}>{up >= 1 ? 'UPLOADED' : `UPLOADING ${Math.round(up * 100)}%`}</div>
      </div>
      <Kinetic text="…they *uploaded.*" at={tUploaded} out={C1(16) + 0.1} y={860} size={72} anim="pop" />
    </>
  );
};

const Transcript: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const e = useEnter(tClip - 0.1, C1(17) + 0.1, { rise: 70, scale: 0.08 });
  if (!e.visible) return null;
  const rows: [string, string, string, number][] = [
    ['22:14:03', 'wake_word   "Hi LG"', C.cyan, tClip + 0.6],
    ['22:14:04', 'command     "open YouTube"', C.cyan, tClip + 1.2],
    ['22:14:05', '— session ended —', '#55607a', tMoved],
    ['22:16:41', '"…yeah, I\'ll call the bank tomorrow…"', C.red, tKept],
    ['22:16:47', '"…did you send the rent already?…"', C.red, tKept + 1.1],
    ['22:17:02', '"…don\'t tell anyone about…"', C.red, tWord],
  ];
  return (
    <div style={{ position: 'absolute', left: 280, top: 200, width: 1360, padding: '34px 42px', borderRadius: 28, background: 'rgba(6,10,20,.95)', border: '1px solid rgba(255,182,72,.3)', boxShadow: '0 50px 120px rgba(0,0,0,.65)', ...e.style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', color: C.amber }}><Icon name="ph:file-text-bold" size={28} color={C.amber} />VOICE_TRANSCRIPT.LOG</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: C.red, opacity: Math.floor(t * 2) % 2 ? 1 : 0.3 }}>● REC</div>
      </div>
      <div style={{ marginTop: 26, fontFamily: fonts.mono, fontSize: 30, lineHeight: 1.85 }}>
        {rows.map(([ts, txt, col, at], i) => {
          if (t < at) return null;
          const n = Math.floor((t - at) * 40);
          return <div key={i} style={{ whiteSpace: 'pre' }}><span style={{ color: '#55607a' }}>[{ts}]  </span><span style={{ color: col }}>{txt.slice(0, n)}</span>{n < txt.length && <span style={{ color: col }}>▌</span>}</div>;
        })}
      </div>
      <div style={{ marginTop: 20, fontFamily: fonts.body, fontWeight: 600, fontSize: 18, letterSpacing: '0.14em', color: '#4c5672' }}>ILLUSTRATION OF THE BEHAVIOUR DESCRIBED IN THE REPORT</div>
    </div>
  );
};

const Stamp: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (t < tLG - 0.05 || t > C1(18) + 0.3) return null;
  const s = ramp(t, tLG - 0.05, 0.22, EASE.in);
  const red = ramp(t, tOneWord - 0.1, 0.5, EASE.out);
  const out = ramp(t, C1(18), 0.3, EASE.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: 'absolute', left: 960, top: 430, transform: `translate(-50%,-50%) rotate(-8deg) scale(${3 - 2 * s})`, opacity: s, padding: '24px 46px', border: `10px solid ${C.red}`, borderRadius: 18, fontFamily: fonts.head, fontWeight: 900, fontSize: 110, color: C.red, letterSpacing: '0.03em', textShadow: `0 0 30px ${C.red}66`, whiteSpace: 'nowrap' }}>LG SAYS: NOT TRUE</div>
      <div style={{ position: 'absolute', left: 960, top: 720, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: red }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: '0.24em', color: C.dim }}>ONE WORD MOST PEOPLE MISSED</div>
        <div style={{ margin: '22px auto 0', width: 480 * red, height: 100, borderRadius: 12, background: C.ink }} />
      </div>
    </AbsoluteFill>
  );
};
