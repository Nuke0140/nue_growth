'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Webhook, Plus, Copy, CheckCircle2, XCircle, Clock, AlertTriangle,
  Shield, Play, Pencil, Globe, ArrowRight,
} from 'lucide-react';
import { webhookIntegrations } from './data/mock-data';

const METHOD_CONFIG: Record<string, { color: string; bgColor: string; textColor: string }> = {
  POST: { color: 'border-green-500', bgColor: 'bg-green-500/15', textColor: 'text-green-400' },
  GET: { color: 'border-blue-500', bgColor: 'bg-blue-500/15', textColor: 'text-blue-400' },
  PUT: { color: 'border-amber-500', bgColor: 'bg-amber-500/15', textColor: 'text-amber-400' },
  DELETE: { color: 'border-red-500', bgColor: 'bg-red-500/15', textColor: 'text-red-400' },
};

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: 'Success' },
  failed: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/15', label: 'Failed' },
  timeout: { icon: Clock, color: 'text-orange-400', bgColor: 'bg-orange-500/15', label: 'Timeout' },
  never: { icon: Clock, color: 'text-zinc-400', bgColor: 'bg-zinc-500/15', label: 'Never' },
};

export default function WebhookIntegrationsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalWebhooks = webhookIntegrations.length;
  const activeWebhooks = webhookIntegrations.filter((w) => w.lastStatus !== 'never').length;
  const avgSuccessRate = webhookIntegrations.length > 0
    ? Math.round(webhookIntegrations.reduce((sum, w) => sum + (100 - w.failureRate), 0) / totalWebhooks * 10) / 10
    : 0;
  const avgResponseTime = webhookIntegrations.reduce((sum, w) => {
    if (w.responseLogs.length > 0) return sum + w.responseLogs[0].duration;
    return sum;
  }, 0) / Math.max(webhookIntegrations.filter((w) => w.responseLogs.length > 0).length, 1);

  const card = cn(
    'rounded-2xl border shadow-sm p-4 sm:p-5',
    'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
  );

  function truncateUrl(url: string, maxLen = 45) {
    if (url.length <= maxLen) return url;
    return url.slice(0, maxLen) + '...';
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatTimestamp(ts: string) {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={cn('text-2xl font-bold tracking-tight', 'text-[var(--app-text)]')}>
              Webhooks
            </h1>
            <p className={cn('text-sm mt-1', 'text-[var(--app-text-muted)]')}>
              Manage external integrations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </motion.button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Webhooks', value: totalWebhooks, icon: Webhook, color: 'text-blue-400', bg: 'bg-blue-500/15' },
            { label: 'Active', value: activeWebhooks, icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { label: 'Success Rate', value: `${avgSuccessRate}%`, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/15' },
            { label: 'Avg Response', value: `${Math.round(avgResponseTime)}ms`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={card}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                    {stat.label}
                  </p>
                  <p className={cn('text-2xl font-bold mt-1', stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Webhook Cards */}
        <div className="space-y-4">
          {webhookIntegrations.map((webhook, i) => {
            const methodConf = METHOD_CONFIG[webhook.method];
            const statusConf = STATUS_CONFIG[webhook.lastStatus];
            const StatusIcon = statusConf.icon;

            return (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'rounded-2xl border shadow-sm p-4 sm:p-5 space-y-3',
                  'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={cn('text-sm font-semibold truncate', 'text-[var(--app-text)]')}>
                        {webhook.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                        methodConf.bgColor, methodConf.textColor,
                      )}>
                        {webhook.method}
                      </span>
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        statusConf.bgColor, statusConf.color,
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConf.label}
                      </span>
                    </div>

                    {/* URL with copy */}
                    <div className={cn(
                      'flex items-center gap-2 rounded-lg px-2.5 py-1.5 mt-1',
                      'bg-[var(--app-hover-bg)]',
                    )}>
                      <code className={cn('text-[11px] font-mono flex-1 truncate', 'text-[var(--app-text-muted)]')}>
                        {truncateUrl(webhook.url)}
                      </code>
                      <button
                        onClick={() => handleCopy(webhook.url, webhook.id)}
                        className={cn(
                          'shrink-0 p-1 rounded-md transition-colors',
                          isDark ? 'hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300' : 'hover:bg-black/[0.06] text-zinc-400 hover:text-zinc-600',
                        )}
                      >
                        {copiedId === webhook.id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] hover:bg-[var(--app-active-bg)]',
                      )}
                    >
                      <Play className="h-3 w-3" />
                      Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        'bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] hover:bg-[var(--app-active-bg)]',
                      )}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </motion.button>
                  </div>
                </div>

                {/* Event Mapping */}
                <div className={cn('rounded-xl p-3', 'bg-[var(--app-hover-bg)]')}>
                  <p className={cn('text-[10px] font-medium uppercase tracking-wider mb-1.5', 'text-[var(--app-text-muted)]')}>
                    Events
                  </p>
                  <p className={cn('text-xs', 'text-[var(--app-text-secondary)]')}>
                    {webhook.event}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(webhook.eventMapping).map(([key, val]) => (
                      <div key={key} className={cn(
                        'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px]',
                        isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-black/[0.04] text-zinc-500',
                      )}>
                        <span className="font-mono">{key}</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                        <span className="font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auth Status + Retry */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Shield className={cn('h-3 w-3', webhook.authToken ? 'text-emerald-400' : 'text-zinc-400')} />
                    <span className={cn('text-[10px] font-medium', webhook.authToken ? 'text-emerald-400' : 'text-[var(--app-text-muted)]')}>
                      {webhook.authToken ? 'Auth Token Present' : 'No Auth'}
                    </span>
                  </div>
                  <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                    Retry: {webhook.retryAttempts} attempts
                  </span>
                </div>

                {/* Failure Rate Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn('text-[10px] font-medium uppercase tracking-wider', 'text-[var(--app-text-muted)]')}>
                      Failure Rate
                    </p>
                    <span className={cn('text-xs font-bold', webhook.failureRate === 0 ? 'text-emerald-400' : webhook.failureRate < 5 ? 'text-amber-400' : 'text-red-400')}>
                      {webhook.failureRate}%
                    </span>
                  </div>
                  <div className={cn('w-full h-1.5 rounded-full overflow-hidden', 'bg-[var(--app-hover-bg)]')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(webhook.failureRate * 5, 100)}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.6 }}
                      className={cn(
                        'h-full rounded-full',
                        webhook.failureRate === 0 ? 'bg-emerald-500' : webhook.failureRate < 5 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                    />
                  </div>
                </div>

                {/* Response Logs Mini-Table */}
                {webhook.responseLogs.length > 0 && (
                  <div className={cn('rounded-xl border overflow-hidden', 'border-[var(--app-border)]')}>
                    <div className={cn(
                      'grid grid-cols-4 gap-2 px-3 py-2 text-[10px] font-medium uppercase tracking-wider',
                      isDark ? 'bg-white/[0.03] text-zinc-500' : 'bg-black/[0.02] text-zinc-400',
                    )}>
                      <span>Timestamp</span>
                      <span>Status</span>
                      <span>Duration</span>
                      <span className="text-right">Result</span>
                    </div>
                    {webhook.responseLogs.map((log, li) => (
                      <div
                        key={li}
                        className={cn(
                          'grid grid-cols-4 gap-2 px-3 py-2 text-xs border-t',
                          'border-[var(--app-border-light)]',
                        )}
                      >
                        <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className={cn(
                          'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold w-fit',
                          log.success ? 'bg-emerald-500/15 text-emerald-400' :
                          log.statusCode === 0 ? 'bg-orange-500/15 text-orange-400' :
                          'bg-red-500/15 text-red-400',
                        )}>
                          {log.statusCode === 0 ? 'TMO' : log.statusCode}
                        </span>
                        <span className={cn('text-[11px] font-mono', 'text-[var(--app-text-muted)]')}>
                          {log.duration >= 1000 ? `${(log.duration / 1000).toFixed(1)}s` : `${log.duration}ms`}
                        </span>
                        <div className="flex justify-end">
                          {log.success ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Event Mapping Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'rounded-2xl border shadow-sm p-4 sm:p-5',
            'bg-[var(--app-hover-bg)] border-[var(--app-border)]',
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <h3 className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>
              Event Mapping Configuration
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { source: 'payment.success', target: 'invoice.mark_paid', active: true },
              { source: 'contact.created', target: 'crm.createContact', active: true },
              { source: 'deal.stage_change', target: 'crm.updateDeal', active: false },
              { source: 'file.uploaded', target: 'storage.markReady', active: true },
              { source: 'workflow.complete', target: 'slack.sendSummary', active: true },
              { source: 'custom.event', target: 'api.processEvent', active: false },
            ].map((mapping) => (
              <div key={mapping.source} className={cn(
                'rounded-xl border p-3 flex items-center justify-between gap-2',
                'border-[var(--app-border)]',
                mapping.active && ('bg-[var(--app-hover-bg)]'),
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    'h-2 w-2 rounded-full shrink-0',
                    mapping.active ? 'bg-emerald-500' : 'bg-zinc-500',
                  )} />
                  <span className="text-[11px] font-mono truncate">{mapping.source}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-zinc-500" />
                  <span className="text-[11px] font-mono truncate">{mapping.target}</span>
                </div>
                <span className={cn(
                  'text-[9px] font-bold uppercase tracking-wider shrink-0 rounded-full px-1.5 py-0.5',
                  mapping.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-500/15 text-zinc-400',
                )}>
                  {mapping.active ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
