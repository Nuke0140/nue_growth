'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockEmailCampaigns } from '@/modules/marketing/data/mock-data';
import {
  Mail, Plus, Send, Clock, AlertCircle, Sparkles,
  FileText, Image, MousePointerClick, Quote, Gift,
  Timer, User, ChevronDown, MoreHorizontal, Search,
  BarChart3, Eye, MousePointer, MessageSquare, Shield,
  ArrowRight, GripVertical, Pencil, Trash2, Copy, Settings,
} from 'lucide-react';

// ---- Status Badge ----
function StatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const config: Record<string, { label: string; cls: string }> = {
    sent: { label: 'Sent', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    scheduled: { label: 'Scheduled', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    draft: { label: 'Draft', cls: isDark ? 'bg-white/[0.04] text-white/40 border-white/[0.08]' : 'bg-black/[0.04] text-black/40 border-black/[0.08]' },
    failed: { label: 'Failed', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  const c = config[status] || config.draft;
  return <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', c.cls)}>{c.label}</Badge>;
}

// ---- Progress Bar ----
function ProgressPill({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-1.5 w-16 rounded-full', 'bg-black/5 dark:bg-white/5')}>
        <div className={cn('h-1.5 rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums">{value}%</span>
    </div>
  );
}

// ---- KPI Card ----
function KPIStat({ label, value, sub, isDark }: { label: string; value: string; sub: string; isDark: boolean }) {
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

// ---- Email Builder Panel ----
function EmailBuilderPanel({ isDark }: { isDark: boolean }) {
  const [activeBlock, setActiveBlock] = useState('text');
  const [blocks] = useState([
    { id: 'b1', type: 'text', label: 'Text Block', icon: FileText },
    { id: 'b2', type: 'image', label: 'Image', icon: Image },
    { id: 'b3', type: 'cta', label: 'CTA Button', icon: MousePointerClick },
    { id: 'b4', type: 'testimonial', label: 'Testimonial', icon: Quote },
    { id: 'b5', type: 'offer', label: 'Offer Card', icon: Gift },
    { id: 'b6', type: 'countdown', label: 'Countdown', icon: Timer },
    { id: 'b7', type: 'personalization', label: 'Personalization', icon: User },
  ]);

  const [addedBlocks, setAddedBlocks] = useState([
    { id: 'a1', type: 'text', content: 'Hi {{firstName}},' },
    { id: 'a2', type: 'image', content: 'Product hero banner' },
    { id: 'a3', type: 'cta', content: 'Start Free Trial →' },
  ]);

  const addBlock = (type: string) => {
    setAddedBlocks([...addedBlocks, { id: `a${Date.now()}`, type, content: `New ${type} block` }]);
    setActiveBlock(type);
  };
  const removeBlock = (id: string) => {
    setAddedBlocks(addedBlocks.filter(b => b.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Email Builder
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Eye className="w-3 h-3" /> Preview
          </Button>
          <Button size="sm" className="h-7 text-xs gap-1">
            <Send className="w-3 h-3" /> Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left: Block Types */}
        <div className="col-span-3 space-y-1.5">
          <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', isDark ? 'text-white/30' : 'text-black/30')}>
            Blocks
          </p>
          {blocks.map(block => (
            <button
              key={block.id}
              onClick={() => setActiveBlock(block.type)}
              className={cn(
                'w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all',
                activeBlock === block.type
                  ? isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
                  : isDark ? 'text-white/40 hover:bg-white/[0.03]' : 'text-black/40 hover:bg-black/[0.02]'
              )}
            >
              <block.icon className="w-3.5 h-3.5 shrink-0" />
              {block.label}
            </button>
          ))}
        </div>

        {/* Center: Preview */}
        <div className={cn('col-span-6 rounded-xl p-4 min-h-[280px] space-y-2',
          isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Mail className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
            <span className={cn('text-[10px] font-medium', isDark ? 'text-white/25' : 'text-black/25')}>
              Email Preview
            </span>
          </div>
          {addedBlocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className={cn('rounded-lg p-3 flex items-center justify-between group',
                block.type === 'cta'
                  ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'
                  : isDark ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-white border border-black/[0.04]'
              )}
            >
              <span className="text-xs">{block.content}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-black/20')} />
                <button onClick={() => removeBlock(block.id)} className="p-0.5 text-red-400 hover:bg-red-400/10 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
          <button
            onClick={() => addBlock(activeBlock)}
            className={cn('w-full py-2 rounded-lg text-xs border border-dashed transition-colors',
              isDark ? 'text-white/20 hover:text-white/40 border-white/[0.06] hover:border-white/[0.12]' : 'text-black/20 hover:text-black/40 border-black/[0.06] hover:border-black/[0.12]'
            )}
          >
            + Add {activeBlock} block
          </button>
        </div>

        {/* Right: Settings */}
        <div className="col-span-3 space-y-3">
          <p className={cn('text-[10px] font-semibold uppercase tracking-wider mb-2', isDark ? 'text-white/30' : 'text-black/30')}>
            Settings
          </p>
          {[
            { label: 'From Name', value: 'DigiNue Team' },
            { label: 'Reply-To', value: 'hello@diginue.in' },
            { label: 'Subject Line', value: 'What\'s New...' },
            { label: 'Preview Text', value: 'AI Analytics...' },
          ].map((s, i) => (
            <div key={i}>
              <p className={cn('text-[10px] mb-1', isDark ? 'text-white/25' : 'text-black/25')}>{s.label}</p>
              <div className={cn('text-xs px-2 py-1.5 rounded-lg border',
                isDark ? 'border-white/[0.06] text-white/70' : 'border-black/[0.06] text-black/70'
              )}>{s.value}</div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <Settings className={cn('w-3.5 h-3.5', isDark ? 'text-white/25' : 'text-black/25')} />
            <span className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>Advanced settings</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- AI Copy Suggestions ----
function AICopySuggestions({ isDark }: { isDark: boolean }) {
  const suggestions = [
    { subject: 'Your March update is here — See what\'s new', score: 94 },
    { subject: 'We shipped 3 features you asked for', score: 87 },
    { subject: 'Don\'t miss: New AI tools just dropped', score: 82 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold">AI Copy Suggestions</h3>
        <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">3 alternatives</Badge>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.2 }}
            className={cn('flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer',
              isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'
            )}
          >
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-xs font-medium truncate">{s.subject}</p>
              <p className={cn('text-[10px] mt-0.5', isDark ? 'text-white/25' : 'text-black/25')}>
                AI confidence score
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                s.score >= 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              )}>
                {s.score}%
              </div>
              <button className={cn('p-1 rounded-lg transition-colors',
                isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
              )}>
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function EmailBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let list = mockEmailCampaigns;
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    }
    return list;
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const sent = mockEmailCampaigns.filter(c => c.status === 'sent');
    const totalSent = sent.reduce((a, c) => a + c.listSize, 0);
    const avgOpen = sent.length ? (sent.reduce((a, c) => a + c.openRate, 0) / sent.length) : 0;
    const avgClick = sent.length ? (sent.reduce((a, c) => a + c.clickRate, 0) / sent.length) : 0;
    const avgSpam = sent.length ? (sent.reduce((a, c) => a + c.spamScore, 0) / sent.length) : 0;
    return { totalSent, avgOpen, avgClick, avgSpam };
  }, []);

  const statusFilters = ['all', 'sent', 'scheduled', 'draft', 'failed'];

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
          <div>
            <h1 className="text-xl font-bold tracking-tight">Email Campaigns</h1>
            <p className={cn('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
              Build, send, and analyse email campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Reports
            </Button>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Create Email
            </Button>
          </div>
        </motion.div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIStat label="Total Sent" value={(stats.totalSent / 1000).toFixed(1) + 'K'} sub="Across all campaigns" isDark={isDark} />
          <KPIStat label="Avg Open Rate" value={stats.avgOpen.toFixed(1) + '%'} sub="30-day average" isDark={isDark} />
          <KPIStat label="Avg Click Rate" value={stats.avgClick.toFixed(1) + '%'} sub="Engagement metric" isDark={isDark} />
          <KPIStat label="Avg Spam Score" value={stats.avgSpam.toFixed(3)} sub="Compliance check" isDark={isDark} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 max-w-sm',
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
          <div className="flex items-center gap-1">
            {statusFilters.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  statusFilter === f
                    ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.06] text-black'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                )}
              >
                {f}
              </button>
            ))}
          </div>
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
            <div className="col-span-3">Campaign</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">List Size</div>
            <div className="col-span-2">Open Rate</div>
            <div className="col-span-1 text-right">Click</div>
            <div className="col-span-1 text-right">Reply</div>
            <div className="col-span-2">Spam Score</div>
            <div className="col-span-1 text-right">Sent</div>
          </div>

          {/* Table Body */}
          <div className="max-h-[400px] overflow-y-auto">
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
                {/* Campaign Name + Subject */}
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-medium truncate">{campaign.name}</p>
                  <p className={cn('text-[10px] truncate mt-0.5', isDark ? 'text-white/30' : 'text-black/30')}>
                    {campaign.subject}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <StatusBadge status={campaign.status} isDark={isDark} />
                </div>

                {/* List Size */}
                <div className="col-span-1 text-right font-medium tabular-nums">
                  {(campaign.listSize / 1000).toFixed(1)}K
                </div>

                {/* Open Rate */}
                <div className="col-span-2">
                  <ProgressPill
                    value={campaign.openRate}
                    max={60}
                    color={campaign.openRate > 25 ? 'bg-emerald-500' : campaign.openRate > 15 ? 'bg-amber-500' : 'bg-red-500'}
                  />
                </div>

                {/* Click Rate */}
                <div className="col-span-1 text-right tabular-nums font-medium">
                  {campaign.clickRate}%
                </div>

                {/* Reply Rate */}
                <div className="col-span-1 text-right tabular-nums font-medium">
                  {campaign.replyRate}%
                </div>

                {/* Spam Score */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <Shield className={cn('w-3 h-3',
                    campaign.spamScore < 0.03 ? 'text-emerald-400' :
                    campaign.spamScore < 0.06 ? 'text-amber-400' : 'text-red-400'
                  )} />
                  <span className={cn('font-medium tabular-nums',
                    campaign.spamScore < 0.03 ? 'text-emerald-400' :
                    campaign.spamScore < 0.06 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {campaign.spamScore}
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-black/5 dark:bg-white/5">
                    <div className={cn('h-1 rounded-full',
                      campaign.spamScore < 0.03 ? 'bg-emerald-500' :
                      campaign.spamScore < 0.06 ? 'bg-amber-500' : 'bg-red-500'
                    )} style={{ width: `${Math.min(campaign.spamScore * 1000, 100)}%` }} />
                  </div>
                </div>

                {/* Sent Date */}
                <div className="col-span-1 text-right">
                  <span className={cn('tabular-nums', isDark ? 'text-white/40' : 'text-black/40')}>
                    {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                  </span>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Mail className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-white/15' : 'text-black/15')} />
                <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No campaigns found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Email Builder Panel */}
        <EmailBuilderPanel isDark={isDark} />

        {/* AI Copy Suggestions */}
        <AICopySuggestions isDark={isDark} />
      </div>
    </div>
  );
}
