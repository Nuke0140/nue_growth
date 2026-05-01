'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion';
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
  ChevronUp,
  ChevronLeft,
  ChevronRight,
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
  Maximize2,
  Minimize2,
  Expand,
  Compress,
  Menu,
  X,
  ArrowRight,
  Star,
  TrendingUp as TrendingUpIcon,
  Activity,
  Clock,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  ThumbsUp,
  Award,
  Gem,
  Crown,
  Flame,
  Bolt,
  Layers,
  Box,
  Package,
  ShoppingBag,
  Briefcase,
  Target as TargetIcon,
  Zap as ZapIcon,
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
  shade: string;
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
    rating?: number;
    activeUsers?: string;
  };
  color?: string;
  gradient?: string;
}

const premiumModules: Module[] = [
  { 
    id: 'crm', 
    name: 'CRM & Sales', 
    icon: Users, 
    shade: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30', 
    span: 'col-span-2', 
    description: 'Customer relationships & revenue pipeline', 
    featured: true, 
    stats: { users: '2.4k', growth: '+23%', revenue: '$1.2M', rating: 4.8 },
    color: 'blue',
    gradient: 'from-blue-500 to-purple-600'
  },
  { 
    id: 'erp', 
    name: 'ERP Operations', 
    icon: Factory, 
    shade: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 hover:from-emerald-500/30 hover:to-teal-600/30', 
    span: 'col-span-2', 
    description: 'Enterprise resource planning & management', 
    featured: true, 
    stats: { users: '1.8k', growth: '+15%', revenue: '$890K', rating: 4.7 },
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  { 
    id: 'marketing', 
    name: 'Marketing Hub', 
    icon: Megaphone, 
    shade: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30', 
    span: 'col-span-1', 
    description: 'Campaigns & outreach automation', 
    new: true, 
    stats: { users: '1.2k', growth: '+45%', rating: 4.6 },
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600'
  },
  { 
    id: 'finance', 
    name: 'Finance Suite', 
    icon: DollarSign, 
    shade: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30', 
    span: 'col-span-1', 
    description: 'Financial management & analytics', 
    category: 'Finance',
    stats: { users: '956', growth: '+18%', revenue: '$2.1M', rating: 4.9 },
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    id: 'analytics', 
    name: 'Analytics Pro', 
    icon: BarChart3, 
    shade: 'bg-gradient-to-br from-indigo-500/20 to-blue-600/20 hover:from-indigo-500/30 hover:to-blue-600/30', 
    span: 'col-span-1', 
    description: 'Advanced insights & reporting', 
    category: 'Data',
    stats: { users: '1.5k', growth: '+32%', rating: 4.8 },
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-600'
  },
  { 
    id: 'automation', 
    name: 'Automation AI', 
    icon: Bot, 
    shade: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30', 
    span: 'col-span-1', 
    description: 'AI-powered workflows & automation', 
    new: true, 
    beta: true, 
    stats: { users: '743', growth: '+67%', rating: 4.5 },
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    id: 'growth', 
    name: 'Growth Engine', 
    icon: Sprout, 
    shade: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30', 
    span: 'col-span-1', 
    description: 'Growth strategies & expansion tools', 
    beta: true, 
    stats: { users: '523', growth: '+89%', rating: 4.4 },
    color: 'green',
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'settings', 
    name: 'Control Center', 
    icon: Settings, 
    shade: 'bg-gradient-to-br from-gray-500/20 to-slate-600/20 hover:from-gray-500/30 hover:to-slate-600/30', 
    span: 'col-span-1', 
    description: 'System configuration & preferences', 
    category: 'System',
    stats: { users: '2.1k', rating: 4.3 },
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600'
  },
];

// Premium Module Tile with enhanced animations
function PremiumModuleTile({ 
  module, 
  index, 
  isDark, 
  onClick, 
  isExpanded = false,
  onToggleExpand 
}: { 
  module: Module; 
  index: number; 
  isDark: boolean; 
  onClick?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (hovered) {
      controls.start({
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3, ease: "easeOut" }
      });
    } else {
      controls.start({
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  }, [hovered, controls]);

  const isWide = module.span === 'col-span-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.1 * index,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative ${module.span} cursor-pointer group`}
      layout={isExpanded}
    >
      <motion.div
        animate={controls}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        className={`relative h-40 md:h-48 rounded-3xl ${module.shade} overflow-hidden transition-all duration-500 border backdrop-blur-sm ${
          isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
        }`}
        style={{
          boxShadow: hovered 
            ? '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 10px 20px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10`}
          animate={{
            opacity: hovered ? 0.2 : 0.1,
            scale: hovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Particle effects */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass morphism effect */}
        <div className={`absolute inset-0 backdrop-blur-sm ${
          isDark ? 'bg-black/20' : 'bg-white/20'
        }`} />

        {/* Status badges */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          {module.new && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                isDark 
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 mr-1 inline" />
              NEW
            </motion.div>
          )}
          {module.beta && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
              }`}
            >
              <Flame className="w-3 h-3 mr-1 inline" />
              BETA
            </motion.div>
          )}
          {module.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}
            >
              <Crown className="w-3 h-3 mr-1 inline" />
              FEATURED
            </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          className="absolute top-4 left-4 flex gap-2 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              liked 
                ? 'bg-red-500 text-white' 
                : isDark 
                  ? 'bg-white/10 text-white/60 hover:bg-white/20' 
                  : 'bg-black/10 text-black/60 hover:bg-black/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              bookmarked 
                ? 'bg-blue-500 text-white' 
                : isDark 
                  ? 'bg-white/10 text-white/60 hover:bg-white/20' 
                  : 'bg-black/10 text-black/60 hover:bg-black/20'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <motion.div
              animate={{
                rotate: hovered ? -15 : 0,
                scale: hovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg`}>
                <module.icon className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
              </div>
            </motion.div>
            
            {isWide && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.();
                }}
                className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                  isDark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-black/10 text-black/60 hover:bg-black/20'
                }`}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </motion.button>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className={`font-bold text-lg md:text-xl tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              {module.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} line-clamp-2`}>
              {module.description}
            </p>
            
            {/* Enhanced stats */}
            {module.stats && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
                className="flex items-center gap-4"
              >
                {module.stats.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {module.stats.rating}
                    </span>
                  </div>
                )}
                {module.stats.users && (
                  <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                    <span className={isDark ? 'text-white/60' : 'text-black/60'}>{module.stats.users}</span> users
                  </div>
                )}
                {module.stats.growth && (
                  <div className={`text-xs font-medium text-green-500 flex items-center gap-1`}>
                    <TrendingUpIcon className="w-3 h-3" />
                    {module.stats.growth}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{ translateX: hovered ? '200%' : '-100%' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

// Premium Sidebar
function PremiumSidebar({ 
  isDark, 
  isCollapsed, 
  onToggleCollapse,
  onToggleTheme 
}: { 
  isDark: boolean; 
  isCollapsed: boolean; 
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
}) {
  const [activeSection, setActiveSection] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: 8 },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: 3 },
    { id: 'recent', label: 'Recent', icon: Clock, count: 5 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 12 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 7 },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isCollapsed ? 80 : 280,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className={`relative flex-shrink-0 border-r backdrop-blur-xl ${
        isDark 
          ? 'bg-black/40 border-white/[0.08]' 
          : 'bg-white/40 border-black/[0.08]'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-inherit">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>
                  NueEra
                </h3>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  Premium OS
                </p>
              </div>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className={`w-8 h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-colors ${
              isDark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-black/10 text-black/60 hover:bg-black/20'
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeSection === item.id
                ? isDark 
                  ? 'bg-white/10 text-white' 
                  : 'bg-black/10 text-black'
                : isDark 
                  ? 'text-white/60 hover:text-white hover:bg-white/5' 
                  : 'text-black/60 hover:text-black hover:bg-black/5'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                className="flex items-center justify-between flex-1"
              >
                <span className="text-sm font-medium">{item.label}</span>
                {item.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'
                  }`}>
                    {item.count}
                  </span>
                )}
              </motion.div>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-inherit">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Premium Top Bar
function PremiumTopBar({ 
  isDark, 
  isFullscreen, 
  onToggleFullscreen,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange 
}: {
  isDark: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();
  const displayName = user?.full_name || user?.email || 'User';

  const notifications = [
    { id: 1, title: 'New user registration', message: 'John Doe joined your team', time: '2m ago', unread: true },
    { id: 2, title: 'Report ready', message: 'Monthly analytics report is ready', time: '1h ago', unread: true },
    { id: 3, title: 'System update', message: 'New features available in CRM', time: '3h ago', unread: false },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b ${
        isDark 
          ? 'bg-black/40 border-white/[0.08]' 
          : 'bg-white/40 border-black/[0.08]'
      }`}
    >
      {/* Left side - Search */}
      <div className="flex items-center gap-4 flex-1">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border flex-1 max-w-md transition-all ${
            isDark
              ? 'bg-white/5 border-white/[0.08] focus-within:bg-white/10 focus-within:border-white/[0.15]'
              : 'bg-black/5 border-black/[0.08] focus-within:bg-black/10 focus-within:border-black/[0.15]'
          }`}
        >
          <Search className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
          <input
            type="text"
            placeholder="Search modules, features, or help..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`bg-transparent text-sm focus:outline-none flex-1 placeholder:text-sm ${
              isDark
                ? 'text-white/70 placeholder:text-white/30'
                : 'text-black/70 placeholder:text-black/30'
            }`}
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className={`text-xs ${isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'}`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className={`flex items-center rounded-xl border ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange('grid')}
            className={`p-2.5 rounded-l-xl transition-colors ${
              viewMode === 'grid'
                ? isDark ? 'bg-white/15 text-white' : 'bg-black/15 text-black'
                : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange('list')}
            className={`p-2.5 rounded-r-xl transition-colors ${
              viewMode === 'list'
                ? isDark ? 'bg-white/15 text-white' : 'bg-black/15 text-black'
                : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${
              isDark
                ? 'bg-white/10 text-white/60 hover:text-white/80 hover:bg-white/15'
                : 'bg-black/10 text-black/60 hover:text-black/80 hover:bg-black/15'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] text-white flex items-center justify-center font-bold bg-gradient-to-r from-red-500 to-pink-500`}>
              3
            </span>
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl backdrop-blur-xl p-4 z-50 ${
                  isDark ? 'bg-black/80 border-white/[0.1]' : 'bg-white/80 border-black/[0.1]'
                }`}
              >
                <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                  Notifications
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${notif.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                            {notif.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                            {notif.message}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'} mt-1`}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fullscreen Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleFullscreen}
          className={`w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${
            isDark
              ? 'bg-white/10 text-white/60 hover:text-white/80 hover:bg-white/15'
              : 'bg-black/10 text-black/60 hover:text-black/80 hover:bg-black/15'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
              isDark
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                : 'bg-gradient-to-br from-gray-800 to-black text-white'
            }`}
          >
            {displayName.charAt(0).toUpperCase()}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PremiumDesktop() {
  const { user, logout, openModule } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'users'>('rating');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Filter and sort modules
  const filteredModules = premiumModules
    .filter(module => 
      selectedCategory === 'all' || module.category === selectedCategory
    )
    .filter(module => 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.stats?.rating || 0) - (a.stats?.rating || 0);
        case 'users':
          return parseInt(b.stats?.users || '0') - parseInt(a.stats?.users || '0');
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const displayName = user?.full_name || user?.email || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
    >
      {/* Premium Sidebar */}
      <PremiumSidebar
        isDark={isDark}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Top Bar */}
        <PremiumTopBar
          isDark={isDark}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-8 py-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${
                      isDark 
                        ? 'from-white to-white/60' 
                        : 'from-black to-black/60'
                    } bg-clip-text text-transparent`}
                  >
                    {greeting}, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{displayName}</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-lg ${isDark ? 'text-white/50' : 'text-black/50'}`}
                  >
                    Welcome to your premium enterprise command center
                  </motion.p>
                </div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:flex items-center gap-6"
                >
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>8</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>Modules</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold text-green-500`}>2.4k</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold text-blue-500`}>98%</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>Satisfaction</p>
                  </div>
                </motion.div>
              </div>

              {/* Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-8"
              >
                {/* Category Filter */}
                <div className="flex gap-2">
                  {['all', 'Operations', 'Finance', 'Data', 'System'].map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? isDark 
                            ? 'bg-white/15 text-white border border-white/25' 
                            : 'bg-black/15 text-black border border-black/25'
                          : isDark 
                            ? 'text-white/60 hover:text-white hover:bg-white/5' 
                            : 'text-black/60 hover:text-black hover:bg-black/5'
                      }`}
                    >
                      {category === 'all' ? 'All Modules' : category}
                    </motion.button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`px-3 py-2 rounded-xl text-sm backdrop-blur-sm border ${
                      isDark 
                        ? 'bg-white/10 border-white/20 text-white' 
                        : 'bg-black/10 border-black/20 text-black'
                    }`}
                  >
                    <option value="rating">Rating</option>
                    <option value="users">Users</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </motion.div>

              {/* Module Grid */}
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredModules.map((module, index) => (
                      <PremiumModuleTile
                        key={module.id}
                        module={module}
                        index={index}
                        isDark={isDark}
                        isExpanded={expandedModule === module.id}
                        onToggleExpand={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
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
                    className="space-y-4"
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
                        className={`flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-sm border ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg`}>
                          <module.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>
                            {module.name}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} mb-2`}>
                            {module.description}
                          </p>
                          <div className="flex items-center gap-4">
                            {module.stats?.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                                  {module.stats.rating}
                                </span>
                              </div>
                            )}
                            {module.stats?.users && (
                              <span className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                                {module.stats.users} users
                              </span>
                            )}
                            {module.stats?.growth && (
                              <span className="text-sm font-medium text-green-500 flex items-center gap-1">
                                <TrendingUpIcon className="w-4 h-4" />
                                {module.stats.growth}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
