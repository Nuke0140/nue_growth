'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, DollarSign, TrendingUp, BarChart3, AlertTriangle, Target,
  ArrowUpRight, ArrowDownRight, Handshake, LayoutGrid, List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockSalesDeals } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { DealStage, SalesDeal } from '@/modules/crm-sales/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const STAGES: DealStage[] = ['new', 'qualified', 'discovery', 'demo', 'proposal', 'negotiation', 'won', 'lost'];

const STAGE_LABELS: Record<DealStage, string> = {
  new: 'New', qualified: 'Qualified', discovery: 'Discovery', demo: 'Demo',
  proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
};

const STAGE_COLORS: Record<DealStage, { header: string; dot: string }> = {
  new:         { header: 'bg-[var(--app-hover-bg)]', dot: 'bg-[var(--app-text-muted)]' },
  qualified:   { header: 'bg-blue-500/[0.08]', dot: 'bg-blue-400' },
  discovery:   { header: 'bg-cyan-500/[0.08]', dot: 'bg-cyan-400' },
  demo:        { header: 'bg-purple-500/[0.08]', dot: 'bg-purple-400' },
  proposal:    { header: 'bg-amber-500/[0.08]', dot: 'bg-amber-400' },
  negotiation: { header: 'bg-emerald-500/[0.08]', dot: 'bg-emerald-400' },
  won:         { header: 'bg-emerald-500/[0.15]', dot: 'bg-emerald-500' },
  lost:        { header: 'bg-red-500/[0.08]', dot: 'bg-red-400' },
};

function getStageColor(stage: DealStage): string {
  const map: Record<DealStage, string> = {
    new: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]',
    qualified: 'bg-blue-500/15 text-blue-400',
    discovery: 'bg-cyan-500/15 text-cyan-400',
    demo: 'bg-purple-500/15 text-purple-400',
    proposal: 'bg-amber-500/15 text-amber-400',
    negotiation: 'bg-emerald-500/15 text-emerald-400',
    won: 'bg-emerald-500/20 text-emerald-400',
    lost: 'bg-red-500/15 text-red-400',
  };
  return map[stage];
}

function getProbabilityColor(probability: number): string {
  if (probability >= 70) return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20';
  if (probability >= 40) return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
  return 'bg-red-500/20 text-red-500 border-red-500/20';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function PipelineColumn({
  stage,
  deals,
  onSelect,
}: {
  stage: DealStage;
  deals: SalesDeal[];
  onSelect: (deal: SalesDeal) => void;
}) {
  const colors = STAGE_COLORS[stage];
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col min-w-[270px] max-w-[310px] w-[290px] rounded-2xl shrink-0">
      <div className={cn('rounded-t-2xl px-3 py-2.5 border-b', colors.header)} style={{ borderBottom: `1px solid ${CSS.border}` }}>
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
            {STAGE_LABELS[stage]}
          </h3>
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]">
            {deals.length}
          </span>
        </div>
        <p className="text-[11px] font-medium pl-4 text-[var(--app-text-muted)]">{formatCurrency(totalValue)}</p>
      </div>

      <div className="flex-1 p-2 space-y-2 rounded-b-2xl min-h-[120px] max-h-[calc(100vh-380px)] overflow-y-auto" style={{ backgroundColor: CSS.bg }}>
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[var(--app-text-disabled)]">
            <span className="text-lg">📋</span>
            <p className="text-xs">No deals</p>
          </div>
        ) : (
          deals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(deal)}
              className="rounded-xl border p-3.5 cursor-pointer transition-all duration-200 group"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold leading-tight line-clamp-2">{deal.name}</h4>
                <span className={cn('shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md border', getProbabilityColor(deal.probability))}>
                  {deal.probability}%
                </span>
              </div>
              <p className="text-xs truncate mb-1 text-[var(--app-text-secondary)]">{deal.company}</p>
              <p className="text-xs truncate mb-3 text-[var(--app-text-muted)]">{deal.contactName}</p>
              <div className="mb-3">
                <span className="text-lg font-bold tracking-tight">{formatCurrency(deal.value)}</span>
              </div>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${CSS.border}` }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
                    {getInitials(deal.owner)}
                  </div>
                  <span className="text-[10px] text-[var(--app-text-muted)]">{deal.owner.split(' ')[0]}</span>
                </div>
                <span className={cn('text-[10px]', deal.daysInStage > 15 ? 'text-amber-500 font-medium' : 'text-[var(--app-text-muted)]')}>
                  {deal.daysInStage}d
                </span>
              </div>
              {deal.daysInStage > 15 && (
                <div className="flex items-center gap-1 mt-2 text-amber-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-[10px] font-medium">Stuck</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const MONTHLY_WIN_LOSS = [
  { month: 'Jan', won: 180000, lost: 45000 },
  { month: 'Feb', won: 320000, lost: 65000 },
  { month: 'Mar', won: 480000, lost: 96000 },
  { month: 'Apr', won: 210000, lost: 30000 },
  { month: 'May', won: 150000, lost: 120000 },
  { month: 'Jun', won: 0, lost: 0 },
];
const maxMonthly = Math.max(...MONTHLY_WIN_LOSS.flatMap(d => [d.won, d.lost]), 1);

export default function DealsPipelinePage() {
  const { selectDeal } = useCrmSalesStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);

  const totalPipeline = useMemo(() => mockSalesDeals.reduce((s, d) => s + d.value, 0), []);
  const weightedPipeline = useMemo(() => mockSalesDeals.reduce((s, d) => s + d.weightedValue, 0), []);
  const wonThisMonth = useMemo(() => mockSalesDeals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0), []);
  const avgDealSize = useMemo(() => mockSalesDeals.length > 0 ? Math.round(mockSalesDeals.reduce((s, d) => s + d.value, 0) / mockSalesDeals.length) : 0, []);
  const winRate = useMemo(() => {
    const active = mockSalesDeals.filter(d => d.stage === 'won' || d.stage === 'lost');
    return active.length > 0 ? Math.round((active.filter(d => d.stage === 'won').length / active.length) * 100) : 0;
  }, []);
  const stuckDeals = useMemo(() => mockSalesDeals.filter(d => d.daysInStage > 15).length, []);

  const filteredDeals = useMemo(() => {
    return mockSalesDeals.filter(d => {
      if (search && !`${d.name} ${d.company} ${d.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      return true;
    });
  }, [search, stageFilter]);

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, SalesDeal[]> = {
      new: [], qualified: [], discovery: [], demo: [],
      proposal: [], negotiation: [], won: [], lost: [],
    };
    mockSalesDeals.filter(d => {
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      if (search && !`${d.name} ${d.company} ${d.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).forEach(deal => {
      grouped[deal.stage].push(deal);
    });
    return grouped;
  }, [search, stageFilter]);

  const handleSelect = (deal: SalesDeal) => {
    setSelectedDeal(deal);
  };

  const tableData = useMemo(
    () => filteredDeals.map(d => ({
      id: d.id,
      name: d.name,
      company: d.company,
      ...d,
    })) as unknown as Record<string, unknown>[],
    [filteredDeals]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Deal Name',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <p className="text-sm font-medium">{d.name}</p>;
      },
    },
    {
      key: 'company',
      label: 'Company',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <span className="text-xs text-[var(--app-text-secondary)]">{d.company}</span>;
      },
    },
    {
      key: 'contactName',
      label: 'Contact',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <span className="text-xs text-[var(--app-text-muted)]">{d.contactName}</span>;
      },
    },
    {
      key: 'value',
      label: 'Value',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <span className="text-xs font-semibold">{formatCurrency(d.value)}</span>;
      },
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return (
          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border', getProbabilityColor(d.probability))}>
            {d.probability}%
          </span>
        );
      },
    },
    {
      key: 'weightedValue',
      label: 'Weighted',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <span className="text-xs text-[var(--app-text-secondary)]">{formatCurrency(d.weightedValue)}</span>;
      },
    },
    {
      key: 'expectedClose',
      label: 'Expected Close',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return (
          <span className="text-xs whitespace-nowrap text-[var(--app-text-muted)]">
            {new Date(d.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        );
      },
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
              {getInitials(d.owner)}
            </div>
            <span className="text-xs text-[var(--app-text-muted)]">{d.owner.split(' ')[0]}</span>
          </div>
        );
      },
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return (
          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize', getStageColor(d.stage))}>
            {STAGE_LABELS[d.stage]}
          </span>
        );
      },
    },
    {
      key: 'daysInStage',
      label: 'Days',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        return <span className="text-xs text-[var(--app-text-muted)]">{d.daysInStage}d</span>;
      },
    },
    {
      key: 'stuck',
      label: 'Aging',
      render: (row) => {
        const d = row as unknown as SalesDeal;
        if (d.daysInStage > 15) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-600 border border-amber-500/20">
              <AlertTriangle className="w-2.5 h-2.5" />
              Stuck
            </span>
          );
        }
        return <span className="text-xs text-[var(--app-text-disabled)]">—</span>;
      },
    },
  ], []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Remove ScrollArea wrapper for Kanban to have full-width scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Deals Pipeline</h1>
                <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]">
                  {formatCurrency(totalPipeline)}
                </Badge>
              </div>
              <p className="text-sm mt-1 text-[var(--app-text-muted)]">
                {mockSalesDeals.length} deals · {formatCurrency(weightedPipeline)} weighted
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="shrink-0 h-9 px-4 rounded-xl text-xs font-semibold text-white"
                style={{ backgroundColor: CSS.accent }}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Deal
              </Button>
            </div>
          </div>

          {/* Revenue Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {[
              { label: 'Total Pipeline', value: formatCurrency(totalPipeline), icon: DollarSign, change: '+12%', up: true },
              { label: 'Weighted Pipeline', value: formatCurrency(weightedPipeline), icon: BarChart3, change: '+8%', up: true },
              { label: 'Won This Month', value: formatCurrency(wonThisMonth), icon: TrendingUp, change: '+3', up: true },
              { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: Target, change: '-2%', up: false },
              { label: 'Win Rate', value: `${winRate}%`, icon: ArrowUpRight, change: '+5%', up: true },
              { label: 'Stuck Deals', value: stuckDeals.toString(), icon: AlertTriangle, change: 'alert', up: false },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border p-4" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.label === 'Stuck Deals' ? 'text-amber-500' : 'text-[var(--app-text-muted)]')} />
                  {stat.change !== 'alert' && (
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

          {/* View Toggle + Stage Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')}>
              <TabsList className="rounded-xl p-0.5 h-9 bg-[var(--app-hover-bg)]">
                <TabsTrigger value="kanban" className="rounded-lg text-xs gap-1.5">Kanban</TabsTrigger>
                <TabsTrigger value="table" className="rounded-lg text-xs gap-1.5">Table</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStageFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                  stageFilter === 'all'
                    ? 'bg-[var(--app-active-bg)] text-[var(--app-text)]'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
                )}
              >
                All
              </button>
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setStageFilter(stage)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                    stageFilter === stage
                      ? getStageColor(stage)
                      : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban View */}
          {view === 'kanban' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex gap-3 overflow-x-auto pb-4 px-1">
              {STAGES.map((stage) => (
                <PipelineColumn key={stage} stage={stage} deals={dealsByStage[stage]} onSelect={handleSelect} />
              ))}
            </motion.div>
          )}

          {/* Table View */}
          {view === 'table' && (
            <SmartDataTable
              data={tableData}
              columns={columns}
              onRowClick={(row) => handleSelect(row as unknown as SalesDeal)}
              searchable
              searchPlaceholder="Search deals..."
              searchKeys={['name', 'company', 'contactName']}
              emptyMessage="No deals match your filters"
              pageSize={10}
              enableExport
            />
          )}

          {/* Forecast Card + Won/Loss Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Q2 Forecast</h3>
                <Badge variant="outline" className="text-[10px]">Confidence: 76%</Badge>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold tracking-tight">$1.26M</span>
                <span className="text-emerald-500 text-xs font-medium mb-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +18% vs Q1
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Pessimistic</span>
                  <span className="font-medium text-[var(--app-text-muted)]">$885K</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <div className="h-full bg-gradient-to-r from-red-400/50 via-amber-400/50 to-emerald-400/50 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Most Likely</span>
                  <span className="font-medium">$1.26M</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '76%' }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Optimistic</span>
                  <span className="font-medium text-[var(--app-text-muted)]">$1.64M</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Won vs Lost by Month</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Won</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Lost</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 h-40 mt-2">
                {MONTHLY_WIN_LOSS.map((item) => {
                  const wonH = maxMonthly > 0 ? (item.won / maxMonthly) * 100 : 0;
                  const lostH = maxMonthly > 0 ? (item.lost / maxMonthly) * 100 : 0;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-0.5 h-32">
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${wonH}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full rounded-t-sm bg-emerald-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${lostH}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }} className="w-full rounded-t-sm bg-red-400" />
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--app-text-disabled)]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Deal Detail Sidebar */}
      <ContextualSidebar
        open={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        title={selectedDeal?.name || ''}
        subtitle="Deal"
        icon={BarChart3}
        width={420}
        footer={selectedDeal ? (
          <div className="flex items-center gap-2">
            <Button size="sm" className="flex-1 rounded-xl text-xs" variant="outline" onClick={() => setSelectedDeal(null)}>Close</Button>
            <Button size="sm" className="flex-1 rounded-xl text-xs text-white" style={{ backgroundColor: CSS.accent }}>Edit Deal</Button>
          </div>
        ) : undefined}
      >
        {selectedDeal && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Value</span>
                <p className="text-lg font-bold">{formatCurrency(selectedDeal.value)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Weighted</span>
                <p className="text-lg font-bold text-purple-400">{formatCurrency(selectedDeal.weightedValue)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Probability</span>
                <p className="text-lg font-bold">{selectedDeal.probability}%</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Days in Stage</span>
                <p className={cn('text-lg font-bold', selectedDeal.daysInStage > 15 ? 'text-amber-500' : '')}>{selectedDeal.daysInStage}</p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Company</span>
              <p className="text-sm font-medium">{selectedDeal.company}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Contact</span>
              <p className="text-sm">{selectedDeal.contactName}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Stage</span>
              <span className={cn('inline-flex px-3 py-1.5 rounded-lg text-xs font-medium', getStageColor(selectedDeal.stage))}>
                {STAGE_LABELS[selectedDeal.stage]}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Owner</span>
              <p className="text-sm">{selectedDeal.owner}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Expected Close</span>
              <p className="text-sm">{new Date(selectedDeal.expectedClose).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            {selectedDeal.daysInStage > 15 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">Deal has been in this stage for {selectedDeal.daysInStage} days</span>
              </div>
            )}
          </div>
        )}
      </ContextualSidebar>
    </div>
  );
}
