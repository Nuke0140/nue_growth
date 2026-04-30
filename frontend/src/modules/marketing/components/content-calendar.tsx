'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { SocialPost } from '@/modules/marketing/types';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  tiktok: '#000000',
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  facebook: '📘',
  twitter: '🐦',
  linkedin: '💼',
  youtube: '▶️',
  tiktok: '🎵',
};

interface ContentCalendarProps {
  posts: SocialPost[];
  onPostClick?: (post: SocialPost) => void;
  viewMode?: 'month' | 'week';
}

export default function ContentCalendar({ posts, onPostClick, viewMode = 'month' }: ContentCalendarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const postsByDate = useMemo(() => {
    const map: Record<string, SocialPost[]> = {};
    posts.forEach(post => {
      const date = post.scheduledDate || post.scheduledTime?.split('T')[0] || '';
      if (!date) return;
      if (!map[date]) map[date] = [];
      map[date].push(post);
    });
    return map;
  }, [posts]);

  const dates = useMemo(() => {
    const allDates = Object.keys(postsByDate).sort();
    if (viewMode === 'week') return allDates.slice(0, 7);
    return allDates;
  }, [postsByDate, viewMode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-[var(--app-success-bg)] text-[var(--app-success)]';
      case 'scheduled': return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600';
      case 'draft': return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-50 text-gray-600';
      default: return '';
    }
  };

  if (dates.length === 0) {
    return (
      <div className={cn('rounded-[var(--app-radius-xl)] border p-app-3xl text-center', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
        <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No scheduled posts</p>
      </div>
    );
  }

  if (viewMode === 'week') {
    return (
      <div className={cn('rounded-[var(--app-radius-xl)] border overflow-hidden', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
        <div className="grid grid-cols-7 divide-x" style={{ borderColor: 'var(--app-border)' }}>
          {dates.map((date, i) => {
            const dayPosts = postsByDate[date] || [];
            const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = new Date(date).getDate();
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="p-3 space-y-2 min-h-[180px]"
              >
                <div className="text-center mb-2">
                  <p className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>{dayLabel}</p>
                  <p className={cn('text-lg font-bold', 'text-[var(--app-text)]')}>{dayNum}</p>
                </div>
                {dayPosts.map(post => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onPostClick?.(post)}
                    className={cn('rounded-[var(--app-radius-lg)] p-2 cursor-pointer text-[10px]', isDark ? 'bg-white/[0.04]' : 'bg-gray-50')}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span>{PLATFORM_ICONS[post.platform] || '📄'}</span>
                      <span className={cn('font-medium truncate', 'text-[var(--app-text-secondary)]')}>
                        {post.platform}
                      </span>
                    </div>
                    <p className={cn('line-clamp-2 leading-tight', 'text-[var(--app-text-muted)]')}>
                      {post.caption.slice(0, 60)}...
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view: grid
  return (
    <div className={cn('rounded-[var(--app-radius-xl)] border p-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <span key={d} className={cn('text-[10px] font-medium py-1', 'text-[var(--app-text-muted)]')}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, i) => {
          const dayPosts = postsByDate[date] || [];
          const dayNum = new Date(date).getDate();
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              className="p-1.5 rounded-[var(--app-radius-lg)] min-h-[80px] space-y-0.5"
            >
              <span className={cn('text-[10px] font-medium block mb-1', isDark ? 'text-white/50' : 'text-gray-600')}>{dayNum}</span>
              {dayPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => onPostClick?.(post)}
                  className="flex items-center gap-0.5 cursor-pointer"
                  title={post.caption}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] || '#6b7280' }} />
                  <span className={cn('text-[8px] truncate', 'text-[var(--app-text-muted)]')}>{post.platform.slice(0, 3)}</span>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
