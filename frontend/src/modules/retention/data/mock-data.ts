// ============================================
// Retention & Growth Mock Data — Enterprise-Grade
// ============================================
import type {
  RetentionDashboardStats, CustomerHealth, ChurnRisk, Renewal,
  WinbackCampaign, UpsellOpportunity, LoyaltyMember, LoyaltyTier,
  ReferralEntry, NPSResponse, FeedbackEntry, JourneyStage, JourneyEvent,
  CohortRow, LTVForecast, SuccessPlan, AdvocacyEntry, AIGrowthInsight,
  RetentionAlert,
} from '../types';

// ---- 1. Dashboard Stats ----
export const retentionDashboardStats: RetentionDashboardStats = {
  activeCustomers: 248,
  churnRate: 6.8,
  renewalRate: 91.2,
  repeatPurchaseRate: 72.4,
  avgLTV: 485000,
  nps: 68,
  referralGrowth: 34.2,
  expansionRevenue: 12400000,
  avgHealthScore: 78,
  atRiskAccounts: 18,
};

// ---- 2. Customer Health ----
export const customerHealthData: CustomerHealth[] = [
  { id: 'ch-01', client: 'Razorpay', industry: 'Fintech', healthScore: 94, usage: 92, engagement: 96, paymentBehavior: 98, supportSentiment: 90, nps: 85, responseRate: 94, activityFrequency: 88, repeatPurchases: 12, trend: 'up', riskTag: 'safe', accountManager: 'Priya Sharma', lastActiveDate: '2026-04-10', nextBestAction: 'Pitch SEO add-on — 85% fit score', value: 8200000 },
  { id: 'ch-02', client: 'Zerodha', industry: 'Fintech', healthScore: 91, usage: 88, engagement: 90, paymentBehavior: 95, supportSentiment: 92, nps: 82, responseRate: 88, activityFrequency: 85, repeatPurchases: 8, trend: 'up', riskTag: 'safe', accountManager: 'Meera Patel', lastActiveDate: '2026-04-09', nextBestAction: 'Schedule Q2 QBR', value: 5800000 },
  { id: 'ch-03', client: 'Groww', industry: 'Fintech', healthScore: 88, usage: 82, engagement: 90, paymentBehavior: 92, supportSentiment: 85, nps: 78, responseRate: 82, activityFrequency: 80, repeatPurchases: 6, trend: 'up', riskTag: 'safe', accountManager: 'Deepika Nair', lastActiveDate: '2026-04-08', nextBestAction: 'Send loyalty reward — Gold tier upgrade', value: 3800000 },
  { id: 'ch-04', client: 'Swiggy', industry: 'Food Tech', healthScore: 82, usage: 78, engagement: 84, paymentBehavior: 88, supportSentiment: 78, nps: 72, responseRate: 76, activityFrequency: 74, repeatPurchases: 10, trend: 'stable', riskTag: 'safe', accountManager: 'Arjun Mehta', lastActiveDate: '2026-04-07', nextBestAction: 'Resolve delivery budget overage', value: 6500000 },
  { id: 'ch-05', client: 'PhonePe', industry: 'Fintech', healthScore: 68, usage: 60, engagement: 64, paymentBehavior: 72, supportSentiment: 70, nps: 58, responseRate: 62, activityFrequency: 58, repeatPurchases: 4, trend: 'down', riskTag: 'medium', accountManager: 'Vikram Joshi', lastActiveDate: '2026-03-28', nextBestAction: 'Schedule executive check-in call', value: 4500000 },
  { id: 'ch-06', client: 'CRED', industry: 'Fintech', healthScore: 54, usage: 48, engagement: 52, paymentBehavior: 58, supportSentiment: 55, nps: 42, responseRate: 50, activityFrequency: 45, repeatPurchases: 5, trend: 'down', riskTag: 'high', accountManager: 'Meera Patel', lastActiveDate: '2026-03-18', nextBestAction: 'Escalate to VP — scope disputes unresolved', value: 4900000 },
  { id: 'ch-07', client: 'Slice', industry: 'Fintech', healthScore: 32, usage: 25, engagement: 30, paymentBehavior: 22, supportSentiment: 35, nps: 18, responseRate: 28, activityFrequency: 20, repeatPurchases: 2, trend: 'down', riskTag: 'high', accountManager: 'Vikram Joshi', lastActiveDate: '2026-02-20', nextBestAction: 'Send win-back offer — 20% discount on next project', value: 3200000 },
  { id: 'ch-08', client: 'Navi', industry: 'Fintech', healthScore: 85, usage: 80, engagement: 86, paymentBehavior: 90, supportSentiment: 82, nps: 75, responseRate: 80, activityFrequency: 78, repeatPurchases: 4, trend: 'up', riskTag: 'safe', accountManager: 'Priya Sharma', lastActiveDate: '2026-04-10', nextBestAction: 'Offer maintenance retainer — high fit', value: 2800000 },
  { id: 'ch-09', client: 'Rapido', industry: 'Logistics', healthScore: 72, usage: 68, engagement: 70, paymentBehavior: 74, supportSentiment: 72, nps: 62, responseRate: 70, activityFrequency: 65, repeatPurchases: 3, trend: 'stable', riskTag: 'safe', accountManager: 'Deepika Nair', lastActiveDate: '2026-04-05', nextBestAction: 'Approach for app redesign upsell', value: 1800000 },
  { id: 'ch-10', client: 'Meesho', industry: 'E-commerce', healthScore: 45, usage: 38, engagement: 42, paymentBehavior: 48, supportSentiment: 44, nps: 32, responseRate: 40, activityFrequency: 35, repeatPurchases: 2, trend: 'down', riskTag: 'high', accountManager: 'Arjun Mehta', lastActiveDate: '2026-03-08', nextBestAction: 'Send reactivation WhatsApp — 45 day inactive', value: 1500000 },
];

// ---- 3. Churn Risk ----
export const churnRiskData: ChurnRisk[] = [
  { id: 'cr-01', client: 'Slice', industry: 'Fintech', riskLevel: 'high', riskScore: 92, inactivityDays: 48, delayedPayments: 2, engagementDrop: 65, negativeFeedback: 4, supportEscalations: 3, lastPurchase: '2026-02-20', contractValue: 3200000, accountManager: 'Vikram Joshi', predictedChurnDate: '2026-05-15', recommendedAction: 'Escalate to VP + offer structured payment plan' },
  { id: 'cr-02', client: 'CRED', industry: 'Fintech', riskLevel: 'high', riskScore: 85, inactivityDays: 22, delayedPayments: 1, engagementDrop: 48, negativeFeedback: 3, supportEscalations: 2, lastPurchase: '2026-03-18', contractValue: 4900000, accountManager: 'Meera Patel', predictedChurnDate: '2026-06-01', recommendedAction: 'Schedule executive call + revise SOW terms' },
  { id: 'cr-03', client: 'Meesho', industry: 'E-commerce', riskLevel: 'high', riskScore: 78, inactivityDays: 32, delayedPayments: 1, engagementDrop: 60, negativeFeedback: 2, supportEscalations: 1, lastPurchase: '2026-03-08', contractValue: 1500000, accountManager: 'Arjun Mehta', predictedChurnDate: '2026-06-15', recommendedAction: 'Send win-back WhatsApp with 15% loyalty offer' },
  { id: 'cr-04', client: 'Urban Company', industry: 'Services', riskLevel: 'medium', riskScore: 62, inactivityDays: 18, delayedPayments: 0, engagementDrop: 30, negativeFeedback: 1, supportEscalations: 0, lastPurchase: '2026-03-22', contractValue: 1200000, accountManager: 'Deepika Nair', predictedChurnDate: '2026-07-01', recommendedAction: 'Send personalized check-in email with value recap' },
  { id: 'cr-05', client: 'PhonePe', industry: 'Fintech', riskLevel: 'medium', riskScore: 55, inactivityDays: 12, delayedPayments: 1, engagementDrop: 35, negativeFeedback: 1, supportEscalations: 1, lastPurchase: '2026-03-28', contractValue: 4500000, accountManager: 'Vikram Joshi', predictedChurnDate: '2026-07-15', recommendedAction: 'Resolve payment overdue + schedule success call' },
  { id: 'cr-06', client: 'Curefit', industry: 'Health', riskLevel: 'medium', riskScore: 48, inactivityDays: 25, delayedPayments: 0, engagementDrop: 28, negativeFeedback: 0, supportEscalations: 0, lastPurchase: '2026-03-15', contractValue: 900000, accountManager: 'Priya Sharma', predictedChurnDate: '2026-08-01', recommendedAction: 'Send project completion testimonial request + re-engage' },
  { id: 'cr-07', client: 'Spinny', industry: 'Auto', riskLevel: 'safe', riskScore: 28, inactivityDays: 8, delayedPayments: 0, engagementDrop: 12, negativeFeedback: 0, supportEscalations: 0, lastPurchase: '2026-04-02', contractValue: 2200000, accountManager: 'Meera Patel', predictedChurnDate: '—', recommendedAction: 'Continue engagement — schedule next milestone review' },
  { id: 'cr-08', client: 'Unacademy', industry: 'EdTech', riskLevel: 'safe', riskScore: 22, inactivityDays: 5, delayedPayments: 0, engagementDrop: 8, negativeFeedback: 0, supportEscalations: 0, lastPurchase: '2026-04-06', contractValue: 1800000, accountManager: 'Arjun Mehta', predictedChurnDate: '—', recommendedAction: 'Healthy account — explore cross-sell opportunities' },
];

// ---- 4. Renewals ----
export const renewalsData: Renewal[] = [
  { id: 'ren-01', client: 'Razorpay', renewalDate: '2026-05-15', contractValue: 2400000, renewalProbability: 96, accountManager: 'Priya Sharma', lastTouchpoint: 'QBR on Apr 8 — positive', nextStep: 'Send renewal proposal by Apr 20', status: 'on-track', contractPeriod: 'Annual', industry: 'Fintech', quoteGenerated: false },
  { id: 'ren-02', client: 'Swiggy', renewalDate: '2026-05-30', contractValue: 5400000, renewalProbability: 88, accountManager: 'Arjun Mehta', lastTouchpoint: 'Delivery review on Apr 5', nextStep: 'Resolve budget overage before proposal', status: 'at-risk', contractPeriod: 'Annual', industry: 'Food Tech', negotiationNotes: 'Client wants 10% volume discount', discountApproved: 8 },
  { id: 'ren-03', client: 'Zerodha', renewalDate: '2026-06-15', contractValue: 1800000, renewalProbability: 94, accountManager: 'Meera Patel', lastTouchpoint: 'Success plan review on Apr 9', nextStep: 'Prepare renewal proposal with expansion options', status: 'on-track', contractPeriod: 'Annual', industry: 'Fintech', quoteGenerated: false },
  { id: 'ren-04', client: 'Groww', renewalDate: '2026-06-30', contractValue: 1200000, renewalProbability: 82, accountManager: 'Deepika Nair', lastTouchpoint: 'Project demo on Mar 28', nextStep: 'Schedule executive call by May 15', status: 'on-track', contractPeriod: 'Quarterly', industry: 'Fintech', quoteGenerated: false },
  { id: 'ren-05', client: 'CRED', renewalDate: '2026-04-25', contractValue: 3600000, renewalProbability: 35, accountManager: 'Meera Patel', lastTouchpoint: 'Dispute call on Mar 20 — unresolved', nextStep: 'Escalate to VP — scope revision needed', status: 'overdue', contractPeriod: 'Annual', industry: 'Fintech', negotiationNotes: '3 scope disputes pending. Margin dropped to 18%.', quoteGenerated: true },
  { id: 'ren-06', client: 'PhonePe', renewalDate: '2026-07-15', contractValue: 1200000, renewalProbability: 68, accountManager: 'Vikram Joshi', lastTouchpoint: 'Payment follow-up on Apr 1', nextStep: 'Resolve outstanding invoice first', status: 'at-risk', contractPeriod: 'Quarterly', industry: 'Fintech', negotiationNotes: 'Payment delayed 15 days. Client wants revised timeline.', quoteGenerated: false },
  { id: 'ren-07', client: 'Slice', renewalDate: '2026-05-01', contractValue: 1200000, renewalProbability: 12, accountManager: 'Vikram Joshi', lastTouchpoint: 'No response since Feb 20', nextStep: 'Last attempt — send VP email with settlement offer', status: 'lost', contractPeriod: 'Quarterly', industry: 'Fintech', negotiationNotes: '48 days inactive. Multiple disputes. Recommend write-off.', quoteGenerated: true },
  { id: 'ren-08', client: 'Navi', renewalDate: '2026-08-01', contractValue: 960000, renewalProbability: 78, accountManager: 'Priya Sharma', lastTouchpoint: 'Website launch celebration on Apr 10', nextStep: 'Discuss maintenance retainer during next call', status: 'on-track', contractPeriod: 'Annual', industry: 'Fintech', quoteGenerated: false },
];

// ---- 5. Win-back Campaigns ----
export const winbackCampaigns: WinbackCampaign[] = [
  { id: 'wb-01', name: '45-Day Inactive Reactivation', segment: '45-60 day inactive', channel: 'multi', status: 'active', inactivityDays: '45-60 days', offerType: 'Loyalty Discount', offerValue: 15, sentCount: 24, reactivated: 8, successRate: 33.3, bestSendTime: 'Tuesday 10:00 AM', launchedDate: '2026-04-01' },
  { id: 'wb-02', name: 'VIP Win-back — Top 10 Clients', segment: 'Inactive VIPs', channel: 'whatsapp', status: 'active', inactivityDays: '30+ days', offerType: 'Free Value Add', offerValue: 50000, sentCount: 3, reactivated: 2, successRate: 66.7, bestSendTime: 'Wednesday 2:00 PM', launchedDate: '2026-03-25' },
  { id: 'wb-03', name: 'Q1 Churned Client Recovery', segment: 'Churned Q1', channel: 'email', status: 'completed', inactivityDays: '60+ days', offerType: 'Flat 20% Off', offerValue: 20, sentCount: 12, reactivated: 3, successRate: 25.0, bestSendTime: 'Monday 11:00 AM', launchedDate: '2026-03-10' },
  { id: 'wb-04', name: 'Payment Issue Recovery', segment: 'Payment delayed', channel: 'whatsapp', status: 'active', inactivityDays: 'Any', offerType: 'Extended Terms', offerValue: 0, sentCount: 8, reactivated: 5, successRate: 62.5, bestSendTime: 'Thursday 10:00 AM', launchedDate: '2026-04-05' },
  { id: 'wb-05', name: 'Feature Upgrade Win-back', segment: 'Stale accounts', channel: 'email', status: 'draft', inactivityDays: '30-45 days', offerType: 'Free Trial Extension', offerValue: 0, sentCount: 0, reactivated: 0, successRate: 0, bestSendTime: '—', launchedDate: '—' },
  { id: 'wb-06', name: 'Festival Re-engagement — Eid', segment: 'All inactive', channel: 'multi', status: 'paused', inactivityDays: '30+ days', offerType: 'Festival Coupon', offerValue: 12, sentCount: 45, reactivated: 12, successRate: 26.7, bestSendTime: 'Festival Eve', launchedDate: '2026-03-28' },
];

// ---- 6. Upsell & Cross-sell ----
export const upsellData: UpsellOpportunity[] = [
  { id: 'up-01', client: 'Razorpay', currentServices: ['UI/UX Design', 'Development'], recommendedService: 'SEO & Performance Audit', fitScore: 85, expansionValue: 450000, probability: 78, accountGrowthScore: 92, lastPurchase: '2026-04-10', accountManager: 'Priya Sharma', industry: 'Fintech', status: 'new' },
  { id: 'up-02', client: 'Groww', currentServices: ['UI/UX', 'Backend'], recommendedService: 'Mobile App Redesign', fitScore: 82, expansionValue: 800000, probability: 72, accountGrowthScore: 88, lastPurchase: '2026-04-08', accountManager: 'Deepika Nair', industry: 'Fintech', status: 'new' },
  { id: 'up-03', client: 'Swiggy', currentServices: ['Branding', 'App Development'], recommendedService: 'Maintenance Retainer', fitScore: 90, expansionValue: 540000, probability: 85, accountGrowthScore: 82, lastPurchase: '2026-04-07', accountManager: 'Arjun Mehta', industry: 'Food Tech', status: 'approached' },
  { id: 'up-04', client: 'Zerodha', currentServices: ['Product Design'], recommendedService: 'Frontend Development', fitScore: 88, expansionValue: 650000, probability: 80, accountGrowthScore: 91, lastPurchase: '2026-04-09', accountManager: 'Meera Patel', industry: 'Fintech', status: 'new' },
  { id: 'up-05', client: 'PhonePe', currentServices: ['UI Design', 'Frontend'], recommendedService: 'Analytics Dashboard', fitScore: 76, expansionValue: 380000, probability: 58, accountGrowthScore: 68, lastPurchase: '2026-03-28', accountManager: 'Vikram Joshi', industry: 'Fintech', status: 'approached' },
  { id: 'up-06', client: 'Navi', currentServices: ['Website Development'], recommendedService: 'Maintenance Retainer', fitScore: 84, expansionValue: 240000, probability: 75, accountGrowthScore: 85, lastPurchase: '2026-04-10', accountManager: 'Priya Sharma', industry: 'Fintech', status: 'new' },
  { id: 'up-07', client: 'Rapido', currentServices: ['Branding'], recommendedService: 'App UI Redesign', fitScore: 72, expansionValue: 580000, probability: 62, accountGrowthScore: 72, lastPurchase: '2026-04-05', accountManager: 'Deepika Nair', industry: 'Logistics', status: 'in-progress' },
  { id: 'up-08', client: 'Spinny', currentServices: ['Website'], recommendedService: 'Full Rebrand', fitScore: 68, expansionValue: 680000, probability: 55, accountGrowthScore: 78, lastPurchase: '2026-04-02', accountManager: 'Meera Patel', industry: 'Auto', status: 'new' },
];

// ---- 7. Loyalty ----
export const loyaltyTiers: LoyaltyTier[] = [
  { tier: 'silver', minSpent: 100000, minPurchases: 2, benefits: ['5% discount on next project', 'Priority support', 'Monthly newsletter'], discount: 5, memberCount: 124, color: '#94a3b8' },
  { tier: 'gold', minSpent: 500000, minPurchases: 5, benefits: ['10% discount', 'Dedicated account manager', 'Quarterly business review', 'Early access to new services', 'VIP support'], discount: 10, memberCount: 86, color: '#f59e0b' },
  { tier: 'platinum', minSpent: 2000000, minPurchases: 8, benefits: ['15% discount', 'Executive account manager', 'Monthly strategy session', 'Free service audit', 'Co-marketing opportunities', 'Annual retreat invite'], discount: 15, memberCount: 38, color: '#8b5cf6' },
];

export const loyaltyMembers: LoyaltyMember[] = [
  { id: 'lm-01', client: 'Razorpay', tier: 'platinum', points: 48500, totalSpent: 8200000, repeatPurchases: 12, referrals: 5, joinedDate: '2024-06-15', lastPurchaseDate: '2026-04-10', nextMilestone: '50K Points', milestoneProgress: 97, couponsUsed: 8, rewardsRedeemed: 12 },
  { id: 'lm-02', client: 'Swiggy', tier: 'platinum', points: 42500, totalSpent: 6500000, repeatPurchases: 10, referrals: 3, joinedDate: '2024-09-01', lastPurchaseDate: '2026-04-07', nextMilestone: '45K Points', milestoneProgress: 94, couponsUsed: 6, rewardsRedeemed: 10 },
  { id: 'lm-03', client: 'Zerodha', tier: 'platinum', points: 34800, totalSpent: 5800000, repeatPurchases: 8, referrals: 4, joinedDate: '2024-10-20', lastPurchaseDate: '2026-04-09', nextMilestone: '35K Points', milestoneProgress: 99, couponsUsed: 5, rewardsRedeemed: 8 },
  { id: 'lm-04', client: 'Groww', tier: 'gold', points: 22400, totalSpent: 3800000, repeatPurchases: 6, referrals: 2, joinedDate: '2025-01-10', lastPurchaseDate: '2026-04-08', nextMilestone: '25K Points', milestoneProgress: 90, couponsUsed: 3, rewardsRedeemed: 4 },
  { id: 'lm-05', client: 'CRED', tier: 'gold', points: 18200, totalSpent: 4900000, repeatPurchases: 5, referrals: 1, joinedDate: '2025-03-15', lastPurchaseDate: '2026-03-18', nextMilestone: '20K Points', milestoneProgress: 91, couponsUsed: 4, rewardsRedeemed: 3 },
  { id: 'lm-06', client: 'PhonePe', tier: 'gold', points: 16500, totalSpent: 4500000, repeatPurchases: 4, referrals: 2, joinedDate: '2025-05-01', lastPurchaseDate: '2026-03-28', nextMilestone: '20K Points', milestoneProgress: 83, couponsUsed: 2, rewardsRedeemed: 3 },
  { id: 'lm-07', client: 'Navi', tier: 'gold', points: 12800, totalSpent: 2800000, repeatPurchases: 4, referrals: 1, joinedDate: '2025-07-20', lastPurchaseDate: '2026-04-10', nextMilestone: '15K Points', milestoneProgress: 85, couponsUsed: 2, rewardsRedeemed: 2 },
  { id: 'lm-08', client: 'Rapido', tier: 'silver', points: 8200, totalSpent: 1800000, repeatPurchases: 3, referrals: 1, joinedDate: '2025-09-10', lastPurchaseDate: '2026-04-05', nextMilestone: '10K Points', milestoneProgress: 82, couponsUsed: 1, rewardsRedeemed: 1 },
  { id: 'lm-09', client: 'Meesho', tier: 'silver', points: 5400, totalSpent: 1500000, repeatPurchases: 2, referrals: 0, joinedDate: '2026-01-05', lastPurchaseDate: '2026-03-08', nextMilestone: '10K Points', milestoneProgress: 54, couponsUsed: 0, rewardsRedeemed: 0 },
  { id: 'lm-10', client: 'Spinny', tier: 'silver', points: 4800, totalSpent: 2200000, repeatPurchases: 3, referrals: 1, joinedDate: '2025-11-12', lastPurchaseDate: '2026-04-02', nextMilestone: '10K Points', milestoneProgress: 48, couponsUsed: 1, rewardsRedeemed: 1 },
];

// ---- 8. Referrals ----
export const referralData: ReferralEntry[] = [
  { id: 'ref-01', advocate: 'Razorpay', referralCode: 'RAZ2024', totalReferrals: 5, converted: 3, conversionRate: 60, commissionEarned: 150000, rewardType: 'Service Credit', rank: 1, topReferral: 'Zerodha (Enterprise)', fraudFlag: false },
  { id: 'ref-02', advocate: 'Zerodha', referralCode: 'ZER2024', totalReferrals: 4, converted: 3, conversionRate: 75, commissionEarned: 120000, rewardType: 'Service Credit', rank: 2, topReferral: 'Groww (Fintech)', fraudFlag: false },
  { id: 'ref-03', advocate: 'Swiggy', referralCode: 'SWG2025', totalReferrals: 3, converted: 2, conversionRate: 66.7, commissionEarned: 85000, rewardType: 'Cash Reward', rank: 3, topReferral: 'Zomato (Food)', fraudFlag: false },
  { id: 'ref-04', advocate: 'Groww', referralCode: 'GRW2025', totalReferrals: 2, converted: 1, conversionRate: 50, commissionEarned: 45000, rewardType: 'Service Credit', rank: 4, topReferral: 'Smallcase (FinTech)', fraudFlag: false },
  { id: 'ref-05', advocate: 'Navi', referralCode: 'NAV2025', totalReferrals: 1, converted: 1, conversionRate: 100, commissionEarned: 35000, rewardType: 'Discount Coupon', rank: 5, topReferral: 'Pine Labs (Payments)', fraudFlag: false },
  { id: 'ref-06', advocate: 'PhonePe', referralCode: 'PHN2025', totalReferrals: 2, converted: 0, conversionRate: 0, commissionEarned: 0, rewardType: 'Service Credit', rank: 6, topReferral: '—', fraudFlag: false },
];

// ---- 9. NPS & Feedback ----
export const npsResponses: NPSResponse[] = [
  { id: 'nps-01', client: 'Razorpay', score: 9, category: 'promoter', feedback: 'Outstanding design quality. Team is proactive and understands our brand deeply.', date: '2026-04-08', sentiment: 'positive', industry: 'Fintech' },
  { id: 'nps-02', client: 'Zerodha', score: 10, category: 'promoter', feedback: 'Best design partner we have worked with. Consistent delivery quality.', date: '2026-04-05', sentiment: 'positive', industry: 'Fintech' },
  { id: 'nps-03', client: 'Swiggy', score: 7, category: 'passive', feedback: 'Good work but delivery timelines could be tighter. Budget overages need better control.', date: '2026-04-02', sentiment: 'neutral', industry: 'Food Tech' },
  { id: 'nps-04', client: 'Groww', score: 8, category: 'promoter', feedback: 'Love the UI designs. Looking forward to continued partnership.', date: '2026-04-01', sentiment: 'positive', industry: 'Fintech' },
  { id: 'nps-05', client: 'PhonePe', score: 5, category: 'passive', feedback: 'Communication gaps on project updates. Need better visibility into progress.', date: '2026-03-28', sentiment: 'neutral', industry: 'Fintech' },
  { id: 'nps-06', client: 'CRED', score: 2, category: 'detractor', feedback: 'Scope changed without consent. Multiple revision disputes. Not satisfied with project management.', date: '2026-03-20', sentiment: 'negative', industry: 'Fintech' },
  { id: 'nps-07', client: 'Slice', score: 1, category: 'detractor', feedback: 'Worst vendor experience. Unprofessional. Would not recommend.', date: '2026-03-10', sentiment: 'negative', industry: 'Fintech' },
  { id: 'nps-08', client: 'Navi', score: 8, category: 'promoter', feedback: 'Website turned out great. Smooth process from start to finish.', date: '2026-04-10', sentiment: 'positive', industry: 'Fintech' },
  { id: 'nps-09', client: 'Rapido', score: 7, category: 'passive', feedback: 'Branding work was good. Would like to explore more services.', date: '2026-04-04', sentiment: 'neutral', industry: 'Logistics' },
  { id: 'nps-10', client: 'Meesho', score: 4, category: 'detractor', feedback: 'Slow response times. Lost interest in continuing after 2 projects.', date: '2026-03-15', sentiment: 'negative', industry: 'E-commerce' },
];

export const feedbackData: FeedbackEntry[] = [
  { id: 'fb-01', client: 'Razorpay', type: 'praise', rating: 5, subject: 'Exceptional Dashboard Design', message: 'The finance dashboard design exceeded expectations. Great attention to detail and pixel-perfect implementation.', date: '2026-04-10', status: 'new', sentiment: 'positive' },
  { id: 'fb-02', client: 'CRED', type: 'complaint', rating: 1, subject: 'Scope Dispute — Campaign Design', message: 'SOW clearly stated 2 revision rounds but we were charged for 6. This is unacceptable and needs immediate resolution.', date: '2026-04-08', status: 'acknowledged', sentiment: 'negative' },
  { id: 'fb-03', client: 'Swiggy', type: 'feature-request', rating: 4, subject: 'Request: Dark Mode for Admin Dashboard', message: 'Our team works late hours and would greatly appreciate a dark mode option for the admin dashboard.', date: '2026-04-06', status: 'new', sentiment: 'positive' },
  { id: 'fb-04', client: 'Groww', type: 'praise', rating: 5, subject: 'UI/UX Overhaul — Highly Impressed', message: 'The new UI design for our app has received incredible feedback from our users. Conversion improved 18%.', date: '2026-04-05', status: 'resolved', sentiment: 'positive' },
  { id: 'fb-05', client: 'PhonePe', type: 'complaint', rating: 2, subject: 'Delayed Invoice — Payment Module', message: 'Invoice sent 15 days late. Our finance team had to follow up multiple times. Please fix this.', date: '2026-04-02', status: 'resolved', sentiment: 'negative' },
  { id: 'fb-06', client: 'Navi', type: 'praise', rating: 4, subject: 'Website Launch — Smooth Experience', message: 'The website was delivered on time and looks fantastic. Minor revisions were handled quickly.', date: '2026-04-01', status: 'resolved', sentiment: 'positive' },
  { id: 'fb-07', client: 'Zerodha', type: 'nps', rating: 5, subject: 'NPS Survey Q1 2026', message: 'Score: 10/10. Consistently great work. DigiNue is our preferred design partner.', date: '2026-03-30', status: 'closed', sentiment: 'positive' },
  { id: 'fb-08', client: 'Slice', type: 'complaint', rating: 1, subject: 'Project Abandonment', message: 'Team stopped responding after 3 weeks. No updates, no delivery. Complete silence since Feb 20.', date: '2026-03-25', status: 'acknowledged', sentiment: 'negative' },
];

// ---- 10. Customer Journey ----
export const journeyStages: JourneyStage[] = [
  { id: 'js-01', name: 'Acquired', customers: 248, conversionFrom: 100, dropoff: 0, avgDaysInStage: 5 },
  { id: 'js-02', name: 'Activated', customers: 212, conversionFrom: 85.5, dropoff: 14.5, avgDaysInStage: 14 },
  { id: 'js-03', name: 'Repeat', customers: 180, conversionFrom: 72.6, dropoff: 15.1, avgDaysInStage: 45 },
  { id: 'js-04', name: 'Renewed', customers: 156, conversionFrom: 62.9, dropoff: 8.1, avgDaysInStage: 90 },
  { id: 'js-05', name: 'Advocate', customers: 94, conversionFrom: 37.9, dropoff: 24.4, avgDaysInStage: 180 },
];

export const journeyEvents: JourneyEvent[] = [
  { id: 'je-01', client: 'Razorpay', stage: 'Advocate', event: 'Referred Zerodha — converted', date: '2026-04-08', type: 'conversion' },
  { id: 'je-02', client: 'CRED', stage: 'Repeat', event: 'Scope dispute filed', date: '2026-03-20', type: 'friction' },
  { id: 'je-03', client: 'Groww', stage: 'Renewed', event: 'Renewed Q2 retainer — upgraded', date: '2026-04-08', type: 'milestone' },
  { id: 'je-04', client: 'Slice', stage: 'Activated', event: 'Client stopped responding', date: '2026-02-20', type: 'dropoff' },
  { id: 'je-05', client: 'Swiggy', stage: 'Renewed', event: 'Completed rebrand — renewal discussion started', date: '2026-04-07', type: 'milestone' },
  { id: 'je-06', client: 'Navi', stage: 'Repeat', event: 'Website launched successfully', date: '2026-04-10', type: 'milestone' },
  { id: 'je-07', client: 'PhonePe', stage: 'Repeat', event: 'Payment delayed — account at risk', date: '2026-03-28', type: 'friction' },
  { id: 'je-08', client: 'Meesho', stage: 'Activated', event: 'No engagement for 32 days', date: '2026-03-08', type: 'dropoff' },
];

// ---- 11. Cohort Analysis ----
export const cohortData: CohortRow[] = [
  { cohort: 'Oct 2025', customers: 28, retention: [100, 82, 71, 64, 57, 54], repeatRate: [0, 18, 25, 32, 36, 39], churnRate: [0, 18, 11, 7, 7, 3], revenue: [420000, 380000, 350000, 320000, 300000, 290000] },
  { cohort: 'Nov 2025', customers: 32, retention: [100, 84, 75, 69, 62, 59], repeatRate: [0, 16, 22, 28, 31, 34], churnRate: [0, 16, 9, 6, 7, 3], revenue: [480000, 450000, 420000, 390000, 370000, 360000] },
  { cohort: 'Dec 2025', customers: 24, retention: [100, 88, 79, 75, 71, 67], repeatRate: [0, 12, 21, 25, 29, 33], churnRate: [0, 12, 9, 4, 4, 4], revenue: [360000, 340000, 320000, 310000, 300000, 290000] },
  { cohort: 'Jan 2026', customers: 36, retention: [100, 86, 78, 72, 67], repeatRate: [0, 14, 22, 28, 33], churnRate: [0, 14, 8, 6, 5], revenue: [540000, 500000, 470000, 440000, 420000] },
  { cohort: 'Feb 2026', customers: 30, retention: [100, 83, 77, 70], repeatRate: [0, 17, 23, 30], churnRate: [0, 17, 6, 7], revenue: [450000, 420000, 390000, 370000] },
  { cohort: 'Mar 2026', customers: 42, retention: [100, 88, 81], repeatRate: [0, 12, 19], churnRate: [0, 12, 7], revenue: [630000, 590000, 560000] },
  { cohort: 'Apr 2026', customers: 38, retention: [100, 86], repeatRate: [0, 14], churnRate: [0, 14], revenue: [570000, 530000] },
];

// ---- 12. LTV Forecast ----
export const ltvForecasts: LTVForecast[] = [
  { id: 'ltv-01', segment: 'Enterprise (Razorpay, Swiggy)', currentLTV: 12400000, predictedLTV: 15800000, bestCase: 19200000, worstCase: 10200000, confidence: 84, avgLifespan: 36, churnRisk: 12, expansionPotential: 6800000 },
  { id: 'ltv-02', segment: 'Mid-Market (Groww, PhonePe, Navi)', currentLTV: 7200000, predictedLTV: 9400000, bestCase: 11600000, worstCase: 5800000, confidence: 78, avgLifespan: 24, churnRisk: 22, expansionPotential: 4200000 },
  { id: 'ltv-03', segment: 'SMB (Rapido, Spinny, Meesho)', currentLTV: 3600000, predictedLTV: 4800000, bestCase: 6200000, worstCase: 2400000, confidence: 72, avgLifespan: 18, churnRisk: 35, expansionPotential: 2400000 },
  { id: 'ltv-04', segment: 'At-Risk (CRED, Slice, Meesho)', currentLTV: 2800000, predictedLTV: 2200000, bestCase: 3200000, worstCase: 800000, confidence: 58, avgLifespan: 12, churnRisk: 65, expansionPotential: 400000 },
  { id: 'ltv-05', segment: 'New Clients (Last 90 days)', currentLTV: 800000, predictedLTV: 4200000, bestCase: 6800000, worstCase: 1800000, confidence: 62, avgLifespan: 6, churnRisk: 42, expansionPotential: 3400000 },
];

// ---- 13. Customer Success Plans ----
export const successPlans: SuccessPlan[] = [
  { id: 'sp-01', client: 'Razorpay', accountManager: 'Priya Sharma', startDate: '2026-01-15', healthScore: 94, lastQBR: '2026-04-08', nextQBR: '2026-07-08', valueDelivered: 8200000, valueTarget: 10000000, milestones: [
    { id: 'sm-01', client: 'Razorpay', milestone: 'Complete Dashboard v2 Design', dueDate: '2026-02-28', completedDate: '2026-02-25', status: 'completed', category: 'onboarding', owner: 'Priya Sharma' },
    { id: 'sm-02', client: 'Razorpay', milestone: 'Launch Dashboard v2', dueDate: '2026-04-15', completedDate: undefined, status: 'in-progress', category: 'value-realization', owner: 'Arjun Mehta' },
    { id: 'sm-03', client: 'Razorpay', milestone: 'Q2 QBR — Expansion Discussion', dueDate: '2026-07-08', completedDate: undefined, status: 'pending', category: 'qbr', owner: 'Priya Sharma' },
    { id: 'sm-04', client: 'Razorpay', milestone: 'SEO Audit Proposal', dueDate: '2026-05-01', completedDate: undefined, status: 'pending', category: 'expansion', owner: 'Priya Sharma' },
  ]},
  { id: 'sp-02', client: 'Swiggy', accountManager: 'Arjun Mehta', startDate: '2026-02-01', healthScore: 82, lastQBR: '2026-03-15', nextQBR: '2026-06-15', valueDelivered: 6500000, valueTarget: 8000000, milestones: [
    { id: 'sm-05', client: 'Swiggy', milestone: 'Brand Identity Delivery', dueDate: '2026-03-15', completedDate: '2026-03-12', status: 'completed', category: 'onboarding', owner: 'Arjun Mehta' },
    { id: 'sm-06', client: 'Swiggy', milestone: 'App Rebrand Phase 1 Complete', dueDate: '2026-04-30', completedDate: undefined, status: 'in-progress', category: 'value-realization', owner: 'Arjun Mehta' },
    { id: 'sm-07', client: 'Swiggy', milestone: 'Resolve Budget Overage', dueDate: '2026-04-20', completedDate: undefined, status: 'overdue', category: 'health', owner: 'Arjun Mehta', notes: '₹48L of ₹50L used. Need extension or scope reduction.' },
  ]},
  { id: 'sp-03', client: 'Groww', accountManager: 'Deepika Nair', startDate: '2026-03-01', healthScore: 88, lastQBR: '2026-04-01', nextQBR: '2026-07-01', valueDelivered: 3800000, valueTarget: 5000000, milestones: [
    { id: 'sm-08', client: 'Groww', milestone: 'UI/UX Overhaul Complete', dueDate: '2026-04-10', completedDate: '2026-04-08', status: 'completed', category: 'value-realization', owner: 'Deepika Nair' },
    { id: 'sm-09', client: 'Groww', milestone: 'Mobile App Proposal', dueDate: '2026-05-15', completedDate: undefined, status: 'pending', category: 'expansion', owner: 'Deepika Nair' },
    { id: 'sm-10', client: 'Groww', milestone: 'Gold Tier Loyalty Upgrade', dueDate: '2026-04-30', completedDate: undefined, status: 'in-progress', category: 'health', owner: 'Deepika Nair' },
  ]},
];

// ---- 14. Advocacy ----
export const advocacyData: AdvocacyEntry[] = [
  { id: 'adv-01', client: 'Razorpay', type: 'case-study', status: 'published', requestDate: '2026-02-01', submittedDate: '2026-03-15', content: 'How Razorpay transformed their dashboard experience with DigiNue — 3x faster design cycles.', impact: 24500, promoterScore: 95, industry: 'Fintech' },
  { id: 'adv-02', client: 'Zerodha', type: 'testimonial', status: 'submitted', requestDate: '2026-03-01', submittedDate: '2026-04-05', content: 'DigiNue is our go-to design partner. Consistent quality, proactive communication, and deep understanding of fintech UX.', impact: 18200, promoterScore: 92, industry: 'Fintech' },
  { id: 'adv-03', client: 'Groww', type: 'review', status: 'published', requestDate: '2026-03-15', submittedDate: '2026-04-02', content: '5/5 on Clutch and G2. Exceptional UI/UX design team.', impact: 12400, promoterScore: 88, industry: 'Fintech' },
  { id: 'adv-04', client: 'Swiggy', type: 'ambassador', status: 'submitted', requestDate: '2026-02-15', submittedDate: '2026-03-20', content: 'Agreed to be brand ambassador for DigiNue at food tech conferences.', impact: 8500, promoterScore: 78, industry: 'Food Tech' },
  { id: 'adv-05', client: 'Navi', type: 'testimonial', status: 'requested', requestDate: '2026-04-10', impact: 0, promoterScore: 82, industry: 'Fintech' },
  { id: 'adv-06', client: 'Razorpay', type: 'referral-champion', status: 'published', requestDate: '2025-06-15', submittedDate: '2025-07-01', content: 'Referred 5 enterprises — 3 converted. Earned ₹1.5L in referral credits.', impact: 35000, promoterScore: 96, industry: 'Fintech' },
  { id: 'adv-07', client: 'CRED', type: 'case-study', status: 'declined', requestDate: '2026-03-10', impact: 0, promoterScore: 18, industry: 'Fintech' },
  { id: 'adv-08', client: 'Zerodha', type: 'speaker', status: 'submitted', requestDate: '2026-03-20', submittedDate: '2026-04-08', content: 'Agreed to co-present at UX India 2026 on fintech design systems.', impact: 15000, promoterScore: 92, industry: 'Fintech' },
];

// ---- 15. AI Growth Insights ----
export const aiGrowthInsights: AIGrowthInsight[] = [
  { id: 'ai-01', type: 'churn-prevention', title: 'Slice churn probability at 78% — act within 7 days', description: 'Slice has not responded to any communication for 48 days. Historical data shows accounts with 45+ day inactivity have 78% churn probability. Their payment disputes remain unresolved.', confidence: 91, impact: 'critical', recommendation: 'Send final settlement offer via VP-to-VP email. Include partial refund option. Prepare write-off documentation if no response.', potentialImpact: 3200000, segment: 'At-Risk Accounts', metric: 'Churn Probability', currentValue: 78, thresholdValue: 40, actionItems: ['Send VP email by Apr 14', 'Prepare write-off docs', 'Update CRM status'] },
  { id: 'ai-02', type: 'cohort-insight', title: 'March 2026 cohort retains 34% better than average', description: 'The March 2026 cohort (42 new clients) shows 88% M2 retention vs 84% historical average. Key driver: faster onboarding (avg 4.2 days vs 6.8 days).', confidence: 86, impact: 'high', recommendation: 'Replicate March onboarding playbook for all new clients. Assign dedicated onboarding specialist. Target: reduce onboarding to 4 days.', potentialImpact: 1200000, segment: 'New Clients', metric: 'M2 Retention', currentValue: 88, thresholdValue: 84, actionItems: ['Document March onboarding playbook', 'Hire dedicated onboarding specialist', 'Update welcome sequence'] },
  { id: 'ai-03', type: 'expansion-playbook', title: 'Razorpay has 85% fit for SEO & Performance Audit', description: 'Razorpay has invested heavily in frontend (₹32L in 2 projects). Their organic search traffic grew 45% post-dashboard launch. SEO audit is a natural expansion with 85% service fit.', confidence: 83, impact: 'high', recommendation: 'Prepare SEO audit proposal for Razorpay. Quote ₹4.5L. Include free mini-audit of their current site performance as a teaser.', potentialImpact: 450000, segment: 'Enterprise', metric: 'Upsell Fit Score', currentValue: 85, thresholdValue: 70, actionItems: ['Create free mini-audit report', 'Prepare SEO proposal', 'Schedule pitch meeting'] },
  { id: 'ai-04', type: 'loyalty-offer', title: 'PhonePe at risk of Gold → Silver tier demotion', description: 'PhonePe has been inactive for 12 days. If they do not engage by May 1, they will fall below Gold tier minimum activity threshold. Loss of Gold benefits could accelerate churn.', confidence: 78, impact: 'high', recommendation: 'Send personalized Gold retention offer: free service audit worth ₹50K. Schedule success call within 48 hours.', potentialImpact: 4500000, segment: 'At-Risk Accounts', metric: 'Days to Tier Demotion', currentValue: 12, thresholdValue: 20, actionItems: ['Send retention offer', 'Schedule call', 'Prepare service audit'] },
  { id: 'ai-05', type: 'renewal-pricing', title: 'Swiggy renewal: recommend 8% increase with value add', description: 'Swiggy requested 10% volume discount on renewal. Counter: offer 8% discount + free maintenance month. This preserves margin while meeting their budget needs.', confidence: 88, impact: 'high', recommendation: 'Counter-offer: 8% discount on ₹54L retainer + 1 free maintenance month (worth ₹4.5L). Net impact: preserve ₹2.7L margin vs 10% request.', potentialImpact: 270000, segment: 'Renewals', metric: 'Renewal Value', currentValue: 5400000, thresholdValue: 5100000, actionItems: ['Prepare counter-proposal', 'Highlight free maintenance value', 'Schedule negotiation call'] },
  { id: 'ai-06', type: 'promoter-activation', title: 'Zerodha NPS=10 — ideal case study candidate', description: 'Zerodha scored 10/10 on NPS with testimonial quote ready. They also referred 4 enterprises. This is the strongest advocacy signal in the portfolio.', confidence: 95, impact: 'medium', recommendation: 'Request detailed case study focusing on product design sprint methodology. Feature on homepage and Clutch profile. Offer co-branded content.', potentialImpact: 50000, segment: 'Advocacy', metric: 'NPS Score', currentValue: 10, thresholdValue: 9, actionItems: ['Request case study participation', 'Prepare interview questionnaire', 'Draft co-branded content'] },
  { id: 'ai-07', type: 'ltv-growth', title: 'Enterprise segment LTV can grow 27% with maintenance add-on', description: 'Enterprise clients (Razorpay, Swiggy, Zerodha) have no maintenance retainers. Adding a 20% retainer would increase LTV from ₹1.24Cr to ₹1.58Cr per account.', confidence: 82, impact: 'high', recommendation: 'Launch maintenance retainer program for all enterprise clients. Target: 20% of project value as monthly retainer. Start with Razorpay (strongest relationship).', potentialImpact: 3400000, segment: 'Enterprise', metric: 'Avg LTV', currentValue: 12400000, thresholdValue: 15000000, actionItems: ['Design retainer pricing tiers', 'Create retainer proposal template', 'Pitch to Razorpay'] },
  { id: 'ai-08', type: 'engagement-boost', title: 'Meesho re-engagement window closing — 18 days optimal', description: 'Meesho has been inactive for 32 days. Data shows optimal win-back window is 30-45 days. After 45 days, reactivation rate drops below 15%.', confidence: 75, impact: 'medium', recommendation: 'Send WhatsApp reactivation message with 15% discount offer within 5 days. Best time: Tuesday 10 AM based on their engagement history.', potentialImpact: 1500000, segment: 'At-Risk Accounts', metric: 'Inactivity Days', currentValue: 32, thresholdValue: 45, actionItems: ['Send WhatsApp by Apr 14', 'Prepare discount coupon', 'Assign reactivation owner'] },
];

// ---- 16. Retention Alerts ----
export const retentionAlerts: RetentionAlert[] = [
  { id: 'ra-01', type: 'churn', severity: 'critical', title: 'Slice likely to churn within 30 days', description: '48 days inactive, 78% churn probability, multiple unresolved disputes.', actionPage: 'churn-risk', createdAt: '2026-04-10T08:00:00' },
  { id: 'ra-02', type: 'churn', severity: 'critical', title: 'CRED renewal overdue — 35% probability', description: 'CRED contract expired Apr 25. Scope disputes unresolved. VP escalation needed.', actionPage: 'renewal-center', createdAt: '2026-04-10T09:00:00' },
  { id: 'ra-03', type: 'renewal', severity: 'warning', title: 'Swiggy renewal at-risk — budget overage', description: '₹48L of ₹50L delivery budget consumed. Resolve before renewal discussion.', actionPage: 'renewal-center', createdAt: '2026-04-08T14:00:00' },
  { id: 'ra-04', type: 'feedback', severity: 'warning', title: 'Negative feedback spike — 4 detractors in 30 days', description: 'Slice (NPS 1), CRED (NPS 2), Meesho (NPS 4), PhonePe (complaint). Root cause analysis needed.', actionPage: 'feedback-nps', createdAt: '2026-04-09T11:00:00' },
  { id: 'ra-05', type: 'loyalty', severity: 'warning', title: 'PhonePe tier demotion risk in 20 days', description: 'PhonePe will drop from Gold to Silver tier if no engagement by May 1.', actionPage: 'loyalty-program', createdAt: '2026-04-07T16:00:00' },
  { id: 'ra-06', type: 'inactivity', severity: 'info', title: 'Meesho win-back window closing', description: '32 days inactive. Optimal re-engagement window: 30-45 days. Send win-back offer.', actionPage: 'winback-campaigns', createdAt: '2026-04-06T10:00:00' },
  { id: 'ra-07', type: 'advocacy', severity: 'info', title: 'Zerodha testimonial submitted — ready to publish', description: 'NPS=10 client submitted testimonial. Publish on website and Clutch.', actionPage: 'advocacy', createdAt: '2026-04-05T09:00:00' },
  { id: 'ra-08', type: 'expansion', severity: 'info', title: 'Razorpay expansion opportunity detected', description: 'SEO audit has 85% fit score. ₹4.5L expansion opportunity.', actionPage: 'upsell-crosssell', createdAt: '2026-04-04T15:00:00' },
];
