// ============================================
// NueEra Growth OS — Canonical Design Tokens
// ============================================
// Single source of truth for all design constants.
// All modules import from here.
// CSS custom properties (--app-*) auto-switch via .dark class.
// ============================================

// ---- Spacing Scale ----
// Maps to CSS vars: var(--app-space-xs) etc.
// Also available as Tailwind: p-app-xs, gap-app-sm, etc.
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

// ---- Typography ----
// Semantic typography tokens — use these instead of raw font classes.
// Enforces visual hierarchy: page title > section title > body > caption.
export const TYPOGRAPHY = {
  // Page-level headings
  headingLg: 'text-xl font-semibold text-[var(--app-text)]',
  headingMd: 'text-lg font-semibold text-[var(--app-text)]',
  headingSm: 'text-sm font-semibold text-[var(--app-text)]',
  // Body text
  body: 'text-sm text-[var(--app-text)]',
  bodySecondary: 'text-sm text-[var(--app-text-secondary)]',
  // Small / meta text
  caption: 'text-xs text-[var(--app-text-muted)]',
  captionStrong: 'text-xs font-medium text-[var(--app-text-secondary)]',
  // Overlines / labels
  overline: 'text-[11px] font-semibold tracking-wider uppercase text-[var(--app-text-muted)]',
  // Legacy size aliases (for backward compat during migration)
  'text-xs': 'text-[11px]',
  'text-sm': 'text-[13px]',
  'text-sm': 'text-[15px]',
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
  accentGradientTo: 'var(--app-accent-gradient-to)',
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
  successBg: 'var(--app-success-bg)',
  warningBg: 'var(--app-warning-bg)',
  dangerBg: 'var(--app-danger-bg)',
  infoBg: 'var(--app-info-bg)',
  shadowSm: 'var(--app-shadow-[var(--app-shadow-sm)])',
  shadowMd: 'var(--app-shadow-[var(--app-shadow-md)])',
  shadowCard: 'var(--app-shadow-card)',
  shadowCardHover: 'var(--app-shadow-card-hover)',
  shadowDropdown: 'var(--app-shadow-dropdown)',
  shadowModal: 'var(--app-shadow-modal)',
  shadowAccent: 'var(--app-shadow-accent)',
  radiusSm: 'var(--app-radius-sm)',
  radiusMd: 'var(--app-radius-md)',
  radiusLg: 'var(--app-radius-lg)',
  radiusXl: 'var(--app-radius-xl)',
  radiusFull: 'var(--app-radius-full)',
  spaceXs: 'var(--app-space-xs)',
  spaceSm: 'var(--app-space-sm)',
  spaceMd: 'var(--app-space-md)',
  spaceLg: 'var(--app-space-lg)',
  spaceXl: 'var(--app-space-xl)',
  space2xl: 'var(--app-space-2xl)',
  space3xl: 'var(--app-space-3xl)',
  space4xl: 'var(--app-space-4xl)',
  overlay: 'var(--app-overlay)',
  selectionBg: 'var(--app-selection-bg)',
  focusRing: 'var(--app-focus-ring)',
  sidebarBg: 'var(--app-sidebar-bg)',
  topbarBg: 'var(--app-topbar-bg)',
  topbarBorder: 'var(--app-topbar-border)',
  purple: 'var(--app-purple)',
  purpleLight: 'var(--app-purple-light)',
  emerald: 'var(--app-emerald)',
  emeraldLight: 'var(--app-emerald-light)',
} as const;

// ---- Inline style helpers ----
export const inlineStyles = {
  bg: { backgroundColor: CSS.bg },
  card: { backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard, borderRadius: CSS.radiusLg },
  elevated: { backgroundColor: CSS.elevated, border: `1px solid ${CSS.border}`, borderRadius: CSS.radiusLg },
  input: { backgroundColor: CSS.inputBg, border: `1px solid ${CSS.border}`, color: CSS.text, borderRadius: CSS.radiusMd },
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
  successBg: { backgroundColor: CSS.successBg, color: CSS.success },
  warning: { color: CSS.warning },
  warningBg: { backgroundColor: CSS.warningBg, color: CSS.warning },
  danger: { color: CSS.danger },
  dangerBg: { backgroundColor: CSS.dangerBg, color: CSS.danger },
  info: { color: CSS.info },
  infoBg: { backgroundColor: CSS.infoBg, color: CSS.info },
  hoverBg: { backgroundColor: CSS.hoverBg },
  activeBg: { backgroundColor: CSS.activeBg },
  overlay: { backgroundColor: CSS.overlay },
  sidebar: { backgroundColor: CSS.sidebarBg },
  topbar: { backgroundColor: CSS.topbarBg, borderBottom: `1px solid ${CSS.topbarBorder}` },
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
  sm: 'var(--app-radius-sm)',
  md: 'var(--app-radius-md)',
  lg: 'var(--app-radius-lg)',
  xl: 'var(--app-radius-xl)',
  full: 'var(--app-radius-full)',
} as const;

// ---- Shadows ----
export const SHADOWS = {
  sm: 'var(--app-shadow-[var(--app-shadow-sm)])',
  md: 'var(--app-shadow-[var(--app-shadow-md)])',
  card: 'var(--app-shadow-card)',
  'card-hover': 'var(--app-shadow-card-hover)',
  dropdown: 'var(--app-shadow-dropdown)',
  modal: 'var(--app-shadow-modal)',
  accent: 'var(--app-shadow-accent)',
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
  active: { color: 'var(--app-success)', bg: 'var(--app-success-bg)' },
  pending: { color: 'var(--app-warning)', bg: 'var(--app-warning-bg)' },
  completed: { color: 'var(--app-info)', bg: 'var(--app-info-bg)' },
  cancelled: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  'on-hold': { color: 'var(--app-purple)', bg: 'var(--app-purple-light)' },
  draft: { color: 'var(--app-text-muted)', bg: 'var(--app-hover-bg)' },
  sent: { color: 'var(--app-info)', bg: 'var(--app-info-bg)' },
  paid: { color: 'var(--app-success)', bg: 'var(--app-success-bg)' },
  overdue: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  partial: { color: 'var(--app-warning)', bg: 'var(--app-warning-bg)' },
  approved: { color: 'var(--app-success)', bg: 'var(--app-success-bg)' },
  rejected: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  escalated: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  'in-progress': { color: 'var(--app-warning)', bg: 'var(--app-warning-bg)' },
  review: { color: 'var(--app-accent)', bg: 'var(--app-accent-light)' },
  blocked: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  'at-risk': { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  critical: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
  good: { color: 'var(--app-success)', bg: 'var(--app-success-bg)' },
  excellent: { color: 'var(--app-emerald)', bg: 'var(--app-emerald-light)' },
} as const;

// ---- Priority colors ----
export const PRIORITY_COLORS = {
  low: { color: 'var(--app-emerald)', bg: 'var(--app-emerald-light)' },
  medium: { color: 'var(--app-info)', bg: 'var(--app-info-bg)' },
  high: { color: 'var(--app-warning)', bg: 'var(--app-warning-bg)' },
  critical: { color: 'var(--app-danger)', bg: 'var(--app-danger-bg)' },
} as const;

// ---- COLORS export ----
export const COLORS = {
  bg: { primary: CSS.bg, card: CSS.cardBg, 'card-hover': CSS.cardBgHover, elevated: CSS.elevated, input: CSS.inputBg },
  accent: { DEFAULT: CSS.accent, hover: CSS.accentHover, light: CSS.accentLight },
  text: { primary: CSS.text, secondary: CSS.textSecondary, muted: CSS.textMuted, disabled: CSS.textDisabled },
  border: { DEFAULT: CSS.border, light: CSS.borderLight, medium: CSS.border, strong: CSS.borderStrong },
  semantic: {
    success: { DEFAULT: CSS.success, bg: CSS.successBg },
    warning: { DEFAULT: CSS.warning, bg: CSS.warningBg },
    danger: { DEFAULT: CSS.danger, bg: CSS.dangerBg },
    info: { DEFAULT: CSS.info, bg: CSS.infoBg },
  },
  searchIcon: CSS.textDisabled,
  overlayHover: CSS.hoverBg,
} as const;

// ---- Helpers ----
export function getStatusColor(status: string): { color: string; bg: string } {
  const key = status as keyof typeof STATUS_COLORS;
  if (STATUS_COLORS[key]) return STATUS_COLORS[key];
  return { color: CSS.textMuted, bg: CSS.hoverBg };
}

export function getPriorityColor(priority: string): { color: string; bg: string } {
  const key = priority as keyof typeof PRIORITY_COLORS;
  if (PRIORITY_COLORS[key]) return PRIORITY_COLORS[key];
  return { color: CSS.textMuted, bg: CSS.hoverBg };
}

// ---- Module accent colors ----
export const MODULE_ACCENTS = {
  erp: { primary: 'var(--app-module-erp)', hover: 'var(--app-module-erp-hover)', light: 'var(--app-module-erp-light)' },
  crm: { primary: 'var(--app-module-crm)', hover: 'var(--app-module-crm-hover)', light: 'var(--app-module-crm-light)' },
  finance: { primary: 'var(--app-module-finance)', hover: 'var(--app-module-finance-hover)', light: 'var(--app-module-finance-light)' },
  marketing: { primary: 'var(--app-module-marketing)', hover: 'var(--app-module-marketing-hover)', light: 'var(--app-module-marketing-light)' },
  analytics: { primary: 'var(--app-module-analytics)', hover: 'var(--app-module-analytics-hover)', light: 'var(--app-module-analytics-light)' },
  automation: { primary: 'var(--app-module-automation)', hover: 'var(--app-module-automation-hover)', light: 'var(--app-module-automation-light)' },
  retention: { primary: 'var(--app-module-retention)', hover: 'var(--app-module-retention-hover)', light: 'var(--app-module-retention-light)' },
  settings: { primary: 'var(--app-module-settings)', hover: 'var(--app-module-settings-hover)', light: 'var(--app-module-settings-light)' },
} as const;

export type ModuleName = keyof typeof MODULE_ACCENTS;

export function getModuleAccent(module?: ModuleName) {
  if (module && MODULE_ACCENTS[module]) return MODULE_ACCENTS[module];
  return { primary: CSS.accent, hover: CSS.accentHover, light: CSS.accentLight };
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
