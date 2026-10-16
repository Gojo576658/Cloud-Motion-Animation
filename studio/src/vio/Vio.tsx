// Vio: MechivioTech's recurring host (stands in for the channel owner). Anime-style boy, ~17: black cap
// with a red "M", messy dark-brown hair with one red streak, oversized white tee with a red "M", black
// fingerless gloves, a white earbud. The art is the owner's AI-generated character set (assets/vio/raw,
// keyed to public/vio/*.png, 1024×1536 each, same framing). The idle pose talks and blinks through
// overlays drawn in the image's own pixel space, so the face never shifts between frames.
// Anchor: bottom-centre at (x, y); size = rendered height in px.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { useTF } from '../tg/kit';
import { springAt, clamp } from '../lib/time';

export type VioPose = 'idle' | 'shocked' | 'smirk' | 'thinking' | 'laughing' | 'pointing' | 'facepalm' | 'full';
const FILE: Record<VioPose, string> = { idle: 'idle', shocked: 'shocked', smirk: 'smirk', thinking: 'thinking', laughing: 'laughing', pointing: 'pointing', facepalm: 'facepalm', full: 'master' };
export const VIO_POSES = Object.keys(FILE) as VioPose[];
const SKIN = 'rgb(253,227,204)', LASH = '#1c0b06';

const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.37) % 3.4; return p < 0.13; };

// idle-pose face landmarks (image px): eyes and mouth
const EYE_L = { cx: 418, cy: 329, rx: 38, ry: 28 }, EYE_R = { cx: 558, cy: 308, rx: 43, ry: 29 };
const MOUTH = { cx: 503, cy: 406 };

export const Vio: React.FC<{
  x: number; y: number; size?: number; pose?: VioPose; talk?: number; decode?: number; at?: number;
  seed?: number; flip?: boolean; tilt?: number; blink?: boolean;
}> = ({ x, y, size = 700, pose = 'idle', talk = 0, decode = 0, at, seed = 1, flip = false, tilt = 0, blink }) => {
  const { t, f, fps } = useTF();
  const w = size * (1024 / 1536);
  const enter = at == null ? 1 : springAt(f, fps, at, { damping: 13, stiffness: 190 });
  const breathe = Math.sin(t * 2.1 + seed) * 0.006;
  const sway = Math.sin(t * 0.8 + seed) * 0.5 + tilt;
  const bounce = pose === 'idle' ? talk * 0.012 : talk * 0.02;
  const shut = blink ?? blinkAt(t, seed);
  const k = clamp(talk);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: size,
      transform: `translate(-50%,-100%) translateY(${(1 - enter) * 60}px) rotate(${sway}deg) scale(${(flip ? -1 : 1) * (0.92 + 0.08 * enter)}, ${(0.92 + 0.08 * enter) * (1 + breathe + bounce)})`,
      transformOrigin: '50% 100%', opacity: clamp(enter * 1.6),
    }}>
      <Img src={staticFile(`vio/${FILE[pose]}.png`)} style={{ width: '100%', height: '100%', display: 'block' }} />
      {pose === 'idle' && (
        <svg viewBox="0 0 1024 1536" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs><filter id={`vioM${seed}`}><feGaussianBlur stdDeviation={1.5} /></filter><radialGradient id={`vioG${seed}`}><stop offset="0" stopColor="#ff2b3d" stopOpacity={0.75} /><stop offset="1" stopColor="#ff2b3d" stopOpacity={0} /></radialGradient></defs>
          {shut && <>
            <defs><filter id={`vioF${seed}`}><feGaussianBlur stdDeviation={1.3} /></filter></defs>
            <polygon points="394,312 404,303 426,301 449,305 455,316 451,334 443,349 428,357 411,355 399,345 395,330" fill={SKIN} filter={`url(#vioF${seed})`} />
            <polygon points="511,300 525,289 546,279 574,277 597,283 599,296 595,312 587,327 570,334 547,336 531,329 519,316" fill={SKIN} filter={`url(#vioF${seed})`} />
            <path d="M396 329 Q424 347 453 326" stroke={LASH} strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M396 329 l-7 -5" stroke={LASH} strokeWidth={4} strokeLinecap="round" />
            <path d="M515 305 Q556 327 598 300" stroke={LASH} strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M598 300 l7 -6" stroke={LASH} strokeWidth={4} strokeLinecap="round" />
          </>}
          {k > 0.04 && <>
            <ellipse cx={MOUTH.cx + 6} cy={MOUTH.cy - 4} rx={45} ry={12} fill={SKIN} filter={`url(#vioM${seed})`} />
            <path d={`M478 ${MOUTH.cy - 3} Q503 ${MOUTH.cy - 7} 528 ${MOUTH.cy - 4} Q521 ${MOUTH.cy + 3 + 15 * k} 503 ${MOUTH.cy + 5 + 16 * k} Q485 ${MOUTH.cy + 3 + 15 * k} 478 ${MOUTH.cy - 3} Z`} fill="#6b1d1d" stroke="#3a0d0d" strokeWidth={1.8} strokeLinejoin="round" />
            <path d={`M483 ${MOUTH.cy - 2} Q503 ${MOUTH.cy - 5} 523 ${MOUTH.cy - 3} L521 ${MOUTH.cy + 2 + 3 * k} Q503 ${MOUTH.cy + 1 * k} 485 ${MOUTH.cy + 2 + 3 * k} Z`} fill="#fff" />
            <ellipse cx={MOUTH.cx} cy={MOUTH.cy + 2 + 12 * k} rx={11} ry={2 + 3 * k} fill="#e0707a" />
          </>}
          {decode > 0.02 && !shut && <>
            <circle cx={EYE_R.cx + 2} cy={EYE_R.cy + 2} r={70} fill={`url(#vioG${seed})`} opacity={decode} />
            <ellipse cx={EYE_R.cx + 2} cy={EYE_R.cy + 4} rx={20} ry={24} fill="#ff2b3d" opacity={decode * 0.55} style={{ mixBlendMode: 'color' }} />
            <path d={`M520 ${290 + ((t * 50) % 40)} h78`} stroke="#ff2b3d" strokeWidth={2.5} opacity={decode * 0.9} />
          </>}
        </svg>
      )}
    </div>
  );
};

// mouth opening from the word timeline: 0..1, opens on each word and closes between words
export const talkFrom = (words: { s: number; e: number }[], t: number) => {
  for (const w of words) {
    if (t >= w.s && t <= w.e) { const u = (t - w.s) / Math.max(0.08, w.e - w.s); return 0.35 + 0.65 * Math.abs(Math.sin(u * Math.PI * Math.max(1, Math.round((w.e - w.s) / 0.16)))); }
  }
  return 0;
};
