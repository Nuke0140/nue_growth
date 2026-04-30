'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RoiWidgetProps {
  roi: number;
  trend?: number;
  label?: string;
}

export default function RoiWidget({ roi, trend, label = 'Return on Investment' }: RoiWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colorClass = roi > 200 ? 'text-emerald-500' : roi >= 100 ? 'text-amber-500' : 'text-red-500';
  const bgAccent = roi > 200
    ? ('bg-[var(--app-success-bg)]')
    : roi >= 100
      ? ('bg-[var(--app-warning-bg)]')
      : ('bg-[var(--app-danger-bg)]');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
    >
      <p className={cn('text-[10px] mb-1', 'text-[var(--app-text-muted)]')}>{label}</p>
      <div className="flex items-end gap-2">
        <span className={cn('text-3xl font-bold tabular-nums', colorClass)}>{roi}x</span>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-0.5 mb-1', trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-xs font-medium">{trend >= 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <div className={cn('mt-2 h-1 rounded-full', bgAccent)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, roi / 5)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', colorClass)}
          style={{ opacity: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
