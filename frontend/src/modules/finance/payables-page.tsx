'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar, HandCoins, Clock, AlertTriangle, CheckCircle2, XCircle,
  Filter, CalendarClock, Zap,
} from 'lucide-react';
import { payables } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Payable } from '@/modules/finance/types';
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

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'paid';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export default function PayablesPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const pendingPayables = useMemo(() => payables.filter((p: Payable) => p.approvalStatus === 'pending'), []);
  const approvedPayables = useMemo(() => payables.filter((p: Payable) => p.approvalStatus === 'approved'), []);
  const urgentPayables = useMemo(() => payables.filter((p: Payable) => p.payoutPriority === 'high' && p.approvalStatus !== 'paid'), []);

  const totalPending = pendingPayables.reduce((s: number, p: Payable) => s + p.amount, 0);
  const totalApproved = approvedPayables.reduce((s: number, p: Payable) => s + p.amount, 0);
  const totalUrgent = urgentPayables.reduce((s: number, p: Payable) => s + p.amount, 0);

  const statusBadge = (status: string) => {
    const configs: Record<string, string> = {
      pending: 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
      approved: 'bg-[var(--app-success-bg)] text-[var(--app-success)]',
      rejected: 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
      paid: 'bg-[var(--app-info-bg)] text-[var(--app-info)]',
      overdue: isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-700',
    };
    return configs[status] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]');
  };

  const priorityBadge = (priority: string) => {
    const configs: Record<string, string> = {
      high: 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
      medium: 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
      low: 'bg-[var(--app-info-bg)] text-[var(--app-info)]',
    };
    return configs[priority] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]');
  };

  const tableData = useMemo(() =>
    filteredPayables.map((p: Payable) => ({
      id: p.id,
      vendor: p.vendor || p.freelancer,
      linkedInvoice: p.linkedInvoice || '—',
      amount: formatINR(p.amount),
      dueDate: p.dueDate,
      isOverdue: new Date(p.dueDate) < new Date() && p.approvalStatus !== 'paid',
      approvalStatus: p.approvalStatus,
      payoutPriority: p.payoutPriority,
      penaltyRisk: p.penaltyRisk,
      category: p.category,
    })),
    [filteredPayables]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'vendor',
      label: 'Vendor / Freelancer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium" style={{ color: CSS.text }}>{row.vendor as string}</p>
          <p className="text-[10px]" style={{ color: CSS.textMuted }}>{row.linkedInvoice as string}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <p className="text-sm font-semibold" style={{ color: CSS.text }}>{row.amount as string}</p>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (row) => (
        <span
          className="text-sm"
          style={{ color: row.isOverdue ? CSS.danger : CSS.text, fontWeight: row.isOverdue ? 500 : 400 }}
        >
          {row.dueDate as string}
        </span>
      ),
    },
    {
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.approvalStatus as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
    {
      key: 'payoutPriority',
      label: 'Priority',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.payoutPriority as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
    {
      key: 'penaltyRisk',
      label: 'Penalty Risk',
      render: (row) =>
        row.penaltyRisk ? (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: CSS.danger }} />
            <span className="text-[10px] font-medium" style={{ color: CSS.danger }}>Yes</span>
          </div>
        ) : (
          <span className="text-[10px]" style={{ color: CSS.textMuted }}>None</span>
        ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <StatusBadge status={row.category as string} variant="pill" className="text-[10px] px-2 py-0" />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        const status = row.approvalStatus as string;
        return (
          <div className="flex items-center gap-1">
            {status === 'pending' && (
              <>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" style={{ color: CSS.success }}>
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" style={{ color: CSS.danger }}>
                  <XCircle className="w-3 h-3" /> Reject
                </Button>
              </>
            )}
            {status === 'approved' && (
              <Button size="sm" className="h-7 px-3 text-[10px] gap-1 rounded-lg" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                <CalendarClock className="w-3 h-3" /> Pay Now
              </Button>
            )}
            {status === 'paid' && (
              <StatusBadge status="completed" variant="pill" className="text-[10px] px-2 py-0">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Completed
              </StatusBadge>
            )}
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <HandCoins className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Payables</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Vendor Payout Workspace</p>
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
            <Button className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
              <CalendarClock className="w-4 h-4" />
              Schedule Payout
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-app-xl cursor-pointer transition-colors duration-200',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  {card.label}
                </span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('w-4 h-4', card.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                {card.count} items
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Status:</span>
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-[var(--app-radius-lg)] transition-colors',
                  statusFilter === f.value
                    ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                    : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className={cn('w-px h-5', 'bg-[var(--app-hover-bg)]')} />
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Priority:</span>
            {priorityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setPriorityFilter(f.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-[var(--app-radius-lg)] transition-colors',
                  priorityFilter === f.value
                    ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                    : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payables Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Vendor / Freelancer', 'Amount', 'Due Date', 'Status', 'Priority', 'Penalty Risk', 'Category', 'Actions'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayables.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={cn('py-app-3xl text-center text-sm', 'text-[var(--app-text-muted)]')}>
                      No payables match the selected filters
                    </td>
                  </tr>
                ) : (
                  filteredPayables.map((p: Payable, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className={cn(
                        'border-b cursor-pointer transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                      )}
                    >
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium">{p.vendor || p.freelancer}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {p.linkedInvoice || '—'}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-semibold">{formatINR(p.amount)}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'text-sm',
                          new Date(p.dueDate) < new Date() && p.approvalStatus !== 'paid' ? 'text-red-500 font-medium' : ''
                        )}>
                          {p.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', statusBadge(p.approvalStatus))}>
                          {p.approvalStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', priorityBadge(p.payoutPriority))}>
                          {p.payoutPriority}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {p.penaltyRisk ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] text-red-500 font-medium">Yes</span>
                          </div>
                        ) : (
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>None</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                          {p.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {p.approvalStatus === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className={cn('h-8  px-2 text-[10px] gap-1', isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50')}>
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button variant="ghost" size="sm" className={cn('h-8  px-2 text-[10px] gap-1', isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50')}>
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {p.approvalStatus === 'approved' && (
                            <Button className={cn('h-8  px-3 text-[10px] gap-1 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                              <CalendarClock className="w-4 h-4" />
                              Pay Now
                            </Button>
                          )}
                          {p.approvalStatus === 'paid' && (
                            <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', 'bg-[var(--app-info-bg)] text-[var(--app-info)]')}>
                              <CheckCircle2 className="w-4 h-4 mr-0.5" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
