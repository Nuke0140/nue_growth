'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Workflow, CheckCircle, XCircle, Clock, Zap, Shield, BrainCircuit, RefreshCw,
  Calendar, Filter, ChevronDown, AlertTriangle, AlertCircle, CircleAlert,
  Activity, LayoutTemplate,
} from 'lucide-react';
import KPICard from '../analytics/components/kpi-card';
import ChartCard from '../analytics/components/chart-card';
import FilterChip from '../analytics/components/filter-chip';
import ExecutionLogCard from './components/execution-log-card';
import {
  automationKPIs, executionTrend, hoursSavedByModule, workflowUsageLeaderboard,
  recentExecutionLogs, automationAlerts,
} from './data/mock-data';

const iconMap: Record<string, React.ElementType> = {
  Workflow, CheckCircle, XCircle, Clock, Zap, Shield, BrainCircuit, RefreshCw,
};

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  critical: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-l-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-l-amber-500' },
  info: { icon: AlertCircle, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-l-sky-500' },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AutomationDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('All Workflows');

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const maxExec = useMemo(() => Math.max(...executionTrend.map((d) => d.success + d.failed)), []);
  const maxHours = useMemo(() => Math.max(...hoursSavedByModule.map((d) => d.hours)), []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Activity className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Automation Dashboard</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Your workflow command center
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </span>
          </div>
        </div>

        {/* ── Sticky Filter Bar ── */}
        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 backdrop-blur-xl border-b"
          style={{ backgroundColor: isDark ? 'rgba(9,9,11,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <div className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shrink-0 cursor-pointer',
              isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.08]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.06]',
            )}>
              <LayoutTemplate className="w-3.5 h-3.5" />
              Last 30 Days
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="w-px h-6 shrink-0" style={{ backgroundColor: 'var(--app-border-strong)' }} />
            <Filter className={cn('w-3.5 h-3.5 shrink-0', 'text-[var(--app-text-muted)]')} />
            {['All Workflows', 'Active', 'Paused', 'Draft', 'Failing'].map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {automationKPIs.map((kpi) => (
            <motion.div key={kpi.id} variants={fadeUp}>
              <KPICard
                label={kpi.label}
                value={kpi.formattedValue}
                change={kpi.change}
                changeLabel={kpi.changeLabel}
                icon={iconMap[kpi.icon]}
                severity={kpi.severity || 'normal'}
                trend={kpi.trend}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Charts Row: Execution Trend + Hours Saved ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Execution Trend — CSS Bar Chart */}
          <ChartCard title="Execution Trend" subtitle="Weekly workflow executions (12 weeks)">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-emerald-500/50' : 'bg-emerald-500')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-red-500/50' : 'bg-red-500')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Failed</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-48">
                {executionTrend.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="flex gap-0.5 w-full items-end h-40">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.success / maxExec) * 100}%` }}
                        transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'flex-1 rounded-t-sm transition-opacity group-hover:opacity-80 cursor-pointer min-h-[4px]',
                          isDark ? 'bg-emerald-500/40' : 'bg-emerald-400',
                        )}
                        title={`Success: ${d.success.toLocaleString()}`}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.failed / maxExec) * 100}%` }}
                        transition={{ delay: 0.15 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'flex-1 rounded-t-sm transition-opacity group-hover:opacity-80 cursor-pointer min-h-[4px]',
                          isDark ? 'bg-red-500/40' : 'bg-red-400',
                        )}
                        title={`Failed: ${d.failed.toLocaleString()}`}
                      />
                    </div>
                    <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>
                      {d.week}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Hours Saved by Module — Horizontal Bar Chart */}
          <ChartCard title="Hours Saved by Module" subtitle="Monthly automation impact">
            <div className="h-full flex flex-col justify-center gap-3 py-4">
              {hoursSavedByModule.map((mod, i) => (
                <motion.div
                  key={mod.module}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cn('font-medium truncate', 'text-[var(--app-text)]')}>
                      {mod.module}
                    </span>
                    <span className={cn('font-semibold shrink-0 ml-2', 'text-[var(--app-text)]')}>
                      {mod.hours} hrs
                    </span>
                  </div>
                  <div className={cn('h-3 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(mod.hours / maxHours) * 100}%` }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', mod.color, isDark && 'opacity-50')}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── Workflow Usage Leaderboard ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Workflow className={cn('w-4 h-4', 'text-[var(--app-purple)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Workflow Usage Leaderboard
            </span>
          </div>
          <div className={cn(
            'rounded-2xl border overflow-hidden shadow-sm',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <div className={cn(
              'grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider border-b',
              isDark ? 'text-white/30 border-white/[0.06]' : 'text-black/30 border-black/[0.06]',
            )}>
              <div className="col-span-5"># Workflow</div>
              <div className="col-span-2 text-right">Runs</div>
              <div className="col-span-3">Success Rate</div>
              <div className="col-span-2 text-right">Module</div>
            </div>
            {workflowUsageLeaderboard.map((wf, i) => (
              <motion.div
                key={wf.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
                className={cn(
                  'grid grid-cols-12 gap-2 px-4 py-3 items-center border-b last:border-b-0 transition-colors',
                  isDark
                    ? 'border-white/[0.04] hover:bg-white/[0.02]'
                    : 'border-black/[0.04] hover:bg-black/[0.02]',
                )}
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <span className={cn(
                    'text-[10px] font-bold w-5 text-center shrink-0',
                    i < 3 ? (isDark ? 'text-amber-400' : 'text-amber-500') : ('text-[var(--app-text-disabled)]'),
                  )}>
                    {i + 1}
                  </span>
                  <span className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>
                    {wf.name}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                    {wf.runs.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <div
                      className={cn('h-full rounded-full', wf.successRate >= 97 ? ('bg-[var(--app-success)]') : wf.successRate >= 93 ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400') : (isDark ? 'bg-red-500/50' : 'bg-red-400'))}
                      style={{ width: `${wf.successRate}%` }}
                    />
                  </div>
                  <span className={cn('text-[10px] font-semibold shrink-0 w-10 text-right', 'text-[var(--app-text-secondary)]')}>
                    {wf.successRate}%
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className={cn(
                    'inline-flex rounded-lg px-1.5 py-0.5 text-[10px] font-medium',
                    'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
                  )}>
                    {wf.module}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Execution Logs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', isDark ? 'text-sky-400' : 'text-sky-500')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Recent Execution Logs
            </span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              'bg-[var(--app-info-bg)] text-[var(--app-info)]',
            )}>
              {recentExecutionLogs.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentExecutionLogs.slice(0, 3).map((log) => (
              <ExecutionLogCard key={log.id} log={log} />
            ))}
          </div>
        </motion.div>

        {/* ── Alerts Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Active Alerts
            </span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
            )}>
              {automationAlerts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {automationAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity] || severityConfig.info;
              const AlertIcon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border-l-4 shadow-sm cursor-pointer transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-black/[0.02] border border-black/[0.06] hover:bg-black/[0.04]',
                    config.border,
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <AlertIcon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{alert.title}</p>
                    </div>
                    <p className={cn('text-xs leading-relaxed line-clamp-2', 'text-[var(--app-text-muted)]')}>
                      {alert.description}
                    </p>
                    {alert.workflowName && (
                      <span className={cn(
                        'inline-flex items-center rounded-lg px-1.5 py-0.5 text-[10px] font-medium mt-1.5',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
                      )}>
                        {alert.workflowName}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
