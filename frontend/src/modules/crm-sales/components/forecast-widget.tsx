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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-2xl p-6 overflow-hidden transition-all duration-200',
        isDark
          ? 'bg-white/[0.03] border border-white/[0.06]'
          : 'bg-white border border-black/[0.06] shadow-sm'
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
              'w-8 h-8 rounded-lg flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
            )}>
              <Icon className={cn('w-4 h-4', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
          )}
          <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
            {label}
          </span>
        </div>

        {/* Value */}
        <div className="flex items-end gap-2">
          <span className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
            {formatCurrency(value)}
          </span>
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={cn(
                'flex items-center gap-0.5 text-xs font-semibold mb-0.5',
                isPositive && (isDark ? 'text-emerald-400' : 'text-emerald-600'),
                isNegative && (isDark ? 'text-red-400' : 'text-red-600'),
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositive ? '+' : ''}{change}%
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
