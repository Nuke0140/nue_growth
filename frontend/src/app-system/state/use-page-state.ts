'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'pxs-page-state:';
const DEBOUNCE_MS = 300;

function readFromSession<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToSession<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable or full
  }
}

/**
 * Generic hook for preserving page state across navigations.
 *
 * Uses sessionStorage so state is automatically cleared when the tab closes.
 * Writes are debounced (300ms) to avoid thrashing on rapid updates.
 * State is flushed to sessionStorage on unmount.
 *
 * @example
 * ```tsx
 * const [scrollPos, setScrollPos] = usePageState('employees-scroll', 0);
 * const [filters, setFilters] = usePageState('employees-filters', { status: 'all' });
 * ```
 */
export function usePageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => readFromSession(key, defaultValue));
  const stateRef = useRef<T>(state);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyRef = useRef<string>(key);

  // Keep refs in sync via effect to satisfy react-hooks/refs
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  // Debounced save helper
  const scheduleSave = useCallback((value: T, currentKey: string) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      writeToSession(currentKey, value);
      timerRef.current = null;
    }, DEBOUNCE_MS);
  }, []);

  // Setter that supports functional updates
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const currentKey = keyRef.current;
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        scheduleSave(next, currentKey);
        return next;
      });
    },
    [scheduleSave]
  );

  // Flush any pending write and do a final save on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      writeToSession(keyRef.current, stateRef.current);
    };
  }, []);

  // Also save before the page hides (navigation, tab close, etc.)
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        writeToSession(keyRef.current, stateRef.current);
      }
    }

    function handleBeforeUnload() {
      writeToSession(keyRef.current, stateRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return [state, setValue];
}
