'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, CheckCircle2, Circle, Clock, AlertTriangle, Users,
  ClipboardList, Laptop, GraduationCap, FileText, UserPlus, UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockOnboardingTasks, mockEmployees } from '@/modules/erp/data/mock-data';
import type { OnboardingCategory } from '@/modules/erp/types';

const categoryConfig: Record<OnboardingCategory, { label: string; icon: React.ElementType; color: string }> = {
  hr: { label: 'HR', icon: Users, color: 'bg-purple-500' },
  it: { label: 'IT', icon: Laptop, color: 'bg-blue-500' },
  department: { label: 'Department', icon: UserPlus, color: 'bg-emerald-500' },
  training: { label: 'Training', icon: GraduationCap, color: 'bg-amber-500' },
  documentation: { label: 'Documentation', icon: FileText, color: 'bg-teal-500' },
};

function OnboardingPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Group tasks by employee
  const employeeGroups = useMemo(() => {
    const empIds = [...new Set(mockOnboardingTasks.map(t => t.employeeId))];
    return empIds.map(eid => {
      const emp = mockEmployees.find(e => e.id === eid);
      const tasks = mockOnboardingTasks.filter(t => t.employeeId === eid);
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        employeeId: eid,
        employee: emp,
        tasks,
        completed,
        total,
        percent,
      };
    });
  }, []);

  const stats = useMemo(() => {
    const totalTasks = mockOnboardingTasks.length;
    const completed = mockOnboardingTasks.filter(t => t.completed).length;
    const pending = totalTasks - completed;
    const avgCompletion = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    const completedToday = mockOnboardingTasks.filter(t => t.completed).length; // simulated
    return {
      activeOnboarding: employeeGroups.length,
      completedToday: 2,
      pendingTasks: pending,
      avgCompletion,
    };
  }, [employeeGroups]);

  return (
    <PageShell title="Onboarding" icon={UserCog}>
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className={cn('h-9 rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                  <Plus className="w-4 h-4" /> New Hire
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Start onboarding for a new hire</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Onboarding', value: stats.activeOnboarding, icon: Users, color: 'text-purple-400' },
            { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400' },
            { label: 'Pending Tasks', value: stats.pendingTasks, icon: ClipboardList, color: 'text-amber-500 dark:text-amber-400' },
            { label: 'Avg Completion', value: `${stats.avgCompletion}%`, icon: Clock, color: 'text-blue-400' },
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

        {/* Onboarding Cards */}
        <div className="space-y-6">
          {employeeGroups.map((group, gIdx) => {
            const emp = group.employee;
            if (!emp) return null;

            // Group tasks by category
            const categories = [...new Set(group.tasks.map(t => t.category))] as OnboardingCategory[];

            return (
              <motion.div
                key={group.employeeId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
              >
                {/* Employee Header + Progress */}
                <div className={cn('p-5 border-b', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={cn('text-sm font-semibold', isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60')}>
                          {emp.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-bold">{emp.name}</h3>
                        <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{emp.designation} · {emp.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className={cn('flex-1 h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${group.percent}%` }}
                            transition={{ delay: gIdx * 0.08 + 0.2, duration: 0.6 }}
                            className={cn('h-full rounded-full', group.percent >= 80 ? 'bg-emerald-500' : group.percent >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                        <span className={cn('text-sm font-bold min-w-[42px] text-right', group.percent >= 80 ? 'text-emerald-500 dark:text-emerald-400' : group.percent >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400')}>
                          {group.percent}%
                        </span>
                      </div>
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {group.completed}/{group.total} tasks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Categories */}
                <div className="p-5">
                  <div className="space-y-5">
                    {categories.map((cat) => {
                      const config = categoryConfig[cat];
                      const catTasks = group.tasks.filter(t => t.category === cat);
                      const catCompleted = catTasks.filter(t => t.completed).length;
                      const CatIcon = config.icon;

                      return (
                        <div key={cat}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', config.color)}>
                              <CatIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-semibold">{config.label}</span>
                            <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                              {catCompleted}/{catTasks.length}
                            </span>
                          </div>
                          <div className="space-y-1.5 ml-8">
                            {catTasks.map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                                  isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                                )}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/15' : 'text-black/15')} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    'text-sm',
                                    task.completed
                                      ? (isDark ? 'text-white/40 line-through' : 'text-black/40 line-through')
                                      : (isDark ? 'text-white/70' : 'text-black/70')
                                  )}>
                                    {task.task}
                                  </p>
                                </div>
                                <span className={cn('text-[11px] shrink-0 hidden sm:block', isDark ? 'text-white/25' : 'text-black/25')}>
                                  Due: {task.dueDate}
                                </span>
                                <span className={cn('text-[10px] shrink-0 hidden md:block', isDark ? 'text-white/20' : 'text-black/20')}>
                                  {task.assignedBy}
                                </span>
                                {!task.completed && new Date(task.dueDate) < new Date('2026-04-12') && (
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

export default memo(OnboardingPageInner);
