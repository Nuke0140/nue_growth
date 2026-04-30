// ============================================
// ERP Module — Design Tokens (THEME-AWARE)
// ============================================
// All colors reference CSS custom properties that auto-switch
// between light and dark mode via :root / .dark selectors.
// Import from this file instead of hardcoding colors.

// ---- Spacing Scale (px) ----
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// ---- Typography ----
export const TYPOGRAPHY = {
  'text-xs': 'text-[11px]',
  'text-sm': 'text-[13px]',
  'text-base': 'text-[15px]',
  'text-lg': 'text-[17px]',
  'text-xl': 'text-[20px]',
  'text-2xl': 'text-[24px]',
  'text-3xl': 'text-[30px]',
  'heading-xs': 'text-[11px] font-semibold tracking-wider uppercase',
  'heading-sm': 'text-[13px] font-semibold',
  'heading-md': 'text-[15px] font-semibold',
  'heading-lg': 'text-[17px] font-semibold',
  'heading-xl': 'text-[20px] font-bold',
  'heading-2xl': 'text-[24px] font-bold',
} as const;

// ---- CSS Custom Property References ----
// These automatically resolve to light or dark values based on the .dark class
export const CSS = {
  bg: 'var(--ops-bg)',
  cardBg: 'var(--ops-card-bg)',
  cardBgHover: 'var(--ops-card-bg-hover)',
  elevated: 'var(--ops-elevated)',
  inputBg: 'var(--ops-input-bg)',
  accent: 'var(--ops-accent)',
  accentHover: 'var(--ops-accent-hover)',
  accentLight: 'var(--ops-accent-light)',
  text: 'var(--ops-text)',
  textSecondary: 'var(--ops-text-secondary)',
  textMuted: 'var(--ops-text-muted)',
  textDisabled: 'var(--ops-text-disabled)',
  border: 'var(--ops-border)',
  borderLight: 'var(--ops-border-light)',
  borderStrong: 'var(--ops-border-strong)',
  hoverBg: 'var(--ops-hover-bg)',
  activeBg: 'var(--ops-active-bg)',
  success: 'var(--ops-success)',
  warning: 'var(--ops-warning)',
  danger: 'var(--ops-danger)',
  info: 'var(--ops-info)',
  shadowCard: 'var(--ops-shadow-card)',
  shadowCardHover: 'var(--ops-shadow-card-hover)',
  overlay: 'var(--ops-overlay)',
} as const;

// ---- Inline style helpers ----
// Use these for style={{ }} props where Tailwind classes can't reach
export const inlineStyles = {
  bg: { backgroundColor: CSS.bg },
  card: { backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard },
  elevated: { backgroundColor: CSS.elevated, border: `1px solid ${CSS.border}` },
  input: { backgroundColor: CSS.inputBg, border: `1px solid ${CSS.border}`, color: CSS.text },
  text: { color: CSS.text },
  textSecondary: { color: CSS.textSecondary },
  textMuted: { color: CSS.textMuted },
  border: { borderColor: CSS.border },
  accent: { color: CSS.accent },
  accentBg: { backgroundColor: CSS.accent },
} as const;

// ---- Animation ----
export const ANIMATION = {
  spring: { type: 'spring' as const, stiffness: 350, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
  springStiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    pageTransition: 0.35,
  },
  pageVariants: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.04 } },
  },
} as const;

// ---- Border Radius ----
export const RADIUS = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

// ---- Shadows ----
export const SHADOWS = {
  card: 'var(--ops-shadow-card)',
  'card-hover': 'var(--ops-shadow-card-hover)',
  dropdown: '0 8px 24px rgba(0, 0, 0, 0.2)',
  modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
  accent: '0 2px 8px rgba(204, 92, 55, 0.3)',
} as const;

// ---- Z-index layers ----
export const Z_INDEX = {
  base: 0,
  dropdown: 30,
  sticky: 35,
  topbar: 40,
  overlay: 50,
  modal: 60,
  toast: 100,
  tooltip: 110,
} as const;

// ---- Status colors (theme-aware via CSS vars) ----
// These use the CSS vars for semantic colors that auto-switch
export const STATUS_COLORS = {
  active: { color: 'var(--ops-success)', bg: 'color-mix(in srgb, var(--ops-success) 10%, transparent)' },
  pending: { color: 'var(--ops-warning)', bg: 'color-mix(in srgb, var(--ops-warning) 10%, transparent)' },
  completed: { color: 'var(--ops-info)', bg: 'color-mix(in srgb, var(--ops-info) 10%, transparent)' },
  cancelled: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  'on-hold': { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  draft: { color: 'var(--ops-text-muted)', bg: 'var(--ops-hover-bg)' },
  sent: { color: 'var(--ops-info)', bg: 'color-mix(in srgb, var(--ops-info) 10%, transparent)' },
  paid: { color: 'var(--ops-success)', bg: 'color-mix(in srgb, var(--ops-success) 10%, transparent)' },
  overdue: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  partial: { color: 'var(--ops-warning)', bg: 'color-mix(in srgb, var(--ops-warning) 10%, transparent)' },
  approved: { color: 'var(--ops-success)', bg: 'color-mix(in srgb, var(--ops-success) 10%, transparent)' },
  rejected: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  escalated: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  'in-progress': { color: 'var(--ops-warning)', bg: 'color-mix(in srgb, var(--ops-warning) 10%, transparent)' },
  review: { color: 'var(--ops-accent)', bg: 'var(--ops-accent-light)' },
  blocked: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  'at-risk': { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
  critical: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 12%, transparent)' },
  good: { color: 'var(--ops-success)', bg: 'color-mix(in srgb, var(--ops-success) 10%, transparent)' },
  excellent: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
} as const;

// ---- Priority colors ----
export const PRIORITY_COLORS = {
  low: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  medium: { color: 'var(--ops-info)', bg: 'color-mix(in srgb, var(--ops-info) 12%, transparent)' },
  high: { color: 'var(--ops-warning)', bg: 'color-mix(in srgb, var(--ops-warning) 12%, transparent)' },
  critical: { color: 'var(--ops-danger)', bg: 'color-mix(in srgb, var(--ops-danger) 12%, transparent)' },
} as const;

// ---- Legacy COLORS export (backward compat) ----
// Maps to CSS custom properties. Components using COLORS.searchIcon etc.
// will automatically get theme-aware colors.
export const COLORS = {
  bg: { primary: CSS.bg, card: CSS.cardBg, 'card-hover': CSS.cardBgHover, elevated: CSS.elevated, input: CSS.inputBg },
  accent: { DEFAULT: CSS.accent, hover: CSS.accentHover, light: CSS.accentLight },
  text: { primary: CSS.text, secondary: CSS.textSecondary, muted: CSS.textMuted, disabled: CSS.textDisabled },
  border: { DEFAULT: CSS.border, light: CSS.borderLight, medium: CSS.border, strong: CSS.borderStrong },
  semantic: {
    success: { DEFAULT: CSS.success, bg: 'color-mix(in srgb, var(--ops-success) 10%, transparent)' },
    warning: { DEFAULT: CSS.warning, bg: 'color-mix(in srgb, var(--ops-warning) 10%, transparent)' },
    danger: { DEFAULT: CSS.danger, bg: 'color-mix(in srgb, var(--ops-danger) 10%, transparent)' },
    info: { DEFAULT: CSS.info, bg: 'color-mix(in srgb, var(--ops-info) 10%, transparent)' },
  },
  // Convenience aliases used by data-table and smart-data-table
  searchIcon: CSS.textDisabled,
  overlayHover: CSS.hoverBg,
} as const;

// ---- Helpers ----
export function getStatusColor(status: string): { color: string; bg: string } {
  const key = status as keyof typeof STATUS_COLORS;
  if (STATUS_COLORS[key]) {
    return STATUS_COLORS[key];
  }
  return { color: CSS.textMuted, bg: CSS.hoverBg };
}

export function getPriorityColor(priority: string): { color: string; bg: string } {
  const key = priority as keyof typeof PRIORITY_COLORS;
  if (PRIORITY_COLORS[key]) {
    return PRIORITY_COLORS[key];
  }
  return { color: CSS.textMuted, bg: CSS.hoverBg };
}
