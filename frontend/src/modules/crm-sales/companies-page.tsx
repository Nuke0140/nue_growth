'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, LayoutGrid, List, ArrowUpDown, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown,
  Building2, DollarSign, TrendingUp, Users, Filter, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockCompanies } from '@/modules/crm-sales/data/mock-data';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import CompanyCard from './components/company-card';
import type { Company } from '@/modules/crm-sales/types';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'arr' | 'healthScore' | 'linkedContacts' | 'activeDeals';
type SortDir = 'asc' | 'desc';

function formatARR(arr: number): string {
  if (arr >= 1_000_000) return `$${(arr / 1_000_000).toFixed(1)}M`;
  if (arr >= 1_000) return `$${(arr / 1_000).toFixed(0)}K`;
  return `$${arr}`;
}

function getHealthColor(score: number) {
  if (score > 75) return 'text-emerald-400';
  if (score > 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getHealthBarColor(score: number) {
  if (score > 75) return 'bg-emerald-500';
  if (score > 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

const ITEMS_PER_PAGE = 9;

export default function CompaniesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectCompany = useCrmSalesStore((s) => s.selectCompany);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Industries from data
  const industries = useMemo(() => {
    const set = new Set(mockCompanies.map(c => c.industry));
    return Array.from(set).sort();
  }, []);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...mockCompanies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.website || '').toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q)
      );
    }

    if (industryFilter !== 'all') {
      result = result.filter(c => c.industry === industryFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'arr': cmp = a.arr - b.arr; break;
        case 'healthScore': cmp = a.healthScore - b.healthScore; break;
        case 'linkedContacts': cmp = a.linkedContacts - b.linkedContacts; break;
        case 'activeDeals': cmp = a.activeDeals - b.activeDeals; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [searchQuery, industryFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => ({
    total: mockCompanies.length,
    totalARR: mockCompanies.reduce((sum, c) => sum + c.arr, 0),
    avgHealth: Math.round(mockCompanies.reduce((sum, c) => sum + c.healthScore, 0) / mockCompanies.length),
    activeDeals: mockCompanies.reduce((sum, c) => sum + c.activeDeals, 0),
  }), []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Companies</h1>
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-56 transition-colors',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
            </div>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={(v) => { setIndustryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className={cn(
                'w-[140px] h-9 text-xs rounded-xl border',
                isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/60' : 'bg-white border-black/[0.06] text-black/60'
              )}>
                <Filter className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className={cn(
              'flex items-center rounded-xl border p-0.5',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  viewMode === 'grid'
                    ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black'
                    : isDark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  viewMode === 'table'
                    ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black'
                    : isDark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Company */}
            <Button
              size="icon"
              className={cn(
                'h-9 w-9 rounded-xl shrink-0',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Companies', value: stats.total, icon: Building2, format: false },
            { label: 'Total ARR', value: stats.totalARR, icon: DollarSign, format: true },
            { label: 'Avg Health', value: `${stats.avgHealth}%`, icon: TrendingUp, format: false },
            { label: 'Active Deals', value: stats.activeDeals, icon: Users, format: false },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                  {stat.label}
                </span>
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center',
                  'bg-[var(--app-hover-bg)]'
                )}>
                  <stat.icon className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                </div>
              </div>
              <p className="text-xl font-bold">
                {stat.format ? formatARR(stat.value as number) : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.length === 0 ? (
              <div className="col-span-full flex flex-col items-center py-16">
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-3',
                  'bg-[var(--app-hover-bg)]'
                )}>
                  <Building2 className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                </div>
                <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                  No companies found
                </p>
                <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              paginated.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CompanyCard company={company} />
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className={cn(
            'rounded-2xl border overflow-hidden',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={cn(
                    'border-b hover:bg-transparent',
                    'border-[var(--app-border-light)]'
                  )}>
                    <TableHead className="w-[40px]">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        Company {renderSortIcon('name')}
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Industry</TableHead>
                    <TableHead className="hidden md:table-cell">
                      <button onClick={() => handleSort('arr')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        ARR {renderSortIcon('arr')}
                      </button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <button onClick={() => handleSort('linkedContacts')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        Contacts {renderSortIcon('linkedContacts')}
                      </button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <button onClick={() => handleSort('activeDeals')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        Deals {renderSortIcon('activeDeals')}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => handleSort('healthScore')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                        Health {renderSortIcon('healthScore')}
                      </button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead className="w-[40px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center',
                            'bg-[var(--app-hover-bg)]'
                          )}>
                            <Building2 className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                          </div>
                          <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                            No companies found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((company, idx) => {
                      const initials = company.name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();

                      return (
                        <motion.tr
                          key={company.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => selectCompany(company.id)}
                          className={cn(
                            'border-b cursor-pointer transition-colors duration-150 last:border-0',
                            isDark
                              ? 'border-white/[0.03] hover:bg-white/[0.04]'
                              : 'border-black/[0.03] hover:bg-black/[0.02]'
                          )}
                        >
                          <TableCell className="px-3">
                            <input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} />
                          </TableCell>
                          <TableCell className="px-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={company.logo} alt={company.name} />
                                <AvatarFallback className={cn(
                                  'text-xs font-bold',
                                  isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.08] text-black/70'
                                )}>
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{company.name}</p>
                                <p className={cn('text-xs truncate', 'text-[var(--app-text-muted)]')}>
                                  {company.website}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell px-3">
                            <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
                              {company.industry}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell px-3">
                            <span className="text-sm font-semibold">{formatARR(company.arr)}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell px-3">
                            <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
                              {company.linkedContacts}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell px-3">
                            <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
                              {company.activeDeals}
                            </span>
                          </TableCell>
                          <TableCell className="px-3">
                            <div className="flex items-center gap-2 min-w-[80px]">
                              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                                <div
                                  className={cn('h-full rounded-full transition-all', getHealthBarColor(company.healthScore))}
                                  style={{ width: `${company.healthScore}%` }}
                                />
                              </div>
                              <span className={cn('text-[11px] font-medium w-7 text-right', getHealthColor(company.healthScore))}>
                                {company.healthScore}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell px-3">
                            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                              {company.owner}
                            </span>
                          </TableCell>
                          <TableCell className="px-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className={cn(
                                    'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                                    'hover:bg-[var(--app-hover-bg)]'
                                  )}
                                >
                                  <MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit Company</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
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
              <div className={cn(
                'flex items-center justify-between px-4 py-3 border-t',
                'border-[var(--app-border-light)]'
              )}>
                <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors',
                          currentPage === pageNum
                            ? isDark
                              ? 'bg-white text-black'
                              : 'bg-black text-white'
                            : isDark
                              ? 'text-white/50 hover:bg-white/[0.06]'
                              : 'text-black/50 hover:bg-black/[0.06]'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination for Grid */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                  'hover:bg-[var(--app-hover-bg)]'
                )}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                  'hover:bg-[var(--app-hover-bg)]'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors',
                      currentPage === pageNum
                        ? isDark
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                        : isDark
                          ? 'text-white/50 hover:bg-white/[0.06]'
                          : 'text-black/50 hover:bg-black/[0.06]'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                  'hover:bg-[var(--app-hover-bg)]'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                  'hover:bg-[var(--app-hover-bg)]'
                )}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
