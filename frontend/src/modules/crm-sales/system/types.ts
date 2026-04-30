// ============================================
// CRM & Sales Unified Module Types
// ============================================

// --- People ---
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  companyId?: string;
  title?: string;
  source: ContactSource;
  lifecycleStage: LifecycleStage;
  owner: string;
  ownerId: string;
  healthScore: number;
  aiIntent: AiIntent;
  tags: string[];
  socialProfiles?: { platform: string; url: string }[];
  lastInteraction: string;
  createdAt: string;
  notes?: string;
  address?: { city: string; state: string; country: string };
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  employeeCount: string;
  arr: number;
  linkedContacts: number;
  activeDeals: number;
  healthScore: number;
  owner: string;
  ownerId: string;
  notes?: string;
  createdAt: string;
}

// --- Unified Lead (merges CRM Lead + Sales SalesLead) ---
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  source: LeadSourceType;
  campaign?: string;
  score: number;
  intent: LeadIntent;
  status: LeadStatus;
  expectedRevenue: number;
  assignedRep: string;
  assignedRepId: string;
  nextAction?: string;
  nextActionDate?: string;
  slaDeadline?: string;
  isDuplicate?: boolean;
  isHighValue: boolean;
  createdDate?: string;
  createdAt?: string;
  lastActivity?: string;
  notes?: string;
}

// --- Unified Deal (merges CRM Deal + Sales SalesDeal) ---
export interface Deal {
  id: string;
  name: string;
  company: string;
  companyId: string;
  contactId: string;
  contactName: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedClose: string;
  owner: string;
  ownerId: string;
  createdAt: string;
  createdDate?: string;
  weightedValue: number;
  aging?: number;
  daysInStage?: number;
  contractType?: 'monthly' | 'annual' | 'one-time';
  renewalChance?: number;
  nextMeeting?: string;
  competitors?: string[];
  discountPercent?: number;
}

// --- Sales Ops ---
export interface SalesForecast {
  id: string;
  repName: string;
  repId: string;
  pipelineValue: number;
  weightedForecast: number;
  bestCase: number;
  worstCase: number;
  committed: number;
  month: string;
}

export interface TeamPerformance {
  id: string;
  repName: string;
  repId: string;
  avatar?: string;
  dealsWon: number;
  revenueClosed: number;
  followUpSla: number;
  avgResponseTime: string;
  closeRate: number;
  aiProductivityScore: number;
  rank: number;
  targetProgress: number;
  targetAmount: number;
}

export interface FollowUp {
  id: string;
  leadName: string;
  leadId: string;
  company?: string;
  type: FollowUpType;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  assignedTo: string;
  assignedToId: string;
  scheduledDate: string;
  scheduledTime?: string;
  isOverdue: boolean;
  isRecurring: boolean;
  recurringPattern?: string;
  aiSuggestion?: string;
  notes?: string;
  createdDate: string;
}

export interface Proposal {
  id: string;
  title: string;
  dealName: string;
  dealId: string;
  contactName: string;
  contactId: string;
  company: string;
  status: ProposalStatus;
  version: number;
  totalValue: number;
  currency: string;
  template?: string;
  viewedByClient: boolean;
  lastViewedAt?: string;
  pagesRead: number;
  totalPages: number;
  approvalState?: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  paymentStatus?: 'pending' | 'partial' | 'paid';
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

// --- Lead Sources (Sales interface, distinct from the enum) ---
export interface LeadSourceEntry {
  id: string;
  name: string;
  type: SourceType;
  leadCount: number;
  conversionRate: number;
  revenue: number;
  trend: number;
  webhookStatus: 'active' | 'error' | 'inactive';
  lastLeadAt?: string;
}

// --- Qualification ---
export interface QualificationData {
  leadId: string;
  leadName: string;
  budget: QualificationScore;
  authority: QualificationScore;
  need: QualificationScore;
  timeline: QualificationScore;
  overallScore: number;
  confidence: number;
  painPoints: string[];
  decisionMaker: boolean;
  urgency: number;
  productFit: number;
  aiPurchaseIntent: number;
}

export interface QualificationScore {
  score: number;
  maxScore: number;
  notes?: string;
}

// --- Win/Loss ---
export interface WinLossData {
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  avgSalesCycle: number;
  avgDiscount: number;
  totalWonRevenue: number;
  totalLostRevenue: number;
  competitorLosses: { competitor: string; count: number; revenue: number }[];
  lossReasons: { reason: string; count: number; percentage: number }[];
  stageDropoffs: { stage: string; entered: number; exited: number; dropRate: number }[];
  monthlyWinLoss: { month: string; won: number; lost: number }[];
}

export interface RevenueMetric {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
}

// --- Management ---
export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  contactName?: string;
  contactId?: string;
  companyName?: string;
  userName: string;
  userId: string;
  date: string;
  duration?: string;
  outcome?: string;
}

export interface CrmTask {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeId: string;
  contactName?: string;
  contactId?: string;
  dealName?: string;
  dealId?: string;
  dueDate: string;
  isOverdue: boolean;
  isRecurring: boolean;
  recurringPattern?: string;
  createdAt: string;
}

export interface CrmNote {
  id: string;
  title: string;
  content: string;
  contactName?: string;
  contactId?: string;
  author: string;
  authorId: string;
  isPrivate: boolean;
  isPinned: boolean;
  type: NoteType;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Segment {
  id: string;
  name: string;
  type: SegmentType;
  description: string;
  rules: SegmentRule[];
  customerCount: number;
  growthTrend: number;
  lastSynced?: string;
  isSyncedToCampaign: boolean;
  createdAt: string;
}

export interface LifecycleStageData {
  stage: LifecycleStage;
  count: number;
  conversionRate: number;
  dropOffRate: number;
  avgDaysInStage: number;
  aiInsight?: string;
}

export interface AiInsight {
  id: string;
  type: 'buying_intent' | 'churn_prediction' | 'ltv_forecast' | 'upsell' | 'next_action' | 'response_probability' | 'health' | 'relationship';
  title: string;
  description: string;
  score?: number;
  confidence: number;
  contactName?: string;
  contactId?: string;
  actionText?: string;
  icon?: string;
}

// ============================================
// Enums (unified — broader values from both modules)
// ============================================

export type ContactSource = 'website' | 'referral' | 'linkedin' | 'cold_call' | 'event' | 'ad_campaign' | 'organic' | 'import';
export type LeadSourceType = 'website' | 'meta_ads' | 'google_ads' | 'whatsapp' | 'qr' | 'csv_import' | 'manual' | 'referral' | 'linkedin' | 'event' | 'cold_call';
export type LifecycleStage = 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer' | 'retained' | 'advocate';
export type AiIntent = 'high' | 'medium' | 'low' | 'inactive';
export type LeadIntent = 'hot' | 'warm' | 'cold' | 'stale'; // includes 'stale' from Sales
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type DealStage = 'new' | 'qualified' | 'discovery' | 'demo' | 'proposal' | 'negotiation' | 'won' | 'lost'; // includes 'discovery' from Sales
export type ActivityType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'demo' | 'proposal' | 'note' | 'file_share' | 'website_visit' | 'payment';
export type TaskType = 'call' | 'email' | 'follow_up' | 'meeting' | 'demo' | 'proposal' | 'custom';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoteType = 'meeting' | 'general' | 'call_log' | 'proposal' | 'voice_transcript';
export type SegmentType = 'vip' | 'high_intent' | 'new_leads' | 'repeat_buyers' | 'churn_risk' | 'inactive' | 'custom';
export type FollowUpType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'demo' | 'proposal' | 'custom';
export type FollowUpStatus = 'pending' | 'completed' | 'missed' | 'snoozed';
export type FollowUpPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'negotiation' | 'accepted' | 'rejected' | 'expired';
export type SourceType = 'website' | 'meta_ads' | 'google_ads' | 'whatsapp' | 'qr' | 'csv_import' | 'manual';

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty' | 'in_last' | 'before' | 'after';
  value: string | number;
  logic: 'and' | 'or';
}

// ============================================
// Page Types
// ============================================

export type CrmSalesPage =
  // CRM pages
  | 'contacts'
  | 'contact-detail'
  | 'companies'
  | 'company-detail'
  | 'leads'
  | 'lead-detail'
  | 'deals'
  | 'deal-detail'
  | 'activities'
  | 'tasks'
  | 'notes'
  | 'segments'
  | 'lifecycle'
  | 'contact-intelligence'
  // Sales pages
  | 'lead-capture'
  | 'qualification'
  | 'deals-pipeline'
  | 'sales-forecast'
  | 'revenue'
  | 'team-performance'
  | 'followups'
  | 'proposals'
  | 'win-loss';

// Backward-compatible aliases
export type CrmPage = CrmSalesPage;
export type SalesPage = CrmSalesPage;
// Alias for files that reference SalesDeal (now unified into Deal)
export type SalesDeal = Deal;
export type SalesLead = Lead;
