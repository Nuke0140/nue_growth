'use client';

import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useErpStore } from './erp-store';
import { useAuthStore } from '@/store/auth-store';

// Lazy-loaded pages — code-split for faster initial load
const ErpDashboardPage = lazy(() => import('./erp-dashboard-page').then(m => ({ default: m.default })));
const ProjectsPage = lazy(() => import('./projects-page').then(m => ({ default: m.default })));
const ProjectDetailPage = lazy(() => import('./project-detail-page').then(m => ({ default: m.default })));
const TasksBoardPage = lazy(() => import('./tasks-board-page').then(m => ({ default: m.default })));
const EmployeesPage = lazy(() => import('./employees-page').then(m => ({ default: m.default })));
const EmployeeDetailPage = lazy(() => import('./employee-detail-page').then(m => ({ default: m.default })));
const DepartmentsPage = lazy(() => import('./departments-page').then(m => ({ default: m.default })));
const AttendancePage = lazy(() => import('./attendance-page').then(m => ({ default: m.default })));
const LeavesPage = lazy(() => import('./leaves-page').then(m => ({ default: m.default })));
const PayrollPage = lazy(() => import('./payroll-page').then(m => ({ default: m.default })));
const CompensationPage = lazy(() => import('./compensation-page').then(m => ({ default: m.default })));
const PerformancePage = lazy(() => import('./performance-page').then(m => ({ default: m.default })));
const DocumentsPage = lazy(() => import('./documents-page').then(m => ({ default: m.default })));
const AssetsPage = lazy(() => import('./assets-page').then(m => ({ default: m.default })));
const ApprovalsPage = lazy(() => import('./approvals-page').then(m => ({ default: m.default })));
const AiOpsPage = lazy(() => import('./ai-ops-page').then(m => ({ default: m.default })));
const HrmPage = lazy(() => import('./hrm-page').then(m => ({ default: m.default })));

// Lazy-loaded orphaned pages — now wired into layout
const InvoicesPage = lazy(() => import('./invoices-page').then(m => ({ default: m.default })));
const VendorsPage = lazy(() => import('./vendor-page').then(m => ({ default: m.default })));
const FinanceOpsPage = lazy(() => import('./finance-ops-page').then(m => ({ default: m.default })));
const ProfitabilityPage = lazy(() => import('./profitability-page').then(m => ({ default: m.default })));
const DeliveryOpsPage = lazy(() => import('./delivery-operations-page').then(m => ({ default: m.default })));
const ResourcePlanningPage = lazy(() => import('./resource-planning-page').then(m => ({ default: m.default })));
const WorkloadPage = lazy(() => import('./workload-page').then(m => ({ default: m.default })));
const SopTemplatesPage = lazy(() => import('./sop-templates-page').then(m => ({ default: m.default })));
const AiOpsIntelligencePage = lazy(() => import('./ai-ops-intelligence-page').then(m => ({ default: m.default })));
const EmployeeAnalyticsPage = lazy(() => import('./employee-analytics-page').then(m => ({ default: m.default })));
const IncentivesPage = lazy(() => import('./incentives-page').then(m => ({ default: m.default })));
const OnboardingPage = lazy(() => import('./onboarding-page').then(m => ({ default: m.default })));
const ShiftsPage = lazy(() => import('./shifts-page').then(m => ({ default: m.default })));
const InternalChatPage = lazy(() => import('./internal-chat-page').then(m => ({ default: m.default })));
const AssetManagementPage = lazy(() => import('./asset-management-page').then(m => ({ default: m.default })));
const OpsDashboardPage = lazy(() => import('./ops-dashboard-page').then(m => ({ default: m.default })));

// Design tokens for consistent animation
import { ANIMATION } from '@/styles/design-tokens';

// Ops components
import { CommandPalette } from './components/ops/command-palette';
import { SkeletonDashboard } from '@/components/shared/skeleton';
import { CreateModal } from './components/ops/create-modal';
import { DensityToggle } from './components/ops/density-toggle';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { ContextualSidebar } from './components/ops/contextual-sidebar';
import { useFeedbackStore } from '@/hooks/use-action-feedback.tsx';

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
  // New icons for sidebar
  Receipt,
  Truck,
  Coins,
  TrendingDown,
  Package,
  FileCode,
  MessageSquare,
  UserCog,
  BarChart2,
  Brain,
  GitBranch,
  Wrench,
  CalendarClock,
  Gift,
  // Existing new icons
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
import type { ErpPage, Toast } from './types';
import type { CreateEntityType } from './erp-store';
import { usePermissions } from './hooks/use-permissions';

// ---- Navigation definitions ----

interface NavSubItem {
  id: ErpPage;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavSubItem[];
}

const navSections: NavSection[] = [
  {
    id: 'operations',
    label: 'Operations',
    icon: LayoutDashboard,
    items: [
      { id: 'ops-dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'tasks-board', label: 'Tasks', icon: Columns3, badge: 12 },
      { id: 'delivery-ops' as ErpPage, label: 'Delivery', icon: Truck, badge: 4 },
      { id: 'sop-templates' as ErpPage, label: 'SOPs', icon: FileCode },
      { id: 'internal-chat' as ErpPage, label: 'Chat', icon: MessageSquare, badge: 3 },
    ],
  },
  {
    id: 'hrm',
    label: 'Human Resources',
    icon: Users,
    items: [
      { id: 'employees', label: 'Employees', icon: UserIcon },
      { id: 'employee-analytics' as ErpPage, label: 'Analytics', icon: BarChart2 },
      { id: 'departments', label: 'Departments', icon: Network },
      { id: 'attendance', label: 'Attendance', icon: Clock },
      { id: 'shifts' as ErpPage, label: 'Shifts', icon: CalendarClock },
      { id: 'leaves', label: 'Leaves', icon: CalendarOff, badge: 5 },
      { id: 'payroll', label: 'Payroll', icon: Banknote },
      { id: 'compensation', label: 'Compensation', icon: Wallet },
      { id: 'incentives' as ErpPage, label: 'Incentives', icon: Gift },
      { id: 'performance', label: 'Performance', icon: BarChart3 },
      { id: 'onboarding' as ErpPage, label: 'Onboarding', icon: UserCog },
      { id: 'documents', label: 'Documents', icon: FolderOpen },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Coins,
    items: [
      { id: 'invoices' as ErpPage, label: 'Invoices', icon: Receipt, badge: 2 },
      { id: 'vendors' as ErpPage, label: 'Vendors', icon: Package },
      { id: 'finance-ops' as ErpPage, label: 'Finance Ops', icon: TrendingDown },
      { id: 'profitability' as ErpPage, label: 'Profitability', icon: BarChart2 },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: Wrench,
    items: [
      { id: 'resource-planning' as ErpPage, label: 'Planning', icon: GitBranch },
      { id: 'workload' as ErpPage, label: 'Workload', icon: BarChart2 },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    icon: Settings,
    items: [
      { id: 'assets', label: 'Assets', icon: Monitor },
      { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badge: 3 },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: Sparkles,
    items: [
      { id: 'ai-ops' as ErpPage, label: 'AI Ops', icon: Brain },
      { id: 'ai-ops-intelligence' as ErpPage, label: 'AI Deep Dive', icon: Sparkles },
    ],
  },
];

// Flatten all items for breadcrumb lookup
const allNavMap: Record<string, string> = {
  'ops-dashboard': 'Dashboard',
  'projects': 'Projects',
  'project-detail': 'Project Detail',
  'tasks-board': 'Tasks',
  'employees': 'Employees',
  'employee-detail': 'Employee Detail',
  'employee-analytics': 'Employee Analytics',
  'departments': 'Departments',
  'attendance': 'Attendance',
  'shifts': 'Shifts',
  'leaves': 'Leaves',
  'payroll': 'Payroll',
  'compensation': 'Compensation',
  'incentives': 'Incentives',
  'performance': 'Performance',
  'onboarding': 'Onboarding',
  'documents': 'Documents',
  'invoices': 'Invoices',
  'vendors': 'Vendors',
  'finance-ops': 'Finance Ops',
  'profitability': 'Profitability',
  'delivery-ops': 'Delivery Ops',
  'resource-planning': 'Resource Planning',
  'workload': 'Workload',
  'sop-templates': 'SOP Templates',
  'assets': 'Assets',
  'approvals': 'Approvals',
  'ai-ops': 'AI Ops',
  'ai-ops-intelligence': 'AI Deep Dive',
  'internal-chat': 'Internal Chat',
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
  'employee-analytics': BarChart2,
  'departments': Network,
  'attendance': Clock,
  'shifts': CalendarClock,
  'leaves': CalendarOff,
  'payroll': Banknote,
  'compensation': Wallet,
  'incentives': Gift,
  'performance': BarChart3,
  'onboarding': UserCog,
  'documents': FolderOpen,
  'invoices': Receipt,
  'vendors': Package,
  'finance-ops': TrendingDown,
  'profitability': BarChart2,
  'delivery-ops': Truck,
  'resource-planning': GitBranch,
  'workload': BarChart2,
  'sop-templates': FileCode,
  'assets': Monitor,
  'approvals': CheckCircle2,
  'ai-ops': Brain,
  'ai-ops-intelligence': Sparkles,
  'internal-chat': MessageSquare,
  'hrm': Users,
};

// Notification type → icon + color config
const notifTypeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
  error: { icon: AlertCircle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' },
  success: { icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
};

// Toast type → color config
const toastColorConfig: Record<string, { bg: string; border: string; icon: LucideIcon; iconColor: string }> = {
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2, iconColor: 'text-emerald-500 dark:text-emerald-400' },
  error: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle, iconColor: 'text-red-500 dark:text-red-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-500 dark:text-amber-400' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Info, iconColor: 'text-blue-500 dark:text-blue-400' },
};

// Format notification timestamp to short time
function formatNotifTime(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ---- Page component map ----
const pageComponents: Record<string, React.ComponentType> = {
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
  'ai-ops-intelligence': AiOpsIntelligencePage,
  'hrm': HrmPage,
  // Orphaned pages — now wired
  'invoices': InvoicesPage,
  'vendors': VendorsPage,
  'finance-ops': FinanceOpsPage,
  'profitability': ProfitabilityPage,
  'delivery-ops': DeliveryOpsPage,
  'resource-planning': ResourcePlanningPage,
  'workload': WorkloadPage,
  'sop-templates': SopTemplatesPage,
  'employee-analytics': EmployeeAnalyticsPage,
  'incentives': IncentivesPage,
  'onboarding': OnboardingPage,
  'shifts': ShiftsPage,
  'internal-chat': InternalChatPage,
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
            className="app-progress-bar h-full bg-[var(--app-accent)] transition-colors duration-200 ease-out rounded-full"
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
          transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.ease }}
          className="h-full"
        >
          {loading ? <SkeletonDashboard /> : (
            <Suspense fallback={<SkeletonDashboard />}>
              <PageComponent />
            </Suspense>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---- Toast Container ----
function ToastContainer() {
  const { toasts, removeToast } = useErpStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast: Toast) => {
          const config = toastColorConfig[toast.type] || toastColorConfig.info;
          const ToastIcon = config.icon;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.ease }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3 rounded-[var(--app-radius-lg)] border backdrop-blur-sm shadow-[var(--app-shadow-md)]-lg',
                'bg-[var(--app-card-bg)] border-[var(--app-border-strong)]',
                config.border
              )}
            >
              <div className={cn('w-5 h-5 mt-0.5 shrink-0', config.iconColor)}>
                <ToastIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--app-text)] leading-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-[12px] text-[var(--app-text-secondary)] mt-0.5 line-clamp-2">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ---- Mobile FAB (Floating Action Button) ----
function MobileFab() {
  const isMobile = useIsMobile();
  const { openCreateModal, setCommandPaletteOpen } = useErpStore();
  const [fabOpen, setFabOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] md:hidden">
      <AnimatePresence>
        {fabOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0"
              onClick={() => setFabOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: ANIMATION.duration.fast }}
              className="absolute bottom-16 right-0 bg-[var(--app-card-bg)] border border-[var(--app-border-strong)] rounded-[var(--app-radius-xl)] p-1.5 min-w-[180px] shadow-[var(--app-shadow-md)]-xl"
            >
              {[
                { label: 'New Project', icon: FolderKanban, action: () => openCreateModal('project') },
                { label: 'Create Task', icon: ListPlus, action: () => openCreateModal('task') },
                { label: 'Add Employee', icon: UserPlus, action: () => openCreateModal('employee') },
                { label: 'Search', icon: Search, action: () => setCommandPaletteOpen(true) },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setFabOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--app-radius-lg)] text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[var(--app-text-secondary)]" />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFabOpen(!fabOpen)}
        className="relative w-14 h-14 rounded-full bg-[var(--app-accent)] text-white shadow-[var(--app-shadow-md)]-lg shadow-[var(--app-shadow-md)]-[var(--app-accent)]/30 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: fabOpen ? 45 : 0 }}
          transition={{ duration: ANIMATION.duration.normal }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}

// ---- Sidebar Nav Item (with badge support) ----
function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavSubItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const badge = item.badge;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--app-radius-lg)] text-[13px] transition-colors duration-200 group relative',
        isActive
          ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] font-medium'
          : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
      )}
    >
      {/* Active left accent border */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[var(--app-accent)]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <item.icon
        className={cn(
          'w-[18px] h-[18px] transition-colors shrink-0',
          isActive
            ? 'text-[var(--app-accent)]'
            : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'
        )}
      />
      <span className="truncate flex-1 text-left">{item.label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--app-accent)] text-white px-1.5 leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// ---- Collapsible Section ----
function SidebarSection({
  section,
  isExpanded,
  isSectionActive,
  onToggle,
  currentPage,
  onNavClick,
  accessiblePages,
}: {
  section: NavSection;
  isExpanded: boolean;
  isSectionActive: boolean;
  onToggle: () => void;
  currentPage: ErpPage;
  onNavClick: (page: ErpPage) => void;
  accessiblePages: ErpPage[];
}) {
  const filteredItems = section.items.filter((item) => accessiblePages.includes(item.id));
  if (filteredItems.length === 0) return null;

  const firstPage = filteredItems[0].id;

  return (
    <div className="mb-1">
      {/* Section label */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--app-text-disabled)]">
          {section.label}
        </span>
      </div>

      {/* Section toggle header */}
      <button
        onClick={() => {
          onToggle();
          if (!isExpanded) {
            onNavClick(firstPage);
          }
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--app-radius-lg)] text-[13px] transition-colors duration-200 group',
          isSectionActive && !isExpanded
            ? 'text-[var(--app-text-secondary)]'
            : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
        )}
      >
        <section.icon
          className={cn(
            'w-[18px] h-[18px] transition-colors shrink-0',
            isSectionActive
              ? 'text-[var(--app-accent)]'
              : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'
          )}
        />
        <span className="flex-1 text-left truncate">{section.label}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: ANIMATION.duration.normal }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--app-text-disabled)]" />
        </motion.div>
      </button>

      {/* Sub-items */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease }}
            className="overflow-hidden"
          >
            <div className="ml-3 pl-3 border-l border-[var(--app-border)] space-y-0.5 py-1">
              {filteredItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isActive={currentPage === item.id}
                  onClick={() => onNavClick(item.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    financeExpanded,
    setFinanceExpanded,
    opsExpanded,
    setOpsExpanded,
    navigateTo,
  } = useErpStore();
  const isMobile = useIsMobile();
  const { accessiblePages } = usePermissions();

  // Section expand states — local for sections without dedicated store state
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [managementExpanded, setManagementExpanded] = useState(false);
  const [intelligenceExpanded, setIntelligenceExpanded] = useState(false);

  const handleNavClick = (page: ErpPage) => {
    navigateTo(page);
    if (isMobile) setSidebarOpen(false);
  };

  // Determine which section pages belong to
  const sectionPageMap: Record<string, ErpPage[]> = useMemo(() => ({
    operations: ['ops-dashboard', 'projects', 'project-detail', 'tasks-board', 'delivery-ops', 'sop-templates', 'internal-chat'],
    hrm: ['hrm', 'employees', 'employee-detail', 'employee-analytics', 'departments', 'attendance', 'shifts', 'leaves', 'payroll', 'compensation', 'incentives', 'performance', 'onboarding', 'documents'],
    finance: ['invoices', 'vendors', 'finance-ops', 'profitability'],
    resources: ['resource-planning', 'workload'],
    management: ['assets', 'approvals'],
    intelligence: ['ai-ops', 'ai-ops-intelligence'],
  }), []);

  const isSectionActive = (sectionId: string) =>
    sectionPageMap[sectionId]?.includes(currentPage) ?? false;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.duration.fast }}
            className="fixed inset-0 bg-[var(--app-overlay)] backdrop-blur-sm z-40"
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
            transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease }}
            className={cn(
              'shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
              'bg-[var(--app-bg)] border-r border-[var(--app-border)]',
              isMobile && 'w-[260px]'
            )}
          >
            <div className="h-full flex flex-col">
              {/* Logo area */}
              <div className="h-14 flex items-center gap-2.5 px-4 shrink-0 border-b border-[var(--app-border)]">
                <div className="w-8 h-8 rounded-[var(--app-radius-lg)] bg-[var(--app-accent)] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[var(--app-text)] leading-tight">
                    Operations
                  </span>
                  <span className="text-[10px] text-[var(--app-text-muted)] leading-tight">
                    ERP Module
                  </span>
                </div>
                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto h-8  w-7 text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Navigation — collapsible sections */}
              <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar">
                {navSections.map((section) => {
                  let expanded = false;
                  let toggle: () => void = () => {};

                  switch (section.id) {
                    case 'operations':
                      expanded = opsExpanded;
                      toggle = () => setOpsExpanded(!opsExpanded);
                      break;
                    case 'hrm':
                      expanded = hrmExpanded;
                      toggle = () => setHrmExpanded(!hrmExpanded);
                      break;
                    case 'finance':
                      expanded = financeExpanded;
                      toggle = () => setFinanceExpanded(!financeExpanded);
                      break;
                    case 'resources':
                      expanded = resourcesExpanded;
                      toggle = () => setResourcesExpanded(!resourcesExpanded);
                      break;
                    case 'management':
                      expanded = managementExpanded;
                      toggle = () => setManagementExpanded(!managementExpanded);
                      break;
                    case 'intelligence':
                      expanded = intelligenceExpanded;
                      toggle = () => setIntelligenceExpanded(!intelligenceExpanded);
                      break;
                  }

                  return (
                    <SidebarSection
                      key={section.id}
                      section={section}
                      isExpanded={expanded}
                      isSectionActive={isSectionActive(section.id)}
                      onToggle={toggle}
                      currentPage={currentPage}
                      onNavClick={handleNavClick}
                      accessiblePages={accessiblePages}
                    />
                  );
                })}
              </nav>

              {/* Sidebar footer — user profile */}
              <div className="p-3 border-t border-[var(--app-border)]">
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
    <div className="flex items-center gap-3 p-2 rounded-[var(--app-radius-lg)] hover:bg-[var(--app-hover-bg)] transition-colors cursor-pointer">
      <Avatar className="h-8 w-8 rounded-[var(--app-radius-lg)]">
        <AvatarFallback className="bg-[var(--app-accent)] text-white text-xs font-semibold rounded-[var(--app-radius-lg)]">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--app-text)] truncate">
          {user?.name || 'User'}
        </p>
        <p className="text-[11px] text-[var(--app-text-muted)] truncate">
          {role}
        </p>
      </div>
    </div>
  );
}

// ---- Topbar ----
function Topbar() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
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
    openCreateModal,
  } = useErpStore();
  const isMobile = useIsMobile();
  const { canPerform, role } = usePermissions();

  // Notification local state (initialized from mock data)
  const [notifState, setNotifState] = useState(mockNotifications);
  const unreadCount = notifState.filter((n) => !n.read).length;

  const canBack = checkCanBack();
  const canForward = checkCanForward();
  const currentLabel = allNavMap[currentPage] || 'Operations';
  const isDetailPage = currentPage.endsWith('-detail');

  // Mark all notifications as read
  const markAllRead = useCallback(() => {
    setNotifState((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--app-border)] bg-[var(--app-bg)] backdrop-blur-sm flex items-center justify-between px-4 gap-4 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-1.5 min-w-0">
        {/* Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModule}
              className="shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
            >
              <Home className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Home Dashboard</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden md:block bg-[var(--app-hover-bg)]" />

        {/* Back / Forward */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              disabled={!canBack}
              className={cn(
                'shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity',
                !canBack
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
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
                'shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity',
                !canForward
                  ? 'opacity-20 cursor-not-allowed'
                  : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
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
        <div className="w-px h-5 mx-1 hidden md:block bg-[var(--app-hover-bg)]" />

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] text-[var(--app-text-muted)] hidden sm:block shrink-0">
            Operations
          </span>
          <ChevronRight className="w-4 h-4 text-[var(--app-text-disabled)] hidden sm:block shrink-0" />
          <span className="text-[13px] font-medium text-[var(--app-text)] truncate">
            {currentLabel}
          </span>
          {isDetailPage && (
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0 h-5 bg-[var(--app-active-bg)] text-[var(--app-accent)] border-0 rounded-[var(--app-radius-md)]"
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
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-hover-bg)] w-56 lg:w-64 transition-colors hover:border-[var(--app-accent-hover)] hover:bg-[var(--app-hover-bg)] cursor-pointer"
        >
          <Search className="w-4 h-4 shrink-0 text-[var(--app-text-muted)]" />
          <span className="text-[13px] text-[var(--app-text-disabled)]">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] ml-auto">
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
              className="md:hidden h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
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
                  className="h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
                >
                  <History className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Recent Pages</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[var(--app-card-bg)] border-[var(--app-border-strong)] rounded-[var(--app-radius-lg)] app-dropdown-enter"
          >
            <DropdownMenuLabel className="text-[var(--app-text-secondary)] text-xs font-semibold tracking-wider uppercase">
              Recent Pages
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--app-hover-bg)]" />
            {recentPages.length === 0 ? (
              <div className="px-3 py-4 text-center text-[13px] text-[var(--app-text-muted)]">
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
                      'flex items-center gap-2.5 py-2 text-[13px] cursor-pointer rounded-[var(--app-radius-lg)] mx-1',
                      page === currentPage
                        ? 'text-[var(--app-text)] bg-[var(--app-active-bg)]'
                        : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[var(--app-text-muted)]" />
                    <span className="truncate">{label}</span>
                    {page === currentPage && (
                      <span className="ml-auto text-[10px] text-[var(--app-accent)] font-medium">Current</span>
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
              className="relative h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[var(--app-accent)] text-[9px] font-bold flex items-center justify-center text-white px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-[var(--app-card-bg)] border-[var(--app-border-strong)] rounded-[var(--app-radius-lg)] p-0 app-dropdown-enter"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--app-border)]">
              <span className="text-sm font-semibold text-[var(--app-text)]">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-[var(--app-accent)] hover:text-[var(--app-accent)]/80 transition-colors cursor-pointer"
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
                        ? 'bg-[var(--app-active-bg)] hover:bg-[var(--app-active-bg)]'
                        : 'hover:bg-[var(--app-hover-bg)]'
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
                        'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0 mt-0.5',
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
                              ? 'text-[var(--app-text-secondary)]'
                              : 'text-[var(--app-text)] font-medium'
                          )}
                        >
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-accent)] shrink-0" />
                        )}
                      </div>
                      <p className="text-[12px] text-[var(--app-text-muted)] line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-[var(--app-text-disabled)] mt-1 block">
                        {formatNotifTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--app-border)] px-4 py-2">
              <button className="w-full text-center text-[12px] font-medium text-[var(--app-accent)] hover:text-[var(--app-accent)]/80 transition-colors py-1 cursor-pointer">
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
                  className="hidden sm:flex h-8 w-8 rounded-[var(--app-radius-lg)] bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent)]/90 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Quick Create</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-[var(--app-card-bg)] border-[var(--app-border-strong)] rounded-[var(--app-radius-lg)] app-dropdown-enter"
          >
            <DropdownMenuLabel className="text-[var(--app-text-secondary)] text-xs font-semibold tracking-wider uppercase">
              Quick Create
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--app-hover-bg)]" />
            {canPerform('create', 'projects') && (
            <DropdownMenuItem
              onClick={() => openCreateModal('project')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] mx-1 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-[var(--app-text-muted)]" />
              New Project
            </DropdownMenuItem>
            )}
            {canPerform('create', 'employees') && (
            <DropdownMenuItem
              onClick={() => openCreateModal('employee')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] mx-1 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[var(--app-text-muted)]" />
              Add Employee
            </DropdownMenuItem>
            )}
            {canPerform('create', 'leaves') && (
            <DropdownMenuItem
              onClick={() => openCreateModal('leave')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] mx-1 cursor-pointer"
            >
              <CalendarOff className="w-4 h-4 text-[var(--app-text-muted)]" />
              Apply Leave
            </DropdownMenuItem>
            )}
            {canPerform('create', 'tasks-board') && (
            <DropdownMenuItem
              onClick={() => openCreateModal('task')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] mx-1 cursor-pointer"
            >
              <ListPlus className="w-4 h-4 text-[var(--app-text-muted)]" />
              Create Task
            </DropdownMenuItem>
            )}
            {canPerform('create', 'assets') && (
            <DropdownMenuItem
              onClick={() => openCreateModal('asset')}
              className="flex items-center gap-2.5 py-2 text-[13px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] mx-1 cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-[var(--app-text-muted)]" />
              Add Asset
            </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Density Toggle */}
        <DensityToggle />

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex h-8 w-8 rounded-[var(--app-radius-lg)] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
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
              className="h-8 w-8 rounded-[var(--app-radius-lg)]"
            >
              <Avatar className="h-8 w-8 rounded-[var(--app-radius-lg)]">
                <AvatarFallback className="bg-[var(--app-accent)] text-white text-xs font-semibold rounded-[var(--app-radius-lg)]">
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
            className="w-56 bg-[var(--app-card-bg)] border-[var(--app-border-strong)] rounded-[var(--app-radius-lg)]"
          >
            <div className="px-3 py-2.5 border-b border-[var(--app-border)] mb-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--app-text)]">
                  {user?.name || 'User'}
                </p>
                <Badge
                  className="text-[10px] px-1.5 py-0 h-4 bg-[var(--app-accent-light)] text-[var(--app-accent)] border-0 rounded-[var(--app-radius-md)] font-medium capitalize"
                >
                  {role}
                </Badge>
              </div>
              <p className="text-xs text-[var(--app-text-muted)]">
                {user?.email || ''}
              </p>
            </div>
            <DropdownMenuItem className="text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] cursor-pointer focus:bg-[var(--app-hover-bg)] focus:text-[var(--app-text)]">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] rounded-[var(--app-radius-lg)] cursor-pointer focus:bg-[var(--app-hover-bg)] focus:text-[var(--app-text)]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--app-hover-bg)]" />
            <DropdownMenuItem
              onClick={logout}
              className="text-[var(--app-text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-[var(--app-radius-lg)] cursor-pointer focus:bg-red-500/10 focus:text-red-400"
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
  const { recentPages, navigateTo, commandPaletteOpen, setCommandPaletteOpen, createModalOpen, createModalType, closeCreateModal, sidebarOpen, setSidebarOpen, contextualSidebar, closeContextualSidebar } = useErpStore();

  // Toast feedback for entity creation via CreateModal
  const handleCreateSubmit = useCallback((_data: Record<string, unknown>) => {
    const entityLabels: Record<CreateEntityType, string> = {
      task: 'Task',
      employee: 'Employee',
      project: 'Project',
      leave: 'Leave Request',
      asset: 'Asset',
    };
    const label = entityLabels[createModalType || 'task'];
    useFeedbackStore.getState().addToast('success', { title: `${label} Created`, message: `New ${label.toLowerCase()} has been created successfully` });
  }, [createModalType]);

  // Build command items for the command palette from all nav sections
  const commands = useMemo(() => {
    const allItems: Array<{
      id: string;
      icon: LucideIcon;
      label: string;
      section: 'pages';
      action: () => void;
    }> = [];
    for (const section of navSections) {
      for (const item of section.items) {
        allItems.push({
          id: item.id,
          icon: item.icon,
          label: item.label,
          section: 'pages' as const,
          action: () => navigateTo(item.id),
        });
      }
    }
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

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Escape: close any open panel
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          e.preventDefault();
          return;
        }
        if (createModalOpen) {
          closeCreateModal();
          e.preventDefault();
          return;
        }
        if (contextualSidebar) {
          closeContextualSidebar();
          e.preventDefault();
          return;
        }
        return;
      }

      // Don't fire shortcuts when typing in inputs
      if (isInputFocused) return;

      const isMod = e.metaKey || e.ctrlKey;

      // ⌘K / Ctrl+K: Command palette
      if (isMod && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      // ⌘B / Ctrl+B: Toggle sidebar
      if (isMod && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
        return;
      }

      // Digit 1-9: Navigate to recent pages
      if (e.key >= '1' && e.key <= '9' && !isMod && !e.shiftKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        if (index < recentPages.length) {
          e.preventDefault();
          navigateTo(recentPages[index]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, createModalOpen, contextualSidebar, sidebarOpen, recentPages, setCommandPaletteOpen, closeCreateModal, closeContextualSidebar, setSidebarOpen, navigateTo]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen flex flex-col overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)]">
        {/* Topbar */}
        <Topbar />

        {/* Main area: sidebar + content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Content area */}
<<<<<<< HEAD
          <main className="flex-1 overflow-auto bg-[var(--ops-bg)] scroll-smooth">
            <ErrorBoundary onError={(error, info) => console.error('ERP Error:', error, info)}>
=======
          <main className="flex-1 overflow-auto bg-[var(--app-bg)] scroll-smooth">
            <ErpErrorBoundary>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>

        {/* Command Palette (rendered here for global access) */}
        <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} navigateCommands={commands} recentPages={recentCommands} />

        {/* Create Modal */}
        <CreateModal
          open={createModalOpen && createModalType !== null}
          onClose={closeCreateModal}
          type={createModalType || 'task'}
          onSubmit={handleCreateSubmit}
        />

        {/* Toast Container */}
        <ToastContainer />

        {/* Mobile FAB */}
        <MobileFab />

        {/* Contextual Sidebar (entity detail panel) */}
        <ContextualSidebar
          entity={contextualSidebar}
          onClose={closeContextualSidebar}
        />
      </div>
    </TooltipProvider>
  );
}
