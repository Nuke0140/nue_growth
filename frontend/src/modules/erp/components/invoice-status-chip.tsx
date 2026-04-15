'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { InvoiceStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<InvoiceStatus, { label: string; dotColor: string; bgDark: string; bgLight: string; textColorDark: string; textColorLight: string; borderColorDark: string; borderColorLight: string }> = {
  draft: {
    label: 'Draft',
    dotColor: 'bg-zinc-500',
    bgDark: 'bg-zinc-500/15',
    bgLight: 'bg-zinc-100',
    textColorDark: 'text-zinc-400',
    textColorLight: 'text-zinc-600',
    borderColorDark: 'border-zinc-500/20',
    borderColorLight: 'border-zinc-300',
  },
  sent: {
    label: 'Sent',
    dotColor: 'bg-blue-500',
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    textColorDark: 'text-blue-400',
    textColorLight: 'text-blue-600',
    borderColorDark: 'border-blue-500/20',
    borderColorLight: 'border-blue-200',
  },
  paid: {
    label: 'Paid',
    dotColor: 'bg-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    textColorDark: 'text-emerald-400',
    textColorLight: 'text-emerald-600',
    borderColorDark: 'border-emerald-500/20',
    borderColorLight: 'border-emerald-200',
  },
  overdue: {
    label: 'Overdue',
    dotColor: 'bg-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    textColorDark: 'text-red-400',
    textColorLight: 'text-red-600',
    borderColorDark: 'border-red-500/20',
    borderColorLight: 'border-red-200',
  },
  partial: {
    label: 'Partial',
    dotColor: 'bg-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    textColorDark: 'text-amber-400',
    textColorLight: 'text-amber-600',
    borderColorDark: 'border-amber-500/20',
    borderColorLight: 'border-amber-200',
  },
};

// ─── Component ────────────────────────────────────────────
interface InvoiceStatusChipProps {
  status: InvoiceStatus;
}

export default function InvoiceStatusChip({ status }: InvoiceStatusChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap',
        isDark
          ? `${config.bgDark} ${config.textColorDark} ${config.borderColorDark}`
          : `${config.bgLight} ${config.textColorLight} ${config.borderColorLight}`
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
      {config.label}
    </span>
  );
}
