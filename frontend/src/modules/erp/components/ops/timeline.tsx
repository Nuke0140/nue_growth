'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface TimelineItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  timestamp: string;
  accentColor?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

// ── Timeline ───────────────────────────────────────────

const DEFAULT_VISIBLE = 10;

export function Timeline({ items, className }: TimelineProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleCount = expanded ? items.length : DEFAULT_VISIBLE;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = items.length > DEFAULT_VISIBLE;

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-12"
        style={{ color: 'var(--app-text-muted)' }}
      >
        <p className="text-sm">No timeline events</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <AnimatePresence initial={false}>
        {visibleItems.map((item, idx) => {
          const Icon = item.icon;
          const color = item.accentColor || 'var(--app-accent)';
          const isLast = idx === visibleItems.length - 1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="relative flex gap-4"
            >
              {/* Timeline rail */}
              <div className="flex flex-col items-center shrink-0">
                {/* Dot */}
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full relative z-10"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                {/* Vertical line */}
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 + 0.1 }}
                    className="w-px flex-1 origin-top"
                    style={{ backgroundColor: 'var(--app-border)', minHeight: '16px' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-6 last:pb-0">
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: 'var(--app-text)' }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: 'var(--app-text-secondary)' }}
                  >
                    {item.description}
                  </p>
                )}
                <p
                  className="text-[11px] mt-1.5"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  {item.timestamp}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Show more / less toggle */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center pt-2"
        >
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="ops-btn-ghost text-xs px-4 py-1.5"
            style={{
              borderRadius: '9999px',
              border: '1px solid var(--app-border)',
              color: 'var(--app-accent)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'var(--app-accent-light)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {expanded
              ? 'Show less'
              : `Show more (${items.length - DEFAULT_VISIBLE} remaining)`}
          </button>
        </motion.div>
      )}
    </div>
  );
}
