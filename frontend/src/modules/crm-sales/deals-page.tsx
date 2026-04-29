'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, DollarSign, TrendingUp, BarChart3, AlertTriangle, Target,
  ArrowUpRight, Handshake, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockDeals, revenueStats } from './data/mock-data';
import PipelineBoard from './components/pipeline-board';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { Deal, DealStage } from '@/modules/crm-sales/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const STAGE_LABELS: Record<DealStage, string> = {
  new: 'New', qualified: 'Qualified', demo: 'Demo', proposal: 'Proposal',
  negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
};

function getStageColor(stage: DealStage): string {
  const map: Record<DealStage, string> = {
    new: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]',
    qualified: 'bg-blue-500/15 text-blue-400',
    demo: 'bg-purple-500/15 text-purple-400',
    proposal: 'bg-amber-500/15 text-amber-400',
    negotiation: 'bg-emerald-500/15 text-emerald-400',
    won: 'bg-emerald-500/20 text-emerald-400',
    lost: 'bg-red-500/15 text-red-400',
  };
  return map[stage];
}

const MONTHLY_DATA = [
  { month: 'Jan', won: 180000, lost: 45000 },
  { month: 'Feb', won: 320000, lost: 65000 },
  { month: 'Mar', won: 48000, lost: 96000 },
  { month: 'Apr', won: 210000, lost: 30000 },
  { month: 'May', won: 150000, lost: 120000 },
  { month: 'Jun', won: 0, lost: 0 },
];
const maxMonthly = Math.max(...MONTHLY_DATA.flatMap(d => [d.won, d.lost]), 1);

const createDealFields: FormField[] = [
  { key: 'name', label: 'Deal Name', type: 'text', placeholder: 'Enterprise SaaS Deal', required: true },
  { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc', required: true },
  { key: 'value', label: 'Deal Value ($)', type: 'number', placeholder: '100000', required: true },
  { key: 'contactName', label: 'Contact', type: 'text', placeholder: 'John Doe' },
  { key: 'owner', label: 'Owner', type: 'text', placeholder: 'Sales Rep' },
  { key: 'expectedClose', label: 'Expected Close', type: 'date' },
  {
    key: 'stage',
    label: 'Stage',
    type: 'select',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Demo', value: 'demo' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Negotiation', value: 'negotiation' },
    ],
  },
];

export default function DealsPage() {
  const { selectDeal } = useCrmSalesStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filteredDeals = useMemo(() => {
    return mockDeals.filter(d => {
      if (search && !`${d.name} ${d.company} ${d.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      return true;
    });
  }, [search, stageFilter]);

  const handleDealSelect = (deal: Deal) => {
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
        const d = row as unknown as Deal;
        return (
          <div>
            <p className="text-sm font-medium">{d.name}</p>
            <p className="text-[11px] text-[var(--app-text-muted)]">{d.contactName}</p>
          </div>
        );
      },
    },
    {
      key: 'company',
      label: 'Company',
      render: (row) => {
        const d = row as unknown as Deal;
        return <span className="text-xs text-[var(--app-text-secondary)]">{d.company}</span>;
      },
    },
    {
      key: 'value',
      label: 'Value',
      render: (row) => {
        const d = row as unknown as Deal;
        return <span className="text-xs font-semibold">{formatCurrency(d.value)}</span>;
      },
    },
    {
      key: 'probability',
      label: 'Probability',
      render: (row) => {
        const d = row as unknown as Deal;
        return (
          <div className="flex items-center gap-2">
            <Progress value={d.probability} className="h-1.5 w-16 bg-[var(--app-hover-bg)]" />
            <span className="text-xs font-medium">{d.probability}%</span>
          </div>
        );
      },
    },
    {
      key: 'weightedValue',
      label: 'Weighted',
      render: (row) => {
        const d = row as unknown as Deal;
        return <span className="text-xs text-[var(--app-text-secondary)]">{formatCurrency(d.weightedValue)}</span>;
      },
    },
    {
      key: 'expectedClose',
      label: 'Close Date',
      render: (row) => {
        const d = row as unknown as Deal;
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
        const d = row as unknown as Deal;
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
              {d.owner.split(' ').map(n => n[0]).join('')}
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
        const d = row as unknown as Deal;
        return (
          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize', getStageColor(d.stage))}>
            {STAGE_LABELS[d.stage]}
          </span>
        );
      },
    },
    {
      key: 'aging',
      label: 'Aging',
      render: (row) => {
        const d = row as unknown as Deal;
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn('text-xs font-medium', d.aging > 15 ? 'text-amber-500' : 'text-[var(--app-text-muted)]')}>
              {d.aging}d
            </span>
            {d.aging > 15 && <AlertTriangle className="w-3 h-3 text-amber-500" />}
          </div>
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
              <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
              <p className="text-sm mt-1 text-[var(--app-text-muted)]">
                {mockDeals.length} deals · {formatCurrency(revenueStats.totalPipeline)} pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="shrink-0 h-9 px-4 rounded-xl text-xs font-semibold text-white"
                style={{ backgroundColor: CSS.accent }}
                onClick={() => setShowCreateModal(true)}
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
              { label: 'Total Pipeline', value: formatCurrency(revenueStats.totalPipeline), icon: DollarSign, change: '+12%', up: true },
              { label: 'Weighted Pipeline', value: formatCurrency(revenueStats.weightedPipeline), icon: BarChart3, change: '+8%', up: true },
              { label: 'Won This Month', value: formatCurrency(revenueStats.wonThisMonth), icon: TrendingUp, change: '+3%', up: true },
              { label: 'Avg Deal Size', value: formatCurrency(revenueStats.avgDealSize), icon: Target, change: '-2%', up: false },
              { label: 'Win Rate', value: `${revenueStats.winRate}%`, icon: ArrowUpRight, change: '+5%', up: true },
              { label: 'Stuck Deals', value: revenueStats.stuckDeals.toString(), icon: AlertTriangle, change: 'alert', up: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border p-4"
                style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.label === 'Stuck Deals' ? 'text-amber-500' : 'text-[var(--app-text-muted)]')} />
                  {stat.change !== 'alert' && (
                    <span className={cn('text-[10px] font-medium', stat.up ? 'text-emerald-500' : 'text-red-500')}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                <p className="text-[10px] mt-1 text-[var(--app-text-muted)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* View Toggle + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')}>
              <TabsList className="rounded-xl p-0.5 h-9 bg-[var(--app-hover-bg)]">
                <TabsTrigger value="kanban" className="rounded-lg text-xs gap-1.5">Kanban</TabsTrigger>
                <TabsTrigger value="table" className="rounded-lg text-xs gap-1.5">Table</TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as DealStage | 'all')}>
              <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg bg-[var(--app-hover-bg)] border-[var(--app-border)]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {Object.entries(STAGE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kanban View */}
          {view === 'kanban' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <PipelineBoard onSelect={handleDealSelect} />
            </motion.div>
          )}

          {/* Table View */}
          {view === 'table' && (
            <SmartDataTable
              data={tableData}
              columns={columns}
              onRowClick={(row) => handleDealSelect(row as unknown as Deal)}
              searchable
              searchPlaceholder="Search deals..."
              searchKeys={['name', 'company', 'contactName']}
              emptyMessage="No deals match your filters"
              pageSize={10}
              enableExport
            />
          )}

          {/* Forecast Card + Won/Lost Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Q2 Forecast */}
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
                <span className="text-3xl font-bold tracking-tight">{formatCurrency(revenueStats.forecastQ2)}</span>
                <span className="text-emerald-500 text-xs font-medium mb-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +18% vs Q1
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Pessimistic</span>
                  <span className="font-medium text-[var(--app-text-muted)]">{formatCurrency(revenueStats.forecastQ2 * 0.7)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <div className="h-full bg-gradient-to-r from-red-400/50 via-amber-400/50 to-emerald-400/50 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Most Likely</span>
                  <span className="font-medium">{formatCurrency(revenueStats.forecastQ2)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--app-text-disabled)]">Optimistic</span>
                  <span className="font-medium text-[var(--app-text-muted)]">{formatCurrency(revenueStats.forecastQ2 * 1.3)}</span>
                </div>
              </div>
            </motion.div>

            {/* Won/Lost Analytics */}
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
                {MONTHLY_DATA.map((item) => {
                  const wonHeight = maxMonthly > 0 ? (item.won / maxMonthly) * 100 : 0;
                  const lostHeight = maxMonthly > 0 ? (item.lost / maxMonthly) * 100 : 0;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-0.5 h-32">
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${wonHeight}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full rounded-t-sm bg-emerald-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div initial={{ height: 0 }} animate={{ height: `${lostHeight}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }} className="w-full rounded-t-sm bg-red-400" />
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
      </ScrollArea>

      {/* Create Deal Modal */}
      <CreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Deal"
        description="Create a new deal in your pipeline"
        fields={createDealFields}
        icon={BarChart3}
        submitLabel="Create Deal"
        onSubmit={(data) => {
          console.log('Creating deal:', data);
        }}
      />

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
                <span className="text-[10px] text-[var(--app-text-muted)]">Probability</span>
                <p className="text-lg font-bold">{selectedDeal.probability}%</p>
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
            {selectedDeal.aging > 15 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">Deal is stuck ({selectedDeal.aging} days in stage)</span>
              </div>
            )}
          </div>
        )}
      </ContextualSidebar>
    </div>
  );
}
