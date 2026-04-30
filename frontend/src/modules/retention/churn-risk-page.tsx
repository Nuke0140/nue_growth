'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, ShieldAlert, Shield, ShieldCheck, Zap, Calendar,
  Phone, ArrowUpRight, IndianRupee, User, Clock, BarChart3,
  AlertCircle, Play, MessageSquare, ChevronRight, Brain
} from 'lucide-react';
import { churnRiskData } from '@/modules/retention/data/mock-data';
import { useRetentionStore } from '@/modules/retention/retention-store';
import type { ChurnRisk } from '@/modules/retention/types';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

export default function ChurnRiskPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigateTo = useRetentionStore((s) => s.navigateTo);

  const summary = useMemo(() => {
    const high = churnRiskData.filter((c) => c.riskLevel === 'high').length;
    const medium = churnRiskData.filter((c) => c.riskLevel === 'medium').length;
    const safe = churnRiskData.filter((c) => c.riskLevel === 'safe').length;
    return { high, medium, safe };
  }, []);

  const churnTrend = useMemo(() => [
    { month: 'Nov', value: 12 },
    { month: 'Dec', value: 10 },
    { month: 'Jan', value: 14 },
    { month: 'Feb', value: 11 },
    { month: 'Mar', value: 9 },
    { month: 'Apr', value: 8 },
  ], []);

  const maxTrend = Math.max(...churnTrend.map((c) => c.value));

  const getRiskBadge = (level: string) => {
    if (level === 'high') return { bg: 'bg-[var(--app-danger-bg)]', text: 'text-red-500', label: 'High' };
    if (level === 'medium') return { bg: 'bg-[var(--app-warning-bg)]', text: 'text-amber-500', label: 'Medium' };
    return { bg: 'bg-[var(--app-success-bg)]', text: 'text-emerald-500', label: 'Safe' };
  };

  const getRiskBarColor = (score: number) => {
    if (score >= 70) return isDark ? 'bg-red-500/40' : 'bg-red-400';
    if (score >= 40) return isDark ? 'bg-amber-500/40' : 'bg-amber-400';
    return isDark ? 'bg-emerald-500/40' : 'bg-emerald-400';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Brain className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Churn Risk</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>AI Churn Prevention</p>
            </div>
          </div>
          <Button
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2 transition-colors',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}
          >
            <Play className="w-4 h-4" />
            Run Analysis
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'High Risk', count: summary.high, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-[var(--app-danger-bg)]', border: isDark ? 'border-red-500/20' : 'border-red-200' },
            { label: 'Medium Risk', count: summary.medium, icon: Shield, color: 'text-amber-400', bg: 'bg-[var(--app-warning-bg)]', border: isDark ? 'border-amber-500/20' : 'border-amber-200' },
            { label: 'Safe', count: summary.safe, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-[var(--app-success-bg)]', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', item.border, isDark ? `bg-white/[0.02] ${item.border}` : `bg-white ${item.border}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-[11px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', item.bg)}>
                  <item.icon className={cn('w-4 h-4', item.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>of {churnRiskData.length} tracked</p>
            </motion.div>
          ))}
        </div>

        {/* Risk Score Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Risk Score Distribution</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {churnRiskData.map((entry, j) => (
              <div key={entry.id} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.riskScore}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.riskScore / 100) * 100}%` }}
                  transition={{ delay: 0.3 + j * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', getRiskBarColor(entry.riskScore))}
                />
                <span className={cn('text-[7px] text-center truncate w-full', 'text-[var(--app-text-disabled)]')}>{entry.client}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Churn Risk Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4 text-red-400')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Churn Risk Details</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  {['Client', 'Industry', 'Risk Score', 'Level', 'Inactive Days', 'Eng Drop', 'Feedback', 'Escalations', 'Value', 'Churn Date', 'Manager', 'Action'].map((h) => (
                    <th key={h} className={cn('text-left text-[10px] font-medium uppercase tracking-wider pb-3 px-2', 'text-[var(--app-text-muted)]')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {churnRiskData.map((entry: ChurnRisk, i) => {
                  const badge = getRiskBadge(entry.riskLevel);
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className={cn(
                        'border-b transition-colors',
                        entry.riskLevel === 'high'
                          ? (isDark ? 'border-red-500/10 hover:bg-red-500/[0.03]' : 'border-red-100 hover:bg-red-50/50')
                          : (isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.01]')
                      )}
                    >
                      <td className="py-3 px-2 text-sm font-medium">{entry.client}</td>
                      <td className="py-3 px-2 text-xs">{entry.industry}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('w-16 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${entry.riskScore}%` }}
                              transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                              className={cn('h-full rounded-full', getRiskBarColor(entry.riskScore))}
                            />
                          </div>
                          <span className="text-[10px] font-medium">{entry.riskScore}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0', badge.bg, badge.text)}>
                            {badge.label}
                          </Badge>
                          {entry.riskLevel === 'high' && (
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-red-500"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-xs">{entry.inactivityDays}</td>
                      <td className="py-3 px-2 text-xs">{entry.engagementDrop}%</td>
                      <td className="py-3 px-2 text-xs">{entry.negativeFeedback}</td>
                      <td className="py-3 px-2 text-xs">{entry.supportEscalations}</td>
                      <td className="py-3 px-2 text-xs font-medium">{formatINR(entry.contractValue)}</td>
                      <td className="py-3 px-2 text-xs">{entry.predictedChurnDate}</td>
                      <td className="py-3 px-2 text-xs">{entry.accountManager}</td>
                      <td className="py-3 px-2 text-xs">{entry.recommendedAction}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* High Risk Action Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className={cn('w-4 h-4 text-red-400')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>High Risk — Immediate Actions</span>
          </div>
          <div className="space-y-2">
            {churnRiskData.filter((c) => c.riskLevel === 'high').map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05, duration: 0.3 }}
                className={cn(
                  'flex items-center justify-between p-3 rounded-[var(--app-radius-lg)] border',
                  isDark ? 'border-red-500/15 bg-red-500/[0.03]' : 'border-red-200 bg-red-50/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', isDark ? 'bg-red-500/15' : 'bg-red-100')}>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{entry.client}</p>
                    <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{entry.recommendedAction}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[10px] gap-1 rounded-[var(--app-radius-lg)]">
                    <MessageSquare className="w-4 h-4" /> Send Win-back
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] gap-1 rounded-[var(--app-radius-lg)]">
                    <Phone className="w-4 h-4" /> Schedule Call
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] gap-1 rounded-[var(--app-radius-lg)] border-red-300 text-red-500 hover:bg-red-50">
                    <AlertCircle className="w-4 h-4" /> Escalate
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Churn Trend Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Churn Trend Over Time</span>
            </div>
            <Badge variant="secondary" className={cn('text-[10px]', 'bg-[var(--app-success-bg)] text-[var(--app-success)]')}>
              Improving ↓
            </Badge>
          </div>
          <div className="flex items-end gap-2 h-32">
            {churnTrend.map((entry, j) => (
              <div key={j} className="flex-1 flex flex-col justify-end items-center gap-1">
                <span className={cn('text-[9px] font-medium', 'text-[var(--app-text-muted)]')}>{entry.value}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(entry.value / maxTrend) * 100}%` }}
                  transition={{ delay: 0.65 + j * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('w-full rounded-t-sm', isDark ? 'bg-red-500/30' : 'bg-red-400')}
                />
                <span className={cn('text-[9px]', 'text-[var(--app-text-disabled)]')}>{entry.month}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
