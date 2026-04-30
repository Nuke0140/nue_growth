'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  List,
  LayoutGrid,
} from 'lucide-react';
import { customFields } from './data/mock-data';
import RoleChip from './components/role-chip';
import type { UserRole } from './types';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const moduleTabs = ['All', 'CRM', 'Sales', 'Finance', 'ERP', 'HR', 'Retention', 'Analytics'] as const;

const typeFilters = ['All', 'Text', 'Number', 'Dropdown', 'Date', 'Checkbox', 'Multi-Select'] as const;

const moduleColors: Record<string, { dark: string; light: string }> = {
  CRM: { dark: 'bg-blue-500/15 text-blue-400', light: 'bg-blue-50 text-blue-600' },
  Sales: { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  Finance: { dark: 'bg-amber-500/15 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  ERP: { dark: 'bg-violet-500/15 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  HR: { dark: 'bg-pink-500/15 text-pink-400', light: 'bg-pink-50 text-pink-600' },
  Retention: { dark: 'bg-orange-500/15 text-orange-400', light: 'bg-orange-50 text-orange-600' },
  Analytics: { dark: 'bg-sky-500/15 text-sky-400', light: 'bg-sky-50 text-sky-600' },
};

const typeIcons: Record<string, typeof Type> = {
  text: Type,
  number: Hash,
  dropdown: List,
  date: Calendar,
  checkbox: CheckSquare,
  'multi-select': LayoutGrid,
  formula: SlidersHorizontal,
};

const allRoles: UserRole[] = ['super-admin', 'admin', 'sales', 'marketing', 'finance', 'hr', 'client', 'viewer'];

export default function CustomFieldsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeModule, setActiveModule] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [formName, setFormName] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formModule, setFormModule] = useState('CRM');
  const [formType, setFormType] = useState('text');
  const [formRequired, setFormRequired] = useState(false);
  const [formDefault, setFormDefault] = useState('');
  const [formValidation, setFormValidation] = useState('');
  const [formOptions, setFormOptions] = useState('');
  const [formRoles, setFormRoles] = useState<UserRole[]>([]);

  const filteredFields = useMemo(() => {
    return customFields.filter((field) => {
      const moduleMatch = activeModule === 'All' || field.module === activeModule;
      const typeMatch = activeType === 'All' || field.type.toLowerCase() === activeType.toLowerCase();
      return moduleMatch && typeMatch;
    });
  }, [activeModule, activeType]);

  const totalFields = customFields.length;
  const requiredFields = customFields.filter((f) => f.required).length;
  const activeModules = new Set(customFields.map((f) => f.module)).size;

  const toggleRole = (role: UserRole) => {
    setFormRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <SlidersHorizontal className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Custom Fields</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Create and manage custom fields</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0',
              isDark ? 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            {showCreateForm ? 'Close Form' : 'Create Custom Field'}
          </button>
        </motion.div>

        {/* ── Module Filter Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className={cn('inline-flex items-center rounded-xl p-1 gap-0.5 flex-wrap', 'bg-[var(--app-hover-bg)]')}>
            {moduleTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveModule(tab)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer',
                  activeModule === tab
                    ? isDark ? 'bg-violet-500/20 text-violet-300 shadow-sm' : 'bg-violet-100 text-violet-700 shadow-sm'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Type Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className={cn('inline-flex items-center rounded-xl p-1 gap-0.5 flex-wrap', 'bg-[var(--app-hover-bg)]')}>
            {typeFilters.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer',
                  activeType === type
                    ? isDark ? 'bg-violet-500/20 text-violet-300 shadow-sm' : 'bg-violet-100 text-violet-700 shadow-sm'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Summary KPIs ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Fields', value: String(totalFields), icon: Tag, color: 'text-violet-400' },
            { label: 'Required Fields', value: String(requiredFields), icon: CheckSquare, color: 'text-red-400' },
            { label: 'Active Modules', value: String(activeModules), icon: LayoutGrid, color: 'text-emerald-400' },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className={cn('rounded-2xl border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>{kpi.label}</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{kpi.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Custom Field Cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filteredFields.map((field) => {
            const mColor = moduleColors[field.module] ?? moduleColors.CRM;
            const TypeIcon = typeIcons[field.type] ?? Type;
            return (
              <motion.div
                key={field.id}
                variants={fadeUp}
                className={cn(
                  'rounded-2xl border p-5 transition-colors',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04]',
                )}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
                      <TypeIcon className={cn('w-4 h-4', 'text-[var(--app-text-secondary)]')} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold">{field.label}</p>
                        {field.required && <span className="h-2 w-2 rounded-full bg-red-400" />}
                      </div>
                      <p className={cn('text-[10px] font-mono', 'text-[var(--app-text-muted)]')}>{field.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className={cn('p-1.5 rounded-lg transition-colors cursor-pointer', isDark ? 'hover:bg-white/[0.06] text-white/30 hover:text-white/60' : 'hover:bg-black/[0.06] text-black/30 hover:text-black/60')}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className={cn('p-1.5 rounded-lg transition-colors cursor-pointer', isDark ? 'hover:bg-red-500/10 text-white/30 hover:text-red-400' : 'hover:bg-red-50 text-black/30 hover:text-red-600')}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize', isDark ? mColor.dark : mColor.light)}>
                    {field.module}
                  </span>
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-red-400 bg-red-500/10">
                      Required
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-3">
                  {field.defaultValue && (
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider w-16 shrink-0', 'text-[var(--app-text-muted)]')}>Default</span>
                      <span className="text-xs">{field.defaultValue}</span>
                    </div>
                  )}
                  {field.validationRule && (
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider w-16 shrink-0', 'text-[var(--app-text-muted)]')}>Validation</span>
                      <span className={cn('text-[11px] font-mono truncate', 'text-[var(--app-text-secondary)]')}>{field.validationRule}</span>
                    </div>
                  )}
                </div>

                {/* Options (for dropdown/multi-select) */}
                {field.options && field.options.length > 0 && (
                  <div className="mb-3">
                    <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Options</span>
                    <div className="flex flex-wrap gap-1">
                      {field.options.map((opt) => (
                        <span key={opt} className={cn('rounded-full px-2 py-0.5 text-[9px] font-medium', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visibility Roles */}
                <div className="mb-3">
                  <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Visible to</span>
                  <div className="flex flex-wrap gap-1">
                    {field.visibilityRoles.map((role) => (
                      <RoleChip key={role} role={role} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className={cn('flex items-center gap-4 text-[10px]', 'text-[var(--app-text-disabled)]')}>
                  <span>Created: {new Date(field.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>Modified: {new Date(field.modifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Create Custom Field Form ── */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 16, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Plus className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Create Custom Field</span>
            </div>
            <div className={cn('rounded-2xl border p-5', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Field Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. lead_score"
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                      'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                    )}
                  />
                </div>

                {/* Label */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Display Label</label>
                  <input
                    type="text"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Lead Score"
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                      'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                    )}
                  />
                </div>

                {/* Module */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Module</label>
                  <select
                    value={formModule}
                    onChange={(e) => setFormModule(e.target.value)}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer',
                      isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-black/[0.03] border-black/[0.08] text-black',
                    )}
                  >
                    {moduleTabs.filter((t) => t !== 'All').map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer',
                      isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-black/[0.03] border-black/[0.08] text-black',
                    )}
                  >
                    {typeFilters.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t.toLowerCase()}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Default Value */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Default Value</label>
                  <input
                    type="text"
                    value={formDefault}
                    onChange={(e) => setFormDefault(e.target.value)}
                    placeholder="Optional"
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                      'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                    )}
                  />
                </div>

                {/* Validation Rule */}
                <div>
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Validation Rule</label>
                  <input
                    type="text"
                    value={formValidation}
                    onChange={(e) => setFormValidation(e.target.value)}
                    placeholder="e.g. min:0,max:100"
                    className={cn(
                      'w-full rounded-lg border px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                      'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                    )}
                  />
                </div>

                {/* Options textarea */}
                {(formType === 'dropdown' || formType === 'multi-select') && (
                  <div className="md:col-span-2">
                    <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>Options (comma-separated)</label>
                    <textarea
                      value={formOptions}
                      onChange={(e) => setFormOptions(e.target.value)}
                      placeholder="Option 1, Option 2, Option 3"
                      rows={2}
                      className={cn(
                        'w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none',
                        'bg-[var(--app-input-bg)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                      )}
                    />
                  </div>
                )}

                {/* Required toggle */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setFormRequired(!formRequired)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                      'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full', formRequired ? 'bg-red-400' : isDark ? 'bg-zinc-600' : 'bg-zinc-300')} />
                    Required: {formRequired ? 'Yes' : 'No'}
                  </button>
                </div>

                {/* Role visibility */}
                <div className="md:col-span-2">
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>Visible to Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {allRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={cn(
                          'transition-all cursor-pointer',
                          formRoles.includes(role) ? 'ring-2 ring-violet-500 ring-offset-1 ring-offset-transparent rounded-full' : '',
                        )}
                      >
                        <RoleChip role={role} size="md" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-5 flex justify-end">
                <button className={cn(
                  'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
                  isDark ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30' : 'bg-violet-100 text-violet-600 hover:bg-violet-200',
                )}>
                  <Plus className="w-3.5 h-3.5" /> Create Field
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
