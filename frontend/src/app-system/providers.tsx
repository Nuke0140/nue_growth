'use client';

import React from 'react';
import { NavigationProvider } from './navigation/navigation-provider';
import { RouteProgress } from './transitions/route-progress';

interface AppSystemProvidersProps {
  children: React.ReactNode;
}

/**
 * PXS (Product Experience System) — master provider.
 *
 * Composes every sub-provider in the correct order so that
 * any page or layout deeper in the tree can consume the
 * navigation, density, view-mode, keyboard, and transition
 * contexts without extra wiring.
 *
 * Provider nesting order matters:
 *   1. NavigationProvider  — tracks history & derives labels
 *   2. (future providers can be slotted here)
 *   3. RouteProgress      — thin progress bar on navigation
 */
export const AppSystemProviders = React.memo(function AppSystemProviders({
  children,
}: AppSystemProvidersProps) {
  return (
    <NavigationProvider>
      <RouteProgress />
      {children}
    </NavigationProvider>
  );
});
