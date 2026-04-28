'use client';

import { create } from 'zustand';
import type { ErpPage, Toast, SmartAlert, SidebarPanel, PinnedPage, SavedView, DashboardWidget } from './types';

// ---- Create Entity Types ----
export type CreateEntityType = 'task' | 'employee' | 'project' | 'leave' | 'asset';

// HRM-related pages for auto-expand detection
const HRM_PAGES: ErpPage[] = [
  'hrm',
  'employees',
  'employee-detail',
  'employee-analytics',
  'departments',
  'attendance',
  'shifts',
  'leaves',
  'payroll',
  'compensation',
  'incentives',
  'performance',
  'onboarding',
  'documents',
];

// Finance-related pages for auto-expand detection
const FINANCE_PAGES: ErpPage[] = [
  'invoices',
  'vendors',
  'finance-ops',
  'profitability',
];

// Operations-related pages for auto-expand detection
const OPS_PAGES: ErpPage[] = [
  'ops-dashboard',
  'projects',
  'project-detail',
  'tasks-board',
  'delivery-ops',
  'sop-templates',
  'internal-chat',
];

// Resources-related pages
const RESOURCES_PAGES: ErpPage[] = [
  'resource-planning',
  'workload',
];

// Management-related pages
const MANAGEMENT_PAGES: ErpPage[] = [
  'assets',
  'approvals',
];

// Intelligence-related pages
const INTELLIGENCE_PAGES: ErpPage[] = [
  'ai-ops',
  'ai-ops-intelligence',
];

// Section ID to page list mapping
const SECTION_PAGES: Record<string, ErpPage[]> = {
  operations: OPS_PAGES,
  hrm: HRM_PAGES,
  finance: FINANCE_PAGES,
  resources: RESOURCES_PAGES,
  management: MANAGEMENT_PAGES,
  intelligence: INTELLIGENCE_PAGES,
};

interface ErpState {
  // Existing state
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
  createModalOpen: boolean;
  createModalType: CreateEntityType | null;
  densityMode: 'comfortable' | 'compact';

  // New state fields
  toasts: Toast[];
  alerts: SmartAlert[];
  contextualSidebar: SidebarPanel | null;
  pinnedPages: PinnedPage[];
  savedViews: SavedView[];
  dashboardWidgets: DashboardWidget[];
  onboardingCompleted: boolean;
  financeExpanded: boolean;
  opsExpanded: boolean;
  columnVisibility: Record<string, string[]>;
  inlineEditing: { entityType: string; entityId: string; field: string } | null;

  // Existing actions
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

  // New actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openContextualSidebar: (entityType: SidebarPanel['entityType'], entityId: string) => void;
  closeContextualSidebar: () => void;
  togglePinnedPage: (page: ErpPage, label: string, icon: string) => void;
  addSavedView: (view: SavedView) => void;
  removeSavedView: (id: string) => void;
  updateWidgetPosition: (widgetId: string, position: DashboardWidget['position']) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  setOnboardingCompleted: () => void;
  setColumnVisibility: (page: string, columns: string[]) => void;
  startInlineEdit: (entityType: string, entityId: string, field: string) => void;
  stopInlineEdit: () => void;
  markAlertRead: (id: string) => void;
  silenceAlert: (id: string) => void;
  setFinanceExpanded: (expanded: boolean) => void;
  setOpsExpanded: (expanded: boolean) => void;
}

// Helper: get expanded state for a section
function getSectionExpand(sectionId: string, get: () => ErpState): boolean {
  switch (sectionId) {
    case 'hrm': return get().hrmExpanded;
    case 'finance': return get().financeExpanded;
    case 'operations': return get().opsExpanded;
    default: return false;
  }
}

export const useErpStore = create<ErpState>((set, get) => ({
  // Existing initial state
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
  createModalOpen: false,
  createModalType: null,
  densityMode: 'comfortable' as const,

  // New initial state
  toasts: [],
  alerts: [
    { id: 'a1', priority: 'critical', category: 'project', title: 'NexaBank Budget Overrun', description: 'Project has exceeded budget by 12%. Immediate review needed.', entityId: 'p1', entityType: 'projects', isRead: false, isSilenced: false, createdAt: '2026-04-28T10:30:00', actionText: 'Review Project' },
    { id: 'a2', priority: 'high', category: 'employee', title: '3 Tasks Overdue', description: 'Rahul Sharma has 3 overdue tasks across 2 projects.', entityId: 'e2', entityType: 'employee-detail', isRead: false, isSilenced: false, createdAt: '2026-04-28T09:15:00', actionText: 'View Employee' },
    { id: 'a3', priority: 'medium', category: 'finance', title: 'Invoice Payment Delayed', description: 'ShopVerse invoice INV-003 is 5 days overdue.', entityId: 'inv3', entityType: 'invoices', isRead: true, isSilenced: false, createdAt: '2026-04-27T14:00:00', actionText: 'View Invoice' },
    { id: 'a4', priority: 'low', category: 'delivery', title: 'Delivery SLA Warning', description: 'MediCare app deliverable approaching SLA deadline in 2 days.', entityId: 'd4', entityType: 'delivery-ops', isRead: true, isSilenced: false, createdAt: '2026-04-27T11:00:00' },
  ],
  contextualSidebar: null,
  pinnedPages: [],
  savedViews: [],
  dashboardWidgets: [],
  onboardingCompleted: false,
  financeExpanded: false,
  opsExpanded: true,
  columnVisibility: {},
  inlineEditing: null,

  // ---- Existing actions ----

  navigateTo: (page: ErpPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;

    // Build recentPages: remove duplicates, add new page to front, keep max 10
    const existing = get().recentPages.filter((p) => p !== page);
    const updatedRecent = [page, ...existing].slice(0, 10);

    // Auto-expand relevant section
    const sectionUpdate: Partial<ErpState> = {};
    for (const [sectionId, pages] of Object.entries(SECTION_PAGES)) {
      if (pages.includes(page)) {
        switch (sectionId) {
          case 'hrm': sectionUpdate.hrmExpanded = true; break;
          case 'finance': sectionUpdate.financeExpanded = true; break;
          case 'operations': sectionUpdate.opsExpanded = true; break;
        }
        break;
      }
    }

    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
      recentPages: updatedRecent,
      ...sectionUpdate,
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

    // Auto-expand relevant section
    const sectionUpdate: Partial<ErpState> = {};
    for (const [sectionId, pages] of Object.entries(SECTION_PAGES)) {
      if (pages.includes(prevPage as ErpPage)) {
        switch (sectionId) {
          case 'hrm': sectionUpdate.hrmExpanded = true; break;
          case 'finance': sectionUpdate.financeExpanded = true; break;
          case 'operations': sectionUpdate.opsExpanded = true; break;
        }
        break;
      }
    }

    set({
      history: newHistory,
      forwardStack: [...forwardStack, currentPage],
      currentPage: prevPage as ErpPage,
      selectedProjectId: prevPage === 'projects' ? null : selectedProjectId,
      selectedEmployeeId: prevPage === 'employees' ? null : selectedEmployeeId,
      ...sectionUpdate,
    });
  },

  goForward: () => {
    const { forwardStack, currentPage, history } = get();
    if (forwardStack.length === 0) return;
    const newForward = [...forwardStack];
    const nextPage = newForward.pop()!;

    // Auto-expand relevant section
    const sectionUpdate: Partial<ErpState> = {};
    for (const [sectionId, pages] of Object.entries(SECTION_PAGES)) {
      if (pages.includes(nextPage as ErpPage)) {
        switch (sectionId) {
          case 'hrm': sectionUpdate.hrmExpanded = true; break;
          case 'finance': sectionUpdate.financeExpanded = true; break;
          case 'operations': sectionUpdate.opsExpanded = true; break;
        }
        break;
      }
    }

    set({
      history: [...history, currentPage],
      forwardStack: newForward,
      currentPage: nextPage as ErpPage,
      ...sectionUpdate,
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

  // ---- New actions ----

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: Toast = { ...toast, id };
    set({ toasts: [...get().toasts, newToast] });

    // Auto-remove after duration
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      }, duration);
    }
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  openContextualSidebar: (entityType, entityId) => {
    set({
      contextualSidebar: {
        id: `sidebar-${entityType}-${entityId}`,
        entityType,
        entityId,
        isOpen: true,
      },
    });
  },

  closeContextualSidebar: () => {
    set({ contextualSidebar: null });
  },

  togglePinnedPage: (page, label, icon) => {
    const { pinnedPages } = get();
    const exists = pinnedPages.some((p) => p.page === page);
    if (exists) {
      set({ pinnedPages: pinnedPages.filter((p) => p.page !== page) });
    } else {
      set({ pinnedPages: [...pinnedPages, { page, label, icon }] });
    }
  },

  addSavedView: (view) => {
    set({ savedViews: [...get().savedViews, view] });
  },

  removeSavedView: (id) => {
    set({ savedViews: get().savedViews.filter((v) => v.id !== id) });
  },

  updateWidgetPosition: (widgetId, position) => {
    set({
      dashboardWidgets: get().dashboardWidgets.map((w) =>
        w.id === widgetId ? { ...w, position } : w
      ),
    });
  },

  toggleWidgetVisibility: (widgetId) => {
    set({
      dashboardWidgets: get().dashboardWidgets.map((w) =>
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
      ),
    });
  },

  setOnboardingCompleted: () => {
    set({ onboardingCompleted: true });
  },

  setColumnVisibility: (page, columns) => {
    set({
      columnVisibility: { ...get().columnVisibility, [page]: columns },
    });
  },

  startInlineEdit: (entityType, entityId, field) => {
    set({ inlineEditing: { entityType, entityId, field } });
  },

  stopInlineEdit: () => {
    set({ inlineEditing: null });
  },

  markAlertRead: (id) => {
    set({
      alerts: get().alerts.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      ),
    });
  },

  silenceAlert: (id) => {
    set({
      alerts: get().alerts.map((a) =>
        a.id === id ? { ...a, isSilenced: true } : a
      ),
    });
  },

  setFinanceExpanded: (expanded) => set({ financeExpanded: expanded }),
  setOpsExpanded: (expanded) => set({ opsExpanded: expanded }),
}));
