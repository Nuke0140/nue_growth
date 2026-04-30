'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Globe, Users, Building2, DollarSign, TrendingUp, BrainCircuit,
  Mail, Phone, Calendar, ExternalLink, UserPlus, Handshake,
  Video, BarChart3, Heart, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { mockCompanies, mockContacts, mockDeals, mockActivities } from '@/modules/crm-sales/data/mock-data';
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

function HealthRing({ score, isDark }: { score: number; isDark: boolean }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={'var(--app-border)'}
          strokeWidth="5"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{score}</span>
        <span className={cn('text-[8px]', 'text-[var(--app-text-muted)]')}>HEALTH</span>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS: Record<string, string> = {
  call: '📞', email: '✉️', meeting: '📅', demo: '🎯',
  proposal: '📄', note: '📝', whatsapp: '💬', website_visit: '🌐',
  file_share: '📎', payment: '💳',
};

export default function CompanyDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectedCompanyId } = useCrmSalesStore();

  const company = useMemo(() => mockCompanies.find(c => c.id === selectedCompanyId), [selectedCompanyId]);

  const companyContacts = useMemo(
    () => mockContacts.filter(c => c.companyId === selectedCompanyId),
    [selectedCompanyId]
  );

  const companyDeals = useMemo(
    () => mockDeals.filter(d => d.companyId === selectedCompanyId),
    [selectedCompanyId]
  );

  const companyActivities = useMemo(
    () => mockActivities.filter(a => companyContacts.some(c => c.id === a.contactId) || a.companyName === company?.name),
    [companyContacts, company?.name]
  );

  if (!company) {
    return (
      <div className={cn('flex items-center justify-center h-full', 'text-[var(--app-text-muted)]')}>
        <p className="text-sm">Company not found</p>
      </div>
    );
  }

  const totalDealValue = companyDeals.reduce((s, d) => s + d.value, 0);
  const activeDeals = companyDeals.filter(d => !['won', 'lost'].includes(d.stage));

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-app-2xl">
          {/* Left Panel - Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Avatar & Name */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-app-xl text-center',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className={cn(
                'w-16 h-16 rounded-[var(--app-radius-xl)] flex items-center justify-center text-2xl font-bold mx-auto mb-3',
                'bg-[var(--app-hover-bg)] text-[var(--app-text)]'
              )}>
                {company.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <h2 className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                {company.name}
              </h2>
              {company.website && (
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1 text-xs mt-1 transition-colors',
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  )}
                >
                  {company.website}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}

              <div className="flex justify-center mt-4">
                <HealthRing score={company.healthScore} isDark={isDark} />
              </div>
            </div>

            {/* Company Details */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4 space-y-3',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Company Details
              </h3>
              {[
                { icon: Building2, label: 'Industry', value: company.industry },
                { icon: Users, label: 'Employees', value: company.employeeCount },
                { icon: DollarSign, label: 'ARR', value: formatCurrency(company.arr) },
                { icon: Globe, label: 'Website', value: company.website || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0',
                    'bg-[var(--app-hover-bg)]'
                  )}>
                    <Icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  </div>
                  <div>
                    <span className={cn('text-[10px] uppercase tracking-wider block', 'text-[var(--app-text-disabled)]')}>{label}</span>
                    <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Account Owner */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-disabled)]')}>
                Account Owner
              </span>
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold',
                  'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                )}>
                  {company.owner.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className={cn('text-xs font-medium', 'text-[var(--app-text)]')}>{company.owner}</p>
                  <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Account Manager</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', 'text-[var(--app-text-muted)]')}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { icon: UserPlus, label: 'Add Contact' },
                  { icon: Handshake, label: 'Create Deal' },
                  { icon: Mail, label: 'Send Email' },
                  { icon: Video, label: 'Schedule Meeting' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--app-radius-lg)] text-xs transition-colors',
                      'text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <Tabs defaultValue="contacts" className="space-y-4">
              <TabsList className={cn(
                'rounded-[var(--app-radius-lg)] p-0.5 h-10'',
                'bg-[var(--app-hover-bg)]'
              )}>
                <TabsTrigger value="contacts" className="rounded-[var(--app-radius-lg)] text-xs gap-1.5">
                  <Users className="w-4 h-4" />
                  Contacts ({companyContacts.length})
                </TabsTrigger>
                <TabsTrigger value="deals" className="rounded-[var(--app-radius-lg)] text-xs gap-1.5">
                  <Handshake className="w-4 h-4" />
                  Deals ({companyDeals.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-[var(--app-radius-lg)] text-xs">Activity</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-[var(--app-radius-lg)] text-xs">Notes</TabsTrigger>
              </TabsList>

              {/* Contacts Tab */}
              <TabsContent value="contacts">
                <div className={cn(
                  'rounded-[var(--app-radius-xl)] border overflow-hidden',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  {companyContacts.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: 'var(--app-hover-bg)' }}>
                      {companyContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={cn('p-4 flex items-center gap-3 transition-colors cursor-pointer', 'hover:bg-[var(--app-hover-bg)]')}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center text-sm font-bold shrink-0',
                            'bg-[var(--app-hover-bg)] text-[var(--app-text)]'
                          )}>
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{contact.title}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn('text-[10px] capitalize', 'text-[var(--app-text-muted)]')}>{contact.lifecycleStage}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Progress
                                value={contact.healthScore}
                                className={cn('h-1 w-12', 'bg-[var(--app-hover-bg)]')}
                              />
                              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{contact.healthScore}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={cn('flex flex-col items-center justify-center py-app-4xl', 'text-[var(--app-text-disabled)]')}>
                      <Users className="w-8 h-8 mb-2" />
                      <p className="text-xs">No linked contacts</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Deals Tab */}
              <TabsContent value="deals">
                <div className="space-y-2">
                  {companyDeals.length > 0 ? (
                    companyDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className={cn(
                          'rounded-[var(--app-radius-lg)] border p-4 transition-colors cursor-pointer',
                          'bg-[var(--app-card-bg)] border-[var(--app-border)] hover:bg-[var(--app-card-bg-hover)]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>{deal.name}</p>
                            <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
                              {deal.contactName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn('text-sm font-bold', 'text-[var(--app-text)]')}>
                              {formatCurrency(deal.value)}
                            </p>
                            <span className={cn(
                              'inline-flex px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium capitalize mt-1',
                              getStageColor(deal.stage, isDark)
                            )}>
                              {STAGE_LABELS[deal.stage]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: 'var(--app-overlay)' }}>
                          <span>Probability: {deal.probability}%</span>
                          <span>Close: {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>Aging: {deal.aging}d</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={cn(
                      'rounded-[var(--app-radius-xl)] border flex flex-col items-center justify-center py-app-4xl',
                      isDark ? 'bg-white/[0.02] border-white/[0.06] text-white/20' : 'bg-white border-black/[0.06] text-black/20'
                    )}>
                      <Handshake className="w-8 h-8 mb-2" />
                      <p className="text-xs">No deals linked</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <div className={cn(
                  'rounded-[var(--app-radius-xl)] border overflow-hidden',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  {companyActivities.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: 'var(--app-hover-bg)' }}>
                      {companyActivities.slice(0, 10).map((activity) => (
                        <div key={activity.id} className={cn('p-4', 'hover:bg-[var(--app-hover-bg)]')}>
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center text-sm shrink-0',
                              'bg-[var(--app-hover-bg)]'
                            )}>
                              {ACTIVITY_ICONS[activity.type] || '📋'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>{activity.subject}</p>
                              {activity.description && (
                                <p className={cn('text-xs mt-0.5 line-clamp-2', 'text-[var(--app-text-muted)]')}>
                                  {activity.description}
                                </p>
                              )}
                              <div className={cn('flex items-center gap-2 mt-1 text-[10px]', 'text-[var(--app-text-disabled)]')}>
                                <span>{activity.userName}</span>
                                <span>·</span>
                                <span>{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={cn('flex flex-col items-center justify-center py-app-4xl', 'text-[var(--app-text-disabled)]')}>
                      <Calendar className="w-8 h-8 mb-2" />
                      <p className="text-xs">No activity yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <div className={cn(
                  'rounded-[var(--app-radius-xl)] border p-app-3xl text-center',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}>
                  <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No notes for this company</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Right Panel - Account Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Account Insights */}
            <div className={cn(
              'rounded-[var(--app-radius-xl)] border p-4 space-y-4',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className={cn('text-xs font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                  Account Intelligence
                </h3>
              </div>

              {/* Total ARR */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>
                  Total ARR
                </span>
                <div className="flex items-end gap-2">
                  <span className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                    {formatCurrency(company.arr)}
                  </span>
                  <span className="text-emerald-500 text-xs font-medium mb-0.5 flex items-center gap-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                    +18%
                  </span>
                </div>
              </div>

              {/* Growth Trend */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Growth Trend
                </span>
                <div className="flex items-end gap-1 h-12">
                  {[30, 45, 40, 60, 55, 70, 85, 80, 90].map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={cn(
                        'flex-1 rounded-[var(--app-radius-sm)]',
                        i === 8
                          ? isDark ? 'bg-white/30' : 'bg-black/30'
                          : 'bg-[var(--app-hover-bg)]'
                      )}
                    />
                  ))}
                </div>
                <div className={cn('flex justify-between mt-1 text-[8px]', 'text-[var(--app-text-disabled)]')}>
                  <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span>
                </div>
              </div>

              {/* Engagement Score */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Engagement Score
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>
                    {Math.round(company.healthScore * 0.9)}/100
                  </span>
                  <Heart className={cn('w-4 h-4', company.healthScore >= 70 ? 'text-emerald-500' : 'text-amber-500')} />
                </div>
                <Progress
                  value={company.healthScore * 0.9}
                  className={cn('h-1.5', 'bg-[var(--app-hover-bg)]')}
                />
              </div>

              {/* Pipeline Summary */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Pipeline Summary
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Total Deal Value</span>
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                      {formatCurrency(totalDealValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Active Deals</span>
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                      {activeDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Linked Contacts</span>
                    <span className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                      {companyContacts.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className={cn('rounded-[var(--app-radius-lg)] p-3 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border-light)]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                  Recommended Actions
                </span>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                      {company.healthScore >= 80
                        ? 'Strong account - explore upsell opportunities'
                        : company.healthScore >= 50
                          ? 'Schedule quarterly business review'
                          : 'Re-engagement strategy needed'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                      Cross-sell analytics module based on usage patterns
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                      {companyContacts.length > 2
                        ? 'Map stakeholder relationships for key contacts'
                        : 'Identify additional decision makers'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollArea>
  );
}
