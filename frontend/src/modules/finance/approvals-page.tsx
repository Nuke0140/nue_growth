'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION, getStatusColor, getPriorityColor } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import {
  FileCheck2, Clock, CheckCircle2, XCircle, AlertTriangle,
  ArrowUp, ChevronDown, ChevronUp, MessageSquare,
} from 'lucide-react';
import { financeApprovals } from '@/modules/finance/data/mock-data';
import type { FinanceApproval } from '@/modules/finance/types';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { useFinanceStore } from './finance-store';

// ── Types ───────────────────────────────────────────────
type FilterTab = 'all' | 'pending' | 'approved' | 'rejected' | 'escalated';

// ── Type badge config ───────────────────────────────────
const typeConfig: Record<string, { label: string; color: string }> = {
  budget: { label: 'Budget', color: CSS.structural },
  payout: { label: 'Payout', color: CSS.info },
  payroll: { label: 'Payroll', color: CSS.accent },
  expense: { label: 'Expense', color: CSS.warning },
  discount: { label: 'Discount', color: CSS.success },
  refund: { label: 'Refund', color: CSS.danger },
  'write-off': { label: 'Write-off', color: CSS.danger },
};

// ── Priority icon helper ────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const pColor = getPriorityColor(priority === 'urgent' ? 'critical' : priority);
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
      style={{ backgroundColor: pColor.bg, color: pColor.color }}
    >
      {priority === 'urgent' && <ArrowUp className="w-2.5 h-2.5" />}
      {priority}
    </span>
  );
}

// ── Time since helper ───────────────────────────────────
function timeSince(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

// ── Component ───────────────────────────────────────────
export default function ApprovalsPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Counts ────────────────────────────────────────────
  const pendingCount = useMemo(() => financeApprovals.filter((a) => a.status === 'pending').length, []);
  const approvedCount = useMemo(() => financeApprovals.filter((a) => a.status === 'approved').length, []);
  const rejectedCount = useMemo(() => financeApprovals.filter((a) => a.status === 'rejected').length, []);
  const escalatedCount = useMemo(() => financeApprovals.filter((a) => a.status === 'escalated').length, []);

  const pendingAmount = useMemo(
    () => financeApprovals.filter((a) => a.status === 'pending').reduce((s, a) => s + a.amount, 0),
    [],
  );
  const approvedAmount = useMemo(
    () => financeApprovals.filter((a) => a.status === 'approved').reduce((s, a) => s + a.amount, 0),
    [],
  );
  const rejectedAmount = useMemo(
    () => financeApprovals.filter((a) => a.status === 'rejected').reduce((s, a) => s + a.amount, 0),
    [],
  );
  const escalatedAmount = useMemo(
    () => financeApprovals.filter((a) => a.status === 'escalated').reduce((s, a) => s + a.amount, 0),
    [],
  );

  // ── Filters ───────────────────────────────────────────
  const filters = useMemo(
    () => [
      { key: 'all', label: 'All', count: financeApprovals.length },
      { key: 'pending', label: 'Pending', count: pendingCount },
      { key: 'approved', label: 'Approved', count: approvedCount },
      { key: 'rejected', label: 'Rejected', count: rejectedCount },
      { key: 'escalated', label: 'Escalated', count: escalatedCount },
    ],
    [pendingCount, approvedCount, rejectedCount, escalatedCount],
  );

  // ── Filtered & sorted ─────────────────────────────────
  const filteredApprovals = useMemo(() => {
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    let items = activeTab === 'all' ? [...financeApprovals] : financeApprovals.filter((a) => a.status === activeTab);
    items.sort((a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3));
    return items;
  }, [activeTab]);

  // ── Priority queue (urgent + high only) ───────────────
  const priorityItems = useMemo(
    () => filteredApprovals.filter((a) => a.priority === 'urgent' || a.priority === 'high'),
    [filteredApprovals],
  );

  // ── Escalated items ───────────────────────────────────
  const escalatedItems = useMemo(
    () => financeApprovals.filter((a) => a.status === 'escalated'),
    [],
  );

  return (
    <PageShell
      title="Approvals"
      subtitle="Finance Governance & Approval Workflow"
      icon={() => <FileCheck2 className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <span
          className="px-3 py-1.5 text-xs font-medium rounded-full"
          style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
        >
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      }
    >
      <div className="space-y-6">
        {/* ── Summary Cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget
            label="Pending"
            value={pendingCount.toString()}
            icon={Clock}
            color="warning"
            trendValue={formatINR(pendingAmount)}
            trend="up"
          />
          <KpiWidget
            label="Approved"
            value={approvedCount.toString()}
            icon={CheckCircle2}
            color="success"
            trendValue={formatINR(approvedAmount)}
            trend="up"
          />
          <KpiWidget
            label="Rejected"
            value={rejectedCount.toString()}
            icon={XCircle}
            color="danger"
            trendValue={rejectedAmount > 0 ? formatINR(rejectedAmount) : '—'}
            trend="down"
          />
          <KpiWidget
            label="Escalated"
            value={escalatedCount.toString()}
            icon={AlertTriangle}
            color="danger"
            trendValue={escalatedAmount > 0 ? formatINR(escalatedAmount) : '—'}
            trend="down"
          />
        </div>

        {/* ── Filter Bar ─────────────────────────────────── */}
        <FilterBar filters={filters} activeFilter={activeTab} onFilterChange={(key) => setActiveTab(key as FilterTab)} />

        {/* ── Priority Queue ─────────────────────────────── */}
        {priorityItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--app-warning) 3%, transparent)',
              borderColor: 'color-mix(in srgb, var(--app-warning) 12%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ArrowUp className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>Priority Queue</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: CSS.warningBg, color: CSS.warning }}
              >
                {priorityItems.length} items
              </span>
            </div>
            <div className="space-y-2">
              {priorityItems.map((a, i) => {
                const tConf = typeConfig[a.type] ?? { label: a.type, color: CSS.textMuted };
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.3, ease: ANIMATION.ease as unknown as number[] }}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{
                      borderColor: a.priority === 'urgent'
                        ? 'color-mix(in srgb, var(--app-danger) 15%, transparent)'
                        : 'color-mix(in srgb, var(--app-warning) 10%, transparent)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: CSS.hoverBg }}
                      >
                        <FileCheck2 className="w-4 h-4" style={{ color: tConf.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: CSS.text }}>{a.title}</span>
                          <span
                            className="text-[9px] px-1.5 py-0 rounded-full font-medium"
                            style={{ backgroundColor: `${tConf.color}15`, color: tConf.color }}
                          >
                            {tConf.label}
                          </span>
                          <PriorityBadge priority={a.priority} />
                        </div>
                        <p className="text-xs" style={{ color: CSS.textMuted }}>
                          {a.requestedBy} · {timeSince(a.requestedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(a.amount)}</span>
                      <StatusBadge status={a.status} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Approval Cards ─────────────────────────────── */}
        <div className="space-y-3">
          {filteredApprovals.map((approval, i) => {
            const tConf = typeConfig[approval.type] ?? { label: approval.type, color: CSS.textMuted };
            const isExpanded = expandedId === approval.id;

            return (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.3, ease: ANIMATION.ease as unknown as number[] }}
                className="rounded-2xl border p-4 transition-colors"
                style={{
                  backgroundColor: CSS.cardBg,
                  borderColor: approval.priority === 'urgent' ? 'color-mix(in srgb, var(--app-danger) 30%, transparent)' : CSS.border,
                  boxShadow: CSS.shadowCard,
                }}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: CSS.hoverBg }}
                    >
                      <FileCheck2 className="w-4 h-4" style={{ color: tConf.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium" style={{ color: CSS.text }}>{approval.title}</span>
                        <span
                          className="text-[9px] px-1.5 py-0 rounded-full font-medium"
                          style={{ backgroundColor: `${tConf.color}15`, color: tConf.color }}
                        >
                          {tConf.label}
                        </span>
                        <PriorityBadge priority={approval.priority} />
                        <StatusBadge status={approval.status} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold" style={{ color: CSS.text }}>{formatINR(approval.amount)}</span>
                        <span className="text-[10px]" style={{ color: CSS.textMuted }}>
                          By: {approval.requestedBy}
                        </span>
                        <span className="text-[10px]" style={{ color: CSS.textMuted }}>
                          {timeSince(approval.requestedDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {approval.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1.5 rounded-lg gap-1"
                          style={{ backgroundColor: CSS.success, color: '#fff' }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1.5 rounded-lg gap-1"
                          style={{ backgroundColor: CSS.danger, color: '#fff' }}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1.5 rounded-lg gap-1"
                          style={{ backgroundColor: CSS.warningBg, color: CSS.warning }}
                        >
                          <ArrowUp className="w-3.5 h-3.5" /> Escalate
                        </Button>
                      </>
                    )}
                    {approval.comments.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                        className="px-2 py-1.5 text-xs rounded-lg gap-1"
                        style={{ color: CSS.textSecondary }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {approval.comments.length}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expandable Section */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 space-y-3"
                    style={{ borderTop: `1px solid ${CSS.borderLight}` }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: CSS.hoverBg }}>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Description</p>
                        <p className="text-xs mt-0.5" style={{ color: CSS.textSecondary }}>{approval.description}</p>
                      </div>
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: CSS.hoverBg }}>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Requester</p>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: CSS.text }}>{approval.requestedBy}</p>
                      </div>
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: CSS.hoverBg }}>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Approver</p>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: CSS.text }}>{approval.approver}</p>
                      </div>
                      <div className="p-2.5 rounded-lg" style={{ backgroundColor: CSS.hoverBg }}>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Date</p>
                        <p className="text-xs mt-0.5" style={{ color: CSS.textSecondary }}>{approval.requestedDate}</p>
                      </div>
                    </div>

                    {/* Comments */}
                    {approval.comments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: CSS.textMuted }}>
                          Comments ({approval.comments.length})
                        </p>
                        {approval.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-2.5 rounded-lg"
                            style={{ backgroundColor: CSS.hoverBg }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium" style={{ color: CSS.text }}>{comment.author}</span>
                              <span className="text-[10px]" style={{ color: CSS.textMuted }}>
                                {new Date(comment.timestamp).toLocaleString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed" style={{ color: CSS.textSecondary }}>
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Escalation Section ─────────────────────────── */}
        {escalatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border-2 p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--app-danger) 3%, transparent)',
              borderColor: 'color-mix(in srgb, var(--app-danger) 20%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.danger }}>Escalated Items</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: CSS.dangerBg, color: CSS.danger }}
              >
                {escalatedItems.length} items need attention
              </span>
            </div>
            <div className="space-y-2">
              {escalatedItems.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05, duration: 0.3, ease: ANIMATION.ease as unknown as number[] }}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: CSS.danger }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>{a.title}</p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>
                        {formatINR(a.amount)} · Approver: {a.approver}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={a.priority} />
                    <Button
                      size="sm"
                      className="text-xs px-3 py-1.5 rounded-lg gap-1"
                      style={{ backgroundColor: CSS.accent, color: '#fff' }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
