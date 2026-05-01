'use client';

import { useState, useMemo } from 'react';
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
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

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

  // ── Ad Fatigue column definitions ──
  const adFatigueColumns: DataTableColumnDef[] = useMemo(() => [
    { key: 'campaign', label: 'Campaign', sortable: true },
    {
      key: 'fatigue',
      label: 'Fatigue',
      sortable: true,
      render: (row) => {
        const fatigue = Number(row.fatigue);
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${fatigue}%`,
                  backgroundColor: fatigue >= 70
                    ? '#ef4444'
                    : fatigue >= 50
                      ? '#f59e0b'
                      : '#10b981',
                }}
              />
            </div>
            <span className={cn(
              'text-xs font-semibold',
              fatigue >= 70 ? 'text-red-500'
                : fatigue >= 50 ? 'text-amber-500'
                  : 'text-emerald-500',
            )}>
              {fatigue}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'impressions',
      label: 'Impressions',
      sortable: true,
      render: (row) => <span>{formatNum(Number(row.impressions))}</span>,
    },
    {
      key: 'ctr',
      label: 'CTR',
      sortable: true,
      render: (row) => {
        const ctr = Number(row.ctr);
        return (
          <span className={cn(
            'text-sm font-semibold',
            ctr >= 3 ? 'text-emerald-500'
              : ctr >= 2 ? 'text-amber-500'
                : 'text-red-500',
          )}>
            {ctr}%
          </span>
        );
      },
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
              <Megaphone className="w-5 h-5" style={{ color: CSS.textSecondary }} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Marketing Analytics</h1>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
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
            <span className="px-3 py-1.5 text-xs font-medium rounded-xl" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
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
                      <span className="text-xs" style={{ color: CSS.textMuted }}>
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
                  <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(ch.roi / maxChannelROI) * 100}%` }}
                      transition={{ delay: 0.35 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        ch.roi >= 8 ? (isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')
                          : ch.roi >= 5 ? (isDark ? 'bg-blue-500/50' : 'bg-blue-400')
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
            <SmartDataTable
              data={data.adFatigue as unknown as Record<string, unknown>[]}
              columns={adFatigueColumns}
              searchable
              enableExport
              pageSize={10}
              searchPlaceholder="Search campaigns…"
            />
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
                  className="rounded-xl border p-3.5 transition-colors"
                  style={{ backgroundColor: CSS.cardBgHover, borderColor: CSS.border }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
                      <ContentIcon className="w-3.5 h-3.5" style={{ color: CSS.textSecondary }} />
                    </div>
                    <span className="text-sm font-semibold truncate">{content.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Views</p>
                      <p className="text-sm font-semibold">{formatNum(content.views)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>CTR</p>
                      <p className="text-sm font-semibold text-blue-500">{content.ctr}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Likes</p>
                      <p className="text-sm font-medium">{formatNum(content.likes)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>Shares</p>
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
                    <span className="text-xs" style={{ color: CSS.textMuted }}>
                      {stage.conversion}% conv
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: CSS.hoverBg, maxWidth: '100%' }}
                  >
                    <div className="text-center">
                      <p className="text-base font-bold" style={{ color: CSS.text }}>
                        {formatNum(stage.visitors)}
                      </p>
                      <p className="text-[10px]" style={{ color: CSS.textMuted }}>
                        visitors
                      </p>
                    </div>
                  </motion.div>
                  {i < data.funnelConversion.length - 1 && (
                    <ChevronRight className="w-4 h-4 my-0.5 rotate-90" style={{ color: CSS.textMuted }} />
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
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>
                Email Campaigns
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: CSS.textMuted }}>Email CTR</span>
                  <span className="text-lg font-bold">{data.emailCTR}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.emailCTR / 10) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.15 }}
                    className={cn('h-full rounded-full', isDark ? 'bg-blue-500/50' : 'bg-blue-400')}
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
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>
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
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.15 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4" style={{ color: CSS.textMuted }} />
              <span className="text-sm font-semibold" style={{ color: CSS.textSecondary }}>
                WhatsApp Business
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: CSS.textMuted }}>Reply Rate</span>
                  <span className="text-lg font-bold">{data.whatsappReplyRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: CSS.hoverBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.whatsappReplyRate}%` }}
                    transition={{ delay: 0.6, duration: 0.15 }}
                    className={cn('h-full rounded-full', isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')}
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
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: CSS.textMuted }}>
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
