'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockActivities } from './data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ActivityType } from '@/modules/crm-sales/types';
import {
  Search, Plus, Phone, Mail, MessageCircle, Users,
  MonitorPlay, FileText, Globe, CreditCard, Share2,
  Calendar, Clock, Filter, Inbox,
} from 'lucide-react';

const activityConfig: Record<ActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  call: { icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  email: { icon: Mail, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  whatsapp: { icon: MessageCircle, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  meeting: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  demo: { icon: MonitorPlay, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  proposal: { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  note: { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/10' },
  file_share: { icon: Share2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  website_visit: { icon: Globe, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  payment: { icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const typeLabels: Record<ActivityType, string> = {
  call: 'Calls',
  email: 'Emails',
  whatsapp: 'WhatsApp',
  meeting: 'Meetings',
  demo: 'Demos',
  proposal: 'Proposals',
  note: 'Notes',
  file_share: 'File Shares',
  website_visit: 'Website Visits',
  payment: 'Payments',
};

const filterTypes: { key: ActivityType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'call', label: 'Calls' },
  { key: 'email', label: 'Emails' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'meeting', label: 'Meetings' },
  { key: 'demo', label: 'Demos' },
  { key: 'proposal', label: 'Proposals' },
  { key: 'note', label: 'Notes' },
];

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getDateGroup(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date('2026-04-09');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const activityDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (activityDate.getTime() === today.getTime()) return 'Today';
  if (activityDate.getTime() === yesterday.getTime()) return 'Yesterday';
  if (activityDate >= lastWeek) return 'This Week';
  return 'Earlier';
}

export default function ActivitiesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<ActivityType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let data = [...mockActivities];
    if (activeType !== 'all') {
      data = data.filter((a) => a.type === activeType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (a) =>
          a.subject.toLowerCase().includes(q) ||
          a.contactName?.toLowerCase().includes(q) ||
          a.companyName?.toLowerCase().includes(q)
      );
    }
    if (dateFilter !== 'all') {
      data = data.filter((a) => getDateGroup(a.date) === dateFilter);
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, activeType, dateFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((a) => {
      const group = getDateGroup(a.date);
      if (!groups[group]) groups[group] = [];
      groups[group].push(a);
    });
    const order = ['Today', 'Yesterday', 'This Week', 'Earlier'];
    return order.filter((g) => groups[g]).map((g) => ({ label: g, activities: groups[g] }));
  }, [filtered]);

  const dateFilters = ['all', 'Today', 'Yesterday', 'This Week'];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
              Activities
            </h1>
            <p className={cn('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
              {filtered.length} activities tracked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl border',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-40',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
            </div>
            <Button
              size="sm"
              className={cn(
                'rounded-xl text-xs h-9 px-4',
                isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
              )}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
          {dateFilters.map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                dateFilter === f
                  ? isDark
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-black/[0.06] text-black'
                  : isDark
                    ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
              )}
            >
              {f === 'all' ? 'All Time' : f}
            </button>
          ))}
        </div>

        {/* Type filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
          {filterTypes.map((ft) => (
            <button
              key={ft.key}
              onClick={() => setActiveType(ft.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                activeType === ft.key
                  ? isDark
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-black/[0.06] text-black'
                  : isDark
                    ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
              )}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <ScrollArea className="flex-1 px-6 pb-6">
        {grouped.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
              isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
            )}>
              <Inbox className={cn('w-7 h-7', isDark ? 'text-white/20' : 'text-black/20')} />
            </div>
            <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
              No activities found
            </p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-black/25')}>
              Try adjusting your filters or add a new activity
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group, gi) => (
              <div key={group.label}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    isDark ? 'text-white/30' : 'text-black/30'
                  )}>
                    {group.label}
                  </span>
                  <Badge variant="outline" className={cn(
                    'text-[10px] px-1.5 py-0 h-4',
                    isDark ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'
                  )}>
                    {group.activities.length}
                  </Badge>
                  <div className={cn(
                    'flex-1 h-px',
                    isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                  )} />
                </div>

                {/* Activity items */}
                <div className="space-y-1.5">
                  {group.activities.map((activity, i) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: gi * 0.1 + i * 0.04 }}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-default',
                          isDark
                            ? 'hover:bg-white/[0.03]'
                            : 'hover:bg-black/[0.02]'
                        )}
                      >
                        {/* Type icon */}
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                          config.bg
                        )}>
                          <Icon className={cn('w-4 h-4', config.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={cn(
                                'text-sm font-medium leading-snug',
                                isDark ? 'text-white/90' : 'text-black/90'
                              )}>
                                {activity.subject}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {activity.contactName && (
                                  <button
                                    onClick={() => activity.contactId && selectContact(activity.contactId)}
                                    className={cn(
                                      'text-xs font-medium transition-colors',
                                      isDark
                                        ? 'text-purple-400 hover:text-purple-300'
                                        : 'text-purple-600 hover:text-purple-500'
                                    )}
                                  >
                                    {activity.contactName}
                                  </button>
                                )}
                                {activity.contactName && activity.companyName && (
                                  <span className={cn('text-[10px]', isDark ? 'text-white/15' : 'text-black/15')}>
                                    •
                                  </span>
                                )}
                                {activity.companyName && (
                                  <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                                    {activity.companyName}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Clock className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
                              <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
                                {formatTime(activity.date)}
                              </span>
                            </div>
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
                              {activity.userName}
                            </span>
                            {activity.duration && (
                              <>
                                <span className={cn('text-[10px]', isDark ? 'text-white/15' : 'text-black/15')}>•</span>
                                <span className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>
                                  {activity.duration}
                                </span>
                              </>
                            )}
                            {activity.outcome && (
                              <>
                                <span className={cn('text-[10px]', isDark ? 'text-white/15' : 'text-black/15')}>•</span>
                                <Badge variant="outline" className={cn(
                                  'text-[10px] px-1.5 py-0 h-4 font-normal',
                                  isDark ? 'border-white/8 text-white/40' : 'border-black/8 text-black/40'
                                )}>
                                  {activity.outcome}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
