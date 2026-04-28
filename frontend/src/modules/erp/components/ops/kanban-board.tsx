'use client';

import React, { useState } from 'react';
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
import { Calendar, GripVertical } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export interface KanbanTask {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  tags?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanTask[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveTask?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
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

function TaskCard({ task, overlay = false }: { task: KanbanTask; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.4 : 1,
  };

  const priorityColor = task.priority ? priorityColors[task.priority] : undefined;

  return (
    <motion.div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={cn(
        'ops-card p-3 cursor-grab active:cursor-grabbing',
        overlay && 'shadow-2xl rotate-2 scale-[1.02]'
      )}
      {...(!overlay ? { ...attributes, ...listeners } : {})}
    >
      {/* Title row */}
      <div className="flex items-start gap-2">
        {!overlay && (
          <GripVertical
            className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-30 transition-opacity"
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
          />
        )}
      </div>

      {/* Subtitle / assignee */}
      {task.subtitle && (
        <p
          className="text-xs mt-1.5 truncate"
          style={{ color: 'var(--ops-text-muted)' }}
        >
          {task.subtitle}
        </p>
      )}

      {/* Bottom row: avatar + due date */}
      <div className="flex items-center justify-between mt-3">
        {task.avatar ? (
          <Avatar className="w-6 h-6">
            <AvatarImage src={task.avatar} alt="" />
            <AvatarFallback className="text-[10px]">?</AvatarFallback>
          </Avatar>
        ) : (
          <span />
        )}
        {task.dueDate && (
          <div
            className="flex items-center gap-1 text-[11px]"
            style={{ color: 'var(--ops-text-muted)' }}
          >
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </div>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="ops-badge text-[10px]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
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
}

// ── Sortable Column ────────────────────────────────────

function SortableColumn({
  column,
  onMoveTask,
}: {
  column: KanbanColumn;
  onMoveTask?: (taskId: string, fromColumnId: string, toColumnId: string) => void;
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
        'flex flex-col min-w-[280px] w-[280px] shrink-0 rounded-xl p-2 transition-colors',
        isOver && 'bg-[rgba(204,92,55,0.04)]'
      )}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-2 py-2 mb-2"
      >
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
              backgroundColor: 'rgba(255,255,255,0.06)',
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
        <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {column.items.map((task) => (
            <TaskCard key={task.id} task={task} />
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
}

// ── Kanban Board ───────────────────────────────────────

export function KanbanBoard({
  columns,
  onMoveTask,
  className,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task as KanbanTask);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Visual feedback handled by isOver in SortableColumn
  };

  const columnIds = columns.map((c) => c.id);

  return (
    <div
      className={cn('flex gap-4 overflow-x-auto pb-4', className)}
      style={{ backgroundColor: 'var(--ops-bg-dark)' }}
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
          />
        ))}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
