'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plus, Receipt, AlertTriangle, Filter, FileText, IndianRupee,
  Upload, CheckCircle2, Clock, XCircle, TrendingDown, Eye, Search,
} from 'lucide-react';
import { expenses } from '@/modules/finance/data/mock-data';
import type { Expense } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const categoryConfig: Record<string, { label: string; color: string; bgDark: string; bgLight: string }> = {
  ads: { label: 'Ads', color: 'text-violet-400', bgDark: 'bg-violet-500/15', bgLight: 'bg-violet-50 text-violet-600' },
  payroll: { label: 'Payroll', color: 'text-emerald-400', bgDark: 'bg-emerald-500/15', bgLight: 'bg-emerald-50 text-emerald-600' },
  freelancers: { label: 'Freelancers', color: 'text-sky-400', bgDark: 'bg-sky-500/15', bgLight: 'bg-sky-50 text-sky-600' },
  software: { label: 'Software', color: 'text-amber-400', bgDark: 'bg-amber-500/15', bgLight: 'bg-amber-50 text-amber-600' },
  office: { label: 'Office', color: 'text-pink-400', bgDark: 'bg-pink-500/15', bgLight: 'bg-pink-50 text-pink-600' },
  travel: { label: 'Travel', color: 'text-orange-400', bgDark: 'bg-orange-500/15', bgLight: 'bg-orange-50 text-orange-600' },
  'client-delivery': { label: 'Client Delivery', color: 'text-teal-400', bgDark: 'bg-teal-500/15', bgLight: 'bg-teal-50 text-teal-600' },
  refunds: { label: 'Refunds', color: 'text-red-400', bgDark: 'bg-red-500/15', bgLight: 'bg-red-50 text-red-600' },
  other: { label: 'Other', color: 'text-slate-400', bgDark: 'bg-slate-500/15', bgLight: 'bg-slate-50 text-slate-600' },
};

const approvalConfig: Record<string, { color: string; bgDark: string; bgLight: string }> = {
  approved: { color: 'text-emerald-400', bgDark: 'bg-emerald-500/15', bgLight: 'bg-emerald-50 text-emerald-600' },
  pending: { color: 'text-amber-400', bgDark: 'bg-amber-500/15', bgLight: 'bg-amber-50 text-amber-600' },
  rejected: { color: 'text-red-400', bgDark: 'bg-red-500/15', bgLight: 'bg-red-50 text-red-600' },
};

export default function ExpensesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Receipt className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Expenses</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Expense Control & Tracking</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>

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
                className={cn('rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? config.bgDark : config.bgLight)}>
                    {config.label}
                  </Badge>
                  <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{cat.count} items</span>
                </div>
                <p className="text-lg font-bold">{formatINR(cat.total)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Expenses', value: formatINR(totalExpenses), icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
            { label: 'Total GST', value: formatINR(gstTotal), icon: FileText, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
            { label: 'Pending Approval', value: pendingCount.toString(), icon: Clock, color: 'text-orange-400', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50' },
            { label: 'Anomalies', value: anomalyExpenses.length.toString(), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4 transition-colors duration-200', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Anomaly Alerts */}
        {anomalyExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', isDark ? 'bg-red-500/[0.03] border-red-500/[0.12]' : 'bg-red-50/50 border-red-200/60')}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-500">Anomaly Alerts</span>
              <Badge variant="secondary" className="text-[10px] bg-red-500/15 text-red-400">{anomalyExpenses.length} detected</Badge>
            </div>
            <div className="space-y-2">
              {anomalyExpenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
                  className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', isDark ? 'border-red-500/10 bg-red-500/[0.02]' : 'border-red-200/40 bg-white/60')}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{exp.description}</p>
                      <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{exp.vendor} • {exp.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-red-500">{formatINR(exp.total)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn('flex items-center gap-2', 'text-[var(--app-text-muted)]')}>
            <Filter className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCategoryFilter('all')} className={cn('px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors', categoryFilter === 'all' ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]') : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] hover:bg-[var(--app-active-bg)]'))}>
              All Categories
            </button>
            {Object.entries(categoryConfig).map(([key, val]) => (
              <button key={key} onClick={() => setCategoryFilter(key)} className={cn('px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors', categoryFilter === key ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]') : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] hover:bg-[var(--app-active-bg)]'))}>
                {val.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-4">
            {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
              <button key={status} onClick={() => setApprovalFilter(status)} className={cn('px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors capitalize', approvalFilter === status ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]') : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] hover:bg-[var(--app-active-bg)]'))}>
                {status === 'all' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Expense Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Expense Ledger</span>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                {filteredExpenses.length} entries
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className={cn('sticky top-0 z-10', isDark ? 'bg-[#1a1a1a]' : 'bg-white')}>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Description', 'Category', 'Amount', 'GST', 'Total', 'Date', 'Vendor', 'Receipt', 'Approval', 'Anomaly'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3 whitespace-nowrap', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp: Expense, i) => {
                  const catConf = categoryConfig[exp.category];
                  const apprConf = approvalConfig[exp.approvalStatus];
                  return (
                    <motion.tr
                      key={exp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 + i * 0.03 }}
                      className={cn('border-b transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]', exp.isAnomaly && (isDark ? 'bg-red-500/[0.03]' : 'bg-red-50/30'))}
                    >
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium max-w-[200px] truncate">{exp.description}</p>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? catConf.bgDark : catConf.bgLight)}>
                          {catConf.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{formatINR(exp.amount)}</td>
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{formatINR(exp.gstAmount)}</td>
                      <td className="py-3 px-3 text-sm font-semibold whitespace-nowrap">{formatINR(exp.total)}</td>
                      <td className="py-3 px-3 text-sm whitespace-nowrap">{exp.date}</td>
                      <td className="py-3 px-3">
                        <p className="text-sm max-w-[120px] truncate">{exp.vendor}</p>
                      </td>
                      <td className="py-3 px-3">
                        {exp.receiptUploaded ? (
                          <Upload className={cn('w-4 h-4', 'text-[var(--app-success)]')} />
                        ) : (
                          <Upload className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', isDark ? apprConf.bgDark : apprConf.bgLight)}>
                          {exp.approvalStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {exp.isAnomaly && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Total Expenses Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-success-bg)]')}>
                <IndianRupee className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Total Expenses (All Categories)</p>
                <p className="text-2xl font-bold">{formatINR(totalExpenses)}</p>
              </div>
            </div>
            <div className="flex items-center gap-app-2xl">
              <div className="text-center">
                <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Base Amount</p>
                <p className="text-sm font-semibold">{formatINR(totalExpenses - gstTotal)}</p>
              </div>
              <div className={cn('w-px h-8', 'bg-[var(--app-hover-bg)]')} />
              <div className="text-center">
                <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>GST</p>
                <p className="text-sm font-semibold">{formatINR(gstTotal)}</p>
              </div>
              <div className={cn('w-px h-8', 'bg-[var(--app-hover-bg)]')} />
              <div className="text-center">
                <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Entries</p>
                <p className="text-sm font-semibold">{expenses.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
