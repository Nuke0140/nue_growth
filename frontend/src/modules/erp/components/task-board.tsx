'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
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
const stages: { key: TaskStage; label: string; icon: typeof CircleDot; color: string; headerBgDark: string; headerBgLight: string }[] = [
  { key: 'backlog', label: 'Backlog', icon: Circle, color: 'text-zinc-500', headerBgDark: 'bg-zinc-500/10', headerBgLight: 'bg-zinc-50' },
  { key: 'todo', label: 'To Do', icon: CircleDot, color: 'text-sky-500', headerBgDark: 'bg-sky-500/10', headerBgLight: 'bg-sky-50' },
  { key: 'in-progress', label: 'In Progress', icon: Loader2, color: 'text-blue-500', headerBgDark: 'bg-blue-500/10', headerBgLight: 'bg-blue-50' },
  { key: 'review', label: 'Review', icon: Eye, color: 'text-amber-500', headerBgDark: 'bg-amber-500/10', headerBgLight: 'bg-amber-50' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500', headerBgDark: 'bg-emerald-500/10', headerBgLight: 'bg-emerald-50' },
  { key: 'blocked', label: 'Blocked', icon: Ban, color: 'text-red-500', headerBgDark: 'bg-red-500/10', headerBgLight: 'bg-red-50' },
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

function getDueDateColor(dateStr: string, isDark: boolean) {
  const due = new Date(dateStr);
  const now = new Date();
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return isDark ? 'text-red-400' : 'text-red-600';
  if (daysLeft <= 3) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-white/40' : 'text-black/40';
}

// ─── Component ────────────────────────────────────────────
interface TaskBoardProps {
  tasks: ErpTask[];
  onTaskClick?: (id: string) => void;
}

export default function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
                  ? isDark
                    ? 'bg-red-500/[0.03] border-red-500/[0.1]'
                    : 'bg-red-50/50 border-red-200/50'
                  : isDark
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-white border-black/[0.06]'
              )}
              style={{ maxHeight: '600px' }}
            >
              {/* Column Header */}
              <div
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-t-2xl border-b',
                  isDark
                    ? `${stage.headerBgDark} border-white/[0.04]`
                    : `${stage.headerBgLight} border-black/[0.04]`
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
                    isDark
                      ? 'bg-white/[0.08] text-white/60'
                      : 'bg-black/[0.06] text-black/60'
                  )}
                >
                  {stageTasks.length}
                </Badge>
              </div>

              {/* Task Cards */}
              <ScrollArea className="flex-1 px-2 py-2">
                <div className="flex flex-col gap-2">
                  {stageTasks.length === 0 && (
                    <div className={cn(
                      'flex flex-col items-center justify-center py-8 px-4 rounded-xl text-center',
                      isDark ? 'text-white/20' : 'text-black/20'
                    )}>
                      <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center" style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
                      }}>
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
                        isDark
                          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                          : 'bg-white border-black/[0.06] hover:bg-black/[0.02] hover:border-black/[0.1]'
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
                              isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60'
                            )}
                          >
                            {getInitials(task.assignee)}
                          </div>
                          <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                            {task.assignee.split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Story Points */}
                          {task.storyPoints > 0 && (
                            <span className={cn(
                              'inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium',
                              isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40'
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
                            <Calendar className={cn('w-2.5 h-2.5', getDueDateColor(task.dueDate, isDark))} />
                            <span className={cn('text-[10px]', getDueDateColor(task.dueDate, isDark))}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SLA Deadline */}
                      {task.slaDeadline && task.stage !== 'done' && (
                        <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t" style={{
                          borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
                        }}>
                          <Timer className={cn('w-2.5 h-2.5', isDark ? 'text-amber-400/60' : 'text-amber-600/60')} />
                          <span className={cn('text-[9px]', isDark ? 'text-white/30' : 'text-black/30')}>
                            SLA: {formatDate(task.slaDeadline)}
                          </span>
                        </div>
                      )}

                      {/* Dependencies */}
                      {task.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
                            {task.dependencies.length} dep{task.dependencies.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Recurring indicator */}
                      {task.recurringTemplate && (
                        <div className="mt-1.5">
                          <span className={cn(
                            'inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium',
                            isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
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
