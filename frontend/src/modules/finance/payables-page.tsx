'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar, HandCoins, Clock, AlertTriangle, CheckCircle2, XCircle,
  Filter, CalendarClock, Zap,
} from 'lucide-react';
import { payables } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Payable } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { FilterBar } from '@/components/shared/filter-bar';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';


type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'paid';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export default function PayablesPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const pendingPayables = useMemo(() => payables.filter((p: Payable) => p.approvalStatus === 'pending'), []);
  const approvedPayables = useMemo(() => payables.filter((p: Payable) => p.approvalStatus === 'approved'), []);
  const urgentPayables = useMemo(() => payables.filter((p: Payable) => p.payoutPriority === 'high' && p.approvalStatus !== 'paid'), []);

  const totalPending = pendingPayables.reduce((s: number, p: Payable) => s + p.amount, 0);
  const totalApproved = approvedPayables.reduce((s: number, p: Payable) => s + p.amount, 0);
  const totalUrgent = urgentPayables.reduce((s: number, p: Payable) => s + p.amount, 0);

  const filteredPayables = useMemo(() =>
    payables.filter((p: Payable) => {
      if (statusFilter !== 'all' && p.approvalStatus !== statusFilter) return false;
      if (priorityFilter !== 'all' && p.payoutPriority !== priorityFilter) return false;
      return true;
    }),
    [statusFilter, priorityFilter]
  );

  const statusFilterItems = useMemo(() => [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'paid', label: 'Paid' },
  ], []);

  const priorityFilterItems = useMemo(() => [
    { key: 'all', label: 'All Priority' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
  ], []);

  const tableData = useMemo(() =>
    filteredPayables.map((p: Payable) => ({
      id: p.id,
      vendor: p.vendor || p.freelancer,
      linkedInvoice: p.linkedInvoice || '—',
      amount: formatINR(p.amount),
      dueDate: p.dueDate,
      isOverdue: new Date(p.dueDate) < new Date() && p.approvalStatus !== 'paid',
      approvalStatus: p.approvalStatus,
      payoutPriority: p.payoutPriority,
      penaltyRisk: p.penaltyRisk,
      category: p.category,
    })),
    [filteredPayables]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'vendor',
      label: 'Vendor / Freelancer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium" style={{ color: CSS.text }}>{row.vendor as string}</p>
          <p className="text-[10px]" style={{ color: CSS.textMuted }}>{row.linkedInvoice as string}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <p className="text-sm font-semibold" style={{ color: CSS.text }}>{row.amount as string}</p>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (row) => (
        <span
          className="text-sm"
          style={{ color: row.isOverdue ? CSS.danger : CSS.text, fontWeight: row.isOverdue ? 500 : 400 }}
        >
          {row.dueDate as string}
        </span>
      ),
    },
    {
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.approvalStatus as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
    {
      key: 'payoutPriority',
      label: 'Priority',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.payoutPriority as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
    {
      key: 'penaltyRisk',
      label: 'Penalty Risk',
      render: (row) =>
        row.penaltyRisk ? (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: CSS.danger }} />
            <span className="text-[10px] font-medium" style={{ color: CSS.danger }}>Yes</span>
          </div>
        ) : (
          <span className="text-[10px]" style={{ color: CSS.textMuted }}>None</span>
        ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <StatusBadge status={row.category as string} variant="pill" className="text-[10px] px-2 py-0" />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        const status = row.approvalStatus as string;
        return (
          <div className="flex items-center gap-1">
            {status === 'pending' && (
              <>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" style={{ color: CSS.success }}>
                  <CheckCircle2 className="w-3 h-3" /> Approve
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1" style={{ color: CSS.danger }}>
                  <XCircle className="w-3 h-3" /> Reject
                </Button>
              </>
            )}
            {status === 'approved' && (
              <Button size="sm" className="h-7 px-3 text-[10px] gap-1 rounded-lg" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
                <CalendarClock className="w-3 h-3" /> Pay Now
              </Button>
            )}
            {status === 'paid' && (
              <StatusBadge status="completed" variant="pill" className="text-[10px] px-2 py-0">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Completed
              </StatusBadge>
            )}
          </div>
        );
      },
    },
  ], []);

  return (
    <PageShell
      title="Payables"
      subtitle="Vendor Payout Workspace"
      icon={() => <HandCoins className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-full" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
            {today}
          </span>
          <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
            <CalendarClock className="w-4 h-4" /> Schedule Payout
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget label="Total Pending" value={formatINR(totalPending)} icon={Clock} color="warning" trend={undefined} />
          <KpiWidget label="Approved" value={formatINR(totalApproved)} icon={CheckCircle2} color="success" trend={undefined} />
          <KpiWidget label="Urgent" value={formatINR(totalUrgent)} icon={Zap} color="danger" trend={undefined} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: CSS.textMuted }} />
            <span className="text-xs font-medium" style={{ color: CSS.textMuted }}>Status:</span>
            <FilterBar filters={statusFilterItems} activeFilter={statusFilter} onFilterChange={(k) => setStatusFilter(k as StatusFilter)} />
          </div>
          <div className="w-px h-5" style={{ backgroundColor: CSS.border }} />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: CSS.textMuted }}>Priority:</span>
            <FilterBar filters={priorityFilterItems} activeFilter={priorityFilter} onFilterChange={(k) => setPriorityFilter(k as PriorityFilter)} />
          </div>
        </div>

        {/* Payables Table */}
        <SmartDataTable
          columns={columns}
          data={tableData}
          searchable
          searchPlaceholder="Search payables..."
          searchKeys={['vendor', 'linkedInvoice', 'category']}
          enableExport
          emptyMessage="No payables match the selected filters"
          pageSize={10}
        />
      </div>
    </PageShell>
  );
}
