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
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

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
    if (rank === 1) return { bg: 'bg-amber-500/20', text: 'text-amber-500', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gray-400/20', text: 'text-gray-400', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-orange-500/20', text: 'text-orange-500', icon: '🥉' };
    return { bg: '', text: '', icon: '' };
  };

  const leaderboardColumns: DataTableColumnDef[] = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      render: (row) => {
        const r = row as unknown as ReferralEntry;
        const badge = rankBadge(r.rank);
        return (
          <div
            className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              r.rank <= 3 ? badge.bg : '')
            }
            style={r.rank > 3 ? { backgroundColor: CSS.hoverBg, color: CSS.textSecondary } : undefined}
          >
            {r.rank <= 3 ? badge.icon : r.rank}
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => <span className="font-medium" style={{ color: CSS.text }}>{(row as unknown as ReferralEntry).name}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (row) => <span style={{ color: CSS.textSecondary }}>{(row as unknown as ReferralEntry).email}</span>,
    },
    {
      key: 'referralCode',
      label: 'Referral Code',
      render: (row) => (
        <code className="text-xs font-mono px-2 py-1 rounded-md" style={{ backgroundColor: CSS.hoverBg, color: '#10b981' }}>
          {(row as unknown as ReferralEntry).referralCode}
        </code>
      ),
    },
    {
      key: 'totalReferrals',
      label: 'Referrals',
      sortable: true,
      render: (row) => <span className="font-semibold" style={{ color: CSS.text }}>{(row as unknown as ReferralEntry).totalReferrals}</span>,
    },
    {
      key: 'conversions',
      label: 'Conversions',
      sortable: true,
      render: (row) => <span style={{ color: CSS.textSecondary }}>{(row as unknown as ReferralEntry).conversions}</span>,
    },
    {
      key: 'earnings',
      label: 'Earnings',
      sortable: true,
      render: (row) => <span className="font-medium text-emerald-500">₹{(row as unknown as ReferralEntry).earnings.toLocaleString()}</span>,
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-emerald-500/15' : 'bg-emerald-50')}>
            <Share2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className={cn('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Referral Program</h1>
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
            className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-gray-400')} />
              <span className="text-xs font-medium text-emerald-500">{kpi.change}</span>
            </div>
            <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{kpi.value}</p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-gray-500')}>{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <h2 className={cn('text-sm font-medium mb-3', isDark ? 'text-white/70' : 'text-gray-700')}>Leaderboard</h2>
          <SmartDataTable
            data={mockReferrals as unknown as Record<string, unknown>[]}
            columns={leaderboardColumns}
            searchable enableExport pageSize={10}
            searchPlaceholder="Search referrals..."
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Referral Links */}
          <div>
            <h2 className={cn('text-sm font-medium mb-3', isDark ? 'text-white/70' : 'text-gray-700')}>Referral Links</h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4 space-y-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center gap-2">
                <code className={cn('flex-1 text-xs font-mono px-3 py-2 rounded-lg truncate', isDark ? 'bg-white/[0.06] text-white/70' : 'bg-gray-50 text-gray-600')}>
                  https://diginue.in/ref/AARAV2024
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn('shrink-0 gap-1 text-xs h-8', isDark ? 'border-white/[0.1] text-white/70 hover:bg-white/[0.06]' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
                  onClick={handleCopyLink}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <div className={cn('pt-2 border-t space-y-2', isDark ? 'border-white/[0.06]' : 'border-gray-100')}>
                <p className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-gray-600')}>Reward Configuration</p>
                <div className="flex justify-between">
                  <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>Referrer Reward</span>
                  <span className={cn('text-xs font-medium text-emerald-500')}>₹1,000 per conversion</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>Referee Reward</span>
                  <span className={cn('text-xs font-medium text-emerald-500')}>₹500 discount</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>Minimum Purchase</span>
                  <span className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>₹5,000</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Referral Analytics */}
          <div>
            <h2 className={cn('text-sm font-medium mb-3', isDark ? 'text-white/70' : 'text-gray-700')}>Referral Analytics (6 months)</h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-end gap-2 h-32">
                {MONTHLY_REFERRAL_DATA.map((d, i) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className={cn('text-[10px] font-medium', isDark ? 'text-white/60' : 'text-gray-600')}>{d.count}</span>
                    <div className="w-full flex items-end" style={{ height: '96px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.count / maxBarValue) * 100}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full rounded-t-md bg-emerald-500"
                      />
                    </div>
                    <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>{d.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', isDark ? 'text-white/70' : 'text-gray-700')}>Recent Activities</h2>
        <div className={cn('rounded-2xl border p-4 space-y-0', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
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
                    <Clock className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-gray-400')} />
                    <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>{activity.time}</span>
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
