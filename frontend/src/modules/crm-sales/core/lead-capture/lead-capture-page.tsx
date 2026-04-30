'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Instagram, Globe, MessageCircle, QrCode, Linkedin,
  Upload, FileEdit, TrendingUp, TrendingDown, AlertCircle,
  Radio, Webhook, Filter, ArrowRight, Zap, UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockLeadSources, mockSalesLeads } from '@/modules/crm-sales/data/mock-data';

function getSourceIcon(type: string): React.ElementType {
  switch (type) {
    case 'meta_ads': return Instagram;
    case 'google_ads': return Globe;
    case 'website': return Globe;
    case 'whatsapp': return MessageCircle;
    case 'qr': return QrCode;
    case 'linkedin': return Linkedin;
    case 'csv_import': return Upload;
    case 'manual': return FileEdit;
    default: return Radio;
  }
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const routingRules = [
  { name: 'High Value Leads', desc: 'Score > 80 → Senior Rep', icon: Zap, active: true },
  { name: 'Regional Routing', desc: 'Country-based auto-assign', icon: Globe, active: true },
  { name: 'Source Priority', desc: 'Referrals → VIP queue', icon: UserPlus, active: false },
];

const autoRoutingRules = [
  { id: 'r1', condition: 'Score > 80', action: 'Assign to Priya Sharma', icon: '🎯', status: 'active' as const },
  { id: 'r2', condition: 'Source = WhatsApp', action: 'Auto-reply within 5 min', icon: '💬', status: 'active' as const },
  { id: 'r3', condition: 'Country = US', action: 'Assign to US Sales Team', icon: '🌎', status: 'active' as const },
  { id: 'r4', condition: 'Score < 30', action: 'Move to nurture campaign', icon: '📝', status: 'paused' as const },
];

export default function LeadCapturePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalLeads = useMemo(() => mockLeadSources.reduce((s, l) => s + l.leadCount, 0), []);
  const maxConversion = useMemo(() => Math.max(...mockLeadSources.map(s => s.conversionRate)), []);
  const duplicateCount = useMemo(() => mockSalesLeads.filter(l => l.isDuplicate).length, []);

  const recentLeads = useMemo(() => {
    return mockSalesLeads.slice(0, 6).map(l => ({
      name: `${l.firstName} ${l.lastName}`,
      source: l.source,
      time: l.lastActivity || 'Just now',
      intent: l.intent,
    }));
  }, []);

  const webhookErrors = mockLeadSources.filter(s => s.webhookStatus === 'error');

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              Lead Capture
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-emerald-500">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {totalLeads} total leads
            </Badge>
          </div>
        </div>

        {/* Source Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockLeadSources.map((source, i) => {
            const SourceIcon = getSourceIcon(source.type);
            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl p-5 border transition-all duration-200 group cursor-default',
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
                    : 'bg-white border-black/[0.06] hover:border-black/[0.12] hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <SourceIcon className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
                  </div>
                  <Badge className={cn(
                    'text-[9px] px-2 py-0 h-4 border-0 font-medium',
                    source.webhookStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400'
                      : source.webhookStatus === 'error' ? 'bg-red-500/10 text-red-400'
                      : 'bg-zinc-500/10 text-zinc-400'
                  )}>
                    {source.webhookStatus === 'active' ? '● Active' : source.webhookStatus === 'error' ? '● Error' : '○ Inactive'}
                  </Badge>
                </div>

                <h3 className={cn('text-sm font-semibold mb-1', 'text-[var(--app-text)]')}>
                  {source.name}
                </h3>

                <div className="flex items-end gap-2 mb-3">
                  <span className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                    {source.leadCount}
                  </span>
                  <span className={cn('text-xs mb-1', 'text-[var(--app-text-muted)]')}>leads</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                    {source.conversionRate}% conversion
                  </span>
                  <div className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    source.trend >= 0
                      ? 'text-[var(--app-success)]'
                      : 'text-[var(--app-danger)]'
                  )}>
                    {source.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {source.trend >= 0 ? '+' : ''}{source.trend}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Feed + Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Source Conversion Chart */}
          <div className={cn(
            'lg:col-span-2 rounded-2xl border p-6',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
          )}>
            <h3 className={cn('text-sm font-semibold mb-4', 'text-[var(--app-text)]')}>
              Source Conversion Rates
            </h3>
            <div className="space-y-3">
              {mockLeadSources.map((source) => (
                <div key={source.id} className="flex items-center gap-3">
                  <span className={cn('text-xs w-28 truncate shrink-0', 'text-[var(--app-text-secondary)]')}>
                    {source.name}
                  </span>
                  <div className={cn('flex-1 h-6 rounded-lg overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(source.conversionRate / maxConversion) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-lg flex items-center justify-end pr-2',
                        source.conversionRate >= 30 ? 'bg-emerald-500/20'
                          : source.conversionRate >= 15 ? 'bg-amber-500/20'
                          : 'bg-red-500/20'
                      )}
                    >
                      <span className={cn(
                        'text-[10px] font-bold',
                        source.conversionRate >= 30 ? 'text-emerald-400'
                          : source.conversionRate >= 15 ? 'text-amber-400'
                          : 'text-red-400'
                      )}>
                        {source.conversionRate}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Lead Feed */}
          <div className={cn(
            'rounded-2xl border p-6',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
          )}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-medium text-emerald-500">Live Feed</span>
              </div>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {recentLeads.map((lead, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.08 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-colors',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0',
                    lead.intent === 'hot' && (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'),
                    lead.intent === 'warm' && (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'),
                    lead.intent === 'cold' && (isDark ? 'bg-zinc-500/20 text-zinc-400' : 'bg-zinc-100 text-zinc-600'),
                    lead.intent === 'stale' && (isDark ? 'bg-zinc-500/10 text-zinc-500' : 'bg-zinc-100 text-zinc-500'),
                  )}>
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>
                      {lead.name}
                    </p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                      via {lead.source} · {lead.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts + Dedup + Routing Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Failed Webhooks */}
          <div className={cn(
            'rounded-2xl border p-6',
            isDark ? 'bg-red-500/[0.03] border-red-500/10' : 'bg-red-50 border-red-200'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Webhook Alerts
              </h3>
              <Badge className="ml-auto text-[9px] px-1.5 py-0 h-4 bg-red-500/10 text-red-400 border-0">
                {webhookErrors.length}
              </Badge>
            </div>
            {webhookErrors.length === 0 ? (
              <div className="flex items-center gap-2 py-4 justify-center">
                <span className="text-emerald-400 text-lg">✓</span>
                <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>All webhooks active</p>
              </div>
            ) : (
              <div className="space-y-2">
                {webhookErrors.map(err => (
                  <div key={err.id} className={cn('rounded-lg p-2 text-xs', isDark ? 'bg-red-500/5' : 'bg-red-100/50')}>
                    <p className={cn('font-medium', isDark ? 'text-red-300' : 'text-red-700')}>{err.name}</p>
                    <p className={cn('text-[10px] mt-0.5', isDark ? 'text-red-400/60' : 'text-red-600/60')}>Connection error — check API key</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deduplication Preview */}
          <div className={cn(
            'rounded-2xl border p-6',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Filter className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Deduplication
              </h3>
            </div>
            <div className={cn(
              'rounded-xl p-4 text-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <p className={cn('text-3xl font-bold', 'text-[var(--app-text)]')}>
                {duplicateCount}
              </p>
              <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                potential duplicates found
              </p>
            </div>
            <p className={cn('text-[10px] mt-3 leading-relaxed', 'text-[var(--app-text-muted)]')}>
              AI scans leads by email, phone, and company name similarity to detect potential duplicates.
            </p>
          </div>

          {/* Auto Routing Rules */}
          <div className={cn(
            'rounded-2xl border p-6',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06] shadow-sm'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Auto Routing
              </h3>
            </div>
            <div className="space-y-2">
              {autoRoutingRules.map((rule) => (
                <div
                  key={rule.id}
                  className={cn(
                    'rounded-xl p-3 border transition-colors',
                    'border-[var(--app-border-light)]',
                    rule.status === 'active' && ('bg-[var(--app-hover-bg)]')
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{rule.icon}</span>
                    <span className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>
                      {rule.action}
                    </span>
                    <Badge className={cn(
                      'ml-auto text-[9px] px-1.5 py-0 h-4 border-0',
                      rule.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                    )}>
                      {rule.status === 'active' ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    When: {rule.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
