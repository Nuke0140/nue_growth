'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  DollarSign,
  AlertTriangle,
  Zap,
  Shield,
  Users,
  Clock,
  TrendingUp,
  Building,
  Lightbulb,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';
import { PageShell } from './components/ops/page-shell';
import { mockAiInsights } from './data/mock-data';
import type { AiOpsSeverity, AiOpsType, ErpPage } from './types';
import { useErpStore } from './erp-store';

// ---- Severity config ----
const severityConfig: Record<AiOpsSeverity, { gradient: string; border: string; dot: string; label: string }> = {
  critical: {
    gradient: 'bg-gradient-to-r from-red-600/20 via-red-500/10 to-transparent',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    label: 'Critical',
  },
  high: {
    gradient: 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
    label: 'High',
  },
  medium: {
    gradient: 'bg-gradient-to-r from-sky-600/20 via-sky-500/10 to-transparent',
    border: 'border-sky-500/20',
    dot: 'bg-sky-500',
    label: 'Medium',
  },
  low: {
    gradient: 'bg-gradient-to-r from-neutral-600/20 via-neutral-500/10 to-transparent',
    border: 'border-neutral-500/20',
    dot: 'bg-neutral-500',
    label: 'Low',
  },
};

// ---- Type → icon mapping ----
const typeIconMap: Record<AiOpsType, typeof DollarSign> = {
  cost_anomaly: DollarSign,
  risk_prediction: AlertTriangle,
  optimization: Zap,
  compliance: Shield,
  resource_alert: Users,
  delivery_risk: Clock,
  revenue_forecast: TrendingUp,
  vendor_risk: Building,
};

const typeLabelMap: Record<AiOpsType, string> = {
  cost_anomaly: 'Cost Anomaly',
  risk_prediction: 'Risk Prediction',
  optimization: 'Optimization',
  compliance: 'Compliance',
  resource_alert: 'Resource Alert',
  delivery_risk: 'Delivery Risk',
  revenue_forecast: 'Revenue Forecast',
  vendor_risk: 'Vendor Risk',
};

const typeColorMap: Record<AiOpsType, string> = {
  cost_anomaly: 'text-red-500 dark:text-red-400',
  risk_prediction: 'text-amber-500 dark:text-amber-400',
  optimization: 'text-emerald-500 dark:text-emerald-400',
  compliance: 'text-amber-500 dark:text-amber-400',
  resource_alert: 'text-sky-500 dark:text-sky-400',
  delivery_risk: 'text-red-500 dark:text-red-400',
  revenue_forecast: 'text-emerald-500 dark:text-emerald-400',
  vendor_risk: 'text-orange-500 dark:text-orange-400',
};

// ---- Filter type ----
type FilterKey = 'all' | AiOpsSeverity;
const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

// ---- Confidence Ring Component ----
function ConfidenceRing({ value, size = 44 }: { value: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ops-border)"
          strokeWidth="3"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-[var(--ops-text)]">{value}%</span>
      </div>
    </div>
  );
}

// ---- Stat Mini Card ----
function StatMiniCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: typeof Sparkles; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'ops-card rounded-2xl p-4 border',
        accent ? 'border-red-500/20' : 'border-[var(--ops-border)]'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-[var(--ops-text-muted)] uppercase tracking-wider">
          {label}
        </span>
        <div className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center',
          accent ? 'bg-red-500/15' : 'bg-[var(--ops-hover-bg)]'
        )}>
          <Icon className={cn('w-4 h-4', accent ? 'text-red-500 dark:text-red-400' : 'text-[var(--ops-text-muted)]')} />
        </div>
      </div>
      <p className={cn('text-2xl font-bold', accent && 'text-red-500 dark:text-red-400')}>{value}</p>
    </motion.div>
  );
}

// ---- Main Page ----
function AiOpsPageInner() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const navigateTo = useErpStore((s) => s.navigateTo);

  // Filter insights
  const filtered = useMemo(() => {
    if (activeFilter === 'all') return mockAiInsights;
    return mockAiInsights.filter((i) => i.severity === activeFilter);
  }, [activeFilter]);

  // Stats
  const stats = useMemo(() => {
    const critical = mockAiInsights.filter((i) => i.severity === 'critical').length;
    const high = mockAiInsights.filter((i) => i.severity === 'high').length;
    const avgConfidence = Math.round(
      mockAiInsights.reduce((s, i) => s + i.confidence, 0) / mockAiInsights.length
    );
    const uniqueAreas = new Set(mockAiInsights.flatMap((i) => i.affectedEntities)).size;
    return { critical, high, avgConfidence, uniqueAreas };
  }, []);

  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = { all: mockAiInsights.length, critical: 0, high: 0, medium: 0, low: 0 };
    mockAiInsights.forEach((i) => { counts[i.severity]++; });
    return counts;
  }, []);

  return (
    <PageShell title="AI Operations" icon={Brain} headerRight={
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--ops-hover-bg)] border border-[var(--ops-border)]">
        <Filter className="w-3.5 h-3.5 text-[var(--ops-text-muted)] ml-2 mr-1" />
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              activeFilter === f.key
                ? 'bg-[var(--ops-hover-bg)] text-[var(--ops-text)] shadow-sm'
                : 'text-[var(--ops-text-muted)] hover:text-[var(--ops-text-secondary)]'
            )}
          >
            {f.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-bold',
              activeFilter === f.key ? 'bg-[var(--ops-hover-bg)]' : 'bg-[var(--ops-hover-bg)]'
            )}>
              {filterCounts[f.key]}
            </span>
          </button>
        ))}
      </div>
    }>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        {/* ---- Stats Summary ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatMiniCard label="Critical Alerts" value={stats.critical} icon={AlertTriangle} accent={stats.critical > 0} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatMiniCard label="High Priority" value={stats.high} icon={Zap} accent={stats.high > 0} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StatMiniCard label="Confidence Avg" value={`${stats.avgConfidence}%`} icon={Sparkles} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatMiniCard label="Affected Areas" value={stats.uniqueAreas} icon={Users} />
          </motion.div>
        </div>

        {/* ---- Insight Cards Grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((insight, idx) => {
            const sev = severityConfig[insight.severity];
            const TypeIcon = typeIconMap[insight.type];

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'ops-card rounded-2xl overflow-hidden border transition-all duration-200 hover:scale-[1.005]',
                  insight.severity === 'critical' ? 'ops-glow' : '',
                  sev.border
                )}
              >
                {/* Severity banner */}
                <div className={cn('h-1.5 w-full', sev.gradient)} />

                <div className="p-5 space-y-4">
                  {/* Card header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--ops-hover-bg)] flex items-center justify-center shrink-0">
                        <TypeIcon className={cn('w-5 h-5', typeColorMap[insight.type])} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn('text-[10px] font-semibold uppercase tracking-wider', typeColorMap[insight.type])}>
                            {typeLabelMap[insight.type]}
                          </span>
                          <span className={cn(
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border',
                            insight.severity === 'critical'
                              ? 'bg-red-500/15 text-red-300 border-red-500/20'
                              : insight.severity === 'high'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                                : insight.severity === 'medium'
                                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/20'
                                  : 'bg-neutral-500/15 text-neutral-300 border-neutral-500/20'
                          )}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', sev.dot)} />
                            {sev.label}
                          </span>
                        </div>
                        <h3 className={cn(
                          'text-[15px] font-semibold leading-snug text-[var(--ops-text)]',
                          insight.severity === 'critical' && 'text-red-300'
                        )}>
                          {insight.title}
                        </h3>
                      </div>
                    </div>
                    {/* Confidence ring */}
                    <ConfidenceRing value={insight.confidence} />
                  </div>

                  {/* Description */}
                  <p className="text-[13px] leading-relaxed text-[var(--ops-text-secondary)]">
                    {insight.description}
                  </p>

                  {/* Affected entities */}
                  <div className="flex flex-wrap gap-1.5">
                    {insight.affectedEntities.map((entity) => (
                      <span
                        key={entity}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--ops-hover-bg)] text-[var(--ops-text-secondary)] border border-[var(--ops-border)]"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div className="rounded-xl bg-[var(--ops-accent-light)] border border-[rgba(204,92,55,0.12)] p-3 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[var(--ops-accent)]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ops-accent)]">
                        Recommendation
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-[var(--ops-text-secondary)]">
                      {insight.recommendation}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--ops-border)]">
                    <span className="text-[11px] text-[var(--ops-text-disabled)]">
                      Generated just now
                    </span>
                    <button
                      onClick={() => {
                        // Navigate based on insight type
                        const pageMap: Partial<Record<AiOpsType, ErpPage>> = {
                          resource_alert: 'employees',
                          delivery_risk: 'projects',
                          cost_anomaly: 'payroll',
                          vendor_risk: 'approvals',
                        };
                        const target = pageMap[insight.type];
                        if (target) navigateTo(target);
                      }}
                      className={cn(
                        'h-8 px-4 rounded-lg flex items-center gap-1.5 text-[12px] font-medium transition-all duration-200',
                        'bg-[var(--ops-accent)] text-white hover:bg-[var(--ops-accent)]/90 shadow-sm shadow-[var(--ops-accent)]/20'
                      )}
                    >
                      Take Action
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ops-card rounded-2xl border border-[var(--ops-border)] py-20 flex flex-col items-center justify-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--ops-hover-bg)] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[var(--ops-text-disabled)]" />
            </div>
            <p className="text-sm font-medium text-[var(--ops-text-muted)]">No insights for this filter</p>
            <p className="text-xs text-[var(--ops-text-disabled)] mt-1">Try selecting a different severity level</p>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}

export default memo(AiOpsPageInner);
