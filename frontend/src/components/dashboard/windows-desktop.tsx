'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from 'next-themes';
import {
  LogOut,
  LayoutDashboard,
  Factory,
  Users,
  Megaphone,
  TrendingUp,
  DollarSign,
  Sprout,
  BarChart3,
  Bot,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Wifi,
  Battery,
  Volume2,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';
interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  shade: string; // grayscale shade classes
  span: string;
  description: string;
}

const darkModules: Module[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, shade: 'bg-white/[0.12] hover:bg-white/[0.16]', span: 'col-span-2', description: 'Overview & Analytics' },
  { id: 'erp', name: 'ERP', icon: Factory, shade: 'bg-white/[0.08] hover:bg-white/[0.12]', span: 'col-span-1', description: 'Enterprise Resource' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, shade: 'bg-white/[0.18] hover:bg-white/[0.22]', span: 'col-span-2', description: 'Contacts, Pipeline & Revenue' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, shade: 'bg-white/[0.06] hover:bg-white/[0.10]', span: 'col-span-2', description: 'Campaigns & Outreach' },
  { id: 'finance', name: 'Finance', icon: DollarSign, shade: 'bg-white/[0.10] hover:bg-white/[0.14]', span: 'col-span-1', description: 'Accounts & Budget' },
  { id: 'growth', name: 'Refresh & Growth', icon: Sprout, shade: 'bg-white/[0.16] hover:bg-white/[0.20]', span: 'col-span-2', description: 'Strategy & Expansion' },
  { id: 'analytics', name: 'Analytics & BI', icon: BarChart3, shade: 'bg-white/[0.07] hover:bg-white/[0.11]', span: 'col-span-1', description: 'Insights & Reports' },
  { id: 'automation', name: 'Automation', icon: Bot, shade: 'bg-white/[0.13] hover:bg-white/[0.17]', span: 'col-span-1', description: 'Workflows & AI' },
  { id: 'settings', name: 'Settings', icon: Settings, shade: 'bg-white/[0.05] hover:bg-white/[0.09]', span: 'col-span-2', description: 'Configuration & Preferences' },
];

const lightModules: Module[] = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, shade: 'bg-black/[0.08] hover:bg-black/[0.12]', span: 'col-span-2', description: 'Overview & Analytics' },
  { id: 'erp', name: 'ERP', icon: Factory, shade: 'bg-black/[0.05] hover:bg-black/[0.09]', span: 'col-span-1', description: 'Enterprise Resource' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, shade: 'bg-black/[0.12] hover:bg-black/[0.16]', span: 'col-span-2', description: 'Contacts, Pipeline & Revenue' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, shade: 'bg-black/[0.04] hover:bg-black/[0.08]', span: 'col-span-2', description: 'Campaigns & Outreach' },
  { id: 'finance', name: 'Finance', icon: DollarSign, shade: 'bg-black/[0.07] hover:bg-black/[0.11]', span: 'col-span-1', description: 'Accounts & Budget' },
  { id: 'growth', name: 'Refresh & Growth', icon: Sprout, shade: 'bg-black/[0.11] hover:bg-black/[0.15]', span: 'col-span-2', description: 'Strategy & Expansion' },
  { id: 'analytics', name: 'Analytics & BI', icon: BarChart3, shade: 'bg-black/[0.06] hover:bg-black/[0.10]', span: 'col-span-1', description: 'Insights & Reports' },
  { id: 'automation', name: 'Automation', icon: Bot, shade: 'bg-black/[0.09] hover:bg-black/[0.13]', span: 'col-span-1', description: 'Workflows & AI' },
  { id: 'settings', name: 'Settings', icon: Settings, shade: 'bg-black/[0.03] hover:bg-black/[0.07]', span: 'col-span-2', description: 'Configuration & Preferences' },
];

function ModuleTile({ module, index, isDark, onClick }: { module: Module; index: number; isDark: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isWide = module.span === 'col-span-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.08 * index,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative ${module.span} cursor-pointer group`}
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative h-36 md:h-44 rounded-2xl ${module.shade} overflow-hidden transition-colors duration-300 border ${'border-[var(--app-border)]'}`}
      >
        {/* Dot pattern */}
        <motion.div
          className={`absolute inset-0 opacity-[0.06]`}
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)'
              : 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          animate={{ backgroundPosition: hovered ? '12px 12px' : '0px 0px' }}
          transition={{ duration: 0.5 }}
        />

        {/* Light sweep on hover */}
        <motion.div
          className={`absolute inset-0 -translate-x-full ${isDark ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-white/30 to-transparent'}`}
          animate={{ translateX: hovered ? '200%' : '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Bottom gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 ${isDark ? 'bg-gradient-to-t from-black/30 to-transparent' : 'bg-gradient-to-t from-white/40 to-transparent'}`} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <motion.div
              animate={{
                rotate: hovered ? [0, -10, 10, 0] : 0,
                scale: hovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <module.icon className={`w-8 h-8 md:w-10 md:h-10 drop-shadow-lg ${'text-[var(--app-text)]'}`} />
            </motion.div>
            {isWide && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
              >
                <ChevronDown className={`w-4 h-4 -rotate-90 ${'text-[var(--app-text)]'}`} />
              </motion.div>
            )}
          </div>
          <div>
            <h3 className={`font-bold text-base md:text-lg tracking-tight ${'text-[var(--app-text)]'}`}>
              {module.name}
            </h3>
            <p className={`text-xs md:text-sm mt-0.5 ${'text-[var(--app-text-secondary)]'}`}>
              {module.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WindowsDesktop() {
  const { user, logout, openModule } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const modules = isDark ? darkModules : lightModules;
  const displayName = user?.full_name || user?.email || 'User';

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${'bg-[var(--app-bg)]'}`}>
      {/* Top bar */}
      <header className={`h-8 border-b flex items-center justify-between px-4 transition-colors duration-500 ${isDark ? 'bg-[#050505] border-white/[0.05]' : 'bg-[#f5f5f5] border-black/[0.05]'}`}>
        {/* Left: brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-1.5 cursor-pointer transition-colors ${'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'}`}
          >
            <Image
              src="/logo.png"
              alt="DigiNue"
              width={20}
              height={14}
              className="object-contain rounded-sm"
            />
            <span className="text-[11px] font-semibold tracking-wide hidden sm:inline">DIGINUE</span>
          </motion.div>
        </div>

        {/* Right: system tray + theme toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`transition-colors ${'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'}`}
          >
            {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </motion.button>
          <div className={`hidden sm:flex items-center gap-3 ${'text-[var(--app-text-muted)]'}`}>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
            <Volume2 className="w-3 h-3" />
            <span className="text-[10px] font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-6 md:px-10 pt-6 pb-4"
        >
          <div>
            <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${'text-[var(--app-text)]'}`}>
              {greeting}, <span className={'text-[var(--app-text)]'}>{displayName}</span>
            </h2>
            <p className={`text-sm mt-0.5 transition-colors duration-500 ${'text-[var(--app-text-muted)]'}`}>
              Welcome to your enterprise command center
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
            {/* Search */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border flex-1 min-w-0 sm:flex-none sm:w-40 md:w-64 transition-colors duration-500 ${isDark
                ? 'bg-white/[0.04] border-white/[0.08]'
                : 'bg-white/60 border-black/[0.08]'
                }`}
            >
              <Search className={`w-4 h-4 ${'text-[var(--app-text-muted)]'}`} />
              <input
                type="text"
                placeholder="Search modules..."
                className={`bg-transparent text-sm focus:outline-none flex-1 transition-colors ${isDark
                  ? 'text-white/70 placeholder:text-white/25'
                  : 'text-black/70 placeholder:text-black/25'
                  }`}
              />
            </motion.div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08]'
                : 'bg-white/60 border-black/[0.08] text-black/50 hover:text-black/80 hover:bg-white/80'
                }`}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold ${isDark ? 'bg-white text-black' : 'bg-black'}`}>
                3
              </span>
            </motion.button>

            {/* User avatar */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-colors duration-500 ${isDark
                  ? 'bg-white text-black shadow-white/10'
                  : 'bg-black text-white shadow-black/10'
                  }`}
              >
                {displayName.charAt(0).toUpperCase()}
              </motion.button>

              {/* User dropdown */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`absolute right-0 top-12 w-56 rounded-xl border shadow-xl p-2 z-50 transition-colors ${isDark
                    ? 'bg-[#1a1a1a] border-white/[0.08]'
                    : 'bg-white border-black/[0.08]'
                    }`}
                >
                  <div className={`px-3 py-2 border-b mb-1 ${'border-[var(--app-border)]'}`}>
                    <p className={`text-sm font-semibold ${'text-[var(--app-text)]'}`}>
                      {displayName}
                    </p>
                    <p className={`text-xs ${'text-[var(--app-text-muted)]'}`}>{user?.email || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={logout}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                      : 'text-black/60 hover:text-black hover:bg-black/[0.06]'
                      }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Module tiles grid */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {modules.map((module, index) => (
              <ModuleTile
                key={module.id}
                module={module}
                index={index}
                isDark={isDark}
                onClick={() => {
                  const validModules = ['dashboard', 'crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                  if (validModules.includes(module.id)) {
                    openModule(module.id as any);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom taskbar */}
      <footer className={`h-8 sm:h-10 backdrop-blur-xl border-t flex items-center justify-center transition-colors duration-500 ${isDark
        ? 'bg-[#050505]/80 border-white/[0.05]'
        : 'bg-[#f5f5f5]/80 border-black/[0.05]'
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
