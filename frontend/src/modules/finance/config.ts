'use client';

import type { ModuleConfig } from '@/types/module-config';
import type { FinancePage } from './types';
import { useFinanceStore } from './finance-store';

// Direct imports
import FinanceDashboardPage from './finance-dashboard-page';
import RevenuePage from './revenue-page';
import ReceivablesPage from './receivables-page';
import PayablesPage from './payables-page';
import InvoicesPage from './invoices-page';
import ExpensesPage from './expenses-page';
import BudgetsPage from './budgets-page';
import GstTaxPage from './gst-tax-page';
import PayoutsPage from './payouts-page';
import PayrollFinancePage from './payroll-finance-page';
import CashflowPage from './cashflow-page';
import PnlPage from './pnl-page';
import ProfitabilityPage from './profitability-page';
import ApprovalsPage from './approvals-page';
import ForecastingPage from './forecasting-page';
import AiFinanceIntelligencePage from './ai-finance-intelligence-page';

// Icons
import {
  LayoutDashboard,
  TrendingUp,
  HandCoins,
  FileText,
  Receipt,
  CreditCard,
  Wallet,
  Users,
  PiggyBank,
  Landmark,
  FileCheck2,
  Target,
  Waves,
  BarChart3,
  FileSpreadsheet,
  BrainCircuit,
} from 'lucide-react';

export const financeConfig: ModuleConfig<FinancePage> = {
  moduleId: 'finance',
  moduleName: 'Finance',
  moduleShortName: 'Finance',
  moduleIcon: BarChart3,
  collapsibleSections: false,
  lazyLoading: false,

  navSections: [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'finance-dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
        { id: 'ai-finance-intelligence', label: 'AI Finance Intelligence', icon: BrainCircuit, isAI: true },
      ],
    },
    {
      id: 'money-in',
      label: 'Money In',
      items: [
        { id: 'revenue', label: 'Revenue', icon: TrendingUp },
        { id: 'receivables', label: 'Receivables', icon: HandCoins },
        { id: 'invoices', label: 'Invoices', icon: FileText },
      ],
    },
    {
      id: 'money-out',
      label: 'Money Out',
      items: [
        { id: 'payables', label: 'Payables', icon: Receipt },
        { id: 'expenses', label: 'Expenses', icon: CreditCard },
        { id: 'payouts', label: 'Payouts', icon: Wallet },
        { id: 'payroll-finance', label: 'Payroll Finance', icon: Users },
      ],
    },
    {
      id: 'planning-control',
      label: 'Planning & Control',
      items: [
        { id: 'budgets', label: 'Budgets', icon: PiggyBank },
        { id: 'gst-tax', label: 'GST & Tax', icon: Landmark },
        { id: 'approvals', label: 'Approvals', icon: FileCheck2, badge: 3 },
        { id: 'forecasting', label: 'Forecasting', icon: Target },
      ],
    },
    {
      id: 'statements',
      label: 'Statements',
      items: [
        { id: 'cashflow', label: 'Cash Flow', icon: Waves },
        { id: 'pnl', label: 'P&L', icon: BarChart3 },
        { id: 'profitability', label: 'Profitability', icon: FileSpreadsheet },
      ],
    },
  ],

  pageComponents: {
    'finance-dashboard': FinanceDashboardPage,
    'revenue': RevenuePage,
    'receivables': ReceivablesPage,
    'payables': PayablesPage,
    'invoices': InvoicesPage,
    'expenses': ExpensesPage,
    'budgets': BudgetsPage,
    'gst-tax': GstTaxPage,
    'payouts': PayoutsPage,
    'payroll-finance': PayrollFinancePage,
    'cashflow': CashflowPage,
    'pnl': PnlPage,
    'profitability': ProfitabilityPage,
    'approvals': ApprovalsPage,
    'forecasting': ForecastingPage,
    'ai-finance-intelligence': AiFinanceIntelligencePage,
  },

  allPageLabels: {
    'finance-dashboard': 'Finance Dashboard',
    'ai-finance-intelligence': 'AI Finance Intelligence',
    'revenue': 'Revenue',
    'receivables': 'Receivables',
    'invoices': 'Invoices',
    'payables': 'Payables',
    'expenses': 'Expenses',
    'payouts': 'Payouts',
    'payroll-finance': 'Payroll Finance',
    'budgets': 'Budgets',
    'gst-tax': 'GST & Tax',
    'approvals': 'Approvals',
    'forecasting': 'Forecasting',
    'cashflow': 'Cash Flow',
    'pnl': 'P&L',
    'profitability': 'Profitability',
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
