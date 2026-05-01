'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Segment } from '../types';
import { Users, TrendingUp, TrendingDown, RefreshCw, ArrowRight } from 'lucide-react';

interface SegmentFilterProps {
  segment: Segment;
  index?: number;
}

const segmentTypeLabels: Record<string, string> = {
  vip: 'VIP',
  high_intent: 'High Intent',
  new_leads: 'New Leads',
  repeat_buyers: 'Repeat Buyers',
  churn_risk: 'Churn Risk',
  inactive: 'Inactive',
  custom: 'Custom',
};

const segmentTypeColors: Record<string, string> = {
  vip: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high_intent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  new_leads: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  repeat_buyers: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  churn_risk: 'bg-red-500/10 text-red-400 border-red-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  custom: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const operatorLabels: Record<string, string> = {
  equals: '=',
  not_equals: '≠',
  contains: '∋',
  greater_than: '>',
  less_than: '<',
  is_empty: '∅',
  is_not_empty: '!∅',
  in_last: '≤d',
  before: '<',
  after: '>',
};

export default function SegmentFilter({ segment, index = 0 }: SegmentFilterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useCrmSalesStore((s) => s.navigateTo);
  const isGrowing = segment.growthTrend > 0;

  // Generate fake monthly data for the mini chart
  const months = [28, 35, 42, 38, 45, segment.customerCount];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 group cursor-default',
        isDark
          ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
          : 'bg-white border border-black/[0.06] hover:border-black/[0.12] shadow-sm'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>
              {segment.name}
            </h3>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-2 py-0 h-5 font-medium border', segmentTypeColors[segment.type])}
            >
              {segmentTypeLabels[segment.type] || segment.type}
            </Badge>
          </div>
          <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
            {segment.description}
          </p>
        </div>
      </div>

      {/* Customer Count + Trend */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <Users className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
          <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
            {segment.customerCount}
          </span>
        </div>
        <div className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium',
          isGrowing
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-red-400 bg-red-500/10'
        )}>
          {isGrowing ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(segment.growthTrend)}%
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="flex items-end gap-1.5 h-12 mb-4 px-1">
        {months.map((val, i) => {
          const maxVal = Math.max(...months);
          const height = Math.max(4, (val / maxVal) * 100);
          const isLast = i === months.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'flex-1 rounded-md min-h-[4px] transition-colors',
                isLast
                  ? isDark ? 'bg-white/30' : 'bg-black/30'
                  : isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]'
              )}
            />
          );
        })}
      </div>

      {/* Rules */}
      <div className={cn(
        'rounded-xl p-3 mb-4 space-y-2',
        isDark ? 'bg-white/[0.02] border border-white/[0.04]' : 'bg-black/[0.02] border border-black/[0.04]'
      )}>
        {segment.rules.map((rule, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            {i > 0 && (
              <Badge variant="outline" className={cn(
                'text-[9px] px-1.5 py-0 h-4 font-mono uppercase border',
                isDark ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'
              )}>
                {rule.logic}
              </Badge>
            )}
            <span className={cn('text-[11px] font-mono', isDark ? 'text-white/50' : 'text-black/50')}>
              {rule.field.replace(/_/g, ' ')}
            </span>
            <span className={cn(
              'text-[11px] font-mono font-bold px-1.5 py-0.5 rounded',
              isDark ? 'bg-white/[0.06] text-white/70' : 'bg-black/[0.06] text-black/70'
            )}>
              {operatorLabels[rule.operator] || rule.operator}
            </span>
            <span className={cn('text-[11px] font-mono', isDark ? 'text-white/60' : 'text-black/60')}>
              {typeof rule.value === 'number' && rule.value > 1000
                ? `${(rule.value / 1000).toFixed(0)}K`
                : String(rule.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Sync Status + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <RefreshCw className={cn(
            'w-3 h-3',
            segment.isSyncedToCampaign
              ? 'text-emerald-400'
              : isDark ? 'text-white/20' : 'text-black/20'
          )} />
          <span className={cn(
            'text-[11px]',
            segment.isSyncedToCampaign
              ? 'text-emerald-400'
              : isDark ? 'text-white/30' : 'text-black/30'
          )}>
            {segment.isSyncedToCampaign
              ? `Synced ${segment.lastSynced || ''}`
              : 'Not synced'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo('contacts')}
          className={cn(
            'text-xs h-7 px-3 rounded-lg gap-1',
            isDark
              ? 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              : 'text-black/50 hover:text-black hover:bg-black/[0.04]'
          )}
        >
          View Contacts
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Campaign Sync CTA */}
      {!segment.isSyncedToCampaign && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'w-full mt-3 text-xs h-8 rounded-lg',
            isDark
              ? 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
              : 'border-purple-500/20 text-purple-600 hover:bg-purple-500/5 hover:text-purple-500'
          )}
        >
          Sync to Campaign
        </Button>
      )}
    </motion.div>
  );
}
