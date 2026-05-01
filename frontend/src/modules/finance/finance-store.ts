import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback';
import type { FinancePage, FinanceAlert, AIInsight } from './types';

interface FinanceState {
  currentPage: FinancePage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  selectedInvoiceId: string | null;
  selectedClientId: string | null;

  // AI & Alert state
  activeAlerts: FinanceAlert[];
  unreadAlertCount: number;
  activeInsight: AIInsight | null;
  showInsightPanel: boolean;

  // Actions
  navigateTo: (page: FinancePage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  selectInvoice: (id: string) => void;
  selectClient: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  dismissAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  setActiveInsight: (insight: AIInsight | null) => void;
  toggleInsightPanel: () => void;
  executeInsightAction: (insight: AIInsight) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedInvoiceId: null,
  selectedClientId: null,

  activeAlerts: [],
  unreadAlertCount: 0,
  activeInsight: null,
  showInsightPanel: false,

  navigateTo: (page: FinancePage) => {
    const { currentPage } = get();
    if (currentPage === page) return;
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
    });
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  selectInvoice: (id: string) => {
    set({ selectedInvoiceId: id });
    useFeedbackStore.getState().addToast('info', {
      title: 'Invoice Selected',
      message: 'Now viewing invoice details.',
    });
  },
  selectClient: (id: string) => {
    set({ selectedClientId: id });
    useFeedbackStore.getState().addToast('info', {
      title: 'Client Selected',
      message: 'Now viewing client details.',
    });
  },

  goBack: () => {
    const { history, currentPage, forwardStack } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevPage = newHistory.pop()!;
    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as FinancePage,
    });
  },

  goForward: () => {
    const { forwardStack, currentPage, history } = get();
    if (forwardStack.length === 0) return;
    const newForward = [...forwardStack];
    const nextPage = newForward.pop()!;
    set({
      history: [...history, currentPage],
      forwardStack: newForward,
      currentPage: nextPage as FinancePage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,

  dismissAlert: (id: string) => {
    const alerts = get().activeAlerts.filter(a => a.id !== id);
    set({
      activeAlerts: alerts,
      unreadAlertCount: alerts.filter(a => !a.isRead).length,
    });
  },

  markAlertRead: (id: string) => {
    const alerts = get().activeAlerts.map(a =>
      a.id === id ? { ...a, isRead: true } : a
    );
    set({
      activeAlerts: alerts,
      unreadAlertCount: alerts.filter(a => !a.isRead).length,
    });
  },

  setActiveInsight: (insight: AIInsight | null) => set({ activeInsight: insight }),
  toggleInsightPanel: () => set(s => ({ showInsightPanel: !s.showInsightPanel })),

  executeInsightAction: (insight: AIInsight) => {
    if (insight.actionPage) {
      get().navigateTo(insight.actionPage);
    }
    useFeedbackStore.getState().addToast('success', {
      title: 'Action Initiated',
      message: insight.recommendation,
    });
    set({ activeInsight: null, showInsightPanel: false });
  },
}));
