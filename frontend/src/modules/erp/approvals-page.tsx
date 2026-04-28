'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DollarSign, Wallet, Palette, CalendarOff, FileText,
  FileSignature, Banknote, CheckCircle2, XCircle, Clock,
  AlertTriangle, MessageSquare, Shield, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FilterBar } from './components/ops/filter-bar';
import { KpiWidget } from './components/ops/kpi-widget';
import { mockApprovals } from './data/mock-data';
import type { Approval, ApprovalType, ApprovalStatus } from './types';

type TabKey = 'pending' | 'approved' | 'rejected';

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

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');

  const filtered = useMemo(() => {
    if (activeTab === 'pending') return mockApprovals.filter(a => a.status === 'pending' || a.status === 'escalated');
    if (activeTab === 'approved') return mockApprovals.filter(a => a.status === 'approved');
    return mockApprovals.filter(a => a.status === 'rejected');
  }, [activeTab]);

  const stats = useMemo(() => ({
    pending: mockApprovals.filter(a => a.status === 'pending' || a.status === 'escalated').length,
    approved: mockApprovals.filter(a => a.status === 'approved').length,
    rejected: mockApprovals.filter(a => a.status === 'rejected').length,
  }), []);

  const tabFilters = [
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

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

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div className="p-6 space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color: 'var(--ops-text)' }}>Approvals</h1>
          <Badge variant="secondary" className="ops-badge">{filtered.length}</Badge>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp}>
          <FilterBar filters={tabFilters} activeFilter={activeTab} onFilterChange={(key) => setActiveTab(key as TabKey)} />
        </motion.div>

        {/* Approval Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full ops-card p-12 text-center">
              <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--ops-text-muted)', opacity: 0.3 }} />
              <p className="text-sm" style={{ color: 'var(--ops-text-muted)' }}>No approvals in this category.</p>
            </div>
          ) : (
            filtered.map((approval, idx) => {
              const TypeIcon = typeIconMap[approval.type] || FileText;
              const isActionable = approval.status === 'pending' || approval.status === 'escalated';
              const cardStyle = getCardBorderStyle(approval.status);

              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="ops-card p-5 space-y-4 transition-colors"
                  style={{ ...cardStyle, borderRadius: '1rem' }}
                >
                  {/* Top: Type icon + Status */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                      style={{ backgroundColor: typeColorMap[approval.type] }}
                    >
                      <TypeIcon className="w-5 h-5" style={{ color: typeTextColor[approval.type] }} />
                    </div>
                    {getStatusBadge(approval.status)}
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ops-text)' }}>{approval.title}</p>
                    {approval.project && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--ops-text-muted)' }}>{approval.project}</p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[8px] font-semibold" style={{ backgroundColor: 'var(--ops-accent-light)', color: 'var(--ops-accent)' }}>
                          {approval.requestedBy.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs" style={{ color: 'var(--ops-text-secondary)' }}>Requested by: {approval.requestedBy}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--ops-text-muted)' }}>
                      <span>{new Date(approval.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      {approval.version > 1 && (
                        <span className="ops-badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--ops-text-muted)' }}>v{approval.version}</span>
                      )}
                      {approval.comments.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {approval.comments.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isActionable && (
                    <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid var(--ops-border)' }}>
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                        style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.12)'; }}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                        style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#f87171' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(248,113,113,0.2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(248,113,113,0.12)'; }}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
