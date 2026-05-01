'use client';

import React, { memo } from 'react';
import {
  Calendar, AlertTriangle, Clock, DollarSign, Users, TrendingUp,
  Activity, Target, Shield, FolderKanban,
  UserPlus, Banknote, FileText, Sparkles, ArrowRight, Brain,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useErpStore } from '@/modules/erp/erp-store';
import { KpiWidget } from '@/modules/erp/components/ops/kpi-widget';
import { ActivityFeed } from '@/modules/erp/components/ops/activity-feed';
import { LayoutDashboard } from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import { useDashboard, formatINR } from '@/modules/erp/hooks/use-erp-api';

// Simple tooltip - no heavy components
function SimpleTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; fill: string }>; label?: string }) {
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

// Optimized component - no heavy calculations
function ErpDashboardPageOptimized() {
  const navigateTo = useErpStore((s) => s.navigateTo);
  const openCreateModal = useErpStore((s) => s.openCreateModal);
  const { data: dashboard, loading, error } = useDashboard();

  // Simple date - no expensive formatting
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  // Quick actions - static, no calculations
  const quickActions = [
    { label: 'Create Project', icon: FolderKanban, action: () => openCreateModal('project'), accent: '#cc5c37' },
    { label: 'Add Employee', icon: UserPlus, action: () => openCreateModal('employee'), accent: '#3b82f6' },
    { label: 'Run Payroll', icon: Banknote, action: () => navigateTo('payroll'), accent: '#10b981' },
    { label: 'Generate Report', icon: FileText, action: () => navigateTo('ai-ops'), accent: '#8b5cf6' },
  ];

  // Loading state - simple, no animation
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
        </div>
      </PageShell>
    );
  }

  // Error state - simple fallback
  if (error || !dashboard) {
    return (
      <PageShell title="Dashboard" icon={LayoutDashboard} subtitle="Operations overview">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="w-12 h-12 text-[var(--app-text-muted)] mb-4" />
          <p className="text-sm text-[var(--app-text-muted)] mb-2">Unable to load dashboard data</p>
          <p className="text-xs text-[var(--app-text-muted)]">Please ensure the database is seeded</p>
        </div>
      </PageShell>
    );
  }

  // Simple KPI data - no useMemo, direct calculation
  const kpis = [
    { 
      label: 'Total Revenue', 
      value: formatINR(dashboard.kpis.totalRevenue), 
      icon: DollarSign, 
      trend: 'up' as const, 
      trendValue: `₹${(dashboard.kpis.collectedRevenue / 100000).toFixed(1)}L collected`, 
      color: 'accent' as const 
    },
    { 
      label: 'Active Projects', 
      value: dashboard.kpis.activeProjects, 
      icon: FolderKanban, 
      trend: dashboard.kpis.healthDistribution.critical > 0 ? 'down' as const : 'neutral' as const, 
      trendValue: `${dashboard.kpis.healthDistribution.critical} critical`, 
      color: 'info' as const 
    },
    { 
      label: 'Team Size', 
      value: dashboard.kpis.totalEmployees, 
      icon: Users, 
      trend: 'up' as const, 
      trendValue: 'Active employees', 
      color: 'success' as const 
    },
    { 
      label: 'Pending Approvals', 
      value: dashboard.kpis.pendingApprovals, 
      icon: Shield, 
      trend: 'neutral' as const, 
      trendValue: 'Needs attention', 
      color: 'warning' as const 
    },
    { 
      label: 'Overdue Amount', 
      value: formatINR(dashboard.kpis.overdueAmount), 
      icon: Clock, 
      trend: dashboard.kpis.overdueAmount > 0 ? 'down' as const : 'up' as const, 
      trendValue: 'Outstanding invoices', 
      color: 'danger' as const 
    },
    { 
      label: 'Avg Profitability', 
      value: `${dashboard.kpis.avgProfitability}%`, 
      icon: Target, 
      trend: dashboard.kpis.avgProfitability > 15 ? 'up' as const : 'down' as const, 
      trendValue: 'Across projects', 
      color: 'info' as const 
    },
  ];

  // Simple summary chips - no calculations
  const summaryChips = [
    { label: 'Active Deliveries', value: String(dashboard.kpis.activeDeliveries), color: 'bg-[#3b82f6]/15 text-[#3b82f6]' },
    { label: 'Pending Approvals', value: String(dashboard.kpis.pendingApprovals), color: 'bg-[#f59e0b]/15 text-[#f59e0b]' },
    { label: 'Critical Projects', value: String(dashboard.kpis.healthDistribution.critical), color: 'bg-[#ef4444]/15 text-[#ef4444]' },
    { label: 'Active Vendors', value: String(dashboard.kpis.activeVendors), color: 'bg-[#10b981]/15 text-[#10b981]' },
  ];

  // Simple risk alerts - no useMemo
  const riskAlerts = [];
  if (dashboard.kpis.overdueAmount > 0) {
    riskAlerts.push({
      severity: 'critical' as const,
      title: `${formatINR(dashboard.kpis.overdueAmount)} overdue`,
      description: 'Outstanding invoices need immediate attention.',
      action: 'View Invoices',
    });
  }
  if (dashboard.kpis.pendingApprovals > 0) {
    riskAlerts.push({
      severity: 'high' as const,
      title: `${dashboard.kpis.pendingApprovals} approvals pending`,
      description: 'Pending approvals may block project progress.',
      action: 'Review Approvals',
    });
  }

  // Simple activity data - no complex processing
  const recentActivities = dashboard.activities.slice(0, 6).map(a => ({
    id: a.id,
    icon: a.type === 'leave' ? Calendar : a.type === 'approval' ? Shield : Activity,
    title: a.type === 'leave' ? 'Leave Request' : a.type === 'approval' ? 'Approval Update' : 'Activity',
    description: a.title,
    time: new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    color: a.status === 'approved' ? '#10b981' : a.status === 'pending' ? '#f59e0b' : '#ef4444',
  }));

  return (
    <PageShell title="Dashboard" icon={LayoutDashboard} subtitle="Operations overview">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Row 1: Today Summary - No motion, instant render */}
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5 md:p-6 relative overflow-hidden">
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
            You have {dashboard.kpis.pendingApprovals} pending approvals and {dashboard.kpis.healthDistribution.critical} critical projects.
            Revenue pipeline: {formatINR(dashboard.kpis.totalRevenue)} with {formatINR(dashboard.kpis.collectedRevenue)} collected.
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
        </div>

        {/* Row 2: KPI Widgets - No stagger, instant render */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {kpis.map((kpi) => (
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

        {/* Row 3: Simple Revenue Chart + Risk Alerts - No heavy animations */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Simple Revenue Display - No heavy chart library */}
          <div className="lg:col-span-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Revenue Overview</span>
              </div>
              <span className="text-[10px] text-[var(--app-text-muted)]">Current Month</span>
            </div>
            
            {/* Simple revenue display - no heavy chart */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-[var(--app-hover-bg)]">
                <p className="text-2xl font-bold text-[var(--app-text)]">{formatINR(dashboard.kpis.totalRevenue)}</p>
                <p className="text-xs text-[var(--app-text-muted)]">Total Revenue</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[var(--app-hover-bg)]">
                <p className="text-2xl font-bold text-[#10b981]">{formatINR(dashboard.kpis.collectedRevenue)}</p>
                <p className="text-xs text-[var(--app-text-muted)]">Collected</p>
              </div>
            </div>
          </div>

          {/* Risk Alerts - Simple, no animations */}
          <div className="lg:col-span-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Risk Alerts</span>
              </div>
              <Badge className="bg-[#ef4444]/15 text-[#ef4444] border-0 text-[10px]">
                {riskAlerts.filter(a => a.severity === 'critical').length} critical
              </Badge>
            </div>

            <div className="space-y-3">
              {riskAlerts.length > 0 ? riskAlerts.map((alert) => (
                <div
                  key={alert.title}
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
                  <button className="text-[11px] text-[var(--app-accent)] font-medium hover:text-[var(--app-accent)]/80 flex items-center gap-1">
                    {alert.action} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )) : (
                <div className="flex flex-col items-center py-8 text-[var(--app-text-muted)]">
                  <AlertTriangle className="w-8 h-8 mb-2 text-[#10b981]" />
                  <p className="text-xs">No active risk alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Activity Feed - Simple, no animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Quick Stats</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-[var(--app-hover-bg)]">
                <p className="text-lg font-bold text-[var(--app-text)]">{dashboard.kpis.avgProfitability}%</p>
                <p className="text-xs text-[var(--app-text-muted)]">Avg Profitability</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-[var(--app-hover-bg)]">
                <p className="text-lg font-bold text-[var(--app-text)]">{dashboard.kpis.activeVendors}</p>
                <p className="text-xs text-[var(--app-text-muted)]">Active Vendors</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span className="text-sm font-semibold text-[var(--app-text)]">Recent Activity</span>
              </div>
            </div>
            {recentActivities.length > 0 ? (
              <ActivityFeed activities={recentActivities} maxItems={6} />
            ) : (
              <div className="flex flex-col items-center py-8 text-[var(--app-text-muted)]">
                <Activity className="w-8 h-8 mb-2" />
                <p className="text-xs">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Quick Actions - No animations, instant */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
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
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

export default memo(ErpDashboardPageOptimized);
