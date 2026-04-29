'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CSS } from '@/styles/design-tokens';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastInput {
  title: string;
  message?: string;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss). Default: 4000 */
  duration?: number;
}

interface ToastItem extends Required<ToastInput> {
  id: string;
  type: ToastType;
  /** Remaining duration in ms for progress bar */
  remaining: number;
}

interface ActionFeedbackState {
  toasts: ToastItem[];
  addToast: (type: ToastType, input: ToastInput) => string;
  removeToast: (id: string) => void;
  clearLoading: () => void;
}

// ── Zustand Store ──────────────────────────────────────

let toastCounter = 0;

export const useFeedbackStore = create<ActionFeedbackState>((set) => ({
  toasts: [],

  addToast: (type, input) => {
    const id = `af-${++toastCounter}`;
    const duration = input.duration ?? 4000;

    set((state) => ({
      toasts: [
        ...state.toasts.filter((t) => t.type !== 'loading'),
        { ...input, id, type, duration, remaining: duration },
      ],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearLoading: () => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.type !== 'loading'),
    }));
  },
}));

// ── Toast visual config ────────────────────────────────

const TOAST_CONFIG: Record<Exclude<ToastType, 'loading'>, { color: string; bg: string; Icon: typeof CheckCircle2 }> = {
  success: { color: CSS.success, bg: 'color-mix(in srgb, var(--app-success) 12%, transparent)', Icon: CheckCircle2 },
  error:   { color: CSS.danger,  bg: 'color-mix(in srgb, var(--app-danger) 12%, transparent)',  Icon: XCircle },
  warning: { color: CSS.warning, bg: 'color-mix(in srgb, var(--app-warning) 12%, transparent)', Icon: AlertTriangle },
  info:    { color: CSS.info,    bg: 'color-mix(in srgb, var(--app-info) 12%, transparent)',    Icon: Info },
};

// ── useActionFeedback Hook ─────────────────────────────

export function useActionFeedback() {
  const { addToast, clearLoading } = useFeedbackStore();

  const success = useCallback(
    (input: ToastInput) => addToast('success', input),
    [addToast],
  );

  const error = useCallback(
    (input: ToastInput) => addToast('error', input),
    [addToast],
  );

  const warning = useCallback(
    (input: ToastInput) => addToast('warning', input),
    [addToast],
  );

  const info = useCallback(
    (input: ToastInput) => addToast('info', input),
    [addToast],
  );

  const loading = useCallback(
    (input: ToastInput) => addToast('loading', { ...input, duration: 0 }),
    [addToast],
  );

  return { success, error, warning, info, loading, clearLoading };
}

// ── Single Toast Item ──────────────────────────────────

interface ToastItemProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { type, title, message, duration } = toast;
  const isLoading = type === 'loading';
  const config = isLoading ? null : TOAST_CONFIG[type];

  // ── Progress bar timer ───────────────────────────────

  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoading || duration <= 0) return;

    setRemaining(duration);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setRemaining(Math.max(0, duration - elapsed));

      if (elapsed >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, isLoading]);

  const progress = duration > 0 && !isLoading ? (remaining / duration) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-80 rounded-xl overflow-hidden pointer-events-auto"
      style={{
        backgroundColor: CSS.cardBg,
        border: `1px solid ${CSS.border}`,
        boxShadow: `0 8px 24px ${CSS.overlay}`,
      }}
    >
      {/* Colored left border */}
      <div
        className="w-1 shrink-0"
        style={{
          backgroundColor: isLoading ? CSS.info : config!.color,
        }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 p-3 pl-3">
        <div className="flex items-start gap-2.5">
          {/* Icon */}
          <div
            className="shrink-0 mt-0.5"
            style={{ color: isLoading ? CSS.info : config!.color }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <config!.Icon className="w-4 h-4" />
            )}
          </div>

          {/* Title + message */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: CSS.text }}
            >
              {title}
            </p>
            {message && (
              <p
                className="text-[11px] mt-0.5 leading-relaxed"
                style={{ color: CSS.textMuted }}
              >
                {message}
              </p>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-0.5 rounded-md transition-colors"
            style={{ color: CSS.textDisabled }}
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        {!isLoading && duration > 0 && (
          <div
            className="mt-2 h-0.5 rounded-full overflow-hidden"
            style={{ backgroundColor: CSS.border }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: config!.color,
                width: `${progress}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── ToastContainer Component ───────────────────────────

export function ToastContainer() {
  const toasts = useFeedbackStore((s) => s.toasts);
  const removeToast = useFeedbackStore((s) => s.removeToast);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
