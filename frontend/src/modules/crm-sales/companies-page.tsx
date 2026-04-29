'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Building2, DollarSign, TrendingUp, Users, Filter, MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockCompanies } from '@/modules/crm-sales/data/mock-data';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import CompanyCard from './components/company-card';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { CSS } from '@/styles/design-tokens';
import type { Company } from '@/modules/crm-sales/types';

type ViewMode = 'grid' | 'table';

function formatARR(arr: number): string {
  if (arr >= 1_000_000) return `$${(arr / 1_000_000).toFixed(1)}M`;
  if (arr >= 1_000) return `$${(arr / 1_000).toFixed(0)}K`;
  return `$${arr}`;
}

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

const createCompanyFields: FormField[] = [
  { key: 'name', label: 'Company Name', type: 'text', placeholder: 'Acme Inc', required: true },
  { key: 'industry', label: 'Industry', type: 'text', placeholder: 'SaaS' },
  { key: 'website', label: 'Website', type: 'text', placeholder: 'https://acme.com' },
  { key: 'owner', label: 'Owner', type: 'text', placeholder: 'Sales Rep Name' },
  { key: 'arr', label: 'ARR ($)', type: 'number', placeholder: '500000' },
  { key: 'employees', label: 'Employees', type: 'number', placeholder: '250' },
];

export default function CompaniesPage() {
  const selectCompany = useCrmSalesStore((s) => s.selectCompany);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Industries from data
  const industries = useMemo(() => {
    const set = new Set(mockCompanies.map(c => c.industry));
    return Array.from(set).sort();
  }, []);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...mockCompanies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.website || '').toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q)
      );
    }

    if (industryFilter !== 'all') {
      result = result.filter(c => c.industry === industryFilter);
    }

    return result;
  }, [searchQuery, industryFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: mockCompanies.length,
    totalARR: mockCompanies.reduce((sum, c) => sum + c.arr, 0),
    avgHealth: Math.round(mockCompanies.reduce((sum, c) => sum + c.healthScore, 0) / mockCompanies.length),
    activeDeals: mockCompanies.reduce((sum, c) => sum + c.activeDeals, 0),
  }), []);

  // Table data for SmartDataTable
  const tableData = useMemo(
    () => filtered.map(c => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      arr: c.arr,
      linkedContacts: c.linkedContacts,
      activeDeals: c.activeDeals,
      healthScore: c.healthScore,
      owner: c.owner,
      website: c.website,
      logo: c.logo,
      ...c,
    })) as unknown as Record<string, unknown>[],
    [filtered]
  );

  // Column definitions
  const columns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'name',
      label: 'Company',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Company;
        const initials = c.name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={c.logo} alt={c.name} />
              <AvatarFallback className="text-xs font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <p className="text-xs text-[var(--app-text-muted)] truncate">{c.website}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'industry',
      label: 'Industry',
      render: (row) => {
        const c = row as unknown as Company;
        return <span className="text-sm">{c.industry}</span>;
      },
    },
    {
      key: 'arr',
      label: 'ARR',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Company;
        return <span className="text-sm font-semibold">{formatARR(c.arr)}</span>;
      },
    },
    {
      key: 'linkedContacts',
      label: 'Contacts',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Company;
        return <span className="text-sm">{c.linkedContacts}</span>;
      },
    },
    {
      key: 'activeDeals',
      label: 'Deals',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Company;
        return <span className="text-sm">{c.activeDeals}</span>;
      },
    },
    {
      key: 'healthScore',
      label: 'Health',
      sortable: true,
      render: (row) => {
        const c = row as unknown as Company;
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
              <div
                className={cn('h-full rounded-full transition-all', getHealthBarColor(c.healthScore))}
                style={{ width: `${c.healthScore}%` }}
              />
            </div>
            <span className={cn('text-[11px] font-medium w-7 text-right', getHealthColor(c.healthScore))}>
              {c.healthScore}
            </span>
          </div>
        );
      },
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (row) => {
        const c = row as unknown as Company;
        return <span className="text-xs">{c.owner}</span>;
      },
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Companies</h1>
            <Badge variant="secondary" className="text-xs font-medium bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]">
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={(v) => setIndustryFilter(v)}>
              <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl border border-[var(--app-border)] text-[var(--app-text-secondary)]">
                <Filter className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border p-0.5 border-[var(--app-border)]">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  viewMode === 'grid'
                    ? 'bg-[var(--app-active-bg)] text-[var(--app-text)]'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                )}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  viewMode === 'table'
                    ? 'bg-[var(--app-active-bg)] text-[var(--app-text)]'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
                )}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>

            {/* Add Company */}
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Companies', value: stats.total, icon: Building2, format: false },
            { label: 'Total ARR', value: stats.totalARR, icon: DollarSign, format: true },
            { label: 'Avg Health', value: `${stats.avgHealth}%`, icon: TrendingUp, format: false },
            { label: 'Active Deals', value: stats.activeDeals, icon: Users, format: false },
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
              <p className="text-xl font-bold">
                {stat.format ? formatARR(stat.value as number) : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center py-16">
                <p className="text-sm text-[var(--app-text-muted)]">No companies found</p>
                <p className="text-xs text-[var(--app-text-disabled)] mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filtered.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  onClick={() => setSelectedCompany(company)}
                  className="cursor-pointer"
                >
                  <CompanyCard company={company} />
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <SmartDataTable
            data={tableData}
            columns={columns}
            onRowClick={(row) => setSelectedCompany(row as unknown as Company)}
            searchable
            searchPlaceholder="Search companies..."
            searchKeys={['name', 'industry', 'owner']}
            emptyMessage="No companies found. Try adjusting your search or filters."
            pageSize={9}
            enableExport
            selectable
            actions={(row) => (
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
                  <DropdownMenuItem onClick={() => setSelectedCompany(row as unknown as Company)}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Company</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        )}
      </div>

      {/* Create Company Modal */}
      <CreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Company"
        description="Add a new company to your CRM"
        fields={createCompanyFields}
        icon={Building2}
        submitLabel="Create Company"
        onSubmit={(data) => {
          console.log('Creating company:', data);
        }}
      />

      {/* Company Detail Sidebar */}
      <ContextualSidebar
        open={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name || ''}
        subtitle="Company"
        icon={Building2}
        width={400}
        footer={
          selectedCompany ? (
            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1 rounded-xl text-xs" variant="outline" onClick={() => setSelectedCompany(null)}>
                Close
              </Button>
              <Button size="sm" className="flex-1 rounded-xl text-xs text-white" style={{ backgroundColor: CSS.accent }}>
                Edit
              </Button>
            </div>
          ) : undefined
        }
      >
        {selectedCompany && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
                <AvatarFallback className="text-lg font-bold bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)]">
                  {selectedCompany.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{selectedCompany.industry}</p>
                {selectedCompany.website && (
                  <p className="text-xs text-[var(--app-text-muted)]">{selectedCompany.website}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">ARR</span>
                <p className="text-lg font-bold mt-1">{formatARR(selectedCompany.arr)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Health</span>
                <p className={cn('text-lg font-bold mt-1', getHealthColor(selectedCompany.healthScore))}>
                  {selectedCompany.healthScore}
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Contacts</span>
                <p className="text-lg font-bold mt-1">{selectedCompany.linkedContacts}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: CSS.hoverBg }}>
                <span className="text-[10px] text-[var(--app-text-muted)]">Active Deals</span>
                <p className="text-lg font-bold mt-1">{selectedCompany.activeDeals}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-[var(--app-text-muted)]">Owner</span>
              <p className="text-sm">{selectedCompany.owner}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--app-text-secondary)]">Health Score</span>
              <div className="h-2 rounded-full overflow-hidden bg-[var(--app-hover-bg)]">
                <div
                  className={cn('h-full rounded-full', getHealthBarColor(selectedCompany.healthScore))}
                  style={{ width: `${selectedCompany.healthScore}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </ContextualSidebar>
    </div>
  );
}
