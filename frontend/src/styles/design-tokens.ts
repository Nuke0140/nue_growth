// ============================================
// NueEra Growth OS — Premium Global Design Tokens
// ============================================
// Single source of truth for all design constants.
// All modules import from here.
// CSS custom properties (--app-*) auto-switch via .dark class.
//
// Brand DNA: Deep Navy + Electric Blue + Warm Orange
// Visual language: Orbit, Glow, Connection, Power, Intelligent Growth
// ============================================

// ---- Spacing Scale (8px grid) ----
export const SPACING = {
  0: 0,
  '0.5': 2,
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
  // Display — hero/landing numbers
  display: 'text-4xl font-bold tracking-tight text-[var(--app-text)]',
  // Page-level headings
  h1: 'text-3xl font-bold tracking-tight text-[var(--app-text)]',
  h2: 'text-2xl font-semibold text-[var(--app-text)]',
  h3: 'text-xl font-semibold text-[var(--app-text)]',
  h4: 'text-lg font-semibold text-[var(--app-text)]',
  // Body text
  body: 'text-sm text-[var(--app-text)]',
  bodySecondary: 'text-sm text-[var(--app-text-secondary)]',
  bodyLarge: 'text-base text-[var(--app-text)]',
  // Small / meta text
  sm: 'text-[13px] text-[var(--app-text-secondary)]',
  xs: 'text-xs text-[var(--app-text-muted)]',
  caption: 'text-[11px] text-[var(--app-text-muted)]',
  captionStrong: 'text-[11px] font-medium text-[var(--app-text-secondary)]',
  // Overlines / labels
  overline: 'text-[10px] font-semibold tracking-wider uppercase text-[var(--app-text-muted)]',
  // Numeric / KPI
  kpiValue: 'text-3xl font-bold tracking-tight text-[var(--app-text)]',
  kpiLabel: 'text-[11px] font-medium uppercase tracking-wider text-[var(--app-text-muted)]',
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
export const CSS = {
  // Surfaces
  bg: 'var(--app-bg)',
  cardBg: 'var(--app-card-bg)',
  cardBgHover: 'var(--app-card-bg-hover)',
  elevated: 'var(--app-elevated)',
  inputBg: 'var(--app-input-bg)',
  surface0: 'var(--app-surface-0)',
  surface1: 'var(--app-surface-1)',
  surface2: 'var(--app-surface-2)',
  surface3: 'var(--app-surface-3)',
  surface4: 'var(--app-surface-4)',

  // Dual accent system
  accent: 'var(--app-accent)',
  accentHover: 'var(--app-accent-hover)',
  accentLight: 'var(--app-accent-light)',
  accentGlow: 'var(--app-accent-glow)',
  accentGradientTo: 'var(--app-accent-gradient-to)',
  structural: 'var(--app-structural)',
  structuralHover: 'var(--app-structural-hover)',
  structuralLight: 'var(--app-structural-light)',
  structuralGlow: 'var(--app-structural-glow)',
  blue: 'var(--app-blue)',
  blueHover: 'var(--app-blue-hover)',
  blueLight: 'var(--app-blue-light)',
  blueGlow: 'var(--app-blue-glow)',
  orange: 'var(--app-orange)',
  orangeHover: 'var(--app-orange-hover)',
  orangeLight: 'var(--app-orange-light)',
  orangeGlow: 'var(--app-orange-glow)',

  // Text
  text: 'var(--app-text)',
  textSecondary: 'var(--app-text-secondary)',
  textMuted: 'var(--app-text-muted)',
  textDisabled: 'var(--app-text-disabled)',

  // Borders
  border: 'var(--app-border)',
  borderLight: 'var(--app-border-light)',
  borderStrong: 'var(--app-border-strong)',
  borderAccent: 'var(--app-border-accent)',
  divider: 'var(--app-divider)',

  // Interaction
  hoverBg: 'var(--app-hover-bg)',
  activeBg: 'var(--app-active-bg)',
  pressedBg: 'var(--app-pressed-bg)',

  // Semantic
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  danger: 'var(--app-danger)',
  info: 'var(--app-info)',
  successBg: 'var(--app-success-bg)',
  warningBg: 'var(--app-warning-bg)',
  dangerBg: 'var(--app-danger-bg)',
  infoBg: 'var(--app-info-bg)',

  // Shadows
  shadowSm: 'var(--app-shadow-sm)',
  shadowMd: 'var(--app-shadow-md)',
  shadowCard: 'var(--app-shadow-card)',
  shadowCardHover: 'var(--app-shadow-card-hover)',
  shadowDropdown: 'var(--app-shadow-dropdown)',
  shadowModal: 'var(--app-shadow-modal)',
  shadowAccent: 'var(--app-shadow-accent)',
  shadowBlue: 'var(--app-shadow-blue)',
  shadowGlowBlue: 'var(--app-shadow-glow-blue)',
  shadowGlowOrange: 'var(--app-shadow-glow-orange)',

  // Radius
  radiusXs: 'var(--app-radius-xs)',
  radiusSm: 'var(--app-radius-sm)',
  radiusMd: 'var(--app-radius-md)',
  radiusLg: 'var(--app-radius-lg)',
  radiusXl: 'var(--app-radius-xl)',
  radius2xl: 'var(--app-radius-2xl)',
  radiusFull: 'var(--app-radius-full)',

  // Spacing
  space0: 'var(--app-space-0)',
  space0_5: 'var(--app-space-0-5)',
  spaceXs: 'var(--app-space-xs)',
  spaceSm: 'var(--app-space-sm)',
  spaceMd: 'var(--app-space-md)',
  spaceLg: 'var(--app-space-lg)',
  spaceXl: 'var(--app-space-xl)',
  space2xl: 'var(--app-space-2xl)',
  space3xl: 'var(--app-space-3xl)',
  space4xl: 'var(--app-space-4xl)',
  space5xl: 'var(--app-space-5xl)',
  space6xl: 'var(--app-space-6xl)',

  // Overlay & Glass
  overlay: 'var(--app-overlay)',
  overlayHeavy: 'var(--app-overlay-heavy)',
  glassBg: 'var(--app-glass-bg)',

  // Selection & Focus
  selectionBg: 'var(--app-selection-bg)',
  focusRing: 'var(--app-focus-ring)',

  // Sidebar & Topbar
  sidebarBg: 'var(--app-sidebar-bg)',
  topbarBg: 'var(--app-topbar-bg)',
  topbarBorder: 'var(--app-topbar-border)',

  // Skeleton
  skeletonFrom: 'var(--app-skeleton-from)',
  skeletonTo: 'var(--app-skeleton-to)',

  // Chip/Badge
  chipBg: 'var(--app-chip-bg)',
  chipBorder: 'var(--app-chip-border)',

  // Scrollbar
  scrollbarThumb: 'var(--app-scrollbar-thumb)',
  scrollbarThumbHover: 'var(--app-scrollbar-thumb-hover)',
  scrollbarTrack: 'var(--app-scrollbar-track)',

  // Extra
  purple: 'var(--app-purple)',
  purpleLight: 'var(--app-purple-light)',
  emerald: 'var(--app-emerald)',
  emeraldLight: 'var(--app-emerald-light)',
} as const;

// ---- Surface Hierarchy ----
export const SURFACE_HIERARCHY = {
  0: CSS.surface0, // Deepest — app background
  1: CSS.surface1, // Sidebar, deep panels
  2: CSS.surface2, // Cards, content areas
  3: CSS.surface3, // Elevated cards, hovers
  4: CSS.surface4, // Modals, popovers, drawers
} as const;

// ---- Gradients ----
export const GRADIENTS = {
  brand: 'var(--app-gradient-brand)',
  brandSubtle: 'var(--app-gradient-brand-subtle)',
  brandStrong: 'var(--app-gradient-brand-strong)',
  radialGlow: 'var(--app-gradient-radial-glow)',
  surface: 'var(--app-gradient-surface)',
} as const;

// ---- Inline style helpers ----
export const inlineStyles = {
  bg: { backgroundColor: CSS.bg },
  card: { backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard, borderRadius: CSS.radiusLg },
  elevated: { backgroundColor: CSS.elevated, border: `1px solid ${CSS.border}`, borderRadius: CSS.radiusLg },
  input: { backgroundColor: CSS.inputBg, border: `1px solid ${CSS.border}`, color: CSS.text, borderRadius: CSS.radiusMd },
  glass: { backgroundColor: CSS.glassBg, backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)' },
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
  structural: { color: CSS.structural },
  structuralBg: { backgroundColor: CSS.structural },
  structuralLight: { backgroundColor: CSS.structuralLight },
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
  glowBlue: { boxShadow: CSS.shadowGlowBlue },
  glowOrange: { boxShadow: CSS.shadowGlowOrange },
} as const;

// ---- Motion ----
export const MOTION = {
  duration: {
    instant: 75,
    fast: 150,
    normal: 200,
    slow: 300,
    page: 350,
  },
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easingSpring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

// ---- Animation (Framer Motion) ----
export const ANIMATION = {
  spring: { type: 'spring' as const, stiffness: 350, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
  springStiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
  ease: MOTION.easing,
  duration: MOTION.duration,
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
  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(59, 130, 246, 0)',
        '0 0 0 4px rgba(59, 130, 246, 0.08)',
        '0 0 0 0 rgba(59, 130, 246, 0)',
      ],
    },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  glowPulseOrange: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(249, 115, 22, 0)',
        '0 0 0 4px rgba(249, 115, 22, 0.08)',
        '0 0 0 0 rgba(249, 115, 22, 0)',
      ],
    },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
} as const;

// ---- Border Radius ----
export const RADIUS = {
  xs: 'var(--app-radius-xs)',
  sm: 'var(--app-radius-sm)',
  md: 'var(--app-radius-md)',
  lg: 'var(--app-radius-lg)',
  xl: 'var(--app-radius-xl)',
  '2xl': 'var(--app-radius-2xl)',
  full: 'var(--app-radius-full)',
} as const;

// ---- Shadows ----
export const SHADOWS = {
  sm: 'var(--app-shadow-sm)',
  md: 'var(--app-shadow-md)',
  card: 'var(--app-shadow-card)',
  'card-hover': 'var(--app-shadow-card-hover)',
  dropdown: 'var(--app-shadow-dropdown)',
  modal: 'var(--app-shadow-modal)',
  accent: 'var(--app-shadow-accent)',
  blue: 'var(--app-shadow-blue)',
  glowBlue: 'var(--app-shadow-glow-blue)',
  glowOrange: 'var(--app-shadow-glow-orange)',
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
  accent: { DEFAULT: CSS.accent, hover: CSS.accentHover, light: CSS.accentLight, glow: CSS.accentGlow },
  structural: { DEFAULT: CSS.structural, hover: CSS.structuralHover, light: CSS.structuralLight, glow: CSS.structuralGlow },
  text: { primary: CSS.text, secondary: CSS.textSecondary, muted: CSS.textMuted, disabled: CSS.textDisabled },
  border: { DEFAULT: CSS.border, light: CSS.borderLight, medium: CSS.border, strong: CSS.borderStrong, accent: CSS.borderAccent },
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
  erp: { primary: 'var(--app-module-erp)', hover: 'var(--app-module-erp-hover)', light: 'var(--app-module-erp-light)', glow: 'var(--app-module-erp-glow)' },
  crm: { primary: 'var(--app-module-crm)', hover: 'var(--app-module-crm-hover)', light: 'var(--app-module-crm-light)', glow: 'var(--app-module-crm-glow)' },
  finance: { primary: 'var(--app-module-finance)', hover: 'var(--app-module-finance-hover)', light: 'var(--app-module-finance-light)', glow: 'var(--app-module-finance-glow)' },
  marketing: { primary: 'var(--app-module-marketing)', hover: 'var(--app-module-marketing-hover)', light: 'var(--app-module-marketing-light)', glow: 'var(--app-module-marketing-glow)' },
  analytics: { primary: 'var(--app-module-analytics)', hover: 'var(--app-module-analytics-hover)', light: 'var(--app-module-analytics-light)', glow: 'var(--app-module-analytics-glow)' },
  automation: { primary: 'var(--app-module-automation)', hover: 'var(--app-module-automation-hover)', light: 'var(--app-module-automation-light)', glow: 'var(--app-module-automation-glow)' },
  retention: { primary: 'var(--app-module-retention)', hover: 'var(--app-module-retention-hover)', light: 'var(--app-module-retention-light)', glow: 'var(--app-module-retention-glow)' },
  settings: { primary: 'var(--app-module-settings)', hover: 'var(--app-module-settings-hover)', light: 'var(--app-module-settings-light)', glow: 'var(--app-module-settings-glow)' },
} as const;

export type ModuleName = keyof typeof MODULE_ACCENTS;

export function getModuleAccent(module?: ModuleName) {
  if (module && MODULE_ACCENTS[module]) return MODULE_ACCENTS[module];
  return { primary: CSS.accent, hover: CSS.accentHover, light: CSS.accentLight, glow: CSS.accentGlow };
}

// ---- Layout Constants ----
export const LAYOUT = {
  sidebarWidth: 260,
  sidebarCollapsedWidth: 68,
  sidebarMobileWidth: 280,
  topbarHeight: 56,
  topbarHeightPx: '3.5rem',
  footerHeight: 40,
  maxContentWidth: 1440,
} as const;
