'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

// ─── Component ────────────────────────────────────────────
interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  color: string;
}

interface AgingBucketChartProps {
  buckets: AgingBucket[];
}

export default function AgingBucketChart({ buckets }: AgingBucketChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const maxAmount = useMemo(() => {
    return Math.max(...buckets.map((b) => b.amount), 1);
  }, [buckets]);

  const totalAmount = useMemo(() => {
    return buckets.reduce((sum, b) => sum + b.amount, 0);
  }, [buckets]);

  const totalCount = useMemo(() => {
    return buckets.reduce((sum, b) => sum + b.count, 0);
  }, [buckets]);

  if (buckets.length === 0) {
    return (
      <div className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}>
        <p className={cn('text-xs text-center py-app-3xl', 'text-[var(--app-text-muted)]')}>
          No aging data available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Aging Buckets</h3>
        <div className="flex items-center gap-3">
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
            {totalCount} invoices
          </span>
          <span className={cn('text-[11px] font-bold', 'text-[var(--app-text-secondary)]')}>
            {formatAmount(totalAmount)}
          </span>
        </div>
      </div>

      {/* Buckets */}
      <div className="space-y-3">
        {buckets.map((bucket, index) => {
          const pct = maxAmount > 0 ? (bucket.amount / maxAmount) * 100 : 0;
          const amountPct = totalAmount > 0 ? ((bucket.amount / totalAmount) * 100).toFixed(1) : '0';

          return (
            <motion.div
              key={bucket.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn('w-2 h-2 rounded-[var(--app-radius-sm)] shrink-0', bucket.color)}
                  />
                  <span className={cn('text-[11px] font-medium truncate', 'text-[var(--app-text-secondary)]')}>
                    {bucket.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    {bucket.count} inv
                  </span>
                  <span className={cn('text-[11px] font-bold tabular-nums', 'text-[var(--app-text)]')}>
                    {formatAmount(bucket.amount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={cn('flex-1 h-2.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    className={cn('h-full rounded-full', bucket.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                  />
                </div>
                <span className={cn('text-[10px] w-10 text-right tabular-nums shrink-0', 'text-[var(--app-text-muted)]')}>
                  {amountPct}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
