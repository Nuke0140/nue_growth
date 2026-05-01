import React, { useState, useMemo } from 'react';
import {
  Receipt, AlertTriangle, Clock, CheckCircle2, XCircle, ChevronRight, Shield,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { useFinanceStore } from './finance-store';
import { formatINR } from './utils';
import { payables } from './data/mock-data';
import type { Payable } from './types';
import { CSS } from '@/styles/design-tokens';

/* ─── KPI cards ─── */
const kpis = [
  { label: 'Total Payables', value: formatINR(4280000), color: 'warning' as const, icon: Receipt },
  { label: 'Overdue', value: formatINR(24000), color: 'danger' as const, icon: AlertTriangle },
  { label: 'Pending Approval', value: formatINR(745000), color: 'info' as const, icon: Clock },
];

/* ─── Filter definitions ─── */
type FilterKey = 'all' | 'pending' | 'approved' | 'overdue' | 'paid';

/* ─── Priority Queue ─── */
const PriorityQueue: React.FC<{ items: Payable[] }> = ({ items }) => {
  const high = items.filter((p) => p.payoutPriority === 'high');
  if (high.length === 0) return null;
  return (
    <div className="priority-queue">
      <h3 className="queue-heading">
        <AlertTriangle size={16} /> Priority Queue
      </h3>
      {high.map((p) => (
        <div key={p.id} className="queue-card">
          <div className="queue-card-top">
            <span className="queue-vendor">{p.vendor || p.freelancer}</span>
            <span className="queue-amount">{formatINR(p.amount)}</span>
          </div>
          <div className="queue-card-meta">
            <span>Due {p.dueDate}</span>
            <StatusBadge status={p.approvalStatus} />
            {p.penaltyRisk && p.penaltyAmount && p.penaltyAmount > 0 && (
              <span className="penalty-badge">
                <Shield size={12} /> Penalty ₹{p.penaltyAmount.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {p.approvalFlow && (
            <span className="approval-progress">
              <CheckCircle2 size={12} />
              {p.approvalFlow.filter((s) => s.status === 'approved').length}/{p.approvalFlow.length} approved
            </span>
          )}
        </div>
      ))}
      <style>{`
        .priority-queue { margin-bottom: var(--space-5); }
        .queue-heading {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);
          color: var(--color-warning); margin-bottom: var(--space-3);
        }
        .queue-card {
          display: flex; flex-direction: column; gap: var(--space-2);
          padding: var(--space-3); margin-bottom: var(--space-2);
          background: var(--surface-elevated, var(--surface-primary));
          border: 1px solid color-mix(in srgb, var(--color-warning) 20%, transparent);
          border-radius: var(--radius-md, 8px);
        }
        .queue-card-top { display: flex; justify-content: space-between; align-items: center; }
        .queue-vendor { font-weight: var(--font-weight-medium); color: var(--text-primary); }
        .queue-amount { font-weight: var(--font-weight-semibold); color: var(--text-primary); }
        .queue-card-meta {
          display: flex; gap: var(--space-3); align-items: center;
          font-size: var(--font-size-xs); color: var(--text-secondary);
        }
        .penalty-badge {
          display: inline-flex; align-items: center; gap: 4px;
          color: var(--color-danger); font-weight: var(--font-weight-medium);
        }
        .approval-progress {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: var(--font-size-xs); color: var(--color-info);
        }
      `}</style>
    </div>
  );
};

/* ─── Main Page ─── */
export const PayablesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const navigate = useFinanceStore((s) => s.navigateTo);

  /* filter counts */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: payables.length, pending: 0, approved: 0, overdue: 0, paid: 0 };
    payables.forEach((p) => { if (c[p.approvalStatus] !== undefined) c[p.approvalStatus]++; });
    return c;
  }, []);

  /* filtered rows */
  const filtered = useMemo(
    () => (activeFilter === 'all' ? payables : payables.filter((p) => p.approvalStatus === activeFilter)),
    [activeFilter],
  );

  /* table columns */
  const columns: DataTableColumnDef[] = useMemo(() => [
    { key: 'vendor', label: 'Vendor / Freelancer', render: (row) => <span>{(row.vendor || row.freelancer) as string}</span> },
    { key: 'amount', label: 'Amount', render: (row) => formatINR(row.amount as number) },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'payoutPriority', label: 'Priority', render: (row) => <StatusBadge status={row.payoutPriority === 'high' ? 'danger' : row.payoutPriority === 'medium' ? 'warning' : 'info'} /> },
    { key: 'approvalStatus', label: 'Status', render: (row) => <StatusBadge status={row.approvalStatus as string} /> },
    { key: 'penaltyRisk', label: 'Penalty Risk', render: (row) => (row.penaltyAmount && (row.penaltyAmount as number) > 0 ? <span style={{ color: CSS.danger }}>₹{(row.penaltyAmount as number).toLocaleString('en-IN')}</span> : '—') },
    { key: 'category', label: 'Category' },
  ], []);

  const approveSelected = () => {
    alert(`Approved ${selected.size} payables`);
    setSelected(new Set());
  };

  const schedulePayment = () => {
    alert(`Scheduled payment for ${selected.size} payables`);
    setSelected(new Set());
  };

  const filterItems = useMemo(() => [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'approved', label: `Approved (${counts.approved})` },
    { key: 'overdue', label: `Overdue (${counts.overdue})` },
    { key: 'paid', label: `Paid (${counts.paid})` },
  ], [counts]);

  return (
    <PageShell title="Payables & Payouts">
      {/* KPIs */}
      <div className="kpi-row">
        {kpis.map((k) => (
          <KpiWidget key={k.label} label={k.label} value={k.value} color={k.color} icon={k.icon} />
        ))}
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterItems}
        activeFilter={activeFilter}
        onFilterChange={(k) => setActiveFilter(k as FilterKey)}
      />

      {/* Priority Queue */}
      <PriorityQueue items={filtered} />

      {/* Table */}
      <SmartDataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns}
        selectable
      />

      {/* Quick Actions */}
      <div className="actions-bar">
        <button
          className="action-btn action-btn--primary"
          disabled={selected.size === 0}
          onClick={approveSelected}
        >
          <CheckCircle2 size={16} /> Approve Selected ({selected.size})
        </button>
        <button
          className="action-btn action-btn--secondary"
          disabled={selected.size === 0}
          onClick={schedulePayment}
        >
          <Clock size={16} /> Schedule Payment
        </button>
      </div>

      <style>{`
        .kpi-row {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-4); margin-bottom: var(--space-5);
        }
        .actions-bar {
          display: flex; gap: var(--space-3); margin-top: var(--space-4);
        }
        .action-btn {
          display: inline-flex; align-items: center; gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md, 8px); font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium); cursor: pointer; border: none;
          transition: opacity 0.2s;
        }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn--primary {
          background: var(--color-accent); color: var(--text-on-accent, #fff);
        }
        .action-btn--primary:hover:not(:disabled) { opacity: 0.9; }
        .action-btn--secondary {
          background: var(--surface-elevated, var(--surface-primary)); color: var(--text-primary);
          border: 1px solid var(--border-primary, var(--border-default, #e2e8f0));
        }
        .action-btn--secondary:hover:not(:disabled) { background: var(--surface-hover, var(--surface-secondary)); }
      `}</style>
    </PageShell>
  );
};

export default PayablesPage;
