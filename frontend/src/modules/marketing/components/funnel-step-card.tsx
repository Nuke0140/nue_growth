'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { FunnelStep } from '@/modules/marketing/types';

interface FunnelStepCardProps {
  step: FunnelStep;
  index: number;
  totalSteps: number;
}

export default function FunnelStepCard({ step, index, totalSteps }: FunnelStepCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const maxConversions = Math.max(step.visitors, 1);
  const widthPercent = (step.conversions / maxConversions) * 100;
  const isLast = index === totalSteps - 1;
  const isFirst = index === 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <div
          className={cn('rounded-[var(--app-radius-lg)] border p-3 transition-colors',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]',
            isLast && 'ring-1 ring-emerald-500/20'
          )}
          style={{ maxWidth: `${Math.max(120, widthPercent * 3)}px`, margin: '0 auto' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                isDark ? 'bg-white/[0.08] text-white/50' : 'bg-gray-100 text-gray-600'
              )}>
                {index + 1}
              </span>
              <span className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>{step.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div>
              <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Visitors</p>
              <p className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-gray-800')}>
                {step.visitors.toLocaleString()}
              </p>
            </div>
            <div>
              <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Conversions</p>
              <p className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-gray-800')}>
                {step.conversions.toLocaleString()}
              </p>
            </div>
            {!isFirst && (
              <div>
                <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Drop-off</p>
                <p className={cn('text-xs font-bold tabular-nums', step.dropOff > 60 ? 'text-red-500' : step.dropOff > 40 ? 'text-amber-500' : 'text-emerald-500')}>
                  {step.dropOff}%
                </p>
              </div>
            )}
            {step.revenue > 0 && (
              <div>
                <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Revenue</p>
                <p className={cn('text-xs font-bold tabular-nums text-emerald-500')}>
                  ₹{(step.revenue / 100000).toFixed(1)}L
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Connector line */}
      {!isLast && (
        <div className="flex flex-col items-center py-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.08 + 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('w-px h-4', isDark ? 'bg-white/[0.08]' : 'bg-gray-200')}
            style={{ transformOrigin: 'top' }}
          />
          {step.dropOff > 0 && (
            <div className="flex items-center gap-0.5">
              <ArrowDown className={cn('w-4 h-4', step.dropOff > 60 ? 'text-red-400' : 'text-amber-400')} />
              <span className={cn('text-[9px] font-medium', step.dropOff > 60 ? 'text-red-400' : 'text-amber-400')}>
                -{step.dropOff}%
              </span>
            </div>
          )}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.08 + 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('w-px h-4', isDark ? 'bg-white/[0.08]' : 'bg-gray-200')}
            style={{ transformOrigin: 'top' }}
          />
        </div>
      )}
    </div>
  );
}
