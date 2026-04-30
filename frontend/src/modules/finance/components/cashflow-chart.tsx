'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────
function formatAmount(value: number) {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function shortDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

// ─── Component ────────────────────────────────────────────
interface CashflowDataPoint {
  date: string;
  inflow: number;
  outflow: number;
  closingBalance: number;
}

interface CashflowChartProps {
  data: CashflowDataPoint[];
}

export default function CashflowChart({ data }: CashflowChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { maxVal, netValues } = useMemo(() => {
    const allValues = data.flatMap((d) => [d.inflow, d.outflow]);
    const max = Math.max(...allValues, 1);
    const net = data.map((d) => d.inflow - d.outflow);
    return { maxVal: max, netValues: net };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}>
        <p className={cn('text-xs text-center py-app-3xl', 'text-[var(--app-text-muted)]')}>
          No cashflow data available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[var(--app-radius-xl)] border p-app-xl',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      {/* Chart area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-14 flex flex-col justify-between text-right pr-2">
          <span className={cn('text-[9px] tabular-nums', 'text-[var(--app-text-muted)]')}>
            {formatAmount(maxVal)}
          </span>
          <span className={cn('text-[9px] tabular-nums', 'text-[var(--app-text-muted)]')}>
            {formatAmount(maxVal / 2)}
          </span>
          <span className={cn('text-[9px] tabular-nums', 'text-[var(--app-text-muted)]')}>₹0</span>
        </div>

        {/* Bars */}
        <div className="ml-16 flex items-end gap-1.5 h-44 pb-6 relative">
          {/* Grid lines */}
          <div className={cn('absolute top-0 left-0 right-0 h-px', 'bg-[var(--app-hover-bg)]')} />
          <div className={cn('absolute top-1/2 left-0 right-0 h-px', 'bg-[var(--app-hover-bg)]')} />
          <div className={cn('absolute bottom-6 left-0 right-0 h-px', 'bg-[var(--app-hover-bg)]')} />

          {data.map((item, i) => {
            const inflowH = (item.inflow / maxVal) * 100;
            const outflowH = (item.outflow / maxVal) * 100;
            const net = netValues[i];

            return (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-0.5 relative">
                {/* Net indicator */}
                <div className="flex items-center justify-center h-3 mb-0.5">
                  {net >= 0 ? (
                    <ArrowUp className="w-2.5 h-2.5 text-emerald-500" />
                  ) : (
                    <ArrowDown className="w-2.5 h-2.5 text-red-500" />
                  )}
                </div>

                {/* Bar group */}
                <div className="flex items-end gap-0.5 w-full flex-1">
                  <motion.div
                    className="flex-1 rounded-t-[var(--app-radius-md)] bg-emerald-500 min-h-[2px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${inflowH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="flex-1 rounded-t-[var(--app-radius-md)] bg-rose-500 min-h-[2px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${outflowH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 + 0.05, ease: 'easeOut' }}
                  />
                </div>

                {/* Date label */}
                <span className={cn('text-[9px] tabular-nums mt-1.5', 'text-[var(--app-text-muted)]')}>
                  {shortDate(item.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 pt-3 border-t border-dashed"
        style={{ borderColor: 'var(--app-border)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[var(--app-radius-sm)] bg-emerald-500" />
          <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>Inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[var(--app-radius-sm)] bg-rose-500" />
          <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>Outflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUp className="w-2.5 h-2.5 text-emerald-500" />
          <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>Net positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowDown className="w-2.5 h-2.5 text-red-500" />
          <span className={cn('text-[10px]', 'text-[var(--app-text-secondary)]')}>Net negative</span>
        </div>
      </div>
    </motion.div>
  );
}
