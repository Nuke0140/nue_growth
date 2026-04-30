'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Mail,
  Globe,
  Shield,
  BarChart3,
  Settings,
  UserCog,
} from 'lucide-react';

// ─────────────────────────── Types ───────────────────────────

interface Role {
  id: string;
  name: string;
  description: string;
  members: number;
  icon: React.ElementType;
}

interface Module {
  id: string;
  name: string;
  icon: React.ElementType;
}

type PermissionKey = 'view' | 'create' | 'edit' | 'delete' | 'export';
type PermissionsMap = Record<string, Record<string, Record<PermissionKey, boolean>>>;

// ─────────────────────────── Data ────────────────────────────

const roles: Role[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    members: 2,
    icon: Shield,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Manage most features',
    members: 5,
    icon: UserCog,
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Leads and pipelines',
    members: 12,
    icon: Users,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campaigns and outreach',
    members: 8,
    icon: Mail,
  },
  {
    id: 'client-viewer',
    name: 'Client Viewer',
    description: 'Read-only access',
    members: 25,
    icon: Globe,
  },
];

const modules: Module[] = [
  { id: 'leads', name: 'Leads', icon: Users },
  { id: 'campaigns', name: 'Campaigns', icon: Mail },
  { id: 'billing', name: 'Billing', icon: Globe },
  { id: 'reports', name: 'Reports', icon: Shield },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const permissionKeys: { key: PermissionKey; label: string }[] = [
  { key: 'view', label: 'View' },
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'export', label: 'Export' },
];

// Default permission presets for each role
function getDefaultPermissions(): PermissionsMap {
  const allTrue: Record<PermissionKey, boolean> = {
    view: true,
    create: true,
    edit: true,
    delete: true,
    export: true,
  };

  const viewOnly: Record<PermissionKey, boolean> = {
    view: true,
    create: false,
    edit: false,
    delete: false,
    export: true,
  };

  const noDelete: Record<PermissionKey, boolean> = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    export: true,
  };

  const salesPerms: Record<PermissionKey, boolean> = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    export: true,
  };

  const marketingPerms: Record<PermissionKey, boolean> = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    export: true,
  };

  const clientPerms: Record<PermissionKey, boolean> = {
    view: true,
    create: false,
    edit: false,
    delete: false,
    export: true,
  };

  const adminModulePerms = {
    leads: allTrue,
    campaigns: allTrue,
    billing: noDelete,
    reports: allTrue,
    analytics: allTrue,
    team: noDelete,
    settings: noDelete,
  };

  const salesModulePerms = {
    leads: salesPerms,
    campaigns: viewOnly,
    billing: viewOnly,
    reports: viewOnly,
    analytics: viewOnly,
    team: { view: true, create: false, edit: false, delete: false, export: false },
    settings: { view: true, create: false, edit: false, delete: false, export: false },
  };

  const marketingModulePerms = {
    leads: marketingPerms,
    campaigns: allTrue,
    billing: viewOnly,
    reports: marketingPerms,
    analytics: marketingPerms,
    team: { view: true, create: false, edit: false, delete: false, export: false },
    settings: { view: true, create: false, edit: false, delete: false, export: false },
  };

  const clientModulePerms = {
    leads: clientPerms,
    campaigns: clientPerms,
    billing: clientPerms,
    reports: clientPerms,
    analytics: clientPerms,
    team: { view: true, create: false, edit: false, delete: false, export: false },
    settings: { view: false, create: false, edit: false, delete: false, export: false },
  };

  const superAdminModulePerms: Record<string, Record<PermissionKey, boolean>> = {};
  modules.forEach((mod) => {
    superAdminModulePerms[mod.id] = { ...allTrue };
  });

  return {
    'super-admin': superAdminModulePerms,
    admin: adminModulePerms,
    sales: salesModulePerms,
    marketing: marketingModulePerms,
    'client-viewer': clientModulePerms,
  };
}

// ─────────────────────────── Animations ──────────────────────

const roleCardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

const matrixRowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const switchTap = { scale: 0.9 };
const switchHover = { scale: 1.05 };

// ─────────────────────────── Component ───────────────────────

export default function RolePermissionMatrix() {
  const [activeRole, setActiveRole] = useState<string>('super-admin');
  const [permissions, setPermissions] = useState<PermissionsMap>(getDefaultPermissions);

  const isSuperAdmin = activeRole === 'super-admin';

  const handleToggle = (moduleId: string, permKey: PermissionKey) => {
    if (isSuperAdmin) return;

    setPermissions((prev) => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [moduleId]: {
          ...prev[activeRole][moduleId],
          [permKey]: !prev[activeRole][moduleId][permKey],
        },
      },
    }));
  };

  const activeRoleData = roles.find((r) => r.id === activeRole);

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-app-2xl"
      >
        <h2 className="text-xl font-semibold text-gray-900">
          Role-Based Permissions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure granular access controls for each role across all modules.
        </p>
      </motion.div>

      {/* Layout: Sidebar + Matrix */}
      <div className="flex flex-col gap-app-2xl lg:flex-row">
        {/* ──── Left: Role List ──── */}
        <div className="w-full shrink-0 lg:w-64">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            Roles
          </p>
          <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-x-visible lg:pb-0">
            {roles.map((role, index) => {
              const isActive = activeRole === role.id;
              const RoleIcon = role.icon;

              return (
                <motion.div
                  key={role.id}
                  custom={index}
                  variants={roleCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveRole(role.id)}
                  className={`group relative min-w-[180px] cursor-pointer rounded-[var(--app-radius-lg)] p-3 transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-[var(--app-shadow-md)]-lg shadow-[var(--app-shadow-md)]-gray-900/20'
                      : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10  w-9 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)] ${
                        isActive ? 'bg-white/15' : 'bg-gray-100'
                      }`}
                    >
                      <RoleIcon
                        className={`h-4 w-4 ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">
                          {role.name}
                        </span>
                        <span
                          className={`text-xs font-medium tabular-nums ${
                            isActive ? 'text-gray-300' : 'text-gray-400'
                          }`}
                        >
                          {role.members}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-xs leading-snug ${
                          isActive ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleIndicator"
                      className="absolute left-0 top-3 h-5 w-1 rounded-r-full bg-white"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ──── Right: Permission Matrix ──── */}
        <div className="min-w-0 flex-1">
          <Card className="overflow-hidden border border-gray-100 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
            <CardContent className="p-0">
              {/* Active role header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  {activeRoleData && (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)] bg-gray-900 text-white">
                        <activeRoleData.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {activeRoleData.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {activeRoleData.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {isSuperAdmin && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-900 text-white text-[10px] font-medium uppercase tracking-wider"
                  >
                    Full Access
                  </Badge>
                )}
              </div>

              {/* Matrix table — scrollable on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="w-36 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 sm:px-6 sm:w-44">
                        Module
                      </th>
                      {permissionKeys.map((perm) => (
                        <th
                          key={perm.key}
                          className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                          <span className="hidden sm:inline">{perm.label}</span>
                          <span className="sm:hidden">
                            {perm.label.charAt(0)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="wait">
                      {modules.map((mod, rowIndex) => {
                        const ModIcon = mod.icon;
                        const modulePerms =
                          permissions[activeRole]?.[mod.id];

                        return (
                          <motion.tr
                            key={`${activeRole}-${mod.id}`}
                            custom={rowIndex}
                            variants={matrixRowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                          >
                            {/* Module name cell */}
                            <td className="px-4 py-3 sm:px-6">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8  w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-gray-100">
                                  <ModIcon className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {mod.name}
                                </span>
                              </div>
                            </td>

                            {/* Permission cells */}
                            {permissionKeys.map((perm) => {
                              const checked = modulePerms?.[perm.key] ?? false;
                              return (
                                <td
                                  key={perm.key}
                                  className="px-4 py-3 text-center"
                                >
                                  <div className="flex items-center justify-center">
                                    <motion.div
                                      whileTap={isSuperAdmin ? undefined : switchTap}
                                      whileHover={isSuperAdmin ? undefined : switchHover}
                                    >
                                      <Switch
                                        checked={checked}
                                        disabled={isSuperAdmin}
                                        onCheckedChange={() =>
                                          handleToggle(mod.id, perm.key)
                                        }
                                        className="data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200"
                                      />
                                    </motion.div>
                                  </div>
                                </td>
                              );
                            })}
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Footer summary */}
              <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>
                    <span className="font-medium text-gray-700">
                      {activeRoleData?.members ?? 0}
                    </span>{' '}
                    members assigned
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>
                    {isSuperAdmin
                      ? 'All permissions granted — cannot be modified'
                      : 'Click toggles to adjust permissions'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
