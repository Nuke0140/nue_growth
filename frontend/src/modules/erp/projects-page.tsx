'use client';

import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, Wallet, AlertTriangle, TrendingUp, Calendar,
  Users, Shield, Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProjects, formatINR } from '@/modules/erp/hooks/use-erp-api';
import type { ProjectListItem } from '@/modules/erp/hooks/use-erp-api';
import { useErpStore } from '@/modules/erp/erp-store';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { FilterBar } from '@/modules/erp/components/ops/filter-bar';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import type { ProjectStatus, ProjectHealth, ProjectPriority } from '@/modules/erp/types';
import { PageShell } from './components/ops/page-shell';

// ── Helpers ──────────────────────────────────────────────

type FilterKey = 'all' | 'active' | 'completed' | 'on-hold' | 'critical' | 'inception';
type HealthFilterKey = 'all' | 'excellent' | 'good' | 'at-risk' | 'critical';

const healthColorMap: Record<ProjectHealth, string> = {
  excellent: '#34d399',
  good: '#60a5fa',
  'at-risk': '#fbbf24',
  critical: '#f87171',
};

const healthLabelMap: Record<ProjectHealth, string> = {
  excellent: 'On Track',
  good: 'Good',
  'at-risk': 'At Risk',
  critical: 'Critical',
};

const priorityDotColor: Record<ProjectPriority, string> = {
  critical: '#f87171',
  high: '#fbbf24',
  medium: '#60a5fa',
  low: 'var(--app-text-disabled)',
};

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Cast API string fields to the union types used by the UI */
function asProjectHealth(h: string): ProjectHealth {
  if (h === 'excellent' || h === 'good' || h === 'at-risk' || h === 'critical') return h;
  return 'good';
}
function asProjectPriority(p: string): ProjectPriority {
  if (p === 'low' || p === 'medium' || p === 'high' || p === 'critical') return p;
  return 'medium';
}
function asProjectStatus(s: string): ProjectStatus {
  if (s === 'active' || s === 'on-hold' || s === 'completed' || s === 'cancelled' || s === 'inception') return s;
  return 'active';
}

// ── Health Indicator Pill ──────────────────────────────

function HealthPill({ health }: { health: ProjectHealth }) {
  const color = healthColorMap[health];
  const label = healthLabelMap[health];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}25`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </motion.span>
  );
}

// ── Budget Bar ─────────────────────────────────────────

function BudgetBar({ actualSpend, budget }: { actualSpend: number; budget: number }) {
  const spentPct = budget > 0 ? (actualSpend / budget) * 100 : 0;
  const overBudget = spentPct > 100;
  const greenWidth = Math.min(spentPct, 100);
  const isWarning = spentPct > 80 && spentPct <= 100;

  return (
    <div className="space-y-1.5">
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--app-hover-bg)' }}
      >
        {/* Green (or amber warning) fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            backgroundColor: overBudget ? '#34d399' : isWarning ? '#fbbf24' : '#34d399',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${greenWidth}%` }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Red overflow */}
        {overBudget && (
          <motion.div
            className="absolute inset-y-0 rounded-r-full"
            style={{
              left: `${greenWidth}%`,
              backgroundColor: '#f87171',
              width: `${Math.min(spentPct - 100, 40)}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-[10px]"
          style={{
            color: overBudget ? '#f87171' : isWarning ? '#fbbf24' : 'var(--app-text-muted)',
          }}
        >
          {formatINR(actualSpend)} / {formatINR(budget)}
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{
            color: overBudget ? '#f87171' : isWarning ? '#fbbf24' : 'var(--app-text-secondary)',
          }}
        >
          {Math.round(spentPct)}%
        </span>
      </div>
    </div>
  );
}

// ── Project Card ─────────────────────────────────────────

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectListItem;
  onClick: () => void;
}) {
  const health = asProjectHealth(project.health);
  const priority = asProjectPriority(project.priority);
  const status = asProjectStatus(project.status);
  const healthColor = healthColorMap[health];
  const priorityColor = priorityDotColor[priority];
  const daysLeft = getDaysRemaining(project.dueDate);

  // Build a minimal team display from the account manager
  const teamMembers = [project.accountManager];
  const maxShow = 3;
  const shown = teamMembers.slice(0, maxShow);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 0 28px rgba(204, 92, 55, 0.12)' }}
      transition={{ type: 'tween', duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'ops-card ops-glow ops-card-hover cursor-pointer p-5 flex flex-col gap-3.5',
        'rounded-2xl relative'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* Top row: name + health pill */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: 'var(--app-text)' }}
          >
            {project.name}
          </h3>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {project.client}
          </p>
        </div>
        <HealthPill health={health} />
      </div>

      {/* Budget bar */}
      <BudgetBar actualSpend={project.actualSpend} budget={project.budget} />

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--app-text-muted)' }}
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
          style={{ backgroundColor: 'var(--app-hover-bg)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: healthColor }}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Team avatars + SLA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: 'var(--app-text-muted)' }}
          />
          <div className="flex -space-x-2">
            {shown.map((member, i) => (
              <Avatar key={member} className="w-6 h-6 border-2" style={{ borderColor: 'var(--app-card-bg)' }}>
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
          </div>
        </div>

        {/* SLA badge */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: project.sla >= 90
              ? 'rgba(52,211,153,0.1)'
              : project.sla >= 80
                ? 'rgba(251,191,36,0.1)'
                : 'rgba(248,113,113,0.1)',
            color: project.sla >= 90
              ? '#34d399'
              : project.sla >= 80
                ? '#fbbf24'
                : '#f87171',
            border: `1px solid ${
              project.sla >= 90
                ? 'rgba(52,211,153,0.2)'
                : project.sla >= 80
                  ? 'rgba(251,191,36,0.2)'
                  : 'rgba(248,113,113,0.2)'
            }`,
          }}
        >
          <Shield className="w-3 h-3" />
          SLA: {project.sla}%
        </div>
      </div>

      {/* Account manager */}
      <div className="flex items-center gap-2">
        <Avatar className="w-5 h-5">
          <AvatarFallback
            className="text-[7px] font-semibold"
            style={{
              backgroundColor: 'rgba(204,92,55,0.15)',
              color: 'var(--app-accent)',
            }}
          >
            {getInitials(project.accountManager)}
          </AvatarFallback>
        </Avatar>
        <span
          className="text-[11px]"
          style={{ color: 'var(--app-text-muted)' }}
        >
          {project.accountManager}
        </span>
      </div>

      {/* Bottom row: due date + status + priority */}
      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--app-border)' }}>
        <div
          className="flex items-center gap-1 text-[11px]"
          style={{ color: daysLeft <= 14 && status === 'active' ? '#f87171' : 'var(--app-text-muted)' }}
        >
          <Calendar className="w-3 h-3" />
          {daysLeft > 0
            ? `${daysLeft}d left`
            : status === 'completed'
              ? 'Completed'
              : 'Overdue'}
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={status} className="text-[9px] px-1.5 py-0" />
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: priorityColor }}
            title={project.priority}
          />
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
          style={{ color: 'var(--app-text-muted)' }}
        >
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--app-hover-bg)' }}
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{ color: accent || 'var(--app-text-muted)' }}
          />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>
        {value}
      </p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────

function ProjectsPageInner() {
  const selectProject = useErpStore((s) => s.selectProject);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeHealthFilter, setActiveHealthFilter] = useState<HealthFilterKey>('all');

  // ── API data ──
  const { data, loading, error, refetch } = useProjects();
  const projects = data?.projects ?? [];

  // ── Filtering ──
  const filtered = useMemo(() => {
    let result = [...projects];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.accountManager.toLowerCase().includes(q)
      );
    }

    // Status filter
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

    // Health filter
    if (activeHealthFilter !== 'all') {
      result = result.filter((p) => p.health === activeHealthFilter);
    }

    return result;
  }, [projects, searchQuery, activeFilter, activeHealthFilter]);

  // ── Stats ──
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === 'active').length;
    const atRisk = projects.filter(
      (p) => p.health === 'at-risk' || p.health === 'critical'
    ).length;
    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    return { total, active, atRisk, totalBudget };
  }, [projects]);

  // ── Status Filters ──
  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All', count: projects.length },
      { key: 'active', label: 'Active', count: projects.filter((p) => p.status === 'active').length },
      { key: 'completed', label: 'Completed', count: projects.filter((p) => p.status === 'completed').length },
      { key: 'on-hold', label: 'On Hold', count: projects.filter((p) => p.status === 'on-hold').length },
      { key: 'critical', label: 'Critical', count: projects.filter((p) => p.priority === 'critical').length },
      { key: 'inception', label: 'Inception', count: projects.filter((p) => p.status === 'inception').length },
    ],
    [projects]
  );

  // ── Health Filters ──
  const healthFilterItems = useMemo(
    () => [
      { key: 'all', label: 'All Health', count: projects.length },
      { key: 'excellent', label: 'On Track', count: projects.filter((p) => p.health === 'excellent').length },
      { key: 'good', label: 'Good', count: projects.filter((p) => p.health === 'good').length },
      { key: 'at-risk', label: 'At Risk', count: projects.filter((p) => p.health === 'at-risk').length },
      { key: 'critical', label: 'Critical', count: projects.filter((p) => p.health === 'critical').length },
    ],
    [projects]
  );

  // ── Loading State ──
  if (loading) {
    return (
      <PageShell title="Projects" icon={FolderKanban} createType="project">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Loading projects...
          </p>
        </div>
      </PageShell>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <PageShell title="Projects" icon={FolderKanban} createType="project">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(248,113,113,0.1)' }}
          >
            <AlertTriangle className="w-6 h-6" style={{ color: '#f87171' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Failed to load projects
          </p>
          <p className="text-xs" style={{ color: 'var(--app-text-disabled)' }}>
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Projects" icon={FolderKanban} createType="project">
      <div className="space-y-5">
        {/* ── Search (moved from header) ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-sm">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search projects..."
            />
          </div>
        </div>

        {/* ── Status Filter Bar ── */}
        <FilterBar
          filters={filterItems}
          activeFilter={activeFilter}
          onFilterChange={(key) => setActiveFilter(key as FilterKey)}
        />

        {/* ── Health Filter Bar ── */}
        <div className="space-y-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--app-text-muted)' }}
          >
            Health
          </span>
          <FilterBar
            filters={healthFilterItems}
            activeFilter={activeHealthFilter}
            onFilterChange={(key) => setActiveHealthFilter(key as HealthFilterKey)}
          />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <StatCard label="Active" value={stats.active} icon={TrendingUp} accent="#34d399" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <StatCard label="At Risk" value={stats.atRisk} icon={AlertTriangle} accent="#f87171" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <StatCard label="Total Budget" value={formatINR(stats.totalBudget)} icon={Wallet} accent="var(--app-accent)" />
          </motion.div>
        </div>

        {/* ── Project Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + activeHealthFilter + searchQuery}
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
                  style={{ backgroundColor: 'var(--app-hover-bg)' }}
                >
                  <FolderKanban
                    className="w-6 h-6"
                    style={{ color: 'var(--app-text-muted)' }}
                  />
                </div>
                <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                  No projects found
                </p>
              </div>
            ) : (
              filtered.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.04,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => selectProject(project.id)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

export default memo(ProjectsPageInner);
