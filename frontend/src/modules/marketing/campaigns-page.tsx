'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Megaphone, Search, LayoutGrid, List, CalendarDays,
  Mail, MessageCircle, Smartphone, Share2, Zap, Bell,
  DollarSign, TrendingUp, Pause, Play, Copy,
  Target, Users, Sparkles, Clock, ArrowRight,
  BarChart3, Tag, Bot, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { mockCampaigns } from '@/modules/marketing/data/mock-data';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import type {
  Campaign, CampaignType, CampaignStatus, MarketingChannel,
} from '@/modules/marketing/types';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';

// ── Helpers ────────────────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

// ── Color Maps ─────────────────────────────────────────────

const typeColors: Record<CampaignType, string> = {
  'lead-gen': 'bg-sky-500/15 text-sky-400',
  nurturing: 'bg-violet-500/15 text-violet-400',
  retention: 'bg-emerald-500/15 text-emerald-400',
  'sales-push': 'bg-orange-500/15 text-orange-400',
  'brand-awareness': 'bg-pink-500/15 text-pink-400',
  reactivation: 'bg-cyan-500/15 text-cyan-400',
  event: 'bg-amber-500/15 text-amber-400',
  'product-launch': 'bg-indigo-500/15 text-indigo-400',
};

const statusColors: Record<CampaignStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  paused: 'bg-amber-500/15 text-amber-400',
  draft: 'bg-white/[0.06] text-white/40',
  scheduled: 'bg-blue-500/15 text-blue-400',
  completed: 'bg-sky-500/15 text-sky-400',
  archived: 'bg-white/[0.04] text-white/25',
};

const channelIconMap: Record<MarketingChannel, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: Smartphone,
  social: Share2,
  ads: Megaphone,
  'landing-page': Zap,
  push: Bell,
};

const channelList: MarketingChannel[] = ['email', 'whatsapp', 'sms', 'social', 'ads', 'landing-page', 'push'];
const statusList: CampaignStatus[] = ['active', 'paused', 'draft', 'scheduled', 'completed', 'archived'];

// ── Calendar colors by type ────────────────────────────────

const typeBarColors: Record<CampaignType, string> = {
  'lead-gen': 'bg-sky-500',
  nurturing: 'bg-violet-500',
  retention: 'bg-emerald-500',
  'sales-push': 'bg-orange-500',
  'brand-awareness': 'bg-pink-500',
  reactivation: 'bg-cyan-500',
  event: 'bg-amber-500',
  'product-launch': 'bg-indigo-500',
};

// ── View Mode Type ─────────────────────────────────────────

type ViewMode = 'table' | 'cards' | 'calendar';

// ── Sub-components ─────────────────────────────────────────

function ChannelBadges({ channels, isDark }: { channels: MarketingChannel[]; isDark: boolean }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {channels.map((ch) => {
        const ChIcon = channelIconMap[ch];
        return (
          <div
            key={ch}
            className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
            )}
            title={ch}
          >
            <ChIcon className="w-3 h-3" />
          </div>
        );
      })}
    </div>
  );
}

function SpendProgress({ spend, budget, isDark }: { spend: number; budget: number; isDark: boolean }) {
  const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
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
}

function KPICard({ label, value, icon: Icon, color, isDark, index }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  isDark: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
          {label}
        </span>
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <Icon className={cn('w-3.5 h-3.5', color)} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: CSS.text }}>{value}</p>
    </motion.div>
  );
}

// ── Calendar View ──────────────────────────────────────────

function CalendarView({ campaigns, isDark, onSelect }: {
  campaigns: Campaign[];
  isDark: boolean;
  onSelect: (c: Campaign) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const campaignsByDate = useMemo(() => {
    const map = new Map<number, Campaign[]>();
    campaigns.forEach((c) => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        if (date >= start && date <= end) {
          const existing = map.get(d) || [];
          if (!existing.find((x) => x.id === c.id)) {
            existing.push(c);
            map.set(d, existing);
          }
        }
      }
    });
    return map;
  }, [campaigns, year, month, daysInMonth]);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div key={d} className={cn('text-[10px] font-medium text-center py-1 uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayCampaigns = campaignsByDate.get(day) || [];
          const isToday =
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day;

          return (
            <div
              key={day}
              className={cn(
                'h-20 rounded-lg p-1 overflow-hidden transition-colors',
                isToday
                  ? (isDark ? 'bg-white/[0.04] ring-1 ring-white/10' : 'bg-black/[0.03] ring-1 ring-black/10')
                  : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]')
              )}
            >
              <span className={cn(
                'text-[10px] font-medium block mb-0.5',
                isToday
                  ? 'text-white bg-accent rounded-full w-5 h-5 flex items-center justify-center'
                  : (isDark ? 'text-white/40' : 'text-black/40')
              )}>
                {day}
              </span>
              <div className="space-y-0.5">
                {dayCampaigns.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className={cn(
                      'w-full text-[8px] leading-tight rounded px-1 py-0.5 truncate text-left transition-opacity hover:opacity-80',
                      typeBarColors[c.type],
                      isDark ? 'text-white' : 'text-white'
                    )}
                    title={c.name}
                  >
                    {c.name.slice(0, 12)}
                  </button>
                ))}
                {dayCampaigns.length > 3 && (
                  <span className={cn('text-[8px]', isDark ? 'text-white/25' : 'text-black/25')}>
                    +{dayCampaigns.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Contextual Sidebar Content ─────────────────────────────

function CampaignSidebarContent({ campaign, isDark }: { campaign: Campaign; isDark: boolean }) {
  const sectionCls = 'mb-5';
  const sectionTitleCls = cn('text-[10px] font-semibold uppercase tracking-wider mb-2', isDark ? 'text-white/30' : 'text-black/30');
  const cardCls = cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]');

  const roiColor = campaign.roi >= 300 ? 'text-emerald-400' : campaign.roi >= 150 ? 'text-amber-400' : campaign.roi > 0 ? 'text-red-400' : '';

  return (
    <div className="space-y-1">
      {/* Overview */}
      <div className={sectionCls}>
        <h4 className={sectionTitleCls}>Overview</h4>
        <div className={cardCls}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Type</p>
              <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 mt-1 capitalize', typeColors[campaign.type])}>
                {campaign.type.replace('-', ' ')}
              </Badge>
            </div>
            <div>
              <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Status</p>
              <Badge variant="secondary" className={cn('text-[10px] px-2 py-0 mt-1 capitalize', statusColors[campaign.status])}>
                {campaign.status}
              </Badge>
            </div>
            <div>
              <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Owner</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: CSS.text }}>{campaign.owner}</p>
            </div>
            <div>
              <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Schedule</p>
              <p className="text-xs mt-0.5" style={{ color: CSS.textSecondary }}>
                {campaign.startDate} → {campaign.endDate}
              </p>
            </div>
          </div>
          <p className={cn('text-xs mt-3 leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={sectionCls}>
        <h4 className={sectionTitleCls}>Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Budget', value: formatINR(campaign.budget), icon: DollarSign },
            { label: 'Spend', value: formatINR(campaign.spend), icon: TrendingUp },
            { label: 'Revenue', value: formatINR(campaign.revenue), icon: BarChart3 },
            { label: 'ROI', value: `${campaign.roi}%`, icon: Target, color: roiColor },
            { label: 'Clicks', value: campaign.clicks.toLocaleString(), icon: Zap },
            { label: 'Leads', value: campaign.leads.toLocaleString(), icon: Users },
          ].map((m) => (
            <div key={m.label} className={cardCls}>
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                <span className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>{m.label}</span>
              </div>
              <p className={cn('text-sm font-bold', m.color || '')} style={m.color ? undefined : { color: CSS.text }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
        {/* Spend Progress */}
        <div className={cn('mt-2', cardCls)}>
          <div className="flex items-center justify-between mb-1">
            <span className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Budget Utilization</span>
            <span className="text-xs font-medium" style={{ color: CSS.text }}>
              {campaign.budget > 0 ? Math.round((campaign.spend / campaign.budget) * 100) : 0}%
            </span>
          </div>
          <div className={cn('w-full h-2 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
            <div
              className={cn(
                'h-full rounded-full transition-all',
                campaign.budget > 0 && campaign.spend / campaign.budget > 0.8
                  ? 'bg-red-500'
                  : campaign.budget > 0 && campaign.spend / campaign.budget > 0.6
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(campaign.budget > 0 ? (campaign.spend / campaign.budget) * 100 : 0, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{formatINR(campaign.spend)} spent</span>
            <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{formatINR(campaign.budget)} budget</span>
          </div>
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className={sectionCls}>
        <h4 className={sectionTitleCls}>Channel Breakdown</h4>
        <div className={cardCls}>
          <div className="flex flex-wrap gap-2">
            {campaign.channels.map((ch) => {
              const ChIcon = channelIconMap[ch];
              return (
                <div key={ch} className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                  <ChIcon className={cn('w-3.5 h-3.5', isDark ? 'text-white/50' : 'text-black/50')} />
                  <span className="text-xs capitalize" style={{ color: CSS.textSecondary }}>{ch}</span>
                </div>
              );
            })}
          </div>
          {campaign.channelConfig && campaign.channelConfig.length > 0 && (
            <div className="mt-3 space-y-2">
              {campaign.channelConfig.filter((cc) => cc.enabled).map((cc) => {
                const ChIcon = channelIconMap[cc.channel];
                return (
                  <div key={cc.channel} className="flex items-start gap-2">
                    <ChIcon className={cn('w-3 h-3 mt-0.5 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium capitalize" style={{ color: CSS.text }}>{cc.channel}</p>
                      {cc.content.ctaText && (
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>CTA: {cc.content.ctaText}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Offer Details */}
      {campaign.offer && (
        <div className={sectionCls}>
          <h4 className={sectionTitleCls}>Offer Details</h4>
          <div className={cardCls}>
            <div className="flex items-center gap-2 mb-2">
              <Tag className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
              <span className="text-xs font-medium capitalize" style={{ color: CSS.text }}>
                {campaign.offer.type.replace('-', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {campaign.offer.discountType && campaign.offer.discountValue && (
                <div>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Discount</span>
                  <p className="font-medium" style={{ color: CSS.text }}>
                    {campaign.offer.discountType === 'percentage' ? `${campaign.offer.discountValue}%` : formatINR(campaign.offer.discountValue)}
                  </p>
                </div>
              )}
              {campaign.offer.couponCode && (
                <div>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Coupon</span>
                  <p className="font-mono font-medium" style={{ color: CSS.accent }}>{campaign.offer.couponCode}</p>
                </div>
              )}
              {campaign.offer.expiryDate && (
                <div>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Expiry</span>
                  <p style={{ color: CSS.textSecondary }}>{campaign.offer.expiryDate}</p>
                </div>
              )}
              {campaign.offer.usageLimit && (
                <div>
                  <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Usage Limit</span>
                  <p style={{ color: CSS.textSecondary }}>{campaign.offer.usageLimit.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Automations */}
      {campaign.automations && campaign.automations.length > 0 && (
        <div className={sectionCls}>
          <h4 className={sectionTitleCls}>Automations</h4>
          <div className="space-y-2">
            {campaign.automations.map((auto) => (
              <div key={auto.id} className={cardCls}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={cn('w-3 h-3', isDark ? 'text-white/30' : 'text-black/30')} />
                    <span className="text-xs font-medium" style={{ color: CSS.text }}>{auto.name}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn('text-[9px] px-1.5 py-0', auto.enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/30')}
                  >
                    {auto.enabled ? 'On' : 'Off'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Trigger:</span>
                  <span className={cn('text-[10px] capitalize', isDark ? 'text-white/40' : 'text-black/40')}>{auto.trigger.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Actions:</span>
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
                    {auto.actions.map((a) => a.type.replace('-', ' ')).join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {campaign.aiOptimizations && campaign.aiOptimizations.length > 0 && (
        <div className={sectionCls}>
          <h4 className={sectionTitleCls}>AI Suggestions</h4>
          <div className="space-y-2">
            {campaign.aiOptimizations.map((ai) => {
              const impactColors: Record<string, string> = {
                low: 'bg-white/[0.06] text-white/40',
                medium: 'bg-amber-500/15 text-amber-400',
                high: 'bg-orange-500/15 text-orange-400',
                critical: 'bg-red-500/15 text-red-400',
              };
              return (
                <div key={ai.id} className={cardCls}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className={cn('w-3 h-3 shrink-0', isDark ? 'text-amber-400/60' : 'text-amber-500/60')} />
                      <span className="text-xs font-medium truncate" style={{ color: CSS.text }}>{ai.title}</span>
                    </div>
                    <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 shrink-0', impactColors[ai.impact] || impactColors.low)}>
                      {ai.impact}
                    </Badge>
                  </div>
                  <p className={cn('text-[11px] mt-1.5 leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
                    {ai.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      Confidence: {ai.confidence}%
                    </span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      Potential: +{ai.potentialImprovement}%
                    </span>
                  </div>
                  {!ai.applied && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 mt-2 text-[10px] gap-1"
                      style={{ color: CSS.accent }}
                    >
                      <Bot className="w-3 h-3" />
                      Apply Suggestion
                    </Button>
                  )}
                  {ai.applied && (
                    <Badge variant="secondary" className="mt-2 text-[9px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400">
                      Applied
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

export default function CampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useMarketingStore((s) => s.navigateTo);
  const selectedCampaignId = useMarketingStore((s) => s.selectedCampaignId);
  const contextualSidebarOpen = useMarketingStore((s) => s.contextualSidebarOpen);
  const selectCampaign = useMarketingStore((s) => s.selectCampaign);
  const setContextualSidebarOpen = useMarketingStore((s) => s.setContextualSidebarOpen);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [channelFilter, setChannelFilter] = useState<MarketingChannel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Filtered campaigns ──────────────────────────────────
  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((c) => {
      if (channelFilter !== 'all' && !c.channels.includes(channelFilter)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [channelFilter, statusFilter, searchQuery]);

  // ── Stats ───────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = mockCampaigns.filter((c) => c.status === 'active');
    return {
      active: active.length,
      totalBudget: mockCampaigns.reduce((s, c) => s + c.budget, 0),
      totalRevenue: mockCampaigns.reduce((s, c) => s + c.revenue, 0),
      avgRoi: Math.round(active.reduce((s, c) => s + c.roi, 0) / Math.max(active.length, 1)),
    };
  }, []);

  // ── Selected campaign ───────────────────────────────────
  const selectedCampaign = useMemo(
    () => mockCampaigns.find((c) => c.id === selectedCampaignId) || null,
    [selectedCampaignId]
  );

  // ── Row click handler ───────────────────────────────────
  const handleRowClick = useCallback((row: Record<string, unknown>) => {
    const c = row as unknown as Campaign;
    selectCampaign(c.id);
  }, [selectCampaign]);

  const handleCardClick = useCallback((c: Campaign) => {
    selectCampaign(c.id);
  }, [selectCampaign]);

  const handleCloseSidebar = useCallback(() => {
    setContextualSidebarOpen(false);
  }, [setContextualSidebarOpen]);

  // ── Table columns ───────────────────────────────────────
  const tableColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Campaign',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Campaign;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{c.name}</p>
            <p className={cn('text-[10px] truncate max-w-[200px]', isDark ? 'text-white/30' : 'text-black/30')}>{c.description}</p>
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
      render: (row) => <ChannelBadges channels={(row as unknown as Campaign).channels} isDark={isDark} />,
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: CSS.text }}>
          {formatINR((row as unknown as Campaign).budget)}
        </span>
      ),
    },
    {
      key: 'spend',
      label: 'Spend',
      sortable: true,
      render: (row) => <SpendProgress spend={(row as unknown as Campaign).spend} budget={(row as unknown as Campaign).budget} isDark={isDark} />,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium" style={{ color: CSS.text }}>
          {formatINR((row as unknown as Campaign).revenue)}
        </span>
      ),
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
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>{(row as unknown as Campaign).owner}</span>
      ),
    },
  ], [isDark]);

  // ── Pill button style helper ────────────────────────────
  const pillCls = (active: boolean) =>
    cn(
      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
      active
        ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
        : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
    );

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <PageShell
        title="Campaigns"
        subtitle="Manage all marketing campaigns"
        icon={Megaphone}
        badge={filteredCampaigns.length}
        onCreate={() => navigateTo('campaign-builder')}
        createLabel="Create Campaign"
      >
        <div className="space-y-5">
          {/* ── Search + Filters + View Toggle ────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Search + View Toggle Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 max-w-sm',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'bg-transparent text-sm focus:outline-none w-full',
                    isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                  )}
                  aria-label="Search campaigns"
                />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* View Toggle */}
              <div className={cn('flex rounded-xl border p-0.5', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                {([
                  { mode: 'table' as ViewMode, icon: List, label: 'Table' },
                  { mode: 'cards' as ViewMode, icon: LayoutGrid, label: 'Cards' },
                  { mode: 'calendar' as ViewMode, icon: CalendarDays, label: 'Calendar' },
                ]).map(({ mode, icon: VIcon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors flex items-center gap-1.5',
                      viewMode === mode
                        ? (isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black')
                        : (isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60')
                    )}
                    aria-label={`${label} view`}
                    title={label}
                  >
                    <VIcon className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Pills */}
            <div className={cn('rounded-2xl border p-3 flex flex-wrap gap-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              {/* Channel filter */}
              <div>
                <p className={cn('text-[10px] uppercase tracking-wider mb-1.5 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Channel</p>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => setChannelFilter('all')} className={pillCls(channelFilter === 'all')}>All</button>
                  {channelList.map((ch) => (
                    <button key={ch} onClick={() => setChannelFilter(ch)} className={pillCls(channelFilter === ch)}>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px self-stretch mx-1" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

              {/* Status filter */}
              <div>
                <p className={cn('text-[10px] uppercase tracking-wider mb-1.5 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Status</p>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => setStatusFilter('all')} className={pillCls(statusFilter === 'all')}>All</button>
                  {statusList.map((st) => (
                    <button key={st} onClick={() => setStatusFilter(st)} className={pillCls(statusFilter === st)}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Stats Row ────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Active Campaigns" value={stats.active} icon={Zap} color="text-emerald-400" isDark={isDark} index={0} />
            <KPICard label="Total Budget" value={formatINR(stats.totalBudget)} icon={DollarSign} color="text-sky-400" isDark={isDark} index={1} />
            <KPICard label="Total Revenue" value={formatINR(stats.totalRevenue)} icon={TrendingUp} color="text-amber-400" isDark={isDark} index={2} />
            <KPICard label="Avg ROI" value={`${stats.avgRoi}%`} icon={Target} color="text-violet-400" isDark={isDark} index={3} />
          </div>

          {/* ── Results count ────────────────────────────── */}
          <div className="flex items-center justify-between">
            <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
              Showing {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* ── Table View ───────────────────────────────── */}
          <AnimatePresence mode="wait">
            {viewMode === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmartDataTable
                  data={filteredCampaigns as unknown as Record<string, unknown>[]}
                  columns={tableColumns}
                  onRowClick={handleRowClick}
                  searchable={false}
                  enableExport
                  pageSize={10}
                  density="compact"
                  emptyMessage="No campaigns match your filters"
                />
              </motion.div>
            )}

            {/* ── Cards View ──────────────────────────────── */}
            {viewMode === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {filteredCampaigns.length === 0 ? (
                  <div className="py-12 text-center">
                    <Megaphone className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-white/15' : 'text-black/15')} />
                    <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No campaigns match your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCampaigns.map((campaign, i) => (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => handleCardClick(campaign)}
                        className={cn(
                          'rounded-2xl border p-5 transition-all duration-200 cursor-pointer',
                          isDark
                            ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                            : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                        )}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold truncate" style={{ color: CSS.text }}>{campaign.name}</h3>
                              <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 shrink-0 capitalize', typeColors[campaign.type])}>
                                {campaign.type.replace('-', ' ')}
                              </Badge>
                            </div>
                            <p className={cn('text-xs line-clamp-1', isDark ? 'text-white/40' : 'text-black/40')}>{campaign.description}</p>
                          </div>
                          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 shrink-0 ml-2 capitalize', statusColors[campaign.status])}>
                            {campaign.status}
                          </Badge>
                        </div>

                        {/* Channel icons */}
                        <div className="mb-3">
                          <ChannelBadges channels={campaign.channels} isDark={isDark} />
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Budget</p>
                            <p className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(campaign.budget)}</p>
                          </div>
                          <div>
                            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Spend</p>
                            <SpendProgress spend={campaign.spend} budget={campaign.budget} isDark={isDark} />
                          </div>
                          <div>
                            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>ROI</p>
                            <p className={cn('text-sm font-bold', campaign.roi >= 300 ? 'text-emerald-500' : campaign.roi >= 150 ? 'text-amber-500' : campaign.roi > 0 ? 'text-red-500' : '')} style={campaign.roi === 0 ? { color: CSS.textMuted } : undefined}>
                              {campaign.roi > 0 ? `${campaign.roi}%` : '—'}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                          <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
                            {campaign.owner} · {campaign.startDate}
                          </span>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn('h-7 w-7 rounded-lg', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                              aria-label={campaign.status === 'active' ? 'Pause campaign' : 'Resume campaign'}
                            >
                              {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn('h-7 w-7 rounded-lg', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                              aria-label="Duplicate campaign"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Calendar View ───────────────────────────── */}
            {viewMode === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <CalendarView campaigns={filteredCampaigns} isDark={isDark} onSelect={handleCardClick} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageShell>

      {/* ── Contextual Sidebar ─────────────────────────────── */}
      <ContextualSidebar
        open={contextualSidebarOpen && !!selectedCampaign}
        onClose={handleCloseSidebar}
        title={selectedCampaign?.name || ''}
        subtitle={selectedCampaign ? selectedCampaign.type.replace('-', ' ') : ''}
        icon={Megaphone}
        width={420}
        footer={
          selectedCampaign ? (
            <Button
              onClick={() => {
                if (selectedCampaign) {
                  navigateTo('campaign-builder');
                }
              }}
              className="w-full gap-2"
              style={{ backgroundColor: CSS.accent, color: '#fff' }}
            >
              Edit Campaign
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : undefined
        }
      >
        {selectedCampaign && (
          <CampaignSidebarContent campaign={selectedCampaign} isDark={isDark} />
        )}
      </ContextualSidebar>
    </>
  );
}
