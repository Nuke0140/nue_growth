'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockTasks } from './data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CrmTask, TaskStatus, TaskPriority } from '@/modules/crm-sales/types';
import {
  Search, Plus, LayoutList, CalendarDays, Columns3,
  Phone, Mail, MonitorPlay, FileText, Clock, AlertTriangle,
  Repeat, ArrowRight, Zap, ListTodo, ChevronLeft, ChevronRight,
  User, Target, Briefcase,
} from 'lucide-react';

const priorityConfig: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  low: { color: 'text-gray-400', bg: 'bg-gray-500/10', label: 'Low' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Medium' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'High' },
  urgent: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Urgent' },
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
};

const taskTemplates = [
  { icon: Phone, label: 'Call Back', type: 'call' as const },
  { icon: ArrowRight, label: 'Follow Up', type: 'follow_up' as const },
  { icon: FileText, label: 'Send Proposal', type: 'proposal' as const },
  { icon: MonitorPlay, label: 'Schedule Demo', type: 'demo' as const },
];

const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'text-gray-400' },
  { status: 'in_progress', label: 'In Progress', color: 'text-blue-400' },
  { status: 'done', label: 'Done', color: 'text-emerald-400' },
];

function getDaysUntil(dateStr: string): number {
  const now = new Date('2026-04-09');
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDueDate(dateStr: string): string {
  const days = getDaysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days}d left`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

type ViewMode = 'list' | 'calendar' | 'kanban';

export default function TasksPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [calendarMonth, setCalendarMonth] = useState(3); // April (0-indexed)
  const [calendarYear] = useState(2026);

  const overdueCount = mockTasks.filter((t) => t.isOverdue).length;

  const filtered = useMemo(() => {
    if (!searchQuery) return mockTasks;
    const q = searchQuery.toLowerCase();
    return mockTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.contactName?.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const kanbanTasks = useMemo(() => {
    const result: Record<TaskStatus, CrmTask[]> = {
      todo: [],
      in_progress: [],
      done: [],
      cancelled: [],
    };
    filtered.forEach((t) => {
      if (result[t.status]) result[t.status].push(t);
    });
    return result;
  }, [filtered]);

  const { firstDay, daysInMonth } = getMonthDays(calendarYear, calendarMonth);
  const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' });

  const tasksByDate = useMemo(() => {
    const map: Record<string, CrmTask[]> = {};
    filtered.forEach((t) => {
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [filtered]);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, date: dateStr, tasks: tasksByDate[dateStr] || [] });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                  Tasks
                </h1>
                {overdueCount > 0 && (
                  <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-2 h-5">
                    {overdueCount} overdue
                  </Badge>
                )}
              </div>
              <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
                {filtered.length} tasks • {mockTasks.filter((t) => t.status === 'done').length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl border',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-40',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
            </div>
            <Button
              size="sm"
              className={cn(
                'rounded-xl text-xs h-9 px-4',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Task
            </Button>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            'flex items-center gap-1 p-1 rounded-xl',
            'bg-[var(--app-hover-bg)]'
          )}>
            {[
              { key: 'list' as ViewMode, icon: LayoutList, label: 'List' },
              { key: 'calendar' as ViewMode, icon: CalendarDays, label: 'Calendar' },
              { key: 'kanban' as ViewMode, icon: Columns3, label: 'Kanban' },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  view === v.key
                    ? isDark
                      ? 'bg-white/[0.08] text-white'
                      : 'bg-black/[0.06] text-black'
                    : isDark
                      ? 'text-white/40 hover:text-white/60'
                      : 'text-black/40 hover:text-black/60'
                )}
              >
                <v.icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task templates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Zap className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
          {taskTemplates.map((tmpl) => (
            <button
              key={tmpl.label}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
                  : 'bg-black/[0.02] border border-black/[0.04] text-black/50 hover:text-black/70 hover:bg-black/[0.04]'
              )}
            >
              <tmpl.icon className="w-3.5 h-3.5" />
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-1.5"
            >
              {filtered.map((task, i) => {
                const pri = priorityConfig[task.priority];
                const days = getDaysUntil(task.dueDate);
                const isDueSoon = days >= 0 && days <= 2;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all group',
                      isDark
                        ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                        : 'bg-white hover:bg-black/[0.01] border border-black/[0.04]',
                      task.isOverdue && 'border-l-2 border-l-red-500'
                    )}
                  >
                    <Checkbox
                      checked={task.status === 'done'}
                      className={cn(
                        'shrink-0',
                        task.isOverdue && 'border-red-400'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'text-sm font-medium truncate',
                          task.status === 'done' && 'line-through',
                          'text-[var(--app-text)]'
                        )}>
                          {task.title}
                        </span>
                        {task.isRecurring && (
                          <Repeat className={cn('w-3.5 h-3.5 shrink-0', 'text-[var(--app-text-disabled)]')} />
                        )}
                        {(task.priority === 'urgent' || task.priority === 'high') && (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.contactName && (
                          <button
                            onClick={() => task.contactId && selectContact(task.contactId)}
                            className={cn(
                              'text-xs flex items-center gap-1 transition-colors',
                              isDark
                                ? 'text-purple-400/70 hover:text-purple-300'
                                : 'text-purple-600/70 hover:text-purple-500'
                            )}
                          >
                            <User className="w-3 h-3" />
                            {task.contactName}
                          </button>
                        )}
                        {task.dealName && (
                          <span className={cn('text-xs flex items-center gap-1', 'text-[var(--app-text-muted)]')}>
                            <Briefcase className="w-3 h-3" />
                            {task.dealName}
                          </span>
                        )}
                        <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                          {task.assignee}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn('text-[10px] px-2 py-0 h-5 font-medium border', pri.bg, pri.color)}>
                        {pri.label}
                      </Badge>
                      <Badge className={cn(
                        'text-[10px] px-2 py-0 h-5 font-medium',
                        task.isOverdue
                          ? 'bg-red-500/10 text-red-400'
                          : isDueSoon
                            ? 'bg-amber-500/10 text-amber-400'
                            : isDark
                              ? 'bg-white/[0.04] text-white/40'
                              : 'bg-black/[0.04] text-black/40'
                      )}>
                        {formatDueDate(task.dueDate)}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCalendarMonth(Math.max(0, calendarMonth - 1))}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronLeft className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                </button>
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  {monthName} {calendarYear}
                </h3>
                <button
                  onClick={() => setCalendarMonth(Math.min(11, calendarMonth + 1))}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronRight className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className={cn(
                    'text-center text-[10px] font-medium py-2',
                    'text-[var(--app-text-muted)]'
                  )}>
                    {d}
                  </div>
                ))}
                {calendarDays.map((cell, i) => {
                  if (!cell) return <div key={`empty-${i}`} className="h-20" />;
                  const hasTasks = cell.tasks.length > 0;
                  const hasOverdue = cell.tasks.some((t) => t.isOverdue);
                  const isToday = cell.date === '2026-04-09';
                  return (
                    <div
                      key={cell.date}
                      className={cn(
                        'h-20 rounded-xl p-1.5 transition-colors overflow-hidden',
                        isDark
                          ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                          : 'bg-black/[0.01] hover:bg-black/[0.03]',
                        isToday && (isDark ? 'ring-1 ring-white/10' : 'ring-1 ring-black/10')
                      )}
                    >
                      <span className={cn(
                        'text-[11px] font-medium block mb-1',
                        isToday
                          ? 'text-[var(--app-text)]'
                          : 'text-[var(--app-text-muted)]',
                        hasOverdue && 'text-red-400'
                      )}>
                        {cell.day}
                      </span>
                      {cell.tasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className={cn(
                            'text-[9px] px-1 py-0.5 rounded mb-0.5 truncate',
                            t.isOverdue
                              ? 'bg-red-500/10 text-red-400'
                              : isDark
                                ? 'bg-white/[0.06] text-white/50'
                                : 'bg-black/[0.06] text-black/50'
                          )}
                        >
                          {t.title}
                        </div>
                      ))}
                      {cell.tasks.length > 2 && (
                        <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>
                          +{cell.tasks.length - 2} more
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-4 overflow-x-auto pb-4 min-h-0"
            >
              {kanbanColumns.map((col) => (
                <div key={col.status} className="flex-1 min-w-[250px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', {
                        'bg-gray-400': col.status === 'todo',
                        'bg-blue-400': col.status === 'in_progress',
                        'bg-emerald-400': col.status === 'done',
                      })} />
                      <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                        {col.label}
                      </span>
                    </div>
                    <Badge className={cn(
                      'text-[10px] px-1.5 py-0 h-5',
                      'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                    )}>
                      {kanbanTasks[col.status]?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {(kanbanTasks[col.status] || []).map((task, i) => {
                      const pri = priorityConfig[task.priority];
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            'rounded-xl p-3 transition-all',
                            isDark
                              ? 'bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08]'
                              : 'bg-white border border-black/[0.04] hover:border-black/[0.08] shadow-sm',
                            task.isOverdue && 'border-l-2 border-l-red-500'
                          )}
                        >
                          <p className={cn('text-sm font-medium mb-2', 'text-[var(--app-text)]')}>
                            {task.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={cn('text-[10px] px-2 py-0 h-4 font-medium', pri.bg, pri.color)}>
                              {pri.label}
                            </Badge>
                            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                              {formatDueDate(task.dueDate)}
                            </span>
                          </div>
                          {task.contactName && (
                            <p className={cn('text-[11px] mt-2', 'text-[var(--app-text-muted)]')}>
                              {task.contactName}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
