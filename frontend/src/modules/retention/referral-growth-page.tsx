'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, TrendingUp, ArrowUpRight, IndianRupee, Share2,
  Link, AlertTriangle, Trophy, Medal, Award, Copy, Shield
} from 'lucide-react';
import { referralData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { ReferralEntry } from '@/modules/retention/types';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const podiumColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];

export default function ReferralGrowthPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const summaryStats = useMemo(() => {
    const totalAdvocates = referralData.length;
    const totalReferrals = referralData.reduce((s, r) => s + r.totalReferrals, 0);
    const totalConverted = referralData.reduce((s, r) => s + r.converted, 0);
    const conversionRate = totalReferrals > 0 ? ((totalConverted / totalReferrals) * 100).toFixed(1) : '0';
    const totalCommission = referralData.reduce((s, r) => s + r.commissionEarned, 0);
    return [
      { label: 'Total Advocates', value: `${totalAdvocates}`, icon: Users, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
      { label: 'Total Referrals', value: `${totalReferrals}`, icon: Share2, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 34.2 },
      { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]' },
      { label: 'Total Commission Paid', value: formatINR(totalCommission), icon: IndianRupee, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    ];
  }, [isDark]);

  const top3 = useMemo(() =>
    [...referralData].sort((a, b) => a.rank - b.rank).slice(0, 3),
    []
  );

  const roiData = useMemo(() =>
    referralData.map(r => ({
      advocate: r.advocate,
      earned: r.commissionEarned,
      referrals: r.converted,
    })),
    []
  );

  const maxRoi = Math.max(...roiData.map(r => r.earned), 1);

  const fraudEntries = useMemo(() =>
    referralData.filter(r => r.fraudFlag),
    []
  );

  // ── Referral columns ──
  const referralColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => {
        const rank = row.rank as number;
        return (
          <span className={cn('text-xs font-bold', rank <= 3 ? podiumColors[rank - 1] : '')} style={rank > 3 ? { color: CSS.textMuted } : undefined}>
            #{rank}
          </span>
        );
      },
    },
    {
      key: 'advocate',
      label: 'Advocate',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.advocate as string}</p>
          <p className="text-[10px]" style={{ color: CSS.textMuted }}>{row.topReferral as string}</p>
        </div>
      ),
    },
    {
      key: 'referralCode',
      label: 'Code',
      render: (row) => (
        <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>{row.referralCode as string}</code>
      ),
    },
    { key: 'totalReferrals', label: 'Total', sortable: true },
    { key: 'converted', label: 'Converted', sortable: true },
    {
      key: 'conversionRate',
      label: 'Conv %',
      sortable: true,
      render: (row) => {
        const rate = row.conversionRate as number;
        return (
          <span className={cn('text-xs font-bold', rate >= 60 ? 'text-emerald-500' : rate > 0 ? 'text-amber-500' : 'text-red-400')}>
            {rate}%
          </span>
        );
      },
    },
    {
      key: 'commissionEarned',
      label: 'Commission',
      sortable: true,
      render: (row) => <span className="text-sm font-medium">{formatINR(row.commissionEarned as number)}</span>,
    },
    {
      key: 'rewardType',
      label: 'Reward',
      render: (row) => (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5" style={{ backgroundColor: CSS.hoverBg, color: CSS.textSecondary }}>
          {row.rewardType as string}
        </Badge>
      ),
    },
    {
      key: 'fraudFlag',
      label: 'Fraud',
      render: (row) => row.fraudFlag ? (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-red-500/15 text-red-400">
          <Shield className="w-3 h-3 mr-1" />Flag
        </Badge>
      ) : null,
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Share2 className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Referral Growth</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Referral Growth System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', isDark ? 'border-white/[0.1] text-white/70 hover:bg-white/[0.05]' : 'border-black/[0.1] text-black/70 hover:bg-black/[0.05]')}>
              <Link className="w-4 h-4" />
              Generate Link
            </Button>
            <Button className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
              <Share2 className="w-4 h-4" />
              Create Program
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {summaryStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

        {/* Leaderboard Podium */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-2 mb-app-xl">
            <Trophy className={cn('w-4 h-4 text-amber-400')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Leaderboard — Top 3 Advocates</span>
          </div>
          <div className="flex items-end justify-center gap-4 md:gap-app-3xl">
            {top3.map((entry, idx) => {
              const heights = ['h-32', 'h-24', 'h-20'];
              const podiumBgs = [
                isDark ? 'bg-amber-500/15 border-amber-500/30' : 'bg-amber-50 border-amber-200',
                isDark ? 'bg-slate-500/15 border-slate-500/30' : 'bg-slate-50 border-slate-200',
                isDark ? 'bg-amber-600/15 border-amber-600/30' : 'bg-amber-50 border-amber-200',
              ];
              const podiumIcons = [Trophy, Medal, Award];
              const PodiumIcon = podiumIcons[idx];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  className={cn('flex flex-col items-center gap-2', idx === 0 && 'order-2 md:order-1', idx === 1 && 'order-1 md:order-2', idx === 2 && 'order-3')}
                >
                  <div className={cn('w-14 h-14 rounded-full flex items-center justify-center border-2', podiumBgs[idx])}>
                    <PodiumIcon className={cn('w-6 h-6', podiumColors[idx])} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">{entry.advocate}</p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                      {entry.totalReferrals} refs · {formatINR(entry.commissionEarned)}
                    </p>
                  </div>
                  <div className={cn('w-20 md:w-28 rounded-t-2xl border-t-2 border-l-2 border-r-2 flex flex-col items-center justify-end p-3', heights[idx], podiumBgs[idx])}>
                    <span className={cn('text-2xl font-black', podiumColors[idx])}>#{entry.rank}</span>
                    <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.conversionRate}% conv</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Referral Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className={cn('lg:col-span-2 rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>All Referrals</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Rank', 'Advocate', 'Code', 'Total', 'Converted', 'Conv %', 'Commission', 'Reward', 'Fraud'].map(h => (
                      <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referralData.map((r: ReferralEntry, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.04 }}
                      className={cn('border-b cursor-pointer transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                    >
                      <td className="py-3 px-3">
                        <span className={cn('text-xs font-bold', r.rank <= 3 ? podiumColors[r.rank - 1] : ('text-[var(--app-text-muted)]'))}>#{r.rank}</span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium">{r.advocate}</p>
                        <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{r.topReferral}</p>
                      </td>
                      <td className="py-3 px-3">
                        <code className={cn('text-[10px] px-1.5 py-0.5 rounded', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>{r.referralCode}</code>
                      </td>
                      <td className="py-3 px-3 text-sm font-semibold">{r.totalReferrals}</td>
                      <td className="py-3 px-3 text-sm">{r.converted}</td>
                      <td className="py-3 px-3">
                        <span className={cn('text-xs font-bold', r.conversionRate >= 60 ? 'text-emerald-500' : r.conversionRate > 0 ? 'text-amber-500' : 'text-red-400')}>
                          {r.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm font-medium">{formatINR(r.commissionEarned)}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                          {r.rewardType}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {r.fraudFlag && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-red-500/15 text-red-400">
                            <Shield className="w-4 h-4 mr-1" />Flag
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Referral ROI Chart + Fraud Section */}
          <div className="space-y-4">
            {/* ROI Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Referral ROI</span>
              </div>
              <div className="space-y-2.5">
                {roiData.filter(r => r.earned > 0).map((r, j) => (
                  <div key={j}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-[11px] font-medium', 'text-[var(--app-text-muted)]')}>{r.advocate}</span>
                      <span className="text-xs font-bold">{formatINR(r.earned)}</span>
                    </div>
                    <div className={cn('h-2.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.earned / maxRoi) * 100}%` }}
                        transition={{ delay: 0.5 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('h-full rounded-full', j === 0 ? 'bg-emerald-500' : j === 1 ? 'bg-sky-500' : j === 2 ? 'bg-violet-500' : 'bg-amber-500')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fraud Warning */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', fraudEntries.length > 0
                ? (isDark ? 'bg-red-500/[0.04] border-red-500/20' : 'bg-red-50 border-red-200')
                : (isDark ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className={cn('w-4 h-4', fraudEntries.length > 0 ? 'text-red-400' : 'text-emerald-400')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Fraud Monitor</span>
              </div>
              {fraudEntries.length > 0 ? (
                <div className="space-y-2">
                  {fraudEntries.map(f => (
                    <div key={f.id} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-500 dark:text-red-400">Suspicious activity detected for <span className="font-bold">{f.advocate}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>No fraud detected. All referrals are clean.</p>
                </div>
              )}
            </motion.div>

            {/* Link Generation Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-3">
                <Link className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Quick Link Generator</span>
              </div>
              <div className={cn('flex items-center gap-2 p-3 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
                <code className={cn('text-xs flex-1 truncate', 'text-[var(--app-text-muted)]')}>
                  https://diginue.in/ref/RAZ2024
                </code>
                <Button variant="ghost" size="sm" className="shrink-0 h-8  w-7 p-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className={cn('text-[10px] mt-2', 'text-[var(--app-text-muted)]')}>
                Generate unique referral links for each advocate to track conversions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
