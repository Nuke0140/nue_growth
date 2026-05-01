// ============================================
// Marketing Mock Data — Growth Engine v2
// ============================================
import type {
  Campaign, AudienceSegment, RetentionMetrics,
  LoyaltyMember, Coupon, ReferralEntry,
  ContentRequest, ServiceRequest, PostPublishMetrics,
  AIGrowthInsight, MarketingDashboardStats,
  AttributionChannel, Funnel, ABTest, AdCampaign,
  CapturedLead, EmailCampaign, WhatsAppCampaign,
  SMSCampaign, SocialPost, Workflow,
} from '../types';

// ---- 1. Dashboard Stats ----
export const marketingDashboardStats: MarketingDashboardStats = {
  totalLeads: 12847,
  mqls: 4293,
  sqls: 1847,
  campaignROI: 287.5,
  cpl: 342,
  cac: 4850,
  roas: 4.2,
  retentionRate: 78.4,
  referralGrowth: 34.2,
  revenueToday: 845000,
  revenueThisWeek: 4280000,
  revenueThisMonth: 18400000,
  revenueTarget: 25000000,
  activeCampaignsCount: 6,
  channelContribution: [
    { channel: 'Google Ads', percent: 32.5 },
    { channel: 'WhatsApp', percent: 24.8 },
    { channel: 'Email', percent: 18.2 },
    { channel: 'LinkedIn', percent: 12.1 },
    { channel: 'Social Media', percent: 8.4 },
    { channel: 'Referral', percent: 4.0 },
  ],
  leadsTrend: [
    { date: 'Mar 1', count: 320 },
    { date: 'Mar 5', count: 445 },
    { date: 'Mar 10', count: 380 },
    { date: 'Mar 15', count: 520 },
    { date: 'Mar 20', count: 480 },
    { date: 'Mar 25', count: 590 },
    { date: 'Mar 30', count: 650 },
    { date: 'Apr 5', count: 710 },
    { date: 'Apr 10', count: 680 },
    { date: 'Apr 12', count: 740 },
  ],
  revenueTrend: [
    { date: 'Mar 1', amount: 420000 },
    { date: 'Mar 5', amount: 580000 },
    { date: 'Mar 10', amount: 510000 },
    { date: 'Mar 15', amount: 720000 },
    { date: 'Mar 20', amount: 690000 },
    { date: 'Mar 25', amount: 840000 },
    { date: 'Mar 30', amount: 910000 },
    { date: 'Apr 5', amount: 870000 },
    { date: 'Apr 10', amount: 940000 },
    { date: 'Apr 12', amount: 1050000 },
  ],
};

// ---- 2. Unified Campaigns ----
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-01', name: 'H1 2026 Enterprise Lead Gen Blitz', type: 'lead-gen',
    channels: ['email', 'whatsapp', 'ads'], budget: 2500000, spend: 1875000,
    clicks: 48200, leads: 3856, conversions: 612, revenue: 24600000, roi: 342.8, status: 'active',
    owner: 'Priya Sharma', startDate: '2026-03-01', endDate: '2026-06-30',
    description: 'Multi-channel enterprise lead generation targeting BFSI and SaaS verticals across India.',
    objective: { primaryGoal: 'leads', targetMetric: 5000, targetMetricUnit: 'leads', secondaryGoals: ['conversions', 'pipeline'] },
    audience: { segmentId: 'seg-01', segmentName: 'Enterprise Decision Makers', estimatedReach: 8420, excludeSegmentIds: [] },
    channelConfig: [
      { channel: 'email', enabled: true, content: { subject: 'Transform Your Enterprise Marketing', bodyHtml: '<p>Discover AI-powered marketing...</p>', ctaText: 'Book Demo', ctaUrl: '/demo' } },
      { channel: 'whatsapp', enabled: true, content: { templateId: 'tpl-enterprise', bodyText: 'Hi {{name}}! Transform your marketing with DigiNue.', ctaText: 'Learn More', quickReplies: ['Book Demo', 'Get Pricing'] } },
      { channel: 'ads', enabled: true, content: { ctaText: 'Start Free Trial', mediaType: 'image' } },
    ],
    offer: { type: 'free-trial', discountType: 'flat', discountValue: 0, autoApply: true },
    automations: [
      { id: 'auto-01', name: 'Lead Welcome Sequence', enabled: true, trigger: 'form-submitted', conditions: [{ field: 'lead_score', operator: 'greater-than', value: '50' }], actions: [{ type: 'send-whatsapp', config: { template: 'welcome' }, delay: 5 }, { type: 'add-tag', config: { tag: 'enterprise-lead' }, delay: 0 }] },
    ],
    schedule: { startDate: '2026-03-01', endDate: '2026-06-30', timezone: 'Asia/Kolkata', sendTime: '10:00', budgetPacing: 'even' },
    leadCapture: { enabled: true, formFields: [{ name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' }, { name: 'email', type: 'email', label: 'Work Email', required: true, placeholder: 'john@company.com' }, { name: 'company', type: 'text', label: 'Company', required: true, placeholder: 'Company name' }, { name: 'phone', type: 'phone', label: 'Phone', required: false, placeholder: '+91 9876543210' }], crmIntegration: 'hubspot', autoTag: ['enterprise-lead', 'h1-2026'], assignToSdr: true },
    aiOptimizations: [
      { id: 'ai-01', type: 'timing', title: 'Optimize Send Time', description: 'Send emails at 10:30 AM IST on Tuesdays for 18% better open rates.', impact: 'medium', confidence: 92, potentialImprovement: 18, applied: false },
      { id: 'ai-02', type: 'audience', title: 'Expand Audience', description: 'Add CTOs from Series B startups for 24% more qualified leads.', impact: 'high', confidence: 87, potentialImprovement: 24, applied: false },
    ],
    createdAt: '2026-02-20', updatedAt: '2026-04-12',
  },
  {
    id: 'camp-02', name: 'Festive Season Brand Awareness — Holi', type: 'brand-awareness',
    channels: ['social', 'whatsapp', 'sms'], budget: 750000, spend: 720000,
    clicks: 125000, leads: 2100, conversions: 0, revenue: 0, roi: 0, status: 'completed',
    owner: 'Sneha Reddy', startDate: '2026-03-10', endDate: '2026-03-20',
    description: 'Holi-themed brand awareness campaign with Instagram Reels and WhatsApp festive greetings.',
    objective: { primaryGoal: 'awareness', targetMetric: 200000, targetMetricUnit: 'impressions', secondaryGoals: ['engagement'] },
    audience: { segmentId: 'seg-08', segmentName: 'WhatsApp-Opted-In — Festive', estimatedReach: 24560, excludeSegmentIds: [] },
    channelConfig: [
      { channel: 'social', enabled: true, content: { platform: 'instagram', postType: 'reel', caption: 'Holi hai! 🎨', hashtags: ['#HappyHoli', '#Holi2026', '#DigiNue'], mediaType: 'video' } },
      { channel: 'whatsapp', enabled: true, content: { templateId: 'tpl-holi', bodyText: 'Happy Holi from DigiNue! 🎨', mediaType: 'image', ctaText: 'Claim Holi Offer', quickReplies: ['Tell me more'] } },
      { channel: 'sms', enabled: true, content: { bodyText: 'DigiNue HOLI SALE! Flat 30% off. Code: HOLI30.', ctaText: 'Shop Now' } },
    ],
    offer: { type: 'discount', discountType: 'percentage', discountValue: 30, couponCode: 'HOLI30', expiryDate: '2026-03-20', usageLimit: 5000, autoApply: false },
    schedule: { startDate: '2026-03-10', endDate: '2026-03-20', timezone: 'Asia/Kolkata', sendTime: '09:00', budgetPacing: 'accelerated' },
    createdAt: '2026-03-01', updatedAt: '2026-03-20',
  },
  {
    id: 'camp-03', name: 'SaaS Free Trial Nurture Flow', type: 'nurturing',
    channels: ['email', 'whatsapp'], budget: 180000, spend: 124500,
    clicks: 8400, leads: 1680, conversions: 284, revenue: 8520000, roi: 456.2, status: 'active',
    owner: 'Arjun Mehta', startDate: '2026-03-15', endDate: '2026-05-31',
    description: '7-day drip campaign targeting free trial signups with personalised demos.',
    objective: { primaryGoal: 'conversions', targetMetric: 300, targetMetricUnit: 'paid conversions', secondaryGoals: ['activation'] },
    audience: { segmentId: 'seg-02', segmentName: 'High-Intent Free Trial Users', estimatedReach: 3245, excludeSegmentIds: [] },
    channelConfig: [
      { channel: 'email', enabled: true, content: { subject: 'Get the most from your free trial', bodyHtml: '<p>3 tips to maximize your trial...</p>', ctaText: 'Explore Features' } },
      { channel: 'whatsapp', enabled: true, content: { templateId: 'tpl-nurture', bodyText: 'Hey {{name}}! Here\'s tip #{{day}} for your DigiNue trial.', ctaText: 'Try Now', quickReplies: ['Book Demo', 'Need Help'] } },
    ],
    offer: { type: 'free-trial', autoApply: true },
    automations: [
      { id: 'auto-03', name: 'Trial Day 3 Follow-up', enabled: true, trigger: 'custom-event', conditions: [{ field: 'trial_day', operator: 'equals', value: '3' }], actions: [{ type: 'send-email', config: { template: 'trial-day-3' }, delay: 0 }, { type: 'send-whatsapp', config: { template: 'trial-tip-3' }, delay: 120 }] },
      { id: 'auto-04', name: 'Trial Expiry Reminder', enabled: true, trigger: 'custom-event', conditions: [{ field: 'trial_days_left', operator: 'equals', value: '2' }], actions: [{ type: 'send-whatsapp', config: { template: 'trial-expiring' }, delay: 0 }, { type: 'add-tag', config: { tag: 'trial-expiring' }, delay: 0 }] },
    ],
    schedule: { startDate: '2026-03-15', endDate: '2026-05-31', timezone: 'Asia/Kolkata', sendTime: '09:30', recurringType: 'daily', budgetPacing: 'even' },
    leadCapture: { enabled: false, formFields: [], crmIntegration: 'none', assignToSdr: false },
    createdAt: '2026-03-10', updatedAt: '2026-04-12',
  },
  {
    id: 'camp-04', name: 'Retargeting — Cart Abandonment Recovery', type: 'retention',
    channels: ['email', 'whatsapp', 'sms', 'ads'], budget: 350000, spend: 198000,
    clicks: 15600, leads: 3120, conversions: 936, revenue: 12864000, roi: 624.5, status: 'active',
    owner: 'Meera Patel', startDate: '2026-04-01', endDate: '2026-06-30',
    description: 'Automated retargeting across email, WhatsApp, and Google Ads for abandoned carts.',
    objective: { primaryGoal: 'revenue', targetMetric: 15000000, targetMetricUnit: 'revenue', secondaryGoals: ['retention'] },
    audience: { segmentId: 'seg-03', segmentName: 'Cart Abandoners — High Value', estimatedReach: 1876, excludeSegmentIds: ['seg-04'] },
    channelConfig: [
      { channel: 'email', enabled: true, content: { subject: 'You left something behind! 🛒', bodyHtml: '<p>Complete your purchase now...</p>', ctaText: 'Return to Cart' } },
      { channel: 'whatsapp', enabled: true, content: { templateId: 'tpl-cart', bodyText: 'Hey {{name}}! You left items in your cart 🛒', ctaText: 'Complete Purchase', quickReplies: ['Need help', 'Remove items'], mediaType: 'image' } },
      { channel: 'sms', enabled: true, content: { bodyText: 'Your cart is waiting! Complete purchase & get 10% off: {{link}}', ctaText: 'Shop Now' } },
      { channel: 'ads', enabled: true, content: { ctaText: 'Return to Cart', mediaType: 'image' } },
    ],
    offer: { type: 'discount', discountType: 'percentage', discountValue: 10, couponCode: 'CART10', expiryDate: '2026-06-30', usageLimit: 10000, perUserLimit: 1, autoApply: true },
    automations: [
      { id: 'auto-05', name: 'Cart Abandoned Flow', enabled: true, trigger: 'cart-abandoned', conditions: [{ field: 'cart_value', operator: 'greater-than', value: '5000' }], actions: [{ type: 'send-whatsapp', config: { template: 'cart-reminder' }, delay: 30 }, { type: 'send-email', config: { template: 'cart-email' }, delay: 240 }, { type: 'send-sms', config: { template: 'cart-sms' }, delay: 1440 }] },
    ],
    schedule: { startDate: '2026-04-01', endDate: '2026-06-30', timezone: 'Asia/Kolkata', sendTime: '10:00', budgetPacing: 'even' },
    createdAt: '2026-03-25', updatedAt: '2026-04-12',
  },
  {
    id: 'camp-05', name: 'LinkedIn B2B Thought Leadership', type: 'brand-awareness',
    channels: ['social', 'ads'], budget: 500000, spend: 345000,
    clicks: 28900, leads: 1445, conversions: 87, revenue: 6960000, roi: 124.6, status: 'active',
    owner: 'Vikram Joshi', startDate: '2026-03-20', endDate: '2026-07-31',
    description: 'CEO and leadership content syndication on LinkedIn targeting enterprise decision-makers.',
    objective: { primaryGoal: 'awareness', targetMetric: 500000, targetMetricUnit: 'impressions', secondaryGoals: ['leads'] },
    audience: { segmentId: 'seg-06', segmentName: 'Startup Founders & CTOs', estimatedReach: 4567, excludeSegmentIds: [] },
    channelConfig: [
      { channel: 'social', enabled: true, content: { platform: 'linkedin', postType: 'post', caption: 'How AI is transforming enterprise marketing in India...', hashtags: ['#AIMarketing', '#B2B', '#MarTech'], mediaType: 'carousel' } },
      { channel: 'ads', enabled: true, content: { ctaText: 'Read Full Report', mediaType: 'image' } },
    ],
    schedule: { startDate: '2026-03-20', endDate: '2026-07-31', timezone: 'Asia/Kolkata', sendTime: '11:00', recurringType: 'weekly', recurringDays: [2, 4], budgetPacing: 'even' },
    createdAt: '2026-03-15', updatedAt: '2026-04-10',
  },
  {
    id: 'camp-06', name: 'Summer Sale Push — E-Commerce', type: 'sales-push',
    channels: ['email', 'sms', 'whatsapp', 'social', 'ads'], budget: 1200000, spend: 890000,
    clicks: 67000, leads: 5360, conversions: 1608, revenue: 12864000, roi: 298.4, status: 'active',
    owner: 'Rahul Verma', startDate: '2026-04-15', endDate: '2026-05-31',
    description: 'Summer clearance campaign with flash sales, WhatsApp exclusive deals, and SMS alerts.',
    objective: { primaryGoal: 'revenue', targetMetric: 20000000, targetMetricUnit: 'revenue', secondaryGoals: ['conversions', 'awareness'] },
    audience: { segmentId: 'seg-05', segmentName: 'Tier-1 Cities — Premium Segment', estimatedReach: 12890, excludeSegmentIds: [] },
    channelConfig: [
      { channel: 'email', enabled: true, content: { subject: 'SUMMER SALE is LIVE! ☀️ Up to 40% off', bodyHtml: '<p>Exclusive deals inside...</p>', ctaText: 'Shop Now' } },
      { channel: 'whatsapp', enabled: true, content: { templateId: 'tpl-summer', bodyText: '☀️ FLASH SALE! 40% off on Annual Plans for next 4 hours!', ctaText: 'Grab Deal Now', quickReplies: ['Show plans', 'Remind later'], mediaType: 'video' } },
      { channel: 'sms', enabled: true, content: { bodyText: 'DigiNue SUMMER SALE! Flat 40% off. Code: SUMMER40.', ctaText: 'Shop Now' } },
      { channel: 'social', enabled: true, content: { platform: 'instagram', postType: 'reel', caption: 'SUMMER SALE IS HERE! ☀️', hashtags: ['#SummerSale', '#SaaS'], mediaType: 'video' } },
      { channel: 'ads', enabled: true, content: { ctaText: 'Shop Sale', mediaType: 'image' } },
    ],
    offer: { type: 'discount', discountType: 'percentage', discountValue: 40, couponCode: 'SUMMER40', expiryDate: '2026-05-31', usageLimit: 5000, segmentRestriction: ['seg-05'], autoApply: false },
    automations: [
      { id: 'auto-06', name: 'Flash Sale Alert', enabled: true, trigger: 'custom-event', conditions: [{ field: 'event', operator: 'equals', value: 'flash_sale_start' }], actions: [{ type: 'send-whatsapp', config: { template: 'flash-sale' }, delay: 0 }, { type: 'send-sms', config: { template: 'flash-sale-sms' }, delay: 5 }] },
    ],
    schedule: { startDate: '2026-04-15', endDate: '2026-05-31', timezone: 'Asia/Kolkata', sendTime: '08:00', budgetPacing: 'front-loaded', dailyBudgetCap: 50000 },
    createdAt: '2026-04-01', updatedAt: '2026-04-12',
  },
  {
    id: 'camp-07', name: 'Inactive User Reactivation Q1', type: 'reactivation',
    channels: ['email', 'whatsapp'], budget: 120000, spend: 87000,
    clicks: 4200, leads: 840, conversions: 168, revenue: 5040000, roi: 312.8, status: 'completed',
    owner: 'Ananya Das', startDate: '2026-03-05', endDate: '2026-03-31',
    description: 'Win-back campaign targeting users inactive for 90+ days with special offers.',
    objective: { primaryGoal: 'retention', targetMetric: 500, targetMetricUnit: 'reactivated users', secondaryGoals: ['revenue'] },
    audience: { segmentId: 'seg-04', segmentName: 'Dormant Users — 90+ Days', estimatedReach: 5634, excludeSegmentIds: [] },
    offer: { type: 'discount', discountType: 'percentage', discountValue: 20, couponCode: 'COMEBACK20', expiryDate: '2026-03-31', autoApply: true },
    createdAt: '2026-03-01', updatedAt: '2026-03-31',
  },
  {
    id: 'camp-08', name: 'Product Launch — AI Analytics Suite', type: 'product-launch',
    channels: ['email', 'landing-page', 'ads', 'social'], budget: 1800000, spend: 620000,
    clicks: 32400, leads: 2592, conversions: 194, revenue: 15520000, roi: 198.4, status: 'active',
    owner: 'Deepika Nair', startDate: '2026-04-10', endDate: '2026-07-31',
    description: 'Multi-channel launch campaign for the new AI Analytics Suite targeting data-driven enterprises.',
    objective: { primaryGoal: 'leads', targetMetric: 3000, targetMetricUnit: 'leads', secondaryGoals: ['conversions', 'awareness'] },
    audience: { segmentId: 'seg-01', segmentName: 'Enterprise Decision Makers', estimatedReach: 8420, excludeSegmentIds: [] },
    offer: { type: 'free-trial', autoApply: true },
    leadCapture: { enabled: true, formFields: [{ name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'Your name' }, { name: 'email', type: 'email', label: 'Work Email', required: true, placeholder: 'work@company.com' }, { name: 'company', type: 'text', label: 'Company', required: true, placeholder: 'Company' }, { name: 'use_case', type: 'select', label: 'Primary Use Case', required: false, options: ['Marketing Analytics', 'Sales Intelligence', 'Customer Insights', 'Other'] }], crmIntegration: 'hubspot', autoTag: ['ai-suite-launch', 'product-launch'], assignToSdr: true, welcomeAutomation: 'auto-welcome-ai-suite' },
    createdAt: '2026-04-01', updatedAt: '2026-04-12',
  },
  {
    id: 'camp-09', name: 'DiWali Dhamaka Early Bird Preview', type: 'sales-push',
    channels: ['email', 'whatsapp', 'sms'], budget: 200000, spend: 0,
    clicks: 0, leads: 0, conversions: 0, revenue: 0, roi: 0, status: 'draft',
    owner: 'Sneha Reddy', startDate: '2026-10-01', endDate: '2026-10-20',
    description: 'Early bird preview and pre-registration for Diwali mega sale event.',
    objective: { primaryGoal: 'revenue', targetMetric: 15000000, targetMetricUnit: 'revenue', secondaryGoals: ['awareness'] },
    createdAt: '2026-04-10', updatedAt: '2026-04-10',
  },
  {
    id: 'camp-10', name: 'Partnership Co-Marketing — Razorpay', type: 'lead-gen',
    channels: ['email', 'landing-page', 'social'], budget: 600000, spend: 600000,
    clicks: 18200, leads: 1092, conversions: 218, revenue: 8720000, roi: 265.3, status: 'completed',
    owner: 'Priya Sharma', startDate: '2026-03-01', endDate: '2026-04-15',
    description: 'Co-branded campaign with Razorpay targeting fintech startups and SMBs in India.',
    objective: { primaryGoal: 'leads', targetMetric: 1200, targetMetricUnit: 'leads', secondaryGoals: ['conversions'] },
    createdAt: '2026-02-25', updatedAt: '2026-04-15',
  },
];

// ---- 3. Audience Segments ----
export const mockSegments: AudienceSegment[] = [
  { id: 'seg-01', name: 'Enterprise Decision Makers', rules: [{ id: 'r1', field: 'company_size', operator: 'greater-than', value: '200' }, { id: 'r2', field: 'job_title', operator: 'in', value: 'VP,CTO,CFO,Director,Head' }, { id: 'r3', field: 'industry', operator: 'in', value: 'BFSI,SaaS,E-commerce,IT Services' }], operator: 'AND', audienceCount: 8420, growth: 12.4, syncedCampaigns: ['camp-01', 'camp-05'], createdDate: '2026-01-10', type: 'dynamic', lastSynced: '2026-04-12', tags: ['enterprise', 'b2b'] },
  { id: 'seg-02', name: 'High-Intent Free Trial Users', rules: [{ id: 'r4', field: 'trial_status', operator: 'equals', value: 'active' }, { id: 'r5', field: 'login_count_7d', operator: 'greater-than', value: '3' }], operator: 'AND', audienceCount: 3245, growth: 28.6, syncedCampaigns: ['camp-03'], createdDate: '2026-02-01', type: 'dynamic', lastSynced: '2026-04-12', tags: ['trial', 'high-intent'] },
  { id: 'seg-03', name: 'Cart Abandoners — High Value', rules: [{ id: 'r6', field: 'cart_value', operator: 'greater-than', value: '15000' }, { id: 'r7', field: 'cart_abandoned_days', operator: 'less-than', value: '7' }], operator: 'AND', audienceCount: 1876, growth: -5.2, syncedCampaigns: ['camp-04'], createdDate: '2026-02-15', type: 'dynamic', lastSynced: '2026-04-12', tags: ['cart', 'e-commerce'] },
  { id: 'seg-04', name: 'Dormant Users — 90+ Days', rules: [{ id: 'r8', field: 'last_active', operator: 'less-than', value: '90' }], operator: 'AND', audienceCount: 5634, growth: -12.8, syncedCampaigns: ['camp-07'], createdDate: '2026-01-05', type: 'dynamic', lastSynced: '2026-04-11', tags: ['dormant', 'win-back'] },
  { id: 'seg-05', name: 'Tier-1 Cities — Premium Segment', rules: [{ id: 'r9', field: 'city', operator: 'in', value: 'Mumbai,Delhi,Bangalore,Hyderabad,Chennai,Pune' }, { id: 'r10', field: 'income_bracket', operator: 'in', value: 'premium,ultra-premium' }], operator: 'AND', audienceCount: 12890, growth: 18.3, syncedCampaigns: ['camp-06'], createdDate: '2026-01-20', type: 'dynamic', lastSynced: '2026-04-12', tags: ['premium', 'tier-1'] },
  { id: 'seg-06', name: 'Startup Founders & CTOs', rules: [{ id: 'r11', field: 'job_title', operator: 'in', value: 'Founder,CTO,Co-Founder,CEO' }, { id: 'r12', field: 'funding_stage', operator: 'in', value: 'Seed,Series A,Series B' }], operator: 'AND', audienceCount: 4567, growth: 34.1, syncedCampaigns: ['camp-05', 'camp-08'], createdDate: '2026-02-10', type: 'dynamic', lastSynced: '2026-04-12', tags: ['startup', 'founder'] },
  { id: 'seg-07', name: 'Repeat Purchasers — Loyalty Eligible', rules: [{ id: 'r13', field: 'total_purchases', operator: 'greater-than', value: '5' }, { id: 'r14', field: 'lifetime_value', operator: 'greater-than', value: '50000' }], operator: 'AND', audienceCount: 2890, growth: 8.7, syncedCampaigns: ['camp-06'], createdDate: '2026-03-01', type: 'dynamic', lastSynced: '2026-04-12', tags: ['loyalty', 'repeat'] },
  { id: 'seg-08', name: 'WhatsApp-Opted-In — Festive', rules: [{ id: 'r15', field: 'whatsapp_opt_in', operator: 'equals', value: 'true' }, { id: 'r16', field: 'interest_tags', operator: 'contains', value: 'festive' }], operator: 'AND', audienceCount: 24560, growth: 42.5, syncedCampaigns: ['camp-02', 'camp-06'], createdDate: '2026-02-28', type: 'dynamic', lastSynced: '2026-04-12', tags: ['whatsapp', 'festive'] },
];

// ---- 4. Captured Leads ----
export const mockCapturedLeads: CapturedLead[] = [
  { id: 'lead-01', campaignId: 'camp-01', name: 'Rajesh Kumar', email: 'rajesh@techcorp.in', phone: '+91 98765 43210', company: 'TechCorp India', source: 'landing-page', status: 'qualified', score: 82, capturedAt: '2026-04-10T14:30:00', tags: ['enterprise-lead', 'bfsi'] },
  { id: 'lead-02', campaignId: 'camp-01', name: 'Anita Deshmukh', email: 'anita@saasplatform.com', phone: '+91 87654 32109', company: 'SaaS Platform Co', source: 'whatsapp', status: 'contacted', score: 75, capturedAt: '2026-04-10T16:45:00', tags: ['enterprise-lead', 'saas'] },
  { id: 'lead-03', campaignId: 'camp-08', name: 'Vivek Sharma', email: 'vivek@dataworks.in', phone: '+91 76543 21098', company: 'DataWorks Analytics', source: 'email', status: 'new', score: 68, capturedAt: '2026-04-11T09:00:00', tags: ['ai-suite-launch'] },
  { id: 'lead-04', campaignId: 'camp-06', name: 'Nisha Patel', email: 'nisha@ecomhub.in', source: 'social', status: 'converted', score: 95, capturedAt: '2026-04-11T11:20:00', tags: ['summer-sale', 'premium'] },
  { id: 'lead-05', campaignId: 'camp-03', name: 'Karthik R', email: 'karthik@startup.io', source: 'landing-page', status: 'qualified', score: 71, capturedAt: '2026-04-12T08:30:00', tags: ['trial', 'high-intent'] },
];

// ---- 5. Retention Metrics ----
export const mockRetentionMetrics: RetentionMetrics = {
  churnRate: 8.4,
  repeatPurchaseRate: 62.3,
  inactiveUsers: 5634,
  renewalAlerts: 89,
  avgLifetimeValue: 72400,
  cohortData: [
    { month: 'Nov 2025', rate: 92.1 },
    { month: 'Dec 2025', rate: 88.5 },
    { month: 'Jan 2026', rate: 84.2 },
    { month: 'Feb 2026', rate: 81.6 },
    { month: 'Mar 2026', rate: 79.3 },
    { month: 'Apr 2026', rate: 78.4 },
  ],
};

// ---- 6. Loyalty Members ----
export const mockLoyaltyMembers: LoyaltyMember[] = [
  { id: 'lm-01', name: 'Aarav Gupta', email: 'aarav@techsolutions.in', points: 48500, tier: 'diamond', couponsRedeemed: 18, totalSpent: 485000, joinDate: '2024-06-15' },
  { id: 'lm-02', name: 'Priyanka Iyer', email: 'priyanka@startupxyz.com', points: 32400, tier: 'platinum', couponsRedeemed: 12, totalSpent: 324000, joinDate: '2024-09-01' },
  { id: 'lm-03', name: 'Rohan Patel', email: 'rohan@retailpro.in', points: 28700, tier: 'platinum', couponsRedeemed: 10, totalSpent: 287000, joinDate: '2024-10-20' },
  { id: 'lm-04', name: 'Kavitha Nair', email: 'kavitha@medicare.in', points: 18200, tier: 'gold', couponsRedeemed: 7, totalSpent: 182000, joinDate: '2025-01-10' },
  { id: 'lm-05', name: 'Siddharth Mehta', email: 'siddharth@finedge.com', points: 14500, tier: 'gold', couponsRedeemed: 5, totalSpent: 145000, joinDate: '2025-03-15' },
  { id: 'lm-06', name: 'Anisha Sharma', email: 'anisha@ecomhub.in', points: 11200, tier: 'gold', couponsRedeemed: 4, totalSpent: 112000, joinDate: '2025-05-01' },
  { id: 'lm-07', name: 'Vikash Kumar', email: 'vikash@logisticspro.in', points: 7800, tier: 'silver', couponsRedeemed: 3, totalSpent: 78000, joinDate: '2025-07-20' },
  { id: 'lm-08', name: 'Neha Singh', email: 'neha@designlab.co', points: 5400, tier: 'silver', couponsRedeemed: 2, totalSpent: 54000, joinDate: '2025-09-10' },
  { id: 'lm-09', name: 'Arjun Reddy', email: 'arjun@saasforge.in', points: 2800, tier: 'bronze', couponsRedeemed: 1, totalSpent: 28000, joinDate: '2026-01-05' },
  { id: 'lm-10', name: 'Meena Krishnan', email: 'meena@edtechstart.in', points: 1200, tier: 'bronze', couponsRedeemed: 0, totalSpent: 12000, joinDate: '2026-03-20' },
];

// ---- 7. Coupons ----
export const mockCoupons: Coupon[] = [
  { id: 'cpn-01', code: 'SUMMER40', discount: '40%', type: 'percentage', expiry: '2026-05-31', status: 'active', usageCount: 1847, maxUsage: 5000 },
  { id: 'cpn-02', code: 'WELCOME500', discount: '₹500', type: 'flat', expiry: '2026-12-31', status: 'active', usageCount: 4521, maxUsage: 10000 },
  { id: 'cpn-03', code: 'FREESHIP', discount: 'Free Shipping', type: 'free-shipping', expiry: '2026-06-30', status: 'active', usageCount: 2890, maxUsage: 8000 },
  { id: 'cpn-04', code: 'CART10', discount: '10%', type: 'percentage', expiry: '2026-06-30', status: 'active', usageCount: 3240, maxUsage: 10000 },
  { id: 'cpn-05', code: 'REFERRAL1000', discount: '₹1,000', type: 'flat', expiry: '2026-12-31', status: 'active', usageCount: 1245, maxUsage: 5000 },
  { id: 'cpn-06', code: 'HOLI20', discount: '20%', type: 'percentage', expiry: '2026-03-20', status: 'expired', usageCount: 3100, maxUsage: 5000 },
];

// ---- 8. Referrals ----
export const mockReferrals: ReferralEntry[] = [
  { id: 'ref-01', name: 'Aarav Gupta', email: 'aarav@techsolutions.in', referralCode: 'AARAV2024', totalReferrals: 47, conversions: 31, earnings: 31000, rank: 1 },
  { id: 'ref-02', name: 'Priyanka Iyer', email: 'priyanka@startupxyz.com', referralCode: 'PRIYA24X', totalReferrals: 38, conversions: 24, earnings: 24000, rank: 2 },
  { id: 'ref-03', name: 'Rohan Patel', email: 'rohan@retailpro.in', referralCode: 'ROHAN-RP', totalReferrals: 32, conversions: 22, earnings: 22000, rank: 3 },
  { id: 'ref-04', name: 'Kavitha Nair', email: 'kavitha@medicare.in', referralCode: 'KAV2025', totalReferrals: 28, conversions: 18, earnings: 18000, rank: 4 },
  { id: 'ref-05', name: 'Siddharth Mehta', email: 'siddharth@finedge.com', referralCode: 'SID-M', totalReferrals: 24, conversions: 15, earnings: 15000, rank: 5 },
];

// ---- 9. Attribution ----
export const mockAttributionChannels: AttributionChannel[] = [
  { channel: 'Google Ads', revenue: 4860000, contribution: 32.5, conversions: 1684, color: '#ea4335' },
  { channel: 'WhatsApp', revenue: 3705600, contribution: 24.8, conversions: 1284, color: '#25d366' },
  { channel: 'Email', revenue: 2721840, contribution: 18.2, conversions: 941, color: '#f59e0b' },
  { channel: 'LinkedIn', revenue: 1808280, contribution: 12.1, conversions: 625, color: '#0a66c2' },
  { channel: 'Social Media', revenue: 1253880, contribution: 8.4, conversions: 434, color: '#8b5cf6' },
  { channel: 'Referral', revenue: 596640, contribution: 4.0, conversions: 206, color: '#10b981' },
];

// ---- 10. Funnels ----
export const mockFunnels: Funnel[] = [
  { id: 'fn-01', name: 'Enterprise Lead Funnel', steps: [{ id: 'fs1', name: 'Ad Click', visitors: 48200, conversions: 48200, dropOff: 0, revenue: 0 }, { id: 'fs2', name: 'Landing Page', visitors: 48200, conversions: 28920, dropOff: 40.0, revenue: 0 }, { id: 'fs3', name: 'Form Submission', visitors: 28920, conversions: 5784, dropOff: 80.0, revenue: 0 }, { id: 'fs4', name: 'WhatsApp Conversation', visitors: 5784, conversions: 2024, dropOff: 65.0, revenue: 0 }, { id: 'fs5', name: 'Demo Booked (SQL)', visitors: 2024, conversions: 612, dropOff: 69.8, revenue: 24600000 }], totalRevenue: 24600000, conversionRate: 1.27 },
  { id: 'fn-02', name: 'E-Commerce Purchase Funnel', steps: [{ id: 'fs6', name: 'Ad Click', visitors: 67000, conversions: 67000, dropOff: 0, revenue: 0 }, { id: 'fs7', name: 'Product Page', visitors: 67000, conversions: 46900, dropOff: 30.0, revenue: 0 }, { id: 'fs8', name: 'Add to Cart', visitors: 46900, conversions: 11725, dropOff: 75.0, revenue: 0 }, { id: 'fs9', name: 'Checkout Started', visitors: 11725, conversions: 7035, dropOff: 40.0, revenue: 0 }, { id: 'fs10', name: 'Purchase Complete', visitors: 7035, conversions: 1608, dropOff: 77.1, revenue: 12864000 }], totalRevenue: 12864000, conversionRate: 2.4 },
  { id: 'fn-03', name: 'Free Trial to Paid Conversion', steps: [{ id: 'fs11', name: 'Trial Signup', visitors: 8400, conversions: 8400, dropOff: 0, revenue: 0 }, { id: 'fs12', name: 'Product Activation', visitors: 8400, conversions: 5880, dropOff: 30.0, revenue: 0 }, { id: 'fs13', name: 'Key Feature Used', visitors: 5880, conversions: 3234, dropOff: 45.0, revenue: 0 }, { id: 'fs14', name: 'Paid Conversion', visitors: 3234, conversions: 284, dropOff: 91.2, revenue: 8520000 }], totalRevenue: 8520000, conversionRate: 3.38 },
];

// ---- 11. A/B Tests ----
export const mockABTests: ABTest[] = [
  { id: 'ab-01', name: 'Hero CTA — "Start Free Trial" vs "Get Started in 2 Mins"', type: 'cta', status: 'completed', variants: [{ id: 'v1', name: 'Control — Start Free Trial', impressions: 12400, conversions: 496, conversionRate: 4.0, isWinner: false }, { id: 'v2', name: 'Variant — Get Started in 2 Mins', impressions: 12300, conversions: 615, conversionRate: 5.0, isWinner: true }], winner: 'v2', startDate: '2026-03-10', endDate: '2026-03-24', confidence: 97.2, improvement: 25.0 },
  { id: 'ab-02', name: 'Email Subject — Emoji vs No Emoji', type: 'subject-line', status: 'completed', variants: [{ id: 'v3', name: 'Control — No Emoji', impressions: 9200, conversions: 3312, conversionRate: 36.0, isWinner: false }, { id: 'v4', name: 'Variant — With Emoji', impressions: 9100, conversions: 4004, conversionRate: 44.0, isWinner: true }], winner: 'v4', startDate: '2026-03-15', endDate: '2026-03-22', confidence: 99.1, improvement: 22.2 },
  { id: 'ab-04', name: 'Ad Creative — Static Image vs Video', type: 'creative', status: 'running', variants: [{ id: 'v7', name: 'Control — Static Product Image', impressions: 18000, conversions: 540, conversionRate: 3.0, isWinner: false }, { id: 'v8', name: 'Variant — 15s Product Demo Video', impressions: 17900, conversions: 716, conversionRate: 4.0, isWinner: true }], winner: null, startDate: '2026-04-01', endDate: '2026-04-15', confidence: 94.5, improvement: 32.6 },
];

// ---- 12. Ad Campaigns ----
export const mockAdCampaigns: AdCampaign[] = [
  { id: 'ad-01', name: 'Google Search — SaaS Keywords', platform: 'google', status: 'active', spend: 580000, clicks: 24600, impressions: 420000, cpc: 23.57, cpl: 680, roas: 5.2, conversions: 853, creative: 'Search ad — "Best Marketing Automation Software India"' },
  { id: 'ad-02', name: 'Meta — Retargeting Carousel', platform: 'meta', status: 'active', spend: 320000, clicks: 18400, impressions: 380000, cpc: 17.39, cpl: 520, roas: 4.8, conversions: 615, creative: 'Carousel ad showing product features' },
  { id: 'ad-03', name: 'LinkedIn — Lead Gen Forms', platform: 'linkedin', status: 'active', spend: 450000, clicks: 8900, impressions: 198000, cpc: 50.56, cpl: 1420, roas: 3.1, conversions: 317, creative: 'Sponsored content — AI marketing' },
  { id: 'ad-04', name: 'YouTube — Product Demo Pre-roll', platform: 'youtube', status: 'active', spend: 280000, clicks: 6200, impressions: 520000, cpc: 45.16, cpl: 890, roas: 3.6, conversions: 315, creative: '15-second pre-roll video walkthrough' },
  { id: 'ad-05', name: 'TikTok — Branded Hashtag Challenge', platform: 'tiktok', status: 'active', spend: 150000, clicks: 12400, impressions: 890000, cpc: 12.10, cpl: 310, roas: 6.4, conversions: 484, creative: '#DigiNueChallenge — "Show us your marketing hack"' },
];

// ---- 13. Content Requests ----
export const mockContentRequests: ContentRequest[] = [
  { id: 'cr-01', title: 'Summer Sale Email Banner', type: 'email', status: 'in-progress', requester: 'Rahul Verma', assignee: 'Design Team', campaignId: 'camp-06', campaignName: 'Summer Sale Push', dueDate: '2026-04-14', priority: 'high', description: 'Hero banner for summer sale email campaign. Need vibrant summer-themed design with 40% off callout.', comments: [{ id: 'cm-01', author: 'Rahul Verma', content: 'Please use the orange brand gradient for the banner background.', timestamp: '2026-04-11T10:30:00' }], version: 2, createdAt: '2026-04-10', updatedAt: '2026-04-12' },
  { id: 'cr-02', title: 'AI Suite Launch Social Carousel', type: 'social-post', status: 'in-review', requester: 'Deepika Nair', assignee: 'Content Team', campaignId: 'camp-08', campaignName: 'Product Launch — AI Analytics Suite', dueDate: '2026-04-16', priority: 'high', description: '5-slide LinkedIn carousel for AI Analytics Suite launch. Focus on key differentiators and Indian market fit.', comments: [{ id: 'cm-02', author: 'Deepika Nair', content: 'Slide 3 needs more emphasis on the ML capabilities.', timestamp: '2026-04-12T09:00:00' }, { id: 'cm-03', author: 'Content Team', content: 'Updated slide 3 with ML model details. Ready for re-review.', timestamp: '2026-04-12T14:00:00' }], version: 3, createdAt: '2026-04-08', updatedAt: '2026-04-12' },
  { id: 'cr-03', title: 'Cart Recovery WhatsApp Template', type: 'whatsapp-template', status: 'approved', requester: 'Meera Patel', assignee: 'Copy Team', campaignId: 'camp-04', campaignName: 'Cart Abandonment Recovery', dueDate: '2026-04-05', priority: 'medium', description: 'WhatsApp message template for cart abandonment recovery flow. Include product image placeholder and CTA.', comments: [], version: 1, createdAt: '2026-04-02', updatedAt: '2026-04-05' },
  { id: 'cr-04', title: 'LinkedIn Thought Leadership Video', type: 'video', status: 'requested', requester: 'Vikram Joshi', assignee: 'Video Team', campaignId: 'camp-05', campaignName: 'LinkedIn B2B Thought Leadership', dueDate: '2026-04-25', priority: 'medium', description: '2-minute thought leadership video featuring CEO discussing AI in Indian marketing. For LinkedIn organic.', comments: [], version: 1, createdAt: '2026-04-12', updatedAt: '2026-04-12' },
  { id: 'cr-05', title: 'Landing Page — AI Suite Demo', type: 'landing-page', status: 'in-progress', requester: 'Deepika Nair', assignee: 'Web Team', campaignId: 'camp-08', campaignName: 'Product Launch — AI Analytics Suite', dueDate: '2026-04-18', priority: 'critical', description: 'High-converting landing page for AI Analytics Suite demo requests. Include product screenshots and testimonials.', comments: [{ id: 'cm-04', author: 'Web Team', content: 'Wireframe approved, building the page now.', timestamp: '2026-04-11T16:00:00' }], version: 2, createdAt: '2026-04-09', updatedAt: '2026-04-11' },
  { id: 'cr-06', title: 'Blog Post — Marketing Automation Trends', type: 'blog', status: 'draft', requester: 'Sneha Reddy', assignee: 'Content Team', dueDate: '2026-04-22', priority: 'low', description: 'Long-form blog post on 2026 marketing automation trends for Indian SaaS companies. 2000+ words.', comments: [], version: 1, createdAt: '2026-04-12', updatedAt: '2026-04-12' },
];

// ---- 14. Service Requests ----
export const mockServiceRequests: ServiceRequest[] = [
  { id: 'sr-01', title: 'Product Photography — AI Suite', type: 'photography', status: 'in-progress', requester: 'Deepika Nair', vendor: 'PixelPerfect Studios', campaignId: 'camp-08', budget: 75000, dueDate: '2026-04-18', description: 'Professional product screenshots and mockup photography for AI Analytics Suite marketing materials.', deliverables: ['10 product mockups', '5 hero images', '3 device frames'], createdAt: '2026-04-08' },
  { id: 'sr-02', title: 'Explainer Video — Summer Sale', type: 'video-production', status: 'accepted', requester: 'Rahul Verma', vendor: 'MotionCraft Video', campaignId: 'camp-06', budget: 150000, dueDate: '2026-04-20', description: '30-second animated explainer video for summer sale campaign.', deliverables: ['30s video (16:9)', '30s video (9:16)', 'Thumbnail image'], createdAt: '2026-04-10' },
  { id: 'sr-03', title: 'Brand Design — Festival Assets', type: 'branding', status: 'requested', requester: 'Sneha Reddy', vendor: 'BrandForge Agency', budget: 200000, dueDate: '2026-09-15', description: 'Complete festival branding package for Diwali and Christmas campaigns.', deliverables: ['Logo variations', 'Social media kit', 'Email templates', 'Landing page design'], createdAt: '2026-04-12' },
];

// ---- 15. Post-Publish Metrics ----
export const mockPostPublishMetrics: PostPublishMetrics[] = [
  { id: 'ppm-01', contentId: 'sp-01', contentTitle: 'AI Analytics Suite Announcement', contentType: 'linkedin-post', publishedAt: '2026-04-10T10:00:00', impressions: 48200, clicks: 1245, ctr: 2.58, conversions: 12, revenue: 960000, engagement: 6.8 },
  { id: 'ppm-02', contentId: 'sp-04', contentTitle: 'Summer Sale Launch Post', contentType: 'instagram-reel', publishedAt: '2026-04-10T08:00:00', impressions: 186000, clicks: 6230, ctr: 3.35, conversions: 89, revenue: 712000, engagement: 8.2 },
  { id: 'ppm-03', contentId: 'em-01', contentTitle: 'March Product Update Digest', contentType: 'email', publishedAt: '2026-03-28T10:00:00', impressions: 18400, clicks: 1140, ctr: 6.2, conversions: 34, revenue: 272000, engagement: 10.5 },
  { id: 'ppm-04', contentId: 'sp-02', contentTitle: 'Holi Festive Post', contentType: 'instagram-reel', publishedAt: '2026-03-14T09:00:00', impressions: 124000, clicks: 4580, ctr: 3.69, conversions: 45, revenue: 360000, engagement: 9.1 },
  { id: 'ppm-05', contentId: 'em-04', contentTitle: 'Summer Sale Early Access Email', contentType: 'email', publishedAt: '2026-04-10T08:00:00', impressions: 24800, clicks: 1884, ctr: 7.6, conversions: 142, revenue: 1136000, engagement: 11.3 },
];

// ---- 16. AI Growth Insights ----
export const mockAIGrowthInsights: AIGrowthInsight[] = [
  { id: 'ai-01', type: 'opportunity', title: 'WhatsApp Commerce Revenue Gap', description: 'Your WhatsApp channel has 24.8% contribution but only 40% of opted-in users receive purchase nudes. Enabling WhatsApp Commerce flows could unlock ₹12L additional monthly revenue.', confidence: 94, impact: 'critical', recommendation: 'Enable WhatsApp Commerce checkout flow for all opted-in segments. Estimated 45% lift in WhatsApp-driven conversions.', potentialROI: 1200000 },
  { id: 'ai-02', type: 'optimization', title: 'Email Send Time Optimization', description: 'Analysis of 12,400 email opens shows 10:30 AM IST on Tuesdays yields 18% higher open rates vs current 9:00 AM schedule.', confidence: 92, impact: 'medium', recommendation: 'Shift all nurture and promotional email send times to 10:30 AM IST Tuesdays and Thursdays.', potentialROI: 380000 },
  { id: 'ai-03', type: 'risk', title: 'Rising Churn in SMB Segment', description: 'SMB customers (< 50 employees) show 12.8% monthly churn vs 5.2% for enterprise. 89 accounts at risk of renewal failure this quarter.', confidence: 89, impact: 'high', recommendation: 'Launch dedicated SMB retention campaign with personalised onboarding and quarterly business reviews.', potentialROI: 890000 },
  { id: 'ai-04', type: 'opportunity', title: 'Underutilized TikTok Channel', description: 'TikTok ads show 6.4x ROAS but only 8% of ad budget allocated. Reallocating 15% more budget could generate ₹24L incremental revenue.', confidence: 86, impact: 'high', recommendation: 'Increase TikTok ad budget from ₹1.5L to ₹3L/month and test 5 new creative formats.', potentialROI: 2400000 },
  { id: 'ai-05', type: 'optimization', title: 'Lead Scoring Threshold Adjustment', description: 'Current MQL threshold of 50 is too low — 34% of MQLs never respond to SDR outreach. Raising to 70 would improve SDR efficiency by 28%.', confidence: 91, impact: 'medium', recommendation: 'Adjust lead scoring model: raise MQL threshold to 70 and add website engagement weight.', potentialROI: 560000 },
];

// ---- 17. Workflows (kept for automation builder) ----
export const mockWorkflows: Workflow[] = [
  { id: 'wf-01', name: 'New Lead Welcome Sequence', status: 'active', nodes: [{ id: 'n1', type: 'trigger', title: 'Lead Created', description: 'When a new lead is added to CRM', x: 100, y: 200 }, { id: 'n2', type: 'delay', title: 'Wait 2 Minutes', description: 'Give lead time to explore', x: 300, y: 200 }, { id: 'n3', type: 'send-whatsapp', title: 'WhatsApp Greeting', description: 'Send welcome message', x: 500, y: 200 }, { id: 'n4', type: 'send-email', title: 'Welcome Email', description: 'Send product overview email', x: 700, y: 200 }], triggers: 2456, conversions: 892, lastRun: '2026-04-12T14:30:00', createdAt: '2026-01-15' },
  { id: 'wf-02', name: 'Cart Abandonment Recovery', status: 'active', nodes: [{ id: 'n10', type: 'trigger', title: 'Cart Abandoned', description: 'Cart left without checkout for 30 mins', x: 100, y: 200 }, { id: 'n11', type: 'send-whatsapp', title: 'WhatsApp Reminder', description: 'Send cart reminder', x: 300, y: 200 }, { id: 'n12', type: 'send-sms', title: 'SMS with 10% Off', description: 'SMS with discount code', x: 500, y: 200 }], triggers: 5340, conversions: 2136, lastRun: '2026-04-12T16:45:00', createdAt: '2026-02-01' },
];

// ---- Legacy (kept for compatibility) ----
export const mockEmailCampaigns: EmailCampaign[] = [
  { id: 'em-01', name: 'March Product Update Digest', subjectLine: 'What\'s New in DigiNue — March 2026', previewText: 'AI Analytics Suite, WhatsApp Commerce, and more...', status: 'sent', openRate: 38.5, clickRate: 6.2, replyRate: 2.1, spamScore: 0.02, listSize: 18400, sentDate: '2026-03-28T10:00:00', fromName: 'DigiNue', replyTo: 'noreply@diginue.com' },
  { id: 'em-02', name: 'Free Trial Day-3 Engagement', subjectLine: '3 tips to get the most from your free trial', previewText: 'Unlock premium features during your trial...', status: 'sent', openRate: 45.2, clickRate: 8.4, replyRate: 1.8, spamScore: 0.01, listSize: 5600, sentDate: '2026-04-02T09:00:00', fromName: 'DigiNue', replyTo: 'noreply@diginue.com' },
];

export const mockWhatsAppCampaigns: WhatsAppCampaign[] = [
  { id: 'wa-01', name: 'Holi Festive Greeting', template: 'Happy Holi from DigiNue!', status: 'sent', mediaType: 'image', sent: 45200, delivered: 43840, read: 28496, replied: 3420, ctaText: 'Claim Holi Offer', quickReplies: ['Tell me more'], sentDate: '2026-03-14' },
];

export const mockSMSCampaigns: SMSCampaign[] = [
  { id: 'sms-01', name: 'Summer Sale Flash SMS', type: 'promotional', status: 'sent', templatePreview: 'DigiNue SUMMER SALE! Flat 40% off.', sent: 32000, delivered: 31488, failed: 512, ctr: 5.8, sentDate: '2026-04-10' },
];

export const mockSocialPosts: SocialPost[] = [
  { id: 'sp-01', platform: 'linkedin', caption: 'Announcing DigiNue AI Analytics Suite', mediaType: 'video', scheduledDate: '2026-04-10', scheduledTime: '10:00', status: 'published', hashtags: ['#AI', '#MarTech'], likes: 1245, comments: 89, shares: 234, reach: 48200 },
  { id: 'sp-02', platform: 'instagram', caption: 'Holi hai! 🎨', mediaType: 'reel', scheduledDate: '2026-03-14', scheduledTime: '09:00', status: 'published', hashtags: ['#HappyHoli'], likes: 4580, comments: 312, shares: 678, reach: 124000 },
];
