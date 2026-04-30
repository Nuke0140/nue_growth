'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  BrainCircuit,
  ToggleLeft,
  ToggleRight,
  Zap,
  Shield,
  FileText,
  Lock,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIControlPanelProps {
  title: string;
  description: string;
  enabled: boolean;
  mode: 'full' | 'approval-only' | 'suggestion-only';
  tokenLimit: number;
  tokenUsed: number;
  moduleAccess: string[];
  promptLogging: boolean;
  safeActionConfirmation: boolean;
  roleQuotas: { role: string; quota: number; used: number }[];
  onToggle?: () => void;
  onModeChange?: (mode: string) => void;
}

const modes = [
  { value: 'full', label: 'Full' },
  { value: 'approval-only', label: 'Approval Only' },
  { value: 'suggestion-only', label: 'Suggestion Only' },
] as const;

export default function AIControlPanel({
  title,
  description,
  enabled,
  mode,
  tokenLimit,
  tokenUsed,
  moduleAccess,
  promptLogging,
  safeActionConfirmation,
  roleQuotas,
  onToggle,
  onModeChange,
}: AIControlPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [localMode, setLocalMode] = useState(mode);

  const tokenPercent = tokenLimit > 0 ? Math.min((tokenUsed / tokenLimit) * 100, 100) : 0;
  const isNearLimit = tokenPercent >= 80;

  const handleModeChange = (newMode: string) => {
    setLocalMode(newMode as typeof mode);
    onModeChange?.(newMode);
  };

  const formatTokens = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative rounded-2xl border border-l-4 border-l-violet-500 p-5 shadow-sm overflow-hidden',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-black/[0.02] border-black/[0.06]',
      )}
    >
      {/* Violet glow */}
      <div
        className={cn(
          'absolute -top-16 -left-16 h-32 w-32 rounded-full blur-3xl opacity-10',
          isDark ? 'bg-violet-500' : 'bg-violet-400',
        )}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          {/* Brain icon with glow */}
          <div className="relative">
            {enabled && (
              <motion.div
                className="absolute inset-0 rounded-xl blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: isDark ? 'rgba(139,92,246,0.4)' : 'rgba(124,58,237,0.3)' }}
              />
            )}
            <div
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl',
                enabled
                  ? isDark
                    ? 'bg-violet-500/15'
                    : 'bg-violet-100'
                  : isDark
                    ? 'bg-white/[0.06]'
                    : 'bg-black/[0.04]',
              )}
            >
              <BrainCircuit
                className={cn(
                  'h-5 w-5',
                  enabled
                    ? 'text-violet-400'
                    : isDark
                      ? 'text-zinc-500'
                      : 'text-zinc-400',
                )}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
                {title}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold',
                  isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-600',
                )}
              >
                <Zap className="h-2.5 w-2.5" />
                AI
              </span>
            </div>
            <p className={cn('text-xs mt-0.5', 'text-[var(--app-text-muted)]')}>
              {description}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={cn(
            'shrink-0 cursor-pointer transition-colors',
            enabled ? 'text-violet-400' : 'text-[var(--app-text-secondary)]',
          )}
          aria-label={`Toggle ${title}`}
        >
          {enabled ? (
            <ToggleRight className="h-7 w-7" />
          ) : (
            <ToggleLeft className="h-7 w-7" />
          )}
        </motion.button>
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="relative space-y-4"
        >
          {/* Mode selector tabs */}
          <div>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
              Mode
            </p>
            <div
              className={cn(
                'inline-flex items-center rounded-xl p-1 gap-0.5',
                'bg-[var(--app-hover-bg)]',
              )}
            >
              {modes.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleModeChange(m.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer',
                    localMode === m.value
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

          {/* Token usage */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                Token Usage
              </p>
              <span className={cn('text-xs font-mono tabular-nums font-bold', 'text-[var(--app-text)]')}>
                {formatTokens(tokenUsed)} / {formatTokens(tokenLimit)}
              </span>
            </div>
            <div className={cn('h-2 w-full rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tokenPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  isNearLimit ? 'bg-amber-500' : 'bg-violet-500',
                )}
              />
            </div>
            {isNearLimit && (
              <p className={cn('text-[10px] mt-1 font-medium', 'text-amber-400')}>
                Approaching token limit — consider upgrading
              </p>
            )}
          </div>

          {/* Module access */}
          <div>
            <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-1.5', 'text-[var(--app-text-muted)]')}>
              Module Access
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {moduleAccess.map((mod) => (
                <span
                  key={mod}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize',
                    isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-violet-50 text-violet-600',
                  )}
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Toggles row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Prompt logging */}
            <div
              className={cn(
                'flex items-center justify-between rounded-xl p-3 border',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className={cn('h-4 w-4', 'text-[var(--app-text-muted)]')} />
                <div>
                  <p className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                    Prompt Logging
                  </p>
                  <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    {promptLogging ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  promptLogging ? 'bg-emerald-400' : isDark ? 'bg-zinc-600' : 'bg-zinc-300',
                )}
              />
            </div>

            {/* Safe action confirmation */}
            <div
              className={cn(
                'flex items-center justify-between rounded-xl p-3 border',
                'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
              )}
            >
              <div className="flex items-center gap-2">
                <Lock className={cn('h-4 w-4', 'text-[var(--app-text-muted)]')} />
                <div>
                  <p className={cn('text-xs font-semibold', 'text-[var(--app-text)]')}>
                    Safe Action Confirmation
                  </p>
                  <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    {safeActionConfirmation ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  safeActionConfirmation ? 'bg-emerald-400' : isDark ? 'bg-zinc-600' : 'bg-zinc-300',
                )}
              />
            </div>
          </div>

          {/* Role quotas */}
          {roleQuotas.length > 0 && (
            <div>
              <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', 'text-[var(--app-text-muted)]')}>
                Role Quotas
              </p>
              <div className="space-y-2">
                {roleQuotas.map((rq) => {
                  const pct = rq.quota > 0 ? Math.min((rq.used / rq.quota) * 100, 100) : 0;
                  const overLimit = pct >= 90;
                  return (
                    <div key={rq.role} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-24 shrink-0">
                        <Users className={cn('h-3 w-3', 'text-[var(--app-text-muted)]')} />
                        <span className={cn('text-[10px] font-medium truncate capitalize', 'text-[var(--app-text-secondary)]')}>
                          {rq.role}
                        </span>
                      </div>
                      <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            overLimit ? 'bg-red-500' : 'bg-violet-500',
                          )}
                        />
                      </div>
                      <span className={cn('text-[10px] font-mono tabular-nums shrink-0', 'text-[var(--app-text-muted)]')}>
                        {rq.used}/{rq.quota}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
