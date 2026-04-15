'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  User,
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
const promotionConfig: Record<PromotionReadiness, { label: string; color: string; bgDark: string; bgLight: string; borderDark: string; borderLight: string; pulse?: boolean }> = {
  'not-ready': {
    label: 'Not Ready',
    color: 'text-zinc-500',
    bgDark: 'bg-zinc-500/15',
    bgLight: 'bg-zinc-100',
    borderDark: 'border-zinc-500/20',
    borderLight: 'border-zinc-300',
  },
  developing: {
    label: 'Developing',
    color: 'text-amber-500',
    bgDark: 'bg-amber-500/15',
    bgLight: 'bg-amber-50',
    borderDark: 'border-amber-500/20',
    borderLight: 'border-amber-200',
  },
  ready: {
    label: 'Ready',
    color: 'text-emerald-500',
    bgDark: 'bg-emerald-500/15',
    bgLight: 'bg-emerald-50',
    borderDark: 'border-emerald-500/20',
    borderLight: 'border-emerald-200',
  },
  overdue: {
    label: 'Overdue',
    color: 'text-red-500',
    bgDark: 'bg-red-500/15',
    bgLight: 'bg-red-50',
    borderDark: 'border-red-500/20',
    borderLight: 'border-red-200',
    pulse: true,
  },
};

function getScoreColor(score: number, isDark: boolean) {
  if (score >= 80) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (score >= 60) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
}

function getScoreBarColor(score: number) {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-red-500';
}

function getScoreBgColor(score: number, isDark: boolean) {
  if (score >= 80) return isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]';
  return isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]';
}

// ─── Circular Progress Component ──────────────────────────
function CircularProgress({ value, size = 56, strokeWidth = 4, isDark }: { value: number; size?: number; strokeWidth?: number; isDark: boolean }) {
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
          className={getScoreBgColor(value, isDark)}
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
        <span className={cn('text-xs font-bold', getScoreColor(value, isDark))}>
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
        'rounded-2xl border p-5 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Header: Employee + Period */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold',
            isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.08] text-black/70'
          )}>
            {employeeName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{employeeName}</h3>
            <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
              {review.period}
            </p>
          </div>
        </div>
        <motion.span
          animate={isOverdue ? { scale: [1, 1.05, 1] } : {}}
          transition={isOverdue ? { duration: 1.5, repeat: Infinity } : {}}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border',
            isDark ? `${promotion.bgDark} ${promotion.color} ${promotion.borderDark}` : `${promotion.bgLight} ${promotion.color} ${promotion.borderLight}`
          )}
        >
          <Award className="w-3 h-3" />
          {promotion.label}
        </motion.span>
      </div>

      {/* Main Score Circle */}
      <div className="flex items-center justify-center mb-4">
        <CircularProgress value={overallScore} size={72} strokeWidth={5} isDark={isDark} />
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
                  <Icon className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
                  <span className={cn('text-[11px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
                    {metric.label}
                  </span>
                </div>
                <span className={cn('text-[11px] font-bold', getScoreColor(metric.value, isDark))}>
                  {metric.value}%
                </span>
              </div>
              <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                <motion.div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
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
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}
      >
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
          <span className={cn('text-[10px] font-medium', getScoreColor(overallScore, isDark))}>
            Overall: {overallScore}%
          </span>
        </div>
        <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
          ID: {review.employeeId}
        </span>
      </div>
    </motion.div>
  );
}
