'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useErpStore } from '../../erp-store';
import { useKeyboard } from '../../hooks/use-keyboard';
import { ANIMATION, SPACING } from '@/styles/design-tokens';
import { CreateModal } from './create-modal';
import { ContextualSidebar } from './contextual-sidebar';
import { EmptyState } from './empty-state';
import type { CreateEntityType } from '../../erp-store';

interface PageShellProps {
  /** Page title shown in header */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Page icon component */
  icon?: React.FC<{ className?: string }>;
  /** Optional badge count */
  badge?: number;
  /** Whether to show the "Create" button in header */
  createType?: CreateEntityType;
  /** Custom header right content */
  headerRight?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Whether content is empty (shows EmptyState) */
  isEmpty?: boolean;
  /** Empty state props */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionOnClick?: () => void;
  /** Extra class for content area */
  className?: string;
  /** Whether this page should have padding (default: true) */
  padded?: boolean;
}

function PageShellInner({
  title,
  subtitle,
  icon: Icon,
  badge,
  createType,
  headerRight,
  children,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionOnClick,
  className,
  padded = true,
}: PageShellProps) {
  const {
    createModalOpen,
    createModalType,
    closeCreateModal,
    openCreateModal,
    contextualSidebar,
    closeContextualSidebar,
    addToast,
  } = useErpStore();

  const handleCreate = useCallback(() => {
    if (createType) {
      openCreateModal(createType);
    }
  }, [createType, openCreateModal]);

  const handleCreateSubmit = useCallback(
    (data: Record<string, unknown>) => {
      addToast({
        type: 'success',
        title: `Created successfully`,
        message: `New ${createType || 'item'} has been created.`,
      });
    },
    [createType, addToast]
  );

  useKeyboard({
    onEscape: closeCreateModal,
    enabled: createModalOpen,
  });

  const headerContent = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.ease as unknown as number[] }}
      className={cn(
        'flex items-center justify-between gap-4',
        padded && 'px-6 pt-6 pb-2'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--app-accent-light)] shrink-0">
            <Icon className="w-[18px] h-[18px] text-[var(--app-accent)]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-[var(--app-text)] truncate">{title}</h1>
            {badge !== undefined && badge > 0 && (
              <span className="text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--app-accent)] text-white px-1.5 leading-none">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[12px] text-[var(--app-text-muted)] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {headerRight}
        {createType && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--app-accent)] text-white text-[13px] font-medium hover:bg-[var(--app-accent)]/90 transition-colors app-btn-press"
            aria-label={`Create ${createType}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Create</span>
          </button>
        )}
      </div>
    </motion.div>
  );

  const contentArea = isEmpty ? (
    <EmptyState
      title={emptyTitle || `No ${title.toLowerCase()} yet`}
      description={emptyDescription || 'Get started by creating your first item.'}
      illustration="getting-started"
      primaryAction={
        emptyActionLabel && emptyActionOnClick
          ? { label: emptyActionLabel, onClick: emptyActionOnClick }
          : createType
          ? { label: `Create ${createType}`, onClick: handleCreate }
          : undefined
      }
    />
  ) : (
    children
  );

  return (
    <div className={cn('flex flex-col h-full overflow-hidden')}>
      {headerContent}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.duration.normal, delay: 0.05 }}
        className={cn('flex-1 overflow-y-auto custom-scrollbar', padded && 'px-6 pb-6', className)}
      >
        {contentArea}
      </motion.div>

      {/* Create Modal */}
      {createModalOpen && createModalType && (
        <CreateModal
          open={createModalOpen}
          onClose={closeCreateModal}
          type={createModalType}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* Contextual Sidebar */}
      <ContextualSidebar
        entity={contextualSidebar}
        onClose={closeContextualSidebar}
      />
    </div>
  );
}

export const PageShell = memo(PageShellInner);
