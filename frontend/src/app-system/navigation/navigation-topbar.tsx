'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigationContext } from './navigation-provider';

const breadcrumbItemVariants = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

const breadcrumbTransition = { duration: 0.2, ease: 'easeOut' as const };

interface NavigationTopbarProps {
  children?: React.ReactNode;
}

export const NavigationTopbar = React.memo(function NavigationTopbar({
  children,
}: NavigationTopbarProps) {
  const router = useRouter();
  const {
    history,
    currentIndex,
    back,
    forward,
    canGoBack,
    canGoForward,
    currentLabel,
  } = useNavigationContext();

  const goBack = useCallback(() => {
    const entry = back();
    if (entry) {
      router.push(entry.path);
    }
  }, [back, router]);

  const goForward = useCallback(() => {
    const entry = forward();
    if (entry) {
      router.push(entry.path);
    }
  }, [forward, router]);

  const canBack = canGoBack();
  const canFwd = canGoForward();

  // Build the breadcrumb trail: history up to current index
  const breadcrumbTrail = history.slice(0, currentIndex + 1);

  // Extract the main label (first segment before " / ")
  const mainLabel = currentLabel.split(' / ')[0] ?? currentLabel;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'flex items-center h-12 px-3 gap-2',
        'border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80',
      )}
    >
      {/* Left: Back / Forward buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canBack}
          onClick={goBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canFwd}
          onClick={goForward}
          aria-label="Go forward"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Breadcrumb trail */}
      <nav
        className="flex-1 flex items-center justify-center min-w-0"
        aria-label="Navigation breadcrumb"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mainLabel}
            variants={breadcrumbItemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={breadcrumbTransition}
            className="flex items-center gap-1 min-w-0"
          >
            {breadcrumbTrail.length > 1
              ? breadcrumbTrail.map((entry, idx) => {
                  const isLast = idx === breadcrumbTrail.length - 1;
                  const shortLabel = entry.label.split(' / ')[0] ?? entry.label;
                  return (
                    <React.Fragment key={`${entry.path}-${idx}`}>
                      <span
                        className={cn(
                          'text-xs truncate max-w-[120px] sm:max-w-[180px]',
                          isLast
                            ? 'font-medium text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {shortLabel}
                      </span>
                      {!isLast && (
                        <span className="text-muted-foreground/50 text-xs mx-0.5 select-none">
                          /
                        </span>
                      )}
                    </React.Fragment>
                  );
                })
              : (
                <span className="text-xs font-medium text-foreground truncate">
                  {mainLabel}
                </span>
              )}
          </motion.div>
        </AnimatePresence>
      </nav>

      {/* Right: Slot for additional controls */}
      {children && (
        <div className="flex items-center gap-1 shrink-0">{children}</div>
      )}
    </header>
  );
});
