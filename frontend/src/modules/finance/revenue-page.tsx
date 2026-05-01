import React, { useMemo } from 'react';
import {
  TrendingUp, DollarSign, Target, BarChart3, ArrowUpRight, Link, Users, Briefcase,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { useFinanceStore } from './finance-store';
import { formatINR } from './utils';
import {
  revenueMonthly,
  revenueByClient,
  revenueByService,
  crmIntegration,
} from './data/mock-data';
import type { RevenueEntry, RevenueByClient, RevenueByService, CRMDealRevenue } from './types';
import { CSS } from '@/styles/design-tokens';

/* ─── KPIs ─── */
const kpis = [
  { label: 'Total Revenue', value: '₹48.5L', color: 'success' as const, icon: DollarSign },
  { label: 'MRR', value: '₹37L', color: 'accent' as const, icon: TrendingUp },
  { label: 'ARR', value: '₹4.44Cr', color: 'success' as const, icon: BarChart3 },
  { label: 'vs Target', value: '104%', color: 'success' as const, icon: Target },
];

/* ─── Revenue Trend Chart (SVG bars + target line) ─── */
const TrendChart: React.FC = () => {
  const maxVal = useMemo(() => Math.max(...revenueMonthly.map((m) => Math.max(m.revenue, m.target ?? 0))), []);
  const chartW = 700;
  const chartH = 200;
  const padL = 60;
  const padB = 30;
  const padT = 10;
  const plotW = chartW - padL - 20;
  const plotH = chartH - padB - padT;
  const barW = plotW / revenueMonthly.length * 0.6;
  const gap = plotW / revenueMonthly.length;

  const y = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const targetPts = revenueMonthly
    .filter((m) => m.target != null)
    .map((m, i) => `${padL + i * gap + gap / 2},${y(m.target!)}`)
    .join(' ');

  return (
    <div className="trend-chart">
      <h3 className="section-heading">Revenue Trend</h3>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="chart-svg">
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const yPos = padT + plotH * (1 - f);
          return (
            <g key={f}>
              <line x1={padL} y1={yPos} x2={chartW - 20} y2={yPos} stroke={CSS.border} strokeDasharray="4 3" />
              <text x={padL - 8} y={yPos + 4} textAnchor="end" fill={CSS.textMuted} fontSize={10}>
                {formatINR(maxVal * f)}
              </text>
            </g>
          );
        })}

        {/* bars */}
        {revenueMonthly.map((m, i) => {
          const x = padL + i * gap + (gap - barW) / 2;
          const barH = (m.revenue / maxVal) * plotH;
          return (
            <g key={m.month}>
              <rect x={x} y={y(m.revenue)} width={barW} height={barH} rx={3} fill={CSS.accent} opacity={0.85} />
              <text x={x + barW / 2} y={chartH - 8} textAnchor="middle" fill={CSS.textMuted} fontSize={10}>
                {m.month.slice(0, 3)}
              </text>
            </g>
          );
        })}

        {/* target line */}
        {targetPts && (
          <polyline points={targetPts} fill="none" stroke={CSS.textMuted} strokeWidth={2} strokeDasharray="6 4" />
        )}
      </svg>
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-swatch" style={{ background: CSS.accent }} /> Actual</span>
        <span className="legend-item"><span className="legend-line" /> Target</span>
      </div>
      <style>{`
        .trend-chart { margin-bottom: var(--space-5); }
        .chart-svg { width: 100%; height: auto; }
        .chart-legend { display: flex; gap: var(--space-4); margin-top: var(--space-2); font-size: var(--font-size-xs); color: var(--text-secondary); }
        .legend-item { display: flex; align-items: center; gap: var(--space-1); }
        .legend-swatch { width: 12px; height: 12px; border-radius: 2px; }
        .legend-line { width: 20px; height: 0; border-top: 2px dashed var(--text-secondary); }
      `}</style>
    </div>
  );
};

/* ─── CRM Pipeline Integration ─── */
const CRMPipeline: React.FC = () => {
  const navigate = useFinanceStore((s) => s.navigateTo);
  const { pipelineValue, weightedPipeline, dealConversionRate, topDeals } = crmIntegration;

  return (
    <div className="crm-section">
      <h3 className="section-heading">
        <Link size={16} /> CRM Pipeline Integration
      </h3>
      <div className="crm-metrics">
        <div className="crm-metric">
          <span className="crm-metric-label">Pipeline Value</span>
          <span className="crm-metric-value">{formatINR(pipelineValue)}</span>
        </div>
        <div className="crm-metric">
          <span className="crm-metric-label">Weighted Pipeline</span>
          <span className="crm-metric-value">{formatINR(weightedPipeline)}</span>
        </div>
        <div className="crm-metric">
          <span className="crm-metric-label">Deal Conversion</span>
          <span className="crm-metric-value">{dealConversionRate}%</span>
        </div>
      </div>

      <div className="crm-deals">
        {topDeals.slice(0, 5).map((d) => (
          <div key={d.client} className="crm-deal-card">
            <div className="deal-top">
              <span className="deal-name">{d.client}</span>
              <span className="deal-value">{formatINR(d.dealValue)}</span>
            </div>
            <div className="deal-meta">
              <StatusBadge status={d.dealValue > 0 ? 'success' : 'warning'} />
              <span>Spend: {formatINR(d.dealValue)}</span>
              <span>Revenue: {formatINR(d.dealValue)}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="crm-link" onClick={() => navigate('dashboard')}>
        <ArrowUpRight size={14} /> View in CRM
      </button>

      <style>{`
        .crm-section { margin-bottom: var(--space-5); }
        .crm-metrics {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3); margin-bottom: var(--space-4);
        }
        .crm-metric {
          padding: var(--space-3); background: var(--surface-elevated, var(--surface-primary));
          border: 1px solid var(--border-primary, var(--border-default)); border-radius: var(--radius-md, 8px);
          display: flex; flex-direction: column; gap: var(--space-1);
        }
        .crm-metric-label { font-size: var(--font-size-xs); color: var(--text-secondary); }
        .crm-metric-value { font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
        .crm-deals { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-3); }
        .crm-deal-card {
          padding: var(--space-3); background: var(--surface-elevated, var(--surface-primary));
          border: 1px solid var(--border-primary, var(--border-default)); border-radius: var(--radius-md, 8px);
        }
        .deal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-1); }
        .deal-name { font-weight: var(--font-weight-medium); color: var(--text-primary); font-size: var(--font-size-sm); }
        .deal-value { font-weight: var(--font-weight-semibold); color: var(--color-accent); font-size: var(--font-size-sm); }
        .deal-meta {
          display: flex; gap: var(--space-3); align-items: center;
          font-size: var(--font-size-xs); color: var(--text-secondary);
        }
        .crm-link {
          display: inline-flex; align-items: center; gap: var(--space-1);
          font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
          color: var(--color-accent); background: none; border: none; cursor: pointer;
        }
        .crm-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

/* ─── Revenue by Client (horizontal bars) ─── */
const ClientChart: React.FC = () => {
  const top8 = useMemo(() => [...revenueByClient].sort((a, b) => b.revenue - a.revenue).slice(0, 8), []);
  const maxRev = useMemo(() => Math.max(...top8.map((c) => c.revenue)), []);

  return (
    <div className="client-chart">
      <h3 className="section-heading">
        <Users size={16} /> Revenue by Client
      </h3>
      {top8.map((c) => {
        const pct = (c.revenue / maxRev) * 100;
        return (
          <div key={c.client} className="client-row">
            <span className="client-name">{c.client}</span>
            <div className="client-bar-track">
              <div className="client-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="client-amount">{formatINR(c.revenue)}</span>
            <span className={`client-growth ${c.growth >= 0 ? 'growth-pos' : 'growth-neg'}`}>
              {c.growth >= 0 ? '+' : ''}{c.growth}%
            </span>
          </div>
        );
      })}
      <style>{`
        .client-chart { margin-bottom: var(--space-5); }
        .client-row {
          display: grid; grid-template-columns: 140px 1fr 100px 60px;
          gap: var(--space-2); align-items: center; margin-bottom: var(--space-2);
        }
        .client-name { font-size: var(--font-size-sm); color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .client-bar-track {
          height: 18px; background: var(--surface-elevated, var(--surface-primary));
          border-radius: var(--radius-sm, 4px); overflow: hidden;
        }
        .client-bar-fill { height: 100%; background: var(--color-accent); border-radius: var(--radius-sm, 4px); opacity: 0.8; transition: width 0.3s; }
        .client-amount { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-primary); text-align: right; }
        .client-growth { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); text-align: right; }
        .growth-pos { color: var(--color-success); }
        .growth-neg { color: var(--color-danger); }
      `}</style>
    </div>
  );
};

/* ─── Revenue by Service (vertical bars) ─── */
const ServiceChart: React.FC = () => {
  const maxSrv = useMemo(() => Math.max(...revenueByService.map((s) => s.revenue)), []);
  const barHeight = 140;

  return (
    <div className="service-chart">
      <h3 className="section-heading">
        <Briefcase size={16} /> Revenue by Service
      </h3>
      <div className="service-bars">
        {revenueByService.map((s) => {
          const h = (s.revenue / maxSrv) * barHeight;
          return (
            <div key={s.service} className="service-col">
              <span className="service-val">{formatINR(s.revenue)}</span>
              <div className="service-bar-track" style={{ height: `${barHeight}px` }}>
                <div className="service-bar-fill" style={{ height: `${h}px` }} />
              </div>
              <span className="service-label">{s.service}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        .service-chart { margin-bottom: var(--space-5); }
        .service-bars { display: flex; gap: var(--space-4); align-items: flex-end; }
        .service-col { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); flex: 1; }
        .service-val { font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); color: var(--text-primary); }
        .service-bar-track {
          width: 100%; display: flex; align-items: flex-end;
          background: var(--surface-elevated, var(--surface-primary)); border-radius: var(--radius-sm, 4px);
        }
        .service-bar-fill {
          width: 100%; background: var(--color-accent); border-radius: var(--radius-sm, 4px);
          opacity: 0.85; transition: height 0.3s;
        }
        .service-label {
          font-size: var(--font-size-xs); color: var(--text-secondary);
          text-align: center; margin-top: var(--space-1);
        }
      `}</style>
    </div>
  );
};

/* ─── Cross-Module Note ─── */
const CrossModuleNote: React.FC = () => {
  const navigate = useFinanceStore((s) => s.navigateTo);
  return (
    <div className="cross-note" onClick={() => navigate('dashboard')} role="button" tabIndex={0}>
      <Link size={16} className="cross-note-icon" />
      <div>
        <p className="cross-note-text">3 CRM deals closing this month worth <strong>₹1.2Cr</strong></p>
        <span className="cross-note-link">View in CRM module <ArrowUpRight size={12} /></span>
      </div>
      <style>{`
        .cross-note {
          display: flex; gap: var(--space-3); align-items: flex-start;
          padding: var(--space-3) var(--space-4);
          background: var(--surface-elevated, var(--surface-primary));
          border: 1px solid color-mix(in srgb, var(--color-accent) 27%, transparent);
          border-left: 4px solid var(--color-accent);
          border-radius: var(--radius-md, 8px);
          cursor: pointer; margin-bottom: var(--space-5);
        }
        .cross-note:hover { background: var(--surface-hover, var(--surface-secondary)); }
        .cross-note-icon { color: var(--color-accent); flex-shrink: 0; margin-top: 2px; }
        .cross-note-text { font-size: var(--font-size-sm); color: var(--text-primary); margin: 0; }
        .cross-note-text strong { color: var(--color-accent); }
        .cross-note-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: var(--font-size-xs); color: var(--color-accent); font-weight: var(--font-weight-medium); margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

/* ─── Main Page ─── */
export const RevenuePage: React.FC = () => {
  return (
    <PageShell title="Revenue Intelligence">
      {/* KPIs */}
      <div className="kpi-row">
        {kpis.map((k) => (
          <KpiWidget key={k.label} label={k.label} value={k.value} color={k.color} icon={k.icon} />
        ))}
      </div>

      {/* Revenue Trend */}
      <TrendChart />

      {/* CRM Pipeline */}
      <CRMPipeline />

      {/* Revenue by Client */}
      <ClientChart />

      {/* Revenue by Service */}
      <ServiceChart />

      {/* Cross-Module Note */}
      <CrossModuleNote />

      <style>{`
        .kpi-row {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4); margin-bottom: var(--space-5);
        }
        .section-heading {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);
          color: var(--text-primary); margin-bottom: var(--space-3);
        }
      `}</style>
    </PageShell>
  );
};

export default RevenuePage;
