'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, GripVertical, Clock, GitBranch, AlertTriangle,
  Calendar, User, Star, Timer, Link2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockTasks, mockProjects } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { TaskStage } from '@/modules/erp/types';

type ColumnKey = TaskStage;

const columns: { key: ColumnKey; label: string; color: string; dotColor: string }[] = [
  { key: 'backlog', label: 'Backlog', color: 'bg-zinc-500', dotColor: 'text-zinc-400' },
  { key: 'todo', label: 'To Do', color: 'bg-sky-500', dotColor: 'text-sky-400' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500', dotColor: 'text-blue-400' },
  { key: 'review', label: 'Review', color: 'bg-violet-500', dotColor: 'text-violet-400' },
  { key: 'done', label: 'Delivered', color: 'bg-emerald-500', dotColor: 'text-emerald-400' },
  { key: 'blocked', label: 'Blocked', color: 'bg-red-500', dotColor: 'text-red-400' },
];

function getProjectName(projectId: string): string {
  const p = mockProjects.find(pr => pr.id === projectId);
  return p ? p.name.split(' ').slice(0, 2).join(' ') : '';
}

export default function TasksBoardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return mockTasks;
    const q = searchQuery.toLowerCase();
    return mockTasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q) ||
      getProjectName(t.projectId).toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const tasksByStage = useMemo(() => {
    const grouped: Record<TaskStage, typeof mockTasks> = {
      'backlog': [], 'todo': [], 'in-progress': [], 'review': [], 'done': [], 'blocked': [],
    };
    filtered.forEach(t => { grouped[t.stage].push(t); });
    return grouped;
  }, [filtered]);

  const totalTasks = filtered.length;
  const inProgress = filtered.filter(t => t.stage === 'in-progress').length;
  const blocked = filtered.filter(t => t.stage === 'blocked').length;
  const completed = filtered.filter(t => t.stage === 'done').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: GitBranch },
    { label: 'In Progress', value: inProgress, icon: Clock },
    { label: 'Blocked', value: blocked, icon: AlertTriangle },
    { label: 'Completed', value: completed, icon: CheckCircle2 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Tasks Board</h1>
            <Badge variant="secondary" className={cn('text-xs font-medium', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
              {totalTasks} tasks
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className={cn('h-9 w-9 rounded-xl shrink-0', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Create Task</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
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
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {columns.map((col, colIdx) => {
            const tasks = tasksByStage[col.key];
            const isBlockedColumn = col.key === 'blocked';
            return (
              <motion.div
                key={col.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + colIdx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-[280px] w-[280px] shrink-0 flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={cn('w-2.5 h-2.5 rounded-full', col.color)} />
                  <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>{col.label}</span>
                  <Badge variant="secondary" className={cn(
                    'ml-auto text-[10px] font-bold min-w-[20px] justify-center',
                    isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40'
                  )}>
                    {tasks.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className={cn(
                  'rounded-2xl border flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-340px)]',
                  isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]'
                )}>
                  {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-24">
                      <p className={cn('text-[10px]', isDark ? 'text-white/15' : 'text-black/15')}>No tasks</p>
                    </div>
                  )}
                  {tasks.map((task, taskIdx) => {
                    const projectName = getProjectName(task.projectId);
                    const isOverdue = new Date(task.dueDate) < new Date() && task.stage !== 'done';
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + taskIdx * 0.04 }}
                        className={cn(
                          'rounded-xl border p-3 space-y-2.5 cursor-pointer transition-all duration-200 group relative',
                          isDark
                            ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                            : 'bg-white border-black/[0.06] hover:bg-black/[0.02]',
                          isBlockedColumn && task.isBlocked && 'border-red-500/30'
                        )}
                      >
                        {/* Pulsing border for blocked */}
                        {task.isBlocked && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-red-500/40 pointer-events-none"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}

                        {/* Drag Handle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity', isDark ? 'text-white' : 'text-black')} />
                            {task.isBlocked && (
                              <Badge className={cn('text-[9px] font-bold border', isDark ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200')}>
                                <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />Blocked
                              </Badge>
                            )}
                          </div>
                          <Badge className={cn('text-[9px] font-bold px-1.5', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                            {task.storyPoints} pts
                          </Badge>
                        </div>

                        {/* Title */}
                        <p className="text-sm font-medium leading-snug">{task.title}</p>

                        {/* Project Tag */}
                        {projectName && (
                          <p className={cn('text-[10px] truncate', isDark ? 'text-white/25' : 'text-black/25')}>
                            {projectName}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[8px] font-semibold bg-sky-500/15 text-sky-400">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                              {task.assignee.split(' ')[0]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.dependencies.length > 0 && (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center gap-0.5">
                                      <Link2 className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
                                      <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{task.dependencies.length}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent><p>{task.dependencies.length} dependencies</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <div className={cn('flex items-center gap-0.5', isOverdue ? 'text-red-400' : (isDark ? 'text-white/25' : 'text-black/25'))}>
                              <Calendar className="w-3 h-3" />
                              <span className="text-[9px]">
                                {new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            {task.timeLogged > 0 && (
                              <div className={cn('flex items-center gap-0.5', isDark ? 'text-white/20' : 'text-black/20')}>
                                <Timer className="w-3 h-3" />
                                <span className="text-[9px]">{task.timeLogged}h</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
