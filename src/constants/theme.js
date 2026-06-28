// ── Wayfinder Design Tokens ───────────────────────────────────────────────────
// Single source of truth for colours, typography, and border-radius.
// All screens and components should import from here instead of hardcoding hex values.

export const colors = {
  // App background
  background:    '#071209',
  surface:       '#0d1a10',
  surfaceHigh:   '#152118',

  // Borders
  border:        'rgba(255,255,255,0.08)',
  borderGreen:   'rgba(0,200,83,0.2)',

  // ── Primary green ──────────────────────────────────────────────────────────
  // #00C853 is the app-wide accent colour (matches all existing screen code).
  primary:       '#00C853',
  primaryDark:   '#00a844',
  primaryText:   '#071209',   // text that sits on top of the primary green background

  // Semantic
  userDot:       '#4fc3f7',   // blue dot for "you are here"
  warning:       '#ffc107',
  error:         '#ff5555',

  // ── Text hierarchy ─────────────────────────────────────────────────────────
  textPrimary:   '#e0e8e0',
  textSecondary: '#8a9a8a',
  textMuted:     '#4a5a4a',
};

export const fonts = {
  black:  '900',
  bold:   '700',
  semi:   '600',
  normal: '400',
};

export const radius = {
  sm:   8,
  md:   14,
  lg:   20,
  full: 999,
};
