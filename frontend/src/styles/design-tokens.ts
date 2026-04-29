// ============================================
// NueEra Growth OS — Global Design Tokens
// ============================================
// Single source of truth for all design constants.
// All modules import from here.
// CSS custom properties (--app-*) auto-switch via .dark class.
//
// Migration note: --ops-* references are kept as aliases pointing
// to the same --app-* variables for backward compatibility.

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
  '7xl': 80,
  '8xl': 96,
} as const;

// ---- Typography (Tailwind classes) ----
export const TYPOGRAPHY = {
  'text-xs': 'text-[11px]',
  'text-sm': 'text-[13px]',
  'text-base': 'text-[15px]',
  'text-lg': 'text-[17px]',
  'text-xl': 'text-[20px]',
  'text-2xl': 'text-[24px]',
  'text-3xl': 'text-[30px]',
  'text-4xl': 'text-[36px]',
  'heading-xs': 'text-[11px] font-semibold tracking-wider uppercase',
  'heading-sm': 'text-[13px] font-semibold',
  'heading-md': 'text-[15px] font-semibold',
  'heading-lg': 'text-[17px] font-semibold',
  'heading-xl': 'text-[20px] font-bold',
  'heading-2xl': 'text-[24px] font-bold',
  'heading-3xl': 'text-[30px] font-bold',
} as const;

// ---- Font Weight ----
export const FONT_WEIGHT = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ---- Line Height ----
export const LINE_HEIGHT = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// ---- CSS Custom Property References (--app-*) ----
// These automatically resolve to light or dark values based on the .dark class.
export const CSS = {
  bg: 'var(--app-bg)',
  cardBg: 'var(--app-card-bg)',
  cardBgHover: 'var(--app-card-bg-hover)',
  elevated: 'var(--app-elevated)',
  inputBg: 'var(--app-input-bg)',
  accent: 'var(--app-accent)',
  accentHover: 'var(--app-accent-hover)',
  accentLight: 'var(--app-accent-light)',
  text: 'var(--app-text)',
  textSecondary: 'var(--app-text-secondary)',
  textMuted: 'var(--app-text-muted)',
  textDisabled: 'var(--app-text-disabled)',
  border: 'var(--app-border)',
  borderLight: 'var(--app-border-light)',
  borderStrong: 'var(--app-border-strong)',
  hoverBg: 'var(--app-hover-bg)',
  activeBg: 'var(--app-active-bg)',
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  danger: 'var(--app-danger)',
  info: 'var(--app-info)',
  shadowCard: 'var(--app-shadow-card)',
  shadowCardHover: 'var(--app-shadow-card-hover)',
  overlay: 'var(--app-overlay)',
  sidebarBg: 'var(--app-sidebar-bg)',
  topbarBg: 'var(--app-topbar-bg)',
  topbarBorder: 'var(--app-topbar-border)',
  highlight: 'var(--app-highlight)',
  highlightHover: 'var(--app-highlight-hover)',
  highlightLight: 'var(--app-highlight-light)',
  glassBg: 'var(--app-glass-bg)',
  glassBorder: 'var(--app-glass-border)',
  gradientPrimary: 'var(--app-gradient-primary)',
  gradientPrimaryHover: 'var(--app-gradient-primary-hover)',
  glowBlue: 'var(--app-glow-blue)',
  glowOrange: 'var(--app-glow-orange)',
  glowMixed: 'var(--app-glow-mixed)',
  shadowElevated: 'var(--app-shadow-elevated)',
} as const;

// ---- Backward-compat alias: --ops-* maps to same --app-* vars ----
// During migration, existing code referencing CSS legacy can use this.
// Once migration is complete, remove this object and all --ops-* refs.
export const CSS_LEGACY = {
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
  textDisabled: { color: CSS.textDisabled },
  border: { borderColor: CSS.border },
  borderLight: { borderColor: CSS.borderLight },
  borderStrong: { borderColor: CSS.borderStrong },
  accent: { color: CSS.accent },
  accentBg: { backgroundColor: CSS.accent },
  accentLight: { backgroundColor: CSS.accentLight },
  success: { color: CSS.success },
  warning: { color: CSS.warning },
  danger: { color: CSS.danger },
  info: { color: CSS.info },
  hoverBg: { backgroundColor: CSS.hoverBg },
  activeBg: { backgroundColor: CSS.activeBg },
  sidebar: { backgroundColor: CSS.sidebarBg },
  topbar: { backgroundColor: CSS.topbarBg, borderBottom: `1px solid ${CSS.topbarBorder}` },
  highlight: { color: CSS.highlight },
  highlightBg: { backgroundColor: CSS.highlight },
  highlightLight: { backgroundColor: CSS.highlightLight },
  glass: { backgroundColor: CSS.glassBg, border: `1px solid ${CSS.glassBorder}` },
  gradientPrimary: { background: CSS.gradientPrimary },
  gradientPrimaryHover: { background: CSS.gradientPrimaryHover },
  glowBlue: { boxShadow: CSS.glowBlue },
  glowOrange: { boxShadow: CSS.glowOrange },
  glowMixed: { boxShadow: CSS.glowMixed },
  shadowElevated: { boxShadow: CSS.shadowElevated },
} as const;

// ---- Animation (Framer Motion) ----
export const ANIMATION = {
  spring: { type: 'spring' as const, stiffness: 350, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
  springStiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
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
  card: 'var(--app-shadow-card)',
  'card-hover': 'var(--app-shadow-card-hover)',
  elevated: 'var(--app-shadow-elevated)',
  dropdown: '0 8px 24px rgba(0, 0, 0, 0.2)',
  modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
  accent: '0 4px 14px rgba(37, 99, 235, 0.25)',
  highlight: '0 4px 14px rgba(249, 115, 22, 0.25)',
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
export const STATUS_COLORS = {
  active: { color: 'var(--app-success)', bg: 'color-mix(in srgb, var(--app-success) 10%, transparent)' },
  pending: { color: 'var(--app-warning)', bg: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' },
  completed: { color: 'var(--app-info)', bg: 'color-mix(in srgb, var(--app-info) 10%, transparent)' },
  cancelled: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  'on-hold': { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
  draft: { color: 'var(--app-text-muted)', bg: 'var(--app-hover-bg)' },
  sent: { color: 'var(--app-info)', bg: 'color-mix(in srgb, var(--app-info) 10%, transparent)' },
  paid: { color: 'var(--app-success)', bg: 'color-mix(in srgb, var(--app-success) 10%, transparent)' },
  overdue: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  partial: { color: 'var(--app-warning)', bg: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' },
  approved: { color: 'var(--app-success)', bg: 'color-mix(in srgb, var(--app-success) 10%, transparent)' },
  rejected: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  escalated: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  'in-progress': { color: 'var(--app-warning)', bg: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' },
  review: { color: 'var(--app-accent)', bg: 'var(--app-accent-light)' },
  blocked: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  'at-risk': { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
  critical: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 12%, transparent)' },
  good: { color: 'var(--app-success)', bg: 'color-mix(in srgb, var(--app-success) 10%, transparent)' },
  excellent: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
} as const;

// ---- Priority colors ----
export const PRIORITY_COLORS = {
  low: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  medium: { color: 'var(--app-info)', bg: 'color-mix(in srgb, var(--app-info) 12%, transparent)' },
  high: { color: 'var(--app-warning)', bg: 'color-mix(in srgb, var(--app-warning) 12%, transparent)' },
  critical: { color: 'var(--app-danger)', bg: 'color-mix(in srgb, var(--app-danger) 12%, transparent)' },
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
    success: { DEFAULT: CSS.success, bg: 'color-mix(in srgb, var(--app-success) 10%, transparent)' },
    warning: { DEFAULT: CSS.warning, bg: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' },
    danger: { DEFAULT: CSS.danger, bg: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' },
    info: { DEFAULT: CSS.info, bg: 'color-mix(in srgb, var(--app-info) 10%, transparent)' },
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

// ---- Module accent colors (optional per-module override) ----
// Each module can use its own primary/hover/light for module-specific UI.
// Falls back to the global accent if no override is needed.
export const MODULE_ACCENTS = {
  erp: { primary: '#2563EB', hover: '#1D4ED8', light: 'rgba(37, 99, 235, 0.08)' },
  crm: { primary: '#7C3AED', hover: '#6D28D9', light: 'rgba(124, 58, 237, 0.08)' },
  finance: { primary: '#059669', hover: '#047857', light: 'rgba(5, 150, 105, 0.08)' },
  marketing: { primary: '#EC4899', hover: '#DB2777', light: 'rgba(236, 72, 153, 0.08)' },
  analytics: { primary: '#0EA5E9', hover: '#0284C7', light: 'rgba(14, 165, 233, 0.08)' },
  automation: { primary: '#F97316', hover: '#EA580C', light: 'rgba(249, 115, 22, 0.08)' },
  retention: { primary: '#10B981', hover: '#059669', light: 'rgba(16, 185, 129, 0.08)' },
  settings: { primary: '#64748B', hover: '#475569', light: 'rgba(100, 116, 139, 0.08)' },
} as const;

export type ModuleName = keyof typeof MODULE_ACCENTS;

/**
 * Get accent colors for a specific module.
 * Returns the global defaults (CSS.accent / CSS.accentHover / CSS.accentLight) if
 * no module override is specified or the module name is unrecognized.
 */
export function getModuleAccent(module?: ModuleName) {
  if (module && MODULE_ACCENTS[module]) {
    return MODULE_ACCENTS[module];
  }
  return {
    primary: CSS.accent,
    hover: CSS.accentHover,
    light: CSS.accentLight,
  };
}

// ---- Layout Constants ----
export const LAYOUT = {
  sidebarWidth: 256,
  sidebarCollapsedWidth: 64,
  sidebarMobileWidth: 280,
  topbarHeight: 56,
  topbarHeightPx: '3.5rem',
  footerHeight: 40,
  maxContentWidth: 1440,
} as const;
