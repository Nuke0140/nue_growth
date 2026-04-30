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
  ChevronRight, ArrowUpDown, Pause, Play, Copy, Eye,
  MoreHorizontal, Zap
} from 'lucide-react';
import { mockCampaigns } from '@/modules/marketing/data/mock-data';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type { Campaign, CampaignType, CampaignStatus, MarketingChannel } from '@/modules/marketing/types';

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
          <div key={ch} className={cn('w-6 h-6 rounded-md flex items-center justify-center', 'bg-[var(--app-hover-bg)]')} title={ch}>
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
        <div className={cn('w-16 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{pct}%</span>
      </div>
    );
  };

  const renderCampaignCard = (campaign: Campaign, index: number) => (
    <motion.div
      key={campaign.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 transition-all duration-200',
        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
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
          <p className={cn('text-xs line-clamp-1', 'text-[var(--app-text-muted)]')}>{campaign.description}</p>
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
          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Budget</p>
          <p className="text-sm font-medium">{formatINR(campaign.budget)}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Spend</p>
          {renderSpendProgress(campaign.spend, campaign.budget)}
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>ROI</p>
          <p className={cn('text-sm font-bold', campaign.roi >= 300 ? 'text-emerald-500' : campaign.roi >= 150 ? 'text-amber-500' : 'text-red-500')}>
            {campaign.roi}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <Eye className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{campaign.clicks.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{campaign.leads.toLocaleString()} leads</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{campaign.conversions} conv</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--app-hover-bg)' }}>
        <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
          {campaign.owner} · {campaign.startDate}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', 'hover:bg-[var(--app-hover-bg)]')}>
            {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', 'hover:bg-[var(--app-hover-bg)]')}>
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
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Megaphone className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">Campaigns</h1>
                <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                  {mockCampaigns.length}
                </Badge>
              </div>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage and track all marketing campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-48',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')}
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('h-9 w-9 rounded-xl p-0', 'hover:bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigateTo('campaign-builder')}
              className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}
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
              <div className={cn('rounded-2xl border p-4 flex flex-wrap gap-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-2 font-medium', 'text-[var(--app-text-muted)]')}>Channel</p>
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setChannelFilter('all')}
                      className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                        channelFilter === 'all'
                          ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
                          : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                      )}
                    >All</button>
                    {channels.map(ch => (
                      <button
                        key={ch}
                        onClick={() => setChannelFilter(ch)}
                        className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
                          channelFilter === ch
                            ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
                            : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                        )}
                      >{ch}</button>
                    ))}
                  </div>
                </div>
                <div className="w-px self-stretch mx-2" style={{ backgroundColor: 'var(--app-border)' }} />
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-2 font-medium', 'text-[var(--app-text-muted)]')}>Status</p>
                  <div className="flex gap-1 flex-wrap">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                        statusFilter === 'all'
                          ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
                          : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
                      )}
                    >All</button>
                    {statuses.map(st => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={cn('px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors',
                          statusFilter === st
                            ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
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
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <p className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
            Showing {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
          </p>
          <div className={cn('flex rounded-xl border p-0.5', 'border-[var(--app-border)]')}>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'table'
                  ? (isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]')
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
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]')
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Campaign', 'Type', 'Channels', 'Budget', 'Spend', 'Metrics', 'ROI', 'Status', 'Owner', 'Actions'].map(h => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider py-3 px-3', 'text-[var(--app-text-muted)]')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign: Campaign, i) => (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.03, duration: 0.3 }}
                      className={cn(
                        'border-b transition-colors',
                        'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                      )}
                    >
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className={cn('text-[10px] truncate max-w-[160px]', 'text-[var(--app-text-muted)]')}>{campaign.description}</p>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', typeColors[campaign.type])}>
                          {campaign.type.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">{renderChannelBadges(campaign.channels)}</td>
                      <td className="py-3 px-3 text-sm font-medium">{formatINR(campaign.budget)}</td>
                      <td className="py-3 px-3">{renderSpendProgress(campaign.spend, campaign.budget)}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span title="Clicks">{campaign.clicks.toLocaleString()}<span className={cn(' ml-0.5', 'text-[var(--app-text-disabled)]')}>clk</span></span>
                          <span className={cn('text-[var(--app-text-disabled)]')}>|</span>
                          <span title="Leads">{campaign.leads.toLocaleString()}<span className={cn(' ml-0.5', 'text-[var(--app-text-disabled)]')}>ld</span></span>
                          <span className={cn('text-[var(--app-text-disabled)]')}>|</span>
                          <span title="Conversions">{campaign.conversions}<span className={cn(' ml-0.5', 'text-[var(--app-text-disabled)]')}>cv</span></span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          'text-sm font-semibold',
                          campaign.roi >= 300 ? 'text-emerald-500' : campaign.roi >= 150 ? 'text-amber-500' : campaign.roi > 0 ? 'text-red-500' : ('text-[var(--app-text-muted)]')
                        )}>
                          {campaign.roi > 0 ? `${campaign.roi}%` : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', statusColors[campaign.status])}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{campaign.owner}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', 'hover:bg-[var(--app-hover-bg)]')}>
                            {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className={cn('h-7 w-7 rounded-lg', 'hover:bg-[var(--app-hover-bg)]')}>
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredCampaigns.length === 0 && (
              <div className="py-12 text-center">
                <Megaphone className={cn('w-8 h-8 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
                <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No campaigns match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign: Campaign, i) => renderCampaignCard(campaign, i))}
            {filteredCampaigns.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Megaphone className={cn('w-8 h-8 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
                <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No campaigns match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
