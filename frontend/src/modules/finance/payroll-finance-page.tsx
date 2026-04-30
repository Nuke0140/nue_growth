'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Users, CheckCircle2, Briefcase, Shield, Wallet, DollarSign,
  TrendingUp, TrendingDown, BarChart3,
} from 'lucide-react';
import { payrollRecords } from '@/modules/finance/data/mock-data';
import type { PayrollRecord } from '@/modules/finance/types';
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

const deptColors: Record<string, string> = {
  Design: 'violet',
  Engineering: 'sky',
  Sales: 'emerald',
  Marketing: 'amber',
};

export default function PayrollFinancePage() {
  const totalSalary = useMemo(() => payrollRecords.reduce((s, p) => s + p.basicSalary, 0), []);
  const totalReimbursements = useMemo(() => payrollRecords.reduce((s, p) => s + p.reimbursements, 0), []);
  const totalIncentives = useMemo(() => payrollRecords.reduce((s, p) => s + p.incentives, 0), []);
  const totalDeductions = useMemo(() => payrollRecords.reduce((s, p) => s + p.deductions, 0), []);
  const totalTDS = useMemo(() => payrollRecords.reduce((s, p) => s + p.tds, 0), []);
  const totalGross = useMemo(() => payrollRecords.reduce((s, p) => s + p.grossPay, 0), []);
  const totalNet = useMemo(() => payrollRecords.reduce((s, p) => s + p.netPay, 0), []);
  const pendingApprovals = useMemo(() => payrollRecords.filter(p => p.status === 'pending' || p.status === 'approved').length, []);

  const departmentBreakdown = useMemo(() => {
    const map: Record<string, { totalNet: number; count: number }> = {};
    payrollRecords.forEach((p: PayrollRecord) => {
      if (!map[p.department]) map[p.department] = { totalNet: 0, count: 0 };
      map[p.department].totalNet += p.netPay;
      map[p.department].count += 1;
    });
    return Object.entries(map).map(([dept, data]) => ({ department: dept, ...data })).sort((a, b) => b.totalNet - a.totalNet);
  }, []);

  const maxDeptNet = useMemo(() => Math.max(...departmentBreakdown.map(d => d.totalNet)), []);
  const processedRecords = useMemo(() => payrollRecords.filter(p => p.status === 'processed'), []);
  const pendingRecords = useMemo(() => payrollRecords.filter(p => p.status !== 'processed'), []);

  const varianceData = [
    { label: 'Total Payroll', current: totalNet, previous: totalNet * 0.92, change: 8.3 },
    { label: 'Incentives', current: totalIncentives, previous: totalIncentives * 0.85, change: 17.6 },
    { label: 'Deductions', current: totalDeductions, previous: totalDeductions * 1.05, change: -4.8 },
    { label: 'TDS', current: totalTDS, previous: totalTDS * 0.95, change: 5.2 },
  ];

<<<<<<< HEAD
  const tableData = useMemo(() =>
    payrollRecords.map((rec: PayrollRecord) => ({
      id: rec.id,
      employee: rec.employee,
      designation: rec.designation,
      department: rec.department,
      basicSalary: formatINR(rec.basicSalary),
      hra: formatINR(rec.hra),
      allowances: formatINR(rec.allowances),
      reimbursements: formatINR(rec.reimbursements),
      incentives: formatINR(rec.incentives),
      deductions: formatINR(rec.deductions),
      tds: formatINR(rec.tds),
      pf: formatINR(rec.pf),
      esi: formatINR(rec.esi),
      grossPay: formatINR(rec.grossPay),
      netPay: formatINR(rec.netPay),
      status: rec.status,
    })),
    []
  );

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'employee',
      label: 'Employee',
      sortable: true,
      render: (row) => <span className="text-sm font-medium whitespace-nowrap" style={{ color: CSS.text }}>{row.employee as string}</span>,
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (row) => <span className="text-xs whitespace-nowrap" style={{ color: CSS.text }}>{row.designation as string}</span>,
    },
    {
      key: 'department',
      label: 'Dept',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.department as string} variant="pill" className="text-[9px] px-1.5 py-0" />
      ),
    },
    { key: 'basicSalary', label: 'Basic', type: 'currency' },
    { key: 'hra', label: 'HRA', type: 'currency' },
    { key: 'allowances', label: 'Allow.', type: 'currency' },
    { key: 'reimbursements', label: 'Reimb.', type: 'currency' },
    {
      key: 'incentives',
      label: 'Incent.',
      render: (row) => <span className="text-xs whitespace-nowrap" style={{ color: CSS.success }}>{row.incentives as string}</span>,
    },
    {
      key: 'deductions',
      label: 'Deduct.',
      render: (row) => <span className="text-xs whitespace-nowrap" style={{ color: CSS.danger }}>{row.deductions as string}</span>,
    },
    {
      key: 'tds',
      label: 'TDS',
      render: (row) => <span className="text-xs whitespace-nowrap" style={{ color: CSS.warning }}>{row.tds as string}</span>,
    },
    { key: 'pf', label: 'PF', type: 'currency' },
    { key: 'esi', label: 'ESI', type: 'currency' },
    { key: 'grossPay', label: 'Gross', render: (row) => <span className="text-xs font-medium whitespace-nowrap" style={{ color: CSS.text }}>{row.grossPay as string}</span> },
    { key: 'netPay', label: 'Net Pay', sortable: true, render: (row) => <span className="text-xs font-bold whitespace-nowrap" style={{ color: CSS.text }}>{row.netPay as string}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.status as string} variant="pill" className="text-[9px] px-1.5 py-0 capitalize" />
      ),
    },
  ], []);

  return (
    <PageShell
      title="Payroll Finance"
      subtitle="Payroll Finance Cockpit"
      icon={() => <Users className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-medium rounded-full" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
            Apr 2026
          </span>
          <Button className="px-4 py-2 text-sm font-medium rounded-xl gap-2" style={{ backgroundColor: CSS.accent, color: '#fff' }}>
            <CheckCircle2 className="w-4 h-4" /> Process Payroll
          </Button>
=======
  const kpiStats = [
    { label: 'Total Salary Due', value: formatINR(totalSalary), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Reimbursements', value: formatINR(totalReimbursements), icon: Wallet, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
    { label: 'Incentives', value: formatINR(totalIncentives), icon: TrendingUp, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
    { label: 'Deductions', value: formatINR(totalDeductions), icon: TrendingDown, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
    { label: 'TDS', value: formatINR(totalTDS), icon: Shield, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    { label: 'Total Processed', value: formatINR(totalNet), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Pending', value: `${pendingApprovals} entries`, icon: Clock, color: 'text-orange-400', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Users className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Payroll Finance</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Payroll Finance Cockpit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn('px-3 py-1.5 text-xs font-medium', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              Apr 2026
            </Badge>
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <CheckCircle2 className="w-4 h-4" /> Process Payroll
            </Button>
          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
<<<<<<< HEAD
          <KpiWidget label="Total Salary Due" value={formatINR(totalSalary)} icon={DollarSign} color="success" />
          <KpiWidget label="Reimbursements" value={formatINR(totalReimbursements)} icon={Wallet} color="info" />
          <KpiWidget label="Incentives" value={formatINR(totalIncentives)} icon={TrendingUp} color="accent" />
          <KpiWidget label="Deductions" value={formatINR(totalDeductions)} icon={TrendingDown} color="danger" />
          <KpiWidget label="TDS" value={formatINR(totalTDS)} icon={Shield} color="warning" />
          <KpiWidget label="Total Processed" value={formatINR(totalNet)} icon={CheckCircle2} color="success" />
          <KpiWidget label="Pending" value={`${pendingApprovals} entries`} icon={Briefcase} color="warning" />
=======
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </div>

        {/* Approval Queue */}
        {pendingRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
<<<<<<< HEAD
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-warning) 3%, transparent)', borderColor: 'color-mix(in srgb, var(--app-warning) 12%, transparent)' }}
=======
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', isDark ? 'bg-amber-500/[0.03] border-amber-500/[0.12]' : 'bg-amber-50/50 border-amber-200/60')}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>Pending Approval</span>
            </div>
            <div className="space-y-2">
<<<<<<< HEAD
              {pendingRecords.map((rec: PayrollRecord, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
                      <Briefcase className="w-4 h-4" style={{ color: CSS.textSecondary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>{rec.employee}</p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>{rec.designation} · {rec.department}</p>
=======
              {pendingRecords.map((rec: PayrollRecord, i) => {
                const sConf = statusConfig[rec.status];
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                    className={cn('flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border', isDark ? 'border-amber-500/10 bg-amber-500/[0.02]' : 'border-amber-200/40 bg-white/60')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                        <Briefcase className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rec.employee}</p>
                        <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{rec.designation} • {rec.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatINR(rec.netPay)}</span>
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? sConf.bgDark : sConf.bgLight)}>
                        {sConf.label}
                      </Badge>
                      <Button size="sm" className={cn('text-xs px-3 py-1.5 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                        Approve
                      </Button>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(rec.netPay)}</span>
                    <StatusBadge status={rec.status} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
                    <Button size="sm" className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: CSS.accent, color: '#fff' }}>Approve</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* MoM Variance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
<<<<<<< HEAD
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Month-over-Month Variance</span>
            </div>
=======
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Month-over-Month Variance</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              Mar → Apr 2026
            </Badge>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {varianceData.map((v, i) => {
              const isPositive = v.change > 0;
              return (
<<<<<<< HEAD
                <div key={v.label} className="p-4 rounded-xl border" style={{ borderColor: CSS.borderLight }}>
                  <p className="text-xs" style={{ color: CSS.textMuted }}>{v.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-lg font-bold" style={{ color: CSS.text }}>{formatINR(v.current)}</p>
                    <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: isPositive ? CSS.success : CSS.danger }}>
                      {isPositive ? '↑' : '↓'} {Math.abs(v.change)}%
                    </span>
                  </div>
                </div>
=======
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}
                  className={cn('p-4 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}
                >
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{v.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-lg font-bold">{formatINR(v.current)}</p>
                    <span className={cn('flex items-center gap-0.5 text-[10px] font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(v.change)}%
                    </span>
                  </div>
                  <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-disabled)]')}>vs {formatINR(v.previous)} last month</p>
                </motion.div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              );
            })}
          </div>
        </motion.div>

        {/* Department Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
<<<<<<< HEAD
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Department Payroll Breakdown</span>
=======
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Department Payroll Breakdown</span>
            </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
          </div>
          <div className="space-y-4">
            {departmentBreakdown.map((dept, i) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
<<<<<<< HEAD
                    <StatusBadge status={dept.department} variant="pill" className="text-[10px] px-2 py-0" />
                    <span className="text-[10px]" style={{ color: CSS.textMuted }}>{dept.count} employees</span>
=======
                    <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', deptColors[dept.department] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'))}>
                      {dept.department}
                    </Badge>
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{dept.count} employees</span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  </div>
                  <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(dept.totalNet)}</span>
                </div>
<<<<<<< HEAD
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
=======
                <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.totalNet / maxDeptNet) * 100}%` }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: deptColors[dept.department] ?? CSS.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

<<<<<<< HEAD
        {/* Payroll Ledger */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Payroll Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: CSS.textMuted }}>Total Net: </span>
              <span className="text-sm font-bold" style={{ color: CSS.text }}>{formatINR(totalNet)}</span>
            </div>
          </div>
          <SmartDataTable
            columns={columns}
            data={tableData}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employee', 'designation', 'department']}
            enableExport
            emptyMessage="No payroll records found"
            pageSize={10}
          />
        </div>
=======
        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Payroll Ledger</span>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                {payrollRecords.length} employees
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Total Net: </span>
              <span className="text-sm font-bold">{formatINR(totalNet)}</span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
            <table className="w-full">
              <thead className={cn('sticky top-0 z-10', isDark ? 'bg-[#1a1a1a]' : 'bg-white')}>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Employee', 'Designation', 'Dept', 'Basic', 'HRA', 'Allow.', 'Reimb.', 'Incent.', 'Deduct.', 'TDS', 'PF', 'ESI', 'Gross', 'Net Pay', 'Status'].map(h => (
                    <th key={h} className={cn('text-left text-[10px] font-medium uppercase tracking-wider pb-3 px-2 whitespace-nowrap', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payrollRecords.map((rec: PayrollRecord, i) => {
                  const sConf = statusConfig[rec.status];
                  return (
                    <motion.tr
                      key={rec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.65 + i * 0.04 }}
                      className={cn('border-b transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                    >
                      <td className="py-3 px-2 text-sm font-medium whitespace-nowrap">{rec.employee}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{rec.designation}</td>
                      <td className="py-3 px-2">
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', deptColors[rec.department] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'))}>
                          {rec.department}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.basicSalary)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.hra)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.allowances)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.reimbursements)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap text-emerald-500">{formatINR(rec.incentives)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap text-red-500">{formatINR(rec.deductions)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap text-amber-500">{formatINR(rec.tds)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.pf)}</td>
                      <td className="py-3 px-2 text-xs whitespace-nowrap">{formatINR(rec.esi)}</td>
                      <td className="py-3 px-2 text-xs font-medium whitespace-nowrap">{formatINR(rec.grossPay)}</td>
                      <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(rec.netPay)}</td>
                      <td className="py-3 px-2">
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                          {sConf.label}
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={cn('border-t-2', 'border-[var(--app-border-strong)]')}>
                  <td colSpan={3} className="py-3 px-2 text-xs font-bold">Total</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(totalSalary)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(payrollRecords.reduce((s, p) => s + p.hra, 0))}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(payrollRecords.reduce((s, p) => s + p.allowances, 0))}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(totalReimbursements)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap text-emerald-500">{formatINR(totalIncentives)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap text-red-500">{formatINR(totalDeductions)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap text-amber-500">{formatINR(totalTDS)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(payrollRecords.reduce((s, p) => s + p.pf, 0))}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(payrollRecords.reduce((s, p) => s + p.esi, 0))}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(totalGross)}</td>
                  <td className="py-3 px-2 text-xs font-bold whitespace-nowrap">{formatINR(totalNet)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
      </div>
    </PageShell>
  );
}
