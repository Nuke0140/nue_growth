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
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockDeals, mockActivities } from './data/mock-data';
import type { DealStage } from '@/modules/crm-sales/types';

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
    new: isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.06] text-black/60',
    qualified: isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-700',
    demo: isDark ? 'bg-purple-500/15 text-purple-300' : 'bg-purple-50 text-purple-700',
    proposal: isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-700',
    negotiation: isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
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
      <div className={cn('flex items-center justify-center h-full', isDark ? 'text-white/30' : 'text-black/30')}>
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
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                  {deal.name}
                </h1>
                <span className={cn(
                  'inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize',
                  getStageColor(deal.stage, isDark)
                )}>
                  {STAGE_LABELS[deal.stage]}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className={cn('flex items-center gap-1.5', isDark ? 'text-white/40' : 'text-black/40')}>
                  <Building2 className="w-3.5 h-3.5" />
                  {deal.company}
                </span>
                <span className={cn('flex items-center gap-1.5', isDark ? 'text-white/40' : 'text-black/40')}>
                  <User className="w-3.5 h-3.5" />
                  {deal.contactName}
                </span>
                <span className={cn('flex items-center gap-1.5', isDark ? 'text-white/40' : 'text-black/40')}>
                  <Calendar className="w-3.5 h-3.5" />
                  Expected Close: {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Value Display */}
            <div className="text-right">
              <p className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                {formatCurrency(deal.value)}
              </p>
              <p className={cn('text-xs mt-1', isDark ? 'text-white/30' : 'text-black/30')}>
                Weighted: {formatCurrency(deal.weightedValue)}
              </p>
            </div>
          </div>

          {/* Probability Bar */}
          <div className={cn(
            'rounded-2xl border p-4 mt-5',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Win Probability</span>
              <span className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-black')}>{deal.probability}%</span>
            </div>
            <Progress
              value={deal.probability}
              className={cn('h-2', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}
            />
            {/* Stage Pipeline */}
            <div className="flex items-center gap-1 mt-4">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex-1 flex items-center gap-0.5">
                  <div className={cn(
                    'h-1.5 flex-1 rounded-full transition-colors',
                    i <= currentStageIndex
                      ? isDark ? 'bg-white/20' : 'bg-black/20'
                      : isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                  )} />
                  {i < STAGES.length - 1 && (
                    <ArrowRight className={cn(
                      'w-2.5 h-2.5 shrink-0',
                      i < currentStageIndex
                        ? isDark ? 'text-white/30' : 'text-black/30'
                        : isDark ? 'text-white/10' : 'text-black/10'
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
                    ? isDark ? 'text-white/40' : 'text-black/40'
                    : isDark ? 'text-white/15' : 'text-black/15'
                )}>
                  {STAGE_LABELS[stage].charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Center - Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className={cn(
              'rounded-2xl border overflow-hidden',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <div className={cn('p-4 border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>Activity History</h3>
              </div>
              {activities.length > 0 ? (
                <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                  {activities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn('p-4 transition-colors', isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]')}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0',
                          isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                        )}>
                          {ACTIVITY_ICONS[activity.type] || '📋'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>
                            {activity.subject}
                          </p>
                          {activity.description && (
                            <p className={cn('text-xs mt-0.5 line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
                              {activity.description}
                            </p>
                          )}
                          {activity.outcome && (
                            <p className={cn('text-xs mt-1', isDark ? 'text-emerald-400/70' : 'text-emerald-600/70')}>
                              {activity.outcome}
                            </p>
                          )}
                          <div className={cn('flex items-center gap-2 mt-1.5 text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>
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
                <div className={cn('flex flex-col items-center justify-center py-12', isDark ? 'text-white/20' : 'text-black/20')}>
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
              'rounded-2xl border p-4 space-y-3',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
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
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                  )}>
                    <Icon className={cn(
                      'w-3.5 h-3.5',
                      alert ? 'text-amber-500' : (isDark ? 'text-white/30' : 'text-black/30')
                    )} />
                  </div>
                  <div className="flex-1">
                    <span className={cn('text-[10px] uppercase tracking-wider block', isDark ? 'text-white/20' : 'text-black/20')}>{label}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      alert ? 'text-amber-500' : (isDark ? 'text-white/70' : 'text-black/70')
                    )}>{value}</span>
                  </div>
                  {alert && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className={cn(
              'rounded-2xl border p-4',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-white/30' : 'text-black/30')}>
                Linked Contact
              </h3>
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04] hover:bg-black/[0.03]'
              )}>
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                  isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
                )}>
                  {deal.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>{deal.contactName}</p>
                  <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{deal.company}</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className={cn(
              'rounded-2xl border p-4 space-y-4',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                  AI Insights
                </h3>
              </div>

              {/* Win Probability Analysis */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                  Win Probability
                </span>
                <div className="flex items-end gap-2 mb-2">
                  <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
                    {deal.probability > 0 ? Math.round(deal.probability * 1.12) : 0}%
                  </span>
                  <span className={cn('text-[10px] mb-1', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                    AI adjusted
                  </span>
                </div>
                <Progress
                  value={deal.probability > 0 ? deal.probability * 1.12 : 0}
                  className={cn('h-1.5', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}
                />
              </div>

              {/* Recommended Next Steps */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                  Recommended Next Steps
                </span>
                <div className="space-y-2">
                  {deal.stage === 'proposal' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Schedule pricing discussion meeting</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Handshake className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Prepare negotiation talking points</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'demo' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Video className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Follow up with technical deep-dive</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Send personalized demo recap</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'negotiation' && (
                    <>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Create urgency with limited-time offer</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Align final terms with decision maker</span>
                      </div>
                    </>
                  )}
                  {deal.stage === 'qualified' && (
                    <>
                      <div className="flex items-start gap-2">
                        <Video className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Schedule product demo call</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Send case study from similar industry</span>
                      </div>
                    </>
                  )}
                  {(deal.stage === 'new' || deal.stage === 'won' || deal.stage === 'lost') && (
                    <div className="flex items-start gap-2">
                      <ArrowLeftRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>Continue building relationship</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Deals */}
              {similarDeals.length > 0 && (
                <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                  <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                    Similar Deals
                  </span>
                  <div className="space-y-2">
                    {similarDeals.map(sd => (
                      <div key={sd.id} className={cn(
                        'flex items-center gap-2 p-2 rounded-lg',
                        isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-black/[0.04]'
                      )}>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium truncate', isDark ? 'text-white/70' : 'text-black/70')}>{sd.name}</p>
                          <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{sd.company}</p>
                        </div>
                        <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
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
                'h-9 w-44 text-xs rounded-xl',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
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
            <Button variant="outline" className="h-9 px-4 rounded-xl text-xs">
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Edit Deal
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Activity
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-xl text-xs">
              <Video className="w-3.5 h-3.5 mr-1.5" />
              Schedule Meeting
            </Button>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
