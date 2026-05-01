'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION, CSS } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export type KpiColorVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** Icon type that accepts both Lucide icon components and inline render functions */
export type KpiIcon = LucideIcon | (() => React.ReactElement);

export interface KpiWidgetProps {
  /** KPI label displayed above the value */
  label: string;
  /** Primary value to display */
  value: string | number;
  /** Icon component (LucideIcon or inline render function) */
  icon: KpiIcon;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend value (e.g. "+12.5%") */
  trendValue?: string;
  /** Color variant (accepts KpiColorVariant or arbitrary string for data-driven usage) */
  color?: KpiColorVariant | string;
  /** Additional class names */
  className?: string;
}

// ── Color Config ───────────────────────────────────────

const colorMap: Record<KpiColorVariant, { bg: string; text: string; iconBg: string }> = {
  accent: {
    bg: CSS.accentLight,
    text: CSS.accent,
    iconBg: CSS.accentLight,
  },
  success: {
    bg: CSS.successBg,
    text: CSS.success,
    iconBg: CSS.successBg,
  },
  warning: {
    bg: CSS.warningBg,
    text: CSS.warning,
    iconBg: CSS.warningBg,
  },
  danger: {
    bg: CSS.dangerBg,
    text: CSS.danger,
    iconBg: CSS.dangerBg,
  },
  info: {
    bg: CSS.infoBg,
    text: CSS.info,
    iconBg: CSS.infoBg,
  },
};

// ── Component ──────────────────────────────────────────

export const KpiWidget = React.memo(function KpiWidget({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'accent',
  className,
}: KpiWidgetProps) {
  const colors = colorMap[color as KpiColorVariant] ?? colorMap.accent;
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const trendColor =
    trend === 'up'
      ? CSS.success
      : trend === 'down'
        ? CSS.danger
        : CSS.textMuted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION.duration.slow }}
      className={cn('relative overflow-hidden p-6 rounded-2xl', className)}
      style={{
        backgroundColor: CSS.cardBg,
        border: `1px solid ${CSS.border}`,
        boxShadow: CSS.shadowCard,
      }}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      {/* Background icon (decorative) */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      >
        {'$$typeof' in Icon ? <Icon className="w-full h-full" /> : (Icon as () => React.ReactNode)()}
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: CSS.textMuted }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: CSS.text }}
          >
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-1">
              <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColor }} />
              <span className="text-xs font-medium" style={{ color: trendColor }}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ backgroundColor: colors.iconBg }}
        >
          {'$$typeof' in Icon ? <Icon className="w-5 h-5" style={{ color: colors.text }} /> : (Icon as () => React.ReactNode)()}
        </div>
      </div>
    </motion.div>
  );
});
