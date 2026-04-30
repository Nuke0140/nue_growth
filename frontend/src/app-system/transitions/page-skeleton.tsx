'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PageSkeletonProps {
  rows?: number;
  className?: string;
}

export function PageSkeleton({ rows = 5, className }: PageSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full space-y-app-2xl p-6',
        className
      )}
      aria-label="Loading page content"
      aria-busy="true"
    >
      {/* Title bar skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Action bar skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10  w-24 rounded-[var(--app-radius-md)]" />
        <Skeleton className="h-10  w-24 rounded-[var(--app-radius-md)]" />
        <div className="flex-1" />
        <Skeleton className="h-10  w-32 rounded-[var(--app-radius-md)]" />
      </div>

      {/* Content card skeletons */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-[var(--app-radius-lg)] border p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageSkeleton;
