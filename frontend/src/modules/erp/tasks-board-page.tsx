'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, GitBranch, Clock, AlertTriangle, CheckCircle2,
  X, Paperclip, CheckSquare, Square,
  Columns3,
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
import { PageShell } from './components/ops/page-shell';
import { mockTasks, mockProjects, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { KanbanBoard, type KanbanColumn, type KanbanTask, type KanbanLabel } from '@/modules/erp/components/ops/kanban-board';
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

// ── Mock Subtask Data ────────────────────────────────────

interface MockSubtask {
  id: string;
  title: string;
  completed: boolean;
}

const MOCK_SUBTASKS: Record<string, MockSubtask[]> = {
  t1: [
    { id: 'st1', title: 'Research banking UI patterns', completed: true },
    { id: 'st2', title: 'Create low-fidelity wireframes', completed: true },
    { id: 'st3', title: 'Design high-fidelity screens', completed: true },
    { id: 'st4', title: 'Client review & feedback', completed: true },
  ],
  t2: [
    { id: 'st5', title: 'Stripe API integration', completed: true },
    { id: 'st6', title: 'Razorpay API integration', completed: true },
    { id: 'st7', title: 'Payment error handling', completed: false },
    { id: 'st8', title: 'Checkout flow testing', completed: false },
  ],
  t3: [
    { id: 'st9', title: 'Review HIPAA requirements doc', completed: true },
    { id: 'st10', title: 'Audit data storage compliance', completed: true },
    { id: 'st11', title: 'Generate compliance report', completed: false },
  ],
  t4: [
    { id: 'st12', title: 'WebSocket server setup', completed: true },
    { id: 'st13', title: 'GPS data parsing', completed: true },
  ],
  t5: [
    { id: 'st14', title: 'Risk scoring model design', completed: true },
    { id: 'st15', title: 'ML model training pipeline', completed: false },
    { id: 'st16', title: 'Backtesting framework', completed: false },
    { id: 'st17', title: 'API integration', completed: false },
  ],
  t7: [
    { id: 'st18', title: 'Rate limit middleware setup', completed: true },
    { id: 'st19', title: 'Token bucket algorithm', completed: true },
    { id: 'st20', title: 'Distributed rate limiting', completed: false },
  ],
  t8: [
    { id: 'st21', title: 'Vendor API mapping', completed: false },
    { id: 'st22', title: 'Sync service architecture', completed: false },
    { id: 'st23', title: 'Conflict resolution logic', completed: false },
  ],
  t9: [
    { id: 'st24', title: 'WebRTC signaling server', completed: true },
    { id: 'st25', title: 'Video call UI components', completed: true },
    { id: 'st26', title: 'Recording & screen share', completed: true },
  ],
  t10: [
    { id: 'st27', title: 'SEBI guidelines review', completed: true },
    { id: 'st28', title: 'Documentation preparation', completed: false },
  ],
  t11: [
    { id: 'st29', title: 'Kafka topic configuration', completed: true },
    { id: 'st30', title: 'Data serialization format', completed: true },
    { id: 'st31', title: 'Monitoring & alerting', completed: true },
  ],
  t12: [
    { id: 'st32', title: 'Hardware SDK integration', completed: false },
    { id: 'st33', title: 'Barcode parsing library', completed: false },
  ],
};

// ── Mock Attachments Data ────────────────────────────────

const MOCK_ATTACHMENTS: Record<string, number> = {
  t1: 3,
  t2: 5,
  t3: 2,
  t4: 1,
  t5: 4,
  t7: 2,
  t10: 3,
  t11: 2,
};

// ── Label Configuration ─────────────────────────────────

const LABEL_CONFIG: Record<string, { bg: string; color: string }> = {
  frontend: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
  backend: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  api: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
  design: { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' },
  urgent: { bg: 'var(--app-danger-bg)', color: '#f87171' },
  bug: { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' },
  devops: { bg: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' },
  security: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
  ml: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
  qa: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
  reporting: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' },
  hardware: { bg: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af' },
};

const MOCK_LABELS: Record<string, string[]> = {
  t1: ['design', 'frontend'],
  t2: ['backend', 'api'],
  t3: ['security', 'qa'],
  t4: ['backend', 'devops'],
  t5: ['backend', 'ml', 'urgent'],
  t6: ['backend', 'reporting'],
  t7: ['backend', 'devops'],
  t8: ['backend', 'api'],
  t9: ['frontend', 'backend'],
  t10: ['urgent', 'security'],
  t11: ['backend', 'devops'],
  t12: ['frontend', 'hardware'],
};

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

/** Collect all unique labels used across tasks */
function getAllLabels(taskIds: string[]): string[] {
  const labelSet = new Set<string>();
  taskIds.forEach((id) => {
    const labels = MOCK_LABELS[id];
    if (labels) labels.forEach((l) => labelSet.add(l));
  });
  return Array.from(labelSet).sort();
}

/** Map ErpTask to enriched KanbanTask */
function mapToKanbanTask(task: typeof mockTasks[0]): KanbanTask {
  const taskLabels = MOCK_LABELS[task.id] || [];
  const labels: KanbanLabel[] = taskLabels.map((name) => {
    const config = LABEL_CONFIG[name] || { bg: 'var(--app-hover-bg)', color: 'var(--app-text-muted)' };
    return { name, ...config };
  });

  const subtaskData = MOCK_SUBTASKS[task.id];
  const attachmentCount = MOCK_ATTACHMENTS[task.id] || 0;

  return {
    id: task.id,
    title: task.title,
    subtitle: task.assignee,
    avatar: undefined,
    priority: task.isBlocked ? 'critical' : undefined,
    dueDate: formatDueDate(task.dueDate),
    tags: [],
    projectName: getProjectShortName(task.projectId),
    labels: labels.length > 0 ? labels : undefined,
    subtasks: subtaskData
      ? { total: subtaskData.length, completed: subtaskData.filter((s) => s.completed).length }
      : undefined,
    attachments: attachmentCount > 0 ? attachmentCount : undefined,
    storyPoints: task.storyPoints > 0 ? task.storyPoints : undefined,
    isBlocked: task.isBlocked || undefined,
    assigneeInitials: getInitials(task.assignee),
    assigneeColor: `hsla(${task.assignee.charCodeAt(0) * 3 % 360}, 50%, 40%, 0.7)`,
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
    <div className="app-card rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--app-hover-bg)' }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent || 'var(--app-text-muted)' }} />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>
        {value}
      </p>
    </div>
  );
}

// ── Label Filter Bar ─────────────────────────────────────

function LabelFilterBar({
  labels,
  activeLabel,
  onLabelChange,
}: {
  labels: string[];
  activeLabel: string | null;
  onLabelChange: (label: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <motion.button
        onClick={() => onLabelChange(null)}
        className={cn(
          'relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors'
        )}
        style={{
          backgroundColor: activeLabel === null
            ? 'var(--app-accent)'
            : 'transparent',
          color: activeLabel === null
            ? '#ffffff'
            : 'var(--app-text-secondary)',
        }}
        whileTap={{ scale: 0.97 }}
      >
        All Labels
      </motion.button>
      {labels.map((label) => {
        const config = LABEL_CONFIG[label] || { bg: 'var(--app-hover-bg)', color: 'var(--app-text-muted)' };
        const isActive = activeLabel === label;
        return (
          <motion.button
            key={label}
            onClick={() => onLabelChange(isActive ? null : label)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all'
            )}
            style={{
              backgroundColor: isActive
                ? config.color
                : `${config.bg}`,
              color: isActive
                ? '#fff'
                : config.color,
              border: `1px solid ${isActive ? config.color : 'transparent'}`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Task Detail Drawer ──────────────────────────────────

function TaskDetailDrawer({
  taskId,
  open,
  onOpenChange,
  subtasks,
  onSubtaskToggle,
}: {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtasks: MockSubtask[];
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}) {
  const task = mockTasks.find((t) => t.id === taskId);
  if (!task) return null;

  const completedCount = subtasks.filter((s) => s.completed).length;
  const projectName = getProjectShortName(task.projectId);
  const attachmentCount = MOCK_ATTACHMENTS[task.id] || 0;
  const taskLabels = (MOCK_LABELS[task.id] || []).map((name) => {
    const config = LABEL_CONFIG[name] || { bg: 'var(--app-hover-bg)', color: 'var(--app-text-muted)' };
    return { name, ...config };
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-h-[85vh]"
        style={{
          backgroundColor: 'var(--app-card-bg)',
          borderColor: 'var(--app-border)',
        }}
      >
        <DrawerHeader className="border-b" style={{ borderColor: 'var(--app-border)' }}>
          <div className="flex items-center justify-between">
            <DrawerTitle
              className="text-base font-semibold"
              style={{ color: 'var(--app-text)' }}
            >
              Task Details
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription style={{ color: 'var(--app-text-muted)' }}>
            {task.title}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="app-card rounded-xl p-3 space-y-1"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Project
              </span>
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                {projectName}
              </p>
            </div>
            <div className="app-card rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Assignee
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback
                    className="text-[7px] font-semibold"
                    style={{
                      backgroundColor: `hsla(${task.assignee.charCodeAt(0) * 3 % 360}, 50%, 40%, 0.7)`,
                      color: '#fff',
                    }}
                  >
                    {getInitials(task.assignee)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                  {task.assignee}
                </p>
              </div>
            </div>
            <div className="app-card rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Due Date
              </span>
              <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                {formatDueDate(task.dueDate)}
              </p>
            </div>
            <div className="app-card rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Story Points
              </span>
              <p className="text-sm font-semibold" style={{ color: 'var(--app-accent)' }}>
                {task.storyPoints} SP
              </p>
            </div>
          </div>

          {/* Labels */}
          {taskLabels.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Labels
              </span>
              <div className="flex flex-wrap gap-1.5">
                {taskLabels.map((label) => (
                  <span
                    key={label.name}
                    className="app-badge text-xs px-2 py-0.5"
                    style={{
                      backgroundColor: label.bg,
                      color: label.color,
                      border: `1px solid ${label.color}25`,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Blocked indicator */}
          {task.isBlocked && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span className="text-sm font-medium text-red-500 dark:text-red-400">This task is blocked</span>
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                Description
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-secondary)' }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Attachments */}
          {attachmentCount > 0 && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                backgroundColor: 'var(--app-hover-bg)',
                border: '1px solid var(--app-border)',
              }}
            >
              <Paperclip className="w-4 h-4" style={{ color: 'var(--app-text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                {attachmentCount} attachment{attachmentCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--app-text-muted)' }}>
                  Subtasks
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: completedCount === subtasks.length ? '#34d399' : 'var(--app-text-secondary)',
                  }}
                >
                  {completedCount}/{subtasks.length}
                </span>
              </div>

              {/* Subtask progress bar */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--app-hover-bg)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: completedCount === subtasks.length ? '#34d399' : 'var(--app-accent)',
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Subtask list with checkboxes */}
              <div className="space-y-1.5">
                <AnimatePresence>
                  {subtasks.map((subtask) => (
                    <motion.button
                      key={subtask.id}
                      onClick={() => onSubtaskToggle(task.id, subtask.id)}
                      className={cn(
                        'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors',
                      )}
                      style={{
                        backgroundColor: subtask.completed ? 'rgba(52,211,153,0.05)' : 'var(--app-hover-bg)',
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {subtask.completed ? (
                        <CheckSquare className="w-4 h-4 shrink-0" style={{ color: '#34d399' }} />
                      ) : (
                        <Square className="w-4 h-4 shrink-0" style={{ color: 'var(--app-text-muted)' }} />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                        )}
                        style={{
                          color: subtask.completed ? 'var(--app-text-muted)' : 'var(--app-text)',
                          textDecoration: subtask.completed ? 'line-through' : 'none',
                        }}
                      >
                        {subtask.title}
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter
          className="border-t pt-4"
          style={{ borderColor: 'var(--app-border)' }}
        >
          <Button
            className="w-full rounded-xl"
            style={{
              backgroundColor: 'var(--app-accent)',
              color: '#fff',
            }}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
    handleReset();
    onOpenChange(false);
  }, [handleReset, onOpenChange]);

  const drawerInputStyle: React.CSSProperties = {
    backgroundColor: 'var(--app-elevated)',
    border: '1px solid var(--app-border)',
    color: 'var(--app-text)',
    borderRadius: '0.75rem',
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-h-[85vh]"
        style={{
          backgroundColor: 'var(--app-card-bg)',
          borderColor: 'var(--app-border)',
        }}
      >
        <DrawerHeader className="border-b" style={{ borderColor: 'var(--app-border)' }}>
          <div className="flex items-center justify-between">
            <DrawerTitle
              className="text-base font-semibold"
              style={{ color: 'var(--app-text)' }}
            >
              Add New Task
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                style={{ color: 'var(--app-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription style={{ color: 'var(--app-text-muted)' }}>
            Create a new task and assign it to a project.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Title
            </Label>
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={drawerInputStyle}
              className="focus:ring-[var(--app-accent)]/30 focus:border-[var(--app-accent)]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Description
            </Label>
            <textarea
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="app-input w-full px-3 py-2 text-sm resize-none"
              style={drawerInputStyle}
            />
          </div>

          {/* Project */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Project
            </Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full" style={drawerInputStyle}>
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                {mockProjects
                  .filter((p) => p.status === 'active' || p.status === 'inception')
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id} style={{ color: 'var(--app-text)' }}>
                      {p.name.split(' ').slice(0, 2).join(' ')}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Assignee
            </Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="w-full" style={drawerInputStyle}>
                <SelectValue placeholder="Select assignee..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                {mockResources.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback
                          className="text-[8px] font-semibold"
                          style={{
                            backgroundColor: 'var(--app-active-bg)',
                            color: 'var(--app-accent)',
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
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Stage
              </Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-full" style={drawerInputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--app-card-bg)',
                    borderColor: 'var(--app-border)',
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
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full" style={drawerInputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--app-card-bg)',
                    borderColor: 'var(--app-border)',
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
            <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Due Date
            </Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={drawerInputStyle}
              className="focus:ring-[var(--app-accent)]/30 focus:border-[var(--app-accent)]"
            />
          </div>
        </div>

        <DrawerFooter className="border-t pt-4" style={{ borderColor: 'var(--app-border)' }}>
          <div className="flex gap-2 w-full">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl"
              style={{
                color: 'var(--app-text-secondary)',
                backgroundColor: 'var(--app-hover-bg)',
              }}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl"
              style={{
                backgroundColor: 'var(--app-accent)',
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

function TasksBoardPageInner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState(mockTasks);
  const [localSubtasks, setLocalSubtasks] = useState<Record<string, MockSubtask[]>>(MOCK_SUBTASKS);

  // ── Subtask toggle handler ──
  const handleSubtaskToggle = useCallback((taskId: string, subtaskId: string) => {
    setLocalSubtasks((prev) => {
      const taskSubtasks = prev[taskId];
      if (!taskSubtasks) return prev;
      return {
        ...prev,
        [taskId]: taskSubtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        ),
      };
    });
  }, []);

  // ── Task click handler ──
  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setDetailOpen(true);
  }, []);

  // ── Filtered tasks ──
  const filteredTasks = useMemo(() => {
    let result = [...localTasks];

    // Project filter
    if (projectFilter !== 'all') {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    // Label filter
    if (activeLabel !== null) {
      result = result.filter((t) => {
        const labels = MOCK_LABELS[t.id];
        return labels && labels.includes(activeLabel);
      });
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
  }, [localTasks, projectFilter, activeLabel, searchQuery]);

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

  // ── All available labels ──
  const allLabels = useMemo(() => getAllLabels(mockTasks.map((t) => t.id)), []);

  // ── Detail drawer subtasks ──
  const detailSubtasks = selectedTaskId ? (localSubtasks[selectedTaskId] || []) : [];

  return (
    <PageShell title="Task Board" icon={Columns3} subtitle="Kanban view" padded={false} headerRight={
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
            backgroundColor: 'var(--app-accent)',
            color: '#fff',
          }}
          onClick={() => setDrawerOpen(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--app-accent-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--app-accent)')
          }
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>
    }>
      <div className="space-y-4">

        {/* ── Project Filter ── */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--app-text-muted)' }}>
            Filter by project:
          </span>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger
              className="w-auto min-w-[180px]"
              size="sm"
              style={{
                backgroundColor: 'var(--app-elevated)',
                border: '1px solid var(--app-border)',
                color: 'var(--app-text)',
                borderRadius: '0.75rem',
              }}
            >
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--app-border)',
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

        {/* ── Label Filter Bar ── */}
        <div className="space-y-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--app-text-muted)' }}
          >
            Filter by label
          </span>
          <LabelFilterBar
            labels={allLabels}
            activeLabel={activeLabel}
            onLabelChange={setActiveLabel}
          />
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
          onTaskClick={handleTaskClick}
          className="h-full"
        />
      </div>

      {/* ── Add Task Drawer ── */}
      <AddTaskDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      {/* ── Task Detail Drawer ── */}
      {selectedTaskId && (
        <TaskDetailDrawer
          taskId={selectedTaskId}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          subtasks={detailSubtasks}
          onSubtaskToggle={handleSubtaskToggle}
        />
      )}
    </PageShell>
  );
}

export default memo(TasksBoardPageInner);
