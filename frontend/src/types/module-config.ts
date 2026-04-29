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

export interface ModuleConfig {
  moduleId: string;
  moduleName: string;
  moduleShortName?: string;
  moduleIcon?: LucideIcon;
  accentKey?: string;
  navSections: NavSection[];
  pageComponents: Record<string, ComponentType>;
  allPageLabels: Record<string, string>;
  useStore: () => {
    currentPage: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    navigateTo: (page: string) => void;
    goBack: () => void;
    goForward: () => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
  };
  collapsibleSections?: boolean;
  lazyLoading?: boolean;
}
