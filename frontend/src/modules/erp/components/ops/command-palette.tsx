'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  ArrowRight,
  // Icon map for search result types
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
} from 'lucide-react';
import { useErpSearch } from '../../hooks/use-erp-search';
import type { SearchResult } from '../../services/search-engine';

// ── Types ──────────────────────────────────────────────

export interface CommandItem {
  id: string;
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  section: 'pages' | 'actions' | 'recent';
  action: () => void;
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
};

// ── Internal: row model for unified list ──────────────

interface SectionHeader {
  type: 'header';
  key: string;
  label: string;
  count: number;
}

interface SelectableRow {
  type: 'selectable';
  key: string;
  globalIndex: number;
  // For command items (no-query mode)
  commandItem?: CommandItem;
  // For search results (query mode)
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
    // Try fuzzy: find first matching char and highlight from there
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[#cc5c37] font-semibold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

// ── Command Palette ────────────────────────────────────

export function CommandPalette({
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

  // Build flat row list (unified for both query / no-query modes)
  const { rows, selectableItems } = useMemo(() => {
    const builtRows: FlatRow[] = [];
    const items: (CommandItem | SearchResult)[] = [];
    let idx = 0;

    if (hasQuery) {
      // ── Query mode: show search results grouped by type ──
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
    } else {
      // ── No-query mode: show Recent + Pages + Actions ──
      const recent: CommandItem[] = (recentPages ?? [])
        .slice(0, 5)
        .map((rp) => ({
          id: `recent-${rp.id}`,
          icon: rp.icon,
          label: rp.label,
          section: 'recent' as const,
          action: rp.action,
        }));

      const pages = navigateCommands.filter((c) => c.section === 'pages');
      const actions = navigateCommands.filter((c) => c.section === 'actions');

      const addSection = (key: string, label: string, sectionItems: CommandItem[]) => {
        if (sectionItems.length === 0) return;
        builtRows.push({ type: 'header', key, label, count: sectionItems.length });
        for (const item of sectionItems) {
          builtRows.push({
            type: 'selectable',
            key: item.id,
            globalIndex: idx,
            commandItem: item,
          });
          items.push(item);
          idx++;
        }
      };

      addSection('recent', 'Recent', recent);
      addSection('pages', 'Pages', pages);
      addSection('actions', 'Actions', actions);
    }

    return { rows: builtRows, selectableItems: items };
  }, [hasQuery, grouped, navigateCommands, recentPages]);

  // Reset active index when rows change
  useEffect(() => {
    setActiveIndex(0);
  }, [hasQuery, debouncedQuery]);

  // Global ⌘K / Ctrl+K shortcut — toggles open/close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          setQuery('');
          // open is controlled externally, so we rely on external handlers
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
          // It's a SearchResult
          handleSelectSearchResult(item as SearchResult);
        } else if ('section' in item) {
          // It's a CommandItem
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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 top-[15%] z-[101] mx-auto w-full max-w-lg px-4"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: 'var(--ops-card-bg, #222325)',
                border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
              }}
            >
              {/* Search bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: '1px solid var(--ops-border, rgba(255,255,255,0.08))' }}
              >
                {hasQuery ? (
                  // Show loading spinner while debouncing
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                    <Search
                      className="w-5 h-5 absolute"
                      style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.4))' }}
                    />
                    {debouncedQuery !== query && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-t-transparent"
                        style={{ borderColor: 'var(--ops-accent, #cc5c37)', borderTopColor: 'transparent' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>
                ) : (
                  <Search
                    className="w-5 h-5 shrink-0"
                    style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.4))' }}
                  />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasQuery ? 'Search employees, projects, tasks...' : 'Type a command or search...'}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                  style={{ color: 'var(--ops-text, #f5f5f5)' }}
                />
                <kbd
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: 'var(--ops-text-muted, rgba(245,245,245,0.4))',
                    border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
                {/* No results state */}
                {selectableItems.length === 0 && hasQuery && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Search
                      className="w-8 h-8 mb-3"
                      style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.2))' }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.5))' }}
                    >
                      No results for &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.3))' }}
                    >
                      Try searching for employees, projects, tasks, or pages
                    </p>
                  </div>
                )}

                {/* No results when no query (shouldn't happen normally) */}
                {selectableItems.length === 0 && !hasQuery && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p
                      className="text-sm"
                      style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.4))' }}
                    >
                      No commands available
                    </p>
                  </div>
                )}

                {/* Render rows */}
                {rows.map((row) => {
                  if (row.type === 'header') {
                    return (
                      <div
                        key={`s-${row.key}`}
                        className="px-4 py-1.5 flex items-center justify-between"
                      >
                        <span
                          className="text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.3))' }}
                        >
                          {row.label}
                        </span>
                        {hasQuery && (
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              color: 'var(--ops-text-muted, rgba(245,245,245,0.35))',
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

                    return (
                      <button
                        key={`sr-${result.id}`}
                        data-active={isActive ? 'true' : undefined}
                        onClick={() => handleSelectSearchResult(result)}
                        onMouseEnter={() => setActiveIndex(row.globalIndex)}
                        className="flex items-center gap-3 w-full py-2.5 px-4 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isActive
                            ? 'var(--ops-accent-light, rgba(204,92,55,0.1))'
                            : 'transparent',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? 'rgba(204, 92, 55, 0.15)'
                              : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive
                                ? 'var(--ops-accent, #cc5c37)'
                                : 'var(--ops-text-muted, rgba(245,245,245,0.35))',
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-medium truncate"
                            style={{
                              color: isActive
                                ? 'var(--ops-text, #f5f5f5)'
                                : 'var(--ops-text-secondary, rgba(245,245,245,0.7))',
                            }}
                          >
                            <HighlightedText text={result.title} query={debouncedQuery} />
                          </div>
                          <div
                            className="text-[11px] truncate mt-0.5"
                            style={{
                              color: 'var(--ops-text-muted, rgba(245,245,245,0.35))',
                            }}
                          >
                            {result.subtitle}
                          </div>
                        </div>
                        {isActive && (
                          <ArrowRight
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: 'var(--ops-accent, #cc5c37)' }}
                          />
                        )}
                      </button>
                    );
                  }

                  if (row.commandItem) {
                    const item = row.commandItem;
                    const Icon = item.icon;

                    return (
                      <button
                        key={`cmd-${item.id}`}
                        data-active={isActive ? 'true' : undefined}
                        onClick={() => handleSelectCommand(item)}
                        onMouseEnter={() => setActiveIndex(row.globalIndex)}
                        className="flex items-center gap-3 w-full py-2.5 px-4 text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isActive
                            ? 'var(--ops-accent-light, rgba(204,92,55,0.1))'
                            : 'transparent',
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? 'rgba(204, 92, 55, 0.15)'
                              : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isActive
                                ? 'var(--ops-accent, #cc5c37)'
                                : 'var(--ops-text-muted, rgba(245,245,245,0.35))',
                            }}
                          />
                        </div>
                        <span
                          className="flex-1 text-sm font-medium truncate"
                          style={{
                            color: isActive
                              ? 'var(--ops-text, #f5f5f5)'
                              : 'var(--ops-text-secondary, rgba(245,245,245,0.7))',
                          }}
                        >
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <kbd
                            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.06)',
                              color: 'var(--ops-text-muted, rgba(245,245,245,0.35))',
                              border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        {isActive && (
                          <ArrowRight
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: 'var(--ops-accent, #cc5c37)' }}
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
                style={{ borderTop: '1px solid var(--ops-border, rgba(255,255,255,0.08))' }}
              >
                <div
                  className="flex items-center gap-3 text-[11px]"
                  style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.3))' }}
                >
                  <span className="flex items-center gap-1">
                    <kbd
                      className="px-1 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
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
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
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
                    style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.3))' }}
                  >
                    {total} result{total !== 1 ? 's' : ''}
                  </span>
                )}
                <span
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: 'var(--ops-text-muted, rgba(245,245,245,0.3))' }}
                >
                  <kbd
                    className="px-1 py-0.5 rounded font-mono"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--ops-border, rgba(255,255,255,0.08))',
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
}
