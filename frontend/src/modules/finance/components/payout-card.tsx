'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Banknote, Clock, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';

function getStatusConfig(status: PayoutStatus, isDark: boolean) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        icon: <Clock className="w-4 h-4" />,
        dotColor: 'bg-amber-500',
        bgDark: 'bg-amber-500/15',
        bgLight: 'bg-amber-50',
        textDark: 'text-amber-400',
        textLight: 'text-amber-600',
        borderDark: 'border-amber-500/20',
        borderLight: 'border-amber-200',
      };
    case 'processing':
      return {
        label: 'Processing',
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        dotColor: 'bg-blue-500',
        bgDark: 'bg-blue-500/15',
        bgLight: 'bg-blue-50',
        textDark: 'text-blue-400',
        textLight: 'text-blue-600',
        borderDark: 'border-blue-500/20',
        borderLight: 'border-blue-200',
      };
    case 'completed':
      return {
        label: 'Completed',
        icon: <CheckCircle className="w-4 h-4" />,
        dotColor: 'bg-emerald-500',
        bgDark: 'bg-emerald-500/15',
        bgLight: 'bg-emerald-50',
        textDark: 'text-emerald-400',
        textLight: 'text-emerald-600',
        borderDark: 'border-emerald-500/20',
        borderLight: 'border-emerald-200',
      };
    case 'failed':
      return {
        label: 'Failed',
        icon: <XCircle className="w-4 h-4" />,
        dotColor: 'bg-red-500',
        bgDark: 'bg-red-500/15',
        bgLight: 'bg-red-50',
        textDark: 'text-red-400',
        textLight: 'text-red-600',
        borderDark: 'border-red-500/20',
        borderLight: 'border-red-200',
      };
    case 'retrying':
      return {
        label: 'Retrying',
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        dotColor: 'bg-orange-500',
        bgDark: 'bg-orange-500/15',
        bgLight: 'bg-orange-50',
        textDark: 'text-orange-400',
        textLight: 'text-orange-600',
        borderDark: 'border-orange-500/20',
        borderLight: 'border-orange-200',
      };
  }
}

function getMethodLabel(method: string) {
  const map: Record<string, string> = {
    'razorpay': 'Razorpay',
    'upi': 'UPI',
    'bank-transfer': 'Bank Transfer',
    'neft': 'NEFT',
    'imps': 'IMPS',
    'rtgs': 'RTGS',
  };
  return map[method.toLowerCase()] || method;
}

// ─── Component ────────────────────────────────────────────
interface PayoutCardProps {
  beneficiary: string;
  type: string;
  amount: number;
  method: string;
  status: PayoutStatus;
  initiatedDate: string;
  failureReason?: string;
}

export default function PayoutCard({
  beneficiary,
  type,
  amount,
  method,
  status,
  initiatedDate,
  failureReason,
}: PayoutCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sc = getStatusConfig(status, isDark);
  const isFailed = status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06]',
        isFailed && (isDark ? 'border-red-500/20' : 'border-red-200')
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
            isDark ? 'bg-emerald-500/10' : 'bg-emerald-100'
          )}>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
              {beneficiary}
            </p>
            <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
              {type} &middot; {initiatedDate}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0',
            isDark
              ? `${sc.bgDark} ${sc.textDark} ${sc.borderDark}`
              : `${sc.bgLight} ${sc.textLight} ${sc.borderLight}`
          )}
        >
          {sc.icon}
          {sc.label}
        </Badge>
      </div>

      {/* Amount + Method */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-emerald-500 tabular-nums">{formatAmount(amount)}</span>
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium border',
          isDark
            ? 'bg-white/[0.04] text-white/50 border-white/[0.08]'
            : 'bg-black/[0.03] text-black/50 border-black/[0.08]'
        )}>
          {getMethodLabel(method)}
        </span>
      </div>

      {/* Failure reason */}
      {isFailed && failureReason && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            'flex items-start gap-2 p-2.5 rounded-[var(--app-radius-lg)] mt-2',
            isDark
              ? 'bg-red-500/[0.06] border border-red-500/[0.1]'
              : 'bg-red-50 border border-red-100'
          )}
        >
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-danger)]')}>
            {failureReason}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
