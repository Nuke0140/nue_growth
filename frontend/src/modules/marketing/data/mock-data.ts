// ============================================
// Marketing Mock Data — Enterprise-Grade
// ============================================
import type {
  Campaign, Workflow, AudienceSegment, EmailCampaign,
  WhatsAppCampaign, SMSCampaign, SocialPost, AdCampaign,
  AttributionChannel, Funnel, ABTest, RetentionMetrics,
  LoyaltyMember, Coupon, ReferralEntry, ContentItem,
  AIGrowthInsight, MarketingDashboardStats,
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
  channelContribution: [
    { channel: 'Google Ads', percent: 32.5 },
    { channel: 'WhatsApp', percent: 24.8 },
    { channel: 'Email', percent: 18.2 },
    { channel: 'LinkedIn', percent: 12.1 },
    { channel: 'Social Media', percent: 8.4 },
    { channel: 'Referral', percent: 4.0 },
  ],
};

// ---- 2. Campaigns ----
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-01', name: 'H1 2026 Enterprise Lead Gen Blitz', type: 'lead-generation',
    channels: ['email', 'whatsapp', 'ads'], budget: 2500000, spend: 1875000,
    clicks: 48200, leads: 3856, conversions: 612, roi: 342.8, status: 'active',
    owner: 'Priya Sharma', startDate: '2026-03-01', endDate: '2026-06-30',
    description: 'Multi-channel enterprise lead generation targeting BFSI and SaaS verticals across India.',
  },
  {
    id: 'camp-02', name: 'Festive Season Brand Awareness — Holi', type: 'brand-awareness',
    channels: ['social', 'whatsapp', 'sms'], budget: 750000, spend: 720000,
    clicks: 125000, leads: 2100, conversions: 0, roi: 0, status: 'completed',
    owner: 'Sneha Reddy', startDate: '2026-03-10', endDate: '2026-03-20',
    description: 'Holi-themed brand awareness campaign with Instagram Reels and WhatsApp festive greetings.',
  },
  {
    id: 'camp-03', name: 'SaaS Free Trial Nurture Flow', type: 'nurturing',
    channels: ['email', 'whatsapp'], budget: 180000, spend: 124500,
    clicks: 8400, leads: 1680, conversions: 284, roi: 456.2, status: 'active',
    owner: 'Arjun Mehta', startDate: '2026-03-15', endDate: '2026-05-31',
    description: '7-day drip campaign targeting free trial signups with personalised demos.',
  },
  {
    id: 'camp-04', name: 'Retargeting — Cart Abandonment Recovery', type: 'retention',
    channels: ['email', 'whatsapp', 'sms', 'ads'], budget: 350000, spend: 198000,
    clicks: 15600, leads: 3120, conversions: 936, roi: 624.5, status: 'active',
    owner: 'Meera Patel', startDate: '2026-04-01', endDate: '2026-06-30',
    description: 'Automated retargeting across email, WhatsApp, and Google Ads for abandoned carts.',
  },
  {
    id: 'camp-05', name: 'LinkedIn B2B Thought Leadership', type: 'brand-awareness',
    channels: ['social', 'ads'], budget: 500000, spend: 345000,
    clicks: 28900, leads: 1445, conversions: 87, roi: 124.6, status: 'active',
    owner: 'Vikram Joshi', startDate: '2026-03-20', endDate: '2026-07-31',
    description: 'CEO and leadership content syndication on LinkedIn targeting enterprise decision-makers.',
  },
  {
    id: 'camp-06', name: 'Summer Sale Push — E-Commerce', type: 'sales-push',
    channels: ['email', 'sms', 'whatsapp', 'social', 'ads'], budget: 1200000, spend: 890000,
    clicks: 67000, leads: 5360, conversions: 1608, roi: 298.4, status: 'active',
    owner: 'Rahul Verma', startDate: '2026-04-15', endDate: '2026-05-31',
    description: 'Summer clearance campaign with flash sales, WhatsApp exclusive deals, and SMS alerts.',
  },
  {
    id: 'camp-07', name: 'Inactive User Reactivation Q1', type: 'reactivation',
    channels: ['email', 'whatsapp'], budget: 120000, spend: 87000,
    clicks: 4200, leads: 840, conversions: 168, roi: 312.8, status: 'completed',
    owner: 'Ananya Das', startDate: '2026-03-05', endDate: '2026-03-31',
    description: 'Win-back campaign targeting users inactive for 90+ days with special offers.',
  },
  {
    id: 'camp-08', name: 'Product Launch — AI Analytics Suite', type: 'lead-generation',
    channels: ['email', 'landing-page', 'ads', 'social'], budget: 1800000, spend: 620000,
    clicks: 32400, leads: 2592, conversions: 194, roi: 198.4, status: 'active',
    owner: 'Deepika Nair', startDate: '2026-04-10', endDate: '2026-07-31',
    description: 'Multi-channel launch campaign for the new AI Analytics Suite targeting data-driven enterprises.',
  },
  {
    id: 'camp-09', name: 'DiWali Dhamaka Early Bird Preview', type: 'sales-push',
    channels: ['email', 'whatsapp', 'sms'], budget: 200000, spend: 0,
    clicks: 0, leads: 0, conversions: 0, roi: 0, status: 'draft',
    owner: 'Sneha Reddy', startDate: '2026-10-01', endDate: '2026-10-20',
    description: 'Early bird preview and pre-registration for Diwali mega sale event.',
  },
  {
    id: 'camp-10', name: 'Partnership Co-Marketing — Razorpay', type: 'lead-generation',
    channels: ['email', 'landing-page', 'social'], budget: 600000, spend: 600000,
    clicks: 18200, leads: 1092, conversions: 218, roi: 265.3, status: 'completed',
    owner: 'Priya Sharma', startDate: '2026-03-01', endDate: '2026-04-15',
    description: 'Co-branded campaign with Razorpay targeting fintech startups and SMBs in India.',
  },
];

// ---- 3. Workflows ----
export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-01', name: 'New Lead Welcome Sequence', status: 'active',
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Lead Created', description: 'When a new lead is added to CRM', x: 100, y: 200 },
      { id: 'n2', type: 'delay', title: 'Wait 2 Minutes', description: 'Give lead time to explore website', x: 300, y: 200 },
      { id: 'n3', type: 'send-whatsapp', title: 'WhatsApp Greeting', description: 'Send welcome message with company intro', x: 500, y: 200 },
      { id: 'n4', type: 'delay', title: 'Wait 24 Hours', description: 'Allow lead to engage with content', x: 700, y: 200 },
      { id: 'n5', type: 'send-email', title: 'Welcome Email', description: 'Send detailed product overview email', x: 700, y: 400 },
      { id: 'n6', type: 'condition', title: 'Email Opened?', description: 'Check if lead opened the welcome email', x: 500, y: 400 },
      { id: 'n7', type: 'tag', title: 'Tag: Engaged', description: 'Add "Email-Engaged" tag', x: 300, y: 400 },
      { id: 'n8', type: 'assign-lead', title: 'Assign to SDR', description: 'Assign lead to Sales Development Rep', x: 100, y: 400 },
    ],
    triggers: 2456, conversions: 892, lastRun: '2026-04-12T14:30:00', createdAt: '2026-01-15',
  },
  {
    id: 'wf-02', name: 'Cart Abandonment Recovery', status: 'active',
    nodes: [
      { id: 'n10', type: 'trigger', title: 'Cart Abandoned', description: 'When cart is left without checkout for 30 mins', x: 100, y: 200 },
      { id: 'n11', type: 'send-whatsapp', title: 'WhatsApp Reminder', description: 'Send cart reminder with product image', x: 300, y: 200 },
      { id: 'n12', type: 'delay', title: 'Wait 4 Hours', description: 'Give time to respond', x: 500, y: 200 },
      { id: 'n13', type: 'condition', title: 'Purchased?', description: 'Check if user completed purchase', x: 700, y: 200 },
      { id: 'n14', type: 'send-sms', title: 'SMS with 10% Off', description: 'Send SMS with limited-time discount code', x: 700, y: 400 },
      { id: 'n15', type: 'send-email', title: 'Email with Social Proof', description: 'Send email with reviews and testimonials', x: 500, y: 400 },
      { id: 'n16', type: 'create-task', title: 'Create Follow-up Task', description: 'Create SDR follow-up task for high-value carts', x: 300, y: 400 },
    ],
    triggers: 5340, conversions: 2136, lastRun: '2026-04-12T16:45:00', createdAt: '2026-02-01',
  },
  {
    id: 'wf-03', name: 'Lead Scoring & Lifecycle Move', status: 'active',
    nodes: [
      { id: 'n20', type: 'trigger', title: 'Lead Score ≥ 75', description: 'When lead score crosses MQL threshold', x: 100, y: 200 },
      { id: 'n21', type: 'move-lifecycle', title: 'Move to MQL', description: 'Automatically move lead to MQL stage', x: 300, y: 200 },
      { id: 'n22', type: 'notify-team', title: 'Notify Sales Team', description: 'Send Slack + email notification to sales team', x: 500, y: 200 },
      { id: 'n23', type: 'assign-lead', title: 'Assign to AE', description: 'Round-robin assign to Account Executive', x: 700, y: 200 },
      { id: 'n24', type: 'send-email', title: 'Personalised Demo Invite', description: 'Send demo request email from AE', x: 500, y: 400 },
      { id: 'n25', type: 'webhook', title: 'Sync to HubSpot', description: 'Push lead data to HubSpot CRM via webhook', x: 300, y: 400 },
    ],
    triggers: 1890, conversions: 643, lastRun: '2026-04-12T11:20:00', createdAt: '2026-01-20',
  },
  {
    id: 'wf-04', name: 'Post-Purchase Onboarding', status: 'active',
    nodes: [
      { id: 'n30', type: 'trigger', title: 'Deal Won', description: 'When a deal is marked as won', x: 100, y: 200 },
      { id: 'n31', type: 'send-email', title: 'Welcome Email', description: 'Send onboarding welcome email with docs', x: 300, y: 200 },
      { id: 'n32', type: 'delay', title: 'Wait 1 Day', description: 'Allow user to set up account', x: 500, y: 200 },
      { id: 'n33', type: 'send-whatsapp', title: 'WhatsApp Setup Guide', description: 'Send WhatsApp with setup checklist', x: 700, y: 200 },
      { id: 'n34', type: 'delay', title: 'Wait 3 Days', description: 'Give user time to complete setup', x: 700, y: 400 },
      { id: 'n35', type: 'condition', title: 'Setup Complete?', description: 'Check if onboarding checklist finished', x: 500, y: 400 },
      { id: 'n36', type: 'create-task', title: 'CS Follow-up', description: 'Create Customer Success follow-up task', x: 300, y: 400 },
      { id: 'n37', type: 'send-email', title: 'Best Practices Email', description: 'Send tips and best practices guide', x: 100, y: 400 },
    ],
    triggers: 847, conversions: 712, lastRun: '2026-04-11T09:00:00', createdAt: '2026-02-15',
  },
  {
    id: 'wf-05', name: 'Renewal Reminder Sequence', status: 'paused',
    nodes: [
      { id: 'n40', type: 'trigger', title: '30 Days Before Renewal', description: 'When subscription is 30 days from expiry', x: 100, y: 200 },
      { id: 'n41', type: 'send-email', title: 'Renewal Notice Email', description: 'Send renewal reminder with pricing details', x: 300, y: 200 },
      { id: 'n42', type: 'delay', title: 'Wait 7 Days', description: 'Wait for response', x: 500, y: 200 },
      { id: 'n43', type: 'condition', title: 'Renewed?', description: 'Check if renewal is processed', x: 700, y: 200 },
      { id: 'n44', type: 'send-whatsapp', title: 'WhatsApp from CSM', description: 'Personal WhatsApp from Customer Success Manager', x: 700, y: 400 },
      { id: 'n45', type: 'notify-team', title: 'Alert CS Team', description: 'Notify CS team for at-risk account', x: 500, y: 400 },
    ],
    triggers: 324, conversions: 267, lastRun: '2026-04-01T10:00:00', createdAt: '2026-03-01',
  },
  {
    id: 'wf-06', name: 'Webinar Registration Follow-up', status: 'draft',
    nodes: [
      { id: 'n50', type: 'trigger', title: 'Webinar Registered', description: 'When user registers for a webinar', x: 100, y: 200 },
      { id: 'n51', type: 'send-email', title: 'Confirmation Email', description: 'Send webinar confirmation with calendar invite', x: 300, y: 200 },
      { id: 'n52', type: 'send-whatsapp', title: 'WhatsApp Reminder', description: 'Send WhatsApp reminder 1 day before', x: 500, y: 200 },
      { id: 'n53', type: 'delay', title: 'Wait Until Event End', description: 'Wait until webinar concludes', x: 700, y: 200 },
      { id: 'n54', type: 'condition', title: 'Attended?', description: 'Check attendance from webinar platform', x: 500, y: 400 },
      { id: 'n55', type: 'send-email', title: 'Recording + CTA', description: 'Send recording, slides, and next-step CTA', x: 300, y: 400 },
      { id: 'n56', type: 'tag', title: 'Tag: Webinar-Lead', description: 'Tag lead as webinar-sourced', x: 100, y: 400 },
      { id: 'n57', type: 'assign-lead', title: 'Assign to SDR', description: 'Assign high-intent leads to SDR for outreach', x: 700, y: 400 },
    ],
    triggers: 0, conversions: 0, lastRun: '—', createdAt: '2026-04-10',
  },
];

// ---- 4. Audience Segments ----
export const mockSegments: AudienceSegment[] = [
  {
    id: 'seg-01', name: 'Enterprise Decision Makers',
    rules: [
      { field: 'company_size', operator: 'greater-than', value: '200' },
      { field: 'job_title', operator: 'in', value: 'VP,CTO,CFO,Director,Head' },
      { field: 'industry', operator: 'in', value: 'BFSI,SaaS,E-commerce,IT Services' },
    ],
    operator: 'AND', count: 8420, growth: 12.4,
    syncedCampaigns: ['camp-01', 'camp-05'], createdAt: '2026-01-10',
  },
  {
    id: 'seg-02', name: 'High-Intent Free Trial Users',
    rules: [
      { field: 'trial_status', operator: 'equals', value: 'active' },
      { field: 'login_count_7d', operator: 'greater-than', value: '3' },
      { field: 'feature_usage', operator: 'greater-than', value: '5' },
    ],
    operator: 'AND', count: 3245, growth: 28.6,
    syncedCampaigns: ['camp-03'], createdAt: '2026-02-01',
  },
  {
    id: 'seg-03', name: 'Cart Abandoners — High Value',
    rules: [
      { field: 'cart_value', operator: 'greater-than', value: '15000' },
      { field: 'cart_abandoned_days', operator: 'less-than', value: '7' },
      { field: 'purchase_history', operator: 'greater-than', value: '1' },
    ],
    operator: 'AND', count: 1876, growth: -5.2,
    syncedCampaigns: ['camp-04'], createdAt: '2026-02-15',
  },
  {
    id: 'seg-04', name: 'Dormant Users — 90+ Days',
    rules: [
      { field: 'last_active', operator: 'less-than', value: '90' },
      { field: 'previous_purchases', operator: 'greater-than', value: '0' },
    ],
    operator: 'AND', count: 5634, growth: -12.8,
    syncedCampaigns: ['camp-07'], createdAt: '2026-01-05',
  },
  {
    id: 'seg-05', name: 'Tier-1 Cities — Premium Segment',
    rules: [
      { field: 'city', operator: 'in', value: 'Mumbai,Delhi,Bangalore,Hyderabad,Chennai,Pune' },
      { field: 'income_bracket', operator: 'in', value: 'premium,ultra-premium' },
      { field: 'engagement_score', operator: 'greater-than', value: '70' },
    ],
    operator: 'AND', count: 12890, growth: 18.3,
    syncedCampaigns: ['camp-06'], createdAt: '2026-01-20',
  },
  {
    id: 'seg-06', name: 'Startup Founders & CTOs',
    rules: [
      { field: 'company_size', operator: 'less-than', value: '50' },
      { field: 'job_title', operator: 'in', value: 'Founder,CTO,Co-Founder,CEO' },
      { field: 'funding_stage', operator: 'in', value: 'Seed,Series A,Series B' },
    ],
    operator: 'AND', count: 4567, growth: 34.1,
    syncedCampaigns: ['camp-05', 'camp-08', 'camp-10'], createdAt: '2026-02-10',
  },
  {
    id: 'seg-07', name: 'Repeat Purchasers — Loyalty Eligible',
    rules: [
      { field: 'total_purchases', operator: 'greater-than', value: '5' },
      { field: 'lifetime_value', operator: 'greater-than', value: '50000' },
      { field: 'nps_score', operator: 'greater-than', value: '8' },
    ],
    operator: 'AND', count: 2890, growth: 8.7,
    syncedCampaigns: ['camp-06'], createdAt: '2026-03-01',
  },
  {
    id: 'seg-08', name: 'WhatsApp-Opted-In — Festive',
    rules: [
      { field: 'whatsapp_opt_in', operator: 'equals', value: 'true' },
      { field: 'interest_tags', operator: 'contains', value: 'festive' },
      { field: 'region', operator: 'in', value: 'North,South,West,East' },
    ],
    operator: 'AND', count: 24560, growth: 42.5,
    syncedCampaigns: ['camp-02', 'camp-06'], createdAt: '2026-02-28',
  },
];

// ---- 5. Email Campaigns ----
export const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: 'em-01', name: 'March Product Update Digest', subject: 'What\'s New in DigiNue — March 2026 🚀',
    status: 'sent', openRate: 38.5, clickRate: 6.2, replyRate: 2.1, spamScore: 0.02,
    listSize: 18400, sentAt: '2026-03-28T10:00:00', previewText: 'AI Analytics Suite, WhatsApp Commerce, and more...',
  },
  {
    id: 'em-02', name: 'Free Trial Day-3 Engagement', subject: '3 tips to get the most from your free trial',
    status: 'sent', openRate: 45.2, clickRate: 8.4, replyRate: 1.8, spamScore: 0.01,
    listSize: 5600, sentAt: '2026-04-02T09:00:00', previewText: 'Unlock premium features during your trial...',
  },
  {
    id: 'em-03', name: 'Enterprise Demo Invite — AI Suite', subject: 'See AI Analytics in action — Book your personalised demo',
    status: 'sent', openRate: 32.1, clickRate: 5.8, replyRate: 3.4, spamScore: 0.03,
    listSize: 8420, sentAt: '2026-04-05T11:00:00', previewText: 'Join 200+ enterprises already using AI-powered analytics...',
  },
  {
    id: 'em-04', name: 'Summer Sale Early Access', subject: '☀️ Summer Sale is LIVE — Exclusive deals inside',
    status: 'sent', openRate: 42.8, clickRate: 7.6, replyRate: 0.9, spamScore: 0.02,
    listSize: 24800, sentAt: '2026-04-10T08:00:00', previewText: 'Up to 40% off on annual plans. Limited time only...',
  },
  {
    id: 'em-05', name: 'Reactivation — We Miss You!', subject: 'Come back & get 20% off your next plan',
    status: 'sent', openRate: 22.4, clickRate: 3.8, replyRate: 1.2, spamScore: 0.05,
    listSize: 5634, sentAt: '2026-03-15T10:30:00', previewText: 'It\'s been a while. Here\'s a special welcome-back offer...',
  },
  {
    id: 'em-06', name: 'Webinar: Scaling Marketing with AI', subject: 'Free Webinar — How Flipkart-scaled teams use AI for 10x growth',
    status: 'scheduled', openRate: 0, clickRate: 0, replyRate: 0, spamScore: 0.01,
    listSize: 12000, sentAt: '2026-04-20T11:00:00', previewText: 'Learn proven strategies from India\'s top marketing leaders...',
  },
  {
    id: 'em-07', name: 'Nurture Drip 5 — Case Study', subject: 'How Razorpay grew 3x using DigiNue\'s WhatsApp Commerce',
    status: 'sent', openRate: 35.7, clickRate: 6.9, replyRate: 2.6, spamScore: 0.02,
    listSize: 3245, sentAt: '2026-04-08T09:30:00', previewText: 'Real results from a real customer. See the full case study...',
  },
  {
    id: 'em-08', name: 'Renewal — Action Required', subject: 'Your subscription renews in 7 days — Review your plan',
    status: 'failed', openRate: 0, clickRate: 0, replyRate: 0, spamScore: 0.08,
    listSize: 324, sentAt: '2026-04-11T08:00:00', previewText: 'Ensure uninterrupted access to all features...',
  },
];

// ---- 6. WhatsApp Campaigns ----
export const mockWhatsAppCampaigns: WhatsAppCampaign[] = [
  {
    id: 'wa-01', name: 'Holi Festive Greeting', template: 'Happy Holi from DigiNue! 🎨 May your business bloom with colours of success.',
    status: 'sent', sent: 45200, delivered: 43840, read: 28496, replied: 3420,
    mediaType: 'image', ctaButton: 'Claim Holi Offer', quickReplies: ['Tell me more', 'Not interested'],
  },
  {
    id: 'wa-02', name: 'OTP Delivery — Login', template: 'Your DigiNue login OTP is {{otp}}. Valid for 5 mins. Do not share.',
    status: 'sent', sent: 128500, delivered: 127245, read: 127245, replied: 0,
    mediaType: 'text', ctaButton: '', quickReplies: [],
  },
  {
    id: 'wa-03', name: 'Cart Recovery with Product Image', template: 'Hey {{name}}! You left items in your cart 🛒 Complete your purchase now and save 10%.',
    status: 'sent', sent: 8940, delivered: 8672, read: 6070, replied: 1245,
    mediaType: 'image', ctaButton: 'Complete Purchase', quickReplies: ['Need help', 'Remove items'],
  },
  {
    id: 'wa-04', name: 'Summer Sale Flash Alert', template: '☀️ FLASH SALE! 40% off on Annual Plans for the next 4 hours only!',
    status: 'sent', sent: 24800, delivered: 24056, read: 19245, replied: 4289,
    mediaType: 'video', ctaButton: 'Grab Deal Now', quickReplies: ['Show plans', 'Remind later'],
  },
  {
    id: 'wa-05', name: 'Welcome New User — Onboarding', template: 'Welcome to DigiNue, {{name}}! 👋 Here\'s your quick-start guide to get going in 5 mins.',
    status: 'sent', sent: 5620, delivered: 5451, read: 4906, replied: 872,
    mediaType: 'document', ctaButton: 'Open Setup Guide', quickReplies: ['Start setup', 'Talk to support'],
  },
  {
    id: 'wa-06', name: 'Eid Mubarak — Exclusive Offer', template: 'Eid Mubarak! 🌙 Celebrate with exclusive deals on DigiNue Business Suite.',
    status: 'scheduled', sent: 0, delivered: 0, read: 0, replied: 0,
    mediaType: 'image', ctaButton: 'View Eid Offers', quickReplies: ['Show deals', 'Skip'],
  },
];

// ---- 7. SMS Campaigns ----
export const mockSMSCampaigns: SMSCampaign[] = [
  {
    id: 'sms-01', name: 'Summer Sale Flash SMS', type: 'promotional',
    status: 'sent', sent: 32000, delivered: 31488, failed: 512, ctr: 5.8,
    template: 'DigiNue SUMMER SALE! Flat 40% off on Annual Plans. Use code SUMMER40. Valid till midnight! T&C apply.',
  },
  {
    id: 'sms-02', name: 'OTP — Account Verification', type: 'otp',
    status: 'sent', sent: 86400, delivered: 85836, failed: 564, ctr: 0,
    template: 'Your DigiNue verification OTP is {{otp}}. Valid for 5 minutes. Do not share this OTP with anyone.',
  },
  {
    id: 'sms-03', name: 'Order Shipment Tracking', type: 'transactional',
    status: 'sent', sent: 12400, delivered: 12328, failed: 72, ctr: 4.2,
    template: 'Your DigiNue order #{{order_id}} has been shipped! Track here: {{tracking_url}}. Expected delivery: {{date}}.',
  },
  {
    id: 'sms-04', name: 'Webinar Reminder — 1 Hour', type: 'promotional',
    status: 'sent', sent: 4500, delivered: 4455, failed: 45, ctr: 7.1,
    template: 'Reminder: AI Marketing Webinar starts in 1 hour! Join now: {{link}}. Don\'t miss insights from top CMOs.',
  },
  {
    id: 'sms-05', name: 'Renewal Due in 3 Days', type: 'transactional',
    status: 'sent', sent: 890, delivered: 886, failed: 4, ctr: 12.4,
    template: 'Hi {{name}}, your DigiNue subscription renews in 3 days. Renew now & save 15%: {{link}}.',
  },
  {
    id: 'sms-06', name: 'Festive Raffle — Diwali Preview', type: 'promotional',
    status: 'draft', sent: 0, delivered: 0, failed: 0, ctr: 0,
    template: '🎉 Diwali Dhamaka! Stand a chance to WIN 1 year FREE subscription. Participate now: {{link}}',
  },
];

// ---- 8. Social Posts ----
export const mockSocialPosts: SocialPost[] = [
  {
    id: 'sp-01', caption: 'We\'re thrilled to announce DigiNue AI Analytics Suite — powered by cutting-edge ML models built for Indian enterprises. #MadeInIndia #AI #MarTech',
    platform: 'linkedin', status: 'published', scheduledAt: '2026-04-10T10:00:00',
    likes: 1245, comments: 89, shares: 234, reach: 48200, mediaType: 'video',
    hashtags: ['#MadeInIndia', '#AI', '#MarTech', '#DigiNue', '#SaaS'],
  },
  {
    id: 'sp-02', caption: 'Holi hai! 🎨 May the colours of innovation brighten your business this year. Happy Holi from Team DigiNue!',
    platform: 'instagram', status: 'published', scheduledAt: '2026-03-14T09:00:00',
    likes: 4580, comments: 312, shares: 678, reach: 124000, mediaType: 'reel',
    hashtags: ['#HappyHoli', '#Holi2026', '#FestivalVibes', '#DigiNue'],
  },
  {
    id: 'sp-03', caption: 'How we helped Razorpay 3x their WhatsApp conversion rate using automated journeys. Full case study link in bio. 📈',
    platform: 'linkedin', status: 'published', scheduledAt: '2026-04-05T11:30:00',
    likes: 876, comments: 67, shares: 198, reach: 35400, mediaType: 'carousel',
    hashtags: ['#CaseStudy', '#WhatsAppCommerce', '#GrowthMarketing', '#DigiNue'],
  },
  {
    id: 'sp-04', caption: 'SUMMER SALE IS HERE! ☀️ Up to 40% off on all annual plans. Limited spots — grab yours now!',
    platform: 'instagram', status: 'published', scheduledAt: '2026-04-10T08:00:00',
    likes: 6230, comments: 445, shares: 892, reach: 186000, mediaType: 'image',
    hashtags: ['#SummerSale', '#SaaS', '#MarketingTools', '#Discount', '#DigiNue'],
  },
  {
    id: 'sp-05', caption: 'Behind the scenes at DigiNue HQ — building the future of marketing automation for India 🇮🇳',
    platform: 'instagram', status: 'published', scheduledAt: '2026-04-08T14:00:00',
    likes: 3120, comments: 156, shares: 234, reach: 78000, mediaType: 'story',
    hashtags: ['#StartupLife', '#TeamDigiNue', '#MarTech', '#India'],
  },
  {
    id: 'sp-06', caption: '📣 Exciting news! DigiNue raises Series B funding to expand AI-driven marketing capabilities across Southeast Asia.',
    platform: 'twitter', status: 'published', scheduledAt: '2026-04-01T09:00:00',
    likes: 2340, comments: 189, shares: 567, reach: 92000, mediaType: 'image',
    hashtags: ['#SeriesB', '#Funding', '#MarTech', '#StartupIndia', '#DigiNue'],
  },
  {
    id: 'sp-07', caption: '5 marketing automation workflows every Indian SaaS company needs in 2026. Thread 🧵👇',
    platform: 'twitter', status: 'published', scheduledAt: '2026-04-06T10:30:00',
    likes: 1890, comments: 124, shares: 445, reach: 67000, mediaType: 'image',
    hashtags: ['#MarketingAutomation', '#SaaS', '#GrowthHacking', '#MarTechIndia'],
  },
  {
    id: 'sp-08', caption: 'Join our upcoming webinar: Scaling Marketing with AI — Featuring CMOs from Flipkart, Swiggy & Zerodha. Register now! 🔗',
    platform: 'linkedin', status: 'published', scheduledAt: '2026-04-09T11:00:00',
    likes: 678, comments: 45, shares: 123, reach: 28900, mediaType: 'video',
    hashtags: ['#Webinar', '#AIMarketing', '#CMO', '#DigiNue', '#MarketingLeaders'],
  },
  {
    id: 'sp-09', caption: 'POV: You discover DigiNue\'s WhatsApp Commerce and your conversion rate goes brrr 📈📈📈',
    platform: 'tiktok', status: 'published', scheduledAt: '2026-04-07T16:00:00',
    likes: 12400, comments: 890, shares: 2340, reach: 320000, mediaType: 'reel',
    hashtags: ['#MarketingTok', '#SaaS', '#GrowthHack', '#WhatsApp', '#DigiNue'],
  },
  {
    id: 'sp-10', caption: 'Customer spotlight: How a D2C brand in Jaipur grew from ₹2L to ₹25L monthly revenue using DigiNue funnels.',
    platform: 'instagram', status: 'published', scheduledAt: '2026-04-04T12:00:00',
    likes: 5670, comments: 398, shares: 712, reach: 156000, mediaType: 'carousel',
    hashtags: ['#CustomerStory', '#D2C', '#Growth', '#India', '#DigiNue'],
  },
  {
    id: 'sp-11', caption: 'Eid Mubarak from DigiNue! 🌙 Celebrate with special deals on our Business Suite.',
    platform: 'facebook', status: 'scheduled', scheduledAt: '2026-04-12T08:00:00',
    likes: 0, comments: 0, shares: 0, reach: 0, mediaType: 'image',
    hashtags: ['#EidMubarak', '#Eid2026', '#FestivalOffers', '#DigiNue'],
  },
  {
    id: 'sp-12', caption: 'What does the future of marketing look like in India? We asked 500 CMOs. Here\'s what they said. Full report →',
    platform: 'linkedin', status: 'draft', scheduledAt: '2026-04-18T10:00:00',
    likes: 0, comments: 0, shares: 0, reach: 0, mediaType: 'carousel',
    hashtags: ['#CMOSurvey', '#FutureOfMarketing', '#India', '#MarTech', '#DigiNue'],
  },
];

// ---- 9. Ad Campaigns ----
export const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'ad-01', name: 'Google Search — SaaS Keywords', platform: 'google', status: 'active',
    spend: 580000, clicks: 24600, impressions: 420000, cpc: 23.57, cpl: 680, roas: 5.2, conversions: 853,
    creative: 'Search ad — "Best Marketing Automation Software India | Free Trial"',
  },
  {
    id: 'ad-02', name: 'Meta — Retargeting Carousel', platform: 'meta', status: 'active',
    spend: 320000, clicks: 18400, impressions: 380000, cpc: 17.39, cpl: 520, roas: 4.8, conversions: 615,
    creative: 'Carousel ad showing product features with customer testimonials',
  },
  {
    id: 'ad-03', name: 'LinkedIn — Lead Gen Forms', platform: 'linkedin', status: 'active',
    spend: 450000, clicks: 8900, impressions: 198000, cpc: 50.56, cpl: 1420, roas: 3.1, conversions: 317,
    creative: 'Sponsored content — "How AI is transforming enterprise marketing in India"',
  },
  {
    id: 'ad-04', name: 'YouTube — Product Demo Pre-roll', platform: 'youtube', status: 'active',
    spend: 280000, clicks: 6200, impressions: 520000, cpc: 45.16, cpl: 890, roas: 3.6, conversions: 315,
    creative: '15-second pre-roll video — AI Analytics Suite walkthrough',
  },
  {
    id: 'ad-05', name: 'TikTok — Branded Hashtag Challenge', platform: 'tiktok', status: 'active',
    spend: 150000, clicks: 12400, impressions: 890000, cpc: 12.10, cpl: 310, roas: 6.4, conversions: 484,
    creative: 'Branded hashtag #DigiNueChallenge — "Show us your marketing hack"',
  },
  {
    id: 'ad-06', name: 'Google Display — Remarketing', platform: 'google', status: 'paused',
    spend: 195000, clicks: 7800, impressions: 340000, cpc: 25.00, cpl: 540, roas: 4.1, conversions: 361,
    creative: 'Display banner ads — "Your free trial is waiting! Complete setup in 5 mins"',
  },
  {
    id: 'ad-07', name: 'Meta — Lookalike Audience', platform: 'meta', status: 'completed',
    spend: 220000, clicks: 11200, impressions: 260000, cpc: 19.64, cpl: 470, roas: 5.8, conversions: 468,
    creative: 'Image ad — "Join 10,000+ businesses growing with DigiNue"',
  },
  {
    id: 'ad-08', name: 'LinkedIn — ABM Enterprise', platform: 'linkedin', status: 'draft',
    spend: 0, clicks: 0, impressions: 0, cpc: 0, cpl: 0, roas: 0, conversions: 0,
    creative: 'ABM campaign targeting top 100 Indian enterprise accounts — personalised ads',
  },
];

// ---- 10. Attribution Channels ----
export const mockAttributionChannels: AttributionChannel[] = [
  { channel: 'Google Ads', revenue: 4860000, contribution: 32.5, conversions: 1684, color: '#ea4335' },
  { channel: 'WhatsApp', revenue: 3705600, contribution: 24.8, conversions: 1284, color: '#25d366' },
  { channel: 'Email', revenue: 2721840, contribution: 18.2, conversions: 941, color: '#f59e0b' },
  { channel: 'LinkedIn', revenue: 1808280, contribution: 12.1, conversions: 625, color: '#0a66c2' },
  { channel: 'Social Media', revenue: 1253880, contribution: 8.4, conversions: 434, color: '#8b5cf6' },
  { channel: 'Referral', revenue: 596640, contribution: 4.0, conversions: 206, color: '#10b981' },
];

// ---- 11. Funnels ----
export const mockFunnels: Funnel[] = [
  {
    id: 'fn-01', name: 'Enterprise Lead Funnel',
    steps: [
      { id: 'fs1', name: 'Ad Click', visitors: 48200, conversions: 48200, dropOff: 0, revenue: 0 },
      { id: 'fs2', name: 'Landing Page', visitors: 48200, conversions: 28920, dropOff: 40.0, revenue: 0 },
      { id: 'fs3', name: 'Form Submission', visitors: 28920, conversions: 5784, dropOff: 80.0, revenue: 0 },
      { id: 'fs4', name: 'WhatsApp Conversation', visitors: 5784, conversions: 2024, dropOff: 65.0, revenue: 0 },
      { id: 'fs5', name: 'Demo Booked (SQL)', visitors: 2024, conversions: 612, dropOff: 69.8, revenue: 0 },
    ],
    totalRevenue: 24600000, conversionRate: 1.27,
  },
  {
    id: 'fn-02', name: 'E-Commerce Purchase Funnel',
    steps: [
      { id: 'fs6', name: 'Ad Click', visitors: 67000, conversions: 67000, dropOff: 0, revenue: 0 },
      { id: 'fs7', name: 'Product Page', visitors: 67000, conversions: 46900, dropOff: 30.0, revenue: 0 },
      { id: 'fs8', name: 'Add to Cart', visitors: 46900, conversions: 11725, dropOff: 75.0, revenue: 0 },
      { id: 'fs9', name: 'Checkout Started', visitors: 11725, conversions: 7035, dropOff: 40.0, revenue: 0 },
      { id: 'fs10', name: 'Purchase Complete', visitors: 7035, conversions: 1608, dropOff: 77.1, revenue: 12864000 },
    ],
    totalRevenue: 12864000, conversionRate: 2.4,
  },
  {
    id: 'fn-03', name: 'Free Trial to Paid Conversion',
    steps: [
      { id: 'fs11', name: 'Trial Signup', visitors: 8400, conversions: 8400, dropOff: 0, revenue: 0 },
      { id: 'fs12', name: 'Product Activation', visitors: 8400, conversions: 5880, dropOff: 30.0, revenue: 0 },
      { id: 'fs13', name: 'Key Feature Used', visitors: 5880, conversions: 3234, dropOff: 45.0, revenue: 0 },
      { id: 'fs14', name: 'Team Invited', visitors: 3234, conversions: 1294, dropOff: 60.0, revenue: 0 },
      { id: 'fs15', name: 'Paid Conversion', visitors: 1294, conversions: 284, dropOff: 78.1, revenue: 8520000 },
    ],
    totalRevenue: 8520000, conversionRate: 3.38,
  },
  {
    id: 'fn-04', name: 'Webinar to Customer',
    steps: [
      { id: 'fs16', name: 'Landing Page Visit', visitors: 32000, conversions: 32000, dropOff: 0, revenue: 0 },
      { id: 'fs17', name: 'Registered', visitors: 32000, conversions: 9600, dropOff: 70.0, revenue: 0 },
      { id: 'fs18', name: 'Attended Live', visitors: 9600, conversions: 3840, dropOff: 60.0, revenue: 0 },
      { id: 'fs19', name: 'Requested Demo', visitors: 3840, conversions: 768, dropOff: 80.0, revenue: 0 },
      { id: 'fs20', name: 'Became Customer', visitors: 768, conversions: 115, dropOff: 85.0, revenue: 9200000 },
    ],
    totalRevenue: 9200000, conversionRate: 0.36,
  },
];

// ---- 12. A/B Tests ----
export const mockABTests: ABTest[] = [
  {
    id: 'ab-01', name: 'Hero CTA — "Start Free Trial" vs "Get Started in 2 Mins"',
    type: 'cta', status: 'completed',
    variants: [
      { id: 'v1', name: 'Control — Start Free Trial', impressions: 12400, conversions: 496, conversionRate: 4.0, isWinner: false },
      { id: 'v2', name: 'Variant — Get Started in 2 Mins', impressions: 12300, conversions: 615, conversionRate: 5.0, isWinner: true },
    ],
    winner: 'v2', startDate: '2026-03-10', endDate: '2026-03-24', confidence: 97.2, improvement: 25.0,
  },
  {
    id: 'ab-02', name: 'Email Subject — Emoji vs No Emoji', type: 'subject-line', status: 'completed',
    variants: [
      { id: 'v3', name: 'Control — No Emoji', impressions: 9200, conversions: 3312, conversionRate: 36.0, isWinner: false },
      { id: 'v4', name: 'Variant — With Emoji 🚀', impressions: 9100, conversions: 4004, conversionRate: 44.0, isWinner: true },
    ],
    winner: 'v4', startDate: '2026-03-15', endDate: '2026-03-22', confidence: 99.1, improvement: 22.2,
  },
  {
    id: 'ab-03', name: 'Landing Page — Long-form vs Short-form', type: 'landing-page', status: 'completed',
    variants: [
      { id: 'v5', name: 'Control — Long-form with testimonials', impressions: 8600, conversions: 258, conversionRate: 3.0, isWinner: false },
      { id: 'v6', name: 'Variant — Short-form with video', impressions: 8500, conversions: 340, conversionRate: 4.0, isWinner: true },
    ],
    winner: 'v6', startDate: '2026-03-20', endDate: '2026-04-03', confidence: 98.8, improvement: 33.3,
  },
  {
    id: 'ab-04', name: 'Ad Creative — Static Image vs Video', type: 'creative', status: 'running',
    variants: [
      { id: 'v7', name: 'Control — Static Product Image', impressions: 18000, conversions: 540, conversionRate: 3.0, isWinner: false },
      { id: 'v8', name: 'Variant — 15s Product Demo Video', impressions: 17900, conversions: 716, conversionRate: 4.0, isWinner: true },
    ],
    winner: null, startDate: '2026-04-01', endDate: '2026-04-15', confidence: 94.5, improvement: 32.6,
  },
  {
    id: 'ab-05', name: 'WhatsApp CTA — "Shop Now" vs "See Offers"', type: 'cta', status: 'running',
    variants: [
      { id: 'v9', name: 'Control — Shop Now', impressions: 6800, conversions: 884, conversionRate: 13.0, isWinner: true },
      { id: 'v10', name: 'Variant — See Offers', impressions: 6700, conversions: 737, conversionRate: 11.0, isWinner: false },
      { id: 'v11', name: 'Variant — Claim Your Deal', impressions: 6750, conversions: 877, conversionRate: 13.0, isWinner: true },
    ],
    winner: null, startDate: '2026-04-05', endDate: '2026-04-19', confidence: 82.3, improvement: 18.2,
  },
  {
    id: 'ab-06', name: 'Email Body — Text-Only vs GIF Header', type: 'email', status: 'draft',
    variants: [
      { id: 'v12', name: 'Control — Text-Only Layout', impressions: 0, conversions: 0, conversionRate: 0, isWinner: false },
      { id: 'v13', name: 'Variant — GIF Header + Text', impressions: 0, conversions: 0, conversionRate: 0, isWinner: false },
    ],
    winner: null, startDate: '2026-04-18', endDate: '2026-05-02', confidence: 0, improvement: 0,
  },
];

// ---- 13. Retention Metrics ----
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

// ---- 14. Loyalty Members ----
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

// ---- 15. Coupons ----
export const mockCoupons: Coupon[] = [
  { id: 'cpn-01', code: 'SUMMER40', discount: '40%', type: 'percentage', expiry: '2026-05-31', status: 'active', usageCount: 1847, maxUsage: 5000 },
  { id: 'cpn-02', code: 'WELCOME500', discount: '₹500', type: 'flat', expiry: '2026-12-31', status: 'active', usageCount: 4521, maxUsage: 10000 },
  { id: 'cpn-03', code: 'FREESHIP', discount: 'Free Shipping', type: 'free-shipping', expiry: '2026-06-30', status: 'active', usageCount: 2890, maxUsage: 8000 },
  { id: 'cpn-04', code: 'DIWALI25', discount: '25%', type: 'percentage', expiry: '2025-11-15', status: 'expired', usageCount: 6234, maxUsage: 10000 },
  { id: 'cpn-05', code: 'REFERRAL1000', discount: '₹1,000', type: 'flat', expiry: '2026-12-31', status: 'active', usageCount: 1245, maxUsage: 5000 },
  { id: 'cpn-06', code: 'HOLI20', discount: '20%', type: 'percentage', expiry: '2026-03-20', status: 'expired', usageCount: 3100, maxUsage: 5000 },
  { id: 'cpn-07', code: 'VIP50OFF', discount: '₹50', type: 'flat', expiry: '2026-04-30', status: 'redeemed', usageCount: 500, maxUsage: 500 },
  { id: 'cpn-08', code: 'NEWYEAR30', discount: '30%', type: 'percentage', expiry: '2026-01-15', status: 'expired', usageCount: 4120, maxUsage: 5000 },
];

// ---- 16. Referrals ----
export const mockReferrals: ReferralEntry[] = [
  { id: 'ref-01', name: 'Aarav Gupta', email: 'aarav@techsolutions.in', referralCode: 'AARAV2024', totalReferrals: 47, conversions: 31, earnings: 31000, rank: 1 },
  { id: 'ref-02', name: 'Priyanka Iyer', email: 'priyanka@startupxyz.com', referralCode: 'PRIYA24X', totalReferrals: 38, conversions: 24, earnings: 24000, rank: 2 },
  { id: 'ref-03', name: 'Rohan Patel', email: 'rohan@retailpro.in', referralCode: 'ROHAN-RP', totalReferrals: 32, conversions: 22, earnings: 22000, rank: 3 },
  { id: 'ref-04', name: 'Kavitha Nair', email: 'kavitha@medicare.in', referralCode: 'KAVITHA-M', totalReferrals: 28, conversions: 18, earnings: 18000, rank: 4 },
  { id: 'ref-05', name: 'Siddharth Mehta', email: 'siddharth@finedge.com', referralCode: 'SID-FIN', totalReferrals: 24, conversions: 16, earnings: 16000, rank: 5 },
  { id: 'ref-06', name: 'Anisha Sharma', email: 'anisha@ecomhub.in', referralCode: 'ANISHA-E', totalReferrals: 19, conversions: 14, earnings: 14000, rank: 6 },
  { id: 'ref-07', name: 'Vikash Kumar', email: 'vikash@logisticspro.in', referralCode: 'VIKASH-LP', totalReferrals: 15, conversions: 10, earnings: 10000, rank: 7 },
  { id: 'ref-08', name: 'Neha Singh', email: 'neha@designlab.co', referralCode: 'NEHA-DL', totalReferrals: 12, conversions: 8, earnings: 8000, rank: 8 },
  { id: 'ref-09', name: 'Arjun Reddy', email: 'arjun@saasforge.in', referralCode: 'ARJUN-SF', totalReferrals: 8, conversions: 5, earnings: 5000, rank: 9 },
  { id: 'ref-10', name: 'Deepak Verma', email: 'deepak@nextera.in', referralCode: 'DEEPAK-NX', totalReferrals: 6, conversions: 4, earnings: 4000, rank: 10 },
];

// ---- 17. Content Items ----
export const mockContentItems: ContentItem[] = [
  {
    id: 'ct-01', title: 'How AI is Transforming Marketing for Indian SaaS Companies', type: 'blog', stage: 'published',
    author: 'Vikram Joshi', reviewer: 'Priya Sharma', version: 3,
    comments: [
      { id: 'cc1', author: 'Priya Sharma', content: 'Great insights. Please add more data points on WhatsApp marketing.', timestamp: '2026-04-02T14:00:00' },
      { id: 'cc2', author: 'Vikram Joshi', content: 'Added WhatsApp section with latest stats from our campaigns.', timestamp: '2026-04-02T16:30:00' },
    ],
    createdAt: '2026-03-28', preview: 'https://cdn.diginue.io/blog/ai-marketing-india-preview.jpg',
  },
  {
    id: 'ct-02', title: 'Product Launch Announcement — AI Analytics Suite', type: 'social-post', stage: 'approved',
    author: 'Sneha Reddy', reviewer: 'Meera Patel', version: 2,
    comments: [
      { id: 'cc3', author: 'Meera Patel', content: 'Change the headline to be more benefit-focused.', timestamp: '2026-04-08T10:00:00' },
      { id: 'cc4', author: 'Sneha Reddy', content: 'Updated headline. Ready for final review.', timestamp: '2026-04-08T11:30:00' },
    ],
    createdAt: '2026-04-05', preview: 'https://cdn.diginue.io/social/ai-launch-preview.jpg',
  },
  {
    id: 'ct-03', title: 'Summer Sale Email — Hero Banner Creative', type: 'email', stage: 'in-review',
    author: 'Deepika Nair', reviewer: 'Arjun Mehta', version: 1,
    comments: [
      { id: 'cc5', author: 'Arjun Mehta', content: 'Please ensure CTA button is mobile-optimised.', timestamp: '2026-04-10T09:00:00' },
    ],
    createdAt: '2026-04-09', preview: 'https://cdn.diginue.io/email/summer-sale-hero.jpg',
  },
  {
    id: 'ct-04', title: 'Google Ads — SaaS Keywords Campaign Creative', type: 'ad-creative', stage: 'client-review',
    author: 'Rahul Verma', reviewer: 'Priya Sharma', version: 2,
    comments: [
      { id: 'cc6', author: 'Priya Sharma', content: 'Client prefers "Built for India" tagline over "Enterprise Ready".', timestamp: '2026-04-09T15:00:00' },
      { id: 'cc7', author: 'Rahul Verma', content: 'Updated copy. Sent to client for final sign-off.', timestamp: '2026-04-10T10:00:00' },
    ],
    createdAt: '2026-04-07', preview: 'https://cdn.diginue.io/ads/google-saas-keywords.jpg',
  },
  {
    id: 'ct-05', title: 'Landing Page — AI Analytics Suite Signup Flow', type: 'landing-page', stage: 'manager-review',
    author: 'Ananya Das', reviewer: 'Priya Sharma', version: 2,
    comments: [
      { id: 'cc8', author: 'Ananya Das', content: 'A/B test variants ready for review. Need sign-off to push to production.', timestamp: '2026-04-11T09:00:00' },
    ],
    createdAt: '2026-04-08', preview: 'https://cdn.diginue.io/lp/ai-analytics-signup.jpg',
  },
  {
    id: 'ct-06', title: 'Customer Success Story Video — Razorpay', type: 'video', stage: 'revision',
    author: 'Deepika Nair', reviewer: 'Vikram Joshi', version: 3,
    comments: [
      { id: 'cc9', author: 'Vikram Joshi', content: 'The intro is too long. Cut first 10 seconds and jump to the problem statement.', timestamp: '2026-04-10T14:00:00' },
      { id: 'cc10', author: 'Deepika Nair', content: 'Re-edited version uploaded. Shortened intro as suggested.', timestamp: '2026-04-11T11:00:00' },
    ],
    createdAt: '2026-04-01', preview: 'https://cdn.diginue.io/video/razorpay-story-preview.jpg',
  },
  {
    id: 'ct-07', title: 'LinkedIn Thought Leadership — "5 Marketing Trends for 2026"', type: 'blog', stage: 'draft',
    author: 'Vikram Joshi', reviewer: '', version: 1,
    comments: [],
    createdAt: '2026-04-11', preview: '',
  },
  {
    id: 'ct-08', title: 'Instagram Reel — Behind the Scenes at DigiNue HQ', type: 'social-post', stage: 'published',
    author: 'Sneha Reddy', reviewer: 'Meera Patel', version: 1,
    comments: [
      { id: 'cc11', author: 'Meera Patel', content: 'Looks authentic and engaging. Approved!', timestamp: '2026-04-07T16:00:00' },
    ],
    createdAt: '2026-04-07', preview: 'https://cdn.diginue.io/social/bts-hq-preview.jpg',
  },
  {
    id: 'ct-09', title: 'WhatsApp Template — Cart Recovery with Product Image', type: 'email', stage: 'approved',
    author: 'Arjun Mehta', reviewer: 'Priya Sharma', version: 2,
    comments: [
      { id: 'cc12', author: 'Priya Sharma', content: 'Template approved. Push to WhatsApp Business API.', timestamp: '2026-04-06T11:00:00' },
    ],
    createdAt: '2026-04-04', preview: 'https://cdn.diginue.io/whatsapp/cart-recovery.jpg',
  },
  {
    id: 'ct-10', title: 'Product Demo Video — 60-Second Overview', type: 'video', stage: 'in-review',
    author: 'Deepika Nair', reviewer: 'Rahul Verma', version: 1,
    comments: [
      { id: 'cc13', author: 'Rahul Verma', content: 'Add subtitles — 70% of our viewers watch without sound.', timestamp: '2026-04-12T10:00:00' },
    ],
    createdAt: '2026-04-10', preview: 'https://cdn.diginue.io/video/product-demo-60s.jpg',
  },
];

// ---- 18. AI Growth Insights ----
export const mockAIGrowthInsights: AIGrowthInsight[] = [
  {
    id: 'ai-01', type: 'channel-recommendation', title: 'Increase YouTube Ad Budget by 35%',
    description: 'YouTube campaigns are delivering 3.6x ROAS with the lowest CPL among video channels. Analysis of 90-day data shows increasing trend in video-assisted conversions.',
    confidence: 92, impact: 'high', recommendation: 'Reallocate ₹98,000/month from Google Display to YouTube pre-roll campaigns targeting enterprise SaaS keywords.',
    potentialROI: 126000,
  },
  {
    id: 'ai-02', type: 'budget-optimization', title: 'Optimise Meta Ad Spend — Shift to Lookalike Audiences',
    description: 'Current Meta campaigns using interest targeting have 4.8x ROAS. Lookalike audiences based on top 100 customers show 42% higher CTR in initial tests.',
    confidence: 88, impact: 'high', recommendation: 'Create 1%, 3%, and 5% lookalike audiences from top 100 customers and allocate 60% of Meta budget to these segments.',
    potentialROI: 184000,
  },
  {
    id: 'ai-03', type: 'trend-prediction', title: 'Rising Demand for WhatsApp Commerce in Tier-2 Cities',
    description: 'WhatsApp engagement from Tier-2 cities has grown 68% month-over-month. Jaipur, Lucknow, and Coimbatore show the highest intent signals based on search and chat volume.',
    confidence: 85, impact: 'high', recommendation: 'Launch Hindi + regional language WhatsApp templates for Tier-2 cities. Create city-specific offers for Jaipur, Lucknow, Coimbatore, Indore, and Kochi.',
    potentialROI: 240000,
  },
  {
    id: 'ai-04', type: 'churn-campaign', title: '89 Accounts at Risk of Churn This Month',
    description: 'ML model identifies 89 accounts with >75% churn probability based on declining login frequency, reduced feature usage, and support ticket volume increase.',
    confidence: 91, impact: 'critical', recommendation: 'Immediately trigger personalised retention campaigns via WhatsApp and email. Assign high-value accounts (ARPU > ₹25K) to CSMs for direct outreach.',
    potentialROI: 580000,
  },
  {
    id: 'ai-05', type: 'fatigue-detection', title: 'Email Fatigue Detected — 3 Segments Over-Saturated',
    description: 'Open rates for "Enterprise Decision Makers" dropped from 38% to 22% over 30 days. Sending frequency increased to 12 emails/month — 4x above optimal threshold.',
    confidence: 94, impact: 'medium', recommendation: 'Reduce email frequency to 3/week for enterprise segments. Replace excess emails with WhatsApp touchpoints for higher engagement.',
    potentialROI: 95000,
  },
  {
    id: 'ai-06', type: 'roi-improvement', title: 'Cart Abandonment Flow Has Highest Incremental ROI',
    description: 'Cart abandonment workflow delivers 624.5% ROI — 2.3x higher than lead generation campaigns. Each ₹1 invested returns ₹6.24 in recovered revenue.',
    confidence: 97, impact: 'high', recommendation: 'Double cart abandonment budget to ₹7,00,000. Add SMS channel at 4-hour mark. Implement dynamic pricing incentives based on cart value.',
    potentialROI: 312000,
  },
  {
    id: 'ai-07', type: 'audience-expansion', title: 'Untapped Opportunity — Healthcare & EdTech Verticals',
    description: 'Healthcare and EdTech companies show 3.2x higher engagement with our content compared to average. Current penetration is only 4% of addressable market in these verticals.',
    confidence: 82, impact: 'medium', recommendation: 'Create industry-specific landing pages and case studies for Healthcare and EdTech. Launch LinkedIn ABM campaign targeting 200 accounts in each vertical.',
    potentialROI: 450000,
  },
  {
    id: 'ai-08', type: 'content-optimization', title: 'Short-Form Video Outperforming All Other Content 4:1',
    description: 'TikTok Reels and YouTube Shorts generate 4x more engagement per ₹ spent compared to static content. Average watch time is 8.2 seconds — optimal for 10-15 second formats.',
    confidence: 90, impact: 'high', recommendation: 'Shift 30% of social content budget to short-form video. Produce 2 Reels/week and 1 YouTube Short/week. Repurpose webinar highlights as bite-sized clips.',
    potentialROI: 168000,
  },
];
