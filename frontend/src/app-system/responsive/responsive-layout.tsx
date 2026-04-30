'use client';

import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoints } from './use-breakpoints';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ResponsiveLayoutProps {
  /** The sidebar content rendered on desktop/tablet */
  sidebar: React.ReactNode;
  /** The main content area */
  children: React.ReactNode;
  /** Optional additional class names for the root container */
  className?: string;
  /** Optional sidebar width class (default: w-64) */
  sidebarWidth?: string;
  /** Sheet title shown on tablet when sidebar opens as sheet */
  sheetTitle?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const sidebarVariants = {
  expanded: { width: 256, opacity: 1 },
  collapsed: { width: 0, opacity: 0 },
};

const mainVariants = {
  expanded: { marginLeft: 256 },
  collapsed: { marginLeft: 0 },
};

// ---------------------------------------------------------------------------
// ResponsiveLayout component
// ---------------------------------------------------------------------------
function ResponsiveLayoutInner({
  sidebar,
  children,
  className,
  sidebarWidth = 'w-64',
  sheetTitle = 'Navigation',
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  // Mobile: only main content + FAB
  if (isMobile) {
    return (
      <div className={cn('relative flex min-h-screen flex-col', className)}>
        {/* Mobile main content */}
        <main className="flex flex-1 flex-col">
          {children}
        </main>

        {/* FAB to open sidebar */}
        <AnimatePresence>
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Button
              size="icon"
              className="size-14 rounded-full shadow-[var(--app-shadow-md)]-lg"
              onClick={openSheet}
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Sheet-based sidebar for mobile */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4">
              <SheetTitle>{sheetTitle}</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="p-2">{sidebar}</div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Tablet: collapsible sheet sidebar
  if (isTablet) {
    return (
      <div className={cn('relative flex min-h-screen flex-col', className)}>
        {/* Tablet header bar with menu trigger */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={openSheet}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
          <span className="text-sm font-medium">{sheetTitle}</span>
        </header>

        <main className="flex flex-1 flex-col">
          {children}
        </main>

        {/* Sheet sidebar for tablet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4">
              <SheetTitle>{sheetTitle}</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="p-2">{sidebar}</div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop: flex row (sidebar + main)
  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* Desktop sidebar */}
      <motion.aside
        className={cn(
          'sticky top-0 z-20 flex h-screen flex-col border-r bg-background',
          sidebarWidth,
        )}
        initial={false}
        variants={sidebarVariants}
        animate="expanded"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ScrollArea className="flex-1">
          <div className="p-2">{sidebar}</div>
        </ScrollArea>
      </motion.aside>

      {/* Desktop main content */}
      <motion.main
        className="flex flex-1 flex-col"
        initial={false}
        variants={mainVariants}
        animate="expanded"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.main>
    </div>
  );
}

export const ResponsiveLayout = memo(ResponsiveLayoutInner);
