'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettingsStore } from './settings-store';
import { useAuthStore } from '@/store/auth-store';
import SettingsDashboardPage from './settings-dashboard-page';
import WorkspaceProfilePage from './workspace-profile-page';
import BrandingWhiteLabelPage from './branding-white-label-page';
import UsersRolesPage from './users-roles-page';
import PermissionsMatrixPage from './permissions-matrix-page';
import IntegrationsPage from './integrations-page';
import ApiKeysWebhooksPage from './api-keys-webhooks-page';
import BillingSubscriptionPage from './billing-subscription-page';
import FeatureFlagsPage from './feature-flags-page';
import SecurityCompliancePage from './security-compliance-page';
import AuditLogsPage from './audit-logs-page';
import NotificationsPreferencesPage from './notifications-preferences-page';
import DataGovernancePage from './data-governance-page';
import AiControlsPage from './ai-controls-page';
import EnvironmentConfigPage from './environment-config-page';
import BackupRecoveryPage from './backup-recovery-page';
import CustomFieldsPage from './custom-fields-page';
import {
  Search, Bell, Moon, Sun,
  Menu, ChevronRight, Command, Sparkles, SlidersHorizontal,
  LogOut, Calendar,
  Home, ArrowLeft, ArrowRight, Zap, Settings,
  Building2, Palette, Users, Shield, Puzzle, Key,
  CreditCard, Flag, Lock, FileText, BellRing,
  Database, BrainCircuit, Server, Archive, TableProperties,
  Save, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { SettingsPage } from './types';

// ---- Navigation Items ----
interface NavItem {
  id: SettingsPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'settings-dashboard', label: 'Settings Dashboard', icon: Settings },
      { id: 'workspace-profile', label: 'Workspace Profile', icon: Building2 },
      { id: 'branding-white-label', label: 'Branding & White Label', icon: Palette },
    ],
  },
  {
    title: 'Access Control',
    items: [
      { id: 'users-roles', label: 'Users & Roles', icon: Users },
      { id: 'permissions-matrix', label: 'Permissions Matrix', icon: Shield },
      { id: 'security-compliance', label: 'Security & Compliance', icon: Lock, badge: '2', badgeColor: 'from-red-500/20 to-orange-500/20' },
      { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    ],
  },
  {
    title: 'Infrastructure',
    items: [
      { id: 'integrations', label: 'Integrations', icon: Puzzle },
      { id: 'api-keys-webhooks', label: 'API Keys & Webhooks', icon: Key },
      { id: 'feature-flags', label: 'Feature Flags', icon: Flag },
      { id: 'environment-config', label: 'Environment Config', icon: Server },
      { id: 'backup-recovery', label: 'Backup & Recovery', icon: Archive },
    ],
  },
  {
    title: 'Billing & Governance',
    items: [
      { id: 'billing-subscription', label: 'Billing & Subscription', icon: CreditCard },
      { id: 'notifications-preferences', label: 'Notifications', icon: BellRing },
      { id: 'data-governance', label: 'Data Governance', icon: Database },
    ],
  },
  {
    title: 'AI & Customization',
    items: [
      { id: 'ai-controls', label: 'AI Controls', icon: BrainCircuit, badge: 'AI', badgeColor: 'from-violet-500/20 to-purple-500/20' },
      { id: 'custom-fields', label: 'Custom Fields', icon: TableProperties },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

function PageContent() {
  const { currentPage } = useSettingsStore();

  const pageComponents: Record<string, React.ComponentType> = {
    'settings-dashboard': SettingsDashboardPage,
    'workspace-profile': WorkspaceProfilePage,
    'branding-white-label': BrandingWhiteLabelPage,
    'users-roles': UsersRolesPage,
    'permissions-matrix': PermissionsMatrixPage,
    'integrations': IntegrationsPage,
    'api-keys-webhooks': ApiKeysWebhooksPage,
    'billing-subscription': BillingSubscriptionPage,
    'feature-flags': FeatureFlagsPage,
    'security-compliance': SecurityCompliancePage,
    'audit-logs': AuditLogsPage,
    'notifications-preferences': NotificationsPreferencesPage,
    'data-governance': DataGovernancePage,
    'ai-controls': AiControlsPage,
    'environment-config': EnvironmentConfigPage,
    'backup-recovery': BackupRecoveryPage,
    'custom-fields': CustomFieldsPage,
  };

  const PageComponent = pageComponents[currentPage] || null;
  if (!PageComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={currentPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="h-full"
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export default function SettingsLayout() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const { currentPage, sidebarOpen, setSidebarOpen, goBack, goForward, canGoBack, canGoForward, navigateTo, unsavedChanges } = useSettingsStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const canBack = canGoBack();
  const canForward = canGoForward();
  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'Settings';

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('h-screen flex flex-col overflow-hidden transition-colors duration-200', 'bg-[var(--app-bg)] text-[var(--app-text)]')}>
        {/* ========== Top Bar ========== */}
        <header className={cn('h-14 border-b flex items-center justify-between px-4 gap-4 shrink-0 transition-colors', 'bg-[var(--app-bg)] border-[var(--app-border)]')}>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={closeModule} className={cn('shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)]', isDark ? 'hover:bg-white/[0.06] text-white/50 hover:text-white' : 'hover:bg-black/[0.06] text-black/50 hover:text-black')}>
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Home Dashboard</p></TooltipContent>
            </Tooltip>

            <div className={cn('w-px h-5 mx-1 hidden md:block', 'bg-[var(--app-hover-bg)]')} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goBack} disabled={!canBack} className={cn('shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity', !canBack && 'opacity-30 cursor-not-allowed', canBack && isDark && 'hover:bg-white/[0.06]', canBack && !isDark && 'hover:bg-black/[0.06]')}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Back</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goForward} disabled={!canForward} className={cn('shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)] transition-opacity', !canForward && 'opacity-30 cursor-not-allowed', canForward && isDark && 'hover:bg-white/[0.06]', canForward && !isDark && 'hover:bg-black/[0.06]')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Forward</p></TooltipContent>
            </Tooltip>

            <div className={cn('w-px h-5 mx-1 hidden md:block', 'bg-[var(--app-hover-bg)]')} />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden shrink-0 h-8 w-8 rounded-[var(--app-radius-lg)]">
              <Menu className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="DigiNue" width={24} height={16} className="object-contain rounded-[var(--app-radius-sm)]" />
              <span className={cn('text-sm font-semibold tracking-wide hidden sm:block', 'text-[var(--app-text-secondary)]')}>Settings</span>
              <ChevronRight className={cn('w-4 h-4 hidden sm:block', 'text-[var(--app-text-disabled)]')} />
              <span className="text-sm font-medium">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn('hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[var(--app-radius-lg)] border w-64 transition-colors', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input type="text" placeholder="Search settings... (⌘K)" className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
              <kbd className={cn('hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Audit Trail Quick View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Bell className="w-4 h-4" />
                  <span className={cn('absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center', 'bg-[var(--app-card-bg)] text-[var(--app-text)]')}>4</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => navigateTo('ai-controls')} className="relative hidden md:flex h-8 w-8 rounded-[var(--app-radius-lg)]">
                  <Sparkles className="w-4 h-4" />
                  <motion.div className="absolute inset-0 rounded-[var(--app-radius-lg)]" animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0)', '0 0 0 4px rgba(139,92,246,0.1)', '0 0 0 0 rgba(139,92,246,0)'] }} transition={{ duration: 2, repeat: Infinity }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Governance Assistant</TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="h-8 w-8 rounded-[var(--app-radius-lg)]">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowUserMenu(!showUserMenu)} className={cn('h-8 w-8 rounded-[var(--app-radius-lg)] font-bold text-xs', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn('absolute right-0 top-11 w-56 rounded-[var(--app-radius-lg)] border shadow-[var(--app-shadow-md)]-xl p-2 z-50', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
                >
                  <div className={cn('px-3 py-2 border-b mb-1', 'border-[var(--app-border)]')}>
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{user?.email || ''}</p>
                  </div>
                  <button onClick={() => { logout(); setShowUserMenu(false); }} className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] text-sm transition-colors', 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]')}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* ========== Sticky Save Bar ========== */}
        <AnimatePresence>
          {unsavedChanges && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 40 }} exit={{ opacity: 0, height: 0 }}
              className={cn('border-b flex items-center justify-between px-4 shrink-0 transition-colors', isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200')}
            >
              <span className={cn('text-xs font-medium', isDark ? 'text-amber-300' : 'text-amber-700')}>You have unsaved changes</span>
              <Button size="sm" onClick={() => useSettingsStore.getState().setUnsavedChanges(false)} className="h-8  text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-[var(--app-radius-lg)]">
                <Save className="w-4 h-4 mr-1" /> Save Changes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== Main Content ========== */}
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
                animate={isMobile ? { x: 0 } : { width: 256, opacity: 1 }}
                exit={isMobile ? { x: -280 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn('border-r shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50', isMobile && 'w-[280px]', 'border-[var(--app-border)] bg-[var(--app-bg)]')}
              >
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                  {navSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-2">
                      <div className="px-3 pt-3 pb-1.5">
                        <span className={cn('text-[10px] font-semibold tracking-wider uppercase', 'text-[var(--app-text-muted)]')}>{section.title}</span>
                      </div>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = currentPage === item.id;
                          return (
                            <button key={item.id} onClick={() => { navigateTo(item.id); if (isMobile) setSidebarOpen(false); }}
                              className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-[var(--app-radius-lg)] text-sm transition-colors duration-200 group',
                                isActive ? (isDark ? 'bg-white/[0.08] text-white font-medium' : 'bg-black/[0.06] text-black font-medium')
                                  : (isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.04]')
                              )}
                            >
                              <item.icon className={cn('w-5 h-5 transition-colors shrink-0', isActive ? ('text-[var(--app-text)]') : ('text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'))} />
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className={cn('ml-auto text-[9px] px-1.5 py-0 border-0 bg-gradient-to-r', item.badgeColor || '', 'text-[var(--app-purple)]')}>{item.badge}</Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {sectionIdx < navSections.length - 1 && (
                        <div className={cn('mx-3 mt-3 mb-1 border-t', 'border-[var(--app-border-light)]')} />
                      )}
                    </div>
                  ))}
                </nav>

                <div className={cn('p-3 border-t space-y-3', 'border-[var(--app-border)]')}>
                  <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium">Settings Alert</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
                      2 security alerts need attention. API key expires in 3 days. Subscription renewal due in 7 days.
                    </p>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex-1 overflow-hidden">
            <PageContent />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
