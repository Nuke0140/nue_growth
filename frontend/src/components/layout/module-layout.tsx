'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
  type ComponentType,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  X,
  Menu,
  ChevronRight,
  ChevronDown,
  Command,
  Home,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Settings,
  User,
  Sparkles,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CSS, ANIMATION, LAYOUT, MODULE_ACCENTS, Z_INDEX, inlineStyles } from '@/styles/design-tokens';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================================================
// Types
// ============================================================================

export interface NavSubItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isAI?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  icon?: LucideIcon;
  items: NavSubItem[];
}

export interface ModuleConfig {
  // Identity
  moduleId: string;
  moduleName: string;
  moduleShortName?: string;
  moduleIcon?: LucideIcon;
  accentKey?: keyof typeof MODULE_ACCENTS;

  // Navigation
  navSections: NavSection[];
  pageComponents: Record<string, ComponentType>;
  allPageLabels: Record<string, string>;

  // Store interface — each module passes its own Zustand bindings
  useStore: () => {
    currentPage: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    navigateTo: (page: string) => void;
    goBack: () => void;
    goForward: () => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
  };

  // Feature flags
  collapsibleSections?: boolean;
  lazyLoading?: boolean;
  commandPalette?: boolean;

  // Customisation hooks
  sidebarFooter?: ReactNode;
  topbarExtra?: ReactNode;
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
  onBackToHome?: () => void;
}

// ============================================================================
// Helpers
// ============================================================================

/** Derive accent from MODULE_ACCENTS, falling back to CSS vars */
function getAccent(config: ModuleConfig) {
  const key = config.accentKey ?? (config.moduleId as keyof typeof MODULE_ACCENTS);
  return MODULE_ACCENTS[key] ?? {
    primary: CSS.accent,
    hover: CSS.accentHover,
    light: CSS.accentLight,
  };
}

/** Build a flat page→sectionId map from navSections for section-activity detection */
function buildSectionPageMap(sections: NavSection[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const section of sections) {
    map[section.id] = section.items.map((item) => item.id);
  }
  return map;
}

// ============================================================================
// Sub-components
// ============================================================================

// ---- Skeleton loader for lazy-loading mode ----
function ModuleSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// ---- Sidebar Footer (user profile) ----
function DefaultSidebarFooter({ accent }: { accent: { primary: string } }) {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const role =
    (user as Record<string, unknown>)?.role ?? 'Team Member';

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--app-hover-bg)] transition-colors cursor-pointer">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback
          className="text-white text-xs font-semibold rounded-lg"
          style={{ backgroundColor: accent.primary }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--app-text)] truncate">
          {user?.name || 'User'}
        </p>
        <p className="text-[11px] text-[var(--app-text-muted)] truncate">
          {role as string}
        </p>
      </div>
    </div>
  );
}

// ---- Sidebar Nav Item (flat — CRM-style) ----
function FlatNavItem({
  item,
  isActive,
  accent,
  onClick,
}: {
  item: NavSubItem;
  isActive: boolean;
  accent: { primary: string; light: string };
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 group relative',
        isActive
          ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] font-medium'
          : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="module-sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
          style={{ backgroundColor: accent.primary }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <item.icon
        className={cn(
          'w-[18px] h-[18px] transition-colors shrink-0',
          isActive
            ? 'text-[var(--app-accent)]'
            : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'
        )}
      />
      <span className="truncate flex-1 text-left">{item.label}</span>
      {item.isAI && (
        <Badge
          variant="secondary"
          className="ml-auto text-[9px] px-1.5 py-0 rounded-md border-0 font-medium"
          style={{ backgroundColor: accent.light, color: accent.primary }}
        >
          AI
        </Badge>
      )}
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className="ml-auto text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white px-1.5 leading-none"
          style={{ backgroundColor: accent.primary }}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </button>
  );
}

// ---- Collapsible Sidebar Section (ERP-style) ----
function CollapsibleSection({
  section,
  isExpanded,
  isSectionActive,
  onToggle,
  currentPage,
  onNavClick,
  accent,
}: {
  section: NavSection;
  isExpanded: boolean;
  isSectionActive: boolean;
  onToggle: () => void;
  currentPage: string;
  onNavClick: (page: string) => void;
  accent: { primary: string; light: string };
}) {
  if (section.items.length === 0) return null;
  const SectionIcon = section.icon ?? Sparkles;
  const firstPage = section.items[0].id;

  return (
    <div className="mb-1">
      {/* Section label */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--app-text-disabled)]">
          {section.label}
        </span>
      </div>

      {/* Section toggle header */}
      <button
        onClick={() => {
          onToggle();
          if (!isExpanded) onNavClick(firstPage);
        }}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 group text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]"
      >
        <SectionIcon
          className={cn(
            'w-[18px] h-[18px] transition-colors shrink-0',
            isSectionActive
              ? 'text-[var(--app-accent)]'
              : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]'
          )}
        />
        <span className="flex-1 text-left truncate">{section.label}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: ANIMATION.duration.normal }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[var(--app-text-disabled)]" />
        </motion.div>
      </button>

      {/* Collapsible sub-items */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease }}
            className="overflow-hidden"
          >
            <div className="ml-3 pl-3 border-l border-[var(--app-border)] space-y-0.5 py-1">
              {section.items.map((item) => (
                <FlatNavItem
                  key={item.id}
                  item={item}
                  isActive={currentPage === item.id}
                  accent={accent}
                  onClick={() => onNavClick(item.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Sidebar ----
function ModuleSidebar({
  config,
  accent,
}: {
  config: ModuleConfig;
  accent: { primary: string; light: string };
}) {
  const { currentPage, sidebarOpen, setSidebarOpen, navigateTo } = config.useStore();
  const isMobile = useIsMobile();
  const ModuleIcon = config.moduleIcon ?? Sparkles;

  // Per-section expand state for collapsible mode
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    for (const section of config.navSections) {
      initial[section.id] = section.items.some((item) => item.id === currentPage);
    }
    return initial;
  });

  const sectionPageMap = useMemo(
    () => buildSectionPageMap(config.navSections),
    [config.navSections]
  );

  // Auto-expand the section that contains the current page
  useEffect(() => {
    setExpandedSections((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [sectionId, pages] of Object.entries(sectionPageMap) as [string, string[]][]) {
        if (pages.includes(currentPage) && !next[sectionId]) {
          next[sectionId] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [currentPage, sectionPageMap]);

  const handleNavClick = (page: string) => {
    navigateTo(page);
    if (isMobile) setSidebarOpen(false);
  };

  const toggleSection = (sectionId: string) =>
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

  const isSectionActive = (sectionId: string) =>
    sectionPageMap[sectionId]?.includes(currentPage) ?? false;

  const sidebarWidth = isMobile
    ? LAYOUT.sidebarMobileWidth
    : LAYOUT.sidebarCollapsedWidth + 176; // 240

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.duration.fast }}
            className="fixed inset-0 backdrop-blur-sm z-40"
            style={{ backgroundColor: CSS.overlay }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={isMobile ? { x: -sidebarWidth } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: sidebarWidth, opacity: 1 }}
            exit={isMobile ? { x: -sidebarWidth } : { width: 0, opacity: 0 }}
            transition={{ duration: ANIMATION.duration.slow, ease: ANIMATION.ease }}
            className={cn(
              'shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
              'border-r',
              isMobile && `w-[${sidebarWidth}px]`
            )}
            style={{
              backgroundColor: CSS.sidebarBg,
              borderColor: CSS.border,
            }}
          >
            <div className="h-full flex flex-col">
              {/* Logo area */}
              <div
                className="h-14 flex items-center gap-2.5 px-4 shrink-0 border-b"
                style={{ borderColor: CSS.border }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: accent.primary }}
                >
                  <ModuleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-[13px] font-semibold leading-tight"
                    style={{ color: CSS.text }}
                  >
                    {config.moduleName}
                  </span>
                  {config.moduleShortName && (
                    <span
                      className="text-[10px] leading-tight"
                      style={{ color: CSS.textMuted }}
                    >
                      {config.moduleShortName} Module
                    </span>
                  )}
                </div>
                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto h-7 w-7 transition-colors"
                    style={{ color: CSS.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar">
                {config.collapsibleSections
                  ? // ERP-style: collapsible accordion sections
                    config.navSections.map((section) => (
                      <CollapsibleSection
                        key={section.id}
                        section={section}
                        isExpanded={expandedSections[section.id] ?? false}
                        isSectionActive={isSectionActive(section.id)}
                        onToggle={() => toggleSection(section.id)}
                        currentPage={currentPage}
                        onNavClick={handleNavClick}
                        accent={accent}
                      />
                    ))
                  : // CRM-style: flat section list
                    config.navSections.map((section) => (
                      <div key={section.id} className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: CSS.textDisabled }}
                        >
                          {section.label}
                        </div>
                        {section.items.map((item) => (
                          <FlatNavItem
                            key={item.id}
                            item={item}
                            isActive={currentPage === item.id}
                            accent={accent}
                            onClick={() => handleNavClick(item.id)}
                          />
                        ))}
                      </div>
                    ))}
              </nav>

              {/* Sidebar footer */}
              <div className="p-3 border-t" style={{ borderColor: CSS.border }}>
                {config.sidebarFooter ?? (
                  <DefaultSidebarFooter accent={accent} />
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ---- Topbar ----
function ModuleTopbar({ config, accent }: { config: ModuleConfig; accent: { primary: string; light: string } }) {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const {
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    goBack,
    goForward,
    canGoBack: checkCanBack,
    canGoForward: checkCanForward,
  } = config.useStore();
  const isMobile = useIsMobile();

  const canBack = checkCanBack();
  const canForward = checkCanForward();
  const currentLabel = config.allPageLabels[currentPage] ?? config.moduleName;
  const isDetailPage = currentPage.endsWith('-detail');

  const handleBackToHome = config.onBackToHome ?? closeModule;

  // Shared button class
  const iconBtnClass = 'shrink-0 h-8 w-8 rounded-lg transition-colors';

  return (
    <header
      className="sticky top-0 backdrop-blur-sm flex items-center justify-between px-4 gap-4 shrink-0"
      style={{
        height: LAYOUT.topbarHeightPx,
        borderBottom: `1px solid var(--app-topbar-border)`,
        backgroundColor: CSS.topbarBg,
        zIndex: Z_INDEX.topbar,
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-1.5 min-w-0">
        {/* Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHome}
              className={iconBtnClass}
              style={{ color: CSS.textSecondary }}
            >
              <Home className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Home Dashboard</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden md:block" style={{ backgroundColor: CSS.hoverBg }} />

        {/* Back */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              disabled={!canBack}
              className={cn(
                iconBtnClass,
                !canBack && 'opacity-20 cursor-not-allowed'
              )}
              style={canBack ? { color: CSS.textSecondary } : undefined}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Go Back</TooltipContent>
        </Tooltip>

        {/* Forward */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goForward}
              disabled={!canForward}
              className={cn(
                iconBtnClass,
                !canForward && 'opacity-20 cursor-not-allowed'
              )}
              style={canForward ? { color: CSS.textSecondary } : undefined}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Go Forward</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden md:block" style={{ backgroundColor: CSS.hoverBg }} />

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(iconBtnClass, 'md:hidden')}
          style={{ color: CSS.textSecondary }}
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-[13px] hidden sm:block shrink-0"
            style={{ color: CSS.textMuted }}
          >
            {config.moduleName}
          </span>
          <ChevronRight
            className="w-3 h-3 hidden sm:block shrink-0"
            style={{ color: CSS.textDisabled }}
          />
          <span
            className="text-[13px] font-medium truncate"
            style={{ color: CSS.text }}
          >
            {currentLabel}
          </span>
          {isDetailPage && (
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0 h-5 border-0 rounded-md"
              style={{ backgroundColor: accent.light, color: accent.primary }}
            >
              Detail
            </Badge>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search bar placeholder */}
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border w-56 lg:w-64 transition-colors cursor-pointer',
          )}
          style={{
            backgroundColor: CSS.hoverBg,
            borderColor: CSS.border,
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
          <span className="text-[13px]" style={{ color: CSS.textDisabled }}>
            Search...
          </span>
          <kbd
            className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-auto"
            style={{ backgroundColor: CSS.hoverBg, color: CSS.textMuted }}
          >
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>

        {/* Mobile search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtnClass, 'md:hidden')}
              style={{ color: CSS.textSecondary }}
            >
              <Search className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Search</TooltipContent>
        </Tooltip>

        {/* topbarExtra slot (e.g. density toggle, filters) */}
        {config.topbarExtra}

        {/* Notification bell */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtnClass, 'relative')}
              style={{ color: CSS.textSecondary }}
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white px-1"
                style={{ backgroundColor: accent.primary }}
              >
                3
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>

        {/* AI sparkle button with pulsing glow */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon" className={cn(iconBtnClass, 'relative')} style={{ color: CSS.textSecondary }}>
                <Sparkles className="w-4 h-4" />
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(139,92,246,0)',
                      '0 0 0 4px rgba(139,92,246,0.1)',
                      '0 0 0 0 rgba(139,92,246,0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">AI Assistant</TooltipContent>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(iconBtnClass, 'hidden sm:flex')}
              style={{ color: CSS.textSecondary }}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </TooltipContent>
        </Tooltip>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(iconBtnClass, 'rounded-lg')}>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback
                  className="text-white text-xs font-semibold rounded-lg"
                  style={{ backgroundColor: accent.primary }}
                >
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl"
            style={{
              backgroundColor: CSS.cardBg,
              borderColor: CSS.borderStrong,
            }}
          >
            <div
              className="px-3 py-2.5 border-b mb-1"
              style={{ borderColor: CSS.border }}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: CSS.text }}>
                  {user?.name || 'User'}
                </p>
              </div>
              <p className="text-xs" style={{ color: CSS.textMuted }}>
                {user?.email || ''}
              </p>
            </div>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              style={{ color: CSS.textSecondary }}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              style={{ color: CSS.textSecondary }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ backgroundColor: CSS.hoverBg }} />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ---- Page Content (with optional progress bar + skeleton) ----
function ModulePageContent({ config, accent }: { config: ModuleConfig; accent: { primary: string } }) {
  const { currentPage } = config.useStore();
  const lazy = config.lazyLoading ?? false;

  // --- Lazy-loading path (progress bar + skeleton) ---
  const [loading, setLoading] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const prevPageRef = useRef(currentPage);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lazy || currentPage === prevPageRef.current) return;
    prevPageRef.current = currentPage;
    setLoading(true);
    setProgressWidth(0);

    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    progressTimerRef.current = setTimeout(() => setProgressWidth(100), 10);
    clearTimerRef.current = setTimeout(() => setProgressWidth(0), 350);
    const loadTimer = setTimeout(() => setLoading(false), 200);

    return () => {
      clearTimeout(loadTimer);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, [currentPage, lazy]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const PageComponent = config.pageComponents[currentPage] ?? null;
  if (!PageComponent) return null;

  return (
    <div className="relative h-full">
      {/* Progress bar (lazy mode only) */}
      {lazy && progressWidth > 0 && (
        <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressWidth}%`, backgroundColor: accent.primary }}
          />
        </div>
      )}

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={ANIMATION.pageVariants.initial}
          animate={ANIMATION.pageVariants.animate}
          exit={ANIMATION.pageVariants.exit}
          transition={{
            duration: ANIMATION.duration.pageTransition,
            ease: ANIMATION.ease,
          }}
          className="h-full"
        >
          {lazy ? (
            loading ? (
              <ModuleSkeleton />
            ) : (
              <Suspense fallback={<ModuleSkeleton />}>
                <PageComponent />
              </Suspense>
            )
          ) : (
            <PageComponent />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---- Mobile FAB ----
function MobileFab({ accent }: { accent: { primary: string } }) {
  const isMobile = useIsMobile();
  const [fabOpen, setFabOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] md:hidden">
      <AnimatePresence>
        {fabOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0"
              onClick={() => setFabOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: ANIMATION.duration.fast }}
              className="absolute bottom-16 right-0 rounded-2xl p-1.5 min-w-[180px] shadow-xl border"
              style={{
                backgroundColor: CSS.cardBg,
                borderColor: CSS.borderStrong,
              }}
            >
              <button
                onClick={() => setFabOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-colors"
                style={{ color: CSS.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = CSS.hoverBg;
                  e.currentTarget.style.color = CSS.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = CSS.textSecondary;
                }}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={() => setFabOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-colors"
                style={{ color: CSS.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = CSS.hoverBg;
                  e.currentTarget.style.color = CSS.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = CSS.textSecondary;
                }}
              >
                <Plus className="w-4 h-4" />
                Create New
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setFabOpen(!fabOpen)}
        className="relative w-14 h-14 rounded-full text-white flex items-center justify-center"
        style={{
          backgroundColor: accent.primary,
          boxShadow: `0 4px 14px ${accent.primary}40`,
        }}
      >
        <motion.div
          animate={{ rotate: fabOpen ? 45 : 0 }}
          transition={{ duration: ANIMATION.duration.normal }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export function ModuleLayout({ config }: { config: ModuleConfig }) {
  const accent = useMemo(() => getAccent(config), [config]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="h-screen flex flex-col overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: CSS.bg,
          color: CSS.text,
        }}
      >
        {/* Topbar */}
        <ModuleTopbar config={config} accent={accent} />

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <ModuleSidebar config={config} accent={accent} />

          {/* Page content */}
          <main className="flex-1 overflow-hidden">
            {config.beforeContent}
            <ModulePageContent config={config} accent={accent} />
            {config.afterContent}
          </main>
        </div>

        {/* Mobile FAB */}
        <MobileFab accent={accent} />
      </div>
    </TooltipProvider>
  );
}

export default ModuleLayout;
