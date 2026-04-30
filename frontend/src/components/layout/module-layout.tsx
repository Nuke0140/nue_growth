'use client';

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthStore } from '@/store/auth-store';
import { CSS, ANIMATION, MODULE_ACCENTS } from '@/styles/design-tokens';
import { Skeleton } from '@/components/ui/skeleton';

// New extracted components
import { ModuleProvider } from './module-provider';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ErrorBoundary } from '@/components/shared/error-boundary';

// Types — import canonical types and extend for backward compat
import type { ModuleConfig as BaseModuleConfig, NavSection, NavSubItem } from '@/types/module-config';
import type { ReactNode } from 'react';
import { Plus, Search } from 'lucide-react';

/**
 * Extended ModuleConfig with layout customisation hooks.
 * Extends the canonical type from `@/types/module-config` with fields
 * that the orchestrator consumes (slot nodes, callbacks).
 */
export interface ModuleConfig extends BaseModuleConfig {
  commandPalette?: boolean;
  sidebarFooter?: ReactNode;
  topbarExtra?: ReactNode;
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
  onBackToHome?: () => void;
}

// Re-export sub-types so existing consumers that import from here still compile
export type { NavSection, NavSubItem };

// ============================================================================
// Helpers
// ============================================================================

/** Derive accent from MODULE_ACCENTS, falling back to CSS custom-property vars */
function getAccent(config: ModuleConfig) {
  const key = (config.accentKey ?? config.moduleId) as keyof typeof MODULE_ACCENTS;
  return MODULE_ACCENTS[key] ?? {
    primary: CSS.accent,
    hover: CSS.accentHover,
    light: CSS.accentLight,
  };
}

// ============================================================================
// Sub-components
// ============================================================================

// ---- Skeleton loader for lazy-loading mode ----
function ModuleSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg animate-pulse" style={{ animationDelay: '0.05s' }} />
          <Skeleton className="h-9 w-9 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl animate-pulse" style={{ animationDelay: `${0.15 + i * 0.05}s` }} />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl animate-pulse" style={{ animationDelay: '0.3s' }} />
      <Skeleton className="h-48 rounded-xl animate-pulse" style={{ animationDelay: '0.35s' }} />
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
          background: 'var(--app-gradient-brand)',
          boxShadow: 'var(--app-shadow-glow-blue)',
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

export interface ModuleLayoutProps {
  config: ModuleConfig;
}

export function ModuleLayout({ config }: ModuleLayoutProps) {
  const {
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    navigateTo,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
  } = config.useStore();

  const { closeModule } = useAuthStore();
  const isMobile = useIsMobile();
  const accent = useMemo(() => getAccent(config), [config]);

  const currentLabel = config.allPageLabels[currentPage] ?? config.moduleName;
  const isDetailPage = currentPage.endsWith('-detail');
  const handleBackToHome = config.onBackToHome ?? closeModule;

  // --- Progress bar for lazy loading ---
  const [loading, setLoading] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const prevPageRef = useRef(currentPage);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!config.lazyLoading || currentPage === prevPageRef.current) return;
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
  }, [currentPage, config.lazyLoading]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const PageComponent = config.pageComponents[currentPage] ?? null;
  if (!PageComponent) return null;

  return (
    <ModuleProvider overrideConfig={config}>
      <div
        className="h-screen flex flex-col overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: CSS.bg, color: CSS.text }}
      >
        {/* Topbar */}
        <Topbar
          moduleName={config.moduleName}
          currentLabel={currentLabel}
          isDetailPage={isDetailPage}
          accent={accent}
          canGoBack={canGoBack()}
          canGoForward={canGoForward()}
          onBack={goBack}
          onForward={goForward}
          onHome={handleBackToHome}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showSidebarToggle={isMobile}
          extra={config.topbarExtra}
        />

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            currentPage={currentPage}
            onNavigate={navigateTo}
            navSections={config.navSections}
            collapsibleSections={config.collapsibleSections}
            module={{
              icon: config.moduleIcon,
              name: config.moduleName,
              shortName: config.moduleShortName,
            }}
            accent={accent}
            footer={config.sidebarFooter}
          />

          {/* Page content */}
          <main className="flex-1 overflow-hidden">
            {config.beforeContent}
            <ErrorBoundary>
            <div className="relative h-full">
              {/* Progress bar (lazy mode only) */}
              {progressWidth > 0 && (
                <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 ease-out rounded-full"
                    style={{
                      width: `${progressWidth}%`,
                      background: 'var(--app-gradient-brand)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              )}

              {/* Animated page transitions */}
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
                  {config.lazyLoading ? (
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
            </ErrorBoundary>
            {config.afterContent}
          </main>
        </div>

        {/* Mobile FAB */}
        <MobileFab accent={accent} />
      </div>
    </ModuleProvider>
  );
}

export default ModuleLayout;
