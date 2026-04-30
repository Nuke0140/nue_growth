'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Loader2,
  SkipForward,
  Zap,
  GitBranch,
  Clock,
  BrainCircuit,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TimelineStep {
  id: string;
  nodeName: string;
  nodeType: string;
  status: 'success' | 'failed' | 'running' | 'skipped';
  duration: number;
  timestamp: string;
  output?: string;
}

interface ExecutionReplayTimelineProps {
  steps: TimelineStep[];
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onStep?: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusIcon: Record<string, React.ElementType> = {
  success: CheckCircle2,
  failed: XCircle,
  running: Loader2,
  skipped: SkipForward,
};

const statusColor: Record<string, string> = {
  success: 'text-emerald-400',
  failed: 'text-red-400',
  running: 'text-blue-400',
  skipped: 'text-zinc-400',
};

const statusLineColor: Record<string, (isDark: boolean) => string> = {
  success: (isDark: boolean) => isDark ? 'bg-emerald-500/30' : 'bg-emerald-300',
  failed: (isDark: boolean) => isDark ? 'bg-red-500/30' : 'bg-red-300',
  running: (isDark: boolean) => isDark ? 'bg-blue-500/30' : 'bg-blue-300',
  skipped: (isDark: boolean) => isDark ? 'bg-zinc-500/20' : 'bg-zinc-300',
};

const nodeTypeIcon: Record<string, React.ElementType> = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  delay: Clock,
  ai: BrainCircuit,
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60_000)}m ${Math.floor((ms % 60_000) / 1000)}s`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExecutionReplayTimeline({
  steps,
  isPlaying,
  onPlay,
  onPause,
  onStep,
}: ExecutionReplayTimelineProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const scrollRef = useRef<HTMLDivElement>(null);

  const runningIndex = steps.findIndex((s) => s.status === 'running');

  /* Auto-scroll to the running step */
  useEffect(() => {
    if (runningIndex >= 0 && scrollRef.current) {
      const children = scrollRef.current.children;
      if (children[runningIndex]) {
        children[runningIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [runningIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between border-b px-4 py-3 sm:px-app-xl',
          'border-[var(--app-border)]',
        )}
      >
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              'text-sm font-semibold',
              'text-[var(--app-text)]',
            )}
          >
            Execution Replay
          </h4>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-black/[0.04] text-zinc-500',
            )}
          >
            {steps.length} steps
          </span>
        </div>

        {/* Play / Pause controls */}
        <div className="flex items-center gap-1">
          {isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onPause}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)] transition-colors',
                isDark
                  ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              )}
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onPlay}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)] transition-colors',
                isDark
                  ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
              )}
              title="Play"
            >
              <Play className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="max-h-[480px] overflow-y-auto p-4 sm:p-app-xl space-y-0">
        {steps.map((step, i) => {
          const StatusIcon = statusIcon[step.status];
          const TypeIcon = nodeTypeIcon[step.nodeType] || Zap;
          const isRunning = step.status === 'running';

          return (
            <div key={step.id} className="relative flex gap-3">
              {/* Timeline track */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isRunning ? [1, 1.15, 1] : 1 }}
                  transition={isRunning ? { duration: 1, repeat: Infinity } : {}}
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                    isDark ? 'border-white/[0.1] bg-zinc-800' : 'border-black/[0.1] bg-white',
                  )}
                >
                  <StatusIcon
                    className={cn(
                      'h-4 w-4',
                      statusColor[step.status],
                      step.status === 'running' && 'animate-spin',
                    )}
                  />
                </motion.div>

                {/* Line to next */}
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[24px]',
                      (statusLineColor[step.status]?.(isDark) ||
                        ('bg-[var(--app-hover-bg)]')),
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.15 }}
                onClick={() => onStep?.(step.id)}
                className={cn(
                  'flex-1 rounded-[var(--app-radius-lg)] border p-3 mb-3 cursor-pointer transition-colors last:mb-0',
                  isRunning && (isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50/50 border-blue-200'),
                  !isRunning && (isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-black/[0.01] border-black/[0.06] hover:bg-black/[0.02]'),
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <TypeIcon
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          'text-[var(--app-text-muted)]',
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-semibold truncate',
                          'text-[var(--app-text)]',
                        )}
                      >
                        {step.nodeName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px]">
                      <span className={cn('uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
                        {step.nodeType}
                      </span>
                      <span className={cn('font-medium', 'text-[var(--app-text-muted)]')}>
                        {formatDuration(step.duration)}
                      </span>
                      <span className={cn('text-[var(--app-text-muted)]')}>
                        {step.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 mt-0.5 transition-transform',
                      'text-[var(--app-text-secondary)]',
                    )}
                  />
                </div>

                {/* Output preview */}
                <AnimatePresence>
                  {step.output && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 overflow-hidden"
                    >
                      <pre
                        className={cn(
                          'rounded-[var(--app-radius-lg)] p-2 text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap',
                          isDark ? 'bg-white/[0.03] text-zinc-400' : 'bg-black/[0.02] text-zinc-500',
                        )}
                      >
                        {step.output}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
