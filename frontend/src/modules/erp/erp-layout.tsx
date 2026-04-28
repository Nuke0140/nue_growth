'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ErpPage } from './types';

// ---- Navigation definitions ----

interface NavItem {
  id: ErpPage;
  label: string;
  icon: React.ElementType;
  parentSection?: 'hrm';
}

interface NavSubItem {
  id: ErpPage;
  label: string;
  icon: React.ElementType;
}

const topNavItems: NavItem[] = [
  { id: 'ops-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks-board', label: 'Tasks', icon: Columns3 },
];

const hrmSubItems: NavSubItem[] = [
  { id: 'employees', label: 'Employees', icon: UserIcon },
  { id: 'departments', label: 'Departments', icon: Network },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leaves', label: 'Leaves', icon: CalendarOff },
  { id: 'payroll', label: 'Payroll', icon: Banknote },
  { id: 'compensation', label: 'Compensation', icon: Wallet },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
];

const bottomNavItems: NavItem[] = [
  { id: 'assets', label: 'Assets', icon: Monitor },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
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
};

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
};

// ---- Page Content ----
function PageContent() {
  const { currentPage } = useErpStore();
  const PageComponent = pageComponents[currentPage] || null;

  if (!PageComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

// ---- Sidebar Nav Item ----
function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem | NavSubItem;
  isActive: boolean;
  onClick: () => void;
}) {
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
      <span className="truncate">{item.label}</span>
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
                    onClick={() => setHrmExpanded(!hrmExpanded)}
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

  const role = user?.role || 'Team Member';

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
  } = useErpStore();
  const isMobile = useIsMobile();

  const canBack = checkCanBack();
  const canForward = checkCanForward();
  const currentLabel = allNavMap[currentPage] || 'Operations';
  const isDetailPage = currentPage.endsWith('-detail');

  // CMD+K shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if exists
        const searchInput = document.getElementById('erp-search-input');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] w-56 lg:w-64 transition-colors focus-within:border-[rgba(204,92,55,0.3)] focus-within:bg-[rgba(255,255,255,0.05)]">
          <Search className="w-4 h-4 shrink-0 text-[rgba(245,245,245,0.25)]" />
          <input
            id="erp-search-input"
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[13px] focus:outline-none w-full text-[rgba(245,245,245,0.7)] placeholder:text-[rgba(245,245,245,0.2)]"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.06)] text-[rgba(245,245,245,0.25)]">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>

        {/* Mobile search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Search className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Search</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#cc5c37] text-[9px] font-bold flex items-center justify-center text-white">
                3
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>

        {/* Quick Create */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-8 w-8 rounded-lg bg-[#cc5c37] text-white hover:bg-[#cc5c37]/90 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Quick Create</TooltipContent>
        </Tooltip>

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
      </div>
    </TooltipProvider>
  );
}
