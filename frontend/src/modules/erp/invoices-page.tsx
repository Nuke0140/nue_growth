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

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  }

  const filters: { key: FilterKey; label: string; count: number }[] = [
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
      <div className="space-y-app-2xl">
        {/* Search + Actions */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className={cn('h-10  w-9 rounded-[var(--app-radius-lg)] shrink-0', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Create Invoice</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit" style={{ background: 'var(--app-hover-bg)' }}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button key={f.key} onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors duration-200', isActive ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]') : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'))}>
                <span className="hidden sm:inline">{f.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? ('bg-[var(--app-hover-bg)]') : ('bg-[var(--app-hover-bg)]'))}>{f.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Amount', value: formatINR(stats.total), icon: DollarSign },
            { label: 'Paid', value: formatINR(stats.paid), icon: Wallet },
            { label: 'Overdue', value: formatINR(stats.overdue), icon: AlertTriangle },
            { label: 'Receivable', value: formatINR(stats.receivable), icon: Clock },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border-light)]')}>
                  <th className="text-left px-4 py-3"><button onClick={() => handleSort('invoiceNo')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">Invoice {renderSortIcon('invoiceNo')}</button></th>
                  <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Client</span></th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Project</span></th>
                  <th className="text-right px-3 py-3 hidden sm:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">GST</span></th>
                  <th className="text-right px-3 py-3"><span className="text-[11px] font-semibold uppercase tracking-wider">Amount</span></th>
                  <th className="text-left px-3 py-3 hidden md:table-cell"><button onClick={() => handleSort('dueDate')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">Due {renderSortIcon('dueDate')}</button></th>
                  <th className="text-right px-3 py-3 hidden lg:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Paid</span></th>
                  <th className="text-center px-3 py-3"><button onClick={() => handleSort('status')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider mx-auto">Status {renderSortIcon('status')}</button></th>
                  <th className="text-center px-3 py-3 w-32"><span className="text-[11px] font-semibold uppercase tracking-wider">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn('w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                          <FileText className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                        </div>
                        <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No invoices found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((inv, idx) => {
                    const statusConf = getStatusConfig(inv.status, isDark);
                    const paidPct = inv.amount > 0 ? Math.round((inv.paidAmount / inv.amount) * 100) : 0;
                    const totalWithGst = inv.amount + inv.gst;
                    return (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn('border-b cursor-pointer transition-colors duration-150 last:border-0', isDark ? 'border-white/[0.03] hover:bg-white/[0.04]' : 'border-black/[0.03] hover:bg-black/[0.02]')}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', 'bg-[var(--app-hover-bg)]')}>
                              <FileText className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium">{inv.invoiceNo}</p>
                                {inv.recurring && (
                                  <Badge className={cn('px-1.5 py-0 text-[9px] font-bold border', isDark ? 'bg-violet-500/15 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200')}>
                                    <Repeat className="w-2.5 h-2.5 mr-0.5" />Repeat
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{inv.client}</span></td>
                        <td className="px-3 py-3 hidden lg:table-cell"><span className={cn('text-xs truncate block max-w-[180px]', 'text-[var(--app-text-muted)]')}>{inv.project}</span></td>
                        <td className="px-3 py-3 text-right hidden sm:table-cell"><span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{formatINR(inv.gst)}</span></td>
                        <td className="px-3 py-3 text-right"><span className="text-sm font-semibold">{formatINR(inv.amount)}</span><span className={cn('text-[10px] block', 'text-[var(--app-text-muted)]')}>+ {formatINR(inv.gst)} GST</span></td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span></td>
                        <td className="px-3 py-3 text-right hidden lg:table-cell">
                          {inv.status === 'partial' ? (
                            <div className="space-y-1">
                              <span className="text-xs font-medium">{formatINR(inv.paidAmount)}</span>
                              <div className={cn('h-1 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                                <div className="h-full rounded-full bg-amber-500" style={{ width: `${paidPct}%` }} />
                              </div>
                              <span className={cn('text-[9px] block', 'text-[var(--app-text-muted)]')}>{paidPct}% paid</span>
                            </div>
                          ) : (
                            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{inv.paidAmount > 0 ? formatINR(inv.paidAmount) : '—'}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {inv.status === 'overdue' ? (
                            <motion.span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', statusConf.className)} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                              {statusConf.label}
                            </motion.span>
                          ) : (
                            <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', statusConf.className)}>
                              {statusConf.label}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {inv.paymentLink && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                                      <ExternalLink className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Payment Link</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                                    <FileDown className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent><p>PDF Preview</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {inv.status === 'sent' && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                                      <Send className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Resend</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {(inv.status === 'overdue' || inv.status === 'partial') && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                                      <Bell className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Send Reminder</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className={cn('flex items-center justify-between px-4 py-3 border-t', 'border-[var(--app-border-light)]')}>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsLeft className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]') : ('text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]'))}>{pageNum}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default memo(InvoicesPageInner);
