'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  X,
  FolderKanban,
  User,
  ListChecks,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { SidebarPanel } from '../../types';
import { useErpStore } from '../../erp-store';

interface ContextualSidebarProps {
  entity: SidebarPanel | null;
  onClose: () => void;
}

const entityIcons: Record<string, React.FC<{ className?: string }>> = {
  project: FolderKanban,
  employee: User,
  task: ListChecks,
  deal: FolderKanban,
  approval: ShieldCheck,
  asset: ShieldCheck,
};

const detailPages: Record<string, 'project-detail' | 'employee-detail' | 'tasks-board' | 'approvals' | 'assets'> = {
  project: 'project-detail',
  employee: 'employee-detail',
  task: 'tasks-board',
  approval: 'approvals',
  deal: 'projects',
  asset: 'assets',
};

export function ContextualSidebar({ entity, onClose }: ContextualSidebarProps) {
  const { navigateTo, selectProject, selectEmployee } = useErpStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (entity) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [entity, onClose]);

  const handleViewFull = () => {
    if (!entity) return;
    if (entity.entityType === 'project') {
      selectProject(entity.entityId);
    } else if (entity.entityType === 'employee') {
      selectEmployee(entity.entityId);
    } else {
      navigateTo(detailPages[entity.entityType] || 'ops-dashboard');
    }
    onClose();
  };

  const Icon = entity ? entityIcons[entity.entityType] || FolderKanban : FolderKanban;

  return (
    <AnimatePresence>
      {entity && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[var(--app-overlay)] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-[360px] max-w-[90vw] flex flex-col shadow-2xl"
            style={{
              backgroundColor: 'var(--app-bg)',
              borderLeft: '1px solid var(--app-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--app-border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ backgroundColor: 'var(--app-accent-light)' }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: 'var(--app-accent)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--app-text-muted)] capitalize">
                    {entity.entityType}
                  </p>
                  <h2 className="text-sm font-semibold text-[var(--app-text)] truncate">
                    ID: {entity.entityId.slice(0, 12)}…
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize bg-[var(--app-accent-light)] text-[var(--app-accent)]">
                    {entity.entityType}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--app-text-muted)]">
                    {entity.entityId}
                  </span>
                </div>

                <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                  View full details for this {entity.entityType} in the dedicated page.
                  All related information, actions, and history will be available there.
                </p>

                {/* Quick actions based on entity type */}
                {entity.entityType === 'approval' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-500 dark:text-red-400 hover:bg-red-500/25 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {entity.entityType === 'task' && (
                  <div className="ops-card p-3">
                    <p className="text-xs font-semibold text-[var(--app-text-secondary)] mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      {['Update Status', 'Reassign', 'Add Comment', 'Log Time'].map((action) => (
                        <button
                          key={action}
                          className="w-full text-left text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] px-2 py-1.5 rounded-lg transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {entity.entityType === 'project' && (
                  <div className="ops-card p-3">
                    <p className="text-xs font-semibold text-[var(--app-text-secondary)] mb-2">Quick Info</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Budget', value: 'View in details' },
                        { label: 'Timeline', value: 'View milestones' },
                        { label: 'Team', value: 'View allocation' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-xs text-[var(--app-text-muted)]">{item.label}</span>
                          <span className="text-xs text-[var(--app-accent)]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entity.entityType === 'employee' && (
                  <div className="ops-card p-3">
                    <p className="text-xs font-semibold text-[var(--app-text-secondary)] mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      {['View Profile', 'View Attendance', 'View Tasks', 'Send Message'].map((action) => (
                        <button
                          key={action}
                          className="w-full text-left text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] px-2 py-1.5 rounded-lg transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Footer */}
            <div
              className="shrink-0 px-5 py-4"
              style={{ borderTop: '1px solid var(--app-border)' }}
            >
              <button
                onClick={handleViewFull}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--app-accent)] bg-[var(--app-accent-light)] hover:bg-[var(--app-accent-light)] transition-colors"
              >
                View Full Details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
