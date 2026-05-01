'use client';

import { formatINR } from './utils';

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


const deptColors: Record<string, string> = {
  Design: CSS.structural,
  Engineering: CSS.info,
  Sales: CSS.success,
  Marketing: CSS.warning,
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
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <KpiWidget label="Total Salary Due" value={formatINR(totalSalary)} icon={DollarSign} color="success" />
          <KpiWidget label="Reimbursements" value={formatINR(totalReimbursements)} icon={Wallet} color="info" />
          <KpiWidget label="Incentives" value={formatINR(totalIncentives)} icon={TrendingUp} color="accent" />
          <KpiWidget label="Deductions" value={formatINR(totalDeductions)} icon={TrendingDown} color="danger" />
          <KpiWidget label="TDS" value={formatINR(totalTDS)} icon={Shield} color="warning" />
          <KpiWidget label="Total Processed" value={formatINR(totalNet)} icon={CheckCircle2} color="success" />
          <KpiWidget label="Pending" value={`${pendingApprovals} entries`} icon={Briefcase} color="warning" />
        </div>

        {/* Approval Queue */}
        {pendingRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--app-warning) 3%, transparent)', borderColor: 'color-mix(in srgb, var(--app-warning) 12%, transparent)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>Pending Approval</span>
            </div>
            <div className="space-y-2">
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.15 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Month-over-Month Variance</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {varianceData.map((v, i) => {
              const isPositive = v.change > 0;
              return (
                <div key={v.label} className="p-4 rounded-xl border" style={{ borderColor: CSS.borderLight }}>
                  <p className="text-xs" style={{ color: CSS.textMuted }}>{v.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-lg font-bold" style={{ color: CSS.text }}>{formatINR(v.current)}</p>
                    <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: isPositive ? CSS.success : CSS.danger }}>
                      {isPositive ? '↑' : '↓'} {Math.abs(v.change)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Department Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15 }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold" style={{ color: CSS.text }}>Department Payroll Breakdown</span>
          </div>
          <div className="space-y-4">
            {departmentBreakdown.map((dept, i) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={dept.department} variant="pill" className="text-[10px] px-2 py-0" />
                    <span className="text-[10px]" style={{ color: CSS.textMuted }}>{dept.count} employees</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: CSS.text }}>{formatINR(dept.totalNet)}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.totalNet / maxDeptNet) * 100}%` }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.15 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: deptColors[dept.department] ?? CSS.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

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
      </div>
    </PageShell>
  );
}
