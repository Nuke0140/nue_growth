'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION, CSS } from '@/styles/design-tokens';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { SkeletonDashboard } from '@/components/shared/skeleton';
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export type SkeletonType = 'table' | 'cards' | 'dashboard';

/** Icon type that accepts both Lucide icon components and inline render functions */
export type PageShellIcon = LucideIcon | (() => React.ReactElement);

export interface PageShellProps {
  /** Page title shown in header */
  title: string;
  /** Optional subtitle below the title (string or custom ReactNode) */
  subtitle?: React.ReactNode;
  /** Page icon component (LucideIcon or inline render function) */
  icon?: PageShellIcon;
  /** Optional badge count displayed next to the title */
  badge?: number;
  /** Custom content rendered on the right side of the header */
  headerRight?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Whether to show the "Create" button in the header */
  onCreate?: () => void;
  /** Label for the create button (default: "Create") */
  createLabel?: string;
  /** Whether content is empty (shows EmptyState) */
  isEmpty?: boolean;
  /** Empty state title (default: "No {title} yet") */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
  /** Empty state primary action label */
  emptyActionLabel?: string;
  /** Empty state primary action callback */
  emptyActionOnClick?: () => void;
  /** Additional class name for the content area */
  className?: string;
  /** Whether this page should have padding (default: true) */
  padded?: boolean;
  /** Loading state — shows skeleton while true */
  isLoading?: boolean;
  /** Skeleton variant: 'table' | 'cards' | 'dashboard' */
  skeletonType?: SkeletonType;
  /** Error state — shows error UI when set */
  error?: string | null;
  /** Retry callback for error state */
  onRetry?: () => void;
}

// ── Component ──────────────────────────────────────────

const PageShellInner = memo(function PageShellInner({
  title,
  subtitle,
  icon: Icon,
  badge,
  headerRight,
  children,
  onCreate,
  createLabel = 'Create',
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionOnClick,
  className,
  padded = true,
  isLoading = false,
  skeletonType = 'dashboard',
  error = null,
  onRetry,
}: PageShellProps) {
  // Derive the empty state primary action:
  // 1. Explicit action label + callback takes priority
  // 2. Fall back to the onCreate callback if provided
  const primaryAction =
    emptyActionLabel && emptyActionOnClick
      ? { label: emptyActionLabel, onClick: emptyActionOnClick }
      : onCreate
        ? { label: `${createLabel} ${title.toLowerCase()}`, onClick: onCreate }
        : undefined;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease as unknown as number[],
        }}
        className={cn(
          'flex items-center justify-between gap-4',
          padded && 'px-6 pt-6 pb-2',
        )}
      >
        {/* Left: icon + title */}
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ backgroundColor: CSS.accentLight }}
            >
              {'$$typeof' in Icon
                ? <Icon className="w-[18px] h-[18px]" style={{ color: CSS.accent }} aria-hidden="true" />
                : (Icon as () => React.ReactNode)()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="text-[15px] font-semibold truncate"
                style={{ color: CSS.text }}
              >
                {title}
              </h1>
              {badge !== undefined && badge > 0 && (
                <span
                  className="text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1.5 leading-none"
                  style={{
                    backgroundColor: CSS.accent,
                    color: '#ffffff',
                  }}
                  aria-label={`${badge} items`}
                >
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p
                className="text-[12px] mt-0.5 truncate"
                style={{ color: CSS.textMuted }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: custom actions + optional create button */}
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {onCreate && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreate}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: CSS.accent,
                color: '#ffffff',
              }}
              aria-label={`${createLabel} ${title.toLowerCase()}`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{createLabel}</span>
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* ── Content Area ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: ANIMATION.duration.normal,
          delay: 0.05,
        }}
        className={cn(
          'flex-1 overflow-y-auto custom-scrollbar',
          padded && 'px-6 pb-6',
          className,
        )}
      >
        {isLoading ? (
          <SkeletonDashboard />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={onRetry}
          />
        ) : isEmpty ? (
          <EmptyState
            title={emptyTitle || `No ${title.toLowerCase()} yet`}
            description={
              emptyDescription ||
              'Get started by creating your first item.'
            }
            illustration="getting-started"
            primaryAction={primaryAction}
          />
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
});

export const PageShell = PageShellInner;
export default PageShell;
