'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import {
  FileSpreadsheet, TrendingUp, TrendingDown, AlertTriangle,
  BarChart3, Users, ArrowDownRight,
} from 'lucide-react';
import { clientProfitability, projectMargins, serviceMargins } from './data/mock-data';
import { useFinanceStore } from './finance-store';
import type { ClientProfitability, ProjectMargin } from './types';

// ── Margin → CSS color ──────────────────────────────────
function getMarginColor(margin: number): string {
  if (margin > 50) return CSS.success;
  if (margin >= 30) return CSS.info;
  return CSS.danger;
}

function getMarginBadge(margin: number): string {
  if (margin > 50) return 'success';
  if (margin >= 30) return 'info';
  return 'danger';
}

// ── Margin filter type ──────────────────────────────────
type MarginFilter = 'all' | 'healthy' | 'warning' | 'critical';

export default function ProfitabilityPage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);
  const [marginFilter, setMarginFilter] = useState<MarginFilter>('all');

  // ── Derived data ─────────────────────────────────────
  const avgMargin = useMemo(() => {
    const total = clientProfitability.reduce((s, c) => s + c.margin, 0);
    return (total / clientProfitability.length).toFixed(1);
  }, []);

  const totalProfit = useMemo(
    () => clientProfitability.reduce((s, c) => s + c.profit, 0),
    [],
  );

  const atRiskCount = useMemo(
    () => clientProfitability.filter((c) => c.risk === 'high' || c.risk === 'medium').length,
    [],
  );

  const totalRevision = useMemo(
    () => clientProfitability.reduce((s, c) => s + c.revisionCost, 0),
    [],
  );

  const sortedClients = useMemo(
    () => [...clientProfitability].sort((a, b) => b.margin - a.margin),
    [],
  );

  const filteredClients = useMemo(() => {
    if (marginFilter === 'all') return sortedClients;
    if (marginFilter === 'healthy') return sortedClients.filter((c) => c.margin > 50);
    if (marginFilter === 'warning') return sortedClients.filter((c) => c.margin >= 30 && c.margin <= 50);
    return sortedClients.filter((c) => c.margin < 30);
  }, [marginFilter, sortedClients]);

  const lowMarginAlerts = useMemo(
    () => [
      ...clientProfitability.filter((c) => c.margin < 25).map((c) => ({
        type: 'client' as const,
        name: c.client,
        margin: c.margin,
        detail: `${formatINR(c.revisionCost)} revision cost eating margins`,
        recommendation: 'Renegotiate scope & revision policy',
      })),
      ...projectMargins.filter((p) => p.margin < 25 || p.margin < 0).map((p) => ({
        type: 'project' as const,
        name: p.project,
        margin: p.margin,
        detail: `Spent ${formatINR(p.spent)} of ${formatINR(p.budget)} budget`,
        recommendation: p.status === 'loss' ? 'Stop further work, review SOW' : 'Tighten scope control',
      })),
    ],
    [],
  );

  const churnRiskClients = useMemo(
    () => clientProfitability.filter((c) => c.trend < 0),
    [],
  );

  // ── Filter items ──────────────────────────────────────
  const filterItems = useMemo(() => [
    { key: 'all', label: 'All Clients', count: clientProfitability.length },
    { key: 'healthy', label: '>50% Margin', count: clientProfitability.filter((c) => c.margin > 50).length },
    { key: 'warning', label: '30-50%', count: clientProfitability.filter((c) => c.margin >= 30 && c.margin <= 50).length },
    { key: 'critical', label: '<30%', count: clientProfitability.filter((c) => c.margin < 30).length },
  ], []);

  // ── Project Margins table ─────────────────────────────
  const projectTableData = useMemo(
    () =>
      projectMargins.map((proj: ProjectMargin) => ({
        id: proj.project,
        project: proj.project,
        client: proj.client,
        revenue: proj.revenue,
        budget: proj.budget,
        spent: proj.spent,
        margin: proj.margin,
        marginColor: getMarginColor(proj.margin),
        status: proj.status,
      })),
    [],
  );

  const projectColumns: DataTableColumnDef[] = useMemo(
    () => [
      {
        key: 'project',
        label: 'Project',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium" style={{ color: CSS.text }}>
            {row.project as string}
          </span>
        ),
      },
      {
        key: 'client',
        label: 'Client',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>
            {row.client as string}
          </span>
        ),
      },
      {
        key: 'revenue',
        label: 'Revenue',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium" style={{ color: CSS.text }}>
            {formatINR(row.revenue as number)}
          </span>
        ),
      },
      {
        key: 'budget',
        label: 'Budget',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>
            {formatINR(row.budget as number)}
          </span>
        ),
      },
      {
        key: 'spent',
        label: 'Spent',
        sortable: true,
        render: (row) => (
          <span className="text-sm" style={{ color: CSS.textSecondary }}>
            {formatINR(row.spent as number)}
          </span>
        ),
      },
      {
        key: 'margin',
        label: 'Margin %',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-bold" style={{ color: row.marginColor as string }}>
            {row.margin as number}%
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <StatusBadge
            status={row.status as string}
            variant="pill"
            className="text-[10px] px-2 py-0 capitalize"
          />
        ),
      },
    ],
    [],
  );

  // ── Render ────────────────────────────────────────────
  return (
    <PageShell
      title="Profitability Intelligence"
      subtitle="Margin & Client Profit Analytics"
      icon={() => <FileSpreadsheet className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <span
          className="px-3 py-1.5 text-xs font-medium rounded-full"
          style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
        >
          <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
          Avg {avgMargin}% margin
        </span>
      }
    >
      <div className="space-y-6">
        {/* ── KPIs ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget
            label="Avg Client Margin"
            value={`${avgMargin}%`}
            icon={TrendingUp}
            color="success"
            trend="up"
            trendValue="+2.1%"
          />
          <KpiWidget
            label="Total Profit"
            value={formatINR(totalProfit)}
            icon={FileSpreadsheet}
            color="success"
            trend="up"
            trendValue="+8.4%"
          />
          <KpiWidget
            label="At-Risk Clients"
            value={`${atRiskCount}`}
            icon={AlertTriangle}
            color="danger"
            trend="down"
            trendValue="-1"
          />
          <KpiWidget
            label="Revision Cost"
            value={formatINR(totalRevision)}
            icon={ArrowDownRight}
            color="warning"
            trend="up"
            trendValue="+3.5%"
          />
        </div>

        {/* ── Client Profitability Filter ─────────────── */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: CSS.textMuted }}>
            Clients
          </span>
          <FilterBar
            filters={filterItems}
            activeFilter={marginFilter}
            onFilterChange={(k) => setMarginFilter(k as MarginFilter)}
          />
        </div>

        {/* ── Client Profitability Cards ──────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClients.map((client, i) => (
            <motion.div
              key={client.client}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
              className="rounded-2xl border p-4 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: CSS.cardBg,
                border: `1px solid ${CSS.border}`,
                boxShadow: CSS.shadowCard,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                  {client.client}
                </span>
                <div className="flex items-center gap-1.5">
                  {client.trend >= 0 ? (
                    <TrendingUp className="w-3 h-3" style={{ color: CSS.success }} />
                  ) : (
                    <TrendingDown className="w-3 h-3" style={{ color: CSS.danger }} />
                  )}
                  <StatusBadge
                    status={client.risk}
                    variant="pill"
                    className="text-[9px] px-1.5 py-0 capitalize"
                  />
                </div>
              </div>

              {/* Revenue / Cost / Profit */}
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
                  <p className="text-xs font-semibold" style={{ color: client.profit > 0 ? CSS.success : CSS.danger }}>
                    {formatINR(client.profit)}
                  </p>
                </div>
              </div>

              {/* Margin bar */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>Margin</span>
                <span className="text-xs font-bold" style={{ color: getMarginColor(client.margin) }}>
                  {client.margin}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(client.margin, 100)}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getMarginColor(client.margin) }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Project Margins Table ───────────────────── */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: CSS.accent }} />
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

        {/* ── Service Margins + Alerts Grid ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Margins — horizontal bars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: ANIMATION.duration.slow }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Service Margins</span>
            </div>
            <div className="space-y-3">
              {serviceMargins.map((svc, i) => (
                <div key={svc.service}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: CSS.text }}>{svc.service}</span>
                    <span className="text-xs font-bold" style={{ color: getMarginColor(svc.margin) }}>
                      {svc.margin}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(svc.margin, 100)}%` }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getMarginColor(svc.margin) }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px]" style={{ color: CSS.textMuted }}>
                      {formatINR(svc.revenue)} revenue
                    </span>
                    <span className="text-[9px]" style={{ color: CSS.textMuted }}>
                      {svc.projects} projects
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Low Margin Alerts + Churn Risk */}
          <div className="space-y-4">
            {/* Low Margin Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: ANIMATION.duration.slow }}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
                <span className="text-sm font-semibold" style={{ color: CSS.text }}>Low Margin Alerts</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: CSS.warningBg, color: CSS.warning }}
                >
                  {lowMarginAlerts.length}
                </span>
              </div>
              <div className="space-y-2">
                {lowMarginAlerts.map((alert, i) => (
                  <motion.div
                    key={`${alert.type}-${alert.name}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ borderColor: CSS.border }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: CSS.text }}>
                          {alert.name}
                        </span>
                        <StatusBadge
                          status={alert.type === 'client' ? 'at-risk' : 'critical'}
                          variant="pill"
                          className="text-[8px] px-1 py-0"
                        >
                          {alert.type}
                        </StatusBadge>
                      </div>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>{alert.detail}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs font-bold" style={{ color: CSS.danger }}>{alert.margin}%</p>
                      <p className="text-[9px]" style={{ color: CSS.textMuted }}>{alert.recommendation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Churn Risk */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: ANIMATION.duration.slow }}
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--app-danger) 3%, transparent)',
                border: `1px solid ${CSS.border}`,
                boxShadow: CSS.shadowCard,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownRight className="w-4 h-4" style={{ color: CSS.danger }} />
                <span className="text-sm font-semibold" style={{ color: CSS.danger }}>Churn Risk</span>
              </div>
              <div className="space-y-2">
                {churnRiskClients.map((c, i) => (
                  <motion.div
                    key={c.client}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ borderColor: 'color-mix(in srgb, var(--app-danger) 12%, transparent)' }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5" style={{ color: CSS.danger }} />
                        <span className="text-xs font-medium" style={{ color: CSS.text }}>
                          {c.client}
                        </span>
                      </div>
                      <p className="text-[10px] ml-5" style={{ color: CSS.textMuted }}>
                        {c.client} trending {c.trend}% — churn risk high
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-bold" style={{ color: CSS.danger }}>
                        {formatINR(c.revenue)}
                      </span>
                      <p className="text-[9px]" style={{ color: CSS.textMuted }}>revenue at risk</p>
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
