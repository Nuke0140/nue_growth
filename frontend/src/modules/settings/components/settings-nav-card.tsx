'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '../settings-store';
import type { SettingsPage } from '../types';

interface SettingsNavCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  page: SettingsPage;
  badge?: string;
  badgeColor?: string;
}

export default function SettingsNavCard({
  title,
  description,
  icon: Icon,
  page,
  badge,
  badgeColor,
}: SettingsNavCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const navigateTo = useSettingsStore((s) => s.navigateTo);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => navigateTo(page)}
      className={cn(
        'relative cursor-pointer rounded-[var(--app-radius-xl)] border p-4 sm:p-app-xl shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] hover:shadow-[var(--app-shadow-md)]-md transition-colors',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)]',
              'bg-[var(--app-hover-bg)]',
            )}
          >
            <Icon
              className={cn('h-5 w-5', 'text-[var(--app-text-muted)]')}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                {title}
              </p>
              {badge && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                  isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-black/[0.06] text-zinc-500',
                )}>
                  {badge}
                </span>
              )}
            </div>
            <p className={cn('text-xs mt-1 line-clamp-2', 'text-[var(--app-text-muted)]')}>
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', 'text-[var(--app-text-muted)]')} />
      </div>
    </motion.div>
  );
}
