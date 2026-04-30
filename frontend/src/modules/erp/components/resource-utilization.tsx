'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Gauge,
  Clock,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Resource } from '../types';

// ─── Helpers ──────────────────────────────────────────────
function getUtilizationColor(value: number) {
  if (value > 80) return { bar: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10' };
  if (value > 60) return { bar: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' };
  if (value > 40) return { bar: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  return { bar: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' };
}

function getUtilizationLabel(value: number) {
  if (value > 80) return 'Overloaded';
  if (value > 60) return 'Heavy';
  if (value > 40) return 'Optimal';
  return 'Under-utilized';
}

// ─── Component ────────────────────────────────────────────
interface ResourceUtilizationProps {
  resources: Resource[];
}

export default function ResourceUtilization({ resources }: ResourceUtilizationProps) {
  const summaryStats = useMemo(() => {
    const total = resources.length;
    const overloaded = resources.filter((r) => r.utilization > 80).length;
    const optimal = resources.filter((r) => r.utilization >= 40 && r.utilization <= 80).length;
    const underutilized = resources.filter((r) => r.utilization < 40).length;
    const avgUtilization = total > 0 ? Math.round(resources.reduce((s, r) => s + r.utilization, 0) / total) : 0;
    return { total, overloaded, optimal, underutilized, avgUtilization };
  }, [resources]);

  return (
    <div className="space-y-app-xl">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]',
          'bg-[var(--app-card-bg)] border-[var(--app-border)]'
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-[var(--app-text-secondary)]" />
          <h3 className="text-sm font-semibold">Resource Utilization Summary</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-[var(--app-radius-lg)] bg-[var(--app-hover-bg)]">
            <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">Total Resources</p>
            <p className="text-lg font-bold">{summaryStats.total}</p>
          </div>
          <div className="p-3 rounded-[var(--app-radius-lg)] bg-[var(--app-hover-bg)]">
            <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">Avg. Utilization</p>
            <p className="text-lg font-bold">{summaryStats.avgUtilization}%</p>
          </div>
          <div className="p-3 rounded-[var(--app-radius-lg)] bg-red-50 dark:bg-red-500/[0.04]">
            <p className="text-[10px] font-medium mb-1 text-red-500">Overloaded</p>
            <p className="text-lg font-bold text-red-500">{summaryStats.overloaded}</p>
          </div>
          <div className="p-3 rounded-[var(--app-radius-lg)] bg-emerald-50 dark:bg-emerald-500/[0.04]">
            <p className="text-[10px] font-medium mb-1 text-emerald-500">Optimal</p>
            <p className="text-lg font-bold text-emerald-500">{summaryStats.optimal}</p>
          </div>
        </div>
      </motion.div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => {
          const utilColor = getUtilizationColor(resource.utilization);
          const visibleSkills = resource.skills.slice(0, 3);
          const extraSkills = resource.skills.length - 3;

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors duration-200',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-hover-bg)]'
              )}
            >
              {/* Name + Role */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-9 h-10  rounded-full flex items-center justify-center text-xs font-bold',
                    'bg-[var(--app-elevated)] text-[var(--app-text)]'
                  )}>
                    {resource.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">{resource.name}</h4>
                    <p className="text-[10px] text-[var(--app-text-muted)]">
                      {resource.role}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium',
                  utilColor.bg, utilColor.text
                )}>
                  {getUtilizationLabel(resource.utilization)}
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-[var(--app-text-secondary)]">
                    Utilization
                  </span>
                  <span className={cn('text-[11px] font-bold', utilColor.text)}>
                    {resource.utilization}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <motion.div
                    className={cn('h-full rounded-full', utilColor.bar)}
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.utilization}%` }}
                    transition={{ duration: 0.6, delay: index * 0.04 }}
                  />
                </div>
              </div>

              {/* Allocation */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4 text-[var(--app-text-muted)]" />
                  <span className="text-[10px] text-[var(--app-text-muted)]">Allocation</span>
                </div>
                <span className="text-[11px] font-medium text-[var(--app-text-secondary)]">
                  {resource.allocation}% · {resource.availability} free
                </span>
              </div>

              {/* Skills Tags */}
              {visibleSkills.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 mb-3">
                  {visibleSkills.map((skill) => (
                    <span
                      key={skill}
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[9px] font-medium',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                  {extraSkills > 0 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-medium',
                      'bg-[var(--app-hover-bg)] text-[var(--app-text-disabled)]'
                    )}>
                      +{extraSkills}
                    </span>
                  )}
                </div>
              )}

              {/* Projects */}
              {resource.projects.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium mb-1 text-[var(--app-text-muted)]">
                    Active Projects ({resource.projects.length})
                  </p>
                  <div className="space-y-1">
                    {resource.projects.map((project) => (
                      <div key={project.projectId} className="flex items-center justify-between">
                        <span className="text-[10px] truncate max-w-[140px] text-[var(--app-text-muted)]">
                          {project.projectName}
                        </span>
                        <span className="text-[9px] shrink-0 text-[var(--app-text-disabled)]">
                          {project.allocation}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Department */}
              <div className="mt-3 pt-2 border-t flex items-center gap-1 border-[var(--app-border)]">
                <Clock className="w-2.5 h-2.5 text-[var(--app-text-disabled)]" />
                <span className="text-[9px] text-[var(--app-text-disabled)]">
                  {resource.department}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {resources.length === 0 && (
        <div className={cn(
          'flex flex-col items-center justify-center py-app-4xl rounded-[var(--app-radius-xl)] border',
          'bg-[var(--app-card-bg)] border-[var(--app-border)] text-[var(--app-text-disabled)]'
        )}>
          <Users className="w-8 h-8 mb-2" />
          <p className="text-xs">No resource data available</p>
        </div>
      )}
    </div>
  );
}
