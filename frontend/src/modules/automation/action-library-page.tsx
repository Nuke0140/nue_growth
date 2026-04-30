'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Play, Search, BarChart3,
} from 'lucide-react';
import ActionNode from './components/action-node';
import { allActions } from './data/mock-data';

const categories = ['All', 'Communication', 'CRM', 'Finance', 'ERP', 'HR', 'AI', 'Reporting', 'Escalation'] as const;

const categoryMap: Record<string, string> = {
  All: '',
  Communication: 'communication',
  CRM: 'crm-updates',
  Finance: 'finance-actions',
  ERP: 'erp-actions',
  HR: 'hr-actions',
  AI: 'ai-actions',
  Reporting: 'reporting',
  Escalation: 'escalation',
};

export default function ActionLibraryPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActions = useMemo(() => {
    const mappedCategory = categoryMap[activeCategory] || '';
    return allActions.filter((a) => {
      const matchesCategory = mappedCategory === '' || a.category === mappedCategory;
      const matchesSearch = searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalUsage = useMemo(() => allActions.reduce((sum, a) => sum + a.usageCount, 0), []);
  const avgFields = useMemo(() => Math.round(allActions.reduce((sum, a) => sum + a.configFields.length, 0) / allActions.length), []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Play className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Action Library</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Browse all available actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              {allActions.length} actions
            </div>
          </div>
        </div>

        {/* ── Usage Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-4',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-info)]')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Total Usage
              </span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              {totalUsage.toLocaleString()}
            </p>
            <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>
              Across all workflows
            </p>
          </div>
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-4',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Play className={cn('w-4 h-4', 'text-[var(--app-success)]')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Categories
              </span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              {Object.keys(categoryMap).length - 1}
            </p>
            <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>
              Distinct action types
            </p>
          </div>
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-4',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Search className={cn('w-4 h-4', 'text-[var(--app-purple)]')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Avg Config Fields
              </span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              {avgFields}
            </p>
            <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>
              Per action
            </p>
          </div>
        </div>

        {/* ── Search + Category Tabs ── */}
        <div className="space-y-3">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions by name or description..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
              )}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium select-none transition-colors cursor-pointer whitespace-nowrap',
                  activeCategory === cat
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isDark
                      ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1]'
                      : 'bg-black/[0.03] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.06]',
                )}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Action Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredActions.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <ActionNode action={action} />
            </motion.div>
          ))}
        </div>

        {filteredActions.length === 0 && (
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-4xl text-center',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <Play className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
            <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
              No actions found
            </p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
