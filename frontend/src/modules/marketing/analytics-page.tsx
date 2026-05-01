'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Funnel as FunnelIcon,
  FlaskConical,
  Megaphone,
  Trophy,
  CheckCircle2,
  Play,
  Pause,
  Crown,
  ExternalLink,
  MousePointerClick,
  Eye,
  Users,
  Zap,
} from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import {
  marketingDashboardStats,
  mockAttributionChannels,
  mockFunnels,
  mockABTests,
  mockAdCampaigns,
} from '@/modules/marketing/data/mock-data';
import type {
  AttributionChannel,
  Funnel,
  ABTest,
  AdCampaign,
} from '@/modules/marketing/types';

// ── INR Formatter ──────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

// ── Number Formatter ───────────────────────────────────

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
}

// ── Platform Icon Map ──────────────────────────────────

const platformIcons: Record<string, React.ElementType> = {
  google: Target,
  meta: Megaphone,
  linkedin: Users,
  youtube: Play,
  tiktok: Zap,
};

const platformColors: Record<string, string> = {
  google: '#ea4335',
  meta: '#1877f2',
  linkedin: '#0a66c2',
  youtube: '#ff0000',
  tiktok: '#000000',
};

// ── ROAS Color Helper ──────────────────────────────────

function getRoasColor(roas: number, isDark: boolean): string {
  if (roas > 5) return isDark ? 'text-emerald-400' : 'text-emerald-600';
  if (roas >= 3) return isDark ? 'text-amber-400' : 'text-amber-600';
  return isDark ? 'text-red-400' : 'text-red-600';
}

function getRoasBg(roas: number, isDark: boolean): string {
  if (roas > 5) return isDark ? 'bg-emerald-500/10' : 'bg-emerald-50';
  if (roas >= 3) return isDark ? 'bg-amber-500/10' : 'bg-amber-50';
  return isDark ? 'bg-red-500/10' : 'bg-red-50';
}

// ── A/B Test Status Badge ──────────────────────────────

function getABStatusStyle(status: ABTest['status'], isDark: boolean) {
  switch (status) {
    case 'running':
      return isDark
        ? 'bg-sky-500/15 text-sky-400'
        : 'bg-sky-50 text-sky-600';
    case 'completed':
      return isDark
        ? 'bg-emerald-500/15 text-emerald-400'
        : 'bg-emerald-50 text-emerald-600';
    case 'draft':
      return isDark
        ? 'bg-white/[0.06] text-white/40'
        : 'bg-black/[0.06] text-black/40';
    default:
      return isDark
        ? 'bg-white/[0.06] text-white/40'
        : 'bg-black/[0.06] text-black/40';
  }
}

function getABTypeBadge(type: ABTest['type'], isDark: boolean) {
  switch (type) {
    case 'cta':
      return isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600';
    case 'subject-line':
      return isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600';
    case 'creative':
      return isDark ? 'bg-pink-500/15 text-pink-400' : 'bg-pink-50 text-pink-600';
    case 'landing-page':
      return isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600';
    case 'email':
      return isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
    default:
      return isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40';
  }
}

// ── Main Component ─────────────────────────────────────

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Easing ─────────────────────────────────────────
  const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const staggerDelay = 0.04;

  // ── Derived Data ───────────────────────────────────

  // Total Revenue from attribution channels
  const totalRevenue = useMemo(
    () => mockAttributionChannels.reduce((sum, ch) => sum + ch.revenue, 0),
    [],
  );

  // KPI cards
  const kpiCards = useMemo(
    () => [
      {
        label: 'Total Revenue',
        value: formatINR(totalRevenue),
        icon: DollarSign,
        iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
        iconColor: 'text-emerald-400',
        change: 12.4,
        changeLabel: 'vs last month',
      },
      {
        label: 'ROAS',
        value: `${marketingDashboardStats.roas}x`,
        icon: TrendingUp,
        iconBg: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
        iconColor: 'text-sky-400',
        change: 8.2,
        changeLabel: 'return on ad spend',
      },
      {
        label: 'CAC',
        value: `₹${marketingDashboardStats.cac.toLocaleString('en-IN')}`,
        icon: Users,
        iconBg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
        iconColor: 'text-amber-400',
        change: -3.8,
        changeLabel: 'customer acquisition cost',
      },
      {
        label: 'Campaign ROI',
        value: `${marketingDashboardStats.campaignROI}%`,
        icon: BarChart3,
        iconBg: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
        iconColor: 'text-violet-400',
        change: 22.1,
        changeLabel: 'across all campaigns',
      },
    ],
    [isDark, totalRevenue],
  );

  return (
    <PageShell
      title="Analytics"
      subtitle="Revenue-focused performance insights"
      icon={BarChart3}
    >
      <div className="space-y-6">
        {/* ── 1. REVENUE KPI ROW ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => {
            const isPositive = card.change > 0;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * staggerDelay, duration: 0.15, ease: baseEase }}
                className={cn(
                  'rounded-2xl border p-5 transition-all duration-200 group',
                  isDark
                    ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    : 'bg-white border-black/[0.06] hover:bg-black/[0.02]',
                )}
              >
                {/* Top row: label + icon */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      'text-[11px] font-medium uppercase tracking-wider',
                      isDark ? 'text-white/40' : 'text-black/40',
                    )}
                  >
                    {card.label}
                  </span>
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
                      card.iconBg,
                    )}
                  >
                    <card.icon className={cn('w-4.5 h-4.5', card.iconColor)} />
                  </div>
                </div>

                {/* Value + change */}
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-[11px] font-semibold',
                      isPositive ? 'text-emerald-500' : 'text-red-500',
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                </div>

                {/* Sub-label */}
                <p className={cn('text-[11px] mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                  {card.changeLabel}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── 2. CHANNEL ATTRIBUTION SECTION ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.15, ease: baseEase }}
          className={cn(
            'rounded-2xl border p-5',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target
                className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
              />
              <span
                className={cn(
                  'text-sm font-semibold',
                  isDark ? 'text-white/70' : 'text-black/70',
                )}
              >
                Channel Attribution
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] px-2 py-0.5',
                  isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
                )}
              >
                {mockAttributionChannels.length} channels
              </Badge>
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                isDark ? 'text-white/40' : 'text-black/40',
              )}
            >
              Total: {formatINR(totalRevenue)}
            </span>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="space-y-4">
            {mockAttributionChannels.map((channel: AttributionChannel, i: number) => (
              <motion.div
                key={channel.channel}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.15, ease: baseEase }}
                className="group/channel"
              >
                {/* Channel header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isDark ? 'text-white/70' : 'text-black/70',
                      )}
                    >
                      {channel.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'text-[11px]',
                        isDark ? 'text-white/40' : 'text-black/40',
                      )}
                    >
                      {formatINR(channel.revenue)}
                    </span>
                    <span
                      className="text-[11px] font-semibold min-w-[40px] text-right"
                      style={{ color: channel.color }}
                    >
                      {channel.contribution}%
                    </span>
                    <span
                      className={cn(
                        'text-[11px] min-w-[60px] text-right',
                        isDark ? 'text-white/30' : 'text-black/30',
                      )}
                    >
                      {formatNumber(channel.conversions)} conv.
                    </span>
                  </div>
                </div>

                {/* Animated bar */}
                <div
                  className={cn(
                    'w-full h-2.5 rounded-full overflow-hidden',
                    isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]',
                  )}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${channel.contribution}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.15, ease: baseEase }}
                    className="h-full rounded-full transition-all duration-200 group-hover/channel:brightness-125"
                    style={{ backgroundColor: channel.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 3. FUNNEL ANALYSIS ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.15, ease: baseEase }}
          className={cn(
            'rounded-2xl border p-5',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <FunnelIcon
              className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
            />
            <span
              className={cn(
                'text-sm font-semibold',
                isDark ? 'text-white/70' : 'text-black/70',
              )}
            >
              Funnel Analysis
            </span>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] px-2 py-0.5',
                isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
              )}
            >
              {mockFunnels.length} funnels
            </Badge>
          </div>

          {/* Funnels */}
          <div className="space-y-6">
            {mockFunnels.map((funnel: Funnel, fi: number) => {
              const maxVisitors = funnel.steps[0]?.visitors || 1;
              return (
                <motion.div
                  key={funnel.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + fi * 0.1, duration: 0.15, ease: baseEase }}
                >
                  {/* Funnel header */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isDark ? 'text-white/70' : 'text-black/70',
                      )}
                    >
                      {funnel.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'text-[11px]',
                          isDark ? 'text-white/30' : 'text-black/30',
                        )}
                      >
                        Revenue: {formatINR(funnel.totalRevenue)}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] px-2 py-0.5 font-semibold',
                          isDark
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-emerald-50 text-emerald-600',
                        )}
                      >
                        {funnel.conversionRate}% CVR
                      </Badge>
                    </div>
                  </div>

                  {/* Horizontal funnel steps */}
                  <div className="flex items-stretch gap-0.5">
                    {funnel.steps.map((step, si) => {
                      const widthPct = Math.max(
                        (step.visitors / maxVisitors) * 100,
                        12,
                      );
                      const dropOffColor =
                        step.dropOff === 0
                          ? isDark
                            ? 'text-white/20'
                            : 'text-black/20'
                          : step.dropOff > 70
                            ? 'text-red-400'
                            : step.dropOff > 40
                              ? 'text-amber-400'
                              : isDark
                                ? 'text-white/40'
                                : 'text-black/40';

                      return (
                        <div
                          key={step.id}
                          className="flex-1 flex flex-col items-center group/step"
                          style={{ minWidth: `${widthPct * 0.6}%`, maxWidth: `${Math.max(widthPct, 20)}%` }}
                        >
                          {/* Step trapezoid */}
                          <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                              delay: 0.5 + fi * 0.1 + si * 0.06,
                              duration: 0.15,
                              ease: baseEase,
                            }}
                            className={cn(
                              'w-full rounded-lg py-2.5 px-2 text-center transition-all duration-200',
                              isDark
                                ? 'bg-white/[0.04] border border-white/[0.06] group-hover/step:bg-white/[0.07]'
                                : 'bg-black/[0.03] border border-black/[0.06] group-hover/step:bg-black/[0.06]',
                            )}
                          >
                            {/* Step name */}
                            <p
                              className={cn(
                                'text-[10px] font-semibold truncate',
                                isDark ? 'text-white/60' : 'text-black/60',
                              )}
                            >
                              {step.name}
                            </p>
                            {/* Visitors */}
                            <p
                              className={cn(
                                'text-xs font-bold mt-0.5',
                                isDark ? 'text-white/90' : 'text-black/90',
                              )}
                            >
                              {formatNumber(step.visitors)}
                            </p>
                          </motion.div>

                          {/* Drop-off below */}
                          <div className="mt-1.5 text-center">
                            {step.dropOff > 0 ? (
                              <span
                                className={cn(
                                  'text-[9px] font-medium',
                                  dropOffColor,
                                )}
                              >
                                -{step.dropOff}% drop
                              </span>
                            ) : (
                              <span
                                className={cn(
                                  'text-[9px]',
                                  isDark ? 'text-white/15' : 'text-black/15',
                                )}
                              >
                                entry
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── 4. A/B TESTS SUMMARY ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15, ease: baseEase }}
          className={cn(
            'rounded-2xl border p-5',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical
              className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
            />
            <span
              className={cn(
                'text-sm font-semibold',
                isDark ? 'text-white/70' : 'text-black/70',
              )}
            >
              A/B Tests
            </span>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] px-2 py-0.5',
                isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
              )}
            >
              {mockABTests.length} tests
            </Badge>
          </div>

          {/* Test cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockABTests.map((test: ABTest, i: number) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.06, duration: 0.15, ease: baseEase }}
                className={cn(
                  'rounded-xl border p-4 transition-all duration-200',
                  isDark
                    ? 'border-white/[0.06] hover:bg-white/[0.03]'
                    : 'border-black/[0.06] hover:bg-black/[0.02]',
                )}
              >
                {/* Test name + badges */}
                <div className="mb-3">
                  <p
                    className={cn(
                      'text-sm font-medium mb-2 line-clamp-2',
                      isDark ? 'text-white/90' : 'text-black/90',
                    )}
                  >
                    {test.name}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={cn('text-[9px] px-1.5 py-0 capitalize', getABTypeBadge(test.type, isDark))}
                    >
                      {test.type}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn('text-[9px] px-1.5 py-0 capitalize', getABStatusStyle(test.status, isDark))}
                    >
                      {test.status === 'running' && <Play className="w-2.5 h-2.5 mr-0.5" />}
                      {test.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />}
                      {test.status === 'draft' && <Pause className="w-2.5 h-2.5 mr-0.5" />}
                      {test.status}
                    </Badge>
                  </div>
                </div>

                {/* Variants */}
                <div className="space-y-2 mb-3">
                  {test.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-3 py-2',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                        variant.isWinner && (isDark ? 'ring-1 ring-emerald-500/30' : 'ring-1 ring-emerald-300'),
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {variant.isWinner && (
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                        )}
                        <span
                          className={cn(
                            'text-[11px] truncate',
                            isDark ? 'text-white/50' : 'text-black/50',
                          )}
                        >
                          {variant.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'text-[11px] font-semibold shrink-0 ml-2',
                          variant.isWinner
                            ? 'text-emerald-400'
                            : isDark
                              ? 'text-white/40'
                              : 'text-black/40',
                        )}
                      >
                        {variant.conversionRate}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between pt-2 border-t border-dashed"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[10px]',
                        isDark ? 'text-white/30' : 'text-black/30',
                      )}
                    >
                      Confidence:
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold',
                        test.confidence >= 95
                          ? 'text-emerald-400'
                          : test.confidence >= 90
                            ? 'text-amber-400'
                            : isDark
                              ? 'text-white/50'
                              : 'text-black/50',
                      )}
                    >
                      {test.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[10px]',
                        isDark ? 'text-white/30' : 'text-black/30',
                      )}
                    >
                      Lift:
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      +{test.improvement}%
                    </span>
                  </div>
                  {test.winner && (
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-semibold text-amber-400">
                        Winner
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 5. AD PERFORMANCE ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.15, ease: baseEase }}
          className={cn(
            'rounded-2xl border p-5',
            isDark
              ? 'bg-white/[0.02] border-white/[0.06]'
              : 'bg-white border-black/[0.06]',
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <Megaphone
              className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')}
            />
            <span
              className={cn(
                'text-sm font-semibold',
                isDark ? 'text-white/70' : 'text-black/70',
              )}
            >
              Ad Performance
            </span>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] px-2 py-0.5',
                isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40',
              )}
            >
              {mockAdCampaigns.length} campaigns
            </Badge>
          </div>

          {/* Desktop: Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    'text-[11px] font-medium uppercase tracking-wider',
                    isDark ? 'text-white/30' : 'text-black/30',
                  )}
                >
                  <th className="text-left pb-3 pr-4">Campaign</th>
                  <th className="text-right pb-3 pr-4">Spend</th>
                  <th className="text-right pb-3 pr-4">Clicks</th>
                  <th className="text-right pb-3 pr-4">Impressions</th>
                  <th className="text-right pb-3 pr-4">CPC</th>
                  <th className="text-right pb-3 pr-4">CPL</th>
                  <th className="text-right pb-3 pr-4">ROAS</th>
                  <th className="text-right pb-3">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {mockAdCampaigns.map((ad: AdCampaign, i: number) => {
                  const PlatformIcon = platformIcons[ad.platform] || Megaphone;
                  const platformColor = platformColors[ad.platform] || (isDark ? '#ffffff' : '#000000');
                  return (
                    <motion.tr
                      key={ad.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.7 + i * 0.05,
                        duration: 0.3,
                        ease: baseEase,
                      }}
                      className={cn(
                        'transition-colors group/row',
                        isDark
                          ? 'hover:bg-white/[0.03] border-t border-white/[0.04]'
                          : 'hover:bg-black/[0.02] border-t border-black/[0.04]',
                      )}
                    >
                      {/* Campaign name */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]',
                            )}
                          >
                            <PlatformIcon
                              className="w-4 h-4"
                              style={{ color: platformColor }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={cn(
                                'text-sm font-medium truncate max-w-[220px]',
                                isDark ? 'group-hover/row:text-white' : 'group-hover/row:text-black',
                              )}
                            >
                              {ad.name}
                            </p>
                            <p
                              className={cn(
                                'text-[11px] capitalize',
                                isDark ? 'text-white/30' : 'text-black/30',
                              )}
                            >
                              {ad.platform}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Spend */}
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        {formatINR(ad.spend)}
                      </td>

                      {/* Clicks */}
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        {formatNumber(ad.clicks)}
                      </td>

                      {/* Impressions */}
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        {formatNumber(ad.impressions)}
                      </td>

                      {/* CPC */}
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        ₹{ad.cpc.toFixed(2)}
                      </td>

                      {/* CPL */}
                      <td
                        className={cn(
                          'py-3 pr-4 text-sm text-right',
                          isDark ? 'text-white/60' : 'text-black/60',
                        )}
                      >
                        ₹{ad.cpl.toLocaleString('en-IN')}
                      </td>

                      {/* ROAS - color-coded */}
                      <td className="py-3 pr-4 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold',
                            getRoasBg(ad.roas, isDark),
                            getRoasColor(ad.roas, isDark),
                          )}
                        >
                          {ad.roas}x
                        </span>
                      </td>

                      {/* Conversions */}
                      <td
                        className={cn(
                          'py-3 text-sm font-medium text-right',
                          isDark ? 'text-white/80' : 'text-black/80',
                        )}
                      >
                        {ad.conversions.toLocaleString('en-IN')}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card View */}
          <div className="md:hidden space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {mockAdCampaigns.map((ad: AdCampaign, i: number) => {
              const PlatformIcon = platformIcons[ad.platform] || Megaphone;
              const platformColor = platformColors[ad.platform] || (isDark ? '#ffffff' : '#000000');
              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.7 + i * 0.06,
                    duration: 0.3,
                    ease: baseEase,
                  }}
                  className={cn(
                    'rounded-xl border p-4',
                    isDark
                      ? 'border-white/[0.06] bg-white/[0.02]'
                      : 'border-black/[0.06] bg-white',
                  )}
                >
                  {/* Top row: platform + name + ROAS */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]',
                        )}
                      >
                        <PlatformIcon
                          className="w-4 h-4"
                          style={{ color: platformColor }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            'text-sm font-medium truncate',
                            isDark ? 'text-white/90' : 'text-black/90',
                          )}
                        >
                          {ad.name}
                        </p>
                        <p
                          className={cn(
                            'text-[11px] capitalize',
                            isDark ? 'text-white/30' : 'text-black/30',
                          )}
                        >
                          {ad.platform}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold shrink-0',
                        getRoasBg(ad.roas, isDark),
                        getRoasColor(ad.roas, isDark),
                      )}
                    >
                      {ad.roas}x ROAS
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        Spend
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        {formatINR(ad.spend)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        Clicks
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        {formatNumber(ad.clicks)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        Conversions
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        {ad.conversions.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        Impressions
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        {formatNumber(ad.impressions)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        CPC
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        ₹{ad.cpc.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-2 text-center',
                        isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                      )}
                    >
                      <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>
                        CPL
                      </p>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>
                        ₹{ad.cpl.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
