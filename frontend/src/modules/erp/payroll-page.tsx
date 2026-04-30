'use client';

import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, Wallet, Clock, CheckCircle2,
  Download, FileText, Printer, TrendingUp, X, Check, Banknote,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from './components/ops/status-badge';
import { KpiWidget } from './components/ops/kpi-widget';
import { mockPayroll } from './data/mock-data';
import type { PayrollRecord } from './types';
import { PageShell } from './components/ops/page-shell';
import { CSS } from '@/styles/design-tokens';

const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04'];

function formatINR(num: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

function getMonthLabel(month: string): string {
  const [, m] = month.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[parseInt(m) - 1]} 2026`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

const avatarColors = [
  'rgba(204, 92, 55, 0.12)',
  'var(--app-success-bg)',
  'var(--app-info-bg)',
  'var(--app-warning-bg)',
  'var(--app-danger-bg)',
  'rgba(168, 85, 247, 0.12)',
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: '#cc5c37',
  Design: '#a855f7',
  QA: '#60a5fa',
  Operations: '#fbbf24',
  HR: '#34d399',
  Finance: '#f87171',
  Sales: '#fb923c',
};

// ── Payslip Modal ──────────────────────────────────────

interface PayslipModalProps {
  record: PayrollRecord | null;
  open: boolean;
  onClose: () => void;
}

function PayslipModal({ record, open, onClose }: PayslipModalProps) {
  if (!record) return null;

  const totalEarnings = record.baseSalary + record.incentives;
  const tax = Math.round(record.deductions * 0.65);
  const pf = Math.round(record.deductions * 0.35);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--app-overlay)] backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onClick={onClose}
          >
            <div
              className="w-full max-w-md rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-2xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                border: '1px solid var(--app-border)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--app-border)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-10  rounded-[var(--app-radius-lg)]" style={{ backgroundColor: 'var(--app-accent-light)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>Payslip</h2>
                    <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                      {getMonthLabel(record.month)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] transition-colors"
                  style={{ color: 'var(--app-text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-hover-bg)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-app-xl space-y-app-xl">
                {/* Employee info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10  w-11">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{ backgroundColor: avatarColors[Math.abs(hashCode(record.employeeName)) % avatarColors.length], color: 'var(--app-accent)' }}
                    >
                      {getInitials(record.employeeName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{record.employeeName}</p>
                    <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>
                      {record.employeeId} &middot; {record.department}
                    </p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="rounded-[var(--app-radius-lg)] p-4 space-y-2.5" style={{ backgroundColor: 'var(--app-hover-bg)', border: '1px solid var(--app-border)' }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>Earnings</p>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--app-text-secondary)' }}>Base Salary</span>
                    <span style={{ color: 'var(--app-text)' }}>{formatINR(record.baseSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--app-text-secondary)' }}>Incentives</span>
                    <span style={{ color: '#34d399' }}>+{formatINR(record.incentives)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2" style={{ borderTop: '1px dashed var(--app-border-strong)' }}>
                    <span style={{ color: 'var(--app-text)' }}>Total Earnings</span>
                    <span style={{ color: 'var(--app-text)' }}>{formatINR(totalEarnings)}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="rounded-[var(--app-radius-lg)] p-4 space-y-2.5" style={{ backgroundColor: 'var(--app-hover-bg)', border: '1px solid var(--app-border)' }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>Deductions</p>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--app-text-secondary)' }}>Tax (TDS)</span>
                    <span style={{ color: '#f87171' }}>-{formatINR(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--app-text-secondary)' }}>Provident Fund</span>
                    <span style={{ color: '#f87171' }}>-{formatINR(pf)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2" style={{ borderTop: '1px dashed var(--app-border-strong)' }}>
                    <span style={{ color: 'var(--app-text)' }}>Total Deductions</span>
                    <span style={{ color: '#f87171' }}>-{formatINR(record.deductions)}</span>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="rounded-[var(--app-radius-lg)] p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--app-accent-light)', border: '1px solid var(--app-selection-bg)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>Net Pay</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--app-accent)' }}>{formatINR(record.netPay)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2 px-6 py-4" style={{ borderTop: '1px solid var(--app-border)' }}>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--app-hover-bg)', color: 'var(--app-text-secondary)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-hover-bg)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-hover-bg)'; }}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-selection-bg)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(204,92,55,0.12)'; }}
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Custom Pie Tooltip ─────────────────────────────────

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}

function PieTooltipContent({ active, payload }: PieTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0];
  return (
    <div className="rounded-[var(--app-radius-lg)] px-3 py-2 text-xs shadow-[var(--app-shadow-md)]-lg" style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)' }}>
      <p className="font-semibold" style={{ color: 'var(--app-text)' }}>{d.name}</p>
      <p style={{ color: 'var(--app-text-secondary)' }}>{formatINR(d.value)}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────

function PayrollPageInner() {
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>(mockPayroll);
  const [payslipRecord, setPayslipRecord] = useState<PayrollRecord | null>(null);
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [bulkProcessed, setBulkProcessed] = useState(false);

  const monthData = useMemo(
    () => payrollData.filter(p => p.month === selectedMonth),
    [payrollData, selectedMonth]
  );

  const stats = useMemo(() => ({
    totalPayroll: monthData.reduce((s, p) => s + p.netPay, 0),
    avgSalary: monthData.length > 0 ? Math.round(monthData.reduce((s, p) => s + p.netPay, 0) / monthData.length) : 0,
    pending: monthData.filter(p => p.status === 'pending').length,
    processed: monthData.filter(p => p.status === 'processed' || p.status === 'paid').length,
  }), [monthData]);

  // Department distribution for PieChart
  const deptData = useMemo(() => {
    const map: Record<string, number> = {};
    monthData.forEach(p => { map[p.department] = (map[p.department] || 0) + p.netPay; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [monthData]);

  const currentIdx = MONTHS.indexOf(selectedMonth);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < MONTHS.length - 1;

  const handleProcessAll = () => {
    setPayrollData(prev =>
      prev.map(p => (p.month === selectedMonth && p.status === 'pending' ? { ...p, status: 'processed' as const } : p))
    );
    setBulkProcessed(true);
    setTimeout(() => setBulkProcessed(false), 2000);
  };

  const handleRowClick = (row: Record<string, unknown>) => {
    setPayslipRecord(row as unknown as PayrollRecord);
    setPayslipOpen(true);
  };

  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-[10px] font-semibold"
              style={{ backgroundColor: avatarColors[Math.abs(hashCode(row.employeeName as string)) % avatarColors.length], color: 'var(--app-accent)' }}
            >
              {getInitials(row.employeeName as string)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>{row.employeeName}</p>
            <p className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>{row.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>{formatINR(row.baseSalary as number)}</span>,
    },
    {
      key: 'incentives',
      label: 'Incentives',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: '#34d399' }}>+{formatINR(row.incentives as number)}</span>,
    },
    {
      key: 'deductions',
      label: 'Deductions',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: '#f87171' }}>-{formatINR(row.deductions as number)}</span>,
    },
    {
      key: 'netPay',
      label: 'Net Pay',
      sortable: true,
      render: (row) => <span className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>{formatINR(row.netPay as number)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status as string} />,
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <>
    <PageShell title="Payroll" icon={Banknote} subtitle={getMonthLabel(selectedMonth)} headerRight={
        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => canPrev && setSelectedMonth(MONTHS[currentIdx - 1])}
              disabled={!canPrev}
              className="app-btn-ghost p-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-3 min-w-[120px] text-center" style={{ color: 'var(--app-text)' }}>
              {getMonthLabel(selectedMonth)}
            </span>
            <button
              onClick={() => canNext && setSelectedMonth(MONTHS[currentIdx + 1])}
              disabled={!canNext}
              className="app-btn-ghost p-1.5 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            className="app-btn-primary"
            disabled={stats.pending === 0}
            onClick={handleProcessAll}
            style={{ opacity: stats.pending === 0 ? 0.4 : 1 }}
          >
            {bulkProcessed ? (
              <><Check className="w-4 h-4" /> All Processed!</>
            ) : (
              <><FileText className="w-4 h-4" /> Process All Pending</>
            )}
          </button>
        </div>
      }>
      <motion.div className="space-y-app-2xl" variants={stagger} initial="hidden" animate="show">

        {/* Bulk success toast */}
        <AnimatePresence>
          {bulkProcessed && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--app-radius-lg)] text-sm font-medium"
              style={{ backgroundColor: 'var(--app-success-bg)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}
            >
              <Check className="w-4 h-4" />
              All pending salaries for {getMonthLabel(selectedMonth)} have been processed successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI Dashboard — 4 cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Payroll" value={formatINR(stats.totalPayroll)} icon={Wallet} color="accent" />
          <KpiWidget label="Avg Salary" value={formatINR(stats.avgSalary)} icon={TrendingUp} color="info" />
          <KpiWidget label="Pending" value={stats.pending} icon={Clock} color="warning" />
          <KpiWidget label="Processed" value={stats.processed} icon={CheckCircle2} color="success" />
        </motion.div>

        {/* Chart + Table row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-app-2xl">
          {/* Salary Breakdown Chart */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <div className="app-card p-app-xl h-full">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--app-text)' }}>
                Salary by Department
              </h3>
              {deptData.length === 0 ? (
                <div className="flex items-center justify-center h-48" style={{ color: 'var(--app-text-muted)' }}>
                  <p className="text-xs">No data for this month</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={deptData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {deptData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={DEPT_COLORS[entry.name] || `hsl(${index * 55}, 60%, 55%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    {deptData.map((entry, idx) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DEPT_COLORS[entry.name] || `hsl(${idx * 55}, 60%, 55%)` }} />
                        <span className="text-[11px]" style={{ color: 'var(--app-text-muted)' }}>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Table */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <SmartDataTable
              data={monthData as unknown as Record<string, unknown>[]}
              columns={columns}
              onRowClick={handleRowClick}
              searchable
              searchPlaceholder="Search employees..."
              searchKeys={['employeeName', 'department']}
              emptyMessage="No payroll records for this month."
              enableExport
              pageSize={10}
            />
          </motion.div>
        </div>
      </motion.div>
    </PageShell>

    {/* Payslip Modal */}
    <PayslipModal
      record={payslipRecord}
      open={payslipOpen}
      onClose={() => { setPayslipOpen(false); setPayslipRecord(null); }}
    />
    </>
  );
}

export default memo(PayrollPageInner);
