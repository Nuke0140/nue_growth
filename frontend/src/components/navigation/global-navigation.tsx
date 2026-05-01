'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationContext } from '@/app-system/navigation/navigation-provider';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from 'next-themes';
import { CSS, ANIMATION, Z_INDEX } from '@/styles/design-tokens';
import {
  Home,
  ArrowLeft,
  ArrowRight,
  History,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';

interface NavigationButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

function NavigationButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  isActive = false,
  variant = 'ghost',
}: NavigationButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const baseClasses = 'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200';
  
  const variantClasses = {
    primary: isDark 
      ? 'bg-white text-black shadow-white/10 hover:bg-white/90' 
      : 'bg-black text-white shadow-black/10 hover:bg-black/90',
    secondary: isDark
      ? 'bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white border border-white/[0.08]'
      : 'bg-black/[0.08] text-black/70 hover:bg-black/[0.12] hover:text-black border border-black/[0.08]',
    ghost: isDark
      ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
      : 'text-black/40 hover:text-black/70 hover:bg-black/[0.06]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute inset-0 rounded-xl border-2"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

interface BreadcrumbProps {
  currentLabel: string;
  onNavigate?: (path: string) => void;
}

function Breadcrumb({ currentLabel, onNavigate }: BreadcrumbProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const parts = currentLabel.split(' / ');
  
  return (
    <div className="flex items-center gap-2 text-sm">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className={isDark ? 'text-white/30' : 'text-black/30'}>/</span>
          )}
          <motion.span
            className={`font-medium ${index === parts.length - 1 
              ? (isDark ? 'text-white/90' : 'text-black/90')
              : (isDark ? 'text-white/50 hover:text-white/70' : 'text-black/50 hover:text-black/70')
            } cursor-pointer transition-colors`}
            whileHover={{ scale: index === parts.length - 1 ? 1 : 1.02 }}
            onClick={() => index === 0 && onNavigate?.('/')}
          >
            {part}
          </motion.span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function GlobalNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { canGoBack, canGoForward, back, forward, currentLabel, history } = useNavigationContext();
  const { isAuthenticated, activeModule, closeModule } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isHomePage = pathname === '/' || (!isAuthenticated && pathname === '/login');
  const isInModule = !!activeModule;

  const handleHome = () => {
    if (isAuthenticated) {
      closeModule();
      router.push('/');
    } else {
      router.push('/login');
    }
  };

  const handleBack = () => {
    const previousEntry = back();
    if (previousEntry) {
      router.push(previousEntry.path);
    }
  };

  const handleForward = () => {
    const nextEntry = forward();
    if (nextEntry) {
      router.push(nextEntry.path);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 h-14 border-b z-[${Z_INDEX.topbar}] transition-colors duration-200 ${
          isDark 
            ? 'bg-[#0a0a0a] border-white/[0.06]' 
            : 'bg-[#fafafa] border-black/[0.06]'
        }`}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section: Navigation Controls */}
          <div className="flex items-center gap-2">
            <NavigationButton
              icon={ArrowLeft}
              label="Go back"
              onClick={handleBack}
              disabled={!canGoBack()}
            />
            <NavigationButton
              icon={ArrowRight}
              label="Go forward"
              onClick={handleForward}
              disabled={!canGoForward()}
            />
            <NavigationButton
              icon={Home}
              label="Home"
              onClick={handleHome}
              isActive={isHomePage}
              variant={isHomePage ? 'primary' : 'secondary'}
            />
            
            {/* Breadcrumb */}
            <div className="ml-4">
              <Breadcrumb currentLabel={currentLabel} />
            </div>
          </div>

          {/* Right Section: Utility Controls */}
          <div className="flex items-center gap-2">
            <NavigationButton
              icon={History}
              label="Navigation history"
              onClick={() => setShowHistory(!showHistory)}
              isActive={showHistory}
            />
            <NavigationButton
              icon={isInModule ? Minimize2 : Maximize2}
              label={isInModule ? "Minimize module" : "Maximize view"}
              onClick={() => isInModule ? closeModule() : null}
              disabled={!isInModule}
            />
            <NavigationButton
              icon={LayoutGrid}
              label="Module grid"
              onClick={() => {
                closeModule();
                router.push('/');
              }}
              variant={isHomePage ? 'ghost' : 'secondary'}
            />
            {/* Theme Toggle Button */}
            <NavigationButton
              icon={isDark ? Sun : Moon}
              label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              variant="secondary"
            />
          </div>
        </div>
      </header>

      {/* Navigation History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-16 right-4 w-80 rounded-xl border shadow-xl p-2 z-[${Z_INDEX.modal}] transition-colors ${
              isDark 
                ? 'bg-[#1a1a1a] border-white/[0.08]' 
                : 'bg-white border-black/[0.08]'
            }`}
          >
            <div className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-black/90'}`}>Navigation History</h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>Recent pages and modules</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {history.slice(-10).reverse().map((entry, index) => (
                <motion.button
                  key={`${entry.path}-${index}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    router.push(entry.path);
                    setShowHistory(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                      : 'text-black/60 hover:text-black hover:bg-black/[0.06]'
                  }`}
                >
                  <Layers className="w-4 h-4 opacity-50" />
                  <div className="flex-1 text-left">
                    <div className={isDark ? 'text-white/80' : 'text-black/80'}>{entry.label}</div>
                    <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{entry.path}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar for Mobile */}
      <nav
        className={`fixed bottom-0 left-0 right-0 h-16 border-t z-[${Z_INDEX.topbar}] transition-colors duration-200 md:hidden ${
          isDark 
            ? 'bg-[#0a0a0a] border-white/[0.06]' 
            : 'bg-[#fafafa] border-black/[0.06]'
        }`}
      >
        <div className="flex items-center justify-around h-full px-4">
          <NavigationButton
            icon={ArrowLeft}
            label="Back"
            onClick={handleBack}
            disabled={!canGoBack()}
          />
          <NavigationButton
            icon={Home}
            label="Home"
            onClick={handleHome}
            isActive={isHomePage}
            variant={isHomePage ? 'primary' : 'secondary'}
          />
          <NavigationButton
            icon={ArrowRight}
            label="Forward"
            onClick={handleForward}
            disabled={!canGoForward()}
          />
          <NavigationButton
            icon={LayoutGrid}
            label="Modules"
            onClick={() => {
              closeModule();
              router.push('/');
            }}
            variant={isHomePage ? 'ghost' : 'secondary'}
          />
          {/* Theme Toggle for Mobile */}
          <NavigationButton
            icon={isDark ? Sun : Moon}
            label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            variant="secondary"
          />
        </div>
      </nav>
    </>
  );
}
