'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CircleDot,
  Circle,
  Loader2,
  Eye,
  CheckCircle2,
  Ban,
  Calendar,
  AlertCircle,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ErpTask, TaskStage } from '../types';

// ─── Stage Configuration ──────────────────────────────────
const stages: { key: TaskStage; label: string; icon: typeof CircleDot; color: string; headerBg: string }[] = [
  { key: 'backlog', label: 'Backlog', icon: Circle, color: 'text-zinc-500', headerBg: 'bg-zinc-50 dark:bg-zinc-500/10' },
  { key: 'todo', label: 'To Do', icon: CircleDot, color: 'text-sky-500', headerBg: 'bg-sky-50 dark:bg-sky-500/10' },
  { key: 'in-progress', label: 'In Progress', icon: Loader2, color: 'text-blue-500', headerBg: 'bg-blue-50 dark:bg-blue-500/10' },
  { key: 'review', label: 'Review', icon: Eye, color: 'text-amber-500', headerBg: 'bg-amber-50 dark:bg-amber-500/10' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500', headerBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { key: 'blocked', label: 'Blocked', icon: Ban, color: 'text-red-500', headerBg: 'bg-red-50 dark:bg-red-500/10' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getDueDateColor(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'text-red-500 dark:text-red-400';
  if (daysLeft <= 3) return 'text-amber-500 dark:text-amber-400';
  return 'text-[var(--ops-text-muted)]';
}

// ─── Component ────────────────────────────────────────────
interface TaskBoardProps {
  tasks: ErpTask[];
  onTaskClick?: (id: string) => void;
}

export default function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const groupedTasks = useMemo(() => {
    const map: Record<TaskStage, ErpTask[]> = {
      backlog: [],
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
      blocked: [],
    };
    tasks.forEach((task) => {
      map[task.stage].push(task);
    });
    return map;
  }, [tasks]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-2">
        {stages.map((stage, stageIndex) => {
          const stageTasks = groupedTasks[stage.key];
          const isBlockedColumn = stage.key === 'blocked';
          const StageIcon = stage.icon;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: stageIndex * 0.05 }}
              className={cn(
                'w-[280px] flex-shrink-0 rounded-2xl border flex flex-col',
                isBlockedColumn
                  ? 'bg-red-50/50 dark:bg-red-500/[0.03] border-red-200/50 dark:border-red-500/[0.1]'
                  : 'bg-[var(--ops-card-bg)] border-[var(--ops-border)]'
              )}
              style={{ maxHeight: '600px' }}
            >
              {/* Column Header */}
              <div
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-t-2xl border-b',
                  `${stage.headerBg} border-[var(--ops-border)]`
                )}
              >
                <div className="flex items-center gap-2">
                  <StageIcon className={cn('w-4 h-4', stage.color)} />
                  <span className="text-xs font-semibold">{stage.label}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'h-5 min-w-[20px] px-1.5 text-[10px] font-bold rounded-full',
                    'bg-[var(--ops-elevated)] text-[var(--ops-text-secondary)]'
                  )}
                >
                  {stageTasks.length}
                </Badge>
              </div>

              {/* Task Cards */}
              <ScrollArea className="flex-1 px-2 py-2">
                <div className="flex flex-col gap-2">
                  {stageTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl text-center text-[var(--ops-text-disabled)]">
                      <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center bg-[var(--ops-hover-bg)]">
                        <StageIcon className="w-4 h-4" />
                      </div>
                      <p className="text-[11px]">No tasks</p>
                    </div>
                  )}
                  {stageTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: taskIndex * 0.03 }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onTaskClick?.(task.id)}
                      className={cn(
                        'p-3 rounded-xl border cursor-pointer transition-colors duration-150 shadow-sm',
                        'bg-[var(--ops-card-bg)] border-[var(--ops-border)] hover:bg-[var(--ops-hover-bg)] hover:border-[var(--ops-border-strong)]'
                      )}
                    >
                      {/* Task Title */}
                      <h4 className="text-xs font-medium mb-2 line-clamp-2 leading-relaxed">
                        {task.title}
                      </h4>

                      {/* Bottom row: assignee, due, points, blocked */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {/* Assignee Initial */}
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                              'bg-[var(--ops-elevated)] text-[var(--ops-text-secondary)]'
                            )}
                          >
                            {getInitials(task.assignee)}
                          </div>
                          <span className="text-[10px] text-[var(--ops-text-muted)]">
                            {task.assignee.split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Story Points */}
                          {task.storyPoints > 0 && (
                            <span className={cn(
                              'inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium',
                              'bg-[var(--ops-hover-bg)] text-[var(--ops-text-muted)]'
                            )}>
                              SP {task.storyPoints}
                            </span>
                          )}

                          {/* Blocked Indicator */}
                          {task.isBlocked && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          )}

                          {/* Due Date */}
                          <div className="flex items-center gap-0.5">
                            <Calendar className={cn('w-2.5 h-2.5', getDueDateColor(task.dueDate))} />
                            <span className={cn('text-[10px]', getDueDateColor(task.dueDate))}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SLA Deadline */}
                      {task.slaDeadline && task.stage !== 'done' && (
                        <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-[var(--ops-border)]">
                          <Timer className="w-2.5 h-2.5 text-amber-600/60 dark:text-amber-400/60" />
                          <span className="text-[9px] text-[var(--ops-text-disabled)]">
                            SLA: {formatDate(task.slaDeadline)}
                          </span>
                        </div>
                      )}

                      {/* Dependencies */}
                      {task.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] text-[var(--ops-text-disabled)]">
                            {task.dependencies.length} dep{task.dependencies.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Recurring indicator */}
                      {task.recurringTemplate && (
                        <div className="mt-1.5">
                          <span className={cn(
                            'inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium',
                            'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          )}>
                            🔄 {task.recurringTemplate}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
