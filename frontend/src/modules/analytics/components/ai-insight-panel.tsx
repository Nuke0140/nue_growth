'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Lightbulb, ChevronDown, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
}

interface AIInsightPanelProps {
  insights: Insight[];
  onSelectInsight?: (id: string) => void;
}

const impactConfig: Record<
  string,
  { borderColor: string; badgeBg: string; badgeText: string; label: string }
> = {
  high: {
    borderColor: 'border-l-red-500',
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-400',
    label: 'High Impact',
  },
  medium: {
    borderColor: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    label: 'Medium Impact',
  },
  low: {
    borderColor: 'border-l-blue-500',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    label: 'Low Impact',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function AIInsightPanel({
  insights,
  onSelectInsight,
}: AIInsightPanelProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    onSelectInsight?.(id);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            isDark ? 'bg-purple-500/15' : 'bg-purple-50',
          )}
        >
          <Lightbulb className="h-4 w-4 text-purple-400" />
        </div>
        <div>
          <h3
            className={cn(
              'text-sm font-semibold',
              isDark ? 'text-white' : 'text-zinc-900',
            )}
          >
            AI Insights
          </h3>
          <p className={cn('text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
            {insights.length} insight{insights.length !== 1 ? 's' : ''} generated
          </p>
        </div>
      </div>

      {/* Insight Cards */}
      {insights.length === 0 && (
        <div
          className={cn(
            'rounded-2xl border p-8 text-center',
            isDark
              ? 'bg-white/[0.03] border-white/[0.06]'
              : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <Lightbulb className={cn('h-8 w-8 mx-auto mb-2', isDark ? 'text-zinc-600' : 'text-zinc-300')} />
          <p className={cn('text-sm', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
            No insights available yet
          </p>
        </div>
      )}

      {insights.map((insight) => {
        const config = impactConfig[insight.impact];
        const isExpanded = expandedId === insight.id;

        return (
          <motion.div
            key={insight.id}
            variants={itemVariants}
            className={cn(
              'rounded-2xl border border-l-4 shadow-sm overflow-hidden',
              isDark
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-black/[0.02] border-black/[0.06]',
              config.borderColor,
            )}
          >
            {/* Card Header */}
            <button
              onClick={() => toggleExpand(insight.id)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4
                    className={cn(
                      'text-sm font-semibold truncate',
                      isDark ? 'text-white' : 'text-zinc-900',
                    )}
                  >
                    {insight.title}
                  </h4>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0',
                      config.badgeBg,
                      config.badgeText,
                    )}
                  >
                    {config.label}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-xs line-clamp-2',
                    isDark ? 'text-zinc-400' : 'text-zinc-500',
                  )}
                >
                  {insight.description}
                </p>
              </div>

              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'shrink-0 ml-3',
                  isDark ? 'text-zinc-400' : 'text-zinc-500',
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>

            {/* Expanded Detail */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'border-t px-4 sm:px-5 py-3 sm:py-4 space-y-3',
                      isDark ? 'border-white/[0.06]' : 'border-black/[0.06]',
                    )}
                  >
                    {/* Category Tag */}
                    <div className="flex items-center gap-1.5">
                      <Tag
                        className={cn(
                          'h-3 w-3',
                          isDark ? 'text-zinc-500' : 'text-zinc-400',
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wider',
                          isDark ? 'text-zinc-500' : 'text-zinc-400',
                        )}
                      >
                        {insight.category}
                      </span>
                    </div>

                    {/* Recommendation */}
                    <div
                      className={cn(
                        'rounded-xl p-3',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]',
                      )}
                    >
                      <p
                        className={cn(
                          'text-[10px] font-semibold uppercase tracking-wider mb-1.5',
                          isDark ? 'text-zinc-500' : 'text-zinc-400',
                        )}
                      >
                        Recommendation
                      </p>
                      <p
                        className={cn(
                          'text-xs leading-relaxed',
                          isDark ? 'text-zinc-300' : 'text-zinc-600',
                        )}
                      >
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
