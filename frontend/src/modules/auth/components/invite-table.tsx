'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Upload,
  Send,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Users,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
} from 'lucide-react';

// ─────────────────────────── Types ───────────────────────────

type InviteStatus = 'pending' | 'accepted' | 'expired';
type InviteRole = 'Admin' | 'Sales' | 'Marketing' | 'Viewer';
type Department = 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance' | 'Operations';

interface PendingInvite {
  id: string;
  email: string;
  role: InviteRole;
  department: Department;
  status: InviteStatus;
  invitedDate: string;
}

// ─────────────────────────── Data ────────────────────────────

const initialInvites: PendingInvite[] = [
  {
    id: '1',
    email: 'sarah.chen@company.com',
    role: 'Admin',
    department: 'Engineering',
    status: 'pending',
    invitedDate: '2025-04-08',
  },
  {
    id: '2',
    email: 'marcus.williams@company.com',
    role: 'Sales',
    department: 'Sales',
    status: 'accepted',
    invitedDate: '2025-04-06',
  },
  {
    id: '3',
    email: 'priya.sharma@company.com',
    role: 'Marketing',
    department: 'Marketing',
    status: 'pending',
    invitedDate: '2025-04-07',
  },
  {
    id: '4',
    email: 'james.morrison@company.com',
    role: 'Viewer',
    department: 'Finance',
    status: 'expired',
    invitedDate: '2025-03-20',
  },
  {
    id: '5',
    email: 'elena.kowalski@company.com',
    role: 'Sales',
    department: 'Operations',
    status: 'pending',
    invitedDate: '2025-04-09',
  },
  {
    id: '6',
    email: 'david.okonkwo@company.com',
    role: 'Admin',
    department: 'HR',
    status: 'pending',
    invitedDate: '2025-04-05',
  },
];

const roleOptions: InviteRole[] = ['Admin', 'Sales', 'Marketing', 'Viewer'];
const departmentOptions: Department[] = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
];

// ─────────────────────────── Helpers ─────────────────────────

const statusConfig: Record<
  InviteStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  expired: {
    label: 'Expired',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
    icon: XCircle,
  },
};

const roleVariant: Record<InviteRole, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Admin: 'default',
  Sales: 'secondary',
  Marketing: 'secondary',
  Viewer: 'outline',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─────────────────────────── Animations ──────────────────────

const rowVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
  exit: {
    opacity: 0,
    x: -30,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
};

// ─────────────────────────── Component ───────────────────────

export default function InviteTable() {
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole | ''>('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendInvite = () => {
    if (!email || !role || !department) return;

    setSending(true);
    // Simulate async send
    setTimeout(() => {
      const newInvite: PendingInvite = {
        id: Date.now().toString(),
        email,
        role: role as InviteRole,
        department: department as Department,
        status: 'pending',
        invitedDate: new Date().toISOString().split('T')[0],
      };
      setInvites((prev) => [newInvite, ...prev]);
      setEmail('');
      setRole('');
      setDepartment('');
      setMessage('');
      setShowMessage(false);
      setSending(false);
    }, 800);
  };

  const handleResend = (id: string) => {
    setInvites((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: 'pending' as InviteStatus,
              invitedDate: new Date().toISOString().split('T')[0],
            }
          : inv,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  };

  const pendingCount = invites.filter((i) => i.status === 'pending').length;

  return (
    <div className="w-full space-y-6">
      {/* ──── Invite Form Card ──── */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base text-gray-900">
                  Invite Team Member
                </CardTitle>
                <CardDescription className="text-xs">
                  Send an invitation to add a new member to your workspace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 border-gray-200 focus-visible:border-gray-400 focus-visible:ring-gray-200"
                />
              </div>
            </div>

            {/* Role + Department row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as InviteRole)}>
                  <SelectTrigger className="w-full border-gray-200 focus:ring-gray-200">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Department</Label>
                <Select
                  value={department}
                  onValueChange={(v) => setDepartment(v as Department)}
                >
                  <SelectTrigger className="w-full border-gray-200 focus:ring-gray-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Optional message (collapsible) */}
            <div>
              <button
                type="button"
                onClick={() => setShowMessage((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showMessage ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                Add optional message
              </button>
              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a personal note to the invitation..."
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                onClick={handleSendInvite}
                disabled={!email || !role || !department || sending}
                className="bg-gray-900 text-white hover:bg-gray-800 gap-2"
              >
                {sending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? 'Sending...' : 'Send Invite'}
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ──── Pending Invites Section ──── */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <Inbox className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-base text-gray-900">
                    Pending Invitations
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {invites.length} total{' '}
                    {pendingCount > 0 && (
                      <span className="text-amber-600">
                        &middot; {pendingCount} pending
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {invites.length === 0 ? (
              /* ── Empty State ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  No invitations sent yet
                </h3>
                <p className="mt-1 max-w-xs text-xs text-gray-500">
                  Invite team members by entering their email address and
                  selecting a role above.
                </p>
              </motion.div>
            ) : (
              <>
                {/* ── Desktop Table ── */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Email
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Role
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Department
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Status
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Invited
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {invites.map((invite, index) => {
                          const statusInfo = statusConfig[invite.status];
                          const StatusIcon = statusInfo.icon;

                          return (
                            <motion.tr
                              key={invite.id}
                              custom={index}
                              variants={rowVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                              style={{ overflow: 'hidden' }}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                    {invite.email
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                    {invite.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant={roleVariant[invite.role]} className="text-[11px]">
                                  {invite.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600">
                                  {invite.department}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={`gap-1 text-[11px] ${statusInfo.className}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {statusInfo.label}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-500">
                                  {formatDate(invite.invitedDate)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  {(invite.status === 'pending' || invite.status === 'expired') && (
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      whileHover={{ scale: 1.05 }}
                                      onClick={() => handleResend(invite.id)}
                                      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <RefreshCw className="h-3 w-3" />
                                      Resend
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleCancel(invite.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    aria-label="Cancel invitation"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile Cards ── */}
                <div className="space-y-3 md:hidden">
                  <AnimatePresence>
                    {invites.map((invite, index) => {
                      const statusInfo = statusConfig[invite.status];
                      const StatusIcon = statusInfo.icon;

                      return (
                        <motion.div
                          key={invite.id}
                          custom={index}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="rounded-xl border border-gray-100 bg-white p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                {invite.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {invite.email}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant={roleVariant[invite.role]}
                                    className="text-[10px]"
                                  >
                                    {invite.role}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {invite.department}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`shrink-0 gap-1 text-[10px] ${statusInfo.className}`}
                            >
                              <StatusIcon className="h-2.5 w-2.5" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatDate(invite.invitedDate)}
                            </span>
                            <div className="flex items-center gap-2">
                              {(invite.status === 'pending' || invite.status === 'expired') && (
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleResend(invite.id)}
                                  className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-700"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Resend
                                </motion.button>
                              )}
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCancel(invite.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                aria-label="Cancel invitation"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
