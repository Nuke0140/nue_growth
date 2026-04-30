import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback';
import type { SettingsPage } from './types';

interface SettingsState {
  currentPage: SettingsPage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  unsavedChanges: boolean;

  navigateTo: (page: SettingsPage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  currentPage: 'settings-dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  unsavedChanges: false,

  navigateTo: (page: SettingsPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
      unsavedChanges: false,
    });
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setUnsavedChanges: (hasChanges: boolean) => set({ unsavedChanges: hasChanges }),

  goBack: () => {
    const { history, currentPage, forwardStack } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevPage = newHistory.pop()!;
    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as SettingsPage,
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
      currentPage: nextPage as SettingsPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
