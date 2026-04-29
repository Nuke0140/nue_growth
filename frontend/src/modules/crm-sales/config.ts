'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useCrmSalesStore } from './crm-sales-store';

// Direct imports — matching current behavior (no lazy loading)
import ContactsPage from './contacts-page';
import ContactDetailPage from './contact-detail-page';
import CompaniesPage from './companies-page';
import CompanyDetailPage from './company-detail-page';
import LeadsPage from './leads-page';
import LeadDetailPage from './lead-detail-page';
import DealsPage from './deals-page';
import DealDetailPage from './deal-detail-page';
import ActivitiesPage from './activities-page';
import TasksPage from './tasks-page';
import NotesPage from './notes-page';
import SegmentsPage from './segments-page';
import LifecyclePage from './lifecycle-page';
import ContactIntelligencePage from './contact-intelligence-page';
import LeadCapturePage from './lead-capture-page';
import QualificationPage from './qualification-page';
import DealsPipelinePage from './deals-pipeline-page';
import SalesForecastPage from './sales-forecast-page';
import RevenuePage from './revenue-page';
import TeamPerformancePage from './team-performance-page';
import FollowupsPage from './followups-page';
import ProposalsPage from './proposals-page';
import WinLossPage from './win-loss-analysis-page';

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
  lazyLoading: false,

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
