'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Zap,
  AlertTriangle,
  ArrowRight,
  Brain,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AiOpsInsight, AiOpsSeverity } from '../types';

// ─── Severity Configuration ───────────────────────────────
const severityConfig: Record<AiOpsSeverity, { label: string; dotColor: string; ringColor: string; glowColor: string }> = {
  critical: {
    label: 'Critical',
    dotColor: 'bg-red-500',
    ringColor: 'ring-red-500/20',
    glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
  high: {
    label: 'High',
    dotColor: 'bg-orange-500',
    ringColor: 'ring-orange-500/20',
    glowColor: '',
  },
  medium: {
    label: 'Medium',
    dotColor: 'bg-amber-500',
    ringColor: 'ring-amber-500/20',
    glowColor: '',
  },
  low: {
    label: 'Low',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-500/20',
    glowColor: '',
  },
};

// ─── Type Configuration ───────────────────────────────────
const typeLabels: Record<string, string> = {
  cost_anomaly: 'Cost Anomaly',
  risk_prediction: 'Risk Prediction',
  optimization: 'Optimization',
  compliance: 'Compliance',
  resource_alert: 'Resource Alert',
  delivery_risk: 'Delivery Risk',
  revenue_forecast: 'Revenue Forecast',
  vendor_risk: 'Vendor Risk',
};

// ─── Component ────────────────────────────────────────────
interface AiOpsInsightProps {
  insight: AiOpsInsight;
  onAction?: () => void;
}

export default function AiOpsInsightCard({ insight, onAction }: AiOpsInsightProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const severity = severityConfig[insight.severity];
  const isCritical = insight.severity === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-2xl border overflow-hidden shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white border-black/[0.06]',
        isCritical && severity.glowColor
      )}
    >
      {/* Critical glow animation */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(239,68,68,0.08)',
              '0 0 30px rgba(239,68,68,0.15)',
              '0 0 20px rgba(239,68,68,0.08)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Left gradient border */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1',
          isDark
            ? 'bg-gradient-to-b from-purple-500/80 via-blue-500/60 to-purple-500/40'
            : 'bg-gradient-to-b from-purple-500 via-blue-500 to-purple-600'
        )}
      />

      <div className="pl-4 pr-5 py-4">
        {/* Header: Severity + Type */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full shrink-0', severity.dotColor)} />
              <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
                {severity.label}
              </span>
            </div>
            <span className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium',
              isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40'
            )}>
              <Brain className="w-2.5 h-2.5" />
              {typeLabels[insight.type] || insight.type}
            </span>
          </div>
          <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
            {insight.id.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold mb-2 leading-relaxed">
          {insight.title}
        </h3>

        {/* Description */}
        <p className={cn('text-xs leading-relaxed mb-3 line-clamp-2', isDark ? 'text-white/50' : 'text-black/50')}>
          {insight.description}
        </p>

        {/* Recommendation */}
        {insight.recommendation && (
          <div
            className={cn(
              'p-2.5 rounded-xl mb-3',
              isDark ? 'bg-purple-500/[0.06] border border-purple-500/[0.1]' : 'bg-purple-50 border border-purple-100'
            )}
          >
            <div className="flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className={cn('text-[10px] font-semibold mb-0.5 text-purple-500')}>Recommendation</p>
                <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Affected Entities */}
        {insight.affectedEntities.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mb-3">
            {insight.affectedEntities.map((entity) => (
              <span
                key={entity}
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border',
                  isDark
                    ? 'bg-white/[0.04] text-white/50 border-white/[0.06]'
                    : 'bg-black/[0.03] text-black/50 border-black/[0.06]'
                )}
              >
                {entity}
              </span>
            ))}
          </div>
        )}

        {/* Confidence Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className={cn('text-[10px] font-medium shrink-0', isDark ? 'text-white/40' : 'text-black/40')}>
            Confidence
          </span>
          <div className="flex-1">
            <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  insight.confidence >= 80 ? 'bg-emerald-500'
                    : insight.confidence >= 60 ? 'bg-amber-500'
                    : 'bg-red-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          <span className={cn('text-[11px] font-bold shrink-0', isDark ? 'text-white/60' : 'text-black/60')}>
            {insight.confidence}%
          </span>
        </div>

        {/* Take Action Button */}
        {onAction && (
          <Button
            size="sm"
            onClick={onAction}
            className={cn(
              'w-full h-8 text-[11px] font-medium rounded-lg gap-1.5 transition-all',
              isCritical
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isDark
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/20'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
            )}
          >
            {isCritical ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
            Take Action
          </Button>
        )}
      </div>
    </motion.div>
  );
}
