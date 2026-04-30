'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Calendar, Clock, CheckCircle2, AlertTriangle, X, Check,
  RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  MoreHorizontal, Truck, BarChart3, ArrowRight, UserCheck, Timer,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockDeliveryItems, mockProjects } from '@/modules/erp/data/mock-data';
import type { DeliveryStatus } from '@/modules/erp/types';

const ITEMS_PER_PAGE = 8;

function getStatusConfig(status: DeliveryStatus, isDark: boolean) {
  switch (status) {
    case 'pending': return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
    case 'in-progress': return isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200';
    case 'review': return 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30';
    case 'client-review': return isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
    case 'approved': return 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30';
    case 'revision': return 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30';
    case 'delivered': return 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30';
    default: return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
  }
}

function getStatusLabel(status: DeliveryStatus) {
  const map: Record<DeliveryStatus, string> = {
    'pending': 'Pending', 'in-progress': 'In Progress', 'review': 'Review',
    'client-review': 'Client Review', 'approved': 'Approved', 'revision': 'Revision', 'delivered': 'Delivered'
  };
  return map[status] || status;
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

function DeliveryOperationsPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const enriched = useMemo(() => {
    return mockDeliveryItems.map(item => {
      const project = mockProjects.find(p => p.id === item.projectId);
      return { ...item, projectName: project?.name || item.projectId };
    });
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return enriched;
    const q = searchQuery.toLowerCase();
    return enriched.filter(d =>
      d.deliverable.toLowerCase().includes(q) ||
      d.projectName.toLowerCase().includes(q) ||
      d.assignedTo.toLowerCase().includes(q) ||
      getStatusLabel(d.status).toLowerCase().includes(q)
    );
  }, [searchQuery, enriched]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const stats = useMemo(() => ({
    today: enriched.filter(d => d.status === 'in-progress' || d.status === 'review').length,
    blocked: enriched.filter(d => d.status === 'revision').length,
    pendingApproval: enriched.filter(d => d.status === 'client-review').length,
    sla: Math.round(enriched.filter(d => d.clientApproval).length / Math.max(enriched.length, 1) * 100),
    avgTime: '6.2d',
    revisions: enriched.reduce((s, d) => s + d.revisionRounds, 0),
  }), [enriched]);

  return (
    <PageShell title="Delivery Operations" icon={Truck} subtitle={todayStr} headerRight={
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
        <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
        <input type="text" placeholder="Search deliveries..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
      </div>
    }>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label: "Today's Deliveries", value: stats.today, icon: Truck },
            { label: 'Blocked', value: stats.blocked, icon: AlertTriangle, warn: stats.blocked > 0 },
            { label: 'Pending Approval', value: stats.pendingApproval, icon: Clock },
            { label: 'SLA %', value: `${stats.sla}%`, icon: BarChart3 },
            { label: 'Avg Delivery Time', value: stats.avgTime, icon: Timer },
            { label: 'Revision Rounds', value: stats.revisions, icon: RotateCcw },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', stat.warn ? ('bg-[var(--app-danger-bg)]') : ('bg-[var(--app-hover-bg)]'))}>
                  <stat.icon className={cn('w-3 h-3', stat.warn ? 'text-red-500 dark:text-red-400' : ('text-[var(--app-text-muted)]'))} />
                </div>
              </div>
              <p className={cn('text-lg font-bold', stat.warn && 'text-red-500 dark:text-red-400')}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn('border-b hover:bg-transparent', 'border-[var(--app-border-light)]')}>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Deliverable</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider">Project</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider">Assigned To</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Due Date</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Client</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-semibold uppercase tracking-wider">Revisions</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><Truck className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} /></div>
                        <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>No deliveries found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((item, idx) => {
                    const overdue = isOverdue(item.dueDate) && item.status !== 'delivered' && item.status !== 'approved';
                    const isBlocked = item.status === 'revision';
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn(
                          'border-b transition-colors duration-150 last:border-0',
                          isDark ? 'border-white/[0.03] hover:bg-white/[0.04]' : 'border-black/[0.03] hover:bg-black/[0.02]',
                          isBlocked && (isDark ? 'bg-red-500/[0.04]' : 'bg-red-50/50'),
                          overdue && !isBlocked && (isDark ? 'bg-amber-500/[0.04]' : 'bg-amber-50/50')
                        )}
                      >
                        <TableCell className="px-3">
                          <div className="flex items-center gap-2">
                            {isBlocked && (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
                              </motion.div>
                            )}
                            <span className={cn('text-sm font-medium truncate', isBlocked && 'text-red-500 dark:text-red-400')}>{item.deliverable}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn('text-xs truncate max-w-[180px] block', 'text-[var(--app-text-secondary)]')}>{item.projectName}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{item.assignedTo}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', getStatusConfig(item.status, isDark))}>
                            {getStatusLabel(item.status)}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={cn('text-xs font-medium', overdue ? 'text-amber-500 dark:text-amber-400' : ('text-[var(--app-text-secondary)]'))}>
                            {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          {overdue && <span className="text-[9px] text-amber-500 block">OVERDUE</span>}
                        </TableCell>
                        <TableCell className="px-3">
                          {item.clientApproval ? (
                            <div className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                              <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <X className={cn('w-3.5 h-3.5', 'text-[var(--app-text-disabled)]')} />
                              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>No</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn('text-xs font-medium', item.revisionRounds > 0 ? 'text-orange-400' : ('text-[var(--app-text-muted)]'))}>
                            {item.revisionRounds}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'hover:bg-[var(--app-hover-bg)]')}><MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuItem>Escalate</DropdownMenuItem>
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
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsLeft className="w-4 h-4" /></button>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]') : ('text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]'))}>{pageNum}</button>
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

export default memo(DeliveryOperationsPageInner);
