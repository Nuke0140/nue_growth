'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CohortData {
  cohortLabel: string;
  size: number;
  periods: { period: number; retention: number }[];
}

interface CohortHeatmapProps {
  data: CohortData[];
  title?: string;
  metric?: 'retention' | 'ltv' | 'churn';
}

const metricLabel: Record<string, string> = {
  retention: 'Retention %',
  ltv: 'LTV $',
  churn: 'Churn %',
};

/**
 * Returns an HSL color based on the value.
 * For retention/LTV: 0 = red, 100 = green
 * For churn: 0 = green, 100 = red (inverted)
 */
function getHeatColor(value: number, metric: string, isDark: boolean): string {
  const clamped = Math.max(0, Math.min(100, value));
  const isInverted = metric === 'churn';
  const t = isInverted ? 1 - clamped / 100 : clamped / 100;

  // Interpolate hue: 0 (red) → 45 (orange) → 90 (yellow-green) → 140 (green)
  const hue = t * 140;
  const saturation = isDark ? 55 : 60;
  const lightness = isDark ? 25 + t * 15 : 55 + t * 15;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getTextColor(value: number, isDark: boolean): string {
  if (value < 20) return isDark ? 'text-zinc-300' : 'text-zinc-800';
  if (value < 60) return 'text-[var(--app-text)]';
  return 'text-white';
}

export default function CohortHeatmap({
  data,
  title,
  metric = 'retention',
}: CohortHeatmapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    cohort: string;
    period: number;
    value: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPeriods = data.reduce((max, d) => Math.max(max, d.periods.length), 0);

  const handleCellEnter = useCallback(
    (e: React.MouseEvent, cohort: string, period: number, value: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltip({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          cohort,
          period,
          value,
        });
      }
    },
    [],
  );

  const handleCellLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Legend steps
  const legendSteps = [0, 20, 40, 60, 80, 100];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={containerRef}
      className={cn(
        'rounded-2xl border shadow-sm p-4 sm:p-5',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
      )}
    >
      {/* Title */}
      {title && (
        <div className="mb-4">
          <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
            {title}
          </h3>
          <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
            {metricLabel[metric] ?? 'Retention %'}
          </p>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
        <div className="min-w-[500px]">
          {/* Header Row */}
          <div
            className="grid gap-0.5 mb-0.5"
            style={{
              gridTemplateColumns: `120px repeat(${maxPeriods}, 1fr)`,
            }}
          >
            <div
              className={cn(
                'text-[10px] font-medium uppercase tracking-wider py-1',
                'text-[var(--app-text-muted)]',
              )}
            >
              Cohort
            </div>
            {Array.from({ length: maxPeriods }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wider text-center py-1',
                  'text-[var(--app-text-muted)]',
                )}
              >
                P{i + 1}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {data.map((cohort) => (
            <div
              key={cohort.cohortLabel}
              className="grid gap-0.5 mb-0.5"
              style={{
                gridTemplateColumns: `120px repeat(${maxPeriods}, 1fr)`,
              }}
            >
              {/* Cohort Label */}
              <div className="flex items-center gap-1.5 py-1 min-w-0">
                <span
                  className={cn(
                    'text-xs font-medium truncate',
                    'text-[var(--app-text-secondary)]',
                  )}
                >
                  {cohort.cohortLabel}
                </span>
                <span
                  className={cn(
                    'text-[9px] shrink-0',
                    'text-[var(--app-text-muted)]',
                  )}
                >
                  ({cohort.size.toLocaleString()})
                </span>
              </div>

              {/* Period Cells */}
              {cohort.periods.map((p) => (
                <div
                  key={p.period}
                  className={cn(
                    'relative rounded-md flex items-center justify-center py-1.5 text-xs font-semibold cursor-default transition-transform hover:scale-105',
                    getTextColor(p.retention, isDark),
                  )}
                  style={{
                    backgroundColor: getHeatColor(p.retention, metric, isDark),
                  }}
                  onMouseEnter={(e) =>
                    handleCellEnter(e, cohort.cohortLabel, p.period, p.retention)
                  }
                  onMouseLeave={handleCellLeave}
                >
                  {p.retention.toFixed(1)}%
                </div>
              ))}

              {/* Empty cells for missing periods */}
              {Array.from(
                { length: maxPeriods - cohort.periods.length },
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={cn(
                      'rounded-md py-1.5',
                      'bg-[var(--app-hover-bg)]',
                    )}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className={cn(
            'pointer-events-none absolute z-50 rounded-lg border px-3 py-2 text-xs shadow-lg',
            isDark
              ? 'bg-zinc-800 border-white/[0.1] text-zinc-200'
              : 'bg-white border-black/[0.08] text-zinc-800',
          )}
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
          }}
        >
          <p className="font-semibold">{tooltip.cohort}</p>
          <p>
            Period {tooltip.period}: {tooltip.value.toFixed(1)}%
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <span className={cn('text-[10px] font-medium mr-1', 'text-[var(--app-text-muted)]')}>
          Low
        </span>
        {legendSteps.map((step) => (
          <div
            key={step}
            className="h-3 w-6 rounded-sm first:rounded-l-md last:rounded-r-md"
            style={{
              backgroundColor: getHeatColor(step, metric, isDark),
            }}
          />
        ))}
        <span className={cn('text-[10px] font-medium ml-1', 'text-[var(--app-text-muted)]')}>
          High
        </span>
      </div>
    </motion.div>
  );
}
