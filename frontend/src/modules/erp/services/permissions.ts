import type { UserRole, Permission, PermissionAction, ErpPage } from '../types';

// Full list of ERP pages
const ALL_PAGES: ErpPage[] = [
  'ops-dashboard',
  'projects',
  'project-detail',
  'tasks-board',
  'employees',
  'employee-detail',
  'employee-analytics',
  'departments',
  'attendance',
  'shifts',
  'leaves',
  'payroll',
  'compensation',
  'incentives',
  'performance',
  'onboarding',
  'documents',
  'invoices',
  'vendors',
  'finance-ops',
  'profitability',
  'delivery-ops',
  'resource-planning',
  'workload',
  'sop-templates',
  'assets',
  'asset-management',
  'approvals',
  'ai-ops',
  'ai-ops-intelligence',
  'internal-chat',
  'hrm',
];

// Pages where managers have restricted permissions (no delete, no approve)
const MANAGER_RESTRICTED_PAGES: ErpPage[] = [
  'payroll',
  'compensation',
  'performance',
  'finance-ops',
  'profitability',
];

// Pages where managers can approve (leaves, approvals, tasks)
const MANAGER_APPROVE_PAGES: ErpPage[] = [
  'leaves',
  'approvals',
  'tasks-board',
  'invoices',
  'onboarding',
];

// Pages where employees can create
const EMPLOYEE_CREATE_PAGES: ErpPage[] = [
  'leaves',
  'internal-chat',
];

// Pages where employees can edit (own data)
const EMPLOYEE_EDIT_PAGES: ErpPage[] = [
  'attendance',
  'documents',
];

// Role permission definitions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ALL_PAGES.map((page) => ({
    page,
    actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
  })),

  manager: ALL_PAGES.map((page) => {
    let actions: PermissionAction[] = ['view', 'create', 'edit', 'export'];

    // Add approve for specific pages
    if (MANAGER_APPROVE_PAGES.includes(page)) {
      actions = [...actions, 'approve'];
    }

    // Remove delete and approve for restricted pages (payroll, compensation, performance)
    if (MANAGER_RESTRICTED_PAGES.includes(page)) {
      actions = actions.filter((a) => a !== 'delete' && a !== 'approve');
    }

    return { page, actions };
  }),

  employee: ALL_PAGES.map((page) => {
    let actions: PermissionAction[] = ['view'];

    // Add create for leaves
    if (EMPLOYEE_CREATE_PAGES.includes(page)) {
      actions = [...actions, 'create'];
    }

    // Add edit for attendance (own records)
    if (EMPLOYEE_EDIT_PAGES.includes(page)) {
      actions = [...actions, 'edit'];
    }

    return { page, actions };
  }),

  viewer: ALL_PAGES.map((page) => ({
    page,
    actions: ['view'],
  })),
};

// Build a lookup map for fast access
const permissionMap = new Map<string, PermissionAction[]>();

for (const role of Object.keys(ROLE_PERMISSIONS) as UserRole[]) {
  for (const perm of ROLE_PERMISSIONS[role]) {
    permissionMap.set(`${role}:${perm.page}`, perm.actions);
  }
}

/**
 * Check if a role has a specific permission action on a page.
 */
export function hasPermission(role: UserRole, page: ErpPage, action: PermissionAction): boolean {
  const actions = permissionMap.get(`${role}:${page}`);
  if (!actions) return false;
  return actions.includes(action);
}

/**
 * Get all actions a role can perform on a specific page.
 */
export function getPagePermissions(role: UserRole, page: ErpPage): PermissionAction[] {
  return permissionMap.get(`${role}:${page}`) || [];
}

/**
 * Get all pages accessible (viewable) by a role.
 */
export function getAccessiblePages(role: UserRole): ErpPage[] {
  return ROLE_PERMISSIONS[role]
    .filter((perm) => perm.actions.includes('view'))
    .map((perm) => perm.page);
}

/**
 * Alias for hasPermission with reversed argument order for convenience.
 */
export function canPerform(role: UserRole, action: PermissionAction, page: ErpPage): boolean {
  return hasPermission(role, page, action);
}
