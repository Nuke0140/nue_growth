'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalyticsStore } from './analytics-store';
import { useAuthStore } from '@/store/auth-store';
import AnalyticsDashboardPage from './analytics-dashboard-page';
import ExecutiveBIPage from './executive-bi-page';
import CustomDashboardBuilderPage from './custom-dashboard-builder-page';
import SalesAnalyticsPage from './sales-analytics-page';
import MarketingAnalyticsPage from './marketing-analytics-page';
import FinanceAnalyticsPage from './finance-analytics-page';
import CrmAnalyticsPage from './crm-analytics-page';
import RetentionAnalyticsPage from './retention-analytics-page';
import ErpProductivityPage from './erp-productivity-page';
import AttributionReportPage from './attribution-report-page';
import CohortReportPage from './cohort-report-page';
import ReportBuilderPage from './report-builder-page';
import ScheduledReportsPage from './scheduled-reports-page';
import WhiteLabelClientReportsPage from './white-label-client-reports-page';
import BenchmarkComparisonPage from './benchmark-comparison-page';
import AnomalyDetectionPage from './anomaly-detection-page';
import AiBiAssistantPage from './ai-bi-assistant-page';
import {
  Search, Bell, Moon, Sun,
  Menu, ChevronRight, Command, Sparkles, SlidersHorizontal,
  LogOut, Calendar,
  Home, ArrowLeft, ArrowRight, Zap, BarChart3,
  LayoutDashboard, Presentation, LayoutGrid, DollarSign,
  Megaphone, Users, Heart, Factory, GitBranch, Layers,
  FileText, Clock, Building2, Target, ShieldAlert, BrainCircuit,
  FileSpreadsheet, Download, Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/shared/error-boundary';

import type { AnalyticsPage } from './types';

// ---- Navigation Items ----
interface NavItem {
  id: AnalyticsPage;
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
    title: 'Overview',
    items: [
      { id: 'analytics-dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
      { id: 'executive-bi', label: 'Executive BI', icon: Presentation, badge: 'NEW', badgeColor: 'from-emerald-500/20 to-teal-500/20' },
      { id: 'ai-bi-assistant', label: 'AI BI Assistant', icon: BrainCircuit, badge: 'AI', badgeColor: 'from-violet-500/20 to-purple-500/20' },
    ],
  },
  {
    title: 'Dashboards',
    items: [
      { id: 'custom-dashboard-builder', label: 'Custom Dashboards', icon: LayoutGrid, badge: 'BETA', badgeColor: 'from-blue-500/20 to-cyan-500/20' },
    ],
  },
  {
    title: 'Domain Analytics',
    items: [
      { id: 'sales-analytics', label: 'Sales Analytics', icon: DollarSign },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: Megaphone },
      { id: 'finance-analytics', label: 'Finance Analytics', icon: BarChart3 },
      { id: 'crm-analytics', label: 'CRM Analytics', icon: Users },
      { id: 'retention-analytics', label: 'Retention Analytics', icon: Heart },
      { id: 'erp-productivity', label: 'ERP Productivity', icon: Factory },
    ],
  },
  {
    title: 'Reports',
    items: [
      { id: 'attribution-report', label: 'Attribution Reports', icon: GitBranch },
      { id: 'cohort-report', label: 'Cohort Reports', icon: Layers },
      { id: 'report-builder', label: 'Report Builder', icon: FileText },
      { id: 'scheduled-reports', label: 'Scheduled Reports', icon: Clock, badge: '3', badgeColor: 'from-red-500/20 to-orange-500/20' },
      { id: 'white-label-client-reports', label: 'White Label Reports', icon: Building2 },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'benchmark-comparison', label: 'Benchmarks', icon: Target },
      { id: 'anomaly-detection', label: 'Anomaly Detection', icon: ShieldAlert, badge: '2', badgeColor: 'from-red-500/20 to-orange-500/20' },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

function PageContent() {
  const { currentPage } = useAnalyticsStore();

  const pageComponents: Record<string, React.ComponentType> = {
    'analytics-dashboard': AnalyticsDashboardPage,
    'executive-bi': ExecutiveBIPage,
    'custom-dashboard-builder': CustomDashboardBuilderPage,
    'sales-analytics': SalesAnalyticsPage,
    'marketing-analytics': MarketingAnalyticsPage,
    'finance-analytics': FinanceAnalyticsPage,
    'crm-analytics': CrmAnalyticsPage,
    'retention-analytics': RetentionAnalyticsPage,
    'erp-productivity': ErpProductivityPage,
    'attribution-report': AttributionReportPage,
    'cohort-report': CohortReportPage,
    'report-builder': ReportBuilderPage,
    'scheduled-reports': ScheduledReportsPage,
    'white-label-client-reports': WhiteLabelClientReportsPage,
    'benchmark-comparison': BenchmarkComparisonPage,
    'anomaly-detection': AnomalyDetectionPage,
    'ai-bi-assistant': AiBiAssistantPage,
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

export default function AnalyticsLayout() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const { currentPage, sidebarOpen, setSidebarOpen, goBack, goForward, canGoBack, canGoForward, navigateTo } = useAnalyticsStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const canBack = canGoBack();
  const canForward = canGoForward();

  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'Analytics';

  if (presentationMode) {
    return (
      <TooltipProvider>
        <div className={cn(
          'h-screen flex flex-col overflow-hidden transition-colors duration-300',
          isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'
        )}>
          <header className={cn(
            'h-12 border-b flex items-center justify-between px-6 shrink-0 transition-colors',
            isDark ? 'bg-[#0a0a0a] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{currentLabel}</span>
              <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Presentation Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setPresentationMode(false)} className="h-8 w-8 rounded-lg">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        'h-screen flex flex-col overflow-hidden transition-colors duration-300',
        isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'
      )}>
        {/* ========== Top Bar ========== */}
        <header className={cn(
          'h-14 border-b flex items-center justify-between px-4 gap-4 shrink-0 transition-colors',
          isDark ? 'bg-[#0a0a0a] border-white/[0.06]' : 'bg-white border-black/[0.06]'
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
                    'shrink-0 h-8 w-8 rounded-lg',
                    isDark
                      ? 'hover:bg-white/[0.06] text-white/50 hover:text-white'
                      : 'hover:bg-black/[0.06] text-black/50 hover:text-black'
                  )}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Home Dashboard</p></TooltipContent>
            </Tooltip>

            <div className={cn('w-px h-5 mx-1 hidden md:block', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />

            {/* Back Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goBack} disabled={!canBack}
                  className={cn('shrink-0 h-8 w-8 rounded-lg transition-opacity', !canBack && 'opacity-30 cursor-not-allowed', canBack && isDark && 'hover:bg-white/[0.06]', canBack && !isDark && 'hover:bg-black/[0.06]')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Back</p></TooltipContent>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goForward} disabled={!canForward}
                  className={cn('shrink-0 h-8 w-8 rounded-lg transition-opacity', !canForward && 'opacity-30 cursor-not-allowed', canForward && isDark && 'hover:bg-white/[0.06]', canForward && !isDark && 'hover:bg-black/[0.06]')}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Forward</p></TooltipContent>
            </Tooltip>

            <div className={cn('w-px h-5 mx-1 hidden md:block', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />

            {/* Mobile sidebar toggle */}
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden shrink-0 h-8 w-8 rounded-lg">
              <Menu className="w-4 h-4" />
            </Button>

            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="DigiNue" width={24} height={16} className="object-contain rounded-sm" />
              <span className={cn('text-sm font-semibold tracking-wide hidden sm:block', isDark ? 'text-white/60' : 'text-black/60')}>
                Analytics
              </span>
              <ChevronRight className={cn('w-3 h-3 hidden sm:block', isDark ? 'text-white/20' : 'text-black/20')} />
              <span className="text-sm font-medium">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn(
              'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border w-64 transition-colors',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input type="text" placeholder="Search analytics... (⌘K)" className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
              <kbd className={cn('hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono', isDark ? 'bg-white/[0.06] text-white/30' : 'bg-black/[0.06] text-black/30')}>
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>

            {/* Date Range */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Date Range</TooltipContent>
            </Tooltip>

            {/* Filters */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Saved Filters</TooltipContent>
            </Tooltip>

            {/* Export */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <FileSpreadsheet className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>

            {/* Presentation Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setPresentationMode(true)} className="hidden md:flex h-8 w-8 rounded-lg">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Presentation Mode</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg">
                  <Bell className="w-4 h-4" />
                  <span className={cn('absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center', isDark ? 'bg-white text-black' : 'bg-black text-white')}>5</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {/* AI BI Chat CTA */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => navigateTo('ai-bi-assistant')} className="relative hidden md:flex h-8 w-8 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0)', '0 0 0 4px rgba(139,92,246,0.1)', '0 0 0 0 rgba(139,92,246,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI BI Assistant</TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="h-8 w-8 rounded-lg">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Avatar */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn('h-8 w-8 rounded-lg font-bold text-xs', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn('absolute right-0 top-11 w-56 rounded-xl border shadow-xl p-2 z-50', isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-black/[0.08]')}
                >
                  <div className={cn('px-3 py-2 border-b mb-1', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{user?.email || ''}</p>
                  </div>
                  <button onClick={() => { logout(); setShowUserMenu(false); }}
                    className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.06]' : 'text-black/60 hover:text-black hover:bg-black/[0.06]')}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
                animate={isMobile ? { x: 0 } : { width: 256, opacity: 1 }}
                exit={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'border-r shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
                  isMobile && 'w-[280px]',
                  isDark ? 'border-white/[0.06] bg-[#0a0a0a]' : 'border-black/[0.06] bg-white'
                )}
              >
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                  {navSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-2">
                      <div className="px-3 pt-3 pb-1.5">
                        <span className={cn('text-[10px] font-semibold tracking-wider uppercase', isDark ? 'text-white/25' : 'text-black/25')}>
                          {section.title}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = currentPage === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => { navigateTo(item.id); if (isMobile) setSidebarOpen(false); }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group',
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
                                'w-4.5 h-4.5 transition-colors shrink-0',
                                isActive
                                  ? isDark ? 'text-white' : 'text-black'
                                  : isDark ? 'text-white/30 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/60'
                              )} />
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className={cn(
                                  'ml-auto text-[9px] px-1.5 py-0 border-0 bg-gradient-to-r',
                                  item.badgeColor || '',
                                  isDark ? 'text-purple-300' : 'text-purple-600'
                                )}>
                                  {item.badge}
                                </Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {sectionIdx < navSections.length - 1 && (
                        <div className={cn('mx-3 mt-3 mb-1 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')} />
                      )}
                    </div>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className={cn('p-3 border-t space-y-3', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium">BI Alert</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
                      2 new anomalies detected. Revenue dip alert and CPL spike need attention. Board meeting prep dashboard is ready.
                    </p>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
