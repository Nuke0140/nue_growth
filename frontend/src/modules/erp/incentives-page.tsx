'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, IndianRupee, Clock, CheckCircle2, TrendingUp, BarChart3,
  ChevronDown, MoreHorizontal, Download, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockIncentives, mockEmployees } from '@/modules/erp/data/mock-data';
import type { IncentiveType, IncentiveStatus } from '@/modules/erp/types';

type FilterKey = 'all' | IncentiveStatus;

const typeConfig: Record<IncentiveType, { label: string; className: string }> = {
  performance: { label: 'Performance', className: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' },
  referral: { label: 'Referral', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'project-bonus': { label: 'Project Bonus', className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  'spot-award': { label: 'Spot Award', className: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20' },
  retention: { label: 'Retention', className: 'bg-teal-500/15 text-teal-400 border-teal-500/20' },
};

const statusConfig: Record<IncentiveStatus, { label: string; className: string; dotClass: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
  approved: { label: 'Approved', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dotClass: 'bg-blue-500' },
  disbursed: { label: 'Disbursed', className: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

function formatCurrency(val: number) {
  return `₹${val.toLocaleString('en-IN')}`;
}

function IncentivesPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  const filtered = useMemo(() => {
    let result = selectedMonth === 'all' ? mockIncentives : mockIncentives.filter(i => i.month === selectedMonth);
    if (activeFilter !== 'all') result = result.filter(i => i.status === activeFilter);
    return result;
  }, [activeFilter, selectedMonth]);

  const stats = useMemo(() => {
    const monthData = selectedMonth === 'all' ? mockIncentives : mockIncentives.filter(i => i.month === selectedMonth);
    return {
      total: monthData.reduce((s, i) => s + i.amount, 0),
      pending: monthData.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
      disbursed: monthData.filter(i => i.status === 'disbursed').reduce((s, i) => s + i.amount, 0),
      avgPerEmployee: monthData.length > 0 ? Math.round(monthData.reduce((s, i) => s + i.amount, 0) / monthData.length) : 0,
    };
  }, [selectedMonth]);

  const typeDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(i => { map[i.type] = (map[i.type] || 0) + i.amount; });
    return Object.entries(map).map(([type, amount]) => ({
      type: typeConfig[type as IncentiveType] || { label: type, className: '' },
      amount,
    })).sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const maxTypeAmount = Math.max(...typeDistribution.map(d => d.amount), 1);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockIncentives.length },
    { key: 'pending', label: 'Pending', count: mockIncentives.filter(i => i.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: mockIncentives.filter(i => i.status === 'approved').length },
    { key: 'disbursed', label: 'Disbursed', count: mockIncentives.filter(i => i.status === 'disbursed').length },
  ];

  const months = ['all', '2026-04', '2026-03', '2026-02'];

  return (
    <PageShell title="Incentives" icon={Gift}>
      <div className="space-y-app-2xl">
        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={cn(
                'appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-[var(--app-radius-lg)] border cursor-pointer focus:outline-none',
                isDark ? 'bg-white/[0.04] border-white/[0.08] text-white/60' : 'bg-black/[0.03] border-black/[0.08] text-black/60'
              )}
            >
              {months.map(m => (
                <option key={m} value={m}>{m === 'all' ? 'All Time' : new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn('h-10  rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                  <Plus className="w-4 h-4" /> Add Incentive
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Add a new incentive entry</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit overflow-x-auto" style={{ background: 'var(--app-hover-bg)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors duration-200 whitespace-nowrap',
                  isActive ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]') : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]')
                )}
              >
                <span>{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? ('bg-[var(--app-hover-bg)]') : ('bg-[var(--app-hover-bg)]'))}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total This Month', value: formatCurrency(stats.total), icon: IndianRupee, color: 'text-emerald-500 dark:text-emerald-400' },
            { label: 'Pending', value: formatCurrency(stats.pending), icon: Clock, color: 'text-amber-500 dark:text-amber-400' },
            { label: 'Disbursed', value: formatCurrency(stats.disbursed), icon: CheckCircle2, color: 'text-blue-400' },
            { label: 'Avg Per Employee', value: formatCurrency(stats.avgPerEmployee), icon: TrendingUp, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                </div>
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-app-2xl">
          {/* Table */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn('border-b', 'border-[var(--app-border-light)]')}>
                      <th className={cn('text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Employee</th>
                      <th className={cn('text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Type</th>
                      <th className={cn('text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Amount</th>
                      <th className={cn('text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell', 'text-[var(--app-text-muted)]')}>Month</th>
                      <th className={cn('text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider hidden lg:table-cell', 'text-[var(--app-text-muted)]')}>Description</th>
                      <th className={cn('text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Status</th>
                      <th className="w-[40px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inc, idx) => {
                      const emp = getEmployee(inc.employeeId);
                      const type = typeConfig[inc.type];
                      const status = statusConfig[inc.status];
                      return (
                        <motion.tr
                          key={inc.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className={cn('border-b last:border-0', 'border-[var(--app-border-strong)]')}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8  w-7">
                                <AvatarFallback className={cn('text-[10px] font-semibold', 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]')}>
                                  {emp?.avatar || '??'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{emp?.name || inc.employeeId}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', type.className)}>
                              {type.label}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm font-semibold">{formatCurrency(inc.amount)}</span>
                          </td>
                          <td className="hidden md:table-cell px-3 py-3">
                            <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
                              {new Date(inc.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="hidden lg:table-cell px-3 py-3">
                            <span className={cn('text-xs max-w-[200px] truncate block', 'text-[var(--app-text-muted)]')}>
                              {inc.description}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', status.className)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'hover:bg-[var(--app-hover-bg)]')}>
                                  <MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                <DropdownMenuItem>Process Payment</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Type Distribution */}
          <div className="w-full xl:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Type Distribution
              </h3>
              <div className="space-y-3">
                {typeDistribution.map((d, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{d.type.label}</span>
                      <span className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>{formatCurrency(d.amount)}</span>
                    </div>
                    <div className={cn('h-3 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.amount / maxTypeAmount) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full bg-purple-500/70"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default memo(IncentivesPageInner);
