'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockSMSCampaigns } from '@/modules/marketing/data/mock-data';
import {
  Smartphone, Plus, Send, Clock, AlertCircle, Search,
  FileText, BarChart3, ExternalLink, Copy, MoreHorizontal,
  CheckCircle, XCircle, Hash, Zap, ArrowUpRight,
  ShieldCheck, Gift, KeyRound, Truck,
} from 'lucide-react';

// ---- KPI Stat ----
function SMSKPI({ label, value, sub, isDark }: {
  label: string; value: string; sub: string; isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <p className={cn('text-xs font-medium mb-1', isDark ? 'text-white/40' : 'text-black/40')}>{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className={cn('text-xs mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{sub}</p>
    </motion.div>
  );
}

// ---- Status Badge ----
function SMSStatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const config: Record<string, { label: string; cls: string }> = {
    sent: { label: 'Sent', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    scheduled: { label: 'Scheduled', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    draft: { label: 'Draft', cls: isDark ? 'bg-white/[0.04] text-white/40 border-white/[0.08]' : 'bg-black/[0.04] text-black/40 border-black/[0.08]' },
    failed: { label: 'Failed', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  const c = config[status] || config.draft;
  return <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', c.cls)}>{c.label}</Badge>;
}

// ---- Type Badge ----
function TypeBadge({ type, isDark }: { type: string; isDark: boolean }) {
  const config: Record<string, { icon: React.ElementType; cls: string }> = {
    otp: { icon: KeyRound, cls: 'bg-amber-500/10 text-amber-500' },
    promotional: { icon: Gift, cls: 'bg-violet-500/10 text-violet-500' },
    transactional: { icon: Truck, cls: 'bg-sky-500/10 text-sky-500' },
  };
  const c = config[type] || config.promotional;
  return (
    <Badge variant="secondary" className={cn('text-[10px] px-2 py-0 border-0 gap-1 capitalize', c.cls)}>
      <c.icon className="w-3 h-3" /> {type}
    </Badge>
  );
}

// ---- Delivery Bar ----
function DeliveryBar({ delivered, failed, isDark }: { delivered: number; failed: number; isDark: boolean }) {
  const total = delivered + failed;
  const pct = total > 0 ? (delivered / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-1.5 w-16 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
        <div
          className={cn('h-1.5 rounded-full transition-all',
            pct >= 98 ? 'bg-emerald-500' : pct >= 95 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums">{pct.toFixed(1)}%</span>
    </div>
  );
}

// ---- Template Gallery Card ----
function TemplateCard({ name, text, charCount, type, isDark, index }: {
  name: string; text: string; charCount: number; type: string; isDark: boolean; index: number;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-4 flex flex-col',
        isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold">{name}</span>
        <TypeBadge type={type} isDark={isDark} />
      </div>
      <div className={cn('flex-1 rounded-xl p-3 mb-3 font-mono text-xs leading-relaxed',
        isDark ? 'bg-white/[0.02] text-white/50' : 'bg-black/[0.02] text-black/50'
      )}>
        {text}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] tabular-nums', isDark ? 'text-white/25' : 'text-black/25')}>
          {charCount} / 160 chars
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 text-[10px] gap-1 px-2">
            <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button size="sm" className="h-6 text-[10px] gap-1 px-2">Use Template</Button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function SmsCampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'all' | 'otp' | 'promotional' | 'transactional'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = mockSMSCampaigns;
    if (activeTab !== 'all') list = list.filter(c => c.type === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.template.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, searchQuery]);

  const stats = useMemo(() => {
    const totalSent = mockSMSCampaigns.reduce((a, c) => a + c.sent, 0);
    const totalDelivered = mockSMSCampaigns.reduce((a, c) => a + c.delivered, 0);
    const deliveryRate = totalSent ? ((totalDelivered / totalSent) * 100) : 0;
    const avgCtr = mockSMSCampaigns.filter(c => c.ctr > 0).reduce((a, c) => a + c.ctr, 0) /
      Math.max(mockSMSCampaigns.filter(c => c.ctr > 0).length, 1);
    return { totalSent, deliveryRate, avgCtr };
  }, []);

  const tabs: { id: typeof activeTab; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: Smartphone },
    { id: 'otp', label: 'OTP', icon: KeyRound },
    { id: 'promotional', label: 'Promotional', icon: Gift },
    { id: 'transactional', label: 'Transactional', icon: Truck },
  ];

  // Template gallery
  const templates = [
    { name: 'OTP Verification', text: 'Your {{brand}} OTP is {{otp}}. Valid for 5 minutes. Do not share.', charCount: 68, type: 'otp' },
    { name: 'Flash Sale', text: '{{brand}} SALE! Flat {{discount}}% off. Use code {{code}}. Valid till midnight!', charCount: 74, type: 'promotional' },
    { name: 'Shipping Update', text: 'Your order #{{order_id}} has been shipped! Track: {{url}}. ETA: {{date}}.', charCount: 72, type: 'transactional' },
    { name: 'Webinar Reminder', text: 'Reminder: {{event}} starts in 1 hour! Join: {{link}}. Don\'t miss out!', charCount: 70, type: 'promotional' },
  ];

  // Link tracking data
  const linkTracking = [
    { url: 'diginue.in/summer-sale', clicks: 4250, ctr: 18.2 },
    { url: 'diginue.in/webinar-ai', clicks: 1840, ctr: 12.8 },
    { url: 'diginue.in/renew', clicks: 620, ctr: 24.5 },
    { url: 'diginue.in/diwali-dhamaka', clicks: 0, ctr: 0 },
    { url: 'diginue.in/free-trial', clicks: 3120, ctr: 15.6 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
              isDark ? 'bg-violet-500/10' : 'bg-violet-50'
            )}>
              <Smartphone className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SMS Campaigns</h1>
              <p className={cn('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                High-deliverability SMS at Indian telecom rates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Reports
            </Button>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> New SMS
            </Button>
          </div>
        </motion.div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SMSKPI label="Total Sent" value={(stats.totalSent / 1000).toFixed(1) + 'K'} sub="All time messages" isDark={isDark} />
          <SMSKPI label="Delivery Rate" value={stats.deliveryRate.toFixed(1) + '%'} sub="Avg delivery success" isDark={isDark} />
          <SMSKPI label="Avg CTR" value={stats.avgCtr.toFixed(1) + '%'} sub="Click-through rate" isDark={isDark} />
          <SMSKPI label="Active Templates" value="12" sub="DND-compliant" isDark={isDark} />
        </div>

        {/* Type Tabs */}
        <div className={cn('flex items-center gap-1 p-1 rounded-xl w-fit',
          isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
        )}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeTab === tab.id
                  ? isDark ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-white text-black shadow-sm'
                  : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border w-full max-w-sm',
          isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
          <input
            type="text" placeholder="Search campaigns..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn('bg-transparent text-sm focus:outline-none w-full',
              isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
            )}
          />
        </div>

        {/* Campaigns Table */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border overflow-hidden', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          {/* Table Header */}
          <div className={cn('grid grid-cols-12 gap-2 px-5 py-3 text-xs font-medium border-b',
            isDark ? 'text-white/40 border-white/[0.04]' : 'text-black/40 border-black/[0.04]'
          )}>
            <div className="col-span-2">Campaign</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Template Preview</div>
            <div className="col-span-1 text-right">Delivery</div>
            <div className="col-span-2">Sent / Delivered / Failed</div>
            <div className="col-span-1 text-right">CTR</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="max-h-[350px] overflow-y-auto">
            {filtered.map((campaign, i) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn('grid grid-cols-12 gap-2 px-5 py-3 text-xs border-b items-center transition-colors',
                  isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-black/[0.03] hover:bg-black/[0.01]',
                  i === filtered.length - 1 && 'border-b-0'
                )}
              >
                {/* Name */}
                <div className="col-span-2 min-w-0">
                  <p className="text-sm font-medium truncate">{campaign.name}</p>
                </div>

                {/* Type */}
                <div className="col-span-1">
                  <TypeBadge type={campaign.type} isDark={isDark} />
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <SMSStatusBadge status={campaign.status} isDark={isDark} />
                </div>

                {/* Template Preview */}
                <div className="col-span-3 min-w-0">
                  <p className="font-mono text-[11px] truncate" style={{
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'
                  }}>
                    {campaign.template}
                  </p>
                </div>

                {/* Delivery % */}
                <div className="col-span-1">
                  <DeliveryBar delivered={campaign.delivered} failed={campaign.failed} isDark={isDark} />
                </div>

                {/* Sent/Delivered/Failed */}
                <div className="col-span-2 text-[11px] tabular-nums">
                  <span className="font-medium">{(campaign.sent / 1000).toFixed(1)}K</span>
                  <span className={isDark ? 'text-white/20' : 'text-black/20'}> / </span>
                  <span className="text-emerald-500">{(campaign.delivered / 1000).toFixed(1)}K</span>
                  <span className={isDark ? 'text-white/20' : 'text-black/20'}> / </span>
                  <span className="text-red-400">{campaign.failed}</span>
                </div>

                {/* CTR */}
                <div className="col-span-1 text-right font-medium tabular-nums">
                  {campaign.ctr > 0 ? campaign.ctr + '%' : '—'}
                </div>

                {/* Actions */}
                <div className="col-span-1 text-right">
                  <button className={cn('p-1 rounded-lg transition-colors',
                    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
                  )}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Smartphone className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-white/15' : 'text-black/15')} />
                <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No campaigns found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Template Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-500" /> Template Gallery
            </h3>
            <button className={cn('text-xs flex items-center gap-1',
              isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
            )}>
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((t, i) => (
              <TemplateCard key={t.name} {...t} isDark={isDark} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Link Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Link Tracking
            </h3>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Top URLs</Badge>
          </div>
          <div className="space-y-2">
            {linkTracking.map((link, i) => (
              <motion.div
                key={link.url}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.2 }}
                className={cn('flex items-center justify-between p-3 rounded-xl transition-colors',
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ExternalLink className={cn('w-3.5 h-3.5 shrink-0', isDark ? 'text-white/20' : 'text-black/20')} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{link.url}</p>
                    <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-black/25')}>
                      {link.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {link.ctr > 0 && (
                    <div className={cn('h-1.5 w-12 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${Math.min(link.ctr * 3, 100)}%` }} />
                    </div>
                  )}
                  <span className="text-xs font-medium tabular-nums w-12 text-right">
                    {link.ctr > 0 ? link.ctr + '%' : '—'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
