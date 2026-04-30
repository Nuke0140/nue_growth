'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Monitor,
  Smartphone,
  Globe,
  Shield,
  ShieldCheck,
  KeyRound,
  LogIn,
  AlertTriangle,
  Trash2,
  Laptop,
  Tablet,
  MapPin,
  Clock,
  Fingerprint,
} from 'lucide-react';

// ─────────────────────────── Types ───────────────────────────

interface Session {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  isSuspicious?: boolean;
}

type HistoryAction = 'login' | 'password_changed' | '2fa_enabled';

interface LoginHistoryEntry {
  id: string;
  action: HistoryAction;
  actionLabel: string;
  device: string;
  time: string;
  date: string;
  ip: string;
  location: string;
}

// ─────────────────────────── Data ────────────────────────────

const initialSessions: Session[] = [
  {
    id: 'current',
    device: 'desktop',
    browser: 'Chrome',
    os: 'macOS Sonoma',
    location: 'Pune, India',
    ip: '103.214.xx.xx',
    lastActive: 'Just now',
    isCurrent: true,
  },
  {
    id: 's1',
    device: 'desktop',
    browser: 'Firefox',
    os: 'Windows 11',
    location: 'Mumbai, India',
    ip: '49.207.xx.xx',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 's2',
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS 18',
    location: 'Pune, India',
    ip: '103.214.xx.xx',
    lastActive: 'Active now',
    isCurrent: false,
  },
  {
    id: 's3',
    device: 'tablet',
    browser: 'Chrome',
    os: 'Android 15',
    location: 'Unknown',
    ip: '185.220.xx.xx',
    lastActive: '5 hours ago',
    isCurrent: false,
    isSuspicious: true,
  },
];

const initialHistory: LoginHistoryEntry[] = [
  {
    id: 'h1',
    action: 'login',
    actionLabel: 'Logged in',
    device: 'Chrome on macOS',
    time: '10:32 AM',
    date: 'Apr 9, 2025',
    ip: '103.214.xx.xx',
    location: 'Pune, India',
  },
  {
    id: 'h2',
    action: 'password_changed',
    actionLabel: 'Password changed',
    device: 'Chrome on macOS',
    time: '3:15 PM',
    date: 'Apr 8, 2025',
    ip: '103.214.xx.xx',
    location: 'Pune, India',
  },
  {
    id: 'h3',
    action: 'login',
    actionLabel: 'Logged in',
    device: 'Safari on iOS 18',
    time: '11:45 AM',
    date: 'Apr 8, 2025',
    ip: '103.214.xx.xx',
    location: 'Pune, India',
  },
  {
    id: 'h4',
    action: '2fa_enabled',
    actionLabel: '2FA enabled',
    device: 'Chrome on Windows 11',
    time: '9:00 AM',
    date: 'Apr 7, 2025',
    ip: '49.207.xx.xx',
    location: 'Mumbai, India',
  },
  {
    id: 'h5',
    action: 'login',
    actionLabel: 'Logged in',
    device: 'Firefox on Windows 11',
    time: '8:55 AM',
    date: 'Apr 7, 2025',
    ip: '49.207.xx.xx',
    location: 'Mumbai, India',
  },
  {
    id: 'h6',
    action: 'login',
    actionLabel: 'Logged in (suspicious)',
    device: 'Chrome on Android',
    time: '2:30 AM',
    date: 'Apr 6, 2025',
    ip: '185.220.xx.xx',
    location: 'Unknown',
  },
];

// ─────────────────────────── Helpers ─────────────────────────

const deviceIcon: Record<string, React.ElementType> = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
};

const actionConfig: Record<
  HistoryAction,
  { icon: React.ElementType; color: string; bg: string }
> = {
  login: {
    icon: LogIn,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  password_changed: {
    icon: KeyRound,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  '2fa_enabled': {
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
};

function formatSessionLabel(session: Session): string {
  return `${session.browser} on ${session.os}`;
}

// ─────────────────────────── Animations ──────────────────────

const sessionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' },
  }),
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.95,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const timelineVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' },
  }),
};

// ─────────────────────────── Component ───────────────────────

export default function ActiveSessionsCard() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const otherSessions = sessions.filter((s) => !s.isCurrent);
  const currentSession = sessions.find((s) => s.isCurrent);

  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full space-y-app-2xl">
      {/* ──── Current Session ──── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border border-gray-100 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
          <CardContent className="p-app-xl">
            <div className="flex items-start gap-4">
              {/* Device icon */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)] bg-emerald-50">
                <Monitor className="h-5 w-5 text-emerald-600" />
                {/* Green dot */}
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Current Session
                  </h3>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    This device
                  </Badge>
                </div>
                {currentSession && (
                  <>
                    <p className="mt-1 text-sm text-gray-700">
                      {formatSessionLabel(currentSession)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {currentSession.ip} &middot; {currentSession.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        Last active: {currentSession.lastActive}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ──── Other Active Sessions ──── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border border-gray-100 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)] bg-gray-100">
                  <Globe className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-sm text-gray-900">
                    Other Active Sessions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {otherSessions.length} other{' '}
                    {otherSessions.length === 1 ? 'device' : 'devices'} signed in
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {otherSessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-app-3xl text-center"
              >
                <Shield className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">
                  No other active sessions
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {otherSessions.map((session, index) => {
                    const DeviceIcon = deviceIcon[session.device];

                    return (
                      <motion.div
                        key={session.id}
                        custom={index}
                        variants={sessionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="group flex items-center gap-4 rounded-[var(--app-radius-lg)] border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50/60"
                      >
                        {/* Device icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--app-radius-lg)] bg-gray-100">
                          <DeviceIcon className="h-4.5 w-4.5 text-gray-600" />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {formatSessionLabel(session)}
                            </p>
                            {session.isSuspicious && (
                              <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px] gap-1">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                Suspicious
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.lastActive}
                            </span>
                          </div>
                        </div>

                        {/* Revoke */}
                        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevoke(session.id)}
                            className="shrink-0 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Revoke</span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Revoke all button */}
            {otherSessions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSessions((prev) => prev.filter((s) => s.isCurrent))}
                  className="w-full border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Revoke All Other Sessions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ──── Login History Timeline ──── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border border-gray-100 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--app-radius-lg)] bg-gray-100">
                <Fingerprint className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-sm text-gray-900">
                  Login History
                </CardTitle>
                <CardDescription className="text-xs">
                  Recent account activity and security events
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative pl-8">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-app-2xl">
                {initialHistory.map((entry, index) => {
                  const config = actionConfig[entry.action];
                  const ActionIcon = config.icon;
                  const isLast = index === initialHistory.length - 1;

                  return (
                    <motion.div
                      key={entry.id}
                      custom={index}
                      variants={timelineVariants}
                      initial="hidden"
                      animate="visible"
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-8 top-0.5 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white ${config.bg} shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]`}
                      >
                        <ActionIcon className={`h-3 w-3 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className={`pb-0 ${!isLast ? 'pb-6' : ''}`}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {entry.actionLabel}
                            </p>
                            <p className="text-xs text-gray-500">{entry.device}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-700">
                              {entry.time}
                            </p>
                            <p className="text-xs text-gray-400">{entry.date}</p>
                          </div>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {entry.ip} &middot; {entry.location}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
