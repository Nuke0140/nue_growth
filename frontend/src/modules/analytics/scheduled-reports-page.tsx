'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus, Clock, CheckCircle2, AlertTriangle, Pencil, Trash2,
  RefreshCw, Calendar, Mail, Link, Send,
} from 'lucide-react';
import { scheduledReports } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

const FREQUENCY_COLORS: Record<string, string> = {
  daily: 'bg-amber-500/15 text-amber-400',
  weekly: 'bg-blue-500/15 text-blue-400',
  monthly: 'bg-purple-500/15 text-purple-400',
  quarterly: 'bg-emerald-500/15 text-emerald-400',
};

const DELIVERY_ICONS: Record<string, React.ElementType> = {
  email: Mail,
  whatsapp: Send,
  link: Link,
};

export default function ScheduledReportsPage() {
  const activeReports = scheduledReports.filter((r) => r.status === 'active').length;
  const failedReports = scheduledReports.filter((r) => r.status === 'failed').length;
  const nextRunToday = scheduledReports.filter((r) => {
    const today = new Date().toISOString().split('T')[0];
    return r.nextRun <= today && r.status === 'active';
  }).length;

  const card = cn(
    'rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] p-4 sm:p-app-xl',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
              Scheduled Reports
            </h1>
            <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
              Automated report delivery
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--app-radius-lg)] px-4 py-2.5 text-sm font-medium transition-colors',
              isDark
                ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200',
            )}
          >
            <Plus className="w-4 h-4" />
            Create Schedule
          </motion.button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Active Reports', value: activeReports, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Failed Reports', value: failedReports, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Next Run Today', value: nextRunToday, icon: Clock, color: 'text-blue-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-2xl border shadow-sm p-4 sm:p-5"
              style={cardStyle}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', 'text-[var(--app-text)]')}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cn('rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] overflow-hidden', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
        >
          <div className="p-4 sm:p-app-xl border-b" style={{ borderColor: 'var(--app-border)' }}>
            <div className="flex items-center gap-2">
              <Calendar className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                All Schedules
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                  {['Report Name', 'Frequency', 'Delivery', 'Recipients', 'Last Run', 'Next Run', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={cn('px-4 py-2.5 text-left font-medium', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report, i) => {
                  const statusStyle = STATUS_STYLES[report.status] ?? STATUS_STYLES.active;
                  const DeliveryIcon = DELIVERY_ICONS[report.deliveryMethod] ?? Mail;
                  const isFailed = report.status === 'failed' || report.failureCount > 0;

                  return (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      className={cn(
                        'border-b last:border-0 transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]',
                      )}
                    >
                      <td className={cn('px-4 py-3 font-medium', 'text-[var(--app-text)]')}>
                        <div className="flex items-center gap-2">
                          {isFailed && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                          {report.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', FREQUENCY_COLORS[report.frequency])}>
                          {report.frequency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <DeliveryIcon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                          <span className="capitalize">{report.deliveryMethod}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>
                          {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                        {report.lastRun}
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                        {report.nextRun}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', statusStyle.bg, statusStyle.text)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className={cn('p-1 rounded-[var(--app-radius-lg)] transition-colors', isDark ? 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200' : 'hover:bg-black/[0.04] text-zinc-500 hover:text-zinc-700')}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-1 rounded-[var(--app-radius-lg)] transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Failure Retry Alerts */}
        {scheduledReports.some((r) => r.failureCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className={cn('text-sm font-semibold mb-3', 'text-[var(--app-text)]')}>
              Failure Alerts
            </h2>
            <div className="space-y-3">
              {scheduledReports
                .filter((r) => r.failureCount > 0)
                .map((report) => (
                  <div
                    key={report.id}
                    className={cn(
                      'rounded-[var(--app-radius-xl)] border border-l-4 border-l-amber-500 p-4',
                      'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <h4 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                            {report.name}
                          </h4>
                          <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                            Failed {report.failureCount} time{report.failureCount !== 1 ? 's' : ''} — Last run on {report.lastRun}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'shrink-0 inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium',
                          isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                        )}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry Now
                      </motion.button>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
