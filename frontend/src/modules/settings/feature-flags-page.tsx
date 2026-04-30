'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, Plus, Zap, ChevronDown } from 'lucide-react';
import { featureFlags } from './data/mock-data';
import FeatureToggleCard from './components/feature-toggle-card';

const categories = ['All', 'Core', 'AI', 'Communication', 'Analytics', 'Automation', 'Security'];

export default function FeatureFlagsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredFlags = useMemo(() => {
    if (activeCategory === 'All') return featureFlags;
    return featureFlags.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const totalFlags = featureFlags.length;
  const enabledFlags = featureFlags.filter((f) => f.enabled).length;
  const disabledFlags = featureFlags.filter((f) => !f.enabled).length;
  const betaFlags = featureFlags.filter((f) => f.environments.includes('staging') && !f.environments.includes('production')).length;

  const summaryKPIs = [
    { label: 'Total Flags', value: totalFlags.toString(), color: 'text-violet-400' },
    { label: 'Enabled', value: enabledFlags.toString(), color: 'text-emerald-400' },
    { label: 'Disabled', value: disabledFlags.toString(), color: 'text-amber-400' },
    { label: 'Beta Flags', value: betaFlags.toString(), color: 'text-sky-400' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Flag className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Feature Flags</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Control feature rollouts and experiments</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}
          >
            <Plus className="w-4 h-4" /> Create Feature Flag
          </Button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryKPIs.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <span className={cn('text-[11px] font-medium uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>
                {kpi.label}
              </span>
              <p className={cn('text-2xl font-bold tracking-tight', kpi.color)}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeCategory === cat
                  ? isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-black/10 text-black'
                  : isDark
                    ? 'bg-white/[0.04] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
                    : 'bg-black/[0.04] text-black/40 hover:bg-black/[0.06] hover:text-black/60'
              )}
            >
              {cat}
              {cat !== 'All' && (
                <Badge variant="secondary" className={cn('ml-1.5 text-[9px] px-1 py-0 border-0', isDark ? 'bg-white/[0.08] text-white/30' : 'bg-black/[0.08] text-black/30')}>
                  {featureFlags.filter((f) => f.category === cat).length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Feature Flag Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFlags.map((flag, i) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <FeatureToggleCard flag={flag} />
            </motion.div>
          ))}
        </div>

        {filteredFlags.length === 0 && (
          <div className={cn('text-center py-12 rounded-2xl border', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
            <Flag className={cn('w-8 h-8 mx-auto mb-3', 'text-[var(--app-text-disabled)]')} />
            <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No feature flags in this category</p>
          </div>
        )}

        {/* Create Feature Flag Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('rounded-2xl border p-5', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className="text-sm font-semibold">Create Feature Flag</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Flag Name</label>
                <input
                  type="text"
                  placeholder="e.g., New Dashboard Layout"
                  className={cn('w-full px-3 py-2 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/80 placeholder:text-white/20 focus:border-violet-500/40' : 'bg-black/[0.02] border-black/[0.06] text-black/80 placeholder:text-black/20 focus:border-violet-500/40')}
                />
              </div>
              <div>
                <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Category</label>
                <div className="relative">
                  <select
                    className={cn('w-full px-3 py-2 rounded-xl text-sm border outline-none appearance-none transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/80 focus:border-violet-500/40' : 'bg-black/[0.02] border-black/[0.06] text-black/80 focus:border-violet-500/40')}
                  >
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className={cn('absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none', 'text-[var(--app-text-muted)]')} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Description</label>
              <textarea
                rows={3}
                placeholder="Describe what this feature flag controls..."
                className={cn('w-full px-3 py-2 rounded-xl text-sm border outline-none transition-colors resize-none', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/80 placeholder:text-white/20 focus:border-violet-500/40' : 'bg-black/[0.02] border-black/[0.06] text-black/80 placeholder:text-black/20 focus:border-violet-500/40')}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                <Plus className="w-4 h-4" /> Create Flag
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                className={cn('rounded-xl text-sm', 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]')}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
