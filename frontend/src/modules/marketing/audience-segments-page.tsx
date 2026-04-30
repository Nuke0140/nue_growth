'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSegments } from '@/modules/marketing/data/mock-data';
import {
  Users, Plus, TrendingUp, TrendingDown, Filter,
  Save, Trash2, ChevronDown, ArrowUpRight, Link2,
  BarChart3, ShieldOff, Search, MoreHorizontal, RefreshCw,
} from 'lucide-react';

// ---- KPI Card Component ----
function KPICard({ label, value, subtitle, isDark }: {
  label: string; value: string; subtitle: string; isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
    >
      <p className={cn('text-xs font-medium mb-1', 'text-[var(--app-text-muted)]')}>{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{subtitle}</p>
    </motion.div>
  );
}

// ---- Segment Card Component ----
function SegmentCard({ segment, index, isDark }: {
  segment: typeof mockSegments[0]; index: number; isDark: boolean;
}) {
  return (
    <motion.div
      key={segment.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 group cursor-pointer transition-colors',
        'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
            'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
          )}>
            {segment.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{segment.name}</h3>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              Created {segment.createdAt}
            </p>
          </div>
        </div>
        <button className={cn('p-1 rounded-lg transition-colors',
          'hover:bg-[var(--app-hover-bg)]'
        )}>
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Rules Summary */}
      <div className={cn('rounded-xl p-3 mb-3', 'bg-[var(--app-hover-bg)]')}>
        <div className="flex items-center gap-1.5 mb-2">
          <Filter className="w-3 h-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Rules</span>
          <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
            {segment.operator}
          </Badge>
        </div>
        <div className="space-y-1">
          {segment.rules.map((rule, ri) => (
            <div key={ri} className={cn('text-xs flex items-center gap-1.5',
              'text-[var(--app-text-secondary)]'
            )}>
              <span className="font-medium">{rule.field}</span>
              <span className={cn('text-[var(--app-text-muted)]')}>{rule.operator}</span>
              <span className="truncate">{rule.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Count + Growth */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
          <span className="text-lg font-bold">{segment.count.toLocaleString()}</span>
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>contacts</span>
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
          segment.growth >= 0
            ? 'text-emerald-500 bg-emerald-500/10'
            : 'text-red-500 bg-red-500/10'
        )}>
          {segment.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {segment.growth >= 0 ? '+' : ''}{segment.growth}%
        </div>
      </div>

      {/* Synced Campaigns */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Link2 className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
            {segment.syncedCampaigns.length} synced campaign{segment.syncedCampaigns.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button className={cn('text-xs flex items-center gap-1 transition-colors',
          'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
        )}>
          View <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ---- Rule Builder Panel ----
interface RuleDraft {
  field: string;
  operator: string;
  value: string;
}

function RuleBuilderPanel({ isDark }: { isDark: boolean }) {
  const [rules, setRules] = useState<RuleDraft[]>([
    { field: 'company_size', operator: 'greater-than', value: '100' },
  ]);
  const [operator, setOperator] = useState<'AND' | 'OR'>('AND');
  const [saved, setSaved] = useState(false);

  const fields = ['company_size', 'job_title', 'industry', 'city', 'income_bracket', 'engagement_score', 'last_active', 'trial_status', 'login_count_7d', 'feature_usage', 'cart_value', 'total_purchases', 'lifetime_value', 'nps_score', 'whatsapp_opt_in'];
  const operators = ['equals', 'not-equals', 'greater-than', 'less-than', 'in', 'not-in', 'contains', 'starts-with'];

  const addRule = () => setRules([...rules, { field: fields[0], operator: operators[0], value: '' }]);
  const removeRule = (idx: number) => setRules(rules.filter((_, i) => i !== idx));
  const updateRule = (idx: number, key: keyof RuleDraft, val: string) => {
    const next = [...rules];
    next[idx] = { ...next[idx], [key]: val };
    setRules(next);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const estimatedCount = rules.length > 0 ? Math.floor(Math.random() * 8000 + 1000).toLocaleString() : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Rule Builder</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* AND/OR Toggle */}
          <div className={cn('flex rounded-lg p-0.5 text-xs', 'bg-[var(--app-hover-bg)]')}>
            {(['AND', 'OR'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperator(op)}
                className={cn('px-3 py-1 rounded-md font-medium transition-all',
                  operator === op
                    ? isDark ? 'bg-white/[0.1] text-white' : 'bg-black/[0.08] text-black'
                    : 'text-[var(--app-text-muted)]'
                )}
              >
                {op}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleSave} className="h-7 text-xs gap-1">
            <Save className="w-3 h-3" />
            {saved ? 'Saved!' : 'Save Segment'}
          </Button>
        </div>
      </div>

      {/* Live Count Preview */}
      <div className={cn('rounded-xl p-3 mb-4 flex items-center justify-between',
        isDark ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'
      )}>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium">Estimated Audience</span>
        </div>
        <span className="text-sm font-bold text-emerald-500">{estimatedCount} contacts</span>
      </div>

      {/* Rules List */}
      <div className="space-y-2 mb-4">
        {rules.map((rule, idx) => (
          <div key={idx} className={cn('flex items-center gap-2 rounded-xl p-3',
            'bg-[var(--app-hover-bg)]'
          )}>
            <div className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
              {idx > 0 ? operator : 'IF'}
            </div>
            <select
              value={rule.field}
              onChange={(e) => updateRule(idx, 'field', e.target.value)}
              className={cn('text-xs px-2 py-1.5 rounded-lg border bg-transparent flex-1 max-w-[140px]',
                isDark ? 'border-white/[0.06] text-white/80' : 'border-black/[0.06] text-black/80'
              )}
            >
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={rule.operator}
              onChange={(e) => updateRule(idx, 'operator', e.target.value)}
              className={cn('text-xs px-2 py-1.5 rounded-lg border bg-transparent flex-1 max-w-[130px]',
                isDark ? 'border-white/[0.06] text-white/80' : 'border-black/[0.06] text-black/80'
              )}
            >
              {operators.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              type="text"
              value={rule.value}
              onChange={(e) => updateRule(idx, 'value', e.target.value)}
              placeholder="Value..."
              className={cn('text-xs px-2 py-1.5 rounded-lg border bg-transparent flex-1',
                isDark ? 'border-white/[0.06] text-white/80 placeholder:text-white/20' : 'border-black/[0.06] text-black/80 placeholder:text-black/20'
              )}
            />
            <button
              onClick={() => removeRule(idx)}
              className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Rule Button */}
      <Button variant="outline" size="sm" onClick={addRule} className="w-full h-8 text-xs gap-1.5">
        <Plus className="w-3 h-3" />
        Add Rule
      </Button>
    </motion.div>
  );
}

// ---- Main Page ----
export default function AudienceSegmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return mockSegments;
    const q = searchQuery.toLowerCase();
    return mockSegments.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rules.some(r => r.field.toLowerCase().includes(q) || r.value.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const kpiData = useMemo(() => {
    const totalSegments = mockSegments.length;
    const totalAudience = mockSegments.reduce((a, s) => a + s.count, 0);
    const avgSize = Math.round(totalAudience / totalSegments);
    const syncedCampaigns = new Set(mockSegments.flatMap(s => s.syncedCampaigns)).size;
    return { totalSegments, totalAudience, avgSize, syncedCampaigns };
  }, []);

  // Growth chart data (6 months)
  const growthData = [
    { month: 'Nov', value: 38200 },
    { month: 'Dec', value: 41500 },
    { month: 'Jan', value: 44300 },
    { month: 'Feb', value: 48900 },
    { month: 'Mar', value: 54200 },
    { month: 'Apr', value: 63982 },
  ];
  const growthMax = Math.max(...growthData.map(d => d.value));

  // Exclusion lists
  const exclusionLists = [
    { id: 'ex-1', name: 'Unsubscribed Contacts', count: 2847, lastUpdated: '2026-04-12' },
    { id: 'ex-2', name: 'Bounced Emails', count: 1234, lastUpdated: '2026-04-11' },
    { id: 'ex-3', name: 'Spam Complainers', count: 456, lastUpdated: '2026-04-10' },
    { id: 'ex-4', name: 'DNC — Regulatory', count: 892, lastUpdated: '2026-04-09' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight">Audience Segments</h1>
            <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
              Build dynamic segments using rule-based audience engine
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Sync All
            </Button>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Create Segment
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Segments" value={String(kpiData.totalSegments)} subtitle="Active segments" isDark={isDark} />
          <KPICard label="Total Audience" value={kpiData.totalAudience.toLocaleString()} subtitle="Combined reach" isDark={isDark} />
          <KPICard label="Avg Segment Size" value={kpiData.avgSize.toLocaleString()} subtitle="Contacts per segment" isDark={isDark} />
          <KPICard label="Synced Campaigns" value={String(kpiData.syncedCampaigns)} subtitle="Active integrations" isDark={isDark} />
        </div>

        {/* Search */}
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full max-w-sm',
          'bg-[var(--app-card-bg)] border-[var(--app-border)]'
        )}>
          <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn('bg-transparent text-sm focus:outline-none w-full',
              'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
            )}
          />
        </div>

        {/* Segment Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((segment, i) => (
            <SegmentCard key={segment.id} segment={segment} index={i} isDark={isDark} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <Users className={cn('w-8 h-8 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
              <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No segments found</p>
            </div>
          )}
        </div>

        {/* Rule Builder Panel */}
        <RuleBuilderPanel isDark={isDark} />

        {/* Segment Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Segment Growth</h3>
            </div>
            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Last 6 months</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {growthData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / growthMax) * 120}px` }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-lg min-h-[4px]',
                    'bg-[var(--app-hover-bg)]'
                  )}
                />
                <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t"
            style={{ borderColor: 'var(--app-hover-bg)' }}
          >
            <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              38.2K → 64.0K total audience
            </span>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <TrendingUp className="w-3 h-3" />
              +67.5% growth
            </div>
          </div>
        </motion.div>

        {/* Exclusion Lists */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldOff className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Exclusion Lists</h3>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Plus className="w-3 h-3" />
              Add List
            </Button>
          </div>
          <div className="space-y-2">
            {exclusionLists.map((list, i) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn('flex items-center justify-between p-3 rounded-xl transition-colors',
                  isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-black/[0.01] hover:bg-black/[0.03]'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center',
                    'bg-[var(--app-danger-bg)]'
                  )}>
                    <ShieldOff className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{list.name}</p>
                    <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                      Updated {list.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{list.count.toLocaleString()}</span>
                  <button className={cn('text-xs p-1 rounded-lg transition-colors',
                    isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.04] text-black/40'
                  )}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
