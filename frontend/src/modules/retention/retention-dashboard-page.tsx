'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, Shield, Users, ArrowDownRight, ArrowUpRight,
  Heart, RefreshCw, Star, UserPlus, IndianRupee, AlertTriangle,
  TrendingUp, Activity, ChevronRight, Rocket, Zap, Target,
  CircleAlert, AlertCircle, BarChart3, Flame, SmilePlus,
  Megaphone, Handshake, Gift, MessageSquare, Navigation,
  PieChart, LineChart
} from 'lucide-react';
import {
  retentionDashboardStats, retentionAlerts, cohortData, ltvForecasts
} from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { RetentionPage } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  critical: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  info: { icon: AlertCircle, color: 'text-sky-500', bg: 'bg-sky-500/10' },
};

export default function RetentionDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const stats = retentionDashboardStats;

  const churnTrend = useMemo(() => [
    { month: 'Nov', value: 8.2 },
    { month: 'Dec', value: 7.5 },
    { month: 'Jan', value: 7.8 },
    { month: 'Feb', value: 7.1 },
    { month: 'Mar', value: 7.4 },
    { month: 'Apr', value: 6.8 },
  ], []);

  const renewalTrend = useMemo(() => [
    { month: 'Nov', value: 86 },
    { month: 'Dec', value: 88 },
    { month: 'Jan', value: 89 },
    { month: 'Feb', value: 87 },
    { month: 'Mar', value: 90 },
    { month: 'Apr', value: 91.2 },
  ], []);

  const cohortMini = useMemo(() => cohortData.slice(-4).map((c) => ({
    cohort: c.cohort,
    m1: c.retention[1],
    m2: c.retention[2],
  })), []);

  const ltvGrowth = useMemo(() => ltvForecasts.map((f) => ({
    segment: f.segment.split(' (')[0].slice(0, 12),
    current: f.currentLTV,
    predicted: f.predictedLTV,
  })), []);

  const npsTrend = useMemo(() => [
    { month: 'Nov', value: 58 },
    { month: 'Dec', value: 61 },
    { month: 'Jan', value: 64 },
    { month: 'Feb', value: 62 },
    { month: 'Mar', value: 66 },
    { month: 'Apr', value: 68 },
  ], []);

  const kpiStats = useMemo(() => [
    { label: 'Active Customers', value: stats.activeCustomers.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 5.2, changeLabel: 'growing steadily' },
    { label: 'Churn Rate', value: `${stats.churnRate}%`, icon: Flame, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: -8.1, changeLabel: 'improved from 7.4%' },
    { label: 'Renewal Rate', value: `${stats.renewalRate}%`, icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 2.3, changeLabel: 'on-track target 92%' },
    { label: 'Repeat Purchase', value: `${stats.repeatPurchaseRate}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 4.1, changeLabel: 'healthy retention' },
    { label: 'Avg LTV', value: formatINR(stats.avgLTV), icon: IndianRupee, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: 12.6, changeLabel: 'strong growth' },
    { label: 'NPS', value: stats.nps.toString(), icon: Star, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: 6.3, changeLabel: 'detractors reduced' },
    { label: 'Referral Growth', value: `${stats.referralGrowth}%`, icon: UserPlus, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 8.5, changeLabel: 'advocacy up' },
    { label: 'Expansion Rev', value: formatINR(stats.expansionRevenue), icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 15.2, changeLabel: 'upsell performing' },
    { label: 'Health Score', value: stats.avgHealthScore.toString(), icon: Heart, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 3.4, changeLabel: 'avg across 248' },
    { label: 'At-Risk Accounts', value: stats.atRiskAccounts.toString(), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: -12.0, changeLabel: 'needs attention', severity: 'warning' as const },
  ], [isDark, stats]);

  const quickNavItems: { label: string; value: string; page: RetentionPage; icon: React.ElementType; color: string }[] = [
    { label: 'Customer Health', value: `${stats.avgHealthScore}/100`, page: 'customer-health', icon: Heart, color: 'text-rose-400' },
    { label: 'Churn Risk', value: `${stats.atRiskAccounts} at risk`, page: 'churn-risk', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Renewal Center', value: `${formatINR(stats.expansionRevenue)}`, page: 'renewal-center', icon: RefreshCw, color: 'text-emerald-400' },
    { label: 'Win-back', value: '6 campaigns', page: 'winback-campaigns', icon: Megaphone, color: 'text-amber-400' },
    { label: 'Upsell/Cross-sell', value: '8 opportunities', page: 'upsell-crosssell', icon: Zap, color: 'text-violet-400' },
    { label: 'Loyalty Program', value: '248 members', page: 'loyalty-program', icon: Gift, color: 'text-amber-400' },
    { label: 'Referral Growth', value: `${stats.referralGrowth}%`, page: 'referral-growth', icon: UserPlus, color: 'text-sky-400' },
    { label: 'Feedback & NPS', value: `NPS ${stats.nps}`, page: 'feedback-nps', icon: MessageSquare, color: 'text-emerald-400' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <Shield className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Retention Dashboard</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>LTV Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Calendar className="w-4 h-4" />
              {today}
            </Badge>
            <Button
              onClick={() => navigateTo('winback-campaigns')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Rocket className="w-4 h-4" />
              Launch Campaign
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => {
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200',
                  stat.severity === 'warning'
                    ? (isDark ? 'bg-red-500/[0.04] border-red-500/20 hover:bg-red-500/[0.07]' : 'bg-red-50 border-red-200 hover:bg-red-100')
                    : ('bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </span>
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-medium',
                    isPositive ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                  {stat.changeLabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row 1 — Churn Trend & Renewal Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Churn Trend</span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last 6 months</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {churnTrend.map((entry, j) => {
                const maxVal = Math.max(...churnTrend.map((e) => e.value));
                return (
                  <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.value}%</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.value / maxVal) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('w-full rounded-t-sm', isDark ? 'bg-red-500/30' : 'bg-red-400')}
                    />
                    <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Renewal Trend</span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last 6 months</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {renewalTrend.map((entry, j) => {
                const maxVal = Math.max(...renewalTrend.map((e) => e.value));
                return (
                  <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.value}%</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(entry.value / maxVal) * 100}%` }}
                      transition={{ delay: 0.4 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('w-full rounded-t-sm', 'bg-[var(--app-success)]')}
                    />
                    <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 — Cohort Retention & LTV Growth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Cohort Retention (M1 → M2)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-success)]')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>M1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', isDark ? 'bg-amber-500/50' : 'bg-amber-400')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>M2</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {cohortMini.map((c, j) => (
                <div key={j} className="flex items-center gap-3">
                  <span className={cn('text-[10px] w-16 shrink-0 font-medium', 'text-[var(--app-text-muted)]')}>{c.cohort}</span>
                  <div className="flex-1 flex gap-1 items-center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.m1}%` }}
                      transition={{ delay: 0.5 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-success)]')}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.m2}%` }}
                      transition={{ delay: 0.55 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-warning)]')}
                    />
                  </div>
                  <span className={cn('text-[10px] w-8 text-right font-medium', 'text-[var(--app-text-muted)]')}>{c.m2}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IndianRupee className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>LTV Growth</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', 'bg-[var(--app-success)]')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-[var(--app-radius-sm)]', isDark ? 'bg-violet-500/50' : 'bg-violet-400')} />
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Predicted</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {ltvGrowth.map((entry, j) => {
                const maxVal = Math.max(...ltvGrowth.map((e) => e.predicted), 1);
                return (
                  <div key={j} className="flex-1 flex flex-col justify-end items-center gap-0.5">
                    <div className="flex gap-0.5 w-full items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.current / maxVal) * 100}%` }}
                        transition={{ delay: 0.5 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', 'bg-[var(--app-success)]')}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(entry.predicted / maxVal) * 100}%` }}
                        transition={{ delay: 0.55 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('flex-1 rounded-t-sm', isDark ? 'bg-violet-500/30' : 'bg-violet-400')}
                      />
                    </div>
                    <span className={cn('text-[8px] mt-1 text-center', 'text-[var(--app-text-disabled)]')}>{entry.segment}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* NPS Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>NPS Trend</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-success-bg)] text-[var(--app-success)]')}>
              NPS {stats.nps} — Good
            </Badge>
          </div>
          <div className="flex items-end gap-2 h-32">
            {npsTrend.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.value}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.value / 100) * 100}%` }}
                  transition={{ delay: 0.55 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', 'bg-[var(--app-warning)]')}
                />
                <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Active Alerts</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
              {retentionAlerts.length} alerts
            </Badge>
          </div>
          <div className="space-y-2">
            {retentionAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity] || severityConfig.info;
              const AlertIcon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.05, duration: 0.3 }}
                  onClick={() => alert.actionPage && navigateTo(alert.actionPage as RetentionPage)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-[var(--app-radius-lg)] border transition-colors cursor-pointer',
                    'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <AlertIcon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate">{alert.title}</p>
                      <span className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                      )} />
                    </div>
                    <p className={cn('text-xs leading-relaxed', 'text-[var(--app-text-muted)]')}>
                      {alert.description}
                    </p>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', 'text-[var(--app-text-disabled)]')} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Navigation className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Quick Navigation</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickNavItems.map((nav, i) => (
              <motion.button
                key={nav.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigateTo(nav.page)}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 text-left transition-colors duration-200 group',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <nav.icon className={cn('w-5 h-5', nav.color, 'opacity-60')} />
                  <ChevronRight className={cn(
                    'w-4 h-4 transition-transform group-hover:translate-x-1',
                    'text-[var(--app-text-disabled)]'
                  )} />
                </div>
                <p className="text-xl font-bold mt-3">{nav.value}</p>
                <p className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                  {nav.label}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
