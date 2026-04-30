'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProfitabilityData } from '../types';

// ─── Helpers ──────────────────────────────────────────────
function formatCurrency(value: number) {
  if (Math.abs(value) >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function getMarginColor(value: number) {
  if (value > 30) return 'text-emerald-500 dark:text-emerald-400';
  if (value >= 15) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function getMarginBarColor(value: number) {
  if (value > 30) return 'bg-emerald-500';
  if (value >= 15) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMarginBarBgColor(value: number) {
  if (value > 30) return 'bg-emerald-100 dark:bg-emerald-500/10';
  if (value >= 15) return 'bg-amber-100 dark:bg-amber-500/10';
  return 'bg-red-100 dark:bg-red-500/10';
}

// ─── Component ────────────────────────────────────────────
interface ProfitabilityWidgetProps {
  data: ProfitabilityData[];
}

export default function ProfitabilityWidget({ data }: ProfitabilityWidgetProps) {
  const summary = useMemo(() => {
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const totalCost = data.reduce((sum, d) => sum + d.cost, 0);
    const netMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    const totalAlerts = data.reduce((sum, d) => sum + d.alerts.length, 0);
    return { totalRevenue, totalCost, netMargin, totalAlerts };
  }, [data]);

  const maxRevenue = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 shadow-sm',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <h3 className="text-sm font-semibold">Profitability Overview</h3>
        </div>
        {summary.totalAlerts > 0 && (
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium',
            'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400'
          )}>
            <AlertTriangle className="w-3 h-3" />
            {summary.totalAlerts} alert{summary.totalAlerts > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-[var(--app-hover-bg)]">
          <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">
            Total Revenue
          </p>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            <p className="text-sm font-bold text-emerald-500">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[var(--app-hover-bg)]">
          <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">
            Total Cost
          </p>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-red-500" />
            <p className="text-sm font-bold text-red-500">
              {formatCurrency(summary.totalCost)}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[var(--app-hover-bg)]">
          <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">
            Net Margin
          </p>
          <div className="flex items-center gap-1">
            {summary.netMargin >= 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <p className={cn('text-sm font-bold', getMarginColor(summary.netMargin))}>
              {summary.netMargin > 0 ? '+' : ''}{summary.netMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Client Profitability Bars */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium text-[var(--app-text-secondary)]">
          Profitability by Client
        </p>
        {data.map((client, index) => (
          <motion.div
            key={client.clientId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[11px] font-medium truncate text-[var(--app-text-secondary)]">
                  {client.clientName}
                </span>
                {client.alerts.length > 0 && (
                  <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                )}
              </div>
              <span className={cn('text-[11px] font-bold shrink-0 ml-2', getMarginColor(client.margin))}>
                {client.margin > 0 ? '+' : ''}{client.margin.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn('flex-1 h-2 rounded-full overflow-hidden', getMarginBarBgColor(client.margin))}>
                <motion.div
                  className={cn('h-full rounded-full', getMarginBarColor(client.margin))}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(client.revenue / maxRevenue) * 100, 100)}%` }}
                  transition={{ duration: 0.6, delay: index * 0.04, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] shrink-0 w-16 text-right text-[var(--app-text-disabled)]">
                {formatCurrency(client.revenue)}
              </span>
            </div>
            {/* Burn rate indicator */}
            {client.burnRate > 0 && (
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[9px] text-[var(--app-text-disabled)]">
                  Burn: {formatCurrency(client.burnRate)}/mo
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-[var(--app-text-disabled)]">
          <BarChart3 className="w-8 h-8 mb-2" />
          <p className="text-xs">No profitability data</p>
        </div>
      )}
    </motion.div>
  );
}
