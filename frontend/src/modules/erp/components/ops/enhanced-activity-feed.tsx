'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  CheckSquare,
  CircleDot,
  User,
  FolderKanban,
  Users,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Filter,
  Clock,
  AlertTriangle,
  Zap,
  Inbox,
} from 'lucide-react';
import type { ActivityEvent, ActivityEventType } from '../../types';

// ── Types ──────────────────────────────────────────────

interface EnhancedActivityFeedProps {
  activities: ActivityEvent[];
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

type FilterCategory = 'all' | 'tasks' | 'projects' | 'people' | 'finance' | 'ai';

const CATEGORY_MAP: Record<FilterCategory, { entityType: string[]; icon: typeof CheckSquare; label: string }> = {
  all: { entityType: [], icon: Filter, label: 'All' },
  tasks: { entityType: ['task'], icon: CheckSquare, label: 'Tasks' },
  projects: { entityType: ['project'], icon: FolderKanban, label: 'Projects' },
  people: { entityType: ['employee', 'leave', 'approval'], icon: Users, label: 'People' },
  finance: { entityType: ['payroll', 'approval'], icon: DollarSign, label: 'Finance' },
  ai: { entityType: ['ai'], icon: Sparkles, label: 'AI' },
};

// ── Helpers ────────────────────────────────────────────

const TYPE_ICON_MAP: Partial<Record<ActivityEventType, { icon: typeof CheckSquare; color: string }>> = {
  task_created: { icon: CircleDot, color: '#3b82f6' },
  task_updated: { icon: CheckSquare, color: '#6366f1' },
  task_completed: { icon: CheckSquare, color: '#22c55e' },
  task_blocked: { icon: AlertTriangle, color: '#ef4444' },
  project_created: { icon: FolderKanban, color: '#8b5cf6' },
  project_updated: { icon: FolderKanban, color: '#a78bfa' },
  project_completed: { icon: FolderKanban, color: '#22c55e' },
  employee_created: { icon: User, color: '#06b6d4' },
  employee_updated: { icon: User, color: '#0891b2' },
  employee_status_changed: { icon: User, color: '#f59e0b' },
  leave_applied: { icon: Clock, color: '#f59e0b' },
  leave_approved: { icon: Clock, color: '#22c55e' },
  leave_rejected: { icon: Clock, color: '#ef4444' },
  approval_requested: { icon: CheckSquare, color: '#3b82f6' },
  approval_approved: { icon: CheckSquare, color: '#22c55e' },
  approval_rejected: { icon: CheckSquare, color: '#ef4444' },
  payroll_processed: { icon: DollarSign, color: '#22c55e' },
  payroll_paid: { icon: DollarSign, color: '#06b6d4' },
  asset_assigned: { icon: CheckSquare, color: '#6366f1' },
  asset_reported: { icon: AlertTriangle, color: '#f59e0b' },
  comment_added: { icon: User, color: 'var(--ops-text-secondary)' },
  ai_insight_generated: { icon: Sparkles, color: '#f59e0b' },
};

const CRITICAL_TYPES: Set<ActivityEventType> = new Set([
  'task_blocked',
  'ai_insight_generated',
]);

function relativeTime(ts: string): string {
  const now = Date.now();
  const then = new Date(ts).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ts).toLocaleDateString();
}

function isRecent(ts: string): boolean {
  return Date.now() - new Date(ts).getTime() < 30 * 60 * 1000; // 30 min
}

function getCategoryForEvent(event: ActivityEvent): FilterCategory {
  const map: Record<string, FilterCategory> = {
    task: 'tasks',
    project: 'projects',
    employee: 'people',
    leave: 'people',
    approval: 'finance',
    payroll: 'finance',
    ai: 'ai',
    asset: 'tasks',
  };
  return map[event.entityType] || 'all';
}

// ── Component ──────────────────────────────────────────

export function EnhancedActivityFeed({
  activities,
  maxItems,
  showFilters = true,
  compact = false,
}: EnhancedActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(maxItems || 10);

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: activities.length,
      tasks: 0,
      projects: 0,
      people: 0,
      finance: 0,
      ai: 0,
    };
    activities.forEach((e) => {
      const cat = getCategoryForEvent(e);
      counts[cat]++;
    });
    return counts;
  }, [activities]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return activities;
    const cat = CATEGORY_MAP[activeFilter];
    return activities.filter((e) => cat.entityType.includes(e.entityType));
  }, [activities, activeFilter]);

  const visibleItems = filtered.slice(0, visibleCount);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleFilterChange = useCallback((cat: FilterCategory) => {
    setActiveFilter(cat);
    setVisibleCount(maxItems || 10);
  }, [maxItems]);

  // ── Filter bar ─────────────────────────────────────
  const filterBar = showFilters && !compact && (
    <div
      className="flex items-center gap-1.5 p-1.5 overflow-x-auto"
      style={{
        backgroundColor: 'var(--ops-hover-bg)',
        borderRadius: 10,
        border: '1px solid var(--ops-border)',
      }}
    >
      {(Object.keys(CATEGORY_MAP) as FilterCategory[]).map((cat) => {
        const { icon: CatIcon, label } = CATEGORY_MAP[cat];
        const isActive = activeFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => handleFilterChange(cat)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-150 shrink-0'
            )}
            style={{
              backgroundColor: isActive
                ? 'var(--ops-accent-light)'
                : 'transparent',
              color: isActive
                ? 'var(--ops-accent)'
                : 'var(--ops-text-secondary)',
            }}
          >
            <CatIcon className="w-3.5 h-3.5" />
            {label}
            <span
              className={cn(
                'text-[9px] px-1.5 py-0.5 rounded-full font-semibold',
              )}
              style={{
                backgroundColor: isActive
                  ? 'rgba(204,92,55,0.2)'
                  : 'var(--ops-hover-bg)',
                color: isActive
                  ? 'var(--ops-accent)'
                  : 'var(--ops-text-muted)',
              }}
            >
              {categoryCounts[cat]}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      {filterBar}

      {/* Activity list */}
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {visibleItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Inbox
                className="w-8 h-8 mb-3"
                style={{ color: 'var(--ops-text-disabled)' }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--ops-text-muted)' }}
              >
                No activities found
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--ops-text-disabled)' }}
              >
                Try adjusting your filters
              </p>
            </motion.div>
          ) : (
            visibleItems.map((event, idx) => {
              const typeInfo = TYPE_ICON_MAP[event.type] || {
                icon: Zap,
                color: 'var(--ops-text-secondary)',
              };
              const Icon = typeInfo.icon;
              const isCritical = CRITICAL_TYPES.has(event.type);
              const isRecentEvent = isRecent(event.timestamp);
              const isExpanded = expandedIds.has(event.id);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  layout
                  className="relative"
                >
                  {/* Timeline connector */}
                  {idx < visibleItems.length - 1 && (
                    <div
                      className="absolute left-[15px] top-[32px] bottom-0 w-px"
                      style={{ backgroundColor: 'var(--ops-border)' }}
                    />
                  )}

                  <div
                    className={cn(
                      'relative flex gap-3 pb-4 group',
                      isCritical && 'pl-0'
                    )}
                    style={{
                      borderLeft: isCritical
                        ? '3px solid'
                        : '3px solid transparent',
                      borderLeftColor: isCritical
                        ? event.type === 'task_blocked'
                          ? '#ef4444'
                          : '#f59e0b'
                        : undefined,
                      paddingLeft: isCritical ? 12 : 0,
                      marginLeft: isCritical ? 3 : 0,
                    }}
                  >
                    {/* Icon dot */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${typeInfo.color}18`,
                        boxShadow: isRecentEvent
                          ? `0 0 12px ${typeInfo.color}30`
                          : undefined,
                      }}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: typeInfo.color }}
                      />
                      {isRecentEvent && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: `1.5px solid ${typeInfo.color}40` }}
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Main row */}
                      <div
                        className="flex items-start gap-2 cursor-pointer group"
                        onClick={() => toggleExpand(event.id)}
                      >
                        <div className="flex-1 min-w-0 pt-0.5">
                          {/* Actor + action */}
                          <p
                            className="text-[13px] leading-snug"
                            style={{ color: 'var(--ops-text)' }}
                          >
                            <span
                              className="font-semibold"
                              style={{ color: 'var(--ops-text)' }}
                            >
                              {event.actor}
                            </span>{' '}
                            {/* Parse title to highlight keywords */}
                            {event.title
                              .replace(
                                new RegExp(`^${event.actor}\\s+`),
                                ''
                              )
                              .split(/(".*?")/g)
                              .map((part, pi) =>
                                part.startsWith('"') && part.endsWith('"') ? (
                                  <span
                                    key={pi}
                                    className="font-semibold"
                                    style={{ color: 'var(--ops-accent)' }}
                                  >
                                    {part}
                                  </span>
                                ) : (
                                  <span key={pi}>{part}</span>
                                )
                              )}
                          </p>

                          {/* Entity link */}
                          <button
                            className="text-[11px] mt-0.5 hover:underline inline-flex items-center gap-1"
                            style={{ color: 'var(--ops-text-muted)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {event.entityType}:{event.entityId}
                          </button>

                          {/* Timestamp */}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock
                              className="w-3 h-3"
                              style={{ color: 'var(--ops-text-disabled)' }}
                            />
                            <span
                              className="text-[10px]"
                              style={{ color: 'var(--ops-text-disabled)' }}
                            >
                              {relativeTime(event.timestamp)}
                            </span>
                            {isRecentEvent && (
                              <span
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: 'rgba(34,197,94,0.12)',
                                  color: '#22c55e',
                                }}
                              >
                                NEW
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expand chevron */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 shrink-0"
                          style={{
                            color: 'var(--ops-text-disabled)',
                          }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mt-2 p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--ops-hover-bg)',
                                border: '1px solid var(--ops-border)',
                              }}
                            >
                              {/* Full description */}
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: 'var(--ops-text-secondary)' }}
                              >
                                {event.description}
                              </p>

                              {/* Metadata */}
                              {event.metadata && Object.keys(event.metadata).length > 0 && (
                                <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--ops-border-light)' }}>
                                  <p
                                    className="text-[10px] font-medium mb-1.5"
                                    style={{ color: 'var(--ops-text-muted)' }}
                                  >
                                    Changes
                                  </p>
                                  <div className="flex flex-col gap-1">
                                    {Object.entries(event.metadata).map(
                                      ([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex items-center gap-2 text-[11px]"
                                        >
                                          <span
                                            className="font-medium"
                                            style={{
                                              color: 'var(--ops-text-secondary)',
                                            }}
                                          >
                                            {key}:
                                          </span>
                                          <span
                                            style={{
                                              color: 'var(--ops-text-secondary)',
                                            }}
                                          >
                                            {String(value)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setVisibleCount((c) => c + 10)}
            className="mt-2 py-2.5 text-center text-xs font-medium rounded-lg transition-colors hover:bg-[var(--ops-hover-bg)]"
            style={{
              color: 'var(--ops-accent)',
              border: '1px solid rgba(204,92,55,0.15)',
            }}
          >
            Load more ({filtered.length - visibleCount} remaining)
          </motion.button>
        )}
      </div>
    </div>
  );
}
