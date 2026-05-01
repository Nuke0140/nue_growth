'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, BellRing, Mail, MessageCircle, Smartphone,
  Monitor, Send, Save, Check,
} from 'lucide-react';
import { notificationPreferences } from './data/mock-data';

const channels = ['All', 'email', 'whatsapp', 'sms', 'in-app', 'push'] as const;

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: Smartphone,
  'in-app': Monitor,
  push: Bell,
};

const channelColors: Record<string, { dark: string; light: string }> = {
  email: { dark: 'bg-blue-500/15 text-blue-400', light: 'bg-blue-50 text-blue-600' },
  whatsapp: { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  sms: { dark: 'bg-amber-500/15 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  'in-app': { dark: 'bg-violet-500/15 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  push: { dark: 'bg-sky-500/15 text-sky-400', light: 'bg-sky-50 text-sky-600' },
};

const categoryDescriptions: Record<string, string> = {
  'Module Alerts': 'Notifications about module status and health',
  'Security Alerts': 'Security incidents and authentication events',
  'Billing Alerts': 'Invoices, payments, and subscription updates',
  'Workflow Alerts': 'Automation workflow status and failures',
  'Report Delivery': 'Scheduled reports and analytics delivery',
  'Escalation Alerts': 'SLA breaches and urgent escalations',
};

export default function NotificationsPreferencesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeChannel, setActiveChannel] = useState<string>('All');
  const [preferences, setPreferences] = useState(
    () => new Map(notificationPreferences.map((p) => [p.id, p.enabled]))
  );
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState<string | null>(null);

  const filteredPrefs = useMemo(() => {
    let prefs = notificationPreferences;
    if (activeChannel !== 'All') {
      prefs = prefs.filter((p) => p.channel === activeChannel);
    }
    return prefs;
  }, [activeChannel]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof filteredPrefs> = {};
    filteredPrefs.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredPrefs]);

  const totalPrefs = notificationPreferences.length;
  const enabledPrefs = notificationPreferences.filter((p) => p.enabled).length;

  const togglePreference = (id: string) => {
    setPreferences((prev) => {
      const next = new Map(prev);
      next.set(id, !next.get(id));
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = (channel: string) => {
    setTestSent(channel);
    setTimeout(() => setTestSent(null), 2500);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <BellRing className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Notification Preferences</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Configure how you receive notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
              {enabledPrefs}/{totalPrefs} active
            </span>
            <Button
              onClick={handleSave}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
                saved
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
              )}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Preferences'}
            </Button>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {channels.map((ch) => {
            const Icon = channelIcons[ch] || Bell;
            return (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize',
                  activeChannel === ch
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-black/10 text-black'
                    : isDark
                      ? 'bg-white/[0.04] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
                      : 'bg-black/[0.04] text-black/40 hover:bg-black/[0.06] hover:text-black/60'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {ch === 'in-app' ? 'In-App' : ch}
              </button>
            );
          })}
        </div>

        {/* Category Sections */}
        {Object.entries(groupedByCategory).map(([category, prefs], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.06, duration: 0.35 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>{category}</h3>
              <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? 'bg-white/[0.06] text-white/30' : 'bg-black/[0.06] text-black/30')}>
                {prefs.filter((p) => preferences.get(p.id)).length}/{prefs.length} active
              </Badge>
            </div>
            <p className={cn('text-[11px] mb-4', isDark ? 'text-white/25' : 'text-black/25')}>
              {categoryDescriptions[category]}
            </p>
            <div className="space-y-2">
              {prefs.map((pref) => {
                const isEnabled = preferences.get(pref.id) ?? pref.enabled;
                const chColor = channelColors[pref.channel];
                const ChIcon = channelIcons[pref.channel] || Bell;
                return (
                  <div
                    key={pref.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-colors',
                      isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => togglePreference(pref.id)}
                        className={cn(
                          'relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0',
                          isEnabled ? 'bg-emerald-500' : isDark ? 'bg-white/[0.15]' : 'bg-black/[0.15]'
                        )}
                      >
                        <motion.div
                          animate={{ x: isEnabled ? 14 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={cn('text-xs font-medium truncate', isEnabled ? '' : isDark ? 'text-white/40' : 'text-black/40')}>
                          {pref.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn('text-[9px] px-1.5 py-0 border-0 shrink-0 flex items-center gap-1 capitalize', isDark ? chColor.dark : chColor.light)}
                    >
                      <ChIcon className="w-2.5 h-2.5" />
                      {pref.channel}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {filteredPrefs.length === 0 && (
          <div className={cn('text-center py-12 rounded-2xl border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
            <Bell className={cn('w-8 h-8 mx-auto mb-3', isDark ? 'text-white/10' : 'text-black/10')} />
            <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No notifications configured for this channel</p>
          </div>
        )}

        {/* Test Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
        >
          <h3 className={cn('text-sm font-semibold mb-1 flex items-center gap-2', isDark ? 'text-white/70' : 'text-black/70')}>
            <Send className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            Send Test Notification
          </h3>
          <p className={cn('text-[11px] mb-4', isDark ? 'text-white/25' : 'text-black/25')}>
            Verify your notification channels are working correctly
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(channelIcons).map(([channel, Icon]) => {
              const isTested = testSent === channel;
              const chColor = channelColors[channel];
              return (
                <button
                  key={channel}
                  onClick={() => handleTest(channel)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                    isTested
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : isDark
                        ? 'border-white/[0.04] hover:bg-white/[0.04]'
                        : 'border-black/[0.04] hover:bg-black/[0.04]'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? chColor.dark : chColor.light)}>
                    {isTested ? <Check className="w-4 h-4 text-emerald-500" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn('text-[10px] font-medium capitalize', isTested ? 'text-emerald-500' : isDark ? 'text-white/50' : 'text-black/50')}>
                    {isTested ? 'Sent!' : channel === 'in-app' ? 'In-App' : channel}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
