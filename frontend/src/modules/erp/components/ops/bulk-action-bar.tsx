'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { ANIMATION } from '../../design-tokens';

// ── Types ──────────────────────────────────────────────

interface BulkAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  className?: string;
}

// ── Bulk Action Bar ────────────────────────────────────

export const BulkActionBar = React.memo(function BulkActionBar({
  selectedCount,
  actions,
  onClear,
  className,
}: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={ANIMATION.springGentle}
          className={cn(
            'fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50',
            className
          )}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl"
            role="toolbar"
            aria-label="Bulk actions"
            style={{
              backgroundColor: 'rgba(34, 35, 37, 0.92)',
              border: '1px solid var(--ops-border)',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Selected count */}
            <div className="flex items-center gap-2 mr-2" role="status" aria-label={`${selectedCount} items selected`} aria-live="polite">
              <span
                className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: 'var(--ops-accent)',
                  color: '#ffffff',
                }}
              >
                {selectedCount}
              </span>
              <span
                className="text-sm font-medium hidden sm:inline"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                selected
              </span>
            </div>

            {/* Divider */}
            <div
              className="w-px h-6 shrink-0"
              style={{ backgroundColor: 'var(--ops-border)' }}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              {actions.map((action) => {
                const Icon = action.icon;
                const isDanger = action.variant === 'danger';

                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        action.onClick();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      color: isDanger
                        ? 'var(--ops-danger)'
                        : 'var(--ops-text-secondary)',
                      backgroundColor: isDanger
                        ? 'rgba(248, 113, 113, 0.08)'
                        : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        isDanger
                          ? 'rgba(248, 113, 113, 0.15)'
                          : 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        isDanger
                          ? 'rgba(248, 113, 113, 0.08)'
                          : 'transparent';
                    }}
                    aria-label={action.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className="w-px h-6 shrink-0"
              style={{ backgroundColor: 'var(--ops-border)' }}
            />

            {/* Clear selection */}
            <button
              onClick={onClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClear();
                }
              }}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--ops-text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
