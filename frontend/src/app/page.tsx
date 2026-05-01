'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { getModuleConfigFromPathname } from '@/lib/module-registry';
import EnhancedPremiumDesktop from '@/components/dashboard/enhanced-premium-desktop';

/* ============================================
   Dynamic imports — each module loads only when needed.
   This reduces initial bundle from ~2MB+ to ~200KB.
   ============================================ */

const CrmSalesLayout = dynamic(() => import('@/modules/crm-sales/crm-sales-layout'), {
  loading: () => <ModuleLoader />,
});

const ErpLayout = dynamic(() => import('@/modules/erp/erp-layout'), {
  loading: () => <ModuleLoader />,
});

const MarketingLayout = dynamic(() => import('@/modules/marketing/marketing-layout'), {
  loading: () => <ModuleLoader />,
});

const FinanceLayout = dynamic(() => import('@/modules/finance/finance-layout'), {
  loading: () => <ModuleLoader />,
});

const RetentionLayout = dynamic(() => import('@/modules/retention/retention-layout'), {
  loading: () => <ModuleLoader />,
});

const AnalyticsLayout = dynamic(() => import('@/modules/analytics/analytics-layout'), {
  loading: () => <ModuleLoader />,
});

const AutomationLayout = dynamic(() => import('@/modules/automation/automation-layout'), {
  loading: () => <ModuleLoader />,
});

const SettingsLayout = dynamic(() => import('@/modules/settings/settings-layout'), {
  loading: () => <ModuleLoader />,
});

// Auth pages — lightweight but still lazy-loaded for clean separation
const LoginPage = dynamic(() => import('@/modules/auth/login-page'), {
  loading: () => <ModuleLoader />,
});

const RegisterPage = dynamic(() => import('@/modules/auth/register-page'), {
  loading: () => <ModuleLoader />,
});

const ForgotPasswordPage = dynamic(() => import('@/modules/auth/forgot-password-page'), {
  loading: () => <ModuleLoader />,
});

const OtpPage = dynamic(() => import('@/modules/auth/otp-page'), {
  loading: () => <ModuleLoader />,
});

const ProfilePage = dynamic(() => import('@/modules/auth/profile-page'), {
  loading: () => <ModuleLoader />,
});

const RolesPage = dynamic(() => import('@/modules/auth/roles-page'), {
  loading: () => <ModuleLoader />,
});

const TeamInvitePage = dynamic(() => import('@/modules/auth/team-invite-page'), {
  loading: () => <ModuleLoader />,
});

const SessionsPage = dynamic(() => import('@/modules/auth/sessions-page'), {
  loading: () => <ModuleLoader />,
});

/* ============================================
   Inline module loader — shown while chunk loads
   ============================================ */
function ModuleLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--app-surface-0)]">
      <div className="flex items-center gap-2 text-[var(--app-text-muted)]">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--app-structural)]" />
        <span className="text-sm font-medium tracking-wide">Loading module...</span>
      </div>
    </div>
  );
}

/* ============================================
   Routing maps
   ============================================ */

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

export default function Home() {
  const { isAuthenticated, currentPage, activeModule } = useAuthStore();
  const pathname = usePathname();

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
    if (isAuthEntry && CurrentPage) {
      content = <CurrentPage />;
      renderKey = currentPage;
    } else {
      content = <LoginPage />;
      renderKey = 'login';
    }
  } else {
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
        content = <EnhancedPremiumDesktop />;
        renderKey = 'enhanced-premium-desktop';
      }
    } else if (isManagement && CurrentPage) {
      content = <CurrentPage />;
      renderKey = currentPage;
    } else {
      content = <EnhancedPremiumDesktop />;
      renderKey = 'enhanced-premium-desktop';
    }
  }

  return (
    <div key={renderKey} className="contents">
      {content}
    </div>
  );
}
