'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  FileText,
  Palette,
  Receipt,
  Wallet,
  Banknote,
  CalendarOff,
  FilePen,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Approval, ApprovalStatus, ApprovalType } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<ApprovalStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    border: 'border-red-200 dark:border-red-500/20',
    icon: XCircle,
  },
  escalated: {
    label: 'Escalated',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/15',
    border: 'border-orange-200 dark:border-orange-500/20',
    icon: ArrowUpRight,
  },
};

// ─── Type Configuration ───────────────────────────────────
const typeConfig: Record<ApprovalType, { label: string; color: string; bg: string; border: string; icon: typeof FileText }> = {
  content: {
    label: 'Content',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/15',
    border: 'border-purple-200 dark:border-purple-500/20',
    icon: FileText,
  },
  design: {
    label: 'Design',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-500/15',
    border: 'border-pink-200 dark:border-pink-500/20',
    icon: Palette,
  },
  invoice: {
    label: 'Invoice',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
    icon: Receipt,
  },
  budget: {
    label: 'Budget',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
    icon: Wallet,
  },
  payroll: {
    label: 'Payroll',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    icon: Banknote,
  },
  leave: {
    label: 'Leave',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-500/15',
    border: 'border-teal-200 dark:border-teal-500/20',
    icon: CalendarOff,
  },
  proposal: {
    label: 'Proposal',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/15',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    icon: FilePen,
  },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarBgColor(name: string) {
  const colors = [
    'bg-emerald-500/20 text-emerald-400',
    'bg-sky-500/20 text-sky-400',
    'bg-amber-500/20 text-amber-400',
    'bg-rose-500/20 text-rose-400',
    'bg-violet-500/20 text-violet-400',
    'bg-teal-500/20 text-teal-400',
    'bg-pink-500/20 text-pink-400',
    'bg-orange-500/20 text-orange-400',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Component ────────────────────────────────────────────
interface ApprovalCardProps {
  approval: Approval;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function ApprovalCard({ approval, onApprove, onReject }: ApprovalCardProps) {
  const status = statusConfig[approval.status];
  const type = typeConfig[approval.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;
  const isPending = approval.status === 'pending';
  const isEscalated = approval.status === 'escalated';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 transition-colors duration-200 shadow-sm',
        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-hover-bg)]'
      )}
    >
      {/* Top row: Type badge + Status chip + Version */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium border',
              `${type.bg} ${type.color} ${type.border}`
            )}
          >
            <TypeIcon className="w-3 h-3" />
            {type.label}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium border',
              `${status.bg} ${status.color} ${status.border}`
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>
        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
          v{approval.version}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold mb-3 line-clamp-2 leading-relaxed">
        {approval.title}
      </h3>

      {/* Requested By */}
      <div className="flex items-center gap-2 mb-3">
        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold', getAvatarBgColor(approval.requestedBy))}>
          {getInitials(approval.requestedBy)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate text-[var(--app-text)]">
            {approval.requestedBy}
          </p>
          <p className="text-[10px] text-[var(--app-text-muted)]">
            {formatDate(approval.createdAt)}
          </p>
        </div>
      </div>

      {/* Project (if linked) */}
      {approval.project && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] text-[var(--app-text-disabled)]">Project:</span>
          <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
            {approval.project}
          </span>
        </div>
      )}

      {/* Comments count */}
      <div className="flex items-center gap-1.5 mb-4">
        <MessageSquare className="w-3 h-3 text-[var(--app-text-muted)]" />
        <span className="text-[11px] text-[var(--app-text-muted)]">
          {approval.comments.length} comment{approval.comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Action Buttons (only for pending/escalated) */}
      {(isPending || isEscalated) && (
        <div
          className={cn(
            'flex items-center gap-2 pt-3 border-t',
            'border-[var(--app-border)]'
          )}
        >
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(approval.id);
            }}
            className={cn(
              'h-8 text-[11px] font-medium rounded-lg gap-1 bg-emerald-500 hover:bg-emerald-600 text-white'
            )}
          >
            <CheckCircle2 className="w-3 h-3" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(approval.id);
            }}
            className={cn(
              'h-8 text-[11px] font-medium rounded-lg gap-1'
            )}
          >
            <XCircle className="w-3 h-3" />
            Reject
          </Button>
          {isPending && (
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'h-8 text-[11px] font-medium rounded-lg gap-1 ml-auto',
                'border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ArrowUpRight className="w-3 h-3" />
              Escalate
            </Button>
          )}
        </div>
      )}

      {/* Latest comment preview */}
      {approval.comments.length > 0 && (
        <div
          className={cn(
            'mt-3 p-2.5 rounded-lg text-[11px] leading-relaxed line-clamp-2',
            'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
          )}
        >
          <span className="font-medium">{approval.comments[0].author}:</span>{' '}
          {approval.comments[0].content}
        </div>
      )}
    </motion.div>
  );
}
