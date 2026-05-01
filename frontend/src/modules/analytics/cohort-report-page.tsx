'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Users, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import CohortHeatmap from './components/cohort-heatmap';
import { cohortData } from './data/mock-data';

const VIEW_TABS = ['Acquisition Month', 'Source Cohorts', 'Service Cohorts', 'Retention Cohorts', 'Revenue Cohorts'] as const;
const METRIC_TABS = ['Retention %', 'LTV', 'Churn', 'Repeat %'] as const;

type MetricKey = 'retention' | 'ltv' | 'churn' | 'repeatPercent';

const METRIC_MAP: Record<string, MetricKey> = {
  'Retention %': 'retention',
  LTV: 'ltv',
  Churn: 'churn',
  'Repeat %': 'repeatPercent',
};

export default function CohortReportPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedView, setSelectedView] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(0);

  const metricKey = METRIC_MAP[METRIC_TABS[selectedMetric]];

  const heatmapData = useMemo(() => {
    return cohortData.map((cohort) => ({
      cohortLabel: cohort.cohortLabel,
      size: cohort.size,
      periods: cohort.periods.map((p) => ({
        period: p.period,
        retention: p[metricKey] ?? p.retention,
      })),
    }));
  }, [metricKey]);

  // Summary stats
  const allLastPeriodValues = cohortData.map((c) => c.periods[c.periods.length - 1]);
  const avgRetention = (allLastPeriodValues.reduce((s, p) => s + p.retention, 0) / allLastPeriodValues.length).toFixed(1);
  const avgLtv = allLastPeriodValues.reduce((s, p) => s + p.ltv, 0) / allLastPeriodValues.length;

  const bestCohort = cohortData.reduce((a, b) => {
    const aLast = a.periods[a.periods.length - 1].retention;
    const bLast = b.periods[b.periods.length - 1].retention;
    return aLast > bLast ? a : b;
  });
  const worstCohort = cohortData.reduce((a, b) => {
    const aLast = a.periods[a.periods.length - 1].retention;
    const bLast = b.periods[b.periods.length - 1].retention;
    return aLast < bLast ? a : b;
  });

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  const statCard = cn(
    'rounded-2xl border shadow-sm p-4',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
            Cohort Reports
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            Customer cohort analysis
          </p>
        </div>

        {/* View Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {VIEW_TABS.map((tab, i) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              onClick={() => setSelectedView(i)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                i === selectedView
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

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {METRIC_TABS.map((tab, i) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              onClick={() => setSelectedMetric(i)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                i === selectedMetric
                  ? 'bg-purple-500/15 text-purple-600 border border-purple-500/30'
                  : isDark
                    ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:bg-white/[0.08]'
                    : 'bg-black/[0.03] border border-black/[0.06] text-zinc-500 hover:bg-black/[0.06]',
              )}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Cohort Heatmap */}
        <CohortHeatmap
          data={heatmapData}
          title="Customer Retention Cohort"
          metric={metricKey as 'retention' | 'ltv' | 'churn'}
        />

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Avg Retention', value: `${avgRetention}%`, trend: 'up' as const },
            { label: 'Avg LTV', value: `₹${(avgLtv / 1000).toFixed(0)}K`, trend: 'up' as const },
            { label: 'Best Cohort', value: bestCohort.cohortLabel, trend: 'stable' as const },
            { label: 'Worst Cohort', value: worstCohort.cohortLabel, trend: 'down' as const },
          ].map((stat, i) => {
            const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Minus;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={statCard}
              >
                <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                  {stat.label}
                </p>
                <p className={cn('text-lg font-bold mt-1', isDark ? 'text-white' : 'text-zinc-900')}>
                  {stat.value}
                </p>
                <div className={cn('flex items-center gap-1 mt-1', stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-red-500' : 'text-zinc-500')}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="text-[10px] font-medium">vs prior</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cohort Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohortData.map((cohort, i) => {
            const lastPeriod = cohort.periods[cohort.periods.length - 1];
            const firstRetention = cohort.periods[1]?.retention ?? 100;
            const retentionDrop = (100 - firstRetention).toFixed(1);
            return (
              <motion.div
                key={cohort.cohortLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={card}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
                      <Calendar className={cn('w-4 h-4', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
                    </div>
                    <div>
                      <h4 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                        {cohort.cohortLabel}
                      </h4>
                      <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        {cohort.size} customers
                      </p>
                    </div>
                  </div>
                  <span className={cn('text-xs font-bold', isDark ? 'text-zinc-300' : 'text-zinc-700')}>
                    {lastPeriod.retention.toFixed(1)}%
                  </span>
                </div>

                {/* Mini retention bar */}
                <div className="space-y-1.5 mb-3">
                  {cohort.periods.slice(0, 4).map((period) => (
                    <div key={period.period} className="flex items-center gap-2">
                      <span className={cn('text-[10px] w-6 text-right', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                        P{period.period}
                      </span>
                      <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${period.retention}%` }}
                        />
                      </div>
                      <span className={cn('text-[10px] w-10 tabular-nums', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                        {period.retention.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className={cn('grid grid-cols-2 gap-2 pt-3 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>M2 Drop</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-zinc-200' : 'text-zinc-800')}>-{retentionDrop}%</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>LTV (P6)</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-zinc-200' : 'text-zinc-800')}>
                      ₹{(lastPeriod.ltv / 1000).toFixed(0)}K
                    </p>
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
