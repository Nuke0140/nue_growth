'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, CheckCircle2, Home, Clock, AlertTriangle, AlertCircle,
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockEmployees, mockAttendance } from '@/modules/erp/data/mock-data';
import type { AttendanceStatus } from '@/modules/erp/types';

const statusColors: Record<AttendanceStatus, { color: string; label: string }> = {
  present: { color: 'bg-emerald-500', label: 'Present' },
  absent: { color: 'bg-red-500', label: 'Absent' },
  'half-day': { color: 'bg-amber-500', label: 'Half Day' },
  wfh: { color: 'bg-blue-500', label: 'WFH' },
  'on-leave': { color: 'bg-purple-500', label: 'On Leave' },
};

const statusBadgeConfig: Record<AttendanceStatus, { className: string; dotClass: string }> = {
  present: { className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dotClass: 'bg-emerald-500' },
  absent: { className: 'bg-red-500/15 text-red-400 border-red-500/20', dotClass: 'bg-red-500' },
  'half-day': { className: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dotClass: 'bg-amber-500' },
  wfh: { className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dotClass: 'bg-blue-500' },
  'on-leave': { className: 'bg-purple-500/15 text-purple-400 border-purple-500/20', dotClass: 'bg-purple-500' },
};

function getEmployeeName(id: string): string {
  return mockEmployees.find(e => e.id === id)?.name || id;
}

function getEmployeeInitials(id: string): string {
  return mockEmployees.find(e => e.id === id)?.avatar || '??';
}

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate 5-week calendar data
  const calendarData = useMemo(() => {
    const weeks: { date: string; day: number; month: number; statuses: AttendanceStatus[] }[][] = [];
    const statuses: AttendanceStatus[] = ['present', 'present', 'present', 'wfh', 'present', 'absent', 'on-leave', 'present', 'present', 'present', 'present', 'present', 'half-day', 'present', 'present', 'wfh', 'present', 'present', 'present', 'absent', 'present', 'present', 'present', 'present', 'present', 'present', 'on-leave', 'present', 'present', 'present', 'present', 'present', 'half-day', 'present'];
    const baseDate = new Date(2026, 3, 7 - weekOffset * 7);
    for (let w = 0; w < 5; w++) {
      const week: { date: string; day: number; month: number; statuses: AttendanceStatus[] }[] = [];
      for (let d = 0; d < 7; d++) {
        const idx = w * 7 + d;
        const dt = new Date(baseDate);
        dt.setDate(dt.getDate() + idx);
        week.push({
          date: dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
          day: dt.getDate(),
          month: dt.getMonth(),
          statuses: statuses.slice(0, 4).map(() => statuses[Math.floor(Math.random() * 5)]),
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [weekOffset]);

  const todayStr = '10';
  const todayMonth = 3;

  const stats = useMemo(() => ({
    present: mockAttendance.filter(a => a.status === 'present').length,
    wfh: mockAttendance.filter(a => a.status === 'wfh').length,
    onLeave: mockAttendance.filter(a => a.status === 'on-leave').length,
    halfDay: mockAttendance.filter(a => a.status === 'half-day').length,
  }), []);

  const anomalies = useMemo(() => mockAttendance.filter(a => a.isAnomaly), []);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Attendance</h1>
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              <CalendarIcon className="w-3 h-3 mr-1" />
              10 Apr 2026
            </Badge>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn(
                  'h-9 rounded-xl gap-2',
                  isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                )}>
                  <Plus className="w-4 h-4" /> Mark Attendance
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Mark today's attendance</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Present Today', value: stats.present, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'WFH', value: stats.wfh, icon: Home, color: 'text-blue-400' },
            { label: 'On Leave', value: stats.onLeave, icon: Clock, color: 'text-purple-400' },
            { label: 'Half-Day', value: stats.halfDay, icon: AlertTriangle, color: 'text-amber-400' },
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
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Attendance Overview</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>5 Weeks</span>
              <button onClick={() => setWeekOffset(w => w + 1)} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div />
            {dayNames.map(day => (
              <div key={day} className={cn('text-center text-[10px] font-semibold uppercase tracking-wider py-2', isDark ? 'text-white/30' : 'text-black/30')}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Rows */}
          <div className="space-y-1">
            {calendarData.map((week, wi) => (
              <div key={wi} className="grid grid-cols-8 gap-1 items-center">
                <span className={cn('text-[10px] font-medium pr-2', isDark ? 'text-white/30' : 'text-black/30')}>W{wi + 1}</span>
                {week.map((day, di) => {
                  const isToday = day.day === parseInt(todayStr) && day.month === todayMonth;
                  return (
                    <div
                      key={di}
                      className={cn(
                        'h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 relative',
                        isToday && 'ring-2 ring-purple-500/50'
                      )}
                    >
                      <span className={cn('text-[9px]', isToday ? 'font-bold text-purple-400' : isDark ? 'text-white/20' : 'text-black/20')}>
                        {day.day}
                      </span>
                      <div className="flex gap-0.5">
                        {day.statuses.slice(0, 3).map((s, si) => (
                          <div key={si} className={cn('w-2 h-2 rounded-sm', statusColors[s].color)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
            {Object.entries(statusColors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', val.color)} />
                <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>{val.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Attendance List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className={cn('px-5 py-3 border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
            <h3 className="text-sm font-bold">Today&apos;s Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">Employee</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Check In</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden md:table-cell">Check Out</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">Hours</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden lg:table-cell">Overtime</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">Status</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30 hidden sm:table-cell">Flag</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((record) => {
                  const name = getEmployeeName(record.employeeId);
                  const initials = getEmployeeInitials(record.employeeId);
                  const badge = statusBadgeConfig[record.status];
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn('border-b last:border-0', isDark ? 'border-white/[0.03]' : 'border-black/[0.03]')}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={cn('text-[10px] font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3">
                        <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{record.checkIn || '—'}</span>
                      </td>
                      <td className="hidden md:table-cell px-3 py-3">
                        <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{record.checkOut || '—'}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('text-sm font-medium', record.hours >= 9 ? 'text-emerald-400' : record.hours === 0 ? (isDark ? 'text-white/30' : 'text-black/30') : 'text-amber-400')}>
                          {record.hours > 0 ? `${record.hours}h` : '—'}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 py-3">
                        <span className={cn('text-sm', record.overtime > 0 ? 'text-amber-400' : isDark ? 'text-white/30' : 'text-black/30')}>
                          {record.overtime > 0 ? `+${record.overtime}h` : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border', badge.className)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', badge.dotClass)} />
                          {statusColors[record.status].label}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-3">
                        {record.isAnomaly && (
                          <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10">
                            <AlertCircle className="w-3 h-3 mr-1" /> Anomaly
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Anomaly Alerts */}
        {anomalies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className={cn('rounded-2xl border border-amber-500/30 p-5', isDark ? 'bg-amber-500/[0.03]' : 'bg-amber-50/50')}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-400">Anomaly Alerts</h3>
            </div>
            <div className="space-y-2">
              {anomalies.map((record) => {
                const name = getEmployeeName(record.employeeId);
                return (
                  <div key={record.id} className={cn('flex items-center gap-3 rounded-lg p-2', isDark ? 'bg-white/[0.03]' : 'bg-white')}>
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {record.status === 'absent'
                          ? 'Marked absent — no check-in recorded'
                          : record.overtime >= 3
                            ? `Excessive overtime — ${record.overtime}h extra logged`
                            : `Late check-in at ${record.checkIn}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
