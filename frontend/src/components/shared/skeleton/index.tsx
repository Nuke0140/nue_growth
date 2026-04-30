'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CSS } from '@/styles/design-tokens';

// ── Shared skeleton base ───────────────────────────────

const SKELETON_BASE = 'animate-pulse rounded-[var(--app-radius-xl)]';

// ── SkeletonCard ───────────────────────────────────────

export interface SkeletonCardProps {
  className?: string;
  lines?: number;
  hasAvatar?: boolean;
  hasImage?: boolean;
}

export function SkeletonCard({
  className,
  lines = 3,
  hasAvatar = false,
  hasImage = false,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(SKELETON_BASE, 'p-6', className)}
      style={{
        backgroundColor: CSS.hoverBg,
      }}
    >
      {/* Optional image placeholder */}
      {hasImage && (
        <div
          className="w-full h-32 rounded-[var(--app-radius-lg)] mb-4 animate-pulse"
          style={{ backgroundColor: CSS.hoverBg }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Optional avatar */}
        {hasAvatar && (
          <div
            className="w-9 h-10  rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: CSS.hoverBg }}
          />
        )}

        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Title line */}
          <div
            className="h-4 w-3/5 rounded-[var(--app-radius-lg)] animate-pulse"
            style={{ backgroundColor: CSS.borderStrong }}
          />
          {/* Body lines */}
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 rounded-[var(--app-radius-lg)] animate-pulse',
                i === lines - 1 ? 'w-2/5' : 'w-full'
              )}
              style={{ backgroundColor: CSS.hoverBg }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SkeletonTable ──────────────────────────────────────

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(SKELETON_BASE, 'p-4', className)}
      style={{ backgroundColor: CSS.hoverBg }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-4 pb-3 mb-3"
        style={{ borderBottom: `1px solid ${CSS.border}` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`head-${i}`}
            className="h-3 rounded-[var(--app-radius-lg)] animate-pulse"
            style={{
              width: `${60 + ((i * 17) % 40)}%`,
              backgroundColor: CSS.borderStrong,
            }}
          />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`row-${r}`}
          className="flex items-center gap-4 py-2.5"
          style={{
            borderBottom:
              r < rows - 1 ? `1px solid ${CSS.border}` : undefined,
          }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={`cell-${r}-${c}`}
              className="h-3 rounded-[var(--app-radius-lg)] animate-pulse"
              style={{
                width: `${50 + ((c * 19 + r * 7) % 50)}%`,
                backgroundColor: CSS.hoverBg,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── SkeletonKPI ────────────────────────────────────────

export interface SkeletonKPIProps {
  className?: string;
}

export function SkeletonKPI({ className }: SkeletonKPIProps) {
  return (
    <div
      className={cn(SKELETON_BASE, 'p-6', className)}
      style={{ backgroundColor: CSS.hoverBg }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="h-3 w-24 rounded-[var(--app-radius-lg)] animate-pulse" style={{ backgroundColor: CSS.borderStrong }} />
          <div className="h-8 w-20 rounded-[var(--app-radius-lg)] animate-pulse" style={{ backgroundColor: CSS.borderStrong }} />
          <div className="h-3 w-16 rounded-[var(--app-radius-lg)] animate-pulse" style={{ backgroundColor: CSS.hoverBg }} />
        </div>
        <div className="w-11 h-10  rounded-[var(--app-radius-lg)] animate-pulse shrink-0" style={{ backgroundColor: CSS.hoverBg }} />
      </div>
    </div>
  );
}

// ── SkeletonDashboard ──────────────────────────────────

export interface SkeletonDashboardProps {
  className?: string;
}

export function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonKPI />
        <SkeletonKPI />
        <SkeletonKPI />
        <SkeletonKPI />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large card (table) */}
        <div className="lg:col-span-2">
          <SkeletonTable rows={6} columns={4} />
        </div>
        {/* Side cards */}
        <div className="flex flex-col gap-4">
          <SkeletonCard lines={2} hasAvatar />
          <SkeletonCard lines={4} hasAvatar />
        </div>
      </div>
    </div>
  );
}
