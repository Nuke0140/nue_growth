'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import { mockNotes } from '@/modules/crm-sales/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { CrmNote, NoteType } from '@/modules/crm-sales/system/types';
import {
  Search, Plus, Pin, Lock, FileText, Users, Phone,
  MessageCircle, Sparkles, History, Clock, User, MoreHorizontal,
  StickyNote, Inbox,
} from 'lucide-react';

const noteTypeConfig: Record<NoteType, { label: string; color: string; bg: string }> = {
  meeting: { label: 'Meeting Notes', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  general: { label: 'General', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  call_log: { label: 'Call Log', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  proposal: { label: 'Proposal', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  voice_transcript: { label: 'Voice Transcript', color: 'text-teal-400', bg: 'bg-teal-500/10' },
};

const filterChips: { key: string; label: string; icon?: React.ElementType }[] = [
  { key: 'all', label: 'All' },
  { key: 'meeting', label: 'Meeting Notes', icon: Users },
  { key: 'call_log', label: 'Call Logs', icon: Phone },
  { key: 'proposal', label: 'Proposals', icon: FileText },
  { key: 'general', label: 'General' },
  { key: 'voice_transcript', label: 'Voice Transcripts', icon: MessageCircle },
  { key: 'pinned', label: 'Pinned', icon: Pin },
  { key: 'private', label: 'Private', icon: Lock },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatRelative(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date('2026-04-09T12:00:00');
  const diff = now.getTime() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return `${Math.round(hours * 60)}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export default function NotesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const selectContact = useCrmSalesStore((s) => s.selectContact);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNote, setSelectedNote] = useState<CrmNote | null>(null);

  const filtered = useMemo(() => {
    let data = [...mockNotes].sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    if (activeFilter === 'pinned') {
      data = data.filter((n) => n.isPinned);
    } else if (activeFilter === 'private') {
      data = data.filter((n) => n.isPrivate);
    } else if (activeFilter !== 'all') {
      data = data.filter((n) => n.type === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.contactName?.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
      );
    }

    return data;
  }, [searchQuery, activeFilter]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className={cn('text-2xl font-bold', 'text-[var(--app-text)]')}>
              Notes
            </h1>
            <p className={cn('text-sm mt-0.5', 'text-[var(--app-text-muted)]')}>
              {filtered.length} notes • {mockNotes.filter((n) => n.isPinned).length} pinned
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl border',
              'bg-[var(--app-hover-bg)] border-[var(--app-border)]'
            )}>
              <Search className={cn('w-4 h-4', 'text-[var(--app-text-muted)]')} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-40',
                  'text-[var(--app-text)] placeholder:text-[var(--app-text-muted)]'
                )}
              />
            </div>
            <Button
              size="sm"
              className={cn(
                'rounded-xl text-xs h-9 px-4',
                'bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-bg-hover)]'
              )}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                activeFilter === chip.key
                  ? isDark
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-black/[0.06] text-black'
                  : isDark
                    ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                    : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
              )}
            >
              {chip.icon && <chip.icon className="w-3.5 h-3.5" />}
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Content */}
      <ScrollArea className="flex-1 px-6 pb-6">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
              'bg-[var(--app-hover-bg)]'
            )}>
              <StickyNote className={cn('w-7 h-7', 'text-[var(--app-text-disabled)]')} />
            </div>
            <p className={cn('text-sm font-medium', 'text-[var(--app-text-muted)]')}>
              No notes yet
            </p>
            <p className={cn('text-xs mt-1', 'text-[var(--app-text-muted)]')}>
              Create your first note to get started
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((note, i) => {
              const typeConfig = noteTypeConfig[note.type];
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => setSelectedNote(note)}
                  className={cn(
                    'rounded-2xl p-5 transition-all duration-200 cursor-pointer group relative',
                    isDark
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
                      : 'bg-white border border-black/[0.06] hover:border-black/[0.12] hover:bg-black/[0.01] shadow-sm'
                  )}
                >
                  {/* Pin indicator */}
                  {note.isPinned && (
                    <div className="absolute top-3 right-3">
                      <Pin className={cn(
                        'w-3.5 h-3.5 fill-current',
                        isDark ? 'text-amber-400' : 'text-amber-500'
                      )} />
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2 pr-6">
                    <h3 className={cn(
                      'text-sm font-semibold leading-tight flex-1',
                      'text-[var(--app-text)]'
                    )}>
                      {note.title}
                    </h3>
                    {note.isPrivate && (
                      <Lock className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        'text-[var(--app-text-disabled)]'
                      )} />
                    )}
                  </div>

                  {/* Content preview */}
                  <p className={cn(
                    'text-xs leading-relaxed mb-3 line-clamp-3',
                    'text-[var(--app-text-muted)]'
                  )}>
                    {note.content}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-[10px] px-2 py-0 h-4 font-medium', typeConfig.bg, typeConfig.color)}>
                        {typeConfig.label}
                      </Badge>
                      {note.version > 1 && (
                        <span className={cn('text-[10px]', 'text-[var(--app-text-disabled)]')}>
                          v{note.version}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className={cn('w-3 h-3', 'text-[var(--app-text-disabled)]')} />
                      <span className={cn('text-[10px]', 'text-[var(--app-text-muted)]')}>
                        {formatRelative(note.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <Separator className={cn('my-3', 'bg-[var(--app-hover-bg)]')} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                        isDark ? 'bg-white/[0.08] text-white/50' : 'bg-black/[0.06] text-black/50'
                      )}>
                        {note.author.charAt(0)}
                      </div>
                      <span className={cn('text-[11px]', 'text-[var(--app-text-muted)]')}>
                        {note.author}
                      </span>
                    </div>
                    {note.contactName && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (note.contactId) selectContact(note.contactId);
                        }}
                        className={cn(
                          'text-[11px] font-medium transition-colors',
                          isDark
                            ? 'text-purple-400/60 hover:text-purple-300'
                            : 'text-purple-600/60 hover:text-purple-500'
                        )}
                      >
                        {note.contactName}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Note Detail Dialog */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className={cn(
          'max-w-2xl max-h-[85vh] overflow-y-auto',
          isDark ? 'bg-[#111] border-white/[0.06]' : 'bg-white border-black/[0.06]'
        )}>
          {selectedNote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn(
                    'text-[10px] px-2 py-0 h-5 font-medium',
                    noteTypeConfig[selectedNote.type].bg,
                    noteTypeConfig[selectedNote.type].color
                  )}>
                    {noteTypeConfig[selectedNote.type].label}
                  </Badge>
                  {selectedNote.isPinned && <Pin className={cn('w-3.5 h-3.5 text-amber-400 fill-current')} />}
                  {selectedNote.isPrivate && <Lock className={cn('w-3.5 h-3.5', 'text-[var(--app-text-muted)]')} />}
                  {selectedNote.version > 1 && (
                    <Badge variant="outline" className={cn(
                      'text-[10px] px-1.5 py-0 h-5',
                      isDark ? 'border-white/10 text-white/30' : 'border-black/10 text-black/30'
                    )}>
                      v{selectedNote.version}
                    </Badge>
                  )}
                </div>
                <DialogTitle className={cn('text-[var(--app-text)]')}>
                  {selectedNote.title}
                </DialogTitle>
                <DialogDescription className={cn('text-[var(--app-text-muted)]')}>
                  By {selectedNote.author} • Updated {formatRelative(selectedNote.updatedAt)}
                </DialogDescription>
              </DialogHeader>

              {/* Note content */}
              <div className={cn(
                'rounded-xl p-4 text-sm leading-relaxed',
                isDark ? 'bg-white/[0.03] text-white/70' : 'bg-black/[0.02] text-black/70'
              )}>
                {selectedNote.content}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'rounded-lg text-xs gap-1.5',
                    isDark
                      ? 'border-white/[0.08] text-white/60 hover:bg-white/[0.06]'
                      : 'border-black/[0.08] text-black/60 hover:bg-black/[0.04]'
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  AI Summary
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'rounded-lg text-xs gap-1.5',
                    isDark
                      ? 'border-white/[0.08] text-white/60 hover:bg-white/[0.06]'
                      : 'border-black/[0.08] text-black/60 hover:bg-black/[0.04]'
                  )}
                >
                  <History className="w-3.5 h-3.5" />
                  Version History
                </Button>
                {selectedNote.contactName && (
                  <button
                    onClick={() => selectedNote.contactId && selectContact(selectedNote.contactId)}
                    className={cn(
                      'ml-auto text-xs font-medium',
                      isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
                    )}
                  >
                    View {selectedNote.contactName} →
                  </button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
