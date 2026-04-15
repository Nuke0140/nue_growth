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
          isDark ? 'bg-[#0a0a0a] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}
      >
        {/* Header */}
        <SheetHeader className={cn(
          'p-6 pb-4 border-b',
          isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
        )}>
          <SheetTitle className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-black')}>
            Quick Actions
            {leadName && (
              <span className={cn(' font-normal text-sm ml-2', isDark ? 'text-white/50' : 'text-black/50')}>
                — {leadName}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Quick Actions Grid */}
          <div>
            <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
              Take Action
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 group',
                    isDark
                      ? `hover:${action.hoverBg} hover:bg-white/[0.06]`
                      : `hover:${action.hoverBg} hover:bg-black/[0.04]`,
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    isDark ? 'bg-white/[0.04] group-hover:bg-white/[0.08]' : 'bg-black/[0.03] group-hover:bg-black/[0.06]'
                  )}>
                    <action.icon className={cn('w-5 h-5', action.color)} />
                  </div>
                  <span className={cn('text-[10px] font-medium leading-tight text-center', isDark ? 'text-white/50' : 'text-black/50')}>
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className={cn(
            'rounded-xl p-4 border',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className={cn('text-xs font-semibold', isDark ? 'text-white/60' : 'text-black/60')}>
                AI Suggestion
              </span>
            </div>
            <Textarea
              placeholder="AI-powered follow-up suggestion will appear here..."
              rows={3}
              className={cn(
                'text-xs resize-none rounded-lg border-0',
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
            <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
              Recent Follow-ups
            </h3>
            <div className="space-y-2">
              {recentFollowUps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl transition-colors',
                    isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
                  )}>
                    <item.icon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium truncate', isDark ? 'text-white/70' : 'text-black/70')}>
                      {item.text}
                    </p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
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
