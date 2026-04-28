'use client';

import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, Clock, AlertTriangle, Plus, MoreHorizontal,
  Mail, Phone, Briefcase, UserCircle, Calendar, DollarSign,
  Eye, Pencil, UserX, Search, LayoutGrid, LayoutList,
  FolderKanban, Building2, FilterX, X, Check, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { mockEmployees, mockResources } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { Employee, EmployeeStatus } from '@/modules/erp/types';
import { FilterBar } from '@/modules/erp/components/ops/filter-bar';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import { DrawerForm } from '@/modules/erp/components/ops/drawer-form';
import { OpsCard } from '@/modules/erp/components/ops/ops-card';
import { BulkActionBar } from '@/modules/erp/components/ops/bulk-action-bar';
import {
  ArrowUpDown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { PageShell } from './components/ops/page-shell';

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
  // Defaults for employees not in resources
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

// Skill tag color variants — semi-transparent backgrounds
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

// Deterministic color for a skill name
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
  if (score >= 85) return 'var(--ops-success)';
  if (score >= 70) return 'var(--ops-warning)';
  return 'var(--ops-danger)';
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

// ---- Main Component ----
function EmployeesPageInner() {
  const selectEmployee = useErpStore((s) => s.selectEmployee);
  const bulkSelectedIds = useErpStore((s) => s.bulkSelectedIds);
  const toggleBulkSelection = useErpStore((s) => s.toggleBulkSelection);
  const clearBulkSelection = useErpStore((s) => s.clearBulkSelection);
  const selectAllBulk = useErpStore((s) => s.selectAllBulk);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '',
    designation: '', joinDate: '', salaryBand: '',
  });

  // Inline edit state: track which employee ID is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus inline edit input
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Sort
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  // Unique departments for filter
  const departments = useMemo(
    () => [...new Set(mockEmployees.map((e) => e.department))].sort(),
    [],
  );

  // Compute filtered data
  const filtered = useMemo(() => {
    let result = [...mockEmployees];
    // Search
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
    // Status filter
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
    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter((e) => e.department === departmentFilter);
    }
    return result;
  }, [searchQuery, activeFilter, departmentFilter]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey];
      const bVal = (b as unknown as Record<string, unknown>)[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [searchQuery, activeFilter, departmentFilter]);

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

  // Select all on current page
  const allPageSelected =
    paged.length > 0 && paged.every((e) => bulkSelectedIds.includes(e.id));

  const handleToggleAll = useCallback(() => {
    if (allPageSelected) {
      // Deselect all on current page
      const pageIds = paged.map((e) => e.id);
      for (const id of pageIds) {
        if (bulkSelectedIds.includes(id)) {
          toggleBulkSelection(id);
        }
      }
    } else {
      selectAllBulk(paged.map((e) => e.id));
    }
  }, [allPageSelected, paged, bulkSelectedIds, toggleBulkSelection, selectAllBulk]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null); }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  }, [sortKey, sortDir]);

  // Inline edit handlers
  const handleDoubleClickName = useCallback((emp: Employee) => {
    setEditingId(emp.id);
    setEditingName(emp.name);
  }, []);

  const saveInlineEdit = useCallback(() => {
    setEditingId(null);
    setEditingName('');
  }, []);

  const handleInlineKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveInlineEdit();
    if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
  }, [saveInlineEdit]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('all');
    setDepartmentFilter('all');
    setPage(0);
  }, []);

  const hasActiveFilters = searchQuery !== '' || activeFilter !== 'all' || departmentFilter !== 'all';

  const handleDrawerSubmit = () => {
    setDrawerOpen(false);
    setFormData({
      name: '', email: '', phone: '', department: '',
      designation: '', joinDate: '', salaryBand: '',
    });
  };

  // ---- Render ----
  return (
    <>
    <PageShell title="Employees" icon={Users} createType="employee">
      <div className="space-y-5">
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-colors"
                  style={{
                    color: 'var(--ops-danger)',
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
          {/* Department filter row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: 'var(--ops-text-muted)' }} />
              <Select
                value={departmentFilter}
                onValueChange={(v) => setDepartmentFilter(v)}
              >
                <SelectTrigger
                  className="ops-input w-[180px] h-8 text-xs"
                  style={{
                    backgroundColor: '#2a2b2e',
                    border: '1px solid var(--ops-border)',
                    color: departmentFilter !== 'all' ? 'var(--ops-text)' : 'var(--ops-text-muted)',
                  }}
                >
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--ops-card-bg)',
                    borderColor: 'var(--ops-border)',
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
            <div className="sm:ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <button
                onClick={() => setViewMode('table')}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                style={{
                  backgroundColor: viewMode === 'table' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--ops-text)' : 'var(--ops-text-muted)',
                }}
                title="Table view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
                style={{
                  backgroundColor: viewMode === 'grid' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--ops-text)' : 'var(--ops-text-muted)',
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
              color: 'var(--ops-text)',
            },
            {
              label: 'Active',
              value: stats.active,
              icon: UserCheck,
              color: 'var(--ops-success)',
            },
            {
              label: 'On Leave',
              value: stats.onLeave,
              icon: Clock,
              color: 'var(--ops-warning)',
            },
            {
              label: 'Avg Productivity',
              value: `${stats.avgProductivity}%`,
              icon: AlertTriangle,
              color: 'var(--ops-info)',
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
                    style={{ color: 'var(--ops-text-muted)' }}
                  >
                    {stat.label}
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
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
              <div className="ops-card overflow-hidden !p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--ops-border)' }}>
                        {/* Checkbox column */}
                        <th className="w-10 px-3 py-3">
                          <input
                            type="checkbox"
                            checked={allPageSelected}
                            onChange={handleToggleAll}
                            className="rounded border-gray-600 cursor-pointer"
                            style={{ accentColor: 'var(--ops-accent)' }}
                          />
                        </th>
                        {/* Name */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                          style={{ color: 'var(--ops-text-muted)' }}
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1.5">
                            Name
                            <ArrowUpDown
                              className="w-3.5 h-3.5"
                              style={{ opacity: sortKey === 'name' ? 1 : 0.3, color: 'var(--ops-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Skills */}
                        <th className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--ops-text-muted)' }}>
                          Skills
                        </th>
                        {/* Email */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden md:table-cell"
                          style={{ color: 'var(--ops-text-muted)' }}
                          onClick={() => handleSort('email')}
                        >
                          <div className="flex items-center gap-1.5">
                            Email
                            <ArrowUpDown
                              className="w-3.5 h-3.5"
                              style={{ opacity: sortKey === 'email' ? 1 : 0.3, color: 'var(--ops-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Department */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden md:table-cell"
                          style={{ color: 'var(--ops-text-muted)' }}
                          onClick={() => handleSort('department')}
                        >
                          <div className="flex items-center gap-1.5">
                            Department
                            <ArrowUpDown
                              className="w-3.5 h-3.5"
                              style={{ opacity: sortKey === 'department' ? 1 : 0.3, color: 'var(--ops-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Role */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none hidden lg:table-cell"
                          style={{ color: 'var(--ops-text-muted)' }}
                          onClick={() => handleSort('designation')}
                        >
                          <div className="flex items-center gap-1.5">
                            Role
                            <ArrowUpDown
                              className="w-3.5 h-3.5"
                              style={{ opacity: sortKey === 'designation' ? 1 : 0.3, color: 'var(--ops-text-muted)' }}
                            />
                          </div>
                        </th>
                        {/* Status */}
                        <th
                          className="text-left px-3 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none"
                          style={{ color: 'var(--ops-text-muted)' }}
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-1.5">
                            Status
                            <ArrowUpDown
                              className="w-3.5 h-3.5"
                              style={{ opacity: sortKey === 'status' ? 1 : 0.3, color: 'var(--ops-text-muted)' }}
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
                          <td colSpan={8} className="h-32 text-center text-sm" style={{ color: 'var(--ops-text-muted)' }}>
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
                                borderColor: 'var(--ops-border)',
                                cursor: 'pointer',
                                backgroundColor: isSelected
                                  ? 'rgba(204, 92, 55, 0.06)'
                                  : 'transparent',
                              }}
                              onClick={() => selectEmployee(emp.id)}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  (e.currentTarget as HTMLElement).style.backgroundColor =
                                    'rgba(255,255,255,0.02)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor =
                                  isSelected ? 'rgba(204, 92, 55, 0.06)' : 'transparent';
                              }}
                            >
                              {/* Checkbox */}
                              <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleBulkSelection(emp.id)}
                                  className="rounded border-gray-600 cursor-pointer"
                                  style={{ accentColor: 'var(--ops-accent)' }}
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
                                      className="text-sm font-medium px-2 py-1 rounded-md w-full max-w-[200px]"
                                      style={{
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        border: '1px solid var(--ops-accent)',
                                        color: 'var(--ops-text)',
                                        outline: 'none',
                                      }}
                                    />
                                    <button
                                      onClick={saveInlineEdit}
                                      className="flex items-center justify-center w-6 h-6 rounded"
                                      style={{ backgroundColor: 'var(--ops-success)', color: '#fff' }}
                                    >
                                      <Check className="w-3.5 h-3.5" />
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
                                          backgroundColor: 'var(--ops-accent-light)',
                                          color: 'var(--ops-accent)',
                                        }}
                                      >
                                        {emp.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <p
                                        className="text-sm font-medium truncate"
                                        style={{ color: 'var(--ops-text)' }}
                                        title="Double-click to edit"
                                      >
                                        {emp.name}
                                      </p>
                                      <p
                                        className="text-xs truncate"
                                        style={{ color: 'var(--ops-text-muted)' }}
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
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        color: 'var(--ops-text-muted)',
                                      }}
                                    >
                                      +{skills.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>
                              {/* Email */}
                              <td className="px-3 py-3 hidden md:table-cell">
                                <span className="text-sm truncate block max-w-[200px]" style={{ color: 'var(--ops-text-secondary)' }}>
                                  {emp.email}
                                </span>
                              </td>
                              {/* Department */}
                              <td className="px-3 py-3 hidden md:table-cell">
                                <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>
                                  {emp.department}
                                </span>
                              </td>
                              {/* Role */}
                              <td className="px-3 py-3 hidden lg:table-cell">
                                <span className="text-sm" style={{ color: 'var(--ops-text-secondary)' }}>
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
                                      className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                                      style={{ color: 'var(--ops-text-muted)' }}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
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
                                      backgroundColor: 'var(--ops-card-bg)',
                                      borderColor: 'var(--ops-border)',
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
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 mt-3">
                  <p className="text-xs" style={{ color: 'var(--ops-text-muted)' }}>
                    Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} of {sorted.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--ops-text-secondary)' }}
                      onClick={() => setPage(Math.max(0, safePage - 1))}
                      disabled={safePage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs px-2" style={{ color: 'var(--ops-text-secondary)' }}>
                      {safePage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--ops-text-secondary)' }}
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
                <div className="ops-card p-12 text-center">
                  <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ops-text-muted)' }} />
                  <p className="text-sm" style={{ color: 'var(--ops-text-muted)' }}>
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
                          className="ops-card ops-glow p-5 cursor-pointer transition-all"
                          style={{
                            border: isSelected ? '1px solid var(--ops-accent)' : undefined,
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
                                      backgroundColor: 'var(--ops-accent-light)',
                                      color: 'var(--ops-accent)',
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
                                    borderColor: 'var(--ops-card-bg)',
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ color: 'var(--ops-text)' }}
                                >
                                  {emp.name}
                                </p>
                                <p
                                  className="text-xs truncate"
                                  style={{ color: 'var(--ops-text-muted)' }}
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
                              style={{ accentColor: 'var(--ops-accent)' }}
                            />
                          </div>

                          {/* Department */}
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="text-xs font-medium"
                              style={{ color: 'var(--ops-text-secondary)' }}
                            >
                              {emp.department}
                            </span>
                            <span
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: 'var(--ops-text-muted)' }}
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
                          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--ops-border)' }}>
                            <div className="flex items-center gap-1.5">
                              <FolderKanban className="w-3.5 h-3.5" style={{ color: 'var(--ops-accent)' }} />
                              <span className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                                {emp.activeProjects} Projects
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)', width: '60px' }}
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 mt-3">
                  <p className="text-xs" style={{ color: 'var(--ops-text-muted)' }}>
                    Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} of {sorted.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--ops-text-secondary)' }}
                      onClick={() => setPage(Math.max(0, safePage - 1))}
                      disabled={safePage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-xs px-2" style={{ color: 'var(--ops-text-secondary)' }}>
                      {safePage + 1} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      style={{ color: 'var(--ops-text-secondary)' }}
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
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Full Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter full name"
                className="ops-input"
                style={{ backgroundColor: '#2a2b2e', border: '1px solid var(--ops-border)', color: 'var(--ops-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@company.com"
                className="ops-input"
                style={{ backgroundColor: '#2a2b2e', border: '1px solid var(--ops-border)', color: 'var(--ops-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="ops-input"
                style={{ backgroundColor: '#2a2b2e', border: '1px solid var(--ops-border)', color: 'var(--ops-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger
                  className="ops-input"
                  style={{
                    backgroundColor: '#2a2b2e',
                    border: '1px solid var(--ops-border)',
                    color: formData.department ? 'var(--ops-text)' : 'var(--ops-text-muted)',
                  }}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--ops-card-bg)', borderColor: 'var(--ops-border)' }}>
                  {['Engineering', 'Design', 'QA', 'Operations', 'HR', 'Sales', 'Finance'].map(
                    (dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Role / Designation
              </Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData((f) => ({ ...f, designation: e.target.value }))}
                placeholder="e.g. Senior Developer"
                className="ops-input"
                style={{ backgroundColor: '#2a2b2e', border: '1px solid var(--ops-border)', color: 'var(--ops-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Joining Date
              </Label>
              <Input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData((f) => ({ ...f, joinDate: e.target.value }))}
                className="ops-input"
                style={{ backgroundColor: '#2a2b2e', border: '1px solid var(--ops-border)', color: 'var(--ops-text)' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium" style={{ color: 'var(--ops-text-secondary)' }}>
                Salary Band
              </Label>
              <Select
                value={formData.salaryBand}
                onValueChange={(v) => setFormData((f) => ({ ...f, salaryBand: v }))}
              >
                <SelectTrigger
                  className="ops-input"
                  style={{
                    backgroundColor: '#2a2b2e',
                    border: '1px solid var(--ops-border)',
                    color: formData.salaryBand ? 'var(--ops-text)' : 'var(--ops-text-muted)',
                  }}
                >
                  <SelectValue placeholder="Select salary band" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--ops-card-bg)', borderColor: 'var(--ops-border)' }}>
                  {['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((band) => (
                    <SelectItem key={band} value={band}>{band}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DrawerForm>
      </div>
    </PageShell>

    <BulkActionBar
      selectedCount={bulkSelectedIds.length}
      onClear={clearBulkSelection}
      actions={[
        {
          label: 'Assign Department',
          icon: Building2,
          onClick: () => {},
        },
        {
          label: 'Change Status',
          icon: UserCheck,
          onClick: () => {},
        },
        {
          label: 'Delete',
          icon: UserX,
          onClick: () => {},
          variant: 'danger',
        },
      ]}
    />
    </>
  );
}

export default memo(EmployeesPageInner);
