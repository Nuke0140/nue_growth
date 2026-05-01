'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from 'next-themes';
import { CSS, ANIMATION, MOTION, LAYOUT } from '@/styles/design-tokens';
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
  Grid3X3,
  Sparkles,
  Target,
  Rocket,
  Shield,
  Globe,
  ZapOff,
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  shade: string; // grayscale shade classes
  span: string;
  description: string;
  category?: string;
  featured?: boolean;
  new?: boolean;
  beta?: boolean;
  stats?: {
    users?: string;
    growth?: string;
    revenue?: string;
  };
}

const darkModules: Module[] = [
  { id: 'erp', name: 'ERP', icon: Factory, shade: 'bg-white/[0.08] hover:bg-white/[0.12]', span: 'col-span-1', description: 'Enterprise Resource', category: 'Operations' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, shade: 'bg-white/[0.18] hover:bg-white/[0.22]', span: 'col-span-1', description: 'Contacts, Pipeline & Revenue', featured: true, stats: { users: '2.4k', growth: '+23%' } },
  { id: 'finance', name: 'Finance', icon: DollarSign, shade: 'bg-white/[0.10] hover:bg-white/[0.14]', span: 'col-span-1', description: 'Accounts & Budget', category: 'Finance' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, shade: 'bg-white/[0.06] hover:bg-white/[0.10]', span: 'col-span-1', description: 'Campaigns & Outreach', new: true, stats: { users: '1.8k' } },
  { id: 'growth', name: 'Growth', icon: Sprout, shade: 'bg-white/[0.16] hover:bg-white/[0.20]', span: 'col-span-1', description: 'Strategy & Expansion', beta: true, stats: { growth: '+45%' } },
  { id: 'analytics', name: 'Analytics & BI', icon: BarChart3, shade: 'bg-white/[0.07] hover:bg-white/[0.11]', span: 'col-span-1', description: 'Insights & Reports', category: 'Data' },
  { id: 'automation', name: 'Automation', icon: Bot, shade: 'bg-white/[0.13] hover:bg-white/[0.17]', span: 'col-span-1', description: 'Workflows & AI', new: true, stats: { users: '892' } },
  { id: 'settings', name: 'Settings', icon: Settings, shade: 'bg-white/[0.05] hover:bg-white/[0.09]', span: 'col-span-1', description: 'Configuration & Preferences', category: 'System' },
];

const lightModules: Module[] = [
  { id: 'erp', name: 'ERP', icon: Factory, shade: 'bg-black/[0.05] hover:bg-black/[0.09]', span: 'col-span-1', description: 'Enterprise Resource', category: 'Operations' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, shade: 'bg-black/[0.12] hover:bg-black/[0.16]', span: 'col-span-1', description: 'Contacts, Pipeline & Revenue', featured: true, stats: { users: '2.4k', growth: '+23%' } },
  { id: 'finance', name: 'Finance', icon: DollarSign, shade: 'bg-black/[0.07] hover:bg-black/[0.11]', span: 'col-span-1', description: 'Accounts & Budget', category: 'Finance' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, shade: 'bg-black/[0.04] hover:bg-black/[0.08]', span: 'col-span-1', description: 'Campaigns & Outreach', new: true, stats: { users: '1.8k' } },
  { id: 'growth', name: 'Growth', icon: Sprout, shade: 'bg-black/[0.11] hover:bg-black/[0.15]', span: 'col-span-1', description: 'Strategy & Expansion', beta: true, stats: { growth: '+45%' } },
  { id: 'analytics', name: 'Analytics & BI', icon: BarChart3, shade: 'bg-black/[0.06] hover:bg-black/[0.10]', span: 'col-span-1', description: 'Insights & Reports', category: 'Data' },
  { id: 'automation', name: 'Automation', icon: Bot, shade: 'bg-black/[0.09] hover:bg-black/[0.13]', span: 'col-span-1', description: 'Workflows & AI', new: true, stats: { users: '892' } },
  { id: 'settings', name: 'Settings', icon: Settings, shade: 'bg-black/[0.03] hover:bg-black/[0.07]', span: 'col-span-1', description: 'Configuration & Preferences', category: 'System' },
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
        duration: 0.6,
        ease: MOTION.easing,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative ${module.span} cursor-pointer group`}
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative h-36 md:h-44 rounded-2xl ${module.shade} overflow-hidden transition-all duration-300 border ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}
      >
        {/* Enhanced dot pattern */}
        <motion.div
          className={`absolute inset-0 opacity-[0.08]`}
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle at 3px 3px, white 1px, transparent 0)'
              : 'radial-gradient(circle at 3px 3px, black 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          animate={{ backgroundPosition: hovered ? '16px 16px' : '0px 0px' }}
          transition={{ duration: 0.6 }}
        />

        {/* Enhanced light sweep */}
        <motion.div
          className={`absolute inset-0 -translate-x-full ${isDark ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-gradient-to-r from-transparent via-white/40 to-transparent'}`}
          animate={{ translateX: hovered ? '200%' : '-100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Featured gradient overlay */}
        {module.featured && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
            animate={{ opacity: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Bottom gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 ${isDark ? 'bg-gradient-to-t from-black/40 to-transparent' : 'bg-gradient-to-t from-white/50 to-transparent'}`} />

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {module.new && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-500 text-white'}`}
            >
              NEW
            </motion.div>
          )}
          {module.beta && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-500 text-white'}`}
            >
              BETA
            </motion.div>
          )}
          {module.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-500 text-white'}`}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <motion.div
              animate={{
                rotate: hovered ? -15 : 0,
                scale: hovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <module.icon className={`w-8 h-8 md:w-10 md:h-10 drop-shadow-lg ${isDark ? 'text-white' : 'text-black'}`} />
            </motion.div>
            {isWide && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/10'}`}
              >
                <ChevronDown className={`w-4 h-4 -rotate-90 ${isDark ? 'text-white' : 'text-black'}`} />
              </motion.div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className={`font-bold text-base md:text-lg tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              {module.name}
            </h3>
            <p className={`text-xs md:text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              {module.description}
            </p>
            
            {/* Stats */}
            {module.stats && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 mt-2"
              >
                {module.stats.users && (
                  <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    <span className={isDark ? 'text-white/60' : 'text-black/60'}>{module.stats.users}</span> users
                  </div>
                )}
                {module.stats.growth && (
                  <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {module.stats.growth}
                  </div>
                )}
                {module.stats.revenue && (
                  <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    <span className={isDark ? 'text-white/60' : 'text-black/60'}>{module.stats.revenue}</span> revenue
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WindowsDesktop() {
  const { user, logout, openModule } = useAuthStore();
  const { theme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const modules = isDark ? darkModules : lightModules;
  const displayName = user?.full_name || user?.email || 'User';

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Filter modules based on search
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-[#f5f5f5]'}`}>
      {/* Main content with top padding for global nav */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14">
        {/* Search bar area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-6 md:px-10 pt-8 pb-6"
        >
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white/90' : 'text-black/90'}`}>
              {greeting}, <span className={isDark ? 'text-white' : 'text-black'}>{displayName}</span>
            </h2>
            <p className={`text-sm mt-1 transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              Welcome to your enterprise command center
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
            {/* Enhanced Search */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-1 min-w-0 sm:flex-none sm:w-48 md:w-72 transition-all duration-500 ${
                isDark
                  ? 'bg-white/[0.04] border-white/[0.08] focus-within:bg-white/[0.06] focus-within:border-white/[0.12]'
                  : 'bg-white/60 border-black/[0.08] focus-within:bg-white/80 focus-within:border-black/[0.12]'
              }`}
            >
              <Search className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none flex-1 transition-colors ${
                  isDark
                    ? 'text-white/70 placeholder:text-white/25'
                    : 'text-black/70 placeholder:text-black/25'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`text-xs ${isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'}`}
                >
                  Clear
                </button>
              )}
            </motion.div>

            {/* View Mode Toggle */}
            <div className={`flex items-center rounded-lg border ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? isDark ? 'bg-white/[0.12] text-white' : 'bg-black/[0.12] text-black'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? isDark ? 'bg-white/[0.12] text-white' : 'bg-black/[0.12] text-black'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                isDark
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
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-colors duration-500 ${
                  isDark
                    ? 'bg-white text-black shadow-white/10'
                    : 'bg-black text-white shadow-black/10'
                }`}
              >
                {displayName.charAt(0).toUpperCase()}
              </motion.button>

              {/* User dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className={`absolute right-0 top-12 w-56 rounded-xl border shadow-xl p-2 z-50 transition-colors ${
                      isDark
                        ? 'bg-[#1a1a1a] border-white/[0.08]'
                        : 'bg-white border-black/[0.08]'
                    }`}
                  >
                    <div className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                        {displayName}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{user?.email || 'user@example.com'}</p>
                    </div>
                    <button
                      onClick={logout}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        isDark
                          ? 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                          : 'text-black/60 hover:text-black hover:bg-black/[0.06]'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Module tiles grid/list */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-20">
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
              >
                {filteredModules.map((module, index) => (
                  <ModuleTile
                    key={module.id}
                    module={module}
                    index={index}
                    isDark={isDark}
                    onClick={() => {
                      const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                      if (validModules.includes(module.id)) {
                        openModule(module.id as any);
                      }
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-3"
              >
                {filteredModules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                      if (validModules.includes(module.id)) {
                        openModule(module.id as any);
                      }
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12]'
                        : 'bg-white/60 border-black/[0.08] hover:bg-white/80 hover:border-black/[0.12]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${module.shade} border ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                      <module.icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{module.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>{module.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.new && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500 text-white'}`}>
                          NEW
                        </span>
                      )}
                      {module.beta && (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500 text-white'}`}>
                          BETA
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
