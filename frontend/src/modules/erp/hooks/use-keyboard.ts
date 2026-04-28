'use client';

import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardOptions {
  /** ESC key handler (close modals, exit modes) */
  onEscape?: () => void;
  /** Enter key handler (submit forms, confirm actions) */
  onEnter?: () => void;
  /** Arrow key handlers for list navigation */
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  /** Tab navigation — trap focus within container */
  trapFocus?: boolean;
  /** Only active when enabled */
  enabled?: boolean;
}

export function useKeyboard(options: UseKeyboardOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    trapFocus = false,
    enabled = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't intercept when typing in inputs/textareas
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onEscape?.();
          break;
        case 'Enter':
          // Only intercept Enter if not in a textarea or if specifically asked
          if (!isInput || target.tagName !== 'TEXTAREA') {
            onEnter?.();
          }
          break;
        case 'ArrowUp':
          if (!isInput) {
            e.preventDefault();
            onArrowUp?.();
          }
          break;
        case 'ArrowDown':
          if (!isInput) {
            e.preventDefault();
            onArrowDown?.();
          }
          break;
        case 'ArrowLeft':
          if (!isInput) {
            e.preventDefault();
            onArrowLeft?.();
          }
          break;
        case 'ArrowRight':
          if (!isInput) {
            e.preventDefault();
            onArrowRight?.();
          }
          break;
        case 'Tab':
          if (trapFocus && containerRef.current) {
            const focusable = containerRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
          break;
      }
    },
    [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, trapFocus]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { containerRef };
}
