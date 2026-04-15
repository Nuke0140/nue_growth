'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, FolderKanban, Wallet, TrendingUp, AlertTriangle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal,
  Repeat, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { ProjectStatus, ProjectHealth, ProjectPriority, SortDir } from '@/modules/erp/types';

type FilterKey = 'all' | 'active' | 'on-hold' | 'completed' | 'at-risk';
type SortField = 'name' | 'budget' | 'progress' | 'profitability' | 'sla' | 'dueDate';

const ITEMS_PER_PAGE = 8;

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

function getHealthConfig(health: ProjectHealth, isDark: boolean) {
  switch (health) {
    case 'excellent': return { label: 'Excellent', className: isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' };
    case 'good': return { label: 'Good', className: isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' };
    case 'at-risk': return { label: 'At Risk', className: isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' };
    case 'critical': return { label: 'Critical', className: isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200', dotColor: 'bg-red-500' };
  }
}

function getPriorityConfig(priority: ProjectPriority, isDark: boolean) {
  switch (priority) {
    case 'low': return { label: 'Low', className: isDark ? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' : 'bg-zinc-50 text-zinc-600 border-zinc-200' };
    case 'medium': return { label: 'Medium', className: isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'high': return { label: 'High', className: isDark ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'critical': return { label: 'Critical', className: isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200' };
  }
}

function getStatusLabel(status: ProjectStatus): string {
  const map: Record<string, string> = { 'active': 'Active', 'on-hold': 'On Hold', 'completed': 'Completed', 'cancelled': 'Cancelled', 'inception': 'Inception' };
  return map[status] || status;
}

function getProgressColor(progress: number) {
  if (progress >= 80) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function getProfitabilityColor(val: number) {
  if (val > 20) return 'text-emerald-400';
  if (val > 10) return 'text-blue-400';
  if (val > 0) return 'text-amber-400';
  return 'text-red-400';
}

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectProject = useErpStore((s) => s.selectProject);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockProjects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.accountManager.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case 'active': result = result.filter(p => p.status === 'active'); break;
      case 'on-hold': result = result.filter(p => p.status === 'on-hold'); break;
      case 'completed': result = result.filter(p => p.status === 'completed'); break;
      case 'at-risk': result = result.filter(p => p.health === 'at-risk' || p.health === 'critical'); break;
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'budget': cmp = a.budget - b.budget; break;
        case 'progress': cmp = a.progress - b.progress; break;
        case 'profitability': cmp = a.profitability - b.profitability; break;
        case 'sla': cmp = a.sla - b.sla; break;
        case 'dueDate': cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [searchQuery, activeFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: mockProjects.length,
    totalBudget: mockProjects.reduce((s, p) => s + p.budget, 0),
    avgProfitability: Math.round(mockProjects.filter(p => p.profitability > 0).reduce((s, p) => s + p.profitability, 0) / mockProjects.filter(p => p.profitability > 0).length * 10) / 10,
    overdue: mockProjects.filter(p => {
      const d = new Date(p.dueDate);
      return d < new Date() && p.status !== 'completed';
    }).length,
  }), []);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockProjects.length },
    { key: 'active', label: 'Active', count: mockProjects.filter(p => p.status === 'active').length },
    { key: 'on-hold', label: 'On Hold', count: mockProjects.filter(p => p.status === 'on-hold').length },
    { key: 'completed', label: 'Completed', count: mockProjects.filter(p => p.status === 'completed').length },
    { key: 'at-risk', label: 'At Risk', count: mockProjects.filter(p => p.health === 'at-risk' || p.health === 'critical').length },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Projects</h1>
            <Badge variant="secondary" className={cn('text-xs font-medium', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className={cn('h-9 w-9 rounded-xl shrink-0', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>New Project</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => { setActiveFilter(f.key); setCurrentPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm'
                    : isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
                )}
              >
                <span className="hidden sm:inline">{f.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'))}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: stats.total, icon: FolderKanban },
            { label: 'Total Budget', value: formatINR(stats.totalBudget), icon: Wallet },
            { label: 'Avg Profitability', value: `${stats.avgProfitability}%`, icon: TrendingUp },
            { label: 'Overdue', value: stats.overdue, icon: AlertTriangle },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
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
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">Project {renderSortIcon('name')}</button>
                  </th>
                  <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Client</span></th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Manager</span></th>
                  <th className="text-right px-3 py-3">
                    <button onClick={() => handleSort('budget')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ml-auto">Budget {renderSortIcon('budget')}</button>
                  </th>
                  <th className="text-right px-3 py-3 hidden sm:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Spent</span></th>
                  <th className="text-left px-3 py-3 hidden md:table-cell w-28">
                    <button onClick={() => handleSort('progress')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">Progress {renderSortIcon('progress')}</button>
                  </th>
                  <th className="text-right px-3 py-3 hidden lg:table-cell">
                    <button onClick={() => handleSort('profitability')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ml-auto">Profit % {renderSortIcon('profitability')}</button>
                  </th>
                  <th className="text-center px-3 py-3 hidden xl:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Health</span></th>
                  <th className="text-right px-3 py-3 hidden lg:table-cell">
                    <button onClick={() => handleSort('sla')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ml-auto">SLA {renderSortIcon('sla')}</button>
                  </th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">
                    <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">Due {renderSortIcon('dueDate')}</button>
                  </th>
                  <th className="text-center px-3 py-3 hidden xl:table-cell"><span className="text-[11px] font-semibold uppercase tracking-wider">Priority</span></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                          <FolderKanban className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
                        </div>
                        <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>No projects found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((project, idx) => {
                    const healthConf = getHealthConfig(project.health, isDark);
                    const priorityConf = getPriorityConfig(project.priority, isDark);
                    return (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => selectProject(project.id)}
                        className={cn(
                          'border-b cursor-pointer transition-colors duration-150 last:border-0',
                          isDark ? 'border-white/[0.03] hover:bg-white/[0.04]' : 'border-black/[0.03] hover:bg-black/[0.02]'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                              <FolderKanban className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium truncate max-w-[200px]">{project.name}</p>
                                {project.isRecurring && (
                                  <Badge className={cn('px-1.5 py-0 text-[9px] font-bold border', isDark ? 'bg-violet-500/15 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200')}>
                                    <Repeat className="w-2.5 h-2.5 mr-0.5" />Repeat
                                  </Badge>
                                )}
                              </div>
                              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{getStatusLabel(project.status)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{project.client}</span></td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] font-semibold bg-sky-500/15 text-sky-400">{project.accountManager.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                            <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{project.accountManager}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right"><span className="text-sm font-semibold">{formatINR(project.budget)}</span></td>
                        <td className="px-3 py-3 text-right hidden sm:table-cell"><span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{formatINR(project.actualSpend)}</span></td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                              <div className={cn('h-full rounded-full', getProgressColor(project.progress))} style={{ width: `${project.progress}%` }} />
                            </div>
                            <span className="text-[11px] font-medium w-8 text-right">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right hidden lg:table-cell"><span className={cn('text-xs font-semibold', getProfitabilityColor(project.profitability))}>{project.profitability > 0 ? '+' : ''}{project.profitability}%</span></td>
                        <td className="px-3 py-3 hidden xl:table-cell text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', healthConf.className)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', healthConf.dotColor)} />
                            {healthConf.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right hidden lg:table-cell"><span className={cn('text-xs font-medium', project.sla >= 90 ? 'text-emerald-400' : project.sla >= 80 ? 'text-amber-400' : 'text-red-400')}>{project.sla}%</span></td>
                        <td className="px-3 py-3 hidden md:table-cell"><span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{new Date(project.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span></td>
                        <td className="px-3 py-3 hidden xl:table-cell text-center">
                          <span className={cn(
                            'inline-flex px-2 py-0.5 rounded text-[10px] font-bold border',
                            priorityConf.className,
                            project.priority === 'critical' && 'animate-pulse'
                          )}>{priorityConf.label}</span>
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
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]'))}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
