'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, BarChart3, AlertTriangle, Clock, Timer,
  RotateCcw, MoreHorizontal, Check, X,
} from 'lucide-react';
import { CSS } from '@/styles/design-tokens';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageShell } from './components/ops/page-shell';
import { mockDeliveryItems, mockProjects } from '@/modules/erp/data/mock-data';
import type { DeliveryStatus } from '@/modules/erp/types';

function getStatusLabel(status: DeliveryStatus) {
  const map: Record<DeliveryStatus, string> = {
    'pending': 'Pending', 'in-progress': 'In Progress', 'review': 'Review',
    'client-review': 'Client Review', 'approved': 'Approved', 'revision': 'Revision', 'delivered': 'Delivered'
  };
  return map[status] || status;
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

function DeliveryOperationsPageInner() {
  const enriched = useMemo(() => {
    return mockDeliveryItems.map(item => {
      const project = mockProjects.find(p => p.id === item.projectId);
      return { ...item, projectName: project?.name || item.projectId };
    });
  }, []);

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const stats = useMemo(() => ({
    today: enriched.filter(d => d.status === 'in-progress' || d.status === 'review').length,
    blocked: enriched.filter(d => d.status === 'revision').length,
    pendingApproval: enriched.filter(d => d.status === 'client-review').length,
    sla: Math.round(enriched.filter(d => d.clientApproval).length / Math.max(enriched.length, 1) * 100),
    avgTime: '6.2d',
    revisions: enriched.reduce((s, d) => s + d.revisionRounds, 0),
  }), [enriched]);

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'deliverable', label: 'Deliverable', sortable: true,
      render: (row) => {
        const isBlocked = row.status === 'revision';
        return (
          <div className="flex items-center gap-2">
            {isBlocked && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
              </motion.div>
            )}
            <span className={`text-sm font-medium truncate ${isBlocked ? 'text-red-500 dark:text-red-400' : ''}`}>
              {String(row.deliverable)}
            </span>
          </div>
        );
      },
    },
    { key: 'projectName', label: 'Project', sortable: true, visible: false, render: (row) => <span className="text-xs truncate max-w-[180px] block" style={{ color: CSS.textSecondary }}>{String(row.projectName)}</span> },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, visible: false, render: (row) => <span className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.assignedTo)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={getStatusLabel(row.status as DeliveryStatus)} variant="pill" /> },
    {
      key: 'dueDate', label: 'Due Date', sortable: true,
      render: (row) => {
        const overdue = isOverdue(String(row.dueDate)) && row.status !== 'delivered' && row.status !== 'approved';
        return (
          <span>
            <span className={`text-xs font-medium ${overdue ? 'text-amber-500 dark:text-amber-400' : ''}`} style={!overdue ? { color: CSS.textSecondary } : undefined}>
              {new Date(String(row.dueDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            {overdue && <span className="text-[9px] text-amber-500 block">OVERDUE</span>}
          </span>
        );
      },
    },
    {
      key: 'clientApproval', label: 'Client',
      render: (row) => row.clientApproval ? (
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Yes</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <X className="w-3.5 h-3.5" style={{ color: CSS.textDisabled }} />
          <span className="text-[10px]" style={{ color: CSS.textMuted }}>No</span>
        </div>
      ),
    },
    {
      key: 'revisionRounds', label: 'Revisions', sortable: true, visible: false,
      render: (row) => {
        const rounds = Number(row.revisionRounds);
        return <span className={`text-xs font-medium ${rounds > 0 ? 'text-orange-400' : ''}`}>{rounds}</span>;
      },
    },
  ], []);

  return (
    <PageShell title="Delivery Operations" icon={Truck} subtitle={todayStr}>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label: "Today's Deliveries", value: stats.today, icon: Truck },
            { label: 'Blocked', value: stats.blocked, icon: AlertTriangle, warn: stats.blocked > 0 },
            { label: 'Pending Approval', value: stats.pendingApproval, icon: Clock },
            { label: 'SLA %', value: `${stats.sla}%`, icon: BarChart3 },
            { label: 'Avg Delivery Time', value: stats.avgTime, icon: Timer },
            { label: 'Revision Rounds', value: stats.revisions, icon: RotateCcw },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border p-3" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderLight, boxShadow: CSS.shadowCard }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>{stat.label}</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.warn ? 'rgba(239,68,68,0.1)' : CSS.hoverBg }}>
                  <stat.icon className={`w-3 h-3 ${stat.warn ? 'text-red-500 dark:text-red-400' : ''}`} style={!stat.warn ? { color: CSS.textDisabled } : undefined} />
                </div>
              </div>
              <p className={`text-lg font-bold ${stat.warn ? 'text-red-500 dark:text-red-400' : ''}`} style={!stat.warn ? { color: CSS.text } : undefined}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <SmartDataTable
          data={enriched as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable
          searchPlaceholder="Search deliveries..."
          enableExport
          emptyMessage="No deliveries found"
          pageSize={8}
        />
    </PageShell>
  );
}

export default memo(DeliveryOperationsPageInner);
