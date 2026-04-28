'use client';

import { create } from 'zustand';
import type { ErpPage } from './types';

// ---- Create Entity Types ----
export type CreateEntityType = 'task' | 'employee' | 'project' | 'leave' | 'asset';

// HRM-related pages for auto-expand detection
const HRM_PAGES: ErpPage[] = [
  'hrm',
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
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  recentPages: ErpPage[];
  bulkSelectedIds: string[];

  // Create modal
  createModalOpen: boolean;
  createModalType: CreateEntityType | null;

  // Density mode
  densityMode: 'comfortable' | 'compact';

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
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  toggleBulkSelection: (id: string) => void;
  clearBulkSelection: () => void;
  selectAllBulk: (ids: string[]) => void;
  openCreateModal: (type: CreateEntityType) => void;
  closeCreateModal: () => void;
  setDensityMode: (mode: 'comfortable' | 'compact') => void;
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
  commandPaletteOpen: false,
  notificationsOpen: false,
  recentPages: [],
  bulkSelectedIds: [],

  // Create modal
  createModalOpen: false,
  createModalType: null,

  // Density mode
  densityMode: 'comfortable' as const,

  navigateTo: (page: ErpPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;

    const isHrmPage = HRM_PAGES.includes(page);

    // Build recentPages: remove duplicates, add new page to front, keep max 10
    const existing = get().recentPages.filter((p) => p !== page);
    const updatedRecent = [page, ...existing].slice(0, 10);

    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
      // Auto-expand HRM section if navigating to an HRM page
      hrmExpanded: isHrmPage || get().hrmExpanded,
      recentPages: updatedRecent,
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
  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),
  setNotificationsOpen: (open: boolean) => set({ notificationsOpen: open }),
  toggleBulkSelection: (id: string) => {
    const { bulkSelectedIds } = get();
    set({
      bulkSelectedIds: bulkSelectedIds.includes(id)
        ? bulkSelectedIds.filter((i) => i !== id)
        : [...bulkSelectedIds, id],
    });
  },
  clearBulkSelection: () => set({ bulkSelectedIds: [] }),
  selectAllBulk: (ids: string[]) => set({ bulkSelectedIds: ids }),
  openCreateModal: (type: CreateEntityType) =>
    set({ createModalOpen: true, createModalType: type }),
  closeCreateModal: () =>
    set({ createModalOpen: false, createModalType: null }),
  setDensityMode: (mode: 'comfortable' | 'compact') =>
    set({ densityMode: mode }),
}));
