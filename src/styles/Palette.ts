export const Palette = {
  // ── Surfaces ──────────────────────────────────────────────────────
  surfaceBase:        '#ffffff',
  surfaceCard:        '#e4dfdc',
  surfaceInner:       '#fffaf8',

  // ── Text ──────────────────────────────────────────────────────────
  textPrimary:        '#3b3b3c',
  textSecondary:      '#7c7272',
  textDarkBrown:      '#3f2d28',

  // ── Accents ───────────────────────────────────────────────────────
  accentBrown:        '#603813',
  accentDarkBrown:    '#3c2415',
  accentGold:         '#cd8e16',
  accentOrange:       '#f7931e',

  // ── Borders / strokes ─────────────────────────────────────────────
  borderSoft:         '#a5958b',
  bgPatternDot:       '#d4beb0',

  // ── Composer panel ────────────────────────────────────────────────
  composerBg:         '#3b3b3c',
  composerRowAlt:     'rgba(153,134,117,0.47)',
  composerStripe:     'rgba(227,211,195,0.60)',
  composerSeparator:  'rgba(255,255,255,0.25)',

  // ── Orchestra category — edit mode (faded) ────────────────────────
  categoryVoiceEdit:      'rgba(224,138,124,0.30)',
  categoryStringsEdit:    'rgba(228,189,90,0.30)',
  categoryWindEdit:       'rgba(215,224,209,0.45)',
  categoryBrassEdit:      'rgba(171,199,214,0.40)',
  categoryPercussionEdit: 'rgba(216,158,106,0.30)',

  // ── Orchestra category — play mode (vibrant) ──────────────────────
  categoryVoicePlay:      '#e08a7c',
  categoryStringsPlay:    '#e4bd5a',
  categoryWindPlay:       '#d7e0d1',
  categoryBrassPlay:      '#abc7d6',
  categoryPercussionPlay: '#d89e6a',
} as const;

export type PaletteKey = keyof typeof Palette;

/** Writes every Palette token to :root as --color-<kebab-key>. Call once in main.tsx. */
export function injectCssVariables(): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(Palette)) {
    const cssVar = '--color-' + key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
    root.style.setProperty(cssVar, value);
  }
}
