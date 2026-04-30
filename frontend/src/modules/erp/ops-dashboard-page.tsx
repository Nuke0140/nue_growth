'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard } from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import {
  IndianRupee,
  FolderKanban,
  Users,
  ShieldCheck,
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
  Sparkles,
  X,
  Check,
  ArrowRight,
  CircleAlert,
  ExternalLink,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Tooltip,
  Cell,
} from 'recharts';

import { KpiWidget } from '@/modules/erp/components/ops/kpi-widget';
import { ActivityFeed } from '@/modules/erp/components/ops/activity-feed';
import { OpsCard } from '@/modules/erp/components/ops/app-card';

import { mockProjects, mockAiInsights } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';

import type { LucideIcon } from 'lucide-react';
import type { AiOpsSeverity } from '@/modules/erp/types';

// ── Helpers ──────────────────────────────────────────────────────────

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

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

const ACCENT = '#cc5c37';

const severityIconMap: Record<AiOpsSeverity, LucideIcon> = {
  critical: CircleAlert,
  high: AlertTriangle,
  medium: TrendingUp,
  low: Activity,
};

const severityColorMap: Record<AiOpsSeverity, string> = {
  critical: '#f87171',
  high: '#fbbf24',
  medium: '#60a5fa',
  low: '#94a3b8',
};

// ── Mock Data ────────────────────────────────────────────────────────

// Monthly Revenue Trend (last 6 months)
const revenueTrendData = [
  { month: 'Nov', revenue: 28 },
  { month: 'Dec', revenue: 32 },
  { month: 'Jan', revenue: 35 },
  { month: 'Feb', revenue: 31 },
  { month: 'Mar', revenue: 38 },
  { month: 'Apr', revenue: 39 },
];

// Project Progress Bar Chart (top 6 active projects)
const projectProgressData = mockProjects
  .filter((p) => p.status === 'active')
  .sort((a, b) => b.progress - a.progress)
  .slice(0, 6)
  .map((p) => ({
    name: p.name
      .replace(/\s+(Digital Transformation|E-Commerce Platform|Patient Portal|Fleet Management|IoT Dashboard|Trading Platform|POS System|SaaS Monthly Retainer|Farm Analytics)$/i, '')
      .trim()
      .split(' ')
      .slice(0, 2)
      .join(' '),
    progress: p.progress,
    remaining: 100 - p.progress,
    health: p.health,
  }));

// Today Summary items
const todaySummaryItems = [
  {
    label: 'Absent Today',
    value: '2 employees',
    detail: 'Sneha Reddy, Meera Patel — on leave',
    ok: false,
  },
  {
    label: 'Overdue Tasks',
    value: '3 tasks',
    detail: 'Tasks past due date',
    ok: false,
  },
  {
    label: 'Pending Approvals',
    value: '3 awaiting',
    detail: 'Requires action',
    ok: false,
  },
  {
    label: 'Upcoming Deadlines',
    value: '2 milestones',
    detail: 'Due this week',
    ok: true,
  },
];

// Risk Alerts
const riskAlerts = [
  {
    title: 'MediCare Project',
    detail: 'Budget over by 3.2%',
    severity: 'amber' as const,
  },
  {
    title: 'FinEdge Platform',
    detail: 'SLA dropped to 82%',
    severity: 'red' as const,
  },
  {
    title: 'CloudOps Vendor',
    detail: 'SLA degradation to 78%',
    severity: 'red' as const,
  },
];

// Activity Feed data
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
    description: 'Risk management algorithm blocked on dependency',
    time: '6 hours ago',
    color: '#f87171',
  },
  {
    id: '5',
    icon: Package,
    title: 'Asset assigned',
    description: 'MacBook Pro M3 assigned to Nikhil Das',
    time: '1 day ago',
    color: ACCENT,
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

// ── Custom Recharts Tooltip ──────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{
        backgroundColor: 'var(--app-card-bg)',
        border: '1px solid var(--app-border-strong)',
        color: 'var(--app-text)',
      }}
    >
      <p className="font-semibold" style={{ color: 'var(--app-text)' }}>{label}</p>
      <p style={{ color: ACCENT }}>₹{payload[0].value}L</p>
    </div>
  );
}

// ── Animation Variants ───────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// ══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════

function OpsDashboardPageInner() {
  // We import the store to stay wired into the ERP ecosystem
  useErpStore((s) => s.currentPage);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <PageShell title="Operations Dashboard" icon={LayoutDashboard}>
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

      {/* ══════════════════════════════════════════════════════════
          ROW 1 — KPI CARDS (4 across full width)
          ══════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiWidget
            label="Total Revenue"
            value="₹38,57,500"
            icon={IndianRupee}
            color="success"
            trend="up"
            trendValue="+12% vs last quarter"
          />
          <KpiWidget
            label="Active Projects"
            value={8}
            icon={FolderKanban}
            color="info"
            trend="up"
            trendValue="+2 this month"
          />
          <KpiWidget
            label="Team Utilization"
            value="84%"
            icon={Users}
            color="warning"
            trend="down"
            trendValue="-3% from last month"
          />
          <KpiWidget
            label="Pending Approvals"
            value={3}
            icon={ShieldCheck}
            color="accent"
            trend="up"
            trendValue="urgent"
          />
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          ROW 2 — LEFT: Charts (2/3) | RIGHT: Today Summary + Risk Alerts (1/3)
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* ── Left: Charts Section (2/3) ──────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Project Progress Bar Chart */}
          <OpsCard
            title="Project Progress"
            subtitle="Active projects by completion %"
          >
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectProgressData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                  barCategoryGap="25%"
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--app-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload as { name: string; progress: number };
                      return (
                        <div
                          className="px-3 py-2 rounded-lg text-xs"
                          style={{
                            backgroundColor: 'var(--app-card-bg)',
                            border: '1px solid var(--app-border-strong)',
                            color: 'var(--app-text)',
                          }}
                        >
                          <p className="font-semibold">{d.name}</p>
                          <p style={{ color: ACCENT }}>{d.progress}% complete</p>
                        </div>
                      );
                    }}
                    cursor={{ fill: 'var(--app-hover-bg)' }}
                  />
                  <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={18}>
                    {projectProgressData.map((entry, idx) => {
                      const colorMap: Record<string, string> = {
                        excellent: '#34d399',
                        good: '#60a5fa',
                        'at-risk': '#fbbf24',
                        critical: '#f87171',
                      };
                      return (
                        <Cell
                          key={idx}
                          fill={colorMap[entry.health] || ACCENT}
                          fillOpacity={0.9}
                        />
                      );
                    })}
                  </Bar>
                  <Bar
                    dataKey="remaining"
                    stackId="stack"
                    fill="var(--app-border)"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </OpsCard>

          {/* Monthly Revenue Trend */}
          <OpsCard
            title="Monthly Revenue Trend"
            subtitle="Last 6 months (in Lakhs)"
          >
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueTrendData}
                  margin={{ top: 4, right: 16, bottom: 0, left: -12 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--app-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `₹${v}L`}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: ACCENT, stroke: 'var(--app-bg)', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </OpsCard>
        </div>

        {/* ── Right: Today Summary + Risk Alerts (1/3) ───────── */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Today Summary */}
          <OpsCard title="Today Summary" badge="Live">
            <div className="flex flex-col gap-3">
              {todaySummaryItems.map((item, idx) => {
                const Icon = item.ok ? Check : X;
                const iconColor = item.ok ? '#34d399' : '#f87171';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.06 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg"
                    style={{
                      backgroundColor: 'var(--app-hover-bg)',
                      border: '1px solid var(--app-border)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                      style={{ backgroundColor: `${iconColor}14` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: 'var(--app-text)' }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[11px] font-medium mt-0.5"
                        style={{ color: iconColor }}
                      >
                        {item.value}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: 'var(--app-text-muted)' }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </OpsCard>

          {/* Risk Alerts */}
          <OpsCard
            title="Risk Alerts"
            badge="3 active"
          >
            <div className="flex flex-col gap-3">
              {riskAlerts.map((alert, idx) => {
                const dotColor =
                  alert.severity === 'red' ? '#f87171' : '#fbbf24';
                const bgColor =
                  alert.severity === 'red'
                    ? 'rgba(248, 113, 113, 0.06)'
                    : 'rgba(251, 191, 36, 0.06)';
                const borderColor =
                  alert.severity === 'red'
                    ? 'rgba(248, 113, 113, 0.15)'
                    : 'rgba(251, 191, 36, 0.15)';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.07 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer"
                    style={{
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {/* Severity dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: 'var(--app-text)' }}
                      >
                        {alert.title}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: dotColor }}
                      >
                        {alert.detail}
                      </p>
                    </div>
                    {/* View link */}
                    <span
                      className="text-[11px] font-medium shrink-0 hover:underline"
                      style={{ color: ACCENT }}
                    >
                      View
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </OpsCard>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          ROW 3 — LEFT: Activity Feed (1/2) | RIGHT: AI Intelligence Panel (1/2)
          ══════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* ── Left: Activity Feed ─────────────────────────────── */}
        <OpsCard
          title="Recent Activity"
          badge="7 new"
          className="h-full"
        >
          <ActivityFeed activities={activities} maxItems={7} />
        </OpsCard>

        {/* ── Right: AI Intelligence Panel ───────────────────── */}
        <div className="app-card app-glow p-6 h-full flex flex-col">
          {/* Section header with Sparkles */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: 'var(--app-accent-light)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: ACCENT }} />
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--app-text)' }}
              >
                AI Intelligence
              </h3>
              <p
                className="text-xs mt-0.5 truncate"
                style={{ color: 'var(--app-text-muted)' }}
              >
                Automated insights &amp; recommendations
              </p>
            </div>
          </div>

          {/* Insight Cards */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {mockAiInsights.slice(0, 3).map((insight, idx) => {
              const SeverityIcon = severityIconMap[insight.severity];
              const sevColor = severityColorMap[insight.severity];

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: idx * 0.08,
                    ease: 'easeOut',
                  }}
                  className="app-card-hover rounded-xl p-3.5 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--app-hover-bg)',
                    border: '1px solid var(--app-border)',
                  }}
                >
                  {/* Top row: severity icon + title + confidence badge */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5"
                      style={{ backgroundColor: `${sevColor}14` }}
                    >
                      <SeverityIcon
                        className="w-3.5 h-3.5"
                        style={{ color: sevColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="text-xs font-bold leading-snug"
                          style={{ color: 'var(--app-text)' }}
                        >
                          {insight.title}
                        </p>
                      </div>
                      {/* Confidence badge */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${sevColor}14`,
                            border: `1px solid ${sevColor}30`,
                          }}
                        >
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wide"
                            style={{ color: sevColor }}
                          >
                            {insight.severity}
                          </span>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: 'var(--app-hover-bg)',
                            color: 'var(--app-text-secondary)',
                          }}
                        >
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs mt-2 leading-relaxed line-clamp-2"
                    style={{
                      color: 'var(--app-text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {insight.description}
                  </p>

                  {/* View Details link */}
                  <div className="flex items-center gap-1 mt-2.5">
                    <ExternalLink className="w-3 h-3" style={{ color: ACCENT }} />
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: ACCENT }}
                    >
                      View Details
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
    </PageShell>
  );
}

export default memo(OpsDashboardPageInner);
