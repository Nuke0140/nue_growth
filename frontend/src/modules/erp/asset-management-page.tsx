'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor, Laptop, Smartphone, Server, Printer, Shield, AlertTriangle,
  Wrench, Archive, MoreHorizontal, FileWarning, IndianRupee, Plus,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CSS } from '@/styles/design-tokens';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageShell } from './components/ops/page-shell';
import { mockAssets } from '@/modules/erp/data/mock-data';
import type { AssetStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'in-repair' | 'disposed';

function getTypeBadgeColor(type: string, isDark: boolean) {
  const colors: Record<string, string> = {
    'Laptop': isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200',
    'Mobile': 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30',
    'Monitor': isDark ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200',
    'Server': 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30',
    'Printer': isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200',
    'AV Equipment': 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30',
    'Tablet': isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return colors[type] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]');
}

function getWarrantyStatus(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: 'Expired', color: 'text-red-500 dark:text-red-400' };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, color: 'text-amber-500 dark:text-amber-400' };
  return { label: `${daysLeft}d left`, color: 'text-emerald-500 dark:text-emerald-400' };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function AssetManagementPageInner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let result = [...mockAssets];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.serialNo.toLowerCase().includes(q) ||
        a.assignedTo.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'active': result = result.filter(a => a.status === 'active'); break;
      case 'in-repair': result = result.filter(a => a.status === 'in-repair' || a.status === 'retired'); break;
      case 'disposed': result = result.filter(a => a.status === 'disposed' || a.status === 'retired'); break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    total: mockAssets.length,
    active: mockAssets.filter(a => a.status === 'active').length,
    inRepair: mockAssets.filter(a => a.status === 'in-repair').length,
    totalValue: mockAssets.reduce((s, a) => s + a.purchaseCost, 0),
  }), []);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Monitor, count: stats.total },
    { key: 'active', label: 'Active', icon: Shield, count: stats.active },
    { key: 'in-repair', label: 'In Repair', icon: Wrench, count: stats.inRepair },
    { key: 'disposed', label: 'Disposed', icon: Archive, count: mockAssets.filter(a => a.status === 'disposed' || a.status === 'retired').length },
  ];

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name', label: 'Asset Name', sortable: true,
      render: (row) => {
        const TypeIcon = getTypeIcon(String(row.type));
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <TypeIcon className="w-4 h-4" style={{ color: CSS.textSecondary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: CSS.text }}>{String(row.name)}</span>
          </div>
        );
      },
    },
    { key: 'type', label: 'Type', sortable: true, render: (row) => <StatusBadge status={String(row.type)} variant="dot" /> },
    { key: 'serialNo', label: 'Serial No', sortable: true, visible: false, render: (row) => <code className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.serialNo)}</code> },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, visible: false, render: (row) => <span className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.assignedTo)}</span> },
    {
      key: 'warrantyEnd', label: 'Warranty', sortable: true,
      render: (row) => {
        const warranty = getWarrantyStatus(String(row.warrantyEnd));
        return <span className={`text-xs font-medium ${warranty.color}`}>{warranty.label}</span>;
      },
    },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={getStatusLabel(row.status as AssetStatus)} variant="pill" /> },
    { key: 'purchaseCost', label: 'Cost (₹)', sortable: true, visible: false, render: (row) => <span className="text-xs font-medium" style={{ color: CSS.text }}>{formatCurrency(Number(row.purchaseCost))}</span> },
    {
      key: 'issues', label: 'Issues', visible: false,
      render: (row) => {
        const issueLogs = row.issueLogs as Array<{ resolved: boolean }> | undefined;
        const count = issueLogs?.length ?? 0;
        const unresolved = issueLogs?.filter(i => !i.resolved).length ?? 0;
        if (count === 0) return <span className="text-xs" style={{ color: CSS.textMuted }}>—</span>;
        return (
          <div className="flex items-center gap-1">
            <FileWarning className={`w-3.5 h-3.5 ${unresolved > 0 ? 'text-red-500 dark:text-red-400' : ''}`} style={unresolved === 0 ? { color: CSS.textDisabled } : undefined} />
            <span className={`text-xs ${unresolved > 0 ? 'text-red-500 dark:text-red-400 font-medium' : ''}`} style={unresolved === 0 ? { color: CSS.textSecondary } : undefined}>{count}</span>
          </div>
        );
      },
    },
  ], []);

  return (
    <PageShell title="Asset Management" icon={Monitor} headerRight={
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
          <input type="text" placeholder="Search assets..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn('h-10  w-9 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Add Asset</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    }>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit" style={{ background: 'var(--app-hover-bg)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button key={filter.key} onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors duration-200', isActive ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]') : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'))}>
                <filter.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? ('bg-[var(--app-hover-bg)]') : ('bg-[var(--app-hover-bg)]'))}>{filter.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Assets', value: stats.total, icon: Monitor },
            { label: 'Active', value: stats.active, icon: Shield },
            { label: 'In Repair', value: stats.inRepair, icon: AlertTriangle },
            { label: 'Total Value', value: formatCurrency(stats.totalValue), icon: IndianRupee },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><stat.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></div>
              </div>
              <p className="text-xl font-bold" style={{ color: CSS.text }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn('border-b hover:bg-transparent', 'border-[var(--app-border-light)]')}>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Asset Name</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Type</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider">Serial No</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider">Assigned To</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Warranty</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider">Cost (₹)</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider">Issues</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn('w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><Monitor className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} /></div>
                        <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>No assets found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((asset, idx) => {
                    const warranty = getWarrantyStatus(asset.warrantyEnd);
                    const TypeIcon = getTypeIcon(asset.type);
                    const unresolvedIssues = asset.issueLogs.filter(i => !i.resolved).length;
                    return (
                      <motion.tr key={asset.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className={cn('border-b cursor-pointer transition-colors duration-150 last:border-0', isDark ? 'border-white/[0.03] hover:bg-white/[0.04]' : 'border-black/[0.03] hover:bg-black/[0.02]')}>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                              <TypeIcon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                            </div>
                            <span className="text-sm font-medium">{asset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', getTypeBadgeColor(asset.type, isDark))}>{asset.type}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <code className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{asset.serialNo}</code>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{asset.assignedTo}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('text-xs font-medium', warranty.color)}>{warranty.label}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', getStatusConfig(asset.status, isDark))}>{getStatusLabel(asset.status)}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className="text-xs font-medium">{formatCurrency(asset.purchaseCost)}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          {asset.issueLogs.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <FileWarning className={cn('w-4 h-4', unresolvedIssues > 0 ? 'text-red-500 dark:text-red-400' : ('text-[var(--app-text-muted)]'))} />
                              <span className={cn('text-xs', unresolvedIssues > 0 ? 'text-red-500 dark:text-red-400 font-medium' : ('text-[var(--app-text-secondary)]'))}>{asset.issueLogs.length}</span>
                            </div>
                          ) : (
                            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'hover:bg-[var(--app-hover-bg)]')}><MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                              <DropdownMenuItem>Log Issue</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">Dispose Asset</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className={cn('flex items-center justify-between px-4 py-3 border-t', 'border-[var(--app-border-light)]')}>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
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
    </PageShell>
  );
}

export default memo(AssetManagementPageInner);
