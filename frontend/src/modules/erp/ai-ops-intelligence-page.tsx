'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, AlertTriangle, Zap, TrendingUp, Shield, Users,
  Truck, BarChart3, DollarSign, Target, ArrowRight, Brain,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Sparkles
} from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockAiOpsInsights } from '@/modules/erp/data/mock-data';
import type { AiOpsSeverity, AiOpsType } from '@/modules/erp/types';

type FilterKey = 'all' | AiOpsSeverity;

const ITEMS_PER_PAGE = 6;

function getSeverityConfig(severity: AiOpsSeverity, isDark: boolean) {
  switch (severity) {
    case 'critical': return {
      badge: isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200',
      border: 'border-red-500/30',
      glow: true,
      dot: 'bg-red-500',
      label: 'Critical'
    };
    case 'high': return {
      badge: isDark ? 'bg-orange-500/15 text-orange-300 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
      border: 'border-orange-500/20',
      glow: false,
      dot: 'bg-orange-500',
      label: 'High'
    };
    case 'medium': return {
      badge: isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
      border: 'border-amber-500/20',
      glow: false,
      dot: 'bg-amber-500',
      label: 'Medium'
    };
    case 'low': return {
      badge: isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      border: 'border-emerald-500/20',
      glow: false,
      dot: 'bg-emerald-500',
      label: 'Low'
    };
  }
}

function getTypeConfig(type: AiOpsType) {
  switch (type) {
    case 'cost_anomaly': return { icon: DollarSign, label: 'Cost Anomaly', color: 'text-red-500 dark:text-red-400' };
    case 'risk_prediction': return { icon: AlertTriangle, label: 'Risk Prediction', color: 'text-orange-400' };
    case 'optimization': return { icon: Zap, label: 'Optimization', color: 'text-emerald-500 dark:text-emerald-400' };
    case 'compliance': return { icon: Shield, label: 'Compliance', color: 'text-amber-500 dark:text-amber-400' };
    case 'resource_alert': return { icon: Users, label: 'Resource Alert', color: 'text-sky-400' };
    case 'delivery_risk': return { icon: Truck, label: 'Delivery Risk', color: 'text-red-500 dark:text-red-400' };
    case 'revenue_forecast': return { icon: TrendingUp, label: 'Revenue Forecast', color: 'text-emerald-500 dark:text-emerald-400' };
    case 'vendor_risk': return { icon: BarChart3, label: 'Vendor Risk', color: 'text-orange-400' };
  }
}

function AiOpsIntelligencePageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockAiOpsInsights];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.affectedEntities.some(e => e.toLowerCase().includes(q))
      );
    }
    if (activeFilter !== 'all') result = result.filter(i => i.severity === activeFilter);
    return result;
  }, [searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    critical: mockAiOpsInsights.filter(i => i.severity === 'critical').length,
    high: mockAiOpsInsights.filter(i => i.severity === 'high').length,
    optimizations: mockAiOpsInsights.filter(i => i.type === 'optimization').length,
    avgConfidence: Math.round(mockAiOpsInsights.reduce((s, i) => s + i.confidence, 0) / mockAiOpsInsights.length),
  }), []);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: mockAiOpsInsights.length },
    { key: 'critical', label: 'Critical', count: stats.critical },
    { key: 'high', label: 'High', count: stats.high },
    { key: 'medium', label: 'Medium', count: mockAiOpsInsights.filter(i => i.severity === 'medium').length },
    { key: 'low', label: 'Low', count: mockAiOpsInsights.filter(i => i.severity === 'low').length },
  ];

  return (
    <PageShell title="AI Intelligence" icon={Sparkles} headerRight={
      <div className={cn('flex items-center gap-2', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]', 'px-3 py-2 rounded-xl border w-full sm:w-64')}>
        <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
        <input type="text" placeholder="Search insights..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
      </div>
    }>
      <div className="space-y-6">

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button key={filter.key} onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', isActive ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'))}>
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? (isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]') : (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'))}>{filter.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical Alerts', value: stats.critical, icon: AlertTriangle, warn: true },
            { label: 'High Risk', value: stats.high, icon: Zap, warn: stats.high > 0 },
            { label: 'Optimizations', value: stats.optimizations, icon: Target },
            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, icon: Brain },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.warn ? (isDark ? 'bg-red-500/15' : 'bg-red-50') : (isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'))}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.warn ? 'text-red-500 dark:text-red-400' : (isDark ? 'text-white/40' : 'text-black/40'))} />
                </div>
              </div>
              <p className={cn('text-xl font-bold', stat.warn && 'text-red-500 dark:text-red-400')}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Insight Cards - Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((insight, idx) => {
            const severity = getSeverityConfig(insight.severity, isDark);
            const typeConfig = getTypeConfig(insight.type);
            const TypeIcon = typeConfig.icon;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 space-y-3 transition-colors',
                  isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-white hover:bg-gray-50',
                  severity.glow && (isDark ? `border-red-500/30` : 'border-red-200')
                )}
              >
                {/* Critical glow animation */}
                {severity.glow && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ boxShadow: ['0 0 0 0 rgba(239,68,68,0)', '0 0 20px 2px rgba(239,68,68,0.08)', '0 0 0 0 rgba(239,68,68,0)'] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                )}

                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                      <TypeIcon className={cn('w-4 h-4', typeConfig.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] font-medium', typeConfig.color)}>{typeConfig.label}</span>
                        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border', severity.badge)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', severity.dot)} />
                          {severity.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className={cn('text-sm font-semibold leading-tight', severity.glow && 'text-red-500 dark:text-red-400')}>
                  {insight.title}
                </h3>

                {/* Description */}
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                  {insight.description}
                </p>

                {/* Recommendation */}
                <div className={cn('rounded-xl border p-2.5 space-y-1', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-bold', isDark ? 'text-white/20' : 'text-black/20')}>Recommendation</p>
                  <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/60' : 'text-black/60')}>{insight.recommendation}</p>
                </div>

                {/* Affected Entities */}
                <div className="flex flex-wrap gap-1.5">
                  {insight.affectedEntities.map(entity => (
                    <span key={entity} className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium', isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.04] text-black/50')}>
                      {entity}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                  {/* Confidence Bar */}
                  <div className="flex items-center gap-2 flex-1">
                    <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/25' : 'text-black/25')}>Confidence</span>
                    <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden max-w-[120px]', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.confidence}%` }}
                        transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                        className={cn('h-full rounded-full', insight.confidence >= 90 ? 'bg-emerald-500' : insight.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500')}
                      />
                    </div>
                    <span className={cn('text-[11px] font-bold', insight.confidence >= 90 ? 'text-emerald-500 dark:text-emerald-400' : insight.confidence >= 75 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400')}>
                      {insight.confidence}%
                    </span>
                  </div>
                  <button className={cn(
                    'h-8 px-3 rounded-lg flex items-center gap-1.5 text-[11px] font-medium transition-colors shrink-0 ml-3',
                    severity.glow
                      ? (isDark ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/20' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200')
                      : (isDark ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/70 hover:bg-black/[0.1]')
                  )}>
                    Take Action
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className={cn('rounded-2xl border py-16 flex flex-col items-center justify-center', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
              <Brain className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
            </div>
            <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>No insights found</p>
            <p className={cn('text-xs', isDark ? 'text-white/25' : 'text-black/25')}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
            <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors', currentPage === pageNum ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'text-white/50 hover:bg-white/[0.06]' : 'text-black/50 hover:bg-black/[0.06]'))}>{pageNum}</button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default memo(AiOpsIntelligencePageInner);
