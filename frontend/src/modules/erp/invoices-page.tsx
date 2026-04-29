'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Wallet, AlertTriangle, Clock, FileText, Receipt,
  ExternalLink, Repeat, Send, Bell, FileDown, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { FilterBar } from '@/components/shared/filter-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockInvoices } from '@/modules/erp/data/mock-data';
import type { InvoiceStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

function InvoicesPageInner() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return mockInvoices;
    return mockInvoices.filter(i => i.status === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => {
    const total = mockInvoices.reduce((s, i) => s + i.amount, 0);
    const paid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.paidAmount, 0);
    const overdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
    const receivable = mockInvoices.filter(i => i.status === 'sent' || i.status === 'overdue' || i.status === 'partial').reduce((s, i) => s + (i.amount - i.paidAmount), 0);
    return { total, paid, overdue, receivable };
  }, []);

  const filters = [
    { key: 'all', label: 'All', count: mockInvoices.length },
    { key: 'draft', label: 'Draft', count: mockInvoices.filter(i => i.status === 'draft').length },
    { key: 'sent', label: 'Sent', count: mockInvoices.filter(i => i.status === 'sent').length },
    { key: 'paid', label: 'Paid', count: mockInvoices.filter(i => i.status === 'paid').length },
    { key: 'overdue', label: 'Overdue', count: mockInvoices.filter(i => i.status === 'overdue').length },
    { key: 'partial', label: 'Partial', count: mockInvoices.filter(i => i.status === 'partial').length },
  ];

  const columns: DataTableColumnDef[] = [
    {
      key: 'invoiceNo',
      label: 'Invoice',
      sortable: true,
      render: (row) => {
        const inv = row as unknown as typeof mockInvoices[0];
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: CSS.hoverBg }}
            >
              <FileText className="w-4 h-4" style={{ color: CSS.textMuted }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium" style={{ color: CSS.text }}>{inv.invoiceNo}</p>
                {inv.recurring && (
                  <Badge className="px-1.5 py-0 text-[9px] font-bold border bg-violet-500/15 text-violet-400 border-violet-500/20">
                    <Repeat className="w-2.5 h-2.5 mr-0.5" />Repeat
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {String(row.client)}
        </span>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      render: (row) => (
        <span className="text-xs truncate block max-w-[180px]" style={{ color: CSS.textMuted }}>
          {String(row.project)}
        </span>
      ),
    },
    {
      key: 'gst',
      label: 'GST',
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textMuted }}>
          {formatINR(Number(row.gst))}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <div className="text-right">
          <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(Number(row.amount))}</span>
          <span className="text-[10px] block" style={{ color: CSS.textDisabled }}>
            + {formatINR(Number(row.gst))} GST
          </span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textMuted }}>
          {new Date(String(row.dueDate)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'paidAmount',
      label: 'Paid',
      render: (row) => {
        const inv = row as unknown as typeof mockInvoices[0];
        const paidPct = inv.amount > 0 ? Math.round((inv.paidAmount / inv.amount) * 100) : 0;
        if (inv.status === 'partial') {
          return (
            <div className="space-y-1 text-right">
              <span className="text-xs font-medium" style={{ color: CSS.text }}>{formatINR(inv.paidAmount)}</span>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${paidPct}%` }} />
              </div>
              <span className="text-[9px] block" style={{ color: CSS.textDisabled }}>{paidPct}% paid</span>
            </div>
          );
        }
        return (
          <span className="text-xs" style={{ color: CSS.textSecondary }}>
            {inv.paidAmount > 0 ? formatINR(inv.paidAmount) : '—'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const status = String(row.status) as InvoiceStatus;
        if (status === 'overdue') {
          return (
            <motion.span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border bg-red-500/15 text-red-400 border-red-500/20"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Overdue
            </motion.span>
          );
        }
        return <StatusBadge status={status} />;
      },
    },
  ];

  return (
    <PageShell title="Invoices" icon={Receipt}>
      <div className="space-y-6">
        {/* Filter Tabs */}
        <FilterBar
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Amount" value={formatINR(stats.total)} icon={DollarSign} color="accent" />
          <KpiWidget label="Paid" value={formatINR(stats.paid)} icon={Wallet} color="success" />
          <KpiWidget label="Overdue" value={formatINR(stats.overdue)} icon={AlertTriangle} color="danger" />
          <KpiWidget label="Receivable" value={formatINR(stats.receivable)} icon={Clock} color="warning" />
        </div>

        {/* Table */}
        <SmartDataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable
          searchPlaceholder="Search invoices..."
          searchKeys={['invoiceNo', 'client', 'project']}
          emptyMessage="No invoices found"
          pageSize={8}
          enableExport
          actions={(row) => {
            const inv = row as unknown as typeof mockInvoices[0];
            return (
              <TooltipProvider delayDuration={0}>
                <div className="flex items-center justify-center gap-1">
                  {inv.paymentLink && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          style={{ color: CSS.textMuted }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Payment Link</p></TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        style={{ color: CSS.textMuted }}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>PDF Preview</p></TooltipContent>
                  </Tooltip>
                  {inv.status === 'sent' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          style={{ color: CSS.textMuted }}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Resend</p></TooltipContent>
                    </Tooltip>
                  )}
                  {(inv.status === 'overdue' || inv.status === 'partial') && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          style={{ color: '#fbbf24' }}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Send Reminder</p></TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            );
          }}
        />
      </div>
    </PageShell>
  );
}

export default memo(InvoicesPageInner);
