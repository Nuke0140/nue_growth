'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Building2, Users, Target, DollarSign, FolderKanban, Network } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { KpiWidget } from './components/ops/kpi-widget';
import { PageShell } from './components/ops/page-shell';
import { mockEmployees, mockResources } from './data/mock-data';

function formatINR(num: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

interface Department {
  name: string;
  hod: string;
  employees: { name: string; role: string; avatar: string }[];
  projectCount: number;
  kpiScore: number;
  budget: number;
  color: string;
}

function useDepartments() {
  return useMemo(() => {
    const deptMap: Record<string, Department> = {};
    const colors = ['var(--app-accent)', '#34d399', '#60a5fa', '#fbbf24', '#a855f7', '#f87171', '#06b6d4'];
    const budgets: Record<string, number> = {
      Engineering: 3200000, Design: 1800000, QA: 950000, Operations: 1200000, HR: 800000, Sales: 2400000, Finance: 1100000,
    };
    const hods: Record<string, string> = {
      Engineering: 'Nikhil Das', Design: 'Arjun Mehta', QA: 'Sneha Reddy',
      Operations: 'Meera Patel', HR: 'Ritika Gupta', Sales: 'Saurabh Jain', Finance: 'Anita Kulkarni',
    };

    const deptNames = [...new Set(mockResources.map(r => r.department))];

    deptNames.forEach((name, idx) => {
      const emps = mockEmployees.filter(e => e.department === name);
      deptMap[name] = {
        name,
        hod: hods[name] || '—',
        employees: emps.map(e => ({ name: e.name, role: e.designation, avatar: e.avatar })),
        projectCount: mockResources.filter(r => r.department === name).reduce((s, r) => s + r.projects.length, 0),
        kpiScore: emps.length ? Math.round(emps.reduce((s, e) => s + e.productivityScore, 0) / emps.length) : 0,
        budget: budgets[name] || 500000,
        color: colors[idx % colors.length],
      };
    });

    return Object.values(deptMap);
  }, []);
}

function DepartmentsPageInner() {
  const departments = useDepartments();

  const stats = useMemo(() => ({
    total: departments.length,
    headcount: departments.reduce((s, d) => s + d.employees.length, 0),
    avgKpi: departments.length ? Math.round(departments.reduce((s, d) => s + d.kpiScore, 0) / departments.length) : 0,
    totalBudget: departments.reduce((s, d) => s + d.budget, 0),
  }), [departments]);

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Departments" icon={Network}>
      <motion.div className="space-y-app-2xl" variants={stagger} initial="hidden" animate="show">
        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Departments" value={stats.total} icon={Building2} color="accent" />
          <KpiWidget label="Headcount" value={stats.headcount} icon={Users} color="success" />
          <KpiWidget label="Avg KPI" value={`${stats.avgKpi}%`} icon={Target} color="warning" />
          <KpiWidget label="Monthly Budget" value={formatINR(stats.totalBudget)} icon={DollarSign} color="info" />
        </motion.div>

        {/* Department Cards Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              className="app-card overflow-hidden"
              style={{ borderRadius: 'var(--app-radius-md)' }}
            >
              {/* Color top bar */}
              <div className="h-1" style={{ backgroundColor: dept.color }} />

              <div className="p-app-xl space-y-4">
                {/* Name + HOD */}
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>{dept.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)' }}>Head: {dept.hod}</p>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="app-badge" style={{ backgroundColor: 'var(--app-success-bg)', color: '#34d399' }}>
                    <Users className="w-4 h-4" /> {dept.employees.length}
                  </span>
                  <span className="app-badge" style={{ backgroundColor: 'var(--app-info-bg)', color: '#60a5fa' }}>
                    <FolderKanban className="w-4 h-4" /> {dept.projectCount} projects
                  </span>
                  <span className="app-badge" style={{ backgroundColor: 'var(--app-warning-bg)', color: '#fbbf24' }}>
                    KPI {dept.kpiScore}%
                  </span>
                </div>

                {/* KPI Bar */}
                <div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.kpiScore}%` }}
                      transition={{ delay: idx * 0.06 + 0.2, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dept.kpiScore >= 85 ? '#34d399' : dept.kpiScore >= 70 ? '#fbbf24' : '#f87171' }}
                    />
                  </div>
                </div>

                {/* Employee List */}
                <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--app-border)' }}>
                  {dept.employees.slice(0, 5).map((emp) => (
                    <div key={emp.name} className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[8px] font-semibold" style={{ backgroundColor: 'var(--app-accent-light)', color: 'var(--app-accent)' }}>
                          {emp.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--app-text-secondary)' }}>{emp.name}</p>
                        <p className="text-[10px] truncate" style={{ color: 'var(--app-text-muted)' }}>{emp.role}</p>
                      </div>
                    </div>
                  ))}
                  {dept.employees.length > 5 && (
                    <p className="text-[10px] pt-1" style={{ color: 'var(--app-text-muted)' }}>+{dept.employees.length - 5} more</p>
                  )}
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between text-xs pt-2" style={{ borderTop: '1px solid var(--app-border)' }}>
                  <span style={{ color: 'var(--app-text-muted)' }}>Monthly Budget</span>
                  <span className="font-semibold" style={{ color: 'var(--app-text-secondary)' }}>{formatINR(dept.budget)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

export default memo(DepartmentsPageInner);
