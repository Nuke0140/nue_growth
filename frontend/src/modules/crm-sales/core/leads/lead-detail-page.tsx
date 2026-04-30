'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Mail, Phone, Calendar, ArrowRightLeft, Clock, Target, BrainCircuit,
  Zap, TrendingUp, AlertTriangle, Copy, Users, Building2, Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { mockLeads, mockActivities } from '@/modules/crm-sales/data/mock-data';
import type { LeadIntent } from '@/modules/crm-sales/system/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const INTENT_CONFIG: Record<LeadIntent, { icon: typeof Zap; bg: string; text: string; label: string }> = {
  hot:  { icon: Zap, bg: 'bg-red-500/15', text: 'text-red-400', label: 'Hot' },
  warm: { icon: TrendingUp, bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Warm' },
  cold: { icon: AlertTriangle, bg: 'bg-sky-500/15', text: 'text-sky-400', label: 'Cold' },
};

function ScoreRing({ score, isDark }: { score: number; isDark: boolean }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={'var(--app-border)'}
          strokeWidth="6"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-xl font-bold', 'text-[var(--app-text)]')}>{score}</span>
        <span className={cn('text-[9px]', 'text-[var(--app-text-muted)]')}>SCORE</span>
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedLeadId } = useCrmSalesStore();

  const lead = useMemo(() => mockLeads.find(l => l.id === selectedLeadId), [selectedLeadId]);

  if (!lead) {
    return (
      <div className={cn('flex items-center justify-center h-full', 'text-[var(--app-text-muted)]')}>
        <p className="text-sm">Lead not found</p>
      </div>
    );
  }

  const intentCfg = INTENT_CONFIG[lead.intent];
  const IntentIcon = intentCfg.icon;

  const activities = mockActivities.filter(a =>
    a.contactName === `${lead.firstName} ${lead.lastName}` || a.companyName === lead.company
  );

  const similarLeads = mockLeads.filter(l => l.id !== lead.id && l.source === lead.source).slice(0, 3);
  const potentialDuplicates = mockLeads.filter(l =>
    l.id !== lead.id && (l.email === lead.email || l.company === lead.company)
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Lead Info */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Avatar & Name Card */}
            <div className={cn(
              'rounded-2xl border p-5 text-center',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3',
                'bg-[var(--app-hover-bg)] text-[var(--app-text)]'
              )}>
                {lead.firstName[0]}{lead.lastName[0]}
              </div>
              <h2 className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                {lead.firstName} {lead.lastName}
              </h2>
              <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                {lead.company || 'No Company'}
              </p>

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold',
                  intentCfg.bg, intentCfg.text
                )}>
                  <IntentIcon className="w-3.5 h-3.5" />
                  {intentCfg.label}
                </span>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {lead.status}
                </Badge>
              </div>

              <Separator className={cn('my-4', 'bg-[var(--app-hover-bg)]')} />

              {/* Score Ring */}
              <ScoreRing score={lead.score} isDark={isDark} />
            </div>

            {/* Contact Info */}
            <div className={cn(
              'rounded-2xl border p-4 space-y-3',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Contact Info
              </h3>
              {[
                { icon: Mail, label: lead.email },
                { icon: Phone, label: lead.phone },
                { icon: Building2, label: lead.company || '—' },
                { icon: Tag, label: lead.source.replace('_', ' ') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <Icon className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                  </div>
                  <span className={cn('text-xs truncate', 'text-[var(--app-text-secondary)]')}>{label}</span>
                </div>
              ))}
            </div>

            {/* Assigned Rep & Campaign */}
            <div className={cn(
              'rounded-2xl border p-4 space-y-3',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>Assigned Rep</span>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                    'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                  )}>
                    {lead.assignedRep.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>{lead.assignedRep}</span>
                </div>
              </div>
              {lead.campaign && (
                <div>
                  <span className={cn('text-[10px] uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>Campaign</span>
                  <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{lead.campaign}</span>
                </div>
              )}
              {lead.nextAction && (
                <div>
                  <span className={cn('text-[10px] uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>Next Action</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>{lead.nextAction}</span>
                  </div>
                  {lead.nextActionDate && (
                    <span className={cn('text-[10px] ml-5', 'text-[var(--app-text-muted)]')}>
                      {new Date(lead.nextActionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Center Panel - Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <Tabs defaultValue="activity" className="space-y-4">
              <TabsList className={cn(
                'rounded-xl p-0.5 h-9',
                'bg-[var(--app-hover-bg)]'
              )}>
                <TabsTrigger value="activity" className="rounded-lg text-xs">Activity</TabsTrigger>
                <TabsTrigger value="tasks" className="rounded-lg text-xs">Tasks</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg text-xs">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-0">
                <div className={cn(
                  'rounded-2xl border overflow-hidden',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  <div className="p-4 border-b" style={{ borderColor: 'var(--app-border)' }}>
                    <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                      Activity Timeline
                    </h3>
                  </div>

                  {activities.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: 'var(--app-hover-bg)' }}>
                      {activities.map((activity, i) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn('p-4 hover:bg-white/[0.02] transition-colors', isDark ? '' : 'hover:bg-black/[0.01]')}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold shrink-0 mt-0.5',
                              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                            )}>
                              {activity.type.slice(0, 2)}
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
                              <div className={cn('flex items-center gap-2 mt-1.5 text-[10px]', 'text-[var(--app-text-muted)]')}>
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
                    <div className={cn('flex flex-col items-center justify-center py-12', 'text-[var(--app-text-disabled)]')}>
                      <Calendar className="w-8 h-8 mb-2" />
                      <p className="text-xs">No activity recorded yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <div className={cn(
                  'rounded-2xl border p-8 text-center',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  <Target className={cn('w-8 h-8 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
                  <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No tasks for this lead</p>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className={cn(
                  'rounded-2xl border p-8 text-center',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No notes yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right Panel - AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* AI Insights Card */}
            <div className={cn(
              'rounded-2xl border p-4 space-y-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  AI Insights
                </h3>
              </div>

              {/* Conversion Probability */}
              <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Conversion Probability
                </span>
                <div className="flex items-end gap-2">
                  <span className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                    {Math.round(lead.score * 0.78)}%
                  </span>
                  <span className={cn('text-[10px] mb-1', 'text-[var(--app-success)]')}>
                    +12% this week
                  </span>
                </div>
                <Progress
                  value={lead.score * 0.78}
                  className={cn('h-1.5 mt-2', 'bg-[var(--app-hover-bg)]')}
                />
              </div>

              {/* Recommended Actions */}
              <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Recommended Actions
                </span>
                <div className="space-y-2">
                  {lead.intent === 'hot' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Schedule demo within 24h</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Send personalized proposal</span>
                      </div>
                    </>
                  ) : lead.intent === 'warm' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Send nurture email sequence</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Follow up with discovery call</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Add to drip campaign</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Share case studies by email</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Similar Leads */}
              {similarLeads.length > 0 && (
                <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                  <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                    Similar Leads
                  </span>
                  <div className="space-y-2">
                    {similarLeads.map(sl => (
                      <div key={sl.id} className={cn(
                        'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                        'hover:bg-[var(--app-hover-bg)]'
                      )}>
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                          'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                        )}>
                          {sl.firstName[0]}{sl.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium truncate', 'text-[var(--app-text)]')}>
                            {sl.firstName} {sl.lastName}
                          </p>
                          <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>{sl.company}</p>
                        </div>
                        <span className={cn('text-[10px] font-medium', 'text-[var(--app-text-muted)]')}>{sl.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate Detection */}
              <div className={cn('rounded-xl p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <div className="flex items-center gap-2 mb-2">
                  <Copy className="w-3.5 h-3.5" />
                  <span className={cn('text-[10px] uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    Duplicate Check
                  </span>
                </div>
                {potentialDuplicates.length > 0 ? (
                  <div className="space-y-2">
                    <span className={cn('text-xs font-medium text-amber-500')}>
                      {potentialDuplicates.length} potential duplicate(s)
                    </span>
                    {potentialDuplicates.map(d => (
                      <div key={d.id} className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                        {d.firstName} {d.lastName} — {d.email}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className={cn('text-xs text-emerald-500')}>No duplicates found</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(
            'sticky bottom-0 mt-6 -mx-4 md:-mx-6 px-4 md:px-6 py-4 border-t',
            isDark ? 'bg-[#0a0a0a]/90 border-white/[0.06]' : 'bg-white/90 border-black/[0.06]'
          )}
        >
          <div className="flex items-center gap-2 max-w-[1400px] mx-auto">
            <Button className={cn(
              'h-9 px-5 rounded-xl text-xs font-semibold',
              'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
            )}>
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
              Convert to Deal
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Schedule Follow-up
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-xl text-xs">
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Send Email
            </Button>
            <Button variant="outline" className={cn(
              'h-9 px-4 rounded-xl text-xs',
              isDark ? 'text-red-400 border-red-500/20 hover:bg-red-500/10' : 'text-red-600 border-red-200 hover:bg-red-50'
            )}>
              Disqualify
            </Button>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
