'use client';

import React, { memo, useMemo, useCallback, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  Handshake,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/app-system/responsive/use-breakpoints';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Sidebar collapse store
// ---------------------------------------------------------------------------
interface SidebarCollapseState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const useSidebarCollapse = create<SidebarCollapseState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
}));

// ---------------------------------------------------------------------------
// Navigation item types
// ---------------------------------------------------------------------------
interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Navigation config
// ---------------------------------------------------------------------------
const NAV_SECTIONS: NavSection[] = [
  {
    title: 'CRM',
    items: [
      { label: 'Users', icon: Users, href: '/crm/users' },
      { label: 'Companies', icon: Building2, href: '/crm/companies' },
      { label: 'Deals', icon: Handshake, href: '/crm/deals' },
      { label: 'Pipeline', icon: TrendingUp, href: '/crm/pipeline' },
      { label: 'Targets', icon: Target, href: '/crm/targets' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Charts', icon: BarChart3, href: '/analytics/charts' },
      { label: 'Reports', icon: PieChart, href: '/analytics/reports' },
    ],
  },
  {
    title: 'ERP',
    items: [
      { label: 'Inventory', icon: Package, href: '/erp/inventory' },
      { label: 'Settings', icon: Settings, href: '/erp/settings' },
    ],
  },
];

// ---------------------------------------------------------------------------
// NavItemButton (single item)
// ---------------------------------------------------------------------------
interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: (href: string) => void;
}

const NavItemButton = memo(function NavItemButton({
  item,
  isActive,
  collapsed,
  onClick,
}: NavItemButtonProps) {
  const Icon = item.icon;

  const button = (
    <button
      type="button"
      onClick={() => onClick(item.href)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground',
        collapsed && 'justify-center px-2',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 } as const}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
});

// ---------------------------------------------------------------------------
// NavSectionGroup
// ---------------------------------------------------------------------------
interface NavSectionGroupProps {
  section: NavSection;
  collapsed: boolean;
  activePath: string;
  onNavigate: (href: string) => void;
}

const NavSectionGroup = memo(function NavSectionGroup({
  section,
  collapsed,
  activePath,
  onNavigate,
}: NavSectionGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Section label */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60"
        >
          {section.title}
        </motion.div>
      )}

      {collapsed && (
        <Separator className="my-1" />
      )}

      {/* Items */}
      {section.items.map((item) => (
        <NavItemButton
          key={item.href}
          item={item}
          isActive={activePath.startsWith(item.href)}
          collapsed={collapsed}
          onClick={onNavigate}
        />
      ))}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Collapse toggle button
// ---------------------------------------------------------------------------
interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapseToggle = memo(function CollapseToggle({
  collapsed,
  onToggle,
}: CollapseToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? (
        <ChevronRight className="size-4" />
      ) : (
        <ChevronLeft className="size-4" />
      )}
    </Button>
  );
});

// ---------------------------------------------------------------------------
// AppSidebar component (exported for direct use)
// ---------------------------------------------------------------------------
export interface AppSidebarProps {
  /** Additional class names */
  className?: string;
}

function AppSidebarInner({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const collapsed = useSidebarCollapse((s) => s.collapsed);
  const toggleCollapsed = useSidebarCollapse((s) => s.toggleCollapsed);

  const onNavigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const widthClass = collapsed ? 'w-16' : 'w-64';

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground',
        widthClass,
        'transition-[width] duration-200 ease-in-out',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b px-3 py-3',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold tracking-tight"
            >
              PXS
            </motion.span>
          )}
        </AnimatePresence>
        {!isMobile && (
          <CollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-2 px-2" role="navigation">
          {NAV_SECTIONS.map((section) => (
            <NavSectionGroup
              key={section.title}
              section={section}
              collapsed={collapsed}
              activePath={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div
        className={cn(
          'border-t px-3 py-2',
          collapsed && 'flex justify-center',
        )}
      >
        <CollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />
      </div>
    </div>
  );
}

export const AppSidebar = memo(AppSidebarInner);
export default AppSidebar;
