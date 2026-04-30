'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Key, Plus, Copy, RotateCw, Trash2, Globe, Check, X,
  Send, RefreshCw, Eye, EyeOff, ChevronDown, Zap,
} from 'lucide-react';
import { apiKeys, webhookConfigs } from './data/mock-data';
import { SmartDataTable } from '@/components/shared/smart-data-table';
import type { DataTableColumnDef } from '@/components/shared/smart-data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { CSS } from '@/styles/design-tokens';

const scopeDescriptions: Record<string, string> = {
  read: 'Read access to all resources',
  write: 'Create and modify resources',
  admin: 'Full administrative access',
  campaigns: 'Manage marketing campaigns',
  analytics: 'Access analytics and reports',
  partner: 'Partner SDK integration access',
};

const statusConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  active: { label: 'Active', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  revoked: { label: 'Revoked', bgDark: 'bg-red-500/15 text-red-400', bgLight: 'bg-red-50 text-red-600' },
  expired: { label: 'Expired', bgDark: 'bg-amber-500/15 text-amber-400', bgLight: 'bg-amber-50 text-amber-600' },
};

const webhookStatusConfig: Record<string, { label: string; bgDark: string; bgLight: string }> = {
  active: { label: 'Active', bgDark: 'bg-emerald-500/15 text-emerald-400', bgLight: 'bg-emerald-50 text-emerald-600' },
  inactive: { label: 'Inactive', bgDark: 'bg-slate-500/15 text-slate-400', bgLight: 'bg-slate-50 text-slate-600' },
  error: { label: 'Error', bgDark: 'bg-red-500/15 text-red-400', bgLight: 'bg-red-50 text-red-600' },
};

export default function ApiKeysWebhooksPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks'>('keys');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const totalKeys = apiKeys.length;
  const activeKeys = apiKeys.filter((k) => k.status === 'active').length;
  const expiredKeys = apiKeys.filter((k) => k.status === 'expired').length;
  const totalRequests = apiKeys.reduce((s, k) => s + k.requestCount, 0);

  const maskKey = (key: string) => {
    const last4 = key.slice(-4);
    return `sk-****...${last4}`;
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const summaryKPIs = [
    { label: 'Total Keys', value: totalKeys.toString(), color: 'text-violet-400' },
    { label: 'Active', value: activeKeys.toString(), color: 'text-emerald-400' },
    { label: 'Expired', value: expiredKeys.toString(), color: 'text-amber-400' },
    { label: 'Total Requests', value: formatNumber(totalRequests), color: 'text-sky-400' },
  ];

  // ── Delivery Logs columns ──
  const deliveryColumns: DataTableColumnDef[] = useMemo(() => [
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      render: (row) => (
        <span className="font-mono" style={{ color: CSS.textSecondary }}>
          {new Date(row.timestamp as string).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'statusCode',
      label: 'Status',
      render: (row) => <span className="font-mono text-center block">{row.statusCode as number}</span>,
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row) => <span className="text-center block">{row.duration as number}ms</span>,
    },
    {
      key: 'success',
      label: 'Result',
      render: (row) => (row.success as boolean) ? (
        <span className="text-emerald-500 flex items-center justify-end gap-1"><Check className="w-3 h-3" /> Success</span>
      ) : (
        <span className="text-red-500 flex items-center justify-end gap-1"><X className="w-3 h-3" /> Failed</span>
      ),
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-app-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-[var(--app-radius-lg)] flex items-center justify-center', 'bg-[var(--app-hover-bg)]')}>
              <Key className={cn('w-5 h-5', 'text-[var(--app-text-secondary)]')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">API Keys & Webhooks</h1>
              <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Manage API access and webhook endpoints</p>
            </div>
          </div>
          <Button
            className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}
            onClick={() => {}}
          >
            <Plus className="w-4 h-4" /> Create API Key
          </Button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryKPIs.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <span className={cn('text-[11px] font-medium uppercase tracking-wider block mb-1', 'text-[var(--app-text-muted)]')}>
                {kpi.label}
              </span>
              <p className={cn('text-2xl font-bold tracking-tight', kpi.color)}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)] w-fit" style={{ background: 'var(--app-hover-bg)' }}>
          {(['keys', 'webhooks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-[var(--app-radius-lg)] text-sm font-medium transition-colors capitalize',
                activeTab === tab
                  ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black'
                  : 'text-[var(--app-text-muted)] hover:text-[var(--app-text-secondary)]'
              )}
            >
              {tab === 'keys' ? 'API Keys' : 'Webhooks'}
            </button>
          ))}
        </div>

        {/* API Keys Section */}
        {activeTab === 'keys' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {apiKeys.map((apiKey, i) => {
              const sConf = statusConfig[apiKey.status];
              const isVisible = visibleKeys.has(apiKey.id);
              return (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className={cn('rounded-[var(--app-radius-xl)] border p-4 transition-colors', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold">{apiKey.name}</h3>
                        <StatusBadge status={sConf.label} />
                      </div>

                      {/* Key Value */}
                      <div className="flex items-center gap-2">
                        <code className={cn('text-xs font-mono px-2 py-1 rounded-[var(--app-radius-lg)]', isDark ? 'bg-white/[0.04] text-white/60' : 'bg-black/[0.04] text-black/60')}>
                          {isVisible ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className={cn('p-1 rounded-[var(--app-radius-lg)] transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyKey(apiKey.id, apiKey.key)}
                          className={cn('p-1 rounded-[var(--app-radius-lg)] transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}
                        >
                          {copiedKey === apiKey.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Scopes */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Scopes:</span>
                        {apiKey.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Right: Meta + Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={cn('text-[10px] space-y-0.5 text-right', 'text-[var(--app-text-muted)]')}>
                        <p>Created: {new Date(apiKey.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {apiKey.lastUsed && <p>Last used: {new Date(apiKey.lastUsed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        {apiKey.expiresAt && <p>Expires: {new Date(apiKey.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        <p>Requests: {formatNumber(apiKey.requestCount)}</p>
                        <p>IP Allowlist: {apiKey.ipAllowlist.length} {apiKey.ipAllowlist.length === 1 ? 'entry' : 'entries'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <RotateCw className="w-4 h-4" /> Rotate
                        </button>
                        {apiKey.status === 'active' && (
                          <button
                            className={cn('flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors text-red-400 hover:bg-red-500/10')}
                          >
                            <Trash2 className="w-4 h-4" /> Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Scopes Reference */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                <span className={cn('text-sm font-semibold', 'text-[var(--app-text)]')}>Available Scopes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(scopeDescriptions).map(([scope, desc]) => (
                  <div key={scope} className={cn('p-3 rounded-[var(--app-radius-lg)] border', 'border-[var(--app-border-light)]')}>
                    <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0 mb-1', 'bg-[var(--app-purple-light)] text-[var(--app-purple)]')}>
                      {scope}
                    </Badge>
                    <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Webhooks Section */}
        {activeTab === 'webhooks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {webhookConfigs.map((wh, i) => {
              const wConf = webhookStatusConfig[wh.status];
              return (
                <motion.div
                  key={wh.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Globe className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                          <h3 className="text-sm font-semibold">{wh.name}</h3>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? wConf.bgDark : wConf.bgLight)}>
                            {wConf.label}
                          </Badge>
                        </div>
                        <code className={cn('text-[11px] font-mono block truncate', 'text-[var(--app-text-muted)]')}>
                          {wh.url.length > 60 ? wh.url.slice(0, 60) + '...' : wh.url}
                        </code>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {wh.events.map((event) => (
                            <Badge key={event} variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', 'bg-[var(--app-info-bg)] text-[var(--app-info)]')}>
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Retries: {wh.retryAttempts}</span>
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <Send className="w-4 h-4" /> Test
                        </button>
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <RefreshCw className="w-4 h-4" /> Regenerate Secret
                        </button>
                      </div>
                    </div>

                    {/* Last Delivery */}
                    {wh.lastDelivery && (
                      <div className={cn('flex items-center gap-2 p-2.5 rounded-[var(--app-radius-lg)] text-xs', 'bg-[var(--app-hover-bg)]')}>
                        <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>Last Delivery:</span>
                        {wh.lastDelivery.success ? (
                          <span className="text-emerald-500">✓ {wh.lastDelivery.statusCode} — {new Date(wh.lastDelivery.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        ) : (
                          <span className="text-red-500">✗ {wh.lastDelivery.statusCode} — {new Date(wh.lastDelivery.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    )}

                    {/* Delivery Logs Table */}
                    <div>
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', 'text-[var(--app-text-muted)]')}>
                        Recent Deliveries
                      </span>
                      <div className={cn('rounded-[var(--app-radius-lg)] border overflow-hidden', 'border-[var(--app-border-light)]')}>
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className={cn('bg-[var(--app-hover-bg)]')}>
                              <th className={cn('text-left px-3 py-2 font-medium', 'text-[var(--app-text-muted)]')}>Time</th>
                              <th className={cn('text-center px-3 py-2 font-medium', 'text-[var(--app-text-muted)]')}>Status</th>
                              <th className={cn('text-center px-3 py-2 font-medium', 'text-[var(--app-text-muted)]')}>Duration</th>
                              <th className={cn('text-right px-3 py-2 font-medium', 'text-[var(--app-text-muted)]')}>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wh.deliveryLogs.map((log, j) => (
                              <tr key={j} className={cn('border-t', 'border-[var(--app-border-strong)]')}>
                                <td className={cn('px-3 py-2 font-mono', 'text-[var(--app-text-secondary)]')}>
                                  {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-3 py-2 text-center font-mono">{log.statusCode}</td>
                                <td className="px-3 py-2 text-center">{log.duration}ms</td>
                                <td className="px-3 py-2 text-right">
                                  {log.success ? (
                                    <span className="text-emerald-500 flex items-center justify-end gap-1"><Check className="w-4 h-4" /> Success</span>
                                  ) : (
                                    <span className="text-red-500 flex items-center justify-end gap-1"><X className="w-4 h-4" /> Failed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Create Webhook Form */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Plus className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                  Create Webhook
                </h3>
                <Button
                  onClick={() => setShowCreateWebhook(!showCreateWebhook)}
                  variant="ghost"
                  size="sm"
                  className={cn('rounded-[var(--app-radius-lg)] text-xs', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                >
                  <ChevronDown className={cn('w-4 h-4 transition-transform', showCreateWebhook && 'rotate-180')} />
                </Button>
              </div>
              {showCreateWebhook && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://your-server.com/webhooks/..."
                      className={cn('w-full px-3 py-2 rounded-[var(--app-radius-lg)] text-sm border outline-none transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/80 placeholder:text-white/20 focus:border-violet-500/40' : 'bg-black/[0.02] border-black/[0.06] text-black/80 placeholder:text-black/20 focus:border-violet-500/40')}
                    />
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Event Subscriptions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['contact.created', 'contact.updated', 'deal.won', 'invoice.paid', 'user.login', 'backup.completed'].map((event) => (
                        <label key={event} className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border cursor-pointer text-xs transition-colors', 'border-[var(--app-border-light)] hover:bg-[var(--app-hover-bg)]')}>
                          <input type="checkbox" className="accent-violet-500 w-4 h-4" />
                          <span className={cn('font-mono', 'text-[var(--app-text-secondary)]')}>{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', 'text-[var(--app-text-secondary)]')}>Signing Secret</label>
                    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--app-radius-lg)] border', 'bg-[var(--app-hover-bg)] border-[var(--app-border)]')}>
                      <code className="flex-1 text-xs font-mono text-violet-400">whsec_••••••••••••••••</code>
                      <button className={cn('p-1 rounded', 'hover:bg-[var(--app-hover-bg)]')}>
                        <Copy className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
                      </button>
                    </div>
                  </div>
                  <Button
                    className={cn('px-4 py-2 text-sm font-medium rounded-[var(--app-radius-lg)] gap-2', 'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]')}
                  >
                    <Send className="w-4 h-4" /> Create Webhook
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
