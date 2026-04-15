// ============================================
// Retention & Growth Module Types
// ============================================

export type RetentionPage =
  | 'retention-dashboard'
  | 'customer-health'
  | 'churn-risk'
  | 'renewal-center'
  | 'winback-campaigns'
  | 'upsell-crosssell'
  | 'loyalty-program'
  | 'referral-growth'
  | 'feedback-nps'
  | 'customer-journey'
  | 'cohort-analysis'
  | 'ltv-forecast'
  | 'customer-success'
  | 'advocacy'
  | 'ai-growth-coach';

// ---- Dashboard Stats ----
export interface RetentionDashboardStats {
  activeCustomers: number;
  churnRate: number;
  renewalRate: number;
  repeatPurchaseRate: number;
  avgLTV: number;
  nps: number;
  referralGrowth: number;
  expansionRevenue: number;
  avgHealthScore: number;
  atRiskAccounts: number;
}

// ---- Customer Health ----
export interface CustomerHealth {
  id: string;
  client: string;
  industry: string;
  healthScore: number;
  usage: number;
  engagement: number;
  paymentBehavior: number;
  supportSentiment: number;
  nps: number;
  responseRate: number;
  activityFrequency: number;
  repeatPurchases: number;
  trend: 'up' | 'down' | 'stable';
  riskTag: 'safe' | 'medium' | 'high';
  accountManager: string;
  lastActiveDate: string;
  nextBestAction: string;
  value: number;
}

// ---- Churn Risk ----
export interface ChurnRisk {
  id: string;
  client: string;
  industry: string;
  riskLevel: 'high' | 'medium' | 'safe';
  riskScore: number;
  inactivityDays: number;
  delayedPayments: number;
  engagementDrop: number;
  negativeFeedback: number;
  supportEscalations: number;
  lastPurchase: string;
  contractValue: number;
  accountManager: string;
  predictedChurnDate: string;
  recommendedAction: string;
}

// ---- Renewals ----
export interface Renewal {
  id: string;
  client: string;
  renewalDate: string;
  contractValue: number;
  renewalProbability: number;
  accountManager: string;
  lastTouchpoint: string;
  nextStep: string;
  status: 'on-track' | 'at-risk' | 'overdue' | 'lost';
  negotiationNotes?: string;
  discountApproved?: number;
  quoteGenerated: boolean;
  contractPeriod: string;
  industry: string;
}

// ---- Win-back Campaigns ----
export interface WinbackCampaign {
  id: string;
  name: string;
  segment: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'multi';
  status: 'active' | 'completed' | 'draft' | 'paused';
  inactivityDays: string;
  offerType: string;
  offerValue: number;
  sentCount: number;
  reactivated: number;
  successRate: number;
  bestSendTime: string;
  launchedDate: string;
}

// ---- Upsell & Cross-sell ----
export interface UpsellOpportunity {
  id: string;
  client: string;
  currentServices: string[];
  recommendedService: string;
  fitScore: number;
  expansionValue: number;
  probability: number;
  accountGrowthScore: number;
  lastPurchase: string;
  accountManager: string;
  industry: string;
  status: 'new' | 'approached' | 'in-progress' | 'closed-won' | 'closed-lost';
}

// ---- Loyalty ----
export interface LoyaltyMember {
  id: string;
  client: string;
  tier: 'silver' | 'gold' | 'platinum';
  points: number;
  totalSpent: number;
  repeatPurchases: number;
  referrals: number;
  joinedDate: string;
  lastPurchaseDate: string;
  nextMilestone: string;
  milestoneProgress: number;
  couponsUsed: number;
  rewardsRedeemed: number;
}

export interface LoyaltyTier {
  tier: 'silver' | 'gold' | 'platinum';
  minSpent: number;
  minPurchases: number;
  benefits: string[];
  discount: number;
  memberCount: number;
  color: string;
}

// ---- Referrals ----
export interface ReferralEntry {
  id: string;
  advocate: string;
  referralCode: string;
  totalReferrals: number;
  converted: number;
  conversionRate: number;
  commissionEarned: number;
  rewardType: string;
  rank: number;
  topReferral: string;
  fraudFlag: boolean;
}

// ---- Feedback & NPS ----
export interface NPSResponse {
  id: string;
  client: string;
  score: number;
  category: 'promoter' | 'passive' | 'detractor';
  feedback: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  industry: string;
}

export interface FeedbackEntry {
  id: string;
  client: string;
  type: 'nps' | 'csat' | 'feature-request' | 'complaint' | 'praise';
  rating: number;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'closed';
  sentiment: 'positive' | 'neutral' | 'negative';
}

// ---- Customer Journey ----
export interface JourneyStage {
  id: string;
  name: string;
  customers: number;
  conversionFrom: number;
  dropoff: number;
  avgDaysInStage: number;
}

export interface JourneyEvent {
  id: string;
  client: string;
  stage: string;
  event: string;
  date: string;
  type: 'milestone' | 'friction' | 'conversion' | 'dropoff';
}

// ---- Cohort Analysis ----
export interface CohortRow {
  cohort: string;
  customers: number;
  retention: number[];
  repeatRate: number[];
  churnRate: number[];
  revenue: number[];
}

// ---- LTV Forecast ----
export interface LTVForecast {
  id: string;
  segment: string;
  currentLTV: number;
  predictedLTV: number;
  bestCase: number;
  worstCase: number;
  confidence: number;
  avgLifespan: number;
  churnRisk: number;
  expansionPotential: number;
}

// ---- Customer Success ----
export interface SuccessMilestone {
  id: string;
  client: string;
  milestone: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  category: 'onboarding' | 'qbr' | 'value-realization' | 'health' | 'expansion';
  owner: string;
  notes?: string;
}

export interface SuccessPlan {
  id: string;
  client: string;
  accountManager: string;
  startDate: string;
  milestones: SuccessMilestone[];
  healthScore: number;
  lastQBR: string;
  nextQBR: string;
  valueDelivered: number;
  valueTarget: number;
}

// ---- Advocacy ----
export interface AdvocacyEntry {
  id: string;
  client: string;
  type: 'testimonial' | 'review' | 'case-study' | 'ambassador' | 'speaker' | 'referral-champion';
  status: 'requested' | 'submitted' | 'published' | 'declined';
  requestDate: string;
  submittedDate?: string;
  content?: string;
  impact: number;
  promoterScore: number;
  industry: string;
}

// ---- AI Growth Coach ----
export interface AIGrowthInsight {
  id: string;
  type: 'churn-prevention' | 'loyalty-offer' | 'expansion-playbook' | 'renewal-pricing' | 'promoter-activation' | 'ltv-growth' | 'cohort-insight' | 'engagement-boost';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  potentialImpact: number;
  segment?: string;
  metric?: string;
  currentValue?: number;
  thresholdValue?: number;
  actionItems: string[];
}

// ---- Alerts ----
export interface RetentionAlert {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionPage?: string;
  createdAt: string;
}
