// ============================================
// Finance Mock Data — Enterprise-Grade CFO Dashboard
// ============================================
import type {
  FinanceDashboardStats, RevenueEntry, RevenueByClient, RevenueByService,
  Receivable, Payable, Invoice, InvoiceItem, Expense, Budget, BudgetTrend,
  GSTSummary, TaxFiling, Payout, PayrollRecord, CashFlowEntry, PnLEntry,
  ClientProfitability, ProjectMargin, ServiceMargin, FinanceApproval,
  ApprovalComment, ForecastEntry, AIFinanceInsight, FinanceAlert,
} from '../types';

// ---- 1. Dashboard Stats ----
export const financeDashboardStats: FinanceDashboardStats = {
  totalRevenue: 48500000,
  pendingReceivables: 8750000,
  pendingPayables: 4280000,
  cashInBank: 12350000,
  burnRate: 3850000,
  runwayMonths: 3.2,
  gstDue: 1245000,
  payrollDue: 2850000,
  profitMargin: 32.4,
  clientProfitability: 67.8,
};

// ---- 2. Revenue Data ----
export const revenueMonthly: RevenueEntry[] = [
  { month: 'Oct 2025', revenue: 3200000, mrr: 2800000, arr: 33600000, retainer: 1800000, upsell: 400000, renewal: 600000, oneTime: 400000, target: 3500000 },
  { month: 'Nov 2025', revenue: 3650000, mrr: 2950000, arr: 35400000, retainer: 1950000, upsell: 520000, renewal: 680000, oneTime: 500000, target: 3500000 },
  { month: 'Dec 2025', revenue: 3900000, mrr: 3100000, arr: 37200000, retainer: 2100000, upsell: 480000, renewal: 820000, oneTime: 500000, target: 3800000 },
  { month: 'Jan 2026', revenue: 4100000, mrr: 3200000, arr: 38400000, retainer: 2200000, upsell: 550000, renewal: 750000, oneTime: 600000, target: 4000000 },
  { month: 'Feb 2026', revenue: 4350000, mrr: 3350000, arr: 40200000, retainer: 2300000, upsell: 620000, renewal: 830000, oneTime: 600000, target: 4200000 },
  { month: 'Mar 2026', revenue: 4800000, mrr: 3500000, arr: 42000000, retainer: 2450000, upsell: 710000, renewal: 940000, oneTime: 700000, target: 4500000 },
  { month: 'Apr 2026', revenue: 5200000, mrr: 3700000, arr: 44400000, retainer: 2600000, upsell: 820000, renewal: 1080000, oneTime: 700000, target: 5000000 },
];

export const revenueByClient: RevenueByClient[] = [
  { client: 'Razorpay', revenue: 8200000, mrr: 680000, growth: 24.5, services: ['UI/UX Design', 'Development', 'Maintenance'] },
  { client: 'Swiggy', revenue: 6500000, mrr: 540000, growth: 18.2, services: ['Branding', 'App Development'] },
  { client: 'Zerodha', revenue: 5800000, mrr: 480000, growth: 32.1, services: ['Product Design', 'Frontend'] },
  { client: 'CRED', revenue: 4900000, mrr: 410000, growth: 12.8, services: ['Marketing Design', 'Campaigns'] },
  { client: 'PhonePe', revenue: 4500000, mrr: 375000, growth: 28.4, services: ['Full-stack Development'] },
  { client: 'Groww', revenue: 3800000, mrr: 320000, growth: 45.2, services: ['UI/UX', 'Backend'] },
  { client: 'Slice', revenue: 3200000, mrr: 270000, growth: -5.3, services: ['App Redesign'] },
  { client: 'Navi', revenue: 2800000, mrr: 230000, growth: 8.7, services: ['Website Development'] },
];

export const revenueByService: RevenueByService[] = [
  { service: 'UI/UX Design', revenue: 14200000, projects: 24, growth: 22.4 },
  { service: 'Full-stack Development', revenue: 12500000, projects: 18, growth: 18.7 },
  { service: 'Branding & Identity', revenue: 6800000, projects: 12, growth: 15.2 },
  { service: 'Product Design', revenue: 5400000, projects: 8, growth: 32.1 },
  { service: 'Marketing Design', revenue: 4200000, projects: 15, growth: -3.8 },
  { service: 'Maintenance & Support', revenue: 3600000, projects: 22, growth: 8.4 },
  { service: 'Mobile App Development', revenue: 1800000, projects: 4, growth: 42.5 },
];

// ---- 3. Receivables ----
export const receivables: Receivable[] = [
  { id: 'recv-01', client: 'Razorpay', invoiceNo: 'INV-2026-041', project: 'Dashboard Redesign', dueAmount: 1850000, overdueDays: 12, assignedOwner: 'Priya Sharma', paymentProbability: 92, expectedPaymentDate: '2026-04-22', followUpStage: 'second-reminder', agingBucket: '31-60' },
  { id: 'recv-02', client: 'Swiggy', invoiceNo: 'INV-2026-038', project: 'App Rebrand', dueAmount: 2400000, overdueDays: 5, assignedOwner: 'Arjun Mehta', paymentProbability: 88, expectedPaymentDate: '2026-04-18', followUpStage: 'first-reminder', agingBucket: '31-60' },
  { id: 'recv-03', client: 'CRED', invoiceNo: 'INV-2026-035', project: 'Campaign Design', dueAmount: 950000, overdueDays: 25, assignedOwner: 'Meera Patel', paymentProbability: 65, expectedPaymentDate: '2026-05-05', followUpStage: 'escalation', agingBucket: '31-60' },
  { id: 'recv-04', client: 'Slice', invoiceNo: 'INV-2026-030', project: 'App Redesign', dueAmount: 1200000, overdueDays: 48, assignedOwner: 'Vikram Joshi', paymentProbability: 42, expectedPaymentDate: '2026-05-15', followUpStage: 'legal', agingBucket: '90+', disputeNotes: 'Disputed scope changes — 3 revision rounds exceeded SOW' },
  { id: 'recv-05', client: 'Navi', invoiceNo: 'INV-2026-043', project: 'Website Dev', dueAmount: 650000, overdueDays: 0, assignedOwner: 'Priya Sharma', paymentProbability: 95, expectedPaymentDate: '2026-04-30', followUpStage: 'first-reminder', agingBucket: '0-30' },
  { id: 'recv-06', client: 'Groww', invoiceNo: 'INV-2026-040', project: 'UI/UX Overhaul', dueAmount: 1100000, overdueDays: 8, assignedOwner: 'Deepika Nair', paymentProbability: 82, expectedPaymentDate: '2026-04-20', followUpStage: 'first-reminder', agingBucket: '31-60' },
  { id: 'recv-07', client: 'PhonePe', invoiceNo: 'INV-2026-037', project: 'Payment Module', dueAmount: 1750000, overdueDays: 15, assignedOwner: 'Arjun Mehta', paymentProbability: 78, expectedPaymentDate: '2026-04-25', followUpStage: 'second-reminder', agingBucket: '31-60' },
  { id: 'recv-08', client: 'Zerodha', invoiceNo: 'INV-2026-044', project: 'Product Design', dueAmount: 800000, overdueDays: 0, assignedOwner: 'Meera Patel', paymentProbability: 98, expectedPaymentDate: '2026-05-10', followUpStage: 'first-reminder', agingBucket: '0-30' },
];

// ---- 4. Payables ----
export const payables: Payable[] = [
  { id: 'pay-01', vendor: 'Adobe Creative Cloud', amount: 285000, dueDate: '2026-04-15', approvalStatus: 'approved', payoutPriority: 'high', penaltyRisk: false, linkedInvoice: 'VINV-001', category: 'Software' },
  { id: 'pay-02', vendor: 'AWS India', amount: 680000, dueDate: '2026-04-20', approvalStatus: 'approved', payoutPriority: 'high', penaltyRisk: false, linkedInvoice: 'VINV-002', category: 'Infrastructure' },
  { id: 'pay-03', freelancer: 'Amit Kumar', amount: 185000, dueDate: '2026-04-18', approvalStatus: 'pending', payoutPriority: 'medium', penaltyRisk: false, category: 'Freelance' },
  { id: 'pay-04', freelancer: 'Sneha Design Studio', amount: 320000, dueDate: '2026-04-25', approvalStatus: 'pending', payoutPriority: 'high', penaltyRisk: true, category: 'Freelance' },
  { id: 'pay-05', vendor: 'WeWork Coworking', amount: 450000, dueDate: '2026-04-30', approvalStatus: 'approved', payoutPriority: 'medium', penaltyRisk: false, linkedInvoice: 'VINV-005', category: 'Office' },
  { id: 'pay-06', vendor: 'Google Workspace', amount: 142000, dueDate: '2026-04-12', approvalStatus: 'paid', payoutPriority: 'low', penaltyRisk: false, linkedInvoice: 'VINV-006', category: 'Software' },
  { id: 'pay-07', freelancer: 'Rahul Frontend Dev', amount: 240000, dueDate: '2026-04-22', approvalStatus: 'pending', payoutPriority: 'medium', penaltyRisk: false, category: 'Freelance' },
  { id: 'pay-08', vendor: 'Vercel Pro', amount: 96000, dueDate: '2026-04-28', approvalStatus: 'approved', payoutPriority: 'low', penaltyRisk: false, linkedInvoice: 'VINV-008', category: 'Software' },
  { id: 'pay-09', vendor: 'Figma Enterprise', amount: 78000, dueDate: '2026-04-15', approvalStatus: 'approved', payoutPriority: 'low', penaltyRisk: false, category: 'Software' },
  { id: 'pay-10', vendor: 'Jio Business Fiber', amount: 24000, dueDate: '2026-04-10', approvalStatus: 'overdue', payoutPriority: 'high', penaltyRisk: true, linkedInvoice: 'VINV-010', category: 'Infrastructure' },
];

// ---- 5. Invoices ----
export const invoices: Invoice[] = [
  {
    id: 'inv-01', invoiceNo: 'INV-2026-045', client: 'Razorpay', project: 'Dashboard Redesign Phase 2', amount: 2200000, gst: 396000, total: 2596000,
    status: 'sent', issuedDate: '2026-04-10', dueDate: '2026-05-10', isRecurring: false,
    items: [
      { description: 'UI/UX Design — 12 screens', hsnSac: '998314', quantity: 1, rate: 1200000, amount: 1200000, gstRate: 18, gstAmount: 216000 },
      { description: 'Frontend Development — React', hsnSac: '998313', quantity: 1, rate: 1000000, amount: 1000000, gstRate: 18, gstAmount: 180000 },
    ],
  },
  {
    id: 'inv-02', invoiceNo: 'INV-2026-044', client: 'Zerodha', project: 'Product Design Sprint', amount: 800000, gst: 144000, total: 944000,
    status: 'viewed', issuedDate: '2026-04-08', dueDate: '2026-05-08', isRecurring: false, lastViewedDate: '2026-04-11',
    items: [
      { description: 'Product Design Sprint — 4 weeks', hsnSac: '998314', quantity: 1, rate: 800000, amount: 800000, gstRate: 18, gstAmount: 144000 },
    ],
  },
  {
    id: 'inv-03', invoiceNo: 'INV-2026-043', client: 'Navi', project: 'Website Development', amount: 650000, gst: 117000, total: 767000,
    status: 'paid', issuedDate: '2026-03-20', dueDate: '2026-04-20', paidDate: '2026-04-18', paymentMethod: 'Bank Transfer', isRecurring: false,
    items: [
      { description: 'Website Design & Development', hsnSac: '998313', quantity: 1, rate: 650000, amount: 650000, gstRate: 18, gstAmount: 117000 },
    ],
  },
  {
    id: 'inv-04', invoiceNo: 'INV-2026-042', client: 'Groww', project: 'UI/UX Overhaul', amount: 1100000, gst: 198000, total: 1298000,
    status: 'overdue', issuedDate: '2026-03-15', dueDate: '2026-04-14', isRecurring: false, reminders: 3,
    items: [
      { description: 'UX Research & Wireframes', hsnSac: '998314', quantity: 1, rate: 350000, amount: 350000, gstRate: 18, gstAmount: 63000 },
      { description: 'Visual Design System', hsnSac: '998314', quantity: 1, rate: 400000, amount: 400000, gstRate: 18, gstAmount: 72000 },
      { description: 'Design QA — 40 screens', hsnSac: '998314', quantity: 40, rate: 8750, amount: 350000, gstRate: 18, gstAmount: 63000 },
    ],
  },
  {
    id: 'inv-05', invoiceNo: 'INV-2026-041', client: 'Razorpay', project: 'Dashboard Redesign', amount: 1850000, gst: 333000, total: 2183000,
    status: 'overdue', issuedDate: '2026-03-10', dueDate: '2026-04-10', isRecurring: false, reminders: 4,
    items: [
      { description: 'Dashboard UI Redesign', hsnSac: '998314', quantity: 1, rate: 1200000, amount: 1200000, gstRate: 18, gstAmount: 216000 },
      { description: 'Data Visualization Components', hsnSac: '998314', quantity: 1, rate: 650000, amount: 650000, gstRate: 18, gstAmount: 117000 },
    ],
  },
  {
    id: 'inv-06', invoiceNo: 'INV-2026-RET-001', client: 'Swiggy', project: 'Retainer — Ongoing Design Support', amount: 540000, gst: 97200, total: 637200,
    status: 'sent', issuedDate: '2026-04-01', dueDate: '2026-04-30', isRecurring: true, recurringCycle: 'monthly',
    items: [
      { description: 'Monthly Retainer — Design Support', hsnSac: '998314', quantity: 1, rate: 540000, amount: 540000, gstRate: 18, gstAmount: 97200 },
    ],
  },
  {
    id: 'inv-07', invoiceNo: 'INV-2026-039', client: 'PhonePe', project: 'Payment Module UI', amount: 1750000, gst: 315000, total: 2065000,
    status: 'overdue', issuedDate: '2026-02-28', dueDate: '2026-03-30', isRecurring: false, reminders: 5,
    items: [
      { description: 'Payment Flow Design', hsnSac: '998314', quantity: 1, rate: 900000, amount: 900000, gstRate: 18, gstAmount: 162000 },
      { description: 'Frontend Implementation', hsnSac: '998313', quantity: 1, rate: 850000, amount: 850000, gstRate: 18, gstAmount: 153000 },
    ],
  },
  {
    id: 'inv-08', invoiceNo: 'INV-2026-040', client: 'Swiggy', project: 'App Rebrand Phase 1', amount: 2400000, gst: 432000, total: 2832000,
    status: 'overdue', issuedDate: '2026-03-05', dueDate: '2026-04-05', isRecurring: false, reminders: 3,
    items: [
      { description: 'Brand Identity System', hsnSac: '998314', quantity: 1, rate: 800000, amount: 800000, gstRate: 18, gstAmount: 144000 },
      { description: 'App Icon & Marketing Collateral', hsnSac: '998314', quantity: 1, rate: 600000, amount: 600000, gstRate: 18, gstAmount: 108000 },
      { description: 'App UI Redesign — 28 screens', hsnSac: '998314', quantity: 1, rate: 1000000, amount: 1000000, gstRate: 18, gstAmount: 180000 },
    ],
  },
];

// ---- 6. Expenses ----
export const expenses: Expense[] = [
  { id: 'exp-01', description: 'Google Ads — April Campaign', category: 'ads', amount: 450000, gstAmount: 81000, total: 531000, date: '2026-04-01', vendor: 'Google Ads', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Marketing', isAnomaly: false },
  { id: 'exp-02', description: 'Meta Ads — Performance Campaign', category: 'ads', amount: 320000, gstAmount: 57600, total: 377600, date: '2026-04-02', vendor: 'Meta Ads', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Marketing', isAnomaly: false },
  { id: 'exp-03', description: 'Team Lunch — Client Onboarding', category: 'office', amount: 18500, gstAmount: 3330, total: 21830, date: '2026-04-05', vendor: 'Punjabi Grill', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Entertainment', isAnomaly: false },
  { id: 'exp-04', description: 'Flight — Bangalore to Mumbai', category: 'travel', amount: 8400, gstAmount: 1512, total: 9912, date: '2026-04-08', vendor: 'IndiGo', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Travel', isAnomaly: false },
  { id: 'exp-05', description: 'AWS Infrastructure — April', category: 'software', amount: 680000, gstAmount: 122400, total: 802400, date: '2026-04-01', vendor: 'AWS India', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Infrastructure', isAnomaly: true },
  { id: 'exp-06', description: 'Figma Enterprise — Annual', category: 'software', amount: 78000, gstAmount: 14040, total: 92040, date: '2026-04-01', vendor: 'Figma', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Software', isAnomaly: false },
  { id: 'exp-07', description: 'Freelancer — Amit Kumar — UI Design', category: 'freelancers', amount: 185000, gstAmount: 33300, total: 218300, date: '2026-04-10', vendor: 'Amit Kumar', receiptUploaded: true, approvalStatus: 'pending', approvedBy: undefined, taxCategory: 'Freelance', isAnomaly: false },
  { id: 'exp-08', description: 'Client Delivery — Swiggy Rebrand Assets', category: 'client-delivery', amount: 95000, gstAmount: 17100, total: 112100, date: '2026-04-12', vendor: 'PrintBox', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Delivery', isAnomaly: false },
  { id: 'exp-09', description: 'Refund — Razorpay Phase 1 Partial', category: 'refunds', amount: 120000, gstAmount: 21600, total: 141600, date: '2026-04-03', vendor: 'Razorpay', receiptUploaded: true, approvalStatus: 'pending', taxCategory: 'Refund', isAnomaly: true },
  { id: 'exp-10', description: 'Oyo Stay — Client Visit Mumbai', category: 'travel', amount: 6200, gstAmount: 1116, total: 7316, date: '2026-04-09', vendor: 'Oyo Rooms', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Travel', isAnomaly: false },
  { id: 'exp-11', description: 'LinkedIn Premium — Sales Navigator', category: 'software', amount: 42000, gstAmount: 7560, total: 49560, date: '2026-04-01', vendor: 'LinkedIn', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Software', isAnomaly: false },
  { id: 'exp-12', description: 'Office Rent — April', category: 'office', amount: 350000, gstAmount: 63000, total: 413000, date: '2026-04-01', vendor: 'WeWork', receiptUploaded: true, approvalStatus: 'approved', taxCategory: 'Rent', isAnomaly: false },
];

// ---- 7. Budgets ----
export const budgets: Budget[] = [
  { id: 'bud-01', name: 'Design Team Ops', type: 'department', department: 'Design', allocated: 4500000, spent: 3200000, remaining: 1300000, monthlyCap: 400000, period: 'Q2 2026', status: 'on-track', variance: 1300000, variancePercent: 28.9 },
  { id: 'bud-02', name: 'Marketing — Lead Gen Q2', type: 'campaign', campaign: 'H1 Lead Gen', allocated: 2500000, spent: 2100000, remaining: 400000, monthlyCap: 850000, period: 'Q2 2026', status: 'at-risk', variance: 400000, variancePercent: 16.0 },
  { id: 'bud-03', name: 'Razorpay Project Budget', type: 'client', client: 'Razorpay', allocated: 8000000, spent: 5200000, remaining: 2800000, monthlyCap: 1200000, period: 'FY26', status: 'on-track', variance: 2800000, variancePercent: 35.0 },
  { id: 'bud-04', name: 'Swiggy Delivery', type: 'delivery', client: 'Swiggy', allocated: 5000000, spent: 4800000, remaining: 200000, monthlyCap: 800000, period: 'FY26', status: 'overspent', variance: -200000, variancePercent: -4.0 },
  { id: 'bud-05', name: 'Infrastructure & SaaS', type: 'department', department: 'Engineering', allocated: 1800000, spent: 980000, remaining: 820000, monthlyCap: 160000, period: 'Q2 2026', status: 'on-track', variance: 820000, variancePercent: 45.6 },
  { id: 'bud-06', name: 'Freelancer Budget', type: 'department', department: 'Operations', allocated: 1200000, spent: 1150000, remaining: 50000, monthlyCap: 100000, period: 'Q2 2026', status: 'at-risk', variance: 50000, variancePercent: 4.2 },
  { id: 'bud-07', name: 'CRED Campaign Design', type: 'campaign', campaign: 'CRED Branding', allocated: 1800000, spent: 1900000, remaining: -100000, monthlyCap: 350000, period: 'Q1 2026', status: 'overspent', variance: -100000, variancePercent: -5.6 },
  { id: 'bud-08', name: 'Travel & Entertainment', type: 'department', department: 'All', allocated: 600000, spent: 245000, remaining: 355000, monthlyCap: 60000, period: 'Q2 2026', status: 'on-track', variance: 355000, variancePercent: 59.2 },
];

export const budgetTrends: BudgetTrend[] = [
  { month: 'Jan', allocated: 400000, spent: 340000 },
  { month: 'Feb', allocated: 400000, spent: 380000 },
  { month: 'Mar', allocated: 400000, spent: 420000 },
  { month: 'Apr', allocated: 400000, spent: 360000 },
  { month: 'May', allocated: 400000, spent: 310000 },
  { month: 'Jun', allocated: 400000, spent: 290000 },
];

// ---- 8. GST & Tax ----
export const gstSummaries: GSTSummary[] = [
  { period: 'Oct 2025', gstCollected: 576000, cgst: 288000, sgst: 288000, igst: 0, gstPayable: 420000, gstReceivable: 86000, tds: 124000, tdsDeducted: 145000, taxLiability: 458000, filingStatus: 'filed', filingDueDate: '2025-11-20' },
  { period: 'Nov 2025', gstCollected: 657000, cgst: 328500, sgst: 328500, igst: 0, gstPayable: 480000, gstReceivable: 92000, tds: 138000, tdsDeducted: 160000, taxLiability: 526000, filingStatus: 'filed', filingDueDate: '2025-12-20' },
  { period: 'Dec 2025', gstCollected: 702000, cgst: 351000, sgst: 351000, igst: 0, gstPayable: 510000, gstReceivable: 98000, tds: 145000, tdsDeducted: 172000, taxLiability: 557000, filingStatus: 'filed', filingDueDate: '2026-01-20' },
  { period: 'Jan 2026', gstCollected: 738000, cgst: 369000, sgst: 369000, igst: 0, gstPayable: 540000, gstReceivable: 105000, tds: 152000, tdsDeducted: 180000, taxLiability: 587000, filingStatus: 'filed', filingDueDate: '2026-02-20' },
  { period: 'Feb 2026', gstCollected: 783000, cgst: 391500, sgst: 391500, igst: 0, gstPayable: 570000, gstReceivable: 112000, tds: 160000, tdsDeducted: 190000, taxLiability: 618000, filingStatus: 'filed', filingDueDate: '2026-03-20' },
  { period: 'Mar 2026', gstCollected: 864000, cgst: 432000, sgst: 432000, igst: 0, gstPayable: 630000, gstReceivable: 128000, tds: 170000, tdsDeducted: 205000, taxLiability: 672000, filingStatus: 'pending', filingDueDate: '2026-04-20' },
];

export const taxFilings: TaxFiling[] = [
  { id: 'tax-01', period: 'Oct 2025', type: 'GSTR-1', dueDate: '2025-11-11', filedDate: '2025-11-09', status: 'filed', amount: 576000 },
  { id: 'tax-02', period: 'Oct 2025', type: 'GSTR-3B', dueDate: '2025-11-20', filedDate: '2025-11-18', status: 'filed', amount: 420000 },
  { id: 'tax-03', period: 'Nov 2025', type: 'GSTR-1', dueDate: '2025-12-11', filedDate: '2025-12-10', status: 'filed', amount: 657000 },
  { id: 'tax-04', period: 'Nov 2025', type: 'GSTR-3B', dueDate: '2025-12-20', filedDate: '2025-12-19', status: 'filed', amount: 480000 },
  { id: 'tax-05', period: 'Dec 2025', type: 'GSTR-1', dueDate: '2026-01-11', filedDate: '2026-01-10', status: 'filed', amount: 702000 },
  { id: 'tax-06', period: 'Dec 2025', type: 'GSTR-3B', dueDate: '2026-01-20', filedDate: '2026-01-18', status: 'filed', amount: 510000 },
  { id: 'tax-07', period: 'Jan 2026', type: 'GSTR-1', dueDate: '2026-02-11', filedDate: '2026-02-10', status: 'filed', amount: 738000 },
  { id: 'tax-08', period: 'Jan 2026', type: 'GSTR-3B', dueDate: '2026-02-20', filedDate: '2026-02-20', status: 'filed', amount: 540000 },
  { id: 'tax-09', period: 'Feb 2026', type: 'GSTR-1', dueDate: '2026-03-11', filedDate: '2026-03-11', status: 'filed', amount: 783000 },
  { id: 'tax-10', period: 'Feb 2026', type: 'GSTR-3B', dueDate: '2026-03-20', filedDate: '2026-03-20', status: 'filed', amount: 570000 },
  { id: 'tax-11', period: 'Mar 2026', type: 'GSTR-1', dueDate: '2026-04-11', status: 'overdue', amount: 864000 },
  { id: 'tax-12', period: 'Mar 2026', type: 'GSTR-3B', dueDate: '2026-04-20', status: 'pending', amount: 630000 },
  { id: 'tax-13', period: 'Q4 FY26', type: 'TDS', dueDate: '2026-05-31', status: 'pending', amount: 505000 },
  { id: 'tax-14', period: 'Q4 FY26', type: 'advance-tax', dueDate: '2026-03-15', filedDate: '2026-03-14', status: 'filed', amount: 450000 },
];

// ---- 9. Payouts ----
export const payouts: Payout[] = [
  { id: 'payout-01', beneficiary: 'Amit Kumar', type: 'freelancer', amount: 185000, method: 'bank-transfer', status: 'pending', initiatedDate: '2026-04-10', approvalId: 'appr-01' },
  { id: 'payout-02', beneficiary: 'Sneha Design Studio', type: 'vendor', amount: 320000, method: 'bank-transfer', status: 'processing', initiatedDate: '2026-04-09', approvalId: 'appr-02' },
  { id: 'payout-03', beneficiary: 'Google Ads', type: 'vendor', amount: 531000, method: 'razorpay', status: 'completed', initiatedDate: '2026-04-01', completedDate: '2026-04-01', utrNumber: 'UTR2026040112345' },
  { id: 'payout-04', beneficiary: 'Rahul Frontend Dev', type: 'freelancer', amount: 240000, method: 'upi', status: 'pending', initiatedDate: '2026-04-11', approvalId: 'appr-03' },
  { id: 'payout-05', beneficiary: 'WeWork Coworking', type: 'vendor', amount: 413000, method: 'bank-transfer', status: 'completed', initiatedDate: '2026-04-01', completedDate: '2026-04-03', utrNumber: 'UTR2026040398765' },
  { id: 'payout-06', beneficiary: 'AWS India', type: 'vendor', amount: 802400, method: 'razorpay', status: 'completed', initiatedDate: '2026-04-01', completedDate: '2026-04-01', utrNumber: 'UTR2026040154321' },
  { id: 'payout-07', beneficiary: 'Vikram Freelance', type: 'freelancer', amount: 95000, method: 'upi', status: 'failed', initiatedDate: '2026-04-08', failureReason: 'UPI ID inactive — beneficiary bank account closed' },
  { id: 'payout-08', beneficiary: 'Client Refund — Slice', type: 'refund', amount: 120000, method: 'bank-transfer', status: 'retrying', initiatedDate: '2026-04-05', approvalId: 'appr-04' },
];

// ---- 10. Payroll ----
export const payrollRecords: PayrollRecord[] = [
  { id: 'payroll-01', employee: 'Priya Sharma', designation: 'Design Lead', department: 'Design', basicSalary: 120000, hra: 48000, allowances: 15000, reimbursements: 8000, incentives: 20000, deductions: 5000, tds: 18500, pf: 14400, esi: 1750, grossPay: 203000, netPay: 163350, payDate: '2026-04-01', status: 'processed' },
  { id: 'payroll-02', employee: 'Arjun Mehta', designation: 'Senior Developer', department: 'Engineering', basicSalary: 110000, hra: 44000, allowances: 12000, reimbursements: 5000, incentives: 15000, deductions: 4000, tds: 16000, pf: 13200, esi: 1625, grossPay: 186000, netPay: 151175, payDate: '2026-04-01', status: 'processed' },
  { id: 'payroll-03', employee: 'Meera Patel', designation: 'Account Manager', department: 'Sales', basicSalary: 95000, hra: 38000, allowances: 10000, reimbursements: 6000, incentives: 25000, deductions: 3500, tds: 14000, pf: 11400, esi: 1375, grossPay: 174000, netPay: 143725, payDate: '2026-04-01', status: 'processed' },
  { id: 'payroll-04', employee: 'Vikram Joshi', designation: 'Frontend Developer', department: 'Engineering', basicSalary: 85000, hra: 34000, allowances: 8000, reimbursements: 4000, incentives: 10000, deductions: 3000, tds: 12000, pf: 10200, esi: 1225, grossPay: 141000, netPay: 114575, payDate: '2026-04-01', status: 'processed' },
  { id: 'payroll-05', employee: 'Deepika Nair', designation: 'UX Researcher', department: 'Design', basicSalary: 90000, hra: 36000, allowances: 9000, reimbursements: 5000, incentives: 12000, deductions: 3200, tds: 13000, pf: 10800, esi: 1325, grossPay: 152000, netPay: 123675, payDate: '2026-04-01', status: 'processed' },
  { id: 'payroll-06', employee: 'Rahul Verma', designation: 'Marketing Manager', department: 'Marketing', basicSalary: 88000, hra: 35200, allowances: 8500, reimbursements: 4500, incentives: 18000, deductions: 3100, tds: 12500, pf: 10560, esi: 1275, grossPay: 154200, netPay: 126765, payDate: '2026-04-01', status: 'approved' },
];

// ---- 11. Cash Flow ----
export const cashFlowData: CashFlowEntry[] = [
  { date: '2026-04-01', openingBalance: 11500000, inflow: 4200000, outflow: 2800000, closingBalance: 12900000, inflowBreakdown: [{ label: 'Client Payments', amount: 3200000 }, { label: 'Retainer', amount: 540000 }, { label: 'Other', amount: 460000 }], outflowBreakdown: [{ label: 'Payroll', amount: 1200000 }, { label: 'Infrastructure', amount: 680000 }, { label: 'Software', amount: 340000 }, { label: 'Rent', amount: 350000 }, { label: 'Other', amount: 230000 }] },
  { date: '2026-04-02', openingBalance: 12900000, inflow: 850000, outflow: 520000, closingBalance: 13230000, inflowBreakdown: [{ label: 'Project Milestone', amount: 850000 }], outflowBreakdown: [{ label: 'Freelancer', amount: 320000 }, { label: 'Travel', amount: 200000 }] },
  { date: '2026-04-03', openingBalance: 13230000, inflow: 0, outflow: 141600, closingBalance: 13088400, inflowBreakdown: [], outflowBreakdown: [{ label: 'Refund', amount: 120000 }, { label: 'Ads', amount: 21600 }] },
  { date: '2026-04-04', openingBalance: 13088400, inflow: 0, outflow: 45000, closingBalance: 13043400, inflowBreakdown: [], outflowBreakdown: [{ label: 'Misc', amount: 45000 }] },
  { date: '2026-04-05', openingBalance: 13043400, inflow: 1200000, outflow: 850000, closingBalance: 13388400, inflowBreakdown: [{ label: 'Invoice Payment', amount: 1200000 }], outflowBreakdown: [{ label: 'Vendor', amount: 450000 }, { label: 'Entertainment', amount: 18500 }, { label: 'Other', amount: 381500 }] },
  { date: '2026-04-08', openingBalance: 13388400, inflow: 0, outflow: 17228, closingBalance: 13371172, inflowBreakdown: [], outflowBreakdown: [{ label: 'Flight', amount: 8400 }, { label: 'Hotel', amount: 6200 }, { label: 'Other', amount: 2628 }] },
  { date: '2026-04-10', openingBalance: 13371172, inflow: 637200, outflow: 218300, closingBalance: 13790072, inflowBreakdown: [{ label: 'Retainer', amount: 540000 }, { label: 'New Invoice', amount: 97200 }], outflowBreakdown: [{ label: 'Freelancer', amount: 185000 }, { label: 'GST', amount: 33300 }] },
];

// ---- 12. P&L ----
export const pnlData: PnLEntry[] = [
  { category: 'Revenue — Retainer', currentMonth: 2600000, previousMonth: 2450000, ytd: 15450000, variance: 150000, variancePercent: 6.1 },
  { category: 'Revenue — Projects', currentMonth: 2600000, previousMonth: 2350000, ytd: 14100000, variance: 250000, variancePercent: 10.6 },
  { category: 'Total Revenue', currentMonth: 5200000, previousMonth: 4800000, ytd: 29550000, variance: 400000, variancePercent: 8.3 },
  { category: 'COGS — Freelance', currentMonth: 585000, previousMonth: 520000, ytd: 3285000, variance: 65000, variancePercent: 12.5 },
  { category: 'COGS — Delivery', currentMonth: 112000, previousMonth: 95000, ytd: 615000, variance: 17000, variancePercent: 17.9 },
  { category: 'Total COGS', currentMonth: 697000, previousMonth: 615000, ytd: 3900000, variance: 82000, variancePercent: 13.3 },
  { category: 'Gross Margin', currentMonth: 4503000, previousMonth: 4185000, ytd: 25650000, variance: 318000, variancePercent: 7.6 },
  { category: 'Payroll', currentMonth: 835000, previousMonth: 820000, ytd: 4965000, variance: 15000, variancePercent: 1.8 },
  { category: 'Software & Infra', currentMonth: 680000, previousMonth: 640000, ytd: 3880000, variance: 40000, variancePercent: 6.3 },
  { category: 'Office & Admin', currentMonth: 413000, previousMonth: 400000, ytd: 2413000, variance: 13000, variancePercent: 3.3 },
  { category: 'Marketing Spend', currentMonth: 770000, previousMonth: 720000, ytd: 4420000, variance: 50000, variancePercent: 6.9 },
  { category: 'Travel & Misc', currentMonth: 52000, previousMonth: 48000, ytd: 290000, variance: 4000, variancePercent: 8.3 },
  { category: 'Total OpEx', currentMonth: 2750000, previousMonth: 2628000, ytd: 15968000, variance: 122000, variancePercent: 4.6 },
  { category: 'EBITDA', currentMonth: 1753000, previousMonth: 1557000, ytd: 9682000, variance: 196000, variancePercent: 12.6 },
  { category: 'Depreciation & Amort.', currentMonth: 85000, previousMonth: 85000, ytd: 510000, variance: 0, variancePercent: 0.0 },
  { category: 'Net Profit', currentMonth: 1668000, previousMonth: 1472000, ytd: 9172000, variance: 196000, variancePercent: 13.3 },
  { category: 'Net Margin %', currentMonth: 32.1, previousMonth: 30.7, ytd: 31.0, variance: 1.4, variancePercent: 4.6 },
];

// ---- 13. Profitability ----
export const clientProfitability: ClientProfitability[] = [
  { client: 'Razorpay', revenue: 8200000, cost: 3800000, profit: 4400000, margin: 53.7, revisionCost: 180000, deliveryCost: 420000, risk: 'low', trend: 4.2 },
  { client: 'Swiggy', revenue: 6500000, cost: 3500000, profit: 3000000, margin: 46.2, revisionCost: 320000, deliveryCost: 380000, risk: 'low', trend: 2.8 },
  { client: 'Zerodha', revenue: 5800000, cost: 2400000, profit: 3400000, margin: 58.6, revisionCost: 90000, deliveryCost: 280000, risk: 'low', trend: 6.1 },
  { client: 'CRED', revenue: 4900000, cost: 3100000, profit: 1800000, margin: 36.7, revisionCost: 520000, deliveryCost: 350000, risk: 'medium', trend: -3.4 },
  { client: 'PhonePe', revenue: 4500000, cost: 2900000, profit: 1600000, margin: 35.6, revisionCost: 240000, deliveryCost: 410000, risk: 'medium', trend: 1.2 },
  { client: 'Groww', revenue: 3800000, cost: 1800000, profit: 2000000, margin: 52.6, revisionCost: 120000, deliveryCost: 180000, risk: 'low', trend: 8.5 },
  { client: 'Slice', revenue: 3200000, cost: 2800000, profit: 400000, margin: 12.5, revisionCost: 680000, deliveryCost: 320000, risk: 'high', trend: -12.4 },
  { client: 'Navi', revenue: 2800000, cost: 1600000, profit: 1200000, margin: 42.9, revisionCost: 80000, deliveryCost: 150000, risk: 'low', trend: 5.7 },
];

export const projectMargins: ProjectMargin[] = [
  { project: 'Razorpay Dashboard v2', client: 'Razorpay', revenue: 3200000, budget: 3000000, spent: 2200000, margin: 31.3, status: 'profitable' },
  { project: 'Swiggy App Rebrand', client: 'Swiggy', revenue: 4800000, budget: 5000000, spent: 4800000, margin: 0.0, status: 'breakeven' },
  { project: 'Zerodha Product Sprint', client: 'Zerodha', revenue: 2400000, budget: 2000000, spent: 1400000, margin: 41.7, status: 'profitable' },
  { project: 'CRED Campaign Design', client: 'CRED', revenue: 1800000, budget: 1800000, spent: 2200000, margin: -22.2, status: 'loss' },
  { project: 'PhonePe Payment Module', client: 'PhonePe', revenue: 2600000, budget: 2500000, spent: 2400000, margin: 7.7, status: 'profitable' },
  { project: 'Groww UI Overhaul', client: 'Groww', revenue: 2000000, budget: 1800000, spent: 1100000, margin: 45.0, status: 'profitable' },
];

export const serviceMargins: ServiceMargin[] = [
  { service: 'UI/UX Design', revenue: 14200000, cost: 6800000, margin: 52.1, projects: 24, avgRate: 591667 },
  { service: 'Full-stack Development', revenue: 12500000, cost: 7500000, margin: 40.0, projects: 18, avgRate: 694444 },
  { service: 'Branding & Identity', revenue: 6800000, cost: 3200000, margin: 52.9, projects: 12, avgRate: 566667 },
  { service: 'Product Design', revenue: 5400000, cost: 2400000, margin: 55.6, projects: 8, avgRate: 675000 },
  { service: 'Marketing Design', revenue: 4200000, cost: 2900000, margin: 31.0, projects: 15, avgRate: 280000 },
  { service: 'Maintenance & Support', revenue: 3600000, cost: 1800000, margin: 50.0, projects: 22, avgRate: 163636 },
  { service: 'Mobile App Development', revenue: 1800000, cost: 1200000, margin: 33.3, projects: 4, avgRate: 450000 },
];

// ---- 14. Approvals ----
export const financeApprovals: FinanceApproval[] = [
  { id: 'appr-01', type: 'payout', title: 'Amit Kumar — Freelancer Payment', description: 'UI Design deliverables for Razorpay Dashboard Phase 2 — 15 screens completed', amount: 185000, requestedBy: 'Priya Sharma', requestedDate: '2026-04-08', approver: 'CFO', status: 'pending', comments: [{ id: 'c1', author: 'Priya Sharma', content: 'Deliverables reviewed and approved. Screens match design spec.', timestamp: '2026-04-08T10:30:00' }], priority: 'medium' },
  { id: 'appr-02', type: 'payout', title: 'Sneha Design Studio — Vendor Payment', description: 'Brand identity package for Swiggy Rebrand — Logo, guidelines, collateral', amount: 320000, requestedBy: 'Priya Sharma', requestedDate: '2026-04-07', approver: 'CFO', status: 'approved', comments: [{ id: 'c2', author: 'CFO', content: 'Approved. Process within SLA.', timestamp: '2026-04-08T14:00:00' }], priority: 'high' },
  { id: 'appr-03', type: 'budget', title: 'Marketing Lead Gen Q2 — Budget Increase', description: 'Requesting additional ₹5L for Q2 lead gen campaign due to strong ROI on Google Ads', amount: 500000, requestedBy: 'Rahul Verma', requestedDate: '2026-04-05', approver: 'CFO', status: 'pending', comments: [], priority: 'high' },
  { id: 'appr-04', type: 'refund', title: 'Slice — Partial Project Refund', description: 'Refund for disputed scope — 3 revision rounds exceeded SOW agreement', amount: 120000, requestedBy: 'Vikram Joshi', requestedDate: '2026-04-03', approver: 'CFO', status: 'escalated', comments: [{ id: 'c3', author: 'Vikram Joshi', content: 'Client disputes scope. Legal review recommended before processing.', timestamp: '2026-04-03T09:00:00' }, { id: 'c4', author: 'CFO', content: 'Escalate to legal team. Do not process until resolved.', timestamp: '2026-04-04T11:00:00' }], priority: 'urgent' },
  { id: 'appr-05', type: 'expense', title: 'AWS Infrastructure Spike — Investigation', description: 'AWS bill increased 42% MoM — ₹6.8L vs ₹4.8L last month. Engineering review attached.', amount: 200000, requestedBy: 'Arjun Mehta', requestedDate: '2026-04-06', approver: 'CTO', status: 'pending', comments: [{ id: 'c5', author: 'Arjun Mehta', content: 'Identified: EC2 instances in staging not terminated. Optimisation plan attached.', timestamp: '2026-04-06T16:00:00' }], priority: 'high' },
  { id: 'appr-06', type: 'payroll', title: 'April Payroll — Finance Team', description: 'Monthly payroll processing for finance team — 6 employees', amount: 723775, requestedBy: 'HR Team', requestedDate: '2026-04-01', approver: 'CFO', status: 'approved', comments: [], priority: 'high' },
  { id: 'appr-07', type: 'discount', title: 'Groww — Retainer Discount 15%', description: 'Offering 15% discount on annual retainer for Groww — loyalty incentive', amount: 972000, requestedBy: 'Meera Patel', requestedDate: '2026-04-09', approver: 'CFO', status: 'pending', comments: [], priority: 'medium' },
  { id: 'appr-08', type: 'write-off', title: 'Slice Receivable — ₹4.2L Write-off', description: 'Slice receivable overdue 48+ days with legal dispute. Recommend partial write-off.', amount: 420000, requestedBy: 'Finance Team', requestedDate: '2026-04-10', approver: 'CFO', status: 'pending', comments: [{ id: 'c6', author: 'Finance Team', content: 'Recovery probability at 42%. Legal costs may exceed recovery amount.', timestamp: '2026-04-10T10:00:00' }], priority: 'urgent' },
];

// ---- 15. Forecasting ----
export const forecastData: ForecastEntry[] = [
  { metric: 'Revenue', current: 5200000, nextMonth: 5800000, bestCase: 6500000, worstCase: 4800000, confidence: 82, trend: 'up' },
  { metric: 'Payroll', current: 835000, nextMonth: 865000, bestCase: 865000, worstCase: 865000, confidence: 95, trend: 'up' },
  { metric: 'GST Due', current: 630000, nextMonth: 720000, bestCase: 720000, worstCase: 680000, confidence: 78, trend: 'up' },
  { metric: 'Operating Expenses', current: 2750000, nextMonth: 2900000, bestCase: 3100000, worstCase: 2700000, confidence: 75, trend: 'up' },
  { metric: 'Cash Runway', current: 3.2, nextMonth: 2.8, bestCase: 3.8, worstCase: 1.9, confidence: 70, trend: 'down' },
  { metric: 'Receivables Risk', current: 8750000, nextMonth: 6200000, bestCase: 4500000, worstCase: 9800000, confidence: 65, trend: 'down' },
  { metric: 'Burn Rate', current: 3850000, nextMonth: 3920000, bestCase: 3800000, worstCase: 4500000, confidence: 72, trend: 'up' },
  { metric: 'Profit Margin', current: 32.1, nextMonth: 34.5, bestCase: 38.2, worstCase: 28.0, confidence: 68, trend: 'up' },
];

// ---- 16. AI Finance Intelligence ----
export const aiFinanceInsights: AIFinanceInsight[] = [
  { id: 'ai-01', type: 'delayed-payment', title: 'Slice payment delayed 48 days — high default risk', description: 'Slice has not responded to 4 follow-ups. Their runway decreased 65% per Tracxn data. Recommend escalating to legal and writing off 60%.', confidence: 89, impact: 'critical', recommendation: 'Escalate to legal. Offer structured payment plan. Prepare write-off documentation.', potentialSaving: 480000, client: 'Slice', metric: 'Recovery Rate', currentValue: 42, thresholdValue: 60 },
  { id: 'ai-02', type: 'margin-leak', title: 'CRED margin dropped from 42% → 18% due to revision cost', description: 'CRED Campaign Design project had 6 revision rounds vs avg 2. Revision cost ₹5.2L vs budget ₹1.5L. Root cause: scope ambiguity in SOW.', confidence: 94, impact: 'critical', recommendation: 'Revise SOW template to include max revision clause. Increase CRED retainer by 15% to compensate margin loss.', potentialSaving: 720000, client: 'CRED', metric: 'Project Margin', currentValue: 18, thresholdValue: 30 },
  { id: 'ai-03', type: 'overspend-anomaly', title: 'AWS infrastructure cost spiked 42% month-over-month', description: 'April AWS bill ₹6.8L vs March ₹4.8L. Identified: 8 EC2 instances in staging not terminated, 3 unused RDS instances. Estimated waste: ₹2.1L/month.', confidence: 96, impact: 'high', recommendation: 'Terminate unused instances immediately. Set up automated cost alerts. Implement tagging policy for all resources.', potentialSaving: 210000, metric: 'AWS Cost', currentValue: 680000, thresholdValue: 550000 },
  { id: 'ai-04', type: 'low-runway', title: 'Cash runway at 3.2 months — below 4-month safety threshold', description: 'At current burn rate of ₹38.5L/month, cash runway is 3.2 months. ₹87.5L in receivables overdue. If 60% collected, runway extends to 5.1 months.', confidence: 91, impact: 'critical', recommendation: 'Prioritize collection of ₹24L from Razorpay and ₹17.5L from PhonePe. Defer non-critical expenses. Consider credit line.', potentialSaving: 0, metric: 'Runway (months)', currentValue: 3.2, thresholdValue: 4.0 },
  { id: 'ai-05', type: 'pricing-recommendation', title: 'Razorpay is 35% underpriced vs market rate for similar scope', description: 'Razorpay Dashboard v2 at ₹32L. Similar scope for PhonePe at ₹26L (₹6.2L/sprint). Market rate analysis: ₹8-10L per sprint for enterprise dashboard projects.', confidence: 87, impact: 'high', recommendation: 'Increase Razorpay Phase 3 proposal by 25%. Quote ₹40L for next milestone. Add SOW revision clause.', potentialSaving: 800000, client: 'Razorpay', metric: 'Avg Rate/sprint', currentValue: 640000, thresholdValue: 850000 },
  { id: 'ai-06', type: 'service-pricing', title: 'Marketing Design service is 40% below market margin', description: 'Marketing Design avg rate ₹2.8L/project vs industry ₹4.5L. 15 projects last quarter — potential ₹25.5L revenue uplift if repriced.', confidence: 83, impact: 'medium', recommendation: 'Raise Marketing Design minimum to ₹3.5L. Bundle with brand strategy add-on at ₹1.5L premium.', potentialSaving: 2550000, metric: 'Service Margin', currentValue: 31, thresholdValue: 45 },
  { id: 'ai-07', type: 'budget-reallocation', title: 'Q2 Marketing budget 84% consumed with 2 months remaining', description: '₹21L of ₹25L marketing budget spent by April. Google Ads performing 3.2x ROAS while LinkedIn at 0.8x. Reallocate ₹3L from LinkedIn to Google.', confidence: 90, impact: 'high', recommendation: 'Pause LinkedIn campaigns. Reallocate ₹3L to Google Ads top-performing campaigns. Expected incremental revenue: ₹9.6L.', potentialSaving: 960000, metric: 'Budget Remaining', currentValue: 16, thresholdValue: 33 },
  { id: 'ai-08', type: 'churn-risk', title: 'Slice churn revenue risk — ₹32L annually', description: 'Slice dissatisfaction signals: 3 disputed invoices, 48-day overdue, scope complaints. Historical: clients with 2+ disputes have 68% churn rate within 6 months.', confidence: 85, impact: 'critical', recommendation: 'Schedule executive call with Slice VP. Offer revised SOW with clear scope. Consider 10% discount on next project as retention gesture.', potentialSaving: 3200000, client: 'Slice', metric: 'Churn Probability', currentValue: 68, thresholdValue: 30 },
  { id: 'ai-09', type: 'margin-leak', title: 'Freelancer costs up 22% — efficiency declining', description: 'Avg freelancer cost per project rose from ₹1.2L to ₹1.46L. Root cause: increased revision cycles (avg 3.2 vs 2.1 last quarter). Consider in-housing high-frequency skills.', confidence: 79, impact: 'medium', recommendation: 'Hire 2 junior designers to handle 60% of revision work. Expected freelancer cost reduction: ₹8.4L/quarter.', potentialSaving: 840000, metric: 'Freelancer Cost/Project', currentValue: 146000, thresholdValue: 120000 },
  { id: 'ai-10', type: 'delayed-payment', title: 'PhonePe payment 15 days overdue — secondary follow-up needed', description: 'PhonePe historically pays within 30 days. Current 15-day delay may indicate internal processing issue. Recommend VP-level follow-up.', confidence: 76, impact: 'medium', recommendation: 'Send WhatsApp to PhonePe finance manager. Escalate to relationship manager if not resolved by April 20.', potentialSaving: 0, client: 'PhonePe', metric: 'Overdue Days', currentValue: 15, thresholdValue: 10 },
];

// ---- 17. Finance Alerts ----
export const financeAlerts: FinanceAlert[] = [
  { id: 'alert-01', type: 'overdue', severity: 'critical', title: 'Slice ₹12L overdue 48+ days', description: 'Slice invoice INV-2026-030 is severely overdue. Client unresponsive to 4 follow-ups. Legal escalation recommended.', actionUrl: 'receivables', createdAt: '2026-04-10T08:00:00' },
  { id: 'alert-02', type: 'overdue', severity: 'critical', title: 'PhonePe ₹17.5L overdue 15 days', description: 'PhonePe invoice INV-2026-037 past due. Second reminder sent. Expect payment by April 25.', actionUrl: 'receivables', createdAt: '2026-04-09T10:00:00' },
  { id: 'alert-03', type: 'runway', severity: 'critical', title: 'Cash runway at 3.2 months', description: 'Current burn rate ₹38.5L/month with ₹1.23Cr in bank. Collect overdue receivables to extend runway.', actionUrl: 'cashflow', createdAt: '2026-04-10T09:00:00' },
  { id: 'alert-04', type: 'tax', severity: 'warning', title: 'GSTR-1 for March due — overdue', description: 'GSTR-1 filing for March 2026 was due April 11. File immediately to avoid ₹200/day penalty.', actionUrl: 'gst-tax', createdAt: '2026-04-12T00:00:00' },
  { id: 'alert-05', type: 'payroll', severity: 'warning', title: 'April payroll pending approval', description: '₹28.5L payroll for April 2026 awaiting CFO approval. Process by April 25 to ensure on-time salary credit.', actionUrl: 'payroll-finance', createdAt: '2026-04-10T07:00:00' },
  { id: 'alert-06', type: 'expense', severity: 'warning', title: 'AWS cost spike — 42% increase', description: 'April AWS bill ₹6.8L vs March ₹4.8L. 8 unused EC2 instances identified. Terminate to save ₹2.1L/month.', actionUrl: 'expenses', createdAt: '2026-04-08T11:00:00' },
  { id: 'alert-07', type: 'margin', severity: 'info', title: 'CRED project margin at 18%', description: 'CRED Campaign Design project margin dropped below 30% threshold due to revision costs. Review SOW for future projects.', actionUrl: 'profitability', createdAt: '2026-04-07T14:00:00' },
  { id: 'alert-08', type: 'budget', severity: 'warning', title: 'Swiggy delivery budget 96% consumed', description: '₹48L of ₹50L budget used. ₹2L remaining for 2 months. Request budget extension or defer non-essential deliverables.', actionUrl: 'budgets', createdAt: '2026-04-06T16:00:00' },
];
