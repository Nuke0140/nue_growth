'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Megaphone, Plus, Search, Filter, LayoutGrid, List, Mail,
  MessageCircle, Smartphone, Share2, DollarSign, TrendingUp,
  ChevronRight, Pause, Play, Copy, Eye,
  MoreHorizontal, Zap
} from 'lucide-react';
import { mockCampaigns } from '@/modules/marketing/data/mock-data';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type { Campaign, CampaignType, CampaignStatus, MarketingChannel } from '@/modules/marketing/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const typeColors: Record<CampaignType, string> = {
  'lead-gen': 'bg-sky-500/15 text-sky-400',
  nurturing: 'bg-violet-500/15 text-violet-400',
  retention: 'bg-emerald-500/15 text-emerald-400',
  'sales-push': 'bg-orange-500/15 text-orange-400',
  'brand-awareness': 'bg-pink-500/15 text-pink-400',
  reactivation: 'bg-cyan-500/15 text-cyan-400',
};

const statusColors: Record<CampaignStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  paused: 'bg-amber-500/15 text-amber-400',
  draft: 'bg-white/[0.06] text-white/40',
  completed: 'bg-sky-500/15 text-sky-400',
  archived: 'bg-white/[0.04] text-white/25',
};

const channelIcons: Record<MarketingChannel, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: Smartphone,
  social: Share2,
  ads: Megaphone,
  'landing-page': Zap,
};

const channels: MarketingChannel[] = ['email', 'whatsapp', 'sms', 'social', 'ads', 'landing-page'];
const statuses: CampaignStatus[] = ['active', 'paused', 'draft', 'completed', 'archived'];

export default function CampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [channelFilter, setChannelFilter] = useState<MarketingChannel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((c: Campaign) => {
      if (channelFilter !== 'all' && !c.channels.includes(channelFilter)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [channelFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const active = mockCampaigns.filter((c: Campaign) => c.status === 'active');
    return {
      active: active.length,
      totalBudget: mockCampaigns.reduce((s: number, c: Campaign) => s + c.budget, 0),
      totalSpend: mockCampaigns.reduce((s: number, c: Campaign) => s + c.spend, 0),
      avgRoi: Math.round(active.reduce((s: number, c: Campaign) => s + c.roi, 0) / Math.max(active.length, 1)),
    };
  }, []);

  const renderChannelBadges = (campaignChannels: MarketingChannel[]) => (
    <div className="flex gap-1 flex-wrap">
      {campaignChannels.map(ch => {
        const ChIcon = channelIcons[ch];
        return (
          <div key={ch} className={cn('w-6 h-6 rounded-md flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} title={ch}>
            <ChIcon className="w-3 h-3" />
          </div>
        );
      })}
    </div>
  );

  const renderSpendProgress = (spend: number, budget: number) => {
    const pct = Math.round((spend / budget) * 100);
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{formatINR(spend)}</span>
        <div className={cn('w-16 h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{pct}%</span>
      </div>
    );
  };

  const campaignsColumns: DataTableColumnDef[] = [
    {
      key: 'name',
      label: 'Campaign',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{c.name}</p>
            <p className="text-[10px] truncate max-w-[160px]" style={{ color: CSS.textMuted }}>{c.description}</p>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', typeColors[c.type])}>
            {c.type.replace('-', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'channels',
      label: 'Channels',
      render: (row) => renderChannelBadges((row as unknown as Campaign).channels),
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (row) => <span className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR((row as unknown as Campaign).budget)}</span>,
    },
    {
      key: 'spend',
      label: 'Spend',
      sortable: true,
      render: (row) => renderSpendProgress((row as unknown as Campaign).spend, (row as unknown as Campaign).budget),
    },
    {
      key: 'metrics',
      label: 'Metrics',
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <div className="flex items-center gap-2 text-xs">
            <span title="Clicks">{c.clicks.toLocaleString()}<span style={{ color: CSS.textDisabled, marginLeft: '2px' }}>clk</span></span>
            <span style={{ color: CSS.border }}>|</span>
            <span title="Leads">{c.leads.toLocaleString()}<span style={{ color: CSS.textDisabled, marginLeft: '2px' }}>ld</span></span>
            <span style={{ color: CSS.border }}>|</span>
            <span title="Conversions">{c.conversions}<span style={{ color: CSS.textDisabled, marginLeft: '2px' }}>cv</span></span>
          </div>
        );
      },
    },
    {
      key: 'roi',
      label: 'ROI',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        const roiColor = c.roi >= 300 ? '#10b981' : c.roi >= 150 ? '#f59e0b' : c.roi > 0 ? '#ef4444' : CSS.textMuted;
        return (
          <span className="text-sm font-semibold" style={{ color: roiColor }}>
            {c.roi > 0 ? `${c.roi}%` : '—'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', statusColors[c.status])}>
            {c.status}
          </Badge>
        );
      },
    },
    {
      key: 'owner',
      label: 'Owner',
      sortable: true,
      render: (row) => <span className="text-xs" style={{ color: CSS.textSecondary }}>{(row as unknown as Campaign).owner}</span>,
    },
  ];

  const renderCampaignCard = (campaign: Campaign, index: number) => (
    <motion.div
      key={campaign.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 transition-all duration-200',
        isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate">{campaign.name}</h3>
            <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 shrink-0', typeColors[campaign.type])}>
              {campaign.type}
            </Badge>
          </div>
          <p className={cn('text-xs line-clamp-1', isDark ? 'text-white/40' : 'text-black/40')}>{campaign.description}</p>
        </div>
        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 shrink-0 ml-2', statusColors[campaign.status])}>
          {campaign.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-3">
        {renderChannelBadges(campaign.channels)}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Budget</p>
          <p className="text-sm font-medium">{formatINR(campaign.budget)}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Spend</p>
          {renderSpendProgress(campaign.spend, campaign.budget)}
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>ROI</p>
          <p className={cn('text-sm font-bold', campaign.roi >= 300 ? 'text-emerald-500' : campaign.roi >= 150 ? 'text-amber-500' : 'text-red-500')}>
            {campaign.roi}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <Eye className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{campaign.clicks.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{campaign.leads.toLocaleString()} leads</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{campaign.conversions} conv</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
        <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
          {campaign.owner} · {campaign.startDate}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
            {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Megaphone className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">Campaigns</h1>
                <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                  {mockCampaigns.length}
                </Badge>
              </div>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Manage and track all marketing campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-48',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')}
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('h-9 w-9 rounded-xl p-0', isDark ? 'hover:bg-white/[0.06] text-white/50' : 'hover:bg-black/[0.06] text-black/50')}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigateTo('campaign-builder')}
              className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Campaign</span>
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={cn('rounded-2xl border p-4 flex flex-wrap gap-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-2 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Channel</p>
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setChannelFilter('all')}
                      className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                        channelFilter === 'all'
                          ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                          : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                      )}
                    >All</button>
                    {channels.map(ch => (
                      <button
                        key={ch}
                        onClick={() => setChannelFilter(ch)}
                        className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
                          channelFilter === ch
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                        )}
                      >{ch}</button>
                    ))}
                  </div>
                </div>
                <div className="w-px self-stretch mx-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-2 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Status</p>
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                        statusFilter === 'all'
                          ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                          : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                      )}
                    >All</button>
                    {statuses.map(st => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
                          statusFilter === st
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                        )}
                      >{st}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Campaigns', value: stats.active, icon: Zap, color: 'text-emerald-400' },
            { label: 'Total Budget', value: formatINR(stats.totalBudget), icon: DollarSign, color: 'text-sky-400' },
            { label: 'Total Spend', value: formatINR(stats.totalSpend), icon: TrendingUp, color: 'text-amber-400' },
            { label: 'Avg ROI', value: `${stats.avgRoi}%`, icon: Megaphone, color: 'text-violet-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
            Showing {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </p>
          <div className={cn('flex rounded-xl border p-0.5', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'table'
                  ? (isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black')
                  : (isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60')
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'cards'
                  ? (isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black')
                  : (isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60')
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <SmartDataTable
            data={filteredCampaigns as unknown as Record<string, unknown>[]}
            columns={campaignsColumns}
            searchable enableExport pageSize={10}
            emptyMessage="No campaigns match your filters"
            actions={(row) => {
              const c = row as unknown as Campaign;
              return (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-[var(--app-hover-bg)]">
                    {c.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-[var(--app-hover-bg)]">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            }}
          />
        )}

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign: Campaign, i) => renderCampaignCard(campaign, i))}
            {filteredCampaigns.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Megaphone className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-white/15' : 'text-black/15')} />
                <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No campaigns match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
