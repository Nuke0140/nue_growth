'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FolderKanban, Wallet, AlertTriangle, TrendingUp, Calendar,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockProjects, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { FilterBar } from '@/modules/erp/components/ops/filter-bar';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import type { ProjectStatus, ProjectHealth, ProjectPriority, ErpProject } from '@/modules/erp/types';

// ── Helpers ──────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'completed' | 'on-hold' | 'critical' | 'inception';

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

const healthColorMap: Record<ProjectHealth, string> = {
  excellent: '#34d399',
  good: '#60a5fa',
  'at-risk': '#fbbf24',
  critical: '#f87171',
};

const priorityDotColor: Record<ProjectPriority, string> = {
  critical: '#f87171',
  high: '#fbbf24',
  medium: '#60a5fa',
  low: 'rgba(245,245,245,0.25)',
};

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/** Build a team member list for a given project from mockResources */
function getProjectTeam(projectId: string): string[] {
  const team: string[] = [];
  mockResources.forEach(r => {
    if (r.projects.some(p => p.projectId === projectId)) {
      team.push(r.name);
    }
  });
  return team;
}

function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// ── Project Card ─────────────────────────────────────────

function ProjectCard({
  project,
  teamMembers,
  onClick,
}: {
  project: ErpProject;
  teamMembers: string[];
  onClick: () => void;
}) {
  const healthColor = healthColorMap[project.health];
  const priorityColor = priorityDotColor[project.priority];
  const daysLeft = getDaysRemaining(project.dueDate);
  const spentPct = project.budget > 0 ? Math.round((project.actualSpend / project.budget) * 100) : 0;
  const maxShow = 4;
  const shown = teamMembers.slice(0, maxShow);
  const overflow = teamMembers.length - maxShow;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 0 28px rgba(204, 92, 55, 0.12)' }}
      transition={{ type: 'tween', duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'ops-card ops-glow ops-card-hover cursor-pointer p-5 flex flex-col gap-4',
        'rounded-2xl'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* Top row: name + priority dot */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: 'var(--ops-text)' }}
          >
            {project.name}
          </h3>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--ops-text-muted)' }}
          >
            {project.client}
          </p>
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
          style={{ backgroundColor: priorityColor }}
          title={project.priority}
        />
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--ops-text-muted)' }}
          >
            Progress
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: healthColor }}
          >
            {project.progress}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: healthColor }}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Team avatars */}
      <div className="flex items-center gap-1.5">
        <Users
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: 'var(--ops-text-muted)' }}
        />
        <div className="flex -space-x-2">
          {shown.map((member, i) => (
            <Avatar key={member} className="w-6 h-6 border-2" style={{ borderColor: 'var(--ops-card-bg)' }}>
              <AvatarFallback
                className="text-[8px] font-semibold"
                style={{
                  backgroundColor: `hsla(${(i * 67 + 20) % 360}, 55%, 45%, 0.7)`,
                  color: '#fff',
                }}
              >
                {getInitials(member)}
              </AvatarFallback>
            </Avatar>
          ))}
          {overflow > 0 && (
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2"
              style={{
                borderColor: 'var(--ops-card-bg)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'var(--ops-text-secondary)',
              }}
            >
              +{overflow}
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: budget mini text + due date + status */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span
          className="text-[10px]"
          style={{ color: 'var(--ops-text-muted)' }}
        >
          {formatINR(project.actualSpend)} / {formatINR(project.budget)}
        </span>
        <StatusBadge status={project.status} className="text-[9px] px-1.5 py-0" />
      </div>

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-1 text-[11px]"
          style={{ color: daysLeft <= 14 && project.status === 'active' ? '#f87171' : 'var(--ops-text-muted)' }}
        >
          <Calendar className="w-3 h-3" />
          {daysLeft > 0
            ? `${daysLeft}d left`
            : project.status === 'completed'
              ? 'Completed'
              : 'Overdue'}
        </div>
        <div className="flex items-center gap-1">
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `${healthColor}18`,
              color: healthColor,
            }}
          >
            {project.health}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Card ────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="ops-card rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--ops-text-muted)' }}
        >
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: accent || 'var(--ops-text-muted)' }}
          />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--ops-text)' }}>
        {value}
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────

export default function ProjectsPage() {
  const selectProject = useErpStore((s) => s.selectProject);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // ── Filtering ──
  const filtered = useMemo(() => {
    let result = [...mockProjects];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.accountManager.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case 'active':
        result = result.filter((p) => p.status === 'active');
        break;
      case 'completed':
        result = result.filter((p) => p.status === 'completed');
        break;
      case 'on-hold':
        result = result.filter((p) => p.status === 'on-hold');
        break;
      case 'critical':
        result = result.filter((p) => p.priority === 'critical');
        break;
      case 'inception':
        result = result.filter((p) => p.status === 'inception');
        break;
    }
    return result;
  }, [searchQuery, activeFilter]);

  // ── Stats ──
  const stats = useMemo(() => {
    const total = mockProjects.length;
    const active = mockProjects.filter((p) => p.status === 'active').length;
    const atRisk = mockProjects.filter(
      (p) => p.health === 'at-risk' || p.health === 'critical'
    ).length;
    const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0);
    return { total, active, atRisk, totalBudget };
  }, []);

  // ── Filters ──
  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All', count: mockProjects.length },
      { key: 'active', label: 'Active', count: mockProjects.filter((p) => p.status === 'active').length },
      { key: 'completed', label: 'Completed', count: mockProjects.filter((p) => p.status === 'completed').length },
      { key: 'on-hold', label: 'On Hold', count: mockProjects.filter((p) => p.status === 'on-hold').length },
      { key: 'critical', label: 'Critical', count: mockProjects.filter((p) => p.priority === 'critical').length },
      { key: 'inception', label: 'Inception', count: mockProjects.filter((p) => p.status === 'inception').length },
    ],
    []
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-5">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--ops-text)' }}>
              Projects
            </h1>
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'var(--ops-text-secondary)',
              }}
            >
              {filtered.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search projects..."
              className="w-full sm:w-64"
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl shrink-0"
              style={{
                backgroundColor: 'var(--ops-accent)',
                color: '#fff',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--ops-accent-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--ops-accent)')
              }
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <FilterBar
          filters={filterItems}
          activeFilter={activeFilter}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
        />

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.3 }}
          >
            <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <StatCard label="Active" value={stats.active} icon={TrendingUp} accent="#34d399" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <StatCard label="At Risk" value={stats.atRisk} icon={AlertTriangle} accent="#f87171" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <StatCard label="Total Budget" value={formatINR(stats.totalBudget)} icon={Wallet} accent="var(--ops-accent)" />
          </motion.div>
        </div>

        {/* ── Project Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchQuery}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <FolderKanban
                    className="w-6 h-6"
                    style={{ color: 'var(--ops-text-muted)' }}
                  />
                </div>
                <p className="text-sm" style={{ color: 'var(--ops-text-muted)' }}>
                  No projects found
                </p>
              </div>
            ) : (
              filtered.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.04,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProjectCard
                    project={project}
                    teamMembers={getProjectTeam(project.id)}
                    onClick={() => selectProject(project.id)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
