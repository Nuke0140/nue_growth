'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Shield, Clock, CheckCircle2, XCircle, ArrowUpCircle,
  MessageSquare, FileText, Palette, DollarSign, CreditCard,
  Plane, FileBarChart, GitCompareArrows, ThumbsUp, ThumbsDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockApprovals } from '@/modules/erp/data/mock-data';
import type { ApprovalType, ApprovalStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'pending' | 'approved' | 'rejected' | 'escalated';

function getTypeConfig(type: ApprovalType, isDark: boolean) {
  const configs: Record<ApprovalType, { icon: React.ElementType; label: string; className: string }> = {
    content: { icon: FileText, label: 'Content', className: isDark ? 'bg-sky-500/15 text-sky-400 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200' },
    design: { icon: Palette, label: 'Design', className: isDark ? 'bg-violet-500/15 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200' },
    invoice: { icon: DollarSign, label: 'Invoice', className: isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    budget: { icon: CreditCard, label: 'Budget', className: isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200' },
    payroll: { icon: FileBarChart, label: 'Payroll', className: isDark ? 'bg-pink-500/15 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200' },
    leave: { icon: Plane, label: 'Leave', className: isDark ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    proposal: { icon: FileText, label: 'Proposal', className: isDark ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200' },
  };
  return configs[type];
}

function getStatusConfig(status: ApprovalStatus, isDark: boolean) {
  const configs: Record<ApprovalStatus, { label: string; className: string; animate: boolean }> = {
    pending: { label: 'Pending', className: isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200', animate: true },
    approved: { label: 'Approved', className: isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200', animate: false },
    rejected: { label: 'Rejected', className: isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200', animate: false },
    escalated: { label: 'Escalated', className: isDark ? 'bg-orange-500/15 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200', animate: false },
  };
  return configs[status];
}

export default function ApprovalsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    let result = [...mockApprovals];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.requestedBy.toLowerCase().includes(q) ||
        (a.project || '').toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'pending': result = result.filter(a => a.status === 'pending'); break;
      case 'approved': result = result.filter(a => a.status === 'approved'); break;
      case 'rejected': result = result.filter(a => a.status === 'rejected'); break;
      case 'escalated': result = result.filter(a => a.status === 'escalated'); break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    pending: mockApprovals.filter(a => a.status === 'pending').length,
    approvedToday: mockApprovals.filter(a => a.status === 'approved').length,
    rejected: mockApprovals.filter(a => a.status === 'rejected').length,
    avgResponseTime: '4.2h',
  }), []);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockApprovals.length },
    { key: 'pending', label: 'Pending', count: mockApprovals.filter(a => a.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: mockApprovals.filter(a => a.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: mockApprovals.filter(a => a.status === 'rejected').length },
    { key: 'escalated', label: 'Escalated', count: mockApprovals.filter(a => a.status === 'escalated').length },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Approvals</h1>
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
                placeholder="Search approvals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
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
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400', bgColor: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
            { label: 'Approved Today', value: stats.approvedToday, icon: CheckCircle2, color: 'text-emerald-400', bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400', bgColor: isDark ? 'bg-red-500/10' : 'bg-red-50' },
            { label: 'Avg Response', value: stats.avgResponseTime, icon: Shield, color: 'text-sky-400', bgColor: isDark ? 'bg-sky-500/10' : 'bg-sky-50' },
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
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bgColor)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Approval Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className={cn('col-span-full rounded-2xl border p-12 text-center', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <Shield className={cn('w-12 h-12 mx-auto', isDark ? 'text-white/10' : 'text-black/10')} />
              <p className={cn('text-sm mt-3', isDark ? 'text-white/40' : 'text-black/40')}>No approvals found</p>
            </div>
          ) : (
            filtered.map((approval, idx) => {
              const typeConf = getTypeConfig(approval.type, isDark);
              const statusConf = getStatusConfig(approval.status, isDark);
              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'rounded-2xl border p-5 space-y-4 transition-colors',
                    isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                  )}
                >
                  {/* Top Row: Type + Status */}
                  <div className="flex items-center justify-between">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', typeConf.className)}>
                      <typeConf.icon className="w-3 h-3" />
                      {typeConf.label}
                    </span>
                    {approval.status === 'pending' ? (
                      <motion.span
                        className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', statusConf.className)}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {statusConf.label}
                      </motion.span>
                    ) : (
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', statusConf.className)}>
                        {statusConf.label}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-sm font-semibold leading-snug">{approval.title}</p>
                    {approval.project && (
                      <p className={cn('text-[10px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{approval.project}</p>
                    )}
                  </div>

                  {/* Requested By */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[9px] font-semibold bg-sky-500/15 text-sky-400">
                        {approval.requestedBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{approval.requestedBy}</span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>·</span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>v{approval.version}</span>
                  </div>

                  {/* Footer: Comments + Date + Actions */}
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-3">
                      {approval.comments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{approval.comments.length}</span>
                        </div>
                      )}
                      <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>
                        {new Date(approval.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {(approval.type === 'content' || approval.type === 'design') && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                <GitCompareArrows className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent><p>Compare versions</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {approval.status === 'pending' && (
                        <>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-emerald-500/15 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600')}>
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent><p>Approve</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-red-500/15 text-red-400' : 'hover:bg-red-50 text-red-600')}>
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent><p>Reject</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                      <ChevronRight className={cn('w-4 h-4', isDark ? 'text-white/15' : 'text-black/15')} />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
