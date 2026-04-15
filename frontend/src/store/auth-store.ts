'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/http';
import { LoginResponse, User } from '@/types/auth';

export type AuthPage =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'otp'
  | 'profile'
  | 'roles'
  | 'team-invite'
  | 'sessions';

export type ModuleId =
  | 'dashboard'
  | 'crm'
  | 'erp'
  | 'marketing'
  | 'sales'
  | 'finance'
  | 'growth'
  | 'analytics'
  | 'automation'
  | 'settings';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showAuth: boolean;
  isAuthView: boolean;
  currentPage: AuthPage;
  activeModule: ModuleId | null;
  pendingOtpNumber: string;
  accessToken: string | null;
  refreshToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: { full_name?: string; email: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  toggleAuthView: () => void;
  navigateTo: (page: AuthPage) => void;
  openModule: (module: ModuleId) => void;
  closeModule: () => void;
  setPendingOtpNumber: (number: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  showAuth: true,
  isAuthView: true,
  currentPage: 'login',
  pendingOtpNumber: '',
  accessToken: null,
  refreshToken: null,

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<LoginResponse>('/api/auth/login', { email, password });
    set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    await get().fetchMe();
  },

  signup: async (payload: { full_name?: string; email: string; password: string }) => {
    await apiClient.post('/api/auth/register', payload);
    await get().login(payload.email, payload.password);
  },

  fetchMe: async () => {
    const { data } = await apiClient.get<User>('/api/auth/me');
    set({ user: data, isAuthenticated: true, showAuth: false });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      showAuth: true,
      isAuthView: true,
      currentPage: 'login',
      activeModule: null,
      pendingOtpNumber: '',
      accessToken: null,
      refreshToken: null,
    });
  },

  setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
  toggleAuthView: () => set((state) => ({ isAuthView: !state.isAuthView })),

  navigateTo: (page: AuthPage) => set({ currentPage: page }),
  openModule: (module: ModuleId) => set({ activeModule: module }),
  closeModule: () => set({ activeModule: null }),
  setPendingOtpNumber: (number: string) => set({ pendingOtpNumber: number }),
  updateProfile: (data: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
