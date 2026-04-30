'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCrmSalesStore } from '@/modules/crm-sales/system/store';
import type { CrmSalesPage } from '@/modules/crm-sales/system/types';
import {
  User, Building2, UserPlus, Handshake, CalendarPlus, FileText, CheckSquare,
  Users, TrendingUp, Activity, Brain, Target, GitBranch, DollarSign,
  BarChart3, Clock, Phone, Mail, ArrowRight, Command, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section: string;
  action: () => void;
}

/* ── Static command definitions ── */

const QUICK_CREATE: CommandItem[] = [
  { id: 'create-contact', label: 'New Contact', icon: User, section: 'Quick Create', action: () => {} },
  { id: 'create-company', label: 'New Company', icon: Building2, section: 'Quick Create', action: () => {} },
  { id: 'create-lead', label: 'New Lead', icon: UserPlus, section: 'Quick Create', action: () => {} },
  { id: 'create-deal', label: 'New Deal', icon: Handshake, section: 'Quick Create', action: () => {} },
  { id: 'create-activity', label: 'New Activity', icon: CalendarPlus, section: 'Quick Create', action: () => {} },
  { id: 'create-note', label: 'New Note', icon: FileText, section: 'Quick Create', action: () => {} },
  { id: 'create-task', label: 'New Task', icon: CheckSquare, section: 'Quick Create', action: () => {} },
];

const PAGES: CommandItem[] = [
  { id: 'contacts', label: 'Contacts', icon: Users, section: 'Pages', action: () => {} },
  { id: 'companies', label: 'Companies', icon: Building2, section: 'Pages', action: () => {} },
  { id: 'leads', label: 'Leads', icon: TrendingUp, section: 'Pages', action: () => {} },
  { id: 'deals', label: 'Deals', icon: Handshake, section: 'Pages', action: () => {} },
  { id: 'deals-pipeline', label: 'Pipeline', icon: GitBranch, section: 'Pages', action: () => {} },
  { id: 'activities', label: 'Activities', icon: Activity, section: 'Pages', action: () => {} },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, section: 'Pages', action: () => {} },
  { id: 'notes', label: 'Notes', icon: FileText, section: 'Pages', action: () => {} },
  { id: 'followups', label: 'Follow-ups', icon: Clock, section: 'Pages', action: () => {} },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, section: 'Pages', action: () => {} },
  { id: 'sales-forecast', label: 'Forecast', icon: BarChart3, section: 'Pages', action: () => {} },
  { id: 'segments', label: 'Segments', icon: Target, section: 'Pages', action: () => {} },
  { id: 'lifecycle', label: 'Lifecycle', icon: GitBranch, section: 'Pages', action: () => {} },
];

const AI_SUGGESTIONS: CommandItem[] = [
  { id: 'ai-overdue', label: 'Overdue follow-ups', icon: Brain, section: 'AI Suggestions', action: () => {} },
  { id: 'ai-pipeline-risk', label: 'Pipeline at risk', icon: Brain, section: 'AI Suggestions', action: () => {} },
  { id: 'ai-stale-leads', label: 'Stale leads to re-engage', icon: Brain, section: 'AI Suggestions', action: () => {} },
];

const STAGE_MOVE_OPTIONS: CommandItem[] = [
  { id: 'move-prospecting', label: 'Prospecting', icon: Target, section: 'Move to Stage', action: () => {} },
  { id: 'move-discovery', label: 'Discovery', icon: Search, section: 'Move to Stage', action: () => {} },
  { id: 'move-qualification', label: 'Qualification', icon: CheckSquare, section: 'Move to Stage', action: () => {} },
  { id: 'move-proposal', label: 'Proposal', icon: FileText, section: 'Move to Stage', action: () => {} },
  { id: 'move-negotiation', label: 'Negotiation', icon: Handshake, section: 'Move to Stage', action: () => {} },
  { id: 'move-won', label: 'Closed Won', icon: DollarSign, section: 'Move to Stage', action: () => {} },
  { id: 'move-lost', label: 'Closed Lost', icon: Activity, section: 'Move to Stage', action: () => {} },
];

const FOLLOWUP_OPTIONS: CommandItem[] = [
  { id: 'followup-call', label: 'Call follow-up', icon: Phone, section: 'Follow-up Type', action: () => {} },
  { id: 'followup-email', label: 'Email follow-up', icon: Mail, section: 'Follow-up Type', action: () => {} },
  { id: 'followup-meeting', label: 'Meeting follow-up', icon: CalendarPlus, section: 'Follow-up Type', action: () => {} },
  { id: 'followup-note', label: 'Note follow-up', icon: FileText, section: 'Follow-up Type', action: () => {} },
  { id: 'followup-task', label: 'Task follow-up', icon: CheckSquare, section: 'Follow-up Type', action: () => {} },
];

const LOG_OPTIONS: CommandItem[] = [
  { id: 'log-call', label: 'Log Call', icon: Phone, section: 'Log Activity', action: () => {} },
  { id: 'log-email', label: 'Log Email', icon: Mail, section: 'Log Activity', action: () => {} },
  { id: 'log-meeting', label: 'Log Meeting', icon: CalendarPlus, section: 'Log Activity', action: () => {} },
  { id: 'log-note', label: 'Log Note', icon: FileText, section: 'Log Activity', action: () => {} },
  { id: 'log-task', label: 'Log Task', icon: CheckSquare, section: 'Log Activity', action: () => {} },
];

const ALL_ITEMS = [...QUICK_CREATE, ...PAGES, ...AI_SUGGESTIONS];

function CrmCommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, navigateTo, addRecentCommand } = useCrmSalesStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset state when opening
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Detect navigation prefixes
  const trimmedQuery = query.trim().toLowerCase();
  const isCreatePrefix = trimmedQuery.startsWith('create ') || trimmedQuery.startsWith('new ') || trimmedQuery.startsWith('+');
  const isMovePrefix = trimmedQuery.startsWith('move ') || trimmedQuery.startsWith('/');
  const isFollowupPrefix = trimmedQuery.startsWith('followup ');
  const isLogPrefix = trimmedQuery.startsWith('log ');

  // Determine which items to show based on prefix
  const visibleItems = useMemo(() => {
    if (isCreatePrefix) return QUICK_CREATE;
    if (isMovePrefix) return STAGE_MOVE_OPTIONS;
    if (isFollowupPrefix) return FOLLOWUP_OPTIONS;
    if (isLogPrefix) return LOG_OPTIONS;

    if (!trimmedQuery) return ALL_ITEMS;

    return ALL_ITEMS.filter(item =>
      item.label.toLowerCase().includes(trimmedQuery)
    );
  }, [trimmedQuery, isCreatePrefix, isMovePrefix, isFollowupPrefix, isLogPrefix]);

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of visibleItems) {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    }
    return groups;
  }, [visibleItems]);

  // Reset active index when filtered results change
  useEffect(() => {
    setActiveIndex(0);
  }, [visibleItems.length]);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback((item: CommandItem) => {
    // Try to navigate if it's a page
    const pageItems = new Set(PAGES.map(p => p.id));
    if (pageItems.has(item.id)) {
      navigateTo(item.id as CrmSalesPage);
    }
    addRecentCommand({ id: item.id, label: item.label });
    setCommandPaletteOpen(false);
  }, [navigateTo, addRecentCommand, setCommandPaletteOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % visibleItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + visibleItems.length) % visibleItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (visibleItems[activeIndex]) {
          handleSelect(visibleItems[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setCommandPaletteOpen(false);
        break;
    }
  }, [visibleItems, activeIndex, handleSelect, setCommandPaletteOpen]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Global index for flat list
  let globalIdx = 0;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-[580px] mx-4 rounded-2xl border shadow-2xl overflow-hidden',
              isDark
                ? 'bg-[#1a1a1a] border-white/[0.08]'
                : 'bg-white border-black/[0.08]'
            )}
          >
            {/* Search Input */}
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 border-b',
              isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
            )}>
              <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-white/30' : 'text-black/30')} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search contacts, deals, actions..."
                className={cn(
                  'bg-transparent text-sm focus:outline-none w-full placeholder:opacity-40',
                  isDark ? 'text-white' : 'text-black'
                )}
              />
              <kbd className={cn(
                'shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border',
                isDark ? 'bg-white/[0.06] text-white/30 border-white/[0.08]' : 'bg-black/[0.04] text-black/30 border-black/[0.08]'
              )}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[360px] overflow-y-auto py-2"
              style={{ scrollbarWidth: 'thin' }}
            >
              {Object.entries(groupedItems).length === 0 ? (
                <div className={cn('py-12 text-center', isDark ? 'text-white/30' : 'text-black/30')}>
                  <p className="text-sm">No results found</p>
                  <p className="text-xs mt-1 opacity-60">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedItems).map(([section, items]) => (
                  <div key={section} className="mb-1">
                    <div className={cn(
                      'px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider',
                      isDark ? 'text-white/25' : 'text-black/25'
                    )}>
                      {section}
                    </div>
                    {items.map((item) => {
                      const currentIndex = globalIdx++;
                      const isActive = currentIndex === activeIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          data-active={isActive}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setActiveIndex(currentIndex)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            isActive
                              ? isDark
                                ? 'bg-white/[0.08] text-white'
                                : 'bg-black/[0.06] text-black'
                              : isDark
                                ? 'text-white/60 hover:text-white/80 hover:bg-white/[0.03]'
                                : 'text-black/60 hover:text-black/80 hover:bg-black/[0.02]'
                          )}
                        >
                          <Icon className={cn(
                            'w-4 h-4 shrink-0',
                            isActive
                              ? isDark ? 'text-white/80' : 'text-black/80'
                              : isDark ? 'text-white/30' : 'text-black/30'
                          )} />
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <ArrowRight className={cn(
                              'w-3 h-3 ml-auto shrink-0',
                              isDark ? 'text-white/40' : 'text-black/40'
                            )} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className={cn(
              'flex items-center justify-between px-4 py-2 border-t text-[10px]',
              isDark ? 'border-white/[0.06] text-white/25' : 'border-black/[0.06] text-black/25'
            )}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'px-1 py-0.5 rounded border font-mono text-[9px]',
                    isDark ? 'border-white/[0.08] bg-white/[0.04]' : 'border-black/[0.08] bg-black/[0.04]'
                  )}>
                    <Command className="w-2 h-2 inline" />K
                  </kbd>
                  <span>to open</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'px-1 py-0.5 rounded border font-mono text-[9px]',
                    isDark ? 'border-white/[0.08] bg-white/[0.04]' : 'border-black/[0.08] bg-black/[0.04]'
                  )}>↑↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className={cn(
                    'px-1 py-0.5 rounded border font-mono text-[9px]',
                    isDark ? 'border-white/[0.08] bg-white/[0.04]' : 'border-black/[0.08] bg-black/[0.04]'
                  )}>↵</kbd>
                  <span>select</span>
                </span>
              </div>
              <span className="font-medium">CRM & Sales</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(CrmCommandPalette);
