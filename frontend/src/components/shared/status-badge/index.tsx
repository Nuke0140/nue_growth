'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';

// ── Types ──────────────────────────────────────────────

export type StatusColorVariant = 'green' | 'amber' | 'red' | 'gray' | 'blue';

export interface StatusBadgeProps {
  /** Status string used to determine color (case-insensitive) */
  status: string;
  /** Visual variant: 'dot' shows a colored dot + text, 'pill' shows a colored background pill */
  variant?: 'dot' | 'pill';
  /** Additional class name */
  className?: string;
}

// ── Status → Color mapping ─────────────────────────────

const statusColorMap: Record<string, StatusColorVariant> = {
  // Green — positive / completed states
  active: 'green',
  green: 'green',
  success: 'green',
  paid: 'green',
  approved: 'green',
  completed: 'green',
  delivered: 'green',
  resolved: 'green',
  online: 'green',
  present: 'green',
  excellent: 'green',
  good: 'green',
  sent: 'green',

  // Amber — in-progress / transitional states
  pending: 'amber',
  warning: 'amber',
  in_progress: 'amber',
  'in progress': 'amber',
  processing: 'amber',
  on_hold: 'amber',
  'on hold': 'amber',
  review: 'amber',
  'half-day': 'amber',
  partial: 'amber',
  'at-risk': 'amber',

  // Red — negative / error states
  critical: 'red',
  error: 'red',
  rejected: 'red',
  overdue: 'red',
  failed: 'red',
  cancelled: 'red',
  canceled: 'red',
  blocked: 'red',
  absent: 'red',
  escalated: 'red',

  // Gray — neutral / inactive states
  neutral: 'gray',
  inactive: 'gray',
  draft: 'gray',
  archived: 'gray',
  offline: 'gray',
  'on-leave': 'gray',

  // Blue — informational / scheduled states
  info: 'blue',
  blue: 'blue',
  scheduled: 'blue',
  planned: 'blue',
  new: 'blue',
  wfh: 'blue',
};

// ── Color styles ───────────────────────────────────────
// Semantic colors are hardcoded for consistent cross-theme readability.
// The 'gray' variant uses --app-* tokens so it adapts to the current theme.

const colorStyles: Record<StatusColorVariant, { bg: string; text: string; dot: string }> = {
  green: {
    bg: 'rgba(52, 211, 153, 0.12)',
    text: '#34d399',
    dot: '#34d399',
  },
  amber: {
    bg: 'rgba(251, 191, 36, 0.12)',
    text: '#fbbf24',
    dot: '#fbbf24',
  },
  red: {
    bg: 'rgba(248, 113, 113, 0.12)',
    text: '#f87171',
    dot: '#f87171',
  },
  gray: {
    bg: CSS.hoverBg,
    text: CSS.textSecondary,
    dot: CSS.textMuted,
  },
  blue: {
    bg: 'rgba(96, 165, 250, 0.12)',
    text: '#60a5fa',
    dot: '#60a5fa',
  },
};

// ── Helpers ────────────────────────────────────────────

function getColor(status: string): StatusColorVariant {
  const key = status.toLowerCase().trim();
  return statusColorMap[key] || 'gray';
}

// ── Component ──────────────────────────────────────────

export const StatusBadge = memo(function StatusBadge({
  status,
  variant = 'pill',
  className,
}: StatusBadgeProps) {
  const color = getColor(status);
  const styles = colorStyles[color];

  // 'dot' variant: colored dot + text
  if (variant === 'dot') {
    return (
      <span
        className={cn('inline-flex items-center gap-1.5', className)}
        role="status"
        aria-label={`Status: ${status}`}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: styles.dot }}
          aria-hidden="true"
        />
        <span
          className="text-xs font-medium capitalize"
          style={{ color: styles.text }}
        >
          {status}
        </span>
      </span>
    );
  }

  // 'pill' variant: colored background pill with text
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize leading-none',
        className,
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
      }}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
});

export default StatusBadge;
