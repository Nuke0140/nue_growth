'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CSS, ANIMATION } from '@/styles/design-tokens';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Heart,
  Gift,
  Award,
  Copy,
  Crown,
  Medal,
  Trophy,
  Link2,
  Tag,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CircleDollarSign,
  UserMinus,
  Repeat,
  Eye,
  Plus,
  Filter,
} from 'lucide-react';
import {
  mockSegments,
  mockRetentionMetrics,
  mockLoyaltyMembers,
  mockCoupons,
  mockReferrals,
} from '@/modules/marketing/data/mock-data';
import type {
  AudienceSegment,
  LoyaltyMember,
  Coupon,
  ReferralEntry,
} from '@/modules/marketing/types';

// ── INR Formatter ─────────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

// ── Tab Type ──────────────────────────────────────────────

type AudienceTab = 'segments' | 'retention' | 'referrals';

// ── Tier Color Map ────────────────────────────────────────

const tierColors: Record<LoyaltyMember['tier'], string> = {
  bronze: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
  silver: 'bg-slate-400/15 text-slate-500 dark:text-slate-300',
  gold: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  platinum: 'bg-violet-500/15 text-violet-500 dark:text-violet-400',
  diamond: 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400',
};

// ── Coupon Type Badge Colors ──────────────────────────────

const couponTypeColors: Record<string, string> = {
  percentage: 'bg-sky-500/15 text-sky-500 dark:text-sky-400',
  flat: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
  'free-shipping': 'bg-violet-500/15 text-violet-500 dark:text-violet-400',
};

const couponStatusColors: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
  expired: 'bg-red-500/15 text-red-500 dark:text-red-400',
  redeemed: 'bg-slate-500/15 text-slate-400',
};

// ── Sub-components ────────────────────────────────────────

function KPICard({ label, value, icon: Icon, color, isDark, index }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  isDark: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn('text-[11px] font-medium uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
          {label}
        </span>
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <Icon className={cn('w-3.5 h-3.5', color)} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: CSS.text }}>{value}</p>
    </motion.div>
  );
}

function ChurnIndicator({ rate, isDark }: { rate: number; isDark: boolean }) {
  const color = rate > 10 ? 'text-red-500' : rate >= 5 ? 'text-amber-500' : 'text-emerald-500';
  const bgColor = rate > 10 ? 'bg-red-500/10' : rate >= 5 ? 'bg-amber-500/10' : 'bg-emerald-500/10';
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold', bgColor, color)}>
      {rate > 10 ? <ArrowUpRight className="w-3 h-3" /> : rate < 5 ? <ArrowDownRight className="w-3 h-3" /> : null}
      {rate}%
    </span>
  );
}

function CohortChart({ data, isDark }: { data: { month: string; rate: number }[]; isDark: boolean }) {
  const maxRate = Math.max(...data.map((d) => d.rate));

  return (
    <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
      <div className="flex items-center gap-2 mb-4">
        <BarChartIcon className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
        <h3 className={cn('text-sm font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>Retention Cohort</h3>
      </div>
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => {
          const heightPct = maxRate > 0 ? (d.rate / maxRate) * 100 : 0;
          const barColor =
            d.rate >= 85
              ? 'bg-emerald-500'
              : d.rate >= 75
                ? 'bg-amber-500'
                : 'bg-red-500';
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
                {d.rate}%
              </span>
              <div className="w-full flex items-end" style={{ height: '100px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-lg min-h-[4px]', barColor)}
                />
              </div>
              <span className={cn('text-[9px] text-center leading-tight', isDark ? 'text-white/30' : 'text-black/30')}>
                {d.month.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function CouponCard({ coupon, isDark }: { coupon: Coupon; isDark: boolean }) {
  const usagePct = coupon.maxUsage > 0 ? Math.round((coupon.usageCount / coupon.maxUsage) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.01]'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <code className={cn('text-sm font-mono font-bold', isDark ? 'text-white/90' : 'text-black/90')}>
              {coupon.code}
            </code>
            <button
              onClick={() => navigator.clipboard?.writeText(coupon.code)}
              className={cn('p-1 rounded-md transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}
              aria-label={`Copy ${coupon.code}`}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <p className={cn('text-lg font-bold mt-1', isDark ? 'text-white/80' : 'text-black/80')}>
            {coupon.discount}
          </p>
        </div>
        <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', couponTypeColors[coupon.type] || 'bg-slate-500/15 text-slate-400')}>
          {coupon.type}
        </Badge>
      </div>

      {/* Usage bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Usage</span>
          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
            {coupon.usageCount.toLocaleString()} / {coupon.maxUsage.toLocaleString()}
          </span>
        </div>
        <div className={cn('w-full h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              usagePct > 80 ? 'bg-red-500' : usagePct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(usagePct, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CalendarClock className={cn('w-3 h-3', isDark ? 'text-white/25' : 'text-black/25')} />
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{coupon.expiry}</span>
        </div>
        <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', couponStatusColors[coupon.status] || 'bg-slate-500/15 text-slate-400')}>
          {coupon.status}
        </Badge>
      </div>
    </motion.div>
  );
}

// ── Tab Content Components ────────────────────────────────

function SegmentsTab({ isDark }: { isDark: boolean }) {
  const [typeFilter, setTypeFilter] = useState<'all' | 'static' | 'dynamic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);

  const filteredSegments = useMemo(() => {
    return mockSegments.filter((s) => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [typeFilter, searchQuery]);

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{seg.name}</p>
            <p className={cn('text-[10px] truncate max-w-[200px]', isDark ? 'text-white/30' : 'text-black/30')}>
              {seg.operator} · {seg.rules.length} rule{seg.rules.length !== 1 ? 's' : ''}
            </p>
          </div>
        );
      },
    },
    {
      key: 'rules',
      label: 'Rules Summary',
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        const summary = seg.rules.slice(0, 2).map((r) => `${r.field} ${r.operator} ${r.value}`).join(', ');
        const extra = seg.rules.length > 2 ? ` +${seg.rules.length - 2}` : '';
        return (
          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
            {summary}{extra}
          </span>
        );
      },
    },
    {
      key: 'audienceCount',
      label: 'Audience',
      sortable: true,
      type: 'number',
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        return (
          <span className="text-sm font-medium" style={{ color: CSS.text }}>
            {seg.audienceCount.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'growth',
      label: 'Growth',
      sortable: true,
      type: 'number',
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        const isPositive = seg.growth >= 0;
        return (
          <span className={cn('text-sm font-semibold flex items-center gap-1', isPositive ? 'text-emerald-500' : 'text-red-500')}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {isPositive ? '+' : ''}{seg.growth}%
          </span>
        );
      },
    },
    {
      key: 'syncedCampaigns',
      label: 'Campaigns',
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        return (
          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>
            {seg.syncedCampaigns.length}
          </span>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        const typeColor = seg.type === 'dynamic'
          ? 'bg-sky-500/15 text-sky-500 dark:text-sky-400'
          : 'bg-slate-500/15 text-slate-400';
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', typeColor)}>
            {seg.type || 'static'}
          </Badge>
        );
      },
    },
    {
      key: 'lastSynced',
      label: 'Last Synced',
      sortable: true,
      render: (row) => {
        const seg = row as unknown as AudienceSegment;
        return (
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
            {seg.lastSynced || '—'}
          </span>
        );
      },
    },
  ], [isDark]);

  const handleRowClick = (row: Record<string, unknown>) => {
    const seg = row as unknown as AudienceSegment;
    setExpandedSegment(expandedSegment === seg.id ? null : seg.id);
  };

  const pillCls = (active: boolean) =>
    cn(
      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
      active
        ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
        : (isDark ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-black/[0.06] text-black/50 hover:bg-black/[0.1]')
    );

  return (
    <div className="space-y-5">
      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 max-w-sm',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
          )}>
            <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
            <input
              type="text"
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
              )}
              aria-label="Search segments"
            />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <Filter className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
            <button onClick={() => setTypeFilter('all')} className={pillCls(typeFilter === 'all')}>All</button>
            <button onClick={() => setTypeFilter('dynamic')} className={pillCls(typeFilter === 'dynamic')}>Dynamic</button>
            <button onClick={() => setTypeFilter('static')} className={pillCls(typeFilter === 'static')}>Static</button>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-black/50')}>
        Showing {filteredSegments.length} segment{filteredSegments.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <SmartDataTable
        data={filteredSegments as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={handleRowClick}
        searchable={false}
        enableExport
        pageSize={10}
        density="compact"
        emptyMessage="No segments match your filters"
      />

      {/* Expanded segment detail */}
      <AnimatePresence>
        {expandedSegment && (() => {
          const seg = mockSegments.find((s) => s.id === expandedSegment);
          if (!seg) return null;
          return (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: CSS.text }}>{seg.name}</h3>
                    <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                      {seg.audienceCount.toLocaleString()} members · {seg.operator} logic
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', seg.type === 'dynamic' ? 'bg-sky-500/15 text-sky-500 dark:text-sky-400' : 'bg-slate-500/15 text-slate-400')}>
                    {seg.type || 'static'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Rules</p>
                  {seg.rules.map((rule) => (
                    <div key={rule.id} className={cn('flex items-center gap-2 rounded-lg px-3 py-2', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                      <span className="text-xs font-medium" style={{ color: CSS.text }}>{rule.field}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 dark:text-amber-400 font-medium')}>
                        {rule.operator}
                      </span>
                      <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>{rule.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/25' : 'text-black/25')}>Synced Campaigns</p>
                    <p className="text-sm font-medium" style={{ color: CSS.text }}>{seg.syncedCampaigns.length}</p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/25' : 'text-black/25')}>Growth</p>
                    <p className={cn('text-sm font-semibold', seg.growth >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                      {seg.growth >= 0 ? '+' : ''}{seg.growth}%
                    </p>
                  </div>
                  <div>
                    <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/25' : 'text-black/25')}>Last Synced</p>
                    <p className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{seg.lastSynced || '—'}</p>
                  </div>
                  {seg.tags && seg.tags.length > 0 && (
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/25' : 'text-black/25')}>Tags</p>
                      <div className="flex gap-1 mt-0.5">
                        {seg.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className={cn('text-[9px] px-1.5 py-0', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function RetentionTab({ isDark }: { isDark: boolean }) {
  const retention = mockRetentionMetrics;

  // Loyalty members table columns
  const loyaltyColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{m.name}</p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{m.email}</p>
          </div>
        );
      },
    },
    {
      key: 'points',
      label: 'Points',
      sortable: true,
      type: 'number',
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return (
          <span className="text-sm font-semibold" style={{ color: CSS.text }}>
            {m.points.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'tier',
      label: 'Tier',
      sortable: true,
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return (
          <Badge variant="secondary" className={cn('text-[9px] px-2 py-0.5 capitalize', tierColors[m.tier])}>
            {m.tier}
          </Badge>
        );
      },
    },
    {
      key: 'couponsRedeemed',
      label: 'Coupons',
      sortable: true,
      type: 'number',
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>{m.couponsRedeemed}</span>;
      },
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      type: 'currency',
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return <span className="text-sm font-medium" style={{ color: CSS.text }}>{formatINR(m.totalSpent)}</span>;
      },
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      type: 'date',
      render: (row) => {
        const m = row as unknown as LoyaltyMember;
        return <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{m.joinDate}</span>;
      },
    },
  ], [isDark]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Churn Rate"
          value={retention.churnRate + '%'}
          icon={UserMinus}
          color={retention.churnRate > 10 ? 'text-red-500' : retention.churnRate >= 5 ? 'text-amber-500' : 'text-emerald-500'}
          isDark={isDark}
          index={0}
        />
        <KPICard
          label="Repeat Purchase"
          value={retention.repeatPurchaseRate + '%'}
          icon={Repeat}
          color="text-sky-400"
          isDark={isDark}
          index={1}
        />
        <KPICard
          label="Avg LTV"
          value={formatINR(retention.avgLifetimeValue)}
          icon={CircleDollarSign}
          color="text-amber-400"
          isDark={isDark}
          index={2}
        />
        <KPICard
          label="Inactive Users"
          value={retention.inactiveUsers.toLocaleString()}
          icon={UserMinus}
          color="text-red-400"
          isDark={isDark}
          index={3}
        />
      </div>

      {/* Churn rate indicator */}
      <div className="flex items-center gap-3">
        <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Churn Status:</span>
        <ChurnIndicator rate={retention.churnRate} isDark={isDark} />
        <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
          {retention.churnRate > 10 ? 'Critical — immediate action needed' : retention.churnRate >= 5 ? 'Moderate — monitor closely' : 'Healthy — within target range'}
        </span>
      </div>

      {/* Cohort Chart */}
      <CohortChart data={retention.cohortData} isDark={isDark} />

      {/* Loyalty Members Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>Loyalty Members</h3>
          <span className={cn('text-xs px-2 py-0.5 rounded-lg', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
            {mockLoyaltyMembers.length}
          </span>
        </div>
        <SmartDataTable
          data={mockLoyaltyMembers as unknown as Record<string, unknown>[]}
          columns={loyaltyColumns}
          searchable={false}
          pageSize={5}
          density="compact"
          emptyMessage="No loyalty members"
        />
      </div>

      {/* Coupons Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>Coupons</h3>
          <span className={cn('text-xs px-2 py-0.5 rounded-lg', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.06] text-black/40')}>
            {mockCoupons.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferralsTab({ isDark }: { isDark: boolean }) {
  const rankStyles: Record<number, { bg: string; icon: React.ElementType; label: string }> = {
    1: { bg: 'bg-yellow-500/15 text-yellow-500 dark:text-yellow-400', icon: Trophy, label: '1st' },
    2: { bg: 'bg-slate-400/15 text-slate-400 dark:text-slate-300', icon: Medal, label: '2nd' },
    3: { bg: 'bg-amber-700/15 text-amber-600 dark:text-amber-500', icon: Crown, label: '3rd' },
  };

  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      type: 'number',
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        const style = rankStyles[ref.rank];
        if (style) {
          const RankIcon = style.icon;
          return (
            <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-lg', style.bg)}>
              <RankIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{style.label}</span>
            </div>
          );
        }
        return (
          <span className={cn('text-sm font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
            #{ref.rank}
          </span>
        );
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        return (
          <div>
            <p className="text-sm font-medium" style={{ color: CSS.text }}>{ref.name}</p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{ref.email}</p>
          </div>
        );
      },
    },
    {
      key: 'referralCode',
      label: 'Referral Code',
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        return (
          <div className="flex items-center gap-1.5">
            <code className={cn('text-xs font-mono', isDark ? 'text-white/70' : 'text-black/70')}>{ref.referralCode}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(ref.referralCode)}
              className={cn('p-1 rounded-md transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/25' : 'hover:bg-black/[0.06] text-black/25')}
              aria-label={`Copy ${ref.referralCode}`}
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        );
      },
    },
    {
      key: 'totalReferrals',
      label: 'Referrals',
      sortable: true,
      type: 'number',
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        return (
          <span className="text-sm font-medium" style={{ color: CSS.text }}>
            {ref.totalReferrals}
          </span>
        );
      },
    },
    {
      key: 'conversions',
      label: 'Conversions',
      sortable: true,
      type: 'number',
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        return (
          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>
            {ref.conversions}
          </span>
        );
      },
    },
    {
      key: 'earnings',
      label: 'Earnings',
      sortable: true,
      type: 'currency',
      render: (row) => {
        const ref = row as unknown as ReferralEntry;
        return (
          <span className="text-sm font-semibold" style={{ color: CSS.text }}>
            {formatINR(ref.earnings)}
          </span>
        );
      },
    },
  ], [isDark]);

  // Summary stats
  const totalReferrals = mockReferrals.reduce((s, r) => s + r.totalReferrals, 0);
  const totalConversions = mockReferrals.reduce((s, r) => s + r.conversions, 0);
  const totalEarnings = mockReferrals.reduce((s, r) => s + r.earnings, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          label="Total Referrals"
          value={totalReferrals.toLocaleString()}
          icon={Link2}
          color="text-sky-400"
          isDark={isDark}
          index={0}
        />
        <KPICard
          label="Conversions"
          value={totalConversions.toLocaleString()}
          icon={Users}
          color="text-emerald-400"
          isDark={isDark}
          index={1}
        />
        <KPICard
          label="Total Earnings"
          value={formatINR(totalEarnings)}
          icon={CircleDollarSign}
          color="text-amber-400"
          isDark={isDark}
          index={2}
        />
      </div>

      {/* Leaderboard header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className={cn('w-4 h-4', isDark ? 'text-yellow-400/60' : 'text-yellow-500/60')} />
          <h3 className={cn('text-sm font-semibold', isDark ? 'text-white/80' : 'text-black/80')}>Referral Leaderboard</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-8 gap-1.5 text-xs', isDark ? 'text-white/50 hover:text-white hover:bg-white/[0.06]' : 'text-black/50 hover:text-black hover:bg-black/[0.06]')}
        >
          <Plus className="w-3.5 h-3.5" />
          Create Referral Program
        </Button>
      </div>

      {/* Leaderboard table */}
      <SmartDataTable
        data={mockReferrals as unknown as Record<string, unknown>[]}
        columns={columns}
        searchable={false}
        pageSize={10}
        density="compact"
        emptyMessage="No referral entries"
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────

export default function AudiencePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<AudienceTab>('segments');

  const tabs: { id: AudienceTab; label: string; icon: React.ElementType }[] = [
    { id: 'segments', label: 'Segments', icon: Users },
    { id: 'retention', label: 'Retention & Loyalty', icon: Heart },
    { id: 'referrals', label: 'Referrals', icon: Link2 },
  ];

  return (
    <PageShell
      title="Audience"
      subtitle="Segments, retention & loyalty"
      icon={Users}
      badge={mockSegments.length}
      onCreate={undefined}
    >
      <div className="space-y-5">
        {/* Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'flex items-center gap-1 rounded-2xl border p-1',
            isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center',
                  isActive
                    ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm')
                    : (isDark ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.03]')
                )}
                aria-label={tab.label}
                aria-selected={isActive}
                role="tab"
              >
                <TabIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'segments' && <SegmentsTab isDark={isDark} />}
            {activeTab === 'retention' && <RetentionTab isDark={isDark} />}
            {activeTab === 'referrals' && <ReferralsTab isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
