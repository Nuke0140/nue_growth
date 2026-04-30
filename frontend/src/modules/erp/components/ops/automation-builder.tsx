'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Plus,
  X,
  Clock,
  Zap,
  GitBranch,
  MousePointerClick,
  RefreshCw,
  Send,
  UserPlus,
  ListPlus,
  AlertTriangle,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  Workflow,
} from 'lucide-react';
import type { Workflow, WorkflowStep, WorkflowStepType, WorkflowStepCategory } from '../../types';

interface AutomationBuilderProps {
  workflows: Workflow[];
  onSave: (workflow: Workflow) => void;
}

// Node type definitions
const triggerTypes: { type: WorkflowStepType; label: string; icon: typeof Clock }[] = [
  { type: 'trigger-schedule', label: 'Schedule', icon: Clock },
  { type: 'trigger-event', label: 'Event', icon: Zap },
  { type: 'trigger-condition', label: 'Condition', icon: GitBranch },
  { type: 'trigger-manual', label: 'Manual', icon: MousePointerClick },
];

const actionTypes: { type: WorkflowStepType; label: string; icon: typeof RefreshCw }[] = [
  { type: 'action-update-status', label: 'Update Status', icon: RefreshCw },
  { type: 'action-send-notification', label: 'Send Notification', icon: Send },
  { type: 'action-assign', label: 'Assign', icon: UserPlus },
  { type: 'action-create-task', label: 'Create Task', icon: ListPlus },
  { type: 'action-escalate', label: 'Escalate', icon: AlertTriangle },
];

const categoryColors: Record<WorkflowStepCategory, { bg: string; border: string; iconColor: string }> = {
  trigger: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', iconColor: 'text-purple-400' },
  condition: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', iconColor: 'text-blue-400' },
  action: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
};

function getIconForType(type: WorkflowStepType): typeof Clock {
  const trigger = triggerTypes.find((t) => t.type === type);
  if (trigger) return trigger.icon;
  const action = actionTypes.find((a) => a.type === type);
  if (action) return action.icon;
  return Zap;
}

function getLabelForType(type: WorkflowStepType): string {
  const trigger = triggerTypes.find((t) => t.type === type);
  if (trigger) return trigger.label;
  const action = actionTypes.find((a) => a.type === type);
  if (action) return action.label;
  return type;
}

function getStepCategory(type: WorkflowStepType): WorkflowStepCategory {
  if (type.startsWith('trigger')) return 'trigger';
  if (type.startsWith('action')) return 'action';
  return 'condition';
}

// Default mock workflows
const defaultWorkflows: Workflow[] = [
  {
    id: 'wf1',
    name: 'Auto-escalate blocked tasks',
    description: 'Tasks blocked for >48h get escalated to project lead',
    active: true,
    steps: [
      { id: 's1', type: 'trigger-schedule', category: 'trigger', label: 'Every 48 hours' },
      { id: 's2', type: 'trigger-condition', category: 'condition', label: 'Task is blocked >48h' },
      { id: 's3', type: 'action-escalate', category: 'action', label: 'Escalate to lead' },
    ],
    createdAt: '2026-03-15',
  },
  {
    id: 'wf2',
    name: 'New project onboarding',
    description: 'Auto-create tasks when a new project is created',
    active: true,
    steps: [
      { id: 's4', type: 'trigger-event', category: 'trigger', label: 'Project created' },
      { id: 's5', type: 'action-create-task', category: 'action', label: 'Create kickoff task' },
      { id: 's6', type: 'action-assign', category: 'action', label: 'Assign to PM' },
      { id: 's7', type: 'action-send-notification', category: 'action', label: 'Notify team' },
    ],
    createdAt: '2026-03-20',
  },
  {
    id: 'wf3',
    name: 'SLA breach alert',
    description: 'Notify when project SLA drops below threshold',
    active: false,
    steps: [
      { id: 's8', type: 'trigger-condition', category: 'condition', label: 'SLA < 85%' },
      { id: 's9', type: 'action-send-notification', category: 'action', label: 'Alert PM & client' },
      { id: 's10', type: 'action-escalate', category: 'action', label: 'Escalate to ops head' },
    ],
    createdAt: '2026-04-01',
  },
];

export function AutomationBuilder({ workflows, onSave }: AutomationBuilderProps) {
  const [localWorkflows, setLocalWorkflows] = useState<Workflow[]>(
    workflows.length > 0 ? workflows : defaultWorkflows
  );
  const [selectedId, setSelectedId] = useState<string | null>(localWorkflows[0]?.id || null);
  const [showAddMenu, setShowAddMenu] = useState<{ stepId: string; index: number } | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const selectedWorkflow = localWorkflows.find((w) => w.id === selectedId);

  const toggleWorkflow = useCallback((id: string) => {
    setLocalWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  }, []);

  const addStep = useCallback((afterIndex: number, type: WorkflowStepType) => {
    if (!selectedId) return;
    const category = getStepCategory(type);
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      category,
      label: getLabelForType(type),
    };
    setLocalWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== selectedId) return w;
        const steps = [...w.steps];
        steps.splice(afterIndex + 1, 0, newStep);
        return { ...w, steps };
      })
    );
    setShowAddMenu(null);
  }, [selectedId]);

  const deleteStep = useCallback((stepId: string) => {
    if (!selectedId) return;
    setLocalWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== selectedId) return w;
        return { ...w, steps: w.steps.filter((s) => s.id !== stepId) };
      })
    );
  }, [selectedId]);

  const handleSave = useCallback(() => {
    const wf = localWorkflows.find((w) => w.id === selectedId);
    if (wf) onSave(wf);
  }, [localWorkflows, selectedId, onSave]);

  return (
    <div className="flex h-full gap-0 -m-6">
      {/* Left panel: Workflow list */}
      <div
        className="w-[260px] shrink-0 border-r border-[var(--app-border)] flex flex-col"
        style={{ backgroundColor: 'var(--app-hover-bg)' }}
      >
        <div className="px-4 py-3 border-b border-[var(--app-border)]">
          <h3 className="text-sm font-semibold text-[var(--app-text)] flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[var(--app-accent)]" />
            Workflows
          </h3>
          <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5">
            {localWorkflows.length} automation{localWorkflows.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {localWorkflows.map((wf) => (
            <motion.button
              key={wf.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedId(wf.id)}
              className={cn(
                'w-full text-left px-4 py-3 transition-colors group',
                wf.id === selectedId
                  ? 'bg-[var(--app-accent-light)] border-l-2 border-[var(--app-accent)]'
                  : 'border-l-2 border-transparent hover:bg-[var(--app-hover-bg)]'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    'text-[13px] font-medium truncate',
                    wf.id === selectedId ? 'text-[var(--app-text)]' : 'text-[var(--app-text-secondary)]'
                  )}>
                    {wf.name}
                  </p>
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5 truncate">
                    {wf.steps.length} steps
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWorkflow(wf.id);
                  }}
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0',
                    wf.active
                      ? 'text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)]'
                  )}
                >
                  {wf.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main canvas: Visual editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedWorkflow ? (
          <>
            {/* Workflow header */}
            <div className="px-6 py-4 border-b border-[var(--app-border)] shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[var(--app-text)]">
                    {selectedWorkflow.name}
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    {selectedWorkflow.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2.5 py-1 rounded-lg',
                      selectedWorkflow.active
                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                        : 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]'
                    )}
                  >
                    {selectedWorkflow.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={handleSave}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent)]/90 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Flow canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-6">
              {selectedWorkflow.steps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Workflow className="w-10 h-10 text-[var(--app-text-muted)]" />
                  <p className="text-sm text-[var(--app-text-muted)]">No steps yet</p>
                  <p className="text-xs text-[var(--app-text-muted)]">Click + to add your first step</p>
                </div>
              ) : (
                <div className="flex items-center gap-0 min-h-[200px]">
                  {selectedWorkflow.steps.map((step, idx) => {
                    const Icon = getIconForType(step.type);
                    const colors = categoryColors[step.category];
                    const isEditing = editingStepId === step.id;

                    return (
                      <React.Fragment key={step.id}>
                        {/* Node */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="relative group"
                        >
                          <div
                            className={cn(
                              'w-[140px] rounded-xl border p-3 transition-colors cursor-pointer',
                              colors.bg,
                              colors.border,
                              'hover:brightness-110'
                            )}
                            onClick={() => setEditingStepId(isEditing ? null : step.id)}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <Icon className={cn('w-4 h-4', colors.iconColor)} />
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--app-text-muted)]">
                                {step.category}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-[var(--app-text)] leading-snug">
                              {step.label}
                            </p>
                            <p className="text-[10px] text-[var(--app-text-muted)] mt-1">
                              {getLabelForType(step.type)}
                            </p>

                            {/* Expanded config on edit */}
                            <AnimatePresence>
                              {isEditing && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 pt-2 border-t border-[var(--app-border-strong)]">
                                    <input
                                      type="text"
                                      value={step.label}
                                      onChange={(e) => {
                                        setLocalWorkflows((prev) =>
                                          prev.map((w) => {
                                            if (w.id !== selectedId) return w;
                                            return {
                                              ...w,
                                              steps: w.steps.map((s) =>
                                                s.id === step.id ? { ...s, label: e.target.value } : s
                                              ),
                                            };
                                          })
                                        );
                                      }}
                                      className="app-input text-xs w-full px-2 py-1.5 bg-[var(--app-hover-bg)] border-[var(--app-border-strong)] text-[var(--app-text)]"
                                      placeholder="Step label"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStep(step.id);
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>

                        {/* Add step button + connector arrow */}
                        {idx < selectedWorkflow.steps.length - 1 && (
                          <div className="flex items-center mx-1 relative">
                            <div className="w-8 h-[2px] bg-[var(--app-border)]" />
                            <motion.div
                              className="absolute"
                              initial={{ x: -4 }}
                              animate={{ x: [0, 6, 0] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            >
                              <ChevronRight className="w-3 h-3 text-[var(--app-text-muted)]" />
                            </motion.div>
                          </div>
                        )}

                        {/* Add button between / after nodes */}
                        <div className="relative">
                          <button
                            onClick={() => {
                              setShowAddMenu(
                                showAddMenu?.stepId === step.id
                                  ? null
                                  : { stepId: step.id, index: idx }
                              );
                              setEditingStepId(null);
                            }}
                            className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0',
                              showAddMenu?.stepId === step.id
                                ? 'bg-[var(--app-accent)] text-white'
                                : 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)] hover:bg-[var(--app-hover-bg)] hover:text-[var(--app-text-secondary)]'
                            )}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Add menu popup */}
                          <AnimatePresence>
                            {showAddMenu?.stepId === step.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[200px] bg-[var(--app-card-bg)] border border-[var(--app-border-strong)] rounded-xl shadow-xl z-20 py-1.5"
                              >
                                <p className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider px-3 pb-1.5">
                                  Triggers
                                </p>
                                {triggerTypes.map((t) => {
                                  const TIcon = t.icon;
                                  return (
                                    <button
                                      key={t.type}
                                      onClick={() => addStep(showAddMenu.index, t.type)}
                                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] transition-colors"
                                    >
                                      <TIcon className="w-3.5 h-3.5 text-purple-400" />
                                      {t.label}
                                    </button>
                                  );
                                })}
                                <div className="h-px bg-[var(--app-border)] my-1.5" />
                                <p className="text-[10px] font-semibold text-[var(--app-text-muted)] uppercase tracking-wider px-3 pb-1.5">
                                  Actions
                                </p>
                                {actionTypes.map((a) => {
                                  const AIcon = a.icon;
                                  return (
                                    <button
                                      key={a.type}
                                      onClick={() => addStep(showAddMenu.index, a.type)}
                                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-[var(--app-text-secondary)] hover:text-[var(--app-text)] hover:bg-[var(--app-hover-bg)] transition-colors"
                                    >
                                      <AIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                                      {a.label}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--app-hover-bg)' }}
            >
              <Workflow className="w-8 h-8 text-[var(--app-text-muted)]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--app-text-secondary)]">
                No workflows yet
              </p>
              <p className="text-xs text-[var(--app-text-muted)] mt-1 max-w-[280px]">
                Create your first automation to streamline repetitive tasks and processes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
