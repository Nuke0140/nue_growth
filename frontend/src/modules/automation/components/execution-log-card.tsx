'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Clock, CheckCircle, XCircle, RotateCcw, AlertTriangle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExecutionLog } from '../types';

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Success' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
  running: { icon: Play, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Running' },
  retrying: { icon: RotateCcw, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Retrying' },
  timeout: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Timeout' },
};

interface ExecutionLogCardProps {
  log: ExecutionLog;
}

export default function ExecutionLogCard({ log }: ExecutionLogCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = statusConfig[log.status] || statusConfig.running;
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'rounded-2xl border p-4 shadow-sm',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
          : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03]',
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
            <StatusIcon className={cn('w-4 h-4', config.color)} />
          </div>
          <div>
            <p className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              {log.workflowName}
            </p>
            <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>
              {log.triggeredBy === 'auto' ? 'Auto-triggered' : log.triggeredBy === 'webhook' ? 'Webhook' : 'Scheduled'}
            </p>
          </div>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
          config.bg, config.color,
        )}>
          {config.label}
        </span>
      </div>

      {/* Node Results */}
      <div className="space-y-1.5 mb-3">
        {log.nodeResults.map((node, i) => {
          const nc = statusConfig[node.status] || statusConfig.running;
          const NI = nc.icon;
          return (
            <div key={node.nodeId} className="flex items-center gap-2">
              <NI className={cn('w-3 h-3 shrink-0', nc.color)} />
              <span className={cn('text-xs flex-1 truncate', 'text-[var(--app-text-secondary)]')}>
                {node.nodeName}
              </span>
              <span className={cn('text-[10px] shrink-0', 'text-[var(--app-text-muted)]')}>
                {node.duration}s
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={cn('flex items-center justify-between pt-2 border-t', 'border-[var(--app-border)]')}>
        <div className="flex items-center gap-1.5">
          <Clock className={cn('w-3 h-3', 'text-[var(--app-text-muted)]')} />
          <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
            Total: {log.duration}s
          </span>
          {log.retryCount > 0 && (
            <span className={cn('text-[10px]', isDark ? 'text-amber-400/60' : 'text-amber-600')}>
              · {log.retryCount} retries
            </span>
          )}
        </div>
        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
          {new Date(log.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {log.errorMessage && (
        <div className={cn(
          'mt-2 rounded-lg p-2 text-[11px] leading-relaxed',
          isDark ? 'bg-red-500/5 text-red-300/70 border border-red-500/10' : 'bg-red-50 text-red-600 border border-red-200',
        )}>
          {log.errorMessage}
        </div>
      )}
    </motion.div>
  );
}
