'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  LayoutTemplate, Search, Plus, Star, ArrowUpDown, Copy,
} from 'lucide-react';
import WorkflowTemplateCard from './components/workflow-template-card';
import { workflowTemplates } from './data/mock-data';

const categories = ['All', 'CRM', 'Sales', 'Marketing', 'Finance', 'HR'] as const;
const sortOptions = ['Popular', 'Newest', 'Most Used'] as const;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function TemplatesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('Popular');

  const filteredTemplates = useMemo(() => {
    let templates = workflowTemplates.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Sort
    if (sortBy === 'Popular') {
      templates = [...templates].sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'Newest') {
      templates = [...templates].sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
    } else if (sortBy === 'Most Used') {
      templates = [...templates].sort((a, b) => b.useCount - a.useCount);
    }

    return templates;
  }, [activeCategory, searchQuery, sortBy]);

  const featuredTemplate = workflowTemplates[0]; // Most popular as featured

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
              <LayoutTemplate className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Templates</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Start with pre-built workflows
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              {workflowTemplates.length} templates
            </span>
          </div>
        </div>

        {/* ── Search + Filters Row ── */}
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
              placeholder="Search templates by name, description, or tags..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
              )}
            />
          </div>

          {/* Category Tabs + Sort */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
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
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-violet-50 text-violet-700 border border-violet-200'
                      : isDark
                        ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1]'
                        : 'bg-black/[0.03] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.06]',
                  )}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={cn(
                    'rounded-lg px-2 py-1 text-[10px] font-medium transition-colors',
                    sortBy === opt
                      ? isDark
                        ? 'bg-white/[0.1] text-white/60'
                        : 'bg-black/[0.06] text-black/60'
                      : isDark
                        ? 'text-white/30 hover:text-white/50'
                        : 'text-black/30 hover:text-black/50',
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Featured Template ── */}
        {activeCategory === 'All' && searchQuery === '' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Featured Template
              </span>
            </div>
            <div className={cn(
              'rounded-2xl border overflow-hidden shadow-sm',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
            )}>
              <div className={cn(
                'p-1.5 inline-flex items-center gap-1 rounded-full ml-4 mt-4',
                'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
              )}>
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-bold">MOST POPULAR</span>
              </div>
              <div className="p-4 pt-3">
                <WorkflowTemplateCard template={featuredTemplate} featured />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Template Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredTemplates
            .filter((t) => activeCategory !== 'All' || searchQuery !== '' || t.id !== featuredTemplate.id)
            .map((template) => (
              <motion.div key={template.id} variants={fadeUp}>
                <WorkflowTemplateCard template={template} />
              </motion.div>
            ))}

          {/* Create from Scratch CTA */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer min-h-[200px] transition-colors',
              isDark
                ? 'border-white/[0.08] hover:border-violet-500/30 hover:bg-violet-500/[0.02]'
                : 'border-black/[0.08] hover:border-violet-500/30 hover:bg-violet-50/50',
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center',
              'bg-[var(--app-purple-light)]',
            )}>
              <Plus className={cn('w-6 h-6', 'text-[var(--app-purple)]')} />
            </div>
            <div className="text-center">
              <p className={cn('text-sm font-semibold', 'text-[var(--app-text-secondary)]')}>
                Create from Scratch
              </p>
              <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                Start with a blank canvas
              </p>
            </div>
          </motion.div>
        </motion.div>

        {filteredTemplates.length === 0 && activeCategory !== 'All' && (
          <div className={cn(
            'rounded-2xl border p-12 text-center',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <LayoutTemplate className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
            <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
              No templates found in this category
            </p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
              Try selecting a different category or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
