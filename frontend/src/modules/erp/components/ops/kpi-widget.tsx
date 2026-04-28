'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ANIMATION, COLORS } from '../../design-tokens';

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
    bg: 'rgba(204, 92, 55, 0.1)',
    text: '#cc5c37',
    iconBg: 'rgba(204, 92, 55, 0.12)',
  },
  success: {
    bg: 'rgba(52, 211, 153, 0.1)',
    text: '#34d399',
    iconBg: 'rgba(52, 211, 153, 0.12)',
  },
  warning: {
    bg: 'rgba(251, 191, 36, 0.1)',
    text: '#fbbf24',
    iconBg: 'rgba(251, 191, 36, 0.12)',
  },
  danger: {
    bg: 'rgba(248, 113, 113, 0.1)',
    text: '#f87171',
    iconBg: 'rgba(248, 113, 113, 0.12)',
  },
  info: {
    bg: 'rgba(96, 165, 250, 0.1)',
    text: '#60a5fa',
    iconBg: 'rgba(96, 165, 250, 0.12)',
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
      ? 'var(--ops-success)'
      : trend === 'down'
        ? 'var(--ops-danger)'
        : 'var(--ops-text-muted)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION.durationMedium }}
      className={cn('ops-card ops-glow relative overflow-hidden p-6', className)}
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
            style={{ color: 'var(--ops-text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--ops-text)' }}
          >
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-1">
              <TrendIcon
                className="w-3.5 h-3.5"
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
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ backgroundColor: colors.iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: colors.text }} />
        </div>
      </div>
    </motion.div>
  );
});
