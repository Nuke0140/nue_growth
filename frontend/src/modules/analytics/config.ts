'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useAnalyticsStore } from './analytics-store';

// Direct imports
import AnalyticsDashboardPage from './analytics-dashboard-page';
import ExecutiveBIPage from './executive-bi-page';
import CustomDashboardBuilderPage from './custom-dashboard-builder-page';
import SalesAnalyticsPage from './sales-analytics-page';
import MarketingAnalyticsPage from './marketing-analytics-page';
import FinanceAnalyticsPage from './finance-analytics-page';
import CrmAnalyticsPage from './crm-analytics-page';
import RetentionAnalyticsPage from './retention-analytics-page';
import ErpProductivityPage from './erp-productivity-page';
import AttributionReportPage from './attribution-report-page';
import CohortReportPage from './cohort-report-page';
import ReportBuilderPage from './report-builder-page';
import ScheduledReportsPage from './scheduled-reports-page';
import WhiteLabelClientReportsPage from './white-label-client-reports-page';
import BenchmarkComparisonPage from './benchmark-comparison-page';
import AnomalyDetectionPage from './anomaly-detection-page';
import AiBiAssistantPage from './ai-bi-assistant-page';

// Icons
import {
  LayoutDashboard,
  Presentation,
  LayoutGrid,
  DollarSign,
  Megaphone,
  BarChart3,
  Users,
  Heart,
  Factory,
  GitBranch,
  Layers,
  FileText,
  Clock,
  Building2,
  Target,
  ShieldAlert,
  BrainCircuit,
} from 'lucide-react';

export const analyticsConfig: ModuleConfig = {
  moduleId: 'analytics',
  moduleName: 'Analytics',
  moduleShortName: 'Analytics',
  moduleIcon: BarChart3,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'analytics-dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
        { id: 'executive-bi', label: 'Executive BI', icon: Presentation },
        { id: 'ai-bi-assistant', label: 'AI BI Assistant', icon: BrainCircuit, isAI: true },
      ],
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      items: [
        { id: 'custom-dashboard-builder', label: 'Custom Dashboards', icon: LayoutGrid },
      ],
    },
    {
      id: 'domain-analytics',
      label: 'Domain Analytics',
      items: [
        { id: 'sales-analytics', label: 'Sales Analytics', icon: DollarSign },
        { id: 'marketing-analytics', label: 'Marketing Analytics', icon: Megaphone },
        { id: 'finance-analytics', label: 'Finance Analytics', icon: BarChart3 },
        { id: 'crm-analytics', label: 'CRM Analytics', icon: Users },
        { id: 'retention-analytics', label: 'Retention Analytics', icon: Heart },
        { id: 'erp-productivity', label: 'ERP Productivity', icon: Factory },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { id: 'attribution-report', label: 'Attribution Reports', icon: GitBranch },
        { id: 'cohort-report', label: 'Cohort Reports', icon: Layers },
        { id: 'report-builder', label: 'Report Builder', icon: FileText },
        { id: 'scheduled-reports', label: 'Scheduled Reports', icon: Clock, badge: 3 },
        { id: 'white-label-client-reports', label: 'White Label Reports', icon: Building2 },
      ],
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      items: [
        { id: 'benchmark-comparison', label: 'Benchmarks', icon: Target },
        { id: 'anomaly-detection', label: 'Anomaly Detection', icon: ShieldAlert, badge: 2 },
      ],
    },
  ],

  pageComponents: {
    'analytics-dashboard': AnalyticsDashboardPage,
    'executive-bi': ExecutiveBIPage,
    'custom-dashboard-builder': CustomDashboardBuilderPage,
    'sales-analytics': SalesAnalyticsPage,
    'marketing-analytics': MarketingAnalyticsPage,
    'finance-analytics': FinanceAnalyticsPage,
    'crm-analytics': CrmAnalyticsPage,
    'retention-analytics': RetentionAnalyticsPage,
    'erp-productivity': ErpProductivityPage,
    'attribution-report': AttributionReportPage,
    'cohort-report': CohortReportPage,
    'report-builder': ReportBuilderPage,
    'scheduled-reports': ScheduledReportsPage,
    'white-label-client-reports': WhiteLabelClientReportsPage,
    'benchmark-comparison': BenchmarkComparisonPage,
    'anomaly-detection': AnomalyDetectionPage,
    'ai-bi-assistant': AiBiAssistantPage,
  },

  allPageLabels: {
    'analytics-dashboard': 'Analytics Dashboard',
    'executive-bi': 'Executive BI',
    'ai-bi-assistant': 'AI BI Assistant',
    'custom-dashboard-builder': 'Custom Dashboards',
    'sales-analytics': 'Sales Analytics',
    'marketing-analytics': 'Marketing Analytics',
    'finance-analytics': 'Finance Analytics',
    'crm-analytics': 'CRM Analytics',
    'retention-analytics': 'Retention Analytics',
    'erp-productivity': 'ERP Productivity',
    'attribution-report': 'Attribution Reports',
    'cohort-report': 'Cohort Reports',
    'report-builder': 'Report Builder',
    'scheduled-reports': 'Scheduled Reports',
    'white-label-client-reports': 'White Label Reports',
    'benchmark-comparison': 'Benchmarks',
    'anomaly-detection': 'Anomaly Detection',
  },

  useStore: () => {
    const store = useAnalyticsStore();
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
