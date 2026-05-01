'use client';

import { useState, useMemo } from 'react';
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
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
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

function getStatusBadge(status: string) {
  const sConf = statusConfig[status];
  if (!sConf) return <StatusBadge status={status} />;
  return <StatusBadge status={sConf.label} />;
}

export default function DataGovernancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ── Data Export columns ──
  const exportColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'id',
      label: 'Request ID',
      render: (row) => <span className="font-mono text-xs">{row.id as string}</span>,
    },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'module', label: 'Module' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status as string),
    },
    {
      key: 'requestedAt',
      label: 'Requested',
      sortable: true,
      render: (row) => (
        <span className="text-xs">
          {new Date(row.requestedAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'completedAt',
      label: 'Completed',
      render: (row) => (
        <span className="text-xs">
          {row.completedAt ? new Date(row.completedAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
        </span>
      ),
    },
    {
      key: 'format',
      label: 'Format',
      render: (row) => <StatusBadge status={row.format as string} />,
    },
    { key: 'size', label: 'Size' },
    {
      key: 'status',
      label: 'Action',
      render: (row) => {
        const status = row.status as string;
        if (status === 'completed') {
          return (
            <button className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
              <Download className="w-3 h-3" /> Download
            </button>
          );
        }
        if (status === 'pending' || status === 'processing') {
          return (
            <button className="inline-flex items-center gap-1 text-[10px] font-medium text-red-400 hover:text-red-300 transition-colors">
              <XCircle className="w-3 h-3" /> Cancel
            </button>
          );
        }
        return <span className="text-[10px]" style={{ color: CSS.textMuted }}>—</span>;
      },
    },
  ], []);

  // ── Consent Logs columns ──
  const consentColumns: DataTableColumnDef[] = useMemo(() => [
    { key: 'user', label: 'User' },
    { key: 'consentType', label: 'Consent Type' },
    {
      key: 'granted',
      label: 'Granted',
      render: (row) => row.granted ? (
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 border-0 bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Yes
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 border-0 bg-red-500/15 text-red-400">
          <XCircle className="w-2.5 h-2.5 mr-0.5" /> No
        </Badge>
      ),
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (row) => (
        <span className="text-xs">
          {new Date(row.timestamp as string).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'ip',
      label: 'IP',
      render: (row) => <span className="font-mono text-xs">{row.ip as string}</span>,
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Database className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Data Governance</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Manage data retention, privacy, and compliance</p>
            </div>
          </div>
        </div>

        {/* ── Retention Policies ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Retention Policies</span>
            <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 border-0', isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600')}>
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
                    'rounded-2xl border p-5 transition-all duration-200',
                    isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{policy.module}</h3>
                      <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
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
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>Retention Period</span>
                      <span className="text-xs font-semibold">{formatRetentionDays(policy.retentionDays)}</span>
                    </div>
                    <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Soft Delete toggle indicator */}
                  <div className={cn('flex items-center gap-2 mb-3 text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                    <span className={cn(
                      'h-2 w-2 rounded-full',
                      policy.softDelete ? 'bg-emerald-400' : 'bg-red-400',
                    )} />
                    Soft Delete: {policy.softDelete ? 'Enabled' : 'Disabled'}
                  </div>

                  {/* Archive rules */}
                  <div className="space-y-1 mb-4">
                    {policy.archiveRules.map((rule, i) => (
                      <div key={i} className={cn('flex items-start gap-2 text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>
                        <Archive className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors w-full justify-center',
                      isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1] hover:text-black',
                    )}
                  >
                    <Pencil className="w-3 h-3" /> Edit Policy
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── Data Export Requests ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Download className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Data Export Requests</span>
          </div>
          <SmartDataTable
            data={dataExportRequests as unknown as Record<string, unknown>[]}
            columns={exportColumns}
            searchable
            searchPlaceholder="Search exports..."
            enableExport
            pageSize={10}
          />
        </motion.div>

        {/* ── Consent Logs ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Consent Logs</span>
          </div>
          <SmartDataTable
            data={consentLogs as unknown as Record<string, unknown>[]}
            columns={consentColumns}
            searchable
            searchPlaceholder="Search consent logs..."
            enableExport
            pageSize={10}
          />
        </motion.div>

        {/* ── GDPR / Delete Workflow ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>GDPR / Delete Workflow</span>
          </div>
          <div className={cn(
            'rounded-2xl border-l-4 border-l-red-500 p-5',
            isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-black/[0.02] border border-black/[0.06]',
          )}>
            <h3 className="text-sm font-semibold mb-2">GDPR Data Deletion Workflow</h3>
            <p className={cn('text-xs mb-4', isDark ? 'text-white/40' : 'text-black/40')}>
              When a deletion request is received, the following steps are executed automatically:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
              {[
                { step: 1, label: 'Request Received', desc: 'User submits deletion request' },
                { step: 2, label: 'Verification', desc: 'Identity verified via email OTP' },
                { step: 3, label: 'Scope Assessment', desc: 'Identify all associated data' },
                { step: 4, label: 'Soft Delete', desc: 'Mark records for deletion (30-day grace)' },
                { step: 5, label: 'Hard Purge', desc: 'Permanently remove from all systems' },
              ].map((s) => (
                <div key={s.step} className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-2', isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600')}>
                    {s.step}
                  </div>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>{s.desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors',
                isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
              )}
            >
              <Trash2 className="w-3.5 h-3.5" /> Request Data Deletion
            </button>
          </div>
        </motion.div>

        {/* ── Tenant Isolation ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Tenant Isolation</span>
          </div>
          <div className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <div className="flex items-start gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', isDark ? 'bg-emerald-500/15' : 'bg-emerald-50')}>
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">Tenant Isolation Active</h3>
                  <span className={cn('h-2 w-2 rounded-full bg-emerald-400', isDark ? 'bg-emerald-400' : 'bg-emerald-500')} />
                </div>
                <p className={cn('text-xs mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
                  Data is fully isolated across tenants with row-level security policies, separate encryption keys, and independent backup schedules.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Active Tenants', value: '12' },
                    { label: 'Encryption', value: 'AES-256 per tenant' },
                    { label: 'Isolation Level', value: 'Row-Level + Encryption' },
                  ].map((item) => (
                    <div key={item.label} className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>{item.label}</span>
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
