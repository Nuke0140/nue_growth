'use client';

import { formatINR } from './utils';

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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: CSS.hoverBg }}
            >
              <FileText className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Invoices</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
                {filteredInvoices.length} invoices · {formatINR(totalFiltered)} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-xs font-medium gap-1.5"
              style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
            >
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
            <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors">
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
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors',
                activeTab === tab.value
                  ? 'text-[var(--app-text)]'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
              )}
              style={activeTab === tab.value ? { backgroundColor: CSS.activeBg } : undefined}
            >
              {tab.label}
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 min-w-[18px] text-center"
                style={{
                  backgroundColor: activeTab === tab.value ? CSS.activeBg : CSS.hoverBg,
                  color: activeTab === tab.value ? CSS.textSecondary : CSS.textMuted,
                }}
              >
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
              className="rounded-2xl p-12 text-center"
              style={{
                backgroundColor: CSS.cardBg,
                border: `1px solid ${CSS.border}`,
              }}
            >
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: CSS.textDisabled }} />
              <p className="text-sm" style={{ color: CSS.textMuted }}>No invoices found for this status</p>
            </motion.div>
          ) : (
            filteredInvoices.map((inv: Invoice, i) => {
              const daysInfo = getDaysInfo(inv);
              const isExpanded = expandedId === inv.id;

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                >
                  {/* Main Card Row */}
                  <div
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                  >
                    {/* Left — Invoice No & Status */}
                    <div className="flex items-center gap-3 min-w-0 sm:w-[200px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate" style={{ color: CSS.text }}>{inv.invoiceNo}</p>
                            {inv.isRecurring && (
                              <Badge
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0 shrink-0"
                                style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa' }}
                              >
                                <Repeat className="w-2.5 h-2.5 mr-0.5" />
                                {inv.recurringCycle}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] truncate" style={{ color: CSS.textMuted }}>{inv.client} · {inv.project}</p>
                        </div>
                      </div>
                    </div>

                    {/* Center — Amounts */}
                    <div className="flex items-center gap-4 sm:flex-1 sm:justify-center">
                      <div className="text-right">
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
                      </div>
                    </div>

                    {/* Right — Status & Dates */}
                    <div className="flex items-center gap-3 sm:w-[240px] sm:justify-end">
                      <StatusBadge status={inv.status} variant="pill" className="text-[10px] px-2 py-0.5" />
                      <div className="text-right">
                        <p className={cn('text-[10px]', daysInfo.color)}>{daysInfo.label}</p>
                        <p className="text-[10px]" style={{ color: CSS.textDisabled }}>
                          Issued: {inv.issuedDate}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 shrink-0" style={{ color: CSS.textDisabled }} />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0" style={{ color: CSS.textDisabled }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      style={{ borderTop: `1px solid ${CSS.border}` }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Line Items — SmartDataTable */}
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>
                            Line Items ({inv.items.length})
                          </p>
                          <SmartDataTable
                            data={inv.items as unknown as Record<string, unknown>[]}
                            columns={lineItemColumns}
                            pageSize={10}
                          />
                        </div>

                        {/* Timeline & Meta */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                            <span className="text-xs" style={{ color: CSS.textSecondary }}>
                              Due: <span className="font-medium">{inv.dueDate}</span>
                            </span>
                          </div>
                          {inv.paidDate && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
                                Paid: <span className="font-medium">{inv.paidDate}</span>
                              </span>
                            </div>
                          )}
                          {inv.paymentMethod && (
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
                                Via: <span className="font-medium">{inv.paymentMethod}</span>
                              </span>
                            </div>
                          )}
                          {inv.lastViewedDate && (
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
                                Viewed: <span className="font-medium">{inv.lastViewedDate}</span>
                              </span>
                            </div>
                          )}
                          {(inv.reminders ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Send className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                              <span className="text-xs" style={{ color: CSS.textSecondary }}>
                                {inv.reminders ?? 0} reminders sent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
                            <Download className="w-3.5 h-3.5" />
                            View PDF
                          </Button>
                          {inv.status !== 'paid' && (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-emerald-500 hover:bg-emerald-500/10">
                                <Send className="w-3.5 h-3.5" />
                                Send Reminder
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-sky-500 hover:bg-sky-500/10">
                                <Mail className="w-3.5 h-3.5" />
                                Resend
                              </Button>
                            </>
                          )}
                          {(inv.status === 'overdue' || inv.status === 'sent') && (
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-[11px] gap-1.5 text-red-500 hover:bg-red-500/10">
                              <Ban className="w-3.5 h-3.5" />
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.15 }}
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: CSS.cardBg,
            borderColor: CSS.border,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: CSS.textSecondary }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Payment Timeline</span>
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${isPaid ? 100 : progress}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.15 }}
                      className={cn(
                        'h-full rounded-full',
                        isPaid ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : 'bg-sky-500'
                      )}
                    />
                  </div>
                  <p className="text-[9px] mt-1" style={{ color: CSS.textDisabled }}>
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
