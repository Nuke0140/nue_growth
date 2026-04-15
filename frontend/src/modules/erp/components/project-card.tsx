'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Activity,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { ErpProject, ProjectHealth, ProjectPriority } from '../types';

// ─── Health Configuration ─────────────────────────────────
const healthConfig: Record<ProjectHealth, { label: string; color: string; bgDark: string; bgLight: string; borderDark: string; borderLight: string }> = {
  excellent: {
    label: 'Excellent',
    color: 'text-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    borderDark: 'border-emerald-500/20',
    borderLight: 'border-emerald-200',
  },
  good: {
    label: 'Good',
    color: 'text-blue-500',
    bgDark: 'bg-blue-500/15',
    bgLight: 'bg-blue-50',
    borderDark: 'border-blue-500/20',
    borderLight: 'border-blue-200',
  },
  'at-risk': {
    label: 'At Risk',
    color: 'text-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    borderDark: 'border-amber-500/20',
    borderLight: 'border-amber-200',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    borderDark: 'border-red-500/20',
    borderLight: 'border-red-200',
  },
};

// ─── Priority Configuration ───────────────────────────────
const priorityConfig: Record<ProjectPriority, { label: string; color: string; bgDark: string; bgLight: string; borderDark: string; borderLight: string }> = {
  low: {
    label: 'Low',
    color: 'text-zinc-500',
    bgDark: 'bg-zinc-500/15',
    bgLight: 'bg-zinc-100',
    borderDark: 'border-zinc-500/20',
    borderLight: 'border-zinc-300',
  },
  medium: {
    label: 'Medium',
    color: 'text-sky-500',
    bgDark: 'bg-sky-500/15',
    bgLight: 'bg-sky-50',
    borderDark: 'border-sky-500/20',
    borderLight: 'border-sky-200',
  },
  high: {
    label: 'High',
    color: 'text-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    borderDark: 'border-amber-500/20',
    borderLight: 'border-amber-200',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    borderDark: 'border-red-500/20',
    borderLight: 'border-red-200',
  },
};

function getProfitabilityColor(value: number, isDark: boolean) {
  if (value > 30) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (value >= 15) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
}

function getProfitabilityBarColor(value: number) {
  if (value > 30) return 'bg-emerald-500';
  if (value >= 15) return 'bg-amber-500';
  return 'bg-red-500';
}

function formatCurrency(value: number) {
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getProgressColor(value: number) {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 50) return 'bg-blue-500';
  if (value >= 25) return 'bg-amber-500';
  return 'bg-red-500';
}

// ─── Component ────────────────────────────────────────────
interface ProjectCardProps {
  project: ErpProject;
  onClick?: (id: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const health = healthConfig[project.health];
  const priority = priorityConfig[project.priority];
  const budgetUsed = Math.round((project.actualSpend / project.budget) * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick?.(project.id)}
      className={cn(
        'relative rounded-2xl border p-5 cursor-pointer transition-colors duration-200 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.02] hover:border-black/[0.1]'
      )}
    >
      {/* Header: Name + Priority + Health */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate mb-1">{project.name}</h3>
          <p className={cn('text-xs truncate', isDark ? 'text-white/50' : 'text-black/50')}>
            {project.client}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border',
              isDark ? `${priority.bgDark} ${priority.color} ${priority.borderDark}` : `${priority.bgLight} ${priority.color} ${priority.borderLight}`
            )}
          >
            {priority.label}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border',
              isDark ? `${health.bgDark} ${health.color} ${health.borderDark}` : `${health.bgLight} ${health.color} ${health.borderLight}`
            )}
          >
            <Activity className="w-2.5 h-2.5 mr-0.5" />
            {health.label}
          </span>
        </div>
      </div>

      {/* Account Manager */}
      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-3 h-3 shrink-0" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
        <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
          {project.accountManager}
        </span>
      </div>

      {/* Budget / Spend */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
          <span className={cn('text-[11px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
            Budget
          </span>
        </div>
        <span className={cn('text-[11px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
          {formatCurrency(project.actualSpend)} / {formatCurrency(project.budget)}
        </span>
      </div>
      <div className="mb-3">
        <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
            {budgetUsed}% used
          </span>
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
            {project.isRecurring && '🔄 Recurring'}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className={cn('text-[11px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
          Progress
        </span>
        <span className={cn('text-[11px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
          {project.progress}%
        </span>
      </div>
      <div className={cn('h-1.5 rounded-full overflow-hidden mb-3', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', getProgressColor(project.progress))}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      {/* Profitability + Due Date */}
      <div
        className={cn(
          'flex items-center justify-between pt-3 border-t',
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}
      >
        <div className="flex items-center gap-1.5">
          {project.profitability >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span className={cn('text-xs font-semibold', getProfitabilityColor(project.profitability, isDark))}>
            {project.profitability > 0 ? '+' : ''}{project.profitability}% margin
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
          <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>
            {formatDate(project.dueDate)}
          </span>
        </div>
      </div>

      {/* SLA */}
      <div className="mt-2 flex items-center justify-between">
        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
          SLA Compliance
        </span>
        <span className={cn(
          'text-[10px] font-medium',
          project.sla >= 95 ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
            : project.sla >= 85 ? (isDark ? 'text-amber-400' : 'text-amber-600')
            : (isDark ? 'text-red-400' : 'text-red-600')
        )}>
          {project.sla}%
        </span>
      </div>
    </motion.div>
  );
}
