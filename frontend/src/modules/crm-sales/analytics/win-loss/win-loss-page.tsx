'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  TrendingUp, Download, Trophy, XCircle, Clock, DollarSign,
  AlertTriangle, BrainCircuit, Lightbulb, ChevronRight,
  BarChart3, Target, Sparkles, ArrowDown, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockWinLossData } from '@/modules/crm-sales/data/mock-data';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const PERIODS = ['Last 6 Months', 'Last Quarter', 'This Year'] as const;

const LOSS_REASON_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#a3e635', // lime
  '#6ee7b7', // emerald-light
];

const AI_INSIGHTS = [
  {
    title: 'Discovery → Demo Bottleneck',
    desc: '24% drop-off at Discovery stage. Leads show high initial interest but disengage during qualification calls. Consider shorter discovery sessions with pre-filled qualification forms.',
    severity: 'high' as const,
    metric: '24% drop-off',
  },
  {
    title: 'Pricing Sensitivity',
    desc: '35% of losses cite "Price too high". Our average discount is 12%, but winning deals close with only 8% discount. Reduce discount threshold and emphasize value metrics.',
    severity: 'high' as const,
    metric: '35% losses',
  },
  {
    title: 'Competitor: Salesforce Threat',
    desc: 'Salesforce accounts for 31% of all competitive losses. Lead with differentiation in AI capabilities and implementation speed. Create Salesforce-specific battle cards.',
    severity: 'medium' as const,
    metric: '8 deals lost',
  },
];

const STAGE_COLORS = [
  'rgba(16,185,129,0.7)',   // New - emerald
  'rgba(16,185,129,0.6)',   // Qualified
  'rgba(245,158,11,0.7)',   // Discovery - amber
  'rgba(245,158,11,0.6)',   // Demo
  'rgba(239,68,68,0.7)',    // Proposal - red
  'rgba(239,68,68,0.6)',    // Negotiation
  'rgba(16,185,129,0.9)',   // Won - bright emerald
];

export default function WinLossAnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<string>('Last 6 Months');

  const data = mockWinLossData;

  const maxMonthlyTotal = Math.max(...data.monthlyWinLoss.map(m => m.won + m.lost));

  // Loss reasons cumulative for pie chart (conic-gradient segments)
  const conicGradientStops = useMemo(() => {
    return data.lossReasons.reduce<{ gradient: string; acc: number }>((prev, r, i) => {
      const start = prev.acc;
      const end = start + r.percentage;
      const segment = `${LOSS_REASON_COLORS[i]} ${start}% ${end}%`;
      return { gradient: prev.gradient ? `${prev.gradient}, ${segment}` : segment, acc: end };
    }, { gradient: '', acc: 0 }).gradient;
  }, [data.lossReasons]);

  const totalCompetitorLosses = data.competitorLosses.reduce((s, c) => s + c.count, 0);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-app-2xl max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  Win / Loss Analysis
                </h1>
                <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
                  Optimization intelligence dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center rounded-[var(--app-radius-lg)] border overflow-hidden',
                  'border-[var(--app-border)]'
                )}>
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium transition-colors',
                        period === p
                          ? 'bg-[var(--app-card-bg)] text-[var(--app-text)]'
                          : isDark ? 'text-white/50 hover:text-white/80' : 'text-black/50 hover:text-black/80'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className={cn(
                  'h-10  px-3 rounded-[var(--app-radius-lg)] text-xs gap-1.5',
                  isDark ? 'border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.04]' : 'border-black/[0.06] text-black/60 hover:text-black hover:bg-black/[0.04]'
                )}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Top KPI Cards */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {[
                { label: 'Win Rate', value: `${data.winRate}%`, icon: Trophy, color: 'text-emerald-500', large: true },
                { label: 'Won Revenue', value: formatCurrency(data.totalWonRevenue), icon: TrendingUp, color: 'text-emerald-500' },
                { label: 'Lost Revenue', value: formatCurrency(data.totalLostRevenue), icon: XCircle, color: 'text-red-500' },
                { label: 'Avg Sales Cycle', value: `${data.avgSalesCycle}d`, icon: Clock, color: 'text-amber-500' },
              ].map((kpi) => (
                <div key={kpi.label} className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className={cn('w-4 h-4', kpi.color)} />
                    <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
                  </div>
                  <p className={cn('font-bold tracking-tight', kpi.large ? 'text-3xl' : 'text-xl', 'text-[var(--app-text)]')}>
                    {kpi.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Win vs Loss Chart */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15}}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-app-xl',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center gap-2 mb-app-xl">
                <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Monthly Win vs Loss
                </h3>
                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-[var(--app-radius-sm)] bg-emerald-500" />
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Won</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-[var(--app-radius-sm)] bg-red-500" />
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Lost</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-3 h-48">
                {data.monthlyWinLoss.map((m, i) => {
                  const total = m.won + m.lost;
                  const wonHeight = maxMonthlyTotal > 0 ? (m.won / maxMonthlyTotal) * 100 : 0;
                  const lostHeight = maxMonthlyTotal > 0 ? (m.lost / maxMonthlyTotal) * 100 : 0;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-end gap-0.5 w-full h-40">
                        {/* Won bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${wonHeight}%` }}
                          transition={{ duration: 0.15, ease: 'easeOut'}}
                          className="flex-1 rounded-t-[var(--app-radius-md)] bg-emerald-500 min-h-[2px] relative group"
                        >
                          <div className={cn(
                            'absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
                            'text-[var(--app-text-secondary)]'
                          )}>
                            {m.won}
                          </div>
                        </motion.div>
                        {/* Lost bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${lostHeight}%` }}
                          transition={{ duration: 0.15, ease: 'easeOut'}}
                          className="flex-1 rounded-t-[var(--app-radius-md)] bg-red-500 min-h-[2px] relative group"
                        >
                          <div className={cn(
                            'absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
                            'text-[var(--app-text-secondary)]'
                          )}>
                            {m.lost}
                          </div>
                        </motion.div>
                      </div>
                      <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-app-xl">
              {/* Competitor Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15}}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    Competitor Analysis
                  </h3>
                </div>

                <div className="space-y-3">
                  {data.competitorLosses.map((comp, i) => {
                    const lossPercent = totalCompetitorLosses > 0 ? Math.round((comp.count / totalCompetitorLosses) * 100) : 0;
                    const isTop = i === 0;
                    return (
                      <div
                        key={comp.competitor}
                        className={cn(
                          'rounded-[var(--app-radius-lg)] p-3',
                          isTop
                            ? (isDark ? 'bg-red-500/[0.06]' : 'bg-red-50/50')
                            : ('bg-[var(--app-hover-bg)]')
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                              {comp.competitor}
                            </span>
                            {isTop && (
                              <Badge className="bg-red-500/15 text-red-400 border-0 text-[9px] px-1.5 py-0">
                                Top Threat
                              </Badge>
                            )}
                          </div>
                          <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                            {comp.count} deals · {formatCurrency(comp.revenue)}
                          </span>
                        </div>
                        <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lossPercent}%` }}
                            transition={{ duration: 0.15, ease: 'easeOut'}}
                            className={cn(
                              'h-full rounded-full',
                              isTop ? 'bg-red-500' : (isDark ? 'bg-white/20' : 'bg-black/15')
                            )}
                          />
                        </div>
                        <p className={cn('text-[9px] mt-1 text-right', 'text-[var(--app-text-disabled)]')}>
                          {lossPercent}% of competitive losses
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Loss Reasons Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15}}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    Loss Reasons Breakdown
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-app-2xl">
                  {/* Pie chart */}
                  <div className="relative w-36 h-36 shrink-0">
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: `conic-gradient(${conicGradientStops})`,
                      }}
                    />
                    <div className={cn(
                      'absolute inset-4 rounded-full flex items-center justify-center',
                      isDark ? 'bg-[#0a0a0a]' : 'bg-white'
                    )}>
                      <div className="text-center">
                        <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                          {data.lostDeals}
                        </p>
                        <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>Lost Deals</p>
                      </div>
                    </div>
                  </div>

                  {/* Reason cards */}
                  <div className="flex-1 space-y-2 w-full">
                    {data.lossReasons.map((reason, i) => (
                      <div
                        key={reason.reason}
                        className={cn(
                          'flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--app-radius-lg)]',
                          'bg-[var(--app-hover-bg)]'
                        )}
                      >
                        <div className="w-2.5 h-2.5 rounded-[var(--app-radius-sm)] shrink-0" style={{ background: LOSS_REASON_COLORS[i] }} />
                        <span className={cn('text-xs flex-1 truncate', 'text-[var(--app-text-secondary)]')}>
                          {reason.reason}
                        </span>
                        <span className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                          {reason.count}
                        </span>
                        <span className={cn('text-[10px] w-10 text-right', 'text-[var(--app-text-muted)]')}>
                          {reason.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stage Drop-off Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15}}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-app-xl',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center gap-2 mb-app-xl">
                <Zap className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Stage Drop-off Funnel
                </h3>
              </div>

              <div className="space-y-2">
                {data.stageDropoffs.map((stage, i) => {
                  const widthPercent = data.stageDropoffs[0].entered > 0
                    ? (stage.entered / data.stageDropoffs[0].entered) * 100
                    : 0;
                  const dropColor = stage.dropRate >= 22
                    ? 'rgba(239,68,68,0.8)'
                    : stage.dropRate >= 18
                      ? 'rgba(245,158,11,0.7)'
                      : 'rgba(16,185,129,0.5)';

                  return (
                    <div key={stage.stage} className="flex items-center gap-3">
                      <div className="w-24 sm:w-28 shrink-0 text-right">
                        <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                          {stage.stage}
                        </span>
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 relative h-8 flex items-center">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(widthPercent, 8)}%` }}
                            transition={{ duration: 0.15, ease: 'easeOut'}}
                            className="h-full rounded-[var(--app-radius-md)] flex items-center justify-between px-3"
                            style={{
                              background: STAGE_COLORS[i],
                              minWidth: '60px',
                            }}
                          >
                            <span className="text-[10px] font-bold text-white">{stage.entered}</span>
                            {stage.dropRate > 0 && (
                              <div className="flex items-center gap-1">
                                <ArrowDown className="w-4 h-4 text-white/70" />
                                <span className="text-[9px] font-medium text-white/80">
                                  {stage.dropRate}%
                                </span>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </div>

                      <div className="w-14 sm:w-20 shrink-0 text-right">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                          {stage.exited} exited
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Bottleneck Insights */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  AI Bottleneck Insights
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AI_INSIGHTS.map((insight, i) => {
                  const severityColor = insight.severity === 'high'
                    ? 'text-red-500 bg-red-500/15'
                    : 'text-amber-500 bg-amber-500/15';
                  return (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={cn(
                        'rounded-[var(--app-radius-xl)] border p-4',
                        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-4 h-4 text-violet-400" />
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', severityColor)}>
                          {insight.severity === 'high' ? 'HIGH IMPACT' : 'MEDIUM'}
                        </span>
                        <span className={cn('ml-auto text-[9px] font-bold', 'text-[var(--app-text-muted)]')}>
                          {insight.metric}
                        </span>
                      </div>
                      <h4 className={cn('text-sm font-semibold mb-1.5', 'text-[var(--app-text)]')}>
                        {insight.title}
                      </h4>
                      <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                        {insight.desc}
                      </p>
                      <div className={cn(
                        'mt-3 pt-3 border-t flex items-center gap-1',
                        'border-[var(--app-border)]'
                      )}>
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                          AI Recommendation available
                        </span>
                        <ChevronRight className={cn('w-4 h-4 ml-auto', 'text-[var(--app-text-disabled)]')} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sales Cycle Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15}}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-app-xl',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center gap-2 mb-app-xl">
                <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                  Average Days per Stage
                </h3>
                <Badge variant="secondary" className={cn(
                  'ml-2 text-[9px] px-1.5 py-0',
                  isDark ? 'bg-white/[0.06] text-white/40 border-0' : 'bg-black/[0.06] text-black/40 border-0'
                )}>
                  {data.avgSalesCycle} days avg total
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { stage: 'New', days: 4, color: 'bg-emerald-500' },
                  { stage: 'Qualified', days: 6, color: 'bg-emerald-500/70' },
                  { stage: 'Discovery', days: 8, color: 'bg-amber-500' },
                  { stage: 'Demo', days: 5, color: 'bg-amber-500/70' },
                  { stage: 'Proposal', days: 6, color: 'bg-red-500/70' },
                  { stage: 'Negotiation', days: 5, color: 'bg-red-500' },
                ].map((s) => (
                  <div
                    key={s.stage}
                    className={cn(
                      'rounded-[var(--app-radius-lg)] p-3 text-center',
                      'bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <div className={cn('w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2', s.color)}>
                      <span className="text-white text-xs font-bold">{s.days}d</span>
                    </div>
                    <p className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                      {s.stage}
                    </p>
                    <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>
                      avg days
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
