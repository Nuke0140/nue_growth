'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon?: React.ElementType;
  severity?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

const severityBorder: Record<string, string> = {
  normal: '',
  warning: 'border-l-amber-500',
  critical: 'border-l-red-500',
};

const severityGlow: Record<string, string> = {
  normal: '',
  warning: 'shadow-amber-500/5',
  critical: 'shadow-red-500/5',
};

export default function KPICard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  severity = 'normal',
  trend,
}: KPICardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const resolvedTrend = trend ?? (change > 0 ? 'up' : change < 0 ? 'down' : 'stable');
  const isPositive = resolvedTrend === 'up';
  const isNegative = resolvedTrend === 'down';

  const TrendIcon = resolvedTrend === 'up'
    ? TrendingUp
    : resolvedTrend === 'down'
      ? TrendingDown
      : Minus;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative rounded-2xl border border-l-4 p-4 sm:p-5',
        'shadow-sm hover:shadow-md transition-shadow',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
        severityBorder[severity],
        severityGlow[severity],
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Value + Label */}
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              'text-xs font-medium uppercase tracking-wider truncate',
              isDark ? 'text-zinc-400' : 'text-zinc-500',
            )}
          >
            {label}
          </p>

          <p
            className={cn(
              'text-2xl sm:text-3xl font-bold tracking-tight truncate',
              isDark ? 'text-white' : 'text-zinc-900',
            )}
          >
            {value}
          </p>

          {/* Change Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                isPositive && (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'),
                isNegative && (isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'),
                resolvedTrend === 'stable' && (isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-600'),
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            <span
              className={cn(
                'text-xs',
                isDark ? 'text-zinc-500' : 'text-zinc-400',
              )}
            >
              {changeLabel}
            </span>
          </div>
        </div>

        {/* Right: Icon */}
        {Icon && (
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]',
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                isDark ? 'text-zinc-400' : 'text-zinc-500',
              )}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
