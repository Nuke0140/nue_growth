'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, TrendingDown, Minus, BrainCircuit, ArrowUpRight, ArrowDownRight,
  Shield, AlertTriangle, Sparkles, Zap,
} from 'lucide-react';
import { forecastData } from '@/modules/finance/data/mock-data';
import type { ForecastEntry } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function formatForecastValue(metric: string, value: number): string {
  if (metric === 'Cash Runway' || metric === 'Profit Margin') return `${value.toFixed(1)}`;
  if (metric === 'Receivables Risk') return formatINR(value);
  return formatINR(value);
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-emerald-500',
  down: 'text-red-500',
  stable: 'text-amber-500',
};

export default function ForecastingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const avgConfidence = useMemo(() => {
    const total = forecastData.reduce((s, f) => s + f.confidence, 0);
    return (total / forecastData.length).toFixed(0);
  }, []);

  const riskIndicators = useMemo(() => {
    return forecastData.filter(f => f.confidence < 75 || (f.trend === 'down' && (f.metric === 'Cash Runway' || f.metric === 'Profit Margin')));
  }, []);

  const bestCaseSummary = useMemo(() => {
    const rev = forecastData.find(f => f.metric === 'Revenue');
    const margin = forecastData.find(f => f.metric === 'Profit Margin');
    const runway = forecastData.find(f => f.metric === 'Cash Runway');
    return { revenue: rev?.bestCase ?? 0, margin: margin?.bestCase ?? 0, runway: runway?.bestCase ?? 0 };
  }, []);

  const worstCaseSummary = useMemo(() => {
    const rev = forecastData.find(f => f.metric === 'Revenue');
    const margin = forecastData.find(f => f.metric === 'Profit Margin');
    const runway = forecastData.find(f => f.metric === 'Cash Runway');
    return { revenue: rev?.worstCase ?? 0, margin: margin?.worstCase ?? 0, runway: runway?.worstCase ?? 0 };
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <BrainCircuit className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Forecasting</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>AI CFO Forecasting</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <Sparkles className="w-4 h-4" /> Generate Report
            </Button>
          </div>
        </div>

        {/* Forecast Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {forecastData.map((forecast, i) => {
            const TrendIcon = trendIcons[forecast.trend];
            const isPositiveTrend = forecast.metric === 'Receivables Risk' || forecast.metric === 'Burn Rate' ? forecast.trend === 'down' : forecast.trend === 'up';
            return (
              <motion.div key={forecast.metric} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]', 'transition-all duration-200')}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{forecast.metric}</span>
                  <TrendIcon className={cn('w-3.5 h-3.5', trendColors[forecast.trend])} />
                </div>

                <p className="text-lg font-bold tracking-tight">{formatForecastValue(forecast.metric, forecast.current)}</p>
                <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>Current</p>

                <div className={cn('mt-3 pt-3 border-t', 'border-[var(--app-border)]')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Next Month</span>
                    <span className="text-xs font-semibold">{formatForecastValue(forecast.metric, forecast.nextMonth)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Best Case</span>
                    <span className="text-[10px] font-semibold text-emerald-500">{formatForecastValue(forecast.metric, forecast.bestCase)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Worst Case</span>
                    <span className="text-[10px] font-semibold text-red-500">{formatForecastValue(forecast.metric, forecast.worstCase)}</span>
                  </div>

                  {/* Confidence Meter */}
                  <div className="flex items-center gap-2">
                    <div className={cn('flex-1 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${forecast.confidence}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                        className={cn('h-full rounded-full', forecast.confidence >= 80 ? 'bg-emerald-500' : forecast.confidence >= 65 ? 'bg-amber-500' : 'bg-red-500')}
                      />
                    </div>
                    <span className={cn('text-[9px] font-medium', forecast.confidence >= 80 ? 'text-emerald-500' : forecast.confidence >= 65 ? 'text-amber-500' : 'text-red-500')}>{forecast.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scenario Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Best Case */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className={cn('rounded-2xl border p-5', isDark ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200')}>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Best Case Scenario</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Revenue', value: formatINR(bestCaseSummary.revenue) },
                { label: 'Profit Margin', value: `${bestCaseSummary.margin}%` },
                { label: 'Cash Runway', value: `${bestCaseSummary.runway} months` },
              ].map((item, i) => (
                <div key={item.label} className={cn('flex items-center justify-between p-3 rounded-xl', isDark ? 'bg-white/[0.03]' : 'bg-white')}>
                  <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{item.label}</span>
                  <span className="text-sm font-bold text-emerald-500">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Worst Case */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }} className={cn('rounded-2xl border p-5', isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50/50 border-red-200')}>
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Worst Case Scenario</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Revenue', value: formatINR(worstCaseSummary.revenue) },
                { label: 'Profit Margin', value: `${worstCaseSummary.margin}%` },
                { label: 'Cash Runway', value: `${worstCaseSummary.runway} months` },
              ].map((item) => (
                <div key={item.label} className={cn('flex items-center justify-between p-3 rounded-xl', isDark ? 'bg-white/[0.03]' : 'bg-white')}>
                  <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{item.label}</span>
                  <span className="text-sm font-bold text-red-500">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Confidence Overview & Risk Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Average Confidence */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Model Confidence</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" className={isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]'} strokeWidth="6" />
                  <motion.circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(parseInt(avgConfidence) / 100) * 213.6} 213.6`} initial={{ strokeDasharray: '0 213.6' }} animate={{ strokeDasharray: `${(parseInt(avgConfidence) / 100) * 213.6} 213.6` }} transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }} className="text-amber-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{avgConfidence}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {forecastData.map(f => (
                  <div key={f.metric} className="flex items-center gap-2">
                    <span className={cn('text-[10px] w-28 truncate', 'text-[var(--app-text-muted)]')}>{f.metric}</span>
                    <div className={cn('flex-1 h-1 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${f.confidence}%` }} transition={{ delay: 0.7 + forecastData.indexOf(f) * 0.05, duration: 0.4 }} className={cn('h-full rounded-full', f.confidence >= 80 ? 'bg-emerald-500' : f.confidence >= 65 ? 'bg-amber-500' : 'bg-red-500')} />
                    </div>
                    <span className="text-[9px] w-6 text-right">{f.confidence}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Risk Indicators */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.4 }} className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Key Risk Indicators</span>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>{riskIndicators.length}</Badge>
            </div>
            <div className="space-y-2">
              {riskIndicators.map((risk, i) => {
                const TrendIcon = trendIcons[risk.trend];
                return (
                  <motion.div key={risk.metric} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }} className={cn('flex items-center justify-between p-3 rounded-xl border', 'border-[var(--app-border-light)]')}>
                    <div className="flex items-center gap-2">
                      <TrendIcon className={cn('w-3.5 h-3.5', trendColors[risk.trend])} />
                      <div>
                        <p className="text-xs font-medium">{risk.metric}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{risk.trend === 'down' ? 'Declining' : risk.trend === 'up' ? 'Rising' : 'Stable'} · {risk.confidence}% confidence</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{formatForecastValue(risk.metric, risk.current)}</p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>→ {formatForecastValue(risk.metric, risk.nextMonth)}</p>
                    </div>
                  </motion.div>
                );
              })}
              {riskIndicators.length === 0 && <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>No critical risk indicators.</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
