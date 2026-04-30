'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star, Eye, ChevronRight, BrainCircuit, MessageSquareQuote,
  Award, BookOpen, Mic, Users, XCircle, Filter
} from 'lucide-react';
import { advocacyData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { AdvocacyEntry } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  testimonial: { label: 'Testimonial', icon: MessageSquareQuote, color: 'bg-sky-500/15 text-sky-400' },
  review: { label: 'Review', icon: Star, color: 'bg-emerald-500/15 text-emerald-400' },
  'case-study': { label: 'Case Study', icon: BookOpen, color: 'bg-violet-500/15 text-violet-400' },
  ambassador: { label: 'Ambassador', icon: Award, color: 'bg-amber-500/15 text-amber-400' },
  speaker: { label: 'Speaker', icon: Mic, color: 'bg-rose-500/15 text-rose-400' },
  'referral-champion': { label: 'Referral Champion', icon: Users, color: 'bg-teal-500/15 text-teal-400' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  requested: { label: 'Requested', color: 'bg-amber-500/15 text-amber-400' },
  submitted: { label: 'Submitted', color: 'bg-sky-500/15 text-sky-400' },
  published: { label: 'Published', color: 'bg-emerald-500/15 text-emerald-400' },
  declined: { label: 'Declined', color: 'bg-red-500/15 text-red-400' },
};

type FilterType = 'all' | AdvocacyEntry['type'];
type FilterStatus = 'all' | AdvocacyEntry['status'];

export default function AdvocacyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  // Summary stats
  const summary = useMemo(() => {
    const total = advocacyData.length;
    const submitted = advocacyData.filter((a: AdvocacyEntry) => a.status === 'submitted' || a.status === 'published').length;
    const published = advocacyData.filter((a: AdvocacyEntry) => a.status === 'published').length;
    const declined = advocacyData.filter((a: AdvocacyEntry) => a.status === 'declined').length;
    const totalImpact = advocacyData.reduce((s, a) => s + a.impact, 0);
    return { total, submitted, published, declined, totalImpact };
  }, []);

  // Filtered data
  const filteredData = useMemo(() =>
    advocacyData.filter((a: AdvocacyEntry) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    }),
    [typeFilter, statusFilter]
  );

  // Top advocates
  const topAdvocates = useMemo(() =>
    [...advocacyData]
      .filter((a: AdvocacyEntry) => a.status !== 'declined')
      .sort((a, b) => b.promoterScore - a.promoterScore)
      .slice(0, 4),
    []
  );

  // Published content
  const publishedContent = useMemo(() =>
    advocacyData.filter((a: AdvocacyEntry) => a.status === 'published'),
    []
  );

  // Declined entries
  const declinedEntries = useMemo(() =>
    advocacyData.filter((a: AdvocacyEntry) => a.status === 'declined'),
    []
  );

  // KPI stats
  const kpiStats = useMemo(() => [
    { label: 'Total Requests', value: `${summary.total}`, icon: MessageSquareQuote, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]', change: 0, changeLabel: 'advocacy pipeline' },
    { label: 'Submitted', value: `${summary.submitted}`, icon: Star, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', change: 0, changeLabel: 'awaiting review' },
    { label: 'Published', value: `${summary.published}`, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', change: 0, changeLabel: 'live content' },
    { label: 'Declined', value: `${summary.declined}`, icon: XCircle, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', change: 0, changeLabel: 'rejection rate' },
    { label: 'Total Impact', value: `${(summary.totalImpact / 1000).toFixed(1)}K`, icon: Eye, color: 'text-violet-400', bg: 'bg-[var(--app-purple-light)]', change: 0, changeLabel: 'content views' },
  ], [isDark, summary]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-[var(--app-hover-bg)]'
            )}>
              <Award className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Advocacy</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Customer Advocacy Hub</p>
            </div>
          </div>
          <Button
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-xl gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}
          >
            <MessageSquareQuote className="w-4 h-4" />
            Request Testimonial
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4 transition-all duration-200',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  {stat.label}
                </span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>{stat.changeLabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            'rounded-2xl border p-4',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Filter className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Type:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'testimonial', 'review', 'case-study', 'ambassador', 'speaker', 'referral-champion'] as FilterType[]).map((t) => (
                  <Button
                    key={t}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTypeFilter(t)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-medium rounded-lg capitalize transition-colors',
                      typeFilter === t
                        ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
                        : ('text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]')
                    )}
                  >
                    {t === 'all' ? 'All' : t.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Status:</span>
              <div className="flex gap-1.5">
                {(['all', 'requested', 'submitted', 'published', 'declined'] as FilterStatus[]).map((s) => (
                  <Button
                    key={s}
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-medium rounded-lg capitalize transition-colors',
                      statusFilter === s
                        ? ('bg-[var(--app-card-bg)] text-[var(--app-text)]')
                        : ('text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]')
                    )}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advocacy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((entry: AdvocacyEntry, i) => {
            const tCfg = typeConfig[entry.type];
            const sCfg = statusConfig[entry.status];
            const TypeIcon = tCfg.icon;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 transition-all duration-200',
                  entry.status === 'declined'
                    ? (isDark ? 'bg-red-500/[0.02] border-red-500/15' : 'bg-red-50/50 border-red-200')
                    : entry.status === 'published'
                      ? (isDark ? 'bg-emerald-500/[0.02] border-emerald-500/15' : 'bg-emerald-50/50 border-emerald-200')
                      : ('bg-[var(--app-card-bg)] border-[var(--app-border)]')
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', tCfg.color.split(' ')[0])}>
                      <TypeIcon className={cn('w-4 h-4', tCfg.color.split(' ')[1])} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{entry.client}</h3>
                      <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{entry.industry}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className={cn('text-[9px] px-2 py-0', tCfg.color)}>{tCfg.label}</Badge>
                    <Badge variant="secondary" className={cn('text-[9px] px-2 py-0', sCfg.color)}>{sCfg.label}</Badge>
                  </div>
                </div>

                {entry.content && (
                  <p className={cn('text-xs leading-relaxed mb-2 line-clamp-2', 'text-[var(--app-text-secondary)]')}>
                    &ldquo;{entry.content}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    Requested: {entry.requestDate}
                  </span>
                  {entry.submittedDate && (
                    <>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>·</span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        Submitted: {entry.submittedDate}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed" style={{ borderColor: 'var(--app-border)' }}>
                  <div className="flex items-center gap-1.5">
                    <Eye className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <span className="text-[10px] font-medium">{entry.impact.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className={cn('w-3 h-3', entry.promoterScore >= 80 ? 'text-amber-400' : 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-[10px] font-medium', entry.promoterScore >= 80 ? 'text-amber-400' : '')}>
                      NPS: {entry.promoterScore}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top Advocates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-2xl border p-5',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Top Advocates</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-warning-bg)] text-[var(--app-warning)]')}>
              By Promoter Score
            </Badge>
          </div>
          <div className="flex items-end gap-3 h-28">
            {topAdvocates.map((adv, j) => {
              const maxScore = 100;
              return (
                <div key={adv.id} className="flex-1 flex flex-col justify-end items-center gap-1">
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>
                    {adv.promoterScore}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(adv.promoterScore / maxScore) * 100}%` }}
                    transition={{ delay: 0.5 + j * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('w-full rounded-t-sm', 'bg-[var(--app-warning)]')}
                  />
                  <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{adv.client}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Declined Section */}
        {declinedEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-2xl border p-5',
              isDark ? 'bg-red-500/[0.02] border-red-500/15' : 'bg-red-50/50 border-red-200'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Declined Requests</span>
              </div>
              <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-danger-bg)] text-[var(--app-danger)]')}>
                {declinedEntries.length} declined
              </Badge>
            </div>
            <div className="space-y-2">
              {declinedEntries.map((entry: AdvocacyEntry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06, duration: 0.3 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border',
                    isDark ? 'border-red-500/10' : 'border-red-200'
                  )}
                >
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{entry.client}</span>
                      <Badge variant="secondary" className={cn('text-[9px] px-2 py-0', typeConfig[entry.type].color)}>
                        {typeConfig[entry.type].label}
                      </Badge>
                    </div>
                    <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                      Low NPS ({entry.promoterScore}) · Likely due to service dissatisfaction
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={cn('mt-3 p-3 rounded-xl', isDark ? 'bg-red-500/[0.04]' : 'bg-red-100/50')}>
              <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                <span className="font-semibold text-red-400">Analysis:</span> Declined requests correlate with NPS scores below 50. Focus on improving service delivery before re-requesting. Average promoter score of declined: {Math.round(declinedEntries.reduce((s, e) => s + e.promoterScore, 0) / declinedEntries.length)}.
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Customer Success', value: '3 plans', page: 'customer-success' as const, icon: Award, color: 'text-violet-400' },
            { label: 'LTV Forecast', value: '5 segments', page: 'ltv-forecast' as const, icon: BrainCircuit, color: 'text-emerald-400' },
            { label: 'AI Growth Coach', value: '8 insights', page: 'ai-growth-coach' as const, icon: BrainCircuit, color: 'text-amber-400' },
          ].map((nav, i) => (
            <motion.button
              key={nav.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigateTo(nav.page)}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all duration-200 group',
                'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <div className="flex items-center justify-between">
                <nav.icon className={cn('w-5 h-5', nav.color)} />
                <ChevronRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-1', 'text-[var(--app-text-disabled)]')} />
              </div>
              <p className="text-xl font-bold mt-3">{nav.value}</p>
              <p className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{nav.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
