'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, FileText, Plus, Filter, Send, Eye, RefreshCw, Ban,
  ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle2,
  Repeat, IndianRupee, MoreHorizontal, Mail, Download, Trash2
} from 'lucide-react';
import { invoices } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Invoice } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type InvoiceStatus = 'all' | 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

const statusTabs: { label: string; value: InvoiceStatus; count?: number }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Viewed', value: 'viewed' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];

// ── Line item column definitions for SmartDataTable ──
const lineItemColumns: DataTableColumnDef[] = [
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (row) => <span style={{ color: CSS.text }}>{row.description as string}</span>,
  },
  {
    key: 'hsnSac',
    label: 'HSN/SAC',
    sortable: true,
    render: (row) => <span className="font-mono text-xs" style={{ color: CSS.textSecondary }}>{row.hsnSac as string}</span>,
  },
  {
    key: 'quantity',
    label: 'Qty',
    sortable: true,
    render: (row) => <span style={{ color: CSS.text }}>{row.quantity as number}</span>,
  },
  {
    key: 'rate',
    label: 'Rate',
    sortable: true,
    render: (row) => <span style={{ color: CSS.text }}>{formatINR(row.rate as number)}</span>,
  },
  {
    key: 'gstRate',
    label: 'GST',
    sortable: true,
    render: (row) => <span style={{ color: CSS.text }}>{row.gstRate as number}%</span>,
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (row) => <span className="font-semibold" style={{ color: CSS.text }}>{formatINR(row.amount as number)}</span>,
  },
];

export default function InvoicesPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [activeTab, setActiveTab] = useState<InvoiceStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const counts = useMemo(() => ({
    all: invoices.length,
    draft: invoices.filter((i: Invoice) => i.status === 'draft').length,
    sent: invoices.filter((i: Invoice) => i.status === 'sent').length,
    viewed: invoices.filter((i: Invoice) => i.status === 'viewed').length,
    paid: invoices.filter((i: Invoice) => i.status === 'paid').length,
    overdue: invoices.filter((i: Invoice) => i.status === 'overdue').length,
  }), []);

  const filteredInvoices = useMemo(() =>
    activeTab === 'all' ? invoices : invoices.filter((inv: Invoice) => inv.status === activeTab),
    [activeTab]
  );

  const totalFiltered = useMemo(() =>
    filteredInvoices.reduce((s: number, inv: Invoice) => s + inv.total, 0),
    [filteredInvoices]
  );

<<<<<<< HEAD
=======
  const statusConfig = (status: string): { bg: string; dot: string } => {
    const configs: Record<string, { bg: string; dot: string }> = {
      draft: { bg: 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]', dot: 'bg-gray-400' },
      sent: { bg: 'bg-[var(--app-info-bg)] text-[var(--app-info)]', dot: 'bg-sky-400' },
      viewed: { bg: 'bg-[var(--app-purple-light)] text-[var(--app-purple)]', dot: 'bg-violet-400' },
      paid: { bg: 'bg-[var(--app-success-bg)] text-[var(--app-success)]', dot: 'bg-emerald-400' },
      overdue: { bg: 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]', dot: 'bg-red-500' },
      cancelled: { bg: 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]', dot: 'bg-gray-300' },
      'write-off': { bg: isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    };
    return configs[status] || configs.draft;
  };

>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
  const getDaysInfo = (inv: Invoice) => {
    const due = new Date(inv.dueDate);
    const now = new Date();
    const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (inv.status === 'paid') return { label: `Paid ${inv.paidDate}`, color: 'text-emerald-500' };
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, color: 'text-red-500' };
    if (diffDays <= 7) return { label: `Due in ${diffDays}d`, color: 'text-amber-500' };
    return { label: `Due in ${diffDays}d`, color: '' };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: CSS.hoverBg }}
            >
              <FileText className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Invoices</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
=======
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <FileText className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Invoices</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                {filteredInvoices.length} invoices · {formatINR(totalFiltered)} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-xs font-medium gap-1.5"
              style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
            >
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
            <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors">
=======
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Calendar className="w-4 h-4" />
              {today}
            </Badge>
            <Button className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[var(--app-radius-lg)] whitespace-nowrap transition-colors',
                activeTab === tab.value
<<<<<<< HEAD
                  ? 'text-[var(--app-text)]'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
=======
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              )}
              style={activeTab === tab.value ? { backgroundColor: CSS.activeBg } : undefined}
            >
              {tab.label}
<<<<<<< HEAD
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 min-w-[18px] text-center"
                style={{
                  backgroundColor: activeTab === tab.value ? CSS.activeBg : CSS.hoverBg,
                  color: activeTab === tab.value ? CSS.textSecondary : CSS.textMuted,
                }}
              >
=======
              <Badge variant="secondary" className={cn(
                'text-[9px] px-1.5 py-0 min-w-[18px] text-center',
                activeTab === tab.value
                  ? (isDark ? 'bg-white/15 text-white/60' : 'bg-black/15 text-black/60')
                  : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
              )}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                {counts[tab.value]}
              </Badge>
            </button>
          ))}
        </div>

        {/* Invoice Cards */}
        <div className="space-y-3">
          {filteredInvoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
<<<<<<< HEAD
              className="rounded-2xl p-12 text-center"
              style={{
                backgroundColor: CSS.cardBg,
                border: `1px solid ${CSS.border}`,
              }}
            >
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: CSS.textDisabled }} />
              <p className="text-sm" style={{ color: CSS.textMuted }}>No invoices found for this status</p>
=======
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-app-4xl text-center',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <FileText className={cn('w-10 h-10 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
              <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No invoices found for this status</p>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            </motion.div>
          ) : (
            filteredInvoices.map((inv: Invoice, i) => {
              const daysInfo = getDaysInfo(inv);
              const isExpanded = expandedId === inv.id;

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
<<<<<<< HEAD
                  className="rounded-2xl border overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: CSS.cardBg,
                    borderColor: CSS.border,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = CSS.cardBgHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = CSS.cardBg;
                  }}
=======
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border overflow-hidden transition-colors duration-200',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                  )}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                >
                  {/* Main Card Row */}
                  <div
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                  >
                    {/* Left — Invoice No & Status */}
                    <div className="flex items-center gap-3 min-w-0 sm:w-[200px]">
                      <div className="flex items-center gap-2 min-w-0">
<<<<<<< HEAD
                        <FileText className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
=======
                        <FileText className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate" style={{ color: CSS.text }}>{inv.invoiceNo}</p>
                            {inv.isRecurring && (
<<<<<<< HEAD
                              <Badge
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0 shrink-0"
                                style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa' }}
                              >
=======
                              <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 shrink-0', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                <Repeat className="w-2.5 h-2.5 mr-0.5" />
                                {inv.recurringCycle}
                              </Badge>
                            )}
                          </div>
<<<<<<< HEAD
                          <p className="text-[10px] truncate" style={{ color: CSS.textMuted }}>{inv.client} · {inv.project}</p>
=======
                          <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>{inv.client} · {inv.project}</p>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                        </div>
                      </div>
                    </div>

                    {/* Center — Amounts */}
                    <div className="flex items-center gap-4 sm:flex-1 sm:justify-center">
                      <div className="text-right">
<<<<<<< HEAD
                        <p className="text-[10px]" style={{ color: CSS.textMuted }}>Amount</p>
                        <p className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(inv.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px]" style={{ color: CSS.textMuted }}>GST</p>
                        <p className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(inv.gst)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px]" style={{ color: CSS.textMuted }}>Total</p>
                        <p className="text-sm font-bold" style={{ color: CSS.text }}>{formatINR(inv.total)}</p>
=======
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Amount</p>
                        <p className="text-sm font-medium">{formatINR(inv.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>GST</p>
                        <p className="text-sm font-medium">{formatINR(inv.gst)}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Total</p>
                        <p className="text-sm font-bold">{formatINR(inv.total)}</p>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                      </div>
                    </div>

                    {/* Right — Status & Dates */}
                    <div className="flex items-center gap-3 sm:w-[240px] sm:justify-end">
                      <StatusBadge status={inv.status} variant="pill" className="text-[10px] px-2 py-0.5" />
                      <div className="text-right">
                        <p className={cn('text-[10px]', daysInfo.color)}>{daysInfo.label}</p>
<<<<<<< HEAD
                        <p className="text-[10px]" style={{ color: CSS.textDisabled }}>
=======
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                          Issued: {inv.issuedDate}
                        </p>
                      </div>
                      {isExpanded ? (
<<<<<<< HEAD
                        <ChevronUp className="w-4 h-4 shrink-0" style={{ color: CSS.textDisabled }} />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0" style={{ color: CSS.textDisabled }} />
=======
                        <ChevronUp className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
                      ) : (
                        <ChevronDown className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
<<<<<<< HEAD
                      style={{ borderTop: `1px solid ${CSS.border}` }}
                      className="px-4 pb-4"
=======
                      className={cn('border-t px-4 pb-4', 'border-[var(--app-border)]')}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    >
                      <div className="pt-4 space-y-4">
                        {/* Line Items — SmartDataTable */}
                        <div>
<<<<<<< HEAD
                          <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>
                            Line Items ({inv.items.length})
                          </p>
                          <SmartDataTable
                            data={inv.items as unknown as Record<string, unknown>[]}
                            columns={lineItemColumns}
                            pageSize={10}
                          />
=======
                          <p className={cn('text-[11px] font-medium uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                            Line Items ({inv.items.length})
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className={cn('border-b', 'border-[var(--app-border-light)]')}>
                                  {['Description', 'HSN/SAC', 'Qty', 'Rate', 'GST', 'Amount'].map(h => (
                                    <th key={h} className={cn('text-left text-[10px] font-medium uppercase tracking-wider pb-2 px-2', 'text-[var(--app-text-muted)]')}>
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {inv.items.map((item, j) => (
                                  <tr key={j} className={cn('border-b', 'border-[var(--app-border-strong)]')}>
                                    <td className="py-2 px-2 text-xs">{item.description}</td>
                                    <td className="py-2 px-2 text-xs font-mono">{item.hsnSac}</td>
                                    <td className="py-2 px-2 text-xs">{item.quantity}</td>
                                    <td className="py-2 px-2 text-xs">{formatINR(item.rate)}</td>
                                    <td className="py-2 px-2 text-xs">{item.gstRate}%</td>
                                    <td className="py-2 px-2 text-xs font-semibold">{formatINR(item.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                        </div>

                        {/* Timeline & Meta */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                            <Clock className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                            <span className="text-xs" style={{ color: CSS.textSecondary }}>
=======
                            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                              Due: <span className="font-medium">{inv.dueDate}</span>
                            </span>
                          </div>
                          {inv.paidDate && (
                            <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
=======
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                Paid: <span className="font-medium">{inv.paidDate}</span>
                              </span>
                            </div>
                          )}
                          {inv.paymentMethod && (
                            <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                              <IndianRupee className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
=======
                              <IndianRupee className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                Via: <span className="font-medium">{inv.paymentMethod}</span>
                              </span>
                            </div>
                          )}
                          {inv.lastViewedDate && (
                            <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                              <Eye className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
=======
                              <Eye className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                Viewed: <span className="font-medium">{inv.lastViewedDate}</span>
                              </span>
                            </div>
                          )}
                          {inv.reminders > 0 && (
                            <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                              <Send className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
=======
                              <Send className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                {inv.reminders} reminders sent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
<<<<<<< HEAD
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
                            <Download className="w-3.5 h-3.5" />
=======
                          <Button variant="ghost" size="sm" className={cn(
                            'h-8 px-3 text-[11px] gap-1.5',
                            isDark ? 'text-white/50 hover:text-white/70 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/70 hover:bg-black/[0.06]'
                          )}>
                            <Download className="w-4 h-4" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                            View PDF
                          </Button>
                          {inv.status !== 'paid' && (
                            <>
<<<<<<< HEAD
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-emerald-500 hover:bg-emerald-500/10">
                                <Send className="w-3.5 h-3.5" />
                                Send Reminder
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-sky-500 hover:bg-sky-500/10">
                                <Mail className="w-3.5 h-3.5" />
=======
                              <Button variant="ghost" size="sm" className={cn(
                                'h-8 px-3 text-[11px] gap-1.5 text-emerald-500',
                                isDark ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'
                              )}>
                                <Send className="w-4 h-4" />
                                Send Reminder
                              </Button>
                              <Button variant="ghost" size="sm" className={cn(
                                'h-8 px-3 text-[11px] gap-1.5 text-sky-500',
                                isDark ? 'hover:bg-sky-500/10' : 'hover:bg-sky-50'
                              )}>
                                <Mail className="w-4 h-4" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                                Resend
                              </Button>
                            </>
                          )}
                          {(inv.status === 'overdue' || inv.status === 'sent') && (
<<<<<<< HEAD
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-red-500 hover:bg-red-500/10">
                              <Ban className="w-3.5 h-3.5" />
=======
                            <Button variant="ghost" size="sm" className={cn(
                              'h-8 px-3 text-[11px] gap-1.5 text-red-500',
                              isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                            )}>
                              <Ban className="w-4 h-4" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                              Write-off
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Payment Timeline Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
<<<<<<< HEAD
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: CSS.cardBg,
            borderColor: CSS.border,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: CSS.textSecondary }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Payment Timeline</span>
=======
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Payment Timeline</span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {filteredInvoices.map((inv: Invoice, i) => {
              const due = new Date(inv.dueDate);
              const issued = new Date(inv.issuedDate);
              const totalDays = Math.max(Math.floor((due.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24)), 1);
              const elapsed = Math.min(Math.floor((new Date().getTime() - issued.getTime()) / (1000 * 60 * 60 * 24)), totalDays);
              const progress = Math.min((elapsed / totalDays) * 100, 100);
              const isPaid = inv.status === 'paid';
              const isOverdue = inv.status === 'overdue';

              return (
                <div key={inv.id} className="min-w-[140px]">
                  <div className="flex items-center justify-between mb-1">
<<<<<<< HEAD
                    <span className="text-[10px] font-medium truncate" style={{ color: CSS.textSecondary }}>
                      {inv.invoiceNo.slice(-8)}
                    </span>
                    <span className={cn(
                      'text-[9px]',
                      isPaid ? 'text-emerald-500' : isOverdue ? 'text-red-500' : ''
                    )} style={!isPaid && !isOverdue ? { color: CSS.textMuted } : undefined}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
=======
                    <span className={cn('text-[10px] font-medium truncate', 'text-[var(--app-text-muted)]')}>
                      {inv.invoiceNo.slice(-8)}
                    </span>
                    <span className={cn('text-[9px]', isPaid ? 'text-emerald-500' : isOverdue ? 'text-red-500' : 'text-[var(--app-text-muted)]')}>
                      {inv.status}
                    </span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${isPaid ? 100 : progress}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className={cn(
                        'h-full rounded-full',
                        isPaid ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-sky-500'
                      )}
                    />
                  </div>
<<<<<<< HEAD
                  <p className="text-[9px] mt-1" style={{ color: CSS.textDisabled }}>
=======
                  <p className={cn('text-[9px] mt-1', 'text-[var(--app-text-disabled)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    {inv.dueDate}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
