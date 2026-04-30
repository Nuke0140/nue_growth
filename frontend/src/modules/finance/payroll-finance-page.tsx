'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IndianRupee, Users, TrendingUp, TrendingDown, Clock,
  CheckCircle2, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight,
  Building2, Briefcase, Shield, Wallet, DollarSign,
} from 'lucide-react';
import { payrollRecords } from '@/modules/finance/data/mock-data';
import type { PayrollRecord } from '@/modules/finance/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const statusConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  pending: { label: 'Pending', bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
  approved: { label: 'Approved', bgDark: 'bg-sky-500/15 text-sky-400', bgLight: 'bg-sky-50 text-sky-600' },
  processed: { label: 'Processed', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
};

const deptColors: Record<string, string> = {
  Design: 'bg-violet-500/15 text-violet-400',
  Engineering: 'bg-sky-500/15 text-sky-400',
  Sales: 'bg-emerald-500/15 text-emerald-400',
  Marketing: 'bg-amber-500/15 text-amber-400',
};

export default function PayrollFinancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  // MoM variance mock data
  const varianceData = [
    { label: 'Total Payroll', current: totalNet, previous: totalNet * 0.92, change: 8.3 },
    { label: 'Incentives', current: totalIncentives, previous: totalIncentives * 0.85, change: 17.6 },
    { label: 'Deductions', current: totalDeductions, previous: totalDeductions * 1.05, change: -4.8 },
    { label: 'TDS', current: totalTDS, previous: totalTDS * 0.95, change: 5.2 },
  ];

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
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        </div>

        {/* Approval Queue */}
        {pendingRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', isDark ? 'bg-amber-500/[0.03] border-amber-500/[0.12]' : 'bg-amber-50/50 border-amber-200/60')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">Pending Approval</span>
              <Badge variant="secondary" className="text-[10px] bg-amber-500/15 text-amber-400">{pendingRecords.length} entries</Badge>
            </div>
            <div className="space-y-2">
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
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* MoM Variance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {varianceData.map((v, i) => {
              const isPositive = v.change > 0;
              return (
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
              );
            })}
          </div>
        </motion.div>

        {/* Department Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Department Payroll Breakdown</span>
            </div>
          </div>
          <div className="space-y-4">
            {departmentBreakdown.map((dept, i) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', deptColors[dept.department] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'))}>
                      {dept.department}
                    </Badge>
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{dept.count} employees</span>
                  </div>
                  <span className="text-sm font-semibold">{formatINR(dept.totalNet)}</span>
                </div>
                <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.totalNet / maxDeptNet) * 100}%` }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.6 }}
                    className={cn('h-full rounded-full', i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-sky-500' : i === 2 ? 'bg-emerald-500' : 'bg-amber-500')}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

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
      </div>
    </div>
  );
}
