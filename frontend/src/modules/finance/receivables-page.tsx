'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import {
  HandCoins, Clock, AlertTriangle, Send, Phone, Scale,
  TrendingDown, Sparkles,
} from 'lucide-react';
import { receivables, agingBuckets } from './data/mock-data';
import { useFinanceStore } from './finance-store';
import type { Receivable } from './types';

// ── Aging color mapping ───────────────────────────────
const bucketColors: Record<string, string> = {
  '0-30': 'success',
  '31-60': 'warning',
  '61-90': 'info',
  '90+': 'danger',
};

const bucketCssColors: Record<string, string> = {
  '0-30': CSS.success,
  '31-60': CSS.warning,
  '61-90': CSS.info,
  '90+': CSS.danger,
};

const stageLabels: Record<string, string> = {
  'first-reminder': '1st Reminder',
  'second-reminder': '2nd Reminder',
  escalation: 'Escalation',
  legal: 'Legal',
  resolved: 'Resolved',
};

const stageStatusMap: Record<string, string> = {
  'first-reminder': 'pending',
  'second-reminder': 'pending',
  escalation: 'escalated',
  legal: 'escalated',
  resolved: 'completed',
};

type AgingFilter = 'all' | '0-30' | '31-60' | '61-90' | '90+';

export default function ReceivablesPage() {
  const selectInvoice = useFinanceStore((s) => s.selectInvoice);
  const [agingFilter, setAgingFilter] = useState<AgingFilter>('all');

  // ── Derived data ─────────────────────────────────────
  const totalOutstanding = useMemo(
    () => receivables.reduce((s: number, r: Receivable) => s + r.dueAmount, 0),
    [],
  );

  const avgOverdue = useMemo(() => {
    const overdue = receivables.filter((r: Receivable) => r.overdueDays > 0);
    if (overdue.length === 0) return 0;
    return Math.round(overdue.reduce((s: number, r: Receivable) => s + r.overdueDays, 0) / overdue.length);
  }, []);

  const collectionRate = useMemo(() => {
    const total = receivables.reduce((s: number, r: Receivable) => s + r.dueAmount, 0);
    const highProb = receivables
      .filter((r: Receivable) => r.paymentProbability >= 70)
      .reduce((s: number, r: Receivable) => s + r.dueAmount, 0);
    return total > 0 ? Math.round((highProb / total) * 100) : 0;
  }, []);

  const filteredReceivables = useMemo(
    () => agingFilter === 'all' ? receivables : receivables.filter((r: Receivable) => r.agingBucket === agingFilter),
    [agingFilter],
  );

  const highRiskReceivables = useMemo(
    () => receivables.filter((r: Receivable) => r.aiPrediction && r.aiPrediction.delayProbability > 0.5),
    [],
  );

  const overdue90Plus = useMemo(
    () => receivables.filter((r: Receivable) => r.agingBucket === '90+'),
    [],
  );

  // ── Filter items with counts ─────────────────────────
  const filterItems = useMemo(() => [
    { key: 'all', label: 'All', count: receivables.length },
    ...agingBuckets.map((b) => ({ key: b.range, label: `${b.range} days`, count: b.count })),
  ], []);

  // ── Table columns ────────────────────────────────────
  const tableData = useMemo(
    () => filteredReceivables.map((r: Receivable) => ({
      id: r.id,
      client: r.client,
      invoiceNo: r.invoiceNo,
      dueAmount: r.dueAmount,
      overdueDays: r.overdueDays,
      agingBucket: r.agingBucket,
      paymentProbability: r.paymentProbability,
      delayProbability: r.aiPrediction?.delayProbability ?? 0,
      followUpStage: r.followUpStage,
    })),
    [filteredReceivables],
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => <span className="text-sm font-medium" style={{ color: CSS.text }}>{row.client as string}</span>,
    },
    {
      key: 'invoiceNo',
      label: 'Invoice',
      sortable: true,
      render: (row) => <span className="text-sm font-mono" style={{ color: CSS.textSecondary }}>{row.invoiceNo as string}</span>,
    },
    {
      key: 'dueAmount',
      label: 'Amount',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(row.dueAmount as number)}</span>,
    },
    {
      key: 'overdueDays',
      label: 'Overdue Days',
      sortable: true,
      render: (row) => {
        const days = row.overdueDays as number;
        const colorKey = days > 60 ? CSS.danger : days > 30 ? CSS.warning : days > 0 ? CSS.info : CSS.success;
        return (
          <span className="text-sm font-semibold" style={{ color: colorKey }}>
            {days > 0 ? `${days}d` : 'Current'}
          </span>
        );
      },
    },
    {
      key: 'agingBucket',
      label: 'Aging',
      sortable: true,
      render: (row) => (
        <StatusBadge status={bucketColors[row.agingBucket as string] ?? 'neutral'} variant="pill" className="text-[10px] px-2 py-0">
          {row.agingBucket as string}
        </StatusBadge>
      ),
    },
    {
      key: 'paymentProbability',
      label: 'Payment Prob.',
      sortable: true,
      render: (row) => {
        const prob = row.paymentProbability as number;
        const color = prob >= 80 ? CSS.success : prob >= 60 ? CSS.warning : CSS.danger;
        return (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="h-full rounded-full" style={{ width: `${prob}%`, backgroundColor: color }} />
            </div>
            <span className="text-[10px] font-medium" style={{ color: CSS.text }}>{prob}%</span>
          </div>
        );
      },
    },
    {
      key: 'delayProbability',
      label: 'AI Prediction',
      sortable: true,
      render: (row) => {
        const dp = row.delayProbability as number;
        const color = dp > 0.6 ? CSS.danger : dp > 0.3 ? CSS.warning : CSS.success;
        return (
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color }} />
            <span className="text-xs font-semibold" style={{ color }}>
              {(dp * 100).toFixed(0)}% delay
            </span>
          </div>
        );
      },
    },
    {
      key: 'followUpStage',
      label: 'Follow-up Stage',
      sortable: true,
      render: (row) => {
        const stage = row.followUpStage as string;
        return (
          <StatusBadge status={stageStatusMap[stage] ?? stage} variant="pill" className="text-[9px] px-1.5 py-0">
            {stageLabels[stage] ?? stage}
          </StatusBadge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: CSS.success, backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            aria-label="Send reminder"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: CSS.info, backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            aria-label="Call client"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  // ── Render ───────────────────────────────────────────
  return (
    <PageShell
      title="Collection Engine"
      subtitle="Receivables & Payment Recovery"
      icon={() => <HandCoins className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <span className="px-3 py-1.5 text-xs font-medium rounded-full" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
          <Clock className="w-3.5 h-3.5 inline mr-1.5" />
          {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      }
    >
      <div className="space-y-6">
        {/* ── Aging Bucket Summary Cards ──────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {agingBuckets.map((bucket, i) => {
            const colorKey = bucketColors[bucket.range] ?? 'info';
            const cssColor = bucketCssColors[bucket.range] ?? CSS.info;
            return (
              <motion.div
                key={bucket.range}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
                onClick={() => setAgingFilter(agingFilter === bucket.range ? 'all' : (bucket.range as AgingFilter))}
                className="rounded-2xl border p-4 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: agingFilter === bucket.range ? CSS.activeBg : CSS.cardBg,
                  borderColor: agingFilter === bucket.range ? cssColor : CSS.border,
                  boxShadow: agingFilter === bucket.range ? `0 0 0 1px ${cssColor}20` : CSS.shadowCard,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                    {bucket.range} days
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: cssColor }}>
                    {bucket.count} invoices
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight" style={{ color: cssColor }}>
                  {formatINR(bucket.total)}
                </p>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bucket.percentage}%` }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cssColor }}
                  />
                </div>
                <p className="text-[10px] mt-1" style={{ color: CSS.textMuted }}>
                  {bucket.percentage}% of total
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── KPI Row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget
            label="Total Outstanding"
            value={formatINR(totalOutstanding)}
            icon={HandCoins}
            color="warning"
            trend="up"
            trendValue="+5.2%"
          />
          <KpiWidget
            label="Average Overdue"
            value={`${avgOverdue} days`}
            icon={Clock}
            color="info"
          />
          <KpiWidget
            label="Collection Rate"
            value={`${collectionRate}%`}
            icon={TrendingDown}
            color="success"
            trend="up"
            trendValue="+3.1%"
          />
        </div>

        {/* ── Filter Bar ──────────────────────────────── */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: CSS.textMuted }}>
            Filter
          </span>
          <FilterBar
            filters={filterItems}
            activeFilter={agingFilter}
            onFilterChange={(k) => setAgingFilter(k as AgingFilter)}
          />
        </div>

        {/* ── Receivables Table ───────────────────────── */}
        <SmartDataTable
          columns={columns}
          data={tableData}
          onRowClick={(row) => selectInvoice(row.id as string)}
          searchable
          searchPlaceholder="Search receivables..."
          searchKeys={['client', 'invoiceNo']}
          enableExport
          emptyMessage="No receivables for this aging bucket"
          pageSize={10}
        />

        {/* ── AI Payment Risk Panel ───────────────────── */}
        {highRiskReceivables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: ANIMATION.duration.slow }}
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--app-danger) 3%, transparent)',
              borderColor: 'color-mix(in srgb, var(--app-danger) 12%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4" style={{ color: CSS.danger }} />
              <span className="text-sm font-semibold" style={{ color: CSS.danger }}>
                AI Payment Risk — High Delay Probability
              </span>
            </div>
            <div className="space-y-3">
              {highRiskReceivables.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: CSS.dangerBg }}>
                      <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>
                        {r.client} — {r.invoiceNo}
                      </p>
                      <p className="text-xs truncate" style={{ color: CSS.textMuted }}>
                        {r.aiPrediction?.riskFactors.join(' · ') ?? 'No risk factors'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: CSS.danger }}>
                        {(r.aiPrediction!.delayProbability * 100).toFixed(0)}% delay risk
                      </p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>{formatINR(r.dueAmount)}</p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ backgroundColor: CSS.dangerBg, color: CSS.danger }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = CSS.dangerBg; }}
                    >
                      <Send className="w-3 h-3" />
                      Send Reminder
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Bulk Actions ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: ANIMATION.duration.slow }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center gap-2 mb-4">
            <HandCoins className="w-4 h-4" style={{ color: CSS.accent }} />
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Bulk Actions</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: CSS.successBg, color: CSS.success }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <Phone className="w-4 h-4" />
              Send WhatsApp Reminder
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                {receivables.filter((r: Receivable) => r.overdueDays > 0).length} overdue
              </span>
            </button>
            {overdue90Plus.length > 0 && (
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: CSS.dangerBg, color: CSS.danger }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                <Scale className="w-4 h-4" />
                Escalate to Legal
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                  {overdue90Plus.length} invoices
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
