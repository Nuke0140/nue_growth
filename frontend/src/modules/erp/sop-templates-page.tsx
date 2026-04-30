'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Plus, Sparkles, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  FileText, BookOpen, CheckCircle2, Clock, Archive, Hash, User, Calendar,
  MoreHorizontal, Layers, FileCode
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockSops } from '@/modules/erp/data/mock-data';
import type { SopStatus } from '@/modules/erp/types';

type FilterKey = 'all' | 'published' | 'draft' | 'archived';

const ITEMS_PER_PAGE = 6;

function getStatusConfig(status: SopStatus, isDark: boolean) {
  switch (status) {
    case 'published': return 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30';
    case 'draft': return 'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]';
    case 'archived': return isDark ? 'bg-red-500/15 text-red-300 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200';
  }
}

function getStatusLabel(status: SopStatus) {
  const map: Record<SopStatus, string> = { published: 'Published', draft: 'Draft', archived: 'Archived' };
  return map[status];
}

function getStatusIcon(status: SopStatus) {
  switch (status) {
    case 'published': return CheckCircle2;
    case 'draft': return Clock;
    case 'archived': return Archive;
  }
}

function getDeptBadgeColor(dept: string, isDark: boolean) {
  const colors: Record<string, string> = {
    'Operations': isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-200',
    'Engineering': 'bg-[var(--app-success-bg)] text-[var(--app-success)] border-[var(--app-success)]/30',
    'HR': isDark ? 'bg-pink-500/15 text-pink-300 border-pink-500/20' : 'bg-pink-50 text-pink-700 border-pink-200',
    'Finance': 'bg-[var(--app-warning-bg)] text-[var(--app-warning)] border-[var(--app-warning)]/30',
    'Procurement': isDark ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return colors[dept] || ('bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] border-[var(--app-border)]');
}

function SopTemplatesPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const departments = useMemo(() => [...new Set(mockSops.map(s => s.department))], []);

  const filtered = useMemo(() => {
    let result = [...mockSops];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== 'all') result = result.filter(s => s.status === activeFilter);
    if (deptFilter) result = result.filter(s => s.department === deptFilter);
    return result;
  }, [searchQuery, activeFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: mockSops.length,
    published: mockSops.filter(s => s.status === 'published').length,
    draft: mockSops.filter(s => s.status === 'draft').length,
    depts: departments.length,
  }), [departments]);

  const filters: { key: FilterKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'all', label: 'All', icon: Layers, count: stats.total },
    { key: 'published', label: 'Published', icon: CheckCircle2, count: stats.published },
    { key: 'draft', label: 'Draft', icon: Clock, count: stats.draft },
    { key: 'archived', label: 'Archived', icon: Archive, count: mockSops.filter(s => s.status === 'archived').length },
  ];

  return (
    <PageShell title="SOP Templates" icon={FileCode} headerRight={
      <div className="flex items-center gap-2">
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border w-full sm:w-64 transition-colors', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
          <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
          <input type="text" placeholder="Search SOPs..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', 'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]')} />
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn('h-10  px-4 rounded-[var(--app-radius-lg)] flex items-center gap-2 text-xs font-medium shrink-0', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}>
                <Plus className="w-4 h-4" /> Create SOP
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Create new SOP template</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    }>

        {/* Department Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('text-xs font-medium mr-1', 'text-[var(--app-text-muted)]')}>Department:</span>
          <button onClick={() => { setDeptFilter(null); setCurrentPage(1); }} className={cn('px-2.5 py-1 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors border', !deptFilter ? (isDark ? 'bg-white/[0.08] text-white border-white/[0.12]' : 'bg-black/[0.06] text-black border-black/[0.12]') : (isDark ? 'text-white/40 border-white/[0.06] hover:text-white/70' : 'text-black/40 border-black/[0.06] hover:text-black/70'))}>
            All
          </button>
          {departments.map(dept => (
            <button key={dept} onClick={() => { setDeptFilter(dept); setCurrentPage(1); }} className={cn('px-2.5 py-1 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors border', deptFilter === dept ? (isDark ? 'bg-white/[0.08] text-white border-white/[0.12]' : 'bg-black/[0.06] text-black border-black/[0.12]') : (isDark ? 'text-white/40 border-white/[0.06] hover:text-white/70' : 'text-black/40 border-black/[0.06] hover:text-black/70'))}>
              {dept}
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit" style={{ background: 'var(--app-hover-bg)' }}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button key={filter.key} onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors duration-200', isActive ? ('bg-[var(--app-hover-bg)] text-[var(--app-text)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]') : ('text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'))}>
                <filter.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', isActive ? ('bg-[var(--app-hover-bg)]') : ('bg-[var(--app-hover-bg)]'))}>{filter.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total SOPs', value: stats.total, icon: BookOpen },
            { label: 'Published', value: stats.published, icon: CheckCircle2 },
            { label: 'Draft', value: stats.draft, icon: Clock },
            { label: 'Departments', value: stats.depts, icon: Layers },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>{stat.label}</span>
                <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}><stat.icon className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* SOP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((sop, idx) => {
            const StatusIcon = getStatusIcon(sop.status);
            return (
              <motion.div key={sop.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-3 transition-colors', isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-gray-50')}>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold leading-tight">{sop.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn('inline-flex px-2 py-0.5 rounded text-[10px] font-medium border', getDeptBadgeColor(sop.department, isDark))}>{sop.department}</span>
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border', getStatusConfig(sop.status, isDark))}>
                        <StatusIcon className="w-4 h-4" />
                        {getStatusLabel(sop.status)}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', 'hover:bg-[var(--app-hover-bg)]')}><MoreHorizontal className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View SOP</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--app-overlay)' }}>
                  <div className="flex items-center gap-1"><Hash className="w-4 h-4" />{sop.steps.length} steps</div>
                  <div className="flex items-center gap-1"><FileText className="w-4 h-4" />v{sop.version}</div>
                  <div className="flex items-center gap-1"><User className="w-4 h-4" />{sop.author}</div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(sop.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                </div>

                {/* Steps Preview */}
                <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--app-hover-bg)' }}>
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', 'text-[var(--app-text-muted)]')}>First Steps</span>
                  {sop.steps.slice(0, 3).map((step, si) => (
                    <div key={step.id} className="flex items-start gap-2">
                      <span className={cn('w-5 h-5 rounded-[var(--app-radius-md)] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5', isDark ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40')}>{si + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{step.title}</p>
                        <p className={cn('text-[10px] truncate', 'text-[var(--app-text-muted)]')}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                  {sop.steps.length > 3 && (
                    <p className={cn('text-[10px] pl-7', 'text-[var(--app-text-muted)]')}>+{sop.steps.length - 3} more steps...</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className={cn('rounded-[var(--app-radius-xl)] border py-16 flex flex-col items-center justify-center', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <div className={cn('w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center mb-3', 'bg-[var(--app-hover-bg)]')}><BookOpen className={cn('w-6 h-6', 'text-[var(--app-text-disabled)]')} /></div>
            <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>No SOPs found</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className={cn('flex items-center justify-between px-4 py-3 rounded-[var(--app-radius-xl)] border', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors disabled:opacity-30', 'hover:bg-[var(--app-hover-bg)]')}><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* AI SOP Generator FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          onClick={() => setShowAiGenerator(!showAiGenerator)}
          className={cn(
            'fixed bottom-6 right-6 w-14 h-14 rounded-[var(--app-radius-xl)] flex items-center justify-center shadow-[var(--app-shadow-md)]-lg z-50 transition-colors',
            isDark ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
          )}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>

        {showAiGenerator && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cn('fixed bottom-24 right-6 w-80 rounded-[var(--app-radius-xl)] border p-4 z-50 shadow-[var(--app-shadow-md)]-xl space-y-3', isDark ? 'bg-zinc-900 border-purple-500/30' : 'bg-white border-purple-200')}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold">AI SOP Generator</h3>
            </div>
            <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>Describe a process and AI will generate a draft SOP with steps.</p>
            <textarea placeholder="e.g., Client offboarding process..." className={cn('w-full h-24 px-3 py-2 rounded-[var(--app-radius-lg)] border text-sm bg-transparent focus:outline-none focus:ring-1 resize-none', isDark ? 'border-white/[0.06] focus:ring-purple-500/50 text-white placeholder:text-white/25' : 'border-black/[0.06] focus:ring-purple-500/50 text-black placeholder:text-black/25')} />
            <button className={cn('w-full py-2 rounded-[var(--app-radius-lg)] text-xs font-medium', isDark ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-purple-600 text-white hover:bg-purple-500')}>
              Generate SOP
            </button>
          </motion.div>
        )}
    </PageShell>
  );
}

export default memo(SopTemplatesPageInner);
