'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Shield, Copy, Edit, Plus, Eye, EyeOff, ArrowRight, Users,
  Check, X, Minus,
} from 'lucide-react';
import PermissionMatrixGrid from './components/permission-matrix-grid';
import { permissionMatrix, rolePresets } from './data/mock-data';
import type { UserRole, PermissionLevel } from './types';

const roleTabs: (UserRole | 'all')[] = ['all', 'super-admin', 'admin', 'sales', 'marketing', 'finance', 'hr', 'client', 'viewer'];

const roleLabels: Record<string, string> = {
  all: 'All Roles',
  'super-admin': 'Super Admin',
  admin: 'Admin',
  sales: 'Sales',
  marketing: 'Marketing',
  finance: 'Finance',
  hr: 'HR',
  client: 'Client',
  viewer: 'Viewer',
};

const permissionFilters: { label: string; value: PermissionLevel }[] = [
  { label: 'View', value: 'view' },
  { label: 'Create', value: 'create' },
  { label: 'Edit', value: 'edit' },
  { label: 'delete', value: 'delete' },
  { label: 'Export', value: 'export' },
  { label: 'Approve', value: 'approve' },
  { label: 'AI Access', value: 'ai-access' },
  { label: 'Automation', value: 'automation-access' },
];

const allRoles: UserRole[] = ['super-admin', 'admin', 'sales', 'marketing', 'finance', 'hr', 'client', 'viewer'];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function PermissionsMatrixPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeRoleTab, setActiveRoleTab] = useState<string>('all');
  const [activePermissions, setActivePermissions] = useState<Set<string>>(new Set());
  const [diffRoleA, setDiffRoleA] = useState<UserRole>('admin');
  const [diffRoleB, setDiffRoleB] = useState<UserRole>('sales');

  const filteredRoles = activeRoleTab === 'all'
    ? allRoles
    : [activeRoleTab as UserRole];

  const activePermFilters = Array.from(activePermissions) as PermissionLevel[];

  const togglePermFilter = (perm: string) => {
    setActivePermissions((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return next;
    });
  };

  // Build diff data
  const diffModules = permissionMatrix.map((row) => {
    const permsA = row.permissions[diffRoleA] || [];
    const permsB = row.permissions[diffRoleB] || [];
    const onlyA = permsA.filter((p) => !permsB.includes(p));
    const onlyB = permsB.filter((p) => !permsA.includes(p));
    const shared = permsA.filter((p) => permsB.includes(p));
    return { module: row.module, onlyA, onlyB, shared };
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]',
            )}>
              <Shield className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Permissions Matrix</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Role-based access control configuration
              </p>
            </div>
          </div>
          <button className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
            isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
          )}>
            <Plus className="w-4 h-4" />
            Create Custom Role
          </button>
        </div>

        {/* ── Role Preset Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {roleTabs.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleTab(role)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                activeRoleTab === role
                  ? (isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200')
                  : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.04] hover:bg-black/[0.04]'),
              )}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>

        {/* ── Permission Filter Chips ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className={cn('text-[10px] font-medium shrink-0 mr-1', isDark ? 'text-white/30' : 'text-black/30')}>
            Filter:
          </span>
          {permissionFilters.map((perm) => (
            <button
              key={perm.value}
              onClick={() => togglePermFilter(perm.value)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap transition-colors shrink-0',
                activePermissions.has(perm.value)
                  ? (isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                  : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.04] hover:bg-black/[0.04]'),
              )}
            >
              {activePermissions.has(perm.value) && <Check className="w-3 h-3" />}
              {perm.label}
            </button>
          ))}
          {activePermissions.size > 0 && (
            <button
              onClick={() => setActivePermissions(new Set())}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium shrink-0 transition-colors',
                isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50',
              )}
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* ── Permission Matrix Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <PermissionMatrixGrid
            data={permissionMatrix}
            roles={filteredRoles}
            permissionFilters={activePermFilters.length > 0 ? activePermFilters : undefined}
          />
        </motion.div>

        {/* ── Role Presets ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Role Presets
            </span>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {rolePresets.map((preset) => (
              <motion.div
                key={preset.id}
                variants={fadeUp}
                className={cn(
                  'rounded-2xl border p-4 shadow-sm transition-all',
                  isDark ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                      {preset.name}
                    </p>
                    {!preset.isCustom && (
                      <span className={cn('text-[9px]', isDark ? 'text-white/25' : 'text-black/25')}>
                        System preset
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                      isDark ? 'hover:bg-white/[0.06] text-white/40 hover:text-white' : 'hover:bg-black/[0.06] text-black/40 hover:text-black',
                    )}>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                      isDark ? 'hover:bg-white/[0.06] text-white/40 hover:text-white' : 'hover:bg-black/[0.06] text-black/40 hover:text-black',
                    )}>
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className={cn('text-[10px] leading-relaxed line-clamp-2 mb-3', isDark ? 'text-white/40' : 'text-black/40')}>
                  {preset.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                    isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.04] text-black/50',
                  )}>
                    <Users className="w-3 h-3" />
                    {preset.userCount} user{preset.userCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Permission Diff Preview ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={cn(
            'rounded-2xl border p-5 md:p-6',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
              Permission Diff Preview
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={diffRoleA}
                onChange={(e) => setDiffRoleA(e.target.value as UserRole)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-xs appearance-none',
                  isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-black/[0.02] border-black/[0.08] text-black',
                )}
              >
                {allRoles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
              </select>
              <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>vs</span>
              <select
                value={diffRoleB}
                onChange={(e) => setDiffRoleB(e.target.value as UserRole)}
                className={cn(
                  'rounded-lg border px-2 py-1 text-xs appearance-none',
                  isDark ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-black/[0.02] border-black/[0.08] text-black',
                )}
              >
                {allRoles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded-sm', isDark ? 'bg-blue-500/30' : 'bg-blue-200')} />
              <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Only {roleLabels[diffRoleA]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded-sm', isDark ? 'bg-violet-500/30' : 'bg-violet-200')} />
              <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Only {roleLabels[diffRoleB]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded-sm', isDark ? 'bg-emerald-500/30' : 'bg-emerald-200')} />
              <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>Shared</span>
            </div>
          </div>

          {/* Diff Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Header */}
              <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-2 mb-2">
                <span className={cn('text-[10px] font-semibold', isDark ? 'text-white/30' : 'text-black/30')}>Module</span>
                <span className={cn('text-[10px] font-semibold text-center', isDark ? 'text-blue-400' : 'text-blue-600')}>{roleLabels[diffRoleA]}</span>
                <span className={cn('text-[10px] font-semibold text-center', isDark ? 'text-violet-400' : 'text-violet-600')}>{roleLabels[diffRoleB]}</span>
                <span className={cn('text-[10px] font-semibold text-center', isDark ? 'text-emerald-400' : 'text-emerald-600')}>Shared</span>
              </div>

              {diffModules.map((row, i) => (
                <motion.div
                  key={row.module}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'grid grid-cols-[200px_1fr_1fr_1fr] gap-2 py-2 items-center',
                    i < diffModules.length - 1 && (isDark ? 'border-b border-white/[0.04]' : 'border-b border-black/[0.04]'),
                  )}
                >
                  <span className={cn('text-xs font-medium truncate', isDark ? 'text-white/70' : 'text-black/70')}>
                    {row.module}
                  </span>
                  {/* Only A */}
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {row.onlyA.length > 0 ? row.onlyA.map((p) => (
                      <span key={p} className={cn(
                        'rounded-md px-1.5 py-0.5 text-[9px] font-bold',
                        isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-700',
                      )}>
                        {p}
                      </span>
                    )) : (
                      <Minus className="w-3 h-3 text-zinc-500" />
                    )}
                  </div>
                  {/* Only B */}
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {row.onlyB.length > 0 ? row.onlyB.map((p) => (
                      <span key={p} className={cn(
                        'rounded-md px-1.5 py-0.5 text-[9px] font-bold',
                        isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-100 text-violet-700',
                      )}>
                        {p}
                      </span>
                    )) : (
                      <Minus className="w-3 h-3 text-zinc-500" />
                    )}
                  </div>
                  {/* Shared */}
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {row.shared.length > 0 ? row.shared.map((p) => (
                      <span key={p} className={cn(
                        'rounded-md px-1.5 py-0.5 text-[9px] font-bold',
                        isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
                      )}>
                        {p}
                      </span>
                    )) : (
                      <Minus className="w-3 h-3 text-zinc-500" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
