'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Search, LayoutGrid, List, DollarSign, TrendingUp, BarChart3,
  AlertTriangle, Target, ArrowUpRight, ArrowDownRight, Handshake,
  Calendar, Clock, User, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockSalesDeals } from './data/mock-data';
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

const STAGE_COLORS: Record<DealStage, { header: string; dot: string; isDarkHeader: string; isDarkDot: string }> = {
  new:         { header: 'bg-black/[0.04]', dot: 'bg-black/30', isDarkHeader: 'bg-white/[0.04]', isDarkDot: 'bg-white/30' },
  qualified:   { header: 'bg-blue-50', dot: 'bg-blue-400', isDarkHeader: 'bg-blue-500/[0.08]', isDarkDot: 'bg-blue-400/60' },
  discovery:   { header: 'bg-cyan-50', dot: 'bg-cyan-400', isDarkHeader: 'bg-cyan-500/[0.08]', isDarkDot: 'bg-cyan-400/60' },
  demo:        { header: 'bg-purple-50', dot: 'bg-purple-400', isDarkHeader: 'bg-purple-500/[0.08]', isDarkDot: 'bg-purple-400/60' },
  proposal:    { header: 'bg-amber-50', dot: 'bg-amber-400', isDarkHeader: 'bg-amber-500/[0.08]', isDarkDot: 'bg-amber-400/60' },
  negotiation: { header: 'bg-emerald-50', dot: 'bg-emerald-500', isDarkHeader: 'bg-emerald-500/[0.08]', isDarkDot: 'bg-emerald-400/60' },
  won:         { header: 'bg-emerald-100', dot: 'bg-emerald-600', isDarkHeader: 'bg-emerald-500/[0.15]', isDarkDot: 'bg-emerald-400' },
  lost:        { header: 'bg-red-50', dot: 'bg-red-400', isDarkHeader: 'bg-red-500/[0.08]', isDarkDot: 'bg-red-400/60' },
};

function getStageColor(stage: DealStage, isDark: boolean): string {
  const map: Record<DealStage, string> = {
    new: isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.06] text-black/60',
    qualified: isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-700',
    discovery: isDark ? 'bg-cyan-500/15 text-cyan-300' : 'bg-cyan-50 text-cyan-700',
    demo: isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-50 text-purple-700',
    proposal: isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700',
    negotiation: isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
    won: isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    lost: isDark ? 'bg-red-500/15 text-red-300' : 'bg-red-50 text-red-700',
  };
  return map[stage];
}

function getProbabilityColor(probability: number, isDark: boolean): string {
  if (probability >= 70) return isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (probability >= 40) return isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
  return isDark ? 'bg-red-500/20 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/* Inline Pipeline Column */
function PipelineColumn({
  stage,
  deals,
  onSelect,
  isDark,
}: {
  stage: DealStage;
  deals: SalesDeal[];
  onSelect: (deal: SalesDeal) => void;
  isDark: boolean;
}) {
  const colors = STAGE_COLORS[stage];
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col min-w-[270px] max-w-[310px] w-[290px] rounded-2xl shrink-0">
      <div className={cn(
        'rounded-t-2xl px-3 py-2.5 border-b',
        isDark ? `${colors.isDarkHeader} border-white/[0.04]` : `${colors.header} border-black/[0.04]`
      )}>
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', isDark ? colors.isDarkDot : colors.dot)} />
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/70' : 'text-black/70')}>
            {STAGE_LABELS[stage]}
          </h3>
          <span className={cn(
            'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md',
            isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40'
          )}>
            {deals.length}
          </span>
        </div>
        <p className={cn('text-[11px] font-medium pl-4', isDark ? 'text-white/40' : 'text-black/40')}>
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div className={cn(
        'flex-1 p-2 space-y-2 rounded-b-2xl min-h-[120px] max-h-[calc(100vh-380px)] overflow-y-auto',
        isDark ? 'bg-white/[0.01]' : 'bg-black/[0.005]'
      )}>
        {deals.length === 0 ? (
          <div className={cn('flex flex-col items-center justify-center py-8 text-center', isDark ? 'text-white/20' : 'text-black/20')}>
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-2', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
              <span className="text-lg">📋</span>
            </div>
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
              className={cn(
                'rounded-xl border p-3.5 cursor-pointer transition-all duration-200 group',
                isDark
                  ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20'
                  : 'bg-white border-black/[0.06] hover:bg-black/[0.01] hover:border-black/[0.12] hover:shadow-lg hover:shadow-black/5'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className={cn('text-sm font-semibold leading-tight line-clamp-2', isDark ? 'text-white' : 'text-black')}>
                  {deal.name}
                </h4>
                <span className={cn(
                  'shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md border',
                  getProbabilityColor(deal.probability, isDark)
                )}>
                  {deal.probability}%
                </span>
              </div>
              <p className={cn('text-xs truncate mb-1', isDark ? 'text-white/50' : 'text-black/50')}>{deal.company}</p>
              <p className={cn('text-xs truncate mb-3', isDark ? 'text-white/40' : 'text-black/40')}>{deal.contactName}</p>
              <div className="mb-3">
                <span className={cn('text-lg font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                  {formatCurrency(deal.value)}
                </span>
              </div>
              <div className={cn('flex items-center justify-between pt-2 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold',
                    isDark ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'
                  )}>
                    {getInitials(deal.owner)}
                  </div>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                    {deal.owner.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
                  <span className={cn('text-[10px]', deal.daysInStage > 15 ? 'text-amber-500 font-medium' : (isDark ? 'text-white/30' : 'text-black/30'))}>
                    {deal.daysInStage}d
                  </span>
                </div>
              </div>
              {deal.daysInStage > 15 && (
                <div className={cn('flex items-center gap-1 mt-2', isDark ? 'text-amber-400/70' : 'text-amber-600')}>
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

/* Monthly won/lost data */
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectDeal } = useCrmSalesStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');

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
    selectDeal(deal.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                  Deals Pipeline
                </h1>
                <Badge variant="secondary" className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-lg',
                  isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
                )}>
                  {formatCurrency(totalPipeline)}
                </Badge>
              </div>
              <p className={cn('text-sm mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                {mockSalesDeals.length} deals · {formatCurrency(weightedPipeline)} weighted
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn('bg-transparent text-sm focus:outline-none w-full',
                    isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                  )}
                />
              </div>
              <Button className={cn(
                'shrink-0 h-9 px-4 rounded-xl text-xs font-semibold',
                isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
              )}>
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
              <div
                key={stat.label}
                className={cn('rounded-2xl border p-4 transition-colors',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.label === 'Stuck Deals' ? 'text-amber-500' : (isDark ? 'text-white/30' : 'text-black/30'))} />
                  {stat.change !== 'alert' && (
                    <span className={cn('text-[10px] font-medium flex items-center gap-0.5', stat.up ? 'text-emerald-500' : 'text-red-500')}>
                      {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className={cn('text-lg font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>{stat.value}</p>
                <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* View Toggle + Stage Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')}>
              <TabsList className={cn('rounded-xl p-0.5 h-9', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                <TabsTrigger value="kanban" className="rounded-lg text-xs gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="table" className="rounded-lg text-xs gap-1.5">
                  <List className="w-3.5 h-3.5" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Stage filter chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStageFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors',
                  stageFilter === 'all'
                    ? isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                    : isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
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
                      ? getStageColor(stage, isDark)
                      : isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
                  )}
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban View */}
          {view === 'kanban' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 overflow-x-auto pb-4 px-1"
            >
              {STAGES.map((stage) => (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  deals={dealsByStage[stage]}
                  onSelect={handleSelect}
                  isDark={isDark}
                />
              ))}
            </motion.div>
          )}

          {/* Table View */}
          {view === 'table' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn('rounded-2xl border overflow-hidden',
                isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                      {['Deal Name', 'Company', 'Contact', 'Value', 'Probability', 'Weighted', 'Expected Close', 'Owner', 'Stage', 'Days', 'Aging'].map(col => (
                        <th key={col} className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap', isDark ? 'text-white/30' : 'text-black/30')}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((deal, i) => (
                      <motion.tr
                        key={deal.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSelect(deal)}
                        className={cn('border-b cursor-pointer transition-colors group',
                          isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>{deal.name}</p>
                        </td>
                        <td className={cn('px-4 py-3 text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{deal.company}</td>
                        <td className={cn('px-4 py-3 text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{deal.contactName}</td>
                        <td className={cn('px-4 py-3 text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                          {formatCurrency(deal.value)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border', getProbabilityColor(deal.probability, isDark))}>
                            {deal.probability}%
                          </span>
                        </td>
                        <td className={cn('px-4 py-3 text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                          {formatCurrency(deal.weightedValue)}
                        </td>
                        <td className={cn('px-4 py-3 text-xs whitespace-nowrap', isDark ? 'text-white/40' : 'text-black/40')}>
                          {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                              isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.06] text-black/60'
                            )}>
                              {getInitials(deal.owner)}
                            </div>
                            <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{deal.owner.split(' ')[0]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize', getStageColor(deal.stage, isDark))}>
                            {STAGE_LABELS[deal.stage]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{deal.daysInStage}d</span>
                        </td>
                        <td className="px-4 py-3">
                          {deal.daysInStage > 15 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-600 border border-amber-500/20">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Stuck
                            </span>
                          ) : (
                            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDeals.length === 0 && (
                <div className={cn('flex flex-col items-center justify-center py-16', isDark ? 'text-white/20' : 'text-black/20')}>
                  <Handshake className="w-8 h-8 mb-3" />
                  <p className="text-sm">No deals match your filters</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Forecast Card + Won/Loss Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Q2 Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>Q2 Forecast</h3>
                <Badge variant="outline" className="text-[10px]">Confidence: 76%</Badge>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                  $1.26M
                </span>
                <span className="text-emerald-500 text-xs font-medium mb-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +18% vs Q1
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn(isDark ? 'text-white/25' : 'text-black/25')}>Pessimistic</span>
                  <span className={cn('font-medium', isDark ? 'text-white/40' : 'text-black/40')}>$885K</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <div className="h-full bg-gradient-to-r from-red-400/50 via-amber-400/50 to-emerald-400/50 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn(isDark ? 'text-white/25' : 'text-black/25')}>Most Likely</span>
                  <span className={cn('font-medium', isDark ? 'text-white/60' : 'text-black/60')}>$1.26M</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn(isDark ? 'text-white/25' : 'text-black/25')}>Optimistic</span>
                  <span className={cn('font-medium', isDark ? 'text-white/40' : 'text-black/40')}>$1.64M</span>
                </div>
              </div>
            </motion.div>

            {/* Won vs Lost by Month */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>Won vs Lost by Month</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Won</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Lost</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 h-40 mt-2">
                {MONTHLY_WIN_LOSS.map((item) => {
                  const wonHeight = maxMonthly > 0 ? (item.won / maxMonthly) * 100 : 0;
                  const lostHeight = maxMonthly > 0 ? (item.lost / maxMonthly) * 100 : 0;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-0.5 h-32">
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${wonHeight}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={cn('w-full rounded-t-sm', isDark ? 'bg-emerald-500/60' : 'bg-emerald-500')}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${lostHeight}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                            className={cn('w-full rounded-t-sm', isDark ? 'bg-red-400/40' : 'bg-red-400')}
                          />
                        </div>
                      </div>
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
