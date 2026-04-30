'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { GripVertical, Calendar, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import type { Deal } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getProbabilityColor(probability: number, isDark: boolean): string {
  if (probability >= 70) return isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (probability >= 40) return isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
  return isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200';
}

function getRiskLevel(probability: number): { label: string; color: string; darkColor: string } {
  if (probability < 30) return { label: 'High Risk', color: 'bg-red-500/15 text-red-600 border-red-200', darkColor: 'bg-red-500/15 text-red-300 border-red-500/20' };
  if (probability <= 60) return { label: 'Medium Risk', color: 'bg-amber-500/15 text-amber-600 border-amber-200', darkColor: 'bg-amber-500/15 text-amber-300 border-amber-500/20' };
  return { label: 'Low Risk', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-200', darkColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' };
}

function getActivityIndicator(daysInStage: number) {
  if (daysInStage <= 3) return { color: 'bg-emerald-500', text: 'Active', darkText: 'text-emerald-400', lightText: 'text-emerald-600' };
  if (daysInStage <= 10) return { color: 'bg-amber-500', text: 'Needs attention', darkText: 'text-amber-400', lightText: 'text-amber-600' };
  return { color: 'bg-red-500', text: 'At risk', darkText: 'text-red-400', lightText: 'text-red-600' };
}

const DealCard = memo(function DealCard({ deal, onSelect, isDragging }: { deal: Deal; onSelect?: (deal: Deal) => void; isDragging?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectDeal = useCrmSalesStore((s) => s.selectDeal);

  const daysInStage = deal.daysInStage || 0;
  const weightedValue = Math.round(deal.value * deal.probability / 100);
  const risk = getRiskLevel(deal.probability);
  const activity = getActivityIndicator(daysInStage);
  const isStuck = daysInStage > 15;
  const isSlow = daysInStage > 10;

  // AI Insight conditions
  const showHighChance = deal.probability >= 70;
  const showNoActivity = daysInStage > 10 && deal.probability < 40;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      onClick={() => onSelect ? onSelect(deal) : selectDeal(deal.id)}
      className={cn(
        'relative rounded-[var(--app-radius-lg)] border p-3.5 cursor-pointer transition-colors duration-200 group',
        isDragging && 'opacity-50 shadow-[var(--app-shadow-md)]-2xl scale-105',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[var(--app-shadow-md)]-lg hover:shadow-[var(--app-shadow-md)]-black/20'
          : 'bg-white border-black/[0.06] hover:bg-black/[0.01] hover:border-black/[0.12] hover:shadow-[var(--app-shadow-md)]-lg hover:shadow-[var(--app-shadow-md)]-black/5'
      )}
    >
      {/* Drag Handle */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 rounded-l-[var(--app-radius-lg)] flex items-start justify-center pt-4 w-5 opacity-0 group-hover:opacity-100 transition-opacity',
        isDark ? 'bg-white/[0.06]' : 'bg-black/[0.03]'
      )}>
        <GripVertical className={cn('w-4 h-4', isDark ? 'text-white/20' : 'text-black/20')} />
      </div>

      <div className="pl-1">
        {/* Header: Deal name + Probability */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={cn(
            'text-sm font-semibold leading-tight line-clamp-2',
            isDark ? 'text-white' : 'text-black'
          )}>
            {deal.name}
          </h4>
          <span className={cn(
            'shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-[var(--app-radius-md)] border',
            getProbabilityColor(deal.probability, isDark)
          )}>
            {deal.probability}%
          </span>
        </div>

        {/* Company & Contact */}
        <div className="space-y-0.5 mb-3">
          <p className={cn('text-xs truncate', isDark ? 'text-white/50' : 'text-black/50')}>
            {deal.company}
          </p>
          <p className={cn('text-xs truncate', isDark ? 'text-white/40' : 'text-black/40')}>
            {deal.contactName}
          </p>
        </div>

        {/* Value + Weighted Value */}
        <div className="mb-2">
          <span className={cn('text-lg font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
            {formatCurrency(deal.value)}
          </span>
          {deal.probability > 0 && deal.probability < 100 && (
            <span className={cn('text-[10px] ml-1.5', isDark ? 'text-white/30' : 'text-black/30')}>
              wt: {formatCurrency(weightedValue)}
            </span>
          )}
        </div>

        {/* Risk Badge */}
        <div className="mb-2 flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className={cn(
            'text-[9px] px-1.5 py-0 h-4 gap-1',
            isDark ? risk.darkColor : risk.color
          )}>
            <Shield className="w-2.5 h-2.5" />
            {risk.label}
          </Badge>

          {/* AI Insight Badge */}
          {showHighChance && (
            <Badge variant="outline" className={cn(
              'text-[9px] px-1.5 py-0 h-4 gap-1',
              isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            )}>
              <Sparkles className="w-2.5 h-2.5" />
              High chance to close
            </Badge>
          )}
          {showNoActivity && (
            <Badge variant="outline" className={cn(
              'text-[9px] px-1.5 py-0 h-4 gap-1',
              isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'
            )}>
              <AlertTriangle className="w-2.5 h-2.5" />
              No activity — follow up
            </Badge>
          )}
        </div>

        {/* Aging Indicator */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>
            {daysInStage}d in stage
          </span>
          {isSlow && (
            <Badge variant="outline" className={cn(
              'text-[9px] px-1.5 py-0 h-4',
              isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200'
            )}>
              Slow
            </Badge>
          )}
        </div>

        {/* Activity Indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className={cn('w-1.5 h-1.5 rounded-full', activity.color)} />
          <span className={cn('text-[10px]', isDark ? activity.darkText : activity.lightText)}>
            {activity.text}
          </span>
        </div>

        {/* Footer: Date, Owner */}
        <div className={cn(
          'flex items-center justify-between pt-2 border-t',
          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
        )}>
          <div className="flex items-center gap-1.5">
            <Calendar className={cn('w-4 h-4', isDark ? 'text-white/20' : 'text-black/20')} />
            <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
              {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Owner Avatar */}
          <div className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold',
            isDark ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'
          )}>
            {getInitials(deal.owner)}
          </div>
        </div>

        {/* Stuck Warning */}
        {isStuck && (
          <div className={cn(
            'flex items-center gap-1 mt-2',
            isDark ? 'text-amber-400/70' : 'text-amber-600'
          )}>
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-medium">Stuck {daysInStage}d in stage</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default DealCard;
