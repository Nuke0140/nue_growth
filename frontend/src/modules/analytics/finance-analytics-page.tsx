'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Wallet, Flame, Clock, TrendingUp, IndianRupee, AlertTriangle,
  Calendar, BarChart3, ArrowUpRight, ArrowDownRight, ChevronRight,
  CheckCircle2, XCircle,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { financeAnalyticsData } from './data/mock-data';

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

export default function FinanceAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = financeAnalyticsData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'monthly', 'quarterly', 'ytd'];

  // Derived KPIs
  const totalRevenue = data.pnlTrend.reduce((s, p) => s + p.revenue, 0);
  const lastMonth = data.cashFlow[data.cashFlow.length - 1];
  const cashPosition = data.cashFlow.reduce((s, c) => s + c.net, 0);
  const avgBurn = Math.round(data.cashFlow.reduce((s, c) => s + c.outflow, 0) / data.cashFlow.length);

  const maxPnl = Math.max(
    ...data.pnlTrend.map((p) => p.revenue),
    ...data.pnlTrend.map((p) => p.expense),
  );
  const maxCashFlow = Math.max(
    ...data.cashFlow.map((c) => c.inflow),
    ...data.cashFlow.map((c) => c.outflow),
  );
  const maxReceivable = Math.max(...data.receivableAging.map((r) => r.amount));
  const maxBurnDept = Math.max(...data.burnByDepartment.map((d) => Math.max(d.burn, d.budget)));
  const maxClientMargin = Math.max(...data.profitabilityByClient.map((c) => c.margin));

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
              'bg-[var(--app-hover-bg)]',
            )}>
              <Wallet className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Finance Analytics</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                P&amp;L, cash flow, receivables &amp; budget tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
            <span className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-xl',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
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
            label="Total Revenue"
            value={formatINR(totalRevenue)}
            change={15.2}
            changeLabel="vs last year"
            icon={IndianRupee}
          />
          <KPICard
            label="Cash Position"
            value={formatINR(cashPosition)}
            change={8.4}
            changeLabel="net cash flow"
            icon={Wallet}
          />
          <KPICard
            label="Burn Rate"
            value={formatINR(avgBurn)}
            change={-3.6}
            changeLabel="avg monthly outflow"
            icon={Flame}
            severity="warning"
          />
          <KPICard
            label="Runway"
            value={`${data.runwayMonths} months`}
            change={-1.2}
            changeLabel="vs last month"
            icon={Clock}
            severity="warning"
          />
        </motion.div>

        {/* P&L Trend: 12-month grouped bar chart */}
        <ChartCard
          title="P&L Trend"
          subtitle="12-month revenue, expense & profit"
        >
          <div className="flex items-center gap-4 mb-3">
            {[
              { color: 'bg-[var(--app-success)]', label: 'Revenue' },
              { color: isDark ? 'bg-red-500/50' : 'bg-red-400', label: 'Expense' },
              { color: 'bg-[var(--app-info)]', label: 'Profit' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1 h-44">
            {data.pnlTrend.map((entry, i) => (
              <div key={entry.month} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                <div className="flex gap-0.5 w-full items-end h-full justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.expense / maxPnl) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', isDark ? 'bg-red-500/40' : 'bg-red-300')}
                    title={`Expense: ${formatINR(entry.expense)}`}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.revenue / maxPnl) * 100}%` }}
                    transition={{ delay: 0.32 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                    title={`Revenue: ${formatINR(entry.revenue)}`}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.profit / maxPnl) * 100}%` }}
                    transition={{ delay: 0.34 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', isDark ? 'bg-blue-500/40' : 'bg-blue-300')}
                    title={`Profit: ${formatINR(entry.profit)}`}
                  />
                </div>
                <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-disabled)]')}>
                  {entry.month.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Row: Cash Flow + Receivable Aging */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cash Flow */}
          <ChartCard title="Cash Flow" subtitle="Monthly inflow vs outflow with net">
            <div className="flex items-center gap-4 mb-3">
              {[
                { color: 'bg-[var(--app-success)]', label: 'Inflow' },
                { color: isDark ? 'bg-red-500/50' : 'bg-red-400', label: 'Outflow' },
                { color: isDark ? 'bg-blue-500' : 'bg-blue-500', label: 'Net' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1.5 h-36">
              {data.cashFlow.map((entry, i) => {
                const netY = (entry.net / maxCashFlow) * 100;
                return (
                  <div key={entry.month} className="flex-1 flex flex-col justify-end items-center gap-0.5 relative">
                    {/* Net dot */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.04, duration: 0.3 }}
                      className="absolute left-1/2 -translate-x-1/2 z-10 w-2 h-2 rounded-full bg-blue-500"
                      style={{ bottom: `${Math.max(netY, 5)}%` }}
                      title={`Net: ${formatINR(entry.net)}`}
                    />
                    <div className="flex gap-0.5 w-full items-end h-full justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.outflow / maxCashFlow) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-red-500/40' : 'bg-red-300')}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.inflow / maxCashFlow) * 100}%` }}
                        transition={{ delay: 0.32 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                      />
                    </div>
                    <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-disabled)]')}>
                      {entry.month.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Receivable Aging */}
          <ChartCard title="Receivable Aging" subtitle="Outstanding invoices by aging bucket">
            <div className="space-y-4 pt-2">
              {data.receivableAging.map((bucket, i) => (
                <motion.div
                  key={bucket.bucket}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{bucket.bucket}</span>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {bucket.count} invoices
                      </span>
                      <span className="text-sm font-semibold">{formatINR(bucket.amount)}</span>
                    </div>
                  </div>
                  <div className={cn('w-full h-3 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(bucket.amount / maxReceivable) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        i === 0 ? ('bg-[var(--app-success)]')
                          : i === 1 ? ('bg-[var(--app-info)]')
                            : i === 2 ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400')
                              : (isDark ? 'bg-red-500/50' : 'bg-red-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Budget Variance Table */}
        <ChartCard title="Budget Variance" subtitle="Actual vs budget by category">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Category', 'Budget', 'Actual', 'Variance', 'Status'].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        'text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3',
                        'text-[var(--app-text-muted)]',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.budgetVariance.map((item, i) => {
                  const isOver = item.variance < 0;
                  return (
                    <motion.tr
                      key={item.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className={cn(
                        'border-b transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]',
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className="text-sm font-medium">{item.category}</span>
                      </td>
                      <td className="py-3 px-3 text-sm">{formatINR(item.budget)}</td>
                      <td className="py-3 px-3 text-sm font-medium">{formatINR(item.actual)}</td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'flex items-center gap-0.5 text-sm font-semibold',
                          isOver ? 'text-red-500' : 'text-emerald-500',
                        )}>
                          {isOver ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          {formatINR(Math.abs(item.variance))}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isOver ? (
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                            'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
                          )}>
                            <XCircle className="w-3 h-3" />
                            Over budget
                          </span>
                        ) : (
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                            'bg-[var(--app-success-bg)] text-[var(--app-success)]',
                          )}>
                            <CheckCircle2 className="w-3 h-3" />
                            Under budget
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Row: Burn by Department + Profitability by Client */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Burn by Department */}
          <ChartCard title="Burn by Department" subtitle="Monthly spend vs budget">
            <div className="flex items-center gap-4 mb-3">
              {[
                { color: isDark ? 'bg-amber-500/50' : 'bg-amber-400', label: 'Actual Burn' },
                { color: isDark ? 'bg-white/20' : 'bg-black/10', label: 'Budget' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {data.burnByDepartment.map((dept, i) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatINR(dept.burn)}</span>
                      {dept.burn > dept.budget && (
                        <span className={cn(
                          'text-[10px] font-medium',
                          'text-[var(--app-danger)]',
                        )}>
                          over
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className={cn('w-full h-2.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(dept.budget / maxBurnDept) * 100}%` }}
                        transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                        className={cn('h-full rounded-full absolute', 'bg-[var(--app-hover-bg)]')}
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(dept.burn / maxBurnDept) * 100}%` }}
                        transition={{ delay: 0.37 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'h-full rounded-full relative z-10',
                          dept.burn > dept.budget
                            ? (isDark ? 'bg-red-500/50' : 'bg-red-400')
                            : (isDark ? 'bg-amber-500/50' : 'bg-amber-400'),
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Profitability by Client */}
          <ChartCard title="Profitability by Client" subtitle="Margin % by top clients">
            <div className="space-y-3 pt-1">
              {data.profitabilityByClient.map((client, i) => (
                <motion.div
                  key={client.client}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{client.client}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {formatINR(client.revenue)}
                      </span>
                      <span className={cn(
                        'text-sm font-semibold',
                        client.margin >= 50 ? 'text-emerald-500'
                          : client.margin >= 35 ? 'text-blue-500'
                            : client.margin >= 20 ? 'text-amber-500'
                              : 'text-red-500',
                      )}>
                        {client.margin}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('w-full h-2.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${client.margin}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        client.margin >= 50 ? ('bg-[var(--app-success)]')
                          : client.margin >= 35 ? ('bg-[var(--app-info)]')
                            : client.margin >= 20 ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400')
                              : (isDark ? 'bg-red-500/50' : 'bg-red-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
