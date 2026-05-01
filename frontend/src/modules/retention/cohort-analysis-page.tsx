'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Target, ArrowUpRight,
  ArrowDownRight, Calendar, Flame, BrainCircuit, ChevronRight
} from 'lucide-react';
import { cohortData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { CohortRow } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type CohortView = 'monthly' | 'channel' | 'service' | 'campaign';

const viewOptions: { label: string; value: CohortView }[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Channel', value: 'channel' },
  { label: 'Service', value: 'service' },
  { label: 'Campaign', value: 'campaign' },
];

function getHeatColor(pct: number, isDark: boolean): string {
  if (pct >= 90) return isDark ? 'bg-emerald-600/60' : 'bg-emerald-600';
  if (pct >= 80) return isDark ? 'bg-emerald-500/50' : 'bg-emerald-500';
  if (pct >= 70) return isDark ? 'bg-emerald-400/40' : 'bg-emerald-400';
  if (pct >= 60) return isDark ? 'bg-emerald-300/30' : 'bg-emerald-300';
  if (pct >= 50) return isDark ? 'bg-amber-400/30' : 'bg-amber-300';
  if (pct >= 40) return isDark ? 'bg-orange-400/30' : 'bg-orange-300';
  return isDark ? 'bg-red-400/30' : 'bg-red-300';
}

function getTextColor(pct: number, isDark: boolean): string {
  if (pct >= 70) return isDark ? 'text-white' : 'text-white';
  return isDark ? 'text-white/70' : 'text-black/70';
}

export default function CohortAnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [activeView, setActiveView] = useState<CohortView>('monthly');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const maxMonths = 6;
  const monthHeaders = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

  // Aggregate stats
  const stats = useMemo(() => {
    const allRetention: number[] = [];
    const allChurn: number[] = [];
    let totalRevenue = 0;
    cohortData.forEach((c: CohortRow) => {
      c.retention.forEach((r) => { if (r < 100) allRetention.push(r); });
      c.churnRate.forEach((ch) => { if (ch > 0) allChurn.push(ch); });
      c.revenue.forEach((rev) => { totalRevenue += rev; });
    });
    const avgRetention = allRetention.length > 0
      ? allRetention.reduce((a, b) => a + b, 0) / allRetention.length : 0;
    const avgChurn = allChurn.length > 0
      ? allChurn.reduce((a, b) => a + b, 0) / allChurn.length : 0;

    // Best performing cohort (by M2 retention)
    const bestCohort = [...cohortData]
      .sort((a, b) => (b.retention[2] || 0) - (a.retention[2] || 0))[0];
    const worstCohort = [...cohortData]
      .sort((a, b) => (a.retention[2] || 0) - (b.retention[2] || 0))[0];

    return { avgRetention, avgChurn, totalRevenue, bestCohort, worstCohort };
  }, []);

  // KPI cards
  const kpiStats = useMemo(() => [
    { label: 'Avg M+ Retention', value: `${stats.avgRetention.toFixed(1)}%`, icon: Users, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 4.2, changeLabel: 'vs last quarter' },
    { label: 'Avg Churn Rate', value: `${stats.avgChurn.toFixed(1)}%`, icon: Flame, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50', change: -2.1, changeLabel: 'improving' },
    { label: 'Total Cohort Revenue', value: formatINR(stats.totalRevenue), icon: BarChart3, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 12.8, changeLabel: 'cumulative' },
    { label: 'Best Cohort', value: stats.bestCohort?.cohort || '—', icon: TrendingUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: stats.bestCohort?.retention[2] || 0, changeLabel: 'M2 retention' },
    { label: 'Worst Cohort', value: stats.worstCohort?.cohort || '—', icon: TrendingDown, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: stats.worstCohort?.retention[2] || 0, changeLabel: 'M2 retention' },
  ], [isDark, stats]);

  // Repeat purchase rate chart data
  const repeatRateData = useMemo(() =>
    cohortData.map((c: CohortRow) => ({
      cohort: c.cohort.slice(0, 3),
      rate: c.repeatRate[c.repeatRate.length - 1] || 0,
      customers: c.customers,
    })),
    []
  );

  // Churn rate chart data
  const churnData = useMemo(() =>
    cohortData.map((c: CohortRow) => ({
      cohort: c.cohort.slice(0, 3),
      rate: c.churnRate[c.churnRate.length - 1] || 0,
      customers: c.customers,
    })),
    []
  );

  // Revenue per cohort chart data
  const revenuePerCohort = useMemo(() =>
    cohortData.map((c: CohortRow) => ({
      cohort: c.cohort.slice(0, 3),
      totalRev: c.revenue.reduce((s, v) => s + v, 0),
    })),
    []
  );

  const maxRepeat = Math.max(...repeatRateData.map((d) => d.rate), 1);
  const maxChurn = Math.max(...churnData.map((d) => d.rate), 1);
  const maxRev = Math.max(...revenuePerCohort.map((d) => d.totalRev), 1);

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
              <BrainCircuit className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Cohort Analysis</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Founder-Grade Retention Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewOptions.map((opt) => (
              <Button
                key={opt.value}
                variant="ghost"
                size="sm"
                onClick={() => setActiveView(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  activeView === opt.value
                    ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                    : (isDark ? 'text-white/40 hover:bg-white/[0.06]' : 'text-black/40 hover:bg-black/[0.06]')
                )}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 transition-all duration-200',
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
                  {stat.label !== 'Best Cohort' && stat.label !== 'Worst Cohort' && (
                    <span className={cn(
                      'flex items-center gap-0.5 text-[10px] font-medium',
                      stat.label === 'Avg Churn Rate' ? (isPositive ? 'text-red-500' : 'text-emerald-500') : (isPositive ? 'text-emerald-500' : 'text-red-500')
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

        {/* Cohort Heatmap Table */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Monthly Retention Heatmap
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: '90%+', color: isDark ? 'bg-emerald-600/60' : 'bg-emerald-600' },
                { label: '70-89%', color: isDark ? 'bg-emerald-400/40' : 'bg-emerald-400' },
                { label: '50-69%', color: isDark ? 'bg-amber-400/30' : 'bg-amber-300' },
                { label: '<50%', color: isDark ? 'bg-red-400/30' : 'bg-red-300' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-3 h-3 rounded-sm', l.color)} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <th className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-2', isDark ? 'text-white/40' : 'text-black/40')}>
                    Cohort
                  </th>
                  <th className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-2', isDark ? 'text-white/40' : 'text-black/40')}>
                    Clients
                  </th>
                  {monthHeaders.map((h) => (
                    <th key={h} className={cn('text-center text-[11px] font-medium uppercase tracking-wider pb-3 px-1', isDark ? 'text-white/40' : 'text-black/40')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row: CohortRow, rowIdx) => (
                  <tr key={row.cohort} className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                    <td className="py-2 px-2 text-sm font-medium">{row.cohort}</td>
                    <td className="py-2 px-2">
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                        {row.customers}
                      </Badge>
                    </td>
                    {monthHeaders.map((_, colIdx) => {
                      const val = row.retention[colIdx];
                      if (val === undefined) return <td key={colIdx} className="py-2 px-1" />;
                      const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                      const churnVal = row.churnRate[colIdx] || 0;
                      const revVal = row.revenue[colIdx] || 0;
                      return (
                        <td key={colIdx} className="py-2 px-1 relative">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + rowIdx * 0.05 + colIdx * 0.03, duration: 0.3 }}
                            onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={cn(
                              'w-full min-h-[40px] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative',
                              getHeatColor(val, isDark),
                              isHovered && 'ring-2 ring-white/30 scale-105'
                            )}
                          >
                            <span className={cn('text-xs font-semibold', getTextColor(val, isDark))}>
                              {val}%
                            </span>
                            {isHovered && (
                              <div className={cn(
                                'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg text-[11px] whitespace-nowrap pointer-events-none',
                                isDark ? 'bg-neutral-800 border border-white/10 text-white/80' : 'bg-white border border-black/10 text-black/80'
                              )}>
                                <p className="font-semibold">{row.cohort} — {monthHeaders[colIdx]}</p>
                                <p>Retention: {val}%</p>
                                <p>Churn: {churnVal}%</p>
                                <p>Revenue: {formatINR(revVal)}</p>
                                <p>Customers: ~{Math.round(row.customers * val / 100)}</p>
                              </div>
                            )}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Charts Row: Repeat Purchase Rate & Churn Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Repeat Purchase Rate */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                  Repeat Purchase Rate (Latest)
                </span>
              </div>
              <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Per cohort</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {repeatRateData.map((entry, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                    {entry.rate}%
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.rate / maxRepeat) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', isDark ? 'bg-emerald-500/30' : 'bg-emerald-400')}
                  />
                  <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{entry.cohort}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Churn Rate */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                  Churn Rate (Latest Month)
                </span>
              </div>
              <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Per cohort</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {churnData.map((entry, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                    {entry.rate}%
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.rate / maxChurn) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', isDark ? 'bg-red-500/30' : 'bg-red-400')}
                  />
                  <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{entry.cohort}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Revenue Per Cohort Chart */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Cumulative Revenue per Cohort
              </span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
              {formatINR(revenuePerCohort.reduce((s, c) => s + c.totalRev, 0))} total
            </Badge>
          </div>
          <div className="flex items-end gap-2 h-36">
            {revenuePerCohort.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                  {formatINR(entry.totalRev)}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.totalRev / maxRev) * 100}%` }}
                  transition={{ delay: 0.5 + j * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', isDark ? 'bg-violet-500/30' : 'bg-violet-400')}
                />
                <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{entry.cohort}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className={cn('w-4 h-4 text-amber-400')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Key Insights
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Best Performing */}
            <div className={cn(
              'rounded-xl border p-4',
              isDark ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-emerald-500/15' : 'bg-emerald-100')}>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>Best Performing</span>
              </div>
              <p className="text-lg font-bold text-emerald-500">{stats.bestCohort?.cohort}</p>
              <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                M2 Retention: {stats.bestCohort?.retention[2]}% — {stats.bestCohort?.customers} customers
              </p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                Revenue: {formatINR(stats.bestCohort?.revenue.reduce((s, v) => s + v, 0))}
              </p>
            </div>

            {/* Worst Performing */}
            <div className={cn(
              'rounded-xl border p-4',
              isDark ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-red-50 border-red-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-red-500/15' : 'bg-red-100')}>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>Needs Attention</span>
              </div>
              <p className="text-lg font-bold text-red-500">{stats.worstCohort?.cohort}</p>
              <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                M2 Retention: {stats.worstCohort?.retention[2]}% — {stats.worstCohort?.customers} customers
              </p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                Revenue: {formatINR(stats.worstCohort?.revenue.reduce((s, v) => s + v, 0))}
              </p>
            </div>

            {/* Average */}
            <div className={cn(
              'rounded-xl border p-4',
              isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.02] border-black/[0.08]'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
                </div>
                <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>Portfolio Average</span>
              </div>
              <p className="text-lg font-bold">{stats.avgRetention.toFixed(1)}% Retention</p>
              <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                Avg Churn: {stats.avgChurn.toFixed(1)}% per month
              </p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                {cohortData.reduce((s, c) => s + c.customers, 0)} total customers across cohorts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Churn Risk', value: '8 accounts', page: 'churn-risk' as const, icon: Flame, color: 'text-red-400' },
            { label: 'LTV Forecast', value: '5 segments', page: 'ltv-forecast' as const, icon: Target, color: 'text-violet-400' },
            { label: 'AI Growth Coach', value: '8 insights', page: 'ai-growth-coach' as const, icon: BrainCircuit, color: 'text-amber-400' },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', nav.color)} />
                <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', isDark ? 'text-white/15' : 'text-black/15')} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{nav.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
