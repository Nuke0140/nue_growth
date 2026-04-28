'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { hasPermission, getPagePermissions, getAccessiblePages, canPerform } from '../services/permissions';
import type { ErpPage, PermissionAction, UserRole } from '../types';

export function usePermissions() {
  const { user } = useAuthStore();

  // Get role from user, default to 'employee'
  const role: UserRole = (user as Record<string, unknown>)?.role as UserRole || 'employee';

  const check = useMemo(
    () => ({
      can: (page: ErpPage, action: PermissionAction) => hasPermission(role, page, action),
      canPerform: (action: PermissionAction, page: ErpPage) => canPerform(role, action, page),
      getPage: (page: ErpPage) => getPagePermissions(role, page),
      accessiblePages: getAccessiblePages(role),
      role,
    }),
    [role]
  );

  return check;
}
