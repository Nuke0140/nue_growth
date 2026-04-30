'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BudgetProgressBarProps {
  spent: number;
  budget: number;
  label?: string;
}

export default function BudgetProgressBar({ spent, budget, label }: BudgetProgressBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const remaining = budget - spent;

  const barColor = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = pct > 90 ? 'text-red-500' : pct > 70 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-gray-700')}>{label}</span>
          <span className={cn('text-xs font-bold tabular-nums', textColor)}>{pct}%</span>
        </div>
      )}
      <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', barColor)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
          ₹{spent.toLocaleString()} spent
        </span>
        <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
          ₹{budget.toLocaleString()} budget
          {remaining > 0 && (
            <span className={cn('ml-1', isDark ? 'text-white/20' : 'text-gray-300')}>
              (₹{remaining.toLocaleString()} left)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
