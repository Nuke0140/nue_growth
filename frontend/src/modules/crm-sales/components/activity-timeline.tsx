'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Phone, Mail, MessageCircle, Video, FileText,
  Globe, DollarSign, StickyNote, ClipboardList, Presentation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity, ActivityType } from '@/modules/crm-sales/types';

const activityConfig: Record<ActivityType, { icon: React.ElementType; color: string; darkColor: string; label: string }> = {
  call: { icon: Phone, color: 'bg-blue-100 text-blue-600 border-blue-200', darkColor: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Call' },
  email: { icon: Mail, color: 'bg-violet-100 text-violet-600 border-violet-200', darkColor: 'bg-violet-500/15 text-violet-400 border-violet-500/20', label: 'Email' },
  whatsapp: { icon: MessageCircle, color: 'bg-green-100 text-green-600 border-green-200', darkColor: 'bg-green-500/15 text-green-400 border-green-500/20', label: 'WhatsApp' },
  meeting: { icon: Video, color: 'bg-amber-100 text-amber-600 border-amber-200', darkColor: 'bg-amber-500/15 text-amber-400 border-amber-500/20', label: 'Meeting' },
  demo: { icon: Presentation, color: 'bg-orange-100 text-orange-600 border-orange-200', darkColor: 'bg-orange-500/15 text-orange-400 border-orange-500/20', label: 'Demo' },
  proposal: { icon: FileText, color: 'bg-rose-100 text-rose-600 border-rose-200', darkColor: 'bg-rose-500/15 text-rose-400 border-rose-500/20', label: 'Proposal' },
  note: { icon: StickyNote, color: 'bg-yellow-100 text-yellow-600 border-yellow-200', darkColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', label: 'Note' },
  file_share: { icon: FileText, color: 'bg-cyan-100 text-cyan-600 border-cyan-200', darkColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', label: 'File Share' },
  website_visit: { icon: Globe, color: 'bg-teal-100 text-teal-600 border-teal-200', darkColor: 'bg-teal-500/15 text-teal-400 border-teal-500/20', label: 'Website Visit' },
  payment: { icon: DollarSign, color: 'bg-emerald-100 text-emerald-600 border-emerald-200', darkColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Payment' },
};

function getBorderColor(type: ActivityType, isDark: boolean) {
  const colors: Record<ActivityType, string> = {
    call: isDark ? 'border-l-blue-500/50' : 'border-l-blue-500',
    email: isDark ? 'border-l-violet-500/50' : 'border-l-violet-500',
    whatsapp: isDark ? 'border-l-green-500/50' : 'border-l-green-500',
    meeting: isDark ? 'border-l-amber-500/50' : 'border-l-amber-500',
    demo: isDark ? 'border-l-orange-500/50' : 'border-l-orange-500',
    proposal: isDark ? 'border-l-rose-500/50' : 'border-l-rose-500',
    note: isDark ? 'border-l-yellow-500/50' : 'border-l-yellow-500',
    file_share: isDark ? 'border-l-cyan-500/50' : 'border-l-cyan-500',
    website_visit: isDark ? 'border-l-teal-500/50' : 'border-l-teal-500',
    payment: isDark ? 'border-l-emerald-500/50' : 'border-l-emerald-500',
  };
  return colors[type] || (isDark ? 'border-l-zinc-500/50' : 'border-l-zinc-500');
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getTimeGroup(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'This Week';
  return 'Earlier';
}

interface ActivityTimelineProps {
  activities: Activity[];
}

function EmptyState({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
        'bg-[var(--app-hover-bg)]'
      )}>
        <ClipboardList className={cn('w-7 h-7', 'text-[var(--app-text-disabled)]')} />
      </div>
      <p className={cn('text-sm font-medium mb-1', 'text-[var(--app-text-secondary)]')}>
        No activities yet
      </p>
      <p className={cn('text-xs text-center max-w-[200px]', 'text-[var(--app-text-muted)]')}>
        Activities will appear here when you interact with contacts
      </p>
    </div>
  );
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const groupedActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const groups: { group: string; items: Activity[] }[] = [];

    const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];

    for (const activity of sorted) {
      const group = getTimeGroup(activity.date);
      const existingGroup = groups.find(g => g.group === group);
      if (existingGroup) {
        existingGroup.items.push(activity);
      } else {
        groups.push({ group, items: [activity] });
      }
    }

    return groups.sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
  }, [activities]);

  if (activities.length === 0) {
    return <EmptyState isDark={isDark} />;
  }

  return (
    <div className="space-y-6">
      {groupedActivities.map((group, groupIdx) => (
        <div key={group.group}>
          {/* Group Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              'text-[var(--app-text-muted)]'
            )}>
              {group.group}
            </span>
            <div className={cn(
              'flex-1 h-px',
              'bg-[var(--app-hover-bg)]'
            )} />
            <span className={cn(
              'text-[11px] font-medium',
              'text-[var(--app-text-disabled)]'
            )}>
              {group.items.length}
            </span>
          </div>

          {/* Activity Items */}
          <div className="space-y-1.5">
            {group.items.map((activity, itemIdx) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: (groupIdx * 0.1) + (itemIdx * 0.05),
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={cn(
                    'rounded-xl border-l-[3px] p-3 transition-colors duration-150',
                    getBorderColor(activity.type, isDark),
                    isDark
                      ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                      : 'bg-white hover:bg-black/[0.01]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                      isDark ? config.darkColor : config.color
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-sm font-medium truncate">{activity.subject}</h4>
                        <span className={cn('text-[11px] shrink-0', 'text-[var(--app-text-muted)]')}>
                          {formatTime(activity.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        {activity.contactName && (
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                            {activity.contactName}
                          </span>
                        )}
                        {activity.contactName && activity.companyName && (
                          <span className={cn('text-xs', 'text-[var(--app-text-disabled)]')}>·</span>
                        )}
                        {activity.companyName && (
                          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                            {activity.companyName}
                          </span>
                        )}
                      </div>

                      {/* Duration & Outcome */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {activity.duration && (
                          <span className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-medium',
                            'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                          )}>
                            {activity.duration}
                          </span>
                        )}
                        {activity.outcome && (
                          <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                            {activity.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
