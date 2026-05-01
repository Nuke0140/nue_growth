'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Settings2, Plus, FileText, Truck, BarChart3,
  ChevronDown, ChevronUp, Calendar, User, MessageSquare,
  Tag, ArrowUpRight, IndianRupee, Eye, Clock,
  Package, AlertCircle,
} from 'lucide-react';
import { mockContentRequests, mockServiceRequests, mockPostPublishMetrics } from '@/modules/marketing/data/mock-data';
import type {
  ContentRequest, ServiceRequest, PostPublishMetrics,
  ContentRequestStatus,
} from '@/modules/marketing/types';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';

// ── INR Formatter ─────────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

// ── Color Maps ────────────────────────────────────────────

const contentStatusColors: Record<string, string> = {
  requested: 'bg-slate-500/15 text-slate-400',
  'in-progress': 'bg-amber-500/15 text-amber-400',
  'in-review': 'bg-blue-500/15 text-blue-400',
  approved: 'bg-emerald-500/15 text-emerald-400',
  published: 'bg-green-500/15 text-green-400',
  revision: 'bg-red-500/15 text-red-400',
  draft: 'bg-slate-500/15 text-slate-400',
};

const contentPriorityColors: Record<string, string> = {
  low: 'bg-emerald-500/15 text-emerald-400',
  medium: 'bg-blue-500/15 text-blue-400',
  high: 'bg-amber-500/15 text-amber-400',
  critical: 'bg-red-500/15 text-red-400',
};

const contentTypeColors: Record<string, string> = {
  'social-post': 'bg-pink-500/15 text-pink-400',
  email: 'bg-sky-500/15 text-sky-400',
  'landing-page': 'bg-violet-500/15 text-violet-400',
  'ad-creative': 'bg-orange-500/15 text-orange-400',
  video: 'bg-cyan-500/15 text-cyan-400',
  blog: 'bg-emerald-500/15 text-emerald-400',
  'whatsapp-template': 'bg-green-500/15 text-green-400',
};

const serviceStatusColors: Record<string, string> = {
  requested: 'bg-slate-500/15 text-slate-400',
  accepted: 'bg-blue-500/15 text-blue-400',
  'in-progress': 'bg-amber-500/15 text-amber-400',
  delivered: 'bg-violet-500/15 text-violet-400',
  completed: 'bg-emerald-500/15 text-emerald-400',
};

const serviceTypeColors: Record<string, string> = {
  design: 'bg-pink-500/15 text-pink-400',
  copywriting: 'bg-sky-500/15 text-sky-400',
  'video-production': 'bg-cyan-500/15 text-cyan-400',
  photography: 'bg-amber-500/15 text-amber-400',
  translation: 'bg-violet-500/15 text-violet-400',
  branding: 'bg-orange-500/15 text-orange-400',
};

const contentStatusList: ContentRequestStatus[] = [
  'requested', 'in-progress', 'in-review', 'approved', 'published', 'revision',
];

const contentTypeList: ContentRequest['type'][] = [
  'social-post', 'email', 'landing-page', 'ad-creative', 'video', 'blog', 'whatsapp-template',
];

// ── Content Request Expanded Row ──────────────────────────

function ContentRequestExpanded({ request, isDark }: { request: ContentRequest; isDark: boolean }) {
  const cardCls = cn(
    'rounded-xl border p-3',
    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );
  const labelCls = cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30');

  return (
    <div className="space-y-3 p-2">
      {/* Description */}
      <div className={cardCls}>
        <p className={labelCls}>Description</p>
        <p className={cn('text-xs leading-relaxed mt-1', isDark ? 'text-white/60' : 'text-black/60')}>
          {request.description}
        </p>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className={cardCls}>
          <p className={labelCls}>Requester</p>
          <div className="flex items-center gap-1.5 mt-1">
            <User className="w-3 h-3" style={{ color: CSS.textSecondary }} />
            <span className="text-xs" style={{ color: CSS.text }}>{request.requester}</span>
          </div>
        </div>
        <div className={cardCls}>
          <p className={labelCls}>Assignee</p>
          <div className="flex items-center gap-1.5 mt-1">
            <User className="w-3 h-3" style={{ color: CSS.textSecondary }} />
            <span className="text-xs" style={{ color: CSS.text }}>{request.assignee}</span>
          </div>
        </div>
        <div className={cardCls}>
          <p className={labelCls}>Due Date</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3" style={{ color: CSS.textSecondary }} />
            <span className="text-xs" style={{ color: CSS.text }}>{request.dueDate}</span>
          </div>
        </div>
        <div className={cardCls}>
          <p className={labelCls}>Version</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Tag className="w-3 h-3" style={{ color: CSS.textSecondary }} />
            <span className="text-xs" style={{ color: CSS.text }}>v{request.version}</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      {request.comments.length > 0 && (
        <div className={cardCls}>
          <p className={labelCls}>Comments ({request.comments.length})</p>
          <div className="mt-2 space-y-2">
            {request.comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  'rounded-lg p-2',
                  isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium" style={{ color: CSS.text }}>
                    {comment.author}
                  </span>
                  <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                    {new Date(comment.timestamp).toLocaleString('en-IN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/50' : 'text-black/50')}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {request.comments.length === 0 && (
        <div className={cn('flex items-center gap-2 py-3 justify-center', isDark ? 'text-white/20' : 'text-black/20')}>
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs">No comments yet</span>
        </div>
      )}
    </div>
  );
}

// ── Service Request Card ──────────────────────────────────

function ServiceRequestCard({ request, isDark, index }: {
  request: ServiceRequest;
  isDark: boolean;
  index: number;
}) {
  const cardCls = cn(
    'rounded-2xl border p-5 transition-all duration-200',
    isDark
      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
      : 'bg-white border-black/[0.06] hover:bg-black/[0.02]',
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cardCls}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: CSS.text }}>
            {request.title}
          </h3>
          <p className={cn('text-xs line-clamp-1 mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
            {request.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', serviceTypeColors[request.type])}>
            {request.type.replace('-', ' ')}
          </Badge>
          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 capitalize', serviceStatusColors[request.status])}>
            {request.status.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Vendor</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: CSS.text }}>{request.vendor}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Budget</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: CSS.accent }}>{formatINR(request.budget)}</p>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Due Date</p>
          <p className="text-xs mt-0.5" style={{ color: CSS.textSecondary }}>{request.dueDate}</p>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <p className={cn('text-[10px] uppercase tracking-wider font-medium mb-1.5', isDark ? 'text-white/30' : 'text-black/30')}>
          Deliverables
        </p>
        <div className="flex flex-wrap gap-1.5">
          {request.deliverables.map((d, i) => (
            <span
              key={i}
              className={cn(
                'text-[10px] px-2 py-0.5 rounded-md',
                isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50',
              )}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────

export default function OperationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Tab state
  const [activeTab, setActiveTab] = useState('content-requests');

  // Content Request filters
  const [statusFilter, setStatusFilter] = useState<ContentRequestStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentRequest['type'] | 'all'>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // ── Filtered Content Requests ────────────────────────────
  const filteredContentRequests = useMemo(() => {
    return mockContentRequests.filter((cr) => {
      if (statusFilter !== 'all' && cr.status !== statusFilter) return false;
      if (typeFilter !== 'all' && cr.type !== typeFilter) return false;
      return true;
    });
  }, [statusFilter, typeFilter]);

  // ── Service Request totals ───────────────────────────────
  const serviceTotals = useMemo(() => {
    const totalBudget = mockServiceRequests.reduce((s, sr) => s + sr.budget, 0);
    const inProgress = mockServiceRequests.filter((sr) => sr.status === 'in-progress').length;
    const completed = mockServiceRequests.filter((sr) => sr.status === 'completed').length;
    return { totalBudget, inProgress, completed, total: mockServiceRequests.length };
  }, []);

  // ── Post-Publish totals ──────────────────────────────────
  const metricsTotals = useMemo(() => {
    return mockPostPublishMetrics.reduce(
      (acc, m) => ({
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        conversions: acc.conversions + m.conversions,
        revenue: acc.revenue + m.revenue,
        engagement: acc.engagement + m.engagement,
      }),
      { impressions: 0, clicks: 0, conversions: 0, revenue: 0, engagement: 0 },
    );
  }, []);

  // ── Pill style helper ────────────────────────────────────
  const pillCls = (active: boolean) =>
    cn(
      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
      active
        ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
        : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]'),
    );

  // ── Content Request Table Columns ────────────────────────
  const contentColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        const isExpanded = expandedRowId === cr.id;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedRowId(isExpanded ? null : cr.id);
              }}
              className={cn(
                'w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0',
                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.08]',
              )}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
            >
              {isExpanded
                ? <ChevronUp className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />
                : <ChevronDown className="w-3.5 h-3.5" style={{ color: CSS.textMuted }} />}
            </button>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>{cr.title}</p>
              {cr.campaignName && (
                <p className={cn('text-[10px] truncate', isDark ? 'text-white/30' : 'text-black/30')}>
                  {cr.campaignName}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', contentTypeColors[cr.type] || 'bg-slate-500/15 text-slate-400')}>
            {cr.type.replace('-', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', contentStatusColors[cr.status] || 'bg-slate-500/15 text-slate-400')}>
            {cr.status.replace('-', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'requester',
      label: 'Requester',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {(row as unknown as ContentRequest).requester}
        </span>
      ),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {(row as unknown as ContentRequest).assignee}
        </span>
      ),
    },
    {
      key: 'campaignName',
      label: 'Campaign',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        return (
          <span className={cn('text-xs', cr.campaignName ? '' : isDark ? 'text-white/20' : 'text-black/20')} style={cr.campaignName ? { color: CSS.textSecondary } : undefined}>
            {cr.campaignName || '—'}
          </span>
        );
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        const isOverdue = new Date(cr.dueDate) < new Date() && cr.status !== 'published' && cr.status !== 'approved';
        return (
          <span className={cn('text-xs', isOverdue && 'text-red-400')} style={isOverdue ? undefined : { color: CSS.textSecondary }}>
            {cr.dueDate}
          </span>
        );
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (row) => {
        const cr = row as unknown as ContentRequest;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', contentPriorityColors[cr.priority] || 'bg-slate-500/15 text-slate-400')}>
            {cr.priority}
          </Badge>
        );
      },
    },
    {
      key: 'version',
      label: 'Version',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: CSS.textMuted }}>
          v{(row as unknown as ContentRequest).version}
        </span>
      ),
    },
  ], [isDark, expandedRowId]);

  // ── Post-Publish Metrics Columns ─────────────────────────
  const metricsColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'contentTitle',
      label: 'Content Title',
      sortable: true,
      render: (row) => {
        const m = row as unknown as PostPublishMetrics;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{m.contentTitle}</p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{m.contentId}</p>
          </div>
        );
      },
    },
    {
      key: 'contentType',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const m = row as unknown as PostPublishMetrics;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', contentTypeColors[m.contentType] || 'bg-slate-500/15 text-slate-400')}>
            {m.contentType.replace('-', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'publishedAt',
      label: 'Published Date',
      sortable: true,
      render: (row) => (
        <span className="text-xs" style={{ color: CSS.textSecondary }}>
          {new Date((row as unknown as PostPublishMetrics).publishedAt).toLocaleDateString('en-IN', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'impressions',
      label: 'Impressions',
      sortable: true,
      type: 'number',
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: CSS.text }}>
          {(row as unknown as PostPublishMetrics).impressions.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'clicks',
      label: 'Clicks',
      sortable: true,
      type: 'number',
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: CSS.text }}>
          {(row as unknown as PostPublishMetrics).clicks.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'ctr',
      label: 'CTR',
      sortable: true,
      type: 'number',
      render: (row) => {
        const m = row as unknown as PostPublishMetrics;
        const ctrColor = m.ctr > 5 ? '#10b981' : m.ctr >= 3 ? '#f59e0b' : '#ef4444';
        return (
          <span className="text-xs font-semibold" style={{ color: ctrColor }}>
            {m.ctr.toFixed(1)}%
          </span>
        );
      },
    },
    {
      key: 'conversions',
      label: 'Conversions',
      sortable: true,
      type: 'number',
      render: (row) => (
        <span className="text-xs font-medium" style={{ color: CSS.text }}>
          {(row as unknown as PostPublishMetrics).conversions.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      type: 'currency',
      render: (row) => (
        <span className="text-xs font-semibold" style={{ color: CSS.accent }}>
          {formatINR((row as unknown as PostPublishMetrics).revenue)}
        </span>
      ),
    },
    {
      key: 'engagement',
      label: 'Engagement',
      sortable: true,
      type: 'number',
      render: (row) => {
        const m = row as unknown as PostPublishMetrics;
        return (
          <span className="text-xs font-medium" style={{ color: CSS.text }}>
            {m.engagement.toFixed(1)}%
          </span>
        );
      },
    },
  ], [isDark]);

  // ── Row click for content requests (expand) ──────────────
  const handleContentRowClick = useCallback((row: Record<string, unknown>) => {
    const cr = row as unknown as ContentRequest;
    setExpandedRowId((prev) => (prev === cr.id ? null : cr.id));
  }, []);

  // ── Render ───────────────────────────────────────────────
  return (
    <PageShell
      title="Operations"
      subtitle="Content workflow & service management"
      icon={Settings2}
      badge={mockContentRequests.length + mockServiceRequests.length}
    >
      <div className="space-y-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* ── Tab Bar ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <TabsList
              className={cn(
                'w-full sm:w-auto rounded-xl p-1',
                isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]',
              )}
            >
              <TabsTrigger
                value="content-requests"
                className="rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Content Requests
              </TabsTrigger>
              <TabsTrigger
                value="service-requests"
                className="rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                NueEra Services
              </TabsTrigger>
              <TabsTrigger
                value="post-publish-metrics"
                className="rounded-lg text-xs gap-1.5 data-[state=active]:shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Post-Publish Metrics
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* ── Tab 1: Content Requests ───────────────────── */}
          <TabsContent value="content-requests">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Filters */}
              <div
                className={cn(
                  'rounded-2xl border p-3 flex flex-wrap gap-4',
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]',
                )}
              >
                {/* Status pills */}
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1.5 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                    Status
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setStatusFilter('all')} className={pillCls(statusFilter === 'all')}>
                      All
                    </button>
                    {contentStatusList.map((s) => (
                      <button key={s} onClick={() => setStatusFilter(s)} className={pillCls(statusFilter === s)}>
                        {s.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-px self-stretch mx-1" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

                {/* Type dropdown */}
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider mb-1.5 font-medium', isDark ? 'text-white/30' : 'text-black/30')}>
                    Type
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setTypeFilter('all')} className={pillCls(typeFilter === 'all')}>
                      All
                    </button>
                    {contentTypeList.map((t) => (
                      <button key={t} onClick={() => setTypeFilter(t)} className={pillCls(typeFilter === t)}>
                        {t.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results count + New Request button */}
              <div className="flex items-center justify-between">
                <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
                  Showing {filteredContentRequests.length} request{filteredContentRequests.length !== 1 ? 's' : ''}
                </p>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs"
                  style={{ backgroundColor: CSS.accent, color: '#ffffff' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Request
                </Button>
              </div>

              {/* Table */}
              <SmartDataTable
                data={filteredContentRequests as unknown as Record<string, unknown>[]}
                columns={contentColumns}
                onRowClick={handleContentRowClick}
                searchable
                searchPlaceholder="Search content requests..."
                enableExport
                pageSize={10}
                density="compact"
                emptyMessage="No content requests match your filters"
              />

              {/* Expanded row details */}
              <AnimatePresence>
                {expandedRowId && (() => {
                  const expandedCr = filteredContentRequests.find((cr) => cr.id === expandedRowId);
                  if (!expandedCr) return null;
                  return (
                    <motion.div
                      key={`expanded-${expandedRowId}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'rounded-2xl border overflow-hidden',
                        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]',
                      )}
                    >
                      <ContentRequestExpanded request={expandedCr} isDark={isDark} />
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* ── Tab 2: NueEra Service Requests ────────────── */}
          <TabsContent value="service-requests">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Budget',
                    value: formatINR(serviceTotals.totalBudget),
                    icon: IndianRupee,
                    color: 'text-amber-400',
                  },
                  {
                    label: 'In Progress',
                    value: serviceTotals.inProgress,
                    icon: Clock,
                    color: 'text-blue-400',
                  },
                  {
                    label: 'Completed',
                    value: serviceTotals.completed,
                    icon: Package,
                    color: 'text-emerald-400',
                  },
                  {
                    label: 'Total Requests',
                    value: serviceTotals.total,
                    icon: AlertCircle,
                    color: 'text-violet-400',
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'rounded-2xl border p-4',
                      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                        {stat.label}
                      </span>
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                        <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold tracking-tight" style={{ color: CSS.text }}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Header with Request Service button */}
              <div className="flex items-center justify-between">
                <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
                  {mockServiceRequests.length} service request{mockServiceRequests.length !== 1 ? 's' : ''}
                </p>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs"
                  style={{ backgroundColor: CSS.accent, color: '#ffffff' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Request Service
                </Button>
              </div>

              {/* Service request cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockServiceRequests.map((sr, i) => (
                  <ServiceRequestCard key={sr.id} request={sr} isDark={isDark} index={i} />
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Tab 3: Post-Publish Metrics ───────────────── */}
          <TabsContent value="post-publish-metrics">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total Impressions', value: metricsTotals.impressions.toLocaleString('en-IN'), icon: Eye, color: 'text-sky-400' },
                  { label: 'Total Clicks', value: metricsTotals.clicks.toLocaleString('en-IN'), icon: ArrowUpRight, color: 'text-blue-400' },
                  { label: 'Total Conversions', value: metricsTotals.conversions.toLocaleString('en-IN'), icon: Settings2, color: 'text-emerald-400' },
                  { label: 'Total Revenue', value: formatINR(metricsTotals.revenue), icon: IndianRupee, color: 'text-amber-400' },
                  { label: 'Avg Engagement', value: `${(metricsTotals.engagement / Math.max(mockPostPublishMetrics.length, 1)).toFixed(1)}%`, icon: BarChart3, color: 'text-violet-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'rounded-2xl border p-4',
                      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                        {stat.label}
                      </span>
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                        <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                      </div>
                    </div>
                    <p className="text-xl font-bold tracking-tight" style={{ color: CSS.text }}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Table */}
              <SmartDataTable
                data={mockPostPublishMetrics as unknown as Record<string, unknown>[]}
                columns={metricsColumns}
                searchable
                searchPlaceholder="Search published content..."
                enableExport
                pageSize={10}
                density="compact"
                emptyMessage="No post-publish metrics available"
              />

              {/* Totals footer row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className={cn(
                  'rounded-2xl border p-4',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]',
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: CSS.text }}>Totals</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Impressions</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: CSS.text }}>{metricsTotals.impressions.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Clicks</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: CSS.text }}>{metricsTotals.clicks.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Conversions</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: CSS.text }}>{metricsTotals.conversions.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Revenue</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: CSS.accent }}>{formatINR(metricsTotals.revenue)}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Avg Engagement</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: CSS.text }}>
                      {(metricsTotals.engagement / Math.max(mockPostPublishMetrics.length, 1)).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
