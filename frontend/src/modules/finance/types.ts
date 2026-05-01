// ============================================
// Finance Module — AI CFO Type System
// ============================================
// Redesigned: Finance = Business Brain
// Revenue → Expenses → Cashflow → Profit → Forecast → Decisions
// ============================================

// ---- Navigation ----
export type FinancePage =
  | 'dashboard'
  | 'cashflow'
  | 'receivables'
  | 'payables'
  | 'revenue'
  | 'expenses'
  | 'pnl'
  | 'profitability'
  | 'invoices'
  | 'payroll'
  | 'approvals'
  | 'budgets'
  | 'forecasting'
  | 'tax';

// ---- Dashboard — CFO Command Center ----
export interface CFOKPI {
  id: string;
  label: string;
  value: number;
  formatted: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  severity: 'healthy' | 'warning' | 'critical';
  icon: string;
}

export interface CFOFunnelStep {
  stage: string;
  count: number;
  value: number;
  conversionRate: number;
}

export interface CashflowProjection {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
  closingBalance: number;
  isProjected: boolean;
}

// ---- AI Insights (embedded everywhere, not a separate page) ----
export interface AIInsight {
  id: string;
  type: 'cash-alert' | 'payment-risk' | 'overspend' | 'margin-leak' | 'pricing' | 'optimization' | 'churn-risk' | 'tax-alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  potentialSaving: number;
  module?: 'crm' | 'marketing' | 'hr' | 'finance';
  metric?: string;
  currentValue?: number;
  thresholdValue?: number;
  actionLabel?: string;
  actionPage?: FinancePage;
}

// ---- Alert System ----
export interface FinanceAlert {
  id: string;
  type: 'cash-low' | 'expense-high' | 'invoice-overdue' | 'tax-due' | 'runway-low' | 'anomaly';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionPage?: FinancePage;
}

// ---- Cashflow ----
export interface CashFlowEntry {
  date: string;
  openingBalance: number;
  inflow: number;
  outflow: number;
  closingBalance: number;
  inflowBreakdown: { label: string; amount: number }[];
  outflowBreakdown: { label: string; amount: number }[];
}

export interface BurnRateInfo {
  monthlyBurn: number;
  burnTrend: 'increasing' | 'stable' | 'decreasing';
  runwayMonths: number;
  runwaySafetyThreshold: number;
  cashShortageDate?: string;
}

// ---- Receivables (Collection Engine) ----
export interface Receivable {
  id: string;
  client: string;
  invoiceNo: string;
  project: string;
  dueAmount: number;
  overdueDays: number;
  assignedOwner: string;
  paymentProbability: number;
  expectedPaymentDate: string;
  followUpStage: 'first-reminder' | 'second-reminder' | 'escalation' | 'legal' | 'resolved';
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  aiPrediction?: {
    delayProbability: number;
    predictedPaymentDate: string;
    riskFactors: string[];
  };
  disputeNotes?: string;
}

export interface AgingBucket {
  range: string;
  count: number;
  total: number;
  percentage: number;
}

// ---- Payables ----
export interface Payable {
  id: string;
  vendor?: string;
  freelancer?: string;
  amount: number;
  dueDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue';
  payoutPriority: 'high' | 'medium' | 'low';
  penaltyRisk: boolean;
  penaltyAmount?: number;
  linkedInvoice?: string;
  category: string;
  approvalFlow?: ApprovalStep[];
}

export interface ApprovalStep {
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  timestamp?: string;
}

// ---- Revenue Intelligence ----
export interface RevenueEntry {
  month: string;
  revenue: number;
  mrr: number;
  arr: number;
  retainer: number;
  upsell: number;
  renewal: number;
  oneTime: number;
  target: number;
}

export interface RevenueByClient {
  client: string;
  revenue: number;
  mrr: number;
  growth: number;
  services: string[];
  crmDealId?: string;
}

export interface RevenueByService {
  service: string;
  revenue: number;
  projects: number;
  growth: number;
}

export interface CRMDealRevenue {
  dealId: string;
  client: string;
  stage: string;
  dealValue: number;
  probability: number;
  expectedCloseDate: string;
  source: 'crm';
}

// ---- Expense Intelligence ----
export interface Expense {
  id: string;
  description: string;
  category: 'ads' | 'payroll' | 'freelancers' | 'software' | 'office' | 'travel' | 'client-delivery' | 'refunds' | 'other';
  amount: number;
  gstAmount: number;
  total: number;
  date: string;
  project?: string;
  vendor: string;
  receiptUploaded: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  taxCategory: string;
  isAnomaly: boolean;
  budgetId?: string;
  marketingCampaignId?: string;
}

export interface ExpenseCategorySummary {
  category: string;
  total: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  budgetUtilization: number;
}

// ---- Invoices ----
export interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  project: string;
  amount: number;
  gst: number;
  total: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'write-off';
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  items: InvoiceItem[];
  discount?: number;
  isRecurring: boolean;
  recurringCycle?: 'monthly' | 'quarterly' | 'yearly';
  reminders?: number;
  lastViewedDate?: string;
}

export interface InvoiceItem {
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  gstAmount: number;
}

// ---- P&L ----
export interface PnLEntry {
  category: string;
  currentMonth: number;
  previousMonth: number;
  ytd: number;
  variance: number;
  variancePercent: number;
  isSummary?: boolean;
  isBold?: boolean;
  indent?: number;
}

// ---- Profitability ----
export interface ClientProfitability {
  client: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  revisionCost: number;
  deliveryCost: number;
  risk: 'low' | 'medium' | 'high';
  trend: number;
}

export interface ProjectMargin {
  project: string;
  client: string;
  revenue: number;
  budget: number;
  spent: number;
  margin: number;
  status: 'profitable' | 'breakeven' | 'loss';
}

export interface ServiceMargin {
  service: string;
  revenue: number;
  cost: number;
  margin: number;
  projects: number;
  avgRate: number;
}

// ---- Budgets ----
export interface Budget {
  id: string;
  name: string;
  type: 'department' | 'campaign' | 'client' | 'delivery';
  department?: string;
  campaign?: string;
  client?: string;
  allocated: number;
  spent: number;
  remaining: number;
  monthlyCap: number;
  period: string;
  status: 'on-track' | 'at-risk' | 'overspent' | 'locked';
  variance: number;
  variancePercent: number;
}

export interface BudgetTrend {
  month: string;
  allocated: number;
  spent: number;
}

// ---- Payroll ----
export interface PayrollRecord {
  id: string;
  employee: string;
  designation: string;
  department: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  reimbursements: number;
  incentives: number;
  deductions: number;
  tds: number;
  pf: number;
  esi: number;
  grossPay: number;
  netPay: number;
  payDate: string;
  status: 'pending' | 'approved' | 'processed';
  hrEmployeeId?: string;
}

// ---- Approvals ----
export interface FinanceApproval {
  id: string;
  type: 'budget' | 'payout' | 'payroll' | 'expense' | 'discount' | 'refund' | 'write-off' | 'invoice';
  title: string;
  description: string;
  amount: number;
  requestedBy: string;
  requestedDate: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  comments: ApprovalComment[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ApprovalComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// ---- Forecasting & Scenario Planning ----
export interface ForecastEntry {
  metric: string;
  current: number;
  nextMonth: number;
  bestCase: number;
  worstCase: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ScenarioSimulation {
  id: string;
  name: string;
  description: string;
  variable: string;
  changePercent: number;
  projectedRevenue: number;
  projectedProfit: number;
  projectedRunway: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// ---- GST & Tax ----
export interface GSTSummary {
  period: string;
  gstCollected: number;
  cgst: number;
  sgst: number;
  igst: number;
  gstPayable: number;
  gstReceivable: number;
  tds: number;
  tdsDeducted: number;
  taxLiability: number;
  filingStatus: 'filed' | 'pending' | 'overdue';
  filingDueDate: string;
}

export interface TaxFiling {
  id: string;
  period: string;
  type: 'GSTR-1' | 'GSTR-3B' | 'TDS' | 'advance-tax';
  dueDate: string;
  filedDate?: string;
  status: 'filed' | 'pending' | 'overdue';
  amount: number;
}

// ---- Cross-Module Integration ----
export interface CRMIntegration {
  pipelineValue: number;
  weightedPipeline: number;
  dealConversionRate: number;
  avgDealSize: number;
  topDeals: CRMDealRevenue[];
}

export interface MarketingIntegration {
  totalSpend: number;
  roi: number;
  costPerLead: number;
  campaignCount: number;
  topCampaigns: { name: string; spend: number; revenue: number }[];
}

export interface HRIntegration {
  totalPayroll: number;
  headcount: number;
  avgSalary: number;
  pendingHires: number;
  projectedPayrollIncrease: number;
}
