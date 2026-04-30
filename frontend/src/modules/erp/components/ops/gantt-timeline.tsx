'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Calendar,
  Clock,
  User,
  List,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface GanttTask {
  id: string;
  name: string;
  assignee: string;
  startDate: string;
  endDate: string;
  progress: number;
  stage: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  color?: string;
  dependencies?: string[];
}

interface GanttTimelineProps {
  tasks: GanttTask[];
  projectName?: string;
}

type ZoomLevel = 'week' | 'month' | 'quarter';

// ── Helpers ────────────────────────────────────────────

const STAGE_COLORS: Record<string, { bar: string; fill: string; text: string }> = {
  todo:        { bar: 'rgba(255,255,255,0.12)', fill: 'rgba(255,255,255,0.06)', text: 'rgba(245,245,245,0.5)' },
  'in-progress': { bar: '#3b82f6', fill: '#2563eb', text: '#f5f5f5' },
  review:      { bar: '#f59e0b', fill: '#d97706', text: '#f5f5f5' },
  done:        { bar: '#22c55e', fill: '#16a34a', text: '#f5f5f5' },
  blocked:     { bar: '#ef4444', fill: '#dc2626', text: '#f5f5f5' },
};

function parseDate(d: string): Date {
  return new Date(d + 'T00:00:00');
}

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(n: number): string {
  return n.toLocaleString();
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDayColumnWidth(zoom: ZoomLevel): number {
  switch (zoom) {
    case 'week': return 40;
    case 'month': return 18;
    case 'quarter': return 7;
  }
}

function relativeTimestamp(dateStr: string): string {
  const now = new Date();
  const date = parseDate(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHr = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

// ── Tooltip ────────────────────────────────────────────

function TaskTooltip({
  task,
  visible,
  position,
}: {
  task: GanttTask | null;
  visible: boolean;
  position: { x: number; y: number };
}) {
  if (!task || !visible) return null;

  const colors = STAGE_COLORS[task.stage];
  const totalDays = daysBetween(parseDate(task.startDate), parseDate(task.endDate));
  const remainingDays = Math.max(0, daysBetween(new Date(), parseDate(task.endDate)));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -110%)' }}
    >
      <div
        className="rounded-lg px-3 py-2.5 shadow-2xl border min-w-[200px]"
        style={{
          backgroundColor: 'var(--app-elevated)',
          borderColor: 'var(--app-border-strong)',
        }}
      >
        <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>{task.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <User className="w-3 h-3" style={{ color: 'var(--app-text-muted)' }} />
          <span className="text-[11px]" style={{ color: 'var(--app-text-secondary)' }}>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Calendar className="w-3 h-3" style={{ color: 'var(--app-text-muted)' }} />
          <span className="text-[11px]" style={{ color: 'var(--app-text-secondary)' }}>
            {totalDays} days total · {remainingDays} remaining
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${colors.bar}30`, color: colors.bar }}
          >
            {task.stage}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--app-text-secondary)' }}>
            {task.progress}% complete
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Component ──────────────────────────────────────────

export function GanttTimeline({ tasks, projectName }: GanttTimelineProps) {
  const [zoom, setZoom] = useState<ZoomLevel>('month');
  const [hoveredTask, setHoveredTask] = useState<GanttTask | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isMobileView, setIsMobileView] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { rangeStart, rangeEnd, totalDays, dayWidth } = useMemo(() => {
    const rs = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const re = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const td = daysBetween(rs, re) + 1;
    return {
      rangeStart: rs,
      rangeEnd: re,
      totalDays: td,
      dayWidth: getDayColumnWidth(zoom),
    };
  }, [zoom]);

  const totalWidth = totalDays * dayWidth;

  const { months, weeks } = useMemo(() => {
    const m: { label: string; startDay: number; width: number; index: number }[] = [];
    const w: { label: string; startDay: number; width: number }[] = [];

    const cur = new Date(rangeStart);
    let weekStart = cur.getDay();

    for (let d = 0; d < totalDays; d++) {
      const date = new Date(rangeStart);
      date.setDate(date.getDate() + d);

      if (date.getDate() === 1 || d === 0) {
        if (m.length > 0) {
          m[m.length - 1].width = d - m[m.length - 1].startDay;
        }
        m.push({
          label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
          startDay: d,
          width: 0,
          index: date.getMonth(),
        });
      }

      if (date.getDay() === 1 || d === 0) {
        if (w.length > 0) {
          w[w.length - 1].width = d - w[w.length - 1].startDay;
        }
        w.push({
          label: `W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`,
          startDay: d,
          width: 0,
        });
      }
    }

    if (m.length > 0) m[m.length - 1].width = totalDays - m[m.length - 1].startDay;
    if (w.length > 0) w[w.length - 1].width = totalDays - w[w.length - 1].startDay;

    return { months: m, weeks: w };
  }, [rangeStart, totalDays]);

  const todayOffset = Math.max(0, daysBetween(rangeStart, today));

  function getTaskPosition(task: GanttTask) {
    const start = parseDate(task.startDate);
    const end = parseDate(task.endDate);
    const startOffset = daysBetween(rangeStart, start);
    const duration = Math.max(1, daysBetween(start, end) + 1);

    return {
      left: startOffset * dayWidth,
      width: duration * dayWidth,
      clampedLeft: Math.max(0, startOffset * dayWidth),
    };
  }

  function getDependencyLine(fromTask: GanttTask, toTask: GanttTask) {
    const from = getTaskPosition(fromTask);
    const to = getTaskPosition(toTask);
    return {
      x1: from.left + from.width,
      x2: to.left,
      y1: 0,
      y2: 0,
    };
  }

  function handleMouseEnter(task: GanttTask, e: React.MouseEvent) {
    setHoveredTask(task);
    setTooltipPos({ x: e.clientX, y: e.clientY - 10 });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (hoveredTask) {
      setTooltipPos({ x: e.clientX, y: e.clientY - 10 });
    }
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  return (
    <div className="ops-card p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ backgroundColor: 'var(--app-accent-light)' }}
          >
            <Calendar className="w-4.5 h-4.5" style={{ color: 'var(--app-accent)' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
              {projectName || 'Project Timeline'}
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
              {tasks.length} tasks · {MONTH_NAMES[rangeStart.getMonth()]} – {MONTH_NAMES[rangeEnd.getMonth()]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile list toggle */}
          <button
            onClick={() => setIsMobileView((v) => !v)}
            className={cn(
              'p-1.5 rounded-lg transition-colors md:hidden',
              isMobileView
                ? 'bg-[var(--app-accent-light)]'
                : 'hover:bg-[var(--app-hover-bg)]'
            )}
            style={{ color: isMobileView ? 'var(--app-accent)' : 'var(--app-text-secondary)' }}
          >
            <List className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div
            className="hidden md:flex items-center rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--app-border)' }}
          >
            {(['week', 'month', 'quarter'] as ZoomLevel[]).map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-medium transition-colors capitalize',
                  zoom === z ? 'bg-[var(--app-accent-light)]' : 'hover:bg-[var(--app-hover-bg)]'
                )}
                style={{
                  color: zoom === z ? 'var(--app-accent)' : 'var(--app-text-secondary)',
                  borderRight: z !== 'quarter' ? '1px solid var(--app-border)' : undefined,
                }}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Gantt View */}
      {!isMobileView ? (
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${totalWidth + 220}px` }}>
            {/* Time Headers */}
            <div className="flex" style={{ borderBottom: '1px solid var(--app-border)' }}>
              {/* Task label column */}
              <div
                className="shrink-0 px-5 py-2"
                style={{
                  width: 220,
                  borderBottom: '1px solid var(--app-border)',
                }}
              >
                <span className="text-[11px] font-medium" style={{ color: 'var(--app-text-muted)' }}>
                  Task
                </span>
              </div>

              {/* Month + week/day headers */}
              <div className="relative flex-1">
                {/* Month row */}
                <div className="flex">
                  {months.map((m) => (
                    <div
                      key={m.label}
                      className="px-2 py-1.5 text-[11px] font-medium shrink-0"
                      style={{
                        width: m.width * dayWidth,
                        color: 'var(--app-text-secondary)',
                        borderBottom: '1px solid var(--app-border)',
                        borderRight: '1px solid var(--app-border)',
                      }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Week / Day row */}
                <div className="flex">
                  {(zoom === 'week' || zoom === 'month' ? weeks : months).map((w) => (
                    <div
                      key={w.label + w.startDay}
                      className="text-center text-[10px] shrink-0 py-1"
                      style={{
                        width: w.width * dayWidth,
                        color: 'var(--app-text-muted)',
                        borderRight: '1px solid var(--app-border)',
                      }}
                    >
                      {zoom === 'week'
                        ? DAY_NAMES.map((d) => (
                            <div key={d} className="inline-block" style={{ width: dayWidth }}>
                              {d}
                            </div>
                          ))
                        : w.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task rows */}
            <div className="relative" onMouseMove={handleMouseMove}>
              {/* Today line */}
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none"
                style={{
                  left: 220 + todayOffset * dayWidth,
                  width: 2,
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 8px rgba(239,68,68,0.3)',
                }}
              >
                <div
                  className="absolute -top-0 -left-[18px] text-[9px] font-bold px-1 rounded"
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
                >
                  TODAY
                </div>
              </div>

              {/* Weekend backgrounds */}
              {Array.from({ length: totalDays }, (_, i) => {
                const date = new Date(rangeStart);
                date.setDate(date.getDate() + i);
                if (date.getDay() === 0 || date.getDay() === 6) {
                  return (
                    <div
                      key={`we-${i}`}
                      className="absolute top-0 bottom-0 pointer-events-none"
                      style={{
                        left: 220 + i * dayWidth,
                        width: dayWidth,
                        backgroundColor: 'rgba(255,255,255,0.015)',
                      }}
                    />
                  );
                }
                return null;
              })}

              {/* Dependency lines */}
              <svg
                className="absolute inset-0 pointer-events-none z-0"
                style={{ left: 220, width: totalWidth, height: tasks.length * 52 }}
              >
                {tasks.map((task) =>
                  (task.dependencies || []).map((depId) => {
                    const fromTask = tasks.find((t) => t.id === depId);
                    if (!fromTask) return null;
                    const fromIdx = tasks.indexOf(fromTask);
                    const toIdx = tasks.indexOf(task);
                    const dep = getDependencyLine(fromTask, task);
                    const y1 = fromIdx * 52 + 26;
                    const y2 = toIdx * 52 + 26;
                    const midX = (dep.x1 + dep.x2) / 2;
                    return (
                      <path
                        key={`${depId}-${task.id}`}
                        d={`M ${dep.x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${dep.x2} ${y2}`}
                        fill="none"
                        stroke="rgba(245,245,245,0.1)"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                    );
                  })
                )}
              </svg>

              {tasks.map((task, idx) => {
                const colors = task.color
                  ? { bar: task.color, fill: task.color, text: '#f5f5f5' }
                  : STAGE_COLORS[task.stage];
                const pos = getTaskPosition(task);
                const isExpanded = expandedTasks.has(task.id);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="flex items-center group"
                    style={{
                      height: 52,
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* Task label */}
                    <div
                      className="shrink-0 flex items-center gap-2 px-5 overflow-hidden"
                      style={{ width: 220 }}
                    >
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="shrink-0"
                        style={{ color: 'var(--app-text-muted)' }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: 'var(--app-text)' }}
                        >
                          {task.name}
                        </p>
                        <p
                          className="text-[10px] truncate"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {task.assignee}
                        </p>
                      </div>
                    </div>

                    {/* Gantt bar area */}
                    <div className="relative flex-1 h-full">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-pointer overflow-hidden transition-shadow group-hover:shadow-lg"
                        style={{
                          left: pos.clampedLeft,
                          width: Math.max(pos.width, dayWidth * 2),
                          backgroundColor: colors.bar,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={(e) => handleMouseEnter(task, e)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        {/* Progress fill */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="h-full rounded-md"
                          style={{ backgroundColor: colors.fill }}
                        />
                        {/* Label on bar */}
                        <div
                          className="absolute inset-0 flex items-center px-2 overflow-hidden"
                          style={{ color: colors.text }}
                        >
                          <span className="text-[10px] font-medium truncate">
                            {pos.width > 80 ? `${task.name} · ${task.progress}%` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Mobile list view */
        <div className="px-4 py-3 flex flex-col gap-2">
          {tasks.map((task, idx) => {
            const colors = STAGE_COLORS[task.stage];
            const totalDays = daysBetween(parseDate(task.startDate), parseDate(task.endDate));
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${colors.bar}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>{task.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>{task.assignee}</span>
                      <span className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
                        {totalDays}d
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0"
                    style={{ backgroundColor: `${colors.bar}25`, color: colors.bar }}
                  >
                    {task.stage}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.bar }}
                  />
                </div>
                <p className="text-[10px] mt-1" style={{ color: 'var(--app-text-muted)' }}>
                  {task.progress}% complete
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        <TaskTooltip task={hoveredTask} visible={!!hoveredTask} position={tooltipPos} />
      </AnimatePresence>
    </div>
  );
}
