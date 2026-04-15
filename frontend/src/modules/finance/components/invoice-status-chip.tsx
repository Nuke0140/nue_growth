'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Status Configuration ─────────────────────────────────
type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'write-off';

interface StatusConfig {
  label: string;
  dotColor: string;
  bgDark: string;
  bgLight: string;
  textDark: string;
  textLight: string;
  borderDark: string;
  borderLight: string;
  pulse?: boolean;
}

const statusConfig: Record<InvoiceStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    dotColor: 'bg-slate-500',
    bgDark: 'bg-slate-500/15',
    bgLight: 'bg-slate-100',
    textDark: 'text-slate-400',
    textLight: 'text-slate-600',
    borderDark: 'border-slate-500/20',
    borderLight: 'border-slate-300',
  },
  sent: {
    label: 'Sent',
    dotColor: 'bg-blue-500',
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-400',
    textLight: 'text-blue-600',
    borderDark: 'border-blue-500/20',
    borderLight: 'border-blue-200',
  },
  viewed: {
    label: 'Viewed',
    dotColor: 'bg-violet-500',
    bgDark: 'bg-violet-500/15',
    bgLight: 'bg-violet-50',
    textDark: 'text-violet-400',
    textLight: 'text-violet-600',
    borderDark: 'border-violet-500/20',
    borderLight: 'border-violet-200',
  },
  paid: {
    label: 'Paid',
    dotColor: 'bg-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-400',
    textLight: 'text-emerald-600',
    borderDark: 'border-emerald-500/20',
    borderLight: 'border-emerald-200',
  },
  overdue: {
    label: 'Overdue',
    dotColor: 'bg-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    textDark: 'text-red-400',
    textLight: 'text-red-600',
    borderDark: 'border-red-500/20',
    borderLight: 'border-red-200',
    pulse: true,
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'bg-gray-500',
    bgDark: 'bg-gray-500/15',
    bgLight: 'bg-gray-100',
    textDark: 'text-gray-400',
    textLight: 'text-gray-600',
    borderDark: 'border-gray-500/20',
    borderLight: 'border-gray-300',
  },
  'write-off': {
    label: 'Write-off',
    dotColor: 'bg-orange-500',
    bgDark: 'bg-orange-500/15',
    bgLight: 'bg-orange-50',
    textDark: 'text-orange-400',
    textLight: 'text-orange-600',
    borderDark: 'border-orange-500/20',
    borderLight: 'border-orange-200',
  },
};

// ─── Component ────────────────────────────────────────────
interface InvoiceStatusChipProps {
  status: string;
}

export default function InvoiceStatusChip({ status }: InvoiceStatusChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const key = status as InvoiceStatus;
  const config = statusConfig[key] || statusConfig.draft;

  const dot = (
    <span className="relative flex items-center justify-center">
      {config.pulse && (
        <motion.span
          className="absolute w-2.5 h-2.5 rounded-full bg-red-500/40"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotColor)} />
    </span>
  );

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap',
        isDark
          ? `${config.bgDark} ${config.textDark} ${config.borderDark}`
          : `${config.bgLight} ${config.textLight} ${config.borderLight}`
      )}
    >
      {dot}
      {config.label}
    </Badge>
  );
}
