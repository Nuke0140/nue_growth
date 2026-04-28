'use client';

import { create } from 'zustand';
import type { ActivityEvent, ActivityEventType } from './types';

interface ActivityState {
  events: ActivityEvent[];

  // Track an event
  track: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;

  // Get events for a specific entity
  getEntityEvents: (entityType: string, entityId: string) => ActivityEvent[];

  // Get recent events (last N)
  getRecentEvents: (count?: number) => ActivityEvent[];

  // Get events by type
  getByType: (type: ActivityEventType) => ActivityEvent[];

  // Clear all events
  clear: () => void;
}

// ---- Seed data: 18 mock activity events ----
const seedEvents: ActivityEvent[] = [
  {
    id: 'seed-001',
    type: 'task_completed',
    title: 'Nikhil Das completed task "Risk management algorithm"',
    description: 'Task completed: Risk management algorithm',
    actor: 'Nikhil Das',
    entityType: 'task',
    entityId: 'task-042',
    metadata: { projectId: 'proj-nexabank', storyPoints: 8 },
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'seed-002',
    type: 'project_created',
    title: 'Priya Sharma created project "TravelWise Booking Engine"',
    description: 'New project created: TravelWise Booking Engine',
    actor: 'Priya Sharma',
    entityType: 'project',
    entityId: 'proj-travelwise',
    metadata: { client: 'TravelWise Inc.', budget: 450000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'seed-003',
    type: 'leave_applied',
    title: 'Sneha Reddy applied for 3 days casual leave',
    description: 'Leave application: 3 days casual leave from Mar 20-22',
    actor: 'Sneha Reddy',
    entityType: 'leave',
    entityId: 'leave-089',
    metadata: { leaveType: 'casual', days: 3 },
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'seed-004',
    type: 'approval_approved',
    title: 'CFO approved NexaBank Q2 Milestone Invoice',
    description: 'Invoice approval: NexaBank Q2 Milestone - INR 12,50,000',
    actor: 'CFO',
    entityType: 'approval',
    entityId: 'approval-inv-044',
    metadata: { type: 'invoice', amount: 1250000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'seed-005',
    type: 'payroll_processed',
    title: 'HR Team processed March 2026 payroll',
    description: 'Payroll processed for 47 employees - March 2026 cycle',
    actor: 'HR Team',
    entityType: 'payroll',
    entityId: 'payroll-mar-2026',
    metadata: { totalEmployees: 47, totalAmount: 2850000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'seed-006',
    type: 'approval_requested',
    title: 'Arjun Mehta requested approval for TravelWise Proposal',
    description: 'Proposal submitted for review: TravelWise Booking Engine',
    actor: 'Arjun Mehta',
    entityType: 'approval',
    entityId: 'approval-prop-021',
    metadata: { type: 'proposal', priority: 'high' },
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'seed-007',
    type: 'task_updated',
    title: 'Deepika Nair uploaded design deliverable for NexaBank',
    description: 'Task updated: Design deliverable uploaded to NexaBank project',
    actor: 'Deepika Nair',
    entityType: 'task',
    entityId: 'task-078',
    metadata: { projectId: 'proj-nexabank', deliverable: 'UI Mockups v3' },
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'seed-008',
    type: 'asset_reported',
    title: 'Asset "ThinkPad X1 Carbon" reported for repair',
    description: 'Asset reported: ThinkPad X1 Carbon - keyboard malfunction',
    actor: 'Rahul Verma',
    entityType: 'asset',
    entityId: 'asset-015',
    metadata: { assetName: 'ThinkPad X1 Carbon', issue: 'keyboard malfunction' },
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'seed-009',
    type: 'ai_insight_generated',
    title: 'AI detected burnout risk for 3 employees',
    description: 'AI alert: 3 employees showing high burnout indicators based on workload analysis',
    actor: 'AI Ops',
    entityType: 'ai',
    entityId: 'ai-insight-012',
    metadata: { severity: 'high', affectedCount: 3 },
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
  {
    id: 'seed-010',
    type: 'employee_created',
    title: 'HR onboarded new employee "Vikram Joshi"',
    description: 'New employee created: Vikram Joshi - Senior Developer',
    actor: 'HR Team',
    entityType: 'employee',
    entityId: 'emp-052',
    metadata: { department: 'Engineering', designation: 'Senior Developer' },
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
  {
    id: 'seed-011',
    type: 'project_updated',
    title: 'Rohan Patel updated NexaBank project health to "at-risk"',
    description: 'Project health changed: NexaBank → at-risk due to timeline slippage',
    actor: 'Rohan Patel',
    entityType: 'project',
    entityId: 'proj-nexabank',
    metadata: { oldHealth: 'good', newHealth: 'at-risk' },
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
  },
  {
    id: 'seed-012',
    type: 'leave_approved',
    title: 'Manager approved Kavita Iyer\'s sick leave request',
    description: 'Leave approved: Kavita Iyer - 2 days sick leave',
    actor: 'Project Manager',
    entityType: 'leave',
    entityId: 'leave-085',
    metadata: { leaveType: 'sick', days: 2 },
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
  {
    id: 'seed-013',
    type: 'task_blocked',
    title: 'Task "API Gateway Integration" blocked by dependency',
    description: 'Task blocked: API Gateway Integration - waiting on third-party credentials',
    actor: 'Ankit Gupta',
    entityType: 'task',
    entityId: 'task-091',
    metadata: { projectId: 'proj-travelwise', reason: 'awaiting credentials' },
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  },
  {
    id: 'seed-014',
    type: 'payroll_paid',
    title: 'Finance disbursed February 2026 salaries',
    description: 'Payroll disbursed: February 2026 - 47 employees - INR 27,80,000',
    actor: 'Finance Team',
    entityType: 'payroll',
    entityId: 'payroll-feb-2026',
    metadata: { totalEmployees: 47, totalAmount: 2780000 },
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
  },
  {
    id: 'seed-015',
    type: 'comment_added',
    title: 'Meera Krishnan commented on NexaBank delivery milestone',
    description: 'Comment added to NexaBank Q2 deliverable review thread',
    actor: 'Meera Krishnan',
    entityType: 'task',
    entityId: 'task-065',
    metadata: { projectId: 'proj-nexabank', commentLength: 120 },
    timestamp: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
  },
  {
    id: 'seed-016',
    type: 'employee_status_changed',
    title: 'Sanjay Kumar moved to "notice-period" status',
    description: 'Employee status change: Sanjay Kumar → notice-period (last day: Apr 15)',
    actor: 'HR Team',
    entityType: 'employee',
    entityId: 'emp-038',
    metadata: { oldStatus: 'active', newStatus: 'notice-period' },
    timestamp: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
  },
  {
    id: 'seed-017',
    type: 'asset_assigned',
    title: 'IT assigned "Dell U2723QE Monitor" to Deepika Nair',
    description: 'Asset assigned: Dell U2723QE Monitor → Deepika Nair (Engineering)',
    actor: 'IT Admin',
    entityType: 'asset',
    entityId: 'asset-023',
    metadata: { assetName: 'Dell U2723QE Monitor', assignedTo: 'Deepika Nair' },
    timestamp: new Date(Date.now() - 1000 * 60 * 2100).toISOString(),
  },
  {
    id: 'seed-018',
    type: 'ai_insight_generated',
    title: 'AI flagged revenue forecast drop for Q2 2026',
    description: 'AI prediction: Q2 2026 revenue expected to drop 12% based on current pipeline velocity',
    actor: 'AI Ops',
    entityType: 'ai',
    entityId: 'ai-insight-013',
    metadata: { severity: 'medium', metric: 'revenue_forecast' },
    timestamp: new Date(Date.now() - 1000 * 60 * 2400).toISOString(),
  },
];

export const useActivityStore = create<ActivityState>((set, get) => ({
  events: seedEvents,

  track: (event) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      events: [newEvent, ...state.events],
    }));
  },

  getEntityEvents: (entityType, entityId) => {
    return get().events.filter(
      (e) => e.entityType === entityType && e.entityId === entityId
    );
  },

  getRecentEvents: (count = 10) => {
    return get().events.slice(0, count);
  },

  getByType: (type) => {
    return get().events.filter((e) => e.type === type);
  },

  clear: () => set({ events: [] }),
}));
