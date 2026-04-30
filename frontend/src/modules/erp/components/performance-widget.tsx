'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Target,
  CheckCircle2,
  MessageSquare,
  Award,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PerformanceReview, PromotionReadiness } from '../types';

// ─── Promotion Readiness Configuration ────────────────────
const promotionConfig: Record<PromotionReadiness, { label: string; color: string; bg: string; border: string; pulse?: boolean }> = {
  'not-ready': {
    label: 'Not Ready',
    color: 'text-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-500/15',
    border: 'border-zinc-300 dark:border-zinc-500/20',
  },
  developing: {
    label: 'Developing',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
  },
  ready: {
    label: 'Ready',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
  },
  overdue: {
    label: 'Overdue',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/15',
    border: 'border-red-200 dark:border-red-500/20',
    pulse: true,
  },
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function getScoreBarColor(score: number) {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-red-500';
}

// ─── Circular Progress Component ──────────────────────────
function CircularProgress({ value, size = 56, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-[var(--app-hover-bg)]"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={getScoreBarColor(value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-xs font-bold', getScoreColor(value))}>
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────
interface PerformanceWidgetProps {
  review: PerformanceReview;
  employeeName: string;
}

export default function PerformanceWidget({ review, employeeName }: PerformanceWidgetProps) {
  const promotion = promotionConfig[review.promotionReadiness];
  const isOverdue = review.promotionReadiness === 'overdue';

  const overallScore = useMemo(() => {
    return Math.round(
      (review.kpiScore * 0.35 +
        review.slaScore * 0.2 +
        review.taskCompletion * 0.25 +
        review.clientFeedback * 0.2)
    );
  }, [review.kpiScore, review.slaScore, review.taskCompletion, review.clientFeedback]);

  const metrics = [
    { label: 'KPI Score', value: review.kpiScore, icon: Target },
    { label: 'SLA Score', value: review.slaScore, icon: CheckCircle2 },
    { label: 'Task Completion', value: review.taskCompletion, icon: TrendingUp },
    { label: 'Client Feedback', value: review.clientFeedback, icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header: Employee + Period */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-9 h-10  rounded-full flex items-center justify-center text-xs font-bold',
            'bg-[var(--app-elevated)] text-[var(--app-text)]'
          )}>
            {employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{employeeName}</h3>
            <p className="text-[10px] text-[var(--app-text-muted)]">
              {review.period}
            </p>
          </div>
        </div>
        <motion.span
          animate={isOverdue ? { scale: [1, 1.05, 1] } : {}}
          transition={isOverdue ? { duration: 1.5, repeat: Infinity } : {}}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--app-radius-lg)] text-[10px] font-medium border',
            `${promotion.bg} ${promotion.color} ${promotion.border}`
          )}
        >
          <Award className="w-4 h-4" />
          {promotion.label}
        </motion.span>
      </div>

      {/* Main Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <CircularProgress value={overallScore} size={72} strokeWidth={5} />
      </div>

      {/* Metric Bars */}
      <div className="space-y-2.5">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-[var(--app-text-muted)]" />
                  <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
                    {metric.label}
                  </span>
                </div>
                <span className={cn('text-[11px] font-bold', getScoreColor(metric.value))}>
                  {metric.value}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                <motion.div
                  className={cn(
                    'h-full rounded-full transition-colors duration-200',
                    metric.value >= 80 ? 'bg-emerald-500'
                      : metric.value >= 60 ? 'bg-amber-500'
                      : 'bg-red-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className={cn(
          'mt-4 pt-3 border-t flex items-center justify-between',
          'border-[var(--app-border)]'
        )}
      >
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-[var(--app-text-disabled)]" />
          <span className={cn('text-[10px] font-medium', getScoreColor(overallScore))}>
            Overall: {overallScore}%
          </span>
        </div>
        <span className="text-[9px] text-[var(--app-text-disabled)]">
          ID: {review.employeeId}
        </span>
      </div>
    </motion.div>
  );
}
