'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FolderKanban, Calendar, CheckCircle2, Circle, FileText,
  Users, Target, Clock, Package, TrendingUp, Shield, Wallet, DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockProjects, mockTasks, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import type { ErpProject } from '@/modules/erp/types';

// ── Helpers ──────────────────────────────────────────────

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

const healthColorMap: Record<string, string> = {
  excellent: '#34d399',
  good: '#60a5fa',
  'at-risk': '#fbbf24',
  critical: '#f87171',
};

const priorityColorMap: Record<string, string> = {
  critical: '#f87171',
  high: '#fbbf24',
  medium: '#60a5fa',
  low: 'var(--app-text-muted)',
};

function getProjectTeam(projectId: string) {
  return mockResources.filter((r) => r.projects.some((p) => p.projectId === projectId));
}

function getProjectTasks(projectId: string) {
  return mockTasks.filter((t) => t.projectId === projectId);
}

const stageColorMap: Record<string, string> = {
  backlog: 'var(--app-text-disabled)',
  todo: '#60a5fa',
  'in-progress': '#fbbf24',
  review: '#a78bfa',
  done: '#34d399',
  blocked: '#f87171',
};

// ── Overview Tab ─────────────────────────────────────────

function OverviewTab({ project }: { project: ErpProject }) {
  const completedMilestones = project.milestones.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      {/* Milestones checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
            Milestones
          </h4>
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{
              backgroundColor: 'var(--app-hover-bg)',
              color: 'var(--app-text-secondary)',
            }}
          >
            {completedMilestones}/{project.milestones.length}
          </Badge>
        </div>

        <div className="space-y-0">
          {project.milestones.map((ms, i) => (
            <div key={ms.id} className="flex gap-3 pb-4 relative">
              {i < project.milestones.length - 1 && (
                <div
                  className="absolute left-[11px] top-6 w-px h-full"
                  style={{ backgroundColor: 'var(--app-border)' }}
                />
              )}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
                className="relative z-10"
              >
                {ms.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--app-text-disabled)' }}
                  />
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium"
                  style={{ color: ms.completed ? 'var(--app-text)' : 'var(--app-text-secondary)' }}
                >
                  {ms.title}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  {new Date(ms.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ backgroundColor: 'var(--app-border)' }} />

      {/* Deliverables */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--app-text)' }}>
          Deliverables
        </h4>
        <div className="space-y-2">
          {project.deliverables.map((d, i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl"
              style={{ backgroundColor: 'var(--app-hover-bg)' }}
            >
              <Package className="w-4 h-4 shrink-0" style={{ color: 'var(--app-text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--app-text)' }}>
                {d}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator style={{ backgroundColor: 'var(--app-border)' }} />

      {/* Linked Invoices */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--app-text)' }}>
          Linked Invoices
        </h4>
        {project.linkedInvoices.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
            No invoices linked
          </p>
        ) : (
          <div className="space-y-2">
            {project.linkedInvoices.map((inv) => (
              <div
                key={inv}
                className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--app-hover-bg)' }}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--app-text-muted)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
                  {inv}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tasks Tab ────────────────────────────────────────────

function TasksTab({ projectId }: { projectId: string }) {
  const tasks = getProjectTasks(projectId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
          Project Tasks
        </h4>
        <Badge
          variant="secondary"
          className="text-[10px]"
          style={{
            backgroundColor: 'var(--app-hover-bg)',
            color: 'var(--app-text-secondary)',
          }}
        >
          {tasks.length} tasks
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs text-center py-10" style={{ color: 'var(--app-text-muted)' }}>
          No tasks linked to this project
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                backgroundColor: 'var(--app-hover-bg)',
                border: task.isBlocked ? '1px solid rgba(248,113,113,0.2)' : '1px solid var(--app-border)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: stageColorMap[task.stage] || 'var(--app-text-disabled)' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--app-text)' }}>
                  {task.title}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--app-text-muted)' }}>
                  {task.assignee} · {task.storyPoints} pts
                </p>
              </div>
              {task.isBlocked && (
                <Badge
                  className="text-[9px] px-1.5 py-0 border-0"
                  style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#f87171' }}
                >
                  Blocked
                </Badge>
              )}
              <span
                className="ops-badge text-[9px] capitalize shrink-0"
                style={{
                  backgroundColor: 'var(--app-hover-bg)',
                  color: 'var(--app-text-muted)',
                }}
              >
                {task.stage}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Team Tab ─────────────────────────────────────────────

function TeamTab({ projectId }: { projectId: string }) {
  const team = getProjectTeam(projectId);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
        Team Members
      </h4>
      {team.length === 0 ? (
        <p className="text-xs text-center py-10" style={{ color: 'var(--app-text-muted)' }}>
          No team members assigned
        </p>
      ) : (
        <div className="space-y-2">
          {team.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--app-hover-bg)' }}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className="text-[10px] font-semibold"
                  style={{
                    backgroundColor: `hsla(${(i * 67 + 20) % 360}, 55%, 45%, 0.7)`,
                    color: '#fff',
                  }}
                >
                  {getInitials(resource.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: 'var(--app-text)' }}>
                  {resource.name}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
                  {resource.role}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                  {resource.utilization}% utilized
                </p>
                <p className="text-[10px]" style={{ color: 'var(--app-text-muted)' }}>
                  {resource.allocation}% allocated
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Timeline Tab ─────────────────────────────────────────

function TimelineTab({ project }: { project: ErpProject }) {
  const sortedMilestones = [...project.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
        Project Timeline
      </h4>

      {/* Horizontal Timeline */}
      {sortedMilestones.length > 0 ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex items-start gap-0 min-w-max px-2">
            {/* Connecting line */}
            <div className="absolute mt-[11px] left-0 right-0 h-px mx-8" style={{ backgroundColor: 'var(--app-border)' }} />
            <div className="relative flex items-start w-full min-w-max">
              {sortedMilestones.map((ms, i) => (
                <div key={ms.id} className="flex flex-col items-center" style={{ minWidth: '160px' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                    className="relative z-10"
                  >
                    {ms.completed ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border-2"
                        style={{
                          borderColor: 'var(--app-text-muted)',
                          backgroundColor: 'var(--app-card-bg)',
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Connector line */}
                  {i < sortedMilestones.length - 1 && (
                    <div
                      className="h-0.5 flex-1 min-w-[80px]"
                      style={{
                        backgroundColor: ms.completed ? '#34d399' : 'var(--app-border)',
                        position: 'absolute',
                        top: '10px',
                        left: '14px',
                        width: 'calc(100% - 14px)',
                      }}
                    />
                  )}

                  <div
                    className="mt-2 text-center px-1"
                    style={{ maxWidth: '150px' }}
                  >
                    <p
                      className="text-[11px] font-medium leading-tight"
                      style={{ color: ms.completed ? 'var(--app-text)' : 'var(--app-text-secondary)' }}
                    >
                      {ms.title}
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: 'var(--app-text-muted)' }}>
                      {new Date(ms.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-center py-10" style={{ color: 'var(--app-text-muted)' }}>
          No milestones defined
        </p>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────

function ProjectDetailPageInner() {
  const selectedProjectId = useErpStore((s) => s.selectedProjectId);
  const goBack = useErpStore((s) => s.goBack);
  const [activeTab, setActiveTab] = useState('overview');

  const project = useMemo(
    () => mockProjects.find((p) => p.id === selectedProjectId),
    [selectedProjectId]
  );

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <FolderKanban
            className="w-12 h-12 mx-auto"
            style={{ color: 'var(--app-text-muted)' }}
          />
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            No project selected
          </p>
          <Button
            variant="ghost"
            onClick={goBack}
            style={{ color: 'var(--app-text-secondary)' }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const margin =
    project.budget > 0
      ? Math.round(((project.budget - project.actualSpend) / project.budget) * 100)
      : 0;
  const spentPct =
    project.budget > 0
      ? Math.round((project.actualSpend / project.budget) * 100)
      : 0;
  const daysLeft = getDaysRemaining(project.dueDate);

  const statsCards = [
    {
      label: 'Budget',
      value: formatINR(project.budget),
      icon: Wallet,
      color: 'var(--app-accent)',
    },
    {
      label: 'Actual Spend',
      value: formatINR(project.actualSpend),
      icon: DollarSign,
      color: spentPct > 90 ? '#f87171' : spentPct > 70 ? '#fbbf24' : '#34d399',
    },
    {
      label: 'Progress',
      value: `${project.progress}%`,
      icon: Target,
      color: '#60a5fa',
      bar: project.progress,
    },
    {
      label: 'Profitability',
      value: `${project.profitability > 0 ? '+' : ''}${project.profitability}%`,
      icon: TrendingUp,
      color: project.profitability > 20 ? '#34d399' : project.profitability > 0 ? '#fbbf24' : '#f87171',
    },
    {
      label: 'SLA',
      value: `${project.sla}%`,
      icon: Shield,
      color: project.sla >= 90 ? '#34d399' : project.sla >= 80 ? '#fbbf24' : '#f87171',
    },
    {
      label: 'Days Remaining',
      value: project.status === 'completed' ? 'Done' : `${daysLeft}d`,
      icon: Clock,
      color: daysLeft <= 14 && project.status === 'active' ? '#f87171' : '#60a5fa',
    },
  ];

  return (
    <PageShell title={project.name} icon={FolderKanban} padded={false} headerRight={
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <StatusBadge status={project.status} className="text-[10px] px-2" />
        <span
          className="ops-badge text-[10px] capitalize"
          style={{
            backgroundColor: `${priorityColorMap[project.priority]}18`,
            color: priorityColorMap[project.priority],
          }}
        >
          {project.priority}
        </span>
        <span
          className="ops-badge text-[10px]"
          style={{
            backgroundColor: `${healthColorMap[project.health]}18`,
            color: healthColorMap[project.health],
          }}
        >
          {project.health}
        </span>
      </div>
    }>
      <div className="space-y-5">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
              className="ops-card rounded-xl p-3"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--app-text-muted)' }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-sm font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              {'bar' in stat && (
                <div
                  className="mt-1.5 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--app-hover-bg)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.bar}%` }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="ops-card rounded-2xl p-1.5"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className="bg-transparent w-full justify-start gap-1 p-0 h-auto"
            >
              {[
                { key: 'overview', label: 'Overview', icon: Target },
                { key: 'tasks', label: 'Tasks', icon: ArrowRight },
                { key: 'team', label: 'Team', icon: Users },
                { key: 'timeline', label: 'Timeline', icon: Clock },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap data-[state=active]:shadow-none',
                      isActive
                        ? 'bg-[var(--app-accent-light)] text-[var(--app-accent)]'
                        : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)] hover:bg-[var(--app-hover-bg)]'
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-4 px-2 pb-2">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab project={project} />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0">
                <TasksTab projectId={project.id} />
              </TabsContent>
              <TabsContent value="team" className="mt-0">
                <TeamTab projectId={project.id} />
              </TabsContent>
              <TabsContent value="timeline" className="mt-0">
                <TimelineTab project={project} />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </PageShell>
  );
}

export default memo(ProjectDetailPageInner);
