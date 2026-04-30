'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Target, TrendingUp, TrendingDown, Award, BarChart3 } from 'lucide-react';
import { benchmarkData } from './data/mock-data';

const COMPARISON_TABS = ['MoM', 'Rep vs Rep', 'Dept vs Target', 'Client vs Industry', 'Branch vs Branch'] as const;

function formatValue(val: number, unit: string): string {
  if (unit === '₹') {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toFixed(0)}`;
  }
  if (unit === '%' || unit === 'x' || unit === 'score') {
    return val.toFixed(1);
  }
  if (unit === 'days') {
    return val.toFixed(0);
  }
  return val.toString();
}

function getPercentileColor(percentile: number): string {
  if (percentile < 25) return 'text-red-400';
  if (percentile < 50) return 'text-orange-400';
  if (percentile < 75) return 'text-yellow-400';
  return 'text-emerald-400';
}

function getPercentileBg(percentile: number, isDark: boolean): string {
  if (percentile < 25) return 'bg-[var(--app-danger-bg)]';
  if (percentile < 50) return isDark ? 'bg-orange-500/15' : 'bg-orange-50';
  if (percentile < 75) return isDark ? 'bg-yellow-500/15' : 'bg-yellow-50';
  return 'bg-[var(--app-success-bg)]';
}

function getPercentileTextBg(percentile: number, isDark: boolean): string {
  if (percentile < 25) return 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]';
  if (percentile < 50) return isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600';
  if (percentile < 75) return isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-600';
  return 'bg-[var(--app-success-bg)] text-[var(--app-success)]';
}

export default function BenchmarkComparisonPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedTab, setSelectedTab] = useState(0);

  const summary = useMemo(() => {
    const aboveTarget = benchmarkData.filter((d) => d.current >= d.target).length;
    const belowTarget = benchmarkData.filter((d) => d.current < d.target).length;
    const avgPercentile = benchmarkData.reduce((s, d) => s + d.percentile, 0) / benchmarkData.length;
    return { aboveTarget, belowTarget, avgPercentile };
  }, []);

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            Benchmark Comparison
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
            Performance vs targets
          </p>
        </div>

        {/* Comparison Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {COMPARISON_TABS.map((tab, i) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              onClick={() => setSelectedTab(i)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                i === selectedTab
                  ? 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                  : isDark
                    ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
                    : 'bg-black/[0.03] border border-black/[0.06] text-zinc-600 hover:bg-black/[0.06]',
              )}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Metrics Above Target', value: summary.aboveTarget, total: benchmarkData.length, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Metrics Below Target', value: summary.belowTarget, total: benchmarkData.length, icon: TrendingDown, color: 'text-red-400' },
            { label: 'Average Percentile', value: summary.avgPercentile.toFixed(0), total: 100, icon: Award, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                    <span className={cn('text-sm font-normal ml-1', 'text-[var(--app-text-muted)]')}>
                      / {stat.total}
                    </span>
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metric Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarkData.map((item, i) => {
            const isPositive = item.delta >= 0;
            const isAboveTarget = item.current >= item.target;
            const progressRatio = Math.min((item.current / item.target) * 100, 100);

            return (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                whileHover={{ y: -2 }}
                className={cn(card, 'space-y-3')}
              >
                {/* Metric Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', 'bg-[var(--app-hover-bg)]')}>
                      <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    </div>
                    <div>
                      <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                        {item.metric}
                      </h3>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        Unit: {item.unit}
                      </p>
                    </div>
                  </div>

                  {/* Percentile Badge */}
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', getPercentileTextBg(item.percentile, isDark))}>
                    P{item.percentile}
                  </span>
                </div>

                {/* Values Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className={cn('rounded-lg border p-2', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Current</p>
                    <p className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                      {formatValue(item.current, item.unit)}
                    </p>
                  </div>
                  <div className={cn('rounded-lg border p-2', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Previous</p>
                    <p className={cn('text-xs font-bold', 'text-[var(--app-text-secondary)]')}>
                      {formatValue(item.previous, item.unit)}
                    </p>
                  </div>
                  <div className={cn('rounded-lg border p-2', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Target</p>
                    <p className={cn('text-xs font-bold', 'text-[var(--app-text-secondary)]')}>
                      {formatValue(item.target, item.unit)}
                    </p>
                  </div>
                </div>

                {/* Delta Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                      isPositive
                        ? 'bg-[var(--app-success-bg)] text-[var(--app-success)]'
                        : 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
                    )}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.delta >= 0 ? '+' : ''}{formatValue(item.delta, item.unit)}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold',
                      isDark ? 'bg-white/[0.06] text-zinc-300' : 'bg-black/[0.04] text-zinc-600',
                    )}
                  >
                    {item.deltaPercent >= 0 ? '+' : ''}{item.deltaPercent}% change
                  </span>
                </div>

                {/* Target Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                      Target Progress
                    </span>
                    <span className={cn('text-[10px] font-semibold', isAboveTarget ? 'text-emerald-400' : 'text-amber-400')}>
                      {progressRatio.toFixed(0)}%
                    </span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressRatio}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.5 }}
                      className={cn(
                        'h-full rounded-full',
                        isAboveTarget ? 'bg-emerald-500' : 'bg-amber-500',
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
