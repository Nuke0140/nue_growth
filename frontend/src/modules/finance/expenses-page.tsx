'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Filter, IndianRupee, Upload } from 'lucide-react';
import { expenses } from '@/modules/finance/data/mock-data';
import type { Expense } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { FilterBar } from '@/components/shared/filter-bar';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  ads: { label: 'Ads', color: 'violet' },
  payroll: { label: 'Payroll', color: 'emerald' },
  freelancers: { label: 'Freelancers', color: 'sky' },
  software: { label: 'Software', color: 'amber' },
  office: { label: 'Office', color: 'pink' },
  travel: { label: 'Travel', color: 'orange' },
  'client-delivery': { label: 'Client Delivery', color: 'teal' },
  refunds: { label: 'Refunds', color: 'red' },
  other: { label: 'Other', color: 'slate' },
};

const categoryColors: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-400',
  emerald: 'bg-emerald-500/15 text-emerald-400',
  sky: 'bg-sky-500/15 text-sky-400',
  amber: 'bg-amber-500/15 text-amber-400',
  pink: 'bg-pink-500/15 text-pink-400',
  orange: 'bg-orange-500/15 text-orange-400',
  teal: 'bg-teal-500/15 text-teal-400',
  red: 'bg-red-500/15 text-red-400',
  slate: 'bg-slate-500/15 text-slate-400',
};

export default function ExpensesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');

  const categorySummary = useMemo(() => {
    const summary: Record<string, { total: number; count: number }> = {};
    expenses.forEach((exp: Expense) => {
      if (!summary[exp.category]) summary[exp.category] = { total: 0, count: 0 };
      summary[exp.category].total += exp.total;
      summary[exp.category].count += 1;
    });
    return Object.entries(summary).map(([cat, data]) => ({ category: cat, ...data }));
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp: Expense) => {
      if (categoryFilter !== 'all' && exp.category !== categoryFilter) return false;
      if (approvalFilter !== 'all' && exp.approvalStatus !== approvalFilter) return false;
      return true;
    });
  }, [categoryFilter, approvalFilter]);

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.total, 0), []);
  const anomalyExpenses = useMemo(() => expenses.filter(e => e.isAnomaly), []);
  const pendingCount = useMemo(() => expenses.filter(e => e.approvalStatus === 'pending').length, []);
  const gstTotal = useMemo(() => expenses.reduce((s, e) => s + e.gstAmount, 0), []);

  const categoryFilterItems = useMemo(() => [
    { key: 'all', label: 'All Categories' },
    ...Object.entries(categoryConfig).map(([key, val]) => ({ key, label: val.label })),
  ], []);

  const approvalFilterItems = useMemo(() => [
    { key: 'all', label: 'All Status' },
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ], []);

  const tableData = useMemo(() =>
    filteredExpenses.map((exp: Expense) => ({
      id: exp.id,
      description: exp.description,
      category: exp.category,
      amount: formatINR(exp.amount),
      gstAmount: formatINR(exp.gstAmount),
      total: formatINR(exp.total),
      date: exp.date,
      vendor: exp.vendor,
      receiptUploaded: exp.receiptUploaded,
      approvalStatus: exp.approvalStatus,
      isAnomaly: exp.isAnomaly,
    })),
    [filteredExpenses]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (row) => (
        <p className="text-sm font-medium max-w-[200px] truncate" style={{ color: CSS.text }}>
          {row.description as string}
        </p>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => {
        const cat = categoryConfig[row.category as string];
        return (
          <StatusBadge status={cat?.label ?? (row.category as string)} variant="pill" className="text-[10px] px-2 py-0" />
        );
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      type: 'currency',
    },
    {
      key: 'gstAmount',
      label: 'GST',
      type: 'currency',
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-semibold" style={{ color: CSS.text }}>
          {row.total as string}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      type: 'date',
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      render: (row) => (
        <p className="text-sm max-w-[120px] truncate" style={{ color: CSS.textSecondary }}>
          {row.vendor as string}
        </p>
      ),
    },
    {
      key: 'receiptUploaded',
      label: 'Receipt',
      render: (row) => (
        <Upload
          className="w-4 h-4"
          style={{ color: row.receiptUploaded ? '#34d399' : CSS.textDisabled }}
        />
      ),
    },
    {
      key: 'approvalStatus',
      label: 'Approval',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.approvalStatus as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
    {
      key: 'isAnomaly',
      label: 'Anomaly',
      render: (row) =>
        row.isAnomaly ? <AlertTriangle className="w-4 h-4 text-red-500" /> : null,
    },
  ], []);

  return (
    <PageShell
      title="Expenses"
      subtitle="Expense Control & Tracking"
      icon={() => <Upload className="w-5 h-5" style={{ color: CSS.accent }} />}
      onCreate={() => {}}
      createLabel="Add Expense"
    >
      <div className="space-y-6">
        {/* Category Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categorySummary.map((cat, i) => {
            const config = categoryConfig[cat.category] || categoryConfig.other;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-4 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: CSS.cardBg,
                  border: `1px solid ${CSS.border}`,
                  boxShadow: CSS.shadowCard,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={config.label} variant="pill" className="text-[10px] px-2 py-0" />
                  <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>
                    {cat.count} items
                  </span>
                </div>
                <p className="text-lg font-bold" style={{ color: CSS.text }}>{formatINR(cat.total)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Expenses" value={formatINR(totalExpenses)} icon={IndianRupee} color="success" trend="down" trendValue="-12.3%" />
          <KpiWidget label="Total GST" value={formatINR(gstTotal)} icon={AlertTriangle} color="warning" />
          <KpiWidget label="Pending Approval" value={pendingCount.toString()} icon={Upload} color="info" />
          <KpiWidget label="Anomalies" value={anomalyExpenses.length.toString()} icon={AlertTriangle} color="danger" />
        </div>

        {/* Anomaly Alerts */}
        {anomalyExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-danger) 3%, transparent)', borderColor: 'color-mix(in srgb, var(--app-danger) 12%, transparent)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.danger }}>Anomaly Alerts</span>
            </div>
            <div className="space-y-2">
              {anomalyExpenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>{exp.description}</p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>{exp.vendor} · {exp.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: CSS.danger }}>{formatINR(exp.total)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 min-w-0" style={{ color: CSS.textMuted }}>
            <Filter className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Category</span>
          </div>
          <FilterBar filters={categoryFilterItems} activeFilter={categoryFilter} onFilterChange={setCategoryFilter} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: CSS.textMuted }}>Status</span>
          <FilterBar filters={approvalFilterItems} activeFilter={approvalFilter} onFilterChange={setApprovalFilter} />
        </div>

        {/* Expense Table */}
        <SmartDataTable
          columns={columns}
          data={tableData}
          searchable
          searchPlaceholder="Search expenses..."
          searchKeys={['description', 'vendor', 'category']}
          enableExport
          emptyMessage="No expenses match the selected filters"
          pageSize={10}
        />

        {/* Total Expenses Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CSS.accentLight }}>
                <IndianRupee className="w-5 h-5" style={{ color: CSS.accent }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: CSS.textMuted }}>Total Expenses (All Categories)</p>
                <p className="text-2xl font-bold" style={{ color: CSS.text }}>{formatINR(totalExpenses)}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Base Amount</p>
                <p className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(totalExpenses - gstTotal)}</p>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: CSS.border }} />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>GST</p>
                <p className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(gstTotal)}</p>
              </div>
              <div className="w-px h-8" style={{ backgroundColor: CSS.border }} />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Entries</p>
                <p className="text-sm font-semibold" style={{ color: CSS.text }}>{expenses.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
