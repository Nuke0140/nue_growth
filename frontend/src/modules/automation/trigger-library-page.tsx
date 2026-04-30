'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Zap, Search, Code2, ChevronRight, MousePointerClick,
} from 'lucide-react';
import TriggerNode from './components/trigger-node';
import { allTriggers } from './data/mock-data';

const categories = ['All', 'CRM', 'Sales', 'Marketing', 'Finance', 'ERP', 'HR', 'Retention', 'Analytics'] as const;

export default function TriggerLibraryPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);

  const filteredTriggers = useMemo(() => {
    return allTriggers.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.event.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedTrigger = allTriggers.find((t) => t.id === selectedTriggerId);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Zap className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Trigger Library</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Browse all available triggers
              </p>
            </div>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
            'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
          )}>
            {allTriggers.length} triggers available
          </span>
        </div>

        {/* ── Search + Category Tabs ── */}
        <div className="space-y-3">
          {/* Search */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search triggers by name, description, or event..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
              )}
            />
          </div>

          {/* Category Tabs */}
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
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
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

        {/* ── Content: Trigger Grid + Detail Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trigger Cards Grid */}
          <div className={cn(selectedTriggerId ? 'lg:col-span-2' : 'lg:col-span-3')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTriggers.map((trigger, i) => (
                <motion.div
                  key={trigger.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <TriggerNode
                    trigger={trigger}
                    onClick={() => setSelectedTriggerId(selectedTriggerId === trigger.id ? null : trigger.id)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredTriggers.length === 0 && (
              <div className={cn(
                'rounded-2xl border p-12 text-center',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}>
                <Zap className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
                <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                  No triggers found
                </p>
                <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Trigger Detail Panel */}
          <AnimatePresence>
            {selectedTrigger && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'rounded-2xl border p-4 space-y-4 h-fit sticky top-4',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center',
                    isDark ? 'bg-blue-500/15' : 'bg-blue-50',
                  )}>
                    <MousePointerClick className={cn('w-4 h-4', 'text-[var(--app-info)]')} />
                  </div>
                  <div>
                    <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                      {selectedTrigger.name}
                    </h3>
                    <p className={cn('text-[10px] font-mono', 'text-[var(--app-text-muted)]')}>
                      {selectedTrigger.event}
                    </p>
                  </div>
                </div>

                <p className={cn('text-xs leading-relaxed', 'text-[var(--app-text-secondary)]')}>
                  {selectedTrigger.description}
                </p>

                {/* Payload Preview */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Code2 className={cn('w-3.5 h-3.5', 'text-[var(--app-purple)]')} />
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
                      Payload Preview
                    </span>
                  </div>
                  <pre className={cn(
                    'rounded-xl p-3 text-[10px] font-mono overflow-auto max-h-48 leading-relaxed',
                    isDark ? 'bg-black/40 text-emerald-300/70 border border-white/[0.04]' : 'bg-zinc-50 text-emerald-700 border border-black/[0.04]',
                  )}>
                    {JSON.stringify(selectedTrigger.payload, null, 2)}
                  </pre>
                </div>

                {/* Example Templates */}
                <div>
                  <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
                    Used In Workflows
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {selectedTrigger.exampleTemplates.map((tpl) => (
                      <div
                        key={tpl}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer transition-colors',
                          isDark ? 'bg-white/[0.03] hover:bg-white/[0.06] text-white/60' : 'bg-black/[0.02] hover:bg-black/[0.04] text-black/60',
                        )}
                      >
                        <ChevronRight className={cn('w-3 h-3', 'text-[var(--app-text-disabled)]')} />
                        {tpl}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  'flex items-center justify-between pt-2 border-t text-xs',
                  'border-[var(--app-border)]',
                )}>
                  <span className={cn('text-[var(--app-text-muted)]')}>
                    Usage Count
                  </span>
                  <span className={cn('font-semibold', 'text-[var(--app-text-secondary)]')}>
                    {selectedTrigger.usageCount.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
