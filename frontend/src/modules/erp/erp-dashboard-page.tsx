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
import { useErpStore } from '@/modules/erp/erp-store';
import { KpiWidget } from '@/modules/erp/components/ops/kpi-widget';
import { ActivityFeed } from '@/modules/erp/components/ops/activity-feed';
import { LayoutDashboard } from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import type { ErpPage } from '@/modules/erp/types';
import { useDashboard, formatINR } from '@/modules/erp/hooks/use-erp-api';

// ── Stagger animation helper (fast, no lag) ──
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.02 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

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

// ── Revenue tooltip ──
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; fill: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--app-bg)] border border-[var(--app-border-strong)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-[var(--app-text)]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-[var(--app-text-secondary)]">{p.name}: {formatINR(p.value)}</p>
      ))}
    </div>
  );
}

// ── Main Component ──
function ErpDashboardPageInner() {
  const navigateTo = useErpStore((s) => s.navigateTo);
  const openCreateModal = useErpStore((s) => s.openCreateModal);
  const { data: dashboard, loading, error } = useDashboard();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const pipelineData = useMemo(() => {
    if (!dashboard) return [];
    return [
      { name: 'Excellent', value: dashboard.healthDistribution.excellent, fill: '#10b981' },
      { name: 'Good', value: dashboard.healthDistribution.good, fill: '#3b82f6' },
      { name: 'At Risk', value: dashboard.healthDistribution.atRisk, fill: '#f59e0b' },
      { name: 'Critical', value: dashboard.healthDistribution.critical, fill: '#ef4444' },
    ];
  }, [dashboard]);

  const kpis = useMemo(() => {
    if (!dashboard) return [];
    const k = dashboard.kpis;
    return [
      { label: 'Total Revenue', value: formatINR(k.totalRevenue), icon: DollarSign, trend: 'up' as const, trendValue: `₹${(k.collectedRevenue / 100000).toFixed(1)}L collected`, color: 'accent' as const },
      { label: 'Active Projects', value: k.activeProjects, icon: FolderKanban, trend: k.healthDistribution.critical > 0 ? 'down' as const : 'neutral' as const, trendValue: `${k.healthDistribution.critical} critical`, color: 'info' as const },
      { label: 'Team Size', value: k.totalEmployees, icon: Users, trend: 'up' as const, trendValue: 'Active employees', color: 'success' as const },
      { label: 'Pending Approvals', value: k.pendingApprovals, icon: Shield, trend: 'neutral' as const, trendValue: 'Needs attention', color: 'warning' as const },
      { label: 'Overdue Amount', value: formatINR(k.overdueAmount), icon: Clock, trend: k.overdueAmount > 0 ? 'down' as const : 'up' as const, trendValue: 'Outstanding invoices', color: 'danger' as const },
      { label: 'Avg Profitability', value: `${k.avgProfitability}%`, icon: Target, trend: k.avgProfitability > 15 ? 'up' as const : 'down' as const, trendValue: 'Across projects', color: 'info' as const },
    ];
  }, [dashboard]);

  const summaryChips = useMemo(() => {
    if (!dashboard) return [];
    const k = dashboard.kpis;
    return [
      { label: 'Active Deliveries', value: String(k.activeDeliveries), color: 'bg-[#3b82f6]/15 text-[#3b82f6]' },
      { label: 'Pending Approvals', value: String(k.pendingApprovals), color: 'bg-[#f59e0b]/15 text-[#f59e0b]' },
      { label: 'Critical Projects', value: String(k.healthDistribution.critical), color: 'bg-[#ef4444]/15 text-[#ef4444]' },
      { label: 'Active Vendors', value: String(k.activeVendors), color: 'bg-[#10b981]/15 text-[#10b981]' },
    ];
  }, [dashboard]);

  const quickActions = [
    { label: 'Create Project', icon: FolderKanban, action: () => openCreateModal('project'), accent: '#cc5c37' },
    { label: 'Add Employee', icon: UserPlus, action: () => openCreateModal('employee'), accent: '#3b82f6' },
    { label: 'Run Payroll', icon: Banknote, action: () => navigateTo('payroll'), accent: '#10b981' },
    { label: 'Generate Report', icon: FileText, action: () => navigateTo('ai-ops'), accent: '#8b5cf6' },
  ];

  // Risk alerts derived from dashboard data
  const riskAlerts = useMemo(() => {
    if (!dashboard) return [];
    const alerts = [];
    if (dashboard.kpis.overdueAmount > 0) {
      alerts.push({
        severity: 'critical' as const,
        title: `${formatINR(dashboard.kpis.overdueAmount)} overdue`,
        description: `Outstanding invoices need immediate attention. ${dashboard.healthDistribution.critical} project(s) in critical health.`,
        action: 'View Invoices',
      });
    }
    if (dashboard.healthDistribution.atRisk > 0) {
      alerts.push({
        severity: 'high' as const,
        title: `${dashboard.healthDistribution.atRisk} project(s) at risk`,
        description: 'Project health is declining. Review milestones and resource allocation.',
        action: 'Review Projects',
      });
    }
    if (dashboard.kpis.pendingApprovals > 0) {
      alerts.push({
        severity: 'high' as const,
        title: `${dashboard.kpis.pendingApprovals} approvals pending`,
        description: 'Pending approvals may block project progress and deliveries.',
        action: 'Review Approvals',
      });
    }
    if (dashboard.kpis.activeDeliveries > 3) {
      alerts.push({
        severity: 'medium' as const,
        title: `${dashboard.kpis.activeDeliveries} active deliveries`,
        description: 'Multiple deliveries in progress. Ensure SLA compliance.',
        action: 'Track Deliveries',
      });
    }
    return alerts;
  }, [dashboard]);

  // AI recommendations (derived from dashboard data)
  const aiRecommendations = useMemo(() => {
    if (!dashboard) return [];
    const recs = [];
    if (dashboard.kpis.avgProfitability < 15) {
      recs.push({
        icon: Target,
        title: 'Improve project profitability',
        description: `Average profitability is ${dashboard.kpis.avgProfitability}%. Consider renegotiating contracts for low-margin projects.`,
        confidence: 78,
        action: 'View Projects',
      });
    }
    if (dashboard.kpis.overdueAmount > 0) {
      recs.push({
        icon: DollarSign,
        title: 'Accelerate receivables collection',
        description: `${formatINR(dashboard.kpis.overdueAmount)} in overdue invoices. Send payment reminders and escalate where needed.`,
        confidence: 85,
        action: 'View Invoices',
      });
    }
    recs.push({
      icon: Users,
      title: 'Optimize resource allocation',
      description: 'Analyze team workload distribution to prevent burnout and improve utilization across projects.',
      confidence: 72,
      action: 'View Workload',
    });
    return recs;
  }, [dashboard]);

  // Activity feed from API data
  const recentActivities = useMemo(() => {
    if (!dashboard) return [];
    const iconMap: Record<string, typeof CheckCircle2> = {
      leave: Calendar,
      approval: Shield,
      task: CheckCircle2,
    };
    return dashboard.activities.map(a => ({
      id: a.id,
      icon: iconMap[a.type] || Activity,
      title: a.type === 'leave' ? 'Leave Request' : a.type === 'approval' ? 'Approval Update' : 'Activity',
      description: a.title,
      time: new Date(a.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      color: a.status === 'approved' ? '#10b981' : a.status === 'pending' ? '#f59e0b' : a.status === 'rejected' ? '#ef4444' : 'var(--app-accent)',
    }));
  }, [dashboard]);

  // Loading state
  if (loading) {
    return (
      <PageShell title="Dashboard" icon={LayoutDashboard} subtitle="Operations overview">
        <div className="space-y-6 max-w-[1600px] mx-auto">
          <div className="animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-6 h-40" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[var(--app-border)] bg-[var(--app-card-bg)] h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] h-64 lg:col-span-3" />
            <div className="animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] h-64 lg:col-span-2" />
          </div>
        </div>
      </PageShell>
    );
  }

  // Error state - fall back to empty dashboard
  if (error || !dashboard) {
    return (
      <PageShell title="Dashboard" icon={LayoutDashboard} subtitle="Operations overview">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="w-12 h-12 text-[var(--app-text-muted)] mb-4" />
          <p className="text-sm text-[var(--app-text-muted)] mb-2">Unable to load dashboard data</p>
          <p className="text-xs text-[var(--app-text-muted)]">Please ensure the database is seeded. Run: <code className="bg-[var(--app-hover-bg)] px-1.5 py-0.5 rounded">npx prisma db push && npx prisma db seed</code></p>
        </div>
      </PageShell>
    );
  }

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
              <Sparkles className="w-3 h-3" /> Live Data
            </Badge>
          </div>

          <p className="text-[13px] leading-relaxed text-[var(--app-text-secondary)] mb-5 max-w-3xl">
            You have {dashboard.kpis.pendingApprovals} pending approvals, {dashboard.healthDistribution.critical} project(s) in critical health,
            and {formatINR(dashboard.kpis.overdueAmount)} in overdue invoices.
            Revenue pipeline stands at {formatINR(dashboard.kpis.totalRevenue)} with {formatINR(dashboard.kpis.collectedRevenue)} collected.
            {dashboard.kpis.avgProfitability < 15 ? ' Profitability needs attention — consider reviewing project costs.' : ' Profitability is healthy across active projects.'}
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

        {/* ── Row 3: Revenue Chart + Risk Alerts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Revenue Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Revenue Trend</span>
              </div>
              <span className="text-[10px] text-[var(--app-text-muted)]">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dashboard.revenueByMonth} barSize={24} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--app-hover-bg)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: 'var(--app-text-muted)' }}
                  axisLine={{ stroke: 'var(--app-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'var(--app-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'var(--app-hover-bg)' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#cc5c37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Right: Risk Alerts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
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
              {riskAlerts.length > 0 ? riskAlerts.map((alert, i) => (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'rounded-xl border p-3 cursor-pointer transition-colors hover:bg-[var(--app-hover-bg)]',
                    'border-[var(--app-border)]',
                    alert.severity === 'critical' ? 'border-l-[3px] border-l-[#ef4444]' : alert.severity === 'high' ? 'border-l-[3px] border-l-[#f59e0b]' : 'border-l-[3px] border-l-[#3b82f6]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn(
                        'text-[10px] px-1.5 py-0 border-0 font-medium',
                        alert.severity === 'critical'
                          ? 'bg-[#ef4444]/15 text-[#ef4444]'
                          : alert.severity === 'high'
                          ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                          : 'bg-[#3b82f6]/15 text-[#3b82f6]'
                      )}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-[12px] font-medium text-[var(--app-text)] truncate">{alert.title}</span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed mb-2">{alert.description}</p>
                  <button className="text-[11px] text-[var(--app-accent)] font-medium hover:text-[var(--app-accent)]/80 flex items-center gap-1">
                    {alert.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              )) : (
                <div className="flex flex-col items-center py-8 text-[var(--app-text-muted)]">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-[#10b981]" />
                  <p className="text-xs">No active risk alerts</p>
                </div>
              )}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">AI Recommendations</span>
              </div>
              <Badge className="bg-[var(--app-accent-light)] text-[var(--app-accent)] border-0 text-[10px]">
                {aiRecommendations.length} insights
              </Badge>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Recent Activity</span>
              </div>
              <Badge className="bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] border-0 text-[10px]">
                Live
              </Badge>
            </div>
            {recentActivities.length > 0 ? (
              <ActivityFeed activities={recentActivities} maxItems={6} />
            ) : (
              <div className="flex flex-col items-center py-8 text-[var(--app-text-muted)]">
                <Activity className="w-8 h-8 mb-2" />
                <p className="text-xs">No recent activity</p>
              </div>
            )}
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
