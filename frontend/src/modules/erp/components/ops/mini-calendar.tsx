'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  color?: string;
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  selectedDate?: string;
  onDateClick?: (date: string) => void;
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MiniCalendar({
  events,
  selectedDate,
  onDateClick,
  className,
}: MiniCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  // Build event lookup map
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Events for selected date
  const selectedEvents = selectedDate ? eventMap[selectedDate] || [] : [];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className={cn('app-card p-4 flex flex-col gap-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevMonth}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] transition-colors"
            style={{ color: 'var(--app-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--app-hover-bg)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'transparent';
            }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] transition-colors"
            style={{ color: 'var(--app-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--app-hover-bg)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'transparent';
            }}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium py-1"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(viewYear, viewMonth, day);
          const dayEvents = eventMap[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick?.(dateStr)}
              className={cn(
                'relative flex flex-col items-center justify-center h-8 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors'
              )}
              style={{
                color: isSelected
                  ? '#ffffff'
                  : isToday
                    ? 'var(--app-accent)'
                    : 'var(--app-text-secondary)',
                backgroundColor: isSelected
                  ? 'var(--app-accent)'
                  : isToday
                    ? 'var(--app-accent-light)'
                    : 'transparent',
              }}
            >
              {day}
              {dayEvents.length > 0 && !isSelected && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <span
                      key={idx}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: ev.color || 'var(--app-accent)',
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date events */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="border-t pt-3 mt-1 space-y-2"
              style={{ borderColor: 'var(--app-border)' }}
            >
              {selectedEvents.length === 0 ? (
                <p
                  className="text-xs text-center py-2"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  No events
                </p>
              ) : (
                selectedEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--app-radius-lg)]"
                    style={{ backgroundColor: 'var(--app-hover-bg)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ev.color || 'var(--app-accent)' }}
                    />
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: 'var(--app-text-secondary)' }}
                    >
                      {ev.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
