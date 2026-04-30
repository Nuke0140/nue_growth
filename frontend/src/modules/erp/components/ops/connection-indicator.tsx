'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRealtime } from '../../hooks/use-realtime';

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function ConnectionIndicator() {
  const { isOnline, lastSync, pendingUpdates } = useRealtime();
  const [syncLabel, setSyncLabel] = useState('Synced just now');

  // Refresh the "time ago" label every 10 seconds
  useEffect(() => {
    setSyncLabel(`Synced ${formatTimeAgo(lastSync)}`);
    const timer = setInterval(() => {
      setSyncLabel(`Synced ${formatTimeAgo(lastSync)}`);
    }, 10000);
    return () => clearInterval(timer);
  }, [lastSync]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-[var(--ops-hover-bg)] transition-colors cursor-default select-none">
          {/* Status dot */}
          <span className="relative flex items-center justify-center">
            <motion.span
              className={cn(
                'inline-block w-2 h-2 rounded-full',
                isOnline ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-500 dark:bg-red-400'
              )}
              animate={
                isOnline
                  ? { scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }
                  : {}
              }
              transition={
                isOnline
                  ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
            {/* Pulse ring when pending updates */}
            <AnimatePresence>
              {pendingUpdates > 0 && (
                <motion.span
                  key="pulse"
                  className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </span>

          {/* Status text */}
          <span
            className={cn(
              'text-[11px] font-medium leading-none hidden sm:inline',
              isOnline
                ? 'text-emerald-500 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            )}
          >
            {isOnline ? 'Connected' : 'Offline'}
          </span>

          {/* Pending updates badge */}
          <AnimatePresence>
            {pendingUpdates > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: 4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 4 }}
                transition={{ duration: 0.2 }}
                className="hidden md:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  {pendingUpdates}
                </motion.span>
                <span>pending</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-[var(--ops-card-bg)] border-[var(--ops-border-strong)] rounded-lg px-3 py-2 text-[12px] text-[var(--ops-text)]"
      >
        <div className="flex flex-col gap-1">
          <span>
            {isOnline ? '🟢 Connected' : '🔴 Offline'}
          </span>
          <span className="text-[var(--ops-text-muted)]">
            {syncLabel}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default ConnectionIndicator;
