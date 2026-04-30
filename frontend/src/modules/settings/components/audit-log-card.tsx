'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { AuditLog } from '../types';

interface AuditLogCardProps {
  log: AuditLog;
}

const severityStyles = {
  critical: {
    dark: 'bg-red-500/10 border-red-500/20',
    light: 'bg-red-50/60 border-red-200/60',
    badge: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-500',
  },
  warning: {
    dark: 'bg-amber-500/10 border-amber-500/20',
    light: 'bg-amber-50/60 border-amber-200/60',
    badge: 'bg-amber-500/15 text-amber-400',
    dot: 'bg-amber-500',
  },
  info: {
    dark: 'bg-sky-500/10 border-sky-500/20',
    light: 'bg-sky-50/60 border-sky-200/60',
    badge: 'bg-sky-500/15 text-sky-400',
    dot: 'bg-sky-500',
  },
};

const eventTypeLabels: Record<string, string> = {
  login: 'Login',
  'permission-changed': 'Permission Changed',
  'payout-approved': 'Payout Approved',
  'invoice-deleted': 'Invoice Deleted',
  'workflow-edited': 'Workflow Edited',
  'api-key-rotated': 'API Key Rotated',
  'role-updated': 'Role Updated',
  'user-invited': 'User Invited',
  'data-exported': 'Data Exported',
  'setting-changed': 'Setting Changed',
  'integration-connected': 'Integration Connected',
  'backup-restored': 'Backup Restored',
};

export default function AuditLogCard({ log }: AuditLogCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const style = severityStyles[log.severity];
  const time = new Date(log.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[var(--app-radius-lg)] border p-4 transition-colors',
        isDark ? style.dark : style.light
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn('w-2 h-2 rounded-full shrink-0', style.dot)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', style.badge)}>
                  {eventTypeLabels[log.eventType] || log.eventType}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-hover-bg)] text-[var(--app-text-muted)]')}
                >
                  {log.module}
                </Badge>
              </div>
            </div>
          </div>
          <span className={cn('text-[10px] shrink-0', 'text-[var(--app-text-muted)]')}>
            {time.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Action Description */}
        <p className={cn('text-sm leading-relaxed', 'text-[var(--app-text)]')}>
          {log.action}
        </p>

        {/* Details */}
        <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
          {log.details}
        </p>

        {/* Bottom Row: Actor + IP + Value Changes */}
        <div className={cn('flex items-center gap-4 pt-2 border-t flex-wrap', 'border-[var(--app-border)]')}>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Actor:</span>
            <span className="text-xs font-medium">{log.actor}</span>
            <Badge
              variant="secondary"
              className={cn('text-[9px] px-1 py-0 border-0 capitalize', isDark ? 'bg-white/[0.06] text-white/35' : 'bg-black/[0.04] text-black/35')}
            >
              {log.actorRole}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>IP:</span>
            <span className={cn('text-[11px] font-mono', 'text-[var(--app-text-muted)]')}>{log.ip}</span>
          </div>
          {log.previousValue && log.newValue && (
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Change:</span>
              <span className={cn('text-[11px] line-through', 'text-[var(--app-text-muted)]')}>{log.previousValue}</span>
              <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>→</span>
              <span className="text-[11px] font-medium text-emerald-500">{log.newValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
