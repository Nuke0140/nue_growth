'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CohortRow {
  cohort: string;
  customers: number;
  retention: number[];
}

interface CohortHeatmapProps {
  data: CohortRow[];
}

function getCellColor(value: number) {
  if (value >= 80) return 'bg-emerald-500/70';
  if (value >= 60) return 'bg-emerald-400/50';
  if (value >= 40) return 'bg-emerald-300/35';
  if (value >= 20) return 'bg-amber-300/35';
  return 'bg-red-300/35';
}

export default function CohortHeatmap({ data }: CohortHeatmapProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  if (!data.length) return null;

  const months = data[0].retention.map((_, i) => `M${i + 1}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5 overflow-x-auto',
        'bg-[var(--app-card-bg)] border-[var(--app-border)]'
      )}
    >
      <table className="min-w-full">
        <thead>
          <tr>
            <th className={cn('text-left text-[10px] font-semibold pb-3 pr-4', 'text-[var(--app-text-muted)]')}>
              Cohort
            </th>
            <th className={cn('text-right text-[10px] font-semibold pb-3 px-2', 'text-[var(--app-text-muted)]')}>
              Size
            </th>
            {months.map((m) => (
              <th key={m} className={cn('text-center text-[10px] font-semibold pb-3 px-1.5', 'text-[var(--app-text-muted)]')}>
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.cohort}>
              <td className={cn('text-xs font-medium py-1.5 pr-4', 'text-[var(--app-text)]')}>
                {row.cohort}
              </td>
              <td className={cn('text-xs text-right py-1.5 px-2 tabular-nums', 'text-[var(--app-text-muted)]')}>
                {row.customers}
              </td>
              {row.retention.map((val, colIdx) => (
                <td key={colIdx} className="py-1.5 px-1.5">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={cn(
                      'flex items-center justify-center h-8 rounded-lg text-[11px] font-medium cursor-default transition-colors relative',
                      getCellColor(val),
                      'text-[var(--app-text)]'
                    )}
                  >
                    {val}%
                    {hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] whitespace-nowrap z-10',
                          'bg-[var(--app-card-bg)] text-[var(--app-text)]'
                        )}
                      >
                        {row.cohort} · M{colIdx + 1}: {val}% retained
                      </motion.div>
                    )}
                  </motion.div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
