'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Plus, Clock, CheckCircle2, AlertTriangle, Pencil, Trash2,
  RefreshCw, Calendar, Mail, Link, Send,
} from 'lucide-react';
import { scheduledReports } from './data/mock-data';

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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  paused: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500' },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-500' },
};

export default function ScheduledReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const activeReports = scheduledReports.filter((r) => r.status === 'active').length;
  const failedReports = scheduledReports.filter((r) => r.status === 'failed').length;
  const nextRunToday = scheduledReports.filter((r) => {
    const today = new Date().toISOString().split('T')[0];
    return r.nextRun <= today && r.status === 'active';
  }).length;

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
              Scheduled Reports
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
              Automated report delivery
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
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
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', isDark ? 'text-white' : 'text-zinc-900')}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
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
          className={cn('rounded-2xl border shadow-sm overflow-hidden', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
        >
          <div className="p-4 sm:p-5 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2">
              <Calendar className={cn('w-4 h-4', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                All Schedules
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-black/[0.06] bg-black/[0.02]')}>
                  {['Report Name', 'Frequency', 'Delivery', 'Recipients', 'Last Run', 'Next Run', 'Status', 'Actions'].map((h) => (
                    <th key={h} className={cn('px-4 py-2.5 text-left font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
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
                        isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]',
                      )}
                    >
                      <td className={cn('px-4 py-3 font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                        <div className="flex items-center gap-2">
                          {isFailed && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
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
                          <DeliveryIcon className={cn('w-3.5 h-3.5', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
                          <span className="capitalize">{report.deliveryMethod}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px]', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                          {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                        {report.lastRun}
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
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
                          <button className={cn('p-1 rounded-lg transition-colors', isDark ? 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200' : 'hover:bg-black/[0.04] text-zinc-500 hover:text-zinc-700')}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 rounded-lg transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" />
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
            <h2 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-zinc-900')}>
              Failure Alerts
            </h2>
            <div className="space-y-3">
              {scheduledReports
                .filter((r) => r.failureCount > 0)
                .map((report) => (
                  <div
                    key={report.id}
                    className={cn(
                      'rounded-2xl border border-l-4 border-l-amber-500 p-4',
                      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <h4 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                            {report.name}
                          </h4>
                          <p className={cn('text-xs mt-0.5', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                            Failed {report.failureCount} time{report.failureCount !== 1 ? 's' : ''} — Last run on {report.lastRun}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                          isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                        )}
                      >
                        <RefreshCw className="w-3 h-3" />
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
