'use client';

import { create } from 'zustand';
import { useFeedbackStore } from '@/hooks/use-action-feedback.tsx';
import type { CrmSalesPage } from './types';

interface CrmSalesNotification {
  id: string;
  type: 'deal_won' | 'new_lead' | 'task_overdue' | 'follow_up' | 'ai_insight' | 'email_reply' | 'proposal_viewed';
  title: string;
  description: string;
  time: string;
  read: boolean;
  entityId?: string;
  entityType?: string;
}

export type DensityMode = 'comfortable' | 'compact';

export type CreateModalType = 'contact' | 'company' | 'deal' | 'lead' | 'task' | 'note' | 'proposal' | null;

interface CrmSalesState {
  // Navigation
  currentPage: CrmSalesPage;
  history: string[];
  forwardStack: string[];
  recentPages: { page: CrmSalesPage; label: string }[];

  // Entity selection
  selectedContactId: string | null;
  selectedCompanyId: string | null;
  selectedLeadId: string | null;
  selectedDealId: string | null;

  // UI state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  quickCreateOpen: boolean;
  searchQuery: string;
  density: DensityMode;

  // Notifications
  notifications: CrmSalesNotification[];

  // Bulk operations
  bulkSelectedIds: string[];

  // Create modal
  createModalOpen: boolean;
  createModalType: CreateModalType;

  // Actions
  navigateTo: (page: CrmSalesPage) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  selectContact: (id: string) => void;
  selectCompany: (id: string) => void;
  selectLead: (id: string) => void;
  selectDeal: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (open: boolean) => void;
  toggleQuickCreate: () => void;
  setSearchQuery: (query: string) => void;
  setDensity: (density: DensityMode) => void;
  toggleDensity: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Bulk actions
  toggleBulkSelection: (id: string) => void;
  selectAllBulk: (ids: string[]) => void;
  clearBulkSelection: () => void;

  // Create modal
  openCreateModal: (type: CreateModalType) => void;
  closeCreateModal: () => void;
}

export const useCrmSalesStore = create<CrmSalesState>((set, get) => ({
  // Navigation
  currentPage: 'crm-dashboard',
  history: [],
  forwardStack: [],
  recentPages: [],

  // Entity selection
  selectedContactId: null,
  selectedCompanyId: null,
  selectedLeadId: null,
  selectedDealId: null,

  // UI state
  sidebarOpen: true,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationsOpen: false,
  quickCreateOpen: false,
  searchQuery: '',
  density: 'comfortable',

  // Notifications
  notifications: [
    { id: 'cn1', type: 'deal_won', title: 'Deal Won!', description: 'StartupXYZ Starter Kit closed at $48,000', time: '30 min ago', read: false, entityId: 'd5', entityType: 'deal' },
    { id: 'cn2', type: 'new_lead', title: 'New Hot Lead', description: 'Marcus Johnson (USA Tech) scored 90/100', time: '1 hour ago', read: false, entityId: 'sl10', entityType: 'lead' },
    { id: 'cn3', type: 'task_overdue', title: 'Task Overdue', description: 'Call Ahmed Hassan was due yesterday', time: '2 hours ago', read: false, entityId: 't6', entityType: 'task' },
    { id: 'cn4', type: 'ai_insight', title: 'AI: High Buying Intent', description: 'Arjun Mehta visited pricing 5x in 48h', time: '3 hours ago', read: true, entityId: 'ai1', entityType: 'insight' },
    { id: 'cn5', type: 'proposal_viewed', title: 'Proposal Viewed', description: 'Emily Johnson viewed Starter Kit proposal', time: '5 hours ago', read: true, entityId: 'a5', entityType: 'activity' },
    { id: 'cn6', type: 'follow_up', title: 'Follow-up Due', description: '3 follow-ups due today', time: '6 hours ago', read: true, entityId: '', entityType: '' },
    { id: 'cn7', type: 'email_reply', title: 'Email Reply Received', description: 'Sarah Chen responded to migration proposal', time: '8 hours ago', read: true, entityId: 'c2', entityType: 'contact' },
  ],

  // Bulk
  bulkSelectedIds: [],

  // Create modal
  createModalOpen: false,
  createModalType: null,

  // Navigation actions
  navigateTo: (page: CrmSalesPage) => {
    const { currentPage } = get();
    if (currentPage === page) return;

    const pageLabels: Record<string, string> = {
      'crm-dashboard': 'Dashboard',
      'contacts': 'Contacts',
      'contact-detail': 'Contact Detail',
      'companies': 'Companies',
      'company-detail': 'Company Detail',
      'leads': 'Leads',
      'lead-detail': 'Lead Detail',
      'deals': 'Deals',
      'deal-detail': 'Deal Detail',
      'deals-pipeline': 'Deals Pipeline',
      'activities': 'Activities',
      'tasks': 'Tasks',
      'notes': 'Notes',
      'segments': 'Segments',
      'lifecycle': 'Lifecycle',
      'contact-intelligence': 'AI Intelligence',
      'lead-capture': 'Lead Capture',
      'qualification': 'Qualification',
      'sales-forecast': 'Sales Forecast',
      'revenue': 'Revenue',
      'team-performance': 'Team Performance',
      'followups': 'Follow-ups',
      'proposals': 'Proposals',
      'win-loss': 'Win / Loss',
    };

    const label = pageLabels[page] || page;
    set({
      history: [...get().history, currentPage],
      forwardStack: [],
      currentPage: page,
      recentPages: [
        { page, label },
        ...get().recentPages.filter(p => p.page !== page).slice(0, 9),
      ],
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

  // Entity selection
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

  // UI state
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),
  toggleNotifications: () => set(s => ({ notificationsOpen: !s.notificationsOpen })),
  setNotificationsOpen: (open: boolean) => set({ notificationsOpen: open }),
  toggleQuickCreate: () => set(s => ({ quickCreateOpen: !s.quickCreateOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setDensity: (density: DensityMode) => set({ density }),
  toggleDensity: () => set(s => ({ density: s.density === 'comfortable' ? 'compact' : 'comfortable' })),

  // Notifications
  markNotificationRead: (id: string) => {
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
    useFeedbackStore.getState().addToast('info', {
      title: 'Notification Read',
      message: 'Notification has been marked as read.',
    });
  },
  markAllNotificationsRead: () => {
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    }));
    useFeedbackStore.getState().addToast('success', {
      title: 'All Notifications Read',
      message: 'All notifications have been marked as read.',
    });
  },

  // Bulk operations
  toggleBulkSelection: (id: string) => set(s => ({
    bulkSelectedIds: s.bulkSelectedIds.includes(id)
      ? s.bulkSelectedIds.filter(i => i !== id)
      : [...s.bulkSelectedIds, id],
  })),
  selectAllBulk: (ids: string[]) => set({ bulkSelectedIds: ids }),
  clearBulkSelection: () => set({ bulkSelectedIds: [] }),

  // Create modal
  openCreateModal: (type: CreateModalType) => set({ createModalOpen: true, createModalType: type, quickCreateOpen: false }),
  closeCreateModal: () => set({ createModalOpen: false, createModalType: null }),
}));
