'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface SecurityAlertChipProps {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  onDismiss?: () => void;
}

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    dark: 'bg-red-500/10 border-red-500/20 text-red-300',
    light: 'bg-red-50 border-red-200 text-red-600',
    iconColor: 'text-red-500',
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    dark: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    light: 'bg-amber-50 border-amber-200 text-amber-600',
    iconColor: 'text-amber-500',
    label: 'Warning',
  },
  info: {
    icon: Info,
    dark: 'bg-sky-500/10 border-sky-500/20 text-sky-300',
    light: 'bg-sky-50 border-sky-200 text-sky-600',
    iconColor: 'text-sky-500',
    label: 'Info',
  },
};

export default function SecurityAlertChip({ severity, title, description, timestamp, onDismiss }: SecurityAlertChipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border transition-colors',
        isDark ? config.dark : config.light
      )}
    >
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', config.iconColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold">{title}</span>
          <span
            className={cn(
              'text-[9px] px-1.5 py-0 rounded-md font-medium',
              isDark ? 'bg-white/[0.08] text-white/40' : 'bg-black/[0.06] text-black/40'
            )}
          >
            {config.label}
          </span>
        </div>
        <p className={cn('text-[11px] leading-relaxed', 'text-[var(--app-text-muted)]')}>
          {description}
        </p>
        <span className={cn('text-[9px] mt-1 block', 'text-[var(--app-text-disabled)]')}>
          {timestamp}
        </span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'text-xs px-2 py-1 rounded-lg transition-colors shrink-0',
            isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30'
          )}
        >
          Dismiss
        </button>
      )}
    </motion.div>
  );
}
