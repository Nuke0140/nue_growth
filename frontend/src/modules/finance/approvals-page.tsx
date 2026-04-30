'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight, Calendar, Filter,
  MessageSquare, ChevronDown, Shield, CircleDot,
} from 'lucide-react';
import { financeApprovals } from '@/modules/finance/data/mock-data';
import type { FinanceApproval } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000007).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'escalated';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-400', badge: (isDark: boolean) => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]' },
  approved: { icon: CheckCircle, color: 'text-emerald-400', badge: (isDark: boolean) => 'bg-[var(--app-success-bg)] text-[var(--app-success)]' },
  rejected: { icon: XCircle, color: 'text-red-400', badge: (isDark: boolean) => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]' },
  escalated: { icon: AlertTriangle, color: 'text-red-400', badge: (isDark: boolean) => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]' },
};

const priorityConfig = {
  low: { badge: (isDark: boolean) => 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]' },
  medium: { badge: (isDark: boolean) => 'bg-[var(--app-info-bg)] text-[var(--app-info)]' },
  high: { badge: (isDark: boolean) => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]' },
  urgent: { badge: (isDark: boolean) => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]' },
};

const typeConfig: Record<string, string> = {
  budget: 'Budget',
  payout: 'Payout',
  payroll: 'Payroll',
  expense: 'Expense',
  discount: 'Discount',
  refund: 'Refund',
  'write-off': 'Write-off',
};

export default function ApprovalsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const filteredApprovals = useMemo(() => {
    let items = activeTab === 'all' ? [...financeApprovals] : financeApprovals.filter(a => a.status === activeTab);
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    return items;
  }, [activeTab]);

  const pendingCount = financeApprovals.filter(a => a.status === 'pending').length;
  const approvedToday = financeApprovals.filter(a => a.status === 'approved').length;
  const urgentCount = financeApprovals.filter(a => a.priority === 'urgent').length;
  const escalatedCount = financeApprovals.filter(a => a.status === 'escalated').length;

  const tabs: { label: string; value: FilterTab; count: number }[] = [
    { label: 'All', value: 'all', count: financeApprovals.length },
    { label: 'Pending', value: 'pending', count: pendingCount },
    { label: 'Approved', value: 'approved', count: approvedToday },
    { label: 'Rejected', value: 'rejected', count: financeApprovals.filter(a => a.status === 'rejected').length },
    { label: 'Escalated', value: 'escalated', count: escalatedCount },
  ];

  const summaryCards = [
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    { label: 'Approved Today', value: approvedToday, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Urgent', value: urgentCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
    { label: 'Escalated', value: escalatedCount, icon: Shield, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <CheckCircle className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Approvals</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Finance Governance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn('px-3 py-1.5 text-xs font-medium gap-1.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              <Calendar className="w-4 h-4" /> {today}
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{card.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', card.bg)}><card.icon className={cn('w-4 h-4', card.color)} /></div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2 text-xs font-medium rounded-[var(--app-radius-lg)] gap-1.5 whitespace-nowrap transition-colors',
                activeTab === tab.value
                  ? (isDark ? 'bg-white/[0.08] text-white/80' : 'bg-black/[0.08] text-black/80')
                  : (isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.04]')
              )}
            >
              {tab.label}
              <span className={cn(
                'text-[10px] px-1.5 py-0 rounded-full',
                activeTab === tab.value ? (isDark ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60') : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
              )}>{tab.count}</span>
            </Button>
          ))}
        </div>

        {/* Approval Cards */}
        <div className="space-y-3">
          {filteredApprovals.map((approval, i) => {
            const sConfig = statusConfig[approval.status];
            const pConfig = priorityConfig[approval.priority];
            const StatusIcon = sConfig.icon;
            const isExpanded = expandedId === approval.id;

            return (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 transition-colors duration-200',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]',
                  approval.priority === 'urgent' && (isDark ? 'border-red-500/20' : 'border-red-200')
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0 mt-0.5', 'bg-[var(--app-hover-bg)]')}>
                      <StatusIcon className={cn('w-4 h-4', sConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{approval.title}</span>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                          {typeConfig[approval.type] || approval.type}
                        </Badge>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', pConfig.badge(isDark))}>
                          {approval.priority}
                        </Badge>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', sConfig.badge(isDark))}>
                          {approval.status}
                        </Badge>
                      </div>
                      <p className={cn('text-xs leading-relaxed line-clamp-2', 'text-[var(--app-text-muted)]')}>{approval.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Amount: <span className="font-medium">{formatINR(approval.amount)}</span></span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>By: {approval.requestedBy}</span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{approval.requestedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {approval.status === 'pending' && (
                      <>
                        <Button size="sm" className={cn('px-3 py-1.5 text-xs font-medium rounded-[var(--app-radius-lg)] gap-1', isDark ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100')}>
                          <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" className={cn('px-3 py-1.5 text-xs font-medium rounded-[var(--app-radius-lg)] gap-1', isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50')}>
                          <XCircle className="w-4 h-4" /> Reject
                        </Button>
                      </>
                    )}
                    {approval.comments.length > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : approval.id)} className={cn('px-2 py-1.5 text-xs rounded-[var(--app-radius-lg)] gap-1', 'text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]')}>
                        <MessageSquare className="w-4 h-4" /> {approval.comments.length}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Comments */}
                {isExpanded && approval.comments.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--app-border)' }}>
                    {approval.comments.map((comment) => (
                      <div key={comment.id} className={cn('p-2.5 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{comment.author}</span>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{new Date(comment.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-secondary)]')}>{comment.content}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Escalation Section */}
        {escalatedCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50/50 border-red-200')}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Escalated Items</span>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>{escalatedCount} items need attention</Badge>
            </div>
            <div className="space-y-2">
              {financeApprovals.filter(a => a.status === 'escalated').map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.05 }} className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', isDark ? 'border-red-500/10' : 'border-red-200/50')}>
                  <div>
                    <p className="text-xs font-medium">{a.title}</p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{formatINR(a.amount)} · Approver: {a.approver}</p>
                  </div>
                  <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', priorityConfig[a.priority].badge(isDark))}>{a.priority}</Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
