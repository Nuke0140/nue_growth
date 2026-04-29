'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from 'next-themes';
import {
  DollarSign, Users, TrendingUp, Target, ArrowUpRight, ArrowDownRight,
  Search, Bell, Moon, Sun, LogOut, Settings, Sparkles, MoreHorizontal,
  ChevronRight, LayoutDashboard, Factory, Megaphone, BarChart3, Bot, Sprout,
} from 'lucide-react';

/* ================================================================
   DATA
   ================================================================ */

const kpiData = [
  { label: 'Total Revenue', value: '$248,560', change: '+12.5%', trend: 'up' as const, icon: DollarSign },
  { label: 'Active Users', value: '12,847', change: '+8.2%', trend: 'up' as const, icon: Users },
  { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' as const, icon: TrendingUp },
  { label: 'Pending Deals', value: '47', change: '-3.1%', trend: 'down' as const, icon: Target },
];

const topChannels = [
  { name: 'Organic Search', value: 42, color: '#2563EB' },
  { name: 'Direct Traffic', value: 28, color: '#F97316' },
  { name: 'Social Media', value: 18, color: '#8B5CF6' },
  { name: 'Email Campaigns', value: 12, color: '#10B981' },
];

const recentActivity = [
  { text: 'New deal created — Acme Corp', time: '2m ago', dot: '#2563EB' },
  { text: 'Invoice #1089 paid', time: '15m ago', dot: '#10B981' },
  { text: 'Campaign "Summer Sale" launched', time: '1h ago', dot: '#F97316' },
  { text: 'User milestone: 12,000 users', time: '3h ago', dot: '#8B5CF6' },
];

const tableData = [
  { company: 'Acme Corp', status: 'active', revenue: '$45,200', growth: '+12%', contact: 'John D.' },
  { company: 'TechStart', status: 'pending', revenue: '$32,100', growth: '+8%', contact: 'Sarah M.' },
  { company: 'Global Inc', status: 'active', revenue: '$67,800', growth: '+15%', contact: 'Mike R.' },
  { company: 'InnovateCo', status: 'churned', revenue: '$18,400', growth: '-3%', contact: 'Lisa K.' },
  { company: 'ScaleUp', status: 'active', revenue: '$52,300', growth: '+22%', contact: 'David L.' },
];

const moduleTiles = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, accent: '#2563EB' },
  { id: 'crm', name: 'CRM & Sales', icon: Users, accent: '#8B5CF6' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, accent: '#F97316' },
  { id: 'erp', name: 'ERP', icon: Factory, accent: '#10B981' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, accent: '#2563EB' },
  { id: 'automation', name: 'Automation', icon: Bot, accent: '#F97316' },
  { id: 'growth', name: 'Growth', icon: Sprout, accent: '#10B981' },
  { id: 'settings', name: 'Settings', icon: Settings, accent: '#64748B' },
];

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

const staggerItem = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease, delay } },
});

/* ================================================================
   SVG AREA CHART
   ================================================================ */

function RevenueChart({ isDark }: { isDark: boolean }) {
  const [activePeriod, setActivePeriod] = useState('30D');
  const periods = ['7D', '30D', '90D', '1Y'];

  // Smooth bezier curve points for the chart
  const width = 500;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const dataPoints = [35, 42, 38, 55, 48, 62, 58, 72, 65, 78, 85, 92];
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints) * 0.8;
  const range = max - min;

  const points = dataPoints.map((v, i) => ({
    x: padding.left + (i / (dataPoints.length - 1)) * chartW,
    y: padding.top + chartH - ((v - min) / range) * chartH,
  }));

  // Build smooth path using cubic bezier
  const buildPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
      d += ` C ${cp1x} ${pts[i].y}, ${cp2x} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const gridLines = 4;
  const gridYs = Array.from({ length: gridLines }, (_, i) =>
    padding.top + (i / (gridLines - 1)) * chartH
  );
  const gridValues = Array.from({ length: gridLines }, (_, i) => {
    const val = max - (i / (gridLines - 1)) * range + min;
    return `$${Math.round(val)}k`;
  });

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labelXs = Array.from({ length: 6 }, (_, i) =>
    padding.left + (i / 5) * chartW
  );

  const gradientId = 'chartGradient';
  const strokeColor = '#2563EB';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 style={{ color: 'var(--app-text)' }} className="text-base font-semibold">Revenue Overview</h3>
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
          {periods.map((p) => {
            const isActive = activePeriod === p;
            return (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className="px-3 py-1 text-xs font-medium rounded-md transition-all duration-200"
                style={{
                  backgroundColor: isActive ? (isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)') : 'transparent',
                  color: isActive ? '#2563EB' : 'var(--app-text-muted)',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full" style={{ color: 'var(--app-text)' }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridYs.map((y, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
              strokeWidth={1}
            />
          ))}

          {/* Y-axis labels */}
          {gridValues.map((label, i) => (
            <text
              key={i}
              x={padding.left - 8}
              y={gridYs[i] + 4}
              textAnchor="end"
              fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {label}
            </text>
          ))}

          {/* X-axis labels */}
          {labelXs.map((x, i) => (
            <text
              key={i}
              x={x}
              y={height - 6}
              textAnchor="middle"
              fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {monthLabels[i * 2]}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Line */}
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" />

          {/* Data dots */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? 4 : 0}
              fill="#2563EB"
              stroke={isDark ? '#111827' : '#FFFFFF'}
              strokeWidth={2}
              className="transition-all duration-300"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ================================================================
   STATUS BADGE
   ================================================================ */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    active: { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669' },
    pending: { bg: 'rgba(249, 115, 22, 0.1)', text: '#F97316' },
    churned: { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626' },
  };
  const c = config[status] || { bg: 'var(--app-hover-bg)', text: 'var(--app-text-muted)' };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function WindowsDesktop() {
  const { user, logout, openModule } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const resolvedTheme = theme === 'system' ? 'dark' : theme;
  const isDark = resolvedTheme === 'dark';
  const displayName = user?.full_name || user?.email || 'User';

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setShowUserMenu(false);
    if (showUserMenu) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showUserMenu]);

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--app-bg)' }} />
    );
  }

  const validModules = ['dashboard', 'crm', 'erp', 'marketing', 'sales', 'finance', 'growth', 'analytics', 'automation', 'settings'];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--app-bg)', color: 'var(--app-text)' }}
    >
      {/* ================================================================
          1. TOP NAVIGATION BAR
          ================================================================ */}
      <header
        className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-8 border-b"
        style={{
          backgroundColor: isDark ? 'rgba(11, 17, 32, 0.8)' : 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottomColor: isDark ? 'rgba(241, 245, 249, 0.06)' : 'rgba(15, 23, 42, 0.06)',
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="NueEra"
            width={28}
            height={20}
            className="object-contain rounded"
          />
          <span className="text-sm font-bold tracking-tight hidden sm:inline" style={{ color: 'var(--app-text)' }}>
            NueEra
          </span>
        </div>

        {/* Center: Search */}
        <div
          className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-xl border max-w-md flex-1 mx-8 transition-all duration-200"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
            borderColor: 'var(--app-border)',
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--app-text-muted)' }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm focus:outline-none w-full"
            style={{ color: 'var(--app-text)' }}
            onFocus={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.borderColor = '#2563EB';
                parent.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.borderColor = 'var(--app-border)';
                parent.style.boxShadow = 'none';
              }
            }}
          />
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border" style={{ color: 'var(--app-text-muted)', borderColor: 'var(--app-border)' }}>
            ⌘K
          </kbd>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: 'var(--app-hover-bg)', color: 'var(--app-text-secondary)' }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: 'var(--app-hover-bg)', color: 'var(--app-text-secondary)' }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </motion.button>

          {/* User avatar dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #F97316)',
                color: '#FFFFFF',
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </motion.button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease }}
                className="absolute right-0 top-12 w-56 rounded-xl border p-1.5 z-50"
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                  boxShadow: 'var(--app-shadow-card-hover)',
                }}
              >
                <div className="px-3 py-2.5 border-b mb-1" style={{ borderColor: 'var(--app-border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{displayName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-muted)' }}>{user?.email || 'user@example.com'}</p>
                </div>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                  style={{ color: 'var(--app-text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150"
                  style={{ color: '#DC2626' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================
          MAIN SCROLLABLE CONTENT
          ================================================================ */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

          {/* ================================================================
              2. GREETING SECTION
              ================================================================ */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--app-text)' }}>
                {greeting}, {displayName}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--app-text-muted)' }}>
                Here&apos;s what&apos;s happening with your business today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>Last updated: just now</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white transition-shadow duration-200"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Quick Report
              </motion.button>
            </div>
          </motion.div>

          {/* ================================================================
              3. KPI CARDS ROW
              ================================================================ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {kpiData.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  variants={staggerItem(0.06 * i)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25, ease }}
                  className="rounded-2xl p-4 md:p-5 border cursor-default"
                  style={{
                    backgroundColor: 'var(--app-card-bg)',
                    borderColor: 'var(--app-border)',
                    boxShadow: 'var(--app-shadow-card)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--app-shadow-card-hover)';
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--app-shadow-card)';
                    e.currentTarget.style.borderColor = 'var(--app-border)';
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: '#2563EB' }} />
                    </div>
                    <div
                      className="flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{
                        color: kpi.trend === 'up' ? '#059669' : '#DC2626',
                        backgroundColor: kpi.trend === 'up' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                      }}
                    >
                      {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {kpi.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--app-text)' }}>
                    {kpi.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--app-text-muted)' }}>
                    {kpi.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ================================================================
              4. ANALYTICS SECTION
              ================================================================ */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Left: Revenue Chart (3/5) */}
            <div
              className="lg:col-span-3 rounded-2xl border p-5 md:p-6"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border)',
                boxShadow: 'var(--app-shadow-card)',
              }}
            >
              <RevenueChart isDark={isDark} />
            </div>

            {/* Right: Quick Stats (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Top Channels */}
              <div
                className="rounded-2xl border p-5 flex-1"
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                  boxShadow: 'var(--app-shadow-card)',
                }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Top Channels</h3>
                <div className="space-y-3.5">
                  {topChannels.map((ch) => (
                    <div key={ch.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                          {ch.name}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                          {ch.value}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ch.value}%` }}
                          transition={{ duration: 0.8, ease, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: ch.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div
                className="rounded-2xl border p-5 flex-1"
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                  boxShadow: 'var(--app-shadow-card)',
                }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: act.dot }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--app-text-secondary)' }}>
                          {act.text}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--app-text-muted)' }}>
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================================================================
              5. DATA TABLE
              ================================================================ */}
          <motion.div variants={fadeUp}>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border)',
                boxShadow: 'var(--app-shadow-card)',
              }}
            >
              {/* Table header bar */}
              <div
                className="flex items-center justify-between px-5 md:px-6 py-4 border-b"
                style={{ borderColor: 'var(--app-border)' }}
              >
                <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>Recent Deals</h3>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-150"
                  style={{ color: '#2563EB', backgroundColor: 'rgba(37, 99, 235, 0.06)' }}
                >
                  View All <ChevronRight className="w-3 h-3" />
                </motion.button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      {['Company', 'Status', 'Revenue', 'Growth', 'Contact', ''].map((h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-medium px-5 md:px-6 py-3 whitespace-nowrap"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <motion.tr
                        key={row.company}
                        variants={staggerItem(0.05 * i)}
                        className="border-t transition-colors duration-150 cursor-default"
                        style={{ borderColor: 'var(--app-border)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className="px-5 md:px-6 py-3.5">
                          <span className="font-medium" style={{ color: 'var(--app-text)' }}>
                            {row.company}
                          </span>
                        </td>
                        <td className="px-5 md:px-6 py-3.5">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 md:px-6 py-3.5 whitespace-nowrap font-medium" style={{ color: 'var(--app-text)' }}>
                          {row.revenue}
                        </td>
                        <td className="px-5 md:px-6 py-3.5 whitespace-nowrap">
                          <span
                            className="text-xs font-medium"
                            style={{ color: row.growth.startsWith('+') ? '#059669' : '#DC2626' }}
                          >
                            {row.growth}
                          </span>
                        </td>
                        <td className="px-5 md:px-6 py-3.5 whitespace-nowrap" style={{ color: 'var(--app-text-secondary)' }}>
                          {row.contact}
                        </td>
                        <td className="px-5 md:px-6 py-3.5">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                            style={{ color: 'var(--app-text-muted)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--app-hover-bg)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* ================================================================
              6. AI INSIGHT PANEL
              ================================================================ */}
          <motion.div variants={fadeUp}>
            <div
              className="relative rounded-2xl p-[1px] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #F97316, #2563EB)',
                backgroundSize: '200% 200%',
              }}
            >
              <div
                className="rounded-2xl p-5 md:p-6"
                style={{ backgroundColor: 'var(--app-card-bg)' }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #F97316)' }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>AI Insights</h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}
                      >
                        92% confidence
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-secondary)' }}>
                      Revenue is trending 12.5% higher than last month. Your CRM pipeline has 3 high-value deals
                      ready for follow-up. Consider increasing ad spend on top-performing channels to capitalize
                      on the current momentum.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                    style={{
                      background: 'linear-gradient(135deg, #2563EB, #F97316)',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    View Full Report
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================================================================
              7. MODULE QUICK ACCESS
              ================================================================ */}
          <motion.div variants={fadeUp}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Quick Access</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {moduleTiles.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <motion.button
                    key={mod.id}
                    variants={staggerItem(0.04 * i)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease }}
                    onClick={() => {
                      if (validModules.includes(mod.id)) {
                        openModule(mod.id as 'dashboard' | 'crm' | 'erp' | 'marketing' | 'sales' | 'finance' | 'growth' | 'analytics' | 'automation' | 'settings');
                      }
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--app-card-bg)',
                      borderColor: 'var(--app-border)',
                      boxShadow: 'var(--app-shadow-card)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--app-shadow-card-hover)';
                      e.currentTarget.style.borderColor = mod.accent + '33';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--app-shadow-card)';
                      e.currentTarget.style.borderColor = 'var(--app-border)';
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mod.accent + '12' }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: mod.accent }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                      {mod.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </main>
    </motion.div>
  );
}
