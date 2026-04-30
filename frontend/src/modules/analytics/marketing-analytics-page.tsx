'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Megaphone, DollarSign, TrendingUp, MessageCircle, Eye, Heart,
  Share2, MousePointerClick, Calendar, BarChart3, Mail, Phone,
  ChevronRight, ArrowUpRight,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import DashboardWidget from './components/dashboard-widget';
import FilterChip from './components/filter-chip';
import ExportMenu from './components/export-menu';
import { marketingAnalyticsData } from './data/mock-data';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function formatNum(num: number): string {
  if (num >= 100000) return `${(num / 1000).toFixed(0)}K`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const contentIcons: Record<string, React.ElementType> = {
  'Blog Posts': BarChart3,
  'Case Studies': Mail,
  'LinkedIn Posts': MessageCircle,
  'YouTube Videos': Eye,
  'Twitter Threads': Share2,
  'WhatsApp Broadcasts': Phone,
};

export default function MarketingAnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = marketingAnalyticsData;

  const [activeFilter, setActiveFilter] = useState('all');
  const filters = ['all', 'paid', 'organic', 'social'];

  const maxChannelROI = Math.max(...data.channelROI.map((c) => c.roi));
  const maxFunnelVisitors = Math.max(...data.funnelConversion.map((f) => f.visitors));

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Megaphone className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Marketing Analytics</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Channel ROI, campaign performance &amp; content engagement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => (
                <FilterChip
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  active={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
            <ExportMenu />
            <span className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-[var(--app-radius-lg)]',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
            )}>
              <Calendar className="w-4 h-4 inline mr-1.5" />
              {today}
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            label="Cost Per Lead"
            value={`₹${data.cpl.toLocaleString('en-IN')}`}
            change={-38}
            changeLabel="spike vs last week"
            icon={DollarSign}
            severity="warning"
            trend="up"
          />
          <KPICard
            label="Customer Acq. Cost"
            value={formatINR(data.cac)}
            change={12.4}
            changeLabel="vs last month"
            icon={TrendingUp}
          />
          <KPICard
            label="ROAS"
            value={`${data.roas}x`}
            change={18.2}
            changeLabel="return on ad spend"
            icon={BarChart3}
          />
          <KPICard
            label="WhatsApp Reply Rate"
            value={`${data.whatsappReplyRate}%`}
            change={8.6}
            changeLabel="vs last month"
            icon={MessageCircle}
          />
        </motion.div>

        {/* Row: Channel ROI + Ad Fatigue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Channel ROI */}
          <ChartCard title="Channel ROI" subtitle="Return on investment by marketing channel">
            <div className="space-y-4 pt-2">
              {data.channelROI.map((ch, i) => (
                <motion.div
                  key={ch.channel}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{ch.channel}</span>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {formatINR(ch.revenue)} rev
                      </span>
                      <span className={cn(
                        'text-sm font-semibold',
                        ch.roi >= 8 ? 'text-emerald-500' : ch.roi >= 5 ? 'text-blue-500' : 'text-amber-500',
                      )}>
                        {ch.roi}x
                      </span>
                    </div>
                  </div>
                  <div className={cn('w-full h-2.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(ch.roi / maxChannelROI) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        ch.roi >= 8 ? ('bg-[var(--app-success)]')
                          : ch.roi >= 5 ? ('bg-[var(--app-info)]')
                            : (isDark ? 'bg-amber-500/50' : 'bg-amber-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Ad Fatigue Table */}
          <ChartCard title="Ad Fatigue Monitor" subtitle="Campaign fatigue score &amp; engagement">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Campaign', 'Fatigue', 'Impressions', 'CTR'].map((h) => (
                      <th
                        key={h}
                        className={cn(
                          'text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3',
                          'text-[var(--app-text-muted)]',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.adFatigue.map((ad, i) => (
                    <motion.tr
                      key={ad.campaign}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className={cn(
                        'border-b transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]',
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className="text-sm font-medium">{ad.campaign}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-20 h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${ad.fatigue}%` }}
                              transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                              className={cn(
                                'h-full rounded-full',
                                ad.fatigue >= 70
                                  ? (isDark ? 'bg-red-500/50' : 'bg-red-400')
                                  : ad.fatigue >= 50
                                    ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400')
                                    : ('bg-[var(--app-success)]'),
                              )}
                            />
                          </div>
                          <span className={cn(
                            'text-xs font-semibold',
                            ad.fatigue >= 70 ? 'text-red-500'
                              : ad.fatigue >= 50 ? 'text-amber-500'
                                : 'text-emerald-500',
                          )}>
                            {ad.fatigue}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm">{formatNum(ad.impressions)}</td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'text-sm font-semibold',
                          ad.ctr >= 3 ? 'text-emerald-500'
                            : ad.ctr >= 2 ? 'text-amber-500'
                              : 'text-red-500',
                        )}>
                          {ad.ctr}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Content Engagement Cards */}
        <ChartCard title="Content Engagement" subtitle="Views, likes, shares &amp; CTR by content type">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {data.contentEngagement.map((content, i) => {
              const ContentIcon = contentIcons[content.type] || BarChart3;
              return (
                <motion.div
                  key={content.type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  className={cn(
                    'rounded-[var(--app-radius-lg)] border p-3.5 transition-colors',
                    isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                      : 'bg-black/[0.01] border-black/[0.06] hover:bg-black/[0.03]',
                  )}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={cn(
                      'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
                      'bg-[var(--app-hover-bg)]',
                    )}>
                      <ContentIcon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                    </div>
                    <span className="text-sm font-semibold truncate">{content.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Views</p>
                      <p className="text-sm font-semibold">{formatNum(content.views)}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>CTR</p>
                      <p className="text-sm font-semibold text-blue-500">{content.ctr}%</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Likes</p>
                      <p className="text-sm font-medium">{formatNum(content.likes)}</p>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Shares</p>
                      <p className="text-sm font-medium">{formatNum(content.shares)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>

        {/* Funnel Conversion */}
        <ChartCard title="Marketing Funnel Conversion" subtitle="Visitor drop-off from impression to SQL">
          <div className="flex flex-col items-center gap-2 pt-2">
            {data.funnelConversion.map((stage, i) => {
              const widthPct = Math.max(30, 100 - i * 14);
              return (
                <div key={stage.stage} className="w-full flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                      {stage.conversion}% conv
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
                      'bg-[var(--app-hover-bg)]',
                    )}
                    style={{ maxWidth: '100%' }}
                  >
                    <div className="text-center">
                      <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>
                        {formatNum(stage.visitors)}
                      </p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        visitors
                      </p>
                    </div>
                  </motion.div>
                  {i < data.funnelConversion.length - 1 && (
                    <ChevronRight className={cn(
                      'w-4 h-4 my-0.5 rotate-90',
                      'text-[var(--app-text-disabled)]',
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Email & WhatsApp Metrics Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Email Campaigns
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Email CTR</span>
                  <span className="text-lg font-bold">{data.emailCTR}%</span>
                </div>
                <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.emailCTR / 10) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={cn('h-full rounded-full', 'bg-[var(--app-info)]')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Open Rate', value: '42.8%', change: '+3.2%' },
                  { label: 'Reply Rate', value: '8.4%', change: '+1.1%' },
                  { label: 'Bounce Rate', value: '1.2%', change: '-0.3%' },
                  { label: 'Unsub Rate', value: '0.4%', change: '-0.1%' },
                ].map((m, j) => (
                  <div key={m.label}>
                    <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      {m.label}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-sm font-semibold">{m.value}</p>
                      <span className={cn(
                        'text-[10px] font-medium',
                        m.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500',
                      )}>
                        {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                WhatsApp Business
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Reply Rate</span>
                  <span className="text-lg font-bold">{data.whatsappReplyRate}%</span>
                </div>
                <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.whatsappReplyRate}%` }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className={cn('h-full rounded-full', 'bg-[var(--app-success)]')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Broadcast Sent', value: '15.6K', change: '+12.4%' },
                  { label: 'Delivered', value: '14.2K', change: '+11.8%' },
                  { label: 'Read Rate', value: '68.4%', change: '+4.2%' },
                  { label: 'Response Time', value: '1.8h', change: '-15.0%' },
                ].map((m, j) => (
                  <div key={m.label}>
                    <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      {m.label}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-sm font-semibold">{m.value}</p>
                      <span className={cn(
                        'text-[10px] font-medium',
                        m.label === 'Response Time'
                          ? (m.change.startsWith('-') ? 'text-emerald-500' : 'text-red-500')
                          : (m.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'),
                      )}>
                        {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
