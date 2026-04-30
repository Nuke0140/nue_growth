'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockPayroll, mockEmployees } from '@/modules/erp/data/mock-data';
import type { PayrollRecord } from '@/modules/erp/types';
import { Wallet, TrendingUp, Building2 } from 'lucide-react';

// ---- Helpers ----

function formatINR(num: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
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

// Bar chart colors per department
const deptColors: Record<string, string> = {
  Design: '#cc5c37',
  Engineering: '#34d399',
  QA: '#60a5fa',
  Operations: '#fbbf24',
  HR: '#a78bfa',
  Sales: '#f472b6',
  Finance: '#38bdf8',
};

function CompensationPageInner() {
  // Merge payroll with employee salary band data
  const enriched = useMemo(() => {
    return mockPayroll.map(p => {
      const emp = mockEmployees.find(e => e.id === p.employeeId);
      return {
        ...p,
        salaryBand: emp?.salaryBand || 'N/A',
        totalComp: p.baseSalary + p.incentives,
      };
    });
  }, []);

  // KPI computations
  const kpis = useMemo(() => {
    const totalComp = enriched.reduce((s, r) => s + r.totalComp, 0);
    const avgSalary = enriched.length > 0 ? Math.round(totalComp / enriched.length) : 0;
    const departments = new Set(enriched.map(r => r.department));
    return {
      avgSalary,
      totalComp,
      departmentCount: departments.size,
    };
  }, [enriched]);

  // Department avg salary for bar chart
  const deptAvgSalary = useMemo(() => {
    const deptMap = new Map<string, { total: number; count: number }>();
    enriched.forEach(r => {
      const d = deptMap.get(r.department) || { total: 0, count: 0 };
      d.total += r.totalComp;
      d.count += 1;
      deptMap.set(r.department, d);
    });
    const entries = Array.from(deptMap.entries())
      .map(([dept, { total, count }]) => ({
        department: dept,
        avgSalary: Math.round(total / count),
      }))
      .sort((a, b) => b.avgSalary - a.avgSalary);
    return entries;
  }, [enriched]);

  const maxAvgSalary = Math.max(...deptAvgSalary.map(d => d.avgSalary), 1);

  // DataTable columns
  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const name = String(row.employeeName);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-[10px] font-semibold"
                style={{
                  backgroundColor: avatarColors[Math.abs(hashCode(name)) % avatarColors.length],
<<<<<<< HEAD
                  color: CSS.accent,
=======
                  color: 'var(--app-accent)',
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                }}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
<<<<<<< HEAD
            <span className="text-sm font-medium" style={{ color: CSS.text }}>
=======
            <span className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              {name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'salaryBand',
      label: 'Band',
      sortable: true,
      render: (row) => (
<<<<<<< HEAD
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: 'rgba(204, 92, 55, 0.1)', color: CSS.accent }}>
          {String(row.salaryBand)}
=======
        <span className="app-badge" style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}>
          {row.salaryBand as string}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (row) => (
<<<<<<< HEAD
        <span className="text-sm" style={{ color: CSS.textSecondary }}>
          {String(row.department)}
=======
        <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          {row.department as string}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </span>
      ),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      sortable: true,
      render: (row) => (
<<<<<<< HEAD
        <span className="text-sm" style={{ color: CSS.textSecondary }}>
          {formatINR(Number(row.baseSalary))}
=======
        <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          {formatINR(row.baseSalary as number)}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </span>
      ),
    },
    {
      key: 'incentives',
      label: 'Incentives',
      sortable: true,
      render: (row) => (
<<<<<<< HEAD
        <span className="text-sm" style={{ color: CSS.success }}>
          +{formatINR(Number(row.incentives))}
=======
        <span className="text-sm" style={{ color: 'var(--app-success)' }}>
          +{formatINR(row.incentives as number)}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </span>
      ),
    },
    {
      key: 'totalComp',
      label: 'Total Comp',
      sortable: true,
      render: (row) => (
<<<<<<< HEAD
        <span className="text-sm font-bold" style={{ color: CSS.text }}>
          {formatINR(Number(row.totalComp))}
=======
        <span className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
          {formatINR(row.totalComp as number)}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </span>
      ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Compensation" icon={Wallet}>
      <motion.div className="space-y-app-2xl" variants={stagger} initial="hidden" animate="show">
        {/* KPI Widgets */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget label="Avg Salary" value={formatINR(kpis.avgSalary)} icon={Wallet} color="accent" />
          <KpiWidget label="Total Payout" value={formatINR(kpis.totalComp)} icon={TrendingUp} color="success" />
          <KpiWidget label="Departments" value={kpis.departmentCount} icon={Building2} color="info" />
        </motion.div>

        {/* Department Salary Distribution Bar Chart */}
<<<<<<< HEAD
        <motion.div variants={fadeUp} className="rounded-2xl p-6" style={{ backgroundColor: CSS.cardBg, border: `1px solid ${CSS.border}`, boxShadow: CSS.shadowCard }}>
          <h3 className="text-sm font-semibold mb-5" style={{ color: CSS.text }}>
=======
        <motion.div variants={fadeUp} className="app-card p-6">
          <h3 className="text-sm font-semibold mb-app-xl" style={{ color: 'var(--app-text)' }}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            Avg Salary by Department
          </h3>
          <div className="space-y-3">
            {deptAvgSalary.map((dept, idx) => {
              const barWidth = Math.max((dept.avgSalary / maxAvgSalary) * 100, 4);
<<<<<<< HEAD
              const barColor = deptColors[dept.department] || CSS.accent;
=======
              const barColor = deptColors[dept.department] || 'var(--app-accent)';
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              return (
                <div key={dept.department} className="flex items-center gap-4">
                  <span
                    className="text-xs font-medium w-28 shrink-0 text-right"
<<<<<<< HEAD
                    style={{ color: CSS.textSecondary }}
                  >
                    {dept.department}
                  </span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
=======
                    style={{ color: 'var(--app-text-secondary)' }}
                  >
                    {dept.department}
                  </span>
                  <div className="flex-1 h-8  rounded-[var(--app-radius-lg)] overflow-hidden" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-[var(--app-radius-lg)] flex items-center justify-end pr-3"
                      style={{ backgroundColor: barColor, minWidth: '3rem' }}
                    >
                      <span className="text-[11px] font-bold text-white drop-shadow-[var(--app-shadow-sm)]">
                        {formatINR(dept.avgSalary)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div variants={fadeUp}>
          <SmartDataTable
            data={enriched as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeName', 'department']}
            emptyMessage="No compensation records found."
            enableExport
          />
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

export default memo(CompensationPageInner);
