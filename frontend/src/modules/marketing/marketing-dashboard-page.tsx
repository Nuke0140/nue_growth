'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  DollarSign,
  Megaphone,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Sparkles,
  BrainCircuit,
  ChevronRight,
  Lightbulb,
  Zap,
  Target,
  AlertTriangle,
  Shield,
  Clock,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell/index';
import { StatusBadge } from '@/components/shared/status-badge/index';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import {
  marketingDashboardStats,
  mockCampaigns,
  mockAIGrowthInsights,
  mockAttributionChannels,
} from '@/modules/marketing/data/mock-data';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type {
  MarketingDashboardStats,
  Campaign,
  AIGrowthInsight,
  AttributionChannel,
} from '@/modules/marketing/types';

// ── INR Formatter ──────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

// ── Insight Icon Map ───────────────────────────────────

const insightIcons: Record<string, React.ElementType> = {
  opportunity: TrendingUp,
  optimization: Sparkles,
  risk: AlertTriangle,
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
  opportunity: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  optimization: { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  risk: { color: 'text-red-400', bg: 'bg-red-500/10' },
  'channel-recommendation': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'budget-optimization': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'trend-prediction': { color: 'text-violet-400', bg: 'bg-violet-500/10' },
  'churn-campaign': { color: 'text-red-400', bg: 'bg-red-500/10' },
  'fatigue-detection': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'roi-improvement': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'audience-expansion': { color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'content-optimization': { color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

// ── Period Selector ────────────────────────────────────

type Period = '7D' | '30D' | '90D';

// ── Sparkline SVG (mini) ───────────────────────────────

function MiniSparkline({ data, color, isDark }: { data: number[]; color: string; isDark: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 20;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(' ')}
      />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────

export default function MarketingDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);
  const selectCampaign = useMarketingStore((s) => s.selectCampaign);
  const [period, setPeriod] = useState<Period>('30D');

  // Derived data
  const stats = marketingDashboardStats;
  const revenueProgress = (stats.revenueThisMonth / stats.revenueTarget) * 100;

  const activeCampaigns = useMemo(
    () => mockCampaigns.filter((c: Campaign) => c.status === 'active'),
    [],
  );
  const topCampaigns = useMemo(
    () => [...activeCampaigns].sort((a: Campaign, b: Campaign) => b.roi - a.roi).slice(0, 5),
    [activeCampaigns],
  );
  const topInsights = useMemo(() => mockAIGrowthInsights.slice(0, 3), []);

  // Revenue trend bars — use the last 10 data points
  const revenueTrend = useMemo(() => {
    const trend = stats.revenueTrend.slice(-10);
    const maxAmount = Math.max(...trend.map((t) => t.amount));
    return trend.map((t) => ({
      ...t,
      heightPct: maxAmount > 0 ? (t.amount / maxAmount) * 100 : 0,
    }));
  }, [stats.revenueTrend]);

  // Campaign sparkline data (mini mock)
  const campaignSparkline = [3, 5, 4, 6, 5, 7, 6, 8, 7, 9];

  // KPI cards data
  const kpiCards = useMemo(
    () => [
      {
        label: 'Revenue This Month',
        value: formatINR(stats.revenueThisMonth),
        icon: DollarSign,
        iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
        iconColor: 'text-emerald-400',
        change: 12.4,
        changeLabel: `target ${formatINR(stats.revenueTarget)}`,
        showProgress: true,
        progressPct: revenueProgress,
      },
      {
        label: 'Active Campaigns',
        value: String(stats.activeCampaignsCount),
        icon: Megaphone,
        iconBg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
        iconColor: 'text-amber-400',
        change: 8.2,
        changeLabel: 'vs last month',
        sparkline: campaignSparkline,
        sparklineColor: '#fbbf24',
      },
      {
        label: 'Total Leads',
        value: stats.totalLeads.toLocaleString('en-IN'),
        icon: Users,
        iconBg: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
        iconColor: 'text-sky-400',
        change: 15.7,
        changeLabel: 'growth this quarter',
      },
      {
        label: 'Campaign ROI',
        value: `${stats.campaignROI}%`,
        icon: BarChart3,
        iconBg: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
        iconColor: 'text-violet-400',
        change: 22.1,
        changeLabel: 'avg across campaigns',
      },
    ],
    [isDark, stats, revenueProgress],
  );

  // ── Stagger timing ─────────────────────────────────
  const staggerDelay = 0.04;
  const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <PageShell
      title="Dashboard"
      subtitle="Revenue Control Panel"
      icon={LayoutDashboard}
      headerRight={
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              'px-3 py-1.5 text-[11px] font-medium gap-1.5',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50',
            )}
          >
            <Clock className="w-3 h-3" />
            {new Date().toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ── 1. KPI ROW ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => {
            const isPositive = card.change > 0;
            return (
              <div
                key={card.id}
                className={cn(
                  'rounded-2xl border p-5',
                  isDark
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-black/[0.02] border-black/[0.06]',
                )}
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      'text-[11px] font-medium uppercase tracking-wider',
                      isDark ? 'text-white/40' : 'text-black/40',
                    )}
                  >
                    {card.label}
                  </span>
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center',
                      card.iconBg,
                    )}
                  >
                    <card.icon className={cn('w-4.5 h-4.5', card.iconColor)} />
                  </div>
                </div>

                {/* Value + change */}
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-[11px] font-semibold',
                      isPositive ? 'text-emerald-500' : 'text-red-500',
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                </div>

                {/* Sub-label */}
                <p className={cn('text-[11px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                  {card.changeLabel}
                </p>

                {/* Revenue progress bar */}
                {card.showProgress && (
                  <div className="mt-3">
                    <div
                      className={cn(
                        'w-full h-1.5 rounded-full overflow-hidden',
                        isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
                      )}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(card.progressPct, 100)}%` }}
                      />
                    </div>
                    <p
                      className={cn(
                        'text-[10px] mt-1',
                        isDark ? 'text-white/25' : 'text-black/25',
                      )}
                    >
                      {card.progressPct.toFixed(0)}% of target
                    </p>
                  </div>
                )}

                {/* Sparkline for Active Campaigns */}
                {card.sparkline && (
                  <div className="mt-3 flex items-center gap-2">
                    <MiniSparkline
                      data={card.sparkline}
                      color={card.sparklineColor || '#fbbf24'}
                      isDark={isDark}
                    />
                    <span
                      className={cn(
                        'text-[10px]',
                        isDark ? 'text-white/25' : 'text-black/25',
                      )}
                    >
                      trend
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 2. REVENUE TREND CHART + 3. CHANNEL ATTRIBUTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Revenue Trend — takes 3 cols */}
          <div
            className={cn(
              'lg:col-span-3 rounded-2xl border p-5',
              isDark
                ? 'bg-white/[0.02] border-white/[0.06]'
                : 'bg-white border-black/[0.06]',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity
                  className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
                />
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isDark ? 'text-white/70' : 'text-black/70',
                  )}
                >
                  Revenue Trend
                </span>
              </div>
              {/* Period selector */}
              <div
                className={cn(
                  'flex items-center gap-1 rounded-lg p-0.5',
                  isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]',
                )}
              >
                {(['7D', '30D', '90D'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-medium',
                      period === p
                        ? isDark
                          ? 'bg-white/[0.1] text-white/80 shadow-sm'
                          : 'bg-white text-black/80 shadow-sm'
                        : isDark
                          ? 'text-white/30 hover:text-white/50'
                          : 'text-black/30 hover:text-black/50',
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-44">
              {revenueTrend.map((point, j) => (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col justify-end items-center gap-1.5 group/bar"
                >
                  {/* Tooltip value on hover */}
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      isDark ? 'text-white/60' : 'text-black/60',
                    )}
                  >
                    {formatINR(point.amount)}
                  </span>
                  <div
                    className={cn(
                      'w-full rounded-t-md cursor-pointer',
                      isDark
                        ? 'bg-emerald-500/25'
                        : 'bg-emerald-400/60',
                    )}
                    style={{ minHeight: '4px', height: `${point.heightPct}%` }}
                  />
                  <span
                    className={cn(
                      'text-[9px] whitespace-nowrap',
                      isDark ? 'text-white/20' : 'text-black/20',
                    )}
                  >
                    {point.date.split(' ').slice(0, 1).join('')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Attribution — takes 2 cols */}
          <div
            className={cn(
              'lg:col-span-2 rounded-2xl border p-5',
              isDark
                ? 'bg-white/[0.02] border-white/[0.06]'
                : 'bg-white border-black/[0.06]',
            )}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Target
                  className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
                />
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isDark ? 'text-white/70' : 'text-black/70',
                  )}
                >
                  Channel Attribution
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {mockAttributionChannels.map((channel: AttributionChannel, i: number) => (
                <div
                  key={channel.channel}
                  className="group/channel"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isDark ? 'text-white/70' : 'text-black/70',
                        )}
                      >
                        {channel.channel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-[11px]',
                          isDark ? 'text-white/40' : 'text-black/40',
                        )}
                      >
                        {formatINR(channel.revenue)}
                      </span>
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: channel.color }}
                      >
                        {channel.contribution}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-full h-2 rounded-full overflow-hidden',
                      isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]',
                    )}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: channel.color, width: `${channel.contribution}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. ACTIVE CAMPAIGNS QUICK VIEW ────────────── */}
        <div
          className={cn(
            'rounded-2xl border p-5',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone
                className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
              />
              <span
                className={cn(
                  'text-sm font-semibold',
                  isDark ? 'text-white/70' : 'text-black/70',
                )}
              >
                Active Campaigns
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] px-2 py-0.5',
                  isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
                )}
              >
                {activeCampaigns.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo('campaigns')}
              className={cn(
                'text-xs gap-1',
                isDark
                  ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                  : 'text-black/40 hover:text-black/60 hover:bg-black/[0.06]',
              )}
            >
              View All <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Table-like list */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    'text-[11px] font-medium uppercase tracking-wider',
                    isDark ? 'text-white/30' : 'text-black/30',
                  )}
                >
                  <th className="text-left pb-3 pr-4">Name</th>
                  <th className="text-left pb-3 pr-4">Type</th>
                  <th className="text-right pb-3 pr-4">Budget</th>
                  <th className="text-right pb-3 pr-4">ROI</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCampaigns.map((campaign: Campaign, i: number) => {
                  const roiColor =
                    campaign.roi >= 300
                      ? 'text-emerald-500'
                      : campaign.roi >= 150
                        ? 'text-amber-500'
                        : 'text-red-500';
                  return (
                    <tr
                      key={campaign.id}
                      onClick={() => {
                        navigateTo('campaigns');
                        selectCampaign(campaign.id);
                      }}
                      className={cn(
                        'cursor-pointer group/row',
                        isDark
                          ? 'hover:bg-white/[0.03] border-t border-white/[0.04]'
                          : 'hover:bg-black/[0.02] border-t border-black/[0.04]',
                      )}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
                            )}
                          >
                            <Zap
                              className={cn(
                                'w-3.5 h-3.5',
                                isDark ? 'text-white/40' : 'text-black/40',
                              )}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={cn(
                                'text-sm font-medium truncate max-w-[260px]',
                                isDark ? 'group-hover/row:text-white' : 'group-hover/row:text-black',
                              )}
                            >
                              {campaign.name}
                            </p>
                            <p
                              className={cn(
                                'text-[11px] truncate',
                                isDark ? 'text-white/30' : 'text-black/30',
                              )}
                            >
                              {campaign.owner}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] px-2 py-0.5 capitalize',
                            isDark
                              ? 'bg-white/[0.06] text-white/50'
                              : 'bg-black/[0.06] text-black/50',
                          )}
                        >
                          {campaign.type.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        {formatINR(campaign.budget)}
                      </td>
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm font-semibold text-right',
                          roiColor,
                        )}
                      >
                        {campaign.roi}%
                      </td>
                      <td className="py-3">
                        <StatusBadge status={campaign.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. AI INSIGHTS PANEL ──────────────────────── */}
        <div
          className={cn(
            'rounded-2xl border p-5 relative overflow-hidden',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Subtle purple/gold glow accent */}
          <div
            className={cn(
              'absolute top-0 right-0 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-20',
              isDark ? 'bg-violet-500' : 'bg-violet-300',
            )}
          />
          <div
            className={cn(
              'absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[100px] pointer-events-none opacity-10',
              isDark ? 'bg-amber-500' : 'bg-amber-300',
            )}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isDark ? 'bg-violet-500/15' : 'bg-violet-100',
                )}
              >
                <BrainCircuit
                  className={cn(
                    'w-4 h-4',
                    isDark ? 'text-violet-400' : 'text-violet-600',
                  )}
                />
              </div>
              <div>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isDark ? 'text-white/70' : 'text-black/70',
                  )}
                >
                  AI Growth Insights
                </span>
                <p
                  className={cn(
                    'text-[11px]',
                    isDark ? 'text-white/30' : 'text-black/30',
                  )}
                >
                  Powered by growth intelligence
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px]',
                isDark
                  ? 'bg-violet-500/15 text-violet-400'
                  : 'bg-violet-50 text-violet-600',
              )}
            >
              {mockAIGrowthInsights.length} insights
            </Badge>
          </div>

          {/* Insight cards */}
          <div className="space-y-3 relative z-10">
            {topInsights.map((insight: AIGrowthInsight, i: number) => {
              const Icon = insightIcons[insight.type] || Sparkles;
              const colors = insightColors[insight.type] || {
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
              };
              return (
                <div
                  key={insight.id}
                  className={cn(
                    'p-4 rounded-xl border',
                    isDark
                      ? 'border-white/[0.04]'
                      : 'border-black/[0.04]',
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        colors.bg,
                      )}
                    >
                      <Icon className={cn('w-4 h-4', colors.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isDark ? 'text-white/90' : 'text-black/90',
                          )}
                        >
                          {insight.title}
                        </p>
                        {/* Type badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[9px] px-1.5 py-0 capitalize',
                            insight.type === 'risk'
                              ? isDark
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-red-50 text-red-600'
                              : insight.type === 'opportunity'
                                ? isDark
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-emerald-50 text-emerald-600'
                                : isDark
                                  ? 'bg-sky-500/15 text-sky-400'
                                  : 'bg-sky-50 text-sky-600',
                          )}
                        >
                          {insight.type}
                        </Badge>
                        {/* Impact badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[9px] px-1.5 py-0',
                            insight.impact === 'critical'
                              ? isDark
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-amber-50 text-amber-600'
                              : insight.impact === 'high'
                                ? isDark
                                  ? 'bg-violet-500/15 text-violet-400'
                                  : 'bg-violet-50 text-violet-600'
                                : isDark
                                  ? 'bg-white/[0.06] text-white/40'
                                  : 'bg-black/[0.06] text-black/40',
                          )}
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p
                        className={cn(
                          'text-xs leading-relaxed line-clamp-2',
                          isDark ? 'text-white/40' : 'text-black/40',
                        )}
                      >
                        {insight.description}
                      </p>

                      {/* Bottom row: confidence + action */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex items-center gap-1 text-[10px]',
                              isDark ? 'text-white/30' : 'text-black/30',
                            )}
                          >
                            <Sparkles className="w-3 h-3" />
                            {insight.confidence}% confidence
                          </div>
                          {insight.potentialROI > 0 && (
                            <span
                              className={cn(
                                'text-[10px] font-medium',
                                isDark ? 'text-emerald-400/70' : 'text-emerald-600',
                              )}
                            >
                              +{formatINR(insight.potentialROI)} potential
                            </span>
                          )}
                        </div>
                        {insight.actionPage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              'text-[11px] h-7 px-3 rounded-lg gap-1.5 font-medium',
                              isDark
                                ? 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 hover:text-violet-300'
                                : 'bg-violet-50 text-violet-600 hover:bg-violet-100 hover:text-violet-700',
                            )}
                            onClick={() => {
                              // Placeholder for apply suggestion action
                            }}
                          >
                            <Zap className="w-3 h-3" />
                            Apply Suggestion
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
