'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, TrendingUp, TrendingDown, BarChart3, DollarSign, Target,
  ChevronRight, ArrowUpRight, ArrowDownRight, Repeat, Zap, RefreshCw,
  IndianRupee, Users, Layers, Filter, PieChart, Activity
} from 'lucide-react';
import {
  revenueMonthly, revenueByClient, revenueByService
} from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { RevenueEntry, RevenueByClient, RevenueByService } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const months = ['O', 'N', 'D', 'J', 'F', 'M', 'A'];

type DateRange = '7d' | '30d' | '90d' | 'ytd' | '1y';

const dateRanges: { label: string; value: DateRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'YTD', value: 'ytd' },
  { label: '1Y', value: '1y' },
];

export default function RevenuePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useFinanceStore((s) => s.navigateTo);

  const [selectedRange, setSelectedRange] = useState<DateRange>('ytd');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const latest = revenueMonthly[revenueMonthly.length - 1];
  const totalRevenue = revenueMonthly.reduce((s: number, r: RevenueEntry) => s + r.revenue, 0);

  const kpiStats = useMemo(() => [
    { label: 'MRR', value: formatINR(latest.mrr), icon: Repeat, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 5.7, changeLabel: 'month-over-month' },
    { label: 'ARR', value: formatINR(latest.arr), icon: TrendingUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 5.7, changeLabel: 'annualized revenue' },
    { label: 'Retainer Revenue', value: formatINR(latest.retainer), icon: RefreshCw, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: 6.1, changeLabel: 'recurring retainer' },
    { label: 'Upsell Revenue', value: formatINR(latest.upsell), icon: Zap, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 15.5, changeLabel: 'upsell this month' },
    { label: 'Renewal Revenue', value: formatINR(latest.renewal), icon: ArrowUpRight, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: 14.9, changeLabel: 'contracts renewed' },
    { label: 'One-time Revenue', value: formatINR(latest.oneTime), icon: DollarSign, color: 'text-pink-400', bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', change: 0, changeLabel: 'project-based' },
    { label: 'Total Revenue', value: formatINR(latest.revenue), icon: BarChart3, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 8.3, changeLabel: 'this month' },
  ], [isDark, latest]);

  const topClients = useMemo(() =>
    [...revenueByClient].sort((a: RevenueByClient, b: RevenueByClient) => b.revenue - a.revenue).slice(0, 8),
    []
  );

  const maxServiceRevenue = Math.max(...revenueByService.map((s: RevenueByService) => s.revenue));

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}>
              <BarChart3 className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Revenue Intelligence</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Total Revenue: {formatINR(totalRevenue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-1 rounded-xl border p-1',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.06]'
            )}>
              {dateRanges.map((dr) => (
                <button
                  key={dr.value}
                  onClick={() => setSelectedRange(dr.value)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors',
                    selectedRange === dr.value
                      ? (isDark ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80')
                      : (isDark ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50')
                  )}
                >
                  {dr.label}
                </button>
              ))}
            </div>
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 cursor-pointer transition-all duration-200',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    {stat.label}
                  </span>
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  {stat.change !== 0 && (
                    <span className={cn(
                      'flex items-center gap-0.5 text-[10px] font-medium',
                      isPositive ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
                <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
                  {stat.changeLabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Trend Chart — Target vs Actual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Monthly Revenue — Target vs Actual
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')} />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-white/20' : 'bg-black/15')} />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Target</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {revenueMonthly.map((entry: RevenueEntry, j) => {
              const maxVal = Math.max(...revenueMonthly.map((r: RevenueEntry) => r.target), ...revenueMonthly.map((r: RevenueEntry) => r.revenue));
              const achieved = entry.revenue >= entry.target;
              return (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', achieved ? 'text-emerald-500' : 'text-red-500')}>
                    {formatINR(entry.revenue)}
                  </span>
                  <div className="flex gap-0.5 w-full items-end h-full justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.target / maxVal) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm max-w-[40%]', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.revenue / maxVal) * 100}%` }}
                      transition={{ delay: 0.45 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm max-w-[40%]', achieved ? (isDark ? 'bg-emerald-500/40' : 'bg-emerald-400') : (isDark ? 'bg-red-500/40' : 'bg-red-400'))}
                    />
                  </div>
                  <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{months[j]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue by Client Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Revenue by Client
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  {['Client', 'Revenue', 'MRR', 'Growth', 'Services'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', isDark ? 'text-white/40' : 'text-black/40')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClients.map((client: RevenueByClient, i) => (
                  <motion.tr
                    key={client.client}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    className={cn(
                      'border-b cursor-pointer transition-colors',
                      isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                    )}
                  >
                    <td className="py-3 px-3">
                      <p className="text-sm font-medium">{client.client}</p>
                    </td>
                    <td className="py-3 px-3 text-sm font-semibold">{formatINR(client.revenue)}</td>
                    <td className="py-3 px-3 text-sm">{formatINR(client.mrr)}</td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        'flex items-center gap-0.5 text-sm font-semibold',
                        client.growth > 0 ? 'text-emerald-500' : 'text-red-500'
                      )}>
                        {client.growth > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {Math.abs(client.growth)}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {client.services.map(svc => (
                          <Badge key={svc} variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                            {svc}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Revenue by Service — Horizontal Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Revenue by Service
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {revenueByService.map((svc: RevenueByService, i) => (
              <motion.div
                key={svc.service}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.05, duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{svc.service}</span>
                    <Badge variant="secondary" className={cn(
                      'text-[9px] px-1.5 py-0',
                      svc.growth > 0 ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                        : (isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600')
                    )}>
                      {svc.growth > 0 ? '+' : ''}{svc.growth}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{svc.projects} projects</span>
                    <span className="text-sm font-semibold">{formatINR(svc.revenue)}</span>
                  </div>
                </div>
                <div className={cn('w-full h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(svc.revenue / maxServiceRevenue) * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                    className={cn('h-full rounded-full', isDark ? 'bg-emerald-500/40' : 'bg-emerald-400')}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
