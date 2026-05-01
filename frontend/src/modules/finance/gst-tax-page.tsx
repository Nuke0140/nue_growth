'use client';

import { formatINR } from './utils';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileText, AlertTriangle, Clock, CheckCircle2, Download,
  Calendar, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight,
  Shield, IndianRupee, AlertCircle,
} from 'lucide-react';
import { gstSummaries, taxFilings } from '@/modules/finance/data/mock-data';
import type { GSTSummary, TaxFiling } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';


const typeStatusMap: Record<string, string> = {
  'GSTR-1': 'info',
  'GSTR-3B': 'info',
  'TDS': 'warning',
  'advance-tax': 'success',
};

export default function GSTTaxPage() {
  const totalCollected = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstCollected, 0), []);
  const totalPayable = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstPayable, 0), []);
  const totalReceivable = useMemo(() => gstSummaries.reduce((s, g) => s + g.gstReceivable, 0), []);
  const totalTDSDeducted = useMemo(() => gstSummaries.reduce((s, g) => s + g.tdsDeducted, 0), []);
  const totalTaxLiability = useMemo(() => gstSummaries.reduce((s, g) => s + g.taxLiability, 0), []);
  const totalFiled = useMemo(() => taxFilings.filter(f => f.status === 'filed').length, []);

  const overdueFilings = useMemo(() => taxFilings.filter(f => f.status === 'overdue'), []);
  const upcomingFilings = useMemo(() => taxFilings.filter(f => f.status === 'pending'), []);
  const maxGSTCollected = useMemo(() => Math.max(...gstSummaries.map(g => g.gstCollected)), []);

  const kpis = [
    { label: 'GST Collected', value: formatINR(totalCollected), icon: TrendingUp, color: 'success', change: 12.4 },
    { label: 'GST Payable', value: formatINR(totalPayable), icon: IndianRupee, color: 'warning', change: 8.2 },
    { label: 'GST Receivable', value: formatINR(totalReceivable), icon: ArrowDownRight, color: 'info', change: 15.1 },
    { label: 'TDS Deducted', value: formatINR(totalTDSDeducted), icon: Shield, color: 'accent', change: 6.8 },
    { label: 'Tax Liability', value: formatINR(totalTaxLiability), icon: AlertTriangle, color: 'danger', change: -3.2 },
    { label: 'Total Filed', value: `${totalFiled}/${taxFilings.length}`, icon: CheckCircle2, color: 'success', change: 10 },
  ];

  const tableData = useMemo(() =>
    taxFilings.map((f: TaxFiling) => ({
      id: f.id,
      period: f.period,
      type: f.type,
      dueDate: f.dueDate,
      filedDate: f.filedDate || '—',
      status: f.status,
      amount: formatINR(f.amount),
    })),
    []
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'period',
      label: 'Period',
      sortable: true,
      render: (row) => <span className="text-sm whitespace-nowrap" style={{ color: CSS.text }}>{row.period as string}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <StatusBadge status={typeStatusMap[row.type as string] ?? (row.type as string)} variant="pill" className="text-[10px] px-2 py-0">
          {row.type as string}
        </StatusBadge>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (row) => <span className="text-sm whitespace-nowrap" style={{ color: CSS.text }}>{row.dueDate as string}</span>,
    },
    {
      key: 'filedDate',
      label: 'Filed Date',
      render: (row) => <span className="text-sm whitespace-nowrap" style={{ color: row.filedDate === '—' ? CSS.textMuted : CSS.text }}>{row.filedDate as string}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'filed' && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: CSS.success }} />}
          {row.status === 'pending' && <Clock className="w-3.5 h-3.5" style={{ color: CSS.warning }} />}
          {row.status === 'overdue' && <AlertCircle className="w-3.5 h-3.5" style={{ color: CSS.danger }} />}
          <StatusBadge status={row.status as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold whitespace-nowrap" style={{ color: CSS.text }}>{row.amount as string}</span>,
    },
  ], []);

  return (
    <PageShell
      title="GST & Tax"
      subtitle="India GST & Tax Workspace"
      icon={() => <IndianRupee className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="px-3 py-2 text-sm font-medium rounded-xl gap-2" style={{ borderColor: CSS.border, color: CSS.textSecondary }}>
            <Download className="w-4 h-4" /> Export GST Report
          </Button>
          <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
            <FileText className="w-4 h-4" /> File GST
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {kpis.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <KpiWidget
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={isPositive ? 'up' : 'down'}
                trendValue={`${isPositive ? '+' : ''}${stat.change}%`}
              />
            );
          })}
        </div>

        {/* Monthly GST Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.15 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Monthly GST Trend</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-36">
            {gstSummaries.map((gst: GSTSummary, j) => {
              const periodShort = gst.period.split(' ')[0].slice(0, 3);
              return (
                <div key={gst.period} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-0.5 w-full h-28">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(gst.gstCollected / maxGSTCollected) * 100}%` }} transition={{ delay: 0.4 + j * 0.05, duration: 0.15 }} className="flex-1 rounded-t-sm" style={{ backgroundColor: 'rgba(52, 211, 153, 0.4)' }} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(gst.gstPayable / maxGSTCollected) * 100}%` }} transition={{ delay: 0.4 + j * 0.05 + 0.08, duration: 0.15 }} className="flex-1 rounded-t-sm" style={{ backgroundColor: 'rgba(251, 191, 36, 0.4)' }} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(gst.taxLiability / maxGSTCollected) * 100}%` }} transition={{ delay: 0.4 + j * 0.05 + 0.16, duration: 0.15 }} className="flex-1 rounded-t-sm" style={{ backgroundColor: 'rgba(248, 113, 113, 0.4)' }} />
                  </div>
                  <span className="text-[9px]" style={{ color: CSS.textMuted }}>{periodShort}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Filing Calendar Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Filing Calendar</span>
            </div>
          </div>
          <SmartDataTable
            columns={columns}
            data={tableData}
            searchable
            searchPlaceholder="Search filings..."
            searchKeys={['period', 'type']}
            enableExport
            emptyMessage="No filings found"
            pageSize={10}
          />
        </div>

        {/* Overdue Filings Alert */}
        {overdueFilings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-danger) 3%, transparent)', borderColor: 'color-mix(in srgb, var(--app-danger) 12%, transparent)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.danger }}>Overdue Filings</span>
            </div>
            <div className="space-y-2">
              {overdueFilings.map((f, i) => (
                <motion.div key={f.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.05, duration: 0.3 }} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>{f.type} — {f.period}</p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>Due: {f.dueDate} · {formatINR(f.amount)}</p>
                    </div>
                  </div>
                  <Button size="sm" className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: CSS.danger, color: '#fff' }}>File Now</Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Filings */}
        {upcomingFilings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-warning) 3%, transparent)', borderColor: 'color-mix(in srgb, var(--app-warning) 12%, transparent)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>Upcoming Filings</span>
            </div>
            <div className="space-y-2">
              {upcomingFilings.map((f, i) => {
                const dueDate = new Date(f.dueDate);
                const now = new Date();
                const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                return (
                  <motion.div key={f.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.95 + i * 0.05, duration: 0.3 }} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" style={{ color: CSS.warning }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: CSS.text }}>{f.type} — {f.period}</p>
                        <p className="text-xs" style={{ color: CSS.textMuted }}>Due: {f.dueDate} · {formatINR(f.amount)}</p>
                      </div>
                    </div>
                    <StatusBadge status="pending" variant="pill" className="text-xs px-3 py-1">
                      {daysLeft} days left
                    </StatusBadge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
