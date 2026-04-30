'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';

// Direct imports — matching current behavior (no lazy loading)
import ContactsPage from '@/modules/crm-sales/relationships/contacts/contacts-page';
import ContactDetailPage from '@/modules/crm-sales/relationships/contacts/contact-detail-page';
import CompaniesPage from '@/modules/crm-sales/relationships/companies/companies-page';
import CompanyDetailPage from '@/modules/crm-sales/relationships/companies/company-detail-page';
import LeadsPage from '@/modules/crm-sales/core/leads/leads-page';
import LeadDetailPage from '@/modules/crm-sales/core/leads/lead-detail-page';
import DealsPage from '@/modules/crm-sales/core/deals/deals-page';
import DealDetailPage from '@/modules/crm-sales/core/deals/deal-detail-page';
import ActivitiesPage from '@/modules/crm-sales/execution/activities/activities-page';
import TasksPage from '@/modules/crm-sales/execution/tasks/tasks-page';
import NotesPage from '@/modules/crm-sales/execution/notes/notes-page';
import SegmentsPage from '@/modules/crm-sales/execution/segments/segments-page';
import LifecyclePage from '@/modules/crm-sales/execution/lifecycle/lifecycle-page';
import ContactIntelligencePage from '@/modules/crm-sales/relationships/intelligence/contact-intelligence-page';
import LeadCapturePage from '@/modules/crm-sales/core/lead-capture/lead-capture-page';
import QualificationPage from '@/modules/crm-sales/intelligence/qualification/qualification-page';
import DealsPipelinePage from '@/modules/crm-sales/core/pipeline/pipeline-page';
import SalesForecastPage from '@/modules/crm-sales/analytics/forecast/sales-forecast-page';
import RevenuePage from '@/modules/crm-sales/analytics/revenue/revenue-page';
import TeamPerformancePage from '@/modules/crm-sales/analytics/team/team-performance-page';
import FollowupsPage from '@/modules/crm-sales/execution/follow-ups/followups-page';
import ProposalsPage from '@/modules/crm-sales/analytics/proposals/proposals-page';
import WinLossPage from '@/modules/crm-sales/analytics/win-loss/win-loss-page';

// Icons
import {
  Users,
  Building2,
  TrendingUp,
  Handshake,
  Activity,
  CheckSquare,
  FileText,
  Target,
  GitBranch,
  BrainCircuit,
  Radio,
  Shield,
  BarChart3,
  DollarSign,
  Trophy,
  Clock,
} from 'lucide-react';

export const crmSalesConfig: ModuleConfig = {
  moduleId: 'crm-sales',
  moduleName: 'CRM & Sales',
  moduleShortName: 'CRM',
  moduleIcon: Users,
  collapsibleSections: false,
  lazyLoading: true,

  navSections: [
    {
      id: 'people',
      label: 'People',
      items: [
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'companies', label: 'Companies', icon: Building2 },
      ],
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      items: [
        { id: 'leads', label: 'Leads', icon: TrendingUp },
        { id: 'lead-capture', label: 'Lead Capture', icon: Radio },
        { id: 'qualification', label: 'Qualification', icon: Shield },
      ],
    },
    {
      id: 'deals',
      label: 'Deals',
      items: [
        { id: 'deals', label: 'Deals', icon: Handshake },
        { id: 'deals-pipeline', label: 'Deals Pipeline', icon: Handshake },
      ],
    },
    {
      id: 'sales-ops',
      label: 'Sales Ops',
      items: [
        { id: 'followups', label: 'Follow-ups', icon: Clock, badge: 3 },
        { id: 'proposals', label: 'Proposals', icon: FileText },
      ],
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      items: [
        { id: 'sales-forecast', label: 'Forecast', icon: BarChart3 },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'team-performance', label: 'Team Performance', icon: Trophy },
        { id: 'win-loss', label: 'Win / Loss', icon: TrendingUp },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      items: [
        { id: 'activities', label: 'Activities', icon: Activity },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'segments', label: 'Segments', icon: Target },
        { id: 'lifecycle', label: 'Lifecycle', icon: GitBranch },
      ],
    },
    {
      id: 'ai',
      label: 'AI',
      items: [
        { id: 'contact-intelligence', label: 'AI Intelligence', icon: BrainCircuit, isAI: true },
      ],
    },
  ],

  pageComponents: {
    'contacts': ContactsPage,
    'contact-detail': ContactDetailPage,
    'companies': CompaniesPage,
    'company-detail': CompanyDetailPage,
    'leads': LeadsPage,
    'lead-detail': LeadDetailPage,
    'deals': DealsPage,
    'deal-detail': DealDetailPage,
    'activities': ActivitiesPage,
    'tasks': TasksPage,
    'notes': NotesPage,
    'segments': SegmentsPage,
    'lifecycle': LifecyclePage,
    'contact-intelligence': ContactIntelligencePage,
    'lead-capture': LeadCapturePage,
    'qualification': QualificationPage,
    'deals-pipeline': DealsPipelinePage,
    'sales-forecast': SalesForecastPage,
    'revenue': RevenuePage,
    'team-performance': TeamPerformancePage,
    'followups': FollowupsPage,
    'proposals': ProposalsPage,
    'win-loss': WinLossPage,
  },

  allPageLabels: {
    'contacts': 'Contacts',
    'contact-detail': 'Contact Detail',
    'companies': 'Companies',
    'company-detail': 'Company Detail',
    'leads': 'Leads',
    'lead-detail': 'Lead Detail',
    'deals': 'Deals',
    'deal-detail': 'Deal Detail',
    'activities': 'Activities',
    'tasks': 'Tasks',
    'notes': 'Notes',
    'segments': 'Segments',
    'lifecycle': 'Lifecycle',
    'contact-intelligence': 'AI Intelligence',
    'lead-capture': 'Lead Capture',
    'qualification': 'Qualification',
    'deals-pipeline': 'Deals Pipeline',
    'sales-forecast': 'Forecast',
    'revenue': 'Revenue',
    'team-performance': 'Team Performance',
    'followups': 'Follow-ups',
    'proposals': 'Proposals',
    'win-loss': 'Win / Loss',
  },

  useStore: () => {
    const store = useCrmSalesStore();
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
