'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  CheckCircle2, Clock, Gauge, AlertTriangle, Calendar, BarChart3,
  RotateCcw, ShieldAlert, Users, Zap, Timer, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { erpProductivityData } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

// Department breakdown derived from burn data (cross-reference with finance module)
const departmentBreakdown = [
  { department: 'Engineering', utilization: 91.2, efficiency: 87.5 },
  { department: 'Design', utilization: 88.4, efficiency: 92.1 },
  { department: 'Marketing', utilization: 82.6, efficiency: 85.8 },
  { department: 'Sales', utilization: 78.4, efficiency: 80.2 },
  { department: 'Operations', utilization: 84.8, efficiency: 88.6 },
  { department: 'HR & Admin', utilization: 72.4, efficiency: 79.4 },
];

export default function ERPProductivityPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = erpProductivityData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'this-week', 'month', 'quarter'];

  const maxThroughput = Math.max(
    ...data.taskThroughput.map((t) => Math.max(t.completed, t.created)),
  );
  const maxDeptUtil = Math.max(...departmentBreakdown.map((d) => d.utilization));

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  // ── Employee Productivity column definitions ──
  const employeeColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'employee',
      label: 'Employee',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}
          >
            {String(row.employee).split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
          </div>
          <span className="text-sm font-medium" style={{ color: CSS.text }}>{String(row.employee)}</span>
        </div>
      ),
    },
    {
      key: 'tasks',
      label: 'Tasks',
      sortable: true,
      render: (row) => {
        const topEmployee = data.employeeProductivity[0]?.employee;
        const isTop = topEmployee === row.employee;
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">{String(row.tasks)}</span>
            {isTop && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/15 text-amber-400">
                Top
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'hours',
      label: 'Hours',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" style={{ color: CSS.textMuted }} />
          <span className="text-sm">{String(row.hours)}h</span>
        </div>
      ),
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      sortable: true,
      render: (row) => {
        const eff = Number(row.efficiency);
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${eff}%`,
                  backgroundColor: eff >= 90
                    ? '#10b981'
                    : eff >= 85
                      ? '#3b82f6'
                      : '#f59e0b',
                }}
              />
            </div>
            <span className={cn(
              'text-xs font-semibold',
              eff >= 90 ? 'text-emerald-500'
                : eff >= 85 ? 'text-blue-500'
                  : 'text-amber-500',
            )}>
              {eff}%
            </span>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <Zap className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">ERP Productivity</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
=======
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Zap className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">ERP Productivity</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                Project completion, task throughput &amp; employee efficiency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f === 'this-week' ? 'This Week' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
<<<<<<< HEAD
            <span className="px-3 py-1.5 text-xs font-medium rounded-xl" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
=======
            <span className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-[var(--app-radius-lg)]',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              <Calendar className="w-4 h-4 inline mr-1.5" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              {today}
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            label="Project Completion"
            value={`${data.projectCompletion}%`}
            change={4.8}
            changeLabel="vs last month"
            icon={CheckCircle2}
          />
          <KPICard
            label="On-Time Delivery"
            value={`${data.onTimeDelivery}%`}
            change={-2.4}
            changeLabel="vs last month"
            icon={Clock}
            severity="warning"
          />
          <KPICard
            label="Utilization"
            value={`${data.utilizationPercent}%`}
            change={1.8}
            changeLabel="team utilization"
            icon={Gauge}
          />
          <KPICard
            label="Avg Approval Cycle"
            value={`${data.approvalCycleTime} hrs`}
            change={-15.2}
            changeLabel="faster approvals"
            icon={Timer}
          />
        </motion.div>

        {/* Row: Task Throughput + Alert Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Throughput */}
          <ChartCard title="Task Throughput" subtitle="Completed vs created tasks per week" className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-3">
              {[
                { color: 'bg-[var(--app-success)]', label: 'Completed' },
                { color: 'bg-[var(--app-info)]', label: 'Created' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
<<<<<<< HEAD
                  <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                  <span className="text-[10px]" style={{ color: CSS.textMuted }}>{l.label}</span>
=======
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', l.color)} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                </div>
              ))}
            </div>
            <div className="flex items-end gap-2 h-36">
              {data.taskThroughput.map((entry, i) => {
                const net = entry.completed - entry.created;
                const isPositive = net >= 0;
                return (
                  <div key={entry.week} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                    <span className={cn(
                      'text-[8px] font-medium',
                      isPositive ? 'text-emerald-500' : 'text-red-500',
                    )}>
                      {net > 0 ? '+' : ''}{net}
                    </span>
                    <div className="flex gap-0.5 w-full items-end h-full justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.created / maxThroughput) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-blue-500/40' : 'bg-blue-300')}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.completed / maxThroughput) * 100}%` }}
                        transition={{ delay: 0.32 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                      />
                    </div>
<<<<<<< HEAD
                    <span className="text-[8px] mt-1" style={{ color: CSS.textMuted }}>
=======
                    <span className={cn('text-[8px] mt-1', 'text-[var(--app-text-disabled)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                      {entry.week.replace('Week ', 'W')}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Alert Cards Column */}
          <div className="flex flex-col gap-4">
            {/* Blocked Tasks Alert */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
<<<<<<< HEAD
              className="rounded-2xl border-l-4 border-l-red-500 p-4 flex-1"
              style={{ backgroundColor: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.04)', borderColor: CSS.border, borderLeftColor: '#ef4444' }}
=======
              className={cn(
                'rounded-[var(--app-radius-xl)] border-l-4 border-l-red-500 p-4 flex-1',
                isDark
                  ? 'bg-red-500/[0.06] border border-l-red-500 border-t-red-500/20 border-r-red-500/20 border-b-red-500/20'
                  : 'bg-red-50 border border-l-red-500 border-t-red-200 border-r-red-200 border-b-red-200',
              )}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Blocked Tasks</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-red-600">{data.blockedTasks}</span>
<<<<<<< HEAD
                <span className="text-xs" style={{ color: CSS.textMuted }}>
                  tasks blocked
                </span>
              </div>
              <p className="text-xs" style={{ color: CSS.textSecondary }}>
                <span className="font-medium text-red-500">4 critical</span> — awaiting client feedback
              </p>
              <p className="text-xs mt-1" style={{ color: CSS.textSecondary }}>
                <span className="font-medium text-amber-500">5 medium</span> — internal review pending
              </p>
              <p className="text-xs mt-1" style={{ color: CSS.textSecondary }}>
=======
                <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  tasks blocked
                </span>
              </div>
              <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                <span className="font-medium text-red-500">4 critical</span> — awaiting client feedback
              </p>
              <p className={cn('text-xs mt-1', 'text-[var(--app-text-secondary)]')}>
                <span className="font-medium text-amber-500">5 medium</span> — internal review pending
              </p>
              <p className={cn('text-xs mt-1', 'text-[var(--app-text-secondary)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                <span className="font-medium text-blue-500">3 low</span> — dependency blocked
              </p>
            </motion.div>

            {/* Revision Rounds */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
<<<<<<< HEAD
              className="rounded-2xl border p-4 flex-1"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="w-4 h-4" style={{ color: CSS.textMuted }} />
                <span className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>
=======
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4 flex-1',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  Revision Rounds
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
<<<<<<< HEAD
                <span className="text-3xl font-bold" style={{ color: CSS.text }}>
                  {data.revisionRounds}
                </span>
                <span className="text-xs" style={{ color: CSS.textMuted }}>
=======
                <span className={cn('text-3xl font-bold', 'text-[var(--app-text)]')}>
                  {data.revisionRounds}
                </span>
                <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  avg rounds / project
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Design QA', value: 3.4 },
                  { label: 'Copy Review', value: 2.1 },
                  { label: 'Client Feedback', value: 1.8 },
                ].map((rev) => (
                  <div key={rev.label}>
                    <div className="flex items-center justify-between mb-0.5">
<<<<<<< HEAD
                      <span className="text-[10px]" style={{ color: CSS.textMuted }}>
=======
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                        {rev.label}
                      </span>
                      <span className="text-xs font-medium">{rev.value}</span>
                    </div>
<<<<<<< HEAD
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
=======
                    <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                      <div
                        className={cn('h-full rounded-full', isDark ? 'bg-amber-500/40' : 'bg-amber-400')}
                        style={{ width: `${(rev.value / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Employee Productivity Table */}
        <ChartCard title="Employee Productivity" subtitle="Tasks, hours &amp; efficiency score by employee">
<<<<<<< HEAD
          <SmartDataTable
            data={data.employeeProductivity as unknown as Record<string, unknown>[]}
            columns={employeeColumns}
            searchable
            enableExport
            pageSize={10}
            searchPlaceholder="Search employees…"
          />
=======
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Employee', 'Tasks', 'Hours', 'Efficiency'].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        'text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3',
                        'text-[var(--app-text-muted)]',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.employeeProductivity.map((emp, i) => (
                  <motion.tr
                    key={emp.employee}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={cn(
                      'border-b transition-colors',
                      'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]',
                    )}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold',
                          'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]',
                        )}>
                          {emp.employee.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium">{emp.employee}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{emp.tasks}</span>
                        {i === 0 && (
                          <span className={cn(
                            'text-[9px] px-1.5 py-0.5 rounded-full font-medium',
                            'bg-[var(--app-warning-bg)] text-[var(--app-warning)]',
                          )}>
                            Top
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                        <span className="text-sm">{emp.hours}h</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-20 h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${emp.efficiency}%` }}
                            transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                            className={cn(
                              'h-full rounded-full',
                              emp.efficiency >= 90
                                ? ('bg-[var(--app-success)]')
                                : emp.efficiency >= 85
                                  ? ('bg-[var(--app-info)]')
                                  : (isDark ? 'bg-amber-500/50' : 'bg-amber-400'),
                            )}
                          />
                        </div>
                        <span className={cn(
                          'text-xs font-semibold',
                          emp.efficiency >= 90 ? 'text-emerald-500'
                            : emp.efficiency >= 85 ? 'text-blue-500'
                              : 'text-amber-500',
                        )}>
                          {emp.efficiency}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
        </ChartCard>

        {/* Department-wise Breakdown */}
        <ChartCard title="Department-wise Productivity" subtitle="Utilization & efficiency by department">
          <div className="flex items-center gap-4 mb-3">
            {[
              { color: 'bg-[var(--app-info)]', label: 'Utilization %' },
              { color: isDark ? 'bg-violet-500/50' : 'bg-violet-400', label: 'Efficiency %' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
<<<<<<< HEAD
                <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>{l.label}</span>
=======
                <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', l.color)} />
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{l.label}</span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-1">
            {departmentBreakdown.map((dept, i) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs font-medium',
                      dept.efficiency >= 90 ? 'text-emerald-500'
                        : dept.efficiency >= 85 ? 'text-blue-500'
                          : 'text-amber-500',
                    )}>
                      {dept.efficiency}% eff
                    </span>
                    <span className="text-sm font-semibold">{dept.utilization}%</span>
                  </div>
                </div>
                <div className="relative space-y-1">
                  {/* Utilization bar */}
<<<<<<< HEAD
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
=======
                  <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.utilization}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', 'bg-[var(--app-info)]')}
                    />
                  </div>
                  {/* Efficiency bar */}
<<<<<<< HEAD
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
=======
                  <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.efficiency}%` }}
                      transition={{ delay: 0.37 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-violet-500/50' : 'bg-violet-400')}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
