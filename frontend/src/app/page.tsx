'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import WindowsDesktop from '@/components/dashboard/windows-desktop';
import CrmSalesLayout from '@/modules/crm-sales/crm-sales-layout';
import ErpLayout from '@/modules/erp/erp-layout';
import MarketingLayout from '@/modules/marketing/marketing-layout';
import FinanceLayout from '@/modules/finance/finance-layout';
import RetentionLayout from '@/modules/retention/retention-layout';
import AnalyticsLayout from '@/modules/analytics/analytics-layout';
import AutomationLayout from '@/modules/automation/automation-layout';
import SettingsLayout from '@/modules/settings/settings-layout';
import LoginPage from '@/modules/auth/login-page';
import RegisterPage from '@/modules/auth/register-page';
import ForgotPasswordPage from '@/modules/auth/forgot-password-page';
import OtpPage from '@/modules/auth/otp-page';
import ProfilePage from '@/modules/auth/profile-page';
import RolesPage from '@/modules/auth/roles-page';
import TeamInvitePage from '@/modules/auth/team-invite-page';
import SessionsPage from '@/modules/auth/sessions-page';

const pageComponents: Record<string, React.ComponentType> = {
  login: LoginPage,
  register: RegisterPage,
  'forgot-password': ForgotPasswordPage,
  otp: OtpPage,
  profile: ProfilePage,
  roles: RolesPage,
  'team-invite': TeamInvitePage,
  sessions: SessionsPage,
};

const authEntryPages = new Set(['login', 'register', 'forgot-password', 'otp']);
const managementPages = new Set(['profile', 'roles', 'team-invite', 'sessions']);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Home() {
  const { isAuthenticated, currentPage, activeModule } = useAuthStore();

  const isAuthEntry = authEntryPages.has(currentPage);
  const isManagement = managementPages.has(currentPage);

  const CurrentPage = pageComponents[currentPage];

  // Clear mock cookies if the user signs out to prevent auto-login loops
  useEffect(() => {
    if (!isAuthenticated) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [isAuthenticated]);

  let content: React.ReactNode;
  let renderKey = 'login';

  if (!isAuthenticated) {
    // Enforce auth pages when logged out
    if (isAuthEntry && CurrentPage) {
      content = <CurrentPage />;
      renderKey = currentPage;
    } else {
      content = <LoginPage />;
      renderKey = 'login';
    }
  } else {
    // Render authenticated application routes
    if (activeModule) {
      renderKey = activeModule;
      if (activeModule === 'crm' || activeModule === 'sales') {
        content = <CrmSalesLayout />;
      } else if (activeModule === 'erp') {
        content = <ErpLayout />;
      } else if (activeModule === 'marketing') {
        content = <MarketingLayout />;
      } else if (activeModule === 'finance') {
        content = <FinanceLayout />;
      } else if (activeModule === 'growth') {
        content = <RetentionLayout />;
      } else if (activeModule === 'analytics') {
        content = <AnalyticsLayout />;
      } else if (activeModule === 'automation') {
        content = <AutomationLayout />;
      } else if (activeModule === 'settings') {
        content = <SettingsLayout />;
      } else {
        content = <WindowsDesktop />;
        renderKey = 'dashboard';
      }
    } else if (isManagement && CurrentPage) {
      content = <CurrentPage />;
      renderKey = currentPage;
    } else {
      content = <WindowsDesktop />;
      renderKey = 'dashboard';
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={renderKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
