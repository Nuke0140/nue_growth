'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { ModuleConfig } from '@/types/module-config';
import { getModuleConfigFromPathname, getModuleAccent } from '@/lib/module-registry';
import { MODULE_ACCENTS } from '@/styles/design-tokens';

// ---- Types ----

interface ModuleContextValue {
  /** The current active module config, or null if on home/auth */
  config: ModuleConfig | null;
  /** The detected module key from pathname (e.g. "erp", "crm-sales") */
  moduleKey: string | null;
  /** Accent colors for the current module */
  accent: { primary: string; hover: string; light: string };
  /** Whether we're inside a module layout */
  isModule: boolean;
}

// ---- Default values ----

const DEFAULT_ACCENT = {
  primary: 'var(--app-accent)',
  hover: 'var(--app-accent-hover)',
  light: 'var(--app-accent-light)',
} as const;

const DEFAULT_CONTEXT: ModuleContextValue = {
  config: null,
  moduleKey: null,
  accent: DEFAULT_ACCENT,
  isModule: false,
};

// ---- Context ----

const ModuleContext = createContext<ModuleContextValue>(DEFAULT_CONTEXT);

// ---- Provider ----

interface ModuleProviderProps {
  children: ReactNode;
  /** Override: force a specific config (for backward compat with store-based routing) */
  overrideConfig?: ModuleConfig | null;
}

/**
 * Resolve accent colors from a ModuleConfig.
 * Tries accentKey → moduleId → CSS var defaults.
 */
function resolveAccent(config: ModuleConfig | null | undefined): { primary: string; hover: string; light: string } {
  if (!config) return DEFAULT_ACCENT;

  // Try accentKey first (some configs like ERP use non-standard keys like "ops")
  if (config.accentKey) {
    const fromKey = MODULE_ACCENTS[config.accentKey as keyof typeof MODULE_ACCENTS];
    if (fromKey) return fromKey;
  }

  // Fallback to moduleId
  if (config.moduleId) {
    const fromId = MODULE_ACCENTS[config.moduleId as keyof typeof MODULE_ACCENTS];
    if (fromId) return fromId;
  }

  return DEFAULT_ACCENT;
}

export function ModuleProvider({ children, overrideConfig }: ModuleProviderProps) {
  const pathname = usePathname();

  const value = useMemo<ModuleContextValue>(() => {
    // If override config is provided (store-based routing), use it
    if (overrideConfig !== undefined) {
      return {
        config: overrideConfig,
        moduleKey: overrideConfig?.moduleId ?? null,
        accent: resolveAccent(overrideConfig),
        isModule: !!overrideConfig,
      };
    }

    // Pathname-based detection
    const config = getModuleConfigFromPathname(pathname);
    const moduleKey = config?.moduleId ?? null;

    return {
      config,
      moduleKey,
      accent: resolveAccent(config),
      isModule: !!config,
    };
  }, [pathname, overrideConfig]);

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

// ---- Hook ----

export function useModule(): ModuleContextValue {
  const context = useContext(ModuleContext);
  return context;
}

export { ModuleContext };
