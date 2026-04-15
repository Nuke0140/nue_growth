import { create } from 'zustand';
import type { CrmSalesPage } from '@/modules/crm-sales/types';

interface CrmSalesState {
  currentPage: CrmSalesPage;
  selectedContactId: string | null;
  selectedCompanyId: string | null;
  selectedLeadId: string | null;
  selectedDealId: string | null;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];

  navigateTo: (page: CrmSalesPage) => void;
  selectContact: (id: string) => void;
  selectCompany: (id: string) => void;
  selectLead: (id: string) => void;
  selectDeal: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useCrmSalesStore = create<CrmSalesState>((set, get) => ({
  currentPage: 'contacts',
  selectedContactId: null,
  selectedCompanyId: null,
  selectedLeadId: null,
  selectedDealId: null,
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],

  navigateTo: (page: CrmSalesPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
    });
  },

  selectContact: (id: string) => {
    set({
      history: [...get().history, get().currentPage],
      forwardStack: [],
      selectedContactId: id,
      currentPage: 'contact-detail' as CrmSalesPage,
    });
  },

  selectCompany: (id: string) => {
    set({
      history: [...get().history, get().currentPage],
      forwardStack: [],
      selectedCompanyId: id,
      currentPage: 'company-detail' as CrmSalesPage,
    });
  },

  selectLead: (id: string) => {
    set({
      history: [...get().history, get().currentPage],
      forwardStack: [],
      selectedLeadId: id,
      currentPage: 'lead-detail' as CrmSalesPage,
    });
  },

  selectDeal: (id: string) => {
    set({
      history: [...get().history, get().currentPage],
      forwardStack: [],
      selectedDealId: id,
      currentPage: 'deal-detail' as CrmSalesPage,
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
      currentPage: prevPage as CrmSalesPage,
      selectedContactId: prevPage === 'contacts' ? null : get().selectedContactId,
      selectedCompanyId: prevPage === 'companies' ? null : get().selectedCompanyId,
      selectedLeadId: prevPage === 'leads' ? null : get().selectedLeadId,
      selectedDealId: prevPage === 'deals' || prevPage === 'deals-pipeline' ? null : get().selectedDealId,
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
      currentPage: nextPage as CrmSalesPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
