'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Database, Clock, Archive, Trash2, Download, Shield, Building2,
  FileText, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Pencil,
} from 'lucide-react';
import {
  retentionPolicies,
  dataExportRequests,
  consentLogs,
} from './data/mock-data';
import type { RetentionPolicy, DataExportRequest, ConsentLog } from './types';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const statusConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  active: { label: 'Active', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  paused: { label: 'Paused', bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
  pending: { label: 'Pending', bgDark: 'bg-sky-500/15 text-sky-400', bgLight: 'bg-sky-50 text-sky-600' },
  processing: { label: 'Processing', bgDark: 'bg-violet-500/15 text-violet-400', bgLight: 'bg-violet-50 text-violet-600' },
  completed: { label: 'Completed', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  failed: { label: 'Failed', bgDark: 'bg-red-500/15 text-red-400', bgLight: 'bg-red-50 text-red-600' },
};

const maxRetentionDays = 2555;

function formatRetentionDays(days: number): string {
  if (days >= 365) return `${Math.round(days / 365)}y`;
  return `${days}d`;
}

export default function DataGovernancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Database className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Data Governance</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage data retention, privacy, and compliance</p>
            </div>
          </div>
        </div>

        {/* ── Retention Policies ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Retention Policies</span>
            <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 border-0', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
              {retentionPolicies.length} policies
            </Badge>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {retentionPolicies.map((policy) => {
              const sConf = statusConfig[policy.status];
              const pct = Math.min((policy.retentionDays / maxRetentionDays) * 100, 100);
              return (
                <motion.div
                  key={policy.id}
                  variants={fadeUp}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors duration-200',
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{policy.module}</h3>
                      <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>
                        {policy.purgeSchedule}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                      {sConf.label}
                    </Badge>
                  </div>

                  {/* Retention progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Retention Period</span>
                      <span className="text-xs font-semibold">{formatRetentionDays(policy.retentionDays)}</span>
                    </div>
                    <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Soft Delete toggle indicator */}
                  <div className={cn('flex items-center gap-2 mb-3 text-xs', 'text-[var(--app-text-secondary)]')}>
                    <span className={cn(
                      'h-2 w-2 rounded-full',
                      policy.softDelete ? 'bg-emerald-400' : 'bg-red-400',
                    )} />
                    Soft Delete: {policy.softDelete ? 'Enabled' : 'Disabled'}
                  </div>

                  {/* Archive rules */}
                  <div className="space-y-1 mb-4">
                    {policy.archiveRules.map((rule, i) => (
                      <div key={i} className={cn('flex items-start gap-2 text-[11px]', 'text-[var(--app-text-muted)]')}>
                        <Archive className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-[11px] font-medium transition-colors w-full justify-center',
                      isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1] hover:text-black',
                    )}
                  >
                    <Pencil className="w-4 h-4" /> Edit Policy
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── Data Export Requests ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Download className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Data Export Requests</span>
          </div>
          <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Request ID', 'Requested By', 'Module', 'Status', 'Requested', 'Completed', 'Format', 'Size', 'Action'].map((h) => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider px-4 py-3', 'text-[var(--app-text-muted)]')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataExportRequests.map((req, i) => {
                    const sConf = statusConfig[req.status];
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + i * 0.04 }}
                        className={cn('border-b transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                      >
                        <td className="px-4 py-3 font-mono text-xs">{req.id}</td>
                        <td className="px-4 py-3 text-xs">{req.requestedBy}</td>
                        <td className="px-4 py-3 text-xs">{req.module}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                            {sConf.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(req.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-xs">{req.completedAt ? new Date(req.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-info-bg)] text-[var(--app-info)]')}>
                            {req.format}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs">{req.size || '—'}</td>
                        <td className="px-4 py-3">
                          {req.status === 'completed' ? (
                            <button className={cn('inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors')}>
                              <Download className="w-4 h-4" /> Download
                            </button>
                          ) : req.status === 'pending' || req.status === 'processing' ? (
                            <button className={cn('inline-flex items-center gap-1 text-[10px] font-medium text-red-400 hover:text-red-300 transition-colors')}>
                              <XCircle className="w-4 h-4" /> Cancel
                            </button>
                          ) : (
                            <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>—</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ── Consent Logs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Consent Logs</span>
          </div>
          <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['User', 'Consent Type', 'Granted', 'Timestamp', 'IP'].map((h) => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider px-4 py-3', 'text-[var(--app-text-muted)]')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consentLogs.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 + i * 0.04 }}
                      className={cn('border-b transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                    >
                      <td className="px-4 py-3 text-xs font-medium">{log.user}</td>
                      <td className="px-4 py-3 text-xs">{log.consentType}</td>
                      <td className="px-4 py-3">
                        {log.granted ? (
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-success-bg)] text-[var(--app-success)]')}>
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
                            <XCircle className="w-2.5 h-2.5 mr-0.5" /> No
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* ── GDPR / Delete Workflow ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>GDPR / Delete Workflow</span>
          </div>
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border-l-4 border-l-red-500 p-app-xl',
            isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]',
          )}>
            <h3 className="text-sm font-semibold mb-2">GDPR Data Deletion Workflow</h3>
            <p className={cn('text-xs mb-4', 'text-[var(--app-text-muted)]')}>
              When a deletion request is received, the following steps are executed automatically:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-app-xl">
              {[
                { step: 1, label: 'Request Received', desc: 'User submits deletion request' },
                { step: 2, label: 'Verification', desc: 'Identity verified via email OTP' },
                { step: 3, label: 'Scope Assessment', desc: 'Identify all associated data' },
                { step: 4, label: 'Soft Delete', desc: 'Mark records for deletion (30-day grace)' },
                { step: 5, label: 'Hard Purge', desc: 'Permanently remove from all systems' },
              ].map((s) => (
                <div key={s.step} className={cn('rounded-[var(--app-radius-lg)] border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-2', isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600')}>
                    {s.step}
                  </div>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>{s.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors',
                isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
              )}
            >
              <Trash2 className="w-4 h-4" /> Request Data Deletion
            </button>
          </div>
        </motion.div>

        {/* ── Tenant Isolation ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Tenant Isolation</span>
          </div>
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <div className="flex items-start gap-4">
              <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', 'bg-[var(--app-success-bg)]')}>
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">Tenant Isolation Active</h3>
                  <span className={cn('h-2 w-2 rounded-full bg-emerald-400', isDark ? 'bg-emerald-400' : 'bg-emerald-500')} />
                </div>
                <p className={cn('text-xs mb-3', 'text-[var(--app-text-muted)]')}>
                  Data is fully isolated across tenants with row-level security policies, separate encryption keys, and independent backup schedules.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Active Tenants', value: '12' },
                    { label: 'Encryption', value: 'AES-256 per tenant' },
                    { label: 'Isolation Level', value: 'Row-Level + Encryption' },
                  ].map((item) => (
                    <div key={item.label} className={cn('rounded-[var(--app-radius-lg)] border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                      <p className="text-xs font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
