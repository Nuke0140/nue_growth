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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <Zap className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">ERP Productivity</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
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
            <span className="px-3 py-1.5 text-xs font-medium rounded-xl" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
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
                { color: isDark ? 'bg-emerald-500/50' : 'bg-emerald-400', label: 'Completed' },
                { color: isDark ? 'bg-blue-500/50' : 'bg-blue-400', label: 'Created' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                  <span className="text-[10px]" style={{ color: CSS.textMuted }}>{l.label}</span>
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
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-blue-500/40' : 'bg-blue-300')}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.completed / maxThroughput) * 100}%` }}
                        transition={{ delay: 0.32 + i * 0.05, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-emerald-500/40' : 'bg-emerald-300')}
                      />
                    </div>
                    <span className="text-[8px] mt-1" style={{ color: CSS.textMuted }}>
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
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.15 }}
              className="rounded-2xl border-l-4 border-l-red-500 p-4 flex-1"
              style={{ backgroundColor: isDark ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.04)', borderColor: CSS.border, borderLeftColor: '#ef4444' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Blocked Tasks</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-red-600">{data.blockedTasks}</span>
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
                <span className="font-medium text-blue-500">3 low</span> — dependency blocked
              </p>
            </motion.div>

            {/* Revision Rounds */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.15 }}
              className="rounded-2xl border p-4 flex-1"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw className="w-4 h-4" style={{ color: CSS.textMuted }} />
                <span className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>
                  Revision Rounds
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold" style={{ color: CSS.text }}>
                  {data.revisionRounds}
                </span>
                <span className="text-xs" style={{ color: CSS.textMuted }}>
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
                      <span className="text-[10px]" style={{ color: CSS.textMuted }}>
                        {rev.label}
                      </span>
                      <span className="text-xs font-medium">{rev.value}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
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
          <SmartDataTable
            data={data.employeeProductivity as unknown as Record<string, unknown>[]}
            columns={employeeColumns}
            searchable
            enableExport
            pageSize={10}
            searchPlaceholder="Search employees…"
          />
        </ChartCard>

        {/* Department-wise Breakdown */}
        <ChartCard title="Department-wise Productivity" subtitle="Utilization & efficiency by department">
          <div className="flex items-center gap-4 mb-3">
            {[
              { color: isDark ? 'bg-blue-500/50' : 'bg-blue-400', label: 'Utilization %' },
              { color: isDark ? 'bg-violet-500/50' : 'bg-violet-400', label: 'Efficiency %' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', l.color)} />
                <span className="text-[10px]" style={{ color: CSS.textMuted }}>{l.label}</span>
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
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.utilization}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', isDark ? 'bg-blue-500/50' : 'bg-blue-400')}
                    />
                  </div>
                  {/* Efficiency bar */}
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.efficiency}%` }}
                      transition={{ delay: 0.37 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
