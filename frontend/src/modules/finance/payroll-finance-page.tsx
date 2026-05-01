'use client';

import { formatINR } from './utils';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import {
  Users, DollarSign, Shield, UserCheck, UserX, Building, Link, ArrowUpRight,
} from 'lucide-react';
import { payrollRecords, hrIntegration } from '@/modules/finance/data/mock-data';
import type { PayrollRecord, HRIntegration } from '@/modules/finance/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { PageShell } from '@/components/shared/page-shell';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { StatusBadge } from '@/components/shared/status-badge';
import { useFinanceStore } from './finance-store';

// ── Department bar colors ───────────────────────────────
const deptBarColors: Record<string, string> = {
  Design: CSS.structural,
  Engineering: CSS.info,
  Sales: CSS.success,
  Marketing: CSS.warning,
};

// ── Component ───────────────────────────────────────────
export default function PayrollFinancePage() {
  const navigateTo = useFinanceStore((s) => s.navigateTo);

  // ── Computed values ────────────────────────────────────
  const totalGross = useMemo(() => payrollRecords.reduce((s, p) => s + p.grossPay, 0), []);
  const totalNet = useMemo(() => payrollRecords.reduce((s, p) => s + p.netPay, 0), []);
  const totalTDS = useMemo(() => payrollRecords.reduce((s, p) => s + p.tds, 0), []);
  const totalPF = useMemo(() => payrollRecords.reduce((s, p) => s + p.pf, 0), []);
  const totalESI = useMemo(() => payrollRecords.reduce((s, p) => s + p.esi, 0), []);
  const totalPFAndESI = totalPF + totalESI;

  const pendingRecords = useMemo(
    () => payrollRecords.filter((p: PayrollRecord) => p.status === 'pending' || p.status === 'approved'),
    [],
  );

  const departmentBreakdown = useMemo(() => {
    const map: Record<string, { totalNet: number; count: number }> = {};
    payrollRecords.forEach((p: PayrollRecord) => {
      if (!map[p.department]) map[p.department] = { totalNet: 0, count: 0 };
      map[p.department].totalNet += p.netPay;
      map[p.department].count += 1;
    });
    return Object.entries(map)
      .map(([department, data]) => ({ department, ...data }))
      .sort((a, b) => b.totalNet - a.totalNet);
  }, []);

  const maxDeptNet = useMemo(() => Math.max(...departmentBreakdown.map((d) => d.totalNet)), []);

  // ── Table data ─────────────────────────────────────────
  const tableData = useMemo(
    () =>
      payrollRecords.map((rec: PayrollRecord) => ({
        id: rec.id,
        employee: rec.employee,
        designation: rec.designation,
        department: rec.department,
        grossPay: formatINR(rec.grossPay),
        deductions: formatINR(rec.deductions),
        tds: formatINR(rec.tds),
        pf: formatINR(rec.pf),
        esi: formatINR(rec.esi),
        netPay: formatINR(rec.netPay),
        status: rec.status,
      })),
    [],
  );

  const columns: DataTableColumnDef[] = useMemo(
    () => [
      {
        key: 'employee',
        label: 'Employee',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium whitespace-nowrap" style={{ color: CSS.text }}>
            {row.employee as string}
          </span>
        ),
      },
      {
        key: 'designation',
        label: 'Designation',
        render: (row) => (
          <span className="text-xs whitespace-nowrap" style={{ color: CSS.textSecondary }}>
            {row.designation as string}
          </span>
        ),
      },
      {
        key: 'department',
        label: 'Department',
        sortable: true,
        render: (row) => (
          <StatusBadge status={row.department as string} variant="pill" className="text-[9px] px-1.5 py-0" />
        ),
      },
      {
        key: 'grossPay',
        label: 'Gross Pay',
        sortable: true,
        render: (row) => (
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: CSS.text }}>
            {row.grossPay as string}
          </span>
        ),
      },
      {
        key: 'deductions',
        label: 'Deductions',
        render: (row) => (
          <span className="text-xs whitespace-nowrap" style={{ color: CSS.danger }}>
            {row.deductions as string}
          </span>
        ),
      },
      {
        key: 'tds',
        label: 'TDS',
        render: (row) => (
          <span className="text-xs whitespace-nowrap" style={{ color: CSS.warning }}>
            {row.tds as string}
          </span>
        ),
      },
      { key: 'pf', label: 'PF', type: 'currency' },
      { key: 'esi', label: 'ESI', type: 'currency' },
      {
        key: 'netPay',
        label: 'Net Pay',
        sortable: true,
        render: (row) => (
          <span className="text-xs font-bold whitespace-nowrap" style={{ color: CSS.text }}>
            {row.netPay as string}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <StatusBadge status={row.status as string} variant="pill" className="text-[9px] px-1.5 py-0 capitalize" />
        ),
      },
    ],
    [],
  );

  const hr = hrIntegration as HRIntegration;

  return (
    <PageShell
      title="Payroll Finance"
      subtitle="HR-integrated Payroll Cockpit"
      icon={() => <Users className="w-5 h-5" style={{ color: CSS.accent }} />}
      headerRight={
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1.5 text-xs font-medium rounded-full"
            style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
          >
            Apr 2026
          </span>
          <Button
            className="px-4 py-2 text-sm font-medium rounded-xl gap-2"
            style={{ backgroundColor: CSS.accent, color: '#fff' }}
          >
            <UserCheck className="w-4 h-4" /> Process Payroll
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ── KPI Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Payroll" value={formatINR(totalGross)} icon={DollarSign} color="warning" />
          <KpiWidget label="Net Pay" value={formatINR(totalNet)} icon={Users} color="success" />
          <KpiWidget label="TDS Deducted" value={formatINR(totalTDS)} icon={Shield} color="info" />
          <KpiWidget label="PF + ESI" value={formatINR(totalPFAndESI)} icon={Building} color="accent" />
        </div>

        {/* ── HR Integration Card ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4" style={{ color: CSS.info }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>HR Integration</span>
              <StatusBadge status="active" variant="dot" className="text-[10px]" />
            </div>
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: CSS.accent }}
            >
              View in HR Module <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: CSS.hoverBg }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Headcount</p>
              <p className="text-xl font-bold mt-1" style={{ color: CSS.text }}>{hr.headcount}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: CSS.hoverBg }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Avg Salary</p>
              <p className="text-xl font-bold mt-1" style={{ color: CSS.text }}>{formatINR(hr.avgSalary)}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: CSS.hoverBg }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Pending Hires</p>
              <p className="text-xl font-bold mt-1" style={{ color: CSS.warning }}>{hr.pendingHires}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: CSS.hoverBg }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Projected Increase</p>
              <p className="text-xl font-bold mt-1" style={{ color: CSS.danger }}>+{hr.projectedPayrollIncrease}%</p>
            </div>
          </div>
        </motion.div>

        {/* ── Pending Approvals Queue ───────────────────── */}
        {pendingRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--app-warning) 3%, transparent)',
              borderColor: 'color-mix(in srgb, var(--app-warning) 12%, transparent)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>Pending Approvals Queue</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: CSS.warningBg, color: CSS.warning }}
              >
                {pendingRecords.length}
              </span>
            </div>
            <div className="space-y-2">
              {pendingRecords.map((rec: PayrollRecord, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3, ease: ANIMATION.ease as unknown as number[] }}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: 'color-mix(in srgb, var(--app-warning) 10%, transparent)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: CSS.hoverBg }}
                    >
                      <Users className="w-4 h-4" style={{ color: CSS.textSecondary }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: CSS.text }}>{rec.employee}</p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>
                        {rec.designation} · {rec.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                      {formatINR(rec.netPay)}
                    </span>
                    <StatusBadge status={rec.status} variant="pill" className="text-[10px] px-2 py-0 capitalize" />
                    <Button
                      size="sm"
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: CSS.success, color: '#fff' }}
                    >
                      <UserCheck className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: CSS.danger, color: '#fff' }}
                    >
                      <UserX className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Department Breakdown ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: ANIMATION.duration.slow, ease: ANIMATION.ease as unknown as number[] }}
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Department Breakdown</span>
            </div>
            <span className="text-xs" style={{ color: CSS.textMuted }}>{payrollRecords.length} employees</span>
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
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: ANIMATION.ease as unknown as number[] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: deptBarColors[dept.department] ?? CSS.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Payroll Table ──────────────────────────────── */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.text }}>Payroll Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: CSS.textMuted }}>Total Net:</span>
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
