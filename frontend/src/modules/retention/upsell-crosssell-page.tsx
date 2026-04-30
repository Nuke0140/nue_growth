'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, Target, TrendingUp, ArrowUpRight, ArrowDownRight,
  ChevronRight, Filter, Sparkles, IndianRupee, Zap, BarChart3,
  CheckCircle2, Clock, XCircle, AlertTriangle
} from 'lucide-react';
import { upsellData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { UpsellOpportunity } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'new': { label: 'New', color: 'text-sky-400', bg: 'bg-sky-500/15', icon: Sparkles },
  'approached': { label: 'Approached', color: 'text-amber-400', bg: 'bg-amber-500/15', icon: AlertTriangle },
  'in-progress': { label: 'In Progress', color: 'text-violet-400', bg: 'bg-violet-500/15', icon: Clock },
  'closed-won': { label: 'Closed Won', color: 'text-emerald-400', bg: 'bg-emerald-500/15', icon: CheckCircle2 },
  'closed-lost': { label: 'Closed Lost', color: 'text-red-400', bg: 'bg-red-500/15', icon: XCircle },
};

const allStatuses = ['all', 'new', 'approached', 'in-progress', 'closed-won', 'closed-lost'];

export default function UpsellCrosssellPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return upsellData;
    return upsellData.filter((o: UpsellOpportunity) => o.status === statusFilter);
  }, [statusFilter]);

  const kpiStats = useMemo(() => {
    const totalPipeline = upsellData.reduce((s, o) => s + o.expansionValue, 0);
    const approached = upsellData.filter(o => o.status === 'approached').length;
    const inProgress = upsellData.filter(o => o.status === 'in-progress').length;
    const closedWon = upsellData.filter(o => o.status === 'closed-won').length;
    const avgFit = upsellData.reduce((s, o) => s + o.fitScore, 0) / upsellData.length;
    const avgProb = upsellData.reduce((s, o) => s + o.probability, 0) / upsellData.length;
    return [
      { label: 'Total Pipeline Value', value: formatINR(totalPipeline), icon: IndianRupee, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 12.4, changeLabel: 'vs last quarter' },
      { label: 'Approached', value: `${approached}`, icon: Target, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', change: 25.0, changeLabel: 'opportunities reached out' },
      { label: 'In-Progress', value: `${inProgress}`, icon: Clock, color: 'text-violet-400', bg: isDark ? 'bg-violet-500/10' : 'bg-violet-50', change: 10.0, changeLabel: 'active negotiations' },
      { label: 'Closed Won', value: `${closedWon}`, icon: CheckCircle2, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', change: 0, changeLabel: 'conversions this period' },
      { label: 'Avg Fit Score', value: `${avgFit.toFixed(0)}%`, icon: Zap, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', change: 5.2, changeLabel: 'service compatibility' },
    ];
  }, [isDark]);

  const fitDistribution = useMemo(() => {
    const buckets = { '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0 };
    upsellData.forEach(o => {
      if (o.fitScore >= 90) buckets['90-100']++;
      else if (o.fitScore >= 80) buckets['80-89']++;
      else if (o.fitScore >= 70) buckets['70-79']++;
      else buckets['60-69']++;
    });
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
  }, []);

  const maxFitBucket = Math.max(...fitDistribution.map(b => b.value), 1);

  const topInsight = useMemo(() => {
    const sorted = [...upsellData].sort((a, b) => b.probability - a.probability);
    return sorted[0];
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <TrendingUp className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Upsell & Cross-sell</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Expansion Revenue Cockpit</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Search className="w-4 h-4" />
            Find Opportunities
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                {stat.change > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-500">
                    <ArrowUpRight className="w-3 h-3" />{stat.change}%
                  </span>
                )}
              </div>
              <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-black/25')}>{stat.changeLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Insight Highlight */}
        {topInsight && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className={cn('rounded-2xl border p-4 flex items-start gap-3', isDark ? 'bg-emerald-500/[0.04] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')}
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', isDark ? 'bg-emerald-500/15' : 'bg-emerald-100')}>
              <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Top Opportunity Insight</p>
              <p className={cn('text-sm mt-1', isDark ? 'text-white/60' : 'text-black/60')}>
                <span className="font-semibold">{topInsight.client}</span> → <span className="font-semibold text-emerald-500">{topInsight.probability}% chance</span> to buy{' '}
                <span className="font-medium">{topInsight.recommendedService}</span> — {formatINR(topInsight.expansionValue)} expansion value
              </p>
            </div>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
          {allStatuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                statusFilter === status
                  ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black')
                  : (isDark ? 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06]' : 'bg-black/[0.03] text-black/40 hover:bg-black/[0.06]')
              )}
            >
              {status === 'all' ? `All (${upsellData.length})` : `${statusConfig[status]?.label ?? status} (${upsellData.filter(o => o.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Opportunity Cards & Fit Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Opportunity Cards */}
          <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((opp: UpsellOpportunity, i) => {
              const config = statusConfig[opp.status] || statusConfig['new'];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
                  className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-bold truncate">{opp.client}</p>
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 shrink-0', config.bg, config.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />{config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {opp.currentServices.map(s => (
                          <Badge key={s} variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                            {s}
                          </Badge>
                        ))}
                        <span className={cn('text-[10px] px-1', isDark ? 'text-white/25' : 'text-black/25')}>→</span>
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
                          {opp.recommendedService}
                        </Badge>
                      </div>
                      {/* Fit Score Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-[11px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Fit Score</span>
                          <span className="text-xs font-bold">{opp.fitScore}%</span>
                        </div>
                        <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${opp.fitScore}%` }}
                            transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('h-full rounded-full', opp.fitScore >= 85 ? 'bg-emerald-500' : opp.fitScore >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                      </div>
                      {/* Probability Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-[11px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Probability</span>
                          <span className="text-xs font-bold">{opp.probability}%</span>
                        </div>
                        <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${opp.probability}%` }}
                            transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn('h-full rounded-full', opp.probability >= 75 ? 'bg-violet-500' : opp.probability >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-2 shrink-0">
                      <div className="text-right">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Expansion Value</p>
                        <p className="text-lg font-bold text-emerald-500">{formatINR(opp.expansionValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Growth Score</p>
                        <p className="text-sm font-semibold">{opp.accountGrowthScore}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Industry</p>
                        <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
                          {opp.industry}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-4 mt-3 pt-3 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      <Clock className="w-3 h-3 inline mr-1" />Last: {opp.lastPurchase}
                    </span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      Manager: {opp.accountManager}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Fit Score Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className={cn('rounded-2xl border p-5 h-fit', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Fit Score Distribution</span>
            </div>
            <div className="space-y-3">
              {fitDistribution.map((bucket, j) => {
                const colors = [
                  isDark ? 'bg-emerald-500/40' : 'bg-emerald-400',
                  isDark ? 'bg-sky-500/40' : 'bg-sky-400',
                  isDark ? 'bg-amber-500/40' : 'bg-amber-400',
                  isDark ? 'bg-red-500/40' : 'bg-red-400',
                ];
                return (
                  <div key={bucket.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-[11px] font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{bucket.label}%</span>
                      <span className="text-xs font-bold">{bucket.value}</span>
                    </div>
                    <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(bucket.value / maxFitBucket) * 100}%` }}
                        transition={{ delay: 0.5 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('h-full rounded-full', colors[j])}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
