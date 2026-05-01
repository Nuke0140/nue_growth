'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plus, Wallet, AlertTriangle, TrendingUp, TrendingDown, Filter,
  Lock, BarChart3, Target, ChevronRight, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { budgets, budgetTrends } from '@/modules/finance/data/mock-data';
import type { Budget, BudgetTrend } from '@/modules/finance/types';


const statusConfig: Record<string, { label: string; color: string; bgDark: string; bgLight: string; barColor: string }> = {
  'on-track': { label: 'On Track', color: 'text-emerald-400', bgDark: 'bg-emerald-500/15', bgLight: 'bg-emerald-50 text-emerald-600', barColor: 'bg-emerald-500' },
  'at-risk': { label: 'At Risk', color: 'text-amber-400', bgDark: 'bg-amber-500/15', bgLight: 'bg-amber-50 text-amber-600', barColor: 'bg-amber-500' },
  'overspent': { label: 'Overspent', color: 'text-red-400', bgDark: 'bg-red-500/15', bgLight: 'bg-red-50 text-red-600', barColor: 'bg-red-500' },
  'locked': { label: 'Locked', color: 'text-slate-400', bgDark: 'bg-slate-500/15', bgLight: 'bg-slate-50 text-slate-600', barColor: 'bg-slate-500' },
};

const typeConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  department: { label: 'Department', bgDark: 'bg-violet-500/15 text-violet-400', bgLight: 'bg-violet-50 text-violet-600' },
  campaign: { label: 'Campaign', bgDark: 'bg-sky-500/15 text-sky-400', bgLight: 'bg-sky-50 text-sky-600' },
  client: { label: 'Client', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  delivery: { label: 'Delivery', bgDark: 'bg-orange-500/15 text-orange-400', bgLight: 'bg-orange-50 text-orange-600' },
};

export default function BudgetsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalAllocated = useMemo(() => budgets.reduce((s, b) => s + b.allocated, 0), []);
  const totalSpent = useMemo(() => budgets.reduce((s, b) => s + b.spent, 0), []);
  const totalRemaining = useMemo(() => budgets.reduce((s, b) => s + b.remaining, 0), []);
  const atRiskCount = useMemo(() => budgets.filter(b => b.status === 'at-risk' || b.status === 'overspent').length, []);
  const overspentBudgets = useMemo(() => budgets.filter(b => b.status === 'overspent'), []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b: Budget) => {
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, statusFilter]);

  const maxAllocated = useMemo(() => Math.max(...budgetTrends.map(t => t.allocated)), []);
  const maxSpent = useMemo(() => Math.max(...budgetTrends.map(t => t.spent)), []);
  const maxTrend = Math.max(maxAllocated, maxSpent);

  const kpiStats = [
    { label: 'Total Allocated', value: formatINR(totalAllocated), icon: Wallet, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { label: 'Total Spent', value: formatINR(totalSpent), icon: TrendingUp, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
    { label: 'Remaining', value: formatINR(totalRemaining), icon: Target, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50' },
    { label: 'At Risk', value: atRiskCount.toString(), icon: AlertTriangle, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Wallet className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Budgets</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Budget Planning Cockpit</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Plus className="w-4 h-4" /> Create Budget
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4 cursor-pointer transition-all duration-200', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Budget Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Budget Trend</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Allocated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Spent</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-36">
            {budgetTrends.map((trend: BudgetTrend, j) => (
              <div key={trend.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-1 w-full h-28">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.allocated / maxTrend) * 100}%` }}
                    transition={{ delay: 0.3 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-sm bg-emerald-500/40"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.spent / maxTrend) * 100}%` }}
                    transition={{ delay: 0.3 + j * 0.06 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-sm bg-amber-500/40"
                  />
                </div>
                <span className={cn('text-[9px]', isDark ? 'text-white/30' : 'text-black/30')}>{trend.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn('flex items-center gap-2', isDark ? 'text-white/40' : 'text-black/40')}>
            <Filter className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
          </div>
          <div className="flex gap-2">
            {(['all', 'department', 'campaign', 'client', 'delivery'] as const).map((type) => (
              <button key={type} onClick={() => setTypeFilter(type)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize', typeFilter === type ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (isDark ? 'bg-white/[0.04] text-white/40 hover:bg-white/[0.06]' : 'bg-black/[0.04] text-black/40 hover:bg-black/[0.06]'))}>
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-4">
            {(['all', 'on-track', 'at-risk', 'overspent', 'locked'] as const).map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize', statusFilter === status ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (isDark ? 'bg-white/[0.04] text-white/40 hover:bg-white/[0.06]' : 'bg-black/[0.04] text-black/40 hover:bg-black/[0.06]'))}>
                {status === 'all' ? 'All Status' : status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Rows */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Budget Details</span>
              <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                {filteredBudgets.length} budgets
              </Badge>
            </div>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredBudgets.map((budget: Budget, i) => {
              const sConf = statusConfig[budget.status];
              const tConf = typeConfig[budget.type];
              const progress = budget.allocated > 0 ? Math.min((budget.spent / budget.allocated) * 100, 100) : 0;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.3 }}
                  className={cn('p-4 rounded-xl border transition-colors cursor-pointer', isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]')}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{budget.name}</p>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? tConf.bgDark : tConf.bgLight)}>
                          {tConf.label}
                        </Badge>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                          {sConf.label}
                        </Badge>
                      </div>
                      <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>{budget.period}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs shrink-0">
                      <div className="text-center">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Allocated</p>
                        <p className="font-semibold">{formatINR(budget.allocated)}</p>
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Spent</p>
                        <p className="font-semibold">{formatINR(budget.spent)}</p>
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Remaining</p>
                        <p className={cn('font-semibold', budget.remaining < 0 ? 'text-red-500' : '')}>{formatINR(budget.remaining)}</p>
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Monthly Cap</p>
                        <p className="font-semibold">{formatINR(budget.monthlyCap)}</p>
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Variance</p>
                        <p className={cn('font-semibold', budget.variancePercent < 0 ? 'text-red-500' : 'text-emerald-500')}>
                          {budget.variancePercent > 0 ? '+' : ''}{budget.variancePercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={cn('w-full h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.6 }}
                        className={cn('h-full rounded-full', sConf.barColor)}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{progress.toFixed(0)}% utilized</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{formatINR(budget.remaining)} left</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Overspend Alerts */}
        {overspentBudgets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-red-500/[0.03] border-red-500/[0.12]' : 'bg-red-50/50 border-red-200/60')}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-500">Overspend Alerts</span>
              <Badge variant="secondary" className="text-[10px] bg-red-500/15 text-red-400">{overspentBudgets.length} budgets</Badge>
            </div>
            <div className="space-y-2">
              {overspentBudgets.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.05, duration: 0.3 }}
                  className={cn('flex items-center justify-between p-3 rounded-xl border', isDark ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-red-200/40 bg-white/60')}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{b.period} • Overspent by {formatINR(Math.abs(b.remaining))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-500">{formatINR(b.spent)} / {formatINR(b.allocated)}</p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{b.variancePercent}% over</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
