'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Activity {
  id: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  time: string;
  color?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  maxItems?: number;
}

function relativeTimeLabel(time: string): string {
  return time; // Pass through — caller should format
}

export function ActivityFeed({
  activities,
  className,
  maxItems,
}: ActivityFeedProps) {
  const items = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className={cn('flex flex-col', className)}>
      {items.length === 0 && (
        <p
          className="text-sm text-center py-8"
          style={{ color: 'var(--ops-text-muted)' }}
        >
          No recent activity
        </p>
      )}
      {items.map((activity, idx) => {
        const Icon = activity.icon;
        const accentColor = activity.color || 'var(--ops-accent)';

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {/* Timeline line */}
            {idx < items.length - 1 && (
              <div
                className="absolute left-[15px] top-8 bottom-0 w-px"
                style={{ backgroundColor: 'var(--ops-border)' }}
              />
            )}

            {/* Icon dot */}
            <div
              className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
              style={{ backgroundColor: `${accentColor}18` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: 'var(--ops-text)' }}
              >
                {activity.title}
              </p>
              {activity.description && (
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: 'var(--ops-text-muted)' }}
                >
                  {activity.description}
                </p>
              )}
              <p
                className="text-[11px] mt-1"
                style={{ color: 'var(--ops-text-muted)' }}
              >
                {relativeTimeLabel(activity.time)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
