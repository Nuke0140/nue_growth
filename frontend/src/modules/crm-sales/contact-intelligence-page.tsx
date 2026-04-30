'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockAiInsights, mockContacts } from './data/mock-data';
import AiInsightPanel from './components/ai-insight-panel';
import CustomerHealthScore from './components/customer-health-score';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  BrainCircuit, Sparkles, TrendingUp, TrendingDown,
  ShieldAlert, DollarSign, Zap, Target, Heart,
  ArrowRight, Users,
} from 'lucide-react';

function getHealthDistribution(contacts: typeof mockContacts) {
  return {
    excellent: contacts.filter((c) => c.healthScore > 75).length,
    good: contacts.filter((c) => c.healthScore > 50 && c.healthScore <= 75).length,
    fair: contacts.filter((c) => c.healthScore > 25 && c.healthScore <= 50).length,
    atRisk: contacts.filter((c) => c.healthScore <= 25).length,
    total: contacts.length,
  };
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ContactIntelligencePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);

  const healthDist = useMemo(() => getHealthDistribution(mockContacts), []);

  // Top widgets
  const highIntentContacts = mockContacts.filter((c) => c.aiIntent === 'high');
  const avgBuyingIntent = highIntentContacts.length > 0
    ? Math.round(highIntentContacts.reduce((sum, c) => sum + c.healthScore, 0) / highIntentContacts.length)
    : 0;

  const churnRiskContacts = mockContacts.filter((c) => c.healthScore < 50);
  const totalLtv = mockContacts.reduce((sum, c) => sum + c.healthScore * 12000, 0);

  // Avg response probability from insights
  const responseInsights = mockAiInsights.filter((i) => i.type === 'response_probability');
  const avgResponse = responseInsights.length > 0
    ? Math.round(responseInsights.reduce((sum, i) => sum + (i.score || 0), 0) / responseInsights.length)
    : 72;

  // Top contacts by relationship score (health)
  const topContacts = [...mockContacts]
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5);

  // Next best actions
  const nextBestActions = mockAiInsights
    .filter((i) => i.actionText && i.contactId)
    .slice(0, 5);

  const maxHealthCount = Math.max(healthDist.excellent, healthDist.good, healthDist.fair, healthDist.atRisk, 1);

  const healthBars = [
    { label: 'Excellent', count: healthDist.excellent, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { label: 'Good', count: healthDist.good, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
    { label: 'Fair', count: healthDist.fair, color: 'bg-orange-400', textColor: 'text-orange-400' },
    { label: 'At Risk', count: healthDist.atRisk, color: 'bg-red-400', textColor: 'text-red-400' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-purple-500/10' : 'bg-purple-500/10'
            )}>
              <BrainCircuit className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                  AI Intelligence
                </h1>
                <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-2 h-5 gap-1">
                  <Sparkles className="w-3 h-3" />
                  Powered by AI
                </Badge>
              </div>
              <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
                AI-driven insights and recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        {/* Top widgets row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: 'Buying Intent Score',
              value: `${avgBuyingIntent}%`,
              icon: Target,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
              subtext: `${highIntentContacts.length} high-intent contacts`,
            },
            {
              label: 'Churn Risk Count',
              value: churnRiskContacts.length.toString(),
              icon: ShieldAlert,
              color: 'text-red-400',
              bg: 'bg-red-500/10',
              subtext: 'Health score below 50',
            },
            {
              label: 'LTV Forecast',
              value: formatCurrency(totalLtv),
              icon: DollarSign,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
              subtext: 'Sum of forecasted LTV',
            },
            {
              label: 'Avg Response Probability',
              value: `${avgResponse}%`,
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
              subtext: 'Based on engagement patterns',
            },
          ].map((widget, i) => (
            <motion.div
              key={widget.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'rounded-2xl p-5 transition-all',
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.06]'
                  : 'bg-white border border-black/[0.06] shadow-sm'
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center mb-3',
                widget.bg
              )}>
                <widget.icon className={cn('w-4.5 h-4.5', widget.color)} />
              </div>
              <p className={cn('text-[11px] mb-1', 'text-[var(--app-text-muted)]')}>
                {widget.label}
              </p>
              <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                {widget.value}
              </p>
              <p className={cn('text-[10px] mt-1', 'text-[var(--app-text-muted)]')}>
                {widget.subtext}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* AI Insights grid - takes 2 columns */}
          <div className="xl:col-span-2">
            <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAiInsights.map((insight, i) => (
                <AiInsightPanel key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Customer Health Distribution */}
            <div>
              <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
                <Heart className="w-4 h-4 text-pink-400" />
                Health Distribution
              </h2>
              <div className={cn(
                'rounded-2xl p-5',
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.06]'
                  : 'bg-white border border-black/[0.06] shadow-sm'
              )}>
                <div className="space-y-3">
                  {healthBars.map((bar) => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-xs font-medium', bar.textColor)}>{bar.label}</span>
                        <span className={cn('text-xs font-bold', 'text-[var(--app-text)]')}>
                          {bar.count}
                        </span>
                      </div>
                      <div className={cn(
                        'h-2 rounded-full overflow-hidden',
                        'bg-[var(--app-hover-bg)]'
                      )}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(bar.count / maxHealthCount) * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={cn('h-full rounded-full', bar.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={cn(
                  'mt-4 pt-3 flex items-center justify-between text-[10px]',
                  isDark ? 'border-t border-white/[0.06] text-white/30' : 'border-t border-black/[0.06] text-black/30'
                )}>
                  <span>Total contacts</span>
                  <span className="font-bold">{healthDist.total}</span>
                </div>
              </div>
            </div>

            {/* Next Best Actions */}
            <div>
              <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
                <Zap className="w-4 h-4 text-amber-400" />
                Next Best Actions
              </h2>
              <div className="space-y-2">
                {nextBestActions.map((action, i) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      'rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all group',
                      isDark
                        ? 'bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08]'
                        : 'bg-white border border-black/[0.04] hover:border-black/[0.08] shadow-sm'
                    )}
                    onClick={() => action.contactId && selectContact(action.contactId)}
                  >
                    <span className="text-lg">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs font-medium truncate',
                        'text-[var(--app-text)]'
                      )}>
                        {action.actionText}
                      </p>
                      <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>
                        {action.contactName}
                      </p>
                    </div>
                    <ArrowRight className={cn(
                      'w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity',
                      'text-[var(--app-text-disabled)]'
                    )} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Relationship Strength */}
        <div>
          <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', 'text-[var(--app-text-secondary)]')}>
            <Users className="w-4 h-4 text-cyan-400" />
            Relationship Strength — Top Contacts
          </h2>
          <div className={cn(
            'rounded-2xl p-5',
            isDark
              ? 'bg-white/[0.03] border border-white/[0.06]'
              : 'bg-white border border-black/[0.06] shadow-sm'
          )}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {topContacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'rounded-xl p-4 text-center cursor-pointer transition-all group',
                    isDark
                      ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                      : 'bg-black/[0.01] hover:bg-black/[0.03]'
                  )}
                  onClick={() => selectContact(contact.id)}
                >
                  <CustomerHealthScore
                    score={contact.healthScore}
                    name={contact.firstName}
                    size="sm"
                    showLabel={false}
                  />
                  <p className={cn('text-xs font-medium mt-2 truncate', 'text-[var(--app-text)]')}>
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>
                    {contact.company}
                  </p>
                  <Badge className={cn(
                    'text-[9px] px-1.5 py-0 h-4 mt-1 border-0',
                    contact.aiIntent === 'high'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : contact.aiIntent === 'medium'
                        ? 'bg-amber-500/10 text-amber-400'
                        : contact.aiIntent === 'low'
                          ? 'bg-gray-500/10 text-gray-400'
                          : 'bg-red-500/10 text-red-400'
                  )}>
                    {contact.aiIntent}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
