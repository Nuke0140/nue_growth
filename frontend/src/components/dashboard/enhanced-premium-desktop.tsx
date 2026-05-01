'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Maximize2,
  Minimize2,
  Grid3X3,
  X,
  ArrowRight,
  Star,
  TrendingUp as TrendingUpIcon,
  Bookmark,
  Heart,
  Crown,
  Flame,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Move,
  GripVertical,
  Shuffle,
  Zap,
  Target,
} from 'lucide-react';

// Import premium button components
import { PremiumButton, LinkButton } from '@/components/ui/premium-button';

// Import custom hooks
import { useMagneticCursor } from '@/hooks/use-magnetic-cursor';
import { useDragReorder } from '@/hooks/use-drag-reorder';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';

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
    id: 'erp', 
    name: 'ERP Operations', 
    icon: Factory, 
    shade: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 hover:from-emerald-500/30 hover:to-teal-600/30', 
    span: 'col-span-1', 
    description: 'Enterprise resource planning & management', 
    featured: true, 
    stats: { users: '1847', growth: '+15%', revenue: '$890K', rating: 4.7 },
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  { 
    id: 'crm', 
    name: 'CRM & Sales', 
    icon: Users, 
    shade: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30', 
    span: 'col-span-1', 
    description: 'Customer relationships & revenue pipeline', 
    featured: true, 
    stats: { users: '2432', growth: '+23%', revenue: '$1.2M', rating: 4.8 },
    color: 'blue',
    gradient: 'from-blue-500 to-purple-600'
  },
  { 
    id: 'marketing', 
    name: 'Marketing Hub', 
    icon: Megaphone, 
    shade: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30', 
    span: 'col-span-1', 
    description: 'Campaigns & outreach automation', 
    new: true, 
    stats: { users: '1234', growth: '+45%', rating: 4.6 },
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
    stats: { users: '1567', growth: '+32%', rating: 4.8 },
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
    stats: { users: '2134', rating: 4.3 },
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600'
  },
];

// Enhanced Module Tile with all premium features
function EnhancedModuleTile({ 
  module, 
  index, 
  isDark, 
  onClick, 
  isExpanded = false,
  onToggleExpand,
  isDraggable = false,
  dragHandlers,
  isSelected = false,
  onKeyDown
}: { 
  module: Module; 
  index: number; 
  isDark: boolean; 
  onClick?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isDraggable?: boolean;
  dragHandlers?: any;
  isSelected?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Magnetic cursor effect
  const { elementRef, transform, isHovering: isMagneticallyHovered } = useMagneticCursor({
    strength: 0.4,
    ease: 0.3,
    scale: 1.08
  });

  // Animated counter for stats
  const userCount = useAnimatedCounter(parseInt(module.stats?.users || '0'), {
    duration: 1500,
    prefix: '',
    suffix: ''
  });

  const controls = useAnimation();

  useEffect(() => {
    if (hovered || isMagneticallyHovered) {
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
  }, [hovered, isMagneticallyHovered, controls]);

  // Play hover sound effect (optional)
  const playHoverSound = useCallback(() => {
    if (!soundEnabled) return;
    
    // Create a simple hover sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [soundEnabled]);

  const handleMouseEnter = () => {
    setHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

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
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`relative ${module.span} cursor-pointer group`}
      layout={isExpanded}
    >
      <motion.div
        ref={elementRef}
        animate={controls}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transition: transform.transition
        }}
        className={`relative h-40 md:h-48 rounded-3xl ${module.shade} overflow-hidden transition-all duration-500 border backdrop-blur-sm ${
          isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${isDraggable ? 'cursor-move' : ''}`}
        style={{
          boxShadow: hovered || isMagneticallyHovered
            ? '0 25px 50px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
            : '0 10px 20px -5px rgba(0, 0, 0, 0.2)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${module.name} module - ${module.description}`}
        {...(isDraggable ? dragHandlers : {})}
        data-droppable={!isDraggable}
        data-index={index}
      >
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10`}
          animate={{
            opacity: hovered ? 0.25 : 0.1,
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
              {[...Array(8)].map((_, i) => (
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
                  className="absolute w-1 h-1 bg-white rounded-full opacity-40"
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

        {/* Drag indicator */}
        {isDraggable && (
          <div className="absolute top-2 left-2 opacity-50">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              soundEnabled 
                ? 'bg-green-500 text-white' 
                : isDark 
                  ? 'bg-white/10 text-white/60 hover:bg-white/20' 
                  : 'bg-black/10 text-black/60 hover:bg-black/20'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
            
            {/* Enhanced stats with animated counter */}
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
                    <span className={isDark ? 'text-white/60' : 'text-black/60'}>{userCount.formattedValue}</span> users
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

        {/* Morphing shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{ 
            translateX: hovered ? '200%' : '-100%',
            opacity: hovered ? 1 : 0
          }}
          transition={{ 
            duration: hovered ? 1.5 : 0.3,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Voice Search Component
function VoiceSearch({ 
  isListening, 
  onToggle, 
  onResult 
}: { 
  isListening: boolean; 
  onToggle: () => void; 
  onResult: (text: string) => void;
}) {
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        onToggle();
      };

      recognitionInstance.onerror = () => {
        onToggle();
      };

      recognitionInstance.onend = () => {
        onToggle();
      };

      setRecognition(recognitionInstance);
    }
  }, [onToggle, onResult]);

  const handleToggle = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    onToggle();
  };

  if (!recognition) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-white/10 text-white/60 hover:bg-white/20'
      }`}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </motion.button>
  );
}

// Enhanced Top Bar with all features
function EnhancedTopBar({ 
  isDark, 
  isFullscreen, 
  onToggleFullscreen,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedIndex,
  totalModules,
  onNavigateModule
}: {
  isDark: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedIndex: number;
  totalModules: number;
  onNavigateModule: (direction: 'prev' | 'next') => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, logout } = useAuthStore();

  // AI-powered search suggestions
  const generateSuggestions = useCallback((query: string) => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = premiumModules
      .filter(module => 
        module.name.toLowerCase().includes(query.toLowerCase()) ||
        module.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(module => module.name)
      .slice(0, 5);

    setSearchSuggestions(suggestions);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSuggestions(searchQuery);
      setShowSuggestions(searchQuery.length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, generateSuggestions]);

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
      {/* Left side - Search with voice and suggestions */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
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
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

          {/* Search suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl backdrop-blur-xl p-2 z-50 max-h-48 overflow-y-auto ${
                  isDark ? 'bg-black/80 border-white/[0.1]' : 'bg-white/80 border-black/[0.1]'
                }`}
              >
                {searchSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSearchChange(suggestion)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      isDark ? 'text-white/80 hover:bg-white/10' : 'text-black/80 hover:bg-black/10'
                    }`}
                  >
                    <Search className="w-3 h-3 inline mr-2 opacity-50" />
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice Search */}
        <VoiceSearch
          isListening={isVoiceListening}
          onToggle={() => setIsVoiceListening(!isVoiceListening)}
          onResult={(text) => onSearchChange(text)}
        />
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-3">
        {/* Module Navigation */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
        }`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateModule('prev')}
            disabled={selectedIndex === 0}
            className={`p-1 rounded transition-colors ${
              selectedIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
          <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            {selectedIndex + 1}/{totalModules}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateModule('next')}
            disabled={selectedIndex === totalModules - 1}
            className={`p-1 rounded transition-colors ${
              selectedIndex === totalModules - 1
                ? 'opacity-30 cursor-not-allowed'
                : isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>

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
            {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EnhancedPremiumDesktop() {
  const { user, logout, openModule } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modules, setModules] = useState(premiumModules);
  const [isReordering, setIsReordering] = useState(false);
  
  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scrolling effect
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -50]);

  // Drag and drop functionality
  const { draggedItem, dragOverIndex, handlers: dragHandlers } = useDragReorder({
    items: modules,
    onReorder: setModules,
    getItemId: (module) => module.id
  });

  // Swipe gestures for mobile
  const { swipeDirection, handlers: swipeHandlers } = useSwipeGestures({
    threshold: 50,
    onSwipeLeft: () => {
      if (selectedIndex < modules.length - 1) {
        setSelectedIndex(prev => prev + 1);
      }
    },
    onSwipeRight: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(prev => prev - 1);
      }
    }
  });

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (selectedIndex > 0) {
            setSelectedIndex(prev => prev - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (selectedIndex < modules.length - 1) {
            setSelectedIndex(prev => prev + 1);
          }
          break;
        case 'Enter':
          e.preventDefault();
          const selectedModule = modules[selectedIndex];
          if (selectedModule) {
            const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
            if (validModules.includes(selectedModule.id)) {
              openModule(selectedModule.id as any);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          // Close any open modals/popups
          setExpandedModule(null);
          setSearchQuery('');
          break;
        case 'Tab':
          // Let default tab behavior work for accessibility
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, modules, openModule]);

  // Filter modules by search
  const filteredModules = useMemo(() => {
    return modules.filter(module => 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [modules, searchQuery]);

  const displayName = user?.full_name || user?.email || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  
  const navigateModule = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(prev => prev - 1);
    } else if (direction === 'next' && selectedIndex < filteredModules.length - 1) {
      setSelectedIndex(prev => prev + 1);
    }
  }, [selectedIndex, filteredModules.length]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen flex transition-colors duration-500 ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
      {...swipeHandlers}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar */}
        <EnhancedTopBar
          isDark={isDark}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedIndex={selectedIndex}
          totalModules={filteredModules.length}
          onNavigateModule={navigateModule}
        />

        {/* Main Content Area with Parallax */}
        <main className="flex-1 overflow-y-auto">
          <motion.div 
            style={{ y: parallaxY }}
            className="px-8 py-8"
          >
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-8"
              >
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

                              </motion.div>

              {/* Reorder Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReordering(!isReordering)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isReordering
                        ? isDark 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-blue-500 text-white'
                        : isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/5' 
                          : 'text-black/60 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <Move className="w-4 h-4" />
                    {isReordering ? 'Reordering On' : 'Enable Reorder'}
                  </motion.button>
                  
                  {isReordering && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModules(premiumModules)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isDark 
                          ? 'text-white/60 hover:text-white hover:bg-white/5' 
                          : 'text-black/60 hover:text-black hover:bg-black/5'
                      }`}
                    >
                      <Shuffle className="w-4 h-4" />
                      Reset Order
                    </motion.button>
                  )}
                </div>

                <div className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {isReordering ? 'Drag modules to reorder' : 'Press arrow keys to navigate'}
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
                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    {filteredModules.map((module, index) => (
                      <EnhancedModuleTile
                        key={module.id}
                        module={module}
                        index={index}
                        isDark={isDark}
                        isExpanded={expandedModule === module.id}
                        onToggleExpand={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                        isDraggable={isReordering}
                        dragHandlers={dragHandlers}
                        isSelected={selectedIndex === index}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                            if (validModules.includes(module.id)) {
                              openModule(module.id as any);
                            }
                          }
                        }}
                        onClick={() => {
                          if (!isReordering) {
                            setSelectedIndex(index);
                            const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                            if (validModules.includes(module.id)) {
                              openModule(module.id as any);
                            }
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
                          setSelectedIndex(index);
                          const validModules = ['crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];
                          if (validModules.includes(module.id)) {
                            openModule(module.id as any);
                          }
                        }}
                        className={`flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all backdrop-blur-sm border ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                        } ${selectedIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
