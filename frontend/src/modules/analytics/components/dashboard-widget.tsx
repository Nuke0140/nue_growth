'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<string, string> = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-80',
  xl: 'h-96',
};

const collapsedHeight: Record<string, string> = {
  sm: 'h-12',
  md: 'h-12',
  lg: 'h-12',
  xl: 'h-12',
};

export default function DashboardWidget({
  title,
  children,
  className,
  size = 'md',
}: DashboardWidgetProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'flex flex-col rounded-2xl border shadow-sm overflow-hidden transition-all duration-300',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
        className,
      )}
    >
      {/* Title Bar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'flex w-full items-center justify-between px-4 py-2.5 sm:px-5 text-left transition-colors',
          isDark
            ? 'hover:bg-white/[0.03]'
            : 'hover:bg-black/[0.02]',
        )}
      >
        <h3
          className={cn(
            'text-sm font-semibold truncate',
            isDark ? 'text-white' : 'text-zinc-900',
          )}
        >
          {title}
        </h3>

        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'shrink-0 ml-2',
            isDark ? 'text-zinc-400' : 'text-zinc-500',
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={cn('overflow-hidden', sizeClasses[size])}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
