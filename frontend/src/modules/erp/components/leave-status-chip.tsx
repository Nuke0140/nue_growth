'use client';

import { cn } from '@/lib/utils';
import type { LeaveStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<LeaveStatus, { label: string; dotColor: string; bg: string; textColor: string; borderColor: string }> = {
  pending: {
    label: 'Pending',
    dotColor: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-500/20',
  },
  approved: {
    label: 'Approved',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-500/20',
  },
  rejected: {
    label: 'Rejected',
    dotColor: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'bg-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-500/15',
    textColor: 'text-zinc-600 dark:text-zinc-400',
    borderColor: 'border-zinc-300 dark:border-zinc-500/20',
  },
};

// ─── Component ────────────────────────────────────────────
interface LeaveStatusChipProps {
  status: LeaveStatus;
}

export default function LeaveStatusChip({ status }: LeaveStatusChipProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap',
        config.bg, config.textColor, config.borderColor
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      {config.label}
    </span>
  );
}
