'use client';

import type { ModuleConfig } from '@/types/module-config';
import { useRetentionStore } from './retention-store';

// Direct imports
import RetentionDashboardPage from './retention-dashboard-page';
import CustomerHealthPage from './customer-health-page';
import ChurnRiskPage from './churn-risk-page';
import RenewalCenterPage from './renewal-center-page';
import WinbackCampaignsPage from './winback-campaigns-page';
import UpsellCrosssellPage from './upsell-crosssell-page';
import LoyaltyProgramPage from './loyalty-program-page';
import ReferralGrowthPage from './referral-growth-page';
import FeedbackNpsPage from './feedback-nps-page';
import CustomerJourneyPage from './customer-journey-page';
import CohortAnalysisPage from './cohort-analysis-page';
import LtvForecastPage from './ltv-forecast-page';
import CustomerSuccessPage from './customer-success-page';
import AdvocacyPage from './advocacy-page';
import AiGrowthCoachPage from './ai-growth-coach-page';

// Icons
import {
  LayoutDashboard,
  HeartPulse,
  ShieldAlert,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  RotateCcw,
  Award,
  Share2,
  Map,
  Grid3x3,
  BarChart3,
  UsersRound,
  Star,
  BrainCircuit,
} from 'lucide-react';

export const retentionConfig: ModuleConfig = {
  moduleId: 'retention',
  moduleName: 'Retention',
  moduleShortName: 'Retention',
  moduleIcon: HeartPulse,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'retention-dashboard', label: 'Retention Dashboard', icon: LayoutDashboard },
        { id: 'ai-growth-coach', label: 'AI Growth Coach', icon: BrainCircuit, isAI: true },
      ],
    },
    {
      id: 'customer-intelligence',
      label: 'Customer Intelligence',
      items: [
        { id: 'customer-health', label: 'Customer Health', icon: HeartPulse },
        { id: 'churn-risk', label: 'Churn Risk', icon: ShieldAlert },
        { id: 'feedback-nps', label: 'Feedback & NPS', icon: MessageSquare },
      ],
    },
    {
      id: 'revenue-growth',
      label: 'Revenue Growth',
      items: [
        { id: 'renewal-center', label: 'Renewals', icon: RefreshCw },
        { id: 'upsell-crosssell', label: 'Upsell & Cross-sell', icon: TrendingUp },
        { id: 'winback-campaigns', label: 'Win-back', icon: RotateCcw },
      ],
    },
    {
      id: 'programs',
      label: 'Programs',
      items: [
        { id: 'loyalty-program', label: 'Loyalty', icon: Award },
        { id: 'referral-growth', label: 'Referrals', icon: Share2 },
        { id: 'advocacy', label: 'Advocacy', icon: Star },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      items: [
        { id: 'customer-journey', label: 'Customer Journey', icon: Map },
        { id: 'cohort-analysis', label: 'Cohorts', icon: Grid3x3 },
        { id: 'ltv-forecast', label: 'LTV Forecast', icon: BarChart3 },
        { id: 'customer-success', label: 'Customer Success', icon: UsersRound },
      ],
    },
  ],

  pageComponents: {
    'retention-dashboard': RetentionDashboardPage,
    'customer-health': CustomerHealthPage,
    'churn-risk': ChurnRiskPage,
    'renewal-center': RenewalCenterPage,
    'winback-campaigns': WinbackCampaignsPage,
    'upsell-crosssell': UpsellCrosssellPage,
    'loyalty-program': LoyaltyProgramPage,
    'referral-growth': ReferralGrowthPage,
    'feedback-nps': FeedbackNpsPage,
    'customer-journey': CustomerJourneyPage,
    'cohort-analysis': CohortAnalysisPage,
    'ltv-forecast': LtvForecastPage,
    'customer-success': CustomerSuccessPage,
    'advocacy': AdvocacyPage,
    'ai-growth-coach': AiGrowthCoachPage,
  },

  allPageLabels: {
    'retention-dashboard': 'Retention Dashboard',
    'ai-growth-coach': 'AI Growth Coach',
    'customer-health': 'Customer Health',
    'churn-risk': 'Churn Risk',
    'feedback-nps': 'Feedback & NPS',
    'renewal-center': 'Renewals',
    'upsell-crosssell': 'Upsell & Cross-sell',
    'winback-campaigns': 'Win-back',
    'loyalty-program': 'Loyalty',
    'referral-growth': 'Referrals',
    'advocacy': 'Advocacy',
    'customer-journey': 'Customer Journey',
    'cohort-analysis': 'Cohorts',
    'ltv-forecast': 'LTV Forecast',
    'customer-success': 'Customer Success',
  },

  useStore: () => {
    const store = useRetentionStore();
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
