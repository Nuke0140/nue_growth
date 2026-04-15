'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Search, Flame, Star, Snowflake, ChevronDown, Mail, Phone,
  ArrowRightLeft, Users, DollarSign, Zap, X, Filter, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockLeads } from './data/mock-data';
import type { Lead, LeadIntent, LeadStatus, ContactSource } from '@/modules/crm-sales/types';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const INTENT_CONFIG: Record<LeadIntent, { icon: typeof Flame; bg: string; text: string; label: string }> = {
  hot:  { icon: Flame, bg: 'bg-red-500/15', text: 'text-red-500', label: 'Hot' },
  warm: { icon: Star, bg: 'bg-amber-500/15', text: 'text-amber-500', label: 'Warm' },
  cold: { icon: Snowflake, bg: 'bg-sky-500/15', text: 'text-sky-500', label: 'Cold' },
};

const SOURCE_COLORS: Record<ContactSource, string> = {
  linkedin: 'bg-blue-500/15 text-blue-400 border-blue-500/10',
  website: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/10',
  event: 'bg-purple-500/15 text-purple-400 border-purple-500/10',
  referral: 'bg-pink-500/15 text-pink-400 border-pink-500/10',
  ad_campaign: 'bg-orange-500/15 text-orange-400 border-orange-500/10',
  cold_call: 'bg-slate-500/15 text-slate-400 border-slate-500/10',
  organic: 'bg-teal-500/15 text-teal-400 border-teal-500/10',
  import: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/10',
};

const STATUS_VARIANT: Record<LeadStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  contacted: 'secondary',
  qualified: 'default',
  unqualified: 'destructive',
  converted: 'default',
  lost: 'destructive',
};

const ITEMS_PER_PAGE = 8;

export default function LeadsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { selectLead } = useCrmSalesStore();

  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState<LeadIntent | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<ContactSource | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [selectedLeadModal, setSelectedLeadModal] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    return mockLeads.filter(l => {
      if (search && !`${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (intentFilter !== 'all' && l.intent !== intentFilter) return false;
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      return true;
    });
  }, [search, intentFilter, sourceFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = mockLeads.length;
    const hot = mockLeads.filter(l => l.intent === 'hot').length;
    const warm = mockLeads.filter(l => l.intent === 'warm').length;
    const cold = mockLeads.filter(l => l.intent === 'cold').length;
    const totalRevenue = mockLeads.reduce((s, l) => s + l.expectedRevenue, 0);
    return { total, hot, warm, cold, totalRevenue };
  }, []);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedLeads = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>
                Leads
              </h1>
              <p className={cn('text-sm mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
                {stats.total} leads · {formatCurrency(stats.totalRevenue)} pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className={cn(
                    'bg-transparent text-sm focus:outline-none w-full',
                    isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                  )}
                />
              </div>
              <Button className={cn(
                'shrink-0 h-9 px-4 rounded-xl text-xs font-semibold',
                isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
              )}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {[
              { label: 'Total Leads', value: stats.total.toString(), icon: Users, color: '' },
              { label: 'Hot Leads', value: stats.hot.toString(), icon: Flame, color: 'text-red-500' },
              { label: 'Warm Leads', value: stats.warm.toString(), icon: Star, color: 'text-amber-500' },
              { label: 'Cold Leads', value: stats.cold.toString(), icon: Snowflake, color: 'text-sky-500' },
              { label: 'Expected Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-500' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-2xl border p-4 transition-colors',
                  isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.color || (isDark ? 'text-white/30' : 'text-black/30'))} />
                  <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                </div>
                <p className={cn('text-xl font-bold tracking-tight', isDark ? 'text-white' : 'text-black')}>{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Intent Chips */}
            <div className="flex items-center gap-1">
              {(['all', 'hot', 'warm', 'cold'] as const).map((intent) => {
                const active = intentFilter === intent;
                return (
                  <button
                    key={intent}
                    onClick={() => { setIntentFilter(intent); setPage(1); }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      active
                        ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                        : isDark ? 'text-white/50 border-white/[0.06] hover:bg-white/[0.04]' : 'text-black/50 border-black/[0.06] hover:bg-black/[0.04]'
                    )}
                  >
                    {intent === 'all' ? 'All' : intent === 'hot' ? '🔥 Hot' : intent === 'warm' ? '⭐ Warm' : '❄️ Cold'}
                  </button>
                );
              })}
            </div>

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

            {/* Source */}
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v as ContactSource | 'all'); setPage(1); }}>
              <SelectTrigger className={cn(
                'w-[130px] h-8 text-xs rounded-lg',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="ad_campaign">Ad Campaign</SelectItem>
                <SelectItem value="cold_call">Cold Call</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as LeadStatus | 'all'); setPage(1); }}>
              <SelectTrigger className={cn(
                'w-[130px] h-8 text-xs rounded-lg',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
              )}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn(
              'rounded-2xl border overflow-hidden',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                    {['Name', 'Company', 'Source', 'Score', 'Intent', 'Status', 'Revenue', 'Next Action', 'Assigned', 'Actions'].map(col => (
                      <th
                        key={col}
                        className={cn(
                          'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                          isDark ? 'text-white/30' : 'text-black/30'
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead, i) => {
                    const intentCfg = INTENT_CONFIG[lead.intent];
                    const IntentIcon = intentCfg.icon;
                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => selectLead(lead.id)}
                        className={cn(
                          'border-b cursor-pointer transition-colors group',
                          isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]'
                        )}
                      >
                        {/* Name */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                              isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.06] text-black/60'
                            )}>
                              {lead.firstName[0]}{lead.lastName[0]}
                            </div>
                            <div>
                              <p className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-black')}>
                                {lead.firstName} {lead.lastName}
                              </p>
                              <p className={cn('text-[11px]', isDark ? 'text-white/30' : 'text-black/30')}>{lead.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className={cn('px-4 py-3 text-xs whitespace-nowrap', isDark ? 'text-white/50' : 'text-black/50')}>
                          {lead.company}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border capitalize',
                            SOURCE_COLORS[lead.source]
                          )}>
                            {lead.source.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Score */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <Progress
                              value={lead.score}
                              className={cn('h-1.5 w-16', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}
                            />
                            <span className={cn('text-xs font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
                              {lead.score}
                            </span>
                          </div>
                        </td>

                        {/* Intent */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold',
                            intentCfg.bg, intentCfg.text
                          )}>
                            <IntentIcon className="w-3 h-3" />
                            {intentCfg.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={STATUS_VARIANT[lead.status]} className="text-[10px] capitalize">
                            {lead.status}
                          </Badge>
                        </td>

                        {/* Revenue */}
                        <td className={cn('px-4 py-3 text-xs font-medium whitespace-nowrap', isDark ? 'text-white/70' : 'text-black/70')}>
                          {formatCurrency(lead.expectedRevenue)}
                        </td>

                        {/* Next Action */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={cn('text-xs max-w-[140px] truncate', isDark ? 'text-white/40' : 'text-black/40')}>
                            {lead.nextAction || '—'}
                          </p>
                        </td>

                        {/* Assigned */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{lead.assignedRep}</p>
                        </td>

                        {/* Quick Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]'
                              )}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]'
                              )}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]'
                              )}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className={cn('flex flex-col items-center justify-center py-16', isDark ? 'text-white/20' : 'text-black/20')}>
                <Search className="w-8 h-8 mb-3" />
                <p className="text-sm">No leads match your filters</p>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors disabled:opacity-30',
                    isDark ? 'border-white/[0.06] hover:bg-white/[0.04]' : 'border-black/[0.06] hover:bg-black/[0.04]'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                      p === page
                        ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                        : isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.04]'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors disabled:opacity-30',
                    isDark ? 'border-white/[0.06] hover:bg-white/[0.04]' : 'border-black/[0.06] hover:bg-black/[0.04]'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Lead Qualification Modal */}
      <Dialog open={!!selectedLeadModal} onOpenChange={(open) => !open && setSelectedLeadModal(null)}>
        <DialogContent className={cn(
          'sm:max-w-lg rounded-2xl',
          isDark ? 'bg-[#111] border-white/[0.08]' : 'bg-white border-black/[0.08]'
        )}>
          {selectedLeadModal && (
            <LeadQualificationModal lead={selectedLeadModal} isDark={isDark} onClose={() => setSelectedLeadModal(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LeadQualificationModal({ lead, isDark, onClose }: { lead: Lead; isDark: boolean; onClose: () => void }) {
  const intentCfg = INTENT_CONFIG[lead.intent];
  const IntentIcon = intentCfg.icon;

  const scoreBreakdown = [
    { label: 'Engagement', value: Math.round(lead.score * 0.35), weight: '35%' },
    { label: 'Fit Score', value: Math.round(lead.score * 0.30), weight: '30%' },
    { label: 'Behavior', value: Math.round(lead.score * 0.20), weight: '20%' },
    { label: 'Demographics', value: Math.round(lead.score * 0.15), weight: '15%' },
  ];

  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle className={cn('text-lg', isDark ? 'text-white' : 'text-black')}>
          Lead Qualification
        </DialogTitle>
      </DialogHeader>

      <div className={cn('rounded-xl p-4 border', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
            isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
          )}>
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <p className={cn('font-semibold', isDark ? 'text-white' : 'text-black')}>{lead.firstName} {lead.lastName}</p>
            <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>{lead.company} · {lead.email}</p>
          </div>
          <span className={cn(
            'ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold',
            intentCfg.bg, intentCfg.text
          )}>
            <IntentIcon className="w-3.5 h-3.5" />
            {intentCfg.label}
          </span>
        </div>

        {/* Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>Lead Score</span>
            <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-black')}>{lead.score}/100</span>
          </div>
          <div className="space-y-2">
            {scoreBreakdown.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={cn('text-[11px] w-24', isDark ? 'text-white/30' : 'text-black/30')}>{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      item.value >= 70 ? 'bg-emerald-500' : item.value >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                  />
                </div>
                <span className={cn('text-[10px] font-medium w-8 text-right', isDark ? 'text-white/40' : 'text-black/40')}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn('grid grid-cols-2 gap-3 text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
          <div>
            <span className={cn('block text-[10px] mb-0.5', isDark ? 'text-white/25' : 'text-black/25')}>Source</span>
            <span className="capitalize">{lead.source.replace('_', ' ')}</span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', isDark ? 'text-white/25' : 'text-black/25')}>Status</span>
            <span className="capitalize">{lead.status}</span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', isDark ? 'text-white/25' : 'text-black/25')}>Expected Revenue</span>
            <span className={cn('font-semibold', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
              {formatCurrency(lead.expectedRevenue)}
            </span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', isDark ? 'text-white/25' : 'text-black/25')}>Campaign</span>
            <span>{lead.campaign || '—'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          className={cn(
            'flex-1 h-9 rounded-xl text-xs font-semibold',
            isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
          )}
          onClick={onClose}
        >
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          Convert to Deal
        </Button>
        <Select>
          <SelectTrigger className={cn(
            'h-9 w-36 text-xs rounded-xl',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
          )}>
            <SelectValue placeholder="Assign Rep" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="u1">Priya Sharma</SelectItem>
            <SelectItem value="u2">Rahul Verma</SelectItem>
            <SelectItem value="u3">Ananya Das</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
