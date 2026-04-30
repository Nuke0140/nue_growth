'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Maximize2, Minimize2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  fullscreen?: boolean;
  onFullscreen?: () => void;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  className,
  fullscreen = false,
  onFullscreen,
}: ChartCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex flex-col rounded-2xl border shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
        fullscreen && 'fixed inset-4 z-50',
        fullscreen && (isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'),
        fullscreen && 'rounded-2xl shadow-2xl',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 sm:py-4',
          isDark ? 'border-white/[0.06]' : 'border-black/[0.06]',
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              'text-sm font-semibold truncate',
              isDark ? 'text-white' : 'text-zinc-900',
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={cn(
                'text-xs mt-0.5 truncate',
                isDark ? 'text-zinc-400' : 'text-zinc-500',
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Export button placeholder */}
          <button
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              isDark
                ? 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200'
                : 'hover:bg-black/[0.04] text-zinc-500 hover:text-zinc-700',
            )}
            title="Export"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Fullscreen toggle */}
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                isDark
                  ? 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200'
                  : 'hover:bg-black/[0.04] text-zinc-500 hover:text-zinc-700',
              )}
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div
        className={cn(
          'relative flex-1 overflow-hidden p-4 sm:p-5',
          fullscreen ? 'min-h-0 flex-1' : 'min-h-[300px]',
        )}
      >
        <div className="h-full w-full overflow-x-auto overflow-y-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
