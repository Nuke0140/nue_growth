'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Smartphone, Share2, Globe, Megaphone, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/modules/marketing/types';

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="w-3 h-3" />,
  whatsapp: <MessageSquare className="w-3 h-3" />,
  sms: <Smartphone className="w-3 h-3" />,
  social: <Share2 className="w-3 h-3" />,
  ads: <Megaphone className="w-3 h-3" />,
  'landing-page': <Globe className="w-3 h-3" />,
};

const STATUS_COLORS: Record<string, string> = {
  active: 'text-emerald-500',
  completed: 'text-blue-500',
  paused: 'text-amber-500',
  draft: 'text-gray-500',
};

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const spendPct = campaign.budget > 0 ? Math.round((campaign.spend / campaign.budget) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn('rounded-2xl border p-5 cursor-pointer transition-shadow',
        isDark ? 'bg-white/[0.02] border-white/[0.06] hover:shadow-lg hover:shadow-black/20' : 'bg-white border-black/[0.06] hover:shadow-lg hover:shadow-black/5'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={cn('text-sm font-semibold line-clamp-1', isDark ? 'text-white' : 'text-gray-900')}>{campaign.name}</h3>
        <span className={cn('text-[10px] font-medium shrink-0', STATUS_COLORS[campaign.status] || 'text-gray-500')}>
          {campaign.status}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', isDark ? 'border-white/[0.08] text-white/50' : 'border-gray-200 text-gray-600')}>
          {campaign.type}
        </Badge>
        {campaign.channels.map(ch => (
          <div key={ch} className={cn('w-5 h-5 rounded flex items-center justify-center', isDark ? 'bg-white/[0.06]' : 'bg-gray-100')}
            title={ch}>
            <span className={isDark ? 'text-white/40' : 'text-gray-500'}>{CHANNEL_ICONS[ch] || <Megaphone className="w-3 h-3" />}</span>
          </div>
        ))}
      </div>

      {campaign.roi > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-500">{campaign.roi}% ROI</span>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className={cn('text-[10px]', isDark ? 'text-white/40' : 'text-gray-500')}>Budget Utilization</span>
          <span className={cn('text-[10px] font-medium', isDark ? 'text-white/60' : 'text-gray-600')}>{spendPct}%</span>
        </div>
        <div className={cn('w-full h-1.5 rounded-full', isDark ? 'bg-white/[0.06]' : 'bg-gray-100')}>
          <div
            className={cn('h-full rounded-full', spendPct > 90 ? 'bg-red-500' : spendPct > 70 ? 'bg-amber-500' : 'bg-emerald-500')}
            style={{ width: `${spendPct}%` }}
          />
        </div>
        <div className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>
          ₹{(campaign.spend / 100000).toFixed(1)}L / ₹{(campaign.budget / 100000).toFixed(1)}L
        </div>
      </div>
    </motion.div>
  );
}
