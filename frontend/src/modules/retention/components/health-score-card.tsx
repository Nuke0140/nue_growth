'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ArrowUpRight, ArrowDownRight, Minus, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HealthScoreCardProps {
  client: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  riskTag: 'safe' | 'medium' | 'high';
  accountManager: string;
  value: number;
  nextBestAction: string;
}

function getScoreColor(score: number) {
  if (score > 80) return { ring: 'text-emerald-400', track: 'stroke-emerald-400/20', bg: 'bg-emerald-400' };
  if (score >= 60) return { ring: 'text-amber-400', track: 'stroke-amber-400/20', bg: 'bg-amber-400' };
  return { ring: 'text-red-400', track: 'stroke-red-400/20', bg: 'bg-red-400' };
}

function getRiskConfig(tag: 'safe' | 'medium' | 'high') {
  if (tag === 'safe') return { label: 'Safe', className: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/20', icon: ShieldCheck };
  if (tag === 'medium') return { label: 'Medium', className: 'bg-amber-400/15 text-amber-400 border-amber-400/20', icon: Shield };
  return { label: 'High', className: 'bg-red-400/15 text-red-400 border-red-400/20', icon: ShieldAlert };
}

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') return { icon: ArrowUpRight, color: 'text-emerald-400' };
  if (trend === 'down') return { icon: ArrowDownRight, color: 'text-red-400' };
  return { icon: Minus, color: 'text-amber-400' };
}

export default function HealthScoreCard({ client, score, trend, riskTag, accountManager, value, nextBestAction }: HealthScoreCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = getScoreColor(score);
  const risk = getRiskConfig(riskTag);
  const trendIcon = getTrendIcon(trend);
  const TrendIcon = trendIcon.icon;
  const RiskIcon = risk.icon;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{client}</h3>
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 border', risk.className)}>
            <RiskIcon className="w-3 h-3 mr-0.5" />
            {risk.label}
          </Badge>
        </div>
        <TrendIcon className={cn('w-4 h-4', trendIcon.color)} />
      </div>

      <div className="flex items-center gap-5">
        {/* Circular progress ring */}
        <div className="relative shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="6" className={cn(colors.track, isDark ? 'stroke-white/[0.04]' : 'stroke-black/[0.04]')} />
            <motion.circle
              cx="44" cy="44" r={radius} fill="none" strokeWidth="6" strokeLinecap="round"
              className={colors.ring}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              transform="rotate(-90 44 44)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-xl font-bold', colors.ring)}>{score}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Account Value</span>
            <span className="text-sm font-semibold">₹{(value / 10000000).toFixed(1)}Cr</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manager</span>
            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{accountManager}</span>
          </div>
          <div className={cn('rounded-lg p-2 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
            <p className={cn('text-[10px] font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Next Best Action</p>
            <p className="text-xs leading-snug">{nextBestAction}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
