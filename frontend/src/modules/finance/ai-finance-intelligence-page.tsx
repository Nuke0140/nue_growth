'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles, BrainCircuit, AlertTriangle, Clock, DollarSign, TrendingDown, Shield, Tag, RefreshCw, Target, Lightbulb, Users, Zap,
} from 'lucide-react';
import { aiFinanceInsights } from '@/modules/finance/data/mock-data';
import type { AIFinanceInsight } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

type CategoryFilter = 'all' | 'delayed-payment' | 'margin-leak' | 'overspend-anomaly' | 'low-runway' | 'pricing-recommendation' | 'budget-reallocation' | 'churn-risk';
type ImpactFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

const typeIcons: Record<string, React.ElementType> = {
  'delayed-payment': Clock,
  'margin-leak': TrendingDown,
  'overspend-anomaly': AlertTriangle,
  'low-runway': Shield,
  'pricing-recommendation': Tag,
  'service-pricing': DollarSign,
  'budget-reallocation': Target,
  'churn-risk': Users,
};

const typeColors: Record<string, { color: string; bg: string }> = {
  'delayed-payment': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'margin-leak': { color: 'text-rose-400', bg: 'bg-rose-500/10' },
  'overspend-anomaly': { color: 'text-red-400', bg: 'bg-red-500/10' },
  'low-runway': { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  'pricing-recommendation': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'service-pricing': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'budget-reallocation': { color: 'text-violet-400', bg: 'bg-violet-500/10' },
  'churn-risk': { color: 'text-red-400', bg: 'bg-red-500/10' },
};

const typeLabels: Record<string, string> = {
  'delayed-payment': 'Delayed Payment',
  'margin-leak': 'Margin Leak',
  'overspend-anomaly': 'Overspend',
  'low-runway': 'Low Runway',
  'pricing-recommendation': 'Pricing',
  'service-pricing': 'Pricing',
  'budget-reallocation': 'Budget',
  'churn-risk': 'Churn',
};

const impactColors: Record<string, (isDark: boolean) => string> = {
  critical: (isDark) => 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]',
  high: (isDark) => isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600',
  medium: (isDark) => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
  low: (isDark) => 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
};

const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };

const categoryTabs: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Delayed Payment', value: 'delayed-payment' },
  { label: 'Margin Leak', value: 'margin-leak' },
  { label: 'Overspend', value: 'overspend-anomaly' },
  { label: 'Low Runway', value: 'low-runway' },
  { label: 'Pricing', value: 'pricing-recommendation' },
  { label: 'Budget', value: 'budget-reallocation' },
  { label: 'Churn', value: 'churn-risk' },
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
    let items = [...aiFinanceInsights];
    if (categoryFilter !== 'all') items = items.filter(i => i.type === categoryFilter);
    if (impactFilter !== 'all') items = items.filter(i => i.impact === impactFilter);
    items.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
    return items;
  }, [categoryFilter, impactFilter]);

  const totalSavings = useMemo(() => aiFinanceInsights.reduce((s, i) => s + i.potentialSaving, 0), []);
  const criticalCount = aiFinanceInsights.filter(i => i.impact === 'critical').length;
  const avgConfidence = useMemo(() => {
    const total = aiFinanceInsights.reduce((s, i) => s + i.confidence, 0);
    return (total / aiFinanceInsights.length).toFixed(0);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Sparkles className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Finance Intelligence</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>AI CFO Moat Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <BrainCircuit className="w-4 h-4" /> Run Analysis
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Insights', value: aiFinanceInsights.length, icon: BrainCircuit, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
            { label: 'Potential Savings', value: formatINR(totalSavings), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
            { label: 'Critical Alerts', value: criticalCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
            { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Target, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', kpi.bg)}><kpi.icon className={cn('w-4 h-4', kpi.color)} /></div>
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
                'px-3 py-1.5 text-[11px] font-medium rounded-[var(--app-radius-lg)] whitespace-nowrap transition-colors',
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
                'px-3 py-1.5 text-[11px] font-medium rounded-[var(--app-radius-lg)] whitespace-nowrap transition-colors',
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
                    : ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
                )}>{aiFinanceInsights.filter(i => i.impact === tab.value).length}</span>
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors duration-200',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]',
                  insight.impact === 'critical' && (isDark ? 'border-red-500/20' : 'border-red-200')
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', colors.bg)}>
                    <Icon className={cn('w-5 h-5', colors.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{insight.title}</p>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', iColor(isDark))}>{insight.impact}</Badge>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>{typeLabels[insight.type] || insight.type}</Badge>
                    </div>

                    {/* Description */}
                    <p className={cn('text-xs leading-relaxed mb-3', 'text-[var(--app-text-secondary)]')}>{insight.description}</p>

                    {/* Confidence Meter */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Confidence</span>
                        <div className={cn('w-24 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                            className={cn('h-full rounded-full', insight.confidence >= 90 ? 'bg-emerald-500' : insight.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium', insight.confidence >= 90 ? 'text-emerald-500' : insight.confidence >= 75 ? 'text-amber-500' : 'text-red-500')}>{insight.confidence}%</span>
                      </div>
                    </div>

                    {/* Metric Comparison */}
                    {insight.metric && insight.currentValue !== undefined && insight.thresholdValue !== undefined && (
                      <div className={cn('flex items-center gap-3 mb-3 p-2.5 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
                        <div>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{insight.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-bold', insight.currentValue < insight.thresholdValue ? 'text-red-500' : 'text-emerald-500')}>{insight.currentValue}</span>
                            <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>vs</span>
                            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{insight.thresholdValue}</span>
                            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>threshold</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className={cn('p-3 rounded-[var(--app-radius-lg)] mb-3', 'bg-[var(--app-hover-bg)]')}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb className={cn('w-4 h-4', colors.color)} />
                        <span className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Recommendation</span>
                      </div>
                      <p className={cn('text-xs leading-relaxed', 'text-[var(--app-text-secondary)]')}>{insight.recommendation}</p>
                    </div>

                    {/* Footer: Saving + Client */}
                    <div className="flex items-center justify-between">
                      {insight.potentialSaving > 0 && (
                        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-success-bg)]')}>
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-500">Potential saving: {formatINR(insight.potentialSaving)}</span>
                        </div>
                      )}
                      {insight.client && (
                        <div className="flex items-center gap-1.5">
                          <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                          <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{insight.client}</span>
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
          <div className={cn('flex flex-col items-center justify-center py-16', 'text-[var(--app-text-muted)]')}>
            <BrainCircuit className="w-10 h-10 mb-3" />
            <p className="text-sm">No insights match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
