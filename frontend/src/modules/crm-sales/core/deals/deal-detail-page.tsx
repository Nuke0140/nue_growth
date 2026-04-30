'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Building2, Calendar, Clock, AlertTriangle, DollarSign, User,
  BrainCircuit, ArrowRight, ArrowLeftRight, Edit3, Plus,
  Video, BarChart3, Handshake, Target, TrendingUp, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { mockDeals, mockActivities } from '@/modules/crm-sales/data/mock-data';
import type { DealStage } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const STAGE_LABELS: Record<DealStage, string> = {
  new: 'New', qualified: 'Qualified', demo: 'Demo', proposal: 'Proposal',
  negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
};

const STAGES: DealStage[] = ['new', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost'];

function getStageColor(stage: DealStage, isDark: boolean): string {
  const map: Record<DealStage, string> = {
    new: 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]',
    qualified: 'bg-[var(--app-info-bg)] text-[var(--app-info)]',
    demo: isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-50 text-purple-700',
    proposal: isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700',
    negotiation: 'bg-[var(--app-success-bg)] text-[var(--app-success)]',
    won: isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    lost: isDark ? 'bg-red-500/15 text-red-300' : 'bg-red-50 text-red-700',
  };
  return map[stage];
}

const ACTIVITY_ICONS: Record<string, string> = {
  call: '📞',
  email: '✉️',
  meeting: '📅',
  demo: '🎯',
  proposal: '📄',
  note: '📝',
  whatsapp: '💬',
  website_visit: '🌐',
  file_share: '📎',
  payment: '💳',
};

export default function DealDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedDealId } = useCrmSalesStore();

  const deal = useMemo(() => mockDeals.find(d => d.id === selectedDealId), [selectedDealId]);

  if (!deal) {
    return (
      <div className={cn('flex items-center justify-center h-full', 'text-[var(--app-text-muted)]')}>
        <p className="text-sm">Deal not found</p>
      </div>
    );
  }

  const activities = mockActivities.filter(a =>
    a.companyName === deal.company || a.contactName === deal.contactName
  ).slice(0, 8);

  const similarDeals = mockDeals.filter(
    d => d.id !== deal.id && d.stage === deal.stage
  ).slice(0, 3);

  const currentStageIndex = STAGES.indexOf(deal.stage);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-app-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                  {deal.name}
                </h1>
                <span className={cn(
                  'inline-flex px-2.5 py-1 rounded-[var(--app-radius-lg)] text-xs font-medium capitalize',
                  getStageColor(deal.stage, isDark)
                )}>
                  {STAGE_LABELS[deal.stage]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className={cn('flex items-center gap-1.5', 'text-[var(--app-text-muted)]')}>
                  <Building2 className="w-4 h-4" />
                  {deal.company}
                </span>
                <span className={cn('flex items-center gap-1.5', 'text-[var(--app-text-muted)]')}>
                  <User className="w-4 h-4" />
                  {deal.contactName}
                </span>
                <span className={cn('flex items-center gap-1.5', 'text-[var(--app-text-muted)]')}>
                  <Calendar className="w-4 h-4" />
                  Expected Close: {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Value Display */}
            <div className="text-right">
              <p className={cn('text-3xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                {formatCurrency(deal.value)}
              </p>
              <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
                Weighted: {formatCurrency(deal.weightedValue)}
              </p>
            </div>
          </div>

          {/* Probability Bar */}
          <div className={cn(
            'rounded-[var(--app-radius-xl)] border p-4 mt-app-xl',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Win Probability</span>
              <span className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>{deal.probability}%</span>
            </div>
            <Progress
              value={deal.probability}
              className={cn('h-2', 'bg-[var(--app-hover-bg)]')}
            />
            {/* Stage Pipeline */}
            <div className="flex items-center gap-1 mt-4">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex-1 flex items-center gap-0.5">
                  <div className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i <= currentStageIndex
                      ? isDark ? 'bg-white/20' : 'bg-black/20'
                      : 'bg-[var(--app-hover-bg)]'
                  )} />
                  {i < STAGES.length - 1 && (
                    <ArrowRight className={cn(
                      'w-2.5 h-2.5 shrink-0',
                      i < currentStageIndex
                        ? 'text-[var(--app-text-muted)]'
                        : 'text-[var(--app-text-disabled)]'
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {STAGES.map((stage, idx) => (
                <span key={stage} className={cn(
                  'text-[8px] flex-1 text-center',
                  idx <= currentStageIndex
                    ? 'text-[var(--app-text-muted)]'
                    : 'text-[var(--app-text-disabled)]'
                )}>
                  {STAGE_LABELS[stage].charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-app-2xl">
          {/* Center - Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border overflow-hidden',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className={cn('p-4 border-b', 'border-[var(--app-border)]')}>
                <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Activity History</h3>
              </div>
              {activities.length > 0 ? (
                <div className="divide-y" style={{ borderColor: 'var(--app-hover-bg)' }}>
                  {activities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('p-4 transition-colors', 'hover:bg-[var(--app-hover-bg)]')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-9 h-10  rounded-[var(--app-radius-lg)] flex items-center justify-center text-sm shrink-0',
                          'bg-[var(--app-hover-bg)]'
                        )}>
                          {ACTIVITY_ICONS[activity.type] || '📋'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>
                            {activity.subject}
                          </p>
                          {activity.description && (
                            <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>
                              {activity.description}
                            </p>
                          )}
                          {activity.outcome && (
                            <p className={cn('text-xs mt-1', isDark ? 'text-emerald-400/70' : 'text-emerald-600/70')}>
                              {activity.outcome}
                            </p>
                          )}
                          <div className={cn('flex items-center gap-2 mt-1.5 text-[10px]', 'text-[var(--app-text-disabled)]')}>
                            <span>{activity.userName}</span>
                            <span>·</span>
                            <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            {activity.duration && <><span>·</span><span>{activity.duration}</span></>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={cn('flex flex-col items-center justify-center py-app-4xl', 'text-[var(--app-text-disabled)]')}>
                  <Clock className="w-8 h-8 mb-2" />
                  <p className="text-xs">No activity recorded yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Deal Info Cards */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4 space-y-3',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Deal Details
              </h3>
              {[
                { label: 'Created', value: new Date(deal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), icon: Calendar },
                { label: 'Aging', value: `${deal.aging} days in stage`, icon: Clock, alert: deal.aging > 15 },
                { label: 'Owner', value: deal.owner, icon: User },
                { label: 'Expected Close', value: new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Target },
                { label: 'Weighted Value', value: formatCurrency(deal.weightedValue), icon: BarChart3 },
              ].map(({ label, value, icon: Icon, alert }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <Icon className={cn(
                      'w-4 h-4',
                      alert ? 'text-amber-500' : ('text-[var(--app-text-muted)]')
                    )} />
                  </div>
                  <div className="flex-1">
                    <span className={cn('text-[10px] uppercase tracking-wider block', 'text-[var(--app-text-disabled)]')}>{label}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      alert ? 'text-amber-500' : ('text-[var(--app-text)]')
                    )}>{value}</span>
                  </div>
                  {alert && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
                Linked Contact
              </h3>
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-[var(--app-radius-lg)] border cursor-pointer transition-colors',
                isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04] hover:bg-black/[0.03]'
              )}>
                <div className={cn(
                  'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center text-sm font-bold',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text)]'
                )}>
                  {deal.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>{deal.contactName}</p>
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{deal.company}</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4 space-y-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  AI Insights
                </h3>
              </div>

              {/* Win Probability Analysis */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Win Probability
                </span>
                <div className="flex items-end gap-2 mb-2">
                  <span className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                    {deal.probability > 0 ? Math.round(deal.probability * 1.12) : 0}%
                  </span>
                  <span className={cn('text-[10px] mb-1', 'text-[var(--app-success)]')}>
                    AI adjusted
                  </span>
                </div>
                <Progress
                  value={deal.probability > 0 ? deal.probability * 1.12 : 0}
                  className={cn('h-1.5', 'bg-[var(--app-hover-bg)]')}
                />
              </div>

              {/* Recommended Next Steps */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Recommended Next Steps
                </span>
                <div className="space-y-2">
                  {deal.stage === 'proposal' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Schedule pricing discussion meeting</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Handshake className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Prepare negotiation talking points</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'demo' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Video className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Follow up with technical deep-dive</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Edit3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Send personalized demo recap</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'negotiation' && (
                    <>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Create urgency with limited-time offer</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Align final terms with decision maker</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'qualified' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Video className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Schedule product demo call</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Send case study from similar industry</span>
                      </div>
                    </>
                  )}
                  {(deal.stage === 'new' || deal.stage === 'won' || deal.stage === 'lost') && (
                    <div className="flex items-start gap-2">
                      <ArrowLeftRight className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Continue building relationship</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Deals */}
              {similarDeals.length > 0 && (
                <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                  <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                    Similar Deals
                  </span>
                  <div className="space-y-2">
                    {similarDeals.map(sd => (
                      <div key={sd.id} className={cn(
                        'flex items-center gap-2 p-2 rounded-[var(--app-radius-lg)]',
                        'hover:bg-[var(--app-hover-bg)]'
                      )}>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>{sd.name}</p>
                          <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{sd.company}</p>
                        </div>
                        <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                          {formatCurrency(sd.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(
            'sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-4 border-t',
            isDark ? 'bg-[#0a0a0a]/90 border-white/[0.06]' : 'bg-white/90 border-black/[0.06]'
          )}
        >
          <div className="flex flex-wrap items-center gap-2 max-w-[1400px] mx-auto">
            <Select>
              <SelectTrigger className={cn(
                'h-10  w-44 text-xs rounded-[var(--app-radius-lg)]',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
                <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                <SelectValue placeholder="Move Stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(stage => (
                  <SelectItem key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-10  px-4 rounded-[var(--app-radius-lg)] text-xs">
              <Edit3 className="w-4 h-4 mr-1.5" />
              Edit Deal
            </Button>
            <Button variant="outline" className="h-10  px-4 rounded-[var(--app-radius-lg)] text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Activity
            </Button>
            <Button variant="outline" className="h-10  px-4 rounded-[var(--app-radius-lg)] text-xs">
              <Video className="w-4 h-4 mr-1.5" />
              Schedule Meeting
            </Button>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
