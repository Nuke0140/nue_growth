'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
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

function getMarginColor(value: number, isDark: boolean) {
  if (value > 30) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (value >= 15) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
}

function getMarginBarColor(value: number) {
  if (value > 30) return 'bg-emerald-500';
  if (value >= 15) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMarginBarBgColor(value: number, isDark: boolean) {
  if (value > 30) return isDark ? 'bg-emerald-500/10' : 'bg-emerald-100';
  if (value >= 15) return isDark ? 'bg-amber-500/10' : 'bg-amber-100';
  return isDark ? 'bg-red-500/10' : 'bg-red-100';
}

// ─── Component ────────────────────────────────────────────
interface ProfitabilityWidgetProps {
  data: ProfitabilityData[];
}

export default function ProfitabilityWidget({ data }: ProfitabilityWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/60' : 'text-black/60')} />
          <h3 className="text-sm font-semibold">Profitability Overview</h3>
        </div>
        {summary.totalAlerts > 0 && (
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium',
            isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'
          )}>
            <AlertTriangle className="w-3 h-3" />
            {summary.totalAlerts} alert{summary.totalAlerts > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className={cn('p-3 rounded-xl', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
          <p className={cn('text-[10px] font-medium mb-1', isDark ? 'text-white/40' : 'text-black/40')}>
            Total Revenue
          </p>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            <p className="text-sm font-bold text-emerald-500">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
          <p className={cn('text-[10px] font-medium mb-1', isDark ? 'text-white/40' : 'text-black/40')}>
            Total Cost
          </p>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-red-500" />
            <p className="text-sm font-bold text-red-500">
              {formatCurrency(summary.totalCost)}
            </p>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
          <p className={cn('text-[10px] font-medium mb-1', isDark ? 'text-white/40' : 'text-black/40')}>
            Net Margin
          </p>
          <div className="flex items-center gap-1">
            {summary.netMargin >= 0 ? (
              <TrendingUp className="w-3 h-3" style={{ color: isDark ? 'rgba(52,211,153,1)' : 'rgba(16,185,129,1)' }} />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <p className={cn('text-sm font-bold', getMarginColor(summary.netMargin, isDark))}>
              {summary.netMargin > 0 ? '+' : ''}{summary.netMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Client Profitability Bars */}
      <div className="space-y-3">
        <p className={cn('text-[11px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
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
                <span className={cn('text-[11px] font-medium truncate', isDark ? 'text-white/60' : 'text-black/60')}>
                  {client.clientName}
                </span>
                {client.alerts.length > 0 && (
                  <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                )}
              </div>
              <span className={cn('text-[11px] font-bold shrink-0 ml-2', getMarginColor(client.margin, isDark))}>
                {client.margin > 0 ? '+' : ''}{client.margin.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn('flex-1 h-2 rounded-full overflow-hidden', getMarginBarBgColor(client.margin, isDark))}>
                <motion.div
                  className={cn('h-full rounded-full', getMarginBarColor(client.margin))}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(client.revenue / maxRevenue) * 100, 100)}%` }}
                  transition={{ duration: 0.6, delay: index * 0.04, ease: 'easeOut' }}
                />
              </div>
              <span className={cn('text-[10px] shrink-0 w-16 text-right', isDark ? 'text-white/30' : 'text-black/30')}>
                {formatCurrency(client.revenue)}
              </span>
            </div>
            {/* Burn rate indicator */}
            {client.burnRate > 0 && (
              <div className="flex items-center justify-between mt-0.5">
                <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>
                  Burn: {formatCurrency(client.burnRate)}/mo
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className={cn('flex flex-col items-center justify-center py-8', isDark ? 'text-white/20' : 'text-black/20')}>
          <BarChart3 className="w-8 h-8 mb-2" />
          <p className="text-xs">No profitability data</p>
        </div>
      )}
    </motion.div>
  );
}
