import { create } from 'zustand';
import type { AutomationPage } from './types';

interface AutomationState {
  currentPage: AutomationPage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  selectedWorkflowId: string | null;

  navigateTo: (page: AutomationPage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  currentPage: 'automation-dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedWorkflowId: null,

  navigateTo: (page: AutomationPage) => {
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

  goBack: () => {
    const { history, currentPage, forwardStack } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevPage = newHistory.pop()!;
    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as AutomationPage,
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
      currentPage: nextPage as AutomationPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
