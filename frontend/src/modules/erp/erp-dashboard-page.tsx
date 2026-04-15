'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Calendar, AlertTriangle, Clock, DollarSign, Users, TrendingUp,
  Activity, Target, UserX, Flame, BarChart3, PieChart, LineChart,
  AreaChart, GitBranch, ChevronRight, Zap, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockProjects, mockTasks, mockApprovals, mockInvoices, mockPayroll, mockResources, erpDashboardStats } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { ErpPage } from '@/modules/erp/types';

const chartConfigs = [
  { title: 'Project Completion Trend', icon: LineChart, color: 'emerald' },
  { title: 'Workload Heatmap', icon: BarChart3, color: 'amber' },
  { title: 'Invoice Collections', icon: PieChart, color: 'blue' },
  { title: 'Profitability by Client', icon: AreaChart, color: 'violet' },
  { title: 'Team Utilization Graph', icon: BarChart3, color: 'cyan' },
  { title: 'Leave Trend Chart', icon: LineChart, color: 'rose' },
];

const alerts = [
  { icon: AlertTriangle, severity: 'critical', title: 'MediCare Portal — 18 days overdue', desc: 'Due date was Apr 1. Client escalation risk high. Budget exceeded by ₹30,000.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Clock, severity: 'warning', title: 'FinEdge Trading — Blocked on risk module', desc: 'Dependency on payment gateway integration. 2 tasks waiting since 5 days.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: DollarSign, severity: 'warning', title: 'April payroll processing pending', desc: '2 employees in pending state. Deadline Apr 25. Incentives batch needs CFO approval.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Flame, severity: 'critical', title: '₹6.60L unpaid — MediCare + LegalEase', desc: '2 invoices overdue by 10+ days. Auto-reminder sent 3 times. LegalEase invoice rejected.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Users, severity: 'info', title: 'Vikram Joshi overbooked at 95% allocation', desc: 'Assigned to ShopVerse (60%) and RetailPro (35%). Only 5% available capacity.', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: TrendingUp, severity: 'warning', title: 'LegalEase profitability at -8.5%', desc: 'Project completed over budget by ₹80,000. Margin negative. Review resource costs.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function getBarColor(variant: string, isDark: boolean) {
  switch (variant) {
    case 'emerald': return isDark ? 'bg-emerald-500/30' : 'bg-emerald-400';
    case 'amber': return isDark ? 'bg-amber-500/30' : 'bg-amber-400';
    case 'blue': return isDark ? 'bg-blue-500/30' : 'bg-blue-400';
    case 'violet': return isDark ? 'bg-violet-500/30' : 'bg-violet-400';
    case 'cyan': return isDark ? 'bg-cyan-500/30' : 'bg-cyan-400';
    case 'rose': return isDark ? 'bg-rose-500/30' : 'bg-rose-400';
    default: return isDark ? 'bg-white/20' : 'bg-black/20';
  }
}

export default function ErpDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useErpStore((s) => s.navigateTo);

  const stats = useMemo(() => {
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const overdueTasks = mockTasks.filter(t => {
      const due = new Date(t.dueDate);
      return due < new Date() && t.stage !== 'done';
    }).length;
    const pendingApprovals = mockApprovals.filter(a => a.status === 'pending' || a.status === 'escalated').length;
    const invoiceDue = mockInvoices.filter(i => i.status === 'overdue' || i.status === 'sent').length;
    const payrollThisMonth = mockPayroll.filter(p => p.month === '2026-04').length;
    const teamUtilization = Math.round(mockResources.reduce((sum, r) => sum + r.utilization, 0) / mockResources.length);
    const avgProfitability = Math.round(mockProjects.reduce((sum, p) => sum + p.profitability, 0) / mockProjects.filter(p => p.profitability > 0).length * 10) / 10;
    const deliverySla = Math.round(mockProjects.filter(p => p.status === 'active' || p.status === 'completed').reduce((sum, p) => sum + p.sla, 0) / mockProjects.filter(p => p.status === 'active' || p.status === 'completed').length * 10) / 10;
    const attendance = 93.2;
    const burnoutRisk = mockResources.filter(r => r.allocation >= 90).length;

    return [
      { label: 'Active Projects', value: activeProjects, icon: GitBranch, color: 'text-emerald-400', bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', subLabel: `of ${mockProjects.length} total` },
      { label: 'Overdue Tasks', value: overdueTasks, icon: Clock, color: 'text-red-400', bgColor: isDark ? 'bg-red-500/10' : 'bg-red-50', subLabel: 'past deadline' },
      { label: 'Pending Approvals', value: pendingApprovals, icon: Shield, color: 'text-amber-400', bgColor: isDark ? 'bg-amber-500/10' : 'bg-amber-50', subLabel: 'action needed' },
      { label: 'Invoice Due', value: invoiceDue, icon: DollarSign, color: 'text-orange-400', bgColor: isDark ? 'bg-orange-500/10' : 'bg-orange-50', subLabel: 'pending payment' },
      { label: 'Payroll This Month', value: payrollThisMonth, icon: Users, color: 'text-sky-400', bgColor: isDark ? 'bg-sky-500/10' : 'bg-sky-50', subLabel: 'April 2026' },
      { label: 'Team Utilization', value: `${teamUtilization}%`, icon: Activity, color: teamUtilization > 80 ? 'text-amber-400' : 'text-emerald-400', bgColor: teamUtilization > 80 ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50') : (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'), subLabel: 'avg across team' },
      { label: 'Profitability', value: `${avgProfitability}%`, icon: TrendingUp, color: avgProfitability > 15 ? 'text-emerald-400' : 'text-orange-400', bgColor: avgProfitability > 15 ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50') : (isDark ? 'bg-orange-500/10' : 'bg-orange-50'), subLabel: 'average margin' },
      { label: 'Delivery SLA', value: `${deliverySla}%`, icon: Target, color: deliverySla > 90 ? 'text-emerald-400' : 'text-red-400', bgColor: deliverySla > 90 ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50') : (isDark ? 'bg-red-500/10' : 'bg-red-50'), subLabel: 'target: 95%' },
      { label: 'Attendance', value: `${attendance}%`, icon: Users, color: 'text-emerald-400', bgColor: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', subLabel: 'this week' },
      { label: 'Burnout Risk', value: burnoutRisk, icon: UserX, color: burnoutRisk > 2 ? 'text-red-400' : 'text-orange-400', bgColor: burnoutRisk > 2 ? (isDark ? 'bg-red-500/10' : 'bg-red-50') : (isDark ? 'bg-orange-500/10' : 'bg-orange-50'), subLabel: 'over 90% allocated' },
    ];
  }, [isDark]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const barHeights = [35, 55, 72, 48, 90, 65, 80, 42, 68, 85, 58, 73];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}>
              <Zap className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">ERP Dashboard</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Executive operations cockpit</p>
            </div>
          </div>
          <Badge variant="secondary" className={cn(
            'px-3 py-1.5 text-xs font-medium gap-1.5',
            isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
          )}>
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </Badge>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4 cursor-pointer transition-all duration-200',
                isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  {stat.label}
                </span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bgColor)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
                {stat.subLabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartConfigs.map((chart, i) => (
            <motion.div
              key={chart.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-5',
                isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <chart.icon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                    {chart.title}
                  </span>
                </div>
                <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Last 30 days</span>
              </div>
              <div className="flex items-end gap-1.5 h-32">
                {barHeights.map((h, j) => (
                  <div key={j} className="flex-1 flex flex-col justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'rounded-t-sm min-w-0 transition-colors',
                        getBarColor(chart.color, isDark)
                      )}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-600')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Active Alerts</span>
            </div>
            <Badge variant="secondary" className={cn(
              'text-[10px]',
              isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'
            )}>
              {alerts.length} alerts
            </Badge>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer',
                  isDark
                    ? 'border-white/[0.04] hover:bg-white/[0.03]'
                    : 'border-black/[0.04] hover:bg-black/[0.02]'
                )}
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', alert.bg)}>
                  <alert.icon className={cn('w-4 h-4', alert.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <span className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                    )} />
                  </div>
                  <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
                    {alert.desc}
                  </p>
                </div>
                <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', isDark ? 'text-white/15' : 'text-black/15')} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Projects', value: mockProjects.length, page: 'projects' as ErpPage, icon: GitBranch },
            { label: 'Tasks Board', value: mockTasks.length, page: 'tasks-board' as ErpPage, icon: Activity },
            { label: 'Approvals', value: mockApprovals.filter(a => a.status === 'pending').length, page: 'approvals' as ErpPage, icon: Shield },
            { label: 'Invoices', value: mockInvoices.length, page: 'invoices' as ErpPage, icon: DollarSign },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                isDark
                  ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                  : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', isDark ? 'text-white/30' : 'text-black/30')} />
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform group-hover:translate-x-1',
                  isDark ? 'text-white/15' : 'text-black/15'
                )} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                {nav.label}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
