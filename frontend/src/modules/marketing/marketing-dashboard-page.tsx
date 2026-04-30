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

  const kpiStats = useMemo(() => [
    { label: 'Total Leads', value: marketingDashboardStats.totalLeads.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-[var(--app-info-bg)]', change: 12.4, changeLabel: 'vs last month' },
    { label: 'MQLs', value: marketingDashboardStats.mqls.toLocaleString(), icon: Target, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 8.2, changeLabel: 'qualified this quarter' },
    { label: 'SQLs', value: marketingDashboardStats.sqls.toLocaleString(), icon: TrendingUp, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: 15.7, changeLabel: 'sales qualified' },
    { label: 'Campaign ROI', value: `${marketingDashboardStats.campaignROI}%`, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 22.1, changeLabel: 'avg across campaigns' },
    { label: 'Cost Per Lead', value: `₹${marketingDashboardStats.cpl}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: -5.3, changeLabel: 'reduced from ₹362' },
    { label: 'Customer Acq.', value: `₹${(marketingDashboardStats.cac / 1000).toFixed(1)}K`, icon: PieChart, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: -8.1, changeLabel: 'CAC improvement' },
    { label: 'ROAS', value: `${marketingDashboardStats.roas}x`, icon: Activity, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 14.5, changeLabel: 'return on ad spend' },
    { label: 'Retention Rate', value: `${marketingDashboardStats.retentionRate}%`, icon: Heart, color: 'text-pink-400', bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', change: 3.2, changeLabel: 'month-over-month' },
    { label: 'Referral Growth', value: `${marketingDashboardStats.referralGrowth}%`, icon: Share2, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 28.6, changeLabel: 'referral signups' },
    { label: 'Top Channel', value: marketingDashboardStats.channelContribution[0]?.channel || 'Google', icon: Zap, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: marketingDashboardStats.channelContribution[0]?.percent || 0, changeLabel: `${marketingDashboardStats.channelContribution[0]?.percent || 0}% contribution` },
  ], [isDark]);

  const quickNavItems: { label: string; value: number | string; page: MarketingPage; icon: React.ElementType }[] = [
    { label: 'Campaigns', value: mockCampaigns.length, page: 'campaigns', icon: Megaphone },
    { label: 'Workflows', value: mockWorkflows.filter(w => w.status === 'active').length, page: 'workflows', icon: Zap },
    { label: 'Social Calendar', value: mockSocialPosts.filter(p => p.status === 'scheduled').length, page: 'social-calendar', icon: Share2 },
    { label: 'Ads Performance', value: formatINR(totalBudget), page: 'ads-performance', icon: BarChart3 },
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
              <BrainCircuit className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Marketing Dashboard</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Growth Intelligence Hub</p>
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
              onClick={() => navigateTo('campaign-builder')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 cursor-pointer transition-colors duration-200',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funnel Conversion Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Funnel Conversion
                </span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last 12 months</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {funnelData.map((val, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{val}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 50) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', 'bg-[var(--app-success)]')}
                  />
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{months[j]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campaign ROI Trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Campaign ROI Trend
                </span>
              </div>
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last 12 months</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {roiData.map((val, j) => (
                <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{val}x</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / 5) * 100}%` }}
                    transition={{ delay: 0.4 + j * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', 'bg-[var(--app-warning)]')}
                  />
                  <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{months[j]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Channel Performance Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Channel Performance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAttributionChannels.map((channel: AttributionChannel, i) => {
              const ChIcon = channelIcons[channel.channel] || Activity;
              const barWidth = (channel.contribution / 40) * 100;
              return (
                <motion.div
                  key={channel.channel}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-4 transition-colors duration-200 cursor-pointer',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                        <ChIcon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
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
                  <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                    {channel.contribution}% of total revenue
                  </p>
                  <div className="mt-3">
                    <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{channel.contribution}% share</span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{channel.conversions} conversions</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Top Campaigns Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Top Active Campaigns</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('campaigns')}
              className={cn('text-xs gap-1', isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.06]')}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Name', 'Type', 'Channels', 'Budget', 'Spend', 'ROI', 'Status'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign: Campaign, i) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 + i * 0.05 }}
                    className={cn(
                      'border-b cursor-pointer transition-colors',
                      'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <td className="py-3 px-3">
                      <p className="text-sm font-medium">{campaign.name}</p>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                        {campaign.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {campaign.channels.slice(0, 3).map(ch => (
                          <Badge key={ch} variant="secondary" className={cn('text-[9px] px-1.5 py-0', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                            {ch}
                          </Badge>
                        ))}
                        {campaign.channels.length > 3 && (
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>+{campaign.channels.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm">{formatINR(campaign.budget)}</td>
                    <td className="py-3 px-3 text-sm">{formatINR(campaign.spend)}</td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        'text-sm font-semibold',
                        campaign.roi >= 300 ? 'text-emerald-500' : campaign.roi >= 150 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {campaign.roi}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="secondary" className={cn(
                        'text-[10px] px-2 py-0.5',
                        campaign.status === 'active' ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]') :
                        campaign.status === 'paused' ? ('bg-[var(--app-warning-bg)] text-[var(--app-warning)]') :
                        ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
                      )}>
                        {campaign.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Active Alerts</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
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
                  'flex items-start gap-3 p-3 rounded-[var(--app-radius-lg)] border transition-colors cursor-pointer',
                  'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                )}
              >
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0 mt-0.5', alert.bg)}>
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
                  <p className={cn('text-xs leading-relaxed', 'text-[var(--app-text-muted)]')}>
                    {alert.desc}
                  </p>
                </div>
                <ChevronRight className={cn('w-4 h-4 shrink-0 mt-1', 'text-[var(--app-text-disabled)]')} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>AI Growth Insights</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
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
                    'p-4 rounded-[var(--app-radius-lg)] border transition-colors cursor-pointer',
                    'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', colors.bg)}>
                      <Icon className={cn('w-4 h-4', colors.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{insight.title}</p>
                        <Badge variant="secondary" className={cn(
                          'text-[9px] px-1.5 py-0 capitalize',
                          insight.impact === 'high' ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]') :
                          insight.impact === 'medium' ? ('bg-[var(--app-warning-bg)] text-[var(--app-warning)]') :
                          ('bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')
                        )}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className={cn('text-xs leading-relaxed line-clamp-2', 'text-[var(--app-text-muted)]')}>
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn('flex items-center gap-1 text-[10px]', 'text-[var(--app-text-muted)]')}>
                          <Sparkles className="w-4 h-4" />
                          {insight.confidence}% confidence
                        </div>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4 text-left transition-colors duration-200 group',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', 'text-[var(--app-text-muted)]')} />
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
      </div>
    </div>
  );
}
