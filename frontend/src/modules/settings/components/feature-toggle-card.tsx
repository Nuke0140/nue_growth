'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { FeatureFlag } from '../types';

interface FeatureToggleCardProps {
  flag: FeatureFlag;
  onToggle?: (id: string, enabled: boolean) => void;
  onRolloutChange?: (id: string, percent: number) => void;
}

const categoryColors: Record<string, { dark: string; light: string }> = {
  AI: { dark: 'bg-violet-500/15 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  Communication: { dark: 'bg-sky-500/15 text-sky-400', light: 'bg-sky-50 text-sky-600' },
  Analytics: { dark: 'bg-emerald-500/15 text-emerald-400', light: 'bg-emerald-50 text-emerald-600' },
  Automation: { dark: 'bg-amber-500/15 text-amber-400', light: 'bg-amber-50 text-amber-600' },
  Core: { dark: 'bg-blue-500/15 text-blue-400', light: 'bg-blue-50 text-blue-600' },
  Security: { dark: 'bg-red-500/15 text-red-400', light: 'bg-red-50 text-red-600' },
};

const envColors: Record<string, string> = {
  production: 'bg-emerald-500',
  staging: 'bg-amber-500',
  development: 'bg-sky-500',
};

export default function FeatureToggleCard({ flag, onToggle, onRolloutChange }: FeatureToggleCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [rollout, setRollout] = useState(flag.rolloutPercent);
  const catColor = categoryColors[flag.category] || categoryColors.Core;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold truncate">{flag.name}</h4>
            {flag.killSwitch && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-red-500/15 text-red-400 border-0">
                Kill Switch
              </Badge>
            )}
          </div>
          <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/40' : 'text-black/40')}>
            {flag.description}
          </p>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggle?.(flag.id, !flag.enabled)}
          className={cn(
            'relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 mt-0.5',
            flag.enabled ? 'bg-emerald-500' : isDark ? 'bg-white/[0.15]' : 'bg-black/[0.15]'
          )}
        >
          <motion.div
            animate={{ x: flag.enabled ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
          />
        </button>
      </div>

      {/* Category + Status */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? catColor.dark : catColor.light)}>
          {flag.category}
        </Badge>
        <Badge
          variant="secondary"
          className={cn(
            'text-[9px] px-1.5 py-0 border-0',
            flag.enabled
              ? 'bg-emerald-500/15 text-emerald-400'
              : isDark
                ? 'bg-white/[0.08] text-white/30'
                : 'bg-black/[0.06] text-black/30'
          )}
        >
          {flag.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      {/* Environments */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Environments:</span>
        {flag.environments.length > 0 ? (
          flag.environments.map((env) => (
            <div key={env} className="flex items-center gap-1">
              <div className={cn('w-1.5 h-1.5 rounded-full', envColors[env] || 'bg-gray-400')} />
              <span className={cn('text-[10px] capitalize', isDark ? 'text-white/50' : 'text-black/50')}>{env}</span>
            </div>
          ))
        ) : (
          <span className={cn('text-[10px] italic', isDark ? 'text-white/20' : 'text-black/20')}>None</span>
        )}
      </div>

      {/* Rollout Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Rollout</span>
          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/60' : 'text-black/60')}>
            {rollout}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={rollout}
          onChange={(e) => {
            setRollout(Number(e.target.value));
            onRolloutChange?.(flag.id, Number(e.target.value));
          }}
          disabled={!flag.enabled}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-30 accent-violet-500"
          style={{
            background: `linear-gradient(to right, ${flag.enabled ? '#8b5cf6' : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} ${rollout}%, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} ${rollout}%)`,
          }}
        />
      </div>

      {/* Target Roles */}
      {flag.targetRoles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {flag.targetRoles.map((role) => (
            <span
              key={role}
              className={cn(
                'text-[9px] px-1.5 py-0.5 rounded-md capitalize',
                isDark ? 'bg-white/[0.06] text-white/40' : 'bg-black/[0.04] text-black/40'
              )}
            >
              {role}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={cn('mt-3 pt-2 border-t flex items-center justify-between', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
        <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>
          by {flag.modifiedBy}
        </span>
        <span className={cn('text-[9px]', isDark ? 'text-white/20' : 'text-black/20')}>
          {new Date(flag.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </motion.div>
  );
}
