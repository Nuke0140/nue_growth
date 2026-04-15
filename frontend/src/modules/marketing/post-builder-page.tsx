'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Upload, ImagePlus, Sparkles, Send, Clock, Calendar,
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  Hash, Type, Eye, ArrowRight, CheckCircle2, Info
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', charLimit: 2200 },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', charLimit: 63206 },
  { id: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2', charLimit: 280 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', charLimit: 3000 },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', charLimit: 5000 },
  { id: 'tiktok', label: 'TikTok', icon: Play, color: '#000000', charLimit: 2200 },
] as const;

const HASHTAG_SUGGESTIONS = [
  '#MadeInIndia', '#Marketing', '#SaaS', '#GrowthHacking', '#DigiNue',
  '#StartupIndia', '#MarTech', '#DigitalMarketing', '#AI', '#Ecommerce',
];

const AI_SUGGESTIONS = [
  '🚀 We just launched something incredible! Our AI-powered analytics suite helps Indian businesses make smarter decisions. Try it free → link in bio #MadeInIndia #AI #SaaS',
  '💡 3 marketing strategies that helped our customers grow 10x this quarter:\n\n1. WhatsApp automation for instant engagement\n2. Multi-touch attribution for smarter spend\n3. AI-driven funnel optimization\n\nWhich one will you try first? 🤔 #GrowthHacking #MarTech',
  'Behind every great marketing team is a great tool. 🛠️ Meet DigiNue — the all-in-one marketing platform built for Indian businesses. From lead gen to retention, we\'ve got you covered. #StartupIndia #DigiNue',
];

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function PostBuilderPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['#DigiNue', '#Marketing']);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('2026-04-15');
  const [scheduledTime, setScheduledTime] = useState('11:30');
  const [mediaUploaded, setMediaUploaded] = useState(false);

  const activePlatform = useMemo(
    () => PLATFORMS.find(p => p.id === selectedPlatform) ?? PLATFORMS[0],
    [selectedPlatform],
  );

  const charCount = caption.length;
  const charExceeded = charCount > activePlatform.charLimit;
  const hashtagStr = hashtags.join(' ');
  const fullCaption = caption + (hashtags.length > 0 ? '\n\n' + hashtagStr : '');

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) setHashtags(prev => [...prev, tag]);
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(h => h !== tag));
  };

  const handleApplySuggestion = (suggestion: string) => {
    setCaption(suggestion);
    setShowAISuggestions(false);
  };

  // ---- Platform Previews ----
  const renderInstagramPreview = () => (
    <div className="rounded-lg overflow-hidden border max-w-[280px]">
      <div className="w-full aspect-square bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
        {mediaUploaded ? (
          <CheckCircle2 className="w-12 h-12 text-white" />
        ) : (
          <ImagePlus className="w-12 h-12 text-white/60" />
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
          <span className="text-xs font-semibold">diginue_official</span>
        </div>
        <p className="text-[11px] leading-relaxed line-clamp-3">
          {fullCaption || 'Your post caption will appear here...'}
        </p>
        <p className="text-[10px] text-gray-400">2 hours ago</p>
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="rounded-lg border max-w-[300px] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">D</div>
        <div>
          <p className="text-xs font-semibold">DigiNue</p>
          <p className="text-[10px] text-gray-400">Sponsored · 2h</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed line-clamp-4">
        {fullCaption || 'Your post content will appear here...'}
      </p>
      {mediaUploaded && (
        <div className="w-full h-32 rounded bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <ImagePlus className="w-8 h-8 text-blue-400" />
        </div>
      )}
      <div className="flex items-center gap-4 pt-1 border-t">
        <span className="text-[10px] text-gray-400 flex items-center gap-1">👍 142</span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">💬 24</span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">🔄 8</span>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="rounded-lg border max-w-[300px] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">D</div>
        <div>
          <p className="text-xs font-semibold">DigiNue <span className="font-normal text-gray-400">@diginue</span></p>
        </div>
      </div>
      <p className={cn('text-xs leading-relaxed', charExceeded ? 'text-red-500' : '')}>
        {fullCaption || 'Your tweet will appear here...'}
      </p>
      {mediaUploaded && (
        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
          <ImagePlus className="w-8 h-8 text-sky-400" />
        </div>
      )}
      <div className="flex items-center gap-4 pt-1 text-gray-400">
        <span className="text-[10px]">💬 12</span>
        <span className="text-[10px]">🔄 34</span>
        <span className="text-[10px]">❤️ 89</span>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="rounded-lg border max-w-[300px] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white text-xs font-bold">D</div>
        <div>
          <p className="text-xs font-semibold">DigiNue</p>
          <p className="text-[10px] text-gray-400">Marketing Automation Platform</p>
        </div>
        <span className="ml-auto text-[10px] text-gray-400">2h · 🌐</span>
      </div>
      <p className="text-xs leading-relaxed line-clamp-5">
        {fullCaption || 'Your LinkedIn post will appear here...'}
      </p>
      {mediaUploaded && (
        <div className="w-full h-32 rounded bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border">
          <ImagePlus className="w-8 h-8 text-blue-300" />
        </div>
      )}
      <div className="flex items-center gap-4 pt-1 text-gray-400">
        <span className="text-[10px]">👍 56</span>
        <span className="text-[10px]">💬 12</span>
        <span className="text-[10px]">🔄 8</span>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'instagram': return renderInstagramPreview();
      case 'facebook': return renderFacebookPreview();
      case 'twitter': return renderTwitterPreview();
      case 'linkedin': return renderLinkedInPreview();
      default: return renderInstagramPreview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
            Social Media Post Builder
          </h1>
          <p className={cn('text-sm mt-1', isDark ? 'text-white/50' : 'text-black/50')}>
            Create, preview, and schedule posts across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-1.5" />
            Save Draft
          </Button>
          <Button size="sm">
            <Send className="w-4 h-4 mr-1.5" />
            Publish
          </Button>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform, i) => {
          const Icon = platform.icon;
          const isActive = selectedPlatform === platform.id;
          return (
            <motion.button
              key={platform.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedPlatform(platform.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-white shadow-lg border border-black/5 text-gray-900'
                  : isDark
                    ? 'bg-white/[0.04] border border-white/[0.06] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
                    : 'bg-black/[0.03] border border-black/[0.06] text-black/50 hover:bg-black/[0.06] hover:text-black/70',
              )}
            >
              <Icon className="w-4 h-4" style={isActive ? { color: platform.color } : {}} />
              {platform.label}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Caption Editor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Type className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
                <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Caption Editor</h3>
              </div>
              <span className={cn('text-xs tabular-nums', charExceeded ? 'text-red-500' : isDark ? 'text-white/40' : 'text-black/40')}>
                {charCount}/{activePlatform.charLimit}
              </span>
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={`Write your ${activePlatform.label} caption here...`}
              rows={6}
              className={cn(
                'w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition',
                isDark
                  ? 'bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/30'
                  : 'bg-black/[0.02] border-black/[0.06] text-gray-900 placeholder:text-black/30',
              )}
            />

            {/* AI Caption Generator */}
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className="w-full border-dashed"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                Generate AI Caption
              </Button>
              {showAISuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  {AI_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySuggestion(s)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition hover:shadow-md',
                        isDark
                          ? 'bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06]'
                          : 'bg-black/[0.01] border-black/[0.06] text-gray-700 hover:bg-black/[0.03]',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Hashtag Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-3">
              <Hash className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Hashtags</h3>
            </div>

            {/* Active Hashtags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                  onClick={() => handleRemoveHashtag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              {hashtags.length === 0 && (
                <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>No hashtags selected</p>
              )}
            </div>

            {/* Suggestions */}
            <p className={cn('text-xs mb-2', isDark ? 'text-white/40' : 'text-black/40')}>Suggested hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {HASHTAG_SUGGESTIONS.filter(h => !hashtags.includes(h)).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleAddHashtag(tag)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-lg border transition hover:shadow-sm',
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.06] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
                      : 'bg-black/[0.03] border-black/[0.06] text-black/50 hover:bg-black/[0.06] hover:text-black/70',
                  )}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Media Upload */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <h3 className={cn('text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Media Upload</h3>
            <button
              onClick={() => setMediaUploaded(!mediaUploaded)}
              className={cn(
                'w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 transition',
                mediaUploaded
                  ? 'border-green-500/50 bg-green-500/5'
                  : isDark
                    ? 'border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02]'
                    : 'border-black/[0.1] hover:border-black/[0.2] hover:bg-black/[0.02]',
              )}
            >
              {mediaUploaded ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <p className={cn('text-sm font-medium', isDark ? 'text-white/70' : 'text-gray-700')}>Media uploaded successfully</p>
                  <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-black/40')}>Click to replace</p>
                </>
              ) : (
                <>
                  <Upload className={cn('w-8 h-8', isDark ? 'text-white/30' : 'text-black/30')} />
                  <p className={cn('text-sm font-medium', isDark ? 'text-white/60' : 'text-black/50')}>
                    Drop files here or click to upload
                  </p>
                  <p className={cn('text-xs', isDark ? 'text-white/30' : 'text-black/30')}>
                    Supports JPG, PNG, GIF, MP4 (max 50MB)
                  </p>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Right Column — Preview & Schedule */}
        <div className="space-y-5">
          {/* Platform Preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                {activePlatform.label} Preview
              </h3>
            </div>
            <div className="flex justify-center">
              {renderPreview()}
            </div>
          </motion.div>

          {/* Best Posting Time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-gray-900')}>AI Recommended Posting Time</h4>
            </div>
            <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>Tuesday 11:30 AM IST</p>
            <p className={cn('text-xs mt-1', isDark ? 'text-white/40' : 'text-black/40')}>
              Based on your audience engagement patterns for {activePlatform.label}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isHot = day === 'Tue';
                const isWarm = day === 'Thu' || day === 'Mon';
                return (
                  <div
                    key={day}
                    className={cn(
                      'text-center py-1.5 rounded-lg text-[10px] font-medium',
                      isHot
                        ? 'bg-green-500/15 text-green-600'
                        : isWarm
                          ? 'bg-amber-500/10 text-amber-600'
                          : isDark ? 'bg-white/[0.03] text-white/30' : 'bg-black/[0.03] text-black/30',
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-5', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-black/50')} />
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>Schedule</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className={cn('text-xs mb-1 block', isDark ? 'text-white/50' : 'text-black/50')}>Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className={cn(
                    'w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30',
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.06] text-white'
                      : 'bg-black/[0.02] border-black/[0.06] text-gray-900',
                  )}
                />
              </div>
              <div>
                <label className={cn('text-xs mb-1 block', isDark ? 'text-white/50' : 'text-black/50')}>Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className={cn(
                    'w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30',
                    isDark
                      ? 'bg-white/[0.03] border-white/[0.06] text-white'
                      : 'bg-black/[0.02] border-black/[0.06] text-gray-900',
                  )}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1" size="sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Schedule
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <Send className="w-4 h-4 mr-1.5" />
                  Publish Now
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('rounded-2xl border p-4', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.06]')}
          >
            <h4 className={cn('text-xs font-semibold mb-3', isDark ? 'text-white' : 'text-gray-900')}>Post Checklist</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Caption written', done: caption.length > 0 },
                { label: 'Hashtags added', done: hashtags.length >= 2 },
                { label: 'Media attached', done: mediaUploaded },
                { label: 'Within character limit', done: !charExceeded },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn('w-4 h-4 rounded-full flex items-center justify-center', item.done ? 'bg-green-500' : isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]')}>
                    {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn('text-xs', item.done ? (isDark ? 'text-white/70' : 'text-gray-700') : (isDark ? 'text-white/30' : 'text-black/30'))}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
