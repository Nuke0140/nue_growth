'use client';

import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, UserCheck, UserX, Clock, Home, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageShell } from '@/components/shared/page-shell';
import { SmartDataTable, type DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { KpiWidget } from '@/components/shared/kpi-widget';
import { CSS } from '@/styles/design-tokens';
import { mockEmployees, mockAttendance } from '@/modules/erp/data/mock-data';
import type { AttendanceRecord } from '@/modules/erp/types';

function getEmployeeName(id: string): string {
  return mockEmployees.find(e => e.id === id)?.name || id;
}

function getEmployeeInitials(id: string): string {
  return mockEmployees.find(e => e.id === id)?.avatar || '??';
}

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

  const dayData = useMemo(() => {
    const records = mockAttendance.filter(a => a.date === selectedDate);
    if (records.length > 0) return records;
    // For dates without data, return mockAttendance as fallback
    return mockAttendance;
  }, [selectedDate]);

  const stats = useMemo(() => ({
    present: dayData.filter(a => a.status === 'present').length,
    absent: dayData.filter(a => a.status === 'absent').length,
    halfDay: dayData.filter(a => a.status === 'half-day').length,
    wfh: dayData.filter(a => a.status === 'wfh').length,
  }), [dayData]);

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
                  color: 'var(--app-accent)',
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
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
        <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          {row.checkIn || '—'}
        </span>
      ),
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      sortable: true,
      render: (row) => (
        <span className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
          {row.checkOut || '—'}
        </span>
      ),
    },
    {
      key: 'hours',
      label: 'Hours',
      sortable: true,
      render: (row) => {
        const hours = row.hours as number;
        const style: React.CSSProperties =
          hours >= 9
            ? { color: 'var(--app-success)' }
            : hours === 0
              ? { color: 'var(--app-text-muted)' }
              : { color: 'var(--app-warning)' };
        return <span className="text-sm font-medium" style={style}>{hours > 0 ? `${hours}h` : '—'}</span>;
      },
    },
    {
      key: 'overtime',
      label: 'OT',
      sortable: true,
      render: (row) => {
        const ot = Number(row.overtime);
        return (
          <span
            className="text-sm"
            style={{ color: ot > 0 ? 'var(--app-warning)' : 'var(--app-text-muted)' }}
          >
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
          <span style={{ color: 'var(--app-text-muted)' }}>—</span>
        ),
    },
  ];

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <PageShell title="Attendance" icon={Clock} subtitle="Real-time" headerRight={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDateIdx(i => Math.max(0, i - 1))}
            disabled={dateIdx === 0}
            className="app-btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[160px] text-center" style={{ color: 'var(--app-text)' }}>
            {formatDateLabel(selectedDate)}
          </span>
          <button
            onClick={() => setDateIdx(i => Math.min(AVAILABLE_DATES.length - 1, i + 1))}
            disabled={dateIdx === AVAILABLE_DATES.length - 1}
            className="app-btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      }>
      <motion.div className="space-y-app-2xl" variants={stagger} initial="hidden" animate="show">
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
            data={dayData as unknown as Record<string, unknown>[]}
            columns={columns}
            searchable
            searchPlaceholder="Search employees..."
            searchKeys={['employeeId']}
            emptyMessage="No attendance records for this date."
          />
        </motion.div>

        {/* Anomaly Summary */}
        {dayData.some(a => a.isAnomaly) && (
          <motion.div
            variants={fadeUp}
            className="app-card p-4"
            style={{ border: '1px solid rgba(248, 113, 113, 0.2)', backgroundColor: 'rgba(248, 113, 113, 0.04)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: 'var(--app-warning)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--app-warning)' }}>
                Anomaly Summary
              </span>
            </div>
            <div className="space-y-1.5">
              {dayData
                .filter(a => a.isAnomaly)
                .map(a => {
                  const name = getEmployeeName(a.employeeId);
                  return (
                    <p key={a.id} className="text-xs" style={{ color: 'var(--app-text-secondary)' }}>
                      <span className="font-medium" style={{ color: 'var(--app-text)' }}>{name}</span>
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
