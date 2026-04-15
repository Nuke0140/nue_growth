'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  AlertTriangle, Info, Users, BarChart3, TrendingUp, TrendingDown, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockWorkload, mockEmployees } from '@/modules/erp/data/mock-data';
import type { WorkloadStatus } from '@/modules/erp/types';

const statusConfig: Record<WorkloadStatus, { label: string; className: string; dotClass: string; barColor: string }> = {
  optimal: { label: 'Optimal', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500', barColor: 'bg-emerald-500' },
  'under-utilized': { label: 'Under-utilized', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dotClass: 'bg-blue-500', barColor: 'bg-blue-500' },
  overloaded: { label: 'Overloaded', className: 'bg-red-500/15 text-red-400 border-red-500/20', dotClass: 'bg-red-500', barColor: 'bg-red-500' },
  'at-capacity': { label: 'At Capacity', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500', barColor: 'bg-amber-500' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

export default function WorkloadPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function getCellColor(allocation: number) {
    if (allocation === 0) return isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]';
    if (allocation <= 30) return isDark ? 'bg-blue-500/20' : 'bg-blue-100';
    if (allocation <= 60) return isDark ? 'bg-emerald-500/20' : 'bg-emerald-100';
    if (allocation <= 85) return isDark ? 'bg-amber-500/20' : 'bg-amber-100';
    return isDark ? 'bg-red-500/20' : 'bg-red-100';
  }

  const data = useMemo(() => {
    return mockWorkload.map(w => ({
      ...w,
      employee: getEmployee(w.employeeId),
    })).filter(w => w.employee);
  }, []);

  // Collect all unique projects
  const allProjects = useMemo(() => {
    const projectSet = new Set<string>();
    data.forEach(w => w.projects.forEach(p => projectSet.add(p)));
    return Array.from(projectSet);
  }, [data]);

  // Project allocation per employee
  const projectAllocations = useMemo(() => {
    return data.map(w => {
      const projMap: Record<string, number> = {};
      if (w.projects.length > 0) {
        const perProject = Math.round(w.allocation / w.projects.length);
        w.projects.forEach(p => { projMap[p] = perProject; });
      }
      return { ...w, projMap };
    });
  }, [data]);

  const stats = useMemo(() => ({
    total: data.length,
    optimal: data.filter(w => w.status === 'optimal').length,
    overloaded: data.filter(w => w.status === 'overloaded').length,
    underUtilized: data.filter(w => w.status === 'under-utilized').length,
  }), [data]);

  const maxAllocation = Math.max(...data.map(d => d.allocation), 100);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Workload</h1>
            <Badge variant="secondary" className={cn('text-xs font-medium', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
              {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Resources', value: stats.total, icon: Users, color: 'text-blue-400' },
            { label: 'Optimal', value: stats.optimal, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Overloaded', value: stats.overloaded, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Under-utilized', value: stats.underUtilized, icon: Info, color: 'text-blue-400' },
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

        {/* Workload Bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Allocation vs Capacity
          </h3>
          <div className="space-y-3">
            {data.map((w, i) => {
              const status = statusConfig[w.status];
              const isOverloaded = w.status === 'overloaded';
              const isIdle = w.status === 'under-utilized' && w.allocation <= 40;
              return (
                <div key={w.id} className="flex items-center gap-3">
                  <div className="w-[140px] shrink-0 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={cn('text-[9px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                        {w.employee!.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn('text-xs font-medium truncate', isDark ? 'text-white/70' : 'text-black/70')}>
                      {w.employee!.name.split(' ')[0]}
                    </span>
                    {isOverloaded && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    )}
                    {isIdle && (
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={cn('h-5 rounded-full overflow-hidden relative', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                      {/* Capacity line at 100% */}
                      <div className={cn('absolute top-0 bottom-0 w-px z-10', isDark ? 'bg-white/10' : 'bg-black/10')} style={{ left: '100%' }} />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(w.allocation, 100)}%` }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.6 }}
                        className={cn('h-full rounded-full', status.barColor, isOverloaded && 'opacity-80')}
                      />
                    </div>
                  </div>
                  <div className="w-[70px] shrink-0 text-right">
                    <span className={cn('text-xs font-bold', isOverloaded ? 'text-red-400' : isIdle ? 'text-blue-400' : isDark ? 'text-white/60' : 'text-black/60')}>
                      {w.allocation}%
                    </span>
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 w-[90px] justify-center',
                    status.className
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Optimal (60-85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>At Capacity (90-100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Overloaded (&gt;95%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Under-utilized (&lt;60%)</span>
            </div>
          </div>
        </motion.div>

        {/* Heatmap Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <h3 className="text-sm font-bold mb-4">Project Allocation Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header row */}
              <div className="flex items-center gap-1 mb-2">
                <div className="w-[140px] shrink-0" />
                {allProjects.map((proj) => (
                  <div key={proj} className="flex-1 min-w-[100px]">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className={cn('text-[10px] font-medium text-center truncate px-1 cursor-help', isDark ? 'text-white/40' : 'text-black/40')}>
                            {proj.length > 20 ? proj.slice(0, 20) + '...' : proj}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent><p>{proj}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
              {/* Employee rows */}
              <div className="space-y-1">
                {projectAllocations.map((w) => (
                  <div key={w.id} className="flex items-center gap-1">
                    <div className="w-[140px] shrink-0">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className={cn('text-[8px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                            {w.employee!.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className={cn('text-[11px] font-medium truncate', isDark ? 'text-white/60' : 'text-black/60')}>
                          {w.employee!.name.split(' ')[0]} {w.employee!.name.split(' ')[1]?.charAt(0) || ''}
                        </span>
                      </div>
                    </div>
                    {allProjects.map((proj) => {
                      const allocation = w.projMap[proj] || 0;
                      return (
                        <div key={proj} className="flex-1 min-w-[100px] px-0.5">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  'h-8 rounded-lg flex items-center justify-center text-[10px] font-medium cursor-default transition-colors',
                                  getCellColor(allocation),
                                  allocation > 0 ? (isDark ? 'text-white/60' : 'text-black/60') : (isDark ? 'text-white/15' : 'text-black/15')
                                )}>
                                  {allocation > 0 ? `${allocation}%` : '—'}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{w.employee!.name} → {proj}: {allocation}%</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overtime Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Overtime Summary
          </h3>
          <div className="space-y-2">
            {data.filter(w => w.overtime > 0).sort((a, b) => b.overtime - a.overtime).map(w => (
              <div key={w.id} className={cn('flex items-center justify-between p-2.5 rounded-lg', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={cn('text-[9px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                      {w.employee!.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{w.employee!.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-sm font-bold', w.overtime >= 8 ? 'text-red-400' : 'text-amber-400')}>
                    +{w.overtime}h
                  </span>
                  <Badge variant="outline" className="text-[10px]">{w.projects.length} projects</Badge>
                </div>
              </div>
            ))}
            {data.filter(w => w.overtime > 0).length === 0 && (
              <p className={cn('text-sm text-center py-4', isDark ? 'text-white/30' : 'text-black/30')}>No overtime recorded</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
