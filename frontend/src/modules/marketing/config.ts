'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useMarketingStore } from './marketing-store';

// Lazy imports for page components
const MarketingDashboardPage = (() => import('./marketing-dashboard-page')) as unknown as React.ComponentType;
const CampaignsPage = (() => import('./campaigns-page')) as unknown as React.ComponentType;
const CampaignBuilderPage = (() => import('./campaign-builder-page')) as unknown as React.ComponentType;
const AudiencePage = (() => import('./audience-page')) as unknown as React.ComponentType;
const AnalyticsPage = (() => import('./analytics-page')) as unknown as React.ComponentType;
const OperationsPage = (() => import('./operations-page')) as unknown as React.ComponentType;

// Icons
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  Settings2,
  Sparkles,
} from 'lucide-react';

export const marketingConfig: ModuleConfig = {
  moduleId: 'marketing',
  moduleName: 'Growth Engine',
  moduleShortName: 'Marketing',
  moduleIcon: Megaphone,
  collapsibleSections: false,
  lazyLoading: true,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
      ],
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      items: [
        { id: 'audience', label: 'Audience', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
    },
    {
      id: 'execution',
      label: 'Execution',
      items: [
        { id: 'operations', label: 'Operations', icon: Settings2 },
      ],
    },
  ],

  pageComponents: {
    'dashboard': MarketingDashboardPage,
    'campaigns': CampaignsPage,
    'campaign-builder': CampaignBuilderPage,
    'audience': AudiencePage,
    'analytics': AnalyticsPage,
    'operations': OperationsPage,
  },

  allPageLabels: {
    'dashboard': 'Dashboard',
    'campaigns': 'Campaigns',
    'campaign-builder': 'Campaign Builder',
    'audience': 'Audience',
    'analytics': 'Analytics',
    'operations': 'Operations',
  },

  useStore: () => {
    const store = useMarketingStore();
    return {
      currentPage: store.currentPage,
      sidebarOpen: store.sidebarOpen,
      setSidebarOpen: store.setSidebarOpen,
      navigateTo: store.navigateTo,
      goBack: store.goBack,
      goForward: store.goForward,
      canGoBack: store.canGoBack,
      canGoForward: store.canGoForward,
    };
  },
};
