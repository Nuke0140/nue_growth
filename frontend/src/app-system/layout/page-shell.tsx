'use client';

import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDensity } from '@/app-system/density/use-density';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface PageShellProps {
  /** Optional page title shown in the sticky title bar */
  title?: string;
  /** Optional actions rendered in the title bar (right side) */
  actions?: React.ReactNode;
  /** Main page content */
  children: React.ReactNode;
  /** Optional additional class names for the root container */
  className?: string;
  /** Whether to show a bottom border on the title bar */
  bordered?: boolean;
  /** Optional title bar content override (full control of the header area) */
  titleBar?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Density-aware padding map
// ---------------------------------------------------------------------------
function getDensityPadding(isCompact: boolean) {
  return isCompact ? 'p-3' : 'p-6';
}

function getDensityTitlePadding(isCompact: boolean) {
  return isCompact ? 'px-4 py-2' : 'px-6 py-3';
}

// ---------------------------------------------------------------------------
// PageShell component
// ---------------------------------------------------------------------------
function PageShellInner({
  title,
  actions,
  children,
  className,
  bordered = true,
  titleBar,
}: PageShellProps) {
  const isCompact = useDensity((s) => s.isCompact);

  const contentPadding = useMemo(
    () => getDensityPadding(isCompact),
    [isCompact],
  );

  const titlePadding = useMemo(
    () => getDensityTitlePadding(isCompact),
    [isCompact],
  );

  const hasTitleBar = title || actions || titleBar;

  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col', className)}
    >
      {/* Sticky title bar */}
      {hasTitleBar && (
        <header
          className={cn(
            'sticky top-0 z-10 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            titlePadding,
            bordered && 'border-b',
          )}
        >
          {titleBar ?? (
            <>
              {title && (
                <h1 className="text-lg font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {actions && (
                <div className="flex items-center gap-2">{actions}</div>
              )}
            </>
          )}
        </header>
      )}

      {/* Scrollable content area */}
      <div
        className={cn(
          'flex-1 overflow-y-auto',
          contentPadding,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const PageShell = memo(PageShellInner);
