'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Users, TrendingUp, Trophy, Copy, Check, Settings, Clock, ArrowUpRight } from 'lucide-react';
import { mockReferrals } from '@/modules/marketing/data/mock-data';
import type { ReferralEntry } from '@/modules/marketing/types';

const MONTHLY_REFERRAL_DATA = [
  { month: 'Nov', count: 42 },
  { month: 'Dec', count: 58 },
  { month: 'Jan', count: 71 },
  { month: 'Feb', count: 89 },
  { month: 'Mar', count: 124 },
  { month: 'Apr', count: 156 },
];

const RECENT_ACTIVITIES = [
  { user: 'Aarav Gupta', action: 'referred a new signup', time: '2 minutes ago', amount: '₹1,000' },
  { user: 'Priyanka Iyer', action: 'earned ₹5,000 milestone bonus', time: '1 hour ago', amount: '₹5,000' },
  { user: 'Rohan Patel', action: 'referral converted to paid plan', time: '3 hours ago', amount: '₹2,000' },
  { user: 'Siddharth Mehta', action: 'shared referral link on LinkedIn', time: '5 hours ago', amount: '' },
  { user: 'Anisha Sharma', action: 'referred 3 friends in one day', time: '8 hours ago', amount: '₹3,000' },
];

export default function ReferralPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedLink, setCopiedLink] = useState(false);

  const totalReferrals = useMemo(() => mockReferrals.reduce((s, r) => s + r.totalReferrals, 0), []);
  const totalConversions = useMemo(() => mockReferrals.reduce((s, r) => s + r.conversions, 0), []);
  const totalEarnings = useMemo(() => mockReferrals.reduce((s, r) => s + r.earnings, 0), []);
  const avgConversionRate = useMemo(() => {
    if (totalReferrals === 0) return 0;
    return ((totalConversions / totalReferrals) * 100).toFixed(1);
  }, [totalReferrals, totalConversions]);

  const kpiData = useMemo(() => [
    { label: 'Total Referrals', value: totalReferrals.toLocaleString(), icon: Share2, change: '+34.2%' },
    { label: 'Conversions', value: totalConversions.toLocaleString(), icon: Users, change: '+28.7%' },
    { label: 'Total Payouts', value: '₹' + (totalEarnings / 1000).toFixed(0) + 'K', icon: TrendingUp, change: '+41.3%' },
    { label: 'Conv. Rate', value: avgConversionRate + '%', icon: Trophy, change: '+5.2%' },
  ], [totalReferrals, totalConversions, totalEarnings, avgConversionRate]);

  const maxBarValue = useMemo(() => Math.max(...MONTHLY_REFERRAL_DATA.map(d => d.count)), []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://diginue.in/ref/AARAV2024');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const rankBadge = (rank: number) => {
    if (rank === 1) return { bg: isDark ? 'bg-amber-500/20' : 'bg-amber-50', text: 'text-amber-500', icon: '🥇' };
    if (rank === 2) return { bg: isDark ? 'bg-gray-400/20' : 'bg-gray-100', text: 'text-gray-400', icon: '🥈' };
    if (rank === 3) return { bg: isDark ? 'bg-orange-500/20' : 'bg-orange-50', text: 'text-orange-500', icon: '🥉' };
    return { bg: '', text: '', icon: '' };
  };

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-app-3xl py-app-2xl space-y-app-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-success-bg)]')}>
            <Share2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className={cn('text-xl font-semibold', 'text-[var(--app-text)]')}>Referral Program</h1>
            <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-gray-500')}>Track referrals, earnings, and program performance</p>
          </div>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 self-start">
          <Settings className="w-4 h-4" />
          Configure Program
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-gray-400')} />
              <span className="text-xs font-medium text-emerald-500">{kpi.change}</span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>{kpi.value}</p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-app-2xl">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Leaderboard</h2>
          <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Rank', 'Name', 'Email', 'Referral Code', 'Referrals', 'Conversions', 'Earnings'].map(h => (
                      <th key={h} className={cn('text-left px-4 py-3 text-xs font-medium', 'text-[var(--app-text-muted)]')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockReferrals.map((ref, i) => {
                    const badge = rankBadge(ref.rank);
                    return (
                      <motion.tr
                        key={ref.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        className={cn('border-b last:border-0', isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-gray-50/50')}
                      >
                        <td className="px-4 py-3">
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', ref.rank <= 3 ? badge.bg : (isDark ? 'bg-white/[0.06] text-white/50' : 'bg-gray-100 text-gray-500'))}>
                            {ref.rank <= 3 ? badge.icon : ref.rank}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: isDark ? 'white' : '#111827' }}>{ref.name}</td>
                        <td className={cn('px-4 py-3', isDark ? 'text-white/50' : 'text-gray-500')}>{ref.email}</td>
                        <td className="px-4 py-3">
                          <code className={cn('text-xs font-mono px-2 py-1 rounded-[var(--app-radius-md)]', isDark ? 'bg-white/[0.06] text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                            {ref.referralCode}
                          </code>
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: isDark ? 'white' : '#111827' }}>{ref.totalReferrals}</td>
                        <td className="px-4 py-3" style={{ color: isDark ? 'white/70' : '#374151' }}>{ref.conversions}</td>
                        <td className="px-4 py-3 font-medium text-emerald-500">₹{ref.earnings.toLocaleString()}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-app-2xl">
          {/* Referral Links */}
          <div>
            <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Referral Links</h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2">
                <code className={cn('flex-1 text-xs font-mono px-3 py-2 rounded-[var(--app-radius-lg)] truncate', isDark ? 'bg-white/[0.06] text-white/70' : 'bg-gray-50 text-gray-600')}>
                  https://diginue.in/ref/AARAV2024
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('shrink-0 gap-1 text-xs h-8', isDark ? 'border-white/[0.1] text-white/70 hover:bg-white/[0.06]' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className={cn('pt-2 border-t space-y-2', isDark ? 'border-white/[0.06]' : 'border-gray-100')}>
                <p className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>Reward Configuration</p>
                <div className="flex justify-between">
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Referrer Reward</span>
                  <span className={cn('text-xs font-medium text-emerald-500')}>₹1,000 per conversion</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Referee Reward</span>
                  <span className={cn('text-xs font-medium text-emerald-500')}>₹500 discount</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Minimum Purchase</span>
                  <span className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>₹5,000</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Referral Analytics */}
          <div>
            <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Referral Analytics (6 months)</h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-end gap-2 h-32">
                {MONTHLY_REFERRAL_DATA.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-secondary)]')}>{d.count}</span>
                    <div className="w-full flex items-end" style={{ height: '96px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.count / maxBarValue) * 100}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full rounded-t-[var(--app-radius-md)] bg-emerald-500"
                      />
                    </div>
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{d.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Recent Activities</h2>
        <div className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-0', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          {RECENT_ACTIVITIES.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('flex items-center justify-between py-3', i < RECENT_ACTIVITIES.length - 1 && (isDark ? 'border-b border-white/[0.04]' : 'border-b border-gray-100'))}
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', isDark ? 'bg-white/[0.06] text-white/60' : 'bg-gray-100 text-gray-600')}>
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className={cn('text-sm', isDark ? 'text-white/80' : 'text-gray-800')}>
                    <span className="font-medium">{activity.user}</span>
                    <span className={isDark ? 'text-white/50' : 'text-gray-500'}> {activity.action}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{activity.time}</span>
                  </div>
                </div>
              </div>
              {activity.amount && (
                <span className="text-xs font-medium text-emerald-500">{activity.amount}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
