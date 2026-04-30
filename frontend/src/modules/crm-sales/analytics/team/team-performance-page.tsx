'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Trophy, Plus, Crown, Star, Target, Clock, Zap,
  DollarSign, TrendingUp, Shield, Sparkles, Users,
  ChevronRight, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockTeamPerformance } from '@/modules/crm-sales/data/mock-data';
import type { TeamPerformance } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const RANK_STYLES: Record<number, { emoji: string; bg: string; ring: string; label: string }> = {
  1: { emoji: '🥇', bg: 'bg-amber-500/15', ring: 'ring-amber-500/40', label: '1st' },
  2: { emoji: '🥈', bg: 'bg-slate-400/15', ring: 'ring-slate-400/40', label: '2nd' },
  3: { emoji: '🥉', bg: 'bg-orange-700/15', ring: 'ring-orange-700/40', label: '3rd' },
};

const PERIODS = ['This Week', 'This Month', 'This Quarter'] as const;

function ScoreMeter({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const radius = size === 'sm' ? 28 : 36;
  const strokeWidth = size === 'sm' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2} className="-rotate-90">
        <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius}
          fill="none" stroke={'var(--app-border)'} strokeWidth={strokeWidth} />
        <motion.circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round" />
      </svg>
      <span className={cn('absolute font-bold', size === 'sm' ? 'text-xs' : 'text-sm',
        'text-[var(--app-text)]')}>
        {score}
      </span>
    </div>
  );
}

function TopPerformerCard({ rep, isDark }: { rep: TeamPerformance; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-6 md:p-app-3xl relative overflow-hidden',
        isDark
          ? 'bg-gradient-to-br from-amber-500/[0.08] via-white/[0.04] to-white/[0.02] border-amber-500/20'
          : 'bg-gradient-to-br from-amber-50 via-white to-white border-amber-200/50'
      )}
    >
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-app-2xl">
        <div className="flex items-center gap-app-xl">
          <div className={cn(
            'w-20 h-20 rounded-[var(--app-radius-xl)] flex items-center justify-center text-2xl font-black ring-2',
            isDark ? 'bg-amber-500/20 text-amber-300 ring-amber-500/30' : 'bg-amber-100 text-amber-700 ring-amber-300/50'
          )}>
            {rep.repName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className={cn('text-xs font-semibold uppercase tracking-widest',
                isDark ? 'text-amber-400/60' : 'text-amber-600/60')}>
                Top Performer
              </span>
            </div>
            <h2 className={cn('text-xl font-bold', 'text-[var(--app-text)]')}>{rep.repName}</h2>
            <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>
              {rep.dealsWon} deals won · {rep.closeRate}% close rate
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto">
          {[
            { label: 'Revenue', value: formatCurrency(rep.revenueClosed), icon: DollarSign },
            { label: 'Deals Won', value: rep.dealsWon.toString(), icon: Trophy },
            { label: 'SLA Score', value: `${rep.followUpSla}%`, icon: Shield },
            { label: 'AI Score', value: rep.aiProductivityScore.toString(), icon: Sparkles },
          ].map((metric) => (
            <div key={metric.label} className={cn(
              'rounded-[var(--app-radius-lg)] p-3 text-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <metric.icon className={cn('w-4 h-4 mx-auto mb-1', 'text-[var(--app-text-muted)]')} />
              <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{metric.value}</p>
              <p className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPerformancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<string>('This Month');

  const sortedReps = useMemo(() =>
    [...mockTeamPerformance].sort((a, b) => a.rank - b.rank),
    []
  );

  const topPerformer = sortedReps[0];
  const otherReps = sortedReps.slice(1);

  const teamSummary = useMemo(() => {
    const totalRevenue = mockTeamPerformance.reduce((s, r) => s + r.revenueClosed, 0);
    const avgCloseRate = Math.round(mockTeamPerformance.reduce((s, r) => s + r.closeRate, 0) / mockTeamPerformance.length);
    const bestResponse = mockTeamPerformance.reduce((best, r) =>
      parseFloat(r.avgResponseTime) < parseFloat(best.avgResponseTime) ? r : best
    );
    const avgSla = Math.round(mockTeamPerformance.reduce((s, r) => s + r.followUpSla, 0) / mockTeamPerformance.length);
    return { totalRevenue, avgCloseRate, bestResponse, avgSla };
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-app-2xl max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  Team Performance
                </h1>
                <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
                  Sales leaderboard &amp; rep analytics
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
                <Button className={cn(
                  'shrink-0 h-10  px-4 rounded-[var(--app-radius-lg)] text-xs font-semibold',
                  'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
                )}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Rep
                </Button>
              </div>
            </div>

            {/* Top Performer Hero Card */}
            {topPerformer && <TopPerformerCard rep={topPerformer} isDark={isDark} />}

            {/* Leaderboard Table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={cn(
                'rounded-[var(--app-radius-xl)] border overflow-hidden',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                      {['Rank', 'Rep', 'Deals Won', 'Revenue', 'SLA %', 'Avg Response', 'Close Rate', 'AI Score', 'Target'].map(col => (
                        <th key={col} className={cn(
                          'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                          'text-[var(--app-text-muted)]'
                        )}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReps.map((rep, i) => {
                      const rankStyle = RANK_STYLES[rep.rank];
                      const initials = rep.repName.split(' ').map(n => n[0]).join('');
                      return (
                        <motion.tr
                          key={rep.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 + 0.15 }}
                          className={cn(
                            'border-b transition-colors',
                            'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                          )}
                        >
                          {/* Rank */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            {rankStyle ? (
                              <div className={cn(
                                'flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--app-radius-lg)] w-fit',
                                rankStyle.bg
                              )}>
                                <span className="text-sm">{rankStyle.emoji}</span>
                                <span className={cn('text-xs font-bold',
                                  rep.rank === 1 ? (isDark ? 'text-amber-300' : 'text-amber-700') :
                                  rep.rank === 2 ? (isDark ? 'text-slate-300' : 'text-slate-600') :
                                  (isDark ? 'text-orange-300' : 'text-orange-700')
                                )}>
                                  #{rep.rank}
                                </span>
                              </div>
                            ) : (
                              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-[var(--app-radius-lg)]',
                                isDark ? 'text-white/40 bg-white/[0.04]' : 'text-black/40 bg-black/[0.04]'
                              )}>
                                #{rep.rank}
                              </span>
                            )}
                          </td>

                          {/* Rep Name + Avatar */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center text-xs font-bold shrink-0',
                                rep.rank === 1
                                  ? (isDark ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30' : 'bg-amber-100 text-amber-700 ring-1 ring-amber-300')
                                  : 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                              )}>
                                {initials}
                              </div>
                              <span className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>
                                {rep.repName}
                              </span>
                            </div>
                          </td>

                          {/* Deals Won */}
                          <td className={cn('px-4 py-4 text-sm font-semibold whitespace-nowrap', 'text-[var(--app-text)]')}>
                            {rep.dealsWon}
                          </td>

                          {/* Revenue */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={cn('text-sm font-bold', 'text-[var(--app-success)]')}>
                              {formatCurrency(rep.revenueClosed)}
                            </span>
                          </td>

                          {/* Follow-up SLA */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={cn('text-xs font-medium px-2 py-1 rounded-[var(--app-radius-md)]',
                              rep.followUpSla >= 90
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : rep.followUpSla >= 80
                                  ? 'bg-amber-500/15 text-amber-500'
                                  : 'bg-red-500/15 text-red-500'
                            )}>
                              {rep.followUpSla}%
                            </span>
                          </td>

                          {/* Avg Response Time */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                              <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                                {rep.avgResponseTime}
                              </span>
                            </div>
                          </td>

                          {/* Close Rate */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={cn('text-xs font-semibold',
                              rep.closeRate >= 40 ? 'text-emerald-500' : rep.closeRate >= 30 ? 'text-amber-500' : 'text-red-500'
                            )}>
                              {rep.closeRate}%
                            </span>
                          </td>

                          {/* AI Productivity Score */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                  <Sparkles className={cn('w-4 h-4',
                                    rep.aiProductivityScore >= 85 ? 'text-violet-400' : rep.aiProductivityScore >= 70 ? 'text-amber-400' : 'text-red-400'
                                  )} />
                                  <span className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                                    {rep.aiProductivityScore}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">AI Productivity Score measures AI-assisted task completion rate, email optimization, and automated follow-up effectiveness.</p>
                              </TooltipContent>
                            </Tooltip>
                          </td>

                          {/* Target Progress */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="w-32 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                                  {rep.targetProgress}%
                                </span>
                                <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                                  {formatCurrency(rep.targetAmount - rep.revenueClosed)} left
                                </span>
                              </div>
                              <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${rep.targetProgress}%` }}
                                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                                  className={cn(
                                    'h-full rounded-full',
                                    rep.targetProgress >= 80 ? 'bg-emerald-500' :
                                    rep.targetProgress >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                  )}
                                />
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Gamification Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedReps.map((rep, i) => {
                const rankStyle = RANK_STYLES[rep.rank];
                return (
                  <motion.div
                    key={rep.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={cn(
                      'rounded-[var(--app-radius-xl)] border p-app-xl',
                      rep.rank === 1
                        ? (isDark ? 'bg-amber-500/[0.06] border-amber-500/20' : 'bg-amber-50/60 border-amber-200/50')
                        : ('bg-[var(--app-card-bg)] border-[var(--app-border)]')
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ScoreMeter score={rep.aiProductivityScore} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                            {rep.repName}
                          </span>
                          {rankStyle && <span className="text-sm">{rankStyle.emoji}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                            AI Productivity Score
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 cursor-help opacity-40" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-[200px]">Composite score measuring AI email drafting, auto follow-ups, lead scoring accuracy, and CRM automation usage.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Target Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                            <Target className="w-4 h-4 inline mr-1" />Target Progress
                          </span>
                          <span className={cn('text-[10px] font-bold',
                            rep.targetProgress >= 80 ? 'text-emerald-500' : rep.targetProgress >= 60 ? 'text-amber-500' : 'text-red-500'
                          )}>
                            {rep.targetProgress}%
                          </span>
                        </div>
                        <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rep.targetProgress}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 + i * 0.1 }}
                            className={cn(
                              'h-full rounded-full',
                              rep.targetProgress >= 80 ? 'bg-emerald-500' :
                              rep.targetProgress >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                          />
                        </div>
                        <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                          {formatCurrency(rep.revenueClosed)} of {formatCurrency(rep.targetAmount)}
                        </p>
                      </div>

                      {/* Quick stats */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[
                          { label: 'Close Rate', value: `${rep.closeRate}%` },
                          { label: 'SLA', value: `${rep.followUpSla}%` },
                          { label: 'Response', value: rep.avgResponseTime },
                        ].map((s) => (
                          <div key={s.label} className={cn(
                            'rounded-[var(--app-radius-lg)] p-2 text-center',
                            'bg-[var(--app-hover-bg)]'
                          )}>
                            <p className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>{s.value}</p>
                            <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Team Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Team Revenue', value: formatCurrency(teamSummary.totalRevenue), icon: DollarSign, color: 'text-emerald-500' },
                { label: 'Avg Close Rate', value: `${teamSummary.avgCloseRate}%`, icon: TrendingUp, color: 'text-blue-500' },
                { label: 'Best Response Time', value: teamSummary.bestResponse.avgResponseTime, icon: Clock, color: 'text-violet-500' },
                { label: 'SLA Compliance', value: `${teamSummary.avgSla}%`, icon: Shield, color: 'text-amber-500' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-4 transition-colors',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                    <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                  </div>
                  <p className={cn('text-xl font-bold tracking-tight', 'text-[var(--app-text)]')}>{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
