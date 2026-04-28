'use client';

import { useCallback } from 'react';
import { useActivityStore } from '../activity-store';
import type { ActivityEventType } from '../types';

export function useActivity() {
  const { track, getEntityEvents, getRecentEvents, events } = useActivityStore();

  const trackTask = useCallback(
    (action: string, taskId: string, title: string, actor: string) => {
      track({
        type: `task_${action}` as ActivityEventType,
        title: `${actor} ${action} task "${title}"`,
        description: `Task ${action}: ${title}`,
        actor,
        entityType: 'task',
        entityId: taskId,
      });
    },
    [track]
  );

  const trackProject = useCallback(
    (action: string, projectId: string, name: string, actor: string) => {
      track({
        type: `project_${action}` as ActivityEventType,
        title: `${actor} ${action} project "${name}"`,
        description: `Project ${action}: ${name}`,
        actor,
        entityType: 'project',
        entityId: projectId,
      });
    },
    [track]
  );

  const trackEmployee = useCallback(
    (action: string, employeeId: string, name: string, actor: string) => {
      track({
        type: `employee_${action === 'status_changed' ? 'status_changed' : action}` as ActivityEventType,
        title: `${actor} ${action} employee "${name}"`,
        description: `Employee ${action}: ${name}`,
        actor,
        entityType: 'employee',
        entityId: employeeId,
      });
    },
    [track]
  );

  const trackLeave = useCallback(
    (action: string, leaveId: string, employeeName: string, actor: string, details?: string) => {
      track({
        type: `leave_${action}` as ActivityEventType,
        title: `${actor} ${action} ${employeeName}'s leave request`,
        description: `Leave ${action}: ${employeeName}${details ? ` - ${details}` : ''}`,
        actor,
        entityType: 'leave',
        entityId: leaveId,
      });
    },
    [track]
  );

  const trackApproval = useCallback(
    (action: string, approvalId: string, title: string, actor: string) => {
      track({
        type: `approval_${action}` as ActivityEventType,
        title: `${actor} ${action} "${title}"`,
        description: `Approval ${action}: ${title}`,
        actor,
        entityType: 'approval',
        entityId: approvalId,
      });
    },
    [track]
  );

  const trackPayroll = useCallback(
    (action: string, payrollId: string, details: string, actor: string) => {
      track({
        type: `payroll_${action}` as ActivityEventType,
        title: `${actor} ${action} payroll - ${details}`,
        description: `Payroll ${action}: ${details}`,
        actor,
        entityType: 'payroll',
        entityId: payrollId,
      });
    },
    [track]
  );

  return {
    events,
    track,
    trackTask,
    trackProject,
    trackEmployee,
    trackLeave,
    trackApproval,
    trackPayroll,
    getEntityEvents,
    getRecentEvents,
  };
}
