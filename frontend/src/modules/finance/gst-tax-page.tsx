import { useState, useMemo } from 'react';
import { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { Landmark, AlertTriangle, Calendar, FileText, CheckCircle2, Clock, Receipt, ShieldCheck, BarChart3 } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { CSS } from '@/styles/design-tokens';
import { formatINR } from './utils';
import { gstSummaries, taxFilings } from './data/mock-data';
import { useFinanceStore } from './finance-store';

type FilingFilter = 'all' | 'filed' | 'pending' | 'overdue';

export default function GstTaxPage() {
  const [activeFilter, setActiveFilter] = useState<FilingFilter>('all');
  const navigateTo = useFinanceStore((s) => s.navigateTo);

  const latestMonth = gstSummaries[gstSummaries.length - 1];

  const totalGstCollected = latestMonth.cgst + latestMonth.sgst + latestMonth.igst;
  const totalGstPayable = latestMonth.gstPayable;
  const totalTds = latestMonth.tds || 170000;
  const taxLiability = totalGstPayable + totalTds;

  const filteredFilings = useMemo(() => {
    if (activeFilter === 'all') return taxFilings;
    return taxFilings.filter((f) => f.status === activeFilter);
  }, [activeFilter]);

  const filterCounts = useMemo(() => ({
    all: taxFilings.length,
    filed: taxFilings.filter((f) => f.status === 'filed').length,
    pending: taxFilings.filter((f) => f.status === 'pending').length,
    overdue: taxFilings.filter((f) => f.status === 'overdue').length,
  }), []);

  const upcomingFilings = useMemo(
    () => taxFilings.filter((f) => f.status === 'pending' || f.status === 'overdue'),
    []
  );

  const filedOnTime = taxFilings.filter((f) => f.status === 'filed').length;
  const complianceScore = taxFilings.length;
  const compliancePct = Math.round((filedOnTime / complianceScore) * 100);

  /* Chart dimensions */
  const chartH = 180;
  const barW = 18;
  const groupGap = 8;
  const barGap = 3;
  const groupW = barW * 3 + barGap * 2;
  const monthGap = 24;
  const maxVal = Math.max(...gstSummaries.map((m) => Math.max(m.cgst, m.sgst, m.igst)));

  const filingColumns: DataTableColumnDef[] = [
    { key: 'period', label: 'Period', sortable: true },
    { key: 'type', label: 'Type', render: (row) => (
      <span style={{ background: CSS.surface1, padding: '2px 10px', borderRadius: 6, fontSize: 12, color: CSS.accent, fontWeight: 500 }}>{(row.type as string)}</span>
    )},
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'filedDate', label: 'Filed Date', render: (row) => (row.filedDate as string) ? (row.filedDate as string) : <span style={{ color: CSS.textSecondary }}>—</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status as string} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (row) => formatINR(row.amount as number) },
  ];

  const rowStyle = (row: typeof taxFilings[0]) =>
    row.status === 'overdue'
      ? { borderLeft: `3px solid ${CSS.danger}` }
      : {};

  return (
    <PageShell title="GST & Tax Management" subtitle="Track GST filings, tax liabilities, and compliance">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiWidget icon={Receipt} label="GST Collected" value={formatINR(totalGstCollected)} color="accent" />
        <KpiWidget icon={Landmark} label="GST Payable" value={formatINR(totalGstPayable)} color="warning" />
        <KpiWidget icon={FileText} label="TDS" value={formatINR(totalTds)} color="info" />
        <KpiWidget icon={AlertTriangle} label="Tax Liability" value={formatINR(taxLiability)} color="danger" />
      </div>

      {/* GST Trend Chart */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: CSS.text }}>
          <BarChart3 size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          GST Trend — CGST / SGST / IGST
        </h3>
        <svg
          width={gstSummaries.length * (groupW + monthGap) + 40}
          height={chartH + 40}
          viewBox={`0 0 ${gstSummaries.length * (groupW + monthGap) + 40} ${chartH + 40}`}
        >
          {gstSummaries.map((m, i) => {
            const x = i * (groupW + monthGap) + 20;
            const cH = (m.cgst / maxVal) * chartH;
            const sH = (m.sgst / maxVal) * chartH;
            const iH = (m.igst / maxVal) * chartH;
            return (
              <g key={m.period}>
                <rect x={x} y={chartH - cH + 10} width={barW} height={cH} rx={3} fill={CSS.accent} opacity={0.85} />
                <rect x={x + barW + barGap} y={chartH - sH + 10} width={barW} height={sH} rx={3} fill={CSS.info} opacity={0.85} />
                <rect x={x + (barW + barGap) * 2} y={chartH - iH + 10} width={barW} height={iH} rx={3} fill={CSS.success} opacity={0.85} />
                <text x={x + groupW / 2} y={chartH + 28} textAnchor="middle" fontSize={11} fill={CSS.textSecondary}>
                  {m.period}
                </text>
              </g>
            );
          })}
          <line x1={10} y1={chartH + 10} x2={gstSummaries.length * (groupW + monthGap) + 30} y2={chartH + 10} stroke={CSS.border} strokeWidth={1} />
        </svg>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: CSS.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CSS.accent, display: 'inline-block' }} /> CGST
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: CSS.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CSS.info, display: 'inline-block' }} /> SGST
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: CSS.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CSS.success, display: 'inline-block' }} /> IGST
          </span>
        </div>
      </div>

      {/* Filing Calendar */}
      <div style={{ marginBottom: 24 }}>
        <FilterBar
          filters={[
            { key: 'all', label: 'All', count: filterCounts.all },
            { key: 'filed', label: 'Filed', count: filterCounts.filed },
            { key: 'pending', label: 'Pending', count: filterCounts.pending },
            { key: 'overdue', label: 'Overdue', count: filterCounts.overdue },
          ]}
          activeFilter={activeFilter}
          onFilterChange={(k) => setActiveFilter(k as FilingFilter)}
        />
        <div style={{ marginTop: 16 }}>
          <SmartDataTable
            columns={filingColumns}
            data={filteredFilings as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>

      {/* Filing Reminders */}
      {upcomingFilings.length > 0 && (
        <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} /> Filing Reminders
          </h3>
          {upcomingFilings.map((f) => {
            const isOverdue = f.status === 'overdue';
            return (
              <div
                key={f.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: CSS.surface1,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderLeft: `3px solid ${isOverdue ? CSS.danger : CSS.warning}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isOverdue ? (
                    <AlertTriangle size={18} style={{ color: CSS.danger }} />
                  ) : (
                    <Calendar size={18} style={{ color: CSS.warning }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: CSS.text, fontSize: 14 }}>
                      {f.type} for {f.period}
                    </div>
                    <div style={{ fontSize: 12, color: isOverdue ? CSS.danger : CSS.warning, marginTop: 2 }}>
                      {isOverdue
                        ? `OVERDUE — was due ${f.dueDate}. File immediately!`
                        : `Due ${f.dueDate} — pending filing`}
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    padding: '6px 14px',
                    border: `1px solid ${isOverdue ? CSS.danger : CSS.accent}`,
                    borderRadius: 6,
                    background: isOverdue ? CSS.danger : CSS.accent,
                    color: CSS.cardBg,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigateTo('dashboard')}
                >
                  {isOverdue ? 'File Now' : 'Prepare'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tax Calculation Summary */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={16} /> Tax Calculation Summary — {latestMonth.period}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'GST Collected', value: totalGstCollected, color: CSS.accent },
            { label: 'Input Tax Credit', value: latestMonth.gstReceivable || 234000, color: CSS.info },
            { label: 'Net GST Payable', value: totalGstPayable, color: CSS.warning },
            { label: 'TDS Deducted', value: totalTds, color: CSS.info },
            { label: 'Total Tax Liability', value: taxLiability, color: CSS.danger },
          ].map((item) => (
            <div key={item.label} style={{ background: CSS.surface1, borderRadius: 8, padding: 14, borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 11, color: CSS.textSecondary, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{formatINR(item.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Score */}
      <div style={{ background: CSS.cardBg, borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: CSS.text, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={16} /> Compliance Score
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: compliancePct >= 80 ? CSS.success : CSS.warning }}>
            {filedOnTime}/{complianceScore}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: CSS.textSecondary }}>Filings on time</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: compliancePct >= 80 ? CSS.success : CSS.warning }}>
                {compliancePct}%
              </span>
            </div>
            <div style={{ background: CSS.surface1, borderRadius: 8, height: 14, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${compliancePct}%`,
                  height: '100%',
                  borderRadius: 8,
                  background: compliancePct >= 80 ? CSS.success : compliancePct >= 60 ? CSS.warning : CSS.danger,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: CSS.textSecondary }}>
              {compliancePct >= 80 ? (
                <span style={{ color: CSS.success }}><CheckCircle2 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Good standing — all critical filings current</span>
              ) : (
                <span style={{ color: CSS.warning }}><AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />Action needed — some filings are overdue</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
