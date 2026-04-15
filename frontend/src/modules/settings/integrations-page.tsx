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
    { label: 'Connected', value: summaryStats.connected, color: 'text-emerald-400', bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { label: 'Disconnected', value: summaryStats.disconnected, color: 'text-zinc-400', bgColor: isDark ? 'bg-zinc-500/10' : 'bg-zinc-100' },
    { label: 'Errors', value: summaryStats.errors, color: 'text-red-400', bgColor: isDark ? 'bg-red-500/10' : 'bg-red-50' },
    { label: 'Pending', value: summaryStats.pending, color: 'text-amber-400', bgColor: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
  ];

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
              <Puzzle className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Integrations</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
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
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
              )}
            >
              <p className={cn('text-2xl font-bold', kpi.color)}>
                {kpi.value}
              </p>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
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
                    ? (isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200')
                    : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.04] hover:bg-black/[0.04]'),
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-2 max-w-sm',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25',
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
                  'rounded-2xl border p-4 sm:p-5 shadow-sm transition-all',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
                  integ.status === 'error' && (isDark ? 'border-l-red-500/50' : 'border-l-red-400/50'),
                )}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: iconBg + '30', color: iconBg }}
                    >
                      {integ.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
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
                    <StatusIcon className="w-3 h-3" />
                    {integ.status}
                  </span>
                </div>

                {/* Description */}
                <p className={cn('text-xs leading-relaxed line-clamp-2 mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
                  {integ.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-1.5 mb-3">
                  {integ.connectedAt && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Connected</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                        {new Date(integ.connectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {integ.tokenExpiry && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Token Expiry</span>
                      <span className={cn(
                        'text-[10px]',
                        new Date(integ.tokenExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? (isDark ? 'text-amber-400' : 'text-amber-600')
                          : (isDark ? 'text-white/40' : 'text-black/40'),
                      )}>
                        {new Date(integ.tokenExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {integ.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Last Sync</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                        {new Date(integ.lastSync).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  {integ.fieldMappings.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Field Mappings</span>
                      <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
                        {integ.fieldMappings.length} fields
                      </span>
                    </div>
                  )}
                </div>

                {/* Sync Logs Mini-Timeline */}
                {integ.syncLogs.length > 0 && (
                  <div className={cn('rounded-lg p-2.5 mb-3', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}>
                    <p className={cn('text-[10px] font-medium mb-1.5', isDark ? 'text-white/30' : 'text-black/30')}>Recent Sync Logs</p>
                    <div className="space-y-1">
                      {integ.syncLogs.slice(0, 3).map((log, logIdx) => (
                        <div key={logIdx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {log.status === 'success' ? (
                              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                            )}
                            <span className={cn('text-[10px] truncate', isDark ? 'text-white/40' : 'text-black/40')}>
                              {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {log.records > 0 && (
                            <span className={cn('text-[9px] font-medium shrink-0', isDark ? 'text-white/30' : 'text-black/30')}>
                              {log.records} records
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                  {integ.status === 'connected' || integ.status === 'error' ? (
                    <>
                      <button className={cn(
                        'flex-1 rounded-lg py-2 text-xs font-medium transition-colors text-center',
                        isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
                      )}>
                        Disconnect
                      </button>
                      {integ.status === 'error' && (
                        <button className={cn(
                          'flex-1 rounded-lg py-2 text-xs font-medium transition-colors text-center',
                          isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                        )}>
                          <RefreshCw className="w-3 h-3 inline mr-1" />
                          Retry
                        </button>
                      )}
                      <button className={cn(
                        'rounded-lg py-2 px-3 text-xs font-medium transition-colors',
                        isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08]',
                      )}>
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : integ.status === 'pending' ? (
                    <button className="flex-1 rounded-lg py-2 text-xs font-medium transition-colors text-center bg-amber-500/15 text-amber-400 hover:bg-amber-500/25">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Awaiting Setup
                    </button>
                  ) : (
                    <button className={cn(
                      'flex-1 rounded-lg py-2 text-xs font-medium transition-colors text-center',
                      isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                    )}>
                      <Link className="w-3 h-3 inline mr-1" />
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
            'rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <div>
            <h3 className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-zinc-900')}>
              Need more integrations?
            </h3>
            <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
              Browse 200+ integrations in our marketplace — CRM, ERP, Analytics, Communication, and more.
            </p>
          </div>
          <button className={cn(
            'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors shrink-0',
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
