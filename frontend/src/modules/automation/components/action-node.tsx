'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Action } from '../types';

const categoryColors: Record<string, string> = {
  communication: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'crm-updates': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'finance-actions': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'erp-actions': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'hr-actions': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'ai-actions': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  reporting: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  escalation: 'bg-red-500/10 text-red-400 border-red-500/20',
};

interface ActionNodeProps {
  action: Action;
  onClick?: () => void;
}

export default function ActionNode({ action, onClick }: ActionNodeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 cursor-pointer shadow-sm transition-all',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center',
            'bg-[var(--app-success-bg)]',
          )}>
            <Play className={cn('w-4 h-4', 'text-[var(--app-success)]')} />
          </div>
          <div>
            <h4 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              {action.name}
            </h4>
            <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>
              {action.description}
            </p>
          </div>
        </div>
        <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', 'text-[var(--app-text-disabled)]')} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn(
          'inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium border',
          categoryColors[action.category] || categoryColors.communication,
        )}>
          {action.category.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className={cn('flex items-center gap-2 pt-2 border-t', 'border-[var(--app-border)]')}>
        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
          Used in {action.usageCount.toLocaleString()} workflows
        </span>
        <span className={cn('text-[10px] ml-auto', 'text-[var(--app-text-disabled)]')}>
          {action.configFields.length} fields
        </span>
      </div>
    </motion.div>
  );
}
