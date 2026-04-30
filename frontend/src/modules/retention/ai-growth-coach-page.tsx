'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert, Award, TrendingUp, RefreshCw, Star, BarChart3,
  Grid3x3, Zap, BrainCircuit, ChevronRight, Filter, Target,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { aiGrowthInsights } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { AIGrowthInsight } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  'churn-prevention': { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Churn Prevention' },
  'loyalty-offer': { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Loyalty' },
  'expansion-playbook': { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Expansion' },
  'renewal-pricing': { icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Renewal' },
  'promoter-activation': { icon: Star, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'Promoter' },
  'ltv-growth': { icon: BarChart3, color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'LTV' },
  'cohort-insight': { icon: Grid3x3, color: 'text-teal-400', bg: 'bg-teal-500/10', label: 'Cohort' },
  'engagement-boost': { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Engagement' },
};

const impactConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'bg-red-500/15 text-red-400' },
  high: { label: 'High', color: 'bg-amber-500/15 text-amber-400' },
  medium: { label: 'Medium', color: 'bg-sky-500/15 text-sky-400' },
  low: { label: 'Low', color: 'bg-emerald-500/15 text-emerald-400' },
};

type CategoryFilter = 'all' | string;
type ImpactFilter = 'all' | AIGrowthInsight['impact'];

const impactOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const categories: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Churn Prevention', value: 'churn-prevention' },
  { label: 'Loyalty', value: 'loyalty-offer' },
  { label: 'Expansion', value: 'expansion-playbook' },
  { label: 'Renewal', value: 'renewal-pricing' },
  { label: 'Promoter', value: 'promoter-activation' },
  { label: 'LTV', value: 'ltv-growth' },
  { label: 'Cohort', value: 'cohort-insight' },
  { label: 'Engagement', value: 'engagement-boost' },
];

export default function AIGrowthCoachPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, Record<number, boolean>>>({});

  // Filtered and sorted insights
  const filteredInsights = useMemo(() => {
    let data = [...aiGrowthInsights];
    if (categoryFilter !== 'all') data = data.filter((i) => i.type === categoryFilter);
    if (impactFilter !== 'all') data = data.filter((i) => i.impact === impactFilter);
    return data.sort((a, b) => (impactOrder[a.impact] ?? 9) - (impactOrder[b.impact] ?? 9));
  }, [categoryFilter, impactFilter]);

  // Summary stats
  const summary = useMemo(() => {
    const critical = aiGrowthInsights.filter((i) => i.impact === 'critical').length;
    const high = aiGrowthInsights.filter((i) => i.impact === 'high').length;
    const totalPotential = aiGrowthInsights.reduce((s, i) => s + i.potentialImpact, 0);
    const avgConfidence = aiGrowthInsights.reduce((s, i) => s + i.confidence, 0) / aiGrowthInsights.length;
    return { critical, high, totalPotential, avgConfidence, total: aiGrowthInsights.length };
  }, []);

  // KPI stats
  const kpiStats = useMemo(() => [
    { label: 'Total Insights', value: `${summary.total}`, icon: BrainCircuit, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: 0, changeLabel: 'AI-generated' },
    { label: 'Critical Actions', value: `${summary.critical}`, icon: AlertTriangle, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50', change: 0, changeLabel: 'requires immediate action' },
    { label: 'High Impact', value: `${summary.high}`, icon: TrendingUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 0, changeLabel: 'growth opportunities' },
    { label: 'Total Potential', value: formatINR(summary.totalPotential), icon: Target, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 0, changeLabel: 'revenue at stake' },
    { label: 'Avg Confidence', value: `${summary.avgConfidence.toFixed(0)}%`, icon: ShieldAlert, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: 0, changeLabel: 'AI model accuracy' },
  ], [isDark, summary]);

  const toggleActionItem = (insightId: string, itemIdx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [insightId]: {
        ...(prev[insightId] || {}),
        [itemIdx]: !(prev[insightId]?.[itemIdx] || false),
      },
    }));
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}>
              <BrainCircuit className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Growth Coach</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>AI Retention Moat Layer</p>
            </div>
          </div>
          <Button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
              isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
            )}
          >
            {isAnalyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <BrainCircuit className="w-4 h-4" />
              </motion.div>
            ) : (
              <BrainCircuit className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4 transition-all duration-200',
                stat.label === 'Critical Actions'
                  ? (isDark ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-red-50 border-red-200')
                  : (isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  {stat.label}
                </span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>{stat.changeLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            'rounded-2xl border p-4',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <span className={cn('text-xs font-medium shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>Category:</span>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryFilter(cat.value)}
                  className={cn(
                    'px-2.5 py-1 text-[10px] font-medium rounded-lg transition-colors',
                    categoryFilter === cat.value
                      ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                      : (isDark ? 'text-white/40 hover:bg-white/[0.06]' : 'text-black/40 hover:bg-black/[0.06]')
                  )}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Impact:</span>
              <div className="flex gap-1.5">
                {(['all', 'critical', 'high', 'medium', 'low'] as ImpactFilter[]).map((imp) => (
                  <Button
                    key={imp}
                    variant="ghost"
                    size="sm"
                    onClick={() => setImpactFilter(imp)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-medium rounded-lg capitalize transition-colors',
                      impactFilter === imp
                        ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                        : (isDark ? 'text-white/40 hover:bg-white/[0.06]' : 'text-black/40 hover:bg-black/[0.06]')
                    )}
                  >
                    {imp}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Cards */}
        <div className="space-y-4">
          {filteredInsights.map((insight: AIGrowthInsight, i) => {
            const tCfg = typeConfig[insight.type];
            const iCfg = impactConfig[insight.impact];
            const TypeIcon = tCfg.icon;
            const isMetricWarning = insight.currentValue !== undefined && insight.thresholdValue !== undefined && insight.currentValue < insight.thresholdValue;
            const isMetricGood = insight.currentValue !== undefined && insight.thresholdValue !== undefined && insight.currentValue >= insight.thresholdValue;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-200',
                  insight.impact === 'critical'
                    ? (isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50/50 border-red-200')
                    : (isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')
                )}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5', tCfg.bg)}>
                      <TypeIcon className={cn('w-5 h-5', tCfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold">{insight.title}</h3>
                        <Badge variant="secondary" className={cn('text-[9px] px-2 py-0', iCfg.color)}>
                          {iCfg.label}
                        </Badge>
                        {insight.segment && (
                          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                            {insight.segment}
                          </Badge>
                        )}
                      </div>
                      <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {/* Confidence */}
                  <div>
                    <span className={cn('text-[10px] block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className={cn('flex-1 h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${insight.confidence}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                          className={cn('h-full rounded-full', insight.confidence >= 85 ? 'bg-emerald-500' : insight.confidence >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                        />
                      </div>
                      <span className={cn('text-xs font-bold w-10 text-right', insight.confidence >= 85 ? 'text-emerald-500' : insight.confidence >= 70 ? 'text-amber-500' : 'text-red-500')}>
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Potential Impact */}
                  <div>
                    <span className={cn('text-[10px] block mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>Potential Impact</span>
                    <span className="text-sm font-bold text-emerald-500">{formatINR(insight.potentialImpact)}</span>
                  </div>

                  {/* Metric Comparison */}
                  {insight.metric && insight.currentValue !== undefined && insight.thresholdValue !== undefined && (
                    <div>
                      <span className={cn('text-[10px] block mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>{insight.metric}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-sm font-bold', isMetricWarning ? 'text-red-500' : 'text-emerald-500')}>
                          {insight.currentValue}
                        </span>
                        <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>vs</span>
                        <span className={cn('text-[10px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                          {insight.thresholdValue}
                        </span>
                        {isMetricWarning && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        {isMetricGood && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </div>
                  )}

                  {/* Impact Badge */}
                  <div>
                    <span className={cn('text-[10px] block mb-0.5', isDark ? 'text-white/30' : 'text-black/30')}>Priority</span>
                    <Badge variant="secondary" className={cn('text-[10px] px-2 py-0', iCfg.color)}>
                      {iCfg.label}
                    </Badge>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={cn(
                  'rounded-xl p-3 mb-3',
                  isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'
                )}>
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>
                    Recommendation
                  </span>
                  <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/60' : 'text-black/60')}>
                    {insight.recommendation}
                  </p>
                </div>

                {/* Action Items Checklist */}
                <div className="space-y-1.5">
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider block', isDark ? 'text-white/30' : 'text-black/30')}>
                    Action Items
                  </span>
                  {insight.actionItems.map((item, itemIdx) => {
                    const isChecked = checkedItems[insight.id]?.[itemIdx] || false;
                    return (
                      <motion.div
                        key={itemIdx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 + itemIdx * 0.03, duration: 0.2 }}
                        onClick={() => toggleActionItem(insight.id, itemIdx)}
                        className={cn(
                          'flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors',
                          isChecked
                            ? (isDark ? 'bg-emerald-500/[0.06]' : 'bg-emerald-50')
                            : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]')
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500'
                            : (isDark ? 'border-white/20' : 'border-black/20')
                        )}>
                          {isChecked && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={cn(
                          'text-xs transition-colors',
                          isChecked
                            ? (isDark ? 'text-white/30 line-through' : 'text-black/30 line-through')
                            : (isDark ? 'text-white/60' : 'text-black/60')
                        )}>
                          {item}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Cohort Analysis', value: '7 cohorts', page: 'cohort-analysis' as const, icon: Grid3x3, color: 'text-teal-400' },
            { label: 'LTV Forecast', value: '5 segments', page: 'ltv-forecast' as const, icon: BarChart3, color: 'text-violet-400' },
            { label: 'Customer Success', value: '3 plans', page: 'customer-success' as const, icon: Target, color: 'text-emerald-400' },
            { label: 'Advocacy', value: '8 entries', page: 'advocacy' as const, icon: Star, color: 'text-amber-400' },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', nav.color)} />
                <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', isDark ? 'text-white/15' : 'text-black/15')} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{nav.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
