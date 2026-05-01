'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  ShieldAlert, AlertTriangle, Search, CheckCircle2,
  Clock, Bot, Activity,
} from 'lucide-react';
import AnomalyAlertCard from './components/anomaly-alert-card';
import { anomalies } from './data/mock-data';

const FILTER_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low', 'New', 'Investigating'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const STATUS_BADGE_STYLES: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400',
  investigating: 'bg-amber-500/15 text-amber-400',
  resolved: 'bg-emerald-500/15 text-emerald-400',
};

export default function AnomalyDetectionPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filteredAnomalies = useMemo(() => {
    if (activeFilter === 'All') return anomalies;
    if (activeFilter === 'New') return anomalies.filter((a) => a.status === 'new');
    if (activeFilter === 'Investigating') return anomalies.filter((a) => a.status === 'investigating');
    return anomalies.filter((a) => a.severity === activeFilter.toLowerCase());
  }, [activeFilter]);

  const criticalCount = anomalies.filter((a) => a.severity === 'critical').length;
  const highCount = anomalies.filter((a) => a.severity === 'high').length;
  const investigatingCount = anomalies.filter((a) => a.status === 'investigating').length;
  const resolvedCount = anomalies.filter((a) => a.status === 'resolved').length;

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
  );

  // Sort anomalies by detectedAt descending for timeline
  const sortedAnomalies = [...anomalies].sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime(),
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-zinc-900')}>
            Anomaly Detection
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            AI-powered anomaly monitoring
          </p>
        </div>

        {/* Summary KPIs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Critical', value: criticalCount, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/15' },
            { label: 'High', value: highCount, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/15' },
            { label: 'Investigating', value: investigatingCount, icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/15' },
            { label: 'Resolved', value: resolvedCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter, i) => {
            const count = filter === 'All'
              ? anomalies.length
              : filter === 'New'
                ? anomalies.filter((a) => a.status === 'new').length
                : filter === 'Investigating'
                  ? anomalies.filter((a) => a.status === 'investigating').length
                  : anomalies.filter((a) => a.severity === filter.toLowerCase()).length;
            return (
              <motion.button
                key={filter}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer',
                  activeFilter === filter
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : isDark
                      ? 'bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/[0.1]'
                      : 'bg-black/[0.03] text-zinc-600 border border-black/[0.06] hover:bg-black/[0.06]',
                )}
              >
                {filter}
                <span className={cn('text-[10px] rounded-full px-1.5 py-0.5', activeFilter === filter ? 'bg-blue-500/20' : isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]')}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Anomaly Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAnomalies.map((anomaly, i) => (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
            >
              <AnomalyAlertCard
                title={anomaly.title}
                description={anomaly.description}
                severity={anomaly.severity}
                detectedAt={new Date(anomaly.detectedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                metric={anomaly.metric}
                expected={anomaly.expected}
                actual={anomaly.actual}
                recommendation={anomaly.recommendation}
              />
            </motion.div>
          ))}
        </div>

        {/* Timeline View */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className={cn('w-4 h-4', isDark ? 'text-zinc-400' : 'text-zinc-500')} />
            <h2 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
              Timeline
            </h2>
          </div>
          <div className="space-y-2">
            {sortedAnomalies.map((anomaly, i) => {
              const detectedDate = new Date(anomaly.detectedAt);
              const dateStr = detectedDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              });
              const timeStr = detectedDate.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3',
                    isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]',
                  )}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-1">
                    <div className={cn(
                      'h-2.5 w-2.5 rounded-full shrink-0',
                      anomaly.severity === 'critical' ? 'bg-red-500' :
                      anomaly.severity === 'high' ? 'bg-orange-500' :
                      anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500',
                    )} />
                    {i < sortedAnomalies.length - 1 && (
                      <div className={cn('w-0.5 h-8 mt-1', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={cn('text-xs font-semibold truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                        {anomaly.title}
                      </h4>
                      <span className={cn('inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider', STATUS_BADGE_STYLES[anomaly.status])}>
                        {anomaly.status}
                      </span>
                    </div>
                    <div className={cn('flex items-center gap-2 mt-1 text-[10px]', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                      <span>{dateStr}</span>
                      <span>·</span>
                      <span>{timeStr}</span>
                      <span>·</span>
                      <span>Deviation: {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={cn(
            'rounded-2xl border border-l-4 border-l-purple-500 p-4 sm:p-5',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isDark ? 'bg-purple-500/15' : 'bg-purple-50')}>
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                AI Monitoring Status
              </h3>
              <p className={cn('text-xs', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                Real-time anomaly detection across all departments
              </p>
            </div>
            <div className={cn('ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold', isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
              <Activity className="w-3 h-3" />
              Active
            </div>
          </div>
          <div
            className={cn(
              'rounded-xl p-3',
              isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]',
            )}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Metrics Monitored', value: '47' },
                { label: 'Departments', value: '6' },
                { label: 'Anomalies Today', value: anomalies.length.toString() },
              ].map((item) => (
                <div key={item.label}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-zinc-500' : 'text-zinc-400')}>
                    {item.label}
                  </p>
                  <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className={cn('text-xs mt-3 leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
            AI is monitoring 47 metrics across 6 departments. The system uses statistical analysis and machine learning models to detect anomalies in real-time. Critical thresholds are calibrated to your business baselines from the last 90 days.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
