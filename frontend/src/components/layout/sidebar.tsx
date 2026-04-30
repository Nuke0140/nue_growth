'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import { CSS, ANIMATION, LAYOUT } from '@/styles/design-tokens';
import type { NavSection, NavSubItem } from '@/types/module-config';

// ============================================================================
// Types
// ============================================================================

/** Accent color palette for module-specific theming. */
export interface AccentColors {
  primary: string;
  hover?: string;
  light: string;
}

/** Module identity info rendered in the sidebar header. */
export interface ModuleIdentity {
  icon?: React.ComponentType<{ className?: string }>;
  name: string;
  shortName?: string;
}

/** Core sidebar props — fully decoupled from any specific store. */
export interface SidebarProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state should change */
  onOpenChange: (open: boolean) => void;
  /** Currently active page id */
  currentPage: string;
  /** Navigation callback */
  onNavigate: (page: string) => void;
  /** Navigation sections to render */
  navSections: NavSection[];
  /** Whether sections should be collapsible (ERP-style) vs flat (CRM-style) */
  collapsibleSections?: boolean;
  /** Module identity for header branding */
  module?: ModuleIdentity;
  /** Module accent colors */
  accent?: AccentColors;
  /** Custom footer slot (overrides default user profile) */
  footer?: React.ReactNode;
  /** Optional unique layoutId prefix for active indicator animations */
  layoutId?: string;
}

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_ACCENT: AccentColors = {
  primary: CSS.accent,
  light: CSS.accentLight,
};

const SIDEBAR_WIDTH = 260;
const SIDEBAR_WIDTH_MOBILE = 280;
const HEADER_HEIGHT = 56;

/** Easing curve used for premium micro-interactions throughout */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ============================================================================
// Helpers
// ============================================================================

/** Build a flat sectionId → pageIds map for efficient section-activity detection. */
function buildSectionPageMap(
  sections: NavSection[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const section of sections) {
    map[section.id] = section.items.map((item) => item.id);
  }
  return map;
}

/** Derive initials from a name string (max 2 chars). */
function getInitials(name?: string | null): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================================
// Sub-components
// ============================================================================

// ---- NavItem ---------------------------------------------------------------
// Flat navigation item (CRM-style). Supports active indicator with shared
// layoutId for smooth animated transitions between active items.

interface NavItemProps {
  item: NavSubItem;
  isActive: boolean;
  accent: AccentColors;
  onClick: () => void;
  layoutId: string;
  /** Indent level for sub-items in collapsible sections */
  depth?: number;
}

const NavItem = React.memo(function NavItem({
  item,
  isActive,
  accent,
  onClick,
  layoutId,
  depth = 0,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl text-[13px] transition-all duration-200 group relative',
        // Pl/active states
        isActive
          ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] font-medium'
          : 'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]',
        // Micro-interaction: subtle scale on hover, press
        !isActive && 'hover:scale-[1.01] active:scale-[0.99]',
        // Padding based on depth (sub-items get more indent)
        depth === 0 ? 'px-3 py-2' : 'px-3 py-[7px]',
      )}
    >
      {/* Animated active indicator bar */}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
          style={{ backgroundColor: 'var(--app-structural)' }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30,
          }}
        />
      )}

      {/* Icon */}
      <item.icon
        className={cn(
          'w-[18px] h-[18px] transition-colors shrink-0',
          isActive
            ? 'text-[var(--app-accent)]'
            : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]',
        )}
      />

      {/* Label */}
      <span className="truncate flex-1 text-left">{item.label}</span>

      {/* AI Badge — small pill with accent light bg */}
      {item.isAI && (
        <Badge
          variant="secondary"
          className="ml-auto text-[9px] px-1.5 py-0 rounded-md border-0 font-semibold tracking-wide"
          style={{ backgroundColor: 'var(--app-orange-light)', color: 'var(--app-orange)' }}
        >
          AI
        </Badge>
      )}

      {/* Number Badge — rounded-full with accent primary bg */}
      {item.badge !== undefined && item.badge > 0 && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white px-1.5 leading-none"
          style={{ backgroundColor: 'var(--app-structural)' }}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </motion.span>
      )}
    </button>
  );
});

// ---- CollapsibleSection ---------------------------------------------------
// Accordion-style section (ERP-style). Auto-expands when current page is
// inside. Sub-items are indented with a left border.

interface CollapsibleSectionProps {
  section: NavSection;
  isExpanded: boolean;
  isSectionActive: boolean;
  onToggle: () => void;
  currentPage: string;
  onNavClick: (page: string) => void;
  accent: AccentColors;
  activeLayoutId: string;
}

const CollapsibleSection = React.memo(function CollapsibleSection({
  section,
  isExpanded,
  isSectionActive,
  onToggle,
  currentPage,
  onNavClick,
  accent,
  activeLayoutId,
}: CollapsibleSectionProps) {
  if (section.items.length === 0) return null;

  const SectionIcon = section.icon ?? Sparkles;
  const firstPage = section.items[0].id;

  return (
    <div className="mb-1">
      {/* Section label — uppercase, muted */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--app-text-disabled)]">
          {section.label}
        </span>
      </div>

      {/* Section toggle header with chevron */}
      <button
        onClick={() => {
          onToggle();
          // Navigate to first page when expanding a collapsed section
          if (!isExpanded) onNavClick(firstPage);
        }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 group',
          'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]',
          'hover:scale-[1.005] active:scale-[0.995]',
        )}
      >
        <SectionIcon
          className={cn(
            'w-[18px] h-[18px] transition-colors shrink-0',
            isSectionActive
              ? 'text-[var(--app-accent)]'
              : 'text-[var(--app-text-muted)] group-hover:text-[var(--app-text-secondary)]',
          )}
        />
        <span className="flex-1 text-left truncate">{section.label}</span>

        {/* Animated chevron rotation */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: ANIMATION.duration.normal, ease: EASE }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[var(--app-text-disabled)]" />
        </motion.div>
      </button>

      {/* Collapsible sub-items with AnimatePresence */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: ANIMATION.duration.slow,
              ease: EASE,
            }}
            className="overflow-hidden"
          >
            <div className="ml-3 pl-3 border-l border-[var(--app-border)] space-y-0.5 py-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPage === item.id}
                  accent={accent}
                  onClick={() => onNavClick(item.id)}
                  layoutId={activeLayoutId}
                  depth={1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ---- SidebarHeader ---------------------------------------------------------
// Module logo + name with close button on mobile.

interface SidebarHeaderProps {
  module?: ModuleIdentity;
  accent: AccentColors;
  isMobile: boolean;
  onClose: () => void;
}

const SidebarHeader = React.memo(function SidebarHeader({
  module,
  accent,
  isMobile,
  onClose,
}: SidebarHeaderProps) {
  const ModuleIcon = module?.icon ?? Sparkles;

  return (
    <div
      className="h-14 flex items-center gap-2.5 px-4 shrink-0 border-b"
      style={{ borderColor: 'var(--app-border)' }}
    >
      {/* Module icon in accent-colored rounded square */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--app-structural)' }}
      >
        <ModuleIcon className="w-4 h-4 text-white" />
      </div>

      {/* Module name + short name */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-[13px] font-semibold leading-tight truncate"
          style={{ color: 'var(--app-text)' }}
        >
          {module?.name ?? 'Module'}
        </span>
        {module?.shortName && (
          <span
            className="text-[10px] leading-tight"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {module.shortName} Module
          </span>
        )}
      </div>

      {/* Mobile close button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-auto h-7 w-7 transition-colors shrink-0"
          style={{ color: 'var(--app-text-secondary)' }}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
});

// ---- SidebarFooter ---------------------------------------------------------
// User profile section with avatar, name, and role.

interface SidebarFooterProps {
  accent: AccentColors;
}

const SidebarFooter = React.memo(function SidebarFooter({
  accent,
}: SidebarFooterProps) {
  const { user } = useAuthStore();
  const initials = getInitials(user?.name);
  const role =
    (user as Record<string, unknown>)?.role ?? 'Team Member';

  return (
    <div
      className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.005]"
      style={{ color: 'var(--app-text)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Avatar with accent bg */}
      <Avatar className="h-8 w-8 rounded-lg shrink-0">
        <AvatarFallback
          className="text-white text-xs font-semibold rounded-lg"
          style={{ backgroundColor: 'var(--app-structural)' }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-medium truncate"
          style={{ color: 'var(--app-text)' }}
        >
          {user?.name || 'User'}
        </p>
        <p
          className="text-[11px] truncate"
          style={{ color: 'var(--app-text-muted)' }}
        >
          {role as string}
        </p>
      </div>
    </div>
  );
});

// ============================================================================
// Main Sidebar Component
// ============================================================================

export function Sidebar({
  open,
  onOpenChange,
  currentPage,
  onNavigate,
  navSections,
  collapsibleSections = false,
  module,
  accent = DEFAULT_ACCENT,
  footer,
  layoutId = 'sidebar-active-indicator',
}: SidebarProps) {
  const isMobile = useIsMobile();
  const sidebarWidth = isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH;

  // ---- Expand state for collapsible sections (ERP-style) ----
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    // Initialize: expand sections that contain the current page
    const initial: Record<string, boolean> = {};
    for (const section of navSections) {
      initial[section.id] = section.items.some(
        (item) => item.id === currentPage,
      );
    }
    return initial;
  });

  // Build section → pageIds map for efficient lookups
  const sectionPageMap = useMemo(
    () => buildSectionPageMap(navSections),
    [navSections],
  );

  // Auto-expand the section that contains the current page
  useEffect(() => {
    setExpandedSections((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [sectionId, pages] of Object.entries(sectionPageMap) as [
        string,
        string[],
      ][]) {
        if (pages.includes(currentPage) && !next[sectionId]) {
          next[sectionId] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [currentPage, sectionPageMap]);

  // ---- Handlers ----
  const handleNavClick = useCallback(
    (page: string) => {
      onNavigate(page);
      // Auto-close sidebar on mobile after navigation
      if (isMobile) onOpenChange(false);
    },
    [onNavigate, isMobile, onOpenChange],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const isSectionActive = useCallback(
    (sectionId: string) =>
      sectionPageMap[sectionId]?.includes(currentPage) ?? false,
    [sectionPageMap, currentPage],
  );

  // ---- Animation variants ----
  const slideVariants = useMemo(
    () => ({
      desktop: {
        initial: { width: 0, opacity: 0 },
        animate: { width: sidebarWidth, opacity: 1 },
        exit: { width: 0, opacity: 0 },
      },
      mobile: {
        initial: { x: -sidebarWidth, opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -sidebarWidth, opacity: 0.8 },
      },
    }),
    [sidebarWidth],
  );

  const backdropVariants = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    [],
  );

  const variants = isMobile ? slideVariants.mobile : slideVariants.desktop;

  return (
    <TooltipProvider delayDuration={300}>
      {/* ---- Mobile backdrop overlay with blur ---- */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            key="sidebar-backdrop"
            {...backdropVariants}
            transition={{ duration: ANIMATION.duration.fast, ease: EASE }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: CSS.overlay }}
            onClick={() => onOpenChange(false)}
          >
            <div className="absolute inset-0 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Sidebar panel ---- */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar-panel"
            {...variants}
            transition={{
              duration: ANIMATION.duration.slow,
              ease: EASE,
            }}
            className={cn(
              'shrink-0 overflow-hidden flex flex-col fixed md:relative inset-y-0 left-0 z-50',
              'border-r',
              isMobile && `w-[${SIDEBAR_WIDTH_MOBILE}px]`,
            )}
            style={{
              backgroundColor: 'var(--app-sidebar-bg)',
              borderColor: 'var(--app-border)',
              ...(isMobile ? { width: SIDEBAR_WIDTH_MOBILE } : {}),
            }}
          >
            <div className="h-full flex flex-col">
              {/* ---- Header ---- */}
              <SidebarHeader
                module={module}
                accent={accent}
                isMobile={isMobile}
                onClose={() => onOpenChange(false)}
              />

              {/* ---- Navigation area ---- */}
              <nav
                className="flex-1 py-3 px-2 overflow-y-auto custom-scrollbar"
                style={{ height: `calc(100% - ${HEADER_HEIGHT}px - 64px)` }}
              >
                {collapsibleSections ? (
                  // ---- ERP-style: Collapsible accordion sections ----
                  navSections.map((section) => (
                    <CollapsibleSection
                      key={section.id}
                      section={section}
                      isExpanded={
                        expandedSections[section.id] ?? false
                      }
                      isSectionActive={isSectionActive(section.id)}
                      onToggle={() => toggleSection(section.id)}
                      currentPage={currentPage}
                      onNavClick={handleNavClick}
                      accent={accent}
                      activeLayoutId={layoutId}
                    />
                  ))
                ) : (
                  // ---- CRM-style: Flat section list ----
                  navSections.map((section) => (
                    <div key={section.id} className="mb-2">
                      {/* Section header label */}
                      <div className="px-3 py-1">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--app-text-disabled)' }}
                        >
                          {section.label}
                        </span>
                      </div>

                      {/* Section items */}
                      {section.items.map((item) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          isActive={currentPage === item.id}
                          accent={accent}
                          onClick={() => handleNavClick(item.id)}
                          layoutId={layoutId}
                        />
                      ))}
                    </div>
                  ))
                )}
              </nav>

              {/* ---- Footer ---- */}
              <div
                className="p-3 border-t shrink-0"
                style={{ borderColor: 'var(--app-border)' }}
              >
                {footer ?? <SidebarFooter accent={accent} />}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

export default Sidebar;
