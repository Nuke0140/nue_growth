'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Monitor, Laptop, Smartphone, Server, Printer, Shield, AlertTriangle,
  Wrench, Archive, MoreHorizontal, FileWarning, IndianRupee
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockAssets } from '@/modules/erp/data/mock-data';
import type { AssetStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'in-repair' | 'disposed';

const ITEMS_PER_PAGE = 8;

function getStatusConfig(status: AssetStatus, isDark: boolean) {
  switch (status) {
    case 'active': return isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'in-repair': return isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
    case 'disposed': return isDark ? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20' : 'bg-zinc-50 text-zinc-700 border-zinc-200';
    case 'retired': return isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200';
    default: return isDark ? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20' : 'bg-zinc-50 text-zinc-700 border-zinc-200';
  }
}

function getStatusLabel(status: AssetStatus) {
  const map: Record<AssetStatus, string> = { active: 'Active', 'in-repair': 'In Repair', disposed: 'Disposed', retired: 'Retired' };
  return map[status] || status;
}

function getTypeIcon(type: string) {
  const map: Record<string, React.ElementType> = {
    'Laptop': Laptop, 'Mobile': Smartphone, 'Monitor': Monitor,
    'Server': Server, 'Printer': Printer, 'AV Equipment': Monitor,
    'Tablet': Smartphone,
  };
  return map[type] || Monitor;
}

function getTypeBadgeColor(type: string, isDark: boolean) {
  const colors: Record<string, string> = {
    'Laptop': isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200',
    'Mobile': isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Monitor': isDark ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200',
    'Server': isDark ? 'bg-orange-500/15 text-orange-300 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
    'Printer': isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200',
    'AV Equipment': isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
    'Tablet': isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200',
  };
  return colors[type] || (isDark ? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20' : 'bg-zinc-50 text-zinc-700 border-zinc-200');
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  return (
    <PageShell title="Asset Management" icon={Monitor} headerRight={
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
          <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
          <input type="text" placeholder="Search assets..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                <Plus className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Add Asset</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    }>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button key={filter.key} onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', isActive ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'))}>
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'))}>{filter.count}</span>
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
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}><stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} /></div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn('border-b hover:bg-transparent', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
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
                        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}><Monitor className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} /></div>
                        <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>No assets found</p>
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
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                              <TypeIcon className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
                            </div>
                            <span className="text-sm font-medium">{asset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', getTypeBadgeColor(asset.type, isDark))}>{asset.type}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <code className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{asset.serialNo}</code>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>{asset.assignedTo}</span>
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
                              <FileWarning className={cn('w-3.5 h-3.5', unresolvedIssues > 0 ? 'text-red-500 dark:text-red-400' : (isDark ? 'text-white/30' : 'text-black/30'))} />
                              <span className={cn('text-xs', unresolvedIssues > 0 ? 'text-red-500 dark:text-red-400 font-medium' : (isDark ? 'text-white/50' : 'text-black/50'))}>{asset.issueLogs.length}</span>
                            </div>
                          ) : (
                            <span className={cn('text-xs', isDark ? 'text-white/25' : 'text-black/25')}>—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} /></button>
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
            <div className={cn('flex items-center justify-between px-4 py-3 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
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
    </PageShell>
  );
}

export default memo(AssetManagementPageInner);
