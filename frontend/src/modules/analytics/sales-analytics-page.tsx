'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Target, Clock, TrendingUp, Briefcase, Award, AlertTriangle,
  Filter, Calendar, BarChart3, Trophy, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { salesAnalyticsData } from './data/mock-data';

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
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const badgeColors = [
  { bg: 'bg-amber-500', text: 'text-white', label: '1st' },
  { bg: 'bg-zinc-400', text: 'text-white', label: '2nd' },
  { bg: 'bg-amber-700', text: 'text-white', label: '3rd' },
];

const lostReasonColors = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280',
];

export default function SalesAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = salesAnalyticsData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'this-month', 'quarter', 'year'];

  const totalDeals = data.repLeaderboard.reduce((s, r) => s + r.deals, 0);
  const maxDealAging = Math.max(...data.dealAging.map((d) => d.value));
  const maxSourceDays = Math.max(...data.sourceToClose.map((s) => s.avgDays));

  const conicSegments = data.lostReasons.reduce<string[]>((acc, reason, i) => {
    const prevEnd = acc.length > 0
      ? data.lostReasons.slice(0, i).reduce((s, r) => s + r.percentage, 0)
      : 0;
    acc.push(`${lostReasonColors[i % lostReasonColors.length]} ${prevEnd}% ${prevEnd + reason.percentage}%`);
    return acc;
  }, []);

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
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
            )}>
              <BarChart3 className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Sales Analytics</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Pipeline performance &amp; rep leaderboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f === 'all' ? 'All' : f === 'this-month' ? 'This Month' : f === 'quarter' ? 'Quarter' : 'Year'}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
            <span className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-xl',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50',
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
            label="Win Rate"
            value={`${data.winRate}%`}
            change={2.1}
            changeLabel="vs last month"
            icon={Target}
            severity="normal"
          />
          <KPICard
            label="Avg Sales Cycle"
            value={`${data.avgSalesCycle} days`}
            change={-3.2}
            changeLabel="days faster"
            icon={Clock}
            severity="normal"
          />
          <KPICard
            label="Forecast Accuracy"
            value={`${data.forecastAccuracy}%`}
            change={4.6}
            changeLabel="vs last quarter"
            icon={TrendingUp}
            severity="normal"
          />
          <KPICard
            label="Total Deals"
            value={`${totalDeals}`}
            change={8.5}
            changeLabel="vs last month"
            icon={Briefcase}
            severity="normal"
          />
        </motion.div>

        {/* Row: Deal Aging + Stage Drop-off */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Deal Aging Bar Chart */}
          <ChartCard title="Deal Aging" subtitle="Active deals by age bucket">
            <div className="space-y-4 pt-2">
              {data.dealAging.map((bucket, i) => (
                <motion.div
                  key={bucket.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{bucket.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {bucket.count} deals
                      </span>
                      <span className="text-sm font-semibold">{bucket.value}%</span>
                    </div>
                  </div>
                  <div className={cn('w-full h-3 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(bucket.value / maxDealAging) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        i === 0 ? (isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')
                          : i === 1 ? (isDark ? 'bg-blue-500/50' : 'bg-blue-400')
                            : i === 2 ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400')
                              : (isDark ? 'bg-red-500/50' : 'bg-red-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Stage Drop-off Funnel */}
          <ChartCard title="Stage Drop-off Funnel" subtitle="Conversion through pipeline stages">
            <div className="flex flex-col items-center gap-2 pt-2">
              {data.stageDropOff.map((stage, i) => {
                const widthPct = 100 - i * 22;
                return (
                  <div key={stage.stage} className="w-full flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      {stage.dropRate > 0 && (
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium',
                          isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
                        )}>
                          -{stage.dropRate}%
                        </span>
                      )}
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-12 rounded-xl flex items-center justify-center',
                        isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
                      )}
                      style={{ maxWidth: '100%' }}
                    >
                      <div className="text-center">
                        <p className={cn('text-lg font-bold', isDark ? 'text-white/80' : 'text-black/80')}>
                          {stage.dealCount}
                        </p>
                        <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                          deals
                        </p>
                      </div>
                    </motion.div>
                    {i < data.stageDropOff.length - 1 && (
                      <ChevronRight className={cn(
                        'w-4 h-4 my-0.5 rotate-90',
                        isDark ? 'text-white/20' : 'text-black/20',
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Rep Leaderboard Table */}
        <ChartCard title="Rep Leaderboard" subtitle="Top performers by revenue" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  {['Rank', 'Rep Name', 'Deals', 'Revenue', 'Win Rate'].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        'text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3',
                        isDark ? 'text-white/40' : 'text-black/40',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.repLeaderboard.map((rep, i) => (
                  <motion.tr
                    key={rep.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={cn(
                      'border-b transition-colors',
                      isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]',
                    )}
                  >
                    <td className="py-3 px-3">
                      {i < 3 ? (
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white',
                          badgeColors[i].bg,
                        )}>
                          {badgeColors[i].label}
                        </span>
                      ) : (
                        <span className={cn(
                          'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium',
                          isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
                        )}>
                          {i + 1}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                          isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60',
                        )}>
                          {rep.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{rep.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium">{rep.deals}</td>
                    <td className="py-3 px-3 text-sm font-semibold">{formatINR(rep.revenue)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-16 h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <div
                            className={cn('h-full rounded-full', isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')}
                            style={{ width: `${rep.winRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{rep.winRate}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Row: Source to Close + Lost Reasons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Source to Close */}
          <ChartCard title="Source to Close" subtitle="Average days to close by lead source">
            <div className="space-y-4 pt-2">
              {data.sourceToClose.map((src, i) => (
                <motion.div
                  key={src.source}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {src.convRate}% conv
                      </span>
                      <span className="text-sm font-semibold">{src.avgDays}d</span>
                    </div>
                  </div>
                  <div className={cn('w-full h-2.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(src.avgDays / maxSourceDays) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-blue-500/50' : 'bg-blue-400')}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Lost Reasons Pie Chart */}
          <ChartCard title="Lost Reasons" subtitle="Why deals are being lost">
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              {/* Conic gradient pie */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative w-40 h-40 rounded-full shrink-0"
                style={{
                  background: `conic-gradient(${conicSegments.join(', ')})`,
                }}
              >
                <div className={cn(
                  'absolute inset-4 rounded-full flex items-center justify-center',
                  isDark ? 'bg-zinc-900' : 'bg-white',
                )}>
                  <div className="text-center">
                    <p className="text-lg font-bold">{data.lostReasons.reduce((s, r) => s + r.count, 0)}</p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>total lost</p>
                  </div>
                </div>
              </motion.div>

              {/* Legend */}
              <div className="flex-1 space-y-2 w-full">
                {data.lostReasons.map((reason, i) => (
                  <motion.div
                    key={reason.reason}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: lostReasonColors[i % lostReasonColors.length] }}
                      />
                      <span className="text-xs font-medium truncate">{reason.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {reason.count}
                      </span>
                      <span className="text-xs font-semibold">{reason.percentage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
