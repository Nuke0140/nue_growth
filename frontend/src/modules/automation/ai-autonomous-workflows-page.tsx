'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  BrainCircuit, Sparkles, Settings, History, Activity, TrendingUp,
  Zap, Clock, Target, BarChart3, ArrowRight, Bot, Lightbulb,
} from 'lucide-react';
import AIWorkflowInsight from './components/ai-workflow-insight';
import { aiWorkflows } from './data/mock-data';

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; textColor: string; label: string; pulse: boolean }> = {
  active: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', textColor: 'text-emerald-400', label: 'Active', pulse: false },
  learning: { color: 'text-amber-400', bgColor: 'bg-amber-500/15', textColor: 'text-amber-400', label: 'Learning', pulse: true },
  paused: { color: 'text-zinc-400', bgColor: 'bg-zinc-500/15', textColor: 'text-zinc-400', label: 'Paused', pulse: false },
};

export default function AiAutonomousWorkflowsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const activeCount = aiWorkflows.filter((w) => w.status === 'active').length;
  const totalDecisions = aiWorkflows.reduce((sum, w) => sum + w.metrics.decisionsMade, 0);
  const avgAccuracy = aiWorkflows.length > 0
    ? Math.round(aiWorkflows.reduce((sum, w) => sum + w.metrics.accuracy, 0) / aiWorkflows.length * 10) / 10
    : 0;
  const totalTimeSaved = aiWorkflows.reduce((sum, w) => sum + w.metrics.timeSaved, 0);

  const card = cn(
    'rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] p-4 sm:p-app-xl',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  function formatTimestamp(ts: string) {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-app-2xl max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
            AI Autonomous Workflows
          </h1>
          <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
            Your AI workflow intelligence layer
          </p>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active AI Workflows', value: activeCount, icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/15' },
            { label: 'Decisions Made', value: totalDecisions.toLocaleString(), icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/15' },
            { label: 'Accuracy', value: `${avgAccuracy}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { label: 'Time Saved', value: `${totalTimeSaved}h`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-[var(--app-radius-lg)]', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Workflow Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              AI Workflows
            </h2>
          </div>

          {aiWorkflows.map((workflow, i) => {
            const statusConf = STATUS_CONFIG[workflow.status];

            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] p-4 sm:p-app-xl space-y-4',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                        {workflow.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        statusConf.bgColor, statusConf.textColor,
                      )}>
                        {statusConf.pulse && (
                          <span className="relative flex h-2 w-2">
                            <motion.span
                              className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                              animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                          </span>
                        )}
                        {statusConf.label}
                      </span>
                    </div>
                    <p className={cn('text-xs line-clamp-2', 'text-[var(--app-text-muted)]')}>
                      {workflow.description}
                    </p>
                  </div>

                  {/* Glow effect for active */}
                  {workflow.status === 'active' && (
                    <div className="shrink-0">
                      <motion.div
                        className={cn('flex h-10 w-10 items-center justify-center rounded-[var(--app-radius-lg)]', statusConf.bgColor)}
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(16, 185, 129, 0)',
                            '0 0 12px 4px rgba(16, 185, 129, 0.15)',
                            '0 0 0 0 rgba(16, 185, 129, 0)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className={cn('h-5 w-5', statusConf.textColor)} />
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Capability Label */}
                <div className={cn(
                  'inline-flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5',
                  isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200',
                )}>
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span className={cn('text-[10px] font-semibold text-purple-400')}>
                    {workflow.capability}
                  </span>
                </div>

                {/* Confidence Score */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Confidence Score
                    </p>
                    <span className={cn(
                      'text-xs font-bold',
                      workflow.confidence >= 90 ? 'text-emerald-400' :
                      workflow.confidence >= 80 ? 'text-amber-400' : 'text-red-400',
                    )}>
                      {workflow.confidence}%
                    </span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${workflow.confidence}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        workflow.confidence >= 90 ? 'bg-emerald-500' :
                        workflow.confidence >= 80 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                    />
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Decisions', value: workflow.metrics.decisionsMade.toLocaleString(), icon: Target },
                    { label: 'Accuracy', value: `${workflow.metrics.accuracy}%`, icon: TrendingUp },
                    { label: 'Time Saved', value: `${workflow.metrics.timeSaved}h`, icon: Zap },
                    { label: 'Impact', value: workflow.metrics.impact, icon: BarChart3 },
                  ].map((metric) => (
                    <div key={metric.label} className={cn('rounded-[var(--app-radius-lg)] p-2.5', 'bg-[var(--app-hover-bg)]')}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <metric.icon className={cn('h-3 w-3', 'text-[var(--app-text-muted)]')} />
                        <p className={cn('text-[9px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                          {metric.label}
                        </p>
                      </div>
                      <p className={cn('text-xs font-semibold truncate', isDark ? 'text-zinc-200' : 'text-zinc-700')}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Decision Examples */}
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                    Recent Decisions
                  </p>
                  <div className="space-y-2">
                    {workflow.examples.map((example, ei) => (
                      <div
                        key={ei}
                        className={cn(
                          'rounded-[var(--app-radius-lg)] border p-3',
                          'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-[11px]">
                          {/* Input */}
                          <div className={cn(
                            'flex-1 rounded-[var(--app-radius-lg)] px-2.5 py-1.5',
                            isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700',
                          )}>
                            <span className={cn('text-[8px] font-bold uppercase tracking-wider block mb-0.5', isDark ? 'text-blue-400/60' : 'text-blue-500/60')}>
                              Input
                            </span>
                            {example.input}
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-3.5 w-3.5 text-purple-400 shrink-0 hidden sm:block mx-1" />
                          <ArrowRight className="h-3.5 w-3.5 text-purple-400 shrink-0 sm:hidden rotate-90 my-0.5" />

                          {/* AI Action */}
                          <div className={cn(
                            'flex-1 rounded-[var(--app-radius-lg)] px-2.5 py-1.5',
                            isDark ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700',
                          )}>
                            <span className={cn('text-[8px] font-bold uppercase tracking-wider block mb-0.5', isDark ? 'text-purple-400/60' : 'text-purple-500/60')}>
                              AI Action
                            </span>
                            {example.aiAction}
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 hidden sm:block mx-1" />
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 sm:hidden rotate-90 my-0.5" />

                          {/* Outcome */}
                          <div className={cn(
                            'flex-1 rounded-[var(--app-radius-lg)] px-2.5 py-1.5',
                            isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
                          )}>
                            <span className={cn('text-[8px] font-bold uppercase tracking-wider block mb-0.5', isDark ? 'text-emerald-400/60' : 'text-emerald-500/60')}>
                              Outcome
                            </span>
                            {example.outcome}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Decision + Actions */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Clock className={cn('h-3 w-3', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-[var(--app-text-muted)]')}>
                      Last decision: {workflow.lastDecision ? formatTimestamp(workflow.lastDecision) : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
                        'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25',
                      )}
                    >
                      <Settings className="h-3 w-3" />
                      Configure
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] hover:bg-[var(--app-active-bg)]',
                      )}
                    >
                      <History className="h-3 w-3" />
                      View History
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Insights Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-purple-400" />
            <h2 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              AI Insights & Recommendations
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[
              { title: 'Lead Qualification Accuracy Improving', description: 'The lead scoring model has improved by 3.2% over the last 7 days after the latest training data update.', confidence: 0.94, impact: 'high' as const, action: 'Continue monitoring. Consider expanding the training dataset with recent conversions.', metric: 'Accuracy', metricValue: '94.2%' },
              { title: 'Invoice Routing Backlog Detected', description: 'Smart Invoice Routing has 23 pending invoices older than 4 hours. Approval chain bottleneck on CapEx invoices.', confidence: 0.87, impact: 'medium' as const, action: 'Add a secondary approver for CapEx invoices to reduce bottleneck.', metric: 'Pending', metricValue: '23' },
              { title: 'Churn Model Needs Retraining', description: 'Accuracy has dropped from 91% to 89.5% over the last month. New client segments not well represented in training data.', confidence: 0.82, impact: 'high' as const, action: 'Schedule model retraining with Q4 client data. Add enterprise segment as a new feature.', metric: 'Accuracy', metricValue: '89.5%' },
              { title: 'Support Triage Response Time Optimal', description: 'Average auto-resolution time is 28 seconds. 45% of tickets resolved without human intervention this week.', confidence: 0.96, impact: 'low' as const, action: 'Consider expanding auto-resolution scope to include refund request templates.', metric: 'Auto-resolved', metricValue: '45%' },
            ].map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
              >
                <AIWorkflowInsight
                  title={insight.title}
                  description={insight.description}
                  confidence={insight.confidence}
                  impact={insight.impact}
                  action={insight.action}
                  metric={insight.metric}
                  metricValue={insight.metricValue}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Monitoring Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'rounded-[var(--app-radius-xl)] border border-l-4 border-l-purple-500 p-4 sm:p-app-xl',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-[var(--app-radius-lg)]', 'bg-[var(--app-purple-light)]')}>
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                AI Monitoring Status
              </h3>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                AI is actively monitoring {activeCount} workflows across 6 modules
              </p>
            </div>
            <div className={cn(
              'ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0',
              'bg-[var(--app-success-bg)] text-[var(--app-success)]',
            )}>
              <Activity className="h-3 w-3" />
              Active
            </div>
          </div>

          <div className={cn('rounded-[var(--app-radius-lg)] p-3', 'bg-[var(--app-hover-bg)]')}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Active Models', value: activeCount },
                { label: 'Learning Models', value: aiWorkflows.filter((w) => w.status === 'learning').length },
                { label: 'Total Decisions', value: totalDecisions.toLocaleString() },
                { label: 'Avg Confidence', value: `${avgAccuracy}%` },
              ].map((item) => (
                <div key={item.label}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>
                    {item.label}
                  </p>
                  <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className={cn('text-xs mt-3 leading-relaxed', 'text-[var(--app-text-muted)]')}>
            AI is actively monitoring 47 workflows across 6 modules. The system continuously learns from decision outcomes and adjusts confidence thresholds. Models are automatically retrained when accuracy drops below 85% for more than 7 consecutive days.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
