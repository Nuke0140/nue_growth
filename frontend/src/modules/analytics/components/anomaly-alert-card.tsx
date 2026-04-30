'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnomalyAlertCardProps {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  metric: string;
  expected: number;
  actual: number;
  recommendation: string;
}

const severityConfig: Record<
  string,
  {
    borderColor: string;
    bgColor: string;
    textColor: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ElementType;
    label: string;
  }
> = {
  critical: {
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-500/5',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-400',
    icon: AlertTriangle,
    label: 'Critical',
  },
  high: {
    borderColor: 'border-l-orange-500',
    bgColor: 'bg-orange-500/5',
    textColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-400',
    icon: AlertCircle,
    label: 'High',
  },
  medium: {
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-yellow-500/5',
    textColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/15',
    badgeText: 'text-yellow-400',
    icon: Info,
    label: 'Medium',
  },
  low: {
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-500/5',
    textColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    icon: Info,
    label: 'Low',
  },
};

export default function AnomalyAlertCard({
  title,
  description,
  severity,
  detectedAt,
  metric,
  expected,
  actual,
  recommendation,
}: AnomalyAlertCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [expanded, setExpanded] = useState(false);

  const config = severityConfig[severity];
  const SeverityIcon = config.icon;

  const deviation = expected > 0 ? ((actual - expected) / expected) * 100 : 0;
  const isHigher = actual > expected;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'rounded-2xl border border-l-4 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
        config.borderColor,
      )}
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn('shrink-0', config.textColor)}>
              <SeverityIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4
                className={cn(
                  'text-sm font-semibold truncate',
                  'text-[var(--app-text)]',
                )}
              >
                {title}
              </h4>
              <p
                className={cn(
                  'text-xs mt-0.5 line-clamp-2',
                  'text-[var(--app-text-muted)]',
                )}
              >
                {description}
              </p>
            </div>
          </div>

          <span
            className={cn(
              'shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              config.badgeBg,
              config.badgeText,
            )}
          >
            {config.label}
          </span>
        </div>

        {/* Metric Comparison */}
        <div
          className={cn(
            'grid grid-cols-3 gap-2 rounded-xl p-3',
            'bg-[var(--app-hover-bg)]',
          )}
        >
          <div className="text-center">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
              Metric
            </p>
            <p className={cn('text-xs font-semibold mt-0.5 truncate', 'text-[var(--app-text-secondary)]')}>
              {metric}
            </p>
          </div>
          <div className="text-center">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
              Expected
            </p>
            <p className={cn('text-xs font-semibold mt-0.5', 'text-[var(--app-text-secondary)]')}>
              {expected.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
              Actual
            </p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              {isHigher ? (
                <ArrowUpRight className="h-3 w-3 text-red-400" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-400" />
              )}
              <p className="text-xs font-bold text-red-400">
                {actual.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Deviation + Timestamp */}
        <div className="flex items-center justify-between text-xs">
          <span className={cn('font-medium', 'text-[var(--app-text-muted)]')}>
            Deviation: <span className="text-red-400 font-bold">{deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%</span>
          </span>
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
            {detectedAt}
          </span>
        </div>

        {/* Expandable Recommendation */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors text-left',
            isDark
              ? 'bg-white/[0.03] hover:bg-white/[0.05] text-zinc-400'
              : 'bg-black/[0.02] hover:bg-black/[0.03] text-zinc-500',
          )}
        >
          <span className="font-medium">Recommendation</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className={cn('text-xs leading-relaxed px-1', 'text-[var(--app-text-secondary)]')}>
                {recommendation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
