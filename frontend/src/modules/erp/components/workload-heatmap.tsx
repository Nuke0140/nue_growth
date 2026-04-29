'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, User, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkloadItem } from '../types';

// ─── Helpers ──────────────────────────────────────────────
function getCellColor(allocation: number) {
  if (allocation === 0) return 'bg-[var(--ops-hover-bg)]';
  if (allocation <= 50) return 'bg-emerald-200 dark:bg-emerald-500/20';
  if (allocation <= 80) return 'bg-amber-200 dark:bg-amber-500/25';
  return 'bg-red-200 dark:bg-red-500/25';
}

function getCellTextColor(allocation: number) {
  if (allocation === 0) return 'text-[var(--ops-text-disabled)]';
  if (allocation <= 50) return 'text-emerald-800 dark:text-emerald-300';
  if (allocation <= 80) return 'text-amber-800 dark:text-amber-300';
  return 'text-red-800 dark:text-red-300';
}

// ─── Component ────────────────────────────────────────────
interface WorkloadHeatmapProps {
  items: WorkloadItem[];
}

export default function WorkloadHeatmap({ items }: WorkloadHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Extract unique project names from all items
  const projectColumns = useMemo(() => {
    const projectSet = new Set<string>();
    items.forEach((item) => {
      item.projects.forEach((p) => projectSet.add(p));
    });
    return Array.from(projectSet).slice(0, 10); // max 10 columns
  }, [items]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const overloaded = items.filter((i) => i.allocation > 80).length;
    const optimal = items.filter((i) => i.allocation >= 40 && i.allocation <= 80).length;
    const underutilized = items.filter((i) => i.allocation > 0 && i.allocation < 40).length;
    const free = items.filter((i) => i.allocation === 0).length;
    const avgAllocation = items.length > 0 ? Math.round(items.reduce((s, i) => s + i.allocation, 0) / items.length) : 0;
    return { overloaded, optimal, underutilized, free, avgAllocation };
  }, [items]);

  // Tooltip content
  const getTooltipContent = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) return null;
    const item = items[rowIndex];
    if (!item) return null;
    return { name: item.name.split(' ')[0], allocation: item.allocation, overtime: item.overtime, status: item.status };
  };

  const tooltipData = hoveredCell ? getTooltipContent(hoveredCell.row, hoveredCell.col) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border p-5 shadow-sm',
        'bg-[var(--ops-card-bg)] border-[var(--ops-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[var(--ops-text-secondary)]" />
          <h3 className="text-sm font-semibold">Workload Heatmap</h3>
        </div>
        <span className="text-[10px] font-medium text-[var(--ops-text-disabled)]">
          {items.length} employees · {projectColumns.length} projects
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        <div className="p-2 rounded-lg text-center bg-[var(--ops-hover-bg)]">
          <p className="text-[9px] mb-0.5 text-[var(--ops-text-disabled)]">Avg Allocation</p>
          <p className="text-sm font-bold">{summaryStats.avgAllocation}%</p>
        </div>
        <div className="p-2 rounded-lg text-center bg-red-50 dark:bg-red-500/[0.04]">
          <p className="text-[9px] mb-0.5 text-red-500">Overloaded</p>
          <p className="text-sm font-bold text-red-500">{summaryStats.overloaded}</p>
        </div>
        <div className="p-2 rounded-lg text-center bg-amber-50 dark:bg-amber-500/[0.04]">
          <p className="text-[9px] mb-0.5 text-amber-500">Optimal</p>
          <p className="text-sm font-bold text-amber-500">{summaryStats.optimal}</p>
        </div>
        <div className="p-2 rounded-lg text-center bg-emerald-50 dark:bg-emerald-500/[0.04]">
          <p className="text-[9px] mb-0.5 text-emerald-500">Under-util</p>
          <p className="text-sm font-bold text-emerald-500">{summaryStats.underutilized}</p>
        </div>
        <div className="p-2 rounded-lg text-center bg-[var(--ops-hover-bg)]">
          <p className="text-[9px] mb-0.5 text-[var(--ops-text-disabled)]">Free</p>
          <p className="text-sm font-bold">{summaryStats.free}</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Column Headers (Projects) */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `140px repeat(${projectColumns.length}, 1fr)` }}>
            <div className="text-[10px] font-medium py-1 text-[var(--ops-text-disabled)]">
              <User className="w-3 h-3 inline mr-1" />
              Employee
            </div>
            {projectColumns.map((proj) => (
              <div
                key={proj}
                className="text-[9px] font-medium py-1 text-center truncate px-1 text-[var(--ops-text-disabled)]"
                title={proj}
              >
                {proj.length > 12 ? proj.slice(0, 12) + '…' : proj}
              </div>
            ))}
          </div>

          {/* Rows */}
          {items.map((item, rowIndex) => (
            <div
              key={item.id}
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: `140px repeat(${projectColumns.length}, 1fr)` }}
            >
              {/* Employee Name */}
              <div className={cn(
                'flex items-center text-[11px] font-medium py-2 px-1 truncate rounded-lg',
                'bg-[var(--ops-hover-bg)] text-[var(--ops-text-secondary)]'
              )}>
                {item.name}
              </div>

              {/* Allocation Cells */}
              {projectColumns.map((proj, colIndex) => {
                const isProjectAssigned = item.projects.includes(proj);
                const cellAllocation = isProjectAssigned ? Math.min(item.allocation, 100) : 0;

                return (
                  <motion.div
                    key={`${item.id}-${proj}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: (rowIndex * projectColumns.length + colIndex) * 0.01 }}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={cn(
                      'flex items-center justify-center text-[10px] font-medium rounded-lg py-2 cursor-default transition-all',
                      getCellColor(cellAllocation),
                      getCellTextColor(cellAllocation),
                      'dark:hover:brightness-125 hover:brightness-95'
                    )}
                  >
                    {isProjectAssigned ? `${cellAllocation}%` : '—'}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltipData && (
        <div className="absolute z-50 hidden" />
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--ops-hover-bg)]" />
          <span className="text-[10px] text-[var(--ops-text-muted)]">0% (Free)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-500/20" />
          <span className="text-[10px] text-[var(--ops-text-muted)]">1-50%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-500/25" />
          <span className="text-[10px] text-[var(--ops-text-muted)]">51-80%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-200 dark:bg-red-500/25" />
          <span className="text-[10px] text-[var(--ops-text-muted)]">81-100%</span>
        </div>
      </div>
    </motion.div>
  );
}
