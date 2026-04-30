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
    bg: 'var(--app-success-bg)',
    text: '#34d399',
    dot: '#34d399',
  },
  amber: {
    bg: 'var(--app-warning-bg)',
    text: '#fbbf24',
    dot: '#fbbf24',
  },
  red: {
    bg: 'var(--app-danger-bg)',
    text: '#f87171',
    dot: '#f87171',
  },
  gray: {
    bg: 'var(--app-hover-bg)',
    text: 'var(--app-text-secondary)',
    dot: 'var(--app-text-muted)',
  },
  blue: {
    bg: 'var(--app-info-bg)',
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
        'app-badge capitalize font-medium',
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
