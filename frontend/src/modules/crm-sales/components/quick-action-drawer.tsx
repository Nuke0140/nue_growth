'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Phone, MessageCircle, Mail, Handshake, Plus, Calendar,
  FileText, StickyNote, Clock, ArrowRight,
} from 'lucide-react';

interface QuickActionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
}

const actions = [
  { icon: Phone, label: 'Call', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: MessageCircle, label: 'WhatsApp', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { icon: Mail, label: 'Email', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Handshake, label: 'Create Deal', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Plus, label: 'Add Task', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Calendar, label: 'Schedule Meeting', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: FileText, label: 'Send Proposal', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { icon: StickyNote, label: 'Add Note', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const recentActions = [
  { text: 'Called Arjun Mehta', time: '2 hours ago' },
  { text: 'Sent proposal to Sarah Chen', time: '5 hours ago' },
  { text: 'Meeting with Raj Patel', time: 'Yesterday' },
  { text: 'Added note for Emily Johnson', time: 'Yesterday' },
  { text: 'Scheduled demo for Maria Santos', time: '2 days ago' },
];

export default function QuickActionDrawer({ open, onOpenChange, contactName }: QuickActionDrawerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'w-full sm:max-w-md p-0 overflow-y-auto',
          isDark ? 'bg-[#111] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-black')}>
            Quick Actions
          </SheetTitle>
          <SheetDescription className={cn(isDark ? 'text-white/40' : 'text-black/40')}>
            {contactName ? `Actions for ${contactName}` : 'Select a quick action to perform'}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6">
          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25}}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 text-left group',
                  isDark
                    ? 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08]'
                    : 'bg-black/[0.02] border border-black/[0.04] hover:bg-black/[0.04] hover:border-black/[0.08]'
                )}
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', action.bg)}>
                  <action.icon className={cn('w-4 h-4', action.color)} />
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  isDark ? 'text-white/70 group-hover:text-white' : 'text-black/70 group-hover:text-black'
                )}>
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>

          <Separator className={cn(isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />

          {/* Recent Actions */}
          <div className="mt-5">
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-3',
              isDark ? 'text-white/30' : 'text-black/30'
            )}>
              Recent Actions
            </h4>
            <div className="space-y-1">
              {recentActions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25}}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer',
                    isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
                  )}
                >
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    isDark ? 'bg-white/20' : 'bg-black/20'
                  )} />
                  <span className={cn(
                    'text-sm flex-1',
                    isDark ? 'text-white/60' : 'text-black/60'
                  )}>
                    {item.text}
                  </span>
                  <span className={cn(
                    'text-[11px] shrink-0',
                    isDark ? 'text-white/25' : 'text-black/25'
                  )}>
                    {item.time}
                  </span>
                  <ArrowRight className={cn(
                    'w-3 h-3 opacity-0 group-hover:opacity-100',
                    isDark ? 'text-white/20' : 'text-black/20'
                  )} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
