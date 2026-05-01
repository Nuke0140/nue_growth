'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import {
  FileText, Plus, Send, Download, Eye, Clock,
  RefreshCw, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { invoices } from './data/mock-data';
import { useFinanceStore } from './finance-store';
import type { Invoice, InvoiceItem } from './types';

// ── Status filter type ──────────────────────────────────
type InvoiceFilter = 'all' | 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

// ── Payment timeline step config ────────────────────────
const timelineSteps = ['Issued', 'Sent', 'Viewed', 'Paid'] as const;

function getStepStatus(step: string, invStatus: string): 'completed' | 'current' | 'pending' {
  const order: Record<string, number> = { draft: 0, sent: 1, viewed: 2, paid: 3 };
  const stepOrder: Record<string, number> = { Issued: 0, Sent: 1, Viewed: 2, Paid: 3 };
  const currentIdx = order[invStatus] ?? 0;
  const stepIdx = stepOrder[step] ?? 0;
  if (stepIdx < currentIdx) return 'completed';
  if (stepIdx === currentIdx) return 'current';
  return 'pending';
}

export default function InvoicesPage() {
  const selectInvoice = useFinanceStore((s) => s.selectInvoice);
  const [activeFilter, setActiveFilter] = useState<InvoiceFilter>('all');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // ── Computed KPI values ───────────────────────────────
  const totalInvoiced = useMemo(
    () => invoices.reduce((s, inv) => s + inv.total, 0),
    [],
  );

  const totalPaid = useMemo(
    () => invoices.filter((inv) => inv.status === 'paid').reduce((s, inv) => s + inv.total, 0),
    [],
  );

  const totalOverdue = useMemo(
    () => invoices.filter((inv) => inv.status === 'overdue').reduce((s, inv) => s + inv.total, 0),
    [],
  );

  const totalDraft = useMemo(
    () => invoices.filter((inv) => inv.status === 'draft').reduce((s, inv) => s + inv.total, 0),
    [],
  );

  // ── Status counts for filter ─────────────────────────
  const statusCounts = useMemo(
    () => ({
      all: invoices.length,
      draft: invoices.filter((i) => i.status === 'draft').length,
      sent: invoices.filter((i) => i.status === 'sent').length,
      viewed: invoices.filter((i) => i.status === 'viewed').length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
    }),
    [],
  );

  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All', count: statusCounts.all },
      { key: 'draft', label: 'Draft', count: statusCounts.draft },
      { key: 'sent', label: 'Sent', count: statusCounts.sent },
      { key: 'viewed', label: 'Viewed', count: statusCounts.viewed },
      { key: 'paid', label: 'Paid', count: statusCounts.paid },
      { key: 'overdue', label: 'Overdue', count: statusCounts.overdue },
    ],
    [statusCounts],
  );

  const filteredInvoices = useMemo(
    () =>
      activeFilter === 'all'
        ? invoices
        : invoices.filter((inv) => inv.status === activeFilter),
    [activeFilter],
  );

  // ── Selected invoice detail ──────────────────────────
  const selectedInvoice = useMemo(
    () => invoices.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [selectedInvoiceId],
  );

  // ── Line items columns for detail panel ──────────────
  const lineItemColumns: DataTableColumnDef[] = useMemo(
    () => [
      {
        key: 'description',
        label: 'Description',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.text }}>{row.description as string}</span>
        ),
      },
      {
        key: 'hsnSac',
        label: 'HSN/SAC',
        render: (row) => (
          <span className="text-xs font-mono" style={{ color: CSS.textSecondary }}>{row.hsnSac as string}</span>
        ),
      },
      {
        key: 'quantity',
        label: 'Qty',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.text }}>{row.quantity as number}</span>
        ),
      },
      {
        key: 'rate',
        label: 'Rate',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.text }}>{formatINR(row.rate as number)}</span>
        ),
      },
      {
        key: 'gstRate',
        label: 'GST',
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>{row.gstRate as number}%</span>
        ),
      },
      {
        key: 'amount',
        label: 'Amount',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(row.amount as number)}</span>
        ),
      },
    ],
    [],
  );

  // ── Main invoices table columns ──────────────────────
  const invoiceTableData = useMemo(
    () =>
      filteredInvoices.map((inv) => ({
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        client: inv.client,
        project: inv.project,
        amount: inv.amount,
        gst: inv.gst,
        total: inv.total,
        status: inv.status,
        issuedDate: inv.issuedDate,
        dueDate: inv.dueDate,
        reminders: inv.reminders ?? 0,
        isRecurring: inv.isRecurring,
        recurringCycle: inv.recurringCycle,
      })),
    [filteredInvoices],
  );

  const invoiceColumns: DataTableColumnDef[] = useMemo(
    () => [
      {
        key: 'invoiceNo',
        label: 'Invoice #',
        sortable: true,
        render: (row) => {
          const isRecurring = row.isRecurring as boolean;
          return (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium" style={{ color: CSS.text }}>
                {row.invoiceNo as string}
              </span>
              {isRecurring && (
                <span
                  className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0 rounded-full font-medium"
                  style={{ backgroundColor: CSS.infoBg, color: CSS.info }}
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  {row.recurringCycle as string}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'client',
        label: 'Client',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.text }}>{row.client as string}</span>
        ),
      },
      {
        key: 'project',
        label: 'Project',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>{row.project as string}</span>
        ),
      },
      {
        key: 'amount',
        label: 'Amount',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(row.amount as number)}</span>
        ),
      },
      {
        key: 'gst',
        label: 'GST',
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>{formatINR(row.gst as number)}</span>
        ),
      },
      {
        key: 'total',
        label: 'Total',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-bold" style={{ color: CSS.text }}>{formatINR(row.total as number)}</span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <StatusBadge status={row.status as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
        ),
      },
      {
        key: 'issuedDate',
        label: 'Issued',
        sortable: true,
        render: (row) => (
          <span className="text-xs" style={{ color: CSS.textSecondary }}>{row.issuedDate as string}</span>
        ),
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        sortable: true,
        render: (row) => (
          <span className="text-xs" style={{ color: CSS.textSecondary }}>{row.dueDate as string}</span>
        ),
      },
      {
        key: 'reminders',
        label: 'Reminders',
        render: (row) => {
          const count = row.reminders as number;
          if (count === 0) return <span className="text-xs" style={{ color: CSS.textMuted }}>—</span>;
          return (
            <span className="text-xs font-medium" style={{ color: count > 3 ? CSS.danger : CSS.warning }}>
              {count} sent
            </span>
          );
        },
      },
    ],
    [],
  );

  // ── Handle row click ─────────────────────────────────
  const handleRowClick = (row: Record<string, unknown>) => {
    const id = row.id as string;
    setSelectedInvoiceId(selectedInvoiceId === id ? null : id);
    selectInvoice(id);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <PageShell
      title="Invoice Management"
      subtitle="Billing, Payments & Collections"
      icon={() => <FileText className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{ backgroundColor: CSS.accent, color: CSS.cardBg }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accentHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accent; }}
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      }
    >
      <div className="space-y-6">
        {/* ── KPIs ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget
            label="Total Invoiced"
            value={formatINR(totalInvoiced)}
            icon={FileText}
            color="accent"
            trend="up"
            trendValue="+12.3%"
          />
          <KpiWidget
            label="Paid"
            value={formatINR(totalPaid)}
            icon={CheckCircle2}
            color="success"
            trend="up"
            trendValue="+5.8%"
          />
          <KpiWidget
            label="Overdue"
            value={formatINR(totalOverdue)}
            icon={AlertTriangle}
            color="danger"
            trend="up"
            trendValue="+2 invoices"
          />
          <KpiWidget
            label="Draft"
            value={formatINR(totalDraft)}
            icon={Clock}
            color="info"
          />
        </div>

        {/* ── Status Tabs ─────────────────────────────── */}
        <FilterBar
          filters={filterItems}
          activeFilter={activeFilter}
          onFilterChange={(k) => setActiveFilter(k as InvoiceFilter)}
        />

        {/* ── Invoices Table ──────────────────────────── */}
        <SmartDataTable
          columns={invoiceColumns}
          data={invoiceTableData}
          onRowClick={handleRowClick}
          searchable
          searchPlaceholder="Search invoices..."
          searchKeys={['invoiceNo', 'client', 'project', 'status']}
          enableExport
          emptyMessage="No invoices found for this status"
          pageSize={10}
        />

        {/* ── Invoice Detail Panel ────────────────────── */}
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" style={{ color: CSS.accent }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>
                    {selectedInvoice.invoiceNo}
                  </h3>
                  <p className="text-xs" style={{ color: CSS.textMuted }}>
                    {selectedInvoice.client} · {selectedInvoice.project}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedInvoice.status} variant="pill" className="text-[10px] px-2.5 py-0.5 capitalize" />
            </div>

            {/* Line Items Table */}
            <div className="mb-5">
              <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: CSS.textMuted }}>
                Line Items ({selectedInvoice.items.length})
              </p>
              <SmartDataTable
                data={selectedInvoice.items as unknown as Record<string, unknown>[]}
                columns={lineItemColumns}
                pageSize={10}
              />
            </div>

            {/* Totals Row */}
            <div
              className="flex items-center justify-end gap-6 p-3 rounded-xl mb-5"
              style={{ backgroundColor: CSS.hoverBg }}
            >
              <div className="text-right">
                <p className="text-[10px]" style={{ color: CSS.textMuted }}>Subtotal</p>
                <p className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(selectedInvoice.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px]" style={{ color: CSS.textMuted }}>GST</p>
                <p className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(selectedInvoice.gst)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px]" style={{ color: CSS.textMuted }}>Total</p>
                <p className="text-lg font-bold" style={{ color: CSS.accent }}>{formatINR(selectedInvoice.total)}</p>
              </div>
            </div>

            {/* Payment Timeline Progress */}
            <div className="mb-5">
              <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: CSS.textMuted }}>
                Payment Timeline
              </p>
              <div className="flex items-center gap-0">
                {timelineSteps.map((step, i) => {
                  const stepStatus = getStepStatus(step, selectedInvoice.status);
                  const stepColor =
                    stepStatus === 'completed'
                      ? CSS.success
                      : stepStatus === 'current'
                        ? CSS.accent
                        : CSS.hoverBg;
                  const textColor =
                    stepStatus === 'completed'
                      ? CSS.success
                      : stepStatus === 'current'
                        ? CSS.accent
                        : CSS.textMuted;

                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: stepColor,
                            color: stepStatus === 'pending' ? CSS.textMuted : CSS.cardBg,
                          }}
                        >
                          {stepStatus === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="text-[10px] mt-1 font-medium" style={{ color: textColor }}>
                          {step}
                        </span>
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div
                          className="h-0.5 flex-1 -mt-3"
                          style={{
                            backgroundColor:
                              getStepStatus(timelineSteps[i + 1], selectedInvoice.status) !== 'pending'
                                ? CSS.success
                                : CSS.hoverBg,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                style={{ backgroundColor: CSS.accentLight, color: CSS.accent }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.accentLight; }}
              >
                <Send className="w-3.5 h-3.5" />
                Send Reminder
              </button>
              {selectedInvoice.status !== 'paid' && (
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: CSS.successBg, color: CSS.success }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.successBg; }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Paid
                </button>
              )}
              <button
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.activeBg; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
