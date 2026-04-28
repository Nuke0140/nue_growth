'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Wallet, Clock, CheckCircle2, Download, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DataTable, type Column } from './components/ops/data-table';
import { StatusBadge } from './components/ops/status-badge';
import { KpiWidget } from './components/ops/kpi-widget';
import { mockPayroll } from './data/mock-data';
import type { PayrollRecord } from './types';

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

const avatarColors = [
  'rgba(204, 92, 55, 0.12)',
  'rgba(52, 211, 153, 0.12)',
  'rgba(96, 165, 250, 0.12)',
  'rgba(251, 191, 36, 0.12)',
  'rgba(248, 113, 113, 0.12)',
  'rgba(168, 85, 247, 0.12)',
];

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  const monthData = useMemo(() => mockPayroll.filter(p => p.month === selectedMonth), [selectedMonth]);

  const stats = useMemo(() => ({
    totalPayout: monthData.reduce((s, p) => s + p.netPay, 0),
    pending: monthData.filter(p => p.status === 'pending').length,
    processed: monthData.filter(p => p.status === 'processed' || p.status === 'paid').length,
  }), [monthData]);

  const currentIdx = MONTHS.indexOf(selectedMonth);
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < MONTHS.length - 1;

  const columns: Column<PayrollRecord & Record<string, unknown>>[] = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-[10px] font-semibold"
              style={{ backgroundColor: avatarColors[Math.abs(hashCode(row.employeeName as string)) % avatarColors.length], color: 'var(--ops-accent)' }}
            >
              {getInitials(row.employeeName as string)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--ops-text)' }}>{row.employeeName}</p>
            <p className="text-[11px]" style={{ color: 'var(--ops-text-muted)' }}>{row.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>{formatINR(row.baseSalary as number)}</span>,
    },
    {
      key: 'incentives',
      label: 'Incentives',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--ops-success)' }}>+{formatINR(row.incentives as number)}</span>,
    },
    {
      key: 'deductions',
      label: 'Deductions',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: 'var(--ops-danger)' }}>-{formatINR(row.deductions as number)}</span>,
    },
    {
      key: 'netPay',
      label: 'Net Pay',
      sortable: true,
      render: (row) => <span className="text-sm font-bold" style={{ color: 'var(--ops-text)' }}>{formatINR(row.netPay as number)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status as string} />,
    },
    {
      key: 'actions',
      label: '',
      render: () => (
        <button className="ops-btn-ghost text-[11px] gap-1 px-2 py-1" onClick={(e) => e.stopPropagation()}>
          <Download className="w-3 h-3" /> Payslip
        </button>
      ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div className="p-6 space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: 'var(--ops-text)' }}>Payroll</h1>
            <Badge variant="secondary" className="ops-badge">{getMonthLabel(selectedMonth)}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => canPrev && setSelectedMonth(MONTHS[currentIdx - 1])}
                disabled={!canPrev}
                className="ops-btn-ghost p-1.5 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium px-3 min-w-[120px] text-center" style={{ color: 'var(--ops-text)' }}>
                {getMonthLabel(selectedMonth)}
              </span>
              <button
                onClick={() => canNext && setSelectedMonth(MONTHS[currentIdx + 1])}
                disabled={!canNext}
                className="ops-btn-ghost p-1.5 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="ops-btn-primary">
              <FileText className="w-4 h-4" /> Process Payroll
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget label="Total Payout" value={formatINR(stats.totalPayout)} icon={Wallet} color="accent" />
          <KpiWidget label="Pending Salaries" value={stats.pending} icon={Clock} color="warning" />
          <KpiWidget label="Processed" value={stats.processed} icon={CheckCircle2} color="success" />
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <DataTable
            columns={columns}
            data={monthData as (PayrollRecord & Record<string, unknown>)[]}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeName', 'department']}
            emptyMessage="No payroll records for this month."
          />
        </motion.div>
      </motion.div>
    </div>
  );
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
