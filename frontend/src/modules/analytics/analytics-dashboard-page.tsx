'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Users, CheckCircle, IndianRupee, TrendingUp, DollarSign, UserMinus,
  Clock, Zap, Shield, Heart, Calendar, Filter, ChevronDown,
  CircleAlert, AlertTriangle, AlertCircle, BarChart3, Target,
  Activity, PieChart, ArrowDownRight,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import ChartCard from './components/chart-card';
import FilterChip from './components/filter-chip';
import {
  masterKPIs, growthTrend, revenueTrend, funnelConversion, sourceMix,
  retentionCurve, marginTrend, productivityChart, dashboardAlerts,
} from './data/mock-data';

const iconMap: Record<string, React.ElementType> = {
  Users, CheckCircle, IndianRupee, TrendingUp, DollarSign, UserMinus,
  Clock, Zap, Shield, Heart,
};

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  critical: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-l-red-500' },
  high: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-l-amber-500' },
  medium: { icon: AlertCircle, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-l-sky-500' },
  low: { icon: AlertCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-l-emerald-500' },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
};

export default function AnalyticsDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('All Channels');

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  const maxLeads = useMemo(() => Math.max(...growthTrend.map((d) => d.leads)), []);
  const maxRevenue = useMemo(() => Math.max(...growthTrend.map((d) => d.revenue)), []);
  const maxRevTrend = useMemo(() => Math.max(...revenueTrend.map((d) => Math.max(d.revenue, d.target))), []);
  const funnelMax = useMemo(() => Math.max(...funnelConversion.map((d) => d.value)), []);
  const sourceMax = useMemo(() => Math.max(...sourceMix.map((d) => d.percentage)), []);
  const retentionMax = 100;
  const marginMax = 40;
  const productivityMax = 95;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
            )}>
              <BarChart3 className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Analytics Dashboard</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Real-time business intelligence cockpit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50',
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </span>
          </div>
        </div>

        {/* ── Sticky Filter Bar ── */}
        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 backdrop-blur-xl border-b"
          style={{ backgroundColor: isDark ? 'rgba(9,9,11,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <div className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shrink-0 cursor-pointer',
              isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.08]' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.06]',
            )}>
              <Calendar className="w-3.5 h-3.5" />
              Last 12 Months
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="w-px h-6 shrink-0" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <Filter className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
            {['All Channels', 'This Quarter', 'India', 'Google Ads', 'LinkedIn'].map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {masterKPIs.map((kpi) => (
            <motion.div key={kpi.id} variants={fadeUp}>
              <KPICard
                label={kpi.label}
                value={kpi.formattedValue}
                change={kpi.change}
                changeLabel={kpi.changeLabel}
                icon={iconMap[kpi.icon]}
                severity={kpi.severity || 'normal'}
                trend={kpi.trend}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Charts Row: Growth Trend + Revenue Trend ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Growth Trend — CSS Bar Chart */}
          <ChartCard title="Growth Trend" subtitle="Monthly leads vs revenue">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-blue-500/50' : 'bg-blue-500')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Leads (×100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-emerald-500/50' : 'bg-emerald-500')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Revenue</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-48">
                {growthTrend.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="flex gap-0.5 w-full items-end h-40">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.leads / maxLeads) * 100}%` }}
                        transition={{ delay: 0.1 + i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'flex-1 rounded-t-sm transition-opacity group-hover:opacity-80 cursor-pointer min-h-[4px]',
                          isDark ? 'bg-blue-500/40' : 'bg-blue-400',
                        )}
                        title={`Leads: ${d.leads.toLocaleString()}`}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                        transition={{ delay: 0.15 + i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'flex-1 rounded-t-sm transition-opacity group-hover:opacity-80 cursor-pointer min-h-[4px]',
                          isDark ? 'bg-emerald-500/40' : 'bg-emerald-400',
                        )}
                        title={`Revenue: ₹${(d.revenue / 100000).toFixed(0)}L`}
                      />
                    </div>
                    <span className={cn('text-[9px]', isDark ? 'text-white/30' : 'text-black/30')}>
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Revenue Trend — CSS dot + gradient line */}
          <ChartCard title="Revenue Trend" subtitle="Revenue vs target">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-full', isDark ? 'bg-violet-400' : 'bg-violet-500')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-full border-2 border-dashed', isDark ? 'border-white/30' : 'border-black/30')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Target</span>
                </div>
              </div>
              <div className="relative h-48">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className={cn('absolute left-0 right-0 border-t border-dashed', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}
                    style={{ bottom: `${pct}%` }}
                  />
                ))}
                {/* Target dashed line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    points={revenueTrend.map((d, i) => {
                      const x = (i / (revenueTrend.length - 1)) * 100;
                      const y = 100 - (d.target / maxRevTrend) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                  />
                  {/* Revenue gradient area */}
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.25)'} />
                      <stop offset="100%" stopColor={isDark ? 'rgba(139,92,246,0)' : 'rgba(139,92,246,0)'} />
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#revGrad)"
                    points={
                      revenueTrend.map((d, i) => {
                        const x = (i / (revenueTrend.length - 1)) * 100;
                        const y = 100 - (d.revenue / maxRevTrend) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ') +
                      ` 100%,100% 0%,100%`
                    }
                  />
                </svg>
                {/* Revenue dots */}
                <div className="relative z-10 h-full">
                  {revenueTrend.map((d, i) => {
                    const x = (i / (revenueTrend.length - 1)) * 100;
                    const y = 100 - (d.revenue / maxRevTrend) * 100;
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
                        className={cn(
                          'absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer',
                          isDark ? 'bg-violet-400 shadow-lg shadow-violet-500/30' : 'bg-violet-500 shadow-lg shadow-violet-500/20',
                        )}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        title={`${d.month}: ₹${(d.revenue / 100000).toFixed(0)}L`}
                      />
                    );
                  })}
                </div>
                {/* Labels */}
                <div className="absolute inset-x-0 bottom-0 flex">
                  {revenueTrend.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className={cn('text-[9px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        {d.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── Middle Row: Funnel + Source Mix + Retention ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Funnel Conversion */}
          <ChartCard title="Funnel Conversion" subtitle="Lead to purchase drop-off">
            <div className="h-full flex flex-col justify-center gap-2 py-4">
              {funnelConversion.map((stage, i) => {
                const widthPct = (stage.value / funnelMax) * 100;
                const colors = [
                  isDark ? 'bg-blue-500/40' : 'bg-blue-400',
                  isDark ? 'bg-violet-500/40' : 'bg-violet-400',
                  isDark ? 'bg-amber-500/40' : 'bg-amber-400',
                  isDark ? 'bg-orange-500/40' : 'bg-orange-400',
                  isDark ? 'bg-emerald-500/40' : 'bg-emerald-400',
                ];
                return (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn('font-medium', isDark ? 'text-white/70' : 'text-black/70')}>
                        {stage.stage}
                      </span>
                      <span className={cn('font-semibold', isDark ? 'text-white/90' : 'text-black/90')}>
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                    <div className={cn('h-8 rounded-lg flex items-center justify-center relative overflow-hidden', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={cn('absolute inset-y-0 left-0 rounded-lg', colors[i])}
                      />
                      <span className={cn('relative z-10 text-[10px] font-semibold', isDark ? 'text-white' : 'text-white')}>
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                    {stage.dropRate > 0 && (
                      <div className="flex justify-center">
                        <span className={cn(
                          'flex items-center gap-1 text-[10px]',
                          isDark ? 'text-red-400/70' : 'text-red-500',
                        )}>
                          <ArrowDownRight className="w-3 h-3" />
                          -{stage.dropRate}% drop-off
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ChartCard>

          {/* Source Mix — Horizontal Bar Chart */}
          <ChartCard title="Source Mix" subtitle="Lead distribution by channel">
            <div className="h-full flex flex-col justify-center gap-3 py-4">
              {sourceMix.map((src, i) => (
                <motion.div
                  key={src.source}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.15 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cn('font-medium truncate', isDark ? 'text-white/70' : 'text-black/70')}>
                      {src.source}
                    </span>
                    <span className={cn('font-semibold shrink-0 ml-2', isDark ? 'text-white/90' : 'text-black/90')}>
                      {src.percentage}% ({src.leads.toLocaleString()})
                    </span>
                  </div>
                  <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(src.percentage / sourceMax) * 100}%` }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'h-full rounded-full',
                        i === 0 ? (isDark ? 'bg-blue-500/50' : 'bg-blue-400') :
                        i === 1 ? (isDark ? 'bg-violet-500/50' : 'bg-violet-400') :
                        i === 2 ? (isDark ? 'bg-emerald-500/50' : 'bg-emerald-400') :
                        i === 3 ? (isDark ? 'bg-amber-500/50' : 'bg-amber-400') :
                        i === 4 ? (isDark ? 'bg-sky-500/50' : 'bg-sky-400') :
                        (isDark ? 'bg-pink-500/50' : 'bg-pink-400'),
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Retention Curve — CSS Area Chart */}
          <ChartCard title="Retention Curve" subtitle="12-month cohort retention">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="relative h-44">
                {/* Y-axis labels */}
                <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[9px] pr-2" style={{ width: '32px' }}>
                  {[100, 75, 50, 25, 0].map((v) => (
                    <span key={v} className={cn(isDark ? 'text-white/25' : 'text-black/25')}>
                      {v}%
                    </span>
                  ))}
                </div>
                <div className="ml-8 h-full relative">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <div
                      key={pct}
                      className={cn('absolute left-0 right-0 border-t border-dashed', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isDark ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.25)'} />
                        <stop offset="100%" stopColor={isDark ? 'rgba(14,165,233,0)' : 'rgba(14,165,233,0)'} />
                      </linearGradient>
                    </defs>
                    <polygon
                      fill="url(#retGrad)"
                      points={
                        retentionCurve.map((d, i) => {
                          const x = (i / (retentionCurve.length - 1)) * 100;
                          const y = 100 - (d.retention / retentionMax) * 100;
                          return `${x}%,${y}%`;
                        }).join(' ') +
                        ` 100%,100% 0%,100%`
                      }
                    />
                  </svg>
                  {/* Dots */}
                  <div className="relative z-10 h-full">
                    {retentionCurve.map((d, i) => {
                      const x = (i / (retentionCurve.length - 1)) * 100;
                      const y = 100 - (d.retention / retentionMax) * 100;
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.15 + i * 0.04, duration: 0.25 }}
                          className={cn(
                            'absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2',
                            isDark ? 'bg-sky-400' : 'bg-sky-500',
                          )}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          title={`Month ${d.month}: ${d.retention}%`}
                        />
                      );
                    })}
                  </div>
                  {/* X labels */}
                  <div className="absolute inset-x-0 bottom-0 flex">
                    {retentionCurve.map((d, i) => (
                      <div key={i} className="flex-1 text-center">
                        <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
                          M{d.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── Bottom Row: Margin Trend + Productivity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Margin Trend — Sparkline Bars */}
          <ChartCard title="Margin Trend" subtitle="Net margin % over 12 months">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="flex items-end gap-2 h-40">
                {marginTrend.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className={cn(
                      'text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity',
                      isDark ? 'text-white/50' : 'text-black/50',
                    )}>
                      {d.margin}%
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.margin / marginMax) * 100}%` }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'w-full rounded-t-sm cursor-pointer min-h-[4px]',
                        isDark ? 'bg-amber-500/40 hover:bg-amber-500/60' : 'bg-amber-400 hover:bg-amber-500',
                        'transition-colors',
                      )}
                    />
                    <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Productivity Chart — Bars with Target Line */}
          <ChartCard title="Productivity Chart" subtitle="Weekly score vs 85% target">
            <div className="h-full flex flex-col justify-end pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', isDark ? 'bg-emerald-500/50' : 'bg-emerald-400')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-4 h-0 border-t-2 border-dashed', isDark ? 'border-red-400/60' : 'border-red-400')} />
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Target (85%)</span>
                </div>
              </div>
              <div className="relative flex items-end gap-2 h-40">
                {/* Target line */}
                <div
                  className={cn(
                    'absolute left-0 right-0 border-t-2 border-dashed z-10',
                    isDark ? 'border-red-400/50' : 'border-red-400',
                  )}
                  style={{ bottom: `${(85 / productivityMax) * 100}%` }}
                />
                <span className={cn(
                  'absolute right-0 text-[9px] font-medium z-10 -translate-y-1/2',
                  isDark ? 'text-red-400/60' : 'text-red-400',
                )}
                  style={{ bottom: `${(85 / productivityMax) * 100}%` }}
                >
                  85%
                </span>
                {productivityChart.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className={cn(
                      'text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity',
                      isDark ? 'text-white/50' : 'text-black/50',
                    )}>
                      {d.score}%
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.score / productivityMax) * 100}%` }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'w-full rounded-t-sm min-h-[4px] transition-colors cursor-pointer',
                        d.score >= d.target
                          ? (isDark ? 'bg-emerald-500/40 hover:bg-emerald-500/60' : 'bg-emerald-400 hover:bg-emerald-500')
                          : (isDark ? 'bg-red-500/40 hover:bg-red-500/60' : 'bg-red-400 hover:bg-red-500'),
                      )}
                    />
                    <span className={cn('text-[8px] truncate max-w-full', isDark ? 'text-white/25' : 'text-black/25')}>
                      {d.week.replace('Week ', 'W')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── Alerts Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={cn('w-4 h-4 text-amber-400')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Active Alerts
            </span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
            )}>
              {dashboardAlerts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboardAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity] || severityConfig.low;
              const AlertIcon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border-l-4 shadow-sm cursor-pointer transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-black/[0.02] border border-black/[0.06] hover:bg-black/[0.04]',
                    config.border,
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <AlertIcon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{alert.title}</p>
                    </div>
                    <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
                      {alert.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
