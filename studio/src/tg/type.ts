// Zyvavo type system for "Two Guesses Left": Inter Tight (tight display), Instrument Serif italic (accent),
// Martian Mono (wide labels). Local @fontsource files, no network at render time.
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter-tight/700.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/martian-mono/500.css';
import '@fontsource/martian-mono/700.css';
import '@fontsource/martian-mono/800.css';

export const fonts = {
  head: "'Inter Tight', sans-serif",
  body: "'Inter Tight', sans-serif",
  mono: "'Martian Mono', monospace",
  serif: "'Instrument Serif', serif",
  // display style: spread into a style object (later keys still win)
  H: { fontFamily: "'Inter Tight', sans-serif", letterSpacing: '-0.035em' } as const,
};
// one italic serif accent, the Zyvavo signature
export const serifAccent = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const, fontWeight: 400, letterSpacing: '-0.02em' };
