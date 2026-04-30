'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BarChart3, Users, IndianRupee, GitBranch, Layers, Download } from 'lucide-react';
import { attributionData } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

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
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);

  const currentModel = MODELS[selectedModelIndex];
  const data = attributionData[selectedModelIndex];

  const card = 'rounded-2xl border shadow-sm';
  const cardStyle = { backgroundColor: CSS.cardBg, borderColor: CSS.border, boxShadow: CSS.shadowCard };

  const maxRevenue = Math.max(...data.revenueBySource.map((s) => s.revenue));
  const maxContribution = Math.max(...data.touchpointContribution.map((t) => t.contribution));
  const totalRevenue = data.revenueBySource.reduce((s, r) => s + r.revenue, 0);

  // ── CAC by Channel column definitions ──
  const cacColumns: DataTableColumnDef[] = useMemo(() => [
    { key: 'channel', label: 'Channel', sortable: true },
    { key: 'cac', label: 'CAC', sortable: true, render: (row) => (
      <span className="font-semibold tabular-nums" style={{ color: CSS.text }}>₹{Number(row.cac).toLocaleString()}</span>
    )},
    { key: 'leads', label: 'Leads', sortable: true, render: (row) => (
      <span className="tabular-nums" style={{ color: CSS.textSecondary }}>{formatNumber(Number(row.leads))}</span>
    )},
    { key: 'spend', label: 'Spend', sortable: true, render: (row) => (
      <span className="tabular-nums" style={{ color: CSS.textSecondary }}>{formatCurrency(Number(row.spend))}</span>
    )},
  ], []);

  // ── Assisted Conversions column definitions ──
  const assistedColumns: DataTableColumnDef[] = useMemo(() => [
    { key: 'channel', label: 'Channel', sortable: true },
    { key: 'assisted', label: 'Assisted', sortable: true, render: (row) => (
      <span className="tabular-nums" style={{ color: CSS.text }}>{Number(row.assisted).toLocaleString()}</span>
    )},
    { key: 'lastTouch', label: 'Last-Touch', sortable: true, render: (row) => (
      <span className="tabular-nums" style={{ color: CSS.text }}>{Number(row.lastTouch).toLocaleString()}</span>
    )},
    { key: 'overlap', label: 'Overlap', sortable: true, render: (row) => (
      <span className="tabular-nums" style={{ color: CSS.text }}>{Number(row.overlap).toLocaleString()}</span>
    )},
  ], []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: CSS.text }}>
            Attribution Reports
          </h1>
          <p className="text-sm mt-1" style={{ color: CSS.textSecondary }}>
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
                    : 'hover:bg-[var(--app-hover-bg)]',
                )}
                style={!isActive ? {
                  backgroundColor: CSS.cardBgHover,
                  border: `1px solid ${CSS.borderLight}`,
                  color: CSS.textSecondary,
                } : undefined}
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
          className="rounded-xl border p-3"
          style={{ backgroundColor: CSS.cardBgHover, borderColor: CSS.borderLight }}
        >
          <p className="text-xs" style={{ color: CSS.textSecondary }}>
            <span className="font-semibold">{MODEL_DESCRIPTIONS[currentModel]}</span>
          </p>
        </motion.div>

        {/* Revenue by Source - Horizontal Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={cn(card, 'p-4 sm:p-5')}
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textSecondary }} />
              <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>Revenue by Source</h3>
            </div>
            <span className="text-xs" style={{ color: CSS.textMuted }}>
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
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>
                        {source.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold" style={{ color: CSS.text }}>
                        {formatCurrency(source.revenue)}
                      </span>
                      <span className="text-[10px] tabular-nums" style={{ color: CSS.textMuted }}>
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
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
            style={cardStyle}
          >
            <div className="p-4 sm:p-5 border-b" style={{ borderColor: CSS.border }}>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4" style={{ color: CSS.textSecondary }} />
                <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>CAC by Channel</h3>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <SmartDataTable
                data={data.cacByChannel as unknown as Record<string, unknown>[]}
                columns={cacColumns}
                searchable
                enableExport
                pageSize={10}
                searchPlaceholder="Search channels…"
              />
            </div>
          </motion.div>

          {/* Touchpoint Contribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(card, 'p-4 sm:p-5')}
            style={cardStyle}
          >
            <div className="flex items-center gap-2 mb-5">
              <GitBranch className="w-4 h-4" style={{ color: CSS.textSecondary }} />
              <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>Touchpoint Contribution</h3>
            </div>
            <div className="space-y-4">
              {data.touchpointContribution.map((tp, i) => {
                const width = maxContribution > 0 ? (tp.contribution / maxContribution) * 100 : 0;
                return (
                  <div key={tp.touchpoint}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>
                        {tp.touchpoint}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: CSS.text }}>
                          {tp.contribution}%
                        </span>
                        <span className="text-[10px] tabular-nums" style={{ color: CSS.textMuted }}>
                          {tp.conversions} conv
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
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
          style={cardStyle}
        >
          <div className="p-4 sm:p-5 border-b" style={{ borderColor: CSS.border }}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: CSS.textSecondary }} />
              <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>Assisted Conversions</h3>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <SmartDataTable
              data={data.assistedConversions as unknown as Record<string, unknown>[]}
              columns={assistedColumns}
              searchable
              enableExport
              pageSize={10}
              searchPlaceholder="Search channels…"
            />
          </div>
        </motion.div>

        {/* Model Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={cn(card, 'p-4 sm:p-5')}
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4" style={{ color: CSS.textSecondary }} />
            <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>Model Comparison</h3>
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
                  className="rounded-xl border p-3 cursor-pointer transition-colors"
                  style={
                    i === selectedModelIndex
                      ? { borderColor: 'rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }
                      : { backgroundColor: CSS.cardBgHover, borderColor: CSS.border }
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: CSS.text }}>
                      {MODEL_LABELS[model.model]}
                    </span>
                    {i === selectedModelIndex && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-lg font-bold" style={{ color: CSS.text }}>
                    {formatCurrency(modelTotal)}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: CSS.textMuted }}>
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
