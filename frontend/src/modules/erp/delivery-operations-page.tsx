'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, BarChart3, AlertTriangle, Clock, Timer,
  RotateCcw, MoreHorizontal, Check, X,
} from 'lucide-react';
import { CSS } from '@/styles/design-tokens';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageShell } from './components/ops/page-shell';
import { mockDeliveryItems, mockProjects } from '@/modules/erp/data/mock-data';
import type { DeliveryStatus } from '@/modules/erp/types';

<<<<<<< HEAD
=======
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

>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
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
  const enriched = useMemo(() => {
    return mockDeliveryItems.map(item => {
      const project = mockProjects.find(p => p.id === item.projectId);
      return { ...item, projectName: project?.name || item.projectId };
    });
  }, []);

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const stats = useMemo(() => ({
    today: enriched.filter(d => d.status === 'in-progress' || d.status === 'review').length,
    blocked: enriched.filter(d => d.status === 'revision').length,
    pendingApproval: enriched.filter(d => d.status === 'client-review').length,
    sla: Math.round(enriched.filter(d => d.clientApproval).length / Math.max(enriched.length, 1) * 100),
    avgTime: '6.2d',
    revisions: enriched.reduce((s, d) => s + d.revisionRounds, 0),
  }), [enriched]);

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'deliverable', label: 'Deliverable', sortable: true,
      render: (row) => {
        const isBlocked = row.status === 'revision';
        return (
          <div className="flex items-center gap-2">
            {isBlocked && (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0" />
              </motion.div>
            )}
            <span className={`text-sm font-medium truncate ${isBlocked ? 'text-red-500 dark:text-red-400' : ''}`}>
              {String(row.deliverable)}
            </span>
          </div>
        );
      },
    },
    { key: 'projectName', label: 'Project', sortable: true, visible: false, render: (row) => <span className="text-xs truncate max-w-[180px] block" style={{ color: CSS.textSecondary }}>{String(row.projectName)}</span> },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, visible: false, render: (row) => <span className="text-xs" style={{ color: CSS.textSecondary }}>{String(row.assignedTo)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={getStatusLabel(row.status as DeliveryStatus)} variant="pill" /> },
    {
      key: 'dueDate', label: 'Due Date', sortable: true,
      render: (row) => {
        const overdue = isOverdue(String(row.dueDate)) && row.status !== 'delivered' && row.status !== 'approved';
        return (
          <span>
            <span className={`text-xs font-medium ${overdue ? 'text-amber-500 dark:text-amber-400' : ''}`} style={!overdue ? { color: CSS.textSecondary } : undefined}>
              {new Date(String(row.dueDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            {overdue && <span className="text-[9px] text-amber-500 block">OVERDUE</span>}
          </span>
        );
      },
    },
    {
      key: 'clientApproval', label: 'Client',
      render: (row) => row.clientApproval ? (
        <div className="flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Yes</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <X className="w-3.5 h-3.5" style={{ color: CSS.textDisabled }} />
          <span className="text-[10px]" style={{ color: CSS.textMuted }}>No</span>
        </div>
      ),
    },
    {
      key: 'revisionRounds', label: 'Revisions', sortable: true, visible: false,
      render: (row) => {
        const rounds = Number(row.revisionRounds);
        return <span className={`text-xs font-medium ${rounds > 0 ? 'text-orange-400' : ''}`}>{rounds}</span>;
      },
    },
  ], []);

  return (
<<<<<<< HEAD
    <PageShell title="Delivery Operations" icon={Truck} subtitle={todayStr}>
=======
    <PageShell title="Delivery Operations" icon={Truck} subtitle={todayStr} headerRight={
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
        <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
        <input type="text" placeholder="Search deliveries..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
      </div>
    }>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041

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
<<<<<<< HEAD
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="rounded-2xl border p-3" style={{ backgroundColor: CSS.cardBg, borderColor: CSS.borderLight, boxShadow: CSS.shadowCard }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>{stat.label}</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.warn ? 'rgba(239,68,68,0.1)' : CSS.hoverBg }}>
                  <stat.icon className={`w-3 h-3 ${stat.warn ? 'text-red-500 dark:text-red-400' : ''}`} style={!stat.warn ? { color: CSS.textDisabled } : undefined} />
=======
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-6 h-6 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.warn ? ('bg-[var(--app-danger-bg)]') : ('bg-[var(--app-hover-bg)]'))}>
                  <stat.icon className={cn('w-4 h-4', stat.warn ? 'text-red-500 dark:text-red-400' : ('text-[var(--app-text-muted)]'))} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                </div>
              </div>
              <p className={`text-lg font-bold ${stat.warn ? 'text-red-500 dark:text-red-400' : ''}`} style={!stat.warn ? { color: CSS.text } : undefined}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
<<<<<<< HEAD
        <SmartDataTable
          data={enriched as unknown as Record<string, unknown>[]}
          columns={columns}
          searchable
          searchPlaceholder="Search deliveries..."
          enableExport
          emptyMessage="No deliveries found"
          pageSize={8}
        />
=======
        <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
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
                        <div className={cn('w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><Truck className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} /></div>
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
                                <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
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
                              <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                              <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <X className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
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
                              <button onClick={(e) => e.stopPropagation()} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'hover:bg-[var(--app-hover-bg)]')}><MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></button>
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
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
    </PageShell>
  );
}

export default memo(DeliveryOperationsPageInner);
