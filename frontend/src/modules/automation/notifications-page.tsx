'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Bell, BellRing, Plus, Mail, MessageCircle, Smartphone,
  Monitor, Radio, Hash, AlertTriangle, CheckCircle2, Pause, XCircle,
  RotateCcw, Clock, Copy,
} from 'lucide-react';
import { notificationRules } from './data/mock-data';
import type { NotificationChannel } from './types';

const CHANNEL_TABS = ['All', 'Email', 'WhatsApp', 'SMS', 'In-App', 'Push', 'Slack'] as const;
type ChannelTab = typeof CHANNEL_TABS[number];

const CHANNEL_CONFIG: Record<NotificationChannel, { color: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
  email: { color: 'border-blue-500', bgColor: 'bg-blue-500/15', textColor: 'text-blue-400', icon: Mail },
  whatsapp: { color: 'border-green-500', bgColor: 'bg-green-500/15', textColor: 'text-green-400', icon: MessageCircle },
  sms: { color: 'border-orange-500', bgColor: 'bg-orange-500/15', textColor: 'text-orange-400', icon: Smartphone },
  'in-app': { color: 'border-purple-500', bgColor: 'bg-purple-500/15', textColor: 'text-purple-400', icon: Monitor },
  push: { color: 'border-cyan-500', bgColor: 'bg-cyan-500/15', textColor: 'text-cyan-400', icon: Radio },
  slack: { color: 'border-indigo-500', bgColor: 'bg-indigo-500/15', textColor: 'text-indigo-400', icon: Hash },
};

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  active: { icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: 'Active' },
  paused: { icon: Pause, color: 'text-amber-400', bgColor: 'bg-amber-500/15', label: 'Paused' },
  error: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/15', label: 'Error' },
};

const AVATAR_COLORS = [
  'bg-blue-500/20 text-blue-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-purple-500/20 text-purple-400',
  'bg-orange-500/20 text-orange-400',
  'bg-pink-500/20 text-pink-400',
  'bg-cyan-500/20 text-cyan-400',
];

export default function NotificationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<ChannelTab>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    if (activeTab === 'All') return notificationRules;
    const channelMap: Record<string, NotificationChannel> = {
      'Email': 'email',
      'WhatsApp': 'whatsapp',
      'SMS': 'sms',
      'In-App': 'in-app',
      'Push': 'push',
      'Slack': 'slack',
    };
    return notificationRules.filter((r) => r.channel === channelMap[activeTab]);
  }, [activeTab]);

  const totalRules = notificationRules.length;
  const activeRules = notificationRules.filter((r) => r.status === 'active').length;
  const avgDeliveryRate = Math.round(notificationRules.reduce((sum, r) => sum + r.successRate, 0) / totalRules * 10) / 10;
  const avgFailureRate = Math.round((100 - avgDeliveryRate) * 10) / 10;

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  function formatTimestamp(ts: string) {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
              Notifications
            </h1>
            <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
              Manage delivery channels and templates
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shrink-0',
              'bg-blue-500 text-white hover:bg-blue-600',
            )}
          >
            <Plus className="h-4 w-4" />
            Create Rule
          </motion.button>
        </div>

        {/* Channel Tabs */}
        <div className="flex flex-wrap gap-2">
          {CHANNEL_TABS.map((tab, i) => {
            const count = tab === 'All'
              ? totalRules
              : notificationRules.filter((r) => {
                  const map: Record<string, NotificationChannel> = { Email: 'email', WhatsApp: 'whatsapp', SMS: 'sms', 'In-App': 'in-app', Push: 'push', Slack: 'slack' };
                  return r.channel === map[tab];
                }).length;
            return (
              <motion.button
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer',
                  activeTab === tab
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : isDark
                      ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1]'
                      : 'bg-black/[0.03] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.06]',
                )}
              >
                {tab}
                <span className={cn(
                  'text-[10px] rounded-full px-1.5 py-0.5',
                  activeTab === tab ? 'bg-blue-500/20' : isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]',
                )}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Rules', value: totalRules, icon: BellRing, color: 'text-blue-400', bg: 'bg-blue-500/15' },
            { label: 'Active', value: activeRules, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { label: 'Delivery Rate', value: `${avgDeliveryRate}%`, icon: Bell, color: 'text-purple-400', bg: 'bg-purple-500/15' },
            { label: 'Failure Rate', value: `${avgFailureRate}%`, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notification Rule Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRules.map((rule, i) => {
            const channelConf = CHANNEL_CONFIG[rule.channel];
            const statusConf = STATUS_CONFIG[rule.status];
            const ChannelIcon = channelConf.icon;
            const StatusIcon = statusConf.icon;

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'rounded-2xl border shadow-sm p-4 sm:p-5 space-y-3',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
                )}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                        {rule.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        channelConf.bgColor, channelConf.textColor,
                      )}>
                        <ChannelIcon className="h-3 w-3" />
                        {rule.channel}
                      </span>
                    </div>
                    <p className={cn('text-xs', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                      {rule.trigger}
                    </p>
                  </div>
                  <span className={cn(
                    'shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    statusConf.bgColor, statusConf.color,
                  )}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConf.label}
                  </span>
                </div>

                {/* Template */}
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    Template
                  </p>
                  <p className={cn('text-xs font-mono', isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                    {rule.template}
                  </p>
                </div>

                {/* Recipients */}
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    Recipients
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {rule.recipients.map((recipient, ri) => (
                      <div
                        key={ri}
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold',
                          AVATAR_COLORS[ri % AVATAR_COLORS.length],
                        )}
                        title={recipient}
                      >
                        {recipient.split(' ').map((n) => n[0]).join('')}
                      </div>
                    ))}
                    <span className={cn('text-[10px] ml-1', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      {rule.recipients.length} recipients
                    </span>
                  </div>
                </div>

                {/* Retry Logic */}
                <div className={cn('rounded-xl p-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <RotateCcw className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Retry Logic
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={cn(isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                      Max {rule.retryLogic.maxAttempts} attempts
                    </span>
                    <span className={cn(isDark ? 'text-zinc-500' : 'text-zinc-400')}>·</span>
                    <span className={cn(isDark ? 'text-zinc-300' : 'text-zinc-600')}>
                      {rule.retryLogic.delay}s delay
                    </span>
                    {rule.retryLogic.fallbackChannel && (
                      <>
                        <span className={cn(isDark ? 'text-zinc-500' : 'text-zinc-400')}>·</span>
                        <span className={cn(
                          'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                          CHANNEL_CONFIG[rule.retryLogic.fallbackChannel].bgColor,
                          CHANNEL_CONFIG[rule.retryLogic.fallbackChannel].textColor,
                        )}>
                          Fallback: {rule.retryLogic.fallbackChannel}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Success Rate Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      Success Rate
                    </p>
                    <span className={cn('text-xs font-bold', rule.successRate >= 95 ? 'text-emerald-400' : rule.successRate >= 90 ? 'text-amber-400' : 'text-red-400')}>
                      {rule.successRate}%
                    </span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rule.successRate}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.15, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        rule.successRate >= 95 ? 'bg-emerald-500' : rule.successRate >= 90 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                    />
                  </div>
                </div>

                {/* Footer: Last Sent + Failure Count */}
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className={cn('h-3 w-3', isDark ? 'text-zinc-500' : 'text-zinc-400')} />
                    <span className={cn(isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      {rule.lastSent ? formatTimestamp(rule.lastSent) : 'Never sent'}
                    </span>
                  </div>
                  {rule.failureCount > 0 && (
                    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-red-500/15 text-red-400')}>
                      <AlertTriangle className="h-3 w-3" />
                      {rule.failureCount} failures
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
