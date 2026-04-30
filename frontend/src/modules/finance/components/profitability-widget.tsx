'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function getMarginColor(margin: number, isDark: boolean) {
  if (margin > 35) return 'text-[var(--app-success)]';
  if (margin > 20) return 'text-[var(--app-warning)]';
  return 'text-[var(--app-danger)]';
}

function getMarginBarColor(margin: number) {
  if (margin > 35) return 'bg-emerald-500';
  if (margin > 20) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMarginBarBg(margin: number, isDark: boolean) {
  if (margin > 35) return isDark ? 'bg-emerald-500/10' : 'bg-emerald-100';
  if (margin > 20) return isDark ? 'bg-amber-500/10' : 'bg-amber-100';
  return isDark ? 'bg-red-500/10' : 'bg-red-100';
}

function getRiskConfig(risk: string, isDark: boolean) {
  switch (risk.toLowerCase()) {
    case 'low':
      return {
        label: 'Low Risk',
        bgDark: 'bg-emerald-500/15',
        bgLight: 'bg-emerald-50',
        textDark: 'text-emerald-400',
        textLight: 'text-emerald-600',
      };
    case 'medium':
      return {
        label: 'Medium Risk',
        bgDark: 'bg-amber-500/15',
        bgLight: 'bg-amber-50',
        textDark: 'text-amber-400',
        textLight: 'text-amber-600',
      };
    case 'high':
      return {
        label: 'High Risk',
        bgDark: 'bg-red-500/15',
        bgLight: 'bg-red-50',
        textDark: 'text-red-400',
        textLight: 'text-red-600',
      };
    default:
      return {
        label: risk,
        bgDark: 'bg-slate-500/15',
        bgLight: 'bg-slate-50',
        textDark: 'text-slate-400',
        textLight: 'text-slate-600',
      };
  }
}

// ─── Component ────────────────────────────────────────────
interface ProfitabilityWidgetProps {
  client: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  risk: string;
  trend: number;
}

export default function ProfitabilityWidget({
  client,
  revenue,
  cost,
  profit,
  margin,
  risk,
  trend,
}: ProfitabilityWidgetProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const riskConfig = getRiskConfig(risk, isDark);
  const isPositiveTrend = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4 shadow-sm',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
          {client}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Shield className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <Badge
            variant="outline"
            className={cn(
              'px-1.5 py-0 rounded-md text-[9px] font-medium border',
              isDark
                ? `${riskConfig.bgDark} ${riskConfig.textDark} border-transparent`
                : `${riskConfig.bgLight} ${riskConfig.textLight} border-transparent`
            )}
          >
            {riskConfig.label}
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className={cn('p-2.5 rounded-xl', 'bg-[var(--app-hover-bg)]')}>
          <p className={cn('text-[9px] font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Revenue</p>
          <p className="text-xs font-bold tabular-nums text-emerald-500">{formatAmount(revenue)}</p>
        </div>
        <div className={cn('p-2.5 rounded-xl', 'bg-[var(--app-hover-bg)]')}>
          <p className={cn('text-[9px] font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Cost</p>
          <p className="text-xs font-bold tabular-nums text-red-500">{formatAmount(cost)}</p>
        </div>
        <div className={cn('p-2.5 rounded-xl', 'bg-[var(--app-hover-bg)]')}>
          <p className={cn('text-[9px] font-medium mb-0.5', 'text-[var(--app-text-muted)]')}>Profit</p>
          <p className={cn('text-xs font-bold tabular-nums', getMarginColor(margin, isDark))}>
            {formatAmount(profit)}
          </p>
        </div>
      </div>

      {/* Margin bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>Margin</span>
          <div className="flex items-center gap-1">
            <span className={cn('text-xs font-bold', getMarginColor(margin, isDark))}>{margin.toFixed(1)}%</span>
            <span className={cn(
              'flex items-center text-[10px] font-medium',
              isPositiveTrend
                ? 'text-emerald-500'
                : 'text-[var(--app-danger)]'
            )}>
              {isPositiveTrend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className={cn('w-full h-2 rounded-full overflow-hidden', getMarginBarBg(margin, isDark))}>
          <motion.div
            className={cn('h-full rounded-full', getMarginBarColor(margin))}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Risk indicator */}
      {margin < 20 && (
        <div className={cn(
          'flex items-center gap-1.5 p-2 rounded-xl',
          isDark ? 'bg-red-500/[0.06]' : 'bg-red-50'
        )}>
          <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
          <p className={cn('text-[10px]', 'text-[var(--app-danger)]')}>
            Low margin — review pricing or reduce costs
          </p>
        </div>
      )}
    </motion.div>
  );
}
