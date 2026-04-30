'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, Pause, Play,
  Timer, TrendingUp, TrendingDown, Users, BarChart3, Activity,
} from 'lucide-react';
import SLAAlertChip from './components/sla-alert-chip';
import { slaRules } from './data/mock-data';

const MODULE_COLORS: Record<string, string> = {
  CRM: 'bg-blue-500/15 text-blue-400',
  Support: 'bg-emerald-500/15 text-emerald-400',
  Finance: 'bg-amber-500/15 text-amber-400',
  DevOps: 'bg-purple-500/15 text-purple-400',
};

const EXAMPLE_ALERTS = [
  { ruleName: 'Lead Response SLA Warning', severity: 'warning' as const, timeRemaining: '12m remaining' },
  { ruleName: 'Invoice Overdue Escalation', severity: 'critical' as const, timeRemaining: 'Breach imminent' },
  { ruleName: 'Support Ticket Timer Paused', severity: 'info' as const, timeRemaining: 'Timer paused' },
  { ruleName: 'Deployment Approval Delayed', severity: 'critical' as const, breached: true },
];

// Module analytics data for bar chart
const MODULE_ANALYTICS = [
  { module: 'CRM', breaches: 20, prevented: 160, color: 'bg-blue-500' },
  { module: 'Support', breaches: 5, prevented: 142, color: 'bg-emerald-500' },
  { module: 'Finance', breaches: 23, prevented: 198, color: 'bg-amber-500' },
  { module: 'DevOps', breaches: 3, prevented: 56, color: 'bg-purple-500' },
];

export default function SlaEscalationPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalBreaches = slaRules.reduce((sum, r) => sum + r.analytics.totalBreaches, 0);
  const totalPrevented = slaRules.reduce((sum, r) => sum + r.analytics.prevented, 0);
  const activeRulesCount = slaRules.filter((r) => r.status === 'active').length;
  const avgResponseTime = Math.round(slaRules.reduce((sum, r) => sum + r.analytics.avgResponseTime, 0) / slaRules.length * 10) / 10;

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  const maxAnalytics = Math.max(...MODULE_ANALYTICS.flatMap((m) => [m.breaches, m.prevented]), 1);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            SLA Escalations
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
            Enterprise workflow escalation layer
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active Rules', value: activeRulesCount, icon: ShieldAlert, color: 'text-blue-400', bg: 'bg-blue-500/15' },
            { label: 'Breaches Today', value: 3, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15' },
            { label: 'Prevented This Month', value: totalPrevented, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { label: 'Avg Response Time', value: `${avgResponseTime}m`, icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active SLA Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className={cn('w-4 h-4 text-red-400')} />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Active Alerts
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMPLE_ALERTS.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <SLAAlertChip
                  ruleName={alert.ruleName}
                  severity={alert.severity}
                  timeRemaining={alert.timeRemaining}
                  breached={alert.breached}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* SLA Rule Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              SLA Rules
            </h2>
          </div>

          {slaRules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'rounded-2xl border shadow-sm p-4 sm:p-5 space-y-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                      {rule.name}
                    </h3>
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      MODULE_COLORS[rule.module] || 'bg-zinc-500/15 text-zinc-400',
                    )}>
                      {rule.module}
                    </span>
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                      rule.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400',
                    )}>
                      {rule.status === 'active' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      {rule.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                    {rule.description}
                  </p>
                </div>
                <div className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-1.5 shrink-0',
                  'bg-[var(--app-hover-bg)]',
                )}>
                  <Timer className={cn('h-4 w-4', isDark ? 'text-amber-400' : 'text-amber-500')} />
                  <span className={cn('text-sm font-bold', isDark ? 'text-amber-400' : 'text-amber-500')}>
                    {rule.timer}
                  </span>
                </div>
              </div>

              {/* Escalation Ladder */}
              <div>
                <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
                  Escalation Ladder
                </p>
                <div className="relative ml-1">
                  {rule.escalationLadder.map((step, si) => {
                    const isLastStep = si === rule.escalationLadder.length - 1;
                    return (
                      <div key={step.order} className="relative flex gap-3 pb-3">
                        {/* Timeline rail */}
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold z-10',
                            isDark ? 'bg-white/[0.08] text-zinc-300' : 'bg-black/[0.06] text-zinc-600',
                          )}>
                            {step.order}
                          </div>
                          {!isLastStep && (
                            <div className={cn('w-0.5 flex-1 mt-1', 'bg-[var(--app-hover-bg)]')} />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className={cn(
                          'flex-1 rounded-xl p-2.5 min-w-0',
                          'bg-[var(--app-hover-bg)]',
                        )}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
                              {step.action}
                            </span>
                            <span className={cn('text-[10px] font-mono', 'text-[var(--app-text-muted)]')}>
                              {step.delay}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px]">
                            <span className={cn('text-[var(--app-text-muted)]')}>
                              → {step.assignee}
                            </span>
                            <span className={cn('text-[var(--app-text-muted)]')}>·</span>
                            <span className={cn('text-[var(--app-text-muted)]')}>
                              {step.channel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Overrides */}
              {rule.teamOverrides.length > 0 && (
                <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Users className={cn('h-3 w-3', 'text-[var(--app-text-muted)]')} />
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Team Overrides
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rule.teamOverrides.map((team) => (
                      <span key={team} className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                        isDark ? 'bg-white/[0.06] text-zinc-300' : 'bg-black/[0.04] text-zinc-600',
                      )}>
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Row */}
              <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
                <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                  Analytics
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className={cn('text-lg font-bold', 'text-[var(--app-danger)]')}>
                      {rule.analytics.totalBreaches}
                    </p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Total Breaches</p>
                  </div>
                  <div className="text-center">
                    <p className={cn('text-lg font-bold', 'text-[var(--app-success)]')}>
                      {rule.analytics.prevented}
                    </p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Prevented</p>
                  </div>
                  <div className="text-center">
                    <p className={cn('text-lg font-bold', isDark ? 'text-amber-400' : 'text-amber-500')}>
                      {rule.analytics.avgResponseTime}m
                    </p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Avg Response</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Escalation Analytics Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'rounded-2xl border shadow-sm p-4 sm:p-5',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Escalation Analytics
            </h3>
            <span className={cn('text-[10px] ml-auto', 'text-[var(--app-text-muted)]')}>
              Breaches Prevented vs Actual
            </span>
          </div>

          <div className="space-y-4">
            {MODULE_ANALYTICS.map((mod) => (
              <div key={mod.module} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                    {mod.module}
                  </span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-emerald-400">{mod.prevented} prevented</span>
                    <span className="text-red-400">{mod.breaches} breaches</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Prevented bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(mod.prevented / maxAnalytics) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={cn('h-4 rounded-l-md bg-emerald-500/40')}
                  />
                  {/* Breach bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max((mod.breaches / maxAnalytics) * 100, 2)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className={cn('h-4 rounded-r-md bg-red-500/40')}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/40" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Prevented</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-red-500/40" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Breaches</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
