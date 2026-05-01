import { useState, useMemo } from 'react';
import {
  CreditCard,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  BarChart3,
  Receipt,
  FileText,
  TrendingUp,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
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
  expenseCategories,
  expenses,
  aiInsights,
  marketingIntegration,
} from './data/mock-data';
import { CSS } from '@/styles/design-tokens';

/* ── Category → badge colour mapping ── */
const CATEGORY_COLOR: Record<string, string> = {
  ads: 'warning',
  payroll: 'info',
  software: 'accent',
  office: 'accent',
  freelancers: 'info',
  travel: 'success',
  other: 'accent',
};

/* ── KPI definitions ── */
const KPIS = [
  { label: 'Total Expenses', value: '₹27.5L', icon: CreditCard, color: 'warning' as const },
  { label: 'Anomalies', value: '2 flagged', icon: AlertTriangle, color: 'danger' as const },
  { label: 'Budget Utilization', value: '68%', icon: BarChart3, color: 'info' as const },
  { label: 'Marketing ROI', value: '3.2x', icon: Sparkles, color: 'success' as const },
];

/* ── Filter options derived from categories ── */
function buildFilters() {
  const counts: Record<string, number> = { All: expenses.length };
  expenses.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return [
    { key: 'all', label: 'All', count: counts.All },
    { key: 'ads', label: 'Ads', count: counts.ads ?? 0 },
    { key: 'software', label: 'Software', count: counts.software ?? 0 },
    { key: 'freelancers', label: 'Freelancers', count: counts.freelancers ?? 0 },
    { key: 'office', label: 'Office', count: counts.office ?? 0 },
    { key: 'travel', label: 'Travel', count: counts.travel ?? 0 },
    { key: 'other', label: 'Other', count: counts.other ?? 0 },
  ];
}

export default function ExpensesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useFinanceStore((s) => s.navigateTo);

  /* ── Filtered transactions ── */
  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? expenses
        : expenses.filter((t) => t.category === activeFilter),
    [activeFilter],
  );

  /* ── AI insights for expenses ── */
  const expenseInsights = useMemo(
    () => aiInsights.filter((i) => i.type === 'overspend' || i.type === 'optimization'),
    [],
  );

  /* ── Table columns ── */
  const columns: DataTableColumnDef[] = useMemo(() => [
    { key: 'description', label: 'Description', sortable: true },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => <StatusBadge status={row.category as string} />,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => formatINR(row.amount as number),
    },
    {
      key: 'gstAmount',
      label: 'GST',
      sortable: true,
      render: (row) => formatINR(row.gstAmount as number),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (row) => formatINR(row.total as number),
    },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'vendor', label: 'Vendor', sortable: true },
    {
      key: 'receiptUploaded',
      label: 'Receipt',
      render: (row) =>
        row.receiptUploaded ? <FileText style={{ width: 16, height: 16 }} /> : '—',
    },
    {
      key: 'approvalStatus',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.approvalStatus as string} />,
    },
    {
      key: 'isAnomaly',
      label: 'Anomaly',
      render: (row) =>
        row.isAnomaly ? <StatusBadge status="Flagged" /> : null,
    },
  ], []);

  return (
    <PageShell title="Expense Intelligence" subtitle="Track, analyze, and optimize business spending">
      {/* ── KPI Row ── */}
      <div className="kpi-row">
        {KPIS.map((k) => (
          <KpiWidget key={k.label} label={k.label} value={k.value} icon={k.icon} color={k.color} />
        ))}
      </div>

      {/* ── Category Summary Cards ── */}
      <section className="card-section">
        <h3 className="section-title">
          <Receipt style={{ width: 18, height: 18 }} /> Category Summary
        </h3>
        <div className="category-cards">
          {expenseCategories.map((cat) => {
            const color = CATEGORY_COLOR[cat.category] ?? 'accent';
            return (
              <div key={cat.category} className={`category-card tone-${color}`}>
                <div className="cat-header">
                  <span className="cat-name">{cat.category}</span>
                  <span className="cat-trend">
                    {cat.trend === 'up' ? (
                      <ArrowUpRight style={{ width: 14, height: 14 }} />
                    ) : cat.trend === 'down' ? (
                      <ArrowDownRight style={{ width: 14, height: 14 }} />
                    ) : null}
                    {cat.percentage}%
                  </span>
                </div>
                <div className="cat-amount">{formatINR(cat.total)}</div>
                <div className="cat-bar-track">
                  <div
                    className={`cat-bar-fill tone-${color}`}
                    style={{ width: `${cat.budgetUtilization}%` }}
                  />
                </div>
                <div className="cat-meta">
                  <span>Budget: {cat.budgetUtilization}%</span>
                  <span>{cat.percentage}% of total</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AI Recommendations ── */}
      <section className="card-section">
        <h3 className="section-title">
          <Sparkles style={{ width: 18, height: 18 }} /> AI Recommendations
        </h3>
        <div className="insight-cards">
          {expenseInsights.map((ins) => (
            <div key={ins.id} className={`insight-card tone-${ins.type === 'overspend' ? 'danger' : 'info'}`}>
              <div className="insight-header">
                <AlertTriangle style={{ width: 16, height: 16 }} />
                <span className="insight-title">{ins.title}</span>
              </div>
              <p className="insight-body">{ins.recommendation}</p>
              <div className="insight-footer">
                <span className="potential-saving">
                  Potential saving: <strong>{formatINR(ins.potentialSaving)}</strong>
                </span>
                <button className="btn-action" onClick={() => navigate('expenses')}>
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <FilterBar
        filters={buildFilters()}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* ── Expense Table ── */}
      <section className="card-section">
        <SmartDataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
        />
      </section>

      {/* ── Marketing Spend Card ── */}
      <section className="card-section">
        <h3 className="section-title">
          <BarChart3 style={{ width: 18, height: 18 }} /> Marketing Spend
        </h3>
        <div className="marketing-card">
          <div className="mkt-stat">
            <span className="mkt-label">Total Spend</span>
            <span className="mkt-value">{formatINR(marketingIntegration.totalSpend)}</span>
          </div>
          <div className="mkt-stat">
            <span className="mkt-label">ROI</span>
            <span className="mkt-value tone-success">{marketingIntegration.roi}x</span>
          </div>
          <div className="mkt-stat">
            <span className="mkt-label">Cost per Lead</span>
            <span className="mkt-value">{formatINR(marketingIntegration.costPerLead)}</span>
          </div>
          <button
            className="btn-link"
            onClick={() => navigate('expenses')}
          >
            <ExternalLink style={{ width: 14, height: 14 }} /> Open Marketing Module
          </button>
        </div>
      </section>

      {/* ── Scoped styles ── */}
      <style>{`
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }
        .card-section {
          background: var(--surface-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          margin-bottom: var(--space-4);
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-3);
        }
        .category-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-3);
        }
        .category-card {
          background: var(--surface-secondary);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          border-left: 4px solid var(--color-accent);
        }
        .category-card.tone-warning { border-left-color: var(--color-warning); }
        .category-card.tone-info    { border-left-color: var(--color-info); }
        .category-card.tone-accent  { border-left-color: var(--color-accent); }
        .category-card.tone-success { border-left-color: var(--color-success); }
        .cat-header { display: flex; justify-content: space-between; align-items: center; }
        .cat-name { font-weight: var(--font-weight-medium); color: var(--text-primary); }
        .cat-trend { font-size: var(--font-size-sm); display: flex; align-items: center; gap: 2px; }
        .cat-amount { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: var(--space-1) 0; }
        .cat-bar-track { height: 6px; background: var(--surface-tertiary); border-radius: var(--radius-full); overflow: hidden; }
        .cat-bar-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.4s ease; }
        .cat-bar-fill.tone-warning { background: var(--color-warning); }
        .cat-bar-fill.tone-info    { background: var(--color-info); }
        .cat-bar-fill.tone-accent  { background: var(--color-accent); }
        .cat-bar-fill.tone-success { background: var(--color-success); }
        .cat-meta { display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: var(--space-1); }
        .insight-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-3); }
        .insight-card { background: var(--surface-secondary); border-radius: var(--radius-md); padding: var(--space-3); border-left: 4px solid var(--color-info); }
        .insight-card.tone-danger { border-left-color: var(--color-danger); }
        .insight-header { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); }
        .insight-title { font-weight: var(--font-weight-semibold); color: var(--text-primary); }
        .insight-body { font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-2); }
        .insight-footer { display: flex; justify-content: space-between; align-items: center; }
        .potential-saving { font-size: var(--font-size-sm); color: var(--text-secondary); }
        .btn-action { padding: var(--space-1) var(--space-3); border-radius: var(--radius-md); background: var(--color-accent); color: var(--text-on-accent); border: none; cursor: pointer; font-size: var(--font-size-sm); }
        .btn-action:hover { opacity: 0.9; }
        .marketing-card { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; }
        .mkt-stat { display: flex; flex-direction: column; }
        .mkt-label { font-size: var(--font-size-xs); color: var(--text-secondary); }
        .mkt-value { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--text-primary); }
        .mkt-value.tone-success { color: var(--color-success); }
        .btn-link { display: flex; align-items: center; gap: var(--space-1); background: none; border: none; color: var(--color-accent); cursor: pointer; font-size: var(--font-size-sm); margin-left: auto; }
        .btn-link:hover { text-decoration: underline; }
        :global(.row-anomaly) { border-left: 3px solid var(--color-danger) !important; background: var(--surface-danger-subtle) !important; }
      `}</style>
    </PageShell>
  );
}
