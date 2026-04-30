'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Heart, RefreshCw, DollarSign, Star, AlertTriangle, Calendar,
  BarChart3, TrendingUp, TrendingDown, Award, Crown, Users,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { retentionAnalyticsData } from './data/mock-data';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const tierConfig: Record<string, { icon: React.ElementType; color: string; darkColor: string; bg: string; darkBg: string }> = {
  Platinum: { icon: Crown, color: 'text-violet-600', darkColor: 'text-violet-300', bg: 'bg-violet-50', darkBg: 'bg-violet-500/10' },
  Gold: { icon: Award, color: 'text-amber-600', darkColor: 'text-amber-300', bg: 'bg-amber-50', darkBg: 'bg-amber-500/10' },
  Silver: { icon: Star, color: 'text-zinc-500', darkColor: 'text-zinc-300', bg: 'bg-zinc-100', darkBg: 'bg-zinc-500/10' },
  Standard: { icon: Users, color: 'text-emerald-600', darkColor: 'text-emerald-300', bg: 'bg-emerald-50', darkBg: 'bg-emerald-500/10' },
};

export default function RetentionAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = retentionAnalyticsData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', '6-months', '1-year', 'all-time'];

  // Derived KPIs
  const avgChurn = (data.churnCohorts.reduce((s, c) => s + c.churnRate, 0) / data.churnCohorts.length).toFixed(1);
  const totalRenewed = data.renewalTrend.reduce((s, r) => s + r.renewed, 0);
  const totalLost = data.renewalTrend.reduce((s, r) => s + r.lost, 0);
  const renewalRate = ((totalRenewed / (totalRenewed + totalLost)) * 100).toFixed(1);
  const avgLTV = Math.round(
    data.ltvBySource.reduce((s, l) => s + l.ltv, 0) / data.ltvBySource.length,
  );
  const latestNPS = data.npsTrend[data.npsTrend.length - 1].score;

  const maxChurnRate = Math.max(...data.churnCohorts.map((c) => c.churnRate));
  const maxRenewed = Math.max(...data.renewalTrend.map((r) => r.renewed + r.lost));
  const maxLTV = Math.max(...data.ltvBySource.map((l) => l.ltv));
  const maxWinback = Math.max(...data.winbackSuccess.map((w) => w.attempted));
  const maxNPSScore = 100;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Heart className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Retention Analytics</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Churn cohorts, renewals, loyalty &amp; NPS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f === '6-months' ? '6 Months' : f === '1-year' ? '1 Year' : f === 'all-time' ? 'All Time' : 'All'}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
            <span className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-xl',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
              {today}
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            label="Churn Rate"
            value={`${avgChurn}%`}
            change={-0.8}
            changeLabel="avg monthly churn"
            icon={AlertTriangle}
            severity="warning"
          />
          <KPICard
            label="Renewal Rate"
            value={`${renewalRate}%`}
            change={3.2}
            changeLabel="renewal success"
            icon={RefreshCw}
          />
          <KPICard
            label="Avg LTV"
            value={formatINR(avgLTV)}
            change={6.5}
            changeLabel="customer lifetime value"
            icon={DollarSign}
          />
          <KPICard
            label="NPS Score"
            value={`${latestNPS}`}
            change={4.2}
            changeLabel="net promoter score"
            icon={Star}
          />
        </motion.div>

        {/* Row: Churn Cohorts + Renewal Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Churn Cohorts */}
          <ChartCard title="Churn Cohorts" subtitle="Monthly churn rate by cohort">
            <div className="space-y-4 pt-2">
              {data.churnCohorts.map((cohort, i) => (
                <motion.div
                  key={cohort.month}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{cohort.month}</span>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {cohort.churned} of {cohort.total}
                      </span>
                      <span className={cn(
                        'text-sm font-semibold',
                        cohort.churnRate >= 5 ? 'text-red-500' : 'text-amber-500',
                      )}>
                        {cohort.churnRate}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('w-full h-3 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cohort.churnRate / maxChurnRate) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        cohort.churnRate >= 5
                          ? (isDark ? 'bg-red-500/50' : 'bg-red-400')
                          : (isDark ? 'bg-amber-500/50' : 'bg-amber-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Renewal Trend */}
          <ChartCard title="Renewal Trend" subtitle="Renewed vs lost contracts monthly">
            <div className="flex items-center gap-4 mb-3">
              {[
                { color: 'bg-[var(--app-success)]', label: 'Renewed' },
                { color: isDark ? 'bg-red-500/50' : 'bg-red-400', label: 'Lost' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-2 h-32">
              {data.renewalTrend.map((entry, i) => (
                <div key={entry.month} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                  {/* Revenue label */}
                  <span className={cn('text-[8px] font-medium', 'text-[var(--app-text-muted)]')}>
                    {formatINR(entry.revenue)}
                  </span>
                  <div className="flex gap-0.5 w-full items-end h-full justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.lost / maxRenewed) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm', isDark ? 'bg-red-500/40' : 'bg-red-300')}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.renewed / maxRenewed) * 100}%` }}
                      transition={{ delay: 0.32 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                    />
                  </div>
                  <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-disabled)]')}>
                    {entry.month.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Loyalty Usage Tier Cards */}
        <ChartCard title="Loyalty Tier Analysis" subtitle="Client distribution & spend by tier">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {data.loyaltyUsage.map((tier, i) => {
              const config = tierConfig[tier.tier] || tierConfig.Standard;
              const TierIcon = config.icon;
              return (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  className={cn(
                    'rounded-xl border p-4 transition-colors',
                    isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                      : 'bg-black/[0.01] border-black/[0.06] hover:bg-black/[0.03]',
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center mb-3',
                    isDark ? config.darkBg : config.bg,
                  )}>
                    <TierIcon className={cn('w-4 h-4', isDark ? config.darkColor : config.color)} />
                  </div>
                  <p className="text-sm font-semibold mb-2">{tier.tier}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                        Clients
                      </span>
                      <span className="text-sm font-semibold">{tier.clients}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                        Avg Spend
                      </span>
                      <span className="text-sm font-medium">{formatINR(tier.avgSpend)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                        Retention
                      </span>
                      <span className={cn(
                        'text-sm font-semibold',
                        tier.retention >= 95 ? 'text-emerald-500'
                          : tier.retention >= 85 ? 'text-blue-500'
                            : 'text-amber-500',
                      )}>
                        {tier.retention}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full mt-2', 'bg-[var(--app-hover-bg)]')}>
                    <div
                      className={cn('h-full rounded-full', 'bg-[var(--app-hover-bg)]')}
                      style={{ width: `${tier.retention}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>

        {/* Row: LTV by Source + NPS Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LTV by Source */}
          <ChartCard title="LTV by Source" subtitle="Lifetime value & CAC ratio by lead source">
            <div className="space-y-4 pt-2">
              {data.ltvBySource.map((src, i) => (
                <motion.div
                  key={src.source}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {src.ratio}x ratio
                      </span>
                      <span className="text-sm font-semibold">{formatINR(src.ltv)}</span>
                    </div>
                  </div>
                  <div className={cn('w-full h-2.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(src.ltv / maxLTV) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-violet-500/50' : 'bg-violet-400')}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* NPS Trend */}
          <ChartCard title="NPS Trend" subtitle="Net Promoter Score over time">
            <div className="flex items-center justify-between h-40 pt-2">
              <div className="flex items-end gap-6 h-full pb-6">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between h-full">
                  {[100, 75, 50, 25, 0].map((val) => (
                    <span
                      key={val}
                      className={cn('text-[9px] w-6 text-right', 'text-[var(--app-text-disabled)]')}
                    >
                      {val}
                    </span>
                  ))}
                </div>

                {/* Dots line */}
                <div className="flex items-end gap-4 h-full pb-1">
                  {data.npsTrend.map((entry, i) => (
                    <motion.div
                      key={entry.month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-semibold">{entry.score}</span>
                      <div className="relative" style={{ height: `${(entry.score / maxNPSScore) * 100}%` }}>
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          entry.score >= 72 ? (isDark ? 'bg-emerald-400' : 'bg-emerald-500')
                            : entry.score >= 68 ? (isDark ? 'bg-amber-400' : 'bg-amber-500')
                              : (isDark ? 'bg-red-400' : 'bg-red-500'),
                        )} />
                        {i < data.npsTrend.length - 1 && (
                          <div
                            className={cn(
                              'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-0.5',
                              'bg-[var(--app-hover-bg)]',
                            )}
                          />
                        )}
                      </div>
                      <span className={cn('text-[8px]', 'text-[var(--app-text-disabled)]')}>
                        {entry.month.slice(0, 3)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Win-back Success */}
        <ChartCard title="Win-back Success" subtitle="Attempted vs won back per month">
          <div className="flex items-center gap-4 mb-3">
            {[
              { color: 'bg-[var(--app-info)]', label: 'Attempted' },
              { color: 'bg-[var(--app-success)]', label: 'Won Back' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-3 h-32">
            {data.winbackSuccess.map((entry, i) => (
              <div key={entry.month} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                <div className="flex items-baseline gap-0.5">
                  <span className={cn('text-[8px]', 'text-[var(--app-text-muted)]')}>
                    {formatINR(entry.revenue)}
                  </span>
                </div>
                <div className="flex gap-0.5 w-full items-end h-full justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.attempted / maxWinback) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', isDark ? 'bg-blue-500/40' : 'bg-blue-300')}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.won / maxWinback) * 100}%` }}
                    transition={{ delay: 0.32 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                  />
                </div>
                <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-disabled)]')}>
                  {entry.month.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
