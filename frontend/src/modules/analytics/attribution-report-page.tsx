'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { BarChart3, Users, IndianRupee, GitBranch, Layers, Download } from 'lucide-react';
import { attributionData } from './data/mock-data';

const MODELS = ['first-touch', 'last-touch', 'linear', 'ai-weighted'] as const;
const MODEL_LABELS: Record<string, string> = {
  'first-touch': 'First Touch',
  'last-touch': 'Last Touch',
  linear: 'Linear',
  'ai-weighted': 'AI Weighted',
};
const MODEL_DESCRIPTIONS: Record<string, string> = {
  'first-touch': '100% credit to the first interaction that brought the lead',
  'last-touch': '100% credit to the final touchpoint before conversion',
  linear: 'Equal credit distributed across all touchpoints',
  'ai-weighted': 'ML-based credit assignment using behavioral patterns',
};

const SOURCE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

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

export default function AttributionReportPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  const currentModel = MODELS[selectedModelIndex];
  const data = attributionData[selectedModelIndex];

  const card = cn(
    'rounded-2xl border shadow-sm',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  const maxRevenue = Math.max(...data.revenueBySource.map((s) => s.revenue));
  const maxContribution = Math.max(...data.touchpointContribution.map((t) => t.contribution));
  const totalRevenue = data.revenueBySource.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            Attribution Reports
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
            Multi-model revenue attribution
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {MODELS.map((model, i) => {
            const isActive = i === selectedModelIndex;
            return (
              <motion.button
                key={model}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => setSelectedModelIndex(i)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                    : isDark
                      ? 'bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:bg-white/[0.08]'
                      : 'bg-black/[0.03] border border-black/[0.06] text-zinc-600 hover:bg-black/[0.06]',
                )}
              >
                {MODEL_LABELS[model]}
              </motion.button>
            );
          })}
        </div>

        {/* Model Description */}
        <motion.div
          key={currentModel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-xl border p-3',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
            <span className="font-semibold">{MODEL_DESCRIPTIONS[currentModel]}</span>
          </p>
        </motion.div>

        {/* Revenue by Source - Horizontal Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={cn(card, 'p-4 sm:p-5')}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Revenue by Source
              </h3>
            </div>
            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              Total: {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="space-y-4">
            {data.revenueBySource.map((source, i) => {
              const width = maxRevenue > 0 ? (source.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                      />
                      <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                        {source.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                        {formatCurrency(source.revenue)}
                      </span>
                      <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('h-2.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CAC by Channel + Touchpoint Contribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CAC Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className={cn(card, 'overflow-hidden')}
          >
            <div className="p-4 sm:p-5 border-b" style={{ borderColor: 'var(--app-border)' }}>
              <div className="flex items-center gap-2">
                <IndianRupee className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  CAC by Channel
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                    {['Channel', 'CAC', 'Leads', 'Spend'].map((h) => (
                      <th key={h} className={cn('px-4 py-2.5 text-left font-medium', 'text-[var(--app-text-muted)]')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.cacByChannel.map((row) => (
                    <tr key={row.channel} className={cn('border-b last:border-0', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}>
                      <td className={cn('px-4 py-3 font-medium', 'text-[var(--app-text)]')}>
                        {row.channel}
                      </td>
                      <td className={cn('px-4 py-3 font-semibold tabular-nums', 'text-[var(--app-text-secondary)]')}>
                        ₹{row.cac.toLocaleString()}
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                        {formatNumber(row.leads)}
                      </td>
                      <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                        {formatCurrency(row.spend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Touchpoint Contribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(card, 'p-4 sm:p-5')}
          >
            <div className="flex items-center gap-2 mb-5">
              <GitBranch className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Touchpoint Contribution
              </h3>
            </div>
            <div className="space-y-4">
              {data.touchpointContribution.map((tp, i) => {
                const width = maxContribution > 0 ? (tp.contribution / maxContribution) * 100 : 0;
                return (
                  <div key={tp.touchpoint}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                        {tp.touchpoint}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                          {tp.contribution}%
                        </span>
                        <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>
                          {tp.conversions} conv
                        </span>
                      </div>
                    </div>
                    <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Assisted Conversions Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className={cn(card, 'overflow-hidden')}
        >
          <div className="p-4 sm:p-5 border-b" style={{ borderColor: 'var(--app-border)' }}>
            <div className="flex items-center gap-2">
              <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Assisted Conversions
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)] bg-[var(--app-hover-bg)]')}>
                  {['Channel', 'Assisted', 'Last-Touch', 'Overlap'].map((h) => (
                    <th key={h} className={cn('px-4 py-2.5 text-left font-medium', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.assistedConversions.map((row) => (
                  <tr key={row.channel} className={cn('border-b last:border-0', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}>
                    <td className={cn('px-4 py-3 font-medium', 'text-[var(--app-text)]')}>
                      {row.channel}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                      {row.assisted.toLocaleString()}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                      {row.lastTouch.toLocaleString()}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', 'text-[var(--app-text-secondary)]')}>
                      {row.overlap.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Model Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={cn(card, 'p-4 sm:p-5')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Model Comparison
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {attributionData.map((model, i) => {
              const modelTotal = model.revenueBySource.reduce((s, r) => s + r.revenue, 0);
              const topSource = model.revenueBySource.reduce((a, b) => (a.percentage > b.percentage ? a : b));
              return (
                <motion.div
                  key={model.model}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedModelIndex(i)}
                  className={cn(
                    'rounded-xl border p-3 cursor-pointer transition-colors',
                    i === selectedModelIndex
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : isDark
                        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                        : 'bg-black/[0.01] border-black/[0.06] hover:bg-black/[0.03]',
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                      {MODEL_LABELS[model.model]}
                    </span>
                    {i === selectedModelIndex && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                    {formatCurrency(modelTotal)}
                  </p>
                  <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                    Top: {topSource.source} ({topSource.percentage}%)
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
