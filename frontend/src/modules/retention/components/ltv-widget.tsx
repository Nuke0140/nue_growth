'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LTVWidgetProps {
  segment: string;
  currentLTV: number;
  predictedLTV: number;
  bestCase: number;
  worstCase: number;
  confidence: number;
  churnRisk: number;
}

function formatLTV(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

export default function LTVWidget({ segment, currentLTV, predictedLTV, bestCase, worstCase, confidence, churnRisk }: LTVWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const growth = predictedLTV - currentLTV;
  const isPositive = growth >= 0;

  // Range bar positions (normalized 0-100)
  const rangeMin = worstCase;
  const rangeMax = bestCase;
  const rangeSpan = rangeMax - rangeMin || 1;
  const currentPos = ((currentLTV - rangeMin) / rangeSpan) * 100;
  const predictedPos = ((predictedLTV - rangeMin) / rangeSpan) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{segment}</h3>
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-emerald-400' : 'text-red-400')}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {isPositive ? '+' : ''}{formatLTV(growth)}
        </div>
      </div>

      {/* Current vs Predicted */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
          <p className={cn('text-[10px] mb-1', 'text-[var(--app-text-muted)]')}>Current LTV</p>
          <p className="text-lg font-bold">{formatLTV(currentLTV)}</p>
        </div>
        <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
          <p className={cn('text-[10px] mb-1', 'text-[var(--app-text-muted)]')}>Predicted LTV</p>
          <p className="text-lg font-bold">{formatLTV(predictedLTV)}</p>
        </div>
      </div>

      {/* Range bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Worst case</span>
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Best case</span>
        </div>
        <div className="relative h-2 rounded-full bg-gradient-to-r from-red-400/30 via-amber-400/30 to-emerald-400/30">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-black shadow-md"
            style={{ left: `${Math.min(Math.max(currentPos, 0), 100)}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-violet-400 bg-violet-400/30 shadow-md"
            style={{ left: `${Math.min(Math.max(predictedPos, 0), 100)}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          />
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white border border-black/30" />
            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Current</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Predicted</span>
          </div>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="flex items-center justify-between">
        {/* Confidence meter */}
        <div className="flex items-center gap-2">
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Confidence</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden bg-black/10">
            <motion.div
              className={cn('h-full rounded-full', confidence >= 70 ? 'bg-emerald-400' : confidence >= 40 ? 'bg-amber-400' : 'bg-red-400')}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
          <span className="text-[10px] font-medium">{confidence}%</span>
        </div>

        {/* Churn risk */}
        <div className={cn('flex items-center gap-1 text-xs', churnRisk > 20 ? 'text-red-400' : churnRisk > 10 ? 'text-amber-400' : 'text-emerald-400')}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="font-medium">{churnRisk}% churn risk</span>
        </div>
      </div>
    </motion.div>
  );
}
