'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3, Target,
  ArrowUpRight, ArrowDownRight, BrainCircuit, Sparkles, Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockForecasts, mockTeamPerformance } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const MONTHLY_FORECAST = [
  { month: 'Jan', forecast: 380000, actual: 420000 },
  { month: 'Feb', forecast: 450000, actual: 390000 },
  { month: 'Mar', forecast: 520000, actual: 480000 },
  { month: 'Apr', forecast: 620000, actual: null },
  { month: 'May', forecast: 580000, actual: null },
  { month: 'Jun', forecast: 700000, actual: null },
];
const maxForecast = Math.max(...MONTHLY_FORECAST.flatMap(d => [d.forecast, d.actual || 0]), 1);

const STAGE_TREND = [
  { month: 'Jan', new: 80000, qualified: 120000, discovery: 150000, demo: 100000, proposal: 80000, negotiation: 60000 },
  { month: 'Feb', new: 95000, qualified: 140000, discovery: 160000, demo: 120000, proposal: 90000, negotiation: 75000 },
  { month: 'Mar', new: 110000, qualified: 160000, discovery: 180000, demo: 140000, proposal: 110000, negotiation: 85000 },
  { month: 'Apr', new: 130000, qualified: 180000, discovery: 200000, demo: 150000, proposal: 120000, negotiation: 95000 },
  { month: 'May', new: 120000, qualified: 170000, discovery: 190000, demo: 135000, proposal: 105000, negotiation: 90000 },
];
const maxStageTrend = Math.max(...STAGE_TREND.flatMap(d => [d.new, d.qualified, d.discovery, d.demo, d.proposal, d.negotiation]), 1);

const CONFIDENCE_TREND = [
  { month: 'Jan', confidence: 62 },
  { month: 'Feb', confidence: 68 },
  { month: 'Mar', confidence: 72 },
  { month: 'Apr', confidence: 78 },
  { month: 'May', confidence: 75 },
  { month: 'Jun', confidence: 82 },
];

const STAGE_COLORS_ARR = ['#a3a3a3', '#3b82f6', '#06b6d4', '#a855f7', '#f59e0b', '#22c55e'];

export default function SalesForecastPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2');

  const totalPipeline = useMemo(() => mockForecasts.reduce((s, f) => s + f.pipelineValue, 0), []);
  const totalWeighted = useMemo(() => mockForecasts.reduce((s, f) => s + f.weightedForecast, 0), []);
  const bestCase = useMemo(() => mockForecasts.reduce((s, f) => s + f.bestCase, 0), []);
  const worstCase = useMemo(() => mockForecasts.reduce((s, f) => s + f.worstCase, 0), []);
  const totalCommitted = useMemo(() => mockForecasts.reduce((s, f) => s + f.committed, 0), []);
  const totalTarget = useMemo(() => mockTeamPerformance.reduce((s, t) => s + t.targetAmount, 0), []);
  const expectedMonthlyClose = Math.round(totalWeighted / 3);

  const maxRepValue = Math.max(...mockForecasts.map(f => Math.max(f.pipelineValue, f.bestCase)), 1);

  // Rep breakdown table data
  const repTableData = useMemo(
    () => mockForecasts.map((rep) => {
      const perf = mockTeamPerformance.find(t => t.repId === rep.repId);
      const gap = perf ? perf.targetAmount - rep.committed : 0;
      return {
        id: rep.id,
        repName: rep.repName,
        pipelineValue: rep.pipelineValue,
        weightedForecast: rep.weightedForecast,
        committed: rep.committed,
        bestCase: rep.bestCase,
        worstCase: rep.worstCase,
        gap,
        rank: perf?.rank || '-',
        closeRate: perf?.closeRate || 0,
      };
    }) as unknown as Record<string, unknown>[],
    []
  );

  const repColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'repName',
      label: 'Rep Name',
      render: (row) => {
        const r = row as { repName: string; rank: string; closeRate: number };
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
              {r.repName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-medium">{r.repName}</p>
              <p className="text-[10px] text-[var(--app-text-disabled)]">
                Rank #{r.rank} · {r.closeRate}% close rate
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'pipelineValue',
      label: 'Pipeline',
      render: (row) => {
        const v = row.pipelineValue as number;
        return <span className="text-xs font-semibold" style={{ color: CSS.text }}>{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'weightedForecast',
      label: 'Weighted',
      render: (row) => {
        const v = row.weightedForecast as number;
        return <span className="text-xs font-medium text-purple-400">{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'committed',
      label: 'Committed',
      render: (row) => {
        const v = row.committed as number;
        return <span className="text-xs font-medium text-[var(--app-text-secondary)]">{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'bestCase',
      label: 'Best Case',
      render: (row) => {
        const v = row.bestCase as number;
        return <span className="text-xs text-emerald-500/70">{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'worstCase',
      label: 'Worst Case',
      render: (row) => {
        const v = row.worstCase as number;
        return <span className="text-xs text-red-500/70">{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'gap',
      label: 'Gap to Target',
      render: (row) => {
        const g = row.gap as number;
        return (
          <span className={cn('text-xs font-bold', g > 0 ? 'text-red-500' : 'text-emerald-500')}>
            {g > 0 ? '-' : '+'}{formatCurrency(Math.abs(g))}
          </span>
        );
      },
    },
  ], []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sales Forecast</h1>
              <p className="text-sm mt-1 text-[var(--app-text-muted)]">
                AI-powered revenue predictions · Updated 2 hours ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl border" style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border }}>
                <Calendar className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-xs text-[var(--app-text-secondary)]">Apr 1 – Jun 30, 2026</span>
              </div>
              <div className="flex items-center rounded-xl border overflow-hidden" style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border }}>
                {QUARTERS.map(q => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q)}
                    className={cn(
                      'px-3 py-2 text-xs font-medium transition-colors',
                      selectedQuarter === q
                        ? 'bg-[var(--app-active-bg)] text-[var(--app-text)]'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Widgets Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {[
              { label: 'Pipeline Value', value: formatCurrency(totalPipeline), icon: DollarSign, change: '+12%', up: true },
              { label: 'Weighted Forecast', value: formatCurrency(totalWeighted), icon: BarChart3, change: '+8%', up: true },
              { label: 'Best Case', value: formatCurrency(bestCase), icon: TrendingUp, change: '+22%', up: true },
              { label: 'Worst Case', value: formatCurrency(worstCase), icon: TrendingDown, change: '-5%', up: false },
              { label: 'Quarter Target', value: formatCurrency(totalTarget), icon: Target, change: '$4.64M', up: true },
              { label: 'Monthly Close', value: formatCurrency(expectedMonthlyClose), icon: Calendar, change: 'avg', up: true },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border p-4" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 text-[var(--app-text-muted)]" />
                  {stat.change !== 'avg' && (
                    <span className={cn('text-[10px] font-medium flex items-center gap-0.5', stat.up ? 'text-emerald-500' : 'text-red-500')}>
                      {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                <p className="text-[10px] mt-1 text-[var(--app-text-muted)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Forecast Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Monthly Forecast vs Actual</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-purple-400" /> Forecast
                  </span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Actual</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 h-44">
                {MONTHLY_FORECAST.map((item) => {
                  const forecastH = maxForecast > 0 ? (item.forecast / maxForecast) * 100 : 0;
                  const actualH = item.actual ? (item.actual / maxForecast) * 100 : 0;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-1 h-36">
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${forecastH}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full rounded-t-sm" style={{ backgroundColor: 'rgba(168,85,247,0.3)' }} />
                        </div>
                        {item.actual !== null && (
                          <div className="flex-1 flex flex-col justify-end">
                            <motion.div initial={{ height: 0 }} animate={{ height: `${actualH}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }} className="w-full rounded-t-sm bg-emerald-500" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--app-text-disabled)]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Rep Forecast Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Rep Forecast Comparison</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-white/30" /> Pipeline</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-500" /> Weighted</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Committed</span>
                </div>
              </div>
              <div className="space-y-4">
                {mockForecasts.map((rep) => {
                  const pipelineW = maxRepValue > 0 ? (rep.pipelineValue / maxRepValue) * 100 : 0;
                  const weightedW = maxRepValue > 0 ? (rep.weightedForecast / maxRepValue) * 100 : 0;
                  const committedW = maxRepValue > 0 ? (rep.committed / maxRepValue) * 100 : 0;
                  return (
                    <div key={rep.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--app-text-secondary)]">{rep.repName}</span>
                        <span className="text-[10px] text-[var(--app-text-muted)]">{formatCurrency(rep.weightedForecast)}</span>
                      </div>
                      <div className="flex gap-1 h-4">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pipelineW}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="h-full rounded-sm bg-[var(--app-hover-bg)]" />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${weightedW}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }} className="h-full rounded-sm bg-purple-500/60" />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${committedW}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }} className="h-full rounded-sm bg-emerald-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Stage Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Stage Revenue Trend</h3>
                <div className="flex items-center gap-2 text-[10px] flex-wrap">
                  {['New', 'Qualified', 'Discovery', 'Demo', 'Proposal', 'Negotiation'].map((label, i) => (
                    <span key={label} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: STAGE_COLORS_ARR[i] }} />
                      <span className="text-[var(--app-text-muted)]">{label}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between gap-2 h-44">
                {STAGE_TREND.map((item) => {
                  const total = item.new + item.qualified + item.discovery + item.demo + item.proposal + item.negotiation;
                  const maxH = maxStageTrend * 6;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col justify-end h-36">
                        {[
                          { val: item.new, idx: 0 },
                          { val: item.qualified, idx: 1 },
                          { val: item.discovery, idx: 2 },
                          { val: item.demo, idx: 3 },
                          { val: item.proposal, idx: 4 },
                          { val: item.negotiation, idx: 5 },
                        ].map(({ val, idx }) => {
                          const h = maxH > 0 ? (val / maxH) * 100 : 0;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.05 }}
                              className="w-full"
                              style={{ backgroundColor: `${STAGE_COLORS_ARR[idx]}80` }}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-[var(--app-text-disabled)]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Confidence Trend */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Confidence Trend</h3>
                <Badge variant="outline" className="text-[10px]">6 months</Badge>
              </div>
              <div className="relative h-44">
                {[0, 25, 50, 75, 100].map(val => (
                  <div key={val} className="absolute w-full border-t border-dashed border-[var(--app-border)]" style={{ bottom: `${val}%` }}>
                    <span className="absolute -top-2 -left-1 text-[9px] text-[var(--app-text-disabled)]">{val}%</span>
                  </div>
                ))}
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-1">
                  {CONFIDENCE_TREND.map((item, i) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center" style={{ height: '100%' }}>
                      <div className="flex-1 flex items-end justify-center w-full relative" style={{ paddingBottom: `${item.confidence}%` }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="w-3 h-3 rounded-full border-2 shrink-0 bg-[var(--app-bg)] border-purple-400" />
                      </div>
                      <span className="text-[10px] mt-1 text-[var(--app-text-disabled)]">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Rep Breakdown Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
          >
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <h3 className="text-sm font-semibold">Rep Breakdown</h3>
            </div>
            <SmartDataTable
              data={repTableData}
              columns={repColumns}
              pageSize={10}
              emptyMessage="No data"
              searchable={false}
              enableExport
              searchKeys={['repName']}
            />
          </motion.div>

          {/* AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="rounded-2xl border p-5 bg-purple-500/[0.04] border-purple-500/15"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-500/15">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">AI Recommendation</h3>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-purple-500/30 text-purple-300">
                    <Sparkles className="w-2.5 h-2.5 mr-1" /> AI
                  </Badge>
                </div>
                <p className="text-sm text-[var(--app-text-secondary)]">
                  Focus on <span className="font-semibold text-[var(--app-text)]">Shanghai Tech</span> ($320K, 80% probability) and{' '}
                  <span className="font-semibold text-[var(--app-text)]">USA Tech Solutions</span> ($520K, 60% probability) deals to exceed Q2 target by 15%.
                  Both deals have strong buyer signals and budget approval. Prioritize the Shanghai Tech negotiation closing by Apr 25.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
