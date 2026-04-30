import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback';
import type { FinancePage } from './types';

interface FinanceState {
  currentPage: FinancePage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  selectedInvoiceId: string | null;
  selectedClientId: string | null;

  navigateTo: (page: FinancePage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  selectInvoice: (id: string) => void;
  selectClient: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  currentPage: 'finance-dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedInvoiceId: null,
  selectedClientId: null,

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
}));
