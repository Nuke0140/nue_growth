'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useErpStore } from './erp-store';
import { useAuthStore } from '@/store/auth-store';

// Existing pages that have been built
import ErpDashboardPage from './erp-dashboard-page';
import ProjectsPage from './projects-page';
import ProjectDetailPage from './project-detail-page';
import TasksBoardPage from './tasks-board-page';
import EmployeesPage from './employees-page';
import EmployeeDetailPage from './employee-detail-page';
import DepartmentsPage from './departments-page';
import AttendancePage from './attendance-page';
import LeavesPage from './leaves-page';
import PayrollPage from './payroll-page';
import CompensationPage from './compensation-page';
import PerformancePage from './performance-page';
import DocumentsPage from './documents-page';
import AssetsPage from './assets-page';
import ApprovalsPage from './approvals-page';
import AiOpsPage from './ai-ops-page';
import HrmPage from './hrm-page';

// Ops components
import { CommandPalette } from './components/ops/command-palette';
import { SkeletonDashboard } from './components/ops/skeleton-loader';

// Mock data
import { mockNotifications } from './data/mock-data';

// Icons
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  X,
  Menu,
  ChevronRight,
  ChevronDown,
  Command,
  Home,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Settings,
  User,
  // Navigation
  LayoutDashboard,
  FolderKanban,
  Columns3,
  Users,
  User as UserIcon,
  Network,
  Clock,
  CalendarOff,
  Banknote,
  Wallet,
  BarChart3,
  FolderOpen,
  Monitor,
  CheckCircle2,
  // New icons
  History,
  Sparkles,
  UserPlus,
  FileText,
  ListPlus,
  // Notification type icons
  Info,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

// shadcn/ui
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { LucideIcon } from 'lucide-react';
import type { ErpPage } from './types';

// ---- Navigation definitions ----

interface NavItem {
  id: ErpPage;
  label: string;
  icon: LucideIcon;
  badge?: number;
  parentSection?: 'hrm';
}

interface NavSubItem {
  id: ErpPage;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const topNavItems: NavItem[] = [
  { id: 'ops-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks-board', label: 'Tasks', icon: Columns3, badge: 12 },
  { id: 'ai-ops' as ErpPage, label: 'AI Intelligence', icon: Sparkles },
];

const hrmSubItems: NavSubItem[] = [
  { id: 'employees', label: 'Employees', icon: UserIcon },
  { id: 'departments', label: 'Departments', icon: Network },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leaves', label: 'Leaves', icon: CalendarOff, badge: 5 },
  { id: 'payroll', label: 'Payroll', icon: Banknote },
  { id: 'compensation', label: 'Compensation', icon: Wallet },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
];

const bottomNavItems: NavItem[] = [
  { id: 'assets', label: 'Assets', icon: Monitor },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: 3 },
];

// Flatten all items for breadcrumb lookup
const allNavMap: Record<ErpPage, string> = {
  'ops-dashboard': 'Dashboard',
  'projects': 'Projects',
  'project-detail': 'Project Detail',
  'tasks-board': 'Tasks',
  'employees': 'Employees',
  'employee-detail': 'Employee Detail',
  'departments': 'Departments',
  'attendance': 'Attendance',
  'leaves': 'Leaves',
  'payroll': 'Payroll',
  'compensation': 'Compensation',
  'performance': 'Performance',
  'documents': 'Documents',
  'assets': 'Assets',
  'approvals': 'Approvals',
  'ai-ops': 'AI Intelligence',
  'hrm': 'HRM',
};

// Icon lookup for recent pages dropdown
const navIconMap: Record<string, LucideIcon> = {
  'ops-dashboard': LayoutDashboard,
  'projects': FolderKanban,
  'project-detail': FolderKanban,
  'tasks-board': Columns3,
  'employees': UserIcon,
  'employee-detail': UserIcon,
  'departments': Network,
  'attendance': Clock,
  'leaves': CalendarOff,
  'payroll': Banknote,
  'compensation': Wallet,
  'performance': BarChart3,
  'documents': FolderOpen,
  'assets': Monitor,
  'approvals': CheckCircle2,
  'ai-ops': Sparkles,
  'hrm': Users,
};

// Notification type → icon + color config
const notifTypeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
};

// Format notification timestamp to short time
function formatNotifTime(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ---- Page component map ----
const pageComponents: Record<ErpPage, React.ComponentType> = {
  'ops-dashboard': ErpDashboardPage,
  'projects': ProjectsPage,
  'project-detail': ProjectDetailPage,
  'tasks-board': TasksBoardPage,
  'employees': EmployeesPage,
  'employee-detail': EmployeeDetailPage,
  'departments': DepartmentsPage,
  'attendance': AttendancePage,
  'leaves': LeavesPage,
  'payroll': PayrollPage,
  'compensation': CompensationPage,
  'performance': PerformancePage,
  'documents': DocumentsPage,
  'assets': AssetsPage,
  'approvals': ApprovalsPage,
  'ai-ops': AiOpsPage,
  'hrm': HrmPage,
};

// ---- Page Content (with progress bar + skeleton loading) ----
function PageContent() {
  const { currentPage } = useErpStore();
  const [loading, setLoading] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const prevPageRef = useRef(currentPage);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      prevPageRef.current = currentPage;
      setLoading(true);
      setProgressWidth(0);

      // Clear any existing timers
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

      // Start progress bar animation after a tick
      progressTimerRef.current = setTimeout(() => setProgressWidth(100), 10);

      // Hide progress bar after animation completes
      clearTimerRef.current = setTimeout(() => setProgressWidth(0), 350);

      // End skeleton loading after 200ms
      const loadTimer = setTimeout(() => setLoading(false), 200);

      return () => {
        clearTimeout(loadTimer);
        if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      };
    }
  }, [currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const PageComponent = pageComponents[currentPage] || null;

  if (!PageComponent) return null;

  return (
    <div className="relative h-full">
      {/* Page transition progress bar */}
      {progressWidth > 0 && (
        <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
          <div
            className="ops-progress-bar h-full bg-[#cc5c37] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}

      {/* Page content with skeleton loading */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
        >
          {loading ? <SkeletonDashboard /> : <PageComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---- Sidebar Nav Item (with badge support) ----
function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem | NavSubItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const badge = 'badge' in item ? (item as NavItem | NavSubItem & { badge?: number }).badge : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 group relative',
        isActive
          ? 'bg-[rgba(204,92,55,0.08)] text-[#f5f5f5] font-medium'
          : 'text-[rgba(245,245,245,0.5)] hover:text-[rgba(245,245,245,0.85)] hover:bg-[rgba(255,255,255,0.04)]'
      )}
    >
      {/* Active left accent border */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#cc5c37]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <item.icon
        className={cn(
          'w-[18px] h-[18px] transition-colors shrink-0',
          isActive
            ? 'text-[#cc5c37]'
            : 'text-[rgba(245,245,245,0.3)] group-hover:text-[rgba(245,245,245,0.6)]'
        )}
      />
      <span className="truncate flex-1 text-left">{item.label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#cc5c37] text-white px-1.5 leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// ---- Sidebar ----
function Sidebar() {
  const {
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    hrmExpanded,
    setHrmExpanded,
    navigateTo,
  } = useErpStore();
  const isMobile = useIsMobile();

  const isHrmActive = [
    'hrm',
    'employees',
    'employee-detail',
    'departments',
    'attendance',
    'leaves',
    'payroll',
    'compensation',
    'performance',
    'documents',
  ].includes(currentPage);

  const handleNavClick = (page: ErpPage) => {
    navigateTo(page);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={isMobile ? { x: -260 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 240, opacity: 1 }}
            exit={isMobile ? { x: -260 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
              'bg-[#1b1c1e] border-r border-[rgba(255,255,255,0.06)]',
              isMobile && 'w-[260px]'
            )}
          >
            <div className="h-full flex flex-col">
              {/* Logo area */}
              <div className="h-14 flex items-center gap-2.5 px-4 shrink-0 border-b border-[rgba(255,255,255,0.06)]">
                <div className="w-8 h-8 rounded-lg bg-[#cc5c37] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#f5f5f5] leading-tight">
                    Operations
                  </span>
                  <span className="text-[10px] text-[rgba(245,245,245,0.3)] leading-tight">
                    ERP Module
                  </span>
                </div>
                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto h-7 w-7 text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar">
                {/* Section: Operations */}
                <div className="mb-1">
                  <div className="px-3 pt-2 pb-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[rgba(245,245,245,0.2)]">
                      Operations
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {topNavItems.map((item) => (
                      <SidebarNavItem
                        key={item.id}
                        item={item}
                        isActive={currentPage === item.id}
                        onClick={() => handleNavClick(item.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Section: HRM (collapsible) */}
                <div className="mb-1">
                  <div className="px-3 pt-3 pb-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[rgba(245,245,245,0.2)]">
                      Human Resources
                    </span>
                  </div>

                  {/* HRM toggle header */}
                  <button
                    onClick={() => {
                      navigateTo('hrm');
                      if (!hrmExpanded) setHrmExpanded(true);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 group',
                      isHrmActive && !hrmExpanded
                        ? 'text-[rgba(245,245,245,0.7)]'
                        : 'text-[rgba(245,245,245,0.5)] hover:text-[rgba(245,245,245,0.85)] hover:bg-[rgba(255,255,255,0.04)]'
                    )}
                  >
                    <Users
                      className={cn(
                        'w-[18px] h-[18px] transition-colors shrink-0',
                        isHrmActive
                          ? 'text-[#cc5c37]'
                          : 'text-[rgba(245,245,245,0.3)] group-hover:text-[rgba(245,245,245,0.6)]'
                      )}
                    />
                    <span className="flex-1 text-left truncate">HRM</span>
                    <motion.div
                      animate={{ rotate: hrmExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-[rgba(245,245,245,0.2)]" />
                    </motion.div>
                  </button>

                  {/* HRM sub-items */}
                  <AnimatePresence initial={false}>
                    {hrmExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 pl-3 border-l border-[rgba(255,255,255,0.06)] space-y-0.5 py-1">
                          {hrmSubItems.map((item) => (
                            <SidebarNavItem
                              key={item.id}
                              item={item}
                              isActive={currentPage === item.id}
                              onClick={() => handleNavClick(item.id)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section: Bottom items */}
                <div className="mb-1">
                  <div className="px-3 pt-3 pb-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[rgba(245,245,245,0.2)]">
                      Management
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {bottomNavItems.map((item) => (
                      <SidebarNavItem
                        key={item.id}
                        item={item}
                        isActive={currentPage === item.id}
                        onClick={() => handleNavClick(item.id)}
                      />
                    ))}
                  </div>
                </div>
              </nav>

              {/* Sidebar footer — user profile */}
              <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
                <SidebarFooter />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ---- Sidebar Footer ----
function SidebarFooter() {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const role = (user as Record<string, unknown>)?.role as string || 'Team Member';

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="bg-[#cc5c37] text-white text-xs font-semibold rounded-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#f5f5f5] truncate">
          {user?.name || 'User'}
        </p>
        <p className="text-[11px] text-[rgba(245,245,245,0.35)] truncate">
          {role}
        </p>
      </div>
    </div>
  );
}

// ---- Topbar ----
function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const {
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    goBack,
    goForward,
    canGoBack: checkCanBack,
    canGoForward: checkCanForward,
    setCommandPaletteOpen,
    recentPages,
    navigateTo,
  } = useErpStore();
  const isMobile = useIsMobile();

  // Notification local state (initialized from mock data)
  const [notifState, setNotifState] = useState(mockNotifications);
  const unreadCount = notifState.filter((n) => !n.read).length;

  const canBack = checkCanBack();
  const canForward = checkCanForward();
  const currentLabel = allNavMap[currentPage] || 'Operations';
  const isDetailPage = currentPage.endsWith('-detail');

  // CMD+K opens command palette
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    },
    [setCommandPaletteOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Mark all notifications as read
  const markAllRead = useCallback(() => {
    setNotifState((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[rgba(255,255,255,0.06)] bg-[#1b1c1e]/95 backdrop-blur-sm flex items-center justify-between px-4 gap-4 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-1.5 min-w-0">
        {/* Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModule}
              className="shrink-0 h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Home className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Home Dashboard</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden md:block bg-[rgba(255,255,255,0.06)]" />

        {/* Back / Forward */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              disabled={!canBack}
              className={cn(
                'shrink-0 h-8 w-8 rounded-lg transition-opacity',
                !canBack
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Go Back</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goForward}
              disabled={!canForward}
              className={cn(
                'shrink-0 h-8 w-8 rounded-lg transition-opacity',
                !canForward
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Go Forward</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden md:block bg-[rgba(255,255,255,0.06)]" />

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden shrink-0 h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] text-[rgba(245,245,245,0.3)] hidden sm:block shrink-0">
            Operations
          </span>
          <ChevronRight className="w-3 h-3 text-[rgba(245,245,245,0.15)] hidden sm:block shrink-0" />
          <span className="text-[13px] font-medium text-[#f5f5f5] truncate">
            {currentLabel}
          </span>
          {isDetailPage && (
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0 h-5 bg-[rgba(204,92,55,0.12)] text-[#cc5c37] border-0 rounded-md"
            >
              Detail
            </Badge>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search bar — click opens command palette */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setCommandPaletteOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setCommandPaletteOpen(true);
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] w-56 lg:w-64 transition-colors hover:border-[rgba(204,92,55,0.2)] hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
        >
          <Search className="w-4 h-4 shrink-0 text-[rgba(245,245,245,0.25)]" />
          <span className="text-[13px] text-[rgba(245,245,245,0.2)]">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.06)] text-[rgba(245,245,255,0.25)] ml-auto">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>

        {/* Mobile search — opens command palette */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Search className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Search</TooltipContent>
        </Tooltip>

        {/* Recent Pages (History) Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <History className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Recent Pages</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl ops-dropdown-enter"
          >
            <DropdownMenuLabel className="text-[rgba(245,245,245,0.4)] text-xs font-semibold tracking-wider uppercase">
              Recent Pages
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
            {recentPages.length === 0 ? (
              <div className="px-3 py-4 text-center text-[13px] text-[rgba(245,245,245,0.3)]">
                No recent pages
              </div>
            ) : (
              recentPages.slice(0, 8).map((page) => {
                const Icon = navIconMap[page] || LayoutDashboard;
                const label = allNavMap[page] || page;
                return (
                  <DropdownMenuItem
                    key={page}
                    onClick={() => navigateTo(page)}
                    className={cn(
                      'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-lg mx-1',
                      page === currentPage
                        ? 'text-[#f5f5f5] bg-[rgba(204,92,55,0.08)]'
                        : 'text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[rgba(245,245,245,0.35)]" />
                    <span className="truncate">{label}</span>
                    {page === currentPage && (
                      <span className="ml-auto text-[10px] text-[#cc5c37] font-medium">Current</span>
                    )}
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#cc5c37] text-[9px] font-bold flex items-center justify-center text-white px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl p-0 ops-dropdown-enter"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-sm font-semibold text-[#f5f5f5]">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-[#cc5c37] hover:text-[#cc5c37]/80 transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {notifState.slice(0, 6).map((notif) => {
                const typeConfig = notifTypeConfig[notif.type] || notifTypeConfig.info;
                const NotifIcon = typeConfig.icon;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                      !notif.read
                        ? 'bg-[rgba(204,92,55,0.04)] hover:bg-[rgba(204,92,55,0.07)]'
                        : 'hover:bg-[rgba(255,255,255,0.03)]'
                    )}
                    onClick={() => {
                      if (!notif.read) {
                        setNotifState((prev) =>
                          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                        );
                      }
                      if (notif.actionUrl) {
                        navigateTo(notif.actionUrl as ErpPage);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        typeConfig.bg
                      )}
                    >
                      <NotifIcon className={cn('w-4 h-4', typeConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[13px] truncate',
                            notif.read
                              ? 'text-[rgba(245,245,245,0.6)]'
                              : 'text-[#f5f5f5] font-medium'
                          )}
                        >
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#cc5c37] shrink-0" />
                        )}
                      </div>
                      <p className="text-[12px] text-[rgba(245,245,245,0.35)] line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-[rgba(245,245,245,0.2)] mt-1 block">
                        {formatNotifTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-2">
              <button className="w-full text-center text-[12px] font-medium text-[#cc5c37] hover:text-[#cc5c37]/80 transition-colors py-1 cursor-pointer">
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex h-8 w-8 rounded-lg bg-[#cc5c37] text-white hover:bg-[#cc5c37]/90 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Quick Create</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl ops-dropdown-enter"
          >
            <DropdownMenuLabel className="text-[rgba(245,245,245,0.4)] text-xs font-semibold tracking-wider uppercase">
              Quick Create
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
            <DropdownMenuItem
              onClick={() => navigateTo('projects')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg mx-1 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-[rgba(245,245,245,0.35)]" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigateTo('employees')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg mx-1 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[rgba(245,245,245,0.35)]" />
              Add Employee
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigateTo('leaves')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg mx-1 cursor-pointer"
            >
              <CalendarOff className="w-4 h-4 text-[rgba(245,245,245,0.35)]" />
              Apply Leave
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigateTo('tasks-board')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg mx-1 cursor-pointer"
            >
              <ListPlus className="w-4 h-4 text-[rgba(245,245,245,0.35)]" />
              Create Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </TooltipContent>
        </Tooltip>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-[#cc5c37] text-white text-xs font-semibold rounded-lg">
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#222325] border-[rgba(255,255,255,0.08)] rounded-xl"
          >
            <div className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-1">
              <p className="text-sm font-semibold text-[#f5f5f5]">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-[rgba(245,245,245,0.35)]">
                {user?.email || ''}
              </p>
            </div>
            <DropdownMenuItem className="text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer focus:bg-[rgba(255,255,255,0.06)] focus:text-[#f5f5f5]">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer focus:bg-[rgba(255,255,255,0.06)] focus:text-[#f5f5f5]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)]" />
            <DropdownMenuItem
              onClick={logout}
              className="text-[rgba(245,245,245,0.4)] hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer focus:bg-red-500/10 focus:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ---- Main ERP Layout ----
export default function ErpLayout() {
  const { recentPages, navigateTo } = useErpStore();

  // Build command items for the command palette
  const commands = useMemo(() => {
    const allItems = [
      ...topNavItems.map((item) => ({
        id: item.id,
        icon: item.icon as LucideIcon,
        label: item.label,
        section: 'pages' as const,
        action: () => navigateTo(item.id),
      })),
      ...hrmSubItems.map((item) => ({
        id: item.id,
        icon: item.icon as LucideIcon,
        label: item.label,
        section: 'pages' as const,
        action: () => navigateTo(item.id),
      })),
      ...bottomNavItems.map((item) => ({
        id: item.id,
        icon: item.icon as LucideIcon,
        label: item.label,
        section: 'pages' as const,
        action: () => navigateTo(item.id),
      })),
    ];
    return allItems;
  }, [navigateTo]);

  // Build recent pages for command palette
  const recentCommands = useMemo(() => {
    return recentPages
      .slice(0, 5)
      .map((page) => ({
        id: `recent-${page}`,
        icon: (navIconMap[page] || LayoutDashboard) as LucideIcon,
        label: allNavMap[page] || page,
        action: () => navigateTo(page),
      }));
  }, [recentPages, navigateTo]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col overflow-hidden bg-[#1b1c1e] text-[#f5f5f5]">
        {/* Topbar */}
        <Topbar />

        {/* Main area: sidebar + content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Content area */}
          <main className="flex-1 overflow-hidden bg-[#1b1c1e]">
            <PageContent />
          </main>
        </div>

        {/* Command Palette (rendered here for global access) */}
        <CommandPalette commands={commands} recentPages={recentCommands} />
      </div>
    </TooltipProvider>
  );
}
