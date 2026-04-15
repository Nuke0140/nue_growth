'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Users, UserPlus, Search, MoreHorizontal, Shield, ShieldCheck,
  ShieldOff, Edit, Power, CheckSquare, Square, Mail, X,
} from 'lucide-react';
import RoleChip from './components/role-chip';
import { users } from './data/mock-data';
import type { UserRole } from './types';

const roleTabs: (UserRole | 'All')[] = ['All', 'super-admin', 'admin', 'sales', 'marketing', 'finance', 'hr', 'client', 'viewer'];
const roleLabels: Record<string, string> = {
  'All': 'All',
  'super-admin': 'Super Admin',
  admin: 'Admin',
  sales: 'Sales',
  marketing: 'Marketing',
  finance: 'Finance',
  hr: 'HR',
  client: 'Client',
  viewer: 'Viewer',
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function UsersRolesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeRole, setActiveRole] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = activeRole === 'All' || u.role === activeRole;
      const matchesSearch = !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [activeRole, searchQuery]);

  const summaryStats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    roles: new Set(users.map((u) => u.role)).size,
  }), []);

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const summaryKPIs = [
    { label: 'Total Users', value: summaryStats.total, icon: Users, color: 'text-blue-400' },
    { label: 'Active', value: summaryStats.active, icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Inactive', value: summaryStats.inactive, icon: ShieldOff, color: 'text-zinc-400' },
    { label: 'Roles', value: summaryStats.roles, icon: Shield, color: 'text-violet-400' },
  ];

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
              <Users className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Users & Roles</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Manage users and their access
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              isDark
                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
            )}
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        </div>

        {/* ── Summary KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryKPIs.map((kpi) => (
            <div
              key={kpi.label}
              className={cn(
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              </div>
              <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-zinc-900')}>
                {kpi.value}
              </p>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Role Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {roleTabs.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                activeRole === role
                  ? (isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200')
                  : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.04] hover:bg-black/[0.04]'),
              )}
            >
              {roleLabels[role]}
            </button>
          ))}
        </div>

        {/* ── Search + Bulk Actions ── */}
        <div className="flex items-center justify-between gap-4">
          <div className={cn(
            'flex items-center gap-2 rounded-xl border px-3 py-2 flex-1 max-w-sm',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25',
              )}
            />
          </div>
          {selectedUsers.size > 0 && (
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-medium', isDark ? 'text-white/50' : 'text-black/50')}>
                {selectedUsers.size} selected
              </span>
              <button className={cn(
                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
              )}>
                <Power className="w-3 h-3" /> Deactivate
              </button>
              <button className={cn(
                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
              )}>
                <Edit className="w-3 h-3" /> Change Role
              </button>
            </div>
          )}
        </div>

        {/* ── Users Table (Desktop) ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={cn(
            'rounded-2xl border overflow-hidden hidden lg:block',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className={cn('border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
                  <th className="px-4 py-3 text-left">
                    <button onClick={toggleSelectAll}>
                      {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                        <CheckSquare className={cn('w-4 h-4', isDark ? 'text-blue-400' : 'text-blue-500')} />
                      ) : (
                        <Square className={cn('w-4 h-4', isDark ? 'text-white/20' : 'text-black/20')} />
                      )}
                    </button>
                  </th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Name</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Email</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Role</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Department</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>MFA</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Last Login</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Status</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Sessions</th>
                  <th className={cn('px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/30' : 'text-black/30')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    variants={fadeUp}
                    className={cn(
                      'border-b last:border-b-0 transition-colors',
                      isDark ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-black/[0.04] hover:bg-black/[0.02]',
                      selectedUsers.has(user.id) && (isDark ? 'bg-blue-500/5' : 'bg-blue-50/50'),
                    )}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser(user.id)}>
                        {selectedUsers.has(user.id) ? (
                          <CheckSquare className={cn('w-4 h-4', isDark ? 'text-blue-400' : 'text-blue-500')} />
                        ) : (
                          <Square className={cn('w-4 h-4', isDark ? 'text-white/15' : 'text-black/15')} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                          isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.06] text-black/70',
                        )}>
                          {user.name.charAt(0)}
                        </div>
                        <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-zinc-900')}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs', isDark ? 'text-white/60' : 'text-black/60')}>
                        {user.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RoleChip role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                        {user.department || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.mfaEnabled ? (
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
                        )}>
                          <ShieldCheck className="w-3 h-3" />
                          On
                        </span>
                      ) : (
                        <span className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                          isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-500',
                        )}>
                          Off
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>
                        {new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        user.status === 'active'
                          ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                          : (isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-500'),
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-black/50')}>
                        {user.activeSessions}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className={cn(
                          'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                          isDark ? 'hover:bg-white/[0.06] text-white/40 hover:text-white' : 'hover:bg-black/[0.06] text-black/40 hover:text-black',
                        )}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className={cn(
                          'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                          isDark ? 'hover:bg-red-500/10 text-white/40 hover:text-red-400' : 'hover:bg-red-50 text-black/40 hover:text-red-500',
                        )}>
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Users Card Layout (Mobile) ── */}
        <div className="lg:hidden space-y-3">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                    isDark ? 'bg-white/[0.08] text-white/70' : 'bg-black/[0.06] text-black/70',
                  )}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-zinc-900')}>
                      {user.name}
                    </p>
                    <p className={cn('text-xs truncate', isDark ? 'text-white/40' : 'text-black/40')}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <RoleChip role={user.role} />
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-1.5">
                  {user.mfaEnabled ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ShieldOff className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-black/40')}>MFA</span>
                </div>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  user.status === 'active'
                    ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                    : (isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-500'),
                )}>
                  {user.status}
                </span>
                <span className={cn('text-[10px] ml-auto', isDark ? 'text-white/30' : 'text-black/30')}>
                  {user.activeSessions} sessions
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Invite User Modal ── */}
        <AnimatePresence>
          {showInviteModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowInviteModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={cn(
                  'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-2xl border shadow-xl p-5 z-50',
                  isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-black/[0.08]',
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-zinc-900')}>
                    Invite User
                  </h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                      isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40',
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={cn('text-xs font-medium', isDark ? 'text-zinc-400' : 'text-zinc-500')}>Email Address</label>
                    <div className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-2.5',
                      isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-black/[0.02] border-black/[0.08]',
                    )}>
                      <Mail className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="user@company.com"
                        className={cn(
                          'bg-transparent text-sm focus:outline-none w-full',
                          isDark ? 'text-white placeholder:text-white/25' : 'text-black placeholder:text-black/25',
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={cn('text-xs font-medium', isDark ? 'text-zinc-400' : 'text-zinc-500')}>Role</label>
                    <div className="flex flex-wrap gap-2">
                      {(['admin', 'sales', 'marketing', 'finance', 'hr', 'viewer'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => setInviteRole(role)}
                          className={cn(
                            'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                            inviteRole === role
                              ? (isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200')
                              : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.08]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.06]'),
                          )}
                        >
                          {roleLabels[role]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className={cn(
                    'w-full rounded-xl py-2.5 text-sm font-medium transition-colors',
                    isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                  )}>
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Send Invitation
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
