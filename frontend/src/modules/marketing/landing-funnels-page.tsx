'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Funnel } from '@/modules/marketing/types';
import { mockFunnels } from '@/modules/marketing/data/mock-data';
import {
  Filter, Plus, ArrowDown, TrendingDown, TrendingUp,
  DollarSign, Clock, BarChart3, MousePointerClick,
  Target, AlertTriangle, ChevronDown, Zap, Layers,
  RefreshCw, Eye,
} from 'lucide-react';

const CTA_DATA = [
  { cta: 'Book Demo Button', funnel: 'Enterprise Lead', clicks: 2892, conversions: 612, rate: 21.2 },
  { cta: 'Start Free Trial', funnel: 'Trial Conversion', clicks: 1294, conversions: 284, rate: 21.9 },
  { cta: 'Add to Cart', funnel: 'E-Commerce', clicks: 11725, conversions: 7035, rate: 60.0 },
  { cta: 'Complete Purchase', funnel: 'E-Commerce', clicks: 7035, conversions: 1608, rate: 22.9 },
  { cta: 'Register Now', funnel: 'Webinar', clicks: 9600, conversions: 3840, rate: 40.0 },
  { cta: 'Request Demo', funnel: 'Webinar', clicks: 768, conversions: 115, rate: 15.0 },
];

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
}

function formatNumber(val: number): string {
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toFixed(0);
}

function getDropOffColor(dropOff: number): string {
  if (dropOff >= 75) return 'text-red-500';
  if (dropOff >= 50) return 'text-amber-500';
  if (dropOff > 0) return 'text-yellow-500';
  return 'text-green-500';
}

function getBarGradient(stepIdx: number, totalSteps: number): string {
  const ratio = stepIdx / Math.max(totalSteps - 1, 1);
  const r = Math.round(59 + (16 - 59) * ratio);
  const g = Math.round(130 + (185 - 130) * ratio);
  const b = Math.round(246 + (129 - 246) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function LandingFunnelsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedFunnelIdx, setSelectedFunnelIdx] = useState(0);

  const selectedFunnel: Funnel = mockFunnels[selectedFunnelIdx];

  const funnelMetrics = useMemo(() => {
    const steps = selectedFunnel.steps;
    const biggestDrop = steps.reduce((max, s) => s.dropOff > max.dropOff ? s : max, steps[0]);
    return {
      totalRevenue: selectedFunnel.totalRevenue,
      conversionRate: selectedFunnel.conversionRate,
      biggestDropOff: biggestDrop,
      avgTimeToConvert: steps.length * 2.3,
    };
  }, [selectedFunnel]);

  const maxVisitors = useMemo(() => {
    return Math.max(...selectedFunnel.steps.map(s => s.visitors));
  }, [selectedFunnel]);

  const card = cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');
  const kpiStyle = cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');
  const subtle = 'text-[var(--app-text-muted)]';
  const medium = 'text-[var(--app-text-secondary)]';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            Landing Funnel Builder & Analytics
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-secondary)]')}>
            Visualize conversion funnels and identify drop-off points
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Create Funnel
        </Button>
      </div>

      {/* Funnel Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {mockFunnels.map((funnel, i) => (
          <motion.button
            key={funnel.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedFunnelIdx(i)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              selectedFunnelIdx === i
                ? 'bg-orange-500/15 text-orange-600 border border-orange-500/20'
                : isDark
                  ? 'bg-white/[0.04] border border-white/[0.06] text-white/60 hover:bg-white/[0.08]'
                  : 'bg-black/[0.03] border border-black/[0.06] text-black/50 hover:bg-black/[0.06]',
            )}
          >
            {funnel.name}
          </motion.button>
        ))}
      </div>

      {/* Funnel Metrics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: formatCurrency(funnelMetrics.totalRevenue), icon: DollarSign, color: 'text-green-500' },
          { label: 'Conversion Rate', value: `${funnelMetrics.conversionRate}%`, icon: Target, color: 'text-blue-500' },
          { label: 'Biggest Drop-off', value: `${funnelMetrics.biggestDropOff.dropOff}%`, sub: funnelMetrics.biggestDropOff.name, icon: TrendingDown, color: 'text-red-500' },
          { label: 'Avg Time to Convert', value: `${funnelMetrics.avgTimeToConvert.toFixed(1)}d`, icon: Clock, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={kpiStyle}
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              <span className={cn('text-xs', medium)}>{kpi.label}</span>
            </div>
            <p className={cn('text-xl font-bold', 'text-[var(--app-text)]')}>{kpi.value}</p>
            {kpi.sub && <p className={cn('text-[10px] mt-0.5', subtle)}>{kpi.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Vertical Funnel Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card}
      >
        <div className="flex items-center gap-2 mb-5">
          <Filter className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
            {selectedFunnel.name}
          </h3>
        </div>

        <div className="space-y-0">
          {selectedFunnel.steps.map((step, i) => {
            const widthPercent = maxVisitors > 0 ? (step.visitors / maxVisitors) * 100 : 0;
            const conversionPercent = step.visitors > 0 ? (step.conversions / step.visitors) * 100 : 0;
            const barColor = getBarGradient(i, selectedFunnel.steps.length);
            const isLastStep = step.revenue > 0;
            const dropOffColor = getDropOffColor(step.dropOff);

            return (
              <div key={step.id}>
                {/* Funnel Bar */}
                <div className="flex items-center gap-4 py-3">
                  {/* Step Info */}
                  <div className="w-32 shrink-0 text-right">
                    <p className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>{step.name}</p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1">
                    <div className={cn('h-10 rounded-xl overflow-hidden relative', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-xl flex items-center px-4"
                        style={{ backgroundColor: barColor, opacity: 0.9 }}
                      >
                        <span className="text-white text-xs font-semibold">
                          {formatNumber(step.visitors)} visitors
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="w-40 shrink-0 grid grid-cols-2 gap-2 text-right">
                    <div>
                      <p className={cn('text-[10px]', subtle)}>Conversions</p>
                      <p className={cn('text-xs font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                        {formatNumber(step.conversions)}
                      </p>
                    </div>
                    <div>
                      <p className={cn('text-[10px]', subtle)}>Rate</p>
                      <p className={cn('text-xs font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                        {conversionPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Drop-off */}
                  <div className="w-20 shrink-0 text-right">
                    {step.dropOff > 0 ? (
                      <div>
                        <p className={cn('text-[10px]', subtle)}>Drop-off</p>
                        <div className="flex items-center justify-end gap-1">
                          <TrendingDown className={cn('w-3 h-3', dropOffColor)} />
                          <span className={cn('text-xs font-bold tabular-nums', dropOffColor)}>
                            {step.dropOff}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <span className={cn('text-[10px] font-medium text-green-500')}>Entry</span>
                      </div>
                    )}
                  </div>

                  {/* Revenue */}
                  <div className="w-24 shrink-0 text-right">
                    {isLastStep ? (
                      <div>
                        <p className={cn('text-[10px]', subtle)}>Revenue</p>
                        <p className={cn('text-xs font-bold text-green-500')}>{formatCurrency(step.revenue)}</p>
                      </div>
                    ) : (
                      <span className={cn('text-[10px]', subtle)}>—</span>
                    )}
                  </div>
                </div>

                {/* Drop-off connector */}
                {step.dropOff > 0 && i < selectedFunnel.steps.length - 1 && (
                  <div className="flex items-center gap-4">
                    <div className="w-32 shrink-0" />
                    <div className="flex-1 flex justify-center">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.1 + 0.35, duration: 0.2 }}
                        className="flex flex-col items-center"
                        style={{ transformOrigin: 'top' }}
                      >
                        <ChevronDown className={cn('w-4 h-4', dropOffColor)} />
                        {step.dropOff >= 70 && (
                          <Badge className="text-[9px] bg-red-500/10 text-red-500 mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                            High drop
                          </Badge>
                        )}
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTA Tracking Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointerClick className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>CTA Tracking</h3>
            </div>
            <span className={cn('text-xs', subtle)}>{CTA_DATA.length} CTAs</span>
          </div>
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={cn('border-y', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                  {['CTA', 'Funnel', 'Clicks', 'Conversions', 'Rate'].map(h => (
                    <th key={h} className={cn('px-4 py-2.5 text-left font-medium', medium)}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CTA_DATA.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={cn('border-b', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                  >
                    <td className={cn('px-4 py-2.5 font-medium', 'text-[var(--app-text)]')}>{row.cta}</td>
                    <td className={cn('px-4 py-2.5', medium)}>{row.funnel}</td>
                    <td className={cn('px-4 py-2.5 tabular-nums', 'text-[var(--app-text-secondary)]')}>{formatNumber(row.clicks)}</td>
                    <td className={cn('px-4 py-2.5 tabular-nums', 'text-[var(--app-text-secondary)]')}>{formatNumber(row.conversions)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-16 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                          <div
                            className={cn('h-full rounded-full', row.rate >= 40 ? 'bg-green-500' : row.rate >= 20 ? 'bg-amber-500' : 'bg-red-500')}
                            style={{ width: `${Math.min(row.rate, 100)}%` }}
                          />
                        </div>
                        <span className={cn('tabular-nums text-[10px]', 'text-[var(--app-text-secondary)]')}>{row.rate}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Funnel Comparison Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Funnel Comparison</h3>
          </div>
          <div className="space-y-5">
            {/* Revenue comparison */}
            <div>
              <p className={cn('text-xs font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Total Revenue</p>
              <div className="space-y-2">
                {mockFunnels.map((funnel, i) => {
                  const maxRev = Math.max(...mockFunnels.map(f => f.totalRevenue));
                  const width = maxRev > 0 ? (funnel.totalRevenue / maxRev) * 100 : 0;
                  const isSelected = i === selectedFunnelIdx;
                  return (
                    <button
                      key={funnel.id}
                      onClick={() => setSelectedFunnelIdx(i)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-[10px] font-medium truncate max-w-[160px]', isSelected ? ('text-[var(--app-text)]') : medium)}>
                          {funnel.name}
                        </span>
                        <span className={cn('text-[10px] font-semibold tabular-nums', isSelected ? ('text-[var(--app-text)]') : medium)}>
                          {formatCurrency(funnel.totalRevenue)}
                        </span>
                      </div>
                      <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ delay: i * 0.08 + 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className={cn('h-full rounded-full transition-opacity', isSelected ? 'opacity-100' : 'opacity-50')}
                          style={{ backgroundColor: getBarGradient(i, mockFunnels.length) }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversion Rate comparison */}
            <div>
              <p className={cn('text-xs font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Conversion Rate</p>
              <div className="space-y-2">
                {mockFunnels.map((funnel, i) => {
                  const maxRate = Math.max(...mockFunnels.map(f => f.conversionRate));
                  const width = maxRate > 0 ? (funnel.conversionRate / maxRate) * 100 : 0;
                  const isSelected = i === selectedFunnelIdx;
                  return (
                    <button
                      key={funnel.id}
                      onClick={() => setSelectedFunnelIdx(i)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-[10px] font-medium truncate max-w-[160px]', isSelected ? ('text-[var(--app-text)]') : medium)}>
                          {funnel.name}
                        </span>
                        <span className={cn('text-[10px] font-semibold tabular-nums', isSelected ? ('text-[var(--app-text)]') : medium)}>
                          {funnel.conversionRate}%
                        </span>
                      </div>
                      <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ delay: i * 0.08 + 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className={cn('h-full rounded-full transition-opacity', isSelected ? 'opacity-100' : 'opacity-50')}
                          style={{
                            backgroundColor: funnel.conversionRate >= 3 ? '#10b981' : funnel.conversionRate >= 1 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
