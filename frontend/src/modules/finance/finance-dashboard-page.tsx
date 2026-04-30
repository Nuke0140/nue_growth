'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, Wallet, CreditCard, Banknote, Flame, Clock, Receipt, Users,
  DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Shield,
  CircleAlert, AlertCircle, HandCoins, FileText, Plus,
} from 'lucide-react';
import {
  financeDashboardStats, receivables, invoices, payables,
  revenueMonthly, financeAlerts
} from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Invoice, FinanceAlert as FAlert } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const months = ['O', 'N', 'D', 'J', 'F', 'M', 'A'];

export default function FinanceDashboardPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);

  const stats = financeDashboardStats;

  const topOverdue = useMemo(() =>
    [...invoices]
      .filter((inv: Invoice) => inv.status === 'overdue')
      .sort((a: Invoice, b: Invoice) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5),
    []
  );

<<<<<<< HEAD
  const kpiStats = [
    { label: 'Total Revenue', value: formatINR(stats.totalRevenue), icon: DollarSign, color: 'success', change: 8.3, changeLabel: 'this financial year' },
    { label: 'Pending Receivables', value: formatINR(stats.pendingReceivables), icon: CreditCard, color: 'warning', change: -5.2, changeLabel: '₹87.5L outstanding' },
    { label: 'Pending Payables', value: formatINR(stats.pendingPayables), icon: HandCoins, color: 'warning', change: 3.1, changeLabel: 'vendor dues this month' },
    { label: 'Cash in Bank', value: formatINR(stats.cashInBank), icon: Banknote, color: 'success', change: 12.4, changeLabel: 'current balance' },
    { label: 'Burn Rate', value: `${formatINR(stats.burnRate)}/mo`, icon: Flame, color: 'danger', change: 4.5, changeLabel: 'monthly cash burn' },
    { label: 'Runway', value: `${stats.runwayMonths} months`, icon: Clock, color: 'danger', change: -18.2, changeLabel: 'below 4-month safety' },
    { label: 'GST Due', value: formatINR(stats.gstDue), icon: Receipt, color: 'warning', change: 6.3, changeLabel: 'file by Apr 20' },
    { label: 'Payroll Due', value: formatINR(stats.payrollDue), icon: Users, color: 'info', change: 1.8, changeLabel: 'process by Apr 25' },
    { label: 'Profit Margin', value: `${stats.profitMargin}%`, icon: Shield, color: 'success', change: 1.4, changeLabel: 'net margin YTD' },
    { label: 'Client Profitability', value: `${stats.clientProfitability}%`, icon: BarChart3, color: 'success', change: 3.8, changeLabel: 'avg client margin' },
=======
  const receivableAging = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    receivables.forEach((r: Receivable) => { buckets[r.agingBucket] += r.dueAmount; });
    return [
      { label: '0-30', value: buckets['0-30'] },
      { label: '31-60', value: buckets['31-60'] },
      { label: '61-90', value: buckets['61-90'] },
      { label: '90+', value: buckets['90+'] },
    ];
  }, []);

  const payableAging = useMemo(() => {
    const now = new Date();
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    payables.forEach((p) => {
      if (p.approvalStatus === 'paid') return;
      const diff = Math.floor((new Date(p.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 0) buckets['0-30'] += p.amount;
      else if (diff <= 30) buckets['0-30'] += p.amount;
      else if (diff <= 60) buckets['31-60'] += p.amount;
      else buckets['90+'] += p.amount;
    });
    return [
      { label: '0-30', value: buckets['0-30'] },
      { label: '31-60', value: buckets['31-60'] },
      { label: '61-90', value: buckets['61-90'] },
      { label: '90+', value: buckets['90+'] },
    ];
  }, []);

  const burnVsRevenue = useMemo(() => revenueMonthly.map((r) => ({
    month: r.month.slice(0, 3),
    revenue: r.revenue,
    burn: 3850000,
  })), []);

  const marginTrend = useMemo(() => revenueMonthly.map((r) => ({
    month: r.month.slice(0, 3),
    margin: 28 + Math.random() * 8,
  })), []);

  const kpiStats = useMemo(() => [
    { label: 'Total Revenue', value: formatINR(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 8.3, changeLabel: 'this financial year' },
    { label: 'Pending Receivables', value: formatINR(stats.pendingReceivables), icon: CreditCard, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: -5.2, changeLabel: '₹87.5L outstanding' },
    { label: 'Pending Payables', value: formatINR(stats.pendingPayables), icon: HandCoins, color: 'text-orange-400', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50', change: 3.1, changeLabel: 'vendor dues this month' },
    { label: 'Cash in Bank', value: formatINR(stats.cashInBank), icon: Banknote, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 12.4, changeLabel: 'current balance' },
    { label: 'Burn Rate', value: `${formatINR(stats.burnRate)}/mo`, icon: Flame, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: 4.5, changeLabel: 'monthly cash burn' },
    { label: 'Runway', value: `${stats.runwayMonths} months`, icon: Clock, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: -18.2, changeLabel: 'below 4-month safety', severity: 'critical' as const },
    { label: 'GST Due', value: formatINR(stats.gstDue), icon: Receipt, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: 6.3, changeLabel: 'file by Apr 20' },
    { label: 'Payroll Due', value: formatINR(stats.payrollDue), icon: Users, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 1.8, changeLabel: 'process by Apr 25' },
    { label: 'Profit Margin', value: `${stats.profitMargin}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 1.4, changeLabel: 'net margin YTD' },
    { label: 'Client Profitability', value: `${stats.clientProfitability}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 3.8, changeLabel: 'avg client margin' },
  ], [isDark, stats]);

  const quickNavItems: { label: string; value: string; page: FinancePage; icon: React.ElementType }[] = [
    { label: 'Revenue', value: formatINR(stats.totalRevenue), page: 'revenue', icon: BarChart3 },
    { label: 'Receivables', value: formatINR(stats.pendingReceivables), page: 'receivables', icon: CreditCard },
    { label: 'Payables', value: formatINR(stats.pendingPayables), page: 'payables', icon: HandCoins },
    { label: 'Invoices', value: `${invoices.length} total`, page: 'invoices', icon: FileText },
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
  ];

  const tableData = useMemo(() =>
    topOverdue.map((inv: Invoice) => ({
      id: inv.id,
      invoiceNo: inv.invoiceNo,
      client: inv.client,
      amount: formatINR(inv.amount),
      gst: formatINR(inv.gst),
      total: formatINR(inv.total),
      dueDate: inv.dueDate,
      reminders: inv.reminders,
    })),
    [topOverdue]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'invoiceNo',
      label: 'Invoice',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: CSS.danger }}>{row.invoiceNo as string}</span>
      ),
    },
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{row.client as string}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{row.amount as string}</span>,
    },
    {
      key: 'gst',
      label: 'GST',
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{row.gst as string}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold" style={{ color: CSS.text }}>{row.total as string}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{row.dueDate as string}</span>,
    },
    {
      key: 'reminders',
      label: 'Reminders',
      render: (row) => (
        <StatusBadge status={String(row.reminders as number)} variant="pill" className="text-[10px] px-2 py-0" />
      ),
    },
  ], []);

  return (
<<<<<<< HEAD
    <PageShell
      title="Finance Dashboard"
      subtitle="CFO Command Center"
      icon={() => <Wallet className="w-5 h-5" style={{ color: CSS.accent }} />}
      onCreate={() => navigateTo('invoices')}
      createLabel="Quick Create Invoice"
    >
      <div className="space-y-6">
=======
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <Wallet className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Finance Dashboard</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>CFO Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Calendar className="w-4 h-4" />
              {today}
            </Badge>
            <Button
              onClick={() => navigateTo('invoices')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Plus className="w-4 h-4" />
              Quick Create Invoice
            </Button>
          </div>
        </div>

>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <KpiWidget
                key={stat.label}
<<<<<<< HEAD
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={isPositive ? 'up' : 'down'}
                trendValue={`${Math.abs(stat.change)}%`}
              />
=======
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200',
                  stat.severity === 'critical'
                    ? (isDark ? 'bg-red-500/[0.04] border-red-500/20 hover:bg-red-500/[0.07]' : 'bg-red-50 border-red-200 hover:bg-red-100')
                    : ('bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </span>
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-medium',
                    isPositive ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                  {stat.changeLabel}
                </p>
              </motion.div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            );
          })}
        </div>

<<<<<<< HEAD
        {/* Top 5 Overdue Invoices Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Top 5 Overdue Invoices</span>
=======
        {/* Charts Row — Revenue Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Monthly Revenue Trend
                </span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last 7 months</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {revenueMonthly.map((entry, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                    {formatINR(entry.revenue)}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', 'bg-[var(--app-success)]')}
                  />
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>
                    {months[j]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Receivable Aging */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Receivable Aging
                </span>
              </div>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
                {formatINR(receivableAging.reduce((s, b) => s + b.value, 0))}
              </Badge>
            </div>
            <div className="flex items-end gap-3 h-32">
              {receivableAging.map((bucket, j) => {
                const maxBucket = Math.max(...receivableAging.map((b) => b.value), 1);
                const barColor = j === 0 ? ('bg-[var(--app-success)]')
                  : j === 1 ? ('bg-[var(--app-warning)]')
                  : j === 2 ? (isDark ? 'bg-orange-500/30' : 'bg-orange-400')
                  : (isDark ? 'bg-red-500/30' : 'bg-red-400');
                return (
                  <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                      {formatINR(bucket.value)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(bucket.value / maxBucket) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('w-full rounded-t-sm', barColor)}
                    />
                    <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                      {bucket.label}d
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Charts Row — Burn vs Revenue & Margin Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Burn vs Revenue
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-success)]')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', isDark ? 'bg-red-500/50' : 'bg-red-400')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Burn</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {burnVsRevenue.map((entry, j) => {
                const maxVal = Math.max(...burnVsRevenue.map((e) => e.revenue));
                return (
                  <div key={j} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                    <div className="flex gap-0.5 w-full items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.revenue / maxVal) * 100}%` }}
                        transition={{ delay: 0.5 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.burn / maxVal) * 100}%` }}
                        transition={{ delay: 0.55 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-red-500/30' : 'bg-red-400')}
                      />
                    </div>
                    <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Margin Trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Margin Trend
                </span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Net margin %</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {marginTrend.map((entry, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                    {entry.margin.toFixed(1)}%
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.margin / 50) * 100}%` }}
                    transition={{ delay: 0.5 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', isDark ? 'bg-violet-500/30' : 'bg-violet-400')}
                  />
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top 5 Overdue Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-red-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Top 5 Overdue Invoices
              </span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('invoices')}
              className="text-xs gap-1"
              style={{ color: CSS.textSecondary }}
            >
<<<<<<< HEAD
              View All →
            </Button>
          </div>
          <SmartDataTable
            columns={columns}
            data={tableData}
            enableExport
            emptyMessage="No overdue invoices"
            pageSize={5}
          />
        </div>

        {/* Active Alerts */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Active Alerts</span>
=======
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Invoice', 'Client', 'Amount', 'GST', 'Total', 'Due Date', 'Reminders'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topOverdue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={cn('py-app-3xl text-center text-sm', 'text-[var(--app-text-muted)]')}>
                      No overdue invoices
                    </td>
                  </tr>
                ) : (
                  topOverdue.map((inv: Invoice, i) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className={cn(
                        'border-b cursor-pointer transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className="text-sm font-medium text-red-500">{inv.invoiceNo}</span>
                      </td>
                      <td className="py-3 px-3 text-sm">{inv.client}</td>
                      <td className="py-3 px-3 text-sm">{formatINR(inv.amount)}</td>
                      <td className="py-3 px-3 text-sm">{formatINR(inv.gst)}</td>
                      <td className="py-3 px-3 text-sm font-semibold">{formatINR(inv.total)}</td>
                      <td className="py-3 px-3 text-sm">{inv.dueDate}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn(
                          'text-[10px] px-2 py-0.5',
                          'bg-[var(--app-danger-bg)] text-[var(--app-danger)]'
                        )}>
                          {inv.reminders} sent
                        </Badge>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Active Alerts</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
              {financeAlerts.length} alerts
            </Badge>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
          </div>
          <div className="space-y-2">
            {financeAlerts.map((alert: FAlert, i) => {
              const isCritical = alert.severity === 'critical';
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
<<<<<<< HEAD
                  className="flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer"
                  style={{
                    borderColor: isCritical ? 'color-mix(in srgb, var(--app-danger) 20%, transparent)' : CSS.border,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: isCritical ? 'color-mix(in srgb, var(--app-danger) 10%, transparent)' : 'color-mix(in srgb, var(--app-info) 10%, transparent)' }}>
                    {isCritical ? <CircleAlert className="w-4 h-4" style={{ color: CSS.danger }} /> : <AlertCircle className="w-4 h-4" style={{ color: CSS.info }} />}
=======
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-[var(--app-radius-lg)] border transition-colors cursor-pointer',
                    'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <AlertIcon className={cn('w-4 h-4', config.color)} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>{alert.title}</p>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isCritical ? CSS.danger : alert.severity === 'warning' ? CSS.warning : CSS.info }} />
                    </div>
<<<<<<< HEAD
                    <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{alert.description}</p>
                  </div>
=======
                    <p className={cn('text-xs leading-relaxed', 'text-[var(--app-text-muted)]')}>
                      {alert.description}
                    </p>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', 'text-[var(--app-text-disabled)]')} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                </motion.div>
              );
            })}
          </div>
<<<<<<< HEAD
=======
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickNavItems.map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4 text-left transition-colors duration-200 group',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', 'text-[var(--app-text-muted)]')} />
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform group-hover:translate-x-1',
                  'text-[var(--app-text-disabled)]'
                )} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                {nav.label}
              </p>
            </motion.button>
          ))}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </div>
      </div>
    </PageShell>
  );
}
