'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ListPlus,
  UserPlus,
  FolderKanban,
  CalendarOff,
  Monitor,
  X,
} from 'lucide-react';
import { mockProjects, mockEmployees } from '../../data/mock-data';
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
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
}

// ---- Config per entity type ----

const entityTypeConfig: Record<CreateEntityType, { icon: typeof ListPlus; label: string }> = {
  task: { icon: ListPlus, label: 'Task' },
  employee: { icon: UserPlus, label: 'Employee' },
  project: { icon: FolderKanban, label: 'Project' },
  leave: { icon: CalendarOff, label: 'Leave' },
  asset: { icon: Monitor, label: 'Asset' },
};

const employeeOptions = mockEmployees.map((e) => ({ label: e.name, value: e.id }));

const projectOptions = mockProjects.map((p) => ({ label: p.name, value: p.id }));

function getFormFields(type: CreateEntityType): FormField[] {
  switch (type) {
    case 'task':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Enter task title', required: true },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the task' },
        { key: 'projectId', label: 'Project', type: 'select', required: false, options: projectOptions },
        { key: 'assignee', label: 'Assignee', type: 'select', required: false, options: employeeOptions },
        {
          key: 'priority',
          label: 'Priority',
          type: 'select',
          required: false,
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ],
          defaultValue: 'medium',
        },
        { key: 'dueDate', label: 'Due Date', type: 'date', required: false },
        {
          key: 'stage',
          label: 'Stage',
          type: 'select',
          required: false,
          options: [
            { label: 'Backlog', value: 'backlog' },
            { label: 'To Do', value: 'todo' },
            { label: 'In Progress', value: 'in-progress' },
          ],
          defaultValue: 'todo',
        },
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
        {
          key: 'priority',
          label: 'Priority',
          type: 'select',
          required: false,
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ],
          defaultValue: 'medium',
        },
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
    return (
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

// ---- CreateModal Component ----

export function CreateModal({ open, onClose, type, onSubmit }: CreateModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);

  const fields = useMemo(() => getFormFields(type), [type]);
  const config = entityTypeConfig[type];
  const Icon = config.icon;

  // Reset form when modal opens or type changes
  const handleOpen = useCallback(() => {
    const defaults: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = String(f.defaultValue);
      }
    });
    setFormData(defaults);
    setErrors({});
    setSubmitting(false);
    setSuccessFlash(false);
  }, [fields]);

  // Track open state for reset
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      handleOpen();
    }
    prevOpenRef.current = open;
  }, [open, handleOpen]);

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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validate required fields
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

      // Simulate brief submission
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg bg-[#222325] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success flash overlay */}
              <AnimatePresence>
                {successFlash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10 bg-emerald-500/15 rounded-2xl flex items-center justify-center pointer-events-none"
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
                    <Icon className="w-[18px] h-[18px] text-[#cc5c37]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#f5f5f5]">Create {config.label}</h2>
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
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

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
                  </div>
                ))}
              </form>

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

export default CreateModal;
