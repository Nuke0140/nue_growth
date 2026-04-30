'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { GitBranch, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConditionRule } from '../types';

const moduleColors: Record<string, string> = {
  CRM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Sales: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Marketing: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Finance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  HR: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Retention: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  AI: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

interface ConditionNodeProps {
  rule: ConditionRule;
}

export default function ConditionNode({ rule }: ConditionNodeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center',
            'bg-[var(--app-warning-bg)]',
          )}>
            <GitBranch className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-500')} />
          </div>
          <div>
            <h4 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              {rule.name}
            </h4>
            <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
              {rule.description}
            </p>
          </div>
        </div>
        <span className={cn(
          'inline-flex items-center rounded-[var(--app-radius-lg)] px-2 py-0.5 text-[10px] font-medium border shrink-0',
          moduleColors[rule.module] || moduleColors.CRM,
        )}>
          {rule.module}
        </span>
      </div>

      {/* Conditions */}
      <div className={cn('rounded-[var(--app-radius-lg)] p-3 mb-3', 'bg-[var(--app-hover-bg)]')}>
        <div className="flex items-center gap-1.5 mb-2">
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
            IF
          </span>
        </div>
        <div className="space-y-1.5">
          {rule.conditions.map((cond, i) => (
            <div key={cond.id} className="flex items-center gap-2 text-xs">
              {i > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded',
                  isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-50 text-violet-600',
                )}>
                  {cond.logic || 'AND'}
                </span>
              )}
              <span className={cn('font-mono text-[11px]', 'text-[var(--app-text-secondary)]')}>
                {cond.field} {cond.operator} {String(cond.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Then / Else */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <ArrowRight className={cn('w-4 h-4', 'text-[var(--app-success)]')} />
          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-success)]')}>
            THEN
          </span>
          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
            {rule.thenAction}
          </span>
        </div>
        {rule.elseAction && (
          <div className="flex items-center gap-2">
            <ArrowRight className={cn('w-4 h-4', 'text-[var(--app-danger)]')} />
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-danger)]')}>
              ELSE
            </span>
            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
              {rule.elseAction}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
