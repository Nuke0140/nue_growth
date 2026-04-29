'use client';

import { cn } from '@/lib/utils';
import type { InvoiceStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<InvoiceStatus, { label: string; dotColor: string; bg: string; textColor: string; borderColor: string }> = {
  draft: {
    label: 'Draft',
    dotColor: 'bg-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-500/15',
    textColor: 'text-zinc-600 dark:text-zinc-400',
    borderColor: 'border-zinc-300 dark:border-zinc-500/20',
  },
  sent: {
    label: 'Sent',
    dotColor: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-500/20',
  },
  paid: {
    label: 'Paid',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-500/20',
  },
  overdue: {
    label: 'Overdue',
    dotColor: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-500/20',
  },
  partial: {
    label: 'Partial',
    dotColor: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-500/20',
  },
};

// ─── Component ────────────────────────────────────────────
interface InvoiceStatusChipProps {
  status: InvoiceStatus;
}

export default function InvoiceStatusChip({ status }: InvoiceStatusChipProps) {
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
