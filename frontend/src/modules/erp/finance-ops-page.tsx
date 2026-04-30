'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  Flame, Wallet, Building2, CreditCard, BarChart3, PieChart, Target,
  Activity, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockFinanceOps } from '@/modules/erp/data/mock-data';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

const monthlyTrend = [
  { month: 'Oct', revenue: 3200000, expense: 2100000 },
  { month: 'Nov', revenue: 3800000, expense: 2500000 },
  { month: 'Dec', revenue: 2900000, expense: 2200000 },
  { month: 'Jan', revenue: 4100000, expense: 2800000 },
  { month: 'Feb', revenue: 3500000, expense: 2600000 },
  { month: 'Mar', revenue: 5200000, expense: 3400000 },
  { month: 'Apr', revenue: 5750000, expense: 3875000 },
];

function FinanceOpsPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = mockFinanceOps;
  const maxTrendRevenue = Math.max(...monthlyTrend.map(m => m.revenue));

  const kpiStats = useMemo(() => [
    { label: 'Receivables', value: formatINR(data.receivables), icon: ArrowDownRight, color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-[var(--app-warning-bg)]', trend: '+12% vs last month', trendUp: false },
    { label: 'Payables', value: formatINR(data.payables), icon: ArrowUpRight, color: 'text-red-500 dark:text-red-400', bgColor: 'bg-[var(--app-danger-bg)]', trend: '-5% vs last month', trendUp: true },
    { label: 'Cash Flow', value: formatINR(data.cashFlow), icon: TrendingUp, color: 'text-emerald-500 dark:text-emerald-400', bgColor: 'bg-[var(--app-success-bg)]', trend: '+18% growth', trendUp: true },
    { label: 'Budget Variance', value: `${((data.budgetVariance / (data.receivables + data.monthlyProfit)) * 100).toFixed(1)}%`, icon: Activity, color: data.budgetVariance < 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400', bgColor: data.budgetVariance < 0 ? ('bg-[var(--app-danger-bg)]') : ('bg-[var(--app-success-bg)]'), trend: data.budgetVariance < 0 ? 'Over budget' : 'Under budget', trendUp: data.budgetVariance >= 0 },
    { label: 'Burn Rate', value: `${formatINR(data.burnRate)}/mo`, icon: Flame, color: 'text-orange-400', bgColor: isDark ? 'bg-orange-500/10' : 'bg-orange-50', trend: 'Across all projects', trendUp: null },
    { label: 'Vendor Payouts Due', value: formatINR(data.vendorPayouts), icon: Wallet, color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-[var(--app-warning-bg)]', trend: 'Due in next 15 days', trendUp: null },
    { label: 'Monthly Profit', value: formatINR(data.monthlyProfit), icon: TrendingUp, color: 'text-emerald-500 dark:text-emerald-400', bgColor: 'bg-[var(--app-success-bg)]', trend: '+22% vs March', trendUp: true },
    { label: 'Cost Centers', value: `${data.projectCostCenters.length}`, icon: Building2, color: 'text-sky-400', bgColor: 'bg-[var(--app-info-bg)]', trend: '6 active projects', trendUp: null },
  ], [data, isDark]);

  return (
    <PageShell title="Finance Ops" icon={TrendingDown}>
      <div className="space-y-6">

        {/* KPI Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bgColor)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              {stat.trend && (
                <p className={cn('text-[10px] mt-1 flex items-center gap-1', stat.trendUp === true ? 'text-emerald-500 dark:text-emerald-400' : stat.trendUp === false ? 'text-red-500 dark:text-red-400' : ('text-[var(--app-text-muted)]'))}>
                  {stat.trendUp === true && <TrendingUp className="w-3 h-3" />}
                  {stat.trendUp === false && <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Monthly Revenue vs Expense Trend</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-sm', 'bg-[var(--app-success)]')} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-red-500/30' : 'bg-red-300')} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Expense</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyTrend.map((m, i) => {
              const revHeight = (m.revenue / maxTrendRevenue) * 100;
              const expHeight = (m.expense / maxTrendRevenue) * 100;
              const profit = m.revenue - m.expense;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full flex items-end gap-0.5 h-32 cursor-pointer group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${revHeight}%` }}
                            transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('flex-1 rounded-t-sm transition-all', isDark ? 'bg-emerald-500/40 group-hover:bg-emerald-500/60' : 'bg-emerald-300 group-hover:bg-emerald-400')}
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${expHeight}%` }}
                            transition={{ delay: 0.5 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('flex-1 rounded-t-sm transition-all', isDark ? 'bg-red-500/25 group-hover:bg-red-500/40' : 'bg-red-200 group-hover:bg-red-300')}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p className="font-semibold">{m.month} 2026</p>
                          <p className="text-emerald-500 dark:text-emerald-400">Revenue: {formatINR(m.revenue)}</p>
                          <p className="text-red-500 dark:text-red-400">Expense: {formatINR(m.expense)}</p>
                          <p className="font-semibold">Profit: {formatINR(profit)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Project Cost Centers Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--app-hover-bg)' }}>
            <div className="flex items-center gap-2">
              <Building2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Project Cost Centers</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              {data.projectCostCenters.length} active
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border-light)]')}>
                  <th className="text-left px-5 py-3"><span className="text-[11px] font-semibold uppercase tracking-wider">Project</span></th>
                  <th className="text-right px-3 py-3"><span className="text-[11px] font-semibold uppercase tracking-wider">Budget</span></th>
                  <th className="text-right px-3 py-3"><span className="text-[11px] font-semibold uppercase tracking-wider">Spent</span></th>
                  <th className="text-right px-3 py-3 hidden md:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Variance</span></th>
                  <th className="text-right px-3 py-3 hidden lg:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Burn Rate</span></th>
                  <th className="text-left px-3 py-3"><span className="text-[11px] font-semibold uppercase tracking-wider">Status</span></th>
                </tr>
              </thead>
              <tbody>
                {data.projectCostCenters.map((cc, idx) => {
                  const spentPct = cc.budget > 0 ? Math.round((cc.spent / cc.budget) * 100) : 0;
                  const variancePct = cc.budget > 0 ? Math.round((cc.variance / cc.budget) * 100) : 0;
                  const isOverBudget = cc.variance < 0;
                  const varianceColor = variancePct > 10 ? 'text-red-500 dark:text-red-400' : variancePct < -10 ? 'text-red-500 dark:text-red-400' : variancePct < 5 && variancePct > 0 ? 'text-emerald-500 dark:text-emerald-400' : isOverBudget ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400';
                  const status = isOverBudget ? 'over-budget' : spentPct > 80 ? 'caution' : 'healthy';
                  return (
                    <motion.tr
                      key={cc.projectId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 + idx * 0.04 }}
                      className={cn('border-b last:border-0 transition-colors', isDark ? 'border-white/[0.03] hover:bg-white/[0.04]' : 'border-black/[0.03] hover:bg-black/[0.02]')}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', 'bg-[var(--app-hover-bg)]')}>
                            <PieChart className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[220px]">{cc.projectName}</p>
                            <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{spentPct}% utilized</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right"><span className="text-sm font-medium">{formatINR(cc.budget)}</span></td>
                      <td className="px-3 py-3 text-right">
                        <div>
                          <span className="text-sm">{formatINR(cc.spent)}</span>
                          <div className={cn('h-1 rounded-full overflow-hidden mt-1', 'bg-[var(--app-hover-bg)]')}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(spentPct, 100)}%` }}
                              transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
                              className={cn('h-full rounded-full', spentPct > 100 ? 'bg-red-500' : spentPct > 80 ? 'bg-amber-500' : 'bg-emerald-500')}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right hidden md:table-cell">
                        <div>
                          <span className={cn('text-sm font-semibold', varianceColor)}>
                            {cc.variance > 0 ? '+' : ''}{formatINR(cc.variance)}
                          </span>
                          <p className={cn('text-[10px]', varianceColor)}>{variancePct}%</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right hidden lg:table-cell">
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{formatINR(cc.burnRate)}/mo</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          {status === 'healthy' ? (
                            <Badge className={cn('text-[10px] font-medium border', isDark ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>
                              <CheckCircle2 className="w-3 h-3 mr-0.5" />
                              Healthy
                            </Badge>
                          ) : status === 'caution' ? (
                            <Badge className={cn('text-[10px] font-medium border', isDark ? 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200')}>
                              <AlertTriangle className="w-3 h-3 mr-0.5" />
                              Caution
                            </Badge>
                          ) : (
                            <Badge className={cn('text-[10px] font-medium border', isDark ? 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200')}>
                              <Clock className="w-3 h-3 mr-0.5" />
                              Over Budget
                            </Badge>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Summary Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-[10px] uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Total Budget Allocated</p>
            <p className="text-lg font-bold">{formatINR(data.projectCostCenters.reduce((s, c) => s + c.budget, 0))}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-[10px] uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Total Spent</p>
            <p className="text-lg font-bold">{formatINR(data.projectCostCenters.reduce((s, c) => s + c.spent, 0))}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-[10px] uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Net Variance</p>
            <p className={cn('text-lg font-bold', data.projectCostCenters.reduce((s, c) => s + c.variance, 0) > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>
              {data.projectCostCenters.reduce((s, c) => s + c.variance, 0) > 0 ? '+' : ''}{formatINR(data.projectCostCenters.reduce((s, c) => s + c.variance, 0))}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-[10px] uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Projects at Risk</p>
            <p className="text-lg font-bold text-red-500 dark:text-red-400">
              {data.projectCostCenters.filter(c => c.variance < 0).length}
            </p>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}

export default memo(FinanceOpsPageInner);
