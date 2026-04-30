'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GitBranch, ArrowDownRight, ArrowRight, Clock, AlertTriangle,
  TrendingDown, CheckCircle2, Milestone, Zap, BarChart3,
  ChevronRight, Flame, Eye
} from 'lucide-react';
import { journeyStages, journeyEvents } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { JourneyStage, JourneyEvent } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const stageColors = [
  { accent: 'bg-sky-500', light: isDark => 'bg-[var(--app-info-bg)] text-[var(--app-info)]', bar: isDark => isDark ? 'bg-sky-500/40' : 'bg-sky-400' },
  { accent: 'bg-emerald-500', light: isDark => 'bg-[var(--app-success-bg)] text-[var(--app-success)]', bar: isDark => isDark ? 'bg-emerald-500/40' : 'bg-emerald-400' },
  { accent: 'bg-violet-500', light: isDark => 'bg-[var(--app-purple-light)] text-[var(--app-purple)]', bar: isDark => isDark ? 'bg-violet-500/40' : 'bg-violet-400' },
  { accent: 'bg-amber-500', light: isDark => 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]', bar: isDark => isDark ? 'bg-amber-500/40' : 'bg-amber-400' },
  { accent: 'bg-rose-500', light: isDark => isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-600', bar: isDark => isDark ? 'bg-rose-500/40' : 'bg-rose-400' },
];

const eventTypeConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  milestone: { color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: Milestone, label: 'Milestone' },
  friction: { color: 'text-amber-400', bg: 'bg-amber-500/15', icon: AlertTriangle, label: 'Friction' },
  conversion: { color: 'text-sky-400', bg: 'bg-sky-500/15', icon: CheckCircle2, label: 'Conversion' },
  dropoff: { color: 'text-red-400', bg: 'bg-red-500/15', icon: TrendingDown, label: 'Drop-off' },
};

export default function CustomerJourneyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const kpiStats = useMemo(() => {
    const totalAcquired = journeyStages[0].customers;
    const totalAdvocates = journeyStages[journeyStages.length - 1].customers;
    const overallConversion = ((totalAdvocates / totalAcquired) * 100).toFixed(1);
    const totalDropoff = totalAcquired - totalAdvocates;
    const avgDropoffPct = (journeyStages.reduce((s, st) => s + st.dropoff, 0) / (journeyStages.length - 1)).toFixed(1);
    return [
      { label: 'Total Acquired', value: `${totalAcquired}`, icon: GitBranch, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
      { label: 'Advocates', value: `${totalAdvocates}`, icon: Zap, color: 'text-rose-400', bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50' },
      { label: 'Overall Conversion', value: `${overallConversion}%`, icon: BarChart3, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
      { label: 'Total Drop-offs', value: `${totalDropoff}`, icon: TrendingDown, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
      { label: 'Avg Drop-off Rate', value: `${avgDropoffPct}%`, icon: Flame, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    ];
  }, [isDark]);

  const frictionEvents = useMemo(() =>
    journeyEvents.filter((e: JourneyEvent) => e.type === 'friction'),
    []
  );

  const milestoneEvents = useMemo(() =>
    journeyEvents.filter((e: JourneyEvent) => e.type === 'milestone'),
    []
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <GitBranch className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Customer Journey</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Lifecycle Visualization</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Eye className="w-4 h-4" />
            View Cohorts
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Journey Funnel Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Journey Funnel</span>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-0">
            {journeyStages.map((stage: JourneyStage, i) => {
              const widthPct = (stage.customers / journeyStages[0].customers) * 100;
              const sc = stageColors[i];
              const nextStage = journeyStages[i + 1];
              const conversionPct = nextStage ? ((nextStage.customers / stage.customers) * 100).toFixed(1) : null;
              const dropoffCount = nextStage ? stage.customers - nextStage.customers : 0;
              return (
                <div key={stage.id}>
                  {/* Stage Bar */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-24 shrink-0 text-right">
                      <p className={cn('text-xs font-semibold', 'text-[var(--app-text-secondary)]')}>{stage.name}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn('h-10 rounded-lg overflow-hidden flex items-center', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('h-full rounded-lg', sc.bar(isDark))}
                          />
                          <span className={cn('text-xs font-bold px-3 shrink-0', 'text-[var(--app-text-secondary)]')}>
                            {stage.customers}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          <Clock className="w-3 h-3 inline mr-0.5" />Avg {stage.avgDaysInStage} days
                        </span>
                        {i === 0 && (
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>100% from start</span>
                        )}
                        {i > 0 && (
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                            {stage.conversionFrom}% of acquired
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Transition Arrow / Drop-off indicator */}
                  {nextStage && (
                    <div className="flex items-center gap-4 my-1">
                      <div className="w-24 shrink-0" />
                      <div className="flex-1 flex items-center gap-2 px-1">
                        <div className="flex-1 flex items-center justify-center gap-2">
                          <ArrowRight className={cn('w-3 h-3', 'text-[var(--app-text-disabled)]')} />
                          <span className="text-[10px] font-medium text-emerald-500">{conversionPct}% convert</span>
                          {dropoffCount > 0 && (
                            <>
                              <div className={cn('h-3 w-px', isDark ? 'bg-white/10' : 'bg-black/10')} />
                              <TrendingDown className="w-3 h-3 text-red-400" />
                              <span className="text-[10px] font-medium text-red-400">-{dropoffCount} drop ({nextStage.dropoff}%)</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Journey Events Timeline + Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Events Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={cn('lg:col-span-2 rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Journey Events Timeline</span>
            </div>
            <div className="space-y-0">
              {journeyEvents.map((event: JourneyEvent, i) => {
                const eConf = eventTypeConfig[event.type] || eventTypeConfig.milestone;
                const EIcon = eConf.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.06, duration: 0.35 }}
                    className={cn('flex items-start gap-3 py-3', i < journeyEvents.length - 1 && cn('border-l-2 ml-1.5 pl-4', 'border-[var(--app-border)]'))}
                  >
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 -ml-1.5', eConf.bg, 'border-2', isDark ? 'border-[#0a0a0a]' : 'border-white')}>
                      <EIcon className={cn('w-3.5 h-3.5', eConf.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold">{event.client}</p>
                        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', eConf.bg, eConf.color)}>{event.stage}</Badge>
                        <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0', eConf.bg, eConf.color)}>{eConf.label}</Badge>
                      </div>
                      <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{event.event}</p>
                      <span className={cn('text-[10px] mt-0.5 block', 'text-[var(--app-text-disabled)]')}>{event.date}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Friction + Milestones */}
          <div className="space-y-4">
            {/* Friction Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-amber-500/[0.03] border-amber-500/20' : 'bg-amber-50 border-amber-200')}
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Friction Alerts</span>
                <Badge variant="secondary" className="text-[10px] bg-amber-500/15 text-amber-400">{frictionEvents.length}</Badge>
              </div>
              <div className="space-y-2.5">
                {frictionEvents.map((event: JourneyEvent) => (
                  <div key={event.id} className={cn('flex items-start gap-2.5 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-white')}>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{event.client}</p>
                      <p className={cn('text-[10px] leading-relaxed', 'text-[var(--app-text-muted)]')}>{event.event}</p>
                      <span className={cn('text-[10px] mt-0.5 block', 'text-[var(--app-text-disabled)]')}>{event.date} · {event.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Milestone Events */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={cn('rounded-2xl border p-5', isDark ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Milestone className="w-4 h-4 text-emerald-500" />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Milestone Events</span>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-400">{milestoneEvents.length}</Badge>
              </div>
              <div className="space-y-2.5">
                {milestoneEvents.map((event: JourneyEvent) => (
                  <div key={event.id} className={cn('flex items-start gap-2.5 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-white')}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{event.client}</p>
                      <p className={cn('text-[10px] leading-relaxed', 'text-[var(--app-text-muted)]')}>{event.event}</p>
                      <span className={cn('text-[10px] mt-0.5 block', 'text-[var(--app-text-disabled)]')}>{event.date} · {event.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lifecycle Conversion Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Conversion Summary</span>
              </div>
              <div className="space-y-3">
                {journeyStages.slice(1).map((stage: JourneyStage, i) => {
                  const prevStage = journeyStages[i];
                  const convRate = prevStage ? ((stage.customers / prevStage.customers) * 100).toFixed(1) : '0';
                  const isGood = parseFloat(convRate) >= 80;
                  return (
                    <div key={stage.id} className={cn('flex items-center justify-between p-2.5 rounded-xl', 'bg-[var(--app-hover-bg)]')}>
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', isGood ? 'bg-emerald-500' : 'bg-amber-500')} />
                        <span className="text-xs font-medium">{prevStage?.name} → {stage.name}</span>
                      </div>
                      <span className={cn('text-xs font-bold', isGood ? 'text-emerald-500' : 'text-amber-500')}>
                        {convRate}%
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Overall */}
              <div className={cn('mt-3 pt-3 border-t flex items-center justify-between', 'border-[var(--app-border)]')}>
                <span className="text-xs font-semibold">Overall: Acquired → Advocate</span>
                <span className="text-sm font-black text-emerald-500">
                  {((journeyStages[journeyStages.length - 1].customers / journeyStages[0].customers) * 100).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
