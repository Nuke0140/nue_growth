'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, CreditCard, Clock, AlertTriangle, MessageCircle, BrainCircuit,
  ChevronRight, ArrowUpRight, ArrowDownRight, Filter, Phone, Mail,
  Send, User, FileText, Zap
} from 'lucide-react';
import { receivables } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Receivable } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type AgingFilter = 'all' | '0-30' | '31-60' | '61-90' | '90+';

const agingBuckets: { label: string; value: AgingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '0-30 days', value: '0-30' },
  { label: '31-60 days', value: '31-60' },
  { label: '61-90 days', value: '61-90' },
  { label: '90+ days', value: '90+' },
];

const stageColors: Record<string, { color: string; bg: string }> = {
  'first-reminder': { color: 'text-amber-400', bg: isDark => 'bg-[var(--app-warning-bg)]', bgLight: 'bg-amber-50', bgDark: 'bg-amber-500/15' },
  'second-reminder': { color: 'text-orange-400', bgLight: 'bg-orange-50', bgDark: 'bg-orange-500/15' },
  'escalation': { color: 'text-red-400', bgLight: 'bg-red-50', bgDark: 'bg-red-500/15' },
  'legal': { color: 'text-red-500', bgLight: 'bg-red-100', bgDark: 'bg-red-500/20' },
  'resolved': { color: 'text-emerald-400', bgLight: 'bg-emerald-50', bgDark: 'bg-emerald-500/15' },
};

export default function ReceivablesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [agingFilter, setAgingFilter] = useState<AgingFilter>('all');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const totalOutstanding = useMemo(() =>
    receivables.reduce((s: number, r: Receivable) => s + r.dueAmount, 0),
    []
  );

  const agingSummary = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    receivables.forEach((r: Receivable) => { buckets[r.agingBucket] += r.dueAmount; });
    return [
      { label: '0-30 days', key: '0-30' as const, value: buckets['0-30'], color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200' },
      { label: '31-60 days', key: '31-60' as const, value: buckets['31-60'], color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', border: isDark ? 'border-amber-500/20' : 'border-amber-200' },
      { label: '61-90 days', key: '61-90' as const, value: buckets['61-90'], color: 'text-orange-400', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50', border: isDark ? 'border-orange-500/20' : 'border-orange-200' },
      { label: '90+ days', key: '90+' as const, value: buckets['90+'], color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', border: isDark ? 'border-red-500/20' : 'border-red-200' },
    ];
  }, [isDark]);

  const filteredReceivables = useMemo(() =>
    agingFilter === 'all' ? receivables : receivables.filter((r: Receivable) => r.agingBucket === agingFilter),
    [agingFilter]
  );

  const stageConfig = (stage: string) => {
    const configs: Record<string, { bg: string; text: string }> = {
      'first-reminder': { bg: 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]', text: '1st Reminder' },
      'second-reminder': { bg: isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600', text: '2nd Reminder' },
      'escalation': { bg: 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]', text: 'Escalation' },
      'legal': { bg: isDark ? 'bg-red-500/20 text-red-500' : 'bg-red-100 text-red-700', text: 'Legal' },
      'resolved': { bg: 'bg-[var(--app-success-bg)] text-[var(--app-success)]', text: 'Resolved' },
    };
    return configs[stage] || { bg: 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]', text: stage };
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return 'bg-emerald-500';
    if (prob >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getRecoveryPriority = (r: Receivable) => {
    if (r.overdueDays > 30 && r.paymentProbability < 50) return { label: 'Critical', color: 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]' };
    if (r.overdueDays > 15 || r.followUpStage === 'escalation') return { label: 'High', color: isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600' };
    if (r.overdueDays > 0) return { label: 'Medium', color: 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]' };
    return { label: 'Low', color: 'bg-[var(--app-success-bg)] text-[var(--app-success)]' };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <CreditCard className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Receivables</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Total Outstanding: <span className="text-red-500 font-semibold">{formatINR(totalOutstanding)}</span>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={cn(
            'px-3 py-1.5 text-xs font-medium gap-1.5',
            'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
          )}>
            <Calendar className="w-4 h-4" />
            {today}
          </Badge>
        </div>

        {/* Aging Bucket Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agingSummary.map((bucket, i) => (
            <motion.div
              key={bucket.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setAgingFilter(bucket.key === agingFilter ? 'all' : bucket.key)}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200',
                bucket.border,
                agingFilter === bucket.key
                  ? ('bg-[var(--app-hover-bg)]')
                  : bucket.bg
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  {bucket.label}
                </span>
                <span className={cn('text-[10px] font-medium', bucket.color)}>
                  {receivables.filter((r: Receivable) => r.agingBucket === bucket.key).length} invoices
                </span>
              </div>
              <p className={cn('text-2xl font-bold tracking-tight', bucket.color)}>{formatINR(bucket.value)}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
          {agingBuckets.map((b) => (
            <button
              key={b.value}
              onClick={() => setAgingFilter(b.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[var(--app-radius-lg)] transition-colors',
                agingFilter === b.value
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
              )}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Receivables Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Client', 'Invoice No', 'Project', 'Due Amount', 'Overdue', 'Owner', 'Probability', 'Expected', 'Stage', 'Priority', 'Actions'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-2', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReceivables.length === 0 ? (
                  <tr>
                    <td colSpan={11} className={cn('py-app-3xl text-center text-sm', 'text-[var(--app-text-muted)]')}>
                      No data for this aging bucket
                    </td>
                  </tr>
                ) : (
                  filteredReceivables.map((r: Receivable, i) => {
                    const stageConf = stageConfig(r.followUpStage);
                    const priority = getRecoveryPriority(r);
                    return (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.04 }}
                        className={cn(
                          'border-b cursor-pointer transition-colors',
                          'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                        )}
                      >
                        <td className="py-3 px-2">
                          <p className="text-sm font-medium">{r.client}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm font-mono">{r.invoiceNo}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>{r.project}</span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-sm font-semibold">{formatINR(r.dueAmount)}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span className={cn(
                            'text-sm font-semibold',
                            r.overdueDays > 30 ? 'text-red-500' : r.overdueDays > 0 ? 'text-amber-500' : 'text-emerald-500'
                          )}>
                            {r.overdueDays > 0 ? `${r.overdueDays}d` : 'Current'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span className="text-xs">{r.assignedOwner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-16 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                              <div className={cn('h-full rounded-full', getProbabilityColor(r.paymentProbability))} style={{ width: `${r.paymentProbability}%` }} />
                            </div>
                            <span className="text-[10px] font-medium">{r.paymentProbability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-xs">{r.expectedPaymentDate}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', stageConf.bg)}>
                            {stageConf.text}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', priority.color)}>
                            <BrainCircuit className="w-2.5 h-2.5 mr-0.5" />
                            {priority.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className={cn('h-8  w-7 p-0', 'hover:bg-[var(--app-hover-bg)]')}>
                              <MessageCircle className="w-4 h-4 text-emerald-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className={cn('h-8  w-7 p-0', 'hover:bg-[var(--app-hover-bg)]')}>
                              <Send className="w-4 h-4 text-sky-500" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* WhatsApp CTA Section */}
        {filteredReceivables.some((r: Receivable) => r.overdueDays > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              isDark ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', isDark ? 'bg-emerald-500/15' : 'bg-emerald-100')}>
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Bulk WhatsApp Reminder</p>
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                    Send payment reminders to {filteredReceivables.filter((r: Receivable) => r.overdueDays > 0).length} overdue clients
                  </p>
                </div>
              </div>
              <Button className={cn(
                'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2',
                isDark ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              )}>
                <MessageCircle className="w-4 h-4" />
                Send Reminders
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
