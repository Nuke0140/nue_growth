'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useAutomationStore } from './automation-store';

// Direct imports
import AutomationDashboardPage from './automation-dashboard-page';
import WorkflowBuilderPage from './workflow-builder-page';
import TriggerLibraryPage from './trigger-library-page';
import ActionLibraryPage from './action-library-page';
import ConditionsPage from './conditions-page';
import TemplatesPage from './templates-page';
import CrmAutomationsPage from './crm-automations-page';
import SalesAutomationsPage from './sales-automations-page';
import MarketingJourneysPage from './marketing-journeys-page';
import FinanceAutomationsPage from './finance-automations-page';
import ErpOpsAutomationsPage from './erp-ops-automations-page';
import HrAutomationsPage from './hr-automations-page';
import NotificationsPage from './notifications-page';
import WebhookIntegrationsPage from './webhook-integrations-page';
import SlaEscalationPage from './sla-escalation-page';
import ScheduledJobsPage from './scheduled-jobs-page';
import AiAutonomousWorkflowsPage from './ai-autonomous-workflows-page';

// Icons
import {
  LayoutTemplate,
  Workflow,
  MousePointerClick,
  Play,
  GitBranch,
  Users,
  DollarSign,
  Megaphone,
  Factory,
  UserCheck,
  BellRing,
  Webhook,
  ShieldAlert,
  Timer,
  BrainCircuit,
} from 'lucide-react';

export const automationConfig: ModuleConfig = {
  moduleId: 'automation',
  moduleName: 'Automation',
  moduleShortName: 'Automation',
  moduleIcon: Workflow,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'automation-dashboard', label: 'Automation Dashboard', icon: LayoutTemplate },
        { id: 'workflow-builder', label: 'Workflow Builder', icon: Workflow },
        { id: 'ai-autonomous-workflows', label: 'AI Autonomous', icon: BrainCircuit, isAI: true },
      ],
    },
    {
      id: 'builder',
      label: 'Builder',
      items: [
        { id: 'trigger-library', label: 'Triggers', icon: MousePointerClick },
        { id: 'action-library', label: 'Actions', icon: Play },
        { id: 'conditions', label: 'Conditions', icon: GitBranch },
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },
      ],
    },
    {
      id: 'module-automations',
      label: 'Module Automations',
      items: [
        { id: 'crm-automations', label: 'CRM Automations', icon: Users },
        { id: 'sales-automations', label: 'Sales Automations', icon: DollarSign },
        { id: 'marketing-journeys', label: 'Marketing Journeys', icon: Megaphone },
        { id: 'finance-automations', label: 'Finance Automations', icon: DollarSign },
        { id: 'erp-ops-automations', label: 'ERP Ops Automations', icon: Factory },
        { id: 'hr-automations', label: 'HR Automations', icon: UserCheck },
      ],
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      items: [
        { id: 'notifications', label: 'Notifications', icon: BellRing, badge: 5 },
        { id: 'webhook-integrations', label: 'Webhooks', icon: Webhook },
        { id: 'sla-escalation', label: 'SLA Escalations', icon: ShieldAlert, badge: 2 },
        { id: 'scheduled-jobs', label: 'Scheduled Jobs', icon: Timer },
      ],
    },
  ],

  pageComponents: {
    'automation-dashboard': AutomationDashboardPage,
    'workflow-builder': WorkflowBuilderPage,
    'trigger-library': TriggerLibraryPage,
    'action-library': ActionLibraryPage,
    'conditions': ConditionsPage,
    'templates': TemplatesPage,
    'crm-automations': CrmAutomationsPage,
    'sales-automations': SalesAutomationsPage,
    'marketing-journeys': MarketingJourneysPage,
    'finance-automations': FinanceAutomationsPage,
    'erp-ops-automations': ErpOpsAutomationsPage,
    'hr-automations': HrAutomationsPage,
    'notifications': NotificationsPage,
    'webhook-integrations': WebhookIntegrationsPage,
    'sla-escalation': SlaEscalationPage,
    'scheduled-jobs': ScheduledJobsPage,
    'ai-autonomous-workflows': AiAutonomousWorkflowsPage,
  },

  allPageLabels: {
    'automation-dashboard': 'Automation Dashboard',
    'workflow-builder': 'Workflow Builder',
    'ai-autonomous-workflows': 'AI Autonomous',
    'trigger-library': 'Triggers',
    'action-library': 'Actions',
    'conditions': 'Conditions',
    'templates': 'Templates',
    'crm-automations': 'CRM Automations',
    'sales-automations': 'Sales Automations',
    'marketing-journeys': 'Marketing Journeys',
    'finance-automations': 'Finance Automations',
    'erp-ops-automations': 'ERP Ops Automations',
    'hr-automations': 'HR Automations',
    'notifications': 'Notifications',
    'webhook-integrations': 'Webhooks',
    'sla-escalation': 'SLA Escalations',
    'scheduled-jobs': 'Scheduled Jobs',
  },

  useStore: () => {
    const store = useAutomationStore();
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
