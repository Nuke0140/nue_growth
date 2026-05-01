// ============================================
// Marketing Module Types — Growth Engine v2
// ============================================
// 5 Sections: Dashboard, Campaigns, Audience, Analytics, Operations
// Core Flow: Campaign → Audience → Execution → Results → Revenue

// ---- Navigation / Pages ----
export type MarketingPage =
  | 'dashboard'
  | 'campaigns'
  | 'campaign-builder'
  | 'audience'
  | 'analytics'
  | 'operations';

// ---- Campaign Types ----
export type CampaignType =
  | 'lead-gen'
  | 'nurturing'
  | 'retention'
  | 'sales-push'
  | 'brand-awareness'
  | 'reactivation'
  | 'event'
  | 'product-launch';

export type CampaignStatus =
  | 'active'
  | 'paused'
  | 'draft'
  | 'scheduled'
  | 'completed'
  | 'archived';

export type MarketingChannel =
  | 'email'
  | 'whatsapp'
  | 'sms'
  | 'social'
  | 'ads'
  | 'landing-page'
  | 'push';

// ---- Core Campaign ----
export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  channels: MarketingChannel[];
  status: CampaignStatus;
  budget: number;
  spend: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  roi: number;
  owner: string;
  startDate: string;
  endDate: string;
  description: string;
  objective?: CampaignObjective;
  audience?: CampaignAudience;
  channelConfig?: CampaignChannelConfig[];
  offer?: CampaignOffer;
  automations?: CampaignAutomation[];
  schedule?: CampaignSchedule;
  aiOptimizations?: AIOptimizationSuggestion[];
  leadCapture?: LeadCaptureConfig;
  createdAt: string;
  updatedAt: string;
}

// ---- Campaign Builder Steps ----
export type CampaignBuilderStep =
  | 'objective'
  | 'audience'
  | 'channels'
  | 'content'
  | 'offer'
  | 'automation'
  | 'schedule'
  | 'ai-optimization';

// Step 1: Objective
export interface CampaignObjective {
  primaryGoal: 'leads' | 'conversions' | 'awareness' | 'retention' | 'revenue';
  targetMetric: number;
  targetMetricUnit: string;
  secondaryGoals: string[];
}

// Step 2: Audience
export interface CampaignAudience {
  segmentId: string;
  segmentName: string;
  estimatedReach: number;
  excludeSegmentIds: string[];
}

// Step 3: Channel Config (per channel)
export interface CampaignChannelConfig {
  channel: MarketingChannel;
  enabled: boolean;
  content: ChannelContent;
}

export interface ChannelContent {
  subject?: string;        // email
  previewText?: string;    // email
  bodyHtml?: string;       // email / landing-page
  bodyText?: string;       // sms / whatsapp
  templateId?: string;     // whatsapp
  mediaType?: 'text' | 'image' | 'video' | 'document' | 'carousel';
  mediaUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  quickReplies?: string[];
  caption?: string;        // social
  hashtags?: string[];
  platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
  postType?: 'post' | 'story' | 'reel' | 'carousel';
  headline?: string;       // landing-page
  aiGenerated?: boolean;
  aiSuggestion?: string;
}

// Step 4: Content (wraps per-channel)
export interface CampaignContent {
  channelContents: CampaignChannelConfig[];
}

// Step 5: Offer
export interface CampaignOffer {
  type: 'discount' | 'coupon' | 'free-trial' | 'bundle' | 'cashback' | 'free-shipping';
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
  couponCode?: string;
  expiryDate?: string;
  usageLimit?: number;
  perUserLimit?: number;
  segmentRestriction?: string[];
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  autoApply?: boolean;
}

// Step 6: Automation
export type AutomationTrigger =
  | 'campaign-sent'
  | 'link-clicked'
  | 'form-submitted'
  | 'purchase-completed'
  | 'cart-abandoned'
  | 'email-opened'
  | 'whatsapp-replied'
  | 'sms-delivered'
  | 'lead-score-threshold'
  | 'custom-event';

export type AutomationAction =
  | 'send-email'
  | 'send-whatsapp'
  | 'send-sms'
  | 'add-tag'
  | 'remove-tag'
  | 'move-lifecycle'
  | 'assign-to-sdr'
  | 'create-task'
  | 'notify-team'
  | 'webhook'
  | 'add-to-segment'
  | 'remove-from-segment'
  | 'wait'
  | 'if-else';

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'in';
  value: string;
}

export interface CampaignAutomation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: {
    type: AutomationAction;
    config: Record<string, unknown>;
    delay?: number; // in minutes
  }[];
}

// Step 7: Budget & Schedule
export interface CampaignSchedule {
  startDate: string;
  endDate: string;
  timezone: string;
  sendTime: string;
  recurringType?: 'once' | 'daily' | 'weekly' | 'monthly';
  recurringDays?: number[];
  budgetPacing?: 'even' | 'accelerated' | 'front-loaded';
  dailyBudgetCap?: number;
}

// Step 8: AI Optimization
export interface AIOptimizationSuggestion {
  id: string;
  type: 'timing' | 'audience' | 'content' | 'budget' | 'channel' | 'offer';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  potentialImprovement: number;
  applied: boolean;
}

// ---- Lead Capture ----
export interface LeadCaptureConfig {
  enabled: boolean;
  formFields: LeadFormField[];
  webhookUrl?: string;
  crmIntegration?: 'hubspot' | 'salesforce' | 'zoho' | 'pipedrive' | 'none';
  autoTag?: string[];
  assignToSdr?: boolean;
  welcomeAutomation?: string;
}

export interface LeadFormField {
  name: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'hidden';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface CapturedLead {
  id: string;
  campaignId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  capturedAt: string;
  tags: string[];
}

// ---- Audience System ----
export interface AudienceSegment {
  id: string;
  name: string;
  rules: SegmentRule[];
  operator: 'AND' | 'OR';
  audienceCount: number;
  growth: number;
  syncedCampaigns: string[];
  createdDate: string;
  type?: 'static' | 'dynamic';
  lastSynced?: string;
  tags?: string[];
}

export interface SegmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// ---- Retention ----
export interface RetentionMetrics {
  churnRate: number;
  repeatPurchaseRate: number;
  inactiveUsers: number;
  renewalAlerts: number;
  avgLifetimeValue: number;
  cohortData: CohortData[];
}

export interface CohortData {
  month: string;
  rate: number;
}

// ---- Loyalty ----
export interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  couponsRedeemed: number;
  totalSpent: number;
  joinDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  type: string;
  expiry: string;
  status: 'active' | 'expired' | 'redeemed';
  usageCount: number;
  maxUsage: number;
}

export interface ReferralEntry {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  conversions: number;
  earnings: number;
  rank: number;
}

// ---- Analytics / Attribution ----
export interface AttributionChannel {
  channel: string;
  revenue: number;
  contribution: number;
  conversions: number;
  color: string;
}

export interface FunnelStep {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  dropOff: number;
  revenue: number;
}

export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  totalRevenue: number;
  conversionRate: number;
}

export interface ABVariant {
  id: string;
  name: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  isWinner: boolean;
}

export interface ABTest {
  id: string;
  name: string;
  type: 'cta' | 'subject-line' | 'landing-page' | 'creative' | 'email';
  status: 'running' | 'completed' | 'draft';
  variants: ABVariant[];
  winner: string | null;
  startDate: string;
  endDate: string;
  confidence: number;
  improvement: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'linkedin' | 'youtube' | 'tiktok';
  status: 'active' | 'paused' | 'completed' | 'draft';
  spend: number;
  clicks: number;
  impressions: number;
  cpc: number;
  cpl: number;
  roas: number;
  conversions: number;
  creative: string;
}

// ---- Operations ----
export type ContentRequestStatus =
  | 'requested'
  | 'in-progress'
  | 'in-review'
  | 'approved'
  | 'published'
  | 'revision'
  | 'draft';

// ---- Legacy (kept for component compatibility) ----
export type ApprovalStage =
  | 'draft'
  | 'in-review'
  | 'manager-review'
  | 'client-review'
  | 'approved'
  | 'published'
  | 'revision';

export interface ContentComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface ContentRequest {
  id: string;
  title: string;
  type: 'social-post' | 'email' | 'landing-page' | 'ad-creative' | 'video' | 'blog' | 'whatsapp-template';
  status: ContentRequestStatus;
  requester: string;
  assignee: string;
  campaignId?: string;
  campaignName?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  comments: ContentComment[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceRequestType =
  | 'design'
  | 'copywriting'
  | 'video-production'
  | 'photography'
  | 'translation'
  | 'branding';

export interface ServiceRequest {
  id: string;
  title: string;
  type: ServiceRequestType;
  status: 'requested' | 'accepted' | 'in-progress' | 'delivered' | 'completed';
  requester: string;
  vendor: string;
  campaignId?: string;
  budget: number;
  dueDate: string;
  description: string;
  deliverables: string[];
  createdAt: string;
}

export interface PostPublishMetrics {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  publishedAt: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  revenue: number;
  engagement: number;
}

// ---- AI Growth Intelligence ----
export interface AIGrowthInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  potentialROI: number;
  applied?: boolean;
}

// ---- Dashboard ----
export interface MarketingDashboardStats {
  totalLeads: number;
  mqls: number;
  sqls: number;
  campaignROI: number;
  cpl: number;
  cac: number;
  roas: number;
  retentionRate: number;
  referralGrowth: number;
  channelContribution: { channel: string; percent: number }[];
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueTarget: number;
  activeCampaignsCount: number;
  leadsTrend: { date: string; count: number }[];
  revenueTrend: { date: string; amount: number }[];
}

// ---- Channel-specific (legacy compatibility) ----
export interface EmailCampaign {
  id: string;
  name: string;
  subjectLine: string;
  previewText: string;
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  listSize: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  spamScore: number;
  sentDate: string;
  fromName: string;
  replyTo: string;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  template: string;
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  mediaType: 'text' | 'image' | 'video' | 'document';
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  ctaText: string;
  quickReplies: string[];
  sentDate: string;
}

export interface SMSCampaign {
  id: string;
  name: string;
  type: 'otp' | 'promotional' | 'transactional';
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
  templatePreview: string;
  sent: number;
  delivered: number;
  failed: number;
  ctr: number;
  sentDate: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
  caption: string;
  mediaType: 'image' | 'video' | 'carousel' | 'story' | 'reel';
  scheduledDate: string;
  scheduledTime: string;
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  hashtags: string[];
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
}

export interface ExclusionList {
  id: string;
  name: string;
  count: number;
  lastUpdated: string;
}

// ---- Workflow (kept for compatibility) ----
export interface WorkflowNode {
  id: string;
  type: string;
  title: string;
  description: string;
  x: number;
  y: number;
}

export interface Workflow {
  id: string;
  name: string;
  status: string;
  nodes: WorkflowNode[];
  triggers: number;
  conversions: number;
  lastRun: string;
  createdAt: string;
}
