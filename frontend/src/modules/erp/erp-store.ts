'use client';

import { create } from 'zustand';
import type { ErpPage } from '@/modules/erp/types';

interface ErpState {
  currentPage: ErpPage;
  selectedProjectId: string | null;
  selectedEmployeeId: string | null;
  sidebarOpen: boolean;
  searchQuery: string;
  history: string[];
  forwardStack: string[];

  navigateTo: (page: ErpPage) => void;
  selectProject: (id: string) => void;
  selectEmployee: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useErpStore = create<ErpState>((set, get) => ({
  currentPage: 'erp-dashboard',
  selectedProjectId: null,
  selectedEmployeeId: null,
  sidebarOpen: true,
  searchQuery: '',
  history: [],
  forwardStack: [],

  navigateTo: (page: ErpPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
    });
  },

  selectProject: (id: string) => {
    const { currentPage } = get();
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      selectedProjectId: id,
      currentPage: 'project-detail' as ErpPage,
    });
  },

  selectEmployee: (id: string) => {
    const { currentPage } = get();
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      selectedEmployeeId: id,
      currentPage: 'employee-detail' as ErpPage,
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
      currentPage: prevPage as ErpPage,
      selectedProjectId: prevPage === 'projects' ? null : get().selectedProjectId,
      selectedEmployeeId: prevPage === 'employees' ? null : get().selectedEmployeeId,
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
      currentPage: nextPage as ErpPage,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
