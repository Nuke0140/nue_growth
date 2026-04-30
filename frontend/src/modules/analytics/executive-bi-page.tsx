'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Crown, TrendingUp, TrendingDown, Users, DollarSign, Target,
  Activity, Calendar, FileDown, Presentation, Shield,
  ArrowUpRight, ArrowDownRight, Award, Star, BarChart3,
  Building2, Zap, AlertTriangle, CheckCircle2, ChevronRight,
} from 'lucide-react';
import ChartCard from './components/chart-card';
import {
  executiveScores, quarterlyTrends, boardSummary,
} from './data/mock-data';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  excellent: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Excellent' },
  good: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Good' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Warning' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

function CircularProgress({ score, maxScore, size = 96, strokeWidth = 6, isDark }: {
  score: number; maxScore: number; size?: number; strokeWidth?: number; isDark: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = score / maxScore;
  const offset = circumference - progress * circumference;

  const color = progress >= 0.8
    ? (isDark ? 'stroke-emerald-400' : 'stroke-emerald-500')
    : progress >= 0.6
      ? (isDark ? 'stroke-amber-400' : 'stroke-amber-500')
      : (isDark ? 'stroke-red-400' : 'stroke-red-500');

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={isDark ? 'stroke-white/[0.06]' : 'stroke-black/[0.06]'}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
          {score}
        </span>
      </div>
    </div>
  );
}

export default function ExecutiveBIPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mode, setMode] = useState<'standard' | 'board'>('standard');

  const isBoardMode = mode === 'board';

  const qoqChanges = useMemo(() => {
    return quarterlyTrends.map((q, i) => {
      if (i === 0) return { revenueChange: 0, profitChange: 0, clientsChange: 0, teamChange: 0 };
      const prev = quarterlyTrends[i - 1];
      return {
        revenueChange: ((q.revenue - prev.revenue) / prev.revenue) * 100,
        profitChange: ((q.profit - prev.profit) / prev.profit) * 100,
        clientsChange: ((q.clients - prev.clients) / prev.clients) * 100,
        teamChange: ((q.team - prev.team) / prev.team) * 100,
      };
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-3xl">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Crown className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className={cn('font-bold', isBoardMode ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl')}>
                Executive BI
              </h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Board-ready business overview
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className={cn(
            'inline-flex rounded-[var(--app-radius-xl)] border p-1',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            {(['standard', 'board'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'px-4 py-2 text-xs font-semibold rounded-[var(--app-radius-lg)] transition-colors duration-200',
                  mode === m
                    ? (isDark
                        ? 'bg-white text-black shadow-[var(--app-shadow-md)]-lg shadow-[var(--app-shadow-md)]-white/10'
                        : 'bg-black text-white shadow-[var(--app-shadow-md)]-lg shadow-[var(--app-shadow-md)]-black/10')
                    : (isDark
                        ? 'text-white/50 hover:text-white/70 hover:bg-white/[0.04]'
                        : 'text-black/50 hover:text-black/70 hover:bg-black/[0.04]'),
                )}
              >
                {m === 'standard' ? 'Standard Mode' : 'Board Meeting Mode'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Business Scores ── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <h2 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-4',
            'text-[var(--app-text-muted)]',
          )}>
            Business Health Scores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {executiveScores.map((score) => {
              const status = statusConfig[score.status] || statusConfig.good;
              const isPositive = score.trend > 0;
              return (
                <motion.div
                  key={score.label}
                  variants={fadeUp}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-app-xl sm:p-6 transition-colors duration-200',
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                    isBoardMode && 'p-6 sm:p-app-3xl',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <p className={cn(
                        'text-xs font-medium uppercase tracking-wider',
                        'text-[var(--app-text-muted)]',
                      )}>
                        {score.label}
                      </p>
                      <CircularProgress
                        score={score.score}
                        maxScore={score.maxScore}
                        size={isBoardMode ? 112 : 96}
                        strokeWidth={isBoardMode ? 7 : 6}
                        isDark={isDark}
                      />
                    </div>
                    <div className="flex flex-col items-end gap-2 pt-1">
                      {/* Status badge */}
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                        status.bg, status.color,
                      )}>
                        {score.status === 'excellent' && <Star className="w-4 h-4" />}
                        {score.status === 'good' && <CheckCircle2 className="w-4 h-4" />}
                        {score.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        {status.label}
                      </span>
                      {/* Trend */}
                      <span className={cn(
                        'flex items-center gap-1 text-xs font-semibold',
                        isPositive
                          ? ('text-[var(--app-success)]')
                          : ('text-[var(--app-danger)]'),
                      )}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(score.trend)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quarterly Trend ── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <h2 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-4',
            'text-[var(--app-text-muted)]',
          )}>
            Quarterly Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quarterlyTrends.map((q, i) => {
              const changes = qoqChanges[i];
              return (
                <motion.div
                  key={q.quarter}
                  variants={fadeUp}
                  className={cn(
                    'rounded-[var(--app-radius-xl)] border p-app-xl transition-colors duration-200',
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                    i === quarterlyTrends.length - 1 && (
                      isDark ? 'ring-1 ring-violet-500/20' : 'ring-1 ring-violet-500/30'
                    ),
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      'text-sm font-bold',
                      'text-[var(--app-text)]',
                    )}>
                      {q.quarter}
                    </span>
                    {i === quarterlyTrends.length - 1 && (
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
                        isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700',
                      )}>
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Revenue', value: formatINR(q.revenue), change: changes.revenueChange },
                      { label: 'Profit', value: formatINR(q.profit), change: changes.profitChange },
                      { label: 'Clients', value: `${q.clients}`, change: changes.clientsChange },
                      { label: 'Team', value: `${q.team}`, change: changes.teamChange },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                          {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                            {metric.value}
                          </span>
                          {i > 0 && (
                            <span className={cn(
                              'flex items-center gap-0.5 text-[10px] font-semibold',
                              metric.change >= 0
                                ? ('text-[var(--app-success)]')
                                : ('text-[var(--app-danger)]'),
                            )}>
                              {metric.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              {Math.abs(metric.change).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Board Summary Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-6 sm:p-app-3xl',
            isDark
              ? 'bg-white/[0.03] border-white/[0.06]'
              : 'bg-black/[0.02] border-black/[0.06]',
            isBoardMode && 'p-app-3xl sm:p-app-4xl',
          )}
        >
          <div className="flex items-center gap-3 mb-app-2xl">
            <div className={cn(
              'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              isDark ? 'bg-violet-500/15' : 'bg-violet-100',
            )}>
              <Award className={cn('w-4 h-4', 'text-[var(--app-purple)]')} />
            </div>
            <div>
              <h2 className={cn(
                'font-bold',
                isBoardMode ? 'text-xl' : 'text-lg',
                'text-[var(--app-text)]',
              )}>
                Board Summary — FY 2024
              </h2>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Annual performance overview for board review
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-app-2xl mb-app-3xl">
            {[
              { label: 'Total Revenue', value: formatINR(boardSummary.totalRevenue), icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Total Profit', value: formatINR(boardSummary.totalProfit), icon: TrendingUp, color: 'text-blue-400' },
              { label: 'Total Clients', value: `${boardSummary.totalClients}`, icon: Users, color: 'text-violet-400' },
              { label: 'Team Size', value: `${boardSummary.teamSize}`, icon: Building2, color: 'text-amber-400' },
            ].map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <m.icon className={cn('w-4 h-4', m.color)} />
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                    {m.label}
                  </span>
                </div>
                <p className={cn(
                  'font-bold tracking-tight',
                  isBoardMode ? 'text-3xl' : 'text-2xl',
                  'text-[var(--app-text)]',
                )}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-app-3xl">
            {[
              { label: 'YoY Growth', value: `${boardSummary.yoyGrowth}%`, positive: true },
              { label: 'Client Retention', value: `${boardSummary.clientRetention}%`, positive: true },
              { label: 'NPS Score', value: `${boardSummary.npsScore}`, positive: boardSummary.npsScore >= 50 },
            ].map((m) => (
              <div key={m.label} className={cn(
                'rounded-[var(--app-radius-lg)] p-4',
                'bg-[var(--app-hover-bg)]',
              )}>
                <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
                  {m.label}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    'text-xl font-bold',
                    m.positive ? ('text-[var(--app-success)]') : ('text-[var(--app-warning)]'),
                  )}>
                    {m.value}
                  </span>
                  {m.positive && <ArrowUpRight className={cn('w-4 h-4', 'text-[var(--app-success)]')} />}
                </div>
              </div>
            ))}
          </div>

          {/* Top Achievement */}
          <div className={cn(
            'rounded-[var(--app-radius-lg)] p-4 flex items-start gap-3',
            isDark ? 'bg-violet-500/[0.06] border border-violet-500/10' : 'bg-violet-50 border border-violet-200',
          )}>
            <Award className={cn('w-5 h-5 shrink-0 mt-0.5', 'text-[var(--app-purple)]')} />
            <div>
              <p className={cn('text-[10px] uppercase tracking-wider font-semibold mb-1', isDark ? 'text-violet-300/60' : 'text-violet-600')}>
                Top Achievement
              </p>
              <p className={cn('text-sm font-medium leading-relaxed', 'text-[var(--app-text)]')}>
                {boardSummary.topAchievement}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Presentation-Ready Section ── */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <h2 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-4',
            'text-[var(--app-text-muted)]',
          )}>
            Presentation Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Q4 2024 Highlights',
                description: 'Revenue grew to ₹1.34Cr with 12.3% QoQ increase. Added 4 new enterprise clients including Razorpay annual retainer. Team expanded to 44 members.',
                icon: Star,
                metrics: [
                  { label: 'Revenue', value: '₹1.34Cr' },
                  { label: 'New Clients', value: '4' },
                  { label: 'Team Growth', value: '+4' },
                ],
              },
              {
                title: 'YoY Growth Summary',
                description: `Overall business grew ${boardSummary.yoyGrowth}% year-over-year. Revenue crossed ₹4.8Cr milestone with strong client retention at ${boardSummary.clientRetention}%.`,
                icon: TrendingUp,
                metrics: [
                  { label: 'YoY Growth', value: `${boardSummary.yoyGrowth}%` },
                  { label: 'Revenue', value: '₹4.88Cr' },
                  { label: 'Retention', value: `${boardSummary.clientRetention}%` },
                ],
              },
              {
                title: 'Risk Assessment',
                description: 'Cash runway at 8.5 months requires attention. 3 mid-market clients flagged for churn risk. Engineering payroll running 14% over budget due to new hires.',
                icon: Shield,
                metrics: [
                  { label: 'Runway', value: '8.5 mo' },
                  { label: 'At-Risk Clients', value: '3' },
                  { label: 'Payroll Over', value: '14%' },
                ],
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-xl sm:p-6 transition-colors duration-200',
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                    : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                  <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    {card.title}
                  </h3>
                </div>
                <p className={cn('text-xs leading-relaxed mb-4', 'text-[var(--app-text-muted)]')}>
                  {card.description}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {card.metrics.map((m) => (
                    <div key={m.label} className={cn('rounded-[var(--app-radius-lg)] p-2 text-center', 'bg-[var(--app-hover-bg)]')}>
                      <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>{m.value}</p>
                      <p className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Export Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border p-app-xl',
            isDark
              ? 'bg-white/[0.03] border-white/[0.06]'
              : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                Export Board Pack
              </h3>
              <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                Download presentation-ready reports for the board meeting
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-[var(--app-radius-lg)] transition-colors duration-200',
                isDark
                  ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white'
                  : 'bg-black/[0.04] text-black/70 hover:bg-black/[0.08] hover:text-black',
              )}>
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
              <button className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-[var(--app-radius-lg)] transition-colors duration-200',
                isDark
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-black text-white hover:bg-black/90',
              )}>
                <Presentation className="w-4 h-4" />
                Export PPT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
