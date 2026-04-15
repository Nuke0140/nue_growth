'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Briefcase,
  User,
  FolderOpen,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee, EmployeeStatus } from '../types';

// ─── Status Configuration ─────────────────────────────────
const statusConfig: Record<EmployeeStatus, { label: string; color: string; bgDark: string; bgLight: string; borderDark: string; borderLight: string }> = {
  active: {
    label: 'Active',
    color: 'text-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    borderDark: 'border-emerald-500/20',
    borderLight: 'border-emerald-200',
  },
  'on-leave': {
    label: 'On Leave',
    color: 'text-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    borderDark: 'border-amber-500/20',
    borderLight: 'border-amber-200',
  },
  'notice-period': {
    label: 'Notice Period',
    color: 'text-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    borderDark: 'border-red-500/20',
    borderLight: 'border-red-200',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-zinc-500',
    bgDark: 'bg-zinc-500/15',
    bgLight: 'bg-zinc-100',
    borderDark: 'border-zinc-500/20',
    borderLight: 'border-zinc-300',
  },
  probation: {
    label: 'Probation',
    color: 'text-blue-500',
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    borderDark: 'border-blue-500/20',
    borderLight: 'border-blue-200',
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

function getScoreColor(score: number, isDark: boolean) {
  if (score >= 80) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (score >= 60) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const status = statusConfig[employee.status];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick?.(employee.id)}
      className={cn(
        'rounded-2xl border p-5 cursor-pointer transition-colors duration-200 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.02] hover:border-black/[0.1]'
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
          <p className={cn('text-xs truncate mb-1', isDark ? 'text-white/50' : 'text-black/50')}>
            {employee.designation}
          </p>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border',
              isDark ? `${status.bgDark} ${status.color} ${status.borderDark}` : `${status.bgLight} ${status.color} ${status.borderLight}`
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Department Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <Briefcase className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium',
          isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
        )}>
          {employee.department}
        </span>
      </div>

      {/* Manager */}
      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
        <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>
          Reports to: <span className="font-medium">{employee.manager}</span>
        </span>
      </div>

      {/* Productivity Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
            <span className={cn('text-[11px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
              Productivity
            </span>
          </div>
          <span className={cn('text-[11px] font-bold', getScoreColor(employee.productivityScore, isDark))}>
            {employee.productivityScore}%
          </span>
        </div>
        <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <motion.div
            className={cn('h-full rounded-full transition-all duration-500', getScoreBarColor(employee.productivityScore))}
            initial={{ width: 0 }}
            animate={{ width: `${employee.productivityScore}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Active Projects */}
      <div className="flex items-center gap-1.5 mb-3">
        <FolderOpen className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
        <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>
          <span className="font-semibold">{employee.activeProjects}</span> active project{employee.activeProjects !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Footer info */}
      <div
        className={cn(
          'pt-2 border-t space-y-1',
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Joined</span>
          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/35' : 'text-black/35')}>
            {new Date(employee.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Band</span>
          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/35' : 'text-black/35')}>
            {employee.salaryBand}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
