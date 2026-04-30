'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { CSS } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface ContextualSidebarProps {
  /** Whether the sidebar is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Sidebar title */
  title?: string;
  /** Subtitle or type badge text */
  subtitle?: string;
  /** Icon component for the header */
  icon?: LucideIcon;
  /** Primary content */
  children: React.ReactNode;
  /** Footer content (e.g. "View Full Details" button) */
  footer?: React.ReactNode;
  /** Panel width in pixels (default: 360) */
  width?: number;
  /** Additional class name */
  className?: string;
}

// ── Component ──────────────────────────────────────────

export function ContextualSidebar({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  width = 360,
  className,
}: ContextualSidebarProps) {
  // Handle escape key and body scroll lock
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: CSS.overlay }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn('fixed top-0 right-0 z-50 h-full flex flex-col shadow-[var(--app-shadow-md)]-2xl', className)}
            style={{
              width,
              maxWidth: '90vw',
              backgroundColor: CSS.bg,
              borderLeft: `1px solid ${CSS.border}`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Detail panel'}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-app-xl py-4 shrink-0"
              style={{ borderBottom: `1px solid ${CSS.border}` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                  <div
                    className="flex items-center justify-center w-9 h-10  rounded-[var(--app-radius-lg)] shrink-0"
                    style={{ backgroundColor: CSS.accentLight }}
                  >
                    <Icon
                      className="w-[18px] h-[18px]"
                      style={{ color: CSS.accent }}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {subtitle && (
                    <p className="text-[11px] capitalize" style={{ color: CSS.textMuted }}>
                      {subtitle}
                    </p>
                  )}
                  {title && (
                    <h2
                      className="text-sm font-semibold truncate"
                      style={{ color: CSS.text }}
                    >
                      {title}
                    </h2>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] transition-colors hover:bg-[var(--app-hover-bg)]"
                style={{ color: CSS.textMuted }}
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-app-xl py-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {children}
              </motion.div>
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="shrink-0 px-app-xl py-4"
                style={{ borderTop: `1px solid ${CSS.border}` }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
