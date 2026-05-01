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
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CSS } from '@/styles/design-tokens';

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
    { label: 'Promoters', value: `${npsCalc.promoters}`, icon: ThumbsUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { label: 'Passives', value: `${npsCalc.passives}`, icon: Minus, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
    { label: 'Detractors', value: `${npsCalc.detractors}`, icon: ThumbsDown, color: 'text-red-400', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
    { label: 'Total Responses', value: `${npsCalc.total}`, icon: MessageSquare, color: 'text-sky-400', bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50' },
  ], [isDark, npsCalc]);

  const maxCategory = Math.max(npsCalc.promoters, npsCalc.passives, npsCalc.detractors, 1);

  const filterOptions = [
    { key: 'type', value: typeFilter, setter: setTypeFilter, options: ['all', 'nps', 'csat', 'feature-request', 'complaint', 'praise'] },
    { key: 'sentiment', value: sentimentFilter, setter: setSentimentFilter, options: ['all', 'positive', 'neutral', 'negative'] },
    { key: 'status', value: statusFilter, setter: setStatusFilter, options: ['all', 'new', 'acknowledged', 'resolved', 'closed'] },
  ];

  // ── Feedback Inbox columns ──
  const feedbackColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const tConf = typeConfig[(row.type as string)] || typeConfig['nps'];
        return <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', tConf.bg, tConf.color)}>{row.type as string}</Badge>;
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={cn('w-3 h-3', j < (row.rating as number) ? 'text-amber-400 fill-amber-400' : 'opacity-10')} />
          ))}
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (row) => <p className="text-xs font-medium truncate max-w-[140px]">{row.subject as string}</p>,
    },
    { key: 'client', label: 'Client' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => <p className="text-[10px] truncate max-w-[160px]" style={{ color: CSS.textMuted }}>{row.message as string}</p>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span className="text-[10px]" style={{ color: CSS.textMuted }}>{row.date as string}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const sConf = statusConfig[(row.status as string)] || statusConfig['new'];
        return <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5', sConf.bg, sConf.color)}>{sConf.label}</Badge>;
      },
    },
    {
      key: 'sentiment',
      label: 'Sentiment',
      render: (row) => {
        const sentConf = sentimentConfig[(row.sentiment as string)] || sentimentConfig.neutral;
        const SentIcon = sentConf.icon;
        return (
          <div className={cn('flex items-center gap-1', sentConf.color)}>
            <SentIcon className="w-3 h-3" />
            <span className="text-[10px] capitalize">{row.sentiment as string}</span>
          </div>
        );
      },
    },
  ], []);

  // ── NPS Responses columns ──
  const npsColumns: DataTableColumnDef[] = useMemo(() => [
    { key: 'client', label: 'Client' },
    {
      key: 'score',
      label: 'Score',
      render: (row) => {
        const score = row.score as number;
        const scoreColor = score >= 9 ? 'text-emerald-500' : score >= 7 ? 'text-amber-500' : 'text-red-500';
        return <span className={cn('text-base font-black', scoreColor)}>{score}</span>;
      },
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => {
        const cat = row.category as string;
        return (
          <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 capitalize',
            cat === 'promoter' ? 'bg-emerald-500/15 text-emerald-400'
            : cat === 'passive' ? 'bg-amber-500/15 text-amber-400'
            : 'bg-red-500/15 text-red-400'
          )}>{cat}</Badge>
        );
      },
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (row) => <p className="text-xs truncate max-w-[250px]" style={{ color: CSS.textSecondary }}>{row.feedback as string}</p>,
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span className="text-[10px]" style={{ color: CSS.textMuted }}>{row.date as string}</span>,
    },
    {
      key: 'sentiment',
      label: 'Sentiment',
      render: (row) => {
        const sentConf = sentimentConfig[(row.sentiment as string)] || sentimentConfig.neutral;
        const SentIcon = sentConf.icon;
        return (
          <div className={cn('flex items-center gap-1', sentConf.color)}>
            <SentIcon className="w-3 h-3" />
            <span className="text-[10px] capitalize">{row.sentiment as string}</span>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <MessageSquare className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Feedback & NPS</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Sentiment & Satisfaction Cockpit</p>
            </div>
          </div>
          <Button className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}>
            <Send className="w-4 h-4" />
            Send Survey
          </Button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {kpiStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
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
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.15 }}
            className={cn('rounded-2xl border p-6 flex flex-col items-center justify-center text-center', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <p className={cn('text-xs font-medium uppercase tracking-wider mb-2', isDark ? 'text-white/40' : 'text-black/40')}>Net Promoter Score</p>
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn('text-7xl font-black tracking-tighter', npsCalc.npsScore >= 50 ? 'text-emerald-500' : npsCalc.npsScore >= 0 ? 'text-amber-500' : 'text-red-500')}
            >
              {npsCalc.npsScore}
            </motion.p>
            <p className={cn('text-xs mt-2', isDark ? 'text-white/30' : 'text-black/30')}>
              {npsCalc.total} responses collected
            </p>
          </motion.div>

          {/* NPS Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.15 }}
            className={cn('md:col-span-2 rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>NPS Distribution</span>
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
                      <span className={cn('text-sm font-medium', isDark ? 'text-white/60' : 'text-black/60')}>{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-bold', cat.textColor)}>{cat.count}</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                        {maxCategory > 0 ? ((cat.count / npsCalc.total) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxCategory > 0 ? (cat.count / maxCategory) * 100 : 0}%` }}
                      transition={{ delay: 0.4 + j * 0.1, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
          <Filter className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
          {filterOptions.map(fo => (
            <div key={fo.key} className="flex items-center gap-1.5 flex-wrap">
              <span className={cn('text-[10px] font-medium uppercase tracking-wider shrink-0', isDark ? 'text-white/25' : 'text-black/25')}>{fo.key}:</span>
              {fo.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => fo.setter(opt)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                    fo.value === opt
                      ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black')
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
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.15 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Feedback Inbox</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50')}>
              {filteredFeedback.length} items
            </Badge>
          </div>
          <SmartDataTable
            data={filteredFeedback as unknown as Record<string, unknown>[]}
            columns={feedbackColumns}
            searchable
            searchPlaceholder="Search feedback..."
            enableExport
            pageSize={10}
          />
        </motion.div>

        {/* Promoter Highlight + Detractor Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promoter List */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.15 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Promoters — Brand Champions</span>
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
                    <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>{p.feedback}</p>
                    <span className={cn('text-[10px] mt-1 block', isDark ? 'text-white/20' : 'text-black/20')}>{p.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Detractor Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.15 }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-50 border-red-200')}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Detractor Alerts — Immediate Action</span>
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
                    <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>{d.feedback}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-red-500 hover:bg-red-500/10 gap-1">
                        <Eye className="w-3 h-3" />Investigate
                      </Button>
                      <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{d.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* NPS Responses Table */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.15 }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>NPS Responses</span>
            </div>
          </div>
          <SmartDataTable
            data={npsResponses as unknown as Record<string, unknown>[]}
            columns={npsColumns}
            searchable
            searchPlaceholder="Search NPS responses..."
            enableExport
            pageSize={10}
          />
        </motion.div>
      </div>
    </div>
  );
}
