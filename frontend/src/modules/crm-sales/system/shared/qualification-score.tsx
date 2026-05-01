'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { QualificationScore } from '@/modules/crm-sales/system/types';

function getScoreColor(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreTextColor(score: number, maxScore: number, isDark: boolean): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return 'text-[var(--app-success)]';
  if (pct >= 50) return 'text-[var(--app-warning)]';
  return 'text-[var(--app-danger)]';
}

export default function QualificationScoreDisplay({
  score,
  label,
  icon: Icon,
}: {
  score: QualificationScore;
  label: string;
  icon?: React.ElementType;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const percentage = Math.round((score.score / score.maxScore) * 100);
  const barColor = getScoreColor(score.score, score.maxScore);
  const textColor = getScoreTextColor(score.score, score.maxScore, isDark);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-lg)] p-4 border',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
      )}
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className={cn(
            'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
            'bg-[var(--app-hover-bg)]'
          )}>
            <Icon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
          </div>
        )}
        <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
          {label}
        </span>
        <span className={cn('ml-auto text-xs font-bold', textColor)}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', barColor)}
        />
      </div>

      {/* Score / Max */}
      <div className={cn('text-[10px] mt-1.5', 'text-[var(--app-text-muted)]')}>
        {score.score} / {score.maxScore}
      </div>

      {/* Notes */}
      {score.notes && (
        <p className={cn('text-[11px] mt-2 leading-relaxed', 'text-[var(--app-text-muted)]')}>
          {score.notes}
        </p>
      )}
    </motion.div>
  );
}
