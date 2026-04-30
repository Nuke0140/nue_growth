'use client';

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

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const majorRows = ['Total Revenue', 'Gross Margin', 'Total OpEx', 'EBITDA', 'Net Profit', 'Net Margin %'];

export default function PnLPage() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const months = ['Apr 2026', 'Mar 2026', 'Feb 2026', 'Jan 2026'];

<<<<<<< HEAD
  const isCategoryBold = (cat: string) => majorRows.includes(cat);
=======
  const getRowStyle = (category: string) => {
    if (category === 'Gross Margin' || category === 'EBITDA' || category === 'Net Profit' || category === 'Net Margin %') {
      return isDark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]';
    }
    if (highlightedRows.includes(category)) {
      return 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]';
    }
    return '';
  };

  const isCategoryBold = (cat: string) => highlightedRows.includes(cat);
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
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
<<<<<<< HEAD
      { label: 'Total Revenue', value: formatINR(rev?.currentMonth ?? 0), change: rev?.variancePercent ?? 0, icon: TrendingUp, color: 'success' },
      { label: 'EBITDA', value: formatINR(ebitda?.currentMonth ?? 0), change: ebitda?.variancePercent ?? 0, icon: FileText, color: 'info' },
      { label: 'Net Profit', value: formatINR(net?.currentMonth ?? 0), change: net?.variancePercent ?? 0, icon: TrendingUp, color: 'success' },
      { label: 'Net Margin', value: `${margin?.currentMonth ?? 0}%`, change: margin?.variancePercent ?? 0, icon: TrendingUp, color: 'accent' },
      { label: 'Total COGS', value: formatINR(cogs?.currentMonth ?? 0), change: cogs?.variancePercent ?? 0, icon: FileText, color: 'warning' },
=======
      { label: 'Total Revenue', value: formatINR(rev?.currentMonth ?? 0), change: rev?.variancePercent ?? 0, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
      { label: 'EBITDA', value: formatINR(ebitda?.currentMonth ?? 0), change: ebitda?.variancePercent ?? 0, icon: FileText, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
      { label: 'Net Profit', value: formatINR(net?.currentMonth ?? 0), change: net?.variancePercent ?? 0, icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
      { label: 'Net Margin', value: `${margin?.currentMonth ?? 0}%`, change: margin?.variancePercent ?? 0, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
      { label: 'Total COGS', value: formatINR(cogs?.currentMonth ?? 0), change: cogs?.variancePercent ?? 0, icon: ArrowDownRight, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
    ];
  }, []);

  const tableData = useMemo(() =>
    pnlData.map((entry, i) => {
      const bold = isCategoryBold(entry.category);
      const accent = isCategoryAccent(entry.category);
      const positive = isVariancePositive(entry);
      const isPercent = entry.category === 'Net Margin %';
      const isMajor = entry.category === 'Gross Margin' || entry.category === 'EBITDA' || entry.category === 'Net Profit' || entry === 'Net Margin %';
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
<<<<<<< HEAD
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
=======
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <FileText className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Profit & Loss Statement</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Executive P&L</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn('px-3 py-1.5 text-xs font-medium gap-1.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              <Calendar className="w-4 h-4" /> {today}
            </Badge>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))} disabled={selectedMonth === 0} className={cn('w-8 h-8', 'hover:bg-[var(--app-hover-bg)]')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className={cn('px-3 py-1 text-xs font-medium', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                {months[selectedMonth]}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMonth(Math.min(months.length - 1, selectedMonth + 1))} disabled={selectedMonth === months.length - 1} className={cn('w-8 h-8', 'hover:bg-[var(--app-hover-bg)]')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => {
            const isPositive = kpi.label === 'Total COGS' ? kpi.change <= 0 : kpi.change >= 0;
            return (
<<<<<<< HEAD
              <KpiWidget
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
                trend={isPositive ? 'up' : 'down'}
                trendValue={`${Math.abs(kpi.change)}%`}
              />
=======
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', kpi.bg)}><kpi.icon className={cn('w-4 h-4', kpi.color)} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
                  <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>vs previous month</p>
              </motion.div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            );
          })}
        </div>

        {/* P&L Table */}
<<<<<<< HEAD
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
=======
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>P&L Statement — {months[selectedMonth]}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Category', 'Current Month', 'Previous Month', 'YTD', 'Variance (₹)', 'Variance (%)'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', h === 'Category' ? 'min-w-[180px]' : 'min-w-[110px]', 'text-[var(--app-text-muted)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pnlData.map((entry, i) => {
                  const rowStyle = getRowStyle(entry.category);
                  const bold = isCategoryBold(entry.category);
                  const accent = isCategoryAccent(entry.category);
                  const positive = isVariancePositive(entry);
                  const isPercent = entry.category === 'Net Margin %';
                  return (
                    <motion.tr
                      key={entry.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.03 }}
                      className={cn(
                        'border-b transition-colors',
                        rowStyle || ('border-[var(--app-border-light)]'),
                        'hover:bg-[var(--app-hover-bg)]'
                      )}
                    >
                      <td className={cn('py-3 px-3', bold ? 'font-bold text-sm' : 'text-xs font-medium')}>
                        <span className={accent ? ('text-[var(--app-success)]') : ''}>{entry.category}</span>
                      </td>
                      <td className={cn('py-3 px-3', bold ? 'font-bold text-sm' : 'text-xs')}>{isPercent ? `${entry.currentMonth}%` : formatINR(entry.currentMonth)}</td>
                      <td className={cn('py-3 px-3', bold ? 'text-sm' : 'text-xs', 'text-[var(--app-text-secondary)]')}>{isPercent ? `${entry.previousMonth}%` : formatINR(entry.previousMonth)}</td>
                      <td className={cn('py-3 px-3', bold ? 'text-sm' : 'text-xs', 'text-[var(--app-text-secondary)]')}>{isPercent ? `${entry.ytd}%` : formatINR(entry.ytd)}</td>
                      <td className={cn('py-3 px-3 text-xs font-medium', positive ? 'text-emerald-500' : 'text-red-500')}>
                        <div className="flex items-center gap-1">
                          {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {isPercent ? `${entry.variance}pp` : formatINR(Math.abs(entry.variance))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn(
                          'text-[10px] px-2 py-0.5 font-medium',
                          positive ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]') : ('bg-[var(--app-danger-bg)] text-[var(--app-danger)]')
                        )}>
                          {positive ? '+' : ''}{entry.variancePercent}%
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Waterfall Visual */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Revenue to Net Profit Waterfall</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {[
              { label: 'Revenue', value: 5200000, color: 'bg-emerald-500' },
              { label: 'COGS', value: 697000, color: 'bg-rose-400' },
              { label: 'Gross', value: 4503000, color: 'bg-emerald-400' },
              { label: 'OpEx', value: 2750000, color: 'bg-rose-400' },
              { label: 'EBITDA', value: 1753000, color: 'bg-emerald-500' },
              { label: 'D&A', value: 85000, color: 'bg-rose-400' },
              { label: 'Net', value: 1668000, color: 'bg-emerald-500' },
            ].map((item, i) => {
              const maxVal = 5200000;
              const h = (item.value / maxVal) * 100;
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{formatINR(item.value)}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.65 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={cn('w-full rounded-t-sm', item.color)} />
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
      </div>
    </PageShell>
  );
}
