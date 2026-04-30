'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Server,
  Globe,
  Bug,
  Terminal,
  Layers,
  CheckCircle2,
  XCircle,
  Rocket,
  Power,
  ChevronDown,
} from 'lucide-react';
import { environments } from './data/mock-data';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const typeBadge: Record<string, { dark: string; light: string }> = {
  production: { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  staging: { dark: 'bg-amber-500/15 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  development: { dark: 'bg-blue-500/15 text-blue-400', light: 'bg-blue-50 text-blue-600' },
};

const verbosityLevels = ['debug', 'info', 'warn', 'error'] as const;

const deploymentChecklist = [
  { label: 'All tests passing in CI/CD', completed: true },
  { label: 'Database migrations applied', completed: true },
  { label: 'Environment variables validated', completed: true },
  { label: 'Staging smoke tests passed', completed: false },
];

export default function EnvironmentConfigPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [defaultEnv, setDefaultEnv] = useState('production');
  const [envStates, setEnvStates] = useState<Record<string, boolean>>(
    Object.fromEntries(environments.map((e) => [e.id, e.status === 'active'])),
  );
  const [debugModes, setDebugModes] = useState<Record<string, boolean>>(
    Object.fromEntries(environments.map((e) => [e.id, e.debugMode])),
  );
  const [apiUrls, setApiUrls] = useState<Record<string, string>>(
    Object.fromEntries(environments.map((e) => [e.id, e.apiBaseUrl])),
  );
  const [verbosity, setVerbosity] = useState<Record<string, string>>(
    Object.fromEntries(environments.map((e) => [e.id, e.logVerbosity])),
  );

  const toggleEnv = (id: string) => setEnvStates((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleDebug = (id: string) => setDebugModes((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Server className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Environment Config</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage deployment environments</p>
            </div>
          </div>
        </motion.div>

        {/* ── Environment Cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {environments.map((env) => {
            const badge = typeBadge[env.type];
            const isActive = envStates[env.id] ?? env.status === 'active';
            return (
              <motion.div
                key={env.id}
                variants={fadeUp}
                className={cn(
                  'rounded-2xl border p-5',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2.5 w-2.5 rounded-full', isActive ? 'bg-emerald-400' : 'bg-zinc-400')} />
                    <h3 className="text-sm font-semibold">{env.name}</h3>
                  </div>
                  <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold capitalize', isDark ? badge.dark : badge.light)}>
                    {env.type}
                  </span>
                </div>

                {/* API Base URL */}
                <div className="mb-4">
                  <label className={cn('text-[10px] font-semibold uppercase tracking-wider block mb-1.5', 'text-[var(--app-text-muted)]')}>
                    API Base URL
                  </label>
                  <div className="relative">
                    <Globe className={cn('absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                    <input
                      type="text"
                      value={apiUrls[env.id] ?? ''}
                      onChange={(e) => setApiUrls((prev) => ({ ...prev, [env.id]: e.target.value }))}
                      className={cn(
                        'w-full rounded-lg border pl-8 pr-3 py-2 text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                        isDark
                          ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20'
                          : 'bg-black/[0.03] border-black/[0.08] text-black placeholder:text-black/20',
                      )}
                    />
                  </div>
                </div>

                {/* Debug Mode + Log Verbosity */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={cn('rounded-xl border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bug className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                        <span className="text-[10px] font-semibold">Debug</span>
                      </div>
                      <span className={cn('h-2 w-2 rounded-full', debugModes[env.id] ? 'bg-amber-400' : isDark ? 'bg-zinc-600' : 'bg-zinc-300')} />
                    </div>
                    <button
                      onClick={() => toggleDebug(env.id)}
                      className={cn(
                        'mt-2 text-[10px] font-medium transition-colors cursor-pointer',
                        isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500',
                      )}
                    >
                      {debugModes[env.id] ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className={cn('rounded-xl border p-3', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Terminal className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />
                      <span className="text-[10px] font-semibold">Verbosity</span>
                    </div>
                    <div className="relative">
                      <select
                        value={verbosity[env.id] ?? 'warn'}
                        onChange={(e) => setVerbosity((prev) => ({ ...prev, [env.id]: e.target.value }))}
                        className={cn(
                          'w-full appearance-none rounded-md border px-2 py-1.5 text-[10px] font-mono pr-6 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer',
                          isDark
                            ? 'bg-white/[0.04] border-white/[0.08] text-white'
                            : 'bg-black/[0.03] border-black/[0.08] text-black',
                        )}
                      >
                        {verbosityLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      <ChevronDown className={cn('absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none', 'text-[var(--app-text-muted)]')} />
                    </div>
                  </div>
                </div>

                {/* Feature Overrides */}
                <div className="mb-4">
                  <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                    Feature Overrides
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {env.featureOverrides.map((fo) => (
                      <span
                        key={fo.feature}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                          fo.enabled
                            ? isDark
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-emerald-50 text-emerald-600'
                            : isDark
                              ? 'bg-zinc-500/10 text-zinc-500'
                              : 'bg-zinc-100 text-zinc-400',
                        )}
                      >
                        {fo.enabled ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        {fo.feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Deployed */}
                {env.lastDeployed && (
                  <div className={cn('text-[10px] mb-4', 'text-[var(--app-text-muted)]')}>
                    Last Deployed: {new Date(env.lastDeployed).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {env.type === 'production' && (
                    <button className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-colors cursor-pointer',
                      isDark ? 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
                    )}>
                      <Rocket className="w-3.5 h-3.5" /> Deploy
                    </button>
                  )}
                  <button
                    onClick={() => toggleEnv(env.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-colors cursor-pointer',
                      isActive
                        ? isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        : isDark ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                    )}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Global Config ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Global Config</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Default environment */}
            <div className={cn('rounded-2xl border p-5', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
              <p className="text-xs font-semibold mb-2">Default Environment</p>
              <div className="relative">
                <select
                  value={defaultEnv}
                  onChange={(e) => setDefaultEnv(e.target.value)}
                  className={cn(
                    'w-full appearance-none rounded-lg border px-3 py-2 text-xs font-medium pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white'
                      : 'bg-black/[0.03] border-black/[0.08] text-black',
                  )}
                >
                  {environments.map((e) => (
                    <option key={e.id} value={e.type}>{e.name}</option>
                  ))}
                </select>
                <ChevronDown className={cn('absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none', 'text-[var(--app-text-muted)]')} />
              </div>
            </div>

            {/* Deployment checklist */}
            <div className={cn('rounded-2xl border p-5', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
              <p className="text-xs font-semibold mb-3">Deployment Checklist</p>
              <div className="space-y-2">
                {deploymentChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    )}
                    <span className={cn('text-[11px]', 'text-[var(--app-text-secondary)]')}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health check */}
            <div className={cn('rounded-2xl border p-5', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
              <p className="text-xs font-semibold mb-3">Health Check</p>
              <div className="space-y-2">
                {[
                  { service: 'API', status: 'healthy' },
                  { service: 'Database', status: 'healthy' },
                  { service: 'Cache', status: 'healthy' },
                ].map((h) => (
                  <div key={h.service} className="flex items-center justify-between">
                    <span className={cn('text-[11px]', 'text-[var(--app-text-secondary)]')}>{h.service}</span>
                    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', 'bg-[var(--app-success-bg)] text-[var(--app-success)]')}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
