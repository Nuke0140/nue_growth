'use client';

import { useState } from 'react';
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
              <Key className={cn('w-5 h-5', isDark ? 'text-white/60' : 'text-black/60')} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">API Keys & Webhooks</h1>
              <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Manage API access and webhook endpoints</p>
            </div>
          </div>
          <Button
            className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
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
              className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
            >
              <span className={cn('text-[11px] font-medium uppercase tracking-wider block mb-1', isDark ? 'text-white/40' : 'text-black/40')}>
                {kpi.label}
              </span>
              <p className={cn('text-2xl font-bold tracking-tight', kpi.color)}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
          {(['keys', 'webhooks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                activeTab === tab
                  ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-black'
                  : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
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
                  className={cn('rounded-2xl border p-4 transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold">{apiKey.name}</h3>
                        <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? sConf.bgDark : sConf.bgLight)}>
                          {sConf.label}
                        </Badge>
                      </div>

                      {/* Key Value */}
                      <div className="flex items-center gap-2">
                        <code className={cn('text-xs font-mono px-2 py-1 rounded-lg', isDark ? 'bg-white/[0.04] text-white/60' : 'bg-black/[0.04] text-black/60')}>
                          {isVisible ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className={cn('p-1 rounded-lg transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => copyKey(apiKey.id, apiKey.key)}
                          className={cn('p-1 rounded-lg transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/30' : 'hover:bg-black/[0.06] text-black/30')}
                        >
                          {copiedKey === apiKey.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Scopes */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Scopes:</span>
                        {apiKey.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600')}>
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Right: Meta + Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={cn('text-[10px] space-y-0.5 text-right', isDark ? 'text-white/30' : 'text-black/30')}>
                        <p>Created: {new Date(apiKey.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {apiKey.lastUsed && <p>Last used: {new Date(apiKey.lastUsed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        {apiKey.expiresAt && <p>Expires: {new Date(apiKey.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        <p>Requests: {formatNumber(apiKey.requestCount)}</p>
                        <p>IP Allowlist: {apiKey.ipAllowlist.length} {apiKey.ipAllowlist.length === 1 ? 'entry' : 'entries'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <RotateCw className="w-3 h-3" /> Rotate
                        </button>
                        {apiKey.status === 'active' && (
                          <button
                            className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors text-red-400 hover:bg-red-500/10')}
                          >
                            <Trash2 className="w-3 h-3" /> Revoke
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
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                <span className={cn('text-sm font-semibold', isDark ? 'text-white/70' : 'text-black/70')}>Available Scopes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(scopeDescriptions).map(([scope, desc]) => (
                  <div key={scope} className={cn('p-3 rounded-xl border', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                    <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0 mb-1', isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-50 text-violet-600')}>
                      {scope}
                    </Badge>
                    <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>{desc}</p>
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
                  className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Globe className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                          <h3 className="text-sm font-semibold">{wh.name}</h3>
                          <Badge variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? wConf.bgDark : wConf.bgLight)}>
                            {wConf.label}
                          </Badge>
                        </div>
                        <code className={cn('text-[11px] font-mono block truncate', isDark ? 'text-white/35' : 'text-black/35')}>
                          {wh.url.length > 60 ? wh.url.slice(0, 60) + '...' : wh.url}
                        </code>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {wh.events.map((event) => (
                            <Badge key={event} variant="secondary" className={cn('text-[9px] px-1.5 py-0 border-0', isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600')}>
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>Retries: {wh.retryAttempts}</span>
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <Send className="w-3 h-3" /> Test
                        </button>
                        <button
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                        >
                          <RefreshCw className="w-3 h-3" /> Regenerate Secret
                        </button>
                      </div>
                    </div>

                    {/* Last Delivery */}
                    {wh.lastDelivery && (
                      <div className={cn('flex items-center gap-2 p-2.5 rounded-lg text-xs', isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                        <span className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>Last Delivery:</span>
                        {wh.lastDelivery.success ? (
                          <span className="text-emerald-500">✓ {wh.lastDelivery.statusCode} — {new Date(wh.lastDelivery.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        ) : (
                          <span className="text-red-500">✗ {wh.lastDelivery.statusCode} — {new Date(wh.lastDelivery.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    )}

                    {/* Delivery Logs Table */}
                    <div>
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider block mb-2', isDark ? 'text-white/30' : 'text-black/30')}>
                        Recent Deliveries
                      </span>
                      <div className={cn('rounded-lg border overflow-hidden', isDark ? 'border-white/[0.04]' : 'border-black/[0.04]')}>
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className={cn(isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]')}>
                              <th className={cn('text-left px-3 py-2 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Time</th>
                              <th className={cn('text-center px-3 py-2 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Status</th>
                              <th className={cn('text-center px-3 py-2 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Duration</th>
                              <th className={cn('text-right px-3 py-2 font-medium', isDark ? 'text-white/40' : 'text-black/40')}>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wh.deliveryLogs.map((log, j) => (
                              <tr key={j} className={cn('border-t', isDark ? 'border-white/[0.03]' : 'border-black/[0.03]')}>
                                <td className={cn('px-3 py-2 font-mono', isDark ? 'text-white/50' : 'text-black/50')}>
                                  {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-3 py-2 text-center font-mono">{log.statusCode}</td>
                                <td className="px-3 py-2 text-center">{log.duration}ms</td>
                                <td className="px-3 py-2 text-right">
                                  {log.success ? (
                                    <span className="text-emerald-500 flex items-center justify-end gap-1"><Check className="w-3 h-3" /> Success</span>
                                  ) : (
                                    <span className="text-red-500 flex items-center justify-end gap-1"><X className="w-3 h-3" /> Failed</span>
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
              className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Plus className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
                  Create Webhook
                </h3>
                <Button
                  onClick={() => setShowCreateWebhook(!showCreateWebhook)}
                  variant="ghost"
                  size="sm"
                  className={cn('rounded-lg text-xs', isDark ? 'hover:bg-white/[0.06] text-white/40' : 'hover:bg-black/[0.06] text-black/40')}
                >
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showCreateWebhook && 'rotate-180')} />
                </Button>
              </div>
              {showCreateWebhook && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', isDark ? 'text-white/50' : 'text-black/50')}>Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://your-server.com/webhooks/..."
                      className={cn('w-full px-3 py-2 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/80 placeholder:text-white/20 focus:border-violet-500/40' : 'bg-black/[0.02] border-black/[0.06] text-black/80 placeholder:text-black/20 focus:border-violet-500/40')}
                    />
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', isDark ? 'text-white/50' : 'text-black/50')}>Event Subscriptions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['contact.created', 'contact.updated', 'deal.won', 'invoice.paid', 'user.login', 'backup.completed'].map((event) => (
                        <label key={event} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs transition-colors', isDark ? 'border-white/[0.04] hover:bg-white/[0.03]' : 'border-black/[0.04] hover:bg-black/[0.02]')}>
                          <input type="checkbox" className="accent-violet-500 w-3.5 h-3.5" />
                          <span className={cn('font-mono', isDark ? 'text-white/50' : 'text-black/50')}>{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={cn('text-xs font-medium block mb-1.5', isDark ? 'text-white/50' : 'text-black/50')}>Signing Secret</label>
                    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]')}>
                      <code className="flex-1 text-xs font-mono text-violet-400">whsec_••••••••••••••••</code>
                      <button className={cn('p-1 rounded', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                        <Copy className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
                      </button>
                    </div>
                  </div>
                  <Button
                    className={cn('px-4 py-2 text-sm font-medium rounded-xl gap-2', isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90')}
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
