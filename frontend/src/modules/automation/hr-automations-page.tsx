'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  UserCheck, Play, Pencil, FileText, Plus, ArrowRight,
  Activity, CheckCircle2, Bot, Bell, Users, Calendar, ClipboardList,
  TrendingUp, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  hrAutomations as hrData,
  hrAutomationStats,
} from './data/mock-data';
import type { DomainAutomation } from './data/mock-data';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  paused: { label: 'Paused', bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  error: { label: 'Error', bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
};

function KpiCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn('rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] hover:shadow-[var(--app-shadow-md)]-md transition-shadow', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}>
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{label}</p>
          <p className={cn('text-xl font-bold tracking-tight', 'text-[var(--app-text)]')}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AutomationCard({ item, index }: { item: DomainAutomation; index: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [enabled, setEnabled] = useState(item.status === 'active');
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.active;
  const runs = item.metrics.runs;
  const successRate = item.metrics.successRate;
  const lastRun = item.metrics.lastRun;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: 'var(--app-shadow-dropdown)' }}
      className={cn('rounded-[var(--app-radius-xl)] border p-app-xl transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>{item.name}</h3>
          <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>{item.description}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-semibold shrink-0', statusCfg.bg, statusCfg.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
          {statusCfg.label}
        </span>
      </div>

      <div className={cn('rounded-[var(--app-radius-lg)] p-3 mb-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Trigger</p>
            <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text-secondary)]')}>{item.trigger}</p>
          </div>
          <ArrowRight className={cn('h-4 w-4 shrink-0', 'text-[var(--app-text-secondary)]')} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Action</p>
            <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text-secondary)]')}>{item.action}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Runs</p>
          <p className={cn('text-sm font-bold mt-0.5', 'text-[var(--app-text)]')}>{runs.toLocaleString()}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Success Rate</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn('h-full rounded-full', successRate >= 95 ? 'bg-emerald-500' : successRate >= 80 ? 'bg-amber-500' : 'bg-red-500')} />
            </div>
            <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>{successRate}%</span>
          </div>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Last Run</p>
          <p className={cn('text-xs font-medium mt-1', 'text-[var(--app-text-secondary)]')}>
            {new Date(lastRun).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors border', 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')}>
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors border', 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')}>
            <FileText className="h-3 w-3" /> View Logs
          </button>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', enabled ? 'bg-emerald-500' : 'bg-[var(--app-hover-bg)]')}>
          <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]" />
        </button>
      </div>
    </motion.div>
  );
}

function HrWorkflowSummary() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const workflows = [
    { icon: Users, label: 'Onboarding', description: 'Auto-generate tasks, IT setup, document collection, and orientation scheduling', stats: { automated: 34, total: 36, pct: 94 }, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Calendar, label: 'Leave Management', description: 'Balance alerts, auto-approvals, carry-forward calculations, and team calendars', stats: { automated: 28, total: 32, pct: 88 }, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: ClipboardList, label: 'Attendance Tracking', description: 'Anomaly detection, late arrival alerts, remote work logging, and shift management', stats: { automated: 22, total: 28, pct: 79 }, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: TrendingUp, label: 'Performance Reviews', description: 'Probation reviews, goal tracking, 360 feedback, and appraisal scheduling', stats: { automated: 18, total: 24, pct: 75 }, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
      className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
      <div className="flex items-center gap-2.5 mb-app-xl">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)]', isDark ? 'bg-rose-500/10' : 'bg-rose-500/10')}>
          <Heart className="h-4 w-4 text-rose-500" />
        </div>
        <div>
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>HR Workflow Summary</h3>
          <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Automation coverage across HR processes</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workflows.map((wf) => (
          <div key={wf.label} className={cn('rounded-[var(--app-radius-lg)] border p-4 transition-colors', isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04] hover:bg-black/[0.02]')}>
            <div className="flex items-start gap-3">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)]', wf.bg)}>
                <wf.icon className={cn('h-4 w-4', wf.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>{wf.label}</p>
                  <span className={cn('text-[10px] font-semibold', wf.color)}>{wf.stats.pct}%</span>
                </div>
                <p className={cn('text-[10px] leading-relaxed mb-2', 'text-[var(--app-text-muted)]')}>{wf.description}</p>
                <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${wf.stats.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={cn('h-full rounded-full', wf.color.replace('text-', 'bg-'))} />
                </div>
                <p className={cn('text-[9px] mt-1', 'text-[var(--app-text-muted)]')}>{wf.stats.automated} of {wf.stats.total} tasks automated</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HrAutomationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const items = hrData as unknown as DomainAutomation[];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-app-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-10  w-9 items-center justify-center rounded-[var(--app-radius-lg)]', isDark ? 'bg-rose-500/10' : 'bg-rose-500/10')}>
                <UserCheck className="h-5 w-5 text-rose-500" />
              </div>
              <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>HR Automations</h1>
            </div>
            <p className={cn('text-sm mt-1.5 ml-[46px]', 'text-[var(--app-text-muted)]')}>Automate onboarding, attendance, leave, and performance workflows</p>
          </div>
          <Button className={cn('shrink-0 h-10  px-4 rounded-[var(--app-radius-lg)] text-xs font-semibold', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Plus className="w-4 h-4 mr-1.5" /> Create HR Rule
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total Rules" value={hrAutomationStats.totalRules.toString()} icon={Bot} color="text-rose-500" />
          <KpiCard label="Active" value={hrAutomationStats.active.toString()} icon={Play} color="text-emerald-500" />
          <KpiCard label="Alerts Sent" value={hrAutomationStats.alertsSent.toLocaleString()} icon={Bell} color="text-amber-500" />
          <KpiCard label="Satisfaction Impact" value={`+${hrAutomationStats.employeeSatisfactionImpact}%`} icon={Heart} color="text-violet-500" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <AutomationCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <HrWorkflowSummary />
      </div>
    </div>
  );
}
