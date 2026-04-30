'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Award, Users, Percent, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LoyaltyTier } from '../types';

type LoyaltyTierCardProps = LoyaltyTier;

function getTierAccent(tier: 'silver' | 'gold' | 'platinum') {
  switch (tier) {
    case 'silver': return { badge: 'bg-slate-300/20 text-slate-300 border-slate-400/30', ring: 'ring-slate-400/20' };
    case 'gold': return { badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30', ring: 'ring-amber-400/20' };
    case 'platinum': return { badge: 'bg-violet-400/20 text-violet-400 border-violet-400/30', ring: 'ring-violet-400/20' };
  }
}

export default function LoyaltyTierCard({ tier, minSpent, benefits, discount, memberCount, color }: LoyaltyTierCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = getTierAccent(tier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5 relative overflow-hidden',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Color accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: color }} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" style={{ color }} />
          <h3 className="text-sm font-semibold capitalize">{tier}</h3>
        </div>
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', accent.badge)}>
          {discount}% OFF
        </span>
      </div>

      {/* Benefits list */}
      <div className="space-y-1.5 mb-4">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 shrink-0" style={{ color }} />
            <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>{benefit}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className={cn(
        'grid grid-cols-2 gap-3 rounded-xl p-3 border',
        isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]'
      )}>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" style={{ color }} />
          <div>
            <p className="text-xs font-semibold">{memberCount.toLocaleString()}</p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Percent className="w-3.5 h-3.5" style={{ color }} />
          <div>
            <p className="text-xs font-semibold">{discount}%</p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Discount</p>
          </div>
        </div>
      </div>

      <p className={cn('text-[10px] mt-3 text-center', isDark ? 'text-white/25' : 'text-black/25')}>
        Min. spend: ₹{(minSpent / 100000).toFixed(0)}L
      </p>
    </motion.div>
  );
}
