'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, UserCheck, UserX, Clock, Home, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { useAttendance, useEmployees } from '@/modules/erp/hooks/use-erp-api';
import type { EmployeeListItem } from '@/modules/erp/hooks/use-erp-api';
import type { AttendanceRecord } from '@/modules/erp/types';

const avatarColors = [
  'rgba(204, 92, 55, 0.12)',
  'rgba(52, 211, 153, 0.12)',
  'rgba(96, 165, 250, 0.12)',
  'rgba(251, 191, 36, 0.12)',
  'rgba(248, 113, 113, 0.12)',
  'rgba(168, 85, 247, 0.12)',
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

const AVAILABLE_DATES = ['2026-04-08', '2026-04-09', '2026-04-10', '2026-04-11'];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatStatusLabel(status: string): string {
  const map: Record<string, string> = {
    present: 'Present',
    absent: 'Absent',
    'half-day': 'Half Day',
    wfh: 'WFH',
    'on-leave': 'On Leave',
  };
  return map[status] || status;
}

function AttendancePageInner() {
  const [dateIdx, setDateIdx] = useState(2); // default: 2026-04-10
  const selectedDate = AVAILABLE_DATES[dateIdx];

  const { data: attendanceData, loading, error, refetch } = useAttendance({ date: selectedDate });
  const { data: employeesData } = useEmployees();

  const employees = employeesData?.employees ?? [];
  const records = attendanceData?.records ?? [];

  // Build employee lookup map for O(1) access
  const employeeMap = useMemo(() => {
    const map = new Map<string, EmployeeListItem>();
    for (const emp of employees) {
      map.set(emp.id, emp);
    }
    return map;
  }, [employees]);

  function getEmployeeName(id: string): string {
    return employeeMap.get(id)?.name || (records as any[]).find((r: any) => r.employeeId === id)?.employeeName || id;
  }

  function getEmployeeInitials(id: string): string {
    const emp = employeeMap.get(id);
    if (emp?.avatar) return emp.avatar;
    const name = emp?.name || id;
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  const stats = useMemo(() => {
    if (attendanceData?.todaySummary) {
      return {
        present: attendanceData.todaySummary.present,
        absent: attendanceData.todaySummary.absent,
        halfDay: attendanceData.todaySummary.halfDay,
        wfh: attendanceData.todaySummary.wfh,
      };
    }
    return {
      present: records.filter((a: any) => a.status === 'present').length,
      absent: records.filter((a: any) => a.status === 'absent').length,
      halfDay: records.filter((a: any) => a.status === 'half-day').length,
      wfh: records.filter((a: any) => a.status === 'wfh').length,
    };
  }, [records, attendanceData?.todaySummary]);

  const columns: DataTableColumnDef[] = [
    {
      key: 'employeeId',
      label: 'Employee',
      sortable: true,
      render: (row) => {
        const empId = String(row.employeeId);
        const name = getEmployeeName(empId);
        const initials = getEmployeeInitials(empId);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className="text-[10px] font-semibold"
                style={{
                  backgroundColor: avatarColors[Math.abs(hashCode(name)) % avatarColors.length],
                  color: CSS.accent,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium" style={{ color: CSS.text }}>
              {name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'checkIn',
      label: 'Check In',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: CSS.textSecondary }}>
          {String(row.checkIn || '—')}
        </span>
      ),
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: CSS.textSecondary }}>
          {String(row.checkOut || '—')}
        </span>
      ),
    },
    {
      key: 'hours',
      label: 'Hours',
      sortable: true,
      render: (row) => {
        const hours = Number(row.hours);
        const color = hours >= 9 ? CSS.success : hours === 0 ? CSS.textMuted : CSS.warning;
        return <span className="text-sm font-medium" style={{ color }}>{hours > 0 ? `${hours}h` : '—'}</span>;
      },
    },
    {
      key: 'overtime',
      label: 'OT',
      sortable: true,
      render: (row) => {
        const ot = Number(row.overtime);
        return (
          <span className="text-sm" style={{ color: ot > 0 ? CSS.warning : CSS.textMuted }}>
            {ot > 0 ? `+${ot}h` : '—'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={formatStatusLabel(String(row.status))} />,
    },
    {
      key: 'isAnomaly',
      label: 'Anomaly',
      sortable: true,
      render: (row) =>
        row.isAnomaly ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-500 dark:text-red-400">Flag</span>
          </span>
        ) : (
          <span style={{ color: CSS.textMuted }}>—</span>
        ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  if (loading) {
    return (
      <PageShell title="Attendance" icon={Clock} subtitle="Real-time">
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
      <PageShell title="Attendance" icon={Clock} subtitle="Real-time">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertTriangle className="w-10 h-10" style={{ color: CSS.danger }} />
          <p className="text-sm" style={{ color: CSS.textSecondary }}>Failed to load attendance: {error}</p>
          <Button variant="outline" onClick={refetch}>Retry</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Attendance" icon={Clock} subtitle="Real-time" headerRight={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDateIdx(i => Math.max(0, i - 1))}
            disabled={dateIdx === 0}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: CSS.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[160px] text-center" style={{ color: CSS.text }}>
            {formatDateLabel(selectedDate)}
          </span>
          <button
            onClick={() => setDateIdx(i => Math.min(AVAILABLE_DATES.length - 1, i + 1))}
            disabled={dateIdx === AVAILABLE_DATES.length - 1}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: CSS.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = CSS.hoverBg}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      }>
      <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
        {/* KPI Widgets */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiWidget label="Present" value={stats.present} icon={UserCheck} color="success" />
          <KpiWidget label="Absent" value={stats.absent} icon={UserX} color="danger" />
          <KpiWidget label="Half Day" value={stats.halfDay} icon={Clock} color="warning" />
          <KpiWidget label="WFH" value={stats.wfh} icon={Home} color="info" />
        </motion.div>

        {/* Data Table */}
        <motion.div variants={fadeUp}>
          <SmartDataTable
            data={records as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeId']}
            emptyMessage="No attendance records for this date."
          />
        </motion.div>

        {/* Anomaly Summary */}
        {records.some((a: any) => a.isAnomaly) && (
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-4"
            style={{ border: '1px solid rgba(248, 113, 113, 0.2)', backgroundColor: 'rgba(248, 113, 113, 0.04)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: CSS.warning }} />
              <span className="text-sm font-semibold" style={{ color: CSS.warning }}>
                Anomaly Summary
              </span>
            </div>
            <div className="space-y-1.5">
              {records
                .filter((a: any) => a.isAnomaly)
                .map((a: any) => {
                  const name = getEmployeeName(a.employeeId);
                  return (
                    <p key={a.id} className="text-xs" style={{ color: CSS.textSecondary }}>
                      <span className="font-medium" style={{ color: CSS.text }}>{name}</span>
                      {' — '}
                      {a.status === 'absent'
                        ? 'No check-in recorded today'
                        : a.overtime >= 3
                          ? `Excessive overtime: ${a.overtime}h logged`
                          : `Late check-in at ${a.checkIn}`}
                    </p>
                  );
                })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageShell>
  );
}

export default memo(AttendancePageInner);
