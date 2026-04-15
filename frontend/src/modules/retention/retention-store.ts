import { create } from 'zustand';
import type { RetentionPage } from './types';

interface RetentionState {
  currentPage: RetentionPage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  selectedClientId: string | null;

  navigateTo: (page: RetentionPage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  selectClient: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useRetentionStore = create<RetentionState>((set, get) => ({
  currentPage: 'retention-dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedClientId: null,

  navigateTo: (page: RetentionPage) => {
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
  selectClient: (id: string) => set({ selectedClientId: id }),

  goBack: () => {
    const { history, currentPage, forwardStack } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevPage = newHistory.pop()!;
    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as RetentionPage,
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
      currentPage: nextPage as RetentionPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
