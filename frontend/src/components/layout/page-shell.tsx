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
  /** Optional action buttons rendered on the right side of the header */
  actions?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Extra class for content area */
  className?: string;
  /** Whether this page should have padding (default: true) */
  padded?: boolean;
}

function PageShellInner({
  title,
  icon: Icon,
  subtitle,
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
          'flex items-center justify-between gap-4',
          padded && 'px-6 pt-6 pb-2'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ backgroundColor: CSS.accentLight }}
            >
              <Icon
                className="w-[18px] h-[18px]"
                style={{ color: CSS.accent }}
              />
            </div>
          )}
          <div className="min-w-0">
            <h1
              className="text-[15px] font-semibold truncate"
              style={{ color: CSS.text }}
            >
              {title}
            </h1>
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
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.duration.normal, delay: 0.05 }}
        className={cn(
          'flex-1 overflow-y-auto custom-scrollbar',
          padded && 'px-6 pb-6',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const PageShell = memo(PageShellInner);
