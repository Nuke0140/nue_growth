'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Phone, MessageCircle, Mail, Video, FileText, Calendar,
  ChevronRight, Clock, AlertTriangle, Sparkles, RefreshCw,
  CheckCircle2, Bell, CalendarDays, CalendarClock, Filter,
  Search, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { mockFollowUps } from '@/modules/crm-sales/data/mock-data';
import type { FollowUp, FollowUpType, FollowUpStatus, FollowUpPriority } from '@/modules/crm-sales/system/types';

const TYPE_CONFIG: Record<FollowUpType, { icon: typeof Phone; label: string; color: string }> = {
  call: { icon: Phone, label: 'Call', color: 'text-emerald-500' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500' },
  email: { icon: Mail, label: 'Email', color: 'text-blue-500' },
  meeting: { icon: Video, label: 'Meeting', color: 'text-violet-500' },
  demo: { icon: Video, label: 'Demo', color: 'text-purple-500' },
  proposal: { icon: FileText, label: 'Proposal', color: 'text-amber-500' },
  custom: { icon: Calendar, label: 'Custom', color: 'text-slate-500' },
};

const PRIORITY_CONFIG: Record<FollowUpPriority, { bg: string; text: string; label: string }> = {
  urgent: { bg: 'bg-red-500/15', text: 'text-red-500', label: 'Urgent' },
  high: { bg: 'bg-amber-500/15', text: 'text-amber-500', label: 'High' },
  medium: { bg: 'bg-blue-500/15', text: 'text-blue-500', label: 'Medium' },
  low: { bg: 'bg-slate-500/15', text: 'text-slate-500', label: 'Low' },
};

const STATUS_CONFIG: Record<FollowUpStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Pending' },
  completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', label: 'Done' },
  missed: { bg: 'bg-red-500/15', text: 'text-red-500', label: 'Missed' },
  snoozed: { bg: 'bg-amber-500/15', text: 'text-amber-500', label: 'Snoozed' },
};

type ViewTab = 'overdue' | 'today' | 'tomorrow' | 'week' | 'recurring' | 'all';

const VIEW_TABS: { id: ViewTab; label: string; icon?: typeof AlertTriangle; badge?: string }[] = [
  { id: 'overdue', label: 'Overdue', icon: AlertTriangle, badge: '' },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'This Week', icon: CalendarClock },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw },
  { id: 'all', label: 'All' },
];

const TYPE_FILTERS: (FollowUpType | 'all')[] = ['all', 'call', 'whatsapp', 'email', 'meeting', 'demo', 'proposal'];
const PRIORITY_FILTERS: (FollowUpPriority | 'all')[] = ['all', 'urgent', 'high', 'medium', 'low'];

export default function FollowupsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [viewTab, setViewTab] = useState<ViewTab>('all');
  const [typeFilter, setTypeFilter] = useState<FollowUpType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FollowUpPriority | 'all'>('all');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const overdueCount = mockFollowUps.filter(f => f.isOverdue).length;

  const filtered = useMemo(() => {
    return mockFollowUps.filter(f => {
      // View tab filtering (simplified date-based)
      if (viewTab === 'overdue' && !f.isOverdue) return false;
      if (viewTab === 'recurring' && !f.isRecurring) return false;
      if (viewTab === 'today') return f.scheduledDate === '2026-04-10' && !f.isOverdue;
      if (viewTab === 'tomorrow') return f.scheduledDate === '2026-04-11' && !f.isOverdue;
      if (viewTab === 'week') {
        const weekDates = ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13'];
        if (!weekDates.includes(f.scheduledDate) || f.isOverdue) return false;
      }
      if (typeFilter !== 'all' && f.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false;
      return true;
    });
  }, [viewTab, typeFilter, priorityFilter]);

  const overdueItems = filtered.filter(f => f.isOverdue);
  const activeItems = filtered.filter(f => !f.isOverdue);

  const aiRecommendations = [
    { title: 'Re-engage Ahmed Hassan', desc: 'Send WhatsApp with pricing PDF — Cairo leads respond well to visual content.', priority: 'urgent' as const },
    { title: 'Schedule Sophie\'s callback', desc: 'Lead went cold after missed call. Try industry report re-engagement.', priority: 'high' as const },
    { title: 'Prepare Marcus demo', desc: 'Executive-level demo focused on ROI metrics and enterprise security.', priority: 'high' as const },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                    Follow-ups
                  </h1>
                  {overdueCount > 0 && (
                    <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px] px-2 py-0.5">
                      {overdueCount} overdue
                    </Badge>
                  )}
                </div>
                <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
                  {mockFollowUps.length} follow-ups scheduled
                </p>
              </div>
            </div>
            <Button className={cn(
              'shrink-0 h-9 px-4 rounded-xl text-xs font-semibold',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Follow-up
            </Button>
          </div>

          {/* View Tabs */}
          <div className={cn(
            'flex items-center gap-1 p-1 rounded-xl overflow-x-auto',
            'bg-[var(--app-hover-bg)]'
          )}>
            {VIEW_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = viewTab === tab.id;
              const badgeCount = tab.id === 'overdue' ? overdueCount : undefined;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-[var(--app-card-bg)] text-[var(--app-text)]'
                      : isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.04]'
                  )}
                >
                  {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                  {tab.label}
                  {badgeCount !== undefined && badgeCount > 0 && (
                    <span className={cn(
                      'ml-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center',
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'bg-red-500/15 text-red-500'
                    )}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {TYPE_FILTERS.map((type) => {
                const active = typeFilter === type;
                const cfg = type !== 'all' ? TYPE_CONFIG[type] : null;
                const TypeIcon = cfg?.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
                      active
                        ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                        : isDark ? 'text-white/40 border-white/[0.06] hover:bg-white/[0.04] hover:text-white/60' : 'text-black/40 border-black/[0.06] hover:bg-black/[0.04] hover:text-black/60'
                    )}
                  >
                    {TypeIcon && <TypeIcon className="w-3 h-3" />}
                    {type === 'all' ? 'All Types' : cfg?.label}
                  </button>
                );
              })}
            </div>

            <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />

            {/* Priority Chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {PRIORITY_FILTERS.map((p) => {
                const active = priorityFilter === p;
                const cfg = p !== 'all' ? PRIORITY_CONFIG[p] : null;
                return (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
                      active
                        ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                        : isDark ? 'text-white/40 border-white/[0.06] hover:bg-white/[0.04]' : 'text-black/40 border-black/[0.06] hover:bg-black/[0.04]'
                    )}
                  >
                    {p === 'all' ? 'All Priority' : cfg?.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content: Follow-ups + AI Panel */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Main Follow-up List */}
            <div className="flex-1 space-y-3">
              {/* Overdue Section */}
              {overdueItems.length > 0 && (
                <div className={cn(
                  'rounded-2xl border-2 p-4 space-y-3',
                  isDark ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-red-50/60 border-red-200/50'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-500">Overdue Follow-ups</span>
                    <Badge className="bg-red-500/15 text-red-500 border-0 text-[10px]">{overdueItems.length}</Badge>
                  </div>
                  {overdueItems.map((fu, i) => (
                    <FollowUpCard
                      key={fu.id}
                      followUp={fu}
                      isDark={isDark}
                      index={i}
                      isOverdue
                      expandedSuggestion={expandedSuggestion}
                      onToggleSuggestion={(id) => setExpandedSuggestion(expandedSuggestion === id ? null : id)}
                    />
                  ))}
                </div>
              )}

              {/* Active Follow-ups */}
              {activeItems.length > 0 ? (
                activeItems.map((fu, i) => (
                  <FollowUpCard
                    key={fu.id}
                    followUp={fu}
                    isDark={isDark}
                    index={i + overdueItems.length}
                    expandedSuggestion={expandedSuggestion}
                    onToggleSuggestion={(id) => setExpandedSuggestion(expandedSuggestion === id ? null : id)}
                  />
                ))
              ) : overdueItems.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'rounded-2xl border p-12 text-center',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                  )}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-emerald-500/15">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn('text-lg font-semibold mb-1', 'text-[var(--app-text)]')}>
                    All caught up! 🎉
                  </h3>
                  <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>
                    No pending follow-ups right now. Enjoy the moment.
                  </p>
                </motion.div>
              ) : null}
            </div>

            {/* AI Suggestion Panel */}
            <div className="lg:w-80 shrink-0">
              <div className={cn(
                'rounded-2xl border p-4 lg:sticky lg:top-4',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    AI Recommended Actions
                  </span>
                </div>
                <div className="space-y-3">
                  {aiRecommendations.map((rec, i) => {
                    const priCfg = PRIORITY_CONFIG[rec.priority as FollowUpPriority];
                    return (
                      <motion.div
                        key={rec.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={cn(
                          'rounded-xl p-3 border cursor-pointer transition-colors',
                          isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', priCfg.bg, priCfg.text)}>
                            {priCfg.label}
                          </span>
                        </div>
                        <p className={cn('text-xs font-medium mb-1', 'text-[var(--app-text)]')}>
                          {rec.title}
                        </p>
                        <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                          {rec.desc}
                        </p>
                        <button className={cn(
                          'flex items-center gap-1 mt-2 text-[10px] font-medium',
                          'text-violet-500 hover:text-violet-400 transition-colors'
                        )}>
                          Take Action <ArrowRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function FollowUpCard({
  followUp,
  isDark,
  index,
  isOverdue,
  expandedSuggestion,
  onToggleSuggestion,
}: {
  followUp: FollowUp;
  isDark: boolean;
  index: number;
  isOverdue?: boolean;
  expandedSuggestion: string | null;
  onToggleSuggestion: (id: string) => void;
}) {
  const typeCfg = TYPE_CONFIG[followUp.type];
  const TypeIcon = typeCfg.icon;
  const priCfg = PRIORITY_CONFIG[followUp.priority];
  const statusCfg = STATUS_CONFIG[followUp.status];
  const isExpanded = expandedSuggestion === followUp.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        isOverdue
          ? (isDark ? 'bg-red-500/[0.03] border-red-500/15' : 'bg-red-50/40 border-red-200/40')
          : ('bg-[var(--app-card-bg)] border-[var(--app-border)]')
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            'bg-[var(--app-hover-bg)]'
          )}>
            <TypeIcon className={cn('w-5 h-5', typeCfg.color)} />
          </div>
          <div className="flex-1 min-w-0">
            {/* Name + Company */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                {followUp.leadName}
              </span>
              {followUp.company && (
                <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                  · {followUp.company}
                </span>
              )}
            </div>

            {/* Date + Time */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Clock className={cn('w-3 h-3', isOverdue ? 'text-red-400' : ('text-[var(--app-text-muted)]'))} />
                <span className={cn('text-[11px] font-medium', isOverdue ? 'text-red-400' : ('text-[var(--app-text-muted)]'))}>
                  {followUp.scheduledDate}
                  {followUp.scheduledTime && ` · ${followUp.scheduledTime}`}
                </span>
              </div>
              {followUp.isRecurring && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-violet-400" />
                  <span className="text-[10px] text-violet-400 font-medium">{followUp.recurringPattern}</span>
                </div>
              )}
            </div>

            {/* AI Suggestion */}
            {followUp.aiSuggestion && (
              <div className="mt-2">
                <button
                  onClick={() => onToggleSuggestion(followUp.id)}
                  className="flex items-center gap-1 group"
                >
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className={cn('text-[11px] group-hover:text-violet-400 transition-colors',
                    'text-[var(--app-text-muted)]'
                  )}>
                    AI Suggestion
                  </span>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className={cn('text-[11px] mt-1 leading-relaxed pl-5',
                        'text-[var(--app-text-secondary)]'
                      )}>
                        {followUp.aiSuggestion}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right: Badges + Actions */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-semibold', priCfg.bg, priCfg.text)}>
              {priCfg.label}
            </span>
            <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium', statusCfg.bg, statusCfg.text)}>
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {/* Action Buttons */}
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-[var(--app-hover-bg)]'
            )} title="Mark Done">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </button>
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-[var(--app-hover-bg)]'
            )} title="Snooze">
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-[var(--app-hover-bg)]'
            )} title="Reschedule">
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <Separator orientation="vertical" className="h-4 mx-0.5" />
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              isDark ? 'hover:bg-green-500/10' : 'hover:bg-green-500/10'
            )} title="WhatsApp">
              <MessageCircle className="w-3.5 h-3.5 text-green-500" />
            </button>
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-[var(--app-hover-bg)]'
            )} title="Email">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
            </button>
            <button className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-[var(--app-hover-bg)]'
            )} title="Call">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
