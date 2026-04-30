'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Flame, Star, Snowflake, ArrowRightLeft, Users, DollarSign, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { mockLeads } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { Lead, LeadIntent, LeadStatus, ContactSource } from '@/modules/crm-sales/types';
=======
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { mockLeads } from '@/modules/crm-sales/data/mock-data';
import type { Lead, LeadIntent, LeadStatus, ContactSource } from '@/modules/crm-sales/system/types';
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx

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

const createLeadFields: FormField[] = [
  { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'john@company.com', required: true },
  { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc', required: true },
  { key: 'expectedRevenue', label: 'Expected Revenue ($)', type: 'number', placeholder: '50000' },
  {
    key: 'source',
    label: 'Source',
    type: 'select',
    options: [
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Website', value: 'website' },
      { label: 'Event', value: 'event' },
      { label: 'Referral', value: 'referral' },
      { label: 'Ad Campaign', value: 'ad_campaign' },
      { label: 'Cold Call', value: 'cold_call' },
      { label: 'Organic', value: 'organic' },
    ],
  },
  {
    key: 'intent',
    label: 'Intent',
    type: 'select',
    options: [
      { label: '🔥 Hot', value: 'hot' },
      { label: '⭐ Warm', value: 'warm' },
      { label: '❄️ Cold', value: 'cold' },
    ],
  },
];

export default function LeadsPage() {
  const { selectLead } = useCrmSalesStore();

  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState<LeadIntent | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<ContactSource | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  // Table data
  const tableData = useMemo(
    () => filtered.map(l => ({
      id: l.id,
      name: `${l.firstName} ${l.lastName}`,
      company: l.company,
      ...l,
    })) as unknown as Record<string, unknown>[],
    [filtered]
  );

  // Column definitions
  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Name',
      render: (row) => {
        const l = row as unknown as Lead;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
              {l.firstName[0]}{l.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{l.firstName} {l.lastName}</p>
              <p className="text-[11px] text-[var(--app-text-muted)]">{l.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'company',
      label: 'Company',
      render: (row) => {
        const l = row as unknown as Lead;
        return <span className="text-xs text-[var(--app-text-secondary)]">{l.company}</span>;
      },
    },
    {
      key: 'source',
      label: 'Source',
      render: (row) => {
        const l = row as unknown as Lead;
        return (
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border capitalize', SOURCE_COLORS[l.source])}>
            {l.source.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'score',
      label: 'Score',
      render: (row) => {
        const l = row as unknown as Lead;
        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <Progress value={l.score} className="h-1.5 w-16 bg-[var(--app-hover-bg)]" />
            <span className="text-xs font-medium">{l.score}</span>
          </div>
        );
      },
    },
    {
      key: 'intent',
      label: 'Intent',
      render: (row) => {
        const l = row as unknown as Lead;
        const intentCfg = INTENT_CONFIG[l.intent];
        const IntentIcon = intentCfg.icon;
        return (
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold', intentCfg.bg, intentCfg.text)}>
            <IntentIcon className="w-3 h-3" />
            {intentCfg.label}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const l = row as unknown as Lead;
        return <Badge variant={STATUS_VARIANT[l.status]} className="text-[10px] capitalize">{l.status}</Badge>;
      },
    },
    {
      key: 'expectedRevenue',
      label: 'Revenue',
      render: (row) => {
        const l = row as unknown as Lead;
        return <span className="text-xs font-medium">{formatCurrency(l.expectedRevenue)}</span>;
      },
    },
    {
      key: 'nextAction',
      label: 'Next Action',
      render: (row) => {
        const l = row as unknown as Lead;
        return <p className="text-xs max-w-[140px] truncate text-[var(--app-text-muted)]">{l.nextAction || '—'}</p>;
      },
    },
    {
      key: 'assignedRep',
      label: 'Assigned',
      render: (row) => {
        const l = row as unknown as Lead;
        return <p className="text-xs text-[var(--app-text-muted)]">{l.assignedRep}</p>;
      },
    },
  ], []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-app-2xl max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
              <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
              <p className="text-sm mt-1 text-[var(--app-text-muted)]">
=======
              <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
                Leads
              </h1>
              <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
                {stats.total} leads · {formatCurrency(stats.totalRevenue)} pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
              <Button
                className="shrink-0 h-9 px-4 rounded-xl text-xs font-semibold"
                style={{ backgroundColor: CSS.accent, color: '#fff' }}
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
=======
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
                <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className={cn(
                    'bg-transparent text-sm focus:outline-none w-full',
                    'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                  )}
                />
              </div>
              <Button className={cn(
                'shrink-0 h-10  px-4 rounded-[var(--app-radius-lg)] text-xs font-semibold',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}>
                <Plus className="w-4 h-4 mr-1.5" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
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
              { label: 'Total Leads', value: stats.total.toString(), icon: Users },
              { label: 'Hot Leads', value: stats.hot.toString(), icon: Flame },
              { label: 'Warm Leads', value: stats.warm.toString(), icon: Star },
              { label: 'Cold Leads', value: stats.cold.toString(), icon: Snowflake },
              { label: 'Expected Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign },
            ].map((stat) => (
              <div
                key={stat.label}
<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
                className="rounded-2xl border p-4"
                style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-[var(--app-text-muted)]" />
                  <span className="text-xs font-medium text-[var(--app-text-muted)]">{stat.label}</span>
                </div>
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
=======
                className={cn(
                  'rounded-[var(--app-radius-xl)] border p-4 transition-colors',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn('w-4 h-4', stat.color || ('text-[var(--app-text-muted)]'))} />
                  <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                </div>
                <p className={cn('text-xl font-bold tracking-tight', 'text-[var(--app-text)]')}>{stat.value}</p>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {(['all', 'hot', 'warm', 'cold'] as const).map((intent) => {
                const active = intentFilter === intent;
                return (
                  <button
                    key={intent}
                    onClick={() => setIntentFilter(intent)}
                    className={cn(
                      'px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors border',
                      active
                        ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] border-[var(--app-active-bg)]'
                        : 'text-[var(--app-text-muted)] border-[var(--app-border)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    {intent === 'all' ? 'All' : intent === 'hot' ? '🔥 Hot' : intent === 'warm' ? '⭐ Warm' : '❄️ Cold'}
                  </button>
                );
              })}
            </div>

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as ContactSource | 'all')}>
              <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg bg-[var(--app-hover-bg)] border-[var(--app-border)]">
=======
            {/* Source */}
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v as ContactSource | 'all'); setPage(1); }}>
              <SelectTrigger className={cn(
                'w-[130px] h-8 text-xs rounded-[var(--app-radius-lg)]',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(SOURCE_COLORS).map(([key]) => (
                  <SelectItem key={key} value={key}>{key.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>

<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}>
              <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg bg-[var(--app-hover-bg)] border-[var(--app-border)]">
=======
            {/* Status */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as LeadStatus | 'all'); setPage(1); }}>
              <SelectTrigger className={cn(
                'w-[130px] h-8 text-xs rounded-[var(--app-radius-lg)]',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
              )}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
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

<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
          {/* SmartDataTable */}
          <SmartDataTable
            data={tableData}
            columns={columns}
            onRowClick={(row) => setSelectedLead(row as unknown as Lead)}
            searchable
            searchPlaceholder="Search leads..."
            searchKeys={['name', 'company', 'email']}
            emptyMessage="No leads match your filters"
            pageSize={8}
            enableExport
            actions={(row) => {
              const l = row as unknown as Lead;
              return (
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--app-hover-bg)]">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
                  </button>
                </div>
              );
            }}
          />
        </div>
      </ScrollArea>

      {/* Create Lead Modal */}
      <CreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Lead"
        description="Create a new lead in your pipeline"
        fields={createLeadFields}
        icon={Flame}
        submitLabel="Create Lead"
        onSubmit={(data) => {
          console.log('Creating lead:', data);
        }}
      />
=======
          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn(
              'rounded-[var(--app-radius-xl)] border overflow-hidden',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                    {['Name', 'Company', 'Source', 'Score', 'Intent', 'Status', 'Revenue', 'Next Action', 'Assigned', 'Actions'].map(col => (
                      <th
                        key={col}
                        className={cn(
                          'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                          'text-[var(--app-text-muted)]'
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
                          'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]'
                        )}
                      >
                        {/* Name */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                              'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]'
                            )}>
                              {lead.firstName[0]}{lead.lastName[0]}
                            </div>
                            <div>
                              <p className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>
                                {lead.firstName} {lead.lastName}
                              </p>
                              <p className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>{lead.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className={cn('px-4 py-3 text-xs whitespace-nowrap', 'text-[var(--app-text-secondary)]')}>
                          {lead.company}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-medium border capitalize',
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
                              className={cn('h-1.5 w-16', 'bg-[var(--app-hover-bg)]')}
                            />
                            <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                              {lead.score}
                            </span>
                          </div>
                        </td>

                        {/* Intent */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--app-radius-md)] text-[10px] font-semibold',
                            intentCfg.bg, intentCfg.text
                          )}>
                            <IntentIcon className="w-4 h-4" />
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
                        <td className={cn('px-4 py-3 text-xs font-medium whitespace-nowrap', 'text-[var(--app-text)]')}>
                          {formatCurrency(lead.expectedRevenue)}
                        </td>

                        {/* Next Action */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={cn('text-xs max-w-[140px] truncate', 'text-[var(--app-text-muted)]')}>
                            {lead.nextAction || '—'}
                          </p>
                        </td>

                        {/* Assigned */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{lead.assignedRep}</p>
                        </td>

                        {/* Quick Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                                'hover:bg-[var(--app-hover-bg)]'
                              )}
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                                'hover:bg-[var(--app-hover-bg)]'
                              )}
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className={cn(
                                'p-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                                'hover:bg-[var(--app-hover-bg)]'
                              )}
                            >
                              <Phone className="w-4 h-4" />
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
              <div className={cn('flex flex-col items-center justify-center py-16', 'text-[var(--app-text-disabled)]')}>
                <Search className="w-8 h-8 mb-3" />
                <p className="text-sm">No leads match your filters</p>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn(
                    'p-1.5 rounded-[var(--app-radius-lg)] border transition-colors disabled:opacity-30',
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
                      'w-8 h-8 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors',
                      p === page
                        ? 'bg-[var(--app-card-bg)] text-[var(--app-text)]'
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
                    'p-1.5 rounded-[var(--app-radius-lg)] border transition-colors disabled:opacity-30',
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
          'sm:max-w-lg rounded-[var(--app-radius-xl)]',
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
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx

      {/* Lead Detail Sidebar */}
      <ContextualSidebar
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : ''}
        subtitle="Lead"
        icon={Flame}
        width={420}
        footer={
          selectedLead ? (
            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1 rounded-xl text-xs" variant="outline" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-xl text-xs text-white"
                style={{ backgroundColor: CSS.accent }}
                onClick={() => {
                  console.log('Convert to deal:', selectedLead.id);
                  setSelectedLead(null);
                }}
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Convert to Deal
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedLead && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="rounded-xl p-4" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--app-hover-bg)] text-[var(--app-text)]">
                  {selectedLead.firstName[0]}{selectedLead.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{selectedLead.company}</p>
                  <p className="text-xs text-[var(--app-text-muted)]">{selectedLead.email}</p>
                </div>
                {(() => {
                  const intentCfg = INTENT_CONFIG[selectedLead.intent];
                  const IntentIcon = intentCfg.icon;
                  return (
                    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold', intentCfg.bg, intentCfg.text)}>
                      <IntentIcon className="w-3.5 h-3.5" />
                      {intentCfg.label}
                    </span>
                  );
                })()}
              </div>

<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
              {/* Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--app-text-muted)]">Lead Score</span>
                  <span className="text-sm font-bold">{selectedLead.score}/100</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                  <div
=======
  const scoreBreakdown = [
    { label: 'Engagement', value: Math.round(lead.score * 0.35), weight: '35%' },
    { label: 'Fit Score', value: Math.round(lead.score * 0.30), weight: '30%' },
    { label: 'Behavior', value: Math.round(lead.score * 0.20), weight: '20%' },
    { label: 'Demographics', value: Math.round(lead.score * 0.15), weight: '15%' },
  ];

  return (
    <div className="space-y-app-xl">
      <DialogHeader>
        <DialogTitle className={cn('text-lg', 'text-[var(--app-text)]')}>
          Lead Qualification
        </DialogTitle>
      </DialogHeader>

      <div className={cn('rounded-[var(--app-radius-lg)] p-4 border', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
            'bg-[var(--app-hover-bg)] text-[var(--app-text)]'
          )}>
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <p className={cn('font-semibold', 'text-[var(--app-text)]')}>{lead.firstName} {lead.lastName}</p>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>{lead.company} · {lead.email}</p>
          </div>
          <span className={cn(
            'ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-xs font-semibold',
            intentCfg.bg, intentCfg.text
          )}>
            <IntentIcon className="w-4 h-4" />
            {intentCfg.label}
          </span>
        </div>

        {/* Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>Lead Score</span>
            <span className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{lead.score}/100</span>
          </div>
          <div className="space-y-2">
            {scoreBreakdown.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className={cn('text-[11px] w-24', 'text-[var(--app-text-muted)]')}>{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-black/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
                    className={cn(
                      'h-full rounded-full transition-all',
                      selectedLead.score >= 70 ? 'bg-emerald-500' : selectedLead.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${selectedLead.score}%` }}
                  />
                </div>
<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
=======
                <span className={cn('text-[10px] font-medium w-8 text-right', 'text-[var(--app-text-muted)]')}>
                  {item.value}
                </span>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
              </div>

<<<<<<< HEAD:frontend/src/modules/crm-sales/leads-page.tsx
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--app-text-secondary)]">
                <div>
                  <span className="block text-[10px] text-[var(--app-text-disabled)] mb-0.5">Source</span>
                  <span className="capitalize">{selectedLead.source.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--app-text-disabled)] mb-0.5">Status</span>
                  <Badge variant={STATUS_VARIANT[selectedLead.status]} className="text-[10px] h-5 capitalize">{selectedLead.status}</Badge>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--app-text-disabled)] mb-0.5">Expected Revenue</span>
                  <span className="font-semibold text-emerald-500">{formatCurrency(selectedLead.expectedRevenue)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--app-text-disabled)] mb-0.5">Campaign</span>
                  <span>{selectedLead.campaign || '—'}</span>
                </div>
              </div>
            </div>

            {/* Next Action */}
            {selectedLead.nextAction && (
              <div>
                <span className="text-xs font-medium text-[var(--app-text-secondary)]">Next Action</span>
                <p className="text-sm mt-1">{selectedLead.nextAction}</p>
              </div>
            )}

            {/* Assigned */}
            <div>
              <span className="text-xs font-medium text-[var(--app-text-secondary)]">Assigned Rep</span>
              <p className="text-sm mt-1">{selectedLead.assignedRep}</p>
            </div>
          </div>
        )}
      </ContextualSidebar>
=======
        <div className={cn('grid grid-cols-2 gap-3 text-xs', 'text-[var(--app-text-secondary)]')}>
          <div>
            <span className={cn('block text-[10px] mb-0.5', 'text-[var(--app-text-muted)]')}>Source</span>
            <span className="capitalize">{lead.source.replace('_', ' ')}</span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', 'text-[var(--app-text-muted)]')}>Status</span>
            <span className="capitalize">{lead.status}</span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', 'text-[var(--app-text-muted)]')}>Expected Revenue</span>
            <span className={cn('font-semibold', 'text-[var(--app-success)]')}>
              {formatCurrency(lead.expectedRevenue)}
            </span>
          </div>
          <div>
            <span className={cn('block text-[10px] mb-0.5', 'text-[var(--app-text-muted)]')}>Campaign</span>
            <span>{lead.campaign || '—'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          className={cn(
            'flex-1 h-10  rounded-[var(--app-radius-lg)] text-xs font-semibold',
            'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
          )}
          onClick={onClose}
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Convert to Deal
        </Button>
        <Select>
          <SelectTrigger className={cn(
            'h-10  w-36 text-xs rounded-[var(--app-radius-lg)]',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
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
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/core/leads/leads-page.tsx
    </div>
  );
}
