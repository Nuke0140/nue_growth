'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  User,
  FolderOpen,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee, EmployeeStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<EmployeeStatus, { label: string; color: string; bg: string; border: string }> = {
  active: {
    label: 'Active',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  'on-leave': {
    label: 'On Leave',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  'notice-period': {
    label: 'Notice Period',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    border: 'border-red-200 dark:border-red-500/20',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-500/15',
    border: 'border-zinc-300 dark:border-zinc-500/20',
  },
  probation: {
    label: 'Probation',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    'bg-sky-500/20 text-sky-400 border-sky-500/20',
    'bg-amber-500/20 text-amber-400 border-amber-500/20',
    'bg-rose-500/20 text-rose-400 border-rose-500/20',
    'bg-violet-500/20 text-violet-400 border-violet-500/20',
    'bg-teal-500/20 text-teal-400 border-teal-500/20',
    'bg-pink-500/20 text-pink-400 border-pink-500/20',
    'bg-orange-500/20 text-orange-400 border-orange-500/20',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function getScoreBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

// ─── Component ────────────────────────────────────────────
interface EmployeeCardProps {
  employee: Employee;
  onClick?: (id: string) => void;
}

export default function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const status = statusConfig[employee.status];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick?.(employee.id)}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl cursor-pointer transition-colors duration-200 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-hover-bg)] hover:border-[var(--app-border-strong)]'
      )}
    >
      {/* Top: Avatar + Name + Designation */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border shrink-0',
          getAvatarColor(employee.name)
        )}>
          {getInitials(employee.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{employee.name}</h3>
          <p className="text-xs truncate mb-1 text-[var(--app-text-secondary)]">
            {employee.designation}
          </p>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium border',
              `${status.bg} ${status.color} ${status.border}`
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Department Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <Briefcase className="w-4 h-4 text-[var(--app-text-muted)]" />
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium',
          'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
        )}>
          {employee.department}
        </span>
      </div>

      {/* Manager */}
      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-4 h-4 text-[var(--app-text-muted)]" />
        <span className="text-[11px] text-[var(--app-text-muted)]">
          Reports to: <span className="font-medium">{employee.manager}</span>
        </span>
      </div>

      {/* Productivity Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[var(--app-text-muted)]" />
            <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
              Productivity
            </span>
          </div>
          <span className={cn('text-[11px] font-bold', getScoreColor(employee.productivityScore))}>
            {employee.productivityScore}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
          <motion.div
            className={cn('h-full rounded-full transition-colors duration-200', getScoreBarColor(employee.productivityScore))}
            initial={{ width: 0 }}
            animate={{ width: `${employee.productivityScore}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active Projects */}
      <div className="flex items-center gap-1.5 mb-3">
        <FolderOpen className="w-4 h-4 text-[var(--app-text-muted)]" />
        <span className="text-[11px] text-[var(--app-text-muted)]">
          <span className="font-semibold">{employee.activeProjects}</span> active project{employee.activeProjects !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Footer info */}
      <div
        className={cn(
          'pt-2 border-t space-y-1',
          'border-[var(--app-border)]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--app-text-disabled)]">Joined</span>
          <span className="text-[10px] font-medium text-[var(--app-text-muted)]">
            {new Date(employee.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--app-text-disabled)]">Band</span>
          <span className="text-[10px] font-medium text-[var(--app-text-muted)]">
            {employee.salaryBand}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
