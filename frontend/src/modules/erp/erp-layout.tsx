'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useErpStore } from './erp-store';
import { useAuthStore } from '@/store/auth-store';
import ErpDashboardPage from './erp-dashboard-page';
import ProjectsPage from './projects-page';
import ProjectDetailPage from './project-detail-page';
import TasksBoardPage from './tasks-board-page';
import ApprovalsPage from './approvals-page';
import InvoicesPage from './invoices-page';
import FinanceOpsPage from './finance-ops-page';
import VendorPage from './vendor-page';
import PayrollPage from './payroll-page';
import ResourcePlanningPage from './resource-planning-page';
import AssetManagementPage from './asset-management-page';
import SopTemplatesPage from './sop-templates-page';
import DeliveryOperationsPage from './delivery-operations-page';
import InternalChatPage from './internal-chat-page';
import ProfitabilityPage from './profitability-page';
import AiOpsIntelligencePage from './ai-ops-intelligence-page';
import EmployeesPage from './employees-page';
import EmployeeDetailPage from './employee-detail-page';
import DepartmentsPage from './departments-page';
import AttendancePage from './attendance-page';
import LeavesPage from './leaves-page';
import PerformancePage from './performance-page';
import IncentivesPage from './incentives-page';
import OnboardingPage from './onboarding-page';
import DocumentsPage from './documents-page';
import ShiftsPage from './shifts-page';
import WorkloadPage from './workload-page';
import EmployeeAnalyticsPage from './employee-analytics-page';
import {
  Search, Bell, Plus, Moon, Sun, X,
  Menu, ChevronRight, Command, Sparkles, SlidersHorizontal,
  LogOut, Calendar,
  Home, ArrowLeft, ArrowRight,
  // Operations
  LayoutDashboard, FolderKanban, Columns3, Truck,
  CheckCircle2, BookOpen, TrendingUp, MessageSquare, BrainCircuit,
  // Finance
  FileText, Landmark, Building2, Banknote, Monitor,
  // Employees
  Users, Network, Clock, CalendarOff, BarChart3,
  Award, UserPlus, FolderOpen, Timer, Gauge, LineChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { ErpPage } from './types';

// ---- Navigation Items ----
interface NavItem {
  id: ErpPage;
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
    title: 'Operations',
    items: [
      { id: 'erp-dashboard', label: 'ERP Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'tasks-board', label: 'Tasks Board', icon: Columns3 },
      { id: 'delivery-operations', label: 'Delivery Ops', icon: Truck },
      { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
      { id: 'sop-templates', label: 'SOP Templates', icon: BookOpen },
      { id: 'profitability', label: 'Profitability', icon: TrendingUp },
      { id: 'internal-chat', label: 'Internal Chat', icon: MessageSquare },
      { id: 'ai-ops-intelligence', label: 'AI Ops Intelligence', icon: BrainCircuit, badge: 'AI', badgeColor: 'from-purple-500/20 to-blue-500/20' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'finance-ops', label: 'Finance Ops', icon: Landmark },
      { id: 'vendor', label: 'Vendors', icon: Building2 },
      { id: 'payroll', label: 'Payroll', icon: Banknote },
      { id: 'asset-management', label: 'Assets', icon: Monitor },
    ],
  },
  {
    title: 'Employees',
    items: [
      { id: 'employees', label: 'Employees', icon: Users },
      { id: 'departments', label: 'Departments', icon: Network },
      { id: 'attendance', label: 'Attendance', icon: Clock },
      { id: 'leaves', label: 'Leaves', icon: CalendarOff },
      { id: 'performance', label: 'Performance', icon: BarChart3 },
      { id: 'incentives', label: 'Incentives', icon: Award },
      { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
      { id: 'documents', label: 'Documents', icon: FolderOpen },
      { id: 'shifts', label: 'Shifts', icon: Timer },
      { id: 'workload', label: 'Workload', icon: Gauge },
      { id: 'employee-analytics', label: 'Employee Analytics', icon: LineChart },
    ],
  },
];

// Flatten all nav items for breadcrumb lookup
const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

function PageContent() {
  const { currentPage } = useErpStore();

  const pageComponents: Record<string, React.ComponentType> = {
    'erp-dashboard': ErpDashboardPage,
    'projects': ProjectsPage,
    'project-detail': ProjectDetailPage,
    'tasks-board': TasksBoardPage,
    'approvals': ApprovalsPage,
    'invoices': InvoicesPage,
    'finance-ops': FinanceOpsPage,
    'vendor': VendorPage,
    'payroll': PayrollPage,
    'resource-planning': ResourcePlanningPage,
    'asset-management': AssetManagementPage,
    'sop-templates': SopTemplatesPage,
    'delivery-operations': DeliveryOperationsPage,
    'internal-chat': InternalChatPage,
    'profitability': ProfitabilityPage,
    'ai-ops-intelligence': AiOpsIntelligencePage,
    'employees': EmployeesPage,
    'employee-detail': EmployeeDetailPage,
    'departments': DepartmentsPage,
    'attendance': AttendancePage,
    'leaves': LeavesPage,
    'performance': PerformancePage,
    'incentives': IncentivesPage,
    'onboarding': OnboardingPage,
    'documents': DocumentsPage,
    'shifts': ShiftsPage,
    'workload': WorkloadPage,
    'employee-analytics': EmployeeAnalyticsPage,
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

export default function ErpLayout() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const { currentPage, sidebarOpen, setSidebarOpen, goBack, goForward, canGoBack, canGoForward, navigateTo } = useErpStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const isDetailPage = currentPage.endsWith('-detail');
  const canBack = canGoBack();
  const canForward = canGoForward();

  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'ERP';

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
              <TooltipContent side="bottom">
                <p>Home Dashboard</p>
              </TooltipContent>
            </Tooltip>

            {/* Navigation Divider */}
            <div className={cn(
              'w-px h-5 mx-1 hidden md:block',
              isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
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
                    'shrink-0 h-8 w-8 rounded-lg transition-opacity',
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
                    'shrink-0 h-8 w-8 rounded-lg transition-opacity',
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
              isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
            )} />

            {/* Mobile sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden shrink-0 h-8 w-8 rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="DigiNue" width={24} height={16} className="object-contain rounded-sm" />
              <span className={cn('text-sm font-semibold tracking-wide hidden sm:block', isDark ? 'text-white/60' : 'text-black/60')}>
                ERP
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
              <input
                type="text"
                placeholder="Search... (⌘K)"
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
              <kbd className={cn(
                'hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono',
                isDark ? 'bg-white/[0.06] text-white/30' : 'bg-black/[0.06] text-black/30'
              )}>
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>

            {/* Filters */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filters</TooltipContent>
            </Tooltip>

            {/* Date Range */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Date Range</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg">
                  <Bell className="w-4 h-4" />
                  <span className={cn(
                    'absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  )}>7</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {/* AI Ops Assistant */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hidden md:flex h-8 w-8 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0)', '0 0 0 4px rgba(139,92,246,0.1)', '0 0 0 0 rgba(139,92,246,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Ops Assistant</TooltipContent>
            </Tooltip>

            {/* Quick Create */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg">
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick Create</TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="h-8 w-8 rounded-lg"
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
                  'h-8 w-8 rounded-lg font-bold text-xs',
                  isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                )}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    'absolute right-0 top-11 w-56 rounded-xl border shadow-xl p-2 z-50',
                    isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-black/[0.08]'
                  )}
                >
                  <div className={cn('px-3 py-2 border-b mb-1', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.06]' : 'text-black/60 hover:text-black hover:bg-black/[0.06]'
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
                      {/* Section Header */}
                      <div className="px-3 pt-3 pb-1.5">
                        <span className={cn(
                          'text-[10px] font-semibold tracking-wider uppercase',
                          isDark ? 'text-white/25' : 'text-black/25'
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

                      {/* Section Divider */}
                      {sectionIdx < navSections.length - 1 && (
                        <div className={cn(
                          'mx-3 mt-3 mb-1 border-t',
                          isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
                        )} />
                      )}
                    </div>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className={cn(
                  'p-3 border-t space-y-3',
                  isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
                )}>
                  <div className={cn(
                    'rounded-xl p-3 border',
                    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium">Operations Alert</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
                      3 projects at risk this week — MediCare, FinEdge, LegalEase need attention
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
