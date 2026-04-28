'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users,
  FolderKanban,
  Shield,
  Banknote,
  UserPlus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
  CalendarDays,
  Activity,
} from 'lucide-react';

import { KpiWidget } from '@/modules/erp/components/ops/kpi-widget';
import { ActivityFeed } from '@/modules/erp/components/ops/activity-feed';
import { MiniCalendar } from '@/modules/erp/components/ops/mini-calendar';
import { OpsCard } from '@/modules/erp/components/ops/ops-card';

import {
  mockEmployees,
  mockProjects,
  mockApprovals,
  mockPayroll,
} from '@/modules/erp/data/mock-data';

// ── Helpers ──────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (abs >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const healthColorMap: Record<string, string> = {
  excellent: '#34d399',
  good: '#60a5fa',
  'at-risk': '#fbbf24',
  critical: '#f87171',
};

const severityColorMap: Record<string, string> = {
  critical: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
};

// ── Computed KPI Data ────────────────────────────────────────────────

const totalEmployees = mockEmployees.length;

const activeProjects = mockProjects.filter(
  (p) => p.status === 'active'
).length;

const pendingApprovals = mockApprovals.filter(
  (a) => a.status === 'pending' || a.status === 'escalated'
).length;

const currentMonthPayroll = mockPayroll
  .filter((r) => r.month === '2026-04')
  .reduce((sum, r) => sum + r.netPay, 0);

// ── Activity Data ────────────────────────────────────────────────────

const activities = [
  {
    id: '1',
    icon: UserPlus,
    title: 'New employee onboarded',
    description: 'Rahul Sharma joined Engineering',
    time: '2 hours ago',
    color: '#60a5fa',
  },
  {
    id: '2',
    icon: FileText,
    title: 'Leave request submitted',
    description: 'Sneha Reddy applied for 3 days casual leave',
    time: '3 hours ago',
    color: '#fbbf24',
  },
  {
    id: '3',
    icon: CheckCircle2,
    title: 'Invoice approved',
    description: 'NexaBank Q2 Milestone Invoice approved by CFO',
    time: '5 hours ago',
    color: '#34d399',
  },
  {
    id: '4',
    icon: AlertTriangle,
    title: 'Task blocked',
    description:
      'Risk management algorithm blocked on dependency',
    time: '6 hours ago',
    color: '#f87171',
  },
  {
    id: '5',
    icon: Package,
    title: 'Asset assigned',
    description: 'MacBook Pro M3 assigned to Nikhil Das',
    time: '1 day ago',
    color: '#cc5c37',
  },
  {
    id: '6',
    icon: TrendingUp,
    title: 'Project milestone completed',
    description: 'Core API Delivery milestone completed for NexaBank',
    time: '1 day ago',
    color: '#34d399',
  },
  {
    id: '7',
    icon: Clock,
    title: 'Attendance anomaly detected',
    description: '3 employees checked in late today',
    time: '2 days ago',
    color: '#fbbf24',
  },
];

// ── Calendar Events ──────────────────────────────────────────────────

const calendarEvents = [
  { date: '2026-04-25', title: 'Payroll Processing', color: '#cc5c37' },
  { date: '2026-04-28', title: 'Sprint Review', color: '#60a5fa' },
  { date: '2026-04-30', title: 'CloudSync Delivery', color: '#34d399' },
  { date: '2026-05-01', title: 'MediCare Deadline', color: '#f87171' },
  {
    date: '2026-05-05',
    title: 'FinEdge Compliance Due',
    color: '#fbbf24',
  },
  {
    date: '2026-05-15',
    title: 'POS Hardware Integration',
    color: '#60a5fa',
  },
  {
    date: '2026-06-15',
    title: 'ShopVerse Multi-vendor',
    color: '#34d399',
  },
  { date: '2026-06-30', title: 'FinEdge Go-Live', color: '#cc5c37' },
];

// ── Chart Data ───────────────────────────────────────────────────────

const activeProjectsList = mockProjects
  .filter((p) => p.status === 'active')
  .map((p) => ({
    name: p.name.replace(/\s+(Digital Transformation|E-Commerce Platform|Patient Portal|Fleet Management|IoT Dashboard|Trading Platform|POS System|SaaS Monthly Retainer|Farm Analytics)$/i, '').trim(),
    progress: p.progress,
    health: p.health,
  }));

const departmentMap: Record<string, number> = {};
mockEmployees.forEach((e) => {
  departmentMap[e.department] = (departmentMap[e.department] || 0) + 1;
});
const departmentData = Object.entries(departmentMap)
  .map(([dept, count]) => ({ dept, count }))
  .sort((a, b) => b.count - a.count);

const maxDeptCount = Math.max(...departmentData.map((d) => d.count), 1);

const deptColorPalette = [
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#cc5c37',
  '#a78bfa',
  '#f472b6',
  '#38bdf8',
];

// ── Alerts Data ──────────────────────────────────────────────────────

const alerts = [
  {
    severity: 'critical' as const,
    title: 'MediCare Portal — 18 days overdue',
    desc: 'Due date was Apr 1. Client escalation risk high.',
    icon: AlertTriangle,
  },
  {
    severity: 'critical' as const,
    title: '₹6.60L unpaid invoices',
    desc: 'MediCare + LegalEase invoices overdue by 10+ days.',
    icon: DollarSign,
  },
  {
    severity: 'warning' as const,
    title: 'FinEdge — 2 tasks blocked',
    desc: 'Risk module blocked on payment gateway dependency.',
    icon: Clock,
  },
  {
    severity: 'warning' as const,
    title: 'April payroll pending',
    desc: '2 employees in pending state. Deadline Apr 25.',
    icon: Banknote,
  },
  {
    severity: 'info' as const,
    title: 'Vikram Joshi overbooked at 95%',
    desc: 'Only 5% capacity available. Consider redistribution.',
    icon: Users,
  },
];

// ── Animation Variants ───────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════

export default function OpsDashboardPage() {
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>(undefined);

  return (
    <motion.div
      className="flex flex-col gap-6 overflow-y-auto h-full pr-1"
      style={{ paddingBottom: '2rem' }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ backgroundColor: 'rgba(204, 92, 55, 0.12)' }}
          >
            <Activity className="w-5 h-5" style={{ color: '#cc5c37' }} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--ops-text)' }}
          >
            Operations Dashboard
          </h1>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg self-start sm:self-auto"
          style={{
            backgroundColor: 'var(--ops-card-bg-light)',
            border: '1px solid var(--ops-border)',
          }}
        >
          <CalendarDays className="w-3.5 h-3.5" style={{ color: 'var(--ops-text-muted)' }} />
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--ops-text-secondary)' }}
          >
            {formatToday()}
          </span>
        </div>
      </motion.div>

      {/* ── KPI Cards Row ───────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiWidget
            label="Total Employees"
            value={totalEmployees}
            icon={Users}
            color="info"
            trend="up"
            trendValue="+2 this month"
          />
          <KpiWidget
            label="Active Projects"
            value={activeProjects}
            icon={FolderKanban}
            color="accent"
            trend="neutral"
            trendValue="No change"
          />
          <KpiWidget
            label="Pending Approvals"
            value={pendingApprovals}
            icon={Shield}
            color="warning"
            trend="up"
            trendValue="+3 since last week"
          />
          <KpiWidget
            label="Monthly Payroll"
            value={formatINR(currentMonthPayroll)}
            icon={Banknote}
            color="success"
            trend="up"
            trendValue="Apr 2026"
          />
        </div>
      </motion.div>

      {/* ── Activity Feed + Calendar ────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
      >
        {/* Left: Activity Feed (~60%) */}
        <div className="lg:col-span-3">
          <OpsCard
            title="Recent Activity"
            badge="7 new"
            className="h-full"
          >
            <ActivityFeed activities={activities} maxItems={7} />
          </OpsCard>
        </div>

        {/* Right: Calendar (~40%) */}
        <div className="lg:col-span-2">
          <OpsCard title="Calendar" className="h-full">
            <MiniCalendar
              events={calendarEvents}
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
            />
          </OpsCard>
        </div>
      </motion.div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Left: Project Progress */}
        <OpsCard title="Project Progress" subtitle="Active projects by completion %">
          <div className="flex flex-col gap-3">
            {activeProjectsList.map((proj, idx) => {
              const barColor = healthColorMap[proj.health] || '#60a5fa';
              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium truncate mr-3"
                      style={{ color: 'var(--ops-text-secondary)' }}
                    >
                      {proj.name}
                    </span>
                    <span
                      className="text-xs font-semibold shrink-0"
                      style={{ color: barColor }}
                    >
                      {proj.progress}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--ops-card-bg-light)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{
                        duration: 0.8,
                        delay: idx * 0.08,
                        ease: 'easeOut',
                      }}
                      style={{ backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </OpsCard>

        {/* Right: Employee Growth / Department Distribution */}
        <OpsCard title="Employee Growth" subtitle="Team distribution by department">
          <div className="flex flex-col gap-3">
            {departmentData.map((dept, idx) => {
              const barColor = deptColorPalette[idx % deptColorPalette.length];
              const pct = (dept.count / maxDeptCount) * 100;
              return (
                <div key={dept.dept} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--ops-text-secondary)' }}
                    >
                      {dept.dept}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: barColor }}
                    >
                      {dept.count}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--ops-card-bg-light)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: idx * 0.08,
                        ease: 'easeOut',
                      }}
                      style={{ backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </OpsCard>
      </motion.div>

      {/* ── Alerts Section ──────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <OpsCard
          title="Active Alerts"
          badge={`${alerts.filter((a) => a.severity === 'critical').length} critical`}
        >
          <div className="flex flex-col gap-3">
            {alerts.map((alert, idx) => {
              const Icon = alert.icon;
              const barColor = severityColorMap[alert.severity] || '#60a5fa';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: idx * 0.07,
                    ease: 'easeOut',
                  }}
                  className={cn(
                    'flex items-stretch gap-3 p-3 rounded-xl transition-colors',
                  )}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--ops-border)',
                  }}
                >
                  {/* Left color bar */}
                  <div
                    className="w-1 rounded-full shrink-0"
                    style={{ backgroundColor: barColor }}
                  />

                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
                    style={{ backgroundColor: `${barColor}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: barColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-xs font-semibold uppercase tracking-wider'
                        )}
                        style={{ color: barColor }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p
                      className="text-sm font-medium mt-0.5 truncate"
                      style={{ color: 'var(--ops-text)' }}
                    >
                      {alert.title}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--ops-text-muted)' }}
                    >
                      {alert.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </OpsCard>
      </motion.div>
    </motion.div>
  );
}
