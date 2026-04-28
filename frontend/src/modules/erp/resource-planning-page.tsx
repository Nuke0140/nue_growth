'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search, Calendar, LayoutGrid, Thermometer, Grid3X3, Users,
  AlertTriangle, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, MoreHorizontal, Flame, UserCheck,
  BarChart3, Briefcase, GitBranch
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockResources } from '@/modules/erp/data/mock-data';

type ViewMode = 'calendar' | 'workload' | 'utilization' | 'availability';

const ITEMS_PER_PAGE = 9;

function getUtilColor(util: number) {
  if (util > 70) return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Optimal' };
  if (util >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Moderate' };
  return { bar: 'bg-red-500', text: 'text-red-400', label: 'Low' };
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const avatarColors = [
  'bg-emerald-500/15 text-emerald-400',
  'bg-sky-500/15 text-sky-400',
  'bg-violet-500/15 text-violet-400',
  'bg-pink-500/15 text-pink-400',
  'bg-amber-500/15 text-amber-400',
  'bg-teal-500/15 text-teal-400',
  'bg-orange-500/15 text-orange-400',
  'bg-rose-500/15 text-rose-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-lime-500/15 text-lime-400',
];

function ResourcePlanningPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ViewMode>('workload');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchQuery) return mockResources;
    const q = searchQuery.toLowerCase();
    return mockResources.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.skills.some(s => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: mockResources.length,
    avgUtil: Math.round(mockResources.reduce((s, r) => s + r.utilization, 0) / mockResources.length),
    overbooked: mockResources.filter(r => r.allocation >= 95).length,
    available: mockResources.filter(r => r.allocation < 70).length,
  }), []);

  const views: { key: ViewMode; label: string; icon: React.ElementType }[] = [
    { key: 'calendar', label: 'Calendar', icon: Calendar },
    { key: 'workload', label: 'Workload Board', icon: LayoutGrid },
    { key: 'utilization', label: 'Utilization Heatmap', icon: Thermometer },
    { key: 'availability', label: 'Availability Matrix', icon: Grid3X3 },
  ];

  return (
    <PageShell title="Resource Planning" icon={GitBranch} headerRight={
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full sm:w-64 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
        <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
        <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className={cn('bg-transparent text-sm focus:outline-none w-full', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')} />
      </div>
    }>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          {views.map((view) => {
            const isActive = activeView === view.key;
            return (
              <button key={view.key} onClick={() => setActiveView(view.key)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200', isActive ? (isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-black/[0.06] text-black shadow-sm') : (isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'))}>
                <view.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Resources', value: stats.total, icon: Users },
            { label: 'Avg Utilization', value: `${stats.avgUtil}%`, icon: BarChart3 },
            { label: 'Overbooked', value: stats.overbooked, icon: AlertTriangle, warn: stats.overbooked > 0 },
            { label: 'Available', value: stats.available, icon: UserCheck },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.warn ? (isDark ? 'bg-red-500/15' : 'bg-red-50') : (isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'))}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.warn ? 'text-red-400' : (isDark ? 'text-white/40' : 'text-black/40'))} />
                </div>
              </div>
              <p className={cn('text-xl font-bold', stat.warn && 'text-red-400')}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Workload Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((resource, idx) => {
            const utilColor = getUtilColor(resource.utilization);
            const isOverbooked = resource.allocation >= 95;
            const isIdle = resource.allocation < 70;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'rounded-2xl border p-4 space-y-3 transition-colors duration-200',
                  isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-gray-50',
                  isOverbooked && (isDark ? 'border-red-500/30' : 'border-red-200')
                )}
              >
                {/* Resource Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0', avatarColors[idx % avatarColors.length])}>
                      {getInitials(resource.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{resource.name}</h3>
                        {isOverbooked && (
                          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          </motion.div>
                        )}
                        {isIdle && (
                          <Badge className={cn('text-[9px] px-1.5 py-0 bg-sky-500/15 text-sky-300 border-sky-500/20 border')}>
                            Available
                          </Badge>
                        )}
                      </div>
                      <p className={cn('text-[11px]', isDark ? 'text-white/40' : 'text-black/40')}>{resource.role}</p>
                      <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>{resource.department}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                        <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Allocation</DropdownMenuItem>
                      <DropdownMenuItem>Assign Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Utilization Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Utilization</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-bold', utilColor.text)}>{resource.utilization}%</span>
                      <span className={cn('text-[10px] font-medium', utilColor.text)}>{utilColor.label}</span>
                    </div>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.utilization}%` }}
                      transition={{ delay: 0.2 + idx * 0.05, duration: 0.5 }}
                      className={cn('h-full rounded-full', utilColor.bar)}
                    />
                  </div>
                </div>

                {/* Allocation */}
                <div className="flex items-center justify-between">
                  <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Allocation</span>
                  <span className={cn('text-xs font-medium', resource.allocation >= 95 ? 'text-red-400' : (isDark ? 'text-white/60' : 'text-black/60'))}>
                    {resource.allocation}% · {resource.availability} free
                  </span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.skills.map(skill => (
                    <span key={skill} className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium', isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.04] text-black/50')}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Active Projects */}
                {resource.projects.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    <span className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Active Projects</span>
                    {resource.projects.map(proj => (
                      <div key={proj.projectId} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Briefcase className={cn('w-3 h-3 shrink-0', isDark ? 'text-white/25' : 'text-black/25')} />
                          <span className="text-[11px] truncate">{proj.projectName}</span>
                        </div>
                        <span className={cn('text-[10px] font-medium shrink-0 ml-2', isDark ? 'text-white/40' : 'text-black/40')}>{proj.allocation}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className={cn('rounded-2xl border py-16 flex flex-col items-center justify-center', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-3', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]')}>
              <Users className={cn('w-6 h-6', isDark ? 'text-white/15' : 'text-black/15')} />
            </div>
            <p className={cn('text-sm font-medium', isDark ? 'text-white/40' : 'text-black/40')}>No resources found</p>
            <p className={cn('text-xs', isDark ? 'text-white/25' : 'text-black/25')}>Try adjusting your search</p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
            <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}><ChevronsRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
    </PageShell>
  );
}

export default memo(ResourcePlanningPageInner);
