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
  const totalRevenue = revenueMonthly.reduce((s: number, r: RevenueEntry) => s + r.revenue, 0);

  const kpiStats = useMemo(() => [
    { label: 'MRR', value: formatINR(latest.mrr), icon: Repeat, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 5.7, changeLabel: 'month-over-month' },
    { label: 'ARR', value: formatINR(latest.arr), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 5.7, changeLabel: 'annualized revenue' },
    { label: 'Retainer Revenue', value: formatINR(latest.retainer), icon: RefreshCw, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 6.1, changeLabel: 'recurring retainer' },
    { label: 'Upsell Revenue', value: formatINR(latest.upsell), icon: Zap, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: 15.5, changeLabel: 'upsell this month' },
    { label: 'Renewal Revenue', value: formatINR(latest.renewal), icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: 14.9, changeLabel: 'contracts renewed' },
    { label: 'One-time Revenue', value: formatINR(latest.oneTime), icon: DollarSign, color: 'text-pink-400', bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', change: 0, changeLabel: 'project-based' },
    { label: 'Total Revenue', value: formatINR(latest.revenue), icon: BarChart3, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 8.3, changeLabel: 'this month' },
  ], [isDark, latest]);

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
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <BarChart3 className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Revenue Intelligence</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Total Revenue: {formatINR(totalRevenue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-1 rounded-[var(--app-radius-lg)] border p-1',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.03] border-black/[0.06]'
            )}>
              {dateRanges.map((dr) => (
                <button
                  key={dr.value}
                  onClick={() => setSelectedRange(dr.value)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded-[var(--app-radius-lg)] transition-colors',
                    selectedRange === dr.value
                      ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                      : (isDark ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50')
                  )}
                >
                  {dr.label}
                </button>
              ))}
            </div>
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Calendar className="w-4 h-4" />
              {today}
            </Badge>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <KpiWidget
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </span>
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  {stat.change !== 0 && (
                    <span className={cn(
                      'flex items-center gap-0.5 text-[10px] font-medium',
                      isPositive ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
                <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                  {stat.changeLabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Monthly Revenue — Target vs Actual
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-success)]')} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', isDark ? 'bg-white/20' : 'bg-black/15')} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Target</span>
              </div>
            </div>
          </div>
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
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('flex-1 rounded-t-sm max-w-[40%]', 'bg-[var(--app-hover-bg)]')}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.revenue / maxVal) * 100}%` }}
                      transition={{ delay: 0.45 + j * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-t-sm"
                      style={{ backgroundColor: achieved ? 'rgba(52, 211, 153, 0.6)' : 'rgba(248, 113, 113, 0.6)' }}
                    />
                  </div>
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{months[j]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Revenue by Client Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Revenue by Client
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Client', 'Revenue', 'MRR', 'Growth', 'Services'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClients.map((client: RevenueByClient, i) => (
                  <motion.tr
                    key={client.client}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    className={cn(
                      'border-b cursor-pointer transition-colors',
                      'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <td className="py-3 px-3">
                      <p className="text-sm font-medium">{client.client}</p>
                    </td>
                    <td className="py-3 px-3 text-sm font-semibold">{formatINR(client.revenue)}</td>
                    <td className="py-3 px-3 text-sm">{formatINR(client.mrr)}</td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        'flex items-center gap-0.5 text-sm font-semibold',
                        client.growth > 0 ? 'text-emerald-500' : 'text-red-500'
                      )}>
                        {client.growth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(client.growth)}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {client.services.map(svc => (
                          <Badge key={svc} variant="secondary" className={cn('text-[9px] px-1.5 py-0', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                            {svc}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Revenue by Service */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Revenue by Service
              </span>
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
                    <span className="text-sm font-medium">{svc.service}</span>
                    <Badge variant="secondary" className={cn(
                      'text-[9px] px-1.5 py-0',
                      svc.growth > 0 ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]')
                        : ('bg-[var(--app-danger-bg)] text-[var(--app-danger)]')
                    )}>
                      {svc.growth > 0 ? '+' : ''}{svc.growth}%
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{svc.projects} projects</span>
                    <span className="text-sm font-semibold">{formatINR(svc.revenue)}</span>
                  </div>
                </div>
                <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
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
