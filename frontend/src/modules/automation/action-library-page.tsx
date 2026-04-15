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
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
            )}>
              <Play className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Action Library</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Browse all available actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50',
            )}>
              {allActions.length} actions
            </div>
          </div>
        </div>

        {/* ── Usage Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={cn(
            'rounded-2xl border p-4',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-blue-400' : 'text-blue-500')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                Total Usage
              </span>
            </div>
            <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              {totalUsage.toLocaleString()}
            </p>
            <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
              Across all workflows
            </p>
          </div>
          <div className={cn(
            'rounded-2xl border p-4',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Play className={cn('w-4 h-4', isDark ? 'text-emerald-400' : 'text-emerald-500')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                Categories
              </span>
            </div>
            <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              {Object.keys(categoryMap).length - 1}
            </p>
            <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
              Distinct action types
            </p>
          </div>
          <div className={cn(
            'rounded-2xl border p-4',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Search className={cn('w-4 h-4', isDark ? 'text-violet-400' : 'text-violet-500')} />
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                Avg Config Fields
              </span>
            </div>
            <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
              {avgFields}
            </p>
            <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
              Per action
            </p>
          </div>
        </div>

        {/* ── Search + Category Tabs ── */}
        <div className="space-y-3">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions by name or description..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25',
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
            'rounded-2xl border p-12 text-center',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <Play className={cn('w-8 h-8 mx-auto mb-3', isDark ? 'text-white/20' : 'text-black/20')} />
            <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
              No actions found
            </p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
