'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { getModuleConfigFromPathname } from '@/lib/module-registry';
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

// Module routing map — supports both store-based IDs and pathname-detected IDs
const moduleLayoutMap: Record<string, React.ComponentType> = {
  crm: CrmSalesLayout,
  sales: CrmSalesLayout,
  'crm-sales': CrmSalesLayout,
  erp: ErpLayout,
  marketing: MarketingLayout,
  finance: FinanceLayout,
  growth: RetentionLayout,
  retention: RetentionLayout,
  analytics: AnalyticsLayout,
  automation: AutomationLayout,
  settings: SettingsLayout,
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Home() {
  const { isAuthenticated, currentPage, activeModule } = useAuthStore();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

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

  // Artificial loading state for smooth transitions and initial hydration
  useEffect(() => {
    setIsInitializing(true);
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 700); // 700ms loading screen to smooth out heavy dashboard rendering
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  let content: React.ReactNode;
  let renderKey = 'login';

  if (isInitializing) {
    // Full-screen animated loading spinner
    content = (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <Image src="/logo.png" alt="NueEra" width={90} height={70} className="object-contain animate-pulse opacity-90" priority />
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-sm font-medium tracking-wide">Preparing Workspace...</span>
          </div>
        </motion.div>
      </div>
    );
    renderKey = 'loader';
  } else if (!isAuthenticated) {
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
    // Resolve module: store-based (activeModule) takes priority, pathname-based as fallback
    const pathDetectedModule = (() => {
      const detected = getModuleConfigFromPathname(pathname);
      return detected?.moduleId ?? null;
    })();
    const renderModule = activeModule || pathDetectedModule;

    if (renderModule) {
      const LayoutComponent = moduleLayoutMap[renderModule];
      if (LayoutComponent) {
        content = <LayoutComponent />;
        renderKey = renderModule;
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
