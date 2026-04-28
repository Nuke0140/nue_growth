'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, Clock, AlertTriangle, Plus, MoreHorizontal,
  Mail, Phone, Briefcase, UserCircle, Calendar, DollarSign,
  Eye, Pencil, UserX, Search,
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
import { mockEmployees } from '@/modules/erp/data/mock-data';
import { useErpStore } from '@/modules/erp/erp-store';
import type { EmployeeStatus } from '@/modules/erp/types';
import { DataTable } from '@/modules/erp/components/ops/data-table';
import { FilterBar } from '@/modules/erp/components/ops/filter-bar';
import { SearchInput } from '@/modules/erp/components/ops/search-input';
import { StatusBadge } from '@/modules/erp/components/ops/status-badge';
import { DrawerForm } from '@/modules/erp/components/ops/drawer-form';
import { OpsCard } from '@/modules/erp/components/ops/ops-card';
import type { Column } from '@/modules/erp/components/ops/data-table';

// ---- Helpers ----
type FilterKey = 'all' | 'active' | 'on-leave' | 'probation' | 'notice-period';

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

// ---- Main Component ----
export default function EmployeesPage() {
  const selectEmployee = useErpStore((s) => s.selectEmployee);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joinDate: '',
    salaryBand: '',
  });

  // Compute filtered data
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
    return result;
  }, [searchQuery, activeFilter]);

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

  // DataTable columns
  const columns: Column<Record<string, unknown>>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (row) => {
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <div className="flex items-center gap-3">
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
          );
        },
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        hiddenMobile: true,
        render: (row) => {
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <span
              className="text-sm truncate"
              style={{ color: 'var(--ops-text-secondary)' }}
            >
              {emp.email}
            </span>
          );
        },
      },
      {
        key: 'department',
        label: 'Department',
        sortable: true,
        hiddenMobile: true,
        render: (row) => {
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <span
              className="text-sm"
              style={{ color: 'var(--ops-text-secondary)' }}
            >
              {emp.department}
            </span>
          );
        },
      },
      {
        key: 'designation',
        label: 'Role',
        sortable: true,
        hiddenMobile: true,
        render: (row) => {
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <span
              className="text-sm"
              style={{ color: 'var(--ops-text-secondary)' }}
            >
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
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <StatusBadge status={formatStatusLabel(emp.status)} variant="pill" />
          );
        },
      },
      {
        key: 'actions',
        label: '',
        render: (row) => {
          const emp = row as unknown as (typeof mockEmployees)[0];
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                  style={{ color: 'var(--ops-text-muted)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'transparent';
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
          );
        },
      },
    ],
    [selectEmployee],
  );

  const handleDrawerSubmit = () => {
    setDrawerOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      joinDate: '',
      salaryBand: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
      style={{ backgroundColor: 'var(--ops-bg-dark)' }}
    >
      <div className="p-6 space-y-5">
        {/* ---- Header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: 'var(--ops-text)' }}
            >
              Employees
            </h1>
            <span
              className="ops-badge text-xs font-medium"
              style={{
                backgroundColor: 'var(--ops-accent-light)',
                color: 'var(--ops-accent)',
              }}
            >
              {filtered.length}
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="ops-btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* ---- Filters & Search ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <FilterBar
            filters={filterItems}
            activeFilter={activeFilter}
            onFilterChange={(key) => setActiveFilter(key as FilterKey)}
          />
          <div className="sm:ml-auto w-full sm:w-64">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search employees..."
            />
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
                    <stat.icon
                      className="w-3.5 h-3.5"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
                <p className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </OpsCard>
            </motion.div>
          ))}
        </div>

        {/* ---- Data Table ---- */}
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          onRowClick={(row) =>
            selectEmployee(
              (row as unknown as (typeof mockEmployees)[0]).id,
            )
          }
          pageSize={10}
          emptyMessage="No employees found. Try adjusting your search or filters."
        />

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
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Full Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter full name"
                className="ops-input"
                style={{
                  backgroundColor: '#2a2b2e',
                  border: '1px solid var(--ops-border)',
                  color: 'var(--ops-text)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="name@company.com"
                className="ops-input"
                style={{
                  backgroundColor: '#2a2b2e',
                  border: '1px solid var(--ops-border)',
                  color: 'var(--ops-text)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 XXXXX XXXXX"
                className="ops-input"
                style={{
                  backgroundColor: '#2a2b2e',
                  border: '1px solid var(--ops-border)',
                  color: 'var(--ops-text)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, department: v }))
                }
              >
                <SelectTrigger
                  className="ops-input"
                  style={{
                    backgroundColor: '#2a2b2e',
                    border: '1px solid var(--ops-border)',
                    color: formData.department
                      ? 'var(--ops-text)'
                      : 'var(--ops-text-muted)',
                  }}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--ops-card-bg)',
                    borderColor: 'var(--ops-border)',
                  }}
                >
                  {['Engineering', 'Design', 'QA', 'Operations', 'HR', 'Sales', 'Finance'].map(
                    (dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Role / Designation
              </Label>
              <Input
                value={formData.designation}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, designation: e.target.value }))
                }
                placeholder="e.g. Senior Developer"
                className="ops-input"
                style={{
                  backgroundColor: '#2a2b2e',
                  border: '1px solid var(--ops-border)',
                  color: 'var(--ops-text)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Joining Date
              </Label>
              <Input
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, joinDate: e.target.value }))
                }
                className="ops-input"
                style={{
                  backgroundColor: '#2a2b2e',
                  border: '1px solid var(--ops-border)',
                  color: 'var(--ops-text)',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-medium"
                style={{ color: 'var(--ops-text-secondary)' }}
              >
                Salary Band
              </Label>
              <Select
                value={formData.salaryBand}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, salaryBand: v }))
                }
              >
                <SelectTrigger
                  className="ops-input"
                  style={{
                    backgroundColor: '#2a2b2e',
                    border: '1px solid var(--ops-border)',
                    color: formData.salaryBand
                      ? 'var(--ops-text)'
                      : 'var(--ops-text-muted)',
                  }}
                >
                  <SelectValue placeholder="Select salary band" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: 'var(--ops-card-bg)',
                    borderColor: 'var(--ops-border)',
                  }}
                >
                  {['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((band) => (
                    <SelectItem key={band} value={band}>
                      {band}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DrawerForm>
      </div>
    </motion.div>
  );
}
