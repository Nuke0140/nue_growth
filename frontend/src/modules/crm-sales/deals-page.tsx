'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Search, LayoutGrid, List, DollarSign, TrendingUp, BarChart3,
  AlertTriangle, Target, ArrowUpRight, ArrowDownRight, Handshake,
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

function getStageColor(stage: DealStage, isDark: boolean): string {
  const map: Record<DealStage, string> = {
    new: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]',
    qualified: 'bg-[var(--app-info-bg)] text-[var(--app-info)]',
    demo: isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-50 text-purple-700',
    proposal: isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700',
    negotiation: 'bg-[var(--app-success-bg)] text-[var(--app-success)]',
    won: isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    lost: isDark ? 'bg-red-500/15 text-red-300' : 'bg-red-50 text-red-700',
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

export default function DealsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectDeal } = useCrmSalesStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');

  const filteredDeals = useMemo(() => {
    return mockDeals.filter(d => {
      if (search && !`${d.name} ${d.company} ${d.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      return true;
    });
  }, [search, stageFilter]);

  const handleDealSelect = (deal: Deal) => {
    selectDeal(deal.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                Deals
              </h1>
              <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
                {mockDeals.length} deals · {formatCurrency(revenueStats.totalPipeline)} pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
                <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'bg-transparent text-sm focus:outline-none w-full',
                    'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                  )}
                />
              </div>
              <Button className={cn(
                'shrink-0 h-9 px-4 rounded-xl text-xs font-semibold',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
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
              { label: 'Total Pipeline', value: formatCurrency(revenueStats.totalPipeline), icon: DollarSign, change: '+12%', up: true },
              { label: 'Weighted Pipeline', value: formatCurrency(revenueStats.weightedPipeline), icon: BarChart3, change: '+8%', up: true },
              { label: 'Won This Month', value: formatCurrency(revenueStats.wonThisMonth), icon: TrendingUp, change: '+3%', up: true },
              { label: 'Avg Deal Size', value: formatCurrency(revenueStats.avgDealSize), icon: Target, change: '-2%', up: false },
              { label: 'Win Rate', value: `${revenueStats.winRate}%`, icon: ArrowUpRight, change: '+5%', up: true },
              { label: 'Stuck Deals', value: revenueStats.stuckDeals.toString(), icon: AlertTriangle, change: 'alert', up: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-2xl border p-4 transition-colors',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.label === 'Stuck Deals' ? 'text-amber-500' : ('text-[var(--app-text-muted)]'))} />
                  {stat.change !== 'alert' && (
                    <span className={cn(
                      'text-[10px] font-medium',
                      stat.up ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className={cn('text-lg font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  {stat.value}
                </p>
                <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* View Toggle + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')}>
              <TabsList className={cn(
                'rounded-xl p-0.5 h-9',
                'bg-[var(--app-hover-bg)]'
              )}>
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

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as DealStage | 'all')}>
              <SelectTrigger className={cn(
                'w-[140px] h-8 text-xs rounded-lg',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PipelineBoard onSelect={handleDealSelect} />
            </motion.div>
          )}

          {/* Table View */}
          {view === 'table' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'rounded-2xl border overflow-hidden',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                      {['Deal Name', 'Company', 'Value', 'Probability', 'Weighted', 'Close Date', 'Owner', 'Stage', 'Aging'].map(col => (
                        <th
                          key={col}
                          className={cn(
                            'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                            'text-[var(--app-text-muted)]'
                          )}
                        >
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
                        onClick={() => handleDealSelect(deal)}
                        className={cn(
                          'border-b cursor-pointer transition-colors group',
                          'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>{deal.name}</p>
                          <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>{deal.contactName}</p>
                        </td>
                        <td className={cn('px-4 py-3 text-xs', 'text-[var(--app-text-secondary)]')}>{deal.company}</td>
                        <td className={cn('px-4 py-3 text-xs font-semibold', 'text-[var(--app-text)]')}>
                          {formatCurrency(deal.value)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={deal.probability}
                              className={cn('h-1.5 w-16', 'bg-[var(--app-hover-bg)]')}
                            />
                            <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                              {deal.probability}%
                            </span>
                          </div>
                        </td>
                        <td className={cn('px-4 py-3 text-xs', 'text-[var(--app-text-secondary)]')}>
                          {formatCurrency(deal.weightedValue)}
                        </td>
                        <td className={cn('px-4 py-3 text-xs whitespace-nowrap', 'text-[var(--app-text-muted)]')}>
                          {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                              'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                            )}>
                              {deal.owner.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{deal.owner.split(' ')[0]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize',
                            getStageColor(deal.stage, isDark)
                          )}>
                            {STAGE_LABELS[deal.stage]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              'text-xs font-medium',
                              deal.aging > 15 ? 'text-amber-500' : 'text-[var(--app-text-muted)]'
                            )}>
                              {deal.aging}d
                            </span>
                            {deal.aging > 15 && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDeals.length === 0 && (
                <div className={cn('flex flex-col items-center justify-center py-16', 'text-[var(--app-text-disabled)]')}>
                  <Handshake className="w-8 h-8 mb-3" />
                  <p className="text-sm">No deals match your filters</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Forecast Card + Won/Lost Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Q2 Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className={cn(
                'rounded-2xl border p-5',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Q2 Forecast</h3>
                <Badge variant="outline" className="text-[10px]">
                  Confidence: 76%
                </Badge>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className={cn('text-3xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  {formatCurrency(revenueStats.forecastQ2)}
                </span>
                <span className="text-emerald-500 text-xs font-medium mb-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +18% vs Q1
                </span>
              </div>

              {/* Confidence Interval */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn('text-[var(--app-text-muted)]')}>Pessimistic</span>
                  <span className={cn('font-medium', 'text-[var(--app-text-muted)]')}>{formatCurrency(revenueStats.forecastQ2 * 0.7)}</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <div className="h-full bg-gradient-to-r from-red-400/50 via-amber-400/50 to-emerald-400/50 rounded-full w-full" />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn('text-[var(--app-text-muted)]')}>Most Likely</span>
                  <span className={cn('font-medium', 'text-[var(--app-text-secondary)]')}>{formatCurrency(revenueStats.forecastQ2)}</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={cn('text-[var(--app-text-muted)]')}>Optimistic</span>
                  <span className={cn('font-medium', 'text-[var(--app-text-muted)]')}>{formatCurrency(revenueStats.forecastQ2 * 1.3)}</span>
                </div>
              </div>
            </motion.div>

            {/* Won/Lost Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={cn(
                'rounded-2xl border p-5',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Won vs Lost by Month</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Won</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Lost</span>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-3 h-40 mt-2">
                {MONTHLY_DATA.map((item) => {
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
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{item.month}</span>
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
