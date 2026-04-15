'use client';

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
  const showDashboard = isAuthenticated && (isAuthEntry || !isManagement) && !activeModule;
  const showManagement = isAuthenticated && isManagement && !activeModule;
  const showAuth = !isAuthenticated;
  const showModule = isAuthenticated && !!activeModule;

  const CurrentPage = pageComponents[currentPage];

  let content: React.ReactNode;

  if (showModule && (activeModule === 'crm' || activeModule === 'sales')) {
    content = <CrmSalesLayout />;
  } else if (showModule && activeModule === 'erp') {
    content = <ErpLayout />;
  } else if (showModule && activeModule === 'marketing') {
    content = <MarketingLayout />;
  } else if (showModule && activeModule === 'finance') {
    content = <FinanceLayout />;
  } else if (showModule && activeModule === 'growth') {
    content = <RetentionLayout />;
  } else if (showModule && activeModule === 'analytics') {
    content = <AnalyticsLayout />;
  } else if (showModule && activeModule === 'automation') {
    content = <AutomationLayout />;
  } else if (showModule && activeModule === 'settings') {
    content = <SettingsLayout />;
  } else if (showDashboard) {
    content = <WindowsDesktop />;
  } else if (showManagement && CurrentPage) {
    content = <CurrentPage />;
  } else if (showAuth && CurrentPage) {
    content = <CurrentPage />;
  } else {
    content = isAuthenticated ? <WindowsDesktop /> : <LoginPage />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showModule ? activeModule : showDashboard ? 'dashboard' : currentPage}
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
