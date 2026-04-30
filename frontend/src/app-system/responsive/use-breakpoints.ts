'use client';

import { useState, useEffect, useCallback, useRef, useMemo, useSyncExternalStore } from 'react';
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Breakpoint constants
// ---------------------------------------------------------------------------
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ---------------------------------------------------------------------------
// Global zustand store so any component can subscribe without useContext
// ---------------------------------------------------------------------------
interface BreakpointStore extends BreakpointState {
  setBreakpoints: (state: BreakpointState) => void;
}

const useBreakpointStore = create<BreakpointStore>((set) => ({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  setBreakpoints: (state) => set(state),
}));

// ---------------------------------------------------------------------------
// Internal helper: compute breakpoints from a window width
// ---------------------------------------------------------------------------
function computeBreakpoints(width: number): BreakpointState {
  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
  };
}

// ---------------------------------------------------------------------------
// Subscription manager for matchMedia -- avoids setState inside effects
// ---------------------------------------------------------------------------
let listenerCount = 0;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function subscribeToBreakpoints(callback: () => void): () => void {
  listenerCount++;

  const onChange = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      useBreakpointStore.getState().setBreakpoints(
        computeBreakpoints(window.innerWidth),
      );
      callback();
    }, 150);
  };

  const mqlTablet = window.matchMedia(
    `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  );
  const mqlDesktop = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);

  mqlTablet.addEventListener('change', onChange);
  mqlDesktop.addEventListener('change', onChange);
  window.addEventListener('resize', onChange);

  return () => {
    listenerCount--;
    mqlTablet.removeEventListener('change', onChange);
    mqlDesktop.removeEventListener('change', onChange);
    window.removeEventListener('resize', onChange);
    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
  };
}

// ---------------------------------------------------------------------------
// SSR snapshot -- defaults to desktop on the server
// ---------------------------------------------------------------------------
const SERVER_SNAPSHOT: BreakpointState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

function getSnapshot(): BreakpointState {
  if (typeof window === 'undefined') {
    return SERVER_SNAPSHOT;
  }
  return {
    isMobile: useBreakpointStore.getState().isMobile,
    isTablet: useBreakpointStore.getState().isTablet,
    isDesktop: useBreakpointStore.getState().isDesktop,
  };
}

function getServerSnapshot(): BreakpointState {
  return SERVER_SNAPSHOT;
}

// ---------------------------------------------------------------------------
// Primary hook: useBreakpoints
// ---------------------------------------------------------------------------
export function useBreakpoints(): BreakpointState {
  const breakpointState = useSyncExternalStore(
    subscribeToBreakpoints,
    getSnapshot,
    getServerSnapshot,
  );

  // Hydrate the store on first client render
  const initialized = useRef(false);
  if (!initialized.current && typeof window !== 'undefined') {
    initialized.current = true;
    useBreakpointStore.getState().setBreakpoints(
      computeBreakpoints(window.innerWidth),
    );
  }

  return breakpointState;
}

// ---------------------------------------------------------------------------
// Convenience hooks
// ---------------------------------------------------------------------------
export function useIsMobile(): boolean {
  return useBreakpoints().isMobile;
}

export function useIsTablet(): boolean {
  return useBreakpoints().isTablet;
}

export function useIsDesktop(): boolean {
  return useBreakpoints().isDesktop;
}

// ---------------------------------------------------------------------------
// Hook that returns a Tailwind-friendly breakpoint string
// ---------------------------------------------------------------------------
export function useResponsiveClass(): string {
  const { isMobile, isTablet } = useBreakpoints();
  return useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet]);
}
