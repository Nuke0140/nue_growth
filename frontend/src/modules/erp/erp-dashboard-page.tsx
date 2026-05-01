'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, AlertTriangle, Clock, DollarSign, Users, TrendingUp,
  Activity, Target, UserX, Flame, BarChart3, PieChart, LineChart,
  AreaChart, GitBranch, ChevronRight, Zap, Shield, FolderKanban,
  UserPlus, Banknote, FileText, Sparkles, ArrowRight, Lightbulb,
  CheckCircle2, ListTodo, RotateCcw, AlertOctagon, Brain, Recycle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  mockProjects, mockTasks, mockApprovals, mockInvoices, mockPayroll,
  mockResources, erpDashboardStats, mockAiOpsInsights,
} from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { KpiWidget } from '@/modules/erp/components/ops/kpi-widget';
import { ActivityFeed } from '@/modules/erp/components/ops/activity-feed';
import { LayoutDashboard } from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import type { ErpPage } from '@/modules/erp/types';

// ── Stagger animation helper ──
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ── Pipeline chart data ──
function getPipelineData() {
  const active = mockProjects.filter(p => p.status === 'active').length;
  const onHold = mockProjects.filter(p => p.status === 'on-hold' || p.status === 'inception').length;
  const completed = mockProjects.filter(p => p.status === 'completed').length;
  const atRisk = mockProjects.filter(p => p.health === 'at-risk' || p.health === 'critical').length;
  return [
    { name: 'Active', value: active, fill: '#10b981' },
    { name: 'On Hold', value: onHold, fill: '#3b82f6' },
    { name: 'Completed', value: completed, fill: '#8b5cf6' },
    { name: 'At Risk', value: atRisk, fill: '#ef4444' },
  ];
}

// ── Risk alerts ──
const riskAlerts = [
  {
    severity: 'critical' as const,
    title: 'MediCare Portal — 18 days overdue',
    description: 'Due date was Apr 1. Client escalation risk high. Budget exceeded by ₹30,000.',
    affected: 'MediCare Patient Portal',
    action: 'Review Now',
  },
  {
    severity: 'critical' as const,
    title: 'FinEdge — Budget burn at 89%',
    description: '₹28.5L spent of ₹32L budget. Project will exceed by ₹5.3L at current rate.',
    affected: 'FinEdge Trading Platform',
    action: 'Take Action',
  },
  {
    severity: 'high' as const,
    title: 'CloudOps vendor SLA dropped to 78%',
    description: 'Threshold is 85%. Two incidents in 30 days with avg resolution > 4 hours.',
    affected: 'CloudOps Infra Management',
    action: 'Review Vendor',
  },
];

// ── AI recommendations ──
const aiRecommendations = [
  {
    icon: Recycle,
    title: 'Reduce CloudOps costs by 35%',
    description: 'Consolidate DevOps vendors (CloudOps + NetSpeed + CodeReview) to save ₹2.4L annually.',
    confidence: 72,
    action: 'See Savings',
  },
  {
    icon: Users,
    title: 'Reallocate Vikram Joshi workload',
    description: 'Vikram is at 95% allocation across 2 projects. Consider shifting RetailPro tasks to Arun.',
    confidence: 89,
    action: 'Reassign',
  },
  {
    icon: Target,
    title: 'MediCare deadline prediction: Apr 19',
    description: 'AI predicts UAT milestone will be missed by 8 days based on current velocity and blockers.',
    confidence: 92,
    action: 'View Details',
  },
];

// ── Activity feed mock ──
const recentActivities = [
  { id: 'a1', icon: CheckCircle2, title: 'Task completed', description: 'GPS tracking WebSocket setup — AutoFlow', time: '12 min ago', color: '#10b981' },
  { id: 'a2', icon: Shield, title: 'Approval approved', description: 'Sneha Reddy — 3 Days Casual Leave', time: '34 min ago', color: '#3b82f6' },
  { id: 'a3', icon: GitBranch, title: 'Project updated', description: 'NexaBank — API rate limiting task added', time: '1 hr ago', color: 'var(--app-accent)' },
  { id: 'a4', icon: Calendar, title: 'Leave applied', description: 'Vikram Joshi — 5 days earned leave (May)', time: '2 hrs ago', color: '#f59e0b' },
  { id: 'a5', icon: AlertTriangle, title: 'Overdue invoice', description: 'MediCare Global — ₹4.8L (10+ days)', time: '3 hrs ago', color: '#ef4444' },
  { id: 'a6', icon: Banknote, title: 'Payroll processed', description: 'March 2026 — 10 employees processed', time: '5 hrs ago', color: '#8b5cf6' },
];

// ── Custom tooltip for chart ──
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; fill: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--app-bg)] border border-[var(--app-border-strong)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-[var(--app-text)]">{label}</p>
      <p className="text-xs text-[var(--app-text-secondary)]">{payload[0].value} projects</p>
    </div>
  );
}

// ── Main Component ──
function ErpDashboardPageInner() {
  const navigateTo = useErpStore((s) => s.navigateTo);
  const openCreateModal = useErpStore((s) => s.openCreateModal);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const pipelineData = useMemo(() => getPipelineData(), []);

  const kpis = useMemo(() => {
    const overdueTasks = mockTasks.filter(t => {
      const due = new Date(t.dueDate);
      return due < new Date() && t.stage !== 'done';
    }).length;
    const pendingApprovals = mockApprovals.filter(
      a => a.status === 'pending' || a.status === 'escalated'
    ).length;
    const urgentApprovals = mockApprovals.filter(
      a => (a.status === 'pending' || a.status === 'escalated') && a.type === 'budget'
    ).length;
    const atRisk = mockProjects.filter(p => p.health === 'at-risk' || p.health === 'critical').length;
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const teamUtil = Math.round(
      mockResources.reduce((s, r) => s + r.utilization, 0) / mockResources.length
    );
    const avgSla = Math.round(
      mockProjects
        .filter(p => p.status === 'active' || p.status === 'completed')
        .reduce((s, p) => s + p.sla, 0) /
        mockProjects.filter(p => p.status === 'active' || p.status === 'completed').length
    );

    return [
      { label: 'Total Revenue', value: '$2.76M', icon: DollarSign, trend: 'up' as const, trendValue: '+12% from last month', color: 'accent' as const },
      { label: 'Active Projects', value: activeProjects, icon: FolderKanban, trend: 'neutral' as const, trendValue: `${atRisk} at risk`, color: 'info' as const },
      { label: 'Team Utilization', value: `${teamUtil}%`, icon: Activity, trend: 'up' as const, trendValue: '+5% vs last week', color: 'success' as const },
      { label: 'Pending Approvals', value: pendingApprovals, icon: Shield, trend: 'neutral' as const, trendValue: `${Math.min(urgentApprovals, 3)} urgent`, color: 'warning' as const },
      { label: 'Overdue Tasks', value: overdueTasks, icon: Clock, trend: 'down' as const, trendValue: '-2 from last week', color: 'danger' as const },
      { label: 'Customer SLA', value: `${avgSla}%`, icon: Target, trend: 'up' as const, trendValue: '+2% improvement', color: 'info' as const },
    ];
  }, []);

  // Summary KPI chips
  const summaryChips = [
    { label: 'Tasks Due', value: '3', color: 'bg-[#ef4444]/15 text-[#ef4444]' },
    { label: 'Approvals', value: '2', color: 'bg-[#f59e0b]/15 text-[#f59e0b]' },
    { label: 'At-Risk Projects', value: '1', color: 'bg-[#ef4444]/15 text-[#ef4444]' },
    { label: 'Team Utilization', value: '87%', color: 'bg-[#10b981]/15 text-[#10b981]' },
  ];

  const quickActions = [
    { label: 'Create Project', icon: FolderKanban, action: () => openCreateModal('project'), accent: '#cc5c37' },
    { label: 'Add Employee', icon: UserPlus, action: () => openCreateModal('employee'), accent: '#3b82f6' },
    { label: 'Run Payroll', icon: Banknote, action: () => navigateTo('payroll'), accent: '#10b981' },
    { label: 'Generate Report', icon: FileText, action: () => navigateTo('ai-ops'), accent: '#8b5cf6' },
  ];

  return (
    <PageShell title="Dashboard" icon={LayoutDashboard} subtitle="Operations overview">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* ── Row 1: Today Summary ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5 md:p-6 relative overflow-hidden"
        >
          {/* Gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#cc5c37] via-[#f59e0b] to-[#cc5c37]" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--app-accent-light)] flex items-center justify-center">
                <Brain className="w-[18px] h-[18px] text-[var(--app-accent)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--app-text)]">Today&apos;s Summary</h2>
                <p className="text-[11px] text-[var(--app-text-muted)]">{today}</p>
              </div>
            </div>
            <Badge className="bg-[var(--app-accent-light)] text-[var(--app-accent)] border-0 text-[11px] font-medium gap-1 self-start">
              <Sparkles className="w-3 h-3" /> AI Generated
            </Badge>
          </div>

          <p className="text-[13px] leading-relaxed text-[var(--app-text-secondary)] mb-5 max-w-3xl">
            You have 3 overdue tasks, 2 pending approvals, and 1 project at risk. Revenue pipeline is at $2.76M with 35% win rate.
            Team utilization is strong at 87%, but Nikhil Das is at 100% allocation — consider rebalancing.
          </p>

          <div className="flex flex-wrap gap-2">
            {summaryChips.map((chip) => (
              <div
                key={chip.label}
                className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium', chip.color)}
              >
                <span>{chip.value}</span>
                <span className="opacity-60">{chip.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Row 2: KPI Widgets ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {kpis.map((kpi, i) => (
            <KpiWidget
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              color={kpi.color}
              className="delay-0"
            />
          ))}
        </div>

        {/* ── Row 3: Pipeline Chart + Risk Alerts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Pipeline Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Project Pipeline</span>
              </div>
              <span className="text-[10px] text-[var(--app-text-muted)]">By status</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineData} barSize={48} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-hover-bg)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--app-text-muted)' }}
                  axisLine={{ stroke: 'var(--app-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--app-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--app-hover-bg)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Right: Risk Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Risk Alerts</span>
              </div>
              <Badge className="bg-[#ef4444]/15 text-[#ef4444] border-0 text-[10px]">
                {riskAlerts.filter(a => a.severity === 'critical').length} critical
              </Badge>
            </div>

            <div className="space-y-3 flex-1">
              {riskAlerts.map((alert, i) => (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className={cn(
                    'rounded-xl border p-3 cursor-pointer transition-colors hover:bg-[var(--app-hover-bg)]',
                    'border-[var(--app-border)]',
                    alert.severity === 'critical' ? 'border-l-[3px] border-l-[#ef4444]' : 'border-l-[3px] border-l-[#f59e0b]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn(
                        'text-[10px] px-1.5 py-0 border-0 font-medium',
                        alert.severity === 'critical'
                          ? 'bg-[#ef4444]/15 text-[#ef4444]'
                          : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      )}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-[12px] font-medium text-[var(--app-text)] truncate">{alert.title}</span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--app-text-muted)]">{alert.affected}</span>
                    <button className="text-[11px] text-[var(--app-accent)] font-medium hover:text-[var(--app-accent)]/80 flex items-center gap-1">
                      {alert.action} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => navigateTo('ai-ops')}
              className="mt-3 text-[12px] text-[var(--app-text-muted)] hover:text-[var(--app-accent)] transition-colors text-center py-2 border-t border-[var(--app-border)]"
            >
              View All Alerts →
            </button>
          </motion.div>
        </div>

        {/* ── Row 4: AI Recommendations + Activity Feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">AI Recommendations</span>
              </div>
              <Badge className="bg-[var(--app-accent-light)] text-[var(--app-accent)] border-0 text-[10px]">
                3 insights
              </Badge>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    className="rounded-xl border border-[var(--app-border)] bg-[var(--app-hover-bg)] p-4 flex gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[var(--app-accent-light)] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[var(--app-accent)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[var(--app-text)] mb-0.5">{rec.title}</p>
                      <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[var(--app-text-muted)]">
                          Confidence: <span className="text-[#10b981]">{rec.confidence}%</span>
                        </span>
                        <button className="text-[11px] text-[var(--app-accent)] font-medium hover:text-[var(--app-accent)]/80 flex items-center gap-1">
                          {rec.action} <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Recent Activity</span>
              </div>
              <Badge className="bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] border-0 text-[10px]">
                Last 6 hours
              </Badge>
            </div>
            <ActivityFeed activities={recentActivities} maxItems={6} />
          </motion.div>
        </div>

        {/* ── Row 5: Quick Actions ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <motion.button
                key={qa.label}
                variants={item}
                onClick={qa.action}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-4 text-left transition-all duration-200 hover:bg-[var(--app-hover-bg)] hover:border-[var(--app-border-strong)] group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${qa.accent}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: qa.accent }} />
                </div>
                <p className="text-[13px] font-medium text-[var(--app-text)] group-hover:text-white">{qa.label}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)] transition-colors">
                  <span>Get started</span>
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </PageShell>
  );
}

export default memo(ErpDashboardPageInner);
