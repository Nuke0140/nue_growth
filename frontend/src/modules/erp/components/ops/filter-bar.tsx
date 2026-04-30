'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ANIMATION } from '@/styles/design-tokens';

interface FilterItem {
  key: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  filters: FilterItem[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
  className?: string;
}

export const FilterBar = React.memo(function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterBarProps) {
  const handleKeyDown = useCallback((key: string, filterKey: string) => {
    if (key === 'Enter' || key === ' ') {
      onFilterChange(filterKey);
    }
  }, [onFilterChange]);

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)} role="tablist" aria-label="Filter options">
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;
        return (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            onKeyDown={(e) => handleKeyDown(e.key, filter.key)}
            className={cn(
              'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors'
            )}
            style={{
              backgroundColor: isActive
                ? 'var(--app-accent)'
                : 'transparent',
              color: isActive
                ? '#ffffff'
                : 'var(--app-text-secondary)',
            }}
            whileTap={{ scale: 0.97 }}
            role="button"
            tabIndex={0}
            aria-label={`${filter.label}${filter.count !== undefined ? ` (${filter.count})` : ''}`}
            aria-pressed={isActive}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                className="ops-badge text-[10px] leading-none"
                style={{
                  backgroundColor: isActive
                    ? 'var(--app-text-disabled)'
                    : 'var(--app-hover-bg)',
                  color: isActive
                    ? '#ffffff'
                    : 'var(--app-text-muted)',
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
