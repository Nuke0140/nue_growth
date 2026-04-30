'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { mockSegments } from '@/modules/crm-sales/data/mock-data';
import SegmentFilter from '@/modules/crm-sales/system/shared/segment-filter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { SegmentType, SegmentRule } from '@/modules/crm-sales/system/types';
import {
  Search, Plus, Users, TrendingUp, Zap, BarChart3,
  X, ArrowUpDown, RefreshCw,
} from 'lucide-react';

const typeFilters: { key: SegmentType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'vip', label: 'VIP' },
  { key: 'high_intent', label: 'High Intent' },
  { key: 'new_leads', label: 'New Leads' },
  { key: 'repeat_buyers', label: 'Repeat Buyers' },
  { key: 'churn_risk', label: 'Churn Risk' },
  { key: 'inactive', label: 'Inactive' },
];

const fieldOptions = [
  'company.arr', 'health_score', 'ai_intent', 'created_at',
  'total_deals', 'engagement_score', 'lifecycle_stage',
];

const operatorOptions = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'contains', label: 'contains' },
  { value: 'in_last', label: 'in last (days)' },
];

export default function SegmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<SegmentType | 'all'>('all');
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderRules, setBuilderRules] = useState<SegmentRule[]>([
    { field: 'health_score', operator: 'greater_than', value: 80, logic: 'and' },
  ]);
  const [segmentName, setSegmentName] = useState('');

  const filtered = useMemo(() => {
    let data = [...mockSegments];
    if (activeType !== 'all') {
      data = data.filter((s) => s.type === activeType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return data;
  }, [searchQuery, activeType]);

  const totalCustomers = mockSegments.reduce((sum, s) => sum + s.customerCount, 0);
  const largestSegment = [...mockSegments].sort((a, b) => b.customerCount - a.customerCount)[0];
  const fastestGrowing = [...mockSegments].sort((a, b) => b.growthTrend - a.growthTrend)[0];
  const syncedCount = mockSegments.filter((s) => s.isSyncedToCampaign).length;

  const addRule = () => {
    setBuilderRules([
      ...builderRules,
      { field: 'health_score', operator: 'equals', value: '', logic: 'or' },
    ]);
  };

  const removeRule = (index: number) => {
    setBuilderRules(builderRules.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                Segments
              </h1>
              <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
                <Users className="w-4 h-4 inline mr-1" />
                {totalCustomers.toLocaleString()} customers in {mockSegments.length} segments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-[var(--app-radius-lg)] border',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-40',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
            </div>
            <Button
              size="sm"
              onClick={() => setShowBuilder(true)}
              className={cn(
                'rounded-[var(--app-radius-lg)] text-xs h-10  px-4',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Segment
            </Button>
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <BarChart3 className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-disabled)]')} />
          {typeFilters.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setActiveType(tf.key)}
              className={cn(
                'px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors whitespace-nowrap',
                activeType === tf.key
                  ? isDark
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-black/[0.06] text-black'
                  : isDark
                    ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        {/* Analytics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-app-2xl">
          {[
            { label: 'Total Segments', value: mockSegments.length, icon: BarChart3 },
            { label: 'Largest Segment', value: largestSegment?.name || '—', icon: Users },
            { label: 'Fastest Growing', value: `+${fastestGrowing?.growthTrend || 0}%`, icon: TrendingUp },
            { label: 'Campaign Synced', value: `${syncedCount}/${mockSegments.length}`, icon: RefreshCw },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'rounded-[var(--app-radius-lg)] p-4',
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.04]'
                  : 'bg-white border border-black/[0.04] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
                <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
              </div>
              <p className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Segment cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((segment, i) => (
            <SegmentFilter key={segment.id} segment={segment} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Zap className={cn('w-8 h-8 mb-3', 'text-[var(--app-text-disabled)]')} />
            <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No segments found</p>
          </div>
        )}
      </ScrollArea>

      {/* Segment Builder Modal */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className={cn(
          'max-w-lg',
          isDark ? 'bg-[#111] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          <DialogHeader>
            <DialogTitle className={cn('text-[var(--app-text)]')}>
              Create Segment
            </DialogTitle>
            <DialogDescription className={cn('text-[var(--app-text-muted)]')}>
              Define rules to segment your customers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label className={cn('text-xs mb-1.5 block', 'text-[var(--app-text-secondary)]')}>
                Segment Name
              </Label>
              <Input
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="e.g., High-Value Enterprise"
                className={cn(
                  'rounded-[var(--app-radius-lg)] text-sm h-10',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-white/20'
                    : 'bg-black/[0.02] border-black/[0.08] text-black placeholder:text-black/25 focus:border-black/20'
                )}
              />
            </div>

            {/* Rules */}
            <div>
              <Label className={cn('text-xs mb-2 block', 'text-[var(--app-text-secondary)]')}>
                Rules
              </Label>
              <div className="space-y-2">
                {builderRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <select
                        value={rule.logic}
                        onChange={(e) => {
                          const updated = [...builderRules];
                          updated[i] = { ...rule, logic: e.target.value as 'and' | 'or' };
                          setBuilderRules(updated);
                        }}
                        className={cn(
                          'text-[11px] font-mono px-2 py-1.5 rounded-[var(--app-radius-lg)] border bg-transparent',
                          isDark
                            ? 'border-white/10 text-white/50 focus:border-white/20'
                            : 'border-black/10 text-black/50 focus:border-black/20'
                        )}
                      >
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                      </select>
                    )}
                    <select
                      value={rule.field}
                      onChange={(e) => {
                        const updated = [...builderRules];
                        updated[i] = { ...rule, field: e.target.value };
                        setBuilderRules(updated);
                      }}
                      className={cn(
                        'flex-1 text-xs px-2 py-1.5 rounded-[var(--app-radius-lg)] border bg-transparent',
                        isDark
                          ? 'border-white/10 text-white/70 focus:border-white/20'
                          : 'border-black/10 text-black/70 focus:border-black/20'
                      )}
                    >
                      {fieldOptions.map((f) => (
                        <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    <select
                      value={rule.operator}
                      onChange={(e) => {
                        const updated = [...builderRules];
                        updated[i] = { ...rule, operator: e.target.value as SegmentRule['operator'] };
                        setBuilderRules(updated);
                      }}
                      className={cn(
                        'flex-1 text-xs px-2 py-1.5 rounded-[var(--app-radius-lg)] border bg-transparent',
                        isDark
                          ? 'border-white/10 text-white/70 focus:border-white/20'
                          : 'border-black/10 text-black/70 focus:border-black/20'
                      )}
                    >
                      {operatorOptions.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={String(rule.value)}
                      onChange={(e) => {
                        const updated = [...builderRules];
                        updated[i] = { ...rule, value: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) };
                        setBuilderRules(updated);
                      }}
                      placeholder="Value"
                      className={cn(
                        'w-20 text-xs px-2 py-1.5 rounded-[var(--app-radius-lg)] border bg-transparent',
                        isDark
                          ? 'border-white/10 text-white/70 placeholder:text-white/25 focus:border-white/20'
                          : 'border-black/10 text-black/70 placeholder:text-black/25 focus:border-black/20'
                      )}
                    />
                    {builderRules.length > 1 && (
                      <button
                        onClick={() => removeRule(i)}
                        className="p-1 rounded-[var(--app-radius-lg)] hover:bg-red-500/10 text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addRule}
                className={cn(
                  'mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                  isDark
                    ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
                )}
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            {/* Live count preview */}
            <div className={cn(
              'rounded-[var(--app-radius-lg)] p-4',
              isDark ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-black/[0.02] border border-black/[0.04]'
            )}>
              <div className="flex items-center justify-between">
                <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                  Estimated Customers
                </span>
                <div className="flex items-center gap-2">
                  <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                    ~{(Math.random() * 200 + 50).toFixed(0)}
                  </span>
                  <Badge className={cn(
                    'text-[10px] px-2 py-0 h-4',
                    'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                  )}>
                    Preview
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              className={cn(
                'w-full rounded-[var(--app-radius-lg)] h-10',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
              onClick={() => setShowBuilder(false)}
            >
              Save Segment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
