'use client';

import { motion } from 'framer-motion';
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
  const severity = severityConfig[insight.severity];
  const isCritical = insight.severity === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative rounded-2xl border overflow-hidden shadow-sm',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]',
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
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-600" />

      <div className="pl-4 pr-5 py-4">
        {/* Header: Severity + Type */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full shrink-0', severity.dotColor)} />
              <span className="text-[10px] font-medium text-[var(--app-text-secondary)]">
                {severity.label}
              </span>
            </div>
            <span className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              <Brain className="w-2.5 h-2.5" />
              {typeLabels[insight.type] || insight.type}
            </span>
          </div>
          <span className="text-[10px] text-[var(--app-text-disabled)]">
            {insight.id.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold mb-2 leading-relaxed">
          {insight.title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 line-clamp-2 text-[var(--app-text-secondary)]">
          {insight.description}
        </p>

        {/* Recommendation */}
        {insight.recommendation && (
          <div
            className={cn(
              'p-2.5 rounded-xl mb-3',
              'bg-purple-50 dark:bg-purple-500/[0.06] border border-purple-100 dark:border-purple-500/[0.1]'
            )}
          >
            <div className="flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold mb-0.5 text-purple-500">Recommendation</p>
                <p className="text-[11px] leading-relaxed text-[var(--app-text-secondary)]">
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
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]'
                )}
              >
                {entity}
              </span>
            ))}
          </div>
        )}

        {/* Confidence Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-medium shrink-0 text-[var(--app-text-muted)]">
            Confidence
          </span>
          <div className="flex-1">
            <div className="h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
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
          <span className="text-[11px] font-bold shrink-0 text-[var(--app-text-secondary)]">
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
                : 'bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
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
