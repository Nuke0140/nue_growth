// ============================================
// ERP Module Types
// ============================================

// ---- Navigation ----
export type ErpPage =
  // Dashboard
  | 'ops-dashboard'
  // Projects
  | 'projects'
  | 'project-detail'
  // Tasks
  | 'tasks-board'
  // HRM - Employees
  | 'employees'
  | 'employee-detail'
  // HRM - Organization
  | 'departments'
  // HRM - Time & Attendance
  | 'attendance'
  | 'leaves'
  // HRM - Compensation
  | 'payroll'
  | 'compensation'
  // HRM - Performance
  | 'performance'
  // HRM - Documents
  | 'documents'
  // Assets
  | 'assets'
  // Approvals
  | 'approvals'
  // AI Ops Intelligence
  | 'ai-ops'
  // HRM Landing Page
  | 'hrm';

// ---- Project ----
export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'cancelled' | 'inception';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectHealth = 'excellent' | 'good' | 'at-risk' | 'critical';

export interface ErpProject {
  id: string;
  name: string;
  client: string;
  accountManager: string;
  budget: number;
  actualSpend: number;
  progress: number;
  profitability: number;
  health: ProjectHealth;
  sla: number;
  dueDate: string;
  milestones: ProjectMilestone[];
  deliverables: string[];
  linkedInvoices: string[];
  status: ProjectStatus;
  priority: ProjectPriority;
  isRecurring: boolean;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

// ---- Task ----
export type TaskStage = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';

export interface ErpTask {
  id: string;
  title: string;
  projectId: string;
  stage: TaskStage;
  assignee: string;
  dueDate: string;
  storyPoints: number;
  timeLogged: number;
  isBlocked: boolean;
  dependencies: string[];
  recurringTemplate: string | null;
  slaDeadline: string | null;
  description: string;
  createdAt: string;
}

// ---- Approval ----
export type ApprovalType = 'content' | 'design' | 'invoice' | 'budget' | 'payroll' | 'leave' | 'proposal';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

export interface Approval {
  id: string;
  type: ApprovalType;
  title: string;
  requestedBy: string;
  status: ApprovalStatus;
  project: string | null;
  version: number;
  comments: ApprovalComment[];
  createdAt: string;
}

export interface ApprovalComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// ---- Invoice ----
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';

export interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  project: string;
  gst: number;
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: InvoiceStatus;
  paymentLink: string | null;
  recurring: boolean;
  createdAt: string;
}

// ---- Finance Operations ----
export interface FinanceOp {
  receivables: number;
  payables: number;
  cashFlow: number;
  budgetVariance: number;
  burnRate: number;
  vendorPayouts: number;
  monthlyProfit: number;
  projectCostCenters: ProjectCostCenter[];
}

export interface ProjectCostCenter {
  projectId: string;
  projectName: string;
  budget: number;
  spent: number;
  variance: number;
  burnRate: number;
}

// ---- Vendor ----
export type VendorStatus = 'active' | 'on-notice' | 'suspended' | 'terminated';

export interface Vendor {
  id: string;
  name: string;
  type: string;
  contractValue: number;
  payoutDue: number;
  slaScore: number;
  qualityScore: number;
  linkedProjects: string[];
  rating: number;
  complianceDocs: string[];
  status: VendorStatus;
}

// ---- Payroll ----
export type PayrollStatus = 'pending' | 'processed' | 'paid';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  incentives: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
  month: string;
  department: string;
}

// ---- Resource ----
export interface Resource {
  id: string;
  name: string;
  role: string;
  department: string;
  allocation: number;
  availability: string;
  skills: string[];
  utilization: number;
  projects: ResourceProject[];
}

export interface ResourceProject {
  projectId: string;
  projectName: string;
  allocation: number;
}

// ---- Asset ----
export type AssetStatus = 'active' | 'in-repair' | 'disposed' | 'retired';

export interface IssueLog {
  id: string;
  date: string;
  description: string;
  resolved: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  serialNo: string;
  assignedTo: string;
  warrantyEnd: string;
  status: AssetStatus;
  purchaseDate: string;
  purchaseCost: number;
  issueLogs: IssueLog[];
}

// ---- SOP ----
export type SopStatus = 'draft' | 'published' | 'archived';

export interface SOPStep {
  id: string;
  title: string;
  description: string;
  assigneeRole: string;
}

export interface SOP {
  id: string;
  title: string;
  department: string;
  steps: SOPStep[];
  version: number;
  author: string;
  status: SopStatus;
  lastUpdated: string;
}

// ---- Chat ----
export type ChatChannelType = 'direct' | 'project' | 'department' | 'announcement';

export interface ChatChannel {
  id: string;
  name: string;
  type: ChatChannelType;
  members: string[];
  lastMessage: string;
  unreadCount: number;
}

export interface ChatMessageAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: string;
  content: string;
  timestamp: string;
  isPinned: boolean;
  attachments: ChatMessageAttachment[];
}

// ---- Delivery ----
export type DeliveryStatus = 'pending' | 'in-progress' | 'review' | 'client-review' | 'approved' | 'revision' | 'delivered';

export interface DeliveryItem {
  id: string;
  projectId: string;
  deliverable: string;
  status: DeliveryStatus;
  dueDate: string;
  clientApproval: boolean;
  revisionRounds: number;
  assignedTo: string;
}

// ---- Profitability ----
export interface ProfitabilityAlert {
  id: string;
  type: 'burn-rate' | 'margin-drop' | 'over-budget' | 'invoice-delay';
  message: string;
  severity: 'warning' | 'critical';
}

export interface ProfitabilityData {
  clientId: string;
  clientName: string;
  revenue: number;
  cost: number;
  margin: number;
  burnRate: number;
  alerts: ProfitabilityAlert[];
}

// ---- AI Ops Intelligence ----
export type AiOpsSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AiOpsType = 'cost_anomaly' | 'risk_prediction' | 'optimization' | 'compliance' | 'resource_alert' | 'delivery_risk' | 'revenue_forecast' | 'vendor_risk';

export interface AiOpsInsight {
  id: string;
  type: AiOpsType;
  title: string;
  severity: AiOpsSeverity;
  description: string;
  recommendation: string;
  affectedEntities: string[];
  confidence: number;
}

// ---- Employee ----
export type EmployeeStatus = 'active' | 'on-leave' | 'notice-period' | 'inactive' | 'probation';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  manager: string;
  salaryBand: string;
  joinDate: string;
  status: EmployeeStatus;
  activeProjects: number;
  productivityScore: number;
  avatar: string;
}

// ---- Attendance ----
export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'wfh' | 'on-leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  overtime: number;
  status: AttendanceStatus;
  isAnomaly: boolean;
}

// ---- Leave ----
export type LeaveType = 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'comp-off' | 'loss-of-pay';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  approver: string;
}

// ---- Performance ----
export type PromotionReadiness = 'not-ready' | 'developing' | 'ready' | 'overdue';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  kpiScore: number;
  slaScore: number;
  taskCompletion: number;
  clientFeedback: number;
  promotionReadiness: PromotionReadiness;
}

// ---- Incentive ----
export type IncentiveType = 'performance' | 'referral' | 'project-bonus' | 'spot-award' | 'retention';
export type IncentiveStatus = 'pending' | 'approved' | 'disbursed';

export interface Incentive {
  id: string;
  employeeId: string;
  type: IncentiveType;
  amount: number;
  month: string;
  description: string;
  status: IncentiveStatus;
}

// ---- Onboarding ----
export type OnboardingCategory = 'hr' | 'it' | 'department' | 'training' | 'documentation';

export interface OnboardingTask {
  id: string;
  employeeId: string;
  task: string;
  category: OnboardingCategory;
  completed: boolean;
  dueDate: string;
  assignedBy: string;
}

// ---- Document ----
export type DocumentType = 'offer-letter' | 'nda' | 'id-proof' | 'education' | 'experience' | 'appraisal' | 'tax' | 'bank-details';

export interface Document {
  id: string;
  employeeId: string;
  type: DocumentType;
  title: string;
  fileUrl: string;
  uploadedAt: string;
  expiresAt: string | null;
}

// ---- Shift ----
export type ShiftRotation = 'fixed' | 'rotating' | 'flexible';

export interface Shift {
  id: string;
  name: string;
  department: string;
  startTime: string;
  endTime: string;
  rotation: ShiftRotation;
  nightAllowance: boolean;
  supportTeams: string[];
}

// ---- Workload ----
export type WorkloadStatus = 'optimal' | 'under-utilized' | 'overloaded' | 'at-capacity';

export interface WorkloadItem {
  id: string;
  employeeId: string;
  allocation: number;
  capacity: number;
  projects: string[];
  overtime: number;
  status: WorkloadStatus;
}

// ---- Notifications ----
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

// ---- Timeline ----
export interface TimelineItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  accentColor?: string;
}

// ---- Tag ----
export interface Tag {
  id: string;
  label: string;
  color: string;
}

// ---- Subtask ----
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// ---- Activity Tracking ----
export type ActivityEventType =
  | 'task_created' | 'task_updated' | 'task_completed' | 'task_blocked'
  | 'project_created' | 'project_updated' | 'project_completed'
  | 'employee_created' | 'employee_updated' | 'employee_status_changed'
  | 'leave_applied' | 'leave_approved' | 'leave_rejected'
  | 'approval_requested' | 'approval_approved' | 'approval_rejected'
  | 'payroll_processed' | 'payroll_paid'
  | 'asset_assigned' | 'asset_reported'
  | 'comment_added'
  | 'ai_insight_generated';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  actor: string; // who did it
  entityType: 'task' | 'project' | 'employee' | 'leave' | 'approval' | 'payroll' | 'asset' | 'ai';
  entityId: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

// ---- Permissions ----
export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export interface Permission {
  page: ErpPage;
  actions: PermissionAction[];
}
