// ============================================
// ERP Mock Data — Enterprise-Grade
// ============================================
import type {
  ErpProject, ErpTask, Approval, Invoice, FinanceOp, Vendor,
  PayrollRecord, Resource, Asset, SOP, ChatChannel, ChatMessage,
  DeliveryItem, ProfitabilityData, AiOpsInsight, Employee,
  AttendanceRecord, LeaveRequest, PerformanceReview, Incentive,
  OnboardingTask, Document, Shift, WorkloadItem,
} from '../types';

// ---- Projects ----
export const mockProjects: ErpProject[] = [
  {
    id: 'p1', name: 'NexaBank Digital Transformation', client: 'NexaBank Holdings', accountManager: 'Arjun Mehta',
    budget: 2400000, actualSpend: 1980000, progress: 82, profitability: 18.5, health: 'excellent', sla: 95,
    dueDate: '2026-08-15', milestones: [
      { id: 'm1', title: 'Core API Delivery', date: '2026-03-01', completed: true },
      { id: 'm2', title: 'UI/UX Rollout', date: '2026-05-15', completed: true },
      { id: 'm3', title: 'UAT Sign-off', date: '2026-07-01', completed: false },
      { id: 'm4', title: 'Production Go-Live', date: '2026-08-15', completed: false },
    ],
    deliverables: ['Mobile Banking App', 'Admin Dashboard', 'API Gateway', 'Analytics Module'],
    linkedInvoices: ['INV-2026-001', 'INV-2026-005', 'INV-2026-009'],
    status: 'active', priority: 'critical', isRecurring: false, createdAt: '2025-11-20',
  },
  {
    id: 'p2', name: 'ShopVerse E-Commerce Platform', client: 'ShopVerse Inc.', accountManager: 'Priya Sharma',
    budget: 1800000, actualSpend: 1240000, progress: 68, profitability: 22.3, health: 'good', sla: 92,
    dueDate: '2026-09-30', milestones: [
      { id: 'm5', title: 'Catalog Engine', date: '2026-02-15', completed: true },
      { id: 'm6', title: 'Payment Integration', date: '2026-05-01', completed: true },
      { id: 'm7', title: 'Multi-vendor Module', date: '2026-07-15', completed: false },
    ],
    deliverables: ['Product Catalog', 'Checkout Flow', 'Vendor Portal', 'Inventory Management'],
    linkedInvoices: ['INV-2026-002', 'INV-2026-006'],
    status: 'active', priority: 'high', isRecurring: false, createdAt: '2025-12-10',
  },
  {
    id: 'p3', name: 'MediCare Patient Portal', client: 'MediCare Global', accountManager: 'Rahul Verma',
    budget: 950000, actualSpend: 980000, progress: 90, profitability: -3.2, health: 'at-risk', sla: 88,
    dueDate: '2026-05-01', milestones: [
      { id: 'm8', title: 'Patient Records Module', date: '2026-01-15', completed: true },
      { id: 'm9', title: 'Telehealth Integration', date: '2026-03-01', completed: true },
      { id: 'm10', title: 'Compliance Audit', date: '2026-04-15', completed: false },
    ],
    deliverables: ['Patient Dashboard', 'Doctor Portal', 'Appointment System', 'Lab Reports'],
    linkedInvoices: ['INV-2026-003', 'INV-2026-007'],
    status: 'active', priority: 'high', isRecurring: false, createdAt: '2025-09-01',
  },
  {
    id: 'p4', name: 'AutoFlow Fleet Management', client: 'AutoFlow Logistics', accountManager: 'Ananya Das',
    budget: 1200000, actualSpend: 720000, progress: 55, profitability: 28.4, health: 'good', sla: 94,
    dueDate: '2026-10-30', milestones: [
      { id: 'm11', title: 'GPS Tracking Module', date: '2026-03-01', completed: true },
      { id: 'm12', title: 'Route Optimization', date: '2026-06-15', completed: false },
      { id: 'm13', title: 'Driver Management', date: '2026-08-30', completed: false },
    ],
    deliverables: ['Live Tracking Dashboard', 'Route Planner', 'Fuel Analytics', 'Driver App'],
    linkedInvoices: ['INV-2026-004'],
    status: 'active', priority: 'medium', isRecurring: false, createdAt: '2026-01-15',
  },
  {
    id: 'p5', name: 'EduSpark LMS Platform', client: 'EduSpark Foundation', accountManager: 'Arjun Mehta',
    budget: 680000, actualSpend: 680000, progress: 100, profitability: 12.1, health: 'excellent', sla: 97,
    dueDate: '2026-03-30', milestones: [
      { id: 'm14', title: 'Course Builder', date: '2025-12-01', completed: true },
      { id: 'm15', title: 'Assessment Engine', date: '2026-02-01', completed: true },
      { id: 'm16', title: 'Certification System', date: '2026-03-15', completed: true },
    ],
    deliverables: ['Course Management', 'Student Portal', 'Grading System', 'Analytics Dashboard'],
    linkedInvoices: ['INV-2025-042', 'INV-2026-008'],
    status: 'completed', priority: 'medium', isRecurring: false, createdAt: '2025-08-15',
  },
  {
    id: 'p6', name: 'GreenEnergy IoT Dashboard', client: 'GreenEnergy Corp', accountManager: 'Priya Sharma',
    budget: 520000, actualSpend: 310000, progress: 40, profitability: 15.8, health: 'good', sla: 90,
    dueDate: '2026-11-15', milestones: [
      { id: 'm17', title: 'Sensor Integration', date: '2026-04-01', completed: true },
      { id: 'm18', title: 'Real-time Dashboard', date: '2026-07-01', completed: false },
    ],
    deliverables: ['IoT Dashboard', 'Alert System', 'Energy Reports', 'Maintenance Scheduler'],
    linkedInvoices: [],
    status: 'active', priority: 'low', isRecurring: false, createdAt: '2026-02-01',
  },
  {
    id: 'p7', name: 'FinEdge Trading Platform', client: 'FinEdge Capital', accountManager: 'Rahul Verma',
    budget: 3200000, actualSpend: 2850000, progress: 75, profitability: 8.2, health: 'critical', sla: 82,
    dueDate: '2026-06-30', milestones: [
      { id: 'm19', title: 'Trading Engine MVP', date: '2026-01-15', completed: true },
      { id: 'm20', title: 'Risk Management Module', date: '2026-03-01', completed: true },
      { id: 'm21', title: 'Regulatory Compliance', date: '2026-05-01', completed: false },
      { id: 'm22', title: 'Performance Testing', date: '2026-06-15', completed: false },
    ],
    deliverables: ['Trading Engine', 'Risk Analytics', 'Compliance Portal', 'Client Dashboard'],
    linkedInvoices: ['INV-2026-010', 'INV-2026-011', 'INV-2026-012'],
    status: 'active', priority: 'critical', isRecurring: false, createdAt: '2025-10-01',
  },
  {
    id: 'p8', name: 'RetailPro POS System', client: 'RetailPro India', accountManager: 'Ananya Das',
    budget: 850000, actualSpend: 430000, progress: 35, profitability: 20.5, health: 'good', sla: 91,
    dueDate: '2026-12-15', milestones: [
      { id: 'm23', title: 'POS Hardware Integration', date: '2026-05-01', completed: false },
      { id: 'm24', title: 'Inventory Sync', date: '2026-08-01', completed: false },
    ],
    deliverables: ['POS Application', 'Inventory Module', 'CRM Integration', 'Reports'],
    linkedInvoices: ['INV-2026-013'],
    status: 'active', priority: 'medium', isRecurring: false, createdAt: '2026-03-01',
  },
  {
    id: 'p9', name: 'TravelWise Booking Engine', client: 'TravelWise Global', accountManager: 'Arjun Mehta',
    budget: 1500000, actualSpend: 0, progress: 0, profitability: 0, health: 'excellent', sla: 95,
    dueDate: '2027-03-30', milestones: [],
    deliverables: ['Booking Engine', 'Payment Gateway', 'User App', 'Admin Panel'],
    linkedInvoices: [],
    status: 'inception', priority: 'high', isRecurring: false, createdAt: '2026-04-01',
  },
  {
    id: 'p10', name: 'CloudSync SaaS Monthly Retainer', client: 'CloudSync Technologies', accountManager: 'Priya Sharma',
    budget: 180000, actualSpend: 142500, progress: 75, profitability: 32.1, health: 'excellent', sla: 98,
    dueDate: '2026-04-30', milestones: [
      { id: 'm25', title: 'Monthly Sprint Delivery', date: '2026-04-30', completed: false },
    ],
    deliverables: ['Feature Enhancements', 'Bug Fixes', 'Performance Reports'],
    linkedInvoices: ['INV-2026-014'],
    status: 'active', priority: 'low', isRecurring: true, createdAt: '2025-06-01',
  },
  {
    id: 'p11', name: 'LegalEase Document Management', client: 'LegalEase LLP', accountManager: 'Rahul Verma',
    budget: 440000, actualSpend: 520000, progress: 100, profitability: -8.5, health: 'critical', sla: 78,
    dueDate: '2026-02-28', milestones: [
      { id: 'm26', title: 'Document Parser', date: '2025-12-01', completed: true },
      { id: 'm27', title: 'Search & Retrieval', date: '2026-02-01', completed: true },
    ],
    deliverables: ['Document Upload', 'OCR Pipeline', 'Search Engine', 'Compliance Module'],
    linkedInvoices: ['INV-2025-050', 'INV-2026-015'],
    status: 'completed', priority: 'medium', isRecurring: false, createdAt: '2025-08-15',
  },
  {
    id: 'p12', name: 'AgroTech Farm Analytics', client: 'AgroTech Solutions', accountManager: 'Ananya Das',
    budget: 380000, actualSpend: 195000, progress: 50, profitability: 25.6, health: 'good', sla: 93,
    dueDate: '2026-09-30', milestones: [
      { id: 'm28', title: 'Data Pipeline Setup', date: '2026-03-01', completed: true },
      { id: 'm29', title: 'Analytics Dashboard', date: '2026-06-01', completed: false },
    ],
    deliverables: ['Sensor Dashboard', 'Crop Analytics', 'Weather Integration', 'Yield Reports'],
    linkedInvoices: ['INV-2026-016'],
    status: 'active', priority: 'low', isRecurring: false, createdAt: '2026-01-15',
  },
];

// ---- Tasks ----
export const mockTasks: ErpTask[] = [
  { id: 't1', title: 'Design banking dashboard wireframes', projectId: 'p1', stage: 'done', assignee: 'Deepika Nair', dueDate: '2026-03-15', storyPoints: 8, timeLogged: 32, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: null, description: 'Create high-fidelity wireframes for the NexaBank admin dashboard', createdAt: '2026-02-10' },
  { id: 't2', title: 'Implement payment gateway integration', projectId: 'p2', stage: 'in-progress', assignee: 'Vikram Joshi', dueDate: '2026-04-25', storyPoints: 13, timeLogged: 40, isBlocked: false, dependencies: ['t1'], recurringTemplate: null, slaDeadline: '2026-04-28', description: 'Integrate Stripe and Razorpay payment gateways for ShopVerse checkout', createdAt: '2026-03-01' },
  { id: 't3', title: 'Patient data HIPAA compliance audit', projectId: 'p3', stage: 'review', assignee: 'Sneha Reddy', dueDate: '2026-04-20', storyPoints: 8, timeLogged: 24, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: '2026-04-22', description: 'Full HIPAA compliance audit for patient data handling and storage', createdAt: '2026-03-15' },
  { id: 't4', title: 'GPS tracking real-time WebSocket setup', projectId: 'p4', stage: 'done', assignee: 'Arun Kumar', dueDate: '2026-03-30', storyPoints: 5, timeLogged: 20, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: null, description: 'Set up WebSocket connections for real-time GPS fleet tracking', createdAt: '2026-02-20' },
  { id: 't5', title: 'Risk management algorithm implementation', projectId: 'p7', stage: 'blocked', assignee: 'Nikhil Das', dueDate: '2026-04-15', storyPoints: 21, timeLogged: 60, isBlocked: true, dependencies: ['t2'], recurringTemplate: null, slaDeadline: '2026-04-18', description: 'Build ML-based risk scoring engine for FinEdge trading platform', createdAt: '2026-02-15' },
  { id: 't6', title: 'Monthly performance report generation', projectId: 'p10', stage: 'todo', assignee: 'Meera Patel', dueDate: '2026-04-28', storyPoints: 3, timeLogged: 0, isBlocked: false, dependencies: [], recurringTemplate: 'monthly', slaDeadline: '2026-04-30', description: 'Generate automated monthly performance and usage reports for CloudSync', createdAt: '2026-04-01' },
  { id: 't7', title: 'API rate limiting and throttling', projectId: 'p1', stage: 'in-progress', assignee: 'Karthik Menon', dueDate: '2026-04-22', storyPoints: 5, timeLogged: 12, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: null, description: 'Implement rate limiting middleware for NexaBank API gateway', createdAt: '2026-04-05' },
  { id: 't8', title: 'Multi-vendor catalog synchronization', projectId: 'p2', stage: 'backlog', assignee: 'Pooja Iyer', dueDate: '2026-06-15', storyPoints: 13, timeLogged: 0, isBlocked: false, dependencies: ['t2'], recurringTemplate: null, slaDeadline: null, description: 'Build real-time catalog sync between ShopVerse and vendor systems', createdAt: '2026-03-10' },
  { id: 't9', title: 'Telehealth video call integration', projectId: 'p3', stage: 'done', assignee: 'Rahul Sharma', dueDate: '2026-03-01', storyPoints: 8, timeLogged: 36, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: null, description: 'Integrate WebRTC-based video calling for MediCare telehealth module', createdAt: '2026-01-10' },
  { id: 't10', title: 'Regulatory compliance documentation', projectId: 'p7', stage: 'in-progress', assignee: 'Sneha Reddy', dueDate: '2026-04-30', storyPoints: 8, timeLogged: 16, isBlocked: true, dependencies: ['t5'], recurringTemplate: null, slaDeadline: '2026-05-05', description: 'Prepare SEBI compliance documentation for FinEdge trading platform', createdAt: '2026-03-20' },
  { id: 't11', title: 'IoT sensor data ingestion pipeline', projectId: 'p6', stage: 'done', assignee: 'Arun Kumar', dueDate: '2026-04-01', storyPoints: 8, timeLogged: 28, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: null, description: 'Build Kafka-based data pipeline for GreenEnergy IoT sensors', createdAt: '2026-02-15' },
  { id: 't12', title: 'POS barcode scanner integration', projectId: 'p8', stage: 'todo', assignee: 'Vikram Joshi', dueDate: '2026-05-15', storyPoints: 5, timeLogged: 0, isBlocked: false, dependencies: [], recurringTemplate: null, slaDeadline: '2026-05-20', description: 'Integrate barcode and QR scanner hardware with RetailPro POS', createdAt: '2026-04-01' },
];

// ---- Approvals ----
export const mockApprovals: Approval[] = [
  { id: 'ap1', type: 'invoice', title: 'NexaBank Q2 Milestone Invoice - ₹48,00,000', requestedBy: 'Arjun Mehta', status: 'pending', project: 'NexaBank Digital Transformation', version: 1, comments: [{ id: 'c1', author: 'CFO', content: 'Please verify SLA compliance before approval.', timestamp: '2026-04-09T14:00:00' }], createdAt: '2026-04-08' },
  { id: 'ap2', type: 'budget', title: 'FinEdge Additional Dev Resources - ₹8,00,000', requestedBy: 'Rahul Verma', status: 'escalated', project: 'FinEdge Trading Platform', version: 2, comments: [{ id: 'c2', author: 'PM Lead', content: 'We need 2 more backend devs to meet the June deadline.', timestamp: '2026-04-07T10:00:00' }, { id: 'c3', author: 'CTO', content: 'Escalated to CFO for emergency budget approval.', timestamp: '2026-04-08T09:00:00' }], createdAt: '2026-04-07' },
  { id: 'ap3', type: 'design', title: 'ShopVerse Homepage Redesign V3', requestedBy: 'Priya Sharma', status: 'approved', project: 'ShopVerse E-Commerce Platform', version: 3, comments: [{ id: 'c4', author: 'Design Lead', content: 'Approved. Looks great!', timestamp: '2026-04-06T16:00:00' }], createdAt: '2026-04-05' },
  { id: 'ap4', type: 'leave', title: 'Sneha Reddy - 3 Days Casual Leave', requestedBy: 'Sneha Reddy', status: 'approved', project: null, version: 1, comments: [], createdAt: '2026-04-09' },
  { id: 'ap5', type: 'content', title: 'MediCare Patient Portal - HIPAA Content Review', requestedBy: 'Sneha Reddy', status: 'pending', project: 'MediCare Patient Portal', version: 1, comments: [{ id: 'c5', author: 'Legal', content: 'Privacy policy needs update per new HIPAA guidelines.', timestamp: '2026-04-09T11:00:00' }], createdAt: '2026-04-09' },
  { id: 'ap6', type: 'proposal', title: 'TravelWise Project Proposal & SOW', requestedBy: 'Arjun Mehta', status: 'pending', project: 'TravelWise Booking Engine', version: 1, comments: [], createdAt: '2026-04-10' },
  { id: 'ap7', type: 'payroll', title: 'March 2026 Payroll - Additional Incentives Batch', requestedBy: 'HR Team', status: 'approved', project: null, version: 1, comments: [{ id: 'c6', author: 'Finance', content: 'All amounts verified and approved.', timestamp: '2026-03-31T17:00:00' }], createdAt: '2026-03-28' },
  { id: 'ap8', type: 'invoice', title: 'LegalEase Final Payment - ₹4,40,000', requestedBy: 'Rahul Verma', status: 'rejected', project: 'LegalEase Document Management', version: 2, comments: [{ id: 'c7', author: 'Client', content: 'Payment withheld pending resolution of 3 outstanding defects.', timestamp: '2026-04-01T09:00:00' }], createdAt: '2026-03-25' },
  { id: 'ap9', type: 'budget', title: 'AutoFlow Cloud Infrastructure Upgrade - ₹2,40,000', requestedBy: 'Ananya Das', status: 'pending', project: 'AutoFlow Fleet Management', version: 1, comments: [], createdAt: '2026-04-10' },
  { id: 'ap10', type: 'design', title: 'FinEdge Trading Terminal UI Concept', requestedBy: 'Rahul Verma', status: 'pending', project: 'FinEdge Trading Platform', version: 1, comments: [{ id: 'c8', author: 'UX Lead', content: 'Need to review dark mode trading screens.', timestamp: '2026-04-10T08:00:00' }], createdAt: '2026-04-10' },
];

// ---- Invoices ----
export const mockInvoices: Invoice[] = [
  { id: 'inv1', invoiceNo: 'INV-2026-014', client: 'CloudSync Technologies', project: 'CloudSync SaaS Monthly Retainer', gst: 32580, amount: 142500, dueDate: '2026-04-30', paidAmount: 0, status: 'sent', paymentLink: 'https://pay.diginue.io/inv/2026-014', recurring: true, createdAt: '2026-04-01' },
  { id: 'inv2', invoiceNo: 'INV-2026-013', client: 'RetailPro India', project: 'RetailPro POS System', gst: 77400, amount: 430000, dueDate: '2026-05-15', paidAmount: 0, status: 'sent', paymentLink: 'https://pay.diginue.io/inv/2026-013', recurring: false, createdAt: '2026-04-05' },
  { id: 'inv3', invoiceNo: 'INV-2026-012', client: 'FinEdge Capital', project: 'FinEdge Trading Platform', gst: 540000, amount: 950000, dueDate: '2026-04-15', paidAmount: 950000, status: 'paid', paymentLink: null, recurring: false, createdAt: '2026-03-15' },
  { id: 'inv4', invoiceNo: 'INV-2026-011', client: 'FinEdge Capital', project: 'FinEdge Trading Platform', gst: 486000, amount: 850000, dueDate: '2026-03-15', paidAmount: 850000, status: 'paid', paymentLink: null, recurring: false, createdAt: '2026-02-15' },
  { id: 'inv5', invoiceNo: 'INV-2026-010', client: 'FinEdge Capital', project: 'FinEdge Trading Platform', gst: 486000, amount: 850000, dueDate: '2026-02-15', paidAmount: 425000, status: 'partial', paymentLink: 'https://pay.diginue.io/inv/2026-010', recurring: false, createdAt: '2026-01-15' },
  { id: 'inv6', invoiceNo: 'INV-2026-009', client: 'NexaBank Holdings', project: 'NexaBank Digital Transformation', gst: 396000, amount: 720000, dueDate: '2026-03-30', paidAmount: 720000, status: 'paid', paymentLink: null, recurring: false, createdAt: '2026-02-28' },
  { id: 'inv7', invoiceNo: 'INV-2026-008', client: 'EduSpark Foundation', project: 'EduSpark LMS Platform', gst: 122400, amount: 224000, dueDate: '2026-04-10', paidAmount: 224000, status: 'paid', paymentLink: null, recurring: false, createdAt: '2026-03-15' },
  { id: 'inv8', invoiceNo: 'INV-2026-007', client: 'MediCare Global', project: 'MediCare Patient Portal', gst: 270000, amount: 480000, dueDate: '2026-03-31', paidAmount: 0, status: 'overdue', paymentLink: 'https://pay.diginue.io/inv/2026-007', recurring: false, createdAt: '2026-02-28' },
  { id: 'inv9', invoiceNo: 'INV-2026-006', client: 'ShopVerse Inc.', project: 'ShopVerse E-Commerce Platform', gst: 324000, amount: 580000, dueDate: '2026-04-20', paidAmount: 0, status: 'draft', paymentLink: null, recurring: false, createdAt: '2026-04-08' },
  { id: 'inv10', invoiceNo: 'INV-2026-016', client: 'AgroTech Solutions', project: 'AgroTech Farm Analytics', gst: 35100, amount: 195000, dueDate: '2026-04-25', paidAmount: 0, status: 'sent', paymentLink: 'https://pay.diginue.io/inv/2026-016', recurring: false, createdAt: '2026-04-10' },
  { id: 'inv11', invoiceNo: 'INV-2026-015', client: 'LegalEase LLP', project: 'LegalEase Document Management', gst: 93600, amount: 180000, dueDate: '2026-04-05', paidAmount: 0, status: 'overdue', paymentLink: 'https://pay.diginue.io/inv/2026-015', recurring: false, createdAt: '2026-03-01' },
  { id: 'inv12', invoiceNo: 'INV-2026-017', client: 'GreenEnergy Corp', project: 'GreenEnergy IoT Dashboard', gst: 55800, amount: 115000, dueDate: '2026-05-10', paidAmount: 0, status: 'draft', paymentLink: null, recurring: false, createdAt: '2026-04-10' },
];

// ---- Finance Ops ----
export const mockFinanceOps: FinanceOp = {
  receivables: 3857500,
  payables: 1240000,
  cashFlow: 2617500,
  budgetVariance: -320000,
  burnRate: 1850000,
  vendorPayouts: 680000,
  monthlyProfit: 1875000,
  projectCostCenters: [
    { projectId: 'p1', projectName: 'NexaBank Digital Transformation', budget: 2400000, spent: 1980000, variance: 420000, burnRate: 660000 },
    { projectId: 'p2', projectName: 'ShopVerse E-Commerce Platform', budget: 1800000, spent: 1240000, variance: 560000, burnRate: 413333 },
    { projectId: 'p3', projectName: 'MediCare Patient Portal', budget: 950000, spent: 980000, variance: -30000, burnRate: 490000 },
    { projectId: 'p4', projectName: 'AutoFlow Fleet Management', budget: 1200000, spent: 720000, variance: 480000, burnRate: 257143 },
    { projectId: 'p7', projectName: 'FinEdge Trading Platform', budget: 3200000, spent: 2850000, variance: 350000, burnRate: 712500 },
    { projectId: 'p11', projectName: 'LegalEase Document Management', budget: 440000, spent: 520000, variance: -80000, burnRate: 346667 },
  ],
};

// ---- Vendors ----
export const mockVendors: Vendor[] = [
  { id: 'v1', name: 'AWS Cloud Services', type: 'Cloud Infrastructure', contractValue: 4800000, payoutDue: 320000, slaScore: 99.8, qualityScore: 97, linkedProjects: ['p1', 'p2', 'p7'], rating: 4.9, complianceDocs: ['MSA-2025', 'DPDP-Compliance'], status: 'active' },
  { id: 'v2', name: 'DesignStack Studio', type: 'UI/UX Design', contractValue: 1200000, payoutDue: 180000, slaScore: 94, qualityScore: 91, linkedProjects: ['p2', 'p4'], rating: 4.6, complianceDocs: ['NDA-2025', 'SOW-2025'], status: 'active' },
  { id: 'v3', name: 'SecureNet Cybersecurity', type: 'Security Audits', contractValue: 960000, payoutDue: 240000, slaScore: 96, qualityScore: 98, linkedProjects: ['p1', 'p3', 'p7'], rating: 4.8, complianceDocs: ['SOC2-Cert', 'ISO-27001'], status: 'active' },
  { id: 'v4', name: 'DataBridge Analytics', type: 'Data Engineering', contractValue: 720000, payoutDue: 120000, slaScore: 88, qualityScore: 82, linkedProjects: ['p6', 'p12'], rating: 4.2, complianceDocs: ['MSA-2026'], status: 'on-notice' },
  { id: 'v5', name: 'QuickTest QA Solutions', type: 'Quality Assurance', contractValue: 600000, payoutDue: 85000, slaScore: 92, qualityScore: 89, linkedProjects: ['p1', 'p7', 'p8'], rating: 4.4, complianceDocs: ['MSA-2025', 'NDA-2025'], status: 'active' },
  { id: 'v6', name: 'LegalCraft Advisory', type: 'Legal Services', contractValue: 480000, payoutDue: 0, slaScore: 95, qualityScore: 93, linkedProjects: ['p3', 'p11'], rating: 4.5, complianceDocs: ['Bar-Council-Reg'], status: 'active' },
  { id: 'v7', name: 'CloudOps Infra Management', type: 'DevOps', contractValue: 540000, payoutDue: 150000, slaScore: 78, qualityScore: 71, linkedProjects: ['p2', 'p4'], rating: 3.4, complianceDocs: ['MSA-2025'], status: 'on-notice' },
  { id: 'v8', name: 'TechTalent Staffing', type: 'Recruitment', contractValue: 360000, payoutDue: 45000, slaScore: 85, qualityScore: 80, linkedProjects: [], rating: 4.0, complianceDocs: ['RPO-Contract'], status: 'active' },
  { id: 'v9', name: 'PixelPerfect Creative', type: 'Creative Agency', contractValue: 240000, payoutDue: 60000, slaScore: 90, qualityScore: 88, linkedProjects: ['p9'], rating: 4.3, complianceDocs: ['NDA-2026', 'SOW-2026'], status: 'active' },
  { id: 'v10', name: 'NetSpeed CDN Services', type: 'Content Delivery', contractValue: 180000, payoutDue: 22000, slaScore: 99.5, qualityScore: 99, linkedProjects: ['p2', 'p10'], rating: 4.7, complianceDocs: ['MSA-2025'], status: 'active' },
  { id: 'v11', name: 'CodeReview Pro', type: 'Code Quality', contractValue: 300000, payoutDue: 0, slaScore: 65, qualityScore: 58, linkedProjects: ['p7'], rating: 2.8, complianceDocs: [], status: 'suspended' },
];

// ---- Payroll ----
export const mockPayroll: PayrollRecord[] = [
  { id: 'pr1', employeeId: 'e1', employeeName: 'Deepika Nair', baseSalary: 180000, incentives: 25000, deductions: 5400, netPay: 199600, status: 'paid', month: '2026-03', department: 'Design' },
  { id: 'pr2', employeeId: 'e2', employeeName: 'Vikram Joshi', baseSalary: 220000, incentives: 30000, deductions: 6600, netPay: 243400, status: 'paid', month: '2026-03', department: 'Engineering' },
  { id: 'pr3', employeeId: 'e3', employeeName: 'Sneha Reddy', baseSalary: 195000, incentives: 15000, deductions: 5850, netPay: 204150, status: 'paid', month: '2026-03', department: 'QA' },
  { id: 'pr4', employeeId: 'e4', employeeName: 'Arun Kumar', baseSalary: 200000, incentives: 20000, deductions: 6000, netPay: 214000, status: 'processed', month: '2026-04', department: 'Engineering' },
  { id: 'pr5', employeeId: 'e5', employeeName: 'Nikhil Das', baseSalary: 250000, incentives: 40000, deductions: 7500, netPay: 282500, status: 'paid', month: '2026-03', department: 'Engineering' },
  { id: 'pr6', employeeId: 'e6', employeeName: 'Meera Patel', baseSalary: 160000, incentives: 10000, deductions: 4800, netPay: 165200, status: 'processed', month: '2026-04', department: 'Operations' },
  { id: 'pr7', employeeId: 'e7', employeeName: 'Karthik Menon', baseSalary: 210000, incentives: 22000, deductions: 6300, netPay: 225700, status: 'pending', month: '2026-04', department: 'Engineering' },
  { id: 'pr8', employeeId: 'e8', employeeName: 'Pooja Iyer', baseSalary: 175000, incentives: 18000, deductions: 5250, netPay: 187750, status: 'processed', month: '2026-04', department: 'Engineering' },
  { id: 'pr9', employeeId: 'e9', employeeName: 'Rahul Sharma', baseSalary: 230000, incentives: 35000, deductions: 6900, netPay: 258100, status: 'paid', month: '2026-03', department: 'Engineering' },
  { id: 'pr10', employeeId: 'e10', employeeName: 'Ritika Gupta', baseSalary: 190000, incentives: 12000, deductions: 5700, netPay: 196300, status: 'pending', month: '2026-04', department: 'HR' },
  { id: 'pr11', employeeId: 'e11', employeeName: 'Saurabh Jain', baseSalary: 240000, incentives: 28000, deductions: 7200, netPay: 260800, status: 'paid', month: '2026-03', department: 'Sales' },
  { id: 'pr12', employeeId: 'e12', employeeName: 'Anita Kulkarni', baseSalary: 170000, incentives: 8000, deductions: 5100, netPay: 172900, status: 'processed', month: '2026-04', department: 'Finance' },
];

// ---- Resources ----
export const mockResources: Resource[] = [
  { id: 'r1', name: 'Deepika Nair', role: 'Senior UI/UX Designer', department: 'Design', allocation: 85, availability: '15%', skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], utilization: 88, projects: [{ projectId: 'p1', projectName: 'NexaBank Digital Transformation', allocation: 55 }, { projectId: 'p9', projectName: 'TravelWise Booking Engine', allocation: 30 }] },
  { id: 'r2', name: 'Vikram Joshi', role: 'Full Stack Developer', department: 'Engineering', allocation: 95, availability: '5%', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], utilization: 97, projects: [{ projectId: 'p2', projectName: 'ShopVerse E-Commerce Platform', allocation: 60 }, { projectId: 'p8', projectName: 'RetailPro POS System', allocation: 35 }] },
  { id: 'r3', name: 'Sneha Reddy', role: 'QA Lead', department: 'QA', allocation: 90, availability: '10%', skills: ['Selenium', 'Cypress', 'API Testing', 'Performance Testing'], utilization: 92, projects: [{ projectId: 'p3', projectName: 'MediCare Patient Portal', allocation: 50 }, { projectId: 'p7', projectName: 'FinEdge Trading Platform', allocation: 40 }] },
  { id: 'r4', name: 'Arun Kumar', role: 'Backend Developer', department: 'Engineering', allocation: 75, availability: '25%', skills: ['Java', 'Spring Boot', 'Kafka', 'AWS'], utilization: 78, projects: [{ projectId: 'p4', projectName: 'AutoFlow Fleet Management', allocation: 45 }, { projectId: 'p6', projectName: 'GreenEnergy IoT Dashboard', allocation: 30 }] },
  { id: 'r5', name: 'Nikhil Das', role: 'Tech Lead', department: 'Engineering', allocation: 100, availability: '0%', skills: ['Python', 'ML/AI', 'System Design', 'Microservices'], utilization: 100, projects: [{ projectId: 'p7', projectName: 'FinEdge Trading Platform', allocation: 70 }, { projectId: 'p1', projectName: 'NexaBank Digital Transformation', allocation: 30 }] },
  { id: 'r6', name: 'Meera Patel', role: 'Project Manager', department: 'Operations', allocation: 70, availability: '30%', skills: ['Agile', 'JIRA', 'Stakeholder Management', 'Risk Analysis'], utilization: 72, projects: [{ projectId: 'p10', projectName: 'CloudSync SaaS Monthly Retainer', allocation: 40 }, { projectId: 'p12', projectName: 'AgroTech Farm Analytics', allocation: 30 }] },
  { id: 'r7', name: 'Karthik Menon', role: 'DevOps Engineer', department: 'Engineering', allocation: 80, availability: '20%', skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'], utilization: 82, projects: [{ projectId: 'p1', projectName: 'NexaBank Digital Transformation', allocation: 50 }, { projectId: 'p7', projectName: 'FinEdge Trading Platform', allocation: 30 }] },
  { id: 'r8', name: 'Pooja Iyer', role: 'Frontend Developer', department: 'Engineering', allocation: 65, availability: '35%', skills: ['React', 'Next.js', 'Tailwind CSS', 'GraphQL'], utilization: 68, projects: [{ projectId: 'p2', projectName: 'ShopVerse E-Commerce Platform', allocation: 65 }] },
  { id: 'r9', name: 'Rahul Sharma', role: 'Senior Backend Developer', department: 'Engineering', allocation: 90, availability: '10%', skills: ['Go', 'gRPC', 'Redis', 'PostgreSQL'], utilization: 91, projects: [{ projectId: 'p3', projectName: 'MediCare Patient Portal', allocation: 55 }, { projectId: 'p4', projectName: 'AutoFlow Fleet Management', allocation: 35 }] },
  { id: 'r10', name: 'Ritika Gupta', role: 'HR Manager', department: 'HR', allocation: 60, availability: '40%', skills: ['Recruitment', 'Employee Relations', 'Compliance', 'Training'], utilization: 62, projects: [] },
];

// ---- Assets ----
export const mockAssets: Asset[] = [
  { id: 'a1', name: 'MacBook Pro 16" M3 Max', type: 'Laptop', serialNo: 'MBP-2024-001', assignedTo: 'Nikhil Das', warrantyEnd: '2027-01-15', status: 'active', purchaseDate: '2024-01-15', purchaseCost: 349000, issueLogs: [] },
  { id: 'a2', name: 'Dell UltraSharp 32" Monitor', type: 'Monitor', serialNo: 'MON-2024-001', assignedTo: 'Deepika Nair', warrantyEnd: '2027-03-01', status: 'active', purchaseDate: '2024-03-01', purchaseCost: 95000, issueLogs: [{ id: 'il1', date: '2025-06-15', description: 'Flickering issue — firmware updated', resolved: true }] },
  { id: 'a3', name: 'iPhone 15 Pro', type: 'Mobile', serialNo: 'IPH-2024-003', assignedTo: 'Arjun Mehta', warrantyEnd: '2026-09-20', status: 'active', purchaseDate: '2024-09-20', purchaseCost: 134900, issueLogs: [] },
  { id: 'a4', name: 'ThinkPad X1 Carbon Gen 11', type: 'Laptop', serialNo: 'TPD-2023-002', assignedTo: 'Vikram Joshi', warrantyEnd: '2026-06-15', status: 'active', purchaseDate: '2023-06-15', purchaseCost: 185000, issueLogs: [{ id: 'il2', date: '2025-11-01', description: 'Battery replacement required', resolved: true }, { id: 'il3', date: '2026-04-05', description: 'Keyboard unresponsive — sent for repair', resolved: false }] },
  { id: 'a5', name: 'Cisco WebEx Room Kit', type: 'AV Equipment', serialNo: 'AV-2024-001', assignedTo: 'Conference Room A', warrantyEnd: '2026-12-01', status: 'active', purchaseDate: '2024-12-01', purchaseCost: 420000, issueLogs: [] },
  { id: 'a6', name: 'HP LaserJet Pro M404dn', type: 'Printer', serialNo: 'PRT-2023-001', assignedTo: 'Floor 3 — Open Office', warrantyEnd: '2025-12-01', status: 'in-repair', purchaseDate: '2023-12-01', purchaseCost: 45000, issueLogs: [{ id: 'il4', date: '2026-04-02', description: 'Paper jam and toner cartridge issue', resolved: false }] },
  { id: 'a7', name: 'MacBook Air M2', type: 'Laptop', serialNo: 'MBA-2024-001', assignedTo: 'Meera Patel', warrantyEnd: '2026-08-15', status: 'active', purchaseDate: '2024-08-15', purchaseCost: 119900, issueLogs: [] },
  { id: 'a8', name: 'iPad Pro 12.9"', type: 'Tablet', serialNo: 'IPD-2023-001', assignedTo: 'Sneha Reddy', warrantyEnd: '2025-11-01', status: 'retired', purchaseDate: '2023-11-01', purchaseCost: 99900, issueLogs: [{ id: 'il5', date: '2025-10-15', description: 'Screen damage — retired', resolved: true }] },
  { id: 'a9', name: 'Samsung 49" Ultrawide Monitor', type: 'Monitor', serialNo: 'MON-2024-002', assignedTo: 'Karthik Menon', warrantyEnd: '2027-02-01', status: 'active', purchaseDate: '2024-02-01', purchaseCost: 125000, issueLogs: [] },
  { id: 'a10', name: 'Dell PowerEdge R750 Server', type: 'Server', serialNo: 'SRV-2024-001', assignedTo: 'Data Center — Rack 3', warrantyEnd: '2029-01-15', status: 'active', purchaseDate: '2024-01-15', purchaseCost: 1850000, issueLogs: [{ id: 'il6', date: '2025-09-10', description: 'RAM module failure — replaced under warranty', resolved: true }] },
];

// ---- SOPs ----
export const mockSops: SOP[] = [
  { id: 'sop1', title: 'Client Onboarding Process', department: 'Operations', steps: [{ id: 's1', title: 'Requirement Gathering', description: 'Conduct initial discovery call and document client requirements', assigneeRole: 'Account Manager' }, { id: 's2', title: 'Proposal & SOW', description: 'Prepare project proposal and statement of work', assigneeRole: 'Project Manager' }, { id: 's3', title: 'Contract Signing', description: 'Get legal review and contract execution', assigneeRole: 'Legal' }, { id: 's4', title: 'Project Kickoff', description: 'Schedule and conduct project kickoff meeting', assigneeRole: 'Project Manager' }, { id: 's5', title: 'Team Allocation', description: 'Assign resources and set up project infrastructure', assigneeRole: 'Resource Manager' }], version: 3, author: 'Meera Patel', status: 'published', lastUpdated: '2026-03-15' },
  { id: 'sop2', title: 'Code Review & Deployment', department: 'Engineering', steps: [{ id: 's6', title: 'Self Review', description: 'Developer runs tests and self-reviews code', assigneeRole: 'Developer' }, { id: 's7', title: 'Peer Review', description: 'Minimum 2 peer reviews required before merge', assigneeRole: 'Senior Developer' }, { id: 's8', title: 'QA Validation', description: 'QA team validates the feature in staging', assigneeRole: 'QA Engineer' }, { id: 's9', title: 'Release Approval', description: 'Tech lead approves production deployment', assigneeRole: 'Tech Lead' }, { id: 's10', title: 'Deployment', description: 'Deploy to production with rollback plan', assigneeRole: 'DevOps Engineer' }], version: 5, author: 'Nikhil Das', status: 'published', lastUpdated: '2026-04-01' },
  { id: 'sop3', title: 'Employee Exit Process', department: 'HR', steps: [{ id: 's11', title: 'Resignation Acceptance', description: 'HR receives and acknowledges resignation letter', assigneeRole: 'HR Manager' }, { id: 's12', title: 'Knowledge Transfer', description: 'Departing employee documents and transfers knowledge', assigneeRole: 'Team Lead' }, { id: 's13', title: 'Asset Return', description: 'Collect all company assets and revoke access', assigneeRole: 'IT Admin' }, { id: 's14', title: 'Final Settlement', description: 'Process full and final settlement', assigneeRole: 'Finance' }], version: 2, author: 'Ritika Gupta', status: 'published', lastUpdated: '2026-02-20' },
  { id: 'sop4', title: 'Invoice Generation & Follow-up', department: 'Finance', steps: [{ id: 's15', title: 'Milestone Verification', description: 'Verify project milestone completion before invoicing', assigneeRole: 'Project Manager' }, { id: 's16', title: 'Invoice Creation', description: 'Generate invoice with all applicable taxes', assigneeRole: 'Accounts' }, { id: 's17', title: 'Approval Chain', description: 'Route through PM → Finance Head approval', assigneeRole: 'Finance Head' }, { id: 's18', title: 'Client Dispatch', description: 'Send invoice to client with payment terms', assigneeRole: 'Accounts' }, { id: 's19', title: 'Follow-up Schedule', description: 'Set automated reminders at 7, 14, 21 days', assigneeRole: 'Accounts' }], version: 2, author: 'Anita Kulkarni', status: 'published', lastUpdated: '2026-03-10' },
  { id: 'sop5', title: 'Incident Response Protocol', department: 'Engineering', steps: [{ id: 's20', title: 'Detection', description: 'Monitor and detect production incidents via alerts', assigneeRole: 'SRE Team' }, { id: 's21', title: 'Triage', description: 'Assess severity and assign incident owner', assigneeRole: 'On-Call Engineer' }, { id: 's22', title: 'Mitigation', description: 'Apply immediate fix or workaround', assigneeRole: 'Engineering Team' }, { id: 's23', title: 'Resolution', description: 'Implement permanent fix and verify', assigneeRole: 'Engineering Team' }, { id: 's24', title: 'Post-Mortem', description: 'Conduct blameless post-mortem within 48 hours', assigneeRole: 'Tech Lead' }], version: 4, author: 'Karthik Menon', status: 'published', lastUpdated: '2026-04-05' },
  { id: 'sop6', title: 'New Hire Onboarding Checklist', department: 'HR', steps: [{ id: 's25', title: 'Documentation Collection', description: 'Collect KYC, education, and experience documents', assigneeRole: 'HR Executive' }, { id: 's26', title: 'IT Setup', description: 'Provision laptop, email, and tool access', assigneeRole: 'IT Admin' }, { id: 's27', title: 'Orientation Session', description: 'Company culture, policies, and team introduction', assigneeRole: 'HR Manager' }, { id: 's28', title: 'Buddy Assignment', description: 'Assign a buddy for the first 30 days', assigneeRole: 'Team Lead' }], version: 3, author: 'Ritika Gupta', status: 'draft', lastUpdated: '2026-04-08' },
  { id: 'sop7', title: 'Vendor Evaluation & Onboarding', department: 'Procurement', steps: [{ id: 's29', title: 'Requirement Definition', description: 'Define scope, deliverables, and SLA expectations', assigneeRole: 'Procurement Lead' }, { id: 's30', title: 'Vendor Screening', description: 'Evaluate vendor credentials, past work, and compliance', assigneeRole: 'Procurement Lead' }, { id: 's31', title: 'Negotiation & Contract', description: 'Finalize terms, pricing, and legal agreements', assigneeRole: 'Legal' }, { id: 's32', title: 'Pilot Period', description: 'Execute a 30-day pilot before full engagement', assigneeRole: 'Project Manager' }], version: 1, author: 'Anita Kulkarni', status: 'draft', lastUpdated: '2026-04-10' },
  { id: 'sop8', title: 'Client Communication Guidelines', department: 'Operations', steps: [{ id: 's33', title: 'Response SLA', description: 'Acknowledge client queries within 4 business hours', assigneeRole: 'Account Manager' }, { id: 's34', title: 'Status Updates', description: 'Weekly progress update every Friday by 5 PM IST', assigneeRole: 'Project Manager' }, { id: 's35', title: 'Escalation Matrix', description: 'Define escalation tiers and response times', assigneeRole: 'Operations Head' }], version: 2, author: 'Arjun Mehta', status: 'published', lastUpdated: '2026-01-20' },
];

// ---- Chat Channels ----
export const mockChatChannels: ChatChannel[] = [
  { id: 'ch1', name: '#general', type: 'department', members: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'Priya: Sprint review at 3 PM today', unreadCount: 3 },
  { id: 'ch2', name: 'NexaBank Project', type: 'project', members: ['e1', 'e5', 'e7', 'e2'], lastMessage: 'Nikhil: API gateway migration is done 🎉', unreadCount: 0 },
  { id: 'ch3', name: 'FinEdge Trading', type: 'project', members: ['e3', 'e5', 'e9', 'e7'], lastMessage: 'Sneha: Compliance docs need review by EOD', unreadCount: 5 },
  { id: 'ch4', name: 'Engineering Team', type: 'department', members: ['e2', 'e4', 'e5', 'e7', 'e8', 'e9'], lastMessage: 'Vikram: Who broke the staging build? 😅', unreadCount: 12 },
  { id: 'ch5', name: 'Arjun Mehta', type: 'direct', members: ['e2'], lastMessage: 'Vikram: Updated the invoice, please check', unreadCount: 1 },
  { id: 'ch6', name: '#announcements', type: 'announcement', members: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'HR: Quarterly town hall on April 18th', unreadCount: 2 },
  { id: 'ch7', name: 'ShopVerse Platform', type: 'project', members: ['e2', 'e8', 'e1', 'e6'], lastMessage: 'Pooja: Payment gateway UI is ready for review', unreadCount: 0 },
  { id: 'ch8', name: 'Design Reviews', type: 'department', members: ['e1', 'e8', 'e6'], lastMessage: 'Deepika: New dashboard mockups uploaded', unreadCount: 4 },
];

// ---- Chat Messages ----
export const mockChatMessages: ChatMessage[] = [
  { id: 'msg1', channelId: 'ch1', sender: 'Priya Sharma', content: 'Sprint review at 3 PM today. Please have your updates ready.', timestamp: '2026-04-10T14:30:00', isPinned: true, attachments: [] },
  { id: 'msg2', channelId: 'ch1', sender: 'Vikram Joshi', content: 'Will do! Payment integration is 85% complete.', timestamp: '2026-04-10T14:35:00', isPinned: false, attachments: [] },
  { id: 'msg3', channelId: 'ch2', sender: 'Nikhil Das', content: 'API gateway migration is done 🎉 All endpoints responding within SLA.', timestamp: '2026-04-10T11:00:00', isPinned: true, attachments: [{ id: 'att1', name: 'api-migration-report.pdf', type: 'pdf', url: '#' }] },
  { id: 'msg4', channelId: 'ch2', sender: 'Karthik Menon', content: 'Great work! Rate limiting tests passing with 99.7% accuracy.', timestamp: '2026-04-10T11:15:00', isPinned: false, attachments: [] },
  { id: 'msg5', channelId: 'ch3', sender: 'Sneha Reddy', content: 'Compliance docs need review by EOD. SEBI requirements updated.', timestamp: '2026-04-10T09:30:00', isPinned: true, attachments: [{ id: 'att2', name: 'SEBI-Compliance-v2.docx', type: 'docx', url: '#' }] },
  { id: 'msg6', channelId: 'ch4', sender: 'Vikram Joshi', content: 'Who broke the staging build? 😅', timestamp: '2026-04-10T16:00:00', isPinned: false, attachments: [] },
  { id: 'msg7', channelId: 'ch4', sender: 'Arun Kumar', content: 'My bad! Fixed the merge conflict. Build is green now.', timestamp: '2026-04-10T16:05:00', isPinned: false, attachments: [] },
  { id: 'msg8', channelId: 'ch4', sender: 'Rahul Sharma', content: 'Please run full test suite before pushing to staging next time 🙏', timestamp: '2026-04-10T16:10:00', isPinned: false, attachments: [] },
  { id: 'msg9', channelId: 'ch5', sender: 'Vikram Joshi', content: 'Updated the invoice, please check', timestamp: '2026-04-10T13:00:00', isPinned: false, attachments: [{ id: 'att3', name: 'INV-2026-013.pdf', type: 'pdf', url: '#' }] },
  { id: 'msg10', channelId: 'ch6', sender: 'HR Team', content: 'Quarterly town hall on April 18th. Theme: Innovation & Growth. All hands mandatory.', timestamp: '2026-04-10T10:00:00', isPinned: true, attachments: [{ id: 'att4', name: 'town-hall-agenda.pdf', type: 'pdf', url: '#' }] },
  { id: 'msg11', channelId: 'ch7', sender: 'Pooja Iyer', content: 'Payment gateway UI is ready for review. Attached screenshots.', timestamp: '2026-04-10T15:00:00', isPinned: false, attachments: [{ id: 'att5', name: 'checkout-ui-v3.png', type: 'png', url: '#' }] },
  { id: 'msg12', channelId: 'ch8', sender: 'Deepika Nair', content: 'New dashboard mockups uploaded for NexaBank project. Feedback appreciated!', timestamp: '2026-04-10T12:00:00', isPinned: false, attachments: [{ id: 'att6', name: 'dashboard-mockup.fig', type: 'fig', url: '#' }] },
];

// ---- Delivery Items ----
export const mockDeliveryItems: DeliveryItem[] = [
  { id: 'd1', projectId: 'p1', deliverable: 'Mobile Banking App v2.0', status: 'in-progress', dueDate: '2026-06-15', clientApproval: false, revisionRounds: 1, assignedTo: 'Pooja Iyer' },
  { id: 'd2', projectId: 'p1', deliverable: 'Admin Dashboard', status: 'client-review', dueDate: '2026-04-20', clientApproval: false, revisionRounds: 0, assignedTo: 'Deepika Nair' },
  { id: 'd3', projectId: 'p1', deliverable: 'API Gateway', status: 'approved', dueDate: '2026-03-01', clientApproval: true, revisionRounds: 2, assignedTo: 'Karthik Menon' },
  { id: 'd4', projectId: 'p2', deliverable: 'Product Catalog Module', status: 'delivered', dueDate: '2026-02-15', clientApproval: true, revisionRounds: 1, assignedTo: 'Vikram Joshi' },
  { id: 'd5', projectId: 'p2', deliverable: 'Checkout Flow', status: 'review', dueDate: '2026-05-01', clientApproval: false, revisionRounds: 0, assignedTo: 'Pooja Iyer' },
  { id: 'd6', projectId: 'p3', deliverable: 'Patient Dashboard', status: 'revision', dueDate: '2026-04-10', clientApproval: false, revisionRounds: 2, assignedTo: 'Deepika Nair' },
  { id: 'd7', projectId: 'p3', deliverable: 'Doctor Portal', status: 'approved', dueDate: '2026-03-15', clientApproval: true, revisionRounds: 1, assignedTo: 'Vikram Joshi' },
  { id: 'd8', projectId: 'p4', deliverable: 'Live Tracking Dashboard', status: 'in-progress', dueDate: '2026-05-30', clientApproval: false, revisionRounds: 0, assignedTo: 'Arun Kumar' },
  { id: 'd9', projectId: 'p7', deliverable: 'Trading Engine MVP', status: 'approved', dueDate: '2026-01-15', clientApproval: true, revisionRounds: 3, assignedTo: 'Nikhil Das' },
  { id: 'd10', projectId: 'p7', deliverable: 'Risk Management Module', status: 'in-progress', dueDate: '2026-05-01', clientApproval: false, revisionRounds: 1, assignedTo: 'Rahul Sharma' },
  { id: 'd11', projectId: 'p7', deliverable: 'Compliance Portal', status: 'pending', dueDate: '2026-06-15', clientApproval: false, revisionRounds: 0, assignedTo: 'Sneha Reddy' },
  { id: 'd12', projectId: 'p10', deliverable: 'Monthly Sprint Report - April', status: 'pending', dueDate: '2026-04-30', clientApproval: false, revisionRounds: 0, assignedTo: 'Meera Patel' },
];

// ---- Profitability ----
export const mockProfitability: ProfitabilityData[] = [
  { clientId: 'cl1', clientName: 'NexaBank Holdings', revenue: 1980000, cost: 1611000, margin: 18.6, burnRate: 660000, alerts: [{ id: 'pa1', type: 'burn-rate', message: 'Burn rate increased 12% this quarter', severity: 'warning' }] },
  { clientId: 'cl2', clientName: 'ShopVerse Inc.', revenue: 1240000, cost: 963800, margin: 22.3, burnRate: 413333, alerts: [] },
  { clientId: 'cl3', clientName: 'MediCare Global', revenue: 980000, cost: 1011160, margin: -3.2, burnRate: 490000, alerts: [{ id: 'pa2', type: 'over-budget', message: 'Project over budget by ₹30,000', severity: 'critical' }, { id: 'pa3', type: 'margin-drop', message: 'Margin dropped to -3.2% — cost overrun detected', severity: 'critical' }] },
  { clientId: 'cl4', clientName: 'AutoFlow Logistics', revenue: 720000, cost: 515520, margin: 28.4, burnRate: 257143, alerts: [] },
  { clientId: 'cl5', clientName: 'EduSpark Foundation', revenue: 680000, cost: 597680, margin: 12.1, burnRate: 0, alerts: [] },
  { clientId: 'cl6', clientName: 'GreenEnergy Corp', revenue: 310000, cost: 261020, margin: 15.8, burnRate: 155000, alerts: [] },
  { clientId: 'cl7', clientName: 'FinEdge Capital', revenue: 2850000, cost: 2616300, margin: 8.2, burnRate: 712500, alerts: [{ id: 'pa4', type: 'burn-rate', message: 'High burn rate — risk of margin erosion', severity: 'warning' }] },
  { clientId: 'cl8', clientName: 'CloudSync Technologies', revenue: 142500, cost: 96697, margin: 32.1, burnRate: 47500, alerts: [] },
  { clientId: 'cl9', clientName: 'LegalEase LLP', revenue: 520000, cost: 564200, margin: -8.5, burnRate: 0, alerts: [{ id: 'pa5', type: 'invoice-delay', message: 'Final invoice payment blocked by client', severity: 'critical' }] },
  { clientId: 'cl10', clientName: 'AgroTech Solutions', revenue: 195000, cost: 145072, margin: 25.6, burnRate: 97500, alerts: [] },
];

// ---- AI Ops Insights ----
export const mockAiOpsInsights: AiOpsInsight[] = [
  { id: 'ai1', type: 'delivery_risk', title: 'MediCare Project Deadline at Risk', severity: 'critical', description: 'The MediCare Patient Portal has only 10% remaining work but SLA compliance has dropped to 88%. At current velocity, UAT sign-off milestone (April 15) will be missed by 8 days.', recommendation: 'Allocate a senior QA resource for the next 2 sprints. Prioritize compliance audit tasks. Schedule daily standups with the client.', affectedEntities: ['MediCare Patient Portal', 'Sneha Reddy', 'Rahul Sharma'], confidence: 92 },
  { id: 'ai2', type: 'cost_anomaly', title: 'FinEdge Resource Cost Spike Detected', severity: 'high', description: 'FinEdge Trading Platform has consumed 89% of its ₹32L budget with only 75% project completion. At this rate, the project will exceed budget by ₹5.3L.', recommendation: 'Review and optimize resource allocation. Identify tasks that can be deferred. Negotiate additional budget with the client.', affectedEntities: ['FinEdge Trading Platform', 'Nikhil Das', 'Rahul Sharma'], confidence: 87 },
  { id: 'ai3', type: 'vendor_risk', title: 'CloudOps Performance Degradation', severity: 'high', description: 'CloudOps Infra Management SLA score dropped to 78% (threshold: 85%). Two incidents in the last 30 days with average resolution time exceeding 4 hours.', recommendation: 'Schedule a vendor performance review meeting. Consider backup DevOps vendor. Add penalty clause for future SLA breaches.', affectedEntities: ['CloudOps Infra Management', 'ShopVerse E-Commerce Platform', 'AutoFlow Fleet Management'], confidence: 89 },
  { id: 'ai4', type: 'revenue_forecast', title: 'Q2 Revenue Forecast: ₹58.2L', severity: 'low', description: 'Based on current pipeline and project burn rates, Q2 2026 projected revenue is ₹58.2L, a 15% increase over Q1. Main contributors: NexaBank (₹20L), FinEdge (₹18L), ShopVerse (₹12L).', recommendation: 'Focus on closing the TravelWise SOW to add ₹15L to Q2. Follow up on 2 pending proposals.', affectedEntities: ['NexaBank Digital Transformation', 'FinEdge Trading Platform', 'ShopVerse E-Commerce Platform'], confidence: 78 },
  { id: 'ai5', type: 'resource_alert', title: 'Nikhil Das at 100% Allocation', severity: 'medium', description: 'Tech Lead Nikhil Das is at 100% allocation across FinEdge (70%) and NexaBank (30%). This is unsustainable and poses a burnout risk. No capacity for emergency tasks.', recommendation: 'Promote a senior engineer to share FinEdge leadership. Reduce NexaBank allocation to 15% and reassign tasks.', affectedEntities: ['Nikhil Das', 'FinEdge Trading Platform', 'NexaBank Digital Transformation'], confidence: 95 },
  { id: 'ai6', type: 'optimization', title: 'Vendor Consolidation Opportunity', severity: 'low', description: 'Three vendors (CloudOps, NetSpeed, CodeReview) provide overlapping services. Consolidating could save ₹2.4L annually while improving service quality.', recommendation: 'Evaluate AWS partner vendors for unified DevOps + CDN. Phase out CodeReview Pro (suspended) and migrate to QuickTest.', affectedEntities: ['CloudOps Infra Management', 'NetSpeed CDN Services', 'CodeReview Pro'], confidence: 72 },
  { id: 'ai7', type: 'compliance', title: 'HIPAA Compliance Gap — MediCare', severity: 'critical', description: 'Three MediCare Patient Portal deliverables still require HIPAA audit sign-off before deployment. The compliance deadline is April 22. No audit slot has been booked.', recommendation: 'Immediately book a compliance audit with SecureNet. Assign Sneha Reddy exclusively to this task until completion.', affectedEntities: ['MediCare Patient Portal', 'SecureNet Cybersecurity', 'Sneha Reddy'], confidence: 96 },
  { id: 'ai8', type: 'cost_anomaly', title: 'LegalEase Project — Negative Margin', severity: 'high', description: 'LegalEase Document Management closed at a negative margin of -8.5% (₹80K over budget). The client is withholding the final ₹1.8L payment due to 3 unresolved defects.', recommendation: 'Assign a senior developer to resolve the 3 defects within 1 week. Escalate payment issue to the AM. Write off ₹80K if payment is received.', affectedEntities: ['LegalEase Document Management', 'Rahul Sharma', 'LegalCraft Advisory'], confidence: 91 },
  { id: 'ai9', type: 'delivery_risk', title: 'ShopVerse Checkout — Integration Blocked', severity: 'medium', description: 'The payment gateway integration task depends on the completed Stripe SDK upgrade. The Stripe dependency has an unresolved breaking change in their latest API version.', recommendation: 'Pin the Stripe SDK to the previous stable version. Contact Stripe support for the API breaking change resolution timeline.', affectedEntities: ['ShopVerse E-Commerce Platform', 'Vikram Joshi'], confidence: 83 },
  { id: 'ai10', type: 'optimization', title: 'Sprint Velocity Optimization', severity: 'low', description: 'Engineering team average sprint velocity is 42 story points, down from 48 last quarter. Primary cause: context switching between 3+ projects per developer.', recommendation: 'Implement project focus weeks (1 week per project). Reduce parallel project assignments to max 2 per engineer.', affectedEntities: ['Engineering Team', 'Nikhil Das', 'Vikram Joshi', 'Arun Kumar'], confidence: 81 },
];

// ---- Employees ----
export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Deepika Nair', email: 'deepika.nair@company.com', phone: '+91 98765 12345', department: 'Design', designation: 'Senior UI/UX Designer', manager: 'Arjun Mehta', salaryBand: 'E4', joinDate: '2023-03-15', status: 'active', activeProjects: 2, productivityScore: 92, avatar: 'DN' },
  { id: 'e2', name: 'Vikram Joshi', email: 'vikram.joshi@company.com', phone: '+91 87654 23456', department: 'Engineering', designation: 'Full Stack Developer', manager: 'Nikhil Das', salaryBand: 'E3', joinDate: '2023-06-01', status: 'active', activeProjects: 2, productivityScore: 88, avatar: 'VJ' },
  { id: 'e3', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', phone: '+91 76543 34567', department: 'QA', designation: 'QA Lead', manager: 'Nikhil Das', salaryBand: 'E4', joinDate: '2022-11-10', status: 'active', activeProjects: 2, productivityScore: 85, avatar: 'SR' },
  { id: 'e4', name: 'Arun Kumar', email: 'arun.kumar@company.com', phone: '+91 65432 45678', department: 'Engineering', designation: 'Backend Developer', manager: 'Nikhil Das', salaryBand: 'E3', joinDate: '2024-01-08', status: 'active', activeProjects: 2, productivityScore: 79, avatar: 'AK' },
  { id: 'e5', name: 'Nikhil Das', email: 'nikhil.das@company.com', phone: '+91 54321 56789', department: 'Engineering', designation: 'Tech Lead', manager: 'CTO', salaryBand: 'E5', joinDate: '2021-07-15', status: 'active', activeProjects: 2, productivityScore: 95, avatar: 'ND' },
  { id: 'e6', name: 'Meera Patel', email: 'meera.patel@company.com', phone: '+91 43210 67890', department: 'Operations', designation: 'Project Manager', manager: 'Arjun Mehta', salaryBand: 'E4', joinDate: '2023-01-20', status: 'active', activeProjects: 2, productivityScore: 87, avatar: 'MP' },
  { id: 'e7', name: 'Karthik Menon', email: 'karthik.menon@company.com', phone: '+91 32109 78901', department: 'Engineering', designation: 'DevOps Engineer', manager: 'Nikhil Das', salaryBand: 'E3', joinDate: '2023-09-05', status: 'active', activeProjects: 2, productivityScore: 83, avatar: 'KM' },
  { id: 'e8', name: 'Pooja Iyer', email: 'pooja.iyer@company.com', phone: '+91 21098 89012', department: 'Engineering', designation: 'Frontend Developer', manager: 'Nikhil Das', salaryBand: 'E2', joinDate: '2024-04-01', status: 'probation', activeProjects: 1, productivityScore: 74, avatar: 'PI' },
  { id: 'e9', name: 'Rahul Sharma', email: 'rahul.sharma@company.com', phone: '+91 10987 90123', department: 'Engineering', designation: 'Senior Backend Developer', manager: 'Nikhil Das', salaryBand: 'E4', joinDate: '2022-05-15', status: 'active', activeProjects: 2, productivityScore: 90, avatar: 'RS' },
  { id: 'e10', name: 'Ritika Gupta', email: 'ritika.gupta@company.com', phone: '+91 99887 01234', department: 'HR', designation: 'HR Manager', manager: 'COO', salaryBand: 'E4', joinDate: '2022-08-20', status: 'active', activeProjects: 0, productivityScore: 86, avatar: 'RG' },
  { id: 'e11', name: 'Saurabh Jain', email: 'saurabh.jain@company.com', phone: '+91 88776 12345', department: 'Sales', designation: 'Account Executive', manager: 'Arjun Mehta', salaryBand: 'E3', joinDate: '2023-11-01', status: 'active', activeProjects: 0, productivityScore: 91, avatar: 'SJ' },
  { id: 'e12', name: 'Anita Kulkarni', email: 'anita.kulkarni@company.com', phone: '+91 77665 23456', department: 'Finance', designation: 'Finance Manager', manager: 'CFO', salaryBand: 'E4', joinDate: '2022-04-10', status: 'active', activeProjects: 0, productivityScore: 89, avatar: 'ANK' },
];

// ---- Attendance ----
export const mockAttendance: AttendanceRecord[] = [
  { id: 'att1', employeeId: 'e1', date: '2026-04-10', checkIn: '09:05', checkOut: '18:15', hours: 9.17, overtime: 0.17, status: 'present', isAnomaly: false },
  { id: 'att2', employeeId: 'e2', date: '2026-04-10', checkIn: '08:45', checkOut: '19:30', hours: 10.75, overtime: 1.75, status: 'present', isAnomaly: false },
  { id: 'att3', employeeId: 'e3', date: '2026-04-10', checkIn: '09:30', checkOut: '18:00', hours: 8.5, overtime: 0, status: 'present', isAnomaly: false },
  { id: 'att4', employeeId: 'e4', date: '2026-04-10', checkIn: '10:15', checkOut: '17:30', hours: 7.25, overtime: 0, status: 'present', isAnomaly: true },
  { id: 'att5', employeeId: 'e5', date: '2026-04-10', checkIn: '08:30', checkOut: '20:45', hours: 12.25, overtime: 3.25, status: 'present', isAnomaly: true },
  { id: 'att6', employeeId: 'e6', date: '2026-04-10', checkIn: '09:00', checkOut: '18:00', hours: 9, overtime: 0, status: 'wfh', isAnomaly: false },
  { id: 'att7', employeeId: 'e7', date: '2026-04-10', checkIn: '09:10', checkOut: '18:20', hours: 9.17, overtime: 0.17, status: 'present', isAnomaly: false },
  { id: 'att8', employeeId: 'e8', date: '2026-04-10', checkIn: null, checkOut: null, hours: 0, overtime: 0, status: 'on-leave', isAnomaly: false },
  { id: 'att9', employeeId: 'e9', date: '2026-04-10', checkIn: '09:00', checkOut: '19:00', hours: 10, overtime: 1, status: 'present', isAnomaly: false },
  { id: 'att10', employeeId: 'e10', date: '2026-04-10', checkIn: '09:15', checkOut: '17:45', hours: 8.5, overtime: 0, status: 'present', isAnomaly: false },
  { id: 'att11', employeeId: 'e11', date: '2026-04-10', checkIn: null, checkOut: null, hours: 0, overtime: 0, status: 'absent', isAnomaly: true },
  { id: 'att12', employeeId: 'e12', date: '2026-04-10', checkIn: '09:00', checkOut: '18:00', hours: 9, overtime: 0, status: 'present', isAnomaly: false },
];

// ---- Leave Requests ----
export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'e3', type: 'casual', startDate: '2026-04-11', endDate: '2026-04-13', days: 3, status: 'approved', reason: 'Personal work — family function', approver: 'Nikhil Das' },
  { id: 'lr2', employeeId: 'e8', type: 'sick', startDate: '2026-04-10', endDate: '2026-04-11', days: 2, status: 'approved', reason: 'Fever and cold', approver: 'Nikhil Das' },
  { id: 'lr3', employeeId: 'e11', type: 'casual', startDate: '2026-04-10', endDate: '2026-04-10', days: 1, status: 'pending', reason: 'Personal emergency', approver: 'Arjun Mehta' },
  { id: 'lr4', employeeId: 'e5', type: 'earned', startDate: '2026-04-21', endDate: '2026-04-25', days: 5, status: 'pending', reason: 'Vacation — Goa trip', approver: 'CTO' },
  { id: 'lr5', employeeId: 'e4', type: 'comp-off', startDate: '2026-04-18', endDate: '2026-04-18', days: 1, status: 'approved', reason: 'Compensatory off for weekend deployment', approver: 'Nikhil Das' },
  { id: 'lr6', employeeId: 'e6', type: 'casual', startDate: '2026-04-14', endDate: '2026-04-14', days: 1, status: 'pending', reason: 'Bank work — home loan processing', approver: 'Arjun Mehta' },
  { id: 'lr7', employeeId: 'e9', type: 'sick', startDate: '2026-04-05', endDate: '2026-04-06', days: 2, status: 'rejected', reason: 'Not feeling well', approver: 'Nikhil Das' },
  { id: 'lr8', employeeId: 'e2', type: 'earned', startDate: '2026-05-01', endDate: '2026-05-05', days: 5, status: 'pending', reason: 'Annual leave — visiting parents', approver: 'Nikhil Das' },
  { id: 'lr9', employeeId: 'e1', type: 'maternity', startDate: '2026-07-01', endDate: '2026-09-28', days: 90, status: 'approved', reason: 'Maternity leave as per company policy', approver: 'Arjun Mehta' },
  { id: 'lr10', employeeId: 'e7', type: 'loss-of-pay', startDate: '2026-04-15', endDate: '2026-04-15', days: 1, status: 'cancelled', reason: 'Personal errand — cancelled request', approver: 'Nikhil Das' },
];

// ---- Performance Reviews ----
export const mockPerformanceReviews: PerformanceReview[] = [
  { id: 'perf1', employeeId: 'e1', period: 'Q1 2026', kpiScore: 92, slaScore: 96, taskCompletion: 95, clientFeedback: 88, promotionReadiness: 'ready' },
  { id: 'perf2', employeeId: 'e2', period: 'Q1 2026', kpiScore: 88, slaScore: 90, taskCompletion: 85, clientFeedback: 82, promotionReadiness: 'developing' },
  { id: 'perf3', employeeId: 'e3', period: 'Q1 2026', kpiScore: 85, slaScore: 88, taskCompletion: 82, clientFeedback: 80, promotionReadiness: 'developing' },
  { id: 'perf4', employeeId: 'e5', period: 'Q1 2026', kpiScore: 95, slaScore: 94, taskCompletion: 98, clientFeedback: 92, promotionReadiness: 'overdue' },
  { id: 'perf5', employeeId: 'e6', period: 'Q1 2026', kpiScore: 87, slaScore: 92, taskCompletion: 84, clientFeedback: 86, promotionReadiness: 'developing' },
  { id: 'perf6', employeeId: 'e9', period: 'Q1 2026', kpiScore: 90, slaScore: 91, taskCompletion: 88, clientFeedback: 85, promotionReadiness: 'ready' },
  { id: 'perf7', employeeId: 'e7', period: 'Q1 2026', kpiScore: 83, slaScore: 86, taskCompletion: 80, clientFeedback: 78, promotionReadiness: 'not-ready' },
  { id: 'perf8', employeeId: 'e11', period: 'Q1 2026', kpiScore: 91, slaScore: 89, taskCompletion: 93, clientFeedback: 90, promotionReadiness: 'ready' },
  { id: 'perf9', employeeId: 'e4', period: 'Q1 2026', kpiScore: 79, slaScore: 82, taskCompletion: 76, clientFeedback: 74, promotionReadiness: 'not-ready' },
  { id: 'perf10', employeeId: 'e10', period: 'Q1 2026', kpiScore: 86, slaScore: 90, taskCompletion: 84, clientFeedback: 0, promotionReadiness: 'developing' },
];

// ---- Incentives ----
export const mockIncentives: Incentive[] = [
  { id: 'inc1', employeeId: 'e5', type: 'performance', amount: 40000, month: '2026-03', description: 'Q1 Excellence Award — Outstanding delivery on FinEdge', status: 'disbursed' },
  { id: 'inc2', employeeId: 'e1', type: 'project-bonus', amount: 25000, month: '2026-03', description: 'NexaBank client appreciation bonus', status: 'disbursed' },
  { id: 'inc3', employeeId: 'e9', type: 'spot-award', amount: 10000, month: '2026-03', description: 'Resolved critical production incident under 30 minutes', status: 'disbursed' },
  { id: 'inc4', employeeId: 'e11', type: 'referral', amount: 15000, month: '2026-02', description: 'Referral bonus — Pooja Iyer successfully completed probation', status: 'disbursed' },
  { id: 'inc5', employeeId: 'e2', type: 'performance', amount: 30000, month: '2026-03', description: 'Exceeded sprint velocity targets by 20%', status: 'approved' },
  { id: 'inc6', employeeId: 'e6', type: 'project-bonus', amount: 20000, month: '2026-03', description: 'Successfully onboarded CloudSync retainer client', status: 'approved' },
  { id: 'inc7', employeeId: 'e3', type: 'performance', amount: 15000, month: '2026-03', description: 'Zero production escapes in Q1', status: 'disbursed' },
  { id: 'inc8', employeeId: 'e8', type: 'retention', amount: 8000, month: '2026-04', description: 'Probation completion bonus', status: 'pending' },
  { id: 'inc9', employeeId: 'e4', type: 'performance', amount: 12000, month: '2026-04', description: 'IoT pipeline delivery ahead of schedule', status: 'pending' },
  { id: 'inc10', employeeId: 'e7', type: 'spot-award', amount: 5000, month: '2026-04', description: 'Weekend deployment support — NexaBank', status: 'approved' },
];

// ---- Onboarding Tasks ----
export const mockOnboardingTasks: OnboardingTask[] = [
  { id: 'onb1', employeeId: 'e8', task: 'Complete KYC document submission', category: 'hr', completed: true, dueDate: '2026-04-01', assignedBy: 'Ritika Gupta' },
  { id: 'onb2', employeeId: 'e8', task: 'Laptop provisioning and setup', category: 'it', completed: true, dueDate: '2026-04-02', assignedBy: 'IT Admin' },
  { id: 'onb3', employeeId: 'e8', task: 'Email and tool access provisioning', category: 'it', completed: true, dueDate: '2026-04-02', assignedBy: 'IT Admin' },
  { id: 'onb4', employeeId: 'e8', task: 'Company orientation session', category: 'hr', completed: true, dueDate: '2026-04-03', assignedBy: 'Ritika Gupta' },
  { id: 'onb5', employeeId: 'e8', task: 'Department introduction meeting', category: 'department', completed: true, dueDate: '2026-04-04', assignedBy: 'Nikhil Das' },
  { id: 'onb6', employeeId: 'e8', task: 'React + Next.js codebase walkthrough', category: 'training', completed: false, dueDate: '2026-04-10', assignedBy: 'Vikram Joshi' },
  { id: 'onb7', employeeId: 'e8', task: 'First PR review and merge', category: 'training', completed: false, dueDate: '2026-04-15', assignedBy: 'Nikhil Das' },
  { id: 'onb8', employeeId: 'e8', task: 'Probation goals document sign-off', category: 'documentation', completed: false, dueDate: '2026-04-20', assignedBy: 'Ritika Gupta' },
  { id: 'onb9', employeeId: 'e8', task: '30-day buddy check-in', category: 'hr', completed: false, dueDate: '2026-05-01', assignedBy: 'Ritika Gupta' },
  { id: 'onb10', employeeId: 'e8', task: 'Security and compliance training', category: 'training', completed: true, dueDate: '2026-04-05', assignedBy: 'IT Admin' },
];

// ---- Documents ----
export const mockDocuments: Document[] = [
  { id: 'doc1', employeeId: 'e1', type: 'offer-letter', title: 'Offer Letter — Deepika Nair', fileUrl: '#', uploadedAt: '2023-03-01', expiresAt: null },
  { id: 'doc2', employeeId: 'e1', type: 'nda', title: 'NDA — Deepika Nair', fileUrl: '#', uploadedAt: '2023-03-01', expiresAt: null },
  { id: 'doc3', employeeId: 'e1', type: 'id-proof', title: 'Aadhaar Card — Deepika Nair', fileUrl: '#', uploadedAt: '2023-03-01', expiresAt: null },
  { id: 'doc4', employeeId: 'e1', type: 'education', title: 'B.Tech Certificate — NIT Calicut', fileUrl: '#', uploadedAt: '2023-03-01', expiresAt: null },
  { id: 'doc5', employeeId: 'e1', type: 'appraisal', title: 'Annual Appraisal 2025 — Deepika Nair', fileUrl: '#', uploadedAt: '2026-01-15', expiresAt: null },
  { id: 'doc6', employeeId: 'e2', type: 'offer-letter', title: 'Offer Letter — Vikram Joshi', fileUrl: '#', uploadedAt: '2023-05-20', expiresAt: null },
  { id: 'doc7', employeeId: 'e2', type: 'experience', title: 'Experience Letter — TCS', fileUrl: '#', uploadedAt: '2023-05-20', expiresAt: null },
  { id: 'doc8', employeeId: 'e2', type: 'tax', title: 'Form 16 — FY 2024-25', fileUrl: '#', uploadedAt: '2025-06-01', expiresAt: null },
  { id: 'doc9', employeeId: 'e8', type: 'offer-letter', title: 'Offer Letter — Pooja Iyer', fileUrl: '#', uploadedAt: '2024-03-25', expiresAt: null },
  { id: 'doc10', employeeId: 'e8', type: 'bank-details', title: 'Bank Account Details — Pooja Iyer', fileUrl: '#', uploadedAt: '2024-03-25', expiresAt: null },
  { id: 'doc11', employeeId: 'e5', type: 'offer-letter', title: 'Offer Letter — Nikhil Das', fileUrl: '#', uploadedAt: '2021-07-01', expiresAt: null },
  { id: 'doc12', employeeId: 'e5', type: 'education', title: 'M.Tech Certificate — IIT Bombay', fileUrl: '#', uploadedAt: '2021-07-01', expiresAt: null },
];

// ---- Shifts ----
export const mockShifts: Shift[] = [
  { id: 'sh1', name: 'Morning Shift', department: 'Engineering', startTime: '08:00', endTime: '17:00', rotation: 'fixed', nightAllowance: false, supportTeams: ['L2 Support', 'DevOps On-Call'] },
  { id: 'sh2', name: 'General Shift', department: 'All', startTime: '09:00', endTime: '18:00', rotation: 'fixed', nightAllowance: false, supportTeams: ['IT Helpdesk', 'HR'] },
  { id: 'sh3', name: 'Evening Shift', department: 'Engineering', startTime: '14:00', endTime: '23:00', rotation: 'rotating', nightAllowance: true, supportTeams: ['L2 Support', 'QA On-Call'] },
  { id: 'sh4', name: 'Night Shift', department: 'Engineering', startTime: '22:00', endTime: '07:00', rotation: 'rotating', nightAllowance: true, supportTeams: ['L1 Support', 'DevOps On-Call'] },
  { id: 'sh5', name: 'Flexible Hours', department: 'Design', startTime: '09:00', endTime: '18:00', rotation: 'flexible', nightAllowance: false, supportTeams: [] },
  { id: 'sh6', name: 'Support Shift A', department: 'QA', startTime: '06:00', endTime: '15:00', rotation: 'rotating', nightAllowance: false, supportTeams: ['L1 Support'] },
  { id: 'sh7', name: 'Support Shift B', department: 'QA', startTime: '15:00', endTime: '00:00', rotation: 'rotating', nightAllowance: true, supportTeams: ['L2 Support'] },
  { id: 'sh8', name: 'Sales Shift', department: 'Sales', startTime: '10:00', endTime: '19:00', rotation: 'fixed', nightAllowance: false, supportTeams: [] },
];

// ---- Workload ----
export const mockWorkload: WorkloadItem[] = [
  { id: 'w1', employeeId: 'e1', allocation: 85, capacity: 100, projects: ['NexaBank Digital Transformation', 'TravelWise Booking Engine'], overtime: 2, status: 'optimal' },
  { id: 'w2', employeeId: 'e2', allocation: 95, capacity: 100, projects: ['ShopVerse E-Commerce Platform', 'RetailPro POS System'], overtime: 8, status: 'overloaded' },
  { id: 'w3', employeeId: 'e3', allocation: 90, capacity: 100, projects: ['MediCare Patient Portal', 'FinEdge Trading Platform'], overtime: 4, status: 'optimal' },
  { id: 'w4', employeeId: 'e4', allocation: 75, capacity: 100, projects: ['AutoFlow Fleet Management', 'GreenEnergy IoT Dashboard'], overtime: 0, status: 'optimal' },
  { id: 'w5', employeeId: 'e5', allocation: 100, capacity: 100, projects: ['FinEdge Trading Platform', 'NexaBank Digital Transformation'], overtime: 15, status: 'at-capacity' },
  { id: 'w6', employeeId: 'e6', allocation: 70, capacity: 100, projects: ['CloudSync SaaS Monthly Retainer', 'AgroTech Farm Analytics'], overtime: 0, status: 'under-utilized' },
  { id: 'w7', employeeId: 'e7', allocation: 80, capacity: 100, projects: ['NexaBank Digital Transformation', 'FinEdge Trading Platform'], overtime: 1, status: 'optimal' },
  { id: 'w8', employeeId: 'e8', allocation: 65, capacity: 100, projects: ['ShopVerse E-Commerce Platform'], overtime: 0, status: 'under-utilized' },
  { id: 'w9', employeeId: 'e9', allocation: 90, capacity: 100, projects: ['MediCare Patient Portal', 'AutoFlow Fleet Management'], overtime: 5, status: 'optimal' },
  { id: 'w10', employeeId: 'e10', allocation: 60, capacity: 100, projects: [], overtime: 0, status: 'under-utilized' },
  { id: 'w11', employeeId: 'e11', allocation: 40, capacity: 100, projects: [], overtime: 0, status: 'under-utilized' },
  { id: 'w12', employeeId: 'e12', allocation: 55, capacity: 100, projects: [], overtime: 0, status: 'under-utilized' },
];

// ---- Dashboard Summary Stats ----
export const erpDashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  atRiskProjects: 3,
  completedProjects: 2,
  totalEmployees: 12,
  onLeaveToday: 2,
  pendingApprovals: 6,
  overdueInvoices: 2,
  monthlyRevenue: 5750000,
  monthlyExpenses: 3875000,
  averageProfitability: 14.2,
  openTasks: 42,
  blockedTasks: 2,
  clientSlaAverage: 91.3,
  totalVendors: 11,
  activeVendors: 8,
  totalAssets: 10,
  activeAssets: 7,
  unreadMessages: 27,
  pendingOnboardingTasks: 4,
  payrollPending: 2,
};
