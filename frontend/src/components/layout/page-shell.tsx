'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';

export interface PageShellProps {
  /** Page title shown in header */
  title: string;
  /** Optional icon component (LucideIcon) */
  icon?: LucideIcon;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional filter bar below header */
  filters?: React.ReactNode;
  /** Optional action buttons rendered on the right side of the header */
  actions?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Extra class for content area */
  className?: string;
  /** Whether this page should have padding (default: true) */
  padded?: boolean;
}

/**
 * PageShell — Standard page wrapper for ALL module pages.
 *
 * Layout structure:
 *   <PageShell>
 *     Header (title + icon + actions)
 *     Filters (optional)
 *     Content (scrollable)
 *   </PageShell>
 *
 * Spacing: uses app-* token scale for consistency.
 * Typography: headingLg for title, caption for subtitle.
 * Radius: token-based via CSS vars.
 */
function PageShellInner({
  title,
  icon: Icon,
  subtitle,
  filters,
  actions,
  children,
  className,
  padded = true,
}: PageShellProps) {
  return (
    <div className={cn('flex flex-col h-full overflow-hidden')}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION.duration.normal,
          ease: ANIMATION.ease as unknown as number[],
        }}
        className={cn(
          'flex items-center justify-between gap-app-lg',
          padded && 'px-app-2xl pt-app-2xl pb-app-sm'
        )}
      >
        <div className="flex items-center gap-app-md min-w-0">
          {Icon && (
            <div
              className="flex items-center justify-center w-9 h-10  rounded-[var(--app-radius-lg)] shrink-0"
              style={{ backgroundColor: CSS.accentLight }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: CSS.accent }}
              />
            </div>
          )}
          <div className="min-w-0">
            <h1
              className="text-xl font-semibold truncate"
              style={{ color: CSS.text }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-xs mt-0.5 truncate"
                style={{ color: CSS.textMuted }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-app-sm shrink-0">{actions}</div>
        )}
      </motion.div>

      {/* Filters (optional) */}
      {filters && (
        <div className={cn(
          'flex items-center gap-app-md',
          padded && 'px-app-2xl py-app-sm'
        )}>
          {filters}
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.duration.normal, delay: 0.05 }}
        className={cn(
          'flex-1 overflow-y-auto app-scrollbar',
          padded && 'px-app-2xl pb-app-2xl',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const PageShell = memo(PageShellInner);
