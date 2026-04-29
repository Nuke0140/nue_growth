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
    <PageShell
      title="Finance Dashboard"
      subtitle="CFO Command Center"
      icon={() => <Wallet className="w-5 h-5" style={{ color: CSS.accent }} />}
      onCreate={() => navigateTo('invoices')}
      createLabel="Quick Create Invoice"
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <KpiWidget
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={isPositive ? 'up' : 'down'}
                trendValue={`${Math.abs(stat.change)}%`}
              />
            );
          })}
        </div>

        {/* Top 5 Overdue Invoices Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Top 5 Overdue Invoices</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('invoices')}
              className="text-xs gap-1"
              style={{ color: CSS.textSecondary }}
            >
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
                  className="flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer"
                  style={{
                    borderColor: isCritical ? 'color-mix(in srgb, var(--app-danger) 20%, transparent)' : CSS.border,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: isCritical ? 'color-mix(in srgb, var(--app-danger) 10%, transparent)' : 'color-mix(in srgb, var(--app-info) 10%, transparent)' }}>
                    {isCritical ? <CircleAlert className="w-4 h-4" style={{ color: CSS.danger }} /> : <AlertCircle className="w-4 h-4" style={{ color: CSS.info }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>{alert.title}</p>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isCritical ? CSS.danger : alert.severity === 'warning' ? CSS.warning : CSS.info }} />
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: CSS.textSecondary }}>{alert.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
