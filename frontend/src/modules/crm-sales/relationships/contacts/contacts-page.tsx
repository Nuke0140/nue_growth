'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, Download, Upload, SlidersHorizontal, MoreHorizontal,
  Users, Flame, Star, UserX, Mail, Phone, Globe, Linkedin, ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockContacts } from '@/modules/crm-sales/data/mock-data';
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { Contact, AiIntent } from '@/modules/crm-sales/types';
=======
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import type { Contact, AiIntent } from '@/modules/crm-sales/system/types';
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx

type FilterKey = 'all' | 'high' | 'vip' | 'inactive';

const intentConfig: Record<AiIntent, { label: string; emoji: string; className: string }> = {
  high: { label: 'High Intent', emoji: '🔥', className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  medium: { label: 'Healthy', emoji: '🟢', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  low: { label: 'Low', emoji: '⚠️', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  inactive: { label: 'Inactive', emoji: '💤', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
};

function getHealthColor(score: number) {
  if (score > 75) return 'text-emerald-400';
  if (score > 50) return 'text-yellow-400';
  return 'text-red-400';
}

function getHealthBarColor(score: number) {
  if (score > 75) return 'bg-emerald-500';
  if (score > 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getStageLabel(stage: string) {
  const map: Record<string, string> = {
    lead: 'Lead', mql: 'MQL', sql: 'SQL', opportunity: 'Opportunity',
    customer: 'Customer', retained: 'Retained', advocate: 'Advocate',
  };
  return map[stage] || stage;
}

<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
function getStageColor(stage: string) {
  const map: Record<string, string> = {
    lead: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    mql: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    sql: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    opportunity: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    customer: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    retained: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
    advocate: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  };
  return map[stage] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20';
=======
function getStageColor(stage: string, isDark: boolean) {
  switch (stage) {
    case 'lead': return isDark ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200';
    case 'mql': return isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
    case 'sql': return 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30';
    case 'opportunity': return 'bg-[var(--app-accent-light)] text-[var(--app-accent)] border-[var(--app-accent)]/30';
    case 'customer': return 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30';
    case 'retained': return isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200';
    case 'advocate': return isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200';
    default: return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
  }
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
}

function getSourceLabel(source: string) {
  const map: Record<string, string> = {
    website: 'Website', referral: 'Referral', linkedin: 'LinkedIn',
    cold_call: 'Cold Call', event: 'Event', ad_campaign: 'Ad Campaign',
    organic: 'Organic', import: 'Import',
  };
  return map[source] || source;
}

const createContactFields: FormField[] = [
  { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'john@company.com', required: true },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: '+1 (555) 000-0000' },
  { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc' },
  { key: 'title', label: 'Job Title', type: 'text', placeholder: 'VP of Sales' },
  {
    key: 'source',
    label: 'Source',
    type: 'select',
    options: [
      { label: 'Website', value: 'website' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Referral', value: 'referral' },
      { label: 'Event', value: 'event' },
      { label: 'Cold Call', value: 'cold_call' },
      { label: 'Organic', value: 'organic' },
    ],
  },
];

export default function ContactsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [isLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Filter
  const filtered = useMemo(() => {
    let result = [...mockContacts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case 'high': result = result.filter(c => c.aiIntent === 'high'); break;
      case 'vip': result = result.filter(c => c.tags.includes('VIP') || c.healthScore > 90); break;
      case 'inactive': result = result.filter(c => c.aiIntent === 'inactive' || c.healthScore < 40); break;
    }

    return result;
  }, [searchQuery, activeFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: mockContacts.length,
    highIntent: mockContacts.filter(c => c.aiIntent === 'high').length,
    avgHealth: Math.round(mockContacts.reduce((sum, c) => sum + c.healthScore, 0) / mockContacts.length),
    newThisMonth: mockContacts.filter(c => {
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  }), []);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Users, count: stats.total },
    { key: 'high', label: 'High Intent', icon: Flame, count: stats.highIntent },
    { key: 'vip', label: 'VIP', icon: Star, count: mockContacts.filter(c => c.tags.includes('VIP') || c.healthScore > 90).length },
    { key: 'inactive', label: 'Inactive', icon: UserX, count: mockContacts.filter(c => c.aiIntent === 'inactive' || c.healthScore < 40).length },
  ];

<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
  // Table columns
  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => {
        const r = row as unknown as Contact;
        const fullName = `${r.firstName} ${r.lastName}`;
        const initials = `${r.firstName.charAt(0)}${r.lastName.charAt(0)}`;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={r.avatar} alt={fullName} />
              <AvatarFallback className={cn(
                'text-xs font-semibold',
                r.healthScore > 75 && 'bg-emerald-500/15 text-emerald-400',
                r.healthScore > 50 && r.healthScore <= 75 && 'bg-yellow-500/15 text-yellow-400',
                r.healthScore <= 50 && 'bg-red-500/15 text-red-400',
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{fullName}</p>
              <p className="text-xs text-[var(--app-text-muted)] truncate">{r.title}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (row) => {
        const r = row as unknown as Contact;
        return <span className="text-sm">{r.company || '—'}</span>;
      },
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => {
        const r = row as unknown as Contact;
        return <span className="text-xs">{r.email}</span>;
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => {
        const r = row as unknown as Contact;
        return <span className="text-xs">{r.phone}</span>;
      },
    },
    {
      key: 'source',
      label: 'Source',
      render: (row) => {
        const r = row as unknown as Contact;
        return (
          <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', getStageColor(r.source))}>
            {getSourceLabel(r.source)}
          </span>
        );
      },
    },
    {
      key: 'lifecycleStage',
      label: 'Stage',
      sortable: true,
      render: (row) => {
        const r = row as unknown as Contact;
        return (
          <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', getStageColor(r.lifecycleStage))}>
            {getStageLabel(r.lifecycleStage)}
          </span>
        );
      },
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (row) => {
        const r = row as unknown as Contact;
        return <span className="text-xs">{r.owner}</span>;
      },
    },
    {
      key: 'healthScore',
      label: 'Health',
      sortable: true,
      render: (row) => {
        const r = row as unknown as Contact;
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
              <div
                className={cn('h-full rounded-full transition-all', getHealthBarColor(r.healthScore))}
                style={{ width: `${r.healthScore}%` }}
              />
            </div>
            <span className={cn('text-[11px] font-medium w-7 text-right', getHealthColor(r.healthScore))}>
              {r.healthScore}
            </span>
          </div>
        );
      },
    },
    {
      key: 'aiIntent',
      label: 'AI Intent',
      sortable: true,
      render: (row) => {
        const r = row as unknown as Contact;
        const intent = intentConfig[r.aiIntent];
        return (
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border', intent.className)}>
            <span className="text-[10px]">{intent.emoji}</span>
            {intent.label}
          </span>
        );
      },
    },
    {
      key: 'lastInteraction',
      label: 'Last Active',
      render: (row) => {
        const r = row as unknown as Contact;
        return <span className="text-xs text-[var(--app-text-muted)]">{r.lastInteraction}</span>;
      },
    },
  ], []);

  const tableData = useMemo(
    () => filtered.map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      company: c.company || '',
      email: c.email,
      phone: c.phone,
      source: c.source,
      lifecycleStage: c.lifecycleStage,
      owner: c.owner,
      healthScore: c.healthScore,
      aiIntent: c.aiIntent,
      lastInteraction: c.lastInteraction,
      ...c,
    })) as unknown as Record<string, unknown>[],
    [filtered]
  );
=======
  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  }
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-app-2xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10  w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[var(--app-radius-xl)]" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-[var(--app-radius-lg)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Contacts</h1>
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
            <Badge variant="secondary" className="text-xs font-medium bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]">
=======
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
            )}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl shrink-0"
              style={{ backgroundColor: CSS.accent, color: '#fff' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
=======
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64 transition-colors',
              'bg-[var(--app-card-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(
                      'h-10  w-9 rounded-[var(--app-radius-lg)] shrink-0',
                      'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Add Contact</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
                <Upload className="w-3.5 h-3.5" />
=======
              <Button variant="ghost" size="sm" className={cn(
                'h-8 gap-1.5 text-xs',
                'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
              )}>
                <Upload className="w-4 h-4" />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
                Import CSV
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Import from CSV</DropdownMenuItem>
              <DropdownMenuItem>Import from Google Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Bulk Actions
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: CSS.hoverBg }}>
=======

          <Button variant="ghost" size="sm" className={cn(
            'h-8 gap-1.5 text-xs',
            'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
          )}>
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button variant="ghost" size="sm" className={cn(
            'h-8 gap-1.5 text-xs',
            'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
          )}>
            <SlidersHorizontal className="w-4 h-4" />
            Bulk Actions
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(
                'h-8 gap-1.5 text-xs',
                'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
              )}>
                <Eye className="w-4 h-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Avatar + Name</DropdownMenuItem>
              <DropdownMenuItem>Company</DropdownMenuItem>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Phone</DropdownMenuItem>
              <DropdownMenuItem>Source</DropdownMenuItem>
              <DropdownMenuItem>Lifecycle Stage</DropdownMenuItem>
              <DropdownMenuItem>Owner</DropdownMenuItem>
              <DropdownMenuItem>Health Score</DropdownMenuItem>
              <DropdownMenuItem>AI Intent</DropdownMenuItem>
              <DropdownMenuItem>Last Interaction</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(
                'h-8 gap-1.5 text-xs',
                'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]'
              )}>
                <Bookmark className="w-4 h-4" />
                Saved Views
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Contacts</DropdownMenuItem>
              <DropdownMenuItem>Enterprise Accounts</DropdownMenuItem>
              <DropdownMenuItem>New This Month</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Save Current View...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit" style={{ background: 'var(--app-hover-bg)' }}>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors duration-200',
                  isActive
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
                    ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
=======
                    ? isDark
                      ? 'bg-white/[0.08] text-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
                      : 'bg-black/[0.06] text-black shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
                    : isDark
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-black/40 hover:text-black/70'
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
                )}
              >
                <filter.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold',
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
                  isActive ? 'bg-[var(--app-active-bg)]' : 'bg-[var(--app-hover-bg)]'
=======
                  isActive
                    ? 'bg-[var(--app-hover-bg)]'
                    : 'bg-[var(--app-hover-bg)]'
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
                )}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Contacts', value: stats.total, icon: Users },
            { label: 'High Intent', value: stats.highIntent, icon: Flame },
            { label: 'Avg Health Score', value: `${stats.avgHealth}%`, icon: ArrowUp },
            { label: 'New This Month', value: stats.newThisMonth, icon: Plus },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-2xl border p-4"
              style={{ backgroundColor: CSS.cardBg, borderColor: CSS.border }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[var(--app-text-muted)]">
                  {stat.label}
                </span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: CSS.hoverBg }}>
                  <stat.icon className="w-3.5 h-3.5 text-[var(--app-text-muted)]" />
=======
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-[var(--app-radius-xl)] border p-4',
                'bg-[var(--app-card-bg)] border-[var(--app-border)]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>
                  {stat.label}
                </span>
                <div className={cn(
                  'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center',
                  'bg-[var(--app-hover-bg)]'
                )}>
                  <stat.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

<<<<<<< HEAD:frontend/src/modules/crm-sales/contacts-page.tsx
        {/* SmartDataTable */}
        <SmartDataTable
          data={tableData}
          columns={columns}
          onRowClick={(row) => setSelectedContact(row as unknown as Contact)}
          searchable
          searchPlaceholder="Search contacts..."
          searchKeys={['name', 'company', 'email', 'title']}
          emptyMessage="No contacts found. Try adjusting your search or filters."
          pageSize={8}
          enableExport
          selectable
          actions={(row) => {
            const contact = row as unknown as Contact;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--app-hover-bg)]"
                  >
                    <MoreHorizontal className="w-4 h-4 text-[var(--app-text-muted)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedContact(contact)}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuItem>Schedule Call</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </div>

      {/* Create Contact Modal */}
      <CreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Contact"
        description="Add a new contact to your CRM"
        fields={createContactFields}
        icon={Users}
        submitLabel="Create Contact"
        onSubmit={(data) => {
          console.log('Creating contact:', data);
        }}
      />

      {/* Contact Detail Sidebar */}
      <ContextualSidebar
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : ''}
        subtitle="Contact"
        icon={Users}
        width={400}
        footer={
          selectedContact ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 rounded-xl text-xs"
                variant="outline"
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-xl text-xs text-white"
                style={{ backgroundColor: CSS.accent }}
              >
                Edit Contact
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedContact && (
          <div className="space-y-5">
            {/* Avatar + basic info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback className="text-lg font-bold bg-emerald-500/15 text-emerald-400">
                  {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{selectedContact.title}</p>
                <p className="text-xs text-[var(--app-text-muted)]">{selectedContact.company}</p>
=======
        {/* Table */}
        <div className={cn(
          'rounded-[var(--app-radius-xl)] border overflow-hidden',
          'bg-[var(--app-card-bg)] border-[var(--app-border)]'
        )}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  'border-b hover:bg-transparent',
                  'border-[var(--app-border-light)]'
                )}>
                  <TableHead className={cn('w-[40px]')}>
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                      Name {renderSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button onClick={() => handleSort('company')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                      Company {renderSortIcon('company')}
                    </button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden xl:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <button onClick={() => handleSort('lifecycleStage')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                      Stage {renderSortIcon('lifecycleStage')}
                    </button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Owner</TableHead>
                  <TableHead>
                    <button onClick={() => handleSort('healthScore')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                      Health {renderSortIcon('healthScore')}
                    </button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button onClick={() => handleSort('aiIntent')} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                      AI Intent {renderSortIcon('aiIntent')}
                    </button>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Last Active</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn(
                          'w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center',
                          'bg-[var(--app-hover-bg)]'
                        )}>
                          <Users className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} />
                        </div>
                        <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
                          No contacts found
                        </p>
                        <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((contact, idx) => {
                    const fullName = `${contact.firstName} ${contact.lastName}`;
                    const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
                    const intent = intentConfig[contact.aiIntent];

                    return (
                      <motion.tr
                        key={contact.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => selectContact(contact.id)}
                        className={cn(
                          'border-b cursor-pointer transition-colors duration-150 last:border-0',
                          isDark
                            ? 'border-white/[0.03] hover:bg-white/[0.04]'
                            : 'border-black/[0.03] hover:bg-black/[0.02]'
                        )}
                      >
                        <TableCell className="px-3">
                          <input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} />
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={contact.avatar} alt={fullName} />
                              <AvatarFallback className={cn(
                                'text-xs font-semibold',
                                contact.healthScore > 75 && 'bg-emerald-500/15 text-emerald-400',
                                contact.healthScore > 50 && contact.healthScore <= 75 && 'bg-yellow-500/15 text-yellow-400',
                                contact.healthScore <= 50 && 'bg-red-500/15 text-red-400',
                              )}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{fullName}</p>
                              <p className={cn('text-xs truncate', 'text-[var(--app-text-muted)]')}>
                                {contact.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn('text-sm', 'text-[var(--app-text-secondary)]')}>
                            {contact.company || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                            {contact.email}
                          </span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                            {contact.phone}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[11px] font-medium border',
                            isDark ? 'bg-white/[0.04] text-white/50 border-white/[0.06]' : 'bg-black/[0.04] text-black/50 border-black/[0.06]'
                          )}>
                            {getSourceLabel(contact.source)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[11px] font-medium border',
                            getStageColor(contact.lifecycleStage, isDark)
                          )}>
                            {getStageLabel(contact.lifecycleStage)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                            {contact.owner}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                              <div
                                className={cn('h-full rounded-full transition-colors', getHealthBarColor(contact.healthScore))}
                                style={{ width: `${contact.healthScore}%` }}
                              />
                            </div>
                            <span className={cn('text-[11px] font-medium w-7 text-right', getHealthColor(contact.healthScore))}>
                              {contact.healthScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border',
                            intent.className
                          )}>
                            <span className="text-[10px]">{intent.emoji}</span>
                            {intent.label}
                          </span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell px-3">
                          <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                            {contact.lastInteraction}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                                  'hover:bg-[var(--app-hover-bg)]'
                                )}
                              >
                                <MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Call</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className={cn(
              'flex items-center justify-between px-4 py-3 border-t',
              'border-[var(--app-border-light)]'
            )}>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center text-xs font-medium transition-colors',
                        currentPage === pageNum
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : isDark
                            ? 'text-white/50 hover:bg-white/[0.06]'
                            : 'text-black/50 hover:bg-black/[0.06]'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041:frontend/src/modules/crm-sales/relationships/contacts/contacts-page.tsx
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span>{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[var(--app-text-muted)]" />
                <span>{selectedContact.phone}</span>
              </div>
              {selectedContact.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-[var(--app-text-muted)]" />
                  <span>{selectedContact.company}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xs text-[var(--app-text-muted)]">Source:</span>
                <span className="text-xs">{getSourceLabel(selectedContact.source)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xs text-[var(--app-text-muted)]">Owner:</span>
                <span className="text-xs">{selectedContact.owner}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xs text-[var(--app-text-muted)]">Last Active:</span>
                <span className="text-xs">{selectedContact.lastInteraction}</span>
              </div>
            </div>

            {/* Health Score */}
            <div className="rounded-xl p-4" style={{ backgroundColor: CSS.hoverBg }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[var(--app-text-secondary)]">Health Score</span>
                <span className={cn('text-lg font-bold', getHealthColor(selectedContact.healthScore))}>
                  {selectedContact.healthScore}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: CSS.hoverBg }}>
                <div
                  className={cn('h-full rounded-full', getHealthBarColor(selectedContact.healthScore))}
                  style={{ width: `${selectedContact.healthScore}%` }}
                />
              </div>
            </div>

            {/* AI Intent */}
            <div className="rounded-xl p-4" style={{ backgroundColor: CSS.hoverBg }}>
              <span className="text-xs font-medium text-[var(--app-text-secondary)]">AI Intent</span>
              <div className="mt-2">
                {(() => {
                  const intent = intentConfig[selectedContact.aiIntent];
                  return (
                    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border', intent.className)}>
                      <span>{intent.emoji}</span>
                      {intent.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Lifecycle Stage */}
            <div className="rounded-xl p-4" style={{ backgroundColor: CSS.hoverBg }}>
              <span className="text-xs font-medium text-[var(--app-text-secondary)]">Lifecycle Stage</span>
              <div className="mt-2">
                <span className={cn('inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border', getStageColor(selectedContact.lifecycleStage))}>
                  {getStageLabel(selectedContact.lifecycleStage)}
                </span>
              </div>
            </div>

            {/* Tags */}
            {selectedContact.tags.length > 0 && (
              <div>
                <span className="text-xs font-medium text-[var(--app-text-secondary)]">Tags</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedContact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ContextualSidebar>
    </div>
  );
}
