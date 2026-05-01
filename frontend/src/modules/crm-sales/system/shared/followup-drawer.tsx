'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Phone, MessageCircle, Mail, CalendarPlus,
  FileText, Handshake, StickyNote, Clock,
  Sparkles
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const quickActions = [
  { icon: Phone, label: 'Call', color: 'text-emerald-500', hoverBg: 'bg-emerald-500/10' },
  { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-500', hoverBg: 'bg-green-500/10' },
  { icon: Mail, label: 'Email', color: 'text-sky-500', hoverBg: 'bg-sky-500/10' },
  { icon: CalendarPlus, label: 'Schedule Demo', color: 'text-violet-500', hoverBg: 'bg-violet-500/10' },
  { icon: FileText, label: 'Send Proposal', color: 'text-amber-500', hoverBg: 'bg-amber-500/10' },
  { icon: Handshake, label: 'Create Deal', color: 'text-orange-500', hoverBg: 'bg-orange-500/10' },
  { icon: StickyNote, label: 'Add Note', color: 'text-pink-500', hoverBg: 'bg-pink-500/10' },
  { icon: Clock, label: 'Snooze', color: 'text-zinc-500', hoverBg: 'bg-zinc-500/10' },
];

const recentFollowUps = [
  { type: 'call', text: 'Discovery call completed', time: '2 hours ago', icon: Phone },
  { type: 'email', text: 'Pricing deck sent', time: '1 day ago', icon: Mail },
  { type: 'whatsapp', text: 'Follow-up message', time: '2 days ago', icon: MessageCircle },
  { type: 'demo', text: 'Product demo scheduled', time: '3 days ago', icon: CalendarPlus },
  { type: 'note', text: 'Internal note added', time: '5 days ago', icon: StickyNote },
];

export default function FollowupDrawer({
  open,
  onOpenChange,
  leadName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'w-[400px] sm:w-[440px] sm:max-w-[440px] p-0 overflow-y-auto',
          'bg-[var(--app-bg)] border-[var(--app-border)]'
        )}
      >
        {/* Header */}
        <SheetHeader className={cn(
          'p-6 pb-4 border-b',
          'border-[var(--app-border)]'
        )}>
          <SheetTitle className={cn('text-lg font-semibold', 'text-[var(--app-text)]')}>
            Quick Actions
            {leadName && (
              <span className={cn(' font-normal text-sm ml-2', 'text-[var(--app-text-secondary)]')}>
                — {leadName}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-app-2xl">
          {/* Quick Actions Grid */}
          <div>
            <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
              Take Action
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2}}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-[var(--app-radius-lg)] transition-colors duration-200 group',
                    isDark
                      ? `hover:${action.hoverBg} hover:bg-white/[0.06]`
                      : `hover:${action.hoverBg} hover:bg-black/[0.04]`,
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                    isDark ? 'bg-white/[0.04] group-hover:bg-white/[0.08]' : 'bg-black/[0.03] group-hover:bg-black/[0.06]'
                  )}>
                    <action.icon className={cn('w-5 h-5', action.color)} />
                  </div>
                  <span className={cn('text-[10px] font-medium leading-tight text-center', 'text-[var(--app-text-secondary)]')}>
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className={cn(
            'rounded-[var(--app-radius-lg)] p-4 border',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>
                AI Suggestion
              </span>
            </div>
            <Textarea
              placeholder="AI-powered follow-up suggestion will appear here..."
              rows={3}
              className={cn(
                'text-xs resize-none rounded-[var(--app-radius-lg)] border-0',
                isDark
                  ? 'bg-white/[0.03] text-white/70 placeholder:text-white/20 focus-visible:ring-white/[0.08]'
                  : 'bg-black/[0.02] text-black/70 placeholder:text-black/20 focus-visible:ring-black/[0.08]'
              )}
              defaultValue={leadName
                ? `Based on ${leadName}'s engagement pattern, the best time to reach out is between 2-4 PM. Consider mentioning the ROI metrics discussed in the last demo.`
                : ''
              }
            />
          </div>

          {/* Recent Follow-ups */}
          <div>
            <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
              Recent Follow-ups
            </h3>
            <div className="space-y-2">
              {recentFollowUps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25}}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-[var(--app-radius-lg)] transition-colors',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <item.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>
                      {item.text}
                    </p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                      {item.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
