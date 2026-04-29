'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3, Repeat, Zap, RefreshCw, DollarSign, Target,
  ArrowUpRight, ArrowDownRight, Users, Layers,
} from 'lucide-react';
import {
  revenueMonthly, revenueByClient, revenueByService
} from '@/modules/finance/data/mock-data';
import { useFinanceStore } from '@/modules/finance/finance-store';
import type { RevenueByClient } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const months = ['O', 'N', 'D', 'J', 'F', 'M', 'A'];

export default function RevenuePage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [selectedRange, setSelectedRange] = useState<string>('ytd');

  const latest = revenueMonthly[revenueMonthly.length - 1];
  const totalRevenue = revenueMonthly.reduce((s: number, r) => s + r.revenue, 0);

  const topClients = useMemo(() =>
    [...revenueByClient].sort((a: RevenueByClient, b: RevenueByClient) => b.revenue - a.revenue).slice(0, 8),
    []
  );

  const maxServiceRevenue = Math.max(...revenueByService.map((s) => s.revenue));

  const kpiStats = [
    { label: 'MRR', value: formatINR(latest.mrr), icon: Repeat, color: 'success', change: 5.7, changeLabel: 'month-over-month' },
    { label: 'ARR', value: formatINR(latest.arr), icon: BarChart3, color: 'success', change: 5.7, changeLabel: 'annualized revenue' },
    { label: 'Retainer', value: formatINR(latest.retainer), icon: RefreshCw, color: 'info', change: 6.1, changeLabel: 'recurring retainer' },
    { label: 'Upsell', value: formatINR(latest.upsell), icon: Zap, color: 'accent', change: 15.5, changeLabel: 'upsell this month' },
    { label: 'Renewal', value: formatINR(latest.renewal), icon: ArrowUpRight, color: 'warning', change: 14.9, changeLabel: 'contracts renewed' },
    { label: 'One-time', value: formatINR(latest.oneTime), icon: DollarSign, color: 'info', change: 0, changeLabel: 'project-based' },
    { label: 'Total Revenue', value: formatINR(latest.revenue), icon: BarChart3, color: 'success', change: 8.3, changeLabel: 'this month' },
  ];

  const dateRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: 'YTD', value: 'ytd' },
    { label: '1Y', value: '1y' },
  ];

  const tableData = useMemo(() =>
    topClients.map((client) => ({
      id: client.client,
      client: client.client,
      revenue: formatINR(client.revenue),
      mrr: formatINR(client.mrr),
      growth: client.growth,
      services: client.services,
    })),
    [topClients]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => <p className="text-sm font-medium" style={{ color: CSS.text }}>{row.client as string}</p>,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold" style={{ color: CSS.text }}>{row.revenue as string}</span>,
    },
    {
      key: 'mrr',
      label: 'MRR',
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{row.mrr as string}</span>,
    },
    {
      key: 'growth',
      label: 'Growth',
      sortable: true,
      render: (row) => {
        const g = row.growth as number;
        return (
          <span className="flex items-center gap-0.5 text-sm font-semibold" style={{ color: g > 0 ? CSS.success : CSS.danger }}>
            {g > 0 ? '↑' : '↓'} {Math.abs(g)}%
          </span>
        );
      },
    },
    {
      key: 'services',
      label: 'Services',
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {(row.services as string[]).map((svc) => (
            <StatusBadge key={svc} status={svc} variant="pill" className="text-[9px] px-1.5 py-0" />
          ))}
        </div>
      ),
    },
  ], []);

  return (
    <PageShell
      title="Revenue Intelligence"
      subtitle={<span>Total Revenue: <span style={{ color: CSS.text }}>{formatINR(totalRevenue)}</span></span>}
      icon={() => <BarChart3 className="w-5 h-5" style={{ color: CSS.accent }} />}
    >
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 rounded-xl border p-1" style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border }}>
            {dateRanges.map((dr) => (
              <button
                key={dr.value}
                onClick={() => setSelectedRange(dr.value)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors',
                  selectedRange === dr.value ? 'text-[var(--app-accent)] bg-[var(--app-active-bg)]' : 'text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
                )}
              >
                {dr.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <KpiWidget
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.change !== 0 ? (isPositive ? 'up' : 'down') : undefined}
                trendValue={stat.change !== 0 ? `${Math.abs(stat.change)}%` : undefined}
              />
            );
          })}
        </div>

        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-end gap-2 h-36">
            {revenueMonthly.map((entry, j) => {
              const maxVal = Math.max(...revenueMonthly.map((r) => r.target), ...revenueMonthly.map((r) => r.revenue));
              const achieved = entry.revenue >= entry.target;
              return (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <div className="flex gap-0.5 w-full items-end h-full justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.target / maxVal) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-t-sm"
                      style={{ backgroundColor: CSS.hoverBg }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.revenue / maxVal) * 100}%` }}
                      transition={{ delay: 0.45 + j * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-t-sm"
                      style={{ backgroundColor: achieved ? 'rgba(52, 211, 153, 0.6)' : 'rgba(248, 113, 113, 0.6)' }}
                    />
                  </div>
                  <span className="text-[9px]" style={{ color: CSS.textMuted }}>{months[j]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue by Client Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Revenue by Client</span>
            </div>
          </div>
          <SmartDataTable
            columns={columns}
            data={tableData}
            searchable
            searchPlaceholder="Search clients..."
            searchKeys={['client', 'services']}
            enableExport
            emptyMessage="No clients found"
            pageSize={8}
          />
        </div>

        {/* Revenue by Service */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Revenue by Service</span>
            </div>
          </div>
          <div className="space-y-3">
            {revenueByService.map((svc, i) => (
              <motion.div
                key={svc.service}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.05, duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: CSS.text }}>{svc.service}</span>
                    <StatusBadge status={svc.growth > 0 ? 'completed' : 'overdue'} variant="pill" className="text-[9px] px-1.5 py-0">
                      {svc.growth > 0 ? '+' : ''}{svc.growth}%
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: CSS.textMuted }}>{svc.projects} projects</span>
                    <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(svc.revenue)}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(svc.revenue / maxServiceRevenue) * 100}%` }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'rgba(52, 211, 153, 0.4)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
