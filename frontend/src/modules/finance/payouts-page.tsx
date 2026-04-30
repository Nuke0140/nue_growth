'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plus, Send, CheckCircle2, Clock, AlertTriangle, RefreshCw,
  AlertCircle, Banknote, ArrowUpRight, Layers, CreditCard, Building2,
} from 'lucide-react';
import { payouts } from '@/modules/finance/data/mock-data';
import type { Payout } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const statusConfig: Record<string, { label: string; color: string; bgDark: string; bgLight: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bgDark: 'bg-amber-500/15', bgLight: 'bg-amber-50 text-amber-600', icon: Clock },
  processing: { label: 'Processing', color: 'text-sky-400', bgDark: 'bg-sky-500/15', bgLight: 'bg-sky-50 text-sky-600', icon: RefreshCw },
  completed: { label: 'Completed', color: 'text-emerald-400', bgDark: 'bg-emerald-500/15', bgLight: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'text-red-400', bgDark: 'bg-red-500/15', bgLight: 'bg-red-50 text-red-600', icon: AlertCircle },
  retrying: { label: 'Retrying', color: 'text-orange-400', bgDark: 'bg-orange-500/15', bgLight: 'bg-orange-50 text-orange-600', icon: RefreshCw },
};

const typeConfig: Record<string, { bgDark: string; bgLight: string }> = {
  freelancer: { bgDark: 'bg-violet-500/15 text-violet-400', bgLight: 'bg-violet-50 text-violet-600' },
  vendor: { bgDark: 'bg-sky-500/15 text-sky-400', bgLight: 'bg-sky-50 text-sky-600' },
  refund: { bgDark: 'bg-red-500/15 text-red-400', bgLight: 'bg-red-50 text-red-600' },
  salary: { bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  reimbursement: { bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
};

const methodConfig: Record<string, { bgDark: string; bgLight: string }> = {
  razorpay: { bgDark: 'bg-blue-500/15 text-blue-400', bgLight: 'bg-blue-50 text-blue-600' },
  upi: { bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  'bank-transfer': { bgDark: 'bg-slate-500/15 text-slate-400', bgLight: 'bg-slate-50 text-slate-600' },
  cheque: { bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
};

export default function PayoutsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pendingPayouts = useMemo(() => payouts.filter(p => p.status === 'pending'), []);
  const processingPayouts = useMemo(() => payouts.filter(p => p.status === 'processing'), []);
  const completedPayouts = useMemo(() => payouts.filter(p => p.status === 'completed'), []);
  const failedPayouts = useMemo(() => payouts.filter(p => p.status === 'failed'), []);

  const totalPayoutAmount = useMemo(() => payouts.reduce((s, p) => s + p.amount, 0), []);
  const pendingAmount = useMemo(() => pendingPayouts.reduce((s, p) => s + p.amount, 0), []);

  const kpiStats = [
    { label: 'Pending', value: pendingPayouts.length.toString(), amount: formatINR(pendingAmount), icon: Clock, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    { label: 'Processing', value: processingPayouts.length.toString(), icon: RefreshCw, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
    { label: 'Completed', value: completedPayouts.length.toString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Failed', value: failedPayouts.length.toString(), icon: AlertCircle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Send className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Payouts</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Payout Center</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Plus className="w-4 h-4" /> New Payout
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4 cursor-pointer transition-all duration-200', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              {stat.amount && <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{stat.amount}</p>}
            </motion.div>
          ))}
        </div>

        {/* Pending Approval Queue */}
        {pendingPayouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-amber-500/[0.03] border-amber-500/[0.12]' : 'bg-amber-50/50 border-amber-200/60')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-500">Approval Queue</span>
                <Badge variant="secondary" className="text-[10px] bg-amber-500/15 text-amber-400">{pendingPayouts.length} pending</Badge>
              </div>
            </div>
            <div className="space-y-2">
              {pendingPayouts.map((payout: Payout, i) => {
                const tConf = typeConfig[payout.type];
                const mConf = methodConfig[payout.method];
                return (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
                    className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border', isDark ? 'border-amber-500/10 bg-amber-500/[0.02]' : 'border-amber-200/40 bg-white/60')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                        <Send className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{payout.beneficiary}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', isDark ? tConf.bgDark : tConf.bgLight)}>
                            {payout.type}
                          </Badge>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? mConf.bgDark : mConf.bgLight)}>
                            {payout.method}
                          </Badge>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{payout.initiatedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatINR(payout.amount)}</span>
                      <Button size="sm" className={cn('text-xs px-3 py-1.5 rounded-lg', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                        Approve
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* All Payouts List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Banknote className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>All Payouts</span>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                {payouts.length} total • {formatINR(totalPayoutAmount)}
              </Badge>
            </div>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {payouts.map((payout: Payout, i) => {
              const sConf = statusConfig[payout.status];
              const tConf = typeConfig[payout.type];
              const mConf = methodConfig[payout.method];
              const StatusIcon = sConf.icon;
              return (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.3 }}
                  className={cn('p-4 rounded-xl border transition-colors cursor-pointer', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]', payout.status === 'failed' && (isDark ? 'bg-red-500/[0.02]' : 'bg-red-50/20'))}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', 'bg-[var(--app-hover-bg)]')}>
                        <StatusIcon className={cn('w-4 h-4', sConf.color)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{payout.beneficiary}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', isDark ? tConf.bgDark : tConf.bgLight)}>
                            {payout.type}
                          </Badge>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? mConf.bgDark : mConf.bgLight)}>
                            {payout.method}
                          </Badge>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{payout.initiatedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-semibold">{formatINR(payout.amount)}</span>
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? sConf.bgDark : sConf.bgLight)}>
                        {sConf.label}
                      </Badge>
                      {payout.status === 'failed' && (
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 rounded-lg border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1">
                          <RefreshCw className="w-3 h-3" /> Retry
                        </Button>
                      )}
                    </div>
                  </div>
                  {payout.utrNumber && (
                    <div className="mt-2 ml-12">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>UTR: </span>
                      <span className="text-[10px] font-mono">{payout.utrNumber}</span>
                    </div>
                  )}
                  {payout.failureReason && (
                    <div className="mt-2 ml-12 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] text-red-500">{payout.failureReason}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Batch Processing Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Batch Processing</span>
          </div>
          <div className={cn('flex items-center justify-between p-4 rounded-xl border', isDark ? 'border-dashed border-white/[0.1] bg-white/[0.01]' : 'border-dashed border-black/[0.1] bg-black/[0.01]')}>
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                <Layers className={cn('w-5 h-5', 'text-[var(--app-text-muted)]')} />
              </div>
              <div>
                <p className="text-sm font-medium">Batch Payout Processing</p>
                <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Select multiple approved payouts for batch processing</p>
              </div>
            </div>
            <Button variant="outline" className={cn('px-3 py-2 text-xs font-medium rounded-xl gap-2 border', isDark ? 'border-white/[0.1] text-white/60 hover:bg-white/[0.05]' : 'border-black/[0.1] text-black/60 hover:bg-black/[0.05]')}>
              <ArrowUpRight className="w-3.5 h-3.5" /> Open Batch Queue
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
