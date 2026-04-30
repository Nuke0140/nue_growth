'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Receipt, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

type FilingStatus = 'filed' | 'pending' | 'overdue';

function getFilingConfig(status: FilingStatus, isDark: boolean) {
  switch (status) {
    case 'filed':
      return {
        label: 'Filed',
        bgDark: 'bg-emerald-500/15',
        bgLight: 'bg-emerald-50',
        textDark: 'text-emerald-400',
        textLight: 'text-emerald-600',
        borderDark: 'border-emerald-500/20',
        borderLight: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'pending':
      return {
        label: 'Pending',
        bgDark: 'bg-amber-500/15',
        bgLight: 'bg-amber-50',
        textDark: 'text-amber-400',
        textLight: 'text-amber-600',
        borderDark: 'border-amber-500/20',
        borderLight: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'overdue':
      return {
        label: 'Overdue',
        bgDark: 'bg-red-500/15',
        bgLight: 'bg-red-50',
        textDark: 'text-red-400',
        textLight: 'text-red-600',
        borderDark: 'border-red-500/20',
        borderLight: 'border-red-200',
        dotColor: 'bg-red-500',
      };
  }
}

// ─── Component ────────────────────────────────────────────
interface TaxSummaryCardProps {
  period: string;
  gstCollected: number;
  gstPayable: number;
  gstReceivable: number;
  tds: number;
  taxLiability: number;
  filingStatus: FilingStatus;
}

export default function TaxSummaryCard({
  period,
  gstCollected,
  gstPayable,
  gstReceivable,
  tds,
  taxLiability,
  filingStatus,
}: TaxSummaryCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const filing = getFilingConfig(filingStatus, isDark);

  const taxItems = [
    { label: 'GST Collected', value: gstCollected, color: 'text-emerald-500' },
    { label: 'GST Payable', value: gstPayable, color: 'text-[var(--app-danger)]' },
    { label: 'GST Receivable', value: gstReceivable, color: 'text-blue-500' },
    { label: 'TDS', value: tds, color: 'text-[var(--app-purple)]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
            isDark ? 'bg-violet-500/10' : 'bg-violet-100'
          )}>
            <Receipt className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Tax Summary</h3>
            <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{period}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border',
            isDark
              ? `${filing.bgDark} ${filing.textDark} ${filing.borderDark}`
              : `${filing.bgLight} ${filing.textLight} ${filing.borderLight}`
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', filing.dotColor)} />
          {filing.label}
        </Badge>
      </div>

      {/* Tax Items */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {taxItems.map((item) => (
          <div key={item.label} className={cn('p-3 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
            <p className={cn('text-[10px] font-medium mb-1', 'text-[var(--app-text-muted)]')}>
              {item.label}
            </p>
            <p className={cn('text-sm font-bold tabular-nums', item.color)}>
              {formatAmount(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Total Liability */}
      <div className={cn(
        'flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border',
        isDark
          ? 'bg-red-500/[0.04] border-red-500/[0.1]'
          : 'bg-red-50 border-red-100'
      )}>
        <div className="flex items-center gap-2">
          {filingStatus === 'overdue' && <AlertTriangle className="w-4 h-4 text-red-500" />}
          <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
            Total Tax Liability
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-red-500 tabular-nums">{formatAmount(taxLiability)}</span>
          <ChevronRight className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
        </div>
      </div>
    </motion.div>
  );
}
