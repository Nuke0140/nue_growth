// ============================================
// Marketing Module Types
// ============================================

export interface AudienceSegment {
  id: string;
  name: string;
  rules: SegmentRule[];
  operator: 'AND' | 'OR';
  audienceCount: number;
  growth: number;
  syncedCampaigns: string[];
  createdDate: string;
}

export interface SegmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

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

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  sampleText: string;
}

export interface WhatsAppReply {
  id: string;
  contactName: string;
  message: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  campaignId: string;
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

export interface SMSTemplate {
  id: string;
  name: string;
  text: string;
  characterCount: number;
  type: 'otp' | 'promotional' | 'transactional';
}

export interface SMSLinkTracking {
  url: string;
  clicks: number;
  ctr: number;
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

export interface AIContentIdea {
  id: string;
  topic: string;
  suggestedPlatform: string;
  bestTime: string;
  description: string;
}

export interface ExclusionList {
  id: string;
  name: string;
  count: number;
  lastUpdated: string;
}

export type MarketingPage =
  | 'audience-segments'
  | 'email-builder'
  | 'whatsapp-campaigns'
  | 'sms-campaigns'
  | 'social-calendar';

// ============================================
// Extended Marketing Types
// ============================================

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

export interface CohortData {
  month: string;
  rate: number;
}

export interface RetentionMetrics {
  churnRate: number;
  repeatPurchaseRate: number;
  inactiveUsers: number;
  renewalAlerts: number;
  avgLifetimeValue: number;
  cohortData: CohortData[];
}

// ============================================
// Campaign & Workflow Types
// ============================================

export interface Campaign {
  id: string;
  name: string;
  type: string;
  channels: string[];
  budget: number;
  spend: number;
  clicks: number;
  leads: number;
  conversions: number;
  roi: number;
  status: string;
  owner: string;
  startDate: string;
  endDate: string;
  description: string;
}

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

// ============================================
// Loyalty & Referral Types
// ============================================

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

// ============================================
// Content Approval Types
// ============================================

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

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  stage: ApprovalStage;
  author: string;
  reviewer: string;
  version: number;
  comments: ContentComment[];
  createdAt: string;
  preview: string;
}

// ============================================
// AI Growth Intelligence Types
// ============================================

export interface AIGrowthInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  potentialROI: number;
}

// ============================================
// Dashboard Stats Type
// ============================================

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
}
