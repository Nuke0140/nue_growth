'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {} from '../types';

// ─── Type Configuration ───────────────────────────────────
const typeConfig = {
  revenue: {
    primaryColor: 'text-emerald-500',
    barColor: 'bg-emerald-500',
    barBgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
    changePositive: 'text-emerald-500',
    changeNegative: 'text-red-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    headerGradient: 'from-emerald-50 dark:from-emerald-500/10 to-transparent',
  },
  expense: {
    primaryColor: 'text-red-500',
    barColor: 'bg-red-500',
    barBgColor: 'bg-red-100 dark:bg-red-500/10',
    changePositive: 'text-emerald-500',
    changeNegative: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-500/15',
    headerGradient: 'from-red-50 dark:from-red-500/10 to-transparent',
  },
  profit: {
    primaryColor: 'text-blue-500',
    barColor: 'bg-blue-500',
    barBgColor: 'bg-blue-100 dark:bg-blue-500/10',
    changePositive: 'text-emerald-500',
    changeNegative: 'text-red-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    headerGradient: 'from-blue-50 dark:from-blue-500/10 to-transparent',
  },
};

type ForecastType = 'revenue' | 'expense' | 'profit';

// ─── Helpers ──────────────────────────────────────────────
function formatCurrency(value: number) {
  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (Math.abs(value) >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

// ─── Component ────────────────────────────────────────────
interface ForecastWidgetProps {
  title: string;
  data: { label: string; value: number; change: number }[];
  type?: ForecastType;
}

export default function ForecastWidget({ title, data, type = 'revenue' }: ForecastWidgetProps) {
  const config = typeConfig[type];

  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const avgChange = data.length > 0 ? data.reduce((sum, d) => sum + d.change, 0) / data.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] overflow-hidden',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header with gradient */}
      <div className={cn(
        'p-app-xl pb-4 bg-gradient-to-r',
        config.headerGradient
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              config.iconBg
            )}>
              {type === 'revenue' ? (
                <TrendingUp className={cn('w-4 h-4', config.primaryColor)} />
              ) : type === 'expense' ? (
                <TrendingDown className={cn('w-4 h-4', config.primaryColor)} />
              ) : (
                <BarChart3 className={cn('w-4 h-4', config.primaryColor)} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-[10px] text-[var(--app-text-disabled)]">
                Forecast Overview
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={cn('text-lg font-bold', config.primaryColor)}>
              {formatCurrency(totalValue)}
            </p>
            <div className="flex items-center justify-end gap-0.5">
              {avgChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={cn('text-[10px] font-medium', avgChange >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}% avg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Bar Chart + Data Rows */}
      <div className="px-app-xl pb-5 pt-2">
        {/* Visual Bars */}
        <div className="space-y-2 mb-4">
          {data.map((item, index) => {
            const barWidth = Math.max((Math.abs(item.value) / maxValue) * 100, 2);

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className={cn('h-6 rounded-[var(--app-radius-lg)] overflow-hidden relative', config.barBgColor)}>
                  <motion.div
                    className={cn('h-full rounded-[var(--app-radius-lg)]', config.barColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Data Rows */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-[var(--app-radius-sm)]', config.barColor)} />
                <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[var(--app-text)]">
                  {formatCurrency(item.value)}
                </span>
                <div className={cn(
                  'flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium min-w-[48px] justify-end',
                  item.change >= 0
                    ? cn('bg-emerald-500/10 text-emerald-500')
                    : cn('bg-red-500/10 text-red-500')
                )}>
                  {item.change >= 0 ? (
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5" />
                  )}
                  {Math.abs(item.change).toFixed(1)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
