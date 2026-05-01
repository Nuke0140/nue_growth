import { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { useFinanceStore } from './finance-store';
import { formatINR } from './utils';
import { pnlData } from './data/mock-data';
import '@/styles/design-tokens';

/* ── KPI definitions ── */
const KPIS = [
  { label: 'Revenue',      value: '₹52L',    icon: DollarSign,   color: 'success' as const },
  { label: 'COGS',         value: '₹6.97L',  icon: TrendingDown, color: 'warning' as const },
  { label: 'Gross Margin', value: '₹45L',    icon: TrendingUp,   color: 'success' as const },
  { label: 'OpEx',         value: '₹27.5L',  icon: TrendingDown, color: 'warning' as const },
  { label: 'Net Profit',   value: '₹16.7L',  icon: ArrowUpRight, color: 'success' as const },
  { label: 'Net Margin',   value: '32.1%',   icon: BarChart3,    color: 'success' as const },
];

/* ── Helpers ── */
function varianceIndicator(v: number) {
  if (v > 0) return <ArrowUpRight style={{ width: 14, height: 14 }} className="var-positive" />;
  if (v < 0) return <ArrowDownRight style={{ width: 14, height: 14 }} className="var-negative" />;
  return <Minus style={{ width: 14, height: 14 }} className="var-neutral" />;
}

function formatVariance(v: number) {
  const prefix = v > 0 ? '+' : '';
  return `${prefix}${formatINR(v)}`;
}

/* ── Margin Breakdown segments ── */
interface WaterfallSegment {
  label: string;
  value: number;
  color: string;
}

function buildWaterfall(data: typeof pnlData): WaterfallSegment[] {
  const revenue    = data.find((r) => r.category === 'revenue')?.currentMonth ?? 0;
  const cogs       = data.find((r) => r.category === 'cogs')?.currentMonth ?? 0;
  const opex       = data.find((r) => r.category === 'opex')?.currentMonth ?? 0;
  const depreciation = data.find((r) => r.category === 'depreciation')?.currentMonth ?? 0;
  const gross      = revenue - cogs;
  const ebitda     = gross - opex;
  const netProfit  = ebitda - depreciation;

  return [
    { label: 'Revenue',      value: revenue,     color: 'var(--color-success)' },
    { label: 'COGS',         value: -cogs,       color: 'var(--color-danger)' },
    { label: 'Gross Margin', value: gross,        color: 'var(--color-info)' },
    { label: 'OpEx',         value: -opex,        color: 'var(--color-warning)' },
    { label: 'EBITDA',       value: ebitda,       color: 'var(--color-accent)' },
    { label: 'D&A',          value: -depreciation, color: 'var(--color-danger)' },
    { label: 'Net Profit',   value: netProfit,    color: 'var(--color-success)' },
  ];
}

/* ── Trend comparison keys ── */
const TREND_KEYS = ['revenue', 'cogs', 'grossMargin', 'opex', 'netProfit'] as const;

export default function PnlPage() {
  const navigate = useFinanceStore((s) => s.navigateTo);

  /* ── P&L rows ── */
  const rows = useMemo(() => pnlData, []);

  /* ── Waterfall data ── */
  const waterfall = useMemo(() => buildWaterfall(rows), [rows]);
  const absMax = useMemo(
    () => Math.max(...waterfall.map((s) => Math.abs(s.value)), 1),
    [waterfall],
  );

  /* ── Trend comparison ── */
  const trendItems = useMemo(() => {
    return TREND_KEYS.map((key) => {
      const row = rows.find((r) => r.category === key);
      if (!row) return null;
      const cur = row.currentMonth;
      const prev = row.previousMonth;
      return { key, label: row.category, current: cur, previous: prev };
    }).filter(Boolean) as { key: string; label: string; current: number; previous: number }[];
  }, [rows]);

  const trendMax = useMemo(
    () => Math.max(...trendItems.map((t) => Math.max(t.current, t.previous)), 1),
    [trendItems],
  );

  return (
    <PageShell title="P&L Statement" subtitle="Profit & Loss analysis with margin breakdown">
      {/* ── KPI Row ── */}
      <div className="kpi-row">
        {KPIS.map((k) => (
          <KpiWidget key={k.label} label={k.label} value={k.value} icon={k.icon} color={k.color} />
        ))}
      </div>

      {/* ── P&L Table ── */}
      <section className="card-section">
        <h3 className="section-title">
          <BarChart3 style={{ width: 18, height: 18 }} /> Statement
        </h3>
        <div className="pnl-table-wrap">
          <table className="pnl-table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="num">Current Month</th>
                <th className="num">Previous Month</th>
                <th className="num">YTD</th>
                <th className="num">Variance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const indent = row.indent ?? 0;
                const variance = row.currentMonth - row.previousMonth;
                return (
                  <tr
                    key={row.category}
                    className={[
                      row.isBold ? 'row-bold' : '',
                      row.isSummary ? 'row-summary' : '',
                    ].join(' ')}
                  >
                    <td style={{ paddingLeft: `calc(var(--space-3) + ${indent * 20}px)` }}>
                      {row.category}
                    </td>
                    <td className="num">{formatINR(row.currentMonth)}</td>
                    <td className="num">{formatINR(row.previousMonth)}</td>
                    <td className="num">{formatINR(row.ytd)}</td>
                    <td className="num variance">
                      {varianceIndicator(variance)}
                      <span className={variance >= 0 ? 'var-positive' : 'var-negative'}>
                        {formatVariance(variance)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Margin Breakdown (Waterfall) ── */}
      <section className="card-section">
        <h3 className="section-title">
          <TrendingUp style={{ width: 18, height: 18 }} /> Margin Breakdown
        </h3>
        <div className="waterfall-chart">
          {waterfall.map((seg) => {
            const isSubtraction = seg.value < 0;
            const widthPct = (Math.abs(seg.value) / absMax) * 100;
            return (
              <div key={seg.label} className="wf-row">
                <span className="wf-label">{seg.label}</span>
                <div className="wf-bar-track">
                  {isSubtraction ? (
                    <div
                      className="wf-bar subtraction"
                      style={{ width: `${widthPct}%`, background: seg.color }}
                    />
                  ) : (
                    <div
                      className="wf-bar addition"
                      style={{ width: `${widthPct}%`, background: seg.color }}
                    />
                  )}
                </div>
                <span className={`wf-value ${isSubtraction ? 'var-negative' : 'var-positive'}`}>
                  {isSubtraction ? '' : '+'}{formatINR(seg.value)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trend Comparison ── */}
      <section className="card-section">
        <h3 className="section-title">
          <BarChart3 style={{ width: 18, height: 18 }} /> Trend Comparison
        </h3>
        <div className="trend-chart">
          {trendItems.map((item) => {
            const curPct = (item.current / trendMax) * 100;
            const prevPct = (item.previous / trendMax) * 100;
            const diff = item.current - item.previous;
            return (
              <div key={item.key} className="trend-row">
                <span className="trend-label">{item.label}</span>
                <div className="trend-bars">
                  <div className="trend-bar-group">
                    <span className="bar-tag current">Current</span>
                    <div className="bar-track">
                      <div className="bar-fill current" style={{ width: `${curPct}%` }} />
                    </div>
                    <span className="bar-val">{formatINR(item.current)}</span>
                  </div>
                  <div className="trend-bar-group">
                    <span className="bar-tag previous">Previous</span>
                    <div className="bar-track">
                      <div className="bar-fill previous" style={{ width: `${prevPct}%` }} />
                    </div>
                    <span className="bar-val">{formatINR(item.previous)}</span>
                  </div>
                </div>
                <span className={`trend-delta ${diff >= 0 ? 'var-positive' : 'var-negative'}`}>
                  {diff >= 0 ? <ArrowUpRight style={{ width: 14, height: 14 }} /> : <ArrowDownRight style={{ width: 14, height: 14 }} />}
                  {formatVariance(diff)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Scoped styles ── */}
      <style>{`
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
        /* ── P&L Table ── */
        .pnl-table-wrap { overflow-x: auto; }
        .pnl-table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
        .pnl-table th { text-align: left; padding: var(--space-2) var(--space-3); color: var(--text-secondary); border-bottom: 2px solid var(--border-primary); font-weight: var(--font-weight-medium); }
        .pnl-table th.num { text-align: right; }
        .pnl-table td { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--border-secondary); color: var(--text-primary); }
        .pnl-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
        .pnl-table .row-bold { font-weight: var(--font-weight-bold); background: var(--surface-accent-subtle); }
        .pnl-table .row-summary td { border-top: 2px solid var(--border-primary); }
        .variance { display: flex; align-items: center; gap: var(--space-1); justify-content: flex-end; }
        .var-positive { color: var(--color-success); }
        .var-negative { color: var(--color-danger); }
        .var-neutral  { color: var(--text-secondary); }
        /* ── Waterfall ── */
        .waterfall-chart { display: flex; flex-direction: column; gap: var(--space-2); }
        .wf-row { display: grid; grid-template-columns: 120px 1fr 120px; align-items: center; gap: var(--space-2); }
        .wf-label { font-size: var(--font-size-sm); color: var(--text-secondary); }
        .wf-bar-track { height: 24px; background: var(--surface-tertiary); border-radius: var(--radius-sm); overflow: hidden; }
        .wf-bar { height: 100%; border-radius: var(--radius-sm); transition: width 0.5s ease; }
        .wf-bar.addition { border-radius: var(--radius-sm); }
        .wf-bar.subtraction { border-radius: var(--radius-sm); opacity: 0.85; }
        .wf-value { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-align: right; font-variant-numeric: tabular-nums; }
        /* ── Trend Comparison ── */
        .trend-chart { display: flex; flex-direction: column; gap: var(--space-3); }
        .trend-row { display: grid; grid-template-columns: 120px 1fr 120px; align-items: center; gap: var(--space-2); }
        .trend-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }
        .trend-bars { display: flex; flex-direction: column; gap: var(--space-1); }
        .trend-bar-group { display: grid; grid-template-columns: 70px 1fr 80px; align-items: center; gap: var(--space-2); }
        .bar-tag { font-size: var(--font-size-xs); color: var(--text-secondary); }
        .bar-tag.current { color: var(--color-accent); }
        .bar-tag.previous { color: var(--text-tertiary); }
        .bar-track { height: 10px; background: var(--surface-tertiary); border-radius: var(--radius-full); overflow: hidden; }
        .bar-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.5s ease; }
        .bar-fill.current { background: var(--color-accent); }
        .bar-fill.previous { background: var(--text-tertiary); opacity: 0.5; }
        .bar-val { font-size: var(--font-size-xs); color: var(--text-secondary); text-align: right; font-variant-numeric: tabular-nums; }
        .trend-delta { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); display: flex; align-items: center; justify-content: flex-end; gap: 2px; font-variant-numeric: tabular-nums; }
      `}</style>
    </PageShell>
  );
}
