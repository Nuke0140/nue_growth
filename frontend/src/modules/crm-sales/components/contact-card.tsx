'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Phone, Mail, MessageCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import type { Contact, AiIntent } from '@/modules/crm-sales/types';

const intentConfig: Record<AiIntent, { label: string; emoji: string; className: string }> = {
  high: {
    label: 'High Intent',
    emoji: '🔥',
    className: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  },
  medium: {
    label: 'Healthy',
    emoji: '🟢',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  },
  low: {
    label: 'Low',
    emoji: '⚠️',
    className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  },
  inactive: {
    label: 'Inactive',
    emoji: '💤',
    className: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20',
  },
};

function getHealthColor(score: number) {
  if (score > 75) return 'bg-emerald-500';
  if (score > 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getHealthColorFg(score: number, isDark: boolean) {
  if (score > 75) return 'text-[var(--app-success)]';
  if (score > 50) return isDark ? 'text-yellow-400' : 'text-yellow-600';
  return 'text-[var(--app-danger)]';
}

function getHealthLabel(score: number) {
  if (score > 75) return 'VIP';
  if (score > 50) return 'Active';
  return 'At Risk';
}

function getStageLabel(stage: string) {
  const map: Record<string, string> = {
    lead: 'Lead',
    mql: 'MQL',
    sql: 'SQL',
    opportunity: 'Opportunity',
    customer: 'Customer',
    retained: 'Retained',
    advocate: 'Advocate',
  };
  return map[stage] || stage;
}

function getStageColor(stage: string, isDark: boolean) {
  switch (stage) {
    case 'lead': return isDark ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200';
    case 'mql': return isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
    case 'sql': return 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30';
    case 'opportunity': return 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30';
    case 'customer': return 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30';
    case 'retained': return isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200';
    case 'advocate': return isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200';
    default: return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
  }
}

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);
  const [isHovered, setIsHovered] = useState(false);

  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const intent = intentConfig[contact.aiIntent];
  const visibleTags = contact.tags.slice(0, 3);
  const extraTags = contact.tags.length - 3;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectContact(contact.id)}
      className={cn(
        'relative rounded-2xl border p-5 cursor-pointer transition-colors duration-200 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.02] hover:border-black/[0.1]'
      )}
    >
      {/* Quick Action Icons on Hover */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -4 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'absolute top-3 right-3 flex items-center gap-1',
        )}
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                  isDark ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white' : 'bg-black/[0.06] hover:bg-black/[0.12] text-black/60 hover:text-black'
                )}
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Call</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                  isDark ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white' : 'bg-black/[0.06] hover:bg-black/[0.12] text-black/60 hover:text-black'
                )}
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Email</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                  isDark ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white' : 'bg-black/[0.06] hover:bg-black/[0.12] text-black/60 hover:text-black'
                )}
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>WhatsApp</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      {/* Top Section: Avatar + Info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          <Avatar className={cn('h-11 w-11', contact.aiIntent === 'high' && 'ring-2 ring-orange-500/30 ring-offset-1', isDark && 'ring-offset-[#0a0a0a]')}>
            <AvatarImage src={contact.avatar} alt={fullName} />
            <AvatarFallback className={cn(
              'text-sm font-semibold',
              contact.healthScore > 75 && 'bg-emerald-500/15 text-emerald-400',
              contact.healthScore > 50 && contact.healthScore <= 75 && 'bg-yellow-500/15 text-yellow-400',
              contact.healthScore <= 50 && 'bg-red-500/15 text-red-400',
            )}>
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* VIP indicator */}
          {contact.tags.includes('VIP') && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-[8px]">⭐</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-16">
          <h3 className="text-sm font-semibold truncate">{fullName}</h3>
          <p className={cn('text-xs truncate', 'text-[var(--app-text-secondary)]')}>
            {contact.title}{contact.company ? ` at ${contact.company}` : ''}
          </p>
          <p className={cn('text-xs truncate mt-0.5', 'text-[var(--app-text-muted)]')}>
            {contact.owner}
          </p>
        </div>
      </div>

      {/* AI Intent Badge */}
      <div className="mb-3">
        <span className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
          intent.className,
          contact.aiIntent === 'high' && 'shadow-sm shadow-orange-500/10'
        )}>
          <span>{intent.emoji}</span>
          {intent.label}
        </span>
      </div>

      {/* Health Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-[11px] font-medium', getHealthColorFg(contact.healthScore, isDark))}>
            {getHealthLabel(contact.healthScore)}
          </span>
          <span className={cn('text-[11px] font-medium', getHealthColorFg(contact.healthScore, isDark))}>
            {contact.healthScore}%
          </span>
        </div>
        <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', getHealthColor(contact.healthScore))}
            style={{ width: `${contact.healthScore}%` }}
          />
        </div>
      </div>

      {/* Lifecycle Stage */}
      <div className="mb-3">
        <span className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
          getStageColor(contact.lifecycleStage, isDark)
        )}>
          <Users className="w-3 h-3" />
          {getStageLabel(contact.lifecycleStage)}
        </span>
      </div>

      {/* Tags */}
      {contact.tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-1 mb-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-medium',
                'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
              )}
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              +{extraTags}
            </span>
          )}
        </div>
      )}

      {/* Last Interaction */}
      <div className={cn(
        'pt-2 border-t',
        'border-[var(--app-border-light)]'
      )}>
        <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
          Last active: {contact.lastInteraction}
        </p>
      </div>
    </motion.div>
  );
}
