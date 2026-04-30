'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────
function formatKpiValue(value: string | number) {
  if (typeof value === 'string') return value;
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

// ─── Component ────────────────────────────────────────────
interface FinanceKpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  color?: string;
  bg?: string;
  severity?: 'normal' | 'warning' | 'critical';
}

export default function FinanceKpiCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'text-emerald-500',
  bg = 'bg-emerald-500/10',
  severity = 'normal',
}: FinanceKpiCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] overflow-hidden',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06]',
        severity === 'critical' && 'shadow-[var(--app-shadow-md)]-red-500/10',
        severity === 'warning' && 'shadow-[var(--app-shadow-md)]-amber-500/10'
      )}
    >
      {/* Severity glow pulse */}
      {severity === 'critical' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[var(--app-radius-xl)]"
          animate={{
            boxShadow: [
              '0 0 15px rgba(239,68,68,0.06)',
              '0 0 25px rgba(239,68,68,0.14)',
              '0 0 15px rgba(239,68,68,0.06)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {severity === 'warning' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[var(--app-radius-xl)]"
          animate={{
            boxShadow: [
              '0 0 12px rgba(245,158,11,0.06)',
              '0 0 20px rgba(245,158,11,0.12)',
              '0 0 12px rgba(245,158,11,0.06)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center',
            isDark ? (bg || 'bg-white/[0.06]') : (bg || 'bg-black/[0.04]')
          )}
        >
          <Icon className={cn('w-5 h-5', color)} />
        </div>
        {severity !== 'normal' && (
          <AlertTriangle
            className={cn(
              'w-4 h-4',
              severity === 'critical' ? 'text-red-500' : 'text-amber-500'
            )}
          />
        )}
      </div>

      <p className={cn('text-[11px] font-medium mb-1', 'text-[var(--app-text-muted)]')}>
        {label}
      </p>
      <p className="text-lg font-bold tracking-tight mb-1.5">
        {typeof value === 'string' ? value : formatKpiValue(value)}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              'flex items-center gap-0.5 px-1.5 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-semibold',
              isPositive
                ? 'bg-[var(--app-success-bg)] text-[var(--app-success)]'
                : 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]'
            )}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}
            {typeof change === 'number' ? change.toFixed(1) : change}%
          </div>
          {changeLabel && (
            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
