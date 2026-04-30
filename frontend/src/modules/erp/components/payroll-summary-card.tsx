'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Banknote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayrollRecord, PayrollStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<PayrollStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  processed: {
    label: 'Processed',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  paid: {
    label: 'Paid',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
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

function formatCurrency(value: number) {
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-emerald-500/20 text-emerald-400',
    'bg-sky-500/20 text-sky-400',
    'bg-amber-500/20 text-amber-400',
    'bg-rose-500/20 text-rose-400',
    'bg-violet-500/20 text-violet-400',
    'bg-teal-500/20 text-teal-400',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// ─── Component ────────────────────────────────────────────
interface PayrollSummaryCardProps {
  record: PayrollRecord;
}

export default function PayrollSummaryCard({ record }: PayrollSummaryCardProps) {
  const status = statusConfig[record.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4 shadow-sm transition-colors duration-200',
        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-hover-bg)]'
      )}
    >
      {/* Top: Avatar + Name + Department + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
            getAvatarColor(record.employeeName)
          )}>
            {getInitials(record.employeeName)}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold truncate">{record.employeeName}</h4>
            <p className="text-[10px] text-[var(--app-text-muted)]">
              {record.department}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border shrink-0',
            `${status.bg} ${status.color} ${status.border}`
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Salary Breakdown */}
      <div className="space-y-1.5 mb-3">
        {/* Base Salary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3 h-3 text-[var(--app-text-muted)]" />
            <span className="text-[11px] text-[var(--app-text-secondary)]">Base Salary</span>
          </div>
          <span className="text-[11px] font-medium text-[var(--app-text)]">
            {formatCurrency(record.baseSalary)}
          </span>
        </div>

        {/* Incentives */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] text-[var(--app-text-secondary)]">Incentives</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500">
            +{formatCurrency(record.incentives)}
          </span>
        </div>

        {/* Deductions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowDownRight className="w-3 h-3 text-red-500" />
            <span className="text-[11px] text-[var(--app-text-secondary)]">Deductions</span>
          </div>
          <span className="text-[11px] font-medium text-red-500">
            -{formatCurrency(record.deductions)}
          </span>
        </div>
      </div>

      {/* Net Pay */}
      <div
        className={cn(
          'pt-3 border-t',
          'border-[var(--app-border)]'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-[var(--app-text-secondary)]" />
            <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
              Net Pay
            </span>
          </div>
          <span className="text-sm font-bold">
            {formatCurrency(record.netPay)}
          </span>
        </div>
      </div>

      {/* Month footer */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] text-[var(--app-text-disabled)]">
          {record.month}
        </span>
        <span className="text-[9px] text-[var(--app-text-disabled)]">
          ID: {record.employeeId}
        </span>
      </div>
    </motion.div>
  );
}
