'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type StatusColor = 'green' | 'amber' | 'red' | 'gray' | 'blue';

interface StatusBadgeProps {
  status: string;
  variant?: 'dot' | 'pill';
  className?: string;
}

const statusColorMap: Record<string, StatusColor> = {
  // Green
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
  // Amber
  pending: 'amber',
  warning: 'amber',
  in_progress: 'amber',
  'in progress': 'amber',
  processing: 'amber',
  on_hold: 'amber',
  'on hold': 'amber',
  review: 'amber',
  'half-day': 'amber',
  // Red
  critical: 'red',
  error: 'red',
  rejected: 'red',
  overdue: 'red',
  failed: 'red',
  cancelled: 'red',
  canceled: 'red',
  blocked: 'red',
  absent: 'red',
  // Gray
  neutral: 'gray',
  inactive: 'gray',
  draft: 'gray',
  archived: 'gray',
  offline: 'gray',
  'on-leave': 'gray',
  // Blue
  info: 'blue',
  blue: 'blue',
  scheduled: 'blue',
  planned: 'blue',
  new: 'blue',
  wfh: 'blue',
};

const colorStyles: Record<StatusColor, { bg: string; text: string; dot: string }> = {
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
    bg: 'var(--ops-hover-bg)',
    text: 'var(--ops-text-secondary)',
    dot: 'var(--ops-text-muted)',
  },
  blue: {
    bg: 'rgba(96, 165, 250, 0.12)',
    text: '#60a5fa',
    dot: '#60a5fa',
  },
};

function getColor(status: string): StatusColor {
  const key = status.toLowerCase().trim();
  return statusColorMap[key] || 'gray';
}

export function StatusBadge({
  status,
  variant = 'pill',
  className,
}: StatusBadgeProps) {
  const color = getColor(status);
  const styles = colorStyles[color];

  if (variant === 'dot') {
    return (
      <span className={cn('inline-flex items-center gap-1.5', className)}>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: styles.dot }}
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

  return (
    <span
      className={cn(
        'ops-badge capitalize font-medium',
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
      }}
    >
      {status}
    </span>
  );
}
