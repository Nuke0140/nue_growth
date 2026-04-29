'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, GripVertical, Paperclip, CheckSquare } from 'lucide-react';
import { ANIMATION } from '../../design-tokens';

// ── Types ──────────────────────────────────────────────

export interface KanbanLabel {
  name: string;
  color: string;
  bg: string;
}

export interface KanbanSubtaskProgress {
  total: number;
  completed: number;
}

export interface KanbanTask {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags?: string[];
  /** Project short name shown on the card */
  projectName?: string;
  /** Colored label pills */
  labels?: KanbanLabel[];
  /** Subtask progress indicator */
  subtasks?: KanbanSubtaskProgress;
  /** Number of attachments */
  attachments?: number;
  /** Story points */
  storyPoints?: number;
  /** Whether the task is blocked */
  isBlocked?: boolean;
  /** Assignee initials for avatar */
  assigneeInitials?: string;
  /** Assignee avatar background color */
  assigneeColor?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanTask[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveTask?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onTaskClick?: (taskId: string) => void;
  className?: string;
}

// ── Priority colors ────────────────────────────────────

const priorityColors: Record<string, string> = {
  low: '#34d399',
  medium: '#fbbf24',
  high: '#cc5c37',
  critical: '#f87171',
};

// ── Sortable Task Card ─────────────────────────────────

const TaskCard = React.memo(function TaskCard({
  task,
  overlay = false,
  onTaskClick,
}: {
  task: KanbanTask;
  overlay?: boolean;
  onTaskClick?: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.4 : 1,
  };

  const priorityColor = task.priority ? priorityColors[task.priority] : undefined;
  const hasSubtasks = task.subtasks && task.subtasks.total > 0;
  const subtaskPct = hasSubtasks && task.subtasks
    ? Math.round((task.subtasks.completed / task.subtasks.total) * 100)
    : 0;
  const hasLabels = task.labels && task.labels.length > 0;

  const handleClick = () => {
    if (onTaskClick && !overlay) onTaskClick(task.id);
  };

  return (
    <motion.div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={cn(
        'ops-card p-3 cursor-grab active:cursor-grabbing',
        overlay && 'ops-drag-ghost rotate-1 scale-[1.03]',
        onTaskClick && !overlay && 'cursor-grab hover:ring-1 hover:ring-[var(--ops-accent)]/20',
      )}
      {...(!overlay ? { ...attributes, ...listeners } : {})}
      onClick={handleClick}
      role="listitem"
      aria-label={task.title}
    >
      {/* Project name */}
      {task.projectName && (
        <p
          className="text-[10px] font-medium uppercase tracking-wider truncate mb-1"
          style={{ color: 'var(--ops-text-muted)' }}
        >
          {task.projectName}
        </p>
      )}

      {/* Title row with priority */}
      <div className="flex items-start gap-2">
        {!overlay && (
          <GripVertical
            className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-30 transition-opacity"
            style={{ color: 'var(--ops-text-muted)' }}
          />
        )}
        <p
          className="text-sm font-medium leading-snug flex-1 min-w-0"
          style={{ color: 'var(--ops-text)' }}
        >
          {task.title}
        </p>
        {priorityColor && (
          <span
            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
            style={{ backgroundColor: priorityColor }}
            title={task.priority}
          />
        )}
      </div>

      {/* Labels row */}
      {hasLabels && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels!.map((label) => (
            <span
              key={label.name}
              className="ops-badge text-[10px] px-1.5 py-0 leading-none"
              style={{
                backgroundColor: label.bg,
                color: label.color,
                border: `1px solid ${label.color}20`,
              }}
            >
              {label.name}
            </span>
          ))}
          {task.isBlocked && (
            <span
              className="ops-badge text-[10px] px-1.5 py-0 leading-none font-semibold"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              BLOCKED
            </span>
          )}
        </div>
      )}

      {/* Subtask progress bar */}
      {hasSubtasks && (
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3 h-3" style={{ color: 'var(--ops-text-muted)' }} />
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--ops-text-muted)' }}
            >
              {task.subtasks!.completed}/{task.subtasks!.total} subtasks
            </span>
            <span
              className="text-[10px] font-semibold ml-auto"
              style={{ color: subtaskPct === 100 ? '#34d399' : 'var(--ops-text-secondary)' }}
            >
              {subtaskPct}%
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--ops-border)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: subtaskPct === 100 ? '#34d399' : 'var(--ops-accent)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${subtaskPct}%` }}
              transition={{ duration: ANIMATION.durationVerySlow, ease: ANIMATION.easeDefault }}
            />
          </div>
        </div>
      )}

      {/* Bottom row: assignee, story points, attachments, due date */}
      <div className="flex items-center justify-between mt-2.5 pt-2" style={{ borderTop: '1px solid var(--ops-border)' }}>
        {/* Left side: assignee + story points */}
        <div className="flex items-center gap-2">
          {task.assigneeInitials ? (
            <Avatar className="w-5 h-5">
              <AvatarFallback
                className="text-[8px] font-semibold"
                style={{
                  backgroundColor: task.assigneeColor || 'rgba(204,92,55,0.2)',
                  color: task.assigneeColor ? '#fff' : '#cc5c37',
                }}
              >
                {task.assigneeInitials}
              </AvatarFallback>
            </Avatar>
          ) : task.avatar ? (
            <Avatar className="w-5 h-5">
              <AvatarImage src={task.avatar} alt="" />
              <AvatarFallback className="text-[8px]">?</AvatarFallback>
            </Avatar>
          ) : (
            <span className="w-5" />
          )}

          {task.storyPoints !== undefined && task.storyPoints > 0 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0 rounded"
              style={{
                backgroundColor: 'var(--ops-accent-light)',
                color: 'var(--ops-accent)',
              }}
            >
              {task.storyPoints} SP
            </span>
          )}

          {task.attachments !== undefined && task.attachments > 0 && (
            <div className="flex items-center gap-0.5" style={{ color: 'var(--ops-text-muted)' }}>
              <Paperclip className="w-3 h-3" />
              <span className="text-[10px]">{task.attachments}</span>
            </div>
          )}
        </div>

        {/* Right side: due date */}
        {task.dueDate && (
          <div
            className="flex items-center gap-1 text-[10px]"
            style={{ color: 'var(--ops-text-muted)' }}
          >
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </div>
        )}
      </div>

      {/* Tags row (legacy — rendered only if no labels) */}
      {!hasLabels && task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="ops-badge text-[10px]"
              style={{
                backgroundColor: 'var(--ops-hover-bg)',
                color: 'var(--ops-text-muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
});

// ── Sortable Column ────────────────────────────────────

const SortableColumn = React.memo(function SortableColumn({
  column,
  onMoveTask,
  onTaskClick,
}: {
  column: KanbanColumn;
  onMoveTask?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onTaskClick?: (taskId: string) => void;
}) {
  const { setNodeRef, transform, transition, isOver } = useSortable({
    id: column.id,
    data: { type: 'column' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col min-w-[300px] w-[300px] shrink-0 rounded-xl p-2 transition-colors snap-start',
        isOver && 'bg-[var(--ops-accent-light)]'
      )}
      role="region"
      aria-label={`${column.title} column, ${column.items.length} tasks`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--ops-text)' }}
          >
            {column.title}
          </span>
          <span
            className="ops-badge text-[10px]"
            style={{
              backgroundColor: 'var(--ops-hover-bg)',
              color: 'var(--ops-text-muted)',
            }}
          >
            {column.items.length}
          </span>
        </div>
      </div>

      {/* Task list */}
      <SortableContext
        items={column.items.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar" role="list">
          {column.items.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
          {column.items.length === 0 && (
            <div
              className="flex items-center justify-center h-24 rounded-lg border border-dashed"
              style={{
                borderColor: 'var(--ops-border)',
                color: 'var(--ops-text-muted)',
              }}
            >
              <p className="text-xs">No tasks</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
});

// ── Kanban Board ───────────────────────────────────────

export const KanbanBoard = memo(function KanbanBoard({
  columns,
  onMoveTask,
  onTaskClick,
  className,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task as KanbanTask);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    if (activeData?.type !== 'task') return;

    const taskId = active.id as string;

    // Find source column
    const fromColumn = columns.find((c) =>
      c.items.some((t) => t.id === taskId)
    );
    if (!fromColumn) return;

    // Determine target column
    const targetColumn = columns.find((c) => c.id === over.id);
    const taskInTargetColumn = targetColumn?.items.some(
      (t) => t.id === over.id
    );
    const toColumnId = targetColumn && taskInTargetColumn
      ? targetColumn.id
      : fromColumn.id;

    if (fromColumn.id !== toColumnId && onMoveTask) {
      onMoveTask(taskId, fromColumn.id, toColumnId);
    }
  }, [columns, onMoveTask]);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Visual feedback handled by isOver in SortableColumn
  }, []);

  const columnIds = columns.map((c) => c.id);

  return (
    <div
      className={cn('flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory', className)}
      style={{ backgroundColor: 'var(--ops-bg-dark)' }}
      role="region"
      aria-label="Kanban board"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {columns.map((column) => (
          <SortableColumn
            key={column.id}
            column={column}
            onMoveTask={onMoveTask}
            onTaskClick={onTaskClick}
          />
        ))}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
});
