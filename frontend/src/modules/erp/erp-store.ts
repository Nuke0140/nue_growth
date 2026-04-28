'use client';

import { create } from 'zustand';
import type { ErpPage } from './types';

// HRM-related pages for auto-expand detection
const HRM_PAGES: ErpPage[] = [
  'employees',
  'employee-detail',
  'departments',
  'attendance',
  'leaves',
  'payroll',
  'compensation',
  'performance',
  'documents',
];

interface ErpState {
  currentPage: ErpPage;
  selectedProjectId: string | null;
  selectedEmployeeId: string | null;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  hrmExpanded: boolean;
  searchQuery: string;
  history: ErpPage[];
  forwardStack: ErpPage[];

  navigateTo: (page: ErpPage) => void;
  selectProject: (id: string) => void;
  selectEmployee: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setHrmExpanded: (expanded: boolean) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

export const useErpStore = create<ErpState>((set, get) => ({
  currentPage: 'ops-dashboard',
  selectedProjectId: null,
  selectedEmployeeId: null,
  sidebarOpen: true,
  sidebarCollapsed: false,
  hrmExpanded: false,
  searchQuery: '',
  history: [],
  forwardStack: [],

  navigateTo: (page: ErpPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;

    const isHrmPage = HRM_PAGES.includes(page);

    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
      // Auto-expand HRM section if navigating to an HRM page
      hrmExpanded: isHrmPage || get().hrmExpanded,
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
      hrmExpanded: true,
    });
  },

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  setHrmExpanded: (expanded: boolean) => set({ hrmExpanded: expanded }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  goBack: () => {
    const { history, currentPage, forwardStack, selectedProjectId, selectedEmployeeId } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevPage = newHistory.pop()!;
    const isPrevHrmPage = HRM_PAGES.includes(prevPage as ErpPage);

    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as ErpPage,
      selectedProjectId: prevPage === 'projects' ? null : selectedProjectId,
      selectedEmployeeId: prevPage === 'employees' ? null : selectedEmployeeId,
      hrmExpanded: isPrevHrmPage,
    });
  },

  goForward: () => {
    const { forwardStack, currentPage, history } = get();
    if (forwardStack.length === 0) return;
    const newForward = [...forwardStack];
    const nextPage = newForward.pop()!;
    const isNextHrmPage = HRM_PAGES.includes(nextPage as ErpPage);

    set({
      history: [...history, currentPage],
      forwardStack: newForward,
      currentPage: nextPage as ErpPage,
      hrmExpanded: isNextHrmPage || get().hrmExpanded,
    });
  },

  canGoBack: () => get().history.length > 0,
  canGoForward: () => get().forwardStack.length > 0,
}));
