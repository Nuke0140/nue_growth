'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
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

export default function InvoicesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <FileText className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Invoices</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                {filteredInvoices.length} invoices · {formatINR(totalFiltered)} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
            <Button className={cn(
              'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
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
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
              )}
            >
              {tab.label}
              <Badge variant="secondary" className={cn(
                'text-[9px] px-1.5 py-0 min-w-[18px] text-center',
                activeTab === tab.value
                  ? (isDark ? 'bg-white/15 text-white/60' : 'bg-black/15 text-black/60')
                  : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
              )}>
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
              className={cn(
                'rounded-2xl border p-12 text-center',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <FileText className={cn('w-10 h-10 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
              <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No invoices found for this status</p>
            </motion.div>
          ) : (
            filteredInvoices.map((inv: Invoice, i) => {
              const sc = statusConfig(inv.status);
              const daysInfo = getDaysInfo(inv);
              const isExpanded = expandedId === inv.id;

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all duration-200',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                  )}
                >
                  {/* Main Card Row */}
                  <div
                    className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                  >
                    {/* Left — Invoice No & Status */}
                    <div className="flex items-center gap-3 min-w-0 sm:w-[200px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate">{inv.invoiceNo}</p>
                            {inv.isRecurring && (
                              <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 shrink-0', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
                                <Repeat className="w-2.5 h-2.5 mr-0.5" />
                                {inv.recurringCycle}
                              </Badge>
                            )}
                          </div>
                          <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>{inv.client} · {inv.project}</p>
                        </div>
                      </div>
                    </div>

                    {/* Center — Amounts */}
                    <div className="flex items-center gap-4 sm:flex-1 sm:justify-center">
                      <div className="text-right">
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
                      </div>
                    </div>

                    {/* Right — Status & Dates */}
                    <div className="flex items-center gap-3 sm:w-[240px] sm:justify-end">
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', sc.bg)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', sc.dot)} />
                        {inv.status}
                      </Badge>
                      <div className="text-right">
                        <p className={cn('text-[10px]', daysInfo.color)}>{daysInfo.label}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          Issued: {inv.issuedDate}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
                      ) : (
                        <ChevronDown className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('border-t px-4 pb-4', 'border-[var(--app-border)]')}
                    >
                      <div className="pt-4 space-y-4">
                        {/* Line Items */}
                        <div>
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
                        </div>

                        {/* Timeline & Meta */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                              Due: <span className="font-medium">{inv.dueDate}</span>
                            </span>
                          </div>
                          {inv.paidDate && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                                Paid: <span className="font-medium">{inv.paidDate}</span>
                              </span>
                            </div>
                          )}
                          {inv.paymentMethod && (
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                                Via: <span className="font-medium">{inv.paymentMethod}</span>
                              </span>
                            </div>
                          )}
                          {inv.lastViewedDate && (
                            <div className="flex items-center gap-1.5">
                              <Eye className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                                Viewed: <span className="font-medium">{inv.lastViewedDate}</span>
                              </span>
                            </div>
                          )}
                          {inv.reminders > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Send className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                                {inv.reminders} reminders sent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="ghost" size="sm" className={cn(
                            'h-8 px-3 text-[11px] gap-1.5',
                            isDark ? 'text-white/50 hover:text-white/70 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/70 hover:bg-black/[0.06]'
                          )}>
                            <Download className="w-3.5 h-3.5" />
                            View PDF
                          </Button>
                          {inv.status !== 'paid' && (
                            <>
                              <Button variant="ghost" size="sm" className={cn(
                                'h-8 px-3 text-[11px] gap-1.5 text-emerald-500',
                                isDark ? 'hover:bg-emerald-500/10' : 'hover:bg-emerald-50'
                              )}>
                                <Send className="w-3.5 h-3.5" />
                                Send Reminder
                              </Button>
                              <Button variant="ghost" size="sm" className={cn(
                                'h-8 px-3 text-[11px] gap-1.5 text-sky-500',
                                isDark ? 'hover:bg-sky-500/10' : 'hover:bg-sky-50'
                              )}>
                                <Mail className="w-3.5 h-3.5" />
                                Resend
                              </Button>
                            </>
                          )}
                          {(inv.status === 'overdue' || inv.status === 'sent') && (
                            <Button variant="ghost" size="sm" className={cn(
                              'h-8 px-3 text-[11px] gap-1.5 text-red-500',
                              isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                            )}>
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Payment Timeline</span>
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
                    <span className={cn('text-[10px] font-medium truncate', 'text-[var(--app-text-muted)]')}>
                      {inv.invoiceNo.slice(-8)}
                    </span>
                    <span className={cn('text-[9px]', isPaid ? 'text-emerald-500' : isOverdue ? 'text-red-500' : 'text-[var(--app-text-muted)]')}>
                      {inv.status}
                    </span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${isPaid ? 100 : progress}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className={cn(
                        'h-full rounded-full',
                        isPaid ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : progress > 80 ? 'bg-amber-500' : (isDark ? 'bg-sky-500/50' : 'bg-sky-400')
                      )}
                    />
                  </div>
                  <p className={cn('text-[9px] mt-1', 'text-[var(--app-text-disabled)]')}>
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
