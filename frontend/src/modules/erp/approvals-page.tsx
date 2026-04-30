'use client';

import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DollarSign, Wallet, Palette, CalendarOff, FileText,
  FileSignature, Banknote, CheckCircle2, XCircle, Clock,
  AlertTriangle, MessageSquare, Shield, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronUp, User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FilterBar } from './components/ops/filter-bar';
import { KpiWidget } from './components/ops/kpi-widget';
import { BulkActionBar } from './components/ops/bulk-action-bar';
import { PageShell } from './components/ops/page-shell';
import { Timeline, type TimelineItem } from './components/ops/timeline';
import { mockApprovals } from './data/mock-data';
import type { Approval, ApprovalType, ApprovalStatus } from './types';

type TabKey = 'pending' | 'approved' | 'rejected';
type TypeFilter = 'all' | ApprovalType;

const typeIconMap: Record<ApprovalType, typeof DollarSign> = {
  invoice: DollarSign,
  budget: Wallet,
  design: Palette,
  leave: CalendarOff,
  content: FileText,
  proposal: FileSignature,
  payroll: Banknote,
};

const typeColorMap: Record<ApprovalType, string> = {
  invoice: 'rgba(52, 211, 153, 0.12)',
  budget: 'rgba(251, 191, 36, 0.12)',
  design: 'rgba(168, 85, 247, 0.12)',
  leave: 'rgba(96, 165, 250, 0.12)',
  content: 'rgba(96, 165, 250, 0.12)',
  proposal: 'rgba(204, 92, 55, 0.12)',
  payroll: 'rgba(248, 113, 113, 0.12)',
};

const typeTextColor: Record<ApprovalType, string> = {
  invoice: '#34d399',
  budget: '#fbbf24',
  design: '#a855f7',
  leave: '#60a5fa',
  content: '#60a5fa',
  proposal: '#cc5c37',
  payroll: '#f87171',
};

const typeFilters: { key: TypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'budget', label: 'Budget' },
  { key: 'leave', label: 'Leave' },
  { key: 'design', label: 'Design' },
  { key: 'content', label: 'Content' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'proposal', label: 'Proposal' },
];

function timeAgo(dateStr: string): string {
  const now = new Date('2026-04-10T18:00:00');
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function ApprovalsPageInner() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [activeType, setActiveType] = useState<TypeFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [localApprovals, setLocalApprovals] = useState<Approval[]>(mockApprovals);

  const filtered = useMemo(() => {
    let data = localApprovals;
    // Tab filter
    if (activeTab === 'pending') data = data.filter(a => a.status === 'pending' || a.status === 'escalated');
    else if (activeTab === 'approved') data = data.filter(a => a.status === 'approved');
    else data = data.filter(a => a.status === 'rejected');
    // Type filter
    if (activeType !== 'all') data = data.filter(a => a.type === activeType);
    return data;
  }, [localApprovals, activeTab, activeType]);

  const stats = useMemo(() => ({
    pending: localApprovals.filter(a => a.status === 'pending' || a.status === 'escalated').length,
    approved: localApprovals.filter(a => a.status === 'approved').length,
    rejected: localApprovals.filter(a => a.status === 'rejected').length,
  }), [localApprovals]);

  const tabFilters = [
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleApproveSelected = () => {
    setLocalApprovals(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, status: 'approved' as const } : a));
    setSelectedIds(new Set());
  };

  const handleRejectSelected = () => {
    setLocalApprovals(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, status: 'rejected' as const } : a));
    setSelectedIds(new Set());
  };

  const handleApprove = (id: string) => {
    setLocalApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));
  };

  const handleReject = (id: string) => {
    setLocalApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  function getCardBorderStyle(status: ApprovalStatus) {
    if (status === 'approved') return { border: '1px solid rgba(52, 211, 153, 0.3)', backgroundColor: 'rgba(52, 211, 153, 0.03)' };
    if (status === 'rejected') return { border: '1px solid rgba(248, 113, 113, 0.3)', backgroundColor: 'rgba(248, 113, 113, 0.03)' };
    if (status === 'escalated') return { border: '1px solid rgba(251, 191, 36, 0.3)', backgroundColor: 'rgba(251, 191, 36, 0.03)' };
    return {};
  }

  function getStatusBadge(status: ApprovalStatus) {
    if (status === 'approved') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
        <CheckCircle2 className="w-3 h-3" /> Approved
      </span>
    );
    if (status === 'rejected') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
    if (status === 'escalated') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
        <AlertTriangle className="w-3 h-3" /> Escalated
      </span>
    );
    return (
      <motion.span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
        style={{ backgroundColor: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Clock className="w-3 h-3" /> Pending
      </motion.span>
    );
  }

  function buildTimelineItems(approval: Approval): TimelineItem[] {
    const items: TimelineItem[] = [];
    // Created event
    items.push({
      id: `created-${approval.id}`,
      icon: FileText,
      title: 'Request submitted',
      description: `${approval.requestedBy} created this approval request`,
      timestamp: new Date(approval.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      accentColor: 'var(--app-accent)',
    });
    // Comments as timeline items
    approval.comments.forEach(c => {
      items.push({
        id: c.id,
        icon: MessageSquare,
        title: `${c.author} commented`,
        description: c.content,
        timestamp: new Date(c.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        accentColor: '#60a5fa',
      });
    });
    // Status event
    if (approval.status === 'approved') {
      items.push({
        id: `approved-${approval.id}`,
        icon: CheckCircle2,
        title: 'Approved',
        timestamp: '—',
        accentColor: '#34d399',
      });
    } else if (approval.status === 'rejected') {
      items.push({
        id: `rejected-${approval.id}`,
        icon: XCircle,
        title: 'Rejected',
        timestamp: '—',
        accentColor: '#f87171',
      });
    }
    return items;
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Approvals" icon={CheckCircle2} badge={filtered.length}>
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">

        {/* Type filter pills */}
        <motion.div variants={fadeUp}>
          <FilterBar
            filters={typeFilters}
            activeFilter={activeType}
            onFilterChange={(key) => setActiveType(key as TypeFilter)}
          />
        </motion.div>

        {/* Status Tabs */}
        <motion.div variants={fadeUp}>
          <FilterBar filters={tabFilters} activeFilter={activeTab} onFilterChange={(key) => setActiveTab(key as TabKey)} />
        </motion.div>

        {/* Approval Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full ops-card p-12 text-center">
              <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--app-text-muted)', opacity: 0.3 }} />
              <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>No approvals in this category.</p>
            </div>
          ) : (
            filtered.map((approval, idx) => {
              const TypeIcon = typeIconMap[approval.type] || FileText;
              const isActionable = approval.status === 'pending' || approval.status === 'escalated';
              const cardStyle = getCardBorderStyle(approval.status);
              const isExpanded = expandedId === approval.id;
              const isSelected = selectedIds.has(approval.id);

              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="ops-card transition-colors"
                  style={{ ...cardStyle, borderRadius: '1rem', border: isSelected ? '1.5px solid #cc5c37' : cardStyle.border }}
                >
                  {/* Card body */}
                  <div className="p-5 space-y-4">
                    {/* Top: Checkbox + Type icon + Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(approval.id)}
                            className="w-4 h-4 rounded accent-[#cc5c37] cursor-pointer"
                          />
                        </label>
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                          style={{ backgroundColor: typeColorMap[approval.type] }}
                        >
                          <TypeIcon className="w-5 h-5" style={{ color: typeTextColor[approval.type] }} />
                        </div>
                      </div>
                      {getStatusBadge(approval.status)}
                    </div>

                    {/* Title */}
                    <div>
                      <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--app-text)' }}>{approval.title}</p>
                      {approval.project && (
                        <p className="text-[11px] mt-1" style={{ color: 'var(--app-text-muted)' }}>{approval.project}</p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[8px] font-semibold" style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}>
                            {approval.requestedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs" style={{ color: 'var(--app-text-secondary)' }}>Requested by: {approval.requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                        <span>{timeAgo(approval.createdAt)}</span>
                        {approval.version > 1 && (
                          <span className="ops-badge" style={{ backgroundColor: 'var(--app-hover-bg)', color: 'var(--app-text-muted)' }}>v{approval.version}</span>
                        )}
                        {approval.comments.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {approval.comments.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      className="flex items-center justify-center w-full py-1.5 text-[11px] font-medium transition-colors rounded-lg"
                      style={{ color: 'var(--app-text-muted)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-hover-bg)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                      onClick={() => toggleExpand(approval.id)}
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3 mr-1" /> Hide Details</>
                      ) : (
                        <><ChevronDown className="w-3 h-3 mr-1" /> View Details</>
                      )}
                    </button>

                    {/* Expanded Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          {/* Status indicator */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{
                              backgroundColor: approval.status === 'approved' ? '#34d399' :
                                approval.status === 'rejected' ? '#f87171' :
                                approval.status === 'escalated' ? '#fbbf24' : '#fbbf24',
                            }} />
                            <span className="text-xs font-medium capitalize" style={{ color: 'var(--app-text-secondary)' }}>
                              Current Status: {approval.status}
                            </span>
                          </div>

                          {/* Timeline */}
                          <div className="mb-4">
                            <Timeline items={buildTimelineItems(approval)} />
                          </div>

                          {/* Action buttons */}
                          {isActionable && (
                            <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--app-border)' }}>
                              <button
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                                style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.2)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.12)'; }}
                                onClick={() => handleApprove(approval.id)}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                                style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#f87171' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(248,113,113,0.2)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(248,113,113,0.12)'; }}
                                onClick={() => handleReject(approval.id)}
                              >
                                <ThumbsDown className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        actions={[
          {
            label: 'Approve Selected',
            icon: CheckCircle2,
            onClick: handleApproveSelected,
          },
          {
            label: 'Reject Selected',
            icon: XCircle,
            onClick: handleRejectSelected,
            variant: 'danger',
          },
        ]}
      />
    </PageShell>
  );
}

export default memo(ApprovalsPageInner);
