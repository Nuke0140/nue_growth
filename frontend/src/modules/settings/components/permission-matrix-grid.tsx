'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PermissionRow, UserRole, PermissionLevel } from '../types';

interface PermissionMatrixGridProps {
  data: PermissionRow[];
  roles?: UserRole[];
  permissionFilters?: PermissionLevel[];
}

const allRoles: UserRole[] = ['super-admin', 'admin', 'sales', 'marketing', 'finance', 'hr', 'client', 'viewer'];

const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  admin: 'Admin',
  sales: 'Sales',
  marketing: 'Marketing',
  finance: 'Finance',
  hr: 'HR',
  client: 'Client',
  viewer: 'Viewer',
};

const permLabels: Record<PermissionLevel, string> = {
  none: '—',
  view: 'V',
  create: 'C',
  edit: 'E',
  delete: 'D',
  export: 'X',
  approve: 'A',
  'ai-access': 'AI',
  'automation-access': 'AT',
};

const permColors: Record<string, string> = {
  true: 'bg-emerald-500/20 text-emerald-400',
  false: 'bg-zinc-500/10 text-zinc-500',
  'partial': 'bg-amber-500/15 text-amber-400',
};

export default function PermissionMatrixGrid({
  data,
  roles = allRoles,
  permissionFilters,
}: PermissionMatrixGridProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const filteredPermissions = permissionFilters?.length
    ? data.map((row) => ({
        ...row,
        permissions: Object.fromEntries(
          Object.entries(row.permissions).map(([role, perms]) => {
            const filtered = perms.filter((p) => permissionFilters!.includes(p));
            return [role, filtered];
          }),
        ) as Record<UserRole, PermissionLevel[]>,
      }))
    : data;

  return (
    <div className={cn(
      'rounded-2xl border overflow-hidden',
      isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
    )}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
              <th className={cn('text-left px-4 py-3 text-xs font-semibold w-48', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                Module
              </th>
              {roles.map((role) => (
                <th key={role} className={cn('text-center px-2 py-3 text-[10px] font-semibold', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="truncate max-w-[80px]">{roleLabels[role]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map((row, idx) => (
              <motion.tr
                key={row.module}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  'border-b last:border-b-0 transition-colors',
                  isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]',
                )}
              >
                <td className={cn('px-4 py-3 text-xs font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                  {row.module}
                </td>
                {roles.map((role) => {
                  const perms = row.permissions[role] || [];
                  const hasFull = perms.length >= 4;
                  const hasNone = perms.length === 0;

                  return (
                    <td key={role} className="px-2 py-3 text-center">
                      {hasNone ? (
                        <span className={cn(
                          'inline-flex items-center justify-center h-6 w-6 rounded-md',
                          isDark ? 'bg-zinc-500/10' : 'bg-zinc-100',
                        )}>
                          <Minus className="w-3 h-3 text-zinc-400" />
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-0.5 flex-wrap">
                          {perms.map((perm) => (
                            <span
                              key={perm}
                              title={perm}
                              className={cn(
                                'inline-flex items-center justify-center h-6 min-w-[24px] rounded-md text-[9px] font-bold',
                                hasFull
                                  ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                                  : (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'),
                              )}
                            >
                              {permLabels[perm]}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
