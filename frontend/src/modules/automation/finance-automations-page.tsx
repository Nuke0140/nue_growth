'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  IndianRupee, Play, Pencil, FileText, Plus, ArrowRight,
  Activity, CheckCircle2, Bot, ShieldCheck, Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  financeAutomations as financeData,
  financeAutomationStats,
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

function FinancialImpactSummary() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const amount = financeAutomationStats.amountRecovered;
  const impactItems = [
    { label: 'Invoice Recovery', amount: 845000, pct: 45.8 },
    { label: 'Payment Reminders', amount: 623000, pct: 33.8 },
    { label: 'Expense Savings', amount: 245000, pct: 13.3 },
    { label: 'Budget Prevention', amount: 132000, pct: 7.1 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
      className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)]', isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/10')}>
          <Banknote className="h-4 w-4 text-emerald-500" />
        </div>
        <div>
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Financial Impact Summary</h3>
          <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Total recovered through automation this quarter</p>
        </div>
        <div className="ml-auto text-right">
          <p className={cn('text-xl font-bold', 'text-[var(--app-success)]')}>₹{(amount / 100000).toFixed(1)}L</p>
          <p className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>₹{amount.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {impactItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={cn('text-xs w-44 truncate shrink-0', 'text-[var(--app-text-muted)]')}>{item.label}</span>
            <div className={cn('flex-1 h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-emerald-500" />
            </div>
            <span className={cn('text-xs font-semibold w-20 text-right shrink-0', 'text-[var(--app-text)]')}>₹{(item.amount / 1000).toFixed(0)}K</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function FinanceAutomationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const items = financeData as unknown as DomainAutomation[];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-app-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-10  w-9 items-center justify-center rounded-[var(--app-radius-lg)]', isDark ? 'bg-amber-500/10' : 'bg-amber-500/10')}>
                <IndianRupee className="h-5 w-5 text-amber-500" />
              </div>
              <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>Finance Automations</h1>
            </div>
            <p className={cn('text-sm mt-1.5 ml-[46px]', 'text-[var(--app-text-muted)]')}>Automate financial workflows and compliance</p>
          </div>
          <Button className={cn('shrink-0 h-10  px-4 rounded-[var(--app-radius-lg)] text-xs font-semibold', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Plus className="w-4 h-4 mr-1.5" /> Create Finance Rule
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total Rules" value={financeAutomationStats.totalRules.toString()} icon={Bot} color="text-amber-500" />
          <KpiCard label="Alerts Sent" value={financeAutomationStats.alertsSent.toString()} icon={Activity} color="text-red-500" />
          <KpiCard label="Amount Recovered" value={`₹${(financeAutomationStats.amountRecovered / 100000).toFixed(1)}L`} icon={Banknote} color="text-emerald-500" />
          <KpiCard label="SLA Compliance" value={`${financeAutomationStats.slaCompliance}%`} icon={ShieldCheck} color="text-blue-500" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <AutomationCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <FinancialImpactSummary />
      </div>
    </div>
  );
}
