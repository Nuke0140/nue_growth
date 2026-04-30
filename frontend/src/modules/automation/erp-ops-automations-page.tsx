'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Factory, Play, Pencil, FileText, Plus, ArrowRight,
  Activity, CheckCircle2, Bot, ClipboardCheck, Timer, BarChart3, TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  erpOpsAutomations as erpData,
  erpOpsAutomationStats,
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
      className={cn('rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}>
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', 'bg-[var(--app-hover-bg)]')}>
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
      className={cn('rounded-2xl border p-5 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>{item.name}</h3>
          <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>{item.description}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0', statusCfg.bg, statusCfg.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
          {statusCfg.label}
        </span>
      </div>

      <div className={cn('rounded-xl p-3 mb-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
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
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')}>
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', 'border-[var(--app-border)] text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')}>
            <FileText className="h-3 w-3" /> View Logs
          </button>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', enabled ? 'bg-emerald-500' : 'bg-[var(--app-hover-bg)]')}>
          <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>
    </motion.div>
  );
}

function OperationsEfficiencyChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const metrics = [
    { label: 'PO Approval Time', before: 48, after: 4, unit: 'hrs', color: 'bg-blue-500' },
    { label: 'Reorder Processing', before: 72, after: 2, unit: 'hrs', color: 'bg-violet-500' },
    { label: 'Shipment Updates', before: 24, after: 0.5, unit: 'hrs', color: 'bg-emerald-500' },
    { label: 'QC Task Assignment', before: 12, after: 1, unit: 'hrs', color: 'bg-amber-500' },
  ];
  const maxVal = Math.max(...metrics.map(m => m.before));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
      className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Operations Efficiency</h3>
          <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Before vs After Automation</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className={cn('flex items-center gap-1.5', 'text-[var(--app-text-muted)]')}>
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-400/40" /> Before
          </span>
          <span className={cn('flex items-center gap-1.5', 'text-[var(--app-text-muted)]')}>
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> After
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>{m.label}</span>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{m.before}{m.unit}</span>
                <ArrowRight className="h-3 w-3 text-emerald-500" />
                <span className={cn('text-[10px] font-semibold text-emerald-500')}>{m.after}{m.unit}</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className={cn('flex-1 h-3 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(m.before / maxVal) * 100}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} className="h-full rounded-full bg-zinc-400/30" />
              </div>
              <div className={cn('flex-1 h-3 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(m.after / maxVal) * 100}%` }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }} className={cn('h-full rounded-full', m.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ErpOpsAutomationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const items = erpData as unknown as DomainAutomation[];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', isDark ? 'bg-blue-500/10' : 'bg-blue-500/10')}>
                <Factory className="h-5 w-5 text-blue-500" />
              </div>
              <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>ERP Ops Automations</h1>
            </div>
            <p className={cn('text-sm mt-1.5 ml-[46px]', 'text-[var(--app-text-muted)]')}>Automate operations, procurement, and logistics workflows</p>
          </div>
          <Button className={cn('shrink-0 h-9 px-4 rounded-xl text-xs font-semibold', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Ops Automation
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total Ops" value={erpOpsAutomationStats.totalOps.toString()} icon={Bot} color="text-blue-500" />
          <KpiCard label="Active" value={erpOpsAutomationStats.active.toString()} icon={Play} color="text-emerald-500" />
          <KpiCard label="Tasks Auto-Assigned" value={erpOpsAutomationStats.tasksAutoAssigned.toLocaleString()} icon={ClipboardCheck} color="text-violet-500" />
          <KpiCard label="Delay Prevention" value={`${erpOpsAutomationStats.delayPrevention}%`} icon={Timer} color="text-amber-500" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <AutomationCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <OperationsEfficiencyChart />
      </div>
    </div>
  );
}
