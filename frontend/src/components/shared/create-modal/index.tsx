'use client';

import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ANIMATION, CSS } from '@/styles/design-tokens';
import type { LucideIcon } from 'lucide-react';
import { X, CheckCircle2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'date'
  | 'number'
  | 'custom';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  /** Unique field key (used as form data key) */
  key: string;
  /** Display label */
  label: string;
  /** Field type */
  type: FormFieldType;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Options for select type */
  options?: FormFieldOption[];
  /** Default value */
  defaultValue?: string | number;
  /** Custom renderer for 'custom' type */
  render?: (props: {
    value: string;
    onChange: (val: string) => void;
    error?: boolean;
  }) => React.ReactNode;
}

export interface CreateModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Close callback */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal description */
  description?: string;
  /** Form fields to render */
  fields: FormField[];
  /** Icon component for the header */
  icon?: LucideIcon;
  /** Submit label (default: "Create") */
  submitLabel?: string;
  /** Submit callback */
  onSubmit?: (data: Record<string, string>) => void;
  /** Submitting state */
  submitting?: boolean;
  /** Additional header actions */
  headerActions?: React.ReactNode;
  /** Pre-fill data for fields */
  defaultValues?: Record<string, string>;
}

// ── Priority config (reusable) ─────────────────────────

export const PRIORITY_CONFIG = [
  { value: 'low', label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { value: 'medium', label: 'Medium', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { value: 'high', label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { value: 'critical', label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
];

// ── Date quick options ─────────────────────────────────

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

// ── Form Field Renderer ────────────────────────────────

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
  const errorBorder = error ? 'border-red-500/50 focus:outline-none focus:border-red-500' : `border-[var(--app-border-strong)] focus:outline-none focus:border-[var(--app-accent)]/50`;

  if (field.type === 'custom' && field.render) {
    return <>{field.render({ value, onChange, error })}</>;
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={cn(
          'w-full rounded-xl border text-[13px] placeholder:text-[var(--app-text-disabled)] resize-none transition-colors',
          errorBorder
        )}
        style={{
          backgroundColor: CSS.hoverBg,
          color: CSS.text,
        }}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-xl border text-[13px] transition-colors cursor-pointer',
          errorBorder,
          !value && 'text-[var(--app-text-disabled)]'
        )}
        style={{
          backgroundColor: CSS.hoverBg,
          color: CSS.text,
        }}
      >
        <option value="" style={{ backgroundColor: CSS.cardBg }}>
          Select...
        </option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: CSS.cardBg }}>
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
          'w-full rounded-xl border text-[13px] placeholder:text-[var(--app-text-disabled)] transition-colors',
          errorBorder
        )}
        style={{
          backgroundColor: CSS.hoverBg,
          color: CSS.text,
        }}
      />
    );
  }

  if (field.type === 'date') {
    const quickOptions = getDateQuickOptions();
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.getValue())}
              className={cn(
                'text-[11px] px-2.5 py-1 rounded-lg border transition-colors',
                value === opt.getValue()
                  ? 'bg-[var(--app-accent-light)] border-[var(--app-accent)]/30 text-[var(--app-accent)]'
                  : 'bg-[var(--app-hover-bg)] border-[var(--app-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
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
            'w-full rounded-xl border text-[13px] transition-colors',
            errorBorder,
            '[&::-webkit-calendar-picker-indicator]:opacity-30 [&::-webkit-calendar-picker-indicator]:invert'
          )}
          style={{
            backgroundColor: CSS.hoverBg,
            color: CSS.text,
          }}
        />
      </div>
    );
  }

  // Default: text input
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={cn(
        'w-full rounded-xl border text-[13px] placeholder:text-[var(--app-text-disabled)] transition-colors',
        errorBorder
      )}
      style={{
        backgroundColor: CSS.hoverBg,
        color: CSS.text,
      }}
    />
  );
}

// ── Component ──────────────────────────────────────────

function CreateModalInner({
  open,
  onClose,
  title,
  description,
  fields,
  icon: Icon,
  submitLabel = 'Create',
  onSubmit,
  submitting = false,
  headerActions,
  defaultValues,
}: CreateModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [successFlash, setSuccessFlash] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Compute initial defaults
  const initialDefaults = useMemo(() => {
    const defaults: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = String(f.defaultValue);
      }
    });
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, val]) => {
        if (!defaults[key]) defaults[key] = val;
      });
    }
    return defaults;
  }, [fields, defaultValues]);

  // Focus trap within modal
  useEffect(() => {
    if (!open) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector = 'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
    const focusableEls = modal.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusableEls.length > 0) {
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
      setFormData(initialDefaults);
      setErrors({});
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

      setSuccessFlash(true);
      onSubmit?.(formData);
      setTimeout(() => {
        setSuccessFlash(false);
        onClose();
      }, 400);
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
            transition={{ duration: ANIMATION.duration.fast }}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: CSS.overlay }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative"
              style={{
                backgroundColor: CSS.cardBg,
                border: `1px solid ${CSS.borderStrong}`,
              }}
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
                    transition={{ duration: ANIMATION.duration.slow }}
                    className="absolute inset-0 z-10 bg-emerald-500/15 rounded-2xl flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: `1px solid ${CSS.border}` }}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: CSS.accentLight }}
                    >
                      <Icon
                        className="w-[18px] h-[18px]"
                        style={{ color: CSS.accent }}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div>
                    <h2
                      id="create-modal-title"
                      className="text-sm font-semibold"
                      style={{ color: CSS.text }}
                    >
                      {title}
                    </h2>
                    {description && (
                      <p className="text-[11px]" style={{ color: CSS.textMuted }}>
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {headerActions}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg hover:bg-[var(--app-hover-bg)]"
                    style={{ color: CSS.textMuted }}
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="max-h-[65vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label
                        className="text-[12px] font-medium flex items-center gap-1"
                        style={{ color: CSS.textSecondary }}
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 dark:text-red-400 text-[11px]">*</span>
                        )}
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
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-end gap-3 px-6 py-4"
                style={{
                  borderTop: `1px solid ${CSS.border}`,
                  backgroundColor: CSS.hoverBg,
                }}
              >
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                  className="h-9 px-4 rounded-xl text-[13px] hover:bg-[var(--app-hover-bg)]"
                  style={{ color: CSS.textSecondary }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit as unknown as () => void}
                  disabled={submitting}
                  className="h-9 px-5 rounded-xl text-[13px] font-medium text-white transition-colors"
                  style={{
                    backgroundColor: CSS.accent,
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    submitLabel
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
