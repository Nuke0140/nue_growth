'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useMarketingStore } from './marketing-store';

// Direct imports
import MarketingDashboardPage from './marketing-dashboard-page';
import CampaignsPage from './campaigns-page';
import CampaignBuilderPage from './campaign-builder-page';
import WorkflowsPage from './workflows-page';
import AudienceSegmentsPage from './audience-segments-page';
import EmailBuilderPage from './email-builder-page';
import WhatsAppCampaignsPage from './whatsapp-campaigns-page';
import SmsCampaignsPage from './sms-campaigns-page';
import SocialCalendarPage from './social-calendar-page';
import PostBuilderPage from './post-builder-page';
import AdPerformancePage from './ad-performance-page';
import AttributionPage from './attribution-page';
import LandingFunnelsPage from './landing-funnels-page';
import AbTestingPage from './ab-testing-page';
import RetentionPage from './retention-page';
import LoyaltyPage from './loyalty-page';
import ReferralPage from './referral-page';
import ContentApprovalPage from './content-approval-page';
import AiGrowthIntelligencePage from './ai-growth-intelligence-page';

// Icons
import {
  LayoutDashboard,
  Megaphone,
  Workflow,
  Mail,
  MessageCircle,
  Smartphone,
  CalendarDays,
  Users,
  ShieldCheck,
  Award,
  Share2,
  BarChart3,
  GitBranch,
  Filter,
  ArrowLeftRight,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const marketingConfig: ModuleConfig = {
  moduleId: 'marketing',
  moduleName: 'Marketing',
  moduleShortName: 'Marketing',
  moduleIcon: Megaphone,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'growth-intelligence',
      label: 'Growth Intelligence',
      items: [
        { id: 'marketing-dashboard', label: 'Marketing Dashboard', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
        { id: 'workflows', label: 'Workflow Automation', icon: Workflow },
        { id: 'ai-growth-intelligence', label: 'AI Growth Intelligence', icon: Sparkles, isAI: true },
      ],
    },
    {
      id: 'channels',
      label: 'Channels',
      items: [
        { id: 'email-builder', label: 'Email', icon: Mail },
        { id: 'whatsapp-campaigns', label: 'WhatsApp', icon: MessageCircle },
        { id: 'sms-campaigns', label: 'SMS', icon: Smartphone },
        { id: 'social-calendar', label: 'Social Calendar', icon: CalendarDays },
      ],
    },
    {
      id: 'audience-retention',
      label: 'Audience & Retention',
      items: [
        { id: 'audience-segments', label: 'Audience Segments', icon: Users },
        { id: 'retention', label: 'Retention', icon: ShieldCheck },
        { id: 'loyalty', label: 'Loyalty', icon: Award },
        { id: 'referral', label: 'Referrals', icon: Share2 },
      ],
    },
    {
      id: 'analytics-optimization',
      label: 'Analytics & Optimization',
      items: [
        { id: 'ad-performance', label: 'Ads Performance', icon: BarChart3 },
        { id: 'attribution', label: 'Attribution', icon: GitBranch },
        { id: 'landing-funnels', label: 'Funnels', icon: Filter },
        { id: 'ab-testing', label: 'A/B Testing', icon: ArrowLeftRight },
      ],
    },
    {
      id: 'operations',
      label: 'Operations',
      items: [
        { id: 'content-approval', label: 'Content Approval', icon: FileCheck },
      ],
    },
  ],

  pageComponents: {
    'marketing-dashboard': MarketingDashboardPage,
    'campaigns': CampaignsPage,
    'campaign-builder': CampaignBuilderPage,
    'workflows': WorkflowsPage,
    'audience-segments': AudienceSegmentsPage,
    'email-builder': EmailBuilderPage,
    'whatsapp-campaigns': WhatsAppCampaignsPage,
    'sms-campaigns': SmsCampaignsPage,
    'social-calendar': SocialCalendarPage,
    'post-builder': PostBuilderPage,
    'ad-performance': AdPerformancePage,
    'attribution': AttributionPage,
    'landing-funnels': LandingFunnelsPage,
    'ab-testing': AbTestingPage,
    'retention': RetentionPage,
    'loyalty': LoyaltyPage,
    'referral': ReferralPage,
    'content-approval': ContentApprovalPage,
    'ai-growth-intelligence': AiGrowthIntelligencePage,
  },

  allPageLabels: {
    'marketing-dashboard': 'Marketing Dashboard',
    'campaigns': 'Campaigns',
    'campaign-builder': 'Campaign Builder',
    'workflows': 'Workflow Automation',
    'audience-segments': 'Audience Segments',
    'email-builder': 'Email Builder',
    'whatsapp-campaigns': 'WhatsApp Campaigns',
    'sms-campaigns': 'SMS Campaigns',
    'social-calendar': 'Social Calendar',
    'post-builder': 'Post Builder',
    'ad-performance': 'Ads Performance',
    'attribution': 'Attribution',
    'landing-funnels': 'Funnels',
    'ab-testing': 'A/B Testing',
    'retention': 'Retention',
    'loyalty': 'Loyalty',
    'referral': 'Referrals',
    'content-approval': 'Content Approval',
    'ai-growth-intelligence': 'AI Growth Intelligence',
  },

  useStore: () => {
    const store = useMarketingStore();
    return {
      currentPage: store.currentPage,
      sidebarOpen: store.sidebarOpen,
      setSidebarOpen: store.setSidebarOpen,
      navigateTo: store.navigateTo,
      goBack: store.goBack,
      goForward: store.goForward,
      canGoBack: store.canGoBack,
      canGoForward: store.canGoForward,
    };
  },
};
