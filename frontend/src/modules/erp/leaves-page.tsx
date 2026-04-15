'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Clock, CheckCircle2, XCircle, AlertTriangle, Calendar,
  ChevronRight, MoreHorizontal, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockLeaveRequests, mockEmployees } from '@/modules/erp/data/mock-data';
import type { LeaveType, LeaveStatus } from '@/modules/erp/types';

type FilterKey = 'all' | LeaveStatus;

const leaveTypeConfig: Record<LeaveType, { label: string; className: string }> = {
  casual: { label: 'Casual', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  sick: { label: 'Sick', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  earned: { label: 'Earned', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  maternity: { label: 'Maternity', className: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
  paternity: { label: 'Paternity', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'comp-off': { label: 'Comp-off', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  'loss-of-pay': { label: 'LOP', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
};

const leaveStatusConfig: Record<LeaveStatus, { label: string; className: string; dotClass: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
  approved: { label: 'Approved', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
  rejected: { label: 'Rejected', className: 'bg-red-500/15 text-red-400 border-red-500/20', dotClass: 'bg-red-500' },
  cancelled: { label: 'Cancelled', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', dotClass: 'bg-zinc-500' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

export default function LeavesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return mockLeaveRequests;
    return mockLeaveRequests.filter(l => l.status === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => ({
    pending: mockLeaveRequests.filter(l => l.status === 'pending').length,
    approvedThisMonth: mockLeaveRequests.filter(l => l.status === 'approved').length,
    balanceRemaining: 47,
    overlaps: 0,
  }), []);

  const balances = useMemo(() => [
    { type: 'Casual Leave', used: 2, total: 12, remaining: 10 },
    { type: 'Sick Leave', used: 1, total: 10, remaining: 9 },
    { type: 'Earned Leave', used: 5, total: 15, remaining: 10 },
    { type: 'Comp-off', used: 1, total: 3, remaining: 2 },
    { type: 'LOP', used: 0, total: 0, remaining: 0 },
    { type: 'Maternity', used: 0, total: 180, remaining: 180 },
  ], []);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockLeaveRequests.length },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approvedThisMonth },
    { key: 'rejected', label: 'Rejected', count: mockLeaveRequests.filter(l => l.status === 'rejected').length },
    { key: 'cancelled', label: 'Cancelled', count: mockLeaveRequests.filter(l => l.status === 'cancelled').length },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Leaves</h1>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn(
                  'h-9 rounded-xl gap-2',
                  isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                )}>
                  <Plus className="w-4 h-4" /> Apply Leave
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Submit a new leave request</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit overflow-x-auto" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm'
                    : isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
                )}
              >
                <span>{filter.label}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold',
                  isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')
                )}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400' },
            { label: 'Approved This Month', value: stats.approvedThisMonth, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Balance Remaining', value: stats.balanceRemaining, icon: Calendar, color: 'text-blue-400' },
            { label: 'Overlaps', value: stats.overlaps, icon: AlertTriangle, color: 'text-red-400' },
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
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Leave Requests List */}
          <div className="flex-1">
            <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                {filtered.map((leave, idx) => {
                  const emp = getEmployee(leave.employeeId);
                  const typeConfig = leaveTypeConfig[leave.type];
                  const statusConfig = leaveStatusConfig[leave.status];
                  return (
                    <motion.div
                      key={leave.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={cn(
                        'p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors',
                        isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]'
                      )}
                      style={{ borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className={cn('text-xs font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                            {emp?.avatar || '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{emp?.name || leave.employeeId}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn('inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border', typeConfig.className)}>
                              {typeConfig.label}
                            </span>
                            <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
                              {leave.startDate} → {leave.endDate} ({leave.days}d)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <p className={cn('text-xs max-w-[200px] truncate hidden md:block', isDark ? 'text-white/40' : 'text-black/40')}>
                          {leave.reason}
                        </p>
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border shrink-0',
                          statusConfig.className
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dotClass)} />
                          {statusConfig.label}
                        </span>
                        <span className={cn('text-[11px] hidden lg:block', isDark ? 'text-white/30' : 'text-black/30')}>
                          by {leave.approver}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button onClick={(e) => e.stopPropagation()} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                              <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Reject</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="p-12 text-center">
                    <Calendar className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-white/10' : 'text-black/10')} />
                    <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No leave requests found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Leave Balance */}
          <div className="w-full lg:w-72 shrink-0">
            <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <h3 className="text-sm font-bold mb-4">Leave Balance</h3>
              <div className="space-y-3">
                {balances.map((b) => (
                  <div key={b.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{b.type}</span>
                      <span className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-black/70')}>
                        {b.remaining} / {b.total}
                      </span>
                    </div>
                    <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <div
                        className={cn('h-full rounded-full transition-all', b.remaining / (b.total || 1) > 0.5 ? 'bg-emerald-500' : b.remaining / (b.total || 1) > 0.2 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${b.total > 0 ? Math.min((b.remaining / b.total) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
