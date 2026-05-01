'use client';

import type { ModuleConfig } from '@/types/module-config';
import type { FinancePage } from './types';
import { useFinanceStore } from './finance-store';

// Direct imports
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

// Icons
import {
  LayoutDashboard,
  Waves,
  HandCoins,
  Receipt,
  TrendingUp,
  CreditCard,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Users,
  FileCheck2,
  PiggyBank,
  Target,
  Landmark,
} from 'lucide-react';

export const financeConfig: ModuleConfig<FinancePage> = {
  moduleId: 'finance',
  moduleName: 'Finance',
  moduleShortName: 'Finance',
  moduleIcon: BarChart3,
  collapsibleSections: true,
  lazyLoading: true,

  navSections: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'CFO Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      id: 'cash-management',
      label: 'Cash Management',
      items: [
        { id: 'cashflow', label: 'Cashflow', icon: Waves },
        { id: 'receivables', label: 'Receivables', icon: HandCoins, badge: 5 },
        { id: 'payables', label: 'Payables', icon: Receipt },
      ],
    },
    {
      id: 'financials',
      label: 'Financials',
      items: [
        { id: 'revenue', label: 'Revenue', icon: TrendingUp },
        { id: 'expenses', label: 'Expenses', icon: CreditCard },
        { id: 'pnl', label: 'P&L', icon: BarChart3 },
        { id: 'profitability', label: 'Profitability', icon: FileSpreadsheet },
      ],
    },
    {
      id: 'operations',
      label: 'Operations',
      items: [
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'payroll', label: 'Payroll', icon: Users },
        { id: 'approvals', label: 'Approvals', icon: FileCheck2, badge: 3 },
      ],
    },
    {
      id: 'planning',
      label: 'Planning',
      items: [
        { id: 'budgets', label: 'Budgets', icon: PiggyBank },
        { id: 'forecasting', label: 'Forecasting', icon: Target, isAI: true },
        { id: 'tax', label: 'Tax', icon: Landmark, badge: 2 },
      ],
    },
  ],

  pageComponents: {
    'dashboard': DashboardPage,
    'cashflow': CashflowPage,
    'receivables': ReceivablesPage,
    'payables': PayablesPage,
    'revenue': RevenuePage,
    'expenses': ExpensesPage,
    'pnl': PnlPage,
    'profitability': ProfitabilityPage,
    'invoices': InvoicesPage,
    'payroll': PayrollPage,
    'approvals': ApprovalsPage,
    'budgets': BudgetsPage,
    'forecasting': ForecastingPage,
    'tax': TaxPage,
  },

  allPageLabels: {
    'dashboard': 'CFO Dashboard',
    'cashflow': 'Cashflow',
    'receivables': 'Receivables',
    'payables': 'Payables',
    'revenue': 'Revenue',
    'expenses': 'Expenses',
    'pnl': 'P&L',
    'profitability': 'Profitability',
    'invoices': 'Invoices',
    'payroll': 'Payroll',
    'approvals': 'Approvals',
    'budgets': 'Budgets',
    'forecasting': 'Forecasting',
    'tax': 'Tax',
  },

  useStore: () => {
    const store = useFinanceStore();
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
