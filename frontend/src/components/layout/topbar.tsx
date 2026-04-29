'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { CSS, LAYOUT, Z_INDEX } from '@/styles/design-tokens';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronRight,
  Home,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Settings,
  User,
  Sparkles,
  Command,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface TopbarProps {
  /** The name of the current module (e.g. "CRM & Sales") */
  moduleName: string;
  /** The label of the currently active page */
  currentLabel: string;
  /** Whether the current page is a detail view */
  isDetailPage?: boolean;
  /** Accent color pair for module-specific styling */
  accent: { primary: string; light: string };
  /** Whether the browser-like back action is available */
  canGoBack?: boolean;
  /** Whether the browser-like forward action is available */
  canGoForward?: boolean;
  /** Callback fired when the home button is clicked */
  onBack?: () => void;
  /** Callback fired when the forward button is clicked */
  onForward?: () => void;
  /** Callback fired when the home button is clicked */
  onHome?: () => void;
  /** Callback fired when the sidebar toggle (mobile) is clicked */
  onToggleSidebar?: () => void;
  /** Show the hamburger menu button (typically on mobile) */
  showSidebarToggle?: boolean;
  /** Notification count displayed on the bell badge */
  notificationCount?: number;
  /** Optional extra content injected after the AI sparkle button */
  extra?: React.ReactNode;
}

// ============================================================================
// Shared
// ============================================================================

const ICON_BTN =
  'shrink-0 h-8 w-8 rounded-lg transition-colors duration-150 hover:bg-[var(--app-hover-bg)] active:scale-95';

/** 1px-wide visual divider between icon groups */
function Divider() {
  return (
    <div
      className="w-px h-5 mx-1 hidden md:block"
      style={{ backgroundColor: CSS.hoverBg }}
    />
  );
}

// ============================================================================
// Topbar
// ============================================================================

export function Topbar({
  moduleName,
  currentLabel,
  isDetailPage = false,
  accent,
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  onHome,
  onToggleSidebar,
  showSidebarToggle = false,
  notificationCount = 3,
  extra,
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme-dependent icon
  React.useEffect(() => setMounted(true), []);

  // Derived
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className="sticky top-0 flex items-center justify-between px-4 gap-4 shrink-0 select-none"
        style={{
          height: LAYOUT.topbarHeightPx,
          backgroundColor: 'var(--app-glass-bg)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid var(--app-topbar-border)',
          zIndex: Z_INDEX.topbar,
        }}
      >
        {/* ─── Left Section ─── */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Home */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHome}
                className={ICON_BTN}
                style={{ color: CSS.textSecondary }}
                aria-label="Home Dashboard"
              >
                <Home className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Home Dashboard</TooltipContent>
          </Tooltip>

          <Divider />

          {/* Back */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                disabled={!canGoBack}
                className={cn(ICON_BTN, !canGoBack && 'opacity-20 cursor-not-allowed')}
                style={canGoBack ? { color: CSS.textSecondary } : undefined}
                aria-label="Go Back"
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
                onClick={onForward}
                disabled={!canGoForward}
                className={cn(ICON_BTN, !canGoForward && 'opacity-20 cursor-not-allowed')}
                style={canGoForward ? { color: CSS.textSecondary } : undefined}
                aria-label="Go Forward"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Go Forward</TooltipContent>
          </Tooltip>

          <Divider />

          {/* Sidebar toggle (visible when prop is true — typically mobile) */}
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className={cn(ICON_BTN)}
              style={{ color: CSS.textSecondary }}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[13px] hidden sm:block shrink-0"
              style={{ color: CSS.textMuted }}
            >
              {moduleName}
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
                className="ml-2 text-[10px] px-1.5 py-0 h-5 border-0 rounded-md font-medium"
                style={{ backgroundColor: accent.light, color: accent.primary }}
              >
                Detail
              </Badge>
            )}
          </div>
        </div>

        {/* ─── Right Section ─── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search bar — desktop */}
          <div
            role="button"
            tabIndex={0}
            className={cn(
              'hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border w-56 lg:w-64',
              'transition-all duration-200 cursor-pointer',
              'hover:border-[var(--app-border-strong)] hover:shadow-sm'
            )}
            style={{
              backgroundColor: 'var(--app-hover-bg)',
              borderColor: 'var(--app-border)',
            }}
            aria-label="Search (⌘K)"
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: CSS.textMuted }} />
            <span className="text-[13px]" style={{ color: CSS.textDisabled }}>
              Search...
            </span>
            <kbd
              className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono ml-auto border"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                color: CSS.textMuted,
                borderColor: 'var(--app-border)',
              }}
            >
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>

          {/* Search icon — mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(ICON_BTN, 'md:hidden')}
                style={{ color: CSS.textSecondary }}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Search</TooltipContent>
          </Tooltip>

          {/* Extra slot (e.g. density toggle, module-specific filters) */}
          {extra}

          {/* AI Sparkle — desktop only, with pulsing blue glow */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden md:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(ICON_BTN, 'relative')}
                  style={{ color: CSS.textSecondary }}
                  aria-label="AI Assistant"
                >
                  <Sparkles className="w-4 h-4" />
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(37, 99, 235, 0)',
                        '0 0 0 4px rgba(37, 99, 235, 0.1)',
                        '0 0 0 0 rgba(37, 99, 235, 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">AI Assistant</TooltipContent>
          </Tooltip>

          {/* Notification bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(ICON_BTN, 'relative')}
                style={{ color: CSS.textSecondary }}
                aria-label={`Notifications (${notificationCount})`}
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white px-1"
                    style={{ backgroundColor: 'var(--app-accent)' }}
                  >
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifications</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(ICON_BTN, 'hidden sm:flex')}
                style={{ color: CSS.textSecondary }}
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </TooltipContent>
          </Tooltip>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(ICON_BTN, 'rounded-lg')}
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback
                    className="text-white text-xs font-semibold rounded-lg"
                    style={{ backgroundColor: accent.primary }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border-strong)',
              }}
            >
              {/* User header */}
              <div
                className="px-3 py-2.5"
                style={{ borderBottom: '1px solid var(--app-border)' }}
              >
                <DropdownMenuLabel
                  className="text-sm font-semibold p-0 mb-0.5"
                  style={{ color: 'var(--app-text)' }}
                >
                  {user?.name || 'User'}
                </DropdownMenuLabel>
                <p
                  className="text-xs"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  {user?.email || ''}
                </p>
              </div>

              {/* Menu items */}
              <div className="pt-1 pb-0.5">
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer mx-1 my-0.5"
                  style={{ color: 'var(--app-text-secondary)' }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer mx-1 my-0.5"
                  style={{ color: 'var(--app-text-secondary)' }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator
                style={{ backgroundColor: 'var(--app-hover-bg)' }}
              />

              <div className="pb-1">
                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-lg cursor-pointer mx-1 my-0.5 text-red-400 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}

export default Topbar;
