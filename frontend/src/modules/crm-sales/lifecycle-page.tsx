'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { mockLifecycleStages } from './data/mock-data';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { LifecycleStage } from '@/modules/crm-sales/types';
import {
  GitBranch, TrendingUp, TrendingDown, AlertTriangle,
  Zap, Clock, ArrowRight, BarChart3, Users, Activity,
} from 'lucide-react';

const stageLabels: Record<LifecycleStage, string> = {
  lead: 'Lead',
  mql: 'MQL',
  sql: 'SQL',
  opportunity: 'Opportunity',
  customer: 'Customer',
  retained: 'Retained',
  advocate: 'Advocate',
};

const stageColors: Record<LifecycleStage, string> = {
  lead: 'text-gray-400',
  mql: 'text-blue-400',
  sql: 'text-cyan-400',
  opportunity: 'text-amber-400',
  customer: 'text-emerald-400',
  retained: 'text-purple-400',
  advocate: 'text-pink-400',
};

const stageBgColors: Record<LifecycleStage, string> = {
  lead: 'bg-gray-500/10',
  mql: 'bg-blue-500/10',
  sql: 'bg-cyan-500/10',
  opportunity: 'bg-amber-500/10',
  customer: 'bg-emerald-500/10',
  retained: 'bg-purple-500/10',
  advocate: 'bg-pink-500/10',
};

export default function LifecyclePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const maxCount = Math.max(...mockLifecycleStages.map((s) => s.count));
  const totalInPipeline = mockLifecycleStages.slice(0, 4).reduce((sum, s) => sum + s.count, 0);
  const totalCustomers = mockLifecycleStages.slice(4).reduce((sum, s) => sum + s.count, 0);

  // Find bottleneck: stage with highest drop-off
  const bottleneck = [...mockLifecycleStages]
    .filter((s) => s.dropOffRate > 0)
    .sort((a, b) => b.dropOffRate - a.dropOffRate)[0];

  // Find fastest stage: lowest avgDaysInStage (excluding 0s)
  const fastestStage = [...mockLifecycleStages]
    .filter((s) => s.avgDaysInStage > 0)
    .sort((a, b) => a.avgDaysInStage - b.avgDaysInStage)[0];

  // Overall conversion from lead to customer
  const leadToCustomer = mockLifecycleStages.find((s) => s.stage === 'lead');
  const customerStage = mockLifecycleStages.find((s) => s.stage === 'customer');
  const overallConversion = leadToCustomer && customerStage
    ? Math.round((customerStage.count / leadToCustomer.count) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              Lifecycle
            </h1>
            <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
              Customer journey stages &amp; conversion analysis
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        {/* Analytics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total in Pipeline', value: totalInPipeline.toLocaleString(), icon: Users, color: 'text-blue-400' },
            { label: 'Total Customers', value: totalCustomers.toLocaleString(), icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Overall Conversion', value: `${overallConversion}%`, icon: Activity, color: 'text-amber-400' },
            { label: 'Biggest Bottleneck', value: bottleneck ? stageLabels[bottleneck.stage] : '—', icon: AlertTriangle, color: 'text-red-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'rounded-xl p-4',
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.04]'
                  : 'bg-white border border-black/[0.04] shadow-sm'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn('w-4 h-4', stat.color)} />
                <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
              </div>
              <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Horizontal Funnel */}
        <div className="mb-8">
          <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
            <GitBranch className="w-4 h-4" />
            Stage Funnel
          </h2>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {mockLifecycleStages.map((stage, i) => {
              const widthPercent = Math.max(15, (stage.count / maxCount) * 100);
              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: `${widthPercent}%` }}
                  className="shrink-0"
                >
                  <div className={cn(
                    'rounded-xl p-3 transition-colors',
                    isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.06] shadow-sm'
                  )}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={cn('w-2 h-2 rounded-full', stageBgColors[stage.stage].replace('/10', '/40'))} />
                      <span className={cn('text-[10px] font-medium truncate', stageColors[stage.stage])}>
                        {stageLabels[stage.stage]}
                      </span>
                    </div>
                    <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                      {stage.count}
                    </p>
                    {stage.conversionRate > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">{stage.conversionRate}% conv</span>
                      </div>
                    )}
                    {stage.dropOffRate > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] text-red-400">{stage.dropOffRate}% drop</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Funnel arrows */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-1">
            {mockLifecycleStages.slice(0, -1).map((_, i) => {
              const widthPercent = Math.max(15, (mockLifecycleStages[i].count / maxCount) * 100);
              return (
                <div key={i} style={{ width: `${widthPercent}%` }} className="shrink-0 flex justify-center">
                  <ArrowRight className={cn('w-3 h-3', 'text-[var(--app-text-disabled)]')} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Detail Cards */}
        <div className="mb-8">
          <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
            <BarChart3 className="w-4 h-4" />
            Stage Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockLifecycleStages.map((stage, i) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'rounded-2xl p-5 transition-all',
                  isDark
                    ? 'bg-white/[0.03] border border-white/[0.06]'
                    : 'bg-white border border-black/[0.06] shadow-sm'
                )}
              >
                {/* Stage header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      stageBgColors[stage.stage]
                    )}>
                      <GitBranch className={cn('w-4 h-4', stageColors[stage.stage])} />
                    </div>
                    <div>
                      <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                        {stageLabels[stage.stage]}
                      </h3>
                      <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                        {stage.count} contacts
                      </span>
                    </div>
                  </div>
                  <div className={cn('text-2xl font-bold', stageColors[stage.stage])}>
                    {stage.count}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {stage.conversionRate > 0 && (
                    <div className={cn(
                      'rounded-lg p-2 text-center',
                      isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/5'
                    )}>
                      <p className="text-[10px] text-emerald-400 mb-0.5">Conv.</p>
                      <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>
                        {stage.conversionRate}%
                      </p>
                    </div>
                  )}
                  {stage.dropOffRate > 0 && (
                    <div className={cn(
                      'rounded-lg p-2 text-center',
                      isDark ? 'bg-red-500/5' : 'bg-red-500/5'
                    )}>
                      <p className="text-[10px] text-red-400 mb-0.5">Drop-off</p>
                      <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>
                        {stage.dropOffRate}%
                      </p>
                    </div>
                  )}
                  {stage.avgDaysInStage > 0 && (
                    <div className={cn(
                      'rounded-lg p-2 text-center',
                      isDark ? 'bg-amber-500/5' : 'bg-amber-500/5'
                    )}>
                      <p className="text-[10px] text-amber-400 mb-0.5">Avg Days</p>
                      <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>
                        {stage.avgDaysInStage}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-8 mb-3">
                  {mockLifecycleStages.map((s, si) => {
                    const isActive = si === i;
                    const h = Math.max(4, (s.count / maxCount) * 100);
                    return (
                      <div
                        key={s.stage}
                        className={cn(
                          'flex-1 rounded-sm min-h-[3px] transition-all',
                          isActive
                            ? stageBgColors[s.stage].replace('/10', '/40')
                            : 'bg-[var(--app-hover-bg)]'
                        )}
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>

                {/* AI Insight */}
                {stage.aiInsight && (
                  <div className={cn(
                    'rounded-lg p-3 flex items-start gap-2',
                    isDark ? 'bg-purple-500/5 border border-purple-500/10' : 'bg-purple-500/5 border border-purple-500/10'
                  )}>
                    <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                      {stage.aiInsight}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Bottleneck Insights */}
        <div>
          <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
            <Zap className="w-4 h-4 text-purple-400" />
            AI Bottleneck Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLifecycleStages
              .filter((s) => s.dropOffRate > 30 && s.aiInsight)
              .sort((a, b) => b.dropOffRate - a.dropOffRate)
              .map((stage, i) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'rounded-xl p-4 border',
                    isDark
                      ? 'bg-red-500/5 border-red-500/10'
                      : 'bg-red-500/5 border-red-500/10'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                      {stageLabels[stage.stage]} → {stageLabels[mockLifecycleStages[i + 1]?.stage || 'retained']}
                    </span>
                    <Badge className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0 h-5 border-0">
                      {stage.dropOffRate}% drop
                    </Badge>
                  </div>
                  <p className={cn('text-xs leading-relaxed mb-3', 'text-[var(--app-text-muted)]')}>
                    {stage.aiInsight}
                  </p>
                  <div className={cn(
                    'text-[10px] font-medium flex items-center gap-1',
                    isDark ? 'text-emerald-400/70' : 'text-emerald-600/70'
                  )}>
                    <Zap className="w-3 h-3" />
                    Recommendation: Focus on improving lead qualification criteria
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
