// ============================================
// Settings Module Types
// ============================================

export type SettingsPage =
  | 'settings-dashboard'
  | 'workspace-profile'
  | 'branding-white-label'
  | 'users-roles'
  | 'permissions-matrix'
  | 'integrations'
  | 'api-keys-webhooks'
  | 'billing-subscription'
  | 'feature-flags'
  | 'security-compliance'
  | 'audit-logs'
  | 'notifications-preferences'
  | 'data-governance'
  | 'ai-controls'
  | 'environment-config'
  | 'backup-recovery'
  | 'custom-fields';

// ---- Dashboard Types ----
export interface SettingsKPI {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  change: number;
  changeLabel: string;
  icon: string;
  severity?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export interface SettingsDashboardStats {
  activeUsers: number;
  activeTenants: number;
  storageUsedGB: number;
  storageTotalGB: number;
  apiUsage: number;
  apiLimit: number;
  activeIntegrations: number;
  failedWebhooks: number;
  securityAlerts: number;
  aiTokenUsage: number;
  aiTokenLimit: number;
  billingPlanHealth: number;
}

// ---- Workspace Types ----
export interface WorkspaceProfile {
  workspaceName: string;
  companyLegalName: string;
  domain: string;
  timezone: string;
  currency: string;
  locale: string;
  dateFormat: string;
  defaultDashboard: string;
  defaultModuleLanding: string;
  onboardingCompleted: boolean;
  onboardingChecklist: { item: string; completed: boolean }[];
  metadata: { industry: string; teamSize: string; founded: string; country: string };
}

// ---- Branding Types ----
export interface BrandingConfig {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  typography: string;
  loginBranding: boolean;
  emailBranding: boolean;
  pdfBranding: boolean;
  reportBranding: boolean;
  clientPortalBranding: boolean;
  watermarkEnabled: boolean;
  customDomain?: string;
}

// ---- User & Role Types ----
export type UserRole = 'super-admin' | 'admin' | 'sales' | 'marketing' | 'finance' | 'hr' | 'client' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  mfaEnabled: boolean;
  lastLogin: string;
  activeSessions: number;
  status: 'active' | 'inactive' | 'suspended';
  tenant: string;
  department?: string;
  phone?: string;
  createdAt: string;
}

// ---- Permission Types ----
export type PermissionLevel = 'none' | 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'ai-access' | 'automation-access';

export interface PermissionRow {
  module: string;
  permissions: Record<UserRole, PermissionLevel[]>;
}

export interface RolePreset {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  userCount: number;
  permissions: Record<string, PermissionLevel[]>;
}

// ---- Integration Types ----
export interface Integration {
  id: string;
  name: string;
  icon: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  connectedAt?: string;
  lastSync?: string;
  tokenExpiry?: string;
  syncLogs: { timestamp: string; status: string; records: number }[];
  fieldMappings: { source: string; target: string }[];
  description: string;
}

// ---- API Key Types ----
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  status: 'active' | 'revoked' | 'expired';
  ipAllowlist: string[];
  requestCount: number;
  createdBy: string;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  retryAttempts: number;
  status: 'active' | 'inactive' | 'error';
  lastDelivery?: { timestamp: string; statusCode: number; success: boolean };
  deliveryLogs: { timestamp: string; statusCode: number; duration: number; success: boolean }[];
}

// ---- Billing Types ----
export type PlanTier = 'starter' | 'growth' | 'agency' | 'enterprise';

export interface BillingPlan {
  id: string;
  tier: PlanTier;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  seats: number;
  features: string[];
  addOns: { name: string; price: number; active: boolean }[];
  currentUsage: { users: number; storage: number; apiCalls: number };
  limits: { users: number; storage: number; apiCalls: number };
  nextBillingDate: string;
  paymentMethod: string;
  invoiceHistory: { date: string; amount: number; status: string; invoiceNo: string }[];
}

// ---- Feature Flag Types ----
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  rolloutPercent: number;
  environments: string[];
  targetRoles: UserRole[];
  killSwitch: boolean;
  createdAt: string;
  lastModified: string;
  modifiedBy: string;
}

// ---- Security Types ----
export interface SecurityConfig {
  mfaEnforced: boolean;
  passwordPolicy: { minLength: number; requireUppercase: boolean; requireNumbers: boolean; requireSymbols: boolean; expiryDays: number };
  sessionTimeout: number;
  ipAllowlist: string[];
  suspiciousLoginAlerts: boolean;
  ssoEnabled: boolean;
  deviceLogs: { device: string; lastActive: string; ip: string; location: string }[];
  soc2Compliant: boolean;
  gdprCompliant: boolean;
  dataResidency: string;
}

// ---- Audit Log Types ----
export type AuditEventSeverity = 'info' | 'warning' | 'critical';
export type AuditEventType = 'login' | 'permission-changed' | 'payout-approved' | 'invoice-deleted' | 'workflow-edited' | 'api-key-rotated' | 'role-updated' | 'user-invited' | 'data-exported' | 'setting-changed' | 'integration-connected' | 'backup-restored';

export interface AuditLog {
  id: string;
  eventType: AuditEventType;
  severity: AuditEventSeverity;
  actor: string;
  actorRole: UserRole;
  action: string;
  module: string;
  details: string;
  ip: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

// ---- Notification Preference Types ----
export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'in-app' | 'push';

export interface NotificationPreference {
  id: string;
  category: string;
  channel: NotificationChannel;
  enabled: boolean;
  description: string;
}

// ---- Data Governance Types ----
export interface RetentionPolicy {
  id: string;
  module: string;
  retentionDays: number;
  purgeSchedule: string;
  softDelete: boolean;
  archiveRules: string[];
  status: 'active' | 'paused';
}

export interface DataExportRequest {
  id: string;
  requestedBy: string;
  module: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  format: string;
  size?: string;
}

export interface ConsentLog {
  id: string;
  user: string;
  consentType: string;
  granted: boolean;
  timestamp: string;
  ip: string;
}

// ---- AI Controls Types ----
export interface AIControl {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tokenLimit: number;
  tokenUsed: number;
  moduleAccess: string[];
  mode: 'full' | 'approval-only' | 'suggestion-only';
  promptLogging: boolean;
  safeActionConfirmation: boolean;
  roleQuotas: { role: UserRole; quota: number }[];
}

// ---- Environment Types ----
export interface EnvironmentConfig {
  id: string;
  name: string;
  type: 'staging' | 'production' | 'development';
  status: 'active' | 'inactive';
  apiBaseUrl: string;
  debugMode: boolean;
  logVerbosity: 'debug' | 'info' | 'warn' | 'error';
  featureOverrides: { feature: string; enabled: boolean }[];
  lastDeployed?: string;
}

// ---- Backup Types ----
export interface Backup {
  id: string;
  name: string;
  type: 'automated' | 'manual' | 'snapshot';
  createdAt: string;
  size: string;
  status: 'completed' | 'in-progress' | 'failed';
  retentionDays: number;
  restorePoint?: string;
  modules: string[];
}

// ---- Custom Field Types ----
export type CustomFieldType = 'text' | 'number' | 'dropdown' | 'date' | 'checkbox' | 'multi-select' | 'formula';

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: CustomFieldType;
  module: string;
  required: boolean;
  defaultValue?: string;
  validationRule?: string;
  visibilityRoles: UserRole[];
  options?: string[];
  createdAt: string;
  modifiedAt: string;
}

// ---- Alert Types ----
export interface SettingsAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  detectedAt: string;
  actionUrl?: string;
  dismissed: boolean;
}
