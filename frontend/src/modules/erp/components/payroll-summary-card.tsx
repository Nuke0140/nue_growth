'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Banknote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayrollRecord, PayrollStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<PayrollStatus, { label: string; color: string; bgDark: string; bgLight: string; borderDark: string; borderLight: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    borderDark: 'border-amber-500/20',
    borderLight: 'border-amber-200',
  },
  processed: {
    label: 'Processed',
    color: 'text-blue-500',
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    borderDark: 'border-blue-500/20',
    borderLight: 'border-blue-200',
  },
  paid: {
    label: 'Paid',
    color: 'text-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    borderDark: 'border-emerald-500/20',
    borderLight: 'border-emerald-200',
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const status = statusConfig[record.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4 shadow-sm transition-colors duration-200',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.01]'
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
            <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
              {record.department}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border shrink-0',
            isDark ? `${status.bgDark} ${status.color} ${status.borderDark}` : `${status.bgLight} ${status.color} ${status.borderLight}`
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
            <Wallet className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
            <span className={cn('text-[11px]', isDark ? 'text-white/50' : 'text-black/50')}>Base Salary</span>
          </div>
          <span className={cn('text-[11px] font-medium', isDark ? 'text-white/70' : 'text-black/70')}>
            {formatCurrency(record.baseSalary)}
          </span>
        </div>

        {/* Incentives */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            <span className={cn('text-[11px]', isDark ? 'text-white/50' : 'text-black/50')}>Incentives</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500">
            +{formatCurrency(record.incentives)}
          </span>
        </div>

        {/* Deductions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowDownRight className="w-3 h-3 text-red-500" />
            <span className={cn('text-[11px]', isDark ? 'text-white/50' : 'text-black/50')}>Deductions</span>
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
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }} />
            <span className={cn('text-[11px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
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
        <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
          {record.month}
        </span>
        <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
          ID: {record.employeeId}
        </span>
      </div>
    </motion.div>
  );
}
