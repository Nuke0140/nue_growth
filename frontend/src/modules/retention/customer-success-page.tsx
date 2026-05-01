'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Target, Calendar, CheckCircle2, Clock, AlertTriangle, ChevronRight,
  Users, BarChart3, BrainCircuit, Heart, Milestone, CircleDot
} from 'lucide-react';
import { successPlans } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { SuccessPlan, SuccessMilestone } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Completed' },
  'in-progress': { icon: CircleDot, color: 'text-sky-500', bg: 'bg-sky-500/10', label: 'In Progress' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Pending' },
  overdue: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Overdue' },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  onboarding: { label: 'Onboarding', color: 'bg-sky-500/15 text-sky-400' },
  qbr: { label: 'QBR', color: 'bg-violet-500/15 text-violet-400' },
  'value-realization': { label: 'Value Realization', color: 'bg-emerald-500/15 text-emerald-400' },
  health: { label: 'Health', color: 'bg-amber-500/15 text-amber-400' },
  expansion: { label: 'Expansion', color: 'bg-rose-500/15 text-rose-400' },
};

function HealthRing({ score, isDark }: { score: number; isDark: boolean }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" className={cn('stroke-[3]', isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]')} />
        <motion.circle
          cx="22" cy="22" r={radius} fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          className={color}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-[10px] font-bold', color)}>{score}</span>
      </div>
    </div>
  );
}

export default function CustomerSuccessPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  // Aggregate stats
  const stats = useMemo(() => {
    const allMilestones = successPlans.flatMap((p: SuccessPlan) => p.milestones);
    const completed = allMilestones.filter((m: SuccessMilestone) => m.status === 'completed').length;
    const inProgress = allMilestones.filter((m: SuccessMilestone) => m.status === 'in-progress').length;
    const overdue = allMilestones.filter((m: SuccessMilestone) => m.status === 'overdue').length;
    const totalValueDelivered = successPlans.reduce((s, p) => s + p.valueDelivered, 0);
    const totalValueTarget = successPlans.reduce((s, p) => s + p.valueTarget, 0);
    const avgHealth = successPlans.reduce((s, p) => s + p.healthScore, 0) / successPlans.length;
    return { total: allMilestones.length, completed, inProgress, overdue, totalValueDelivered, totalValueTarget, avgHealth };
  }, []);

  // QBR calendar
  const qbrCalendar = useMemo(() =>
    successPlans
      .map((p: SuccessPlan) => ({
        client: p.client,
        lastQBR: p.lastQBR,
        nextQBR: p.nextQBR,
        accountManager: p.accountManager,
        healthScore: p.healthScore,
      }))
      .sort((a, b) => new Date(a.nextQBR).getTime() - new Date(b.nextQBR).getTime()),
    []
  );

  // Value realization chart
  const valueData = useMemo(() =>
    successPlans.map((p: SuccessPlan) => ({
      client: p.client,
      delivered: p.valueDelivered,
      target: p.valueTarget,
      pct: Math.round((p.valueDelivered / p.valueTarget) * 100),
    })),
    []
  );
  const maxValue = Math.max(...valueData.map((d) => d.target), 1);

  // KPI stats
  const kpiStats = useMemo(() => [
    { label: 'Active Plans', value: `${successPlans.length}`, icon: Target, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 0, changeLabel: 'success plans active' },
    { label: 'Avg Health Score', value: `${stats.avgHealth.toFixed(0)}`, icon: Heart, color: 'text-rose-400', bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50', change: 4.2, changeLabel: 'portfolio health' },
    { label: 'Value Delivered', value: formatINR(stats.totalValueDelivered), icon: BarChart3, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 12.5, changeLabel: `of ${formatINR(stats.totalValueTarget)} target` },
    { label: 'Milestones Done', value: `${stats.completed}/${stats.total}`, icon: CheckCircle2, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 0, changeLabel: `${stats.overdue} overdue` },
    { label: 'Next QBR', value: qbrCalendar[0]?.nextQBR.split('-').slice(1).reverse().join('/') || '—', icon: Calendar, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: 0, changeLabel: qbrCalendar[0]?.client || '' },
  ], [isDark, stats, qbrCalendar]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}>
              <Users className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Customer Success</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Post-Sales Relationship Cockpit</p>
            </div>
          </div>
          <Badge variant="secondary" className={cn(
            'px-3 py-1.5 text-xs font-medium gap-1.5',
            isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
          )}>
            <Target className="w-3.5 h-3.5" />
            {successPlans.length} Active Plans
          </Badge>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4 transition-all duration-200',
                isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  {stat.label}
                </span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                {stat.change > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                    ↑ {stat.change}%
                  </span>
                )}
              </div>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>{stat.changeLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Success Plans */}
        {successPlans.map((plan: SuccessPlan, planIdx) => {
          const overdueMilestones = plan.milestones.filter((m: SuccessMilestone) => m.status === 'overdue');
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + planIdx * 0.1, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-5',
                overdueMilestones.length > 0
                  ? (isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50/50 border-red-200')
                  : (isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')
              )}
            >
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <HealthRing score={plan.healthScore} isDark={isDark} />
                  <div>
                    <h3 className="text-sm font-bold">{plan.client}</h3>
                    <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                      {plan.accountManager} · Started {plan.startDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={cn('text-[10px] block', isDark ? 'text-white/30' : 'text-black/30')}>Value Delivered</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{formatINR(plan.valueDelivered)}</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>/ {formatINR(plan.valueTarget)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Last QBR:</span>
                    <span className="text-[10px] font-medium">{plan.lastQBR}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Next QBR:</span>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {plan.nextQBR}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-[10px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                    Value Realization
                  </span>
                  <span className={cn('text-[10px] font-medium', plan.valueDelivered >= plan.valueTarget ? 'text-emerald-500' : 'text-amber-500')}>
                    {Math.round((plan.valueDelivered / plan.valueTarget) * 100)}%
                  </span>
                </div>
                <div className={cn('h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((plan.valueDelivered / plan.valueTarget) * 100, 100)}%` }}
                    transition={{ delay: 0.3 + planIdx * 0.1, duration: 0.15 }}
                    className={cn(
                      'h-full rounded-full',
                      plan.valueDelivered >= plan.valueTarget ? 'bg-emerald-500' : 'bg-amber-500'
                    )}
                  />
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="space-y-2">
                <span className={cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  Milestones
                </span>
                {plan.milestones.map((ms: SuccessMilestone, msIdx) => {
                  const sConfig = statusConfig[ms.status];
                  const cConfig = categoryConfig[ms.category];
                  const StatusIcon = sConfig.icon;
                  return (
                    <motion.div
                      key={ms.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + planIdx * 0.1 + msIdx * 0.05, duration: 0.3 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                        ms.status === 'overdue'
                          ? (isDark ? 'border-red-500/20 bg-red-500/[0.04]' : 'border-red-200 bg-red-50')
                          : (isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.01]')
                      )}
                    >
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', sConfig.bg)}>
                        <StatusIcon className={cn('w-3.5 h-3.5', sConfig.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium truncate">{ms.milestone}</span>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', cConfig.color)}>
                            {cConfig.label}
                          </Badge>
                          {ms.status === 'overdue' && (
                            <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600')}>
                              OVERDUE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                            Due: {ms.dueDate}
                          </span>
                          <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>·</span>
                          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                            Owner: {ms.owner}
                          </span>
                          {ms.notes && (
                            <>
                              <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>·</span>
                              <span className="text-[10px] text-red-400 truncate max-w-[200px]">{ms.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* QBR Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                QBR Calendar
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {qbrCalendar.map((qbr, j) => (
              <motion.div
                key={qbr.client}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + j * 0.06, duration: 0.3 }}
                className={cn(
                  'rounded-xl border p-3',
                  isDark ? 'border-white/[0.04] bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{qbr.client}</span>
                  <span className={cn('text-[10px] font-medium', qbr.healthScore >= 80 ? 'text-emerald-500' : qbr.healthScore >= 60 ? 'text-amber-500' : 'text-red-500')}>
                    Health: {qbr.healthScore}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Last:</span>
                  <span className="text-[10px] font-medium">{qbr.lastQBR}</span>
                  <span className={cn('text-[10px] mx-1', isDark ? 'text-white/15' : 'text-black/15')}>→</span>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Next:</span>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0">{qbr.nextQBR}</Badge>
                </div>
                <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>{qbr.accountManager}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Value Realization Chart */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                Value Realization Summary
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')} />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Delivered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-white/15' : 'bg-black/15')} />
                <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Target</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-36">
            {valueData.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                  {entry.pct}%
                </span>
                <div className="flex gap-0.5 w-full items-end h-24">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.delivered / maxValue) * 100}%` }}
                    transition={{ delay: 0.6 + j * 0.08, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', isDark ? 'bg-emerald-500/30' : 'bg-emerald-400')}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.target / maxValue) * 100}%` }}
                    transition={{ delay: 0.65 + j * 0.08, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('flex-1 rounded-t-sm', isDark ? 'bg-white/10' : 'bg-black/10')}
                  />
                </div>
                <span className={cn('text-[9px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{entry.client}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Advocacy', value: '8 entries', page: 'advocacy' as const, icon: Target, color: 'text-violet-400' },
            { label: 'LTV Forecast', value: '5 segments', page: 'ltv-forecast' as const, icon: BrainCircuit, color: 'text-amber-400' },
            { label: 'AI Growth Coach', value: '8 insights', page: 'ai-growth-coach' as const, icon: BrainCircuit, color: 'text-emerald-400' },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', nav.color)} />
                <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', isDark ? 'text-white/15' : 'text-black/15')} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{nav.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
