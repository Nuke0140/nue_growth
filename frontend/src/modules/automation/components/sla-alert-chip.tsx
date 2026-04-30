'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { AlertTriangle, AlertCircle, Info, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SLAAlertChipProps {
  ruleName: string;
  severity: 'critical' | 'warning' | 'info';
  timeRemaining?: string;
  breached?: boolean;
  onAction?: () => void;
}

const severityConfig: Record<
  string,
  {
    icon: React.ElementType;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
    label: string;
  }
> = {
  critical: {
    icon: AlertTriangle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    iconColor: 'text-red-400',
    label: 'Critical',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    iconColor: 'text-amber-400',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    iconColor: 'text-blue-400',
    label: 'Info',
  },
};

export default function SLAAlertChip({
  ruleName,
  severity,
  timeRemaining,
  breached,
  onAction,
}: SLAAlertChipProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const config = severityConfig[severity];
  const SeverityIcon = config.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onAction}
      className={cn(
        'group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors cursor-pointer',
        isDark
          ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
          : 'bg-white border-black/[0.08] hover:bg-black/[0.03]',
        config.borderColor,
      )}
    >
      {/* Pulse ring for critical + not breached */}
      {severity === 'critical' && !breached && (
        <motion.span
          className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500/50"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Severity icon */}
      <span className={cn('shrink-0', config.iconColor)}>
        {severity === 'critical' && !breached ? (
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          >
            <SeverityIcon className="h-3.5 w-3.5" />
          </motion.span>
        ) : (
          <SeverityIcon className="h-3.5 w-3.5" />
        )}
      </span>

      {/* Rule name */}
      <span className={cn('truncate max-w-[160px]', 'text-[var(--app-text-secondary)]')}>
        {ruleName}
      </span>

      {/* Divider */}
      <div className={cn('h-3 w-px shrink-0', 'bg-[var(--app-hover-bg)]')} />

      {/* Time or state */}
      {breached ? (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-red-400">
          Breached
        </span>
      ) : timeRemaining ? (
        <span className={cn('flex items-center gap-1 shrink-0', 'text-[var(--app-text-muted)]')}>
          <Clock className="h-3 w-3" />
          {timeRemaining}
        </span>
      ) : (
        <span className={cn('shrink-0 text-[10px] font-bold uppercase tracking-wider', config.textColor)}>
          Active
        </span>
      )}

      {/* Action arrow */}
      <ArrowRight
        className={cn(
          'h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5',
          'text-[var(--app-text-muted)]',
        )}
      />
    </motion.button>
  );
}
