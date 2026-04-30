'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Clock, User, ArrowRight, GitBranch, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChangeEntry {
  id: string;
  field: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
  module: string;
}

interface ChangeHistoryTimelineProps {
  changes: ChangeEntry[];
  isLoading?: boolean;
}

const moduleColorMap: Record<string, { dot: string; ring: string; text: string }> = {
  users: { dot: 'bg-blue-500', ring: 'ring-blue-500/20', text: 'text-blue-400' },
  billing: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/20', text: 'text-emerald-400' },
  security: { dot: 'bg-red-500', ring: 'ring-red-500/20', text: 'text-red-400' },
  automation: { dot: 'bg-violet-500', ring: 'ring-violet-500/20', text: 'text-violet-400' },
  analytics: { dot: 'bg-amber-500', ring: 'ring-amber-500/20', text: 'text-amber-400' },
  settings: { dot: 'bg-slate-500', ring: 'ring-slate-500/20', text: 'text-slate-400' },
  ai: { dot: 'bg-fuchsia-500', ring: 'ring-fuchsia-500/20', text: 'text-fuchsia-400' },
  integrations: { dot: 'bg-cyan-500', ring: 'ring-cyan-500/20', text: 'text-cyan-400' },
};

function getModuleColor(mod: string) {
  return moduleColorMap[mod.toLowerCase()] || moduleColorMap.settings;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SkeletonRow() {
  const isDark = false; // skeleton uses neutral colors
  return (
    <div className="flex gap-3 pb-6">
      <div className="flex flex-col items-center">
        <div className="h-3.5 w-3.5 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        <div className="flex-1 w-0.5 bg-zinc-200 dark:bg-zinc-700 animate-pulse mt-1" />
      </div>
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-3.5 w-32 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        <div className="h-3 w-48 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
      </div>
    </div>
  );
}

export default function ChangeHistoryTimeline({
  changes,
  isLoading = false,
}: ChangeHistoryTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-2xl border p-5 shadow-sm',
          isDark
            ? 'bg-white/[0.03] border-white/[0.06]'
            : 'bg-black/[0.02] border-black/[0.06]',
        )}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (!changes || changes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border p-10 shadow-sm',
          isDark
            ? 'bg-white/[0.03] border-white/[0.06]'
            : 'bg-black/[0.02] border-black/[0.06]',
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl mb-3',
            'bg-[var(--app-hover-bg)]',
          )}
        >
          <Inbox className={cn('h-6 w-6', 'text-[var(--app-text-muted)]')} />
        </div>
        <p className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
          No changes yet
        </p>
        <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
          Change history will appear here when modifications are made.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-2xl border p-5 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
      )}
    >
      <div className="space-y-0">
        {changes.map((change, idx) => {
          const mColor = getModuleColor(change.module);
          const isLast = idx === changes.length - 1;

          return (
            <motion.div
              key={change.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="flex gap-3 group"
            >
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'h-3.5 w-3.5 rounded-full ring-4 shrink-0 mt-0.5',
                    mColor.dot,
                    mColor.ring,
                  )}
                />
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 w-px min-h-[40px]',
                      'bg-[var(--app-hover-bg)]',
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn('flex-1 min-w-0 pb-6', isLast && 'pb-0')}>
                {/* Field + Module */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    {change.field}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-black/[0.04] text-zinc-500',
                      mColor.text,
                    )}
                  >
                    <GitBranch className="h-2.5 w-2.5 inline mr-0.5" />
                    {change.module}
                  </span>
                </div>

                {/* Value change */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={cn(
                      'rounded-lg px-2 py-0.5 text-[11px] font-mono line-through max-w-[160px] truncate',
                      isDark ? 'bg-red-500/10 text-red-400/70' : 'bg-red-50 text-red-500/70',
                    )}
                  >
                    {change.previousValue}
                  </span>
                  <ArrowRight className={cn('h-3 w-3 shrink-0', 'text-[var(--app-text-secondary)]')} />
                  <span
                    className={cn(
                      'rounded-lg px-2 py-0.5 text-[11px] font-mono font-semibold max-w-[160px] truncate',
                      'bg-[var(--app-success-bg)] text-[var(--app-success)]',
                    )}
                  >
                    {change.newValue}
                  </span>
                </div>

                {/* Actor + Time */}
                <div className="flex items-center gap-3">
                  <span className={cn('flex items-center gap-1 text-[10px]', 'text-[var(--app-text-muted)]')}>
                    <User className="h-3 w-3" />
                    {change.changedBy}
                  </span>
                  <span className={cn('flex items-center gap-1 text-[10px]', 'text-[var(--app-text-muted)]')}>
                    <Clock className="h-3 w-3" />
                    {formatTime(change.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
