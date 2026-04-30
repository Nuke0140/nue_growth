'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Users, Award, TrendingUp, Crown, Star, Copy, Check } from 'lucide-react';
import { mockLoyaltyMembers, mockCoupons } from '@/modules/marketing/data/mock-data';
import type { LoyaltyMember, Coupon } from '@/modules/marketing/types';

const TIER_CONFIG = [
  { tier: 'diamond' as const, label: 'Diamond', color: '#8b5cf6', minPoints: 25000, benefits: '5x points, VIP access, priority support' },
  { tier: 'platinum' as const, label: 'Platinum', color: '#64748b', minPoints: 15000, benefits: '3x points, free shipping, exclusive deals' },
  { tier: 'gold' as const, label: 'Gold', color: '#f59e0b', minPoints: 5000, benefits: '2x points, birthday bonus, early access' },
  { tier: 'silver' as const, label: 'Silver', color: '#94a3b8', minPoints: 2000, benefits: '1.5x points, monthly newsletter' },
  { tier: 'bronze' as const, label: 'Bronze', color: '#d97706', minPoints: 0, benefits: '1x points, welcome coupon' },
];

const MILESTONES = [
  { target: 100, label: 'Welcome', reward: '₹200 coupon' },
  { target: 500, label: 'Rising Star', reward: 'Free shipping x3' },
  { target: 1000, label: 'Gold Member', reward: '₹1,000 credit' },
  { target: 5000, label: 'Platinum Elite', reward: 'VIP pass + 10% cashback' },
];

export default function LoyaltyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const kpiData = useMemo(() => {
    const totalMembers = mockLoyaltyMembers.length;
    const totalPoints = mockLoyaltyMembers.reduce((s, m) => s + m.points, 0);
    const totalSpent = mockLoyaltyMembers.reduce((s, m) => s + m.totalSpent, 0);
    const activeCoupons = mockCoupons.filter(c => c.status === 'active').length;
    return [
      { label: 'Total Members', value: totalMembers.toLocaleString(), icon: Users, change: '+12%' },
      { label: 'Points Issued', value: (totalPoints / 1000).toFixed(1) + 'K', icon: Award, change: '+8.3%' },
      { label: 'Revenue from Loyalty', value: '₹' + (totalSpent / 100000).toFixed(1) + 'L', icon: TrendingUp, change: '+18.5%' },
      { label: 'Active Coupons', value: activeCoupons.toString(), icon: Gift, change: '+2' },
    ];
  }, []);

  const tierDistribution = useMemo(() => {
    return TIER_CONFIG.map(tier => ({
      ...tier,
      count: mockLoyaltyMembers.filter(m => m.tier === tier.tier).length,
    }));
  }, []);

  const topMembers = useMemo(() => {
    return [...mockLoyaltyMembers].sort((a, b) => b.points - a.points);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'diamond': return cn('text-purple-400', isDark ? 'bg-purple-500/15 border-purple-500/20' : 'bg-purple-50 border-purple-200');
      case 'platinum': return cn('text-slate-400', isDark ? 'bg-slate-500/15 border-slate-500/20' : 'bg-slate-50 border-slate-200');
      case 'gold': return cn('text-amber-500', isDark ? 'bg-amber-500/15 border-amber-500/20' : 'bg-amber-50 border-amber-200');
      case 'silver': return cn('text-gray-400', isDark ? 'bg-gray-500/15 border-gray-500/20' : 'bg-gray-50 border-gray-200');
      default: return cn('text-orange-500', isDark ? 'bg-orange-500/15 border-orange-500/20' : 'bg-orange-50 border-orange-200');
    }
  };

  const couponStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[var(--app-success-bg)] text-[var(--app-success)]';
      case 'expired': return 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]';
      case 'redeemed': return 'bg-[var(--app-info-bg)] text-[var(--app-info)]';
      default: return '';
    }
  };

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
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-warning-bg)]')}>
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className={cn('text-xl font-semibold', 'text-[var(--app-text)]')}>Loyalty Program</h1>
            <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-gray-500')}>Manage rewards, tiers, and member engagement</p>
          </div>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2 self-start">
          <Gift className="w-4 h-4" />
          Create Reward
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
            className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-gray-400')} />
              <span className={cn('text-xs font-medium text-emerald-500')}>{kpi.change}</span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>{kpi.value}</p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tier Distribution */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Tier Distribution</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tierDistribution.map((tier, i) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>{tier.label}</span>
              </div>
              <p className={cn('text-2xl font-bold mb-1', 'text-[var(--app-text)]')}>{tier.count}</p>
              <p className={cn('text-xs mb-2', 'text-[var(--app-text-muted)]')}>Min {tier.minPoints.toLocaleString()} pts</p>
              <div className={cn('w-full h-1.5 rounded-full mb-2', 'bg-[var(--app-hover-bg)]')}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ backgroundColor: tier.color, width: `${Math.min(100, (tier.count / mockLoyaltyMembers.length) * 100)}%` }}
                />
              </div>
              <p className={cn('text-[10px] leading-tight', 'text-[var(--app-text-muted)]')}>{tier.benefits}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Members Table */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Top Members</h2>
        <div className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Name', 'Email', 'Points', 'Tier', 'Coupons', 'Total Spent', 'Join Date'].map(h => (
                    <th key={h} className={cn('text-left px-4 py-3 text-xs font-medium', 'text-[var(--app-text-muted)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topMembers.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className={cn('border-b last:border-0', isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-gray-50/50')}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: isDark ? 'white' : '#111827' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: TIER_CONFIG.find(t => t.tier === member.tier)?.color + '22', color: TIER_CONFIG.find(t => t.tier === member.tier)?.color }}>
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </div>
                    </td>
                    <td className={cn('px-4 py-3', isDark ? 'text-white/50' : 'text-gray-500')}>{member.email}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: isDark ? 'white' : '#111827' }}>{member.points.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', tierBadgeClass(member.tier))}>
                        {member.tier.charAt(0).toUpperCase() + member.tier.slice(1)}
                      </Badge>
                    </td>
                    <td className={cn('px-4 py-3', isDark ? 'text-white/50' : 'text-gray-500')}>{member.couponsRedeemed}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: isDark ? 'white' : '#111827' }}>₹{member.totalSpent.toLocaleString()}</td>
                    <td className={cn('px-4 py-3', isDark ? 'text-white/40' : 'text-gray-400')}>{member.joinDate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Coupons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCoupons.map((coupon, i) => {
            const usagePct = Math.round((coupon.usageCount / coupon.maxUsage) * 100);
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-4 space-y-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <code className={cn('text-xs font-mono px-2 py-1 rounded-md', isDark ? 'bg-white/[0.06] text-amber-400' : 'bg-amber-50 text-amber-600')}>
                      {coupon.code}
                    </code>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', couponStatusColor(coupon.status))}>
                      {coupon.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className={cn('p-1 rounded-md transition-colors', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-gray-100')}
                  >
                    {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />}
                  </button>
                </div>
                <div>
                  <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{coupon.discount}</p>
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{coupon.type === 'percentage' ? 'Percentage off' : coupon.type === 'flat' ? 'Flat discount' : coupon.type}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Usage</span>
                    <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-gray-600')}>{coupon.usageCount}/{coupon.maxUsage}</span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <div
                      className={cn('h-full rounded-full', usagePct > 90 ? 'bg-red-500' : usagePct > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                </div>
                <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Expires: {coupon.expiry}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MILESTONES.map((ms, i) => {
            const maxPoints = 5000;
            const pct = Math.min(100, (mockLoyaltyMembers[0]?.points || 0) / maxPoints * 100 * (ms.target / maxPoints));
            const achieved = (mockLoyaltyMembers[0]?.points || 0) >= ms.target;
            return (
              <motion.div
                key={ms.target}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]', achieved && (isDark ? 'ring-1 ring-amber-500/30' : 'ring-1 ring-amber-200'))}
              >
                <div className="flex items-center gap-2 mb-2">
                  {achieved ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Star className={cn('w-4 h-4', isDark ? 'text-white/20' : 'text-gray-300')} />}
                  <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>{ms.label}</span>
                </div>
                <p className={cn('text-xs mb-2', 'text-[var(--app-text-muted)]')}>{ms.target.toLocaleString()} points</p>
                <div className={cn('w-full h-2 rounded-full mb-2', 'bg-[var(--app-hover-bg)]')}>
                  <div
                    className={cn('h-full rounded-full', achieved ? 'bg-amber-500' : isDark ? 'bg-white/20' : 'bg-gray-300')}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <p className={cn('text-[10px] font-medium', achieved ? 'text-amber-500' : 'text-[var(--app-text-muted)]')}>
                  {ms.reward}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
