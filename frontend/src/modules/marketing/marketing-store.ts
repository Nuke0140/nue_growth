import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback';
import type { MarketingPage, CampaignBuilderStep, Campaign } from './types';

// ---- Campaign Builder State ----
export interface CampaignBuilderState {
  step: CampaignBuilderStep;
  campaign: Partial<Campaign>;
  isEditing: boolean;
  isValid: Record<CampaignBuilderStep, boolean>;
}

const initialBuilderState: CampaignBuilderState = {
  step: 'objective',
  campaign: {},
  isEditing: false,
  isValid: {
    objective: false,
    audience: false,
    channels: false,
    content: false,
    offer: true, // optional
    automation: true, // optional
    schedule: false,
    'ai-optimization': true, // optional
  },
};

interface MarketingState {
  // Navigation
  currentPage: MarketingPage;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];

  // Campaign Selection
  selectedCampaignId: string | null;

  // Campaign Builder
  builder: CampaignBuilderState;

  // Contextual Sidebar
  contextualSidebarOpen: boolean;

  // Navigation
  navigateTo: (page: MarketingPage) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;

  // Campaign Selection
  selectCampaign: (id: string) => void;

  // Campaign Builder Actions
  setBuilderStep: (step: CampaignBuilderStep) => void;
  updateBuilderCampaign: (updates: Partial<Campaign>) => void;
  resetBuilder: () => void;
  startEditingCampaign: (campaign: Campaign) => void;
  setBuilderValid: (step: CampaignBuilderStep, valid: boolean) => void;

  // Contextual Sidebar
  setContextualSidebarOpen: (open: boolean) => void;
}

const BUILDER_STEPS: CampaignBuilderStep[] = [
  'objective', 'audience', 'channels', 'content',
  'offer', 'automation', 'schedule', 'ai-optimization',
];

export const useMarketingStore = create<MarketingState>((set, get) => ({
  currentPage: 'dashboard',
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],
  selectedCampaignId: null,
  builder: { ...initialBuilderState },
  contextualSidebarOpen: false,

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
    set({ selectedCampaignId: id, contextualSidebarOpen: true });
    useFeedbackStore.getState().addToast('info', {
      title: 'Campaign Selected',
      message: 'Viewing campaign details in sidebar.',
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

  // Campaign Builder
  setBuilderStep: (step: CampaignBuilderStep) => {
    set({ builder: { ...get().builder, step } });
  },

  updateBuilderCampaign: (updates: Partial<Campaign>) => {
    set({
      builder: {
        ...get().builder,
        campaign: { ...get().builder.campaign, ...updates },
      },
    });
  },

  resetBuilder: () => {
    set({ builder: { ...initialBuilderState } });
  },

  startEditingCampaign: (campaign: Campaign) => {
    set({
      builder: {
        step: 'objective',
        campaign: { ...campaign },
        isEditing: true,
        isValid: {
          objective: true,
          audience: true,
          channels: true,
          content: true,
          offer: true,
          automation: true,
          schedule: true,
          'ai-optimization': true,
        },
      },
    });
  },

  setBuilderValid: (step: CampaignBuilderStep, valid: boolean) => {
    set({
      builder: {
        ...get().builder,
        isValid: { ...get().builder.isValid, [step]: valid },
      },
    });
  },

  // Contextual Sidebar
  setContextualSidebarOpen: (open: boolean) => {
    set({ contextualSidebarOpen: open });
  },
}));

export { BUILDER_STEPS };
