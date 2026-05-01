'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockWhatsAppCampaigns } from '@/modules/marketing/data/mock-data';
import {
  MessageCircle, Plus, Send, Clock, FileText, Image, Video,
  File, Phone, ArrowRight, Eye, MousePointer, BarChart3,
  Users, Search, MoreHorizontal, Headphones, Sparkles,
  Zap, CheckCircle, AlertCircle, ChevronRight, Hash,
  MessageSquare, Bot, ArrowDownToLine,
} from 'lucide-react';

// ---- WhatsApp Icon ----
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ---- KPI Stat ----
function WKPI({ label, value, sub, isDark, icon: Icon }: {
  label: string; value: string; sub: string; isDark: boolean; icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10')}>
          <Icon className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <p className={cn('text-xs font-medium', isDark ? 'text-white/40' : 'text-black/40')}>{label}</p>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className={cn('text-xs mt-1', isDark ? 'text-white/30' : 'text-black/30')}>{sub}</p>
    </motion.div>
  );
}

// ---- Delivery Funnel Bar ----
function DeliveryFunnel({ sent, delivered, read, replied, isDark }: {
  sent: number; delivered: number; read: number; replied: number; isDark: boolean;
}) {
  const steps = [
    { label: 'Sent', value: sent, color: isDark ? 'bg-white/10' : 'bg-black/10' },
    { label: 'Delivered', value: delivered, color: 'bg-emerald-500' },
    { label: 'Read', value: read, color: 'bg-emerald-400' },
    { label: 'Replied', value: replied, color: 'bg-emerald-300' },
  ];
  const total = Math.max(sent, 1);

  return (
    <div className="space-y-1.5">
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ width: 0 }}
            animate={{ width: `${(s.value / total) * 100}%` }}
            transition={{ delay: i * 0.1, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn('h-full rounded-full', s.color)}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <div className={cn('w-1.5 h-1.5 rounded-full', s.color)} />
            <span className={isDark ? 'text-white/30' : 'text-black/30'}>{s.label}</span>
            <span className="font-medium tabular-nums">{s.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Status Badge ----
function WStatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const config: Record<string, { label: string; cls: string }> = {
    sent: { label: 'Sent', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    scheduled: { label: 'Scheduled', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    draft: { label: 'Draft', cls: isDark ? 'bg-white/[0.04] text-white/40' : 'bg-black/[0.04] text-black/40' },
    failed: { label: 'Failed', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  const c = config[status] || config.draft;
  return <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', c.cls)}>{c.label}</Badge>;
}

// ---- Template Card ----
function TemplateCard({ name, text, category, isDark, index }: {
  name: string; text: string; category: string; isDark: boolean; index: number;
}) {
  const [selected, setSelected] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setSelected(!selected)}
      className={cn('rounded-2xl border p-4 cursor-pointer transition-all',
        selected
          ? 'ring-2 ring-emerald-500/40 border-emerald-500/30'
          : isDark ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-white border-black/[0.06] hover:bg-black/[0.02]'
      )}
    >
      {/* Chat bubble style */}
      <div className={cn('rounded-2xl rounded-tl-sm p-3 mb-3 text-xs leading-relaxed',
        isDark ? 'bg-emerald-500/5 text-white/60' : 'bg-emerald-50 text-black/60'
      )}>
        {text}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{name}</span>
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500 border-0">
          {category}
        </Badge>
      </div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function WhatsAppCampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return mockWhatsAppCampaigns;
    const q = searchQuery.toLowerCase();
    return mockWhatsAppCampaigns.filter(c =>
      c.name.toLowerCase().includes(q) || c.template.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const stats = useMemo(() => {
    const sent = mockWhatsAppCampaigns.filter(c => c.status === 'sent');
    const totalSent = sent.reduce((a, c) => a + c.sent, 0);
    const totalDelivered = sent.reduce((a, c) => a + c.delivered, 0);
    const totalRead = sent.reduce((a, c) => a + c.read, 0);
    const totalReplied = sent.reduce((a, c) => a + c.replied, 0);
    const deliveryRate = totalSent ? ((totalDelivered / totalSent) * 100) : 0;
    const readRate = totalDelivered ? ((totalRead / totalDelivered) * 100) : 0;
    const replyRate = totalRead ? ((totalReplied / totalRead) * 100) : 0;
    return { totalSent, deliveryRate, readRate, replyRate };
  }, []);

  // Delivery analytics chart data
  const deliveryChart = [
    { month: 'Nov', sent: 85000, delivered: 82500, read: 58000 },
    { month: 'Dec', sent: 92000, delivered: 89700, read: 65000 },
    { month: 'Jan', sent: 110000, delivered: 107000, read: 78000 },
    { month: 'Feb', sent: 98000, delivered: 95200, read: 72000 },
    { month: 'Mar', sent: 135000, delivered: 131000, read: 94000 },
    { month: 'Apr', sent: 213060, delivered: 207264, read: 143059 },
  ];
  const chartMax = Math.max(...deliveryChart.map(d => d.sent));

  // Sample replies
  const sampleReplies = [
    { id: 'r1', contact: 'Aarav G.', message: 'Tell me more about the Holi offer!', sentiment: 'positive', time: '2 min ago' },
    { id: 'r2', contact: 'Priyanka I.', message: 'I already purchased, thanks!', sentiment: 'positive', time: '5 min ago' },
    { id: 'r3', contact: 'Rohan P.', message: 'Not interested right now.', sentiment: 'neutral', time: '8 min ago' },
    { id: 'r4', contact: 'Kavitha N.', message: 'Can I get this offer on quarterly plan?', sentiment: 'positive', time: '12 min ago' },
    { id: 'r5', contact: 'Siddharth M.', message: 'Please stop sending messages', sentiment: 'negative', time: '15 min ago' },
  ];

  const templates = [
    { name: 'Festive Greeting', text: 'Happy {festival} from {brand}! 🎉 Wishing you joy and success.', category: 'Marketing' },
    { name: 'Cart Reminder', text: 'Hey {name}! You left items in your cart 🛒 Complete now & save 10%.', category: 'Commerce' },
    { name: 'OTP Delivery', text: 'Your {brand} OTP is {{otp}}. Valid for 5 mins. Do not share.', category: 'Utility' },
    { name: 'Flash Sale', text: '⚡ FLASH SALE! {discount}% off for the next {duration} only!', category: 'Promotion' },
  ];

  const mediaIcons: Record<string, React.ElementType> = {
    text: FileText, image: Image, video: Video, document: File,
  };

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
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">WhatsApp Campaigns</h1>
              <p className={cn('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-black/40')}>
                India-first messaging campaigns with Business API
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </Button>
            <Button size="sm" className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-3.5 h-3.5" /> New Campaign
            </Button>
          </div>
        </motion.div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <WKPI label="Total Sent" value={(stats.totalSent / 1000).toFixed(1) + 'K'} sub="All time messages" isDark={isDark} icon={Send} />
          <WKPI label="Delivery Rate" value={stats.deliveryRate.toFixed(1) + '%'} sub="Successfully delivered" isDark={isDark} icon={CheckCircle} />
          <WKPI label="Read Rate" value={stats.readRate.toFixed(1) + '%'} sub="Message opens" isDark={isDark} icon={Eye} />
          <WKPI label="Reply Rate" value={stats.replyRate.toFixed(1) + '%'} sub="Customer engagement" isDark={isDark} icon={MessageSquare} />
        </div>

        {/* Template Selector */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" /> Quick Templates
            </h3>
            <button className={cn('text-xs flex items-center gap-1', isDark ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60')}>
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {templates.map((t, i) => (
              <TemplateCard key={t.name} {...t} isDark={isDark} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Campaign List */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Campaigns</h3>
            <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border',
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-black/[0.02] border-black/[0.06]'
            )}>
              <Search className={cn('w-3.5 h-3.5', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                type="text" placeholder="Search..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn('bg-transparent text-xs focus:outline-none w-32',
                  isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25'
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((campaign, i) => {
              const MediaIcon = mediaIcons[campaign.mediaType] || FileText;
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={cn('rounded-xl p-4 border transition-colors',
                    isDark ? 'bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]' : 'bg-black/[0.01] border-black/[0.04] hover:bg-black/[0.02]'
                  )}
                >
                  {/* Top Row: Name + Status + Actions */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10')}>
                        <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <WStatusBadge status={campaign.status} isDark={isDark} />
                          <span className={cn('text-[10px] flex items-center gap-1', isDark ? 'text-white/30' : 'text-black/30')}>
                            <MediaIcon className="w-3 h-3" /> {campaign.mediaType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {campaign.ctaButton && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-500 border-0">
                          {campaign.ctaButton}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2">
                        <Headphones className="w-3 h-3" /> Agent Takeover
                      </Button>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className={cn('rounded-lg p-2.5 mb-3 text-xs',
                    isDark ? 'bg-emerald-500/5 text-white/50' : 'bg-emerald-50/50 text-black/50'
                  )}>
                    {campaign.template}
                  </div>

                  {/* Quick Replies */}
                  {campaign.quickReplies.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {campaign.quickReplies.map((qr, qi) => (
                        <span key={qi} className={cn('text-[10px] px-2 py-0.5 rounded-full border',
                          isDark ? 'border-white/[0.08] text-white/40' : 'border-black/[0.08] text-black/40'
                        )}>
                          {qr}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Delivery Funnel */}
                  <DeliveryFunnel
                    sent={campaign.sent}
                    delivered={campaign.delivered}
                    read={campaign.read}
                    replied={campaign.replied}
                    isDark={isDark}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivery Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Delivery Analytics
            </h3>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Delivered</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Read</div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-40">
            {deliveryChart.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 w-full h-[120px]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.delivered / chartMax) * 120}px` }}
                    transition={{ delay: i * 0.08, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-lg bg-emerald-500"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.read / chartMax) * 120}px` }}
                    transition={{ delay: i * 0.08 + 0.05, duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-lg bg-emerald-400"
                  />
                </div>
                <span className={cn('text-[10px] font-medium', isDark ? 'text-white/30' : 'text-black/30')}>{d.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reply Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Reply Tracking
            </h3>
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Live</Badge>
          </div>
          <div className="space-y-2 max-h-[240px] overflow-y-auto">
            {sampleReplies.map((reply, i) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05, duration: 0.2 }}
                className={cn('flex items-start gap-3 p-3 rounded-xl transition-colors',
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]'
                )}
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                )}>
                  {reply.contact.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{reply.contact}</span>
                    <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{reply.time}</span>
                    <div className={cn('w-1.5 h-1.5 rounded-full ml-auto',
                      reply.sentiment === 'positive' ? 'bg-emerald-400' :
                      reply.sentiment === 'negative' ? 'bg-red-400' : 'bg-amber-400'
                    )} />
                  </div>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-white/50' : 'text-black/50')}>{reply.message}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] shrink-0 gap-1">
                  <Bot className="w-3 h-3" /> AI Reply
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
