'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  BarChart3, PieChart, TrendingUp, AlertTriangle, Eye,
  Zap, Users, Megaphone, Check, Search
} from 'lucide-react';
import type { AIGrowthInsight } from '@/modules/marketing/types';

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  'channel-recommendation': <BarChart3 className="w-4 h-4" />,
  'budget-optimization': <PieChart className="w-4 h-4" />,
  'trend-prediction': <TrendingUp className="w-4 h-4" />,
  'churn-campaign': <AlertTriangle className="w-4 h-4" />,
  'fatigue-detection': <Eye className="w-4 h-4" />,
  'roi-improvement': <Zap className="w-4 h-4" />,
  'audience-expansion': <Users className="w-4 h-4" />,
  'content-optimization': <Megaphone className="w-4 h-4" />,
};

const INSIGHT_COLORS: Record<string, string> = {
  'channel-recommendation': '#3b82f6',
  'budget-optimization': '#f59e0b',
  'trend-prediction': '#10b981',
  'churn-campaign': '#ef4444',
  'fatigue-detection': '#8b5cf6',
  'roi-improvement': '#f97316',
  'audience-expansion': '#06b6d4',
  'content-optimization': '#ec4899',
};

const IMPACT_STYLES: Record<string, { color: (dark: boolean) => string; bg: (dark: boolean) => string }> = {
  'low': { color: (isDark) => isDark ? 'text-gray-400' : 'text-gray-500', bg: (isDark) => isDark ? 'bg-gray-500/15' : 'bg-gray-100' },
  'medium': { color: (isDark) => isDark ? 'text-blue-400' : 'text-blue-600', bg: (isDark) => isDark ? 'bg-blue-500/15' : 'bg-blue-50' },
  'high': { color: (isDark) => isDark ? 'text-amber-400' : 'text-amber-600', bg: (isDark) => isDark ? 'bg-amber-500/15' : 'bg-amber-50' },
  'critical': { color: (isDark) => isDark ? 'text-red-400' : 'text-red-600', bg: (isDark) => isDark ? 'bg-red-500/15' : 'bg-red-50' },
};

interface AiGrowthInsightProps {
  insight: AIGrowthInsight;
}

export default function AiGrowthInsightCard({ insight }: AiGrowthInsightProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const color = INSIGHT_COLORS[insight.type] || '#6b7280';
  const impactStyle = IMPACT_STYLES[insight.impact] || IMPACT_STYLES['low'];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn('rounded-2xl border p-4 space-y-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
            <span style={{ color }}>{INSIGHT_ICONS[insight.type] || <Search className="w-4 h-4" />}</span>
          </div>
          <div className="min-w-0">
            <h3 className={cn('text-xs font-semibold leading-tight line-clamp-2', isDark ? 'text-white' : 'text-gray-900')}>
              {insight.title}
            </h3>
          </div>
        </div>
        <span className={cn('text-[9px] font-medium px-2 py-0.5 rounded-full shrink-0', impactStyle.color(isDark), impactStyle.bg(isDark))}>
          {insight.impact}
        </span>
      </div>

      <p className={cn('text-[11px] leading-relaxed line-clamp-3', isDark ? 'text-white/45' : 'text-gray-600')}>
        {insight.description}
      </p>

      {/* Confidence Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>Confidence</span>
          <span className={cn('text-[10px] font-semibold tabular-nums', isDark ? 'text-white/60' : 'text-gray-700')}>{insight.confidence}%</span>
        </div>
        <div className={cn('w-full h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-gray-100')}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${insight.confidence}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className={cn('rounded-lg p-2.5', isDark ? 'bg-white/[0.03]' : 'bg-gray-50')}>
        <p className={cn('text-[10px] leading-relaxed', isDark ? 'text-white/40' : 'text-gray-600')}>
          {insight.recommendation}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>
          ROI: <span className="font-medium text-emerald-500">₹{(insight.potentialROI / 1000).toFixed(0)}K</span>
        </span>
        <Button
          size="sm"
          className="text-[10px] h-6 px-2 gap-1 bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700"
        >
          <Check className="w-3 h-3" />
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
