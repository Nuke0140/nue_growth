import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback.tsx';
import type { MarketingPage } from './types';

interface MarketingState {
  currentPage: MarketingPage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];
  selectedCampaignId: string | null;
  selectedWorkflowId: string | null;

  navigateTo: (page: MarketingPage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  selectCampaign: (id: string) => void;
  selectWorkflow: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedCampaignId: null,
  selectedWorkflowId: null,

  navigateTo: (page: MarketingPage) => {
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

  selectCampaign: (id: string) => {
    set({ selectedCampaignId: id });
    useFeedbackStore.getState().addToast('info', {
      title: 'Campaign Selected',
      message: 'Now viewing campaign details.',
    });
  },
  selectWorkflow: (id: string) => {
    set({ selectedWorkflowId: id });
    useFeedbackStore.getState().addToast('info', {
      title: 'Workflow Selected',
      message: 'Now viewing workflow details.',
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
      currentPage: prevPage as MarketingPage,
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
      currentPage: nextPage as MarketingPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
