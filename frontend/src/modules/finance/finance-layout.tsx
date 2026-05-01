'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFinanceStore } from './finance-store';
import { useAuthStore } from '@/store/auth-store';
import { CSS, ANIMATION, MODULE_ACCENTS } from '@/styles/design-tokens';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/shared/error-boundary';

// Page imports
import DashboardPage from './finance-dashboard-page';
import CashflowPage from './cashflow-page';
import ReceivablesPage from './receivables-page';
import PayablesPage from './payables-page';
import RevenuePage from './revenue-page';
import ExpensesPage from './expenses-page';
import PnlPage from './pnl-page';
import ProfitabilityPage from './profitability-page';
import InvoicesPage from './invoices-page';
import PayrollPage from './payroll-finance-page';
import ApprovalsPage from './approvals-page';
import BudgetsPage from './budgets-page';
import ForecastingPage from './forecasting-page';
import TaxPage from './gst-tax-page';

import {
  Search, Bell, Moon, Sun,
  Menu, ChevronRight, Command, Sparkles, SlidersHorizontal,
  LogOut, Calendar,
  Home, ArrowLeft, ArrowRight, IndianRupee,
  LayoutDashboard, TrendingUp, HandCoins, Receipt,
  FileText, CreditCard, PiggyBank, Landmark,
  Users, Waves, BarChart3,
  Target, FileCheck2, FileSpreadsheet, Plus, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { FinancePage } from './types';

// ---- Navigation Items ----
interface NavItem {
  id: FinancePage;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isAI?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { id: 'dashboard', label: 'CFO Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Cash Management',
    items: [
      { id: 'cashflow', label: 'Cashflow', icon: Waves },
      { id: 'receivables', label: 'Receivables', icon: HandCoins, badge: 5 },
      { id: 'payables', label: 'Payables', icon: Receipt },
    ],
  },
  {
    title: 'Financials',
    items: [
      { id: 'revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'expenses', label: 'Expenses', icon: CreditCard },
      { id: 'pnl', label: 'P&L', icon: BarChart3 },
      { id: 'profitability', label: 'Profitability', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'payroll', label: 'Payroll', icon: Users },
      { id: 'approvals', label: 'Approvals', icon: FileCheck2, badge: 3 },
    ],
  },
  {
    title: 'Planning',
    items: [
      { id: 'budgets', label: 'Budgets', icon: PiggyBank },
      { id: 'forecasting', label: 'Forecasting', icon: Target, isAI: true },
      { id: 'tax', label: 'Tax', icon: Landmark, badge: 2 },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

// ---- Page Content Router ----
const pageComponents: Record<FinancePage, React.ComponentType> = {
  dashboard: DashboardPage,
  cashflow: CashflowPage,
  receivables: ReceivablesPage,
  payables: PayablesPage,
  revenue: RevenuePage,
  expenses: ExpensesPage,
  pnl: PnlPage,
  profitability: ProfitabilityPage,
  invoices: InvoicesPage,
  payroll: PayrollPage,
  approvals: ApprovalsPage,
  budgets: BudgetsPage,
  forecasting: ForecastingPage,
  tax: TaxPage,
};

function PageContent() {
  const { currentPage } = useFinanceStore();
  const PageComponent = pageComponents[currentPage];

  if (!PageComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={ANIMATION.pageVariants.initial}
        animate={ANIMATION.pageVariants.animate}
        exit={ANIMATION.pageVariants.exit}
        transition={{ duration: 0.25, ease: ANIMATION.ease }}
        className="h-full"
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

// ---- Sidebar Nav Item ----
function SidebarNavItem({ item, isActive, onClick }: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: isActive
          ? CSS.activeBg
          : hovered
            ? CSS.hoverBg
            : 'transparent',
        color: isActive ? CSS.text : CSS.textSecondary,
      }}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group"
    >
      <item.icon
        style={{ color: isActive ? MODULE_ACCENTS.finance.primary : CSS.textMuted }}
        className="w-[18px] h-[18px] transition-colors shrink-0"
      />
      <span className="truncate flex-1 text-left">{item.label}</span>
      {item.isAI && (
        <Sparkles
          style={{ color: MODULE_ACCENTS.finance.primary }}
          className="w-3.5 h-3.5 shrink-0"
        />
      )}
      {item.badge !== undefined && (
        <Badge
          style={{
            backgroundColor: CSS.dangerBg,
            color: CSS.danger,
            border: 'none',
            fontSize: '10px',
            lineHeight: 1,
            minWidth: 18,
            height: 18,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: CSS.radiusFull,
          }}
          className="ml-auto px-1.5 py-0"
        >
          {item.badge}
        </Badge>
      )}
    </button>
  );
}

// ---- Main Layout ----
export default function FinanceLayout() {
  // useTheme ONLY for toggle logic, NOT for styling
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const { user, logout, closeModule } = useAuthStore();
  const {
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    navigateTo,
    unreadAlertCount,
  } = useFinanceStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const isMobile = useIsMobile();

  const canBack = canGoBack();
  const canForward = canGoForward();

  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'Finance';

  const handleNavClick = useCallback((page: FinancePage) => {
    navigateTo(page);
    if (isMobile) setSidebarOpen(false);
  }, [navigateTo, isMobile, setSidebarOpen]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: CSS.bg, color: CSS.text }}
      >
        {/* ========== Top Bar ========== */}
        <header
          className="h-14 flex items-center justify-between px-4 gap-4 shrink-0"
          style={{
            backgroundColor: CSS.topbarBg,
            borderBottom: `1px solid ${CSS.topbarBorder}`,
          }}
        >
          {/* Left Side */}
          <div className="flex items-center gap-1.5">
            {/* Home Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModule}
                  className="shrink-0 h-8 w-8 rounded-lg"
                  style={{ color: CSS.textSecondary }}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Home Dashboard</TooltipContent>
            </Tooltip>

            <div
              className="w-px h-5 mx-1 hidden md:block"
              style={{ backgroundColor: CSS.divider }}
            />

            {/* Back Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  disabled={!canBack}
                  className="shrink-0 h-8 w-8 rounded-lg"
                  style={{
                    color: canBack ? CSS.textSecondary : CSS.textDisabled,
                    opacity: canBack ? 1 : 0.3,
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Go Back</TooltipContent>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goForward}
                  disabled={!canForward}
                  className="shrink-0 h-8 w-8 rounded-lg"
                  style={{
                    color: canForward ? CSS.textSecondary : CSS.textDisabled,
                    opacity: canForward ? 1 : 0.3,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Go Forward</TooltipContent>
            </Tooltip>

            <div
              className="w-px h-5 mx-1 hidden md:block"
              style={{ backgroundColor: CSS.divider }}
            />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden shrink-0 h-8 w-8 rounded-lg"
              style={{ color: CSS.textSecondary }}
            >
              <Menu className="w-4 h-4" />
            </Button>

            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="NueEra"
                width={24}
                height={16}
                className="object-contain rounded-sm"
              />
              <span
                className="text-sm font-semibold tracking-wide hidden sm:block"
                style={{ color: CSS.textMuted }}
              >
                Finance
              </span>
              <ChevronRight className="w-3 h-3 hidden sm:block" style={{ color: CSS.textDisabled }} />
              <span className="text-sm font-medium" style={{ color: CSS.text }}>
                {currentLabel}
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl w-64"
              style={{
                backgroundColor: CSS.inputBg,
                border: `1px solid ${CSS.borderLight}`,
              }}
            >
              <Search className="w-4 h-4 shrink-0" style={{ color: CSS.textDisabled }} />
              <input
                type="text"
                placeholder="Search finance... (⌘K)"
                className="bg-transparent text-sm focus:outline-none w-full"
                style={{
                  color: CSS.text,
                }}
              />
              <kbd
                className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{
                  backgroundColor: CSS.hoverBg,
                  color: CSS.textMuted,
                }}
              >
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>

            {/* Date Range */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-8 w-8 rounded-lg"
                  style={{ color: CSS.textSecondary }}
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Date Range</TooltipContent>
            </Tooltip>

            {/* Filters */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-8 w-8 rounded-lg"
                  style={{ color: CSS.textSecondary }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filters</TooltipContent>
            </Tooltip>

            {/* Quick Create */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavClick('invoices')}
                  className="hidden md:flex h-8 w-8 rounded-lg"
                  style={{ color: CSS.textSecondary }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create Invoice</TooltipContent>
            </Tooltip>

            {/* Alerts Bell */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-lg"
                  style={{ color: CSS.textSecondary }}
                >
                  <Bell className="w-4 h-4" />
                  {unreadAlertCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-1"
                      style={{
                        backgroundColor: CSS.danger,
                        color: '#fff',
                      }}
                    >
                      {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {unreadAlertCount > 0 ? `${unreadAlertCount} unread alerts` : 'No new alerts'}
              </TooltipContent>
            </Tooltip>

            {/* AI CFO Sparkles */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden md:flex h-8 w-8 rounded-lg"
                  style={{ color: MODULE_ACCENTS.finance.primary }}
                >
                  <Sparkles className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      boxShadow: [
                        `0 0 0 0 rgba(139,92,246,0)`,
                        `0 0 0 4px rgba(139,92,246,0.1)`,
                        `0 0 0 0 rgba(139,92,246,0)`,
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI CFO Assistant</TooltipContent>
            </Tooltip>

            {/* Theme Toggle — useTheme only for setTheme, NOT for styling */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="h-8 w-8 rounded-lg"
              style={{ color: CSS.textSecondary }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Avatar & Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 rounded-lg font-bold text-xs"
                style={{
                  backgroundColor: MODULE_ACCENTS.finance.primary,
                  color: '#fff',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-56 rounded-xl p-2 z-50"
                    style={{
                      backgroundColor: CSS.elevated,
                      border: `1px solid ${CSS.border}`,
                      boxShadow: CSS.shadowDropdown,
                    }}
                  >
                    <div
                      className="px-3 py-2 mb-1"
                      style={{ borderBottom: `1px solid ${CSS.divider}` }}
                    >
                      <p className="text-sm font-semibold" style={{ color: CSS.text }}>
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs" style={{ color: CSS.textMuted }}>
                        {user?.email || ''}
                      </p>
                    </div>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: CSS.textSecondary }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg;
                        (e.currentTarget as HTMLElement).style.color = CSS.text;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = CSS.textSecondary;
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ========== Content Area ========== */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mobile Backdrop */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 md:hidden"
                style={{ backgroundColor: CSS.overlay }}
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
                transition={{ duration: 0.2, ease: ANIMATION.ease }}
                className={cn(
                  'border-r shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
                  isMobile && 'w-[280px]',
                )}
                style={{
                  backgroundColor: CSS.sidebarBg,
                  borderRight: `1px solid ${CSS.border}`,
                }}
              >
                {/* Nav Sections */}
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                  {navSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-2">
                      <div className="px-3 pt-3 pb-1.5">
                        <span
                          className="text-[10px] font-semibold tracking-wider uppercase"
                          style={{ color: CSS.textMuted }}
                        >
                          {section.title}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {section.items.map((item) => (
                          <SidebarNavItem
                            key={item.id}
                            item={item}
                            isActive={currentPage === item.id}
                            onClick={() => handleNavClick(item.id)}
                          />
                        ))}
                      </div>

                      {sectionIdx < navSections.length - 1 && (
                        <div
                          className="mx-3 mt-3 mb-1"
                          style={{ borderTop: `1px solid ${CSS.borderLight}` }}
                        />
                      )}
                    </div>
                  ))}
                </nav>

                {/* Sidebar Footer — Finance Alert Card */}
                <div
                  className="p-3 space-y-3"
                  style={{ borderTop: `1px solid ${CSS.border}` }}
                >
                  <div
                    className="rounded-xl p-3"
                    style={{
                      backgroundColor: CSS.warningBg,
                      border: `1px solid ${CSS.borderLight}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
                      <span className="text-xs font-medium" style={{ color: CSS.warning }}>
                        Finance Alert
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: CSS.textSecondary }}>
                      GSTR-1 for March is overdue — file by April 20 to avoid ₹200/day penalty.
                      8 invoices overdue totaling ₹87.5L.
                    </p>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: CSS.bg }}
          >
            <ErrorBoundary>
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
