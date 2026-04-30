'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sparkles, Lightbulb, PiggyBank, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function getImpactConfig(impact: string, isDark: boolean) {
  switch (impact.toLowerCase()) {
    case 'high':
      return {
        label: 'High Impact',
        bgDark: 'bg-red-500/15',
        bgLight: 'bg-red-50',
        textDark: 'text-red-400',
        textLight: 'text-red-600',
      };
    case 'medium':
      return {
        label: 'Medium Impact',
        bgDark: 'bg-amber-500/15',
        bgLight: 'bg-amber-50',
        textDark: 'text-amber-400',
        textLight: 'text-amber-600',
      };
    case 'low':
      return {
        label: 'Low Impact',
        bgDark: 'bg-emerald-500/15',
        bgLight: 'bg-emerald-50',
        textDark: 'text-emerald-400',
        textLight: 'text-emerald-600',
      };
    default:
      return {
        label: impact,
        bgDark: 'bg-violet-500/15',
        bgLight: 'bg-violet-50',
        textDark: 'text-violet-400',
        textLight: 'text-violet-600',
      };
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 80) return 'bg-emerald-500';
  if (confidence >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

// ─── Component ────────────────────────────────────────────
interface AiFinanceInsightData {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: string;
  recommendation: string;
  potentialSaving?: number;
  client?: string;
}

interface AiFinanceInsightProps {
  insight: AiFinanceInsightData;
}

export default function AiFinanceInsight({ insight }: AiFinanceInsightProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const impactConfig = getImpactConfig(insight.impact, isDark);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-2xl border overflow-hidden shadow-sm',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Left violet accent border */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1',
          isDark
            ? 'bg-gradient-to-b from-violet-500/80 via-purple-500/60 to-violet-500/40'
            : 'bg-gradient-to-b from-violet-500 via-purple-500 to-violet-600'
        )}
      />

      <div className="pl-4 pr-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-lg flex items-center justify-center',
              isDark ? 'bg-violet-500/15' : 'bg-violet-100'
            )}>
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <span className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-medium',
              isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600'
            )}>
              AI Insight
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'px-1.5 py-0 rounded-md text-[9px] font-medium border',
              isDark
                ? `${impactConfig.bgDark} ${impactConfig.textDark} border-transparent`
                : `${impactConfig.bgLight} ${impactConfig.textLight} border-transparent`
            )}
          >
            {impactConfig.label}
          </Badge>
        </div>

        {/* Client */}
        {insight.client && (
          <p className={cn('text-[10px] font-medium mb-1', isDark ? 'text-violet-400/70' : 'text-violet-600/70')}>
            {insight.client}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold mb-1.5 leading-relaxed">{insight.title}</h3>

        {/* Description */}
        <p className={cn('text-xs leading-relaxed mb-3 line-clamp-2', isDark ? 'text-white/50' : 'text-black/50')}>
          {insight.description}
        </p>

        {/* Confidence meter */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className={cn('text-[10px] font-medium shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>
            Confidence
          </span>
          <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
            <motion.div
              className={cn('h-full rounded-full', getConfidenceColor(insight.confidence))}
              initial={{ width: 0 }}
              animate={{ width: `${insight.confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className={cn('text-[10px] font-bold shrink-0 tabular-nums', isDark ? 'text-white/60' : 'text-black/60')}>
            {insight.confidence}%
          </span>
        </div>

        {/* Recommendation */}
        {insight.recommendation && (
          <div className={cn(
            'p-2.5 rounded-xl mb-3',
            isDark ? 'bg-purple-500/[0.06] border border-purple-500/[0.1]' : 'bg-purple-50 border border-purple-100'
          )}>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className={cn('text-[10px] font-semibold mb-0.5 text-purple-500')}>Recommendation</p>
                <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Potential saving */}
        {insight.potentialSaving !== undefined && insight.potentialSaving > 0 && (
          <div className={cn(
            'flex items-center gap-2 p-2.5 rounded-xl',
            isDark ? 'bg-emerald-500/[0.06] border border-emerald-500/[0.1]' : 'bg-emerald-50 border border-emerald-100'
          )}>
            <PiggyBank className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <div>
              <p className={cn('text-[10px] font-semibold mb-0.5', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                Potential Saving
              </p>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-500" />
                <span className={cn('text-sm font-bold tabular-nums', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                  {formatAmount(insight.potentialSaving)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
