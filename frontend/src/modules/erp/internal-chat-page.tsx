'use client';

import { useState, useMemo, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Hash, Users, FolderOpen, Megaphone, MessageCircle, Pin,
  Paperclip, AtSign, Send, Sparkles, ChevronRight, Info,
  FileText, X, Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PageShell } from './components/ops/page-shell';
import { mockChatChannels, mockChatMessages } from '@/modules/erp/data/mock-data';

function getChannelIcon(type: string) {
  switch (type) {
    case 'department': return Hash;
    case 'project': return FolderOpen;
    case 'announcement': return Megaphone;
    case 'direct': return MessageCircle;
    default: return Hash;
  }
}

function getChannelIconColor(type: string, isDark: boolean) {
  switch (type) {
    case 'department': return isDark ? 'text-sky-400' : 'text-sky-600';
    case 'project': return isDark ? 'text-emerald-500 dark:text-emerald-400' : 'text-emerald-600';
    case 'announcement': return isDark ? 'text-amber-500 dark:text-amber-400' : 'text-amber-600';
    case 'direct': return isDark ? 'text-violet-400' : 'text-violet-600';
    default: return isDark ? 'text-white/40' : 'text-black/40';
  }
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const avatarColors = [
  'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
  'bg-sky-500/15 text-sky-400',
  'bg-violet-500/15 text-violet-400',
  'bg-pink-500/15 text-pink-400',
  'bg-amber-500/15 text-amber-500 dark:text-amber-400',
  'bg-teal-500/15 text-teal-400',
  'bg-orange-500/15 text-orange-400',
  'bg-rose-500/15 text-rose-400',
];

function InternalChatPageInner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeChannel, setActiveChannel] = useState('ch1');
  const [messageInput, setMessageInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const channelsByType = useMemo(() => {
    const groups: Record<string, typeof mockChatChannels> = {};
    const order = ['project', 'department', 'announcement', 'direct'];
    const labels: Record<string, string> = { project: 'Projects', department: 'Departments', announcement: 'Announcements', direct: 'Direct' };
    order.forEach(type => {
      const filtered = mockChatChannels.filter(c => c.type === type);
      if (filtered.length > 0) groups[type] = filtered;
    });
    return { groups, labels };
  }, []);

  const channelMessages = useMemo(() => {
    return mockChatMessages
      .filter(m => m.channelId === activeChannel)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [activeChannel]);

  const pinnedMessages = useMemo(() => {
    return channelMessages.filter(m => m.isPinned);
  }, [channelMessages]);

  const activeChannelData = useMemo(() => {
    return mockChatChannels.find(c => c.id === activeChannel);
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const allUnread = mockChatChannels.reduce((s, c) => s + c.unreadCount, 0);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  return (
    <PageShell title="Internal Chat" icon={MessageSquare} padded={false}>
      {/* Channels Sidebar */}
      <div className={cn('w-64 shrink-0 flex flex-col border-r overflow-hidden', isDark ? 'bg-white/[0.01] border-white/[0.06]' : 'bg-gray-50 border-black/[0.06]')}>
        {/* Sidebar Header */}
        <div className={cn('p-4 border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Channels</h2>
            <button className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
              <Search className={cn('w-3.5 h-3.5', isDark ? 'text-white/40' : 'text-black/40')} />
            </button>
          </div>
          <div className={cn('flex items-center gap-2 px-2.5 py-1.5 rounded-lg border', isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-white border-black/[0.04]')}>
            <input type="text" placeholder="Search channels..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={cn('bg-transparent text-xs focus:outline-none w-full', isDark ? 'text-white/70 placeholder:text-white/20' : 'text-black/70 placeholder:text-black/20')} />
          </div>
        </div>

        {/* Channel List */}
        <div ref={sidebarRef} className="flex-1 overflow-y-auto p-2 space-y-4">
          {Object.entries(channelsByType.groups).map(([type, channels]) => (
            <div key={type}>
              <h3 className={cn('px-2 py-1 text-[10px] uppercase tracking-wider font-bold', isDark ? 'text-white/20' : 'text-black/20')}>
                {channelsByType.labels[type]}
              </h3>
              {channels
                .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(channel => {
                  const Icon = getChannelIcon(channel.type);
                  const isActive = activeChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 mb-0.5',
                        isActive
                          ? isDark ? 'bg-white/[0.06] text-white' : 'bg-black/[0.06] text-black'
                          : isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]' : 'text-black/50 hover:text-black/80 hover:bg-black/[0.03]'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? getChannelIconColor(channel.type, isDark) : (isDark ? 'text-white/30' : 'text-black/30'))} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && (
                            <Badge className={cn('text-[9px] px-1.5 py-0 min-w-[16px] justify-center bg-red-500 text-white border-0')}>{channel.unreadCount}</Badge>
                          )}
                        </div>
                        <p className={cn('text-[10px] truncate mt-0.5', isDark ? 'text-white/25' : 'text-black/25')}>{channel.lastMessage}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className={cn('flex items-center justify-between px-4 py-3 border-b', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
          <div className="flex items-center gap-2">
            {activeChannelData && (
              <>
                {(() => {
                  const Icon = getChannelIcon(activeChannelData.type);
                  return <Icon className={cn('w-4 h-4', getChannelIconColor(activeChannelData.type, isDark))} />;
                })()}
                <div>
                  <h3 className="text-sm font-semibold">{activeChannelData.name}</h3>
                  <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>{activeChannelData.members.length} members</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => {}} className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')} title="AI Summary">
              <Sparkles className={cn('w-4 h-4', isDark ? 'text-purple-400' : 'text-purple-600')} />
            </button>
            <button className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
              <Search className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            </button>
            <button onClick={() => setShowInfo(!showInfo)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
              <Info className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
            </button>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className={cn('px-4 py-2 border-b flex items-center gap-2', isDark ? 'bg-amber-500/[0.03] border-amber-500/10' : 'bg-amber-50 border-amber-200')}>
            <Pin className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className={cn('text-[10px] font-medium', isDark ? 'text-amber-300/60' : 'text-amber-700/60')}>Pinned:</span>
            <p className="text-[11px] truncate flex-1">{pinnedMessages[0].content}</p>
            {pinnedMessages.length > 1 && (
              <span className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-black/30')}>+{pinnedMessages.length - 1}</span>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <MessageCircle className={cn('w-10 h-10 mx-auto', isDark ? 'text-white/10' : 'text-black/10')} />
                <p className={cn('text-sm', isDark ? 'text-white/30' : 'text-black/30')}>No messages yet</p>
              </div>
            </div>
          ) : (
            channelMessages.map((msg, idx) => {
              const isOwn = msg.sender === 'You';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0', avatarColors[idx % avatarColors.length])}>
                    {getInitials(msg.sender)}
                  </div>
                  <div className={cn('max-w-[70%] space-y-1', isOwn && 'text-right')}>
                    <div className={cn('flex items-center gap-2', isOwn && 'flex-row-reverse')}>
                      <span className="text-xs font-semibold">{msg.sender}</span>
                      <span className={cn('text-[10px]', isDark ? 'text-white/20' : 'text-black/20')}>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className={cn(
                      'rounded-2xl rounded-tl-md px-3 py-2 text-sm',
                      isOwn
                        ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                        : isDark ? 'bg-white/[0.06] text-white/90' : 'bg-black/[0.04] text-black/90'
                    )}>
                      <p>{msg.content}</p>
                    </div>
                    {/* Attachments */}
                    {msg.attachments.length > 0 && (
                      <div className="space-y-1 mt-1">
                        {msg.attachments.map(att => (
                          <div key={att.id} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/60' : 'bg-black/[0.02] border-black/[0.06] text-black/60')}>
                            <FileText className="w-3 h-3" />
                            {att.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.isPinned && (
                      <div className="flex items-center gap-1 justify-end">
                        <Pin className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                        <span className="text-[9px] text-amber-500 dark:text-amber-400">Pinned</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className={cn('px-4 py-3 border-t', isDark ? 'border-white/[0.06]' : 'border-black/[0.06]')}>
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
            <button className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
              <Paperclip className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            </button>
            <button className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
              <AtSign className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-black/30')} />
            </button>
            <input
              type="text"
              placeholder={`Message ${activeChannelData?.name || ''}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className={cn('flex-1 bg-transparent text-sm focus:outline-none', isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/80 placeholder:text-black/25')}
            />
            <button
              onClick={handleSend}
              className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors', messageInput.trim() ? (isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90') : (isDark ? 'text-white/20' : 'text-black/20'))}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className={cn('w-0 shrink-0 border-l overflow-hidden', isDark ? 'bg-white/[0.01] border-white/[0.06]' : 'bg-gray-50 border-black/[0.06]')}
        >
          <div className="w-[280px] p-4 space-y-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Channel Info</h3>
              <button onClick={() => setShowInfo(false)} className={cn('w-7 h-7 rounded-lg flex items-center justify-center', isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.06]')}>
                <X className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-black/40')} />
              </button>
            </div>
            {activeChannelData && (
              <>
                <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Channel Name</p>
                  <p className="text-sm font-medium">{activeChannelData.name}</p>
                </div>
                <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Type</p>
                  <p className="text-sm font-medium capitalize">{activeChannelData.type}</p>
                </div>
                <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Members ({activeChannelData.members.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {activeChannelData.members.map((m, i) => (
                      <div key={m} className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold', avatarColors[i % avatarColors.length])}>
                        {m.replace('e', '').toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cn('rounded-xl border p-3 space-y-2', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]')}>
                  <p className={cn('text-[10px] uppercase tracking-wider font-medium', isDark ? 'text-white/30' : 'text-black/30')}>Created</p>
                  <p className="text-sm">Jan 2026</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </PageShell>
  );
}

export default memo(InternalChatPageInner);
