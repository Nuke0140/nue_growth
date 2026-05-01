'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export default function ForecastWidget({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: number;
  change?: number;
  icon?: React.ElementType;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-[var(--app-radius-xl)] p-6 overflow-hidden transition-colors duration-200',
        isDark
          ? 'bg-white/[0.03] border border-white/[0.06]'
          : 'bg-white border border-black/[0.06] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
      )}
    >
      {/* Subtle gradient background */}
      <div className={cn(
        'absolute inset-0 pointer-events-none',
        isDark
          ? 'bg-gradient-to-br from-white/[0.04] to-transparent'
          : 'bg-gradient-to-br from-black/[0.02] to-transparent'
      )} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {Icon && (
            <div className={cn(
              'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <Icon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            </div>
          )}
          <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
            {label}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-end gap-2">
          <span className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            {formatCurrency(value)}
          </span>
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3}}
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold mb-0.5',
                isPositive && ('text-[var(--app-success)]'),
                isNegative && ('text-[var(--app-danger)]'),
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {isPositive ? '+' : ''}{change}%
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
