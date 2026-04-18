'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initAuth = async () => {
      try {
        await fetchMe();
      } catch (err) {
        console.warn('Backend fetchMe failed, checking for demo mode...', err);
        // Fallback for demo mode until the backend is fully operational
        if (document.cookie.includes('demo-jwt-token-123')) {
          useAuthStore.setState({
            isAuthenticated: true,
            showAuth: false,
            user: {
              id: 'usr-demo-001',
              name: 'Demo User',
              email: 'demo@company.com',
              role: 'admin',
              status: 'active',
              timezone: 'Asia/Kolkata',
              language: 'English',
              avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
            } as any // Cast as any to bypass strict type requirements for missing fields during demo
          });
        }
      }
    };

    if (!isAuthenticated) {
      initAuth();
    }
  }, [fetchMe, isAuthenticated]);

  if (!mounted) return null;

  return <>{children}</>;
}