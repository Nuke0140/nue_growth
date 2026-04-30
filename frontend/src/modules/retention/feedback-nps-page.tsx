'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare, Star, Filter, Send, AlertTriangle, TrendingUp,
  ArrowUpRight, ThumbsUp, ThumbsDown, Minus, BarChart3,
  ChevronRight, Sparkles, ShieldAlert, Heart, CheckCircle2, Clock, Eye
} from 'lucide-react';
import { npsResponses, feedbackData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { NPSResponse, FeedbackEntry } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

const sentimentConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  positive: { color: 'text-emerald-500', bg: 'bg-emerald-500/15', icon: ThumbsUp },
  neutral: { color: 'text-amber-500', bg: 'bg-amber-500/15', icon: Minus },
  negative: { color: 'text-red-500', bg: 'bg-red-500/15', icon: ThumbsDown },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'new': { label: 'New', color: 'text-sky-400', bg: 'bg-sky-500/15' },
  'acknowledged': { label: 'Acknowledged', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  'resolved': { label: 'Resolved', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  'closed': { label: 'Closed', color: 'text-slate-400', bg: 'bg-slate-500/15' },
};

const typeConfig: Record<string, { color: string; bg: string }> = {
  'nps': { color: 'text-violet-400', bg: 'bg-violet-500/15' },
  'csat': { color: 'text-sky-400', bg: 'bg-sky-500/15' },
  'feature-request': { color: 'text-amber-400', bg: 'bg-amber-500/15' },
  'complaint': { color: 'text-red-400', bg: 'bg-red-500/15' },
  'praise': { color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
};

export default function FeedbackNpsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const npsCalc = useMemo(() => {
    const promoters = npsResponses.filter(r => r.category === 'promoter').length;
    const passives = npsResponses.filter(r => r.category === 'passive').length;
    const detractors = npsResponses.filter(r => r.category === 'detractor').length;
    const total = npsResponses.length;
    const npsScore = Math.round(((promoters - detractors) / total) * 100);
    return { promoters, passives, detractors, total, npsScore };
  }, []);

  const filteredFeedback = useMemo(() => {
    return feedbackData.filter((fb: FeedbackEntry) => {
      if (typeFilter !== 'all' && fb.type !== typeFilter) return false;
      if (sentimentFilter !== 'all' && fb.sentiment !== sentimentFilter) return false;
      if (statusFilter !== 'all' && fb.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, sentimentFilter, statusFilter]);

  const promoters = useMemo(() =>
    npsResponses.filter(r => r.category === 'promoter'),
    []
  );

  const detractors = useMemo(() =>
    npsResponses.filter(r => r.category === 'detractor'),
    []
  );

  const kpiStats = useMemo(() => [
    { label: 'NPS Score', value: `${npsCalc.npsScore}`, icon: BarChart3, color: npsCalc.npsScore >= 50 ? 'text-emerald-400' : npsCalc.npsScore >= 0 ? 'text-amber-400' : 'text-red-400', bg: isDark ? (npsCalc.npsScore >= 50 ? 'bg-emerald-500/10' : 'bg-amber-500/10') : (npsCalc.npsScore >= 50 ? 'bg-emerald-50' : 'bg-amber-50') },
    { label: 'Promoters', value: `${npsCalc.promoters}`, icon: ThumbsUp, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]' },
    { label: 'Passives', value: `${npsCalc.passives}`, icon: Minus, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]' },
    { label: 'Detractors', value: `${npsCalc.detractors}`, icon: ThumbsDown, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]' },
    { label: 'Total Responses', value: `${npsCalc.total}`, icon: MessageSquare, color: 'text-sky-400', bg: 'bg-[var(--app-info-bg)]' },
  ], [isDark, npsCalc]);

  const maxCategory = Math.max(npsCalc.promoters, npsCalc.passives, npsCalc.detractors, 1);

  const filterOptions = [
    { key: 'type', value: typeFilter, setter: setTypeFilter, options: ['all', 'nps', 'csat', 'feature-request', 'complaint', 'praise'] },
    { key: 'sentiment', value: sentimentFilter, setter: setSentimentFilter, options: ['all', 'positive', 'neutral', 'negative'] },
    { key: 'status', value: statusFilter, setter: setStatusFilter, options: ['all', 'new', 'acknowledged', 'resolved', 'closed'] },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <MessageSquare className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Feedback & NPS</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Sentiment & Satisfaction Cockpit</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
            <Send className="w-4 h-4" />
            Send Survey
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
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className={cn('text-2xl font-bold tracking-tight', stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* NPS Score + Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large NPS Score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className={cn('rounded-2xl border p-6 flex flex-col items-center justify-center text-center', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <p className={cn('text-xs font-medium uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>Net Promoter Score</p>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn('text-7xl font-black tracking-tighter', npsCalc.npsScore >= 50 ? 'text-emerald-500' : npsCalc.npsScore >= 0 ? 'text-amber-500' : 'text-red-500')}
            >
              {npsCalc.npsScore}
            </motion.p>
            <p className={cn('text-xs mt-2', 'text-[var(--app-text-muted)]')}>
              {npsCalc.total} responses collected
            </p>
          </motion.div>

          {/* NPS Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={cn('md:col-span-2 rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>NPS Distribution</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Promoters (9-10)', count: npsCalc.promoters, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
                { label: 'Passives (7-8)', count: npsCalc.passives, color: 'bg-amber-500', textColor: 'text-amber-500' },
                { label: 'Detractors (0-6)', count: npsCalc.detractors, color: 'bg-red-500', textColor: 'text-red-500' },
              ].map((cat, j) => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-sm', cat.color)} />
                      <span className={cn('text-sm font-medium', 'text-[var(--app-text-secondary)]')}>{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-bold', cat.textColor)}>{cat.count}</span>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {maxCategory > 0 ? ((cat.count / npsCalc.total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('h-3 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxCategory > 0 ? (cat.count / maxCategory) * 100 : 0}%` }}
                      transition={{ delay: 0.4 + j * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', cat.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Filter className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
          {filterOptions.map(fo => (
            <div key={fo.key} className="flex items-center gap-1.5 flex-wrap">
              <span className={cn('text-[10px] font-medium uppercase tracking-wider shrink-0', 'text-[var(--app-text-muted)]')}>{fo.key}:</span>
              {fo.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => fo.setter(opt)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                    fo.value === opt
                      ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)]')
                      : (isDark ? 'bg-white/[0.03] text-white/35 hover:bg-white/[0.06]' : 'bg-black/[0.03] text-black/35 hover:bg-black/[0.06]')
                  )}
                >
                  {opt === 'all' ? 'All' : opt}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Feedback Inbox */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Feedback Inbox</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
              {filteredFeedback.length} items
            </Badge>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className={cn('border-b', 'border-[var(--app-border)] bg-[var(--app-bg)]')}>
                  {['Type', 'Rating', 'Subject', 'Client', 'Message', 'Date', 'Status', 'Sentiment'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((fb: FeedbackEntry, i) => {
                  const sConf = statusConfig[fb.status] || statusConfig['new'];
                  const tConf = typeConfig[fb.type] || typeConfig['nps'];
                  const sentConf = sentimentConfig[fb.sentiment] || sentimentConfig.neutral;
                  const SentIcon = sentConf.icon;
                  return (
                    <motion.tr
                      key={fb.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.04 }}
                      className={cn('border-b cursor-pointer transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                    >
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', tConf.bg, tConf.color)}>{fb.type}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={cn('w-3 h-3', j < fb.rating ? 'text-amber-400 fill-amber-400' : ('text-[var(--app-text-disabled)]'))} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-xs font-medium truncate max-w-[140px]">{fb.subject}</p>
                      </td>
                      <td className="py-3 px-3 text-sm">{fb.client}</td>
                      <td className="py-3 px-3">
                        <p className={cn('text-[10px] truncate max-w-[160px]', 'text-[var(--app-text-muted)]')}>{fb.message}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{fb.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', sConf.bg, sConf.color)}>{sConf.label}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className={cn('flex items-center gap-1', sentConf.color)}>
                          <SentIcon className="w-3 h-3" />
                          <span className="text-[10px] capitalize">{fb.sentiment}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Promoter Highlight + Detractor Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promoter List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Promoters — Brand Champions</span>
              <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-400">{promoters.length}</Badge>
            </div>
            <div className="space-y-2.5">
              {promoters.map((p: NPSResponse) => (
                <div key={p.id} className={cn('flex items-start gap-3 p-3 rounded-xl', isDark ? 'bg-white/[0.02]' : 'bg-white')}>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-emerald-500">{p.score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold">{p.client}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500">{p.industry}</Badge>
                    </div>
                    <p className={cn('text-xs leading-relaxed line-clamp-2', 'text-[var(--app-text-muted)]')}>{p.feedback}</p>
                    <span className={cn('text-[10px] mt-1 block', 'text-[var(--app-text-disabled)]')}>{p.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Detractor Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50 border-red-200')}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Detractor Alerts — Immediate Action</span>
              <Badge variant="secondary" className="text-[10px] bg-red-500/15 text-red-400">{detractors.length}</Badge>
            </div>
            <div className="space-y-2.5">
              {detractors.map((d: NPSResponse) => (
                <div key={d.id} className={cn('flex items-start gap-3 p-3 rounded-xl border', isDark ? 'bg-white/[0.02] border-red-500/10' : 'bg-white border-red-100')}>
                  <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-red-500">{d.score}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-red-500">{d.client}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-500">{d.industry}</Badge>
                    </div>
                    <p className={cn('text-xs leading-relaxed line-clamp-2', 'text-[var(--app-text-muted)]')}>{d.feedback}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-red-500 hover:bg-red-500/10 gap-1">
                        <Eye className="w-3 h-3" />Investigate
                      </Button>
                      <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>{d.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* NPS Responses Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>NPS Responses</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Client', 'Score', 'Category', 'Feedback', 'Date', 'Sentiment'].map(h => (
                    <th key={h} className={cn('text-left text-[11px] font-medium uppercase tracking-wider pb-3 px-3', 'text-[var(--app-text-muted)]')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {npsResponses.map((r: NPSResponse, i) => {
                  const scoreColor = r.score >= 9 ? 'text-emerald-500' : r.score >= 7 ? 'text-amber-500' : 'text-red-500';
                  const sentConf = sentimentConfig[r.sentiment] || sentimentConfig.neutral;
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.04 }}
                      className={cn('border-b cursor-pointer transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}
                    >
                      <td className="py-3 px-3 text-sm font-medium">{r.client}</td>
                      <td className="py-3 px-3">
                        <span className={cn('text-base font-black', scoreColor)}>{r.score}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize',
                          r.category === 'promoter' ? 'bg-emerald-500/15 text-emerald-400'
                          : r.category === 'passive' ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-red-500/15 text-red-400'
                        )}>{r.category}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <p className={cn('text-xs truncate max-w-[250px]', 'text-[var(--app-text-secondary)]')}>{r.feedback}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{r.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className={cn('flex items-center gap-1', sentConf.color)}>
                          <sentConf.icon className="w-3 h-3" />
                          <span className="text-[10px] capitalize">{r.sentiment}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
