// ---- Module Registry ----
// Single source of truth for mapping URL pathname segments → module configs.
// Uses pathname-based detection alongside the existing Zustand store routing.

import type { ModuleConfig } from '@/types/module-config';
import { MODULE_ACCENTS } from '@/styles/design-tokens';

import { erpConfig } from '@/modules/erp/config';
import { crmSalesConfig } from '@/modules/crm-sales/config';
import { financeConfig } from '@/modules/finance/config';
import { marketingConfig } from '@/modules/marketing/config';
import { retentionConfig } from '@/modules/retention/config';
import { analyticsConfig } from '@/modules/analytics/config';
import { automationConfig } from '@/modules/automation/config';
import { settingsConfig } from '@/modules/settings/config';

// ---- Module Registry ----
// Maps URL pathname prefix → module config
export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  erp: erpConfig,
  crm: crmSalesConfig,
  'crm-sales': crmSalesConfig,
  sales: crmSalesConfig,
  finance: financeConfig,
  marketing: marketingConfig,
  growth: retentionConfig,
  retention: retentionConfig,
  analytics: analyticsConfig,
  automation: automationConfig,
  settings: settingsConfig,
};

// Alias map for detecting module from various URL patterns
const PATHNAME_ALIASES: Record<string, string> = {
  erp: 'erp',
  operations: 'erp',
  crm: 'crm-sales',
  sales: 'crm-sales',
  finance: 'finance',
  accounting: 'finance',
  marketing: 'marketing',
  growth: 'growth',
  retention: 'retention',
  analytics: 'analytics',
  bi: 'analytics',
  automation: 'automation',
  workflows: 'automation',
  settings: 'settings',
  admin: 'settings',
};

/**
 * Detect module key from a pathname.
 * Examples:
 *   "/erp/employees" → "erp"
 *   "/crm/contacts" → "crm-sales"
 *   "/finance/dashboard" → "finance"
 *   "/" → null (home)
 *   "/login" → null (auth)
 */
export function detectModuleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const firstSegment = segments[0];

  // Direct match in registry
  if (MODULE_REGISTRY[firstSegment]) return firstSegment;

  // Check aliases
  const alias = PATHNAME_ALIASES[firstSegment];
  if (alias) return alias;

  return null;
}

/**
 * Get module config from pathname.
 * Returns null if no module is detected (e.g. home page, auth pages).
 */
export function getModuleConfigFromPathname(pathname: string): ModuleConfig | null {
  const moduleKey = detectModuleFromPathname(pathname);
  if (!moduleKey) return null;
  return MODULE_REGISTRY[moduleKey] ?? null;
}

/**
 * Get all registered module keys
 */
export function getRegisteredModules(): string[] {
  return Object.keys(MODULE_REGISTRY);
}

/** Default accent colors (CSS custom properties — theme-aware) */
const DEFAULT_ACCENT = {
  primary: 'var(--app-accent)',
  hover: 'var(--app-accent-hover)',
  light: 'var(--app-accent-light)',
} as const;

/**
 * Get accent colors for a module key.
 *
 * Resolution order:
 *  1. config.accentKey  (e.g. erpConfig uses "ops")
 *  2. config.moduleId   (fallback — matches MODULE_ACCENTS keys)
 *  3. Global CSS variable defaults
 */
export function getModuleAccent(
  moduleKey: string,
): { primary: string; hover: string; light: string } {
  const config = MODULE_REGISTRY[moduleKey];
  if (!config) return DEFAULT_ACCENT;

  // Try accentKey first (some configs use non-standard keys like "ops")
  if (config.accentKey) {
    const fromAccentKey = MODULE_ACCENTS[config.accentKey as keyof typeof MODULE_ACCENTS];
    if (fromAccentKey) return fromAccentKey;
  }

  // Fallback to moduleId (erp → MODULE_ACCENTS.erp, crm-sales → look up crm)
  if (config.moduleId) {
    const fromModuleId = MODULE_ACCENTS[config.moduleId as keyof typeof MODULE_ACCENTS];
    if (fromModuleId) return fromModuleId;
  }

  return DEFAULT_ACCENT;
}
