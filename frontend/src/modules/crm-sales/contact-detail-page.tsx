'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Phone, Mail, MessageCircle, Plus, MapPin, Globe, Linkedin,
  Clock, Target, AlertTriangle, TrendingUp, Sparkles, DollarSign,
  CalendarCheck, ChevronRight, Tag, User, ExternalLink,
  CheckSquare, FileText, Handshake, Zap, Shield, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockContacts, mockActivities, mockDeals, mockTasks, mockNotes } from '@/modules/crm-sales/data/mock-data';
import ActivityTimeline from './components/activity-timeline';
import type { AiIntent } from '@/modules/crm-sales/types';

const intentConfig: Record<AiIntent, { label: string; emoji: string; className: string }> = {
  high: { label: 'High Intent', emoji: '🔥', className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  medium: { label: 'Healthy', emoji: '🟢', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  low: { label: 'Low', emoji: '⚠️', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  inactive: { label: 'Inactive', emoji: '💤', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
};

function getStageLabel(stage: string) {
  const map: Record<string, string> = {
    lead: 'Lead', mql: 'MQL', sql: 'SQL', opportunity: 'Opportunity',
    customer: 'Customer', retained: 'Retained', advocate: 'Advocate',
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

function getSourceLabel(source: string) {
  const map: Record<string, string> = {
    website: 'Website', referral: 'Referral', linkedin: 'LinkedIn',
    cold_call: 'Cold Call', event: 'Event', ad_campaign: 'Ad Campaign',
    organic: 'Organic', import: 'Import',
  };
  return map[source] || source;
}

function getHealthColor(score: number, isDark: boolean) {
  if (score > 75) return 'text-[var(--app-success)]';
  if (score > 50) return isDark ? 'text-yellow-400' : 'text-yellow-600';
  return 'text-[var(--app-danger)]';
}

function getHealthBarColor(score: number) {
  if (score > 75) return 'bg-emerald-500';
  if (score > 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function ContactDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedContactId, selectCompany } = useCrmSalesStore();

  const contact = mockContacts.find(c => c.id === selectedContactId);

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>Contact not found</p>
      </div>
    );
  }

  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  const intent = intentConfig[contact.aiIntent];

  const contactActivities = mockActivities.filter(a => a.contactId === contact.id);
  const contactDeals = mockDeals.filter(d => d.contactId === contact.id);
  const contactTasks = mockTasks.filter(t => t.contactId === contact.id);
  const contactNotes = mockNotes.filter(n => n.contactId === contact.id);

  // AI Insights data
  const insights = [
    {
      icon: Target,
      title: 'Buying Intent',
      value: contact.aiIntent === 'high' ? '92%' : contact.aiIntent === 'medium' ? '65%' : contact.aiIntent === 'low' ? '35%' : '12%',
      confidence: contact.aiIntent === 'high' ? 89 : contact.aiIntent === 'medium' ? 65 : 40,
      color: contact.aiIntent === 'high' ? 'text-orange-400' : contact.aiIntent === 'medium' ? 'text-emerald-400' : 'text-zinc-400',
      bgColor: contact.aiIntent === 'high' ? 'bg-orange-500/15' : contact.aiIntent === 'medium' ? 'bg-emerald-500/15' : 'bg-zinc-500/15',
    },
    {
      icon: Sparkles,
      title: 'Next Best Action',
      value: contact.healthScore > 75 ? 'Send proposal' : 'Follow up call',
      confidence: 91,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
    },
    {
      icon: Shield,
      title: 'Churn Risk',
      value: contact.healthScore < 50 ? 'High' : contact.healthScore < 75 ? 'Medium' : 'Low',
      confidence: contact.healthScore < 50 ? 78 : contact.healthScore < 75 ? 45 : 12,
      color: contact.healthScore < 50 ? 'text-red-400' : contact.healthScore < 75 ? 'text-yellow-400' : 'text-emerald-400',
      bgColor: contact.healthScore < 50 ? 'bg-red-500/15' : contact.healthScore < 75 ? 'bg-yellow-500/15' : 'bg-emerald-500/15',
    },
    {
      icon: Clock,
      title: 'Best Contact Time',
      value: '4-6 PM IST',
      confidence: 83,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
    },
    {
      icon: DollarSign,
      title: 'Expected Deal Value',
      value: `$${contactDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`,
      confidence: 76,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
    },
    {
      icon: Heart,
      title: 'Relationship Score',
      value: `${Math.min(99, contact.healthScore + 5)}/100`,
      confidence: 88,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/15',
    },
  ];

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row gap-0">
        {/* Left Panel */}
        <div className={cn(
          'w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r overflow-y-auto p-5 space-y-5',
          'border-[var(--app-border)]'
        )}>
          {/* Avatar & Identity */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={contact.avatar} alt={fullName} />
              <AvatarFallback className={cn(
                'text-xl font-bold',
                contact.healthScore > 75 && 'bg-emerald-500/15 text-emerald-400',
                contact.healthScore > 50 && contact.healthScore <= 75 && 'bg-yellow-500/15 text-yellow-400',
                contact.healthScore <= 50 && 'bg-red-500/15 text-red-400',
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">{fullName}</h2>
            <p className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
              {contact.title}
            </p>
            {contact.company && (
              <button
                onClick={() => contact.companyId && selectCompany(contact.companyId)}
                className={cn(
                  'text-sm font-medium flex items-center gap-1 mt-1 transition-colors',
                  isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'
                )}
              >
                {contact.company}
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {/* Source & Stage Badges */}
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
              <span className={cn(
                'px-2 py-0.5 rounded text-[11px] font-medium border',
                isDark ? 'bg-white/[0.04] text-white/50 border-white/[0.06]' : 'bg-black/[0.04] text-black/50 border-black/[0.06]'
              )}>
                {getSourceLabel(contact.source)}
              </span>
              <span className={cn(
                'px-2 py-0.5 rounded text-[11px] font-medium border',
                getStageColor(contact.lifecycleStage, isDark)
              )}>
                {getStageLabel(contact.lifecycleStage)}
              </span>
            </div>
          </div>

          {/* Assigned Rep */}
          <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.08] text-black/70'
              )}>
                {contact.owner.split(' ').map(w => w.charAt(0)).join('')}
              </div>
              <div>
                <p className={cn('text-[11px] font-medium', 'text-[var(--app-text-muted)]')}>Assigned Rep</p>
                <p className="text-sm font-medium">{contact.owner}</p>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Health Score</span>
              <span className={cn('text-sm font-bold', getHealthColor(contact.healthScore, isDark))}>
                {contact.healthScore}%
              </span>
            </div>
            <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
              <div
                className={cn('h-full rounded-full transition-all duration-500', getHealthBarColor(contact.healthScore))}
                style={{ width: `${contact.healthScore}%` }}
              />
            </div>
            <p className={cn('text-[11px] mt-1.5', 'text-[var(--app-text-muted)]')}>
              AI Intent: <span className="font-medium">{intent.emoji} {intent.label}</span>
            </p>
          </div>

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div>
              <p className={cn('text-xs font-medium mb-2', 'text-[var(--app-text-muted)]')}>
                <Tag className="w-3 h-3 inline mr-1" />
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs font-medium',
                      'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Profiles */}
          {contact.socialProfiles && contact.socialProfiles.length > 0 && (
            <div>
              <p className={cn('text-xs font-medium mb-2', 'text-[var(--app-text-muted)]')}>
                Social Profiles
              </p>
              <div className="space-y-1.5">
                {contact.socialProfiles.map((profile) => (
                  <a
                    key={profile.platform}
                    href={profile.url}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
                      isDark
                        ? 'bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white/80'
                        : 'bg-black/[0.02] text-black/60 hover:bg-black/[0.06] hover:text-black/80'
                    )}
                  >
                    {profile.platform === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5" />}
                    {profile.platform === 'Website' && <Globe className="w-3.5 h-3.5" />}
                    {profile.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {contact.address && (
            <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Location</span>
              </div>
              <p className="text-sm">{contact.address.city}, {contact.address.state}</p>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{contact.address.country}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 space-y-2">
            <p className={cn('text-xs font-medium mb-1', 'text-[var(--app-text-muted)]')}>
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Call', icon: Phone },
                { label: 'WhatsApp', icon: MessageCircle },
                { label: 'Email', icon: Mail },
                { label: 'Add Task', icon: Plus },
              ].map((action) => (
                <button
                  key={action.label}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                    isDark
                      ? 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/90'
                      : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08] hover:text-black/90'
                  )}
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 overflow-y-auto p-5">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className={cn(
              'w-full justify-start rounded-xl p-1 mb-5',
              'bg-[var(--app-hover-bg)]'
            )}>
              <TabsTrigger value="activity" className={cn(
                'rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm',
                isDark
                  ? 'data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
                  : 'data-[state=active]:bg-black/[0.06] data-[state=active]:text-black'
              )}>
                Activity
                <Badge variant="secondary" className={cn(
                  'text-[10px] px-1.5 py-0 h-4',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                )}>
                  {contactActivities.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="deals" className={cn(
                'rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm',
                isDark
                  ? 'data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
                  : 'data-[state=active]:bg-black/[0.06] data-[state=active]:text-black'
              )}>
                Deals
                <Badge variant="secondary" className={cn(
                  'text-[10px] px-1.5 py-0 h-4',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                )}>
                  {contactDeals.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="tasks" className={cn(
                'rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm',
                isDark
                  ? 'data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
                  : 'data-[state=active]:bg-black/[0.06] data-[state=active]:text-black'
              )}>
                Tasks
                <Badge variant="secondary" className={cn(
                  'text-[10px] px-1.5 py-0 h-4',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                )}>
                  {contactTasks.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="notes" className={cn(
                'rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm',
                isDark
                  ? 'data-[state=active]:bg-white/[0.08] data-[state=active]:text-white'
                  : 'data-[state=active]:bg-black/[0.06] data-[state=active]:text-black'
              )}>
                Notes
                <Badge variant="secondary" className={cn(
                  'text-[10px] px-1.5 py-0 h-4',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                )}>
                  {contactNotes.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-0">
              <ActivityTimeline activities={contactActivities} />
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals" className="mt-0 space-y-3">
              {contactDeals.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-3',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <Handshake className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                  </div>
                  <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                    No deals yet
                  </p>
                  <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                    Create a deal for this contact
                  </p>
                  <Button size="sm" className="mt-3 h-8 gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Create Deal
                  </Button>
                </div>
              ) : (
                contactDeals.map((deal, idx) => {
                  const stageColors: Record<string, string> = {
                    new: isDark ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200',
                    qualified: isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200',
                    demo: 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30',
                    proposal: 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30',
                    negotiation: isDark ? 'bg-rose-500/15 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200',
                    won: 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30',
                    lost: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]',
                  };

                  return (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        'rounded-2xl border p-4 transition-colors',
                        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold">{deal.name}</h4>
                          <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                            {deal.company}
                          </p>
                        </div>
                        <span className={cn(
                          'px-2 py-0.5 rounded-md text-[11px] font-medium border capitalize',
                          stageColors[deal.stage] || stageColors.new
                        )}>
                          {deal.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Value</p>
                          <p className="text-sm font-bold">${deal.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Probability</p>
                          <p className="text-sm font-bold">{deal.probability}%</p>
                        </div>
                        <div>
                          <p className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Close Date</p>
                          <p className="text-sm">{deal.expectedClose}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-0 space-y-2">
              {contactTasks.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-3',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <CheckSquare className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                  </div>
                  <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                    No tasks
                  </p>
                </div>
              ) : (
                contactTasks.map((task) => {
                  const priorityColors: Record<string, string> = {
                    urgent: isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200',
                    high: 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30',
                    medium: isDark ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    low: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]',
                  };

                  const statusColors: Record<string, string> = {
                    todo: 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
                    in_progress: 'bg-[var(--app-info-bg)] text-[var(--app-info)]',
                    done: 'bg-[var(--app-success-bg)] text-[var(--app-success)]',
                    cancelled: isDark ? 'bg-zinc-500/15 text-zinc-300' : 'bg-zinc-50 text-zinc-700',
                  };

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'rounded-xl border p-3 transition-colors',
                        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                      )}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center',
                            task.status === 'done'
                              ? isDark ? 'bg-emerald-500 border-emerald-500' : 'bg-emerald-500 border-emerald-500'
                              : isDark ? 'border-white/20' : 'border-black/20'
                          )}>
                            {task.status === 'done' && <span className="text-white text-[10px]">✓</span>}
                          </div>
                          <h4 className={cn('text-sm font-medium', task.status === 'done' && 'line-through opacity-50')}>
                            {task.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border capitalize', priorityColors[task.priority])}>
                          {task.priority}
                        </span>
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium capitalize', statusColors[task.status])}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-0 space-y-3">
              {contactNotes.length === 0 ? (
                <div className="flex flex-col items-center py-12">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-3',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <FileText className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                  </div>
                  <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                    No notes
                  </p>
                </div>
              ) : (
                contactNotes.map((note, idx) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      'rounded-2xl border p-4 transition-colors',
                      'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{note.title}</h4>
                          {note.isPinned && <span className="text-xs">📌</span>}
                          {note.isPrivate && <Badge variant="secondary" className="text-[10px] h-4 px-1.5 py-0">Private</Badge>}
                        </div>
                        <p className={cn('text-[11px] mt-0.5', 'text-[var(--app-text-muted)]')}>
                          {note.author} · {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium capitalize',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                      )}>
                        {note.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className={cn('text-sm leading-relaxed', 'text-[var(--app-text-secondary)]')}>
                      {note.content}
                    </p>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - AI Insights */}
        <div className={cn(
          'w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l overflow-y-auto p-5 space-y-4',
          'border-[var(--app-border)]'
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold">AI Insights</h3>
          </div>
          <p className={cn('text-xs mb-4', 'text-[var(--app-text-muted)]')}>
            Powered by AI analysis of {fullName}&apos;s behavior and data
          </p>

          {/* Buying Intent - Large Circular Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'rounded-2xl border p-5 text-center',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <p className={cn('text-xs font-medium uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
              Buying Intent Score
            </p>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                <circle
                  cx="56" cy="56" r="48"
                  className={cn('fill-none', isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]')}
                  strokeWidth="6"
                />
                <circle
                  cx="56" cy="56" r="48"
                  className="fill-none transition-all duration-700"
                  stroke={
                    contact.aiIntent === 'high' ? '#f97316' :
                    contact.aiIntent === 'medium' ? '#10b981' :
                    contact.aiIntent === 'low' ? '#eab308' : '#71717a'
                  }
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - (contact.aiIntent === 'high' ? 0.92 : contact.aiIntent === 'medium' ? 0.65 : 0.35))}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  {contact.aiIntent === 'high' ? '92' : contact.aiIntent === 'medium' ? '65' : '35'}
                </span>
                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>out of 100</span>
              </div>
            </div>
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border',
              intent.className
            )}>
              <span>{intent.emoji}</span>
              {intent.label}
            </span>
          </motion.div>

          {/* Other Insight Cards */}
          {insights.slice(1).map((insight, idx) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
              className={cn(
                'rounded-xl border p-4',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', insight.bgColor)}>
                  <insight.icon className={cn('w-4 h-4', insight.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-[11px] font-medium', 'text-[var(--app-text-muted)]')}>
                    {insight.title}
                  </p>
                  <p className="text-sm font-semibold">{insight.value}</p>
                </div>
              </div>
              {/* Confidence bar */}
              <div className="flex items-center gap-2">
                <div className={cn('flex-1 h-1 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', insight.bgColor.replace('/15', '/40'))}
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className={cn('text-[10px] w-8 text-right', 'text-[var(--app-text-muted)]')}>
                  {insight.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
