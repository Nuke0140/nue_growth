'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles, BrainCircuit, AlertTriangle, Clock, DollarSign, TrendingDown, Shield, Tag, RefreshCw, Target, Lightbulb, Users, Zap,
} from 'lucide-react';
import { aiInsights } from '@/modules/finance/data/mock-data';
import type { AIInsight } from '@/modules/finance/types';


type CategoryFilter = 'all' | 'cash-alert' | 'payment-risk' | 'overspend' | 'margin-leak' | 'pricing' | 'optimization' | 'tax-alert';
type ImpactFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

const typeIcons: Record<string, React.ElementType> = {
  'cash-alert': Clock,
  'payment-risk': AlertTriangle,
  'overspend': TrendingDown,
  'margin-leak': TrendingDown,
  'pricing': Tag,
  'optimization': Zap,
  'tax-alert': Shield,
};

const typeColors: Record<string, { color: string; bg: string }> = {
  'cash-alert': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'payment-risk': { color: 'text-red-400', bg: 'bg-red-500/10' },
  'overspend': { color: 'text-rose-400', bg: 'bg-rose-500/10' },
  'margin-leak': { color: 'text-rose-400', bg: 'bg-rose-500/10' },
  'pricing': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'optimization': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'tax-alert': { color: 'text-orange-400', bg: 'bg-orange-500/10' },
};

const typeLabels: Record<string, string> = {
  'cash-alert': 'Cash Alert',
  'payment-risk': 'Payment Risk',
  'overspend': 'Overspend',
  'margin-leak': 'Margin Leak',
  'pricing': 'Pricing',
  'optimization': 'Optimization',
  'tax-alert': 'Tax Alert',
};

const impactColors: Record<string, (isDark: boolean) => string> = {
  critical: (isDark) => isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
  high: (isDark) => isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600',
  medium: (isDark) => isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600',
  low: (isDark) => isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
};

const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };

const categoryTabs: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cash Alert', value: 'cash-alert' },
  { label: 'Payment Risk', value: 'payment-risk' },
  { label: 'Overspend', value: 'overspend' },
  { label: 'Margin Leak', value: 'margin-leak' },
  { label: 'Pricing', value: 'pricing' },
  { label: 'Optimization', value: 'optimization' },
  { label: 'Tax Alert', value: 'tax-alert' },
];

const impactTabs: { label: string; value: ImpactFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function AIFinanceIntelligencePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>('all');

  const filteredInsights = useMemo(() => {
    let items = [...aiInsights];
    if (categoryFilter !== 'all') items = items.filter(i => i.type === categoryFilter);
    if (impactFilter !== 'all') items = items.filter(i => i.impact === impactFilter);
    items.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
    return items;
  }, [categoryFilter, impactFilter]);

  const totalSavings = useMemo(() => aiInsights.reduce((s, i) => s + i.potentialSaving, 0), []);
  const criticalCount = aiInsights.filter(i => i.impact === 'critical').length;
  const avgConfidence = useMemo(() => {
    const total = aiInsights.reduce((s, i) => s + i.confidence, 0);
    return (total / aiInsights.length).toFixed(0);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Sparkles className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Finance Intelligence</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>AI CFO Moat Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
              <BrainCircuit className="w-4 h-4" /> Run Analysis
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Insights', value: aiInsights.length, icon: BrainCircuit, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50' },
            { label: 'Potential Savings', value: formatINR(totalSavings), icon: DollarSign, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
            { label: 'Critical Alerts', value: criticalCount, icon: AlertTriangle, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
            { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Target, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{kpi.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', kpi.bg)}><kpi.icon className={cn('w-3.5 h-3.5', kpi.color)} /></div>
              </div>
              <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categoryTabs.map(tab => (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-medium rounded-xl whitespace-nowrap transition-colors',
                categoryFilter === tab.value
                  ? (isDark ? 'bg-white/[0.08] text-white/80' : 'bg-black/[0.08] text-black/80')
                  : (isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.04]')
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Impact Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {impactTabs.map(tab => (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              onClick={() => setImpactFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 text-[11px] font-medium rounded-xl whitespace-nowrap transition-colors',
                impactFilter === tab.value
                  ? (isDark ? 'bg-white/[0.08] text-white/80' : 'bg-black/[0.08] text-black/80')
                  : (isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.04]')
              )}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className={cn(
                  'ml-1 text-[9px] px-1.5 py-0 rounded-full',
                  impactFilter === tab.value
                    ? (isDark ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60')
                    : (isDark ? 'bg-white/[0.06] text-white/30' : 'bg-black/[0.06] text-black/30')
                )}>{aiInsights.filter(i => i.impact === tab.value).length}</span>
              )}
            </Button>
          ))}
        </div>

        {/* AI Insight Cards */}
        <div className="space-y-3">
          {filteredInsights.map((insight, i) => {
            const Icon = typeIcons[insight.type] || Lightbulb;
            const colors = typeColors[insight.type] || { color: 'text-violet-400', bg: 'bg-violet-500/10' };
            const iColor = impactColors[insight.impact];

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-200',
                  isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]',
                  insight.impact === 'critical' && (isDark ? 'border-red-500/20' : 'border-red-200')
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
                    <Icon className={cn('w-5 h-5', colors.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{insight.title}</p>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', iColor(isDark))}>{insight.impact}</Badge>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>{typeLabels[insight.type] || insight.type}</Badge>
                    </div>

                    {/* Description */}
                    <p className={cn('text-xs leading-relaxed mb-3', isDark ? 'text-white/50' : 'text-black/50')}>{insight.description}</p>

                    {/* Confidence Meter */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Confidence</span>
                        <div className={cn('w-24 h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.15 }}
                            className={cn('h-full rounded-full', insight.confidence >= 90 ? 'bg-emerald-500' : insight.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium', insight.confidence >= 90 ? 'text-emerald-500' : insight.confidence >= 75 ? 'text-amber-500' : 'text-red-500')}>{insight.confidence}%</span>
                      </div>
                    </div>

                    {/* Metric Comparison */}
                    {insight.metric && insight.currentValue !== undefined && insight.thresholdValue !== undefined && (
                      <div className={cn('flex items-center gap-3 mb-3 p-2.5 rounded-lg', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                        <div>
                          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{insight.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-bold', insight.currentValue < insight.thresholdValue ? 'text-red-500' : 'text-emerald-500')}>{insight.currentValue}</span>
                            <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>vs</span>
                            <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{insight.thresholdValue}</span>
                            <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>threshold</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className={cn('p-3 rounded-xl mb-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb className={cn('w-3 h-3', colors.color)} />
                        <span className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>Recommendation</span>
                      </div>
                      <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/60' : 'text-black/60')}>{insight.recommendation}</p>
                    </div>

                    {/* Footer: Saving + Client */}
                    <div className="flex items-center justify-between">
                      {insight.potentialSaving > 0 && (
                        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg', isDark ? 'bg-emerald-500/10' : 'bg-emerald-50')}>
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-500">Potential saving: {formatINR(insight.potentialSaving)}</span>
                        </div>
                      )}
                      {insight.client && (
                        <div className="flex items-center gap-1.5">
                          <Users className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
                          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{insight.client}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredInsights.length === 0 && (
          <div className={cn('flex flex-col items-center justify-center py-16', isDark ? 'text-white/30' : 'text-black/30')}>
            <BrainCircuit className="w-10 h-10 mb-3" />
            <p className="text-sm">No insights match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
