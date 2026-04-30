'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Plus, GripVertical, Settings, Share2, Save,
  ChevronDown, ChevronRight, Palette, Monitor, User, Users,
  Building2, Crown, Target, BarChart3, PieChart, TrendingUp,
  Activity, Zap, Trophy, Layers, Search, X, Eye, EyeOff,
  LayoutGrid, ArrowRight, Sparkles,
} from 'lucide-react';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import { dashboardTemplates } from './data/mock-data';

const iconMap: Record<string, React.ElementType> = {
  User, Users, Building2, Crown, Target, BarChart3, PieChart, TrendingUp,
  Activity, Zap, Trophy, Layers,
};

const widgetTypes = [
  { id: 'kpi', label: 'KPI Card', icon: Activity },
  { id: 'line-chart', label: 'Line Chart', icon: TrendingUp },
  { id: 'bar-chart', label: 'Bar Chart', icon: BarChart3 },
  { id: 'pie-chart', label: 'Pie Chart', icon: PieChart },
  { id: 'funnel', label: 'Funnel', icon: Layers },
  { id: 'heatmap', label: 'Heatmap', icon: Monitor },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'roi', label: 'ROI', icon: Target },
  { id: 'pipeline', label: 'Pipeline', icon: Zap },
];

const canvasWidgets = [
  { id: 'w-1', type: 'kpi', title: 'Total Leads', status: 'placed' },
  { id: 'w-2', type: 'line-chart', title: 'Revenue Trend', status: 'placed' },
  { id: 'w-3', type: 'bar-chart', title: 'Channel Mix', status: 'placed' },
  { id: 'w-4', type: 'pie-chart', title: 'Source Distribution', status: 'placed' },
  { id: 'w-5', type: 'funnel', title: 'Conversion Funnel', status: 'placed' },
  { id: 'w-6', type: 'leaderboard', title: 'Top Performers', status: 'placed' },
  { id: 'w-7', type: 'roi', title: 'Campaign ROI', status: 'placed' },
  { id: 'w-8', type: 'pipeline', title: 'Sales Pipeline', status: 'placed' },
];

const widgetIconMap: Record<string, React.ElementType> = {
  'kpi': Activity,
  'line-chart': TrendingUp,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'funnel': Layers,
  'heatmap': Monitor,
  'leaderboard': Trophy,
  'roi': Target,
  'pipeline': Zap,
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

type TabType = 'personal' | 'team' | 'client';

export default function CustomDashboardBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [themeOption, setThemeOption] = useState('white-label');

  const filteredTemplates = useMemo(() => {
    const categoryMap: Record<TabType, string> = {
      personal: 'personal',
      team: 'team',
      client: 'client',
    };
    return dashboardTemplates.filter((t) => {
      if (t.category === categoryMap[activeTab] || t.category === 'executive') return true;
      return false;
    });
  }, [activeTab]);

  const handleSelectTemplate = (id: string) => {
    const tpl = dashboardTemplates.find((t) => t.id === id);
    setSelectedTemplate(id);
    setDashboardName(tpl?.name || '');
  };

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
              <LayoutDashboard className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Custom Dashboard Builder</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Create your perfect dashboard
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className={cn(
          'inline-flex rounded-2xl border p-1',
          'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
        )}>
          {([
            { key: 'personal' as TabType, label: 'Personal', icon: User },
            { key: 'team' as TabType, label: 'Team', icon: Users },
            { key: 'client' as TabType, label: 'Client', icon: Building2 },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedTemplate(null); }}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200',
                activeTab === tab.key
                  ? (isDark
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-black text-white shadow-lg shadow-black/10')
                  : (isDark
                      ? 'text-white/50 hover:text-white/70 hover:bg-white/[0.04]'
                      : 'text-black/50 hover:text-black/70 hover:bg-black/[0.04]'),
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Empty State (no template selected) ── */}
        <AnimatePresence mode="wait">
          {!selectedTemplate ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Template Gallery */}
              <div>
                <h2 className={cn(
                  'text-sm font-semibold uppercase tracking-wider mb-4',
                  'text-[var(--app-text-muted)]',
                )}>
                  Template Gallery
                </h2>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredTemplates.map((tpl) => {
                    const TemplateIcon = iconMap[tpl.icon] || LayoutGrid;
                    return (
                      <motion.div
                        key={tpl.id}
                        variants={fadeUp}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={cn(
                          'rounded-2xl border p-5 cursor-pointer transition-all duration-200 group',
                          isDark
                            ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-lg hover:shadow-white/[0.03]'
                            : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04] hover:border-black/[0.1] hover:shadow-lg hover:shadow-black/[0.03]',
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            'bg-[var(--app-hover-bg)]',
                          )}>
                            <TemplateIcon className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
                          </div>
                          {tpl.isDefault && (
                            <span className={cn(
                              'rounded-full px-2 py-0.5 text-[9px] font-semibold',
                              isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-100 text-violet-700',
                            )}>
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className={cn(
                          'text-sm font-semibold mb-1 group-hover:underline underline-offset-2',
                          'text-[var(--app-text)]',
                        )}>
                          {tpl.name}
                        </h3>
                        <p className={cn('text-xs leading-relaxed mb-3', 'text-[var(--app-text-muted)]')}>
                          {tpl.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                            {tpl.widgetCount} widgets included
                          </span>
                          <span className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-semibold',
                            'text-[var(--app-info)]',
                          )}>
                            Use Template <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Empty State CTA */}
              <div className={cn(
                'rounded-2xl border p-8 sm:p-12 text-center',
                isDark
                  ? 'bg-white/[0.02] border-white/[0.06] border-dashed'
                  : 'bg-black/[0.01] border-black/[0.06] border-dashed',
              )}>
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
                  'bg-[var(--app-hover-bg)]',
                )}>
                  <Sparkles className={cn('w-8 h-8', 'text-[var(--app-text-disabled)]')} />
                </div>
                <h3 className={cn(
                  'text-lg font-semibold mb-2',
                  'text-[var(--app-text-secondary)]',
                )}>
                  Or Start From Scratch
                </h3>
                <p className={cn(
                  'text-sm mb-4 max-w-md mx-auto',
                  'text-[var(--app-text-muted)]',
                )}>
                  Select a template above or create a completely custom dashboard by adding widgets one by one.
                </p>
                <button
                  onClick={() => {
                    setSelectedTemplate('custom');
                    setDashboardName('My Custom Dashboard');
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200',
                    isDark
                      ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10'
                      : 'bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10',
                  )}>
                  <Plus className="w-4 h-4" />
                  Build From Scratch
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Active Dashboard Builder ── */
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* Dashboard Name + Back */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-medium transition-colors',
                    'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]',
                  )}
                >
                  <ChevronRight className="w-3.5 h-3.5 -rotate-180" />
                  Templates
                </button>
                <div className="flex-1" />
                <input
                  type="text"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="Dashboard name..."
                  className={cn(
                    'w-full sm:w-72 px-4 py-2.5 text-sm font-semibold rounded-xl border outline-none transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/20 focus:border-white/[0.15] focus:bg-white/[0.05]'
                      : 'bg-black/[0.02] border-black/[0.06] text-zinc-900 placeholder:text-black/20 focus:border-black/[0.15] focus:bg-black/[0.04]',
                  )}
                />
              </div>

              {/* Main Builder Layout */}
              <div className="flex gap-4">
                {/* ── Widget Palette Sidebar ── */}
                <div className={cn(
                  'shrink-0 rounded-2xl border overflow-hidden transition-all duration-300',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                  paletteOpen ? 'w-56' : 'w-12',
                )}>
                  <button
                    onClick={() => setPaletteOpen(!paletteOpen)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-3 text-left transition-colors',
                      'hover:bg-[var(--app-hover-bg)]',
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {paletteOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}
                        >
                          Widgets
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.div
                      animate={{ rotate: paletteOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {paletteOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-2 space-y-1">
                          {widgetTypes.map((wt) => {
                            const WtIcon = wt.icon;
                            return (
                              <motion.button
                                key={wt.id}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left transition-colors cursor-pointer',
                                  isDark
                                    ? 'hover:bg-white/[0.06] text-white/60 hover:text-white/80'
                                    : 'hover:bg-black/[0.04] text-black/60 hover:text-black/80',
                                )}
                              >
                                <div className={cn(
                                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                                  'bg-[var(--app-hover-bg)]',
                                )}>
                                  <WtIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-medium">{wt.label}</span>
                                <GripVertical className={cn('w-3 h-3 ml-auto opacity-0 group-hover:opacity-50', 'text-[var(--app-text)]')} />
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Canvas Area ── */}
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {canvasWidgets.map((cw, i) => {
                      const WIcon = widgetIconMap[cw.type] || Activity;
                      const isHovered = hoveredWidget === cw.id;
                      return (
                        <motion.div
                          key={cw.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                          onMouseEnter={() => setHoveredWidget(cw.id)}
                          onMouseLeave={() => setHoveredWidget(null)}
                          className={cn(
                            'relative rounded-2xl border p-5 transition-all duration-200 cursor-move group',
                            isDark
                              ? 'bg-white/[0.03] border-white/[0.06]'
                              : 'bg-black/[0.02] border-black/[0.06]',
                            isHovered && (isDark
                              ? 'bg-white/[0.05] border-white/[0.12] shadow-lg shadow-white/[0.04]'
                              : 'bg-black/[0.04] border-black/[0.12] shadow-lg shadow-black/[0.04]'),
                          )}
                        >
                          {/* Drag handle */}
                          <div className={cn(
                            'absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity',
                          )}>
                            <GripVertical className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
                          </div>

                          {/* Widget preview content */}
                          <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                              isDark
                                ? 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                                : 'bg-black/[0.03] group-hover:bg-black/[0.06]',
                            )}>
                              <WIcon className={cn(
                                'w-6 h-6 transition-colors duration-200',
                                isDark
                                  ? 'text-white/20 group-hover:text-white/40'
                                  : 'text-black/20 group-hover:text-black/40',
                              )} />
                            </div>
                            <div className="text-center">
                              <p className={cn(
                                'text-xs font-semibold',
                                'text-[var(--app-text-secondary)]',
                              )}>
                                {cw.title}
                              </p>
                              <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-disabled)]')}>
                                {cw.type.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </p>
                            </div>

                            {/* Hover overlay */}
                            <AnimatePresence>
                              {isHovered && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className={cn(
                                    'absolute inset-0 rounded-2xl flex items-center justify-center gap-2',
                                    isDark ? 'bg-black/40 backdrop-blur-[2px]' : 'bg-white/40 backdrop-blur-[2px]',
                                  )}
                                >
                                  <button className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                                    isDark
                                      ? 'bg-white/10 hover:bg-white/20 text-white'
                                      : 'bg-black/10 hover:bg-black/20 text-black',
                                  )}
                                    title="Edit"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                  <button className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                                    isDark
                                      ? 'bg-white/10 hover:bg-white/20 text-white'
                                      : 'bg-black/10 hover:bg-black/20 text-black',
                                  )}
                                    title="Remove"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Status indicator */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t"
                            style={{ borderColor: 'var(--app-hover-bg)' }}>
                            <span className={cn(
                              'flex items-center gap-1 text-[10px]',
                              isDark ? 'text-emerald-400/60' : 'text-emerald-600',
                            )}>
                              <Eye className="w-3 h-3" />
                              Active
                            </span>
                            <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
                              {cw.type}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Add Widget CTA */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.35 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'rounded-2xl border-2 border-dashed p-5 transition-all duration-200 group min-h-[240px]',
                        isDark
                          ? 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
                          : 'border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02]',
                      )}
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-3 min-h-[180px]">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                          isDark
                            ? 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                            : 'bg-black/[0.03] group-hover:bg-black/[0.06]',
                        )}>
                          <Plus className={cn(
                            'w-6 h-6 transition-colors',
                            isDark ? 'text-white/20 group-hover:text-white/40' : 'text-black/20 group-hover:text-black/40',
                          )} />
                        </div>
                        <p className={cn(
                          'text-xs font-semibold',
                          isDark ? 'text-white/30 group-hover:text-white/50' : 'text-black/30 group-hover:text-black/50',
                        )}>
                          Add Widget
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* ── Dashboard Settings Bar ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className={cn(
                  'rounded-2xl border p-4 sm:p-5',
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.06]'
                    : 'bg-black/[0.02] border-black/[0.06]',
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Theme Selector */}
                  <div className="flex items-center gap-3">
                    <Palette className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <div className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-2',
                      'border-[var(--app-border)] bg-[var(--app-hover-bg)]',
                    )}>
                      <select
                        value={themeOption}
                        onChange={(e) => setThemeOption(e.target.value)}
                        className={cn(
                          'bg-transparent text-xs font-medium outline-none appearance-none cursor-pointer pr-4',
                          'text-[var(--app-text)]',
                        )}
                      >
                        <option value="white-label" className="bg-white text-black">White Label</option>
                        <option value="dark" className="bg-zinc-900 text-white">Dark Theme</option>
                        <option value="light" className="bg-white text-black">Light Theme</option>
                        <option value="brand" className="bg-white text-black">Brand Colors</option>
                      </select>
                      <ChevronDown className={cn(
                        'absolute right-2 w-3 h-3 pointer-events-none',
                        'text-[var(--app-text-muted)]',
                      )} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200',
                      isDark
                        ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white'
                        : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.08] hover:text-black',
                    )}>
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200',
                      isDark
                        ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white'
                        : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.08] hover:text-black',
                    )}>
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className={cn(
                      'inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200',
                      isDark
                        ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10'
                        : 'bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10',
                    )}>
                      <Save className="w-4 h-4" />
                      Save Dashboard
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
