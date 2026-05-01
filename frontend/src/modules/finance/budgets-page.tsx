import { useState, useMemo } from 'react';
import { PiggyBank, AlertTriangle, TrendingDown, BarChart3, Target } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { CSS } from '@/styles/design-tokens';
import { formatINR } from './utils';
import { budgets, budgetTrends } from './data/mock-data';
import { useFinanceStore } from './finance-store';

type BudgetFilter = 'all' | 'on-track' | 'at-risk' | 'overspent';

export default function BudgetsPage() {
  const [activeFilter, setActiveFilter] = useState<BudgetFilter>('all');
  const navigate = useFinanceStore((s) => s.navigateTo);

  /* ── Derived data ── */
  const filteredBudgets = useMemo(() => {
    if (activeFilter === 'all') return budgets;
    return budgets.filter((b) => b.status === activeFilter);
  }, [activeFilter]);

  const filterCounts = useMemo(() => ({
    all: budgets.length,
    'on-track': budgets.filter((b) => b.status === 'on-track').length,
    'at-risk': budgets.filter((b) => b.status === 'at-risk').length,
    'overspent': budgets.filter((b) => b.status === 'overspent').length,
  }), []);

  const overspentBudgets = useMemo(
    () => budgets.filter((b) => b.status === 'overspent'),
    []
  );

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalAllocated - totalSpent;
  const atRiskCount = budgets.filter((b) => b.status === 'at-risk' || b.status === 'overspent').length;
  const utilizationPct = ((totalSpent / totalAllocated) * 100).toFixed(1);

  /* ── Chart layout ── */
  const maxChartVal = Math.max(...budgetTrends.map((t) => Math.max(t.allocated, t.spent)));
  const chartH = 180;
  const barW = 28;
  const gap = 16;
  const groupW = barW * 2 + 6;
  const svgW = budgetTrends.length * (groupW + gap) + 40;
  const svgH = chartH + 50;

  /* ── Helpers ── */
  const statusColor = (s: string) =>
    s === 'on-track' ? CSS.success : s === 'at-risk' ? CSS.warning : CSS.danger;

  const progressPct = (b: (typeof budgets)[0]) =>
    Math.min((b.spent / b.allocated) * 100, 100);

  return (
    <PageShell title="Budget Planning" subtitle="Track, allocate, and optimize departmental budgets">
      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiWidget icon={PiggyBank} label="Total Allocated" value={formatINR(totalAllocated)} color="accent" />
        <KpiWidget icon={BarChart3} label="Total Spent" value={formatINR(totalSpent)} color="warning" />
        <KpiWidget icon={Target} label="Remaining" value={formatINR(remaining)} color="success" />
        <KpiWidget icon={AlertTriangle} label="At Risk" value={String(atRiskCount)} color="danger" />
      </div>

      {/* ── Budget Trend Chart ── */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: CSS.text, fontSize: 16, fontWeight: 600 }}>
            <BarChart3 size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Budget Trends — Allocated vs Spent
          </h3>
          <span style={{ fontSize: 12, color: CSS.textSecondary }}>
            Overall utilization: <strong style={{ color: CSS.warning }}>{utilizationPct}%</strong>
          </span>
        </div>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = chartH - chartH * pct + 10;
            return (
              <g key={pct}>
                <line x1={10} y1={y} x2={svgW - 10} y2={y} stroke={CSS.border} strokeWidth={0.5} strokeDasharray="4 4" />
                <text x={6} y={y + 4} textAnchor="end" fontSize={9} fill={CSS.textSecondary}>
                  {formatINR(maxChartVal * pct)}
                </text>
              </g>
            );
          })}
          {/* Bars */}
          {budgetTrends.map((t, i) => {
            const x = i * (groupW + gap) + 20;
            const aH = (t.allocated / maxChartVal) * chartH;
            const sH = (t.spent / maxChartVal) * chartH;
            return (
              <g key={t.month}>
                <rect x={x} y={chartH - aH + 10} width={barW} height={aH} rx={4} fill={CSS.accent} opacity={0.85}>
                  <title>Allocated: {formatINR(t.allocated)}</title>
                </rect>
                <rect x={x + barW + 6} y={chartH - sH + 10} width={barW} height={sH} rx={4} fill={CSS.warning} opacity={0.85}>
                  <title>Spent: {formatINR(t.spent)}</title>
                </rect>
                <text x={x + groupW / 2} y={chartH + 28} textAnchor="middle" fontSize={11} fill={CSS.textSecondary}>
                  {t.month}
                </text>
              </g>
            );
          })}
          {/* X-axis line */}
          <line x1={10} y1={chartH + 10} x2={svgW - 10} y2={chartH + 10} stroke={CSS.border} strokeWidth={1} />
        </svg>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: CSS.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CSS.accent, display: 'inline-block' }} /> Allocated
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: CSS.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CSS.warning, display: 'inline-block' }} /> Spent
          </span>
        </div>
      </div>

      {/* ── FilterBar ── */}
      <FilterBar
        filters={[
          { key: 'all', label: 'All', count: filterCounts.all },
          { key: 'on-track', label: 'On Track', count: filterCounts['on-track'] },
          { key: 'at-risk', label: 'At Risk', count: filterCounts['at-risk'] },
          { key: 'overspent', label: 'Overspent', count: filterCounts.overspent },
        ]}
        activeFilter={activeFilter}
        onFilterChange={(k) => setActiveFilter(k as BudgetFilter)}
      />

      {/* ── Budget Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginTop: 20, marginBottom: 24 }}>
        {filteredBudgets.map((b) => {
          const pct = progressPct(b);
          const variance = ((b.spent - b.allocated) / b.allocated) * 100;
          const remainAmt = b.allocated - b.spent;
          return (
            <div
              key={b.id}
              style={{
                background: CSS.cardBg,
                borderRadius: 12,
                padding: 20,
                borderLeft: `4px solid ${statusColor(b.status)}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease',
              }}
              onClick={() => navigate('budgets')}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ margin: 0, color: CSS.text, fontSize: 15, fontWeight: 600 }}>{b.name}</h4>
                <StatusBadge status={b.status} />
              </div>

              {/* Type badge */}
              <span style={{
                fontSize: 11,
                color: CSS.accent,
                background: CSS.surface1,
                padding: '2px 10px',
                borderRadius: 6,
                marginBottom: 12,
                display: 'inline-block',
                fontWeight: 500,
              }}>
                {b.type}
              </span>

              {/* Financials grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: CSS.textSecondary }}>Allocated</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: CSS.text }}>{formatINR(b.allocated)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: CSS.textSecondary }}>Spent</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: CSS.warning }}>{formatINR(b.spent)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: CSS.textSecondary }}>Remaining</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: remainAmt >= 0 ? CSS.success : CSS.danger }}>
                    {formatINR(remainAmt)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ background: CSS.surface1, borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: 6,
                    background: statusColor(b.status),
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {/* Footer stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: CSS.textSecondary }}>
                <span>{pct.toFixed(1)}% used</span>
                <span style={{ color: variance > 0 ? CSS.danger : CSS.success, fontWeight: 600 }}>
                  {variance > 0 ? '+' : ''}{variance.toFixed(1)}% variance
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Overspend Alerts ── */}
      {overspentBudgets.length > 0 && (
        <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 4px', color: CSS.danger, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingDown size={16} /> Overspend Alerts
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: CSS.textSecondary }}>
            {overspentBudgets.length} budget{overspentBudgets.length > 1 ? 's have' : ' has'} exceeded allocated amounts. Immediate review recommended.
          </p>
          {overspentBudgets.map((b) => {
            const overAmt = b.spent - b.allocated;
            const overPct = ((overAmt / b.allocated) * 100).toFixed(1);
            return (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: CSS.surface1,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderLeft: `3px solid ${CSS.danger}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AlertTriangle size={20} style={{ color: CSS.danger, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: CSS.text, fontSize: 14 }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: CSS.danger, marginTop: 2 }}>
                      Over by {formatINR(overAmt)} ({overPct}%)
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 12, color: CSS.textSecondary, maxWidth: 240, textAlign: 'right', lineHeight: 1.4 }}>
                    {'Review spending and reallocate from surplus budgets.'}
                  </div>
                  <button
                    style={{
                      padding: '6px 12px',
                      border: `1px solid ${CSS.accent}`,
                      borderRadius: 6,
                      background: CSS.accent,
                      color: CSS.cardBg,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={(e) => { e.stopPropagation(); navigate('budgets'); }}
                  >
                    Reallocate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Budget Summary Table ── */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', color: CSS.text, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PiggyBank size={16} /> Budget Allocation Summary
        </h3>
        <SmartDataTable
          columns={[
            { key: 'name', label: 'Budget', sortable: true },
            { key: 'type', label: 'Type', render: (row) => (
              <span style={{ background: CSS.surface1, padding: '2px 8px', borderRadius: 6, fontSize: 11, color: CSS.accent, fontWeight: 500 }}>{(row.type as string)}</span>
            )},
            { key: 'allocated', label: 'Allocated', sortable: true, render: (row) => formatINR(row.allocated as number) },
            { key: 'spent', label: 'Spent', sortable: true, render: (row) => formatINR(row.allocated as number) },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={budgets as unknown as Record<string, unknown>[]}
        />
      </div>
    </PageShell>
  );
}
