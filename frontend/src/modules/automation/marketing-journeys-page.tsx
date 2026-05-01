'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Megaphone, Play, Pencil, Plus, ArrowRight,
  Users, MessageSquare, Send, TrendingUp, Bot, Mail, Smartphone, Bell, Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  marketingJourneys as journeyData,
  marketingJourneyStats,
} from './data/mock-data';
import type { MarketingJourney } from './data/mock-data';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  paused: { label: 'Paused', bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  draft: { label: 'Draft', bg: 'bg-zinc-500/15', text: 'text-zinc-400', dot: 'bg-zinc-400' },
};

const CHANNEL_ICONS: Record<string, React.ElementType> = { email: Mail, sms: Smartphone, whatsapp: MessageSquare, push: Bell, 'in-app': Monitor };

function KpiCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn('rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}>
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-400' : 'text-zinc-500')}>{label}</p>
          <p className={cn('text-xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function JourneyCard({ item, index }: { item: MarketingJourney; index: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [enabled, setEnabled] = useState(item.status === 'active');
  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.active;
  const steps = item.steps || [
    { day: 'Day 1', label: item.trigger || 'Start', type: 'email' },
    { day: 'Day 3', label: 'Follow-up', type: 'email' },
    { day: 'Day 7', label: item.action?.slice(0, 20) || 'Engage', type: 'whatsapp' },
    { day: 'Day 14', label: 'Convert', type: 'email' },
  ];
  const successRate = item.metrics?.successRate ?? item.conversionRate ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35}}
      whileHover={{ y: -3, boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.08)' }}
      className={cn('rounded-2xl border p-5 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.01]')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-sm font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>{item.name}</h3>
          <p className={cn('text-xs mt-0.5 line-clamp-2', isDark ? 'text-zinc-400' : 'text-zinc-500')}>{item.description}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0', statusCfg.bg, statusCfg.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
          {statusCfg.label}
        </span>
      </div>

      <div className={cn('rounded-xl p-3 mb-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
        <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-2', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Journey Flow</p>
        <div className="flex items-center gap-0 overflow-x-auto py-1">
          {steps.map((step, i) => {
            const ChIcon = CHANNEL_ICONS[step.type] || Mail;
            return (
              <div key={i} className="flex items-center shrink-0">
                <div className="flex flex-col items-center min-w-[60px]">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg mb-1', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]')}>
                    <ChIcon className={cn('h-3.5 w-3.5', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
                  </div>
                  <p className={cn('text-[9px] font-semibold', isDark ? 'text-zinc-400' : 'text-zinc-500')}>{step.day}</p>
                  <p className={cn('text-[8px] truncate max-w-[56px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>{step.label}</p>
                </div>
                {i < steps.length - 1 && <ArrowRight className={cn('h-3 w-3 mx-1.5 shrink-0 -mt-3', isDark ? 'text-zinc-600' : 'text-zinc-300')} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Runs</p>
          <p className={cn('text-sm font-bold mt-0.5', isDark ? 'text-white' : 'text-zinc-900')}>{(item.metrics?.runs ?? 0).toLocaleString()}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Success</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }} transition={{ duration: 0.15, ease: 'easeOut' }} className="h-full rounded-full bg-violet-500" />
            </div>
            <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>{successRate}%</span>
          </div>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>Contacts</p>
          <p className={cn('text-sm font-bold mt-0.5', isDark ? 'text-white' : 'text-zinc-900')}>{(item.contactCount ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', isDark ? 'border-white/[0.06] text-zinc-300 hover:bg-white/[0.06]' : 'border-black/[0.06] text-zinc-600 hover:bg-black/[0.04]')}>
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border', isDark ? 'border-white/[0.06] text-zinc-300 hover:bg-white/[0.06]' : 'border-black/[0.06] text-zinc-600 hover:bg-black/[0.04]')}>
            <TrendingUp className="h-3 w-3" /> Analytics
          </button>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', enabled ? 'bg-emerald-500' : isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]')}>
          <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>
    </motion.div>
  );
}

export default function MarketingJourneysPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const items = journeyData as unknown as MarketingJourney[];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', isDark ? 'bg-violet-500/10' : 'bg-violet-500/10')}>
                <Megaphone className="h-5 w-5 text-violet-500" />
              </div>
              <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>Marketing Journeys</h1>
            </div>
            <p className={cn('text-sm mt-1.5 ml-[46px]', isDark ? 'text-zinc-400' : 'text-zinc-500')}>Design customer engagement flows</p>
          </div>
          <Button className={cn('shrink-0 h-9 px-4 rounded-xl text-xs font-semibold', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Journey
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total Journeys" value={marketingJourneyStats.totalJourneys.toString()} icon={Bot} color="text-violet-500" />
          <KpiCard label="Active Contacts" value={marketingJourneyStats.activeContacts.toLocaleString()} icon={Users} color="text-blue-500" />
          <KpiCard label="Messages Sent" value={marketingJourneyStats.messagesSent.toLocaleString()} icon={Send} color="text-emerald-500" />
          <KpiCard label="Conversion Rate" value={`${marketingJourneyStats.conversionRate}%`} icon={TrendingUp} color="text-amber-500" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <JourneyCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
