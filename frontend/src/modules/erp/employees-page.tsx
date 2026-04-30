'use client';

import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, Clock, AlertTriangle, MoreHorizontal,
  Mail, Phone, Briefcase, UserCircle, Calendar, DollarSign,
  Eye, Pencil, UserX, LayoutGrid, LayoutList,
  FolderKanban, Building2, FilterX, ChevronLeft, ChevronRight,
  Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// ── Shared Components ───────────────────────────────────
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { CreateModal } from '@/components/shared/create-modal';
import type { FormField } from '@/components/shared/create-modal';
import { ContextualSidebar } from '@/components/shared/contextual-sidebar';
import { FilterBar } from '@/components/shared/filter-bar';
import { SearchInput } from '@/components/shared/search-input';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';

// ── Action Feedback ────────────────────────────────────
import { useActionFeedback } from '@/hooks/use-action-feedback.tsx';

// ── ERP-specific dependencies ───────────────────────────
import { mockEmployees, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { Employee, EmployeeStatus } from '@/modules/erp/types';
import { BulkActionBar } from '@/modules/erp/components/ops/bulk-action-bar';

// ---- Helpers ----
type FilterKey = 'all' | 'active' | 'on-leave' | 'probation' | 'notice-period';
type ViewMode = 'table' | 'grid';

// Skills map from mockResources + defaults for missing employees
function buildSkillsMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const r of mockResources) {
    const emp = mockEmployees.find((e) => e.name === r.name);
    if (emp) {
      map[emp.id] = r.skills;
    }
  }
  const defaults: Record<string, string[]> = {
    e11: ['Negotiation', 'CRM', 'Salesforce', 'B2B Sales'],
    e12: ['Tally', 'Excel', 'GST Filing', 'Budgeting'],
    e13: ['Python', 'Spark', 'Airflow', 'SQL'],
    e14: ['Figma', 'Surveys', 'Analytics', 'A/B Testing'],
    e15: ['Lead Gen', 'Cold Calling', 'HubSpot', 'Negotiation'],
  };
  for (const [id, skills] of Object.entries(defaults)) {
    if (!map[id]) map[id] = skills;
  }
  return map;
}

const SKILLS_MAP = buildSkillsMap();

// Skill tag color variants
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  blue:   { bg: 'rgba(96, 165, 250, 0.15)', text: '#93bbfd' },
  green:  { bg: 'rgba(74, 222, 128, 0.15)',  text: '#86efac' },
  purple: { bg: 'rgba(167, 139, 250, 0.15)', text: '#c4b5fd' },
  orange: { bg: 'rgba(251, 146, 60, 0.15)',  text: '#fdba74' },
  teal:   { bg: 'rgba(45, 212, 191, 0.15)',  text: '#5eead4' },
  rose:   { bg: 'rgba(251, 113, 133, 0.15)', text: '#fda4af' },
  amber:  { bg: 'rgba(252, 211, 77, 0.15)',  text: '#fde68a' },
  cyan:   { bg: 'rgba(34, 211, 238, 0.15)',  text: '#67e8f9' },
};

function getTagColor(skill: string): { bg: string; text: string } {
  const keys = Object.keys(TAG_COLORS);
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[keys[Math.abs(hash) % keys.length]];
}

function getStatusDotColor(status: EmployeeStatus): string {
  switch (status) {
    case 'active': return '#34d399';
    case 'on-leave': return '#fbbf24';
    case 'probation': return '#fb923c';
    case 'notice-period': return '#f87171';
    case 'inactive': return '#6b7280';
    default: return '#6b7280';
  }
}

function getBarColor(score: number) {
  if (score >= 85) return '#34d399';
  if (score >= 70) return '#fbbf24';
  return '#f87171';
}

function getBarTextColor(score: number) {
<<<<<<< HEAD
  if (score >= 85) return CSS.success;
  if (score >= 70) return CSS.warning;
  return CSS.danger;
=======
  if (score >= 85) return 'var(--app-success)';
  if (score >= 70) return 'var(--app-warning)';
  return 'var(--app-danger)';
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
}

function formatStatusLabel(status: EmployeeStatus): string {
  const map: Record<string, string> = {
    active: 'Active',
    'on-leave': 'On Leave',
    'notice-period': 'Notice Period',
    inactive: 'Inactive',
    probation: 'Probation',
  };
  return map[status] || status;
}

// Skill tag pill component
function SkillTag({ skill }: { skill: string }) {
  const color = getTagColor(skill);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap leading-none"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {skill}
    </span>
  );
}

// ---- Create Modal Fields ----
const createFields: FormField[] = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter full name', required: true },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'name@company.com', required: true },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: '+91 XXXXX XXXXX', required: true },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    required: true,
    options: ['Engineering', 'Design', 'QA', 'Operations', 'HR', 'Sales', 'Finance'].map((d) => ({
      label: d,
      value: d,
    })),
  },
  { key: 'designation', label: 'Role / Designation', type: 'text', placeholder: 'e.g. Senior Developer', required: true },
  { key: 'joinDate', label: 'Joining Date', type: 'date', required: true },
  {
    key: 'salaryBand',
    label: 'Salary Band',
    type: 'select',
    required: true,
    options: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((b) => ({
      label: b,
      value: b,
    })),
  },
];

// ---- Main Component ----
function EmployeesPageInner() {
  // Store hooks for bulk selection
  const bulkSelectedIds = useErpStore((s) => s.bulkSelectedIds);
  const toggleBulkSelection = useErpStore((s) => s.toggleBulkSelection);
  const clearBulkSelection = useErpStore((s) => s.clearBulkSelection);

  // Action feedback hook
  const { success, error: showError, info, warning, loading: showLoadingToast } = useActionFeedback();

  // UX State: Loading
  const [isLoading, setIsLoading] = useState(true);

  // UX State: Error
  const [error, setError] = useState<string | null>(null);

  // UX State: Interaction (submitting for create modal)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Grid view pagination (SmartDataTable handles its own for table view)
  const [gridPage, setGridPage] = useState(0);
  const gridPageSize = 10;

  // Unique departments for filter
  const departments = useMemo(
    () => [...new Set(mockEmployees.map((e) => e.department))].sort(),
    [],
  );

  // Compute filtered data (status + department + search)
  const filtered = useMemo(() => {
    let result = [...mockEmployees];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q),
      );
    }
    switch (activeFilter) {
      case 'active':
        result = result.filter((e) => e.status === 'active');
        break;
      case 'on-leave':
        result = result.filter((e) => e.status === 'on-leave');
        break;
      case 'probation':
        result = result.filter((e) => e.status === 'probation');
        break;
      case 'notice-period':
        result = result.filter((e) => e.status === 'notice-period');
        break;
    }
    if (departmentFilter !== 'all') {
      result = result.filter((e) => e.department === departmentFilter);
    }
    return result;
  }, [searchQuery, activeFilter, departmentFilter]);

  // Reset grid page when filters change (render-time adjustment pattern)
  const [prevFilterKey, setPrevFilterKey] = useState('');
  const filterKey = `${searchQuery}|${activeFilter}|${departmentFilter}`;
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setGridPage(0);
  }

  // Grid view pagination
  const gridTotalPages = Math.max(1, Math.ceil(filtered.length / gridPageSize));
  const gridSafePage = Math.min(gridPage, gridTotalPages - 1);
  const gridPaged = filtered.slice(gridSafePage * gridPageSize, (gridSafePage + 1) * gridPageSize);

  // Stats
  const stats = useMemo(
    () => ({
      total: mockEmployees.length,
      active: mockEmployees.filter((e) => e.status === 'active').length,
      onLeave: mockEmployees.filter((e) => e.status === 'on-leave').length,
      avgProductivity: Math.round(
        mockEmployees.reduce((s, e) => s + e.productivityScore, 0) /
          mockEmployees.length,
      ),
    }),
    [],
  );

  // Filter bar items
  const filterItems = useMemo(
    () => [
      { key: 'all', label: 'All', count: mockEmployees.length },
      { key: 'active', label: 'Active', count: stats.active },
      { key: 'on-leave', label: 'On Leave', count: stats.onLeave },
      {
        key: 'probation',
        label: 'Probation',
        count: mockEmployees.filter((e) => e.status === 'probation').length,
      },
      {
        key: 'notice-period',
        label: 'Notice Period',
        count: mockEmployees.filter((e) => e.status === 'notice-period').length,
      },
    ],
    [stats],
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('all');
    setDepartmentFilter('all');
  }, []);

  const hasActiveFilters = searchQuery !== '' || activeFilter !== 'all' || departmentFilter !== 'all';

  // UX State: Empty — filtered results are empty while filters are active
  const isFilteredEmpty = filtered.length === 0 && hasActiveFilters;

<<<<<<< HEAD
  // ── Handlers with toast feedback ─────────────────────────────
  const handleCreate = useCallback(
    (data: Record<string, unknown>) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setIsSubmitting(true);
      showLoadingToast({ title: 'Creating Employee…' });

      setTimeout(() => {
        setIsSubmitting(false);
        submittingRef.current = false;
        success({
          title: 'Employee Created',
          message: `${data.name || 'New employee'} has been added successfully.`,
        });
        setCreateOpen(false);
      }, 700);
    },
    [showLoadingToast, success],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const handleSimulateError = useCallback(() => {
    showError({
      title: 'Connection Error',
      message: 'Failed to load employee data. Check your connection and try again.',
    });
    setError('Failed to load employee data. Please check your connection and try again.');
  }, [showError]);

  const handleEditFromSidebar = useCallback(() => {
    if (!selectedEmployee) return;
    info({
      title: 'Edit Mode',
      message: `Editing ${selectedEmployee.name}'s profile.`,
    });
  }, [selectedEmployee, info]);

  const handleDeactivateFromSidebar = useCallback(() => {
    if (!selectedEmployee) return;
    warning({
      title: 'Employee Deactivated',
      message: `${selectedEmployee.name} has been deactivated.`,
    });
    setSelectedEmployee(null);
  }, [selectedEmployee, warning]);

  const handleEditFromDropdown = useCallback(
    (emp: Employee) => {
      info({
        title: 'Edit Mode',
        message: `Editing ${emp.name}'s profile.`,
      });
      setSelectedEmployee(emp);
    },
    [info],
  );

  const handleDeactivateFromDropdown = useCallback(
    (emp: Employee) => {
      warning({
        title: 'Employee Deactivated',
        message: `${emp.name} has been deactivated.`,
      });
    },
    [warning],
  );

  const handleBulkAction = useCallback(
    (action: string) => {
      const count = bulkSelectedIds.length;
      success({
        title: 'Action Completed',
        message: `${action} applied to ${count} employee${count !== 1 ? 's' : ''}.`,
      });
      clearBulkSelection();
    },
    [bulkSelectedIds.length, success, clearBulkSelection],
  );

  // Cast filtered data for SmartDataTable
  const tableData = useMemo(
    () => filtered as unknown as Record<string, unknown>[],
    [filtered],
  );

  // ── SmartDataTable Columns ──────────────────────────────
  const columns: DataTableColumnDef[] = useMemo(
    () => [
      {
        key: 'checkbox',
        label: '',
        width: 40,
        render: (row) => {
          const emp = row as unknown as Employee;
          const isSelected = bulkSelectedIds.includes(emp.id);
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleBulkSelection(emp.id)}
                className="rounded cursor-pointer"
                style={{ accentColor: CSS.accent }}
              />
            </div>
          );
        },
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as Employee;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: CSS.accentLight,
                    color: CSS.accent,
=======
  // ---- Render ----
  return (
    <>
    <PageShell title="Employees" icon={Users} createType="employee">
      <div className="space-y-app-xl">
        {/* ---- Filters & Search ---- */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <FilterBar
              filters={filterItems}
              activeFilter={activeFilter}
              onFilterChange={(key) => setActiveFilter(key as FilterKey)}
            />
            <div className="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:w-56">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search employees..."
                />
              </div>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--app-radius-lg)] text-xs font-medium shrink-0 transition-colors"
                  style={{
                    color: 'var(--app-danger)',
                    backgroundColor: 'rgba(248, 113, 113, 0.08)',
                    border: '1px solid rgba(248, 113, 113, 0.15)',
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  }}
                >
<<<<<<< HEAD
                  {emp.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: CSS.text }}>
                  {emp.name}
                </p>
                <p className="text-xs truncate" style={{ color: CSS.textMuted }}>
                  {emp.designation}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        key: 'skills',
        label: 'Skills',
        render: (row) => {
          const emp = row as unknown as Employee;
          const skills = SKILLS_MAP[emp.id] || [];
          return (
            <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
              {skills.slice(0, 3).map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
              {skills.length > 3 && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: CSS.hoverBg,
                    color: CSS.textMuted,
                  }}
                >
                  +{skills.length - 3}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as Employee;
          return (
            <span className="text-sm truncate block max-w-[200px]" style={{ color: CSS.textSecondary }}>
              {emp.email}
            </span>
          );
        },
      },
      {
        key: 'department',
        label: 'Department',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as Employee;
          return (
            <span className="text-sm" style={{ color: CSS.textSecondary }}>
              {emp.department}
            </span>
          );
        },
      },
      {
        key: 'designation',
        label: 'Role',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as Employee;
          return (
            <span className="text-sm" style={{ color: CSS.textSecondary }}>
              {emp.designation}
            </span>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as Employee;
          return <StatusBadge status={formatStatusLabel(emp.status)} variant="pill" />;
        },
      },
    ],
    [bulkSelectedIds, toggleBulkSelection],
  );

  // Actions dropdown renderer for SmartDataTable (with toast feedback)
  const renderActions = useCallback(
    (row: Record<string, unknown>) => {
      const emp = row as unknown as Employee;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
              style={{ color: CSS.textMuted }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              backgroundColor: CSS.cardBg,
              borderColor: CSS.border,
            }}
          >
            <DropdownMenuItem onClick={() => setSelectedEmployee(emp)}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditFromDropdown(emp)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{ color: '#f87171' }}
              onClick={() => handleDeactivateFromDropdown(emp)}
            >
              <UserX className="w-4 h-4 mr-2" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [handleEditFromDropdown, handleDeactivateFromDropdown],
  );

  // ── Render ─────────────────────────────────────────────
  return (
    <>
      <PageShell
        title="Employees"
        icon={Users}
        onCreate={() => setCreateOpen(true)}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
        isEmpty={isFilteredEmpty}
        emptyTitle="No results found"
        emptyDescription="Try adjusting your search or filter criteria to find what you're looking for."
        headerRight={
          <button
            onClick={handleSimulateError}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              color: CSS.textMuted,
              backgroundColor: CSS.hoverBg,
              border: `1px solid ${CSS.border}`,
            }}
            title="Simulate error state for demo"
          >
            <Bug className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate Error</span>
          </button>
        }
      >
        <div className="space-y-5">
          {/* ── Filters & Search ─────────────────────────── */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <FilterBar
                filters={filterItems}
                activeFilter={activeFilter}
                onFilterChange={(key) => setActiveFilter(key as FilterKey)}
              />
              <div className="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:w-56">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search employees..."
                  />
=======
                  <FilterX className="w-4 h-4" />
                  Clear All
                </motion.button>
              )}
            </div>
          </div>
          {/* Department filter row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: 'var(--app-text-muted)' }} />
              <Select
                value={departmentFilter}
                onValueChange={(v) => setDepartmentFilter(v)}
              >
                <SelectTrigger
                  className="app-input w-[180px] h-8 text-xs"
                  style={{
                    backgroundColor: 'var(--app-elevated)',
                    border: '1px solid var(--app-border)',
                    color: departmentFilter !== 'all' ? 'var(--app-text)' : 'var(--app-text-muted)',
                  }}
                >
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--app-card-bg)',
                    borderColor: 'var(--app-border)',
                  }}
                >
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* View mode toggle */}
            <div className="sm:ml-auto flex items-center gap-1 p-0.5 rounded-[var(--app-radius-lg)]" style={{ backgroundColor: 'var(--app-hover-bg)' }}>
              <button
                onClick={() => setViewMode('table')}
                className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-md)] transition-colors"
                style={{
                  backgroundColor: viewMode === 'table' ? 'var(--app-hover-bg)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--app-text)' : 'var(--app-text-muted)',
                }}
                title="Table view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-md)] transition-colors"
                style={{
                  backgroundColor: viewMode === 'grid' ? 'var(--app-hover-bg)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--app-text)' : 'var(--app-text-muted)',
                }}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ---- Stats Row ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Employees',
              value: stats.total,
              icon: Users,
              color: 'var(--app-text)',
            },
            {
              label: 'Active',
              value: stats.active,
              icon: UserCheck,
              color: 'var(--app-success)',
            },
            {
              label: 'On Leave',
              value: stats.onLeave,
              icon: Clock,
              color: 'var(--app-warning)',
            },
            {
              label: 'Avg Productivity',
              value: `${stats.avgProductivity}%`,
              icon: AlertTriangle,
              color: 'var(--app-info)',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <OpsCard hoverable className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--app-text-muted)' }}
                  >
                    {stat.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center"
                    style={{ backgroundColor: 'var(--app-hover-bg)' }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </OpsCard>
            </motion.div>
          ))}
        </div>

        {/* ---- Data Table or Grid View ---- */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table-view"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="app-card overflow-hidden !p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--app-border)' }}>
                        {/* Checkbox column */}
                        <th className="w-10 px-3 py-3">
                          <input
                            type="checkbox"
                            checked={allPageSelected}
                            onChange={handleToggleAll}
                            className="rounded border-gray-600 cursor-pointer"
                            style={{ accentColor: 'var(--app-accent)' }}
                          />
                        </th>
                        {/* Name */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                          style={{ color: 'var(--app-text-muted)' }}
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1.5">
                            Name
                            <ArrowUpDown
                              className="w-4 h-4"
                              style={{ opacity: sortKey === 'name' ? 1 : 0.3, color: 'var(--app-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Skills */}
                        <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--app-text-muted)' }}>
                          Skills
                        </th>
                        {/* Email */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden md:table-cell"
                          style={{ color: 'var(--app-text-muted)' }}
                          onClick={() => handleSort('email')}
                        >
                          <div className="flex items-center gap-1.5">
                            Email
                            <ArrowUpDown
                              className="w-4 h-4"
                              style={{ opacity: sortKey === 'email' ? 1 : 0.3, color: 'var(--app-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Department */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden md:table-cell"
                          style={{ color: 'var(--app-text-muted)' }}
                          onClick={() => handleSort('department')}
                        >
                          <div className="flex items-center gap-1.5">
                            Department
                            <ArrowUpDown
                              className="w-4 h-4"
                              style={{ opacity: sortKey === 'department' ? 1 : 0.3, color: 'var(--app-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Role */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden lg:table-cell"
                          style={{ color: 'var(--app-text-muted)' }}
                          onClick={() => handleSort('designation')}
                        >
                          <div className="flex items-center gap-1.5">
                            Role
                            <ArrowUpDown
                              className="w-4 h-4"
                              style={{ opacity: sortKey === 'designation' ? 1 : 0.3, color: 'var(--app-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Status */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                          style={{ color: 'var(--app-text-muted)' }}
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-1.5">
                            Status
                            <ArrowUpDown
                              className="w-4 h-4"
                              style={{ opacity: sortKey === 'status' ? 1 : 0.3, color: 'var(--app-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Actions */}
                        <th className="w-10 px-3 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {paged.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="h-32 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                            No employees found. Try adjusting your search or filters.
                          </td>
                        </tr>
                      ) : (
                        paged.map((emp) => {
                          const skills = SKILLS_MAP[emp.id] || [];
                          const isEditing = editingId === emp.id;
                          const isSelected = bulkSelectedIds.includes(emp.id);

                          return (
                            <tr
                              key={emp.id}
                              className="border-b transition-colors"
                              style={{
                                borderColor: 'var(--app-border)',
                                cursor: 'pointer',
                                backgroundColor: isSelected
                                  ? 'var(--app-active-bg)'
                                  : 'transparent',
                              }}
                              onClick={() => selectEmployee(emp.id)}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  (e.currentTarget as HTMLElement).style.backgroundColor =
                                    'var(--app-hover-bg)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor =
                                  isSelected ? 'var(--app-active-bg)' : 'transparent';
                              }}
                            >
                              {/* Checkbox */}
                              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleBulkSelection(emp.id)}
                                  className="rounded border-gray-600 cursor-pointer"
                                  style={{ accentColor: 'var(--app-accent)' }}
                                />
                              </td>
                              {/* Name — inline editable */}
                              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      ref={editInputRef}
                                      type="text"
                                      value={editingName}
                                      onChange={(e) => setEditingName(e.target.value)}
                                      onBlur={saveInlineEdit}
                                      onKeyDown={handleInlineKeyDown}
                                      className="text-sm font-medium px-2 py-1 rounded-[var(--app-radius-md)] w-full max-w-[200px]"
                                      style={{
                                        backgroundColor: 'var(--app-hover-bg)',
                                        border: '1px solid var(--app-accent)',
                                        color: 'var(--app-text)',
                                        outline: 'none',
                                      }}
                                    />
                                    <button
                                      onClick={saveInlineEdit}
                                      className="flex items-center justify-center w-6 h-6 rounded"
                                      style={{ backgroundColor: 'var(--app-success)', color: '#fff' }}
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    className="flex items-center gap-3 cursor-text"
                                    onDoubleClick={() => handleDoubleClickName(emp)}
                                  >
                                    <Avatar className="h-8 w-8 shrink-0">
                                      <AvatarFallback
                                        className="text-xs font-semibold"
                                        style={{
                                          backgroundColor: 'var(--app-accent-light)',
                                          color: 'var(--app-accent)',
                                        }}
                                      >
                                        {emp.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <p
                                        className="text-sm font-medium truncate"
                                        style={{ color: 'var(--app-text)' }}
                                        title="Double-click to edit"
                                      >
                                        {emp.name}
                                      </p>
                                      <p
                                        className="text-xs truncate"
                                        style={{ color: 'var(--app-text-muted)' }}
                                      >
                                        {emp.designation}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </td>
                              {/* Skills */}
                              <td className="px-3 py-3 hidden lg:table-cell">
                                <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
                                  {skills.slice(0, 3).map((skill) => (
                                    <SkillTag key={skill} skill={skill} />
                                  ))}
                                  {skills.length > 3 && (
                                    <span
                                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: 'var(--app-hover-bg)',
                                        color: 'var(--app-text-muted)',
                                      }}
                                    >
                                      +{skills.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>
                              {/* Email */}
                              <td className="px-3 py-3 hidden md:table-cell">
                                <span className="text-sm truncate block max-w-[200px]" style={{ color: 'var(--app-text-secondary)' }}>
                                  {emp.email}
                                </span>
                              </td>
                              {/* Department */}
                              <td className="px-3 py-3 hidden md:table-cell">
                                <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                                  {emp.department}
                                </span>
                              </td>
                              {/* Role */}
                              <td className="px-3 py-3 hidden lg:table-cell">
                                <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                                  {emp.designation}
                                </span>
                              </td>
                              {/* Status */}
                              <td className="px-3 py-3">
                                <StatusBadge status={formatStatusLabel(emp.status)} variant="pill" />
                              </td>
                              {/* Actions */}
                              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] transition-colors"
                                      style={{ color: 'var(--app-text-muted)' }}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--app-hover-bg)';
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                      }}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    style={{
                                      backgroundColor: 'var(--app-card-bg)',
                                      borderColor: 'var(--app-border)',
                                    }}
                                  >
                                    <DropdownMenuItem onClick={() => selectEmployee(emp.id)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Pencil className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem style={{ color: '#f87171' }}>
                                      <UserX className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                </div>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-colors"
                    style={{
                      color: CSS.danger,
                      backgroundColor: 'rgba(248, 113, 113, 0.08)',
                      border: '1px solid rgba(248, 113, 113, 0.15)',
                    }}
                    title="Clear all filters"
                  >
                    <FilterX className="w-3.5 h-3.5" />
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>

            {/* Department filter row + View mode toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" style={{ color: CSS.textMuted }} />
                <Select
                  value={departmentFilter}
                  onValueChange={(v) => setDepartmentFilter(v)}
                >
                  <SelectTrigger
                    className="w-[180px] h-8 text-xs rounded-lg"
                    style={{
                      backgroundColor: CSS.elevated,
                      border: `1px solid ${CSS.border}`,
                      color: departmentFilter !== 'all' ? CSS.text : CSS.textMuted,
                    }}
                  >
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: CSS.cardBg,
                      borderColor: CSS.border,
                    }}
                  >
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

<<<<<<< HEAD
              {/* View mode toggle */}
              <div
                className="sm:ml-auto flex items-center gap-1 p-0.5 rounded-lg"
                style={{ backgroundColor: CSS.hoverBg }}
              >
                <button
                  onClick={() => setViewMode('table')}
                  className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                  style={{
                    backgroundColor: viewMode === 'table' ? CSS.hoverBg : 'transparent',
                    color: viewMode === 'table' ? CSS.text : CSS.textMuted,
=======
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 mt-3">
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} of {sorted.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--app-text-secondary)' }}
                      onClick={() => setPage(Math.max(0, safePage - 1))}
                      disabled={safePage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs px-2" style={{ color: 'var(--app-text-secondary)' }}>
                      {safePage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--app-text-secondary)' }}
                      onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
                      disabled={safePage >= totalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* ---- Grid View ---- */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {paged.length === 0 ? (
                <div className="app-card p-app-4xl text-center">
                  <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--app-text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    No employees found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paged.map((emp, idx) => {
                    const skills = SKILLS_MAP[emp.id] || [];
                    const isSelected = bulkSelectedIds.includes(emp.id);
                    return (
                      <motion.div
                        key={emp.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.25 }}
                      >
                        <div
                          className="app-card app-glow p-app-xl cursor-pointer transition-colors"
                          style={{
                            border: isSelected ? '1px solid var(--app-accent)' : undefined,
                            backgroundColor: isSelected
                              ? 'rgba(204, 92, 55, 0.04)'
                              : undefined,
                          }}
                          onClick={() => selectEmployee(emp.id)}
                        >
                          {/* Top row: avatar + status + checkbox */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback
                                    className="text-sm font-bold"
                                    style={{
                                      backgroundColor: 'var(--app-accent-light)',
                                      color: 'var(--app-accent)',
                                    }}
                                  >
                                    {emp.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                {/* Status dot */}
                                <span
                                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                                  style={{
                                    backgroundColor: getStatusDotColor(emp.status),
                                    borderColor: 'var(--app-card-bg)',
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ color: 'var(--app-text)' }}
                                >
                                  {emp.name}
                                </p>
                                <p
                                  className="text-xs truncate"
                                  style={{ color: 'var(--app-text-muted)' }}
                                >
                                  {emp.designation}
                                </p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleBulkSelection(emp.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-gray-600 cursor-pointer mt-1"
                              style={{ accentColor: 'var(--app-accent)' }}
                            />
                          </div>

                          {/* Department */}
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="text-xs font-medium"
                              style={{ color: 'var(--app-text-secondary)' }}
                            >
                              {emp.department}
                            </span>
                            <span
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: 'var(--app-text-muted)' }}
                            />
                            <StatusBadge status={formatStatusLabel(emp.status)} variant="pill" />
                          </div>

                          {/* Skills */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {skills.slice(0, 3).map((skill) => (
                              <SkillTag key={skill} skill={skill} />
                            ))}
                          </div>

                          {/* Bottom row: projects + productivity */}
                          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--app-border)' }}>
                            <div className="flex items-center gap-1.5">
                              <FolderKanban className="w-4 h-4" style={{ color: 'var(--app-accent)' }} />
                              <span className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                                {emp.activeProjects} Projects
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'var(--app-hover-bg)', width: '60px' }}
                              >
                                <div
                                  className="h-full rounded-full transition-colors"
                                  style={{
                                    width: `${emp.productivityScore}%`,
                                    backgroundColor: getBarColor(emp.productivityScore),
                                  }}
                                />
                              </div>
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: getBarColor(emp.productivityScore) }}
                              >
                                {emp.productivityScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Grid pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 mt-3">
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} of {sorted.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--app-text-secondary)' }}
                      onClick={() => setPage(Math.max(0, safePage - 1))}
                      disabled={safePage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs px-2" style={{ color: 'var(--app-text-secondary)' }}>
                      {safePage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--app-text-secondary)' }}
                      onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
                      disabled={safePage >= totalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Add Employee Drawer ---- */}
        <DrawerForm
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Add Employee"
          onSubmit={handleDrawerSubmit}
          submitLabel="Add Employee"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Full Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter full name"
                className="app-input"
                style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@company.com"
                className="app-input"
                style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="app-input"
                style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger
                  className="app-input"
                  style={{
                    backgroundColor: 'var(--app-elevated)',
                    border: '1px solid var(--app-border)',
                    color: formData.department ? 'var(--app-text)' : 'var(--app-text-muted)',
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  }}
                  title="Table view"
                >
<<<<<<< HEAD
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                  style={{
                    backgroundColor: viewMode === 'grid' ? CSS.hoverBg : 'transparent',
                    color: viewMode === 'grid' ? CSS.text : CSS.textMuted,
=======
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--app-border)' }}>
                  {['Engineering', 'Design', 'QA', 'Operations', 'HR', 'Sales', 'Finance'].map(
                    (dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Role / Designation
              </Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData((f) => ({ ...f, designation: e.target.value }))}
                placeholder="e.g. Senior Developer"
                className="app-input"
                style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Joining Date
              </Label>
              <Input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData((f) => ({ ...f, joinDate: e.target.value }))}
                className="app-input"
                style={{ backgroundColor: 'var(--app-elevated)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                Salary Band
              </Label>
              <Select
                value={formData.salaryBand}
                onValueChange={(v) => setFormData((f) => ({ ...f, salaryBand: v }))}
              >
                <SelectTrigger
                  className="app-input"
                  style={{
                    backgroundColor: 'var(--app-elevated)',
                    border: '1px solid var(--app-border)',
                    color: formData.salaryBand ? 'var(--app-text)' : 'var(--app-text-muted)',
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
                  }}
                  title="Grid view"
                >
<<<<<<< HEAD
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
=======
                  <SelectValue placeholder="Select salary band" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--app-border)' }}>
                  {['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((band) => (
                    <SelectItem key={band} value={band}>{band}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
>>>>>>> 900ed12021c4109885cf9541dbb4abde29107041
            </div>
          </div>

          {/* ── KPI Stats ────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiWidget
              label="Total Employees"
              value={stats.total}
              icon={Users}
              color="accent"
            />
            <KpiWidget
              label="Active"
              value={stats.active}
              icon={UserCheck}
              color="success"
            />
            <KpiWidget
              label="On Leave"
              value={stats.onLeave}
              icon={Clock}
              color="warning"
            />
            <KpiWidget
              label="Avg Productivity"
              value={`${stats.avgProductivity}%`}
              icon={AlertTriangle}
              color="info"
            />
          </div>

          {/* ── Table View or Grid View ──────────────────── */}
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div
                key="table-view"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <SmartDataTable
                  data={tableData}
                  columns={columns}
                  onRowClick={(row) => setSelectedEmployee(row as unknown as Employee)}
                  searchable={false}
                  selectable={false}
                  actions={renderActions}
                  pageSize={10}
                  loading={isLoading}
                  emptyMessage="No employees found. Try adjusting your search or filters."
                />
              </motion.div>
            ) : (
              /* ── Grid View ──────────────────────────────── */
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {gridPaged.length === 0 ? (
                  <div
                    className="p-12 text-center rounded-2xl"
                    style={{
                      backgroundColor: CSS.cardBg,
                      border: `1px solid ${CSS.border}`,
                    }}
                  >
                    <Users className="w-10 h-10 mx-auto mb-3" style={{ color: CSS.textMuted }} />
                    <p className="text-sm" style={{ color: CSS.textMuted }}>
                      No employees found. Try adjusting your search or filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gridPaged.map((emp, idx) => {
                      const skills = SKILLS_MAP[emp.id] || [];
                      const isSelected = bulkSelectedIds.includes(emp.id);
                      return (
                        <motion.div
                          key={emp.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.25 }}
                        >
                          <div
                            className="p-5 cursor-pointer transition-all rounded-2xl"
                            style={{
                              backgroundColor: CSS.cardBg,
                              border: isSelected
                                ? `1px solid ${CSS.accent}`
                                : `1px solid ${CSS.border}`,
                              boxShadow: isSelected ? CSS.shadowCardHover : CSS.shadowCard,
                            }}
                            onClick={() => setSelectedEmployee(emp)}
                          >
                            {/* Top row: avatar + status + checkbox */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback
                                      className="text-sm font-bold"
                                      style={{
                                        backgroundColor: CSS.accentLight,
                                        color: CSS.accent,
                                      }}
                                    >
                                      {emp.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  {/* Status dot */}
                                  <span
                                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                                    style={{
                                      backgroundColor: getStatusDotColor(emp.status),
                                      borderColor: CSS.cardBg,
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: CSS.text }}
                                  >
                                    {emp.name}
                                  </p>
                                  <p
                                    className="text-xs truncate"
                                    style={{ color: CSS.textMuted }}
                                  >
                                    {emp.designation}
                                  </p>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleBulkSelection(emp.id);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded cursor-pointer mt-1"
                                style={{ accentColor: CSS.accent }}
                              />
                            </div>

                            {/* Department */}
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className="text-xs font-medium"
                                style={{ color: CSS.textSecondary }}
                              >
                                {emp.department}
                              </span>
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: CSS.textMuted }}
                              />
                              <StatusBadge status={formatStatusLabel(emp.status)} variant="pill" />
                            </div>

                            {/* Skills */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-4">
                              {skills.slice(0, 3).map((skill) => (
                                <SkillTag key={skill} skill={skill} />
                              ))}
                            </div>

                            {/* Bottom row: projects + productivity */}
                            <div
                              className="flex items-center justify-between pt-3"
                              style={{ borderTop: `1px solid ${CSS.border}` }}
                            >
                              <div className="flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5" style={{ color: CSS.accent }} />
                                <span className="text-xs font-medium" style={{ color: CSS.textSecondary }}>
                                  {emp.activeProjects} Projects
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-1.5 rounded-full overflow-hidden"
                                  style={{ backgroundColor: CSS.hoverBg, width: '60px' }}
                                >
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${emp.productivityScore}%`,
                                      backgroundColor: getBarColor(emp.productivityScore),
                                    }}
                                  />
                                </div>
                                <span
                                  className="text-[10px] font-bold"
                                  style={{ color: getBarColor(emp.productivityScore) }}
                                >
                                  {emp.productivityScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Grid pagination */}
                {gridTotalPages > 1 && (
                  <div className="flex items-center justify-between px-1 mt-3">
                    <p className="text-xs" style={{ color: CSS.textMuted }}>
                      Showing {gridSafePage * gridPageSize + 1}–{Math.min((gridSafePage + 1) * gridPageSize, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        style={{ color: CSS.textSecondary }}
                        onClick={() => setGridPage(Math.max(0, gridSafePage - 1))}
                        disabled={gridSafePage === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs px-2" style={{ color: CSS.textSecondary }}>
                        {gridSafePage + 1} / {gridTotalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        style={{ color: CSS.textSecondary }}
                        onClick={() => setGridPage(Math.min(gridTotalPages - 1, gridSafePage + 1))}
                        disabled={gridSafePage >= gridTotalPages - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageShell>

      {/* ── Create Modal ─────────────────────────────────── */}
      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Employee"
        description="Create a new employee record"
        fields={createFields}
        icon={Users}
        submitLabel="Add Employee"
        onSubmit={handleCreate}
        submitting={isSubmitting}
      />

      {/* ── Contextual Sidebar ───────────────────────────── */}
      <ContextualSidebar
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee?.name}
        subtitle="Employee"
        icon={Users}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 text-[13px] rounded-xl"
              style={{
                borderColor: CSS.border,
                color: CSS.text,
              }}
              onClick={handleEditFromSidebar}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-[13px] rounded-xl"
              style={{
                borderColor: 'rgba(248, 113, 113, 0.3)',
                color: '#f87171',
              }}
              onClick={handleDeactivateFromSidebar}
            >
              <UserX className="w-4 h-4 mr-2" />
              Deactivate
            </Button>
          </div>
        }
      >
        {selectedEmployee && (
          <div className="space-y-5">
            {/* Avatar + Status */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14">
                  <AvatarFallback
                    className="text-base font-bold"
                    style={{
                      backgroundColor: CSS.accentLight,
                      color: CSS.accent,
                    }}
                  >
                    {selectedEmployee.avatar}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: getStatusDotColor(selectedEmployee.status),
                    borderColor: CSS.bg,
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: CSS.text }}>
                  {selectedEmployee.name}
                </p>
                <p className="text-xs" style={{ color: CSS.textMuted }}>
                  {selectedEmployee.designation}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                Contact
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <Mail className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Email</p>
                    <p className="text-xs truncate" style={{ color: CSS.text }}>
                      {selectedEmployee.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <Phone className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Phone</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                Work
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <Building2 className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Department</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <Briefcase className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Role</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.designation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <UserCircle className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Manager</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.manager}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <DollarSign className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Salary Band</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.salaryBand}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CSS.hoverBg }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: CSS.textMuted }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: CSS.textMuted }}>Join Date</p>
                    <p className="text-xs" style={{ color: CSS.text }}>
                      {selectedEmployee.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                Status
              </h3>
              <StatusBadge status={formatStatusLabel(selectedEmployee.status)} variant="pill" />
            </div>

            {/* Skills */}
            {(() => {
              const skills = SKILLS_MAP[selectedEmployee.id] || [];
              if (skills.length === 0) return null;
              return (
                <div className="space-y-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                    Skills
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Productivity Score */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CSS.textMuted }}>
                Productivity
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: CSS.hoverBg }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${selectedEmployee.productivityScore}%`,
                      backgroundColor: getBarColor(selectedEmployee.productivityScore),
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold min-w-[42px] text-right"
                  style={{ color: getBarTextColor(selectedEmployee.productivityScore) }}
                >
                  {selectedEmployee.productivityScore}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <FolderKanban className="w-3.5 h-3.5" style={{ color: CSS.accent }} />
                <span className="text-xs" style={{ color: CSS.textSecondary }}>
                  {selectedEmployee.activeProjects} active projects
                </span>
              </div>
            </div>
          </div>
        )}
      </ContextualSidebar>

      {/* ── Bulk Action Bar ──────────────────────────────── */}
      <BulkActionBar
        selectedCount={bulkSelectedIds.length}
        onClear={clearBulkSelection}
        actions={[
          {
            label: 'Assign Department',
            icon: Building2,
            onClick: () => handleBulkAction('Assign Department'),
          },
          {
            label: 'Change Status',
            icon: UserCheck,
            onClick: () => handleBulkAction('Change Status'),
          },
          {
            label: 'Delete',
            icon: UserX,
            onClick: () => handleBulkAction('Delete'),
            variant: 'danger',
          },
        ]}
      />
    </>
  );
}

export default memo(EmployeesPageInner);
