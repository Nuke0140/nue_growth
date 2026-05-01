// ============================================
// Finance Module Types
// ============================================

export type FinancePage =
  | 'finance-dashboard'
  | 'revenue'
  | 'receivables'
  | 'payables'
  | 'invoices'
  | 'expenses'
  | 'budgets'
  | 'gst-tax'
  | 'payouts'
  | 'payroll-finance'
  | 'cashflow'
  | 'pnl'
  | 'profitability'
  | 'approvals'
  | 'forecasting'
  | 'ai-finance-intelligence';

// ---- Dashboard Types ----
export interface FinanceKPI {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  change: number;
  changeLabel: string;
  icon: string;
  severity?: 'normal' | 'warning' | 'critical';
}

export interface FinanceDashboardStats {
  totalRevenue: number;
  pendingReceivables: number;
  pendingPayables: number;
  cashInBank: number;
  burnRate: number;
  runwayMonths: number;
  gstDue: number;
  payrollDue: number;
  profitMargin: number;
  clientProfitability: number;
}

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
}

export interface RevenueByService {
  service: string;
  revenue: number;
  projects: number;
  growth: number;
}

// ---- Receivables Types ----
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
  disputeNotes?: string;
}

// ---- Payables Types ----
export interface Payable {
  id: string;
  vendor?: string;
  freelancer?: string;
  amount: number;
  dueDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue';
  payoutPriority: 'high' | 'medium' | 'low';
  penaltyRisk: boolean;
  linkedInvoice?: string;
  category: string;
}

// ---- Invoice Types ----
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

// ---- Expense Types ----
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
}

// ---- Budget Types ----
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

// ---- GST & Tax Types ----
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

// ---- Payout Types ----
export interface Payout {
  id: string;
  beneficiary: string;
  type: 'freelancer' | 'vendor' | 'refund' | 'salary' | 'reimbursement';
  amount: number;
  method: 'razorpay' | 'upi' | 'bank-transfer' | 'cheque';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
  initiatedDate: string;
  completedDate?: string;
  utrNumber?: string;
  failureReason?: string;
  approvalId?: string;
  batchId?: string;
}

// ---- Payroll Finance Types ----
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
}

// ---- Cash Flow Types ----
export interface CashFlowEntry {
  date: string;
  openingBalance: number;
  inflow: number;
  outflow: number;
  closingBalance: number;
  inflowBreakdown: { label: string; amount: number }[];
  outflowBreakdown: { label: string; amount: number }[];
}

// ---- P&L Types ----
export interface PnLEntry {
  category: string;
  currentMonth: number;
  previousMonth: number;
  ytd: number;
  variance: number;
  variancePercent: number;
}

// ---- Profitability Types ----
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

// ---- Approval Types ----
export interface FinanceApproval {
  id: string;
  type: 'budget' | 'payout' | 'payroll' | 'expense' | 'discount' | 'refund' | 'write-off';
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

// ---- Forecasting Types ----
export interface ForecastEntry {
  metric: string;
  current: number;
  nextMonth: number;
  bestCase: number;
  worstCase: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

// ---- AI Finance Intelligence Types ----
export interface AIFinanceInsight {
  id: string;
  type: 'delayed-payment' | 'margin-leak' | 'overspend-anomaly' | 'low-runway' | 'pricing-recommendation' | 'service-pricing' | 'budget-reallocation' | 'churn-risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  potentialSaving: number;
  client?: string;
  metric?: string;
  currentValue?: number;
  thresholdValue?: number;
}

// ---- Alert Types ----
export interface FinanceAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionUrl?: string;
  createdAt: string;
}
