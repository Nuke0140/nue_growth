'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  FileCheck, Shield, TrendingUp, Users, AlertTriangle, MoreHorizontal,
  Building2, FolderOpen, Package
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockVendors } from '@/modules/erp/data/mock-data';
import type { VendorStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'on-notice' | 'suspended';

const ITEMS_PER_PAGE = 8;

function getStatusConfig(status: VendorStatus, isDark: boolean) {
  switch (status) {
    case 'active':
      return isDark ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'on-notice':
      return 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30';
    case 'suspended':
      return isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200';
    case 'terminated':
      return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
    default:
      return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
  }
}

function getStatusLabel(status: VendorStatus) {
  const map: Record<VendorStatus, string> = { active: 'Active', 'on-notice': 'On Notice', suspended: 'Suspended', terminated: 'Terminated' };
  return map[status] || status;
}

function getTypeBadgeColor(type: string, isDark: boolean) {
  const colors: Record<string, string> = {
    'Cloud Infrastructure': isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200',
    'UI/UX Design': isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200',
    'Security Audits': 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30',
    'Data Engineering': isDark ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200',
    'Quality Assurance': isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200',
    'Legal Services': 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30',
    'DevOps': isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Recruitment': isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Creative Agency': isDark ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/20' : 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    'Content Delivery': isDark ? 'bg-lime-500/15 text-lime-300 border-lime-500/20' : 'bg-lime-50 text-lime-700 border-lime-200',
    'Code Quality': isDark ? 'bg-rose-500/15 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return colors[type] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]');
}

function getScoreColor(score: number) {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 75) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreTextColor(score: number) {
  if (score >= 90) return 'text-emerald-500 dark:text-emerald-400';
  if (score >= 75) return 'text-yellow-500 dark:text-yellow-400';
  return 'text-red-500 dark:text-red-400';
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

function StarRating({ rating }: { rating: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-3.5 h-3.5',
            star <= Math.round(rating) ? 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400' : ('text-[var(--app-text-disabled)]')
          )}
        />
      ))}
      <span className="text-xs font-medium ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function VendorPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockVendors];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'active': result = result.filter(v => v.status === 'active'); break;
      case 'on-notice': result = result.filter(v => v.status === 'on-notice'); break;
      case 'suspended': result = result.filter(v => v.status === 'suspended'); break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: mockVendors.length,
    activeContracts: mockVendors.filter(v => v.status === 'active').length,
    payoutDue: mockVendors.reduce((sum, v) => sum + v.payoutDue, 0),
    avgSla: (mockVendors.reduce((sum, v) => sum + v.slaScore, 0) / mockVendors.length).toFixed(1),
  }), []);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Users, count: stats.total },
    { key: 'active', label: 'Active', icon: Shield, count: mockVendors.filter(v => v.status === 'active').length },
    { key: 'on-notice', label: 'On Notice', icon: AlertTriangle, count: mockVendors.filter(v => v.status === 'on-notice').length },
    { key: 'suspended', label: 'Suspended', icon: AlertTriangle, count: mockVendors.filter(v => v.status === 'suspended').length },
  ];

  return (
    <PageShell title="Vendors" icon={Package}>
      <div className="space-y-6">
        {/* Search + Actions */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input type="text" placeholder="Search vendors..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                    <Plus className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent><p>Add Vendor</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--app-hover-bg)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button key={filter.key} onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', isActive ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)] shadow-sm') : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'))}>
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? ('bg-[var(--app-hover-bg)]') : ('bg-[var(--app-hover-bg)]'))}>{filter.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Vendors', value: stats.total, icon: Users },
            { label: 'Active Contracts', value: stats.activeContracts, icon: FileCheck },
            { label: 'Payout Due', value: formatCurrency(stats.payoutDue), icon: TrendingUp },
            { label: 'Avg SLA Score', value: `${stats.avgSla}%`, icon: Shield },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4 space-y-3 transition-colors duration-200 hover:border-white/10', isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-gray-50')}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{vendor.name}</h3>
                  <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border mt-1', getTypeBadgeColor(vendor.type, isDark))}>
                    {vendor.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium border', getStatusConfig(vendor.status, isDark))}>
                    {getStatusLabel(vendor.status)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'hover:bg-[var(--app-hover-bg)]')}>
                        <MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Vendor</DropdownMenuItem>
                      <DropdownMenuItem>View Contracts</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Suspend Vendor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Contract Value</span>
                  <p className="text-sm font-semibold mt-0.5">{formatCurrency(vendor.contractValue)}</p>
                </div>
                <div>
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Payout Due</span>
                  <p className={cn('text-sm font-semibold mt-0.5', vendor.payoutDue > 0 ? 'text-amber-500 dark:text-amber-400' : '')}>
                    {formatCurrency(vendor.payoutDue)}
                  </p>
                </div>
              </div>

              {/* SLA Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>SLA Score</span>
                  <span className={cn('text-xs font-semibold', getScoreTextColor(vendor.slaScore))}>{vendor.slaScore}%</span>
                </div>
                <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <div className={cn('h-full rounded-full transition-all', getScoreColor(vendor.slaScore))} style={{ width: `${vendor.slaScore}%` }} />
                </div>
              </div>

              {/* Quality Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>Quality Score</span>
                  <span className={cn('text-xs font-semibold', getScoreTextColor(vendor.qualityScore))}>{vendor.qualityScore}%</span>
                </div>
                <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <div className={cn('h-full rounded-full transition-all', getScoreColor(vendor.qualityScore))} style={{ width: `${vendor.qualityScore}%` }} />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--app-hover-bg)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FolderOpen className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-[11px]', 'text-[var(--app-text-secondary)]')}>{vendor.linkedProjects.length} projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCheck className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-[11px]', 'text-[var(--app-text-secondary)]')}>{vendor.complianceDocs.length} docs</span>
                  </div>
                </div>
                <StarRating rating={vendor.rating} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className={cn('rounded-2xl border py-16 flex flex-col items-center justify-center', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-3', 'bg-[var(--app-hover-bg)]')}>
              <Building2 className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
            </div>
            <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>No vendors found</p>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]') : ('text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]'))}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default memo(VendorPageInner);
