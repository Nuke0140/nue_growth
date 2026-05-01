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
      className={cn('rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}>
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-400' : 'text-zinc-500')}>{label}</p>
          <p className={cn('text-xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>{value}</p>
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
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35}}
      whileHover={{ y: -3, boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.08)' }}
      className={cn('rounded-2xl border p-5 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.01]')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>{item.name}</h3>
          <p className={cn('text-xs mt-0.5 line-clamp-2', isDark ? 'text-zinc-400' : 'text-zinc-500')}>{item.description}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0', statusCfg.bg, statusCfg.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
          {statusCfg.label}
        </span>
      </div>

      <div className={cn('rounded-xl p-3 mb-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-0.5', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Trigger</p>
            <p className={cn('text-xs font-medium truncate', isDark ? 'text-zinc-300' : 'text-zinc-700')}>{item.trigger}</p>
          </div>
          <ArrowRight className={cn('h-4 w-4 shrink-0', isDark ? 'text-zinc-600' : 'text-zinc-300')} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-0.5', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Action</p>
            <p className={cn('text-xs font-medium truncate', isDark ? 'text-zinc-300' : 'text-zinc-700')}>{item.action}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Runs</p>
          <p className={cn('text-sm font-bold mt-0.5', isDark ? 'text-white' : 'text-zinc-900')}>{runs.toLocaleString()}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Success Rate</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }} transition={{ duration: 0.15, ease: 'easeOut' }}
                className={cn('h-full rounded-full', successRate >= 95 ? 'bg-emerald-500' : successRate >= 80 ? 'bg-amber-500' : 'bg-red-500')} />
            </div>
            <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>{successRate}%</span>
          </div>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Last Run</p>
          <p className={cn('text-xs font-medium mt-1', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
            {new Date(lastRun).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', isDark ? 'border-white/[0.06] text-zinc-300 hover:bg-white/[0.06]' : 'border-black/[0.06] text-zinc-600 hover:bg-black/[0.04]')}>
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', isDark ? 'border-white/[0.06] text-zinc-300 hover:bg-white/[0.06]' : 'border-black/[0.06] text-zinc-600 hover:bg-black/[0.04]')}>
            <FileText className="h-3 w-3" /> View Logs
          </button>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', enabled ? 'bg-emerald-500' : isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]')}>
          <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
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
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15}}
      className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-xl', isDark ? 'bg-rose-500/10' : 'bg-rose-500/10')}>
          <Heart className="h-4 w-4 text-rose-500" />
        </div>
        <div>
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>HR Workflow Summary</h3>
          <p className={cn('text-xs', isDark ? 'text-zinc-400' : 'text-zinc-500')}>Automation coverage across HR processes</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workflows.map((wf) => (
          <div key={wf.label} className={cn('rounded-xl border p-4 transition-colors', isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04] hover:bg-black/[0.02]')}>
            <div className="flex items-start gap-3">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', wf.bg)}>
                <wf.icon className={cn('h-4 w-4', wf.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>{wf.label}</p>
                  <span className={cn('text-[10px] font-semibold', wf.color)}>{wf.stats.pct}%</span>
                </div>
                <p className={cn('text-[10px] leading-relaxed mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>{wf.description}</p>
                <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${wf.stats.pct}%` }} transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={cn('h-full rounded-full', wf.color.replace('text-', 'bg-'))} />
                </div>
                <p className={cn('text-[9px] mt-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>{wf.stats.automated} of {wf.stats.total} tasks automated</p>
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
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', isDark ? 'bg-rose-500/10' : 'bg-rose-500/10')}>
                <UserCheck className="h-5 w-5 text-rose-500" />
              </div>
              <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>HR Automations</h1>
            </div>
            <p className={cn('text-sm mt-1.5 ml-[46px]', isDark ? 'text-zinc-400' : 'text-zinc-500')}>Automate onboarding, attendance, leave, and performance workflows</p>
          </div>
          <Button className={cn('shrink-0 h-9 px-4 rounded-xl text-xs font-semibold', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create HR Rule
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
