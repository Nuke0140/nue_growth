'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Database,
  Clock,
  CalendarClock,
  Archive,
  RotateCcw,
  Download,
  Trash2,
  AlertTriangle,
  Shield,
  CheckCircle2,
  CircleDot,
  XCircle,
  Calendar,
  Zap,
} from 'lucide-react';
import { backups } from './data/mock-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const statusConfig: Record<string, { label: string; dark: string; light: string }> = {
  completed: { label: 'Completed', dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  'in-progress': { label: 'In Progress', dark: 'bg-sky-500/15 text-sky-400', light: 'bg-sky-50 text-sky-600' },
  failed: { label: 'Failed', dark: 'bg-red-500/15 text-red-400', light: 'bg-red-50 text-red-600' },
};

const typeConfig: Record<string, { label: string; dark: string; light: string }> = {
  automated: { label: 'Automated', dark: 'bg-violet-500/15 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  manual: { label: 'Manual', dark: 'bg-amber-500/15 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  snapshot: { label: 'Snapshot', dark: 'bg-sky-500/15 text-sky-400', light: 'bg-sky-50 text-sky-600' },
};

export default function BackupRecoveryPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [restoreDate, setRestoreDate] = useState('');

  const totalBackups = backups.length;
  const automatedCount = backups.filter((b) => b.type === 'automated').length;
  const totalSize = '128.4 GB';
  const lastBackupTime = backups[0]?.createdAt
    ? new Date(backups[0].createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  const summaryKPIs = [
    { label: 'Total Backups', value: String(totalBackups), icon: Database, color: 'text-violet-400' },
    { label: 'Automated', value: String(automatedCount), icon: Zap, color: 'text-sky-400' },
    { label: 'Storage Used', value: totalSize, icon: Database, color: 'text-amber-400' },
    { label: 'Last Backup', value: lastBackupTime.split(', ')[0], icon: CalendarClock, color: 'text-emerald-400' },
  ];

  const drSteps = [
    'Verify RPO compliance & latest backup integrity',
    'Spin up recovery infrastructure in DR region (Mumbai)',
    'Restore database from last consistent snapshot',
    'Validate data integrity & switch DNS to DR endpoint',
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Shield className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Backup & Recovery</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage backups and restore points</p>
            </div>
          </div>
        </motion.div>

        {/* ── Summary KPIs ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {summaryKPIs.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
              </div>
              <p className="text-lg md:text-xl font-bold">{kpi.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Backup Schedule ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Backup Schedule</span>
          </div>
          <div className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Automated Daily Backup</p>
                  <span className={cn('h-2 w-2 rounded-full', autoBackupEnabled ? 'bg-emerald-400' : 'bg-red-400')} />
                </div>
                <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  Runs daily at 2:00 AM IST &middot; Retention: 30 days &middot; {autoBackupEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <button
                onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors cursor-pointer shrink-0',
                  autoBackupEnabled
                    ? isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    : isDark ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                )}
              >
                {autoBackupEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Backup Alert ── */}
        {!autoBackupEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border-l-4 border-l-red-500 p-4',
              isDark ? 'bg-red-500/5 border border-white/[0.06]' : 'bg-red-50/50 border border-black/[0.06]',
            )}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Automated backups are disabled</p>
                  <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                    Your data is not being backed up automatically. Enable daily backups to protect against data loss.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Recent Backups ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Archive className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Recent Backups</span>
          </div>
          <div className="space-y-3">
            {backups.map((backup, i) => {
              const sConf = statusConfig[backup.status];
              const tConf = typeConfig[backup.type];
              return (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-4 transition-colors',
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold truncate">{backup.name}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', isDark ? tConf.dark : tConf.light)}>
                          {tConf.label}
                        </span>
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold', isDark ? sConf.dark : sConf.light)}>
                          {sConf.label}
                        </span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {new Date(backup.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={cn('text-[10px] font-mono', 'text-[var(--app-text-muted)]')}>{backup.size}</span>
                      </div>
                      {/* Module badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {backup.modules.map((mod) => (
                          <span key={mod} className={cn('rounded-full px-2 py-0.5 text-[9px] font-medium', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {backup.status === 'completed' && (
                        <>
                          <button className={cn(
                            'inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors cursor-pointer',
                            isDark ? 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
                          )}>
                            <RotateCcw className="w-4 h-4" /> Restore
                          </button>
                          <button className={cn(
                            'inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors cursor-pointer',
                            isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]',
                          )}>
                            <Download className="w-4 h-4" /> Download
                          </button>
                        </>
                      )}
                      <button className={cn(
                        'inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors cursor-pointer',
                        isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
                      )}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Point-in-Time Restore ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Point-in-Time Restore</span>
          </div>
          <div className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <p className="text-xs font-semibold mb-1">Select Restore Point</p>
            <p className={cn('text-[10px] mb-3', 'text-[var(--app-text-muted)]')}>
              Choose a date and time to restore the system state to a specific point in time.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Date & Time</label>
                <div className="relative">
                  <Calendar className={cn('absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  <input
                    type="datetime-local"
                    value={restoreDate}
                    onChange={(e) => setRestoreDate(e.target.value)}
                    className={cn(
                      'w-full rounded-[var(--app-radius-lg)] border pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-black/[0.03] border-black/[0.08] text-black',
                    )}
                  />
                </div>
              </div>
              <button className={cn(
                'inline-flex items-center justify-center gap-1.5 px-app-xl py-2 rounded-[var(--app-radius-lg)] text-xs font-semibold transition-colors cursor-pointer shrink-0',
                isDark ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30' : 'bg-violet-100 text-violet-600 hover:bg-violet-200',
              )}>
                <RotateCcw className="w-4 h-4" /> Restore to Point
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Disaster Recovery ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className={cn('w-4 h-4 text-red-400')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Disaster Recovery</span>
          </div>
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border-l-4 border-l-red-500 p-app-xl',
            isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]',
          )}>
            <h3 className="text-sm font-semibold mb-3">DR Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-app-xl">
              {[
                { label: 'RPO Target', value: '1 hour' },
                { label: 'RTO Target', value: '4 hours' },
                { label: 'Last DR Test', value: '28 Dec 2024' },
              ].map((item) => (
                <div key={item.label} className={cn('rounded-[var(--app-radius-lg)] border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                  <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                  <p className="text-xs font-bold">{item.value}</p>
                </div>
              ))}
            </div>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Recovery Steps</p>
            <div className="space-y-2">
              {drSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5', isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600')}>
                    {i + 1}
                  </div>
                  <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
