'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, GitBranch, Clock, AlertTriangle, CheckCircle2,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { mockTasks, mockProjects, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { KanbanBoard, type KanbanColumn, type KanbanTask } from '@/modules/erp/components/ops/kanban-board';
import type { TaskStage } from '@/modules/erp/types';

// ── Column definitions ───────────────────────────────────

const COLUMN_DEFS: { key: TaskStage; title: string }[] = [
  { key: 'backlog', title: 'Backlog' },
  { key: 'todo', title: 'To Do' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'review', title: 'Review' },
  { key: 'blocked', title: 'Blocked' },
  { key: 'done', title: 'Done' },
];

// ── Helpers ──────────────────────────────────────────────

function getProjectShortName(projectId: string): string {
  const p = mockProjects.find((pr) => pr.id === projectId);
  return p ? p.name.split(' ').slice(0, 2).join(' ') : '';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

/** Map ErpTask to KanbanTask for the KanbanBoard component */
function mapToKanbanTask(task: typeof mockTasks[0]): KanbanTask {
  const tags: string[] = [];
  if (task.storyPoints > 0) tags.push(`${task.storyPoints} pts`);
  if (task.isBlocked) tags.push('🚫 Blocked');

  return {
    id: task.id,
    title: task.title,
    subtitle: task.assignee,
    avatar: undefined,
    priority: task.isBlocked ? 'critical' : undefined,
    dueDate: formatDueDate(task.dueDate),
    tags,
  };
}

// ── Stat Card ────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="ops-card rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--ops-text-muted)' }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent || 'var(--ops-text-muted)' }} />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--ops-text)' }}>
        {value}
      </p>
    </div>
  );
}

// ── Add Task Drawer ──────────────────────────────────────

function AddTaskDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignee, setAssignee] = useState('');
  const [stage, setStage] = useState<string>('todo');
  const [priority, setPriority] = useState<string>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleReset = useCallback(() => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setAssignee('');
    setStage('todo');
    setPriority('medium');
    setDueDate('');
  }, []);

  const handleSubmit = useCallback(() => {
    // In a real app, this would call an API to create the task
    handleReset();
    onOpenChange(false);
  }, [handleReset, onOpenChange]);

  const drawerInputStyle: React.CSSProperties = {
    backgroundColor: '#2a2b2e',
    border: '1px solid var(--ops-border)',
    color: 'var(--ops-text)',
    borderRadius: '0.75rem',
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-h-[85vh]"
        style={{
          backgroundColor: 'var(--ops-card-bg)',
          borderColor: 'var(--ops-border)',
        }}
      >
        <DrawerHeader className="border-b" style={{ borderColor: 'var(--ops-border)' }}>
          <div className="flex items-center justify-between">
            <DrawerTitle
              className="text-base font-semibold"
              style={{ color: 'var(--ops-text)' }}
            >
              Add New Task
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                style={{ color: 'var(--ops-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription style={{ color: 'var(--ops-text-muted)' }}>
            Create a new task and assign it to a project.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
              Title
            </Label>
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={drawerInputStyle}
              className="focus:ring-[#cc5c37]/30 focus:border-[#cc5c37]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
              Description
            </Label>
            <textarea
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="ops-input w-full px-3 py-2 text-sm resize-none"
              style={drawerInputStyle}
            />
          </div>

          {/* Project */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
              Project
            </Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger
                className="w-full"
                style={drawerInputStyle}
              >
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: 'var(--ops-card-bg)',
                  borderColor: 'var(--ops-border)',
                }}
              >
                {mockProjects
                  .filter((p) => p.status === 'active' || p.status === 'inception')
                  .map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      style={{ color: 'var(--ops-text)' }}
                    >
                      {p.name.split(' ').slice(0, 2).join(' ')}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
              Assignee
            </Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger
                className="w-full"
                style={drawerInputStyle}
              >
                <SelectValue placeholder="Select assignee..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: 'var(--ops-card-bg)',
                  borderColor: 'var(--ops-border)',
                }}
              >
                {mockResources.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback
                          className="text-[8px] font-semibold"
                          style={{
                            backgroundColor: 'rgba(204,92,55,0.2)',
                            color: '#cc5c37',
                          }}
                        >
                          {getInitials(r.name)}
                        </AvatarFallback>
                      </Avatar>
                      {r.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stage + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Stage
              </Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger
                  className="w-full"
                  style={drawerInputStyle}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--ops-card-bg)',
                    borderColor: 'var(--ops-border)',
                  }}
                >
                  {COLUMN_DEFS.map((col) => (
                    <SelectItem key={col.key} value={col.key}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger
                  className="w-full"
                  style={drawerInputStyle}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--ops-card-bg)',
                    borderColor: 'var(--ops-border)',
                  }}
                >
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
              Due Date
            </Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={drawerInputStyle}
              className="focus:ring-[#cc5c37]/30 focus:border-[#cc5c37]"
            />
          </div>
        </div>

        <DrawerFooter
          className="border-t pt-4"
          style={{ borderColor: 'var(--ops-border)' }}
        >
          <div className="flex gap-2 w-full">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl"
              style={{
                color: 'var(--ops-text-secondary)',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl"
              style={{
                backgroundColor: 'var(--ops-accent)',
                color: '#fff',
              }}
              onClick={handleSubmit}
            >
              Create Task
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ── Main Page ────────────────────────────────────────────

export default function TasksBoardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState(mockTasks);

  // ── Filtered tasks ──
  const filteredTasks = useMemo(() => {
    let result = [...localTasks];

    // Project filter
    if (projectFilter !== 'all') {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q) ||
          getProjectShortName(t.projectId).toLowerCase().includes(q)
      );
    }

    return result;
  }, [localTasks, projectFilter, searchQuery]);

  // ── Build Kanban columns ──
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return COLUMN_DEFS.map((col) => ({
      id: col.key,
      title: col.title,
      items: filteredTasks
        .filter((t) => t.stage === col.key)
        .map(mapToKanbanTask),
    }));
  }, [filteredTasks]);

  // ── Drag handler ──
  const handleMoveTask = useCallback(
    (taskId: string, _fromColumnId: string, toColumnId: string) => {
      setLocalTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return { ...t, stage: toColumnId as TaskStage };
          }
          return t;
        })
      );
    },
    []
  );

  // ── Stats ──
  const stats = useMemo(
    () => ({
      total: filteredTasks.length,
      inProgress: filteredTasks.filter((t) => t.stage === 'in-progress').length,
      blocked: filteredTasks.filter((t) => t.stage === 'blocked' || t.isBlocked).length,
      completed: filteredTasks.filter((t) => t.stage === 'done').length,
    }),
    [filteredTasks]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 space-y-4 shrink-0">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: 'var(--ops-text)' }}
            >
              Tasks Board
            </h1>
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'var(--ops-text-secondary)',
              }}
            >
              {filteredTasks.length} tasks
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks..."
              className="w-full sm:w-52"
            />
            <Button
              className="h-9 px-3 rounded-xl gap-1.5 text-xs font-medium"
              style={{
                backgroundColor: 'var(--ops-accent)',
                color: '#fff',
              }}
              onClick={() => setDrawerOpen(true)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--ops-accent-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--ops-accent)')
              }
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>

        {/* ── Project Filter ── */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--ops-text-muted)' }}>
            Filter by project:
          </span>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger
              className="w-auto min-w-[180px]"
              size="sm"
              style={{
                backgroundColor: '#2a2b2e',
                border: '1px solid var(--ops-border)',
                color: 'var(--ops-text)',
                borderRadius: '0.75rem',
              }}
            >
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: 'var(--ops-card-bg)',
                borderColor: 'var(--ops-border)',
              }}
            >
              <SelectItem value="all">All Projects</SelectItem>
              {mockProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.3 }}
          >
            <StatCard label="Total Tasks" value={stats.total} icon={GitBranch} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="#fbbf24" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <StatCard label="Blocked" value={stats.blocked} icon={AlertTriangle} accent="#f87171" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} accent="#34d399" />
          </motion.div>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex-1 overflow-hidden px-4 md:px-6 pb-4">
        <KanbanBoard
          columns={kanbanColumns}
          onMoveTask={handleMoveTask}
          className="h-full"
        />
      </div>

      {/* ── Add Task Drawer ── */}
      <AddTaskDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
