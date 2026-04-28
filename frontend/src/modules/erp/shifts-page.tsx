'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Clock, Moon, Zap, Users, Building2, AlertTriangle, ChevronRight, CalendarClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockShifts } from '@/modules/erp/data/mock-data';
import type { ShiftRotation } from '@/modules/erp/types';

const rotationConfig: Record<ShiftRotation, { label: string; className: string; dotClass: string }> = {
  fixed: { label: 'Fixed', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
  rotating: { label: 'Rotating', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dotClass: 'bg-blue-500' },
  flexible: { label: 'Flexible', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getDeptColor(dept: string): string {
  const colors: Record<string, string> = {
    Engineering: 'bg-emerald-500',
    All: 'bg-zinc-500',
    Design: 'bg-pink-500',
    QA: 'bg-amber-500',
    Sales: 'bg-orange-500',
  };
  return colors[dept] || 'bg-zinc-500';
}

function ShiftsPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = useMemo(() => ({
    total: mockShifts.length,
    nightShifts: mockShifts.filter(s => s.nightAllowance).length,
    flexible: mockShifts.filter(s => s.rotation === 'flexible').length,
    supportCoverage: mockShifts.filter(s => s.supportTeams.length > 0).length,
  }), []);

  // Generate timeline segments for each shift
  const timelineData = useMemo(() => {
    return mockShifts.map(shift => {
      const startMin = timeToMinutes(shift.startTime);
      const endMin = timeToMinutes(shift.endTime);
      const isOvernight = endMin <= startMin;
      return {
        shift,
        startMin,
        endMin,
        isOvernight,
        leftPercent: (startMin / 1440) * 100,
        widthPercent: isOvernight
          ? ((1440 - startMin + endMin) / 1440) * 100
          : ((endMin - startMin) / 1440) * 100,
      };
    });
  }, []);

  const deptColor = (dept: string) => getDeptColor(dept);

  return (
    <PageShell title="Shifts" icon={CalendarClock}>
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn('h-9 rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                  <Plus className="w-4 h-4" /> Create Shift
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Create a new shift schedule</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Shifts', value: stats.total, icon: Clock, color: 'text-blue-400' },
            { label: 'Night Shifts', value: stats.nightShifts, icon: Moon, color: 'text-purple-400' },
            { label: 'Flexible Shifts', value: stats.flexible, icon: Zap, color: 'text-amber-400' },
            { label: 'Support Coverage', value: stats.supportCoverage, icon: Users, color: 'text-emerald-400' },
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

        {/* Visual Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <h3 className="text-sm font-bold mb-4">24-Hour Timeline</h3>
          {/* Hour labels */}
          <div className="flex mb-2 pl-[160px]">
            {Array.from({ length: 24 }, (_, i) => i).filter(h => h % 3 === 0).map(h => (
              <div key={h} className="text-[9px] absolute" style={{ left: `${(h / 24) * 100 + (160 / (document.documentElement?.clientWidth || 1200)) * 100}%` }}>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {timelineData.map((td, i) => (
              <div key={td.shift.id} className="flex items-center gap-3">
                <div className="w-[140px] shrink-0 text-right">
                  <span className="text-xs font-medium">{td.shift.name}</span>
                </div>
                <div className={cn('flex-1 h-8 rounded-lg relative overflow-hidden', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                  {/* Hour markers */}
                  {Array.from({ length: 24 }, (_, h) => h).filter(h => h % 3 === 0).map(h => (
                    <div
                      key={h}
                      className={cn('absolute top-0 h-full w-px', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}
                      style={{ left: `${(h / 24) * 100}%` }}
                    />
                  ))}
                  {/* Shift bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${td.widthPercent}%` }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                    className={cn('absolute top-1 bottom-1 rounded-md', deptColor(td.shift.department))}
                    style={{ left: `${td.leftPercent}%`, opacity: 0.7 }}
                  />
                  {/* Time labels on bar */}
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <span className="text-[9px] font-medium text-white/80">{td.shift.startTime}</span>
                    <span className="text-[9px] font-medium text-white/80">{td.shift.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Hour labels at bottom */}
          <div className="flex mt-1 pl-[160px]">
            <div className="flex-1 relative h-4">
              {Array.from({ length: 9 }, (_, i) => i * 3).map(h => (
                <span
                  key={h}
                  className={cn('absolute text-[9px] -translate-x-1/2', isDark ? 'text-white/20' : 'text-black/20')}
                  style={{ left: `${(h / 24) * 100}%` }}
                >
                  {h.toString().padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Shift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockShifts.map((shift, idx) => {
            const rot = rotationConfig[shift.rotation];
            const startMin = timeToMinutes(shift.startTime);
            const endMin = timeToMinutes(shift.endTime);
            const duration = endMin > startMin ? endMin - startMin : (1440 - startMin + endMin);
            const durationHours = Math.floor(duration / 60);
            const durationMins = duration % 60;

            return (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 + 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border overflow-hidden transition-all duration-200',
                  isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:shadow-lg'
                )}
              >
                <div className={cn('h-1', getDeptColor(shift.department))} />
                <div className="p-5">
                  {/* Name + Rotation */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-bold">{shift.name}</h3>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', rot.className)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', rot.dotClass)} />
                      {rot.label}
                    </span>
                  </div>

                  {/* Department */}
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                    <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{shift.department}</span>
                  </div>

                  {/* Time Range */}
                  <div className={cn('rounded-xl border p-3 mb-4', isDark ? 'border-white/[0.04] bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]')}>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className={cn('text-[10px] mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>Start</p>
                        <p className="text-lg font-bold">{shift.startTime}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={cn('w-8 h-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
                        <ChevronRight className={cn('w-3 h-3 mx-1', isDark ? 'text-white/20' : 'text-black/20')} />
                        <div className={cn('w-8 h-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[10px] mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>End</p>
                        <p className="text-lg font-bold">{shift.endTime}</p>
                      </div>
                      <div className="text-center ml-4">
                        <p className={cn('text-[10px] mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>Duration</p>
                        <p className="text-sm font-bold">{durationHours}h{durationMins > 0 ? ` ${durationMins}m` : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Night Allowance */}
                  {shift.nightAllowance && (
                    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4', isDark ? 'bg-purple-500/10' : 'bg-purple-50')}>
                      <Moon className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">Night allowance applicable</span>
                    </div>
                  )}

                  {/* Support Teams */}
                  {shift.supportTeams.length > 0 && (
                    <div>
                      <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1.5', isDark ? 'text-white/25' : 'text-black/25')}>
                        Support Teams
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {shift.supportTeams.map(team => (
                          <Badge key={team} variant="outline" className="text-[10px]">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

export default memo(ShiftsPageInner);
