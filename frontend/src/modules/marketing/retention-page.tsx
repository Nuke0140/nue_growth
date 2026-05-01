'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { RetentionMetrics } from '@/modules/marketing/types';
import { mockRetentionMetrics } from '@/modules/marketing/data/mock-data';
import {
  Plus, Users, AlertTriangle, Bell, Heart, DollarSign,
  TrendingDown, TrendingUp, RefreshCw, Send, Calendar,
  ArrowUpRight, Shield, Clock, Activity, Mail, MessageSquare,
  BarChart3, Target, UserCheck,
} from 'lucide-react';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

const CHURN_RISK_CUSTOMERS = [
  { name: 'Rajesh Kumar', lastActivity: '2026-03-15', daysInactive: 28, ltv: 245000, riskLevel: 'critical' },
  { name: 'Sunita Verma', lastActivity: '2026-03-20', daysInactive: 23, ltv: 182000, riskLevel: 'high' },
  { name: 'Amit Sharma', lastActivity: '2026-03-25', daysInactive: 18, ltv: 128000, riskLevel: 'high' },
  { name: 'Pooja Patel', lastActivity: '2026-04-01', daysInactive: 11, ltv: 96000, riskLevel: 'medium' },
  { name: 'Kiran Rao', lastActivity: '2026-04-02', daysInactive: 10, ltv: 64000, riskLevel: 'medium' },
];

const RENEWAL_ALERTS = [
  { customer: 'TechSolutions India', plan: 'Enterprise', date: '2026-04-18', daysLeft: 6, amount: 480000 },
  { customer: 'StartupXYZ Pvt Ltd', plan: 'Business', date: '2026-04-22', daysLeft: 10, amount: 144000 },
  { customer: 'Medicare Hospital', plan: 'Professional', date: '2026-04-28', daysLeft: 16, amount: 96000 },
  { customer: 'RetailPro E-Commerce', plan: 'Enterprise', date: '2026-05-05', daysLeft: 23, amount: 480000 },
];

const RETENTION_CAMPAIGNS = [
  {
    id: 'rc-01', name: 'Win-Back — 90-Day Inactive Users', status: 'active',
    channel: 'Email + WhatsApp', audience: '5,634 users', sent: 4200, engaged: 840, converted: 168,
  },
  {
    id: 'rc-02', name: 'Renewal Incentive — 15% Early Renewal', status: 'scheduled',
    channel: 'Email', audience: '324 renewals', sent: 0, engaged: 0, converted: 0,
  },
  {
    id: 'rc-03', name: 'Loyalty Rewards — Tier Upgrade Nudge', status: 'active',
    channel: 'WhatsApp', audience: '2,890 loyalty members', sent: 1890, engaged: 567, converted: 124,
  },
];

const RISK_STYLES: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-500/15 text-red-600' },
  high: { label: 'High', className: 'bg-orange-500/15 text-orange-600' },
  medium: { label: 'Medium', className: 'bg-amber-500/15 text-amber-600' },
  low: { label: 'Low', className: 'bg-green-500/15 text-green-600' },
};

function formatCurrency(val: number): string {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
}

function getCohortColor(rate: number): string {
  if (rate >= 80) return 'bg-green-500';
  if (rate >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function RetentionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reEngaged, setReEngaged] = useState<string[]>([]);

  const handleReEngage = (name: string) => {
    if (!reEngaged.includes(name)) setReEngaged(prev => [...prev, name]);
  };

  const card = cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]');
  const kpiStyle = cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]');
  const subtle = isDark ? 'text-white/30' : 'text-black/30';
  const medium = isDark ? 'text-white/50' : 'text-black/50';

  const churnRiskColumns: DataTableColumnDef[] = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (row) => {
        const customer = row as { name: string; riskLevel: string };
        const avatarColor = customer.riskLevel === 'critical' ? '#ef4444' : customer.riskLevel === 'high' ? '#f97316' : '#f59e0b';
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {customer.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="font-medium" style={{ color: CSS.text }}>{customer.name}</span>
          </div>
        );
      },
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      sortable: true,
      render: (row) => <span className="tabular-nums" style={{ color: CSS.textSecondary }}>{row.lastActivity as string}</span>,
    },
    {
      key: 'daysInactive',
      label: 'Days Inactive',
      sortable: true,
      render: (row) => {
        const days = row.daysInactive as number;
        const color = days > 20 ? '#ef4444' : days > 14 ? '#f59e0b' : CSS.textSecondary;
        return <span className="tabular-nums font-semibold" style={{ color }}>{days}d</span>;
      },
    },
    {
      key: 'ltv',
      label: 'LTV',
      sortable: true,
      render: (row) => <span className="tabular-nums" style={{ color: CSS.textSecondary }}>{formatCurrency(row.ltv as number)}</span>,
    },
    {
      key: 'riskLevel',
      label: 'Risk',
      render: (row) => {
        const risk = RISK_STYLES[row.riskLevel as string];
        return <Badge className={cn('text-[10px]', risk.className)}>{risk.label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
            Customer Retention
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/50' : 'text-black/50')}>
            Monitor churn, engage at-risk customers, and maximize lifetime value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Retention Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Churn Rate', value: `${mockRetentionMetrics.churnRate}%`, icon: TrendingDown, color: 'text-red-500', sub: 'Last 30 days' },
          { label: 'Repeat Purchase Rate', value: `${mockRetentionMetrics.repeatPurchaseRate}%`, icon: Heart, color: 'text-pink-500', sub: 'Quarterly avg' },
          { label: 'Inactive Users', value: mockRetentionMetrics.inactiveUsers.toLocaleString(), icon: Users, color: 'text-orange-500', sub: '90+ days' },
          { label: 'Renewal Alerts', value: mockRetentionMetrics.renewalAlerts, icon: Bell, color: 'text-amber-500', sub: 'This month' },
          { label: 'Avg LTV', value: formatCurrency(mockRetentionMetrics.avgLifetimeValue), icon: DollarSign, color: 'text-green-500', sub: 'Per customer' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={kpiStyle}
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              <span className={cn('text-xs', medium)}>{kpi.label}</span>
            </div>
            <p className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{kpi.value}</p>
            <p className={cn('text-[10px] mt-0.5', subtle)}>{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Cohort Retention Chart */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card}
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Cohort Retention</h3>
          <span className={cn('text-xs ml-auto', subtle)}>Monthly retention rate %</span>
        </div>

        <div className="space-y-4">
          {mockRetentionMetrics.cohortData.map((cohort, i) => {
            const width = cohort.rate;
            const color = getCohortColor(cohort.rate);
            return (
              <div key={cohort.month}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn('text-xs font-medium w-20', isDark ? 'text-white/70' : 'text-gray-600')}>
                    {cohort.month}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-bold tabular-nums',
                      cohort.rate >= 80 ? 'text-green-500' : cohort.rate >= 60 ? 'text-amber-500' : 'text-red-500')}>
                      {cohort.rate}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn('flex-1 h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', color)}
                    />
                  </div>
                  {/* Status indicator */}
                  <Badge className={cn('text-[9px] shrink-0',
                    cohort.rate >= 80 ? 'bg-green-500/15 text-green-600' :
                    cohort.rate >= 60 ? 'bg-amber-500/15 text-amber-600' : 'bg-red-500/15 text-red-600')}>
                    {cohort.rate >= 80 ? 'Healthy' : cohort.rate >= 60 ? 'Monitor' : 'At Risk'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className={cn('text-[10px]', medium)}>≥80% Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className={cn('text-[10px]', medium)}>60-80% Monitor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className={cn('text-[10px]', medium)}>&lt;60% At Risk</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Risk Table */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Churn Risk Customers</h3>
            </div>
            <Badge variant="secondary" className="bg-red-500/15 text-red-600">
              {CHURN_RISK_CUSTOMERS.length} at-risk
            </Badge>
          </div>
          <SmartDataTable
            data={CHURN_RISK_CUSTOMERS as unknown as Record<string, unknown>[]}
            columns={churnRiskColumns}
            pageSize={10}
            actions={(row) => {
              const name = row.name as string;
              const isReEngaged = reEngaged.includes(name);
              if (isReEngaged) {
                return <Badge className="text-[10px] bg-green-500/15 text-green-600">Sent ✓</Badge>;
              }
              return (
                <Button variant="outline" size="sm" className="text-[10px] h-6 px-2" onClick={() => handleReEngage(name)}>
                  <Send className="w-3 h-3 mr-1" />
                  Re-engage
                </Button>
              );
            }}
          />
        </motion.div>

        {/* Renewal Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Upcoming Renewals</h3>
            <Badge variant="secondary" className="bg-amber-500/15 text-amber-600">
              {RENEWAL_ALERTS.length} upcoming
            </Badge>
          </div>
          <div className="space-y-3">
            {RENEWAL_ALERTS.map((alert, i) => {
              const isUrgent = alert.daysLeft <= 7;
              return (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl border p-4 space-y-3',
                    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                    isUrgent && (isDark ? 'border-red-500/20' : 'border-red-500/20'),
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                          {alert.customer}
                        </p>
                        {isUrgent && (
                          <Badge className="text-[9px] bg-red-500/15 text-red-600">Urgent</Badge>
                        )}
                      </div>
                      <p className={cn('text-[10px] mt-0.5', medium)}>{alert.plan} Plan</p>
                    </div>
                    <p className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                      {formatCurrency(alert.amount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className={cn('w-3 h-3', subtle)} />
                      <span className={cn('text-[10px]', medium)}>Renews: {alert.date}</span>
                    </div>
                    <div className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded',
                      alert.daysLeft <= 7 ? 'bg-red-500/15 text-red-600' :
                      alert.daysLeft <= 14 ? 'bg-amber-500/15 text-amber-600' : 'bg-green-500/15 text-green-600',
                    )}>
                      {alert.daysLeft} days left
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-[10px] h-7">
                    <Send className="w-3 h-3 mr-1.5" />
                    Send Reminder
                  </Button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Retention Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Retention Campaigns</h3>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1.5" />
            New Campaign
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RETENTION_CAMPAIGNS.map((campaign, i) => (
            <div
              key={campaign.id}
              className={cn(
                'rounded-xl border p-4 space-y-3',
                isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    {campaign.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge className={cn('text-[9px]',
                      campaign.status === 'active' ? 'bg-green-500/15 text-green-600' : 'bg-blue-500/15 text-blue-600')}>
                      {campaign.status === 'active' ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                          </span>
                          Active
                        </>
                      ) : 'Scheduled'}
                    </Badge>
                  </div>
                </div>
                <Shield className={cn('w-4 h-4', subtle)} />
              </div>
              <div className="flex items-center gap-2">
                {campaign.channel.includes('Email') && <Mail className={cn('w-3 h-3', subtle)} />}
                {campaign.channel.includes('WhatsApp') && <MessageSquare className={cn('w-3 h-3', subtle)} />}
                <span className={cn('text-[10px]', medium)}>{campaign.channel}</span>
              </div>
              <p className={cn('text-[10px]', subtle)}>Audience: {campaign.audience}</p>

              {campaign.status === 'active' && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                  <div>
                    <p className={cn('text-[9px]', subtle)}>Sent</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                      {campaign.sent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={cn('text-[9px]', subtle)}>Engaged</p>
                    <p className={cn('text-xs font-semibold text-blue-500')}>
                      {campaign.engaged.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={cn('text-[9px]', subtle)}>Converted</p>
                    <p className={cn('text-xs font-semibold text-green-500')}>
                      {campaign.converted.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
