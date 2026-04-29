'use client';

import { lazy } from 'react';
import type { ModuleConfig } from '@/types/module-config';
import { useErpStore } from './erp-store';

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

// Icons
import {
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
  Sparkles,
} from 'lucide-react';

export const erpConfig: ModuleConfig = {
  moduleId: 'erp',
  moduleName: 'ERP / Operations',
  moduleShortName: 'ERP',
  moduleIcon: LayoutDashboard,
  accentKey: 'ops',
  collapsibleSections: true,
  lazyLoading: true,

  navSections: [
    {
      id: 'operations',
      label: 'Operations',
      icon: LayoutDashboard,
      items: [
        { id: 'ops-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'tasks-board', label: 'Tasks', icon: Columns3, badge: 12 },
        { id: 'delivery-ops', label: 'Delivery', icon: Truck, badge: 4 },
        { id: 'sop-templates', label: 'SOPs', icon: FileCode },
        { id: 'internal-chat', label: 'Chat', icon: MessageSquare, badge: 3 },
      ],
    },
    {
      id: 'hrm',
      label: 'Human Resources',
      icon: Users,
      items: [
        { id: 'employees', label: 'Employees', icon: UserIcon },
        { id: 'employee-analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'departments', label: 'Departments', icon: Network },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'shifts', label: 'Shifts', icon: CalendarClock },
        { id: 'leaves', label: 'Leaves', icon: CalendarOff, badge: 5 },
        { id: 'payroll', label: 'Payroll', icon: Banknote },
        { id: 'compensation', label: 'Compensation', icon: Wallet },
        { id: 'incentives', label: 'Incentives', icon: Gift },
        { id: 'performance', label: 'Performance', icon: BarChart3 },
        { id: 'onboarding', label: 'Onboarding', icon: UserCog },
        { id: 'documents', label: 'Documents', icon: FolderOpen },
      ],
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: Coins,
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt, badge: 2 },
        { id: 'vendors', label: 'Vendors', icon: Package },
        { id: 'finance-ops', label: 'Finance Ops', icon: TrendingDown },
        { id: 'profitability', label: 'Profitability', icon: BarChart2 },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Wrench,
      items: [
        { id: 'resource-planning', label: 'Planning', icon: GitBranch },
        { id: 'workload', label: 'Workload', icon: BarChart2 },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      icon: CheckCircle2,
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
        { id: 'ai-ops', label: 'AI Ops', icon: Brain, isAI: true },
        { id: 'ai-ops-intelligence', label: 'AI Deep Dive', icon: Sparkles, isAI: true },
      ],
    },
  ],

  pageComponents: {
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
  },

  allPageLabels: {
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
  },

  useStore: () => {
    const store = useErpStore();
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
