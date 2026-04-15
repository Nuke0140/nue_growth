'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { UserRole } from '../types';

const roleColors: Record<UserRole, { bg: string; text: string }> = {
  'super-admin': { bg: 'bg-red-500/15', text: 'text-red-400' },
  admin: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  sales: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  marketing: { bg: 'bg-pink-500/15', text: 'text-pink-400' },
  finance: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  hr: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  client: { bg: 'bg-sky-500/15', text: 'text-sky-400' },
  viewer: { bg: 'bg-zinc-500/15', text: 'text-zinc-400' },
};

const roleColorsLight: Record<UserRole, { bg: string; text: string }> = {
  'super-admin': { bg: 'bg-red-50', text: 'text-red-600' },
  admin: { bg: 'bg-violet-50', text: 'text-violet-600' },
  sales: { bg: 'bg-blue-50', text: 'text-blue-600' },
  marketing: { bg: 'bg-pink-50', text: 'text-pink-600' },
  finance: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  hr: { bg: 'bg-amber-50', text: 'text-amber-600' },
  client: { bg: 'bg-sky-50', text: 'text-sky-600' },
  viewer: { bg: 'bg-zinc-100', text: 'text-zinc-600' },
};

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

interface RoleChipProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export default function RoleChip({ role, size = 'sm' }: RoleChipProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const colors = isDark ? roleColors[role] : roleColorsLight[role];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium select-none',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      )}
    >
      {roleLabels[role]}
    </span>
  );
}
