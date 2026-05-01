'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  BrainCircuit,
  Zap,
  Activity,
  Target,
  Clock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { aiControls } from './data/mock-data';
import AIControlPanel from './components/ai-control-panel';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
};

const tokenUsageByModule = [
  { module: 'CRM', tokens: 45000, color: 'bg-blue-500' },
  { module: 'Sales', tokens: 32000, color: 'bg-emerald-500' },
  { module: 'Marketing', tokens: 58000, color: 'bg-pink-500' },
  { module: 'Finance', tokens: 28000, color: 'bg-amber-500' },
  { module: 'Analytics', tokens: 82000, color: 'bg-violet-500' },
];

const totalTokenUsed = 245000;
const totalTokenBudget = 500000;

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function AIControlsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [enabledControls, setEnabledControls] = useState<Record<string, boolean>>(
    Object.fromEntries(aiControls.map((c) => [c.id, c.enabled])),
  );
  const [globalAI, setGlobalAI] = useState(true);
  const [defaultMode, setDefaultMode] = useState('full');
  const [maxBudget, setMaxBudget] = useState('500000');
  const [auditPrompts, setAuditPrompts] = useState(true);

  const activeControls = Object.values(enabledControls).filter(Boolean).length;
  const avgAccuracy = 94.2;
  const pendingApprovals = 7;

  const handleToggle = (id: string) => {
    setEnabledControls((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maxModuleTokens = Math.max(...tokenUsageByModule.map((m) => m.tokens));

  const summaryKPIs = [
    { label: 'Active AI Controls', value: `${activeControls}/${aiControls.length}`, icon: BrainCircuit, color: 'text-violet-400' },
    { label: 'Total Token Usage', value: formatTokens(totalTokenUsed), icon: Zap, color: 'text-amber-400' },
    { label: 'Average Accuracy', value: `${avgAccuracy}%`, icon: Target, color: 'text-emerald-400' },
    { label: 'Pending Approvals', value: String(pendingApprovals), icon: Clock, color: 'text-sky-400' },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-violet-500/15' : 'bg-violet-100')}>
              <ShieldCheck className={cn('w-5 h-5', 'text-violet-400')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Controls</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Manage AI access, limits, and governance</p>
            </div>
          </div>
        </motion.div>

        {/* ── Summary KPIs ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {summaryKPIs.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className={cn(
                'rounded-2xl border p-4',
                isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]',
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-white/40' : 'text-black/40')}>
                  {kpi.label}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{kpi.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── AI Control Panels ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>AI Control Panels</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiControls.map((control, i) => (
              <motion.div
                key={control.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.15 }}
              >
                <AIControlPanel
                  title={control.name}
                  description={control.description}
                  enabled={enabledControls[control.id] ?? control.enabled}
                  mode={control.mode}
                  tokenLimit={control.tokenLimit}
                  tokenUsed={control.tokenUsed}
                  moduleAccess={control.moduleAccess}
                  promptLogging={control.promptLogging}
                  safeActionConfirmation={control.safeActionConfirmation}
                  roleQuotas={control.roleQuotas.map((rq) => ({
                    role: rq.role,
                    quota: rq.quota,
                    used: Math.floor(rq.quota * 0.45),
                  }))}
                  onToggle={() => handleToggle(control.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── AI Usage Analytics ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>AI Usage Analytics</span>
          </div>
          <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
            <h3 className="text-sm font-semibold mb-4">Token Usage by Module</h3>
            <div className="space-y-3 mb-6">
              {tokenUsageByModule.map((m) => {
                const pct = (m.tokens / maxModuleTokens) * 100;
                return (
                  <div key={m.module} className="flex items-center gap-3">
                    <span className={cn('text-xs font-medium w-20 shrink-0', isDark ? 'text-white/60' : 'text-black/60')}>
                      {m.module}
                    </span>
                    <div className={cn('flex-1 h-3 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', m.color)}
                      />
                    </div>
                    <span className={cn('text-xs font-mono tabular-nums font-semibold w-12 text-right shrink-0', isDark ? 'text-white/70' : 'text-black/70')}>
                      {formatTokens(m.tokens)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simple stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Total Tokens Used</span>
                <p className="text-sm font-bold">{formatTokens(totalTokenUsed)}</p>
              </div>
              <div className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>Remaining</span>
                <p className="text-sm font-bold">{formatTokens(totalTokenBudget - totalTokenUsed)}</p>
              </div>
              <div className={cn('rounded-xl border p-3', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-1', isDark ? 'text-white/30' : 'text-black/30')}>% of Budget</span>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{((totalTokenUsed / totalTokenBudget) * 100).toFixed(1)}%</p>
                  <div className={cn('flex-1 h-2 rounded-full overflow-hidden', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalTokenUsed / totalTokenBudget) * 100}%` }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="h-full rounded-full bg-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── AI Governance Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>AI Governance Settings</span>
          </div>
          <div className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
            <div className="space-y-5">
              {/* Global AI toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Global AI Enable</p>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                    Enable or disable all AI features across the platform
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGlobalAI(!globalAI)}
                  className={cn('shrink-0 cursor-pointer transition-colors', globalAI ? 'text-violet-400' : isDark ? 'text-zinc-600' : 'text-zinc-300')}
                  aria-label="Toggle global AI"
                >
                  {globalAI ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                </motion.button>
              </div>

              {/* Default AI mode */}
              <div className={cn('rounded-xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                <p className="text-xs font-semibold mb-2">Default AI Mode</p>
                <div className={cn('inline-flex items-center rounded-xl p-1 gap-0.5', isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]')}>
                  {[
                    { value: 'full', label: 'Full' },
                    { value: 'approval-only', label: 'Approval Only' },
                    { value: 'suggestion-only', label: 'Suggestion Only' },
                  ].map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setDefaultMode(m.value)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer',
                        defaultMode === m.value
                          ? isDark
                            ? 'bg-violet-500/20 text-violet-300 shadow-sm'
                            : 'bg-violet-100 text-violet-700 shadow-sm'
                          : isDark
                            ? 'text-zinc-500 hover:text-zinc-300'
                            : 'text-zinc-400 hover:text-zinc-600',
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max token budget */}
              <div className={cn('rounded-xl border p-4', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.01] border-black/[0.06]')}>
                <p className="text-xs font-semibold mb-2">Maximum Token Budget</p>
                <input
                  type="text"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20'
                      : 'bg-black/[0.03] border-black/[0.08] text-black placeholder:text-black/20',
                  )}
                />
              </div>

              {/* Audit AI prompts toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Audit AI Prompts</p>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                    Log all AI prompts for compliance and review
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAuditPrompts(!auditPrompts)}
                  className={cn('shrink-0 cursor-pointer transition-colors', auditPrompts ? 'text-violet-400' : isDark ? 'text-zinc-600' : 'text-zinc-300')}
                  aria-label="Toggle audit prompts"
                >
                  {auditPrompts ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
