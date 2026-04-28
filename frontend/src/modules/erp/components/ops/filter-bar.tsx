'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)}>
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;
        return (
          <motion.button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors'
            )}
            style={{
              backgroundColor: isActive
                ? 'var(--ops-accent)'
                : 'transparent',
              color: isActive
                ? '#ffffff'
                : 'var(--ops-text-secondary)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                className="ops-badge text-[10px] leading-none"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.06)',
                  color: isActive
                    ? '#ffffff'
                    : 'var(--ops-text-muted)',
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
}
