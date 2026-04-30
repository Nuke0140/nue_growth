'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SocialPost } from '@/modules/marketing/types';

const PLATFORM_CONFIG: Record<string, { icon: string; color: string }> = {
  instagram: { icon: '📸', color: '#E1306C' },
  facebook: { icon: '📘', color: '#1877F2' },
  twitter: { icon: '🐦', color: '#1DA1F2' },
  linkedin: { icon: '💼', color: '#0A66C2' },
  youtube: { icon: '▶️', color: '#FF0000' },
  tiktok: { icon: '🎵', color: '#000000' },
};

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-500',
  scheduled: 'bg-blue-500/15 text-blue-500',
  draft: 'bg-gray-500/15 text-gray-500',
  failed: 'bg-red-500/15 text-red-500',
};

interface PostPreviewCardProps {
  post: SocialPost;
}

export default function PostPreviewCard({ post }: PostPreviewCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const platformConfig = PLATFORM_CONFIG[post.platform] || PLATFORM_CONFIG.instagram;

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn('rounded-[var(--app-radius-xl)] border p-4 space-y-3', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: platformConfig.color + '22' }}>
            <span className="text-xs">{platformConfig.icon}</span>
          </div>
          <span className={cn('text-xs font-medium capitalize', 'text-[var(--app-text-secondary)]')}>
            {post.platform}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge className={cn('text-[9px] px-2 py-0.5 border-0', STATUS_STYLES[post.status])}>
            {post.status}
          </Badge>
        </div>
      </div>

      <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-white/60' : 'text-gray-700')}>
        {post.caption}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant="outline" className={cn('text-[9px] px-2 py-0 border', isDark ? 'border-white/[0.08] text-white/40' : 'border-gray-200 text-gray-500')}>
          {post.mediaType}
        </Badge>
        {post.hashtags.slice(0, 3).map(tag => (
          <span key={tag} className={cn('text-[9px]', isDark ? 'text-blue-400/60' : 'text-blue-500')}>{tag}</span>
        ))}
      </div>

      {(post.likes || post.comments || post.shares || post.reach) && (
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1">
            <Heart className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>{formatNumber(post.comments)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>{formatNumber(post.shares)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className={cn('text-[10px] tabular-nums', 'text-[var(--app-text-muted)]')}>{formatNumber(post.reach)}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
