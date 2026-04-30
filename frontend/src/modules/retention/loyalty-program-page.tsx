'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown, Gift, Star, Users, TrendingUp, ArrowUpRight,
  Award, Trophy, ChevronRight, Sparkles, Target
} from 'lucide-react';
import { loyaltyTiers, loyaltyMembers } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { LoyaltyTier, LoyaltyMember } from '@/modules/retention/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const tierConfig: Record<string, { icon: React.ElementType; bg: string; border: string; accent: string; text: string; glow: string }> = {
  silver: { icon: Star, bg: 'bg-slate-100 dark:bg-slate-900/40', border: 'border-slate-300 dark:border-slate-600', accent: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-300', glow: 'shadow-[var(--app-shadow-md)]-slate-200 dark:shadow-[var(--app-shadow-md)]-slate-900' },
  gold: { icon: Crown, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-600', accent: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-300', glow: 'shadow-[var(--app-shadow-md)]-amber-200 dark:shadow-[var(--app-shadow-md)]-amber-900' },
  platinum: { icon: Trophy, bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-600', accent: 'bg-violet-400', text: 'text-violet-600 dark:text-violet-300', glow: 'shadow-[var(--app-shadow-md)]-violet-200 dark:shadow-[var(--app-shadow-md)]-violet-900' },
};

function ProgressRing({ progress, size = 64, strokeWidth = 5, color = '#10b981' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-black/[0.06] dark:text-white/[0.06]" />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-colors duration-1000 ease-out"
      />
    </svg>
  );
}

export default function LoyaltyProgramPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const walletStats = useMemo(() => {
    const totalPoints = loyaltyMembers.reduce((s, m) => s + m.points, 0);
    const couponsUsed = loyaltyMembers.reduce((s, m) => s + m.couponsUsed, 0);
    const rewardsActive = loyaltyMembers.reduce((s, m) => s + m.rewardsRedeemed, 0);
    const totalSpent = loyaltyMembers.reduce((s, m) => s + m.totalSpent, 0);
    return [
      { label: 'Total Points in Circulation', value: `${totalPoints.toLocaleString()}`, icon: Sparkles, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
      { label: 'Coupons Redeemed', value: `${couponsUsed}`, icon: Gift, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
      { label: 'Rewards Active', value: `${rewardsActive}`, icon: Award, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
      { label: 'Total Member Spend', value: formatINR(totalSpent), icon: TrendingUp, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 18.4 },
    ];
  }, [isDark]);

  const topMembers = useMemo(() =>
    [...loyaltyMembers].sort((a, b) => b.points - a.points).slice(0, 5),
    []
  );

  const tierDistribution = useMemo(() =>
    loyaltyTiers.map(t => ({ tier: t.tier, count: t.memberCount, color: t.color })),
    []
  );

  const totalMembers = tierDistribution.reduce((s, t) => s + t.count, 0);

  // ── Member Directory columns ──
  const memberColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.client as string}</p>
          <p className="text-[10px]" style={{ color: CSS.textMuted }}>{row.lastPurchaseDate as string}</p>
        </div>
      ),
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (row) => {
        const tc = tierConfig[(row.tier as string)] || tierConfig.silver;
        return (
          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', tc.text, isDark ? 'bg-white/[0.06]' : 'bg-white/60')}>
            {row.tier as string}
          </Badge>
        );
      },
    },
    {
      key: 'points',
      label: 'Points',
      sortable: true,
      render: (row) => <span className="text-sm font-semibold">{Number(row.points).toLocaleString()}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (row) => <span className="text-sm">{formatINR(row.totalSpent as number)}</span>,
    },
    { key: 'repeatPurchases', label: 'Repeat', sortable: true },
    { key: 'referrals', label: 'Referrals', sortable: true },
    {
      key: 'milestoneProgress',
      label: 'Next Milestone',
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return (
          <div className="min-w-[100px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px]" style={{ color: CSS.textMuted }}>{m.nextMilestone}</span>
              <span className="text-[10px] font-bold">{m.milestoneProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
              <div
                className={cn('h-full rounded-full',
                  m.tier === 'platinum' ? 'bg-violet-500' : m.tier === 'gold' ? 'bg-amber-500' : 'bg-slate-400'
                )}
                style={{ width: `${m.milestoneProgress}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ], [isDark]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Crown className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Loyalty Program</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Reward Engine</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Gift className="w-4 h-4" />
            Manage Rewards
          </Button>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loyaltyTiers.map((tier: LoyaltyTier, i) => {
            const config = tierConfig[tier.tier];
            const TierIcon = config.icon;
            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', config.bg, config.border)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TierIcon className={cn('w-5 h-5', config.text)} />
                    <div>
                      <p className={cn('text-sm font-bold capitalize', config.text)}>{tier.tier}</p>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {formatINR(tier.minSpent)}+ spend · {tier.discount}% discount
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', config.text, isDark ? 'bg-white/[0.06]' : 'bg-white/60')}>
                    <Users className="w-4 h-4 mr-1" />{tier.memberCount}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {tier.benefits.map((b, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.accent)} />
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Wallet Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {walletStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-4 h-4', stat.color)} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                {'change' in stat && stat.change && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                    <ArrowUpRight className="w-4 h-4" />{stat.change}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Member Table & Visuals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Member List Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={cn('lg:col-span-2 rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Member Directory</span>
              </div>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                {loyaltyMembers.length} members
              </Badge>
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className={cn('border-b', 'border-[var(--app-border)] bg-[var(--app-bg)]')}>
                    {['Client', 'Tier', 'Points', 'Total Spent', 'Repeat', 'Referrals', 'Next Milestone'].map(h => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loyaltyMembers.map((m: LoyaltyMember, i) => {
                    const tc = tierConfig[m.tier];
                    return (
                      <motion.tr
                        key={m.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 + i * 0.04 }}
                        className={cn('border-b cursor-pointer transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="text-sm font-medium">{m.client}</p>
                            <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{m.lastPurchaseDate}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize', isDark ? `${tc.text.replace('dark:', '')} bg-white/[0.06]` : `${tc.text} bg-white/60`)}>
                            {m.tier}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-sm font-semibold">{m.points.toLocaleString()}</td>
                        <td className="py-3 px-3 text-sm">{formatINR(m.totalSpent)}</td>
                        <td className="py-3 px-3 text-sm">{m.repeatPurchases}</td>
                        <td className="py-3 px-3 text-sm">{m.referrals}</td>
                        <td className="py-3 px-3">
                          <div className="min-w-[100px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{m.nextMilestone}</span>
                              <span className="text-[10px] font-bold">{m.milestoneProgress}%</span>
                            </div>
                            <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.milestoneProgress}%` }}
                                transition={{ delay: 0.5 + i * 0.04, duration: 0.6 }}
                                className={cn('h-full rounded-full', m.tier === 'platinum' ? 'bg-violet-500' : m.tier === 'gold' ? 'bg-amber-500' : 'bg-slate-400')}
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

          {/* Right Column: Progress Rings + Tier Distribution */}
          <div className="space-y-4">
            {/* Gamification Progress Rings */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Top Members Progress</span>
              </div>
              <div className="space-y-4">
                {topMembers.slice(0, 3).map((m, j) => {
                  const ringColor = m.tier === 'platinum' ? '#8b5cf6' : m.tier === 'gold' ? '#f59e0b' : '#94a3b8';
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="relative">
                        <ProgressRing progress={m.milestoneProgress} size={52} strokeWidth={4} color={ringColor} />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{m.milestoneProgress}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.client}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{m.nextMilestone} · {m.points.toLocaleString()} pts</p>
                      </div>
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize shrink-0',
                        m.tier === 'platinum' ? ('bg-[var(--app-purple-light)] text-[var(--app-purple)]')
                        : m.tier === 'gold' ? ('bg-[var(--app-warning-bg)] text-[var(--app-warning)]')
                        : (isDark ? 'bg-slate-500/15 text-slate-400' : 'bg-slate-50 text-slate-600')
                      )}>{m.tier}</Badge>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tier Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Tier Distribution</span>
              </div>
              {/* Visual blocks */}
              <div className="space-y-3">
                {tierDistribution.map((t, j) => {
                  const pct = totalMembers > 0 ? (t.count / totalMembers) * 100 : 0;
                  return (
                    <div key={t.tier}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn('text-xs font-medium capitalize', 'text-[var(--app-text-secondary)]')}>{t.tier}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{t.count}</span>
                          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className={cn('h-4 rounded-full overflow-hidden flex', 'bg-[var(--app-hover-bg)]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.55 + j * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: t.color, opacity: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Milestone Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Upcoming Milestones</span>
              </div>
              <div className="space-y-3">
                {loyaltyMembers
                  .filter(m => m.milestoneProgress >= 80)
                  .sort((a, b) => b.milestoneProgress - a.milestoneProgress)
                  .slice(0, 4)
                  .map((m) => (
                    <div key={m.id} className={cn('flex items-center gap-3 p-2.5 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
                      <div className={cn('w-2 h-2 rounded-full shrink-0',
                        m.milestoneProgress >= 95 ? 'bg-emerald-500' : m.milestoneProgress >= 85 ? 'bg-amber-500' : 'bg-sky-500'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{m.client}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{m.nextMilestone}</p>
                      </div>
                      <span className={cn('text-[10px] font-bold shrink-0',
                        m.milestoneProgress >= 95 ? 'text-emerald-500' : m.milestoneProgress >= 85 ? 'text-amber-500' : 'text-sky-500'
                      )}>{m.milestoneProgress}%</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
