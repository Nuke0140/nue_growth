'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AttendanceRecord, AttendanceStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusColors: Record<AttendanceStatus, { dot: string; label: string }> = {
  present: { dot: 'bg-emerald-500', label: 'Present' },
  absent: { dot: 'bg-red-500', label: 'Absent' },
  'half-day': { dot: 'bg-amber-500', label: 'Half Day' },
  wfh: { dot: 'bg-blue-500', label: 'WFH' },
  'on-leave': { dot: 'bg-purple-500', label: 'On Leave' },
};

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Component ────────────────────────────────────────────
interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  employeeId?: string;
}

export default function AttendanceCalendar({ records, employeeId }: AttendanceCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const filteredRecords = useMemo(() => {
    return records.filter((r) => !employeeId || r.employeeId === employeeId);
  }, [records, employeeId]);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday = 0, Sunday = 6
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];
    // Pad start
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    // Pad end to fill complete rows
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [viewDate]);

  const recordMap = useMemo(() => {
    const map: Record<string, AttendanceRecord> = {};
    filteredRecords.forEach((r) => {
      const dateKey = r.date;
      map[dateKey] = r;
    });
    return map;
  }, [filteredRecords]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  function getStatusForDay(day: number): AttendanceStatus | null {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return recordMap[dateStr]?.status ?? null;
  }

  function isToday(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` === todayStr;
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  // Summary stats
  const summaryStats = useMemo(() => {
    const counts: Record<string, number> = { present: 0, absent: 0, 'half-day': 0, wfh: 0, 'on-leave': 0 };
    filteredRecords.forEach((r) => {
      if (r.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
        counts[r.status] = (counts[r.status] || 0) + 1;
      }
    });
    return counts;
  }, [filteredRecords, year, month]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5 shadow-sm',
        'bg-[var(--ops-card-bg)] border-[var(--ops-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{monthName}</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="w-7 h-7 hover:bg-[var(--ops-hover-bg)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="w-7 h-7 hover:bg-[var(--ops-hover-bg)]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-medium py-1 text-[var(--ops-text-disabled)]"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const status = getStatusForDay(day);
          const isTodayCell = isToday(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = recordMap[dateStr];

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: index * 0.008 }}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-default transition-colors',
                isTodayCell && 'ring-2 ring-purple-500/50',
                'hover:bg-[var(--ops-hover-bg)]'
              )}
              title={
                status
                  ? `${statusColors[status].label}${record ? ` · ${record.hours}h` : ''}${record?.overtime ? ` · +${record.overtime}h OT` : ''}`
                  : undefined
              }
            >
              <span className={cn(
                'text-[11px] font-medium leading-none',
                isTodayCell ? 'text-purple-500' : 'text-[var(--ops-text-secondary)]'
              )}>
                {day}
              </span>
              {status && (
                <span className={cn('w-1.5 h-1.5 rounded-full mt-1', statusColors[status].dot)} />
              )}
              {isTodayCell && (
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center flex-wrap gap-x-4 gap-y-1">
        {(Object.entries(statusColors) as [AttendanceStatus, { dot: string; label: string }][]).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', config.dot)} />
            <span className="text-[10px] text-[var(--ops-text-muted)]">
              {config.label}
            </span>
            {summaryStats[key] > 0 && (
              <span className="text-[10px] font-medium text-[var(--ops-text-secondary)]">
                {summaryStats[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
