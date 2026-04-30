'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function AiSalesInsight({
  title,
  description,
  score,
  confidence,
  icon,
  actionText,
  contactName,
  index = 0,
}: {
  title: string;
  description: string;
  score?: number;
  confidence?: number;
  icon?: string;
  actionText?: string;
  contactName?: string;
  index?: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isHighConfidence = confidence !== undefined && confidence > 85;

  const confidenceColor = confidence !== undefined
    ? confidence >= 85
      ? 'text-emerald-400'
      : confidence >= 70
        ? 'text-amber-400'
        : 'text-orange-400'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-2xl p-6 transition-all duration-300 group cursor-default',
        isDark
          ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
          : 'bg-white border border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.02] shadow-sm',
        isHighConfidence && isDark && 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.15)]',
        isHighConfidence && !isDark && 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.1)]',
      )}
    >
      {/* Glow animation for high confidence */}
      {isHighConfidence && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(16,185,129,0)',
              '0 0 20px -4px rgba(16,185,129,0.15)',
              '0 0 0 0 rgba(16,185,129,0)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Gradient border on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none',
        isDark ? 'from-emerald-500/10 via-transparent to-transparent' : 'from-emerald-500/5 via-transparent to-transparent'
      )} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl mt-0.5">{icon || '💡'}</span>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-sm font-semibold mb-1 leading-tight',
              'text-[var(--app-text)]'
            )}>
              {title}
            </h3>
            <p className={cn(
              'text-xs leading-relaxed line-clamp-2',
              'text-[var(--app-text-secondary)]'
            )}>
              {description}
            </p>
          </div>
          {score !== undefined && (
            <div className={cn(
              'shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold',
              isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.04] text-black'
            )}>
              {score}%
            </div>
          )}
        </div>

        {/* Confidence Bar */}
        {confidence !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn('text-[11px] font-medium', 'text-[var(--app-text-muted)]')}>
                Confidence
              </span>
              <span className={cn('text-[11px] font-bold', confidenceColor)}>
                {confidence}%
              </span>
            </div>
            <Progress
              value={confidence}
              className={cn(
                'h-1.5 rounded-full',
                'bg-[var(--app-hover-bg)]'
              )}
            />
          </div>
        )}

        {/* Contact + Action */}
        <div className="flex items-center justify-between gap-2">
          {contactName && (
            <span className={cn(
              'text-xs font-medium truncate',
              isDark ? 'text-purple-400/70' : 'text-purple-600/70'
            )}>
              {contactName}
            </span>
          )}
          {actionText && (
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'text-xs h-7 px-3 rounded-lg shrink-0',
                isDark
                  ? 'border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.06]'
                  : 'border-black/[0.08] text-black/70 hover:text-black hover:bg-black/[0.04]'
              )}
            >
              {actionText}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
