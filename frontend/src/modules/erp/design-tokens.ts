// ============================================
// ERP Module — Design Tokens (LOCKED)
// ============================================
// DO NOT use hardcoded colors, spacing, or typography.
// Import from this file instead.

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

// ---- Colors ----
export const COLORS = {
  // Backgrounds
  bg: {
    primary: '#1b1c1e',
    card: '#222325',
    'card-hover': '#2a2b2e',
    elevated: '#2a2b2e',
    input: '#2a2b2e',
  },
  // Accent
  accent: {
    DEFAULT: '#cc5c37',
    hover: '#d46a44',
    light: 'rgba(204, 92, 55, 0.1)',
    medium: 'rgba(204, 92, 55, 0.15)',
    border: 'rgba(204, 92, 55, 0.3)',
  },
  // Text
  text: {
    primary: '#f5f5f5',
    secondary: 'rgba(245, 245, 245, 0.6)',
    muted: 'rgba(245, 245, 245, 0.35)',
    disabled: 'rgba(245, 245, 245, 0.2)',
    accent: '#cc5c37',
  },
  // Border
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.06)',
    light: 'rgba(255, 255, 255, 0.04)',
    medium: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
    accent: 'rgba(204, 92, 55, 0.3)',
  },
  // Semantic
  semantic: {
    success: { DEFAULT: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)' },
    warning: { DEFAULT: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)' },
    danger: { DEFAULT: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.3)' },
    info: { DEFAULT: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)' },
    critical: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' },
  },
  // Status colors (consistent across all pages)
  status: {
    active: { DEFAULT: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    pending: { DEFAULT: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    completed: { DEFAULT: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
    cancelled: { DEFAULT: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
    'on-hold': { DEFAULT: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
    draft: { DEFAULT: 'rgba(245, 245, 245, 0.4)', bg: 'rgba(245, 245, 245, 0.04)' },
    sent: { DEFAULT: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
    paid: { DEFAULT: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    overdue: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    partial: { DEFAULT: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    approved: { DEFAULT: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    rejected: { DEFAULT: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
    escalated: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    'in-progress': { DEFAULT: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    review: { DEFAULT: '#cc5c37', bg: 'rgba(204, 92, 55, 0.1)' },
    blocked: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    'at-risk': { DEFAULT: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
    critical: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
    good: { DEFAULT: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    excellent: { DEFAULT: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  },
  // Priority colors
  priority: {
    low: { DEFAULT: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    medium: { DEFAULT: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    high: { DEFAULT: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    critical: { DEFAULT: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  },
  // Severity colors
  severity: {
    low: '#10b981',
    medium: '#fbbf24',
    high: '#f59e0b',
    critical: '#ef4444',
  },
} as const;

// ---- Animation ----
export const ANIMATION = {
  // Standard spring for most interactions
  spring: { type: 'spring' as const, stiffness: 350, damping: 30 },
  // Gentle spring for sidebar/panels
  springGentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
  // Stiff spring for quick feedback
  springStiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
  // Standard easing curve (matches layout.tsx)
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  // Duration presets
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    pageTransition: 0.35,
  },
  // Page variants (for AnimatePresence)
  pageVariants: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  },
  // Fade up for content sections
  fadeUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  },
  // Stagger container
  stagger: {
    animate: { transition: { staggerChildren: 0.04 } },
  },
} as const;

// ---- Border Radius ----
export const RADIUS = {
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ---- Shadows ----
export const SHADOWS = {
  card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06)',
  'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
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

// ---- Helper: Get status color config ----
export function getStatusColor(status: string): { color: string; bg: string } {
  const key = status as keyof typeof COLORS.status;
  if (COLORS.status[key]) {
    return { color: COLORS.status[key].DEFAULT, bg: COLORS.status[key].bg };
  }
  // Fallback
  return { color: COLORS.text.muted, bg: 'rgba(245, 245, 245, 0.04)' };
}

// ---- Helper: Get priority color config ----
export function getPriorityColor(priority: string): { color: string; bg: string } {
  const key = priority as keyof typeof COLORS.priority;
  if (COLORS.priority[key]) {
    return { color: COLORS.priority[key].DEFAULT, bg: COLORS.priority[key].bg };
  }
  return { color: COLORS.text.muted, bg: 'rgba(245, 245, 245, 0.04)' };
}

// ---- Helper: Get severity color ----
export function getSeverityColor(severity: string): string {
  const key = severity as keyof typeof COLORS.severity;
  return COLORS.severity[key] || COLORS.text.muted;
}
