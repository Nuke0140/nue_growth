'use client';

import { formatINR } from './utils';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, TrendingDown, AlertTriangle, Download, ArrowUpRight, ArrowDownRight, Target, Users,
} from 'lucide-react';
import { clientProfitability, projectMargins, serviceMargins } from '@/modules/finance/data/mock-data';
import type { ProjectMargin } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';


function getMarginColor(margin: number): string {
  if (margin >= 50) return CSS.success;
  if (margin >= 35) return CSS.info;
  if (margin >= 25) return CSS.warning;
  return CSS.danger;
}

export default function ProfitabilityPage() {
  const lowMarginClients = useMemo(() => clientProfitability.filter(c => c.margin < 25), []);
  const highRiskClients = useMemo(() => clientProfitability.filter(c => c.risk === 'high'), []);
  const avgMargin = useMemo(() => {
    const total = clientProfitability.reduce((s, c) => s + c.margin, 0);
    return (total / clientProfitability.length).toFixed(1);
  }, []);
  const totalProfit = useMemo(() => clientProfitability.reduce((s, c) => s + c.profit, 0), []);
  const totalRevenue = useMemo(() => clientProfitability.reduce((s, c) => s + c.revenue, 0), []);
  const totalRevision = useMemo(() => clientProfitability.reduce((s, c) => s + c.revisionCost, 0), []);

  const kpis = [
    { label: 'Avg Margin', value: `${avgMargin}%`, icon: Target, color: 'success', change: 2.1 },
    { label: 'Total Profit', value: formatINR(totalProfit), icon: TrendingUp, color: 'info', change: 8.4 },
    { label: 'Total Revenue', value: formatINR(totalRevenue), icon: ArrowUpRight, color: 'accent', change: 12.2 },
    { label: 'Revision Cost', value: formatINR(totalRevision), icon: AlertTriangle, color: 'warning', change: -3.5 },
    { label: 'Healthy Clients', value: `${clientProfitability.filter(c => c.margin >= 35).length}/${clientProfitability.length}`, icon: Users, color: 'success', change: 10.0 },
  ];

  const projectTableData = useMemo(() =>
    projectMargins.map((proj: ProjectMargin) => ({
      id: proj.project,
      project: proj.project,
      client: proj.client,
      revenue: formatINR(proj.revenue),
      budget: formatINR(proj.budget),
      spent: formatINR(proj.spent),
      margin: proj.margin,
      marginColor: getMarginColor(proj.margin),
      status: proj.status,
    })),
    []
  );

  const projectColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'project',
      label: 'Project',
      sortable: true,
      render: (row) => <span className="text-xs font-medium" style={{ color: CSS.text }}>{row.project as string}</span>,
    },
    {
      key: 'client',
      label: 'Client',
      render: (row) => <span className="text-xs" style={{ color: CSS.text }}>{row.client as string}</span>,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (row) => <span className="text-xs" style={{ color: CSS.text }}>{row.revenue as string}</span>,
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (row) => <span className="text-xs" style={{ color: CSS.text }}>{row.budget as string}</span>,
    },
    {
      key: 'spent',
      label: 'Spent',
      render: (row) => <span className="text-xs" style={{ color: CSS.text }}>{row.spent as string}</span>,
    },
    {
      key: 'margin',
      label: 'Margin %',
      sortable: true,
      render: (row) => <span className="text-xs font-semibold" style={{ color: row.marginColor as string }}>{row.margin as number}%</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusBadge status={row.status as string} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
      ),
    },
  ], []);

  return (
    <PageShell
      title="Profitability"
      subtitle="Margin Intelligence"
      icon={() => <Target className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
          <Download className="w-4 h-4" /> Export Report
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => {
            const isPositive = kpi.change >= 0;
            return (
              <KpiWidget key={kpi.label} label={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} trend={isPositive ? 'up' : 'down'} trendValue={`${Math.abs(kpi.change)}%`} />
            );
          })}
        </div>

        {/* Client Profitability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientProfitability.map((client, i) => (
            <motion.div
              key={client.client}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
              className="rounded-2xl border p-4 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: CSS.cardBg,
                border: `1px solid ${CSS.border}`,
                boxShadow: CSS.shadowCard,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>{client.client}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium" style={{ color: getMarginColor(client.margin) }}>{client.margin}%</span>
                  {client.trend >= 0 ? <TrendingUp className="w-3 h-3" style={{ color: CSS.success }} /> : <TrendingDown className="w-3 h-3" style={{ color: CSS.danger }} />}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <p className="text-[10px]" style={{ color: CSS.textMuted }}>Revenue</p>
                  <p className="text-xs font-semibold" style={{ color: CSS.text }}>{formatINR(client.revenue)}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: CSS.textMuted }}>Cost</p>
                  <p className="text-xs font-semibold" style={{ color: CSS.text }}>{formatINR(client.cost)}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: CSS.textMuted }}>Profit</p>
                  <p className="text-xs font-semibold" style={{ color: client.profit > 0 ? CSS.success : CSS.danger }}>{formatINR(client.profit)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: CSS.textMuted }}>Revision:</span>
                  <span className="text-[10px] font-medium" style={{ color: CSS.warning }}>{formatINR(client.revisionCost)}</span>
                </div>
                <StatusBadge status={client.risk} variant="pill" className="text-[9px] px-1.5 py-0 capitalize" />
              </div>
              <div className="mt-3 w-full h-1 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(client.margin, 100)}%` }} transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: getMarginColor(client.margin) }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Margin Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Project Margins</span>
          </div>
          <SmartDataTable
            columns={projectColumns}
            data={projectTableData}
            searchable
            searchPlaceholder="Search projects..."
            searchKeys={['project', 'client', 'status']}
            enableExport
            emptyMessage="No project data found"
            pageSize={10}
          />
        </div>

        {/* Service Margins & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Margin Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Service Margins</span>
            </div>
            <div className="space-y-3">
              {serviceMargins.map((svc, i) => (
                <div key={svc.service}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: CSS.text }}>{svc.service}</span>
                    <span className="text-xs font-bold" style={{ color: getMarginColor(svc.margin) }}>{svc.margin}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(svc.margin, 100)}%` }} transition={{ delay: 0.65 + i * 0.08, duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: getMarginColor(svc.margin) }} />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px]" style={{ color: CSS.textMuted }}>{formatINR(svc.revenue)} rev</span>
                    <span className="text-[9px]" style={{ color: CSS.textMuted }}>{svc.projects} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Margin & Churn Risk */}
          <div className="space-y-4">
            {/* Low Margin Alerts */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>Low Margin Alerts</span>
              </div>
              <div className="space-y-2">
                {lowMarginClients.map((c, i) => (
                  <motion.div key={c.client} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.75 + i * 0.05, duration: 0.3 }} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: CSS.border }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: CSS.text }}>{c.client}</p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>{formatINR(c.revenue)} revenue</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold" style={{ color: CSS.danger }}>{c.margin}%</span>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>{formatINR(c.revisionCost)} revisions</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Churn Risk */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: CSS.danger }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>Churn Risk</span>
              </div>
              <div className="space-y-2">
                {highRiskClients.map((c, i) => (
                  <motion.div key={c.client} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.05, duration: 0.3 }} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: CSS.border }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: CSS.text }}>{c.client}</p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>Trend: {c.trend}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold" style={{ color: CSS.danger }}>{formatINR(c.revenue)}</span>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>revenue at risk</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
