'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ANIMATION, COLORS } from '@/styles/design-tokens';

interface KpiWidgetProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const colorMap = {
  accent: {
    bg: 'var(--app-accent-light)',
    text: 'var(--app-accent)',
    iconBg: 'var(--app-accent-light)',
  },
  success: {
    bg: 'var(--app-success-bg)',
    text: '#34d399',
    iconBg: 'var(--app-success-bg)',
  },
  warning: {
    bg: 'var(--app-warning-bg)',
    text: '#fbbf24',
    iconBg: 'var(--app-warning-bg)',
  },
  danger: {
    bg: 'var(--app-danger-bg)',
    text: '#f87171',
    iconBg: 'var(--app-danger-bg)',
  },
  info: {
    bg: 'var(--app-info-bg)',
    text: '#60a5fa',
    iconBg: 'var(--app-info-bg)',
  },
};

export const KpiWidget = React.memo(function KpiWidget({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'accent',
  className,
}: KpiWidgetProps) {
  const colors = colorMap[color];
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const trendColor =
    trend === 'up'
      ? 'var(--app-success)'
      : trend === 'down'
        ? 'var(--app-danger)'
        : 'var(--app-text-muted)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION.durationMedium }}
      className={cn('app-card app-glow relative overflow-hidden p-6', className)}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      {/* Background icon */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none" aria-hidden="true">
        <Icon className="w-full h-full" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--app-text)' }}
          >
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-1">
              <TrendIcon
                className="w-4 h-4"
                style={{ color: trendColor }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: trendColor }}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center w-11 h-10  rounded-[var(--app-radius-lg)] shrink-0"
          style={{ backgroundColor: colors.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: colors.text }} />
        </div>
      </div>
    </motion.div>
  );
});
