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
        'flex flex-col gap-3 rounded-2xl border p-4 cursor-pointer shadow-sm transition-all',
        featured && 'col-span-full',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            isDark ? 'bg-violet-500/15' : 'bg-violet-50',
          )}>
            <GitBranch className={cn('w-5 h-5', isDark ? 'text-violet-400' : 'text-violet-500')} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                {template.name}
              </h4>
              {template.isFavorite && (
                <Star className={cn('w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400')} />
              )}
            </div>
            <p className={cn('text-xs mt-0.5 line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
              {template.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn(
          'inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium border',
          categoryColors[template.category] || categoryColors.CRM,
        )}>
          {template.category}
        </span>
        <span className={cn(
          'text-[10px]',
          isDark ? 'text-white/30' : 'text-black/30',
        )}>
          {template.nodeCount} nodes · v{template.version}
        </span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Tag className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
        {template.tags.slice(0, 4).map((tag) => (
          <span key={tag} className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px]',
            isDark ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40',
          )}>
            {tag}
          </span>
        ))}
        {template.tags.length > 4 && (
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
            +{template.tags.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className={cn('flex items-center justify-between pt-2 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
        <div className="flex items-center gap-1.5">
          <Copy className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
          <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
            {template.useCount.toLocaleString()} uses
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className={cn('w-3 h-3 text-amber-400')} />
          <span className={cn('text-[10px] font-semibold', isDark ? 'text-amber-300' : 'text-amber-600')}>
            {template.popularity}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
