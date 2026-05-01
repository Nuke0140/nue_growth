'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, AlertTriangle, TrendingUp, TrendingDown, Users, Target,
  DollarSign, BarChart3, PieChart, Activity, Heart, Share2, Zap,
  ChevronRight, Plus, ArrowUpRight, ArrowDownRight, Mail, MessageCircle,
  Megaphone, Lightbulb, Shield, Clock, Sparkles, BrainCircuit, Send
} from 'lucide-react';
import { mockCampaigns, mockAttributionChannels, mockAIGrowthInsights, mockWorkflows, mockSocialPosts, marketingDashboardStats } from '@/modules/marketing/data/mock-data';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type { MarketingPage, Campaign, InsightType, AttributionChannel, AIGrowthInsight as AIInsightTypeFull } from '@/modules/marketing/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

const iconMap: Record<string, React.ElementType> = {
  Users, Target, DollarSign, TrendingUp, BarChart3, PieChart, Activity, Heart, Share2, Wallet: DollarSign,
};

const insightIcons: Record<string, React.ElementType> = {
  'channel-recommendation': TrendingUp,
  'budget-optimization': Sparkles,
  'trend-prediction': Activity,
  'churn-campaign': Shield,
  'fatigue-detection': AlertTriangle,
  'roi-improvement': DollarSign,
  'audience-expansion': Users,
  'content-optimization': Lightbulb,
};

const insightColors: Record<string, { color: string; bg: string }> = {
  'channel-recommendation': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'budget-optimization': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'trend-prediction': { color: 'text-violet-400', bg: 'bg-violet-500/10' },
  'churn-campaign': { color: 'text-red-400', bg: 'bg-red-500/10' },
  'fatigue-detection': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'roi-improvement': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'audience-expansion': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'content-optimization': { color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const funnelData = [15, 18, 22, 25, 28, 32, 30, 35, 38, 40, 42, 45];
const roiData = [1.2, 1.8, 2.1, 1.9, 2.5, 2.8, 3.0, 2.7, 3.2, 3.5, 3.8, 4.5];
const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const alerts = [
  { icon: AlertTriangle, severity: 'critical', title: 'Brand Awareness - LinkedIn underperforming', desc: 'ROAS at 0.98x — below 1.5x threshold. Consider pausing or re-budgeting.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: TrendingUp, severity: 'warning', title: 'CPL increased 18% on Paid Ads', desc: 'Google Ads CPC rose from ₹42 to ₹55. Conversion rate dropped 12%.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Activity, severity: 'warning', title: 'Low engagement on Instagram posts', desc: 'Last 3 posts averaged 1.2% engagement vs 3.5% benchmark.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Send, severity: 'critical', title: 'Email delivery failure spike', desc: '42 emails bounced in last 24 hours. Check sender reputation.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: TrendingDown, severity: 'warning', title: 'Conversion rate dropped on landing pages', desc: 'Landing page conversion fell from 4.2% to 3.1% week-over-week.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const channelIcons: Record<string, React.ElementType> = {
  Email: Mail,
  'Social Media': Share2,
  'Paid Ads': Megaphone,
  WhatsApp: MessageCircle,
};

export default function MarketingDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const activeCampaigns = useMemo(() => mockCampaigns.filter((c: Campaign) => c.status === 'active'), []);
  const topCampaigns = useMemo(() => [...activeCampaigns].sort((a: Campaign, b: Campaign) => b.roi - a.roi).slice(0, 5), [activeCampaigns]);
  const topInsights = useMemo(() => mockAIGrowthInsights.slice(0, 3), []);
  const totalBudget = useMemo(() => activeCampaigns.reduce((s: number, c: Campaign) => s + c.budget, 0), [activeCampaigns]);
  const totalSpend = useMemo(() => activeCampaigns.reduce((s: number, c: Campaign) => s + c.spend, 0), [activeCampaigns]);

  const topCampaignsColumns: DataTableColumnDef[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => <p className="text-sm font-medium" style={{ color: CSS.text }}>{(row as unknown as Campaign).name}</p>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
          {(row as unknown as Campaign).type}
        </Badge>
      ),
    },
    {
      key: 'channels',
      label: 'Channels',
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <div className="flex gap-1">
            {c.channels.slice(0, 3).map(ch => (
              <Badge key={ch} variant="secondary" className="text-[9px] px-1.5 py-0" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
                {ch}
              </Badge>
            ))}
            {c.channels.length > 3 && (
              <span className="text-[10px]" style={{ color: CSS.textMuted }}>+{c.channels.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{formatINR((row as unknown as Campaign).budget)}</span>,
    },
    {
      key: 'spend',
      label: 'Spend',
      sortable: true,
      render: (row) => <span className="text-sm" style={{ color: CSS.text }}>{formatINR((row as unknown as Campaign).spend)}</span>,
    },
    {
      key: 'roi',
      label: 'ROI',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        const color = c.roi >= 300 ? '#10b981' : c.roi >= 150 ? '#f59e0b' : '#ef4444';
        return <span className="text-sm font-semibold" style={{ color }}>{c.roi}%</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        return <StatusBadge status={c.status} />;
      },
    },
  ];

  const kpiStats = useMemo(() => [
    { label: 'Total Leads', value: marketingDashboardStats.totalLeads.toLocaleString(), icon: Users, color: 'text-blue-400', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', change: 12.4, changeLabel: 'vs last month' },
    { label: 'MQLs', value: marketingDashboardStats.mqls.toLocaleString(), icon: Target, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 8.2, changeLabel: 'qualified this quarter' },
    { label: 'SQLs', value: marketingDashboardStats.sqls.toLocaleString(), icon: TrendingUp, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 15.7, changeLabel: 'sales qualified' },
    { label: 'Campaign ROI', value: `${marketingDashboardStats.campaignROI}%`, icon: BarChart3, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 22.1, changeLabel: 'avg across campaigns' },
    { label: 'Cost Per Lead', value: `₹${marketingDashboardStats.cpl}`, icon: DollarSign, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: -5.3, changeLabel: 'reduced from ₹362' },
    { label: 'Customer Acq.', value: `₹${(marketingDashboardStats.cac / 1000).toFixed(1)}K`, icon: PieChart, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: -8.1, changeLabel: 'CAC improvement' },
    { label: 'ROAS', value: `${marketingDashboardStats.roas}x`, icon: Activity, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 14.5, changeLabel: 'return on ad spend' },
    { label: 'Retention Rate', value: `${marketingDashboardStats.retentionRate}%`, icon: Heart, color: 'text-pink-400', bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', change: 3.2, changeLabel: 'month-over-month' },
    { label: 'Referral Growth', value: `${marketingDashboardStats.referralGrowth}%`, icon: Share2, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 28.6, changeLabel: 'referral signups' },
    { label: 'Top Channel', value: marketingDashboardStats.channelContribution[0]?.channel || 'Google', icon: Zap, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: marketingDashboardStats.channelContribution[0]?.percent || 0, changeLabel: `${marketingDashboardStats.channelContribution[0]?.percent || 0}% contribution` },
  ], [isDark]);

  const quickNavItems: { label: string; value: number | string; page: MarketingPage; icon: React.ElementType }[] = [
    { label: 'Campaigns', value: mockCampaigns.length, page: 'campaigns', icon: Megaphone },
    { label: 'Workflows', value: mockWorkflows.filter(w => w.status === 'active').length, page: 'workflows', icon: Zap },
    { label: 'Social Calendar', value: mockSocialPosts.filter(p => p.status === 'scheduled').length, page: 'social-calendar', icon: Share2 },
    { label: 'Ads Performance', value: formatINR(totalBudget), page: 'ads-performance', icon: BarChart3 },
  ];

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
              <BrainCircuit className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Marketing Dashboard</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Growth Intelligence Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={cn(
              'px-3 py-1.5 text-xs font-medium gap-1.5',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </Badge>
            <Button
              onClick={() => navigateTo('campaign-builder')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
                isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
              )}
            >
              <Plus className="w-4 h-4" />
              New Campaign
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
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 cursor-pointer transition-all duration-200',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                    {stat.label}
                  </span>
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  <span className={cn(
                    'flex items-center gap-0.5 text-[10px] font-medium',
                    isPositive ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
                  {stat.changeLabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funnel Conversion Chart */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                  Funnel Conversion
                </span>
              </div>
              <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Last 12 months</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {funnelData.map((val, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{val}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 50) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', isDark ? 'bg-emerald-500/30' : 'bg-emerald-400')}
                  />
                  <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{months[j]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campaign ROI Trend */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                  Campaign ROI Trend
                </span>
              </div>
              <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Last 12 months</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {roiData.map((val, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{val}x</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 5) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', isDark ? 'bg-amber-500/30' : 'bg-amber-400')}
                  />
                  <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{months[j]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Channel Performance Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            <h2 className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Channel Performance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAttributionChannels.map((channel: AttributionChannel, i) => {
              const ChIcon = channelIcons[channel.channel] || Activity;
              const barWidth = (channel.contribution / 40) * 100;
              return (
                <motion.div
                  key={channel.channel}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'rounded-2xl border p-4 transition-all duration-200 cursor-pointer',
                    isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                        <ChIcon className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
                      </div>
                      <span className="text-sm font-medium">{channel.channel}</span>
                    </div>
                    <span className={cn(
                      'text-[10px] font-semibold',
                      channel.contribution >= 20 ? 'text-emerald-500' : 'text-amber-500'
                    )}>
                      {channel.contribution}%
                    </span>
                  </div>
                  <p className="text-lg font-bold">{formatINR(channel.revenue)}</p>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                    {channel.contribution}% of total revenue
                  </p>
                  <div className="mt-3">
                    <div className={cn('w-full h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.15 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{channel.contribution}% share</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{channel.conversions} conversions</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Top Campaigns Table */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.15 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Top Active Campaigns</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('campaigns')}
              className={cn('text-xs gap-1', isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.06]')}
            >
              View All <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          <SmartDataTable
            data={topCampaigns as unknown as Record<string, unknown>[]}
            columns={topCampaignsColumns}
            searchable pageSize={10}
            searchPlaceholder="Search campaigns..."
          />
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.15 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Active Alerts</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600')}>
              {alerts.length} alerts
            </Badge>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.05, duration: 0.3 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer',
                  isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]'
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
                      alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
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

        {/* AI Insights Preview */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.15 }}
          className={cn(
            'rounded-2xl border p-5',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>AI Growth Insights</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600')}>
              {mockAIGrowthInsights.length} insights
            </Badge>
          </div>
          <div className="space-y-3">
            {topInsights.map((insight, i) => {
              const Icon = insightIcons[insight.type] || Sparkles;
              const colors = insightColors[insight.type] || { color: 'text-violet-400', bg: 'bg-violet-500/10' };
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 + i * 0.06, duration: 0.3 }}
                  className={cn(
                    'p-4 rounded-xl border transition-colors cursor-pointer',
                    isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', colors.bg)}>
                      <Icon className={cn('w-4 h-4', colors.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <Badge variant="secondary" className={cn(
                          'text-[9px] px-1.5 py-0 capitalize',
                          insight.impact === 'high' ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                          insight.impact === 'medium' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600') :
                          (isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')
                        )}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn('flex items-center gap-1 text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                          <Sparkles className="w-3 h-3" />
                          {insight.confidence}% confidence
                        </div>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                          {insight.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickNavItems.map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
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
