'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Sparkles, ShieldAlert, Gift, Rocket, RefreshCw, ThumbsUp, BarChart3,
  Layers, Zap, Target, AlertTriangle, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { AIGrowthInsight } from '../types';

interface AIRetentionInsightProps {
  insight: AIGrowthInsight;
}

function getTypeConfig(type: AIGrowthInsight['type']) {
  switch (type) {
    case 'churn-prevention': return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', label: 'Churn Prevention' };
    case 'loyalty-offer': return { icon: Gift, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', label: 'Loyalty Offer' };
    case 'expansion-playbook': return { icon: Rocket, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', label: 'Expansion Playbook' };
    case 'renewal-pricing': return { icon: RefreshCw, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', label: 'Renewal Pricing' };
    case 'promoter-activation': return { icon: ThumbsUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', label: 'Promoter Activation' };
    case 'ltv-growth': return { icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', label: 'LTV Growth' };
    case 'cohort-insight': return { icon: Layers, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', label: 'Cohort Insight' };
    case 'engagement-boost': return { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', label: 'Engagement Boost' };
  }
}

function getImpactStyle(impact: AIGrowthInsight['impact']) {
  switch (impact) {
    case 'critical': return { className: 'bg-red-400/15 text-red-400 border-red-400/25' };
    case 'high': return { className: 'bg-amber-400/15 text-amber-400 border-amber-400/25' };
    case 'medium': return { className: 'bg-blue-400/15 text-blue-400 border-blue-400/25' };
    case 'low': return { className: 'bg-gray-400/15 text-gray-400 border-gray-400/25' };
  }
}

function formatImpact(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

export default function AIRetentionInsight({ insight }: AIRetentionInsightProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const typeConfig = getTypeConfig(insight.type);
  const impactStyle = getImpactStyle(insight.impact);
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border border-l-2 border-l-violet-400 p-app-xl',
        isDark ? 'bg-white/[0.03] border-white/[0.06] border-l-violet-400' : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('p-1.5 rounded-[var(--app-radius-lg)]', typeConfig.bg)}>
            <TypeIcon className={cn('w-4 h-4', typeConfig.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className={cn('text-[10px] font-medium', typeConfig.color)}>{typeConfig.label}</span>
            </div>
            <h4 className="text-sm font-semibold mt-0.5">{insight.title}</h4>
          </div>
        </div>
        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 border capitalize shrink-0', impactStyle.className)}>
          {insight.impact}
        </Badge>
      </div>

      {/* Description */}
      <p className={cn('text-xs leading-relaxed mb-3', 'text-[var(--app-text-secondary)]')}>
        {insight.description}
      </p>

      {/* Confidence progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('text-[10px] w-16', 'text-[var(--app-text-muted)]')}>Confidence</span>
        <div className={cn('flex-1 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
          <motion.div
            className={cn('h-full rounded-full', insight.confidence >= 70 ? 'bg-emerald-400' : insight.confidence >= 40 ? 'bg-amber-400' : 'bg-red-400')}
            initial={{ width: 0 }}
            animate={{ width: `${insight.confidence}%` }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
        <span className="text-[10px] font-medium">{insight.confidence}%</span>
      </div>

      {/* Recommendation */}
      <div className={cn('rounded-[var(--app-radius-lg)] p-2.5 border mb-3', isDark ? 'bg-violet-400/5 border-violet-400/10' : 'bg-violet-50 border-violet-100')}>
        <p className={cn('text-[10px] font-medium mb-0.5', isDark ? 'text-violet-300' : 'text-violet-600')}>Recommendation</p>
        <p className={cn('text-xs leading-snug', 'text-[var(--app-text-secondary)]')}>{insight.recommendation}</p>
      </div>

      {/* Action items */}
      <div className="space-y-1.5 mb-3">
        {insight.actionItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle2 className={cn('w-4 h-4 shrink-0 mt-0.5', typeConfig.color)} />
            <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{item}</span>
          </div>
        ))}
      </div>

      {/* Potential impact */}
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-violet-400" />
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Potential Impact</span>
        </div>
        <span className="text-sm font-bold text-violet-400">{formatImpact(insight.potentialImpact)}</span>
      </div>
    </motion.div>
  );
}
