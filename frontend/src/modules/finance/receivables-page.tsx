'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar, CreditCard, Filter, BrainCircuit,
  MessageCircle, Send, User,
} from 'lucide-react';
import { receivables } from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { Receivable } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { FilterBar } from '@/components/shared/filter-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';


type AgingFilter = 'all' | '0-30' | '31-60' | '61-90' | '90+';

const agingBuckets: { label: string; value: AgingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '0-30 days', value: '0-30' },
  { label: '31-60 days', value: '31-60' },
  { label: '61-90 days', value: '61-90' },
  { label: '90+ days', value: '90+' },
];

const stageLabels: Record<string, string> = {
  'first-reminder': '1st Reminder',
  'second-reminder': '2nd Reminder',
  escalation: 'Escalation',
  legal: 'Legal',
  resolved: 'Resolved',
};

const stageStatusMap: Record<string, string> = {
  'first-reminder': 'pending',
  'second-reminder': 'pending',
  escalation: 'escalated',
  legal: 'escalated',
  resolved: 'completed',
};

const bucketColors: Record<string, string> = {
  '0-30': 'emerald',
  '31-60': 'warning',
  '61-90': 'orange',
  '90+': 'danger',
};

export default function ReceivablesPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [agingFilter, setAgingFilter] = useState<AgingFilter>('all');

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const totalOutstanding = useMemo(() =>
    receivables.reduce((s: number, r: Receivable) => s + r.dueAmount, 0),
    []
  );

  const agingSummary = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    receivables.forEach((r: Receivable) => { buckets[r.agingBucket] += r.dueAmount; });
    return [
      { label: '0-30 days', key: '0-30' as const, value: buckets['0-30'] },
      { label: '31-60 days', key: '31-60' as const, value: buckets['31-60'] },
      { label: '61-90 days', key: '61-90' as const, value: buckets['61-90'] },
      { label: '90+ days', key: '90+' as const, value: buckets['90+'] },
    ];
  }, []);

  const filteredReceivables = useMemo(() =>
    agingFilter === 'all' ? receivables : receivables.filter((r: Receivable) => r.agingBucket === agingFilter),
    [agingFilter]
  );

  const getRecoveryPriority = (r: Receivable) => {
    if (r.overdueDays > 30 && r.paymentProbability < 50) return 'critical';
    if (r.overdueDays > 15 || r.followUpStage === 'escalation') return 'high';
    if (r.overdueDays > 0) return 'medium';
    return 'low';
  };

  const getOverdueColor = (days: number) => {
    if (days > 30) return 'red';
    if (days > 0) return 'amber';
    return 'emerald';
  };

  const tableData = useMemo(() =>
    filteredReceivables.map((r: Receivable) => ({
      id: r.id,
      client: r.client,
      invoiceNo: r.invoiceNo,
      project: r.project,
      dueAmount: formatINR(r.dueAmount),
      overdueDays: r.overdueDays,
      overdueColor: getOverdueColor(r.overdueDays),
      assignedOwner: r.assignedOwner,
      paymentProbability: r.paymentProbability,
      expectedPaymentDate: r.expectedPaymentDate,
      followUpStage: r.followUpStage,
      priority: getRecoveryPriority(r),
    })),
    [filteredReceivables]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => <p className="text-sm font-medium" style={{ color: CSS.text }}>{row.client as string}</p>,
    },
    {
      key: 'invoiceNo',
      label: 'Invoice No',
      sortable: true,
      render: (row) => <span className="text-sm font-mono" style={{ color: CSS.text }}>{row.invoiceNo as string}</span>,
    },
    {
      key: 'project',
      label: 'Project',
      render: (row) => <span className="text-sm" style={{ color: CSS.textSecondary }}>{row.project as string}</span>,
    },
    {
      key: 'dueAmount',
      label: 'Due Amount',
      sortable: true,
      render: (row) => <p className="text-sm font-semibold" style={{ color: CSS.text }}>{row.dueAmount as string}</p>,
    },
    {
      key: 'overdueDays',
      label: 'Overdue',
      sortable: true,
      render: (row) => {
        const days = row.overdueDays as number;
        const colorKey = row.overdueColor as string;
        return (
          <span className="text-sm font-semibold" style={{ color: CSS[colorKey as keyof typeof CSS] ?? CSS.text }}>
            {days > 0 ? `${days}d` : 'Current'}
          </span>
        );
      },
    },
    {
      key: 'assignedOwner',
      label: 'Owner',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3" style={{ color: CSS.textMuted }} />
          <span className="text-xs" style={{ color: CSS.text }}>{row.assignedOwner as string}</span>
        </div>
      ),
    },
    {
      key: 'paymentProbability',
      label: 'Probability',
      sortable: true,
      render: (row) => {
        const prob = row.paymentProbability as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${prob}%`,
                  backgroundColor: prob >= 80 ? 'var(--app-success)' : prob >= 60 ? 'var(--app-warning)' : 'var(--app-danger)',
                }}
              />
            </div>
            <span className="text-[10px] font-medium" style={{ color: CSS.text }}>{prob}%</span>
          </div>
        );
      },
    },
    {
      key: 'expectedPaymentDate',
      label: 'Expected',
      render: (row) => <span className="text-xs" style={{ color: CSS.text }}>{row.expectedPaymentDate as string}</span>,
    },
    {
      key: 'followUpStage',
      label: 'Stage',
      sortable: true,
      render: (row) => {
        const stage = row.followUpStage as string;
        return (
          <StatusBadge status={stageStatusMap[stage] ?? stage} variant="pill" className="text-[9px] px-1.5 py-0">
            {stageLabels[stage] ?? stage}
          </StatusBadge>
        );
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.priority as string} variant="pill" className="text-[9px] px-1.5 py-0">
          <BrainCircuit className="w-2.5 h-2.5 mr-0.5" />
          {(row.priority as string).charAt(0).toUpperCase() + (row.priority as string).slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" style={{ color: CSS.success }}>
            <MessageCircle className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" style={{ color: CSS.info }}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <PageShell
      title="Receivables"
      subtitle={
        <span>Total Outstanding: <span style={{ color: CSS.danger, fontWeight: 600 }}>{formatINR(totalOutstanding)}</span></span>
      }
      icon={() => <CreditCard className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <span className="px-3 py-1.5 text-xs font-medium rounded-full" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
          <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
          {today}
        </span>
      }
    >
      <div className="space-y-6">
        {/* Aging Bucket Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agingSummary.map((bucket, i) => (
            <motion.div
              key={bucket.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setAgingFilter(bucket.key === agingFilter ? 'all' : bucket.key)}
              className="rounded-2xl border p-4 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: agingFilter === bucket.key ? CSS.activeBg : CSS.hoverBg,
                borderColor: agingFilter === bucket.key ? CSS.accent : CSS.border,
                boxShadow: agingFilter === bucket.key ? `0 0 0 1px ${CSS.accent}20` : CSS.shadowCard,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                  {bucket.label}
                </span>
                <span className="text-[10px] font-medium" style={{ color: CSS[bucketColors[bucket.key] as keyof typeof CSS] ?? CSS.textMuted }}>
                  {receivables.filter((r: Receivable) => r.agingBucket === bucket.key).length} invoices
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: CSS[bucketColors[bucket.key] as keyof typeof CSS] ?? CSS.text }}>
                {formatINR(bucket.value)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4" style={{ color: CSS.textMuted }} />
          <FilterBar
            filters={agingBuckets.map((b) => ({ key: b.value, label: b.label }))}
            activeFilter={agingFilter}
            onFilterChange={(k) => setAgingFilter(k as AgingFilter)}
          />
        </div>

        {/* Receivables Table */}
        <SmartDataTable
          columns={columns}
          data={tableData}
          searchable
          searchPlaceholder="Search receivables..."
          searchKeys={['client', 'invoiceNo', 'project', 'assignedOwner']}
          enableExport
          emptyMessage="No data for this aging bucket"
          pageSize={10}
        />

        {/* WhatsApp CTA Section */}
        {filteredReceivables.some((r: Receivable) => r.overdueDays > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-success) 4%, transparent)', borderColor: 'color-mix(in srgb, var(--app-success) 20%, transparent)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--app-success) 15%, transparent)' }}>
                  <MessageCircle className="w-5 h-5" style={{ color: CSS.success }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: CSS.text }}>Bulk WhatsApp Reminder</p>
                  <p className="text-xs" style={{ color: CSS.textMuted }}>
                    Send payment reminders to {filteredReceivables.filter((r: Receivable) => r.overdueDays > 0).length} overdue clients
                  </p>
                </div>
              </div>
              <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: 'color-mix(in srgb, var(--app-success) 20%, transparent)', color: CSS.success }}>
                <MessageCircle className="w-4 h-4" />
                Send Reminders
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
