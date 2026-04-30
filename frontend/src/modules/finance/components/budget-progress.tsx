'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Lock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

type BudgetStatus = 'on-track' | 'at-risk' | 'overspent' | 'locked';

function getStatusConfig(status: BudgetStatus, isDark: boolean) {
  switch (status) {
    case 'on-track':
      return {
        barColor: 'bg-emerald-500',
        barBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-100',
        textColor: 'text-[var(--app-success)]',
        icon: null,
      };
    case 'at-risk':
      return {
        barColor: 'bg-amber-500',
        barBg: isDark ? 'bg-amber-500/10' : 'bg-amber-100',
        textColor: 'text-[var(--app-warning)]',
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      };
    case 'overspent':
      return {
        barColor: 'bg-red-500',
        barBg: isDark ? 'bg-red-500/10' : 'bg-red-100',
        textColor: 'text-[var(--app-danger)]',
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      };
    case 'locked':
      return {
        barColor: 'bg-slate-500',
        barBg: isDark ? 'bg-slate-500/10' : 'bg-slate-100',
        textColor: isDark ? 'text-slate-400' : 'text-slate-600',
        icon: <Lock className="w-4 h-4 text-slate-500" />,
      };
  }
}

// ─── Component ────────────────────────────────────────────
interface BudgetProgressProps {
  name: string;
  type: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: BudgetStatus;
  variancePercent: number;
}

export default function BudgetProgress({
  name,
  type,
  allocated,
  spent,
  remaining,
  status,
  variancePercent,
}: BudgetProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = getStatusConfig(status, isDark);
  const pct = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-4',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
            {name}
          </span>
          <span className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded-[var(--app-radius-md)] text-[9px] font-medium',
            isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.04] text-black/40'
          )}>
            {type}
          </span>
        </div>
        {config.icon}
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-3">
        <div className={cn('w-full h-2.5 rounded-full overflow-hidden', config.barBg)}>
          <motion.div
            className={cn('h-full rounded-full', config.barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
            {formatAmount(spent)} spent
          </span>
          <span className={cn('text-[10px] font-semibold tabular-nums', config.textColor)}>
            {pct}% of {formatAmount(allocated)}
          </span>
        </div>
      </div>

      {/* Footer details */}
      <div className="flex items-center justify-between pt-2 border-t border-dashed"
        style={{ borderColor: 'var(--app-border)' }}>
        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
          Remaining: <span className={cn('font-semibold', config.textColor)}>{formatAmount(remaining)}</span>
        </span>
        <span className={cn(
          'text-[10px] font-medium',
          variancePercent < 0
            ? 'text-[var(--app-danger)]'
            : 'text-[var(--app-text-secondary)]'
        )}>
          Variance: {variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
