'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AiPageInsight, AiInsightPriority } from '../../types';
import { useErpStore } from '../../erp-store';

interface AiInsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AiPageInsight[];
}

const priorityOrder: Record<AiInsightPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const priorityColors: Record<AiInsightPriority, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-gray-500',
};

const priorityLabelColors: Record<AiInsightPriority, string> = {
  critical: 'text-red-500 dark:text-red-400',
  high: 'text-amber-500 dark:text-amber-400',
  medium: 'text-blue-500 dark:text-blue-400',
  low: 'text-gray-500 dark:text-gray-400',
};

const confidenceBarColor: Record<AiInsightPriority, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-gray-500',
};

export function AiInsightPanel({ isOpen, onClose, insights }: AiInsightPanelProps) {
  const { navigateTo } = useErpStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const grouped = React.useMemo(() => {
    const sorted = [...insights].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    return sorted;
  }, [insights]);

  const handleAction = (insight: AiPageInsight) => {
    if (insight.actionPage) {
      navigateTo(insight.actionPage);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--app-overlay)] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-[420px] max-w-[90vw] flex flex-col shadow-2xl"
            style={{
              backgroundColor: 'var(--app-bg)',
              borderLeft: '1px solid var(--app-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--app-border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ backgroundColor: 'var(--app-accent-light)' }}
                >
                  <Sparkles className="w-[18px] h-[18px]" style={{ color: 'var(--app-accent)' }} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--app-text)]">AI Insights</h2>
                  <p className="text-[11px] text-[var(--app-text-muted)]">
                    Contextual recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {insights.length > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--app-accent)] text-white">
                    {insights.length}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Insights list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
              {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--app-hover-bg)' }}
                  >
                    <Sparkles
                      className="w-6 h-6"
                      style={{ color: 'var(--app-text-disabled)' }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--app-text-secondary)]">
                      No insights available
                    </p>
                    <p className="text-xs text-[var(--app-text-disabled)] mt-1 max-w-[220px]">
                      AI insights will appear based on your current page context and data.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {grouped.map((insight, idx) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.25 }}
                      className="app-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Priority dot */}
                        <div className="pt-1 shrink-0">
                          <div
                            className={cn(
                              'w-2.5 h-2.5 rounded-full',
                              priorityColors[insight.priority]
                            )}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Priority label + Title */}
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                'text-[10px] font-semibold uppercase tracking-wider',
                                priorityLabelColors[insight.priority]
                              )}
                            >
                              {insight.priority}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-semibold text-[var(--app-text)] leading-snug">
                            {insight.title}
                          </h4>
                          <p className="text-xs text-[var(--app-text-secondary)] mt-1 leading-relaxed">
                            {insight.description}
                          </p>

                          {/* Confidence bar */}
                          <div className="mt-3 flex items-center gap-2.5">
                            <div className="flex-1 h-1.5 rounded-full bg-[var(--app-hover-bg)] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${insight.confidence}%` }}
                                transition={{ delay: idx * 0.06 + 0.2, duration: 0.5 }}
                                className={cn(
                                  'h-full rounded-full',
                                  confidenceBarColor[insight.priority]
                                )}
                              />
                            </div>
                            <span className="text-[10px] text-[var(--app-text-muted)] shrink-0">
                              {insight.confidence}% confident
                            </span>
                          </div>

                          {/* Action button */}
                          {insight.actionText && (
                            <button
                              onClick={() => handleAction(insight)}
                              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] transition-colors"
                            >
                              {insight.actionText}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
