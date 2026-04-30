'use client';

import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationStore, type NavigationEntry } from './use-navigation-store';

/** Maps pathname prefixes to human-readable labels */
const PATHNAME_LABEL_MAP: Array<{ pattern: string; label: string }> = [
  { pattern: '/', label: 'Dashboard' },
  { pattern: '/crm', label: 'CRM' },
  { pattern: '/analytics', label: 'Analytics' },
  { pattern: '/erp', label: 'ERP' },
  { pattern: '/settings', label: 'Settings' },
  { pattern: '/finance', label: 'Finance' },
  { pattern: '/marketing', label: 'Marketing' },
  { pattern: '/automation', label: 'Automation' },
  { pattern: '/retention', label: 'Retention' },
  { pattern: '/auth', label: 'Authentication' },
];

function deriveLabel(pathname: string): string {
  // Sort by pattern length descending so more specific paths match first
  const sorted = [...PATHNAME_LABEL_MAP].sort((a, b) => b.pattern.length - a.pattern.length);

  // Handle root path first
  if (pathname === '/' || pathname === '') return 'Dashboard';

  for (const { pattern, label } of sorted) {
    if (pattern === '/') continue; // skip root (handled above)
    if (pathname.startsWith(pattern)) {
      // For deeper paths, append the sub-path segment as extra context
      const remaining = pathname.slice(pattern.length).replace(/^\/+|\/+$/g, '');
      if (remaining) {
        // Convert slug-like segments to title case
        const segment = remaining
          .split('/')
          .pop()!
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return `${label} / ${segment}`;
      }
      return label;
    }
  }

  // Fallback: convert the pathname to a title
  return pathname
    .replace(/^\//, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Dashboard';
}

interface NavigationContextValue {
  history: NavigationEntry[];
  currentIndex: number;
  push: (path: string, label: string) => void;
  back: () => NavigationEntry | null;
  forward: () => NavigationEntry | null;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  currentLabel: string;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigationContext(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return ctx;
}

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider = React.memo(function NavigationProvider({
  children,
}: NavigationProviderProps) {
  const pathname = usePathname();
  const storeHistory = useNavigationStore((s) => s.history);
  const storeCurrentIndex = useNavigationStore((s) => s.currentIndex);
  const storePush = useNavigationStore((s) => s.push);
  const storeBack = useNavigationStore((s) => s.back);
  const storeForward = useNavigationStore((s) => s.forward);
  const storeCanGoBack = useNavigationStore((s) => s.canGoBack);
  const storeCanGoForward = useNavigationStore((s) => s.canGoForward);

  // Sync pathname changes into the store
  useEffect(() => {
    const label = deriveLabel(pathname);
    storePush(pathname, label);
  }, [pathname, storePush]);

  const contextValue = useMemo<NavigationContextValue>(
    () => ({
      history: storeHistory,
      currentIndex: storeCurrentIndex,
      push: storePush,
      back: storeBack,
      forward: storeForward,
      canGoBack: storeCanGoBack,
      canGoForward: storeCanGoForward,
      currentLabel: storeHistory[storeCurrentIndex]?.label ?? 'Dashboard',
    }),
    [
      storeHistory,
      storeCurrentIndex,
      storePush,
      storeBack,
      storeForward,
      storeCanGoBack,
      storeCanGoForward,
    ],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
});
