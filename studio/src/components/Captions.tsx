// Word-synced captions (Whisper timing). Pages of a few words; the spoken word pops and
// key words get the accent color. Hidden inside `hide` windows (titles, full-screen text).
import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TL, clamp } from '../lib/time';
import { C, fonts } from '../lib/theme';

const KEY_RED = /^(microphone|mic|listening|recording|recorded|standby|offline|uploaded|hacker|hackers|attacker|spy|spying|cia|fbi|optional|fake-off|scariest|screenshots|product|thirty-eight|38|twelve|forty|seventy|sold|ads|advertising|money)$/i;
const KEY_CYAN = /^(lg|wi-fi|network|internet|devices|router|tv|tvs|smart|acr|whisper|chip|buffer|wake|word|settings|guest|streaming)$/i;

export const Captions: React.FC<{ hide?: [number, number][]; y?: number }> = ({ hide = [], y = 968 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  // pages break at sentence ends, long pauses, or after 6 words
  const pages = useMemo(() => {
    const out: { startMs: number; durationMs: number; tokens: { text: string; fromMs: number; toMs: number }[] }[] = [];
    let cur: typeof out[number] | null = null;
    TL.words.forEach((w, k) => {
      const prev = TL.words[k - 1];
      const brk = !cur || cur.tokens.length >= 6 || (prev && /[.?!…]["”]?$/.test(prev.w)) || (prev && w.s - prev.e > 0.45);
      if (brk) { cur = { startMs: w.s * 1000, durationMs: 0, tokens: [] }; out.push(cur); }
      cur!.tokens.push({ text: (cur!.tokens.length ? ' ' : '') + w.w, fromMs: w.s * 1000, toMs: w.e * 1000 });
    });
    out.forEach((p, i) => { const end = p.tokens[p.tokens.length - 1].toMs; const next = out[i + 1]?.startMs ?? end + 600; p.durationMs = Math.min(next, end + 700) - p.startMs; });
    return out;
  }, []);
  if (hide.some(([a, b]) => t >= a && t <= b)) return null;
  const ms = t * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;
  const pin = clamp((ms - page.startMs) / 120);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ padding: '10px 26px', borderRadius: 16, background: 'rgba(3,6,14,0.55)', transform: `translateY(${(1 - pin) * 14}px)`, opacity: pin, fontFamily: fonts.head, fontWeight: 800, fontSize: 50, letterSpacing: '-0.01em', color: C.ink, whiteSpace: 'nowrap', textShadow: '0 4px 18px rgba(0,0,0,.8)' }}>
        {page.tokens.map((tok, i) => {
          const word = tok.text.trim().replace(/[.,!?…:;"“”]/g, '');
          const active = ms >= tok.fromMs && ms < tok.toMs;
          const past = ms >= tok.toMs;
          const color = KEY_RED.test(word) ? C.red : KEY_CYAN.test(word) ? C.cyan : C.ink;
          const pop = active ? 1 + 0.12 * clamp(1 - (ms - tok.fromMs) / 160) : 1;
          return (
            <span key={i} style={{ display: 'inline-block', marginRight: i < page.tokens.length - 1 ? '0.28em' : 0, transform: `scale(${pop})`, color: active || past ? color : 'rgba(238,243,251,0.55)', textShadow: active && color !== C.ink ? `0 0 22px ${color}aa` : undefined }}>{tok.text.trim()}</span>
          );
        })}
      </div>
    </div>
  );
};
