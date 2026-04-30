'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, TrendingDown, Target, BrainCircuit, ChevronRight,
  BarChart3, Shield, Zap, ArrowUpRight, ArrowDownRight, AlertTriangle
} from 'lucide-react';
import { ltvForecasts } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { LTVForecast } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const segmentColors = [
  { bg: (isDark) => 'bg-[var(--app-success-bg)]', border: (isDark) => isDark ? 'border-emerald-500/20' : 'border-emerald-200', accent: 'text-emerald-400' },
  { bg: (isDark) => 'bg-[var(--app-purple-light)]', border: (isDark) => isDark ? 'border-violet-500/20' : 'border-violet-200', accent: 'text-violet-400' },
  { bg: (isDark) => 'bg-[var(--app-warning-bg)]', border: (isDark) => isDark ? 'border-amber-500/20' : 'border-amber-200', accent: 'text-amber-400' },
  { bg: (isDark) => 'bg-[var(--app-danger-bg)]', border: (isDark) => isDark ? 'border-red-500/20' : 'border-red-200', accent: 'text-red-400' },
  { bg: (isDark) => 'bg-[var(--app-info-bg)]', border: (isDark) => isDark ? 'border-sky-500/20' : 'border-sky-200', accent: 'text-sky-400' },
];

export default function LTVForecastPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [isPredicting, setIsPredicting] = useState(false);

  // Portfolio summary
  const portfolioSummary = useMemo(() => {
    const totalCurrent = ltvForecasts.reduce((s, f) => s + f.currentLTV, 0);
    const totalPredicted = ltvForecasts.reduce((s, f) => s + f.predictedLTV, 0);
    const totalBest = ltvForecasts.reduce((s, f) => s + f.bestCase, 0);
    const totalWorst = ltvForecasts.reduce((s, f) => s + f.worstCase, 0);
    const avgConfidence = ltvForecasts.reduce((s, f) => s + f.confidence, 0) / ltvForecasts.length;
    const totalExpansion = ltvForecasts.reduce((s, f) => s + f.expansionPotential, 0);
    return { totalCurrent, totalPredicted, totalBest, totalWorst, avgConfidence, totalExpansion };
  }, []);

  // Churn risk breakdown
  const churnBreakdown = useMemo(() =>
    ltvForecasts
      .sort((a, b) => b.churnRisk - a.churnRisk)
      .map((f: LTVForecast) => ({
        segment: f.segment.split('(')[0].trim(),
        churnRisk: f.churnRisk,
        currentLTV: f.currentLTV,
        predictedLTV: f.predictedLTV,
        isDeclining: f.predictedLTV < f.currentLTV,
      })),
    []
  );

  // LTV comparison chart data
  const ltvComparison = useMemo(() =>
    ltvForecasts.map((f: LTVForecast) => ({
      label: f.segment.split('(')[0].trim().slice(0, 8),
      current: f.currentLTV,
      predicted: f.predictedLTV,
    })),
    []
  );

  const maxLTV = Math.max(...ltvComparison.map((d) => Math.max(d.current, d.predicted)), 1);

  // KPI stats
  const kpiStats = useMemo(() => [
    { label: 'Current Portfolio LTV', value: formatINR(portfolioSummary.totalCurrent), icon: Target, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 0, changeLabel: '5 segments' },
    { label: 'Predicted Portfolio LTV', value: formatINR(portfolioSummary.totalPredicted), icon: TrendingUp, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: ((portfolioSummary.totalPredicted - portfolioSummary.totalCurrent) / portfolioSummary.totalCurrent * 100), changeLabel: 'growth potential' },
    { label: 'Best Case Total', value: formatINR(portfolioSummary.totalBest), icon: Zap, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 0, changeLabel: 'optimistic scenario' },
    { label: 'Worst Case Total', value: formatINR(portfolioSummary.totalWorst), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: 0, changeLabel: 'pessimistic scenario' },
    { label: 'Avg Confidence', value: `${portfolioSummary.avgConfidence.toFixed(0)}%`, icon: Shield, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: 0, changeLabel: 'AI model accuracy' },
  ], [isDark, portfolioSummary]);

  const handleRunPrediction = () => {
    setIsPredicting(true);
    setTimeout(() => setIsPredicting(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <BrainCircuit className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">LTV Forecast</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>AI Revenue Predictor</p>
            </div>
          </div>
          <Button
            onClick={handleRunPrediction}
            disabled={isPredicting}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}
          >
            {isPredicting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Zap className="w-4 h-4" />
              </motion.div>
            ) : (
              <BrainCircuit className="w-4 h-4" />
            )}
            {isPredicting ? 'Running...' : 'Run Prediction'}
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
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  {stat.label}
                </span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                {stat.change > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                    <ArrowUpRight className="w-3 h-3" />{stat.change.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>{stat.changeLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Segment Forecast Cards */}
        <div className="space-y-4">
          {ltvForecasts.map((forecast: LTVForecast, i) => {
            const colorConfig = segmentColors[i % segmentColors.length];
            const isGrowing = forecast.predictedLTV > forecast.currentLTV;
            return (
              <motion.div
                key={forecast.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-200',
                  colorConfig.bg(isDark),
                  colorConfig.border(isDark)
                )}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Segment info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-full', isGrowing ? 'bg-emerald-500' : 'bg-red-500')} />
                        <h3 className="text-sm font-semibold">{forecast.segment}</h3>
                      </div>
                      <Badge variant="secondary" className={cn('text-[10px]', isGrowing ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]') : ('bg-[var(--app-danger-bg)] text-[var(--app-danger)]'))}>
                        {isGrowing ? '↑ Growing' : '↓ Declining'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <span className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>Current LTV</span>
                        <span className="text-sm font-semibold">{formatINR(forecast.currentLTV)}</span>
                      </div>
                      <div>
                        <span className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>Predicted LTV</span>
                        <span className="text-lg font-bold">{formatINR(forecast.predictedLTV)}</span>
                      </div>
                      <div>
                        <span className={cn('text-[10px] block mb-0.5 text-emerald-500')}>Best Case</span>
                        <span className="text-sm font-semibold text-emerald-500">{formatINR(forecast.bestCase)}</span>
                      </div>
                      <div>
                        <span className={cn('text-[10px] block mb-0.5 text-red-500')}>Worst Case</span>
                        <span className="text-sm font-semibold text-red-500">{formatINR(forecast.worstCase)}</span>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Confidence Meter */}
                      <div>
                        <span className={cn('text-[10px] block mb-1', 'text-[var(--app-text-muted)]')}>Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className={cn('flex-1 h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${forecast.confidence}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                              className="h-full rounded-full bg-amber-400"
                            />
                          </div>
                          <span className="text-[10px] font-medium w-8 text-right">{forecast.confidence}%</span>
                        </div>
                      </div>
                      {/* Avg Lifespan */}
                      <div>
                        <span className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>Avg Lifespan</span>
                        <span className="text-sm font-medium">{forecast.avgLifespan} months</span>
                      </div>
                      {/* Churn Risk */}
                      <div>
                        <span className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>Churn Risk</span>
                        <span className={cn('text-sm font-medium', forecast.churnRisk > 40 ? 'text-red-500' : forecast.churnRisk > 20 ? 'text-amber-500' : 'text-emerald-500')}>
                          {forecast.churnRisk}%
                        </span>
                      </div>
                      {/* Expansion */}
                      <div>
                        <span className={cn('text-[10px] block mb-0.5', 'text-[var(--app-text-muted)]')}>Expansion Potential</span>
                        <span className="text-sm font-medium text-emerald-500">{formatINR(forecast.expansionPotential)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LTV Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  LTV Comparison — Current vs Predicted
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-white/30' : 'bg-black/30')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', 'bg-[var(--app-success)]')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Predicted</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-36">
              {ltvComparison.map((entry, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                  <div className="flex gap-0.5 w-full items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.current / maxLTV) * 100}%` }}
                      transition={{ delay: 0.5 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm', isDark ? 'bg-white/20' : 'bg-black/20')}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.predicted / maxLTV) * 100}%` }}
                      transition={{ delay: 0.55 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                    />
                  </div>
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Churn Risk Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Churn Risk by Segment
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {churnBreakdown.map((item, j) => {
                const riskColor = item.churnRisk > 40 ? 'bg-red-400' : item.churnRisk > 20 ? 'bg-amber-400' : 'bg-emerald-400';
                return (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + j * 0.06, duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <span className={cn('text-xs w-24 truncate', 'text-[var(--app-text-secondary)]')}>
                      {item.segment}
                    </span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.churnRisk}%` }}
                        transition={{ delay: 0.6 + j * 0.08, duration: 0.5 }}
                        className={cn('h-full rounded-full', riskColor)}
                      />
                    </div>
                    <span className={cn('text-xs font-medium w-10 text-right', item.churnRisk > 40 ? 'text-red-500' : item.churnRisk > 20 ? 'text-amber-500' : 'text-emerald-500')}>
                      {item.churnRisk}%
                    </span>
                    {item.isDeclining && (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Expansion Potential Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Expansion Potential Summary
              </span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-success-bg)] text-[var(--app-success)]')}>
              {formatINR(portfolioSummary.totalExpansion)} total
            </Badge>
          </div>
          <div className="flex items-end gap-3 h-28">
            {ltvForecasts
              .sort((a, b) => b.expansionPotential - a.expansionPotential)
              .map((f: LTVForecast, j) => {
                const maxExp = Math.max(...ltvForecasts.map((x) => x.expansionPotential), 1);
                return (
                  <div key={f.id} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                      {formatINR(f.expansionPotential)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(f.expansionPotential / maxExp) * 100}%` }}
                      transition={{ delay: 0.6 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('w-full rounded-t-sm', 'bg-[var(--app-warning)]')}
                    />
                    <span className={cn('text-[8px] truncate w-full text-center', 'text-[var(--app-text-disabled)]')}>
                      {f.segment.split('(')[0].trim().slice(0, 10)}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Cohort Analysis', value: '7 cohorts', page: 'cohort-analysis' as const, icon: BarChart3, color: 'text-emerald-400' },
            { label: 'Customer Success', value: '3 plans', page: 'customer-success' as const, icon: Target, color: 'text-violet-400' },
            { label: 'AI Growth Coach', value: '8 insights', page: 'ai-growth-coach' as const, icon: BrainCircuit, color: 'text-amber-400' },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', nav.color)} />
                <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', 'text-[var(--app-text-disabled)]')} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{nav.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
