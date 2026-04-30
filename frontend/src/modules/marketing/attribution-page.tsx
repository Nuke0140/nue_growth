'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AttributionChannel } from '@/modules/marketing/types';
import { mockAttributionChannels } from '@/modules/marketing/data/mock-data';
import {
  PieChart, ArrowRight, TrendingUp, DollarSign, Target,
  GitBranch, BarChart3, RefreshCw, Zap, Eye, Layers,
} from 'lucide-react';

const ATTRIBUTION_MODELS = [
  { id: 'first-touch', label: 'First Touch' },
  { id: 'last-touch', label: 'Last Touch' },
  { id: 'linear', label: 'Linear' },
  { id: 'time-decay', label: 'Time Decay' },
  { id: 'ai', label: 'AI' },
] as const;

const CONVERSION_PATHS = [
  {
    label: 'Ad → Email → Website → Sale',
    steps: ['Google Ad', 'Email', 'Website', 'Purchase'],
    conversions: 1684,
    avgDays: 12,
    value: '₹2.4Cr',
  },
  {
    label: 'Social → Blog → WhatsApp → Sale',
    steps: ['Social', 'Blog', 'WhatsApp', 'Purchase'],
    conversions: 1284,
    avgDays: 8,
    value: '₹1.8Cr',
  },
  {
    label: 'Google → Landing → Form → Sale',
    steps: ['Google', 'Landing', 'Form', 'Demo'],
    conversions: 941,
    avgDays: 18,
    value: '₹1.3Cr',
  },
];

const MODEL_COMPARISON: Record<string, { factor: number; desc: string }> = {
  'first-touch': { factor: 1.0, desc: '100% credit to first channel interaction' },
  'last-touch': { factor: 0.95, desc: '100% credit to final channel before conversion' },
  'linear': { factor: 1.1, desc: 'Equal credit distributed across all touchpoints' },
  'time-decay': { factor: 1.15, desc: 'More credit to recent interactions (exponential decay)' },
  'ai': { factor: 1.22, desc: 'ML-based credit assignment using behavioral patterns' },
};

function formatCurrency(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
}

function formatNumber(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toFixed(0);
}

export default function AttributionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedModel, setSelectedModel] = useState<string>('ai');

  const adjustedChannels = useMemo(() => {
    const factor = MODEL_COMPARISON[selectedModel]?.factor ?? 1;
    return mockAttributionChannels.map(ch => ({
      ...ch,
      revenue: Math.round(ch.revenue * factor),
      conversions: Math.round(ch.conversions * factor),
    }));
  }, [selectedModel]);

  const totalRevenue = useMemo(() => adjustedChannels.reduce((s, c) => s + c.revenue, 0), [adjustedChannels]);
  const maxRevenue = useMemo(() => Math.max(...adjustedChannels.map(c => c.revenue)), [adjustedChannels]);

  const card = cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');
  const kpiStyle = cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            Multi-Touch Attribution
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-secondary)]')}>
            Understand which channels truly drive revenue across the customer journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {ATTRIBUTION_MODELS.map((model, i) => {
          const isActive = selectedModel === model.id;
          const isAI = model.id === 'ai';
          return (
            <motion.button
              key={model.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedModel(model.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-orange-500/15 text-orange-600 border border-orange-500/20'
                  : isDark
                    ? 'bg-white/[0.04] border border-white/[0.06] text-white/60 hover:bg-white/[0.08]'
                    : 'bg-black/[0.03] border border-black/[0.06] text-black/50 hover:bg-black/[0.06]',
              )}
            >
              {isAI && <Zap className="w-3.5 h-3.5" />}
              {model.label}
            </motion.button>
          );
        })}
      </div>

      {/* Model Description */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        key={selectedModel}
        className={cn('rounded-xl border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
      >
        <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
          <span className="font-semibold">{MODEL_COMPARISON[selectedModel].desc}</span>
          <span className="mx-2">·</span>
          Revenue multiplier: <span className="font-mono">{MODEL_COMPARISON[selectedModel].factor}x</span>
        </p>
      </motion.div>

      {/* Revenue Attribution Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Revenue Attribution</h3>
          </div>
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
            Total: {formatCurrency(totalRevenue)}
          </span>
        </div>
        <div className="space-y-4">
          {adjustedChannels.map((ch, i) => {
            const width = maxRevenue > 0 ? (ch.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className={cn('text-xs font-medium', isDark ? 'text-white/80' : 'text-gray-700')}>{ch.channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                      {formatCurrency(ch.revenue)}
                    </span>
                    <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
                      {ch.contribution}%
                    </span>
                  </div>
                </div>
                <div className={cn('h-2.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: ch.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Contribution Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Layers className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Channel Contribution</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={cn('border-y', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                  {['Channel', 'Revenue', 'Contribution', 'Conversions'].map(h => (
                    <th key={h} className={cn('px-4 py-2.5 text-left font-medium', 'text-[var(--app-text-secondary)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjustedChannels.map((ch, i) => (
                  <motion.tr
                    key={ch.channel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={cn('border-b', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                        <span className={cn('font-medium', 'text-[var(--app-text)]')}>{ch.channel}</span>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3 font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                      {formatCurrency(ch.revenue)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-12 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                          <div className="h-full rounded-full" style={{ width: `${ch.contribution}%`, backgroundColor: ch.color }} />
                        </div>
                        <span className={cn('tabular-nums', 'text-[var(--app-text-secondary)]')}>{ch.contribution}%</span>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                      {formatNumber(ch.conversions)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Model Comparison Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Model Comparison</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(MODEL_COMPARISON).map(([key, model], i) => {
              const isActive = selectedModel === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition',
                    isActive
                      ? isDark
                        ? 'bg-orange-500/5 border-orange-500/20'
                        : 'bg-orange-500/5 border-orange-500/20'
                      : isDark
                        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                        : 'bg-black/[0.01] border-black/[0.06] hover:bg-black/[0.03]',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {key === 'ai' && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                      <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                        {ATTRIBUTION_MODELS.find(m => m.id === key)?.label ?? key}
                      </span>
                    </div>
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className={cn('text-[10px]', isActive ? 'bg-orange-500 text-white' : '')}
                    >
                      {model.factor}x
                    </Badge>
                  </div>
                  <p className={cn('text-[10px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                    {model.desc}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Conversion Path Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card}
      >
        <div className="flex items-center gap-2 mb-5">
          <GitBranch className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Conversion Paths</h3>
          <span className={cn('text-xs ml-auto', 'text-[var(--app-text-muted)]')}>Top 3 journeys</span>
        </div>
        <div className="space-y-5">
          {CONVERSION_PATHS.map((path, i) => (
            <div
              key={i}
              className={cn(
                'rounded-xl border p-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>{path.label}</span>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>
                    {path.conversions} conversions
                  </span>
                  <span className={cn('text-[10px] font-semibold', isDark ? 'text-white/70' : 'text-gray-600')}>
                    {path.value}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {path.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: j * 0.1 + i * 0.1, duration: 0.3 }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap',
                        j === path.steps.length - 1
                          ? 'bg-green-500/15 text-green-600'
                          : isDark
                            ? 'bg-white/[0.06] text-white/70'
                            : 'bg-black/[0.05] text-gray-700',
                      )}
                    >
                      {step}
                    </motion.div>
                    {j < path.steps.length - 1 && (
                      <ArrowRight className={cn('w-3 h-3 shrink-0', 'text-[var(--app-text-disabled)]')} />
                    )}
                  </div>
                ))}
              </div>
              <p className={cn('text-[10px] mt-2', 'text-[var(--app-text-muted)]')}>
                Avg. time to convert: {path.avgDays} days
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ROI by Channel KPI Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>ROI by Channel</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {adjustedChannels.map((ch, i) => {
            const roi = ch.contribution * 8.8;
            return (
              <motion.div
                key={ch.channel}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={kpiStyle}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>{ch.channel}</span>
                </div>
                <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{roi.toFixed(0)}x</p>
                <p className={cn('text-[10px] mt-0.5', 'text-[var(--app-text-muted)]')}>ROI</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
