'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Heart, ArrowUpRight, ArrowDownRight, Minus, Shield, ShieldAlert, ShieldCheck,
  User, IndianRupee, Activity, BarChart3, TrendingUp, Calendar, Filter,
  ChevronRight, Zap, MessageSquare, CreditCard, Clock, Star
} from 'lucide-react';
import { customerHealthData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { CustomerHealth } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function HealthRing({ score }: { score: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="5" />
        <motion.circle
          cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{score}</span>
      </div>
    </div>
  );
}

function FactorBar({ label, value }: { label: string; value: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-2">
      <span className={cn('text-[9px] w-16 shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>{label}</span>
      <div className={cn('flex-1 h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500')}
        />
      </div>
      <span className={cn('text-[9px] w-6 text-right font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{value}</span>
    </div>
  );
}

const riskConfig: Record<string, { bg: string; text: string; label: string }> = {
  safe: { bg: isDark => isDark ? 'bg-emerald-500/15' : 'bg-emerald-50', text: 'text-emerald-500', label: 'Safe' },
  medium: { bg: isDark => isDark ? 'bg-amber-500/15' : 'bg-amber-50', text: 'text-amber-500', label: 'Medium' },
  high: { bg: isDark => isDark ? 'bg-red-500/15' : 'bg-red-50', text: 'text-red-500', label: 'High Risk' },
};

export default function CustomerHealthPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const summary = useMemo(() => {
    const safe = customerHealthData.filter((c) => c.riskTag === 'safe').length;
    const medium = customerHealthData.filter((c) => c.riskTag === 'medium').length;
    const high = customerHealthData.filter((c) => c.riskTag === 'high').length;
    return { safe, medium, high };
  }, []);

  const sortedCustomers = useMemo(() => {
    let filtered = filterRisk === 'all' ? [...customerHealthData] : customerHealthData.filter((c) => c.riskTag === filterRisk);
    return filtered.sort((a, b) => a.healthScore - b.healthScore);
  }, [filterRisk]);

  const scoreTrend = useMemo(() => [
    { month: 'Nov', avg: 72 },
    { month: 'Dec', avg: 74 },
    { month: 'Jan', avg: 73 },
    { month: 'Feb', avg: 75 },
    { month: 'Mar', avg: 76 },
    { month: 'Apr', avg: 78 },
  ], []);

  const maxTrend = Math.max(...scoreTrend.map((s) => s.avg));

  const getRiskStyle = (risk: string) => {
    if (risk === 'safe') return { bg: isDark ? 'bg-emerald-500/15' : 'bg-emerald-50', text: 'text-emerald-500', label: 'Safe' };
    if (risk === 'medium') return { bg: isDark ? 'bg-amber-500/15' : 'bg-amber-50', text: 'text-amber-500', label: 'Medium' };
    return { bg: isDark ? 'bg-red-500/15' : 'bg-red-50', text: 'text-red-500', label: 'High Risk' };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Heart className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Customer Health</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Health Intelligence Cockpit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['all', 'safe', 'medium', 'high'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRisk(f)}
                className={cn(
                  'px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors capitalize',
                  filterRisk === f
                    ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black')
                    : (isDark ? 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]' : 'text-black/30 hover:text-black/50 hover:bg-black/[0.04]')
                )}
              >
                {f === 'all' ? 'All' : f === 'high' ? 'High Risk' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Safe', count: summary.safe, icon: ShieldCheck, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
            { label: 'Medium', count: summary.medium, icon: Shield, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
            { label: 'High Risk', count: summary.high, icon: ShieldAlert, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{item.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', item.bg)}>
                  <item.icon className={cn('w-3.5 h-3.5', item.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>of {customerHealthData.length} accounts</p>
            </motion.div>
          ))}
        </div>

        {/* Score Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Health Score Trend</span>
            </div>
            <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Portfolio avg</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {scoreTrend.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{entry.avg}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.avg / maxTrend) * 100}%` }}
                  transition={{ delay: 0.3 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', isDark ? 'bg-emerald-500/30' : 'bg-emerald-400')}
                />
                <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>{entry.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Health Cards */}
        <div className="space-y-3">
          {sortedCustomers.map((customer: CustomerHealth, i) => {
            const riskStyle = getRiskStyle(customer.riskTag);
            const TrendIcon = customer.trend === 'up' ? ArrowUpRight : customer.trend === 'down' ? ArrowDownRight : Minus;
            const trendColor = customer.trend === 'up' ? 'text-emerald-500' : customer.trend === 'down' ? 'text-red-500' : 'text-amber-500';

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-5 transition-colors cursor-pointer',
                  customer.riskTag === 'high'
                    ? (isDark ? 'bg-red-500/[0.03] border-red-500/15 hover:bg-red-500/[0.06]' : 'bg-red-50/50 border-red-200 hover:bg-red-50')
                    : (isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')
                )}
              >
                <div className="flex gap-4">
                  <HealthRing score={customer.healthScore} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold truncate">{customer.client}</h3>
                      <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', riskStyle.bg, riskStyle.text)}>
                        {riskStyle.label}
                      </Badge>
                      <TrendIcon className={cn('w-3.5 h-3.5 shrink-0', trendColor)} />
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{customer.industry}</span>
                    </div>

                    {/* Factor Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-3">
                      <FactorBar label="Usage" value={customer.usage} />
                      <FactorBar label="Engagement" value={customer.engagement} />
                      <FactorBar label="Payment" value={customer.paymentBehavior} />
                      <FactorBar label="Support" value={customer.supportSentiment} />
                      <FactorBar label="NPS" value={customer.nps} />
                      <FactorBar label="Response" value={customer.responseRate} />
                      <FactorBar label="Activity" value={customer.activityFrequency} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <User className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                        <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>{customer.accountManager}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                        <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>{formatINR(customer.value)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
                        <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Last: {customer.lastActiveDate}</span>
                      </div>
                      <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>•</span>
                      <span className={cn('text-[10px] font-medium', isDark ? 'text-violet-400' : 'text-violet-600')}>
                        {customer.nextBestAction}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
