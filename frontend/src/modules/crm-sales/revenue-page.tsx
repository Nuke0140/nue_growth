'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Download, BrainCircuit, Sparkles, BarChart3, Target, Zap, PieChart, RefreshCw, Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { revenueMetrics, mockLeadSources } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

type Period = 'monthly' | 'quarterly' | 'annual';

const MRR_TREND = [
  { month: 'Nov', mrr: 320000 },
  { month: 'Dec', mrr: 345000 },
  { month: 'Jan', mrr: 370000 },
  { month: 'Feb', mrr: 388000 },
  { month: 'Mar', mrr: 405000 },
  { month: 'Apr', mrr: 420000 },
];
const maxMRR = Math.max(...MRR_TREND.map(d => d.mrr), 1);

const SOURCE_ATTRIBUTION = [
  { name: 'LinkedIn', revenue: 580000, color: '#3b82f6' },
  { name: 'Google Ads', revenue: 660000, color: '#f59e0b' },
  { name: 'Website', revenue: 540000, color: '#22c55e' },
  { name: 'WhatsApp', revenue: 720000, color: '#06b6d4' },
  { name: 'Referral', revenue: 320000, color: '#a855f7' },
  { name: 'Events', revenue: 180000, color: '#ef4444' },
];
const totalSourceRevenue = SOURCE_ATTRIBUTION.reduce((s, d) => s + d.revenue, 0);

const WATERFALL = [
  { label: 'Starting ARR', value: 4320000, type: 'start' as const },
  { label: 'New Business', value: 1720000, type: 'increase' as const },
  { label: 'Upsell', value: 680000, type: 'increase' as const },
  { label: 'Renewal', value: 1240000, type: 'increase' as const },
  { label: 'Churn', value: -920000, type: 'decrease' as const },
  { label: 'Ending ARR', value: 5040000, type: 'end' as const },
];
const waterfallMax = Math.max(...WATERFALL.map(d => d.type === 'end' ? d.value : Math.abs(d.value)), 1);

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>('monthly');

  const kpiCards = useMemo(() => [
    { label: 'MRR', value: formatCurrency(revenueMetrics.mrr), change: '+5.2%', up: true, icon: DollarSign },
    { label: 'ARR', value: formatCurrency(revenueMetrics.arr), change: '+18.5%', up: true, icon: BarChart3 },
    { label: 'Closed Won', value: formatCurrency(revenueMetrics.closedWon), change: '+24%', up: true, icon: TrendingUp },
    { label: 'Lost Revenue', value: formatCurrency(revenueMetrics.lostRevenue), change: '-8%', up: true, icon: TrendingDown },
    { label: 'Upsell Revenue', value: formatCurrency(revenueMetrics.upsellRevenue), change: '+32%', up: true, icon: Zap },
    { label: 'Renewal Revenue', value: formatCurrency(revenueMetrics.renewalRevenue), change: '+12%', up: true, icon: RefreshCw },
    { label: 'Net New', value: formatCurrency(revenueMetrics.netNew), change: '+15%', up: true, icon: Users },
    { label: 'Avg Deal Size', value: formatCurrency(revenueMetrics.avgDealSize), change: '-2%', up: false, icon: Target },
  ], []);

  const sourceTable = useMemo(() => {
    const sources = mockLeadSources.map(s => ({
      name: s.name,
      deals: s.leadCount,
      revenue: s.revenue,
      percentOfTotal: totalSourceRevenue > 0 ? ((s.revenue / totalSourceRevenue) * 100).toFixed(1) : '0',
      avgDealSize: s.leadCount > 0 ? Math.round(s.revenue / s.leadCount) : 0,
    }));
    return sources.sort((a, b) => b.revenue - a.revenue);
  }, [totalSourceRevenue]);

  const sourceTableData = useMemo(
    () => sourceTable.map(s => ({
      id: s.name,
      ...s,
    })) as unknown as Record<string, unknown>[],
    [sourceTable]
  );

  const sourceColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Source',
      render: (row) => {
        const s = row as { name: string };
        const srcAttrib = SOURCE_ATTRIBUTION.find(a => a.name === s.name);
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: srcAttrib ? srcAttrib.color : CSS.textDisabled }} />
            <span className="text-xs font-medium">{s.name}</span>
          </div>
        );
      },
    },
    {
      key: 'deals',
      label: 'Leads',
      render: (row) => {
        const s = row as { deals: number };
        return <span className="text-xs text-[var(--app-text-secondary)]">{s.deals}</span>;
      },
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (row) => {
        const s = row as { revenue: number };
        return <span className="text-xs font-semibold">{formatCurrency(s.revenue)}</span>;
      },
    },
    {
      key: 'percentOfTotal',
      label: '% of Total',
      render: (row) => {
        const s = row as { percentOfTotal: string };
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.percentOfTotal}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-[var(--app-active-bg)]"
              />
            </div>
            <span className="text-xs font-medium">{s.percentOfTotal}%</span>
          </div>
        );
      },
    },
    {
      key: 'avgDealSize',
      label: 'Avg Deal Size',
      render: (row) => {
        const s = row as { avgDealSize: number };
        return <span className="text-xs text-[var(--app-text-secondary)]">{formatCurrency(s.avgDealSize)}</span>;
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
              <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
              <p className="text-sm mt-1 text-[var(--app-text-muted)]">
                Executive revenue analytics · Real-time tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border overflow-hidden" style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border }}>
                {(['monthly', 'quarterly', 'annual'] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'px-3 py-2 text-xs font-medium transition-colors capitalize',
                      period === p
                        ? 'bg-[var(--app-active-bg)] text-[var(--app-text)]'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button variant="outline" className="h-9 px-4 rounded-xl text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border p-4" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}>
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-[var(--app-text-muted)]" />
                  <span className={cn('text-[10px] font-medium flex items-center gap-0.5', kpi.up ? 'text-emerald-500' : 'text-red-500')}>
                    {kpi.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-base font-bold tracking-tight">{kpi.value}</p>
                <p className="text-[10px] mt-1 text-[var(--app-text-muted)]">{kpi.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Trend (MRR) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">MRR Trend</h3>
                <span className="text-emerald-500 text-xs font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +31% since Nov
                </span>
              </div>
              <div className="flex items-end justify-between gap-3 h-44">
                {MRR_TREND.map((item) => {
                  const height = maxMRR > 0 ? (item.mrr / maxMRR) * 100 : 0;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] mb-1 font-medium text-[var(--app-text-secondary)]">{formatCurrency(item.mrr)}</span>
                      <div className="w-full flex flex-col justify-end" style={{ height: '140px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full rounded-t-sm"
                          style={{ backgroundColor: 'rgba(168,85,247,0.4)' }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--app-text-disabled)]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Source Attribution (Pie Chart using divs) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Revenue by Source</h3>
                <PieChart className="w-4 h-4 text-[var(--app-text-muted)]" />
              </div>
              <div className="flex items-center gap-6">
                <div className="shrink-0 w-36 h-36 rounded-full relative"
                  style={{
                    background: `conic-gradient(${SOURCE_ATTRIBUTION.map((s, i) => {
                      const startPct = SOURCE_ATTRIBUTION.slice(0, i).reduce((sum, prev) => sum + (prev.revenue / totalSourceRevenue) * 360, 0);
                      const endPct = startPct + (s.revenue / totalSourceRevenue) * 360;
                      return `${s.color} ${startPct}deg ${endPct}deg`;
                    }).join(', ')})`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ backgroundColor: CSS.bg }}>
                    <div className="text-center">
                      <p className="text-lg font-bold">{formatCurrency(totalSourceRevenue)}</p>
                      <p className="text-[9px] text-[var(--app-text-muted)]">Total</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {SOURCE_ATTRIBUTION.map((s) => {
                    const pct = ((s.revenue / totalSourceRevenue) * 100).toFixed(0);
                    return (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs flex-1 text-[var(--app-text-secondary)]">{s.name}</span>
                        <span className="text-xs font-medium text-[var(--app-text)]">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Revenue Waterfall Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border p-5 lg:col-span-2"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Revenue Waterfall</h3>
                <span className="text-xs text-[var(--app-text-muted)]">ARR Movement</span>
              </div>
              <div className="flex items-end justify-between gap-4 h-52">
                {WATERFALL.map((item, i) => {
                  const h = waterfallMax > 0 ? (Math.abs(item.value) / waterfallMax) * 100 : 0;
                  const isIncrease = item.type === 'increase';
                  const isDecrease = item.type === 'decrease';
                  const isStart = item.type === 'start';
                  const isEnd = item.type === 'end';
                  return (
                    <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                      <span className={cn('text-[10px] font-medium mb-1',
                        isIncrease ? 'text-emerald-500' : isDecrease ? 'text-red-500' : 'text-[var(--app-text-muted)]'
                      )}>
                        {isDecrease ? '' : isStart || isEnd ? '' : '+'}{formatCurrency(item.value)}
                      </span>
                      <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(h, 4)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                          className={cn('w-full rounded-t-sm',
                            isIncrease ? 'bg-emerald-500/60' :
                            isDecrease ? 'bg-red-400/50' :
                            isEnd ? 'bg-purple-500/50' :
                            'bg-[var(--app-hover-bg)]'
                          )}
                        />
                      </div>
                      <span className="text-[10px] text-center text-[var(--app-text-disabled)]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Source Breakdown Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
          >
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
              <h3 className="text-sm font-semibold">Source Breakdown</h3>
            </div>
            <SmartDataTable
              data={sourceTableData}
              columns={sourceColumns}
              pageSize={10}
              emptyMessage="No data"
              searchable
              searchKeys={['name']}
              searchPlaceholder="Search sources..."
              enableExport
            />
          </motion.div>

          {/* Revenue Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: BrainCircuit,
                title: 'MRR Growth Accelerating',
                description: 'Monthly recurring revenue grew 31% over the last 6 months, with the strongest growth in March-April. WhatsApp channel contributing 25% of new MRR — consider doubling investment.',
                confidence: '92%',
              },
              {
                icon: TrendingUp,
                title: 'Upsell Opportunity Identified',
                description: '12 existing accounts show expansion signals based on usage data. Combined upsell potential of $480K. Ananya Das has the highest success rate with upsells at 34%.',
                confidence: '85%',
              },
              {
                icon: Zap,
                title: 'Churn Risk Alert',
                description: '$920K ARR at risk from 3 enterprise accounts showing declining engagement. Proactive retention outreach recommended within 7 days. Average recovery rate: 62% with intervention.',
                confidence: '78%',
              },
            ].map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                className="rounded-2xl border p-4"
                style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-500/15">
                    <insight.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 border-purple-300 text-purple-700">
                    <Sparkles className="w-2.5 h-2.5 mr-1" /> {insight.confidence}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold mb-1.5">{insight.title}</h4>
                <p className="text-xs leading-relaxed text-[var(--app-text-secondary)]">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
