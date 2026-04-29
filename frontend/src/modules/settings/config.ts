'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useSettingsStore } from './settings-store';

// Direct imports
import SettingsDashboardPage from './settings-dashboard-page';
import WorkspaceProfilePage from './workspace-profile-page';
import BrandingWhiteLabelPage from './branding-white-label-page';
import UsersRolesPage from './users-roles-page';
import PermissionsMatrixPage from './permissions-matrix-page';
import IntegrationsPage from './integrations-page';
import ApiKeysWebhooksPage from './api-keys-webhooks-page';
import BillingSubscriptionPage from './billing-subscription-page';
import FeatureFlagsPage from './feature-flags-page';
import SecurityCompliancePage from './security-compliance-page';
import AuditLogsPage from './audit-logs-page';
import NotificationsPreferencesPage from './notifications-preferences-page';
import DataGovernancePage from './data-governance-page';
import AiControlsPage from './ai-controls-page';
import EnvironmentConfigPage from './environment-config-page';
import BackupRecoveryPage from './backup-recovery-page';
import CustomFieldsPage from './custom-fields-page';

// Icons
import {
  Settings,
  Building2,
  Palette,
  Users,
  Shield,
  Puzzle,
  Key,
  CreditCard,
  Flag,
  Lock,
  FileText,
  BellRing,
  Database,
  BrainCircuit,
  Server,
  Archive,
  TableProperties,
} from 'lucide-react';

export const settingsConfig: ModuleConfig = {
  moduleId: 'settings',
  moduleName: 'Settings',
  moduleShortName: 'Settings',
  moduleIcon: Settings,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'settings-dashboard', label: 'Settings Dashboard', icon: Settings },
        { id: 'workspace-profile', label: 'Workspace Profile', icon: Building2 },
        { id: 'branding-white-label', label: 'Branding & White Label', icon: Palette },
      ],
    },
    {
      id: 'access-control',
      label: 'Access Control',
      items: [
        { id: 'users-roles', label: 'Users & Roles', icon: Users },
        { id: 'permissions-matrix', label: 'Permissions Matrix', icon: Shield },
        { id: 'security-compliance', label: 'Security & Compliance', icon: Lock, badge: 2 },
        { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
      ],
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      items: [
        { id: 'integrations', label: 'Integrations', icon: Puzzle },
        { id: 'api-keys-webhooks', label: 'API Keys & Webhooks', icon: Key },
        { id: 'feature-flags', label: 'Feature Flags', icon: Flag },
        { id: 'environment-config', label: 'Environment Config', icon: Server },
        { id: 'backup-recovery', label: 'Backup & Recovery', icon: Archive },
      ],
    },
    {
      id: 'billing-governance',
      label: 'Billing & Governance',
      items: [
        { id: 'billing-subscription', label: 'Billing & Subscription', icon: CreditCard },
        { id: 'notifications-preferences', label: 'Notifications', icon: BellRing },
        { id: 'data-governance', label: 'Data Governance', icon: Database },
      ],
    },
    {
      id: 'ai-customization',
      label: 'AI & Customization',
      items: [
        { id: 'ai-controls', label: 'AI Controls', icon: BrainCircuit, isAI: true },
        { id: 'custom-fields', label: 'Custom Fields', icon: TableProperties },
      ],
    },
  ],

  pageComponents: {
    'settings-dashboard': SettingsDashboardPage,
    'workspace-profile': WorkspaceProfilePage,
    'branding-white-label': BrandingWhiteLabelPage,
    'users-roles': UsersRolesPage,
    'permissions-matrix': PermissionsMatrixPage,
    'integrations': IntegrationsPage,
    'api-keys-webhooks': ApiKeysWebhooksPage,
    'billing-subscription': BillingSubscriptionPage,
    'feature-flags': FeatureFlagsPage,
    'security-compliance': SecurityCompliancePage,
    'audit-logs': AuditLogsPage,
    'notifications-preferences': NotificationsPreferencesPage,
    'data-governance': DataGovernancePage,
    'ai-controls': AiControlsPage,
    'environment-config': EnvironmentConfigPage,
    'backup-recovery': BackupRecoveryPage,
    'custom-fields': CustomFieldsPage,
  },

  allPageLabels: {
    'settings-dashboard': 'Settings Dashboard',
    'workspace-profile': 'Workspace Profile',
    'branding-white-label': 'Branding & White Label',
    'users-roles': 'Users & Roles',
    'permissions-matrix': 'Permissions Matrix',
    'security-compliance': 'Security & Compliance',
    'audit-logs': 'Audit Logs',
    'integrations': 'Integrations',
    'api-keys-webhooks': 'API Keys & Webhooks',
    'feature-flags': 'Feature Flags',
    'environment-config': 'Environment Config',
    'backup-recovery': 'Backup & Recovery',
    'billing-subscription': 'Billing & Subscription',
    'notifications-preferences': 'Notifications',
    'data-governance': 'Data Governance',
    'ai-controls': 'AI Controls',
    'custom-fields': 'Custom Fields',
  },

  useStore: () => {
    const store = useSettingsStore();
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
