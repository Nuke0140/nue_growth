'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ABTest } from '@/modules/marketing/types';
import { mockABTests } from '@/modules/marketing/data/mock-data';
import {
  Plus, FlaskConical, Trophy, Clock, CheckCircle2, Zap,
  BarChart3, TrendingUp, Eye, ArrowUpRight, Beaker,
  Pause, Play, Calendar, RefreshCw, Target, Layers,
} from 'lucide-react';

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  'cta': { label: 'CTA', className: 'bg-blue-500/15 text-blue-600' },
  'subject-line': { label: 'Subject Line', className: 'bg-purple-500/15 text-purple-600' },
  'landing-page': { label: 'Landing Page', className: 'bg-orange-500/15 text-orange-600' },
  'creative': { label: 'Creative', className: 'bg-pink-500/15 text-pink-600' },
  'email': { label: 'Email', className: 'bg-amber-500/15 text-amber-600' },
};

const STATUS_CONFIG: Record<string, { label: string; className: string; pulse: boolean }> = {
  running: { label: 'Running', className: 'bg-blue-500/15 text-blue-600', pulse: true },
  completed: { label: 'Completed', className: 'bg-green-500/15 text-green-600', pulse: false },
  draft: { label: 'Draft', className: 'bg-gray-500/15 text-gray-500', pulse: false },
};

export default function AbTestingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = useMemo(() => {
    const active = mockABTests.filter(t => t.status === 'running').length;
    const completed = mockABTests.filter(t => t.status === 'completed').length;
    const completedTests = mockABTests.filter(t => t.status === 'completed' && t.confidence > 0);
    const avgConfidence = completedTests.length > 0
      ? completedTests.reduce((s, t) => s + t.confidence, 0) / completedTests.length
      : 0;
    return { active, completed, avgConfidence };
  }, []);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    mockABTests.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, []);

  const completedTests = useMemo(() => mockABTests.filter(t => t.status === 'completed'), []);
  const maxTestCount = Math.max(...typeDistribution.map(d => d.count), 1);

  const card = cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');
  const kpiStyle = cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]');
  const subtle = 'text-[var(--app-text-muted)]';
  const medium = 'text-[var(--app-text-secondary)]';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
              A/B Testing Dashboard
            </h1>
            <p className={cn('text-sm mt-1', 'text-[var(--app-text-secondary)]')}>
              Run experiments, compare variants, and optimize conversion rates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/15 text-blue-600">
            {stats.active} Active
          </Badge>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Test
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Tests', value: stats.active, icon: Play, color: 'text-blue-500' },
          { label: 'Completed Tests', value: stats.completed, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Avg Confidence', value: `${stats.avgConfidence.toFixed(1)}%`, icon: Target, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={kpiStyle}
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              <span className={cn('text-xs', medium)}>{kpi.label}</span>
            </div>
            <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {mockABTests.map((test, i) => {
          const typeStyle = TYPE_STYLES[test.type];
          const statusConfig = STATUS_CONFIG[test.status];
          const winnerVariant = test.winner ? test.variants.find(v => v.id === test.winner) : null;
          const bestVariant = test.variants.reduce((best, v) =>
            v.conversionRate > best.conversionRate ? v : best, test.variants[0]);

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={card}
            >
              {/* Test Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                    <h4 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                      {test.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-[10px]', typeStyle.className)}>{typeStyle.label}</Badge>
                    <Badge
                      className={cn('text-[10px]', statusConfig.className)}
                    >
                      {statusConfig.pulse && (
                        <span className="relative flex h-1.5 w-1.5 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                        </span>
                      )}
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
                {test.improvement > 0 && (
                  <div className="flex items-center gap-1 text-green-500">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-bold">+{test.improvement}%</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 mb-4">
                <Calendar className={cn('w-3 h-3', subtle)} />
                <span className={cn('text-[10px]', medium)}>
                  {test.startDate} → {test.endDate}
                </span>
              </div>

              {/* Confidence Bar */}
              {test.confidence > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px]', medium)}>Statistical Confidence</span>
                    <span className={cn('text-[10px] font-bold tabular-nums',
                      test.confidence >= 95 ? 'text-green-500' : test.confidence >= 80 ? 'text-amber-500' : 'text-red-500')}>
                      {test.confidence}%
                    </span>
                  </div>
                  <div className={cn('h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${test.confidence}%` }}
                      transition={{ delay: i * 0.06 + 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full',
                        test.confidence >= 95 ? 'bg-green-500' : test.confidence >= 80 ? 'bg-amber-500' : 'bg-red-500')}
                    />
                  </div>
                  {test.confidence >= 95 && test.status === 'completed' && (
                    <p className={cn('text-[10px] mt-1 text-green-500')}>✓ Statistically significant</p>
                  )}
                </div>
              )}

              {/* Variants */}
              <div className="space-y-2.5">
                {test.variants.map((variant, j) => {
                  const isWinner = variant.isWinner || (test.status === 'draft' && false);
                  return (
                    <div
                      key={variant.id}
                      className={cn(
                        'rounded-xl border p-3 transition',
                        isWinner
                          ? isDark ? 'bg-green-500/5 border-green-500/20' : 'bg-green-500/5 border-green-500/20'
                          : 'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold',
                            isWinner
                              ? 'bg-green-500 text-white'
                              : 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]',
                          )}>
                            {j === 0 ? 'A' : j === 1 ? 'B' : 'C'}
                          </span>
                          <span className={cn('text-[10px] font-medium truncate max-w-[160px]',
                            isDark ? 'text-white/80' : 'text-gray-700')}>
                            {variant.name}
                          </span>
                        </div>
                        {isWinner && (
                          <Badge className="text-[9px] bg-green-500 text-white">
                            <Trophy className="w-2.5 h-2.5 mr-0.5" />
                            Winner
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className={cn('text-[9px]', subtle)}>Impressions</p>
                          <p className={cn('text-xs font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                            {variant.impressions > 0 ? variant.impressions.toLocaleString() : '—'}
                          </p>
                        </div>
                        <div>
                          <p className={cn('text-[9px]', subtle)}>Conversions</p>
                          <p className={cn('text-xs font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                            {variant.conversions > 0 ? variant.conversions.toLocaleString() : '—'}
                          </p>
                        </div>
                        <div>
                          <p className={cn('text-[9px]', subtle)}>Rate</p>
                          <p className={cn('text-xs font-bold tabular-nums',
                            isWinner ? 'text-green-500' : 'text-[var(--app-text-secondary)]')}>
                            {variant.conversionRate > 0 ? `${variant.conversionRate}%` : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Row: Winner Announcements + Test Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Winner Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Winner Announcements</h3>
          </div>
          <div className="space-y-3">
            {completedTests.length === 0 ? (
              <p className={cn('text-xs text-center py-4', subtle)}>No completed tests yet</p>
            ) : (
              completedTests.map((test, i) => {
                const winner = test.variants.find(v => v.id === test.winner);
                const typeStyle = TYPE_STYLES[test.type];
                return (
                  <div
                    key={test.id}
                    className={cn(
                      'rounded-xl border p-4',
                      isDark ? 'bg-green-500/[0.03] border-green-500/10' : 'bg-green-500/[0.03] border-green-500/10',
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-green-500" />
                        <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                          {test.name}
                        </span>
                      </div>
                      <Badge className={cn('text-[10px]', typeStyle.className)}>{typeStyle.label}</Badge>
                    </div>
                    <div className={cn('flex items-center gap-2 mb-1')}>
                      <span className={cn('text-[10px]', medium)}>Winner:</span>
                      <span className="text-xs font-semibold text-green-600">{winner?.name ?? 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('text-[10px]', medium)}>+{test.improvement}% improvement</span>
                      <span className={cn('text-[10px]', medium)}>·</span>
                      <span className={cn('text-[10px]', medium)}>{test.confidence}% confidence</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Test Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Test Type Distribution</h3>
          </div>
          <div className="space-y-4">
            {typeDistribution.map((item, i) => {
              const typeStyle = TYPE_STYLES[item.type];
              const width = maxTestCount > 0 ? (item.count / maxTestCount) * 100 : 0;
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-[10px]', typeStyle.className)}>{typeStyle.label}</Badge>
                    </div>
                    <span className={cn('text-xs font-semibold tabular-nums', 'text-[var(--app-text)]')}>
                      {item.count} test{item.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full',
                        item.type === 'cta' ? 'bg-blue-500' :
                        item.type === 'subject-line' ? 'bg-purple-500' :
                        item.type === 'landing-page' ? 'bg-orange-500' :
                        item.type === 'creative' ? 'bg-pink-500' : 'bg-amber-500')}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className={cn('mt-5 pt-4 border-t', 'border-[var(--app-border)]')}>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{mockABTests.length}</p>
                <p className={cn('text-[10px]', medium)}>Total Tests</p>
              </div>
              <div className="text-center">
                <p className={cn('text-lg font-bold text-green-500')}>
                  {completedTests.filter(t => t.improvement > 20).length}
                </p>
                <p className={cn('text-[10px]', medium)}>Big Wins ({'>'}20%)</p>
              </div>
              <div className="text-center">
                <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                  {mockABTests.reduce((s, t) => s + t.variants.length, 0)}
                </p>
                <p className={cn('text-[10px]', medium)}>Total Variants</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
