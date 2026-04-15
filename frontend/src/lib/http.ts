'use client';

import axios from 'axios';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: false,
});

// Attach auth token from Zustand store when present
apiClient.interceptors.request.use((config) => {
  // Lazy import to avoid circular deps
  const { useAuthStore } = require('@/store/auth-store');
  const state = useAuthStore.getState();
  if (state.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${state.accessToken}`,
    };
  }
  return config;
});

// If a request fails with 401, try refresh once
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { useAuthStore } = require('@/store/auth-store');
      const state = useAuthStore.getState();
      if (!state.refreshToken) return Promise.reject(error);
      try {
        const { data } = await apiClient.post('/api/auth/refresh', {
          refresh_token: state.refreshToken,
        });
        state.setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch (refreshErr) {
        state.logout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
