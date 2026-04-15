'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, Users, UserCheck, UserX, Clock, AlertTriangle,
  MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  UserCircle, ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { EmployeeStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'on-leave' | 'probation' | 'notice-period';

const statusConfig: Record<EmployeeStatus, { label: string; className: string; dotClass: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  'on-leave': {
    label: 'On Leave',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  'notice-period': {
    label: 'Notice Period',
    className: 'bg-red-500/15 text-red-400 border-red-500/20',
    dotClass: 'bg-red-500',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
    dotClass: 'bg-zinc-500',
  },
  probation: {
    label: 'Probation',
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
};

function getBarColor(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

function getBarTextColor(score: number) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

const ITEMS_PER_PAGE = 8;

export default function EmployeesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectEmployee = useErpStore((s) => s.selectEmployee);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockEmployees];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'active': result = result.filter(e => e.status === 'active'); break;
      case 'on-leave': result = result.filter(e => e.status === 'on-leave'); break;
      case 'probation': result = result.filter(e => e.status === 'probation'); break;
      case 'notice-period': result = result.filter(e => e.status === 'notice-period'); break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: mockEmployees.length,
    active: mockEmployees.filter(e => e.status === 'active').length,
    onLeave: mockEmployees.filter(e => e.status === 'on-leave').length,
    avgProductivity: Math.round(mockEmployees.reduce((s, e) => s + e.productivityScore, 0) / mockEmployees.length),
  }), []);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Users, count: stats.total },
    { key: 'active', label: 'Active', icon: UserCheck, count: stats.active },
    { key: 'on-leave', label: 'On Leave', icon: Clock, count: stats.onLeave },
    { key: 'probation', label: 'Probation', icon: UserCircle, count: mockEmployees.filter(e => e.status === 'probation').length },
    { key: 'notice-period', label: 'Notice Period', icon: AlertTriangle, count: mockEmployees.filter(e => e.status === 'notice-period').length },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Employees</h1>
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(
                      'h-9 w-9 rounded-xl shrink-0',
                      isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Invite Employee</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit overflow-x-auto" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? isDark
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'bg-black/[0.06] text-black shadow-sm'
                    : isDark
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-black/40 hover:text-black/70'
                )}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold',
                  isActive
                    ? isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]'
                    : isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                )}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Employees', value: stats.total, icon: Users },
            { label: 'Active', value: stats.active, icon: UserCheck },
            { label: 'On Leave', value: stats.onLeave, icon: Clock },
            { label: 'Avg Productivity', value: `${stats.avgProductivity}%`, icon: ArrowUpDown },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                  {stat.label}
                </span>
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center',
                  isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
                )}>
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn(
          'rounded-2xl border overflow-hidden',
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">
                    Manager
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden xl:table-cell">
                    Salary Band
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">
                    Projects
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                    Productivity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="w-[40px]" />
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center',
                          isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
                        )}>
                          <Users className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
                        </div>
                        <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                          No employees found
                        </p>
                        <p className={cn('text-xs', isDark ? 'text-white/25' : 'text-black/25')}>
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((emp, idx) => {
                    const status = statusConfig[emp.status];
                    return (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => selectEmployee(emp.id)}
                        className={cn(
                          'border-b cursor-pointer transition-colors duration-150 last:border-0',
                          isDark
                            ? 'border-white/[0.03] hover:bg-white/[0.04]'
                            : 'border-black/[0.03] hover:bg-black/[0.02]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className={cn(
                                'text-xs font-semibold',
                                isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.08] text-black/70'
                              )}>
                                {emp.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{emp.name}</p>
                              <p className={cn('text-xs truncate', isDark ? 'text-white/40' : 'text-black/40')}>
                                {emp.designation}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3">
                          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>
                            {emp.department}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-4 py-3">
                          <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
                            {emp.manager}
                          </span>
                        </td>
                        <td className="hidden xl:table-cell px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[11px] font-medium border',
                            isDark ? 'bg-white/[0.04] text-white/50 border-white/[0.06]' : 'bg-black/[0.04] text-black/50 border-black/[0.06]'
                          )}>
                            {emp.salaryBand}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3">
                          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>
                            {emp.activeProjects}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                              <div
                                className={cn('h-full rounded-full transition-all', getBarColor(emp.productivityScore))}
                                style={{ width: `${emp.productivityScore}%` }}
                              />
                            </div>
                            <span className={cn('text-[11px] font-medium w-7 text-right', getBarTextColor(emp.productivityScore))}>
                              {emp.productivityScore}
                            </span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border',
                            status.className
                          )}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                                  isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
                                )}
                              >
                                <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Assign Project</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <div className={cn(
              'flex items-center justify-between px-4 py-3 border-t',
              isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
            )}>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors',
                        currentPage === pageNum
                          ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                          : isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
