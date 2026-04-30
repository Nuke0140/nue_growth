'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, FileText, Eye, Edit3, Send, Download, PenTool,
  ChevronRight, Clock, Sparkles, CheckCircle2, AlertTriangle,
  FileSignature, DollarSign, BarChart3, Layers, RefreshCw,
  XCircle, HourglassIcon, Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { mockProposals } from '@/modules/crm-sales/data/mock-data';
import type { Proposal, ProposalStatus } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const STATUS_CONFIG: Record<ProposalStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Draft' },
  sent: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Sent' },
  viewed: { bg: 'bg-violet-500/15', text: 'text-violet-400', label: 'Viewed' },
  negotiation: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Negotiation' },
  accepted: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Accepted' },
  rejected: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Rejected' },
  expired: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Expired' },
};

const APPROVAL_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-500/15', text: 'text-yellow-500', label: 'Pending Review' },
  approved: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', label: 'Approved' },
  rejected: { bg: 'bg-red-500/15', text: 'text-red-500', label: 'Rejected' },
  revision_requested: { bg: 'bg-amber-500/15', text: 'text-amber-500', label: 'Revision Requested' },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Payment Pending' },
  partial: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Partial Payment' },
  paid: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Paid' },
};

type StatusTab = 'all' | ProposalStatus;
const STATUS_TABS: StatusTab[] = ['all', 'draft', 'sent', 'viewed', 'negotiation', 'accepted', 'rejected', 'expired'];

const TEMPLATES = [
  { name: 'Enterprise', icon: Layers, desc: 'Full-featured enterprise proposal' },
  { name: 'Startup', icon: Sparkles, desc: 'Lean startup-focused template' },
  { name: 'Standard', icon: FileText, desc: 'Standard professional template' },
];

export default function ProposalsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [statusFilter, setStatusFilter] = useState<StatusTab>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return mockProposals;
    return mockProposals.filter(p => p.status === statusFilter);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = mockProposals.length;
    const active = mockProposals.filter(p => ['sent', 'viewed', 'negotiation'].includes(p.status)).length;
    const accepted = mockProposals.filter(p => p.status === 'accepted').length;
    const totalValue = mockProposals.reduce((s, p) => s + p.totalValue, 0);
    return { total, active, accepted, totalValue };
  }, []);

  const getTabCount = (tab: StatusTab) => {
    if (tab === 'all') return mockProposals.length;
    return mockProposals.filter(p => p.status === tab).length;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-app-2xl max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  Proposals
                </h1>
                <Badge variant="secondary" className={cn(
                  'text-[10px] px-2 py-0.5',
                  isDark ? 'bg-white/[0.06] text-white/50 border-0' : 'bg-black/[0.06] text-black/50 border-0'
                )}>
                  {mockProposals.length} documents
                </Badge>
              </div>
              <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
                Sales document workspace &amp; client engagement tracking
              </p>
            </div>
            <Button className={cn(
              'shrink-0 h-10  px-4 rounded-[var(--app-radius-lg)] text-xs font-semibold',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Proposal
            </Button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab;
              const count = getTabCount(tab);
              const cfg = tab !== 'all' ? STATUS_CONFIG[tab] : null;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors whitespace-nowrap border',
                    isActive
                      ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                      : isDark ? 'text-white/40 border-white/[0.06] hover:bg-white/[0.04]' : 'text-black/40 border-black/[0.06] hover:bg-black/[0.04]'
                  )}
                >
                  {tab === 'all' ? 'All' : cfg?.label}
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                    isActive
                      ? isDark ? 'bg-black/20 text-black' : 'bg-white/20 text-white'
                      : isDark ? 'bg-white/[0.04] text-white/30' : 'bg-black/[0.04] text-black/30'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { label: 'Total Proposals', value: stats.total.toString(), icon: FileText, color: '' },
              { label: 'Active', value: stats.active.toString(), icon: Send, color: 'text-blue-500' },
              { label: 'Accepted', value: stats.accepted.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'text-amber-500' },
            ].map((stat) => (
              <div key={stat.label} className={cn(
                'rounded-[var(--app-radius-xl)] border p-4',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.color || ('text-[var(--app-text-muted)]'))} />
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                </div>
                <p className={cn('text-xl font-bold', 'text-[var(--app-text)]')}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Templates Quick-Create */}
          <div>
            <h3 className={cn('text-sm font-semibold mb-3', 'text-[var(--app-text-secondary)]')}>
              Quick Create from Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TEMPLATES.map((tpl, i) => (
                <motion.button
                  key={tpl.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-4 text-left transition-colors group',
                    isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                      : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                      isDark ? 'bg-white/[0.06] group-hover:bg-white/[0.1]' : 'bg-black/[0.04] group-hover:bg-black/[0.08]'
                    )}>
                      <tpl.icon className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
                    </div>
                    <div>
                      <p className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>{tpl.name}</p>
                      <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>{tpl.desc}</p>
                    </div>
                    <ChevronRight className={cn(
                      'w-4 h-4 ml-auto transition-transform group-hover:translate-x-0.5',
                      'text-[var(--app-text-disabled)]'
                    )} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Proposal Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((proposal, i) => (
              <ProposalCard key={proposal.id} proposal={proposal} isDark={isDark} index={i} formatDate={formatDate} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-4xl text-center',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <FileText className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
              <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>
                No proposals in this category
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ProposalCard({
  proposal,
  isDark,
  index,
  formatDate,
}: {
  proposal: Proposal;
  isDark: boolean;
  index: number;
  formatDate: (d?: string) => string;
}) {
  const statusCfg = STATUS_CONFIG[proposal.status];
  const approvalCfg = proposal.approvalState ? APPROVAL_CONFIG[proposal.approvalState] : null;
  const paymentCfg = proposal.paymentStatus ? PAYMENT_CONFIG[proposal.paymentStatus] : null;

  const pagesPercent = proposal.totalPages > 0 ? Math.round((proposal.pagesRead / proposal.totalPages) * 100) : 0;

  // Version history mock
  const versions = Array.from({ length: proposal.version }, (_, v) => ({
    version: v + 1,
    date: new Date(new Date(proposal.createdAt).getTime() + v * 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
            {proposal.title}
          </h3>
          <p className={cn('text-[11px] mt-0.5 truncate', 'text-[var(--app-text-muted)]')}>
            {proposal.dealName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold bg-white/[0.06] border-0">
            v{proposal.version}
          </Badge>
          <span className={cn('px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-semibold', statusCfg.bg, statusCfg.text)}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Contact + Company + Template */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>
          {proposal.contactName}
        </span>
        <span className={cn('text-[11px]', 'text-[var(--app-text-disabled)]')}>·</span>
        <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
          {proposal.company}
        </span>
        {proposal.template && (
          <>
            <span className={cn('text-[11px]', 'text-[var(--app-text-disabled)]')}>·</span>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium',
              isDark ? 'bg-white/[0.04] text-white/30' : 'bg-black/[0.04] text-black/30'
            )}>
              {proposal.template}
            </span>
          </>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
          {formatCurrency(proposal.totalValue)}
        </span>
        <span className={cn('text-[10px] ml-1', 'text-[var(--app-text-muted)]')}>{proposal.currency}</span>
      </div>

      {/* Client Engagement */}
      {proposal.viewedByClient && (
        <div className={cn('rounded-[var(--app-radius-lg)] p-3 mb-3 border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.04]')}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-violet-400" />
              <span className={cn('text-[10px] font-semibold', 'text-[var(--app-text-secondary)]')}>
                Client Engagement
              </span>
            </div>
            {proposal.lastViewedAt && (
              <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>
                Last viewed: {formatDate(proposal.lastViewedAt)}
              </span>
            )}
          </div>
          {proposal.totalPages > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                  Pages Read
                </span>
                <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-secondary)]')}>
                  {proposal.pagesRead}/{proposal.totalPages} pages ({pagesPercent}%)
                </span>
              </div>
              <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pagesPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-violet-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approval + Payment */}
      <div className="flex flex-wrap gap-2 mb-3">
        {approvalCfg && (
          <span className={cn('px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium flex items-center gap-1', approvalCfg.bg, approvalCfg.text)}>
            <CheckCircle2 className="w-4 h-4" />
            {approvalCfg.label}
          </span>
        )}
        {paymentCfg && (
          <span className={cn('px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium flex items-center gap-1', paymentCfg.bg, paymentCfg.text)}>
            <DollarSign className="w-4 h-4" />
            {paymentCfg.label}
          </span>
        )}
      </div>

      {/* Version History */}
      {proposal.version > 1 && (
        <div className="mb-3">
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
            Version History
          </span>
          <div className="flex items-center gap-1 mt-1.5">
            {versions.map((v, vi) => (
              <div key={v.version} className="flex items-center gap-1">
                {vi > 0 && (
                  <div className={cn('w-4 h-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
                )}
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[9px] font-medium',
                  v.version === proposal.version
                    ? (isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70')
                    : (isDark ? 'bg-white/[0.03] text-white/25' : 'bg-black/[0.03] text-black/25')
                )}>
                  v{v.version}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
        <ActionButton icon={Eye} label="View" isDark={isDark} />
        <ActionButton icon={Edit3} label="Edit" isDark={isDark} />
        <ActionButton icon={Send} label="Reminder" isDark={isDark} />
        <ActionButton icon={Download} label="Download" isDark={isDark} />
        <div className="flex-1" />
        <Button size="sm" variant="ghost" className={cn(
          'h-8  px-2.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium gap-1',
          isDark ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10' : 'text-violet-600 hover:text-violet-500 hover:bg-violet-500/10'
        )}>
          <PenTool className="w-4 h-4" />
          Digital Sign
        </Button>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon: Icon, label, isDark }: { icon: typeof Eye; label: string; isDark: boolean }) {
  return (
    <button className={cn(
      'flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors',
      isDark ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]' : 'text-black/40 hover:text-black/70 hover:bg-black/[0.04]'
    )}>
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
