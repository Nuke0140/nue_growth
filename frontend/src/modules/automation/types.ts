// ============================================
// Automation Module Types
// ============================================

export type AutomationPage =
  | 'automation-dashboard'
  | 'workflow-builder'
  | 'trigger-library'
  | 'action-library'
  | 'conditions'
  | 'templates'
  | 'crm-automations'
  | 'sales-automations'
  | 'marketing-journeys'
  | 'finance-automations'
  | 'erp-ops-automations'
  | 'hr-automations'
  | 'notifications'
  | 'webhook-integrations'
  | 'sla-escalation'
  | 'scheduled-jobs'
  | 'ai-autonomous-workflows';

// ---- Dashboard Types ----
export interface AutomationKPI {
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

export interface AutomationDashboardStats {
  activeWorkflows: number;
  successfulRuns: number;
  failedRuns: number;
  hoursSaved: number;
  tasksAutomated: number;
  slaBreachesPrevented: number;
  autonomousActions: number;
  retrySuccessPercent: number;
}

// ---- Workflow Types ----
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'split' | 'loop' | 'ai';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  icon: string;
  module: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  status?: 'idle' | 'running' | 'success' | 'error' | 'skipped';
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft' | 'error';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  version: number;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  avgDuration: number;
  createdBy: string;
  module: string;
  isFavorite: boolean;
}

// ---- Trigger Types ----
export type TriggerCategory = 'crm' | 'sales' | 'marketing' | 'finance' | 'erp' | 'hr' | 'retention' | 'analytics';

export interface Trigger {
  id: string;
  name: string;
  description: string;
  category: TriggerCategory;
  event: string;
  payload: Record<string, unknown>;
  usageCount: number;
  exampleTemplates: string[];
}

// ---- Action Types ----
export type ActionCategory = 'communication' | 'crm-updates' | 'finance-actions' | 'erp-actions' | 'hr-actions' | 'ai-actions' | 'reporting' | 'escalation';

export interface Action {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  icon: string;
  configFields: string[];
  usageCount: number;
}

// ---- Condition Types ----
export type ConditionType = 'numeric' | 'text' | 'date-time' | 'lifecycle-stage' | 'segment-membership' | 'budget-threshold' | 'inactivity-duration' | 'sla-timer';

export interface Condition {
  id: string;
  name: string;
  type: ConditionType;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'between' | 'in' | 'is-empty' | 'is-not-empty';
  field: string;
  value: string | number;
  logic?: 'AND' | 'OR';
}

export interface ConditionRule {
  id: string;
  name: string;
  description: string;
  conditions: Condition[];
  thenAction: string;
  elseAction?: string;
  module: string;
}

// ---- Template Types ----
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodeCount: number;
  popularity: number;
  isFavorite: boolean;
  tags: string[];
  version: string;
  useCount: number;
  module: string;
}

// ---- Execution Types ----
export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running' | 'retrying' | 'timeout';
  startedAt: string;
  completedAt?: string;
  duration: number;
  nodeResults: { nodeId: string; nodeName: string; status: string; duration: number }[];
  errorMessage?: string;
  retryCount: number;
  triggeredBy: string;
}

// ---- Notification Types ----
export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'in-app' | 'push' | 'slack';

export interface NotificationRule {
  id: string;
  name: string;
  channel: NotificationChannel;
  trigger: string;
  template: string;
  recipients: string[];
  retryLogic: { maxAttempts: number; delay: number; fallbackChannel?: NotificationChannel };
  status: 'active' | 'paused' | 'error';
  successRate: number;
  lastSent?: string;
  failureCount: number;
}

// ---- Webhook Types ----
export interface WebhookIntegration {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  event: string;
  authToken?: string;
  headers: Record<string, string>;
  retryAttempts: number;
  lastStatus: 'success' | 'failed' | 'timeout' | 'never';
  lastResponse?: { statusCode: number; body: string };
  responseLogs: { timestamp: string; statusCode: number; duration: number; success: boolean }[];
  failureRate: number;
  eventMapping: Record<string, string>;
}

// ---- SLA Types ----
export interface SLARule {
  id: string;
  name: string;
  description: string;
  module: string;
  timer: string;
  escalationLadder: SLAEscalationStep[];
  teamOverrides: string[];
  analytics: { totalBreaches: number; prevented: number; avgResponseTime: number };
  status: 'active' | 'paused';
}

export interface SLAEscalationStep {
  order: number;
  action: string;
  assignee: string;
  channel: string;
  delay: string;
}

// ---- Scheduled Job Types ----
export interface ScheduledJob {
  id: string;
  name: string;
  schedule: string;
  cron: string;
  lastRun?: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  duration: number;
  successRate: number;
  createdBy: string;
  description: string;
  tags: string[];
}

// ---- AI Autonomous Types ----
export interface AIAutonomousWorkflow {
  id: string;
  name: string;
  description: string;
  capability: string;
  status: 'active' | 'learning' | 'paused';
  metrics: { decisionsMade: number; accuracy: number; timeSaved: number; impact: string };
  examples: { input: string; aiAction: string; outcome: string }[];
  confidence: number;
  lastDecision?: string;
}

// ---- Alert Types ----
export interface AutomationAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  workflowName?: string;
  detectedAt: string;
  actionUrl?: string;
}
