'use client';

import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ANIMATION } from '../../design-tokens';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  ListPlus,
  UserPlus,
  FolderKanban,
  CalendarOff,
  Monitor,
  X,
  Sparkles,
  // Template icons
  Globe,
  Smartphone,
  Users,
  Building2,
  Bug,
  Star,
  Code2,
  FileText,
  Palette,
  ShieldCheck,
  ClipboardCheck,
  Briefcase,
} from 'lucide-react';
import { mockProjects, mockEmployees, mockResources } from '../../data/mock-data';
import { useErpStore } from '../../erp-store';
import type { CreateEntityType } from '../../erp-store';

// ---- Types ----

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  type: CreateEntityType;
  onSubmit?: (data: Record<string, unknown>) => void;
}

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'priority' | 'status';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
}

interface Template {
  id: string;
  name: string;
  icon: LucideIcon;
  values: Record<string, string>;
}

interface AiSuggestion {
  fieldKey: string;
  value: string;
  reason: string;
}

// ---- Config per entity type ----

const entityTypeConfig: Record<CreateEntityType, { icon: typeof ListPlus; label: string }> = {
  task: { icon: ListPlus, label: 'Task' },
  employee: { icon: UserPlus, label: 'Employee' },
  project: { icon: FolderKanban, label: 'Project' },
  leave: { icon: CalendarOff, label: 'Leave' },
  asset: { icon: Monitor, label: 'Asset' },
};

// ---- Templates per entity type ----

const templates: Record<CreateEntityType, Template[]> = {
  project: [
    { id: 'tp-web', name: 'Website Build', icon: Globe, values: { name: 'New Website Project', description: 'Full-stack website development with modern UI/UX', priority: 'high' } },
    { id: 'tp-mobile', name: 'Mobile App', icon: Smartphone, values: { name: 'Mobile Application', description: 'Cross-platform mobile app development', priority: 'high' } },
    { id: 'tp-consult', name: 'Consulting', icon: Users, values: { name: 'Consulting Engagement', description: 'Strategic consulting and advisory services', priority: 'medium' } },
    { id: 'tp-internal', name: 'Internal', icon: Building2, values: { name: 'Internal Initiative', description: 'Internal tool or process improvement project', priority: 'low' } },
  ],
  task: [
    { id: 'tt-bug', name: 'Bug Fix', icon: Bug, values: { title: 'Fix: ', description: 'Bug report and fix', priority: 'high', stage: 'todo' } },
    { id: 'tt-feature', name: 'Feature Request', icon: Star, values: { title: 'Feature: ', description: 'New feature implementation', priority: 'medium', stage: 'backlog' } },
    { id: 'tt-review', name: 'Code Review', icon: Code2, values: { title: 'Review: ', description: 'Code review task', priority: 'medium', stage: 'todo' } },
    { id: 'tt-docs', name: 'Documentation', icon: FileText, values: { title: 'Docs: ', description: 'Technical documentation update', priority: 'low', stage: 'todo' } },
  ],
  employee: [
    { id: 'te-dev', name: 'Developer', icon: Code2, values: { department: 'Engineering', designation: 'Software Developer' } },
    { id: 'te-design', name: 'Designer', icon: Palette, values: { department: 'Design', designation: 'UI/UX Designer' } },
    { id: 'te-pm', name: 'PM', icon: Briefcase, values: { department: 'Operations', designation: 'Project Manager' } },
    { id: 'te-qa', name: 'QA Engineer', icon: ShieldCheck, values: { department: 'QA', designation: 'QA Engineer' } },
  ],
  leave: [],
  asset: [],
};

// ---- AI suggestions per entity type ----

function getAiSuggestions(type: CreateEntityType): AiSuggestion[] {
  switch (type) {
    case 'task':
      return [
        { fieldKey: 'assignee', value: 'Arun Kumar', reason: 'Lowest workload (75% allocation)' },
        { fieldKey: 'projectId', value: 'p4', reason: 'Most recent active project' },
        { fieldKey: 'priority', value: 'medium', reason: 'Based on current sprint capacity' },
      ];
    case 'project':
      return [
        { fieldKey: 'client', value: 'NexaBank Holdings', reason: 'Most active client relationship' },
        { fieldKey: 'budget', value: '500000', reason: 'Average project budget' },
      ];
    case 'employee':
      return [
        { fieldKey: 'department', value: 'Engineering', reason: 'Largest team, most hiring' },
        { fieldKey: 'designation', value: 'Software Developer', reason: 'Most common role' },
      ];
    default:
      return [];
  }
}

const employeeOptions = mockEmployees.map((e) => ({ label: e.name, value: e.id }));

const projectOptions = mockProjects.map((p) => ({ label: p.name, value: p.id }));

// ---- Priority / status visual configs ----

const priorityConfig = [
  { value: 'low', label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { value: 'medium', label: 'Medium', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { value: 'high', label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { value: 'critical', label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
];

const statusConfig = [
  { value: 'backlog', label: 'Backlog', color: '#8b5cf6' },
  { value: 'todo', label: 'To Do', color: '#3b82f6' },
  { value: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'review', label: 'Review', color: '#cc5c37' },
];

function getFormFields(type: CreateEntityType): FormField[] {
  switch (type) {
    case 'task':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter task title', required: true },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the task' },
        { key: 'projectId', label: 'Project', type: 'select', required: false, options: projectOptions },
        { key: 'assignee', label: 'Assignee', type: 'select', required: false, options: employeeOptions },
        { key: 'priority', label: 'Priority', type: 'priority', required: false, defaultValue: 'medium' },
        { key: 'dueDate', label: 'Due Date', type: 'date', required: false },
        { key: 'stage', label: 'Status', type: 'status', required: false, defaultValue: 'todo' },
      ];
    case 'employee':
      return [
        { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name', required: true },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'name@company.com', required: true },
        { key: 'phone', label: 'Phone', type: 'text', placeholder: '+91 XXXXX XXXXX' },
        {
          key: 'department',
          label: 'Department',
          type: 'select',
          required: false,
          options: [
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Design', value: 'Design' },
            { label: 'QA', value: 'QA' },
            { label: 'HR', value: 'HR' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Operations', value: 'Operations' },
            { label: 'Sales', value: 'Sales' },
          ],
        },
        { key: 'designation', label: 'Designation', type: 'text', placeholder: 'Job title' },
        { key: 'manager', label: 'Manager', type: 'select', required: false, options: employeeOptions },
      ];
    case 'project':
      return [
        { key: 'name', label: 'Project Name', type: 'text', placeholder: 'Enter project name', required: true },
        { key: 'client', label: 'Client', type: 'text', placeholder: 'Client name', required: true },
        { key: 'budget', label: 'Budget', type: 'number', placeholder: '0' },
        { key: 'priority', label: 'Priority', type: 'priority', required: false, defaultValue: 'medium' },
        { key: 'dueDate', label: 'Due Date', type: 'date', required: false },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Project description' },
      ];
    case 'leave':
      return [
        {
          key: 'type',
          label: 'Leave Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Casual Leave', value: 'casual' },
            { label: 'Sick Leave', value: 'sick' },
            { label: 'Earned Leave', value: 'earned' },
            { label: 'Comp-Off', value: 'comp-off' },
          ],
          defaultValue: 'casual',
        },
        { key: 'startDate', label: 'Start Date', type: 'date', required: true },
        { key: 'endDate', label: 'End Date', type: 'date', required: true },
        { key: 'reason', label: 'Reason', type: 'textarea', placeholder: 'Reason for leave', required: true },
      ];
    case 'asset':
      return [
        { key: 'name', label: 'Asset Name', type: 'text', placeholder: 'Enter asset name', required: true },
        {
          key: 'assetType',
          label: 'Asset Type',
          type: 'select',
          required: false,
          options: [
            { label: 'Laptop', value: 'Laptop' },
            { label: 'Monitor', value: 'Monitor' },
            { label: 'Mobile', value: 'Mobile' },
            { label: 'Printer', value: 'Printer' },
            { label: 'Server', value: 'Server' },
            { label: 'Tablet', value: 'Tablet' },
            { label: 'AV Equipment', value: 'AV Equipment' },
          ],
        },
        { key: 'serialNo', label: 'Serial Number', type: 'text', placeholder: 'Enter serial number' },
        { key: 'assignedTo', label: 'Assigned To', type: 'select', required: false, options: employeeOptions },
        { key: 'purchaseCost', label: 'Purchase Cost', type: 'number', placeholder: '0' },
      ];
    default:
      return [];
  }
}

// ---- Date quick options ----

function getDateQuickOptions(): Array<{ label: string; getValue: () => string }> {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  return [
    { label: 'Today', getValue: () => fmt(today) },
    { label: 'Tomorrow', getValue: () => fmt(tomorrow) },
    { label: 'Next Week', getValue: () => fmt(nextWeek) },
  ];
}

// ---- Form Field Renderer ----

function FormFieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
}) {
  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={cn(
          'ops-input w-full rounded-xl border bg-[rgba(255,255,255,0.03)] text-[#f5f5f5] text-[13px] placeholder:text-[rgba(245,245,245,0.2)] resize-none transition-colors',
          error
            ? 'border-red-500/50 focus:outline-none focus:border-red-500'
            : 'border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#cc5c37]/50'
        )}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'ops-input w-full rounded-xl border bg-[rgba(255,255,255,0.03)] text-[#f5f5f5] text-[13px] transition-colors cursor-pointer',
          error
            ? 'border-red-500/50 focus:outline-none focus:border-red-500'
            : 'border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#cc5c37]/50',
          !value && 'text-[rgba(245,245,245,0.2)]'
        )}
      >
        <option value="" className="bg-[#222325]">
          Select...
        </option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#222325]">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        min={0}
        className={cn(
          'ops-input w-full rounded-xl border bg-[rgba(255,255,255,0.03)] text-[#f5f5f5] text-[13px] placeholder:text-[rgba(245,245,245,0.2)] transition-colors',
          error
            ? 'border-red-500/50 focus:outline-none focus:border-red-500'
            : 'border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#cc5c37]/50'
        )}
      />
    );
  }

  if (field.type === 'date') {
    const quickOptions = getDateQuickOptions();
    return (
      <div className="space-y-2">
        {/* Quick date options */}
        <div className="flex gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.getValue())}
              className={cn(
                'text-[11px] px-2.5 py-1 rounded-lg border transition-colors',
                value === opt.getValue()
                  ? 'bg-[rgba(204,92,55,0.12)] border-[#cc5c37]/30 text-[#cc5c37]'
                  : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[rgba(245,245,245,0.4)] hover:text-[rgba(245,245,245,0.6)]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'ops-input w-full rounded-xl border bg-[rgba(255,255,255,0.03)] text-[#f5f5f5] text-[13px] transition-colors',
            error
              ? 'border-red-500/50 focus:outline-none focus:border-red-500'
              : 'border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#cc5c37]/50',
            '[&::-webkit-calendar-picker-indicator]:opacity-30 [&::-webkit-calendar-picker-indicator]:invert'
          )}
        />
      </div>
    );
  }

  if (field.type === 'priority') {
    return (
      <div className="flex gap-2">
        {priorityConfig.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={cn(
              'flex-1 py-2 rounded-xl text-[12px] font-medium border transition-all',
              value === p.value
                ? 'border-transparent'
                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[rgba(245,245,245,0.4)] hover:text-[rgba(245,245,245,0.6)]'
            )}
            style={
              value === p.value
                ? { backgroundColor: p.bg, color: p.color, borderColor: `${p.color}30` }
                : undefined
            }
          >
            {p.label}
          </button>
        ))}
      </div>
    );
  }

  if (field.type === 'status') {
    return (
      <div className="flex flex-wrap gap-2">
        {statusConfig.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all',
              value === s.value
                ? 'border-transparent text-white'
                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[rgba(245,245,245,0.4)] hover:text-[rgba(245,245,245,0.6)]'
            )}
            style={
              value === s.value
                ? { backgroundColor: `${s.color}20`, color: s.color, borderColor: `${s.color}30` }
                : undefined
            }
          >
            {s.label}
          </button>
        ))}
      </div>
    );
  }

  // text
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={cn(
        'ops-input w-full rounded-xl border bg-[rgba(255,255,255,0.03)] text-[#f5f5f5] text-[13px] placeholder:text-[rgba(245,245,245,0.2)] transition-colors',
        error
          ? 'border-red-500/50 focus:outline-none focus:border-red-500'
          : 'border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#cc5c37]/50'
      )}
    />
  );
}

// ---- AI Suggestion Chip ----

function AiSuggestionChip({
  suggestion,
  onAccept,
  currentFieldValue,
}: {
  suggestion: AiSuggestion;
  onAccept: (value: string) => void;
  currentFieldValue: string;
}) {
  // Don't show if the field already has a value
  if (currentFieldValue) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onAccept(suggestion.value)}
      className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg bg-[rgba(204,92,55,0.06)] border border-[rgba(204,92,55,0.12)] hover:bg-[rgba(204,92,55,0.12)] transition-colors group w-full text-left"
    >
      <Sparkles className="w-3 h-3 text-[#cc5c37] shrink-0" />
      <span className="text-[11px] text-[rgba(245,245,245,0.4)] flex-1">
        AI suggests: <span className="text-[rgba(245,245,245,0.7)] font-medium">{suggestion.value}</span>
      </span>
      <span className="text-[10px] text-[#cc5c37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        Apply
      </span>
    </motion.button>
  );
}

// ---- CreateModal Component ----

function CreateModalInner({ open, onClose, type, onSubmit }: CreateModalProps) {
  const selectedProjectId = useErpStore((s) => s.selectedProjectId);
  const selectedEmployeeId = useErpStore((s) => s.selectedEmployeeId);

  const fields = useMemo(() => getFormFields(type), [type]);
  const config = entityTypeConfig[type];
  const Icon = config.icon;

  const typeTemplates = templates[type] || [];
  const aiSuggestions = useMemo(() => getAiSuggestions(type), [type]);

  // Compute context-aware defaults
  const contextEntity = useMemo<{ label: string; icon?: string } | null>(() => {
    if (type === 'task' && selectedProjectId) {
      const proj = mockProjects.find(p => p.id === selectedProjectId);
      if (proj) return { label: proj.name, icon: 'project' };
    }
    if (type === 'task' && selectedEmployeeId) {
      const emp = mockEmployees.find(e => e.id === selectedEmployeeId);
      if (emp) return { label: emp.name, icon: 'employee' };
    }
    return null;
  }, [type, selectedProjectId, selectedEmployeeId]);

  // Compute initial form defaults
  const initialDefaults = useMemo(() => {
    const defaults: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = String(f.defaultValue);
      }
    });
    if (type === 'task' && selectedProjectId) {
      defaults.projectId = selectedProjectId;
    }
    if (type === 'task' && selectedEmployeeId) {
      defaults.assignee = selectedEmployeeId;
    }
    return defaults;
  }, [fields, type, selectedProjectId, selectedEmployeeId]);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap within modal
  useEffect(() => {
    if (!open) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector = 'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
    const focusableEls = modal.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusableEls.length > 0) {
      // Focus first element after a brief delay to let animation start
      setTimeout(() => focusableEls[0]?.focus(), 100);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && focusableEls.length > 0) {
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Track open state for reset
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset form on modal open
      setFormData(initialDefaults);
      setErrors({});
      setSubmitting(false);
      setSuccessFlash(false);
    }
    prevOpenRef.current = open;
  }, [open, initialDefaults]);

  const handleChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }, []);

  const handleAcceptAiSuggestion = useCallback((fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const handleApplyTemplate = useCallback((template: Template) => {
    setFormData((prev) => {
      const next = { ...prev };
      for (const [key, val] of Object.entries(template.values)) {
        if (!next[key]) {
          next[key] = val;
        }
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: Record<string, boolean> = {};
      fields.forEach((f) => {
        if (f.required && !formData[f.key]?.trim()) {
          newErrors[f.key] = true;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setSubmitting(true);

      setTimeout(() => {
        setSuccessFlash(true);
        onSubmit?.(formData);
        setTimeout(() => {
          setSubmitting(false);
          setSuccessFlash(false);
          onClose();
        }, 400);
      }, 300);
    },
    [fields, formData, onSubmit, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.durationFast }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={ANIMATION.modalEnter}
              className="w-full max-w-lg bg-[#222325] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-modal-title"
            >
              {/* Success flash overlay */}
              <AnimatePresence>
                {successFlash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: ANIMATION.durationMedium }}
                    className="absolute inset-0 z-10 bg-emerald-500/15 rounded-2xl flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(204,92,55,0.12)] flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-[#cc5c37]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="create-modal-title" className="text-sm font-semibold text-[#f5f5f5]">Create {config.label}</h2>
                    <p className="text-[11px] text-[rgba(245,245,245,0.35)]">
                      Fill in the details below
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg text-[rgba(245,245,245,0.4)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Scrollable body */}
              <div className="max-h-[65vh] overflow-y-auto">
                {/* Context Banner */}
                {contextEntity && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mx-6 mt-4 px-3 py-2 rounded-lg bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] flex items-center gap-2"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                    <span className="text-[11px] text-[rgba(245,245,245,0.5)]">
                      Creating for: <span className="text-[rgba(245,245,245,0.8)] font-medium">{contextEntity.label}</span>
                    </span>
                  </motion.div>
                )}

                {/* Templates Section */}
                {typeTemplates.length > 0 && (
                  <div className="px-6 mt-4">
                    <p className="text-[11px] font-medium text-[rgba(245,245,245,0.3)] uppercase tracking-wider mb-2">
                      Templates
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {typeTemplates.map((t) => {
                        const TIcon = t.icon;
                        return (
                          <motion.button
                            key={t.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApplyTemplate(t)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-colors shrink-0"
                          >
                            <TIcon className="w-3.5 h-3.5 text-[rgba(245,245,245,0.4)]" />
                            <span className="text-[12px] text-[rgba(245,245,245,0.6)] whitespace-nowrap">{t.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-[12px] font-medium text-[rgba(245,245,245,0.5)] flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-400 text-[11px]">*</span>}
                      </label>
                      <FormFieldInput
                        field={field}
                        value={formData[field.key] || ''}
                        onChange={(val) => handleChange(field.key, val)}
                        error={errors[field.key]}
                      />
                      {/* AI Suggestion */}
                      {aiSuggestions.find(s => s.fieldKey === field.key) && (
                        <AiSuggestionChip
                          suggestion={aiSuggestions.find(s => s.fieldKey === field.key)!}
                          onAccept={(val) => handleAcceptAiSuggestion(field.key, val)}
                          currentFieldValue={formData[field.key] || ''}
                        />
                      )}
                    </div>
                  ))}
                </form>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                  className="h-9 px-4 rounded-xl text-[13px] text-[rgba(245,245,245,0.6)] hover:text-[#f5f5f5] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit as unknown as () => void}
                  disabled={submitting}
                  className="h-9 px-5 rounded-xl bg-[#cc5c37] text-white text-[13px] font-medium hover:bg-[#cc5c37]/90 transition-colors"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    `Create ${config.label}`
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export const CreateModal = memo(CreateModalInner);

export default CreateModal;
