'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMarketingStore } from '@/modules/marketing/marketing-store';
import { mockSocialPosts } from '@/modules/marketing/data/mock-data';
import {
  CalendarDays, Plus, Search, Grid3X3, Columns3,
  Heart, MessageCircle, Share2, Eye, Sparkles,
  ChevronLeft, ChevronRight, MoreHorizontal, Image,
  Video, Film, Camera, Clock, ArrowUpRight, Zap,
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  Bot, Hash,
} from 'lucide-react';

// ---- Platform Config ----
const platformConfig: Record<string, { label: string; color: string; bgLight: string; bgDark: string; textLight: string; textDark: string; dotColor: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C', bgLight: 'bg-pink-50', bgDark: 'bg-pink-500/10', textLight: 'text-pink-600', textDark: 'text-pink-400', dotColor: 'bg-pink-500' },
  facebook: { label: 'Facebook', color: '#1877F2', bgLight: 'bg-blue-50', bgDark: 'bg-blue-500/10', textLight: 'text-blue-600', textDark: 'text-blue-400', dotColor: 'bg-blue-500' },
  twitter: { label: 'Twitter', color: '#1DA1F2', bgLight: 'bg-sky-50', bgDark: 'bg-sky-500/10', textLight: 'text-sky-600', textDark: 'text-sky-400', dotColor: 'bg-sky-500' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', bgLight: 'bg-indigo-50', bgDark: 'bg-indigo-500/10', textLight: 'text-indigo-600', textDark: 'text-indigo-400', dotColor: 'bg-indigo-500' },
  youtube: { label: 'YouTube', color: '#FF0000', bgLight: 'bg-red-50', bgDark: 'bg-red-500/10', textLight: 'text-red-600', textDark: 'text-red-400', dotColor: 'bg-red-500' },
  tiktok: { label: 'TikTok', color: '#00F2EA', bgLight: 'bg-cyan-50', bgDark: 'bg-cyan-500/10', textLight: 'text-cyan-600', textDark: 'text-cyan-400', dotColor: 'bg-cyan-500' },
};

// ---- Helper: Format date ----
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ---- Status Badge ----
function PostStatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const config: Record<string, { label: string; cls: string }> = {
    published: { label: 'Published', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    scheduled: { label: 'Scheduled', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    draft: { label: 'Draft', cls: isDark ? 'bg-white/[0.04] text-white/40 border-white/[0.08]' : 'bg-black/[0.04] text-black/40 border-black/[0.08]' },
    failed: { label: 'Failed', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  const c = config[status] || config.draft;
  return <Badge variant="outline" className={cn('text-[10px] px-2 py-0 border', c.cls)}>{c.label}</Badge>;
}

// ---- Calendar Helpers ----
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ---- Post Card (for week view and day panel) ----
function PostCard({ post, isDark, compact = false }: {
  post: typeof mockSocialPosts[0]; isDark: boolean; compact?: boolean;
}) {
  const pc = platformConfig[post.platform] || platformConfig.instagram;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-[var(--app-radius-lg)] p-3 border transition-colors',
        isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-white border-black/[0.04] hover:bg-black/[0.02]'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn('w-6 h-6 rounded-[var(--app-radius-lg)] flex items-center justify-center', isDark ? pc.bgDark : pc.bgLight)}>
            <div className={cn('w-2 h-2 rounded-full', pc.dotColor)} />
          </div>
          <span className={cn('text-[10px] font-medium capitalize', isDark ? pc.textDark : pc.textLight)}>
            {post.platform}
          </span>
          <PostStatusBadge status={post.status} isDark={isDark} />
        </div>
        {!compact && (
          <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
            {formatTime(post.scheduledAt)}
          </span>
        )}
      </div>
      {!compact && (
        <p className={cn('text-xs leading-relaxed mb-2 line-clamp-2', 'text-[var(--app-text-secondary)]')}>
          {post.caption}
        </p>
      )}
      {post.status === 'published' && (
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="font-medium tabular-nums">{(post.likes || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className="font-medium tabular-nums">{(post.comments || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className="font-medium tabular-nums">{(post.shares || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <span className="font-medium tabular-nums">{(post.reach || 0).toLocaleString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ---- AI Content Ideas ----
function AIContentIdeas({ isDark }: { isDark: boolean }) {
  const ideas = [
    {
      topic: 'Behind the Scenes: Product Development Sprint',
      platform: 'Instagram Reels',
      bestTime: 'Thu 6 PM IST',
      description: 'Show your team building a feature in a 30-second Reel with trending audio. Post during peak engagement for max reach.',
      reason: 'Reels get 2.3x more reach than static posts in your niche.',
    },
    {
      topic: 'Industry Hot Take: AI vs Human Marketers in 2026',
      platform: 'LinkedIn',
      bestTime: 'Tue 10 AM IST',
      description: 'Share a contrarian opinion on AI marketing trends to spark discussion. Tag industry leaders for engagement boost.',
      reason: 'Controversial posts get 3.1x more comments on average.',
    },
    {
      topic: 'Customer Success Story Thread',
      platform: 'Twitter/X',
      bestTime: 'Wed 12 PM IST',
      description: '5-tweet thread showing how a customer grew revenue using your product. Include real metrics and before/after.',
      reason: 'Thread format gets 4.7x more saves than single tweets.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold">AI Content Ideas</h3>
        <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0 bg-purple-500/10 text-purple-400 border-0">AI-Powered</Badge>
      </div>
      <div className="space-y-3">
        {ideas.map((idea, i) => (
          <motion.div
            key={idea.topic}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.25 }}
            className={cn('rounded-[var(--app-radius-lg)] p-3 transition-colors cursor-pointer',
              'hover:bg-[var(--app-hover-bg)]'
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-xs font-semibold">{idea.topic}</p>
              <Button variant="ghost" size="sm" className="h-5 text-[10px] shrink-0 gap-1 px-1.5">
                <Bot className="w-4 h-4" /> Use
              </Button>
            </div>
            <p className={cn('text-[11px] leading-relaxed mb-2', 'text-[var(--app-text-muted)]')}>
              {idea.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 border-0">
                {idea.platform}
              </Badge>
              <span className={cn('text-[10px] flex items-center gap-1', 'text-[var(--app-text-muted)]')}>
                <Clock className="w-2.5 h-2.5" /> {idea.bestTime}
              </span>
            </div>
            <p className={cn('text-[10px] mt-2 px-2 py-1 rounded-[var(--app-radius-lg)]', isDark ? 'bg-purple-500/5 text-purple-300/60' : 'bg-purple-50 text-purple-600/60')}>
              {idea.reason}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function SocialCalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { navigateTo } = useMarketingStore();

  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [calendarMonth, setCalendarMonth] = useState(3); // April = 3
  const [calendarYear, setCalendarYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = mockSocialPosts;
    if (platformFilter !== 'all') posts = posts.filter(p => p.platform === platformFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p => p.caption.toLowerCase().includes(q));
    }
    return posts;
  }, [platformFilter, searchQuery]);

  // Group posts by date
  const postsByDate = useMemo(() => {
    const map: Record<string, typeof mockSocialPosts> = {};
    filteredPosts.forEach(p => {
      const dateKey = new Date(p.scheduledAt).toDateString();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(p);
    });
    return map;
  }, [filteredPosts]);

  // Posts for selected day
  const selectedDayPosts = useMemo(() => {
    if (!selectedDate) return [];
    return postsByDate[selectedDate] || [];
  }, [selectedDate, postsByDate]);

  // Upcoming scheduled posts (next 5)
  const upcomingPosts = useMemo(() => {
    return filteredPosts
      .filter(p => p.status === 'scheduled' && new Date(p.scheduledAt) > new Date())
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5);
  }, [filteredPosts]);

  // Calendar data
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Week view data
  const weekViewDays = useMemo(() => {
    const base = selectedDate ? new Date(selectedDate) : new Date(2026, 3, 6);
    const start = new Date(base);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const platforms = ['all', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok'];

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
    else setCalendarMonth(calendarMonth - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
    else setCalendarMonth(calendarMonth + 1);
  };

  const handleCreatePost = () => {
    navigateTo('post-builder' as 'social-calendar');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-app-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight">Social Calendar</h1>
            <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
              Plan, schedule, and publish across all platforms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Assist
            </Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={handleCreatePost}>
              <Plus className="w-4 h-4" /> Create Post
            </Button>
          </div>
        </motion.div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* View Toggle */}
          <div className={cn('flex items-center gap-1 p-1 rounded-[var(--app-radius-lg)]', 'bg-[var(--app-hover-bg)]')}>
            <button
              onClick={() => setViewMode('month')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors',
                viewMode === 'month'
                  ? isDark ? 'bg-white/[0.08] text-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]' : 'bg-white text-black shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
                  : 'text-[var(--app-text-muted)]'
              )}
            >
              <Grid3X3 className="w-4 h-4" /> Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors',
                viewMode === 'week'
                  ? isDark ? 'bg-white/[0.08] text-white shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]' : 'bg-white text-black shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]'
                  : 'text-[var(--app-text-muted)]'
              )}
            >
              <Columns3 className="w-4 h-4" /> Week
            </button>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {platforms.map(p => {
              const pc = p !== 'all' ? platformConfig[p] : null;
              return (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={cn('px-2.5 py-1 rounded-[var(--app-radius-lg)] text-[10px] font-medium transition-colors capitalize',
                    platformFilter === p
                      ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.06] text-black'
                      : isDark ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50'
                  )}
                >
                  {p !== 'all' && <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', pc?.dotColor)} />}
                  {p === 'all' ? 'All' : pc?.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-[var(--app-radius-lg)] border ml-auto',
            'bg-[var(--app-card-bg)] border-[var(--app-border)]'
          )}>
            <Search className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
            <input
              type="text" placeholder="Search posts..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn('bg-transparent text-xs focus:outline-none w-32',
                'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
              )}
            />
          </div>
        </div>

        {/* Main Grid: Calendar + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-app-2xl">
          {/* Calendar Area */}
          <div className="lg:col-span-2">
            {viewMode === 'month' ? (
              /* ====== MONTH VIEW ====== */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
              >
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">{monthName}</h3>
                  <div className="flex items-center gap-1">
                    <button onClick={prevMonth} className={cn('p-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextMonth} className={cn('p-1.5 rounded-[var(--app-radius-lg)] transition-colors',
                      'hover:bg-[var(--app-hover-bg)]'
                    )}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Week Day Headers */}
                <div className="grid grid-cols-7 mb-1">
                  {weekDays.map(d => (
                    <div key={d} className={cn('text-center text-[10px] font-medium py-2',
                      'text-[var(--app-text-muted)]'
                    )}>{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(calendarYear, calendarMonth, day);
                    const dateKey = dateObj.toDateString();
                    const dayPosts = postsByDate[dateKey] || [];
                    const isSelected = selectedDate === dateKey;
                    const isToday = dateKey === new Date().toDateString();
                    const hasPosts = dayPosts.length > 0;

                    return (
                      <motion.button
                        key={day}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.01, duration: 0.15 }}
                        onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                        className={cn('aspect-square rounded-[var(--app-radius-lg)] flex flex-col items-center justify-center gap-1 transition-colors relative',
                          isSelected
                            ? isDark ? 'bg-white/[0.08] ring-1 ring-white/[0.15]' : 'bg-black/[0.06] ring-1 ring-black/[0.15]'
                            : 'hover:bg-[var(--app-hover-bg)]',
                          isToday && !isSelected && ('bg-[var(--app-hover-bg)]')
                        )}
                      >
                        <span className={cn('text-xs',
                          isSelected ? 'font-bold' : 'font-medium',
                          'text-[var(--app-text-secondary)]'
                        )}>{day}</span>

                        {/* Post dots */}
                        {hasPosts && (
                          <div className="flex items-center gap-0.5">
                            {dayPosts.slice(0, 4).map((p, pi) => {
                              const pc = platformConfig[p.platform] || platformConfig.instagram;
                              return (
                                <div key={pi} className={cn('w-1.5 h-1.5 rounded-full', pc.dotColor)} />
                              );
                            })}
                            {dayPosts.length > 4 && (
                              <span className={cn('text-[8px]', 'text-[var(--app-text-muted)]')}>
                                +{dayPosts.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ====== WEEK VIEW ====== */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">
                    {weekViewDays[0].toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {weekViewDays[6].toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button onClick={() => {
                      const prev = new Date(weekViewDays[0]);
                      prev.setDate(prev.getDate() - 7);
                      setSelectedDate(prev.toDateString());
                    }} className={cn('p-1.5 rounded-[var(--app-radius-lg)] transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      const next = new Date(weekViewDays[0]);
                      next.setDate(next.getDate() + 7);
                      setSelectedDate(next.toDateString());
                    }} className={cn('p-1.5 rounded-[var(--app-radius-lg)] transition-colors', 'hover:bg-[var(--app-hover-bg)]')}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekViewDays.map((d, i) => {
                    const dateKey = d.toDateString();
                    const dayPosts = postsByDate[dateKey] || [];
                    const isSelected = selectedDate === dateKey;

                    return (
                      <div key={i} className="space-y-2">
                        {/* Day Header */}
                        <button
                          onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                          className={cn('w-full text-center py-2 rounded-[var(--app-radius-lg)] text-xs font-medium transition-colors',
                            isSelected
                              ? 'bg-[var(--app-hover-bg)]'
                              : 'hover:bg-[var(--app-hover-bg)]'
                          )}
                        >
                          <div className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                            {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </div>
                          <div>{d.getDate()}</div>
                        </button>

                        {/* Post Cards */}
                        <div className="space-y-1.5 min-h-[60px]">
                          {dayPosts.map(post => {
                            const pc = platformConfig[post.platform] || platformConfig.instagram;
                            return (
                              <div
                                key={post.id}
                                className={cn('rounded-[var(--app-radius-lg)] p-2 border text-[10px] cursor-pointer transition-colors',
                                  isDark ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-white border-black/[0.04] hover:bg-black/[0.02]'
                                )}
                                onClick={() => setSelectedDate(dateKey)}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={cn('w-1.5 h-1.5 rounded-full', pc.dotColor)} />
                                  <span className={cn('capitalize font-medium', isDark ? pc.textDark : pc.textLight)}>
                                    {post.platform}
                                  </span>
                                </div>
                                <p className="line-clamp-2" style={{ color: 'var(--app-overlay)' }}>
                                  {post.caption}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Selected Day Panel */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn('rounded-[var(--app-radius-xl)] border p-app-xl mt-4', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">
                    {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => setSelectedDate(null)} className={cn('p-1 rounded-[var(--app-radius-lg)] transition-colors',
                    'hover:bg-[var(--app-hover-bg)]'
                  )}>
                    <span className={cn('text-xs', 'text-[var(--app-text-muted)]')}>Close</span>
                  </button>
                </div>
                {selectedDayPosts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayPosts.map(post => (
                      <PostCard key={post.id} post={post} isDark={isDark} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-app-3xl">
                    <CalendarDays className={cn('w-8 h-8 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
                    <p className={cn('text-sm', 'text-[var(--app-text-muted)]')}>No posts scheduled for this day</p>
                    <Button variant="outline" size="sm" className="mt-3 h-8  text-xs gap-1" onClick={handleCreatePost}>
                      <Plus className="w-4 h-4" /> Schedule Post
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Upcoming Posts */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Upcoming
                </h3>
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{upcomingPosts.length} scheduled</Badge>
              </div>
              {upcomingPosts.length > 0 ? (
                <div className="space-y-2">
                  {upcomingPosts.map(post => {
                    const pc = platformConfig[post.platform] || platformConfig.instagram;
                    return (
                      <div
                        key={post.id}
                        className={cn('flex items-start gap-3 p-2.5 rounded-[var(--app-radius-lg)] transition-colors cursor-pointer',
                          'hover:bg-[var(--app-hover-bg)]'
                        )}
                        onClick={() => setSelectedDate(new Date(post.scheduledAt).toDateString())}
                      >
                        <div className={cn('w-8 h-8 rounded-[var(--app-radius-lg)] flex items-center justify-center shrink-0', isDark ? pc.bgDark : pc.bgLight)}>
                          <div className={cn('w-2.5 h-2.5 rounded-full', pc.dotColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{post.caption}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn('text-[10px] capitalize', isDark ? pc.textDark : pc.textLight)}>{post.platform}</span>
                            <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
                              {formatDate(post.scheduledAt)} · {formatTime(post.scheduledAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-app-2xl">
                  <CalendarDays className={cn('w-6 h-6 mx-auto mb-2', 'text-[var(--app-text-disabled)]')} />
                  <p className={cn('text-xs', 'text-[var(--app-text-muted)]')}>No upcoming posts</p>
                </div>
              )}
            </motion.div>

            {/* Platform Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn('rounded-[var(--app-radius-xl)] border p-app-xl', 'bg-[var(--app-card-bg)] border-[var(--app-border)]')}
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Platform Breakdown
              </h3>
              <div className="space-y-2.5">
                {Object.entries(platformConfig).map(([key, pc]) => {
                  const count = filteredPosts.filter(p => p.platform === key).length;
                  const total = Math.max(filteredPosts.length, 1);
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className={cn('w-5 h-5 rounded flex items-center justify-center', isDark ? pc.bgDark : pc.bgLight)}>
                        <div className={cn('w-1.5 h-1.5 rounded-full', pc.dotColor)} />
                      </div>
                      <span className={cn('text-xs w-16 capitalize', 'text-[var(--app-text-secondary)]')}>{pc.label}</span>
                      <div className={cn('flex-1 h-1.5 rounded-full', 'bg-[var(--app-hover-bg)]')}>
                        <div className={cn('h-1.5 rounded-full transition-colors', pc.dotColor)} style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                      <span className={cn('text-[10px] font-medium w-5 text-right tabular-nums', 'text-[var(--app-text-muted)]')}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Content Ideas */}
            <AIContentIdeas isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}
