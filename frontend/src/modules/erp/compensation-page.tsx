'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable, type Column } from './components/ops/data-table';
import { KpiWidget } from './components/ops/kpi-widget';
import { PageShell } from './components/ops/page-shell';
import { mockPayroll, mockEmployees } from './data/mock-data';
import type { PayrollRecord } from './types';
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
  'rgba(52, 211, 153, 0.12)',
  'rgba(96, 165, 250, 0.12)',
  'rgba(251, 191, 36, 0.12)',
  'rgba(248, 113, 113, 0.12)',
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
  const columns: Column<(PayrollRecord & { salaryBand: string; totalComp: number }) & Record<string, unknown>>[] = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const name = row.employeeName as string;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-[10px] font-semibold"
                style={{
                  backgroundColor: avatarColors[Math.abs(hashCode(name)) % avatarColors.length],
                  color: 'var(--ops-accent)',
                }}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium" style={{ color: 'var(--ops-text)' }}>
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
      hiddenMobile: true,
      render: (row) => (
        <span className="ops-badge" style={{ backgroundColor: 'rgba(204, 92, 55, 0.1)', color: 'var(--ops-accent)' }}>
          {row.salaryBand as string}
        </span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>
          {row.department as string}
        </span>
      ),
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      sortable: true,
      hiddenMobile: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>
          {formatINR(row.baseSalary as number)}
        </span>
      ),
    },
    {
      key: 'incentives',
      label: 'Incentives',
      sortable: true,
      hiddenMobile: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--ops-success)' }}>
          +{formatINR(row.incentives as number)}
        </span>
      ),
    },
    {
      key: 'totalComp',
      label: 'Total Comp',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-bold" style={{ color: 'var(--ops-text)' }}>
          {formatINR(row.totalComp as number)}
        </span>
      ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Compensation" icon={Wallet}>
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* KPI Widgets */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget label="Avg Salary" value={formatINR(kpis.avgSalary)} icon={Wallet} color="accent" />
          <KpiWidget label="Total Payout" value={formatINR(kpis.totalComp)} icon={TrendingUp} color="success" />
          <KpiWidget label="Departments" value={kpis.departmentCount} icon={Building2} color="info" />
        </motion.div>

        {/* Department Salary Distribution Bar Chart */}
        <motion.div variants={fadeUp} className="ops-card p-6">
          <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--ops-text)' }}>
            Avg Salary by Department
          </h3>
          <div className="space-y-3">
            {deptAvgSalary.map((dept, idx) => {
              const barWidth = Math.max((dept.avgSalary / maxAvgSalary) * 100, 4);
              const barColor = deptColors[dept.department] || 'var(--ops-accent)';
              return (
                <div key={dept.department} className="flex items-center gap-4">
                  <span
                    className="text-xs font-medium w-28 shrink-0 text-right"
                    style={{ color: 'var(--ops-text-secondary)' }}
                  >
                    {dept.department}
                  </span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-lg flex items-center justify-end pr-3"
                      style={{ backgroundColor: barColor, minWidth: '3rem' }}
                    >
                      <span className="text-[11px] font-bold text-white drop-shadow-sm">
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
          <DataTable
            columns={columns}
            data={enriched as ((PayrollRecord & { salaryBand: string; totalComp: number }) & Record<string, unknown>)[]}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeName', 'department']}
            emptyMessage="No compensation records found."
          />
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

export default memo(CompensationPageInner);
