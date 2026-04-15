'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { BrainCircuit, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIWorkflowInsightProps {
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action: string;
  metric?: string;
  metricValue?: string;
  onClick?: () => void;
}

const impactConfig: Record<
  string,
  { label: string; badgeBg: string; badgeText: string }
> = {
  high: {
    label: 'High Impact',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
  },
  medium: {
    label: 'Medium Impact',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
  },
  low: {
    label: 'Low Impact',
    badgeBg: 'bg-zinc-500/15',
    badgeText: 'text-zinc-400',
  },
};

export default function AIWorkflowInsight({
  title,
  description,
  confidence,
  impact,
  action,
  metric,
  metricValue,
  onClick,
}: AIWorkflowInsightProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const impactStyle = impactConfig[impact];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border border-l-4 border-l-violet-500 p-4 sm:p-5 shadow-sm transition-shadow cursor-pointer',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:shadow-violet-500/5'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03] hover:shadow-violet-500/5',
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* AI Icon with glow */}
        <div
          className={cn(
            'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            isDark ? 'bg-violet-500/15' : 'bg-violet-50',
          )}
        >
          {/* Subtle glow behind icon */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-xl blur-md',
              isDark ? 'bg-violet-500/20' : 'bg-violet-400/20',
            )}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <BrainCircuit className={cn('relative h-5 w-5', isDark ? 'text-violet-400' : 'text-violet-600')} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                'text-sm font-semibold truncate',
                isDark ? 'text-white' : 'text-zinc-900',
              )}
            >
              {title}
            </h4>
            <Sparkles
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                isDark ? 'text-violet-400' : 'text-violet-500',
              )}
            />
          </div>

          {/* Description */}
          <p
            className={cn(
              'text-xs leading-relaxed line-clamp-2',
              isDark ? 'text-zinc-400' : 'text-zinc-500',
            )}
          >
            {description}
          </p>

          {/* Confidence bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className={cn('font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                Confidence
              </span>
              <span className={cn('font-bold tabular-nums', isDark ? 'text-violet-400' : 'text-violet-600')}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className={cn('h-1.5 w-full rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  confidence >= 0.8
                    ? isDark ? 'bg-violet-400' : 'bg-violet-500'
                    : confidence >= 0.5
                      ? isDark ? 'bg-amber-400' : 'bg-amber-500'
                      : isDark ? 'bg-zinc-400' : 'bg-zinc-400',
                )}
              />
            </div>
          </div>

          {/* Impact + Metric row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Impact badge */}
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                impactStyle.badgeBg,
                impactStyle.badgeText,
              )}
            >
              {impactStyle.label}
            </span>

            {/* Metric display */}
            {metric && metricValue && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  isDark ? 'bg-white/[0.06] text-zinc-300' : 'bg-black/[0.04] text-zinc-600',
                )}
              >
                {metric}: <span className="font-bold">{metricValue}</span>
              </span>
            )}
          </div>

          {/* Suggested action */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2.5',
              isDark ? 'bg-violet-500/[0.06]' : 'bg-violet-50/50',
            )}
          >
            <ArrowUpRight className={cn('h-3.5 w-3.5 shrink-0', isDark ? 'text-violet-400' : 'text-violet-600')} />
            <span className={cn('text-xs font-medium leading-relaxed', isDark ? 'text-violet-300' : 'text-violet-700')}>
              {action}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
