'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, HandCoins, Clock, AlertTriangle, CheckCircle2, XCircle,
  ChevronRight, ArrowUpRight, Filter, Shield, CircleDot,
  CalendarClock, Zap
} from 'lucide-react';
import { payables } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Payable } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'paid';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export default function PayablesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

  const summaryCards = useMemo(() => [
    { label: 'Total Pending', value: formatINR(totalPending), icon: Clock, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', count: pendingPayables.length },
    { label: 'Approved', value: formatINR(totalApproved), icon: CheckCircle2, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', count: approvedPayables.length },
    { label: 'Urgent', value: formatINR(totalUrgent), icon: Zap, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50', count: urgentPayables.length },
  ], [isDark, totalPending, totalApproved, totalUrgent, pendingPayables.length, approvedPayables.length, urgentPayables.length]);

  const filteredPayables = useMemo(() =>
    payables.filter((p: Payable) => {
      if (statusFilter !== 'all' && p.approvalStatus !== statusFilter) return false;
      if (priorityFilter !== 'all' && p.payoutPriority !== priorityFilter) return false;
      return true;
    }),
    [statusFilter, priorityFilter]
  );

  const statusBadge = (status: string) => {
    const configs: Record<string, string> = {
      pending: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600',
      approved: isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
      rejected: isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
      paid: isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600',
      overdue: isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-700',
    };
    return configs[status] || (isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40');
  };

  const priorityBadge = (priority: string) => {
    const configs: Record<string, string> = {
      high: isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
      medium: isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600',
      low: isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600',
    };
    return configs[priority] || (isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40');
  };

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Paid', value: 'paid' },
  ];

  const priorityFilters: { label: string; value: PriorityFilter }[] = [
    { label: 'All Priority', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}>
              <HandCoins className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Payables</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Vendor Payout Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
            <Button className={cn(
              'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
              isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
            )}>
              <CalendarClock className="w-4 h-4" />
              Schedule Payout
            </Button>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-5 cursor-pointer transition-all duration-200',
                isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  {card.label}
                </span>
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('w-4 h-4', card.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
                {card.count} items
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Status:</span>
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors',
                  statusFilter === f.value
                    ? (isDark ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80')
                    : (isDark ? 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]' : 'text-black/30 hover:text-black/50 hover:bg-black/[0.04]')
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className={cn('w-px h-5', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Priority:</span>
            {priorityFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setPriorityFilter(f.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors',
                  priorityFilter === f.value
                    ? (isDark ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80')
                    : (isDark ? 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]' : 'text-black/30 hover:text-black/50 hover:bg-black/[0.04]')
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
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  {['Vendor / Freelancer', 'Amount', 'Due Date', 'Status', 'Priority', 'Penalty Risk', 'Category', 'Actions'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', isDark ? 'text-white/40' : 'text-black/40')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayables.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={cn('py-8 text-center text-sm', isDark ? 'text-white/30' : 'text-black/30')}>
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
                        isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                      )}
                    >
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium">{p.vendor || p.freelancer}</p>
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
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
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[10px] text-red-500 font-medium">Yes</span>
                          </div>
                        ) : (
                          <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>None</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                          {p.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {p.approvalStatus === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className={cn('h-7 px-2 text-[10px] gap-1', isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50')}>
                                <CheckCircle2 className="w-3 h-3" />
                                Approve
                              </Button>
                              <Button variant="ghost" size="sm" className={cn('h-7 px-2 text-[10px] gap-1', isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50')}>
                                <XCircle className="w-3 h-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          {p.approvalStatus === 'approved' && (
                            <Button className={cn('h-7 px-3 text-[10px] gap-1 rounded-lg', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                              <CalendarClock className="w-3 h-3" />
                              Pay Now
                            </Button>
                          )}
                          {p.approvalStatus === 'paid' && (
                            <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600')}>
                              <CheckCircle2 className="w-3 h-3 mr-0.5" />
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
    </div>
  );
}
