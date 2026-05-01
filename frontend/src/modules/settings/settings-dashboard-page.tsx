'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Settings, Users, Building2, Palette, Shield, CreditCard, BrainCircuit,
  CircleAlert, AlertTriangle, AlertCircle, Info, X, Clock, ChevronRight,
  Database, Zap, Puzzle, FileText, BellRing, Key, Flag, Lock,
} from 'lucide-react';
import KPICard from './components/kpi-card';
import SettingsNavCard from './components/settings-nav-card';
import { settingsKPIs, settingsAlerts, auditLogs } from './data/mock-data';
import type { SettingsPage } from './types';

const iconMap: Record<string, React.ElementType> = {
  Users, Building2, Database, Zap, AlertTriangle, Shield, BrainCircuit, CreditCard, Puzzle, FileText,
};

const navCards: { title: string; description: string; icon: React.ElementType; page: SettingsPage; badge?: string }[] = [
  { title: 'Workspace Profile', description: 'Manage workspace identity, defaults, and onboarding', icon: Building2, page: 'workspace-profile' },
  { title: 'Branding & White Label', description: 'Customize logos, colors, typography, and client portal', icon: Palette, page: 'branding-white-label' },
  { title: 'Users & Roles', description: 'Manage team members, invitations, and role assignments', icon: Users, page: 'users-roles', badge: '47 users' },
  { title: 'Security & Compliance', description: 'MFA policies, password rules, SSO, and SOC2/GDPR', icon: Shield, page: 'security-compliance', badge: '2 alerts' },
  { title: 'Billing & Subscription', description: 'Plans, invoices, payment methods, and usage limits', icon: CreditCard, page: 'billing-subscription' },
  { title: 'AI Controls', description: 'Token limits, mode config, prompt logging, and role quotas', icon: BrainCircuit, page: 'ai-controls', badge: 'AI' },
];

const severityConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  critical: { icon: CircleAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-l-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-l-amber-500' },
  info: { icon: Info, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-l-sky-500' },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
};

export default function SettingsDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const activeAlerts = settingsAlerts.filter((a) => !dismissedAlerts.has(a.id));
  const recentLogs = auditLogs.slice(0, 5);

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(id));
  };

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
              <Settings className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Settings Dashboard</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                Your admin command center
              </p>
            </div>
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {settingsKPIs.map((kpi) => (
            <motion.div key={kpi.id} variants={fadeUp}>
              <KPICard
                label={kpi.label}
                value={kpi.formattedValue}
                change={kpi.change}
                changeLabel={kpi.changeLabel}
                icon={iconMap[kpi.icon]}
                severity={kpi.severity || 'normal'}
                trend={kpi.trend}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Quick Navigation ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Quick Navigation
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {navCards.map((card) => (
              <SettingsNavCard
                key={card.page}
                title={card.title}
                description={card.description}
                icon={card.icon}
                page={card.page}
                badge={card.badge}
              />
            ))}
          </div>
        </div>

        {/* ── Alerts Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Active Alerts
            </span>
            <span className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
              isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600',
            )}>
              {activeAlerts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlerts.map((alert, i) => {
              const config = severityConfig[alert.severity] || severityConfig.info;
              const AlertIcon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-2xl border-l-4 shadow-sm transition-all duration-200',
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-black/[0.02] border border-black/[0.06] hover:bg-black/[0.04]',
                    config.border,
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <AlertIcon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{alert.title}</p>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className={cn(
                          'shrink-0 h-6 w-6 rounded-lg flex items-center justify-center transition-colors',
                          isDark ? 'hover:bg-white/[0.06] text-zinc-500 hover:text-white' : 'hover:bg-black/[0.06] text-zinc-400 hover:text-black',
                        )}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                        {new Date(alert.detectedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {alert.actionUrl && (
                        <button className={cn(
                          'text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors',
                          isDark ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]' : 'bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08]',
                        )}>
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Recent Activity Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>
              Recent Activity
            </span>
          </div>
          <div className={cn(
            'rounded-2xl border p-4',
            isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
          )}>
            <div className="space-y-0">
              {recentLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.06, duration: 0.3 }}
                  className={cn(
                    'flex items-start gap-3 py-3',
                    i < recentLogs.length - 1 && (isDark ? 'border-b border-white/[0.04]' : 'border-b border-black/[0.04]'),
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0 mt-1.5',
                    log.severity === 'critical'
                      ? 'bg-red-500'
                      : log.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500',
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-xs', isDark ? 'text-white/80' : 'text-black/80')}>
                      <span className="font-semibold">{log.actor}</span>
                      <span className="mx-1.5">→</span>
                      <span>{log.action}</span>
                    </p>
                    <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
                      {log.module} · {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium capitalize',
                    log.severity === 'critical'
                      ? (isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600')
                      : log.severity === 'warning'
                        ? (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600')
                        : (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'),
                  )}>
                    {log.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
