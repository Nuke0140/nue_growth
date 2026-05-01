'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useMarketingStore } from './marketing-store';
import { useAuthStore } from '@/store/auth-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { MarketingPage } from './types';

// Icons
import {
  Home, ArrowLeft, ArrowRight, Menu, ChevronRight, Command,
  Search, Bell, Moon, Sun, Sparkles, SlidersHorizontal, LogOut,
  Calendar, Rocket,
  LayoutDashboard, Megaphone, Users, BarChart3, Settings2,
} from 'lucide-react';

// ---- Navigation Items ----
interface NavItem {
  id: MarketingPage;
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
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'audience', label: 'Audience', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Execution',
    items: [
      { id: 'operations', label: 'Operations', icon: Settings2 },
    ],
  },
];

const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

function PageContent() {
  const { currentPage, navigateTo } = useMarketingStore();

  const pageComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
    'dashboard': React.lazy(() => import('./marketing-dashboard-page')),
    'campaigns': React.lazy(() => import('./campaigns-page')),
    'campaign-builder': React.lazy(() => import('./campaign-builder-page')),
    'audience': React.lazy(() => import('./audience-page')),
    'analytics': React.lazy(() => import('./analytics-page')),
    'operations': React.lazy(() => import('./operations-page')),
  };

  const PageComponent = pageComponents[currentPage];

  if (!PageComponent) return null;

  return (
    <div className="h-full">
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
        </div>
      }>
        <PageComponent />
      </React.Suspense>
    </div>
  );
}

export default function MarketingLayout() {
  const { theme, setTheme } = useTheme();
  const { user, logout, closeModule } = useAuthStore();
  const { currentPage, sidebarOpen, setSidebarOpen, goBack, goForward, canGoBack, canGoForward, navigateTo } = useMarketingStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const canBack = canGoBack();
  const canForward = canGoForward();
  const currentLabel = allNavItems.find(n => n.id === currentPage)?.label || 'Marketing';

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        'h-screen flex flex-col overflow-hidden transition-colors duration-300',
        isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-black'
      )}>
        {/* ========== Top Bar ========== */}
        <header className={cn(
          'h-14 border-b flex items-center justify-between px-4 gap-4 shrink-0 transition-colors',
          isDark ? 'bg-[#0a0a0a] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={closeModule} className={cn('shrink-0 h-8 w-8 rounded-lg', isDark ? 'hover:bg-white/[0.06] text-white/50 hover:text-white' : 'hover:bg-black/[0.06] text-black/50 hover:text-black')}>
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Home Dashboard</p></TooltipContent>
            </Tooltip>
            <div className={cn('w-px h-5 mx-1 hidden md:block', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goBack} disabled={!canBack} className={cn('shrink-0 h-8 w-8 rounded-lg transition-opacity', !canBack && 'opacity-30 cursor-not-allowed', canBack && isDark && 'hover:bg-white/[0.06]', canBack && !isDark && 'hover:bg-black/[0.06]')}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Back</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={goForward} disabled={!canForward} className={cn('shrink-0 h-8 w-8 rounded-lg transition-opacity', !canForward && 'opacity-30 cursor-not-allowed', canForward && isDark && 'hover:bg-white/[0.06]', canForward && !isDark && 'hover:bg-black/[0.06]')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Go Forward</p></TooltipContent>
            </Tooltip>
            <div className={cn('w-px h-5 mx-1 hidden md:block', isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')} />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden shrink-0 h-8 w-8 rounded-lg">
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="DigiNue" width={24} height={16} className="object-contain rounded-sm" />
              <span className={cn('text-sm font-semibold tracking-wide hidden sm:block', isDark ? 'text-white/60' : 'text-black/60')}>Growth Engine</span>
              <ChevronRight className={cn('w-3 h-3 hidden sm:block', isDark ? 'text-white/20' : 'text-black/20')} />
              <span className="text-sm font-medium">{currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn('hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border w-64 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input type="text" placeholder="Search... (Ctrl+K)" className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
            </div>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg"><Calendar className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Date Range</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="hidden md:flex h-8 w-8 rounded-lg"><SlidersHorizontal className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Filters</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-lg"><Bell className="w-4 h-4" /><span className={cn('absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center', isDark ? 'bg-white text-black' : 'bg-black text-white')}>5</span></Button></TooltipTrigger><TooltipContent>Notifications</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="hidden md:flex relative h-8 w-8 rounded-lg"><Sparkles className="w-4 h-4" /><motion.div className="absolute inset-0 rounded-lg" animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0)', '0 0 0 4px rgba(139,92,246,0.1)', '0 0 0 0 rgba(139,92,246,0)'] }} transition={{ duration: 2, repeat: Infinity }} /></Button></TooltipTrigger><TooltipContent>AI Assistant</TooltipContent></Tooltip>
            <Button variant="ghost" size="icon" onClick={() => { navigateTo('campaign-builder'); }} className="hidden md:flex h-8 w-8 rounded-lg"><Rocket className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="h-8 w-8 rounded-lg">{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</Button>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowUserMenu(!showUserMenu)} className={cn('h-8 w-8 rounded-lg font-bold text-xs', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Button>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('absolute right-0 top-11 w-56 rounded-xl border shadow-xl p-2 z-50', isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-black/[0.08]')}>
                  <div className={cn('px-3 py-2 border-b mb-1', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}><p className="text-sm font-semibold">{user?.name || 'User'}</p><p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{user?.email || ''}</p></div>
                  <button onClick={() => { logout(); setShowUserMenu(false); }} className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.06]' : 'text-black/60 hover:text-black hover:bg-black/[0.06]')}><LogOut className="w-4 h-4" />Sign Out</button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* ========== Main Content ========== */}
        <div className="flex-1 flex overflow-hidden">
          {isMobile && sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          {sidebarOpen && (
            <aside
              className={cn('border-r shrink-0 overflow-hidden fixed md:relative inset-y-0 left-0 z-50 flex flex-col', isMobile && 'w-[280px]', !isMobile && 'w-64', isDark ? 'border-white/[0.06] bg-[#0a0a0a]' : 'border-black/[0.06] bg-white')}
            >
                <nav className="flex-1 py-3 px-2 overflow-y-auto">
                  {navSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-2">
                      <div className="px-3 pt-3 pb-1.5">
                        <span className={cn('text-[10px] font-semibold tracking-wider uppercase', isDark ? 'text-white/25' : 'text-black/25')}>{section.title}</span>
                      </div>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = currentPage === item.id;
                          return (
                            <button key={item.id} onClick={() => { navigateTo(item.id); if (isMobile) setSidebarOpen(false); }} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group', isActive ? isDark ? 'bg-white/[0.08] text-white font-medium' : 'bg-black/[0.06] text-black font-medium' : isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.04]')}>
                              <item.icon className={cn('w-4.5 h-4.5 transition-colors shrink-0', isActive ? isDark ? 'text-white' : 'text-black' : isDark ? 'text-white/30 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/60')} />
                              <span className="truncate">{item.label}</span>
                              {item.badge && <Badge variant="secondary" className={cn('ml-auto text-[9px] px-1.5 py-0 border-0 bg-gradient-to-r', item.badgeColor || '', isDark ? 'text-purple-300' : 'text-purple-600')}>{item.badge}</Badge>}
                            </button>
                          );
                        })}
                      </div>
                      {sectionIdx < navSections.length - 1 && <div className={cn('mx-3 mt-3 mb-1 border-t', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')} />}
                    </div>
                  ))}
                </nav>

                <div className={cn('p-3 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium">AI Insight</span>
                    </div>
                    <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/40' : 'text-black/40')}>
                      WhatsApp Commerce could unlock ₹12L/mo additional revenue. 3 campaigns ready for optimization.
                    </p>
                  </div>
                </div>
              </aside>
            )}

          {/* Page Content */}
          <main className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <PageContent />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
