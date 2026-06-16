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

  // ── Orchestra category — baseline (50% desaturated from play colors) ─
  categoryChorusEdit:     '#c19690',
  categoryMegaphonesEdit: '#c6b382',
  categoryBrassEdit:      '#b7c5cd',
  categoryWhistlesEdit:   '#d8dcd5',
  categoryPercussionEdit: '#bc9f85',

  // ── Orchestra category — play mode (vibrant) ──────────────────────
  categoryChorusPlay:     '#e08a7c',
  categoryMegaphonesPlay: '#e4bd5a',
  categoryBrassPlay:      '#abc7d6',
  categoryWhistlesPlay:   '#d7e0d1',
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
