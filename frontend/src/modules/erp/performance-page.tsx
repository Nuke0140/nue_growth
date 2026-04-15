'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Target, Clock, CheckCircle2, Trophy, Star, TrendingUp,
  ChevronDown, MoreHorizontal, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockPerformanceReviews, mockEmployees } from '@/modules/erp/data/mock-data';
import type { PromotionReadiness } from '@/modules/erp/types';

const promotionConfig: Record<PromotionReadiness, { label: string; className: string; dotClass: string }> = {
  'not-ready': { label: 'Not Ready', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', dotClass: 'bg-zinc-500' },
  developing: { label: 'Developing', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
  ready: { label: 'Ready', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
  overdue: { label: 'Overdue', className: 'bg-red-500/15 text-red-400 border-red-500/20', dotClass: 'bg-red-500' },
};

function getEmployee(id: string) {
  return mockEmployees.find(e => e.id === id);
}

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

export default function PerformancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('Q1 2026');

  const reviews = useMemo(() => {
    return mockPerformanceReviews
      .filter(r => r.period === selectedPeriod)
      .map(r => ({ ...r, employee: getEmployee(r.employeeId)! }))
      .filter(r => r.employee);
  }, [selectedPeriod]);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avgKpi: 0, avgSla: 0, avgTask: 0, readyCount: 0 };
    return {
      avgKpi: Math.round(reviews.reduce((s, r) => s + r.kpiScore, 0) / reviews.length),
      avgSla: Math.round(reviews.reduce((s, r) => s + r.slaScore, 0) / reviews.length),
      avgTask: Math.round(reviews.reduce((s, r) => s + r.taskCompletion, 0) / reviews.length),
      readyCount: reviews.filter(r => r.promotionReadiness === 'ready' || r.promotionReadiness === 'overdue').length,
    };
  }, [reviews]);

  const topPerformers = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const scoreA = (a.kpiScore + a.slaScore + a.taskCompletion) / 3;
      const scoreB = (b.kpiScore + b.slaScore + b.taskCompletion) / 3;
      return scoreB - scoreA;
    }).slice(0, 3);
  }, [reviews]);

  // Performance distribution chart data
  const distribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]; // 0-40, 41-60, 61-75, 76-90, 91-100
    reviews.forEach(r => {
      const avg = (r.kpiScore + r.slaScore + r.taskCompletion) / 3;
      if (avg <= 40) buckets[0]++;
      else if (avg <= 60) buckets[1]++;
      else if (avg <= 75) buckets[2]++;
      else if (avg <= 90) buckets[3]++;
      else buckets[4]++;
    });
    return [
      { label: '0-40', count: buckets[0], color: 'bg-red-500' },
      { label: '41-60', count: buckets[1], color: 'bg-orange-500' },
      { label: '61-75', count: buckets[2], color: 'bg-amber-500' },
      { label: '76-90', count: buckets[3], color: 'bg-emerald-500' },
      { label: '91-100', count: buckets[4], color: 'bg-teal-500' },
    ];
  }, [reviews]);

  const maxDist = Math.max(...distribution.map(d => d.count), 1);

  const periods = ['Q1 2026', 'Q4 2025', 'Q3 2025'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Performance</h1>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={cn(
                  'appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-lg border cursor-pointer focus:outline-none',
                  isDark ? 'bg-white/[0.04] border-white/[0.08] text-white/60' : 'bg-black/[0.03] border-black/[0.08] text-black/60'
                )}
              >
                {periods.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn('h-9 rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                  <Plus className="w-4 h-4" /> Start Review
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Start a new performance review cycle</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg KPI Score', value: `${stats.avgKpi}%`, icon: Target, color: 'text-emerald-400' },
            { label: 'Avg SLA Score', value: `${stats.avgSla}%`, icon: Clock, color: 'text-blue-400' },
            { label: 'Avg Task Completion', value: `${stats.avgTask}%`, icon: CheckCircle2, color: 'text-purple-400' },
            { label: 'Promotion Ready', value: stats.readyCount, icon: TrendingUp, color: 'text-amber-400' },
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

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Top Performers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((r, i) => {
              const avg = Math.round((r.kpiScore + r.slaScore + r.taskCompletion) / 3);
              const trophyColors = ['text-amber-400', 'text-zinc-400', 'text-orange-600'];
              return (
                <div key={r.id} className={cn('rounded-xl border p-4 flex items-center gap-4', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                  <div className="flex flex-col items-center">
                    <Trophy className={cn('w-6 h-6', trophyColors[i])} />
                    <span className={cn('text-lg font-bold mt-1', trophyColors[i])}>#{i + 1}</span>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn('text-sm font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                      {r.employee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{r.employee.name}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{r.employee.department}</p>
                    <p className={cn('text-xs font-bold mt-1', getBarTextColor(avg))}>{avg}% avg</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Performance Table */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Employee</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Department</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">KPI</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">SLA</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Tasks</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">Feedback</th>
                      <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Promotion</th>
                      <th className="w-[40px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r, idx) => {
                      const promo = promotionConfig[r.promotionReadiness];
                      return (
                        <motion.tr
                          key={r.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className={cn('border-b last:border-0', isDark ? 'border-white/[0.03]' : 'border-black/[0.03]')}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className={cn('text-[10px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                                  {r.employee.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{r.employee.name}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-3 py-3">
                            <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{r.employee.department}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2 min-w-[70px]">
                              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                                <div className={cn('h-full rounded-full', getBarColor(r.kpiScore))} style={{ width: `${r.kpiScore}%` }} />
                              </div>
                              <span className={cn('text-[11px] font-medium w-6 text-right', getBarTextColor(r.kpiScore))}>{r.kpiScore}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-3 py-3">
                            <div className="flex items-center gap-2 min-w-[70px]">
                              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                                <div className={cn('h-full rounded-full', getBarColor(r.slaScore))} style={{ width: `${r.slaScore}%` }} />
                              </div>
                              <span className={cn('text-[11px] font-medium w-6 text-right', getBarTextColor(r.slaScore))}>{r.slaScore}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2 min-w-[70px]">
                              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                                <div className={cn('h-full rounded-full', getBarColor(r.taskCompletion))} style={{ width: `${r.taskCompletion}%` }} />
                              </div>
                              <span className={cn('text-[11px] font-medium w-6 text-right', getBarTextColor(r.taskCompletion))}>{r.taskCompletion}</span>
                            </div>
                          </td>
                          <td className="hidden lg:table-cell px-3 py-3">
                            <span className={cn('text-sm font-medium', r.clientFeedback > 0 ? getBarTextColor(r.clientFeedback) : isDark ? 'text-white/30' : 'text-black/30')}>
                              {r.clientFeedback > 0 ? `${r.clientFeedback}%` : 'N/A'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', promo.className)}>
                              <span className={cn('w-1.5 h-1.5 rounded-full', promo.dotClass)} />
                              {promo.label}
                            </span>
                          </td>
                          <td className="px-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                                  <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Review</DropdownMenuItem>
                                <DropdownMenuItem>Download Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Distribution Chart */}
          <div className="w-full xl:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Performance Distribution
              </h3>
              <div className="space-y-3">
                {distribution.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{d.label}%</span>
                      <span className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-black/70')}>{d.count}</span>
                    </div>
                    <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / maxDist) * 100}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('h-full rounded-full', d.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
