'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdCampaign } from '@/modules/marketing/types';
import { mockAdCampaigns } from '@/modules/marketing/data/mock-data';
import {
  TrendingUp, TrendingDown, DollarSign, MousePointerClick,
  Target, BarChart3, Eye, AlertTriangle, Zap, Filter,
  ArrowUpRight, ArrowDownRight, Search, RefreshCw, Globe,
  Palette, Users, Flame,
} from 'lucide-react';

const PLATFORM_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  google: { label: 'Google', color: '#ea4335', icon: 'G' },
  meta: { label: 'Meta', color: '#1877F2', icon: 'M' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: 'L' },
  youtube: { label: 'YouTube', color: '#FF0000', icon: 'Y' },
  tiktok: { label: 'TikTok', color: '#000000', icon: 'T' },
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-500/15 text-green-600' },
  paused: { label: 'Paused', className: 'bg-amber-500/15 text-amber-600' },
  completed: { label: 'Completed', className: 'bg-blue-500/15 text-blue-600' },
  draft: { label: 'Draft', className: 'bg-gray-500/15 text-gray-500' },
};

function formatCurrency(val: number): string {
  if (val >= 1000000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
}

function formatNumber(val: number): string {
  if (val >= 1000000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toFixed(0);
}

function getFatigueLevel(impressions: number, clicks: number): { level: string; color: string } {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  if (ctr < 2) return { level: 'High', color: 'bg-red-500/15 text-red-600' };
  if (ctr < 4) return { level: 'Medium', color: 'bg-amber-500/15 text-amber-600' };
  return { level: 'Low', color: 'bg-green-500/15 text-green-600' };
}

export default function AdPerformancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('last30');

  const filteredCampaigns = useMemo(() => {
    if (platformFilter === 'all') return mockAdCampaigns;
    return mockAdCampaigns.filter(c => c.platform === platformFilter);
  }, [platformFilter]);

  const kpis = useMemo(() => {
    const active = filteredCampaigns.filter(c => c.status === 'active' || c.status === 'completed');
    const totalSpend = active.reduce((s, c) => s + c.spend, 0);
    const totalClicks = active.reduce((s, c) => s + c.clicks, 0);
    const totalConversions = active.reduce((s, c) => s + c.conversions, 0);
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgCPL = totalConversions > 0 ? totalSpend / totalConversions : 0;
    const totalRev = active.reduce((s, c) => s + c.spend * c.roas, 0);
    const overallROAS = totalSpend > 0 ? totalRev / totalSpend : 0;
    return { totalSpend, totalClicks, totalConversions, avgCPC, avgCPL, overallROAS };
  }, [filteredCampaigns]);

  const platformSummary = useMemo(() => {
    const grouped: Record<string, AdCampaign[]> = {};
    mockAdCampaigns.forEach(c => {
      if (!grouped[c.platform]) grouped[c.platform] = [];
      grouped[c.platform].push(c);
    });
    return Object.entries(grouped).map(([platform, campaigns]) => {
      const spend = campaigns.reduce((s, c) => s + c.spend, 0);
      const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
      const impressions = campaigns.reduce((s, c) => s + c.impressions, 0);
      const conversions = campaigns.reduce((s, c) => s + c.conversions, 0);
      const cpc = clicks > 0 ? spend / clicks : 0;
      const cpl = conversions > 0 ? spend / conversions : 0;
      const roas = spend > 0 ? campaigns.reduce((s, c) => s + c.spend * c.roas, 0) / spend : 0;
      const fatigue = getFatigueLevel(impressions, clicks);
      return { platform, spend, clicks, impressions, conversions, cpc, cpl, roas, fatigue };
    });
  }, []);

  const topCreatives = useMemo(() => {
    return [...mockAdCampaigns]
      .filter(c => c.status !== 'draft')
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 5);
  }, []);

  const card = (i: number) => cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]');
  const kpiCard = (i: number) => cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
            Paid Ads Analytics
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/50' : 'text-black/50')}>
            Monitor ad spend, performance, and ROI across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'google', 'meta', 'linkedin', 'youtube', 'tiktok'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                platformFilter === p
                  ? 'bg-orange-500/15 text-orange-600'
                  : isDark ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]' : 'bg-black/[0.04] text-black/50 hover:bg-black/[0.08]',
              )}
            >
              {p === 'all' ? 'All Platforms' : PLATFORM_CONFIG[p]?.label ?? p}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {['last7', 'last30', 'last90'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition',
                dateRange === range
                  ? 'bg-orange-500/15 text-orange-600'
                  : isDark ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]' : 'bg-black/[0.04] text-black/50 hover:bg-black/[0.08]',
              )}
            >
              {range === 'last7' ? '7 Days' : range === 'last30' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Spend', value: formatCurrency(kpis.totalSpend), icon: DollarSign, color: 'text-orange-500' },
          { label: 'Total Clicks', value: formatNumber(kpis.totalClicks), icon: MousePointerClick, color: 'text-blue-500' },
          { label: 'Avg CPC', value: `₹${kpis.avgCPC.toFixed(2)}`, icon: Target, color: 'text-purple-500' },
          { label: 'Avg CPL', value: formatCurrency(kpis.avgCPL), icon: BarChart3, color: 'text-green-500' },
          { label: 'Overall ROAS', value: `${kpis.overallROAS.toFixed(1)}x`, icon: TrendingUp, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={kpiCard(i)}
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{kpi.label}</span>
            </div>
            <p className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform Performance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={card(0)}
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Platform Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {platformSummary.map((p, i) => {
            const config = PLATFORM_CONFIG[p.platform];
            return (
              <div
                key={p.platform}
                className={cn(
                  'rounded-xl border p-4 space-y-3',
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: config?.color }}
                    >
                      {config?.icon}
                    </div>
                    <span className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                      {config?.label}
                    </span>
                  </div>
                  <Badge className={cn('text-[10px]', p.fatigue.color)}>{p.fatigue.level} Fatigue</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Spend</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(p.spend)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Clicks</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatNumber(p.clicks)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Impressions</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatNumber(p.impressions)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>CPC</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>₹{p.cpc.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>CPL</p>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(p.cpl)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>ROAS</p>
                    <p className={cn('text-xs font-bold', p.roas >= 4 ? 'text-green-500' : p.roas >= 2 ? 'text-amber-500' : 'text-red-500')}>
                      {p.roas.toFixed(1)}x
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Campaign Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Campaign Table</h3>
          </div>
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
            {filteredCampaigns.length} campaigns
          </span>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={cn('border-y', isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-black/[0.06] bg-black/[0.02]')}>
                {['Campaign', 'Platform', 'Status', 'Spend', 'Clicks', 'Impressions', 'CPC', 'CPL', 'ROAS', 'Conv.'].map(h => (
                  <th
                    key={h}
                    className={cn('px-4 py-3 text-left font-medium whitespace-nowrap', isDark ? 'text-white/50' : 'text-black/50')}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c, i) => {
                const config = PLATFORM_CONFIG[c.platform];
                const status = STATUS_STYLES[c.status];
                const roasColor = c.roas >= 5 ? 'text-green-500' : c.roas >= 3 ? 'text-amber-500' : c.roas > 0 ? 'text-red-500' : isDark ? 'text-white/30' : 'text-black/30';
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className={cn('border-b', isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]')}
                  >
                    <td className="px-4 py-3">
                      <p className={cn('font-medium max-w-[200px] truncate', isDark ? 'text-white' : 'text-gray-900')}>{c.name}</p>
                      <p className={cn('text-[10px] truncate mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>{c.creative}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: config?.color }}
                        >
                          {config?.icon}
                        </div>
                        <span className={isDark ? 'text-white/70' : 'text-gray-700'}>{config?.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn('text-[10px]', status.className)}>{status.label}</Badge>
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {formatCurrency(c.spend)}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {formatNumber(c.clicks)}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {formatNumber(c.impressions)}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      ₹{c.cpc.toFixed(2)}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {formatCurrency(c.cpl)}
                    </td>
                    <td className={cn('px-4 py-3 font-bold tabular-nums', roasColor)}>
                      {c.roas > 0 ? `${c.roas.toFixed(1)}x` : '—'}
                    </td>
                    <td className={cn('px-4 py-3 tabular-nums', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {c.conversions > 0 ? formatNumber(c.conversions) : '—'}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Row: Creative Performance + Audience Fatigue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creative Performance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card(0)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Top Creative Performance</h3>
          </div>
          <div className="space-y-3">
            {topCreatives.map((c, i) => {
              const config = PLATFORM_CONFIG[c.platform];
              return (
                <div
                  key={c.id}
                  className={cn(
                    'rounded-xl border p-3 flex items-center gap-3',
                    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                  )}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: config?.color }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>{c.name}</p>
                    <p className={cn('text-[10px] truncate', isDark ? 'text-white/30' : 'text-black/30')}>{c.creative}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('text-xs font-bold', c.roas >= 4 ? 'text-green-500' : 'text-amber-500')}>
                      {c.roas.toFixed(1)}x ROAS
                    </p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                      {c.conversions} conv
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Audience Fatigue Detection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card(0)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className={cn('w-4 h-4 text-orange-500')} />
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Audience Fatigue Detection</h3>
          </div>
          <div className="space-y-3">
            {platformSummary.map((p) => {
              const config = PLATFORM_CONFIG[p.platform];
              const ctr = p.impressions > 0 ? ((p.clicks / p.impressions) * 100) : 0;
              const fatigueWidth = p.fatigue.level === 'High' ? 85 : p.fatigue.level === 'Medium' ? 55 : 25;
              return (
                <div
                  key={p.platform}
                  className={cn(
                    'rounded-xl border p-3',
                    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ backgroundColor: config?.color }}
                      >
                        {config?.icon}
                      </div>
                      <span className={cn('text-xs font-medium', isDark ? 'text-white' : 'text-gray-900')}>{config?.label}</span>
                    </div>
                    <Badge className={cn('text-[10px]', p.fatigue.color)}>{p.fatigue.level}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>CTR</span>
                      <span className={cn('text-[10px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>{ctr.toFixed(2)}%</span>
                    </div>
                    <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(fatigueWidth, 100)}%` }}
                        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'h-full rounded-full',
                          p.fatigue.level === 'High' ? 'bg-red-500' : p.fatigue.level === 'Medium' ? 'bg-amber-500' : 'bg-green-500',
                        )}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Impressions</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{formatNumber(p.impressions)}</span>
                    </div>
                  </div>
                  {p.fatigue.level === 'High' && (
                    <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-red-500/5">
                      <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-red-500/80">
                        Creative refresh recommended. CTR declining significantly.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
