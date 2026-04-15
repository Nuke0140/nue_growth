'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, Download, Upload, SlidersHorizontal, MoreHorizontal,
  Users, Flame, Star, UserX, ChevronLeft, ChevronRight, LayoutGrid,
  List, ArrowUpDown, Filter, Eye, Bookmark, Mail, Phone, Globe, Linkedin,
  ArrowUp, ArrowDown, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { mockContacts } from '@/modules/crm-sales/data/mock-data';
import { useCrmSalesStore } from '@/modules/crm-sales/crm-sales-store';
import type { Contact, AiIntent } from '@/modules/crm-sales/types';

type FilterKey = 'all' | 'high' | 'vip' | 'inactive';
type SortField = 'name' | 'company' | 'healthScore' | 'aiIntent' | 'lastInteraction' | 'lifecycleStage';
type SortDir = 'asc' | 'desc';

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

function getStageColor(stage: string, isDark: boolean) {
  switch (stage) {
    case 'lead': return isDark ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200';
    case 'mql': return isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
    case 'sql': return isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200';
    case 'opportunity': return isDark ? 'bg-orange-500/15 text-orange-300 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200';
    case 'customer': return isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'retained': return isDark ? 'bg-teal-500/15 text-teal-300 border-teal-500/20' : 'bg-teal-50 text-teal-700 border-teal-200';
    case 'advocate': return isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200';
    default: return isDark ? 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20' : 'bg-zinc-50 text-zinc-700 border-zinc-200';
  }
}

function getSourceLabel(source: string) {
  const map: Record<string, string> = {
    website: 'Website', referral: 'Referral', linkedin: 'LinkedIn',
    cold_call: 'Cold Call', event: 'Event', ad_campaign: 'Ad Campaign',
    organic: 'Organic', import: 'Import',
  };
  return map[source] || source;
}

const ITEMS_PER_PAGE = 8;

export default function ContactsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);

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

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'company': cmp = (a.company || '').localeCompare(b.company || ''); break;
        case 'healthScore': cmp = a.healthScore - b.healthScore; break;
        case 'aiIntent':
          const order: Record<AiIntent, number> = { high: 3, medium: 2, low: 1, inactive: 0 };
          cmp = order[a.aiIntent] - order[b.aiIntent];
          break;
        case 'lastInteraction': cmp = 0; break;
        case 'lifecycleStage': cmp = 0; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [searchQuery, activeFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Users, count: stats.total },
    { key: 'high', label: 'High Intent', icon: Flame, count: stats.highIntent },
    { key: 'vip', label: 'VIP', icon: Star, count: mockContacts.filter(c => c.tags.includes('VIP') || c.healthScore > 90).length },
    { key: 'inactive', label: 'Inactive', icon: UserX, count: mockContacts.filter(c => c.aiIntent === 'inactive' || c.healthScore < 40).length },
  ];

  function renderSortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  }

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
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors',
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(
                      'h-9 w-9 rounded-xl shrink-0',
                      isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Add Contact</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(
                'h-8 gap-1.5 text-xs',
                isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]'
              )}>
                <Upload className="w-3.5 h-3.5" />
                Import CSV
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Import from CSV</DropdownMenuItem>
              <DropdownMenuItem>Import from Google Sheets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className={cn(
            'h-8 gap-1.5 text-xs',
            isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]'
          )}>
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>

          <Button variant="ghost" size="sm" className={cn(
            'h-8 gap-1.5 text-xs',
            isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]'
          )}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Bulk Actions
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(
                'h-8 gap-1.5 text-xs',
                isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]'
              )}>
                <Eye className="w-3.5 h-3.5" />
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
                isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.06]'
              )}>
                <Bookmark className="w-3.5 h-3.5" />
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
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? isDark
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'bg-black/[0.06] text-black shadow-sm'
                    : isDark
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-black/40 hover:text-black/70'
                )}
              >
                <filter.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-bold',
                  isActive
                    ? isDark ? 'bg-white/[0.15]' : 'bg-black/[0.1]'
                    : isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
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
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                  {stat.label}
                </span>
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center',
                  isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
                )}>
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className={cn(
          'rounded-2xl border overflow-hidden',
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  'border-b hover:bg-transparent',
                  isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
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
                          'w-14 h-14 rounded-2xl flex items-center justify-center',
                          isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
                        )}>
                          <Users className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
                        </div>
                        <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>
                          No contacts found
                        </p>
                        <p className={cn('text-xs', isDark ? 'text-white/25' : 'text-black/25')}>
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
                              <p className={cn('text-xs truncate', isDark ? 'text-white/40' : 'text-black/40')}>
                                {contact.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3">
                          <span className={cn('text-sm', isDark ? 'text-white/60' : 'text-black/60')}>
                            {contact.company || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-3">
                          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                            {contact.email}
                          </span>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell px-3">
                          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
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
                          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                            {contact.owner}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                              <div
                                className={cn('h-full rounded-full transition-all', getHealthBarColor(contact.healthScore))}
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
                          <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                            {contact.lastInteraction}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                                  isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
                                )}
                              >
                                <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
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
              isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'
            )}>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
                  )}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
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
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors',
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
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30',
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]'
                  )}
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
