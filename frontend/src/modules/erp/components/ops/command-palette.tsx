'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  ArrowRight,
  User,
  FolderKanban,
  CheckSquare,
  CalendarOff,
  CheckCircle2,
  Monitor,
  LayoutDashboard,
  Sparkles,
  Columns3,
  Network,
  Clock,
  Banknote,
  Wallet,
  BarChart3,
  FolderOpen,
  // New icons for create / action features
  Plus,
  UserPlus,
  ListPlus,
  ShieldCheck,
  ShieldX,
  UserCog,
  Lightbulb,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useErpSearch } from '../../hooks/use-erp-search';
import { useErpStore } from '../../erp-store';
import type { SearchResult } from '../../services/search-engine';
import type { CreateEntityType } from '../../erp-store';

// ── Types ──────────────────────────────────────────────

export interface CommandItem {
  id: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  section: 'pages' | 'actions' | 'recent' | 'quick-create' | 'suggested' | 'ai-suggest';
  action: () => void;
  // Secondary actions for entity results
  secondaryActions?: { label: string; action: () => void }[];
}

interface RecentPage {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  navigateCommands?: CommandItem[];
  recentPages?: RecentPage[];
}

// Icon name → Lucide component map for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  User,
  FolderKanban,
  CheckSquare,
  CalendarOff,
  CheckCircle2,
  Monitor,
  LayoutDashboard,
  Sparkles,
  Columns3,
  Network,
  Clock,
  Banknote,
  Wallet,
  BarChart3,
  FolderOpen,
  Plus,
  UserPlus,
  ListPlus,
  ShieldCheck,
  ShieldX,
  UserCog,
  Lightbulb,
  Zap,
};

// ── Internal: row model for unified list ──────────────

interface SectionHeader {
  type: 'header';
  key: string;
  label: string;
  count: number;
  icon?: LucideIcon;
}

interface SelectableRow {
  type: 'selectable';
  key: string;
  globalIndex: number;
  commandItem?: CommandItem;
  searchResult?: SearchResult;
}

type FlatRow = SectionHeader | SelectableRow;

// ── Highlight matched text ────────────────────────────

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);

  if (idx === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--app-accent)] font-semibold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

// ── Create actions config ──────────────────────────────

const createActions: Array<{ type: CreateEntityType; icon: LucideIcon; label: string; shortcut: string }> = [
  { type: 'project', icon: FolderKanban, label: 'New Project', shortcut: '⌘P' },
  { type: 'task', icon: ListPlus, label: 'New Task', shortcut: '⌘T' },
  { type: 'employee', icon: UserPlus, label: 'Add Employee', shortcut: '⌘E' },
  { type: 'leave', icon: CalendarOff, label: 'Apply Leave', shortcut: '⌘L' },
  { type: 'asset', icon: Monitor, label: 'Add Asset', shortcut: '⌘A' },
];

// ── AI Suggestion definitions ──────────────────────────

const aiSuggestions = [
  { id: 'ai1', label: 'You have 3 overdue tasks — review them now', icon: Clock, actionKeyword: 'overdue' },
  { id: 'ai2', label: 'MediCare project at risk — view details', icon: AlertTriangle, actionKeyword: 'risk' },
  { id: 'ai3', label: 'Nikhil Das at 100% allocation — rebalance', icon: UserCog, actionKeyword: 'allocate' },
];

// ── Command Palette ────────────────────────────────────

export const CommandPalette = React.memo(function CommandPalette({
  open,
  onClose,
  navigateCommands = [],
  recentPages,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const openCreateModal = useErpStore((s) => s.openCreateModal);
  const navigateTo = useErpStore((s) => s.navigateTo);

  // Debounce the search query by 150ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Fuzzy search hook
  const { grouped, total } = useErpSearch(debouncedQuery, 50);
  const hasQuery = debouncedQuery.trim().length > 0;

  // Detect create/action triggers
  const queryLower = query.trim().toLowerCase();
  const isCreateTrigger = ['create', 'new', '+'].some(t => queryLower.startsWith(t));
  const isActionTrigger = ['approve', 'reject', 'assign'].some(t => queryLower.startsWith(t));

  // Build flat row list
  const { rows, selectableItems } = useMemo(() => {
    const builtRows: FlatRow[] = [];
    const items: (CommandItem | SearchResult)[] = [];
    let idx = 0;

    const addSection = (key: string, label: string, sectionItems: CommandItem[], headerIcon?: LucideIcon) => {
      if (sectionItems.length === 0) return;
      builtRows.push({ type: 'header', key, label, count: sectionItems.length, icon: headerIcon });
      for (const item of sectionItems) {
        builtRows.push({ type: 'selectable', key: item.id, globalIndex: idx, commandItem: item });
        items.push(item);
        idx++;
      }
    };

    if (hasQuery) {
      // ── Query mode ──

      // AI Suggestions section (when there's a relevant keyword match)
      if (aiSuggestions.some(s => queryLower.includes(s.actionKeyword))) {
        const matchedAi = aiSuggestions
          .filter(s => queryLower.includes(s.actionKeyword))
          .map(s => ({
            id: `ai-${s.id}`,
            icon: s.icon,
            label: s.label,
            section: 'ai-suggest' as const,
            action: () => navigateTo('tasks-board'),
          }));
        addSection('ai-suggest', 'AI Suggests', matchedAi, Sparkles);
      }

      // Create trigger mode
      if (isCreateTrigger) {
        const filteredCreate = createActions.filter(ca =>
          ca.label.toLowerCase().includes(queryLower) || queryLower === 'create' || queryLower === 'new' || queryLower === '+'
        );
        const createItems = filteredCreate.map(ca => ({
          id: `create-${ca.type}`,
          icon: ca.icon,
          label: ca.label,
          shortcut: ca.shortcut,
          section: 'quick-create' as const,
          action: () => openCreateModal(ca.type),
        }));
        addSection('quick-create', 'Create', createItems, Plus);
      }

      // Action trigger mode
      if (isActionTrigger) {
        const actionItems: CommandItem[] = [];

        if (queryLower.startsWith('approve')) {
          actionItems.push({
            id: 'action-approve-all',
            icon: ShieldCheck,
            label: 'Approve all pending',
            shortcut: '⌘⇧A',
            section: 'actions',
            action: () => navigateTo('approvals'),
          });
          // Also search normally for approvals
        }
        if (queryLower.startsWith('reject')) {
          actionItems.push({
            id: 'action-reject',
            icon: ShieldX,
            label: 'Reject approval...',
            section: 'actions',
            action: () => navigateTo('approvals'),
          });
        }
        if (queryLower.startsWith('assign')) {
          actionItems.push({
            id: 'action-assign',
            icon: UserCog,
            label: 'Assign task to...',
            section: 'actions',
            action: () => navigateTo('tasks-board'),
          });
        }

        addSection('trigger-actions', 'Actions', actionItems, Zap);
      }

      // Show search results (skip if pure create/action trigger with no additional text)
      const isPureCreate = ['create', 'new', '+'].includes(queryLower);
      const isPureAction = ['approve', 'reject', 'assign'].includes(queryLower);

      if (!isPureCreate && !isPureAction) {
        const groupOrder = ['Pages', 'Employees', 'Projects', 'Tasks', 'Leaves', 'Approvals', 'Assets'];
        for (const groupLabel of groupOrder) {
          const groupItems = grouped[groupLabel];
          if (!groupItems || groupItems.length === 0) continue;

          builtRows.push({
            type: 'header',
            key: `header-${groupLabel}`,
            label: groupLabel,
            count: groupItems.length,
          });

          for (const result of groupItems) {
            builtRows.push({
              type: 'selectable',
              key: result.id,
              globalIndex: idx,
              searchResult: result,
            });
            items.push(result);
            idx++;
          }
        }
      }
    } else {
      // ── No-query mode: Recent + Suggested + Quick Create + Pages + Actions ──
      const recent: CommandItem[] = (recentPages ?? [])
        .slice(0, 3)
        .map((rp) => ({
          id: `recent-${rp.id}`,
          icon: rp.icon,
          label: rp.label,
          section: 'recent' as const,
          action: rp.action,
        }));

      const suggestedActions: CommandItem[] = [
        {
          id: 'sug-approve',
          icon: ShieldCheck,
          label: 'Review pending approvals',
          section: 'suggested' as const,
          action: () => navigateTo('approvals'),
        },
        {
          id: 'sug-tasks',
          icon: CheckSquare,
          label: 'View overdue tasks',
          section: 'suggested' as const,
          action: () => navigateTo('tasks-board'),
        },
        {
          id: 'sug-payroll',
          icon: Banknote,
          label: 'Run monthly payroll',
          section: 'suggested' as const,
          action: () => navigateTo('payroll'),
        },
        {
          id: 'sug-ai',
          icon: Sparkles,
          label: 'AI Ops Intelligence',
          section: 'suggested' as const,
          action: () => navigateTo('ai-ops'),
        },
      ];

      const quickCreateItems: CommandItem[] = createActions.map(ca => ({
        id: `qc-${ca.type}`,
        icon: ca.icon,
        label: ca.label,
        shortcut: ca.shortcut,
        section: 'quick-create' as const,
        action: () => openCreateModal(ca.type),
      }));

      const pages = navigateCommands.filter((c) => c.section === 'pages');
      const actions = navigateCommands.filter((c) => c.section === 'actions');

      addSection('recent', 'Recent', recent, Clock);
      addSection('suggested', 'Suggested Actions', suggestedActions, Lightbulb);
      addSection('quick-create', 'Quick Create', quickCreateItems, Plus);
      addSection('pages', 'Pages', pages);
      addSection('actions', 'Actions', actions);
    }

    return { rows: builtRows, selectableItems: items };
  }, [hasQuery, grouped, navigateCommands, recentPages, queryLower, isCreateTrigger, isActionTrigger, openCreateModal, navigateTo]);

  // Reset active index when rows change
  useEffect(() => {
    setActiveIndex(0);
  }, [hasQuery, debouncedQuery]);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          setQuery('');
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Focus input on open, reset on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setDebouncedQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelectCommand = useCallback((item: CommandItem) => {
    onClose();
    item.action();
  }, [onClose]);

  const handleSelectSearchResult = useCallback((result: SearchResult) => {
    onClose();
    result.action();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % selectableItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + selectableItems.length) % selectableItems.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = selectableItems[activeIndex];
        if (!item) return;
        if ('type' in item && (item as SearchResult).type) {
          handleSelectSearchResult(item as SearchResult);
        } else if ('section' in item) {
          handleSelectCommand(item as CommandItem);
        }
      }
    },
    [selectableItems, activeIndex, handleSelectCommand, handleSelectSearchResult]
  );

  // Get the Lucide icon for a search result
  const getResultIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Search;
  };

  // Get secondary actions for search results
  const getSecondaryActions = (result: SearchResult): Array<{ label: string; action: () => void }> => {
    switch (result.type) {
      case 'project':
        return [
          { label: 'View Details', action: result.action },
          { label: 'Set at Risk', action: () => navigateTo('projects') },
        ];
      case 'employee':
        return [
          { label: 'View Profile', action: result.action },
          { label: 'Assign Task', action: () => { openCreateModal('task'); } },
        ];
      case 'task':
        return [
          { label: 'View Task', action: result.action },
          { label: 'Mark Complete', action: () => navigateTo('tasks-board') },
        ];
      default:
        return [];
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-[var(--app-overlay)] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 top-[12%] z-[101] mx-auto w-full max-w-lg px-4"
          >
            <div
              className="rounded-[var(--app-radius-xl)] overflow-hidden shadow-[var(--app-shadow-md)]-2xl"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                border: '1px solid var(--app-border-strong)',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
            >
              {/* Search bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: '1px solid var(--app-border-strong)' }}
              >
                {hasQuery ? (
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                    <Search
                      className="w-5 h-5 absolute"
                      style={{ color: 'var(--app-text-muted)' }}
                    />
                    {debouncedQuery !== query && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: 'var(--app-accent)', borderTopColor: 'transparent' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>
                ) : (
                  <Search
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--app-text-muted)' }}
                  />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search commands"
                  aria-activedescendant={rows.find(r => r.type === 'selectable' && r.globalIndex === activeIndex)?.key || undefined}
                  placeholder={
                    isCreateTrigger
                      ? 'What do you want to create?'
                      : isActionTrigger
                        ? 'Describe the action...'
                        : hasQuery
                          ? 'Search employees, projects, tasks...'
                          : 'Type a command or search... (try "create", "approve")'
                  }
                  className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                  style={{ color: 'var(--app-text)' }}
                />
                <kbd
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    backgroundColor: 'var(--app-hover-bg)',
                    color: 'var(--app-text-muted)',
                    border: '1px solid var(--app-border-strong)',
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[420px] overflow-y-auto py-2 custom-scrollbar" role="listbox" aria-label="Search results">
                {/* No results state */}
                {selectableItems.length === 0 && hasQuery && (
                  <div className="flex flex-col items-center justify-center py-app-4xl">
                    <Search
                      className="w-8 h-8 mb-3"
                      style={{ color: 'var(--app-text-disabled)' }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--app-text-secondary)' }}
                    >
                      No results for &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--app-text-muted)' }}
                    >
                      Try searching for employees, projects, tasks, or pages
                    </p>
                  </div>
                )}

                {/* No results when no query */}
                {selectableItems.length === 0 && !hasQuery && (
                  <div className="flex flex-col items-center justify-center py-app-4xl">
                    <p
                      className="text-sm"
                      style={{ color: 'var(--app-text-muted)' }}
                    >
                      No commands available
                    </p>
                  </div>
                )}

                {/* Render rows */}
                {rows.map((row) => {
                  if (row.type === 'header') {
                    const HeaderIcon = row.icon;
                    return (
                      <div
                        key={`s-${row.key}`}
                        className="px-4 py-1.5 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--app-text-muted)' }}
                        >
                          {HeaderIcon && <HeaderIcon className="w-4 h-4" />}
                          {row.label}
                          {row.label === 'AI Suggests' && (
                            <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />
                          )}
                        </span>
                        {hasQuery && (
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'var(--app-hover-bg)',
                              color: 'var(--app-text-muted)',
                            }}
                          >
                            {row.count}
                          </span>
                        )}
                      </div>
                    );
                  }

                  const isActive = row.globalIndex === activeIndex;

                  if (row.searchResult) {
                    const result = row.searchResult;
                    const Icon = getResultIcon(result.icon);
                    const secondaryActions = getSecondaryActions(result);

                    return (
                      <button
                        key={`sr-${result.id}`}
                        id={result.id}
                        data-active={isActive ? 'true' : undefined}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelectSearchResult(result)}
                        onMouseEnter={() => setActiveIndex(row.globalIndex)}
                        className="flex items-start gap-3 w-full py-2.5 px-4 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isActive
                            ? 'var(--app-accent-light)'
                            : 'transparent',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] shrink-0 mt-0.5"
                          style={{
                            backgroundColor: isActive
                              ? 'var(--app-accent-light)'
                              : 'var(--app-hover-bg)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive
                                ? 'var(--app-accent)'
                                : 'var(--app-text-muted)',
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-medium truncate"
                            style={{
                              color: isActive
                                ? 'var(--app-text)'
                                : 'var(--app-text-secondary)',
                            }}
                          >
                            <HighlightedText text={result.title} query={debouncedQuery} />
                          </div>
                          <div
                            className="text-[11px] truncate mt-0.5"
                            style={{
                              color: 'var(--app-text-muted)',
                            }}
                          >
                            {result.subtitle}
                          </div>
                          {/* Secondary Actions */}
                          {secondaryActions.length > 0 && isActive && (
                            <div className="flex gap-2 mt-1.5">
                              {secondaryActions.map((sa, saIdx) => (
                                <button
                                  key={saIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const close = onClose;
                                    close();
                                    sa.action();
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded-[var(--app-radius-md)] bg-[var(--app-hover-bg)] text-[var(--app-text-secondary)] hover:text-[var(--app-accent)] hover:bg-[var(--app-accent-light)] transition-colors"
                                >
                                  {sa.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <ArrowRight
                            className="w-4 h-4 shrink-0 mt-1"
                            style={{ color: 'var(--app-accent)' }}
                          />
                        )}
                      </button>
                    );
                  }

                  if (row.commandItem) {
                    const item = row.commandItem;
                    const Icon = item.icon;
                    const isAiSection = item.section === 'ai-suggest';

                    return (
                      <button
                        key={`cmd-${item.id}`}
                        id={item.id}
                        data-active={isActive ? 'true' : undefined}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelectCommand(item)}
                        onMouseEnter={() => setActiveIndex(row.globalIndex)}
                        className="flex items-center gap-3 w-full py-2.5 px-4 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isActive
                            ? 'var(--app-accent-light)'
                            : 'transparent',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-[var(--app-radius-lg)] shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? 'var(--app-accent-light)'
                              : isAiSection
                                ? 'var(--app-accent-light)'
                                : 'var(--app-hover-bg)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive
                                ? 'var(--app-accent)'
                                : isAiSection
                                  ? 'var(--app-accent)'
                                  : 'var(--app-text-muted)',
                            }}
                          />
                        </div>
                        <span
                          className="flex-1 text-sm font-medium truncate"
                          style={{
                            color: isActive
                              ? 'var(--app-text)'
                              : isAiSection
                                ? 'var(--app-text)'
                                : 'var(--app-text-secondary)',
                          }}
                        >
                          {item.label}
                        </span>
                        {isAiSection && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'var(--app-accent-light)',
                              color: 'var(--app-accent)',
                            }}
                          >
                            AI
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd
                            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              backgroundColor: 'var(--app-hover-bg)',
                              color: 'var(--app-text-muted)',
                              border: '1px solid var(--app-border-strong)',
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        {isActive && !isAiSection && (
                          <ArrowRight
                            className="w-4 h-4 shrink-0"
                            style={{ color: 'var(--app-accent)' }}
                          />
                        )}
                      </button>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Footer hints */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: '1px solid var(--app-border-strong)' }}
              >
                <div
                  className="flex items-center gap-3 text-[11px]"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  <span className="flex items-center gap-1">
                    <kbd
                      className="px-1 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'var(--app-hover-bg)',
                        border: '1px solid var(--app-border-strong)',
                      }}
                    >
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd
                      className="px-1 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'var(--app-hover-bg)',
                        border: '1px solid var(--app-border-strong)',
                      }}
                    >
                      ↵
                    </kbd>
                    Select
                  </span>
                </div>
                {hasQuery && total > 0 && (
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--app-text-muted)' }}
                  >
                    {total} result{total !== 1 ? 's' : ''}
                  </span>
                )}
                <span
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: 'var(--app-text-muted)' }}
                >
                  <kbd
                    className="px-1 py-0.5 rounded font-mono"
                    style={{
                      backgroundColor: 'var(--app-hover-bg)',
                      border: '1px solid var(--app-border-strong)',
                    }}
                  >
                    esc
                  </kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
