import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavSubItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isAI?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  icon?: LucideIcon;
  items: NavSubItem[];
}

/**
 * Module configuration.
 * Generic over TPage so modules with narrower page unions (e.g. FinancePage)
 * can type their store precisely while remaining assignable to ModuleConfig<string>.
 * Method syntax on navigateTo enables bivariant parameter checking so that
 * ModuleConfig<FinancePage> is assignable to ModuleConfig<string>.
 */
export interface ModuleConfig<TPage extends string = string> {
  moduleId: string;
  moduleName: string;
  moduleShortName?: string;
  moduleIcon?: LucideIcon;
  accentKey?: string;
  navSections: NavSection[];
  pageComponents: Record<string, ComponentType>;
  allPageLabels: Record<string, string>;
  useStore: () => {
    currentPage: TPage;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    navigateTo(page: TPage): void;
    goBack(): void;
    goForward(): void;
    canGoBack(): boolean;
    canGoForward(): boolean;
  };
  collapsibleSections?: boolean;
  lazyLoading?: boolean;
}
