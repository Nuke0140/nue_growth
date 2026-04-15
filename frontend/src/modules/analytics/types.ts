// ============================================
// Analytics BI Module Types
// ============================================

export type AnalyticsPage =
  | 'analytics-dashboard'
  | 'executive-bi'
  | 'custom-dashboard-builder'
  | 'sales-analytics'
  | 'marketing-analytics'
  | 'finance-analytics'
  | 'crm-analytics'
  | 'retention-analytics'
  | 'erp-productivity'
  | 'attribution-report'
  | 'cohort-report'
  | 'report-builder'
  | 'scheduled-reports'
  | 'white-label-client-reports'
  | 'benchmark-comparison'
  | 'anomaly-detection'
  | 'ai-bi-assistant';

// ---- KPI Types ----
export interface KPI {
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

export interface AnalyticsDashboardStats {
  totalLeads: number;
  conversions: number;
  revenue: number;
  campaignROI: number;
  clientProfitability: number;
  churnPercent: number;
  cashRunway: number;
  employeeProductivity: number;
  slaScore: number;
  customerLTV: number;
}

// ---- Executive BI Types ----
export interface BusinessScore {
  label: string;
  score: number;
  maxScore: number;
  trend: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface QuarterlyTrend {
  quarter: string;
  revenue: number;
  profit: number;
  clients: number;
  team: number;
}

// ---- Custom Dashboard Types ----
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'line-chart' | 'bar-chart' | 'pie-chart' | 'funnel' | 'cohort-heatmap' | 'leaderboard' | 'roi' | 'pipeline';
  title: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'personal' | 'team' | 'client' | 'executive';
  widgetCount: number;
  isDefault: boolean;
}

// ---- Sales Analytics Types ----
export interface SalesAnalyticsData {
  winRate: number;
  avgSalesCycle: number;
  dealAging: { label: string; value: number; count: number }[];
  stageDropOff: { stage: string; dropRate: number; dealCount: number }[];
  repLeaderboard: { name: string; deals: number; revenue: number; winRate: number }[];
  forecastAccuracy: number;
  sourceToClose: { source: string; avgDays: number; convRate: number }[];
  lostReasons: { reason: string; percentage: number; count: number }[];
}

// ---- Marketing Analytics Types ----
export interface MarketingAnalyticsData {
  cpl: number;
  cac: number;
  roas: number;
  channelROI: { channel: string; roi: number; spend: number; revenue: number }[];
  adFatigue: { campaign: string; fatigue: number; impressions: number; ctr: number }[];
  contentEngagement: { type: string; views: number; likes: number; shares: number; ctr: number }[];
  emailCTR: number;
  whatsappReplyRate: number;
  funnelConversion: { stage: string; visitors: number; conversion: number }[];
}

// ---- Finance Analytics Types ----
export interface FinanceAnalyticsData {
  pnlTrend: { month: string; revenue: number; expense: number; profit: number }[];
  cashFlow: { month: string; inflow: number; outflow: number; net: number }[];
  receivableAging: { bucket: string; amount: number; count: number }[];
  budgetVariance: { category: string; budget: number; actual: number; variance: number }[];
  runwayMonths: number;
  taxDueTrend: { month: string; amount: number; status: string }[];
  burnByDepartment: { department: string; burn: number; budget: number }[];
  profitabilityByClient: { client: string; margin: number; revenue: number }[];
}

// ---- CRM Analytics Types ----
export interface CRMAnalyticsData {
  leadSourceMix: { source: string; leads: number; conversion: number; revenue: number }[];
  lifecycleConversion: { stage: string; total: number; converted: number; rate: number }[];
  contactEngagement: { metric: string; value: number; change: number }[];
  healthScoreAvg: number;
  pipelineVelocity: { stage: string; avgDays: number; deals: number }[];
  followUpSLA: { withinSLA: number; breached: number; avgResponseHrs: number }[];
  repResponsePerformance: { rep: string; avgResponse: number; meetings: number; conversion: number }[];
}

// ---- Retention Analytics Types ----
export interface RetentionAnalyticsData {
  churnCohorts: { month: string; churnRate: number; total: number; churned: number }[];
  renewalTrend: { month: string; renewed: number; lost: number; revenue: number }[];
  loyaltyUsage: { tier: string; clients: number; avgSpend: number; retention: number }[];
  repeatPurchase: { month: string; repeatRate: number; avgOrders: number }[];
  ltvBySource: { source: string; ltv: number; cac: number; ratio: number }[];
  npsTrend: { month: string; score: number; responses: number }[];
  winbackSuccess: { month: string; attempted: number; won: number; revenue: number }[];
}

// ---- ERP Productivity Types ----
export interface ERPProductivityData {
  projectCompletion: number;
  onTimeDelivery: number;
  utilizationPercent: number;
  approvalCycleTime: number;
  revisionRounds: number;
  blockedTasks: number;
  taskThroughput: { week: string; completed: number; created: number }[];
  employeeProductivity: { employee: string; tasks: number; hours: number; efficiency: number }[];
}

// ---- Attribution Types ----
export interface AttributionData {
  model: 'first-touch' | 'last-touch' | 'linear' | 'ai-weighted';
  revenueBySource: { source: string; revenue: number; percentage: number }[];
  cacByChannel: { channel: string; cac: number; leads: number; spend: number }[];
  touchpointContribution: { touchpoint: string; contribution: number; conversions: number }[];
  assistedConversions: { channel: string; assisted: number; lastTouch: number; overlap: number }[];
}

// ---- Cohort Report Types ----
export interface CohortData {
  cohortLabel: string;
  size: number;
  periods: { period: number; retention: number; ltv: number; churn: number; repeatPercent: number }[];
}

export type CohortView = 'acquisition-month' | 'source-cohorts' | 'service-cohorts' | 'retention-cohorts' | 'revenue-cohorts';

// ---- Report Builder Types ----
export interface ReportSection {
  id: string;
  title: string;
  widgetType: string;
  config: Record<string, unknown>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  brandHeader?: { logo?: string; color?: string; companyName?: string };
  createdAt: string;
  updatedAt: string;
}

// ---- Scheduled Reports Types ----
export interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  deliveryMethod: 'email' | 'whatsapp' | 'link';
  recipients: string[];
  lastRun: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  failureCount: number;
}

// ---- White Label Report Types ----
export interface WhiteLabelReport {
  id: string;
  clientName: string;
  clientLogo?: string;
  primaryColor: string;
  kpis: { label: string; value: string; change: number }[];
  roiSummary: { invested: number; generated: number; roi: number };
  isLive: boolean;
  shareableLink?: string;
  lastUpdated: string;
  accessPermissions: { name: string; email: string; role: string }[];
  comments: { author: string; text: string; date: string }[];
}

// ---- Benchmark Types ----
export interface BenchmarkData {
  metric: string;
  current: number;
  previous: number;
  target: number;
  delta: number;
  deltaPercent: number;
  percentile: number;
  unit: string;
}

export type BenchmarkComparison = 'mom' | 'rep-vs-rep' | 'dept-vs-target' | 'client-vs-industry' | 'branch-vs-branch';

// ---- Anomaly Types ----
export interface Anomaly {
  id: string;
  type: 'revenue-drop' | 'cpl-spike' | 'payroll-anomaly' | 'churn-anomaly' | 'unusual-spend' | 'roi-warning' | 'project-delay';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  detectedAt: string;
  metric: string;
  expected: number;
  actual: number;
  deviation: number;
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  recommendation: string;
}

// ---- AI BI Assistant Types ----
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  charts?: { type: string; title: string; data: Record<string, unknown> }[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  recommendation: string;
}
