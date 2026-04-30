'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Star, GitBranch, Tag, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowTemplate } from '../types';

const categoryColors: Record<string, string> = {
  CRM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Sales: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Marketing: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Finance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  HR: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

interface WorkflowTemplateCardProps {
  template: WorkflowTemplate;
  featured?: boolean;
}

export default function WorkflowTemplateCard({ template, featured = false }: WorkflowTemplateCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'flex flex-col gap-3 rounded-[var(--app-radius-xl)] border p-4 cursor-pointer shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors',
        featured && 'col-span-full',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
            'bg-[var(--app-purple-light)]',
          )}>
            <GitBranch className={cn('w-5 h-5', 'text-[var(--app-purple)]')} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                {template.name}
              </h4>
              {template.isFavorite && (
                <Star className={cn('w-4 h-4 shrink-0 fill-amber-400 text-amber-400')} />
              )}
            </div>
            <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>
              {template.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn(
          'inline-flex items-center rounded-[var(--app-radius-lg)] px-2 py-0.5 text-[10px] font-medium border',
          categoryColors[template.category] || categoryColors.CRM,
        )}>
          {template.category}
        </span>
        <span className={cn(
          'text-[10px]',
          'text-[var(--app-text-muted)]',
        )}>
          {template.nodeCount} nodes · v{template.version}
        </span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Tag className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
        {template.tags.slice(0, 4).map((tag) => (
          <span key={tag} className={cn(
            'rounded-[var(--app-radius-md)] px-1.5 py-0.5 text-[10px]',
            isDark ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40',
          )}>
            {tag}
          </span>
        ))}
        {template.tags.length > 4 && (
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
            +{template.tags.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className={cn('flex items-center justify-between pt-2 border-t', 'border-[var(--app-border)]')}>
        <div className="flex items-center gap-1.5">
          <Copy className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
            {template.useCount.toLocaleString()} uses
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className={cn('w-4 h-4 text-amber-400')} />
          <span className={cn('text-[10px] font-semibold', 'text-[var(--app-warning)]')}>
            {template.popularity}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
