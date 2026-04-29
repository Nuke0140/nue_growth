'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { mockTeamPerformance } from './data/mock-data';
import type { TeamPerformance } from '@/modules/crm-sales/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

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
  const radius = size === 'sm' ? 28 : 36;
  const strokeWidth = size === 'sm' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2} className="-rotate-90">
        <circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius}
          fill="none" stroke={CSS.hoverBg} strokeWidth={strokeWidth} />
        <motion.circle cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round" />
      </svg>
      <span className={cn('absolute font-bold', size === 'sm' ? 'text-xs' : 'text-sm')}
        style={{ color: CSS.text }}>
        {score}
      </span>
    </div>
  );
}

function TopPerformerCard({ rep }: { rep: TeamPerformance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border p-6 md:p-8 relative overflow-hidden"
      style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black ring-2 bg-amber-500/20 text-amber-300 ring-amber-500/30">
            {rep.repName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
                Top Performer
              </span>
            </div>
            <h2 className="text-xl font-bold" style={{ color: CSS.text }}>{rep.repName}</h2>
            <p className="text-sm" style={{ color: CSS.textMuted }}>
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
            <div key={metric.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: CSS.hoverBg }}>
              <metric.icon className="w-4 h-4 mx-auto mb-1" style={{ color: CSS.textDisabled }} />
              <p className="text-lg font-bold" style={{ color: CSS.text }}>{metric.value}</p>
              <p className="text-[10px] font-medium" style={{ color: CSS.textDisabled }}>{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPerformancePage() {
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

  // SmartDataTable data & columns
  const leaderboardData = useMemo(
    () => sortedReps.map(rep => ({
      id: rep.id,
      rank: rep.rank,
      repName: rep.repName,
      dealsWon: rep.dealsWon,
      revenueClosed: rep.revenueClosed,
      followUpSla: rep.followUpSla,
      avgResponseTime: rep.avgResponseTime,
      closeRate: rep.closeRate,
      aiProductivityScore: rep.aiProductivityScore,
      targetProgress: rep.targetProgress,
      targetAmount: rep.targetAmount,
    })) as unknown as Record<string, unknown>[],
    []
  );

  const leaderboardColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => {
        const r = row as { rank: number };
        const rankStyle = RANK_STYLES[r.rank];
        if (rankStyle) {
          const colorClass = r.rank === 1 ? 'text-amber-300 dark:text-amber-300' :
            r.rank === 2 ? 'text-slate-300 dark:text-slate-300' : 'text-orange-300 dark:text-orange-300';
          return (
            <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-fit', rankStyle.bg)}>
              <span className="text-base">{rankStyle.emoji}</span>
              <span className={cn('text-xs font-bold', colorClass)}>#{r.rank}</span>
            </div>
          );
        }
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}>
            #{r.rank}
          </span>
        );
      },
    },
    {
      key: 'repName',
      label: 'Rep',
      sortable: true,
      render: (row) => {
        const r = row as { rank: number; repName: string };
        const initials = r.repName.split(' ').map(n => n[0]).join('');
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
              r.rank === 1
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                : ''
            )}
            style={r.rank !== 1 ? { backgroundColor: CSS.hoverBg, color: CSS.textSecondary } : undefined}
            >
              {initials}
            </div>
            <span className="text-sm font-medium" style={{ color: CSS.text }}>{r.repName}</span>
          </div>
        );
      },
    },
    {
      key: 'dealsWon',
      label: 'Deals Won',
      sortable: true,
      render: (row) => {
        const v = row.dealsWon as number;
        return <span className="text-sm font-semibold" style={{ color: CSS.text }}>{v}</span>;
      },
    },
    {
      key: 'revenueClosed',
      label: 'Revenue',
      sortable: true,
      render: (row) => {
        const v = row.revenueClosed as number;
        return <span className="text-sm font-bold text-emerald-500">{formatCurrency(v)}</span>;
      },
    },
    {
      key: 'followUpSla',
      label: 'SLA %',
      sortable: true,
      render: (row) => {
        const v = row.followUpSla as number;
        const colorClass = v >= 90 ? 'bg-emerald-500/15 text-emerald-500' : v >= 80 ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500';
        return <span className={cn('text-xs font-medium px-2 py-1 rounded-md', colorClass)}>{v}%</span>;
      },
    },
    {
      key: 'avgResponseTime',
      label: 'Avg Response',
      render: (row) => {
        const v = row.avgResponseTime as string;
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: CSS.textDisabled }} />
            <span className="text-xs font-medium" style={{ color: CSS.textSecondary }}>{v}</span>
          </div>
        );
      },
    },
    {
      key: 'closeRate',
      label: 'Close Rate',
      sortable: true,
      render: (row) => {
        const v = row.closeRate as number;
        const colorClass = v >= 40 ? 'text-emerald-500' : v >= 30 ? 'text-amber-500' : 'text-red-500';
        return <span className={cn('text-xs font-semibold', colorClass)}>{v}%</span>;
      },
    },
    {
      key: 'aiProductivityScore',
      label: 'AI Score',
      sortable: true,
      render: (row) => {
        const r = row as { aiProductivityScore: number };
        const colorClass = r.aiProductivityScore >= 85 ? 'text-violet-400' : r.aiProductivityScore >= 70 ? 'text-amber-400' : 'text-red-400';
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                <Sparkles className={cn('w-3.5 h-3.5', colorClass)} />
                <span className="text-xs font-bold" style={{ color: CSS.text }}>{r.aiProductivityScore}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">AI Productivity Score measures AI-assisted task completion rate, email optimization, and automated follow-up effectiveness.</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      key: 'targetProgress',
      label: 'Target',
      render: (row) => {
        const r = row as { targetProgress: number; targetAmount: number; revenueClosed: number };
        const barColor = r.targetProgress >= 80 ? 'bg-emerald-500' : r.targetProgress >= 60 ? 'bg-amber-500' : 'bg-red-500';
        return (
          <div className="w-32 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>{r.targetProgress}%</span>
              <span className="text-[10px]" style={{ color: CSS.textDisabled }}>
                {formatCurrency(r.targetAmount - r.revenueClosed)} left
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.targetProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn('h-full rounded-full', barColor)}
              />
            </div>
          </div>
        );
      },
    },
  ], []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: CSS.text }}>
                  Team Performance
                </h1>
                <p className="text-sm mt-1" style={{ color: CSS.textMuted }}>
                  Sales leaderboard &amp; rep analytics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border overflow-hidden"
                  style={{ backgroundColor: CSS.hoverBg, borderColor: CSS.border }}>
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium transition-all',
                        period === p
                          ? 'text-[var(--app-text)]'
                          : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                      )}
                      style={period === p ? { backgroundColor: CSS.activeBg } : undefined}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <Button className="shrink-0 h-9 px-4 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: CSS.accent, color: '#ffffff' }}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add Rep
                </Button>
              </div>
            </div>

            {/* Top Performer Hero Card */}
            {topPerformer && <TopPerformerCard rep={topPerformer} />}

            {/* Leaderboard Table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="px-5 py-4" style={{ borderBottom: `1px solid ${CSS.border}` }}>
                <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>Sales Leaderboard</h3>
              </div>
              <SmartDataTable
                data={leaderboardData}
                columns={leaderboardColumns}
                pageSize={10}
                emptyMessage="No performance data available"
                searchable={false}
                searchKeys={['repName']}
              />
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
                    className="rounded-2xl border p-5"
                    style={{
                      backgroundColor: rep.rank === 1 ? 'rgba(245,158,11,0.04)' : CSS.cardBg,
                      borderColor: rep.rank === 1 ? 'rgba(245,158,11,0.15)' : CSS.border,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ScoreMeter score={rep.aiProductivityScore} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: CSS.text }}>
                            {rep.repName}
                          </span>
                          {rankStyle && <span className="text-sm">{rankStyle.emoji}</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>
                            AI Productivity Score
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 cursor-help opacity-40" />
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
                          <span className="text-[10px] font-medium" style={{ color: CSS.textMuted }}>
                            <Target className="w-3 h-3 inline mr-1" />Target Progress
                          </span>
                          <span className={cn('text-[10px] font-bold',
                            rep.targetProgress >= 80 ? 'text-emerald-500' : rep.targetProgress >= 60 ? 'text-amber-500' : 'text-red-500'
                          )}>
                            {rep.targetProgress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
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
                        <p className="text-[10px] mt-1" style={{ color: CSS.textDisabled }}>
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
                          <div key={s.label} className="rounded-lg p-2 text-center" style={{ backgroundColor: CSS.hoverBg }}>
                            <p className="text-xs font-bold" style={{ color: CSS.textSecondary }}>{s.value}</p>
                            <p className="text-[9px]" style={{ color: CSS.textDisabled }}>{s.label}</p>
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
                  className="rounded-2xl border p-4 transition-colors"
                  style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                    <span className="text-xs font-medium" style={{ color: CSS.textMuted }}>{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold tracking-tight" style={{ color: CSS.text }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
