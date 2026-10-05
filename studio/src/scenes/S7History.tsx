// S7 · It's Happened Before — one continuous camera move along a timeline:
// 2015 Samsung policy, 2017 FTC/Vizio, 2017 CIA "Weeping Angel", 2019 FBI, 2024 ACR study, 2025 Texas.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Layer } from '../components/Camera';
import { BgMesh, Grade, Footage } from '../components/Look';
import { Grid, Dust } from '../components/Backdrop';
import { Chapter, useEnter } from '../components/Blocks';
import { Kinetic } from '../components/Kinetic';
import { Flash } from '../components/UI';
import { TV } from '../components/TV';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { C0, C1, P, S0, S1, EASE, ramp, clamp, lerp, springAt } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';

const A = S0(7), Z = S1(7);
const NODES = [
  { year: '2015', x: 960, t: C0(33) }, { year: '2017', x: 2960, t: C0(34) }, { year: '2017', x: 4960, t: C0(35) },
  { year: '2019', x: 6960, t: C0(36) }, { year: '2024', x: 8960, t: C0(37) }, { year: '2025', x: 10960, t: P(37, 'In 2025') },
];
const tQuote = P(33, 'if your spoken'), tThird = P(33, 'third party');
const t11 = P(34, 'eleven million'), tSecond = P(34, 'second-by-second'), tPaid = P(34, 'paid two');
const tWiki = P(35, 'WikiLeaks'), tWeeping = P(35, 'Weeping Angel'), tFake = P(35, 'Fake-Off'), tScreen = P(35, 'The screen went'), tLights = P(35, 'the lights'), tMic = P(35, 'the microphone kept');
const tFbi = P(36, 'FBI'), tHijack = P(36, 'take over');
const tACR = P(37, 'Automatic Content'), tPics = P(37, 'take pictures'), tOver = P(37, 'Over and over'), tStudy = P(37, 'A 2024'), tTwice = P(37, 'twice every'), tLGmore = P(37, 'LG TVs even'), tMonitor = P(37, 'Even when'), tTexas = P(37, 'Texas sued');
const BRANDS: [string, number][] = [['Samsung', P(37, 'Samsung, LG')], ['LG', P(37, 'LG, Sony')], ['Sony', P(37, 'Sony')], ['Hisense', P(37, 'Hisense')], ['TCL', P(37, 'TCL')]];

export const s7NoCaptions: [number, number][] = [[tACR - 0.1, P(37, 'or ACR') + 0.6]];

export const s7Sfx: SfxEvent[] = [
  ...NODES.map((n, i) => ({ t: n.t - 0.35, name: (i ? 'whooshDeep' : 'swoosh') as SfxEvent['name'], vol: 0.4, note: `travel to ${n.year}` })),
  ...NODES.map((n) => ({ t: n.t - 0.02, name: 'typeHard' as const, vol: 0.45, note: `year ${n.year} lands` })),
  { t: tQuote - 0.05, name: 'typing', vol: 0.3, dur: 3.2 }, { t: tThird, name: 'marker', vol: 0.35 },
  { t: t11 - 0.05, name: 'compute', vol: 0.3, dur: 1.2 }, { t: tPaid - 0.05, name: 'hit', vol: 0.45, note: '$2.2M' },
  { t: tWiki - 0.05, name: 'paperSlide', vol: 0.4 }, { t: tWeeping - 0.05, name: 'stomp', vol: 0.45, note: 'classified stamp' },
  { t: tScreen - 0.05, name: 'switchLight', vol: 0.4 }, { t: tLights - 0.05, name: 'switchLight', vol: 0.4 },
  { t: tMic - 0.05, name: 'heartbeat', vol: 0.5 }, { t: tMic + 0.3, name: 'glitchStatic', vol: 0.3 },
  { t: tFbi - 0.05, name: 'error', vol: 0.4, note: 'warning' }, { t: tHijack - 0.05, name: 'glitchElectric', vol: 0.4 },
  { t: tACR - 0.05, name: 'impactZoom', vol: 0.45 },
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => ({ t: tPics + k * 0.5, name: 'shutterSoft' as const, vol: 0.35 })),
  { t: tStudy - 0.05, name: 'popUi', vol: 0.35 }, { t: tMonitor - 0.05, name: 'popElectric', vol: 0.3 },
  { t: tTexas - 0.05, name: 'hit', vol: 0.5, note: 'lawsuit' },
  ...BRANDS.map(([, at]) => ({ t: at - 0.04, name: 'tap' as const, vol: 0.3 })),
];

const Card: React.FC<{ x: number; at: number; w?: number; color?: string; children: React.ReactNode; top?: number }> = ({ x, at, w = 1100, color = C.red, children, top = 470 }) => {
  const e = useEnter(at + 0.2, undefined, { rise: 70 });
  if (!e.visible) return null;
  return <div style={{ position: 'absolute', left: x - w / 2, top, width: w, padding: '36px 44px', borderRadius: 30, background: 'linear-gradient(160deg, rgba(22,32,60,.92), rgba(8,12,24,.95))', border: `1px solid ${color}55`, boxShadow: '0 50px 120px rgba(0,0,0,.6)', ...e.style }}>{children}</div>;
};
const Tag: React.FC<{ icon: string; text: string; color: string }> = ({ icon, text, color }) => <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: '0.18em', color }}><Icon name={icon} size={32} color={color} />{text}</div>;

export const S7History: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const cam = NODES.flatMap((n, i) => [
    { t: n.t - 0.4, x: i ? NODES[i - 1].x + 70 : n.x - 300, y: 540, z: i ? 1.0 : 0.9, e: EASE.smooth },
    { t: n.t + 0.5, x: n.x, y: 540, z: 1.0, e: EASE.inOut },
  ]);
  cam.push({ t: Z, x: NODES[5].x + 160, y: 540, z: 1.04, e: EASE.smooth });
  // progress of the red line
  let k = 0; NODES.forEach((n, i) => { if (t >= n.t - 0.3) k = i; });
  const lineX = lerp(k ? NODES[k - 1].x : NODES[0].x - 900, NODES[k].x, ramp(t, NODES[k].t - 0.4, 0.8, EASE.inOut));
  return (
    <AbsoluteFill>
      <BgMesh a={C.blue} b={C.red} />
      <Camera keys={cam}>
        <Layer depth={0.5}><Grid opacity={0.2} /></Layer>
        <Layer depth={1}>
          {/* the track */}
          <div style={{ position: 'absolute', left: -600, top: 330, width: 12600, height: 4, background: '#22325a' }} />
          <div style={{ position: 'absolute', left: -600, top: 329, width: lineX + 600, height: 6, background: C.red, boxShadow: `0 0 20px ${C.red}` }} />
          {NODES.map((n, i) => {
            const on = t >= n.t - 0.1;
            const s = springAt(f, fps, n.t - 0.05, { damping: 10, stiffness: 160 });
            return (
              <React.Fragment key={i}>
                <div style={{ position: 'absolute', left: n.x - 20, top: 312, width: 40, height: 40, borderRadius: '50%', background: on ? C.red : '#22325a', boxShadow: on ? `0 0 30px ${C.red}` : undefined }} />
                {on && <div style={{ position: 'absolute', left: n.x - 40, top: 292, width: 80, height: 80, borderRadius: '50%', border: `3px solid ${C.red}`, opacity: 0.6 + 0.4 * Math.sin(t * 4), transform: `scale(${1 + 0.15 * Math.sin(t * 4)})` }} />}
                <div style={{ position: 'absolute', left: n.x, top: 140, transform: `translateX(-50%) scale(${0.6 + 0.4 * s})`, opacity: clamp(s * 1.4), fontFamily: fonts.head, fontWeight: 900, fontSize: 150, color: on ? C.ink : '#3a4a70', letterSpacing: '-0.02em' }}>{n.year}</div>
              </React.Fragment>
            );
          })}
          {/* 2015 */}
          <Card x={NODES[0].x} at={NODES[0].t}>
            <Tag icon="ph:file-text-bold" text="SAMSUNG · PRIVACY POLICY" color={C.red} />
            <div style={{ marginTop: 20, fontFamily: fonts.body, fontWeight: 600, fontSize: 48, lineHeight: 1.35, color: C.ink, minHeight: 200 }}>
              {(() => { const q = '“If your spoken words include sensitive information… it could be captured and sent to a third party.”'; const n = Math.floor(clamp((t - tQuote) / 4) * q.length); return <>{q.slice(0, n)}<span style={{ color: C.red }}>{n < q.length && t > tQuote ? '▌' : ''}</span></>; })()}
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, letterSpacing: '0.18em', color: C.dim }}>PARAPHRASED</div>
          </Card>
          {/* 2017 FTC */}
          <Card x={NODES[1].x} at={NODES[1].t} color={C.amber}>
            <Tag icon="ph:scales-bold" text="US FEDERAL TRADE COMMISSION vs VIZIO" color={C.amber} />
            <div style={{ display: 'flex', gap: 60, marginTop: 24 }}>
              <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 96, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{t > t11 - 0.1 ? `${(11 * EASE.out(clamp((t - t11) / 1))).toFixed(0)}M` : '—'}</div><div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: C.dim }}>TVS TRACKED</div></div>
              <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 96, color: C.red, fontVariantNumeric: 'tabular-nums' }}>{t > tPaid - 0.1 ? `$${(2.2 * EASE.out(clamp((t - tPaid) / 1))).toFixed(1)}M` : '—'}</div><div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: C.dim }}>PAID</div></div>
            </div>
            <div style={{ marginTop: 16, fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: C.dim, opacity: ramp(t, tSecond - 0.1, 0.4) }}>second-by-second viewing data · no proper consent</div>
          </Card>
          {/* 2017 CIA */}
          <Card x={NODES[2].x - 330} at={NODES[2].t} w={760} color={C.red} top={430}>
            <Tag icon="ph:folder-lock-bold" text="WIKILEAKS · CIA DOCUMENTS" color={C.red} />
            <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 72, color: C.ink, marginTop: 14 }}>“Weeping Angel”</div>
            <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.dim, marginTop: 6, opacity: ramp(t, tFake - 0.1, 0.4) }}>“Fake-Off” mode on certain Samsung TVs</div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Screen', 'OFF', tScreen, C.dim, 'ph:monitor-bold'], ['Lights', 'OFF', tLights, C.dim, 'ph:lightbulb-bold'], ['Microphone', 'RECORDING', tMic, C.red, 'ph:microphone-bold']].map(([k2, v, at, col, ic]) => (
                <div key={k2 as string} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: ramp(t, (at as number) - 0.1, 0.3), fontFamily: fonts.body, fontWeight: 700, fontSize: 30, color: C.ink }}><Icon name={ic as string} size={34} color={col as string} />{k2 as string}<span style={{ marginLeft: 'auto', color: col as string, fontFamily: fonts.head, fontWeight: 900 }}>{v as string}</span></div>
              ))}
            </div>
          </Card>
          {t > NODES[2].t && <div style={{ position: 'absolute', left: NODES[2].x + 140, top: 470, width: 520, height: 330 }}><TV x={0} y={0} w={520} led={t > tMic ? 1.4 + 0.5 * Math.sin(t * 6) : 0} bias={0.3} /></div>}
          {t > tMic && <div style={{ position: 'absolute', left: NODES[2].x + 330, top: 830, display: 'flex', alignItems: 'center', gap: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: C.red, opacity: Math.floor(t * 2) % 2 ? 1 : 0.4 }}>● REC</div>}
          {t > tWeeping - 0.05 && t < NODES[3].t && <div style={{ position: 'absolute', left: NODES[2].x - 40, top: 410, transform: `rotate(-10deg) scale(${2.4 - 1.4 * ramp(t, tWeeping - 0.05, 0.2, EASE.in)})`, opacity: ramp(t, tWeeping - 0.05, 0.2), padding: '8px 22px', border: `5px solid ${C.red}`, borderRadius: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: C.red }}>CLASSIFIED</div>}
          {/* 2019 FBI */}
          <Card x={NODES[3].x} at={NODES[3].t} color={C.amber}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <Icon name="ph:warning-bold" size={140} color={C.amber} glow />
              <div><Tag icon="ph:shield-warning-bold" text="FBI PUBLIC WARNING" color={C.amber} /><div style={{ fontFamily: fonts.head, fontWeight: 800, fontSize: 54, color: C.ink, marginTop: 12, lineHeight: 1.15 }}>Smart TV cameras &amp; mics<br />can be hijacked</div></div>
            </div>
            <div style={{ display: 'flex', gap: 30, marginTop: 24, opacity: ramp(t, tHijack - 0.1, 0.4) }}><Icon name="ph:webcam-bold" size={60} color={C.red} /><Icon name="ph:microphone-bold" size={60} color={C.red} /><Icon name="ph:skull-bold" size={60} color={C.red} /></div>
          </Card>
          {/* 2024 ACR */}
          <AcrScene x={NODES[4].x} />
          {/* 2025 Texas */}
          <Card x={NODES[5].x} at={NODES[5].t} color={C.red}>
            <Tag icon="ph:gavel-bold" text="2025 · STATE OF TEXAS SUES" color={C.red} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 26 }}>
              {BRANDS.map(([b, at]) => { const s = springAt(f, fps, at - 0.05, { damping: 11, stiffness: 200 }); return <div key={b} style={{ padding: '14px 28px', borderRadius: 999, background: C.ink, color: '#0a0f1c', fontFamily: fonts.head, fontWeight: 900, fontSize: 40, transform: `scale(${s})`, opacity: clamp(s * 1.4) }}>{b}</div>; })}
            </div>
            <div style={{ marginTop: 24, fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: C.dim }}>over ACR screenshots of what people watch</div>
          </Card>
        </Layer>
      </Camera>
      <Kinetic text="Automatic Content *Recognition*" at={tACR - 0.05} out={P(37, 'Your TV can') - 0.2} y={960} size={60} anim="rise" />
      <Dust count={36} opacity={0.3} />
      <Chapter n={7} title="It's Happened Before" at={A + 0.3} out={Z - 0.6} color={C.amber} />
      <Grade />
    </AbsoluteFill>
  );
};

const AcrScene: React.FC<{ x: number }> = ({ x }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (t < NODES[4].t - 0.6) return null;
  const ph = (t * 2) % 1;
  const flash = t > tPics && ph < 0.12 ? 1 - ph / 0.12 : 0;
  const screen = (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1d3c8f,#f08a5d)' }}>
      <div style={{ position: 'absolute', left: `${62 + Math.sin(t) * 3}%`, top: '18%', width: 80, height: 80, borderRadius: '50%', background: '#ffd36b', boxShadow: '0 0 40px #ffd36b' }} />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: -50 + k * 30 + Math.sin(t * 0.5 + k) * 30, right: -50, bottom: -20 + k * -10, height: 140 - k * 20, background: `rgba(20,30,60,${0.5 + k * 0.15})`, borderRadius: '50% 50% 0 0' }} />)}
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 14px rgba(255,255,255,${flash})`, background: `rgba(255,255,255,${flash * 0.25})` }} />}
      <div style={{ position: 'absolute', left: 18, top: 14, padding: '4px 12px', borderRadius: 8, background: 'rgba(0,0,0,.55)', fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.red }}>● ACR · frame {Math.max(0, Math.floor((t - tPics) * 2))}</div>
      {t > tMonitor - 0.1 && <div style={{ position: 'absolute', right: 18, bottom: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 12, background: 'rgba(0,0,0,.7)', transform: `scale(${0.6 + 0.4 * ramp(t, tMonitor - 0.1, 0.35, EASE.back)})`, opacity: ramp(t, tMonitor - 0.1, 0.25), fontFamily: fonts.head, fontWeight: 800, fontSize: 28, color: C.ink }}><Icon name="ph:game-controller-bold" size={40} color={C.cyan} />HDMI 1 · CONSOLE</div>}
    </div>
  );
  const studyE = ramp(t, tStudy - 0.1, 0.4);
  return (
    <>
      <div style={{ position: 'absolute', left: x - 800, top: 420, width: 680, height: 400 }}><TV x={0} y={0} w={680} screenOn={1} screen={screen} bias={0.9} /></div>
      {/* screenshots flying to a server */}
      {t > tPics && t < tTexas && Array.from({ length: 8 }, (_, i) => {
        const u = ((t - tPics) * 0.6 + i / 8) % 1;
        return <div key={i} style={{ position: 'absolute', left: lerp(x - 200, x + 560, u), top: 560 - Math.sin(u * Math.PI) * 200, width: 120, height: 68, borderRadius: 6, background: 'linear-gradient(180deg,#1d3c8f,#f08a5d)', border: '2px solid #fff', opacity: Math.sin(u * Math.PI), transform: `rotate(${(u - 0.5) * 20}deg) scale(${1 - u * 0.4})` }} />;
      })}
      <div style={{ position: 'absolute', left: x + 600, top: 420, width: 260, height: 300, borderRadius: 26, background: 'linear-gradient(160deg,#1d2338,#0a0d16)', border: `2px solid ${C.red}66`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: ramp(t, tPics - 0.1, 0.4) * (1 - ramp(t, tTexas - 0.6, 0.3)) }}><Icon name="ph:hard-drives-bold" size={110} color={C.red} /><div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.16em', color: C.dim }}>MANUFACTURER</div></div>
      <div style={{ position: 'absolute', left: x - 60, top: 740, width: 640, padding: '24px 30px', borderRadius: 22, background: 'rgba(8,12,24,.94)', border: '1px solid rgba(140,170,230,.2)', opacity: studyE * (1 - ramp(t, tTexas - 0.6, 0.3)), transform: `translateY(${(1 - studyE) * 40}px)` }}>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 18, letterSpacing: '0.2em', color: C.dim }}>2024 UNIVERSITY STUDY</div>
        <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
          <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 52, whiteSpace: 'nowrap', color: C.ink, opacity: ramp(t, tTwice - 0.1, 0.3) }}>2× / sec</div><div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, color: C.dim }}>Samsung</div></div>
          <div><div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 52, whiteSpace: 'nowrap', color: C.red, opacity: ramp(t, tLGmore - 0.1, 0.3) }}>even more</div><div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 20, color: C.dim }}>LG</div></div>
        </div>
      </div>
    </>
  );
};
