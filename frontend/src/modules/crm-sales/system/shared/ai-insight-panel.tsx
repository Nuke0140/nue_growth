'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AiInsight } from '@/modules/crm-sales/system/types';

interface AiInsightPanelProps {
  insight: AiInsight;
  index?: number;
}

function formatScore(insight: AiInsight): string {
  if (insight.score === undefined) return '—';
  if (insight.type === 'ltv_forecast' || insight.type === 'upsell') {
    const value = insight.score;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }
  return `${insight.score}%`;
}

export default function AiInsightPanel({ insight, index = 0 }: AiInsightPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);
  const isHighConfidence = insight.confidence > 85;

  const typeColors: Record<string, string> = {
    buying_intent: 'from-emerald-500/10 to-emerald-500/5',
    churn_prediction: 'from-red-500/10 to-red-500/5',
    ltv_forecast: 'from-blue-500/10 to-blue-500/5',
    upsell: 'from-amber-500/10 to-amber-500/5',
    next_action: 'from-purple-500/10 to-purple-500/5',
    response_probability: 'from-cyan-500/10 to-cyan-500/5',
    health: 'from-orange-500/10 to-orange-500/5',
    relationship: 'from-pink-500/10 to-pink-500/5',
  };

  const confidenceColor = insight.confidence >= 85
    ? 'text-emerald-400'
    : insight.confidence >= 70
      ? 'text-amber-400'
      : 'text-orange-400';

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
      {/* Gradient background on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none',
        isDark ? typeColors[insight.type] || 'from-white/5 to-white/0' : 'from-black/[0.02] to-transparent'
      )} />

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

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl mt-0.5">{insight.icon || '💡'}</span>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-sm font-semibold mb-1 leading-tight',
              'text-[var(--app-text)]'
            )}>
              {insight.title}
            </h3>
            <p className={cn(
              'text-xs leading-relaxed line-clamp-2',
              'text-[var(--app-text-secondary)]'
            )}>
              {insight.description}
            </p>
          </div>
          {/* Score */}
          <div className={cn(
            'shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold',
            isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.04] text-black'
          )}>
            {formatScore(insight)}
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className={cn('text-[11px] font-medium', 'text-[var(--app-text-muted)]')}>
              Confidence
            </span>
            <span className={cn('text-[11px] font-bold', confidenceColor)}>
              {insight.confidence}%
            </span>
          </div>
          <Progress
            value={insight.confidence}
            className={cn(
              'h-1.5 rounded-full',
              'bg-[var(--app-hover-bg)]'
            )}
          />
        </div>

        {/* Contact Link + Action */}
        <div className="flex items-center justify-between gap-2">
          {insight.contactName && (
            <button
              onClick={() => insight.contactId && selectContact(insight.contactId)}
              className={cn(
                'text-xs font-medium truncate transition-colors',
                insight.contactId
                  ? isDark
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-500'
                  : isDark
                    ? 'text-white/40'
                    : 'text-black/40'
              )}
            >
              {insight.contactName}
            </button>
          )}
          {insight.actionText && (
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
              {insight.actionText}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
