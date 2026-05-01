'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CheckCircle2, Wallet, CalendarOff, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { DrawerForm } from './components/ops/drawer-form';
import { StatusBadge } from './components/ops/status-badge';
import { FilterBar } from './components/ops/filter-bar';
import { KpiWidget } from './components/ops/kpi-widget';
import { useLeaves, useEmployees, formatINR } from '@/modules/erp/hooks/use-erp-api';
import type { EmployeeListItem } from '@/modules/erp/hooks/use-erp-api';
import type { LeaveRequest } from './types';
import { PageShell } from './components/ops/page-shell';
import { CSS } from '@/styles/design-tokens';

type TabKey = 'my' | 'team' | 'all';

const leaveTypeLabels: Record<string, string> = {
  casual: 'Casual', sick: 'Sick', earned: 'Earned',
  maternity: 'Maternity', paternity: 'Paternity',
  'comp-off': 'Comp-off', 'loss-of-pay': 'LOP',
};

function LeavesPageInner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('my');
  const [deptFilter, setDeptFilter] = useState('all');

  // Form state
  const [leaveType, setLeaveType] = useState('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [approver, setApprover] = useState('');

  const { data: leavesData, loading, error, refetch } = useLeaves();
  const { data: employeesData } = useEmployees();

  const leaves = leavesData?.leaves ?? [];
  const employees = employeesData?.employees ?? [];

  // Build employee lookup map
  const employeeMap = useMemo(() => {
    const map = new Map<string, EmployeeListItem>();
    for (const emp of employees) {
      map.set(emp.id, emp);
    }
    return map;
  }, [employees]);

  function getEmployee(id: string): EmployeeListItem | undefined {
    return employeeMap.get(id);
  }

  // Derive department filter options from employees
  const deptFilterOptions = useMemo(() => {
    const depts = [...new Set(employees.map(e => e.department).filter(Boolean))];
    return depts;
  }, [employees]);

  const myLeaves = useMemo(() => leaves.slice(0, 3), [leaves]);
  const teamLeaves = useMemo(() => [...leaves], [leaves]);

  const displayData = useMemo(() => {
    let data: any[] = activeTab === 'my' ? myLeaves : teamLeaves;
    if (activeTab === 'all' && deptFilter !== 'all') {
      const deptEmpIds = employees.filter(e => e.department === deptFilter).map(e => e.id);
      data = data.filter(l => deptEmpIds.includes(l.employeeId));
    }
    return data;
  }, [activeTab, deptFilter, myLeaves, teamLeaves, employees]);

  const stats = useMemo(() => {
    if (leavesData?.summary) {
      return {
        total: leavesData.total,
        pending: leavesData.summary.pendingCount,
        approved: leavesData.summary.approvedCount,
        balance: leavesData.summary.totalDaysRequested > 0 ? 12 : 12,
      };
    }
    return {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'pending').length,
      approved: leaves.filter(l => l.status === 'approved').length,
      balance: 12,
    };
  }, [leaves, leavesData?.summary, leavesData?.total]);

  const tabFilters = [
    { key: 'my', label: 'My Leaves' },
    { key: 'team', label: 'Team Leaves' },
    { key: 'all', label: 'All Requests' },
  ];

  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const emp = getEmployee(row.employeeId as string);
        const initials = emp?.avatar || emp?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[10px] font-semibold" style={{ backgroundColor: CSS.accentLight, color: CSS.accent }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium" style={{ color: CSS.text }}>{emp?.name || String(row.employeeId)}</p>
              <p className="text-[11px]" style={{ color: CSS.textMuted }}>{emp?.department}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <span className="ops-badge capitalize">{leaveTypeLabels[(row.type as string)] || String(row.type)}</span>
      ),
    },
    {
      key: 'startDate',
      label: 'Dates',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm" style={{ color: CSS.textSecondary }}>
            {String(row.startDate)} → {String(row.endDate)}
          </p>
          <p className="text-[11px]" style={{ color: CSS.textMuted }}>{String(row.days)} day{Number(row.days) > 1 ? 's' : ''}</p>
        </div>
      ),
    },
    { key: 'days', label: 'Days', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status as string} />,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 'pending' && (
            <>
              <button className="ops-btn-ghost text-[11px] px-2 py-1" style={{ color: CSS.success }} onClick={(e) => { e.stopPropagation(); }}>Approve</button>
              <button className="ops-btn-ghost text-[11px] px-2 py-1" style={{ color: CSS.danger }} onClick={(e) => { e.stopPropagation(); }}>Reject</button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleSubmit = () => {
    setDrawerOpen(false);
    setLeaveType('casual');
    setStartDate('');
    setEndDate('');
    setReason('');
    setApprover('');
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <PageShell title="Leave Management" icon={CalendarOff} createType="leave">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: CSS.hoverBg }} />
            ))}
          </div>
          <div className="h-96 rounded-xl animate-pulse" style={{ backgroundColor: CSS.hoverBg }} />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="Leave Management" icon={CalendarOff} createType="leave">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertTriangle className="w-10 h-10" style={{ color: CSS.danger }} />
          <p className="text-sm" style={{ color: CSS.textSecondary }}>Failed to load leaves: {error}</p>
          <Button variant="outline" onClick={refetch}>Retry</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <>
    <PageShell title="Leave Management" icon={CalendarOff} createType="leave">
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Total Requests" value={stats.total} icon={CalendarDays} color="accent" />
          <KpiWidget label="Pending" value={stats.pending} icon={Clock} color="warning" />
          <KpiWidget label="Approved" value={stats.approved} icon={CheckCircle2} color="success" />
          <KpiWidget label="Avail. Balance" value={`${stats.balance} days`} icon={Wallet} color="info" />
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp}>
          <FilterBar filters={tabFilters} activeFilter={activeTab} onFilterChange={(key) => setActiveTab(key as TabKey)} />
        </motion.div>

        {/* Department filter for All Requests tab */}
        {activeTab === 'all' && (
          <motion.div variants={fadeUp}>
            <FilterBar
              filters={[
                { key: 'all', label: 'All Depts' },
                ...deptFilterOptions.map(d => ({ key: d, label: d })),
              ]}
              activeFilter={deptFilter}
              onFilterChange={setDeptFilter}
            />
          </motion.div>
        )}

        {/* Table */}
        <motion.div variants={fadeUp}>
          <SmartDataTable
            data={displayData as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search leaves..."
            searchKeys={['employeeId', 'type', 'status']}
            emptyMessage="No leave requests found."
            enableExport
            pageSize={10}
          />
        </motion.div>
      </motion.div>
    </PageShell>

    {/* Apply Leave Drawer */}
    <DrawerForm
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title="Apply Leave"
      onSubmit={handleSubmit}
      submitLabel="Submit Request"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: CSS.textSecondary }}>Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="ops-input w-full px-3 py-2 text-sm">
            {['casual', 'sick', 'earned', 'maternity', 'paternity', 'comp-off', 'loss-of-pay'].map(t => (
              <option key={t} value={t}>{leaveTypeLabels[t]}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: CSS.textSecondary }}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ops-input w-full px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: CSS.textSecondary }}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="ops-input w-full px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: CSS.textSecondary }}>Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason..." rows={3} className="ops-input w-full px-3 py-2 text-sm resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: CSS.textSecondary }}>Approver</label>
          <select value={approver} onChange={(e) => setApprover(e.target.value)} className="ops-input w-full px-3 py-2 text-sm">
            <option value="">Select approver</option>
            {employees.filter(e => ['E4', 'E5'].includes(e.salaryBand || '')).map(e => (
              <option key={e.id} value={e.name}>{e.name} — {e.designation}</option>
            ))}
          </select>
        </div>
      </div>
    </DrawerForm>
    </>
  );
}

export default memo(LeavesPageInner);
