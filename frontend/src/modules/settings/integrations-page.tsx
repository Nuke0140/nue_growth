'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Puzzle, Link, Link2, Unlink, AlertTriangle, Clock, RefreshCw,
  CheckCircle, XCircle, Zap, ArrowRight, ExternalLink, ChevronRight,
  Search,
} from 'lucide-react';
import { integrations } from './data/mock-data';

const categoryTabs = ['All', 'Advertising', 'Payments', 'Communication', 'Productivity', 'Automation'];

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  connected: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500', icon: CheckCircle },
  disconnected: { color: 'text-zinc-400', bg: 'bg-zinc-500/15', border: 'border-zinc-500', icon: Unlink },
  error: { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500', icon: AlertTriangle },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500', icon: Clock },
};

const categoryColors: Record<string, string> = {
  Advertising: 'bg-blue-500/15 text-blue-400',
  Payments: 'bg-emerald-500/15 text-emerald-400',
  Communication: 'bg-violet-500/15 text-violet-400',
  Productivity: 'bg-amber-500/15 text-amber-400',
  Automation: 'bg-pink-500/15 text-pink-400',
};

const categoryColorsLight: Record<string, string> = {
  Advertising: 'bg-blue-50 text-blue-600',
  Payments: 'bg-emerald-50 text-emerald-600',
  Communication: 'bg-violet-50 text-violet-600',
  Productivity: 'bg-amber-50 text-amber-600',
  Automation: 'bg-pink-50 text-pink-600',
};

const iconColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f97316', '#8b5cf6', '#0ea5e9', '#84cc16'];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function IntegrationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((int) => {
      const matchesCategory = activeCategory === 'All' || int.category === activeCategory;
      const matchesSearch = !searchQuery ||
        int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        int.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const summaryStats = useMemo(() => ({
    connected: integrations.filter((i) => i.status === 'connected').length,
    disconnected: integrations.filter((i) => i.status === 'disconnected').length,
    errors: integrations.filter((i) => i.status === 'error').length,
    pending: integrations.filter((i) => i.status === 'pending').length,
  }), []);

  const kpiCards = [
    { label: 'Connected', value: summaryStats.connected, color: 'text-emerald-400', bgColor: 'bg-[var(--app-success-bg)]' },
    { label: 'Disconnected', value: summaryStats.disconnected, color: 'text-zinc-400', bgColor: isDark ? 'bg-zinc-500/10' : 'bg-zinc-100' },
    { label: 'Errors', value: summaryStats.errors, color: 'text-red-400', bgColor: 'bg-[var(--app-danger-bg)]' },
    { label: 'Pending', value: summaryStats.pending, color: 'text-amber-400', bgColor: 'bg-[var(--app-warning-bg)]' },
  ];

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
              <Puzzle className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Integrations</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Connect and manage your tools
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <p className={cn('text-2xl font-bold', kpi.color)}>
                {kpi.value}
              </p>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Category Tabs + Search ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                  activeCategory === cat
                    ? ('bg-[var(--app-info-bg)] text-[var(--app-info)] border border-[var(--app-info)]/30')
                    : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.04] hover:bg-black/[0.04]'),
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={cn(
            'flex items-center gap-2 rounded-[var(--app-radius-lg)] border px-3 py-2 max-w-sm',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
              )}
            />
          </div>
        </div>

        {/* ── Integration Cards Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredIntegrations.map((integ, i) => {
            const status = statusConfig[integ.status] || statusConfig.disconnected;
            const StatusIcon = status.icon;
            const catColor = isDark ? categoryColors[integ.category] : categoryColorsLight[integ.category];
            const iconBg = iconColors[i % iconColors.length];

            return (
              <motion.div
                key={integ.id}
                variants={fadeUp}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 sm:p-app-xl shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
                  integ.status === 'error' && (isDark ? 'border-l-red-500/50' : 'border-l-red-400/50'),
                )}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: iconBg + '30', color: iconBg }}
                    >
                      {integ.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                        {integ.name}
                      </p>
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium', catColor)}>
                        {integ.category}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 capitalize',
                    status.bg,
                    status.color,
                  )}>
                    <StatusIcon className="w-4 h-4" />
                    {integ.status}
                  </span>
                </div>

                {/* Description */}
                <p className={cn('text-xs leading-relaxed line-clamp-2 mb-3', 'text-[var(--app-text-muted)]')}>
                  {integ.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-1.5 mb-3">
                  {integ.connectedAt && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Connected</span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {new Date(integ.connectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {integ.tokenExpiry && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Token Expiry</span>
                      <span className={cn(
                        'text-[10px]',
                        new Date(integ.tokenExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? ('text-[var(--app-warning)]')
                          : ('text-[var(--app-text-muted)]'),
                      )}>
                        {new Date(integ.tokenExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {integ.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last Sync</span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {new Date(integ.lastSync).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  {integ.fieldMappings.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Field Mappings</span>
                      <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-secondary)]')}>
                        {integ.fieldMappings.length} fields
                      </span>
                    </div>
                  )}
                </div>

                {/* Sync Logs Mini-Timeline */}
                {integ.syncLogs.length > 0 && (
                  <div className={cn('rounded-[var(--app-radius-lg)] p-2.5 mb-3', 'bg-[var(--app-hover-bg)]')}>
                    <p className={cn('text-[10px] font-medium mb-1.5', 'text-[var(--app-text-muted)]')}>Recent Sync Logs</p>
                    <div className="space-y-1">
                      {integ.syncLogs.slice(0, 3).map((log, logIdx) => (
                        <div key={logIdx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {log.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>
                              {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {log.records > 0 && (
                            <span className={cn('text-[9px] font-medium shrink-0', 'text-[var(--app-text-muted)]')}>
                              {log.records} records
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
                  {integ.status === 'connected' || integ.status === 'error' ? (
                    <>
                      <button className={cn(
                        'flex-1 rounded-[var(--app-radius-lg)] py-2 text-xs font-medium transition-colors text-center',
                        isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
                      )}>
                        Disconnect
                      </button>
                      {integ.status === 'error' && (
                        <button className={cn(
                          'flex-1 rounded-[var(--app-radius-lg)] py-2 text-xs font-medium transition-colors text-center',
                          isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                        )}>
                          <RefreshCw className="w-4 h-4 inline mr-1" />
                          Retry
                        </button>
                      )}
                      <button className={cn(
                        'rounded-[var(--app-radius-lg)] py-2 px-3 text-xs font-medium transition-colors',
                        isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08]',
                      )}>
                        <Zap className="w-4 h-4" />
                      </button>
                    </>
                  ) : integ.status === 'pending' ? (
                    <button className="flex-1 rounded-[var(--app-radius-lg)] py-2 text-xs font-medium transition-colors text-center bg-amber-500/15 text-amber-400 hover:bg-amber-500/25">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Awaiting Setup
                    </button>
                  ) : (
                    <button className={cn(
                      'flex-1 rounded-[var(--app-radius-lg)] py-2 text-xs font-medium transition-colors text-center',
                      isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                    )}>
                      <Link className="w-4 h-4 inline mr-1" />
                      Connect
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Browse Marketplace CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-6 flex flex-col sm:flex-row items-center justify-between gap-4',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div>
            <h3 className={cn('text-sm font-semibold mb-1', 'text-[var(--app-text)]')}>
              Need more integrations?
            </h3>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              Browse 200+ integrations in our marketplace — CRM, ERP, Analytics, Communication, and more.
            </p>
          </div>
          <button className={cn(
            'inline-flex items-center gap-2 rounded-[var(--app-radius-lg)] px-app-xl py-2.5 text-sm font-medium transition-colors shrink-0',
            isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
          )}>
            Browse Marketplace
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
