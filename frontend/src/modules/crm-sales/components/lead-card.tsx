'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Phone, MessageCircle, Mail, ArrowRightLeft,
  AlertTriangle, Rocket, Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import type { SalesLead } from '../types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function getInitials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function getIntentConfig(intent: SalesLead['intent']) {
  switch (intent) {
    case 'hot': return { emoji: '🔥', label: 'Hot', bgDark: 'bg-red-500/15 text-red-300', bgLight: 'bg-red-50 text-red-700', glow: true };
    case 'warm': return { emoji: '🟡', label: 'Warm', bgDark: 'bg-amber-500/15 text-amber-300', bgLight: 'bg-amber-50 text-amber-700', glow: false };
    case 'cold': return { emoji: '⚪', label: 'Cold', bgDark: 'bg-zinc-500/15 text-zinc-400', bgLight: 'bg-zinc-50 text-zinc-600', glow: false };
    case 'stale': return { emoji: '⚠️', label: 'Stale', bgDark: 'bg-orange-500/15 text-orange-400', bgLight: 'bg-orange-50 text-orange-700', glow: false };
  }
}

function getAvatarColor(intent: SalesLead['intent']) {
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

function getDaysSince(dateStr: string): number {
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

export default function LeadCard({ lead }: { lead: SalesLead }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectLead = useCrmSalesStore((s) => s.selectLead);
  const [showActions, setShowActions] = useState(false);

  const intentConfig = getIntentConfig(lead.intent);
  const avatarColor = getAvatarColor(lead.intent);
  const daysSince = getDaysSince(lead.createdDate);

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
          transition={{ duration: 0.2, repeat: Infinity, ease: 'easeInOut' }}
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
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-black')}>
                {lead.firstName} {lead.lastName}
              </h4>
              {lead.isHighValue && (
                <span className="text-sm" title="High Value Lead">🚀</span>
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

        {/* Source + Campaign */}
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
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn('h-full rounded-full', getScoreBarColor(lead.score))}
            />
          </div>
        </div>

        {/* Intent + Revenue + SLA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn(
              'text-[10px] px-2 py-0 h-5 font-medium border-0',
              isDark ? intentConfig.bgDark : intentConfig.bgLight,
              intentConfig.glow && (isDark ? 'shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'shadow-[0_0_10px_rgba(239,68,68,0.15)]')
            )}>
              {intentConfig.emoji} {intentConfig.label}
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
}
