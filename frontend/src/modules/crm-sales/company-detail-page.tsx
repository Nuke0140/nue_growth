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
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockCompanies, mockContacts, mockDeals, mockActivities } from './data/mock-data';
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
          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
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
        <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>{score}</span>
        <span className={cn('text-[8px]', isDark ? 'text-white/25' : 'text-black/25')}>HEALTH</span>
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
      <div className={cn('flex items-center justify-center h-full', isDark ? 'text-white/30' : 'text-black/30')}>
        <p className="text-sm">Company not found</p>
      </div>
    );
  }

  const totalDealValue = companyDeals.reduce((s, d) => s + d.value, 0);
  const activeDeals = companyDeals.filter(d => !['won', 'lost'].includes(d.stage));

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Avatar & Name */}
            <div className={cn(
              'rounded-2xl border p-5 text-center',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-3',
                isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
              )}>
                {company.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>
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
              'rounded-2xl border p-4 space-y-3',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
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
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                  )}>
                    <Icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                  </div>
                  <div>
                    <span className={cn('text-[10px] uppercase tracking-wider block', isDark ? 'text-white/20' : 'text-black/20')}>{label}</span>
                    <span className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-black/60')}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Account Owner */}
            <div className={cn(
              'rounded-2xl border p-4',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/20' : 'text-black/20')}>
                Account Owner
              </span>
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold',
                  isDark ? 'bg-white/[0.08] text-white/60' : 'bg-black/[0.08] text-black/60'
                )}>
                  {company.owner.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className={cn('text-xs font-medium', isDark ? 'text-white/70' : 'text-black/70')}>{company.owner}</p>
                  <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Account Manager</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={cn(
              'rounded-2xl border p-4',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-white/30' : 'text-black/30')}>
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
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors',
                      isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.06]' : 'text-black/60 hover:text-black hover:bg-black/[0.06]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
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
                'rounded-xl p-0.5 h-9',
                isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
              )}>
                <TabsTrigger value="contacts" className="rounded-lg text-xs gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Contacts ({companyContacts.length})
                </TabsTrigger>
                <TabsTrigger value="deals" className="rounded-lg text-xs gap-1.5">
                  <Handshake className="w-3.5 h-3.5" />
                  Deals ({companyDeals.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg text-xs">Activity</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg text-xs">Notes</TabsTrigger>
              </TabsList>

              {/* Contacts Tab */}
              <TabsContent value="contacts">
                <div className={cn(
                  'rounded-2xl border overflow-hidden',
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                )}>
                  {companyContacts.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                      {companyContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={cn('p-4 flex items-center gap-3 transition-colors cursor-pointer', isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]')}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                            isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
                          )}>
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{contact.title}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn('text-[10px] capitalize', isDark ? 'text-white/30' : 'text-black/30')}>{contact.lifecycleStage}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Progress
                                value={contact.healthScore}
                                className={cn('h-1 w-12', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}
                              />
                              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{contact.healthScore}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={cn('flex flex-col items-center justify-center py-12', isDark ? 'text-white/20' : 'text-black/20')}>
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
                          'rounded-xl border p-4 transition-colors cursor-pointer',
                          isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-black')}>{deal.name}</p>
                            <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                              {deal.contactName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-black')}>
                              {formatCurrency(deal.value)}
                            </p>
                            <span className={cn(
                              'inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium capitalize mt-1',
                              getStageColor(deal.stage, isDark)
                            )}>
                              {STAGE_LABELS[deal.stage]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
                          <span>Probability: {deal.probability}%</span>
                          <span>Close: {new Date(deal.expectedClose).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>Aging: {deal.aging}d</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={cn(
                      'rounded-2xl border flex flex-col items-center justify-center py-12',
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
                  'rounded-2xl border overflow-hidden',
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                )}>
                  {companyActivities.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                      {companyActivities.slice(0, 10).map((activity) => (
                        <div key={activity.id} className={cn('p-4', isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]')}>
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0',
                              isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
                            )}>
                              {ACTIVITY_ICONS[activity.type] || '📋'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>{activity.subject}</p>
                              {activity.description && (
                                <p className={cn('text-xs mt-0.5 line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
                                  {activity.description}
                                </p>
                              )}
                              <div className={cn('flex items-center gap-2 mt-1 text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>
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
                    <div className={cn('flex flex-col items-center justify-center py-12', isDark ? 'text-white/20' : 'text-black/20')}>
                      <Calendar className="w-8 h-8 mb-2" />
                      <p className="text-xs">No activity yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <div className={cn(
                  'rounded-2xl border p-8 text-center',
                  isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                )}>
                  <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No notes for this company</p>
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
              'rounded-2xl border p-4 space-y-4',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className={cn('text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                  Account Intelligence
                </h3>
              </div>

              {/* Total ARR */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-1', isDark ? 'text-white/25' : 'text-black/25')}>
                  Total ARR
                </span>
                <div className="flex items-end gap-2">
                  <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
                    {formatCurrency(company.arr)}
                  </span>
                  <span className="text-emerald-500 text-xs font-medium mb-0.5 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +18%
                  </span>
                </div>
              </div>

              {/* Growth Trend */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
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
                        'flex-1 rounded-sm',
                        i === 8
                          ? isDark ? 'bg-white/30' : 'bg-black/30'
                          : isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'
                      )}
                    />
                  ))}
                </div>
                <div className={cn('flex justify-between mt-1 text-[8px]', isDark ? 'text-white/15' : 'text-black/15')}>
                  <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span>
                </div>
              </div>

              {/* Engagement Score */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                  Engagement Score
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>
                    {Math.round(company.healthScore * 0.9)}/100
                  </span>
                  <Heart className={cn('w-4 h-4', company.healthScore >= 70 ? 'text-emerald-500' : 'text-amber-500')} />
                </div>
                <Progress
                  value={company.healthScore * 0.9}
                  className={cn('h-1.5', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}
                />
              </div>

              {/* Pipeline Summary */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                  Pipeline Summary
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>Total Deal Value</span>
                    <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-black')}>
                      {formatCurrency(totalDealValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>Active Deals</span>
                    <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-black')}>
                      {activeDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>Linked Contacts</span>
                    <span className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-black')}>
                      {companyContacts.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className={cn('rounded-xl p-3 border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-black/[0.01] border-black/[0.04]')}>
                <span className={cn('text-[10px] uppercase tracking-wider block mb-2', isDark ? 'text-white/25' : 'text-black/25')}>
                  Recommended Actions
                </span>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>
                      {company.healthScore >= 80
                        ? 'Strong account - explore upsell opportunities'
                        : company.healthScore >= 50
                          ? 'Schedule quarterly business review'
                          : 'Re-engagement strategy needed'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>
                      Cross-sell analytics module based on usage patterns
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>
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
