'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useErpStore } from '../../erp-store';
import type { ToastType } from '../../types';

const typeConfig: Record<ToastType, { icon: typeof CheckCircle2; color: string; bg: string; border: string; progressColor: string }> = {
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    progressColor: 'bg-emerald-500 dark:bg-emerald-400',
  },
  error: {
    icon: XCircle,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    progressColor: 'bg-red-500 dark:bg-red-400',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    progressColor: 'bg-amber-500 dark:bg-amber-400',
  },
  info: {
    icon: Info,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    progressColor: 'bg-blue-500 dark:bg-blue-400',
  },
};

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 4000;

export function ToastContainer() {
  const { toasts, removeToast } = useErpStore();

  const visibleToasts = toasts.slice(-MAX_TOASTS);

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2.5 pointer-events-none"
      style={{ maxWidth: 'calc(100vw - 32px)', width: '380px' }}
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
    duration?: number;
  };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;
  const duration = toast.duration || DEFAULT_DURATION;

  const handleAction = useCallback(() => {
    if (toast.actionUrl) {
      // Could navigate - for now just dismiss
    }
    onDismiss();
  }, [toast, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-xl border p-4 shadow-xl',
        'bg-[var(--app-card-bg)]',
        config.border
      )}
    >
      {/* Auto-dismiss progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={cn(
          'absolute bottom-0 left-0 right-0 h-[2px] origin-left',
          config.progressColor
        )}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
          <Icon className={cn('w-4 h-4', config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-semibold text-[var(--app-text)] leading-snug">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-xs text-[var(--app-text-secondary)] mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
          {toast.actionText && (
            <button
              onClick={handleAction}
              className="text-[11px] font-semibold text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] mt-2 transition-colors"
            >
              {toast.actionText}
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onDismiss}
          className="flex items-center justify-center w-6 h-6 rounded-lg text-[var(--app-text-disabled)] hover:text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)] transition-all shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
