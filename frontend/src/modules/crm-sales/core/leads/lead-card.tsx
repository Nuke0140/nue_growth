'use client';

import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Phone, MessageCircle, Mail, ArrowRightLeft,
  AlertTriangle, Rocket, Copy, Flame, Sun, Snowflake
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import type { Lead } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function getInitials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function getIntentConfig(intent: Lead['intent']) {
  switch (intent) {
    case 'hot': return { icon: Flame, label: 'Hot', bgDark: 'bg-red-500/15 text-red-300 border-red-500/20', bgLight: 'bg-red-50 text-red-700 border-red-200', glow: true, iconColorDark: 'text-red-400', iconColorLight: 'text-red-600' };
    case 'warm': return { icon: Sun, label: 'Warm', bgDark: 'bg-amber-500/15 text-amber-300 border-amber-500/20', bgLight: 'bg-amber-50 text-amber-700 border-amber-200', glow: false, iconColorDark: 'text-amber-400', iconColorLight: 'text-amber-600' };
    case 'cold': return { icon: Snowflake, label: 'Cold', bgDark: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20', bgLight: 'bg-zinc-50 text-zinc-600 border-zinc-200', glow: false, iconColorDark: 'text-zinc-400', iconColorLight: 'text-zinc-600' };
    case 'stale': return { icon: AlertTriangle, label: 'Stale', bgDark: 'bg-orange-500/15 text-orange-400 border-orange-500/20', bgLight: 'bg-orange-50 text-orange-700 border-orange-200', glow: false, iconColorDark: 'text-orange-400', iconColorLight: 'text-orange-600' };
  }
}

function getAvatarColor(intent: Lead['intent']) {
  switch (intent) {
    case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/20';
    case 'warm': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    case 'cold': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/20';
    case 'stale': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/10';
  }
}

function getSourceLabel(source: string): string {
  const map: Record<string, string> = {
    website: 'Website', meta_ads: 'Meta Ads', google_ads: 'Google Ads',
    whatsapp: 'WhatsApp', qr: 'QR Code', csv_import: 'CSV Import',
    manual: 'Manual', referral: 'Referral', linkedin: 'LinkedIn',
    event: 'Event', cold_call: 'Cold Call',
  };
  return map[source] || source;
}

function getDaysSince(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const created = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function getScoreColor(score: number, isDark: boolean) {
  if (score >= 70) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (score >= 40) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
}

function getScoreBarColor(score: number) {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreBadgeClasses(score: number, isDark: boolean) {
  if (score >= 70) return isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 40) return isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
  return isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200';
}

function getActivityStatus(lastActivity: string | undefined, daysInStage: number) {
  if (!lastActivity) {
    return daysInStage <= 3
      ? { dotColor: 'bg-emerald-500', text: 'Active now', textColorDark: 'text-emerald-400', textColorLight: 'text-emerald-600' }
      : daysInStage <= 7
        ? { dotColor: 'bg-amber-500', text: 'Recent', textColorDark: 'text-amber-400', textColorLight: 'text-amber-600' }
        : { dotColor: 'bg-red-500', text: 'Inactive', textColorDark: 'text-red-400', textColorLight: 'text-red-600' };
  }
  const lower = lastActivity.toLowerCase();
  if (lower.includes('min') || lower.includes('hour') || lower.includes('just now')) {
    return { dotColor: 'bg-emerald-500', text: 'Active now', textColorDark: 'text-emerald-400', textColorLight: 'text-emerald-600' };
  }
  if (lower.includes('day') && !lower.includes('week') && !lower.includes('2 week') && !lower.includes('3 week')) {
    return { dotColor: 'bg-amber-500', text: 'Recent', textColorDark: 'text-amber-400', textColorLight: 'text-amber-600' };
  }
  return { dotColor: 'bg-red-500', text: 'Inactive', textColorDark: 'text-red-400', textColorLight: 'text-red-600' };
}

function getQualificationSuggestion(score: number, intent: Lead['intent']): { label: string; classes: string; darkClasses: string } | null {
  if (score >= 80 && (intent === 'warm' || intent === 'hot')) {
    return { label: 'Strong BANT fit', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', darkClasses: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' };
  }
  if (score >= 50 && score < 80) {
    return { label: 'Needs budget confirmation', classes: 'bg-amber-50 text-amber-700 border-amber-200', darkClasses: 'bg-amber-500/15 text-amber-300 border-amber-500/20' };
  }
  if (score < 50 && intent === 'stale') {
    return { label: 'Re-engage or disqualify', classes: 'bg-red-50 text-red-600 border-red-200', darkClasses: 'bg-red-500/15 text-red-300 border-red-500/20' };
  }
  return null;
}

const LeadCard = memo(function LeadCard({ lead }: { lead: Lead }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectLead = useCrmSalesStore((s) => s.selectLead);
  const [showActions, setShowActions] = useState(false);

  const intentConfig = getIntentConfig(lead.intent);
  const avatarColor = getAvatarColor(lead.intent);
  const daysSince = getDaysSince(lead.createdDate);
  const activityStatus = getActivityStatus(lead.lastActivity, daysSince);
  const qualificationSuggestion = getQualificationSuggestion(lead.score, lead.intent);
  const IntentIcon = intentConfig.icon;

  // AI Score breakdown
  const engagementScore = Math.round(lead.score * 0.4);
  const fitScore = Math.round(lead.score * 0.35);
  const timingScore = Math.round(lead.score * 0.25);

  // Check SLA within 2h
  const isSlaUrgent = useMemo(() => {
    if (!lead.slaDeadline) return false;
    const deadline = new Date(lead.slaDeadline).getTime();
    const now = Date.now();
    const diff = deadline - now;
    return diff > 0 && diff < 2 * 60 * 60 * 1000;
  }, [lead.slaDeadline]);

  const isSlaBreached = useMemo(() => {
    if (!lead.slaDeadline) return false;
    return new Date(lead.slaDeadline).getTime() < Date.now();
  }, [lead.slaDeadline]);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      onClick={() => selectLead(lead.id)}
      className={cn(
        'relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 group',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.01] hover:border-black/[0.12] shadow-sm hover:shadow-md',
        lead.isDuplicate && (isDark ? 'ring-1 ring-amber-500/30' : 'ring-1 ring-amber-400/50'),
      )}
    >
      {/* Glow for hot intent */}
      {intentConfig.glow && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(239,68,68,0)',
              '0 0 20px -4px rgba(239,68,68,0.2)',
              '0 0 0 0 rgba(239,68,68,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative z-10">
        {/* Top Row: Avatar + Name + Badges */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border',
            avatarColor
          )}>
            {getInitials(lead.firstName, lead.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <h4 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-black')}>
                {lead.firstName} {lead.lastName}
              </h4>
              {/* Score Badge */}
              <Badge variant="outline" className={cn(
                'text-[9px] px-1.5 py-0 h-4 font-bold',
                isDark ? getScoreBadgeClasses(lead.score, true) : getScoreBadgeClasses(lead.score, false)
              )}>
                {lead.score}
              </Badge>
              {lead.isHighValue && (
                <span title="High Value Lead"><Rocket className={cn('w-3.5 h-3.5', isDark ? 'text-purple-400' : 'text-purple-600')} /></span>
              )}
              {lead.isDuplicate && (
                <Badge variant="outline" className={cn(
                  'text-[9px] px-1.5 py-0 h-4 gap-0.5',
                  isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-400/50 text-amber-600'
                )}>
                  <Copy className="w-2.5 h-2.5" />
                  Duplicate
                </Badge>
              )}
            </div>
            <p className={cn('text-xs truncate', isDark ? 'text-white/50' : 'text-black/50')}>
              {lead.title && `${lead.title} · `}{lead.company}
            </p>
          </div>
        </div>

        {/* Source + Campaign + Activity Status */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Badge variant="outline" className={cn(
            'text-[10px] px-2 py-0 h-5 font-medium',
            isDark ? 'border-white/[0.08] text-white/50' : 'border-black/[0.08] text-black/50'
          )}>
            {getSourceLabel(lead.source)}
          </Badge>
          {lead.campaign && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5">
              {lead.campaign}
            </Badge>
          )}
          {/* Activity Status Dot */}
          <div className="flex items-center gap-1 ml-auto">
            <div className={cn('w-1.5 h-1.5 rounded-full', activityStatus.dotColor)} />
            <span className={cn('text-[10px]', isDark ? activityStatus.textColorDark : activityStatus.textColorLight)}>
              {activityStatus.text}
            </span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>Score</span>
            <span className={cn('text-[11px] font-bold', getScoreColor(lead.score, isDark))}>
              {lead.score}/100
            </span>
          </div>
          <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lead.score}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={cn('h-full rounded-full', getScoreBarColor(lead.score))}
            />
          </div>
        </div>

        {/* AI Score Breakdown Panel */}
        <div className="mb-3">
          <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-1.5', isDark ? 'text-white/30' : 'text-black/30')}>
            AI Score Breakdown
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] w-16 shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>Engagement</span>
              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                <div className={cn('h-full rounded-full transition-all', getScoreBarColor(engagementScore))} style={{ width: `${engagementScore}%` }} />
              </div>
              <span className={cn('text-[10px] w-7 text-right', isDark ? 'text-white/30' : 'text-black/30')}>{engagementScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] w-16 shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>Fit</span>
              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                <div className={cn('h-full rounded-full transition-all', getScoreBarColor(fitScore))} style={{ width: `${fitScore}%` }} />
              </div>
              <span className={cn('text-[10px] w-7 text-right', isDark ? 'text-white/30' : 'text-black/30')}>{fitScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-[10px] w-16 shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>Timing</span>
              <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                <div className={cn('h-full rounded-full transition-all', getScoreBarColor(timingScore))} style={{ width: `${timingScore}%` }} />
              </div>
              <span className={cn('text-[10px] w-7 text-right', isDark ? 'text-white/30' : 'text-black/30')}>{timingScore}%</span>
            </div>
          </div>
        </div>

        {/* Intent + Revenue + SLA */}
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5">
            {/* Intent Badge (redesigned with icon) */}
            <Badge variant="outline" className={cn(
              'text-[10px] px-2 py-0 h-5 font-medium gap-1',
              isDark ? intentConfig.bgDark : intentConfig.bgLight,
              intentConfig.glow && (isDark ? 'shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_10px_rgba(239,68,68,0.15)]')
            )}>
              <IntentIcon className={cn('w-3 h-3', isDark ? intentConfig.iconColorDark : intentConfig.iconColorLight)} />
              {intentConfig.label}
            </Badge>
            {isSlaUrgent && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Badge className="text-[10px] px-2 py-0 h-5 bg-red-500 text-white border-0 animate-pulse">
                  SLA ⏱
                </Badge>
              </motion.div>
            )}
            {isSlaBreached && (
              <Badge className="text-[10px] px-2 py-0 h-5 bg-red-600 text-white border-0">
                SLA Breached
              </Badge>
            )}
          </div>
          <span className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-black')}>
            {formatCurrency(lead.expectedRevenue)}
          </span>
        </div>

        {/* Qualification Suggestion Badge */}
        {qualificationSuggestion && (
          <div className="mt-2">
            <Badge variant="outline" className={cn(
              'text-[9px] px-1.5 py-0 h-4 font-medium',
              isDark ? qualificationSuggestion.darkClasses : qualificationSuggestion.classes
            )}>
              {qualificationSuggestion.label}
            </Badge>
          </div>
        )}

        {/* Aging indicator */}
        <div className={cn(
          'flex items-center justify-between mt-2 pt-2 border-t',
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}>
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
            {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
          </span>
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
            {lead.assignedRep}
          </span>
        </div>
      </div>

      {/* Quick Actions on Hover */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'absolute -right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 p-1 rounded-xl border shadow-xl z-20',
            isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-black/[0.08]'
          )}
        >
          {[
            { icon: Phone, label: 'Call' },
            { icon: MessageCircle, label: 'WhatsApp' },
            { icon: Mail, label: 'Email' },
            { icon: ArrowRightLeft, label: 'Convert' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={(e) => { e.stopPropagation(); }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark ? 'hover:bg-white/[0.08] text-white/60 hover:text-white' : 'hover:bg-black/[0.06] text-black/60 hover:text-black'
              )}
            >
              <action.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
});

export default LeadCard;
