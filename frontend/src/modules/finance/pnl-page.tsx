'use client';

import { formatINR } from './utils';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Download } from 'lucide-react';
import { pnlData } from '@/modules/finance/data/mock-data';
import type { PnLEntry } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';


const majorRows = ['Total Revenue', 'Gross Margin', 'Total OpEx', 'EBITDA', 'Net Profit', 'Net Margin %'];

export default function PnLPage() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const months = ['Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026'];

  const isCategoryBold = (cat: string) => majorRows.includes(cat);
  const isCategoryAccent = (cat: string) => cat === 'Gross Margin' || cat === 'EBITDA' || cat === 'Net Profit' || cat === 'Net Margin %';
  const isVariancePositive = (entry: PnLEntry) => {
    if (entry.category.includes('COGS') || entry.category.includes('OpEx') || entry.category === 'Depreciation & Amort.') {
      return entry.variancePercent <= 0;
    }
    return entry.variancePercent >= 0;
  };

  const kpis = useMemo(() => {
    const rev = pnlData.find(d => d.category === 'Total Revenue');
    const ebitda = pnlData.find(d => d.category === 'EBITDA');
    const net = pnlData.find(d => d.category === 'Net Profit');
    const margin = pnlData.find(d => d.category === 'Net Margin %');
    const cogs = pnlData.find(d => d.category === 'Total COGS');
    return [
      { label: 'Total Revenue', value: formatINR(rev?.currentMonth ?? 0), change: rev?.variancePercent ?? 0, icon: TrendingUp, color: 'success' },
      { label: 'EBITDA', value: formatINR(ebitda?.currentMonth ?? 0), change: ebitda?.variancePercent ?? 0, icon: FileText, color: 'info' },
      { label: 'Net Profit', value: formatINR(net?.currentMonth ?? 0), change: net?.variancePercent ?? 0, icon: TrendingUp, color: 'success' },
      { label: 'Net Margin', value: `${margin?.currentMonth ?? 0}%`, change: margin?.variancePercent ?? 0, icon: TrendingUp, color: 'accent' },
      { label: 'Total COGS', value: formatINR(cogs?.currentMonth ?? 0), change: cogs?.variancePercent ?? 0, icon: FileText, color: 'warning' },
    ];
  }, []);

  const tableData = useMemo(() =>
    pnlData.map((entry, i) => {
      const bold = isCategoryBold(entry.category);
      const accent = isCategoryAccent(entry.category);
      const positive = isVariancePositive(entry);
      const isPercent = entry.category === 'Net Margin %';
      const isMajor = entry.category === 'Gross Margin' || entry.category === 'EBITDA' || entry.category === 'Net Profit' || entry.category === 'Net Margin %';
      return {
        id: entry.category,
        category: entry.category,
        currentMonth: isPercent ? `${entry.currentMonth}%` : formatINR(entry.currentMonth),
        previousMonth: isPercent ? `${entry.previousMonth}%` : formatINR(entry.previousMonth),
        ytd: isPercent ? `${entry.ytd}%` : formatINR(entry.ytd),
        varianceDisplay: isPercent ? `${entry.variance}pp` : formatINR(Math.abs(entry.variance)),
        variancePositive: positive,
        variancePercent: entry.variancePercent,
        bold,
        accent,
        isMajor,
      };
    }),
    [selectedMonth]
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => {
        const accent = row.accent as boolean;
        return (
          <span
            className={row.bold ? 'font-bold text-sm' : 'text-xs font-medium'}
            style={{ color: accent ? CSS.success : CSS.text }}
          >
            {row.category as string}
          </span>
        );
      },
    },
    {
      key: 'currentMonth',
      label: 'Current Month',
      render: (row) => (
        <span className={row.bold ? 'font-bold text-sm' : 'text-xs'} style={{ color: CSS.text }}>
          {row.currentMonth as string}
        </span>
      ),
    },
    {
      key: 'previousMonth',
      label: 'Previous Month',
      render: (row) => (
        <span className={row.bold ? 'text-sm' : 'text-xs'} style={{ color: CSS.textSecondary }}>
          {row.previousMonth as string}
        </span>
      ),
    },
    {
      key: 'ytd',
      label: 'YTD',
      render: (row) => (
        <span className={row.bold ? 'text-sm' : 'text-xs'} style={{ color: CSS.textSecondary }}>
          {row.ytd as string}
        </span>
      ),
    },
    {
      key: 'varianceDisplay',
      label: 'Variance (₹)',
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: row.variancePositive ? CSS.success : CSS.danger }}>
          {row.variancePositive ? '↑' : '↓'} {row.varianceDisplay as string}
        </span>
      ),
    },
    {
      key: 'variancePercent',
      label: 'Variance (%)',
      render: (row) => {
        const positive = row.variancePositive as boolean;
        return (
          <StatusBadge
            status={positive ? 'completed' : 'overdue'}
            variant="pill"
            className="text-[10px] px-2 py-0 font-medium"
          >
            {positive ? '+' : ''}{row.variancePercent as number}%
          </StatusBadge>
        );
      },
    },
  ], []);

  return (
    <PageShell
      title="Profit & Loss Statement"
      subtitle="Executive P&L"
      icon={() => <FileText className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <div className="flex items-center gap-3">
          <Button size="sm" className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
            {months[selectedMonth]}
          </Button>
          <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => {
            const isPositive = kpi.label === 'Total COGS' ? kpi.change <= 0 : kpi.change >= 0;
            return (
              <KpiWidget
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
                trend={isPositive ? 'up' : 'down'}
                trendValue={`${Math.abs(kpi.change)}%`}
              />
            );
          })}
        </div>

        {/* P&L Table */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <SmartDataTable
            columns={columns}
            data={tableData}
            searchable
            searchPlaceholder="Search P&L categories..."
            searchKeys={['category']}
            enableExport
            emptyMessage="No P&L data found"
            pageSize={20}
          />
        </div>
      </div>
    </PageShell>
  );
}
