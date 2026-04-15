'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Plus, Building2, Users, Target, DollarSign, FolderKanban, MoreHorizontal, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockEmployees, mockProjects } from '@/modules/erp/data/mock-data';

interface Department {
  name: string;
  hod: string;
  teamCount: number;
  kpiScore: number;
  budget: number;
  activeProjects: number;
  color: string;
  bgColor: string;
}

function useDepartments() {
  return useMemo(() => {
    const deptMap: Record<string, Department> = {};
    const deptColors: Record<string, { color: string; bgColor: string }> = {
      'Engineering': { color: 'bg-emerald-500', bgColor: 'bg-emerald-500/15' },
      'Design': { color: 'bg-pink-500', bgColor: 'bg-pink-500/15' },
      'QA': { color: 'bg-amber-500', bgColor: 'bg-amber-500/15' },
      'Operations': { color: 'bg-teal-500', bgColor: 'bg-teal-500/15' },
      'HR': { color: 'bg-purple-500', bgColor: 'bg-purple-500/15' },
      'Sales': { color: 'bg-orange-500', bgColor: 'bg-orange-500/15' },
      'Finance': { color: 'bg-cyan-500', bgColor: 'bg-cyan-500/15' },
    };

    const deptNames = ['Engineering', 'Design', 'QA', 'Operations', 'HR', 'Sales', 'Finance'];
    const deptHods: Record<string, string> = {
      'Engineering': 'Nikhil Das',
      'Design': 'Arjun Mehta',
      'QA': 'Sneha Reddy',
      'Operations': 'Meera Patel',
      'HR': 'Ritika Gupta',
      'Sales': 'Saurabh Jain',
      'Finance': 'Anita Kulkarni',
    };

    deptNames.forEach(name => {
      const emps = mockEmployees.filter(e => e.department === name);
      const projs = mockProjects.filter(p => p.status === 'active');
      deptMap[name] = {
        name,
        hod: deptHods[name],
        teamCount: emps.length,
        kpiScore: Math.round(emps.reduce((s, e) => s + e.productivityScore, 0) / (emps.length || 1)),
        budget: [3200000, 1800000, 950000, 1200000, 800000, 2400000, 1100000][deptNames.indexOf(name)],
        activeProjects: projs.filter(p => {
          const am = deptNames.indexOf(name);
          return am >= 0;
        }).length,
        color: deptColors[name]?.color || 'bg-zinc-500',
        bgColor: deptColors[name]?.bgColor || 'bg-zinc-500/15',
      };
    });

    // Assign more accurate active projects per department
    const deptProjectCounts: Record<string, number> = {
      'Engineering': 6, 'Design': 2, 'QA': 2, 'Operations': 3, 'HR': 0, 'Sales': 0, 'Finance': 0,
    };
    Object.keys(deptMap).forEach(name => {
      deptMap[name].activeProjects = deptProjectCounts[name] || 0;
    });

    return Object.values(deptMap);
  }, []);
}

function getKpiColor(score: number) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

function getKpiBarColor(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function DepartmentsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const departments = useDepartments();

  const stats = useMemo(() => ({
    total: departments.length,
    headcount: departments.reduce((s, d) => s + d.teamCount, 0),
    avgKpi: Math.round(departments.reduce((s, d) => s + d.kpiScore, 0) / (departments.length || 1)),
    monthlyBudget: departments.reduce((s, d) => s + d.budget, 0),
  }), [departments]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">Departments</h1>
            <Badge variant="secondary" className={cn(
              'text-xs font-medium',
              isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.06] text-black/50'
            )}>
              {departments.length}
            </Badge>
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
              <TooltipContent><p>Add Department</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Departments', value: stats.total, icon: Building2 },
            { label: 'Total Headcount', value: stats.headcount, icon: Users },
            { label: 'Avg KPI Score', value: `${stats.avgKpi}%`, icon: Target },
            { label: 'Monthly Budget', value: formatCurrency(stats.monthlyBudget), icon: DollarSign },
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
                <span className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                  <stat.icon className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 group',
                isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:shadow-lg'
              )}
            >
              {/* Color Top Bar */}
              <div className={cn('h-1', dept.color)} />

              <div className="p-5">
                {/* Department Name + Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold">{dept.name}</h3>
                    <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                      Head: {dept.hod}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}
                      >
                        <MoreHorizontal className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Department</DropdownMenuItem>
                      <DropdownMenuItem>View Team</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Team Count + Projects */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg', dept.bgColor)}>
                    <Users className={cn('w-3.5 h-3.5', dept.color.replace('bg-', 'text-').replace('500', '400'))} />
                    <span className={cn('text-xs font-semibold', dept.color.replace('bg-', 'text-').replace('500', '400'))}>{dept.teamCount}</span>
                  </div>
                  <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                    <FolderKanban className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
                    <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>{dept.activeProjects} projects</span>
                  </div>
                </div>

                {/* KPI Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>KPI Score</span>
                    <span className={cn('text-sm font-bold', getKpiColor(dept.kpiScore))}>{dept.kpiScore}%</span>
                  </div>
                  <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.kpiScore}%` }}
                      transition={{ delay: idx * 0.06 + 0.2, duration: 0.6 }}
                      className={cn('h-full rounded-full', getKpiBarColor(dept.kpiScore))}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                  <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Monthly Budget</span>
                  <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
                    {formatCurrency(dept.budget)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
