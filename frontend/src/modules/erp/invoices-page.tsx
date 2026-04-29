'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, FileText, DollarSign, AlertTriangle, Wallet, Receipt,
  Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ExternalLink, Repeat, Send, Bell, FileDown, ArrowUpDown,
  ArrowUp, ArrowDown, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockInvoices } from '@/modules/erp/data/mock-data';
import type { InvoiceStatus, SortDir } from '@/modules/erp/types';

type FilterKey = 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
type SortField = 'invoiceNo' | 'client' | 'amount' | 'dueDate' | 'status';

const ITEMS_PER_PAGE = 8;

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

function getStatusConfig(status: InvoiceStatus, isDark: boolean) {
  const configs: Record<InvoiceStatus, { label: string; className: string; animate: boolean }> = {
    draft: { label: 'Draft', className: isDark ? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' : 'bg-zinc-50 text-zinc-600 border-zinc-200', animate: false },
    sent: { label: 'Sent', className: isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200', animate: false },
    paid: { label: 'Paid', className: isDark ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200', animate: false },
    overdue: { label: 'Overdue', className: isDark ? 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200', animate: true },
    partial: { label: 'Partial', className: isDark ? 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200', animate: false },
  };
  return configs[status];
}

function InvoicesPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockInvoices];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(inv =>
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q) ||
        inv.project.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'draft': result = result.filter(i => i.status === 'draft'); break;
      case 'sent': result = result.filter(i => i.status === 'sent'); break;
      case 'paid': result = result.filter(i => i.status === 'paid'); break;
      case 'overdue': result = result.filter(i => i.status === 'overdue'); break;
      case 'partial': result = result.filter(i => i.status === 'partial'); break;
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'invoiceNo': cmp = a.invoiceNo.localeCompare(b.invoiceNo); break;
        case 'client': cmp = a.client.localeCompare(b.client); break;
        case 'amount': cmp = a.amount - b.amount; break;
        case 'dueDate': cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [searchQuery, activeFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockInvoices.length },
    { key: 'draft', label: 'Draft', count: mockInvoices.filter(i => i.status === 'draft').length },
    { key: 'sent', label: 'Sent', count: mockInvoices.filter(i => i.status === 'sent').length },
    { key: 'paid', label: 'Paid', count: mockInvoices.filter(i => i.status === 'paid').length },
    { key: 'overdue', label: 'Overdue', count: mockInvoices.filter(i => i.status === 'overdue').length },
    { key: 'partial', label: 'Partial', count: mockInvoices.filter(i => i.status === 'partial').length },
  ];

  return (
    <PageShell title="Invoices" icon={Receipt}>
      <div className="space-y-6">
        {/* Search + Actions */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className={cn('h-9 w-9 rounded-xl shrink-0', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Create Invoice</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button key={f.key} onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', isActive ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'))}>
                <span className="hidden sm:inline">{f.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'))}>{f.count}</span>
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
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
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
                        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                          <FileText className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
                        </div>
                        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-black/40')}>No invoices found</p>
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
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                              <FileText className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
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
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{inv.client}</span></td>
                        <td className="px-3 py-3 hidden lg:table-cell"><span className={cn('text-xs truncate block max-w-[180px]', isDark ? 'text-white/40' : 'text-black/40')}>{inv.project}</span></td>
                        <td className="px-3 py-3 text-right hidden sm:table-cell"><span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{formatINR(inv.gst)}</span></td>
                        <td className="px-3 py-3 text-right"><span className="text-sm font-semibold">{formatINR(inv.amount)}</span><span className={cn('text-[10px] block', isDark ? 'text-white/25' : 'text-black/25')}>+ {formatINR(inv.gst)} GST</span></td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{new Date(inv.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span></td>
                        <td className="px-3 py-3 text-right hidden lg:table-cell">
                          {inv.status === 'partial' ? (
                            <div className="space-y-1">
                              <span className="text-xs font-medium">{formatINR(inv.paidAmount)}</span>
                              <div className={cn('h-1 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                                <div className="h-full rounded-full bg-amber-500" style={{ width: `${paidPct}%` }} />
                              </div>
                              <span className={cn('text-[9px] block', isDark ? 'text-white/25' : 'text-black/25')}>{paidPct}% paid</span>
                            </div>
                          ) : (
                            <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{inv.paidAmount > 0 ? formatINR(inv.paidAmount) : '—'}</span>
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
                                    <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                      <ExternalLink className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Payment Link</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                    <FileDown className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent><p>PDF Preview</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {inv.status === 'sent' && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                      <Send className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
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
                                    <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                      <Bell className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
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
            <div className={cn('flex items-center justify-between px-4 py-3 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsLeft className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]'))}>{pageNum}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default memo(InvoicesPageInner);
