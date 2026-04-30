'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  RefreshCw, IndianRupee, ShieldCheck, ShieldAlert, Clock, AlertTriangle,
  FileText, User, Calendar, Zap, ChevronRight, ArrowUpRight, Tag,
  MessageSquare, CheckCircle2, XCircle, Timer, FilePlus2, Brain
} from 'lucide-react';
import { renewalsData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { Renewal } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

export default function RenewalCenterPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = ['all', 'on-track', 'at-risk', 'overdue', 'lost'];

  const summary = useMemo(() => {
    const total = renewalsData.reduce((s, r) => s + r.contractValue, 0);
    const onTrack = renewalsData.filter((r) => r.status === 'on-track').length;
    const atRisk = renewalsData.filter((r) => r.status === 'at-risk').length;
    const overdue = renewalsData.filter((r) => r.status === 'overdue').length;
    return { total, onTrack, atRisk, overdue };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return renewalsData;
    return renewalsData.filter((r) => r.status === activeTab);
  }, [activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return { bg: 'bg-[var(--app-success-bg)]', text: 'text-emerald-500', label: 'On-Track', icon: CheckCircle2 };
      case 'at-risk': return { bg: 'bg-[var(--app-warning-bg)]', text: 'text-amber-500', label: 'At-Risk', icon: ShieldAlert };
      case 'overdue': return { bg: 'bg-[var(--app-danger-bg)]', text: 'text-red-500', label: 'Overdue', icon: AlertTriangle };
      case 'lost': return { bg: isDark ? 'bg-slate-500/15' : 'bg-slate-100', text: 'text-slate-500', label: 'Lost', icon: XCircle };
      default: return { bg: 'bg-[var(--app-hover-bg)]', text: '', label: status, icon: Clock };
    }
  };

  const getProbColor = (prob: number) => {
    if (prob >= 80) return isDark ? 'bg-emerald-500/40' : 'bg-emerald-400';
    if (prob >= 50) return isDark ? 'bg-amber-500/40' : 'bg-amber-400';
    return isDark ? 'bg-red-500/40' : 'bg-red-400';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <RefreshCw className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Renewal Center</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Renewal Workspace</p>
            </div>
          </div>
          <Button
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}
          >
            <FilePlus2 className="w-4 h-4" />
            Generate Proposal
          </Button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Renewal Value', value: formatINR(summary.total), icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
            { label: 'On-Track', value: summary.onTrack.toString(), icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
            { label: 'At-Risk', value: summary.atRisk.toString(), icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
            { label: 'Overdue', value: summary.overdue.toString(), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', item.bg)}>
                  <item.icon className={cn('w-4 h-4', item.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-medium rounded-[var(--app-radius-lg)] transition-colors capitalize',
                activeTab === tab
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
              )}
            >
              {tab === 'all' ? `All (${renewalsData.length})` : `${tab} (${renewalsData.filter((r) => r.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Renewal Cards */}
        <div className="space-y-3">
          {filtered.map((renewal: Renewal, i) => {
            const statusBadge = getStatusBadge(renewal.status);
            const StatusIcon = statusBadge.icon;
            return (
              <motion.div
                key={renewal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors',
                  renewal.status === 'overdue'
                    ? (isDark ? 'bg-red-500/[0.03] border-red-500/15' : 'bg-red-50/50 border-red-200')
                    : renewal.status === 'lost'
                      ? (isDark ? 'bg-slate-500/[0.03] border-slate-500/15' : 'bg-slate-50/50 border-slate-200')
                      : ('bg-[var(--app-card-bg)] border-[var(--app-border)]')
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{renewal.client}</h3>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 gap-1', statusBadge.bg, statusBadge.text)}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {statusBadge.label}
                        </Badge>
                        {renewal.discountApproved && (
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 gap-1', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
                            <Tag className="w-2.5 h-2.5" />
                            {renewal.discountApproved}% discount
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          <Calendar className="w-4 h-4 inline mr-1" />{renewal.renewalDate}
                        </span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {renewal.contractPeriod}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatINR(renewal.contractValue)}</p>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <div className={cn('w-20 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${renewal.renewalProbability}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                            className={cn('h-full rounded-full', getProbColor(renewal.renewalProbability))}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium', renewal.renewalProbability >= 80 ? 'text-emerald-500' : renewal.renewalProbability >= 50 ? 'text-amber-500' : 'text-red-500')}>
                          {renewal.renewalProbability}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    <User className="w-4 h-4 inline mr-1" />{renewal.accountManager}
                  </span>
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    <MessageSquare className="w-4 h-4 inline mr-1" />{renewal.lastTouchpoint}
                  </span>
                  <span className={cn('text-[10px] font-medium', isDark ? 'text-violet-400/70' : 'text-violet-600')}>
                    <ArrowUpRight className="w-4 h-4 inline mr-1" />{renewal.nextStep}
                  </span>
                </div>

                {/* Negotiation Notes */}
                {renewal.negotiationNotes && (
                  <div className={cn(
                    'mt-2 p-2.5 rounded-[var(--app-radius-lg)] text-[10px] leading-relaxed',
                    renewal.status === 'overdue'
                      ? (isDark ? 'bg-red-500/[0.06] text-red-400/70' : 'bg-red-100/60 text-red-700')
                      : (isDark ? 'bg-amber-500/[0.06] text-amber-400/70' : 'bg-amber-100/60 text-amber-700')
                  )}>
                    <span className="font-medium">Notes: </span>{renewal.negotiationNotes}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Timeline View — Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Upcoming Renewal Timeline</span>
          </div>
          <div className="relative">
            <div className={cn('absolute left-3 top-0 bottom-0 w-px', 'bg-[var(--app-hover-bg)]')} />
            <div className="space-y-3">
              {[...renewalsData]
                .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
                .filter((r) => r.status !== 'lost')
                .map((r, i) => {
                  const statusBadge = getStatusBadge(r.status);
                  const StatusIcon = statusBadge.icon;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-3 ml-1"
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 z-10',
                        r.status === 'on-track' ? 'border-emerald-500 bg-emerald-500/10'
                          : r.status === 'at-risk' ? 'border-amber-500 bg-amber-500/10'
                            : 'border-red-500 bg-red-500/10'
                      )}>
                        <StatusIcon className={cn('w-2.5 h-2.5', statusBadge.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{r.client}</span>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', statusBadge.bg, statusBadge.text)}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {r.renewalDate} • {formatINR(r.contractValue)} • {r.accountManager}
                        </p>
                      </div>
                      <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{r.renewalProbability}%</span>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
