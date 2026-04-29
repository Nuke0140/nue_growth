'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';

// ── Types ──────────────────────────────────────────────

export interface FilterItem {
  /** Unique filter key */
  key: string;
  /** Display label */
  label: string;
  /** Optional count badge */
  count?: number;
}

export interface FilterBarProps {
  /** Array of filter options */
  filters: FilterItem[];
  /** Currently active filter key */
  activeFilter: string;
  /** Callback when a filter is selected */
  onFilterChange: (key: string) => void;
  /** Additional class name */
  className?: string;
}

// ── Component ──────────────────────────────────────────

export const FilterBar = memo(function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterBarProps) {
  const handleKeyDown = useCallback(
    (key: string, filterKey: string) => {
      if (key === 'Enter' || key === ' ') {
        onFilterChange(filterKey);
      }
    },
    [onFilterChange],
  );

  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)}
      role="tablist"
      aria-label="Filter options"
    >
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;

        return (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            onKeyDown={(e) => handleKeyDown(e.key, filter.key)}
            className={cn(
              'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            )}
            style={{
              backgroundColor: isActive ? CSS.accent : 'transparent',
              color: isActive ? '#ffffff' : CSS.textSecondary,
            }}
            whileTap={{ scale: 0.97 }}
            role="tab"
            tabIndex={0}
            aria-label={`${filter.label}${filter.count !== undefined ? ` (${filter.count})` : ''}`}
            aria-selected={isActive}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                className="text-[10px] leading-none min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.2)'
                    : CSS.hoverBg,
                  color: isActive ? '#ffffff' : CSS.textMuted,
                }}
              >
                {filter.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
});

export default FilterBar;
