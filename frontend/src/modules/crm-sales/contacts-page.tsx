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
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { Contact, AiIntent } from '@/modules/crm-sales/types';

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

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Contacts</h1>
            <Badge variant="secondary" className="text-xs font-medium bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]">
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl shrink-0"
              style={{ backgroundColor: CSS.accent, color: '#fff' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)]">
                <Upload className="w-3.5 h-3.5" />
                Import CSV
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Import from CSV</DropdownMenuItem>
              <DropdownMenuItem>Import from Google Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[var(--app-active-bg)] text-[var(--app-text)] shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                )}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold',
                  isActive ? 'bg-[var(--app-active-bg)]' : 'bg-[var(--app-hover-bg)]'
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
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

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
