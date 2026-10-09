// Scene 3 · How do you ban a CPU? — no name/email/face (well… this one has a face), meet the
// bouncer, kernel dive + boot order, "never forgets a face", the TPM vault inside Ryzen (X-ray),
// what you really buy, the unique key that survives everything, the flashlight check, WANTED.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pill, Flash } from '../components/UI';
import { Icon } from '../components/Icon';
import { C, fonts } from '../lib/theme';
import { EASE, ramp, springAt, clamp, rng } from '../lib/time';
import type { SfxEvent } from '../lib/sfx';
import { C0, P, PE, S0, S1 } from './ctime';
import { Chip, Leo, Bouncer, Shady } from './chars';
import { Club, Stamp, Burst, Bubble } from './fx';

const A = S0(3), Z = S1(3);
const tWait = C0(21), tSilicon = P(21, 'silicon'), tName = P(21, 'a name'), tEmail = P(21, 'an email'), tFace = P(21, 'a face'), tWell = P(21, 'Well'), tDoes = PE(21, 'this one does');
const tMeet = P(22, 'meet Vanguard'), tVan = P(22, 'Vanguard'), tRiot = P(22, "Riot's anti-cheat");
const tCorner = P(23, 'normal corner'), tKernel = P(23, 'runs in the kernel'), tDeep = P(23, 'deepest'), tBoots = P(23, 'starts the moment'), tDesk = P(23, 'Before your desktop'), tWall = P(23, 'Before your wallpaper'), tYou = P(23, 'Before you.');
const tClub = P(24, 'as a club'), tBouncer = P(24, 'the bouncer'), tForget = P(24, 'never forgets');
const tNoFace = C0(25), tRemember = P(25, 'So what');
const tClever = C0(26), tWin = P(26, 'On Windows'), tTPM = P(26, 'something called'), tVault = P(26, 'A tiny'), tKeys = P(26, 'secret keys'), tAMD = P(26, 'And on'), tSep = P(26, 'separate part'), tInside = P(26, "It's built");
const tBuy = C0(27), tCPU = P(27, 'a CPU'), tItsVault = P(27, 'its vault'), tItsKeys = P(27, 'Its keys'), tIdent = P(27, 'Its identity');
const tHasnt = C0(28), tExperts = P(28, 'But experts'), tUnique = P(28, 'a unique key'), tMade = PE(28, 'made');
const tReinst = tMade + 0.7, tAcct = P(28, 'New account'), tGame = P(28, 'Brand-new'), tGuessed = P(28, 'You guessed');
const tLaunch = C0(29), tChecks = P(29, 'checks your hardware'), tList = P(29, 'ban list'), tMatch = P(29, 'if a part'), tShut = P(29, 'the door stays');
const tSo = C0(30), tThatGuy = P(30, 'Chip is that');

export const s3NoCaptions: [number, number][] = [[tDesk - 0.1, tYou + 0.6]];

const SECTIONS = { why: [A - 0.5, tMeet - 0.15], club1: [tMeet - 0.15, tCorner - 0.4], kernel: [tCorner - 0.4, tClub - 0.4], club2: [tClub - 0.4, tClever - 0.3], vault: [tClever - 0.3, tHasnt - 0.3], key: [tHasnt - 0.3, tLaunch - 0.3], check: [tLaunch - 0.3, Z + 0.5] } as const;
const inWin = (t: number, w: readonly [number, number]) => t >= w[0] && t < w[1];

export const s3Sfx: SfxEvent[] = [
  { t: tWait - 0.05, name: 'scratch', vol: 0.4, note: 'but wait' }, { t: tSilicon - 0.05, name: 'popup', vol: 0.35, note: 'big ?' },
  { t: tName - 0.03, name: 'negGuitar', vol: 0.4 }, { t: tEmail - 0.03, name: 'negGuitar', vol: 0.4 }, { t: tFace - 0.03, name: 'negGuitar', vol: 0.45 },
  { t: tWell - 0.1, name: 'sillyPop', vol: 0.45, note: 'Chip pops in' }, { t: tDoes + 0.05, name: 'rimshot', vol: 0.55 },
  { t: tMeet - 0.1, name: 'whooshDeep', vol: 0.4, note: 'to the club' }, { t: tVan - 0.05, name: 'stomp', vol: 0.65, note: 'bouncer lands' }, { t: tRiot - 0.05, name: 'mysteryHit', vol: 0.45, note: 'sunglasses down' },
  { t: tCorner - 0.3, name: 'zoomTech', vol: 0.45, note: 'into the PC layers' }, { t: tCorner + 0.6, name: 'negGuitar', vol: 0.3 },
  { t: tKernel - 0.1, name: 'whooshDeep', vol: 0.5, note: 'dive to kernel' }, { t: tKernel + 0.4, name: 'bassHit', vol: 0.5 }, { t: tDeep, name: 'hum', vol: 0.3, dur: 2.5 },
  { t: tBoots - 0.05, name: 'powerUp', vol: 0.45, note: 'boot order' }, { t: tBoots + 0.5, name: 'lock', vol: 0.4, note: 'Vanguard first' },
  { t: tDesk - 0.03, name: 'popUi', vol: 0.4 }, { t: tWall - 0.03, name: 'popUi', vol: 0.4 }, { t: tYou - 0.03, name: 'gasp', vol: 0.55, note: 'before YOU' },
  { t: tClub - 0.3, name: 'whooshQuick', vol: 0.4 }, { t: tClub, name: 'hum', vol: 0.25, dur: 2, note: 'neon' },
  { t: tBouncer, name: 'pageTurn', vol: 0.35, note: 'clipboard' }, { t: tForget, name: 'pagesFast', vol: 0.35, note: 'mugshots flip' },
  { t: tNoFace - 0.05, name: 'squeak', vol: 0.3, note: 'Chip in line' }, { t: tRemember - 0.1, name: 'suspenseCartoon', vol: 0.45, note: 'bouncer leans in' }, { t: tRemember + 1.0, name: 'zoomIn', vol: 0.4 },
  { t: tClever - 0.1, name: 'reveal', vol: 0.4 }, { t: tWin, name: 'popUi', vol: 0.35 }, { t: tTPM + 0.3, name: 'stomp', vol: 0.4, note: 'REQUIRES TPM 2.0' },
  { t: tVault - 0.05, name: 'lock', vol: 0.5, note: 'vault' }, { t: tKeys - 0.05, name: 'sparkle', vol: 0.4, note: 'keys' },
  { t: tAMD - 0.1, name: 'whooshQuick', vol: 0.35, note: 'Chip enters' }, { t: tSep - 0.05, name: 'negGuitar', vol: 0.3 }, { t: tInside - 0.05, name: 'scan', vol: 0.5, note: 'X-ray' }, { t: tInside + 0.6, name: 'gasp', vol: 0.45 },
  { t: tCPU - 0.05, name: 'clickModern', vol: 0.35 }, { t: tItsVault - 0.05, name: 'popUi', vol: 0.4 }, { t: tItsKeys - 0.05, name: 'popUi', vol: 0.4 }, { t: tIdent - 0.05, name: 'coins', vol: 0.4, note: 'identity on the receipt' }, { t: tIdent + 0.7, name: 'cartoonLaugh', vol: 0.25, note: 'fine print' },
  { t: tHasnt + 0.6, name: 'negGuitar', vol: 0.3, note: 'not confirmed' }, { t: tExperts - 0.05, name: 'popUi', vol: 0.3 }, { t: tUnique - 0.05, name: 'shimmer', vol: 0.45, note: 'unique key' }, { t: tUnique + 1.2, name: 'hit', vol: 0.3, note: 'forged' },
  { t: tReinst - 0.05, name: 'dataLoad', vol: 0.25, dur: 0.9 }, { t: tReinst + 0.95, name: 'boing', vol: 0.5, note: 'same key bonk' },
  { t: tAcct - 0.05, name: 'clickModern', vol: 0.3 }, { t: tAcct + 0.75, name: 'boingMetal', vol: 0.5 },
  { t: tGame - 0.05, name: 'dataLoad', vol: 0.25, dur: 0.8 }, { t: tGuessed - 0.05, name: 'clownHorn', vol: 0.45, note: 'you guessed it' },
  { t: tLaunch - 0.25, name: 'whooshDeep', vol: 0.4 }, { t: tChecks - 0.05, name: 'scan', vol: 0.45, note: 'flashlight scan' },
  { t: tList - 0.05, name: 'pageTurn', vol: 0.4 }, { t: tMatch + 0.8, name: 'alarm', vol: 0.4, dur: 1.2, note: 'MATCH' }, { t: tShut - 0.05, name: 'woodHit', vol: 0.8, note: 'door slams' },
  { t: tSo - 0.1, name: 'drumRoll', vol: 0.4, dur: 2.4, note: 'wanted poster' }, { t: tThatGuy + 0.35, name: 'mysteryHit', vol: 0.55, note: 'THAT GUY' }, { t: tThatGuy + 0.5, name: 'crowdBoo', vol: 0.3, dur: 1.4 },
];

const Card: React.FC<{ x: number; y: number; w: number; at: number; children: React.ReactNode; color?: string }> = ({ x, y, w, at, children, color = 'rgba(140,170,230,.25)' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = springAt(f, fps, at, { damping: 13, stiffness: 180 });
  return <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(-50%,0) scale(${0.85 + 0.15 * s})`, opacity: clamp(s * 1.5), padding: '26px 34px', borderRadius: 24, background: 'rgba(10,15,30,.92)', border: `2px solid ${color}`, boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>{children}</div>;
};

export const S3Explain: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      {inWin(t, SECTIONS.why) && <Why />}
      {inWin(t, SECTIONS.club1) && <ClubIntro />}
      {inWin(t, SECTIONS.kernel) && <Kernel />}
      {inWin(t, SECTIONS.club2) && <ClubFaces />}
      {inWin(t, SECTIONS.vault) && <Vault />}
      {inWin(t, SECTIONS.key) && <TheKey />}
      {inWin(t, SECTIONS.check) && <Check />}
      {[tMeet - 0.15, tCorner - 0.4, tClub - 0.4, tClever - 0.3, tHasnt - 0.3, tLaunch - 0.3].map((b) => <Flash key={b} at={b} color="#fff" max={0.18} d={0.18} />)}
    </AbsoluteFill>
  );
};

// A · how do you ban silicon? no name, no email, no face… well, this one does
const Why: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const q = springAt(f, fps, tWait + 0.15, { damping: 10, stiffness: 160 });
  const chip = springAt(f, fps, tWell - 0.1, { damping: 9, stiffness: 200 });
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #16224a, #070b18 70%)' }}>
      <div style={{ position: 'absolute', left: 520, top: 430, transform: `translate(-50%,-50%) scale(${q}) rotate(${Math.sin(t * 2) * 4}deg)`, fontFamily: fonts.head, fontWeight: 900, fontSize: 420, color: C.amber, textShadow: `0 0 80px ${C.amber}55`, opacity: clamp(q * 1.5) }}>?</div>
      <Card x={1240} y={250} w={640} at={tName - 0.15}>
        <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.2em', color: C.dim }}>WHAT A CPU HAS</div>
        {[['NAME', tName, 'ph:identification-badge-bold'], ['EMAIL', tEmail, 'ph:envelope-simple-bold'], ['FACE', tFace, 'ph:smiley-bold']].map(([l, at, ic]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 22, opacity: ramp(t, (at as number) - 0.05, 0.15), fontFamily: fonts.head, fontWeight: 900, fontSize: 54, color: t > tWell && l === 'FACE' ? C.green : C.ink }}>
            <Icon name={ic as string} size={56} color={C.dim} />{l as string}
            <span style={{ marginLeft: 'auto', color: t > tWell && l === 'FACE' ? C.green : C.red }}>{t > tWell && l === 'FACE' ? '✓' : '✗'}</span>
          </div>
        ))}
      </Card>
      <Chip x={520} y={1000} size={300} mood={t > tDoes ? 'wink' : t > tWell ? 'proud' : 'sus'} arms={t > tWell - 0.1 ? 'point' : 'shrug'} seed={21} squash={t > tWell - 0.1 && t < tWell + 0.3 ? (1 - clamp(chip)) * 0.6 : 0} />
      {t > tWell && <Bubble x={860} y={640} at={tWell} text="this one does 😎" w={380} tail="left" size={38} />}
    </AbsoluteFill>
  );
};

// B · meet Vanguard, the bouncer
const ClubIntro: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const land = ramp(t, tVan - 0.25, 0.25, EASE.in);
  const sq = t > tVan ? Math.max(0, 1 - (t - tVan) * 5) : 0;
  return (
    <AbsoluteFill>
      <Club />
      {t > tVan - 0.25 && <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${(1 - land) * -900}px) scale(${1 + sq * 0.06}, ${1 - sq * 0.08})`, transformOrigin: '960px 1060px' }}><Bouncer x={960} y={1080} size={640} glasses={t > tRiot ? 1 - ramp(t, tRiot, 0.4, EASE.out) : 1} /></div>}
      <Burst x={960} y={1040} at={tVan} color="#ffd23a" size={320} />
      <Pill x={960} y={300} at={tRiot - 0.05} color={C.red} center size={34}><Icon name="ph:shield-check-bold" size={36} color={C.ink} /> VANGUARD · RIOT'S ANTI-CHEAT</Pill>
    </AbsoluteFill>
  );
};

// C · the kernel: dive through the layers, then the boot order
const Kernel: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const LAYERS: [string, string, string][] = [['APPS & GAMES', 'ph:app-window-bold', '#3d7bff'], ['WINDOWS', 'ph:windows-logo-bold', '#33e1ff'], ['DRIVERS', 'ph:gear-six-bold', '#8b6bff'], ['KERNEL · RING 0', 'ph:shield-check-bold', C.red]];
  const dive = ramp(t, tKernel - 0.1, 1.1, EASE.inOut);
  const boot = t > tBoots - 0.2;
  const ORDER: [string, string, number, string][] = [['POWER ON', 'ph:power-bold', tBoots + 0.1, C.dim], ['VANGUARD', 'ph:shield-check-bold', tBoots + 0.5, C.red], ['DESKTOP', 'ph:desktop-bold', tDesk, C.cyan], ['WALLPAPER', 'ph:image-bold', tWall, C.cyan], ['YOU', 'ph:user-bold', tYou, C.amber]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #121c3a, #04060c 70%)' }}>
      {!boot && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1800 }}>
          <div style={{ position: 'absolute', left: 960, top: 690, transformStyle: 'preserve-3d', transform: `translateY(${dive * 40}px) rotateX(58deg) rotateZ(-30deg) scale(${0.9 + dive * 0.55})` }}>
            {LAYERS.map(([l, ic, col], i) => {
              const hot = i === 3 ? ramp(t, tKernel + 0.3, 0.6) : i === 0 ? ramp(t, tCorner, 0.3) * (1 - ramp(t, tKernel, 0.3)) : 0;
              return (
                <div key={l} style={{ position: 'absolute', left: -380, top: -230 + i * 0, width: 760, height: 460, transform: `translateZ(${(3 - i) * 150 - (i === 3 ? 0 : dive * 60)}px)`, borderRadius: 30, background: `linear-gradient(135deg, ${col}${i === 3 ? '55' : '2a'}, rgba(8,12,24,.85))`, border: `3px solid ${col}${hot > 0 ? 'ff' : '88'}`, boxShadow: hot > 0 ? `0 0 ${60 * hot}px ${col}` : undefined, opacity: i < 3 ? 1 - dive * 0.92 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                  <Icon name={ic} size={90} color={col} />
                  <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.ink }}>{l}</div>
                </div>
              );
            })}
          </div>
          {t > tCorner && t < tKernel && <Pill x={1460} y={820} at={tCorner} color={C.blue} center size={32}><Icon name="ph:x-circle-bold" size={32} color={C.ink} /> NOT IN SOME NORMAL CORNER</Pill>}
          {t > tKernel && <Pill x={960} y={130} at={tKernel + 0.3} color={C.red} center size={34}><Icon name="ph:shield-check-bold" size={34} color={C.ink} /> VANGUARD LIVES HERE · DEEPEST LEVEL</Pill>}
        </div>
      )}
      {boot && (
        <AbsoluteFill style={{ opacity: ramp(t, tBoots - 0.2, 0.3) }}>
          <div style={{ position: 'absolute', left: 960, top: 190, transform: 'translateX(-50%)', fontFamily: fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.3em', color: C.dim }}>WHAT STARTS FIRST WHEN YOU BOOT</div>
          <div style={{ position: 'absolute', left: 170, top: 560, width: 1580 * ramp(t, tBoots, 3.8, EASE.inOut), height: 6, borderRadius: 3, background: 'linear-gradient(90deg, #8793ab, #ff2e4d, #33e1ff, #ffb648)' }} />
          {ORDER.map(([l, ic, at, col], i) => {
            const s = springAt(f, fps, at - 0.05, { damping: 11, stiffness: 200 });
            const x = 170 + i * 395;
            return (
              <div key={l} style={{ position: 'absolute', left: x, top: 560, transform: `translate(-50%,-50%) scale(${s})`, opacity: clamp(s * 1.5), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 170, height: 170, borderRadius: 40, background: `${col}22`, border: `4px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${col}55` }}>{l === 'YOU' ? <div style={{ position: 'relative', width: 170, height: 170 }}><Leo x={85} y={190} size={170} mood="shock" /></div> : <Icon name={ic} size={90} color={col} />}</div>
                <div style={{ fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: col === C.dim ? C.ink : col }}>{l}</div>
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: C.dim }}>#{i + 1}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// D+E · the club: never forgets a face — but computers don't have faces
const FACES = 6;
const ClubFaces: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const flipping = t > tForget && t < tNoFace;
  const page = flipping ? Math.floor((t - tForget) * 7) % FACES : 0;
  const lean = ramp(t, tRemember - 0.1, 0.8, EASE.inOut);
  const z = 1 + ramp(t, tRemember + 1.0, 0.8, EASE.inOut) * 0.9;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: '1180px 560px' }}>
      <Club />
      <Bouncer x={760} y={1080} size={620} clipboard={t < tNoFace} lean={lean * 8} glasses={1} />
      {/* mugshot photos flipping on the clipboard */}
      {t > tBouncer && t < tNoFace && <div style={{ position: 'absolute', left: 560, top: 640, width: 170, height: 130, borderRadius: 6, background: '#e8e2d0', border: '3px solid #8a7f66', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: ['#c98a5a', '#8a5a3a', '#e0b090', '#6a4a3a', '#d8a070', '#b07850'][page], position: 'relative' }}><div style={{ position: 'absolute', left: 16, top: 26, width: 10, height: 10, borderRadius: 5, background: '#222' }} /><div style={{ position: 'absolute', right: 16, top: 26, width: 10, height: 10, borderRadius: 5, background: '#222' }} /></div>
        <div style={{ position: 'absolute', right: 6, top: 4, fontFamily: fonts.mono, fontWeight: 700, fontSize: 14, color: C.red }}>BANNED</div>
      </div>}
      {/* the queue: Chip waits at the rope */}
      {t > tNoFace - 0.3 && <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - ramp(t, tNoFace - 0.3, 0.5, EASE.out)) * 600}px)` }}>
        <Chip x={1180} y={900} size={260} mood="scared" sweat={1} look={-0.8} seed={23} walk={t < tNoFace + 0.2 ? t * 2 : undefined} />
        <div style={{ position: 'absolute', left: 1420, top: 760 }}><Icon name="ph:memory-bold" size={120} color="rgba(255,255,255,.3)" /></div>
        <div style={{ position: 'absolute', left: 1580, top: 740 }}><Icon name="ph:graphics-card-bold" size={140} color="rgba(255,255,255,.25)" /></div>
      </div>}
      {t > tNoFace && <Bubble x={1180} y={560} at={tNoFace + 0.1} text="I… don't have a face?" w={420} tail="down" size={34} think />}
    </AbsoluteFill>
  );
};

// F+G · the TPM vault lives inside the Ryzen; buying a used chip = buying its identity
const Vault: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const chipIn = springAt(f, fps, tAMD - 0.1, { damping: 13, stiffness: 160 });
  const xray = ramp(t, tInside - 0.05, 0.5, EASE.inOut) * (1 - 0.6 * ramp(t, tInside + 1.3, 0.5, EASE.inOut));
  const receipt = t > tBuy - 0.1;
  const items: [string, number, string][] = [['1 × CPU', tCPU, C.ink], ['+ ITS VAULT', tItsVault, C.amber], ['+ ITS KEYS', tItsKeys, C.amber], ['+ ITS IDENTITY', tIdent, C.red]];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 40% 45%, #1a2550, #060914 72%)' }}>
      {/* Windows 11 → TPM 2.0 requirement */}
      <Card x={520} y={170} w={720} at={tWin - 0.1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: C.ink }}><Icon name="ph:windows-logo-bold" size={52} color={C.cyan} />WINDOWS 11</div>
        <div style={{ marginTop: 14, fontFamily: fonts.body, fontWeight: 700, fontSize: 30, color: C.dim }}>Valorant requires</div>
        <div style={{ marginTop: 6, fontFamily: fonts.head, fontWeight: 900, fontSize: 78, color: C.amber, opacity: ramp(t, tTPM + 0.2, 0.2) }}>TPM 2.0</div>
      </Card>
      {/* the vault */}
      {t > tVault - 0.1 && (
        <div style={{ position: 'absolute', left: 520, top: 760, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tVault - 0.05, { damping: 11, stiffness: 180 }) * (1 - ramp(t, tAMD - 0.2, 0.3) * 0.35)})` }}>
          <div style={{ position: 'relative', width: 320, height: 290, borderRadius: 26, background: 'linear-gradient(160deg,#4a5266,#22273a)', border: `6px solid ${C.amber}`, boxShadow: `0 0 50px ${C.amber}44, inset 0 0 0 14px rgba(0,0,0,.25)` }}>
            {[[24, 30], [24, 236], [272, 30], [272, 236]].map(([bx, by], i) => <div key={i} style={{ position: 'absolute', left: bx, top: by, width: 16, height: 16, borderRadius: 8, background: '#8a92a8' }} />)}
            <svg style={{ position: 'absolute', left: 90, top: 75 }} width="140" height="140" viewBox="-70 -70 140 140">
              <circle r="56" fill="#2a3044" stroke={C.amber} strokeWidth="8" />
              <g transform={`rotate(${Math.sin(t * 1.5) * 40})`}>{[0, 120, 240].map((a) => <line key={a} x1="0" y1="0" x2={Math.cos((a * Math.PI) / 180) * 64} y2={Math.sin((a * Math.PI) / 180) * 64} stroke={C.amber} strokeWidth="10" strokeLinecap="round" />)}</g>
              <circle r="14" fill={C.amber} />
            </svg>
          </div>
          <div style={{ textAlign: 'center', marginTop: 14, fontFamily: fonts.head, fontWeight: 900, fontSize: 34, color: C.ink }}>SECURITY VAULT</div>
          {t > tKeys - 0.05 && [0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 60 + k * 70, top: -60 - Math.sin(t * 3 + k) * 8, transform: `scale(${springAt(f, fps, tKeys - 0.05 + k * 0.1, { damping: 10, stiffness: 200 })}) rotate(${-30 + k * 30}deg)` }}><Icon name="ph:key-bold" size={60} color="#ffd23a" glow /></div>)}
        </div>
      )}
      {/* Chip with the vault inside (X-ray) */}
      {t > tAMD - 0.15 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(1 - chipIn) * 900}px)` }}>
          <Chip x={1330} y={930} size={520} mood={t > tInside + 1.3 ? 'shock' : 'neutral'} lookY={t > tInside + 1.3 ? 1 : 0} xray={xray} seed={24} />
          {xray > 0.3 && <Pill x={1330} y={300} at={tInside + 0.2} color={C.amber} center size={32}><Icon name="ph:lock-key-bold" size={34} color={C.ink} /> fTPM · BUILT INTO THE CPU</Pill>}
        </div>
      )}
      {t > tSep - 0.05 && t < tInside && <div style={{ position: 'absolute', left: 520, top: 990, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 44, color: C.red, opacity: ramp(t, tSep - 0.05, 0.2), whiteSpace: 'nowrap' }}>✗ not a separate part</div>}
      {/* the receipt */}
      {receipt && (
        <div style={{ position: 'absolute', left: 120, top: 150, width: 640, padding: '30px 36px 40px', background: '#f6f3ea', borderRadius: 6, boxShadow: '0 30px 80px rgba(0,0,0,.6)', transform: `translateY(${(1 - ramp(t, tBuy - 0.1, 0.5, EASE.out)) * -700}px) rotate(-2deg)`, fontFamily: fonts.mono, color: '#1d1d1d', clipPath: 'polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)' }}>
          <div style={{ fontWeight: 700, fontSize: 30, textAlign: 'center' }}>USED CPU · RECEIPT</div>
          <div style={{ borderTop: '3px dashed #999', margin: '16px 0' }} />
          {items.map(([l, at, col]) => <div key={l} style={{ fontWeight: 700, fontSize: 40, color: col === C.ink ? '#1d1d1d' : col, opacity: ramp(t, at - 0.05, 0.15), marginTop: 8 }}>{l}</div>)}
          <div style={{ fontWeight: 700, fontSize: 18, color: '#777', marginTop: 18, opacity: ramp(t, tIdent + 0.6, 0.3) }}>+ previous owner's reputation (free!)</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// H · the unique key that survives everything
const TheKey: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const keyS = springAt(f, fps, tUnique - 0.05, { damping: 12, stiffness: 140 });
  const tries: [string, string, number][] = [['REINSTALL WINDOWS', 'ph:windows-logo-bold', tReinst], ['NEW ACCOUNT', 'ph:user-plus-bold', tAcct], ['NEW GAME INSTALL', 'ph:download-simple-bold', tGame]];
  const k = tries.reduce((acc, tr, i) => (t >= tr[2] - 0.1 ? i : acc), -1);
  const r = rng(Math.round(t * 30));
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #1d1a3a, #07060f 72%)' }}>
      <Pill x={960} y={130} at={tHasnt + 0.5} out={tExperts - 0.1} color={C.dim} center size={32}><Icon name="ph:question-bold" size={32} color={C.ink} /> RIOT HASN'T CONFIRMED THE METHOD</Pill>
      <Pill x={960} y={130} at={tExperts} color={C.amber} center size={32}><Icon name="ph:magnifying-glass-bold" size={32} color={C.ink} /> EXPERTS SUSPECT</Pill>
      {/* the key, forged in the factory */}
      {t < tUnique - 0.1 && <div style={{ position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)', opacity: ramp(t, tHasnt + 0.2, 0.4) }}><Icon name="ph:key-bold" size={300} color="rgba(255,255,255,.12)" /><div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: fonts.head, fontWeight: 900, fontSize: 90, color: 'rgba(255,255,255,.5)' }}>???</div></div>}
      {t > tUnique - 0.1 && (
        <div style={{ position: 'absolute', left: 960, top: k >= 0 ? 360 : 470, transform: `translate(-50%,-50%) scale(${(0.4 + 0.6 * keyS) * (k >= 0 ? 0.6 : 1)}) rotate(${Math.sin(t * 2) * 5}deg)` }}>
          <Icon name="ph:key-bold" size={300} color="#ffd23a" glow />
          <svg style={{ position: 'absolute', left: 30, top: 30 }} width="140" height="140">{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx="70" cy="70" rx={20 + i * 10} ry={14 + i * 9} fill="none" stroke="#ffb648" strokeWidth="3" opacity=".7" />)}</svg>
        </div>
      )}
      {t > tUnique && t < tMade + 0.4 && <div style={{ position: 'absolute', left: 960, top: 720, transform: 'translateX(-50%)', fontFamily: fonts.head, fontWeight: 900, fontSize: 48, color: C.ink, opacity: ramp(t, tUnique + 0.6, 0.3), whiteSpace: 'nowrap' }}>ONE OF A KIND · MADE WITH THE CHIP</div>}
      {t > tUnique + 1.1 && t < tMade + 0.4 && Array.from({ length: 14 }, (_, i) => { const u = ramp(t, tUnique + 1.1 + (i % 3) * 0.12, 0.5); return <div key={i} style={{ position: 'absolute', left: 960 + Math.cos(i) * u * 300, top: 470 + Math.sin(i * 1.3) * u * 200, width: 6, height: 6, borderRadius: 3, background: '#ffd23a', opacity: 1 - u }} />; })}
      {/* three attempts, the key bonks back every time */}
      {k >= 0 && tries.map(([l, ic, at], i) => {
        if (i > k) return null;
        const s = springAt(f, fps, at - 0.08, { damping: 13, stiffness: 200 });
        const prog = ramp(t, at, 0.75, EASE.inOut);
        const bonk = t > at + 0.8 && t < at + 1.3;
        return (
          <div key={l} style={{ position: 'absolute', left: 340 + i * 620, top: 560, transform: `translate(-50%,0) scale(${s}) translateX(${bonk ? (r() - 0.5) * 16 : 0}px)`, width: 570, padding: '28px 32px', borderRadius: 22, background: 'rgba(10,14,28,.92)', border: `2px solid ${t > at + 0.8 ? C.amber : 'rgba(140,170,230,.3)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.head, fontWeight: 900, fontSize: 40, color: C.ink, whiteSpace: 'nowrap' }}><Icon name={ic} size={46} color={C.cyan} />{l}</div>
            <div style={{ marginTop: 16, height: 12, borderRadius: 6, background: 'rgba(255,255,255,.1)' }}><div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 6, background: C.cyan }} /></div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontFamily: fonts.head, fontWeight: 900, fontSize: 46, color: C.amber, opacity: ramp(t, at + 0.8, 0.15) }}><Icon name="ph:key-bold" size={50} color="#ffd23a" />SAME KEY {i === 2 ? '🙃' : ''}</div>
          </div>
        );
      })}
      {t > tGuessed - 0.05 && <Stamp x={960} y={850} at={tGuessed - 0.02} text="YOU GUESSED IT" size={70} rot={-4} color={C.amber} />}
    </AbsoluteFill>
  );
};

// I+J · the flashlight check at the door, then the WANTED poster
const Check: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const wanted = t > tSo - 0.15;
  const scan = ramp(t, tChecks, 1.6, EASE.inOut);
  const matched = t > tMatch + 0.8;
  const slam = t > tShut ? Math.max(0, 1 - (t - tShut) / 0.4) : 0;
  const r = rng(Math.round(t * 30));
  if (wanted) {
    const p = springAt(f, fps, tSo - 0.1, { damping: 13, stiffness: 140 });
    const zoom = 1 + ramp(t, tThatGuy + 0.3, 0.25, EASE.out) * 0.25;
    return (
      <AbsoluteFill style={{ background: 'linear-gradient(180deg,#2a1e14,#140e09)' }}>
        <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 4px, transparent 4px 120px)' }} />
        <div style={{ position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) scale(${p * zoom}) rotate(-2deg)`, width: 760, height: 900, background: 'linear-gradient(160deg,#ead9b2,#d2b886)', boxShadow: '0 40px 100px rgba(0,0,0,.6)', borderRadius: 6, textAlign: 'center', fontFamily: fonts.head }}>
          <div style={{ fontWeight: 900, fontSize: 130, color: '#4a2410', marginTop: 30, letterSpacing: '0.04em' }}>WANTED</div>
          <div style={{ fontWeight: 800, fontSize: 32, color: '#6b3a1c', letterSpacing: '0.2em' }}>BY VANGUARD</div>
          <div style={{ position: 'relative', width: 560, height: 420, margin: '26px auto', background: '#c8ad7a', border: '6px solid #6b3a1c', overflow: 'hidden' }}>
            <Chip x={170} y={400} size={280} mood="scared" seed={25} />
            <div style={{ position: 'absolute', left: 300, top: 40 }}><div style={{ position: 'relative', width: 240, height: 380, transform: 'scale(.95)' }}><Shady x={120} y={380} size={240} /></div></div>
            <div style={{ position: 'absolute', left: 278, top: 0, width: 4, height: '100%', background: '#6b3a1c', opacity: 0.6 }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 54, color: '#4a2410' }}>"THAT GUY"</div>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: '#8a2a1a', marginTop: 8 }}>ERROR VAN 152 · HARDWARE BAN</div>
        </div>
        {t > tThatGuy + 0.3 && <Bouncer x={1640} y={1150} size={520} glasses={0} lean={-6} />}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `translate(${(r() - 0.5) * 20 * slam}px, ${(r() - 0.5) * 20 * slam}px)` }}>
      <Club />
      <Pill x={960} y={300} at={tLaunch} color={C.cyan} center size={32}><Icon name="ph:play-bold" size={32} color={C.ink} /> EVERY TIME YOU LAUNCH VALORANT</Pill>
      <Bouncer x={620} y={1080} size={620} glasses={matched ? 0 : 1} light={t > tChecks - 0.1 && !matched ? 1 : 0} clipboard={t > tList - 0.2 && t < tMatch} />
      <Chip x={1260} y={930} size={300} mood={matched ? 'shock' : 'scared'} sweat={1} red={matched ? 0.5 : 0} seed={26} look={-0.6} />
      {/* scan lines across Chip */}
      {t > tChecks && !matched && <div style={{ position: 'absolute', left: 1100, top: 630 + scan * 300, width: 320, height: 6, background: '#fff6c8', boxShadow: '0 0 24px #fff6c8', opacity: 0.8 }} />}
      {matched && <Stamp x={1260} y={560} at={tMatch + 0.8} text="MATCH ✗" size={80} rot={-8} />}
      {matched && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 0%, rgba(255,40,60,${0.25 + 0.2 * Math.sin(t * 16)}), transparent 60%)` }} />}
      {t > tShut && <div style={{ position: 'absolute', left: 900, top: 440, transform: `translate(-50%,-50%) scale(${springAt(f, fps, tShut, { damping: 9, stiffness: 240 })})`, padding: '10px 34px', background: '#0b0d14', border: `5px solid ${C.red}`, borderRadius: 12, fontFamily: fonts.head, fontWeight: 900, fontSize: 64, color: C.red, boxShadow: `0 0 50px ${C.red}88` }}>DOOR: CLOSED</div>}
      <Burst x={900} y={440} at={tShut} color="#fff" size={280} />
    </AbsoluteFill>
  );
};
