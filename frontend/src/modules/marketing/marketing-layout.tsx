'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useMarketingStore } from './marketing-store';
import { useAuthStore } from '@/store/auth-store';
import { useIsMobile } from '@/hooks/use-mobile';
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
import {
  Search, Bell, Moon, Sun,
  Menu, ChevronRight, Command, Sparkles, SlidersHorizontal,
  LogOut, Calendar,
  Home, ArrowLeft, ArrowRight, Zap, Rocket,
  LayoutDashboard, Megaphone, Workflow,
  Mail, MessageCircle, Smartphone, CalendarDays,
  Users, ShieldCheck, Award, Share2,
  BarChart3, GitBranch, Filter, ArrowLeftRight, FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { MarketingPage } from './types';

// ---- Navigation Items ----
interface NavItem {
  id: MarketingPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Growth Intelligence',
    items: [
      { id: 'marketing-dashboard', label: 'Marketing Dashboard', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
      { id: 'workflows', label: 'Workflow Automation', icon: Workflow },
      { id: 'ai-growth-intelligence', label: 'AI Growth Intelligence', icon: Sparkles, badge: 'AI', badgeColor: 'from-purple-500/20 to-violet-500/20' },
    ],
  },
  {
    title: 'Channels',
    items: [
      { id: 'email-builder', label: 'Email', icon: Mail },
      { id: 'whatsapp-campaigns', label: 'WhatsApp', icon: MessageCircle },
      { id: 'sms-campaigns', label: 'SMS', icon: Smartphone },
      { id: 'social-calendar', label: 'Social Calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Audience & Retention',
    items: [
      { id: 'audience-segments', label: 'Audience Segments', icon: Users },
      { id: 'retention', label: 'Retention', icon: ShieldCheck },
      { id: 'loyalty', label: 'Loyalty', icon: Award },
      { id: 'referral', label: 'Referrals', icon: Share2 },
    ],
  },
  {
    title: 'Analytics & Optimization',
    items: [
      { id: 'ad-performance', label: 'Ads Performance', icon: BarChart3 },
      { id: 'attribution', label: 'Attribution', icon: GitBranch },
      { id: 'landing-funnels', label: 'Funnels', icon: Filter },
      { id: 'ab-testing', label: 'A/B Testing', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'content-approval', label: 'Content Approval', icon: FileCheck },
    ],
  },
];

// Flatten all nav items for breadcrumb lookup
const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

function PageContent() {
  const { currentPage } = useMarketingStore();

  const pageComponents: Record<string, React.ComponentType> = {
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
  };

  const PageComponent = pageComponents[currentPage] || null;

  if (!PageComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export default function MarketingLayout() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const { currentPage, sidebarOpen, setSidebarOpen, goBack, goForward, canGoBack, canGoForward, navigateTo } = useMarketingStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const isDetailPage = currentPage.endsWith('-builder') || currentPage === 'post-builder';
  const canBack = canGoBack();
  const canForward = canGoForward();

  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'Marketing';

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        'h-screen flex flex-col overflow-hidden transition-colors duration-200',
        'bg-[var(--app-bg)] text-[var(--app-text)]'
      )}>
        {/* ========== Top Bar ========== */}
        <header className={cn(
          'h-14 border-b flex items-center justify-between px-4 gap-4 shrink-0 transition-colors',
          'bg-[var(--app-bg)] border-[var(--app-border)]'
        )}>
          <div className="flex items-center gap-1.5">
            {/* Home Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModule}
                  className={cn(
                    'shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)]',
                    isDark
                      ? 'hover:bg-white/[0.06] text-white/50 hover:text-white'
                      : 'hover:bg-black/[0.06] text-black/50 hover:text-black'
                  )}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Home Dashboard</p>
              </TooltipContent>
            </Tooltip>

            {/* Navigation Divider */}
            <div className={cn(
              'w-px h-5 mx-1 hidden md:block',
              'bg-[var(--app-hover-bg)]'
            )} />

            {/* Back Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  disabled={!canBack}
                  className={cn(
                    'shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity',
                    !canBack && 'opacity-30 cursor-not-allowed',
                    canBack && isDark && 'hover:bg-white/[0.06]',
                    canBack && !isDark && 'hover:bg-black/[0.06]'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Go Back</p>
              </TooltipContent>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goForward}
                  disabled={!canForward}
                  className={cn(
                    'shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity',
                    !canForward && 'opacity-30 cursor-not-allowed',
                    canForward && isDark && 'hover:bg-white/[0.06]',
                    canForward && !isDark && 'hover:bg-black/[0.06]'
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Go Forward</p>
              </TooltipContent>
            </Tooltip>

            {/* Navigation Divider */}
            <div className={cn(
              'w-px h-5 mx-1 hidden md:block',
              'bg-[var(--app-hover-bg)]'
            )} />

            {/* Mobile sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)]"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="DigiNue" width={24} height={16} className="object-contain rounded-[var(--app-radius-sm)]" />
              <span className={cn('text-sm font-semibold tracking-wide hidden sm:block', 'text-[var(--app-text-secondary)]')}>
                Marketing
              </span>
              <ChevronRight className={cn('w-4 h-4 hidden sm:block', 'text-[var(--app-text-disabled)]')} />
              <span className="text-sm font-medium">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn(
              'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[var(--app-radius-lg)] border w-64 transition-colors',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search... (⌘K)"
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
              <kbd className={cn(
                'hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono',
                'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
              )}>
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>

            {/* Date Range */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Calendar className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Date Range</TooltipContent>
            </Tooltip>

            {/* Filters */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filters</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Bell className="w-4 h-4" />
                  <span className={cn(
                    'absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
                    'bg-[var(--app-card-bg)] text-[var(--app-text)]'
                  )}>5</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {/* AI Assistant */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex relative h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Sparkles className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-[var(--app-radius-lg)]"
                    animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0)', '0 0 0 4px rgba(139,92,246,0.1)', '0 0 0 0 rgba(139,92,246,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Assistant</TooltipContent>
            </Tooltip>

            {/* Quick Campaign CTA */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Rocket className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick Campaign</TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="h-8 w-8 rounded-[var(--app-radius-lg)]"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Avatar */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                  'h-8 w-8 rounded-[var(--app-radius-lg)] font-bold text-xs',
                  'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
                )}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    'absolute right-0 top-11 w-56 rounded-[var(--app-radius-lg)] border shadow-[var(--app-shadow-md)]-xl p-2 z-50',
                    'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                  )}
                >
                  <div className={cn('px-3 py-2 border-b mb-1', 'border-[var(--app-border)]')}>
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] text-sm transition-colors',
                      'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* ========== Main Content ========== */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mobile backdrop */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={isMobile ? { x: -280, opacity: 0 } : { width: 0, opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { width: 256, opacity: 1 }}
                exit={isMobile ? { x: -280, opacity: 0 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'border-r shrink-0 overflow-hidden fixed md:relative inset-y-0 left-0 z-50 flex flex-col',
                  isMobile && 'w-[280px]',
                  'border-[var(--app-border)] bg-[var(--app-bg)]'
                )}
              >
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                  {navSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-2">
                      {/* Section Header */}
                      <div className="px-3 pt-3 pb-1.5">
                        <span className={cn(
                          'text-[10px] font-semibold tracking-wider uppercase',
                          'text-[var(--app-text-muted)]'
                        )}>
                          {section.title}
                        </span>
                      </div>

                      {/* Section Items */}
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = currentPage === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => { navigateTo(item.id); if (isMobile) setSidebarOpen(false); }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--app-radius-lg)] text-sm transition-colors duration-200 group',
                                isActive
                                  ? isDark
                                    ? 'bg-white/[0.08] text-white font-medium'
                                    : 'bg-black/[0.06] text-black font-medium'
                                  : isDark
                                    ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                                    : 'text-black/50 hover:text-black/80 hover:bg-black/[0.04]'
                              )}
                            >
                              <item.icon className={cn(
                                'w-5 h-5 transition-colors shrink-0',
                                isActive
                                  ? 'text-[var(--app-text)]'
                                  : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'
                              )} />
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className={cn(
                                  'ml-auto text-[9px] px-1.5 py-0 border-0 bg-gradient-to-r',
                                  item.badgeColor || '',
                                  'text-[var(--app-purple)]'
                                )}>
                                  {item.badge}
                                </Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Section Divider */}
                      {sectionIdx < navSections.length - 1 && (
                        <div className={cn(
                          'mx-3 mt-3 mb-1 border-t',
                          'border-[var(--app-border-light)]'
                        )} />
                      )}
                    </div>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className={cn(
                  'p-3 border-t space-y-3',
                  'border-[var(--app-border)]'
                )}>
                  <div className={cn(
                    'rounded-[var(--app-radius-lg)] p-3 border',
                    'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium">Marketing Alert</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                      3 campaigns ending this week — Summer Sale, Product Launch, Re-engagement need attention
                    </p>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden">
            <PageContent />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
