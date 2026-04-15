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

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const tierConfig: Record<string, { icon: React.ElementType; bg: string; border: string; accent: string; text: string; glow: string }> = {
  silver: { icon: Star, bg: 'bg-slate-100 dark:bg-slate-900/40', border: 'border-slate-300 dark:border-slate-600', accent: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-300', glow: 'shadow-slate-200 dark:shadow-slate-900' },
  gold: { icon: Crown, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-600', accent: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-300', glow: 'shadow-amber-200 dark:shadow-amber-900' },
  platinum: { icon: Trophy, bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-600', accent: 'bg-violet-400', text: 'text-violet-600 dark:text-violet-300', glow: 'shadow-violet-200 dark:shadow-violet-900' },
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
        className="transition-all duration-1000 ease-out"
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
      { label: 'Total Points in Circulation', value: `${totalPoints.toLocaleString()}`, icon: Sparkles, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
      { label: 'Coupons Redeemed', value: `${couponsUsed}`, icon: Gift, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
      { label: 'Rewards Active', value: `${rewardsActive}`, icon: Award, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50' },
      { label: 'Total Member Spend', value: formatINR(totalSpent), icon: TrendingUp, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: 18.4 },
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Crown className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Loyalty Program</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Reward Engine</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
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
                className={cn('rounded-2xl border p-5', config.bg, config.border)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TierIcon className={cn('w-5 h-5', config.text)} />
                    <div>
                      <p className={cn('text-base font-bold capitalize', config.text)}>{tier.tier}</p>
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        {formatINR(tier.minSpent)}+ spend · {tier.discount}% discount
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', config.text, isDark ? 'bg-white/[0.06]' : 'bg-white/60')}>
                    <Users className="w-3 h-3 mr-1" />{tier.memberCount}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {tier.benefits.map((b, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.accent)} />
                      <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>{b}</span>
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
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                {'change' in stat && stat.change && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                    <ArrowUpRight className="w-3 h-3" />{stat.change}%
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
            className={cn('lg:col-span-2 rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Member Directory</span>
              </div>
              <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                {loyaltyMembers.length} members
              </Badge>
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className={cn('border-b', isDark ? 'border-white/[0.06] bg-[#0a0a0a]' : 'border-black/[0.06] bg-white')}>
                    {['Client', 'Tier', 'Points', 'Total Spent', 'Repeat', 'Referrals', 'Next Milestone'].map(h => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', isDark ? 'text-white/40' : 'text-black/40')}>{h}</th>
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
                        className={cn('border-b cursor-pointer transition-colors', isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]')}
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="text-sm font-medium">{m.client}</p>
                            <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{m.lastPurchaseDate}</p>
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
                              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{m.nextMilestone}</span>
                              <span className="text-[10px] font-bold">{m.milestoneProgress}%</span>
                            </div>
                            <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
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
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Top Members Progress</span>
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
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{m.nextMilestone} · {m.points.toLocaleString()} pts</p>
                      </div>
                      <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize shrink-0',
                        m.tier === 'platinum' ? (isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600')
                        : m.tier === 'gold' ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600')
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
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Tier Distribution</span>
              </div>
              {/* Visual blocks */}
              <div className="space-y-3">
                {tierDistribution.map((t, j) => {
                  const pct = totalMembers > 0 ? (t.count / totalMembers) * 100 : 0;
                  return (
                    <div key={t.tier}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn('text-xs font-medium capitalize', isDark ? 'text-white/50' : 'text-black/50')}>{t.tier}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{t.count}</span>
                          <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className={cn('h-4 rounded-full overflow-hidden flex', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
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
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Upcoming Milestones</span>
              </div>
              <div className="space-y-3">
                {loyaltyMembers
                  .filter(m => m.milestoneProgress >= 80)
                  .sort((a, b) => b.milestoneProgress - a.milestoneProgress)
                  .slice(0, 4)
                  .map((m) => (
                    <div key={m.id} className={cn('flex items-center gap-3 p-2.5 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]')}>
                      <div className={cn('w-2 h-2 rounded-full shrink-0',
                        m.milestoneProgress >= 95 ? 'bg-emerald-500' : m.milestoneProgress >= 85 ? 'bg-amber-500' : 'bg-sky-500'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{m.client}</p>
                        <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{m.nextMilestone}</p>
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
