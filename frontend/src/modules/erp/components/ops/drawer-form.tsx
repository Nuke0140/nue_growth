'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DrawerFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  className?: string;
  width?: string;
}

export function DrawerForm({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  className,
  width = 'max-w-lg',
}: DrawerFormProps) {
  // Close on Escape
  React.useEffect(() => {
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 right-0 z-50 h-full flex flex-col shadow-2xl',
              width
            )}
            style={{
              backgroundColor: 'var(--ops-bg-dark)',
              borderLeft: '1px solid var(--ops-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--ops-border)' }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: 'var(--ops-text)' }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                style={{ color: 'var(--ops-text-muted)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'transparent';
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)}>
              {children}
            </div>

            {/* Footer */}
            {onSubmit && (
              <div
                className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
                style={{ borderTop: '1px solid var(--ops-border)' }}
              >
                <button
                  onClick={onClose}
                  className="ops-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  className="ops-btn-primary"
                >
                  {submitLabel}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
