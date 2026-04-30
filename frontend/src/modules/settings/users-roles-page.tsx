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
      <div className="space-y-app-2xl">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center',
              'bg-[var(--app-hover-bg)]',
            )}>
              <Users className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Users & Roles</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                Manage users and their access
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--app-radius-lg)] px-4 py-2.5 text-sm font-medium transition-colors',
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
                'rounded-[var(--app-radius-xl)] border p-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              </div>
              <p className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
                {kpi.value}
              </p>
              <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
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
                  ? ('bg-[var(--app-info-bg)] text-[var(--app-info)] border border-[var(--app-info)]/30')
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
            'flex items-center gap-2 rounded-[var(--app-radius-lg)] border px-3 py-2 flex-1 max-w-sm',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}>
            <Search className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className={cn(
                'bg-transparent text-sm focus:outline-none w-full',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
              )}
            />
          </div>
          {selectedUsers.size > 0 && (
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-medium', 'text-[var(--app-text-secondary)]')}>
                {selectedUsers.size} selected
              </span>
              <button className={cn(
                'inline-flex items-center gap-1 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
                isDark ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-red-50 text-red-600 hover:bg-red-100',
              )}>
                <Power className="w-4 h-4" /> Deactivate
              </button>
              <button className={cn(
                'inline-flex items-center gap-1 rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
                isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
              )}>
                <Edit className="w-4 h-4" /> Change Role
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
            'rounded-[var(--app-radius-xl)] border overflow-hidden hidden lg:block',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className={cn('border-b', 'border-[var(--app-border)]')}>
                  <th className="px-4 py-3 text-left">
                    <button onClick={toggleSelectAll}>
                      {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                        <CheckSquare className={cn('w-4 h-4', 'text-[var(--app-info)]')} />
                      ) : (
                        <Square className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
                      )}
                    </button>
                  </th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Name</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Email</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Role</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Department</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>MFA</th>
                  <th className={cn('px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Last Login</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Status</th>
                  <th className={cn('px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Sessions</th>
                  <th className={cn('px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    variants={fadeUp}
                    className={cn(
                      'border-b last:border-b-0 transition-colors',
                      'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]',
                      selectedUsers.has(user.id) && (isDark ? 'bg-blue-500/5' : 'bg-blue-50/50'),
                    )}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser(user.id)}>
                        {selectedUsers.has(user.id) ? (
                          <CheckSquare className={cn('w-4 h-4', 'text-[var(--app-info)]')} />
                        ) : (
                          <Square className={cn('w-4 h-4', 'text-[var(--app-text-disabled)]')} />
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
                        <span className={cn('text-sm font-medium', 'text-[var(--app-text)]')}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                        {user.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RoleChip role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                        {user.department || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.mfaEnabled ? (
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          'bg-[var(--app-success-bg)] text-[var(--app-success)]',
                        )}>
                          <ShieldCheck className="w-4 h-4" />
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
                      <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
                        {new Date(user.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        user.status === 'active'
                          ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]')
                          : (isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-500'),
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                        {user.activeSessions}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className={cn(
                          'h-8  w-7 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                          isDark ? 'hover:bg-white/[0.06] text-white/40 hover:text-white' : 'hover:bg-black/[0.06] text-black/40 hover:text-black',
                        )}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={cn(
                          'h-8  w-7 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                          isDark ? 'hover:bg-red-500/10 text-white/40 hover:text-red-400' : 'hover:bg-red-50 text-black/40 hover:text-red-500',
                        )}>
                          <Power className="w-4 h-4" />
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
                'rounded-[var(--app-radius-xl)] border p-4',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
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
                    <p className={cn('text-sm font-medium truncate', 'text-[var(--app-text)]')}>
                      {user.name}
                    </p>
                    <p className={cn('text-xs truncate', 'text-[var(--app-text-muted)]')}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <RoleChip role={user.role} />
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
                <div className="flex items-center gap-1.5">
                  {user.mfaEnabled ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldOff className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>MFA</span>
                </div>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  user.status === 'active'
                    ? ('bg-[var(--app-success-bg)] text-[var(--app-success)]')
                    : (isDark ? 'bg-zinc-500/15 text-zinc-400' : 'bg-zinc-100 text-zinc-500'),
                )}>
                  {user.status}
                </span>
                <span className={cn('text-[10px] ml-auto', 'text-[var(--app-text-muted)]')}>
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
                  'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-[var(--app-radius-xl)] border shadow-[var(--app-shadow-md)]-xl p-app-xl z-50',
                  'bg-[var(--app-card-bg)] border-[var(--app-border)]',
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                    Invite User
                  </h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={cn(
                      'h-8  w-7 rounded-[var(--app-radius-lg)] flex items-center justify-center transition-colors',
                      isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40',
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Email Address</label>
                    <div className={cn(
                      'flex items-center gap-2 rounded-[var(--app-radius-lg)] border px-3 py-2.5',
                      isDark ? 'bg-white/[0.04] border-white/[0.08]' : 'bg-black/[0.02] border-black/[0.08]',
                    )}>
                      <Mail className={cn('w-4 h-4 shrink-0', 'text-[var(--app-text-muted)]')} />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="user@company.com"
                        className={cn(
                          'bg-transparent text-sm focus:outline-none w-full',
                          'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]',
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={cn('text-xs font-medium', 'text-[var(--app-text-muted)]')}>Role</label>
                    <div className="flex flex-wrap gap-2">
                      {(['admin', 'sales', 'marketing', 'finance', 'hr', 'viewer'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => setInviteRole(role)}
                          className={cn(
                            'rounded-[var(--app-radius-lg)] px-3 py-1.5 text-xs font-medium transition-colors',
                            inviteRole === role
                              ? ('bg-[var(--app-info-bg)] text-[var(--app-info)] border border-[var(--app-info)]/30')
                              : (isDark ? 'bg-white/[0.04] text-zinc-400 border border-white/[0.08]' : 'bg-black/[0.02] text-zinc-500 border border-black/[0.06]'),
                          )}
                        >
                          {roleLabels[role]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className={cn(
                    'w-full rounded-[var(--app-radius-lg)] py-2.5 text-sm font-medium transition-colors',
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
