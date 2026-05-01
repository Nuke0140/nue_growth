'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Generic fetch hook with timeout ───
function useApiFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // 8-second timeout so pages don't hang forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();

      if (mountedRef.current) {
        setData(json);
      }
    } catch (err) {
      if (mountedRef.current) {
        // Don't treat abort as a hard error — just mark as timed out
        const msg = err instanceof DOMException && err.name === 'AbortError'
          ? 'Request timed out'
          : err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Dashboard ───
export interface DashboardKpis {
  totalEmployees: number;
  activeProjects: number;
  totalRevenue: number;
  collectedRevenue: number;
  overdueAmount: number;
  pendingApprovals: number;
  activeDeliveries: number;
  activeVendors: number;
  activeAssets: number;
  avgProfitability: number;
  avgProjectHealth: number;
}

export interface DashboardData {
  kpis: DashboardKpis;
  healthDistribution: { excellent: number; good: number; atRisk: number; critical: number };
  revenueByMonth: { month: string; revenue: number; collected: number }[];
  activities: { id: string; type: string; title: string; timestamp: string; status: string }[];
}

export function useDashboard() {
  return useApiFetch<DashboardData>('/api/erp/dashboard');
}

// ─── Employees ───
export interface EmployeeListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string;
  departmentCode: string;
  designation: string;
  managerId: string | null;
  salaryBand: string | null;
  baseSalary: number;
  joinDate: string;
  status: string;
  productivityScore: number;
  avatar: string | null;
}

export function useEmployees(filters?: { department?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.department) params.set('department', filters.department);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  return useApiFetch<{ employees: EmployeeListItem[]; total: number }>(`/api/erp/employees${qs ? `?${qs}` : ''}`);
}

// ─── Employee Detail ───
export function useEmployeeDetail(id: string | null) {
  return useApiFetch<any>(id ? `/api/erp/employee-detail?id=${id}` : null);
}

// ─── Projects ───
export interface ProjectListItem {
  id: string;
  name: string;
  client: string;
  accountManager: string;
  budget: number;
  actualSpend: number;
  progress: number;
  profitability: number;
  health: string;
  sla: number;
  dueDate: string;
  status: string;
  priority: string;
  isRecurring: boolean;
  department: string;
  milestoneCount: number;
  completedMilestones: number;
  taskCount: number;
  completedTasks: number;
  milestones: { id: string; title: string; date: string; completed: boolean }[];
}

export function useProjects(filters?: { status?: string; priority?: string; health?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.priority) params.set('priority', filters.priority);
  if (filters?.health) params.set('health', filters.health);
  const qs = params.toString();
  return useApiFetch<{ projects: ProjectListItem[]; total: number }>(`/api/erp/projects${qs ? `?${qs}` : ''}`);
}

// ─── Project Detail ───
export function useProjectDetail(id: string | null) {
  return useApiFetch<any>(id ? `/api/erp/project-detail?id=${id}` : null);
}

// ─── Invoices ───
export interface InvoiceListItem {
  id: string;
  invoiceNo: string;
  client: string;
  project: string;
  amount: number;
  gst: number;
  totalWithGst: number;
  dueDate: string;
  paidAmount: number;
  status: string;
  recurring: boolean;
  createdAt: string;
}

export function useInvoices(status?: string) {
  const qs = status ? `?status=${status}` : '';
  return useApiFetch<{ invoices: InvoiceListItem[]; total: number; summary: { totalAmount: number; totalGst: number; totalPaid: number; overdueCount: number; pendingAmount: number } }>(`/api/erp/invoices${qs}`);
}

// ─── Vendors ───
export function useVendors() {
  return useApiFetch<{ vendors: any[]; total: number; summary: { totalContractValue: number; totalPayoutDue: number; avgRating: number; activeVendors: number } }>('/api/erp/vendors');
}

// ─── Assets ───
export function useAssets() {
  return useApiFetch<{ assets: any[]; total: number; summary: { totalValue: number; activeAssets: number; inRepair: number; warrantyExpiring: number } }>('/api/erp/assets');
}

// ─── Attendance ───
export function useAttendance(filters?: { date?: string; status?: string; employeeId?: string }) {
  const params = new URLSearchParams();
  if (filters?.date) params.set('date', filters.date);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  const qs = params.toString();
  return useApiFetch<{ records: any[]; total: number; todaySummary: { present: number; wfh: number; absent: number; halfDay: number; onLeave: number } }>(`/api/erp/attendance${qs ? `?${qs}` : ''}`);
}

// ─── Leaves ───
export function useLeaves(filters?: { status?: string; type?: string; employeeId?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.type) params.set('type', filters.type);
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  const qs = params.toString();
  return useApiFetch<{ leaves: any[]; total: number; summary: { pendingCount: number; approvedCount: number; totalDaysRequested: number } }>(`/api/erp/leaves${qs ? `?${qs}` : ''}`);
}

// ─── Approvals ───
export function useApprovals(filters?: { status?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.type) params.set('type', filters.type);
  const qs = params.toString();
  return useApiFetch<{ approvals: any[]; total: number; summary: { pending: number; approved: number; rejected: number; escalated: number } }>(`/api/erp/approvals${qs ? `?${qs}` : ''}`);
}

// ─── Deliveries ───
export function useDeliveries(filters?: { status?: string; projectId?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.projectId) params.set('projectId', filters.projectId);
  const qs = params.toString();
  return useApiFetch<{ deliveries: any[]; total: number; summary: { pending: number; inProgress: number; inReview: number; delivered: number } }>(`/api/erp/deliveries${qs ? `?${qs}` : ''}`);
}

// ─── Workload ───
export function useWorkload() {
  return useApiFetch<{ workloads: any[]; total: number; summary: { overloaded: number; atCapacity: number; optimal: number; underUtilized: number; avgAllocation: number } }>('/api/erp/workload');
}

// ─── Currency formatter ───
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
