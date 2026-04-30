'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Megaphone, Plus, BarChart3, Users, ArrowUpRight, IndianRupee,
  Clock, Calendar, Filter, Mail, MessageCircle, Smartphone, Layers,
  Zap, Target, CheckCircle2, PauseCircle, FileEdit, TrendingUp
} from 'lucide-react';
import { winbackCampaigns } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { WinbackCampaign } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

export default function WinbackCampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const summary = useMemo(() => {
    const active = winbackCampaigns.filter((c) => c.status === 'active').length;
    const totalSent = winbackCampaigns.reduce((s, c) => s + c.sentCount, 0);
    const reactivated = winbackCampaigns.reduce((s, c) => s + c.reactivated, 0);
    const avgSuccess = winbackCampaigns.filter((c) => c.successRate > 0).length > 0
      ? winbackCampaigns.filter((c) => c.successRate > 0).reduce((s, c) => s + c.successRate, 0) / winbackCampaigns.filter((c) => c.successRate > 0).length
      : 0;
    return { active, totalSent, reactivated, avgSuccess };
  }, []);

  const filtered = useMemo(() => {
    let result = filterStatus === 'all' ? [...winbackCampaigns] : winbackCampaigns.filter((c) => c.status === filterStatus);
    if (filterChannel !== 'all') result = result.filter((c) => c.channel === filterChannel);
    return result;
  }, [filterStatus, filterChannel]);

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    active: { bg: 'bg-[var(--app-success-bg)]', text: 'text-emerald-500', icon: Zap, label: 'Active' },
    completed: { bg: isDark ? 'bg-sky-500/15' : 'bg-sky-50', text: 'text-sky-500', icon: CheckCircle2, label: 'Completed' },
    draft: { bg: isDark ? 'bg-slate-500/15' : 'bg-slate-100', text: 'text-slate-500', icon: FileEdit, label: 'Draft' },
    paused: { bg: 'bg-[var(--app-warning-bg)]', text: 'text-amber-500', icon: PauseCircle, label: 'Paused' },
  };

  const channelConfig: Record<string, { bg: string; text: string; label: string }> = {
    email: { bg: isDark ? 'bg-sky-500/15' : 'bg-sky-50', text: 'text-sky-500', label: 'Email' },
    whatsapp: { bg: 'bg-green-500/15', text: 'text-green-500', label: 'WhatsApp' },
    sms: { bg: 'bg-[var(--app-purple-light)]', text: 'text-violet-500', label: 'SMS' },
    multi: { bg: 'bg-[var(--app-warning-bg)]', text: 'text-amber-500', label: 'Multi-Channel' },
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'sms': return Smartphone;
      default: return Layers;
    }
  };

  const successAnalytics = useMemo(() => winbackCampaigns
    .filter((c) => c.successRate > 0)
    .map((c) => ({ name: c.name.slice(0, 18), rate: c.successRate, reactivated: c.reactivated, sent: c.sentCount })),
  []);

  const inactivitySegments = useMemo(() => {
    const segments: Record<string, { sent: number; reactivated: number }> = {};
    winbackCampaigns.forEach((c) => {
      const key = c.segment;
      if (!segments[key]) segments[key] = { sent: 0, reactivated: 0 };
      segments[key].sent += c.sentCount;
      segments[key].reactivated += c.reactivated;
    });
    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      rate: data.sent > 0 ? (data.reactivated / data.sent) * 100 : 0,
      sent: data.sent,
      reactivated: data.reactivated,
    }));
  }, []);

  const maxRate = Math.max(...successAnalytics.map((s) => s.rate), 1);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Megaphone className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Win-back Campaigns</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Win-back Campaign System</p>
            </div>
          </div>
          <Button
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Campaigns', value: summary.active.toString(), icon: Zap, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
            { label: 'Total Sent', value: summary.totalSent.toString(), icon: Mail, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
            { label: 'Total Reactivated', value: summary.reactivated.toString(), icon: Users, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
            { label: 'Avg Success Rate', value: `${summary.avgSuccess.toFixed(1)}%`, icon: Target, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', item.bg)}>
                  <item.icon className={cn('w-4 h-4', item.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-[10px] font-medium mr-1', 'text-[var(--app-text-muted)]')}>Status:</span>
          {['all', 'active', 'completed', 'draft', 'paused'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-2.5 py-1 text-[10px] font-medium rounded-[var(--app-radius-lg)] transition-colors capitalize',
                filterStatus === s
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
              )}
            >
              {s}
            </button>
          ))}
          <span className={cn('text-[10px] font-medium mx-2', 'text-[var(--app-text-disabled)]')}>|</span>
          <span className={cn('text-[10px] font-medium mr-1', isDark ? 'text-white/30' : 'text/black/30')}>Channel:</span>
          {['all', 'email', 'whatsapp', 'sms', 'multi'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={cn(
                'px-2.5 py-1 text-[10px] font-medium rounded-[var(--app-radius-lg)] transition-colors capitalize',
                filterChannel === ch
                  ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                  : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]')
              )}
            >
              {ch === 'all' ? 'All' : ch}
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        <div className="space-y-3">
          {filtered.map((campaign: WinbackCampaign, i) => {
            const sConfig = statusConfig[campaign.status] || statusConfig.draft;
            const cConfig = channelConfig[campaign.channel] || channelConfig.email;
            const ChannelIcon = getChannelIcon(campaign.channel);
            const StatusIcon = sConfig.icon;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold">{campaign.name}</h3>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 gap-1', sConfig.bg, sConfig.text)}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {sConfig.label}
                      </Badge>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 gap-1', cConfig.bg, cConfig.text)}>
                        <ChannelIcon className="w-2.5 h-2.5" />
                        {cConfig.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        <Users className="w-4 h-4 inline mr-1" />{campaign.segment}
                      </span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        <Clock className="w-4 h-4 inline mr-1" />{campaign.inactivityDays}
                      </span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        <IndianRupee className="w-4 h-4 inline mr-1" />{campaign.offerType}: {campaign.offerValue > 0 ? `${campaign.offerValue}%` : campaign.offerValue === 0 ? 'Free' : formatINR(campaign.offerValue)}
                      </span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        <Clock className="w-4 h-4 inline mr-1" />Best: {campaign.bestSendTime}
                      </span>
                      {campaign.launchedDate !== '—' && (
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          <Calendar className="w-4 h-4 inline mr-1" />{campaign.launchedDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className={cn('w-20 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${campaign.successRate}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                            className={cn('h-full rounded-full', campaign.successRate >= 50 ? (isDark ? 'bg-emerald-500/40' : 'bg-emerald-400') : (isDark ? 'bg-amber-500/40' : 'bg-amber-400'))}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium', campaign.successRate >= 50 ? 'text-emerald-500' : 'text-amber-500')}>
                          {campaign.successRate > 0 ? `${campaign.successRate}%` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {campaign.sentCount} sent
                        </span>
                        <span className={cn('text-[10px] font-medium', 'text-[var(--app-success)]')}>
                          {campaign.reactivated} back
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Success Rate Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Success Rate Analytics</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {successAnalytics.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.rate.toFixed(0)}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.rate / maxRate) * 100}%` }}
                  transition={{ delay: 0.55 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', entry.rate >= 50 ? ('bg-[var(--app-success)]') : ('bg-[var(--app-warning)]'))}
                />
                <span className={cn('text-[7px] text-center truncate w-full', 'text-[var(--app-text-disabled)]')}>{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inactivity Segment Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Inactivity Segment Breakdown</span>
            </div>
          </div>
          <div className="space-y-3">
            {inactivitySegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={cn('text-[10px] w-28 shrink-0 font-medium truncate', 'text-[var(--app-text-muted)]')}>{seg.segment}</span>
                <div className="flex-1 h-5 rounded-[var(--app-radius-lg)] overflow-hidden" style={{ display: 'flex' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.rate}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('h-full rounded-[var(--app-radius-lg)]', seg.rate >= 40 ? ('bg-[var(--app-success)]') : ('bg-[var(--app-warning)]'))}
                  />
                </div>
                <span className={cn('text-[10px] w-10 text-right font-medium', 'text-[var(--app-text-muted)]')}>{seg.rate.toFixed(1)}%</span>
                <span className={cn('text-[10px] w-24 text-right', 'text-[var(--app-text-muted)]')}>
                  {seg.reactivated}/{seg.sent}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
