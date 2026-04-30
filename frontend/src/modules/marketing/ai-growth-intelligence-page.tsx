'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles, TrendingUp, AlertTriangle, BarChart3, Zap, Target,
  Brain, ArrowRight, Check, AlertCircle, Shield, Eye,
  Megaphone, Users, PieChart, Search
} from 'lucide-react';
import { mockAIGrowthInsights } from '@/modules/marketing/data/mock-data';
import type { AIGrowthInsight } from '@/modules/marketing/types';

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  'channel-recommendation': <BarChart3 className="w-5 h-5" />,
  'budget-optimization': <PieChart className="w-5 h-5" />,
  'trend-prediction': <TrendingUp className="w-5 h-5" />,
  'churn-campaign': <AlertTriangle className="w-5 h-5" />,
  'fatigue-detection': <Eye className="w-5 h-5" />,
  'roi-improvement': <Zap className="w-5 h-5" />,
  'audience-expansion': <Users className="w-5 h-5" />,
  'content-optimization': <Megaphone className="w-5 h-5" />,
};

const INSIGHT_COLORS: Record<string, string> = {
  'channel-recommendation': '#3b82f6',
  'budget-optimization': '#f59e0b',
  'trend-prediction': '#10b981',
  'churn-campaign': '#ef4444',
  'fatigue-detection': '#8b5cf6',
  'roi-improvement': '#f97316',
  'audience-expansion': '#06b6d4',
  'content-optimization': '#ec4899',
};

const IMPACT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'low': { label: 'Low', color: 'text-gray-500', bg: 'bg-gray-100' },
  'medium': { label: 'Medium', color: 'text-blue-500', bg: 'bg-blue-100' },
  'high': { label: 'High', color: 'text-amber-500', bg: 'bg-amber-100' },
  'critical': { label: 'Critical', color: 'text-red-500', bg: 'bg-red-100' },
};

const BUDGET_CHANNELS = [
  { channel: 'Google Ads', current: 32.5, recommended: 28.0, color: '#ea4335' },
  { channel: 'YouTube', current: 12.0, recommended: 22.0, color: '#ff0000' },
  { channel: 'Meta', current: 18.0, recommended: 14.0, color: '#1877f2' },
  { channel: 'WhatsApp', current: 15.0, recommended: 18.0, color: '#25d366' },
  { channel: 'LinkedIn', current: 14.0, recommended: 10.0, color: '#0a66c2' },
  { channel: 'Email', current: 8.5, recommended: 8.0, color: '#f59e0b' },
];

const CHURN_ACCOUNTS = [
  { account: 'TechCorp Solutions', risk: 94, reason: 'Login frequency dropped 82% in 30 days', action: 'CSM outreach + discount' },
  { account: 'MediCare Analytics', risk: 91, reason: 'Support tickets up 340%, feature usage down', action: 'Priority support + product demo' },
  { account: 'EduNext Technologies', risk: 87, reason: 'No activity for 45 days, contract expiring', action: 'Renewal incentive + check-in call' },
  { account: 'FinEdge Capital', risk: 83, reason: 'Team size reduced from 15 to 4 users', action: 'Downgrade offer + training session' },
  { account: 'RetailPro Industries', risk: 79, reason: 'Missed 3 consecutive payment deadlines', action: 'Payment plan + feature review' },
];

const TREND_PREDICTIONS = [
  { topic: 'AI-Powered Personalization', engagement: 94, trend: '+32%', category: 'Technology' },
  { topic: 'WhatsApp Commerce Growth', engagement: 89, trend: '+68%', category: 'Platform' },
  { topic: 'Short-Form Video Marketing', engagement: 86, trend: '+45%', category: 'Content' },
  { topic: 'Sustainability Marketing', engagement: 72, trend: '+28%', category: 'Trend' },
];

const FATIGUE_MAP = [
  { segment: 'Enterprise DMs', frequency: '12/mo', threshold: '3/wk', status: 'critical' },
  { segment: 'Free Trial Users', frequency: '8/mo', threshold: '4/wk', status: 'warning' },
  { segment: 'Dormant Users', frequency: '6/mo', threshold: '2/wk', status: 'normal' },
  { segment: 'Premium Customers', frequency: '4/mo', threshold: '2/wk', status: 'normal' },
  { segment: 'New Signups', frequency: '3/mo', threshold: '1/wk', status: 'healthy' },
  { segment: 'VIP Partners', frequency: '2/mo', threshold: '1/wk', status: 'healthy' },
];

export default function AiGrowthIntelligencePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [appliedInsights, setAppliedInsights] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);

  const handleApply = (id: string) => {
    setAppliedInsights(prev => new Set(prev).add(id));
  };

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  const fatigueStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600';
      case 'warning': return isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600';
      case 'normal': return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'healthy': return 'bg-[var(--app-success-bg)] text-[var(--app-success)]';
      default: return '';
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-violet-600">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={cn('text-xl font-semibold', 'text-[var(--app-text)]')}>AI Growth Intelligence</h1>
            <p className={cn('text-sm', isDark ? 'text-white/50' : 'text-gray-500')}>AI-powered insights and predictions for growth optimization</p>
          </div>
        </div>
        <Button
          onClick={handleRunAnalysis}
          className={cn('gap-2 self-start', analyzing ? 'bg-purple-600' : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700', 'text-white')}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Analysis
            </>
          )}
        </Button>
      </motion.div>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border p-5 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-fuchsia-500/10 border-purple-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-purple-300">AI Growth Summary</h2>
            <p className={cn('text-sm leading-relaxed', 'text-[var(--app-text-secondary)]')}>
              Analysis of 90-day data reveals <span className="font-medium text-purple-300">8 actionable insights</span> with a combined potential ROI of{' '}
              <span className="font-medium text-purple-300">₹21.5L/month</span>. Key opportunities include YouTube budget reallocation, WhatsApp Commerce expansion in Tier-2 cities, and cart abandonment flow optimization.{' '}
              <span className="text-red-400 font-medium">89 accounts flagged for churn risk</span> — immediate retention action recommended.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Insight Cards Grid */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Growth Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockAIGrowthInsights.map((insight, i) => {
            const color = INSIGHT_COLORS[insight.type] || '#6b7280';
            const impactCfg = IMPACT_CONFIG[insight.impact] || IMPACT_CONFIG['low'];
            const isApplied = appliedInsights.has(insight.id);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-5 space-y-3',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]',
                  isApplied && 'ring-1 ring-emerald-500/30'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
                      <div style={{ color }}>{INSIGHT_ICONS[insight.type] || <Search className="w-5 h-5" />}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>{insight.title}</h3>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', impactCfg.color, impactCfg.bg)}>
                    {impactCfg.label}
                  </span>
                </div>

                <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/50' : 'text-gray-600')}>
                  {insight.description}
                </p>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Confidence</span>
                    <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-secondary)]')}>{insight.confidence}%</span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: color, width: `${insight.confidence}%` }} />
                  </div>
                </div>

                {/* Recommendation */}
                <div className={cn('rounded-lg p-2.5', isDark ? 'bg-white/[0.03]' : 'bg-gray-50')}>
                  <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/50' : 'text-gray-600')}>
                    <span className="font-medium">Recommendation: </span>{insight.recommendation}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                    Potential ROI: <span className="text-emerald-500">₹{(insight.potentialROI / 1000).toFixed(0)}K</span>
                  </span>
                  <Button
                    size="sm"
                    variant={isApplied ? 'outline' : 'default'}
                    className={cn('text-xs h-7 gap-1', isApplied ? 'border-emerald-500/50 text-emerald-500' : 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700')}
                    onClick={() => handleApply(insight.id)}
                  >
                    {isApplied ? <><Check className="w-3 h-3" /> Applied</> : 'Apply'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Budget Optimization Panel */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Budget Optimization — Channel Allocation</h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-3 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-gray-300')} />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-emerald-500" />
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Recommended</span>
            </div>
          </div>
          <div className="space-y-3">
            {BUDGET_CHANNELS.map((ch, i) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>{ch.channel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={'text-[var(--app-text-muted)]'}>{ch.current}%</span>
                    <ArrowRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-gray-300')} />
                    <span className="font-medium text-emerald-500">{ch.recommended}%</span>
                  </div>
                </div>
                <div className="relative h-2">
                  <div className={cn('absolute inset-0 rounded-full', 'bg-[var(--app-hover-bg)]')} />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ch.current}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ backgroundColor: ch.color, opacity: 0.3 }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ch.recommended}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 left-0 h-full rounded-full bg-emerald-500 opacity-70"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Churn Prediction */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>
          <AlertTriangle className="w-4 h-4 inline-block mr-1 text-red-400" />
          Churn Prediction — Flagged Accounts
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
        >
          {CHURN_ACCOUNTS.map((acc, i) => (
            <motion.div
              key={acc.account}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.25 }}
              className={cn('flex items-center gap-4 p-4', i < CHURN_ACCOUNTS.length - 1 && (isDark ? 'border-b border-white/[0.04]' : 'border-b border-gray-100'))}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn('text-sm font-medium truncate', 'text-[var(--app-text)]')}>{acc.account}</p>
                </div>
                <p className={cn('text-[11px] truncate', 'text-[var(--app-text-muted)]')}>{acc.reason}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className={cn('text-xs font-bold', acc.risk > 90 ? 'text-red-500' : acc.risk > 85 ? 'text-orange-500' : 'text-amber-500')}>
                      {acc.risk}%
                    </span>
                    <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>risk</span>
                  </div>
                </div>
                <div className={cn('hidden sm:block text-[10px] px-2 py-1 rounded-lg max-w-[140px]', isDark ? 'bg-white/[0.04] text-white/50' : 'bg-gray-50 text-gray-600')}>
                  {acc.action}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Trend Predictions */}
        <div>
          <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Content Trend Predictions</h2>
          <div className="space-y-3">
            {TREND_PREDICTIONS.map((trend, i) => (
              <motion.div
                key={trend.topic}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>{trend.topic}</h3>
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{trend.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">{trend.trend}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className={cn('w-full h-2 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trend.engagement}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                      />
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-medium shrink-0', isDark ? 'text-white/50' : 'text-gray-600')}>{trend.engagement}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Audience Fatigue Map */}
        <div>
          <h2 className={cn('text-sm font-medium mb-3', 'text-[var(--app-text-secondary)]')}>Audience Fatigue Map</h2>
          <div className={cn('rounded-2xl border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className="grid grid-cols-2 gap-3">
              {FATIGUE_MAP.map((item, i) => (
                <motion.div
                  key={item.segment}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('rounded-xl border p-3 space-y-1.5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-gray-50/50 border-gray-100')}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-medium', isDark ? 'text-white/80' : 'text-gray-800')}>{item.segment}</span>
                    <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded-full', fatigueStatusColor(item.status))}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Freq: {item.frequency}</span>
                    <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Max: {item.threshold}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
