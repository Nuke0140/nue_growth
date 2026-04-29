'use client';

import { motion } from 'framer-motion';
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
const healthConfig: Record<ProjectHealth, { label: string; color: string; bg: string; border: string }> = {
  excellent: {
    label: 'Excellent',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  good: {
    label: 'Good',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
  },
  'at-risk': {
    label: 'At Risk',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    border: 'border-red-200 dark:border-red-500/20',
  },
};

// ─── Priority Configuration ───────────────────────────────
const priorityConfig: Record<ProjectPriority, { label: string; color: string; bg: string; border: string }> = {
  low: {
    label: 'Low',
    color: 'text-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-500/15',
    border: 'border-zinc-300 dark:border-zinc-500/20',
  },
  medium: {
    label: 'Medium',
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/15',
    border: 'border-sky-200 dark:border-sky-500/20',
  },
  high: {
    label: 'High',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    border: 'border-red-200 dark:border-red-500/20',
  },
};

function getProfitabilityColor(value: number) {
  if (value > 30) return 'text-emerald-500 dark:text-emerald-400';
  if (value >= 15) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
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
        'bg-[var(--ops-card-bg)] border-[var(--ops-border)] hover:bg-[var(--ops-hover-bg)] hover:border-[var(--ops-border-strong)]'
      )}
    >
      {/* Header: Name + Priority + Health */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate mb-1">{project.name}</h3>
          <p className="text-xs truncate text-[var(--ops-text-secondary)]">
            {project.client}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border',
              `${priority.bg} ${priority.color} ${priority.border}`
            )}
          >
            {priority.label}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border',
              `${health.bg} ${health.color} ${health.border}`
            )}
          >
            <Activity className="w-2.5 h-2.5 mr-0.5" />
            {health.label}
          </span>
        </div>
      </div>

      {/* Account Manager */}
      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-3 h-3 shrink-0 text-[var(--ops-text-muted)]" />
        <span className="text-xs text-[var(--ops-text-muted)]">
          {project.accountManager}
        </span>
      </div>

      {/* Budget / Spend */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3 text-[var(--ops-text-muted)]" />
          <span className="text-[11px] font-medium text-[var(--ops-text-secondary)]">
            Budget
          </span>
        </div>
        <span className="text-[11px] font-medium text-[var(--ops-text-secondary)]">
          {formatCurrency(project.actualSpend)} / {formatCurrency(project.budget)}
        </span>
      </div>
      <div className="mb-3">
        <div className="h-1.5 rounded-full overflow-hidden bg-[var(--ops-hover-bg)]">
          <div
            className={cn('h-full rounded-full transition-all duration-500', budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-[var(--ops-text-disabled)]">
            {budgetUsed}% used
          </span>
          <span className="text-[10px] text-[var(--ops-text-disabled)]">
            {project.isRecurring && '🔄 Recurring'}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-[var(--ops-text-secondary)]">
          Progress
        </span>
        <span className="text-[11px] font-medium text-[var(--ops-text-secondary)]">
          {project.progress}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-3 bg-[var(--ops-hover-bg)]">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getProgressColor(project.progress))}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      {/* Profitability + Due Date */}
      <div
        className={cn(
          'flex items-center justify-between pt-3 border-t',
          'border-[var(--ops-border)]'
        )}
      >
        <div className="flex items-center gap-1.5">
          {project.profitability >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span className={cn('text-xs font-semibold', getProfitabilityColor(project.profitability))}>
            {project.profitability > 0 ? '+' : ''}{project.profitability}% margin
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[var(--ops-text-muted)]" />
          <span className="text-[11px] text-[var(--ops-text-muted)]">
            {formatDate(project.dueDate)}
          </span>
        </div>
      </div>

      {/* SLA */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-[var(--ops-text-disabled)]">
          SLA Compliance
        </span>
        <span className={cn(
          'text-[10px] font-medium',
          project.sla >= 95 ? 'text-emerald-500 dark:text-emerald-400'
            : project.sla >= 85 ? 'text-amber-500 dark:text-amber-400'
            : 'text-red-500 dark:text-red-400'
        )}>
          {project.sla}%
        </span>
      </div>
    </motion.div>
  );
}
